import React from "react";
import { useHabits } from "../../context/habitContextBase";
import HabitsSection from "../../components/HabitsSection";

export default function AllHabitsPage() {
  const { habits } = useHabits();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <HabitsSection title="All Habits" habit={habits} fullInfo={true} />
    </div>
  );
}
