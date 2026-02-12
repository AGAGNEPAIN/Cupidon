import React, { useEffect, useState } from "react";
import { useTheater } from "./TheaterProvider";
import { motion, useTransform } from "framer-motion";
import { Z_INDEX } from "../../utils/constants";
import { MotionMousePosition } from "../../types/theater";

// Cherub configuration for multiple instances
// B2: Positions adjusted to keep cherubs fully visible (safe margins from edges)
const CHERUBS = [
  {
    id: 1,
    top: "8%",
    left: "6%",
    width: 160,
    parallaxFactor: -0.05,
    opacity: 0.8,
    delay: 0,
  },
  {
    id: 2,
    top: "55%",
    left: "78%",
    width: 180,
    parallaxFactor: -0.08,
    opacity: 0.7,
    delay: 1,
  },
  {
    id: 3,
    top: "22%",
    left: "72%",
    width: 130,
    parallaxFactor: -0.03,
    opacity: 0.6,
    delay: 2,
  },
  {
    id: 4,
    top: "65%",
    left: "12%",
    width: 150,
    parallaxFactor: -0.06,
    opacity: 0.75,
    delay: 0.5,
  },
  {
    id: 5,
    top: "42%",
    left: "42%",
    width: 90,
    parallaxFactor: -0.02,
    opacity: 0.4,
    delay: 1.5,
    blur: "2px",
  }, // Tiny one far back
  {
    id: 6,
    top: "32%",
    left: "10%",
    width: 120,
    parallaxFactor: -0.04,
    opacity: 0.65,
    delay: 0.8,
  },
  {
    id: 7,
    top: "10%",
    left: "42%",
    width: 160,
    parallaxFactor: -0.07,
    opacity: 0.75,
    delay: 2.5,
  },
  {
    id: 8,
    top: "78%",
    left: "55%",
    width: 140,
    parallaxFactor: -0.03,
    opacity: 0.7,
    delay: 1.2,
  },
];

interface CherubProps {
  cherub: (typeof CHERUBS)[0];
  mousePosition: MotionMousePosition;
  windowSize: { width: number; height: number };
}

const Cherub: React.FC<CherubProps> = ({
  cherub,
  mousePosition,
  windowSize,
}) => {
  // We calculate movement relative to center of screen
  const xRange = windowSize.width / 2;
  const yRange = windowSize.height / 2;

  const x = useTransform(
    mousePosition.x,
    [0, windowSize.width],
    [xRange * cherub.parallaxFactor, -xRange * cherub.parallaxFactor],
  );

  const y = useTransform(
    mousePosition.y,
    [0, windowSize.height],
    [yRange * cherub.parallaxFactor, -yRange * cherub.parallaxFactor],
  );

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: cherub.top,
        left: cherub.left,
        width: cherub.width,
        x,
        y,
        zIndex: 1,
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/cherub.png`}
        alt="Cherub"
        className="w-full h-auto object-contain mix-blend-multiply animate-float"
        style={{
          opacity: 0.9,
          animationDelay: `${cherub.delay}s`,
          animationDuration: `${4 + cherub.id}s`, // Varied duration per cherub
        }}
      />
    </motion.div>
  );
};

export const ParallaxBackground: React.FC = () => {
  const { gameState, mousePosition } = useTheater();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only render in PLAYING, EVAPORATING or ACCEPTED states
  if (
    gameState !== "PLAYING" &&
    gameState !== "ACCEPTED" &&
    gameState !== "EVAPORATING"
  ) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: Z_INDEX.BACKGROUND }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Multiple Floating Cherubs */}
      {CHERUBS.map((cherub) => (
        <Cherub
          key={cherub.id}
          cherub={cherub}
          mousePosition={mousePosition}
          windowSize={windowSize}
        />
      ))}

      {/* Light Leak / Breathing Effect - Enhanced Visibility with Gold Tint */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          // Using a visible gold tint that fades out, instead of pure light
          background:
            "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.15) 0%, rgba(255,255,255,0) 60%)",
          mixBlendMode: "normal", // Normal blend mode ensures visibility on light background
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Ambient Light for warmth */}
      <div className="absolute inset-0 bg-yellow-50/10 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
};
