const { v4: uuidv4 } = require("uuid");
const Habit = require("../models/Habit");
const Users = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// POST /habits
const createHabit = async (req, res) => {
  try {
    //get user id from request that was attached in the auth middleware
    const userId = req.user.id;
    const { title, description, duration, privacy, members, aspect } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!title || !description || !duration || !privacy || !aspect) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const creator = await Users.findById(userId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration - 1);

    let validMembers = [];

    if (privacy === "team") {
      if (!members || !Array.isArray(members) || members.length === 0) {
        return res
          .status(400)
          .json({ message: "Team must include one member" });
      }

      // Remove duplicate emails from request body
      const uniqueMembers = [...new Set(members)];

      // Validate member IDs
      const foundMembers = await Users.find({ email: { $in: uniqueMembers } });
      const foundMemberEmails = foundMembers.map((member) => member.email);

      const missingMembers = members.filter(
        (email) => !foundMemberEmails.includes(email)
      );

      if (missingMembers.length > 0) {
        return res.status(400).json({
          message: `${missingMembers.join(
            ", "
          )} are not members of StreakForce.`,
        });
      }

      validMembers = foundMembers.map((member) => member._id.toJSON());

      // Include creator
      if (!validMembers.includes(userId)) {
        validMembers.push(userId);
      }

      // Remove duplicates
      validMembers = [...new Set(validMembers)];

      // Send email notifications (excluding creator)
      foundMembers.forEach((member) => {
        if (member._id.toString() !== userId) {
          sendEmail({
            to: member.email,
            subject: "New Habit Team Invitation",
            data: {
              recipientName: member.firstName || "there",
              senderName: creator.firstName || "A StreakForce user",
              habitName: title,
              habitDescription: description,
              duration,
              startDate: startDate.toDateString(),
              endDate: endDate.toDateString(),
            },
          }).catch((err) =>
            console.error(`Error sending email to ${member.email}:`, err)
          );
        }
      });
    } else {
      validMembers = [userId];
    }

    // Create habit
    const newHabit = new Habit({
      user: userId,
      createdBy: userId,
      title,
      description,
      duration,
      privacy,
      members: validMembers,
      streak: 0,
      startDate,
      endDate,
      aspect,
    });

    await newHabit.save();

    res.status(201).json({
      message: "Habit created successfully",
      data: newHabit,
      success: true,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({ success: false, message: "Error creating habit" });
  }
};

// GET /habits/:id
const getHabitDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findById(id)
      .populate("members", "fullName email")
      .populate("createdBy", "fullName email");

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({
      message: "Habit details retrieved successfully",
      data: habit,
    });
  } catch (error) {
    console.error("Get habit details error:", error);
    res.status(500).json({ message: "Server error retrieving habit details" });
  }
};

// get all habits
const getAllHabits = async (req, res) => {
  console.log(req.user);
  try {
    //get all habits that the user is a member of
    const userId = req.user.id;

    const habits = await Habit.find({ members: { $in: [userId] } });
    res
      .status(200)
      .json({ message: "All habits retrieved successfully", data: habits });
  } catch (error) {
    console.error("Get all habits error:", error);
    res.status(500).json({ message: "Server error retrieving habits" });
  }
};

// DELETE /habits/:id
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    await Habit.findByIdAndDelete(id);
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(500).json({ message: "Server error deleting habit" });
  }
};

module.exports = {
  createHabit,
  getHabitDetails,
  getAllHabits,
  deleteHabit,
};
