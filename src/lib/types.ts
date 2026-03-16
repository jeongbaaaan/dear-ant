export type Mood = '불안' | '설렘' | '평온' | '초조' | '자신감';

export interface UserInfo {
  birthDate: string;
  mood: Mood;
}

export interface Question {
  key: string;
  text: string;
  options: {
    label: string;
    value: string;
    score: number;
  }[];
}

export interface Answer {
  questionKey: string;
  answerValue: string;
  score: number;
}

export interface SurveyData {
  userInfo: UserInfo;
  answers: Answer[];
}

export type DecisionMode = '방어' | '관망' | '신중' | '적극';
export type RiskTendency = '낮음' | '중간' | '높음';
export type InvestMood = 'A' | 'B' | 'C' | 'D' | 'F';

export interface Report {
  id: string;
  decisionMode: DecisionMode;
  moodScore: number;
  riskTendency: RiskTendency;
  investMood: InvestMood;
  biorhythmPhysical: number;
  biorhythmEmotional: number;
  biorhythmIntellectual: number;
  todayKeywords: string[];
  todayMessage: string;
  todayLetter: string;
  createdAt: string;
}

export interface Session {
  id: string;
  birthDate: string;
  mood: Mood;
  createdAt: string;
}
