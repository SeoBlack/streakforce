const { v4: uuidv4 } = require("uuid");

const checkIns = [
  {
    id: "testcheckin1",
    habitId: "1",
    checkInDate: "2025-01-01",
    userId: "1",
  },

  {
    id: uuidv4(),
    habitId: "2",
    checkInDate: "2025-01-02",
    userId: "2",
  },
];
// POST /checkins
const submitCheckIn = async (req, res) => {
  try {
    const { habitId, checkInDate } = req.body;
    if (!habitId || !checkInDate) {
      return res
        .status(400)
        .json({ message: "habitId and checkInDate are required" });
    }
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const dt = new Date(checkInDate);
    if (Number.isNaN(dt.getTime())) {
      return res.status(400).json({ message: "checkInDate must be ISO-8601" });
    }
    const createdCheckIn = {
      id: uuidv4(),
      habitId,
      checkInDate: dt.toISOString(),
      userId: req.user.id,
    };
    checkIns.push(createdCheckIn);

    res.status(201).json({
      message: "Check-in submitted successfully",
      checkIn: checkIns[checkIns.length - 1],
    });
  } catch (error) {
    console.error("Submit check-in error:", error);
    res.status(500).json({ message: "Server error submitting check-in" });
  }
};

module.exports = {
  submitCheckIn,
};
