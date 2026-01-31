import fs from "fs";
import path from "path";

// ============================================================================
// LECTURE DES 5 FICHIERS DATA AVEC VALIDATION
// ============================================================================

const loadJson = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(content);
    
    // Vérification que le parsing a réussi
    const keys = Object.keys(parsed);
    console.log(`✅ ${filename} chargé - ${keys.length} clés principales`);
    return parsed;
  } catch (e) {
    console.error(`❌ ERREUR ${filename}:`, e.message);
    console.error(`   → Vérifiez la syntaxe JSON (virgules, accolades)`);
    return null;
  }
};

// Charger les 5 DATA
console.log("📦 Chargement des données...");
const COMPOSITIONS = loadJson("COMPOSITIONS.json");
const CURES = loadJson("LES_CURES_ALL.json");
const QUIZ_CURE = loadJson("QUESTION_ALL.json");
const QUIZ_THYROIDE = loadJson("QUESTION_THYROIDE.json");
const SAV_FAQ = loadJson("SAV_FAQ.json");

// Vérifier que tout est chargé
const allLoaded = COMPOSITIONS && CURES && QUIZ_CURE && QUIZ_THYROIDE && SAV_FAQ;
if (!allLoaded) {
  console.error("⚠️  ATTENTION: Certaines données n'ont pas été chargées!");
}

// ============================================================================
// FORMATER LES DATA EN TEXTE COMPACT (économie de tokens)
// ============================================================================

const formatData = (json, type) => {
  if (!json) return `[${type} NON DISPONIBLE - ERREUR DE CHARGEMENT]`;
  return JSON.stringify(json); // Compact, sans espaces
};

const DATA_COMPOSITIONS_TEXT = formatData(COMPOSITIONS, "COMPOSITIONS");
const DATA_CURES_TEXT = formatData(CURES, "CURES");
const DATA_QUIZ_CURE_TEXT = formatData(QUIZ_CURE, "QUIZ_CURE");
const DATA_QUIZ_THYROIDE_TEXT = formatData(QUIZ_THYROIDE, "QUIZ_THYROIDE");
const DATA_SAV_TEXT = formatData(SAV_FAQ, "SAV_FAQ");

// DEBUG: Afficher la taille des données
console.log("📊 Taille des données:");
console.log(`   COMPOSITIONS: ${Math.round(DATA_COMPOSITIONS_TEXT.length / 1000)}KB`);
console.log(`   CURES: ${Math.round(DATA_CURES_TEXT.length / 1000)}KB`);
console.log(`   QUIZ_CURE: ${Math.round(DATA_QUIZ_CURE_TEXT.length / 1000)}KB`);
console.log(`   QUIZ_THYROIDE: ${Math.round(DATA_QUIZ_THYROIDE_TEXT.length / 1000)}KB`);
console.log(`   SAV_FAQ: ${Math.round(DATA_SAV_TEXT.length / 1000)}KB`);

// ============================================================================
// PROMPT SYSTEM
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, assistant IA de SUPLEMINT. Tu réponds en utilisant UNIQUEMENT les DATA SUPLEMINT fournies.

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
3. Question type "open" → pas de choices dans le JSON de réponse
4. Question type "choices" → inclure choices dans le JSON de réponse
5. Suis le branchement (next_map) selon les réponses

## FORMAT JSON OBLIGATOIRE (toujours répondre en JSON)

Réponse simple :
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

