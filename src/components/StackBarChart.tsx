'use client';

import { useState } from 'react';

interface StackBarData {
  label: string;
  principal: number;
  profit: number;
}

export default function StackBarChart({ data, height = 140 }: { data: StackBarData[]; height?: number }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxTotal = Math.max(...data.map(d => d.principal + d.profit));

  return (
    <div className="relative">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const total = d.principal + d.profit;
          const totalH = (total / maxTotal) * height;
          const principalH = (d.principal / total) * totalH;
          const profitH = totalH - principalH;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="w-full rounded-t" style={{ height: profitH, background: '#006b1b' }} />
              <div className="w-full" style={{ height: principalH, background: '#e0e0e0' }} />
              <span className={`text-[10px] mt-1 ${i === data.length - 1 ? 'text-primary font-semibold' : 'text-on-surface-quaternary'}`}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      {hoverIndex !== null && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs font-semibold px-3 py-1.5 rounded-lg pointer-events-none z-10">
          원금 {data[hoverIndex].principal.toLocaleString()} · 수익 {data[hoverIndex].profit.toLocaleString()}
        </div>
      )}
    </div>
  );
}
