'use client';

import { useEffect, useRef, useState } from 'react';

export function useCountUp(end: number, duration: number = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (end === 0) {
      // Schedule state update via microtask to avoid synchronous setState in effect
      rafRef.current = requestAnimationFrame(() => setValue(0));
      return () => cancelAnimationFrame(rafRef.current);
    }

    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(end * eased);

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      }
    }

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  return value;
}
