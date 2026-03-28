/**
 * Unit tests for the pure calculation functions in src/app/page.tsx
 *
 * WHY functions are duplicated here:
 * getRelativeDate, getStreak, getLast7DaysVolume, and the portfolio useMemo
 * logic are all defined inline inside the Home React component and are not
 * exported. Extracting them would require modifying the source file, which is
 * out of scope here. Instead, the pure mathematical/date logic is copied
 * verbatim so the tests can assert correctness independently of the React
 * component lifecycle. Any future refactor that exports these functions should
 * delete this duplication and import from the source.
 *
 * Copied verbatim from: src/app/page.tsx
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import type { StoredReport, StoredMemo } from '@/lib/client-store';

// ─── Copied verbatim from src/app/page.tsx ────────────────────────────────────

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

function getLast7DaysVolume(memos: StoredMemo[]): { label: string; value: number }[] {
  const days: { label: string; value: number }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayMemos = memos.filter(m => m.created_at.startsWith(dateStr));
    const volume = dayMemos.reduce((sum, m) => sum + ((m.price || 0) * (m.quantity || 0)), 0);
    days.push({ label: dayLabels[d.getDay()], value: volume });
  }
  return days;
}

// Portfolio calculation — extracted from the useMemo in Home()
function calculatePortfolio(memos: StoredMemo[]) {
  const positions: Record<string, { shares: number; totalCost: number }> = {};
  let realizedPnl = 0;
  const tradeCount = memos.filter(m => (m.action === 'buy' || m.action === 'sell') && m.price && m.quantity).length;

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

  const totalValue = Object.values(positions).reduce((s, p) => s + p.totalCost, 0);
  const holdingStocks = Object.entries(positions)
    .filter(([, p]) => p.shares > 0)
    .map(([name, p]) => ({
      name,
      shares: p.shares,
      avgPrice: Math.round(p.totalCost / p.shares),
      value: Math.round(p.totalCost),
    }));

  return {
    totalValue: Math.round(totalValue),
    realizedPnl: Math.round(realizedPnl),
    holdingStocks,
    tradeCount,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeMemo(overrides: Partial<StoredMemo> = {}): StoredMemo {
  return {
    id: 'memo-' + Math.random().toString(36).slice(2),
    stock_name: '삼성전자',
    action: 'buy',
    price: 70_000,
    quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function makeReport(overrides: Partial<StoredReport> = {}): StoredReport {
  return {
    id: 'report-' + Math.random().toString(36).slice(2),
    session_id: 'session-' + Math.random().toString(36).slice(2),
    decision_mode: 'analytical',
    mood_score: 72,
    risk_tendency: 'moderate',
    invest_mood: 'A',
    biorhythm_physical: 0.85,
    biorhythm_emotional: 0.60,
    biorhythm_intellectual: 0.90,
    today_keywords: ['집중'],
    today_message: '집중력이 높은 날',
    today_letter: 'Dear,ANT...',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

// ─── getRelativeDate ──────────────────────────────────────────────────────────

describe('getRelativeDate', () => {
  it('test_getRelativeDate_same_day_returns_오늘', () => {
    const now = new Date();
    const result = getRelativeDate(now.toISOString());

    expect(result).toBe('오늘');
  });

  it('test_getRelativeDate_yesterday_returns_어제', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = getRelativeDate(yesterday.toISOString());

    expect(result).toBe('어제');
  });

  it('test_getRelativeDate_3_days_ago_returns_3일_전', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const result = getRelativeDate(threeDaysAgo.toISOString());

    expect(result).toBe('3일 전');
  });

  it('test_getRelativeDate_10_days_ago_returns_10일_전', () => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const result = getRelativeDate(tenDaysAgo.toISOString());

    expect(result).toBe('10일 전');
  });
});

// ─── getStreak ────────────────────────────────────────────────────────────────

describe('getStreak', () => {
  it('test_getStreak_with_empty_reports_returns_0', () => {
    const result = getStreak([]);

    expect(result).toBe(0);
  });

  it('test_getStreak_with_only_today_returns_1', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T10:00:00.000Z'));

    const reports = [makeReport({ created_at: '2026-03-27T09:00:00.000Z' })];

    const result = getStreak(reports);

    expect(result).toBe(1);
  });

  it('test_getStreak_with_today_and_3_consecutive_prior_days_returns_4', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T10:00:00.000Z'));

    const reports = [
      makeReport({ created_at: '2026-03-27T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-26T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-25T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-24T09:00:00.000Z' }),
    ];

    const result = getStreak(reports);

    expect(result).toBe(4);
  });

  it('test_getStreak_gap_in_dates_breaks_streak', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T10:00:00.000Z'));

    const reports = [
      makeReport({ created_at: '2026-03-27T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-26T09:00:00.000Z' }),
      // gap: 2026-03-24 (no report on 2026-03-25)
      makeReport({ created_at: '2026-03-24T09:00:00.000Z' }),
    ];

    const result = getStreak(reports);

    // Only today + yesterday = 2 consecutive days
    expect(result).toBe(2);
  });

  it('test_getStreak_returns_0_when_most_recent_is_older_than_yesterday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T10:00:00.000Z'));

    const reports = [
      makeReport({ created_at: '2026-03-25T09:00:00.000Z' }), // 2 days ago
      makeReport({ created_at: '2026-03-24T09:00:00.000Z' }),
    ];

    const result = getStreak(reports);

    expect(result).toBe(0);
  });

  it('test_getStreak_multiple_reports_on_same_day_counts_as_one_day', () => {
    vi.useFakeTimers();
    // Use noon UTC — safe for all timezones within UTC±11 to stay on the same local calendar day
    vi.setSystemTime(new Date('2026-03-27T03:00:00.000Z')); // noon KST = 03:00 UTC

    const reports = [
      makeReport({ created_at: '2026-03-27T01:00:00.000Z' }), // same local day, earlier
      makeReport({ created_at: '2026-03-27T02:00:00.000Z' }), // same local day, later
      makeReport({ created_at: '2026-03-26T03:00:00.000Z' }), // previous local day
    ];

    const result = getStreak(reports);

    // Two unique local days: 2026-03-27 and 2026-03-26 → streak = 2
    expect(result).toBe(2);
  });

  it('test_getStreak_starting_from_yesterday_with_consecutive_chain_is_counted', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T10:00:00.000Z'));

    // No report today, but consecutive from yesterday
    const reports = [
      makeReport({ created_at: '2026-03-26T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-25T09:00:00.000Z' }),
      makeReport({ created_at: '2026-03-24T09:00:00.000Z' }),
    ];

    const result = getStreak(reports);

    // Streak starts from yesterday: 3 days
    expect(result).toBe(3);
  });
});

// ─── getLast7DaysVolume ───────────────────────────────────────────────────────

describe('getLast7DaysVolume', () => {
  it('test_getLast7DaysVolume_always_returns_exactly_7_entries', () => {
    const result = getLast7DaysVolume([]);

    expect(result).toHaveLength(7);
  });

  it('test_getLast7DaysVolume_empty_memos_all_values_are_0', () => {
    const result = getLast7DaysVolume([]);

    result.forEach(d => expect(d.value).toBe(0));
  });

  it('test_getLast7DaysVolume_labels_are_valid_day_abbreviations', () => {
    const validLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = getLast7DaysVolume([]);

    result.forEach(d => expect(validLabels).toContain(d.label));
  });

  it('test_getLast7DaysVolume_today_buy_memo_contributes_to_last_entry', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00.000Z')); // Friday

    const memos: StoredMemo[] = [
      makeMemo({ price: 70_000, quantity: 5, created_at: '2026-03-27T09:00:00.000Z' }),
    ];

    const result = getLast7DaysVolume(memos);

    // Today is the last entry (index 6)
    expect(result[6].value).toBe(350_000); // 70_000 * 5
    expect(result[6].label).toBe('Fri');
  });

  it('test_getLast7DaysVolume_memos_older_than_7_days_are_excluded', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00.000Z'));

    const oldMemo = makeMemo({ price: 100_000, quantity: 10, created_at: '2026-03-19T09:00:00.000Z' }); // 8 days ago

    const result = getLast7DaysVolume([oldMemo]);

    const totalVolume = result.reduce((s, d) => s + d.value, 0);
    expect(totalVolume).toBe(0);
  });

  it('test_getLast7DaysVolume_watch_and_hold_memos_contribute_zero_volume', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00.000Z'));

    const memos: StoredMemo[] = [
      makeMemo({ action: 'watch', price: undefined, quantity: undefined, created_at: '2026-03-27T09:00:00.000Z' }),
      makeMemo({ action: 'hold', price: undefined, quantity: undefined, created_at: '2026-03-27T09:00:00.000Z' }),
    ];

    const result = getLast7DaysVolume(memos);

    expect(result[6].value).toBe(0);
  });

  it('test_getLast7DaysVolume_multiple_memos_same_day_values_are_summed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00.000Z'));

    const memos: StoredMemo[] = [
      makeMemo({ price: 70_000, quantity: 5, created_at: '2026-03-27T09:00:00.000Z' }),  // 350_000
      makeMemo({ price: 50_000, quantity: 3, created_at: '2026-03-27T11:00:00.000Z' }),  // 150_000
    ];

    const result = getLast7DaysVolume(memos);

    expect(result[6].value).toBe(500_000);
  });
});

// ─── calculatePortfolio ───────────────────────────────────────────────────────

describe('calculatePortfolio', () => {
  it('test_calculatePortfolio_empty_memos_returns_zero_values_and_empty_holdings', () => {
    const result = calculatePortfolio([]);

    expect(result.totalValue).toBe(0);
    expect(result.realizedPnl).toBe(0);
    expect(result.holdingStocks).toHaveLength(0);
    expect(result.tradeCount).toBe(0);
  });

  it('test_calculatePortfolio_single_buy_creates_holding_with_correct_avgPrice', () => {
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10 }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.tradeCount).toBe(1);
    expect(result.totalValue).toBe(700_000);
    expect(result.realizedPnl).toBe(0);
    expect(result.holdingStocks).toHaveLength(1);
    expect(result.holdingStocks[0].name).toBe('삼성전자');
    expect(result.holdingStocks[0].shares).toBe(10);
    expect(result.holdingStocks[0].avgPrice).toBe(70_000);
    expect(result.holdingStocks[0].value).toBe(700_000);
  });

  it('test_calculatePortfolio_two_buys_same_stock_calculates_weighted_avg_price', () => {
    // First buy: 10 shares @ 70,000 = 700,000
    // Second buy: 10 shares @ 90,000 = 900,000
    // Total: 20 shares, cost 1,600,000 → avgPrice = 80,000
    const t1 = '2024-01-01T10:00:00.000Z';
    const t2 = '2024-01-02T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: t1 }),
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 90_000, quantity: 10, created_at: t2 }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.tradeCount).toBe(2);
    expect(result.holdingStocks[0].shares).toBe(20);
    expect(result.holdingStocks[0].avgPrice).toBe(80_000);
    expect(result.holdingStocks[0].value).toBe(1_600_000);
    expect(result.totalValue).toBe(1_600_000);
    expect(result.realizedPnl).toBe(0);
  });

  it('test_calculatePortfolio_full_sell_above_avgPrice_produces_positive_realizedPnl', () => {
    // Buy 10 @ 70,000 → avgPrice 70,000
    // Sell 10 @ 80,000 → realized PnL = (80,000 - 70,000) * 10 = 100,000
    const t1 = '2024-01-01T10:00:00.000Z';
    const t2 = '2024-01-02T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: t1 }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 80_000, quantity: 10, created_at: t2 }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.realizedPnl).toBe(100_000);
    expect(result.totalValue).toBe(0);
    expect(result.holdingStocks).toHaveLength(0);
  });

  it('test_calculatePortfolio_partial_sell_reduces_shares_and_cost_proportionally', () => {
    // Buy 20 @ 70,000 = 1,400,000 → avgPrice 70,000
    // Sell 5 @ 80,000 → realized = (80,000 - 70,000) * 5 = 50,000
    // Remaining: 15 shares, cost = 1,400,000 - 70,000*5 = 1,050,000 → avgPrice still 70,000
    const t1 = '2024-01-01T10:00:00.000Z';
    const t2 = '2024-01-02T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 20, created_at: t1 }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 80_000, quantity: 5, created_at: t2 }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.realizedPnl).toBe(50_000);
    expect(result.holdingStocks[0].shares).toBe(15);
    expect(result.holdingStocks[0].avgPrice).toBe(70_000);
    expect(result.holdingStocks[0].value).toBe(1_050_000);
    expect(result.totalValue).toBe(1_050_000);
  });

  it('test_calculatePortfolio_sell_below_avgPrice_produces_negative_realizedPnl', () => {
    // Buy 10 @ 70,000, sell 10 @ 60,000 → PnL = (60,000 - 70,000) * 10 = -100,000
    const t1 = '2024-01-01T10:00:00.000Z';
    const t2 = '2024-01-02T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: t1 }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 60_000, quantity: 10, created_at: t2 }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.realizedPnl).toBe(-100_000);
    expect(result.holdingStocks).toHaveLength(0);
  });

  it('test_calculatePortfolio_sell_quantity_exceeds_holdings_is_capped_at_available_shares', () => {
    // Buy 5 @ 70,000, sell 10 → only 5 can be sold (capped by Math.min)
    const t1 = '2024-01-01T10:00:00.000Z';
    const t2 = '2024-01-02T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 5, created_at: t1 }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 80_000, quantity: 10, created_at: t2 }),
    ];

    const result = calculatePortfolio(memos);

    // Only 5 shares actually sold
    expect(result.realizedPnl).toBe(50_000); // (80,000 - 70,000) * 5
    expect(result.holdingStocks).toHaveLength(0);
  });

  it('test_calculatePortfolio_multiple_stocks_are_tracked_independently', () => {
    const t = '2024-01-01T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: t }),
      makeMemo({ stock_name: 'SK하이닉스', action: 'buy', price: 150_000, quantity: 5, created_at: t }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.holdingStocks).toHaveLength(2);
    const samsung = result.holdingStocks.find(s => s.name === '삼성전자')!;
    const sk = result.holdingStocks.find(s => s.name === 'SK하이닉스')!;

    expect(samsung.shares).toBe(10);
    expect(samsung.avgPrice).toBe(70_000);
    expect(sk.shares).toBe(5);
    expect(sk.avgPrice).toBe(150_000);
    expect(result.totalValue).toBe(700_000 + 750_000);
  });

  it('test_calculatePortfolio_watch_and_hold_memos_are_excluded_from_tradeCount', () => {
    const t = '2024-01-01T10:00:00.000Z';
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: t }),
      makeMemo({ stock_name: 'NAVER', action: 'watch', price: 200_000, quantity: 1, created_at: t }),
      makeMemo({ stock_name: 'KAKAO', action: 'hold', price: 50_000, quantity: 5, created_at: t }),
    ];

    const result = calculatePortfolio(memos);

    // Only the buy counts
    expect(result.tradeCount).toBe(1);
    // watch/hold holdings must not appear
    expect(result.holdingStocks).toHaveLength(1);
    expect(result.holdingStocks[0].name).toBe('삼성전자');
  });

  it('test_calculatePortfolio_memos_without_price_are_excluded_from_tradeCount', () => {
    const t = '2024-01-01T10:00:00.000Z';
    const memos = [
      makeMemo({ action: 'buy', price: undefined, quantity: 10, created_at: t }),
      makeMemo({ action: 'buy', price: 70_000, quantity: undefined, created_at: t }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.tradeCount).toBe(0);
    expect(result.holdingStocks).toHaveLength(0);
    expect(result.totalValue).toBe(0);
  });

  it('test_calculatePortfolio_chronological_ordering_applied_before_pnl_calculation', () => {
    // If buy comes after sell in the input array but sell has a later timestamp,
    // the sort must process buy first.
    const memos = [
      // Input order: sell first, buy second — but sell timestamp is later
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 80_000, quantity: 10, created_at: '2024-01-02T10:00:00.000Z' }),
      makeMemo({ stock_name: '삼성전자', action: 'buy', price: 70_000, quantity: 10, created_at: '2024-01-01T10:00:00.000Z' }),
    ];

    const result = calculatePortfolio(memos);

    // Buy must be processed first, then sell → correct PnL
    expect(result.realizedPnl).toBe(100_000);
    expect(result.holdingStocks).toHaveLength(0);
  });

  it('test_calculatePortfolio_realized_pnl_accumulates_across_multiple_round_trips', () => {
    // Trip 1: buy 10 @ 70,000 then sell 10 @ 80,000 → PnL +100,000
    // Trip 2: buy 10 @ 60,000 then sell 10 @ 55,000 → PnL -50,000
    // Total realized PnL = +50,000
    const memos = [
      makeMemo({ stock_name: '삼성전자', action: 'buy',  price: 70_000, quantity: 10, created_at: '2024-01-01T10:00:00.000Z' }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 80_000, quantity: 10, created_at: '2024-01-02T10:00:00.000Z' }),
      makeMemo({ stock_name: '삼성전자', action: 'buy',  price: 60_000, quantity: 10, created_at: '2024-01-03T10:00:00.000Z' }),
      makeMemo({ stock_name: '삼성전자', action: 'sell', price: 55_000, quantity: 10, created_at: '2024-01-04T10:00:00.000Z' }),
    ];

    const result = calculatePortfolio(memos);

    expect(result.realizedPnl).toBe(50_000);
    expect(result.holdingStocks).toHaveLength(0);
  });
});
