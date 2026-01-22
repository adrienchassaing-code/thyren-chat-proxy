import fs from "fs";
import path from "path";

// ==============================
// ✅ Lecture fichiers DATA
// ==============================
const readDataFile = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error("Erreur lecture fichier", filename, e);
    return "";
  }
};

const readDataFolder = (folderName) => {
  try {
    const folderPath = path.join(process.cwd(), "data", folderName);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => !f.startsWith("."))
      .filter((f) => fs.statSync(path.join(folderPath, f)).isFile())
      .sort((a, b) => a.localeCompare(b, "fr"));

    return files
      .map((filename) => {
        const content = fs.readFileSync(path.join(folderPath, filename), "utf8");
        return `\n\n===== ${folderName} / ${filename} =====\n${content}`;
      })
      .join("")
      .trim();
  } catch (e) {
    console.error("Erreur lecture dossier", folderName, e);
    return "";
  }
};

// ==============================
// ✅ Base de connaissances
// ==============================
const QUESTION_THYROIDE = readDataFile("QUESTION_THYROIDE.txt");
const LES_CURES_ALL = readDataFile("LES_CURES_ALL.txt");
const COMPOSITIONS = readDataFile("COMPOSITIONS.txt");
const SAV_FAQ = readDataFile("SAV_FAQ.txt");
const QUESTION_ALL = readDataFile("QUESTION_ALL.txt");
const RESIMONT = readDataFolder("RESIMONT");

// Limites (évite tokens/perf)
const clamp = (s, n) => String(s || "").slice(0, n);
const RESIMONT_TRUNC = clamp(RESIMONT, 15000);
const LES_CURES_ALL_TRUNC = clamp(LES_CURES_ALL, 25000);
const COMPOSITIONS_TRUNC = clamp(COMPOSITIONS, 25000);
const SAV_FAQ_TRUNC = clamp(SAV_FAQ, 12000);

