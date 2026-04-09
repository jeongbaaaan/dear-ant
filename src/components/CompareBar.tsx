interface CompareBarProps {
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  formatter?: (v: number) => string;
}

export default function CompareBar({ leftLabel, leftValue, rightLabel, rightValue, formatter }: CompareBarProps) {
  const total = leftValue + rightValue;
  const leftPct = total > 0 ? (leftValue / total) * 100 : 50;
  const fmt = formatter || ((v: number) => v.toLocaleString());

  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span>{leftLabel} <span className="text-on-surface-tertiary">{fmt(leftValue)}</span></span>
        <span>{rightLabel} <span className="text-primary">{fmt(rightValue)}</span></span>
      </div>
      <div className="h-8 bg-surface-border rounded-lg overflow-hidden flex">
        <div
          className="h-full flex items-center justify-center text-xs font-bold text-white bg-[#90a4ae] transition-all duration-500"
          style={{ width: `${leftPct}%` }}
        >
          {leftLabel}
        </div>
        <div
          className="h-full flex items-center justify-center text-xs font-bold text-white bg-primary transition-all duration-500"
          style={{ width: `${100 - leftPct}%` }}
        >
          {rightLabel}
        </div>
      </div>
    </div>
  );
}
