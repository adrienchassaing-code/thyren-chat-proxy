import fs from "fs";
import path from "path";

// ============================================================================
// DEBUG MODE - À DÉSACTIVER EN PRODUCTION
// ============================================================================
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) console.log("[THYREN DEBUG]", ...args);
}

// ============================================================================
// LECTURE DES FICHIERS AVEC DEBUG
// ============================================================================

const readDataFile = (filename) => {
  const possiblePaths = [
    path.join(process.cwd(), "data", filename),
    path.join(process.cwd(), filename),
    path.join("/tmp", filename),
    `./${filename}`,
    `./data/${filename}`
  ];
  
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        debugLog(`✅ Fichier trouvé: ${filePath} (${content.length} chars)`);
        return content;
      }
    } catch (e) {
      debugLog(`❌ Erreur lecture ${filePath}:`, e.message);
    }
  }
  
  debugLog(`❌ FICHIER NON TROUVÉ: ${filename}`);
  debugLog(`   Chemins testés:`, possiblePaths);
  return null;
};

const readJsonFile = (filename) => {
  const raw = readDataFile(filename);
  if (!raw) {
    debugLog(`❌ Fichier JSON vide ou non trouvé: ${filename}`);
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    debugLog(`✅ JSON parsé: ${filename}`, Object.keys(parsed));
    return parsed;
  } catch (e) {
    debugLog(`❌ Erreur parse JSON ${filename}:`, e.message);
    return null;
  }
};

// ============================================================================
// CHARGEMENT DES DONNÉES AU DÉMARRAGE
// ============================================================================

debugLog("=== DÉMARRAGE CHARGEMENT DES DONNÉES ===");
debugLog("CWD:", process.cwd());
debugLog("Contenu du dossier courant:", fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()) : "N/A");

const dataDir = path.join(process.cwd(), "data");
debugLog("Dossier data existe:", fs.existsSync(dataDir));
if (fs.existsSync(dataDir)) {
  debugLog("Contenu du dossier data:", fs.readdirSync(dataDir));
}

const COMPOSITIONS_JSON = readJsonFile("COMPOSITIONS.json");
const CURES_JSON = readJsonFile("LES_CURES_ALL.json");
const SAV_JSON = readJsonFile("SAV_FAQ.json");
const QUIZ_THYROIDE_JSON = readJsonFile("QUESTION_THYROIDE.json");
const QUIZ_CURE_JSON = readJsonFile("QUESTION_ALL.json");

debugLog("=== RÉSUMÉ CHARGEMENT ===");
debugLog("COMPOSITIONS:", COMPOSITIONS_JSON ? `${Object.keys(COMPOSITIONS_JSON.capsules || {}).length} gélules` : "❌ NON CHARGÉ");
debugLog("CURES:", CURES_JSON ? `${(CURES_JSON.cures || []).length} cures` : "❌ NON CHARGÉ");
debugLog("SAV:", SAV_JSON ? `${(SAV_JSON.sections || []).length} sections` : "❌ NON CHARGÉ");
debugLog("QUIZ_THYROIDE:", QUIZ_THYROIDE_JSON ? `${Object.keys(QUIZ_THYROIDE_JSON.nodes || {}).length} nodes` : "❌ NON CHARGÉ");
debugLog("QUIZ_CURE:", QUIZ_CURE_JSON ? `${Object.keys(QUIZ_CURE_JSON.nodes || {}).length} nodes` : "❌ NON CHARGÉ");

// ============================================================================
// FORMATAGE DES DONNÉES
// ============================================================================

