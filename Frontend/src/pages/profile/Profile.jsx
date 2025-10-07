import { Settings, Edit3, Trophy, LogOut } from "lucide-react";
import ProgressComponent from "../../components/ProgressComponent";
import HabitsSection from "../../components/HabitsSection";
import { useAuth } from "../../context/useAuth";
import UserAvatar from "../../components/UserAvatar";
import { useState } from "react";
import ProfileEditPage from "../../components/ProfileEditPage";
import Button from "../../components/UI/Button";
import { useHabits } from "../../context/habitContextBase";

const ProfilePage = () => {
  const { logout, user } = useAuth();
  const { habits } = useHabits();
  const [editProfile, setEditProfile] = useState(false);

  const handleLogout = () => {
    logout();
  };
  const handleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  // Get user display name
  const displayName =
    user?.profile?.firstName && user?.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user?.profile?.firstName || user?.email?.split("@")[0] || "User";

  return (
    <>
      {editProfile ? (
        <ProfileEditPage handleCloseEditProfile={handleEditProfile} />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen md:max-w-7xl md:my-8 md:rounded-3xl md:shadow-xl md:overflow-hidden">
              <div className="relative bg-white px-4 pt-6 pb-8 sm:px-6 md:px-8">
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors cursor-pointer" />
                  </button>
                </div>

                <div className="text-center mt-8">
                  <div className="relative inline-block mb-4">
                    <UserAvatar
                      userEmail={user?.email}
                      avatarUrl={user?.profile?.profilePicture}
                      avatarConfig={user?.profile?.avatarConfig}
                      size="md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-2 border-2 border-white">
                      <Trophy className="w-4 h-4 text-yellow-700" />
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-1 sm:text-3xl">
                    {displayName}
                  </h1>
                  {user?.profile?.bio && (
                    <p className="text-md text-gray-600 mb-2 max-w-md mx-auto">
                      {user.profile.bio}
                    </p>
                  )}
                  <Button
                    onClick={handleEditProfile}
                    className="inline-flex justify-center items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-3xl font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-8 sm:px-6 lg:px-8">
                <ProgressComponent userData={user} />
              </div>

              <div className="px-4 pb-6 sm:px-6 lg:px-8">
                <HabitsSection title="All Habits" habit={habits} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfilePage;
