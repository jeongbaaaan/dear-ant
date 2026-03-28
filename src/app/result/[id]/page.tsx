'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { ApiReport } from '@/lib/types';

const conditionMap: Record<string, { label: string; desc: string }> = {
  'S': { label: '최상', desc: '오늘은 심리적 안정이 돋보이는 날입니다. 계획된 원칙을 지키기에 가장 적합한 타이밍입니다.' },
  'A': { label: '최상', desc: '오늘은 심리적 안정이 돋보이는 날입니다. 계획된 원칙을 지키기에 가장 적합한 타이밍입니다.' },
  'B': { label: '양호', desc: '전반적으로 안정적인 컨디션입니다. 원칙에 따라 신중하게 접근하세요.' },
  'C': { label: '보통', desc: '평범한 컨디션입니다. 무리한 매매보다는 관망을 고려해보세요.' },
  'D': { label: '주의', desc: '감정적 동요가 감지됩니다. 매매를 줄이고 관찰에 집중하세요.' },
  'F': { label: '위험', desc: '오늘은 매매를 쉬어가는 것이 좋겠습니다. 충분한 휴식을 취하세요.' },
};

const riskLabelMap: Record<string, string> = {
  '높음': '위험',
  '중간': '주의 필요',
  '낮음': '안전',
};

export default function ResultPage() {
  const params = useParams();
  const { toast } = useToast();
  const [report, setReport] = useState<ApiReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReport(data.report);
      } catch {
        console.error('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-primary animate-spin" />
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-on-surface-variant mb-4">리포트를 찾을 수 없습니다.</p>
        <Link href="/" className="text-primary font-bold">홈으로 돌아가기</Link>
      </main>
    );
  }

  const grade = report.invest_mood || 'C';
  const condition = conditionMap[grade] || conditionMap['C'];
  const riskLabel = riskLabelMap[report.risk_tendency] || '주의 필요';
  const moodScore = report.mood_score ?? 50;

  // Normalize biorhythm -100~100 → 0~100
  const bioPhysical = Math.round(((report.biorhythm_physical ?? 0) + 100) / 2);
  const bioEmotional = Math.round(((report.biorhythm_emotional ?? 0) + 100) / 2);
  const bioIntellectual = Math.round(((report.biorhythm_intellectual ?? 0) + 100) / 2);

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
          </div>
          <h1 className="font-headline font-extrabold text-primary text-xl tracking-tight">리포트</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
        {/* Summary Display */}
        <section className="space-y-2">
          <span className="font-bold text-xs text-primary uppercase tracking-widest">Today&apos;s Insight</span>
          <div className="flex items-baseline gap-2">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">투자 컨디션</h2>
            <span className="font-headline text-4xl font-extrabold text-primary">{condition.label}</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">{condition.desc}</p>
        </section>

        {/* Bento Grid: Biorhythm + Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Biorhythm */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
            <div className="flex justify-between items-start">
              <h3 className="font-headline text-lg font-bold text-on-surface">바이오리듬</h3>
              <span className="material-symbols-outlined text-primary">insights</span>
            </div>
            <div className="relative h-32 mt-4 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                <path d="M0,50 Q25,10 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#bef5ca" strokeLinecap="round" strokeWidth="4" />
                <path
                  d={`M0,${100 - bioPhysical} Q50,${100 - bioEmotional} 100,50 T150,${100 - bioIntellectual} T200,${100 - bioPhysical}`}
                  fill="none" stroke="#006b1b" strokeLinecap="round" strokeWidth="4"
                />
                <circle cx="150" cy={100 - bioIntellectual} r="6" fill="#006b1b" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-outline uppercase">Physical</p>
                <p className="text-sm font-bold text-on-surface">{bioPhysical}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-outline uppercase">Emotional</p>
                <p className="text-sm font-bold text-on-surface">{bioEmotional}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-outline uppercase">Intellect</p>
                <p className="text-sm font-bold text-on-surface">{bioIntellectual}%</p>
              </div>
            </div>
          </div>

          {/* Trading Risk */}
          <div className="bg-surface-container-high rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-lg font-bold text-on-surface">매매 위험도</h3>
              <div className="px-3 py-1 bg-surface-container-lowest rounded-full text-[10px] font-bold text-primary border border-primary/10">
                {riskLabel}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#acecbb" strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#006b1b" strokeDasharray={`${moodScore}, 100`}
                    strokeLinecap="round" strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-on-surface">{moodScore}</span>
                  <span className="text-[10px] text-on-surface-variant font-bold">
                    {moodScore <= 35 ? 'SAFE' : moodScore <= 65 ? 'NORMAL' : 'HIGH'}
                  </span>
                </div>
              </div>
            </div>
            {report.today_message && (
              <div className="bg-surface-container-lowest/50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-lg">warning</span>
                  <p className="text-xs text-on-surface-variant leading-snug">{report.today_message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pre-trading Self-check */}
        <section className="bg-surface-container-low rounded-xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">매매전 셀프체크</h3>
              <p className="text-xs text-on-surface-variant">원칙을 지키는 매매가 성공의 지름길입니다.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { q: '지금 감정적으로 평온한 상태인가요?', desc: '조급함이나 공포에 의한 매매가 아닌지 확인하세요.' },
              { q: '손절가와 목표가를 설정했나요?', desc: '진입 전 탈출 전략이 명확해야 합니다.' },
              { q: '매수 근거가 최소 3가지 이상인가요?', desc: '차트, 재무, 뉴스의 조합을 확인하세요.' },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl cursor-pointer hover:bg-white transition-all group">
                <input type="checkbox" className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{item.q}</p>
                  <p className="text-[11px] text-on-surface-variant">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <Link
            href="/survey"
            className="block w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold shadow-lg active:scale-95 duration-200 transition-transform text-center"
          >
            다시 분석하기
          </Link>
        </section>

        {/* Today's Keywords */}
        {report.today_keywords && report.today_keywords.length > 0 && (
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">오늘의 투자 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {report.today_keywords.map((keyword, i) => (
                <span key={i} className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-medium">
                  #{keyword}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Today's Letter */}
        {report.today_letter && (
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <p className="text-xs font-bold text-on-surface-variant mb-3">오늘의 편지</p>
            <div className="text-on-surface text-sm leading-relaxed whitespace-pre-line">
              {report.today_letter}
            </div>
          </section>
        )}

        {/* Market Mood */}
        <section
          className="relative overflow-hidden rounded-xl h-48 flex items-end p-6 group cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #006b1b 0%, #005d16 50%, #00656f 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="relative z-10 text-white space-y-1">
            <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded uppercase">Exclusive</span>
            <h4 className="text-lg font-bold">이번 주 시장 심리 리포트 읽기</h4>
            <p className="text-xs opacity-80">거래량 분석을 통한 큰손들의 움직임 포착</p>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/history"
            className="flex-1 text-center bg-surface-container-lowest text-on-surface font-bold py-3 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            히스토리
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Dear,ANT - 투자 컨디션 리포트',
                  text: `투자 컨디션: ${condition.label}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast('링크가 복사되었어요');
              }
            }}
            className="flex-1 text-center bg-surface-container-lowest text-on-surface font-bold py-3 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            공유하기
          </button>
        </div>
      </div>
    </main>
  );
}
