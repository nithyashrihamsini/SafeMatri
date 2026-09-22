// Seed data for 10 fictional demo cases, used to fill the dashboard queue
// on startup and after a reset. All cases are fictional demo data.
//
// minutesAgo - how many minutes before "now" this case was reported,
//              used to test the priority queue's waiting-time aging.
// status     - "new" unless stated otherwise (see src/constants/enums.js).
//
// A service file (src/services/caseService.js) will turn each of these
// into a full case: it will run the risk engine, build the report and
// simulated SMS, and assign a recipient, the same way a real submission
// from the woman's app would.

const SEED_CASES = [
  { area: "C", symptoms: ["heavy_bleeding"],                         words: "there is a lot of bleeding since morning",       minutesAgo: 8 },
  { area: "A", symptoms: ["severe_headache", "blurred_vision"],      words: "my head is paining a lot and my eyes are blurry", minutesAgo: 25 },
  { area: "B", symptoms: ["reduced_movement"],                       words: "the baby is not kicking like before",             minutesAgo: 70 },
  { area: "D", symptoms: ["fluid_leak"],                             words: "water is leaking since last night",               minutesAgo: 40 },
  { area: "A", symptoms: ["swelling_face_hands"],                    words: "my face and hands are puffy",                     minutesAgo: 360 },
  { area: "B", symptoms: ["fever"],                                  words: "fever and shivering for two days",                minutesAgo: 180 },
  { area: "A", symptoms: ["severe_headache"],                        words: "headache today",                                  minutesAgo: 45 },
  { area: "C", symptoms: ["mild_nausea"],                            words: "feeling tired and a bit sick",                    minutesAgo: 90 },
  { area: "D", symptoms: ["swollen_feet", "mild_nausea"],            words: "my feet are swollen and I feel weak",             minutesAgo: 720 },
  { area: "B", symptoms: ["severe_abdominal_pain"],                  words: "severe pain in my stomach",                       minutesAgo: 130, status: "visited" },
];

module.exports = { SEED_CASES };
