// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User profile schema (unchanged)
const userProfileSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, default: "" },
  lastName: { type: String, trim: true, default: "" },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
});

// NEW: stats schema for XP, levels, and streaks
const userStatsSchema = new mongoose.Schema({
  xp: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: 100 }, // XP needed for next level
  },
  level: {
    current: { type: Number, default: 1 },
    title: { type: String, default: "Beginner" },
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
  },
  avatarConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  xpPoints: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  streak: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Main User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      match: /.+@.+\..+/,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: true,
    },
    profile: {
      type: userProfileSchema,
      default: {},
    },
    lastLogin: { type: Date },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    stats: { type: userStatsSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual full name
userSchema.virtual("fullName").get(function () {
  const parts = [this.firstName, this.lastName].filter(Boolean);
  return parts.join(" ");
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Users", userSchema);
