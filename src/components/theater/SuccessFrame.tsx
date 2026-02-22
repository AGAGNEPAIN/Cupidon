import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

/**
 * SuccessFrame component for Story 3.1 & 3.2.
 * This component represents the final celebration content.
 * Story 3.2: Adds golden celebration effects and poetic message.
 */
export const SuccessFrame: React.FC = () => {
  useEffect(() => {
    // Story 3.2: Golden celebration burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    // Z-index follows architecture.md: Magic/Effects = z-20
    const defaults: confetti.Options = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 20,
    };

    // Palette sync with design system variables
    const goldPalette = ["#C5A059", "#E5C079", "#A58039", "#FFFFFF"];

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: goldPalette,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: goldPalette,
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      layoutId="apotheosis-morph"
      className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[clamp(1.5rem,5vw,3rem)] p-5 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(197,160,89,0.3)] flex flex-col items-center gap-8 mx-4 golden-border-reflet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        layout: {
          stiffness: 300,
          damping: 20,
        },
      }}
    >
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-(--color-bleu-nuit) italic"
          style={{ fontSize: "clamp(1.25rem, 4vw, 3rem)" }}
        >
          <span className="shimmer-text">
            Je le savais. T'avais pas vraiment le choix de toute façon
          </span>{" "}
          <span className="not-italic">😌</span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        className="relative flex items-center justify-center animate-breathing"
        style={{
          width: "clamp(12rem, 35vw, 20rem)",
          height: "clamp(12rem, 35vw, 20rem)",
        }}
      >
        {/* Organic Blob Mask via SVG Clip-path */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="blob-mask" clipPathUnits="objectBoundingBox">
              <path d="M0.5,0 C0.85,0.05 0.95,0.2 1,0.5 C1,0.85 0.85,1 0.5,1 C0.15,1 0,0.85 0,0.5 C0,0.2 0.15,0.05 0.5,0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div
          className="relative w-full h-full overflow-hidden shadow-2xl"
          style={{ clipPath: "url(#blob-mask)" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/sacred_portrait.png`}
            alt="Sacred Portrait"
            className="w-full h-full object-cover"
          />
          {/* Film Grain Overlay */}
          <div className="grain-filter" />

          {/* Internal Glow */}
          <div className="absolute inset-0 bg-linear-to-tr from-(--color-satin-gold)/20 to-transparent pointer-events-none" />
        </div>

        {/* Floating Heart Decor */}
        <motion.div
          className="absolute -top-4 -right-4 text-4xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ❤️
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-md text-center text-(--color-bleu-nuit) font-serif italic leading-relaxed overflow-visible"
        style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
      >
        <span className="shimmer-text">Joyeuse Saint-Valentin mon Bebou</span>{" "}
        <span>❤️</span>
      </motion.div>

      {/* C4: More visible sparkle decorations with animation */}
      <div className="absolute -top-6 -left-6 text-4xl opacity-50 animate-sparkle">
        ✨
      </div>
      <div className="absolute -bottom-6 -right-6 text-4xl opacity-50 animate-sparkle-delayed">
        ✨
      </div>
      <div className="absolute -top-4 -right-8 text-3xl opacity-40 animate-sparkle-delayed">
        ✨
      </div>
      <div className="absolute -bottom-4 -left-8 text-3xl opacity-40 animate-sparkle">
        ✨
      </div>
    </motion.div>
  );
};

export default SuccessFrame;
