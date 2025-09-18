import React from "react";
import { Flame } from "lucide-react";

interface HabitItemProps {
  icon: React.ReactNode;
  title: string;
  streak: string;
  streakCount: number;
  iconBg: string;
}

const HabitItem: React.FC<HabitItemProps> = ({
  icon,
  title,
  streak,
  streakCount,
  iconBg,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div
          className={`w-18 h-18 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg sm:text-base">
            {title}
          </h3>
          <p className="text-gray-500 text-lg sm:text-sm">{streak}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Flame className="w-6 h-6 text-orange-500" />
        <span className="font-bold text-orange-500 text-lg sm:text-base">
          {streakCount}
        </span>
      </div>
    </div>
  );
};

export default HabitItem;
