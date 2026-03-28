'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { Mood, Answer } from '@/lib/types';
import { generateReport } from '@/lib/report-engine';
import { clientStore } from '@/lib/client-store';
import { useToast } from '@/components/Toast';
import { CircularGauge } from '@/components/CircularGauge';
import { ProgressBar } from '@/components/ProgressBar';
import DateInput from '@/components/DateInput';

// 단계별 컨디션 입력 항목
interface ConditionItem {
  id: string;
  label: string;
  emoji: string;
  category: string;
  weight: number; // 최대 가중치
  options: { label: string; score: number }[]; // 0 = 최상, 높을수록 나쁨
}

const conditionItems: ConditionItem[] = [
  {
    id: 'sleep', label: '수면 시간', emoji: '😴', category: '컨디션', weight: 3,
    options: [
      { label: '8시간+', score: 0 }, { label: '6-7시간', score: 1 },
      { label: '4-5시간', score: 2 }, { label: '3시간↓', score: 3 },
    ],
  },
  {
    id: 'condition', label: '컨디션', emoji: '💪', category: '컨디션', weight: 2,
    options: [
      { label: '좋음', score: 0 }, { label: '보통', score: 1 }, { label: '나쁨', score: 2 },
    ],
  },
  {
    id: 'caffeine', label: '카페인', emoji: '☕', category: '컨디션', weight: 1,
    options: [
      { label: '0잔', score: 0 }, { label: '1-2잔', score: 0 },
      { label: '3-4잔', score: 1 }, { label: '5잔+', score: 1 },
    ],
  },
  {
    id: 'revenge', label: '손실 만회 욕구', emoji: '🔥', category: '심리', weight: 4,
    options: [
      { label: '없음', score: 0 }, { label: '약간', score: 1 },
      { label: '보통', score: 2 }, { label: '강함', score: 4 },
    ],
  },
  {
    id: 'confidence', label: '근거 없는 확신', emoji: '🎯', category: '심리', weight: 3,
    options: [
      { label: '없음', score: 0 }, { label: '약간', score: 1 },
      { label: '보통', score: 2 }, { label: '강함', score: 3 },
    ],
  },
  {
    id: 'fomo', label: '놓칠까봐 불안', emoji: '😰', category: '심리', weight: 3,
    options: [
      { label: '없음', score: 0 }, { label: '약간', score: 1 },
      { label: '보통', score: 2 }, { label: '강함', score: 3 },
    ],
  },
  {
    id: 'sns', label: 'SNS 수익 인증', emoji: '📱', category: '외부 영향', weight: 2,
    options: [
      { label: '없음', score: 0 }, { label: '1-2건', score: 1 }, { label: '많이', score: 2 },
    ],
  },
  {
    id: 'recommend', label: '종목 추천', emoji: '💬', category: '외부 영향', weight: 2,
    options: [
      { label: '없음', score: 0 }, { label: '1-2건', score: 1 }, { label: '3건+', score: 2 },
    ],
  },
  {
    id: 'news', label: '뉴스 시청', emoji: '📰', category: '외부 영향', weight: 1,
    options: [
      { label: '안봄', score: 0 }, { label: '30분↓', score: 0 },
      { label: '30분-1시간', score: 1 }, { label: '1시간+', score: 1 },
    ],
  },
];

const categoryColors: Record<string, string> = {
  '컨디션': 'bg-emerald-400',
  '심리': 'bg-amber-500',
  '외부 영향': 'bg-indigo-500',
};

const MAX_SCORE = conditionItems.reduce((s, item) => s + item.weight, 0); // 21

function deriveConditionMood(selections: Record<string, number>): { mood: Mood; score: number; percent: number } {
  const totalScore = conditionItems.reduce((sum, item) => {
    return sum + (selections[item.id] ?? 0);
  }, 0);

  // percent: 0 = 최악, 100 = 최상 (역산)
  const percent = Math.round(((MAX_SCORE - totalScore) / MAX_SCORE) * 100);

  // mood 매핑: 점수 낮을수록 좋음
  if (totalScore <= 2) return { mood: '평온', score: totalScore, percent };
  if (totalScore <= 5) return { mood: '자신감', score: totalScore, percent };
  if (totalScore <= 9) return { mood: '설렘', score: totalScore, percent };
  if (totalScore <= 14) return { mood: '초조', score: totalScore, percent };
  return { mood: '불안', score: totalScore, percent };
}

const categories = ['컨디션', '심리', '외부 영향'];

