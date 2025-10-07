import React from "react";
import CareerIcon from "../../assets/Career.svg";
import HealthIcon from "../../assets/Health.svg";
import FinanceIcon from "../../assets/Finance.svg";
import SocialIcon from "../../assets/Social.svg";
import ReligionIcon from "../../assets/Religion.svg";
import GrowthIcon from "../../assets/Growth.svg";
import { getBgColorByName } from "./helpers";

const getIconByName = (iconName) => {
  switch (iconName) {
    case "health":
      return HealthIcon;
    case "career":
      return CareerIcon;
    case "religion":
      return ReligionIcon;
    case "social":
      return SocialIcon;
    case "finance":
      return FinanceIcon;
    case "growth":
      return GrowthIcon;
    default:
      return HealthIcon;
  }
};

export default function Icon({ iconName, size = 6, rounded = true }) {
  const icon = getIconByName(iconName);
  const bgColor = getBgColorByName(iconName);
  return (
    <div
      className={`${bgColor} ${
        rounded ? "rounded-full" : "rounded-lg"
      } p-2 w-full h-full flex items-center justify-center`}
    >
      <img src={icon} alt={iconName} className={`w-${size} h-${size}`} />
    </div>
  );
}
