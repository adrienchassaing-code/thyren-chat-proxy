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
// FORMATAGE DES DONNÉES - COMPLET ET EXPLICITE
// ============================================================================

function formatCompositionsComplete(json) {
  if (!json?.capsules) return "AUCUNE DONNÉE COMPOSITIONS";
  const lines = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║       COMPOSITIONS COMPLÈTES DES GÉLULES SUPLEMINT           ║",
    "╚══════════════════════════════════════════════════════════════╝",
    ""
  ];
  
  for (const [key, cap] of Object.entries(json.capsules)) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`GÉLULE: ${cap.display_name}`);
    lines.push(`ID: ${key}`);
    lines.push(`ALIASES: ${(cap.aliases || [key]).join(", ")}`);
    lines.push(`Forme: ${cap.form || "gélule"}`);
    lines.push(`Enveloppe: ${cap.capsule_shell || "non précisé"}`);
    
    if (cap.allergen_tags?.length) {
      lines.push(`⚠️ ALLERGÈNES: ${cap.allergen_tags.join(", ")}`);
    } else {
      lines.push(`ALLERGÈNES: Aucun`);
    }
    
    if (cap.contains_iodine) {
      lines.push(`⚠️ CONTIENT DE L'IODE`);
    }
    
    lines.push(``);
    lines.push(`LISTE COMPLÈTE DES INGRÉDIENTS:`);
    
    for (const ing of cap.ingredients || []) {
      let l = `  • ${ing.name}`;
      if (ing.amount_mg) l += ` : ${ing.amount_mg} mg`;
      else if (ing.amount_mcg) l += ` : ${ing.amount_mcg} µg`;
      else if (ing.amount) l += ` : ${ing.amount} ${ing.unit || ""}`;
      if (ing.notes) l += ` (${ing.notes})`;
      lines.push(l);
    }
    
    if (cap.origin) {
      lines.push(``);
      lines.push(`ORIGINE: ${cap.origin}`);
    }
    
    if (cap.benefits_allegations?.length) {
      lines.push(``);
      lines.push(`ALLÉGATIONS SANTÉ AUTORISÉES:`);
      cap.benefits_allegations.forEach(a => lines.push(`  ✓ ${a}`));
    }
    
    lines.push(``);
  }
  
  return lines.join("\n");
}

function formatCuresComplete(json) {
  if (!json?.cures) return "AUCUNE DONNÉE CURES";
  const lines = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║           LISTE COMPLÈTE DES 21 CURES SUPLEMINT              ║",
    "╚══════════════════════════════════════════════════════════════╝",
    ""
  ];
  
  if (json.global_rules) {
    lines.push(`RÈGLES GÉNÉRALES:`);
    lines.push(`  • Durée recommandée: ${json.global_rules.cure_duration_days} jours`);
    lines.push(`  • Cycle recommandé: ${json.global_rules.recommended_cycle_months} mois`);
    lines.push(`  • Maximum cures simultanées: ${json.global_rules.max_simultaneous_cures}`);
    lines.push(``);
  }
  
  for (const cure of json.cures) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`CURE: ${cure.name}`);
    lines.push(`ID: ${cure.id}`);
    lines.push(`Description: ${cure.short_description}`);
    
    lines.push(``);
    lines.push(`COMPOSITION (gélules par jour):`);
    for (const item of cure.composition_intake || []) {
      lines.push(`  • ${item.item}: ${item.qty_per_day} par jour${item.time ? ` (${item.time})` : ""}`);
    }
    
    lines.push(``);
    lines.push(`MOMENT DE PRISE:`);
    if (cure.timing?.when) lines.push(`  • Quand: ${cure.timing.when}`);
    if (cure.timing?.morning) lines.push(`  • Matin: ${cure.timing.morning}`);
    if (cure.timing?.evening) lines.push(`  • Soir: ${cure.timing.evening}`);
    
    if (cure.recommendation_logic?.length) {
      lines.push(``);
      lines.push(`INDICATIONS: ${cure.recommendation_logic.join(", ")}`);
    }
    
    if (cure.contraindications?.length) {
      lines.push(``);
      lines.push(`CONTRE-INDICATIONS:`);
      cure.contraindications.forEach(ci => lines.push(`  ❌ ${ci}`));
    }
    
    lines.push(``);
    if (cure.links?.product_url) lines.push(`URL PRODUIT: ${cure.links.product_url}`);
    if (cure.links?.image_url) lines.push(`IMAGE: ${cure.links.image_url}`);
    if (cure.variants?.subscription_variant_id) lines.push(`VARIANT ABONNEMENT: ${cure.variants.subscription_variant_id}`);
    if (cure.variants?.one_time_variant_id) lines.push(`VARIANT ACHAT UNIQUE: ${cure.variants.one_time_variant_id}`);
    
    lines.push(``);
  }
  
  return lines.join("\n");
}

