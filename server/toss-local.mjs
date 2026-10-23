// Local-only bridge to the Toss Securities Open API (personal use).
//
// Toss terms (오픈 API 서비스 이용 약관 제5조): quotes are for the account holder's own
// trading only — no providing them to others. So this server:
//   - listens on 127.0.0.1 only and answers only pages served from localhost,
//   - keeps the client secret here (read from .env.local, never sent to the browser),
//   - calls read-only market-data APIs (no account, order or conditional-order APIs).
// With DART_API_KEY it also keeps today's OpenDART filings for the disclosure alerts (server/dart.mjs),
// and with NAVER_CLIENT_ID/SECRET it searches recent news for watched stocks (server/news.mjs).
//
// Run: npm run toss     (needs TOSS_CLIENT_ID / TOSS_CLIENT_SECRET in .env.local)
import http from "node:http";
import { metrics } from "./indicators.mjs";
import { dartConfigured, ensureFresh, filingsFor, hasFilingToday } from "./dart.mjs";
import { newsConfigured, newsFor } from "./news.mjs";

const PORT = Number(process.env.TOSS_LOCAL_PORT || 3200);
const BASE = process.env.TOSS_BASE_URL || "https://openapi.tossinvest.com";
const CLIENT_ID = process.env.TOSS_CLIENT_ID || "";
const CLIENT_SECRET = process.env.TOSS_CLIENT_SECRET || "";
const UNIVERSE = 100; // top stocks by trading amount (rankings API max)
const DAILY_BARS = 130; // enough for 6-month return and 60-day averages

// ---- Toss API client -------------------------------------------------------

class TossError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

// Requests per second per rate-limit group (docs: overview.md › Rate Limits), with a margin.
const TPS = { AUTH: 5, STOCK: 5, MARKET_INFO: 3, MARKET_DATA: 15, MARKET_DATA_CHART: 20, RANKING: 5 };
const nextSlot = {};
async function throttle(group) {
  const gap = 1000 / ((TPS[group] || 1) * 0.9), now = Date.now();
  const at = Math.max(now, nextSlot[group] || 0);
  nextSlot[group] = at + gap;
  if (at > now) await new Promise(r => setTimeout(r, at - now));
}

let token = null; // { value, expiresAt }
async function accessToken() {
  if (token && token.expiresAt > Date.now() + 5 * 60e3) return token.value;
  await throttle("AUTH");
  const res = await fetch(BASE + "/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });
  if (!res.ok) throw await tossError(res);
  const j = await res.json();
  token = { value: j.access_token, expiresAt: Date.now() + (j.expires_in || 3600) * 1000 };
  return token.value;
}

async function tossError(res) {
  let code = "http-" + res.status, message = "";
  try { const j = await res.json(); code = j.error?.code || code; message = j.error?.message || ""; } catch {}
  if (res.status === 403) message = "토스증권 Open API 허용 IP에 이 컴퓨터의 IP가 없거나, 권한이 없어요. " + message;
  if (res.status === 401) { token = null; message = "토스증권 인증에 실패했어요. .env.local의 TOSS_CLIENT_ID·TOSS_CLIENT_SECRET을 확인해 주세요. " + message; }
  return new TossError(res.status, code, message.trim());
}

async function get(path, params, group) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "").map(([k, v]) => [k, String(v)]));
  for (let attempt = 0; ; attempt++) {
    await throttle(group);
    const res = await fetch(`${BASE}${path}?${qs}`, { headers: { Authorization: "Bearer " + (await accessToken()) } });
    if (res.status === 429 && attempt < 3) {
      const wait = Number(res.headers.get("Retry-After")) || 2 ** attempt;
      await new Promise(r => setTimeout(r, wait * 1000 + Math.random() * 200));
      continue;
    }
    if (!res.ok) throw await tossError(res);
    return (await res.json()).result;
  }
}

const num = v => (v == null || v === "" ? null : Number(v));
const chunks = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

// ---- Market session ---------------------------------------------------------

const kstDate = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(d); // YYYY-MM-DD
const kstTime = (d = new Date()) => new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);

let calendar = null; // { fetchedAt, value }
async function session() {
  if (!calendar || Date.now() - calendar.fetchedAt > 10 * 60e3) calendar = { fetchedAt: Date.now(), value: await get("/api/v1/market-calendar/KR", {}, "MARKET_INFO") };
  const today = calendar.value?.today, reg = today?.integrated?.regularMarket, now = Date.now();
  const isToday = today?.date === kstDate() && !!reg;
  if (!isToday) return { state: "holiday", fraction: 1, today: kstDate() };
  const open = Date.parse(reg.startTime), close = Date.parse(reg.endTime);
  const state = now < open ? "pre" : now >= close ? "closed" : "open";
  const fraction = state === "pre" ? 0 : state === "closed" ? 1 : (now - open) / (close - open);
  return { state, fraction, today: today.date, openAt: reg.startTime, closeAt: reg.endTime };
}

