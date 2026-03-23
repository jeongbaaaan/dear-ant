const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();

const C = {
  dark: "0F172A",
  blue: "3B82F6",
  orange: "F97316",
  white: "FFFFFF",
  light: "F1F5F9",
  mid: "94A3B8",
  body: "334155",
  card: "F8FAFC",
  blueLight: "DBEAFE",
  orangeLight: "FED7AA",
  darkAlt: "1E293B",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.title = "포트폴리오_장정빈_2025";
const TOTAL = 15;

function topBar(s) { s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.07, fill: { color: C.blue } }); }
function pageNum(s, n) { s.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7.0, w: 1.5, h: 0.4, fontSize: 9, color: C.mid, fontFace: "Arial", align: "right" }); }
function secTitle(s, t, sub) {
  s.addText(t, { x: 0.7, y: 0.35, w: 10, h: 0.55, fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true });
  if (sub) s.addText(sub, { x: 0.7, y: 0.88, w: 10, h: 0.32, fontSize: 13, fontFace: "Arial", color: C.mid });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.22, w: 1.2, h: 0.05, fill: { color: C.blue } });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill || C.card }, line: { color: "E2E8F0", width: 0.5 }, shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.1 } });
}

// ═══ 1: Cover ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.blue } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 0, w: 2.83, h: 2.5, fill: { color: C.blue }, transparency: 85 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 11, y: 5.5, w: 2.33, h: 2, fill: { color: C.orange }, transparency: 88 });
  s.addText("장정빈 포트폴리오", { x: 1.2, y: 1.5, w: 8, h: 1.0, fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true });
  s.addText("고객의 문제를 기술로, AI로, 직접 해결합니다", { x: 1.2, y: 2.6, w: 8, h: 0.6, fontSize: 20, fontFace: "Arial", color: C.blue });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.4, w: 3.5, h: 0.04, fill: { color: C.orange } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.5, w: 13.33, h: 1.0, fill: { color: "0A0F1E" } });
  s.addText("apple22by33@naver.com   |   +82-10-8550-8464", { x: 1.2, y: 6.7, w: 10, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.mid });
})();

// ═══ 2: 목차 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "목차"); pageNum(s, 2);

  const sections = [
    { num: "01", title: "About Me", desc: "프로필, 핵심 숫자, 커리어 타임라인" },
    { num: "02", title: "스마일샤크", desc: "클라우드 고객 관리 + 비용 최적화 사례" },
    { num: "03", title: "Dear,ANT", desc: "AI 서비스 기획 ~ 개발 ~ 배포 (Claude Code)" },
    { num: "04", title: "Clova X & CloudSchool", desc: "AI 챗봇 기획 + CQRS 아키텍처 설계" },
    { num: "05", title: "AI 활용 역량", desc: "AI로 만들고, 설계하고, 자동화하는 역량" },
    { num: "06", title: "직무 커버리지", desc: "TAM, CSM, SA, AI 컨설턴트, Pre-sales, PM" },
  ];

  sections.forEach((sec, i) => {
    const sy = 1.6 + i * 0.85;
    s.addShape(pptx.shapes.OVAL, { x: 0.7, y: sy + 0.05, w: 0.55, h: 0.55, fill: { color: i % 2 === 0 ? C.blue : C.orange } });
    s.addText(sec.num, { x: 0.7, y: sy + 0.05, w: 0.55, h: 0.55, fontSize: 12, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(sec.title, { x: 1.5, y: sy, w: 4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(sec.desc, { x: 1.5, y: sy + 0.33, w: 8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.mid });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: sy + 0.72, w: 11.9, h: 0.015, fill: { color: "E2E8F0" } });
  });
})();

