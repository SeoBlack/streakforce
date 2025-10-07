import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useCheckins } from "../context/checkinContextBase";
import UserAvatar from "./UserAvatar";

const UserListAvatar = ({ avatarUrl, avatarConfig, checkedIn }) => (
  <div className="relative">
    <UserAvatar avatarUrl={avatarUrl} avatarConfig={avatarConfig} size="xs" />
    {checkedIn && (
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
        <Check className="w-3 h-3 text-white" />
      </div>
    )}
  </div>
);

const UserStatus = ({ checkedIn }) =>
  checkedIn ? (
    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
      <Check className="w-4 h-4 text-white" />
    </div>
  ) : (
    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
      Nudge
    </span>
  );

const UserCheckInItem = ({ profile, habit }) => {
  console.log("profile", profile);
  const { hasCheckedInToday } = useCheckins();
  const checkedIn = hasCheckedInToday(habit._id, profile.user_id);
  console.log("checkedIn", checkedIn);
  return (
    <div className="flex w items-center justify-between p-4 bg-white border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <UserListAvatar
          avatarUrl={profile?.profilePicture}
          avatarConfig={profile?.avatarConfig}
          checkedIn={checkedIn}
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-base">
            {profile?.firstName} {profile?.lastName}
          </h3>
          <p
            className={`text-sm ${
              checkedIn ? "text-green-600 font-medium" : "text-gray-500"
            }`}
          >
            {checkedIn ? "Checked in today" : "Not checked in"}
          </p>
        </div>
      </div>
      <UserStatus checkedIn={checkedIn} />
    </div>
  );
};

const UserCheckInList = ({ habit }) => {
  const { getProfileByUserId } = useAuth();
  const { getCheckinsForHabit } = useCheckins();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("habit", habit);

  const totalCheckedIn = getCheckinsForHabit(habit._id).length;
  console.log("totalCheckedIn", totalCheckedIn);

  useEffect(() => {
    const fetchMembers = async () => {
      const members = await Promise.all(
        habit.members.map(async (member) => await getProfileByUserId(member))
      );
      setMembers(members);
      setLoading(false);
    };
    fetchMembers();
  }, []);
  console.log("members", members);

  //handle checkin when cheking in implemented

  return (
    <div className=" mt-4 bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Daily Check-ins</h2>
        <p className="text-sm text-gray-600 mt-1">
          {totalCheckedIn} of {members.length} checked in today
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No members found</div>
        ) : (
          members.map((member) => (
            <UserCheckInItem key={member._id} profile={member} habit={habit} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserCheckInList;
