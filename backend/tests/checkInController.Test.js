// __tests__/checkInController.test.js
// npm i -D jest
// package.json: { "scripts": { "test": "jest --runInBand" } }

jest.mock("../models/CheckIn", () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
}));

const CheckIn = require("../models/CheckIn");
const controller = require("../controllers/checkInController");

const makeRes = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("submitCheckIn", () => {
  test("400 when habitId missing", async () => {
    const req = { body: {}, user: { id: "u1" } };
    const res = makeRes();

    await controller.submitCheckIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "habitId is required" });
  });

  test("401 when user not authorized (no userId)", async () => {
    const req = { body: { habitId: "h1" }, user: {} };
    const res = makeRes();

    await controller.submitCheckIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  test("400 when already checked in today", async () => {
    const req = { body: { habitId: "h1" }, user: { id: "u1" } };
    const res = makeRes();

    CheckIn.findOne.mockResolvedValue({
      _id: "ci1",
      habitId: "h1",
      userId: "u1",
      checkInDate: new Date(),
    });

    await controller.submitCheckIn(req, res);

    // called with today bounds
    expect(CheckIn.findOne).toHaveBeenCalledWith({
      habitId: "h1",
      userId: "u1",
      checkInDate: {
        $gte: expect.any(Date),
        $lt: expect.any(Date),
      },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "You have already checked in today for this habit",
    });
  });

  test("201 when created successfully", async () => {
    const req = { body: { habitId: "h1" }, user: { id: "u1" } };
    const res = makeRes();

    CheckIn.findOne.mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const createdDoc = { id: "ci2", habitId: "h1", userId: "u1", save: saveMock };
    CheckIn.create.mockResolvedValue(createdDoc);

    await controller.submitCheckIn(req, res);

    // ensure creation payload had fields we expect
    expect(CheckIn.create).toHaveBeenCalledWith(
      expect.objectContaining({
        habitId: "h1",
        userId: "u1",
        checkInDate: expect.any(String), // ISO string in controller
      })
    );
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Check-in submitted successfully",
      checkIn: createdDoc,
    });
  });

  test("500 on unexpected error", async () => {
    const req = { body: { habitId: "h1" }, user: { id: "u1" } };
    const res = makeRes();

    CheckIn.findOne.mockResolvedValue(null);
    CheckIn.create.mockRejectedValue(new Error("DB down"));

    await controller.submitCheckIn(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error submitting check-in",
    });
  });
});

describe("getCheckIns", () => {
  test("200 with list for user", async () => {
    const req = { user: { id: "u1" } };
    const res = makeRes();

    const list = [{ id: "a" }, { id: "b" }];
    CheckIn.find.mockResolvedValue(list);

    await controller.getCheckIns(req, res);

    expect(CheckIn.find).toHaveBeenCalledWith({ userId: "u1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(list);
  });
});

describe("getCheckInsByHabitId", () => {
  test("200 with list for given habit", async () => {
    const req = { params: { habitId: "h1" }, user: { id: "u1" } };
    const res = makeRes();

    const list = [{ id: "c1" }];
    CheckIn.find.mockResolvedValue(list);

    await controller.getCheckInsByHabitId(req, res);

    expect(CheckIn.find).toHaveBeenCalledWith({
      habitId: "h1",
      userId: "u1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(list);
  });
});
