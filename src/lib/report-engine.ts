import { Answer, DecisionMode, InvestMood, Mood, Report, RiskTendency, SurveyData } from './types';

function calculateTotalScore(answers: Answer[]): number {
  if (answers.length === 0) return 50;
  const total = answers.reduce((sum, a) => sum + a.score, 0);
  return Math.round(total / answers.length);
}

function getDecisionMode(score: number): DecisionMode {
  if (score <= 25) return '방어';
  if (score <= 50) return '관망';
  if (score <= 75) return '신중';
  return '적극';
}

function getRiskTendency(score: number): RiskTendency {
  if (score <= 35) return '낮음';
  if (score <= 65) return '중간';
  return '높음';
}

function getInvestMood(totalScore: number, moodScore: number): InvestMood {
  const combined = totalScore * 0.4 + (100 - moodScore) * 0.6;
  if (combined >= 75) return 'A';
  if (combined >= 60) return 'B';
  if (combined >= 45) return 'C';
  if (combined >= 30) return 'D';
  return 'F';
}

function calculateBiorhythm(birthDate: string): { physical: number; emotional: number; intellectual: number } {
  const birth = new Date(birthDate);
  const today = new Date();
  const daysSinceBirth = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  const physical = Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / 23) * 100);
  const emotional = Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / 28) * 100);
  const intellectual = Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / 33) * 100);

  return { physical, emotional, intellectual };
}

const moodWeights: Record<Mood, number> = {
  '불안': 25,
  '초조': 20,
  '평온': 0,
  '설렘': 10,
  '자신감': 15,
};

function calculateMoodScore(mood: Mood, answers: Answer[]): number {
  const baseScore = moodWeights[mood] || 0;
  const scores = answers.map((a) => a.score);
  if (scores.length < 2) return Math.min(baseScore + 30, 100);

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const inconsistency = Math.min(Math.round(Math.sqrt(variance)), 40);

  return Math.min(baseScore + inconsistency + 20, 100);
}

const keywordPool: Record<DecisionMode, Record<Mood, string[]>> = {
  '방어': {
    '불안': ['현금 확보', '리스크 최소화', '관찰'],
    '초조': ['포지션 축소', '손절 원칙', '냉정'],
    '평온': ['포트폴리오 점검', '안정 자산', '장기 관점'],
    '설렘': ['분석 우선', '기대 관리', '기다림'],
    '자신감': ['원칙 수호', '분산 투자', '절제'],
  },
  '관망': {
    '불안': ['관찰 모드', '정보 수집', '대기'],
    '초조': ['시장 관찰', '매매 자제', '호흡'],
    '평온': ['기회 탐색', '데이터 분석', '준비'],
    '설렘': ['냉정한 시선', '팩트 체크', '리서치'],
    '자신감': ['타이밍 포착', '전략 수립', '인내'],
  },
  '신중': {
    '불안': ['소량 진입', '분할 매수', '리스크 관리'],
    '초조': ['계획 준수', '감정 분리', '원칙 투자'],
    '평온': ['균형 투자', '섹터 분석', '적정 비중'],
    '설렘': ['검증 후 행동', '펀더멘탈', '비교 분석'],
    '자신감': ['확신 있는 진입', '목표가 설정', '수익 관리'],
  },
  '적극': {
    '불안': ['과감한 진입 주의', '소규모 테스트', '감정 체크'],
    '초조': ['거래 횟수 제한', '원칙 매매', '자기 통제'],
    '평온': ['기회 포착', '모멘텀', '트렌드 추종'],
    '설렘': ['FOMO 경계', '원칙 점검', '분할 접근'],
    '자신감': ['적극 매수', '비중 확대', '수익 극대화'],
  },
};

const todayMessages: Record<DecisionMode, string[]> = {
  '방어': [
    '오늘은 지키는 것이 이기는 것입니다.',
    '시장의 소음에 흔들리지 마세요. 당신의 원칙이 가장 강한 방패입니다.',
    '때로는 아무것도 하지 않는 것이 최선의 전략입니다.',
  ],
  '관망': [
    '오늘은 확신보다 관찰이 유리한 날입니다.',
    '한 발 물러서서 전체 그림을 보세요. 기회는 기다리는 사람에게 옵니다.',
    '조급함을 내려놓으면, 더 선명한 판단이 보입니다.',
  ],
  '신중': [
    '오늘은 균형 잡힌 시선으로 시장을 바라볼 수 있는 날입니다.',
    '데이터와 직관 사이에서 균형을 찾아보세요.',
    '신중함은 느린 것이 아니라, 정확한 것입니다.',
  ],
  '적극': [
    '오늘은 당신의 판단력이 빛나는 날일 수 있습니다. 다만, 확인을 한 번 더.',
    '자신감은 좋지만, 과신은 위험합니다. 한 번 더 점검해보세요.',
    '적극적인 판단이 필요할 때입니다. 하지만 리스크 관리를 잊지 마세요.',
  ],
};

