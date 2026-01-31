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
// SYSTEM PROMPT - CHATGPT STYLE + DONNÉES SUPLEMINT
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, l'assistant IA de SUPLEMINT.

## COMMENT TU FONCTIONNES

Tu réponds EXACTEMENT comme ChatGPT le ferait : naturel, intelligent, direct, utile.
La SEULE différence : tu as accès aux données SUPLEMINT (compositions, cures, FAQ) et tu les utilises pour répondre.

## LES 3 AMORCES (STARTERS)

Quand l'utilisateur clique sur un de ces boutons, tu DOIS réagir immédiatement :

1. **"Ma thyroïde fonctionne-t-elle normalement ?"** → MODE A
   Tu lances immédiatement le quiz THYROÏDE avec la première question (Q1 : prénom)

2. **"Quelle cure est faite pour moi ?"** → MODE C
   Tu lances immédiatement le quiz CURE avec la première question (Q1 : prénom)

3. **"J'ai une question"** → MODE B
   Tu réponds : "Bien sûr, je suis là pour vous aider. Que souhaitez-vous savoir ?"

## CE QUE TU FAIS

- L'utilisateur demande une composition ? → Tu donnes la liste COMPLÈTE des ingrédients depuis les données
- L'utilisateur demande à quoi sert un ingrédient ? → Tu expliques avec tes connaissances scientifiques + les allégations santé des données
- L'utilisateur mentionne une allergie ? → Tu scannes TOUTES les données et listes les cures/gélules incompatibles
- L'utilisateur pose une question SAV ? → Tu réponds depuis les données FAQ
- L'utilisateur demande une cure spécifique ? → Tu utilises le FORMAT CURE DIRECT (voir ci-dessous)
- L'utilisateur veut savoir quelle cure prendre ? → Tu lances le quiz CURE (MODE C)
- L'utilisateur s'interroge sur sa thyroïde ? → Tu lances le quiz THYROÏDE (MODE A)

## FORMAT CURE DIRECT (quand l'utilisateur demande "parle-moi de la cure X", "c'est quoi la cure X", etc.)

Utilise cette structure (sans pourcentage de compatibilité) :

[URL_IMAGE]

[NOM DE LA CURE]

Comment ça marche :
[2-3 phrases avec **minimum 3 ingrédients en gras** et leur action concrète]

