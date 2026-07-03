interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
  speech?: string;
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy', speech }: AntCharacterProps) {
  const isWorried = expression === 'worried';
  const isExcited = expression === 'excited';
  const isThinking = expression === 'thinking';
  const isCool = expression === 'cool';

  return (
    <div className={`relative inline-block ${className}`}>
      {speech && (
        <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-surface-border bg-surface px-3 py-1.5 shadow-raised">
          <p className="text-xs font-black text-primary">{speech}</p>
        </div>
      )}
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx="60" cy="108" rx="40" ry="8" fill="#E7D8C4" />
        <ellipse cx="60" cy="74" rx="38" ry="28" fill="#B98157" />
        <ellipse cx="60" cy="55" rx="43" ry="33" fill="#C98B61" />
        <ellipse cx="35" cy="31" rx="9" ry="11" fill="#A86F49" transform="rotate(-18 35 31)" />
        <ellipse cx="85" cy="31" rx="9" ry="11" fill="#A86F49" transform="rotate(18 85 31)" />
        <ellipse cx="45" cy="45" rx="8" ry="6" fill="#FFFFFF" opacity="0.16" />
        <ellipse cx="60" cy="62" rx="21" ry="15" fill="#D9A17B" />
        <ellipse cx="60" cy="58" rx="9" ry="6" fill="#6E4A34" />
        {isExcited ? (
          <>
            <path d="M38 49 L43 43 L48 49 L43 55 Z" fill="#2D2924" />
            <path d="M72 49 L77 43 L82 49 L77 55 Z" fill="#2D2924" />
          </>
        ) : isCool ? (
          <path d="M37 50 h15 M69 50 h15" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        ) : isThinking ? (
          <path d="M38 50 Q44 46 50 50 M70 50 Q76 46 82 50" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        ) : isWorried ? (
          <path d="M38 52 Q44 48 50 52 M70 52 Q76 48 82 52" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M39 50 Q44 56 49 50 M71 50 Q76 56 81 50" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        )}
        <path d={isWorried ? 'M53 70 Q60 64 67 70' : isThinking ? 'M60 68 h1' : 'M53 66 Q60 72 67 66'} stroke="#2D2924" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="63" r="6" fill="#F4B287" opacity="0.28" />
        <circle cx="86" cy="63" r="6" fill="#F4B287" opacity="0.28" />
        <circle cx="92" cy="34" r="16" fill="#F6CD63" stroke="#B58D32" strokeWidth="2" />
        <path d="M92 18 V7" stroke="#467D5C" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="84" cy="6" rx="9" ry="5" fill="#467D5C" transform="rotate(-25 84 6)" />
        <ellipse cx="101" cy="6" rx="9" ry="5" fill="#77A97E" transform="rotate(25 101 6)" />
        <rect x="28" y="88" width="64" height="21" rx="10.5" fill="#FFF6EA" stroke="#EADCCB" />
        <text x="60" y="102" textAnchor="middle" fontSize="9" fontWeight="800" fill="#467D5C" fontFamily="sans-serif">bara</text>
      </svg>
    </div>
  );
}
