import React from "react";
import { User, CheckCircle2 } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useCheckins } from "../context/checkinContextBase";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";

const TeamMember = ({ memberId, habit }) => {
  const { hasCheckedInToday } = useCheckins();
  const { getProfileByUserId } = useAuth();
  const [member, setMember] = useState(null);

  const hasCheckedIn = hasCheckedInToday(habit?._id, memberId);

  useEffect(() => {
    const fetchMember = async () => {
      const member = await getProfileByUserId(memberId);
      setMember(member);
    };
    fetchMember();
  }, [memberId]);
  if (!member) return null;
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <UserAvatar
          avatarConfig={member.profile.avatarConfig}
          profilePicture={member.profile.profilePicture}
          size="xxs"
        />
        {hasCheckedIn && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700">
        {member.profile.firstName}
      </span>
    </div>
  );
};

export default TeamMember;
