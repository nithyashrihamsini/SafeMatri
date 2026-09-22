// Matches plain-language phrases (how a woman might describe how she feels)
// to a symptom key. Each entry is [symptomKey, regularExpression].
// Used by src/engine/symptomDetector.js to turn free text into symptom keys.

const LEXICON = [
  ["heavy_bleeding",        /bleed|soaking|lot of blood|blood (is )?(coming|flowing|everywhere)/i],
  ["convulsions",           /convuls|seizure|\bfits?\b|had a fit/i],
  ["difficulty_breathing",  /can'?t breathe|cannot breathe|breathing|breathless|short of breath|gasp/i],
  ["severe_headache",       /head ?ache|head (is )?(pain|paining|hurt|hurting|aching|throbbing)|head pain|migraine/i],
  ["blurred_vision",        /blur|cannot see|can'?t see|see(ing)? (spots|stars|flashes|double)|vision|eyes? (are |is )?(dim|dark)/i],
  ["swelling_face_hands",   /(swell|swollen|puffy|puffiness).{0,25}(face|hand|finger|eye)|(face|hand|finger|eye).{0,25}(swell|swollen|puffy|puffiness)/i],
  ["swollen_feet",          /(swell|swollen|puffy).{0,25}(foot|feet|ankle|leg)|(foot|feet|ankle|leg).{0,25}(swell|swollen|puffy)/i],
  ["reduced_movement",      /(baby|child).{0,30}(not moving|less|stopped|still|quiet|no movement|not kicking|barely)|(no|less|not|stopped|reduced).{0,15}(kick|movement|moving)/i],
  ["severe_abdominal_pain", /(stomach|belly|abdomen|abdominal|tummy).{0,30}(pain|paining|hurt|hurting|ache|aching|cramp)|(pain|cramp).{0,20}(stomach|belly|abdomen|tummy)/i],
  ["fluid_leak",            /(water|fluid).{0,25}(leak|leaking|broke|breaking|coming|flowing|dripping)|leaking/i],
  ["fever",                 /fever|high temperature|shiver|chills|burning up/i],
  ["mild_nausea",           /nause|vomit|tired|weak|fatigue|dizzy/i],
];

module.exports = { LEXICON };