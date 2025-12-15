import fs from "fs";
import path from "path";

const safeRead = (p) => {
  try { return fs.readFileSync(p, "utf8"); } catch (e) { return null; }
};

export default function handler(req, res) {
  // Autoriser GET depuis navigateur
  res.setHeader("Access-Control-Allow-Origin", "*");

  const cwd = process.cwd();

  const dataDir = path.join(cwd, "data");
  let dataDirExists = false;
  let dataDirFiles = [];
  try {
    dataDirExists = fs.existsSync(dataDir);
    if (dataDirExists) dataDirFiles = fs.readdirSync(dataDir);
  } catch (e) {}

  const qPath = path.join(dataDir, "QUESTION_THYREN.txt");
  const cPath = path.join(dataDir, "LES_CURES_ALL.txt");
  const compPath = path.join(dataDir, "COMPOSITIONS.txt");
  const faqPath = path.join(dataDir, "SAV_FAQ.txt");

  const q = safeRead(qPath) || "";
  const c = safeRead(cPath) || "";
  const comp = safeRead(compPath) || "";
  const faq = safeRead(faqPath) || "";

  res.status(200).json({
    ok: true,
    cwd,
    dataDir,
    dataDirExists,
    dataDirFiles,
    files: {
      "QUESTION_THYREN.txt": { exists: fs.existsSync(qPath), len: q.length },
      "LES_CURES_ALL.txt": { exists: fs.existsSync(cPath), len: c.length },
      "COMPOSITIONS.txt": { exists: fs.existsSync(compPath), len: comp.length },
      "SAV_FAQ.txt": { exists: fs.existsSync(faqPath), len: faq.length },
    }
  });
}
