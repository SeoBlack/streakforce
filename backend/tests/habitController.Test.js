// __tests__/habitController.test.js
// npm i -D jest
// package.json -> "test": "jest --runInBand"

jest.useFakeTimers().setSystemTime(new Date("2025-01-10T10:00:00Z")); // deterministic dates

// ---- Mocks ----
const saveMock = jest.fn();
const HabitCtor = jest.fn().mockImplementation((doc) => ({
  ...doc,
  _id: "habit-id-1",
  save: saveMock.mockResolvedValue(undefined),
}));

HabitCtor.findById = jest.fn();
HabitCtor.find = jest.fn();
HabitCtor.findByIdAndDelete = jest.fn();

jest.mock("../models/Habit", () => HabitCtor);

jest.mock("../models/User", () => ({
  findById: jest.fn(),
  find: jest.fn(),
}));

jest.mock("../utils/sendEmail", () => jest.fn().mockResolvedValue(undefined));

const Habit = require("../models/Habit");
const Users = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const {
  createHabit,
  getHabitDetails,
  getAllHabits,
  deleteHabit,
} = require("../controllers/habitController");

// ---- helpers ----
const resFactory = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  saveMock.mockClear();
});

// ===== createHabit =====
describe("createHabit", () => {
  const baseBody = {
    title: "Drink Water",
    description: "2L/day",
    duration: 7,
    privacy: "solo",
    aspect: "health",
  };

  test("400 when userId missing", async () => {
    const req = { user: {}, body: baseBody };
    const res = resFactory();

    await createHabit(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
  });

  test("400 when any required field missing", async () => {
    const { aspect, ...missing } = baseBody;
    const req = { user: { id: "u1" }, body: missing };
    const res = resFactory();

    await createHabit(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
  });

  test("404 when creator not found", async () => {
    Users.findById.mockResolvedValue(null);

    const req = { user: { id: "u1" }, body: baseBody };
    const res = resFactory();

    await createHabit(req, res);

    expect(Users.findById).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Creator not found" });
  });

  test("201 solo habit: creates with creator as sole member", async () => {
    Users.findById.mockResolvedValue({ _id: "u1", firstName: "Alice" });

    const req = { user: { id: "u1" }, body: baseBody };
    const res = resFactory();

    await createHabit(req, res);

    // new Habit(...) constructed with expected fields
    expect(Habit).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "u1",
        createdBy: "u1",
        title: "Drink Water",
        description: "2L/day",
        duration: 7,
        privacy: "solo",
        aspect: "health",
        members: ["u1"],
        streak: 0,
        // startDate is next day: 2025-01-11, endDate is start + 6 days: 2025-01-17
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      })
    );
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Habit created successfully",
        success: true,
        data: expect.objectContaining({ title: "Drink Water" }),
      })
    );
    // no team emails
    expect(sendEmail).not.toHaveBeenCalled();
  });

  test("400 team habit: missing members array", async () => {
    Users.findById.mockResolvedValue({ _id: "u1" });

    const req = {
      user: { id: "u1" },
      body: { ...baseBody, privacy: "team", members: [] },
    };
    const res = resFactory();

    await createHabit(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Team must include one member" });
  });

  test("400 team habit: some emails not found", async () => {
    Users.findById.mockResolvedValue({ _id: "u1" });
    // Only one user exists in DB
    Users.find.mockResolvedValue([{ _id: { toJSON: () => "u2" }, email: "b@x.com", firstName: "Bob" }]);

    const req = {
      user: { id: "u1" },
      body: { ...baseBody, privacy: "team", members: ["b@x.com", "miss@x.com"] },
    };
    const res = resFactory();

    await createHabit(req, res);
    expect(Users.find).toHaveBeenCalledWith({ email: { $in: ["b@x.com", "miss@x.com"] } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "miss@x.com are not members of StreakForce.",
    });
  });

  test("201 team habit: dedups members, includes creator, emails sent to others", async () => {
    Users.findById.mockResolvedValue({ _id: "u1", firstName: "Alice" });
    Users.find.mockResolvedValue([
      { _id: { toJSON: () => "u2", toString: () => "u2" }, email: "b@x.com", firstName: "Bob" },
      { _id: { toJSON: () => "u1", toString: () => "u1" }, email: "me@x.com", firstName: "Alice" }, // creator in list
    ]);

    const req = {
      user: { id: "u1" },
      body: { ...baseBody, privacy: "team", members: ["b@x.com", "b@x.com", "me@x.com"] },
    };
    const res = resFactory();

    await createHabit(req, res);

    // ensure creator + member set de-duplicated
    const passed = Habit.mock.calls[0][0];
    expect(new Set(passed.members)).toEqual(new Set(["u2", "u1"]));

    // email only to "Bob", not creator
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "b@x.com",
        subject: "New Habit Team Invitation",
        data: expect.objectContaining({
          senderName: "Alice",
          habitName: "Drink Water",
        }),
      })
    );

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("500 when unexpected error during creation", async () => {
    Users.findById.mockResolvedValue({ _id: "u1" });
    // Make Habit constructor throw
    Habit.mockImplementationOnce(() => {
      throw new Error("boom");
    });

    const req = { user: { id: "u1" }, body: baseBody };
    const res = resFactory();

    await createHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error creating habit" });
  });
});

