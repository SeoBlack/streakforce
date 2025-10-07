import { ArrowLeft, Link as LinkIcon, Trophy } from "lucide-react";
import { useState } from "react";
import CreateHabit from "../../components/CreateHabit";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";
import InviteFriends from "../../components/InviteFriends";
import { toast } from "react-toastify";
import { useHabits } from "../../context/habitContextBase";

const CreateChallenge = () => {
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [privacy, setPrivacy] = useState("team");
  const [emails, setEmails] = useState([]);
  const [aspect, setAspect] = useState("health");
  const { createHabit } = useHabits();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    //go back to previous page
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!habitName || !duration || !privacy) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const habitData = {
      title: habitName,
      duration: duration,
      privacy: privacy,
      description: habitDescription,
      members: emails,
      aspect: aspect,
    };
    try {
      setLoading(true);
      const response = await createHabit(habitData);
      if (response.success) {
        toast.success("Habit created successfully!");
        navigate("/habits");
      } else {
        toast.error(response.error || "Failed to create habit.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create habit.");
    } finally {
      setLoading(false);
    }
  };
  const handleChangeEmails = (emails) => {
    setEmails(emails);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className=" mx-auto w-full bg-white shadow-sm p-4 flex items-center gap-3">
        <button
          onClick={handleGoBack}
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
              loading={loading}
              habitName={habitName}
              habitDescription={habitDescription}
              duration={duration}
              privacy={privacy}
              aspect={aspect}
              onHabitNameChange={setHabitName}
              onHabitDescriptionChange={setHabitDescription}
              onDurationChange={setDuration}
              onPrivacyChange={setPrivacy}
              onAspectSelect={setAspect}
            />
          </div>

          <InviteFriends
            emails={emails}
            onEmailsChange={handleChangeEmails}
            privacy={privacy}
            onPrivacyChange={setPrivacy}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-color-1 text-white py-5 px-8 rounded-lg font-medium hover:bg-color-2 flex items-center gap-2"
            disabled={loading}
          >
            <Trophy className="w-5 h-5" />
            Create Habit
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateChallenge;
