import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function Toast({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ position: "fixed", right: "28px", bottom: "28px", zIndex: "40", width: "380px", maxWidth: "calc(100vw - 56px)", borderRadius: "20px", padding: "18px 18px 16px 20px", display: "flex", flexDirection: "column", gap: "8px", background: v.t.toastBg, color: v.t.toastInk, boxShadow: v.t.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: v.toast.tagBg, color: v.toast.tagColor }}>
            {v.toast.tag}
          </span>
          <button onClick={v.closeToast} style={{ border: "0", background: "transparent", fontSize: "18px", cursor: "pointer", color: v.t.toastMuted, padding: "2px 4px" }}>
            ×
          </button>
        </div>
        <div style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.4", textWrap: "pretty" }}>
          {v.toast.title}
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.5", color: v.t.toastMuted, textWrap: "pretty" }}>
          {v.toast.body}
        </div>
        {!!(v.toast.hasAct) && (
          <>
            <button onClick={v.toastAct} style={{ alignSelf: "flex-start", marginTop: "4px", height: "38px", padding: "0 14px", border: "0", borderRadius: "10px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {v.toast.actLabel}
            </button>
          </>
        )}
      </div>
    </>
  );
}
