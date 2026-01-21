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
        return `\n===== ${filename} =====\n${content}`;
      })
      .join("")
      .trim();
  } catch (e) {
    return "";
  }
};

// ====== CHARGEMENT DES DONNÉES ======
const QUESTION_THYROIDE = readDataFile("QUESTION_THYROIDE.txt");
const LES_CURES_ALL = readDataFile("LES_CURES_ALL.txt");
const COMPOSITIONS = readDataFile("COMPOSITIONS.txt");
const SAV_FAQ = readDataFile("SAV_FAQ.txt");
const QUESTION_ALL = readDataFile("QUESTION_ALL.txt");
const RESIMONT = readDataFolder("RESIMONT");
const RESIMONT_TRUNC = String(RESIMONT || "").slice(0, 8000);

// ====== THYREN SYSTEM PROMPT V2.1 — OPTIMISÉ ======
const SYSTEM_PROMPT = `
Tu es Dr THYREN, expert en médecine fonctionnelle et micronutrition chez SUPLEMINT®.

# IDENTITÉ
- Pense en physiopathologie : symptômes → mécanisme → solution
- Ton chaleureux, empathique, expert mais vulgarisé
- Vouvoiement bienveillant, jamais d'emojis
- Terme correct : "hypothyroïdie fonctionnelle" (jamais "fruste")
- Tu ne poses jamais de diagnostic médical, tu parles de "soutien fonctionnel"

# MÉMOIRE
Ne JAMAIS redemander : prénom, sexe, âge, grossesse/allaitement, allergies, email déjà donnés.

# 6 AXES FONCTIONNELS
1. ÉNERGÉTIQUE : ATP, mitochondries → CoQ10, L-Carnitine, Magnésium → Cures ÉNERGIE, SPORT
2. THYROÏDIEN : T4→T3 (désiodase) → Iode, Sélénium, Guggul, L-Tyrosine → Cure THYROÏDE
3. SURRÉNALIEN (HHS) : cortisol, stress → Ashwagandha, Magnésium, GABA → Cures ZÉNITUDE, SOMMEIL
4. DIGESTIF : microbiote, perméabilité → Probiotiques, Enzymes → Cures INTESTIN, DÉTOX
5. INFLAMMATOIRE : stress oxydatif → Curcuma, Oméga-3, Quercétine → Cures ANTIOXYDANT, ARTICULATION
6. HORMONAL : œstrogènes/progestérone → Yam, Maca → Cures MÉNOPAUSE, HOMME+

# INGRÉDIENTS CLÉS (à citer dans recommandations)
- CoQ10 : chaîne respiratoire mitochondriale, production ATP
- Guggul : stimule 5'-désiodase (T4→T3)
- Ashwagandha : module axe HHS, réduit cortisol
- L-Tyrosine : précurseur hormones thyroïdiennes + catécholamines
- Magnésium : 300+ réactions, cycle de Krebs, GABA
- Sélénium : cofacteur désiodases, protège thyroïde
- Probiotiques : barrière intestinale, sérotonine

# FORMAT JSON OBLIGATOIRE
Réponds UNIQUEMENT en JSON valide :
{"type":"question","text":"...","choices":["..."],"meta":{"mode":"A|B|C","progress":{"enabled":true|false,"current":N,"total":N}}}
ou
{"type":"reponse","text":"...","choices":["..."],"meta":{"mode":"B","progress":{"enabled":false}}}
ou
{"type":"resultat","text":"...8 blocs séparés par ===BLOCK===..."}

INTERDICTIONS : rien avant/après JSON, pas de "Choisis une option", pas de HTML.

# PRÉSENTATION CURE (format 5.6)
Ligne 1: URL image
Ligne 2: NOM CURE
Ligne 3: Compatibilité : XX %
[ligne vide]
Ligne 4: Pourquoi cette cure te correspond :
Ligne 5: 2-3 phrases cliniques (symptômes → axe → ingrédients → mécanisme)
[ligne vide]
Ligne 6: Bénéfices fonctionnels attendus :
Ligne 7: Timeline + "Des effets peuvent se faire ressentir à partir du JJ/MM/AAAA si vous commandez aujourd'hui."
[ligne vide]
Ligne 8: Conseils de prise (posologie) :
Ligne 9-11: Durée, moment, composition
[ligne vide]
Ligne 12: [Commander ma cure](checkout:{{variant_id}}) [Ajouter au panier](addtocart:{{variant_id}}) [En savoir plus]({{product_url}})

# MODE A — QUIZ THYROÏDE
Amorce : "Est-ce que j'ai des symptômes d'hypothyroïdie ?"
Suit QUESTION_THYROIDE.txt strictement. Chaque question : écoute active + empathie + lien physiopathologique thyroïdien.
Résultat : 8 blocs (résumé clinique, 5 fonctions %, cure essentielle, soutien, confort, contre-indications, nutritionniste, mention légale).

# MODE C — TROUVER LA CURE
Amorce : "Trouver la cure dont j'ai besoin"
Phase 1 : Q1 prénom → Q2 sexe → Q2_plus enceinte? → Q3 âge → Q4 allergies
Phase 2 : Q5 plainte ouverte
Phase 3 : 2-4 questions cliniques INTELLIGENTES pour identifier l'axe (écoute + empathie + mécanisme)
Phase 4 : Email → Résultats 8 blocs

# MODE B — QUESTIONS LIBRES
Amorce : "J'ai une question"
Logique : Écoute → Empathie → Analyse axe → Éducation mécanisme → Solution cure (format 5.6) → Choices pertinents

# RÉSULTATS (8 BLOCS)
Bloc 1: Résumé clinique (empathie + symptômes → mécanismes)
Bloc 2: "Ces pourcentages indiquent le degré de soutien..." + 5 fonctions avec %
Bloc 3: Cure essentielle (format 5.6)
Bloc 4: Cure soutien (format 5.6)
Bloc 5: Cure confort (format 5.6)
Bloc 6: Contre-indications (si applicable)
Bloc 7: [Prendre rendez-vous avec une nutritionniste](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)
Bloc 8: Mention légale

# ANTI-PATTERNS
❌ Redemander info déjà donnée
❌ "Merci pour cette précision" sans reformuler
❌ Cure sans expliquer ingrédients
❌ "Choisis une option" dans le texte
❌ Diagnostic médical
`;

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
  parts.forEach((p) => { map[p.type] = p.value; });
  return `${map.weekday} ${map.day} ${map.month} ${map.year}, ${map.hour}:${map.minute}`;
}

