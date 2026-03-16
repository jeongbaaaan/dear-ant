interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
  speech?: string;
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy', speech }: AntCharacterProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Speech bubble */}
      {speech && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1.5 shadow-md border border-purple-100 whitespace-nowrap z-10">
          <p className="text-xs font-medium text-purple-600">{speech}</p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-purple-100 rotate-45" />
        </div>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="headGrad" cx="0.4" cy="0.35" r="0.65">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a855f7" />
          </radialGradient>
          <radialGradient id="bodyGrad" cx="0.4" cy="0.35" r="0.65">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#9333ea" />
          </radialGradient>
          <radialGradient id="cheekGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* === 더듬이 === */}
        <path d="M47 22 Q38 6 26 3" stroke="#7e22ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M73 22 Q82 6 94 3" stroke="#7e22ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* 더듬이 끝 발광 */}
        <circle cx="26" cy="3" r="4.5" fill="#2dd4bf" />
        <circle cx="26" cy="3" r="2.5" fill="#5eead4" opacity="0.6" />
        <circle cx="94" cy="3" r="4.5" fill="#2dd4bf" />
        <circle cx="94" cy="3" r="2.5" fill="#5eead4" opacity="0.6" />

        {/* === 몸통 (아래) === */}
        <ellipse cx="60" cy="88" rx="20" ry="19" fill="url(#bodyGrad)" />
        {/* 몸통 하이라이트 */}
        <ellipse cx="54" cy="82" rx="10" ry="8" fill="#c084fc" opacity="0.25" />

        {/* === 팔 === */}
        <ellipse cx="36" cy="80" rx="7" ry="4" fill="#a855f7" transform="rotate(-15 36 80)" />
        <ellipse cx="84" cy="80" rx="7" ry="4" fill="#a855f7" transform="rotate(15 84 80)" />

        {/* === 발 === */}
        <ellipse cx="48" cy="106" rx="7" ry="3.5" fill="#7e22ce" />
        <ellipse cx="72" cy="106" rx="7" ry="3.5" fill="#7e22ce" />

        {/* === 머리 (위) === */}
        <circle cx="60" cy="42" r="27" fill="url(#headGrad)" />
        {/* 머리 하이라이트 */}
        <ellipse cx="51" cy="33" rx="14" ry="10" fill="white" opacity="0.12" />

        {/* === 눈 === */}
        {expression === 'cool' ? (
          <>
            {/* 선글라스 */}
            <rect x="36" y="35" width="17" height="12" rx="5" fill="#3b0764" />
            <rect x="67" y="35" width="17" height="12" rx="5" fill="#3b0764" />
            <line x1="53" y1="41" x2="67" y2="41" stroke="#3b0764" strokeWidth="2" />
            {/* 반사광 */}
            <line x1="39" y1="38" x2="44" y2="38" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
            <line x1="70" y1="38" x2="75" y2="38" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
          </>
        ) : expression === 'thinking' ? (
          <>
            {/* 한쪽 눈 크게, 한쪽 눈 ─ */}
            <circle cx="48" cy="40" r="6.5" fill="white" />
            <circle cx="48" cy="40" r="3.8" fill="#3b0764" />
            <circle cx="46" cy="38" r="2" fill="white" />
            <path d="M66 41 Q72 38 78 41" stroke="#3b0764" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'worried' ? (
          <>
            {/* 걱정 눈 */}
            <circle cx="48" cy="42" r="6" fill="white" />
            <circle cx="72" cy="42" r="6" fill="white" />
            <circle cx="48" cy="43" r="3.5" fill="#3b0764" />
            <circle cx="72" cy="43" r="3.5" fill="#3b0764" />
            <circle cx="46" cy="41" r="1.8" fill="white" />
            <circle cx="70" cy="41" r="1.8" fill="white" />
            {/* 걱정 눈썹 */}
            <path d="M40 33 Q48 36 56 34" stroke="#7e22ce" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M64 34 Q72 36 80 33" stroke="#7e22ce" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'excited' ? (
          <>
            {/* 큰 반짝 눈 */}
            <circle cx="48" cy="40" r="7.5" fill="white" />
            <circle cx="72" cy="40" r="7.5" fill="white" />
            <circle cx="48" cy="40" r="4" fill="#3b0764" />
            <circle cx="72" cy="40" r="4" fill="#3b0764" />
            <circle cx="46" cy="38" r="2.2" fill="white" />
            <circle cx="70" cy="38" r="2.2" fill="white" />
            <circle cx="49.5" cy="42" r="1" fill="white" opacity="0.5" />
            <circle cx="73.5" cy="42" r="1" fill="white" opacity="0.5" />
          </>
        ) : (
          <>
            {/* 기본 행복한 눈 */}
            <circle cx="48" cy="40" r="6.5" fill="white" />
            <circle cx="72" cy="40" r="6.5" fill="white" />
            <circle cx="48" cy="40" r="3.5" fill="#3b0764" />
            <circle cx="72" cy="40" r="3.5" fill="#3b0764" />
            <circle cx="46" cy="38" r="2" fill="white" />
            <circle cx="70" cy="38" r="2" fill="white" />
          </>
        )}

        {/* === 볼터치 === */}
        {expression !== 'worried' && (
          <>
            <circle cx="34" cy="50" r="6" fill="url(#cheekGrad)" />
            <circle cx="86" cy="50" r="6" fill="url(#cheekGrad)" />
          </>
        )}

        {/* === 입 === */}
        {expression === 'happy' && (
          <path d="M52 53 Q60 59 68 53" stroke="#3b0764" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}
        {expression === 'excited' && (
          <>
            <ellipse cx="60" cy="55" rx="5" ry="3.5" fill="#3b0764" />
            <ellipse cx="60" cy="54" rx="3.5" ry="1.5" fill="#6b21a8" opacity="0.3" />
          </>
        )}
        {expression === 'thinking' && (
          <circle cx="63" cy="53" r="2.5" fill="#3b0764" />
        )}
        {expression === 'worried' && (
          <path d="M52 56 Q60 52 68 56" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
        {expression === 'cool' && (
          <path d="M52 52 Q60 57 68 52" stroke="#3b0764" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}

        {/* === 반짝이 효과 === */}
        {expression === 'excited' && (
          <>
            <g opacity="0.6">
              <line x1="92" y1="18" x2="92" y2="26" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="22" x2="96" y2="22" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g opacity="0.4">
              <line x1="22" y1="22" x2="22" y2="28" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="19" y1="25" x2="25" y2="25" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
