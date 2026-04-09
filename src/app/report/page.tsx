'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import PullToRefresh from '@/components/PullToRefresh';
import { SkeletonCard } from '@/components/Skeleton';
import { clientStore, StoredReport } from '@/lib/client-store';
import { GradeBadge } from '@/components/GradeBadge';
import Sparkline from '@/components/Sparkline';
import TrendChart from '@/components/TrendChart';
import CountUp from '@/components/CountUp';

type FilterType = 'all' | '적극' | '신중' | '관망' | '방어';

const MODES: FilterType[] = ['all', '적극', '신중', '관망', '방어'];

const modeBadge: Record<string, string> = {
  '적극': 'badge-green',
  '신중': 'badge-amber',
  '관망': 'badge-blue',
  '방어': 'badge-red',
};

const gradeOrder = ['S', 'A', 'B', 'C', 'D', 'F'];

type ViewMode = 'list' | 'grid';
type TrendPeriod = '1w' | '1m' | '3m';

const trendPeriodLabel: Record<TrendPeriod, string> = {
  '1w': '1주',
  '1m': '1개월',
  '3m': '3개월',
};

/* ───── Helpers ───── */

function groupByWeek(reports: StoredReport[]): Record<string, StoredReport[]> {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const groups: Record<string, StoredReport[]> = {};

  for (const r of reports) {
    const d = new Date(r.created_at);
    let key: string;
    if (d >= startOfThisWeek) {
      key = '이번 주';
    } else if (d >= startOfLastWeek) {
      key = '지난 주';
    } else {
      const month = d.getMonth() + 1;
      const weekNum = Math.ceil(d.getDate() / 7);
      key = `${month}월 ${weekNum}주차`;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  return groups;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return {
    date: `${d.getMonth() + 1}월 ${d.getDate()}일`,
    day: dayNames[d.getDay()],
    time: d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function averageGrade(reports: StoredReport[]): string {
  if (reports.length === 0) return '-';
  const scores = reports.map(r => {
    const g = r.invest_mood || 'C';
    const idx = gradeOrder.indexOf(g);
    return idx >= 0 ? idx : 3; // default C
  });
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return gradeOrder[Math.round(avg)] || 'C';
}

function mostFrequentMode(reports: StoredReport[]): { mode: string; count: number; pct: number } {
  if (reports.length === 0) return { mode: '-', count: 0, pct: 0 };
  const counts: Record<string, number> = {};
  for (const r of reports) {
    counts[r.decision_mode] = (counts[r.decision_mode] || 0) + 1;
  }
  const mode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { mode: mode[0], count: mode[1], pct: Math.round((mode[1] / reports.length) * 100) };
}

function conditionScore(r: StoredReport): number {
  // Condition = inverted mood_score (lower mood_score = better condition)
  return 100 - r.mood_score;
}

function filterByPeriod(reports: StoredReport[], period: TrendPeriod): StoredReport[] {
  const now = Date.now();
  const ms: Record<TrendPeriod, number> = {
    '1w': 7 * 86400000,
    '1m': 30 * 86400000,
    '3m': 90 * 86400000,
  };
  const cutoff = now - ms[period];
  return reports.filter(r => new Date(r.created_at).getTime() >= cutoff);
}

/* ───── Component ───── */

export default function ReportPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('1m');

  const loadReports = useCallback(() => {
    setReports(clientStore.listReports());
    setLoading(false);
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  /* ── Derived data ── */
  const totalReports = reports.length;

  const avgCondition = useMemo(() => {
    if (totalReports === 0) return 0;
    return Math.round(reports.reduce((s, r) => s + conditionScore(r), 0) / totalReports);
  }, [reports, totalReports]);

  const topMode = useMemo(() => mostFrequentMode(reports), [reports]);
  const avgGrade = useMemo(() => averageGrade(reports), [reports]);

  // Sparkline data (last 10 reports, oldest→newest)
  const sparkReportCounts = useMemo(() => {
    // Group by day, count per day (last 10 days with data)
    const dayCounts: Record<string, number> = {};
    for (const r of reports) {
      const key = new Date(r.created_at).toISOString().slice(0, 10);
      dayCounts[key] = (dayCounts[key] || 0) + 1;
    }
    const sorted = Object.entries(dayCounts).sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.slice(-10).map(e => e[1]);
  }, [reports]);

  const sparkConditions = useMemo(() => {
    return [...reports].reverse().slice(-10).map(r => conditionScore(r));
  }, [reports]);

  // Mode counts for filter chips
  const modeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reports.length };
    for (const r of reports) {
      counts[r.decision_mode] = (counts[r.decision_mode] || 0) + 1;
    }
    return counts;
  }, [reports]);

  // Trend chart data
  const trendData = useMemo(() => {
    const periodReports = filterByPeriod(reports, trendPeriod);
    return [...periodReports]
      .reverse()
      .map(r => ({
        label: `${new Date(r.created_at).getMonth() + 1}/${new Date(r.created_at).getDate()}`,
        value: conditionScore(r),
      }));
  }, [reports, trendPeriod]);

  // Filtered + grouped
  const filtered = filter === 'all' ? reports : reports.filter(r => r.decision_mode === filter);
  const grouped = groupByWeek(filtered);

  return (
    <main className="min-h-screen pb-16">
      <PullToRefresh onRefresh={async () => { setLoading(true); loadReports(); }}>
        <div className="pt-10 pb-8 px-6 md:px-10 max-w-[1100px] mx-auto space-y-8">

          {/* ── 1. Header ── */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">리포트</h1>
              <p className="text-sm text-on-surface-tertiary mt-1">나의 투자 판단 히스토리</p>
            </div>
            <Link href="/survey" className="btn btn-primary">
              <span className="material-symbols-outlined text-lg">add</span>
              새 리포트 받기
            </Link>
          </div>

          {/* ── 2. Stats 4-col grid ── */}
          {totalReports > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total reports */}
              <div className="card card-raised">
                <p className="text-xs text-on-surface-tertiary mb-1.5">총 리포트</p>
                <p className="text-2xl font-extrabold tracking-tight">
                  <CountUp end={totalReports} />
                </p>
                {sparkReportCounts.length >= 2 && (
                  <div className="mt-2">
                    <Sparkline data={sparkReportCounts} />
                  </div>
                )}
              </div>

              {/* Avg condition */}
              <div className="card card-raised">
                <p className="text-xs text-on-surface-tertiary mb-1.5">평균 컨디션</p>
                <p className="text-2xl font-extrabold tracking-tight">
                  <CountUp end={avgCondition} suffix="%" />
                </p>
                {sparkConditions.length >= 2 && (
                  <div className="mt-2">
                    <Sparkline data={sparkConditions} />
                  </div>
                )}
              </div>

              {/* Most frequent mode */}
              <div className="card card-raised">
                <p className="text-xs text-on-surface-tertiary mb-1.5">가장 많은 모드</p>
                <p className="text-xl font-extrabold tracking-tight text-primary">{topMode.mode}</p>
                {topMode.count > 0 && (
                  <span className="badge badge-green mt-1.5 inline-block">
                    {topMode.count}회 ({topMode.pct}%)
                  </span>
                )}
              </div>

              {/* Avg grade */}
              <div className="card card-raised">
                <p className="text-xs text-on-surface-tertiary mb-1.5">평균 등급</p>
                <p className="text-2xl font-extrabold tracking-tight">{avgGrade}</p>
              </div>
            </div>
          )}

          {/* ── 3. Condition Trend Chart ── */}
          {trendData.length >= 2 && (
            <div className="card card-raised">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold">컨디션 추이</h2>
                <div className="flex gap-1 bg-background rounded-lg p-0.5">
                  {(['1w', '1m', '3m'] as TrendPeriod[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setTrendPeriod(p)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        trendPeriod === p
                          ? 'chip-active'
                          : 'text-on-surface-tertiary hover:text-on-surface-secondary'
                      }`}
                    >
                      {trendPeriodLabel[p]}
                    </button>
                  ))}
                </div>
              </div>
              <TrendChart data={trendData} height={120} />
            </div>
          )}

          {/* ── 4. Filter chips + View toggle ── */}
          {totalReports > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {MODES.map(m => (
                  <button
                    key={m}
                    onClick={() => setFilter(m)}
                    className={`chip flex-none ${filter === m ? 'chip-active' : 'chip-default'}`}
                  >
                    {m === 'all' ? '전체' : m} {modeCounts[m] ?? 0}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-background rounded-lg p-0.5 ml-4 flex-shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface shadow-sm text-on-surface' : 'text-on-surface-quaternary'}`}
                  aria-label="리스트 보기"
                >
                  <span className="material-symbols-outlined text-lg">view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-surface shadow-sm text-on-surface' : 'text-on-surface-quaternary'}`}
                  aria-label="그리드 보기"
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 5. Data table / Grid ── */}
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filtered.length === 0 && totalReports === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface-quaternary">
                <span className="material-symbols-outlined text-4xl">analytics</span>
              </div>
              <div>
                <p className="font-bold text-lg">아직 리포트가 없습니다</p>
                <p className="text-on-surface-tertiary text-sm">새 리포트를 받아 투자 컨디션을 분석해보세요</p>
              </div>
              <Link href="/survey" className="btn btn-primary mt-2">
                리포트 받기
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-tertiary">해당 모드의 리포트가 없습니다.</p>
            </div>
          ) : viewMode === 'list' ? (
            /* ── List View (data-table) ── */
            <div className="card card-raised overflow-hidden !p-0">
              {/* Table header — desktop only */}
              <div className="hidden md:grid grid-cols-[160px_100px_100px_80px_1fr_48px] px-6 py-3 border-b border-surface-border">
                <span className="section-label !mb-0 !p-0">날짜</span>
                <span className="section-label !mb-0 !p-0">판단 모드</span>
                <span className="section-label !mb-0 !p-0">컨디션</span>
                <span className="section-label !mb-0 !p-0">등급</span>
                <span className="section-label !mb-0 !p-0">키워드</span>
                <span></span>
              </div>

              {Object.entries(grouped).map(([groupLabel, items]) => (
                <div key={groupLabel}>
                  {/* Group label */}
                  <div className="px-6 pt-4 pb-2">
                    <span className="text-xs font-bold text-on-surface-quaternary">{groupLabel}</span>
                  </div>

                  {items.map(report => {
                    const { date, day, time } = formatDate(report.created_at);
                    const cond = conditionScore(report);
                    const grade = (gradeOrder.includes(report.invest_mood || '') ? report.invest_mood : 'C') as 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
                    const badgeClass = modeBadge[report.decision_mode] || 'badge-green';
                    const condColor = cond >= 70 ? 'text-primary' : cond >= 50 ? 'text-amber-600' : 'text-error';

                    return (
                      <Link
                        key={report.id}
                        href={`/result/${report.id}`}
                        className="block hover:bg-surface-dim transition-colors"
                      >
                        {/* Desktop row */}
                        <div className="hidden md:grid grid-cols-[160px_100px_100px_80px_1fr_48px] px-6 py-4 items-center border-b border-background last:border-b-0">
                          <div>
                            <p className="text-sm font-semibold">{date}</p>
                            <p className="text-xs text-on-surface-quaternary mt-0.5">{day} {time}</p>
                          </div>
                          <div>
                            <span className={`badge ${badgeClass}`}>{report.decision_mode}</span>
                          </div>
                          <div>
                            <span className={`text-base font-bold ${condColor}`}>{cond}%</span>
                          </div>
                          <div>
                            <GradeBadge grade={grade} size="sm" />
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {(report.today_keywords || []).slice(0, 3).map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-background text-xs text-on-surface-tertiary">{kw}</span>
                            ))}
                          </div>
                          <div className="flex justify-end text-on-surface-quaternary">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                          </div>
                        </div>

                        {/* Mobile row */}
                        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-background last:border-b-0">
                          <div className="flex items-center gap-3.5">
                            <GradeBadge grade={grade} size="sm" />
                            <div>
                              <p className="text-sm font-bold">{report.decision_mode} 모드</p>
                              <p className="text-xs text-on-surface-tertiary">{date} · 컨디션 {cond}%</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-on-surface-quaternary text-lg">chevron_right</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(report => {
                const { date, day } = formatDate(report.created_at);
                const cond = conditionScore(report);
                const grade = (gradeOrder.includes(report.invest_mood || '') ? report.invest_mood : 'C') as 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
                const badgeClass = modeBadge[report.decision_mode] || 'badge-green';
                const condColor = cond >= 70 ? 'text-primary' : cond >= 50 ? 'text-amber-600' : 'text-error';

                return (
                  <Link key={report.id} href={`/result/${report.id}`} className="card card-raised hover:shadow-elevated transition-shadow block">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold">{date}</p>
                        <p className="text-xs text-on-surface-quaternary">{day}</p>
                      </div>
                      <GradeBadge grade={grade} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${badgeClass}`}>{report.decision_mode}</span>
                      <span className={`text-base font-bold ${condColor}`}>{cond}%</span>
                    </div>
                    {(report.today_keywords || []).length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {report.today_keywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-background text-xs text-on-surface-tertiary">{kw}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </PullToRefresh>
    </main>
  );
}
