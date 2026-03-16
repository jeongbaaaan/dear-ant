'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

interface HistoryReport {
  id: string;
  decision_mode: string;
  mood_score: number;
  risk_tendency: string;
  invest_mood?: string;
  biorhythm_physical?: number;
  biorhythm_emotional?: number;
  biorhythm_intellectual?: number;
  today_keywords?: string[];
  today_message: string;
  created_at: string;
  sessions?: {
    mood: string;
  };
}

const modeColors: Record<string, string> = {
  '방어': 'bg-blue-50 text-blue-600 border-blue-200',
  '관망': 'bg-amber-50 text-amber-600 border-amber-200',
  '신중': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '적극': 'bg-rose-50 text-rose-600 border-rose-200',
};

const moodGradeToNum: Record<string, number> = {
  'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1,
};

const moodGradeColor: Record<string, string> = {
  'A': 'text-emerald-500',
  'B': 'text-blue-500',
  'C': 'text-amber-500',
  'D': 'text-orange-500',
  'F': 'text-red-500',
};

// 미니 트렌드 차트 (SVG)
function TrendChart({ reports }: { reports: HistoryReport[] }) {
  const data = [...reports].reverse().slice(-7);
  if (data.length < 2) return null;

  const width = 280;
  const height = 100;
  const padding = 20;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  // 투자 무드 라인
  const moodPoints = data.map((r, i) => {
    const x = padding + (i / (data.length - 1)) * chartW;
    const val = moodGradeToNum[r.invest_mood || 'C'] || 3;
    const y = padding + chartH - ((val - 1) / 4) * chartH;
    return { x, y, grade: r.invest_mood || 'C' };
  });

  // 감정 흔들림 라인
  const emotionPoints = data.map((r, i) => {
    const x = padding + (i / (data.length - 1)) * chartW;
    const y = padding + chartH - (r.mood_score / 100) * chartH;
    return { x, y };
  });

  const moodPath = moodPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const emotionPath = emotionPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-sm font-medium">투자 성향 트렌드</p>
        <p className="text-slate-400 text-xs">최근 {data.length}회</p>
      </div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* 그리드 라인 */}
        {[1, 2, 3, 4, 5].map(v => {
          const y = padding + chartH - ((v - 1) / 4) * chartH;
          return (
            <g key={v}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f3e8ff" strokeWidth="1" />
              <text x={padding - 4} y={y + 3} fontSize="8" fill="#a78bfa" textAnchor="end">
                {['', 'F', 'D', 'C', 'B', 'A'][v]}
              </text>
            </g>
          );
        })}

        {/* 감정 흔들림 라인 (서브) */}
        <path d={emotionPath} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

        {/* 투자 무드 라인 (메인) */}
        <path d={moodPath} fill="none" stroke="#7e22ce" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* 포인트 */}
        {moodPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#7e22ce" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-purple-600 rounded" />
          <span>투자 무드</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-mint-400 rounded opacity-60" />
          <span>감정 흔들림</span>
        </div>
      </div>
    </div>
  );
}

// 통계 요약 카드
function StatsSummary({ reports }: { reports: HistoryReport[] }) {
  if (reports.length === 0) return null;

  const avgMoodScore = Math.round(reports.reduce((s, r) => s + r.mood_score, 0) / reports.length);

  // 최다 판단 모드
  const modeCounts: Record<string, number> = {};
  reports.forEach(r => { modeCounts[r.decision_mode] = (modeCounts[r.decision_mode] || 0) + 1; });
  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0];

  // 최다 등급
  const gradeCounts: Record<string, number> = {};
  reports.forEach(r => { if (r.invest_mood) gradeCounts[r.invest_mood] = (gradeCounts[r.invest_mood] || 0) + 1; });
  const topGrade = Object.entries(gradeCounts).sort((a, b) => b[1] - a[1])[0];

  // 연속 참여일
  const streak = reports.length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="card-premium p-4">
        <p className="text-slate-400 text-xs mb-1">평균 감정 흔들림</p>
        <p className="text-2xl font-black text-slate-800">{avgMoodScore}<span className="text-sm font-normal text-slate-400">%</span></p>
        <p className="text-xs text-slate-400 mt-0.5">
          {avgMoodScore <= 35 ? '안정적 👍' : avgMoodScore <= 60 ? '보통' : '변동 높음'}
        </p>
      </div>
      <div className="card-premium p-4">
        <p className="text-slate-400 text-xs mb-1">주요 판단 모드</p>
        <p className="text-2xl font-black text-slate-800">{topMode?.[0] || '-'}</p>
        <p className="text-xs text-slate-400 mt-0.5">{topMode ? `${topMode[1]}회 (${Math.round(topMode[1] / reports.length * 100)}%)` : ''}</p>
      </div>
      <div className="card-premium p-4">
        <p className="text-slate-400 text-xs mb-1">최다 등급</p>
        <p className={`text-2xl font-black ${moodGradeColor[topGrade?.[0] || 'C']}`}>{topGrade?.[0] || '-'}</p>
        <p className="text-xs text-slate-400 mt-0.5">{topGrade ? `${topGrade[1]}회 기록` : ''}</p>
      </div>
      <div className="card-premium p-4">
        <p className="text-slate-400 text-xs mb-1">총 리포트</p>
        <p className="text-2xl font-black text-purple-600">{streak}<span className="text-sm font-normal text-slate-400">회</span></p>
        <p className="text-xs text-slate-400 mt-0.5">기록이 쌓이는 중</p>
      </div>
    </div>
  );
}