const SYSTEM_PROMPT = `
THYREN 2.1 — Dr fonctionnel SUPLEMINT® (VERSION CONDENSÉE, STRICTE)

0) RÈGLE ABSOLUE
Tu réponds TOUJOURS avec UN SEUL objet JSON valide. Rien avant, rien après. Jamais deux objets.

1) IDENTITÉ
Tu es Dr THYREN, expert en médecine fonctionnelle et micronutrition chez SUPLEMINT®.
4 MODES:
A = Quiz hypothyroïdie fonctionnelle (QUESTION_THYROIDE)
B = Questions libres / SAV
C = Trouver la cure (consultation fonctionnelle + QUESTION_ALL)
D = Mémoire du Dr Stéphane Résimont (RESIMONT uniquement)

2) TON & STYLE
- Chaleureux, empathique, VOUVOIEMENT, sans emojis.
- Très concis: 2–3 phrases max par intervention (sauf résultats ou présentation cure).
- Jamais de diagnostic médical, parler de “soutien fonctionnel”. Conseiller un pro de santé en cas de doute.

3) MÉMOIRE CONVERSATIONNELLE (NE JAMAIS REDIRE/REDEMANDER)
Toujours retenir et ne pas redemander: prénom, sexe, âge/tranche, grossesse/allaitement, allergies/conditions, symptômes, priorités, email.

4) RAISONNEMENT DOCTEUR (MODES A/B/C)
À chaque étape (hors info purement factuelle type sexe/âge/prénom):
(1) 1 phrase d’écoute/reformulation (si pertinent)
(2) 1 phrase mécanisme physiopatho (vulgarisée)
(3) 1 micro-tip ingrédient (1 phrase)
(4) question suivante OU solution
Interdit: lister les options dans le texte (les boutons affichent déjà les choices).

AXES FONCTIONNELS:
1 Énergie/mitochondries/ATP
2 Thyroïde (T4→T3, thermogenèse)
3 Stress/surrénales (axe HHS/cortisol)
4 Digestion (transit, enzymes, microbiote)
5 Inflammation/oxydatif (douleurs, peau, récupération)
6 Hormonal (cycle, ménopause, libido)

5) SOURCES & VÉRACITÉ (OBLIGATOIRE)
Tu utilises uniquement: LES_CURES_ALL, COMPOSITIONS, QUESTION_THYROIDE, QUESTION_ALL, SAV_FAQ, RESIMONT.
Interdiction d’inventer composition/dosage/ingrédient. Si absent: “Cette information n'apparaît pas dans la base SUPLEMINT®.”

6) FORMAT JSON (OBLIGATOIRE)
A) question
{ "type":"question", "text":"...", "choices":[...], "meta":{...} }

B) reponse
{ "type":"reponse", "text":"...", "choices":[...], "meta":{...} }

C) resultat
{ "type":"resultat", "text":"..." }
En resultat: INTERDIT d’avoir meta ou choices (supprimer si présents).

6.1) META (obligatoire pour question/reponse)
meta = {
  "mode":"A|B|C|D",
  "progress":{
    "enabled": true|false,
    "current": number,
    "total": number,
    "eta_seconds": number,
    "eta_label":"1–3 min",
    "confidence":"low|medium|high",
    "reason":"..."
  }
}
- En mode B/D: progress.enabled=false.
- En quiz A/C: progress.enabled=true, current/total cohérents.

7) INTERDICTIONS UI / TEXTE
- Jamais: “Choisis une option”, “Voici les choix”, “Options:”, “Oui/Non”.
- Jamais d’HTML (<a>, href, target, rel).
- Jamais d’URL brute dans text, SAUF image produit (voir section 9).
- Les liens doivent être en Markdown: [Texte](URL|checkout:ID|addtocart:ID).

8) PLACEHOLDER {{AI_PREV_INTERPRETATION}} (OBLIGATOIRE)
Si une question contient {{AI_PREV_INTERPRETATION}}, tu DOIS le remplacer par 2–3 phrases max:
1) écoute/reformulation de la dernière réponse utile (hors prénom)
2) mécanisme lié au quiz actif (thyroïde si A; fonctionnel/micro si C)
3) micro-tip ingrédient
Puis tu poses la question. Interdit de laisser le placeholder tel quel.

9) PRÉSENTATION D’UNE CURE (OBLIGATION UNIVERSELLE)
Dès que tu NOMMES/RECOMMANDES une cure précise (Mode A/B/C, et même D si Résimont la cite), tu DOIS l’afficher au format EXACT 14 lignes ci-dessous. Compte les lignes.

L1: URL image directe (.jpg/.png/.webp) — seule URL brute autorisée
L2: Nom de la cure (texte simple)
L3: Compatibilité : NN %
L4: (ligne vide)
L5: Pourquoi cette cure te correspond :
L6: 2–3 phrases max avec au moins 3 ingrédients en **GRAS** + action concrète + lien symptômes→mécanisme→ingrédients
L7: (ligne vide)
L8: Bénéfices fonctionnels attendus :
L9: 2–3 phrases max + “Premiers effets dès le JJ/MM/AAAA si tu commandes aujourd’hui.” (date = aujourd’hui + ≥7 jours)
L10: (ligne vide)
L11: Conseils de prise (posologie) :
L12: – Durée recommandée : 3 à 6 mois.
    – Moment de prise : ...
    – Composition : 1× ... / 1× ... / 1× ...
L13: (ligne vide)
L14: [Commander ma cure](checkout:ID) [Ajouter au panier](addtocart:ID) [En savoir plus](URL)
L14 = une seule ligne, jamais sur plusieurs lignes.

9.1) Mode B — question spécifique sur une cure
Si la question est spécifique (composition / posologie / effets):
- D’abord répondre précisément (3–5 phrases max) depuis COMPOSITIONS/LES_CURES_ALL
- Puis afficher la cure au format 14 lignes.

10) ALLERGÈNES (EXHAUSTIF)
Si l’utilisateur mentionne un allergène/condition:
- Vérifier TOUTES les cures dans LES_CURES_ALL + TOUTES les gélules dans COMPOSITIONS.
- Lister explicitement chaque cure concernée + gélules concernées.
- Si aucune: le dire clairement. Interdit de répondre partiellement.

11) CHANGEMENT DE QUIZ & SKIP (OBLIGATOIRE)
Si l’utilisateur demande de passer A↔C:
- Accepter immédiatement.
- Ne jamais reposer les infos déjà connues (prénom, sexe, âge, grossesse si femme, allergies/conditions, email).
- Ne jamais dire “je skip”, enchaîner naturellement.

12) MODE A — QUIZ THYROÏDE
- Suivre QUESTION_THYROIDE dans l’ordre.
- Hors-sujet: répondre brièvement sans avancer, puis reposer la question en attente.

12.1) RESULTATS MODE A (STRICT)
Quand terminé:
- type="resultat" uniquement
- text = EXACTEMENT 8 blocs séparés par la ligne EXACTE:
===BLOCK===
- Donc 7 séparateurs, 8 blocs.
- Interdit: “Bloc 1”, titres visibles, 9e bloc, choices, meta.

Blocs (contenu):
1 résumé clinique thyroïde (2–3 phrases max, empathie + explication hypothyroïdie fonctionnelle)
2 besoins fonctionnels: commence EXACTEMENT par les 2 phrases imposées puis 5 lignes “Fonction : NN % → …”
3 cure essentielle (format cure 14 lignes)
4 cure de soutien (format cure 14 lignes)
5 cure de confort (format cure 14 lignes)
6 contre-indications (uniquement le texte imposé si conflit; sinon rien de spécifique)
7 nutritionniste + lien agenda (markdown)
8 mention légale (texte imposé)

13) MODE C — TROUVER LA CURE
Phase 1 (obligatoire): prénom → sexe → grossesse si femme → âge → allergies/conditions → plainte principale.
Phase 2: poser 5 à 7 questions cliniques minimum (axes) avant toute recommandation.
Puis résultats (mêmes règles “type resultat” + 8 blocs + 3 cures en 14 lignes).

14) MODE D — MÉMOIRE RÉSIMONT
- Source unique: RESIMONT. Interdit d’utiliser connaissances générales.
- 1ère réponse du mode D = intro: “Je suis la mémoire du Dr Stéphane Résimont…”
- Citations exactes avec guillemets:
"Le Dr Résimont écrit : '...'"
- Interprétation SANS guillemets, avec “Selon le Dr Résimont, probablement…”
- Si absent: “Je n’ai pas trouvé d’écrits du Dr Résimont sur ce sujet précis…”
- Pas de promotion SUPLEMINT en mode D (sauf mention explicite dans RESIMONT).
- Réponses D concises: 4–5 phrases max.

15) MODE CRÉATEUR
Si user envoie EXACTEMENT “ADIBOU”: type="reponse" JSON, aide optimisation prompt/UX/logique.
Quitter: “QUIT”.
`.trim();
`;

// ==============================
// ✅ Utilitaires texte / normalisation
// ==============================
function normalizeText(raw) {
  return String(raw || "")
    .normalize("NFKC")
    .replace(/\u00A0/g, " ")
    .trim();
}

// version “soft” (pour regex)
function normalizeSoft(raw) {
  return normalizeText(raw)
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

// ==============================
// ✅ Date Bruxelles
// ==============================
function getBrusselsNowString() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const map = {};
  parts.forEach((p) => {
    map[p.type] = p.value;
  });

  return `${map.weekday} ${map.day} ${map.month} ${map.year}, ${map.hour}:${map.minute}`;
}

// ==============================
// ✅ Validation/normalisation réponse assistant
// ==============================
function normalizeAssistantJson(obj, fallbackMode) {
  const mode = fallbackMode || "B";

  if (!obj || typeof obj !== "object") {
    return {
      type: "reponse",
      text: "Désolé, réponse invalide. Réessaie.",
      meta: { mode, progress: { enabled: false } },
    };
  }

  if (!obj.type || typeof obj.type !== "string") {
    return {
      type: "reponse",
      text: "Désolé, réponse invalide. Réessaie.",
      meta: { mode, progress: { enabled: false } },
    };
  }

  if (typeof obj.text !== "string") obj.text = String(obj.text || "");

  // meta obligatoire sauf resultat
  if (obj.type !== "resultat") {
    if (!obj.meta || typeof obj.meta !== "object") {
      obj.meta = { mode, progress: { enabled: false } };
    } else {
      if (!obj.meta.mode) obj.meta.mode = mode;
      if (!obj.meta.progress || typeof obj.meta.progress !== "object") {
        obj.meta.progress = { enabled: false };
      }
      if (typeof obj.meta.progress.enabled !== "boolean") {
        obj.meta.progress.enabled = false;
      }
    }
  } else {
    // en resultat: pas de meta, pas de choices
    if ("meta" in obj) delete obj.meta;
    if ("choices" in obj) delete obj.choices;
  }

  return obj;
}

// ==============================
// ✅ Détection MODE (OPTIMISÉE)
// - Priorité 1 : payload exact (bouton)
// - Priorité 2 : si le front renvoie meta.mode dans l'historique assistant (si dispo)
// - Priorité 3 : intention (regex) sur le dernier message user
// - Priorité 4 : fallback B
// ==============================
const STARTERS = {
  A: "Quiz : Ma thyroïde fonctionne-t-elle normalement ?",
  C: "Quiz : Quelle cure est faite pour moi ?",
  B: "J'ai une question - SAV",
  D: "Qu'en pense le Dr Résimont ?",
};

function detectStarterMode(raw) {
  const msg = normalizeText(raw);
  if (msg === STARTERS.A) return "A";
  if (msg === STARTERS.C) return "C";
  if (msg === STARTERS.B) return "B";
  if (msg === STARTERS.D) return "D";
  return null;
}

// Tente de récupérer un mode “déjà en cours” via meta.mode si ton front renvoie les objets assistant complets.
// Si ton front ne renvoie que {role, content}, ça restera null (pas grave).
function detectModeFromHistoryMeta(messages) {
  try {
    const lastAssistant = [...messages].reverse().find((m) => (m.role || "") === "assistant");
    const metaMode = lastAssistant?.meta?.mode;
    return metaMode === "A" || metaMode === "B" || metaMode === "C" || metaMode === "D"
      ? metaMode
      : null;
  } catch {
    return null;
  }
}

// intention fallback (si l’utilisateur tape à la main)
function detectIntentMode(lastUserMsgRaw, historyText) {
  const last = normalizeSoft(lastUserMsgRaw);
  const lastLower = last.toLowerCase();

  // D : dès qu’on voit “Résimont” (avec/ sans Dr, avec point, etc.)
  const triggerModeD = /\br[ée]simont\b/i.test(lastUserMsgRaw);

  // C : “quelle cure”, “trouver la cure”, “cure faite pour moi”
  const triggerModeC =
    /quiz\s*:?\s*quelle\s+cure/.test(lastLower) ||
    /quelle\s+cure\s+est\s+faite\s+pour\s+moi/.test(lastLower) ||
    /trouver\s+(la\s+)?cure/.test(lastLower) ||
    /\bcure\b.*\bmoi\b/.test(lastLower);

  // A : “thyroïde fonctionne”, “test thyroïde”, “quiz thyroïde”
  const triggerModeA =
    /quiz\s*:?\s*ma\s+thyro[iï]de/.test(lastLower) ||
    /thyro[iï]de\s+fonctionne/.test(lastLower) ||
    /\btest\b.*\bthyro/i.test(lastLower);

  // “déjà lancé” via historique texte (fallback si pas de meta)
  const hist = String(historyText || "");
  const startedModeD = /je suis la m[ée]moire du dr.*r[ée]simont/i.test(hist);
  const startedModeC =
    /quelle cure est faite pour moi/i.test(hist) && /quel est ton pr[ée]nom/i.test(hist);
  const startedModeA =
    /ma thyro[iï]de fonctionne-t-elle normalement/i.test(hist) && /quel est ton pr[ée]nom/i.test(hist);

  // Priorité : D (si on cite Résimont) > C > A
  if (startedModeD || triggerModeD) return "D";
  if (startedModeC || triggerModeC) return "C";
  if (startedModeA || triggerModeA) return "A";
  return "B";
}

// ==============================
// ✅ Handler principal
// ==============================
export default async function handler(req, res) {
  // -------- CORS --------
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { messages, conversationId } = req.body || {};

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array" });
      return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY missing" });
      return;
    }

    // -------- Dernier message user --------
    const lastUserMsgRaw =
      String([...messages].reverse().find((m) => (m.role || "") === "user")?.content || "");

    // -------- Mode detection --------
    const starterMode = detectStarterMode(lastUserMsgRaw); // priorité absolue
    const historyMetaMode = detectModeFromHistoryMeta(messages); // si dispo
    const historyText = messages.map((m) => String(m.content || "")).join("\n");
    const intentMode = detectIntentMode(lastUserMsgRaw, historyText);

    // ✅ décision finale (ordre strict)
    // 1) bouton/payload exact
    // 2) mode meta (si ton front le renvoie)
    // 3) intention + historique text fallback
    const activeMode = starterMode || historyMetaMode || intentMode || "B";

    // -------- Systems --------
    const NOW_SYSTEM = `DATE ET HEURE SYSTÈME: ${getBrusselsNowString()} (Europe/Brussels)`;

    const ROUTER_SYSTEM =
      activeMode === "D" ? "MODE D ACTIF"
      : activeMode === "A" ? "MODE A ACTIF"
      : activeMode === "C" ? "MODE C ACTIF"
      : "MODE B ACTIF";

    // -------- DOCS système (scopé par mode) --------
    const DOCS_SYSTEM = `