export default function SurveyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'questions' | 'loading'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const setSelection = (id: string, score: number) => {
    setSelections(prev => ({ ...prev, [id]: score }));
  };

  const handleInfoSubmit = () => {
    if (!birthDate) return;
    setStep('questions');
  };

  const handleAnswer = async (questionKey: string, value: string, score: number) => {
    const newAnswers = [...answers.slice(0, currentQuestion), { questionKey, answerValue: value, score }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      const { mood } = deriveConditionMood(selections);
      try {
        const reportData = generateReport({ userInfo: { birthDate, mood }, answers: newAnswers });
        const report = clientStore.createReport({
          decision_mode: reportData.decisionMode,
          mood_score: reportData.moodScore,
          risk_tendency: reportData.riskTendency,
          invest_mood: reportData.investMood,
          biorhythm_physical: reportData.biorhythmPhysical,
          biorhythm_emotional: reportData.biorhythmEmotional,
          biorhythm_intellectual: reportData.biorhythmIntellectual,
          today_keywords: reportData.todayKeywords,
          today_message: reportData.todayMessage,
          today_letter: reportData.todayLetter,
          mood,
          birth_date: birthDate,
        });
        clientStore.saveAnswers(report.session_id, newAnswers);
        router.push(`/result/${report.id}`);
      } catch {
        toast('리포트 생성에 실패했습니다. 다시 시도해주세요.');
        setStep('questions');
        setCurrentQuestion(questions.length - 1);
        setAnswers(newAnswers.slice(0, -1));
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 체크리스트 + 생년월일 입력
  if (step === 'info') {
    const { mood, percent } = deriveConditionMood(selections);
    const hasInput = Object.keys(selections).length > 0;
    const conditionLevel = !hasInput
      ? '입력 대기'
      : percent >= 80 ? '좋음'
      : percent >= 60 ? '양호'
      : percent >= 40 ? '보통'
      : '나쁨';
    const conditionColor = {
      '입력 대기': 'text-on-surface-variant',
      '좋음': 'text-emerald-500',
      '양호': 'text-blue-500',
      '보통': 'text-amber-500',
      '나쁨': 'text-red-500',
    }[conditionLevel];

    return (
      <main className="min-h-screen px-5 pt-4 pb-nav">
        <ProgressBar current={1} total={3} />
        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => router.push('/')}
            className="text-green-800 hover:text-green-900 mb-6 text-sm transition-colors"
          >
            &larr; 돌아가기
          </button>

          {/* 생년월일 */}
          <div className="mb-8">
            <label className="block text-green-900 text-sm font-medium mb-1">
              생년월일
            </label>
            <p className="text-green-800 text-xs mb-2">바이오리듬 계산에 사용돼요</p>
            <DateInput value={birthDate} onChange={setBirthDate} />
          </div>

          {/* 컨디션 카드 */}
          <div className="card-v3 px-5 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 text-xs font-medium">나의 컨디션</p>
                <p className={`text-lg font-extrabold mt-0.5 ${conditionColor}`}>
                  {conditionLevel}
                </p>
              </div>
              <CircularGauge
                value={hasInput ? percent : 0}
                size={64}
                color={conditionLevel === '좋음' ? '#16A34A' : conditionLevel === '양호' ? '#2563EB' : conditionLevel === '보통' ? '#D97706' : conditionLevel === '나쁨' ? '#DC2626' : '#94A3B8'}
                label={hasInput ? `${percent}%` : '-'}
              />
            </div>
          </div>

          {/* 컨디션 입력 */}
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-green-900 leading-tight mb-1">
              매매 전 셀프 체크
            </h2>
            <p className="text-green-800 text-sm mb-6">
              현재 상태를 선택해주세요
            </p>

            <div className="space-y-6">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${categoryColors[cat]}`} />
                    <p className="text-green-800 text-xs font-semibold">{cat}</p>
                  </div>
                  <div className="space-y-4">
                    {conditionItems.filter(item => item.category === cat).map(item => (
                      <div key={item.id} className="card-v3 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-sm font-bold text-green-900">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          {item.options.map((opt, oi) => {
                            const isSelected = selections[item.id] === opt.score;
                            return (
                              <button
                                key={oi}
                                type="button"
                                onClick={() => setSelection(item.id, opt.score)}
                                aria-pressed={isSelected}
                                className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl transition-all ${
                                  isSelected
                                    ? 'bg-green-900 text-white scale-[1.02]'
                                    : 'bg-green-50 text-green-800 hover:bg-green-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleInfoSubmit}
            disabled={!birthDate}
            className="w-full bg-green-900 hover:bg-green-800 hover:scale-[1.02] disabled:bg-green-200 disabled:text-green-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
          >
            다음
          </button>
        </div>
      </main>
    );
  }

  // 로딩
  if (step === 'loading') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-900 animate-spin mx-auto mb-6" />
          <p className="text-green-800 text-lg font-bold">
            리포트를 생성하고 있습니다
          </p>
          <p className="text-green-800 text-sm mt-2">
            잠시만 기다려주세요
          </p>
        </div>
      </main>
    );
  }

  // 질문
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-green-800 mb-2">
            <div className="flex items-center gap-2">
              {currentQuestion > 0 && (
                <button
                  onClick={handlePrevQuestion}
                  className="text-green-800 hover:text-green-700 transition-colors"
                  aria-label="이전 질문"
                >
                  &larr;
                </button>
              )}
              <span>질문 {currentQuestion + 1} / {questions.length}</span>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar current={currentQuestion + 1} total={questions.length} />
        </div>

        <div key={question.key} className="animate-slide-up">
          <h3 className="text-xl font-bold text-green-900 mb-8 leading-relaxed">
            {question.text}
          </h3>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.key, option.value, option.score)}
                className="w-full text-left px-5 py-4 rounded-xl card-v3 hover:bg-green-50 transition-all duration-200 text-green-800 font-medium active:scale-[0.98]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
