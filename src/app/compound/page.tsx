'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import CountUp from '@/components/CountUp';

// ─── 포맷 헬퍼 ───────────────────────────────────────────
function formatKRW(value: number): string {
  if (value >= 100_000_000) {
    const eok = Math.floor(value / 100_000_000);
    const man = Math.floor((value % 100_000_000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만` : `${eok}억`;
  }
  if (value >= 10_000) {
    return `${Math.floor(value / 10_000).toLocaleString()}만`;
  }
  return value.toLocaleString();
}

function formatFullKRW(value: number): string {
  return Math.round(value).toLocaleString() + '원';
}

// ─── 연차별 스냅샷 타입 ──────────────────────────────────
interface YearSnapshot {
  year: number;
  principalCumulative: number;
  profitCumulative: number;
  total: number;
  returnRate: number;
}

// ─── 복리 계산 (월 복리) ─────────────────────────────────
function calculateCompound(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number
): { total: number; totalPrincipal: number; totalProfit: number; snapshots: YearSnapshot[] } {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  let current = initialAmount;
  const snapshots: YearSnapshot[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    current = (current + monthlyAmount) * (1 + monthlyRate);

    if (month % 12 === 0) {
      const yr = month / 12;
      const principal = initialAmount + monthlyAmount * month;
      const profit = current - principal;
      const returnRate = principal > 0 ? (profit / principal) * 100 : 0;
      snapshots.push({
        year: yr,
        principalCumulative: Math.round(principal),
        profitCumulative: Math.round(profit),
        total: Math.round(current),
        returnRate,
      });
    }
  }

  const totalPrincipal = initialAmount + monthlyAmount * totalMonths;
  const totalProfit = current - totalPrincipal;

  return {
    total: Math.round(current),
    totalPrincipal: Math.round(totalPrincipal),
    totalProfit: Math.round(totalProfit),
    snapshots,
  };
}

// ─── 단리 계산 (비교용) ──────────────────────────────────
function calculateSimple(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number
): number {
  const totalMonths = years * 12;
  const totalPrincipal = initialAmount + monthlyAmount * totalMonths;
  // 단리: 초기금에 대한 이자 + 매월 적립분에 대한 평균 이자
  const initialInterest = initialAmount * (annualRate / 100) * years;
  const monthlyInterest = monthlyAmount * totalMonths * ((totalMonths + 1) / 2) * (annualRate / 100 / 12);
  return Math.round(totalPrincipal + initialInterest + monthlyInterest);
}

// ─── 빠른 선택 버튼 ──────────────────────────────────────
function QuickSelect<T extends string | number>({
  options,
  value,
  onChange,
  format,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  format: (v: T) => string;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
            value === opt
              ? 'bg-green-900 text-white border-green-900'
              : 'border-green-200 text-green-800 hover:border-green-400'
          }`}
        >
          {format(opt)}
        </button>
      ))}
    </div>
  );
}