function formatSavFaqComplete(json) {
  if (!json?.sections) return "AUCUNE DONNÉE SAV";
  const lines = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║              FAQ / SAV COMPLET SUPLEMINT                     ║",
    "╚══════════════════════════════════════════════════════════════╝",
    ""
  ];
  
  for (const section of json.sections) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`SECTION: ${section.title}`);
    lines.push(``);
    
    for (const item of section.items || []) {
      lines.push(`Q: ${item.question}`);
      lines.push(`R: ${item.answer}`);
      
      if (item.contact) {
        lines.push(`  📧 Email: ${item.contact.email}`);
        lines.push(`  📞 Téléphone: ${item.contact.phone}`);
        if (item.contact.phone_hours) lines.push(`  🕐 Horaires: ${item.contact.phone_hours}`);
      }
      
      if (item.estimated_delays) {
        lines.push(`  DÉLAIS DE LIVRAISON:`);
        item.estimated_delays.forEach(d => lines.push(`    • ${d.zone}: ${d.delay}`));
      }
      
      if (item.timeline) {
        lines.push(`  TIMELINE RÉSULTATS:`);
        item.timeline.forEach(t => lines.push(`    • ${t.when}: ${t.details}`));
      }
      
      lines.push(``);
    }
    
    if (section.promo_codes) {
      lines.push(`CODES PROMO ACTIFS:`);
      section.promo_codes.forEach(p => {
        lines.push(`  🎁 ${p.code}: ${p.offer}`);
        if (p.conditions) lines.push(`     Conditions: ${p.conditions}`);
      });
      lines.push(``);
    }
  }
  
  return lines.join("\n");
}

function formatQuizExact(json, quizName) {
  if (!json?.nodes) return `AUCUNE DONNÉE QUIZ ${quizName}`;
  
  const lines = [
    "╔══════════════════════════════════════════════════════════════╗",
    `║              ${quizName.padEnd(44)}║`,
    "╚══════════════════════════════════════════════════════════════╝",
    "",
    "⚠️ IMPORTANT: Tu dois poser ces questions EXACTEMENT comme écrites ci-dessous.",
    "⚠️ Ne reformule JAMAIS les questions. Ne change AUCUN mot.",
    "⚠️ Les choix doivent être EXACTEMENT ceux listés, dans le même ordre.",
    "",
    `ORDRE DU FLOW: ${(json.flow_order || []).join(" → ")}`,
    ""
  ];
  
  // Parcourir dans l'ordre du flow
  const flowOrder = json.flow_order || Object.keys(json.nodes);
  
  for (const nodeId of flowOrder) {
    const node = json.nodes[nodeId];
    if (!node) continue;
    
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`ÉTAPE: ${nodeId}`);
    lines.push(`TYPE: ${node.type}`);
    
    if (node.text) {
      lines.push(`QUESTION EXACTE À POSER: "${node.text}"`);
    }
    
    if (node.choices && node.choices.length > 0) {
      lines.push(`CHOIX À PROPOSER (dans cet ordre exact):`);
      node.choices.forEach((c, i) => lines.push(`  ${i + 1}. "${c}"`));
    }
    
    if (node.next) {
      lines.push(`ÉTAPE SUIVANTE: ${node.next}`);
    }
    
    if (node.next_map) {
      lines.push(`BRANCHEMENT SELON RÉPONSE:`);
      for (const [answer, nextStep] of Object.entries(node.next_map)) {
        lines.push(`  • Si "${answer}" → aller à ${nextStep}`);
      }
    }
    
    if (node.description) {
      lines.push(`DESCRIPTION: ${node.description}`);
    }
    
    if (node.rules) {
      lines.push(`RÈGLES:`);
      node.rules.forEach(r => lines.push(`  • ${r}`));
    }
    
    if (node.meta?.capture) {
      lines.push(`DONNÉE CAPTURÉE: ${node.meta.capture}`);
    }
    
    lines.push(``);
  }
  
  if (json.engine_hints) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`PARAMÈTRES DU QUIZ:`);
    if (json.engine_hints.max_clinical_questions) {
      lines.push(`  • Questions cliniques max: ${json.engine_hints.max_clinical_questions}`);
    }
    if (json.engine_hints.quiz_tone) {
      lines.push(`  • Vouvoiement: ${json.engine_hints.quiz_tone.vouvoiement ? "OUI" : "NON"}`);
      lines.push(`  • Verbosité: ${json.engine_hints.quiz_tone.verbosity}`);
    }
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

