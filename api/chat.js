import fs from "fs";
import path from "path";

// ============================================================================
// LECTURE DES 4 FICHIERS DATA (FORMAT TXT)
// ============================================================================

const loadTxt = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const content = fs.readFileSync(filePath, "utf8");
    console.log(`✅ ${filename} chargé (${content.length} caractères)`);
    return content;
  } catch (e) {
    console.error(`❌ ERREUR ${filename}:`, e.message);
    return null;
  }
};

console.log("📦 Chargement des données THYREN...");
const DATA_COMPOSITIONS = loadTxt("COMPOSITIONS.txt");
const DATA_CURES = loadTxt("LES_CURES_ALL.txt");
const DATA_QUIZ = loadTxt("QUESTION_THYROIDE.txt");
const DATA_SAV = loadTxt("SAV_FAQ.txt");

const allLoaded = DATA_COMPOSITIONS && DATA_CURES && DATA_QUIZ && DATA_SAV;
if (allLoaded) {
  console.log(`✅ Toutes les données TXT chargées`);
}

// ============================================================================
// PROMPT SYSTEM COMPLET
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, assistant IA de SUPLEMINT.

═══════════════════════════════════════════════════════════════════════════════
                         🔒 RÈGLES ABSOLUES 🔒
═══════════════════════════════════════════════════════════════════════════════

1. NE JAMAIS AFFIRMER SANS VÉRIFIER - Chaque fait doit être dans les DATA
2. APPLIQUER LES 3 ÉTAPES DE CONTRÔLE avant chaque réponse
3. EN CAS DE DOUTE → Chercher dans les DATA, pas deviner
4. SI INFO NON TROUVÉE → Dire "je n'ai pas cette information"
5. SUIS LE FLOW EXACT du quiz
6. RESPECTE LE FORMAT JSON

═══════════════════════════════════════════════════════════════════════════════
                    💾 MÉMORISATION UTILISATEUR
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

═══════════════════════════════════════════════════════════════════════════════
                              LES 2 MODES
═══════════════════════════════════════════════════════════════════════════════

**MODE A - Quiz Cure Idéale**
Déclencheur : "Faire le quiz pour trouver ma cure idéale"
→ Flow : Q1 → Q2 → Q2_plus → Q3 → [Q3_menopause] → Q4 → Q4b → Q5 → Q5b → Q5c → Q6 → ... → Q16 → RESULT
→ SAUTER les questions dont tu as déjà la réponse

RÈGLE CONDITIONNELLE Q3_menopause :
- Poser Q3_menopause UNIQUEMENT si : Femme ET (45-60 ans OU Plus de 60 ans)
- Si Homme OU Femme de moins de 45 ans → passer directement à Q4

**MODE B - Questions libres**
Déclencheur : "J'ai une question" ou toute autre question
→ Utilise [COMPOSITIONS], [CURES], [SAV_FAQ]

═══════════════════════════════════════════════════════════════════════════════
                    🚨 RÈGLES QUIZ STRICTES 🚨
═══════════════════════════════════════════════════════════════════════════════

1. Questions standards : COPIE-COLLE le texte EXACT des DATA
2. Questions standards avec choix : COPIE-COLLE les choices dans l'ordre EXACT
3. Question "ouverte" → PAS de choices
4. Question "choix" → INCLURE choices
5. ⚠️ Q16 (email) OBLIGATOIRE (sauf si email déjà connu)
6. Q3_menopause : poser UNIQUEMENT si Femme ET 45+ ans

═══════════════════════════════════════════════════════════════════════════════
                    🔄 GESTION "AUTRE – J'AIMERAIS PRÉCISER"
═══════════════════════════════════════════════════════════════════════════════

Quand l'utilisateur choisit "Autre – j'aimerais préciser" :

1. POSER LA QUESTION DE PRÉCISION :
   → Aller vers la question Q*_autre correspondante
   → Exemple : Q8 → Q8_autre ("Merci de préciser comment vous ressentez la température de vos extrémités.")

