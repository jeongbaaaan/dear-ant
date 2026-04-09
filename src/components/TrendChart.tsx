'use client';

import { useState } from 'react';

interface TrendChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export default function TrendChart({ data, height = 120, color = '#006b1b' }: TrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  if (data.length < 2) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 600;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d.value - min) / range) * (height - 20) - 10;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${w},${height} L0,${height} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendGrad)" opacity="0.12" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle
            key={i} cx={p.x} cy={p.y} r={hoverIndex === i ? 6 : 0}
            fill={color} opacity={hoverIndex === i ? 1 : 0}
          />
        ))}
        {/* Invisible hover targets */}
        {points.map((p, i) => (
          <rect
            key={`hit-${i}`} x={p.x - 15} y={0} width={30} height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            className="cursor-pointer"
          />
        ))}
      </svg>
      {hoverIndex !== null && (
        <div
          className="absolute bg-on-surface text-surface text-xs font-semibold px-2.5 py-1 rounded-lg pointer-events-none"
          style={{ left: `${(hoverIndex / (data.length - 1)) * 100}%`, top: -28, transform: 'translateX(-50%)' }}
        >
          {data[hoverIndex].value}%
        </div>
      )}
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-[11px] text-on-surface-quaternary">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
