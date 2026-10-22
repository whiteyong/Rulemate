// OpenDART 공시검색 (list.json) feed for the local bridge.
// Keeps today's and the previous day's filings for listed companies (KOSPI/KOSDAQ) in
// memory and tops them up at most once a minute — a few hundred calls a day against
// OpenDART's ~20,000/day limit (status 020). Docs: opendart.fss.or.kr › 개발가이드 › 공시검색.
const BASE = process.env.DART_BASE_URL || "https://opendart.fss.or.kr";
const KEY = process.env.DART_API_KEY || "";
const REFRESH_MS = 60e3;

export const dartConfigured = () => !!KEY;

const ymd = d => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(d).replaceAll("-", "");

class DartError extends Error {
  constructor(status, message) { super(message); this.code = "dart-" + status; }
}
const MESSAGES = {
  "010": "OpenDART 인증키가 등록되지 않았어요. .env.local의 DART_API_KEY를 확인해 주세요.",
  "011": "OpenDART 인증키를 쓸 수 없는 상태예요.",
  "012": "OpenDART에서 이 컴퓨터의 IP를 허용하지 않았어요.",
  "020": "OpenDART 하루 요청 한도를 넘었어요. 내일 다시 받아요.",
  "800": "OpenDART가 시스템 점검 중이에요.",
};

async function page(bgn, end, pageNo) {
  const qs = new URLSearchParams({ crtfc_key: KEY, bgn_de: bgn, end_de: end, sort: "date", sort_mth: "desc", page_no: String(pageNo), page_count: "100" });
  const res = await fetch(`${BASE}/api/list.json?${qs}`);
  if (!res.ok) throw new DartError(res.status, `OpenDART 응답 오류 (${res.status})`);
  const j = await res.json();
  if (j.status === "013") return { list: [], totalPage: 0 }; // no filings in range
  if (j.status !== "000") throw new DartError(j.status, MESSAGES[j.status] || `OpenDART 오류 ${j.status}: ${j.message}`);
  return { list: j.list || [], totalPage: Number(j.total_page) || 1 };
}

const byNo = new Map(); // rcept_no -> filing (listed companies)
const seen = new Set(); // every rcept_no already read, listed or not
let from = "", lastRefresh = 0, refreshing = null;

function keep(x) {
  seen.add(x.rcept_no);
  // Listed companies only (유가증권 Y / 코스닥 K with a stock code).
  if (!x.stock_code || !["Y", "K"].includes(x.corp_cls)) return;
  byNo.set(x.rcept_no, { code: x.stock_code, corp: x.corp_name, title: x.report_nm.trim(), no: x.rcept_no, date: x.rcept_dt, filer: x.flr_nm, rm: x.rm || "", url: `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${x.rcept_no}` });
}

async function refresh() {
  const now = new Date(), today = ymd(now), prev = ymd(new Date(now.getTime() - 864e5));
  if (from !== prev) { byNo.clear(); seen.clear(); from = prev; } // new day: start over from yesterday
  const initial = seen.size === 0;
  lastRefresh = Date.now(); // also on failure: retry after a minute, not on every request
  // Newest first: on top-ups, stop at the first page that holds a filing we already have.
  for (let n = 1; ; n++) {
    const { list, totalPage } = await page(prev, today, n);
    const reachedKnown = list.some(x => seen.has(x.rcept_no));
    for (const x of list) if (!seen.has(x.rcept_no)) keep(x);
    if (n >= totalPage || (!initial && reachedKnown)) break;
    await new Promise(r => setTimeout(r, 150));
  }
}

/** Brings the feed up to date if it is older than a minute. Concurrent callers share one refresh. */
export async function ensureFresh() {
  if (!KEY || Date.now() - lastRefresh < REFRESH_MS) return;
  refreshing ??= refresh().finally(() => { refreshing = null; });
  return refreshing;
}

/** Filings for the given stock codes, newest first. */
export function filingsFor(codes) {
  const want = new Set(codes);
  return [...byNo.values()].filter(f => want.has(f.code)).sort((a, b) => b.no.localeCompare(a.no));
}

export function hasFilingToday(code) {
  const today = ymd(new Date());
  for (const f of byNo.values()) if (f.code === code && f.date === today) return true;
  return false;
}
