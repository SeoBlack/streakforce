import React from "react";
import { Crown, Medal, Award } from "lucide-react";
import { topPerformersData } from "../data";

const getRankDisplay = (rank) => {
  switch (rank) {
    case 1:
      return {
        icon: <Crown className="w-4 h-4" />,
        bgColor: "bg-yellow-500",
        textColor: "text-white",
      };
    case 2:
      return {
        icon: <Medal className="w-4 h-4" />,
        bgColor: "bg-gray-400",
        textColor: "text-white",
      };
    case 3:
      return {
        icon: <Award className="w-4 h-4" />,
        bgColor: "bg-amber-600",
        textColor: "text-white",
      };
    default:
      return {
        icon: <span className="text-xs font-bold">{rank}</span>,
        bgColor: "bg-gray-300",
        textColor: "text-gray-700",
      };
  }
};

const PerformerItem = ({ performer }) => {
  const rankDisplay = getRankDisplay(performer.rank);

  return (
    <div className="flex items-center justify-between py-4 px-1 hover:bg-gray-50  border-t border-gray-400 transition-colors rounded-lg">
      <div className="flex items-center space-x-3">
        <div
          className={`w-7 h-7 rounded-full ${rankDisplay.bgColor} ${rankDisplay.textColor} flex items-center justify-center flex-shrink-0`}
        >
          {rankDisplay.icon}
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={performer.avatar}
            alt={performer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 text-sm">
            {performer.name}
          </h3>
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-900">
          {performer.xp.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500 ml-1">XP</span>
      </div>
    </div>
  );
};

const TopPerformers = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-300">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
      </div>

      {/* List */}
      <div className="space-y-1">
        {topPerformersData.map((performer) => (
          <PerformerItem key={performer.id} performer={performer} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
          View all performers
        </button>
      </div>
    </div>
  );
};

export default TopPerformers;
