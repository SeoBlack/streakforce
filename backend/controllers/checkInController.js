const CheckIn = require("../models/CheckIn");

// POST /checkins
const submitCheckIn = async (req, res) => {
  try {
    //date is automatically added by the server
    const { habitId } = req.body;
    const userId = req.user.id;
    if (!habitId) {
      return res.status(400).json({ message: "habitId is required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if the user has already checked in today for the same habit
    // Check if date is within today (start of day to end of day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCheckIn = await CheckIn.findOne({
      habitId: habitId,
      userId: userId,
      checkInDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    console.log(todayCheckIn);
    console.log(startOfDay);
    console.log(endOfDay);
    console.log(todayCheckIn?.checkInDate);
    if (todayCheckIn) {
      return res
        .status(400)
        .json({ message: "You have already checked in today for this habit" });
    }
    const dt = new Date();
    const createdCheckIn = {
      habitId,
      checkInDate: dt.toISOString(),
      userId: userId,
    };
    const checkIn = await CheckIn.create(createdCheckIn);
    await checkIn.save();

    res.status(201).json({
      message: "Check-in submitted successfully",
      checkIn: checkIn,
    });
  } catch (error) {
    console.error("Submit check-in error:", error);
    res.status(500).json({ message: "Server error submitting check-in" });
  }
};

// GET /checkins
const getCheckIns = async (req, res) => {
  //get checkins for a user
  const checkIns = await CheckIn.find({ userId: req.user.id });
  console.log(checkIns);
  res.status(200).json(checkIns);
};

const getCheckInsByHabitId = async (req, res) => {
  const { habitId } = req.params;
  const checkIns = await CheckIn.find({
    habitId: habitId,
    userId: req.user.id,
  });
  res.status(200).json(checkIns);
};

module.exports = {
  submitCheckIn,
  getCheckIns,
  getCheckInsByHabitId,
};
