import { useState } from "react";
import { SYMPTOMS } from "../data/symptoms";

const LANGS = [
  { code: "ta", speech: "ta-IN", label: "Tamil" },
  { code: "hi", speech: "hi-IN", label: "Hindi" },
  { code: "te", speech: "te-IN", label: "Telugu" },
  { code: "kn", speech: "kn-IN", label: "Kannada" },
  { code: "ml", speech: "ml-IN", label: "Malayalam" },
  { code: "en", speech: "en-IN", label: "English" },
];

const SAMPLES = {
  ta: "எனக்கு தலைவலி இருக்கு, பார்வை மங்கலா இருக்கு, குழந்தை அசைவு குறைவா இருக்கு",
  hi: "मुझे सिरदर्द है, धुंधला दिखता है और बुखार भी है",
  te: "నాకు తలనొప్పి ఉంది",
  kn: "ನನಗೆ ತಲೆನೋವು ಇದೆ",
  ml: "എനിക്ക് തലവേദന ഉണ്ട്",
  en: "I have a severe headache, blurred vision and swelling in my hands",
};

const KEYWORDS = {
  fits: ["fits", "convulsion", "seizure", "வலிப்பு", "दौरे", "झटके"],
  bleeding: ["bleeding", "இரத்தப்போக்கு", "ரத்தப்போக்கு", "रक्तस्राव", "खून बह"],
  headache: ["headache", "head pain", "தலைவலி", "தலை வலி", "सिरदर्द", "सिर दर्द", "తలనొప్పి", "ತಲೆನೋವು", "തലവേദന"],
  vision: ["blurred", "blurry", "vision", "மங்கல", "பார்வை", "धुंधल"],
  movement: ["not moving", "less movement", "அசைவு", "हलचल", "बच्चा हिल"],
  pain: ["stomach pain", "abdominal pain", "வயிற்று வலி", "வயிறு வலி", "पेट दर्द", "पेट में दर्द"],
  breath: ["breath", "மூச்சு", "सांस"],
  swelling: ["swelling", "swollen", "வீக்கம்", "வீங்கி", "सूजन"],
  fever: ["fever", "காய்ச்சல்", "बुखार"],
  vomiting: ["vomit", "வாந்தி", "उल्टी"],
};

// Detects language from the script of the transcript
function detectLanguage(text) {
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml";
  return "en";
}

// Free demo translation service. A production build would use a paid Translation API.
async function translate(text, from, to) {
  if (from === to) return text;
  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) + "&langpair=" + from + "|" + to;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData.translatedText;
  } catch (e) {
    return "(translation unavailable)";
  }
}

function findSymptoms(text) {
  const t = text.toLowerCase();
  return Object.keys(KEYWORDS).filter((id) =>
    KEYWORDS[id].some((k) => t.includes(k))
  );
}

const langName = (code) => LANGS.find((l) => l.code === code)?.label || code;

export default function VoiceInput({ onSymptoms }) {
  const [nativeCode, setNativeCode] = useState("ta");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const process = async (text) => {
    setBusy(true);
    const detected = detectLanguage(text);
    const english = await translate(text, detected, "en");
    const native = await translate(text, detected, nativeCode);
    const ids = findSymptoms(text + " " + english);
    setResult({ text, detected, english, native, ids });
    onSymptoms(ids);
    setBusy(false);
  };

  const startListening = () => {
    setError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError("Voice input needs Chrome or Edge. Use the demo phrase button instead.");
    const rec = new SR();
    rec.lang = LANGS.find((l) => l.code === nativeCode).speech;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setError("Could not hear you. Check mic permission or try the demo phrase.");
    rec.onresult = (e) => process(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: 4 }}>🎤 Speak your symptoms</h3>
      <p className="note" style={{ marginBottom: 12, marginTop: 0 }}>
        Speak in your own language. SafeMatri detects the language, translates it to English
        and your language, and fills in the symptoms for you.
      </p>

      <div className="field">
        <label>Her language</label>
        <select value={nativeCode} onChange={(e) => setNativeCode(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid var(--border)", width: "100%" }}>
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      <button className="btn" onClick={startListening} disabled={listening || busy}>
        {listening ? "Listening..." : busy ? "Translating..." : "Start speaking"}
      </button>{" "}
      <button className="btn secondary" onClick={() => process(SAMPLES[nativeCode])} disabled={busy}>
        Try demo phrase
      </button>

      {error && <p style={{ color: "var(--high)", marginTop: 12 }}>{error}</p>}

      {result && (
        <div className="alert-box" style={{ background: "var(--pink-light)", borderColor: "var(--pink)" }}>
          <p><strong>Heard:</strong> {result.text}</p>
          <p><strong>Language detected:</strong> {langName(result.detected)}</p>
          <p><strong>English:</strong> {result.english}</p>
          <p><strong>{langName(nativeCode)}:</strong> {result.native}</p>
          <p><strong>Symptoms found:</strong>{" "}
            {result.ids.length === 0
              ? "none, please tick manually below"
              : result.ids.map((id) => SYMPTOMS.find((s) => s.id === id).label).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}