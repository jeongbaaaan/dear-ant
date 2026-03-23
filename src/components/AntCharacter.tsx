interface AntCharacterProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'worried' | 'cool';
  speech?: string;
}

export default function AntCharacter({ size = 120, className = '', expression = 'happy', speech }: AntCharacterProps) {
  // Unique IDs to avoid SVG gradient conflicts when multiple characters render
  const id = expression;

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
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`head-${id}`} cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="60%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a855f7" />
          </radialGradient>
          <radialGradient id={`body-${id}`} cx="0.45" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </radialGradient>
          <radialGradient id={`cheek-${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* === 더듬이 (부드러운 곡선) === */}
        <path d="M40 18 Q34 5 24 2" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M60 18 Q66 5 76 2" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* 더듬이 끝 (동글동글 하트 모양) */}
        <circle cx="24" cy="2" r="3.5" fill="#f0abfc" />
        <circle cx="24" cy="2" r="2" fill="#e879f9" />
        <circle cx="76" cy="2" r="3.5" fill="#f0abfc" />
        <circle cx="76" cy="2" r="2" fill="#e879f9" />

        {/* === 몸통 (작고 귀여운 콩 모양) === */}
        <ellipse cx="50" cy="78" rx="16" ry="14" fill={`url(#body-${id})`} />
        {/* 몸통 하이라이트 */}
        <ellipse cx="45" cy="73" rx="8" ry="6" fill="white" opacity="0.12" />

        {/* === 팔 (짧고 동글) === */}
        <ellipse cx="31" cy="74" rx="5.5" ry="3.5" fill="#b47aee" transform="rotate(-20 31 74)" />
        <ellipse cx="69" cy="74" rx="5.5" ry="3.5" fill="#b47aee" transform="rotate(20 69 74)" />

        {/* === 발 (동글동글) === */}
        <ellipse cx="42" cy="91" rx="6" ry="3" fill="#9333ea" rx-ry="2" />
        <ellipse cx="58" cy="91" rx="6" ry="3" fill="#9333ea" />

        {/* === 머리 (크고 동글 - 카와이 비율) === */}
        <circle cx="50" cy="36" r="26" fill={`url(#head-${id})`} />
        {/* 머리 하이라이트 (광택) */}
        <ellipse cx="42" cy="27" rx="12" ry="9" fill="white" opacity="0.18" />

        {/* === 눈 === */}
        {expression === 'cool' ? (
          <>
            {/* 둥근 선글라스 */}
            <circle cx="40" cy="36" r="8" fill="#3b0764" />
            <circle cx="60" cy="36" r="8" fill="#3b0764" />
            <line x1="48" y1="36" x2="52" y2="36" stroke="#3b0764" strokeWidth="2" />
            {/* 렌즈 반사 */}
            <path d="M35 33 Q38 31 41 33" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" />
            <path d="M55 33 Q58 31 61 33" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" />
          </>
        ) : expression === 'thinking' ? (
          <>
            {/* 한쪽 크게 뜨고 한쪽 찡그린 눈 */}
            <circle cx="40" cy="35" r="7" fill="white" />
            <circle cx="40" cy="36" r="4" fill="#1e1b4b" />
            <circle cx="38" cy="34" r="2" fill="white" />
            {/* 오른눈 ─ (찡그림) */}
            <path d="M54 37 Q60 34 66 37" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'worried' ? (
          <>
            {/* 불안한 큰 눈 (아래로 처진 느낌) */}
            <circle cx="40" cy="37" r="6.5" fill="white" />
            <circle cx="60" cy="37" r="6.5" fill="white" />
            <circle cx="40" cy="38" r="3.5" fill="#1e1b4b" />
            <circle cx="60" cy="38" r="3.5" fill="#1e1b4b" />
            <circle cx="39" cy="36" r="1.8" fill="white" />
            <circle cx="59" cy="36" r="1.8" fill="white" />
            {/* 걱정 눈썹 (ㅅ자) */}
            <path d="M33 28 Q40 32 47 29" stroke="#7e22ce" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M53 29 Q60 32 67 28" stroke="#7e22ce" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'excited' ? (
          <>
            {/* 큰 반짝반짝 눈 (별처럼) */}
            <circle cx="40" cy="35" r="8" fill="white" />
            <circle cx="60" cy="35" r="8" fill="white" />
            <circle cx="40" cy="35" r="4.5" fill="#1e1b4b" />
            <circle cx="60" cy="35" r="4.5" fill="#1e1b4b" />
            {/* 큰 하이라이트 */}
            <circle cx="38" cy="33" r="2.5" fill="white" />
            <circle cx="58" cy="33" r="2.5" fill="white" />
            {/* 작은 하이라이트 */}
            <circle cx="42" cy="37" r="1.2" fill="white" opacity="0.7" />
            <circle cx="62" cy="37" r="1.2" fill="white" opacity="0.7" />
          </>
        ) : (
          <>
            {/* 기본 행복한 큰 눈 */}
            <circle cx="40" cy="35" r="7" fill="white" />
            <circle cx="60" cy="35" r="7" fill="white" />
            <circle cx="40" cy="35" r="3.8" fill="#1e1b4b" />
            <circle cx="60" cy="35" r="3.8" fill="#1e1b4b" />
            <circle cx="38" cy="33" r="2.2" fill="white" />
            <circle cx="58" cy="33" r="2.2" fill="white" />
          </>
        )}

        {/* === 볼터치 (따뜻한 느낌) === */}
        {expression !== 'worried' && (
          <>
            <circle cx="28" cy="44" r="5.5" fill={`url(#cheek-${id})`} />
            <circle cx="72" cy="44" r="5.5" fill={`url(#cheek-${id})`} />
          </>
        )}

        {/* === 입 === */}
        {expression === 'happy' && (
          <path d="M43 47 Q50 54 57 47" stroke="#581c87" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
        {expression === 'excited' && (
          <>
            {/* 크게 웃는 입 (ω) */}
            <path d="M41 47 Q45 53 50 53 Q55 53 59 47" stroke="#581c87" strokeWidth="2" strokeLinecap="round" fill="#fce7f3" />
          </>
        )}
        {expression === 'thinking' && (
          <>
            {/* 삐죽 입 */}
            <circle cx="54" cy="47" r="2.2" fill="#581c87" />
          </>
        )}
        {expression === 'worried' && (
          <path d="M43 50 Q50 46 57 50" stroke="#581c87" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
        {expression === 'cool' && (
          <path d="M43 47 Q50 52 57 47" stroke="#581c87" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* === 반짝이 (excited일 때) === */}
        {expression === 'excited' && (
          <>
            <g opacity="0.7">
              <line x1="84" y1="14" x2="84" y2="22" stroke="#f0abfc" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="80" y1="18" x2="88" y2="18" stroke="#f0abfc" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g opacity="0.5">
              <line x1="14" y1="18" x2="14" y2="24" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="11" y1="21" x2="17" y2="21" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            {/* 작은 별 */}
            <circle cx="90" cy="30" r="1.5" fill="#fbbf24" opacity="0.5" />
            <circle cx="8" cy="12" r="1.2" fill="#f0abfc" opacity="0.4" />
          </>
        )}
      </svg>
    </div>
  );
}
