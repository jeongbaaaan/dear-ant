interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
