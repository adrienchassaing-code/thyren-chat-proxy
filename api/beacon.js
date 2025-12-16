import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const GIF_1x1 = Buffer.from(
  "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

function ymdUTC() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");

  try {
    const type = String(req.query.type || ""); // "online" ou "qpd"
    const sid = String(req.query.sid || "");
    if (!sid) return res.status(200).end(GIF_1x1);

    if (type === "online") {
      const now = Date.now();
      const cutoff = now - 45_000;
      const key = "online:thyren";

      const p = redis.pipeline();
      p.zadd(key, { score: now, member: sid });
      p.zremrangebyscore(key, 0, cutoff);
      await p.exec();
    }

    if (type === "qpd") {
      const dayKey = `qpd:thyren:${ymdUTC()}`;
      const totalKey = "qtotal:thyren";

      const p = redis.pipeline();
      p.incr(dayKey);
      p.incr(totalKey);
      p.expire(dayKey, 60 * 60 * 24 * 180);
      await p.exec();
    }

    return res.status(200).end(GIF_1x1);
  } catch (e) {
    return res.status(200).end(GIF_1x1);
  }
}
