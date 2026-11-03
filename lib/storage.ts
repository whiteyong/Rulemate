// Phase 1 keeps everything in this browser's localStorage. Phase 2 moves rules,
// journal and settings to a per-user server store.
const STATE_KEY = "rm_b2c_state_v2";
export const CONSENT_KEY = "rm_b2c_consent";

type Saved = { n: number; state: Record<string, unknown> };

// What this tab last read or wrote. A tab only writes when its own data changed, so a tab
// left open (re-rendering on every quote) never puts its old copy over another tab's save.
let last: string | null = null;

export function loadState(): Saved | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    last = raw;
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

export function saveState(n: number, state: Record<string, unknown>) {
  const raw = JSON.stringify({ n, state });
  if (raw === last) return;
  last = raw;
  try {
    localStorage.setItem(STATE_KEY, raw);
  } catch {
    // storage full or blocked (private mode): the app keeps working in memory
  }
}

/** Another tab of this site saved: hand its data over. Returns a function that stops listening. */
export function onOtherTabSave(fn: (saved: Saved) => void) {
  const h = (e: StorageEvent) => {
    if (e.key !== STATE_KEY || !e.newValue) return;
    try {
      const saved = JSON.parse(e.newValue) as Saved;
      last = e.newValue;
      fn(saved);
    } catch {}
  };
  window.addEventListener("storage", h);
  return () => window.removeEventListener("storage", h);
}
