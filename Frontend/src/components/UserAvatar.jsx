import React from "react";
import Avatar, { genConfig } from "react-nice-avatar";

const getAvatarSize = (size) => {
  switch (size) {
    case "xxs":
      return 3;
    case "xs":
      return 4;
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

export default function UserAvatar({
  userEmail,
  avatarUrl,
  avatarConfig,
  size = "sm",
  showRing = true,
}) {
  const avatarSize = getAvatarSize(size);

  // Determine which avatar to show
  const showUploadedImage = avatarUrl && avatarUrl.startsWith("http");

  // Use provided avatarConfig or generate from email
  const config = avatarConfig || genConfig(userEmail);

  return (
    <div
      className={`w-[${avatarSize}rem] h-[${avatarSize}rem] rounded-full overflow-hidden ${
        showRing ? "ring-4 ring-orange-400 ring-offset-2" : ""
      }`}
    >
      {showUploadedImage ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <Avatar
          style={{ width: `${avatarSize}rem`, height: `${avatarSize}rem` }}
          {...config}
        />
      )}
    </div>
  );
}
