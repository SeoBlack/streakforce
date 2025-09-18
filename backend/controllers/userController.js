const { v4: uuidv4 } = require("uuid");
const users = [
  {
    id: "testuser1",
    username: "test",
    email: "test@test.com",
    password: "test",
    firstName: "test",
    lastName: "test",
  },
  {
    id: uuidv4(),
    username: "test2",
    email: "test2@test.com",
    password: "test2",
    firstName: "test2",
    lastName: "test2",
  },
  {
    id: uuidv4(),
    username: "test3",
    email: "test3@test.com",
    password: "test3",
    firstName: "test3",
    lastName: "test3",
  },
];

// GET /users/:id
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);
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

// PUT /users/:id
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists and is the same as the authenticated user
    //TODO: replace the following logic with actual user profile update logic
    // Remove fields that shouldn't be updated
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = users.find((user) => user.id === id);
    Object.assign(user, updates);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error updating user profile" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
