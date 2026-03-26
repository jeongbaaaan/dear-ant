'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { ApiReport } from '@/lib/types';
import { GradeBadge } from '@/components/GradeBadge';
import { CircularGauge } from '@/components/CircularGauge';

const modeConfig: Record<string, { bg: string; text: string; desc: string }> = {
  '방어': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600', desc: '시장으로부터 자산을 보호하는 모드' },
  '관망': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', desc: '한 발 물러서서 시장을 관찰하는 모드' },
  '신중': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', desc: '균형 잡힌 판단으로 접근하는 모드' },
  '적극': { bg: 'bg-rose-50 border-rose-600', text: 'text-rose-600', desc: '기회를 포착해 적극 행동하는 모드' },
};

const investMoodConfig: Record<string, { color: string; label: string; desc: string }> = {
  'A': { color: 'bg-emerald-500', label: '매우 좋음', desc: '오늘은 판단력이 최상입니다' },
  'B': { color: 'bg-blue-500', label: '좋음', desc: '안정적인 판단이 가능합니다' },
  'C': { color: 'bg-amber-500', label: '보통', desc: '신중한 접근이 필요합니다' },
  'D': { color: 'bg-orange-500', label: '주의', desc: '감정적 판단을 경계하세요' },
  'F': { color: 'bg-red-500', label: '위험', desc: '오늘은 매매를 쉬어가세요' },
};

function BiorhythmBar({ label, value, color }: { label: string; value: number; color: string }) {
  const normalized = (value + 100) / 2; // -100~100 → 0~100
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-green-700 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden relative">
        <div className="absolute left-1/2 w-px h-full bg-green-300 z-10" />
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      <span className="text-xs font-bold text-green-800 w-10 text-right">{value > 0 ? '+' : ''}{value}</span>
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
      <span className="text-green-700 text-sm">{label}</span>
      <span className={`text-sm font-bold ${isPositive ? 'text-rose-500' : 'text-emerald-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(Math.round(value))}{unit}
      </span>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const { toast } = useToast();
  const [report, setReport] = useState<ApiReport | null>(null);
  const [prevComparison, setPrevComparison] = useState<PrevComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReport(data.report);

        // 이전 리포트와 비교
        try {
          const histRes = await fetch('/api/history');
          if (!histRes.ok) throw new Error(`HTTP ${histRes.status}`);
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
        <div className="w-12 h-12 rounded-full border-4 border-green-300 border-t-green-900 animate-spin" />
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-green-800 mb-4">리포트를 찾을 수 없습니다.</p>
        <Link href="/" className="text-green-700 hover:text-green-900 underline">
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
  const investMood = investMoodConfig[report.invest_mood || 'C'] || investMoodConfig['C'];

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-6 pb-nav">
      <div className="max-w-md w-full animate-fade-in space-y-5">
        {/* 헤더 */}
        <div className="text-center">
          <p className="text-green-800 text-sm">{date}</p>
          <h1 className="text-2xl font-black text-green-900 mt-1">
            Dear<span className="text-green-800">,</span>ANT Report
          </h1>
        </div>

        {/* 통합 히어로 카드 */}
        <div className="bg-green-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }}
          />
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm font-medium">오늘의 투자 분위기</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-black">{investMood.label}</p>
            <GradeBadge grade={(['S','A','B','C','D','F'].includes(report.invest_mood || '') ? report.invest_mood : 'C') as 'S'|'A'|'B'|'C'|'D'|'F'} size="lg" />
          </div>
          <div className="h-px bg-white/20 mb-4" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs">판단 모드</p>
              <p className="text-xl font-bold mt-0.5">{report.decision_mode}</p>
              <p className="text-white/60 text-xs mt-0.5">{mode.desc}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <p className="text-white/70 text-xs">감정 흔들림</p>
                <p className="text-xl font-bold mt-0.5 text-amber-400">{report.mood_score ?? 0}%</p>
                <p className="text-white/60 text-xs mt-0.5">리스크 {report.risk_tendency}</p>
              </div>
              <CircularGauge
                value={report.mood_score ?? 0}
                size={48}
                strokeWidth={5}
                color="#FBBF24"
              />
            </div>
          </div>
        </div>

        {/* 핵심 지표 카드 */}
        <div className="card-v3 p-5 space-y-5">
          {/* 리스크 성향 */}
          <div className="flex items-center justify-between">
            <span className="text-green-800 text-sm">리스크 성향</span>
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
        <div className="card-v3 p-5">
          <p className="text-green-700 text-sm font-medium mb-4">오늘의 바이오리듬</p>
          <div className="space-y-3">
            <BiorhythmBar label="신체" value={report.biorhythm_physical ?? 0} color="bg-green-500" />
            <BiorhythmBar label="감정" value={report.biorhythm_emotional ?? 0} color="bg-mint-400" />
            <BiorhythmBar label="지성" value={report.biorhythm_intellectual ?? 0} color="bg-blue-400" />
          </div>
        </div>

        {/* 이전 리포트 비교 */}
        {prevComparison && (
          <div className="card-v3 p-5">
            <p className="text-green-700 text-sm font-medium mb-3">이전 리포트와 비교</p>

            {/* 등급 변화 */}
            {prevComparison.gradeBefore !== prevComparison.gradeAfter && (
              <div className="flex items-center justify-between py-2 border-b border-green-100">
                <span className="text-green-700 text-sm">투자 무드</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-800 font-bold">{prevComparison.gradeBefore}</span>
                  <span className="text-green-800">→</span>
                  <span className="text-green-900 font-black">{prevComparison.gradeAfter}</span>
                </div>
              </div>
            )}

            {/* 모드 변화 */}
            {prevComparison.modeBefore !== prevComparison.modeAfter && (
              <div className="flex items-center justify-between py-2 border-b border-green-100">
                <span className="text-green-700 text-sm">판단 모드</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-800">{prevComparison.modeBefore}</span>
                  <span className="text-green-800">→</span>
                  <span className="text-green-900 font-bold">{prevComparison.modeAfter}</span>
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
        <div className="card-v3 p-5">
          <p className="text-green-700 text-sm font-medium mb-3">오늘의 투자 키워드</p>
          <div className="flex flex-wrap gap-2">
            {(report.today_keywords || []).map((keyword, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 오늘의 한마디 */}
        <div className="bg-green-900 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-xs font-medium mb-2">오늘의 한마디</p>
          <p className="font-bold leading-relaxed">
            {report.today_message}
          </p>
        </div>

        {/* 편지 본문 */}
        <div className="card-v3 p-6">
          <p className="text-green-800 text-xs font-medium mb-3">오늘의 편지</p>
          <div className="text-green-700 text-sm leading-relaxed whitespace-pre-line">
            {report.today_letter}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3 pt-2">
          <Link
            href="/survey"
            className="block w-full text-center bg-green-900 hover:bg-green-800 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
          >
            다시 하기
          </Link>
          <div className="flex gap-3">
            <Link
              href="/history"
              className="flex-1 text-center border-2 border-green-200 text-green-700 hover:bg-green-50 font-medium py-3 rounded-2xl transition-all"
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
                  toast('링크가 복사되었어요');
                }
              }}
              className="flex-1 text-center border-2 border-green-200 text-green-700 hover:bg-green-50 font-medium py-3 rounded-2xl transition-all"
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
