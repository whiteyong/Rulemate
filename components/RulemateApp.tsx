"use client";
// Ported from the `class Component` in design/Rulemate B2C.dc.html (the source of truth for
// formulas and copy). renderVals() builds the view model that the generated components read.
// Phase 1: virtual data, state persisted to localStorage.
import React from "react";
import { G, GR, S, TA, TB, type Stock } from "../lib/data";
import { D1, D2, D3, journal0, plan0 } from "../lib/seed";
import { loadState, saveState, CONSENT_KEY } from "../lib/storage";
import { PAGE_PATH, pageOfPath, type Page } from "../lib/routes";
import Shell from "./Shell";

type Props = { pathname: string; navigate: (path: string) => void };

const DEMO: Record<string, string> = { loading: "불러오는 중", empty: "결과 0개", closed: "장 마감", delay: "데이터 지연", error: "오류" };
const FUTURE = /shift\(\s*-|\[\s*t\s*\+|tomorrow|next_/i;

export default class RulemateApp extends React.Component<Props, any> {
  G = G;
  GR = GR;
  S = S;
  TA = TA;
  TB = TB;
  t: any = TA;
  n = 100;
  acctRef = React.createRef<HTMLInputElement>();
  tx: any; tt: any; ts: any; tl: any;
  _lt: any;
  _savePlan: (() => void) | null = null;

  constructor(props: Props) {
    super(props);
    // A first visit starts empty: no rules, journal or investment amount.
    this.state = {
      ready: false, demo: "정상", sample: false,
      acct: 0, delId: null, topN: 5, homePage: 0, glossQ: "", glossCat: "all",
      page: pageOfPath(props.pathname), ruleId: null, sel: 0, look: null, gloss: false, toast: null, loading: false, saveState: "idle",
      plans: {}, openJ: null, menu: null, alertFilter: "all", fx: {}, fxErr: {}, focusK: null, fromJournal: false,
      flow: { top5: false, plan: false, journal: false, edit: false },
      rules: [],
      rec: null,
      journal: [],
    };
  }

  /** The prototype's example data, shown with ?sample=1 for design reviews. Never persisted. */
  sampleState() {
    return {
      acct: 10000000, ruleId: "r1",
      rules: [
        { id: "r1", name: "아침 거래 급증", version: 3, mode: "block", edited: "10.08 저장", draft: this.clone(D1), saved: this.clone(D1), script: null },
        { id: "r2", name: "눌림목 다시 오르기", version: 1, mode: "formula", edited: "10.07 저장", draft: this.clone(D2), saved: this.clone(D2), script: null },
        { id: "r3", name: "공시 뒤 흐름 따라가기", version: 0, mode: "script", edited: "10.08 임시 저장", draft: this.clone(D3), saved: null,
          script: this.genScript(D3, "공시 뒤 흐름 따라가기").replace("    return pts", "    if s.close.shift(-1) > s.close: pts += 20   # 다음 날 종가가 더 높으면\n    return pts") },
      ],
      journal: this.clone(journal0),
    };
  }

  componentDidMount() {
    const q = new URLSearchParams(window.location.search);
    const sample = q.get("sample") === "1";
    const saved = sample ? null : loadState();
    const demo = DEMO[q.get("demo") || ""] || "정상";
    if (saved && typeof saved.n === "number") this.n = saved.n;
    let consent = false;
    try { consent = !!localStorage.getItem(CONSENT_KEY); } catch {}
    this.setState({ ...(sample ? this.sampleState() : saved ? saved.state : {}), sample, ready: true, demo, consentOpen: !consent });
    this.tt = setTimeout(() => {
      const r = this.state.rules.find((x: any) => x.saved); if (!r) return;
      const ev = this.evalRule(r.saved), a = ev.top[0];
      if (a && !this.state.toast) this.setState({ toast: { kind: "hit", title: `${a.s.name}이(가) ${a.score}점이 됐어요`, body: `‘${r.name}’ 알림 기준 ${r.saved.alerts.scoreMin}점을 넘었어요. 사라는 뜻이 아니라 살펴볼 종목이라는 뜻이에요.`, actLabel: "종목 보기", act: "cands", si: a.si } });
    }, 4000);
  }
  componentWillUnmount() { clearTimeout(this.tx); clearTimeout(this.tt); clearTimeout(this.ts); clearTimeout(this.tl); }
  componentDidUpdate(pp: Props, ps: any) {
    const st = this.state;
    if (pp.pathname !== this.props.pathname) {
      const p = pageOfPath(this.props.pathname);
      if (p !== st.page) this.setState({ page: p, gloss: false });
    } else if (ps.page !== st.page && PAGE_PATH[st.page as Page] !== this.props.pathname) {
      this.props.navigate(PAGE_PATH[st.page as Page]);
    }
    // The builder always edits a rule: opening it with none starts a blank draft.
    if (st.ready && st.page === "builder" && !st.rules.length) this.newRule("blank", true);
    // ...and that draft is dropped again if the user leaves without touching it.
    if (ps.page === "builder" && st.page !== "builder" && st.rules.some((r: any) => r.auto)) {
      this.setState((s2: any) => { const rules = s2.rules.filter((r: any) => !r.auto); return { rules, ruleId: rules.some((r: any) => r.id === s2.ruleId) ? s2.ruleId : rules[0]?.id ?? null, newMenu: false }; });
    }
    if (st.ready && !st.sample) {
      saveState(this.n, { rules: st.rules, journal: st.journal, acct: st.acct, topN: st.topN, look: st.look, terms: st.terms, flow: st.flow, ruleId: st.ruleId, plans: st.plans });
      document.body.style.background = this.t.bg;
    }
  }

  nid() { return "x" + (this.n++); }
  /** Korean copula after a word: 받침 있으면 "이에요", 없으면 "예요". */
  ieyo(w: string) { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c < 11172 && c % 28 ? "이에요" : "예요"; }
  clone<T>(o: T): T { return JSON.parse(JSON.stringify(o)); }
  plan0() { return plan0(); }
  fmt(n: number) { return Math.round(n).toLocaleString("ko-KR"); }
  sgn(n: number) { return n > 0 ? "+" : n < 0 ? "−" : ""; }
  pct(n: number, d?: number) { return this.sgn(n) + Math.abs(n).toFixed(d ?? 1) + "%"; }
  won(n: number) { return this.sgn(n) + this.fmt(Math.abs(n)) + "원"; }
  tick(p: number) { return p < 2000 ? 1 : p < 5000 ? 5 : p < 20000 ? 10 : p < 50000 ? 50 : p < 200000 ? 100 : p < 500000 ? 500 : 1000; }
  rt(p: number) { const k = this.tick(p); return Math.round(p / k) * k; }
  num(v: any) { return v !== "" && v != null && v !== "-" && !isNaN(+v); }
  rnd(seed: number, k: string) { let h = seed * 7919; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) % 1000003; h = (h * 16807) % 2147483647; return (h % 10000) / 10000; }
  val(s: Stock, k: string): any { const g = this.G[k]; return g && g.val ? g.val(s, this.rnd(s.seed, k)) : 0; }
  fmtV(g: any, v: any) {
    if (g.bool) return v ? "있어요" : "없어요"; const u = g.unit, sg = v < 0 ? "−" : (g.sign && v > 0 ? "+" : "");
    if (u === "원" || u === "억 원" || u === "일") return sg + this.fmt(Math.abs(v)) + u;
    if (u === "%" || u === "%p") return sg + Math.abs(v).toFixed(1) + u;
    if (u === "배") return v.toFixed(1) + "배";
    return Math.round(v) + (u || "");
  }
  lvOf(g: any, v: number) { if (!g.lv) return ""; const f = g.lv.find((x: any) => v >= x[0]); return f ? f[1] : ""; }
  cur() { return this.state.rules.find((r: any) => r.id === this.state.ruleId) || this.state.rules[0] || null; }
  dirty(r: any) { return !r.saved || JSON.stringify(r.draft) !== JSON.stringify(r.saved); }

  planFor(s: Stock, p: any) {
    const entry = s.price, vp = s.price / (1 + s.vw / 100);
    const stop = p.stop !== "vwap" ? this.rt(entry * (1 - p.stopPct / 100)) : this.rt(vp * 0.995);
    const target = p.target === "rr" ? this.rt(entry + (entry - stop) * p.rrX) : this.rt(entry * (1 + p.targetPct / 100));
    return { entry, stop, target, rr: entry > stop ? (target - entry) / (entry - stop) : 0 };
  }
  evalRule(d: any) {
    const G = this.G, fStats = d.filters.map((f: any) => ({ f, removed: 0 })), passed: any[] = [];
    this.S.forEach((s, si) => {
      let ok = true;
      d.filters.forEach((f: any, i: number) => {
        const g = G[f.k]; let pass = true;
        if (g.bool) pass = g.neg ? !this.val(s, f.k) : !!this.val(s, f.k); else if (this.num(f.v)) { const x = this.val(s, f.k); pass = g.op === "<=" ? x <= +f.v : x >= +f.v; }
        if (!pass) { fStats[i].removed++; ok = false; }
      });
      if (!ok) return;
      let score = 0;
      const conds = d.scores.map((c: any) => {
        const g = G[c.k], active = g.bool || this.num(c.v); const hit = active && (g.bool ? !!this.val(s, c.k) : (g.op === "<=" ? this.val(s, c.k) <= +c.v : this.val(s, c.k) >= +c.v));
        const pts = +c.pts || 0; if (hit) score += pts;
        return { k: c.k, id: c.id, state: !active ? "b" : hit ? (pts < 0 ? "w" : "y") : (pts < 0 ? "c" : "n"), pts: hit ? pts : 0, raw: pts, thr: c.v };
      });
      passed.push({ s, si, score, conds, plan: this.planFor(s, d.plan) });
    });
    const maxPts = d.scores.reduce((a: number, c: any) => a + Math.max(0, +c.pts || 0), 0);
    const fin = passed.filter(r => r.score >= (+d.minScore || 0) && r.plan.rr >= (+d.plan.minRR || 0)).sort((a, b) => b.score - a.score || b.s.vx - a.s.vx);
    return { passed, fStats, maxPts, final: fin, top: fin.slice(0, (this.state && this.state.topN) || 5) };
  }
  emptyReason(ev: any, d: any, applyFix: (fn: (dd: any) => any) => void) {
    const G = this.G, tail = "맞는 종목이 없는 날엔 쉬는 것도 규칙이에요. 억지로 찾지 않아도 돼요.";
    if (!ev.passed.length) {
      const w = ev.fStats.slice().sort((a: any, b: any) => b.removed - a.removed)[0], g = G[w.f.k];
      const nv = g.op === "<=" ? Math.round(+w.f.v * 20) / 10 : (+w.f.v > 0 ? Math.max(g.min, Math.round(+w.f.v * 5) / 10) : +w.f.v - Math.max(1, Math.abs(+w.f.v)));
      return { title: `‘${g.name}’ 조건에서 모두 걸러졌어요`, lines: [`이 조건이 ${w.removed}개 종목을 뺐어요.`, tail], fixLabel: g.bool ? "" : `${this.fmt(nv)}${g.unit}로 바꿔 보기`, fix: g.bool ? null : () => applyFix(dd => { dd.filters.forEach((f: any) => { if (f.id === w.f.id) f.v = nv; }); return dd; }) };
    }
    const best = Math.max(...ev.passed.map((r: any) => r.score));
    if (!ev.passed.some((r: any) => r.score >= (+d.minScore || 0))) {
      const nv = Math.max(0, Math.floor(best / 5) * 5);
      return { title: "점수 기준을 넘은 종목이 없어요", lines: [`가장 높은 종목도 ${best}점이에요 (기준 ${d.minScore}점).`, tail], fixLabel: `기준을 ${nv}점으로 낮춰 보기`, fix: () => applyFix(dd => { dd.minScore = nv; return dd; }) };
    }
    return { title: `손익비 ${d.plan.minRR} 이상인 종목이 없어요`, lines: ["손절가와 살 가격이 너무 가깝거나, 손절가가 살 가격보다 높아요.", tail], fixLabel: "목표가를 ‘손실폭의 몇 배’로 바꾸기", fix: () => applyFix(dd => { dd.plan.target = "rr"; return dd; }) };
  }
  validate(rule: any) {
    const G = this.G, d = rule.draft, out: [string, string][] = [];
    const all = [...d.filters, ...d.scores].filter((c: any) => !G[c.k].bool);
    const blanks = all.filter(c => !this.num(c.v));
    if (blanks.length) out.push(["err", `빈칸이 ${blanks.length}개 있어요 — ${blanks.map(c => G[c.k].name).join(", ")}`]);
    all.filter(c => this.num(c.v) && (+c.v < G[c.k].min || +c.v > G[c.k].max)).forEach(c => { const g = G[c.k]; out.push(["err", `‘${g.name}’은 ${this.fmt(g.min)}~${this.fmt(g.max)}${g.unit} 사이로 넣어 주세요`]); });
    const pmin = d.filters.find((f: any) => f.k === "price"), pmax = d.filters.find((f: any) => f.k === "priceMax");
    if (pmin && pmax && this.num(pmin.v) && this.num(pmax.v) && +pmin.v > +pmax.v) out.push(["err", "‘주가 하한’이 ‘주가 상한’보다 커서 맞는 종목이 있을 수 없어요 (모순 조건)"]);
    const seen: Record<string, number> = {}; d.scores.forEach((c: any) => { if (seen[c.k]) out.push(["warn", `‘${G[c.k].name}’ 조건이 두 번 들어 있어요. 점수가 겹쳐서 들어가요`]); seen[c.k] = 1; });
    const maxPts = d.scores.reduce((a: number, c: any) => a + Math.max(0, +c.pts || 0), 0);
    if (!d.scores.some((c: any) => (+c.pts || 0) > 0)) out.push(["err", "점수를 주는 조건이 하나도 없어요"]);
    else if (+d.minScore > maxPts) out.push(["err", `통과 기준 ${d.minScore}점이 받을 수 있는 최고점 ${maxPts}점보다 높아요`]);
    if (d.scores.length > 6) out.push(["warn", "조건이 너무 많아요 (" + d.scores.length + "개). 과거에만 맞춘 전략일 수 있어요 (과최적화)"]);
    if (rule.mode === "formula") { const bad = Object.keys(this.state.fxErr).filter(id => this.state.fxErr[id] && all.some(c => c.id === id)).length; if (bad) out.push(["err", `읽을 수 없는 수식이 ${bad}줄 있어요`]); }
    if (rule.mode === "script" && rule.script != null) {
      if (FUTURE.test(rule.script)) out.push(["err", "내일 이후 가격을 쓰고 있어요. 실제로는 알 수 없는 값이라 결과가 부풀려져요 (미래 참조)"]);
      if (rule.script !== this.genScript(d, rule.name)) out.push(["warn", "스크립트를 고쳤지만 아직 ‘미리보기에 적용’하지 않았어요"]);
    }
    ([["stopPct", "끊기 폭", 0.5, 10, "%", d.plan.stop !== "vwap"], ["rrX", "벌 돈 배수", 1, 5, "배", d.plan.target === "rr"], ["targetPct", "챙기기 폭", 1, 20, "%", d.plan.target !== "rr"], ["minRR", "걸 돈 대비 벌 돈 · 최소", 1, 5, "배", true], ["risk", "한 번에 잃어도 되는 돈", 0.1, 5, "%", true]] as [string, string, number, number, string, boolean][]).forEach(([f, nm, mn, mx, u, on]) => { if (!on) return; const v = d.plan[f]; if (!this.num(v)) out.push(["err", "‘" + nm + "’이 비어 있어요"]); else if (+v < mn || +v > mx) out.push(["err", "‘" + nm + "’은 " + mn + "~" + mx + u + " 사이로 넣어 주세요"]); });
    if (!this.num(d.minScore)) out.push(["err", "‘통과 기준 점수’가 비어 있어요"]);
    { const z = d.scores.filter((c: any) => !(+c.pts)); if (z.length) out.push(["err", "점수를 정하지 않은 조건이 " + z.length + "개 있어요 — " + z.map((c: any) => G[c.k].name).join(", ")]); }
    if (d.plan.stop === "vwap") out.push(["info", "‘오늘 평균 단가 바로 아래’에서 끊으면, 평균 단가보다 아래 있는 종목은 계산이 안 돼서 빠져요"]);
    if (!out.some(o => o[0] !== "info")) out.unshift(["ok", "모순·빈칸·범위 밖 숫자가 없어요. 저장할 수 있어요"]);
    return out;
  }
  genScript(d: any, name: string) {
    const G = this.G, L = ["# 룰메이트 스크립트 · " + name, "# 블록·수식과 같은 규칙이에요. 이름은 설정 › 용어집의 스크립트 이름을 써요", "", "def keep(s):"];
    d.filters.forEach((f: any) => {
      const g = G[f.k], v = this.num(f.v) ? f.v : "?";
      L.push(g.bool ? (g.neg ? "    if s." + g.js + ": return False" : "    if not s." + g.js + ": return False") : "    if s." + g.js + " " + (g.op === "<=" ? ">" : "<") + " " + v + ": return False");
    });
    L.push("    return True", "", "def score(s):", "    pts = 0");
    d.scores.forEach((c: any) => {
      const g = G[c.k], p = +c.pts || 0, op = p < 0 ? "-=" : "+=";
      L.push(g.bool ? "    if s." + g.js + ": pts " + op + " " + Math.abs(p) : "    if s." + g.js + " " + g.op + " " + (this.num(c.v) ? c.v : "?") + ": pts " + op + " " + Math.abs(p));
    });
    L.push("    return pts");
    return L.join("\n");
  }
  applyScript() {
    const rule = this.cur(), txt = rule ? rule.script : null; if (txt == null) return;
    if (FUTURE.test(txt)) { this.setState({ toast: { kind: "warn", title: "미래 참조 줄을 먼저 지워 주세요", body: "내일 가격은 오늘 알 수 없어요. 이 줄이 있으면 적용할 수 없어요." } }); return; }
    const G = this.G;
    this.upd(d => {
      txt.split("\n").forEach((l: string) => {
        let m = l.match(/if s\.(\w+)\s*(>=|<=)\s*(-?[\d.]+)\s*:\s*pts\s*([+-])=\s*(\d+)/);
        if (m) { const c = d.scores.find((c: any) => G[c.k].js === m![1] && G[c.k].op === m![2]); if (c) { c.v = +m[3]; c.pts = (m[4] === "-" ? -1 : 1) * +m[5]; } return; }
        m = l.match(/if s\.(\w+)\s*:\s*pts\s*([+-])=\s*(\d+)/);
        if (m) { const c = d.scores.find((c: any) => G[c.k].js === m![1]); if (c) c.pts = (m[2] === "-" ? -1 : 1) * +m[3]; return; }
        m = l.match(/if s\.(\w+)\s*(<|>)\s*(-?[\d.]+)\s*:\s*return False/);
        if (m) { const f = d.filters.find((f: any) => G[f.k].js === m![1] && (m![2] === "<" ? G[f.k].op !== "<=" : G[f.k].op === "<=")); if (f) f.v = +m[3]; }
      }); return d;
    });
    this.setState((st: any) => ({ rules: st.rules.map((r: any) => r.id === st.ruleId ? { ...r, script: null } : r), toast: { kind: "ok", title: "스크립트를 미리보기에 적용했어요", body: "블록·수식 화면에도 같은 값으로 바뀌었어요." } }));
  }
  upd(fn: (d: any) => any) { this.setState((st: any) => ({ rules: st.rules.map((r: any) => r.id === st.ruleId ? { ...r, auto: false, draft: fn(this.clone(r.draft)) } : r), saveState: "idle" })); }
  normV(raw: any) { const s = String(raw).replace(/[^\d.\-]/g, ""); if (s === "" || s === "-" || s.endsWith(".")) return s; const n = +s; return isNaN(n) ? s : n; }
  setV(sec: string, id: string, raw: any) { const v = this.normV(raw); this.upd(d => { d[sec].forEach((c: any) => { if (c.id === id) c.v = v; }); return d; }); }
  onFx(sec: string, c: any, text: string) {
    const g = this.G[c.k], m = text.match(/^\s*([^\s<>=]+)\s*(>=|<=|>|<|=)\s*(.*)$/);
    let err: string | null = null, v: any = null;
    if (!m) err = `형식이 달라요. 예: ${g.fx} ${g.op || ">="} 숫자`;
    else if (m[1] !== g.fx) err = `‘${m[1]}’은 없는 이름이에요. ‘${g.fx}’를 써 주세요`;
    else { const r = m[3].trim(); if (r === "" || r === "?") v = ""; else if (!isNaN(+r.replace(/,/g, ""))) v = +r.replace(/,/g, ""); else err = "숫자를 넣어 주세요"; }
    this.setState((st: any) => ({ fx: { ...st.fx, [c.id]: text }, fxErr: { ...st.fxErr, [c.id]: err } }));
    if (v !== null && !err) this.upd(d => { d[sec].forEach((x: any) => { if (x.id === c.id) x.v = v; }); return d; });
  }
  switchRule(id: string) {
    if (id === this.state.ruleId) return;
    const busy = this.state.page !== "builder";
    this.setState({ ruleId: id, sel: 0, loading: busy, fx: {}, fxErr: {}, menu: null, focusK: null, fromJournal: false, saveState: "idle" });
    if (busy) { clearTimeout(this.tl); this.tl = setTimeout(() => this.setState({ loading: false }), 650); }
  }
  deleteRule(id: string) {
    this.setState((st: any) => {
      if (st.rules.length < 2) return null; const r = st.rules.find((x: any) => x.id === id), rest = st.rules.filter((x: any) => x.id !== id);
      return { rules: rest, delId: null, ruleId: st.ruleId === id ? rest[0].id : st.ruleId, sel: 0, toast: { kind: "info", title: "‘" + r.name + "’ 규칙을 삭제했어요", body: "이 규칙으로 남긴 매매일지 기록은 그대로 있어요." } };
    });
  }
  dupRule(id: string) {
    this.setState((st: any) => {
      const r = st.rules.find((x: any) => x.id === id), nid = this.nid();
      return { rules: [...st.rules, { ...r, id: nid, name: r.name + " (복사)", version: r.saved ? 1 : 0, edited: "방금 복제", draft: this.clone(r.draft), saved: r.saved ? this.clone(r.saved) : null, script: null }], toast: { kind: "ok", title: "‘" + r.name + "’을 복제했어요", body: "복사본을 고쳐도 원래 규칙은 그대로예요." } };
    });
  }
  /** auto: a blank draft created because the builder had nothing to edit. It shows the
   *  start panel and is replaced (not kept alongside) if the user picks another start. */
  newRule(kind?: string, auto = false) {
    if (!kind) { this.setState({ page: "builder", newMenu: true }); return; }
    const n = () => this.nid(), al = { score: true, scoreMin: 60, plan: true, news: false };
    const T: any = {
      blank: ["새 규칙", { filters: [{ id: n(), k: "turnover", v: "" }, { id: n(), k: "admin" }], scores: [{ id: n(), k: "volx", v: "", pts: 0 }], minScore: 20 }],
      ex1: ["거래가 몰린 종목 (예시)", { filters: [{ id: n(), k: "turnover", v: "" }, { id: n(), k: "admin" }], scores: [{ id: n(), k: "volx", v: "", pts: 0 }, { id: n(), k: "vwap", v: "", pts: 0 }, { id: n(), k: "rsi", v: "", pts: 0 }], minScore: 20 }],
      ex2: ["실적이 늘어난 종목 (예시)", { filters: [{ id: n(), k: "turnover", v: "" }, { id: n(), k: "admin" }], scores: [{ id: n(), k: "salesY", v: "", pts: 0 }, { id: n(), k: "opY", v: "", pts: 0 }, { id: n(), k: "debt", v: "", pts: 0 }], minScore: 10 }],
    }[kind];
    const id = n(), d = { ...T[1], plan: this.plan0(), alerts: al };
    this.setState((st: any) => {
      const keep = st.rules.filter((r: any) => !r.auto);
      return { newMenu: auto, rules: [...keep, { id, auto, name: kind === "blank" ? "새 규칙 " + (keep.length + 1) : T[0], example: kind !== "blank", version: 0, mode: "block", edited: "아직 저장 안 함", draft: d, saved: null, script: null }], ruleId: id, page: "builder", fx: {}, fxErr: {}, menu: null, focusK: null, fromJournal: false, saveState: "idle" };
    });
  }
  go(page: string) { return () => this.setState((st: any) => ({ page, gloss: false, flow: page === "cands" ? { ...st.flow, top5: true } : st.flow })); }
  doAct(act: string, si?: number) {
    if (act && act.indexOf("rec:") === 0) { this.openRec(act.slice(4), "buy"); return; }
    if (act === "cands") {
      const r = this.cur(); const ev = r && r.saved ? this.evalRule(r.saved) : null; const i = ev && si != null ? ev.top.findIndex((x: any) => x.si === si) : -1;
      this.setState((st: any) => ({ page: "cands", sel: i >= 0 ? i : st.sel, toast: null, flow: { ...st.flow, top5: true } }));
    } else this.setState({ page: act, toast: null });
  }
  save() {
    const rule = this.cur(); if (!rule) return;
    const errs = this.validate(rule).filter(i => i[0] === "err");
    if (errs.length) { this.setState({ toast: { kind: "warn", title: `고칠 곳 ${errs.length}개를 먼저 확인해 주세요`, body: errs[0][1] } }); return; }
    if (!this.dirty(rule)) return;
    this.setState({ saveState: "saving" });
    clearTimeout(this.ts);
    this.ts = setTimeout(() => this.setState((st: any) => {
      const r = st.rules.find((x: any) => x.id === st.ruleId), v = r.version + 1;
      return {
        ...(st.editModal ? { editModal: null, ruleId: st.editModal.prev } : {}), saveState: "saved", rules: st.rules.map((x: any) => x.id === r.id ? { ...x, auto: false, version: v, edited: "방금 저장", saved: this.clone(x.draft), script: null } : x),
        flow: st.fromJournal ? { ...st.flow, edit: true } : st.flow,
        toast: { kind: "ok", title: `‘${r.name}’ v${v}로 저장했어요`, body: "홈·내 조건 충족 종목·알림이 이 버전 기준으로 바뀌었어요.", actLabel: "조건 충족 종목 보기", act: "cands" },
      };
    }), 850);
  }

  chip(k: string, state: string) {
    const t = this.t, g = this.G[k];
    const m = ({
      y: { icon: "✓", bg: t.okSoft, ink: t.ink, iconBg: t.ok, iconColor: t.onOk, ptsColor: t.okInk },
      n: { icon: "✕", bg: t.sub, ink: t.muted, iconBg: t.off, iconColor: t.muted, ptsColor: t.faint },
      w: { icon: "!", bg: t.warnSoft, ink: t.warnInk, iconBg: t.warn, iconColor: t.onWarn, ptsColor: t.warnInk },
      c: { icon: "–", bg: t.sub, ink: t.muted, iconBg: t.off, iconColor: t.muted, ptsColor: t.faint },
      b: { icon: "?", bg: t.sub, ink: t.muted, iconBg: t.off, iconColor: t.muted, ptsColor: t.faint },
    } as any)[state];
    return { ...m, name: state === "c" ? g.name + " · 해당 없음" : g.name };
  }
  descOf(c: any, s: Stock) {
    const g = this.G[c.k], v = this.val(s, c.k);
    if (g.bool) return v ? "지금 해당돼요" : "지금은 해당되지 않아요";
    if (c.state === "b") return "숫자가 비어 있어서 계산하지 않았어요";
    const lv = this.lvOf(g, v);
    return "지금 " + this.fmtV(g, v) + (lv ? " · " + lv : "") + " · 기준 " + c.thr + g.unit + " " + (g.op === "<=" ? "이하" : "이상");
  }
  pbar(p: any, cur: number) {
    const lw = Math.max(p.entry - p.stop, 1), gw = Math.max(p.target - p.entry, 1), pos = Math.max(0, Math.min(100, (cur - p.stop) / Math.max(p.target - p.stop, 1) * 100));
    return { lossFlex: lw, gainFlex: gw, curPos: pos.toFixed(1) + "%", stopStr: this.fmt(p.stop), entryStr: this.fmt(p.entry), targetStr: this.fmt(p.target) };
  }
  calcOf(p: any, riskPct: number) {
    const acct = this.state.acct || 0, risk = acct * riskPct / 100, per = (p.entry - p.stop) + p.entry * 0.0023, noAcct = !(acct > 0), ok = !noAcct && p.entry > p.stop && p.target > p.entry && p.entry > 0;
    let qty = ok ? Math.floor(risk / per) : 0; qty = Math.max(0, Math.min(qty, Math.floor(acct / Math.max(p.entry, 1))));
    return { noAcct, acct, ok, qty, risk, loss: qty * per, gain: qty * (p.target - p.entry) - qty * p.entry * 0.0023, rr: ok ? (p.target - p.entry) / (p.entry - p.stop) : 0 };
  }
  markersOf(conds: any[], n: number) {
    const idx: Record<string, number> = { volx: n - 3, vwap: n - 14, ma5: n - 24, gap: 1, chg: n - 1, bigRed: n - 9, rsi: n - 2 };
    return conds.filter(c => c.state === "y").slice(0, 3).concat(conds.filter(c => c.state === "w").slice(0, 1)).map((c, k) => ({ i: idx[c.k] ?? (n - 6 - k * 7), label: this.G[c.k].name, warn: c.state === "w" }));
  }
  chart(s: Stock, plan: any, o?: any) {
    o = o || {}; const t = this.t, h = React.createElement, n = o.compact ? 36 : 48;
    let seed = s.seed * 9301 + 49297; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    let p = s.price / (1 + s.chg / 100); const bars: any[] = [];
    for (let i = 0; i < n; i++) { const op = p, c = op * (1 + (r() - 0.47) * 0.011), hi = Math.max(op, c) * (1 + r() * 0.004), lo = Math.min(op, c) * (1 - r() * 0.004); let v = (0.5 + r()) * (i < 6 ? 1.8 : 1); if (i >= n - 3) v *= 1 + s.vx * 0.5; bars.push({ o: op, c, hi, lo, v }); p = c; }
    const f = s.price / bars[n - 1].c; bars.forEach((b, i) => { const k = 1 + (f - 1) * (i + 1) / n; b.o *= k; b.c *= k; b.hi *= k; b.lo *= k; });
    let pv = 0, vv = 0; const vwap = bars.map(b => { pv += (b.hi + b.lo + b.c) / 3 * b.v; vv += b.v; return pv / vv; });
    const lv = plan ? [plan.stop, plan.target].concat(o.exit ? [o.exit] : []) : [];
    let mn = Math.min(...bars.map(b => b.lo), ...lv), mx = Math.max(...bars.map(b => b.hi), ...lv); const pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
    const W = o.compact ? 520 : 760, PW = plan ? W - 104 : W, top = o.markers && o.markers.length ? 46 : 10, ph = o.compact ? 150 : 230, vt = top + ph + 12, vh = o.compact ? 34 : 52, step = PW / n;
    const X = (i: number) => (i + 0.5) * step, Y = (v: number) => top + (mx - v) / (mx - mn) * ph, vmax = Math.max(...bars.map(b => b.v)), kids: any[] = [], fs = o.compact ? 12 : 11;
    [0.25, 0.5, 0.75].forEach((g, i) => kids.push(h("line", { key: "g" + i, x1: 0, x2: PW, y1: top + ph * g, y2: top + ph * g, stroke: t.line })));
    bars.forEach((b, i) => kids.push(h("rect", { key: "v" + i, x: X(i) - step * 0.32, width: step * 0.64, y: vt + vh - b.v / vmax * vh, height: b.v / vmax * vh, rx: 1.5, fill: i >= n - 3 ? t.volHot : t.vol })));
    if (o.type === "line") {
      const col = s.chg >= 0 ? t.up : t.down, dd = bars.map((b, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(b.c).toFixed(1)).join(" ");
      kids.push(h("path", { key: "ar", d: dd + ` L${X(n - 1)} ${top + ph} L${X(0)} ${top + ph} Z`, fill: col, opacity: 0.08 }));
      kids.push(h("path", { key: "ln", d: dd, fill: "none", stroke: col, strokeWidth: 2.4, strokeLinejoin: "round" }));
    } else bars.forEach((b, i) => {
      const c = b.c >= b.o ? t.up : t.down;
      kids.push(h("line", { key: "w" + i, x1: X(i), x2: X(i), y1: Y(b.hi), y2: Y(b.lo), stroke: c, strokeWidth: 1.2 }));
      kids.push(h("rect", { key: "c" + i, x: X(i) - step * 0.32, width: step * 0.64, y: Y(Math.max(b.o, b.c)), height: Math.max(1, Math.abs(Y(b.o) - Y(b.c))), fill: c, rx: 1 }));
    });
    kids.push(h("path", { key: "vw", d: vwap.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" "), fill: "none", stroke: "oklch(0.6 0.12 300)", strokeWidth: 1.6, strokeDasharray: "5 4" }));
    if (plan) {
      ([["목표", plan.target, t.up, "6 4"], ["살 가격", plan.entry, t.ink, ""], ["손절", plan.stop, t.down, "6 4"]] as any[]).concat(o.exit ? [["판 가격", o.exit, t.muted, "2 3"]] : []).forEach(([lab, v, c, da], i) => {
        const y = Y(v);
        kids.push(h("line", { key: "h" + i, x1: 0, x2: PW, y1: y, y2: y, stroke: c, strokeWidth: 1.3, strokeDasharray: da || undefined, opacity: 0.9 }));
        kids.push(h("rect", { key: "hr" + i, x: PW + 6, y: y - 11, width: W - PW - 6, height: 22, rx: 6, fill: c }));
        kids.push(h("text", { key: "ht" + i, x: PW + 6 + (W - PW - 6) / 2, y: y + 4, fill: lab === "살 가격" ? t.card : "#fff", fontSize: fs, fontWeight: 700, textAnchor: "middle", fontFamily: "inherit" }, lab + " " + this.fmt(v)));
      });
    }
    (o.markers || []).forEach((m: any, k: number) => {
      const i = Math.max(0, Math.min(n - 1, m.i)), b = bars[i], cx = X(i), cy = Y(b.hi) - 6, col = m.warn ? t.warn : t.ok, ty = 6 + (k % 2) * 20, w = m.label.length * (fs + 1) + 16;
      const lx = Math.max(w / 2, Math.min(PW - w / 2, cx));
      kids.push(h("line", { key: "ml" + k, x1: cx, x2: cx, y1: ty + 16, y2: cy, stroke: col, strokeWidth: 1, strokeDasharray: "2 2" }));
      kids.push(h("circle", { key: "mc" + k, cx, cy, r: 4.5, fill: col, stroke: t.card, strokeWidth: 2 }));
      kids.push(h("rect", { key: "mr" + k, x: lx - w / 2, y: ty, width: w, height: 18, rx: 9, fill: col }));
      kids.push(h("text", { key: "mt" + k, x: lx, y: ty + 13, fill: m.warn ? t.onWarn : t.onOk, fontSize: fs, fontWeight: 700, textAnchor: "middle", fontFamily: "inherit" }, m.label));
    });
    kids.push(h("circle", { key: "dot", cx: X(n - 1), cy: Y(s.price), r: 4.5, fill: s.chg >= 0 ? t.up : t.down, stroke: t.card, strokeWidth: 2 }));
    if (!o.compact) ["09:00", "10:00", "11:00", "12:00", "13:00"].forEach((tm, i) => kids.push(h("text", { key: "t" + i, x: Math.min(i * 12 * step + 2, PW - 30), y: vt + vh + 18, fontSize: 11, fill: t.faint, fontFamily: "inherit" }, tm)));
    return h("svg", { viewBox: `0 0 ${W} ${vt + vh + (o.compact ? 6 : 24)}`, width: "100%", style: { display: "block", overflow: "visible" } }, kids);
  }
  liveAl(fn: (a: any) => any) { this.setState((st: any) => ({ rules: st.rules.map((r: any) => r.id !== st.ruleId ? r : { ...r, draft: { ...r.draft, alerts: fn(r.draft.alerts) }, saved: r.saved ? { ...r.saved, alerts: fn(r.saved.alerts) } : null }) })); }
  reasonOf(r: any) {
    const s = r.s, f = (x: number) => Math.abs(x).toFixed(1), G = this.G;
    const conn: any = { volx: "평소보다 " + f(s.vx) + "배 북적이면서", vwap: "오늘 평균 단가 위에서", ma5: "5일 평균 가격 위에서", gap: "어제보다 " + f(s.gp) + "% 높게 출발해서", chg: "어제보다 " + f(s.chg) + "% 오르면서" };
    const end: any = { volx: "평소보다 " + f(s.vx) + "배 북적여요", vwap: "오늘 평균 단가보다 위에 있어요", ma5: "5일 평균 가격보다 위에 있어요", gap: "어제보다 " + f(s.gp) + "% 높게 출발했어요", chg: "어제보다 " + f(s.chg) + "% 올랐어요" };
    const but: any = { volx: "평소보다 " + f(s.vx) + "배 북적이지만", vwap: "평균 단가 위에 있지만", ma5: "5일 평균 위에 있지만", gap: f(s.gp) + "% 높게 출발했지만", chg: "어제보다 " + f(s.chg) + "% 올랐지만" };
    const warnE: any = { rsi: "과열 온도가 뜨거워요", bigRed: "최근에 크게 내린 날이 있었어요" };
    const C = (m: any, k: string, tail: string) => m[k] || (G[k].name + tail);
    const ys = r.conds.filter((c: any) => c.state === "y").sort((a: any, b: any) => b.pts - a.pts), w = r.conds.find((c: any) => c.state === "w");
    if (!ys.length) return "조건을 일부만 충족했어요";
    if (w) return C(but, ys[0].k, " 조건엔 맞지만") + " " + (warnE[w.k] || G[w.k].name + " 감점이 있어요");
    return ys[1] ? C(conn, ys[0].k, " 조건에 맞으면서") + " " + C(end, ys[1].k, " 조건에도 맞아요") : C(end, ys[0].k, " 조건에 맞아요");
  }
  planQty(j: any) { return j.planQty ?? Math.floor(100000 / ((j.entry - j.stop) + j.entry * 0.0023)); }
  jCalc(j: any) { const q = j.qty ?? this.planQty(j), b = j.buy ?? j.entry, ex = j.exit; return { qty: q, won: ex == null ? 0 : q * (ex - b) - q * b * 0.0023, pct: ex == null ? 0 : (ex - b) / b * 100 - 0.23 }; }
  checksOf(j: any, o?: any) {
    o = o || {}; const t = this.t, b = o.buy ?? j.buy ?? j.entry, q = o.qty ?? j.qty ?? this.planQty(j), ex = o.exit !== undefined ? o.exit : (j.status === "done" ? j.exit : null), pq = this.planQty(j), d = (b - j.entry) / j.entry * 100, it: [boolean, string][] = [];
    it.push(d <= 1 ? [true, "계획 가격 근처에서 샀어요"] : [false, "계획보다 " + d.toFixed(1) + "% 비싸게 샀어요"]);
    it.push(q <= pq ? [true, "계획한 수량 안에서 샀어요"] : [false, "계획보다 " + this.fmt(q - pq) + "주 더 샀어요"]);
    if (ex != null) it.push(ex >= j.stop * 0.997 ? [true, "끊기 가격 안에서 팔았어요"] : [false, "끊기 가격을 지나서 팔았어요 (" + this.pct((ex - j.stop) / j.stop * 100) + ")"]);
    return { kept: it.every(x => x[0]), items: it.map(([ok, text]) => ({ text, icon: ok ? "✓" : "!", bg: ok ? t.okSoft : t.warnSoft, color: ok ? t.okInk : t.warnInk })) };
  }
  openRec(id: string, mode: string) {
    const j = this.state.journal.find((x: any) => x.id === id); if (!j) return; const s = this.S[j.si];
    this.setState({ toast: null, rec: { id, mode, price: mode === "sell" ? s.price : j.entry, qty: this.planQty(j), feel: null, memo: "", reason: null } });
  }
  saveRec() {
    const r = this.state.rec; if (!r) return; const j = this.state.journal.find((x: any) => x.id === r.id), s = this.S[j.si], now = "13:02";
    let patch: any, toast: any, flow = this.state.flow;
    if (r.mode === "skip") { if (!r.reason) return; patch = { status: "skip", reason: r.reason }; toast = { kind: "info", title: "안 산 계획으로 남겼어요", body: "안 산 이유도 쌓이면 규칙을 고칠 때 도움이 돼요." }; }
    if (r.mode === "buy") { if (!(r.price > 0 && r.qty > 0)) return; patch = { status: "hold", buy: r.price, qty: r.qty, buyTime: now }; toast = { kind: "ok", title: s.name + " " + this.fmt(r.qty) + "주를 기록했어요", body: "끊기·챙기기 가격에 가까워지면 알려드릴게요. 팔고 나면 ‘팔았어요’를 눌러 주세요." }; }
    if (r.mode === "sell") {
      if (!(r.price > 0)) return; const ch = this.checksOf(j, { exit: r.price }), res = this.jCalc({ ...j, exit: r.price });
      patch = { status: "done", exit: r.price, sellTime: now, kept: ch.kept, feel: r.feel, memo: r.memo }; flow = { ...flow, journal: true };
      toast = { kind: "ok", title: "매매일지에 저장했어요 · " + this.won(res.won), body: ch.kept ? "규칙을 모두 지켰어요. 기록이 쌓이면 어떤 조건이 잘 맞는지 보여요." : "지키지 못한 규칙이 있어요. 일지에서 확인해 보세요.", actLabel: "매매일지 보기", act: "journal" };
    }
    this.setState((st: any) => ({ journal: st.journal.map((x: any) => x.id === r.id ? { ...x, ...patch } : x), rec: null, openJ: r.id, flow, toast }));
  }

  renderVals() {
    const st = this.state, G = this.G;
    const look = st.look ?? "A";
    const t = look === "B" ? this.TB : this.TA; this.t = t;
    const showTerms = st.terms ?? true, demo = st.demo;
    // Before the first rule exists, screens render against an empty placeholder rule.
    const noRule = !st.rules.length;
    const rule = this.cur() || { id: "", name: "", version: 0, mode: "block", edited: "", saved: null, script: null, draft: { filters: [], scores: [], plan: this.plan0(), minScore: "", alerts: { score: false, scoreMin: "", plan: false, news: false } } };
    const page = st.page, d = rule.draft, dirty = this.dirty(rule);
    const modeName: any = { block: "블록", formula: "수식", script: "스크립트" };
    const modeRo: any = { block: "블록으로", formula: "수식으로", script: "스크립트로" };
    const L = { dir: look === "A" ? "row" : "column", isA: look === "A", isB: look === "B" };

    const sv = rule.saved, ev: any = sv ? this.evalRule(sv) : null;
    const rsKind = noRule ? "norule" : !sv ? "incomplete" : (st.loading || demo === "불러오는 중") ? "loading" : demo === "오류" ? "error" : (demo === "결과 0개" || !ev.top.length) ? "empty" : "ok";
    const other = st.rules.find((r: any) => r.id !== rule.id && r.saved);
    const rs: any = { isOk: rsKind === "ok", isLoading: rsKind === "loading", isMsg: ["norule", "incomplete", "error", "empty"].includes(rsKind), title: "", lines: [], btn: "", act: null, hasBtn2: false, btn2: "", act2: null, icon: "0" };
    if (rsKind === "norule") Object.assign(rs, { icon: "+", title: "아직 만든 규칙이 없어요", lines: ["내가 정한 조건으로 규칙을 만들고 저장하면, 오늘 그 조건에 맞는 종목을 여기서 보여드려요.", "빈 규칙이나 예시 필터로 시작할 수 있어요. 숫자는 직접 정해요."], btn: "첫 규칙 만들기", act: () => this.newRule() });
    if (rsKind === "incomplete") Object.assign(rs, { icon: "…", title: `‘${rule.name}’은 아직 미완성이에요`, lines: ["빈칸이나 고칠 곳이 있어서 종목을 계산할 수 없어요.", "규칙 빌더에서 마저 채우고 저장하면 바로 결과를 볼 수 있어요."], btn: "이어서 만들기", act: this.go("builder"), hasBtn2: !!other, btn2: other ? `‘${other.name}’으로 보기` : "", act2: other ? () => this.switchRule(other.id) : null });
    if (rsKind === "error") Object.assign(rs, { icon: "!", title: "조건 충족 종목을 불러오지 못했어요", lines: ["시세 서버와 연결이 잠시 끊겼어요. 내 규칙과 기록은 안전해요.", "30초 뒤 자동으로 다시 시도해요."], btn: "지금 다시 시도", act: () => { this.setState({ loading: true }); clearTimeout(this.tl); this.tl = setTimeout(() => this.setState({ loading: false }), 650); } });
    if (rsKind === "empty") {
      const er = demo === "결과 0개" ? { title: `오늘은 ‘${rule.name}’에 맞는 종목이 없어요`, lines: ["거래가 적은 날이라 ‘평소보다 북적임’ 조건을 넘은 종목이 없어요.", "맞는 종목이 없는 날엔 쉬는 것도 규칙이에요. 억지로 찾지 않아도 돼요."] } : this.emptyReason(ev, sv, () => {});
      Object.assign(rs, { icon: "0", title: er.title, lines: er.lines, btn: "규칙 조건 바꿔 보기", act: this.go("builder"), hasBtn2: !!other, btn2: other ? `‘${other.name}’으로 보기` : "", act2: other ? () => this.switchRule(other.id) : null });
    }
    const skel = [1, 2, 3, 4];

    const top = (rsKind === "ok" ? ev.top : []).map((r: any, i: number) => ({
      rank: i + 1, name: r.s.name, score: r.score, priceStr: this.fmt(r.s.price), chgStr: this.pct(r.s.chg), chgColor: r.s.chg >= 0 ? t.up : t.down,
      reason: this.reasonOf(r),
      border: i === Math.min(st.sel, ev.top.length - 1) ? t.pri : "transparent", select: () => this.setState({ sel: i }), open: () => this.setState((s2: any) => ({ sel: i, page: "cands", flow: { ...s2.flow, top5: true } })),
    }));

    let sel: any = {}, selChart: any = null, pb: any = {}, calcRows: any[] = [], calc: any = {}, planBtn: any = {}, planHint = "", planTrack: any[] = [];
    this._savePlan = null;
    if (rsKind === "ok") {
      const R = ev.top[Math.min(st.sel, ev.top.length - 1)], s = R.s, key = rule.id + ":" + s.code, pl = st.plans[key] || { entry: R.plan.entry, stop: R.plan.stop, target: R.plan.target };
      const pos = R.conds.filter((c: any) => c.raw > 0), segs = pos.map((c: any, i: number) => ({ flex: Math.max(c.raw, 1), color: c.state === "y" ? t.pri : t.off, op: c.state === "y" ? (i % 2 ? 0.6 : 1) : 1 }));
      const delay = demo === "데이터 지연", closed = demo === "장 마감";
      sel = {
        name: s.name, mkt: s.mkt, code: s.code, priceStr: this.fmt(s.price), chgStr: this.pct(s.chg), chgColor: s.chg >= 0 ? t.up : t.down, score: R.score, maxPts: ev.maxPts, segs,
        dataLabel: delay ? "시세 3분 지연 · 12:59 기준" : closed ? "장 마감 · 15:30 종가" : "실시간 · 13:02", dataBg: delay ? t.warnSoft : t.sub, dataColor: delay ? t.warnInk : t.muted,
        conds: R.conds.map((c: any) => ({ ...this.chip(c.k, c.state), term: G[c.k].term, desc: this.descOf(c, s), ptsStr: c.state === "y" ? "+" + c.pts : c.state === "w" ? "−" + Math.abs(c.pts) : "0", ptsColor: this.chip(c.k, c.state).ptsColor })),
      };
      selChart = this.chart(s, pl, { markers: this.markersOf(R.conds, 48), type: st.chart || "candle" });
      pb = this.pbar(pl, s.price);
      const k = this.calcOf(pl, sv.plan.risk), tk = this.tick(pl.entry);
      const setP = (f: string, v: number) => this.setState((s2: any) => ({ plans: { ...s2.plans, [key]: { ...pl, [f]: Math.max(0, v) } } }));
      const numE = (e: any) => parseInt(String(e.target.value).replace(/[^0-9]/g, ""), 10) || 0;
      const row = (f: string, label: string, color: string, hint: string, term: string) => ({ label, term, labelColor: color, hint, value: this.fmt(pl[f]), onChange: (e: any) => setP(f, numE(e)), inc: () => setP(f, pl[f] + tk), dec: () => setP(f, pl[f] - tk) });
      calcRows = [row("entry", "살 가격", t.ink, `지금 가격 ${this.fmt(s.price)}원`, "진입가"), row("stop", "손해를 끊고 팔 가격", t.down, `여기까지 내려가면 바로 팔아요 · ${this.pct((pl.stop - pl.entry) / pl.entry * 100)}`, "손절가"), row("target", "이익을 챙기고 팔 가격", t.up, `내 규칙의 목표가 계산 방식이에요 · ${this.pct((pl.target - pl.entry) / pl.entry * 100)}`, "목표가")];
      const rrOk = k.rr >= sv.plan.minRR;
      calc = {
        qtyLine: k.noAcct ? "투자금을 넣으면 최대 수량을 알려드려요" : k.ok ? `내 손실 한도로 계산하면 최대 ${this.fmt(k.qty)}주예요` : "가격을 다시 확인해 주세요", needLine: k.ok ? `필요한 돈 ${this.fmt(k.qty * pl.entry)}원` : "",
        riskLine: k.noAcct ? "설정 › 계산에 쓸 내 투자금에 금액을 넣어 주세요. 증권 계좌와 연결하지 않아요." : k.ok ? `투자금 ${this.fmt(k.acct)}원 기준, 내가 정한 ‘한 번에 잃어도 되는 돈’(${sv.plan.risk}%, ${this.fmt(k.risk)}원)을 넘지 않는 수량이에요. 사고 안 사고는 직접 정해요.` : "손절가는 살 가격보다 낮고, 목표가는 살 가격보다 높아야 해요.",
        lossFlex: Math.max(k.loss, 1), gainFlex: Math.max(k.gain, 1), lossStr: "−" + this.fmt(k.loss) + "원", gainStr: "+" + this.fmt(Math.max(0, k.gain)) + "원", rrLine: k.ok ? `손익비 1 : ${k.rr.toFixed(1)}` : "—", minRR: sv.plan.minRR,
        rrBadge: rrOk ? "내 기준 통과" : "내 기준 미달", rrBg: rrOk ? t.okSoft : t.warnSoft, rrColor: rrOk ? t.okInk : t.warnInk,
      };
      const sj = st.journal.find((j: any) => j.key === key), sst = sj ? sj.status : null, live2 = sst === "plan" || sst === "hold";
      planBtn = {
        label: !sj ? (closed ? "내일 계획으로 일지에 저장" : "이 계획 일지에 저장") : sst === "plan" ? "샀으면 기록하기" : sst === "hold" ? "팔았으면 기록하기" : sst === "done" ? "매매일지에 기록했어요" : "안 산 걸로 기록했어요",
        bg: !sj ? t.pri : live2 ? t.priSoft : t.sub, color: !sj ? "#fff" : live2 ? t.priInk : t.muted,
      };
      planHint = !sj ? "세금·수수료(0.23%)를 넣어서 계산했어요 · 주문은 증권 앱에서 직접 해요" : sst === "plan" ? "증권 앱에서 산 뒤 실제 산 가격과 수량만 남기면 돼요" : sst === "hold" ? "판 뒤 실제 판 가격을 남기면 손익과 규칙 지킴을 계산해 드려요" : "매매일지에서 결과를 볼 수 있어요";
      const stage = !sj ? 0 : sst === "plan" ? 1 : sst === "hold" ? 2 : 3, labs = sst === "skip" ? ["계획 저장", "안 샀어요", "끝"] : ["계획 저장", "산 기록", "판 기록"];
      planTrack = labs.map((label, i) => ({ label, icon: i < stage ? "✓" : String(i + 1), dotBg: i < stage ? t.pri : i === stage ? t.priSoft : t.sub, dotInk: i < stage ? "#fff" : i === stage ? t.priInk : t.muted, ink: i <= stage ? t.ink : t.muted, weight: i === stage ? 700 : 600, line: i === 2 ? "transparent" : (i < stage ? t.pri : t.off) }));
      this._savePlan = () => {
        if (sj) { if (sst === "plan") this.openRec(sj.id, "buy"); else if (sst === "hold") this.openRec(sj.id, "sell"); else this.setState({ page: "journal", openJ: sj.id }); return; }
        if (!k.ok) return; const id = this.nid();
        this.setState((s2: any) => ({
          journal: [{ id, key, date: "오늘", si: R.si, ver: rule.name + " v" + rule.version, chips: R.conds.map((c: any) => [c.k, c.state]), entry: pl.entry, stop: pl.stop, target: pl.target, planQty: k.qty, exit: null, status: "plan", kept: true, memo: "" }, ...s2.journal], flow: { ...s2.flow, plan: true },
          toast: { kind: "ok", title: s.name + " 계획을 저장했어요", body: "증권 앱에서 실제로 사고 나면 ‘샀어요’를 눌러 기록해 주세요.", actLabel: "샀어요 기록하기", act: "rec:" + id },
        }));
      };
    }

    // alerts
    const al = sv ? sv.alerts : null, alist: any[] = [], times = ["13:02", "12:55", "12:31", "11:48", "11:05"];
    if (rsKind === "ok" && al.score) ev.top.slice(0, 5).filter((r: any) => r.score >= al.scoreMin).forEach((r: any, i: number) => {
      const ys = r.conds.filter((c: any) => c.state === "y").map((c: any) => G[c.k].name), ws = r.conds.filter((c: any) => c.state === "w").map((c: any) => G[c.k].name);
      alist.push({ type: "hit", time: times[i], stock: r.s.name, chg: this.pct(r.s.chg), up: r.s.chg >= 0, title: r.score + "점이 됐어요 — 알림 기준 " + al.scoreMin + "점을 넘었어요", boxLabel: "왜 알려드렸나요", summary: "충족한 조건: " + ys.join(" · ") + (ws.length ? " / 감점: " + ws.join(" · ") : "") + ". 사라는 뜻이 아니라 살펴볼 종목이라는 뜻이에요.", source: rule.name + " v" + rule.version, dirLabel: "내 규칙에 맞았어요", actLabel: "종목 보기", act: () => this.doAct("cands", r.si) });
    });
    // Plan-price alerts come from what the user actually holds.
    const holds = st.journal.filter((j: any) => j.status === "hold"), holdNames = new Set(holds.map((j: any) => this.S[j.si].name));
    if (al && al.plan) holds.forEach((j: any) => {
      const s = this.S[j.si], toT = (j.target - s.price) / s.price * 100, toS = (s.price - j.stop) / s.price * 100;
      const base = { type: "plan", time: "12:41", stock: s.name, chg: this.pct(s.chg), up: s.chg >= 0, boxLabel: "왜 알려드렸나요", source: "내 매매 계획", dirLabel: "계획 가격 알림", actLabel: "매매일지 열기", act: this.go("journal") };
      if (toT <= 3) alist.push({ ...base, title: "목표가 " + this.fmt(j.target) + "원까지 " + Math.max(0, toT).toFixed(1) + "% 남았어요", summary: "들고 있는 종목이 세운 계획의 목표가에 가까워졌어요. 닿으면 한 번 더 알려드릴게요." });
      else if (toS <= 3) alist.push({ ...base, title: "손절가 " + this.fmt(j.stop) + "원까지 " + Math.max(0, toS).toFixed(1) + "% 남았어요", summary: "들고 있는 종목이 세운 계획의 손절가에 가까워졌어요. 닿으면 한 번 더 알려드릴게요." });
    });
    if (!al || al.news) alist.push(
      { type: "good", time: "13:01", stock: "가상전자", chg: "+2.7%", up: true, title: "단일판매·공급계약 체결 (매출액 대비 9.4%)", summary: "큰 공급 계약을 따냈다는 공시예요. 1년 매출의 9% 정도 되는 규모예요.", source: "DART 공시", dirLabel: "소식이 먼저 떴어요" },
      { type: "bad", time: "12:20", stock: "별빛화학", chg: "+5.1%", up: true, title: "최대주주 등 소유주식 일부 처분", summary: "회사의 큰 주주가 주식 일부를 팔았다는 공시예요. 판 주식은 전체의 1.2%예요.", source: "DART 공시", dirLabel: "소식이 먼저 떴어요" },
      { type: "news2", time: "11:15", stock: "누리모빌리티", chg: "+2.9%", up: true, title: "전기차 부품 신규 수주 기사", summary: "새 고객사와 부품 계약을 맺었다는 기사예요. 아직 회사가 직접 낸 공시는 아니라 확인이 필요해요.", source: "뉴스 1건", dirLabel: "소식이 먼저 떴어요" },
      { type: "news2", time: "10:22", stock: "하늘항공", chg: "−1.2%", up: false, title: "3분기 유류비 부담 확대 전망", summary: "기름값이 올라 비용이 늘 수 있다는 기사예요. 회사가 직접 낸 발표는 아니에요.", source: "뉴스 2건", dirLabel: "주가가 먼저 움직였어요" });
    alist.push(
      { type: "move", time: "12:48", stock: "한빛바이오", chg: "+6.8%", up: true, title: "5분 만에 3.1% 올랐고, 거래가 평소의 5.6배예요", summary: "임상 결과 발표가 가깝다는 기사가 나왔어요. 아직 회사가 직접 낸 공시는 없어서 확인이 필요해요.", source: "뉴스 2건", dirLabel: "주가가 먼저 움직였어요" },
      { type: "move", time: "10:40", stock: "고요제약", chg: "+1.9%", up: true, title: "외국인이 평소의 2.6배를 사고 있어요", summary: "외국 투자자들이 오늘 유난히 많이 사고 있어요. 관련 뉴스는 아직 찾지 못했어요.", source: "투자자별 매매동향", dirLabel: "주가가 먼저 움직였어요" },
      { type: "sys", time: "10:05", stock: "시스템", title: "10:03~10:05 시세가 2분 늦게 들어왔어요", summary: "이 시간대 점수는 다시 계산했어요. 그 사이 온 알림은 한 번 더 확인해 주세요.", source: "룰메이트", dirLabel: "데이터 안내" });
    if (demo === "데이터 지연") alist.push({ type: "sys", time: "13:02", stock: "시스템", title: "지금 시세가 3분 늦게 들어오고 있어요", summary: "점수와 가격이 실제와 조금 다를 수 있어요. 정상으로 돌아오면 다시 알려드릴게요.", source: "룰메이트", dirLabel: "데이터 안내" });
    alist.forEach(a => { if (a.type !== "sys") a.holding = holdNames.has(a.stock); });
    alist.sort((a, b) => b.time.localeCompare(a.time));
    const tagOf: any = { good: ["공시 소식", t.sub, t.ink], bad: ["공시 소식", t.sub, t.ink], news2: ["뉴스 소식", t.sub, t.ink], move: ["움직임 감지", t.warnSoft, t.warnInk], hit: ["조건 충족", t.okSoft, t.okInk], plan: ["계획 가격", t.priSoft, t.priInk], sys: ["시스템", t.sub, t.muted] };
    const mapA = (a: any) => ({ ...a, tag: tagOf[a.type][0], tagBg: tagOf[a.type][1], tagColor: tagOf[a.type][2], chg: a.chg || "", chgColor: a.up === false ? t.down : t.up, isHolding: !!a.holding, boxLabel: a.boxLabel || "쉽게 말하면", hasAct: !!a.act, actLabel: a.actLabel || "" });
    const fOk = (a: any) => st.alertFilter === "all" || (st.alertFilter === "rule" ? (a.type === "hit" || a.type === "plan") : st.alertFilter === "hold" ? !!a.holding : st.alertFilter === "disc" ? (a.type === "good" || a.type === "bad" || a.type === "news2") : a.type === st.alertFilter);
    const alerts = alist.filter(fOk).map(mapA);
    const alertChips = [["all", "전체"], ["disc", "공시·뉴스 소식"], ["move", "움직임 감지"], ["rule", "내 규칙"], ["hold", "보유 종목"]].map(([k, label]) => ({ label, go: () => this.setState({ alertFilter: k }), bg: st.alertFilter === k ? t.ink : t.card, color: st.alertFilter === k ? t.bg : t.muted }));
    const swA = (on: boolean) => ({ swBg: on ? t.pri : t.off, swJustify: on ? "flex-end" : "flex-start" });
    const alertToggles = al ? [
      { label: "점수 기준 알림", desc: "내 규칙 점수가 이 점수 이상이 되면", hasNum: true, numVal: al.scoreMin ?? "", onNum: (e: any) => { const v = parseInt(String(e.target.value).replace(/[^0-9]/g, ""), 10); this.liveAl(a => ({ ...a, scoreMin: isNaN(v) ? "" : Math.min(200, v) })); }, dec: () => this.liveAl(a => ({ ...a, scoreMin: Math.max(0, (+a.scoreMin || 0) - 5) })), inc: () => this.liveAl(a => ({ ...a, scoreMin: Math.min(200, (+a.scoreMin || 0) + 5) })), toggle: () => this.liveAl(a => ({ ...a, score: !a.score })), ...swA(al.score) },
      { label: "계획 가격 알림", desc: "손절가·목표가에 가까워지면", hasNum: false, toggle: () => this.liveAl(a => ({ ...a, plan: !a.plan })), ...swA(al.plan) },
      { label: "공시·뉴스 알림", desc: "조건 충족 종목의 공시와 기사", hasNum: false, toggle: () => this.liveAl(a => ({ ...a, news: !a.news })), ...swA(al.news) }] : [];
    const alertRuleLine = noRule ? "규칙을 만들고 저장하면 알림을 켤 수 있어요" : sv ? "‘" + rule.name + "’ 규칙 기준이에요 · 바꾸면 바로 적용돼요" : "‘" + rule.name + "’은 아직 미완성이라 알림을 켤 수 없어요";
    const riskP = sv ? sv.plan.risk : 1;
    // Today's P&L and limits, from what the user recorded today.
    const DAY_LOSS_PCT = 2, MAX_STREAK = 3, MAX_TRADES = 3;
    const today = st.journal.filter((j: any) => j.date === "오늘"), todayDone = today.filter((j: any) => j.status === "done");
    const todayWon = todayDone.reduce((a: number, j: any) => a + this.jCalc(j).won, 0), todayWins = todayDone.filter((j: any) => this.jCalc(j).won > 0).length;
    const todayLoss = todayDone.reduce((a: number, j: any) => a + Math.max(0, -this.jCalc(j).won), 0), lossLimit = (st.acct || 0) * DAY_LOSS_PCT / 100;
    let streak = 0; for (const j of st.journal.filter((j: any) => j.status === "done")) { if (this.jCalc(j).won < 0) streak++; else break; }
    const todayTrades = today.filter((j: any) => j.status === "hold" || j.status === "done").length;
    const wOf = (v: number, max: number) => Math.min(100, max > 0 ? v / max * 100 : 0).toFixed(0) + "%";
    const atLimit = (lossLimit > 0 && todayLoss >= lossLimit) || streak >= MAX_STREAK || todayTrades >= MAX_TRADES;
    const pnl = {
      value: this.won(todayWon), color: todayWon > 0 ? t.up : todayWon < 0 ? t.down : t.ink,
      sub: todayDone.length ? `세금·수수료 뺀 금액 · 매매 ${todayDone.length}번, 이익 ${todayWins}번` : "오늘 끝낸 매매가 아직 없어요",
      badge: atLimit ? "오늘 한도에 닿았어요" : "여유 있어요",
      meters: [
        { label: "하루 손실 한도", val: lossLimit > 0 ? this.fmt(todayLoss) + " / " + this.fmt(lossLimit) + "원" : "투자금 미입력", w: wOf(todayLoss, lossLimit), term: "일일 최대 손실 · 계좌의 " + DAY_LOSS_PCT + "%" },
        { label: "연속 손실", val: streak + " / " + MAX_STREAK + "번", w: wOf(streak, MAX_STREAK), term: "연속 손실 제한" },
        { label: "오늘 매매", val: todayTrades + " / " + MAX_TRADES + "번", w: wOf(todayTrades, MAX_TRADES), term: "일일 매매 횟수 제한" }],
      line: !st.acct ? "설정 › 계산에 쓸 내 투자금을 넣으면 한 번에 잃어도 되는 돈과 하루 손실 한도를 계산해 드려요."
        : "한 번에 잃어도 되는 돈은 계좌의 " + riskP + "%(" + this.fmt(st.acct * riskP / 100) + "원)예요. " + (atLimit ? "오늘은 한도에 닿았어요. 쉬는 것도 규칙이에요." : "오늘은 한도까지 여유가 있어요."),
    };
    const hjs = st.journal.filter((j: any) => j.status === "hold"), hj = hjs[0];
    let hold: any;
    if (hj) {
      const hs = this.S[hj.si], hp = this.jCalc({ ...hj, exit: hs.price });
      hold = {
        has: true, none: false, countStr: hjs.length + "종목", name: hs.name, sub: this.fmt(hj.qty) + "주 · " + this.fmt(hj.buy) + "원에 샀어요", pnlStr: this.won(hp.won), pctStr: this.pct(hp.pct) + " · 지금 " + this.fmt(hs.price) + "원", color: hp.won >= 0 ? t.up : t.down,
        pb: this.pbar({ entry: hj.buy, stop: hj.stop, target: hj.target }, hs.price), leftStr: "챙기기까지 " + ((hj.target - hs.price) / hs.price * 100).toFixed(1) + "% 남았어요", sell: () => this.openRec(hj.id, "sell"),
      };
    } else hold = { has: false, none: true, countStr: "0종목", pb: {}, sell: null };
    hold.note = noRule ? "규칙을 만들고 계획을 세우면, 끊기·챙기기 가격에 가까워질 때 알려드려요." : al && al.plan ? "끊기·챙기기 가격에 가까워지면 알림으로 알려드릴게요." : "계획 가격 알림이 꺼져 있어요. 설정에서 켤 수 있어요.";
    const ruleSel = { value: rule.id, onChange: (e: any) => this.switchRule(e.target.value), opts: noRule ? [{ id: "", label: "아직 규칙이 없어요" }] : st.rules.map((r: any) => ({ id: r.id, label: r.name + " · " + (r.saved ? "v" + r.version : "미완성") })) };

    // journal
    const done = st.journal.filter((j: any) => j.status === "done");
    const jRows = st.journal.map((j: any) => {
      const s = this.S[j.si], c = this.jCalc(j), open = st.openJ === j.id, stt = j.status;
      const live = stt === "hold" ? this.jCalc({ ...j, exit: s.price }) : null, pq = this.planQty(j);
      const color = stt === "done" ? (c.won >= 0 ? t.up : t.down) : stt === "hold" ? (live!.won >= 0 ? t.up : t.down) : t.muted;
      const facts = [["계획", "살 " + this.fmt(j.entry) + " · 끊기 " + this.fmt(j.stop) + " · 챙기기 " + this.fmt(j.target) + " · " + this.fmt(pq) + "주"]];
      if (stt === "hold" || stt === "done") facts.push(["실제로 산 것", this.fmt(j.buy ?? j.entry) + "원 × " + this.fmt(j.qty ?? pq) + "주" + (j.buyTime ? " · " + j.buyTime : "")]);
      if (stt === "done") facts.push(["실제로 판 것", this.fmt(j.exit) + "원" + (j.sellTime ? " · " + j.sellTime : "")]);
      if (stt === "skip") facts.push(["안 산 이유", j.reason || "—"]);
      const memoLine = [j.feel, j.memo].filter(Boolean).join(" · ");
      const tagMap = ({ plan: ["계획만", t.sub, t.muted], hold: ["보유 중", t.priSoft, t.priInk], skip: ["안 샀어요", t.sub, t.muted], done: j.kept ? ["지켰어요", t.okSoft, t.okInk] : ["어겼어요", t.warnSoft, t.warnInk] } as any)[stt];
      return {
        date: j.date, name: s.name, ver: j.ver,
        dots: j.chips.filter((x: any) => x[1] !== "c").map((x: any) => ({ c: x[1] === "y" ? t.ok : x[1] === "w" ? t.warn : t.off })), condSum: j.chips.filter((x: any) => x[1] === "y").length + "/" + j.chips.filter((x: any) => x[1] === "y" || x[1] === "n" || x[1] === "b").length + "개 충족", hasWarn: j.chips.some((x: any) => x[1] === "w"), warnNames: j.chips.filter((x: any) => x[1] === "w").map((x: any) => G[x[0]].name).join(", "),
        pctStr: stt === "done" ? this.pct(c.pct) : stt === "hold" ? this.pct(live!.pct) : "—", wonStr: stt === "done" ? this.won(c.won) : stt === "hold" ? "지금 팔면 " + this.won(live!.won) : stt === "plan" ? "사기 전" : "—", color,
        rule: tagMap[0], ruleBg: tagMap[1], ruleColor: tagMap[2], open, rowBg: open ? t.sub : "transparent", toggle: () => this.setState({ openJ: open ? null : j.id }),
        pb: this.pbar(j, stt === "done" ? j.exit : s.price), chartEl: open ? this.chart(s, j, { markers: this.markersOf(j.chips.map((x: any) => ({ k: x[0], state: x[1] })), 48), exit: stt === "done" ? j.exit : null }) : null,
        facts: facts.map(([label, value]) => ({ label, value })), hasChecks: stt === "done", checks: stt === "done" ? this.checksOf(j).items : [], hasMemo: !!memoLine, memoLine,
        isPlan: stt === "plan", isHold: stt === "hold", buy: () => this.openRec(j.id, "buy"), skip: () => this.openRec(j.id, "skip"), sell: () => this.openRec(j.id, "sell"),
      };
    });
    const pendItems = st.journal.filter((j: any) => j.status === "plan" || j.status === "hold").map((j: any) => {
      const s = this.S[j.si], hold = j.status === "hold", live = hold ? this.jCalc({ ...j, exit: s.price }) : null;
      return {
        name: s.name, tag: hold ? "보유 중" : "계획 세움", tagBg: hold ? t.priSoft : t.card, tagColor: hold ? t.priInk : t.muted,
        line: hold ? (this.fmt(j.buy) + "원에 " + this.fmt(j.qty) + "주 샀어요 · 끊기 " + this.fmt(j.stop) + " · 챙기기 " + this.fmt(j.target)) : ("살 " + this.fmt(j.entry) + " · 끊기 " + this.fmt(j.stop) + " · 챙기기 " + this.fmt(j.target) + " · " + this.fmt(this.planQty(j)) + "주"),
        isPlan: !hold, isHold: hold, evalStr: hold ? "지금 팔면 " + this.won(live!.won) : "", evalColor: hold && live!.won >= 0 ? t.up : t.down,
        buy: () => this.openRec(j.id, "buy"), skip: () => this.openRec(j.id, "skip"), sell: () => this.openRec(j.id, "sell"),
      };
    });
    const pend = { has: pendItems.length > 0, count: pendItems.length + "건", items: pendItems };
    const wins = done.filter((j: any) => this.jCalc(j).won > 0).length, sumWon = done.reduce((a: number, j: any) => a + this.jCalc(j).won, 0), kept = done.filter((j: any) => j.kept).length;
    const jStats = [
      { label: "기록한 매매", value: done.length + "번", desc: "진행 중 " + st.journal.filter((j: any) => j.status === "plan" || j.status === "hold").length + "건 · 안 산 계획 " + st.journal.filter((j: any) => j.status === "skip").length + "건", color: t.ink },
      { label: "이긴 비율", value: done.length ? Math.round(wins / done.length * 100) + "%" : "—", desc: `${wins}번 이익 · ${done.length - wins}번 손실`, color: t.ink },
      { label: "합계 손익", value: this.won(sumWon), desc: "세금·수수료 뺀 금액", color: sumWon >= 0 ? t.up : t.down },
      { label: "규칙 지킨 비율", value: done.length ? Math.round(kept / done.length * 100) + "%" : "—", desc: "손절가·수량을 지켰는지", color: t.ink }];
    const withR = done.filter((j: any) => j.chips.some((x: any) => x[0] === "bigRed" && x[1] === "w")), woR = done.filter((j: any) => !j.chips.some((x: any) => x[0] === "bigRed" && x[1] === "w"));
    const avg = (a: any[]) => a.length ? a.reduce((s2, j) => s2 + this.jCalc(j).pct, 0) / a.length : 0, lossN = withR.filter((j: any) => this.jCalc(j).won < 0).length;
    const r1 = st.rules.find((r: any) => r.draft.scores.some((c: any) => c.k === "bigRed")) || this.cur(), br = r1 ? r1.draft.scores.find((c: any) => c.k === "bigRed") : null;
    const insight = {
      has: !!r1 && withR.length >= 2 && lossN >= 2 && !st.flow.edit, title: `‘큰 내린 봉’ 감점이 붙은 매매 ${withR.length}번 중 ${lossN}번이 손실이었어요`,
      desc: `지금은 감점이 ${br ? br.pts : 0}점이라 다른 조건 점수에 묻혀 목록에 그대로 남아요. 감점을 바꾸면 미리보기가 어떻게 달라지는지 비교해 볼 수 있어요.`,
      withStr: this.pct(avg(withR), 2), withColor: avg(withR) >= 0 ? t.up : t.down, withoutStr: this.pct(avg(woR), 2), withoutColor: avg(woR) >= 0 ? t.up : t.down,
      fix: () => this.setState({ page: "builder", ruleId: r1 ? r1.id : st.ruleId, focusK: "bigRed", fromJournal: true, fx: {}, fxErr: {}, menu: null }),
    };

    // builder
    const valid = this.validate(rule), errN = valid.filter(i => i[0] === "err").length, warnN = valid.filter(i => i[0] === "warn").length;
    const mkBlock = (sec: string, c: any) => {
      const g = G[c.k], blank = !g.bool && !this.num(c.v), bad = !g.bool && !blank && (+c.v < g.min || +c.v > g.max), fxErr = st.fxErr[c.id];
      const pts = +c.pts || 0;
      return {
        name: g.name, term: g.term, isBlock: rule.mode === "block", isFormula: rule.mode === "formula", isBool: !!g.bool, hasInput: !g.bool, pre: g.pre, post: g.bool ? "" : g.post, unit: g.unit, v: c.v ?? "",
        inW: String(c.v ?? "").length > 4 ? "72px" : "46px", onV: (e: any) => this.setV(sec, c.id, e.target.value), inBorder: blank || bad ? t.warn : t.off,
        fx: g.bool ? g.fx : (st.fx[c.id] ?? `${g.fx} ${g.op || ">="} ${this.num(c.v) ? c.v : "?"}`), onFx: (e: any) => this.onFx(sec, c, e.target.value), fxBorder: fxErr || blank || bad ? t.warn : t.off,
        border: st.focusK === c.k ? t.pri : "transparent", hasErr: !!fxErr || bad, err: fxErr || (bad ? `${this.fmt(g.min)}~${this.fmt(g.max)}${g.unit} 사이로 넣어 주세요` : ""),
        hasPts: sec === "scores", ptsColor: pts <= 0 ? t.warnInk : t.priInk,
        ptsVal: (+c.pts) ? c.pts : (c.pts === "-" ? "-" : ""), onPts: (e: any) => { const v = this.normV(e.target.value); this.upd(dd => { dd.scores.forEach((x: any) => { if (x.id === c.id) x.pts = v; }); return dd; }); },
        ptsDec: () => this.upd(dd => { dd.scores.forEach((x: any) => { if (x.id === c.id) x.pts = Math.max(-50, (+x.pts || 0) - 5); }); return dd; }),
        ptsInc: () => this.upd(dd => { dd.scores.forEach((x: any) => { if (x.id === c.id) x.pts = Math.min(50, (+x.pts || 0) + 5); }); return dd; }),
        remove: () => this.upd(dd => { dd[sec] = dd[sec].filter((x: any) => x.id !== c.id); return dd; }),
      };
    };
    const maxPts = d.scores.reduce((a: number, c: any) => a + Math.max(0, +c.pts || 0), 0);
    const secs = [
      { n: 1, title: "종목 거르기", sub: "조건에 안 맞는 종목은 처음부터 빼요", term: "유니버스 필터", count: d.filters.length + "개", blocks: d.filters.map((c: any) => mkBlock("filters", c)), addLabel: "거르기 조건 추가", add: () => this.setState({ lib: "filters", libCat: "all", libQ: "" }) },
      { n: 2, title: "점수 매기기", sub: "맞으면 점수를 주고, 위험 조건에는 감점해요", term: "스코어링 조건 · 가중치", count: `${d.scores.length}개 · 최고 ${maxPts}점`, blocks: d.scores.map((c: any) => mkBlock("scores", c)), addLabel: "점수 조건 추가", add: () => this.setState({ lib: "scores", libCat: "all", libQ: "" }) }];
    const pl = d.plan, setPl = (f: string, v: any) => this.upd(dd => { dd.plan[f] = v; return dd; });
    const seg = (cur2: string, opts: string[][], f: string) => opts.map(([k, label]) => ({ label, go: () => setPl(f, k), bg: cur2 === k ? t.card : "transparent", color: cur2 === k ? t.ink : t.muted }));
    const stp = (label: string, desc: string, unit: string, f: string, stepV: number, mn: number, mx: number, isPlan: boolean) => {
      const raw = isPlan ? pl[f] : d[f], blank = !this.num(raw), bad = blank || +raw < mn || +raw > mx;
      return {
        label, desc, unit, value: raw ?? "", color: bad ? t.warnInk : t.ink, hasErr: bad, err: blank ? "숫자를 넣어 주세요" : mn + "~" + mx + unit + " 사이로 넣어 주세요",
        onChange: (e: any) => { const v = this.normV(e.target.value); this.upd(dd => { (isPlan ? dd.plan : dd)[f] = v; return dd; }); },
        dec: () => this.upd(dd => { const o = isPlan ? dd.plan : dd; o[f] = Math.max(mn, +((+o[f] || 0) - stepV).toFixed(2)); return dd; }),
        inc: () => this.upd(dd => { const o = isPlan ? dd.plan : dd; o[f] = Math.min(mx, +((+o[f] || 0) + stepV).toFixed(2)); return dd; }),
      };
    };
    const nums: any[] = [], acctV = st.acct || 0;
    if (pl.stop !== "vwap") nums.push(stp("끊기 폭", pl.stop === "trail" ? "가장 높았던 가격에서 이만큼 빠지면 팔아요" : "산 가격보다 이만큼 내려가면 팔아요", "%", "stopPct", 0.5, 0.5, 10, true));
    if (pl.target === "rr") nums.push(stp("벌 돈 배수", "걸 돈(끊기 폭)의 몇 배를 노릴지예요", "배", "rrX", 0.5, 1, 5, true));
    else nums.push(stp("챙기기 폭", "산 가격보다 이만큼 오르면 팔아요", "%", "targetPct", 0.5, 1, 20, true));
    nums.push(stp("걸 돈 대비 벌 돈 · 최소", "1만원 걸고 이 배수만큼도 못 노리면 목록에서 빼요", "배", "minRR", 0.1, 1, 5, true));
    nums.push(stp("통과 기준 점수", "내 규칙 점수가 이 점수 이상인 종목만 보여줘요 · 지금 최고 " + maxPts + "점", "점", "minScore", 5, 0, 200, false));
    nums.push(stp("한 번에 잃어도 되는 돈", acctV ? "내 투자금 " + this.fmt(acctV) + "원의 " + (this.num(pl.risk) ? pl.risk : "?") + "% · " + (this.num(pl.risk) ? this.fmt(acctV * pl.risk / 100) + "원" : "—") + " · 최대 수량 계산에 써요" : "설정에서 내 투자금을 넣으면 금액으로 보여줘요", "%", "risk", 0.5, 0.1, 5, true));
    const methods = [{ label: "여기서 끊기 · 손절가 정하는 법", opts: seg(pl.stop, [["pct", "산 가격 %"], ["vwap", "평균 단가 아래"], ["trail", "따라 올라가기"]], "stop") }, { label: "여기서 챙기기 · 목표가 정하는 법", opts: seg(pl.target, [["rr", "걸 돈의 몇 배"], ["pct", "산 가격에서 %"]], "target") }];
    const A = d.alerts, togA = (f: string) => () => this.upd(dd => { dd.alerts[f] = !dd.alerts[f]; return dd; });
    const sw = (on: boolean) => ({ swBg: on ? t.pri : t.off, swJustify: on ? "flex-end" : "flex-start" });
    const bAlerts = [
      { label: "점수가 기준을 넘으면", desc: `내 규칙 점수가 ${A.scoreMin}점 이상이 되면 알려줘요`, hasNum: true, numVal: A.scoreMin ?? "", onNum: (e: any) => { const v = parseInt(String(e.target.value).replace(/[^0-9]/g, ""), 10); this.upd(dd => { dd.alerts.scoreMin = isNaN(v) ? "" : Math.min(200, v); return dd; }); }, dec: () => this.upd(dd => { dd.alerts.scoreMin = Math.max(0, (+dd.alerts.scoreMin || 0) - 5); return dd; }), inc: () => this.upd(dd => { dd.alerts.scoreMin = Math.min(200, (+dd.alerts.scoreMin || 0) + 5); return dd; }), toggle: togA("score"), ...sw(A.score) },
      { label: "계획 가격에 닿으면", desc: "세운 계획의 손절가·목표가에 닿으면 알려줘요", hasNum: false, toggle: togA("plan"), ...sw(A.plan) },
      { label: "조건 충족 종목에 공시가 뜨면", desc: "공시는 가격이 먼저 움직인 뒤에 나올 수 있어요", hasNum: false, toggle: togA("news"), ...sw(A.news) }];
    const scriptTxt = rule.script ?? this.genScript(d, rule.name);
    const lint: any[] = [];
    if (FUTURE.test(scriptTxt)) { const ln = scriptTxt.split("\n").findIndex((l: string) => FUTURE.test(l)) + 1; lint.push({ icon: "!", text: `${ln}번째 줄이 내일 가격을 쓰고 있어요 (미래 참조). 실제 매매 땐 알 수 없는 값이라 지워야 해요.`, bg: t.warnSoft, color: t.warnInk }); }
    if (scriptTxt.includes("?")) lint.push({ icon: "!", text: "‘?’로 남은 빈칸이 있어요. 숫자로 바꿔 주세요.", bg: t.warnSoft, color: t.warnInk });
    if (!lint.length) lint.push({ icon: "✓", text: "읽을 수 있는 스크립트예요. 바꾼 뒤 ‘미리보기에 적용’을 눌러 주세요.", bg: t.okSoft, color: t.okInk });
    const saving = st.saveState === "saving";
    const bd = {
      name: rule.name, onName: (e: any) => { const v = e.target.value; this.setState((s2: any) => ({ rules: s2.rules.map((r: any) => r.id === s2.ruleId ? { ...r, name: v, auto: false } : r) })); },
      saveLabel: saving ? "저장 중…" : "저장",
      saveBg: saving || !dirty ? t.sub : t.pri, saveColor: saving || !dirty ? t.muted : "#fff", save: () => this.save(),
      modes: [["block", "블록", "처음이라면 · 골라서 조립"], ["formula", "수식", "엑셀이 편하다면 · 한 줄씩"], ["script", "스크립트", "코드가 편하다면 · 파이썬"]].map(([k, label, sub]) => ({
        label, sub,
        go: () => this.setState((s2: any) => ({ rules: s2.rules.map((r: any) => r.id === s2.ruleId ? { ...r, mode: k, auto: false } : r), fx: {}, fxErr: {} })), bg: rule.mode === k ? t.priSoft : t.sub, border: rule.mode === k ? t.pri : "transparent",
      })),
      fromJournal: st.fromJournal, metaLine: modeRo[rule.mode] + " 편집 · " + rule.edited, newRule: () => this.setState((s2: any) => ({ newMenu: !s2.newMenu })), newOpen: !!st.newMenu, closeNew: () => this.setState({ newMenu: false }), isExample: !!rule.example,
      starts: [["blank", "빈 규칙", "처음부터 직접 조건을 골라요", ""], ["ex1", "거래가 몰린 종목", "평소보다 북적임 · 오늘 평균 단가 · 과열 온도", "예시 필터"], ["ex2", "실적이 늘어난 종목", "작년보다 매출 · 작년보다 이익 · 빚 비중", "예시 필터"]].map(([k, label, desc, tag]) => ({ label, desc, tag, hasTag: !!tag, go: () => this.newRule(k) })), notScript: rule.mode !== "script", isScript: rule.mode === "script", secs, methods, nums, alerts: bAlerts,
      script: scriptTxt, onScript: (e: any) => { const v = e.target.value; this.setState((s2: any) => ({ rules: s2.rules.map((r: any) => r.id === s2.ruleId ? { ...r, script: v, auto: false } : r) })); },
      resetScript: () => this.setState((s2: any) => ({ rules: s2.rules.map((r: any) => r.id === s2.ruleId ? { ...r, script: null } : r) })), applyScript: () => this.applyScript(), lint,
    };
    const pev = this.evalRule(d), blanksAny = [...d.filters, ...d.scores].some((c: any) => !G[c.k].bool && !this.num(c.v));
    const pvEmpty = pev.top.length ? null : this.emptyReason(pev, d, fn => this.upd(fn));
    const pv = {
      funnel: [{ label: "샘플 종목", value: this.S.length + "개" }, { label: "거르기 통과", value: pev.passed.length + "개" }, { label: "최종 충족", value: pev.final.length + "개" }],
      hasBlankNote: blanksAny, isOk: !!pev.top.length, isEmpty: !pev.top.length,
      rows: pev.final.slice(0, 5).map((r: any, i: number) => ({ rank: i + 1, name: r.s.name, score: r.score, dots: r.conds.filter((c: any) => c.state !== "c").map((c: any) => ({ c: c.state === "y" ? t.ok : c.state === "w" ? t.warn : t.off })), condSum: r.conds.filter((c: any) => c.state === "y").length + "/" + r.conds.filter((c: any) => c.state === "y" || c.state === "n" || c.state === "b").length + "개 충족", hasWarn: r.conds.some((c: any) => c.state === "w"), warnNames: r.conds.filter((c: any) => c.state === "w").map((c: any) => G[c.k].name).join(", ") })),
      firstName: pev.top[0] ? pev.top[0].s.name : "", chartEl: pev.top[0] ? this.chart(pev.top[0].s, null, { compact: true, markers: this.markersOf(pev.top[0].conds, 36) }) : null,
      empty: pvEmpty ? { title: pvEmpty.title, lines: pvEmpty.lines, hasFix: !!pvEmpty.fix, fix: pvEmpty.fix, fixLabel: pvEmpty.fixLabel } : { title: "", lines: [], hasFix: false },
    };
    const icon: any = { err: ["!", t.warn, t.onWarn, "저장 전에 고쳐야 해요"], warn: ["!", t.warnSoft, t.warnInk, "확인해 보세요"], info: ["i", t.sub, t.muted, "참고"], ok: ["✓", t.okSoft, t.okInk, "통과"] };
    const chk = {
      label: errN ? `고칠 곳 ${errN}` : warnN ? "확인 필요" : "통과", bg: errN ? t.warn : warnN ? t.warnSoft : t.okSoft, color: errN ? t.onWarn : warnN ? t.warnInk : t.okInk,
      items: valid.map(([lv, text]) => ({ text, icon: icon[lv][0], bg: icon[lv][1], color: icon[lv][2], kind: icon[lv][3] })),
    };

    const libSec = st.lib, lq = (st.libQ || "").trim().toLowerCase(), lcat = st.libCat || "all";
    const libItems = Object.values(G).filter(g => !(libSec === "scores" && g.only === "filters"));
    const lmatch = (g: any) => !lq || (g.name + " " + g.easy + " " + g.term + " " + g.ex).toLowerCase().includes(lq);
    const libGroups = this.GR.filter(gr => lcat === "all" || gr[0] === lcat).map(gr => ({
      name: gr[1], desc: gr[2], items: libItems.filter(g => g.grp === gr[0] && lmatch(g)).map(g => {
        const used = !!libSec && d[libSec].some((c: any) => c.k === g.key);
        return {
          name: g.name, easy: g.easy, ex: g.ex, term: g.term, addLabel: used ? "추가됨" : "+ 추가", btnBg: used ? t.card : t.pri, btnColor: used ? t.muted : "#fff",
          add: () => { if (used) return; this.upd(dd => { const it: any = { id: this.nid(), k: g.key }; if (!g.bool) it.v = ""; if (libSec === "scores") it.pts = 0; dd[libSec].push(it); return dd; }); this.setState({ lib: null, focusK: g.key }); },
        };
      }),
    })).filter(gr => gr.items.length);
    const lib = {
      open: !!libSec, title: libSec === "filters" ? "거르기 조건 추가" : "점수 조건 추가", sub: libSec === "filters" ? "고른 조건에 안 맞는 종목은 목록에서 빼요" : "맞으면 점수를 줘요. 위험 조건은 감점으로 쓸 수 있어요",
      q: st.libQ || "", onQ: (e: any) => this.setState({ libQ: e.target.value }),
      cats: [["all", "전체"]].concat(this.GR.map(g => [g[0], g[1]])).map(([k, label]) => ({ label, go: () => this.setState({ libCat: k }), bg: lcat === k ? t.ink : t.sub, color: lcat === k ? t.bg : t.muted })),
      groups: libGroups, empty: !libGroups.length, count: libGroups.reduce((a, g) => a + g.items.length, 0) + "개", close: () => this.setState({ lib: null }),
    };
    const R0 = st.rec; let rec: any = { open: false, fields: [], checks: [], feels: [], reasons: [], memo: "", isTrade: false, isSell: false, isSkip: false };
    if (R0) {
      const j = st.journal.find((x: any) => x.id === R0.id), s = this.S[j.si], pq = this.planQty(j), setR = (p: any) => this.setState((s2: any) => ({ rec: { ...s2.rec, ...p } }));
      const numE = (e: any) => parseInt(String(e.target.value).replace(/[^0-9]/g, ""), 10) || 0, tk = this.tick(R0.price || j.entry);
      const qb = (label: string, v: any, f: string) => ({ label, go: () => setR({ [f]: v }), bg: R0[f] === v ? t.ink : t.sub, color: R0[f] === v ? t.bg : t.ink });
      rec = {
        ...rec, open: true, isTrade: R0.mode !== "skip", isSell: R0.mode === "sell", isSkip: R0.mode === "skip", ctaBg: t.pri, ctaColor: "#fff", close: () => this.setState({ rec: null }), save: () => this.saveRec(),
        planLine: "계획 · 살 " + this.fmt(j.entry) + " · 끊기 " + this.fmt(j.stop) + " · 챙기기 " + this.fmt(j.target) + " · " + this.fmt(pq) + "주",
      };
      const priceField = (label: string, hint: string, hintColor: string, quick: any[]) => ({ label, unit: "원", value: this.fmt(R0.price), onChange: (e: any) => setR({ price: numE(e) }), dec: () => setR({ price: Math.max(0, R0.price - tk) }), inc: () => setR({ price: R0.price + tk }), hint, hintColor, quick });
      if (R0.mode === "buy") {
        const d2 = (R0.price - j.entry) / j.entry * 100, ch = this.checksOf(j, { buy: R0.price, qty: R0.qty, exit: null }), loss = Math.max(0, R0.qty * ((R0.price - j.stop) + R0.price * 0.0023));
        Object.assign(rec, {
          tag: "1 / 2 · 산 기록", title: s.name + " 샀어요", cta: "기록하기",
          fields: [priceField("실제 산 가격", Math.abs(d2) < 0.05 ? "계획 가격과 같아요" : "계획보다 " + this.pct(d2), d2 > 1 ? t.warnInk : t.muted, [qb("계획 가격 " + this.fmt(j.entry), j.entry, "price"), qb("지금 가격 " + this.fmt(s.price), s.price, "price")]),
            { label: "산 수량", unit: "주", value: this.fmt(R0.qty), onChange: (e: any) => setR({ qty: numE(e) }), dec: () => setR({ qty: Math.max(0, R0.qty - 1) }), inc: () => setR({ qty: R0.qty + 1 }), hint: R0.qty > pq ? "계획보다 " + this.fmt(R0.qty - pq) + "주 많아요" : "계획 " + this.fmt(pq) + "주", hintColor: R0.qty > pq ? t.warnInk : t.muted,
              quick: [qb("계획대로 " + this.fmt(pq) + "주", pq, "qty"), qb("절반 " + this.fmt(Math.floor(pq / 2)) + "주", Math.floor(pq / 2), "qty")] }],
          sumBig: "산 돈 " + this.fmt(R0.price * R0.qty) + "원", sumColor: t.ink, sumSub: "끊기 가격까지 내려가면 −" + this.fmt(loss) + "원 · " + (st.acct ? "투자금의 " + (loss / st.acct * 100).toFixed(1) + "%" : "투자금 미입력"), checks: ch.items,
        });
      }
      if (R0.mode === "sell") {
        const b = j.buy ?? j.entry, q = j.qty ?? pq, d2 = (R0.price - b) / b * 100, ch = this.checksOf(j, { exit: R0.price }), res = this.jCalc({ ...j, exit: R0.price });
        Object.assign(rec, {
          tag: "2 / 2 · 판 기록", title: s.name + " 팔았어요", cta: "매매일지에 저장", planLine: "산 것 · " + this.fmt(b) + "원 × " + this.fmt(q) + "주 · 끊기 " + this.fmt(j.stop) + " · 챙기기 " + this.fmt(j.target),
          fields: [priceField("실제 판 가격", "산 가격보다 " + this.pct(d2), d2 >= 0 ? t.up : t.down, [qb("챙기기 " + this.fmt(j.target), j.target, "price"), qb("끊기 " + this.fmt(j.stop), j.stop, "price"), qb("지금 " + this.fmt(s.price), s.price, "price")])],
          sumBig: this.won(res.won) + " · " + this.pct(res.pct), sumColor: res.won >= 0 ? t.up : t.down, sumSub: "전부 " + this.fmt(q) + "주를 판 걸로 계산 · 세금·수수료 0.23% 뺀 금액", checks: ch.items,
          feels: ["계획대로 했어요", "너무 일찍 팔았어요", "버티다 늦게 팔았어요", "급하게 샀어요", "망설였어요"].map(f => ({ label: f, go: () => setR({ feel: R0.feel === f ? null : f }), bg: R0.feel === f ? t.ink : t.sub, color: R0.feel === f ? t.bg : t.ink })),
          memo: R0.memo, onMemo: (e: any) => setR({ memo: e.target.value }),
        });
      }
      if (R0.mode === "skip") Object.assign(rec, {
        tag: "계획 정리", title: s.name + " 안 샀어요", cta: "안 산 걸로 기록", ctaBg: R0.reason ? t.pri : t.off, ctaColor: R0.reason ? "#fff" : t.muted,
        reasons: ["살 가격까지 안 왔어요", "마음이 바뀌었어요", "뉴스가 마음에 걸렸어요", "다른 종목을 샀어요"].map(f => ({ label: f, go: () => setR({ reason: f }), bg: R0.reason === f ? t.ink : t.sub, color: R0.reason === f ? t.bg : t.ink })),
      });
    }
    const topN = st.topN || 5, PG = 5, tlen = top.length, hpages = Math.max(1, Math.ceil(tlen / PG)), hpg = Math.min(st.homePage || 0, hpages - 1);
    const homeTop = top.slice(hpg * PG, hpg * PG + PG);
    const hp = {
      count: tlen ? String(tlen) : "", sub: tlen && ev && ev.final.length < topN ? "규칙에 맞는 종목이 " + tlen + "개라 " + tlen + "개만 보여요" : "내 규칙 점수가 높은 순이에요", hasPager: hpages > 1,
      range: (hpg * PG + 1) + "–" + Math.min(tlen, hpg * PG + PG) + " / " + tlen, prev: () => this.setState({ homePage: Math.max(0, hpg - 1) }), next: () => this.setState({ homePage: Math.min(hpages - 1, hpg + 1) }),
      prevColor: hpg > 0 ? t.ink : t.off, nextColor: hpg < hpages - 1 ? t.ink : t.off,
    };
    const topOpts = [3, 5, 10, 15].map(n => ({ label: n + "개", go: () => this.setState({ topN: n, homePage: 0, sel: 0 }), bg: topN === n ? t.card : "transparent", color: topN === n ? t.ink : t.muted }));
    const topNote = !sv ? "규칙이 미완성이라 아직 조건 충족 종목이 없어요" : ev.final.length >= topN ? "지금 규칙으로 오늘 " + ev.final.length + "개가 맞아서 위에서부터 " + topN + "개를 보여드려요" : "지금 규칙으로는 오늘 " + ev.final.length + "개만 맞아서 " + ev.final.length + "개만 보여요";
    const allG = Object.values(G), gq = (st.glossQ || "").trim().toLowerCase(), gcat = st.glossCat || "all";
    const gmGroups = (gcat === "color" ? [] : this.GR.filter(gr => gcat === "all" || gr[0] === gcat)).map(gr => ({ name: gr[1], desc: gr[2], items: allG.filter(g => g.grp === gr[0] && (!gq || (g.name + " " + g.easy + " " + g.term + " " + g.fx + " " + g.js + " " + g.ex).toLowerCase().includes(gq))).map(g => ({ name: g.name, easy: g.easy, ex: g.ex, term: g.term, fx: g.fx, js: "s." + g.js })) })).filter(gr => gr.items.length);
    const showColors = (gcat === "all" || gcat === "color") && (!gq || "색 빨강 파랑 초록 노랑 회색 상승 하락 경고 감점".includes(gq));
    const gm = {
      q: st.glossQ || "", onQ: (e: any) => this.setState({ glossQ: e.target.value }), groups: gmGroups, showColors, empty: !gmGroups.length && !showColors, count: gmGroups.reduce((a, g) => a + g.items.length, 0) + "개",
      cats: [["all", "전체"]].concat(this.GR.map(g => [g[0], g[1]]), [["color", "색의 뜻"]]).map(([k, label]) => ({ label, go: () => this.setState({ glossCat: k }), bg: gcat === k ? t.ink : t.sub, color: gcat === k ? t.bg : t.muted })),
    };
    const ruleMgmt = st.rules.map((r: any) => {
      const cnt = r.draft.filters.length + r.draft.scores.length, many = st.rules.length > 1;
      return {
        name: r.name, tag: !r.saved ? "미완성" : r.example ? "예시 필터" : "", hasTag: !r.saved || !!r.example, isActive: r.id === st.ruleId,
        meta: (r.saved ? "v" + r.version : "저장 전") + " · " + modeRo[r.mode] + " 만듦 · 조건 " + cnt + "개 · " + r.edited,
        confirm: st.delId === r.id, notConfirm: st.delId !== r.id, delColor: many ? t.warnInk : t.off,
        edit: () => this.setState((s2: any) => ({ editModal: { prev: s2.editModal ? s2.editModal.prev : s2.ruleId }, ruleId: r.id, delId: null, fx: {}, fxErr: {}, focusK: null, fromJournal: false, saveState: "idle" })), dup: () => this.dupRule(r.id),
        del: () => { if (many) this.setState({ delId: r.id }); }, cancel: () => this.setState({ delId: null }), doDel: () => this.deleteRule(r.id),
      };
    });
    const acctSet = {
      has: !!st.acct, clear: () => this.setState({ acct: 0 }, () => { if (this.acctRef.current) this.acctRef.current.focus(); }), value: st.acct ? this.fmt(st.acct) : "", onChange: (e: any) => this.setState({ acct: parseInt(String(e.target.value).replace(/[^0-9]/g, ""), 10) || 0 }),
      quick: [[5000000, "500만"], [10000000, "1,000만"], [30000000, "3,000만"], [50000000, "5,000만"]].map(([v, l]) => ({ label: l, go: () => this.setState({ acct: v }), bg: st.acct === v ? t.ink : t.sub, color: st.acct === v ? t.bg : t.ink })),
      note: st.acct ? "지금 규칙 기준 ‘한 번에 잃어도 되는 돈’은 " + (sv ? sv.plan.risk : 1) + "% = " + this.fmt(st.acct * (sv ? sv.plan.risk : 1) / 100) + "원이에요" : "비워 두면 최대 수량을 계산하지 않아요",
    };
    const rs2 = {
      open: !!st.ruleMenu, toggle: () => this.setState((s2: any) => ({ ruleMenu: !s2.ruleMenu })), close: () => this.setState({ ruleMenu: false }), rot: st.ruleMenu ? "rotate(180deg)" : "none",
      name: rule.name, ver: rule.saved ? "v" + rule.version : "저장 전", count: st.rules.length + "개",
      newRule: () => this.setState({ ruleMenu: false, newMenu: true }), manage: () => this.setState({ ruleMenu: false, page: "settings" }),
      items: st.rules.map((r: any) => {
        const dr = !!r.saved && this.dirty(r), tag = !r.saved ? "미완성" : dr ? "수정 중" : r.example ? "예시 필터" : "";
        return { name: r.name, hasTag: !!tag, tag, tagBg: !r.saved || dr ? t.warnSoft : t.sub, tagColor: !r.saved || dr ? t.warnInk : t.muted, meta: (r.saved ? "v" + r.version : "저장 전") + " · " + modeName[r.mode] + " · " + r.edited, check: r.id === rule.id ? "✓" : "", bg: r.id === rule.id ? t.priSoft : "transparent", go: () => { this.switchRule(r.id); this.setState({ ruleMenu: false }); } };
      }),
    };
    const firstIssue = valid.find(i => i[0] === "err") || valid.find(i => i[0] === "warn") || valid[0];
    const em = {
      open: !!st.editModal, close: () => this.setState((s2: any) => ({ editModal: null, ruleId: s2.editModal ? s2.editModal.prev : s2.ruleId, fx: {}, fxErr: {}, focusK: null })),
      goBuilder: () => this.setState({ editModal: null, page: "builder" }), issue: firstIssue ? firstIssue[1] : "",
    };
    // shell
    const hitN = alist.filter(a => a.type === "hit").length;
    const nav = ([["home", "홈"], ["cands", "내 조건 충족 종목"], ["alerts", "알림", hitN], ["journal", "매매일지"], ["builder", "규칙 빌더"], ["settings", "설정"]] as [string, string, number?][]).map(([k, label, badge]) => ({
      label, badge, hasBadge: !!badge && k !== page, go: this.go(k), bg: k === page ? t.navOn : "transparent", color: k === page ? t.ink : t.muted, weight: k === page ? 700 : 500,
    }));
    const titles: any = { home: ["안녕하세요", noRule ? "규칙을 만들면 오늘 시장을 내 조건으로 걸러 드려요" : "내가 만든 규칙으로 오늘 시장을 걸러 봤어요"], cands: ["내 조건 충족 종목", noRule ? "규칙을 만들면 조건에 맞는 종목을 점수 순으로 보여드려요" : `‘${rule.name}’ 규칙에 잘 맞는 순서예요`], alerts: ["알림", "규칙 조건 · 계획 가격 · 공시 소식을 모았어요"], journal: ["매매일지", "계획과 결과를 남기면 규칙을 고칠 곳이 보여요"], builder: ["규칙 빌더", "블록을 고르고 숫자만 넣으면 나만의 규칙이 돼요"], settings: ["설정", "화면, 알림, 용어를 한곳에서 정해요"] };
    const mk = demo === "장 마감" ? { label: "장 마감", time: "15:30", dot: t.faint } : demo === "데이터 지연" ? { label: "시세 3분 지연", time: "12:59", dot: t.warn } : { label: "장 열림", time: "13:02", dot: t.ok };
    const isB = page === "builder";
    const banners: any[] = [];
    if (!isB && page !== "journal" && page !== "settings") {
      if (demo === "장 마감") banners.push({ title: "장이 끝났어요", text: "오늘 15:30 종가 기준 결과예요. 지금 세우는 계획은 내일 09:00부터 쓸 수 있어요.", bg: t.card, color: t.ink });
      if (demo === "데이터 지연") banners.push({ title: "시세가 3분 늦게 들어오고 있어요", text: "점수와 가격이 실제와 조금 다를 수 있어요. 12:59 데이터 기준으로 계산했어요.", bg: t.warnSoft, color: t.warnInk });
    }
    const fl = st.flow, anySaved = st.rules.some((r: any) => r.saved);
    const steps: [string, string, boolean][] = [["규칙 만들기", "블록으로 조립", !noRule], ["미리보기", "어제였다면?", !noRule], ["저장", "버전으로 남겨요", anySaved], ["종목 확인", "조건 충족 종목", fl.top5], ["계획 계산", "살 수량·손익", fl.plan], ["일지 기록", "결과 남기기", fl.journal], ["규칙 고치기", "기록 보고 수정", fl.edit]];
    const curI = steps.findIndex(s => !s[2]);
    const flow = {
      sub: curI < 0 ? "한 바퀴 다 돌았어요. 이제 이 순서를 반복하면 돼요" : `${steps.filter(s => s[2]).length} / 7단계 · 다음은 ‘${steps[curI][0]}’${this.ieyo(steps[curI][0])}`,
      steps: steps.map(([label, sub, dn], i) => ({ label, sub, lineL: i === 0 ? "transparent" : (steps[i - 1][2] ? t.pri : t.off), lineR: i === steps.length - 1 ? "transparent" : (dn ? t.pri : t.off), dotBorder: dn ? t.pri : i === curI ? t.pri : t.off, halo: i === curI ? "0 0 0 4px " + t.priSoft : "none", weight: i === curI ? 700 : 600, ink: dn ? t.ink : i === curI ? t.priInk : t.muted, icon: dn ? "✓" : String(i + 1), dotBg: dn ? t.pri : t.card, dotInk: dn ? "#fff" : i === curI ? t.priInk : t.muted })),
      ctaLabel: curI < 0 ? "새 규칙 만들기" : ["첫 규칙 만들기", "미리보기 해 보기", "규칙 저장하기", "조건 충족 종목 보기", "종목 보고 계획 계산하기", "일지에 결과 남기기", "일지 보고 규칙 고치기"][curI],
      cta: curI < 0 || curI === 0 ? () => this.newRule() : curI <= 2 ? this.go("builder") : curI <= 4 ? this.go("cands") : this.go("journal"),
    };
    const pj = st.journal.find((j: any) => j.status === "plan");
    const homePlan = pj ? { has: true, name: this.S[pj.si].name, line: "살 " + this.fmt(pj.entry) + " · 끊기 " + this.fmt(pj.stop) + " · 챙기기 " + this.fmt(pj.target), buy: () => this.openRec(pj.id, "buy") } : { has: false, buy: null };
    const colorLegend = [{ color: t.up, label: "빨강 · 상승·이익", desc: "국내 관례대로 오르면 빨강이에요" }, { color: t.down, label: "파랑 · 하락·손실", desc: "내리면 파랑이에요" }, { color: t.ok, label: "초록 · 조건 충족 ✓", desc: "가격 색과 헷갈리지 않게 초록을 써요" }, { color: t.warn, label: "노랑 · 감점·경고 !", desc: "감점 조건, 데이터 지연, 고칠 곳" }, { color: t.off, label: "회색 · 미충족 ✕ · 해당 없음", desc: "점수에 영향이 없어요" }];
    const ts = st.toast; if (ts && ts !== this._lt) { this._lt = ts; clearTimeout(this.tx); this.tx = setTimeout(() => { if (this.state.toast === ts) this.setState({ toast: null }); }, 6000); }
    const tt = ts ? ({ hit: ["알림 · 조건 충족", t.ok, t.onOk], ok: ["완료", t.ok, t.onOk], warn: ["확인 필요", t.warn, t.onWarn], info: ["안내", t.off, t.ink] } as any)[ts.kind] : null;
    const toast = ts ? { tag: tt[0], tagBg: tt[1], tagColor: tt[2], title: ts.title, body: ts.body, hasAct: !!ts.act, actLabel: ts.actLabel || "" } : { hasAct: false };

    return {
      acctRef: this.acctRef, t, L, nav, mk, ruleSel, pnl, hold, alertRuleLine, hasAlertSet: !!sv, alertToggles, banners, showTerms, skel, rs, top,
      pageTitle: titles[page][0], pageSub: titles[page][1],
      side: { name: rule.name, meta: noRule ? "규칙 빌더에서 첫 규칙을 만들어 주세요" : rule.saved ? `v${rule.version} · ${modeName[rule.mode]}` : "미완성" },
      isHome: page === "home", isCands: page === "cands", isAlerts: page === "alerts", isJournal: page === "journal", isBuilder: isB, isSettings: page === "settings", goSettings: this.go("settings"),
      termsSw: { toggle: () => this.setState({ terms: !showTerms }), swBg: showTerms ? t.pri : t.off, swJustify: showTerms ? "flex-end" : "flex-start" },
      themeOpts: [["A", "A 라이트", "왼쪽 메뉴 · 밝은 화면"], ["B", "B 다크", "위쪽 메뉴 · 어두운 화면"]].map(([k, label, sub]) => ({ label, sub, go: () => this.setState({ look: k }), border: k === look ? t.pri : "transparent", radio: k === look ? "6px solid " + t.pri : "2px solid " + t.off, dir: k === "A" ? "row" : "column", pBg: k === "A" ? "oklch(0.965 0.004 260)" : "oklch(0.16 0.008 260)", barBg: k === "A" ? "#fff" : "oklch(0.21 0.01 260)", barW: k === "A" ? "26%" : "100%", barH: k === "A" ? "100%" : "16px", cardBg: k === "A" ? "#fff" : "oklch(0.25 0.012 260)" })),
      flow, homePlan, homeAlerts: alist.slice(0, 3).map(mapA),
      goCands: this.go("cands"), goAlerts: this.go("alerts"),
      sel, selChart, chartBtn: { lineBg: st.chart === "line" ? t.card : "transparent", lineColor: st.chart === "line" ? t.ink : t.muted, candleBg: st.chart !== "line" ? t.card : "transparent", candleColor: st.chart !== "line" ? t.ink : t.muted }, setLine: () => this.setState({ chart: "line" }), setCandle: () => this.setState({ chart: "candle" }), pb, calcRows, calc, planBtn, savePlan: () => this._savePlan && this._savePlan(),
      candNote: rsKind === "ok" ? `${ev.passed.length}개가 거르기를 통과했고, 그중 ${ev.final.length}개가 점수 ${sv.minScore}점·손익비 ${sv.plan.minRR} 이상이에요. 오른다는 보장은 아니에요.` : "",
      alerts, alertChips, alertsEmpty: !alerts.length,
      jStats, jRows, insight,
      bd, pv, chk,
      consentOpen: !!st.consentOpen, showConsent: () => this.setState({ consentOpen: true }), confirmConsent: () => { try { localStorage.setItem(CONSENT_KEY, "1"); } catch {} this.setState({ consentOpen: false }); },
      consentItems: [{ n: "1", title: "정보제공·학습용 도구예요", desc: "내가 정한 조건으로 종목을 걸러 보여줄 뿐이에요. 투자판단과 책임은 이용자에게 있어요." }, { n: "2", title: "사고팔라고 권하지 않아요", desc: "‘내 조건 충족 종목’은 추천 종목이 아니에요. 과거 결과가 앞으로도 같다는 뜻도 아니에요." }, { n: "3", title: "자동주문·일임이 없어요", desc: "주문은 증권 앱에서 직접 해요. 룰메이트는 계획 계산과 기록만 도와드려요." }],
      rs2, em, ruleMgmt, acctSet, newRuleGo: () => this.newRule(),
      lib, rec, pend, homeTop, hp, topOpts, topNote, gm, candCount: top.length + "개", planHint, planTrack, glossOpen: st.gloss, openGloss: () => this.setState({ gloss: true, glossCat: "all", glossQ: "" }), closeGloss: () => this.setState({ gloss: false }), stop: (e: any) => e.stopPropagation(), colorLegend,
      hasToast: !!ts, toast, closeToast: () => this.setState({ toast: null }), toastAct: () => ts && this.doAct(ts.act, ts.si),
    };
  }

  render() {
    if (!this.state.ready) return null;
    return <Shell v={this.renderVals()} />;
  }
}