// ═══ 3: About Me ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "About Me"); pageNum(s, 3);

  s.addText("클라우드 인프라 위에서 고객 문제를 풀고, AI 도구로 서비스를 직접 만듭니다", { x: 0.7, y: 1.45, w: 11, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.blue, italic: true });

  const stats = [
    { n: "70+", l: "관리한 고객 계정", c: C.blue },
    { n: "60%", l: "제안한 비용 절감", c: C.orange },
    { n: "1인", l: "End-to-End 빌드", c: C.blue },
    { n: "1위", l: "AWS 해커톤 대상", c: C.orange },
  ];
  stats.forEach((st, i) => {
    const sx = 0.7 + i * 3.05;
    card(s, sx, 2.1, 2.75, 2.0);
    s.addShape(pptx.shapes.RECTANGLE, { x: sx, y: 2.1, w: 2.75, h: 0.06, fill: { color: st.c } });
    s.addText(st.n, { x: sx, y: 2.45, w: 2.75, h: 0.8, fontSize: 38, fontFace: "Arial Black", color: st.c, bold: true, align: "center" });
    s.addText(st.l, { x: sx + 0.2, y: 3.3, w: 2.35, h: 0.5, fontSize: 12, fontFace: "Arial", color: C.body, align: "center" });
  });

  // Timeline
  s.addText("Career Timeline", { x: 0.7, y: 4.5, w: 5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 5.2, w: 11.9, h: 0.05, fill: { color: C.blue } });

  const timeline = [
    { d: "2023.09", t: "신한은행 IT기획" },
    { d: "2023.11", t: "Clova X AI PM" },
    { d: "2024.01", t: "AWS CloudSchool" },
    { d: "2024.11", t: "스마일샤크 AM" },
    { d: "2025.03", t: "Dear,ANT 런칭" },
  ];
  timeline.forEach((ev, i) => {
    const ex = 0.7 + i * 2.4;
    s.addShape(pptx.shapes.OVAL, { x: ex + 0.55, y: 5.0, w: 0.4, h: 0.4, fill: { color: i % 2 === 0 ? C.blue : C.orange } });
    s.addText(ev.d, { x: ex, y: 5.5, w: 1.6, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.mid, align: "center" });
    s.addText(ev.t, { x: ex, y: 5.8, w: 1.6, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
  });
})();

// ═══ 4: 스마일샤크 개요 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "스마일샤크", "Account Manager  |  2024.11 ~ 현재  |  AWS MSP 파트너"); pageNum(s, 4);

  card(s, 0.7, 1.6, 11.9, 5.2);
  s.addText("70+ 고객 계정의 클라우드 인프라를 관리하며, 현장에서 문제를 발견하고 기술로 해결합니다", { x: 1.0, y: 1.8, w: 11, h: 0.5, fontSize: 13, fontFace: "Arial", color: C.blue });

  const duties = [
    { title: "클라우드 인프라 운영", desc: "EC2, S3, RDS, Lambda, CloudFront 등 70+ 고객사 AWS 리소스 관리" },
    { title: "비용 최적화 컨설팅", desc: "Cost Explorer 분석 → RI 전환 권고 → S3 Lifecycle 정책 설정" },
    { title: "기술 문제 해결", desc: "고객 기술 이슈 분석, 아키텍처 개선 제안, Lambda 자동화 설계" },
    { title: "PoC 기획", desc: "신규 고객사 요구사항 분석 → Well-Architected 기반 아키텍처 → 견적" },
  ];
  duties.forEach((d, i) => {
    const dy = 2.6 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.1, y: dy, w: 2.5, h: 0.4, rectRadius: 0.05, fill: { color: i % 2 === 0 ? C.blue : C.orange } });
    s.addText(d.title, { x: 1.1, y: dy, w: 2.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(d.desc, { x: 3.8, y: dy, w: 8.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.body, valign: "middle" });
  });
})();

