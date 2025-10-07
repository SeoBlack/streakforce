import React from "react";
import { AlertCircle, Flame, CheckCircle2 } from "lucide-react";
import TeamMember from "./TeamMember";
import Button from "./UI/Button";
import Icon from "./UI/Icon";
import { useCheckins } from "../context/checkinContextBase";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Submission from "./Submission";

const HabitCard = ({ habit, teamMembers }) => {
  const { submitCheckIn, isLoading, error, hasCheckedInToday } = useCheckins();
  const [checkin, setCheckin] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasCheckedIn = hasCheckedInToday(habit?._id);

  const handleCheckIn = async () => {
    try {
      const checkinData = await submitCheckIn(habit?._id);
      setCheckin(checkinData?.data);
      setSuccess(true);
      toast.success(checkinData?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-lg mx-4">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <Icon iconName={habit?.aspect} size={8} rounded={false} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {habit?.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full">
              <Flame className="w-5 h-5 text-red-500" />
              <span className="font-bold text-color-2 text-base sm:text-lg">
                {habit?.streak}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Team Progress Today
          </p>

          <div className="flex justify-between items-center mb-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>

        {!hasCheckedIn && (
          <Button
            className="w-full bg-gradient-to-r from-orange-400 to-color-1 hover:from-orange-500 hover:to-color-2 text-white font-semibold space-x-3"
            onClick={handleCheckIn}
            disabled={isLoading}
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Check In Today</span>
          </Button>
        )}
        {hasCheckedIn && (
          <div className="w-full bg-green-100 rounded-lg h-12 flex items-center justify-center border-dashed border-green-500 border-2">
            <h3 className="text-green-500 font-semibold ">Checked In</h3>
          </div>
        )}
      </div>
      {success && checkin && (
        <Submission
          checkin={checkin}
          onContinue={() => setSuccess(false)}
          onShare={() => setSuccess(false)}
        />
      )}
    </>
  );
};

export default HabitCard;
