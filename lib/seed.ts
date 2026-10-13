// Initial demo state for a first visit (phase 1). Rules and journal entries are
// examples from the prototype; stock indexes (si) point into data/sample_stocks.json.

export const plan0 = () => ({ stop: "pct", stopPct: 2, target: "rr", rrX: 2, targetPct: 4, minRR: 1.5, risk: 1 });

export const D1 = {
  filters: [{ id: "f1", k: "turnover", v: 100 }, { id: "f2", k: "price", v: 1000 }, { id: "f3", k: "admin" }],
  scores: [{ id: "s1", k: "volx", v: 3, pts: 30 }, { id: "s2", k: "vwap", v: 0, pts: 20 }, { id: "s3", k: "ma5", v: 0, pts: 15 }, { id: "s4", k: "gap", v: 2, pts: 15 }, { id: "s5", k: "chg", v: 3, pts: 20 }, { id: "s6", k: "bigRed", pts: -10 }, { id: "s7", k: "rsi", v: 75, pts: -15 }],
  plan: { stop: "pct", stopPct: 2, target: "rr", rrX: 2, targetPct: 4, minRR: 1.5, risk: 1 }, minScore: 50, alerts: { score: true, scoreMin: 70, plan: true, news: true },
};
export const D2 = {
  filters: [{ id: "g1", k: "turnover", v: 50 }, { id: "g2", k: "admin" }],
  scores: [{ id: "h1", k: "ma5", v: 0, pts: 30 }, { id: "h2", k: "vwap", v: 0.5, pts: 25 }, { id: "h3", k: "chg", v: 2, pts: 25 }, { id: "h4", k: "volx", v: 1.5, pts: 20 }, { id: "h5", k: "rsi", v: 70, pts: -20 }],
  plan: { stop: "vwap", stopPct: 2, target: "pct", rrX: 2, targetPct: 4, minRR: 1.5, risk: 1 }, minScore: 60, alerts: { score: true, scoreMin: 80, plan: true, news: false },
};
export const D3 = {
  filters: [{ id: "k1", k: "turnover", v: "" }, { id: "k2", k: "admin" }],
  scores: [{ id: "m1", k: "volx", v: 2, pts: 40 }, { id: "m2", k: "chg", v: "", pts: 30 }],
  plan: { stop: "pct", stopPct: 2.5, target: "rr", rrX: 2, targetPct: 4, minRR: 1.5, risk: 1 }, minScore: 50, alerts: { score: true, scoreMin: 70, plan: false, news: true },
};

export const journal0 = [
  { id: "j0", date: "오늘", si: 0, ver: "아침 거래 급증 v3", chips: [["volx", "y"], ["vwap", "y"], ["ma5", "y"], ["gap", "y"], ["chg", "n"], ["bigRed", "c"], ["rsi", "c"]], entry: 66800, stop: 65500, target: 69600, planQty: 30, buy: 66800, qty: 30, buyTime: "09:42", exit: null, status: "hold", kept: true, memo: "" },
  { id: "j1", date: "10.08", si: 7, ver: "아침 거래 급증 v3", chips: [["volx", "y"], ["vwap", "y"], ["ma5", "y"], ["gap", "y"], ["chg", "y"], ["bigRed", "c"], ["rsi", "w"]], entry: 94200, stop: 92300, target: 98000, exit: 98000, status: "done", kept: true, memo: "목표가에서 계획대로 정리했어요" },
  { id: "j2", date: "10.07", si: 3, ver: "아침 거래 급증 v2", chips: [["volx", "y"], ["vwap", "n"], ["gap", "y"], ["chg", "y"], ["bigRed", "w"]], entry: 8650, stop: 8480, target: 8990, exit: 8480, status: "done", kept: true, memo: "손절가에서 바로 정리했어요" },
  { id: "j3", date: "10.06", si: 0, ver: "아침 거래 급증 v2", chips: [["volx", "y"], ["vwap", "y"], ["ma5", "y"], ["gap", "y"], ["bigRed", "c"]], entry: 65900, stop: 64600, target: 68500, exit: 68500, status: "done", kept: true, memo: "평균가 위에서 버티는 걸 보고 샀어요" },
  { id: "j4", date: "10.05", si: 10, ver: "아침 거래 급증 v2", chips: [["volx", "y"], ["gap", "y"], ["chg", "y"], ["bigRed", "w"]], entry: 7020, stop: 6880, target: 7300, exit: 6820, status: "done", kept: false, memo: "손절가를 지나고도 버텼어요" },
  { id: "j5", date: "10.02", si: 1, ver: "눌림목 다시 오르기 v1", chips: [["ma5", "y"], ["vwap", "y"], ["chg", "y"], ["rsi", "c"]], entry: 21400, stop: 20950, target: 22300, exit: 22300, status: "done", kept: true, memo: "목표가 도달" },
  { id: "j6", date: "10.01", si: 6, ver: "아침 거래 급증 v1", chips: [["volx", "y"], ["vwap", "y"], ["bigRed", "w"]], entry: 20500, stop: 20100, target: 21300, exit: 20100, status: "done", kept: true, memo: "손절가에서 정리했어요" },
];
