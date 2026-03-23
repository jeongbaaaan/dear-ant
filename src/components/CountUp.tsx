'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  formatter?: (n: number) => string;
}

export default function CountUp({ end, duration = 800, suffix = '', prefix = '', className = '', formatter }: CountUpProps) {
  const value = useCountUp(end, duration);
  const display = formatter ? formatter(value) : value.toLocaleString();
  return <span className={className}>{prefix}{display}{suffix}</span>;
}