2. ACCUSER RÉCEPTION DANS LA QUESTION SUIVANTE :
   → Utiliser "Texte après Autre" au lieu de "Texte normal"
   → Remplacer {precision_precedente} par la réponse de l'utilisateur
   → Mettre la première lettre en majuscule

EXEMPLE CONCRET :
- Q8 : "Ressentez-vous souvent le froid ?"
- User : "Autre – j'aimerais préciser"
- Bot (Q8_autre) : "Merci de préciser comment vous ressentez la température de vos extrémités."
- User : "dans la nuque"
- Bot (Q9 avec texte après autre) : "Dans la nuque, c'est noté et intégré. Comment décririez-vous votre humeur ces derniers temps ?"

RÈGLE : Si la question précédente n'était PAS "Autre", utiliser le "Texte normal".

═══════════════════════════════════════════════════════════════════════════════
                         FORMAT JSON OBLIGATOIRE
═══════════════════════════════════════════════════════════════════════════════

RÉPONSE SIMPLE (Mode B) :
{"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}

QUESTION QUIZ AVEC CHOIX :
{"type":"question","text":"[TEXTE EXACT]","choices":["..."],"meta":{"mode":"A","progress":{"enabled":true,"current":X,"total":16}}}

QUESTION QUIZ OUVERTE :
{"type":"question","text":"[TEXTE]","meta":{"mode":"A","progress":{"enabled":true,"current":X,"total":16}}}

RÉSULTATS QUIZ - 7 BLOCS :
{"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===BLOC3===BLOCK===BLOC4===BLOCK===BLOC5===BLOCK===BLOC6===BLOCK===BLOC7"}

═══════════════════════════════════════════════════════════════════════════════
              📋 FORMAT DES 7 BLOCS RÉSULTATS
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
                    📦 FORMAT CURE V2
═══════════════════════════════════════════════════════════════════════════════

![Image]([LIEN PRODUIT depuis CURES])

**[NOM DE LA CURE]**
*[Description courte]*

**Mécanisme d'action :**
Cette formule synergique associe **[ingrédient actif 1 avec dosage]** (qui [action physiologique]), **[ingrédient actif 2 avec dosage]** (qui [action physiologique]) et **[ingrédient actif 3 avec dosage]** (qui [action physiologique]). Cette combinaison permet de [effet global sur l'organisme].
→ Extraire les VRAIS ingrédients et dosages depuis [COMPOSITIONS] pour chaque item de la cure

**Bénéfices attendus :**
• Vers le [DATE J+14 format JJ/MM/YYYY] : [premiers effets ressentis]
• Vers le [DATE J+90 format JJ/MM/YYYY] : [effets durables optimaux]
→ Calculer les dates à partir de la date du jour

**Conseils de prise :**
– Durée recommandée : 3 à 6 mois
– Moment : [Moment de prise depuis CURES]
– Composition journalière :
  • [qty]x [NOM GÉLULE]
  • [qty]x [NOM GÉLULE]
  [Lister TOUS les items]

[Commander]([product_url]) | [En savoir plus]([product_url])

═══════════════════════════════════════════════════════════════════════════════
                    🔍 CHECKLIST AVANT ENVOI
═══════════════════════════════════════════════════════════════════════════════

POUR TOUTE RÉPONSE (RÈGLE UNIVERSELLE) :
□ Ai-je appliqué les 3 étapes de contrôle ? (Identifier → Vérifier → Contrôler)
□ Chaque fait que j'affirme est-il présent dans les DATA ?
□ Ai-je inventé quelque chose ? → Si oui, le retirer

QUIZ :
□ Infos déjà connues ? → Sauter ces questions
□ Question standard = texte EXACT des DATA ?
□ Q3_menopause posée ? → Seulement si Femme ET 45+ ans
□ Réponse "Autre" précédente ? → Accuser réception avec {precision_precedente}
□ Q16 (email) posée (sauf si email déjà connu) ?

RÉSULTATS :
□ 7 blocs avec ===BLOCK=== ?
□ Image en premier dans chaque bloc cure ?
□ Ingrédients = VRAIS dosages depuis COMPOSITIONS ?
□ Dates calculées (J+14, J+90) ?

MODE B :
□ Liste demandée ? → Compter dans les DATA (21 cures, 45 gélules...)
□ Composition demandée ? → Lire composition + COMPOSITIONS
□ Ingrédient demandé ? → Croiser COMPOSITIONS et CURES

═══════════════════════════════════════════════════════════════════════════════
                    🔎 RÈGLE DE CONTRÔLE UNIVERSELLE (OBLIGATOIRE)
═══════════════════════════════════════════════════════════════════════════════

AVANT CHAQUE RÉPONSE, APPLIQUE CE PROCESSUS EN 3 ÉTAPES :

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 1 - IDENTIFIER LES AFFIRMATIONS                                        ║
║  Liste TOUTES les affirmations factuelles que tu vas faire                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 2 - VÉRIFIER CHAQUE AFFIRMATION DANS LES DATA                          ║
║  → Si tu ne trouves PAS l'info → NE PAS l'affirmer                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ÉTAPE 3 - CONTRÔLE FINAL AVANT ENVOI                                         ║
║  → Si un doute sur une info → la retirer ou dire "je dois vérifier"           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

RÈGLE D'OR : Si tu n'es pas sûr à 100% qu'une info est dans les DATA → NE PAS L'AFFIRMER

═══════════════════════════════════════════════════════════════════════════════
                    ⚠️ ERREURS INTERDITES ⚠️
═══════════════════════════════════════════════════════════════════════════════

❌ AFFIRMER QUOI QUE CE SOIT SANS L'AVOIR VÉRIFIÉ DANS LES DATA
❌ Dire qu'une cure existe alors qu'elle n'est pas dans [CURES]
❌ Dire qu'un ingrédient est dans une cure sans vérifier la composition
❌ Donner un dosage sans l'avoir trouvé dans [COMPOSITIONS]
❌ Inventer une contre-indication non listée dans [CURES]
❌ Reposer une question dont on a déjà la réponse
❌ Poser Q3_menopause à un homme ou une femme de moins de 45 ans
❌ Oublier d'accuser réception quand l'utilisateur a choisi "Autre – j'aimerais préciser"
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

  if (msg.includes("quiz") || msg.includes("cure ideale") || msg.includes("cure idéale")) return "A";
  if (msg.includes("trouver ma cure") || msg.includes("quelle cure")) return "A";
  if (msg.includes("thyroide fonctionne") || msg.includes("thyroïde fonctionne")) return "A";
  if (msg.includes("thyro") && (msg.includes("probleme") || msg.includes("normale") || msg.includes("test"))) return "A";

  const hist = String(history || "").toLowerCase();
  if (hist.includes("quiz") || hist.includes("mode a")) return "A";

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

    const userInfo = extractUserInfo(messages);
    const userInfoText = Object.entries(userInfo)
      .filter(([k, v]) => v !== null)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    console.log(`🎯 Mode: ${activeMode} | User info: ${userInfoText || "aucune"}`);

    const today = new Date();
    const dateJ14 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const dateJ90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    const dateContext = `
DATE DU JOUR : ${formatDate(today)}
DATE J+14 (premiers effets) : ${formatDate(dateJ14)}
DATE J+90 (effets durables) : ${formatDate(dateJ90)}
`;

    const userContext = userInfoText ? `
INFOS UTILISATEUR DÉJÀ CONNUES (ne pas reposer ces questions) :
${userInfoText}
` : "";

    let dataSection = "";
    if (activeMode === "A") {
      dataSection = `
${dateContext}
${userContext}

[QUIZ] - SUIVRE CE FLOW (SAUTER les questions dont tu as déjà la réponse) :
${DATA_QUIZ}

[CURES] - 21 cures :
${DATA_CURES}

[COMPOSITIONS] - Ingrédients avec dosages :
${DATA_COMPOSITIONS}
`;
    } else {
      dataSection = `
${dateContext}

[CURES] - 21 CURES :
${DATA_CURES}

[COMPOSITIONS] - 45 gélules :
${DATA_COMPOSITIONS}

[SAV_FAQ] :
${DATA_SAV}
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
