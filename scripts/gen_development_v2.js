const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "장정빈";
pres.title = "풀스택 개발자 포트폴리오";

const C = {
  dark: "0F172A",
  darkCard: "1E293B",
  purple: "A855F7",
  purpleDark: "7C3AED",
  purpleLight: "E9D5FF",
  mint: "14B8A6",
  mintDark: "0D9488",
  slate: "334155",
  slateLight: "94A3B8",
  white: "FFFFFF",
  offWhite: "F8FAFC",
  rose: "F43F5E",
  blue: "3B82F6",
  green: "10B981",
  amber: "F59E0B",
  cyan: "06B6D4",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.1, angle: 135 });
const makeShadowLight = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06, angle: 135 });

// ============================================
// SLIDE 1: 표지
// ============================================
let slide = pres.addSlide();
slide.background = { color: C.dark };

// Decorative
slide.addShape(pres.shapes.OVAL, { x: 7, y: -2, w: 6, h: 6, fill: { color: C.purple, transparency: 88 } });
slide.addShape(pres.shapes.OVAL, { x: -2, y: 3, w: 5, h: 5, fill: { color: C.mint, transparency: 88 } });

// Code-like decorative text
slide.addText("const portfolio = {", { x: 6.5, y: 0.4, w: 3.5, h: 0.3, fontSize: 10, fontFace: "Consolas", color: C.slateLight, margin: 0 });
slide.addText('  name: "장정빈",', { x: 6.5, y: 0.65, w: 3.5, h: 0.3, fontSize: 10, fontFace: "Consolas", color: C.purple, margin: 0 });
slide.addText('  role: "Fullstack Dev",', { x: 6.5, y: 0.9, w: 3.5, h: 0.3, fontSize: 10, fontFace: "Consolas", color: C.mint, margin: 0 });
slide.addText("};", { x: 6.5, y: 1.15, w: 3.5, h: 0.3, fontSize: 10, fontFace: "Consolas", color: C.slateLight, margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 0.06, h: 2.2, fill: { color: C.mint } });
slide.addText("장정빈", { x: 1.1, y: 1.8, w: 6, h: 0.9, fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("풀스택 개발자", { x: 1.1, y: 2.6, w: 6, h: 0.6, fontSize: 24, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("Next.js · TypeScript · React · AWS · Supabase", { x: 1.1, y: 3.2, w: 6, h: 0.4, fontSize: 13, fontFace: "Consolas", color: C.slateLight, margin: 0 });

slide.addText("apple22by33@naver.com  |  +82-10-8550-8464", {
  x: 0.8, y: 4.9, w: 9, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 2: 자기소개 + 기술 스택
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Tech Stack", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("기술 스택 & 프로필", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Tech stack grid
const techStacks = [
  { cat: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"], color: C.purple },
  { cat: "Backend", items: ["Next.js API Routes", "REST API", "Node.js", "Python"], color: C.mint },
  { cat: "Database", items: ["Supabase (PostgreSQL)", "MySQL", "CQRS 패턴", "In-memory Store"], color: C.blue },
  { cat: "Cloud / Infra", items: ["AWS (EC2, S3, Lambda)", "RDS, CloudFront", "Docker", "Linux"], color: C.amber },
  { cat: "Design", items: ["SVG Graphics", "CSS Animation", "Glassmorphism", "Responsive"], color: C.rose },
  { cat: "Tools", items: ["Git", "JIRA", "Figma", "Notion"], color: C.cyan },
];

techStacks.forEach((ts, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.7 + col * 3.1;
  const y = 1.6 + row * 1.8;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.9, h: 1.6, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.9, h: 0.05, fill: { color: ts.color } });
  slide.addText(ts.cat, { x: x + 0.15, y: y + 0.1, w: 2.6, h: 0.35, fontSize: 13, fontFace: "Arial", color: ts.color, bold: true, margin: 0 });
  slide.addText(
    ts.items.map((item, j) => ({ text: item, options: { bullet: true, breakLine: j < ts.items.length - 1, fontSize: 10, color: C.slate } })),
    { x: x + 0.15, y: y + 0.5, w: 2.6, h: 1.0, paraSpaceAfter: 2 }
  );
});

// ============================================
// SLIDE 3: Dear,ANT 프로젝트 개요
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Featured Project", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("Dear,ANT", { x: 0.7, y: 0.65, w: 5, h: 0.7, fontSize: 36, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("AI 기반 투자 판단 성향 리포트 서비스", { x: 0.7, y: 1.25, w: 8, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.purple, margin: 0 });

// Feature cards (2 rows x 3)
const features = [
  { title: "투자 성향 설문", desc: "7가지 질문 기반\n점수 산출 알고리즘", color: C.purple },
  { title: "AI 리포트 생성", desc: "등급(A~F) + 판단모드\n바이오리듬 분석", color: C.mint },
  { title: "히스토리 대시보드", desc: "SVG 트렌드 차트\n통계 요약", color: C.blue },
  { title: "트레이딩 저널", desc: "CRUD + 포트폴리오\n감정 패턴 분석", color: C.green },
  { title: "금융 계산기", desc: "적금vs투자 비교\n복리 성장 시뮬레이션", color: C.amber },
  { title: "개미 캐릭터", desc: "SVG 5가지 표정\n동적 애니메이션", color: C.rose },
];

features.forEach((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.7 + col * 3.1;
  const y = 1.9 + row * 1.4;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.9, h: 1.2, fill: { color: C.darkCard } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.2, fill: { color: f.color } });
  slide.addText(f.title, { x: x + 0.2, y: y + 0.1, w: 2.5, h: 0.35, fontSize: 14, fontFace: "Arial", color: f.color, bold: true, margin: 0 });
  slide.addText(f.desc, { x: x + 0.2, y: y + 0.5, w: 2.5, h: 0.6, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0 });
});

// Tech stack bar
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.9, w: 8.6, h: 0.45, fill: { color: C.darkCard } });
slide.addText("Next.js 16  |  TypeScript  |  React 19  |  Tailwind CSS 4  |  Supabase  |  Custom SVG", {
  x: 0.7, y: 4.9, w: 8.6, h: 0.45, fontSize: 11, fontFace: "Consolas", color: C.slateLight, align: "center", valign: "middle", margin: 0
});

// ============================================
// SLIDE 4: 시스템 아키텍처
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Architecture", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("시스템 아키텍처", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Architecture diagram using shapes
// Client layer
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 2.0, h: 3.0, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 2.0, h: 0.05, fill: { color: C.purple } });
slide.addText("Client", { x: 0.5, y: 1.8, w: 2.0, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.purple, align: "center", bold: true, margin: 0 });
const clientPages = ["홈 (page.tsx)", "설문 (survey/)", "리포트 (result/)", "히스토리 (history/)", "저널 (memo/)", "계산기 (calculator/)"];
slide.addText(
  clientPages.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < clientPages.length - 1, fontSize: 9, color: C.slate } })),
  { x: 0.6, y: 2.25, w: 1.8, h: 2.2, paraSpaceAfter: 2 }
);

