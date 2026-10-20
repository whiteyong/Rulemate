import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function ConditionLibraryModal({ v }: { v: ViewModel }) {
  return (
    <>
      <div onClick={v.lib.close} style={{ position: "fixed", inset: "0", zIndex: "34", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: v.t.overlay }}>
        <div onClick={v.stop} style={{ width: "100%", maxWidth: "840px", maxHeight: "86vh", display: "flex", flexDirection: "column", borderRadius: "28px", overflow: "hidden", background: v.t.card, color: v.t.ink }}>
          <div style={{ padding: "24px 26px 16px", display: "flex", flexDirection: "column", gap: "14px", borderBottom: `1px solid ${v.t.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "21px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                  {v.lib.title}
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted }}>
                  {v.lib.sub}
                </div>
              </div>
              <button onClick={v.lib.close} style={{ width: "36px", height: "36px", border: "0", borderRadius: "10px", fontSize: "18px", cursor: "pointer", flexShrink: "0", background: v.t.sub, color: v.t.ink }}>
                ×
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px", height: "48px", padding: "0 16px", background: v.t.sub }}>
              <span style={{ fontSize: "15px", color: v.t.faint }}>
                ⌕
              </span>
              <input value={v.lib.q} onChange={v.lib.onQ} placeholder="쉬운 말이나 원래 용어로 찾아보세요 (예: 북적임, PER)" style={{ flex: "1", minWidth: "0", border: "0", outline: "none", background: "transparent", fontSize: "15px", color: v.t.ink }} />
              <span style={{ fontSize: "13px", color: v.t.muted, whiteSpace: "nowrap" }}>
                {v.lib.count}
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(v.lib.cats as any[]).map((c: any, i58: number) => (
                <Fragment key={i58}>
                  <button onClick={c.go} style={{ border: "0", cursor: "pointer", padding: "8px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", background: c.bg, color: c.color }}>
                    {c.label}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={{ overflowY: "auto", overflowX: "hidden", padding: "18px 26px 26px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {(v.lib.groups as any[]).map((g: any, i59: number) => (
              <Fragment key={i59}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      {g.name}
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted }}>
                      {g.desc}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(340px,100%),1fr))", gap: "10px" }}>
                    {(g.items as any[]).map((it: any, i60: number) => (
                      <Fragment key={i60}>
                        <div style={{ minWidth: "0", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", background: v.t.sub }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                              <span style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "16px", fontWeight: "700" }}>
                                  {it.name}
                                </span>
                                {!!(v.showTerms) && (
                                  <>
                                    <span style={{ fontSize: "12px", fontWeight: "500", color: v.t.faint }}>
                                      {it.term}
                                    </span>
                                  </>
                                )}
                              </span>
                              <span style={{ fontSize: "14px", lineHeight: "1.45", color: v.t.muted, textWrap: "pretty", wordBreak: "keep-all" }}>
                                {it.easy}
                              </span>
                            </div>
                            <button onClick={it.add} style={{ height: "34px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", flexShrink: "0", background: it.btnBg, color: it.btnColor }}>
                              {it.addLabel}
                            </button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", color: v.t.faint }}>
                              예시 · {it.ex}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
            {!!(v.lib.empty) && (
              <>
                <div style={{ padding: "36px 0", textAlign: "center", fontSize: "15px", color: v.t.muted }}>
                  찾는 조건이 없어요. 다른 말로 검색해 보세요.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
