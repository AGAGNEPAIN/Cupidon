import { useEffect, RefObject, useRef } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { THEATER_SPRING } from '../utils/constants';

interface UseRepulsionPhysicsProps {
  elementRef: RefObject<HTMLElement | null>;
  threshold?: number;
  strength?: number;
  onInteraction?: (rect: DOMRect) => void;
  rawX: MotionValue<number>;
  rawY: MotionValue<number>;
}

interface UseRepulsionPhysicsReturn {
  x: MotionValue<number>;
  y: MotionValue<number>;
  distortion: MotionValue<number>;
}

export const useRepulsionPhysics = ({
  elementRef,
  threshold = 150,
  strength = 100,
  onInteraction,
  rawX,
  rawY,
}: UseRepulsionPhysicsProps): UseRepulsionPhysicsReturn => {
  // Position targets for spring animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Distortion source (0 to 1)
  const distortionTarget = useMotionValue(0);
  
  // Physics for smooth movement
  const springX = useSpring(x, THEATER_SPRING);
  const springY = useSpring(y, THEATER_SPRING);
  
  // Smoothed distortion for organic feel
  const distortion = useSpring(distortionTarget, { stiffness: 200, damping: 20 });
  
  // Internal state for logic not needing re-renders
  const state = useRef({
    wasInside: false,
    fatigue: 0
  });

  useEffect(() => {
    let animationId: number;

    const updatePhysics = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseXVal = rawX.get();
      const mouseYVal = rawY.get();
      
      const dx = mouseXVal - centerX;
      const dy = mouseYVal - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < threshold) {
        // Trigger interaction only when getting extremely close (smaller than click area effectively)
        // to avoid "automatic" triggers when just passing by.
        const interactionThreshold = 30; 
        if (distance < interactionThreshold && !state.current.wasInside) {
          state.current.wasInside = true;
          onInteraction?.(rect);
        }
        
        // Increase fatigue slightly faster (max 1)
        // 0.005 per frame -> ~3s to reach max fatigue at 60fps
        state.current.fatigue = Math.min(state.current.fatigue + 0.005, 1);
        
        // Calculate repulsion factor
        const factor = 1 - distance / threshold;
        
        // Apply fatigue to strength (can reduce to 0 at max fatigue)
        const currentStrength = strength * (1 - state.current.fatigue);
        const repulsion = factor * currentStrength;
        
        const dirX = -(dx / distance || 0);
        const dirY = -(dy / distance || 0);
        
        // Cap the maximum displacement to prevent extreme fleeing (AC Refinement)
        // 300px allows more dramatic fleeing while keeping the button on screen.
        const maxDisplacement = 300;
        const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, dirX * repulsion * 2));
        const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, dirY * repulsion * 2));
        
        x.set(targetX);
        y.set(targetY);

        // Update distortion based on proximity (0=far, 1=touching)
        distortionTarget.set(factor);
      } else {
        // Reset entry state
        state.current.wasInside = false;
        
        // Recover from fatigue slowly
        state.current.fatigue = Math.max(state.current.fatigue - 0.002, 0);
        
        x.set(0);
        y.set(0);
        distortionTarget.set(0);
      }
      
      animationId = requestAnimationFrame(updatePhysics);
    };
    
    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, [rawX, rawY, threshold, strength, x, y, springX, springY, elementRef, distortionTarget, onInteraction]);

  return { x: springX, y: springY, distortion };
};
