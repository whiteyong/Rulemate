import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Initially generated from design/Rulemate B2C.dc.html (scripts/convert-prototype.mjs); now maintained by hand.
export default function BuilderPage({ v }: { v: ViewModel }) {
  return (
    <>
      <div className="rm-split-920" style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
          <section style={{ background: v.t.card, borderRadius: "24px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: `1px solid ${v.t.line}` }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted, whiteSpace: "nowrap" }}>
                편집할 규칙
              </span>
              <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "380px" }}>
                <button onClick={v.rs2.toggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", height: "46px", padding: "0 14px", border: "0", borderRadius: "12px", cursor: "pointer", textAlign: "left", background: v.t.sub, color: v.t.ink }}>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {v.rs2.name}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "700", padding: "2px 7px", borderRadius: "6px", flexShrink: "0", background: v.t.card, color: v.t.muted }}>
                      {v.rs2.ver}
                    </span>
                  </span>
                  <span style={{ fontSize: "11px", color: v.t.muted, transform: v.rs2.rot }}>
                    ▼
                  </span>
                </button>
                {!!(v.rs2.open) && (
                  <>
                    <div onClick={v.rs2.close} style={{ position: "fixed", inset: "0", zIndex: "25" }}></div>
                    <div style={{ position: "absolute", top: "52px", left: "0", width: "max(100%,360px)", maxWidth: "calc(100vw - 48px)", zIndex: "26", boxSizing: "border-box", borderRadius: "18px", padding: "8px", display: "flex", flexDirection: "column", gap: "2px", background: v.t.card, boxShadow: v.t.shadow, border: `1px solid ${v.t.line}` }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", padding: "6px 10px", color: v.t.muted }}>
                        내 규칙 {v.rs2.count}
                      </div>
                      {(v.rs2.items as any[]).map((o: any, i26: number) => (
                        <Fragment key={i26}>
                          <button onClick={o.go} style={{ display: "flex", alignItems: "center", gap: "10px", border: "0", cursor: "pointer", textAlign: "left", padding: "10px 12px", borderRadius: "12px", background: o.bg, color: v.t.ink }}>
                            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "14px", fontWeight: "700" }}>
                                  {o.name}
                                </span>
                                {!!(o.hasTag) && (
                                  <>
                                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "6px", background: o.tagBg, color: o.tagColor }}>
                                      {o.tag}
                                    </span>
                                  </>
                                )}
                              </span>
                              <span style={{ fontSize: "12px", color: v.t.muted }}>
                                {o.meta}
                              </span>
                            </span>
                            <span style={{ width: "16px", fontSize: "14px", fontWeight: "800", color: v.t.priInk }}>
                              {o.check}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      <div style={{ display: "flex", gap: "6px", marginTop: "4px", paddingTop: "8px", borderTop: `1px solid ${v.t.line}` }}>
                        <button onClick={v.rs2.newRule} style={{ flex: "1", height: "38px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.priSoft, color: v.t.priInk }}>
                          + 새 규칙
                        </button>
                        <button onClick={v.rs2.manage} style={{ flex: "1", height: "38px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.sub, color: v.t.ink }}>
                          규칙 관리
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <span style={{ fontSize: "13px", color: v.t.muted }}>
                {v.bd.metaLine}
              </span>
              <button onClick={v.bd.newRule} style={{ marginLeft: "auto", height: "40px", padding: "0 14px", border: "0", borderRadius: "12px", background: v.t.priSoft, color: v.t.priInk, fontSize: "14px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                + 새 규칙
              </button>
            </div>
            {!!(v.bd.newOpen) && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "18px", background: v.t.sub }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      어떻게 시작할까요?
                    </span>
                    <button onClick={v.bd.closeNew} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", fontSize: "16px", cursor: "pointer", background: v.t.card, color: v.t.muted }}>
                      ×
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", gap: "8px" }}>
                    {(v.bd.starts as any[]).map((o: any, i27: number) => (
                      <Fragment key={i27}>
                        <button onClick={o.go} style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", border: "0", cursor: "pointer", padding: "14px", borderRadius: "14px", background: v.t.card, color: v.t.ink }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "15px", fontWeight: "700" }}>
                              {o.label}
                            </span>
                            {!!(o.hasTag) && (
                              <>
                                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "6px", background: v.t.sub, color: v.t.muted }}>
                                  {o.tag}
                                </span>
                              </>
                            )}
                          </span>
                          <span style={{ fontSize: "13px", lineHeight: "1.45", color: v.t.muted, wordBreak: "keep-all" }}>
                            {o.desc}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", lineHeight: "1.5", color: v.t.faint }}>
                    예시 필터는 조건 구성만 보여주는 틀이에요. 숫자는 비워 뒀고, 운영사가 성과를 보증하거나 더 낫다고 권하는 규칙이 아니에요.
                  </span>
                </div>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <input value={v.bd.name} onChange={v.bd.onName} style={{ flex: "1 1 220px", minWidth: "0", border: "0", outline: "none", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", background: "transparent", padding: "6px 0", color: v.t.ink }} />
              <button onClick={v.bd.save} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", background: v.bd.saveBg, color: v.bd.saveColor }}>
                {v.bd.saveLabel}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "8px" }}>
              {(v.bd.modes as any[]).map((m: any, i28: number) => (
                <Fragment key={i28}>
                  <button onClick={m.go} style={{ display: "flex", flexDirection: "column", gap: "3px", textAlign: "left", cursor: "pointer", padding: "12px 14px", borderRadius: "14px", background: m.bg, border: `2px solid ${m.border}`, color: v.t.ink }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: "12px", color: v.t.muted }}>
                      {m.sub}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          </section>
          {!!(v.bd.isExample) && (
            <>
              <div style={{ borderRadius: "16px", padding: "14px 18px", fontSize: "14px", fontWeight: "600", lineHeight: "1.5", textWrap: "pretty", background: v.t.card, color: v.t.muted }}>
                예시 필터로 시작했어요. 빈칸의 숫자는 직접 정해 주세요. 운영사가 성과를 보증하거나 권하는 규칙이 아니에요.
              </div>
            </>
          )}
          {!!(v.bd.fromJournal) && (
            <>
              <div style={{ background: v.t.warnSoft, color: v.t.warnInk, borderRadius: "16px", padding: "14px 18px", fontSize: "14px", fontWeight: "600", lineHeight: "1.5", textWrap: "pretty" }}>
                매매일지에서 왔어요. 테두리가 있는 ‘큰 내린 봉’ 감점을 키우거나 지운 뒤, 오른쪽 미리보기가 어떻게 바뀌는지 확인해 보세요.
              </div>
            </>
          )}
          {!!(v.bd.notScript) && (
            <>
              {(v.bd.secs as any[]).map((sec: any, i29: number) => (
                <Fragment key={i29}>
                  <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "4px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.t.ink, color: v.t.bg, fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          {sec.n}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <div style={{ fontSize: "18px", fontWeight: "700" }}>
                            {sec.title}
                          </div>
                          <div style={{ fontSize: "14px", color: v.t.muted, lineHeight: "1.5", textWrap: "pretty" }}>
                            {sec.sub}
                          </div>
                          {!!(v.showTerms) && (
                            <>
                              <div style={{ fontSize: "12px", color: v.t.faint }}>
                                {sec.term}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: v.t.muted, whiteSpace: "nowrap", paddingTop: "4px" }}>
                        {sec.count}
                      </span>
                    </div>
                    {(sec.blocks as any[]).map((b: any, i30: number) => (
                      <Fragment key={i30}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderRadius: "16px", padding: "12px 12px 12px 16px", background: v.t.sub, border: `2px solid ${b.border}` }}>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "13px", fontWeight: "700", padding: "3px 9px", borderRadius: "999px", background: v.t.card, color: v.t.ink }}>
                                  {b.name}
                                </span>
                                {!!(v.showTerms) && (
                                  <>
                                    <span style={{ fontSize: "12px", color: v.t.faint }}>
                                      {b.term}
                                    </span>
                                  </>
                                )}
                              </div>
                              {!!(b.isBlock) && (
                                <>
                                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontSize: "16px", fontWeight: "600", lineHeight: "1.5" }}>
                                    <span>
                                      {b.pre}
                                    </span>
                                    {!!(b.hasInput) && (
                                      <>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", borderRadius: "9px", padding: "0 9px", height: "34px", background: v.t.card, border: `1.5px solid ${b.inBorder}` }}>
                                          <input value={b.v} onChange={b.onV} placeholder="?" inputMode="decimal" style={{ width: b.inW, border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "16px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: v.t.priInk }} />
                                          <span style={{ fontSize: "15px", fontWeight: "700", color: v.t.priInk }}>
                                            {b.unit}
                                          </span>
                                        </span>
                                      </>
                                    )}
                                    <span>
                                      {b.post}
                                    </span>
                                  </div>
                                </>
                              )}
                              {!!(b.isFormula) && (
                                <>
                                  {!!(b.hasInput) && (
                                    <>
                                      <input value={b.fx} onChange={b.onFx} spellCheck={false} style={{ width: "100%", boxSizing: "border-box", height: "38px", borderRadius: "9px", padding: "0 12px", outline: "none", fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", fontSize: "15px", background: v.t.card, color: v.t.ink, border: `1.5px solid ${b.fxBorder}` }} />
                                    </>
                                  )}
                                  {!!(b.isBool) && (
                                    <>
                                      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", fontSize: "15px", padding: "8px 0" }}>
                                        {b.fx}
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                            {!!(b.hasPts) && (
                              <>
                                <div style={{ display: "flex", alignItems: "center", gap: "2px", borderRadius: "11px", padding: "3px", flexShrink: "0", background: v.t.card }}>
                                  <button onClick={b.ptsDec} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", background: "transparent", fontSize: "17px", cursor: "pointer", color: v.t.muted }}>
                                    −
                                  </button>
                                  <span style={{ display: "flex", alignItems: "center", gap: "1px", padding: "0 2px" }}>
                                    <input value={b.ptsVal} onChange={b.onPts} placeholder="점수" inputMode="numeric" style={{ width: "42px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "15px", fontWeight: "800", fontVariantNumeric: "tabular-nums", color: b.ptsColor }} />
                                    <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                                      점
                                    </span>
                                  </span>
                                  <button onClick={b.ptsInc} style={{ width: "30px", height: "30px", border: "0", borderRadius: "8px", background: "transparent", fontSize: "17px", cursor: "pointer", color: v.t.muted }}>
                                    +
                                  </button>
                                </div>
                              </>
                            )}
                            <button onClick={b.remove} style={{ width: "34px", height: "34px", border: "0", borderRadius: "10px", background: "transparent", fontSize: "18px", cursor: "pointer", flexShrink: "0", color: v.t.faint }}>
                              ×
                            </button>
                          </div>
                          {!!(b.hasErr) && (
                            <>
                              <div style={{ fontSize: "13px", fontWeight: "600", paddingLeft: "16px", color: v.t.warnInk }}>
                                {b.err}
                              </div>
                            </>
                          )}
                        </div>
                      </Fragment>
                    ))}
                    <button onClick={sec.add} style={{ height: "48px", borderRadius: "14px", background: "transparent", fontSize: "15px", fontWeight: "700", cursor: "pointer", border: `1.5px dashed ${v.t.off}`, color: v.t.muted }}>
                      + {sec.addLabel}
                    </button>
                  </section>
                </Fragment>
              ))}
            </>
          )}
          {!!(v.bd.isScript) && (
            <>
              <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>
                      1·2단계 스크립트
                    </div>
                    <div style={{ fontSize: "14px", color: v.t.muted }}>
                      블록·수식과 같은 규칙이에요. 이름은 용어집의 ‘스크립트 이름’을 써요.
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={v.bd.resetScript} style={{ height: "40px", padding: "0 14px", border: "0", borderRadius: "10px", background: v.t.sub, color: v.t.ink, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                      블록 기준으로 되돌리기
                    </button>
                    <button onClick={v.bd.applyScript} style={{ height: "40px", padding: "0 14px", border: "0", borderRadius: "10px", background: v.t.priSoft, color: v.t.priInk, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                      미리보기에 적용
                    </button>
                  </div>
                </div>
                <textarea value={v.bd.script} onChange={v.bd.onScript} spellCheck={false} rows={18} style={{ width: "100%", boxSizing: "border-box", border: "0", borderRadius: "16px", padding: "18px", resize: "vertical", outline: "none", fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", fontSize: "14px", lineHeight: "1.65", background: v.t.code, color: v.t.codeInk }}></textarea>
                {(v.bd.lint as any[]).map((i: any, i31: number) => (
                  <Fragment key={i31}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", borderRadius: "12px", padding: "10px 12px", background: i.bg, color: i.color }}>
                      <span style={{ fontWeight: "800" }}>
                        {i.icon}
                      </span>
                      <span style={{ textWrap: "pretty" }}>
                        {i.text}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </section>
            </>
          )}
          <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.t.ink, color: v.t.bg, fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                3
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  마지막 확인 · 가격 계획
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted, lineHeight: "1.5", textWrap: "pretty" }}>
                  손절가·목표가를 어떻게 정할지, 어떤 종목만 남길지 정해요
                </div>
                {!!(v.showTerms) && (
                  <>
                    <div style={{ fontSize: "12px", color: v.t.faint }}>
                      손절가(여기서 끊기) · 목표가(여기서 챙기기) · 손익비(걸 돈 대비 벌 돈) · 1회 위험 금액
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))", gap: "12px" }}>
              {(v.bd.methods as any[]).map((m: any, i32: number) => (
                <Fragment key={i32}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      {m.label}
                    </span>
                    <div style={{ display: "flex", background: v.t.sub, borderRadius: "12px", padding: "4px", gap: "2px" }}>
                      {(m.opts as any[]).map((o: any, i33: number) => (
                        <Fragment key={i33}>
                          <button onClick={o.go} style={{ flex: "1", border: "0", cursor: "pointer", padding: "9px 6px", borderRadius: "9px", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", background: o.bg, color: o.color }}>
                            {o.label}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {(v.bd.nums as any[]).map((r: any, i34: number) => (
                <Fragment key={i34}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: `1px solid ${v.t.line}` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>
                        {r.label}
                      </span>
                      <span style={{ fontSize: "13px", color: v.t.muted, lineHeight: "1.45", textWrap: "pretty" }}>
                        {r.desc}
                      </span>
                      {!!(r.hasErr) && (
                        <>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: v.t.warnInk }}>
                            {r.err}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "12px", padding: "4px", flexShrink: "0", background: v.t.sub }}>
                      <button onClick={r.dec} style={{ width: "34px", height: "34px", border: "0", borderRadius: "9px", fontSize: "18px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        −
                      </button>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", minWidth: "76px" }}>
                        <input value={r.value} onChange={r.onChange} inputMode="decimal" placeholder="?" style={{ width: "46px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "15px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: r.color }} />
                        <span style={{ fontSize: "14px", fontWeight: "700", color: v.t.muted }}>
                          {r.unit}
                        </span>
                      </span>
                      <button onClick={r.inc} style={{ width: "34px", height: "34px", border: "0", borderRadius: "9px", fontSize: "18px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                        +
                      </button>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
          <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "6px" }}>
              <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.t.ink, color: v.t.bg, fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                4
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  알림
                </div>
                <div style={{ fontSize: "14px", color: v.t.muted }}>
                  언제 알려드릴지 정해요. 알림 메뉴와 토스트 팝업에 보여요.
                </div>
              </div>
            </div>
            {(v.bd.alerts as any[]).map((a: any, i35: number) => (
              <Fragment key={i35}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: `1px solid ${v.t.line}` }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      {a.label}
                    </span>
                    <span style={{ fontSize: "13px", color: v.t.muted, lineHeight: "1.45" }}>
                      {a.desc}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}>
                    {!!(a.hasNum) && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "2px", borderRadius: "10px", padding: "3px", background: v.t.sub }}>
                          <button onClick={a.dec} style={{ width: "28px", height: "28px", border: "0", borderRadius: "7px", fontSize: "16px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                            −
                          </button>
                          <span style={{ display: "flex", alignItems: "center", gap: "1px", padding: "0 4px" }}>
                            <input value={a.numVal} onChange={a.onNum} placeholder="?" inputMode="numeric" style={{ width: "34px", border: "0", outline: "none", background: "transparent", textAlign: "right", fontSize: "14px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: v.t.ink }} />
                            <span style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                              점
                            </span>
                          </span>
                          <button onClick={a.inc} style={{ width: "28px", height: "28px", border: "0", borderRadius: "7px", fontSize: "16px", cursor: "pointer", background: v.t.card, color: v.t.ink }}>
                            +
                          </button>
                        </div>
                      </>
                    )}
                    <button onClick={a.toggle} style={{ width: "52px", height: "30px", borderRadius: "15px", border: "0", cursor: "pointer", padding: "3px", display: "flex", background: a.swBg, justifyContent: a.swJustify }}>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)" }}></span>
                    </button>
                  </div>
                </div>
              </Fragment>
            ))}
          </section>
        </div>
        <div className="rm-sticky" style={{ flex: "1 1 340px", maxWidth: "420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px" }}>
          <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>
                미리보기
              </div>
              <div style={{ fontSize: "13px", color: v.t.muted, lineHeight: "1.5" }}>
                {v.pvNote}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "6px" }}>
              {(v.pv.funnel as any[]).map((f: any, i36: number) => (
                <Fragment key={i36}>
                  <div style={{ borderRadius: "12px", padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px", background: v.t.sub }}>
                    <span style={{ fontSize: "12px", color: v.t.muted, fontWeight: "600" }}>
                      {f.label}
                    </span>
                    <span style={{ fontSize: "17px", fontWeight: "800", fontVariantNumeric: "tabular-nums" }}>
                      {f.value}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            {!!(v.pv.hasBlankNote) && (
              <>
                <div style={{ fontSize: "13px", color: v.t.warnInk, fontWeight: "600" }}>
                  빈칸인 조건은 빼고 계산했어요
                </div>
              </>
            )}
            {!!(v.pv.isOk) && (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {(v.pv.rows as any[]).map((p: any, i37: number) => (
                    <Fragment key={i37}>
                      <div style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr) auto", gap: "10px", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${v.t.line}` }}>
                        <span style={{ fontSize: "15px", fontWeight: "800", textAlign: "center", color: v.t.priInk }}>
                          {p.rank}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700" }}>
                            {p.name}
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
                            <span style={{ display: "flex", gap: "3px" }}>
                              {(p.dots as any[]).map((d: any, i38: number) => (
                                <Fragment key={i38}>
                                  <span style={{ width: "14px", height: "6px", borderRadius: "3px", background: d.c }}></span>
                                </Fragment>
                              ))}
                            </span>
                            <span style={{ fontSize: "12px", color: v.t.muted }}>
                              {p.condSum}
                              {!!(p.hasWarn) && (
                                <>
                                  <span style={{ fontWeight: "600", color: v.t.warnInk }}>
                                    {" "}· 감점 {p.warnNames}
                                  </span>
                                </>
                              )}
                            </span>
                          </span>
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "700", padding: "4px 8px", borderRadius: "7px", whiteSpace: "nowrap", background: v.t.priSoft, color: v.t.priInk }}>
                          {p.score}점
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: v.t.muted }}>
                    1위 {v.pv.firstName} · 조건이 걸린 지점
                  </div>
                  <div style={{ borderRadius: "14px", padding: "10px", background: v.t.sub }}>
                    {v.pv.chartEl}
                  </div>
                </div>
              </>
            )}
            {!!(v.pv.isEmpty) && (
              <>
                <div style={{ borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "8px", background: v.t.sub }}>
                  <div style={{ fontSize: "15px", fontWeight: "700" }}>
                    {v.pv.empty.title}
                  </div>
                  {(v.pv.empty.lines as any[]).map((ln: any, i39: number) => (
                    <Fragment key={i39}>
                      <div style={{ fontSize: "13px", lineHeight: "1.55", color: v.t.muted, textWrap: "pretty" }}>
                        {ln}
                      </div>
                    </Fragment>
                  ))}
                  {!!(v.pv.empty.hasFix) && (
                    <>
                      <button onClick={v.pv.empty.fix} style={{ alignSelf: "flex-start", marginTop: "4px", height: "38px", padding: "0 14px", border: "0", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: v.t.priSoft, color: v.t.priInk }}>
                        {v.pv.empty.fixLabel}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </section>
          <section style={{ background: v.t.card, borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                규칙 점검
              </div>
              <span style={{ fontSize: "13px", fontWeight: "700", padding: "5px 9px", borderRadius: "7px", background: v.chk.bg, color: v.chk.color }}>
                {v.chk.label}
              </span>
            </div>
            {(v.chk.items as any[]).map((i: any, i40: number) => (
              <Fragment key={i40}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: "0", marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", background: i.bg, color: i.color }}>
                    {i.icon}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <span style={{ textWrap: "pretty" }}>
                      {i.text}
                    </span>
                    <span style={{ fontSize: "12px", color: v.t.faint }}>
                      {i.kind}
                    </span>
                  </span>
                </div>
              </Fragment>
            ))}
            <div style={{ fontSize: "12px", color: v.t.faint, lineHeight: "1.5", paddingTop: "4px", borderTop: `1px solid ${v.t.line}`, textWrap: "pretty" }}>
              저장하면 홈·내 조건 충족 종목·알림이 이 버전 기준으로 바뀌어요. 저장 전 변경은 결과 화면에 반영되지 않아요.
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
