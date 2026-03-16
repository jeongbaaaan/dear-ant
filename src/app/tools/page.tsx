'use client';

import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

const tools = [
  {
    href: '/calculator',
    icon: '⚖️',
    title: '적금 vs 투자 비교',
    description: '같은 돈을 적금 vs 주식, 어디에?',
    gradient: 'from-purple-500 to-blue-500',
    border: 'border-purple-100',
    badge: null,
  },
  {
    href: '/compound',
    icon: '📈',
    title: '복리 계산기',
    description: '복리의 마법, 직접 확인하기',
    gradient: 'from-mint-500 to-emerald-500',
    border: 'border-mint-100',
    badge: null,
  },
  {
    href: '/survey',
    icon: '🎯',
    title: '투자 성향 분석',
    description: '오늘의 투자 분위기 체크',
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-100',
    badge: null,
  },
  {
    href: '/tools/returns',
    icon: '🧮',
    title: '수익률 계산기',
    description: '매수·매도가로 수익률 계산',
    gradient: 'from-rose-500 to-pink-500',
    border: 'border-rose-100',
    badge: 'coming soon',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-slate-900">도구 모음</h1>
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-600 text-sm font-medium transition-colors"
          >
            홈으로
          </Link>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Dear,ANT가 준비한 투자 도구들
        </p>

        {/* 캐릭터 */}
        <div className="flex justify-center mb-8">
          <AntCharacter size={100} expression="cool" className="drop-shadow-lg" />
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            const isComingSoon = tool.badge === 'coming soon';
            const cardClass = `
              group relative bg-white/80 backdrop-blur-sm rounded-2xl border ${tool.border}
              shadow-sm p-5 transition-all duration-300
              ${isComingSoon
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-lg hover:shadow-purple-100 hover:-translate-y-0.5 active:scale-[0.98]'
              }
            `;

            const inner = (
              <>
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                {isComingSoon && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full">
                    SOON
                  </span>
                )}
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 leading-tight">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </>
            );

            return isComingSoon ? (
              <div key={tool.href} className={cardClass}>{inner}</div>
            ) : (
              <Link key={tool.href} href={tool.href} className={cardClass}>{inner}</Link>
            );
          })}
        </div>

        {/* 하단 인사이트 */}
        <div className="mt-8 bg-purple-50/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-5">
          <p className="text-purple-600 text-xs font-bold mb-2">
            💡 Dear,ANT의 한마디
          </p>
          <p className="text-purple-500 text-xs leading-relaxed">
            도구는 판단을 돕기 위한 것이에요.
            숫자만 보지 말고, 자신의 투자 성향과 상황을 함께 고려해보세요.
          </p>
        </div>
      </div>
    </main>
  );
}
