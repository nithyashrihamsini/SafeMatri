import { useEffect, useState } from "react";
import { getWomen, submitScreening } from "./api/client";
import { SYMPTOMS } from "./data/symptoms";

const LANGS = ["Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "English"];
const DEMO = "My head is paining a lot and my vision is blurry";
const danger = new Set(["fits", "bleeding", "breath"]);
const labelFor = (id) => SYMPTOMS.find((item) => item.id === id)?.label || id;

function localRisk(ids) {
  const score = ids.reduce((total, id) => total + (SYMPTOMS.find((item) => item.id === id)?.weight || 0), 0);
  const high = ids.some((id) => danger.has(id)) || score >= 6;
  return { level: high ? "High" : score >= 3 ? "Medium" : "Low", score: Math.min(score, 10) };
}

function findSymptoms(text) {
  const value = text.toLowerCase();
  const terms = {
    fits: ["fit", "convuls", "seizure"], bleeding: ["bleed", "blood"], headache: ["headache", "head pain", "head is paining", "head paining"],
    vision: ["blur", "vision", "spots"], movement: ["baby", "moving", "kicking"], pain: ["stomach pain", "belly pain"],
    breath: ["breath", "gasp"], swelling: ["swelling", "swollen", "puffy"], fever: ["fever", "shiver"], vomiting: ["vomit", "nause"],
  };
  return Object.entries(terms).filter(([, words]) => words.some((word) => value.includes(word))).map(([id]) => id);
}

function Button({ children, variant = "primary", ...props }) {
  return <button className={`btn ${variant}`} type="button" {...props}>{children}</button>;
}

function WomanView({ onDashboard }) {
  const [step, setStep] = useState("tell");
  const [words, setWords] = useState("");
  const [selected, setSelected] = useState([]);
  const [language, setLanguage] = useState("Tamil");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [realLocation, setRealLocation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);

  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const detect = () => {
    if (!words.trim()) return setMessage("Please speak or type something first.");
    const found = findSymptoms(words);
    setSelected((items) => Array.from(new Set([...items, ...found])));
    setMessage(found.length ? `We picked up: ${found.map(labelFor).join(", ")}. Please check the list below.` : "We could not match that to a sign. Please tick the signs below.");
  };
  const speak = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return setMessage("Voice input is not available in this browser. You can type or tap instead.");
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => setWords(event.results[0][0].transcript);
    recognition.onerror = () => setMessage("Voice input did not work here. You can type, tap, or use the demo phrase.");
    recognition.onend = () => setListening(false);
    recognition.start();
  };
  const send = async () => {
    if (!consent || busy) return;
    setBusy(true);
    try {
      const location = realLocation && navigator.geolocation
        ? await new Promise((resolve) => navigator.geolocation.getCurrentPosition((position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }), () => resolve(null)))
        : null;
      const response = await submitScreening({ name, age: 0, weeks: 0, phone: "", symptoms: selected, location });
      setResult({ ...response, level: response.level || localRisk(selected).level, score: response.score ?? localRisk(selected).score });
      setStep("sent");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };
  const risk = result || localRisk(selected);
  const advice = risk.level === "High" ? "A health worker should check you soon. If you feel worse, go to the hospital right away." : risk.level === "Medium" ? "Please tell a health worker soon and get checked at your next visit, or sooner." : "No warning signs were found. Keep going to your regular check-ups, and check again if anything changes.";

  if (step === "sent") return <div className="phone">
    {result.level === "High" && <div className="emergency"><h2>GET HELP NOW</h2><p>A health worker has been alerted. If you have heavy bleeding, fits, or trouble breathing, go to the hospital now.</p></div>}
    <div className="okmark">✓</div><h1>{result.alertSent ? "Alert sent" : "Update sent"} <span className="tag">SIMULATED</span></h1>
    <p className="lead">Your information was sent to a nearby health worker.</p><pre className="sms">SafeMatri {result.level?.toUpperCase()} ALERT: {name || "Anonymous"} reports {selected.map(labelFor).join(", ") || "no warning signs"}.</pre>
    <div className="advice">{advice}</div><div className="row"><Button variant="secondary" onClick={onDashboard}>See health worker dashboard</Button><Button variant="ghost" onClick={() => { setStep("tell"); setResult(null); }}>Check again</Button></div>
  </div>;

  if (step === "result") return <div className="phone">
    {risk.level === "High" && <div className="emergency"><h2>GO TO THE HOSPITAL NOW</h2><p>This is an emergency danger sign. Do not wait for a home visit.</p></div>}
    <h1>Your Risk Meter</h1><div className="meter"><div className="low" /><div className="mod" /><div className="high" /></div><div className="meterlabels"><span className={risk.level === "Low" ? "on" : ""}>LOW</span><span className={risk.level === "Medium" ? "on" : ""}>MODERATE</span><span className={risk.level === "High" ? "on" : ""}>HIGH</span></div>
    <div className={`level ${risk.level}`}>{risk.level.toUpperCase()} RISK</div><strong>Why:</strong><ul className="reasons">{selected.length ? selected.map(labelFor).map((item) => <li key={item}>{item}</li>) : <li>No warning signs were reported.</li>}</ul><div className="advice">{advice}<br /><span className="small">Do not take any medicine without advice from a health worker or a doctor.</span></div><p className="small">This is a risk indication, not a diagnosis.</p>
    <div className="share"><h3>Share with a health worker</h3><label className="lbl">Your name (optional)</label><input value={name} onChange={(event) => setName(event.target.value)} /><label className="check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree to share my symptoms and my location with my health worker.</span></label><div className="location-share"><h3>Location sharing</h3><p>Sharing your location helps a nearby health worker find you. A demo location is used unless you choose your device location.</p><label className="check"><input type="checkbox" checked={realLocation} onChange={(event) => setRealLocation(event.target.checked)} /><span>Use my device's real location.</span></label><p className="small">Your location is shared only when you give consent and send this report.</p></div><Button variant={risk.level === "High" ? "alert" : "primary"} disabled={!consent || busy} onClick={send}>{busy ? "Sending..." : risk.level === "High" ? "Alert my health worker" : "Share update with my health worker"}</Button></div>
    <div className="row"><Button variant="ghost" onClick={() => setStep("tell")}>Change my answers</Button><Button variant="ghost" onClick={() => { setStep("tell"); setSelected([]); setWords(""); }}>Start over</Button></div>
  </div>;

  return <div className="phone"><h1>How are you feeling today?</h1><p className="lead">Tell us in your own words, by voice or by typing. Then check the signs below.</p><div className="sos">Heavy bleeding, fits, or trouble breathing? Go to the hospital now. Do not wait.</div>
    <label className="lbl">Her language</label><select value={language} onChange={(event) => setLanguage(event.target.value)}>{LANGS.map((item) => <option key={item}>{item}</option>)}</select><label className="lbl">In your own words</label><textarea value={words} onChange={(event) => setWords(event.target.value)} placeholder="For example: my head is paining a lot and my vision is blurry" />
    <div className="row"><Button variant="secondary" onClick={speak}>{listening ? "Stop listening" : "Speak"}</Button><Button variant="secondary" onClick={detect} disabled={busy}>Find signs from what I said</Button><Button variant="ghost" onClick={() => { setWords(DEMO); setTimeout(detect, 0); }}>Try demo phrase</Button></div><p className="small" aria-live="polite">{message || "Voice input usually needs an internet connection in the browser."}</p>
    <h3>Which of these do you have right now?</h3><p className="small">Tick all that apply. Leave it empty if none apply.</p><div className="chips">{SYMPTOMS.map((symptom) => <button key={symptom.id} className="chip" aria-pressed={selected.includes(symptom.id)} onClick={() => toggle(symptom.id)}><span className="tick">{selected.includes(symptom.id) ? "✓" : ""}</span><span>{symptom.label}</span></button>)}</div><Button onClick={() => { setResult(null); setStep("result"); }}>Check my risk</Button>
  </div>;
}

