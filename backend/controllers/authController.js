const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /auth/google-auth
//login user if exists else register user
const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "access_token is required" });
    }

    // Use the access token to get user info from Google's API
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const userInfo = await response.json();
    console.log("Google user info:", userInfo);

    const userid = userInfo.id;
    const user = await User.findOne({ googleId: userid });

    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token, user });
    } else {
      const newUser = await User.create({
        email: userInfo.email,
        profile: {
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          profilePicture: userInfo.picture,
          bio: userInfo.bio,
        },
        googleId: userid,
      });
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token, user: newUser });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Authentication failed", error: err.message });
  }
};

// POST /auth/register
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    //add user to mongo db
    const user = await User.create({
      //password will be hashed by the model pre save function
      email,
      password,
      firstName,
      lastName,
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    //TODO: replace the following logic with actual user login logic
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // matched password

    // Update last login
    user.lastLogin = new Date();

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// verify token
// GET /auth/verify
const verifyToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ user: user });
};

module.exports = {
  register,
  login,
  verifyToken,
  googleAuth,
};
