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
    const { habitId, checkInDate, userId } = req.body;
    // TODO: replace the following logic with actual check-in submission logic
    checkIns.push({
      id: uuidv4(),
      habitId: habitId,
      checkInDate: checkInDate,
      userId: userId,
    });

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