function WorkerView() {
  const [women, setWomen] = useState([]);
  const [tab, setTab] = useState("queue");
  const [open, setOpen] = useState(null);
  useEffect(() => { getWomen().then(setWomen).catch(() => setWomen([])); }, []);
  const order = { High: 0, Medium: 1, Low: 2 };
  const queue = [...women].sort((a, b) => order[a.level] - order[b.level] || b.score - a.score);
  return <div className="wrap"><h2>Health worker dashboard</h2><div className="tabs"><button aria-pressed={tab === "queue"} onClick={() => setTab("queue")}>Priority queue ({queue.length})</button><button aria-pressed={tab === "sms"} onClick={() => setTab("sms")}>SMS log (simulated)</button></div>{tab === "queue" ? (queue.length ? queue.map((woman, index) => <div className="case" key={woman.id}><button className="casehead" onClick={() => setOpen(open === woman.id ? null : woman.id)}><span className="rank">{index + 1}</span><span><span className="ctitle">{woman.name || "Anonymous"}</span><br /><span className="csub">Case {woman.id} · {woman.symptoms?.map(labelFor).join(", ") || "no warning signs"}</span></span><span className="cright"><span className={`pill ${woman.level}`}>{woman.level.toUpperCase()}</span><div className="score">priority {woman.score}</div></span></button>{open === woman.id && <div className="detail"><p><strong>Why this risk level:</strong></p><ul className="reasons">{woman.reasons?.map((reason) => <li key={reason}>{reason}</li>)}</ul>{woman.location && <a href={`https://maps.google.com/?q=${woman.location.lat},${woman.location.lng}`} target="_blank" rel="noreferrer">Open her location in Google Maps</a>}</div>}</div>) : <div className="empty">No open cases. New alerts from the woman's app will appear here.</div>) : <div className="empty">SMS messages are simulated through the existing demo API.</div>}</div>;
}

export default function App() {
  const [view, setView] = useState("woman");
  return <><div className="topbar"><div className="brand">SafeMatri<small>Every mother heard. Risks caught early, anywhere.</small></div><div className="seg"><button aria-pressed={view === "woman"} onClick={() => setView("woman")}>Woman's app</button><button aria-pressed={view === "worker"} onClick={() => setView("worker")}>Health worker dashboard</button></div></div><div className="notice">Prototype for demonstration only. Not a medical device. Do not use it for real medical decisions.</div><main>{view === "woman" ? <WomanView onDashboard={() => setView("worker")} /> : <WorkerView />}</main><section className="about"><h2>About the prototype</h2><p>SafeMatri is a maternal health support app designed to help women describe pregnancy symptoms in their own words, identify possible warning signs early, and connect with a nearby health worker when support is needed.</p><p>The app provides a simple risk indication based on reported symptoms, explains why a risk level was selected, and can send a simulated alert with the woman's information and location. Health workers can review incoming cases in a priority queue so urgent cases are seen first while waiting cases remain visible.</p><p>This prototype is still under development. Future versions will include a multilingual display option, voice input in many languages, improved translation and symptom detection, stronger location and messaging support, and clinical review of all screening rules before real-world use.</p></section><footer>SafeMatri prototype by Team Syrah · All cases are fictional demo data and SMS alerts are simulated.</footer></>;
}