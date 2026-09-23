const { validateAssessInput } = require("../../src/validators/assessValidator.js");
const {
  validateCreateCaseInput,
  validateStatusInput,
} = require("../../src/validators/caseValidator.js");

describe("assessValidator.validateAssessInput", () => {
  test("accepts a valid body", () => {
    expect(() =>
      validateAssessInput({ words: "hello", symptoms: ["fever"] })
    ).not.toThrow();
  });

  test("accepts an empty body", () => {
    expect(() => validateAssessInput({})).not.toThrow();
  });

  test("rejects a non-object body", () => {
    expect(() => validateAssessInput("nope")).toThrow(/must be an object/);
    expect(() => validateAssessInput(null)).toThrow(/must be an object/);
    expect(() => validateAssessInput([])).toThrow(/must be an object/);
  });

  test("rejects non-string words", () => {
    expect(() => validateAssessInput({ words: 5 })).toThrow(/must be a string/);
  });

  test("rejects words over the length limit", () => {
    expect(() =>
      validateAssessInput({ words: "a".repeat(501) })
    ).toThrow(/500 characters/);
  });

  test("rejects a non-array symptoms field", () => {
    expect(() => validateAssessInput({ symptoms: "fever" })).toThrow(/must be an array/);
  });

  test("rejects unknown symptom keys", () => {
    expect(() => validateAssessInput({ symptoms: ["not_real"] })).toThrow(
      /Unknown symptom/
    );
  });
});

describe("caseValidator.validateCreateCaseInput", () => {
  const valid = { area: "A", consent: true };

  test("accepts a minimal valid body", () => {
    expect(() => validateCreateCaseInput(valid)).not.toThrow();
  });

  test("rejects missing consent", () => {
    expect(() => validateCreateCaseInput({ area: "A" })).toThrow(/Consent is required/);
  });

  test("rejects consent: false", () => {
    expect(() =>
      validateCreateCaseInput({ area: "A", consent: false })
    ).toThrow(/Consent is required/);
  });

  test("rejects an unknown area", () => {
    expect(() =>
      validateCreateCaseInput({ area: "Z", consent: true })
    ).toThrow(/'area' must be one of/);
  });

  test("rejects an unknown symptom key", () => {
    expect(() =>
      validateCreateCaseInput({ ...valid, symptoms: ["not_real"] })
    ).toThrow(/Unknown symptom/);
  });

  test("rejects a non-numeric location", () => {
    expect(() =>
      validateCreateCaseInput({ ...valid, location: { lat: "x", lng: 2 } })
    ).toThrow(/numeric/);
  });

  test("accepts a valid location", () => {
    expect(() =>
      validateCreateCaseInput({ ...valid, location: { lat: 1, lng: 2 } })
    ).not.toThrow();
  });

  test("rejects a non-string name", () => {
    expect(() => validateCreateCaseInput({ ...valid, name: 5 })).toThrow(/'name'/);
  });
});

describe("caseValidator.validateStatusInput", () => {
  test.each(["new", "visited", "resolved"])("accepts '%s'", (status) => {
    expect(() => validateStatusInput(status)).not.toThrow();
  });

  test("rejects an unknown status", () => {
    expect(() => validateStatusInput("archived")).toThrow(/'status' must be one of/);
  });

  test("rejects a non-string status", () => {
    expect(() => validateStatusInput(5)).toThrow();
  });
});