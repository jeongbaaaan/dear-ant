const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "장정빈";
pres.title = "IT 기획 / 프로덕트 매니저 포트폴리오";

// Color palette
const C = {
  dark: "1A1035",
  purple: "A855F7",
  purpleDark: "7C3AED",
  purpleLight: "E9D5FF",
  purpleBg: "F5F0FF",
  mint: "14B8A6",
  mintLight: "CCFBF1",
  slate: "334155",
  slateLight: "94A3B8",
  white: "FFFFFF",
  offWhite: "FAFAFA",
  warmGray: "F8F7F4",
  accent: "F59E0B",
  rose: "F43F5E",
  blue: "3B82F6",
  green: "10B981",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.1, angle: 135 });
const makeShadowLight = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06, angle: 135 });

// ============================================
// SLIDE 1: 표지
// ============================================
let slide = pres.addSlide();
slide.background = { color: C.dark };

// Decorative shapes
slide.addShape(pres.shapes.OVAL, { x: -1.5, y: -1.5, w: 4, h: 4, fill: { color: C.purple, transparency: 85 } });
slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 3, w: 5, h: 5, fill: { color: C.mint, transparency: 85 } });
slide.addShape(pres.shapes.OVAL, { x: 3, y: 4, w: 3, h: 3, fill: { color: C.purple, transparency: 90 } });

// Left accent bar
slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.06, h: 2.8, fill: { color: C.purple } });

