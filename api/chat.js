import fs from "fs";
import path from "path";

// ============================================================================
// LECTURE DES 5 FICHIERS DATA
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
}

const formatData = (json) => json ? JSON.stringify(json) : "[NON DISPONIBLE]";

const DATA_COMPOSITIONS_TEXT = formatData(COMPOSITIONS);
const DATA_CURES_TEXT = formatData(CURES);
const DATA_QUIZ_CURE_TEXT = formatData(QUIZ_CURE);
const DATA_QUIZ_THYROIDE_TEXT = formatData(QUIZ_THYROIDE);
const DATA_SAV_TEXT = formatData(SAV_FAQ);

// ============================================================================
// PROMPT SYSTEM V2.1 - AVEC MÉMORISATION ET FORMAT AMÉLIORÉ
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, assistant IA de SUPLEMINT.

═══════════════════════════════════════════════════════════════════════════════
                         🔒 RÈGLES ABSOLUES 🔒
═══════════════════════════════════════════════════════════════════════════════

1. NE JAMAIS AFFIRMER SANS VÉRIFIER - Chaque fait doit être dans les DATA
2. APPLIQUER LES 3 ÉTAPES DE CONTRÔLE avant chaque réponse
3. EN CAS DE DOUTE → Chercher dans les DATA, pas deviner
4. SI INFO NON TROUVÉE → Dire "je n'ai pas cette information"
5. SUIS LE FLOW EXACT des quiz
6. RESPECTE LE FORMAT JSON

═══════════════════════════════════════════════════════════════════════════════
                    💾 MÉMORISATION UTILISATEUR (NOUVEAU)
═══════════════════════════════════════════════════════════════════════════════

ANALYSE L'HISTORIQUE DE CONVERSATION pour extraire les infos déjà connues :
- Prénom
- Sexe biologique  
- Grossesse/allaitement (si femme)
- Tranche d'âge
- Allergies/conditions médicales
- Email

SI UNE INFO EST DÉJÀ DANS L'HISTORIQUE → NE PAS REPOSER LA QUESTION
→ Passe directement à la question suivante du flow
→ Mentionne "J'ai bien noté que vous êtes [prénom], [âge], etc."

Exemple : Si l'utilisateur a déjà fait le quiz thyroïde et commence le quiz cure :
- Tu connais déjà son prénom → saute Q1
- Tu connais son sexe → saute Q2/Q2_plus
- Tu connais son âge → saute Q3
- Tu connais ses conditions → saute Q4/Q4b
- Tu connais son email → saute Q_EMAIL
→ Commence directement par Q5 (plainte client)

═══════════════════════════════════════════════════════════════════════════════
                              LES 3 MODES
═══════════════════════════════════════════════════════════════════════════════

**MODE A - Quiz Thyroïde**
Déclencheur : "Ma thyroïde fonctionne-t-elle normalement ?"
→ Flow : Q1 → Q2 → Q2_plus → Q3 → Q4 → Q4b → Q5 → ... → Q17 → RESULT
→ SAUTER les questions dont tu as déjà la réponse

**MODE C - Quiz Cure**  
Déclencheur : "Quelle cure est faite pour moi ?"
→ Flow : Q1 → Q2 → Q2_plus → Q3 → Q4 → Q4b → Q5 → CLINICAL → Q_EMAIL → RESULT
→ SAUTER les questions dont tu as déjà la réponse

**MODE B - Questions libres**
→ Utilise [COMPOSITIONS], [CURES], [SAV_FAQ]

═══════════════════════════════════════════════════════════════════════════════
                    🚨 RÈGLES QUIZ STRICTES 🚨
═══════════════════════════════════════════════════════════════════════════════

1. COPIE-COLLE le texte EXACT de nodes[id].text
2. COPIE-COLLE les choices dans l'ordre EXACT
3. Question "open" → PAS de choices
4. Question "choices" → INCLURE choices
5. ⚠️ Q17/Q_EMAIL OBLIGATOIRE (sauf si email déjà connu)

═══════════════════════════════════════════════════════════════════════════════
                         FORMAT JSON OBLIGATOIRE
═══════════════════════════════════════════════════════════════════════════════

RÉPONSE SIMPLE :
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

QUESTION QUIZ AVEC CHOIX :
{"type":"question","text":"[TEXTE EXACT]","choices":["..."],"meta":{"mode":"A","progress":{"enabled":true,"current":X,"total":Y}}}

QUESTION QUIZ OUVERTE :
{"type":"question","text":"[TEXTE EXACT]","meta":{"mode":"A","progress":{"enabled":true,"current":X,"total":Y}}}

