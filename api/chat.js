import fs from "fs";
import path from "path";

// ====== Lecture des fichiers DATA depuis /data ======
const readDataFile = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error("Erreur lecture fichier", filename, e);
    return "";
  }
};

const QUESTION_THYREN = readDataFile("QUESTION_THYREN.txt");
const LES_CURES_ALL = readDataFile("LES_CURES_ALL.txt");
const COMPOSITIONS = readDataFile("COMPOSITIONS.txt");
const SAV_FAQ = readDataFile("SAV_FAQ.txt");

// ====== Mémoire simple en RAM (par conversationId) ======
// (suffisant pour commencer; sur Vercel ça peut reset parfois, mais ça aide déjà beaucoup)
const memory = globalThis.__THYREN_MEMORY__ || new Map();
globalThis.__THYREN_MEMORY__ = memory;

// 🔐 Prompt système THYREN (TON TEXTE EXACT)
const SYSTEM_PROMPT = `
SCRIPT THYREN 0.8.4 — VERSION JSON UNIQUEMENT
1. RÔLE & TON GÉNÉRAL
Tu es THYREN, l’IA scientifique de SUPLEMINT®.
Ton rôle est d’accompagner chaque utilisateur pas à pas pour lui suggérer la ou les cures SUPLEMINT® les plus adaptées à son profil, en commençant par la cure essentielle Thyroïde, puis par les cures complémentaires.
Tu vouvoie naturellement.
Ton ton est professionnel, doux, clair, humain, avec une pointe d’humour quand c’est approprié.
Tes phrases sont courtes, dynamiques, faciles à lire.
Jamais d’emojis.
Tu utilises toujours le terme « hypothyroïdie fonctionnelle », jamais « fruste ».


2. FORMAT TECHNIQUE OBLIGATOIRE (TRÈS IMPORTANT)
2.1. Bases
Quelle que soit la situation (quiz, question libre, analyse finale, etc.) tu dois répondre UNIQUEMENT avec un seul objet JSON, utilise toujours ce format :
{
  "type": "question",
  "text": "Ton texte ici...",
  "choices": ["Choix 1", "Choix 2"]
}
ou 
{
  "type": "reponse",
  "text": "Ton texte ici..."
}
ou
{
  "type": "resultat",
  "text": "… ton analyse et tes recommandations …"
  "choices": ["Recommencer le quiz", "J’ai une question ?"]
}
2.2. Champs
type : 
"question" → tu poses une question à l’utilisateur.
"reponse" → tu expliques, analyses, tu donne un résultat ou réponds en mode conseil.
text : 
Contient tout le texte que l’utilisateur doit lire : interprétation personnalisée de la réponse précédente, explication scientifique, contexte, question, résumé, recommandations, transparence, etc.
Si tu veux expliquer quelque chose, tu l’écris directement dans text.
choices (facultatif) : 
- Tu l’utilises uniquement quand tu proposes des réponses cliquables.
- C’est un tableau de chaînes : ["Choix 1", "Choix 2", "Choix 3"].
 - Si la question est ouverte (prénom, email, question libre, précision écrite,        etc.), tu ne mets pas de champ “choices”.
`;

// 🔧 Handler Vercel pour /api/chat
export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

    // ✅ Sécurité : data bien chargée
    if (!QUESTION_THYREN || QUESTION_THYREN.length < 100) {
      res.status(500).json({ error: "QUESTION_THYREN vide côté serveur" });
      return;
    }

    const cid = conversationId || "no-conversation-id";
    const state = memory.get(cid) || { mode: "idle" };

    // Detect intention
    const lastUserMsg =
      [...messages].reverse().find((m) => m?.role === "user")?.content || "";
    const txt = String(lastUserMsg || "").toLowerCase();

    // Mode switch
    if (txt.includes("commencer le quiz") || txt.includes("commencer le test") || txt.includes("commencer quiz")) {
      state.mode = "quiz";
    }
    if (txt.includes("j’ai une question") || txt.includes("j'ai une question")) {
      state.mode = "qa";
    }
    if (txt.includes("recommencer le quiz") || txt.includes("refaire le test") || txt.includes("on repart de zéro")) {
      state.mode = "quiz";
    }

    memory.set(cid, state);

    // ✅ On n’envoie PAS tous les docs tout le temps
    // - Quiz: seulement QUESTION_THYREN
    // - QA / résultat: cures + compositions + faq
    let DOCS_SYSTEM = "";

    if (state.mode === "quiz") {
      DOCS_SYSTEM = `
MODE QUIZ — TU DOIS SUIVRE STRICTEMENT [QUESTION_THYREN], DANS L’ORDRE, 1 QUESTION À LA FOIS.
Tu ne peux pas improviser. Tu ne peux pas sauter de question.
Si l’utilisateur répond, tu passes à la question suivante du document.

[QUESTION_THYREN]
${QUESTION_THYREN}
`;
    } else {
      DOCS_SYSTEM = `
MODE CONSEIL / FAQ — Tu t’appuies sur les documents suivants, sans rien inventer :

[LES_CURES_ALL]
${LES_CURES_ALL}

[COMPOSITIONS]
${COMPOSITIONS}

[SAV_FAQ]
${SAV_FAQ}
`;
    }

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: DOCS_SYSTEM },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })),
    ];

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
        temperature: 0.2,
      }),
    });

    if (!oaRes.ok) {
      const errText = await oaRes.text();
      res.status(500).json({ error: "OpenAI API error", details: errText });
      return;
    }

    const oaData = await oaRes.json();
    const reply = oaData.choices?.[0]?.message?.content || "";

    res.status(200).json({
      reply,
      conversationId: cid,
      mode: state.mode,
    });
  } catch (err) {
    console.error("THYREN OpenAI proxy error:", err);
    res.status(500).json({ error: "THYREN OpenAI proxy error" });
  }
}
