import React from "react";
import HabitItem from "./HabitItem";

const HabitsSection = ({ title, habit, fullInfo }) => {
  return (
    <div className="px-4 sm:px-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        <button className="text-red-500 font-medium text-sm sm:text-base hover:text-red-600 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {habit.map((habit, index) => (
          <HabitItem key={index} habit={habit} fullInfo={fullInfo} />
        ))}
      </div>
    </div>
  );
};

export default HabitsSection;
