import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localStore } from '../local-store';

// ── helpers ──────────────────────────────────────────────────────────────────

const REPORT_DATA = {
  decision_mode: 'analytical',
  mood_score: 72,
  risk_tendency: 'moderate',
  invest_mood: 'bullish',
  biorhythm_physical: 0.85,
  biorhythm_emotional: 0.60,
  biorhythm_intellectual: 0.90,
  today_keywords: ['집중', '안정'],
  today_message: '오늘은 집중력이 높은 날입니다.',
  today_letter: '오늘 하루도 잘 해낼 수 있습니다.',
  mood: 'calm',
  birth_date: '1990-01-01',
};

const MEMO_DATA = {
  stock_name: '삼성전자',
  action: 'buy' as const,
  price: 70000,
  quantity: 10,
  memo: '52주 신저가 부근 분할 매수',
};

// ── setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  const g = globalThis as unknown as Record<string, Map<string, unknown> | undefined>;
  g.__dearant_reports?.clear();
  g.__dearant_memos?.clear();
});

// ── createReport ─────────────────────────────────────────────────────────────

describe('createReport', () => {
  it('test_createReport_with_valid_data_returns_report_with_all_fields', () => {
    const report = localStore.createReport(REPORT_DATA);

    expect(typeof report.id).toBe('string');
    expect(report.id).toHaveLength(36); // UUID v4 형식
    expect(typeof report.session_id).toBe('string');
    expect(report.session_id).toHaveLength(36);
    expect(report.decision_mode).toBe('analytical');
    expect(report.mood_score).toBe(72);
    expect(report.risk_tendency).toBe('moderate');
    expect(report.invest_mood).toBe('bullish');
    expect(report.biorhythm_physical).toBe(0.85);
    expect(report.biorhythm_emotional).toBe(0.60);
    expect(report.biorhythm_intellectual).toBe(0.90);
    expect(report.today_keywords).toEqual(['집중', '안정']);
    expect(report.today_message).toBe('오늘은 집중력이 높은 날입니다.');
    expect(report.today_letter).toBe('오늘 하루도 잘 해낼 수 있습니다.');
    expect(typeof report.created_at).toBe('string');
    expect(new Date(report.created_at).toISOString()).toBe(report.created_at);
  });

  it('test_createReport_with_valid_data_populates_sessions_object', () => {
    const report = localStore.createReport(REPORT_DATA);

    expect(report.sessions).toBeDefined();
    expect(report.sessions!.mood).toBe('calm');
    expect(report.sessions!.birth_date).toBe('1990-01-01');
  });

  it('test_createReport_twice_returns_different_ids', () => {
    const first = localStore.createReport(REPORT_DATA);
    const second = localStore.createReport(REPORT_DATA);

    expect(first.id).not.toBe(second.id);
    expect(first.session_id).not.toBe(second.session_id);
  });
});

// ── getReport ────────────────────────────────────────────────────────────────

describe('getReport', () => {
  it('test_getReport_with_existing_id_returns_stored_report', () => {
    const created = localStore.createReport(REPORT_DATA);
    const fetched = localStore.getReport(created.id);

    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.mood_score).toBe(72);
    expect(fetched!.invest_mood).toBe('bullish');
  });

  it('test_getReport_with_nonexistent_id_returns_undefined', () => {
    const result = localStore.getReport('00000000-0000-0000-0000-000000000000');

    expect(result).toBeUndefined();
  });
});

// ── listReports ───────────────────────────────────────────────────────────────

