import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheater } from "../TheaterProvider";
import { Z_INDEX, COLORS } from "../../../utils/constants";
import { useIsTouchDevice } from "../../../hooks/useIsTouchDevice";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  type: "sparkle" | "petal";
  rotation?: number;
}

export const ParticleSystem: React.FC = () => {
  const { gameState, mousePosition, evaporationRect, lastPetalBurst } =
    useTheater();
  const isTouch = useIsTouchDevice();
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawn = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  const particleIdCounter = useRef(0);

  const spawnParticle = React.useCallback(
    (x: number, y: number, type: "sparkle" | "petal" = "sparkle") => {
      const id = particleIdCounter.current++;
      const angle =
        type === "petal"
          ? Math.random() * Math.PI * 2 // Full circle explosion
          : Math.random() * Math.PI * 2;
      const distance =
        type === "petal" ? 50 + Math.random() * 100 : 20 + Math.random() * 30;
      const size =
        type === "petal" ? 8 + Math.random() * 12 : 2 + Math.random() * 4;

      setParticles((prev) => {
        // Limit total particles to prevent DOM overload (AC 4)
        if (prev.length > 200) return prev; // Increased limit for burst

        return [
          ...prev,
          {
            id,
            x,
            y,
            angle,
            distance,
            size,
            color: type === "petal" ? COLORS.ROSE_POUDRE : COLORS.SATIN_GOLD,
            type,
            rotation: type === "petal" ? Math.random() * 360 : 0,
          },
        ];
      });
    },
    [],
  );

  const spawnBurst = React.useCallback(
    (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        spawnParticle(x, y, "petal");
      }
    },
    [spawnParticle],
  );

  // Handle evaporation bloom
  useEffect(() => {
    if (gameState === "BOKEH") return;

    if (gameState === "EVAPORATING") {
      const spawnX = evaporationRect
        ? evaporationRect.left + evaporationRect.width / 2
        : mousePosition.rawX.get();
      const spawnY = evaporationRect
        ? evaporationRect.top + evaporationRect.height / 2
        : mousePosition.rawY.get();

      // Increased count for dramatic effect
      spawnBurst(spawnX, spawnY, 40);
    }
  }, [gameState, evaporationRect, mousePosition, spawnBurst]);

  // Handle triggered bursts (e.g. on click)
  useEffect(() => {
    if (!lastPetalBurst) return;

    const spawnX = lastPetalBurst.rect.left + lastPetalBurst.rect.width / 2;
    const spawnY = lastPetalBurst.rect.top + lastPetalBurst.rect.height / 2;

    spawnBurst(spawnX, spawnY, lastPetalBurst.count);
  }, [lastPetalBurst, spawnBurst]);

  // === DESKTOP ONLY: Mouse trail sparkles ===
  useEffect(() => {
    if (isTouch) return;
    if (gameState === "BOKEH" || gameState === "EVAPORATING") return;

    // Determine spawn logic
    const maybeSpawn = () => {
      const now = Date.now();
      const x = mousePosition.x.get();
      const y = mousePosition.y.get();

      const dx = x - lastSpawn.current.x;
      const dy = y - lastSpawn.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 15 || (now - lastSpawn.current.time > 100 && dist > 5)) {
        spawnParticle(x, y, "sparkle");
        lastSpawn.current = { x, y, time: now };
      }
    };

    const unsubscribeX = mousePosition.x.on("change", maybeSpawn);
    const unsubscribeY = mousePosition.y.on("change", maybeSpawn);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mousePosition, gameState, spawnParticle, isTouch]);

  // === MOBILE ONLY: Ambient floating sparkles ===
  useEffect(() => {
    if (!isTouch) return;
    if (gameState !== "PLAYING") return;

    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      spawnParticle(x, y, "sparkle");
    }, 400);

    return () => clearInterval(interval);
  }, [isTouch, gameState, spawnParticle]);

  // === MOBILE ONLY: Touch-burst feedback ===
  useEffect(() => {
    if (!isTouch) return;
    if (gameState === "BOKEH") return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      for (let i = 0; i < 4; i++) {
        spawnParticle(touch.clientX, touch.clientY, "sparkle");
      }
    };

    window.addEventListener("touchstart", handleTouch, { passive: true });
    return () => window.removeEventListener("touchstart", handleTouch);
  }, [isTouch, gameState, spawnParticle]);

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  if (gameState === "BOKEH") return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z_INDEX.MAGIC }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0,
              x: p.x,
              y: p.y,
              rotate: p.rotation,
            }}
            animate={{
              opacity: 0,
              scale: 1,
              x: p.x + Math.cos(p.angle) * p.distance,
              y: p.y + Math.sin(p.angle) * p.distance,
              rotate: (p.rotation || 0) + 180,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.type === "petal" ? 2 : 0.8,
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeParticle(p.id)}
            style={{
              position: "absolute",
              width: p.size,
              height: p.type === "petal" ? p.size * 1.5 : p.size,
              borderRadius:
                p.type === "petal"
                  ? "50% 50% 50% 50% / 100% 100% 0% 0%"
                  : "50%",
              backgroundColor: p.color,
              boxShadow:
                p.type === "petal" ? "none" : `0 0 ${p.size * 2}px ${p.color}`,
              willChange: "transform, opacity",
              mixBlendMode: p.type === "petal" ? "normal" : "screen",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