// ═══ 5: 스마일샤크 - 사례 1 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "문제 해결 사례", "QR 이미지 비용 문제를 아키텍처로 풀다"); pageNum(s, 5);

  const steps = [
    { title: "발견", body: "고객사 QR 이미지\n원본(3MB) 그대로 저장\n클라이언트 리사이징\n→ 대역폭 낭비", c: "EF4444" },
    { title: "분석", body: "Cost Explorer 확인\n스토리지/전송 비용 급증\n이미지 3MB\n실제 필요 300KB", c: C.blue },
    { title: "제안", body: "S3 업로드 트리거\n→ Lambda 리사이징\n(3MB → 300KB)\n→ CloudFront 배포", c: C.blue },
    { title: "효과", body: "스토리지 60% 절감\n로딩 속도 개선\n대역폭 비용 절감\n자동화 파이프라인", c: "10B981" },
  ];

  steps.forEach((st, i) => {
    const sx = 0.5 + i * 3.15;
    card(s, sx, 1.6, 2.85, 3.0);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: sx + 0.15, y: 1.75, w: 1.0, h: 0.35, rectRadius: 0.05, fill: { color: st.c } });
    s.addText(st.title, { x: sx + 0.15, y: 1.75, w: 1.0, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(st.body, { x: sx + 0.2, y: 2.3, w: 2.45, h: 2.0, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });

  for (let i = 0; i < 3; i++) {
    const ax = 0.5 + (i + 1) * 3.15 - 0.25;
    s.addText("→", { x: ax, y: 2.7, w: 0.35, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.blue, bold: true, align: "center" });
  }

  // Architecture diagram
  s.addText("Architecture", { x: 0.7, y: 4.9, w: 3, h: 0.35, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true });
  const arch = ["User", "S3 Upload", "Lambda\n(resize)", "S3\n(optimized)", "CloudFront", "End User"];
  arch.forEach((a, i) => {
    const ax = 0.5 + i * 2.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: ax, y: 5.4, w: 1.8, h: 0.7, rectRadius: 0.06, fill: { color: i === 2 ? C.orange : C.dark } });
    s.addText(a, { x: ax, y: 5.4, w: 1.8, h: 0.7, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
    if (i < 5) s.addText("→", { x: ax + 1.75, y: 5.4, w: 0.35, h: 0.7, fontSize: 14, fontFace: "Arial", color: C.blue, align: "center", valign: "middle" });
  });
})();

// ═══ 6: 스마일샤크 - 사례 2 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "비용 최적화 컨설팅"); pageNum(s, 6);

  const items = [
    { title: "Cost Explorer 분석 → RI 전환 권고", body: "On-Demand 인스턴스 사용 패턴 분석\n안정적 워크로드를 Reserved Instance로 전환 권고\n→ 예약 인스턴스로 최대 40% 비용 절감 구조" },
    { title: "S3 Lifecycle Policy 최적화", body: "30일 이상 미접근 데이터 → Glacier 자동 이동\nIntelligent-Tiering으로 접근 패턴 기반 자동 최적화\n→ 장기 스토리지 비용 대폭 절감" },
    { title: "신규 고객사 PoC 기획", body: "고객 요구사항 인터뷰 → Well-Architected 기반 아키텍처 설계\nMulti-AZ 고가용성 + 비용 최적화 밸런스\n→ 견적 산출 및 기술 제안서 작성" },
  ];

  items.forEach((item, i) => {
    const iy = 1.5 + i * 1.85;
    card(s, 0.7, iy, 11.9, 1.6);
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: iy, w: 0.08, h: 1.6, fill: { color: i % 2 === 0 ? C.blue : C.orange } });
    s.addText(item.title, { x: 1.1, y: iy + 0.1, w: 11, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(item.body, { x: 1.1, y: iy + 0.55, w: 11, h: 0.9, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });
})();

