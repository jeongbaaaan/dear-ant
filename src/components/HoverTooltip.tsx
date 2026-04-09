'use client';

import { useState } from 'react';

interface HoverTooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function HoverTooltip({ content, children }: HoverTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative inline-block"
      onMouseEnter={(e) => { setShow(true); setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }); }}
      onMouseMove={(e) => setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="absolute z-50 px-3 py-1.5 bg-on-surface text-surface text-xs font-semibold rounded-lg pointer-events-none whitespace-nowrap"
          style={{ left: pos.x + 8, top: pos.y - 32 }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
