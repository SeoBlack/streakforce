import React from "react";
import HabitCard from "../../components/HabitCard";
import HabitsSection from "../../components/HabitsSection";
import { User } from "lucide-react";
import { useHabits } from "../../context/habitContextBase";

const HomePage = () => {
  const { habits } = useHabits();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex-1 pb-6">
        <div className="mb-8">
          <HabitCard habit={habits[0]} teamMembers={habits[0]?.members || []} />
        </div>
        <HabitsSection title="Other Habits" habit={habits} />
      </div>
    </div>
  );
};

export default HomePage;
