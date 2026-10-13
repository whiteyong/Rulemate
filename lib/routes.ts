export type Page = "home" | "cands" | "alerts" | "journal" | "builder" | "settings";

export const PAGE_PATH: Record<Page, string> = {
  home: "/",
  cands: "/matches",
  alerts: "/alerts",
  journal: "/journal",
  builder: "/builder",
  settings: "/settings",
};

export function pageOfPath(pathname: string): Page {
  const p = pathname.replace(/\/+$/, "") || "/";
  const hit = (Object.keys(PAGE_PATH) as Page[]).find(k => PAGE_PATH[k] === p);
  return hit ?? "home";
}
