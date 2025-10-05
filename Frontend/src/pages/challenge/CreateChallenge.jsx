import { ArrowLeft, Link as LinkIcon, Trophy } from "lucide-react";
import { useState } from "react";
import CreateHabit from "../../components/CreateHabit";
import EmailInput from "../../components/EmailInput";
import Button from "../../components/Button";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const CreateChallenge = () => {
  const [habitName, setHabitName] = useState("");
  const [duration, setDuration] = useState(30);
  const [privacy, setPrivacy] = useState("team");
  const [emails, setEmails] = useState([]);
  const { user, apiCall } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!habitName || !duration || !privacy) {
      alert("Please fill in all the required fields.");
      return;
    }
    if (!user?._id) {
      alert("User not found");
      return;
    }
    const habitData = {
      title: habitName,
      duration: duration,
      privacy: privacy,
      description: habitName,
      members: emails,
    };
    console.log("habitData", habitData);
    console.log("user._id", user._id);
    try {
      const response = await apiCall(`/habits/${user._id}`, {
        method: "POST",
        body: JSON.stringify(habitData),
      });
      console.log("Habit created:", response);
      alert("Habit created successfully!");
      navigate("/team");
    } catch (error) {
      console.error("Error creating habit:", error);
      alert(error.message || "Failed to create habit.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="max-w-5xl mx-auto w-full bg-white shadow-sm p-4 flex items-center gap-3">
        <button
          aria-label="Go back"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Create a New Habit
        </h1>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <p className="text-gray-600 text-center text-md mb-6">
          Set your challenge and invite teammates
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <CreateHabit
              habitName={habitName}
              duration={duration}
              privacy={privacy}
              onHabitNameChange={setHabitName}
              onDurationChange={setDuration}
              onPrivacyChange={setPrivacy}
            />
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col">
            <h3 className="text-gray-900 font-medium mb-4">Invite Teammates</h3>

            <div className="mb-4">
              <Button
                aria-label="Generate invite code"
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-all font-medium"
              >
                <LinkIcon className="w-4 h-4" />
                Generate Invite Code
              </Button>
            </div>

            <p className="text-center text-gray-500 text-sm mb-4">
              Or enter emails manually
            </p>

            <EmailInput emails={emails} onEmailsChange={setEmails} />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-color-1 text-white py-5 px-8 rounded-lg font-medium hover:bg-color-2 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Create Challenge
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateChallenge;
