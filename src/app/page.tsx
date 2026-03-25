'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HistoryReport {
  id: string;
  decision_mode: string;
  mood_score: number;
  invest_mood: string;
  created_at: string;
}

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

function getStreak(reports: HistoryReport[]): number {
  if (reports.length === 0) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get unique dates (sorted descending, already from API)
  const uniqueDates = Array.from(
    new Set(
      reports.map((r) => {
        const d = new Date(r.created_at);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    )
  );

  // Streak must start from today or yesterday
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
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function gradeColor(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-emerald-500';
    case 'B+':
    case 'B':
      return 'text-blue-500';
    case 'C+':
    case 'C':
      return 'text-amber-500';
    default:
      return 'text-red-500';
  }
}

export default function Home() {
  const [reports, setReports] = useState<HistoryReport[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.reports) setReports(data.reports);
      })
      .catch((err) => {
        console.error('Failed to fetch history', err);
      });
  }, []);

  const lastReport = reports.length > 0 ? reports[0] : null;
  const streak = getStreak(reports);

  return (
    <main className="min-h-screen bg-white px-5 pt-16 pb-nav">
      <div className="max-w-sm mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#111" />
            <polyline points="6,16 10,16 13,8 16,22 19,12 22,16 26,16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-[17px] font-bold text-slate-900 tracking-tight">
            Dear,ANT
          </span>
        </div>

        {/* Hero copy */}
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold text-slate-900 leading-tight">
            오늘,<br />
            투자해도 괜찮은<br />
            날일까요?
          </h1>
          <p className="text-slate-400 text-[14px] mt-3 leading-relaxed">
            감정과 컨디션을 분석해서<br />
            오늘의 투자 판단을 도와드려요
          </p>
        </div>

        {/* Main CTA */}
        <div className="mb-8">
          <Link
            href="/survey"
            className="flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-5 py-4 transition-colors"
          >
            <div>
              <p className="font-bold text-[15px]">오늘의 리포트 받기</p>
              <p className="text-slate-400 text-[12px] mt-0.5">약 2분 소요</p>
            </div>
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* Streak badge */}
          {streak > 0 && (
            <p className="text-slate-400 text-[12px] mt-2 px-1">
              🔥 {streak}일 연속 기록 중
            </p>
          )}
        </div>

        {/* Last report summary card */}
        {lastReport && (
          <div className="bg-slate-50 rounded-2xl px-5 py-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[11px] font-medium mb-1">
                  최근 리포트 · {getRelativeDate(lastReport.created_at)}
                </p>
                <p className="text-slate-700 text-[13px] font-semibold">
                  {lastReport.decision_mode === 'rational' ? '이성적' : lastReport.decision_mode === 'emotional' ? '감정적' : lastReport.decision_mode} · 감정 {lastReport.mood_score}점
                </p>
              </div>
              <span className={`text-[28px] font-extrabold ${gradeColor(lastReport.invest_mood)}`}>
                {lastReport.invest_mood}
              </span>
            </div>
          </div>
        )}

        {/* Section label */}
        <p className="text-slate-400 text-[12px] font-medium mb-3 px-1">둘러보기</p>

        {/* Feature list */}
        <div className="flex flex-col gap-2">
          <Link href="/history" className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-[14px]">히스토리</p>
              <p className="text-slate-400 text-[12px]">내 투자 컨디션 변화 추이</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/memo" className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-[14px]">트레이딩 저널</p>
              <p className="text-slate-400 text-[12px]">매매 기록과 그때의 감정</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/calculator" className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="14" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-[14px]">적금 vs 투자</p>
              <p className="text-slate-400 text-[12px]">리스크 포함 수익률 비교</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/compound" className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-[14px]">복리 계산기</p>
              <p className="text-slate-400 text-[12px]">시간이 만드는 수익 시뮬레이션</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
