'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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

// 비교 바 차트
function CompareBar({ label, value, maxValue, color, suffix = '원' }: {
  label: string; value: number; maxValue: number; color: string; suffix?: string;
}) {
  const width = maxValue > 0 ? Math.max(5, Math.min(100, (Math.abs(value) / maxValue) * 100)) : 5;
  const isNegative = value < 0;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-green-700">{label}</span>
        <span className={`text-xs font-bold ${isNegative ? 'text-rose-500' : 'text-green-800'}`}>
          {isNegative ? '-' : '+'}{Math.abs(value).toLocaleString()}{suffix}
        </span>
      </div>
      <div className="w-full h-3 bg-green-50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isNegative ? 'bg-rose-400' : color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [monthly, setMonthly] = useState('500000'); // 월 투자금
  const [period, setPeriod] = useState<6 | 12 | 24>(12); // 기간 (개월)
  const [savingsRate, setSavingsRate] = useState('3.5'); // 적금 이자율
  const [stockReturn, setStockReturn] = useState('15'); // 주식 기대 수익률
  const [showResult, setShowResult] = useState(false);

  const monthlyNum = Number(monthly) || 0;
  const savingsRateNum = Number(savingsRate) || 0;
  const stockReturnNum = Number(stockReturn) || 0;

  const savings = useMemo(
    () => calcSavings(monthlyNum, period, savingsRateNum),
    [monthlyNum, period, savingsRateNum]
  );

  const stock = useMemo(
    () => calcStock(monthlyNum, period, stockReturnNum),
    [monthlyNum, period, stockReturnNum]
  );

  // 비교 결과
  const comparison = useMemo(() => {
    const savingsProfit = savings.netInterest;
    const stockExpectedProfit = stock.expected.netProfit;
    const stockWorstProfit = stock.worst.netProfit;

    // 주식이 적금보다 나으려면 필요한 최소 수익률
    const breakEvenReturn = savingsRateNum * 0.6; // 대략적 근사

    // 리스크 대비 수익 판정
    let verdict: 'savings' | 'stock' | 'neutral';
    let reason: string;

    if (stockWorstProfit >= savingsProfit) {
      verdict = 'stock';
      reason = '최악의 시나리오에서도 주식이 적금보다 유리합니다';
    } else if (stockExpectedProfit > savingsProfit * 3) {
      verdict = 'stock';
      reason = '기대 수익이 적금 대비 3배 이상입니다. 다만 손실 가능성도 있습니다';
    } else if (stockExpectedProfit > savingsProfit) {
      verdict = 'neutral';
      reason = '기대 수익은 주식이 높지만, 원금 손실 리스크를 감안하세요';
    } else {
      verdict = 'savings';
      reason = '안정적인 적금이 더 유리한 구간입니다';
    }

    return { savingsProfit, stockExpectedProfit, stockWorstProfit, breakEvenReturn, verdict, reason };
  }, [savings, stock, savingsRateNum]);

  const maxProfit = Math.max(
    savings.netInterest,
    Math.abs(stock.optimistic.netProfit),
    Math.abs(stock.expected.netProfit),
    Math.abs(stock.conservative.netProfit),
    Math.abs(stock.worst.netProfit),
    1
  );

  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-green-900">적금 vs 투자</h1>
          <Link href="/tools" className="text-green-800 hover:text-green-700 text-sm font-medium transition-colors">
            도구
          </Link>
        </div>
        <p className="text-green-800 text-sm mb-6">리스크 포함 수익 비교 계산기</p>

        {/* 입력 폼 */}
        <div className="card-v3 p-5 mb-5">
          {/* 월 투자금 */}
          <div className="mb-4">
            <label className="block text-green-700 text-xs font-medium mb-1.5">월 투자금</label>
            <div className="relative">
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-lg font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 text-sm">원</span>
            </div>
            {/* 빠른 선택 */}
            <div className="flex gap-2 mt-2">
              {[100000, 300000, 500000, 1000000].map(v => (
                <button
                  key={v}
                  onClick={() => setMonthly(String(v))}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    Number(monthly) === v
                      ? 'bg-green-900 text-white border-green-900'
                      : 'border-green-200 text-green-800 hover:border-green-400'
                  }`}
                >
                  {v >= 1000000 ? `${v / 10000}만` : `${v / 10000}만`}
                </button>
              ))}
            </div>
          </div>

          {/* 기간 */}
          <div className="mb-4">
            <label className="block text-green-700 text-xs font-medium mb-1.5">투자 기간</label>
            <div className="grid grid-cols-3 gap-2">
              {([6, 12, 24] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPeriod(m)}
                  className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                    period === m
                      ? 'border-green-900 bg-green-50 text-green-900'
                      : 'border-green-200 text-green-800'
                  }`}
                >
                  {m === 6 ? '6개월' : m === 12 ? '1년' : '2년'}
                </button>
              ))}
            </div>
          </div>

          {/* 이자율 & 기대수익률 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-green-700 text-xs font-medium mb-1.5">적금 이자율 (연)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(e.target.value)}
                  className="w-full px-4 py-2.5 pr-8 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-800 text-xs">%</span>
              </div>
            </div>
            <div>
              <label className="block text-green-700 text-xs font-medium mb-1.5">주식 기대수익률 (연)</label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={stockReturn}
                  onChange={(e) => setStockReturn(e.target.value)}
                  className="w-full px-4 py-2.5 pr-8 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-800 text-xs">%</span>
              </div>
            </div>
          </div>

          {/* 빠른 수익률 프리셋 */}
          <div className="mb-4">
            <label className="block text-green-800 text-xs mb-1.5">주식 수익률 참고</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: '안정 (8%)', value: '8' },
                { label: '보통 (15%)', value: '15' },
                { label: '공격 (25%)', value: '25' },
                { label: '대박 (50%)', value: '50' },
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setStockReturn(p.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    stockReturn === p.value
                      ? 'bg-green-900 text-white border-green-900'
                      : 'border-green-200 text-green-800 hover:border-green-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowResult(true)}
            disabled={monthlyNum <= 0}
            className="w-full bg-green-900 hover:bg-green-800 disabled:bg-green-200 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
          >
            비교 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && monthlyNum > 0 && (
          <div className="space-y-4 animate-slide-up">
            {/* 판정 카드 */}
            <div className="rounded-2xl p-5 text-white shadow-lg bg-green-900">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {comparison.verdict === 'stock' ? '📈' : comparison.verdict === 'savings' ? '🏦' : '⚖️'}
                </span>
                <h3 className="text-lg font-black">
                  {comparison.verdict === 'stock' ? '주식 투자가 유리' :
                   comparison.verdict === 'savings' ? '적금이 유리' : '신중한 판단 필요'}
                </h3>
              </div>
              <p className="text-white/80 text-sm">{comparison.reason}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                <span>월 {monthlyNum.toLocaleString()}원</span>
                <span>{period === 6 ? '6개월' : period === 12 ? '1년' : '2년'}</span>
                <span>총 원금 {savings.totalPrincipal.toLocaleString()}원</span>
              </div>
            </div>

            {/* 적금 결과 */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏦</span>
                  <h3 className="font-bold text-green-900">적금</h3>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
                  연 {savingsRateNum}%
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-800">원금</span>
                  <span className="text-green-800 font-medium">{savings.totalPrincipal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-800">이자 (세전)</span>
                  <span className="text-green-800 font-medium">+{savings.grossInterest.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-800">이자소득세 (15.4%)</span>
                  <span className="text-rose-400 font-medium">-{savings.tax.toLocaleString()}원</span>
                </div>
                <div className="border-t border-blue-50 pt-2 flex justify-between">
                  <span className="text-green-700 font-bold text-sm">세후 수령액</span>
                  <span className="text-blue-600 font-black text-lg">{savings.total.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-blue-600 text-xs">
                  💰 세후 실질 수익: <strong>+{savings.netInterest.toLocaleString()}원</strong>
                  <span className="text-blue-400 ml-1">(실수익률 {savings.effectiveRate.toFixed(2)}%)</span>
                </p>
              </div>
            </div>

            {/* 주식 결과 */}
            <div className="card-v3 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📈</span>
                  <h3 className="font-bold text-green-900">주식 투자</h3>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                  기대 연 {stockReturnNum}%
                </span>
              </div>

              {/* 시나리오별 비교 */}
              <CompareBar label="🚀 낙관 (×1.5)" value={stock.optimistic.netProfit} maxValue={maxProfit} color="bg-green-700" />
              <CompareBar label="📊 기대 수익" value={stock.expected.netProfit} maxValue={maxProfit} color="bg-green-500" />
              <CompareBar label="😐 보수적 (×0.3)" value={stock.conservative.netProfit} maxValue={maxProfit} color="bg-amber-400" />
              <CompareBar label="📉 최악 (−0.8×)" value={stock.worst.netProfit} maxValue={maxProfit} color="bg-rose-400" />

              {/* 적금 수익 비교선 */}
              <div className="mt-2 mb-4">
                <CompareBar label="🏦 적금 세후 이자 (비교)" value={savings.netInterest} maxValue={maxProfit} color="bg-blue-400" />
              </div>

              {/* 세부 수치 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-800">기대 수익 (세후)</span>
                  <span className="text-green-800 font-bold">+{stock.expected.netProfit.toLocaleString()}원</span>
                </div>
                {stock.expected.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-800">금투세 (250만 초과분 22%)</span>
                    <span className="text-rose-400">-{stock.expected.tax.toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-green-800">최악 시 손실</span>
                  <span className="text-rose-500 font-bold">{stock.worst.netProfit.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 한눈에 비교 */}
            <div className="card-v3 p-5">
              <h3 className="text-green-700 text-sm font-medium mb-4">한눈에 비교</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-100">
                      <th className="text-left text-green-800 font-medium py-2 text-xs"></th>
                      <th className="text-right text-blue-500 font-bold py-2 text-xs">🏦 적금</th>
                      <th className="text-right text-green-700 font-bold py-2 text-xs">📈 주식</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-700">
                    <tr className="border-b border-green-100/50">
                      <td className="py-2.5 text-green-800 text-xs">원금</td>
                      <td className="py-2.5 text-right font-medium">{savings.totalPrincipal.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-medium">{stock.totalPrincipal.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-green-100/50">
                      <td className="py-2.5 text-green-800 text-xs">기대 수익</td>
                      <td className="py-2.5 text-right text-blue-600 font-bold">+{savings.netInterest.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-green-800 font-bold">+{stock.expected.netProfit.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-green-100/50">
                      <td className="py-2.5 text-green-800 text-xs">최악 시</td>
                      <td className="py-2.5 text-right text-blue-600 font-bold">+{savings.netInterest.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-rose-500 font-bold">{stock.worst.netProfit.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-green-100/50">
                      <td className="py-2.5 text-green-800 text-xs">원금 보장</td>
                      <td className="py-2.5 text-right"><span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">보장</span></td>
                      <td className="py-2.5 text-right"><span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-bold">미보장</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-green-800 text-xs">수익 확정성</td>
                      <td className="py-2.5 text-right"><span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">확정</span></td>
                      <td className="py-2.5 text-right"><span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">변동</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dear,ANT 팁 */}
            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-green-800 text-xs font-bold mb-2">💡 Dear,ANT의 판단</p>
              <div className="space-y-2 text-green-700 text-xs leading-relaxed">
                {comparison.verdict === 'stock' ? (
                  <>
                    <p>• 기대 수익이 적금 대비 <strong>{Math.round(stock.expected.netProfit / Math.max(savings.netInterest, 1))}배</strong> 높습니다</p>
                    <p>• 단, 최악의 경우 <strong>{Math.abs(stock.worst.netProfit).toLocaleString()}원</strong>의 손실이 발생할 수 있어요</p>
                    <p>• 여유 자금으로만 투자하고, 분할 매수를 추천합니다</p>
                  </>
                ) : comparison.verdict === 'savings' ? (
                  <>
                    <p>• 현재 이자율에서 적금이 리스크 대비 효율적입니다</p>
                    <p>• 주식 기대수익률이 <strong>{savingsRateNum * 2}%</strong> 이상이면 재검토해보세요</p>
                    <p>• 적금으로 종잣돈을 모은 후 투자를 시작하는 것도 방법입니다</p>
                  </>
                ) : (
                  <>
                    <p>• 기대 수익은 주식이 <strong>+{(stock.expected.netProfit - savings.netInterest).toLocaleString()}원</strong> 높지만</p>
                    <p>• 최악의 경우 <strong>{Math.abs(stock.worst.netProfit).toLocaleString()}원</strong> 손실 가능</p>
                    <p>• 절반은 적금, 절반은 투자하는 분산 전략을 추천합니다</p>
                  </>
                )}
              </div>
            </div>

            {/* 다시 계산 */}
            <button
              onClick={() => { setShowResult(false); window.scrollTo(0, 0); }}
              className="w-full text-center border-2 border-green-200 text-green-700 hover:bg-green-50 font-medium py-3 rounded-2xl transition-all"
            >
              다시 계산하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
