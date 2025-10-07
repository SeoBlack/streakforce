// __tests__/authController.test.js
// npm i -D jest
// Put `test` script in package.json: "test": "jest --runInBand"

// ---- Mocks ----
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));
jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));
jest.mock("google-auth-library", () => {
  const verifyIdToken = jest.fn();
  const OAuth2Client = function () {};
  OAuth2Client.prototype.verifyIdToken = verifyIdToken;
  return { OAuth2Client };
});
jest.mock("../utils/sendEmail", () => jest.fn());

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");

// System under test
const controller = require("../controllers/authController");

// ---- helpers ----
const makeRes = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return res;
};

const makeUserDoc = (overrides = {}) => ({
  id: "u1",
  email: "a@b.com",
  firstName: "A",
  lastName: "B",
  username: "ab",
  comparePassword: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "secret";
  process.env.GOOGLE_CLIENT_ID = "google-client";
  process.env.FRONTEND_URL = "http://localhost:5173";
});

// ---------------- register ----------------
describe("register", () => {
  test("400 when email or password missing", async () => {
    const req = { body: { email: "", password: "" } };
    const res = makeRes();

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "email and password are required",
    });
  });

  test("409 when email already exists", async () => {
    User.findOne.mockResolvedValue(makeUserDoc());
    const req = { body: { email: "a@b.com", password: "x" } };
    const res = makeRes();

    await controller.register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "a@b.com" });
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("201 on success", async () => {
    User.findOne.mockResolvedValue(null);
    const created = makeUserDoc({ id: "new1", email: "n@x.com" });
    User.create.mockResolvedValue(created);
    jwt.sign.mockReturnValue("jwt123");

    const req = {
      body: { email: "n@x.com", password: "pw", firstName: "N", lastName: "X" },
    };
    const res = makeRes();

    await controller.register(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "new1" },
      "secret",
      expect.any(Object)
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered successfully",
        token: "jwt123",
        user: expect.objectContaining({ email: "n@x.com" }),
      })
    );
  });
});

// ---------------- login ----------------
describe("login", () => {
  test("401 when user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: "a@b.com", password: "pw" } };
    const res = makeRes();

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("401 when password mismatch", async () => {
    const u = makeUserDoc({ comparePassword: jest.fn().mockResolvedValue(false) });
    User.findOne.mockResolvedValue(u);
    const req = { body: { email: "a@b.com", password: "bad" } };
    const res = makeRes();

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("200 with token when success", async () => {
    const u = makeUserDoc();
    User.findOne.mockResolvedValue(u);
    jwt.sign.mockReturnValue("t-abc");
    const req = { body: { email: "a@b.com", password: "pw" } };
    const res = makeRes();

    await controller.login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ userId: "u1" }, "secret", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        token: "t-abc",
        user: expect.objectContaining({ email: "a@b.com" }),
      })
    );
  });
});

// ---------------- verifyToken ----------------
describe("verifyToken", () => {
  test("401 when no token", async () => {
    const req = { headers: { authorization: "Bearer" } }; // missing token
    const res = makeRes();

    await controller.verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("401 when user not found", async () => {
    const req = { headers: { authorization: "Bearer abc" } };
    jwt.verify.mockReturnValue({ userId: "nope" });
    User.findById.mockResolvedValue(null);
    const res = makeRes();

    await controller.verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("200 with user when token valid", async () => {
    const req = { headers: { authorization: "Bearer abc" } };
    jwt.verify.mockReturnValue({ userId: "u1" });
    const u = makeUserDoc();
    User.findById.mockResolvedValue(u);
    const res = makeRes();

    await controller.verifyToken(req, res);

    expect(res.json).toHaveBeenCalledWith({ user: u });
  });
});

// ---------------- forgotPassword ----------------
describe("forgotPassword", () => {
  test("401 when email not found", async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: "x@y.com" } };
    const res = makeRes();

    await controller.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("sends email and returns success", async () => {
    const u = makeUserDoc({ id: "u9", email: "u@u.com" });
    User.findOne.mockResolvedValue(u);
    jwt.sign.mockReturnValue("reset-token");
    const req = { body: { email: "u@u.com" } };
    const res = makeRes();

    await controller.forgotPassword(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "u@u.com",
        subject: "Forgot Password",
      })
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Email sent successfully" });
  });
});

// ---------------- resetPassword ----------------
describe("resetPassword", () => {
  test("400 when missing password", async () => {
    const req = { body: {}, params: { token: "t" } };
    const res = makeRes();

    await controller.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("400 when missing token", async () => {
    const req = { body: { password: "new" }, params: { token: "" } };
    const res = makeRes();

    await controller.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("401 when token invalid/expired", async () => {
    const req = { body: { password: "new" }, params: { token: "bad" } };
    const res = makeRes();
    const err = new Error("bad"); err.name = "JsonWebTokenError";
    jwt.verify.mockImplementation(() => { throw err; });

    await controller.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
  });

  test("401 when user not found", async () => {
    const req = { body: { password: "new" }, params: { token: "ok" } };
    jwt.verify.mockReturnValue({ userId: "u404" });
    User.findById.mockResolvedValue(null);
    const res = makeRes();

    await controller.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("200 when password reset succeeds", async () => {
    const req = { body: { password: "new" }, params: { token: "ok" } };
    jwt.verify.mockReturnValue({ userId: "u1" });
    const u = makeUserDoc({ save: jest.fn().mockResolvedValue(undefined) });
    User.findById.mockResolvedValue(u);
    const res = makeRes();

    await controller.resetPassword(req, res);

    expect(u.password).toBe("new");
    expect(u.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Password reset successfully" });
  });
});

// ---------------- googleAuth ----------------
describe("googleAuth", () => {
  const payload = {
    sub: "google-user-id",
    email: "g@x.com",
    email_verified: true,
    given_name: "G",
    family_name: "X",
    picture: "http://pic",
  };

  test("400 when credential missing", async () => {
    const req = { body: { credential: "", clientId: "cid" } };
    const res = makeRes();

    await controller.googleAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_token is required" });
  });

  test("200 when existing user logs in (and adds googleId if missing)", async () => {
    OAuth2Client.prototype.verifyIdToken.mockResolvedValue({
      getPayload: () => payload,
    });
    const user = makeUserDoc({ googleId: undefined, save: jest.fn().mockResolvedValue(undefined) });
    User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue("t-google");

    const req = { body: { credential: "idtoken", clientId: "cid" } };
    const res = makeRes();

    await controller.googleAuth(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ googleId: "google-user-id" }, { email: "g@x.com" }],
    });
    expect(user.googleId).toBe("google-user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "t-google", user });
  });

  test("201 when new user is created", async () => {
    OAuth2Client.prototype.verifyIdToken.mockResolvedValue({
      getPayload: () => payload,
    });
    User.findOne.mockResolvedValue(null);
    const newUser = makeUserDoc({
      id: "nu1",
      email: "g@x.com",
      save: jest.fn().mockResolvedValue(undefined),
    });
    User.create.mockResolvedValue(newUser);
    jwt.sign.mockReturnValue("t-new");

    const req = { body: { credential: "idtoken", clientId: "cid" } };
    const res = makeRes();

    await controller.googleAuth(req, res);

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "g@x.com",
        googleId: "google-user-id",
        profile: expect.any(Object),
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ token: "t-new", user: newUser });
  });

  test("400 when verification throws", async () => {
    OAuth2Client.prototype.verifyIdToken.mockRejectedValue(new Error("bad token"));
    const req = { body: { credential: "idtoken", clientId: "cid" } };
    const res = makeRes();

    await controller.googleAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Authentication failed" })
    );
  });
});
