// Ensure required env vars for modules that validate on import
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID || "test-project";

// Mocks to isolate HTTP layer from DB/external services
jest.mock("../config/db", () => jest.fn());
jest.mock("node-cron", () => ({ schedule: jest.fn(() => ({ stop: jest.fn() })) }));
jest.mock("../middleware/auth", () => (req, _res, next) => {
  req.user = { id: "u1", _id: "u1", firstName: "Test", lastName: "User" };
  next();
});

// Mock models
const mockUsers = {};
jest.mock("../models/User", () => {
  const users = mockUsers;
  const wrapDoc = (doc) => {
    if (!doc) return null;
    const base = {
      id: doc.id,
      _id: doc._id,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      profile: doc.profile,
      stats: doc.stats,
    };
    return {
      ...base,
      save: jest.fn(async () => base),
      toObject: function () {
        return { ...base };
      },
    };
  };
  const makeQuery = (doc) => {
    const wrapped = wrapDoc(doc);
    const thenableDoc = wrapped
      ? {
          ...wrapped,
          then: (res, rej) => Promise.resolve(wrapped).then(res, rej),
          catch: (rej) => Promise.resolve(wrapped).catch(rej),
        }
      : {
          then: (res, rej) => Promise.resolve(null).then(res, rej),
          catch: (rej) => Promise.resolve(null).catch(rej),
        };
    return {
      select: jest.fn(() => thenableDoc),
      then: thenableDoc.then,
      catch: thenableDoc.catch,
    };
  };
  return {
    __esModule: true,
    default: undefined,
    findOne: jest.fn(async (q) => {
      if (q && q.email) return users[q.email] || null;
      return null;
    }),
    create: jest.fn(async (data) => {
      const user = {
        id: data.id || "u_new",
        _id: data.id || "u_new",
        email: data.email,
        firstName: data.firstName || data?.profile?.firstName || "",
        lastName: data.lastName || data?.profile?.lastName || "",
        googleId: data.googleId,
        stats: data.stats,
        comparePassword: jest.fn(async (p) => p === "pass123"),
        save: jest.fn(async () => user),
        toObject: function () {
          return { ...this };
        },
      };
      if (user.email) users[user.email] = user;
      return user;
    }),
    findById: jest.fn((id) => {
      const doc = Object.values(users).find((u) => u.id === id || u._id === id) || null;
      return makeQuery(doc);
    }),
  };
});

const makeHabitClass = () => {
  function Habit(data) {
    Object.assign(this, data);
    this._id = this._id || "h1";
    this.save = jest.fn(async () => this);
  }
  Habit.find = jest.fn(async () => []);
  Habit.findById = jest.fn(async (_id) => null);
  Habit.findByIdAndDelete = jest.fn(async (_id) => ({}));
  return Habit;
};
jest.mock("../models/Habit", () => makeHabitClass());

jest.mock("../models/CheckIn", () => ({
  findOne: jest.fn(async () => null),
  create: jest.fn(async (data) => ({ ...data, _id: "c1" })),
  find: jest.fn(async () => []),
}));

// Mock email + external AI + Google OAuth
jest.mock("../utils/sendEmail", () => jest.fn(async () => true));
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: jest.fn(async () => ({ text: "ai-result" })) },
  })),
}));
jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(async () => ({ getPayload: () => ({
      sub: "google-123",
      email: "guser@example.com",
      given_name: "G",
      family_name: "User",
      picture: "",
    }) }))
  })),
}));

// Mock JWT
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "token123"),
  verify: jest.fn(() => ({ userId: "u1" })),
}));

const request = require("supertest");
const app = require("../index");

// Import mocks to tweak per test
const User = require("../models/User");
const Habit = require("../models/Habit");
const CheckIn = require("../models/CheckIn");
const sendEmail = require("../utils/sendEmail");

describe("API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    // Seed an authenticated user "u1" so protected routes and verify work
    mockUsers["u1@example.com"] = {
      id: "u1",
      _id: "u1",
      email: "u1@example.com",
      firstName: "Test",
      lastName: "User",
      stats: { xp: { current: 0, total: 100 }, level: { current: 1, title: "Beginner" }, streak: { current: 0, longest: 0 } },
    };
  });

  // Root
  it("GET / should respond 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("StreakForce API is running!");
  });

  // Auth Controller
  describe("Auth", () => {
    it("POST /auth/register success", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "new@example.com", password: "pass123", firstName: "N", lastName: "U" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token", "token123");
    });

    it("POST /auth/login invalid credentials", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "nope@example.com", password: "wrong" });
      expect(res.status).toBe(401);
    });

    it("GET /auth/verify success", async () => {
      const res = await request(app)
        .get("/auth/verify")
        .set("Authorization", "Bearer token123");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    it("POST /auth/forgot-password success", async () => {
      User.findOne.mockResolvedValueOnce({ id: "u1", email: "foo@bar.com" });
      const res = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "foo@bar.com" });
      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });

    it("POST /auth/reset-password success", async () => {
      jwt.verify.mockReturnValueOnce({ userId: "u1" });
      User.findById.mockResolvedValueOnce({ id: "u1", save: jest.fn(async () => ({})) });
      const res = await request(app)
        .post("/auth/reset-password/validtoken")
        .send({ password: "newpass" });
      expect(res.status).toBe(200);
    });
  });

  // Users Controller (protected via mocked auth)
  describe("Users", () => {
    it("GET /users/profile returns profile", async () => {
      const res = await request(app)
        .get("/users/profile")
        .set("Authorization", "Bearer token123");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user.id", "u1");
    });
 })


  // Habits Controller (protected via mocked auth)
  describe("Habits", () => {
    it("POST /habits success (private)", async () => {
      const res = await request(app)
        .post("/habits")
        .set("Authorization", "Bearer token123")
        .send({ title: "T", description: "D", duration: 7, privacy: "private", aspect: "health" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
    });

    it("GET /habits returns array", async () => {
      Habit.find.mockResolvedValueOnce([{ _id: "h1" }]);
      const res = await request(app)
        .get("/habits")
        .set("Authorization", "Bearer token123");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("DELETE /habits/:id unauthorized (403)", async () => {
      Habit.findById.mockResolvedValueOnce({ _id: "h1", createdBy: { toString: () => "other" } });
      const res = await request(app)
        .delete("/habits/h1")
        .set("Authorization", "Bearer token123");
      expect(res.status).toBe(403);
    });
  });

  // CheckIns Controller (protected via mocked auth)
  describe("CheckIns", () => {
    it("POST /checkins/:userId success", async () => {
      // Not already checked in
      CheckIn.findOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .post("/checkins/u1")
        .set("Authorization", "Bearer token123")
        .send({ habitId: "h1" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Check-in successful");
    });

    it("GET /checkins returns array", async () => {
      CheckIn.find.mockResolvedValueOnce([]);
      const res = await request(app)
        .get("/checkins")
        .set("Authorization", "Bearer token123");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // AI Controller (protected via mocked auth)
  describe("AI", () => {
    it("POST /ai/query success", async () => {
      const res = await request(app)
        .post("/ai/query")
        .set("Authorization", "Bearer token123")
        .send({ query: "Hello" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("result", "ai-result");
    });
  });
});
