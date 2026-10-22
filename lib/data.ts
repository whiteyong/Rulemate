import conditions from "../data/conditions.json";
import sampleStocks from "../data/sample_stocks.json";
import tokens from "../data/tokens.json";

export type Theme = typeof tokens.A_light;

export type Stock = {
  code: string; name: string; mkt: string; price: number; chg: number; to: number; vx: number;
  vw: number; m5: number; gp: number; rsi: number; br: boolean; ad: boolean; seed: number;
  /** Real data from the local Toss bridge: condition values by key (missing key = no data yet). */
  real?: boolean; m?: Record<string, number | boolean>;
};

export type Cond = {
  key: string; grp: string; kind: string; name: string; term: string; js: string; easy: string; ex: string;
  bool: boolean; unit: string; op: ">=" | "<="; min: number; max: number; pre: string; post: string; fx: string;
  sign?: boolean; lv?: [number, string][]; only?: string; neg?: number;
  val: (s: Stock, r: number) => number | boolean;
};

const cl = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

// Simulated indicator values for the virtual stocks (phase 1 only — replaced by real data in phase 3).
// r is a stable pseudo-random number per (stock, condition).
const V: Record<string, (s: Stock, r: number) => number | boolean> = {
  price: s => s.price, priceMax: s => s.price, chg: s => s.chg, gap: s => s.gp, dayPos: (s, r) => cl(50 + s.chg * 7 + (r - 0.5) * 30, 2, 99), dayRange: (s, r) => Math.abs(s.chg) * 1.2 + 1.5 + r * 3, atr: (s, r) => 1.5 + r * 3.5, volRatio: (s, r) => (Math.abs(s.chg) * 1.2 + 1.5 + r * 3) / (1.5 + r * 3.5) * 1.6,
  vwap: s => s.vw, hi52: (s, r) => Math.max(0, 25 - s.m5 * 2 - s.chg + r * 10), newHigh: s => s.chg > 3 && s.m5 > 3, limitUp: s => 30 - s.chg,
  turnover: s => s.to, volx: s => s.vx, spike: (s, r) => s.vx * 1.5 + r * 2, turnRate: (s, r) => s.vx * 2.2 + r * 5, power: (s, r) => 85 + s.chg * 8 + r * 25, bidAsk: (s, r) => 0.6 + r * 1.4 + s.chg * 0.08, whale: (s, r) => s.to > 500 && r > 0.35,
  foreign: (s, r) => (r - 0.4) * s.to * 0.12, inst: (s, r) => (r - 0.5) * s.to * 0.08, program: (s, r) => (r - 0.45) * s.to * 0.05, shortR: (s, r) => r * 10, credit: (s, r) => 1 + r * 8,
  rsi: s => s.rsi, stoch: (s, r) => cl(s.rsi * 1.1 + (r - 0.5) * 20, 0, 100), macd: s => s.m5 > 1 && s.chg > 1, bbUp: s => s.chg > 4.5, squeeze: (s, r) => Math.abs(s.chg) < 1.5 && r > 0.3, ma5: s => s.m5, align: s => s.m5 > 1.5 && s.chg > 0, golden: s => s.m5 > 0 && s.m5 < 3 && s.chg > 0.5,
  disp: (s, r) => s.m5 * 1.8 + r * 3 - 1, breakout: s => s.chg > 2.5 && s.vx > 2.5, bigUp: s => s.vx > 3 && s.chg > 3, bigRed: s => s.br, upWick: (s, r) => r * 70, loWick: (s, r) => r * 80,
  r1m: (s, r) => s.m5 * 2 + s.chg + (r - 0.4) * 10, r3m: (s, r) => s.m5 * 3 + (r - 0.3) * 30, r6m: (s, r) => s.m5 * 3.5 + (r - 0.3) * 45, r12m: (s, r) => s.m5 * 4 + (r - 0.3) * 70, bigBuy: (s, r) => Math.floor(r * 7),
  roe: (s, r) => 2 + r * 22, debt: (s, r) => 0.2 + r * 2.2, opm: (s, r) => -3 + r * 24, salesY: (s, r) => -12 + r * 55, salesQ: (s, r) => -8 + r * 25, opY: (s, r) => -30 + r * 90, opQ: (s, r) => -15 + r * 40, epsY: (s, r) => -30 + r * 85, turnPos: (s, r) => r > 0.82, turnNeg: (s, r) => r < 0.1,
  per: (s, r) => 5 + r * 32, pbr: (s, r) => 0.4 + r * 3, psr: (s, r) => 0.3 + r * 5, div: (s, r) => r * 5,
  mcap: (s, r) => s.to * 9 + r * 25000, listed: (s, r) => 20 + r * 6000, floatR: (s, r) => 20 + r * 65, admin: s => s.ad,
  mkt: () => -0.4, theme: (s, r) => s.chg * 0.6 + r * 2 - 1, leader: s => s.chg > 5, rs: s => s.chg + 0.4, vi: s => s.chg > 6, disc: (s, r) => r > 0.72, buzz: (s, r) => s.vx * 0.8 + r * 2,
};

/** Condition groups: [key, name, desc] */
export const GR: [string, string, string][] = conditions.groups.map(g => [g.key, g.name, g.desc]);

/** Condition dictionary keyed by condition key. */
export const G: Record<string, Cond> = {};
for (const c of conditions.conditions as Array<Record<string, any>>) {
  const bool = c.type === "boolean";
  const gr = GR.find(g => g[0] === c.group)!;
  G[c.key] = {
    key: c.key, grp: c.group, kind: gr[1], name: c.name, term: c.term, js: c.script, easy: c.easy, ex: c.example,
    bool, unit: bool ? "" : c.unit ?? "", op: c.op || ">=", min: c.min ?? -1e9, max: c.max ?? 1e9, pre: c.pre, post: c.post || "",
    fx: bool ? c.formula + (c.neg ? " = 제외" : " = 있음") : c.formula,
    sign: c.signed, lv: c.stateLabels, only: c.only, neg: c.neg,
    val: V[c.key],
  };
}

export const S: Stock[] = sampleStocks.stocks.map(a => ({
  code: a.code, name: a.name, mkt: a.market, price: a.price, chg: a.change, to: a.turnover, vx: a.rvol,
  vw: a.vwapGap, m5: a.ma5Gap, gp: a.gapOpen, rsi: a.rsi14, br: a.bigRed5d, ad: a.flagged, seed: a.seed,
}));

export const TA: Theme = tokens.A_light;
export const TB: Theme = tokens.B_dark;
