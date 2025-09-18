const { v4: uuidv4 } = require("uuid");
const habits = [
  {
    id: "testhabit1",
    name: "Habit 1",
    description: "Habit 1 description",
    createdBy: "1",
  },

  {
    id: uuidv4(),
    name: "Habit 2",
    description: "Habit 2 description",
    createdBy: "2",
  },

  {
    id: uuidv4(),
    name: "Habit 3",
    description: "Habit 3 description",
    createdBy: "3",
  },
];

// POST /habits
const createHabit = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const habitData = {
      id: uuidv4(),
      name: name,
      description: description,
      createdBy: createdBy,
    };

    habits.push(habitData);

    res.status(201).json({
      message: "Habit created successfully",
      habit: habitData,
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
