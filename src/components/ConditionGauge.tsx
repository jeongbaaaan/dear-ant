'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface ConditionGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function ConditionGauge({ value, size = 80, strokeWidth = 6, animated = true }: ConditionGaugeProps) {
  const displayValue = animated ? useCountUp(value, 800) : value;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(value, 100) / 100);

  const getColor = (v: number) => {
    if (v >= 70) return '#006b1b';
    if (v >= 40) return '#f57f17';
    return '#c62828';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor(value)} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-extrabold" style={{ fontSize: size * 0.22, color: getColor(value) }}>
          {Math.round(displayValue)}
        </span>
      </div>
    </div>
  );
}
