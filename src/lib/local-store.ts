// 로컬 인메모리 스토리지 (Supabase 미설정 시 fallback)
// 서버 재시작 시 데이터 초기화됨

interface StoredReport {
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

interface StoredMemo {
  id: string;
  stock_name: string;
  action: 'buy' | 'sell' | 'hold' | 'watch';
  price?: number;
  quantity?: number;
  memo: string;
  invest_mood?: string;
  decision_mode?: string;
  mood_score?: number;
  created_at: string;
  updated_at: string;
}

// globalThis로 HMR 시에도 데이터 유지
const globalReports = globalThis as unknown as {
  __dearant_reports?: Map<string, StoredReport>;
  __dearant_memos?: Map<string, StoredMemo>;
};
if (!globalReports.__dearant_reports) {
  globalReports.__dearant_reports = new Map();
}
if (!globalReports.__dearant_memos) {
  globalReports.__dearant_memos = new Map();
}
const reports = globalReports.__dearant_reports;
const memos = globalReports.__dearant_memos;

function generateId(): string {
  return crypto.randomUUID();
}

export const localStore = {
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
    const report: StoredReport = {
      id,
      session_id: generateId(),
      ...data,
      created_at: new Date().toISOString(),
      sessions: {
        mood: data.mood,
        birth_date: data.birth_date,
      },
    };
    reports.set(id, report);
    return report;
  },

  getReport(id: string): StoredReport | undefined {
    return reports.get(id);
  },

  listReports(): StoredReport[] {
    return Array.from(reports.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20);
  },

  // 메모 CRUD
  createMemo(data: {
    stock_name: string;
    action: 'buy' | 'sell' | 'hold' | 'watch';
    price?: number;
    quantity?: number;
    memo: string;
  }): StoredMemo {
    const id = generateId();
    // 최근 리포트에서 투자 무드 정보 가져오기
    const latestReport = Array.from(reports.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    const now = new Date().toISOString();
    const memo: StoredMemo = {
      id,
      ...data,
      invest_mood: latestReport?.invest_mood,
      decision_mode: latestReport?.decision_mode,
      mood_score: latestReport?.mood_score,
      created_at: now,
      updated_at: now,
    };
    memos.set(id, memo);
    return memo;
  },

  getMemo(id: string): StoredMemo | undefined {
    return memos.get(id);
  },

  updateMemo(id: string, data: Partial<Pick<StoredMemo, 'stock_name' | 'action' | 'price' | 'quantity' | 'memo'>>): StoredMemo | undefined {
    const existing = memos.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
    memos.set(id, updated);
    return updated;
  },

  deleteMemo(id: string): boolean {
    return memos.delete(id);
  },

  listMemos(): StoredMemo[] {
    return Array.from(memos.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 50);
  },
};
