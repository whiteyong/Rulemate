import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px", height: "48px", padding: "0 16px", background: v.t.card }}>
          <span style={{ fontSize: "15px", color: v.t.faint }}>
            ⌕
          </span>
          <input value={v.alertSearch.value} onChange={v.alertSearch.onChange} placeholder="종목 이름이나 제목으로 찾아보세요 (예: 안랩, 공급계약)" aria-label="알림 검색" style={{ flex: "1", minWidth: "0", border: "0", outline: "none", background: "transparent", fontSize: "15px", color: v.t.ink }} />
          {!!(v.alertSearch.count) && (
            <span style={{ fontSize: "13px", color: v.t.muted, whiteSpace: "nowrap" }}>
              {v.alertSearch.count}
            </span>
          )}
          {!!(v.alertSearch.has) && (
            <button onClick={v.alertSearch.clear} aria-label="검색어 지우기" style={{ width: "26px", height: "26px", border: "0", borderRadius: "50%", flexShrink: "0", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", background: v.t.off, color: v.t.card }}>
              ×
            </button>
          )}
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
        {!!(v.alertPager.show) && (
          <nav aria-label="알림 페이지" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap", paddingTop: "4px" }}>
            <button onClick={v.alertPager.prev} disabled={v.alertPager.prevOff} aria-label="이전 페이지" style={{ height: "40px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: v.alertPager.prevOff ? "default" : "pointer", background: v.t.card, color: v.alertPager.prevOff ? v.t.faint : v.t.ink }}>
              ‹ 이전
            </button>
            {(v.alertPager.pages as any[]).map((p: any) => (
              <button key={p.n} onClick={p.go} aria-current={p.bg !== "transparent" ? "page" : undefined} style={{ minWidth: "40px", height: "40px", border: "0", borderRadius: "10px", fontSize: "15px", fontWeight: "700", fontVariantNumeric: "tabular-nums", cursor: "pointer", background: p.bg, color: p.color }}>
                {p.n}
              </button>
            ))}
            <button onClick={v.alertPager.next} disabled={v.alertPager.nextOff} aria-label="다음 페이지" style={{ height: "40px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: v.alertPager.nextOff ? "default" : "pointer", background: v.t.card, color: v.alertPager.nextOff ? v.t.faint : v.t.ink }}>
              다음 ›
            </button>
            <span style={{ width: "100%", textAlign: "center", fontSize: "13px", color: v.t.faint }}>
              {v.alertPager.info}
            </span>
          </nav>
        )}
        {!!(v.alertsEmpty) && (
          <>
            <div style={{ background: v.t.card, borderRadius: "22px", padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "17px", fontWeight: "700" }}>
                {v.alertsEmptyTitle}
              </div>
              <div style={{ fontSize: "14px", color: v.t.muted }}>
                {v.alertsEmptyDesc}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
