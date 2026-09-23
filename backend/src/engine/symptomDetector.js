const { LEXICON } = require("../data/lexicon.js");

/**
 * detect(text)
 * text - free text describing how she feels, e.g.
 *        "my head is paining a lot and my eyes are blurry"
 *
 * Returns an array of symptom keys whose pattern matched somewhere in the
 * text, e.g. ["severe_headache", "blurred_vision"]. Returns [] if text is
 * empty or nothing matched — never throws.
 */
function detect(text) {
  if (!text) return [];
  return LEXICON.filter(([, pattern]) => pattern.test(text)).map(
    ([key]) => key
  );
}

module.exports = { detect };