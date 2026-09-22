// The 12 warning signs SafeMatri screens for.
// key   - used internally by the risk engine and rules
// short - short label shown on the dashboard (case cards, pills)
// label - full plain-language label shown to the woman
// term  - suggested clinical term shown in the report for the health worker

const SYMPTOMS = [
  { key: "heavy_bleeding",        short: "Heavy bleeding",     label: "Heavy bleeding from the vagina",                        term: "Heavy vaginal bleeding" },
  { key: "convulsions",           short: "Fits",                label: "Fits or convulsions (shaking and losing consciousness)", term: "Convulsions" },
  { key: "difficulty_breathing",  short: "Trouble breathing",   label: "Trouble breathing, or very short of breath",             term: "Difficulty breathing" },
  { key: "severe_headache",       short: "Severe headache",     label: "Severe headache that does not go away",                  term: "Severe headache" },
  { key: "blurred_vision",        short: "Blurred vision",      label: "Blurred vision, or seeing spots",                        term: "Visual disturbance" },
  { key: "swelling_face_hands",   short: "Swollen face/hands",  label: "Swelling of the face or hands",                          term: "Swelling of face/hands (oedema)" },
  { key: "reduced_movement",      short: "Baby moving less",    label: "Baby is moving less than usual, or not at all",          term: "Reduced fetal movement" },
  { key: "severe_abdominal_pain", short: "Severe belly pain",   label: "Severe pain in the belly",                               term: "Severe abdominal pain" },
  { key: "fluid_leak",            short: "Fluid leaking",       label: "Water or fluid leaking from the vagina",                 term: "Possible leaking of amniotic fluid" },
  { key: "fever",                 short: "Fever",               label: "High fever or shivering",                                term: "Fever" },
  { key: "swollen_feet",          short: "Mild foot swelling",  label: "Mild swelling of the feet or ankles",                    term: "Mild foot/ankle swelling" },
  { key: "mild_nausea",           short: "Nausea/tiredness",    label: "Mild nausea, tiredness or weakness",                     term: "Nausea / fatigue" },
];

// Quick lookup by key, e.g. SYMPTOMS_BY_KEY.heavy_bleeding.short
const SYMPTOMS_BY_KEY = Object.fromEntries(SYMPTOMS.map((s) => [s.key, s]));

module.exports = { SYMPTOMS, SYMPTOMS_BY_KEY };