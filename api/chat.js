import fs from "fs";
import path from "path";

// ============================================================================
// LECTURE DES 5 FICHIERS DATA
// ============================================================================

const loadJson = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    console.error(`❌ Erreur chargement ${filename}:`, e.message);
    return null;
  }
};

// Charger les 5 DATA
const COMPOSITIONS = loadJson("COMPOSITIONS.json");
const CURES = loadJson("LES_CURES_ALL.json");
const QUIZ_CURE = loadJson("QUESTION_ALL.json");
const QUIZ_THYROIDE = loadJson("QUESTION_THYROIDE.json");
const SAV_FAQ = loadJson("SAV_FAQ.json");

// Log de vérification
console.log("📊 DATA chargées:");
console.log(`  COMPOSITIONS: ${COMPOSITIONS ? Object.keys(COMPOSITIONS.capsules || {}).length + " gélules" : "❌"}`);
console.log(`  CURES: ${CURES ? (CURES.cures || []).length + " cures" : "❌"}`);
console.log(`  QUIZ_CURE: ${QUIZ_CURE ? Object.keys(QUIZ_CURE.nodes || {}).length + " questions" : "❌"}`);
console.log(`  QUIZ_THYROIDE: ${QUIZ_THYROIDE ? Object.keys(QUIZ_THYROIDE.nodes || {}).length + " questions" : "❌"}`);
console.log(`  SAV_FAQ: ${SAV_FAQ ? (SAV_FAQ.sections || []).length + " sections" : "❌"}`);

// ============================================================================
// FORMATER LES DATA EN TEXTE LISIBLE
// ============================================================================

const formatData = (json, type) => {
  if (!json) return `[${type} NON DISPONIBLE]`;
  return JSON.stringify(json, null, 2);
};

const DATA_COMPOSITIONS_TEXT = formatData(COMPOSITIONS, "COMPOSITIONS");
const DATA_CURES_TEXT = formatData(CURES, "CURES");
const DATA_QUIZ_CURE_TEXT = formatData(QUIZ_CURE, "QUIZ_CURE");
const DATA_QUIZ_THYROIDE_TEXT = formatData(QUIZ_THYROIDE, "QUIZ_THYROIDE");
const DATA_SAV_TEXT = formatData(SAV_FAQ, "SAV_FAQ");

// ============================================================================
// PROMPT SIMPLE ET EFFICACE
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, assistant IA de SUPLEMINT. Tu réponds comme ChatGPT mais en utilisant les DATA SUPLEMINT.

═══════════════════════════════════════════════════════════════
RÈGLE D'OR : UTILISE LES DATA POUR RÉPONDRE. NE LES INVENTE PAS.
═══════════════════════════════════════════════════════════════

## LES 3 MODES

**MODE A - Quiz Thyroïde**
Déclencheur : "Ma thyroïde fonctionne-t-elle normalement ?" ou question sur thyroïde
→ Suis EXACTEMENT les questions de [QUIZ_THYROIDE] dans l'ordre du flow
→ À la fin, recommande des cures validées avec [CURES] et [COMPOSITIONS]

**MODE C - Quiz Cure**  
Déclencheur : "Quelle cure est faite pour moi ?" ou question sur choix de cure
→ Suis EXACTEMENT les questions de [QUIZ_CURE] dans l'ordre du flow
→ À la fin, recommande des cures validées avec [CURES] et [COMPOSITIONS]

**MODE B - Questions libres**
Déclencheur : "J'ai une question" ou toute autre question
→ Utilise [COMPOSITIONS], [CURES], [SAV_FAQ] pour répondre

## RÈGLES QUIZ (Mode A et C)

1. Pose les questions EXACTEMENT comme écrites dans les DATA (mot pour mot)
2. Propose les choix EXACTEMENT dans l'ordre des DATA
3. Question type "open" → pas de choices dans le JSON
4. Question type "choices" → inclure choices dans le JSON
5. Suis le branchement (next_map) selon les réponses

## FORMAT JSON OBLIGATOIRE

Réponse simple :
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

