import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function AlertsPage({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "880px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(v.alertChips as any[]).map((c: any, i18: number) => (
              <Fragment key={i18}>
                <button onClick={c.go} style={{ border: "0", cursor: "pointer", padding: "10px 16px", borderRadius: "999px", fontSize: "15px", fontWeight: "700", background: c.bg, color: c.color }}>
                  {c.label}
                </button>
              </Fragment>
            ))}
          </div>
          <button onClick={v.goSettings} style={{ border: "0", background: "transparent", color: v.t.muted, fontSize: "14px", fontWeight: "600", cursor: "pointer", padding: "8px 4px", whiteSpace: "nowrap" }}>
            알림 설정 ›
          </button>
        </div>
        <div style={{ borderRadius: "16px", padding: "14px 18px", fontSize: "14px", fontWeight: "600", lineHeight: "1.5", textWrap: "pretty", background: v.t.warnSoft, color: v.t.warnInk }}>
          뉴스는 주가가 먼저 움직인 뒤에 나오는 경우가 많아요. 사라는 신호가 아니라 ‘왜 움직이는지’ 확인용으로 봐 주세요.
        </div>
        {(v.alerts as any[]).map((a: any, i19: number) => (
          <Fragment key={i19}>
            <article style={{ background: v.t.card, borderRadius: "22px", padding: "24px 26px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", padding: "4px 9px", borderRadius: "7px", background: a.tagBg, color: a.tagColor }}>
                    {a.tag}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "700" }}>
                    {a.stock}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: a.chgColor }}>
                    {a.chg}
                  </span>
                  {!!(a.isHolding) && (
                    <>
                      <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 7px", borderRadius: "6px", background: v.t.sub, color: v.t.muted }}>
                        보유 중
                      </span>
                    </>
                  )}
                </div>
                <span style={{ fontSize: "13px", color: v.t.faint }}>
                  {a.dirLabel} · {a.time}
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.45", textWrap: "pretty" }}>
                {a.title}
              </div>
              <div style={{ borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px", background: v.t.sub }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                  {a.boxLabel}
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", textWrap: "pretty" }}>
                  {a.summary}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: v.t.faint }}>
                  출처 {a.source}
                </span>
                {!!(a.hasAct) && (
                  <>
                    <button onClick={a.act} style={{ height: "38px", padding: "0 14px", border: "0", borderRadius: "10px", background: v.t.priSoft, color: v.t.priInk, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                      {a.actLabel}
                    </button>
                  </>
                )}
              </div>
            </article>
          </Fragment>
        ))}
        {!!(v.alertsEmpty) && (
          <>
            <div style={{ background: v.t.card, borderRadius: "22px", padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "17px", fontWeight: "700" }}>
                이 종류의 알림은 아직 없어요
              </div>
              <div style={{ fontSize: "14px", color: v.t.muted }}>
                꺼 둔 알림은 설정 › 알림 받기에서 켤 수 있어요.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
