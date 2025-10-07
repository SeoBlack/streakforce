import React from "react";
import HabitCard from "../../components/HabitCard";
import HabitsSection from "../../components/HabitsSection";
import Stats from "../../components/Stats";
import { AlertCircle } from "lucide-react";
import { useHabits } from "../../context/habitContextBase";
import { useCheckins } from "../../context/checkinContextBase";

const HomePage = () => {
  const { habits } = useHabits();
  const { hasCheckedInToday } = useCheckins();

  const unCheckedInHabits = habits.filter(
    (habit) => !hasCheckedInToday(habit?._id)
  );
  console.log("unCheckedInHabits", unCheckedInHabits);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex-1 pb-6">
        <div className="mb-8">
          {unCheckedInHabits.length > 0 && (
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
          )}
          <Stats />
          {unCheckedInHabits.length > 0 && (
            <HabitCard
              habit={unCheckedInHabits[0]}
              teamMembers={unCheckedInHabits[0]?.members || []}
            />
          )}
          {unCheckedInHabits.length === 0 && (
            <div className="mt-4 bg-gradient-to-r mx-4 from-orange-100 to-pink-100 rounded-2xl p-6 mb-6 border border-orange-200">
              <h3 className="font-semibold text-orange-800 text-md sm:text-base">
                No habits to check in today
              </h3>
            </div>
          )}
        </div>

        <HabitsSection title="Other Habits" habit={habits} />
      </div>
    </div>
  );
};

export default HomePage;
