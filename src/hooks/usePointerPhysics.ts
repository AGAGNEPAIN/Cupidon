import { useEffect, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { MotionMousePosition } from "../types/theater";
import { THEATER_SPRING } from "../utils/constants";
import { useIsTouchDevice } from "./useIsTouchDevice";

export const usePointerPhysics = (): MotionMousePosition & {
  requestGyroPermission: () => Promise<boolean>;
} => {
  const isTouch = useIsTouchDevice();

  // Center of viewport as default (important for touch devices so parallax starts centered)
  const rawX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  );
  const rawY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  );

  const springX = useSpring(rawX, THEATER_SPRING);
  const springY = useSpring(rawY, THEATER_SPRING);

  // === DESKTOP: Mouse tracking (unchanged logic) ===
  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch, rawX, rawY]);

  // === MOBILE: Gyroscope tracking ===
  useEffect(() => {
    if (!isTouch) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0; // Left-right tilt: -90 to 90
      const beta = event.beta ?? 0; // Front-back tilt: -180 to 180

      // Clamp to usable range
      const clampedGamma = Math.max(-45, Math.min(45, gamma));
      const clampedBeta = Math.max(-45, Math.min(45, beta - 45)); // Subtract 45 to center at natural phone holding angle (~45°)

      // Map tilt to viewport coordinates
      // gamma -45° → left edge, gamma +45° → right edge
      const mappedX = ((clampedGamma + 45) / 90) * window.innerWidth;
      // beta (adjusted) -45° → top, +45° → bottom
      const mappedY = ((clampedBeta + 45) / 90) * window.innerHeight;

      rawX.set(mappedX);
      rawY.set(mappedY);
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, [isTouch, rawX, rawY]);

  // === iOS Permission Request ===
  // Must be called from a user gesture (click/tap handler)
  const requestGyroPermission = useCallback(async (): Promise<boolean> => {
    // Check if the API exists and requires permission (iOS 13+)
    const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied" | "default">;
    };

    if (typeof DeviceOrientationEventTyped.requestPermission === "function") {
      try {
        const response = await DeviceOrientationEventTyped.requestPermission();
        return response === "granted";
      } catch {
        return false;
      }
    }
    // Android / non-iOS: permission not needed, gyro is available by default
    return true;
  }, []);

  return {
    x: springX,
    y: springY,
    rawX,
    rawY,
    requestGyroPermission,
  };
};
