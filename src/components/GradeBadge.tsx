interface GradeBadgeProps {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  size?: 'sm' | 'md' | 'lg';
}

const gradeColors: Record<string, string> = {
  S: 'bg-amber-600',
  A: 'bg-emerald-600',
  B: 'bg-blue-600',
  C: 'bg-amber-600',
  D: 'bg-orange-500',
  F: 'bg-red-500',
};

const sizeMap = {
  sm: { container: 'w-6 h-6', text: 'text-xs', radius: 'rounded-lg' },
  md: { container: 'w-9 h-9', text: 'text-base', radius: 'rounded-xl' },
  lg: { container: 'w-16 h-16', text: 'text-3xl', radius: 'rounded-2xl' },
};

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const color = gradeColors[grade] || 'bg-amber-600';
  const s = sizeMap[size];

  return (
    <div
      className={`${s.container} ${color} ${s.radius} flex items-center justify-center font-extrabold text-white animate-scale-in`}
    >
      <span className={s.text}>{grade}</span>
    </div>
  );
}
