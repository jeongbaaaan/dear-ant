'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { Mood, Answer } from '@/lib/types';
import { generateReport } from '@/lib/report-engine';
import { clientStore } from '@/lib/client-store';
import { useToast } from '@/components/Toast';
import ConditionGauge from '@/components/ConditionGauge';
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

interface CategoryMeta {
  name: string;
  icon: string;
  bgClass: string;
  iconColor: string;
}

const categoryMeta: CategoryMeta[] = [
  { name: '컨디션', icon: 'favorite', bgClass: 'bg-primary-container', iconColor: 'text-primary' },
  { name: '심리', icon: 'psychology', bgClass: 'bg-amber-container', iconColor: 'text-amber' },
  { name: '외부 영향', icon: 'language', bgClass: 'bg-blue-container', iconColor: 'text-blue' },
];

const stepLabels = [
  { icon: 'edit_note', label: '셀프 체크' },
  { icon: 'quiz', label: '투자 성향 Q&A' },
  { icon: 'summarize', label: '리포트 생성' },
];

export default function SurveyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'questions' | 'loading'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [animatingChip, setAnimatingChip] = useState<string | null>(null);

  // Track which option index is selected per item (for highlight when scores overlap)
  const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>({});

  const setSelection = (id: string, score: number, optionIndex: number) => {
    setSelections(prev => ({ ...prev, [id]: score }));
    setSelectedIndices(prev => ({ ...prev, [id]: optionIndex }));
    // Trigger bounce animation
    const chipKey = `${id}-${optionIndex}`;
    setAnimatingChip(chipKey);
    setTimeout(() => setAnimatingChip(null), 150);
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

  // Step 1: 체크리스트 + 생년월일 입력
  if (step === 'info') {
    const { percent } = deriveConditionMood(selections);
    const hasInput = Object.keys(selections).length > 0;
    const conditionLevel = !hasInput
      ? '입력 대기'
      : percent >= 80 ? '좋음'
      : percent >= 60 ? '양호'
      : percent >= 40 ? '보통'
      : '나쁨';

    const currentStepIndex = 0; // Step 1

    return (
      <div className="max-w-[720px] mx-auto">
        {/* 1. Progress */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] font-semibold text-primary">Step 1 / 3</span>
          <span className="text-[13px] text-on-surface-tertiary">매매 전 셀프 체크</span>
        </div>
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: '33%' }} />
        </div>

        {/* Step Pills */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {stepLabels.map((s, i) => {
            const pillClass = i < currentStepIndex ? 'bg-primary-container text-primary'
              : i === currentStepIndex ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-quaternary';
            return (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${pillClass}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{s.icon}</span>
                {s.label}
              </div>
            );
          })}
        </div>

        {/* 2. Title */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 leading-tight">
          매매 전 셀프 체크
        </h1>
        <p className="text-[15px] text-on-surface-secondary mb-9 leading-relaxed">
          현재 상태를 솔직하게 선택해주세요. 정확할수록 리포트가 정확해져요.
        </p>

        {/* 3. Birth date */}
        <div className="card card-raised mb-8">
          <div className="text-[15px] font-semibold mb-1">생년월일</div>
          <p className="text-[13px] text-on-surface-tertiary mb-4">바이오리듬 계산에 사용돼요</p>
          <DateInput value={birthDate} onChange={setBirthDate} />
        </div>

        {/* 4. Live Condition Gauge */}
        <div className="card card-raised mb-3 flex items-center gap-5">
          <ConditionGauge value={hasInput ? percent : 0} size={64} strokeWidth={5} animated />
          <div className="flex-1">
            <div className="text-[13px] text-on-surface-tertiary">나의 컨디션</div>
            <div className="text-xl font-bold mt-0.5">{conditionLevel}</div>
          </div>
        </div>

        {/* 5-7. Category groups */}
        {categoryMeta.map(cat => {
          const items = conditionItems.filter(item => item.category === cat.name);
          const answeredCount = items.filter(item => selections[item.id] !== undefined).length;

          return (
            <div key={cat.name} className="mt-9">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${cat.bgClass}`}>
                  <span className={`material-symbols-outlined ${cat.iconColor}`} style={{ fontSize: 20 }}>
                    {cat.icon}
                  </span>
                </div>
                <span className="text-[17px] font-bold">{cat.name}</span>
                <span className="text-[13px] text-on-surface-tertiary ml-auto">{answeredCount}/{items.length}</span>
              </div>

              {/* Check items */}
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="card card-raised">
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-[15px] font-semibold">{item.label}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {item.options.map((opt, oi) => {
                        const isSelected = selectedIndices[item.id] === oi;
                        const chipKey = `${item.id}-${oi}`;
                        const isAnimating = animatingChip === chipKey;
                        return (
                          <button
                            key={oi}
                            type="button"
                            onClick={() => setSelection(item.id, opt.score, oi)}
                            aria-pressed={isSelected}
                            className={`chip ${isSelected ? 'chip-selected' : 'chip-default'} ${isAnimating ? 'animate-chipBounce' : ''}`}
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
          );
        })}

        {/* Spacer for fixed bottom bar */}
        <div className="h-24" />

        {/* 8. Bottom action bar */}
        <div className="fixed bottom-0 left-[var(--sidebar-width)] right-0 bg-surface border-t border-surface-border z-40 max-md:left-[var(--sidebar-collapsed)] max-sm:left-0">
          <div className="max-w-[720px] mx-auto flex justify-between items-center px-10 py-4 max-sm:px-5">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn btn-ghost"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
              돌아가기
            </button>
            <button
              type="button"
              onClick={handleInfoSubmit}
              disabled={!birthDate}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음: 투자 성향 Q&A
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로딩
  if (step === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary-container border-t-primary animate-spin mx-auto mb-6" />
          <p className="text-lg font-bold">리포트를 생성하고 있습니다</p>
          <p className="text-sm text-on-surface-secondary mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // Step 2: 질문
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentStepIndex = 1;

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Progress */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] font-semibold text-primary">Step 2 / 3</span>
        <span className="text-[13px] text-on-surface-tertiary">투자 성향 Q&A</span>
      </div>
      <div className="progress-bar mb-8">
        <div className="progress-fill" style={{ width: `${33 + (progress * 0.34)}%` }} />
      </div>

      {/* Step Pills */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {stepLabels.map((s, i) => {
          const pillClass = i < currentStepIndex ? 'bg-primary-container text-primary'
            : i === currentStepIndex ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-quaternary';
          return (
            <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${pillClass}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{s.icon}</span>
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Question counter */}
      <div className="flex items-center gap-2 mb-2 text-[13px] text-on-surface-secondary">
        {currentQuestion > 0 && (
          <button
            onClick={handlePrevQuestion}
            className="text-on-surface-secondary hover:text-on-surface transition-colors"
            aria-label="이전 질문"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
        )}
        <span>질문 {currentQuestion + 1} / {questions.length}</span>
        <span className="ml-auto">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar mb-10">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div key={question.key} className="animate-slideUp">
        <h3 className="text-xl font-bold mb-8 leading-relaxed">
          {question.text}
        </h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.key, option.value, option.score)}
              className="w-full text-left px-6 py-4 rounded-2xl card card-raised hover:bg-surface-dim transition-all duration-200 font-medium active:scale-[0.98]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
