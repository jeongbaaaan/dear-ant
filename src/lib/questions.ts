import { Question } from './types';

export const questions: Question[] = [
  {
    key: 'loss_reaction',
    text: '투자한 종목이 -10% 손실이 나면 어떻게 하시나요?',
    options: [
      { label: '바로 손절한다', value: 'cut', score: 20 },
      { label: '조금 더 지켜본다', value: 'wait', score: 50 },
      { label: '오히려 추가 매수한다', value: 'buy_more', score: 80 },
    ],
  },
  {
    key: 'news_influence',
    text: '뉴스에서 특정 종목이 급등했다는 소식을 들으면?',
    options: [
      { label: '바로 매수를 고려한다', value: 'buy_now', score: 85 },
      { label: '분석 후 판단한다', value: 'analyze', score: 50 },
      { label: '이미 늦었다고 생각한다', value: 'too_late', score: 20 },
    ],
  },
  {
    key: 'profit_action',
    text: '보유 종목이 +20% 수익이 나면?',
    options: [
      { label: '바로 익절한다', value: 'take_profit', score: 30 },
      { label: '목표가까지 보유한다', value: 'hold_target', score: 55 },
      { label: '더 오를 것 같아 보유한다', value: 'hold_more', score: 80 },
    ],
  },
  {
    key: 'investment_style',
    text: '나의 투자 스타일은?',
    options: [
      { label: '안전한 것이 최고다', value: 'safe', score: 15 },
      { label: '적당한 리스크는 감수한다', value: 'moderate', score: 50 },
      { label: '높은 수익을 위해 위험도 감수한다', value: 'aggressive', score: 85 },
    ],
  },
  {
    key: 'decision_basis',
    text: '투자 결정을 할 때 가장 중요한 것은?',
    options: [
      { label: '차트와 기술적 분석', value: 'chart', score: 55 },
      { label: '주변 지인이나 커뮤니티 의견', value: 'social', score: 75 },
      { label: '기업의 펀더멘탈 분석', value: 'fundamental', score: 40 },
    ],
  },
  {
    key: 'market_drop',
    text: '시장이 전체적으로 크게 하락하면?',
    options: [
      { label: '공포감에 전량 매도한다', value: 'sell_all', score: 25 },
      { label: '현금 비중을 늘리며 관망한다', value: 'cash_up', score: 45 },
      { label: '저가 매수의 기회로 본다', value: 'buy_dip', score: 80 },
    ],
  },
  {
    key: 'check_frequency',
    text: '하루에 주식 앱을 몇 번 확인하시나요?',
    options: [
      { label: '거의 안 본다', value: 'rarely', score: 25 },
      { label: '3~5번 정도', value: 'moderate', score: 50 },
      { label: '수시로 확인한다', value: 'constantly', score: 80 },
    ],
  },
];
