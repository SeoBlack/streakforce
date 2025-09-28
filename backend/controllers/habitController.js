const { v4: uuidv4 } = require("uuid");
const Habit = require("../models/Habit");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// POST /habits
const createHabit = async (req, res) => {
  try {
    const { name, description, duration, privacy, members } = req.body;

    if (!name || !description || !duration || !privacy) {
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

      // Validate member IDs
      const foundMembers = await User.find({ email: { $in: members } });
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

      validMembers = foundMembers.map((member) => member._id);

      //send email notifications to members
      foundMembers.forEach((member) => {
        sendEmail({
          to: member.email,
          subject: "New Habit Team Invitation",
          data: {
            recipientName: member.firstName || "there",
            senderName: req.user.firstName || "A StreakForce user",
            habitName: name,
            habitDescription: description,
            duration,
            startDate: startDate.toDateString(),
            endDate: endDate.toDateString(),
          },
        }).catch((err) =>
          console.error(`Error sending email to ${member.email}:`, err)
        );
      });

      // Create habit
      const newHabit = new Habit({
        user: req.user.id,
        createdBy: req.user.id,
        name,
        description,
        duration,
        privacy,
        members: validMembers,
        startDate,
        endDate,
      });
      await newHabit.save();

      res.status(201).json({
        message: "Team habit created successfully",
        habit: {
          id: uuidv4(),
          name,
          description,
          duration,
          privacy,
          members: validMembers || [],
          startDate,
          endDate,
          createdBy: req.user.id,
        },
      });
    }
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({ message: "Server error creating habit" });
  }
};

// GET /habits/:id
const getHabitDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = Habit.find((habit) => habit.id === id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({
      message: "Habit details retrieved successfully",
      habit: habit,
    });
  } catch (error) {
    console.error("Get habit details error:", error);
    res.status(500).json({ message: "Server error retrieving habit details" });
  }
};

module.exports = {
  createHabit,
  getHabitDetails,
};
