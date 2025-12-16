export default async function handler(req, res) {
  const origin = req.headers.origin || "";

  // Autorise ton domaine Shopify (avec et sans www)
  const allowed = new Set([
    "https://www.suplemint.com",
    "https://suplemint.com",
  ]);

  if (allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // IMPORTANT: répondre au preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return res.status(200).json({ ok: true, ts: Date.now(), origin });
}
