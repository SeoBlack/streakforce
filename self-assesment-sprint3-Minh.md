Here are three self-assessment examples focused only on the test file changes.

Example 1: Test Harness Setup and Isolation

Problem: Tests were flaky due to real DB/cron and strict env validation on import.
Fix in test file: Set minimal env and mock integration points to keep tests hermetic.
// tests/test1.test.js (setup)
process.env.JWT_SECRET = "test_jwt_secret";
process.env.GOOGLE_PROJECT_ID = "test-project";

jest.mock("../config/db", () => jest.fn());
jest.mock("node-cron", () => ({ schedule: jest.fn(() => ({ stop: jest.fn() })) }));
jest.mock("../middleware/auth", () => (req, _res, next) => {
  req.user = { id: "u1", _id: "u1", firstName: "Test", lastName: "User" };
  next();
});
Improvements:
Deterministic: No network, no DB connections, no scheduled jobs.
Fast: Tests run quickly and reliably in any environment.
Example 2: Accurate Mongoose Model Mocks

Problem: Users endpoints 500’d because User.findById(...).select('-password') wasn’t supported by the mock.
Fix in test file: Implemented a Mongoose-like, chainable, awaitable mock that returns docs with toObject().
// tests/test1.test.js (User mock excerpt)
const mockUsers = {};
const wrapDoc = (doc) => doc && {
  ...doc,
  save: jest.fn(async () => doc),
  toObject: function () { return { ...doc }; },
};

const makeQuery = (doc) => {
  const wrapped = wrapDoc(doc);
  const thenableDoc = wrapped
    ? { ...wrapped, then: (r, j) => Promise.resolve(wrapped).then(r, j), catch: (j) => Promise.resolve(wrapped).catch(j) }
    : { then: (r, j) => Promise.resolve(null).then(r, j), catch: (j) => Promise.resolve(null).catch(j) };
  return { select: jest.fn(() => thenableDoc), then: thenableDoc.then, catch: thenableDoc.catch };
};

jest.mock("../models/User", () => ({
  findOne: jest.fn(async (q) => (q?.email ? mockUsers[q.email] || null : null)),
  create: jest.fn(async (data) => (mockUsers[data.email] = { id: "u_new", _id: "u_new", ...data })),
  findById: jest.fn((id) => makeQuery(Object.values(mockUsers).find(u => u.id === id || u._id === id) || null)),
}));
Improvements:
Correctness: Mirrors Mongoose query semantics used by controllers.
Stability: Eliminates 500s caused by missing .select()/thenable behavior.
Example 3: Fully Isolating External Services and Seeding State

Problem: External services (email, OAuth, AI) and JWT verification made tests brittle.
Fix in test file: Mocked all external modules and seeded a default user/state.
// tests/test1.test.js (external mocks + seed)
jest.mock("../utils/sendEmail", () => jest.fn(async () => true));
jest.mock("@google/genai", () => ({ GoogleGenAI: jest.fn().mockImplementation(() => ({
  models: { generateContent: jest.fn(async () => ({ text: "ai-result" })) },
})) }));
jest.mock("google-auth-library", () => ({ OAuth2Client: jest.fn().mockImplementation(() => ({
  verifyIdToken: jest.fn(async () => ({ getPayload: () => ({ email: "guser@example.com", sub: "google-123" }) })),
})) }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "token123"), verify: jest.fn(() => ({ userId: "u1" })) }));

beforeAll(() => {
  mockUsers["u1@example.com"] = { id: "u1", _id: "u1", email: "u1@example.com", firstName: "Test", lastName: "User",
    stats: { xp: { current: 0, total: 100 }, level: { current: 1, title: "Beginner" }, streak: { current: 0, longest: 0 } } };
});
Improvements:
Focus: Tests validate HTTP behavior, not external integrations.
Coverage: Enables stable tests across all controllers (auth, users, habits, checkins, AI) within one file.
If you want, I can paste this directly into streakforce/self-assesment-sprint3-Minh.md under a “Testing (test1.test.js)” section.
