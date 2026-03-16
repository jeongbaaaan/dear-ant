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

// globalThis로 HMR 시에도 데이터 유지
const globalReports = globalThis as unknown as { __dearant_reports?: Map<string, StoredReport> };
if (!globalReports.__dearant_reports) {
  globalReports.__dearant_reports = new Map();
}
const reports = globalReports.__dearant_reports;

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
};
