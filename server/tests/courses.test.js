const request = require("supertest");
const app = require("../src/app");
const { connectTestDB, disconnectTestDB, registerUser } = require("./testUtils");

beforeAll(connectTestDB, 90000);
afterAll(disconnectTestDB, 20000);

describe("Course routes", () => {
  let instructorA;
  let instructorB;
  let student;
  let courseId;

  beforeAll(async () => {
    instructorA = await registerUser(app, { role: "instructor", name: "Instructor A" });
    instructorB = await registerUser(app, { role: "instructor", name: "Instructor B" });
    student = await registerUser(app, { role: "student", name: "Student A" });
  });

  it("lists courses publicly", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("blocks a student from creating a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ title: "Should Fail", description: "desc", content: "content" });
    expect(res.statusCode).toBe(403);
  });

  it("lets an instructor create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorA.token}`)
      .send({ title: "Intro to Testing", description: "desc", content: "content" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Intro to Testing");
    courseId = res.body._id;
  });

  it("rejects a duplicate title from the same instructor", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorA.token}`)
      .send({ title: "Intro to Testing", description: "desc", content: "content" });
    expect(res.statusCode).toBe(409);
  });

  it("returns a course by id without exposing the instructor's email", async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.instructor.name).toBe("Instructor A");
    expect(res.body.instructor.email).toBeUndefined();
  });

  it("rejects a malformed course id instead of crashing", async () => {
    const res = await request(app).get("/api/courses/not-a-valid-id");
    expect(res.statusCode).toBe(400);
  });

  it("blocks a non-owning instructor from editing the course", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorB.token}`)
      .send({ title: "Hijacked", description: "desc", content: "content" });
    expect(res.statusCode).toBe(403);
  });

  it("lets the owning instructor edit the course", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorA.token}`)
      .send({ title: "Intro to Testing (Updated)", description: "desc", content: "content" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Intro to Testing (Updated)");
  });

  it("blocks a non-owning instructor from deleting the course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorB.token}`);
    expect(res.statusCode).toBe(403);
  });

  it("lets the owning instructor delete the course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorA.token}`);
    expect(res.statusCode).toBe(200);

    const check = await request(app).get(`/api/courses/${courseId}`);
    expect(check.statusCode).toBe(404);
  });
});
