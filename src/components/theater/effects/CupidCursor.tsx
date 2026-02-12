import React from "react";
import { motion } from "framer-motion";
import { useTheater } from "../TheaterProvider";
import { Z_INDEX } from "../../../utils/constants";

export const CupidCursor: React.FC = () => {
  const { gameState, mousePosition } = useTheater();

  // Story AC 1: "Given any application state after BOKEH"
  // C2: Also hide in ACCEPTED for maximum solemnity during apotheosis
  if (gameState === "BOKEH" || gameState === "ACCEPTED") return null;

  return (
    <motion.div
      data-testid="cupid-cursor"
      className="fixed pointer-events-none"
      style={{
        zIndex: Z_INDEX.MAGIC,
        top: 0,
        left: 0,
        x: mousePosition.rawX,
        y: mousePosition.rawY,
        pointerEvents: "none",
      }}
    >
      {/* 
        Cupid's Bow Icon - Placeholder SVG 
        Using Satin Gold color.
        Simple bow and arrow shape.
      */}
      <img
        src={`${import.meta.env.BASE_URL}assets/cupid-cursor.png`}
        alt="Cupid Cursor"
        style={{
          width: "48px",
          height: "auto",
          // marginLeft: "24px", // Removed to align top-left with mouse
          // marginTop: "24px", // Removed to align top-left with mouse
          filter: "drop-shadow(0 0 3px rgba(197, 160, 89, 0.4))",
          transform: "rotate(-15deg) translate(-10%, -10%)", // Slight adjustment for the rotation endpoint
        }}
      />
    </motion.div>
  );
};
