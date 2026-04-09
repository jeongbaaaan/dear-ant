'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { clientStore, StoredReport, StoredMemo } from '@/lib/client-store';
import { GradeBadge } from '@/components/GradeBadge';
import CountUp from '@/components/CountUp';
import Sparkline from '@/components/Sparkline';
import ConditionGauge from '@/components/ConditionGauge';

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

function getStreak(reports: StoredReport[]): number {
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

function toLocalDateStr(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLast7DaysVolume(memos: StoredMemo[]): { label: string; value: number }[] {
  const days: { label: string; value: number }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = toLocalDateStr(d);
    const dayMemos = memos.filter(m => toLocalDateStr(m.created_at) === dateStr);
    const volume = dayMemos.reduce((sum, m) => sum + ((m.price || 0) * (m.quantity || 0)), 0);
    days.push({ label: dayLabels[d.getDay()], value: volume });
  }
  return days;
}

function getModeBadgeClass(mode: string): string {
  switch (mode) {
    case '적극': return 'badge-green';
    case '신중': return 'badge-amber';
    case '방어': return 'badge-red';
    case '관망': return 'badge-blue';
    default: return 'badge-gray';
  }
}

function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

function getFormattedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${year}년 ${month}월 ${day}일 ${weekdays[now.getDay()]}`;
}

export default function Home() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [memos, setMemos] = useState<StoredMemo[]>([]);

  useEffect(() => {
    setReports(clientStore.listReports());
    setMemos(clientStore.listMemos());
  }, []);

  const lastReport = reports.length > 0 ? reports[0] : null;
  const streak = getStreak(reports);

  const portfolio = useMemo(() => {
    // 종목별 포지션 추적 (평균단가법)
    const positions: Record<string, { shares: number; totalCost: number }> = {};
    let realizedPnl = 0;
    const tradeCount = memos.filter(m => (m.action === 'buy' || m.action === 'sell') && m.price && m.quantity).length;

    // 시간순 정렬 (오래된 것 먼저, 같은 시간이면 매수 먼저)
    const actionOrder: Record<string, number> = { buy: 0, sell: 1 };
    const sorted = [...memos]
      .filter(m => (m.action === 'buy' || m.action === 'sell') && m.price && m.quantity)
      .sort((a, b) => {
        const timeDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (timeDiff !== 0) return timeDiff;
        return (actionOrder[a.action] ?? 2) - (actionOrder[b.action] ?? 2);
      });

    for (const m of sorted) {
      const key = m.stock_name;
      if (!positions[key]) positions[key] = { shares: 0, totalCost: 0 };
      const pos = positions[key];

      if (m.action === 'buy') {
        pos.totalCost += m.price! * m.quantity!;
        pos.shares += m.quantity!;
      } else if (m.action === 'sell') {
        const avgPrice = pos.shares > 0 ? pos.totalCost / pos.shares : 0;
        const sellQty = Math.min(m.quantity!, pos.shares);
        realizedPnl += (m.price! - avgPrice) * sellQty;
        pos.totalCost -= avgPrice * sellQty;
        pos.shares -= sellQty;
      }
    }

    // 총 평가 금액 = 보유 포지션 원가 합산 (실시간 시세 없이 평단가 기준)
    const totalValue = Object.values(positions).reduce((s, p) => s + p.totalCost, 0);
    // 순 투자금 = 보유 포지션 원가 (= 총 평가 금액과 동일, 시세 없이)
    const holdingStocks = Object.entries(positions)
      .filter(([, p]) => p.shares > 0)
      .map(([name, p]) => ({ name, shares: p.shares, avgPrice: Math.round(p.totalCost / p.shares), value: Math.round(p.totalCost) }));

    return { totalValue: Math.round(totalValue), realizedPnl: Math.round(realizedPnl), holdingStocks, tradeCount };
  }, [memos]);

  const weeklyVolume = useMemo(() => getLast7DaysVolume(memos), [memos]);
  const maxVolume = Math.max(...weeklyVolume.map(d => d.value), 1);

  // Sparkline data derived from reports
  const conditionSparkline = useMemo(() =>
    reports.slice(0, 12).reverse().map(r => r.mood_score), [reports]);
  const reportCountByWeek = useMemo(() => {
    return reports.slice(0, 12).reverse().map((_, i) => i + 1);
  }, [reports]);

  // Average mood score
  const avgMoodScore = useMemo(() => {
    if (reports.length === 0) return 0;
    return Math.round(reports.reduce((sum, r) => sum + r.mood_score, 0) / reports.length);
  }, [reports]);

  // Combined timeline (reports + memos) sorted by date
  const recentTimeline = useMemo(() => {
    const items: { type: 'report' | 'memo'; date: string; data: StoredReport | StoredMemo }[] = [];
    reports.slice(0, 5).forEach(r => items.push({ type: 'report', date: r.created_at, data: r }));
    memos.slice(0, 5).forEach(m => items.push({ type: 'memo', date: m.created_at, data: m }));
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items.slice(0, 5);
  }, [reports, memos]);

  return (
    <div className="animate-slideUp">
      {/* 1. Greeting */}
      <section className="mb-10 stagger-1">
        <p className="text-sm text-on-surface-tertiary mb-1">{getFormattedDate()}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
          {getGreetingTime()} <span className="inline-block">&#9728;&#65039;</span>
          <br />
          <span className="text-on-surface-secondary">오늘 </span>
          <span className="text-primary">투자 컨디션</span>
          <span className="text-on-surface-secondary">은 어떤가요?</span>
        </h1>
      </section>

      {/* 2. Hero CTA */}
      <section className="mb-10 stagger-2">
        <Link href="/survey" className="block">
          <div className="card card-accent rounded-[20px] p-9 flex justify-between items-center transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
                {streak > 0 ? `Today's Report · ${streak}일 연속` : "Today's Report"}
              </p>
              <h2 className="text-2xl font-extrabold leading-snug mb-2">오늘의 투자 판단 리포트 받기</h2>
              <p className="text-sm text-white/75 leading-relaxed">감정과 컨디션을 분석해서 오늘의 투자 판단을 도와드릴게요</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-8">
              <span className="material-symbols-outlined text-white text-2xl">arrow_forward</span>
            </div>
          </div>
        </Link>
      </section>

      {/* 3. Stats Row (4-col grid) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger-3">
        <div className="card card-raised p-5">
          <p className="text-xs text-on-surface-tertiary font-medium mb-2">총 리포트</p>
          <div className="flex items-end justify-between">
            <CountUp end={reports.length} className="text-2xl font-extrabold tracking-tight" suffix="건" />
            {reportCountByWeek.length >= 2 && (
              <Sparkline data={reportCountByWeek} width={60} height={20} />
            )}
          </div>
        </div>
        <div className="card card-raised p-5">
          <p className="text-xs text-on-surface-tertiary font-medium mb-2">평균 컨디션</p>
          <div className="flex items-end justify-between">
            <CountUp end={avgMoodScore} className="text-2xl font-extrabold tracking-tight" suffix="%" />
            {conditionSparkline.length >= 2 && (
              <Sparkline data={conditionSparkline} width={60} height={20} />
            )}
          </div>
        </div>
        <div className="card card-raised p-5">
          <p className="text-xs text-on-surface-tertiary font-medium mb-2">누적 수익률</p>
          <CountUp
            end={portfolio.realizedPnl}
            className={`text-2xl font-extrabold tracking-tight ${portfolio.realizedPnl >= 0 ? 'text-primary' : 'text-error'}`}
            prefix={portfolio.realizedPnl >= 0 ? '+' : ''}
            formatter={(n) => `${n.toLocaleString()}원`}
          />
        </div>
        <div className="card card-raised p-5">
          <p className="text-xs text-on-surface-tertiary font-medium mb-2">거래 기록</p>
          <CountUp end={portfolio.tradeCount} className="text-2xl font-extrabold tracking-tight" suffix="건" />
        </div>
      </section>

      {/* 4. Two-col: 최근 리포트 + 이번 주 활동 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 stagger-4">
        {/* 최근 리포트 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">최근 리포트</h3>
            <Link href="/report" className="text-sm text-on-surface-tertiary font-medium flex items-center gap-0.5 hover:text-primary transition-colors">
              전체보기
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>
          <div className="card card-raised">
            {lastReport ? (
              <div className="flex gap-6 items-center">
                <ConditionGauge value={lastReport.mood_score} size={80} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${getModeBadgeClass(lastReport.decision_mode)}`}>
                      {lastReport.decision_mode}
                    </span>
                    <GradeBadge grade={(['S','A','B','C','D','F'].includes(lastReport.invest_mood || '') ? lastReport.invest_mood : 'C') as 'S'|'A'|'B'|'C'|'D'|'F'} size="sm" />
                  </div>
                  <p className="text-base font-bold mb-1">
                    투자 컨디션 {lastReport.mood_score >= 70 ? '양호' : lastReport.mood_score >= 40 ? '보통' : '주의'}
                  </p>
                  <p className="text-sm text-on-surface-tertiary leading-relaxed line-clamp-2">
                    {lastReport.mood_score >= 70
                      ? '오늘은 적극적인 투자가 가능한 날이에요.'
                      : lastReport.mood_score >= 40
                      ? '신중한 판단이 필요한 컨디션이에요.'
                      : '투자를 자제하는 것이 좋겠어요.'}
                  </p>
                  <p className="text-xs text-on-surface-quaternary mt-2">{getRelativeDate(lastReport.created_at)}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-quaternary mb-2">description</span>
                <p className="text-sm text-on-surface-tertiary">아직 리포트가 없어요</p>
                <p className="text-xs text-on-surface-quaternary mt-1">셀프체크를 시작해보세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 이번 주 활동 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">이번 주 활동</h3>
          </div>
          <div className="card card-raised">
            {memos.length === 0 && reports.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-quaternary mb-2">bar_chart</span>
                <p className="text-sm text-on-surface-tertiary">표시할 활동이 없습니다</p>
                <p className="text-xs text-on-surface-quaternary mt-1">거래를 기록해보세요</p>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between h-[120px] gap-2 mb-3">
                  {weeklyVolume.map((d, i) => {
                    const h = maxVolume > 0 ? (d.value / maxVolume) * 100 : 0;
                    const isToday = i === 6;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        {isToday && d.value > 0 && (
                          <div className="bg-on-surface text-surface text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                            {d.value >= 10000 ? `${Math.round(d.value / 10000)}만` : d.value.toLocaleString()}
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-primary to-[#00a82d]'
                              : d.value > 0
                              ? 'bg-surface-container'
                              : 'bg-surface-container'
                          }`}
                          style={{ height: `${d.value > 0 ? Math.max(h, 8) : 4}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] font-medium text-on-surface-tertiary">
                  {weeklyVolume.map((d, i) => (
                    <span key={i} className={i === 6 ? 'text-primary font-bold' : ''}>
                      {d.label}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-border">
                  <span className="text-sm text-on-surface-tertiary">
                    리포트 {reports.filter(r => {
                      const d = new Date(r.created_at);
                      const now = new Date();
                      const weekAgo = new Date(now);
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return d >= weekAgo;
                    }).length}건 · 거래 {memos.filter(m => {
                      const d = new Date(m.created_at);
                      const now = new Date();
                      const weekAgo = new Date(now);
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return d >= weekAgo;
                    }).length}건
                  </span>
                  {streak > 0 && (
                    <span className="text-sm font-semibold text-primary">활발</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 5. 투자 도구 (3-col grid) */}
      <section className="mb-10 stagger-5">
        <h3 className="text-lg font-bold mb-4">투자 도구</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/calculator" className="card card-raised p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
            <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-primary">compare_arrows</span>
            </div>
            <p className="text-sm font-semibold mb-0.5">적금 vs 투자</p>
            <p className="text-xs text-on-surface-tertiary">수익 비교 계산</p>
          </Link>
          <Link href="/compound" className="card card-raised p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-blue-600">trending_up</span>
            </div>
            <p className="text-sm font-semibold mb-0.5">복리 계산기</p>
            <p className="text-xs text-on-surface-tertiary">복리의 마법 확인</p>
          </Link>
          <Link href="/tools/simulator" className="card card-raised p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-amber-600">calculate</span>
            </div>
            <p className="text-sm font-semibold mb-0.5">매매 시뮬레이터</p>
            <p className="text-xs text-on-surface-tertiary">수익률 · 물타기</p>
          </Link>
        </div>
      </section>

      {/* 6. Two-col: 포트폴리오 + 최근 기록 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-6">
        {/* 포트폴리오 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">포트폴리오</h3>
            <Link href="/memo" className="text-sm text-on-surface-tertiary font-medium flex items-center gap-0.5 hover:text-primary transition-colors">
              상세보기
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>
          <div className="card card-raised">
            {portfolio.tradeCount > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-xs text-on-surface-tertiary mb-1">총 평가 손익</p>
                  <p className={`text-[28px] font-extrabold tracking-tight ${portfolio.realizedPnl >= 0 ? 'text-primary' : 'text-error'}`}>
                    {portfolio.realizedPnl >= 0 ? '+' : ''}<CountUp end={portfolio.realizedPnl} formatter={(n) => `${n.toLocaleString()}원`} />
                  </p>
                </div>
                {portfolio.holdingStocks.length > 0 && (
                  <div>
                    {portfolio.holdingStocks.map(s => (
                      <div key={s.name} className="flex items-center justify-between py-3 border-b border-surface-border last:border-b-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-xs font-bold text-primary">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{s.name}</p>
                            <p className="text-xs text-on-surface-tertiary">{s.shares}주</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">₩{s.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-quaternary mb-2">account_balance_wallet</span>
                <p className="text-sm text-on-surface-tertiary">거래 기록이 없습니다</p>
                <p className="text-xs text-on-surface-quaternary mt-1">저널에서 거래를 기록해보세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 최근 기록 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">최근 기록</h3>
            <Link href="/report" className="text-sm text-on-surface-tertiary font-medium flex items-center gap-0.5 hover:text-primary transition-colors">
              전체보기
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>
          <div className="card card-raised">
            {recentTimeline.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-quaternary mb-2">history</span>
                <p className="text-sm text-on-surface-tertiary">기록이 없습니다</p>
              </div>
            ) : (
              <div>
                {recentTimeline.map((item, i) => {
                  if (item.type === 'report') {
                    const r = item.data as StoredReport;
                    return (
                      <div key={`r-${i}`} className="flex items-center gap-3.5 py-3.5 border-b border-surface-border last:border-b-0">
                        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                          r.mood_score >= 70 ? 'bg-primary-container text-primary' :
                          r.mood_score >= 40 ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          <span className="material-symbols-outlined text-lg">fact_check</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">투자 리포트 생성</p>
                          <p className="text-xs text-on-surface-tertiary mt-0.5">컨디션 {r.mood_score}% · {r.decision_mode} 모드</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`badge text-[10px] ${getModeBadgeClass(r.decision_mode)}`}>
                            {r.decision_mode}
                          </span>
                          <p className="text-[11px] text-on-surface-quaternary mt-1">{getRelativeDate(r.created_at)}</p>
                        </div>
                      </div>
                    );
                  } else {
                    const m = item.data as StoredMemo;
                    const isBuy = m.action === 'buy';
                    return (
                      <div key={`m-${i}`} className="flex items-center gap-3.5 py-3.5 border-b border-surface-border last:border-b-0">
                        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                          isBuy ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          <span className="material-symbols-outlined text-lg">
                            {isBuy ? 'shopping_cart' : 'sell'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{m.stock_name} {isBuy ? '매수' : '매도'}</p>
                          <p className="text-xs text-on-surface-tertiary mt-0.5">
                            {m.quantity}주 · {m.price?.toLocaleString()}원
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`badge text-[10px] ${isBuy ? 'badge-amber' : 'badge-red'}`}>
                            {isBuy ? '매수' : '매도'}
                          </span>
                          <p className="text-[11px] text-on-surface-quaternary mt-1">{getRelativeDate(m.created_at)}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