// ═══ 7: Dear,ANT 소개 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Dear,ANT", "AI 투자 판단 리포트 서비스  |  2025.03"); pageNum(s, 7);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.55, w: 11.9, h: 0.6, rectRadius: 0.06, fill: { color: "FEF3C7" } });
  s.addText("주식 투자의 70%는 감정 판단 — 개미 투자자에겐 자신을 객관적으로 볼 도구가 없다", { x: 1.0, y: 1.58, w: 11.3, h: 0.55, fontSize: 12, fontFace: "Arial", color: C.dark, align: "center" });

  const feats = [
    { title: "투자 성향 리포트", desc: "7문항 설문 → AI 분석\nA~F 등급 판정\n바이오리듬 + 감정 가중치" },
    { title: "트레이딩 저널", desc: "매매 기록 관리\n감정 태깅 + 분석\n대시보드 시각화" },
    { title: "금융 계산기", desc: "복리 계산기\n적금 vs 투자 비교\n시뮬레이션" },
  ];
  feats.forEach((f, i) => {
    const fx = 0.7 + i * 4.0;
    card(s, fx, 2.5, 3.7, 2.2);
    s.addShape(pptx.shapes.RECTANGLE, { x: fx, y: 2.5, w: 3.7, h: 0.06, fill: { color: i % 2 === 0 ? C.blue : C.orange } });
    s.addText(f.title, { x: fx + 0.2, y: 2.7, w: 3.3, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(f.desc, { x: fx + 0.2, y: 3.15, w: 3.3, h: 1.3, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });

  const techs = ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS 4", "Supabase"];
  techs.forEach((t, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 2.1, y: 5.0, w: 1.9, h: 0.38, rectRadius: 0.05, fill: { color: C.dark } });
    s.addText(t, { x: 0.7 + i * 2.1, y: 5.0, w: 1.9, h: 0.38, fontSize: 10, fontFace: "Arial", color: C.white, align: "center" });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.7, w: 11.9, h: 0.65, rectRadius: 0.06, fill: { color: C.blueLight } });
  s.addText("Claude Code와 대화하며 기획 → 설계 → 개발 → 배포까지 1인 End-to-End 완성", { x: 1.0, y: 5.75, w: 11.3, h: 0.55, fontSize: 13, fontFace: "Arial", color: C.blue, bold: true, align: "center" });
})();

// ═══ 8: Dear,ANT 기술 아키텍처 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Dear,ANT 기술 상세", "혼자 설계하고 구현한 풀스택 서비스"); pageNum(s, 8);

  const layers = [
    { title: "Frontend", desc: "Next.js 16 App Router\nReact 19 + Tailwind CSS 4\nCustom SVG 차트/캐릭터", c: C.blue },
    { title: "API Layer", desc: "REST API 5 Endpoints\nApp Router Route Handlers\nJSON Response", c: C.orange },
    { title: "Engine", desc: "바이오리듬 삼각함수\n감정 가중치 알고리즘\n투자무드 산출", c: C.blue },
    { title: "Storage", desc: "Supabase (PostgreSQL)\nIn-memory Fallback\nDual Storage 전략", c: C.orange },
  ];

  layers.forEach((l, i) => {
    const lx = 0.5 + i * 3.15;
    card(s, lx, 1.5, 2.85, 2.8);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: lx + 0.15, y: 1.65, w: 2.55, h: 0.4, rectRadius: 0.05, fill: { color: l.c } });
    s.addText(l.title, { x: lx + 0.15, y: 1.65, w: 2.55, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(l.desc, { x: lx + 0.2, y: 2.25, w: 2.45, h: 1.8, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
    if (i < 3) s.addText("→", { x: lx + 2.75, y: 2.5, w: 0.5, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.blue, align: "center" });
  });

  // Key technical decisions
  s.addText("핵심 기술 결정", { x: 0.7, y: 4.6, w: 5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true });

  const decisions = [
    "Custom SVG로 외부 차트 라이브러리 의존도 제거 → 번들 사이즈 최적화",
    "Dual Storage 전략으로 Supabase 장애 시에도 서비스 지속 가능",
    "App Router 기반 REST API로 별도 백엔드 서버 없이 풀스택 구현",
    "바이오리듬 삼각함수 + 감정 가중치로 투자 성향 정량화 알고리즘 직접 설계",
  ];
  decisions.forEach((d, i) => {
    s.addText(d, { x: 1.0, y: 5.1 + i * 0.4, w: 11.5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.body, bullet: true });
  });
})();

