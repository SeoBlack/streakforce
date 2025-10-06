import React from "react";
import Button from "./UI/Button";
import { LinkIcon } from "lucide-react";
import EmailInput from "./UI/EmailInput";
import CustomSelect from "./UI/CustomSelect";

export default function InviteFriends({
  emails,
  onEmailsChange,
  privacy,
  onPrivacyChange,
}) {
  const privacyOptions = [
    { value: "solo", label: "Solo", icon: "👤" },
    { value: "team", label: "Team", icon: "👥" },
  ];
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col">
      <CustomSelect
        options={privacyOptions}
        value={privacy}
        handleSelect={onPrivacyChange}
        title="Privacy"
      />
      {privacy === "team" && (
        <>
          <h3 className="text-gray-900 font-medium mb-4 mt-4">
            Invite Teammates
          </h3>

          <EmailInput emails={emails} onEmailsChange={onEmailsChange} />
        </>
      )}
    </div>
  );
}
