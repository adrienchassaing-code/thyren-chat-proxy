import fs from "fs";
import path from "path";

// ====== Lecture des fichiers DATA depuis /data ======
const readDataFile = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return "";
  }
};

const QUESTION_THYREN = readDataFile("QUESTION_THYREN.txt");
const LES_CURES_ALL = readDataFile("LES_CURES_ALL.txt");
const COMPOSITIONS = readDataFile("COMPOSITIONS.txt");
const SAV_FAQ = readDataFile("SAV_FAQ.txt");

// ====== Helpers “Chatbase-like” (pour éviter un prompt énorme) ======
function lastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === "user") return String(messages[i]?.content || "");
  }
  return "";
}

function clip(text, maxChars = 12000) {
  if (!text) return "";
  return text.length > maxChars ? text.slice(0, maxChars) + "\n...[TRONQUÉ]..." : text;
}

function shouldUseFAQ(text) {
  return /livraison|retour|remboursement|abonnement|paiement|commande|sav|faq|support/i.test(text);
}

function shouldUseCompositions(text) {
  return /composition|ingr[eé]dient|dosage|g[ée]lule|allerg|iode|selen|zinc|fer|vitamine/i.test(text);
}

function shouldUseCures(text) {
  return /cure|produit|prendre|posologie|combiner|pack|thyro|thyro[iï]de/i.test(text);
}

// 🔐 Base règles THYREN (ton script, sans les gros docs)
const BASE_RULES = `
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
Quelle que soit la situation, tu dois répondre UNIQUEMENT avec un seul objet JSON valide.
Formats autorisés :
{
  "type": "question",
  "text": "…",
  "choices": ["…"]
}
ou
{
  "type": "reponse",
  "text": "…"
}
ou
{
  "type": "resultat",
  "text": "…",
  "choices": ["Recommencer le quiz", "J’ai une question ?"]
}
Interdictions strictes :
Rien avant le JSON. Rien après le JSON. Un seul objet JSON.

3. BASE DE CONNAISSANCES & VÉRACITÉ
Tu t’appuies exclusivement sur les documents fournis dans la section “DOCS FOURNIS”.
Tu ne crées, n’inventes ni ne modifies aucune cure, composition, formule, ingrédient ou dosage.
Si une info n’existe pas : "Cette information n’apparaît pas dans la base de données SUPLEMINT®."

4. MODE A — AMORCE « COMMENCER LE QUIZ »
Quand l’utilisateur demande le test, tu suis STRICTEMENT l’ordre de QUESTION_THYREN, une seule question à la fois, et tu donnes les résultats à la fin.

5. MODE B — AMORCE « J’AI UNE QUESTION »
Tu réponds clairement, orienté solution, sans diagnostic médical. Respecte les docs fournis.
`.trim();

// 🔧 Handler Vercel pour /api/chat
export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Réponse au preflight CORS
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

    // ====== On construit un prompt dynamique (comme Chatbase) ======
    const userText = lastUserText(messages);

    // QUESTION_THYREN toujours présent pour que le quiz ne casse jamais
    let docs = `
[QUESTION_THYREN]
${clip(QUESTION_THYREN, 14000)}
`.trim();

    // On n’ajoute les gros docs QUE si besoin
    if (shouldUseFAQ(userText)) {
      docs += `\n\n[SAV_FAQ]\n${clip(SAV_FAQ, 12000)}`;
    }
    if (shouldUseCompositions(userText)) {
      docs += `\n\n[COMPOSITIONS]\n${clip(COMPOSITIONS, 12000)}`;
    }
    if (shouldUseCures(userText)) {
      docs += `\n\n[LES_CURES_ALL]\n${clip(LES_CURES_ALL, 12000)}`;
    }

    const SYSTEM_PROMPT = `${BASE_RULES}

===== DOCS FOURNIS =====
${docs}
===== FIN DOCS =====

Rappel: réponds uniquement avec 1 objet JSON valide.
`;

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
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
      console.error("OpenAI error:", oaRes.status, errText);
      res.status(500).json({ error: "OpenAI API error", details: errText });
      return;
    }

    const oaData = await oaRes.json();
    const reply = oaData.choices?.[0]?.message?.content || "";

    res.status(200).json({
      reply,
      conversationId: conversationId || null,
    });
  } catch (err) {
    console.error("THYREN OpenAI proxy error:", err);
    res.status(500).json({ error: "THYREN OpenAI proxy error" });
  }
}