Question quiz avec choix :
{"type":"question","text":"QUESTION EXACTE","choices":["choix1","choix2"],"meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

Question quiz ouverte :
{"type":"question","text":"QUESTION EXACTE","meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

Résultats quiz (8 blocs) :
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7===BLOCK===BLOC8"}

## FORMAT RÉSULTATS QUIZ (8 blocs séparés par ===BLOCK===)

BLOC 1: Résumé clinique (2-3 phrases empathie + symptômes)

BLOC 2: Besoins fonctionnels
"Ces pourcentages indiquent le degré de soutien dont ton corps a besoin."
Fonction1 : XX% → explication
Fonction2 : XX% → explication
(5 lignes)

BLOC 3: Cure essentielle (FORMAT CURE ci-dessous)
BLOC 4: Cure de soutien (FORMAT CURE ci-dessous)
BLOC 5: Cure de confort (FORMAT CURE ci-dessous)

BLOC 6: Contre-indications (si allergie mentionnée, sinon "Aucune")

BLOC 7: "Nos nutritionnistes sont disponibles pour un échange gratuit.
[Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"

BLOC 8: "Ce test est un outil de bien-être. Il ne remplace pas un avis médical."

## FORMAT CURE (pour résultats quiz ET questions libres sur une cure)

[URL_IMAGE depuis CURES]

[NOM DE LA CURE]

Comment ça marche :
[2-3 phrases avec **3 ingrédients en gras** et leur action - depuis COMPOSITIONS]

Bénéfices fonctionnels attendus :
[Effets en 2 semaines puis 2-3 mois]

Conseils de prise (posologie) :
– Durée : 3 à 6 mois
– Moment : [depuis CURES timing]
– Composition : [liste gélules/jour depuis CURES]

Contre-indications :
[depuis CURES contraindications]

[Commander](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL)

## STYLE
- Naturel comme ChatGPT
- Tu vouvoies
- Pas d'emojis
- Direct et précis
- Utilise tes connaissances scientifiques pour enrichir les explications
`;

// ============================================================================
// DÉTECTION DU MODE
// ============================================================================

function detectMode(message, history) {
  const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Mode A - Thyroïde
  if (msg.includes("thyroide fonctionne") || msg.includes("thyroïde fonctionne")) return "A";
  if (msg.includes("thyro") && (msg.includes("probleme") || msg.includes("normale") || msg.includes("test"))) return "A";
  
  // Mode C - Quelle cure
  if (msg.includes("quelle cure") || msg.includes("cure est faite pour moi") || msg.includes("cure pour moi")) return "C";
  
  // Vérifier l'historique pour continuer un quiz en cours
  const hist = history.toLowerCase();
  if (hist.includes("quiz thyroide") || hist.includes("mode a")) return "A";
  if (hist.includes("quiz cure") || hist.includes("mode c")) return "C";
  
  // Mode B par défaut
  return "B";
}

function getModeFromHistory(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant" && msg.content?.meta?.mode) {
      return msg.content.meta.mode;
    }
  }
  return null;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export default async function handler(req, res) {
  console.log("✅ HANDLER APPELÉ", {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    hasBody: !!req.body,
  });

  // CORS
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, conversationId } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "API key missing" });

    // Dernier message utilisateur
    const lastUserMsg = messages.filter(m => m.role === "user").pop()?.content || "";
    const userText = typeof lastUserMsg === "object" ? lastUserMsg.text || "" : String(lastUserMsg);

    // Historique texte
    const historyText = messages.map(m => {
      const c = m.content;
      return typeof c === "object" ? c.text || "" : String(c);
    }).join("\n");

    const historyMode = getModeFromHistory(messages);
    const detectedMode = detectMode(userText, historyText);
    const activeMode = historyMode || detectedMode;

    console.log("──────── DEBUG THYREN ────────");
    console.log("MODE ACTIF :", activeMode);
    console.log("USER TEXT :", userText);
    console.log("USER TEXT LENGTH :", userText.length);

    console.log(`🎯 Mode: ${activeMode} | Message: ${userText.substring(0, 50)}...`);

    // Construire les DATA selon le mode
    let dataSection = "";
    
    if (activeMode === "A") {
      // Quiz Thyroïde + données pour validation
      dataSection = `
[QUIZ_THYROIDE]
${DATA_QUIZ_THYROIDE_TEXT}

[CURES]
${DATA_CURES_TEXT}

[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}
`;
    } else if (activeMode === "C") {
      // Quiz Cure + données pour validation
      dataSection = `
[QUIZ_CURE]
${DATA_QUIZ_CURE_TEXT}

[CURES]
${DATA_CURES_TEXT}

[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}
`;
    } else {
      // Questions libres - toutes les données sauf quiz
      dataSection = `
[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}

[CURES]
${DATA_CURES_TEXT}

[SAV_FAQ]
${DATA_SAV_TEXT}
`;
    }
console.log("DATA SECTION LENGTH :", dataSection.length);
console.log("EST. TOKENS :", Math.round(dataSection.length / 4));
console.log("─────────────────────────────");

    // Préparer les messages pour OpenAI
    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `MODE ACTIF: ${activeMode}\n\nDATA SUPLEMINT:\n${dataSection}` },
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === "object" ? (m.content.text || JSON.stringify(m.content)) : String(m.content)
      }))
    ];

    // Appel OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: openaiMessages,
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      return res.status(500).json({ error: "OpenAI error", details: error });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "";

    // Parser la réponse
    let reply;
    try {
      reply = JSON.parse(replyText);
    } catch {
      reply = { type: "reponse", text: replyText, meta: { mode: activeMode, progress: { enabled: false } } };
    }

    // Normaliser
    if (!reply.type) reply.type = "reponse";
    if (reply.type !== "resultat" && !reply.meta) {
      reply.meta = { mode: activeMode, progress: { enabled: false } };
    }

    res.status(200).json({ reply, conversationId, mode: activeMode });

  } catch (err) {
    console.error("THYREN error:", err);
    res.status(500).json({ error: "Server error", details: String(err) });
  }
}