// ---- Snapshot: universe + quotes + condition values -------------------------

async function rankings(exclude, duration) {
  const r = await get("/api/v1/rankings", { type: "MARKET_TRADING_AMOUNT", marketCountry: "KR", duration, count: UNIVERSE, excludeInvestmentCaution: exclude }, "RANKING");
  return r?.rankings || [];
}

async function dailyBars(symbol) {
  const r = await get("/api/v1/candles", { symbol, interval: "1d", count: DAILY_BARS, adjusted: true }, "MARKET_DATA_CHART");
  return (r?.candles || []).map(c => ({ date: c.timestamp.slice(0, 10), open: num(c.openPrice), high: num(c.highPrice), low: num(c.lowPrice), close: num(c.closePrice), volume: num(c.volume) }));
}

const seedOf = code => [...code].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 9973, 7) + 1;
const MARKET_KO = { KOSPI: "코스피", KOSDAQ: "코스닥" };
const nameOf = new Map(); // stock code -> company name, from the stock master (used for news search)

async function buildSnapshot(extraSymbols) {
  const ses = await session();
  const duration = ses.state === "open" ? "realtime" : "1d";
  let all = await rankings(false, duration);
  if (!all.length && duration === "realtime") all = await rankings(false, "1d");
  const safe = new Set((await rankings(true, all.length ? duration : "1d")).map(r => r.symbol));
  const quote = new Map(all.map(r => [r.symbol, { price: num(r.price?.lastPrice), basePrice: num(r.price?.basePrice), volume: num(r.tradingVolume), amount: num(r.tradingAmount), flagged: !safe.has(r.symbol) }]));

  const extras = extraSymbols.filter(s => !quote.has(s));
  const symbols = [...quote.keys(), ...extras];
  const master = new Map();
  for (const part of chunks(symbols, 200)) for (const m of (await get("/api/v1/stocks", { symbols: part.join(",") }, "STOCK")) || []) { master.set(m.symbol, m); if (m.name) nameOf.set(m.symbol, m.name); }

  // Universe: common stocks on KOSPI/KOSDAQ (no ETF/ETN/REIT). Extras (journal stocks) are kept as is.
  const keep = symbols.filter(s => extras.includes(s) || (master.get(s)?.securityType === "STOCK" && MARKET_KO[master.get(s)?.market]));

  // Extras are not in the rankings: price them from the prices API and check warnings.
  for (const part of chunks(extras, 200)) for (const p of (await get("/api/v1/prices", { symbols: part.join(",") }, "MARKET_DATA")) || []) quote.set(p.symbol, { price: num(p.lastPrice), basePrice: null, volume: null, amount: null, flagged: false });
  for (const s of extras) {
    const w = (await get(`/api/v1/stocks/${s}/warnings`, {}, "STOCK")) || [];
    const q = quote.get(s); if (q) q.flagged = w.some(x => !x.endDate || x.endDate >= ses.today);
  }

  const stocks = [], skipped = [];
  for (const s of keep) {
    const q = quote.get(s), m = master.get(s);
    if (!q || !(q.price > 0)) { skipped.push(s); continue; }
    try {
      const day = await dailyBars(s);
      if (q.basePrice == null) { const prev = day.find(b => b.date < ses.today); q.basePrice = prev ? prev.close : q.price; const t = day.find(b => b.date === ses.today); if (t) q.volume = t.volume; }
      const flagged = q.flagged || !!m?.koreanMarketDetail?.liquidationTrading || !!m?.koreanMarketDetail?.krxTradingSuspended;
      const v = metrics(q, day, m, { today: ses.today, sessionFraction: ses.fraction, flagged });
      stocks.push({
        code: s, name: m?.name || s, mkt: MARKET_KO[m?.market] || m?.market || "", real: true, seed: seedOf(s),
        price: q.price, chg: v.chg, to: v.turnover ?? 0, vx: v.volx ?? 0, vw: v.vwap ?? 0, m5: v.ma5 ?? 0, gp: v.gap ?? 0, rsi: v.rsi ?? 50, br: !!v.bigRed, ad: !!v.admin,
        m: v,
      });
    } catch (e) {
      if (e instanceof TossError && (e.status === 401 || e.status === 403)) throw e;
      skipped.push(s);
    }
  }
  // "회사 발표 (공시 당일)" condition from OpenDART, when a key is set.
  const dart = { configured: dartConfigured(), error: null };
  if (dart.configured) {
    try { await ensureFresh(); for (const st of stocks) st.m.disc = hasFilingToday(st.code); }
    catch (e) { dart.error = e.message; }
  }
  return { source: "toss", asOf: new Date().toISOString(), asOfLabel: kstTime(), session: ses.state, today: ses.today, stocks, skipped, dart };
}