// Arrow
slide.addText("-->", { x: 2.5, y: 2.8, w: 0.6, h: 0.5, fontSize: 16, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

// Next.js App Router layer
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 1.7, w: 2.5, h: 3.0, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 1.7, w: 2.5, h: 0.05, fill: { color: C.mint } });
slide.addText("Next.js App Router", { x: 3.1, y: 1.8, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.mint, align: "center", bold: true, margin: 0 });
slide.addText([
  { text: "API Routes", options: { bold: true, breakLine: true, fontSize: 11, color: C.dark } },
  { text: "/api/reports (POST)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slate } },
  { text: "/api/reports/[id] (GET)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slate } },
  { text: "/api/history (GET)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slate } },
  { text: "/api/memos (GET/POST)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slate } },
  { text: "/api/memos/[id] (PATCH/DEL)", options: { bullet: true, breakLine: true, fontSize: 9, color: C.slate } },
  { text: "", options: { breakLine: true, fontSize: 4 } },
  { text: "Report Engine", options: { bold: true, breakLine: true, fontSize: 11, color: C.dark } },
  { text: "바이오리듬 · 감정점수 · 등급 산출", options: { fontSize: 9, color: C.slateLight } },
], { x: 3.2, y: 2.2, w: 2.3, h: 2.3, paraSpaceAfter: 1 });

// Arrow
slide.addText("-->", { x: 5.6, y: 2.8, w: 0.6, h: 0.5, fontSize: 16, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

// Database layer
slide.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 1.7, w: 3.3, h: 3.0, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 1.7, w: 3.3, h: 0.05, fill: { color: C.blue } });
slide.addText("Data Layer", { x: 6.2, y: 1.8, w: 3.3, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.blue, align: "center", bold: true, margin: 0 });

// Supabase box
slide.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 2.3, w: 2.9, h: 0.9, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 2.3, w: 0.04, h: 0.9, fill: { color: C.green } });
slide.addText("Supabase (PostgreSQL)", { x: 6.6, y: 2.35, w: 2.6, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.green, bold: true, margin: 0 });
slide.addText("sessions · answers · reports · memos", { x: 6.6, y: 2.65, w: 2.6, h: 0.3, fontSize: 9, fontFace: "Consolas", color: C.slateLight, margin: 0 });

// Local store box
slide.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 3.4, w: 2.9, h: 0.9, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 3.4, w: 0.04, h: 0.9, fill: { color: C.amber } });
slide.addText("In-Memory Store (Fallback)", { x: 6.6, y: 3.45, w: 2.6, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.amber, bold: true, margin: 0 });
slide.addText("globalThis Map 기반 · HMR 유지", { x: 6.6, y: 3.75, w: 2.6, h: 0.3, fontSize: 9, fontFace: "Consolas", color: C.slateLight, margin: 0 });

