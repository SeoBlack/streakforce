import { createContext, useContext } from "react";

const HabitContext = createContext();

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitProvider");
  return ctx;
};

export default HabitContext;
