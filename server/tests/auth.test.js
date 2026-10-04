const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../src/app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: { launchTimeout: 60000 },
  });
  await mongoose.connect(mongoServer.getUri());
}, 90000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 20000);

describe("Auth routes", () => {
  const userPayload = {
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student",
  };

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userPayload.email);
  });

  it("rejects duplicate email registration", async () => {
    const res = await request(app).post("/api/auth/register").send(userPayload);
    expect(res.statusCode).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userPayload.email, password: "wrongpassword" });
    expect(res.statusCode).toBe(401);
  });
});