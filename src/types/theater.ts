import { MotionValue } from 'framer-motion';

export type GameState = 'LOCKED' | 'BOKEH' | 'DISSIPATING' | 'PLAYING' | 'ACCEPTED' | 'EVAPORATING';

export interface MotionMousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rawX: MotionValue<number>;
  rawY: MotionValue<number>;
}

export interface TheaterContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  mousePosition: MotionMousePosition;
  triggerReveal: () => void;
  noButtonAttempts: number;
  incrementNoAttempts: (rect?: DOMRect) => void;
  resetNoButton: () => void;
  evaporationRect: DOMRect | null;
  triggerPetalBurst: (rect: DOMRect, count?: number) => void;
  lastPetalBurst: { rect: DOMRect; count: number; timestamp: number } | null;
  requestGyroPermission: () => Promise<boolean>;
  playMusic: () => Promise<void>;
}
