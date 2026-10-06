const request = require("supertest");
const app = require("../src/app");
const { connectTestDB, disconnectTestDB, registerUser } = require("./testUtils");

beforeAll(connectTestDB, 90000);
afterAll(disconnectTestDB, 20000);

describe("Recommendation routes", () => {
  let student;
  let instructor;

  beforeAll(async () => {
    student = await registerUser(app, { role: "student", name: "Prompt Student" });
    instructor = await registerUser(app, { role: "instructor", name: "Prompt Instructor" });
  });

  it("blocks an instructor from requesting recommendations", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${instructor.token}`)
      .send({ prompt: "I want to be a software engineer" });
    expect(res.statusCode).toBe(403);
  });

  it("rejects an empty prompt", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ prompt: "" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects a prompt over 500 characters", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ prompt: "a".repeat(501) });
    expect(res.statusCode).toBe(400);
  });

  it("returns a mock recommendation when USE_REAL_GPT is not enabled", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ prompt: "I want to be a software engineer, what courses should I follow?" });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.message).toBe("string");
    expect(Array.isArray(res.body.recommendedCourses)).toBe(true);
  });
});
