import { createContext, useContext } from "react";
import { TheaterContextType } from "../types/theater";

export const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (context === undefined) {
    throw new Error("useTheater must be used within a TheaterProvider");
  }
  return context;
};

export type { TheaterContextType };
