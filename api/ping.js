export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return res.status(500).json({ ok: false, error: "Upstash env missing" });

    const base = url.replace(/\/$/, "");

    // id visiteur : query ?cid=...
    const cid = (req.query?.cid && String(req.query.cid)) || "anon";
    const key = `online:${cid}`;

    const r = await fetch(`${base}/set/${encodeURIComponent(key)}/1?ex=60`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = await r.text();
    if (!r.ok) return res.status(500).json({ ok: false, status: r.status, raw });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
