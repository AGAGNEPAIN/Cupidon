import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { MotionMousePosition } from '../types/theater';
import { THEATER_SPRING } from '../utils/constants';

export const useMousePhysics = (): MotionMousePosition => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for that 'Theatrical' feel
  const springX = useSpring(mouseX, THEATER_SPRING);
  const springY = useSpring(mouseY, THEATER_SPRING);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Update raw values directly
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return { 
    x: springX, 
    y: springY,
    rawX: mouseX,
    rawY: mouseY
  };
};
