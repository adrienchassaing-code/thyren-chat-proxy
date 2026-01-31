import fs from "fs";
import path from "path";

// ============================================================================
// LECTURE DES FICHIERS
// ============================================================================

const readDataFile = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error("Erreur lecture fichier", filename, e);
    return "";
  }
};

const readJsonFile = (filename) => {
  const raw = readDataFile(filename);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erreur JSON parse", filename, e);
    return null;
  }
};

// ============================================================================
// FORMATAGE DES DONNÉES - COMPLET SANS TRONCATION
// ============================================================================

function formatCompositions(json) {
  if (!json?.capsules) return "";
  const lines = ["=== COMPOSITIONS DES GÉLULES ===\n"];
  
  for (const [key, cap] of Object.entries(json.capsules)) {
    lines.push(`### ${cap.display_name} ###`);
    if (cap.allergen_tags?.length) lines.push(`ALLERGÈNES: ${cap.allergen_tags.join(", ")}`);
    if (cap.contains_iodine) lines.push(`CONTIENT IODE`);
    lines.push(`Enveloppe: ${cap.capsule_shell || "non précisé"}`);
    lines.push(`INGRÉDIENTS:`);
    for (const ing of cap.ingredients || []) {
      let l = `  - ${ing.name}`;
      if (ing.amount_mg) l += `: ${ing.amount_mg} mg`;
      if (ing.amount_mcg) l += `: ${ing.amount_mcg} µg`;
      if (ing.amount) l += `: ${ing.amount} ${ing.unit || ""}`;
      if (ing.notes) l += ` (${ing.notes})`;
      lines.push(l);
    }
    if (cap.origin) lines.push(`ORIGINE: ${cap.origin}`);
    if (cap.benefits_allegations?.length) {
      lines.push(`ALLÉGATIONS SANTÉ:`);
      cap.benefits_allegations.forEach(a => lines.push(`  • ${a}`));
    }
    lines.push("");
  }
  return lines.join("\n");
}

function formatCures(json) {
  if (!json?.cures) return "";
  const lines = ["=== CURES SUPLEMINT ===\n"];
  
  if (json.global_rules) {
    lines.push(`RÈGLES: Durée ${json.global_rules.cure_duration_days}j, Cycle ${json.global_rules.recommended_cycle_months} mois, Max ${json.global_rules.max_simultaneous_cures} cures simultanées\n`);
  }
  
  for (const cure of json.cures) {
    lines.push(`### ${cure.name} (ID:${cure.id}) ###`);
    lines.push(`Description: ${cure.short_description}`);
    if (cure.timing?.when) lines.push(`Quand: ${cure.timing.when}`);
    if (cure.timing?.morning) lines.push(`Matin: ${cure.timing.morning}`);
    if (cure.timing?.evening) lines.push(`Soir: ${cure.timing.evening}`);
    
    lines.push(`COMPOSITION:`);
    for (const item of cure.composition_intake || []) {
      lines.push(`  - ${item.item}: ${item.qty_per_day}/jour${item.time ? ` (${item.time})` : ""}`);
    }
    
    if (cure.recommendation_logic?.length) {
      lines.push(`INDICATIONS: ${cure.recommendation_logic.join(", ")}`);
    }
    
    if (cure.contraindications?.length) {
      lines.push(`CONTRE-INDICATIONS:`);
      cure.contraindications.forEach(ci => lines.push(`  ❌ ${ci}`));
    }
    
    if (cure.links?.product_url) lines.push(`URL: ${cure.links.product_url}`);
    if (cure.variants?.subscription_variant_id) lines.push(`Variant abo: ${cure.variants.subscription_variant_id}`);
    if (cure.variants?.one_time_variant_id) lines.push(`Variant unique: ${cure.variants.one_time_variant_id}`);
    lines.push("");
  }
  return lines.join("\n");
}

function formatSavFaq(json) {
  if (!json?.sections) return "";
  const lines = ["=== FAQ / SAV ===\n"];
  
  for (const section of json.sections) {
    lines.push(`## ${section.title} ##`);
    for (const item of section.items || []) {
      lines.push(`Q: ${item.question}`);
      lines.push(`R: ${item.answer}`);
      if (item.contact) {
        lines.push(`  Email: ${item.contact.email}, Tél: ${item.contact.phone}`);
      }
      if (item.estimated_delays) {
        item.estimated_delays.forEach(d => lines.push(`  ${d.zone}: ${d.delay}`));
      }
      lines.push("");
    }
    if (section.promo_codes) {
      lines.push(`CODES PROMO:`);
      section.promo_codes.forEach(p => lines.push(`  ${p.code}: ${p.offer}`));
    }
  }
  return lines.join("\n");
}