Question quiz avec choix :
{"type":"question","text":"QUESTION EXACTE DES DATA","choices":["choix1","choix2"],"meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

Question quiz ouverte :
{"type":"question","text":"QUESTION EXACTE DES DATA","meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

Résultats quiz (8 blocs) :
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7===BLOCK===BLOC8"}

## FORMAT CURE (pour résultats et questions sur une cure)

[URL_IMAGE depuis CURES]
[NOM DE LA CURE]

Comment ça marche :
[2-3 phrases avec **3 ingrédients en gras** depuis COMPOSITIONS]

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
- Naturel et professionnel
- Tu vouvoies
- Pas d'emojis
- Direct et précis
`;

// ============================================================================
// DÉTECTION DU MODE
// ============================================================================

function detectMode(message, history) {
  const msg = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Mode A - Thyroïde
  if (msg.includes("thyroide fonctionne") || msg.includes("thyroïde fonctionne")) return "A";
  if (msg.includes("thyro") && (msg.includes("probleme") || msg.includes("normale") || msg.includes("test"))) return "A";

  // Mode C - Quelle cure
  if (msg.includes("quelle cure") || msg.includes("cure est faite pour moi") || msg.includes("cure pour moi")) return "C";

  // Vérifier l'historique pour continuer un quiz en cours
  const hist = String(history || "").toLowerCase();
  if (hist.includes("quiz thyroide") || hist.includes("mode a")) return "A";
  if (hist.includes("quiz cure") || hist.includes("mode c")) return "C";

  // Mode B par défaut
  return "B";
}

function getModeFromHistory(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      try {
        const content = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
        if (content?.meta?.mode) {
          return content.meta.mode;
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
  }
  return null;
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
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "API key missing" });

    // Vérifier que les données sont chargées
    if (!allLoaded) {
      console.error("❌ Données non chargées - vérifier les fichiers JSON");
      return res.status(500).json({ error: "Data files not loaded - check JSON syntax" });
    }

    // Dernier message utilisateur
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
    const userText = typeof lastUserMsg === "object" ? lastUserMsg.text || "" : String(lastUserMsg);

    // Historique texte
    const historyText = messages
      .map((m) => {
        const c = m.content;
        return typeof c === "object" ? c.text || "" : String(c);
      })
      .join("\n");

    // Détecter le mode (priorité: historique > détection)
    const historyMode = getModeFromHistory(messages);
    const detectedMode = detectMode(userText, historyText);
    const activeMode = historyMode || detectedMode;

    console.log(`🎯 Mode: ${activeMode} (historique: ${historyMode}, détecté: ${detectedMode})`);

    // Construire les DATA selon le mode
    let dataSection = "";

    if (activeMode === "A") {
      dataSection = `
[QUIZ_THYROIDE]
${DATA_QUIZ_THYROIDE_TEXT}

[CURES]
${DATA_CURES_TEXT}

[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}
`;
    } else if (activeMode === "C") {
      dataSection = `
[QUIZ_CURE]
${DATA_QUIZ_CURE_TEXT}

[CURES]
${DATA_CURES_TEXT}

[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}
`;
    } else {
      dataSection = `
[COMPOSITIONS]
${DATA_COMPOSITIONS_TEXT}

[CURES]
${DATA_CURES_TEXT}

[SAV_FAQ]
${DATA_SAV_TEXT}
`;
    }

    // DEBUG: Taille totale
    const totalSize = SYSTEM_PROMPT.length + dataSection.length;
    console.log(`📦 Contexte total: ${Math.round(totalSize / 1000)}KB (~${Math.round(totalSize / 4)} tokens)`);

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `MODE ACTIF: ${activeMode}\n\nDATA SUPLEMINT:\n${dataSection}` },
      ...messages.map((m) => ({
        role: m.role,
        content: typeof m.content === "object" ? (m.content.text || JSON.stringify(m.content)) : String(m.content),
      })),
    ];

    // ⚠️ MODÈLE CORRIGÉ: gpt-4o-mini (PAS gpt-4.1-mini qui n'existe pas!)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",  // ✅ MODÈLE CORRECT
        messages: openaiMessages,
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ OpenAI error:", error);
      return res.status(500).json({ error: "OpenAI error", details: error });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "";
    
    console.log(`✅ Réponse reçue (${replyText.length} chars)`);

    let reply;
    try {
      reply = JSON.parse(replyText);
    } catch (parseError) {
      console.error("❌ Erreur parsing JSON réponse:", parseError.message);
      reply = { type: "reponse", text: replyText, meta: { mode: activeMode, progress: { enabled: false } } };
    }

    if (!reply.type) reply.type = "reponse";
    if (reply.type !== "resultat" && !reply.meta) {
      reply.meta = { mode: activeMode, progress: { enabled: false } };
    }

    return res.status(200).json({ reply, conversationId: conversationId || null, mode: activeMode });
  } catch (err) {
    console.error("❌ THYREN error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
