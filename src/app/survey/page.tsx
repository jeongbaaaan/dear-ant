'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { Mood, Answer } from '@/lib/types';

interface CheckItem {
  id: string;
  label: string;
  category: string;
  weight: number;
}

const checklistItems: CheckItem[] = [
  // 컨디션
  { id: 'sleep', label: '어젯밤 5시간 이하로 잤다', category: '컨디션', weight: 3 },
  { id: 'tired', label: '몸이 피곤하거나 컨디션이 안 좋다', category: '컨디션', weight: 2 },
  { id: 'caffeine', label: '카페인을 3잔 이상 마셨다', category: '컨디션', weight: 1 },
  // 심리
  { id: 'revenge', label: '최근 손실을 빨리 만회하고 싶다', category: '심리', weight: 4 },
  { id: 'gut', label: '근거 없이 오를 것 같은 느낌이 든다', category: '심리', weight: 3 },
  { id: 'fomo', label: '매매를 안 하면 기회를 놓칠 것 같다', category: '심리', weight: 3 },
  // 외부 영향
  { id: 'sns', label: 'SNS에서 수익 인증글을 봤다', category: '외부 영향', weight: 2 },
  { id: 'recommend', label: '주변에서 특정 종목을 추천받았다', category: '외부 영향', weight: 2 },
  { id: 'news', label: '뉴스·유튜브를 30분 이상 봤다', category: '외부 영향', weight: 1 },
];

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
    const newAnswers = [...answers, { questionKey, answerValue: value, score }];
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
        const data = await res.json();
        if (data.report) {
          router.push(`/result/${data.report.id}`);
        }
      } catch {
        alert('리포트 생성에 실패했습니다. 다시 시도해주세요.');
        setStep('questions');
        setCurrentQuestion(questions.length - 1);
        setAnswers(answers);
      }
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
      <main className="min-h-screen bg-white px-5 pt-14 pb-nav">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-600 mb-6 text-sm transition-colors"
          >
            &larr; 돌아가기
          </button>

          {/* 생년월일 */}
          <div className="mb-8">
            <label className="block text-slate-600 text-sm font-medium mb-2">
              생년월일
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-800"
            />
          </div>

          {/* 체크리스트 */}
          <div className="mb-6">
            <h2 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-1">
              매매 전 셀프 체크
            </h2>
            <p className="text-slate-400 text-[13px] mb-6">
              지금 해당되는 항목을 모두 체크해주세요
            </p>

            <div className="space-y-6">
              {categories.map(cat => (
                <div key={cat}>
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-2 px-1">{cat}</p>
                  <div className="space-y-2">
                    {checklistItems.filter(item => item.category === cat).map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                          checkedItems.has(item.id)
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          checkedItems.has(item.id)
                            ? 'border-white bg-white'
                            : 'border-slate-300'
                        }`}>
                          {checkedItems.has(item.id) && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[14px] font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 현재 상태 표시 */}
          <div className="bg-slate-50 rounded-2xl px-5 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[11px] font-medium">현재 매매 위험도</p>
                <p className={`text-[18px] font-extrabold mt-0.5 ${riskColor}`}>
                  {riskLevel}
                </p>
              </div>
              <p className="text-slate-300 text-[28px] font-extrabold">
                {checkedItems.size}<span className="text-[14px] font-normal text-slate-400">/{checklistItems.length}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleInfoSubmit}
            disabled={!birthDate}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
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
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin mx-auto mb-6" />
          <p className="text-slate-700 text-lg font-bold">
            리포트를 생성하고 있습니다
          </p>
          <p className="text-slate-400 text-sm mt-2">
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
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>질문 {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div key={question.key} className="animate-slide-up">
          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {question.text}
          </h3>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.key, option.value, option.score)}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 hover:bg-slate-50 transition-all duration-200 text-slate-700 font-medium active:scale-[0.98]"
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
