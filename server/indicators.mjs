// Turns Toss Open API data for one stock into Rulemate condition values.
// Keys match data/conditions.json; a condition missing here has no real data yet
// and the app shows it as "준비 중".

const avg = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const pct = (a, b) => (b ? (a / b - 1) * 100 : 0);

/** Wilder RSI over closes in ascending order. */
export function rsi(closes, n = 14) {
  if (closes.length <= n) return null;
  let gain = 0, loss = 0;
  for (let i = 1; i <= n; i++) { const d = closes[i] - closes[i - 1]; if (d > 0) gain += d; else loss -= d; }
  gain /= n; loss /= n;
  for (let i = n + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    gain = (gain * (n - 1) + Math.max(d, 0)) / n;
    loss = (loss * (n - 1) + Math.max(-d, 0)) / n;
  }
  return loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
}

const sma = (closes, end, n) => (end + 1 >= n ? avg(closes.slice(end + 1 - n, end + 1)) : null);
const std = a => { const m = avg(a); return Math.sqrt(avg(a.map(x => (x - m) ** 2))); };

/**
 * @param q   { price, basePrice, volume, amount } — today's quote (rankings or prices)
 * @param day daily candles, newest first (Toss order), numbers already parsed
 * @param master stock master row ({ listDate, sharesOutstanding })
 * @param ctx { today: 'YYYY-MM-DD', sessionFraction: 0..1 share of the regular session elapsed, flagged: bool }
 */
export function metrics(q, day, master, ctx) {
  const asc = day.slice().reverse();
  const last = asc[asc.length - 1];
  const hasToday = !!last && last.date === ctx.today;
  // Close series with today's live price as the latest close.
  const bars = hasToday ? asc.slice(0, -1).concat([{ ...last, close: q.price }]) : asc.concat([]);
  const closes = bars.map(b => b.close);
  const n = closes.length - 1;
  const prevBars = hasToday ? asc.slice(0, -1) : asc;
  const today = hasToday ? last : null;
  const price = q.price, base = q.basePrice || (prevBars.length ? prevBars[prevBars.length - 1].close : price);
  const m = {};

  m.price = price; m.priceMax = price;
  m.chg = pct(price, base);
  if (q.amount != null) m.turnover = q.amount / 1e8; // 억 원
  if (q.amount && q.volume) m.vwap = pct(price, q.amount / q.volume);

  if (today) {
    const hi = Math.max(today.high, price), lo = Math.min(today.low, price), range = hi - lo;
    m.gap = pct(today.open, base);
    m.dayPos = range > 0 ? ((price - lo) / range) * 100 : 50;
    m.dayRange = (range / base) * 100;
    m.upWick = range > 0 ? ((hi - Math.max(today.open, price)) / range) * 100 : 0;
    m.loWick = range > 0 ? ((Math.min(today.open, price) - lo) / range) * 100 : 0;
  }

  // Average true range (14) as % of price, and today's range against it.
  if (bars.length > 15) {
    const tr = [];
    for (let i = bars.length - 14; i < bars.length; i++) {
      const b = bars[i], pc = bars[i - 1].close;
      tr.push(Math.max(b.high - b.low, Math.abs(b.high - pc), Math.abs(b.low - pc)));
    }
    m.atr = (avg(tr) / price) * 100;
    if (m.dayRange != null && m.atr > 0) m.volRatio = m.dayRange / m.atr;
  }

  // Relative volume vs. the same share of an average day (last 20 completed days).
  const vols = prevBars.slice(-20).map(b => b.volume).filter(v => v > 0);
  const todayVol = q.volume ?? (today ? today.volume : null);
  if (vols.length >= 5 && todayVol != null) m.volx = todayVol / (avg(vols) * Math.max(0.05, ctx.sessionFraction));

  const ma5 = sma(closes, n, 5), ma20 = sma(closes, n, 20), ma60 = sma(closes, n, 60);
  if (ma5) m.ma5 = pct(price, ma5);
  if (ma20) m.disp = pct(price, ma20);
  if (ma5 && ma20 && ma60) m.align = ma5 > ma20 && ma20 > ma60;
  const pma5 = sma(closes, n - 1, 5), pma20 = sma(closes, n - 1, 20);
  if (ma5 && ma20 && pma5 && pma20) m.golden = pma5 <= pma20 && ma5 > ma20;

  const r = rsi(closes); if (r != null) m.rsi = r;
  if (bars.length >= 14) {
    const w = bars.slice(-14), hh = Math.max(...w.map(b => b.high), price), ll = Math.min(...w.map(b => b.low), price);
    m.stoch = hh > ll ? ((price - ll) / (hh - ll)) * 100 : 50;
  }
  if (closes.length >= 20) {
    const w = closes.slice(-20), sd = std(w), mid = avg(w);
    m.bbUp = price > mid + 2 * sd;
    if (closes.length >= 80) {
      const widths = [];
      for (let e = closes.length - 60; e < closes.length; e++) { const ww = closes.slice(e - 19, e + 1); widths.push((4 * std(ww)) / avg(ww)); }
      m.squeeze = widths[widths.length - 1] <= Math.min(...widths) * 1.02;
    }
  }
  if (prevBars.length >= 60) m.newHigh = price > Math.max(...prevBars.slice(-60).map(b => b.high));

  // Big candles within the last 5 sessions (today included): body of ±4% or more.
  const recent = bars.slice(-5);
  m.bigUp = recent.some(b => pct(b.close, b.open) >= 4);
  m.bigRed = recent.some(b => pct(b.close, b.open) <= -4);

  // Period returns (21 / 63 / 126 trading days ≈ 1 / 3 / 6 months).
  for (const [k, d] of [["r1m", 21], ["r3m", 63], ["r6m", 126]]) if (closes.length > d) m[k] = pct(price, closes[closes.length - 1 - d]);

  m.limitUp = pct(base * 1.3, price); // KRX daily limit is ±30% of the base price
  if (master) {
    const shares = Number(master.sharesOutstanding);
    if (shares > 0) m.mcap = (price * shares) / 1e8; // 억 원
    if (master.listDate) m.listed = Math.max(0, Math.round((Date.parse(ctx.today) - Date.parse(master.listDate)) / 864e5));
  }
  m.admin = !!ctx.flagged;
  return m;
}
