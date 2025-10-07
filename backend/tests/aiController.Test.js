// aiController.test.js
// npm i -D jest
// If you use TypeScript add @types/jest as well.

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
}));

const { GoogleGenAI } = require("@google/genai");

describe("executeAiQuery controller", () => {
  // Build a fresh mocked instance for each test
  let generateContentMock;

  // Load controller after mocks are prepared
  let controller;

  const makeRes = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res;
  };

  const importController = () => {
    // Import (require) dynamically after setting up env + mocks
    // Adjust the path below to match your project structure/name
    // e.g., "../controllers/aiController" or "../controllers/aiControllers"
    // eslint-disable-next-line global-require
    return require("../controllers/aiController"); // <-- change if your file is aiControllers.js
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env.GOOGLE_PROJECT_ID = "test-project-id";

    generateContentMock = jest.fn().mockResolvedValue({ text: "hello-from-gemini" });

    // Each new GoogleGenAI() returns an object with .models.generateContent
    GoogleGenAI.mockImplementation(() => ({
      models: { generateContent: generateContentMock },
    }));

    controller = importController();
  });

  test("returns 400 if query is missing", async () => {
    const req = {
      body: {}, // no query
      user: { firstName: "A", lastName: "B", _id: "uid123" },
    };
    const res = makeRes();

    await controller.executeAiQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Query is required" });
    // Ensure model wasn’t called
    expect(generateContentMock).not.toHaveBeenCalled();
  });

  
  

  test("returns 500 when Gemini throws", async () => {
    generateContentMock.mockRejectedValueOnce(new Error("boom"));

    const req = {
      body: { query: "any" },
      user: { firstName: "X", lastName: "Y", _id: "u1" },
    };
    const res = makeRes();

    await controller.executeAiQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    // Only check that we return the expected message key (your code returns a fixed string)
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error during AI query execution",
    });
  });
});
