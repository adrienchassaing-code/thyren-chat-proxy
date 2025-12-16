function setCors(req, res) {
  const origin = req.headers.origin || "*";

  // Autorise ton site + preview + autres (safe)
  const allowed = [
    "https://www.suplemint.com",
    "https://suplemint.com",
  ];

  // Si c'est ton domaine => on renvoie le vrai origin
  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // fallback pour tests / dev (tu peux aussi mettre "https://www.suplemint.com" à la place)
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

// api/qpd.js
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    // renvoie { ok:true, qpd: <number> } comme tu as déjà
    // --- START: ton code existant ---
    // --- END: ton code existant ---
  } catch (e) {
    return res.status(500).json({ ok: false, error: "qpd error" });
  }
};
