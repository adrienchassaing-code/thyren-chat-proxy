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
    console.log(`✅ ${filename} chargé`);
    return parsed;
  } catch (e) {
    console.error(`❌ ERREUR ${filename}:`, e.message);
    return null;
  }
};

console.log("📦 Chargement des données THYREN...");
const COMPOSITIONS = loadJson("COMPOSITIONS.json");
const CURES = loadJson("LES_CURES_ALL.json");
const QUIZ_CURE = loadJson("QUESTION_ALL.json");
const QUIZ_THYROIDE = loadJson("QUESTION_THYROIDE.json");
const SAV_FAQ = loadJson("SAV_FAQ.json");

const allLoaded = COMPOSITIONS && CURES && QUIZ_CURE && QUIZ_THYROIDE && SAV_FAQ;
if (allLoaded) {
  console.log(`✅ Toutes les données chargées`);
  console.log(`   - ${Object.keys(COMPOSITIONS.capsules).length} compositions`);
  console.log(`   - ${CURES.cures.length} cures`);
} else {
  console.error("⚠️ ATTENTION: Certaines données n'ont pas été chargées!");
}

const formatData = (json) => json ? JSON.stringify(json) : "[NON DISPONIBLE]";

const DATA_COMPOSITIONS_TEXT = formatData(COMPOSITIONS);
const DATA_CURES_TEXT = formatData(CURES);
const DATA_QUIZ_CURE_TEXT = formatData(QUIZ_CURE);
const DATA_QUIZ_THYROIDE_TEXT = formatData(QUIZ_THYROIDE);
const DATA_SAV_TEXT = formatData(SAV_FAQ);

// ============================================================================
// PROMPT SYSTEM RENFORCÉ V2
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, assistant IA de SUPLEMINT. Tu réponds en utilisant UNIQUEMENT les DATA SUPLEMINT fournies.

═══════════════════════════════════════════════════════════════════════════════
                    🔒 RÈGLES ABSOLUES - JAMAIS D'EXCEPTION 🔒
═══════════════════════════════════════════════════════════════════════════════

1. UTILISE UNIQUEMENT LES DATA FOURNIES - Ne jamais inventer
2. VÉRIFIE AVANT CHAQUE RÉPONSE que tu n'oublies rien
3. SUIS LE FLOW EXACT des quiz - Aucune question sautée
4. RESPECTE LE FORMAT JSON - Toujours

═══════════════════════════════════════════════════════════════════════════════
                              LES 3 MODES
═══════════════════════════════════════════════════════════════════════════════

**MODE A - Quiz Thyroïde**
Déclencheur : "Ma thyroïde fonctionne-t-elle normalement ?" ou question sur thyroïde
→ FLOW OBLIGATOIRE : Q1 → Q2 → Q2_plus (si Femme) → Q3 → Q4 → Q4b (si condition) → Q5 → Q6 → Q7 → Q8 → Q9 → Q10 → Q11 → Q12 → Q13 → Q14 → Q15 → Q16 → Q17 (EMAIL OBLIGATOIRE) → RESULT
→ TOTAL : 17 questions minimum (+ Q2_plus et Q4b selon réponses)

**MODE C - Quiz Cure**  
Déclencheur : "Quelle cure est faite pour moi ?" ou question sur choix de cure
→ FLOW OBLIGATOIRE : Q1 → Q2 → Q2_plus (si Femme) → Q3 → Q4 → Q4b (si condition) → Q5 → CLINICAL_QUESTIONS (4-6 questions) → Q_EMAIL (OBLIGATOIRE) → RESULT

**MODE B - Questions libres**
Déclencheur : Toute autre question
→ Utilise [COMPOSITIONS], [CURES], [SAV_FAQ] pour répondre
→ Si on demande la LISTE DES CURES : compte et liste les 21 cures de [CURES]

═══════════════════════════════════════════════════════════════════════════════
                    🚨 RÈGLES QUIZ STRICTES (Mode A et C) 🚨
═══════════════════════════════════════════════════════════════════════════════

AVANT CHAQUE QUESTION, VÉRIFIE :
□ Quelle est la question actuelle dans le flow ?
□ Est-ce que j'ai posé TOUTES les questions précédentes ?
□ Quel est le "next" de cette question ?

