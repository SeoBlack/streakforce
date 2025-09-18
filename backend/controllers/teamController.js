const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require("uuid");

const teams = [
  {
    id: "testteam1",
    name: "Team 1",
    description: "Team 1 description",
    inviteCode: "12345678",
    isPrivate: false,
    maxMembers: 10,
    createdBy: "1",
  },
  {
    id: uuidv4(),
    name: "Team 2",
    description: "Team 2 description",
    inviteCode: "12345678",
    isPrivate: false,
    maxMembers: 10,
    createdBy: "2",
  },
];

// POST /teams
const createTeam = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers, createdBy } = req.body;

    // Generate unique invite code
    const inviteCode = nanoid(8).toUpperCase();

    const teamData = {
      name,
      description,
      inviteCode,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 10,
      createdBy: createdBy,
      members: [
        {
          user: createdBy,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    };

    teams.push(teamData);

    res.status(201).json({
      message: "Team created successfully",
      team: teamData,
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
