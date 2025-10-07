import React from "react";
import { User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const { user } = useAuth();
  console.log("user", user);
  return (
    <div className="bg-white px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Good morning!</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Ready to keep your streak alive?
          </p>
        </div>
        <UserAvatar
          avatarConfig={user?.profile?.avatarConfig}
          profilePicture={user?.profile?.profilePicture}
          size="xxs"
          showRing={false}
        />
      </div>
    </div>
  );
}
