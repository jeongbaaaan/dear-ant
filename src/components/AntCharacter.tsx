interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy' }: AntCharacterProps) {
  const isHappy = expression === 'happy' || expression === 'excited';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* === 더듬이 === */}
      <path d="M40 18 Q32 4 22 2" stroke="#7e22ce" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M60 18 Q68 4 78 2" stroke="#7e22ce" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="2" r="3.5" fill="#2dd4bf" />
      <circle cx="78" cy="2" r="3.5" fill="#2dd4bf" />

      {/* === 머리 === */}
      <circle cx="50" cy="34" r="22" fill="#a855f7" />
      <ellipse cx="43" cy="27" rx="10" ry="7" fill="#c084fc" opacity="0.5" />

      {/* === 몸통 === */}
      <ellipse cx="50" cy="70" rx="17" ry="16" fill="#9333ea" />
      <ellipse cx="50" cy="72" rx="11" ry="11" fill="#c084fc" opacity="0.3" />

      {/* === 팔 === */}
      <ellipse cx="30" cy="64" rx="5.5" ry="3.5" fill="#a855f7" transform="rotate(-20 30 64)" />
      <ellipse cx="70" cy="64" rx="5.5" ry="3.5" fill="#a855f7" transform="rotate(20 70 64)" />

      {/* === 발 === */}
      <ellipse cx="40" cy="85" rx="5.5" ry="3" fill="#7e22ce" />
      <ellipse cx="60" cy="85" rx="5.5" ry="3" fill="#7e22ce" />

      {/* === 눈 === */}
      {expression === 'cool' ? (
        <>
          <rect x="31" y="29" width="14" height="9" rx="4" fill="#3b0764" opacity="0.9" />
          <rect x="55" y="29" width="14" height="9" rx="4" fill="#3b0764" opacity="0.9" />
          <line x1="45" y1="33" x2="55" y2="33" stroke="#3b0764" strokeWidth="1.5" />
        </>
      ) : expression === 'thinking' ? (
        <>
          <circle cx="40" cy="33" r="5.5" fill="white" />
          <circle cx="40" cy="33" r="3" fill="#3b0764" />
          <circle cx="38.5" cy="31.5" r="1.5" fill="white" />
          <path d="M55 33 Q60 30 65 33" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      ) : expression === 'worried' ? (
        <>
          <circle cx="40" cy="34" r="5.5" fill="white" />
          <circle cx="60" cy="34" r="5.5" fill="white" />
          <circle cx="40" cy="35" r="3" fill="#3b0764" />
          <circle cx="60" cy="35" r="3" fill="#3b0764" />
          <circle cx="38.5" cy="33.5" r="1.5" fill="white" />
          <circle cx="58.5" cy="33.5" r="1.5" fill="white" />
          <path d="M34 27 Q40 29 46 28" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M54 28 Q60 29 66 27" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="40" cy="33" r={expression === 'excited' ? 6 : 5.5} fill="white" />
          <circle cx="60" cy="33" r={expression === 'excited' ? 6 : 5.5} fill="white" />
          <circle cx="40" cy="33" r="3.2" fill="#3b0764" />
          <circle cx="60" cy="33" r="3.2" fill="#3b0764" />
          <circle cx="38.5" cy="31.5" r="1.6" fill="white" />
          <circle cx="58.5" cy="31.5" r="1.6" fill="white" />
          <circle cx="41" cy="34.5" r="0.7" fill="white" opacity="0.6" />
          <circle cx="61" cy="34.5" r="0.7" fill="white" opacity="0.6" />
        </>
      )}

      {/* === 볼터치 (민트색) === */}
      {expression !== 'worried' && (
        <>
          <ellipse cx="29" cy="40" rx="4.5" ry="2.5" fill="#5eead4" opacity="0.5" />
          <ellipse cx="71" cy="40" rx="4.5" ry="2.5" fill="#5eead4" opacity="0.5" />
        </>
      )}

      {/* === 입 === */}
      {isHappy && (
        <path d="M44 43 Q50 48 56 43" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {expression === 'excited' && (
        <ellipse cx="50" cy="44" rx="4" ry="2.5" fill="#3b0764" />
      )}
      {expression === 'thinking' && (
        <circle cx="52" cy="43" r="2" fill="#3b0764" />
      )}
      {expression === 'worried' && (
        <path d="M44 45 Q50 42 56 45" stroke="#3b0764" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      )}
      {expression === 'cool' && (
        <path d="M44 42 Q50 46 56 42" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* === excited 반짝이 === */}
      {expression === 'excited' && (
        <>
          <text x="76" y="20" fontSize="7" fill="#2dd4bf" opacity="0.7">✦</text>
          <text x="16" y="16" fontSize="5" fill="#2dd4bf" opacity="0.5">✦</text>
        </>
      )}
    </svg>
  );
}
