// Google News RSS search for the local bridge: recent headlines per watched stock.
//
// No key. Not an official API, so we stay polite: each stock is searched at most once per
// TTL, one request at a time with a pause in between, and after an error (429/5xx) we stop
// for a while. Only the headline, outlet, time and link are kept (in memory) — no article
// text is fetched.
//
// Requests return whatever is cached right away; stale stocks are refreshed in the
// background, so a new stock's headlines show on a later call (the app asks every minute).
const BASE = process.env.NEWS_RSS_URL || "https://news.google.com/rss/search";
const TTL_MS = 10 * 60e3, GAP_MS = 1500, KEEP_MS = 2 * 864e5;

const decode = s => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : ""; };

async function search(name) {
  const qs = new URLSearchParams({ q: `"${name}" when:2d`, hl: "ko", gl: "KR", ceid: "KR:ko" });
  const res = await fetch(`${BASE}?${qs}`, { headers: { "User-Agent": "Mozilla/5.0 (Rulemate personal use)" } });
  if (!res.ok) { const e = new Error(`Google 뉴스 응답 오류 (${res.status}). 잠시 뒤 다시 받아요.`); e.code = "news-" + res.status; throw e; }
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const source = tag(it, "source"), raw = tag(it, "title");
    // Titles end with " - 언론사"; the outlet is shown separately.
    const title = source && raw.endsWith(" - " + source) ? raw.slice(0, -(source.length + 3)) : raw;
    return { title, source, url: tag(it, "link"), at: new Date(tag(it, "pubDate")).toISOString() };
  }).filter(x => x.url.startsWith("https://") && !isNaN(Date.parse(x.at)));
}

const cache = new Map(); // code -> { at, name, items }
const queue = new Map(); // code -> name, waiting for a refresh
let running = false, blockedUntil = 0, lastError = null;

async function drain() {
  if (running) return; running = true;
  try {
    for (const [code, name] of queue) {
      queue.delete(code);
      if (Date.now() < blockedUntil) { queue.clear(); break; }
      try {
        cache.set(code, { at: Date.now(), name, items: await search(name) });
        lastError = null;
      } catch (e) {
        lastError = e.message;
        blockedUntil = Date.now() + 15 * 60e3;
        queue.clear(); break;
      }
      await new Promise(r => setTimeout(r, GAP_MS));
    }
  } finally { running = false; }
}

/**
 * Headlines from the last two days whose title mentions the company name (cuts noise from
 * short or generic names), newest first.
 * @param stocks [{ code, name }]
 */
export function newsFor(stocks) {
  const now = Date.now(), out = [];
  for (const { code, name } of stocks) {
    const hit = cache.get(code);
    if (!hit || hit.name !== name || now - hit.at > TTL_MS) queue.set(code, name);
    for (const it of hit?.items || []) if (now - Date.parse(it.at) < KEEP_MS && it.title.includes(name)) out.push({ code, corp: name, ...it });
  }
  if (queue.size) drain();
  // Newest first; the same article can match two companies, and outlets repost the same headline.
  const seen = new Set(), once = k => !seen.has(k) && seen.add(k);
  out.sort((a, b) => b.at.localeCompare(a.at));
  return { error: Date.now() < blockedUntil ? lastError : null, items: out.filter(x => once(x.url) && once(x.code + "|" + x.title)) };
}
