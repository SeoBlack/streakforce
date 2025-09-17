import React from "react";
import { User, CheckCircle2 } from "lucide-react";

interface TeamMemberProps {
  name: string;
  avatar?: string;
  isCompleted: boolean;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  avatar,
  isCompleted,
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-600" />
          )}
        </div>
        {isCompleted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700">
        {name}
      </span>
    </div>
  );
};

export default TeamMember;