RÉSULTATS QUIZ - 7 BLOCS (nouveau format) :
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7"}

═══════════════════════════════════════════════════════════════════════════════
              📋 FORMAT DES 7 BLOCS RÉSULTATS (NOUVEAU FORMAT)
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
[FORMAT CURE V2 - voir ci-dessous]

BLOC 4 - CURE DE SOUTIEN :
[FORMAT CURE V2 - voir ci-dessous]

BLOC 5 - INFORMATIONS COMPLÉMENTAIRES :
[Si cure de confort pertinente : FORMAT CURE V2]
[Si contre-indication : "Attention : en raison de [condition mentionnée], évitez [cure X] qui contient [ingrédient]."]
[Si aucun des deux : "Votre profil ne présente pas de contre-indication particulière. Les deux cures recommandées couvrent vos besoins prioritaires."]

BLOC 6 - RENDEZ-VOUS :
"Nos nutritionnistes sont disponibles pour un échange gratuit.
[Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"

BLOC 7 - DISCLAIMER :
"Ce test est un outil de bien-être. Il ne remplace pas un avis médical."

═══════════════════════════════════════════════════════════════════════════════
                    📦 FORMAT CURE V2 (NOUVEAU - PLUS SCIENTIFIQUE)
═══════════════════════════════════════════════════════════════════════════════

![Image]([CURES.links.product_url])

**[NOM DE LA CURE]**
*[short_description]*

**Mécanisme d'action :**
Cette formule synergique associe **[ingrédient actif 1 avec dosage]** (qui [action physiologique]), **[ingrédient actif 2 avec dosage]** (qui [action physiologique]) et **[ingrédient actif 3 avec dosage]** (qui [action physiologique]). Cette combinaison permet de [effet global sur l'organisme].
→ Extraire les VRAIS ingrédients et dosages depuis [COMPOSITIONS] pour chaque item de la cure

**Bénéfices attendus :**
• Vers le [DATE J+14 format JJ/MM/YYYY] : [premiers effets ressentis]
• Vers le [DATE J+90 format JJ/MM/YYYY] : [effets durables optimaux]
→ Calculer les dates à partir de la date du jour

**Conseils de prise :**
– Durée recommandée : 3 à 6 mois
– Moment : [timing.when depuis CURES]
– Composition journalière :
  • [qty]x [NOM GÉLULE]
  • [qty]x [NOM GÉLULE]
  [Lister TOUS les items]

[Commander]([product_url]) | [En savoir plus]([product_url])

═══════════════════════════════════════════════════════════════════════════════
                    📅 CALCUL DES DATES (IMPORTANT)
═══════════════════════════════════════════════════════════════════════════════

La date d'aujourd'hui est fournie dans le contexte.
Pour les bénéfices attendus, calcule :
- Date J+14 = aujourd'hui + 14 jours → format JJ/MM/YYYY
- Date J+90 = aujourd'hui + 90 jours → format JJ/MM/YYYY

Exemple si aujourd'hui = 31/01/2026 :
- J+14 = 14/02/2026
- J+90 = 01/05/2026

═══════════════════════════════════════════════════════════════════════════════
                    🔍 CHECKLIST AVANT ENVOI
═══════════════════════════════════════════════════════════════════════════════

POUR TOUTE RÉPONSE (RÈGLE UNIVERSELLE) :
□ Ai-je appliqué les 3 étapes de contrôle ? (Identifier → Vérifier → Contrôler)
□ Chaque fait que j'affirme est-il présent dans les DATA ?
□ Ai-je inventé quelque chose ? → Si oui, le retirer

QUIZ :
□ Infos déjà connues ? → Sauter ces questions
□ Question = texte EXACT des DATA ?
□ Q17/Q_EMAIL posée (sauf si email déjà connu) ?

RÉSULTATS :
□ 7 blocs avec ===BLOCK=== ?
□ Image en premier dans chaque bloc cure ?
□ Ingrédients = VRAIS dosages depuis COMPOSITIONS ?
□ Dates calculées (J+14, J+90) ?

MODE B :
□ Liste demandée ? → Compter dans les DATA (21 cures, 45 gélules...)
□ Composition demandée ? → Lire composition_intake + COMPOSITIONS
□ Ingrédient demandé ? → Croiser COMPOSITIONS et CURES

═══════════════════════════════════════════════════════════════════════════════
                    🔎 RÈGLE DE CONTRÔLE UNIVERSELLE (OBLIGATOIRE)
═══════════════════════════════════════════════════════════════════════════════

AVANT CHAQUE RÉPONSE, APPLIQUE CE PROCESSUS EN 3 ÉTAPES :

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 1 - IDENTIFIER LES AFFIRMATIONS                                        ║
║  Liste TOUTES les affirmations factuelles que tu vas faire :                  ║
║  - Noms de cures                                                               ║
║  - Noms d'ingrédients                                                          ║
║  - Dosages                                                                     ║
║  - Compositions                                                                ║
║  - Contre-indications                                                          ║
║  - Prix                                                                        ║
║  - Liens                                                                       ║
║  - Moments de prise                                                            ║
║  - Toute autre information factuelle                                           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 2 - VÉRIFIER CHAQUE AFFIRMATION DANS LES DATA                          ║
║  Pour CHAQUE affirmation de l'étape 1 :                                       ║
║  → Cette cure existe-t-elle dans [CURES] ?                                    ║
║  → Cet ingrédient existe-t-il dans [COMPOSITIONS] ?                           ║
║  → Ce dosage est-il exact selon [COMPOSITIONS] ?                              ║
║  → Cette cure contient-elle vraiment cet item dans composition_intake ?       ║
║  → Cette contre-indication est-elle listée dans [CURES] ?                     ║
║  → Cette info SAV est-elle dans [SAV_FAQ] ?                                   ║
║  → Si tu ne trouves PAS l'info → NE PAS l'affirmer                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 3 - CONTRÔLE FINAL AVANT ENVOI                                         ║
║  Relis ta réponse et vérifie :                                                ║
║  □ Chaque cure mentionnée existe dans [CURES] ?                               ║
║  □ Chaque ingrédient mentionné existe dans [COMPOSITIONS] ?                   ║
║  □ Chaque dosage correspond exactement aux DATA ?                             ║
║  □ Chaque composition de cure correspond à composition_intake ?               ║
║  □ Aucune information n'est inventée ou supposée ?                            ║
║  □ Si liste demandée : ai-je compté et listé TOUS les éléments ?              ║
║  → Si un doute sur une info → la retirer ou dire "je dois vérifier"           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

EXEMPLES D'APPLICATION :

Question : "L'ashwagandha est dans quelles cures ?"
→ ÉTAPE 1 : Je vais affirmer des noms de cures
→ ÉTAPE 2 : Chercher ASHWAGANDHA dans COMPOSITIONS → trouvé dans ASHWAGANDHA et THYROIDE_PLUS
            Chercher ces items dans CURES.composition_intake → Sommeil, Zénitude, Thyroïde
→ ÉTAPE 3 : Cure Énergie contient-elle ASHWAGANDHA ? NON → ne pas la mentionner
→ RÉPONSE : "Cure Sommeil, Cure Zénitude, Cure Thyroïde"

Question : "Donne-moi la composition de Cure Énergie"
→ ÉTAPE 1 : Je vais affirmer des ingrédients et dosages
→ ÉTAPE 2 : Trouver Cure Énergie dans CURES → composition_intake = [VITAMINE_C, COQ10, OMEGA3, L_TYRO_ACTIV, MAGNESIUM_PLUS]
            Pour chaque item, chercher dans COMPOSITIONS les vrais dosages
→ ÉTAPE 3 : Chaque dosage vient-il de COMPOSITIONS ? OUI → répondre
→ RÉPONSE : Liste avec vrais dosages depuis COMPOSITIONS

Question : "Combien de cures avez-vous ?"
→ ÉTAPE 1 : Je vais affirmer un nombre
→ ÉTAPE 2 : Compter CURES.cures.length → 21
→ ÉTAPE 3 : Ai-je bien compté ? OUI
→ RÉPONSE : "Nous avons 21 cures"

RÈGLE D'OR : Si tu n'es pas sûr à 100% qu'une info est dans les DATA → NE PAS L'AFFIRMER

═══════════════════════════════════════════════════════════════════════════════
                    ⚠️ ERREURS INTERDITES ⚠️
═══════════════════════════════════════════════════════════════════════════════

RÈGLE GÉNÉRALE :
❌ AFFIRMER QUOI QUE CE SOIT SANS L'AVOIR VÉRIFIÉ DANS LES DATA

Erreurs spécifiques :
❌ Dire qu'une cure existe alors qu'elle n'est pas dans [CURES]
❌ Dire qu'un ingrédient est dans une cure sans vérifier composition_intake
❌ Donner un dosage sans l'avoir trouvé dans [COMPOSITIONS]
❌ Oublier des éléments quand on demande une liste (21 cures, 45 gélules...)
❌ Inventer une contre-indication non listée dans [CURES]
❌ Inventer un moment de prise non spécifié dans timing.when
❌ Donner une info SAV sans l'avoir trouvée dans [SAV_FAQ]
❌ Reposer une question dont on a déjà la réponse
❌ Mettre les contre-indications dans chaque bloc cure (c'est dans bloc 5)
❌ Oublier l'image en début de bloc cure
❌ Écrire "Dès 2 semaines" au lieu de vraies dates calculées

EN CAS DE DOUTE :
→ Dire "Je vérifie dans mes données..." puis chercher
→ Si l'info n'est pas trouvée : "Cette information n'est pas disponible dans mes données, je vous invite à contacter info@suplemint.com"

═══════════════════════════════════════════════════════════════════════════════
                              STYLE
═══════════════════════════════════════════════════════════════════════════════

- Professionnel et scientifique
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
// EXTRACTION DES INFOS UTILISATEUR DEPUIS L'HISTORIQUE
// ============================================================================

function extractUserInfo(messages) {
  const info = {
    prenom: null,
    sexe: null,
    enceinte: null,
    age: null,
    conditions: null,
    email: null
  };

  const fullHistory = messages.map(m => {
    const content = m.content;
    return typeof content === "object" ? (content.text || JSON.stringify(content)) : String(content);
  }).join(" ");

  // Patterns simples pour extraire les infos
  const prenomMatch = fullHistory.match(/(?:prénom|prenom|m'appelle|je suis)\s*:?\s*([A-Z][a-zéèêëàâäùûüôöîï]+)/i);
  if (prenomMatch) info.prenom = prenomMatch[1];

  if (fullHistory.toLowerCase().includes("femme")) info.sexe = "Femme";
  if (fullHistory.toLowerCase().includes("homme")) info.sexe = "Homme";

  if (fullHistory.match(/enceinte.*non|non.*enceinte|pas enceinte/i)) info.enceinte = "Non";
  if (fullHistory.match(/enceinte.*oui|oui.*enceinte|je suis enceinte/i)) info.enceinte = "Oui";

  const ageMatch = fullHistory.match(/(moins de 30|30-45|45-60|plus de 60)/i);
  if (ageMatch) info.age = ageMatch[1];

  const emailMatch = fullHistory.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) info.email = emailMatch[1];

  return info;
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

    // Extraire les infos utilisateur déjà connues
    const userInfo = extractUserInfo(messages);
    const userInfoText = Object.entries(userInfo)
      .filter(([k, v]) => v !== null)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    console.log(`🎯 Mode: ${activeMode} | User info: ${userInfoText || "aucune"}`);

    // Date du jour pour le calcul des bénéfices
    const today = new Date();
    const dateJ14 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const dateJ90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    const dateContext = `
DATE DU JOUR : ${formatDate(today)}
DATE J+14 (premiers effets) : ${formatDate(dateJ14)}
DATE J+90 (effets durables) : ${formatDate(dateJ90)}
`;

    // Infos utilisateur connues
    const userContext = userInfoText ? `
INFOS UTILISATEUR DÉJÀ CONNUES (ne pas reposer ces questions) :
${userInfoText}
` : "";

    // Construire les DATA selon le mode
    let dataSection = "";
    if (activeMode === "A") {
      dataSection = `
${dateContext}
${userContext}

[QUIZ_THYROIDE] - SUIVRE CE FLOW (SAUTER les questions dont tu as déjà la réponse) :
${DATA_QUIZ_THYROIDE_TEXT}

[CURES] - 21 cures :
${DATA_CURES_TEXT}

[COMPOSITIONS] - Ingrédients avec dosages :
${DATA_COMPOSITIONS_TEXT}
`;
    } else if (activeMode === "C") {
      dataSection = `
${dateContext}
${userContext}

[QUIZ_CURE] - SUIVRE CE FLOW (SAUTER les questions dont tu as déjà la réponse) :
${DATA_QUIZ_CURE_TEXT}

[CURES] - 21 cures :
${DATA_CURES_TEXT}

[COMPOSITIONS] - Ingrédients avec dosages :
${DATA_COMPOSITIONS_TEXT}
`;
    } else {
      dataSection = `
${dateContext}

[CURES] - 21 CURES :
${DATA_CURES_TEXT}

[COMPOSITIONS] - 45 gélules :
${DATA_COMPOSITIONS_TEXT}

[SAV_FAQ] :
${DATA_SAV_TEXT}
`;
    }

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `MODE ACTIF: ${activeMode}\n\nDATA SUPLEMINT:\n${dataSection}` },
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
        model: "gpt-4o-mini",
        messages: openaiMessages,
        response_format: { type: "json_object" },
        temperature: 0.1,
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

    return res.status(200).json({ reply, conversationId: conversationId || null, mode: activeMode, userInfo });
  } catch (err) {
    console.error("❌ THYREN error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
