/**
 * Unit tests for src/lib/client-store.ts
 *
 * client-store.ts uses localStorage (browser API). vitest runs in jsdom, which
 * provides a real localStorage implementation. Each test suite resets
 * localStorage.clear() in beforeEach so tests are fully isolated.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clientStore } from '../client-store';

// ── fixtures ──────────────────────────────────────────────────────────────────

const REPORT_DATA = {
  decision_mode: 'analytical',
  mood_score: 72,
  risk_tendency: 'moderate',
  invest_mood: 'A',
  biorhythm_physical: 0.85,
  biorhythm_emotional: 0.60,
  biorhythm_intellectual: 0.90,
  today_keywords: ['집중', '안정'],
  today_message: '오늘은 집중력이 높은 날입니다.',
  today_letter: '오늘 하루도 잘 해낼 수 있습니다.',
  mood: '평온',
  birth_date: '1990-01-01',
};

const MEMO_DATA = {
  stock_name: '삼성전자',
  action: 'buy' as const,
  price: 70_000,
  quantity: 10,
  memo: '52주 신저가 부근 분할 매수',
};

// ── setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ─── createReport ─────────────────────────────────────────────────────────────

describe('createReport', () => {
  it('test_createReport_with_valid_data_returns_report_with_all_required_fields', () => {
    const report = clientStore.createReport(REPORT_DATA);

    expect(typeof report.id).toBe('string');
    expect(report.id).toHaveLength(36); // UUID v4
    expect(typeof report.session_id).toBe('string');
    expect(report.session_id).toHaveLength(36);
    expect(report.decision_mode).toBe('analytical');
    expect(report.mood_score).toBe(72);
    expect(report.risk_tendency).toBe('moderate');
    expect(report.invest_mood).toBe('A');
    expect(report.biorhythm_physical).toBe(0.85);
    expect(report.biorhythm_emotional).toBe(0.60);
    expect(report.biorhythm_intellectual).toBe(0.90);
    expect(report.today_keywords).toEqual(['집중', '안정']);
    expect(report.today_message).toBe('오늘은 집중력이 높은 날입니다.');
    expect(report.today_letter).toBe('오늘 하루도 잘 해낼 수 있습니다.');
    expect(new Date(report.created_at).toISOString()).toBe(report.created_at);
  });

  it('test_createReport_populates_sessions_object_with_mood_and_birth_date', () => {
    const report = clientStore.createReport(REPORT_DATA);

    expect(report.sessions).toBeDefined();
    expect(report.sessions!.mood).toBe('평온');
    expect(report.sessions!.birth_date).toBe('1990-01-01');
  });

  it('test_createReport_twice_generates_different_ids_and_session_ids', () => {
    const first = clientStore.createReport(REPORT_DATA);
    const second = clientStore.createReport(REPORT_DATA);

    expect(first.id).not.toBe(second.id);
    expect(first.session_id).not.toBe(second.session_id);
  });

  it('test_createReport_persists_to_localStorage_under_correct_key', () => {
    const report = clientStore.createReport(REPORT_DATA);

    const raw = localStorage.getItem('dearant:reports');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].id).toBe(report.id);
  });

  it('test_createReport_new_report_is_prepended_at_index_0', () => {
    clientStore.createReport({ ...REPORT_DATA, mood_score: 50 });
    const second = clientStore.createReport({ ...REPORT_DATA, mood_score: 80 });

    const raw = JSON.parse(localStorage.getItem('dearant:reports')!);
    expect(raw[0].id).toBe(second.id);
    expect(raw[0].mood_score).toBe(80);
  });
});

// ─── getReport ────────────────────────────────────────────────────────────────

describe('getReport', () => {
  it('test_getReport_with_existing_id_returns_correct_report', () => {
    const created = clientStore.createReport(REPORT_DATA);

    const fetched = clientStore.getReport(created.id);

    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.mood_score).toBe(72);
    expect(fetched!.invest_mood).toBe('A');
  });

  it('test_getReport_with_nonexistent_id_returns_undefined', () => {
    const result = clientStore.getReport('00000000-0000-0000-0000-000000000000');

    expect(result).toBeUndefined();
  });

  it('test_getReport_survives_a_fresh_module_read_from_localStorage', () => {
    // Simulate a page reload: create, then re-read directly from localStorage
    const created = clientStore.createReport(REPORT_DATA);
    // Read back via the store (which itself reads localStorage)
    const fetched = clientStore.getReport(created.id);

    expect(fetched!.decision_mode).toBe('analytical');
    expect(fetched!.today_keywords).toEqual(['집중', '안정']);
  });
});

// ─── listReports ──────────────────────────────────────────────────────────────

describe('listReports', () => {
  it('test_listReports_empty_store_returns_empty_array', () => {
    const list = clientStore.listReports();

    expect(list).toEqual([]);
  });

  it('test_listReports_returns_reports_in_descending_created_at_order', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
    clientStore.createReport({ ...REPORT_DATA, mood_score: 50 });

    vi.setSystemTime(new Date('2024-01-02T10:00:00.000Z'));
    clientStore.createReport({ ...REPORT_DATA, mood_score: 80 });

    vi.useRealTimers();

    const list = clientStore.listReports();

    expect(list).toHaveLength(2);
    expect(list[0].mood_score).toBe(80);
    expect(list[1].mood_score).toBe(50);
    expect(
      new Date(list[0].created_at).getTime()
    ).toBeGreaterThan(
      new Date(list[1].created_at).getTime()
    );
  });

  it('test_listReports_corrupted_localStorage_returns_empty_array_gracefully', () => {
    localStorage.setItem('dearant:reports', 'NOT VALID JSON{{{{');

    const list = clientStore.listReports();

    expect(list).toEqual([]);
  });
});

// ─── saveAnswers / getAnswersBySession ────────────────────────────────────────

describe('saveAnswers', () => {
  it('test_saveAnswers_stores_answers_keyed_by_session_id', () => {
    const sessionId = 'session-abc-123';
    const answers = [
      { questionKey: 'q1', answerValue: 'a', score: 60 },
      { questionKey: 'q2', answerValue: 'b', score: 70 },
    ];

    clientStore.saveAnswers(sessionId, answers);

    const stored = clientStore.getAnswersBySession(sessionId);
    expect(stored).toHaveLength(2);
    expect(stored[0].session_id).toBe(sessionId);
    expect(stored[0].question_key).toBe('q1');
    expect(stored[0].answer_value).toBe('a');
    expect(stored[0].score).toBe(60);
    expect(stored[1].question_key).toBe('q2');
  });

  it('test_getAnswersBySession_different_session_returns_empty_array', () => {
    clientStore.saveAnswers('session-A', [{ questionKey: 'q1', answerValue: 'x', score: 55 }]);

    const result = clientStore.getAnswersBySession('session-B');

    expect(result).toHaveLength(0);
  });

  it('test_saveAnswers_multiple_sessions_are_stored_and_isolated', () => {
    clientStore.saveAnswers('session-A', [{ questionKey: 'q1', answerValue: 'a', score: 60 }]);
    clientStore.saveAnswers('session-B', [{ questionKey: 'q1', answerValue: 'b', score: 70 }]);

    const a = clientStore.getAnswersBySession('session-A');
    const b = clientStore.getAnswersBySession('session-B');

    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    expect(a[0].answer_value).toBe('a');
    expect(b[0].answer_value).toBe('b');
  });
});

// ─── createMemo ───────────────────────────────────────────────────────────────

describe('createMemo', () => {
  it('test_createMemo_with_valid_data_returns_memo_with_all_required_fields', () => {
    const memo = clientStore.createMemo(MEMO_DATA);

    expect(typeof memo.id).toBe('string');
    expect(memo.id).toHaveLength(36);
    expect(memo.stock_name).toBe('삼성전자');
    expect(memo.action).toBe('buy');
    expect(memo.price).toBe(70_000);
    expect(memo.quantity).toBe(10);
    expect(memo.memo).toBe('52주 신저가 부근 분할 매수');
    expect(new Date(memo.created_at).toISOString()).toBe(memo.created_at);
    expect(new Date(memo.updated_at).toISOString()).toBe(memo.updated_at);
  });

  it('test_createMemo_when_report_exists_attaches_latest_report_mood_data', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    clientStore.createReport({ ...REPORT_DATA, invest_mood: 'D', decision_mode: 'intuitive', mood_score: 40 });

    vi.setSystemTime(new Date('2024-01-02T00:00:00.000Z'));
    clientStore.createReport({ ...REPORT_DATA, invest_mood: 'A', decision_mode: 'analytical', mood_score: 72 });

    vi.useRealTimers();

    const memo = clientStore.createMemo(MEMO_DATA);

    // Must attach from the latest (second) report
    expect(memo.invest_mood).toBe('A');
    expect(memo.decision_mode).toBe('analytical');
    expect(memo.mood_score).toBe(72);
  });

  it('test_createMemo_when_no_reports_exist_mood_fields_are_undefined', () => {
    const memo = clientStore.createMemo(MEMO_DATA);

    expect(memo.invest_mood).toBeUndefined();
    expect(memo.decision_mode).toBeUndefined();
    expect(memo.mood_score).toBeUndefined();
  });

  it('test_createMemo_with_custom_date_uses_that_date_as_created_at', () => {
    const customDate = '2024-06-15T09:00:00.000Z';

    const memo = clientStore.createMemo(MEMO_DATA, customDate);

    expect(memo.created_at).toBe(customDate);
  });

  it('test_createMemo_persists_to_localStorage_under_correct_key', () => {
    const memo = clientStore.createMemo(MEMO_DATA);

    const raw = localStorage.getItem('dearant:memos');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed[0].id).toBe(memo.id);
  });

  it('test_createMemo_optional_fields_stock_code_can_be_omitted', () => {
    const memo = clientStore.createMemo({ stock_name: 'NAVER', action: 'watch' });

    expect(memo.stock_name).toBe('NAVER');
    expect(memo.action).toBe('watch');
    expect(memo.stock_code).toBeUndefined();
    expect(memo.price).toBeUndefined();
    expect(memo.quantity).toBeUndefined();
  });
});

// ─── getMemo ──────────────────────────────────────────────────────────────────

describe('getMemo', () => {
  it('test_getMemo_with_existing_id_returns_the_correct_memo', () => {
    const created = clientStore.createMemo(MEMO_DATA);

    const fetched = clientStore.getMemo(created.id);

    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.stock_name).toBe('삼성전자');
    expect(fetched!.price).toBe(70_000);
  });

  it('test_getMemo_with_nonexistent_id_returns_undefined', () => {
    const result = clientStore.getMemo('00000000-0000-0000-0000-000000000000');

    expect(result).toBeUndefined();
  });
});

// ─── updateMemo ───────────────────────────────────────────────────────────────

describe('updateMemo', () => {
  it('test_updateMemo_updates_specified_fields_and_refreshes_updated_at', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
    const created = clientStore.createMemo(MEMO_DATA);

    vi.setSystemTime(new Date('2024-01-01T11:00:00.000Z'));
    const updated = clientStore.updateMemo(created.id, {
      stock_name: 'LG에너지솔루션',
      action: 'sell',
      memo: '목표가 도달 후 매도',
    });
    vi.useRealTimers();

    expect(updated).toBeDefined();
    expect(updated!.stock_name).toBe('LG에너지솔루션');
    expect(updated!.action).toBe('sell');
    expect(updated!.memo).toBe('목표가 도달 후 매도');
    // Untouched fields must be preserved
    expect(updated!.price).toBe(70_000);
    expect(updated!.quantity).toBe(10);
    // updated_at must be newer than created_at
    expect(new Date(updated!.updated_at).getTime()).toBeGreaterThan(
      new Date(created.created_at).getTime()
    );
  });

  it('test_updateMemo_persists_changes_to_localStorage', () => {
    const created = clientStore.createMemo(MEMO_DATA);
    clientStore.updateMemo(created.id, { price: 99_000 });

    const fetched = clientStore.getMemo(created.id);
    expect(fetched!.price).toBe(99_000);
  });

  it('test_updateMemo_with_nonexistent_id_returns_undefined', () => {
    const result = clientStore.updateMemo('00000000-0000-0000-0000-000000000000', { memo: '없는 메모' });

    expect(result).toBeUndefined();
  });
});

// ─── deleteMemo ───────────────────────────────────────────────────────────────

describe('deleteMemo', () => {
  it('test_deleteMemo_with_existing_id_returns_true_and_removes_from_store', () => {
    const memo = clientStore.createMemo(MEMO_DATA);

    const result = clientStore.deleteMemo(memo.id);

    expect(result).toBe(true);
    expect(clientStore.getMemo(memo.id)).toBeUndefined();
  });

  it('test_deleteMemo_removes_entry_from_localStorage', () => {
    const memo = clientStore.createMemo(MEMO_DATA);
    clientStore.deleteMemo(memo.id);

    const raw = JSON.parse(localStorage.getItem('dearant:memos') ?? '[]');
    const ids = raw.map((m: { id: string }) => m.id);
    expect(ids).not.toContain(memo.id);
  });

  it('test_deleteMemo_with_nonexistent_id_returns_false', () => {
    const result = clientStore.deleteMemo('00000000-0000-0000-0000-000000000000');

    expect(result).toBe(false);
  });

  it('test_deleteMemo_only_removes_the_targeted_memo', () => {
    const first = clientStore.createMemo({ ...MEMO_DATA, stock_name: '삼성전자' });
    const second = clientStore.createMemo({ ...MEMO_DATA, stock_name: 'SK하이닉스' });

    clientStore.deleteMemo(first.id);

    expect(clientStore.getMemo(first.id)).toBeUndefined();
    expect(clientStore.getMemo(second.id)).toBeDefined();
  });
});

// ─── listMemos ────────────────────────────────────────────────────────────────

describe('listMemos', () => {
  it('test_listMemos_empty_store_returns_empty_array', () => {
    const list = clientStore.listMemos();

    expect(list).toEqual([]);
  });

  it('test_listMemos_returns_memos_in_descending_created_at_order', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
    clientStore.createMemo({ ...MEMO_DATA, stock_name: '삼성전자' });

    vi.setSystemTime(new Date('2024-01-02T10:00:00.000Z'));
    clientStore.createMemo({ ...MEMO_DATA, stock_name: 'SK하이닉스' });

    vi.useRealTimers();

    const list = clientStore.listMemos();

    expect(list).toHaveLength(2);
    expect(list[0].stock_name).toBe('SK하이닉스');
    expect(list[1].stock_name).toBe('삼성전자');
  });

  it('test_listMemos_corrupted_localStorage_returns_empty_array_gracefully', () => {
    localStorage.setItem('dearant:memos', '}{broken}');

    const list = clientStore.listMemos();

    expect(list).toEqual([]);
  });
});

// ─── localStorage isolation between store namespaces ─────────────────────────

describe('storage namespace isolation', () => {
  it('test_report_and_memo_operations_do_not_cross_contaminate_keys', () => {
    clientStore.createReport(REPORT_DATA);
    clientStore.createMemo(MEMO_DATA);

    const reportRaw = JSON.parse(localStorage.getItem('dearant:reports')!);
    const memoRaw = JSON.parse(localStorage.getItem('dearant:memos')!);

    expect(reportRaw).toHaveLength(1);
    expect(memoRaw).toHaveLength(1);
    // Reports key must not contain memo shape
    expect(reportRaw[0]).not.toHaveProperty('stock_name');
    // Memos key must not contain report shape
    expect(memoRaw[0]).not.toHaveProperty('today_keywords');
  });
});
