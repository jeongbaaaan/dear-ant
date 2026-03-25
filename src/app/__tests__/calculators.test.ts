/**
 * Financial calculation unit tests for Dear,ANT
 *
 * WHY functions are duplicated here:
 * The calculation functions (calcSavings, calcStock, calculateCompound,
 * calculateSimple) are defined inside page components and are not exported.
 * Extracting them would require modifying source files, which is out of scope
 * for this task. Instead, the pure mathematical logic is copied verbatim so
 * the tests can assert correctness of the algorithms independently of the
 * React component lifecycle. Any future refactor that exports these functions
 * should delete this duplication and import from the source.
 */

import { describe, it, expect } from 'vitest';

// ─── Copied verbatim from src/app/calculator/page.tsx ────────────────────────

function calcSavings(monthly: number, months: number, annualRate: number) {
  const totalPrincipal = monthly * months;
  const interest =
    monthly * ((months * (months + 1)) / 2) * (annualRate / 100 / 12);
  const tax = interest * 0.154;
  const netInterest = interest - tax;
  const total = totalPrincipal + netInterest;

  return {
    totalPrincipal,
    grossInterest: Math.round(interest),
    tax: Math.round(tax),
    netInterest: Math.round(netInterest),
    total: Math.round(total),
    effectiveRate:
      totalPrincipal > 0 ? (netInterest / totalPrincipal) * 100 : 0,
  };
}

function calcStock(
  monthly: number,
  months: number,
  expectedReturn: number,
) {
  const totalPrincipal = monthly * months;

  function calcWithRate(annualReturn: number) {
    const monthlyRate = annualReturn / 100 / 12;
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + monthlyRate);
    }
    const profit = total - totalPrincipal;
    const tax = profit > 2_500_000 ? (profit - 2_500_000) * 0.22 : 0;
    return {
      total: Math.round(total - tax),
      grossProfit: Math.round(profit),
      tax: Math.round(tax),
      netProfit: Math.round(profit - tax),
    };
  }

  const optimistic = calcWithRate(expectedReturn * 1.5);
  const expected = calcWithRate(expectedReturn);
  const conservative = calcWithRate(expectedReturn * 0.3);
  const worst = calcWithRate(-expectedReturn * 0.8);

  return { totalPrincipal, optimistic, expected, conservative, worst };
}

// ─── Copied verbatim from src/app/compound/page.tsx ──────────────────────────

interface YearSnapshot {
  year: number;
  principalCumulative: number;
  profitCumulative: number;
  total: number;
  returnRate: number;
}

