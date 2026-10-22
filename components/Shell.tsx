import { Fragment } from "react";
import type { ViewModel } from "../lib/types";
import HomePage from "./HomePage";
import MatchesPage from "./MatchesPage";
import AlertsPage from "./AlertsPage";
import JournalPage from "./JournalPage";
import BuilderPage from "./BuilderPage";
import SettingsPage from "./SettingsPage";
import GlossaryModal from "./GlossaryModal";
import RecordModal from "./RecordModal";
import RuleEditModal from "./RuleEditModal";
import ConditionLibraryModal from "./ConditionLibraryModal";
import ConsentModal from "./ConsentModal";
import Toast from "./Toast";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function Shell({ v }: { v: ViewModel }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: v.L.dir, background: v.t.bg, color: v.t.ink }}>
      {!!(v.L.isA) && (
        <>
          <aside style={{ width: "232px", flexShrink: "0", background: v.t.card, padding: "28px 14px 22px", display: "flex", flexDirection: "column", gap: "28px", position: "sticky", top: "0", height: "100vh", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 12px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "oklch(0.6 0.19 255)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" }}>
                룰
              </div>
              <div style={{ fontSize: "19px", fontWeight: "800", letterSpacing: "-0.03em" }}>
                룰메이트
              </div>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {(v.nav as any[]).map((item: any, i0: number) => (
                <Fragment key={i0}>
                  <button onClick={item.go} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", border: "0", cursor: "pointer", textAlign: "left", padding: "12px 14px", borderRadius: "12px", fontSize: "16px", background: item.bg, color: item.color, fontWeight: item.weight }}>
                    <span>
                      {item.label}
                    </span>
                    {!!(item.hasBadge) && (
                      <>
                        <span style={{ minWidth: "20px", height: "20px", padding: "0 6px", boxSizing: "border-box", borderRadius: "10px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.badge}
                        </span>
                      </>
                    )}
                  </button>
                </Fragment>
              ))}
            </nav>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: v.t.sub, borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "13px", color: v.t.muted, fontWeight: "600", padding: "0 2px" }}>
                  지금 기준 규칙
                </div>
                <div style={{ position: "relative", display: "flex" }}>
                  <select value={v.ruleSel.value} onChange={v.ruleSel.onChange} style={{ appearance: "none", WebkitAppearance: "none", width: "100%", border: "0", outline: "none", cursor: "pointer", height: "42px", padding: "0 34px 0 12px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", background: v.t.card, color: v.t.ink }}>
                    {(v.ruleSel.opts as any[]).map((o: any, i1: number) => (
                      <Fragment key={i1}>
                        <option value={o.id} style={{ background: v.t.card, color: v.t.ink }}>
                          {o.label}
                        </option>
                      </Fragment>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "11px", color: v.t.muted }}>
                    ▼
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: v.t.muted, padding: "0 2px" }}>
                  {v.side.meta}
                </div>
              </div>
              <div style={{ fontSize: "12px", color: v.t.faint, lineHeight: "1.55", padding: "0 6px", textWrap: "pretty" }}>
                ‘내 조건 충족 종목’은 내가 정한 조건에 맞는 종목이에요. 사고팔라는 권유가 아니에요.
              </div>
            </div>
          </aside>
        </>
      )}
      {!!(v.L.isB) && (
        <>
          <div style={{ position: "sticky", top: "0", zIndex: "10", background: v.t.card, borderBottom: `1px solid ${v.t.line}` }}>
            <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", gap: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0", whiteSpace: "nowrap" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "oklch(0.64 0.18 255)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" }}>
                  룰
                </div>
                <div style={{ fontSize: "19px", fontWeight: "800", letterSpacing: "-0.03em" }}>
                  룰메이트
                </div>
              </div>
              <nav style={{ display: "flex", gap: "2px", flex: "0 1 auto", minWidth: "0", overflowX: "auto" }}>
                {(v.nav as any[]).map((item: any, i2: number) => (
                  <Fragment key={i2}>
                    <button onClick={item.go} style={{ display: "flex", alignItems: "center", gap: "6px", border: "0", cursor: "pointer", padding: "9px 14px", borderRadius: "10px", fontSize: "15px", whiteSpace: "nowrap", background: item.bg, color: item.color, fontWeight: item.weight }}>
                      <span>
                        {item.label}
                      </span>
                      {!!(item.hasBadge) && (
                        <>
                          <span style={{ minWidth: "18px", height: "18px", padding: "0 5px", boxSizing: "border-box", borderRadius: "9px", background: "oklch(0.64 0.18 255)", color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {item.badge}
                          </span>
                        </>
                      )}
                    </button>
                  </Fragment>
                ))}
              </nav>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px", flex: "0 1 300px", minWidth: "160px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: v.t.muted, whiteSpace: "nowrap" }}>
                  기준 규칙
                </span>
                <div style={{ position: "relative", display: "flex", flex: "1", minWidth: "0" }}>
                  <select value={v.ruleSel.value} onChange={v.ruleSel.onChange} style={{ appearance: "none", WebkitAppearance: "none", width: "100%", border: "0", outline: "none", cursor: "pointer", height: "42px", padding: "0 34px 0 12px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", background: v.t.sub, color: v.t.ink }}>
                    {(v.ruleSel.opts as any[]).map((o: any, i3: number) => (
                      <Fragment key={i3}>
                        <option value={o.id} style={{ background: v.t.card, color: v.t.ink }}>
                          {o.label}
                        </option>
                      </Fragment>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "11px", color: v.t.muted }}>
                    ▼
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <main style={{ flex: "1", minWidth: "0", padding: "28px 40px 56px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px" }}>
          <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.03em" }}>
                {v.pageTitle}
              </h1>
              <div style={{ fontSize: "16px", color: v.t.muted }}>
                {v.pageSub}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: v.t.card, borderRadius: "999px", padding: "10px 16px", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: v.mk.dot }}></span>
                <span>
                  {v.mk.label}
                </span>
                <span style={{ color: v.t.muted, fontVariantNumeric: "tabular-nums" }}>
                  {v.mk.time}
                </span>
              </div>
            </div>
          </header>
          {(v.banners as any[]).map((b: any, i4: number) => (
            <Fragment key={i4}>
              <div style={{ borderRadius: "16px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "baseline", flexWrap: "wrap", background: b.bg, color: b.color }}>
                <span style={{ fontSize: "15px", fontWeight: "800" }}>
                  {b.title}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.5", textWrap: "pretty" }}>
                  {b.text}
                </span>
              </div>
            </Fragment>
          ))}
          {!!v.isHome && <HomePage v={v} />}
          {!!v.isCands && <MatchesPage v={v} />}
          {!!v.isAlerts && <AlertsPage v={v} />}
          {!!v.isJournal && <JournalPage v={v} />}
          {!!v.isBuilder && <BuilderPage v={v} />}
          {!!v.isSettings && <SettingsPage v={v} />}
          <footer style={{ marginTop: "12px", paddingTop: "18px", borderTop: `1px solid ${v.t.line}`, fontSize: "12px", lineHeight: "1.7", color: v.t.faint, textWrap: "pretty" }}>
            <b>
              룰메이트는 정보제공·학습용 도구예요.
            </b>
            {" "}이용자가 직접 정한 조건으로 종목을 걸러 보여줄 뿐,{" "}
            <b>
              금융투자상품의 매수·매도를 권유하지 않아요.
            </b>
            {" "}
            <b>
              자동주문·일임 기능이 없고
            </b>
            {" "}주문은 이용자가 증권 앱에서 직접 해요. 과거 데이터로 계산한 결과가 앞으로도 같다는 뜻은 아니에요. 투자판단과 그 책임은 이용자에게 있어요. {v.dataNote}
          </footer>
        </div>
      </main>
      {!!v.glossOpen && <GlossaryModal v={v} />}
      {!!v.rec.open && <RecordModal v={v} />}
      {!!v.em.open && <RuleEditModal v={v} />}
      {!!v.lib.open && <ConditionLibraryModal v={v} />}
      {!!v.consentOpen && <ConsentModal v={v} />}
      {!!v.hasToast && <Toast v={v} />}
    </div>
  );
}
