import { Settings, Edit3, Trophy } from "lucide-react";
import ProgressComponent from "../../components/ProgressComponent";
import HabitsSection from "../../components/HabitsSection";
import { userData, habits } from "../../data";

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-2xl lg:my-8 lg:rounded-3xl lg:shadow-xl lg:overflow-hidden">
        <div className="relative bg-white px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="text-center mt-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-400 ring-offset-2 sm:w-28 sm:h-28">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-2 border-2 border-white">
                <Trophy className="w-4 h-4 text-yellow-700" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-1 sm:text-3xl">
              {userData.name}
            </h1>
            <p className="text-md font-medium mb-6 flex items-center justify-center">
              {userData.title}
              <span className="ml-2 text-lg">⚡</span>
            </p>
            <button className="inline-flex justify-center items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-3xl font-medium transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
        <div className="px-4 pb-8 sm:px-6 lg:px-8">
          <ProgressComponent userData={userData} />
        </div>

        <div className="px-4 pb-6 sm:px-6 lg:px-8">
          <HabitsSection title="All Habits" habit={habits} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
