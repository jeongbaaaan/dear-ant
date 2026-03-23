const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Dear,ANT";
pres.title = "Dear,ANT - 프론트엔드 개발 포트폴리오";

const C = {
  dark: "0F172A", darker: "0A0A1A", cardBg: "1E293B",
  purple: "9333EA", purpleLight: "C084FC", purpleBg: "2D1B69",
  mint: "10B981", mintLight: "34D399",
  blue: "3B82F6", blueLight: "93C5FD",
  text: "E2E8F0", sub: "94A3B8", muted: "64748B",
  white: "FFFFFF", border: "334155",
  amber: "FBBF24", rose: "F87171",
  codeBg: "0D1117", green: "28C840",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.3 });

// ========== SLIDE 1: Title ==========
let s1 = pres.addSlide();
s1.background = { color: C.darker };
s1.addShape(pres.shapes.OVAL, { x: -2, y: -2, w: 6, h: 6, fill: { color: C.purple, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: 6, y: 2, w: 6, h: 6, fill: { color: C.mint, transparency: 90 } });
s1.addText("FRONTEND DEVELOPER PORTFOLIO", { x: 0.7, y: 1.0, w: 9, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.purpleLight, charSpacing: 4, bold: true });
s1.addText([
  { text: "Dear", options: { color: C.white, bold: true } },
  { text: ",", options: { color: C.purpleLight, bold: true } },
  { text: "ANT", options: { color: C.mintLight, bold: true } }
], { x: 0.7, y: 1.6, w: 9, h: 1.2, fontSize: 54, fontFace: "Arial Black" });
s1.addText("감정 기반 투자 분석 플랫폼 — 풀스택 개발", { x: 0.7, y: 2.9, w: 9, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.sub });

// Tech badges
const techs = ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS 4", "Supabase"];
techs.forEach((t, i) => {
  s1.addShape(pres.shapes.RECTANGLE, { x: 0.7 + i * 1.75, y: 3.7, w: 1.6, h: 0.45, fill: { color: C.white, transparency: 92 }, line: { color: C.white, width: 0.5, transparency: 85 } });
  s1.addText(t, { x: 0.7 + i * 1.75, y: 3.7, w: 1.6, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.text, align: "center", valign: "middle", bold: true });
});

// ========== SLIDE 2: Overview ==========
let s2 = pres.addSlide();
s2.background = { color: C.dark };
s2.addText("OVERVIEW", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s2.addText("프로젝트 요약", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s2.addText("Next.js 16 App Router 기반의 풀스택 웹앱. 서버/클라이언트 분리, API Route 설계, Supabase 연동, 반응형 UI 구현.", { x: 0.7, y: 1.35, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.sub, margin: 0 });

const m2 = [
  { val: "8", label: "페이지" },
  { val: "5", label: "API 엔드포인트" },
  { val: "2", label: "커스텀 컴포넌트" },
  { val: "5", label: "커밋 (v2.0)" },
];
m2.forEach((m, i) => {
  const x = 0.7 + i * 2.2;
  s2.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.0, h: 1.0, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
  s2.addText(m.val, { x, y: 2.05, w: 2.0, h: 0.6, fontSize: 36, fontFace: "Arial Black", color: C.purpleLight, align: "center", valign: "middle", margin: 0 });
  s2.addText(m.label, { x, y: 2.65, w: 2.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
});

// ========== SLIDE 3: Architecture ==========
let s3 = pres.addSlide();
s3.background = { color: C.dark };
s3.addText("ARCHITECTURE", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s3.addText("시스템 아키텍처", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// Layers
const layers = [
  { y: 1.5, label: "CLIENT", items: ["홈 (/)", "설문 (/survey)", "리포트 (/result/[id])", "히스토리", "저널 (/memo)", "계산기"], color: C.purpleLight, bg: C.purpleBg },
  { y: 2.7, label: "SERVER", items: ["POST /api/reports", "GET /api/reports/[id]", "GET /api/history", "CRUD /api/memos"], color: C.mintLight, bg: "0D3B2F" },
  { y: 3.9, label: "DATA", items: ["Supabase (PostgreSQL)", "In-Memory Store (폴백)"], color: C.blueLight, bg: "1E3A5F" },
];

layers.forEach((layer) => {
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: layer.y, w: 9, h: 0.9, fill: { color: layer.bg }, line: { color: layer.color, width: 0.5, transparency: 60 } });
  s3.addText(layer.label, { x: 0.65, y: layer.y, w: 1.2, h: 0.9, fontSize: 9, fontFace: "Arial", color: layer.color, bold: true, charSpacing: 2, valign: "middle", margin: 0 });
  layer.items.forEach((item, i) => {
    const x = 2.0 + i * (7 / layer.items.length);
    const w = 7 / layer.items.length - 0.15;
    s3.addShape(pres.shapes.RECTANGLE, { x, y: layer.y + 0.15, w, h: 0.6, fill: { color: layer.bg }, line: { color: layer.color, width: 1 } });
    s3.addText(item, { x, y: layer.y + 0.15, w, h: 0.6, fontSize: 9, fontFace: "Arial", color: layer.color, align: "center", valign: "middle", bold: true });
  });
});

// Arrows between layers
s3.addText("↕    ↕    ↕", { x: 3, y: 2.35, w: 4, h: 0.35, fontSize: 16, color: C.muted, align: "center" });
s3.addText("↕    ↕", { x: 3, y: 3.55, w: 4, h: 0.35, fontSize: 16, color: C.muted, align: "center" });

// ========== SLIDE 4: Project Structure ==========
let s4 = pres.addSlide();
s4.background = { color: C.dark };
s4.addText("PROJECT STRUCTURE", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s4.addText("프로젝트 구조", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// File tree (left)
s4.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.5, h: 3.9, fill: { color: C.codeBg }, line: { color: C.border, width: 0.5 } });
// dots
s4.addShape(pres.shapes.OVAL, { x: 0.7, y: 1.6, w: 0.12, h: 0.12, fill: { color: "FF5F57" } });
s4.addShape(pres.shapes.OVAL, { x: 0.9, y: 1.6, w: 0.12, h: 0.12, fill: { color: "FEBC2E" } });
s4.addShape(pres.shapes.OVAL, { x: 1.1, y: 1.6, w: 0.12, h: 0.12, fill: { color: C.green } });

const tree = [
  { text: "src/", color: C.purpleLight, indent: 0 },
  { text: "  app/", color: C.purpleLight, indent: 1 },
  { text: "    layout.tsx — 루트 + BottomNav", color: C.mintLight, indent: 2 },
  { text: "    page.tsx — 홈 히어로", color: C.mintLight, indent: 2 },
  { text: "    globals.css — 디자인 시스템", color: C.mintLight, indent: 2 },
  { text: "    survey/ result/[id]/ history/", color: C.sub, indent: 2 },
  { text: "    memo/ calculator/ compound/ tools/", color: C.sub, indent: 2 },
  { text: "    api/ — REST API 라우트", color: C.sub, indent: 2 },
  { text: "  components/", color: C.purpleLight, indent: 1 },
  { text: "    AntCharacter.tsx  BottomNav.tsx", color: C.sub, indent: 2 },
  { text: "  lib/", color: C.purpleLight, indent: 1 },
  { text: "    report-engine.ts  local-store.ts", color: C.sub, indent: 2 },
  { text: "    supabase.ts  types.ts  questions.ts", color: C.sub, indent: 2 },
];
tree.forEach((line, i) => {
  s4.addText(line.text, { x: 0.7, y: 1.85 + i * 0.28, w: 4.1, h: 0.28, fontSize: 10, fontFace: "Consolas", color: line.color, margin: 0 });
});

// API endpoints (right)
s4.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.5, w: 4.3, h: 3.9, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s4.addText("API 엔드포인트", { x: 5.4, y: 1.6, w: 3.9, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

const apis = [
  { method: "POST", path: "/api/reports", desc: "리포트 생성 & 저장", mColor: C.mintLight },
  { method: "GET", path: "/api/reports/[id]", desc: "특정 리포트 조회", mColor: C.blueLight },
  { method: "GET", path: "/api/history", desc: "최근 20개 리포트", mColor: C.blueLight },
  { method: "POST", path: "/api/memos", desc: "메모 생성 (무드 연결)", mColor: C.mintLight },
  { method: "PATCH/DEL", path: "/api/memos/[id]", desc: "메모 수정/삭제", mColor: C.amber },
];
apis.forEach((api, i) => {
  const y = 2.1 + i * 0.6;
  s4.addShape(pres.shapes.RECTANGLE, { x: 5.4, y, w: 3.9, h: 0.5, fill: { color: C.codeBg } });
  s4.addText(api.method, { x: 5.5, y, w: 0.9, h: 0.25, fontSize: 9, fontFace: "Consolas", color: api.mColor, bold: true, margin: 0 });
  s4.addText(api.path, { x: 6.4, y, w: 2.7, h: 0.25, fontSize: 10, fontFace: "Consolas", color: C.text, margin: 0 });
  s4.addText(api.desc, { x: 5.5, y: y + 0.25, w: 3.7, h: 0.2, fontSize: 9, fontFace: "Arial", color: C.muted, margin: 0 });
});

// ========== SLIDE 5: Core Implementation 1 ==========
let s5 = pres.addSlide();
s5.background = { color: C.dark };
s5.addText("CORE IMPLEMENTATION", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s5.addText("핵심 구현 상세 (1/2)", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// Report Engine
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 1.8, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s5.addText("1. 리포트 생성 엔진", { x: 0.7, y: 1.55, w: 5, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s5.addText("순수 함수 기반 투자 성향 분석. 외부 의존성 없이 결정론적 결과 보장.", { x: 0.7, y: 1.9, w: 5, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.sub, margin: 0 });

// Code snippet
s5.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.3, w: 8.6, h: 0.85, fill: { color: C.codeBg } });
s5.addText([
  { text: "// 바이오리듬: sin((2π × daysSinceBirth) / cycle) × 100", options: { color: "8B949E", breakLine: true } },
  { text: "// 등급 산출: combined = totalScore × 0.4 + (100 - moodScore) × 0.6", options: { color: "8B949E", breakLine: true } },
  { text: "// 결과: A(≥75) B(≥60) C(≥45) D(≥30) F(<30)", options: { color: C.mintLight } },
], { x: 0.85, y: 2.35, w: 8.3, h: 0.75, fontSize: 10, fontFace: "Consolas", lineSpacingMultiple: 1.5, margin: 0 });

// Dual Storage
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.55, w: 9, h: 1.8, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s5.addText("2. 듀얼 스토리지 패턴 (어댑터)", { x: 0.7, y: 3.6, w: 5, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s5.addText("env 체크 → Supabase 또는 InMemory 자동 분기. API 코드 변경 없이 스토리지 교체.", { x: 0.7, y: 3.95, w: 7, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.sub, margin: 0 });

s5.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.35, w: 8.6, h: 0.85, fill: { color: C.codeBg } });
s5.addText([
  { text: "if (process.env.SUPABASE_URL) {", options: { color: C.rose, breakLine: true } },
  { text: "  await supabase.from('reports').insert(report);", options: { color: C.blueLight, breakLine: true } },
  { text: "} else { globalThis.__dearant_reports.set(id, report); }", options: { color: C.amber } },
], { x: 0.85, y: 4.4, w: 8.3, h: 0.75, fontSize: 10, fontFace: "Consolas", lineSpacingMultiple: 1.5, margin: 0 });

// ========== SLIDE 6: Core Implementation 2 ==========
let s6 = pres.addSlide();
s6.background = { color: C.dark };
s6.addText("CORE IMPLEMENTATION", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s6.addText("핵심 구현 상세 (2/2)", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// SVG Character
s6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.3, h: 2.2, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s6.addText("3. SVG 캐릭터 컴포넌트", { x: 0.7, y: 1.55, w: 4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s6.addText([
  { text: "순수 SVG + React로 5표정 구현", options: { bullet: true, breakLine: true } },
  { text: "useId()로 gradient 충돌 방지", options: { bullet: true, breakLine: true } },
  { text: "radialGradient로 3D 효과", options: { bullet: true, breakLine: true } },
  { text: "size prop으로 반응형 대응", options: { bullet: true } },
], { x: 0.7, y: 2.0, w: 3.8, h: 1.4, fontSize: 11, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.5, margin: 0 });

const emojis = ["😊", "🤔", "🤩", "😟", "😎"];
emojis.forEach((e, i) => {
  s6.addText(e, { x: 0.8 + i * 0.75, y: 3.3, w: 0.5, h: 0.35, fontSize: 22, align: "center" });
});

// Financial Engine
s6.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.5, w: 4.5, h: 2.2, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s6.addText("4. 금융 계산 엔진", { x: 5.2, y: 1.55, w: 4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

s6.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.0, w: 2.0, h: 0.8, fill: { color: C.purpleBg } });
s6.addText("적금 (단리)", { x: 5.2, y: 2.0, w: 2.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, align: "center", margin: 0 });
s6.addText("이자소득세 15.4%", { x: 5.2, y: 2.35, w: 2.0, h: 0.25, fontSize: 10, fontFace: "Arial", color: C.sub, align: "center", margin: 0 });

s6.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 2.0, w: 2.0, h: 0.8, fill: { color: "0D3B2F" } });
s6.addText("투자 (복리 DCA)", { x: 7.3, y: 2.0, w: 2.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.mintLight, bold: true, align: "center", margin: 0 });
s6.addText("금투세 22%", { x: 7.3, y: 2.35, w: 2.0, h: 0.25, fontSize: 10, fontFace: "Arial", color: C.sub, align: "center", margin: 0 });

s6.addText("4가지 시나리오: 낙관 · 기대 · 보수 · 최악", { x: 5.2, y: 2.95, w: 4.1, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.muted, margin: 0 });

// UI Engineering
s6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.95, w: 9, h: 1.4, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s6.addText("UI 엔지니어링", { x: 0.7, y: 4.0, w: 4, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

const uiItems = [
  { label: "8종 애니메이션", desc: "fadeIn, float, shimmer, pulse, wiggle, stagger" },
  { label: "글래스모피즘", desc: "backdrop-blur + gradient border" },
  { label: "반응형 모바일 퍼스트", desc: "max-w-448px, pb-nav, safe area" },
];
uiItems.forEach((item, i) => {
  const x = 0.7 + i * 3.0;
  s6.addText(item.label, { x, y: 4.4, w: 2.8, h: 0.25, fontSize: 12, fontFace: "Arial", color: C.purpleLight, bold: true, margin: 0 });
  s6.addText(item.desc, { x, y: 4.65, w: 2.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.muted, margin: 0 });
});

// ========== SLIDE 7: Git History ==========
let s7 = pres.addSlide();
s7.background = { color: C.dark };
s7.addText("VERSION HISTORY", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s7.addText("개발 이력 & 성과", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// Terminal
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 2.4, fill: { color: C.codeBg }, line: { color: C.border, width: 0.5 } });
s7.addShape(pres.shapes.OVAL, { x: 0.7, y: 1.6, w: 0.12, h: 0.12, fill: { color: "FF5F57" } });
s7.addShape(pres.shapes.OVAL, { x: 0.9, y: 1.6, w: 0.12, h: 0.12, fill: { color: "FEBC2E" } });
s7.addShape(pres.shapes.OVAL, { x: 1.1, y: 1.6, w: 0.12, h: 0.12, fill: { color: C.green } });
s7.addText("Terminal — git log", { x: 1.4, y: 1.55, w: 3, h: 0.25, fontSize: 10, fontFace: "Consolas", color: C.muted, margin: 0 });

const commits = [
  "d055cf6  feat: v2.0 - UI 전면 리디자인 + 트레이딩 저널 + 복리 계산기",
  "91b381d  docs: README 서비스 소개 및 기능 설명 작성",
  "7b9f677  feat: 적금 vs 투자 비교 계산기 추가",
  "c809e22  feat: 주식 메모장 + 대시보드 + 감정 분석 추가",
  "0d1b4ef  feat: Dear,ANT MVP - AI 투자 판단 성향 리포트",
];
commits.forEach((c, i) => {
  s7.addText(c, { x: 0.7, y: 1.9 + i * 0.35, w: 8.5, h: 0.3, fontSize: 10, fontFace: "Consolas", color: i === 0 ? C.mintLight : C.sub, margin: 0 });
});

// Achievements
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.15, w: 4.3, h: 1.3, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s7.addText("아키텍처 & 패턴", { x: 0.7, y: 4.2, w: 4, h: 0.3, fontSize: 13, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s7.addText([
  { text: "App Router 파일 시스템 라우팅", options: { bullet: true, breakLine: true } },
  { text: "어댑터 패턴 (Supabase / Local)", options: { bullet: true, breakLine: true } },
  { text: "순수 함수 비즈니스 로직 분리", options: { bullet: true } },
], { x: 0.7, y: 4.55, w: 3.8, h: 0.8, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });

s7.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 4.15, w: 4.5, h: 1.3, fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 } });
s7.addText("프론트엔드 엔지니어링", { x: 5.2, y: 4.2, w: 4, h: 0.3, fontSize: 13, fontFace: "Arial", color: C.white, bold: true, margin: 0 });
s7.addText([
  { text: "SVG 프로그래밍 (캐릭터, 차트)", options: { bullet: true, breakLine: true } },
  { text: "CSS 커스텀 애니메이션 8종", options: { bullet: true, breakLine: true } },
  { text: "한국 세법 반영 금융 계산", options: { bullet: true } },
], { x: 5.2, y: 4.55, w: 4, h: 0.8, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });

// ========== WRITE ==========
pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/2_development.pptx" })
  .then(() => console.log("2_development.pptx created"))
  .catch(err => console.error(err));
