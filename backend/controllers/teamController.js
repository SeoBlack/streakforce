const { nanoid } = require("nanoid");

const teams = [];

// POST /teams
const createTeam = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    // Generate unique invite code
    const inviteCode = nanoid(8).toUpperCase();

    const teamData = {
      name,
      description,
      inviteCode,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 10,
      createdBy: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    };

    const team = teams.push(teamData);

    res.status(201).json({
      message: "Team created successfully",
      team: team[team.length - 1],
    });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ message: "Server error creating team" });
  }
};

// GET /teams/:id
const getTeamDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const team = teams.find((team) => team.id === id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is a member of this team
    //TODO: replace the following logic with actual team member retrieval logic
    res.json({
      message: "Team details retrieved successfully",
      team: team,
    });
  } catch (error) {
    console.error("Get team details error:", error);
    res.status(500).json({ message: "Server error retrieving team details" });
  }
};

module.exports = {
  createTeam,
  getTeamDetails,
};
