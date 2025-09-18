import React, { useEffect, useState } from "react";
import HabitCard from "../../components/HabitCard";
import HabitsSection from "../../components/HabitsSection";
import { User } from "lucide-react";

import { habits, teamMembers } from "../../data";

const HomePage: React.FC = () => {
  const [members, setMembers] = useState<typeof teamMembers>([]);
  const [habitList, setHabitList] = useState<typeof habits>([]);
  const [mainHabit] = useState({
    title: "Read 10 pages",
    streak: "15 day streak",
  });

  useEffect(() => {
    setMembers(teamMembers);
    setHabitList(habits);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>Good morning!</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Ready to keep your streak alive?
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex-1 pb-6">
        <div className="mb-8">
          <HabitCard habit={mainHabit} teamMembers={members} />
        </div>
        <HabitsSection habit={habitList} />
      </div>
    </div>
  );
};

export default HomePage;
