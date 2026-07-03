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
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {speech && (
        <div className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#eadccb] bg-[#fffaf2] px-3 py-1.5 shadow-raised">
          <p className="text-xs font-black text-primary">{speech}</p>
        </div>
      )}

      <div className="absolute inset-x-[12%] bottom-[3%] h-[8%] rounded-full bg-[#e7d8c4]" />

      <div className="absolute left-[12%] top-[10%] h-[80%] w-[76%] rounded-[42%_42%_46%_46%] bg-[#b97a4e] shadow-[inset_0_-10px_0_rgba(110,74,52,0.12),0_18px_38px_rgba(62,42,25,0.13)]">
        <div className="absolute -left-[4%] top-[11%] h-[22%] w-[20%] rotate-[-18deg] rounded-full bg-[#9f6946]" />
        <div className="absolute -right-[4%] top-[11%] h-[22%] w-[20%] rotate-[18deg] rounded-full bg-[#9f6946]" />
        <div className="absolute left-[16%] top-[11%] h-[16%] w-[24%] rotate-[-15deg] rounded-full bg-white/20" />

        <div className="absolute left-[19%] top-[39%] h-[9%] w-[9%] rounded-full bg-[#2d2924]" />
        <div className="absolute right-[19%] top-[39%] h-[9%] w-[9%] rounded-full bg-[#2d2924]" />

        {isExcited && (
          <>
            <div className="absolute left-[16%] top-[38%] h-[12%] w-[12%] rotate-45 rounded-[3px] bg-[#2d2924]" />
            <div className="absolute right-[16%] top-[38%] h-[12%] w-[12%] rotate-45 rounded-[3px] bg-[#2d2924]" />
          </>
        )}
        {isCool && (
          <>
            <div className="absolute left-[14%] top-[38%] h-[8%] w-[20%] rounded-full bg-[#2d2924]" />
            <div className="absolute right-[14%] top-[38%] h-[8%] w-[20%] rounded-full bg-[#2d2924]" />
          </>
        )}
        {isThinking && (
          <>
            <div className="absolute left-[17%] top-[38%] h-[8%] w-[16%] rounded-t-full border-t-[3px] border-[#2d2924]" />
            <div className="absolute right-[17%] top-[38%] h-[8%] w-[16%] rounded-t-full border-t-[3px] border-[#2d2924]" />
          </>
        )}
        {isWorried && (
          <>
            <div className="absolute left-[17%] top-[37%] h-[8%] w-[16%] -rotate-6 rounded-t-full border-t-[3px] border-[#2d2924]" />
            <div className="absolute right-[17%] top-[37%] h-[8%] w-[16%] rotate-6 rounded-t-full border-t-[3px] border-[#2d2924]" />
          </>
        )}

        <div className="absolute left-1/2 top-[51%] h-[25%] w-[42%] -translate-x-1/2 rounded-[48%] bg-[#d9a17b]">
          <div className="absolute left-1/2 top-[16%] h-[28%] w-[36%] -translate-x-1/2 rounded-full bg-[#6e4a34]" />
          <div className={`absolute left-1/2 top-[58%] h-[14%] -translate-x-1/2 border-b-[3px] border-[#2d2924] ${isWorried ? 'w-[24%] rounded-t-full border-t-[3px] border-b-0' : 'w-[32%] rounded-b-full'}`} />
        </div>

        <div className="absolute left-[10%] top-[57%] h-[12%] w-[12%] rounded-full bg-[#f4b287]/35" />
        <div className="absolute right-[10%] top-[57%] h-[12%] w-[12%] rounded-full bg-[#f4b287]/35" />

        <div className="absolute -right-[8%] top-[2%] grid h-[28%] w-[28%] place-items-center rounded-full border-2 border-[#b58d32] bg-[#f6cd63] text-[10px] font-black text-[#467d5c]">
          bara
        </div>
      </div>
    </div>
  );
}
