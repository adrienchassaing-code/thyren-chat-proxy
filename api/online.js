res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  res.status(204).end();
  return;
}

export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      return res.status(500).json({ ok: false, error: "Upstash env missing" });
    }

    const base = url.replace(/\/$/, "");

    // 1) récupérer les clés online:*
    const keysRes = await fetch(`${base}/keys/${encodeURIComponent("online:*")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const keysText = await keysRes.text();

    if (!keysRes.ok) {
      return res.status(500).json({ ok: false, status: keysRes.status, raw: keysText });
    }

    const keysJson = JSON.parse(keysText);
    const keys = keysJson?.result || [];
    return res.status(200).json({
      ok: true,
      online: keys.length,
      keysSample: keys.slice(0, 5), // juste pour debug
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