const moodLetters: Record<Mood, Record<DecisionMode, string>> = {
  '불안': {
    '방어': 'Dear,ANT\n\n불안한 마음이 느껴집니다. 오늘은 무리하지 마세요. 시장은 내일도 열립니다. 불안할 때 내린 결정은 대부분 후회로 이어집니다. 깊은 숨을 쉬고, 당신의 원칙을 떠올려보세요.',
    '관망': 'Dear,ANT\n\n불안함 속에서도 관망하려는 자세는 현명합니다. 감정이 가라앉을 때까지 기다려보세요. 시장의 파도가 잔잔해지면, 더 좋은 기회가 보일 거예요.',
    '신중': 'Dear,ANT\n\n불안하지만 신중하게 접근하려는 마음이 보입니다. 오늘은 새로운 진입보다 기존 포지션을 점검하는 날로 삼아보세요.',
    '적극': 'Dear,ANT\n\n불안한 감정과 적극적인 성향이 충돌하고 있습니다. 이럴 때 충동적 결정이 나올 수 있어요. 매매 버튼을 누르기 전, 3분만 기다려보세요.',
  },
  '초조': {
    '방어': 'Dear,ANT\n\n초조함이 느껴지는 하루네요. 오늘은 화면을 잠시 닫고 쉬어가세요. 보수적인 판단은 초조한 날 가장 빛나는 전략입니다.',
    '관망': 'Dear,ANT\n\n초조함 속에서도 관망을 선택한 당신은 이미 반은 이긴 겁니다. 시장을 지켜보되, 손은 주머니에 넣어두세요.',
    '신중': 'Dear,ANT\n\n초조할 때 신중함을 유지하는 건 쉽지 않습니다. 하지만 당신의 투자 원칙을 지키면, 오늘도 괜찮은 하루가 될 거예요.',
    '적극': 'Dear,ANT\n\n초조함과 적극적 성향이 만나면 과매매의 위험이 있습니다. 오늘 계획했던 거래 횟수를 절반으로 줄여보세요.',
  },
  '평온': {
    '방어': 'Dear,ANT\n\n평온한 마음으로 하루를 시작하셨군요. 이런 날은 방어적 전략이 더욱 단단해집니다. 여유로운 마음으로 포트폴리오를 점검해보세요.',
    '관망': 'Dear,ANT\n\n평온한 마음과 관망의 자세. 완벽한 조합입니다. 오늘은 시장을 관찰하며 다음 기회를 준비하는 날로 삼아보세요.',
    '신중': 'Dear,ANT\n\n평온한 상태에서의 신중한 판단은 가장 정확합니다. 오늘 내린 결정은 좋은 결과로 이어질 가능성이 높습니다.',
    '적극': 'Dear,ANT\n\n평온한 마음에서 나오는 적극성은 건강한 자신감입니다. 다만, 한 번에 모든 것을 걸지는 마세요. 분할 접근이 현명합니다.',
  },
  '설렘': {
    '방어': 'Dear,ANT\n\n설레는 마음이 느껴지네요! 하지만 설렘은 때로 판단을 흐리게 합니다. 오늘은 보수적으로 접근하되, 그 설렘의 원인을 분석해보세요.',
    '관망': 'Dear,ANT\n\n설렘 속에서도 관망하는 자세를 유지하세요. 기대감이 높을수록 실망도 클 수 있습니다. 차분하게 데이터를 확인해보세요.',
    '신중': 'Dear,ANT\n\n설렘과 신중함이 잘 균형을 이루고 있네요. 오늘은 관심 종목을 리서치하되, 매수는 한 박자 쉬어가도 좋겠습니다.',
    '적극': 'Dear,ANT\n\n설렘과 적극성이 만나면 FOMO가 될 수 있습니다. 흥분될수록 원칙을 점검하세요. 진짜 기회는 도망가지 않습니다.',
  },
  '자신감': {
    '방어': 'Dear,ANT\n\n자신감이 넘치는 하루! 하지만 방어적 성향이 당신을 지켜줄 거예요. 자신감 있을 때 세운 원칙이 가장 튼튼합니다.',
    '관망': 'Dear,ANT\n\n자신감과 관망의 조합은 노련한 투자자의 모습입니다. 오늘은 진입 타이밍을 재는 날로 활용해보세요.',
    '신중': 'Dear,ANT\n\n자신감 있는 상태에서의 신중한 접근은 최상의 전략입니다. 오늘의 판단을 믿되, 리스크 관리 원칙은 지켜주세요.',
    '적극': 'Dear,ANT\n\n자신감과 적극성이 가득한 날이네요. 이런 날 큰 수익을 올리기도 하지만, 과신은 금물입니다. 투자 금액의 한도를 정해두세요.',
  },
};

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function generateReport(data: SurveyData): Omit<Report, 'id' | 'createdAt'> {
  const totalScore = calculateTotalScore(data.answers);
  const decisionMode = getDecisionMode(totalScore);
  const riskTendency = getRiskTendency(totalScore);
  const moodScore = calculateMoodScore(data.userInfo.mood, data.answers);
  const investMood = getInvestMood(totalScore, moodScore);
  const biorhythm = calculateBiorhythm(data.userInfo.birthDate);
  const todayMessage = getRandomMessage(todayMessages[decisionMode]);
  const todayLetter = moodLetters[data.userInfo.mood]?.[decisionMode]
    || moodLetters['평온'][decisionMode];
  const todayKeywords = keywordPool[decisionMode]?.[data.userInfo.mood]
    || ['균형', '분석', '원칙'];

  return {
    decisionMode,
    moodScore,
    riskTendency,
    investMood,
    biorhythmPhysical: biorhythm.physical,
    biorhythmEmotional: biorhythm.emotional,
    biorhythmIntellectual: biorhythm.intellectual,
    todayKeywords,
    todayMessage,
    todayLetter,
  };
}
