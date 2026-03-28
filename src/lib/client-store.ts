// 브라우저 localStorage 기반 오프라인 저장소
// 서버 재시작, 탭 닫기에도 데이터 유지됨

const KEYS = {
  reports: 'dearant:reports',
  memos: 'dearant:memos',
  answers: 'dearant:answers',
} as const;

// ─── Types ───────────────────────────────────────────────

export interface StoredReport {
  id: string;
  session_id: string;
  decision_mode: string;
  mood_score: number;
  risk_tendency: string;
  invest_mood: string;
  biorhythm_physical: number;
  biorhythm_emotional: number;
  biorhythm_intellectual: number;
  today_keywords: string[];
  today_message: string;
  today_letter: string;
  created_at: string;
  sessions?: {
    mood: string;
    birth_date: string;
  };
}

export interface StoredMemo {
  id: string;
  stock_name: string;
  stock_code?: string;
  action: 'buy' | 'sell' | 'hold' | 'watch';
  price?: number;
  quantity?: number;
  memo?: string;
  invest_mood?: string;
  decision_mode?: string;
  mood_score?: number;
  trade_mood?: string;
  created_at: string;
  updated_at: string;
}

export interface StoredAnswer {
  session_id: string;
  question_key: string;
  answer_value: string;
  score: number;
}

// ─── Helpers ─────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getAll<T>(key: string): T[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setAll<T>(key: string, items: T[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('저장 공간이 부족합니다. 오래된 데이터를 삭제해 주세요.');
    }
    throw e;
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Reports ─────────────────────────────────────────────

export const clientStore = {
  createReport(data: {
    decision_mode: string;
    mood_score: number;
    risk_tendency: string;
    invest_mood: string;
    biorhythm_physical: number;
    biorhythm_emotional: number;
    biorhythm_intellectual: number;
    today_keywords: string[];
    today_message: string;
    today_letter: string;
    mood: string;
    birth_date: string;
  }): StoredReport {
    const id = generateId();
    const sessionId = generateId();
    const report: StoredReport = {
      id,
      session_id: sessionId,
      decision_mode: data.decision_mode,
      mood_score: data.mood_score,
      risk_tendency: data.risk_tendency,
      invest_mood: data.invest_mood,
      biorhythm_physical: data.biorhythm_physical,
      biorhythm_emotional: data.biorhythm_emotional,
      biorhythm_intellectual: data.biorhythm_intellectual,
      today_keywords: data.today_keywords,
      today_message: data.today_message,
      today_letter: data.today_letter,
      created_at: new Date().toISOString(),
      sessions: {
        mood: data.mood,
        birth_date: data.birth_date,
      },
    };
    const all = getAll<StoredReport>(KEYS.reports);
    all.unshift(report);
    setAll(KEYS.reports, all);
    return report;
  },

  getReport(id: string): StoredReport | undefined {
    return getAll<StoredReport>(KEYS.reports).find(r => r.id === id);
  },

  listReports(): StoredReport[] {
    return getAll<StoredReport>(KEYS.reports)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // ─── Answers ─────────────────────────────────────────

  saveAnswers(sessionId: string, answers: { questionKey: string; answerValue: string; score: number }[]): void {
    const all = getAll<StoredAnswer>(KEYS.answers);
    const newAnswers = answers.map(a => ({
      session_id: sessionId,
      question_key: a.questionKey,
      answer_value: a.answerValue,
      score: a.score,
    }));
    // 최근 100세션만 유지 (localStorage 용량 관리)
    const MAX_SESSIONS = 100;
    const combined = [...all, ...newAnswers];
    const uniqueSessions = [...new Set(combined.map(a => a.session_id))];
    if (uniqueSessions.length > MAX_SESSIONS) {
      const keepSessions = new Set(uniqueSessions.slice(-MAX_SESSIONS));
      setAll(KEYS.answers, combined.filter(a => keepSessions.has(a.session_id)));
    } else {
      setAll(KEYS.answers, combined);
    }
  },

  getAnswersBySession(sessionId: string): StoredAnswer[] {
    return getAll<StoredAnswer>(KEYS.answers).filter(a => a.session_id === sessionId);
  },

  // ─── Memos ───────────────────────────────────────────

  createMemo(data: {
    stock_name: string;
    stock_code?: string;
    action: 'buy' | 'sell' | 'hold' | 'watch';
    price?: number;
    quantity?: number;
    memo?: string;
    trade_mood?: string;
  }, customDate?: string): StoredMemo {
    const id = generateId();
    const reports = this.listReports();
    const latest = reports[0];
    const now = new Date().toISOString();
    const createdAt = customDate || now;

    const memo: StoredMemo = {
      id,
      ...data,
      invest_mood: latest?.invest_mood,
      decision_mode: latest?.decision_mode,
      mood_score: latest?.mood_score,
      created_at: createdAt,
      updated_at: now,
    };
    const all = getAll<StoredMemo>(KEYS.memos);
    all.unshift(memo);
    setAll(KEYS.memos, all);
    return memo;
  },

  getMemo(id: string): StoredMemo | undefined {
    return getAll<StoredMemo>(KEYS.memos).find(m => m.id === id);
  },

  updateMemo(id: string, data: Partial<Pick<StoredMemo, 'stock_name' | 'stock_code' | 'action' | 'price' | 'quantity' | 'memo'>>): StoredMemo | undefined {
    const all = getAll<StoredMemo>(KEYS.memos);
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...data, updated_at: new Date().toISOString() };
    setAll(KEYS.memos, all);
    return all[idx];
  },

  deleteMemo(id: string): boolean {
    const all = getAll<StoredMemo>(KEYS.memos);
    const filtered = all.filter(m => m.id !== id);
    if (filtered.length === all.length) return false;
    setAll(KEYS.memos, filtered);
    return true;
  },

  listMemos(): StoredMemo[] {
    return getAll<StoredMemo>(KEYS.memos)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
};
