'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { clientStore, StoredReport } from '@/lib/client-store';
import CountUp from '@/components/CountUp';
// ConditionGauge not used here — hero card needs white-on-green gauge (custom inline SVG)

const conditionMap: Record<string, { label: string; emoji: string; desc: string }> = {
  'S': { label: '최상', emoji: '☀️', desc: '오늘은 심리적 안정이 돋보이는 날입니다. 계획된 원칙을 지키기에 가장 적합한 타이밍입니다.' },
  'A': { label: '최상', emoji: '☀️', desc: '오늘은 심리적 안정이 돋보이는 날입니다. 계획된 원칙을 지키기에 가장 적합한 타이밍입니다.' },
  'B': { label: '양호', emoji: '🌤️', desc: '전반적으로 안정적인 컨디션입니다. 원칙에 따라 신중하게 접근하세요.' },
  'C': { label: '보통', emoji: '⛅', desc: '평범한 컨디션입니다. 무리한 매매보다는 관망을 고려해보세요.' },
  'D': { label: '주의', emoji: '🌧️', desc: '감정적 동요가 감지됩니다. 매매를 줄이고 관찰에 집중하세요.' },
  'F': { label: '위험', emoji: '⛈️', desc: '오늘은 매매를 쉬어가는 것이 좋겠습니다. 충분한 휴식을 취하세요.' },
};

const riskLabelMap: Record<string, string> = {
  '높음': '위험',
  '중간': '주의 필요',
  '낮음': '안전',
};

const modeIconMap: Record<string, { icon: string; desc: string }> = {
  '적극': { icon: 'rocket_launch', desc: '컨디션이 좋고 심리가 안정적이에요. 오늘은 적극적인 판단이 가능합니다.' },
  '신중': { icon: 'psychology', desc: '괜찮은 컨디션이지만 신중하게 접근하는 것이 좋겠습니다.' },
  '관망': { icon: 'visibility', desc: '오늘은 시장을 관찰하며 기회를 기다리는 것이 좋겠습니다.' },
  '방어': { icon: 'shield', desc: '리스크 관리에 집중하세요. 기존 포지션 점검을 권장합니다.' },
};

function formatReportDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
}

