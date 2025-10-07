import React from "react";
import CustomSelect from "./CustomSelect";
import Icon from "./Icon";
export default function EmojiePicker({ handleSelect, value }) {
  const options = [
    {
      label: "Health",
      value: "health",
      icon: <Icon iconName="health" />,
    },
    {
      label: "Career",
      value: "career",
      icon: <Icon iconName="career" />,
    },
    {
      label: "Religion",
      value: "religion",
      icon: <Icon iconName="religion" />,
    },
    {
      label: "Social",
      value: "social",
      icon: <Icon iconName="social" />,
    },
    {
      label: "Finance",
      value: "finance",
      icon: <Icon iconName="finance" />,
    },
    {
      label: "Growth",
      value: "growth",
      icon: <Icon iconName="growth" />,
    },
  ];
  return (
    <div className="p-4 ">
      <CustomSelect
        options={options}
        handleSelect={handleSelect}
        value={value}
      />
    </div>
  );
}
