// api/ping.js
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    // ton ping actuel (set TTL) + renvoie ok:true
    // --- START: ton code existant ---
    // --- END: ton code existant ---
  } catch (e) {
    return res.status(500).json({ ok: false, error: "ping error" });
  }
};
