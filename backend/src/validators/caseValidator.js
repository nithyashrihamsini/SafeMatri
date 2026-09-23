const { AppError } = require("../utils/errors.js");
const { SYMPTOMS_BY_KEY } = require("../data/symptoms.js");
const { AREAS } = require("../data/areas.js");
const { STATUS } = require("../constants/enums.js");
const { MAX_WORDS_LENGTH } = require("./assessValidator.js");

const VALID_STATUSES = Object.values(STATUS); // ["new", "visited", "resolved"]

/**
 * validateCreateCaseInput(body) -> throws an AppError if invalid.
 * body: { name?, area, words?, symptoms?, location?, consent }
 */
function validateCreateCaseInput(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("Request body must be an object.", 400, "INVALID_BODY");
  }

  const { name, area, words, symptoms, location, consent } = body;

  if (consent !== true) {
    throw new AppError(
      "Consent is required to create a case.",
      400,
      "MISSING_CONSENT"
    );
  }

  if (typeof area !== "string" || !AREAS[area]) {
    throw new AppError(
      `'area' must be one of: ${Object.keys(AREAS).join(", ")}`,
      400,
      "INVALID_AREA"
    );
  }

  if (name !== undefined && typeof name !== "string") {
    throw new AppError("'name' must be a string.", 400, "INVALID_NAME");
  }

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

  if (location !== undefined && location !== null) {
    if (
      typeof location !== "object" ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      throw new AppError(
        "'location' must be an object with numeric 'lat' and 'lng'.",
        400,
        "INVALID_LOCATION"
      );
    }
  }
}

/**
 * validateStatusInput(status) -> throws an AppError if invalid.
 * status: expected to be one of "new" | "visited" | "resolved"
 */
function validateStatusInput(status) {
  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    throw new AppError(
      `'status' must be one of: ${VALID_STATUSES.join(", ")}`,
      400,
      "INVALID_STATUS"
    );
  }
}

module.exports = { validateCreateCaseInput, validateStatusInput };