// ═══ 9: Claude Code 빌드 과정 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Claude Code와 함께 만든 2주", "AI 도구를 활용한 1인 풀스택 개발 과정"); pageNum(s, 9);

  const phases = [
    { days: "Day 1-2", title: "기획/설계", desc: "서비스 컨셉 정의\n페이지 구조 설계\nDB 스키마 설계", c: C.blue },
    { days: "Day 3-5", title: "핵심 기능", desc: "설문 시스템 구현\nAI 리포트 엔진\n알고리즘 설계", c: C.orange },
    { days: "Day 6-8", title: "서비스 확장", desc: "트레이딩 저널\n대시보드\n감정 분석", c: C.blue },
    { days: "Day 9-11", title: "마무리", desc: "금융 계산기\nUI 디자인\n반응형 구현", c: C.orange },
    { days: "Day 12-14", title: "v2.0 + 배포", desc: "전면 리디자인\n성능 최적화\nVercel 배포", c: C.blue },
  ];

  // Timeline bar
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 3.25, w: 11.9, h: 0.06, fill: { color: C.blue } });

  phases.forEach((p, i) => {
    const px = 0.3 + i * 2.5;
    // Dot
    s.addShape(pptx.shapes.OVAL, { x: px + 0.65, y: 3.05, w: 0.45, h: 0.45, fill: { color: p.c } });
    // Days above
    s.addText(p.days, { x: px, y: 1.8, w: 2.1, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.mid, align: "center" });
    // Title
    s.addText(p.title, { x: px, y: 2.1, w: 2.1, h: 0.35, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
    // Desc below
    card(s, px, 3.8, 2.1, 1.6);
    s.addText(p.desc, { x: px + 0.1, y: 3.9, w: 1.9, h: 1.4, fontSize: 10.5, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35, align: "center" });
  });

  // Key insight
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.8, w: 11.9, h: 1.0, rectRadius: 0.08, fill: { color: C.blueLight } });
  s.addText("보통 팀 3-4명이 1개월 걸리는 작업을 AI 도구를 활용해 1인이 2주 만에 완성", { x: 1.0, y: 5.85, w: 11.3, h: 0.45, fontSize: 13, fontFace: "Arial", color: C.blue, bold: true, align: "center" });
  s.addText("AI는 코딩을 대신해준 게 아니라, 제가 기획한 것을 빠르게 검증하고 구현하는 도구였습니다", { x: 1.0, y: 6.3, w: 11.3, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.body, align: "center" });
})();

// ═══ 10: Clova X ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Clova X AI 챗봇 기획", "네이버클라우드  |  2023.11~12  |  PM"); pageNum(s, 10);

  s.addText("AI가 잘 대답하게 만드는 건 설계의 문제", { x: 0.7, y: 1.45, w: 10, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.blue, italic: true });

  const process = [
    { num: "1", title: "요구사항 분석", desc: "챗봇이 답변해야 할\n영역 정의", c: C.blue },
    { num: "2", title: "데이터셋 구축", desc: "Few-shot 예시 기반\n프롬프트 설계", c: C.orange },
    { num: "3", title: "품질 검증", desc: "답변 수정 사이클\n3회 → 1회 단축", c: C.blue },
    { num: "4", title: "개발 협업", desc: "기획 → API 스펙 변환\n→ 개발팀 전달", c: C.orange },
  ];

  process.forEach((p, i) => {
    const px = 0.5 + i * 3.15;
    card(s, px, 2.1, 2.85, 2.5);
    s.addShape(pptx.shapes.OVAL, { x: px + 1.05, y: 2.25, w: 0.6, h: 0.6, fill: { color: p.c } });
    s.addText(p.num, { x: px + 1.05, y: 2.25, w: 0.6, h: 0.6, fontSize: 16, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(p.title, { x: px + 0.2, y: 3.0, w: 2.45, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
    s.addText(p.desc, { x: px + 0.2, y: 3.45, w: 2.45, h: 0.9, fontSize: 11, fontFace: "Arial", color: C.body, align: "center", lineSpacingMultiple: 1.3 });
    if (i < 3) s.addText("→", { x: px + 2.75, y: 2.9, w: 0.5, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.blue, align: "center" });
  });

  // Result
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 5.0, w: 6.3, h: 1.0, rectRadius: 0.08, fill: { color: C.blueLight } });
  s.addText([
    { text: "수정 사이클 ", options: { fontSize: 13, fontFace: "Arial", color: C.body } },
    { text: "3회 → 1회 (66% 단축)", options: { fontSize: 18, fontFace: "Arial Black", color: C.blue, bold: true } },
  ], { x: 3.7, y: 5.1, w: 5.9, h: 0.7, align: "center" });
})();

