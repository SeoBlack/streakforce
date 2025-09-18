import { Dumbbell, Droplet } from "lucide-react";

export const teamMembers = [
  { name: "Mike", isCompleted: true },
  { name: "Emma", isCompleted: false },
  { name: "Alex", isCompleted: true },
  { name: "You", isCompleted: false },
  { name: "Sophia", isCompleted: true },
];

// habits items

export const habits = [
  {
    icon: <Dumbbell />,
    title: "Morning Workout",
    streak: "8 day streak",
    streakCount: 8,
    iconBg: "bg-blue-100",
  },
  {
    icon: <Droplet />,
    title: "Drink 8 Glasses",
    streak: "12 day streak",
    streakCount: 12,
    iconBg: "bg-green-100",
  },
  {
    icon: <Droplet />,
    title: "Drink 8 Glasses",
    streak: "12 day streak",
    streakCount: 12,
    iconBg: "bg-green-100",
  },
  {
    icon: <Droplet />,
    title: "Drink 8 Glasses",
    streak: "12 day streak",
    streakCount: 12,
    iconBg: "bg-green-100",
  },
  {
    icon: <Droplet />,
    title: "Drink 8 Glasses",
    streak: "12 day streak",
    streakCount: 12,
    iconBg: "bg-green-100",
  },
];

// mock user data
export interface UserData {
  name: string;
  title: string;
  avatar: string;
  xpPoints: {
    current: number;
    total: number;
    nextLevel: number;
  };
  level: {
    current: number;
    title: string;
  };
  streak: {
    current: number;
    longest: number;
  };
}

export const userData: UserData = {
  name: "Sarah Johnson",
  title: "Habit Champion",
  avatar:
    "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
  xpPoints: {
    current: 2840,
    total: 4200,
    nextLevel: 1360,
  },
  level: {
    current: 7,
    title: "Streak Master",
  },
  streak: {
    current: 23,
    longest: 45,
  },
};