// ===== getHabitDetails =====
describe("getHabitDetails", () => {
  test("404 when not found", async () => {
    // Simulate chained populates by returning thenables
    const populate2 = { populate: jest.fn().mockResolvedValue(null) };
    Habit.findById.mockReturnValue({ populate: jest.fn().mockReturnValue(populate2) });

    const req = { params: { id: "h1" } };
    const res = resFactory();

    await getHabitDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Habit not found" });
  });

  test("200 when found", async () => {
    const habitDoc = { _id: "h1", title: "Drink Water" };
    const populate2 = { populate: jest.fn().mockResolvedValue(habitDoc) };
    Habit.findById.mockReturnValue({ populate: jest.fn().mockReturnValue(populate2) });

    const req = { params: { id: "h1" } };
    const res = resFactory();

    await getHabitDetails(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Habit details retrieved successfully",
      data: habitDoc,
    });
  });

  test("500 on error", async () => {
    const populate2 = { populate: jest.fn().mockRejectedValue(new Error("db")) };
    Habit.findById.mockReturnValue({ populate: jest.fn().mockReturnValue(populate2) });

    const req = { params: { id: "h1" } };
    const res = resFactory();

    await getHabitDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error retrieving habit details",
    });
  });
});

// ===== getAllHabits =====
describe("getAllHabits", () => {
  test("200 with user’s habits", async () => {
    Habit.find.mockResolvedValue([{ _id: "h1" }]);

    const req = { user: { id: "u1" } };
    const res = resFactory();

    await getAllHabits(req, res);

    expect(Habit.find).toHaveBeenCalledWith({ members: { $in: ["u1"] } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "All habits retrieved successfully",
      data: [{ _id: "h1" }],
    });
  });

  test("500 on error", async () => {
    Habit.find.mockRejectedValue(new Error("db"));

    const req = { user: { id: "u1" } };
    const res = resFactory();

    await getAllHabits(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error retrieving habits",
    });
  });
});

// ===== deleteHabit =====
describe("deleteHabit", () => {
  test("404 when habit not found", async () => {
    Habit.findById.mockResolvedValue(null);

    const req = { params: { id: "h1" }, user: { id: "u1" } };
    const res = resFactory();

    await deleteHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Habit not found" });
  });

  test("403 when user is not creator", async () => {
    Habit.findById.mockResolvedValue({ createdBy: { toString: () => "u2" } });

    const req = { params: { id: "h1" }, user: { id: "u1" } };
    const res = resFactory();

    await deleteHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized" });
  });

  test("200 when deleted by creator", async () => {
    Habit.findById.mockResolvedValue({ createdBy: { toString: () => "u1" } });
    Habit.findByIdAndDelete.mockResolvedValue(undefined);

    const req = { params: { id: "h1" }, user: { id: "u1" } };
    const res = resFactory();

    await deleteHabit(req, res);

    expect(Habit.findByIdAndDelete).toHaveBeenCalledWith("h1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Habit deleted successfully" });
  });

  test("500 on error", async () => {
    Habit.findById.mockRejectedValue(new Error("db"));

    const req = { params: { id: "h1" }, user: { id: "u1" } };
    const res = resFactory();

    await deleteHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error deleting habit" });
  });
});
