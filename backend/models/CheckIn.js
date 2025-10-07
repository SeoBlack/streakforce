// mongoose schema for check-in
const mongoose = require("mongoose");
const Habit = require("./Habit");

const checkInSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const CheckIn = mongoose.model("CheckIn", checkInSchema);

module.exports = CheckIn;
