'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { Mood, Answer } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { EmotionChip } from '@/components/EmotionChip';
import { CircularGauge } from '@/components/CircularGauge';
import { ProgressBar } from '@/components/ProgressBar';

interface CheckItem {
  id: string;
  label: string;
  category: string;
  weight: number;
  emoji: string;
}

const checklistItems: CheckItem[] = [
  { id: 'sleep', label: '수면 5시간 이하', category: '컨디션', weight: 3, emoji: '😴' },
  { id: 'tired', label: '컨디션 안 좋음', category: '컨디션', weight: 2, emoji: '🤒' },
  { id: 'caffeine', label: '카페인 3잔 이상', category: '컨디션', weight: 1, emoji: '☕' },
  { id: 'revenge', label: '손실 만회 욕구', category: '심리', weight: 4, emoji: '🔥' },
  { id: 'gut', label: '근거 없는 확신', category: '심리', weight: 3, emoji: '🎯' },
  { id: 'fomo', label: '기회를 놓칠까 불안', category: '심리', weight: 3, emoji: '😰' },
  { id: 'sns', label: 'SNS 수익 인증 목격', category: '외부 영향', weight: 2, emoji: '📱' },
  { id: 'recommend', label: '종목 추천 수령', category: '외부 영향', weight: 2, emoji: '💬' },
  { id: 'news', label: '뉴스 30분 이상 시청', category: '외부 영향', weight: 1, emoji: '📰' },
];

const categoryColors: Record<string, string> = {
  '컨디션': 'bg-emerald-400',
  '심리': 'bg-amber-500',
  '외부 영향': 'bg-indigo-500',
};

function deriveChecklistMood(checked: Set<string>): { mood: Mood; score: number } {
  const totalWeight = checklistItems
    .filter(item => checked.has(item.id))
    .reduce((sum, item) => sum + item.weight, 0);

  // weight 0 → 평온, weight 21 (max) → 불안
  if (totalWeight <= 2) return { mood: '평온', score: totalWeight };
  if (totalWeight <= 5) return { mood: '자신감', score: totalWeight };
  if (totalWeight <= 9) return { mood: '설렘', score: totalWeight };
  if (totalWeight <= 14) return { mood: '초조', score: totalWeight };
  return { mood: '불안', score: totalWeight };
}

const categories = ['컨디션', '심리', '외부 영향'];

export default function SurveyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'questions' | 'loading'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
      const { mood } = deriveChecklistMood(checkedItems);
      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInfo: { birthDate, mood },
            answers: newAnswers,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.report) {
          router.push(`/result/${data.report.id}`);
        }
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
    const { mood } = deriveChecklistMood(checkedItems);
    const riskLevel = checkedItems.size === 0
      ? '안정'
      : mood === '평온' || mood === '자신감'
        ? '양호'
        : mood === '설렘'
          ? '주의'
          : '위험';
    const riskColor = {
      '안정': 'text-emerald-500',
      '양호': 'text-blue-500',
      '주의': 'text-amber-500',
      '위험': 'text-red-500',
    }[riskLevel];

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
            <label htmlFor="birthDate" className="block text-green-900 text-sm font-medium mb-1">
              생년월일
            </label>
            <p className="text-green-800 text-xs mb-2">바이오리듬 계산에 사용돼요</p>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900"
            />
          </div>

          {/* 위험도 카드 */}
          <div className="card-v3 px-5 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 text-xs font-medium">현재 매매 위험도</p>
                <p className={`text-lg font-extrabold mt-0.5 ${riskColor}`}>
                  {riskLevel}
                </p>
              </div>
              <CircularGauge
                value={Math.round((checkedItems.size / checklistItems.length) * 100)}
                size={64}
                color={riskLevel === '안정' ? '#16A34A' : riskLevel === '양호' ? '#2563EB' : riskLevel === '주의' ? '#D97706' : '#DC2626'}
                label={`${checkedItems.size}/${checklistItems.length}`}
              />
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-green-900 leading-tight mb-1">
              매매 전 셀프 체크
            </h2>
            <p className="text-green-800 text-sm mb-6">
              지금 해당되는 항목을 모두 체크해주세요
            </p>

            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${categoryColors[cat]}`} />
                    <p className="text-green-800 text-xs font-semibold">{cat}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {checklistItems.filter(item => item.category === cat).map(item => (
                      <EmotionChip
                        key={item.id}
                        emoji={item.emoji}
                        label={item.label}
                        selected={checkedItems.has(item.id)}
                        onToggle={() => toggleCheck(item.id)}
                        categoryColor={categoryColors[cat]}
                      />
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