// ====== HANDLER PRINCIPAL AVEC STREAMING ======
export default async function handler(req, res) {
  // CORS
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

  // Présence Redis (optionnel)
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      const presenceId = req.body?.conversationId || `anon:${Math.random().toString(36).slice(2, 10)}`;
      fetch(`${url.replace(/\/$/, "")}/set/online:${presenceId}/1?ex=60`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  } catch (_) {}

  try {
    const { messages, conversationId, stream: enableStream } = req.body || {};

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array" });
      return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY missing" });
      return;
    }

    // ====== DÉTECTION DU MODE ======
    const lastUserMsgRaw = String(
      [...messages].reverse().find((m) => m.role === "user")?.content || ""
    );
    const lastUserMsg = lastUserMsgRaw.normalize("NFKC").replace(/\u00A0/g, " ").replace(/[']/g, "'").trim().toLowerCase();

    const triggerModeC = /trouver\s+(la\s+)?cure/.test(lastUserMsg) || /cure.*besoin/.test(lastUserMsg);
    const triggerModeA = /sympt[oô]mes.*hypothyro/.test(lastUserMsg) || /est[-\s]*ce\s+que.*hypothyro/.test(lastUserMsg);

    const historyText = messages.map((m) => String(m.content || "")).join("\n");
    const startedModeC = /comprendre ta situation/i.test(historyText) && /prénom/i.test(historyText);
    const startedModeA = /fonctionnement.*thyro/i.test(historyText) && /prénom/i.test(historyText);

    const activeMode = triggerModeC || (startedModeC && !startedModeA) ? "C"
      : triggerModeA || (startedModeA && !startedModeC) ? "A"
      : null;

    // ====== CONSTRUCTION DU CONTEXTE ======
    const NOW_SYSTEM = `Date: ${getBrusselsNowString()} (Europe/Brussels)`;

    const ROUTER_SYSTEM = activeMode === "C"
      ? "MODE C ACTIF. Suis QUESTION_ALL: Q1→Q2→Q2_plus→Q3→Q4→Q5→Questions cliniques→Email→RESULT."
      : activeMode === "A"
      ? "MODE A ACTIF. Suis QUESTION_THYROIDE strictement jusqu'à RESULT."
      : "";

    let DOCS_SYSTEM = `[LES_CURES_ALL]\n${LES_CURES_ALL}\n\n[COMPOSITIONS]\n${COMPOSITIONS}\n`;
    
    if (activeMode === "A") {
      DOCS_SYSTEM = `[QUESTION_THYROIDE]\n${QUESTION_THYROIDE}\n\n` + DOCS_SYSTEM;
    } else if (activeMode === "C") {
      DOCS_SYSTEM = `[QUESTION_ALL]\n${QUESTION_ALL}\n\n` + DOCS_SYSTEM;
    }
    
    if (!activeMode || /livraison|retour|paiement|commande/i.test(lastUserMsg)) {
      DOCS_SYSTEM += `\n[SAV_FAQ]\n${SAV_FAQ}`;
    }
    
    if (/résimont|docteur|scientifique|étude/i.test(lastUserMsg)) {
      DOCS_SYSTEM += `\n[RESIMONT]\n${RESIMONT_TRUNC}`;
    }

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: NOW_SYSTEM },
      ...(ROUTER_SYSTEM ? [{ role: "system", content: ROUTER_SYSTEM }] : []),
      { role: "system", content: DOCS_SYSTEM },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })),
    ];

    // ====== MODE STREAMING ======
    if (enableStream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      try {
        const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: openAiMessages,
            temperature: 0,
            max_tokens: 4096,
            stream: true, // ⚡ STREAMING ACTIVÉ
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!oaRes.ok) {
          const errText = await oaRes.text();
          console.error("OpenAI stream error:", oaRes.status, errText);
          res.write(`data: ${JSON.stringify({ error: "OpenAI error", details: errText })}\n\n`);
          res.end();
          return;
        }

        const reader = oaRes.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6); // Remove "data: "
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                fullContent += content;
                // Envoie le chunk au client
                res.write(`data: ${JSON.stringify({ chunk: content, partial: true })}\n\n`);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }

        // Envoie le résultat final complet
        res.write(`data: ${JSON.stringify({ reply: fullContent, done: true, conversationId: conversationId || null })}\n\n`);
        res.end();

      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr.name === "AbortError") {
          res.write(`data: ${JSON.stringify({ error: "Timeout" })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: String(fetchErr) })}\n\n`);
        }
        res.end();
      }

      return;
    }

    // ====== MODE CLASSIQUE (NON-STREAMING) ======
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    try {
      const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: openAiMessages,
          response_format: { type: "json_object" },
          temperature: 0,
          max_tokens: 4096,
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
      const reply = oaData.choices?.[0]?.message?.content || "";
      const replyText = String(reply || "").trim();

      res.status(200).json({
        reply: replyText,
        conversationId: conversationId || null,
      });

    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === "AbortError") {
        console.error("OpenAI timeout after 55s");
        res.status(504).json({ error: "Timeout - génération trop longue" });
      } else {
        throw fetchErr;
      }
    }

  } catch (err) {
    console.error("THYREN error:", err);
    res.status(500).json({ error: "THYREN error", details: String(err) });
  }
}