function formatCompositions(json) {
  if (!json?.capsules) return "⚠️ DONNÉES COMPOSITIONS NON DISPONIBLES";
  
  const lines = ["=== COMPOSITIONS DES GÉLULES SUPLEMINT ===\n"];
  
  for (const [key, cap] of Object.entries(json.capsules)) {
    lines.push(`### ${cap.display_name} (ID: ${key}) ###`);
    lines.push(`Aliases: ${(cap.aliases || [key]).join(", ")}`);
    
    if (cap.allergen_tags?.length) {
      lines.push(`⚠️ ALLERGÈNES: ${cap.allergen_tags.join(", ")}`);
    }
    if (cap.contains_iodine) {
      lines.push(`⚠️ CONTIENT IODE`);
    }
    
    lines.push(`INGRÉDIENTS:`);
    for (const ing of cap.ingredients || []) {
      let l = `  - ${ing.name}`;
      if (ing.amount_mg) l += `: ${ing.amount_mg} mg`;
      else if (ing.amount_mcg) l += `: ${ing.amount_mcg} µg`;
      else if (ing.amount) l += `: ${ing.amount} ${ing.unit || ""}`;
      if (ing.notes) l += ` (${ing.notes})`;
      lines.push(l);
    }
    
    if (cap.benefits_allegations?.length) {
      lines.push(`ALLÉGATIONS SANTÉ:`);
      cap.benefits_allegations.forEach(a => lines.push(`  ✓ ${a}`));
    }
    lines.push("");
  }
  
  return lines.join("\n");
}

function formatCures(json) {
  if (!json?.cures) return "⚠️ DONNÉES CURES NON DISPONIBLES";
  
  const lines = ["=== CURES SUPLEMINT ===\n"];
  
  for (const cure of json.cures) {
    lines.push(`### ${cure.name} (ID: ${cure.id}) ###`);
    lines.push(`Description: ${cure.short_description}`);
    
    lines.push(`COMPOSITION:`);
    for (const item of cure.composition_intake || []) {
      lines.push(`  - ${item.item}: ${item.qty_per_day}/jour${item.time ? ` (${item.time})` : ""}`);
    }
    
    if (cure.timing?.when) lines.push(`Quand: ${cure.timing.when}`);
    
    if (cure.contraindications?.length) {
      lines.push(`CONTRE-INDICATIONS: ${cure.contraindications.join(", ")}`);
    }
    
    if (cure.links?.product_url) lines.push(`URL: ${cure.links.product_url}`);
    if (cure.variants?.subscription_variant_id) lines.push(`Variant abo: ${cure.variants.subscription_variant_id}`);
    lines.push("");
  }
  
  return lines.join("\n");
}

