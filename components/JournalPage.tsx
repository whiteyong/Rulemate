import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function JournalPage({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {!!(v.pend.has) && (
          <>
            <section style={{ background: v.t.card, borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "700" }}>
                      기록할 게 있어요
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "700", padding: "3px 9px", borderRadius: "999px", background: "oklch(0.6 0.19 255)", color: "#fff" }}>
                      {v.pend.count}
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: v.t.muted }}>
                    증권 앱에서 사고판 뒤, 여기서 실제 가격만 남기면 돼요
                  </div>
                </div>
              </div>
              {(v.pend.items as any[]).map((p: any, i20: number) => (
                <Fragment key={i20}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "16px 18px", borderRadius: "18px", background: v.t.sub }}>
                    <div style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: p.tagBg, color: p.tagColor }}>
                          {p.tag}
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          {p.name}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", color: v.t.muted, fontVariantNumeric: "tabular-nums" }}>
                        {p.line}
                      </span>
                    </div>
                    {!!(p.isPlan) && (
                      <>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={p.skip} style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "12px", background: v.t.card, color: v.t.ink, fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                            안 샀어요
                          </button>
                          <button onClick={p.buy} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                            샀어요
                          </button>
                        </div>
                      </>
                    )}
                    {!!(p.isHold) && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", color: p.evalColor }}>
                            {p.evalStr}
                          </span>
                          <button onClick={p.sell} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                            팔았어요
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Fragment>
              ))}
            </section>
          </>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
          {(v.jStats as any[]).map((s: any, i21: number) => (
            <Fragment key={i21}>
              <div style={{ background: v.t.card, borderRadius: "22px", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "14px", color: v.t.muted, fontWeight: "600" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "13px", color: v.t.muted }}>
                  {s.desc}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        {!!(v.insight.has) && (
          <>
            <section style={{ background: v.t.card, borderRadius: "24px", padding: "24px 26px", display: "flex", flexWrap: "wrap", gap: "20px 24px", alignItems: "center" }}>
              <div style={{ flex: "2 1 320px", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ alignSelf: "flex-start", fontSize: "12px", fontWeight: "700", padding: "4px 9px", borderRadius: "7px", background: v.t.warnSoft, color: v.t.warnInk }}>
                  기록에서 찾은 것
                </span>
                <div style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.45", textWrap: "pretty" }}>
                  {v.insight.title}
                </div>
                <div style={{ fontSize: "14px", lineHeight: "1.55", color: v.t.muted, textWrap: "pretty" }}>
                  {v.insight.desc}
                </div>
              </div>
              <div style={{ flex: "1 1 240px", minWidth: "0", background: v.t.sub, borderRadius: "16px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", gap: "10px" }}>
                  <span style={{ color: v.t.muted }}>
                    감점 있던 매매 평균
                  </span>
                  <span style={{ fontWeight: "700", color: v.insight.withColor }}>
                    {v.insight.withStr}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", gap: "10px" }}>
                  <span style={{ color: v.t.muted }}>
                    감점 없던 매매 평균
                  </span>
                  <span style={{ fontWeight: "700", color: v.insight.withoutColor }}>
                    {v.insight.withoutStr}
                  </span>
                </div>
              </div>
              <button onClick={v.insight.fix} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "14px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                미리보기로 비교해 보기
              </button>
            </section>
          </>
        )}
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "24px 24px 10px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              매매 기록
            </div>
            <div style={{ fontSize: "13px", color: v.t.muted }}>
              줄을 누르면 그때 차트와 계획을 볼 수 있어요
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.6fr) minmax(104px,1fr) 80px", gap: "12px", padding: "10px 8px", fontSize: "13px", color: v.t.muted, fontWeight: "600", borderBottom: `1px solid ${v.t.line}` }}>
            <span>
              날짜
            </span>
            <span>
              종목
            </span>
            <span>
              규칙 · 버전
            </span>
            <span>
              그때 조건
            </span>
            <span style={{ textAlign: "right" }}>
              결과
            </span>
            <span style={{ textAlign: "center" }}>
              규칙
            </span>
          </div>
          {!(v.jRows as any[]).length && (
            <div style={{ padding: "36px 8px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>아직 남긴 기록이 없어요</div>
              <div style={{ fontSize: "14px", lineHeight: "1.5", color: v.t.muted }}>내 조건 충족 종목에서 계획을 세워 일지에 저장하면, 산 기록·판 기록과 함께 여기에 쌓여요.</div>
            </div>
          )}
          {(v.jRows as any[]).map((j: any, i22: number) => (
            <Fragment key={i22}>
              <div style={{ display: "flex", flexDirection: "column", borderBottom: `1px solid ${v.t.line}` }}>
                <button onClick={j.toggle} style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.6fr) minmax(104px,1fr) 80px", gap: "12px", padding: "14px 8px", fontSize: "15px", alignItems: "center", border: "0", background: j.rowBg, color: "inherit", textAlign: "left", cursor: "pointer", borderRadius: "12px" }}>
                  <span style={{ color: v.t.muted, fontVariantNumeric: "tabular-nums" }}>
                    {j.date}
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    {j.name}
                  </span>
                  <span style={{ fontSize: "13px", color: v.t.muted, wordBreak: "keep-all", lineHeight: "1.4" }}>
                    {j.ver}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                    <span style={{ display: "flex", gap: "3px" }}>
                      {(j.dots as any[]).map((d: any, i23: number) => (
                        <Fragment key={i23}>
                          <span style={{ width: "14px", height: "6px", borderRadius: "3px", background: d.c }}></span>
                        </Fragment>
                      ))}
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted }}>
                      {j.condSum}
                      {!!(j.hasWarn) && (
                        <>
                          <span style={{ fontWeight: "600", color: v.t.warnInk }}>
                            {" "}· 감점 {j.warnNames}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ fontWeight: "700", whiteSpace: "nowrap", color: j.color }}>
                      {j.pctStr}
                    </span>
                    <span style={{ fontSize: "13px", whiteSpace: "nowrap", color: j.color }}>
                      {j.wonStr}
                    </span>
                  </span>
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", padding: "4px 9px", borderRadius: "7px", whiteSpace: "nowrap", background: j.ruleBg, color: j.ruleColor }}>
                      {j.rule}
                    </span>
                  </span>
                </button>
                {!!(j.open) && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "20px", padding: "6px 8px 20px", alignItems: "start" }}>
                      <div style={{ background: v.t.sub, borderRadius: "16px", padding: "14px" }}>
                        {j.chartEl}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ position: "relative", height: "10px", display: "flex", gap: "3px" }}>
                            <div style={{ borderRadius: "5px", flex: j.pb.lossFlex, background: v.t.trackDown }}></div>
                            <div style={{ borderRadius: "5px", flex: j.pb.gainFlex, background: v.t.trackUp }}></div>
                            <div style={{ position: "absolute", top: "-4px", width: "18px", height: "18px", borderRadius: "50%", boxSizing: "border-box", transform: "translateX(-50%)", left: j.pb.curPos, background: v.t.ink, border: `3px solid ${v.t.card}` }}></div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                            <span style={{ color: v.t.down }}>
                              손절 {j.pb.stopStr}
                            </span>
                            <span>
                              살 가격 {j.pb.entryStr}
                            </span>
                            <span style={{ color: v.t.up }}>
                              목표 {j.pb.targetStr}
                            </span>
                          </div>
                        </div>
                        <div style={{ background: v.t.sub, borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {(j.facts as any[]).map((f: any, i24: number) => (
                            <Fragment key={i24}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px" }}>
                                <span style={{ color: v.t.muted, whiteSpace: "nowrap" }}>
                                  {f.label}
                                </span>
                                <span style={{ fontWeight: "600", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                  {f.value}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        {!!(j.hasChecks) && (
                          <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {(j.checks as any[]).map((c: any, i25: number) => (
                                <Fragment key={i25}>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
                                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", background: c.bg, color: c.color }}>
                                      {c.icon}
                                    </span>
                                    <span>
                                      {c.text}
                                    </span>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        )}
                        {!!(j.hasMemo) && (
                          <>
                            <div style={{ fontSize: "14px", lineHeight: "1.5", color: v.t.muted }}>
                              “{j.memoLine}”
                            </div>
                          </>
                        )}
                        {!!(j.isPlan) && (
                          <>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={j.skip} style={{ flex: "1", height: "44px", border: "0", borderRadius: "12px", background: v.t.sub, color: v.t.ink, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                                안 샀어요
                              </button>
                              <button onClick={j.buy} style={{ flex: "2", height: "44px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                                샀어요 · 기록하기
                              </button>
                            </div>
                          </>
                        )}
                        {!!(j.isHold) && (
                          <>
                            <button onClick={j.sell} style={{ height: "44px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                              팔았어요 · 기록하기
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Fragment>
          ))}
        </section>
      </div>
    </>
  );
}
