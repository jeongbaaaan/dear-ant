'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

interface ReportData {
  id: string;
  decision_mode: string;
  mood_score: number;
  risk_tendency: string;
  invest_mood: string;
  biorhythm_physical: number;
  biorhythm_emotional: number;
  biorhythm_intellectual: number;
  today_keywords: string[];
  today_message: string;
  today_letter: string;
  created_at: string;
  sessions?: {
    mood: string;
    birth_date: string;
  };
}

const modeConfig: Record<string, { bg: string; text: string; desc: string }> = {
  '방어': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600', desc: '시장으로부터 자산을 보호하는 모드' },
  '관망': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', desc: '한 발 물러서서 시장을 관찰하는 모드' },
  '신중': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', desc: '균형 잡힌 판단으로 접근하는 모드' },
  '적극': { bg: 'bg-rose-50 border-rose-600', text: 'text-rose-600', desc: '기회를 포착해 적극 행동하는 모드' },
};

const investMoodConfig: Record<string, { color: string; label: string; desc: string }> = {
  'A': { color: 'from-emerald-400 to-mint-500', label: '매우 좋음', desc: '오늘은 판단력이 최상입니다' },
  'B': { color: 'from-blue-400 to-blue-500', label: '좋음', desc: '안정적인 판단이 가능합니다' },
  'C': { color: 'from-amber-500 to-orange-400', label: '보통', desc: '신중한 접근이 필요합니다' },
  'D': { color: 'from-orange-400 to-orange-500', label: '주의', desc: '감정적 판단을 경계하세요' },
  'F': { color: 'from-red-400 to-red-500', label: '위험', desc: '오늘은 매매를 쉬어가세요' },
};

function BiorhythmBar({ label, value, color }: { label: string; value: number; color: string }) {
  const normalized = (value + 100) / 2; // -100~100 → 0~100
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div className="absolute left-1/2 w-px h-full bg-slate-300 z-10" />
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-600 w-10 text-right">{value > 0 ? '+' : ''}{value}</span>
    </div>
  );
}

interface PrevComparison {
  moodDiff: number;
  gradeBefore: string;
  gradeAfter: string;
  modeBefore: string;
  modeAfter: string;
  bioPhysicalDiff: number;
  bioEmotionalDiff: number;
  bioIntellectualDiff: number;
}

