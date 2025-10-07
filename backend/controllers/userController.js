const { v4: uuidv4 } = require("uuid");
const Users = require("../models/User");
const Habit = require("../models/Habit");

// GET /users/:id
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = Users.find((user) => user.id === id);
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

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const restrictedFields = [
      "password",
      "email",
      "username",
      "_id",
      "createdAt",
      "updatedAt",
    ];
    restrictedFields.forEach((field) => delete updates[field]);

    // If fullName is provided, split into firstName + lastName
    if (updates.fullName) {
      const parts = updates.fullName.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      updates.profile = {
        ...(updates.profile || {}),
        firstName,
        lastName,
      };
      delete updates.fullName; // remove virtual field
    }

    const profileUpdates = updates.profile || {};
    delete updates.profile;

    const filteredUserUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null && value !== "") {
        filteredUserUpdates[key] = value;
      }
    }

    const filteredProfileUpdates = {};
    for (const [key, value] of Object.entries(profileUpdates)) {
      if (value !== undefined && value !== null && value !== "") {
        filteredProfileUpdates[`profile.${key}`] = value;
      }
    }

    const finalUpdates = { ...filteredUserUpdates, ...filteredProfileUpdates };

    const user = await Users.findByIdAndUpdate(
      id,
      { $set: finalUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserAllHabits,
};
