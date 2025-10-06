import React from "react";
import { Check } from "lucide-react";
import { usersData } from "../data";

const UserAvatar = ({ avatar, name, checkedIn }) => (
  <div className="relative">
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
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

const UserCheckInItem = ({ user }) => {
  const { name, avatar, checkedIn } = user;
  return (
    <div className="flex w items-center justify-between p-4 bg-white border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <UserAvatar avatar={avatar} name={name} checkedIn={checkedIn} />
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{name}</h3>
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

const UserCheckInList = () => {
  const totalCheckedIn = usersData.filter((u) => u.checkedIn).length;

  return (
    <div className=" mt-4 bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Daily Check-ins</h2>
        <p className="text-sm text-gray-600 mt-1">
          {totalCheckedIn} of {usersData.length} checked in today
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {usersData.map((user) => (
          <UserCheckInItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserCheckInList;
