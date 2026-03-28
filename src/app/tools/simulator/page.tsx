'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import NumberInput from '@/components/NumberInput';

// 세금/수수료 상수
const TAX_RATE = 0.0018; // 거래세 0.18% (코스피 기준)
const CAPITAL_GAINS_TAX = 0.22; // 양도소득세 22% (대주주/해외)
const CAPITAL_GAINS_DEDUCTION = 2500000; // 기본공제 250만원

const brokerFees: Record<string, { label: string; rate: number }> = {
  free: { label: '무료 (토스/미니스탁)', rate: 0 },
  low: { label: '0.015% (카카오페이)', rate: 0.00015 },
  mid: { label: '0.05% (일반 MTS)', rate: 0.0005 },
  high: { label: '0.1% (HTS/전화)', rate: 0.001 },
};

function formatKRW(value: number): string {
  if (Math.abs(value) >= 100_000_000) {
    const eok = Math.floor(Math.abs(value) / 100_000_000);
    const man = Math.floor((Math.abs(value) % 100_000_000) / 10_000);
    const prefix = value < 0 ? '-' : '';
    return man > 0 ? `${prefix}${eok}억 ${man.toLocaleString()}만원` : `${prefix}${eok}억원`;
  }
  if (Math.abs(value) >= 10_000) {
    return `${value < 0 ? '-' : ''}${Math.floor(Math.abs(value) / 10_000).toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}원`;
}

interface SimResult {
  grossProfit: number;
  grossProfitRate: number;
  buyFee: number;
  sellFee: number;
  tradeTax: number;
  capitalGainsTax: number;
  totalCost: number;
  netProfit: number;
  netProfitRate: number;
  breakEvenPrice: number;
}

function simulate(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  brokerRate: number,
  applyCapitalGains: boolean,
): SimResult {
  const buyTotal = buyPrice * quantity;
  const sellTotal = sellPrice * quantity;
  const grossProfit = sellTotal - buyTotal;
  const grossProfitRate = buyTotal > 0 ? (grossProfit / buyTotal) * 100 : 0;

  const buyFee = Math.round(buyTotal * brokerRate);
  const sellFee = Math.round(sellTotal * brokerRate);
  const tradeTax = Math.round(sellTotal * TAX_RATE);

  let capitalGainsTax = 0;
  if (applyCapitalGains && grossProfit > CAPITAL_GAINS_DEDUCTION) {
    capitalGainsTax = Math.round((grossProfit - CAPITAL_GAINS_DEDUCTION) * CAPITAL_GAINS_TAX);
  }

  const totalCost = buyFee + sellFee + tradeTax + capitalGainsTax;
  const netProfit = grossProfit - totalCost;
  const netProfitRate = buyTotal > 0 ? (netProfit / buyTotal) * 100 : 0;

  // 손익분기 매도가 = (매수총액 + 매수수수료) / (수량 × (1 - 거래세 - 매도수수료율))
  const breakEvenPrice = quantity > 0
    ? Math.ceil((buyTotal + buyFee) / (quantity * (1 - TAX_RATE - brokerRate)))
    : 0;

  return {
    grossProfit, grossProfitRate,
    buyFee, sellFee, tradeTax, capitalGainsTax,
    totalCost, netProfit, netProfitRate, breakEvenPrice,
  };
}

// 물타기 계산
interface DcaResult {
  totalShares: number;
  totalCost: number;
  avgPrice: number;
  breakEvenFromCurrent: number;
}

function calculateDca(
  currentAvgPrice: number,
  currentShares: number,
  addPrice: number,
  addShares: number,
): DcaResult {
  const totalShares = currentShares + addShares;
  const totalCost = (currentAvgPrice * currentShares) + (addPrice * addShares);
  const avgPrice = totalShares > 0 ? Math.round(totalCost / totalShares) : 0;
  const breakEvenFromCurrent = currentAvgPrice > 0
    ? Math.round(((avgPrice - addPrice) / addPrice) * 100 * 10) / 10
    : 0;

  return { totalShares, totalCost: Math.round(totalCost), avgPrice, breakEvenFromCurrent };
}

export default function SimulatorPage() {
  const [tab, setTab] = useState<'profit' | 'dca'>('profit');

  // 수익률 계산기 state
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [broker, setBroker] = useState('free');
  const [applyCapitalGains, setApplyCapitalGains] = useState(false);

  // 물타기 계산기 state
  const [currentAvg, setCurrentAvg] = useState('');
  const [currentShares, setCurrentShares] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addShares, setAddShares] = useState('');

  const simResult = useMemo(() => {
    const bp = Number(buyPrice) || 0;
    const sp = Number(sellPrice) || 0;
    const q = Number(quantity) || 0;
    if (bp <= 0 || q <= 0) return null;
    return simulate(bp, sp > 0 ? sp : bp, q, brokerFees[broker].rate, applyCapitalGains);
  }, [buyPrice, sellPrice, quantity, broker, applyCapitalGains]);

  const dcaResult = useMemo(() => {
    const ca = Number(currentAvg) || 0;
    const cs = Number(currentShares) || 0;
    const ap = Number(addPrice) || 0;
    const as_ = Number(addShares) || 0;
    if (ca <= 0 || cs <= 0 || ap <= 0 || as_ <= 0) return null;
    return calculateDca(ca, cs, ap, as_);
  }, [currentAvg, currentShares, addPrice, addShares]);

  return (
    <main className="min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/tools" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
          <h1 className="font-headline font-extrabold text-primary text-xl tracking-tight">매매 시뮬레이터</h1>
        </div>
      </header>

      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-6">
        {/* Tab */}
        <div className="flex bg-surface-container rounded-xl p-1">
          <button
            onClick={() => setTab('profit')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
              tab === 'profit' ? 'bg-primary text-on-primary' : 'text-on-surface'
            }`}
          >
            수익률 계산
          </button>
          <button
            onClick={() => setTab('dca')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
              tab === 'dca' ? 'bg-primary text-on-primary' : 'text-on-surface'
            }`}
          >
            물타기 계산
          </button>
        </div>

        {tab === 'profit' ? (
          <>
            {/* Input */}
            <section className="bg-surface-container-lowest rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">매수가</label>
                <NumberInput value={buyPrice} onChange={setBuyPrice} suffix="원" ariaLabel="매수가" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">매도가 (목표)</label>
                <NumberInput value={sellPrice} onChange={setSellPrice} suffix="원" ariaLabel="매도가" placeholder="비워두면 매수가와 동일" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">수량</label>
                <NumberInput value={quantity} onChange={setQuantity} suffix="주" ariaLabel="수량" />
              </div>

              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">증권사 수수료</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(brokerFees).map(([key, b]) => (
                    <button
                      key={key}
                      onClick={() => setBroker(key)}
                      aria-pressed={broker === key}
                      className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-left ${
                        broker === key ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyCapitalGains}
                  onChange={(e) => setApplyCapitalGains(e.target.checked)}
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-sm font-bold text-on-surface">양도소득세 적용</p>
                  <p className="text-[11px] text-on-surface-variant">해외주식 또는 대주주 (22%, 250만원 공제)</p>
                </div>
              </label>
            </section>

            {/* Result */}
            {simResult && (
              <section className="space-y-4">
                {/* Hero */}
                <div className={`rounded-2xl p-6 ${simResult.netProfit >= 0 ? 'bg-gradient-to-br from-primary to-primary-dim' : 'bg-gradient-to-br from-error to-error-dim'} text-on-primary`}>
                  <p className="text-on-primary/70 text-xs font-bold mb-1">세후 실수령 수익</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-headline font-extrabold">
                      {simResult.netProfit >= 0 ? '+' : ''}{formatKRW(simResult.netProfit)}
                    </span>
                    <span className="text-lg font-bold opacity-80">
                      ({simResult.netProfitRate >= 0 ? '+' : ''}{simResult.netProfitRate.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-surface-container-lowest rounded-xl p-6 space-y-3">
                  <h3 className="font-headline font-bold text-on-surface">상세 내역</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">매수 금액</span>
                      <span className="font-bold">{((Number(buyPrice) || 0) * (Number(quantity) || 0)).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">매도 금액</span>
                      <span className="font-bold">{((Number(sellPrice) || Number(buyPrice) || 0) * (Number(quantity) || 0)).toLocaleString()}원</span>
                    </div>
                    <div className="h-px bg-surface-container" />
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">매매 차익</span>
                      <span className={`font-bold ${simResult.grossProfit >= 0 ? 'text-primary' : 'text-error'}`}>
                        {simResult.grossProfit >= 0 ? '+' : ''}{simResult.grossProfit.toLocaleString()}원 ({simResult.grossProfitRate.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="h-px bg-surface-container" />
                    <div className="flex justify-between text-on-surface-variant">
                      <span>매수 수수료</span>
                      <span>-{simResult.buyFee.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>매도 수수료</span>
                      <span>-{simResult.sellFee.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>거래세 (0.18%)</span>
                      <span>-{simResult.tradeTax.toLocaleString()}원</span>
                    </div>
                    {simResult.capitalGainsTax > 0 && (
                      <div className="flex justify-between text-on-surface-variant">
                        <span>양도소득세 (22%)</span>
                        <span>-{simResult.capitalGainsTax.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex justify-between text-on-surface-variant">
                      <span>총 비용</span>
                      <span>-{simResult.totalCost.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* Break-even */}
                <div className="bg-surface-container-low rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">target</span>
                    <span className="font-headline font-bold text-on-surface">손익분기 매도가</span>
                  </div>
                  <span className="text-2xl font-headline font-extrabold text-on-surface">
                    ₩{simResult.breakEvenPrice.toLocaleString()}
                  </span>
                  <p className="text-xs text-on-surface-variant mt-1">
                    이 가격 이상에 매도해야 수수료·세금 포함 본전
                  </p>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            {/* DCA Input */}
            <section className="bg-surface-container-lowest rounded-xl p-6 space-y-4">
              <h3 className="font-headline font-bold text-on-surface mb-2">현재 보유</h3>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">현재 평균단가</label>
                <NumberInput value={currentAvg} onChange={setCurrentAvg} suffix="원" ariaLabel="현재 평균단가" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">보유 수량</label>
                <NumberInput value={currentShares} onChange={setCurrentShares} suffix="주" ariaLabel="보유 수량" />
              </div>

              <div className="h-px bg-surface-container" />
              <h3 className="font-headline font-bold text-on-surface mb-2">추가 매수</h3>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">추가 매수가</label>
                <NumberInput value={addPrice} onChange={setAddPrice} suffix="원" ariaLabel="추가 매수가" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-xs font-bold mb-1.5">추가 수량</label>
                <NumberInput value={addShares} onChange={setAddShares} suffix="주" ariaLabel="추가 수량" />
              </div>
            </section>

            {/* DCA Result */}
            {dcaResult && (
              <section className="space-y-4">
                <div className="bg-gradient-to-br from-primary to-primary-dim rounded-2xl p-6 text-on-primary">
                  <p className="text-on-primary/70 text-xs font-bold mb-1">물타기 후 평균단가</p>
                  <span className="text-3xl font-headline font-extrabold">
                    ₩{dcaResult.avgPrice.toLocaleString()}
                  </span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">기존 평균단가</span>
                    <span className="font-bold">₩{(Number(currentAvg) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">변동</span>
                    <span className={`font-bold ${dcaResult.avgPrice < (Number(currentAvg) || 0) ? 'text-primary' : 'text-error'}`}>
                      {dcaResult.avgPrice < (Number(currentAvg) || 0) ? '▼' : '▲'} ₩{Math.abs(dcaResult.avgPrice - (Number(currentAvg) || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-surface-container" />
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">총 보유 수량</span>
                    <span className="font-bold">{dcaResult.totalShares.toLocaleString()}주</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">총 투자금</span>
                    <span className="font-bold">₩{dcaResult.totalCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Visual comparison */}
                <div className="bg-surface-container-low rounded-xl p-5">
                  <p className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-widest">평단가 비교</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">기존</span>
                        <span className="font-bold">₩{(Number(currentAvg) || 0).toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-error/60 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">물타기 후</span>
                        <span className="font-bold text-primary">₩{dcaResult.avgPrice.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.round((dcaResult.avgPrice / (Number(currentAvg) || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
