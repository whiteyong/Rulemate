import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function SettingsPage({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "920px" }}>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              화면
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted }}>
              메뉴 위치와 밝기를 골라요. 내용은 똑같아요.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "12px" }}>
            {(v.themeOpts as any[]).map((o: any, i41: number) => (
              <Fragment key={i41}>
                <button onClick={o.go} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", cursor: "pointer", padding: "14px", borderRadius: "18px", background: v.t.sub, color: v.t.ink, border: `2px solid ${o.border}` }}>
                  <span style={{ height: "96px", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: o.dir, background: o.pBg }}>
                    <span style={{ flexShrink: "0", width: o.barW, height: o.barH, background: o.barBg }}></span>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", padding: "10px" }}>
                      <span style={{ height: "22px", borderRadius: "6px", background: o.cardBg }}></span>
                      <span style={{ display: "flex", gap: "6px", flex: "1" }}>
                        <span style={{ flex: "1.35", borderRadius: "6px", background: o.cardBg }}></span>
                        <span style={{ flex: "1", borderRadius: "6px", background: o.cardBg }}></span>
                      </span>
                    </span>
                  </span>
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>
                        {o.label}
                      </span>
                      <span style={{ fontSize: "13px", color: v.t.muted }}>
                        {o.sub}
                      </span>
                    </span>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", boxSizing: "border-box", flexShrink: "0", border: o.radio }}></span>
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", paddingTop: "16px", borderTop: `1px solid ${v.t.line}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "15px", fontWeight: "700" }}>
                원래 용어 함께 보기
              </span>
              <span style={{ fontSize: "13px", color: v.t.muted }}>
                쉬운 말 아래에 ‘손절가’, ‘VWAP’ 같은 원래 용어를 작게 보여줘요
              </span>
            </div>
            <button onClick={v.termsSw.toggle} style={{ width: "52px", height: "30px", borderRadius: "15px", border: "0", cursor: "pointer", padding: "3px", display: "flex", flexShrink: "0", background: v.termsSw.swBg, justifyContent: v.termsSw.swJustify }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)" }}></span>
            </button>
          </div>
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              내 조건 충족 종목
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted }}>
              하루에 몇 개까지 받아볼지 정해요. 맞는 종목이 적으면 그만큼만 보여요.
            </div>
          </div>
          <div style={{ display: "flex", borderRadius: "14px", padding: "4px", gap: "4px", maxWidth: "440px", background: v.t.sub }}>
            {(v.topOpts as any[]).map((o: any, i42: number) => (
              <Fragment key={i42}>
                <button onClick={o.go} style={{ flex: "1", height: "42px", border: "0", borderRadius: "11px", fontSize: "15px", fontWeight: "700", cursor: "pointer", background: o.bg, color: o.color }}>
                  {o.label}
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ fontSize: "13px", color: v.t.muted }}>
            {v.topNote}
          </div>
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              계산에 쓸 내 투자금
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted }}>
              증권 계좌와 연결하지 않아요. 최대 수량을 계산할 때만 써요.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "440px", borderRadius: "14px", height: "56px", padding: "0 16px", boxSizing: "border-box", background: v.t.sub }}>
            <input ref={v.acctRef} value={v.acctSet.value} onChange={v.acctSet.onChange} inputMode="numeric" placeholder="금액을 넣어 주세요" style={{ flex: "1", minWidth: "0", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "20px", fontWeight: "800", fontVariantNumeric: "tabular-nums", color: v.t.ink }} />
            <span style={{ fontSize: "16px", fontWeight: "700", color: v.t.muted }}>
              원
            </span>
            {!!(v.acctSet.has) && (
              <>
                <button onClick={v.acctSet.clear} aria-label="지우기" style={{ width: "26px", height: "26px", border: "0", borderRadius: "50%", flexShrink: "0", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", background: v.t.off, color: v.t.card }}>
                  ×
                </button>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(v.acctSet.quick as any[]).map((q: any, i43: number) => (
              <Fragment key={i43}>
                <button onClick={q.go} style={{ border: "0", cursor: "pointer", padding: "8px 13px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", background: q.bg, color: q.color }}>
                  {q.label}
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ fontSize: "13px", color: v.t.muted }}>
            {v.acctSet.note}
          </div>
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              알림 받기
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted }}>
              {v.alertRuleLine}
            </div>
          </div>
          {!!(v.hasAlertSet) && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "10px" }}>
                {(v.alertToggles as any[]).map((a: any, i44: number) => (
                  <Fragment key={i44}>
                    <div style={{ borderRadius: "16px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", background: v.t.sub }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700" }}>
                          {a.label}
                        </span>
                        <button onClick={a.toggle} style={{ width: "48px", height: "28px", borderRadius: "14px", border: "0", cursor: "pointer", padding: "3px", display: "flex", flexShrink: "0", background: a.swBg, justifyContent: a.swJustify }}>
                          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)" }}></span>
                        </button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", lineHeight: "1.45", wordBreak: "keep-all", color: v.t.muted }}>
                          {a.desc}
                        </span>
                        {!!(a.hasNum) && (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px", borderRadius: "10px", padding: "3px", flexShrink: "0", background: v.t.card }}>
                              <button onClick={a.dec} style={{ width: "26px", height: "26px", border: "0", borderRadius: "7px", fontSize: "15px", cursor: "pointer", background: "transparent", color: v.t.ink }}>
                                −
                              </button>
                              <span style={{ display: "flex", alignItems: "center", gap: "1px", padding: "0 4px" }}>
                                <input value={a.numVal} onChange={a.onNum} placeholder="?" inputMode="numeric" style={{ width: "30px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "13px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: v.t.ink }} />
                                <span style={{ fontSize: "12px", fontWeight: "700", color: v.t.muted }}>
                                  점
                                </span>
                              </span>
                              <button onClick={a.inc} style={{ width: "26px", height: "26px", border: "0", borderRadius: "7px", fontSize: "15px", cursor: "pointer", background: "transparent", color: v.t.ink }}>
                                +
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          )}
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>
                내 규칙 관리
              </div>
              <div style={{ fontSize: "14px", color: v.t.muted }}>
                규칙을 수정하거나, 복제하거나, 삭제할 수 있어요
              </div>
            </div>
            <button onClick={v.newRuleGo} style={{ height: "40px", padding: "0 14px", border: "0", borderRadius: "12px", background: v.t.priSoft, color: v.t.priInk, fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
              + 새 규칙
            </button>
          </div>
          {(v.ruleMgmt as any[]).map((r: any, i45: number) => (
            <Fragment key={i45}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", padding: "14px 16px", borderRadius: "16px", background: v.t.sub }}>
                <div style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {r.name}
                    </span>
                    {!!(r.hasTag) && (
                      <>
                        <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "6px", background: v.t.card, color: v.t.muted }}>
                          {r.tag}
                        </span>
                      </>
                    )}
                    {!!(r.isActive) && (
                      <>
                        <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "6px", background: v.t.priSoft, color: v.t.priInk }}>
                          지금 기준
                        </span>
                      </>
                    )}
                  </div>
                  <span style={{ fontSize: "13px", color: v.t.muted }}>
                    {r.meta}
                  </span>
                </div>
                {!!(r.notConfirm) && (
                  <>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={r.edit} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        수정
                      </button>
                      <button onClick={r.dup} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        복제
                      </button>
                      <button onClick={r.del} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.card, color: r.delColor }}>
                        삭제
                      </button>
                    </div>
                  </>
                )}
                {!!(r.confirm) && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: v.t.warnInk }}>
                        삭제할까요? 매매일지 기록은 남아요
                      </span>
                      <button onClick={r.cancel} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        취소
                      </button>
                      <button onClick={r.doDel} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.warn, color: v.t.onWarn }}>
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Fragment>
          ))}
          <div style={{ fontSize: "12px", color: v.t.faint }}>
            규칙이 하나만 남으면 삭제할 수 없어요.
          </div>
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0", flex: "1 1 320px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              용어집
            </div>
            <div style={{ fontSize: "14px", color: v.t.muted, lineHeight: "1.5" }}>
              블록·수식·스크립트, 그리고 결과 화면의 설명문 모두 같은 이름을 써요.
            </div>
          </div>
          <button onClick={v.openGloss} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "12px", background: "oklch(0.6 0.19 255)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", flexShrink: "0" }}>
            용어집 열기
          </button>
        </section>
        <section style={{ background: v.t.card, borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            약관·고지
          </div>
          <div style={{ borderRadius: "16px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", lineHeight: "1.55", background: v.t.sub }}>
            <span>
              <b>
                본 서비스는 정보제공·학습용 도구이며, 투자판단과 책임은 이용자에게 있어요.
              </b>
            </span>
            <span>
              <b>
                당사는 금융투자상품의 매수·매도를 권유하지 않아요.
              </b>
            </span>
            <span>
              <b>
                자동주문·일임 기능이 없어요.
              </b>
              {" "}주문은 이용자가 직접 해요.
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={v.showConsent} style={{ height: "40px", padding: "0 14px", border: "0", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", background: v.t.sub, color: v.t.ink }}>
              처음 안내 다시 보기
            </button>
            <span style={{ height: "40px", padding: "0 14px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", color: v.t.muted }}>
              이용약관 · 개인정보 처리방침
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
