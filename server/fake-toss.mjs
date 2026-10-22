// Development stand-in for the Toss Open API: same paths and response shapes as the
// official spec (openapi.json examples), generated prices. Lets the local bridge be
// tested without keys. Also enforces the documented per-group rate limits (429).
//
// Run: npm run toss:fake   then   TOSS_BASE_URL=http://127.0.0.1:3299 npm run toss
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

const LIMIT = { AUTH: 5, STOCK: 5, MARKET_INFO: 3, MARKET_DATA: 15, MARKET_DATA_CHART: 20, RANKING: 5 };
const hits = {};
function limited(group) {
  const now = Date.now(); hits[group] = (hits[group] || []).filter(t => now - t < 1000); hits[group].push(now);
  return hits[group].length > LIMIT[group];
}
const counts = {};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x"), p = url.pathname, q = url.searchParams;
  const json = (status, body) => { res.writeHead(status, { "Content-Type": "application/json", ...(status === 429 ? { "Retry-After": "1" } : {}) }); res.end(JSON.stringify(body)); };
  const group = p === "/oauth2/token" ? "AUTH" : p.startsWith("/api/v1/market-calendar") ? "MARKET_INFO" : p === "/api/v1/rankings" ? "RANKING" : p === "/api/v1/candles" ? "MARKET_DATA_CHART" : p === "/api/v1/prices" ? "MARKET_DATA" : "STOCK";
  counts[group] = (counts[group] || 0) + 1;
  if (limited(group)) { console.log("429", group); return json(429, { error: { code: "too-many-requests", message: "rate limited" } }); }
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
    const r = rnd(s.symbol * 1), t0 = Date.parse(`${today}T09:00:00+09:00`); let px = s.days.at(-2).c; const bars = [];
    for (let i = 0; i < count; i++) { const o = px, c = o * (1 + (r() - 0.49) * 0.004); bars.push({ timestamp: new Date(t0 + i * 60e3).toISOString(), openPrice: fmt(o), highPrice: fmt(Math.max(o, c) * 1.001), lowPrice: fmt(Math.min(o, c) * 0.999), closePrice: fmt(c), volume: String(Math.round(1000 + r() * 20000)), currency: "KRW" }); px = c; }
    return json(200, { result: { candles: bars.reverse(), nextBefore: null } });
  }
  if (p === "/__counts") return json(200, counts);
  json(404, { error: { code: "not-found" } });
}).listen(PORT, "127.0.0.1", () => console.log(`[fake-toss] http://127.0.0.1:${PORT}`));
