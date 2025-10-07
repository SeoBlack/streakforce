export const getBgColorByName = (iconName) => {
  switch (iconName) {
    case "health":
      return "bg-green-100";
    case "career":
      return "bg-blue-100";
    case "religion":
      return "bg-red-100";
    case "social":
      return "bg-yellow-100";
    case "finance":
      return "bg-purple-100";
    case "growth":
      return "bg-pink-100";
    default:
      return "bg-green-100";
  }
};