describe('listReports', () => {
  it('test_listReports_with_multiple_reports_returns_descending_created_at_order', () => {
    // 날짜를 명시적으로 제어하기 위해 세 건을 순서대로 생성
    const first = localStore.createReport(REPORT_DATA);
    const second = localStore.createReport({ ...REPORT_DATA, mood_score: 50 });
    const third = localStore.createReport({ ...REPORT_DATA, mood_score: 30 });

    const list = localStore.listReports();

    // 가장 최근(마지막 생성)이 index 0
    // created_at 동일 밀리초 가능성: id 기반 순서 대신 created_at >= 이전 항목 확인
    for (let i = 0; i < list.length - 1; i++) {
      expect(new Date(list[i].created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(list[i + 1].created_at).getTime()
      );
    }

    // 생성된 3개가 모두 결과에 포함됨
    const ids = list.map((r) => r.id);
    expect(ids).toContain(first.id);
    expect(ids).toContain(second.id);
    expect(ids).toContain(third.id);
  });

  it('test_listReports_with_more_than_20_reports_returns_max_20', () => {
    for (let i = 0; i < 25; i++) {
      localStore.createReport({ ...REPORT_DATA, mood_score: i });
    }

    const list = localStore.listReports();

    expect(list).toHaveLength(20);
  });
});

// ── createMemo ────────────────────────────────────────────────────────────────

describe('createMemo', () => {
  it('test_createMemo_with_valid_data_returns_memo_with_all_fields', () => {
    const memo = localStore.createMemo(MEMO_DATA);

    expect(typeof memo.id).toBe('string');
    expect(memo.id).toHaveLength(36);
    expect(memo.stock_name).toBe('삼성전자');
    expect(memo.action).toBe('buy');
    expect(memo.price).toBe(70000);
    expect(memo.quantity).toBe(10);
    expect(memo.memo).toBe('52주 신저가 부근 분할 매수');
    expect(typeof memo.created_at).toBe('string');
    expect(typeof memo.updated_at).toBe('string');
    expect(new Date(memo.created_at).toISOString()).toBe(memo.created_at);
  });

  it('test_createMemo_when_report_exists_attaches_latest_report_mood_data', () => {
    // 두 리포트의 created_at이 구별되도록 시스템 시각을 1초 간격으로 조작
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    localStore.createReport({ ...REPORT_DATA, invest_mood: 'bearish', decision_mode: 'intuitive', mood_score: 40 });

    vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'));
    localStore.createReport({ ...REPORT_DATA, invest_mood: 'bullish', decision_mode: 'analytical', mood_score: 72 });
    vi.useRealTimers();

    const memo = localStore.createMemo(MEMO_DATA);

    // 가장 최근 리포트(두 번째)의 무드 데이터가 붙어야 함
    expect(memo.invest_mood).toBe('bullish');
    expect(memo.decision_mode).toBe('analytical');
    expect(memo.mood_score).toBe(72);
  });

  it('test_createMemo_when_no_reports_exist_mood_fields_are_undefined', () => {
    const memo = localStore.createMemo(MEMO_DATA);

    expect(memo.invest_mood).toBeUndefined();
    expect(memo.decision_mode).toBeUndefined();
    expect(memo.mood_score).toBeUndefined();
  });
});

// ── getMemo ───────────────────────────────────────────────────────────────────

describe('getMemo', () => {
  it('test_getMemo_with_existing_id_returns_stored_memo', () => {
    const created = localStore.createMemo(MEMO_DATA);
    const fetched = localStore.getMemo(created.id);

    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.stock_name).toBe('삼성전자');
  });

  it('test_getMemo_with_nonexistent_id_returns_undefined', () => {
    const result = localStore.getMemo('00000000-0000-0000-0000-000000000000');

    expect(result).toBeUndefined();
  });
});

// ── updateMemo ────────────────────────────────────────────────────────────────

describe('updateMemo', () => {
  it('test_updateMemo_with_existing_id_updates_specified_fields_and_updated_at', () => {
    const created = localStore.createMemo(MEMO_DATA);
    // updated_at이 달라지려면 최소 1ms 이상 지나야 하므로 인위적으로 과거 시각을 넣어둠
    const g = globalThis as unknown as Record<string, Map<string, Record<string, string>> | undefined>;
    const storedMemo = g.__dearant_memos!.get(created.id)!;
    storedMemo.updated_at = new Date(Date.now() - 1000).toISOString();
    storedMemo.created_at = storedMemo.updated_at;
    g.__dearant_memos.set(created.id, storedMemo);

    const updated = localStore.updateMemo(created.id, {
      stock_name: 'LG에너지솔루션',
      action: 'sell',
      memo: '목표가 도달 후 매도',
    });

    expect(updated).toBeDefined();
    expect(updated!.stock_name).toBe('LG에너지솔루션');
    expect(updated!.action).toBe('sell');
    expect(updated!.memo).toBe('목표가 도달 후 매도');
    // 변경하지 않은 필드는 유지
    expect(updated!.price).toBe(70000);
    expect(updated!.quantity).toBe(10);
    // updated_at은 갱신되어야 함
    expect(new Date(updated!.updated_at).getTime()).toBeGreaterThan(
      new Date(storedMemo.created_at).getTime()
    );
  });

  it('test_updateMemo_with_nonexistent_id_returns_undefined', () => {
    const result = localStore.updateMemo('00000000-0000-0000-0000-000000000000', {
      memo: '없는 메모',
    });

    expect(result).toBeUndefined();
  });
});

// ── deleteMemo ────────────────────────────────────────────────────────────────

describe('deleteMemo', () => {
  it('test_deleteMemo_with_existing_id_returns_true_and_removes_memo', () => {
    const memo = localStore.createMemo(MEMO_DATA);

    const result = localStore.deleteMemo(memo.id);

    expect(result).toBe(true);
    expect(localStore.getMemo(memo.id)).toBeUndefined();
  });

  it('test_deleteMemo_with_nonexistent_id_returns_false', () => {
    const result = localStore.deleteMemo('00000000-0000-0000-0000-000000000000');

    expect(result).toBe(false);
  });
});

// ── listMemos ─────────────────────────────────────────────────────────────────

describe('listMemos', () => {
  it('test_listMemos_with_multiple_memos_returns_descending_created_at_order', () => {
    localStore.createMemo({ ...MEMO_DATA, stock_name: '삼성전자' });
    localStore.createMemo({ ...MEMO_DATA, stock_name: 'SK하이닉스' });
    localStore.createMemo({ ...MEMO_DATA, stock_name: 'LG에너지솔루션' });

    const list = localStore.listMemos();

    for (let i = 0; i < list.length - 1; i++) {
      expect(new Date(list[i].created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(list[i + 1].created_at).getTime()
      );
    }
    expect(list).toHaveLength(3);
  });

  it('test_listMemos_with_more_than_50_memos_returns_max_50', () => {
    for (let i = 0; i < 55; i++) {
      localStore.createMemo({ ...MEMO_DATA, stock_name: `종목${i}` });
    }

    const list = localStore.listMemos();

    expect(list).toHaveLength(50);
  });
});
