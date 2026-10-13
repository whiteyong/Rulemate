import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function GlossaryModal({ v }: { v: ViewModel }) {
  return (
    <>
      <div onClick={v.closeGloss} style={{ position: "fixed", inset: "0", zIndex: "30", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: v.t.overlay }}>
        <div onClick={v.stop} style={{ width: "100%", maxWidth: "860px", maxHeight: "86vh", display: "flex", flexDirection: "column", borderRadius: "28px", overflow: "hidden", background: v.t.card, color: v.t.ink }}>
          <div style={{ padding: "24px 26px 16px", display: "flex", flexDirection: "column", gap: "14px", borderBottom: `1px solid ${v.t.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "21px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                  용어집
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted }}>
                  블록·수식·스크립트, 결과 화면 설명문 모두 같은 이름을 써요
                </div>
              </div>
              <button onClick={v.closeGloss} style={{ width: "36px", height: "36px", border: "0", borderRadius: "10px", fontSize: "18px", cursor: "pointer", flexShrink: "0", background: v.t.sub, color: v.t.ink }}>
                ×
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px", height: "48px", padding: "0 16px", background: v.t.sub }}>
              <span style={{ fontSize: "15px", color: v.t.faint }}>
                ⌕
              </span>
              <input value={v.gm.q} onChange={v.gm.onQ} placeholder="쉬운 이름이나 원래 용어로 찾아보세요 (예: RSI, 몸값)" style={{ flex: "1", minWidth: "0", border: "0", outline: "none", background: "transparent", fontSize: "15px", color: v.t.ink }} />
              <span style={{ fontSize: "13px", color: v.t.muted, whiteSpace: "nowrap" }}>
                {v.gm.count}
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(v.gm.cats as any[]).map((c: any, i46: number) => (
                <Fragment key={i46}>
                  <button onClick={c.go} style={{ border: "0", cursor: "pointer", padding: "8px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", background: c.bg, color: c.color }}>
                    {c.label}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={{ overflowY: "auto", overflowX: "hidden", padding: "18px 26px 26px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {(v.gm.groups as any[]).map((g: any, i47: number) => (
              <Fragment key={i47}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      {g.name}
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted }}>
                      {g.desc}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(360px,100%),1fr))", gap: "10px" }}>
                    {(g.items as any[]).map((it: any, i48: number) => (
                      <Fragment key={i48}>
                        <div style={{ minWidth: "0", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", background: v.t.sub }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "16px", fontWeight: "700" }}>
                                {it.name}
                              </span>
                              <span style={{ fontSize: "12px", fontWeight: "500", color: v.t.faint }}>
                                {it.term}
                              </span>
                            </span>
                            <span style={{ fontSize: "14px", lineHeight: "1.45", color: v.t.muted, wordBreak: "keep-all", textWrap: "pretty" }}>
                              {it.easy}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: v.t.faint }}>
                            예시 · {it.ex}
                          </span>
                          <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "4px 12px", fontSize: "13px" }}>
                            <span style={{ color: v.t.muted }}>
                              수식 이름
                            </span>
                            <span style={{ fontFamily: "ui-monospace,Menlo,monospace", overflowWrap: "anywhere" }}>
                              {it.fx}
                            </span>
                            <span style={{ color: v.t.muted }}>
                              스크립트 이름
                            </span>
                            <span style={{ fontFamily: "ui-monospace,Menlo,monospace", overflowWrap: "anywhere" }}>
                              {it.js}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
            {!!(v.gm.showColors) && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      색의 뜻
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted }}>
                      모든 화면에서 같은 뜻으로 써요
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(360px,100%),1fr))", gap: "10px" }}>
                    {(v.colorLegend as any[]).map((c: any, i49: number) => (
                      <Fragment key={i49}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderRadius: "18px", padding: "14px 16px", background: v.t.sub }}>
                          <span style={{ width: "28px", height: "28px", borderRadius: "8px", flexShrink: "0", background: c.color }}></span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700" }}>
                              {c.label}
                            </span>
                            <span style={{ fontSize: "13px", color: v.t.muted }}>
                              {c.desc}
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!!(v.gm.empty) && (
              <>
                <div style={{ padding: "36px 0", textAlign: "center", fontSize: "15px", color: v.t.muted }}>
                  찾는 용어가 없어요. 다른 말로 검색해 보세요.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