let cache = null; // { key, at, promise }
function snapshot(extra) {
  const key = extra.slice().sort().join(","), ttl = cache?.session === "open" ? 60e3 : 10 * 60e3;
  if (cache && cache.key === key && Date.now() - cache.at < ttl) return cache.promise;
  const promise = buildSnapshot(extra);
  cache = { key, at: Date.now(), promise, session: null };
  promise.then(v => { if (cache?.promise === promise) cache.session = v.session; }, () => { if (cache?.promise === promise) cache = null; });
  return promise;
}

const candleCache = new Map();
async function intradayBars(symbol) {
  const hit = candleCache.get(symbol);
  if (hit && Date.now() - hit.at < 30e3) return hit.bars;
  const r = await get("/api/v1/candles", { symbol, interval: "1m", count: 200 }, "MARKET_DATA_CHART");
  const bars = (r?.candles || []).map(c => ({ t: c.timestamp, o: num(c.openPrice), h: num(c.highPrice), l: num(c.lowPrice), c: num(c.closePrice), v: num(c.volume) })).reverse();
  candleCache.set(symbol, { at: Date.now(), bars });
  return bars;
}

// ---- HTTP -------------------------------------------------------------------

const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const LOCAL_HOST = new RegExp(`^(localhost|127\\.0\\.0\\.1):${PORT}$`);
const SYMBOL = /^[A-Za-z0-9.-]{1,12}$/;

function send(res, status, body, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  // Only this computer's Rulemate page may read the data (blocks other sites and DNS rebinding).
  if (!LOCAL_HOST.test(req.headers.host || "") || (origin && !LOCAL_ORIGIN.test(origin))) return send(res, 403, { error: { code: "forbidden", message: "local only" } });
  if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Origin": origin || "", "Access-Control-Allow-Methods": "GET" }); return res.end(); }
  if (req.method !== "GET") return send(res, 405, { error: { code: "method-not-allowed" } }, origin);
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true, configured: !!(CLIENT_ID && CLIENT_SECRET), dart: dartConfigured(), news: newsConfigured() }, origin);
    if (url.pathname === "/news") {
      if (!newsConfigured()) return send(res, 200, { configured: false, items: [] }, origin);
      // Names come from the stock master, not from the page: only stocks seen in a snapshot.
      const stocks = (url.searchParams.get("codes") || "").split(",").filter(s => SYMBOL.test(s) && nameOf.has(s)).slice(0, 30).map(code => ({ code, name: nameOf.get(code) }));
      return send(res, 200, { configured: true, asOf: new Date().toISOString(), items: await newsFor(stocks) }, origin);
    }
    if (url.pathname === "/disclosures") {
      if (!dartConfigured()) return send(res, 200, { configured: false, items: [] }, origin);
      const codes = (url.searchParams.get("codes") || "").split(",").filter(s => SYMBOL.test(s)).slice(0, 300);
      await ensureFresh();
      return send(res, 200, { configured: true, asOf: new Date().toISOString(), items: filingsFor(codes) }, origin);
    }
    if (!CLIENT_ID || !CLIENT_SECRET) return send(res, 503, { error: { code: "not-configured", message: ".env.local에 TOSS_CLIENT_ID와 TOSS_CLIENT_SECRET을 넣어 주세요." } }, origin);
    if (url.pathname === "/snapshot") {
      const extra = (url.searchParams.get("extra") || "").split(",").filter(s => SYMBOL.test(s)).slice(0, 50);
      return send(res, 200, await snapshot(extra), origin);
    }
    if (url.pathname === "/candles") {
      const symbol = url.searchParams.get("symbol") || "";
      if (!SYMBOL.test(symbol)) return send(res, 400, { error: { code: "invalid-symbol" } }, origin);
      return send(res, 200, { symbol, bars: await intradayBars(symbol) }, origin);
    }
    return send(res, 404, { error: { code: "not-found" } }, origin);
  } catch (e) {
    const status = e instanceof TossError ? 502 : 500;
    console.error(`[toss-local] ${url.pathname}: ${e.code || ""} ${e.message}`);
    return send(res, e.code?.startsWith?.("dart-") || e.code?.startsWith?.("news-") ? 502 : status, { error: { code: e.code || "internal", message: e.message } }, origin);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[toss-local] http://127.0.0.1:${PORT} · ${BASE === "https://openapi.tossinvest.com" ? "토스증권 Open API" : BASE} · 토스 키 ${CLIENT_ID && CLIENT_SECRET ? "설정됨" : "없음 (.env.local 확인)"} · DART 키 ${dartConfigured() ? "설정됨" : "없음 (공시 알림 꺼짐)"} · 네이버 키 ${newsConfigured() ? "설정됨" : "없음 (뉴스 알림 꺼짐)"}`);
});
