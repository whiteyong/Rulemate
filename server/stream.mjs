// Real-time trades for the local bridge.
//
// Toss WebSocket (docs: overview.md › 웹소켓 연동): one connection (2 allowed per account),
// a declarative subscription — the array we send IS the whole subscription — up to 100
// codes, at most 5 declarations/s, and a PING within every 180 s (we send one every 60 s).
// Trade data is LOSSY (latest state wins), which is fine for prices and charts.
//
// createFakeStream() simulates ticks for development against server/fake-toss.mjs.

const WS_URL = process.env.TOSS_WS_URL || "wss://openapi-ws.tossinvest.com/ws/v1";
const MAX_CODES = 100;

/**
 * @param getToken (force?: boolean) => Promise<string>
 * @param onTick ({ code, price, volume, t }) => void
 */
export function createTossStream(getToken, onTick) {
  let ws = null, codes = [], declared = "", pingTimer = null, declareTimer = null, retry = 0, reconnectTimer = null;
  const state = { connected: false, error: null, subscribed: 0 };

  function declare() {
    clearTimeout(declareTimer);
    declareTimer = setTimeout(() => { // debounce: stays well under 5 declarations/s
      if (!ws || ws.readyState !== 1) return;
      const body = JSON.stringify([{ id: "rulemate" }, ...(codes.length ? [{ type: "trade:kr", codes }] : [])]);
      if (body !== declared) { ws.send(body); declared = body; }
    }, 300);
  }

  async function connect() {
    if (ws || !codes.length) return;
    let token;
    try { token = await getToken(retry > 1); } catch (e) { state.error = e.message; return schedule(); }
    ws = new WebSocket(WS_URL, { headers: { Authorization: "Bearer " + token } });
    ws.onopen = () => {
      retry = 0; declared = ""; state.connected = true; state.error = null;
      declare();
      pingTimer = setInterval(() => ws?.readyState === 1 && ws.send("PING"), 60e3);
    };
    ws.onmessage = ev => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.type === "message" && m.topic?.startsWith("trade:kr:") && m.data) {
        onTick({ code: m.topic.slice(9), price: Number(m.data.price), volume: Number(m.data.volume) || 0, t: m.data.timestamp });
      } else if (m.type === "subscriptions") {
        state.subscribed = (m.subscribed || []).length;
        // Rejected codes would be rejected again on every re-declaration; drop them.
        const bad = new Set((m.rejected || []).map(r => String(r.target || "").split(":").pop()).filter(Boolean)); // target: "trade:kr:999999"
        if (bad.size) { codes = codes.filter(c => !bad.has(c)); declare(); }
      } else if (m.type === "error") {
        state.error = m.error?.message || m.error?.code || "웹소켓 오류";
        if (m.error?.code === "rate-limit-exceeded") { declared = ""; setTimeout(declare, 1000); }
      }
    };
    ws.onclose = () => { cleanup(); schedule(); };
    ws.onerror = () => { state.error = "토스 실시간 연결이 끊겼어요. 다시 연결하고 있어요."; };
  }

  function cleanup() {
    clearInterval(pingTimer); pingTimer = null; ws = null; state.connected = false; state.subscribed = 0; declared = "";
  }
  function schedule() {
    clearTimeout(reconnectTimer);
    if (!codes.length) return;
    const wait = Math.min(30e3, 1000 * 2 ** retry++); // 1s, 2s, 4s … 30s
    reconnectTimer = setTimeout(connect, wait);
  }

  return {
    setCodes(next) {
      codes = [...new Set(next)].slice(0, MAX_CODES);
      if (!codes.length) { clearTimeout(reconnectTimer); if (ws) { const w = ws; cleanup(); w.close(); } return; }
      if (!ws) connect(); else declare();
    },
    status: () => ({ ...state, codes: codes.length }),
  };
}

/** Development: a random walk per subscribed code, a few ticks per second in total. */
export function createFakeStream(priceOf, onTick) {
  let codes = [], timer = null;
  const last = new Map();
  function tick() {
    if (codes.length) {
      const code = codes[Math.floor(Math.random() * codes.length)];
      const p0 = last.get(code) ?? priceOf(code);
      if (p0) {
        const p = Math.max(1, Math.round(p0 * (1 + (Math.random() - 0.5) * 0.004)));
        last.set(code, p);
        onTick({ code, price: p, volume: 1 + Math.floor(Math.random() * 300), t: new Date().toISOString() });
      }
    }
    timer = setTimeout(tick, 150 + Math.random() * 350);
  }
  return {
    setCodes(next) { codes = [...new Set(next)].slice(0, MAX_CODES); if (!timer) tick(); },
    status: () => ({ connected: true, error: null, subscribed: codes.length, codes: codes.length, fake: true }),
  };
}
