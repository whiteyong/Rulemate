import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function RuleEditModal({ v }: { v: ViewModel }) {
  return (
    <>
      <div onClick={v.em.close} style={{ position: "fixed", inset: "0", zIndex: "31", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: v.t.overlay }}>
        <div onClick={v.stop} style={{ width: "100%", maxWidth: "720px", maxHeight: "88vh", display: "flex", flexDirection: "column", borderRadius: "28px", overflow: "hidden", background: v.t.card, color: v.t.ink }}>
          <div style={{ padding: "22px 24px 16px", display: "flex", flexDirection: "column", gap: "10px", borderBottom: `1px solid ${v.t.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                규칙 수정
              </span>
              <button onClick={v.em.close} style={{ width: "36px", height: "36px", border: "0", borderRadius: "10px", fontSize: "18px", cursor: "pointer", flexShrink: "0", background: v.t.sub, color: v.t.ink }}>
                ×
              </button>
            </div>
            <input value={v.bd.name} onChange={v.bd.onName} placeholder="규칙 이름" style={{ width: "100%", boxSizing: "border-box", height: "52px", border: "0", outline: "none", borderRadius: "14px", padding: "0 16px", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em", background: v.t.sub, color: v.t.ink }} />
            <span style={{ fontSize: "13px", color: v.t.muted }}>
              {v.bd.metaLine}
            </span>
          </div>
          <div style={{ overflowY: "auto", overflowX: "hidden", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {(v.bd.secs as any[]).map((sec: any, i55: number) => (
              <Fragment key={i55}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {sec.n}. {sec.title}
                    </span>
                    <span style={{ fontSize: "12px", color: v.t.muted }}>
                      {sec.count}
                    </span>
                  </div>
                  {(sec.blocks as any[]).map((b: any, i56: number) => (
                    <Fragment key={i56}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px", padding: "10px 10px 10px 12px", background: v.t.sub, border: `2px solid ${b.border}` }}>
                          <div style={{ flex: "1", minWidth: "0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", lineHeight: "1.5" }}>
                            <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 8px", borderRadius: "999px", background: v.t.card }}>
                              {b.name}
                            </span>
                            <span>
                              {b.pre}
                            </span>
                            {!!(b.hasInput) && (
                              <>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", borderRadius: "8px", padding: "0 8px", height: "30px", background: v.t.card, border: `1.5px solid ${b.inBorder}` }}>
                                  <input value={b.v} onChange={b.onV} placeholder="?" inputMode="decimal" style={{ width: b.inW, border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "14px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: v.t.priInk }} />
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.priInk }}>
                                    {b.unit}
                                  </span>
                                </span>
                              </>
                            )}
                            <span>
                              {b.post}
                            </span>
                          </div>
                          {!!(b.hasPts) && (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "2px", borderRadius: "10px", padding: "2px", flexShrink: "0", background: v.t.card }}>
                                <button onClick={b.ptsDec} style={{ width: "26px", height: "26px", border: "0", borderRadius: "7px", background: "transparent", fontSize: "15px", cursor: "pointer", color: v.t.muted }}>
                                  −
                                </button>
                                <span style={{ display: "flex", alignItems: "center", gap: "1px", padding: "0 2px" }}>
                                  <input value={b.ptsVal} onChange={b.onPts} placeholder="점수" inputMode="numeric" style={{ width: "42px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "15px", fontWeight: "800", fontVariantNumeric: "tabular-nums", color: b.ptsColor }} />
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                                    점
                                  </span>
                                </span>
                                <button onClick={b.ptsInc} style={{ width: "26px", height: "26px", border: "0", borderRadius: "7px", background: "transparent", fontSize: "15px", cursor: "pointer", color: v.t.muted }}>
                                  +
                                </button>
                              </div>
                            </>
                          )}
                          <button onClick={b.remove} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", background: "transparent", fontSize: "16px", cursor: "pointer", flexShrink: "0", color: v.t.faint }}>
                            ×
                          </button>
                        </div>
                        {!!(b.hasErr) && (
                          <>
                            <div style={{ fontSize: "12px", fontWeight: "600", paddingLeft: "12px", color: v.t.warnInk }}>
                              {b.err}
                            </div>
                          </>
                        )}
                      </div>
                    </Fragment>
                  ))}
                  <button onClick={sec.add} style={{ height: "40px", borderRadius: "12px", background: "transparent", fontSize: "14px", fontWeight: "700", cursor: "pointer", border: `1.5px dashed ${v.t.off}`, color: v.t.muted }}>
                    + {sec.addLabel}
                  </button>
                </div>
              </Fragment>
            ))}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>
                3. 마지막 확인
              </span>
              {(v.bd.nums as any[]).map((r: any, i57: number) => (
                <Fragment key={i57}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "12px 0", borderTop: `1px solid ${v.t.line}` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700" }}>
                        {r.label}
                      </span>
                      {!!(r.hasErr) && (
                        <>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: v.t.warnInk }}>
                            {r.err}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "12px", padding: "3px", flexShrink: "0", background: v.t.sub }}>
                      <button onClick={r.dec} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", fontSize: "16px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        −
                      </button>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", minWidth: "70px" }}>
                        <input value={r.value} onChange={r.onChange} inputMode="decimal" placeholder="?" style={{ width: "42px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "14px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: r.color }} />
                        <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                          {r.unit}
                        </span>
                      </span>
                      <button onClick={r.inc} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", fontSize: "16px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        +
                      </button>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px", padding: "12px 14px", background: v.t.sub }}>
              <span style={{ fontSize: "12px", fontWeight: "700", padding: "4px 8px", borderRadius: "7px", flexShrink: "0", background: v.chk.bg, color: v.chk.color }}>
                {v.chk.label}
              </span>
              <span style={{ fontSize: "13px", lineHeight: "1.45", color: v.t.muted }}>
                {v.em.issue}
              </span>
            </div>
          </div>
          <div style={{ padding: "14px 24px", display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap", borderTop: `1px solid ${v.t.line}` }}>
            <button onClick={v.em.goBuilder} style={{ height: "46px", padding: "0 16px", border: "0", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", background: v.t.sub, color: v.t.ink }}>
              규칙 빌더에서 자세히
            </button>
            <button onClick={v.bd.save} style={{ height: "46px", padding: "0 22px", border: "0", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", background: v.bd.saveBg, color: v.bd.saveColor }}>
              {v.bd.saveLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
