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

export const userData = {
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

export const usersData = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar:
      "https://marketplace.canva.com/EAFSZhFumYM/2/0/1600w/canva-dark-red-neon-futuristic-instagram-profile-picture-1u1wshkWxIM.jpg",
    checkedIn: true,
    status: "checked-in",
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format&q=80",
    checkedIn: false,
    status: "not-checked",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format&q=80",
    checkedIn: true,
    status: "checked-in",
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face&auto=format&q=80",
    checkedIn: false,
    status: "not-checked",
  },
  {
    id: 5,
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face&auto=format&q=80",
    checkedIn: true,
    status: "checked-in",
  },
];

export const topPerformersData = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar:
      "https://marketplace.canva.com/EAFSZhFumYM/2/0/1600w/canva-dark-red-neon-futuristic-instagram-profile-picture-1u1wshkWxIM.jpg",
    xp: 1250,
    rank: 1,
  },
  {
    id: 2,
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format&q=80",
    xp: 1180,
    rank: 2,
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format&q=80",
    xp: 980,
    rank: 3,
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format&q=80",
    xp: 880,
    rank: 4,
  },
];
