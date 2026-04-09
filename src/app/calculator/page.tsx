'use client';

import { useState, useMemo } from 'react';
import SliderInput from '@/components/SliderInput';
import CompareBar from '@/components/CompareBar';
import CountUp from '@/components/CountUp';

// 적금 이자 계산 (월 적립식)
function calcSavings(monthly: number, months: number, annualRate: number) {
  // 적립식 적금: 매월 납입, 단리 기준
  // 이자 = 월납입금 × (총개월수 × (총개월수+1) / 2) × (연이율/12)
  const totalPrincipal = monthly * months;
  const interest = monthly * (months * (months + 1) / 2) * (annualRate / 100 / 12);
  const tax = interest * 0.154; // 이자소득세 15.4%
  const netInterest = interest - tax;
  const total = totalPrincipal + netInterest;

  return {
    totalPrincipal,
    grossInterest: Math.round(interest),
    tax: Math.round(tax),
    netInterest: Math.round(netInterest),
    total: Math.round(total),
    effectiveRate: totalPrincipal > 0 ? ((netInterest / totalPrincipal) * 100) : 0,
  };
}

// 주식 수익 계산 (시나리오별)
function calcStock(monthly: number, months: number, expectedReturn: number) {
  const totalPrincipal = monthly * months;

  // 월별 적립 + 복리 수익
  function calcWithRate(annualReturn: number) {
    const monthlyRate = annualReturn / 100 / 12;
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + monthlyRate);
    }
    const profit = total - totalPrincipal;
    const tax = profit > 2500000 ? (profit - 2500000) * 0.22 : 0; // 금투세 (250만 공제, 22%)
    return {
      total: Math.round(total - tax),
      grossProfit: Math.round(profit),
      tax: Math.round(tax),
      netProfit: Math.round(profit - tax),
    };
  }

  // 시나리오: 낙관 / 기대 / 보수 / 최악
  const optimistic = calcWithRate(expectedReturn * 1.5);
  const expected = calcWithRate(expectedReturn);
  const conservative = calcWithRate(expectedReturn * 0.3);
  const worst = calcWithRate(-expectedReturn * 0.8);

  return {
    totalPrincipal,
    optimistic,
    expected,
    conservative,
    worst,
  };
}

const PERIOD_OPTIONS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
  { value: 24, label: '2년' },
  { value: 60, label: '5년' },
] as const;

const SCENARIO_OPTIONS = [
  { value: 8, label: '안정 8%' },
  { value: 15, label: '보통 15%' },
  { value: 25, label: '공격 25%' },
  { value: 50, label: '대박 50%' },
] as const;

