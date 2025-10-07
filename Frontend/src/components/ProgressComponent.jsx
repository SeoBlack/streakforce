import { Star, Flame } from "lucide-react";

const ProgressComponent = ({ userData }) => {
  const progressPercentage =
    (userData?.profile?.xpPoints?.current /
      userData?.profile?.xpPoints?.total) *
    100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Your Progress
      </h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">XP Points</span>
          <span className="text-gray-900 font-semibold">
            {userData?.profile?.xpPoints?.current?.toLocaleString()} /{" "}
            {userData?.profile?.xpPoints?.total?.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-red-400 to-orange-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <p className="text-gray-500 text-sm">
          {userData?.profile?.xpPoints?.nextLevel?.toLocaleString()} XP to next
          level
        </p>
      </div>
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl p-4 text-white text-center mb-4">
        <div className="flex items-center justify-center mb-1">
          <Star
            className="w-5 text-yellow-300 h-5 mr-2"
            fill="currentColor"
            stroke="currentColor"
          />
          <span className="text-lg font-semibold">
            Level {userData?.profile?.level?.current}
          </span>
        </div>
        <p className="text-emerald-50 font-medium">
          {userData?.profile?.level?.title}
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-200 to-pink-200 rounded-xl p-4">
        <div className="flex items-center justify-center mb-2">
          <Flame className="w-6 h-6 text-orange-500 mr-2" />
          <span className="text-2xl font-bold text-gray-900">
            {userData?.profile?.streak?.current}
          </span>
        </div>
        <p className="text-gray-700 font-medium text-center mb-1">Day Streak</p>
        <p className="text-gray-500 text-sm text-center">
          Longest: {userData?.profile?.streak?.longest} days
        </p>
      </div>
    </div>
  );
};

export default ProgressComponent;