// Design decision note
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.9, w: 9.0, h: 0.5, fill: { color: C.offWhite } });
slide.addText("Dual Storage 전략: Supabase 환경변수 유무로 자동 전환 → 개발 환경 설정 간소화, 배포 환경 자동 DB 연결", {
  x: 0.7, y: 4.9, w: 8.6, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.slate, valign: "middle", margin: 0
});

// ============================================
// SLIDE 5: 핵심 알고리즘
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Core Algorithm", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("리포트 생성 엔진", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("report-engine.ts — 7가지 알고리즘 함수", { x: 0.7, y: 1.2, w: 8, h: 0.3, fontSize: 12, fontFace: "Consolas", color: C.slateLight, margin: 0 });

// Algorithm cards
const algorithms = [
  { name: "calculateBiorhythm()", desc: "생년월일 기반 삼각함수\nsin(2π × days/주기)\n주기: 23(신체), 28(감정), 33(지성)", color: C.purple },
  { name: "calculateMoodScore()", desc: "기분 가중치 + 답변 분산도\n불안(70) → 자신감(20)\n분산도로 일관성 측정", color: C.mint },
  { name: "getInvestMood()", desc: "투자성향 40% + 감정 60%\n가중평균 → A~F 등급\n종합 점수 산출", color: C.blue },
  { name: "generateKeywords()", desc: "4모드 × 4기분 = 16 풀\n조합별 키워드 선택\n해시태그 형식 출력", color: C.amber },
];

algorithms.forEach((a, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.55;
  const y = 1.7 + row * 1.6;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 1.4, fill: { color: C.darkCard } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 0.04, fill: { color: a.color } });
  slide.addText(a.name, { x: x + 0.15, y: y + 0.1, w: 4.0, h: 0.3, fontSize: 13, fontFace: "Consolas", color: a.color, bold: true, margin: 0 });
  slide.addText(a.desc, { x: x + 0.15, y: y + 0.45, w: 4.0, h: 0.85, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0 });
});

