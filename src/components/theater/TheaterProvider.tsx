import React, { useState } from "react";
import type { ReactNode } from "react";
import { GameState } from "../../types/theater";
import { usePointerPhysics } from "../../hooks/usePointerPhysics";
import { DISSIPATION_DURATION } from "../../utils/constants";

import { TheaterContext } from "../../hooks/useTheater";

export const TheaterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("LOCKED");
  const [globalAudio] = useState(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio(
        `${import.meta.env.BASE_URL}assets/bebou_song.mp3`,
      );
      audio.loop = true;
      return audio;
    }
    return null;
  });
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [evaporationRect, setEvaporationRect] = useState<DOMRect | null>(null);
  const [lastPetalBurst, setLastPetalBurst] = useState<{
    rect: DOMRect;
    count: number;
    timestamp: number;
  } | null>(null);
  const { requestGyroPermission, ...mousePosition } = usePointerPhysics();

  const triggerReveal = async () => {
    if (gameState !== "BOKEH") return;
    await requestGyroPermission(); // Fires from user gesture — iOS will show permission dialog
    setGameState("DISSIPATING");
  };

  const playMusic = async () => {
    if (globalAudio) {
      await globalAudio.play().catch(console.error);
    }
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
        requestGyroPermission,
        playMusic,
      }}
    >
      {children}
    </TheaterContext.Provider>
  );
};
