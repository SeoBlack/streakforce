import React from "react";
import { AlertCircle, Flame, CheckCircle2 } from "lucide-react";
import TeamMember from "./TeamMember";
import Button from "./Button";

interface HabitCardProps {
  habit: {
    title: string;
    streak: string;
  };
  teamMembers: {
    name: string;
    isCompleted: boolean;
    avatar?: string;
  }[];
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, teamMembers }) => {
  return (
    <>
      <div className="mt-4 bg-gradient-to-r mx-4 from-orange-100 to-pink-100 rounded-2xl p-6 mb-6 border border-orange-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-orange-800 text-md sm:text-base">
              Don't forget!
            </h3>
            <p className="text-orange-700 text-md sm:text-sm">
              Check in today to keep your streak alive
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg mx-4">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {habit.title}
            </h2>
            <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full">
              <Flame className="w-5 h-5 text-red-500" />
              <span className="font-bold text-color-2 text-base sm:text-lg">
                {habit.streak}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Team Progress Today
          </p>

          <div className="flex justify-between items-center mb-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-orange-400 to-color-1 hover:from-orange-500 hover:to-color-2 text-white font-semibold space-x-3">
          <CheckCircle2 className="w-6 h-6" />
          <span>Check In Today</span>
        </Button>
      </div>
    </>
  );
};

export default HabitCard;
