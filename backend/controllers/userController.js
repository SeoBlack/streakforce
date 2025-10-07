const { v4: uuidv4 } = require("uuid");
const Users = require("../models/User");
const Habit = require("../models/Habit");

// GET /users/:id
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //TODO: replace the following logic with actual user profile retrieval logic
    res.json({
      message: "User profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error retrieving user profile" });
  }
};

// PUT /users/:id
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists and is the same as the authenticated user
    //TODO: replace the following logic with actual user profile update logic
    // Remove fields that shouldn't be updated
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = Users.find((user) => user.id === id);
    Object.assign(user, updates);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Object.assign(user, updates);

    res.json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error updating user profile" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error retrieving user profile" });
  }
};

const getUserAllHabits = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching habits for userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const habits = await Habit.find({ members: userId })
      .populate("members", "fullName email")
      .populate("createdBy", "fullName email");

    res
      .status(200)
      .json({ message: "All habit affilited to the user", data: habits });
  } catch (error) {
    console.error("Get all habits by user error:", error);
    res.status(500).json({ message: "Server error retrieving habits" });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Default values for new users
    const xp = user.stats?.xp || { current: 0, total: 100 };
    const level = user.stats?.level || {
      current: 1,
      title: "Beginner",
    };
    const streak = user.stats?.streak || {
      current: 0,
      longest: 0,
    };

    // XP to next level
    const nextLevelXp = xp.total - xp.current;

    res.status(200).json({
      xpPoints: {
        current: xp.current,
        total: xp.total,
        nextLevel: nextLevelXp,
      },
      level: {
        current: level.current,
        title: level.title,
      },
      streak: {
        current: streak.current,
        longest: streak.longest,
      },
    });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    res.status(500).json({ message: "Server error fetching progress" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserAllHabits,
  getUserProgress,
};
