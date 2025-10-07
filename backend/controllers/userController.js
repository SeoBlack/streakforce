const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// GET /users/:id
const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User profile retrieved successfully",
      user: {
        ...user.profile.toObject(),
        user_id: user._id,
      },
    });
  } catch (error) {
    console.error("Get user profile by id error:", error);
    res.status(500).json({ message: "Server error retrieving user profile" });
  }
};

// GET /users/profile - Get current user's profile
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Get my profile error:", error);
    res.status(500).json({ message: "Server error retrieving user profile" });
  }
};

// PUT /users/profile - Update current user's profile
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.password;
    delete updates.email;
    delete updates.googleId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    if (updates.profile) {
      user.profile = {
        ...user.profile,
        ...updates.profile,
      };
    }

    // Apply other updates
    Object.keys(updates).forEach((key) => {
      if (key !== "profile") {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update my profile error:", error);
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
  getMyProfile,
  updateMyProfile,
  getUserProfileById,
  getAllUsers,
  getUserAllHabits,
  getUserProgress,
};
