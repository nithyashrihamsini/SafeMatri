const request = require("supertest");
const app = require("../../src/app.js");

describe("Cases API", () => {
  beforeEach(async () => {
    await request(app).post("/api/demo/reset"); // clean, known state each test
  });

  test("GET /api/cases returns the 10 seeded cases", async () => {
    const res = await request(app).get("/api/cases");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(10);
  });

  test("GET /api/cases?status=new returns only new cases, sorted by priority", async () => {
    const res = await request(app).get("/api/cases?status=new");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(9);
    expect(res.body[0].emergency).toBe(true); // heavy bleeding case sorts first
  });

  test("POST /api/cases creates a case and it appears in the queue", async () => {
    const create = await request(app)
      .post("/api/cases")
      .send({ area: "A", consent: true, symptoms: ["fever"], words: "fever since yesterday" });

    expect(create.status).toBe(201);
    expect(create.body.risk).toBe("MODERATE");

    const get = await request(app).get(`/api/cases/${create.body.id}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(create.body.id);
  });

  test("POST /api/cases without consent is rejected", async () => {
    const res = await request(app).post("/api/cases").send({ area: "A" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("MISSING_CONSENT");
  });

  test("POST /api/cases with an unknown area is rejected", async () => {
    const res = await request(app)
      .post("/api/cases")
      .send({ area: "Z", consent: true });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_AREA");
  });

  test("GET /api/cases/:id for an unknown id returns 404", async () => {
    const res = await request(app).get("/api/cases/Z-999");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("CASE_NOT_FOUND");
  });

  test("PATCH /api/cases/:id/status updates status", async () => {
    const list = await request(app).get("/api/cases?status=new");
    const id = list.body[0].id;

    const patch = await request(app)
      .patch(`/api/cases/${id}/status`)
      .send({ status: "visited" });

    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe("visited");
  });

  test("PATCH with an invalid status is rejected", async () => {
    const list = await request(app).get("/api/cases?status=new");
    const id = list.body[0].id;

    const patch = await request(app)
      .patch(`/api/cases/${id}/status`)
      .send({ status: "archived" });

    expect(patch.status).toBe(400);
    expect(patch.body.error.code).toBe("INVALID_STATUS");
  });

  test("PATCH on an unknown id returns 404", async () => {
    const res = await request(app)
      .patch("/api/cases/Z-999/status")
      .send({ status: "visited" });
    expect(res.status).toBe(404);
  });

  test("demo fast-forward increases waiting time", async () => {
    const before = await request(app).get("/api/cases?status=new");
    const beforeWait = before.body[0].waitMinutes;

    await request(app).post("/api/demo/fast-forward").send({ minutes: 120 });

    const after = await request(app).get("/api/cases?status=new");
    expect(after.body[0].waitMinutes).toBeGreaterThan(beforeWait);
  });

  test("SMS log has an entry per created case", async () => {
    await request(app).post("/api/cases").send({ area: "B", consent: true, symptoms: ["fever"] });
    const res = await request(app).get("/api/sms-log");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});