// Name and title
slide.addText("장정빈", { x: 1.1, y: 1.3, w: 6, h: 0.9, fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("IT 기획 / 프로덕트 매니저", { x: 1.1, y: 2.1, w: 6, h: 0.6, fontSize: 22, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("Portfolio 2026", { x: 1.1, y: 2.7, w: 6, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Tagline
slide.addText("클라우드 기반 서비스 기획 · AI 제품 PM · 사용자 중심 문제 해결", {
  x: 1.1, y: 3.5, w: 6, h: 0.4, fontSize: 12, fontFace: "Arial", color: "CBD5E1", margin: 0
});

// Contact info bottom
slide.addText("apple22by33@naver.com  |  +82-10-8550-8464", {
  x: 0.8, y: 4.9, w: 9, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 2: 자기소개 + 핵심 성과
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("About Me", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("핵심 성과 요약", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Introduction text
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 8.6, h: 1.2, fill: { color: C.white }, shadow: makeShadowLight() });
slide.addText([
  { text: "사용자의 불편을 기술로 해결하는 과정을 즐기며, ", options: { fontSize: 13, color: C.slate } },
  { text: "클라우드 기반 서비스 설계", options: { fontSize: 13, color: C.purple, bold: true } },
  { text: "와 ", options: { fontSize: 13, color: C.slate } },
  { text: "고객 중심 사고", options: { fontSize: 13, color: C.purple, bold: true } },
  { text: "를 접목합니다.", options: { fontSize: 13, color: C.slate, breakLine: true } },
  { text: "AWS 해커톤 대상 수상, CQRS 패턴 기반 DB 설계, AI 챗봇 PM 경험을 통해 비즈니스와 기술 사이의 간극을 메우는 역할을 수행해왔습니다.", options: { fontSize: 12, color: C.slateLight } }
], { x: 1.0, y: 1.65, w: 8.0, h: 0.9, valign: "middle" });

// 4 stat cards
const stats = [
  { num: "70+", label: "관리 고객 계정 수", color: C.purple },
  { num: "1위", label: "AWS 해커톤 대상", color: C.mint },
  { num: "6개", label: "AWS 공인 교육 이수", color: C.blue },
  { num: "IH", label: "OPIc 비즈니스 영어", color: C.accent },
];

stats.forEach((s, i) => {
  const x = 0.7 + i * 2.2;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 3.0, w: 2.0, h: 1.6, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 3.0, w: 2.0, h: 0.06, fill: { color: s.color } });
  slide.addText(s.num, { x, y: 3.2, w: 2.0, h: 0.7, fontSize: 30, fontFace: "Arial Black", color: s.color, align: "center", bold: true, margin: 0 });
  slide.addText(s.label, { x, y: 3.9, w: 2.0, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// Education
slide.addText("가천대학교 경제학과 졸업 (3.6/4.5)  ·  오클라호마 주립대 교환학생  ·  경력 2년 5개월", {
  x: 0.7, y: 4.9, w: 8.6, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 3: 경력 타임라인
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Career", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("경력 타임라인", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Timeline line
slide.addShape(pres.shapes.LINE, { x: 2.5, y: 1.7, w: 0, h: 3.4, line: { color: C.purpleLight, width: 2 } });

const careers = [
  { period: "2024.11 ~ 재직중", title: "스마일샤크", role: "Account Manager · 정규직", desc: "70+ 고객 클라우드 인프라 운영, Lambda 리사이징 제안, PoC 기획", color: C.purple },
  { period: "2024.01 ~ 2024.07", title: "AWS CloudSchool 4기", role: "DB Lead / Frontend / PM", desc: "CQRS 패턴 설계, 비용 최적화, Frontend 개발", color: C.mint },
  { period: "2023.11 ~ 2023.12", title: "네이버클라우드", role: "기획 · 프리랜서", desc: "Clova X AI 챗봇 PM, 프롬프트 데이터셋 구축", color: C.blue },
  { period: "2023.10 ~ 2023.11", title: "신한은행", role: "기획 · 프리랜서", desc: "KFC 배리어프리 매장 서비스 기획", color: C.accent },
];

careers.forEach((c, i) => {
  const y = 1.7 + i * 0.85;
  // Dot on timeline
  slide.addShape(pres.shapes.OVAL, { x: 2.38, y: y + 0.15, w: 0.24, h: 0.24, fill: { color: c.color } });
  // Period (left)
  slide.addText(c.period, { x: 0.3, y, w: 2.0, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.slateLight, align: "right", margin: 0 });
  // Content card (right)
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.9, y, w: 6.5, h: 0.7, fill: { color: C.offWhite }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.9, y, w: 0.06, h: 0.7, fill: { color: c.color } });
  slide.addText(c.title, { x: 3.15, y: y - 0.05, w: 3, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
  slide.addText(c.role, { x: 6.0, y: y - 0.05, w: 3, h: 0.4, fontSize: 10, fontFace: "Arial", color: c.color, align: "right", margin: 0 });
  slide.addText(c.desc, { x: 3.15, y: y + 0.3, w: 6.0, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0 });
});

// ============================================
// SLIDE 4: Dear,ANT 서비스 기획 개요
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Project 01", { x: 0.7, y: 0.3, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("Dear,ANT 서비스 기획", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 30, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("AI 기반 투자 판단 성향 리포트 서비스", { x: 0.7, y: 1.2, w: 8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.purple, margin: 0 });

// Problem section
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 4.2, h: 2.5, fill: { color: "221840" } });
slide.addText("배경 및 문제 인식", { x: 0.9, y: 1.9, w: 3.8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.rose, bold: true, margin: 0 });
slide.addText([
  { text: "개미 투자자의 70%가 감정에 의한 매매를 경험", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "투자 판단을 객관적으로 기록·분석할 도구 부재", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "기존 투자 앱은 수익률에만 집중, 감정 관리 부재", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "바이오리듬·감정·투자성향 복합 분석 서비스 없음", options: { bullet: true, fontSize: 11, color: "CBD5E1" } },
], { x: 0.9, y: 2.35, w: 3.8, h: 1.8, paraSpaceAfter: 6 });

// Solution section
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.8, w: 4.2, h: 2.5, fill: { color: "221840" } });
slide.addText("솔루션 (기획 목표)", { x: 5.3, y: 1.9, w: 3.8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText([
  { text: "7가지 투자 성향 설문 기반 AI 리포트 생성", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "등급(A~F) + 판단 모드로 투자 컨디션 진단", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "바이오리듬(신체·감정·지성) 복합 분석 제공", options: { bullet: true, breakLine: true, fontSize: 11, color: "CBD5E1" } },
  { text: "트레이딩 저널로 매매 감정 패턴 추적", options: { bullet: true, fontSize: 11, color: "CBD5E1" } },
], { x: 5.3, y: 2.35, w: 3.8, h: 1.8, paraSpaceAfter: 6 });

// Role & period
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.5, w: 8.6, h: 0.06, fill: { color: C.purple, transparency: 60 } });
slide.addText([
  { text: "역할: ", options: { fontSize: 11, color: C.slateLight } },
  { text: "서비스 기획, UX 설계, IA 작성, 기능 정의, 프로토타이핑", options: { fontSize: 11, color: C.white, bold: true } },
  { text: "   |   기간: ", options: { fontSize: 11, color: C.slateLight } },
  { text: "2025.03 (1인 프로젝트)", options: { fontSize: 11, color: C.white, bold: true } },
], { x: 0.7, y: 4.65, w: 8.6, h: 0.4, margin: 0 });

// Tech tags
slide.addText("Next.js 16  ·  TypeScript  ·  React 19  ·  Tailwind CSS 4  ·  Supabase", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 5: Dear,ANT UX 플로우
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("UX Flow", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("사용자 여정 설계", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Flow steps
const flowSteps = [
  { step: "01", title: "홈", desc: "CTA 카드\n기능 허브", color: C.purple },
  { step: "02", title: "정보입력", desc: "생년월일\n기분 선택", color: C.purpleDark },
  { step: "03", title: "설문", desc: "7가지 질문\n진행률 바", color: C.blue },
  { step: "04", title: "로딩", desc: "AI 분석 중\n캐릭터 애니", color: C.mint },
  { step: "05", title: "리포트", desc: "등급·모드\n바이오리듬", color: C.green },
  { step: "06", title: "히스토리", desc: "트렌드 차트\n통계 대시보드", color: C.accent },
];

flowSteps.forEach((f, i) => {
  const x = 0.5 + i * 1.55;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.7, w: 1.35, h: 1.8, fill: { color: C.offWhite }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.7, w: 1.35, h: 0.05, fill: { color: f.color } });
  slide.addText(f.step, { x, y: 1.85, w: 1.35, h: 0.35, fontSize: 20, fontFace: "Arial Black", color: f.color, align: "center", bold: true, margin: 0 });
  slide.addText(f.title, { x, y: 2.2, w: 1.35, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, align: "center", bold: true, margin: 0 });
  slide.addText(f.desc, { x, y: 2.55, w: 1.35, h: 0.8, fontSize: 10, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
  // Arrow
  if (i < flowSteps.length - 1) {
    slide.addText(">", { x: x + 1.35, y: 2.2, w: 0.2, h: 0.35, fontSize: 16, color: C.slateLight, align: "center", margin: 0 });
  }
});

// IA Structure
slide.addText("Information Architecture (IA)", { x: 0.7, y: 3.8, w: 8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const iaItems = [
  { name: "홈 /", sub: "CTA · 기능카드 · 명언" },
  { name: "/survey", sub: "3단계: 정보→질문→로딩" },
  { name: "/result/[id]", sub: "등급·모드·지표·편지" },
  { name: "/history", sub: "대시보드·전체기록" },
  { name: "/memo", sub: "전체·포트폴리오·감정" },
  { name: "/tools", sub: "적금vs투자·복리" },
];

iaItems.forEach((item, i) => {
  const x = 0.5 + i * 1.55;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.3, w: 1.35, h: 0.8, fill: { color: C.purpleBg } });
  slide.addText(item.name, { x, y: 4.3, w: 1.35, h: 0.4, fontSize: 10, fontFace: "Consolas", color: C.purple, align: "center", bold: true, margin: 0 });
  slide.addText(item.sub, { x, y: 4.65, w: 1.35, h: 0.45, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// ============================================
// SLIDE 6: Dear,ANT 핵심 기획 산출물
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("기획 산출물", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("핵심 서비스 설계", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// 7 Questions system
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 4.2, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
slide.addText("7가지 투자 성향 질문 설계", { x: 0.9, y: 1.6, w: 3.8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
const questions = [
  "손실 대응 (-10% 상황)",
  "뉴스 영향도 (호재 반응)",
  "수익 실현 (+20% 상황)",
  "투자 스타일 (리스크 선호)",
  "의사결정 기준 (판단 근거)",
  "시장 급락 대응",
  "일일 확인 빈도",
];
slide.addText(
  questions.map((q, i) => ({
    text: `${i+1}. ${q}`,
    options: { bullet: false, breakLine: i < questions.length - 1, fontSize: 11, color: C.slate }
  })),
  { x: 0.9, y: 2.1, w: 3.8, h: 2.5, paraSpaceAfter: 4 }
);
slide.addText("각 질문 3개 선택지 · 점수 (20~85) · 가중 평균 산출", { x: 0.9, y: 4.4, w: 3.8, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Right column: Grade system + Decision modes
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.2, h: 1.5, fill: { color: C.white }, shadow: makeShadow() });
slide.addText("등급 시스템 (A ~ F)", { x: 5.3, y: 1.6, w: 3.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
const grades = [
  { g: "A", desc: "최적 투자 컨디션", c: C.green },
  { g: "B", desc: "양호한 상태", c: C.blue },
  { g: "C", desc: "주의 필요", c: C.accent },
  { g: "D", desc: "투자 자제 권고", c: "F97316" },
  { g: "F", desc: "투자 중단 권고", c: C.rose },
];
grades.forEach((g, i) => {
  const x = 5.3 + i * 0.78;
  slide.addText(g.g, { x, y: 2.0, w: 0.65, h: 0.4, fontSize: 18, fontFace: "Arial Black", color: g.c, align: "center", bold: true, margin: 0 });
  slide.addText(g.desc, { x: x - 0.1, y: 2.4, w: 0.85, h: 0.35, fontSize: 7, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// Decision modes
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 3.2, w: 4.2, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
slide.addText("판단 모드 (4가지)", { x: 5.3, y: 3.3, w: 3.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.purpleDark, bold: true, margin: 0 });

const modes = [
  { name: "방어", desc: "자산 보호 모드", color: C.blue },
  { name: "관망", desc: "시장 관찰 모드", color: C.accent },
  { name: "신중", desc: "균형 잡힌 판단", color: C.green },
  { name: "적극", desc: "기회 포착 행동", color: C.rose },
];
modes.forEach((m, i) => {
  const x = 5.3 + i * 0.95;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 3.75, w: 0.85, h: 1.0, fill: { color: C.offWhite } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 3.75, w: 0.85, h: 0.05, fill: { color: m.color } });
  slide.addText(m.name, { x, y: 3.85, w: 0.85, h: 0.4, fontSize: 13, fontFace: "Arial", color: m.color, align: "center", bold: true, margin: 0 });
  slide.addText(m.desc, { x, y: 4.2, w: 0.85, h: 0.4, fontSize: 8, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// ============================================
// SLIDE 7: Dear,ANT 기능 기획 상세
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("기능 기획", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("서비스 기능 상세 설계", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Feature 1: Trading Journal
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.6, w: 2.8, h: 3.2, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.6, w: 2.8, h: 0.05, fill: { color: C.green } });
slide.addText("트레이딩 저널", { x: 0.9, y: 1.75, w: 2.4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
slide.addText([
  { text: "3탭 구조 설계", options: { bold: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "전체 메모", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "종목 CRUD (매수/매도/보유/관심)", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "포트폴리오", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "종목별 현황, 실현 손익 분석", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "감정 분석", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "등급별 매매 패턴, 인사이트", options: { bullet: true, indentLevel: 1, fontSize: 9, color: C.slateLight } },
], { x: 0.9, y: 2.15, w: 2.4, h: 2.4, paraSpaceAfter: 2 });

// Feature 2: Calculators
slide.addShape(pres.shapes.RECTANGLE, { x: 3.7, y: 1.6, w: 2.8, h: 3.2, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.7, y: 1.6, w: 2.8, h: 0.05, fill: { color: C.blue } });
slide.addText("금융 계산기", { x: 3.9, y: 1.75, w: 2.4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
slide.addText([
  { text: "적금 vs 투자 비교", options: { bold: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "단리 적금 계산 (이자소득세 반영)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "4가지 주식 시나리오 (낙관~최악)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "CompareBar 시각화", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "복리 계산기", options: { bold: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "연도별 성장 SVG 차트", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "단리 vs 복리 비교", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "억/만원 단위 포맷팅", options: { bullet: true, fontSize: 9, color: C.slateLight } },
], { x: 3.9, y: 2.15, w: 2.4, h: 2.4, paraSpaceAfter: 2 });

// Feature 3: Report & History
slide.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 1.6, w: 2.8, h: 3.2, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 1.6, w: 2.8, h: 0.05, fill: { color: C.purple } });
slide.addText("리포트 & 히스토리", { x: 6.9, y: 1.75, w: 2.4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
slide.addText([
  { text: "AI 리포트 생성", options: { bold: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "투자 등급 + 판단 모드", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "바이오리듬 3축 분석", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "오늘의 편지 (개인화)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "히스토리 대시보드", options: { bold: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "SVG 트렌드 차트 (최근 7회)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "평균 통계, 주요 모드 분석", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slateLight } },
  { text: "이전 리포트 비교 (↑↓ 배지)", options: { bullet: true, fontSize: 9, color: C.slateLight } },
], { x: 6.9, y: 2.15, w: 2.4, h: 2.4, paraSpaceAfter: 2 });

// ============================================
// SLIDE 8: Clova X AI 챗봇
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Project 02", { x: 0.7, y: 0.3, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("AI 앱 채팅 서비스 기획", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("네이버클라우드  |  2023.11 ~ 2023.12  |  PM, UX 기획, 프롬프트 엔지니어링", {
  x: 0.7, y: 1.2, w: 8, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0
});

// 3 columns
const clovaRoles = [
  { title: "PM (프로젝트 관리)", items: ["프로젝트 일정 관리 및 산출물 정의", "메뉴구조도(IA) 작성", "사용자 인터뷰 기반 UX 흐름 설계", "대화 시작 → 컨텍스트 유지 → 응답 피드백 루프"], color: C.purple },
  { title: "프롬프트 엔지니어링", items: ["Clova X 모델 특성 맞춤 데이터셋 구축", "반복 테스트 및 품질 개선", "Few-shot 예시 기반 답변 구조 설계", "프롬프트 구조화 → 수정사이클 3회→1회"], color: C.mint },
  { title: "개발자 협업", items: ["기획 요구사항 → API 스펙 변환", "개발팀과 주간 싱크 진행", "Figma 와이어프레임 리뷰", "QA 체크리스트 운영"], color: C.blue },
];

clovaRoles.forEach((r, i) => {
  const x = 0.7 + i * 3.05;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w: 2.85, h: 2.8, fill: { color: "221840" } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w: 2.85, h: 0.05, fill: { color: r.color } });
  slide.addText(r.title, { x: x + 0.15, y: 1.95, w: 2.55, h: 0.35, fontSize: 13, fontFace: "Arial", color: r.color, bold: true, margin: 0 });
  slide.addText(
    r.items.map((item, j) => ({ text: item, options: { bullet: true, breakLine: j < r.items.length - 1, fontSize: 10, color: "CBD5E1" } })),
    { x: x + 0.15, y: 2.4, w: 2.55, h: 2.0, paraSpaceAfter: 4 }
  );
});

// Result
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.8, w: 8.6, h: 0.06, fill: { color: C.mint, transparency: 60 } });
slide.addText("성과: 챗봇 응답 정확도 개선 (수정 사이클 3회 → 1회)  |  일정 내 기획 산출물 100% 완성", {
  x: 0.7, y: 4.95, w: 8.6, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.white, margin: 0
});

// ============================================
// SLIDE 9: AWS 경매 웹사이트
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Project 03", { x: 0.7, y: 0.3, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("AWS 클라우드 경매 웹사이트", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });
slide.addText("AWS CloudSchool 4기  |  2024.05 ~ 2024.07  |  부팀장, DB 리더, Frontend 지원", {
  x: 0.7, y: 1.2, w: 8, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0
});

// Left: CQRS
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 4.2, h: 3.0, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 0.06, h: 3.0, fill: { color: C.purple } });
slide.addText("CQRS 패턴 DB 설계", { x: 1.0, y: 1.9, w: 3.7, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText([
  { text: "Command(쓰기)와 Query(읽기) 역할 분리", options: { bullet: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "실시간 입찰 시 쓰기 부하 집중 문제 해결", options: { bullet: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "MySQL Read Replica로 조회 성능 최적화", options: { bullet: true, breakLine: true, fontSize: 11, color: C.slate } },
  { text: "RDS Multi-AZ 설정으로 고가용성 확보", options: { bullet: true, fontSize: 11, color: C.slate } },
], { x: 1.0, y: 2.4, w: 3.7, h: 2.0, paraSpaceAfter: 6 });

// Right: Cost optimization + Results
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.8, w: 4.2, h: 1.3, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.8, w: 0.06, h: 1.3, fill: { color: C.mint } });
slide.addText("비용 최적화", { x: 5.35, y: 1.9, w: 3.7, h: 0.3, fontSize: 15, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText([
  { text: "RI vs On-Demand 비용 분석", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "S3 Intelligent-Tiering으로 스토리지 절감", options: { bullet: true, fontSize: 10, color: C.slate } },
], { x: 5.35, y: 2.25, w: 3.7, h: 0.7, paraSpaceAfter: 4 });

// Result cards
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 3.3, w: 2.0, h: 1.0, fill: { color: C.purple, transparency: 90 } });
slide.addText("2x", { x: 5.1, y: 3.35, w: 2.0, h: 0.55, fontSize: 28, fontFace: "Arial Black", color: C.purple, align: "center", bold: true, margin: 0 });
slide.addText("이론적 처리량 향상", { x: 5.1, y: 3.85, w: 2.0, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 3.3, w: 2.0, h: 1.0, fill: { color: C.mint, transparency: 90 } });
slide.addText("30%", { x: 7.3, y: 3.35, w: 2.0, h: 0.55, fontSize: 28, fontFace: "Arial Black", color: C.mint, align: "center", bold: true, margin: 0 });
slide.addText("월 운영비 절감 가능", { x: 7.3, y: 3.85, w: 2.0, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

// Tech tags
slide.addText("AWS RDS  ·  EC2  ·  S3  ·  CloudFront  ·  MySQL  ·  CQRS", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 10: 스마일샤크 AM 컨설팅
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Project 04", { x: 0.7, y: 0.3, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("클라우드 인프라 운영 & AM 컨설팅", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });
slide.addText("스마일샤크  |  2024.11 ~ 재직중  |  Account Manager, 인프라 컨설턴트", {
  x: 0.7, y: 1.2, w: 8, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0
});

// Lambda case
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 5.5, h: 2.6, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 5.5, h: 0.05, fill: { color: C.purple } });
slide.addText("핵심 사례: Lambda 이미지 리사이징 제안", { x: 0.9, y: 1.95, w: 5.1, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });

// Flow diagram
const flowParts = [
  { label: "S3 원본\n이미지 저장", x: 1.0, color: C.rose },
  { label: "Lambda\n자동 리사이징", x: 2.6, color: C.purple },
  { label: "CloudFront\n배포", x: 4.2, color: C.mint },
];
flowParts.forEach((f, i) => {
  slide.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 2.5, w: 1.4, h: 0.7, fill: { color: C.offWhite } });
  slide.addText(f.label, { x: f.x, y: 2.5, w: 1.4, h: 0.7, fontSize: 10, fontFace: "Arial", color: f.color, align: "center", valign: "middle", bold: true, margin: 0 });
  if (i < flowParts.length - 1) {
    slide.addText("-->", { x: f.x + 1.4, y: 2.5, w: 0.6, h: 0.7, fontSize: 14, color: C.slateLight, align: "center", valign: "middle", margin: 0 });
  }
});

slide.addText("결과: 스토리지 용량 60% 절감 (예상), 이미지 로딩 속도 대폭 향상", {
  x: 0.9, y: 3.4, w: 5.1, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.green, bold: true, margin: 0
});

// Right stat cards
const amStats = [
  { num: "70+", label: "관리 계정 수", color: C.purple },
  { num: "60%", label: "스토리지 절감", color: C.mint },
  { num: "다수", label: "PoC 성공 사례", color: C.accent },
];
amStats.forEach((s, i) => {
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.8 + i * 0.9, w: 2.8, h: 0.75, fill: { color: C.white }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.8 + i * 0.9, w: 0.06, h: 0.75, fill: { color: s.color } });
  slide.addText(s.num, { x: 6.7, y: 1.8 + i * 0.9, w: 1.0, h: 0.75, fontSize: 22, fontFace: "Arial Black", color: s.color, valign: "middle", bold: true, margin: 0 });
  slide.addText(s.label, { x: 7.7, y: 1.8 + i * 0.9, w: 1.5, h: 0.75, fontSize: 11, fontFace: "Arial", color: C.slateLight, valign: "middle", margin: 0 });
});

// Other contributions
slide.addText([
  { text: "비용 최적화 컨설팅: ", options: { bold: true, fontSize: 10, color: C.slate } },
  { text: "Cost Explorer 분석, RI 전환 권고, S3 Lifecycle 설정", options: { fontSize: 10, color: C.slateLight, breakLine: true } },
  { text: "PoC 기획: ", options: { bold: true, fontSize: 10, color: C.slate } },
  { text: "요구사항 수집 → 아키텍처 다이어그램 → 견적 제안  |  MSP Link 진행", options: { fontSize: 10, color: C.slateLight } },
], { x: 0.7, y: 4.6, w: 8.6, h: 0.7, margin: 0 });

// ============================================
// SLIDE 11: 스킬맵 + 자격증
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Skills & Certifications", { x: 0.7, y: 0.4, w: 8, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText("역량 및 자격증", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Skill categories
const skills = [
  { cat: "PM / 기획", items: "UX 흐름 설계, 메뉴구조도(IA), 프로젝트 일정 관리, 스프린트 운영", color: C.purple },
  { cat: "Cloud Infra", items: "AWS EC2 · S3 · Lambda · RDS · CloudFront · Cost Explorer, Docker, Linux", color: C.mint },
  { cat: "DB 설계", items: "MySQL, CQRS 패턴, Read Replica, Multi-AZ, 비용 분석", color: C.blue },
  { cat: "AI 서비스", items: "프롬프트 엔지니어링, 데이터셋 구축, AI 챗봇 UX 기획", color: C.accent },
  { cat: "Dev / Tools", items: "Python, JavaScript, TypeScript, CSS, JIRA, Notion, Figma", color: C.green },
  { cat: "언어", items: "한국어 (모국어) | 영어 비즈니스 레벨 (OPIc IH)", color: C.rose },
];

skills.forEach((s, i) => {
  const y = 1.5 + i * 0.55;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 8.6, h: 0.45, fill: { color: i % 2 === 0 ? C.offWhite : C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 0.06, h: 0.45, fill: { color: s.color } });
  slide.addText(s.cat, { x: 1.0, y, w: 2.0, h: 0.45, fontSize: 12, fontFace: "Arial", color: s.color, bold: true, valign: "middle", margin: 0 });
  slide.addText(s.items, { x: 3.0, y, w: 6.3, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.slate, valign: "middle", margin: 0 });
});

// Certifications
slide.addText("수상 및 자격증", { x: 0.7, y: 4.1, w: 8, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const certs = [
  { name: "AWS Certified Solutions Architect – Associate", date: "2024.07", color: C.purple },
  { name: "AWS Working Backward Idea Hackathon 대상", date: "2024.02", color: C.mint },
  { name: "데이터분석준전문가 ADsP", date: "2023.11", color: C.blue },
  { name: "워드프로세서", date: "2018.10", color: C.slateLight },
];

certs.forEach((c, i) => {
  const x = 0.7 + i * 2.2;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.55, w: 2.0, h: 0.75, fill: { color: C.offWhite } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.55, w: 2.0, h: 0.04, fill: { color: c.color } });
  slide.addText(c.name, { x: x + 0.1, y: 4.6, w: 1.8, h: 0.45, fontSize: 9, fontFace: "Arial", color: C.dark, valign: "middle", margin: 0 });
  slide.addText(c.date, { x: x + 0.1, y: 5.0, w: 1.8, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.slateLight, margin: 0 });
});

// ============================================
// SLIDE 12: 감사합니다
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 3, h: 3, fill: { color: C.purple, transparency: 85 } });
slide.addShape(pres.shapes.OVAL, { x: 7, y: 3.5, w: 4, h: 4, fill: { color: C.mint, transparency: 85 } });

slide.addText("감사합니다", { x: 1, y: 1.5, w: 8, h: 1.0, fontSize: 44, fontFace: "Arial Black", color: C.white, align: "center", bold: true, margin: 0 });
slide.addText("Thank you for your time", { x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.2, w: 3, h: 0.03, fill: { color: C.purple } });

slide.addText([
  { text: "장정빈", options: { fontSize: 16, bold: true, color: C.white, breakLine: true } },
  { text: "apple22by33@naver.com  |  +82-10-8550-8464", options: { fontSize: 12, color: C.slateLight, breakLine: true } },
  { text: "기술 블로그: https://substack.com/@bitbit1", options: { fontSize: 11, color: C.purple } },
], { x: 1, y: 3.5, w: 8, h: 1.5, align: "center" });

// Write file
pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/1_planning_portfolio.pptx" })
  .then(() => console.log("Planning portfolio created!"))
  .catch(err => console.error(err));
