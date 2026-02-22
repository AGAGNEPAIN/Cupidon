import React from "react";
import { useTheater } from "../../hooks/useTheater";
import { motion } from "framer-motion";
import { Z_INDEX } from "../../utils/constants";

export const MainStage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { gameState } = useTheater();

  // Only render during the main play sequence or acceptance
  if (
    gameState !== "PLAYING" &&
    gameState !== "ACCEPTED" &&
    gameState !== "EVAPORATING"
  ) {
    return null;
  }

  // C1: In ACCEPTED state, hide the SatinFrame styling to avoid background artifact
  const isAccepted = gameState === "ACCEPTED";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: Z_INDEX.STAGE }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1], // Custom backOut-ish curve for theatrical entry
      }}
    >
      {/* SatinFrame Container */}
      <motion.div
        role="main"
        className={`relative pointer-events-auto flex flex-col items-center justify-center ${
          isAccepted
            ? "w-full max-w-2xl mx-4"
            : "w-[95vw] sm:w-[85vw] max-w-5xl h-auto sm:h-[70vh] min-h-[55vh] sm:min-h-[500px] bg-nacre/30 px-6 py-10 sm:p-0"
        }`}
        style={
          isAccepted
            ? {} // C1: No border/backdrop in ACCEPTED to avoid artifact
            : {
                border: "1px solid #C5A059", // Mat gold border
                borderRadius: "clamp(40px, 8vw, 100px)", // Responsive radius
                backdropFilter: "blur(5px)", // Atmospheric blur per spec
                boxShadow: "0 0 40px rgba(197, 160, 89, 0.1)", // Subtle gold glow
              }
        }
        // B5: Breathing pulsation on the satin frame border glow
        animate={
          isAccepted
            ? {}
            : {
                boxShadow: [
                  "0 0 40px rgba(197, 160, 89, 0.1)",
                  "0 0 60px rgba(197, 160, 89, 0.25)",
                  "0 0 40px rgba(197, 160, 89, 0.1)",
                ],
              }
        }
        transition={
          isAccepted
            ? {}
            : {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        {/* Inner Glow / Shimmer overlay for Satin feel — only in playing states */}
        {!isAccepted && (
          <div
            className="absolute inset-0 rounded-[clamp(40px,8vw,100px)] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
              mixBlendMode: "overlay",
            }}
          />
        )}

        {children}
      </motion.div>
    </motion.div>
  );
};
