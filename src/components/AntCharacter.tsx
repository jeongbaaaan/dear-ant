interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
  speech?: string;
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy', speech }: AntCharacterProps) {
  const mood = {
    happy: { eye: 'M39 49 Q44 55 49 49 M70 49 Q75 55 80 49', mouth: 'M53 66 Q60 72 67 66', badge: 'capi log' },
    excited: { eye: 'M39 48 L44 42 L49 48 L44 54 Z M70 48 L75 42 L80 48 L75 54 Z', mouth: 'M52 65 Q60 76 68 65', badge: 'tiny win' },
    thinking: { eye: 'M38 49 Q44 45 50 49 M69 49 Q75 45 81 49', mouth: 'M60 66 h1', badge: 'pause' },
    worried: { eye: 'M38 51 Q44 47 50 51 M69 51 Q75 47 81 51', mouth: 'M53 70 Q60 64 67 70', badge: 'soft pause' },
    cool: { eye: 'M37 49 h14 M69 49 h14', mouth: 'M53 66 Q60 71 67 66', badge: 'calm' },
  }[expression];

  return (
    <div className={`relative inline-block ${className}`}>
      {speech && (
        <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-surface-border bg-surface px-3 py-1.5 shadow-raised">
          <p className="text-xs font-black text-primary">{speech}</p>
        </div>
      )}
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx="60" cy="108" rx="42" ry="8" fill="#E7D8C4" />
        <ellipse cx="60" cy="73" rx="37" ry="29" fill="#B98157" />
        <ellipse cx="60" cy="54" rx="43" ry="34" fill="#C98B61" />
        <ellipse cx="34" cy="30" rx="9" ry="11" fill="#A86F49" transform="rotate(-18 34 30)" />
        <ellipse cx="86" cy="30" rx="9" ry="11" fill="#A86F49" transform="rotate(18 86 30)" />
        <ellipse cx="45" cy="46" rx="8" ry="6" fill="#FFFFFF" opacity="0.16" />
        <ellipse cx="60" cy="61" rx="20" ry="15" fill="#D9A17B" />
        <ellipse cx="60" cy="57" rx="9" ry="6" fill="#6E4A34" />
        <path d={mood.eye} stroke="#2D2924" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill={expression === 'excited' ? '#2D2924' : 'none'} />
        <path d={mood.mouth} stroke="#2D2924" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="62" r="6" fill="#F4B287" opacity="0.28" />
        <circle cx="86" cy="62" r="6" fill="#F4B287" opacity="0.28" />
        <path d="M31 82 Q60 98 89 82" stroke="#8B5F42" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <circle cx="91" cy="34" r="17" fill="#F6CD63" stroke="#B58D32" strokeWidth="2" />
        <path d="M91 18 V7" stroke="#467D5C" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="83" cy="6" rx="9" ry="5" fill="#467D5C" transform="rotate(-25 83 6)" />
        <ellipse cx="100" cy="6" rx="9" ry="5" fill="#77A97E" transform="rotate(25 100 6)" />
        <rect x="27" y="88" width="66" height="21" rx="10.5" fill="#FFF6EA" stroke="#EADCCB" />
        <text x="60" y="102" textAnchor="middle" fontSize="9" fontWeight="800" fill="#467D5C" fontFamily="sans-serif">{mood.badge}</text>
      </svg>
    </div>
  );
}
