const challenges = [];

// POST /challenges
const createChallenge = async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const challenge = challenges.push(challengeData);
    res.status(201).json({
      message: "Challenge created successfully",
      challenge: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        duration: challenge.duration,
        difficulty: challenge.difficulty,
        qrCode: challenge.qrCode,
        createdBy: challenge.createdBy,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        maxParticipants: challenge.maxParticipants,
        isPublic: challenge.isPublic,
      },
    });
  } catch (error) {
    console.error("Create challenge error:", error);
    res.status(500).json({ message: "Server error creating challenge" });
  }
};

// GET /challenges/:id
const getChallengeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = challenges.find((challenge) => challenge.id === id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({
      message: "Challenge details retrieved successfully",
      challenge: challenge,
    });
  } catch (error) {
    console.error("Get challenge details error:", error);
    res
      .status(500)
      .json({ message: "Server error retrieving challenge details" });
  }
};

module.exports = {
  createChallenge,
  getChallengeDetails,
};
