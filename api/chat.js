import fs from "fs";
import path from "path";

// ====== Lecture des fichiers DATA ======
const readDataFile = (filename) => {
  try {
    return fs.readFileSync(path.join(process.cwd(), "data", filename), "utf8");
  } catch (e) {
    return "";
  }
};

const readDataFolder = (folderName) => {
  try {
    const folderPath = path.join(process.cwd(), "data", folderName);
    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith(".") && fs.statSync(path.join(folderPath, f)).isFile()).sort();
    return files.map(f => `\n===== ${f} =====\n${fs.readFileSync(path.join(folderPath, f), "utf8")}`).join("").trim();
  } catch (e) {
    return "";
  }
};

// ====== DONNÉES ======
const QUESTION_THYROIDE = readDataFile("QUESTION_THYROIDE.txt");
const LES_CURES_ALL = readDataFile("LES_CURES_ALL.txt");
const COMPOSITIONS = readDataFile("COMPOSITIONS.txt");
const SAV_FAQ = readDataFile("SAV_FAQ.txt");
const QUESTION_ALL = readDataFile("QUESTION_ALL.txt");
const RESIMONT_TRUNC = String(readDataFolder("RESIMONT") || "").slice(0, 8000);

// ====== THYREN SYSTEM PROMPT V2.1 OPTIMISÉ ======
const SYSTEM_PROMPT = `Tu es Dr THYREN, expert en médecine fonctionnelle et micronutrition chez SUPLEMINT®.

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

# INGRÉDIENTS CLÉS
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
[vide]
Ligne 4: Pourquoi cette cure te correspond :
Ligne 5: 2-3 phrases cliniques (symptômes → axe → ingrédients → mécanisme)
[vide]
Ligne 6: Bénéfices fonctionnels attendus :
Ligne 7: Timeline + "Des effets peuvent se faire ressentir à partir du JJ/MM/AAAA si vous commandez aujourd'hui."
[vide]
Ligne 8: Conseils de prise (posologie) :
Ligne 9-11: Durée, moment, composition
[vide]
Ligne 12: [Commander ma cure](checkout:{{variant_id}}) [Ajouter au panier](addtocart:{{variant_id}}) [En savoir plus]({{product_url}})

# MODE A — QUIZ THYROÏDE
Amorce : "Est-ce que j'ai des symptômes d'hypothyroïdie ?"
Suit QUESTION_THYROIDE.txt strictement.
Résultat : 8 blocs.

# MODE C — TROUVER LA CURE
Amorce : "Trouver la cure dont j'ai besoin"
Phase 1 : Q1 prénom → Q2 sexe → Q2_plus enceinte? → Q3 âge → Q4 allergies
Phase 2 : Q5 plainte ouverte
Phase 3 : 5-10 questions cliniques INTELLIGENTES pour identifier l'axe
Phase 4 : Email → Résultats 8 blocs

# MODE B — QUESTIONS LIBRES
Amorce : "J'ai une question"
Écoute → Empathie → Analyse → Solution cure (format 5.6)

# RÉSULTATS (8 BLOCS séparés par ===BLOCK===)
Bloc 1: Résumé clinique
Bloc 2: 5 fonctions avec %
Bloc 3: Cure essentielle
Bloc 4: Cure soutien
Bloc 5: Cure confort
Bloc 6: Contre-indications
Bloc 7: [Prendre rendez-vous](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)
Bloc 8: Mention légale`;

