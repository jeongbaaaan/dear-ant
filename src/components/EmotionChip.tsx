interface EmotionChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onToggle: () => void;
  categoryColor?: string;
}

export function EmotionChip({ emoji, label, selected, onToggle, categoryColor }: EmotionChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        min-h-[44px] w-full rounded-2xl px-4 py-3
        flex items-center gap-3
        transition-all duration-200
        ${selected
          ? 'bg-green-900 text-white scale-[1.02]'
          : 'card-v3 text-green-900'
        }
      `}
    >
      {categoryColor && !selected && (
        <div className={`w-1 h-6 rounded-full ${categoryColor}`} />
      )}
      <span className="text-lg">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
