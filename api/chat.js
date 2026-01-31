import fs from "fs";
import path from "path";

// =====================
// LOAD JSON ONCE
// =====================
function loadJson(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

const COMPOSITIONS = loadJson("COMPOSITIONS.json");
const CURES = loadJson("LES_CURES_ALL.json");
const QUIZ_CURE = loadJson("QUESTION_ALL.json");
const QUIZ_THYROIDE = loadJson("QUESTION_THYROIDE.json");
const SAV_FAQ = loadJson("SAV_FAQ.json");

// =====================
// HELPERS
// =====================
function getLastUserText(messages) {
  const lastUser = [...(messages || [])].reverse().find(m => m.role === "user");
  const c = lastUser?.content ?? "";
  return typeof c === "object" ? (c.text || "") : String(c);
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Trouve une capsule par key / display_name / alias
function findCapsule(query) {
  const q = normalize(query);
  const caps = COMPOSITIONS?.capsules || {};

  // 1) match direct sur clé
  for (const k of Object.keys(caps)) {
    if (normalize(k) === q) return { key: k, capsule: caps[k] };
  }

  // 2) match sur display_name / aliases
  for (const [k, v] of Object.entries(caps)) {
    const dn = normalize(v?.display_name || "");
    const als = Array.isArray(v?.aliases) ? v.aliases.map(normalize) : [];
    if (dn === q || als.includes(q)) return { key: k, capsule: v };
  }

  // 3) match partiel (“omega 3” doit matcher “omega-3” etc.)
  for (const [k, v] of Object.entries(caps)) {
    const dn = normalize(v?.display_name || "");
    const als = Array.isArray(v?.aliases) ? v.aliases.map(normalize) : [];
    if (dn.includes(q) || als.some(a => a.includes(q)) || normalize(k).includes(q)) {
      return { key: k, capsule: v };
    }
  }

  return null;
}

function formatCapsule(c) {
  const cap = c.capsule;
  const lines = [];
  lines.push(`Composition de ${cap.display_name || c.key} :`);

  for (const ing of (cap.ingredients || [])) {
    let amount = "";
    if (ing.amount_mg) amount = `${ing.amount_mg} mg`;
    else if (ing.amount_mcg) amount = `${ing.amount_mcg} µg`;
    else if (ing.amount) amount = `${ing.amount} ${ing.unit || ""}`.trim();
    lines.push(`- ${ing.name}${amount ? ` : ${amount}` : ""}`);
  }

  if (cap.allergen_tags?.length) lines.push(`Allergènes : ${cap.allergen_tags.join(", ")}`);
  else lines.push(`Allergènes : Aucun`);

  if (cap.contains_iodine) lines.push(`Contient de l’iode : Oui`);
  return lines.join("\n");
}

// Trouve une cure par nom (match simple)
function findCure(query) {
  const q = normalize(query);
  const list = CURES?.cures || [];
  for (const cure of list) {
    const name = normalize(cure?.name || "");
    if (name === q || name.includes(q) || q.includes(name)) return cure;
  }
  return null;
}

function formatCure(cure) {
  const lines = [];
  lines.push(cure.links?.image_url ? cure.links.image_url : "");
  lines.push("");
  lines.push(cure.name);
  lines.push("");
  lines.push("Conseils de prise (posologie) :");
  lines.push("– Durée : 3 à 6 mois");
  if (cure.timing?.when) lines.push(`– Moment : ${cure.timing.when}`);
  lines.push("– Composition :");
  for (const item of (cure.composition_intake || [])) {
    lines.push(`  • ${item.item}: ${item.qty_per_day} / jour${item.time ? ` (${item.time})` : ""}`);
  }
  lines.push("");
  lines.push("Contre-indications :");
  if (cure.contraindications?.length) {
    cure.contraindications.forEach(ci => lines.push(`- ${ci}`));
  } else {
    lines.push("Aucune");
  }
  lines.push("");
  const vid = cure.variants?.one_time_variant_id || cure.variants?.subscription_variant_id || "";
  const url = cure.links?.product_url || "";
  lines.push(`[Commander](checkout:${vid}) [Ajouter au panier](addtocart:${vid}) [En savoir plus](${url})`);
  return lines.join("\n").trim();
}

// Détection simple
function detectMode(userText) {
  const t = normalize(userText);
  if (t.includes("ma thyroide fonctionne")) return "A";
  if (t.includes("quelle cure est faite pour moi")) return "C";
  if (t === "j'ai une question") return "B";
  // questions libres thyroide
  if (t.includes("thyro")) return "A";
  // demande cure
  if (t.includes("quelle cure") || t.includes("cure pour moi")) return "C";
  return "B";
}

// =====================
// HANDLER
// =====================
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, conversationId } = req.body || {};
    const userText = getLastUserText(messages);

    const mode = detectMode(userText);

    // ✅ CAS 1 : QUESTIONS LIBRES -> on répond DIRECTEMENT depuis JSON
    // (plus besoin de GPT pour “composition”, “posologie”, “SAV”)
    const t = normalize(userText);

    // Composition
    const mComp = t.match(/composition\s+de\s+(.+)$/i) || t.match(/qu.*y a.*dans\s+(.+)$/i);
    if (mComp) {
      const name = mComp[1];
      const found = findCapsule(name);
      if (!found) {
        const keys = Object.keys(COMPOSITIONS?.capsules || {}).slice(0, 30).join(", ");
        return res.status(200).json({
          reply: {
            type: "reponse",
            text: `Je ne trouve pas "${name}" dans COMPOSITIONS.\nExemples de clés: ${keys}`,
            meta: { mode: "B", progress: { enabled: false } },
          },
          conversationId: conversationId || null,
          mode,
        });
      }
      return res.status(200).json({
        reply: {
          type: "reponse",
          text: formatCapsule(found),
          meta: { mode: "B", progress: { enabled: false } },
        },
        conversationId: conversationId || null,
        mode,
      });
    }

    // Demande de cure spécifique
    const mCure = t.match(/cure\s+(.+)$/i);
    if (mCure && mode === "B") {
      const q = mCure[1];
      const cure = findCure(q);
      if (cure) {
        return res.status(200).json({
          reply: {
            type: "reponse",
            text: formatCure(cure),
            meta: { mode: "B", progress: { enabled: false } },
          },
          conversationId: conversationId || null,
          mode,
        });
      }
    }

    // ✅ CAS 2 : Quiz A ou C -> (pour l’instant) on renvoie juste Q1
    // (tu pourras brancher le flow après, mais déjà ça prouve que le JSON est bien lu)
    if (mode === "A") {
      const q1 = QUIZ_THYROIDE?.nodes?.[QUIZ_THYROIDE?.flow_order?.[0] || "Q1"];
      return res.status(200).json({
        reply: {
          type: "question",
          text: q1?.text || "Q1 introuvable dans QUESTION_THYROIDE.json",
          meta: { mode: "A", progress: { enabled: true, current: 1, total: (QUIZ_THYROIDE?.flow_order || []).length || 1 } },
        },
        conversationId: conversationId || null,
        mode,
      });
    }

    if (mode === "C") {
      const q1 = QUIZ_CURE?.nodes?.[QUIZ_CURE?.flow_order?.[0] || "Q1"];
      return res.status(200).json({
        reply: {
          type: "question",
          text: q1?.text || "Q1 introuvable dans QUESTION_ALL.json",
          meta: { mode: "C", progress: { enabled: true, current: 1, total: (QUIZ_CURE?.flow_order || []).length || 1 } },
        },
        conversationId: conversationId || null,
        mode,
      });
    }

    // Default : SAV (simple exemple)
    return res.status(200).json({
      reply: {
        type: "reponse",
        text: "OK. Posez votre question (composition / cure / livraison / etc.).",
        meta: { mode: "B", progress: { enabled: false } },
      },
      conversationId: conversationId || null,
      mode,
    });

  } catch (err) {
    console.error("THYREN error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
