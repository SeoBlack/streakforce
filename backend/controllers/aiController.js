const { GoogleGenAI } = require("@google/genai");

if (!process.env.GOOGLE_PROJECT_ID) {
  throw new Error("GOOGLE_PROJECT_ID environment variable is required");
}

const ai = new GoogleGenAI({
  project: process.env.GOOGLE_PROJECT_ID,
});

const executeAiQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const user = req.user; // Available from auth middleware

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });

    res.status(200).json({
      message: "AI query executed successfully",
      result: result.text,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("AI query execution error:", error);
    res.status(500).json({ message: "Server error during AI query execution" });
  }
};

module.exports = {
  executeAiQuery,
};
