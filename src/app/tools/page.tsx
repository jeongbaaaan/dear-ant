'use client';

import Link from 'next/link';

const tools = [
  {
    href: '/calculator',
    title: '적금 vs 투자 비교',
    description: '같은 돈을 적금 vs 주식, 어디에?',
    icon: 'compare_arrows',
    badge: null,
  },
  {
    href: '/compound',
    title: '복리 계산기',
    description: '복리의 마법, 직접 확인하기',
    icon: 'calculate',
    badge: null,
  },
  {
    href: '/tools/returns',
    title: '수익률 계산기',
    description: '매수·매도가로 수익률 계산',
    icon: 'percent',
    badge: 'coming soon',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
          </div>
          <h1 className="font-headline font-extrabold text-primary text-xl tracking-tight">더보기</h1>
        </div>
        <button className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200" aria-label="알림">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-on-surface-variant text-sm">Dear,ANT가 준비한 투자 도구들</p>
        </div>

        <div className="flex flex-col gap-3">
          {tools.map((tool) => {
            const isComingSoon = tool.badge === 'coming soon';

            const inner = (
              <div className={`flex items-center gap-4 bg-surface-container-lowest rounded-xl p-5 transition-all ${
                isComingSoon ? 'opacity-50' : 'hover:bg-white/80 active:scale-[0.98]'
              }`}>
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container text-primary">
                  <span className="material-symbols-outlined">{tool.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-on-surface">
                      {tool.title}
                    </h3>
                    {isComingSoon && (
                      <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full uppercase">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {tool.description}
                  </p>
                </div>
                {!isComingSoon && (
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                )}
              </div>
            );

            return isComingSoon ? (
              <div key={tool.href}>{inner}</div>
            ) : (
              <Link key={tool.href} href={tool.href}>{inner}</Link>
            );
          })}
        </div>

        {/* App Info */}
        <div className="text-center pt-8">
          <p className="text-xs text-on-surface-variant">Dear,ANT v1.0</p>
          <p className="text-[10px] text-outline mt-1">투자 감정 분석 · 데이터는 기기에 저장됩니다</p>
        </div>
      </div>
    </main>
  );
}
