const request = require("supertest");
const app = require("../src/app");
const { connectTestDB, disconnectTestDB, registerUser } = require("./testUtils");

beforeAll(connectTestDB, 90000);
afterAll(disconnectTestDB, 20000);

describe("Enrollment routes", () => {
  let instructor;
  let student;
  let otherStudent;
  let courseId;
  let enrollmentId;

  beforeAll(async () => {
    instructor = await registerUser(app, { role: "instructor", name: "Course Owner" });
    student = await registerUser(app, { role: "student", name: "Enrolling Student" });
    otherStudent = await registerUser(app, { role: "student", name: "Other Student" });

    const courseRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructor.token}`)
      .send({ title: "Enrollment Target Course", description: "desc", content: "content" });
    courseId = courseRes.body._id;
  });

  it("blocks an instructor from enrolling", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${instructor.token}`)
      .send({ courseId });
    expect(res.statusCode).toBe(403);
  });

  it("rejects an invalid courseId", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ courseId: "not-a-valid-id" });
    expect(res.statusCode).toBe(400);
  });

  it("lets a student enroll in a course", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ courseId });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("enrolled");
    enrollmentId = res.body._id;
  });

  it("rejects a duplicate enrollment", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ courseId });
    expect(res.statusCode).toBe(409);
  });

  it("lists the student's own enrollments", async () => {
    const res = await request(app)
      .get("/api/enrollments/me")
      .set("Authorization", `Bearer ${student.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].course._id).toBe(courseId);
  });

  it("rejects an invalid status value", async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ status: "finished" });
    expect(res.statusCode).toBe(400);
  });

  it("blocks another student from updating someone else's enrollment", async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${otherStudent.token}`)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(403);
  });

  it("lets the owning student advance their progress", async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ status: "in-progress" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("in-progress");
  });

  it("blocks a non-owning instructor from viewing enrolled students", async () => {
    const otherInstructor = await registerUser(app, { role: "instructor", name: "Not The Owner" });
    const res = await request(app)
      .get(`/api/courses/${courseId}/students`)
      .set("Authorization", `Bearer ${otherInstructor.token}`);
    expect(res.statusCode).toBe(403);
  });

  it("lets the owning instructor view enrolled students", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/students`)
      .set("Authorization", `Bearer ${instructor.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Enrolling Student");
  });
});