function DiffBadge({ value, label, unit = '' }: { value: number; label: string; unit?: string }) {
  if (Math.abs(value) < 1) return null;
  const isPositive = value > 0;
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`text-sm font-bold ${isPositive ? 'text-rose-500' : 'text-emerald-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(Math.round(value))}{unit}
      </span>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [prevComparison, setPrevComparison] = useState<PrevComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        const data = await res.json();
        setReport(data.report);

        // 이전 리포트와 비교
        try {
          const histRes = await fetch('/api/history');
          const histData = await histRes.json();
          const allReports = histData.reports || [];
          const currentIdx = allReports.findIndex((r: { id: string }) => r.id === params.id);
          const prev = allReports[currentIdx + 1]; // 바로 이전 리포트
          if (prev && data.report) {
            setPrevComparison({
              moodDiff: data.report.mood_score - prev.mood_score,
              gradeBefore: prev.invest_mood || 'C',
              gradeAfter: data.report.invest_mood,
              modeBefore: prev.decision_mode,
              modeAfter: data.report.decision_mode,
              bioPhysicalDiff: (data.report.biorhythm_physical || 0) - (prev.biorhythm_physical || 0),
              bioEmotionalDiff: (data.report.biorhythm_emotional || 0) - (prev.biorhythm_emotional || 0),
              bioIntellectualDiff: (data.report.biorhythm_intellectual || 0) - (prev.biorhythm_intellectual || 0),
            });
          }
        } catch { /* 비교 데이터 없어도 괜찮음 */ }
      } catch {
        console.error('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-slate-400 mb-4">리포트를 찾을 수 없습니다.</p>
        <Link href="/" className="text-purple-500 hover:text-purple-700 underline">
          홈으로 돌아가기
        </Link>
      </main>
    );
  }

  const date = new Date(report.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mode = modeConfig[report.decision_mode] || modeConfig['신중'];
  const investMood = investMoodConfig[report.invest_mood] || investMoodConfig['C'];

  const antExpression = (() => {
    switch (report.invest_mood) {
      case 'A': return 'excited' as const;
      case 'B': return 'happy' as const;
      case 'C': return 'thinking' as const;
      case 'D': return 'worried' as const;
      case 'F': return 'worried' as const;
      default: return 'happy' as const;
    }
  })();

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-6 pb-nav">
      <div className="max-w-md w-full animate-fade-in space-y-5">
        {/* 헤더 + 캐릭터 */}
        <div className="text-center">
          <AntCharacter size={90} expression={antExpression} className="mx-auto mb-2" />
          <p className="text-slate-400 text-sm">{date}</p>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Dear<span className="text-purple-500">,</span>ANT Report
          </h1>
        </div>

        {/* 투자 분위기 등급 - 메인 카드 */}
        <div className={`bg-gradient-to-br ${investMood.color} rounded-3xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm font-medium">오늘의 투자 분위기</span>
            <span className="text-4xl font-black">{report.invest_mood}</span>
          </div>
          <p className="text-xl font-bold">{investMood.label}</p>
          <p className="text-white/80 text-sm mt-1">{investMood.desc}</p>
        </div>

        {/* 판단 모드 */}
        <div className={`rounded-2xl border p-5 ${mode.bg}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 text-sm">판단 모드</span>
            <span className={`text-xl font-black ${mode.text}`}>{report.decision_mode}</span>
          </div>
          <p className="text-slate-400 text-xs">{mode.desc}</p>
        </div>

        {/* 핵심 지표 카드 */}
        <div className="card-premium p-5 space-y-5">
          {/* 감정 흔들림 지수 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">감정 흔들림 지수</span>
              <span className="text-slate-800 font-black text-lg">{report.mood_score}%</span>
            </div>
            <div className="w-full h-3 bg-purple-50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-mint-300 via-purple-400 to-purple-600"
                style={{ width: `${report.mood_score}%` }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-1.5">
              {report.mood_score <= 30 ? '안정적인 감정 상태입니다' :
               report.mood_score <= 60 ? '약간의 감정 변동이 감지됩니다' :
               '감정 변동이 높습니다. 신중한 판단이 필요합니다'}
            </p>
          </div>

          {/* 리스크 성향 */}
          <div className="flex items-center justify-between py-3 border-t border-purple-50">
            <span className="text-slate-500 text-sm">리스크 성향</span>
            <span className={`font-bold ${
              report.risk_tendency === '높음' ? 'text-rose-500' :
              report.risk_tendency === '중간' ? 'text-amber-500' :
              'text-emerald-500'
            }`}>
              {report.risk_tendency}
            </span>
          </div>
        </div>

        {/* 바이오리듬 */}
        <div className="card-premium p-5">
          <p className="text-slate-500 text-sm font-medium mb-4">오늘의 바이오리듬</p>
          <div className="space-y-3">
            <BiorhythmBar label="신체" value={report.biorhythm_physical} color="bg-purple-400" />
            <BiorhythmBar label="감정" value={report.biorhythm_emotional} color="bg-mint-400" />
            <BiorhythmBar label="지성" value={report.biorhythm_intellectual} color="bg-blue-400" />
          </div>
        </div>

        {/* 이전 리포트 비교 */}
        {prevComparison && (
          <div className="card-premium p-5">
            <p className="text-slate-500 text-sm font-medium mb-3">이전 리포트와 비교</p>

            {/* 등급 변화 */}
            {prevComparison.gradeBefore !== prevComparison.gradeAfter && (
              <div className="flex items-center justify-between py-2 border-b border-purple-50">
                <span className="text-slate-500 text-sm">투자 무드</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">{prevComparison.gradeBefore}</span>
                  <span className="text-purple-400">→</span>
                  <span className="text-purple-600 font-black">{prevComparison.gradeAfter}</span>
                </div>
              </div>
            )}

            {/* 모드 변화 */}
            {prevComparison.modeBefore !== prevComparison.modeAfter && (
              <div className="flex items-center justify-between py-2 border-b border-purple-50">
                <span className="text-slate-500 text-sm">판단 모드</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{prevComparison.modeBefore}</span>
                  <span className="text-purple-400">→</span>
                  <span className="text-purple-600 font-bold">{prevComparison.modeAfter}</span>
                </div>
              </div>
            )}

            <DiffBadge value={prevComparison.moodDiff} label="감정 흔들림" unit="%" />
            <DiffBadge value={prevComparison.bioPhysicalDiff} label="신체 바이오리듬" />
            <DiffBadge value={prevComparison.bioEmotionalDiff} label="감정 바이오리듬" />
            <DiffBadge value={prevComparison.bioIntellectualDiff} label="지성 바이오리듬" />
          </div>
        )}

        {/* 오늘의 투자 키워드 */}
        <div className="card-premium p-5">
          <p className="text-slate-500 text-sm font-medium mb-3">오늘의 투자 키워드</p>
          <div className="flex flex-wrap gap-2">
            {(report.today_keywords || []).map((keyword, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-100"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 오늘의 한마디 */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-white/70 text-xs font-medium mb-2">오늘의 한마디</p>
          <p className="font-bold leading-relaxed">
            {report.today_message}
          </p>
        </div>

        {/* 편지 본문 */}
        <div className="card-premium p-6">
          <p className="text-slate-400 text-xs font-medium mb-3">오늘의 편지</p>
          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {report.today_letter}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3 pt-2">
          <Link
            href="/survey"
            className="block w-full text-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-200"
          >
            다시 하기
          </Link>
          <div className="flex gap-3">
            <Link
              href="/history"
              className="flex-1 text-center border-2 border-purple-200 text-purple-500 hover:bg-purple-50 font-medium py-3 rounded-2xl transition-all"
            >
              히스토리
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Dear,ANT - 오늘의 투자 분위기 리포트',
                    text: `투자 분위기 ${report.invest_mood}등급 | 판단 모드: ${report.decision_mode}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 복사되었습니다!');
                }
              }}
              className="flex-1 text-center border-2 border-purple-200 text-purple-500 hover:bg-purple-50 font-medium py-3 rounded-2xl transition-all"
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