RÈGLES IMPÉRATIVES :
1. COPIE-COLLE le texte EXACT de nodes[id].text - pas de reformulation
2. COPIE-COLLE les choices EXACTEMENT dans l'ordre de nodes[id].choices
3. Question type "open" → PAS de choices dans le JSON
4. Question type "choices" → INCLURE choices dans le JSON
5. Suis le branchement next_map selon la réponse utilisateur
6. ⚠️ NE JAMAIS SAUTER Q17/Q_EMAIL - La question email est OBLIGATOIRE avant RESULT
7. ⚠️ NE JAMAIS passer directement aux résultats sans avoir posé TOUTES les questions

═══════════════════════════════════════════════════════════════════════════════
                         FORMAT JSON OBLIGATOIRE
═══════════════════════════════════════════════════════════════════════════════

RÉPONSE SIMPLE (Mode B) :
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

QUESTION QUIZ AVEC CHOIX :
{"type":"question","text":"[TEXTE EXACT de nodes[id].text]","choices":["choix1","choix2"],"meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

QUESTION QUIZ OUVERTE :
{"type":"question","text":"[TEXTE EXACT de nodes[id].text]","meta":{"mode":"A ou C","progress":{"enabled":true,"current":X,"total":Y}}}

RÉSULTATS QUIZ - 8 BLOCS OBLIGATOIRES :
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7===BLOCK===BLOC8"}

═══════════════════════════════════════════════════════════════════════════════
                    📋 LES 8 BLOCS RÉSULTATS (TOUS OBLIGATOIRES)
═══════════════════════════════════════════════════════════════════════════════

BLOC 1 - RÉSUMÉ CLINIQUE :
"[Prénom], merci pour vos réponses. Voici votre analyse personnalisée."
[2-3 phrases empathiques résumant les symptômes identifiés]

BLOC 2 - BESOINS FONCTIONNELS :
"Ces pourcentages indiquent le degré de soutien dont votre corps a besoin :"
• Fonction thyroïdienne : XX%
• Énergie cellulaire : XX%
• Équilibre nerveux : XX%
• Transit digestif : XX%
• Santé peau/cheveux : XX%

BLOC 3 - CURE ESSENTIELLE :
[FORMAT CURE COMPLET avec tous les détails]

BLOC 4 - CURE DE SOUTIEN :
[FORMAT CURE COMPLET avec tous les détails]

BLOC 5 - CURE DE CONFORT :
[FORMAT CURE COMPLET ou "Aucune cure complémentaire nécessaire."]

BLOC 6 - CONTRE-INDICATIONS :
[Lister selon les réponses ou "Aucune contre-indication identifiée."]

BLOC 7 - RENDEZ-VOUS :
"Nos nutritionnistes sont disponibles pour un échange gratuit.
[Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"

BLOC 8 - DISCLAIMER :
"Ce test est un outil de bien-être. Il ne remplace pas un avis médical."

═══════════════════════════════════════════════════════════════════════════════
                         📦 FORMAT CURE COMPLET
═══════════════════════════════════════════════════════════════════════════════

**[NOM DE LA CURE]**
*[short_description depuis CURES]*

**Comment ça marche :**
Cette cure associe **[ingrédient 1]**, **[ingrédient 2]** et **[ingrédient 3]** pour [action]. [Extraire les ingrédients clés depuis COMPOSITIONS pour les items de cette cure]

**Bénéfices attendus :**
• Dès 2 semaines : [premiers effets]
• Après 2-3 mois : [effets durables]

**Conseils de prise :**
– Durée : 3 à 6 mois
– Moment : [timing.when depuis CURES]
– Composition : [Lister TOUS les items avec quantité/jour]

**Contre-indications :**
[Lister TOUTES les contraindications depuis CURES]

[Commander]([product_url]) | [En savoir plus]([product_url])

═══════════════════════════════════════════════════════════════════════════════
                    🔍 CHECKLIST AVANT CHAQUE ENVOI
═══════════════════════════════════════════════════════════════════════════════

QUIZ Mode A/C - Vérifier :
□ Question = texte EXACT des DATA ?
□ Choices = ordre EXACT des DATA ?
□ current/total corrects ?
□ Pas de question sautée ?
□ Q17/Q_EMAIL posée avant RESULT ?

RÉSULTATS - Vérifier :
□ 8 blocs avec ===BLOCK=== ?
□ Cures existent dans [CURES] ?
□ Ingrédients existent dans [COMPOSITIONS] ?
□ Contre-indications complètes ?

MODE B - Vérifier :
□ Liste des cures = 21 cures (compter dans [CURES]) ?
□ Info cure = vérifiée dans [CURES] ?
□ Info ingrédient = vérifiée dans [COMPOSITIONS] ?
□ Info SAV = vérifiée dans [SAV_FAQ] ?

═══════════════════════════════════════════════════════════════════════════════
                    ⚠️ ERREURS INTERDITES ⚠️
═══════════════════════════════════════════════════════════════════════════════

❌ Sauter la question email (Q17/Q_EMAIL)
❌ Inventer une cure qui n'existe pas
❌ Inventer un ingrédient qui n'existe pas  
❌ Oublier des cures quand on demande la liste (il y en a 21)
❌ Modifier le texte des questions
❌ Changer l'ordre des choices
❌ Envoyer résultats sans les 8 blocs
❌ Oublier des contre-indications

═══════════════════════════════════════════════════════════════════════════════
                              STYLE
═══════════════════════════════════════════════════════════════════════════════

- Professionnel et bienveillant
- Vouvoiement TOUJOURS
- Pas d'emojis
- Direct et précis
`;

// ============================================================================
// DÉTECTION DU MODE
// ============================================================================

function detectMode(message, history) {
  const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (msg.includes("thyroide fonctionne") || msg.includes("thyroïde fonctionne")) return "A";
  if (msg.includes("thyro") && (msg.includes("probleme") || msg.includes("normale") || msg.includes("test"))) return "A";
  if (msg.includes("quelle cure") || msg.includes("cure est faite pour moi") || msg.includes("cure pour moi")) return "C";

  const hist = String(history || "").toLowerCase();
  if (hist.includes("quiz thyroide") || hist.includes("mode a")) return "A";
  if (hist.includes("quiz cure") || hist.includes("mode c")) return "C";

  return "B";
}

function getModeFromHistory(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      try {
        const content = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
        if (content?.meta?.mode) return content.meta.mode;
      } catch {}
    }
  }
  return null;
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
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "API key missing" });

    if (!allLoaded) {
      return res.status(500).json({ error: "Data files not loaded" });
    }

    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
    const userText = typeof lastUserMsg === "object" ? lastUserMsg.text || "" : String(lastUserMsg);
    const historyText = messages.map((m) => typeof m.content === "object" ? m.content.text || "" : String(m.content)).join("\\n");

    const historyMode = getModeFromHistory(messages);
    const detectedMode = detectMode(userText, historyText);
    const activeMode = historyMode || detectedMode;

    console.log(`🎯 Mode: ${activeMode}`);

    // Construire les DATA selon le mode
    let dataSection = "";
    if (activeMode === "A") {
      dataSection = `
[QUIZ_THYROIDE] - SUIVRE CE FLOW EXACTEMENT, QUESTION PAR QUESTION :
${DATA_QUIZ_THYROIDE_TEXT}

[CURES] - 21 cures disponibles :
${DATA_CURES_TEXT}

[COMPOSITIONS] - Ingrédients des gélules :
${DATA_COMPOSITIONS_TEXT}
`;
    } else if (activeMode === "C") {
      dataSection = `
[QUIZ_CURE] - SUIVRE CE FLOW EXACTEMENT :
${DATA_QUIZ_CURE_TEXT}

[CURES] - 21 cures disponibles :
${DATA_CURES_TEXT}

[COMPOSITIONS] - Ingrédients des gélules :
${DATA_COMPOSITIONS_TEXT}
`;
    } else {
      dataSection = `
[CURES] - LISTE COMPLÈTE DES 21 CURES :
${DATA_CURES_TEXT}

[COMPOSITIONS] - 45 gélules/capsules :
${DATA_COMPOSITIONS_TEXT}

[SAV_FAQ] - Questions fréquentes :
${DATA_SAV_TEXT}
`;
    }

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `MODE ACTIF: ${activeMode}\\n\\nDATA SUPLEMINT:\\n${dataSection}` },
      ...messages.map((m) => ({
        role: m.role,
        content: typeof m.content === "object" ? (m.content.text || JSON.stringify(m.content)) : String(m.content),
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: openaiMessages,
        response_format: { type: "json_object" },
        temperature: 0.1, // Plus bas = plus déterministe
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

    let reply;
    try {
      reply = JSON.parse(replyText);
    } catch {
      reply = { type: "reponse", text: replyText, meta: { mode: activeMode, progress: { enabled: false } } };
    }

    if (!reply.type) reply.type = "reponse";
    if (!reply.meta) reply.meta = { mode: activeMode, progress: { enabled: false } };

    return res.status(200).json({ reply, conversationId: conversationId || null, mode: activeMode });
  } catch (err) {
    console.error("❌ THYREN error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