function formatQuiz(json, name) {
  if (!json?.nodes) return "";
  const lines = [`=== ${name} ===\n`];
  lines.push(`Flow: ${(json.flow_order || []).join(" → ")}\n`);
  
  for (const [id, node] of Object.entries(json.nodes)) {
    lines.push(`[${id}] ${node.type}`);
    if (node.text) lines.push(`  Texte: ${node.text}`);
    if (node.choices) lines.push(`  Choix: ${node.choices.join(" | ")}`);
    if (node.next) lines.push(`  Suivant: ${node.next}`);
    if (node.next_map) lines.push(`  Branchement: ${JSON.stringify(node.next_map)}`);
  }
  return lines.join("\n");
}

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

const COMPOSITIONS_JSON = readJsonFile("COMPOSITIONS.json");
const CURES_JSON = readJsonFile("LES_CURES_ALL.json");
const SAV_JSON = readJsonFile("SAV_FAQ.json");
const QUIZ_THYROIDE_JSON = readJsonFile("QUESTION_THYROIDE.json");
const QUIZ_CURE_JSON = readJsonFile("QUESTION_ALL.json");

const DATA_COMPOSITIONS = formatCompositions(COMPOSITIONS_JSON);
const DATA_CURES = formatCures(CURES_JSON);
const DATA_SAV = formatSavFaq(SAV_JSON);
const DATA_QUIZ_THYROIDE = formatQuiz(QUIZ_THYROIDE_JSON, "QUIZ THYROÏDE");
const DATA_QUIZ_CURE = formatQuiz(QUIZ_CURE_JSON, "QUIZ CURE");

console.log("📊 Données chargées:", {
  compositions: DATA_COMPOSITIONS.length,
  cures: DATA_CURES.length,
  sav: DATA_SAV.length,
  quizThyroide: DATA_QUIZ_THYROIDE.length,
  quizCure: DATA_QUIZ_CURE.length
});

// ============================================================================
// SYSTEM PROMPT SIMPLIFIÉ
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, l'assistant de SUPLEMINT, expert en micronutrition et compléments alimentaires.

## TON RÔLE
Répondre aux questions des utilisateurs de façon SIMPLE, DIRECTE et PRÉCISE en utilisant les données SUPLEMINT fournies.

## RÈGLES SIMPLES

1. **Questions sur une composition** → Donne la liste complète des ingrédients avec dosages depuis les données COMPOSITIONS
2. **Questions sur une cure** → Donne la composition (gélules), le timing, les contre-indications depuis les données CURES  
3. **Questions sur les allergènes** → Scanne TOUTES les cures et gélules, liste celles qui contiennent l'allergène
4. **Questions SAV** (livraison, paiement, contact, codes promo) → Réponds depuis les données SAV_FAQ
5. **"Quelle cure pour moi ?"** → Lance le QUIZ CURE (MODE C)
6. **"Ma thyroïde fonctionne-t-elle normalement ?"** → Lance le QUIZ THYROÏDE (MODE A)

## FORMAT DE RÉPONSE JSON OBLIGATOIRE

Tu réponds TOUJOURS en JSON valide :

Pour une réponse simple :
{
  "type": "reponse",
  "text": "Ta réponse ici",
  "meta": { "mode": "B", "progress": { "enabled": false } }
}

Pour une question du quiz :
{
  "type": "question",
  "text": "Ta question ici",
  "choices": ["Choix 1", "Choix 2"],
  "meta": { "mode": "A ou C", "progress": { "enabled": true, "current": X, "total": Y } }
}

Pour les résultats finaux du quiz :
{
  "type": "resultat",
  "text": "Analyse complète avec recommandations de cures"
}

## TON STYLE
- Chaleureux mais professionnel
- Tu vouvoies l'utilisateur
- Pas d'emojis
- Réponses concises et directes
- Tu utilises tes connaissances scientifiques pour enrichir les explications
- Tu ne poses JAMAIS de diagnostic médical
- Si une info n'est pas dans les données, dis-le clairement

## QUIZ MODE A (Thyroïde)
Suis les questions du QUIZ THYROÏDE dans l'ordre. À la fin, recommande les cures adaptées avec leurs compositions et liens.

