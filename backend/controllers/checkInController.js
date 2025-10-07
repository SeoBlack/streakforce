const CheckIn = require("../models/CheckIn");
const Users = require("../models/User");

// XP/level helper
const getLevelTitle = (level) => {
  if (level < 10) return "Beginner";
  if (level < 20) return "Intermediate";
  if (level < 30) return "Advanced";
  return "Master";
};

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
      habitId,
      userId,
      checkInDate: { $gte: startOfDay, $lt: endOfDay },
    });

    if (todayCheckIn) {
      return res
        .status(400)
        .json({ message: "You have already checked in today for this habit" });
    }

    // Create check-in record
    const newCheckIn = await CheckIn.create({
      habitId,
      userId,
      checkInDate: new Date(),
    });

    // Fetch user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize stats if not present
    if (!user.stats) {
      user.stats = {
        xp: { current: 0, total: 100 },
        level: { current: 1, title: "Beginner" },
        streak: { current: 0, longest: 0 },
      };
    }

    // === 🧩 XP and Level Logic ===
    const earnedXp = 10;
    user.stats.xp.current += earnedXp;

    const xpNeeded = 100 * user.stats.level.current;
    if (user.stats.xp.current >= xpNeeded) {
      user.stats.xp.current -= xpNeeded;
      user.stats.level.current += 1;
      user.stats.level.title = getLevelTitle(user.stats.level.current);
    }
    user.stats.xp.total = xpNeeded;

    // === 🔥 Streak Logic ===
    const today = new Date();
    const lastCheck = user.stats.streak.lastCheckIn
      ? new Date(user.stats.streak.lastCheckIn)
      : null;

    const oneDay = 24 * 60 * 60 * 1000;
    if (lastCheck && today - lastCheck <= oneDay * 1.5) {
      // within 36 hours → continue streak
      user.stats.streak.current += 1;
    } else {
      user.stats.streak.current = 1;
    }

    if (user.stats.streak.current > user.stats.streak.longest) {
      user.stats.streak.longest = user.stats.streak.current;
    }

    user.stats.streak.lastCheckIn = today;

    await user.save();

    res.status(201).json({
      message: "Check-in successful",
      xpEarned: earnedXp,
      progress: {
        xpPoints: user.stats.xp,
        level: user.stats.level,
        streak: {
          current: user.stats.streak.current,
          longest: user.stats.streak.longest,
        },
      },
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
