import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as postReport } from '@/app/api/reports/route';
import { GET as getReportById } from '@/app/api/reports/[id]/route';
import { GET as getHistory } from '@/app/api/history/route';
import {
  POST as postMemo,
  GET as getMemos,
} from '@/app/api/memos/route';
import {
  PATCH as patchMemo,
  DELETE as deleteMemo,
} from '@/app/api/memos/[id]/route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(url: string, method: string, body?: unknown): NextRequest {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  return new NextRequest(new Request(url, init));
}

function dynamicParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

/** Minimal valid survey payload that passes all validations. */
const VALID_SURVEY = {
  userInfo: {
    birthDate: '1990-05-15',
    mood: '평온',
  },
  answers: [
    { questionKey: 'q1', answerValue: 'a', score: 60 },
    { questionKey: 'q2', answerValue: 'b', score: 70 },
    { questionKey: 'q3', answerValue: 'c', score: 50 },
  ],
};

// ---------------------------------------------------------------------------
// Store reset between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  const g = globalThis as unknown as Record<string, Map<string, unknown> | undefined>;
  g.__dearant_reports?.clear();
  g.__dearant_memos?.clear();
});

// ---------------------------------------------------------------------------
// POST /api/reports
// ---------------------------------------------------------------------------

describe('POST /api/reports', () => {
  it('test_post_reports_with_valid_survey_returns_200_and_report_object', async () => {
    const req = makeRequest('http://localhost/api/reports', 'POST', VALID_SURVEY);
    const res = await postReport(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('report');
    expect(data.report).toHaveProperty('id');
    expect(typeof data.report.id).toBe('string');
    expect(data.report.id.length).toBeGreaterThan(0);
    expect(data.report).toHaveProperty('decision_mode');
    expect(data.report).toHaveProperty('mood_score');
    expect(data.report).toHaveProperty('risk_tendency');
    expect(data.report).toHaveProperty('invest_mood');
    expect(Array.isArray(data.report.today_keywords)).toBe(true);
  });

  it('test_post_reports_with_missing_fields_returns_400', async () => {
    const payload = { userInfo: { mood: '평온' } }; // birthDate and answers both missing
    const req = makeRequest('http://localhost/api/reports', 'POST', payload);
    const res = await postReport(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
    expect(data.error.length).toBeGreaterThan(0);
  });

  it('test_post_reports_with_invalid_birthdate_format_returns_400', async () => {
    const payload = {
      ...VALID_SURVEY,
      userInfo: { birthDate: '19900515', mood: '평온' }, // no hyphens
    };
    const req = makeRequest('http://localhost/api/reports', 'POST', payload);
    const res = await postReport(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('생년월일 형식이 잘못되었습니다.');
  });

  it('test_post_reports_with_invalid_mood_returns_400', async () => {
    const payload = {
      ...VALID_SURVEY,
      userInfo: { birthDate: '1990-05-15', mood: '행복' }, // not in VALID_MOODS
    };
    const req = makeRequest('http://localhost/api/reports', 'POST', payload);
    const res = await postReport(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('유효하지 않은 감정 값입니다.');
  });
});

// ---------------------------------------------------------------------------
// GET /api/reports/[id]
// ---------------------------------------------------------------------------

describe('GET /api/reports/[id]', () => {
  it('test_get_report_by_valid_id_returns_200_and_report', async () => {
    // First create a report to obtain a real ID
    const createRes = await postReport(
      makeRequest('http://localhost/api/reports', 'POST', VALID_SURVEY),
    );
    const { report: created } = await createRes.json();

    const req = makeRequest(`http://localhost/api/reports/${created.id}`, 'GET');
    const res = await getReportById(req, dynamicParams(created.id));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('report');
    expect(data.report.id).toBe(created.id);
    expect(data.report.decision_mode).toBe(created.decision_mode);
  });

  it('test_get_report_by_nonexistent_id_returns_404', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const req = makeRequest(`http://localhost/api/reports/${nonExistentId}`, 'GET');
    const res = await getReportById(req, dynamicParams(nonExistentId));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('리포트를 찾을 수 없습니다.');
  });
});

// ---------------------------------------------------------------------------
// GET /api/history
// ---------------------------------------------------------------------------

describe('GET /api/history', () => {
  it('test_get_history_returns_200_and_reports_array', async () => {
    // Seed two reports
    await postReport(makeRequest('http://localhost/api/reports', 'POST', VALID_SURVEY));
    await postReport(makeRequest('http://localhost/api/reports', 'POST', VALID_SURVEY));

    const res = await getHistory();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('reports');
    expect(Array.isArray(data.reports)).toBe(true);
    expect(data.reports.length).toBe(2);
  });

  it('test_get_history_returns_empty_array_when_no_reports_exist', async () => {
    const res = await getHistory();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data.reports)).toBe(true);
    expect(data.reports.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// POST /api/memos
// ---------------------------------------------------------------------------

describe('POST /api/memos', () => {
  it('test_post_memos_with_valid_data_returns_200_and_memo', async () => {
    const payload = {
      stock_name: '삼성전자',
      action: 'buy',
      price: 75000,
      quantity: 10,
      memo: '장기 보유 목적 매수',
    };
    const req = makeRequest('http://localhost/api/memos', 'POST', payload);
    const res = await postMemo(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('memo');
    expect(data.memo).toHaveProperty('id');
    expect(typeof data.memo.id).toBe('string');
    expect(data.memo.stock_name).toBe('삼성전자');
    expect(data.memo.action).toBe('buy');
    expect(data.memo.price).toBe(75000);
    expect(data.memo.quantity).toBe(10);
    expect(data.memo.memo).toBe('장기 보유 목적 매수');
  });

  it('test_post_memos_with_missing_stock_name_returns_400', async () => {
    const payload = { action: 'buy', memo: '메모 내용' }; // stock_name omitted
    const req = makeRequest('http://localhost/api/memos', 'POST', payload);
    const res = await postMemo(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('종목명과 메모는 필수입니다.');
  });

  it('test_post_memos_with_missing_memo_field_returns_400', async () => {
    const payload = { stock_name: '삼성전자', action: 'buy' }; // memo omitted
    const req = makeRequest('http://localhost/api/memos', 'POST', payload);
    const res = await postMemo(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('종목명과 메모는 필수입니다.');
  });
});

// ---------------------------------------------------------------------------
// GET /api/memos
// ---------------------------------------------------------------------------

describe('GET /api/memos', () => {
  it('test_get_memos_returns_200_and_memos_array', async () => {
    // Seed two memos
    await postMemo(makeRequest('http://localhost/api/memos', 'POST', { stock_name: 'AAPL', memo: '관찰 중' }));
    await postMemo(makeRequest('http://localhost/api/memos', 'POST', { stock_name: 'TSLA', memo: '매수 검토' }));

    const res = await getMemos();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('memos');
    expect(Array.isArray(data.memos)).toBe(true);
    expect(data.memos.length).toBe(2);
  });

  it('test_get_memos_returns_empty_array_when_no_memos_exist', async () => {
    const res = await getMemos();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data.memos)).toBe(true);
    expect(data.memos.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/memos/[id]
// ---------------------------------------------------------------------------

describe('PATCH /api/memos/[id]', () => {
  it('test_patch_memo_with_valid_data_returns_200_and_updated_memo', async () => {
    // Create a memo first
    const createRes = await postMemo(
      makeRequest('http://localhost/api/memos', 'POST', {
        stock_name: '카카오',
        action: 'watch',
        memo: '초기 메모',
      }),
    );
    const { memo: created } = await createRes.json();

    const patchPayload = { memo: '수정된 메모', action: 'buy' };
    const req = makeRequest(`http://localhost/api/memos/${created.id}`, 'PATCH', patchPayload);
    const res = await patchMemo(req, dynamicParams(created.id));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('memo');
    expect(data.memo.id).toBe(created.id);
    expect(data.memo.memo).toBe('수정된 메모');
    expect(data.memo.action).toBe('buy');
    // updated_at must differ from created_at (or at worst equal, but must be a valid ISO string)
    expect(typeof data.memo.updated_at).toBe('string');
    expect(data.memo.updated_at.length).toBeGreaterThan(0);
  });

  it('test_patch_memo_with_nonexistent_id_returns_404', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const req = makeRequest(
      `http://localhost/api/memos/${nonExistentId}`,
      'PATCH',
      { memo: '없는 메모 수정' },
    );
    const res = await patchMemo(req, dynamicParams(nonExistentId));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('메모를 찾을 수 없습니다.');
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/memos/[id]
// ---------------------------------------------------------------------------

describe('DELETE /api/memos/[id]', () => {
  it('test_delete_memo_with_valid_id_returns_200_and_success_true', async () => {
    // Create a memo to delete
    const createRes = await postMemo(
      makeRequest('http://localhost/api/memos', 'POST', {
        stock_name: 'NAVER',
        memo: '삭제 대상',
      }),
    );
    const { memo: created } = await createRes.json();

    const req = makeRequest(`http://localhost/api/memos/${created.id}`, 'DELETE');
    const res = await deleteMemo(req, dynamicParams(created.id));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);

    // Confirm it is actually gone from the store
    const listRes = await getMemos();
    const listData = await listRes.json();
    const ids = listData.memos.map((m: { id: string }) => m.id);
    expect(ids).not.toContain(created.id);
  });

  it('test_delete_memo_with_nonexistent_id_returns_404', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const req = makeRequest(`http://localhost/api/memos/${nonExistentId}`, 'DELETE');
    const res = await deleteMemo(req, dynamicParams(nonExistentId));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('메모를 찾을 수 없습니다.');
  });
});
