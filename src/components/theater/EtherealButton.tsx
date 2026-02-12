import { useRef, useId, FC } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useRepulsionPhysics } from "../../hooks/useRepulsionPhysics";
import { LiquifyFilter } from "./effects/GlobalStageFilters";

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
  initial = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0, transition: { duration: 0.8 } },
  style,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const uniqueId = useId();
  const filterId = `liquify-${uniqueId.replace(/:/g, "")}`;

  // Only enable repulsion physics + liquify distortion for fleeing buttons (strength > 0)
  const isStationary = strength === 0;

  const { x, y, distortion } = useRepulsionPhysics({
    elementRef: buttonRef,
    threshold: isStationary ? 0 : threshold, // Disable proximity detection for stationary
    strength,
    onInteraction,
  });

  // Stationary buttons (Yes) get an inviting hover effect instead of distortion
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
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  // Fleeing buttons (No) get the full repulsion + liquify treatment
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
        {...props}
      >
        {children}
      </motion.button>
    </>
  );
};
