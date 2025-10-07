import React, { useState } from "react";
import { User, Users } from "lucide-react";
import Input from "./UI/Input";
import CustomSelect from "./UI/CustomSelect";
import EmojiePicker from "./UI/EmojiePicker";
import Icon from "./UI/Icon";

const CreateHabit = ({
  loading,
  habitName,
  habitDescription,
  duration,
  aspect,
  onHabitNameChange,
  onDurationChange,
  onAspectSelect,
  onHabitDescriptionChange,
}) => {
  const [showAspectPicker, setShowAspectPicker] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(aspect || "Health");

  const durations = [
    { value: 7, label: "7 days", icon: "🗓️" },
    { value: 14, label: "14 days", icon: "🗓️" },
    { value: 30, label: "30 days", icon: "🗓️" },
    { value: 60, label: "60 days", icon: "🗓️" },
  ];

  const handleDurationSelect = (selectedDuration) => {
    onDurationChange(selectedDuration);
  };

  const handleAspectSelect = (aspect) => {
    onAspectSelect(aspect);
    setSelectedAspect(aspect);
    setShowAspectPicker(false);
  };
  const handleShowAspectPicker = () => {
    setShowAspectPicker(!showAspectPicker);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 ml-4">Habit Name</h3>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded flex items-center justify-center">
            <button onClick={handleShowAspectPicker}>
              {<Icon iconName={selectedAspect} size={4} />}
            </button>
          </div>
          <div className="absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-lg">
            {showAspectPicker && (
              <EmojiePicker
                handleSelect={handleAspectSelect}
                value={selectedAspect}
              />
            )}
          </div>
          <Input
            disabled={loading}
            value={habitName}
            onChange={onHabitNameChange}
            placeholder="e.g., Read 10 pages"
            withIcon={true}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2 ml-4 mt-4">
          Habit Description
        </h3>

        <div>
          <Input
            disabled={loading}
            value={habitDescription}
            onChange={onHabitDescriptionChange}
            placeholder="e.g., Read 10 pages every day"
          />
        </div>
      </div>
      <CustomSelect
        options={durations}
        value={duration}
        handleSelect={handleDurationSelect}
        title="Duration"
      />
    </div>
  );
};

export default CreateHabit;
