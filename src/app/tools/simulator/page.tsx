'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import NumberInput from '@/components/NumberInput';

// 세금/수수료 상수
const TAX_RATE = 0.0018; // 거래세 0.18% (코스피 기준)
const CAPITAL_GAINS_TAX = 0.22; // 양도소득세 22% (대주주/해외)
const CAPITAL_GAINS_DEDUCTION = 2500000; // 기본공제 250만원

const brokerFees: Record<string, { label: string; rate: number }> = {
  free: { label: '무료', rate: 0 },
  low: { label: '0.015%', rate: 0.00015 },
  mid: { label: '0.05%', rate: 0.0005 },
  high: { label: '0.1%', rate: 0.001 },
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

  const buyTotal = (Number(buyPrice) || 0) * (Number(quantity) || 0);
  const sellTotal = (Number(sellPrice) || Number(buyPrice) || 0) * (Number(quantity) || 0);

  return (
    <main className="min-h-screen pb-32">
      {/* Breadcrumb nav */}
      <div className="px-6 pt-6 max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          홈
        </Link>
      </div>

      <div className="px-6 pt-4 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-extrabold text-on-surface text-2xl tracking-tight mb-1">
            매매 시뮬레이터
          </h1>
          <p className="text-sm text-on-surface-secondary">
            매수/매도 수익률 계산과 물타기(DCA) 시뮬레이션
          </p>
        </div>

        {/* Pill toggle tabs */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setTab('profit')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'profit'
                ? 'bg-surface shadow-sm text-on-surface'
                : 'text-on-surface-secondary hover:text-on-surface'
            }`}
          >
            수익률 계산
          </button>
          <button
            onClick={() => setTab('dca')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === 'dca'
                ? 'bg-surface shadow-sm text-on-surface'
                : 'text-on-surface-secondary hover:text-on-surface'
            }`}
          >
            물타기 계산
          </button>
        </div>

        {tab === 'profit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===== Input Panel ===== */}
            <div className="card card-raised">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
                <span className="font-bold text-on-surface">매매 조건</span>
              </div>

              {/* 2-col form grid: 매수가+수량, 매도가+수량 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">매수가</label>
                  <NumberInput value={buyPrice} onChange={setBuyPrice} suffix="원" ariaLabel="매수가" />
                </div>
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">매수 수량</label>
                  <NumberInput value={quantity} onChange={setQuantity} suffix="주" ariaLabel="매수 수량" />
                </div>
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">매도가 (목표)</label>
                  <NumberInput
                    value={sellPrice}
                    onChange={setSellPrice}
                    suffix="원"
                    ariaLabel="매도가"
                    placeholder="비워두면 매수가와 동일"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">매도 수량</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={quantity ? Number(quantity).toLocaleString() : ''}
                      readOnly
                      aria-label="매도 수량"
                      className="w-full px-4 py-2.5 pr-12 rounded-xl bg-surface-container text-on-surface text-sm font-bold opacity-60 cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-secondary text-sm">주</span>
                  </div>
                </div>
              </div>

              {/* 수수료 chip selector */}
              <div className="mb-5">
                <label className="block text-on-surface-secondary text-xs font-bold mb-2">증권사 수수료</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(brokerFees).map(([key, b]) => (
                    <button
                      key={key}
                      onClick={() => setBroker(key)}
                      aria-pressed={broker === key}
                      className={`chip ${broker === key ? 'chip-selected' : 'chip-default'}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 양도소득세 checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyCapitalGains}
                  onChange={(e) => setApplyCapitalGains(e.target.checked)}
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <p className="text-sm font-bold text-on-surface">양도소득세 적용</p>
                  <p className="text-[11px] text-on-surface-secondary">해외주식 또는 대주주 (22%, 250만원 공제)</p>
                </div>
              </label>
            </div>

            {/* ===== Result Panel ===== */}
            <div className="space-y-5">
              {simResult ? (
                <>
                  {/* Hero card */}
                  <div className={`card card-accent rounded-2xl p-6 ${
                    simResult.netProfit >= 0
                      ? 'bg-gradient-to-br from-primary to-primary-dim'
                      : 'bg-gradient-to-br from-error to-error-dim'
                  } text-on-primary`}>
                    <p className="text-on-primary/60 text-xs font-bold uppercase tracking-widest mb-2">예상 순수익</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold">
                        {simResult.netProfit >= 0 ? '+' : ''}{formatKRW(simResult.netProfit)}
                      </span>
                    </div>
                    <p className="text-on-primary/70 text-sm font-semibold mt-1">
                      수익률 {simResult.netProfitRate >= 0 ? '+' : ''}{simResult.netProfitRate.toFixed(2)}%
                    </p>
                  </div>

                  {/* Detail table */}
                  <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                      <tbody>
                        <tr>
                          <td className="text-on-surface-secondary">매수 금액</td>
                          <td className="text-right font-semibold">{buyTotal.toLocaleString()}원</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">매도 금액</td>
                          <td className="text-right font-semibold">{sellTotal.toLocaleString()}원</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">매수 수수료</td>
                          <td className="text-right font-semibold text-error">-{simResult.buyFee.toLocaleString()}원</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">매도 수수료</td>
                          <td className="text-right font-semibold text-error">-{simResult.sellFee.toLocaleString()}원</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">거래세 (0.18%)</td>
                          <td className="text-right font-semibold text-error">-{simResult.tradeTax.toLocaleString()}원</td>
                        </tr>
                        {simResult.capitalGainsTax > 0 ? (
                          <tr>
                            <td className="text-on-surface-secondary">양도소득세 (22%)</td>
                            <td className="text-right font-semibold text-error">-{simResult.capitalGainsTax.toLocaleString()}원</td>
                          </tr>
                        ) : (
                          <tr>
                            <td className="text-on-surface-secondary">양도소득세</td>
                            <td className="text-right font-semibold text-on-surface-secondary">&mdash;</td>
                          </tr>
                        )}
                        <tr className="border-t-2 border-primary">
                          <td className="font-bold text-[15px]">순수익</td>
                          <td className={`text-right font-extrabold text-lg ${
                            simResult.netProfit >= 0 ? 'text-primary' : 'text-error'
                          }`}>
                            {simResult.netProfit >= 0 ? '+' : ''}{simResult.netProfit.toLocaleString()}원
                          </td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">손익분기 매도가</td>
                          <td className="text-right font-semibold">{simResult.breakEvenPrice.toLocaleString()}원</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-secondary/40 mb-3">calculate</span>
                  <p className="text-on-surface-secondary text-sm">
                    매수가와 수량을 입력하면<br />수익률이 바로 계산됩니다
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ===== DCA Tab ===== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DCA Input Panel */}
            <div className="card card-raised">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
                <span className="font-bold text-on-surface">물타기 조건</span>
              </div>

              <p className="text-xs font-bold text-on-surface-secondary uppercase tracking-widest mb-3">현재 보유</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">현재 평균단가</label>
                  <NumberInput value={currentAvg} onChange={setCurrentAvg} suffix="원" ariaLabel="현재 평균단가" />
                </div>
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">보유 수량</label>
                  <NumberInput value={currentShares} onChange={setCurrentShares} suffix="주" ariaLabel="보유 수량" />
                </div>
              </div>

              <div className="h-px bg-surface-container mb-6" />

              <p className="text-xs font-bold text-on-surface-secondary uppercase tracking-widest mb-3">추가 매수</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">추가 매수가</label>
                  <NumberInput value={addPrice} onChange={setAddPrice} suffix="원" ariaLabel="추가 매수가" />
                </div>
                <div>
                  <label className="block text-on-surface-secondary text-xs font-bold mb-2">추가 수량</label>
                  <NumberInput value={addShares} onChange={setAddShares} suffix="주" ariaLabel="추가 수량" />
                </div>
              </div>
            </div>

            {/* DCA Result Panel */}
            <div className="space-y-5">
              {dcaResult ? (
                <>
                  {/* Hero */}
                  <div className="card card-accent rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary">
                    <p className="text-on-primary/60 text-xs font-bold uppercase tracking-widest mb-2">물타기 후 평균단가</p>
                    <span className="text-3xl font-extrabold">
                      {dcaResult.avgPrice.toLocaleString()}원
                    </span>
                  </div>

                  {/* Detail table */}
                  <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                      <tbody>
                        <tr>
                          <td className="text-on-surface-secondary">기존 평균단가</td>
                          <td className="text-right font-semibold">{(Number(currentAvg) || 0).toLocaleString()}원</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">변동</td>
                          <td className={`text-right font-bold ${dcaResult.avgPrice < (Number(currentAvg) || 0) ? 'text-primary' : 'text-error'}`}>
                            {dcaResult.avgPrice < (Number(currentAvg) || 0) ? '▼' : '▲'} {Math.abs(dcaResult.avgPrice - (Number(currentAvg) || 0)).toLocaleString()}원
                          </td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">총 보유 수량</td>
                          <td className="text-right font-semibold">{dcaResult.totalShares.toLocaleString()}주</td>
                        </tr>
                        <tr>
                          <td className="text-on-surface-secondary">총 투자금</td>
                          <td className="text-right font-semibold">{dcaResult.totalCost.toLocaleString()}원</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Visual comparison bar */}
                  <div className="card">
                    <p className="text-xs font-bold text-on-surface-secondary uppercase tracking-widest mb-4">평단가 비교</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-on-surface-secondary">기존</span>
                          <span className="font-bold">{(Number(currentAvg) || 0).toLocaleString()}원</span>
                        </div>
                        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-error/60 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-on-surface-secondary">물타기 후</span>
                          <span className="font-bold text-primary">{dcaResult.avgPrice.toLocaleString()}원</span>
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
                </>
              ) : (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-secondary/40 mb-3">functions</span>
                  <p className="text-on-surface-secondary text-sm">
                    현재 보유 정보와 추가 매수 조건을<br />입력하면 결과가 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
