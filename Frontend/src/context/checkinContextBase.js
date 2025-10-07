import { createContext, useContext } from "react";

const CheckinContext = createContext();

export const useCheckins = () => {
  const ctx = useContext(CheckinContext);
  if (!ctx)
    throw new Error("useCheckins must be used within a CheckinProvider");
  return ctx;
};

export default CheckinContext;
