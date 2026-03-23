'use client';

import { useEffect, useState } from 'react';

export function useCountUp(end: number, duration: number = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (end === 0) { setValue(0); return; }

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (end - startValue) * eased);

      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [end, duration]);

  return value;
}
