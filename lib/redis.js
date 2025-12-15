async function redisIncr(key) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) throw new Error("Upstash env missing");

  const res = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash INCR failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data?.result; // valeur du compteur après incr
}

module.exports = { redisIncr };
