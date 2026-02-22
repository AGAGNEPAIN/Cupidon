import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheater } from "../../hooks/useTheater";
import {
  COLORS,
  Z_INDEX,
  DISSIPATION_DURATION_SEC,
} from "../../utils/constants";

interface BokehCircleProps {
  size: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
  opacity: number;
  blur: number;
  isExiting: boolean;
  color?: string; // A1: Per-layer gold tint for depth variation
}

/**
 * Individual Bokeh Circle with its own physics and shimmer cycle
 */
const BokehCircle: React.FC<BokehCircleProps> = ({
  size,
  top,
  left,
  delay,
  duration,
  opacity,
  blur,
  isExiting,
  color,
}) => {
  // Determine direction based on quadrant
  const isLeft = parseFloat(left) < 50;
  const isTop = parseFloat(top) < 50;

  // Fly towards corners
  const exitX = isLeft ? "-50vw" : "50vw";
  const exitY = isTop ? "-50vh" : "50vh";

  // A1: Use per-circle color or fallback to Satin Gold
  const circleColor = color || COLORS.SATIN_GOLD;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 0,
              x: exitX,
              y: exitY,
              transition: {
                duration: DISSIPATION_DURATION_SEC * 0.75,
                ease: "backOut",
                delay: delay * 0.1,
              },
            }
          : {
              // Multi-stage shimmer: opacity, scale, and subtle drift
              opacity: [
                opacity * 0.4,
                opacity,
                opacity * 0.6,
                opacity * 0.8,
                opacity * 0.4,
              ],
              scale: [1, 1.05, 0.95, 1.02, 1],
              x: [0, 15, -10, 5, 0],
              y: [0, -15, 10, -5, 0],
              transition: {
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              },
            }
      }
      style={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        borderRadius: "50%",
        // A1: Per-circle gold tint for depth
        background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, ${circleColor} 60%, transparent 100%)`,
        mixBlendMode: "color-dodge",
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    />
  );
};

/**
 * Multi-layered "Golden Bokeh" overlay
 * Optimized with independent layer containers for compositor efficiency
 */
const BokehOverlay: React.FC = () => {
  const { gameState } = useTheater();

  // Story 1.2 focuses on BOKEH state; DISSIPATING handles the exit logic in Story 1.3
  const isVisible = gameState === "BOKEH" || gameState === "DISSIPATING";

  if (!isVisible) return null;

  // Layered circle definitions for deep parallax/depth feel
  // A1: Each layer uses different gold tints for depth perception
  // A2: Varied sizes and opacities create multi-layer depth
  const layers = [
    {
      id: "back",
      // Back layer: large, very blurry, warm subtle gold
      circles: [
        {
          size: 450,
          top: "8%",
          left: "3%",
          delay: 0,
          duration: 14,
          opacity: 0.35,
          blur: 70,
          color: "#E8D5A8", // Warm pale gold
        },
        {
          size: 380,
          top: "55%",
          left: "68%",
          delay: 1,
          duration: 16,
          opacity: 0.3,
          blur: 65,
          color: "#F0E6CC", // Light champagne
        },
        {
          size: 320,
          top: "40%",
          left: "88%",
          delay: 2,
          duration: 18,
          opacity: 0.25,
          blur: 75,
          color: "#D4C088", // Muted gold
        },
      ],
    },
    {
      id: "mid",
      // Mid layer: medium sizes, richer gold tones
      circles: [
        {
          size: 260,
          top: "28%",
          left: "38%",
          delay: 2,
          duration: 10,
          opacity: 0.5,
          blur: 40,
          color: "#C5A059", // Satin Gold
        },
        {
          size: 220,
          top: "12%",
          left: "72%",
          delay: 0.5,
          duration: 13,
          opacity: 0.45,
          blur: 45,
          color: "#D4B06A", // Warm gold
        },
        {
          size: 200,
          top: "72%",
          left: "18%",
          delay: 1.5,
          duration: 11,
          opacity: 0.55,
          blur: 35,
          color: "#C5A059", // Satin Gold
        },
        {
          size: 180,
          top: "65%",
          left: "45%",
          delay: 3,
          duration: 12,
          opacity: 0.4,
          blur: 42,
          color: "#E5C079", // Light gold
        },
      ],
    },
    {
      id: "front",
      // Front layer: smaller, sharper, brightest gold highlights
      circles: [
        {
          size: 140,
          top: "42%",
          left: "78%",
          delay: 3,
          duration: 8,
          opacity: 0.65,
          blur: 22,
          color: "#C5A059", // Satin Gold bright
        },
        {
          size: 110,
          top: "18%",
          left: "22%",
          delay: 1,
          duration: 9,
          opacity: 0.7,
          blur: 18,
          color: "#D4AF37", // Rich gold
        },
        {
          size: 160,
          top: "78%",
          left: "52%",
          delay: 2.5,
          duration: 12,
          opacity: 0.6,
          blur: 25,
          color: "#E5C079", // Light gold accent
        },
        {
          size: 90,
          top: "5%",
          left: "50%",
          delay: 4,
          duration: 10,
          opacity: 0.75,
          blur: 15,
          color: "#D4AF37", // Rich gold
        },
        {
          size: 70,
          top: "35%",
          left: "60%",
          delay: 1.8,
          duration: 7,
          opacity: 0.6,
          blur: 12,
          color: "#F8D7DA", // Rose poudré accent
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DISSIPATION_DURATION_SEC }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: Z_INDEX.MAGIC,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* A1: Golden ambient mist for warmth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 40% 40%, rgba(197,160,89,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(244,215,218,0.08) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {layers.map((layer) => (
            <div
              key={layer.id}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                // Encourages separate compositor layers
                transform: "translateZ(0)",
              }}
            >
              {layer.circles.map((circle, index) => (
                <BokehCircle
                  key={`${layer.id}-${index}`}
                  {...circle}
                  isExiting={gameState === "DISSIPATING"}
                />
              ))}
            </div>
          ))}

          {/* Teaser text — only during BOKEH, not during DISSIPATING */}
          {gameState === "BOKEH" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3rem",
                pointerEvents: "none",
              }}
            >
              {/* Main teaser — letter by letter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0",
                }}
              >
                {"J'ai quelque chose à te demander..."
                  .split("")
                  .map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + i * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                        color: "var(--color-satin-gold)",
                        textShadow: "0 2px 8px rgba(197, 160, 89, 0.3)",
                        whiteSpace: char === " " ? "pre" : "normal",
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
              </motion.div>

              {/* Pulsing CTA hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
                transition={{
                  delay: 3,
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                  color: "var(--color-satin-gold)",
                  letterSpacing: "0.1em",
                  textTransform: "lowercase" as const,
                }}
              >
                clique n'importe où
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BokehOverlay;
