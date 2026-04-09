import { Mood } from '@/lib/types';

interface EmotionDay {
  day: string;
  mood?: Mood;
  isToday?: boolean;
}

const moodEmoji: Record<Mood, string> = {
  '불안': '😰', '초조': '😤', '평온': '😌', '설렘': '🤩', '자신감': '💪',
};

const moodBg: Record<Mood, string> = {
  '불안': 'bg-error-container', '초조': 'bg-amber-container', '평온': 'bg-primary-container',
  '설렘': 'bg-amber-container', '자신감': 'bg-blue-container',
};

export default function EmotionGrid({ days }: { days: EmotionDay[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d, i) => (
        <div key={i} className="text-center">
          <div className={`w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-sm ${
            d.mood ? moodBg[d.mood] : 'bg-surface-container'
          }`}>
            {d.mood ? moodEmoji[d.mood] : ''}
          </div>
          <span className={`text-[10px] ${d.isToday ? 'text-primary font-semibold' : 'text-on-surface-quaternary'}`}>
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}
