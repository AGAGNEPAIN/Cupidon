import { useState, useEffect } from "react";

export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    // We only check for the primary pointer type to avoid false positives on laptops with touchscreens.
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    // Handle hybrid devices: if a touch event fires, we're on touch
    const handleTouch = () => {
      setIsTouch(true);
      window.removeEventListener("touchstart", handleTouch);
    };

    // If initially detected as non-touch, listen for first touch
    if (!isTouch) {
      window.addEventListener("touchstart", handleTouch, { once: true });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [isTouch]);

  return isTouch;
};
