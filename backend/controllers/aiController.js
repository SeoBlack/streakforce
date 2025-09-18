const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  project: process.env.GOOGLE_PROJECT_ID,
});

const executeAiQuery = async (req, res) => {
  try {
    const { query } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });

    res.status(201).json({
      message: "AI query executed successfully",
      result: result.text,
    });
  } catch (error) {
    console.error("AI query execution error:", error);
    res.status(500).json({ message: "Server error during AI query execution" });
  }
};

module.exports = {
  executeAiQuery,
};
