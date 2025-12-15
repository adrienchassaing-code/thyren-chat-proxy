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

    const keysRes = await fetch(`${base}/keys/${encodeURIComponent("online:*")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = await keysRes.text();
    if (!keysRes.ok) {
      res.status(500).json({ ok: false, status: keysRes.status, raw });
      return;
    }

    const j = JSON.parse(raw);
    const keys = Array.isArray(j?.result) ? j.result : [];

    res.status(200).json({
      ok: true,
      online: keys.length,
      keysSample: keys.slice(0, 5),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
