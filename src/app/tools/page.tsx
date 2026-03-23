'use client';

import Link from 'next/link';

const tools = [
  {
    href: '/calculator',
    title: '적금 vs 투자 비교',
    description: '같은 돈을 적금 vs 주식, 어디에?',
    badge: null,
  },
  {
    href: '/compound',
    title: '복리 계산기',
    description: '복리의 마법, 직접 확인하기',
    badge: null,
  },
  {
    href: '/survey',
    title: '투자 성향 분석',
    description: '오늘의 투자 분위기 체크',
    badge: null,
  },
  {
    href: '/tools/returns',
    title: '수익률 계산기',
    description: '매수·매도가로 수익률 계산',
    badge: 'coming soon',
  },
];

function ToolIcon({ index }: { index: number }) {
  const icons = [
    // 저울 (적금 vs 투자)
    <svg key={0} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M4 7h16" />
      <path d="M4 7l3 8h0a3 3 0 0 0 5.5 0h0L16 7" />
      <path d="M16 7l-3 8" />
      <path d="M8 7l-3 8" />
    </svg>,
    // 차트 (복리)
    <svg key={1} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18" />
      <path d="M5 20V10l4-2 4 3 4-5 4 2v12" />
    </svg>,
    // 타겟 (투자 성향)
    <svg key={2} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>,
    // 계산기 (수익률)
    <svg key={3} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="14" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>,
  ];
  return icons[index] || null;
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-slate-900">도구 모음</h1>
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
          >
            홈으로
          </Link>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Dear,ANT가 준비한 투자 도구들
        </p>

        {/* 도구 리스트 */}
        <div className="flex flex-col gap-3">
          {tools.map((tool, index) => {
            const isComingSoon = tool.badge === 'coming soon';
            const cardClass = `
              flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 transition-colors
              ${isComingSoon
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-slate-100 active:scale-[0.98]'
              }
            `;

            const inner = (
              <>
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500">
                  <ToolIcon index={index} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                      {tool.title}
                    </h3>
                    {isComingSoon && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-400 text-[10px] font-bold rounded-full">
                        SOON
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    {tool.description}
                  </p>
                </div>
                {!isComingSoon && (
                  <svg className="flex-shrink-0 w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </>
            );

            return isComingSoon ? (
              <div key={tool.href} className={cardClass}>{inner}</div>
            ) : (
              <Link key={tool.href} href={tool.href} className={cardClass}>{inner}</Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