## QUIZ MODE C (Quelle cure)
Suis les questions du QUIZ CURE dans l'ordre. À la fin, recommande 1 à 3 cures adaptées avec leurs compositions et liens.

## PRÉSENTATION D'UNE CURE
Quand tu recommandes une cure, inclus :
- Nom de la cure
- Composition (liste des gélules par jour)
- Quand la prendre
- Contre-indications
- Lien : [Commander](checkout:VARIANT_ID) ou [En savoir plus](URL)
`;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

function contentToText(content) {
  if (content == null) return "";
  if (typeof content !== "object") return String(content);
  if (typeof content.text === "string") return content.text;
  try { return JSON.stringify(content); } catch { return ""; }
}

function assistantContentToText(content) {
  if (content && typeof content === "object" && content.text) {
    return String(content.text);
  }
  const s = String(content || "").trim();
  try {
    const obj = JSON.parse(s);
    return obj.text ? String(obj.text) : s;
  } catch { return s; }
}

function getBrusselsNow() {
  return new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    weekday: "long", year: "numeric", month: "long", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date());
}

function detectMode(msg, history) {
  const m = String(msg).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (m.includes("thyro") || m.includes("fonctionne-t-elle normalement")) return "A";
  if (m.includes("quelle cure") || m.includes("cure est faite pour moi")) return "C";
  if (m.includes("j'ai une question") || m.includes("sav")) return "B";
  
  // Détecter depuis l'historique
  const h = String(history).toLowerCase();
  if (h.includes("quelle cure est faite pour moi")) return "C";
  if (h.includes("thyroide fonctionne")) return "A";
  
  return "B";
}

function normalizeResponse(obj, mode) {
  if (!obj || typeof obj !== "object" || !obj.type) {
    return {
      type: "reponse",
      text: "Désolé, je n'ai pas compris. Pouvez-vous reformuler ?",
      meta: { mode: mode || "B", progress: { enabled: false } }
    };
  }
  
  if (obj.type !== "resultat") {
    if (!obj.meta) obj.meta = { mode: mode || "B", progress: { enabled: false } };
  }
  
  return obj;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, conversationId } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY missing" });

    // Dernier message utilisateur
    const lastUserMsg = contentToText(
      [...messages].reverse().find(m => m.role === "user")?.content
    ).trim();

    // Historique texte
    const historyText = messages.map(m => contentToText(m.content)).join("\n");

    // Détection du mode
    const activeMode = detectMode(lastUserMsg, historyText);

    // Construction des données selon le mode
    let dataSection = `
${DATA_COMPOSITIONS}

${DATA_CURES}

${DATA_SAV}
`;

    if (activeMode === "A") {
      dataSection += `\n${DATA_QUIZ_THYROIDE}`;
    } else if (activeMode === "C") {
      dataSection += `\n${DATA_QUIZ_CURE}`;
    }

    // Messages pour OpenAI
    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `DATE: ${getBrusselsNow()} | MODE: ${activeMode}` },
      { role: "system", content: `DONNÉES SUPLEMINT:\n${dataSection}` },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? assistantContentToText(m.content) : contentToText(m.content)
      }))
    ];

    console.log(`📤 Mode: ${activeMode} | Tokens estimés: ~${Math.round(dataSection.length / 4)}`);

    // Appel OpenAI
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: openAiMessages,
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 3000
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!oaRes.ok) {
      const err = await oaRes.text();
      console.error("OpenAI error:", err);
      return res.status(500).json({ error: "OpenAI API error", details: err });
    }

    const oaData = await oaRes.json();
    const replyText = oaData?.choices?.[0]?.message?.content || "";

    let reply;
    try {
      reply = JSON.parse(replyText);
    } catch {
      console.error("JSON parse failed:", replyText);
      reply = { type: "reponse", text: "Erreur de parsing. Réessayez." };
    }

    reply = normalizeResponse(reply, activeMode);

    // Nettoyage CTA doublon
    if (reply.text) {
      reply.text = reply.text.replace(/\n?\[Commander ma cure\]\([^)]+\)[\s\S]*$/m, "").trim();
    }

    res.status(200).json({
      reply,
      conversationId: conversationId || null,
      mode: activeMode
    });

  } catch (err) {
    console.error("THYREN error:", err);
    res.status(500).json({ error: "THYREN error", details: String(err) });
  }
}
