import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { GameState, TheaterContextType } from "../../types/theater";
import { useMousePhysics } from "../../hooks/useMousePhysics";
import { DISSIPATION_DURATION } from "../../utils/constants";

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

export const TheaterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("BOKEH");
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [evaporationRect, setEvaporationRect] = useState<DOMRect | null>(null);
  const [lastPetalBurst, setLastPetalBurst] = useState<{
    rect: DOMRect;
    count: number;
    timestamp: number;
  } | null>(null);
  const mousePosition = useMousePhysics();

  const triggerReveal = () => {
    if (gameState !== "BOKEH") return;

    setGameState("DISSIPATING");
  };

  const triggerPetalBurst = (rect: DOMRect, count: number = 20) => {
    setLastPetalBurst({ rect, count, timestamp: Date.now() });
  };

  const resetNoButton = () => {
    setNoButtonAttempts(0);
    setEvaporationRect(null);
    setGameState("PLAYING");
  };

  const incrementNoAttempts = (rect?: DOMRect) => {
    setNoButtonAttempts((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        if (rect) setEvaporationRect(rect);
        setGameState("EVAPORATING");
      }
      return newCount;
    });
  };

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (gameState === "DISSIPATING") {
      timeoutId = setTimeout(() => {
        setGameState("PLAYING");
      }, DISSIPATION_DURATION);
    }
    return () => clearTimeout(timeoutId);
  }, [gameState]);

  return (
    <TheaterContext.Provider
      value={{
        gameState,
        setGameState,
        mousePosition,
        triggerReveal,
        noButtonAttempts,
        incrementNoAttempts,
        resetNoButton,
        evaporationRect,
        triggerPetalBurst,
        lastPetalBurst,
      }}
    >
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (context === undefined) {
    throw new Error("useTheater must be used within a TheaterProvider");
  }
  return context;
};
