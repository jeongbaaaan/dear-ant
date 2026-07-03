interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
  speech?: string;
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy', speech }: AntCharacterProps) {
  const mood = {
    happy: { eye: 'M35 43 Q40 49 45 43 M58 43 Q63 49 68 43', mouth: 'M43 59 Q52 68 61 59', badge: 'Future me' },
    excited: { eye: 'M35 42 L40 36 L45 42 L40 48 Z M58 42 L63 36 L68 42 L63 48 Z', mouth: 'M42 58 Q52 70 62 58', badge: 'Tiny win' },
    thinking: { eye: 'M34 42 Q40 38 46 42 M58 42 Q64 38 70 42', mouth: 'M52 58 h1', badge: 'Pause' },
    worried: { eye: 'M34 44 Q40 39 46 44 M58 44 Q64 39 70 44', mouth: 'M43 62 Q52 56 61 62', badge: 'Pattern' },
    cool: { eye: 'M33 42 h14 M57 42 h14', mouth: 'M43 59 Q52 65 61 59', badge: 'Calm' },
  }[expression];

  return (
    <div className={`relative inline-block ${className}`}>
      {speech && (
        <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-surface-border bg-surface px-3 py-1.5 shadow-raised">
          <p className="text-xs font-black text-primary">{speech}</p>
        </div>
      )}
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx="60" cy="108" rx="38" ry="8" fill="#E7D8C4" />
        <path d="M39 70 L25 98 M58 73 L52 103 M76 70 L96 98" stroke="#7A5238" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="60" cy="76" rx="27" ry="24" fill="#9B6744" />
        <ellipse cx="86" cy="72" rx="22" ry="21" fill="#B97A4E" />
        <circle cx="48" cy="43" r="27" fill="#C98A5B" />
        <ellipse cx="39" cy="34" rx="11" ry="8" fill="#FFFFFF" opacity="0.18" />
        <path d="M36 22 Q25 8 13 6 M60 22 Q68 8 81 6" stroke="#7A5238" strokeWidth="3" strokeLinecap="round" />
        <circle cx="13" cy="6" r="5" fill="#F4B287" />
        <circle cx="81" cy="6" r="5" fill="#F4B287" />
        <path d={mood.eye} stroke="#2D2924" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={expression === 'excited' ? '#2D2924' : 'none'} />
        <path d={mood.mouth} stroke="#2D2924" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="29" cy="53" r="6" fill="#F4B287" opacity="0.28" />
        <circle cx="68" cy="53" r="6" fill="#F4B287" opacity="0.28" />
        <circle cx="92" cy="34" r="17" fill="#F6CD63" stroke="#B58D32" strokeWidth="2" />
        <path d="M92 18 V7" stroke="#467D5C" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="84" cy="6" rx="9" ry="5" fill="#467D5C" transform="rotate(-25 84 6)" />
        <ellipse cx="101" cy="6" rx="9" ry="5" fill="#77A97E" transform="rotate(25 101 6)" />
        <rect x="15" y="84" width="58" height="20" rx="10" fill="#FFF6EA" stroke="#EADCCB" />
        <text x="44" y="98" textAnchor="middle" fontSize="9" fontWeight="800" fill="#467D5C" fontFamily="sans-serif">{mood.badge}</text>
      </svg>
    </div>
  );
}
