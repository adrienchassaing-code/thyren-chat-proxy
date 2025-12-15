export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({
        ok: false,
        error: "Upstash env missing",
        hasUrl: !!url,
        hasToken: !!token,
      });
    }

    const key = `chat:test:${new Date().toISOString().slice(0, 10)}`;
    const endpoint = `${url.replace(/\/$/, "")}/incr/${encodeURIComponent(key)}`;

    const r = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await r.text();
    return res.status(200).json({
      ok: r.ok,
      status: r.status,
      endpoint,      // pour vérifier que l’URL est correcte (sans montrer le token)
      raw: text,     // réponse Upstash
      key,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