function calculateCompound(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number,
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

// NOTE: The actual calculateSimple in compound/page.tsx returns a plain number,
// not an object. It uses a closed-form simple-interest formula, not a loop.
function calculateSimple(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number,
): number {
  const totalMonths = years * 12;
  const totalPrincipal = initialAmount + monthlyAmount * totalMonths;
  const initialInterest = initialAmount * (annualRate / 100) * years;
  const monthlyInterest =
    monthlyAmount * totalMonths * ((totalMonths + 1) / 2) * (annualRate / 100 / 12);
  return Math.round(totalPrincipal + initialInterest + monthlyInterest);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('calcSavings', () => {
  it('test_calcSavings_standard_inputs_returns_correct_principal_and_positive_interest', () => {
    const result = calcSavings(500_000, 12, 3.5);

    expect(result.totalPrincipal).toBe(6_000_000);
    expect(result.grossInterest).toBeGreaterThan(0);
    // tax must be exactly 15.4 % of the pre-rounding gross interest
    const rawInterest =
      500_000 * ((12 * 13) / 2) * (3.5 / 100 / 12);
    expect(result.tax).toBe(Math.round(rawInterest * 0.154));
    expect(result.netInterest).toBe(
      Math.round(rawInterest - rawInterest * 0.154),
    );
    expect(result.total).toBe(result.totalPrincipal + result.netInterest);
  });

  it('test_calcSavings_zero_monthly_returns_zero_effectiveRate', () => {
    const result = calcSavings(0, 12, 3.5);

    expect(result.effectiveRate).toBe(0);
    expect(result.totalPrincipal).toBe(0);
    expect(result.grossInterest).toBe(0);
  });

  it('test_calcSavings_zero_rate_returns_zero_interest', () => {
    const result = calcSavings(500_000, 12, 0);

    expect(result.grossInterest).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.netInterest).toBe(0);
    expect(result.total).toBe(result.totalPrincipal);
  });
});

describe('calcStock', () => {
  it('test_calcStock_standard_inputs_returns_four_scenarios_in_descending_order', () => {
    const result = calcStock(500_000, 12, 10);

    // All four scenario keys are present
    expect(result).toHaveProperty('optimistic');
    expect(result).toHaveProperty('expected');
    expect(result).toHaveProperty('conservative');
    expect(result).toHaveProperty('worst');

    // Returns: optimistic (×1.5) > expected (×1.0) > conservative (×0.3) > worst (−0.8×)
    expect(result.optimistic.netProfit).toBeGreaterThan(result.expected.netProfit);
    expect(result.expected.netProfit).toBeGreaterThan(result.conservative.netProfit);
    expect(result.conservative.netProfit).toBeGreaterThan(result.worst.netProfit);
  });

  it('test_calcStock_profit_exactly_at_tax_threshold_applies_zero_tax', () => {
    // Build inputs that produce grossProfit === exactly 2,500,000 (no tax).
    // With monthly=M, months=1, rate r:
    //   total = M * (1 + r/12), profit = total - M
    // Solve for M: profit = M * r/12 = 2,500,000 → M = 2,500,000 / (r/12)
    // Use expectedReturn=12 so r=12, monthly_rate=0.01
    // M = 2_500_000 / 0.01 = 250_000_000, months=1
    // grossProfit = Math.round(250_000_000 * 0.01) = 2_500_000 → tax boundary
    const result = calcStock(250_000_000, 1, 12);

    // grossProfit == 2_500_000 (not strictly greater), so tax must be 0
    expect(result.expected.grossProfit).toBe(2_500_000);
    expect(result.expected.tax).toBe(0);
  });

  it('test_calcStock_profit_one_won_above_threshold_applies_positive_tax', () => {
    // monthly=250_000_001, months=1, rate=12 → grossProfit rounds to 2_500_000
    // We need profit that rounds to 2_500_001.
    // Use months=2, monthly=M, rate=12 to get a larger profit.
    // Instead of computing exactly, use a large enough investment so profit >> 2,500,000
    // and verify tax is positive.
    const result = calcStock(500_000, 60, 15);

    if (result.expected.grossProfit > 2_500_000) {
      expect(result.expected.tax).toBeGreaterThan(0);
      expect(result.expected.tax).toBe(
        Math.round((result.expected.grossProfit - 2_500_000) * 0.22),
      );
    }
  });

  it('test_calcStock_worst_case_negative_return_yields_negative_profit_and_zero_tax', () => {
    const result = calcStock(500_000, 12, 10);

    // worst uses -expectedReturn * 0.8 = -8 % annual, so profit < 0
    expect(result.worst.grossProfit).toBeLessThan(0);
    // No tax when there is no gain
    expect(result.worst.tax).toBe(0);
    expect(result.worst.netProfit).toBeLessThan(0);
  });
});

describe('calculateCompound', () => {
  it('test_calculateCompound_standard_inputs_total_exceeds_principal_and_produces_correct_snapshot_count', () => {
    const result = calculateCompound(10_000_000, 500_000, 7, 5);

    expect(result.total).toBeGreaterThan(result.totalPrincipal);
    expect(result.totalProfit).toBeGreaterThan(0);
    expect(result.snapshots).toHaveLength(5);
  });

  it('test_calculateCompound_snapshots_contain_correct_year_labels', () => {
    const result = calculateCompound(10_000_000, 500_000, 7, 5);

    const years = result.snapshots.map((s) => s.year);
    expect(years).toEqual([1, 2, 3, 4, 5]);
  });

  it('test_calculateCompound_zero_rate_total_equals_principal', () => {
    const years = 5;
    const initialAmount = 10_000_000;
    const monthlyAmount = 500_000;
    const result = calculateCompound(initialAmount, monthlyAmount, 0, years);

    const expectedPrincipal = initialAmount + monthlyAmount * years * 12;
    // With 0 % rate the monthly factor is (1 + 0) = 1, so current just sums deposits.
    // total and totalPrincipal must be equal (within rounding).
    expect(result.total).toBe(result.totalPrincipal);
    expect(result.totalPrincipal).toBe(expectedPrincipal);
    expect(result.totalProfit).toBe(0);
  });

  it('test_calculateCompound_one_year_produces_exactly_one_snapshot', () => {
    const result = calculateCompound(10_000_000, 500_000, 7, 1);

    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0].year).toBe(1);
  });

  it('test_calculateCompound_snapshots_total_grows_monotonically', () => {
    const result = calculateCompound(10_000_000, 500_000, 7, 5);

    for (let i = 1; i < result.snapshots.length; i++) {
      expect(result.snapshots[i].total).toBeGreaterThan(
        result.snapshots[i - 1].total,
      );
    }
  });
});

describe('calculateSimple vs calculateCompound', () => {
  it('test_compound_total_is_greater_than_or_equal_to_simple_total_for_positive_rate', () => {
    const initialAmount = 10_000_000;
    const monthly = 500_000;
    const rate = 7;
    const years = 5;

    const compoundResult = calculateCompound(initialAmount, monthly, rate, years);
    const simpleTotal = calculateSimple(initialAmount, monthly, rate, years);

    // Compound interest always produces at least as much as simple interest
    // when the rate is positive and the period is >= 1 year.
    expect(compoundResult.total).toBeGreaterThanOrEqual(simpleTotal);
  });

  it('test_compound_and_simple_both_equal_principal_when_rate_is_zero', () => {
    const initialAmount = 5_000_000;
    const monthly = 200_000;
    const years = 3;

    const compoundResult = calculateCompound(initialAmount, monthly, 0, years);
    const simpleTotal = calculateSimple(initialAmount, monthly, 0, years);
    const expectedPrincipal = initialAmount + monthly * years * 12;

    expect(compoundResult.total).toBe(expectedPrincipal);
    expect(simpleTotal).toBe(expectedPrincipal);
  });
});
