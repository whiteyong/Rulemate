import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function ConsentModal({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ position: "fixed", inset: "0", zIndex: "38", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: v.t.overlay }}>
        <div style={{ width: "100%", maxWidth: "480px", boxSizing: "border-box", borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px", background: v.t.card, color: v.t.ink }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>
              룰메이트를 쓰기 전에
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted }}>
              아래 세 가지를 꼭 확인해 주세요
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(v.consentItems as any[]).map((c: any, i61: number) => (
              <Fragment key={i61}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", borderRadius: "16px", padding: "14px 16px", background: v.t.sub }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", background: v.t.ink, color: v.t.bg }}>
                    {c.n}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {c.title}
                    </span>
                    <span style={{ fontSize: "13px", lineHeight: "1.5", color: v.t.muted }}>
                      {c.desc}
                    </span>
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <button onClick={v.confirmConsent} style={{ height: "56px", border: "0", borderRadius: "16px", fontSize: "17px", fontWeight: "700", cursor: "pointer", background: "oklch(0.6 0.19 255)", color: "#fff" }}>
            확인했어요
          </button>
        </div>
      </div>
    </>
  );
}