export default function ResultPage() {
  const params = useParams();
  const { toast } = useToast();
  const [report, setReport] = useState<StoredReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    const id = typeof params.id === 'string' ? params.id : '';
    const found = clientStore.getReport(id);
    setReport(found || null);
    setLoading(false);
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
  const modeInfo = modeIconMap[report.decision_mode] || modeIconMap['관망'];

  // Normalize biorhythm -100~100 -> 0~100
  const bioPhysical = Math.round(((report.biorhythm_physical ?? 0) + 100) / 2);
  const bioEmotional = Math.round(((report.biorhythm_emotional ?? 0) + 100) / 2);
  const bioIntellectual = Math.round(((report.biorhythm_intellectual ?? 0) + 100) / 2);

  // Risk bar width
  const riskBarWidth = report.risk_tendency === '낮음' ? '30%' : report.risk_tendency === '중간' ? '55%' : '80%';
  const riskBarClass = report.risk_tendency === '낮음' ? 'from-primary-container to-primary' : report.risk_tendency === '중간' ? 'from-amber-container to-amber' : 'from-error-container to-error';

  // Grade badge color
  const gradeBadgeClass = grade === 'A' || grade === 'S' ? 'badge-green' : grade === 'B' ? 'badge-blue' : grade === 'C' ? 'badge-amber' : 'badge-red';

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Back link */}
      <Link
        href="/report"
        className="inline-flex items-center gap-1 text-sm text-on-surface-tertiary hover:text-on-surface-secondary transition-colors mb-6"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
        리포트 목록
      </Link>

      {/* Header */}
      <header className="mb-10">
        <p className="text-sm text-on-surface-tertiary mb-1">{formatReportDate(report.created_at)}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
          Dear,<span className="text-primary">ANT</span> Report
        </h1>
        <div className="flex gap-2 flex-wrap">
          <span className="badge badge-green">{report.decision_mode} 모드</span>
          <span className={`badge ${gradeBadgeClass}`}>Grade {grade}</span>
          <span className="badge badge-gray">리스크 {report.risk_tendency}</span>
        </div>
      </header>

      {/* Hero Score Card */}
      <section className="card card-accent rounded-3xl p-8 md:p-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 md:gap-10 items-center">
          {/* Left: Circular Gauge */}
          <div className="flex justify-center">
            <div className="relative" style={{ width: 140, height: 140 }}>
              <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={10} />
                <circle
                  cx={70} cy={70} r={60}
                  fill="none" stroke="#ffffff" strokeWidth={10}
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - Math.min(moodScore, 100) / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <CountUp end={moodScore} duration={800} className="text-[42px] font-extrabold text-white leading-none" />
                <span className="text-sm text-white/70">/ 100</span>
              </div>
            </div>
          </div>

          {/* Center: Score info */}
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[1.5px] text-white/60 mb-2">Today&apos;s Condition</p>
            <p className="text-2xl font-extrabold text-white leading-snug mb-2">
              오늘은 투자하기<br className="hidden md:block" /> {condition.label === '최상' || condition.label === '양호' ? '좋은' : condition.label === '보통' ? '무난한' : '쉬어가야 할'} 날이에요 {condition.emoji}
            </p>
            <p className="text-sm text-white/75 leading-relaxed">{condition.desc}</p>
          </div>

          {/* Right: Grade circle */}
          <div className="flex flex-col items-center">
            <div className="w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center mb-2">
              <span className="text-[32px] font-extrabold text-white">{grade}</span>
            </div>
            <span className="text-xs text-white/60">Investment Grade</span>
          </div>
        </div>
      </section>

      {/* 3-col Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="card card-raised text-center py-5">
          <p className="text-xl font-extrabold text-primary mb-1">{report.decision_mode}</p>
          <p className="text-xs text-on-surface-tertiary">투자 판단 모드</p>
        </div>
        <div className="card card-raised text-center py-5">
          <p className="text-xl font-extrabold text-on-surface mb-1">{report.risk_tendency}</p>
          <p className="text-xs text-on-surface-tertiary">리스크 경향</p>
        </div>
        <div className="card card-raised text-center py-5">
          <p className="text-xl font-extrabold text-on-surface mb-1"><CountUp end={moodScore} suffix="%" /></p>
          <p className="text-xs text-on-surface-tertiary">감정 안정도</p>
        </div>
      </div>

      {/* 2-col: Biorhythm + Risk/Decision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Left: Biorhythm */}
        <div className="card card-raised">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>waves</span>
            <h3 className="text-lg font-bold text-on-surface">바이오리듬</h3>
          </div>

          {/* SVG 3-color wave chart */}
          <div className="relative h-[160px] rounded-xl bg-surface-container mb-4 overflow-hidden">
            <svg width="100%" height="160" viewBox="0 0 400 160" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="40" x2="400" y2="40" stroke="#f5f5f5" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f5f5f5" strokeWidth="1" strokeDasharray="4" />
              {/* Today marker */}
              <line x1="200" y1="0" x2="200" y2="160" stroke="#006b1b" strokeWidth="1" opacity="0.3" />
              {/* Physical (green) */}
              <path
                d={`M0,${160 - bioPhysical * 1.2} Q50,${160 - bioPhysical * 1.4} 100,${160 - bioPhysical * 1.1} T200,${160 - bioPhysical * 1.6} T300,${160 - bioPhysical * 0.9} T400,${160 - bioPhysical * 1.2}`}
                fill="none" stroke="#006b1b" strokeWidth="2.5" opacity="0.8"
              />
              <circle cx="200" cy={160 - bioPhysical * 1.6} r="5" fill="#006b1b" />
              {/* Emotional (amber) */}
              <path
                d={`M0,${160 - bioEmotional * 0.8} Q50,${160 - bioEmotional * 1.2} 100,${160 - bioEmotional * 1.4} T200,${160 - bioEmotional * 1.0} T300,${160 - bioEmotional * 1.5} T400,${160 - bioEmotional * 0.9}`}
                fill="none" stroke="#f57f17" strokeWidth="2.5" opacity="0.8"
              />
              <circle cx="200" cy={160 - bioEmotional * 1.0} r="5" fill="#f57f17" />
              {/* Intellectual (blue) */}
              <path
                d={`M0,${160 - bioIntellectual * 1.1} Q50,${160 - bioIntellectual * 0.9} 100,${160 - bioIntellectual * 1.3} T200,${160 - bioIntellectual * 1.2} T300,${160 - bioIntellectual * 1.0} T400,${160 - bioIntellectual * 1.4}`}
                fill="none" stroke="#1565c0" strokeWidth="2.5" opacity="0.8"
              />
              <circle cx="200" cy={160 - bioIntellectual * 1.2} r="5" fill="#1565c0" />
              {/* Today label */}
              <text x="200" y="155" textAnchor="middle" fontSize="11" fill="#006b1b" fontWeight="600">오늘</text>
            </svg>
          </div>

          {/* Legend with values */}
          <div className="flex gap-5">
            <div className="flex items-center gap-1.5 text-sm text-on-surface-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />신체
              <span className="font-bold text-primary ml-1">{bioPhysical}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-on-surface-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />감정
              <span className="font-bold text-amber ml-1">{bioEmotional}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-on-surface-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-blue" />지성
              <span className="font-bold text-blue ml-1">{bioIntellectual}%</span>
            </div>
          </div>

          {/* Expandable detail */}
          <div className="border-t border-surface-border mt-5 pt-4">
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="flex items-center gap-1.5 text-sm text-on-surface-tertiary hover:text-on-surface-secondary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, transition: 'transform 0.2s', transform: bioExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              바이오리듬 상세 보기
            </button>
            {bioExpanded && (
              <div className="mt-3 space-y-2 text-sm text-on-surface-secondary">
                <p>신체 리듬 (Physical): 원시값 {report.biorhythm_physical ?? 0}, 정규화 {bioPhysical}%</p>
                <p>감정 리듬 (Emotional): 원시값 {report.biorhythm_emotional ?? 0}, 정규화 {bioEmotional}%</p>
                <p>지성 리듬 (Intellectual): 원시값 {report.biorhythm_intellectual ?? 0}, 정규화 {bioIntellectual}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Risk + Decision Mode */}
        <div className="flex flex-col gap-6">
          {/* Risk bar */}
          <div className="card card-raised flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>shield</span>
              <h3 className="text-lg font-bold text-on-surface">리스크 경향</h3>
            </div>
            <p className="text-[15px] font-bold text-on-surface mb-3">
              현재 리스크: <span className="text-primary">{report.risk_tendency}</span>
            </p>
            <div className="h-3 bg-surface-container rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${riskBarClass} transition-all duration-800`}
                style={{ width: riskBarWidth }}
              />
            </div>
            <div className="flex justify-between text-xs text-on-surface-quaternary">
              <span className={report.risk_tendency === '낮음' ? 'text-primary font-bold' : ''}>낮음</span>
              <span className={report.risk_tendency === '중간' ? 'text-amber font-bold' : ''}>중간</span>
              <span className={report.risk_tendency === '높음' ? 'text-error font-bold' : ''}>높음</span>
            </div>
          </div>

          {/* Decision Mode */}
          <div className="card card-raised flex-1 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>{modeInfo.icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-primary mb-1">{report.decision_mode} 모드</p>
            <p className="text-sm text-on-surface-secondary leading-relaxed">{modeInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Keywords */}
      {report.today_keywords && report.today_keywords.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>label</span>
            <h3 className="text-lg font-bold text-on-surface">오늘의 키워드</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {report.today_keywords.map((keyword, i) => (
              <span
                key={i}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold ${i < 3 ? 'badge-green' : 'badge-gray'}`}
              >
                # {keyword}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Personal Letter */}
      {report.today_letter && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>mail</span>
            <h3 className="text-lg font-bold text-on-surface">오늘의 편지</h3>
          </div>
          <div className="card card-raised p-8">
            {/* Letter header with avatar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-on-surface">Dear,ANT</p>
                <p className="text-xs text-on-surface-tertiary">{formatReportDate(report.created_at)}</p>
              </div>
            </div>
            {/* Letter body */}
            <div className="text-[15px] leading-[1.8] text-on-surface-secondary whitespace-pre-line">
              {report.today_letter}
            </div>
            {/* Signature */}
            <p className="text-sm text-primary font-semibold mt-5 text-right">-- Dear,ANT 드림</p>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-10 flex-wrap">
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
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
          리포트 공유
        </button>
        <button
          onClick={() => { window.print(); }}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
          PDF 저장
        </button>
        <Link
          href="/survey"
          className="btn btn-ghost border border-surface-border inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
          다시 체크하기
        </Link>
      </div>
    </div>
  );
}
