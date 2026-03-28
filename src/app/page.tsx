'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiReport } from '@/lib/types';
import { GradeBadge } from '@/components/GradeBadge';

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((todayStart.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  return `${diffDays}일 전`;
}

function getStreak(reports: ApiReport[]): number {
  if (reports.length === 0) return 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const uniqueDates = Array.from(
    new Set(reports.map((r) => {
      const d = new Date(r.created_at);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }))
  );
  if (uniqueDates[0] !== todayStr) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (uniqueDates[0] !== yesterdayStr) return 0;
  }
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export default function Home() {
  const [reports, setReports] = useState<ApiReport[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => { if (data.reports) setReports(data.reports); })
      .catch((err) => console.error('Failed to fetch history', err));
  }, []);

  const lastReport = reports.length > 0 ? reports[0] : null;
  const streak = getStreak(reports);

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
          </div>
          <span className="font-headline font-extrabold text-primary text-xl tracking-tight">Dear,ANT</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <div className="pt-24 px-6 space-y-8 max-w-2xl mx-auto">
        {/* Hero CTA Card */}
        <section className="relative group">
          <Link href="/report" className="block">
            <div className="bg-gradient-to-br from-primary to-primary-dim rounded-2xl p-8 text-on-primary shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary-container/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary-container">
                    {streak > 0 ? `🔥 ${streak}일 연속` : 'Insights'}
                  </span>
                </div>
                <h2 className="text-3xl font-headline font-bold leading-tight">오늘,<br />투자해도 괜찮은<br />날일까요?</h2>
                <p className="text-on-primary/80 max-w-[240px]">감정과 컨디션을 분석해서 오늘의 투자 판단을 도와드려요.</p>
                <div className="mt-4 bg-surface-container-lowest text-primary px-6 py-3 rounded-full font-bold shadow-sm inline-flex items-center gap-2 hover:bg-primary-container transition-colors">
                  <span>리포트 보기</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Last Report Card */}
        {lastReport && (
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">최근 리포트 · {getRelativeDate(lastReport.created_at)}</p>
                <p className="font-headline font-bold text-lg text-on-surface mt-1">
                  {lastReport.decision_mode} 모드
                </p>
                <p className="text-sm text-on-surface-variant mt-0.5">감정 흔들림 {lastReport.mood_score}%</p>
              </div>
              <GradeBadge grade={(['S','A','B','C','D','F'].includes(lastReport.invest_mood || '') ? lastReport.invest_mood : 'C') as 'S'|'A'|'B'|'C'|'D'|'F'} size="lg" />
            </div>
          </section>
        )}

        {/* Bento Grid */}
        <section className="grid grid-cols-2 gap-4">
          {/* 적금 vs 투자 (2col span) */}
          <Link href="/calculator" className="col-span-2 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 relative overflow-hidden hover:bg-surface-container transition-colors">
            <div className="z-10">
              <span className="material-symbols-outlined text-primary mb-2">compare_arrows</span>
              <h3 className="font-headline font-bold text-lg">적금 vs 투자</h3>
              <p className="text-on-surface-variant">내 자산의 최적 비율 찾기</p>
            </div>
            <span className="text-primary font-bold z-10">비교하기</span>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full" />
          </Link>

          {/* 복리 계산기 */}
          <Link href="/compound" className="bg-surface-container rounded-2xl p-5 flex flex-col justify-between aspect-square hover:bg-surface-container-high transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary">calculate</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base leading-snug">복리 계산기</h3>
              <span className="text-xs text-on-surface-variant mt-1 block">시간의 마법 확인</span>
            </div>
          </Link>

          {/* 트레이딩 저널 */}
          <Link href="/memo" className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col justify-between aspect-square shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">edit_note</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base leading-snug">트레이딩 저널</h3>
              <span className="text-xs text-on-surface-variant mt-1 block">성공의 기록</span>
            </div>
          </Link>
        </section>

        {/* 히스토리 */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-xl">투자 히스토리</h3>
            <Link href="/history" className="text-primary font-bold text-sm">전체보기</Link>
          </div>
          <div className="flex items-end justify-between h-32 gap-3 mb-4">
            {[40, 65, 50, 85, 70, 55, 90].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-lg transition-all ${i === 3 ? 'bg-primary' : 'bg-surface-container hover:bg-primary/30'}`} style={{ height: `${h}%` }}>
                {i === 3 && (
                  <div className="relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap">Today</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </section>

        {/* 포트폴리오 요약 */}
        <section className="bg-surface-container-low rounded-2xl p-6">
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Portfolio Value</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-headline font-extrabold text-on-surface">₩12,450,000</span>
              <span className="text-primary font-bold text-sm">+5.2%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Stocks</span>
              </div>
              <span className="text-lg font-bold">₩8,200,000</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Savings</span>
              </div>
              <span className="text-lg font-bold">₩4,250,000</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