// 이전 비교 뱃지
function ComparisonBadge({ current, previous }: { current: HistoryReport; previous: HistoryReport }) {
  const moodDiff = current.mood_score - previous.mood_score;
  const currentGrade = moodGradeToNum[current.invest_mood || 'C'];
  const prevGrade = moodGradeToNum[previous.invest_mood || 'C'];
  const gradeDiff = currentGrade - prevGrade;

  return (
    <div className="flex items-center gap-2 text-xs">
      {gradeDiff > 0 && (
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium">등급 ↑</span>
      )}
      {gradeDiff < 0 && (
        <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-medium">등급 ↓</span>
      )}
      {moodDiff < -10 && (
        <span className="px-2 py-0.5 bg-mint-50 text-mint-700 rounded-full font-medium">안정 ↑</span>
      )}
      {moodDiff > 10 && (
        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium">변동 ↑</span>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [reports, setReports] = useState<HistoryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setReports(data.reports || []);
      } catch {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              리포트 히스토리
            </h1>
            <p className="text-slate-400 text-sm mt-1">나의 투자 판단 기록</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <AntCharacter size={100} expression="thinking" className="mx-auto mb-4" />
            <p className="text-slate-400 mb-4">아직 리포트가 없습니다</p>
            <Link
              href="/survey"
              className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 px-6 rounded-2xl transition-all"
            >
              첫 리포트 받기
            </Link>
          </div>
        ) : (
          <>
            {/* 탭 전환 */}
            <div className="flex bg-purple-50 rounded-xl p-1 mb-5">
              <button
                onClick={() => setView('dashboard')}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                  view === 'dashboard' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'
                }`}
              >
                대시보드
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                  view === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'
                }`}
              >
                전체 기록
              </button>
            </div>

            {view === 'dashboard' ? (
              <div className="space-y-4 animate-fade-in">
                {/* 트렌드 차트 */}
                <TrendChart reports={reports} />

                {/* 통계 요약 */}
                <StatsSummary reports={reports} />

                {/* 최근 리포트 미리보기 */}
                {reports[0] && (
                  <Link
                    href={`/result/${reports[0].id}`}
                    className="block bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-xs font-medium">최근 리포트</span>
                      <span className="text-xl font-black">{reports[0].invest_mood || '-'}등급</span>
                    </div>
                    <p className="text-sm text-white/80 line-clamp-2">{reports[0].today_message}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-white/50">
                      <span>{reports[0].decision_mode} 모드</span>
                      <span>감정 {reports[0].mood_score}%</span>
                      <span className="ml-auto">→ 자세히 보기</span>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {reports.map((report, idx) => {
                  const date = new Date(report.created_at).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short',
                  });
                  const prevReport = reports[idx + 1]; // 이전 리포트 (시간순 역순)
                  return (
                    <Link
                      key={report.id}
                      href={`/result/${report.id}`}
                      className="block bg-white rounded-2xl border border-purple-100 p-4 hover:shadow-md hover:border-purple-200 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">{date}</span>
                          {report.invest_mood && (
                            <span className={`text-xs font-black ${moodGradeColor[report.invest_mood] || 'text-purple-500'}`}>
                              {report.invest_mood}등급
                            </span>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${modeColors[report.decision_mode] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {report.decision_mode}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {report.today_message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>감정 흔들림 {report.mood_score}%</span>
                          <span>리스크 {report.risk_tendency}</span>
                        </div>
                        {prevReport && <ComparisonBadge current={report} previous={prevReport} />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
