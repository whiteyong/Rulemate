import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function HomePage({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px 24px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: v.t.muted }}>
                룰메이트 쓰는 순서
              </span>
              <span style={{ fontSize: "17px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                {v.flow.sub}
              </span>
            </div>
            <button onClick={v.flow.cta} style={{ height: "42px", padding: "0 16px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
              {v.flow.ctaLabel} →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))" }}>
            {(v.flow.steps as any[]).map((s: any, i5: number) => (
              <Fragment key={i5}>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "0 2px" }}>
                  <span style={{ position: "absolute", top: "11px", left: "0", right: "50%", height: "2px", background: s.lineL }}></span>
                  <span style={{ position: "absolute", top: "11px", left: "50%", right: "0", height: "2px", background: s.lineR }}></span>
                  <span style={{ position: "relative", width: "24px", height: "24px", borderRadius: "50%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", background: s.dotBg, color: s.dotInk, border: `2px solid ${s.dotBorder}`, boxShadow: s.halo }}>
                    {s.icon}
                  </span>
                  <span style={{ fontSize: "13px", lineHeight: "1.35", textAlign: "center", wordBreak: "keep-all", fontWeight: s.weight, color: s.ink }}>
                    {s.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <section style={{ flex: "1.35 1 480px", minWidth: "0", background: v.t.card, borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "15px", color: v.t.muted, fontWeight: "600" }}>
                  오늘 손익
                </div>
                <div style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: v.pnl.color }}>
                  {v.pnl.value}
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted }}>
                  {v.pnl.sub}
                </div>
              </div>
              <div style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap", background: v.t.okSoft, color: v.t.okInk }}>
                {v.pnl.badge}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px" }}>
              {(v.pnl.meters as any[]).map((m: any, i6: number) => (
                <Fragment key={i6}>
                  <div style={{ borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", background: v.t.sub }}>
                    <div style={{ fontSize: "13px", color: v.t.muted, fontWeight: "600" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                      {m.val}
                    </div>
                    <div style={{ height: "6px", borderRadius: "3px", overflow: "hidden", background: v.t.off }}>
                      <div style={{ height: "100%", borderRadius: "3px", background: v.t.pri, width: m.w }}></div>
                    </div>
                    {!!(v.showTerms) && (
                      <>
                        <div style={{ fontSize: "12px", color: v.t.faint }}>
                          {m.term}
                        </div>
                      </>
                    )}
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ fontSize: "15px", lineHeight: "1.5", color: v.t.muted, textWrap: "pretty" }}>
              {v.pnl.line}
            </div>
          </section>
          <section style={{ flex: "1 1 340px", minWidth: "0", background: v.t.card, borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>
                들고 있는 종목
              </div>
              <div style={{ fontSize: "14px", color: v.t.muted }}>
                {v.hold.countStr}
              </div>
            </div>
            {!!(v.hold.has) && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                    <div style={{ fontSize: "20px", fontWeight: "700" }}>
                      {v.hold.name}
                    </div>
                    <div style={{ fontSize: "14px", color: v.t.muted }}>
                      {v.hold.sub}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <div style={{ fontSize: "22px", fontWeight: "800", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: v.hold.color }}>
                      {v.hold.pnlStr}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", color: v.hold.color }}>
                      {v.hold.pctStr}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ position: "relative", height: "8px", display: "flex", gap: "3px" }}>
                    <div style={{ borderRadius: "4px", flex: v.hold.pb.lossFlex, background: v.t.trackDown }}></div>
                    <div style={{ borderRadius: "4px", flex: v.hold.pb.gainFlex, background: v.t.trackUp }}></div>
                    <div style={{ position: "absolute", top: "-4px", width: "16px", height: "16px", borderRadius: "50%", boxSizing: "border-box", transform: "translateX(-50%)", left: v.hold.pb.curPos, background: v.t.ink, border: `3px solid ${v.t.card}` }}></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ color: v.t.down }}>
                      손절 {v.hold.pb.stopStr}
                    </span>
                    <span style={{ color: v.t.muted }}>
                      {v.hold.leftStr}
                    </span>
                    <span style={{ color: v.t.up }}>
                      목표 {v.hold.pb.targetStr}
                    </span>
                  </div>
                </div>
                <button onClick={v.hold.sell} style={{ height: "46px", border: "0", borderRadius: "14px", background: v.t.priSoft, color: v.t.priInk, fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                  팔았으면 기록하기
                </button>
              </>
            )}
            {!!(v.hold.none) && (
              <>
                <div style={{ background: v.t.sub, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700" }}>
                    들고 있는 종목이 없어요
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.5", color: v.t.muted }}>
                    증권 앱에서 산 뒤 ‘샀어요’를 누르면 여기에 보여요.
                  </div>
                </div>
              </>
            )}
            {!!(v.homePlan.has) && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: `1px solid ${v.t.line}` }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: v.t.muted }}>
                      계획만 세운 종목
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {v.homePlan.name}
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted, fontVariantNumeric: "tabular-nums" }}>
                      {v.homePlan.line}
                    </span>
                  </span>
                  <button onClick={v.homePlan.buy} style={{ height: "40px", padding: "0 14px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                    샀어요
                  </button>
                </div>
              </>
            )}
            <div style={{ marginTop: "auto", borderRadius: "14px", padding: "14px 16px", fontSize: "14px", fontWeight: "600", lineHeight: "1.45", background: v.t.sub, color: v.t.muted }}>
              {v.hold.note}
            </div>
          </section>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <section style={{ flex: "1.35 1 480px", minWidth: "0", background: v.t.card, borderRadius: "24px", padding: "28px 20px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 8px", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  내 조건 충족 종목 {v.hp.count}
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted }}>
                  {v.hp.sub}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: "0" }}>
                {!!(v.hp.hasPager) && (
                  <>
                    <span style={{ fontSize: "13px", color: v.t.muted, fontVariantNumeric: "tabular-nums", marginRight: "2px", whiteSpace: "nowrap" }}>
                      {v.hp.range}
                    </span>
                    <button onClick={v.hp.prev} style={{ width: "34px", height: "34px", border: "0", borderRadius: "10px", fontSize: "18px", fontWeight: "700", cursor: "pointer", background: v.t.sub, color: v.hp.prevColor }}>
                      ‹
                    </button>
                    <button onClick={v.hp.next} style={{ width: "34px", height: "34px", border: "0", borderRadius: "10px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginRight: "4px", background: v.t.sub, color: v.hp.nextColor }}>
                      ›
                    </button>
                  </>
                )}
                <button onClick={v.goCands} style={{ border: "0", background: v.t.priSoft, color: v.t.priInk, fontWeight: "700", fontSize: "14px", padding: "9px 14px", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  전체 보기
                </button>
              </div>
            </div>
            {!!(v.rs.isOk) && (
              <>
                {(v.homeTop as any[]).map((s: any, i7: number) => (
                  <Fragment key={i7}>
                    <button onClick={s.open} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto auto", alignItems: "center", gap: "14px", border: "0", background: "transparent", textAlign: "left", padding: "14px 8px", borderRadius: "14px", cursor: "pointer", color: "inherit" }} className="rm-hover">
                      <span style={{ fontSize: "17px", fontWeight: "700", color: v.t.priInk, textAlign: "center" }}>
                        {s.rank}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          {s.name}
                        </span>
                        <span style={{ fontSize: "13px", color: v.t.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {s.reason}
                        </span>
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.priInk, background: v.t.priSoft, padding: "5px 9px", borderRadius: "8px", whiteSpace: "nowrap" }}>
                        {s.score}점
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", minWidth: "86px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                          {s.priceStr}원
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: s.chgColor }}>
                          {s.chgStr}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </>
            )}
            {!!(v.rs.isLoading) && (
              <>
                {(v.skel as any[]).map((k: any, i8: number) => (
                  <Fragment key={i8}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 8px" }}>
                      <span style={{ width: "28px", height: "24px", borderRadius: "8px", background: v.t.sub }}></span>
                      <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ height: "14px", width: "40%", borderRadius: "6px", background: v.t.sub }}></span>
                        <span style={{ height: "12px", width: "70%", borderRadius: "6px", background: v.t.sub }}></span>
                      </span>
                      <span style={{ width: "64px", height: "28px", borderRadius: "8px", background: v.t.sub }}></span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ fontSize: "13px", color: v.t.muted, textAlign: "center", padding: "4px 0 8px" }}>
                  규칙대로 종목을 계산하고 있어요…
                </div>
              </>
            )}
            {!!(v.rs.isMsg) && (
              <>
                <div style={{ margin: "4px 8px 8px", background: v.t.sub, borderRadius: "18px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>
                    {v.rs.title}
                  </div>
                  {(v.rs.lines as any[]).map((ln: any, i9: number) => (
                    <Fragment key={i9}>
                      <div style={{ fontSize: "14px", lineHeight: "1.55", color: v.t.muted, textWrap: "pretty" }}>
                        {ln}
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                    <button onClick={v.rs.act} style={{ height: "42px", padding: "0 16px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                      {v.rs.btn}
                    </button>
                    {!!(v.rs.hasBtn2) && (
                      <>
                        <button onClick={v.rs.act2} style={{ height: "42px", padding: "0 16px", border: "0", borderRadius: "12px", background: v.t.card, color: v.t.ink, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                          {v.rs.btn2}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
          <section style={{ flex: "1 1 340px", minWidth: "0", background: v.t.card, borderRadius: "24px", padding: "28px 20px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 8px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>
                방금 온 알림
              </div>
              <button onClick={v.goAlerts} style={{ border: "0", background: "transparent", color: v.t.muted, fontWeight: "600", fontSize: "14px", cursor: "pointer", padding: "6px" }}>
                더 보기
              </button>
            </div>
            {(v.homeAlerts as any[]).map((a: any, i10: number) => (
              <Fragment key={i10}>
                <button onClick={v.goAlerts} style={{ display: "flex", flexDirection: "column", gap: "6px", border: "0", background: "transparent", textAlign: "left", padding: "14px 8px", borderRadius: "14px", cursor: "pointer", color: "inherit" }} className="rm-hover">
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                    <span style={{ fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: a.tagBg, color: a.tagColor }}>
                      {a.tag}
                    </span>
                    <span style={{ fontWeight: "700" }}>
                      {a.stock}
                    </span>
                    <span style={{ color: v.t.faint }}>
                      {a.time}
                    </span>
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.45", textWrap: "pretty" }}>
                    {a.title}
                  </span>
                </button>
              </Fragment>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
