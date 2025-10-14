import React, { useEffect } from "react";
import UserCheckInList from "../../components/UserCheckinList";
import { Flame, Settings, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useHabits } from "../../context/habitContextBase";
import Icon from "../../components/UI/Icon";
import Button from "../../components/UI/Button";
import { useCheckins } from "../../context/checkinContextBase";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";

const HabitsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { selectedHabit, getHabitById, deleteHabit } = useHabits();
  const { submitCheckIn, isLoading, hasCheckedInToday } = useCheckins();
  const navigate = useNavigate();
  const hasCheckedIn = hasCheckedInToday(selectedHabit?._id);
  console.log("hasCheckedIn", hasCheckedIn);

  console.log("user", user);
  console.log("selectedHabit", selectedHabit);
  const isHabitOwner = selectedHabit?.createdBy.id === user?._id;
  useEffect(() => {
    if (id) {
      getHabitById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only re-fetch when the id changes
  console.log(selectedHabit);

  const handleCheckIn = async () => {
    try {
      const checkinData = await submitCheckIn(selectedHabit?._id);
      toast.success(checkinData?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onDeleteHabit = async () => {
    try {
      const deletedHabit = await deleteHabit(selectedHabit?._id);
      toast.success(deletedHabit?.message);
      navigate("/habits");
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (!selectedHabit) return <div>Loading...</div>;

  const streak = selectedHabit?.streak || 0;
  const duration = selectedHabit?.duration || 0; // total planned days
  const completed = Math.min(streak, duration || streak);
  const progressPercentage = duration
    ? Math.min(100, Math.round((completed / duration) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive container */}
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-4xl lg:my-8 lg:rounded-3xl lg:shadow-xl lg:overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedHabit?.title || "Habit"}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {selectedHabit?.description || "Track your habit's progress"}
              </p>
            </div>
            {isHabitOwner && (
              <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                onClick={onDeleteHabit}
              >
                <Trash className="w-5 h-5 text-red-400 hover:text-red-600" />
              </button>
            )}
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

              <h2 className="text-3xl font-bold mb-2">{streak} Days Strong!</h2>
              <p className="text-orange-100 text-lg font-medium">Keep it up!</p>
            </div>
          </div>

          {/* Challenge Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon
                    iconName={selectedHabit?.aspect}
                    size={6}
                    rounded={false}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedHabit?.title || "Habit Progress"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedHabit?.description ||
                      "Your ongoing habit challenge"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">
                  {duration > 0 ? Math.max(0, duration - completed) : 0}
                </div>
                <div className="text-sm text-gray-500">days left</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {completed} of {duration || completed} days completed
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            {!hasCheckedIn && (
              <Button
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-400 to-color-1 hover:from-orange-500 hover:to-color-2 text-white font-semibold space-x-3"
                onClick={() => handleCheckIn()}
              >
                Check In
              </Button>
            )}
            {hasCheckedIn && (
              <div className="w-full bg-green-100 rounded-lg h-12 flex items-center justify-center border-dashed border-green-500 border-2">
                <h3 className="text-green-500 font-semibold ">Checked In</h3>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <UserCheckInList habit={selectedHabit} />
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
