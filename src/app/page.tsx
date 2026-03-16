import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* 캐릭터 */}
        <div className="mb-6">
          <AntCharacter size={140} expression="happy" className="mx-auto drop-shadow-lg" />
        </div>

        {/* 타이틀 */}
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          Dear<span className="text-purple-500">,</span>ANT
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          당신만을 위한 오늘의 투자 리포트
        </p>

        {/* 설명 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left border border-purple-100 shadow-sm">
          <p className="text-slate-600 text-sm leading-relaxed">
            오늘 당신의 <strong className="text-purple-600">바이오리듬</strong>과{' '}
            <strong className="text-mint-500">투자 성향</strong>을 분석하여
            오늘의 투자 분위기를 리포트로 전달합니다.
          </p>
        </div>

        {/* 시작 버튼 */}
        <Link
          href="/survey"
          className="inline-block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-200 active:scale-[0.98] text-lg"
        >
          START
        </Link>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center gap-6 mt-5">
          <Link
            href="/history"
            className="text-slate-400 hover:text-purple-500 text-sm transition-colors"
          >
            이전 리포트
          </Link>
          <span className="text-slate-200">|</span>
          <Link
            href="/memo"
            className="text-slate-400 hover:text-purple-500 text-sm transition-colors"
          >
            주식 메모장
          </Link>
        </div>
      </div>
    </main>
  );
}