// Bottom note
slide.addText("모든 알고리즘은 외부 라이브러리 없이 순수 TypeScript로 구현 → 번들 사이즈 최소화", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 6: API 설계
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("API Design", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("REST API 엔드포인트", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// API table
const apis = [
  { method: "POST", path: "/api/reports", desc: "리포트 생성", req: "userInfo + answers[]", res: "Report 객체", color: C.green },
  { method: "GET", path: "/api/reports/[id]", desc: "리포트 조회", req: "Path: id", res: "Report 객체", color: C.blue },
  { method: "GET", path: "/api/history", desc: "히스토리 조회", req: "-", res: "Report[] (최신순 20개)", color: C.blue },
  { method: "GET/POST", path: "/api/memos", desc: "메모 목록/생성", req: "stock_name, action, ...", res: "Memo[] / Memo", color: C.amber },
  { method: "PATCH/DEL", path: "/api/memos/[id]", desc: "메모 수정/삭제", req: "Path: id + body", res: "Memo / success", color: C.rose },
];

// Table header
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9.0, h: 0.45, fill: { color: C.dark } });
slide.addText("Method", { x: 0.5, y: 1.5, w: 1.3, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("Endpoint", { x: 1.8, y: 1.5, w: 2.2, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("설명", { x: 4.0, y: 1.5, w: 1.5, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("Request", { x: 5.5, y: 1.5, w: 2.0, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("Response", { x: 7.5, y: 1.5, w: 2.0, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

apis.forEach((api, i) => {
  const y = 1.95 + i * 0.55;
  const bg = i % 2 === 0 ? C.offWhite : C.white;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.0, h: 0.5, fill: { color: bg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.04, h: 0.5, fill: { color: api.color } });
  slide.addText(api.method, { x: 0.5, y, w: 1.3, h: 0.5, fontSize: 10, fontFace: "Consolas", color: api.color, bold: true, align: "center", valign: "middle", margin: 0 });
  slide.addText(api.path, { x: 1.8, y, w: 2.2, h: 0.5, fontSize: 10, fontFace: "Consolas", color: C.dark, align: "center", valign: "middle", margin: 0 });
  slide.addText(api.desc, { x: 4.0, y, w: 1.5, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.slate, align: "center", valign: "middle", margin: 0 });
  slide.addText(api.req, { x: 5.5, y, w: 2.0, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", valign: "middle", margin: 0 });
  slide.addText(api.res, { x: 7.5, y, w: 2.0, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", valign: "middle", margin: 0 });
});

// Data types
slide.addText("TypeScript 타입 시스템", { x: 0.7, y: 4.8, w: 8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
const types = [
  { name: "Mood", def: "'불안' | '설렘' | '평온' | '초조' | '자신감'" },
  { name: "DecisionMode", def: "'방어' | '관망' | '신중' | '적극'" },
  { name: "InvestMood", def: "'A' | 'B' | 'C' | 'D' | 'F'" },
];
slide.addText(
  types.map((t, i) => ({
    text: `type ${t.name} = ${t.def}`,
    options: { breakLine: i < types.length - 1, fontSize: 10, fontFace: "Consolas", color: C.purple }
  })),
  { x: 0.7, y: 5.15, w: 8.6, h: 0.5 }
);

// ============================================
// SLIDE 7: 프론트엔드 구현
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Frontend", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("프론트엔드 구현 하이라이트", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// SVG Character
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.6, w: 4.2, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.6, w: 4.2, h: 0.05, fill: { color: C.purple } });
slide.addText("커스텀 SVG 개미 캐릭터", { x: 0.9, y: 1.75, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
slide.addText([
  { text: "5가지 표정: happy, thinking, excited, worried, cool", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "SVG 그래디언트 + 하이라이트로 입체감 표현", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "등급별 동적 표정 매핑 (A→excited, C→thinking)", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "외부 이미지 없이 순수 코드로 캐릭터 생성", options: { bullet: true, fontSize: 10, color: C.slate } },
], { x: 0.9, y: 2.15, w: 3.8, h: 1.1, paraSpaceAfter: 3 });

// SVG Charts
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.6, w: 4.2, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.6, w: 4.2, h: 0.05, fill: { color: C.mint } });
slide.addText("SVG 차트 (라이브러리 X)", { x: 5.3, y: 1.75, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText([
  { text: "히스토리 트렌드 라인 차트 (최근 7회)", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "복리 성장 바 차트 (연도별)", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "비교 바 (적금 vs 주식 시나리오)", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "그리드, 마커, 범례 모두 SVG로 구현", options: { bullet: true, fontSize: 10, color: C.slate } },
], { x: 5.3, y: 2.15, w: 3.8, h: 1.1, paraSpaceAfter: 3 });

// Animations
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.6, w: 8.6, h: 1.6, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.6, w: 8.6, h: 0.05, fill: { color: C.blue } });
slide.addText("8+ 커스텀 CSS 애니메이션", { x: 0.9, y: 3.75, w: 8.2, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.blue, bold: true, margin: 0 });

const anims = [
  { name: "fadeIn", dur: "0.5s", desc: "translateY 10px" },
  { name: "slideUp", dur: "0.6s", desc: "translateY 30px" },
  { name: "scaleIn", dur: "0.4s", desc: "scale 0.9→1" },
  { name: "float", dur: "3s", desc: "translateY ±8px" },
  { name: "pulse-soft", dur: "2s", desc: "opacity 깜박" },
  { name: "shimmer", dur: "3s", desc: "bg-position" },
  { name: "wiggle", dur: "2s", desc: "rotate ±3deg" },
  { name: "stagger", dur: "0.1~0.5s", desc: "순차 지연" },
];
anims.forEach((a, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 0.9 + col * 2.15;
  const y = 4.15 + row * 0.5;
  slide.addText(a.name, { x, y, w: 0.9, h: 0.35, fontSize: 9, fontFace: "Consolas", color: C.purple, bold: true, margin: 0 });
  slide.addText(`${a.dur} · ${a.desc}`, { x: x + 0.9, y, w: 1.2, h: 0.35, fontSize: 8, fontFace: "Arial", color: C.slateLight, margin: 0 });
});

// ============================================
// SLIDE 8: 주요 페이지 구현
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Pages", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("주요 페이지 구현 상세", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

const pages = [
  { name: "설문 페이지", file: "survey/page.tsx", tech: "useState 6개 상태 관리, 3단계 플로우 (info→questions→loading), 진행률 바 애니메이션", color: C.purple },
  { name: "리포트 페이지", file: "result/[id]/page.tsx", tech: "동적 라우팅, 등급별 색상·표정 매핑, 바이오리듬 시각화, Web Share API, 이전 비교 배지", color: C.mint },
  { name: "히스토리 대시보드", file: "history/page.tsx", tech: "2뷰 전환 (대시보드/리스트), SVG 라인 차트, 2x2 통계 그리드, 리포트 카드 목록", color: C.blue },
  { name: "트레이딩 저널", file: "memo/page.tsx", tech: "3탭 (전체/포트폴리오/감정), CRUD + 필터링, 종목별 현황, 등급별 행동 분포 차트", color: C.green },
  { name: "적금 vs 투자", file: "calculator/page.tsx", tech: "useMemo 실시간 계산, 4가지 주식 시나리오, 세금 반영, CompareBar 시각화", color: C.amber },
  { name: "복리 계산기", file: "compound/page.tsx", tech: "월별 복리 반복 계산, SVG 바 차트, 단리 vs 복리 비교, 억/만원 포맷팅", color: C.rose },
];

pages.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.55;
  const y = 1.5 + row * 1.25;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 1.1, fill: { color: C.offWhite }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.05, h: 1.1, fill: { color: p.color } });
  slide.addText(p.name, { x: x + 0.2, y: y + 0.05, w: 2.0, h: 0.3, fontSize: 13, fontFace: "Arial", color: p.color, bold: true, margin: 0 });
  slide.addText(p.file, { x: x + 2.2, y: y + 0.05, w: 1.95, h: 0.3, fontSize: 9, fontFace: "Consolas", color: C.slateLight, align: "right", margin: 0 });
  slide.addText(p.tech, { x: x + 0.2, y: y + 0.4, w: 3.95, h: 0.65, fontSize: 9, fontFace: "Arial", color: C.slate, margin: 0 });
});

// ============================================
// SLIDE 9: 코드 품질
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Code Quality", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("코드 품질 & 설계 원칙", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });

const qualities = [
  { title: "TypeScript 타입 안전성", items: ["엄격한 타입 정의 (types.ts)", "Union Type으로 유효값 제한", "인터페이스 기반 데이터 모델링"], color: C.purple },
  { title: "모듈화 아키텍처", items: ["관심사 분리 (lib/ vs components/ vs app/)", "재사용 가능한 Report Engine", "Dual Storage 추상화 레이어"], color: C.mint },
  { title: "성능 최적화", items: ["외부 차트 라이브러리 X (번들 축소)", "CSS 애니메이션 (JS 최소화)", "useMemo로 불필요한 재계산 방지"], color: C.blue },
  { title: "UX 엔지니어링", items: ["Stagger 애니메이션 시스템", "모바일 Safe Area 대응", "Glassmorphism + 그래디언트"], color: C.rose },
];

qualities.forEach((q, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.55;
  const y = 1.5 + row * 1.8;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 1.6, fill: { color: C.darkCard } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 0.04, fill: { color: q.color } });
  slide.addText(q.title, { x: x + 0.15, y: y + 0.1, w: 4.0, h: 0.35, fontSize: 14, fontFace: "Arial", color: q.color, bold: true, margin: 0 });
  slide.addText(
    q.items.map((item, j) => ({ text: item, options: { bullet: true, breakLine: j < q.items.length - 1, fontSize: 10, color: "CBD5E1" } })),
    { x: x + 0.15, y: y + 0.5, w: 4.0, h: 1.0, paraSpaceAfter: 4 }
  );
});

// ============================================
// SLIDE 10: AWS 경매 웹사이트
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Project 02", { x: 0.7, y: 0.3, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("AWS 경매 웹사이트 개발", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });
slide.addText("AWS CloudSchool 4기  |  2024.05 ~ 2024.07  |  DB 리더, Frontend 개발", {
  x: 0.7, y: 1.2, w: 8, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0
});

// CQRS diagram
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.8, w: 4.2, h: 2.8, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addText("CQRS 패턴 DB 설계", { x: 0.9, y: 1.9, w: 3.8, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });

// Write path
slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 2.4, w: 1.6, h: 0.6, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 2.4, w: 1.6, h: 0.04, fill: { color: C.rose } });
slide.addText("Command (쓰기)", { x: 1.0, y: 2.45, w: 1.6, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.rose, align: "center", valign: "middle", bold: true, margin: 0 });

slide.addText("-->", { x: 2.6, y: 2.4, w: 0.4, h: 0.6, fontSize: 12, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 2.4, w: 1.6, h: 0.6, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 2.4, w: 1.6, h: 0.04, fill: { color: C.purple } });
slide.addText("Primary DB", { x: 3.0, y: 2.45, w: 1.6, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.purple, align: "center", valign: "middle", bold: true, margin: 0 });

// Read path
slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.2, w: 1.6, h: 0.6, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.2, w: 1.6, h: 0.04, fill: { color: C.blue } });
slide.addText("Query (읽기)", { x: 1.0, y: 3.25, w: 1.6, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.blue, align: "center", valign: "middle", bold: true, margin: 0 });

slide.addText("-->", { x: 2.6, y: 3.2, w: 0.4, h: 0.6, fontSize: 12, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 3.2, w: 1.6, h: 0.6, fill: { color: C.white } });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 3.2, w: 1.6, h: 0.04, fill: { color: C.mint } });
slide.addText("Read Replica", { x: 3.0, y: 3.25, w: 1.6, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.mint, align: "center", valign: "middle", bold: true, margin: 0 });

slide.addText("RDS Multi-AZ  |  MySQL  |  고가용성 확보", { x: 0.9, y: 4.0, w: 3.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Right column
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.8, w: 4.2, h: 1.2, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.8, w: 0.06, h: 1.2, fill: { color: C.green } });
slide.addText("Frontend 개발", { x: 5.35, y: 1.9, w: 3.7, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.green, bold: true, margin: 0 });
slide.addText([
  { text: "UI 컴포넌트 개발 지원", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "경매 실시간 입찰 인터페이스", options: { bullet: true, breakLine: true, fontSize: 10, color: C.slate } },
  { text: "반응형 레이아웃 구현", options: { bullet: true, fontSize: 10, color: C.slate } },
], { x: 5.35, y: 2.25, w: 3.7, h: 0.7, paraSpaceAfter: 3 });

// Results
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 3.2, w: 2.0, h: 0.9, fill: { color: C.purple, transparency: 90 }, shadow: makeShadowLight() });
slide.addText("2x", { x: 5.1, y: 3.25, w: 2.0, h: 0.5, fontSize: 26, fontFace: "Arial Black", color: C.purple, align: "center", bold: true, margin: 0 });
slide.addText("처리량 향상", { x: 5.1, y: 3.7, w: 2.0, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 3.2, w: 2.0, h: 0.9, fill: { color: C.mint, transparency: 90 }, shadow: makeShadowLight() });
slide.addText("30%", { x: 7.3, y: 3.25, w: 2.0, h: 0.5, fontSize: 26, fontFace: "Arial Black", color: C.mint, align: "center", bold: true, margin: 0 });
slide.addText("비용 절감", { x: 7.3, y: 3.7, w: 2.0, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addText("AWS RDS  ·  EC2  ·  S3  ·  CloudFront  ·  MySQL  ·  CQRS", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.3, fontSize: 10, fontFace: "Consolas", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 11: 기술 총정리 + 개발 히스토리
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Dev History", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
slide.addText("개발 히스토리 & 진화", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Git evolution
const gitHistory = [
  { ver: "v0.0", commit: "Initial commit", desc: "Create Next App 초기 세팅", color: C.slateLight },
  { ver: "v1.0", commit: "MVP", desc: "설문 → 리포트 기본 기능 구현", color: C.blue },
  { ver: "v1.1", commit: "트레이딩 저널", desc: "메모장 + 대시보드 + 감정분석", color: C.green },
  { ver: "v1.2", commit: "계산기", desc: "적금 vs 투자 비교 계산기 추가", color: C.amber },
  { ver: "v2.0", commit: "전면 리디자인", desc: "UI 리디자인 + 저널 강화 + 복리 계산기", color: C.purple },
];

// Timeline
slide.addShape(pres.shapes.LINE, { x: 1.5, y: 1.7, w: 7.5, h: 0, line: { color: C.purple, width: 2 } });

gitHistory.forEach((g, i) => {
  const x = 1.5 + i * 1.8;
  slide.addShape(pres.shapes.OVAL, { x: x - 0.1, y: 1.6, w: 0.2, h: 0.2, fill: { color: g.color } });
  slide.addText(g.ver, { x: x - 0.5, y: 1.85, w: 1.0, h: 0.3, fontSize: 14, fontFace: "Arial Black", color: g.color, align: "center", bold: true, margin: 0 });
  slide.addText(g.commit, { x: x - 0.7, y: 2.15, w: 1.4, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dark, align: "center", bold: true, margin: 0 });
  slide.addText(g.desc, { x: x - 0.7, y: 2.4, w: 1.4, h: 0.4, fontSize: 8, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// File structure
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.1, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: makeShadowLight() });
slide.addText("프로젝트 구조", { x: 0.9, y: 3.2, w: 3.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
slide.addText([
  { text: "src/app/          8개 페이지 (App Router)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: C.purple } },
  { text: "src/app/api/      5개 API 라우트", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: C.mint } },
  { text: "src/components/   2개 공유 컴포넌트", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: C.blue } },
  { text: "src/lib/          5개 유틸리티 모듈", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: C.green } },
  { text: "supabase/         DB 스키마 정의", options: { fontSize: 9, fontFace: "Consolas", color: C.amber } },
], { x: 0.9, y: 3.6, w: 3.8, h: 1.5, paraSpaceAfter: 4 });

// Stats
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 3.1, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: makeShadowLight() });
slide.addText("프로젝트 수치", { x: 5.3, y: 3.2, w: 3.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const projStats = [
  { label: "총 페이지", val: "8개", color: C.purple },
  { label: "API 엔드포인트", val: "5개", color: C.mint },
  { label: "커스텀 애니메이션", val: "8+", color: C.blue },
  { label: "외부 차트 라이브러리", val: "0개", color: C.green },
  { label: "캐릭터 표정", val: "5가지", color: C.amber },
];
projStats.forEach((s, i) => {
  const y = 3.65 + i * 0.3;
  slide.addText(s.label, { x: 5.3, y, w: 2.2, h: 0.25, fontSize: 10, fontFace: "Arial", color: C.slate, margin: 0 });
  slide.addText(s.val, { x: 7.5, y, w: 1.5, h: 0.25, fontSize: 12, fontFace: "Arial Black", color: s.color, align: "right", bold: true, margin: 0 });
});

// ============================================
// SLIDE 12: 감사합니다
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 3, h: 3, fill: { color: C.mint, transparency: 85 } });
slide.addShape(pres.shapes.OVAL, { x: 7, y: 3.5, w: 4, h: 4, fill: { color: C.purple, transparency: 85 } });

slide.addText("감사합니다", { x: 1, y: 1.5, w: 8, h: 1.0, fontSize: 44, fontFace: "Arial Black", color: C.white, align: "center", bold: true, margin: 0 });
slide.addText("Thank you for your time", { x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.2, w: 3, h: 0.03, fill: { color: C.mint } });

slide.addText([
  { text: "장정빈", options: { fontSize: 16, bold: true, color: C.white, breakLine: true } },
  { text: "apple22by33@naver.com  |  +82-10-8550-8464", options: { fontSize: 12, color: C.slateLight, breakLine: true } },
  { text: "기술 블로그: https://substack.com/@bitbit1", options: { fontSize: 11, color: C.mint } },
], { x: 1, y: 3.5, w: 8, h: 1.5, align: "center" });

pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/2_development_portfolio.pptx" })
  .then(() => console.log("Development portfolio created!"))
  .catch(err => console.error(err));