const DATA_COMPOSITIONS = formatCompositionsComplete(COMPOSITIONS_JSON);
const DATA_CURES = formatCuresComplete(CURES_JSON);
const DATA_SAV = formatSavFaqComplete(SAV_JSON);
const DATA_QUIZ_THYROIDE = formatQuizExact(QUIZ_THYROIDE_JSON, "QUIZ THYROÏDE");
const DATA_QUIZ_CURE = formatQuizExact(QUIZ_CURE_JSON, "QUIZ CURE");

console.log("📊 Données chargées:");
console.log(`  • COMPOSITIONS: ${DATA_COMPOSITIONS.length} caractères`);
console.log(`  • CURES: ${DATA_CURES.length} caractères`);
console.log(`  • SAV: ${DATA_SAV.length} caractères`);
console.log(`  • QUIZ THYROIDE: ${DATA_QUIZ_THYROIDE.length} caractères`);
console.log(`  • QUIZ CURE: ${DATA_QUIZ_CURE.length} caractères`);

// ============================================================================
// SYSTEM PROMPT - TRÈS STRICT SUR L'UTILISATION DES DONNÉES
// ============================================================================

const SYSTEM_PROMPT = `Tu es THYREN, l'assistant IA de SUPLEMINT.

═══════════════════════════════════════════════════════════════════════════════
RÈGLE FONDAMENTALE : UTILISE LES DONNÉES, NE LES INVENTE JAMAIS
═══════════════════════════════════════════════════════════════════════════════

Tu as accès à des données COMPLÈTES dans les sections [COMPOSITIONS], [CURES], [SAV_FAQ] et [QUIZ].
Tu DOIS utiliser ces données pour répondre. JAMAIS inventer.

Si on te demande la composition d'une gélule → CHERCHE dans [COMPOSITIONS] et donne la liste EXACTE
Si on te demande une info sur une cure → CHERCHE dans [CURES] et donne les infos EXACTES
Si on te pose une question SAV → CHERCHE dans [SAV_FAQ] et réponds avec les infos EXACTES
Si tu lances un quiz → SUIS le [QUIZ] À LA LETTRE, mot pour mot

═══════════════════════════════════════════════════════════════════════════════
LES 3 AMORCES
═══════════════════════════════════════════════════════════════════════════════

1. "Ma thyroïde fonctionne-t-elle normalement ?" → MODE A
   Lance IMMÉDIATEMENT le quiz THYROÏDE avec la PREMIÈRE QUESTION exacte du flow (Q1)

2. "Quelle cure est faite pour moi ?" → MODE C  
   Lance IMMÉDIATEMENT le quiz CURE avec la PREMIÈRE QUESTION exacte du flow (Q1)

3. "J'ai une question" → MODE B
   Réponds : "Bien sûr, je suis là pour vous aider. Que souhaitez-vous savoir ?"

═══════════════════════════════════════════════════════════════════════════════
RÈGLES STRICTES POUR LES QUIZ
═══════════════════════════════════════════════════════════════════════════════

Quand tu fais un quiz (MODE A ou C) :

1. SUIS L'ORDRE DU FLOW exactement (Q1 → Q2 → Q2_plus si femme → Q3 → etc.)
2. POSE LA QUESTION EXACTE écrite dans les données, MOT POUR MOT
3. PROPOSE LES CHOIX EXACTS dans le même ordre que les données
4. NE REFORMULE JAMAIS les questions
5. NE SAUTE JAMAIS de question
6. Après chaque réponse, passe à l'étape suivante selon next ou next_map
7. Pour les questions ouvertes (type: "open"), ne propose PAS de choix
8. Entre les questions, tu peux ajouter UNE phrase courte de transition, mais la question doit rester EXACTE

EXEMPLE QUIZ CURE (ce que tu DOIS faire) :
- Q1: "Pour commencer, quel est votre prénom ?" (question EXACTE, pas de choix car type=open)
- Q2: "Quel est votre sexe biologique ?" avec choix ["Femme", "Homme"]
- Si Femme → Q2_plus: "Êtes-vous enceinte ou allaitante ?" avec choix ["Oui", "Non"]
- Si Homme → Q3 directement
- etc.

═══════════════════════════════════════════════════════════════════════════════
RÈGLES POUR LES COMPOSITIONS
═══════════════════════════════════════════════════════════════════════════════

Quand on demande "composition de X" ou "qu'est-ce qu'il y a dans X" :

1. CHERCHE la gélule dans [COMPOSITIONS] par son nom ou alias
2. DONNE LA LISTE COMPLÈTE des ingrédients avec leurs dosages
3. Mentionne les allergènes si présents
4. Ajoute les allégations santé autorisées

EXEMPLE : "Quelle est la composition de l'ADRENO+ ?"
→ Cherche ADRENO_PLUS dans les données
→ Liste : Klamath 200mg, Bacopa 150mg, Ginseng HRG80 50mg, Panax ginseng 50mg, Ginkgo 60mg, L-Tyrosine 37.5mg

═══════════════════════════════════════════════════════════════════════════════
FORMAT JSON OBLIGATOIRE
═══════════════════════════════════════════════════════════════════════════════

Réponse simple :
{
  "type": "reponse",
  "text": "Ta réponse",
  "meta": { "mode": "B", "progress": { "enabled": false } }
}

Question du quiz (avec choix) :
{
  "type": "question",
  "text": "LA QUESTION EXACTE DES DONNÉES",
  "choices": ["Choix 1 exact", "Choix 2 exact"],
  "meta": { "mode": "A ou C", "progress": { "enabled": true, "current": X, "total": Y } }
}

Question du quiz (ouverte, sans choix) :
{
  "type": "question",
  "text": "LA QUESTION EXACTE DES DONNÉES",
  "meta": { "mode": "A ou C", "progress": { "enabled": true, "current": X, "total": Y } }
}

Résultats finaux (8 blocs séparés par ===BLOCK===) :
{
  "type": "resultat",
  "text": "BLOC1===BLOCK===BLOC2===BLOCK===..."
}

═══════════════════════════════════════════════════════════════════════════════
FORMAT CURE DIRECT (quand on demande une cure spécifique, pas après quiz)
═══════════════════════════════════════════════════════════════════════════════

[URL_IMAGE depuis les données]

[NOM DE LA CURE]

Comment ça marche :
[2-3 phrases avec **3 ingrédients en gras** et leur action]

Bénéfices fonctionnels attendus :
[Effets en 2 semaines puis 2-3 mois]

Conseils de prise :
– Durée : 3 à 6 mois
– Moment : [depuis les données CURES]
– Composition : [liste gélules/jour depuis les données]

Contre-indications :
[depuis les données CURES]

[Commander](checkout:VARIANT_ID) [Ajouter au panier](addtocart:VARIANT_ID) [En savoir plus](URL)

═══════════════════════════════════════════════════════════════════════════════
FORMAT RÉSULTATS QUIZ (8 blocs avec ===BLOCK===)
═══════════════════════════════════════════════════════════════════════════════

BLOC 1: Résumé empathique (2-3 phrases)
BLOC 2: Besoins fonctionnels avec pourcentages
BLOC 3: Cure essentielle (avec Compatibilité XX%, ingrédients gras, CTAs)
BLOC 4: Cure de soutien (idem)
BLOC 5: Cure de confort (idem)
BLOC 6: Contre-indications
BLOC 7: RDV nutritionniste
BLOC 8: Mention légale

═══════════════════════════════════════════════════════════════════════════════
STYLE
═══════════════════════════════════════════════════════════════════════════════

- Naturel, conversationnel
- Tu vouvoies
- Pas d'emojis
- Direct et précis
- Tu peux utiliser tes connaissances scientifiques pour enrichir
- Tu ne poses JAMAIS de diagnostic médical
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
  
  // Amorces exactes
  if (mOriginal.includes("ma thyroïde fonctionne-t-elle normalement") || 
      mOriginal.includes("ma thyroide fonctionne-t-elle normalement") ||
      m.includes("thyroide fonctionne-t-elle normalement")) return "A";
  
  if (mOriginal.includes("quelle cure est faite pour moi") ||
      m.includes("quelle cure est faite pour moi")) return "C";
  
  if (mOriginal === "j'ai une question" || m === "j'ai une question") return "B";
  
  // Mots-clés
  if (m.includes("thyro")) return "A";
  if (m.includes("quelle cure") || m.includes("cure pour moi")) return "C";
  
  // Historique
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

    // Construction des données - TOUJOURS inclure compositions, cures, SAV
    let dataSection = `
[COMPOSITIONS]
${DATA_COMPOSITIONS}

[CURES]
${DATA_CURES}

[SAV_FAQ]
${DATA_SAV}
`;

    // Ajouter le quiz selon le mode
    if (activeMode === "A") {
      dataSection += `\n[QUIZ_THYROIDE]\n${DATA_QUIZ_THYROIDE}`;
    } else if (activeMode === "C") {
      dataSection += `\n[QUIZ_CURE]\n${DATA_QUIZ_CURE}`;
    }

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `DATE: ${getBrusselsNow()} | MODE ACTIF: ${activeMode}` },
      { role: "system", content: `DONNÉES SUPLEMINT À UTILISER:\n${dataSection}` },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? assistantContentToText(m.content) : contentToText(m.content)
      }))
    ];

    console.log(`📤 Mode: ${activeMode} | Chars: ${dataSection.length} | Tokens estimés: ~${Math.round(dataSection.length / 4)}`);

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
        temperature: 0.1,  // Plus bas pour suivre les données exactement
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