// ─── SVG 바 차트 ─────────────────────────────────────────
function GrowthChart({ snapshots }: { snapshots: YearSnapshot[] }) {
  if (snapshots.length === 0) return null;

  const maxTotal = Math.max(...snapshots.map((s) => s.total), 1);
  const chartWidth = 320;
  const chartHeight = 180;
  const barGap = 4;
  const barWidth = Math.max(8, Math.min(32, (chartWidth - barGap * snapshots.length) / snapshots.length));
  const totalBarArea = snapshots.length * (barWidth + barGap) - barGap;
  const offsetX = (chartWidth - totalBarArea) / 2;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="barGradPrincipal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="barGradProfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>

      {/* 기준선 */}
      <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#d8f3dc" strokeWidth="1" />

      {snapshots.map((snap, i) => {
        const x = offsetX + i * (barWidth + barGap);
        const totalH = (snap.total / maxTotal) * (chartHeight - 10);
        const principalH = (snap.principalCumulative / maxTotal) * (chartHeight - 10);
        const profitH = totalH - principalH;

        return (
          <g key={snap.year}>
            {/* 원금 바 */}
            <rect
              x={x}
              y={chartHeight - principalH}
              width={barWidth}
              height={principalH}
              fill="url(#barGradPrincipal)"
              rx={2}
            />
            {/* 수익 바 */}
            <rect
              x={x}
              y={chartHeight - totalH}
              width={barWidth}
              height={profitH}
              fill="url(#barGradProfit)"
              rx={2}
            />
            {/* 연도 라벨 */}
            <text
              x={x + barWidth / 2}
              y={chartHeight + 14}
              textAnchor="middle"
              fill="#74C69D"
              fontSize="9"
            >
              {snap.year}년
            </text>
          </g>
        );
      })}

      {/* 범례 */}
      <rect x={chartWidth - 100} y={2} width={10} height={10} fill="url(#barGradPrincipal)" rx={2} />
      <text x={chartWidth - 86} y={10} fill="#74C69D" fontSize="9">원금</text>
      <rect x={chartWidth - 50} y={2} width={10} height={10} fill="url(#barGradProfit)" rx={2} />
      <text x={chartWidth - 36} y={10} fill="#74C69D" fontSize="9">수익</text>
    </svg>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────
export default function CompoundPage() {
  const [initialAmount, setInitialAmount] = useState(10_000_000);
  const [monthlyAmount, setMonthlyAmount] = useState(300_000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  // 복리 계산 결과
  const result = useMemo(
    () => calculateCompound(initialAmount, monthlyAmount, annualRate, years),
    [initialAmount, monthlyAmount, annualRate, years]
  );

  // 단리 결과 (비교용)
  const simpleTotal = useMemo(
    () => calculateSimple(initialAmount, monthlyAmount, annualRate, years),
    [initialAmount, monthlyAmount, annualRate, years]
  );

  // 복리 효과 (복리 - 단리)
  const compoundEffect = result.total - simpleTotal;

  // 수익 비율 (도넛 시각화용)
  const profitRatio = result.total > 0
    ? (result.totalProfit / result.total) * 100
    : 0;

  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/tools"
              className="text-green-800 hover:text-green-700 transition-colors"
            >
              도구
            </Link>
            <span className="text-green-400">/</span>
            <span className="text-green-700 font-medium">복리 계산기</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-green-900 mb-1">복리 계산기</h1>
        <p className="text-green-800 text-sm mb-6">시간이 만드는 복리의 마법</p>

        {/* ─── 입력 섹션 ─── */}
        <div className="card-v3 p-5 mb-5 space-y-5">
          {/* 초기 투자금 */}
          <div>
            <label className="block text-green-700 text-xs font-medium mb-1.5">초기 투자금</label>
            <div className="relative mb-2">
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-lg font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 text-sm">원</span>
            </div>
            <QuickSelect
              options={[1_000_000, 5_000_000, 10_000_000, 50_000_000]}
              value={initialAmount}
              onChange={setInitialAmount}
              format={(v) => `${(v as number) / 10_000}만`}
            />
          </div>

          {/* 월 추가 투자금 */}
          <div>
            <label className="block text-green-700 text-xs font-medium mb-1.5">월 추가 투자금</label>
            <div className="relative mb-2">
              <input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-lg font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 text-sm">원</span>
            </div>
            <QuickSelect
              options={[0, 100_000, 300_000, 500_000, 1_000_000]}
              value={monthlyAmount}
              onChange={setMonthlyAmount}
              format={(v) => (v as number) === 0 ? '없음' : `${(v as number) / 10_000}만`}
            />
          </div>

          {/* 연 기대 수익률 */}
          <div>
            <label className="block text-green-700 text-xs font-medium mb-1.5">
              연 기대 수익률
              <span className="ml-2 text-green-900 font-bold">{annualRate}%</span>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-900 mb-2"
            />
            <QuickSelect
              options={[5, 8, 12, 15, 20]}
              value={annualRate}
              onChange={setAnnualRate}
              format={(v) => `${v}%`}
            />
          </div>

          {/* 투자 기간 */}
          <div>
            <label className="block text-green-700 text-xs font-medium mb-1.5">투자 기간</label>
            <QuickSelect
              options={[1, 3, 5, 10, 20, 30]}
              value={years}
              onChange={setYears}
              format={(v) => `${v}년`}
            />
          </div>
        </div>

        {/* ─── 결과 섹션 ─── */}
        <div className="space-y-4 animate-slide-up">
          {/* 히어로 카드: 최종 금액 */}
          <div className="bg-green-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="mb-4">
              <p className="text-green-400 text-xs font-medium mb-1">{years}년 후 예상 자산</p>
              <p className="text-3xl font-black tracking-tight">
                <CountUp end={result.total} duration={1000} formatter={formatKRW} />
                <span className="text-lg text-green-400 ml-1">원</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-green-400">
              <span>원금 {formatKRW(result.totalPrincipal)}원</span>
              <span>|</span>
              <span>수익 +{formatKRW(result.totalProfit)}원</span>
            </div>
          </div>

          {/* 원금 vs 수익 비율 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-green-700 text-sm font-medium mb-4">원금 vs 수익 비율</h3>

            {/* 스택 바 */}
            <div className="w-full h-8 bg-green-50 rounded-full overflow-hidden flex mb-3">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 flex items-center justify-center"
                style={{ width: `${100 - profitRatio}%` }}
              >
                {profitRatio < 85 && (
                  <span className="text-white text-xs font-bold">
                    원금 {(100 - profitRatio).toFixed(0)}%
                  </span>
                )}
              </div>
              <div
                className="h-full bg-gradient-to-r from-mint-400 to-mint-500 transition-all duration-700 flex items-center justify-center"
                style={{ width: `${profitRatio}%` }}
              >
                {profitRatio >= 15 && (
                  <span className="text-white text-xs font-bold">
                    수익 {profitRatio.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-green-800 text-xs mb-1">원금 총액</p>
                <p className="text-green-800 text-sm font-black">{formatFullKRW(result.totalPrincipal)}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-emerald-600 text-xs mb-1">총 수익</p>
                <p className="text-emerald-600 text-sm font-black">+{formatFullKRW(result.totalProfit)}</p>
              </div>
            </div>
          </div>

          {/* 복리의 힘 인사이트 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h3 className="text-green-800 text-sm font-bold">복리의 힘</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-green-800 text-xs mb-1">단리로 계산하면</p>
                <p className="text-green-700 text-sm font-bold">{formatFullKRW(simpleTotal)}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-emerald-600 text-xs mb-1">복리 효과</p>
                <p className="text-emerald-600 text-sm font-black">+{formatFullKRW(compoundEffect)}</p>
              </div>
            </div>
            <p className="text-green-800 text-xs leading-relaxed">
              복리로 투자하면 단리보다{' '}
              <strong className="text-emerald-600">
                {simpleTotal > 0
                  ? `${((compoundEffect / simpleTotal) * 100).toFixed(1)}%`
                  : '0%'}
              </strong>{' '}
              더 많은 자산을 모을 수 있어요.
              {years >= 10 && ' 시간이 길수록 복리 효과는 더 커집니다.'}
            </p>
          </div>

          {/* 성장 차트 */}
          {result.snapshots.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-green-700 text-sm font-medium mb-4">연도별 자산 성장</h3>
              <GrowthChart snapshots={result.snapshots} />
            </div>
          )}

          {/* 연차별 상세 테이블 */}
          {result.snapshots.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-green-700 text-sm font-medium mb-4">연차별 상세</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-xs min-w-[340px]">
                  <thead>
                    <tr className="border-b border-green-100">
                      <th className="text-left text-green-800 font-medium py-2 px-2">연차</th>
                      <th className="text-right text-green-800 font-medium py-2 px-2">원금누적</th>
                      <th className="text-right text-green-800 font-medium py-2 px-2">수익누적</th>
                      <th className="text-right text-green-800 font-medium py-2 px-2">총자산</th>
                      <th className="text-right text-green-800 font-medium py-2 px-2">수익률</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-700">
                    {result.snapshots.map((snap) => (
                      <tr key={snap.year} className="border-b border-green-100/50">
                        <td className="py-2 px-2 font-medium">{snap.year}년</td>
                        <td className="py-2 px-2 text-right">{formatKRW(snap.principalCumulative)}</td>
                        <td className="py-2 px-2 text-right text-emerald-600 font-medium">
                          +{formatKRW(snap.profitCumulative)}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-green-900">
                          {formatKRW(snap.total)}
                        </td>
                        <td className="py-2 px-2 text-right text-green-800">
                          {snap.returnRate.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dear,ANT 인사이트 */}
          <div className="bg-green-50 rounded-2xl p-5">
            <p className="text-green-800 text-xs font-bold mb-3">💡 Dear,ANT의 인사이트</p>
            <div className="space-y-2.5 text-green-700 text-xs leading-relaxed">
              <p>
                • 복리의 핵심은 <strong>시간</strong>입니다.
                10년 투자의 복리 효과는 5년의 2배가 아니라 그 이상이에요.
              </p>
              <p>
                • 수익률 1~2%p 차이도 장기적으로 <strong>수천만 원</strong>의 차이를 만듭니다.
                수수료와 세금을 줄이는 것이 중요해요.
              </p>
              <p>
                • 매월 꾸준히 투자하는 <strong>적립식 투자</strong>는
                시장 타이밍 리스크를 줄여줍니다.
              </p>
              {annualRate >= 15 && (
                <p>
                  • 연 {annualRate}% 수익률은 상당히 공격적인 목표예요.
                  장기 평균 주식 수익률은 <strong>8~12%</strong> 수준입니다.
                </p>
              )}
              {years >= 20 && (
                <p>
                  • {years}년은 긴 여정이에요.
                  중간에 포트폴리오를 점검하고 리밸런싱하는 것을 잊지 마세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
