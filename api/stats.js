import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function ymdUTC() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function handler(req, res) {
  // CORS OK (pour Shopify)
  const origin = req.headers.origin || "";
  const allowed = new Set(["https://www.suplemint.com", "https://suplemint.com"]);
  if (allowed.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const now = Date.now();
  const windowMs = 45_000;
  const cutoff = now - windowMs;

  const onlineKey = "online:thyren";
  const qpdKey = `qpd:thyren:${ymdUTC()}`;

  const p = redis.pipeline();
  p.zremrangebyscore(onlineKey, 0, cutoff); // nettoyage
  p.zcard(onlineKey);                       // count online
  p.get(qpdKey);                            // qpd aujourd'hui
  const out = await p.exec();

  const online = Number(out?.[1] ?? 0);
  const qpd = Number(out?.[2] ?? 0);

  return res.status(200).json({ ok: true, online, qpd, now, windowMs });
}
