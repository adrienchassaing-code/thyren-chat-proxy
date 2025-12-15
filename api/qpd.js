export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).end();

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return res.status(500).json({ ok: false, error: "Upstash env missing" });

    const base = url.replace(/\/$/, "");
    const today = new Date().toISOString().slice(0, 10);
    const key = `chat:responses:${today}`;

    const r = await fetch(`${base}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = await r.text();
    if (!r.ok) return res.status(500).json({ ok: false, status: r.status, raw });

    const j = JSON.parse(raw);
    const val = Number(j?.result || 0);

    return res.status(200).json({ ok: true, qpd: val });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