// ═══ 11: CloudSchool ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "AWS CloudSchool", "2024.01~07  |  CQRS 아키텍처 설계  |  부팀장"); pageNum(s, 11);

  s.addText("CQRS 패턴으로 성능과 비용을 동시에 잡다", { x: 0.7, y: 1.45, w: 10, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.blue, italic: true });

  // CQRS diagram
  card(s, 0.7, 2.0, 7.0, 3.0);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 2.4, w: 2.0, h: 0.55, rectRadius: 0.06, fill: { color: C.blue } });
  s.addText("Command (Write)", { x: 1.0, y: 2.4, w: 2.0, h: 0.55, fontSize: 10.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });
  s.addText("→", { x: 3.1, y: 2.4, w: 0.5, h: 0.55, fontSize: 18, fontFace: "Arial", color: C.dark, align: "center" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.7, y: 2.4, w: 1.8, h: 0.55, rectRadius: 0.06, fill: { color: C.dark } });
  s.addText("Primary DB", { x: 3.7, y: 2.4, w: 1.8, h: 0.55, fontSize: 10.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 3.3, w: 2.0, h: 0.55, rectRadius: 0.06, fill: { color: C.orange } });
  s.addText("Query (Read)", { x: 1.0, y: 3.3, w: 2.0, h: 0.55, fontSize: 10.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });
  s.addText("→", { x: 3.1, y: 3.3, w: 0.5, h: 0.55, fontSize: 18, fontFace: "Arial", color: C.dark, align: "center" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.7, y: 3.3, w: 1.8, h: 0.55, rectRadius: 0.06, fill: { color: "475569" } });
  s.addText("Read Replica", { x: 3.7, y: 3.3, w: 1.8, h: 0.55, fontSize: 10.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  s.addText("Sync", { x: 5.6, y: 2.85, w: 0.8, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.mid, align: "center" });
  s.addText("Multi-AZ 고가용성", { x: 1.0, y: 4.1, w: 5, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.mid });

  // Results
  card(s, 8.1, 2.0, 4.5, 3.0);
  s.addText("성과", { x: 8.3, y: 2.2, w: 3, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.3, y: 2.7, w: 1.3, h: 0.6, rectRadius: 0.06, fill: { color: C.blue } });
  s.addText("2x", { x: 8.3, y: 2.7, w: 1.3, h: 0.6, fontSize: 22, fontFace: "Arial Black", color: C.white, bold: true, align: "center" });
  s.addText("처리량 개선", { x: 9.8, y: 2.7, w: 2.5, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.body, valign: "middle" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.3, y: 3.5, w: 1.3, h: 0.6, rectRadius: 0.06, fill: { color: C.orange } });
  s.addText("30%", { x: 8.3, y: 3.5, w: 1.3, h: 0.6, fontSize: 22, fontFace: "Arial Black", color: C.white, bold: true, align: "center" });
  s.addText("비용 절감", { x: 9.8, y: 3.5, w: 2.5, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.body, valign: "middle" });

  s.addText("AWS 해커톤 대상 (1위) 수상", { x: 8.3, y: 4.3, w: 4, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.orange, bold: true });
})();

