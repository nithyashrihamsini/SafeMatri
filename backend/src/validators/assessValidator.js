const { AppError } = require("../utils/errors.js");
const { SYMPTOMS_BY_KEY } = require("../data/symptoms.js");

const MAX_WORDS_LENGTH = 500;

/**
 * validateAssessInput(body) -> throws an AppError if invalid, otherwise
 * returns nothing (the caller can proceed).
 * body: { words?: string, symptoms?: string[] }
 */
function validateAssessInput(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("Request body must be an object.", 400, "INVALID_BODY");
  }

  const { words, symptoms } = body;

  if (words !== undefined) {
    if (typeof words !== "string") {
      throw new AppError("'words' must be a string.", 400, "INVALID_WORDS");
    }
    if (words.length > MAX_WORDS_LENGTH) {
      throw new AppError(
        `'words' must be ${MAX_WORDS_LENGTH} characters or fewer.`,
        400,
        "WORDS_TOO_LONG"
      );
    }
  }

  if (symptoms !== undefined) {
    if (!Array.isArray(symptoms)) {
      throw new AppError("'symptoms' must be an array.", 400, "INVALID_SYMPTOMS");
    }
    const unknown = symptoms.filter((key) => !SYMPTOMS_BY_KEY[key]);
    if (unknown.length > 0) {
      throw new AppError(
        `Unknown symptom key(s): ${unknown.join(", ")}`,
        400,
        "UNKNOWN_SYMPTOM"
      );
    }
  }
}

module.exports = { validateAssessInput, MAX_WORDS_LENGTH };