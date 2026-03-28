'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PullToRefresh from '@/components/PullToRefresh';
import { SkeletonCard } from '@/components/Skeleton';
import { ApiReport } from '@/lib/types';
import { GradeBadge } from '@/components/GradeBadge';

type FilterType = 'all' | '방어' | '관망' | '신중' | '적극';

const filterLabels: Record<FilterType, string> = {
  all: '전체',
  '방어': '방어',
  '관망': '관망',
  '신중': '신중',
  '적극': '적극',
};

const modeIcon: Record<string, { icon: string; bgClass: string; textClass: string }> = {
  '방어': { icon: 'shield', bgClass: 'bg-surface-container', textClass: 'text-primary' },
  '관망': { icon: 'visibility', bgClass: 'bg-tertiary-container/20', textClass: 'text-tertiary' },
  '신중': { icon: 'balance', bgClass: 'bg-secondary-container/30', textClass: 'text-secondary' },
  '적극': { icon: 'trending_up', bgClass: 'bg-error-container/10', textClass: 'text-error' },
};

function groupByDate(reports: ApiReport[]): Record<string, ApiReport[]> {
  const groups: Record<string, ApiReport[]> = {};
  for (const report of reports) {
    const d = new Date(report.created_at);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${dayNames[d.getDay()]})`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(report);
  }
  return groups;
}

export default function ReportPage() {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filtered = filter === 'all' ? reports : reports.filter(r => r.decision_mode === filter);
  const grouped = groupByDate(filtered);

  const totalReports = reports.length;
  const avgMood = totalReports > 0
    ? Math.round(reports.reduce((s, r) => s + r.mood_score, 0) / totalReports)
    : 0;
  const streakLabel = avgMood <= 35 ? '안정적' : avgMood <= 60 ? '보통' : '변동 높음';

  return (
    <main className="min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
          </div>
          <h1 className="font-headline font-extrabold text-primary text-xl tracking-tight">리포트</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <PullToRefresh onRefresh={async () => { setLoading(true); await fetchHistory(); }}>
        <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-8">
          {/* New Report CTA */}
          <Link href="/survey" className="block">
            <div className="bg-gradient-to-br from-primary to-primary-dim rounded-2xl p-6 text-on-primary shadow-lg overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-headline font-bold">새 리포트 받기</h2>
                  <p className="text-on-primary/70 text-sm mt-1">오늘의 투자 컨디션을 분석해보세요</p>
                </div>
                <div className="w-12 h-12 bg-surface-container-lowest/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Summary Stats */}
          {totalReports > 0 && (
            <section className="space-y-2">
              <span className="font-bold text-xs text-on-surface-variant tracking-[0.15em]">REPORT HISTORY</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tight text-on-surface">
                  {totalReports}
                </span>
                <span className="font-bold text-xl text-on-surface-variant">리포트</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center px-2 py-1 bg-primary-container rounded-full text-on-primary-container text-xs font-bold">
                  <span className="material-symbols-outlined text-sm leading-none mr-1">psychology</span>
                  평균 감정 흔들림 {avgMood}%
                </div>
                <span className="text-on-surface-variant">{streakLabel}</span>
              </div>
            </section>
          )}

          {/* Filters */}
          {totalReports > 0 && (
            <section className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {(Object.keys(filterLabels) as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-none px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
                    filter === f
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </section>
          )}

          {/* Report List */}
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filtered.length === 0 && totalReports === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-4xl">analytics</span>
              </div>
              <div>
                <p className="font-headline font-bold text-lg">아직 리포트가 없습니다</p>
                <p className="text-on-surface-variant">위 버튼을 눌러 첫 리포트를 받아보세요.</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">해당 모드의 리포트가 없습니다.</p>
            </div>
          ) : (
            <section className="space-y-8">
              {Object.entries(grouped).map(([dateKey, items]) => (
                <div key={dateKey} className="space-y-4">
                  <h3 className="text-xs font-extrabold text-outline tracking-widest px-1">{dateKey}</h3>
                  <div className="space-y-2">
                    {items.map(report => {
                      const mode = modeIcon[report.decision_mode] || modeIcon['신중'];
                      const time = new Date(report.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

                      return (
                        <Link
                          key={report.id}
                          href={`/result/${report.id}`}
                          className="bg-surface-container-lowest p-5 rounded-xl flex justify-between items-center transition-all hover:bg-white/80 block"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${mode.bgClass} flex items-center justify-center ${mode.textClass}`}>
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{mode.icon}</span>
                            </div>
                            <div>
                              <h4 className="font-headline font-bold text-on-surface">{report.decision_mode} 모드</h4>
                              <p className="text-on-surface-variant text-sm">감정 흔들림 {report.mood_score}%</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <p className="text-xs text-on-surface-variant">{time}</p>
                            <GradeBadge
                              grade={(['S','A','B','C','D','F'].includes(report.invest_mood || '') ? report.invest_mood : 'C') as 'S'|'A'|'B'|'C'|'D'|'F'}
                              size="sm"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </PullToRefresh>
    </main>
  );
}