function getBrusselsNowString() {
  const parts = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels", weekday: "long", year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date());
  const m = {};
  parts.forEach(p => m[p.type] = p.value);
  return `${m.weekday} ${m.day} ${m.month} ${m.year}, ${m.hour}:${m.minute}`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method Not Allowed" }); return; }

  // Redis presence (optionnel)
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      const pid = req.body?.conversationId || `anon:${Math.random().toString(36).slice(2, 10)}`;
      fetch(`${url.replace(/\/$/, "")}/set/online:${pid}/1?ex=60`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  } catch (_) {}

  try {
    const { messages, conversationId, stream: enableStream } = req.body || {};
    if (!Array.isArray(messages)) { res.status(400).json({ error: "messages must be an array" }); return; }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) { res.status(500).json({ error: "OPENAI_API_KEY missing" }); return; }

    // Détection mode
    const lastUserMsg = String([...messages].reverse().find(m => m.role === "user")?.content || "").normalize("NFKC").replace(/\u00A0/g, " ").replace(/[']/g, "'").trim().toLowerCase();
    const triggerModeC = /trouver\s+(la\s+)?cure/.test(lastUserMsg) || /cure.*besoin/.test(lastUserMsg);
    const triggerModeA = /sympt[oô]mes.*hypothyro/.test(lastUserMsg) || /est[-\s]*ce\s+que.*hypothyro/.test(lastUserMsg);
    const historyText = messages.map(m => String(m.content || "")).join("\n");
    const startedModeC = /comprendre ta situation/i.test(historyText) && /prénom/i.test(historyText);
    const startedModeA = /fonctionnement.*thyro/i.test(historyText) && /prénom/i.test(historyText);
    const activeMode = triggerModeC || (startedModeC && !startedModeA) ? "C" : triggerModeA || (startedModeA && !startedModeC) ? "A" : null;

    // Construction contexte
    const NOW_SYSTEM = `Date: ${getBrusselsNowString()} (Europe/Brussels)`;
    const ROUTER_SYSTEM = activeMode === "C" ? "MODE C ACTIF. Suis QUESTION_ALL strictement." : activeMode === "A" ? "MODE A ACTIF. Suis QUESTION_THYROIDE strictement." : "";
    
    let DOCS = `[LES_CURES_ALL]\n${LES_CURES_ALL}\n\n[COMPOSITIONS]\n${COMPOSITIONS}\n`;
    if (activeMode === "A") DOCS = `[QUESTION_THYROIDE]\n${QUESTION_THYROIDE}\n\n` + DOCS;
    else if (activeMode === "C") DOCS = `[QUESTION_ALL]\n${QUESTION_ALL}\n\n` + DOCS;
    if (!activeMode || /livraison|retour|paiement|commande/i.test(lastUserMsg)) DOCS += `\n[SAV_FAQ]\n${SAV_FAQ}`;
    if (/résimont|docteur|scientifique|étude/i.test(lastUserMsg)) DOCS += `\n[RESIMONT]\n${RESIMONT_TRUNC}`;

    const openAiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: NOW_SYSTEM },
      ...(ROUTER_SYSTEM ? [{ role: "system", content: ROUTER_SYSTEM }] : []),
      { role: "system", content: DOCS },
      ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "") }))
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    // ⚡⚡⚡ MODE STREAMING ⚡⚡⚡
    if (enableStream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      try {
        const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: openAiMessages,
            temperature: 0,
            max_tokens: 4096,
            stream: true
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!oaRes.ok) {
          const errText = await oaRes.text();
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
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                fullContent += content;
                res.write(`data: ${JSON.stringify({ chunk: content, partial: true })}\n\n`);
              }
            } catch (e) {}
          }
        }

        res.write(`data: ${JSON.stringify({ reply: fullContent, done: true, conversationId })}\n\n`);
        res.end();

      } catch (err) {
        clearTimeout(timeoutId);
        res.write(`data: ${JSON.stringify({ error: err.name === "AbortError" ? "Timeout" : String(err) })}\n\n`);
        res.end();
      }
      return;
    }

    // ⚡ MODE CLASSIQUE (NON-STREAMING)
    try {
      const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: openAiMessages,
          response_format: { type: "json_object" },
          temperature: 0,
          max_tokens: 4096
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!oaRes.ok) {
        const errText = await oaRes.text();
        res.status(500).json({ error: "OpenAI error", details: errText });
        return;
      }

      const oaData = await oaRes.json();
      const reply = String(oaData.choices?.[0]?.message?.content || "").trim();

      res.status(200).json({ reply, conversationId: conversationId || null });

    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        res.status(504).json({ error: "Timeout" });
      } else {
        throw err;
      }
    }

  } catch (err) {
    console.error("THYREN error:", err);
    res.status(500).json({ error: "THYREN error", details: String(err) });
  }
}
