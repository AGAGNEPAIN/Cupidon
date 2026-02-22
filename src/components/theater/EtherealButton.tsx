import { useRef, useId, useState, FC } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useRepulsionPhysics } from "../../hooks/useRepulsionPhysics";
import { LiquifyFilter } from "./effects/GlobalStageFilters";
import { useIsTouchDevice } from "../../hooks/useIsTouchDevice";
import { useTheater } from "./TheaterProvider";

interface EtherealButtonProps extends HTMLMotionProps<"button"> {
  threshold?: number;
  strength?: number;
  onInteraction?: (rect: DOMRect) => void;
}

export const EtherealButton: FC<EtherealButtonProps> = ({
  children,
  className,
  threshold = 150,
  strength = 100,
  onInteraction,
  onClick,
  initial = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0, transition: { duration: 0.8 } },
  style,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const uniqueId = useId();
  const filterId = `liquify-${uniqueId.replace(/:/g, "")}`;
  const isTouch = useIsTouchDevice();
  const { mousePosition } = useTheater();
  const isStationary = strength === 0;
  const isFleeing = !isStationary;

  // === MOBILE FLEEING: Tap-to-teleport state ===
  const [teleportPos, setTeleportPos] = useState({ x: 0, y: 0 });
  const [tapCount, setTapCount] = useState(0);

  // Repulsion physics — always active unless component is stationary.
  // On pure mobile touch devices, rawX/rawY won't update unless tapped, or they update via gyro,
  // which might cause weird repulsion if gyro moves the "pointer" over the button.
  // We'll keep repulsion enabled, but since tap-to-shrink intercepts interaction, it's safe.
  const { x, y, distortion } = useRepulsionPhysics({
    elementRef: buttonRef,
    threshold: isStationary || isTouch ? 0 : threshold, // Disable distance repulsion for touch
    strength: isTouch ? 0 : strength,
    onInteraction,
    rawX: mousePosition.rawX,
    rawY: mousePosition.rawY,
  });

  // === PATH 1: Stationary buttons (Yes) — same on both platforms ===
  if (isStationary) {
    return (
      <motion.button
        ref={buttonRef}
        className={className}
        initial={initial}
        exit={exit}
        whileHover={{
          scale: 1.06,
          boxShadow: "0 8px 30px rgba(197, 160, 89, 0.45)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  // === PATH 2: MOBILE FLEEING — Tap-to-shrink + teleport ===
  if (isTouch && isFleeing) {
    // Shrinks faster and becomes tiny
    const scaleFactor = Math.max(0.4, 1 - tapCount * 0.25);

    const handleMobileTap = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newCount = tapCount + 1;
      setTapCount(newCount);

      // Teleport to random position within safe area
      const safeMargin = 60; // smaller safe margin
      const maxX = window.innerWidth - safeMargin * 2;
      const maxY = window.innerHeight - safeMargin * 2;
      const newX = (Math.random() - 0.5) * maxX;
      const newY = (Math.random() - 0.5) * maxY;
      setTeleportPos({ x: newX, y: newY });

      // Call original onClick (which triggers incrementNoAttempts + petalBurst)
      onClick?.(e);
    };

    return (
      <motion.button
        ref={buttonRef}
        className={className}
        initial={initial}
        exit={exit}
        animate={{
          x: tapCount > 0 ? teleportPos.x : 0, // Only teleport AFTER the first tap
          y: tapCount > 0 ? teleportPos.y : 0,
          scale: scaleFactor,
          ...((props.animate as object) || {}),
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 15,
        }}
        whileTap={{
          scale: scaleFactor * 0.7,
          rotate: tapCount % 2 === 0 ? 5 : -5,
        }} // More dramatic shrink when actively pressing, with a small rotated squish based on tapCount
        style={style}
        onClick={handleMobileTap}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  // === PATH 3: DESKTOP FLEEING — Existing repulsion + liquify ===
  return (
    <>
      <LiquifyFilter id={filterId} distortion={distortion} />
      <motion.button
        ref={buttonRef}
        className={className}
        initial={initial}
        exit={exit}
        style={{
          ...style,
          x,
          y,
          filter: `url(#${filterId})`,
        }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.button>
    </>
  );
};
