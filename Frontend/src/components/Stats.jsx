import React from "react";
import { useHabits } from "../context/habitContextBase";
import Icon from "./UI/Icon";

const lifeAspects = [
  { name: "health", label: "Health", color: "#10b981" },
  { name: "career", label: "Career", color: "#3b82f6" },
  { name: "finance", label: "Finance", color: "#8b5cf6" },
  { name: "social", label: "Social", color: "#f59e0b" },
  { name: "religion", label: "Religion", color: "#ef4444" },
  { name: "growth", label: "Growth", color: "#ec4899" },
];

const CircularProgress = ({ percentage, color, aspect }) => {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center group">
      <div className="relative w-[100px] h-[100px] transition-transform duration-300 group-hover:scale-110">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 absolute top-0 left-0"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.8s ease-in-out",
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        {/* Icon in the center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]">
          <Icon iconName={aspect.name} size={10} rounded={true} />
        </div>
      </div>
      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-gray-800">{aspect.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {Math.round(percentage)}% active
        </p>
      </div>
    </div>
  );
};

export default function Stats() {
  const { habits } = useHabits();

  // Calculate stats for each life aspect
  const calculateAspectStats = () => {
    const totalHabits = habits.length || 0;

    return lifeAspects.map((aspect) => {
      const aspectHabits = habits.filter(
        (habit) => habit.aspect?.toLowerCase() === aspect.name.toLowerCase()
      );
      const count = aspectHabits.length;
      const percentage = totalHabits > 0 ? (count / totalHabits) * 100 : 0;

      return {
        ...aspect,
        count,
        percentage,
      };
    });
  };

  const stats = calculateAspectStats();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg mx-4 my-6">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Life Aspects
        </h2>
        <p className="text-gray-600 text-base">
          Track your progress across different areas of life
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
        {stats.map((aspect) => (
          <CircularProgress
            key={aspect.name}
            percentage={aspect.percentage}
            color={aspect.color}
            aspect={aspect}
          />
        ))}
      </div>

      {/* Summary section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {stats.map((aspect) => (
            <div
              key={aspect.name}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: aspect.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {aspect.label}: {aspect.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
