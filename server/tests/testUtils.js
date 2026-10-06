const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

let mongoServer;

const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
  await mongoose.connect(mongoServer.getUri());
};

const disconnectTestDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};

const registerUser = async (app, overrides = {}) => {
  const payload = {
    name: "Test User",
    email: `user${Date.now()}${Math.random().toString(16).slice(2)}@test.com`,
    password: "password123",
    role: "student",
    ...overrides,
  };
  const res = await request(app).post("/api/auth/register").send(payload);
  return { token: res.body.token, user: res.body.user };
};

module.exports = { connectTestDB, disconnectTestDB, registerUser };
