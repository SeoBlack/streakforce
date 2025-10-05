import React from "react";
import Avatar, { genConfig } from "react-nice-avatar";

const getAvatarSize = (size) => {
  switch (size) {
    case "sm":
      return 8;
    case "md":
      return 12;
    case "lg":
      return 16;
    default:
      return 8;
  }
};

export default function UserAvatar({ userEmail, avatarUrl, size = "sm" }) {
  console.log(userEmail);
  const avatarSize = getAvatarSize(size);
  return (
    <div
      className={`w-[${avatarSize}rem] h-[${avatarSize}rem] rounded-full overflow-hidden ring-4 ring-orange-400 ring-offset-2`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <Avatar
          size={avatarSize}
          config={genConfig(userEmail)}
          style={{ width: `${avatarSize}rem`, height: `${avatarSize}rem` }}
        />
      )}
    </div>
  );
}