export default function CalculatorPage() {
  const [monthlyMan, setMonthlyMan] = useState(50); // 만원 단위
  const [period, setPeriod] = useState<number>(12);
  const [savingsRate, setSavingsRate] = useState(3.5);
  const [stockReturn, setStockReturn] = useState(15);

  const monthly = monthlyMan * 10000; // 원 단위로 변환

  const savings = useMemo(
    () => calcSavings(monthly, period, savingsRate),
    [monthly, period, savingsRate]
  );

  const stock = useMemo(
    () => calcStock(monthly, period, stockReturn),
    [monthly, period, stockReturn]
  );

  // 비교 결과
  const comparison = useMemo(() => {
    const savingsProfit = savings.netInterest;
    const stockExpectedProfit = stock.expected.netProfit;
    const stockWorstProfit = stock.worst.netProfit;

    // 리스크 대비 수익 판정
    let verdict: 'savings' | 'stock' | 'neutral';

    if (stockWorstProfit >= savingsProfit) {
      verdict = 'stock';
    } else if (stockExpectedProfit > savingsProfit * 3) {
      verdict = 'stock';
    } else if (stockExpectedProfit > savingsProfit) {
      verdict = 'neutral';
    } else {
      verdict = 'savings';
    }

    return { savingsProfit, stockExpectedProfit, stockWorstProfit, verdict };
  }, [savings, stock]);

  const diff = stock.expected.netProfit - savings.netInterest;
  const diffLabel = diff >= 0 ? '주식이 유리' : '적금이 유리';

  const periodLabel = PERIOD_OPTIONS.find(p => p.value === period)?.label ?? `${period}개월`;
  const scenarioLabel = SCENARIO_OPTIONS.find(s => s.value === stockReturn)?.label ?? `${stockReturn}%`;

  const fmtWon = (v: number) => v.toLocaleString();

  return (
    <main className="min-h-screen py-8 px-6 pb-32">
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Header */}
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">적금 vs 투자 비교</h1>
        <p className="text-sm text-on-surface-tertiary mb-8">
          같은 돈을 적금에 넣을 때와 주식에 투자할 때, 어디가 더 유리할까?
        </p>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== Input Panel ===== */}
          <div className="card card-raised p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-primary text-lg">&#9881;</span>
              <span className="text-[17px] font-bold text-on-surface">조건 설정</span>
            </div>

            {/* 월 투자금 슬라이더 */}
            <div className="mb-6">
              <SliderInput
                label="월 투자금"
                value={monthlyMan}
                onChange={setMonthlyMan}
                min={10}
                max={500}
                step={10}
                unit="만원"
                marks={[
                  { value: 10, label: '10만' },
                  { value: 100, label: '100만' },
                  { value: 300, label: '300만' },
                  { value: 500, label: '500만' },
                ]}
              />
            </div>

            {/* 투자 기간 칩 */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-on-surface-secondary mb-2.5">투자 기간</label>
              <div className="flex gap-2 flex-wrap">
                {PERIOD_OPTIONS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`chip ${period === p.value ? 'chip-selected' : 'chip-default'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 적금 이자율 슬라이더 */}
            <div className="mb-6">
              <SliderInput
                label="적금 이자율 (연)"
                value={savingsRate}
                onChange={setSavingsRate}
                min={1}
                max={10}
                step={0.5}
                unit="%"
              />
            </div>

            {/* 시나리오 칩 */}
            <div>
              <label className="block text-[13px] font-semibold text-on-surface-secondary mb-2.5">주식 수익률 시나리오</label>
              <div className="flex gap-2 flex-wrap">
                {SCENARIO_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStockReturn(s.value)}
                    className={`chip ${stockReturn === s.value ? 'chip-selected' : 'chip-default'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Result Panel ===== */}
          <div className="space-y-4">
            {/* Hero result card */}
            <div className="card card-accent p-6 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                주식 투자 시 ({scenarioLabel} 시나리오)
              </p>
              <div className="text-3xl font-extrabold tracking-tight mb-1">
                <CountUp end={stock.expected.total} suffix="원" />
              </div>
              <p className="text-sm opacity-70">
                원금 {savings.totalPrincipal.toLocaleString()}원 + 수익 {stock.expected.netProfit.toLocaleString()}원
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs opacity-50">
                <span>월 {monthlyMan}만원</span>
                <span>{periodLabel}</span>
              </div>
            </div>

            {/* 3-col comparison */}
            <div className="grid grid-cols-3 gap-3">
              {/* 적금 */}
              <div className="card card-raised p-4 text-center">
                <p className="text-xl font-extrabold tracking-tight text-on-surface-tertiary">
                  <CountUp end={savings.total} formatter={fmtWon} />
                </p>
                <p className="text-xs text-on-surface-quaternary mt-1">적금</p>
                <p className="text-[13px] font-semibold text-on-surface-tertiary mt-1">
                  +{savings.netInterest.toLocaleString()} (세후)
                </p>
              </div>

              {/* 주식 */}
              <div className="card p-4 text-center border-2 border-primary">
                <p className="text-xl font-extrabold tracking-tight text-primary">
                  <CountUp end={stock.expected.total} formatter={fmtWon} />
                </p>
                <p className="text-xs text-on-surface-quaternary mt-1">주식 ({scenarioLabel.split(' ')[0]})</p>
                <p className="text-[13px] font-semibold text-primary mt-1">
                  +{stock.expected.netProfit.toLocaleString()}
                </p>
              </div>

              {/* 차이 */}
              <div className="card card-raised p-4 text-center">
                <p className={`text-xl font-extrabold tracking-tight ${diff >= 0 ? 'text-primary' : 'text-error'}`}>
                  <CountUp
                    end={Math.abs(diff)}
                    prefix={diff >= 0 ? '+' : '-'}
                    formatter={fmtWon}
                  />
                </p>
                <p className="text-xs text-on-surface-quaternary mt-1">차이</p>
                <p className={`text-[13px] font-semibold mt-1 ${diff >= 0 ? 'text-primary' : 'text-error'}`}>
                  {diffLabel}
                </p>
              </div>
            </div>

            {/* CompareBar */}
            <div className="card card-raised p-5">
              <CompareBar
                leftLabel="적금"
                leftValue={savings.total}
                rightLabel="주식"
                rightValue={stock.expected.total}
                formatter={(v) => v.toLocaleString()}
              />
              <p className="text-[13px] text-on-surface-quaternary text-center mt-4">
                {scenarioLabel.split(' ')[0]} 시나리오 기준 &middot; 적금 이자소득세 15.4% 반영
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
