// Development stand-in for the Toss Open API: same paths and response shapes as the
// official spec (openapi.json examples), generated prices. Lets the local bridge be
// tested without keys. Also enforces the documented per-group rate limits (429).
//
// Also serves OpenDART list.json (공시검색) and a Google News RSS search for the same fake companies.
// Run: npm run toss:fake   then   TOSS_BASE_URL=http://127.0.0.1:3299 DART_BASE_URL=http://127.0.0.1:3299 npm run toss
import http from "node:http";

const PORT = Number(process.env.FAKE_TOSS_PORT || 3299);
const N = 130;
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());

const STOCKS = Array.from({ length: N }, (_, i) => {
  const r = rnd(1000 + i * 7919), symbol = String(100000 + i * 37).slice(0, 6);
  const type = i % 17 === 5 ? "ETF" : i % 23 === 7 ? "ETN" : "STOCK";
  const base = Math.round(1000 + r() * 150000);
  const days = []; let p = base * (0.7 + r() * 0.5);
  for (let d = 200; d >= 0; d--) {
    const dt = new Date(Date.parse(today) - d * 864e5); if ([0, 6].includes(dt.getUTCDay())) continue;
    const o = p, c = Math.max(100, o * (1 + (r() - 0.48) * 0.06)), h = Math.max(o, c) * (1 + r() * 0.02), l = Math.min(o, c) * (1 - r() * 0.02);
    days.push({ date: dt.toISOString().slice(0, 10), o, h, l, c, v: Math.round(2e5 + r() * 5e6) }); p = c;
  }
  return { symbol, name: `가짜종목${i + 1}`, market: i % 2 ? "KOSDAQ" : "KOSPI", type, days, caution: i % 19 === 3, shares: Math.round(1e7 + r() * 5e8) };
});
const bySymbol = new Map(STOCKS.map(s => [s.symbol, s]));
const fmt = n => String(Math.round(n));

const LIMIT = { NEWS: 5, DART: 20, AUTH: 5, STOCK: 5, MARKET_INFO: 3, MARKET_DATA: 15, MARKET_DATA_CHART: 20, RANKING: 5 };
const hits = {};
function limited(group) {
  const now = Date.now(); hits[group] = (hits[group] || []).filter(t => now - t < 1000); hits[group].push(now);
  return hits[group].length > LIMIT[group];
}
const counts = {};

