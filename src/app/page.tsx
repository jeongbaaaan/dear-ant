import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-nav">
      <div className="max-w-md w-full text-center">
        {/* Floating ant with sparkles */}
        <div className="relative mb-4 animate-fade-in">
          {/* Decorative sparkles */}
          <div className="absolute -top-4 left-1/4 w-2 h-2 bg-mint-300 rounded-full animate-pulse-soft" />
          <div className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
          <div className="absolute -top-2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />

          <div className="animate-float">
            <AntCharacter size={130} expression="happy" className="mx-auto drop-shadow-xl" />
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in stagger-1">
          <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
            Dear<span className="text-purple-500">,</span><span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">ANT</span>
          </h1>
          <p className="text-slate-400 text-sm">
            당신만을 위한 오늘의 투자 리포트
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="mt-8 animate-fade-in stagger-2">
          <Link
            href="/survey"
            className="block card-premium p-6 group cursor-pointer hover:border-purple-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 text-base">오늘의 투자 리포트 받기</h3>
                <p className="text-slate-400 text-xs mt-0.5">감정 분석 · 바이오리듬 · 투자 등급</p>
              </div>
              <svg className="w-5 h-5 text-purple-300 ml-auto group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 animate-fade-in stagger-3">
          <Link href="/history" className="card-premium p-4 text-left group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-3 shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">히스토리</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">트렌드 · 대시보드</p>
          </Link>

          <Link href="/memo" className="card-premium p-4 text-left group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mb-3 shadow-md shadow-emerald-100 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">트레이딩 저널</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">매매 기록 · 감정 분석</p>
          </Link>

          <Link href="/calculator" className="card-premium p-4 text-left group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-3 shadow-md shadow-amber-100 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="14" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="14" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">적금 vs 투자</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">리스크 포함 비교</p>
          </Link>

          <Link href="/compound" className="card-premium p-4 text-left group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center mb-3 shadow-md shadow-purple-100 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">복리 계산기</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">복리의 마법 체험</p>
          </Link>
        </div>

        {/* Motivational quote */}
        <div className="mt-6 animate-fade-in stagger-4">
          <div className="card-premium p-4 animate-shimmer">
            <p className="text-purple-400 text-xs leading-relaxed">
              &ldquo;성공적인 투자는 감정 관리에서 시작됩니다&rdquo;
            </p>
          </div>
        </div>

        {/* Version tag */}
        <p className="text-slate-300 text-[10px] mt-6">Dear,ANT v2.0 · Made with 🐜</p>
      </div>
    </main>
  );
}
