// __tests__/userController.test.js
// npm i -D jest
// package.json: { "scripts": { "test": "jest --runInBand" } }

const usersSeed = [
  { id: "u1", fullName: "Alice A", email: "a@x.com", password: "hash1" },
  { id: "u2", fullName: "Bob B", email: "b@x.com", password: "hash2" },
];

// --- Mock Users model to behave BOTH as an array (for .find(predicate))
//     and as a Mongoose model (for .find().select("-password")).
const selectMock = jest.fn().mockResolvedValue(
  usersSeed.map(({ password, ...rest }) => rest)
);
const usersModelMock = {
  _data: [...usersSeed],
  // If passed a predicate function -> behave like Array.prototype.find
  // Else -> behave like Mongoose's find() returning a chainable .select()
  find: jest.fn((arg) => {
    if (typeof arg === "function") {
      return usersModelMock._data.find(arg);
    }
    return { select: selectMock };
  }),
  // Utility to swap dataset in a test
  __setData(arr) {
    usersModelMock._data = arr;
  },
};

jest.mock("../models/User", () => usersModelMock);

// --- Mock Habit with a chainable populate pattern
const Habit = {
  find: jest.fn(),
};
jest.mock("../models/Habit", () => Habit);

// SUT
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserAllHabits,
} = require("../controllers/userController");

// Helper
const resFactory = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  usersModelMock.__setData([...usersSeed]);
  selectMock.mockClear().mockResolvedValue(
    usersSeed.map(({ password, ...rest }) => rest)
  );
});

// -------- getUserProfile --------
describe("getUserProfile", () => {
  test("200 when user exists", async () => {
    const req = { params: { id: "u1" } };
    const res = resFactory();

    await getUserProfile(req, res);

    expect(usersModelMock.find).toHaveBeenCalledWith(expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile retrieved successfully",
      user: expect.objectContaining({ id: "u1", fullName: "Alice A" }),
    });
  });

  test("404 when user not found", async () => {
    usersModelMock.__setData([]); // no users
    const req = { params: { id: "nope" } };
    const res = resFactory();

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});

// -------- updateUserProfile --------
describe("updateUserProfile", () => {
  test("200 updates allowed fields; strips forbidden fields", async () => {
    const req = {
      params: { id: "u2" },
      body: {
        fullName: "Bob Updated",
        email: "new@should-not-apply.com",
        password: "newpass",
        username: "newuser",
        _id: "hack",
        createdAt: "hack",
        updatedAt: "hack",
        extra: "ok",
      },
    };
    const res = resFactory();

    await updateUserProfile(req, res);

    // user with id u2 should be updated
    const updated = usersModelMock._data.find((u) => u.id === "u2");
    expect(updated.fullName).toBe("Bob Updated");
    expect(updated.extra).toBe("ok");
    // forbidden fields must NOT be applied
    expect(updated.email).toBe("b@x.com");
    expect(updated.password).toBe("hash2");
    expect(updated.username).toBeUndefined();
    expect(updated._id).toBeUndefined();
    expect(updated.createdAt).toBeUndefined();
    expect(updated.updatedAt).toBeUndefined();

    expect(res.json).toHaveBeenCalledWith({
      message: "User profile updated successfully",
      user: updated,
    });
  });

  test("500 when user missing (matches current code path)", async () => {
    // NOTE: In controller, Object.assign(user, updates) happens BEFORE the null-check.
    // If user is undefined, this throws and is caught -> 500.
    usersModelMock.__setData([]); // no users
    const req = { params: { id: "ghost" }, body: { fullName: "X" } };
    const res = resFactory();

    await updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error updating user profile",
    });
  });
});

// -------- getAllUsers --------
describe("getAllUsers", () => {
  test("200 returns users without passwords", async () => {
    const req = {};
    const res = resFactory();

    await getAllUsers(req, res);

    expect(usersModelMock.find).toHaveBeenCalledWith();
    expect(selectMock).toHaveBeenCalledWith("-password");
    expect(res.json).toHaveBeenCalledWith(
      usersSeed.map(({ password, ...rest }) => rest)
    );
  });

  test("500 on error from select()", async () => {
    selectMock.mockRejectedValueOnce(new Error("db boom"));
    const req = {};
    const res = resFactory();

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error retrieving user profile",
    });
  });
});

// -------- getUserAllHabits --------
describe("getUserAllHabits", () => {
  test("400 when userId missing", async () => {
    const req = { params: {} };
    const res = resFactory();

    await getUserAllHabits(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "userId is required" });
  });

  test("200 returns populated habits", async () => {
    const habits = [{ _id: "h1" }, { _id: "h2" }];

    const populate2 = { populate: jest.fn().mockResolvedValue(habits) };
    const populate1 = { populate: jest.fn().mockReturnValue(populate2) };
    Habit.find.mockReturnValue(populate1);

    const req = { params: { userId: "u1" } };
    const res = resFactory();

    await getUserAllHabits(req, res);

    expect(Habit.find).toHaveBeenCalledWith({ members: "u1" });
    expect(populate1.populate).toHaveBeenCalledWith("members", "fullName email");
    expect(populate2.populate).toHaveBeenCalledWith("createdBy", "fullName email");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "All habit affilited to the user",
      data: habits,
    });
  });

  test("500 on error", async () => {
    const populate2 = { populate: jest.fn().mockRejectedValue(new Error("db")) };
    Habit.find.mockReturnValue({ populate: jest.fn().mockReturnValue(populate2) });

    const req = { params: { userId: "u1" } };
    const res = resFactory();

    await getUserAllHabits(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error retrieving habits",
    });
  });
});

