// Client for the local Toss bridge (server/toss-local.mjs). Only used when the app itself
// runs on this computer (localhost): the deployed sites never call it and keep the
// virtual data, because Toss quotes are for the account holder's personal use only.
import type { Stock } from "./data";

const BRIDGE = "http://127.0.0.1:3200";

export type Snapshot = {
  source: "toss"; asOf: string; asOfLabel: string; session: "pre" | "open" | "closed" | "holiday"; today: string;
  dart?: { configured: boolean; error: string | null };
  stocks: Stock[]; skipped: string[];
};
export type Bar = { t: string; o: number; h: number; l: number; c: number; v: number };

export const isLocalApp = () => typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

async function call<T>(path: string): Promise<T> {
  const res = await fetch(BRIDGE + path, { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || `토스 연결 오류 (${res.status})`);
  return body as T;
}

/** null: bridge not running. configured=false: running without keys. */
export async function bridgeHealth(): Promise<{ configured: boolean } | null> {
  try { return await call<{ configured: boolean }>("/health"); } catch { return null; }
}

/** extra: journal stock codes that must be priced even if outside today's universe. */
export const fetchSnapshot = (extra: string[]) => call<Snapshot>("/snapshot?extra=" + encodeURIComponent(extra.join(",")));
export const fetchIntraday = (code: string) => call<{ bars: Bar[] }>("/candles?symbol=" + encodeURIComponent(code)).then(r => r.bars);

export type Filing = { code: string; corp: string; title: string; no: string; date: string; filer: string; rm: string; url: string };
/** OpenDART filings (today and yesterday) for these stock codes. configured=false: no DART_API_KEY. */
export const fetchFilings = (codes: string[]) =>
  call<{ configured: boolean; items: Filing[] }>("/disclosures?codes=" + encodeURIComponent(codes.join(",")));
