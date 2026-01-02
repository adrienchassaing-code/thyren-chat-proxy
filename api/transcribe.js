// api/transcribe.js
export default async function handler(req, res) {
  // CORS (Shopify -> Vercel)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ ok: false, error: "OPENAI_API_KEY missing" });
    }

    // Shopify enverra : { audioBase64: "...", mimeType: "audio/webm" }
    const { audioBase64, mimeType } = req.body || {};
    if (!audioBase64) {
      return res.status(400).json({ ok: false, error: "Missing audioBase64" });
    }

    const audioBuffer = Buffer.from(String(audioBase64), "base64");
    const type = mimeType || "audio/webm";

    // Construire le multipart/form-data vers OpenAI
    const form = new FormData();
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("language", "fr");
    form.append("response_format", "json");

    const blob = new Blob([audioBuffer], { type });
    form.append("file", blob, "dictation.webm");

    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("OpenAI STT error:", r.status, t);
      return res.status(500).json({ ok: false, error: "OpenAI STT error", details: t });
    }

    const j = await r.json();
    return res.status(200).json({ ok: true, text: j.text || "" });
  } catch (e) {
    console.error("transcribe error:", e);
    return res.status(500).json({ ok: false, error: "Transcription failed" });
  }
}
