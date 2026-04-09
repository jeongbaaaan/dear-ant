'use client';

import { useState, useMemo } from 'react';
import SliderInput from '@/components/SliderInput';
import StackBarChart from '@/components/StackBarChart';
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
  const initialInterest = initialAmount * (annualRate / 100) * years;
  const monthlyInterest = monthlyAmount * totalMonths * ((totalMonths + 1) / 2) * (annualRate / 100 / 12);
  return Math.round(totalPrincipal + initialInterest + monthlyInterest);
}

// ─── 메인 컴포넌트 ───────────────────────────────────────
export default function CompoundPage() {
  const [initialAmount, setInitialAmount] = useState(10_000_000);
  const [monthlyAmount, setMonthlyAmount] = useState(300_000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [tableOpen, setTableOpen] = useState(false);

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

  // 총 수익률
  const totalReturnRate = result.totalPrincipal > 0
    ? (result.totalProfit / result.totalPrincipal) * 100
    : 0;

  // 차트 데이터
  const chartData = useMemo(() =>
    result.snapshots.map((s) => ({
      label: `${s.year}`,
      principal: s.principalCumulative,
      profit: s.profitCumulative,
    })),
    [result.snapshots]
  );

  // 복리 수익이 원금을 추월하는 연차
  const overtakeYear = useMemo(() => {
    for (const snap of result.snapshots) {
      if (snap.profitCumulative >= snap.principalCumulative) {
        return snap.year;
      }
    }
    return null;
  }, [result.snapshots]);

  // 슬라이더 포맷터
  const formatManWon = (v: number) => {
    if (v >= 100_000_000) {
      const eok = Math.floor(v / 100_000_000);
      const man = Math.floor((v % 100_000_000) / 10_000);
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
    }
    return `${(v / 10_000).toLocaleString()}만원`;
  };

  return (
    <div className="animate-fade-in">
      {/* 헤더 */}
      <h1 className="text-[28px] font-extrabold text-on-surface tracking-tight mb-1">복리 계산기</h1>
      <p className="text-sm text-on-surface-secondary mb-8">초기 투자금과 월 적립금의 복리 성장을 시뮬레이션</p>

      {/* 2-col 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── Input Panel ─── */}
        <div className="card card-raised p-8 space-y-6">
          <div className="flex items-center gap-2 text-[17px] font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>tune</span>
            조건 설정
          </div>

          <SliderInput
            label="초기 투자금"
            value={initialAmount}
            onChange={setInitialAmount}
            min={0}
            max={100_000_000}
            step={1_000_000}
            formatter={formatManWon}
            marks={[
              { value: 0, label: '0' },
              { value: 50_000_000, label: '5,000만' },
              { value: 100_000_000, label: '1억' },
            ]}
          />

          <SliderInput
            label="월 적립금"
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            min={0}
            max={5_000_000}
            step={100_000}
            formatter={formatManWon}
            marks={[
              { value: 0, label: '0' },
              { value: 2_500_000, label: '250만' },
              { value: 5_000_000, label: '500만' },
            ]}
          />

          <SliderInput
            label="연 수익률"
            value={annualRate}
            onChange={setAnnualRate}
            min={1}
            max={50}
            step={1}
            unit="%"
            marks={[
              { value: 1, label: '1%' },
              { value: 10, label: '10%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
            ]}
          />

          <SliderInput
            label="투자 기간"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            unit="년"
            marks={[
              { value: 1, label: '1년' },
              { value: 10, label: '10년' },
              { value: 20, label: '20년' },
              { value: 30, label: '30년' },
            ]}
          />
        </div>

        {/* ─── Result Panel ─── */}
        <div className="space-y-4">

          {/* Hero 결과 카드 */}
          <div className="card card-accent rounded-2xl p-8">
            <p className="text-sm font-semibold text-on-primary/60 uppercase tracking-wider mb-2">
              {years}년 후 예상 자산
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-on-primary">
              <CountUp end={result.total} duration={800} formatter={formatKRW} />
              <span className="text-lg text-on-primary/60 ml-1">원</span>
            </p>
            <p className="text-sm text-on-primary/70 mt-2">
              원금 {formatKRW(result.totalPrincipal)}원 + 복리 수익 {formatKRW(result.totalProfit)}원
            </p>
          </div>

          {/* 3-col 지표 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card card-raised text-center p-5">
              <p className="text-2xl font-extrabold text-on-surface tracking-tight">
                <CountUp end={result.totalPrincipal} duration={600} formatter={(v) => formatKRW(v)} />
              </p>
              <p className="text-xs text-on-surface-tertiary mt-1">총 원금</p>
            </div>
            <div className="card card-raised text-center p-5">
              <p className="text-2xl font-extrabold text-primary tracking-tight">
                <CountUp end={result.totalProfit} duration={600} formatter={(v) => formatKRW(v)} />
              </p>
              <p className="text-xs text-on-surface-tertiary mt-1">복리 수익</p>
            </div>
            <div className="card card-raised text-center p-5">
              <p className="text-2xl font-extrabold text-primary tracking-tight">
                +<CountUp end={Math.round(totalReturnRate)} duration={600} />%
              </p>
              <p className="text-xs text-on-surface-tertiary mt-1">총 수익률</p>
            </div>
          </div>

          {/* StackBarChart */}
          {chartData.length > 0 && (
            <div className="card card-raised p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[15px] font-bold text-on-surface">연도별 자산 성장</span>
                <div className="flex gap-3 text-xs text-on-surface-tertiary">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#e0e0e0' }} />
                    원금
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#006b1b' }} />
                    수익
                  </span>
                </div>
              </div>
              <StackBarChart data={chartData} height={160} />
              {overtakeYear !== null && (
                <p className="text-center text-sm text-on-surface-tertiary mt-3">
                  복리 수익이 <strong className="text-primary">{overtakeYear}년차</strong>부터 원금을 추월
                </p>
              )}
            </div>
          )}

          {/* 복리의 힘 인사이트 */}
          <div className="card card-raised p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>auto_awesome</span>
              <span className="text-[15px] font-bold text-on-surface">복리의 힘</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-surface-container rounded-xl p-4 text-center">
                <p className="text-xs text-on-surface-tertiary mb-1">단리로 계산하면</p>
                <p className="text-sm font-bold text-on-surface">{formatFullKRW(simpleTotal)}</p>
              </div>
              <div className="bg-primary-container rounded-xl p-4 text-center">
                <p className="text-xs text-on-surface-tertiary mb-1">복리 효과</p>
                <p className="text-sm font-extrabold text-primary">+{formatFullKRW(compoundEffect)}</p>
              </div>
            </div>
            <p className="text-on-surface-secondary text-xs leading-relaxed">
              복리로 투자하면 단리보다{' '}
              <strong className="text-primary">
                {simpleTotal > 0 ? `${((compoundEffect / simpleTotal) * 100).toFixed(1)}%` : '0%'}
              </strong>{' '}
              더 많은 자산을 모을 수 있어요.
              {years >= 10 && ' 시간이 길수록 복리 효과는 더 커집니다.'}
            </p>
          </div>

          {/* 연차별 상세 테이블 (expandable) */}
          {result.snapshots.length > 0 && (
            <div className="card card-raised overflow-hidden">
              <button
                onClick={() => setTableOpen(!tableOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-surface-dim transition-colors"
              >
                <span className="text-[15px] font-bold text-on-surface">연차별 상세</span>
                <span
                  className="material-symbols-outlined text-on-surface-tertiary transition-transform duration-200"
                  style={{ transform: tableOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
              {tableOpen && (
                <div className="px-6 pb-6 animate-slide-up">
                  <div className="overflow-x-auto -mx-2">
                    <table className="data-table w-full">
                      <thead>
                        <tr>
                          <th className="text-left">연차</th>
                          <th className="text-right">원금누적</th>
                          <th className="text-right">수익누적</th>
                          <th className="text-right">총자산</th>
                          <th className="text-right">수익률</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.snapshots.map((snap) => (
                          <tr key={snap.year}>
                            <td className="font-medium">{snap.year}년</td>
                            <td className="text-right">{formatKRW(snap.principalCumulative)}</td>
                            <td className="text-right text-primary font-medium">
                              +{formatKRW(snap.profitCumulative)}
                            </td>
                            <td className="text-right font-bold text-on-surface">
                              {formatKRW(snap.total)}
                            </td>
                            <td className="text-right">
                              {snap.returnRate.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 인사이트 */}
          <div className="bg-surface-container rounded-2xl p-6">
            <p className="text-on-surface text-xs font-bold mb-3">Dear,ANT의 인사이트</p>
            <div className="space-y-2.5 text-on-surface-secondary text-xs leading-relaxed">
              <p>
                복리의 핵심은 <strong className="text-on-surface">시간</strong>입니다.
                10년 투자의 복리 효과는 5년의 2배가 아니라 그 이상이에요.
              </p>
              <p>
                수익률 1~2%p 차이도 장기적으로 <strong className="text-on-surface">수천만 원</strong>의 차이를 만듭니다.
                수수료와 세금을 줄이는 것이 중요해요.
              </p>
              <p>
                매월 꾸준히 투자하는 <strong className="text-on-surface">적립식 투자</strong>는
                시장 타이밍 리스크를 줄여줍니다.
              </p>
              {annualRate >= 15 && (
                <p>
                  연 {annualRate}% 수익률은 상당히 공격적인 목표예요.
                  장기 평균 주식 수익률은 <strong className="text-on-surface">8~12%</strong> 수준입니다.
                </p>
              )}
              {years >= 20 && (
                <p>
                  {years}년은 긴 여정이에요.
                  중간에 포트폴리오를 점검하고 리밸런싱하는 것을 잊지 마세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
