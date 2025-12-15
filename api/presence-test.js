export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      return res.status(500).json({ ok: false, error: "Upstash env missing" });
    }

    const base = url.replace(/\/$/, "");
    const key = "online:__test__";

    // 1) SET EX 60
    const setRes = await fetch(
      `${base}/set/${encodeURIComponent(key)}/1?ex=60`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const setRaw = await setRes.text();

    // 2) GET (pour confirmer)
    const getRes = await fetch(
      `${base}/get/${encodeURIComponent(key)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const getRaw = await getRes.text();

    return res.status(200).json({
      ok: true,
      setStatus: setRes.status,
      setRaw,
      getStatus: getRes.status,
      getRaw,
      key,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
