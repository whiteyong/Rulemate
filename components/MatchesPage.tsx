import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function MatchesPage({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {!!(v.candsOk) && (
          <>
            <div className="rm-split-800" style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
              <div className="rm-sticky" style={{ flex: "1 1 260px", maxWidth: "340px", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px", position: "sticky", top: "88px", maxHeight: "calc(100vh - 110px)", overflowY: "auto", overflowX: "hidden", padding: "0 4px 8px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    충족 {v.candCount}
                  </span>
                  {v.recalc.show ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: v.t.muted }}>
                      {v.recalc.time}
                      <button onClick={v.recalc.go} disabled={v.recalc.busy} title="지금 시세로 점수를 다시 계산해요" style={{ border: "0", cursor: v.recalc.busy ? "default" : "pointer", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", background: v.t.priSoft, color: v.t.priInk, opacity: v.recalc.busy ? 0.6 : 1 }}>
                        {v.recalc.label}
                      </button>
                    </span>
                  ) : (
                    <span style={{ fontSize: "12px", color: v.t.muted }}>
                      내 규칙 점수 순
                    </span>
                  )}
                </div>
                {(v.top as any[]).map((s: any, i11: number) => (
                  <Fragment key={i11}>
                    <button onClick={s.select} style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", cursor: "pointer", color: "inherit", padding: "18px 20px", borderRadius: "20px", background: v.t.card, border: `2px solid ${s.border}` }}>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "800", color: v.t.priInk }}>
                            {s.rank}
                          </span>
                          <span style={{ fontSize: "17px", fontWeight: "700" }}>
                            {s.name}
                          </span>
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.priInk, background: v.t.priSoft, padding: "4px 8px", borderRadius: "7px" }}>
                          {s.score}점
                        </span>
                      </span>
                      <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                          {s.priceStr}원
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: s.chgColor }}>
                          {s.chgStr}
                        </span>
                      </span>
                      <span style={{ fontSize: "13px", lineHeight: "1.45", color: v.t.muted, textWrap: "pretty" }}>
                        {s.reason}
                      </span>
                    </button>
                  </Fragment>
                ))}
                {!!(v.near as any[]).length && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 4px 0", gap: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: v.t.muted }}>아깝게 빠진 종목 {(v.near as any[]).length}개</span>
                      <span style={{ fontSize: "12px", color: v.t.muted, whiteSpace: "nowrap" }}>기준 미달 · 점수 순</span>
                    </div>
                    {(v.near as any[]).map((s: any, i: number) => (
                      <Fragment key={"near" + i}>
                        <button onClick={s.select} style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", cursor: "pointer", color: "inherit", padding: "16px 20px", borderRadius: "20px", background: v.t.card, border: `2px ${s.selected ? "solid" : "dashed"} ${s.selected ? v.t.pri : v.t.off}` }}>
                          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "700", color: v.t.muted }}>{s.name}</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted, background: v.t.sub, padding: "4px 8px", borderRadius: "7px", whiteSpace: "nowrap" }}>{s.score}점</span>
                          </span>
                          <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "15px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: v.t.muted }}>{s.priceStr}원</span>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: s.chgColor }}>{s.chgStr}</span>
                          </span>
                          <span style={{ fontSize: "13px", lineHeight: "1.45", color: v.t.warnInk, textWrap: "pretty" }}>{s.miss}</span>
                        </button>
                      </Fragment>
                    ))}
                  </>
                )}
                <div style={{ fontSize: "12px", color: v.t.faint, lineHeight: "1.55", padding: "4px 8px", textWrap: "pretty" }}>
                  {v.candNote}
                </div>
              </div>
              <div style={{ flex: "999 1 520px", display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ fontSize: "14px", color: v.t.muted }}>
                        {v.sel.tagLine}
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                        {v.sel.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                        <span style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                          {v.sel.priceStr}원
                        </span>
                        <span style={{ fontSize: "17px", fontWeight: "700", color: v.sel.chgColor }}>
                          {v.sel.chgStr}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <div style={{ display: "flex", borderRadius: "12px", padding: "4px", gap: "2px", background: v.t.sub }}>
                        <button onClick={v.setLine} style={{ border: "0", cursor: "pointer", padding: "8px 16px", borderRadius: "9px", fontSize: "14px", fontWeight: "700", background: v.chartBtn.lineBg, color: v.chartBtn.lineColor }}>
                          선
                        </button>
                        <button onClick={v.setCandle} style={{ border: "0", cursor: "pointer", padding: "8px 16px", borderRadius: "9px", fontSize: "14px", fontWeight: "700", background: v.chartBtn.candleBg, color: v.chartBtn.candleColor }}>
                          캔들
                        </button>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "700", padding: "5px 9px", borderRadius: "7px", background: v.sel.dataBg, color: v.sel.dataColor }}>
                        {v.sel.dataLabel}
                      </span>
                    </div>
                  </div>
                  <div style={{ width: "100%" }}>
                    {v.selChart}
                  </div>
                  <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "13px", color: v.t.muted }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "16px", height: "0", borderTop: "2px dashed oklch(0.6 0.12 300)" }}></span>
                      오늘 평균 거래가격
                      {!!(v.showTerms) && (
                        <>
                          <span style={{ color: v.t.faint }}>
                            (VWAP)
                          </span>
                        </>
                      )}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: v.t.ok }}></span>
                      조건이 맞은 지점
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: v.t.warn }}></span>
                      감점이 걸린 지점
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "16px", height: "0", borderTop: `2px dashed ${v.t.down}` }}></span>
                      손절 · 목표
                      <span style={{ width: "16px", height: "0", borderTop: `2px dashed ${v.t.up}` }}></span>
                    </span>
                  </div>
                </section>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))", gap: "20px", alignItems: "start" }}>
                  <section style={{ background: v.t.card, borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", gap: "12px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700" }}>
                        왜 조건에 맞았나요?
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: v.t.priInk, whiteSpace: "nowrap" }}>
                        내 규칙 점수 {v.sel.score}점
                        <span style={{ color: v.t.faint, fontWeight: "600" }}>
                          {" "}/ {v.sel.maxPts}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", height: "8px", gap: "3px", marginBottom: "8px" }}>
                      {(v.sel.segs as any[]).map((g: any, i12: number) => (
                        <Fragment key={i12}>
                          <div style={{ borderRadius: "4px", flex: g.flex, background: g.color, opacity: g.op }}></div>
                        </Fragment>
                      ))}
                    </div>
                    {(v.sel.conds as any[]).map((c: any, i13: number) => (
                      <Fragment key={i13}>
                        <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto", gap: "12px", alignItems: "start", padding: "12px 0", borderTop: `1px solid ${v.t.line}` }}>
                          <span style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", background: c.iconBg, color: c.iconColor }}>
                            {c.icon}
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                            <span style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.45", color: c.ink }}>
                                {c.name}
                              </span>
                              {!!(v.showTerms) && (
                                <>
                                  <span style={{ fontSize: "12px", fontWeight: "500", color: v.t.faint }}>
                                    {c.term}
                                  </span>
                                </>
                              )}
                            </span>
                            <span style={{ fontSize: "13px", lineHeight: "1.45", color: v.t.muted, textWrap: "pretty" }}>
                              {c.desc}
                            </span>
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: "700", paddingTop: "4px", color: c.ptsColor }}>
                            {c.ptsStr}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </section>
                  <section style={{ background: v.t.card, borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700" }}>
                        내 계획 계산해 보기
                      </div>
                      <div style={{ fontSize: "14px", color: v.t.muted }}>
                        내가 정한 가격과 손실 한도로 수량을 계산해요
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ position: "relative", height: "8px", display: "flex", gap: "3px" }}>
                        <div style={{ borderRadius: "4px", flex: v.pb.lossFlex, background: v.t.trackDown }}></div>
                        <div style={{ borderRadius: "4px", flex: v.pb.gainFlex, background: v.t.trackUp }}></div>
                        <div style={{ position: "absolute", top: "-4px", width: "16px", height: "16px", borderRadius: "50%", boxSizing: "border-box", transform: "translateX(-50%)", left: v.pb.curPos, background: v.t.ink, border: `3px solid ${v.t.card}` }}></div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>
                        <span style={{ color: v.t.down }}>
                          손절 {v.pb.stopStr}
                        </span>
                        <span style={{ color: v.t.muted }}>
                          살 가격 {v.pb.entryStr}
                        </span>
                        <span style={{ color: v.t.up }}>
                          목표 {v.pb.targetStr}
                        </span>
                      </div>
                    </div>
                    {(v.calcRows as any[]).map((r: any, i14: number) => (
                      <Fragment key={i14}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: r.labelColor }}>
                              {r.label}
                            </span>
                            {!!(v.showTerms) && (
                              <>
                                <span style={{ fontSize: "12px", color: v.t.faint }}>
                                  {r.term}
                                </span>
                              </>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "14px", height: "54px", padding: "0 7px", background: v.t.sub }}>
                            <button onClick={r.dec} style={{ width: "40px", height: "40px", border: "0", borderRadius: "10px", fontSize: "20px", fontWeight: "600", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                              −
                            </button>
                            <input value={r.value} onChange={r.onChange} inputMode="numeric" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", textAlign: "center", fontSize: "19px", fontWeight: "700", outline: "none", fontVariantNumeric: "tabular-nums", color: v.t.ink }} />
                            <button onClick={r.inc} style={{ width: "40px", height: "40px", border: "0", borderRadius: "10px", fontSize: "20px", fontWeight: "600", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                              +
                            </button>
                          </div>
                          <div style={{ fontSize: "13px", color: v.t.muted }}>
                            {r.hint}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: v.t.sub }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                          {v.calc.qtyLine}
                        </span>
                        <span style={{ fontSize: "14px", color: v.t.muted, fontVariantNumeric: "tabular-nums" }}>
                          {v.calc.needLine}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: "1.5", color: v.t.muted, textWrap: "pretty" }}>
                        {v.calc.riskLine}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", gap: "3px" }}>
                          <div style={{ borderRadius: "5px", flex: v.calc.lossFlex, background: v.t.down }}></div>
                          <div style={{ borderRadius: "5px", flex: v.calc.gainFlex, background: v.t.up }}></div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                          <span style={{ color: v.t.down }}>
                            잘못되면 {v.calc.lossStr}
                          </span>
                          <span style={{ color: v.t.up }}>
                            잘되면 {v.calc.gainStr}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", gap: "10px", borderTop: `1px solid ${v.t.line}` }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700" }}>
                            {v.calc.rrLine}
                          </span>
                          {!!(v.showTerms) && (
                            <>
                              <span style={{ fontSize: "12px", color: v.t.faint }}>
                                손익비 · 내 규칙 기준 {v.calc.minRR} 이상
                              </span>
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "700", padding: "6px 10px", borderRadius: "8px", whiteSpace: "nowrap", background: v.calc.rrBg, color: v.calc.rrColor }}>
                          {v.calc.rrBadge}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {(v.planTrack as any[]).map((p: any, i15: number) => (
                        <Fragment key={i15}>
                          <span style={{ flex: "1", display: "flex", alignItems: "center", gap: "6px", minWidth: "0" }}>
                            <span style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", background: p.dotBg, color: p.dotInk }}>
                              {p.icon}
                            </span>
                            <span style={{ fontSize: "13px", whiteSpace: "nowrap", fontWeight: p.weight, color: p.ink }}>
                              {p.label}
                            </span>
                            <span style={{ flex: "1", height: "2px", minWidth: "6px", background: p.line }}></span>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <button onClick={v.savePlan} style={{ height: "56px", border: "0", borderRadius: "16px", fontSize: "17px", fontWeight: "700", cursor: "pointer", background: v.planBtn.bg, color: v.planBtn.color }} className="rm-press">
                      {v.planBtn.label}
                    </button>
                    <div style={{ fontSize: "12px", color: v.t.faint, textAlign: "center", lineHeight: "1.5", textWrap: "pretty" }}>
                      {v.planHint}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </>
        )}
        {!!(v.rs.isLoading) && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(v.skel as any[]).map((k: any, i16: number) => (
                  <Fragment key={i16}>
                    <div style={{ height: "112px", borderRadius: "20px", background: v.t.card, display: "flex", flexDirection: "column", gap: "10px", padding: "18px", boxSizing: "border-box" }}>
                      <span style={{ height: "16px", width: "50%", borderRadius: "6px", background: v.t.sub }}></span>
                      <span style={{ height: "14px", width: "35%", borderRadius: "6px", background: v.t.sub }}></span>
                      <span style={{ height: "20px", width: "80%", borderRadius: "10px", background: v.t.sub }}></span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ height: "460px", borderRadius: "24px", background: v.t.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: v.t.muted, fontWeight: "600" }}>
                ‘{v.side.name}’ 규칙으로 종목을 계산하고 있어요…
              </div>
            </div>
          </>
        )}
        {!!(v.candsMsg) && (
          <>
            <section style={{ background: v.t.card, borderRadius: "24px", padding: "56px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: v.t.sub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800", color: v.t.muted }}>
                {v.rs.icon}
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                {v.rs.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "520px" }}>
                {(v.rs.lines as any[]).map((ln: any, i17: number) => (
                  <Fragment key={i17}>
                    <div style={{ fontSize: "15px", lineHeight: "1.6", color: v.t.muted, textWrap: "pretty" }}>
                      {ln}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                <button onClick={v.rs.act} style={{ height: "48px", padding: "0 20px", border: "0", borderRadius: "14px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                  {v.rs.btn}
                </button>
                {!!(v.rs.hasBtn2) && (
                  <>
                    <button onClick={v.rs.act2} style={{ height: "48px", padding: "0 20px", border: "0", borderRadius: "14px", background: v.t.sub, color: v.t.ink, fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                      {v.rs.btn2}
                    </button>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
