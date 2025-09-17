const habits = [];

// POST /habits
const createHabit = async (req, res) => {
  try {
    const habitData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const habit = habits.push(habitData);

    res.status(201).json({
      message: "Habit created successfully",
      habit: habit[habit.length - 1],
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

    const habit = habits.find((habit) => habit.id === id);

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
