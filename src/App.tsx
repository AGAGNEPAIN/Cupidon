import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheater } from "./components/theater/TheaterProvider";
import BokehOverlay from "./components/theater/BokehOverlay";
import { ParallaxBackground } from "./components/theater/ParallaxBackground";
import { MainStage } from "./components/theater/MainStage";
import { CupidCursor } from "./components/theater/effects/CupidCursor";
import { ParticleSystem } from "./components/theater/effects/ParticleSystem";
import { EtherealButton } from "./components/theater/EtherealButton";
import { useIsTouchDevice } from "./hooks/useIsTouchDevice";
import { PrivateJokeGateway } from "./components/theater/PrivateJokeGateway";
import "./App.css";

// Story 3.1: Lazy-load SuccessFrame for performance
const SuccessFrame = lazy(() => import("./components/theater/SuccessFrame"));

function App() {
  const {
    triggerReveal,
    gameState,
    setGameState,
    incrementNoAttempts,
    triggerPetalBurst,
    resetNoButton,
  } = useTheater();
  const isTouch = useIsTouchDevice();
  const [isShaking, setIsShaking] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Sequence of romantic questions
  const QUESTIONS = [
    {
      title: (
        <>
          Veux-tu être ma
          <br />
          <span className="italic font-semibold">Valentine</span> ?
        </>
      ),
      yes: "Oui",
      no: "Non",
      showBebou: true,
    },
    {
      title: "T'es sûre, sûre, sûre ?",
      yes: "Évidemment ! 💕",
      no: "Hmm... laisse-moi réfléchir",
      showBebou: false,
    },
    {
      title: "Pour combien de temps ?",
      yes: "Pour toujours ♾️",
      no: "Juste aujourd'hui",
      showBebou: false,
    },
    {
      title: "Tu promets de me faire des papouilles tous les jours ?",
      yes: "Je promets ! 🤗",
      no: "Peut-être...",
      showBebou: false,
    },
  ];

  const currentQuestion = QUESTIONS[questionIndex];

  // Hide default cursor when custom Cupid cursor is active
  // C2: Show default cursor in BOKEH, LOCKED (no custom cursor) and ACCEPTED (cursor hidden for solemnity)
  const isCustomCursorActive =
    !isTouch &&
    gameState !== "BOKEH" &&
    gameState !== "LOCKED" &&
    gameState !== "ACCEPTED";

  // Show "No" button when PLAYING or EVAPORATING hasn't fully completed
  const showNoButton = gameState === "PLAYING";

  const handleYes = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      // Reset No button so it reappears fresh on the next question
      resetNoButton();
    } else {
      // Last question answered — trigger celebration!
      setGameState("ACCEPTED");
    }
  };

  return (
    <div
      data-testid="app-root"
      className={`relative w-full h-full overflow-hidden ${
        isCustomCursorActive ? "cursor-none" : ""
      }`}
      onClick={triggerReveal}
    >
      {/* Custom Cursor - Renders itself based on internal check */}
      <ParticleSystem />
      <CupidCursor />

      <ParallaxBackground />

      <MainStage>
        <AnimatePresence mode="wait">
          {gameState !== "ACCEPTED" ? (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 sm:gap-12 z-(--z-stage)"
            >
              {/* Title + optional Bebou note */}
              <div className="relative">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif drop-shadow-sm text-center shimmer-text max-w-3xl"
                  style={{ fontSize: "clamp(1.5rem, 5vw, 4.5rem)" }}
                >
                  {currentQuestion.title}
                </motion.h1>

                {/* Floating handwritten note — "Mon Bebou" (only on first question) */}
                {currentQuestion.showBebou && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -7 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="absolute bottom-0 pointer-events-none select-none hidden sm:block"
                    style={{ right: "clamp(-8rem, -10vw, -12rem)" }}
                  >
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="font-handwritten font-bold"
                      style={{
                        fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)",
                        color: "var(--color-satin-gold)",
                        textShadow: "1px 2px 4px rgba(197, 160, 89, 0.25)",
                      }}
                    >
                      Mon Bebou 💕
                    </motion.span>
                  </motion.div>
                )}
              </div>

              <motion.div
                layout
                className="flex flex-col sm:flex-row items-center gap-6 sm:gap-16 mt-4 sm:mt-8"
              >
                <EtherealButton
                  onClick={handleYes}
                  layoutId={
                    questionIndex === QUESTIONS.length - 1
                      ? "apotheosis-morph"
                      : undefined
                  }
                  className="px-8 py-3 sm:px-12 sm:py-4 bg-(--color-satin-gold) text-white font-serif rounded-full shadow-[0_4px_15px_rgba(197,160,89,0.3)] hover:shadow-[0_6px_20px_rgba(197,160,89,0.5)] transition-shadow btn-shimmer"
                  style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
                  strength={0} // Stationary
                  transition={{
                    layout: {
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                >
                  {currentQuestion.yes}
                </EtherealButton>

                <AnimatePresence>
                  {showNoButton && (
                    <EtherealButton
                      onClick={(e) => {
                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        triggerPetalBurst(rect, 15); // Impact burst
                        incrementNoAttempts(rect);
                        setIsShaking(true);
                        setTimeout(() => setIsShaking(false), 500);
                      }}
                      onInteraction={(rect) => {
                        incrementNoAttempts(rect); // Count proximity attempts
                      }}
                      animate={
                        isShaking
                          ? {
                              x: [0, -10, 10, -10, 10, 0],
                              transition: { duration: 0.5 },
                            }
                          : {}
                      }
                      className="px-8 py-3 sm:px-12 sm:py-4 bg-white/70 text-[var(--color-bleu-nuit)] font-serif rounded-full border-2 border-[var(--color-satin-gold)] backdrop-blur-sm shadow-[0_2px_10px_rgba(197,160,89,0.2)] hover:bg-white/90 transition-all"
                      style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
                      strength={800} // Fleeing
                      threshold={350}
                    >
                      {currentQuestion.no}
                    </EtherealButton>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <Suspense fallback={null}>
              <SuccessFrame />
            </Suspense>
          )}
        </AnimatePresence>
      </MainStage>

      <AnimatePresence mode="wait">
        {gameState === "LOCKED" && <PrivateJokeGateway />}
      </AnimatePresence>

      <BokehOverlay />
    </div>
  );
}

export default App;
