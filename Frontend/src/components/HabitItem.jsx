import React from "react";
import { Flame, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../context/habitContextBase";
import Icon from "./UI/Icon";

const HabitItem = ({ habit, fullInfo = false }) => {
  const navigate = useNavigate();
  const { setSelectedHabit } = useHabits();
  const handleClick = () => {
    setSelectedHabit(habit);
    navigate(`/habits/${habit._id}`);
  };
  return (
    <div
      className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-18 h-18 ${habit.iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon iconName={habit.aspect} size={8} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg sm:text-base">
            {habit.title}
          </h3>
          <p className="text-gray-500 text-lg sm:text-sm">
            {habit.description}
          </p>
          <div className="flex items-center space-x-1 text-gray-500">
            {habit.members?.length || 0}
            <Users className="ml-1 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Flame className="w-6 h-6 text-orange-500" />
        <span className="font-bold text-orange-500 text-lg sm:text-base">
          {habit.streak}
        </span>
      </div>
    </div>
  );
};

export default HabitItem;