// ═══ 12: AI 활용 역량 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "AI 활용 역량", "AI를 '써본' 사람이 아니라 AI로 '만든' 사람입니다"); pageNum(s, 12);

  const caps = [
    { num: "01", title: "서비스 빌드", body: "Claude Code로 Dear,ANT 전체 구축\n대화형으로 코드 생성, 디버깅, 배포\n팀 1개월 → 1인 2주", c: C.blue },
    { num: "02", title: "프롬프트 엔지니어링", body: "Clova X Few-shot 데이터셋 설계\n답변 품질 구조화\n수정 사이클 66% 단축", c: C.orange },
    { num: "03", title: "업무 자동화", body: "기술 문서, 아키텍처 설계,\n코드 리뷰에 AI 활용\n반복 작업 자동화", c: C.blue },
    { num: "04", title: "빠른 검증", body: "아이디어 → 프로토타입 수일 내\n기획 단계에서 직접 만들어 확인\n실패 비용 최소화", c: C.orange },
  ];

  caps.forEach((ca, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cx = 0.7 + col * 6.15;
    const cy = 1.5 + row * 2.6;
    card(s, cx, cy, 5.85, 2.3);
    s.addShape(pptx.shapes.OVAL, { x: cx + 0.2, y: cy + 0.2, w: 0.6, h: 0.6, fill: { color: ca.c } });
    s.addText(ca.num, { x: cx + 0.2, y: cy + 0.2, w: 0.6, h: 0.6, fontSize: 14, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(ca.title, { x: cx + 1.0, y: cy + 0.2, w: 4, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(ca.body, { x: cx + 1.0, y: cy + 0.75, w: 4.5, h: 1.4, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.7, w: 11.9, h: 0.5, rectRadius: 0.05, fill: { color: "FEF3C7" } });
  s.addText("AI를 '써본' 수준이 아니라, AI로 '만들어본' 경험이 있습니다", { x: 1.0, y: 6.73, w: 11.3, h: 0.45, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
})();

// ═══ 13: 직무 커버리지 맵 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "이런 역할을 수행할 수 있습니다"); pageNum(s, 13);

  // Center core skills
  s.addShape(pptx.shapes.OVAL, { x: 5.15, y: 2.6, w: 3.0, h: 2.8, fill: { color: C.blue } });
  s.addText("고객 문제 해결\n(70+ 고객 대응)", { x: 5.15, y: 2.8, w: 3.0, h: 0.7, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center" });
  s.addText("기술 이해\n(AWS, API, DB)", { x: 5.15, y: 3.5, w: 3.0, h: 0.7, fontSize: 10, fontFace: "Arial", color: "C7D2FE", align: "center" });
  s.addText("AI 도구 활용\n(Claude Code, Prompt)", { x: 5.15, y: 4.2, w: 3.0, h: 0.7, fontSize: 10, fontFace: "Arial", color: "93C5FD", align: "center" });

  const jobs = [
    { title: "TAM", desc: "고객 기술 이슈를 분석하고\n해결책을 가이드", src: "스마일샤크 직결", x: 0.3, y: 1.2, c: C.blue },
    { title: "CSM", desc: "고객 온보딩 + 제품 활용\n극대화 설계", src: "70+ 고객 관리", x: 4.5, y: 0.2, c: C.orange },
    { title: "Solutions\nConsultant", desc: "고객 요구사항 분석\n최적 솔루션 제안", src: "PoC + 아키텍처", x: 9.0, y: 1.2, c: C.blue },
    { title: "AI\nConsultant", desc: "AI 도구로 고객\n업무 자동화", src: "Claude Code + Clova X", x: 0.3, y: 5.3, c: C.orange },
    { title: "Pre-sales", desc: "기술 데모와 PoC로\n가치 증명", src: "PoC + 기술 제안", x: 4.5, y: 6.2, c: C.blue },
    { title: "B2B SaaS\nPM", desc: "고객 피드백 → 제품\n개선 반영", src: "PM + 직접 빌드", x: 9.0, y: 5.3, c: C.orange },
  ];

  jobs.forEach((j) => {
    card(s, j.x, j.y, 3.8, 1.4);
    s.addShape(pptx.shapes.RECTANGLE, { x: j.x, y: j.y, w: 0.08, h: 1.4, fill: { color: j.c } });
    s.addText(j.title, { x: j.x + 0.2, y: j.y + 0.1, w: 1.4, h: 0.65, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(j.desc, { x: j.x + 1.6, y: j.y + 0.05, w: 2.0, h: 0.7, fontSize: 9.5, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.25 });
    s.addText(j.src, { x: j.x + 1.6, y: j.y + 0.8, w: 2.0, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.mid, italic: true });
  });
})();

// ═══ 14: 자격증 & 교육 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "자격증 & 교육"); pageNum(s, 14);

  card(s, 0.7, 1.6, 5.8, 4.5);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 1.75, w: 2.0, h: 0.38, rectRadius: 0.05, fill: { color: C.blue } });
  s.addText("Certifications", { x: 0.9, y: 1.75, w: 2.0, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  const certs = [
    { name: "AWS Solutions Architect Associate", tag: "SAA", d: "2024.07", a: false },
    { name: "AWS Hackathon 대상 (1위)", tag: "대상", d: "2024.02", a: true },
    { name: "ADsP (데이터분석 준전문가)", tag: "ADsP", d: "2023.11", a: false },
    { name: "OPIc IH (영어)", tag: "OPIc", d: "2024.04", a: false },
  ];
  certs.forEach((c, i) => {
    const cy = 2.4 + i * 0.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: cy, w: 0.9, h: 0.38, rectRadius: 0.05, fill: { color: c.a ? C.orange : C.blueLight } });
    s.addText(c.tag, { x: 1.0, y: cy, w: 0.9, h: 0.38, fontSize: 9.5, fontFace: "Arial", color: c.a ? C.white : C.blue, bold: true, align: "center" });
    s.addText(c.name, { x: 2.1, y: cy, w: 3.5, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.body, valign: "middle" });
    s.addText(c.d, { x: 5.3, y: cy, w: 1.0, h: 0.38, fontSize: 9.5, fontFace: "Arial", color: C.mid, align: "right" });
  });

  card(s, 6.85, 1.6, 5.8, 4.5);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.05, y: 1.75, w: 2.8, h: 0.38, rectRadius: 0.05, fill: { color: C.orange } });
  s.addText("AWS Official Training (6)", { x: 7.05, y: 1.75, w: 2.8, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  const trains = ["Developing Serverless Solutions", "DevOps Engineering on AWS", "Developing on AWS", "Well-Architected Best Practices", "Technical Essentials", "Security Essentials"];
  trains.forEach((t, i) => {
    const ty = 2.4 + i * 0.6;
    s.addShape(pptx.shapes.RECTANGLE, { x: 7.05, y: ty + 0.05, w: 0.06, h: 0.28, fill: { color: C.orange } });
    s.addText(t, { x: 7.35, y: ty, w: 5, h: 0.38, fontSize: 10.5, fontFace: "Arial", color: C.body, valign: "middle" });
  });
})();

// ═══ 15: Thank You ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.blue } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 5, w: 2.83, h: 2.5, fill: { color: C.blue }, transparency: 85 });

  s.addText("감사합니다", { x: 1.2, y: 1.5, w: 10, h: 1.0, fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true });
  s.addText("기술로, AI로, 고객의 문제를 풀겠습니다", { x: 1.2, y: 2.7, w: 10, h: 0.6, fontSize: 20, fontFace: "Arial", color: C.blue });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.5, w: 4.0, h: 0.04, fill: { color: C.orange } });

  const contacts = [
    { k: "Email", v: "apple22by33@naver.com" },
    { k: "Phone", v: "+82-10-8550-8464" },
    { k: "Blog", v: "https://substack.com/@bitbit1" },
  ];
  contacts.forEach((c, i) => {
    const cy = 3.8 + i * 0.55;
    s.addText(c.k, { x: 1.2, y: cy, w: 1.5, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mid, bold: true });
    s.addText(c.v, { x: 2.7, y: cy, w: 6, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.white });
  });

  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.8, w: 13.33, h: 0.7, fill: { color: "0A0F1E" } });
  s.addText("장정빈  |  Cloud Infra  |  AI Service  |  Customer Problem Solving", { x: 1.2, y: 6.85, w: 10, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.mid });
})();

const outPath = "/Users/jeongbin/dear.ant/public/portfolio/포트폴리오_장정빈_2025.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log("PPTX created:", outPath))
  .catch((err) => console.error("Error:", err));
