// Phase 1 keeps everything in this browser's localStorage. Phase 2 moves rules,
// journal and settings to a per-user server store.
const STATE_KEY = "rm_b2c_state_v2";
export const CONSENT_KEY = "rm_b2c_consent";

type Saved = { n: number; state: Record<string, unknown> };

export function loadState(): Saved | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

export function saveState(n: number, state: Record<string, unknown>) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ n, state }));
  } catch {
    // storage full or blocked (private mode): the app keeps working in memory
  }
}