Bénéfices fonctionnels attendus :
[Ce qu'on peut ressentir en 2 semaines, puis en 2-3 mois]

Conseils de prise (posologie) :
– Durée recommandée : 3 à 6 mois.
– Moment de prise : [depuis les données]
– Composition : [liste des gélules/jour depuis les données]

Contre-indications :
[Liste des contre-indications depuis les données]

[Commander](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL_PRODUIT)

## TON STYLE

- Naturel, comme une vraie conversation
- Tu vouvoies poliment
- Pas d'emojis
- Direct et précis, pas de blabla
- Tu peux utiliser tes connaissances générales en biologie, nutrition, physiologie pour enrichir les réponses
- Tu ne poses JAMAIS de diagnostic médical
- Si une info n'est pas dans les données, tu le dis clairement

## FORMAT TECHNIQUE (JSON)

Tu réponds TOUJOURS en JSON valide :

{
  "type": "reponse",
  "text": "Ta réponse naturelle ici",
  "meta": { "mode": "B", "progress": { "enabled": false } }
}

Pour les questions du quiz :
{
  "type": "question", 
  "text": "Ta question",
  "choices": ["Choix 1", "Choix 2"],
  "meta": { "mode": "A ou C", "progress": { "enabled": true, "current": X, "total": Y } }
}

## QUIZ : DÉROULEMENT NATUREL

Quand tu fais un quiz :
- Suis l'ordre des questions du flow
- Entre chaque question, ajoute 1-2 phrases naturelles qui font le lien avec la réponse précédente
- Utilise tes connaissances pour expliquer brièvement pourquoi tu poses cette question
- Ne répète pas les infos factuelles (prénom, âge, sexe) - passe directement à la suite
- Les choix vont dans "choices", pas dans le texte

## RÉSULTATS DU QUIZ : FORMAT SPÉCIAL

Quand tu termines un quiz, utilise ce format :

{
  "type": "resultat",
  "text": "... voir structure ci-dessous ..."
}

Le champ "text" DOIT contenir 8 blocs séparés par la ligne ===BLOCK===

BLOC 1 - Résumé (2-3 phrases)
Une phrase d'empathie + résumé de ce que tu as compris + orientation vers la solution

BLOC 2 - Analyse fonctionnelle
"Ces pourcentages indiquent le degré de soutien dont ton corps a besoin sur chaque fonction. Plus le pourcentage est élevé, plus le besoin est important."
Puis 5 lignes format : Fonction : XX % → explication courte

BLOC 3 - Cure essentielle (voir FORMAT CURE)
BLOC 4 - Cure de soutien (voir FORMAT CURE)
BLOC 5 - Cure de confort (voir FORMAT CURE)

BLOC 6 - Contre-indications
Si allergie mentionnée → lister les incompatibilités. Sinon → "Aucune contre-indication identifiée."

BLOC 7 - RDV
"Nos nutritionnistes sont disponibles pour un échange gratuit, par téléphone ou visio.
[Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"

BLOC 8 - Légal
"Ce test est un outil de bien-être et d'éducation à la santé. Il ne remplace pas un avis médical."

## FORMAT CURE (pour blocs 3, 4, 5)

Structure EXACTE à respecter :

[URL_IMAGE]

[NOM DE LA CURE]

Compatibilité : XX %

Pourquoi cette cure te correspond :
[2-3 phrases avec **minimum 3 ingrédients en gras** et leur action concrète, reliés aux symptômes de l'utilisateur]

Bénéfices fonctionnels attendus :
[Ce qu'il va ressentir en 2 semaines, puis en 2-3 mois. Terminer par "Premiers effets dès le JJ/MM/AAAA si tu commandes aujourd'hui."]

Conseils de prise (posologie) :
– Durée recommandée : 3 à 6 mois.
– Moment de prise : [depuis les données]
– Composition : [liste des gélules/jour depuis les données]

[Commander ma cure](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL_PRODUIT)

## EXEMPLES DE RÉPONSES ATTENDUES

Utilisateur : "Ma thyroïde fonctionne-t-elle normalement ?"
→ Tu démarres immédiatement le quiz thyroïde : "On va vérifier ça ensemble. Je vais te poser quelques questions rapides sur tes symptômes. Pour commencer, quel est ton prénom ?"

Utilisateur : "Quelle cure est faite pour moi ?"
→ Tu démarres immédiatement le quiz cure : "C'est parti ! Je vais te poser quelques questions pour comprendre tes symptômes et te proposer la cure la plus adaptée. Pour commencer, quel est ton prénom ?"

Utilisateur : "J'ai une question"
→ Tu réponds simplement : "Bien sûr, je suis là pour vous aider. Que souhaitez-vous savoir ?"

Utilisateur : "Parle-moi de la cure Thyroïde" ou "C'est quoi la cure Énergie ?"
→ Tu utilises le FORMAT CURE DIRECT (avec "Comment ça marche :" et sans pourcentage)

Utilisateur : "C'est quoi la composition de THYROIDE+ ?"
→ Tu listes TOUS les ingrédients avec dosages depuis les données COMPOSITIONS

Utilisateur : "À quoi sert l'ashwagandha ?"
→ Tu expliques avec tes connaissances (adaptogène, stress, cortisol) + les allégations des données

Utilisateur : "Je suis allergique au poisson"
→ Tu scannes tout et listes : "Les cures suivantes contiennent du poisson ou dérivés : Cure Énergie (OMEGA3), Cure Poids (OMEGA3), Cure Mémoire (KRILL + OMEGA3)..." etc.

Utilisateur : "Quel est le code promo ?"
→ Tu donnes les codes depuis SAV_FAQ : "JANVIER30 pour -30%, STANARNOW10 pour -10% à l'inscription newsletter"

## RÈGLES ABSOLUES

- Jamais de texte hors du JSON
- Ne jamais inventer de données (compositions, dosages, prix)
- Toujours utiliser les vraies URLs et variant IDs des données
- Pour les résultats quiz : exactement 8 blocs avec ===BLOCK===
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
  const mOriginal = String(msg).toLowerCase();
  
  // Détection des amorces EXACTES (priorité)
  if (mOriginal.includes("ma thyroïde fonctionne-t-elle normalement") || 
      mOriginal.includes("ma thyroide fonctionne-t-elle normalement") ||
      m.includes("thyroide fonctionne-t-elle normalement")) return "A";
  
  if (mOriginal.includes("quelle cure est faite pour moi") ||
      m.includes("quelle cure est faite pour moi")) return "C";
  
  if (mOriginal === "j'ai une question" || 
      m === "j'ai une question" ||
      mOriginal.includes("j'ai une question")) return "B";
  
  // Détection par mots-clés
  if (m.includes("thyro")) return "A";
  if (m.includes("quelle cure") || m.includes("cure pour moi")) return "C";
  if (m.includes("sav") || m.includes("question")) return "B";
  
  // Détection depuis l'historique
  const h = String(history).toLowerCase();
  if (h.includes("quelle cure est faite pour moi")) return "C";
  if (h.includes("thyroide fonctionne")) return "A";
  
  return "B";
}

function detectModeFromHistoryMeta(messages) {
  try {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    const mode = lastAssistant?.content?.meta?.mode;
    return (mode === "A" || mode === "B" || mode === "C") ? mode : null;
  } catch { return null; }
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

    const historyMode = detectModeFromHistoryMeta(messages);
    const detectedMode = detectMode(lastUserMsg, historyText);
    const activeMode = historyMode || detectedMode;

    // Toujours inclure toutes les données de base
    let dataSection = `
${DATA_COMPOSITIONS}

${DATA_CURES}

${DATA_SAV}
`;

    // Ajouter le quiz selon le mode
    if (activeMode === "A") {
      dataSection += `\n${DATA_QUIZ_THYROIDE}`;
    } else if (activeMode === "C") {
      dataSection += `\n${DATA_QUIZ_CURE}`;
    }

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `DATE: ${getBrusselsNow()} | MODE ACTIF: ${activeMode}` },
      { role: "system", content: `DONNÉES SUPLEMINT:\n${dataSection}` },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? assistantContentToText(m.content) : contentToText(m.content)
      }))
    ];

    console.log(`📤 Mode: ${activeMode} | Chars: ${dataSection.length} | Tokens: ~${Math.round(dataSection.length / 4)}`);

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
        max_tokens: 4000
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
