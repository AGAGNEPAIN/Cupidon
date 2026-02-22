import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheater } from "./TheaterProvider";

export const PrivateJokeGateway: React.FC = () => {
  const { setGameState, playMusic } = useTheater();
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().toLowerCase() === "maxipain") {
      setHasError(false);
      setGameState("BOKEH");
      // Use Context method that holds state to prevent losing audio on unmount
      playMusic();
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    }
  };

  return (
    <motion.div
      key="gateway"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(10px)",
        scale: 1.1,
        transition: { duration: 1.5, ease: "easeInOut" },
      }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-md"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="relative">
          <motion.input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            animate={
              hasError
                ? {
                    x: [-10, 10, -10, 10, 0],
                    transition: { duration: 0.4 },
                  }
                : {}
            }
            className={`w-64 sm:w-80 px-6 py-4 bg-white/20 border ${
              hasError ? "border-red-400" : "border-white/40"
            } rounded-full font-serif text-xl sm:text-2xl text-(--color-bleu-nuit) placeholder-(--color-bleu-nuit)/50 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-(--color-satin-gold) shadow-[0_4px_15px_rgba(255,255,255,0.2)] text-center transition-all`}
            placeholder="Mot de passe secret..."
            autoFocus
          />

          <AnimatePresence>
            {hasError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-full left-0 right-0 mt-3 text-red-500 font-serif text-lg font-bold drop-shadow-sm"
              >
                Alerte intrusion : tu n'es pas ma Valentine !
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
};
