import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

interface LiquifyFilterProps {
  id: string;
  distortion: MotionValue<number>;
  // distortion value: 0 (norm) to 1 (max)
}

/**
 * Liquify filter for "the-liquified-no-button-repulsion".
 * It applies turbulence and displacement map based on distortion level.
 */
export const LiquifyFilter: React.FC<LiquifyFilterProps> = ({
  id,
  distortion,
}) => {
  // Transform distortion to filter attributes
  // Scale of displacement: 0 -> 0, 1 -> 50 (max distortion)
  const scale = useTransform(distortion, [0, 1], [0, 50]);

  // Base frequency: higher frequency = finer noise
  // We can vary it slightly or keep it constant.
  // Animating frequency creates "boiling" effect.
  // Let's keep it constant for "liquify" looks more like warping.
  const baseFrequency = 0.02; // A nice fluid noise

  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves="2"
            result="noise"
          />
          <motion.feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