// OpenDART filings: today and yesterday, newest first, incl. KONEX/unlisted ones the bridge must skip.
const TITLES = ["단일판매ㆍ공급계약체결", "[기재정정]단일판매ㆍ공급계약체결", "주식등의대량보유상황보고서(일반)", "임원ㆍ주요주주특정증권등소유상황보고서", "자기주식취득결정", "유상증자결정", "현금ㆍ현물배당결정", "연결재무제표기준영업(잠정)실적(공정공시)", "투자판단관련주요경영사항", "기업설명회(IR)개최(안내공시)"];
const ymd8 = d => d.replaceAll("-", "");
let filings = [];
function makeFilings() {
  const yest = new Date(Date.parse(today) - 864e5).toISOString().slice(0, 10), r = rnd(4242);
  for (const [day, n] of [[today, 140], [yest, 90]]) for (let i = 0; i < n; i++) {
    const s = STOCKS[Math.floor(r() * STOCKS.length)], cls = i % 13 === 0 ? "N" : i % 17 === 0 ? "E" : s.market === "KOSPI" ? "Y" : "K";
    filings.push({ corp_cls: cls, corp_name: s.name, corp_code: String(10000000 + i), stock_code: cls === "E" ? "" : s.symbol, report_nm: TITLES[Math.floor(r() * TITLES.length)], rcept_no: ymd8(day) + String(800000 - i).padStart(6, "0"), flr_nm: s.name, rcept_dt: ymd8(day), rm: cls === "Y" ? "유" : "코" });
  }
  filings.sort((a, b) => b.rcept_no.localeCompare(a.rcept_no));
}
makeFilings();
let newFilingSeq = 0;

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x"), p = url.pathname, q = url.searchParams;
  const json = (status, body) => { res.writeHead(status, { "Content-Type": "application/json", ...(status === 429 ? { "Retry-After": "1" } : {}) }); res.end(JSON.stringify(body)); };
  const group = p === "/rss/search" ? "NEWS" : p === "/api/list.json" ? "DART" : p === "/oauth2/token" ? "AUTH" : p.startsWith("/api/v1/market-calendar") ? "MARKET_INFO" : p === "/api/v1/rankings" ? "RANKING" : p === "/api/v1/candles" ? "MARKET_DATA_CHART" : p === "/api/v1/prices" ? "MARKET_DATA" : "STOCK";
  counts[group] = (counts[group] || 0) + 1;
  if (limited(group)) { console.log("429", group); return json(429, { error: { code: "too-many-requests", message: "rate limited" } }); }
  if (p === "/api/list.json") {
    if (q.get("crtfc_key") !== "fake-dart-key") return json(200, { status: "010", message: "등록되지 않은 키입니다." });
    // Each call may add a brand-new filing at the top, like a live feed.
    if (Math.random() < 0.5) { const s = STOCKS[newFilingSeq % STOCKS.length]; filings.unshift({ corp_cls: s.market === "KOSPI" ? "Y" : "K", corp_name: s.name, corp_code: "99" + newFilingSeq, stock_code: s.symbol, report_nm: TITLES[newFilingSeq % TITLES.length], rcept_no: ymd8(today) + String(900000 + ++newFilingSeq).padStart(6, "0"), flr_nm: s.name, rcept_dt: ymd8(today), rm: "" }); }
    const inRange = filings.filter(f => f.rcept_dt >= q.get("bgn_de") && f.rcept_dt <= q.get("end_de"));
    const per = Number(q.get("page_count") || 10), no = Number(q.get("page_no") || 1), total = Math.max(1, Math.ceil(inRange.length / per));
    if (!inRange.length) return json(200, { status: "013", message: "조회된 데이타가 없습니다." });
    return json(200, { status: "000", message: "정상", page_no: no, page_count: per, total_count: inRange.length, total_page: total, list: inRange.slice((no - 1) * per, no * per) });
  }
  if (p === "/rss/search") { // two headlines per company from the last day, like news.google.com/rss/search
    const name = (q.get("q") || "").match(/"([^"]+)"/)?.[1] || "", r = rnd(name.length * 997 + 13);
    const items = STOCKS.some(s => s.name === name) ? [0, 1].map(i => { const at = new Date(Date.now() - (i * 7 + r() * 5) * 3600e3).toUTCString(), src = ["가짜일보", "모의경제"][i]; return `<item><title>${name}, ${["신규 계약 소식", "3분기 실적 발표"][i]} - ${src}</title><link>https://example.com/news/${encodeURIComponent(name)}/${i}</link><pubDate>${at}</pubDate><source url="https://example.com">${src}</source></item>`; }) : [];
    res.writeHead(200, { "Content-Type": "application/rss+xml; charset=utf-8" });
    return res.end(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${name}</title>${items.join("")}</channel></rss>`);
  }
  if (p === "/oauth2/token") return json(200, { access_token: "fake-token", token_type: "Bearer", expires_in: 86400 });
  if (req.headers.authorization !== "Bearer fake-token") return json(401, { error: { code: "invalid-token", message: "" } });
  if (p === "/api/v1/market-calendar/KR") return json(200, { result: { today: { date: today, integrated: { regularMarket: { startTime: `${today}T09:00:00+09:00`, endTime: `${today}T15:30:00+09:00` } } } } });
  if (p === "/api/v1/rankings") {
    const ex = q.get("excludeInvestmentCaution") === "true";
    const list = STOCKS.filter(s => !(ex && s.caution)).map(s => { const t = s.days.at(-1), prev = s.days.at(-2); return { s, t, prev, amt: t.c * t.v }; }).sort((a, b) => b.amt - a.amt).slice(0, Number(q.get("count") || 100));
    return json(200, { result: { rankedAt: new Date().toISOString(), rankings: list.map((x, i) => ({ rank: i + 1, symbol: x.s.symbol, currency: "KRW", price: { lastPrice: fmt(x.t.c), basePrice: fmt(x.prev.c), changeRate: String(x.t.c / x.prev.c - 1) }, tradingVolume: String(x.t.v), tradingAmount: fmt(x.amt) })) } });
  }
  if (p === "/api/v1/stocks") return json(200, { result: (q.get("symbols") || "").split(",").map(s => bySymbol.get(s)).filter(Boolean).map(s => ({ symbol: s.symbol, name: s.name, market: s.market, securityType: s.type, isCommonShare: true, status: "ACTIVE", currency: "KRW", listDate: "2015-03-02", sharesOutstanding: String(s.shares), koreanMarketDetail: { liquidationTrading: false, krxTradingSuspended: false } })) });
  if (p === "/api/v1/prices") return json(200, { result: (q.get("symbols") || "").split(",").map(s => bySymbol.get(s)).filter(Boolean).map(s => ({ symbol: s.symbol, timestamp: new Date().toISOString(), lastPrice: fmt(s.days.at(-1).c), currency: "KRW" })) });
  const w = p.match(/^\/api\/v1\/stocks\/([^/]+)\/warnings$/);
  if (w) return json(200, { result: bySymbol.get(w[1])?.caution ? [{ warningType: "INVESTMENT_WARNING", exchange: "KRX", startDate: today, endDate: null }] : [] });
  if (p === "/api/v1/candles") {
    const s = bySymbol.get(q.get("symbol")); if (!s) return json(404, { error: { code: "stock-not-found" } });
    const count = Math.min(200, Number(q.get("count") || 200));
    if (q.get("interval") === "1d") return json(200, { result: { candles: s.days.slice(-count).reverse().map(d => ({ timestamp: `${d.date}T00:00:00+09:00`, openPrice: fmt(d.o), highPrice: fmt(d.h), lowPrice: fmt(d.l), closePrice: fmt(d.c), volume: String(d.v), currency: "KRW" })), nextBefore: null } });
    // One-minute bars for today from 08:00 (NXT pre-market) to now, capped at 20:00, newest first,
    // paged with `before` (inclusive) / nextBefore like the real API.
    const r = rnd(Number(s.symbol)), t0 = Date.parse(`${today}T08:00:00+09:00`), tEnd = Math.min(Date.now(), Date.parse(`${today}T20:00:00+09:00`));
    let px = s.days.at(-2).c; const all = [];
    for (let t = t0; t <= tEnd; t += 60e3) { const o = px, c = o * (1 + (r() - 0.49) * 0.004); all.push({ timestamp: new Date(t).toISOString(), openPrice: fmt(o), highPrice: fmt(Math.max(o, c) * 1.001), lowPrice: fmt(Math.min(o, c) * 0.999), closePrice: fmt(c), volume: String(Math.round(1000 + r() * 20000)), currency: "KRW" }); px = c; }
    const before = q.get("before") ? Date.parse(q.get("before")) : Infinity;
    const page = all.filter(b => Date.parse(b.timestamp) <= before).reverse().slice(0, count);
    const oldest = page.at(-1);
    return json(200, { result: { candles: page, nextBefore: oldest && Date.parse(oldest.timestamp) > t0 ? new Date(Date.parse(oldest.timestamp) - 60e3).toISOString() : null } });
  }
  if (p === "/__counts") return json(200, counts);
  if (p === "/__add-filing") { // test hook: a new filing for one company, e.g. /__add-filing?symbol=100000&title=자기주식취득결정
    const s = bySymbol.get(q.get("symbol")); if (!s) return json(404, {});
    filings.unshift({ corp_cls: s.market === "KOSPI" ? "Y" : "K", corp_name: s.name, corp_code: "77" + newFilingSeq, stock_code: s.symbol, report_nm: q.get("title") || "자기주식취득결정", rcept_no: ymd8(today) + String(950000 + ++newFilingSeq).padStart(6, "0"), flr_nm: s.name, rcept_dt: ymd8(today), rm: "" });
    return json(200, { ok: true, rcept_no: filings[0].rcept_no });
  }
  json(404, { error: { code: "not-found" } });
}).listen(PORT, "127.0.0.1", () => console.log(`[fake-toss] http://127.0.0.1:${PORT}`));
