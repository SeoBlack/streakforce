import UserCheckInList from "../../components/UserCheckinList";
import TopPerformers from "../../components/TopPerformer";
import { Flame, BookOpen, Settings, UserPlus } from "lucide-react";
import Button from "../../components/Button";

const teamData = {
  streakDays: 12,
  challenge: {
    title: "Read 10 pages",
    subtitle: "30-day challenge",
    daysLeft: 18,
    completed: 12,
    total: 30,
    progressPercentage: 40,
  },
};
const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive container */}
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-4xl lg:my-8 lg:rounded-3xl lg:shadow-xl lg:overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Page</h1>
              <p className="text-gray-600 text-sm mt-1">
                Track your team's progress
              </p>
            </div>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Streak Celebration Card */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-orange-400 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-4 right-4 opacity-20">
              <Flame className="w-16 h-16" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-2">
                {teamData.streakDays} Days Strong!
              </h2>
              <p className="text-orange-100 text-lg font-medium">
                Keep it up, team!
              </p>
            </div>
          </div>

          {/* Challenge Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teamData.challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {teamData.challenge.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">
                  {teamData.challenge.daysLeft}
                </div>
                <div className="text-sm text-gray-500">days left</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {teamData.challenge.completed} of {teamData.challenge.total}{" "}
                  days completed
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${teamData.challenge.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <UserCheckInList />
        </div>
        <div className="px-4  sm:px-6 mt-2 mb-4">
          <Button className="py-5 gap-2 text-white bg-color-1 ">
            <UserPlus className="w-6 h-6" /> Invite Teammates
          </Button>
        </div>
        <div className="p-4 sm:p-6">
          <TopPerformers />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
