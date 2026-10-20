import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function RecordModal({ v }: { v: ViewModel }) {
  return (
    <>
      <div onClick={v.rec.close} style={{ position: "fixed", inset: "0", zIndex: "35", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: v.t.overlay }}>
        <div onClick={v.stop} style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box", borderRadius: "28px", padding: "26px", display: "flex", flexDirection: "column", gap: "20px", background: v.t.card, color: v.t.ink }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
              <span style={{ alignSelf: "flex-start", fontSize: "12px", fontWeight: "700", padding: "4px 9px", borderRadius: "7px", background: v.t.priSoft, color: v.t.priInk }}>
                {v.rec.tag}
              </span>
              <div style={{ fontSize: "23px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                {v.rec.title}
              </div>
              <div style={{ fontSize: "13px", color: v.t.muted, lineHeight: "1.5", fontVariantNumeric: "tabular-nums" }}>
                {v.rec.planLine}
              </div>
            </div>
            <button onClick={v.rec.close} style={{ width: "36px", height: "36px", border: "0", borderRadius: "10px", fontSize: "18px", cursor: "pointer", flexShrink: "0", background: v.t.sub, color: v.t.ink }}>
              ×
            </button>
          </div>
          {(v.rec.fields as any[]).map((f: any, i50: number) => (
            <Fragment key={i50}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700" }}>
                    {f.label}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: f.hintColor }}>
                    {f.hint}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "16px", height: "60px", padding: "0 8px", background: v.t.sub }}>
                  <button onClick={f.dec} style={{ width: "44px", height: "44px", border: "0", borderRadius: "12px", fontSize: "20px", fontWeight: "600", cursor: "pointer", flexShrink: "0", background: v.t.card, color: v.t.ink }}>
                    −
                  </button>
                  <input value={f.value} onChange={f.onChange} inputMode="numeric" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", textAlign: "right", fontSize: "22px", fontWeight: "800", outline: "none", fontVariantNumeric: "tabular-nums", color: v.t.ink }} />
                  <span style={{ fontSize: "17px", fontWeight: "700", paddingRight: "6px", color: v.t.muted }}>
                    {f.unit}
                  </span>
                  <button onClick={f.inc} style={{ width: "44px", height: "44px", border: "0", borderRadius: "12px", fontSize: "20px", fontWeight: "600", cursor: "pointer", flexShrink: "0", background: v.t.card, color: v.t.ink }}>
                    +
                  </button>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(f.quick as any[]).map((q: any, i51: number) => (
                    <Fragment key={i51}>
                      <button onClick={q.go} style={{ border: "0", cursor: "pointer", padding: "8px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", fontVariantNumeric: "tabular-nums", background: q.bg, color: q.color }}>
                        {q.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </Fragment>
          ))}
          {!!(v.rec.isTrade) && (
            <>
              <div style={{ borderRadius: "18px", padding: "18px", display: "flex", flexDirection: "column", gap: "8px", background: v.t.sub }}>
                <div style={{ fontSize: "21px", fontWeight: "800", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", color: v.rec.sumColor }}>
                  {v.rec.sumBig}
                </div>
                <div style={{ fontSize: "13px", color: v.t.muted }}>
                  {v.rec.sumSub}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px", marginTop: "4px", borderTop: `1px solid ${v.t.line}` }}>
                  {(v.rec.checks as any[]).map((c: any, i52: number) => (
                    <Fragment key={i52}>
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
              </div>
            </>
          )}
          {!!(v.rec.isSell) && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>
                  한 줄 느낌{" "}
                  <span style={{ fontWeight: "500", color: v.t.faint }}>
                    · 골라도 되고 안 골라도 돼요
                  </span>
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(v.rec.feels as any[]).map((q: any, i53: number) => (
                    <Fragment key={i53}>
                      <button onClick={q.go} style={{ border: "0", cursor: "pointer", padding: "9px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", background: q.bg, color: q.color }}>
                        {q.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <input value={v.rec.memo} onChange={v.rec.onMemo} placeholder="메모를 남겨도 좋아요 (예: 뉴스 보고 급하게 샀어요)" style={{ height: "46px", border: "0", borderRadius: "12px", padding: "0 14px", outline: "none", fontSize: "14px", background: v.t.sub, color: v.t.ink }} />
              </div>
            </>
          )}
          {!!(v.rec.isSkip) && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>
                  왜 안 샀나요?
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px" }}>
                  {(v.rec.reasons as any[]).map((q: any, i54: number) => (
                    <Fragment key={i54}>
                      <button onClick={q.go} style={{ minHeight: "48px", padding: "8px 10px", border: "0", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", wordBreak: "keep-all", background: q.bg, color: q.color }}>
                        {q.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <span style={{ fontSize: "13px", color: v.t.muted }}>
                  안 산 계획도 남겨 두면 규칙을 고칠 때 도움이 돼요.
                </span>
              </div>
            </>
          )}
          <button onClick={v.rec.save} style={{ height: "56px", border: "0", borderRadius: "16px", fontSize: "17px", fontWeight: "700", cursor: "pointer", flexShrink: "0", background: v.rec.ctaBg, color: v.rec.ctaColor }}>
            {v.rec.cta}
          </button>
          <div style={{ fontSize: "12px", color: v.t.faint, textAlign: "center", lineHeight: "1.5" }}>
            주문은 증권 앱에서 직접 해 주세요. 룰메이트는 기록만 도와드려요.
          </div>
        </div>
      </div>
    </>
  );
}
