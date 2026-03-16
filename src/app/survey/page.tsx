'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { Mood, Answer } from '@/lib/types';
import AntCharacter from '@/components/AntCharacter';

function MoodIcon({ type }: { type: string }) {
  // 미니멀 라인아트 스타일 - 배경 없이 깔끔한 선으로만 표현
  const color = '#6b21a8';
  const sub = '#a78bfa';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {type === '불안' ? (
        <>
          {/* 흔들리는 눈 */}
          <circle cx="11" cy="13" r="1.5" fill={color} />
          <circle cx="21" cy="13" r="1.5" fill={color} />
          {/* 걱정 눈썹 ╱╲ */}
          <line x1="8" y1="9.5" x2="14" y2="10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="9.5" x2="18" y2="10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* 물결 입 */}
          <path d="M10 20 Q13 18 16 20 Q19 22 22 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* 세로선 (긴장) */}
          <line x1="26" y1="7" x2="26" y2="11" stroke={sub} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="27.5" y1="8" x2="27.5" y2="10.5" stroke={sub} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </>
      ) : type === '초조' ? (
        <>
          {/* 날카로운 눈 */}
          <circle cx="11" cy="14" r="1.3" fill={color} />
          <circle cx="21" cy="14" r="1.3" fill={color} />
          {/* V자 눈썹 (화남+초조) */}
          <line x1="7" y1="10" x2="14" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="25" y1="10" x2="18" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          {/* 꾹 다문 입 */}
          <line x1="11" y1="21" x2="21" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* 진동 표시 */}
          <path d="M5 15 L3 13 L5 11" stroke={sub} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M27 15 L29 13 L27 11" stroke={sub} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
        </>
      ) : type === '평온' ? (
        <>
          {/* 감은 눈 ⌒ ⌒ */}
          <path d="M8 14 Q11 11 14 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M18 14 Q21 11 24 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* 부드러운 미소 */}
          <path d="M11 20 Q16 24 21 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* 음표 */}
          <circle cx="26" cy="7" r="1.2" fill={sub} opacity="0.5" />
          <line x1="27.2" y1="7" x2="27.2" y2="4" stroke={sub} strokeWidth="0.8" opacity="0.5" />
        </>
      ) : type === '설렘' ? (
        <>
          {/* 반짝 큰 눈 */}
          <circle cx="11" cy="13" r="2.5" fill={color} />
          <circle cx="21" cy="13" r="2.5" fill={color} />
          <circle cx="10" cy="12" r="1" fill="white" />
          <circle cx="20" cy="12" r="1" fill="white" />
          {/* 큰 미소 */}
          <path d="M10 19 Q16 25 22 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* 하트 */}
          <path d="M26 8 C26 6.5 24.5 6 24 7.5 C23.5 6 22 6.5 22 8 C22 9.5 24 11 24 11 C24 11 26 9.5 26 8Z" fill="#c084fc" opacity="0.5" />
        </>
      ) : (
        <>
          {/* 선글라스 */}
          <rect x="6" y="11" width="8" height="5" rx="2" fill={color} />
          <rect x="18" y="11" width="8" height="5" rx="2" fill={color} />
          <line x1="14" y1="13.5" x2="18" y2="13.5" stroke={color} strokeWidth="1.2" />
          {/* 반사광 */}
          <line x1="8" y1="12.5" x2="11" y2="12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
          <line x1="20" y1="12.5" x2="23" y2="12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
          {/* 씩 미소 */}
          <path d="M11 21 Q16 25 21 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

const moods: { label: string; value: Mood }[] = [
  { label: '불안', value: '불안' },
  { label: '초조', value: '초조' },
  { label: '평온', value: '평온' },
  { label: '설렘', value: '설렘' },
  { label: '자신감', value: '자신감' },
];

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'questions' | 'loading'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleInfoSubmit = () => {
    if (!birthDate || !mood) return;
    setStep('questions');
  };

  const handleAnswer = async (questionKey: string, value: string, score: number) => {
    const newAnswers = [...answers, { questionKey, answerValue: value, score }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
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

  // 정보 입력 단계
  if (step === 'info') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full animate-fade-in">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-purple-500 mb-8 text-sm transition-colors"
          >
            &larr; 돌아가기
          </button>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">기본 정보</h2>
          <p className="text-slate-400 text-sm mb-8">
            당신의 바이오리듬을 분석하기 위한 정보입니다
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-2">
                생년월일
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-sm font-medium mb-3">
                오늘의 기분은 어떠신가요?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all ${
                      mood === m.value
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-purple-100 bg-white hover:border-purple-300'
                    }`}
                  >
                    <MoodIcon type={m.value} />
                    <span className="text-xs text-slate-600">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleInfoSubmit}
            disabled={!birthDate || !mood}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-200 disabled:to-purple-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
          >
            다음
          </button>
        </div>
      </main>
    );
  }

  // 로딩 단계
  if (step === 'loading') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <AntCharacter size={100} expression="thinking" className="mx-auto mb-6 animate-pulse-soft" />
          <p className="text-slate-700 text-lg font-bold">
            리포트를 생성하고 있습니다...
          </p>
          <p className="text-slate-400 text-sm mt-2">
            바이오리듬과 투자 성향을 분석 중입니다
          </p>
        </div>
      </main>
    );
  }

  // 질문 단계
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>질문 {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-mint-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div key={question.key} className="animate-slide-up">
          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {question.text}
          </h3>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.key, option.value, option.score)}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-purple-100 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-slate-700 font-medium active:scale-[0.98]"
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
