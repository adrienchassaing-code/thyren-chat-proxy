export default async function handler(req, res) {
  // ✅ CORS (TOUT EN HAUT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      res.status(500).json({ ok: false, error: "Upstash env missing" });
      return;
    }

    const base = url.replace(/\/$/, "");
    const today = new Date().toISOString().slice(0, 10);
    const key = `chat:responses:${today}`;

    const r = await fetch(`${base}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = await r.text();
    if (!r.ok) {
      res.status(500).json({ ok: false, status: r.status, raw });
      return;
    }

    const j = JSON.parse(raw);
    const val = Number(j?.result || 0);

    res.status(200).json({ ok: true, qpd: val });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
