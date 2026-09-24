import { SYMPTOMS } from "../data/symptoms";

const USE_MOCK = true;
const BASE_URL = "http://localhost:5000/api";

// ---------- MOCK (in-memory, resets on refresh) ----------
let mockWomen = [];

function mockScreen(form) {
  let score = 0;
  const reasons = [];
  let forceHigh = false;

  form.symptoms.forEach((id) => {
    const s = SYMPTOMS.find((x) => x.id === id);
    if (!s) return;
    score += s.weight;
    reasons.push(s.label);
    if (s.danger) forceHigh = true;
  });

  const sys = Number(form.systolic);
  const dia = Number(form.diastolic);
  if (sys >= 160 || dia >= 110) {
    score += 5;
    reasons.push(`Very high blood pressure (${sys}/${dia})`);
  } else if (sys >= 140 || dia >= 90) {
    score += 3;
    reasons.push(`High blood pressure (${sys}/${dia})`);
  }

  const age = Number(form.age);
  if (age < 18 || age > 35) {
    score += 2;
    reasons.push(`Age risk factor (${age} years)`);
  }

  let level = "Low";
  if (score >= 6 || forceHigh) level = "High";
  else if (score >= 3) level = "Medium";

  const result = {
    id: Date.now(),
    name: form.name,
    age,
    weeks: form.weeks,
    phone: form.phone,
    location: form.location,
    score: Math.min(score, 10),
    level,
    reasons,
    alertSent: level === "High",
    createdAt: new Date().toISOString(),
  };
  mockWomen.push(result);
  return result;
}

// ---------- PUBLIC API ----------
export async function submitScreening(form) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700)); // fake network delay
    return mockScreen(form);
  }
  const res = await fetch(`${BASE_URL}/screen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error("Screening failed");
  return res.json();
}

export async function getWomen() {
  if (USE_MOCK) return [...mockWomen];
  const res = await fetch(`${BASE_URL}/women`);
  if (!res.ok) throw new Error("Could not load list");
  return res.json();
}