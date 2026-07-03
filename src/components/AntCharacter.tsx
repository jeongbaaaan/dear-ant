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
        <ellipse cx="60" cy="108" rx="38" ry="8" fill="#E7D8C4" />
        <ellipse cx="58" cy="78" rx="25" ry="22" fill="#9B6744" />
        <ellipse cx="82" cy="73" rx="22" ry="20" fill="#B97A4E" />
        <circle cx="51" cy="42" r="29" fill="#C98A5B" />
        <ellipse cx="42" cy="32" rx="11" ry="8" fill="#FFFFFF" opacity="0.18" />
        <path d="M39 20 Q29 8 16 5" stroke="#8B5F42" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M62 20 Q70 8 83 5" stroke="#8B5F42" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="16" cy="5" r="5.5" fill="#F4B287" />
        <circle cx="83" cy="5" r="5.5" fill="#F4B287" />
        {isExcited ? (
          <>
            <path d="M37 41 L42 35 L47 41 L42 47 Z" fill="#2D2924" />
            <path d="M55 41 L60 35 L65 41 L60 47 Z" fill="#2D2924" />
          </>
        ) : isCool ? (
          <>
            <path d="M35 42 h13 M55 42 h13" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : isThinking ? (
          <path d="M36 42 Q42 38 48 42 M54 42 Q60 38 66 42" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        ) : isWorried ? (
          <path d="M36 44 Q42 40 48 44 M54 44 Q60 40 66 44" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M38 42 Q42 48 46 42 M56 42 Q60 48 64 42" stroke="#2D2924" strokeWidth="3" strokeLinecap="round" />
        )}
        <path d={isWorried ? 'M43 59 Q51 53 59 59' : isThinking ? 'M51 56 h1' : 'M43 55 Q51 63 59 55'} stroke="#2D2924" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="53" r="6" fill="#F4B287" opacity="0.3" />
        <circle cx="70" cy="53" r="6" fill="#F4B287" opacity="0.3" />
        <circle cx="94" cy="34" r="16" fill="#F6CD63" stroke="#B58D32" strokeWidth="2" />
        <path d="M94 18 V7" stroke="#467D5C" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="86" cy="6" rx="9" ry="5" fill="#467D5C" transform="rotate(-25 86 6)" />
        <ellipse cx="103" cy="6" rx="9" ry="5" fill="#77A97E" transform="rotate(25 103 6)" />
        <rect x="23" y="87" width="58" height="21" rx="10.5" fill="#FFF6EA" stroke="#EADCCB" />
        <circle cx="40" cy="97" r="2" fill="#467D5C" />
        <circle cx="52" cy="97" r="2" fill="#467D5C" />
        <circle cx="64" cy="97" r="2" fill="#467D5C" />
      </svg>
    </div>
  );
}
