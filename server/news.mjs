// Naver Search API (뉴스) for the local bridge: recent headlines per watched stock.
//
// Naver's search API terms (as revised): show results as they are with a link to the
// original, no storing/caching beyond short-term, no AI processing. So this module keeps
// results in memory only, for at most 10 minutes per stock, and passes title/snippet/link
// through unchanged (only HTML tags and entities are stripped for display).
//
// Endpoint/headers default to the classic developer-center API; NAVER_NEWS_URL can point
// elsewhere if keys come from another channel (e.g. Naver Cloud API HUB).
const URL_ = process.env.NAVER_NEWS_URL || "https://openapi.naver.com/v1/search/news.json";
const ID = process.env.NAVER_CLIENT_ID || "";
const SECRET = process.env.NAVER_CLIENT_SECRET || "";
const TTL_MS = 10 * 60e3; // per stock; ~20 watched stocks ≈ a few thousand calls/day (limit 25,000)

export const newsConfigured = () => !!(ID && SECRET);

class NewsError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

const decode = s => s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
const domain = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

async function search(query) {
  const qs = new URLSearchParams({ query, display: "20", sort: "date" });
  const res = await fetch(`${URL_}?${qs}`, { headers: { "X-Naver-Client-Id": ID, "X-Naver-Client-Secret": SECRET } });
  if (res.status === 401) throw new NewsError("news-auth", "네이버 검색 API 인증에 실패했어요. .env.local의 NAVER_CLIENT_ID·NAVER_CLIENT_SECRET을 확인해 주세요.");
  if (res.status === 429) throw new NewsError("news-quota", "네이버 검색 API 하루 호출 한도를 넘었어요. 내일 다시 받아요.");
  if (!res.ok) throw new NewsError("news-" + res.status, `네이버 검색 API 응답 오류 (${res.status})`);
  return (await res.json()).items || [];
}

const cache = new Map(); // code -> { at, items }
let blockedUntil = 0; // after a quota/auth error, stop calling for a while

/**
 * Headlines from the last two days whose title mentions the company name (cuts noise from
 * short or generic names). Each stock is searched at most once per TTL.
 * @param stocks [{ code, name }]
 */
export async function newsFor(stocks) {
  const now = Date.now(), since = now - 2 * 864e5, out = [];
  for (const { code, name } of stocks) {
    let hit = cache.get(code);
    if ((!hit || now - hit.at > TTL_MS) && now > blockedUntil) {
      try {
        const raw = await search(name);
        hit = { at: Date.now(), items: raw.map(x => ({ title: decode(x.title), snippet: decode(x.description), url: x.originallink || x.link, naverUrl: x.link, source: domain(x.originallink || x.link), at: new Date(x.pubDate).toISOString() })) };
        cache.set(code, hit);
        await new Promise(r => setTimeout(r, 120));
      } catch (e) {
        if (e.code === "news-quota" || e.code === "news-auth") blockedUntil = Date.now() + (e.code === "news-quota" ? 60 * 60e3 : 5 * 60e3);
        throw e;
      }
    }
    for (const it of hit?.items || []) if (Date.parse(it.at) >= since && it.title.includes(name)) out.push({ code, corp: name, ...it });
  }
  // The same article can match two companies; keep one per link.
  const seen = new Set();
  return out.filter(x => !seen.has(x.url) && seen.add(x.url)).sort((a, b) => b.at.localeCompare(a.at));
}
