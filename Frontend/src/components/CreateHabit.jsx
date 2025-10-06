import React, { useState } from "react";
import { User, Users } from "lucide-react";

const CreateHabit = ({
  habitName,
  duration,
  privacy,
  onHabitNameChange,
  onDurationChange,
  onPrivacyChange,
}) => {
  const [customDuration, setCustomDuration] = useState("");

  const durations = [7, 30, 60];

  const handleDurationSelect = (selectedDuration) => {
    setCustomDuration("");
    onDurationChange(selectedDuration);
  };

  const handleCustomDurationChange = (value) => {
    setCustomDuration(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onDurationChange(numValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 ml-4">Habit Name</h3>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">📖</span>
          </div>
          <input
            type="text"
            value={habitName}
            onChange={(e) => onHabitNameChange(e.target.value)}
            placeholder="e.g., Read 10 pages"
            className="w-full pl-14 pr-4 py-5 bg-gray-300 border-0 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold ml-4 mb-3">Duration</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => handleDurationSelect(dur)}
                className={`py-4 px-4 rounded-xl text-center font-medium transition-all ${
                  duration === dur && !customDuration
                    ? "bg-red-400 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="text-xl font-bold">{dur}</div>
                <div className="text-sm">days</div>
              </button>
            ))}
          </div>
          <input
            type="number"
            value={customDuration}
            onChange={(e) => handleCustomDurationChange(e.target.value)}
            placeholder="Custom days"
            className={`w-full py-5 px-4 rounded-xl text-center font-medium transition-all ${
              customDuration
                ? "bg-red-400 text-white placeholder-red-200"
                : "bg-gray-300 text-gray-600 placeholder-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-red-400`}
          />
          {customDuration && (
            <p className="text-center text-gray-600">{customDuration} days</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold ml-4 mb-3">Privacy</h3>
        <div className="flex gap-3">
          <button
            onClick={() => onPrivacyChange("solo")}
            className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-xl font-medium transition-all ${
              privacy === "solo"
                ? "bg-red-400 text-white shadow-lg"
                : "bg-gray-300 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Solo</span>
          </button>

          <button
            onClick={() => onPrivacyChange("team")}
            className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-xl font-medium transition-all ${
              privacy === "team"
                ? "bg-red-400 text-white shadow-lg"
                : "bg-gray-300 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateHabit;
