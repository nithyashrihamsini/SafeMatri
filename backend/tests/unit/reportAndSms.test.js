const { buildReport, nextStep, signsText, who } = require("../../src/engine/reportBuilder.js");
const { buildSms } = require("../../src/engine/smsBuilder.js");
const { RISK } = require("../../src/constants/enums.js");

// A reusable fake case, similar to what caseService will build later.
function makeCase(overrides = {}) {
  return {
    id: "A-102",
    name: "",
    createdAt: Date.now(),
    area: "A",
    risk: RISK.HIGH,
    emergency: false,
    words: "my head is paining a lot and my eyes are blurry",
    symptoms: ["severe_headache", "blurred_vision"],
    reasons: ["A severe headache together with blurred vision can be a warning sign of dangerously high blood pressure."],
    location: { lat: 20.615, lng: 20.605, demo: true },
    ...overrides,
  };
}

describe("reportBuilder.who", () => {
  test("uses 'Anonymous' when no name is given", () => {
    expect(who(makeCase({ name: "" }))).toBe("Anonymous (Case A-102)");
  });

  test("uses the given name", () => {
    expect(who(makeCase({ name: "Kavya" }))).toBe("Kavya (Case A-102)");
  });
});

describe("reportBuilder.signsText", () => {
  test("lists short labels, comma-separated", () => {
    expect(signsText(makeCase())).toBe("Severe headache, Blurred vision");
  });

  test("says 'no warning signs' when the list is empty", () => {
    expect(signsText(makeCase({ symptoms: [] }))).toBe("no warning signs");
  });
});

describe("reportBuilder.nextStep", () => {
  test("emergency case -> go to hospital wording, regardless of risk level", () => {
    const result = nextStep(makeCase({ risk: RISK.HIGH, emergency: true }));
    expect(result).toMatch(/hospital immediately/i);
  });

  test("HIGH, not emergency -> home check-up wording", () => {
    const result = nextStep(makeCase({ risk: RISK.HIGH, emergency: false }));
    expect(result).toMatch(/home check-up/i);
  });

  test("MODERATE -> 'check on her soon' wording", () => {
    const result = nextStep(makeCase({ risk: RISK.MODERATE, emergency: false }));
    expect(result).toMatch(/check on her soon/i);
  });

  test("LOW -> routine follow-up wording", () => {
    const result = nextStep(makeCase({ risk: RISK.LOW, emergency: false }));
    expect(result).toMatch(/routine follow-up/i);
  });
});

describe("reportBuilder.buildReport", () => {
  test("includes the case id, area, and risk level", () => {
    const report = buildReport(makeCase());
    expect(report).toContain("Case: A-102");
    expect(report).toContain("Village A");
    expect(report).toContain("HIGH RISK");
  });

  test("includes her own words in quotes", () => {
    const report = buildReport(makeCase());
    expect(report).toContain('"my head is paining a lot and my eyes are blurry"');
  });

  test("falls back to a placeholder when no words were given", () => {
    const report = buildReport(makeCase({ words: "" }));
    expect(report).toContain("No description given");
  });

  test("maps each symptom to its clinical term", () => {
    const report = buildReport(makeCase());
    expect(report).toContain("Severe headache that does not go away  ->  Severe headache");
    expect(report).toContain("Blurred vision, or seeing spots  ->  Visual disturbance");
  });

  test("lists every reason given", () => {
    const report = buildReport(
      makeCase({ reasons: ["Reason one.", "Reason two."] })
    );
    expect(report).toContain("- Reason one.");
    expect(report).toContain("- Reason two.");
  });

  test("shows the emergency label when emergency is true", () => {
    const report = buildReport(makeCase({ emergency: true }));
    expect(report).toContain("EMERGENCY: advised to go to hospital now");
  });

  test("does not show the emergency label when emergency is false", () => {
    const report = buildReport(makeCase({ emergency: false }));
    expect(report).not.toContain("EMERGENCY:");
  });

  test("shows 'Not shared' when there is no location", () => {
    const report = buildReport(makeCase({ location: null }));
    expect(report).toContain("Location: Not shared");
  });

  test("shows '(demo location)' vs '(shared with consent)' correctly", () => {
    const demoReport = buildReport(makeCase({ location: { lat: 1, lng: 2, demo: true } }));
    expect(demoReport).toContain("(demo location)");

    const realReport = buildReport(makeCase({ location: { lat: 1, lng: 2, demo: false } }));
    expect(realReport).toContain("(shared with consent)");
  });

  test("always includes the no-medicines disclaimer", () => {
    const report = buildReport(makeCase());
    expect(report).toContain("SafeMatri does not suggest medicines.");
  });
});

describe("smsBuilder.buildSms", () => {
  test("labels an emergency case as EMERGENCY", () => {
    const sms = buildSms(makeCase({ emergency: true, risk: RISK.HIGH }));
    expect(sms).toMatch(/^SafeMatri EMERGENCY \[EMERGENCY\]:/);
  });

  test("labels a non-emergency HIGH case as ALERT", () => {
    const sms = buildSms(makeCase({ emergency: false, risk: RISK.HIGH }));
    expect(sms).toMatch(/^SafeMatri ALERT \[HIGH\]:/);
  });

  test("labels a MODERATE case as UPDATE", () => {
    const sms = buildSms(makeCase({ emergency: false, risk: RISK.MODERATE }));
    expect(sms).toMatch(/^SafeMatri UPDATE \[MODERATE\]:/);
  });

  test("labels a LOW case as UPDATE", () => {
    const sms = buildSms(makeCase({ emergency: false, risk: RISK.LOW }));
    expect(sms).toMatch(/^SafeMatri UPDATE \[LOW\]:/);
  });

  test("includes the area name and signs", () => {
    const sms = buildSms(makeCase());
    expect(sms).toContain("Village A");
    expect(sms).toContain("Severe headache, Blurred vision");
  });

  test("includes the maps link when a location is present", () => {
    const sms = buildSms(makeCase());
    expect(sms).toContain("https://maps.google.com/?q=20.615,20.605");
  });

  test("says location not shared when there is none", () => {
    const sms = buildSms(makeCase({ location: null }));
    expect(sms).toContain("Location not shared.");
  });

  test("ends by pointing to the dashboard", () => {
    const sms = buildSms(makeCase());
    expect(sms).toMatch(/Full report is on the SafeMatri dashboard\.$/);
  });
});