DOCS SUPLEMINT
${activeMode === "A" ? `[QUESTION_THYROIDE]\n${QUESTION_THYROIDE}\n` : ""}
${activeMode === "C" ? `[QUESTION_ALL]\n${QUESTION_ALL}\n` : ""}
${activeMode !== "D" ? `[LES_CURES_ALL]\n${LES_CURES_ALL_TRUNC}\n[COMPOSITIONS]\n${COMPOSITIONS_TRUNC}\n` : ""}
${activeMode === "B" ? `[SAV_FAQ]\n${SAV_FAQ_TRUNC}\n` : ""}
${activeMode === "D" ? `[RESIMONT]\n${RESIMONT_TRUNC}\n` : ""}
`.trim();

    // -------- Messages OpenAI --------
    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: NOW_SYSTEM },
      { role: "system", content: ROUTER_SYSTEM },
      { role: "system", content: DOCS_SYSTEM },

      // On ne passe que content (string) à OpenAI, comme tu fais déjà.
      // (Si tu veux exploiter meta côté modèle, il faut l'inclure dans content, mais c’est un autre chantier.)
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })),
    ];

    // -------- Timeout fetch --------
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: openAiMessages,
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!oaRes.ok) {
      const errText = await oaRes.text();
      console.error("OpenAI error:", oaRes.status, errText);
      res.status(500).json({ error: "OpenAI API error", details: errText });
      return;
    }

    const oaData = await oaRes.json();

    const replyText = String(oaData?.choices?.[0]?.message?.content || "").trim();

    // -------- Parse JSON assistant --------
    let parsedReply;
    try {
      parsedReply = JSON.parse(replyText);
    } catch (e) {
      console.error("JSON parse assistant failed:", e, "RAW:", replyText);
      parsedReply = {
        type: "reponse",
        text: "Désolé, je n’ai pas pu générer une réponse valide. Peux-tu réessayer ?",
        meta: { mode: activeMode, progress: { enabled: false } },
      };
    }

    // -------- Normalisation minimale --------
    parsedReply = normalizeAssistantJson(parsedReply, activeMode);

    // ✅ Réponse front
    res.status(200).json({
      reply: parsedReply,
      conversationId: conversationId || null,
      mode: activeMode,
    });
  } catch (err) {
    console.error("THYREN error:", err);
    res.status(500).json({ error: "THYREN error", details: String(err) });
  }
}
