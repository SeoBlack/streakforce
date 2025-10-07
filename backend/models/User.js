// mongoose schema for user
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
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
      required: false, //not required for google auth
      minlength: 6,
      select: true,
    },
    profile: {
      type: userProfileSchema,
      default: {},
    },
    lastLogin: {
      type: Date,
    },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        //this will on each returned object
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  const parts = [this.firstName, this.lastName].filter(Boolean);
  return parts.join(" ");
});

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

//a function to check if entered password is correct
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Users", userSchema);
