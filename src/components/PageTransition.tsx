'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}
