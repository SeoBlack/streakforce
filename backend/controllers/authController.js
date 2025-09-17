const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const users = [];

// POST /auth/register
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    //add user to mongo db
    users.push({
      id: uuidv4(),
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
    // Generate token
    //TODO: replace the following logic with actual user registration logic
    const userId = users[users.length - 1].id;
    const token = generateToken(userId);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
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
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate token
    const token = generateToken(user.id);

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

module.exports = {
  register,
  login,
};
