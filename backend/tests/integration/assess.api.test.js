const request = require("supertest");
const app = require("../../src/app.js");

describe("POST /api/assess", () => {
  test("returns a HIGH risk result for a clear combination", async () => {
    const res = await request(app)
      .post("/api/assess")
      .send({ words: "my head is paining a lot and my eyes are blurry" });

    expect(res.status).toBe(200);
    expect(res.body.risk).toBe("HIGH");
    expect(res.body.detected).toContain("severe_headache");
    expect(res.body.disclaimer).toMatch(/does not suggest medicines/i);
  });

  test("returns an emergency result for heavy bleeding", async () => {
    const res = await request(app)
      .post("/api/assess")
      .send({ symptoms: ["heavy_bleeding"] });

    expect(res.status).toBe(200);
    expect(res.body.emergency).toBe(true);
  });

  test("rejects an unknown symptom key with 400", async () => {
    const res = await request(app)
      .post("/api/assess")
      .send({ symptoms: ["not_real"] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("UNKNOWN_SYMPTOM");
  });

  test("never creates a case", async () => {
    const caseRepo = require("../../src/repositories/caseRepository.js");
    const before = caseRepo.count();
    await request(app).post("/api/assess").send({ symptoms: ["fever"] });
    expect(caseRepo.count()).toBe(before);
  });
});