function formatSavFaq(json) {
  if (!json?.sections) return "⚠️ DONNÉES SAV NON DISPONIBLES";
  
  const lines = ["=== FAQ / SAV SUPLEMINT ===\n"];
  
  for (const section of json.sections) {
    lines.push(`## ${section.title} ##`);
    
    for (const item of section.items || []) {
      lines.push(`Q: ${item.question}`);
      lines.push(`R: ${item.answer}`);
      if (item.contact) {
        lines.push(`  Email: ${item.contact.email}, Tél: ${item.contact.phone}`);
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
  if (!json?.nodes) return `⚠️ DONNÉES ${name} NON DISPONIBLES`;
  
  const lines = [
    `=== ${name} ===`,
    "",
    "⚠️ RÈGLES STRICTES:",
    "- Pose chaque question EXACTEMENT comme écrite ci-dessous",
    "- Ne reformule JAMAIS les questions",
    "- Propose les choix EXACTEMENT dans l'ordre indiqué",
    "",
    `ORDRE: ${(json.flow_order || []).join(" → ")}`,
    ""
  ];
  
  const flowOrder = json.flow_order || Object.keys(json.nodes);
  
  for (const nodeId of flowOrder) {
    const node = json.nodes[nodeId];
    if (!node) continue;
    
    lines.push(`--- ${nodeId} (${node.type}) ---`);
    
    if (node.text) {
      lines.push(`QUESTION: "${node.text}"`);
    }
    
    if (node.choices?.length) {
      lines.push(`CHOIX: ${JSON.stringify(node.choices)}`);
    }
    
    if (node.next) {
      lines.push(`SUIVANT: ${node.next}`);
    }
    
    if (node.next_map) {
      lines.push(`BRANCHEMENT:`);
      for (const [answer, next] of Object.entries(node.next_map)) {
        lines.push(`  "${answer}" → ${next}`);
      }
    }
    
    if (node.rules) {
      lines.push(`RÈGLES: ${node.rules.join(" | ")}`);
    }
    
    lines.push("");
  }
  
  return lines.join("\n");
}

// ============================================================================
// DONNÉES FORMATÉES
// ============================================================================

const DATA_COMPOSITIONS = formatCompositions(COMPOSITIONS_JSON);
const DATA_CURES = formatCures(CURES_JSON);
const DATA_SAV = formatSavFaq(SAV_JSON);
const DATA_QUIZ_THYROIDE = formatQuiz(QUIZ_THYROIDE_JSON, "QUIZ THYROÏDE");
const DATA_QUIZ_CURE = formatQuiz(QUIZ_CURE_JSON, "QUIZ CURE");

debugLog("=== DONNÉES FORMATÉES ===");
debugLog("COMPOSITIONS:", DATA_COMPOSITIONS.substring(0, 200) + "...");
debugLog("CURES:", DATA_CURES.substring(0, 200) + "...");
debugLog("SAV:", DATA_SAV.substring(0, 200) + "...");
debugLog("QUIZ_THYROIDE:", DATA_QUIZ_THYROIDE.substring(0, 200) + "...");
debugLog("QUIZ_CURE:", DATA_QUIZ_CURE.substring(0, 200) + "...");

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, l'assistant IA de SUPLEMINT.

## RÈGLE ABSOLUE
Tu as des DONNÉES SUPLEMINT dans ce prompt. UTILISE-LES pour répondre.
Ne dis JAMAIS "je n'ai pas d'information" si les données sont présentes.
CHERCHE dans les données avant de répondre.

## CE QUE TU FAIS

- L'utilisateur demande une composition ? → CHERCHE dans [COMPOSITIONS] et donne la liste EXACTE des ingrédients
- L'utilisateur demande à quoi sert un ingrédient ? → Explique avec tes connaissances + les allégations des données
- L'utilisateur mentionne une allergie ? → SCANNE TOUTES les données et liste les cures/gélules incompatibles
- L'utilisateur pose une question SAV ? → CHERCHE dans [SAV_FAQ] et réponds avec les infos exactes
- L'utilisateur demande une cure spécifique ("parle-moi de...", "c'est quoi la cure...") ? → Utilise FORMAT CURE DIRECT
- L'utilisateur veut savoir quelle cure prendre ? → Lance le quiz CURE (MODE C)
- L'utilisateur s'interroge sur sa thyroïde ? → Lance le quiz THYROÏDE (MODE A)

## LES 3 AMORCES

1. "Ma thyroïde fonctionne-t-elle normalement ?" → MODE A
   Lance le quiz THYROÏDE avec Q1 (prénom)

2. "Quelle cure est faite pour moi ?" → MODE C
   Lance le quiz CURE avec Q1 (prénom)

3. "J'ai une question" → MODE B
   "Bien sûr, je suis là pour vous aider. Que souhaitez-vous savoir ?"

## QUIZ - RÈGLES STRICTES

1. Pose la question EXACTEMENT comme dans les données (mot pour mot)
2. Les choix doivent être EXACTEMENT ceux des données, même ordre
3. Suis le flow: Q1 → Q2 → Q2_plus (si femme) → Q3 → etc.
4. Question ouverte (type: open) = pas de "choices" dans le JSON
5. Question à choix (type: choices) = inclure "choices" dans le JSON

## COMPOSITIONS

Quand on demande "composition de X" ou "c'est quoi X":
1. CHERCHE dans [COMPOSITIONS] par nom ou alias
2. LISTE TOUS les ingrédients avec dosages
3. Mentionne allergènes et allégations santé

## FORMAT JSON

Réponse simple:
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

Question quiz avec choix:
{"type":"question","text":"QUESTION EXACTE","choices":["Choix1","Choix2"],"meta":{"mode":"A ou C","progress":{"enabled":true,"current":1,"total":10}}}

Question quiz ouverte (pas de choices!):
{"type":"question","text":"QUESTION EXACTE","meta":{"mode":"A ou C","progress":{"enabled":true,"current":1,"total":10}}}

Résultats (8 blocs séparés par ===BLOCK===):
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7===BLOCK===BLOC8"}

## FORMAT CURE DIRECT (quand on demande "parle-moi de la cure X", "c'est quoi la cure X")

Structure à utiliser (sans pourcentage de compatibilité) :

[URL_IMAGE depuis les données]

[NOM DE LA CURE]

Comment ça marche :
[2-3 phrases avec **minimum 3 ingrédients en gras** et leur action concrète]

Bénéfices fonctionnels attendus :
[Ce qu'on peut ressentir en 2 semaines, puis en 2-3 mois]

Conseils de prise (posologie) :
– Durée recommandée : 3 à 6 mois.
– Moment de prise : [depuis les données CURES]
– Composition : [liste des gélules/jour depuis les données]

Contre-indications :
[Liste des contre-indications depuis les données]

[Commander](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL_PRODUIT)

## RÉSULTATS DU QUIZ - FORMAT OBLIGATOIRE (8 blocs séparés par ===BLOCK===)

Quand tu termines un quiz, le champ "text" DOIT contenir EXACTEMENT 8 blocs séparés par la ligne ===BLOCK===

**BLOC 1 - Résumé clinique** (2-3 phrases)
Phrase d'empathie + résumé des symptômes + orientation vers la solution

**BLOC 2 - Besoins fonctionnels**
"Ces pourcentages indiquent le degré de soutien dont ton corps a besoin sur chaque fonction.
Plus le pourcentage est élevé, plus le besoin est important."
Puis 5 lignes : Fonction : XX % → explication courte

**BLOC 3 - Cure essentielle** (FORMAT CURE QUIZ ci-dessous)
**BLOC 4 - Cure de soutien** (FORMAT CURE QUIZ ci-dessous)
**BLOC 5 - Cure de confort** (FORMAT CURE QUIZ ci-dessous)

**BLOC 6 - Contre-indications**
Si allergie signalée → mentionner les cures incompatibles. Sinon → "Aucune contre-indication identifiée."

**BLOC 7 - RDV nutritionniste**
"Nos nutritionnistes sont disponibles pour un échange gratuit.
[Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"

**BLOC 8 - Mention légale**
"Ce test est un outil de bien-être. Il ne remplace pas un avis médical."

## FORMAT CURE QUIZ (pour blocs 3, 4, 5 des résultats)

Structure EXACTE pour chaque cure recommandée :

[URL_IMAGE]

[NOM DE LA CURE]

Compatibilité : XX %

Pourquoi cette cure te correspond :
[2-3 phrases avec **minimum 3 ingrédients en gras** et leur action, reliés aux symptômes de l'utilisateur]

Bénéfices fonctionnels attendus :
[Ce qu'il va ressentir en 2 semaines, puis en 2-3 mois. Terminer par "Premiers effets dès le JJ/MM/AAAA si tu commandes aujourd'hui."]

Conseils de prise (posologie) :
– Durée recommandée : 3 à 6 mois.
– Moment de prise : [depuis les données]
– Composition : [liste des gélules/jour depuis les données]

[Commander ma cure](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL_PRODUIT)

## STYLE
- Naturel, tu vouvoies, pas d'emojis
- Direct et précis
- Utilise tes connaissances scientifiques pour enrichir
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
  const mOrig = String(msg).toLowerCase();
  
  // Amorces exactes
  if (mOrig.includes("thyroïde fonctionne") || mOrig.includes("thyroide fonctionne") || m.includes("thyroide fonctionne")) return "A";
  if (mOrig.includes("quelle cure est faite pour moi") || m.includes("quelle cure est faite pour moi")) return "C";
  if (mOrig === "j'ai une question" || m === "j'ai une question") return "B";
  
  // Mots-clés
  if (m.includes("thyro")) return "A";
  if (m.includes("quelle cure") || m.includes("cure pour moi")) return "C";
  
  // Historique
  const h = String(history).toLowerCase();
  if (h.includes("quelle cure est faite pour moi")) return "C";
  if (h.includes("thyroide fonctionne")) return "A";
  
  return "B";
}

function detectModeFromHistory(messages) {
  try {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        const content = messages[i].content;
        if (content?.meta?.mode) return content.meta.mode;
        if (typeof content === "string") {
          try {
            const parsed = JSON.parse(content);
            if (parsed?.meta?.mode) return parsed.meta.mode;
          } catch {}
        }
      }
    }
  } catch {}
  return null;
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
    if (!obj.meta.mode) obj.meta.mode = mode || "B";
    if (!obj.meta.progress) obj.meta.progress = { enabled: false };
  } else {
    delete obj.meta;
    delete obj.choices;
  }
  
  return obj;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export default async function handler(req, res) {
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

    const lastUserMsg = contentToText(
      [...messages].reverse().find(m => m.role === "user")?.content
    ).trim();

    const historyText = messages.map(m => contentToText(m.content)).join("\n");
    const historyMode = detectModeFromHistory(messages);
    const detectedMode = detectMode(lastUserMsg, historyText);
    const activeMode = historyMode || detectedMode;

    debugLog("=== REQUÊTE ===");
    debugLog("Mode détecté:", activeMode);
    debugLog("Message:", lastUserMsg);

    // Construction des données
    let dataSection = `
[COMPOSITIONS]
${DATA_COMPOSITIONS}

[CURES]
${DATA_CURES}

[SAV_FAQ]
${DATA_SAV}
`;

    if (activeMode === "A") {
      dataSection += `\n[QUIZ_THYROIDE]\n${DATA_QUIZ_THYROIDE}`;
    } else if (activeMode === "C") {
      dataSection += `\n[QUIZ_CURE]\n${DATA_QUIZ_CURE}`;
    }

    debugLog("Taille données:", dataSection.length, "chars");

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `DATE: ${getBrusselsNow()} | MODE: ${activeMode}` },
      { role: "system", content: `DONNÉES SUPLEMINT:\n${dataSection}` },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? assistantContentToText(m.content) : contentToText(m.content)
      }))
    ];

    debugLog("Tokens estimés:", Math.round(dataSection.length / 4));

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
        temperature: 0.1,
        max_tokens: 4000
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!oaRes.ok) {
      const err = await oaRes.text();
      debugLog("OpenAI error:", err);
      return res.status(500).json({ error: "OpenAI API error", details: err });
    }

    const oaData = await oaRes.json();
    const replyText = oaData?.choices?.[0]?.message?.content || "";

    debugLog("Réponse brute:", replyText.substring(0, 500));

    let reply;
    try {
      reply = JSON.parse(replyText);
    } catch {
      debugLog("JSON parse failed");
      reply = { type: "reponse", text: "Erreur de parsing. Réessayez." };
    }

    reply = normalizeResponse(reply, activeMode);

    // Ajouter info debug en dev
    if (DEBUG) {
      reply._debug = {
        mode: activeMode,
        dataLoaded: {
          compositions: DATA_COMPOSITIONS.includes("NON DISPONIBLES") ? false : true,
          cures: DATA_CURES.includes("NON DISPONIBLES") ? false : true,
          sav: DATA_SAV.includes("NON DISPONIBLES") ? false : true,
          quizThyroide: DATA_QUIZ_THYROIDE.includes("NON DISPONIBLES") ? false : true,
          quizCure: DATA_QUIZ_CURE.includes("NON DISPONIBLES") ? false : true
        }
      };
    }

    res.status(200).json({
      reply,
      conversationId: conversationId || null,
      mode: activeMode
    });

  } catch (err) {
    debugLog("ERREUR:", err);
    res.status(500).json({ error: "THYREN error", details: String(err) });
  }
}
