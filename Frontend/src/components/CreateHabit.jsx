import React, { useState } from "react";
import { User, Users } from "lucide-react";
import Input from "./UI/Input";
import CustomSelect from "./UI/CustomSelect";
import EmojiePicker from "./UI/EmojiePicker";

const CreateHabit = ({
  loading,
  habitName,
  habitDescription,
  duration,
  emoji,
  onHabitNameChange,
  onDurationChange,
  onEmojiSelect,
  onHabitDescriptionChange,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(emoji || "🚀");

  const durations = [
    { value: 7, label: "7 days", icon: "🗓️" },
    { value: 14, label: "14 days", icon: "🗓️" },
    { value: 30, label: "30 days", icon: "🗓️" },
    { value: 60, label: "60 days", icon: "🗓️" },
  ];

  const handleDurationSelect = (selectedDuration) => {
    onDurationChange(selectedDuration);
  };

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };
  const handleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 ml-4">Habit Name</h3>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 rounded flex items-center justify-center">
            <button onClick={handleShowEmojiPicker}>{selectedEmoji}</button>
          </div>
          <div className="absolute right-4 top-1/2 bg-white">
            {showEmojiPicker && (
              <EmojiePicker handleEmojiSelect={handleEmojiSelect} />
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
