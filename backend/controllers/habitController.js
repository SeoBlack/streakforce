const { v4: uuidv4 } = require("uuid");
const Habit = require("../models/Habit");
const Users = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// POST /habits
const createHabit = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { title, description, duration, privacy, members } = req.body;

    if (!title || !description || !duration || !privacy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
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
          )} are not the member of StreakForce.`,
        });
      }

      validMembers = foundMembers.map((member) => member._id.toJSON());

      //include creator in members
      if (!validMembers.includes(req.user.id)) {
        validMembers.push(req.user.id);
      }

      // Remove duplicate members
      validMembers = [...new Set(validMembers)];

      //send email notifications to members expect creator
      foundMembers.forEach((member) => {
        if (member._id.toString() !== req.user.id) {
          sendEmail({
            to: member.email,
            subject: "New Habit Team Invitation",
            data: {
              recipientName: member.firstName || "there",
              senderName: req.user.firstName || "A StreakForce user",
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
      validMembers = [req.user.id];
    }

    // Create habit
    const newHabit = new Habit({
      user: req.user.id,
      createdBy: req.user.id,
      title,
      description,
      duration,
      privacy,
      members: validMembers,
      streak: 0,
      startDate,
      endDate,
    });
    await newHabit.save();

    res.status(201).json({
      message: "Team habit created successfully",
      data: newHabit,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({ message: "Server error creating habit" });
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
  try {
    const habits = await Habit.find();
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
