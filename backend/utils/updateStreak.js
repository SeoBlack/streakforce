const Habit = require("../models/Habit");
const CheckIn = require("../models/CheckIn");

//function to run every 10 minutes to update the streak of a habit
const updateStreak = async () => {
  //loop through all habits
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const habits = await Habit.find();
  try {
    for (const habit of habits) {
      //got each habit, get all members
      const members = habit.members;
      console.log(members);
      for (const member of members) {
        //if all members have checked in today, then update the streak + 1 else reset the streak to 0
        const checkIns = await CheckIn.find({
          habitId: habit._id,
          userId: member._id,
          checkInDate: { $gte: startOfDay, $lte: endOfDay },
        });
        if (checkIns.length === members.length) {
          if (habit.duration === habit.streak) {
            return;
          }
          habit.streak = habit.streak + 1;
        } else {
          habit.streak = 0;
        }
        await habit.save();
      }
    }
  } catch (error) {
    console.error("Error updating streak:", error);
  }
};

module.exports = updateStreak;
