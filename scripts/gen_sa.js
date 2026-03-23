const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Dear,ANT";
pres.title = "Dear,ANT - Solution Architect 포트폴리오";

const C = {
  dark: "0F172A", navy: "16213E", deepBlue: "0F3460",
  blue: "3B82F6", blueLight: "60A5FA", blueBg: "DBEAFE", blueDark: "1E40AF",
  purple: "9333EA", purpleLight: "C084FC", purpleBg: "F3E8FF",
  mint: "10B981", mintLight: "34D399", mintBg: "D1FAE5",
  amber: "F59E0B", amberBg: "FEF3C7",
  rose: "F43F5E", roseBg: "FFE4E6",
  text: "1E293B", sub: "64748B", muted: "94A3B8",
  white: "FFFFFF", light: "F0F4F8", cardBg: "F8FAFC", border: "E2E8F0",
};

const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

// ========== SLIDE 1: Title ==========
let s1 = pres.addSlide();
s1.background = { color: C.navy };
// Grid lines effect
for (let i = 0; i < 11; i++) {
  s1.addShape(pres.shapes.LINE, { x: i, y: 0, w: 0, h: 5.625, line: { color: C.blue, width: 0.3, transparency: 92 } });
}
for (let i = 0; i < 6; i++) {
  s1.addShape(pres.shapes.LINE, { x: 0, y: i, w: 10, h: 0, line: { color: C.blue, width: 0.3, transparency: 92 } });
}
s1.addShape(pres.shapes.OVAL, { x: 1, y: 0.5, w: 5, h: 5, fill: { color: C.purple, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: 5, y: 1, w: 6, h: 6, fill: { color: C.blue, transparency: 88 } });

s1.addText("SOLUTION ARCHITECT PORTFOLIO", { x: 0.7, y: 1.0, w: 9, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.blueLight, charSpacing: 4, bold: true });
s1.addText([
  { text: "Dear", options: { color: C.white, bold: true } },
  { text: ",", options: { color: C.blueLight, bold: true } },
  { text: "ANT", options: { color: C.blueLight, bold: true } }
], { x: 0.7, y: 1.6, w: 9, h: 1.2, fontSize: 54, fontFace: "Arial Black" });
s1.addText("감정 기반 투자 분석 플랫폼 — 아키텍처 설계 & 기술 의사결정", { x: 0.7, y: 2.9, w: 9, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.muted });

const pills = ["System Design", "Trade-off Analysis", "Scalability", "Data Architecture"];
pills.forEach((p, i) => {
  s1.addShape(pres.shapes.RECTANGLE, { x: 0.7 + i * 2.2, y: 3.7, w: 2.0, h: 0.45, fill: { color: C.white, transparency: 92 }, line: { color: C.white, width: 0.5, transparency: 85 } });
  s1.addText(p, { x: 0.7 + i * 2.2, y: 3.7, w: 2.0, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.muted, align: "center", valign: "middle" });
});

// ========== SLIDE 2: System Overview ==========
let s2 = pres.addSlide();
s2.background = { color: C.light };
s2.addText("SYSTEM OVERVIEW", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s2.addText("시스템 개요", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

const m2 = [
  { val: "4", label: "시스템 레이어" },
  { val: "5", label: "API 엔드포인트" },
  { val: "2", label: "스토리지 전략" },
  { val: "8", label: "라우트" },
];
m2.forEach((m, i) => {
  const x = 0.7 + i * 2.2;
  s2.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.0, h: 1.0, fill: { color: C.white }, shadow: makeShadow() });
  s2.addText(m.val, { x, y: 1.55, w: 2.0, h: 0.6, fontSize: 36, fontFace: "Arial Black", color: C.blue, align: "center", valign: "middle", margin: 0 });
  s2.addText(m.label, { x, y: 2.15, w: 2.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.sub, align: "center", margin: 0 });
});

// Architecture overview text
s2.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.8, w: 8.6, h: 2.5, fill: { color: C.white }, shadow: makeShadow() });
s2.addText("Next.js App Router 기반 풀스택 아키텍처", { x: 0.95, y: 2.95, w: 8, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
s2.addText([
  { text: "클라이언트-서버 경계를 명확히 분리하고, 어댑터 패턴으로 확장 가능한 데이터 레이어를 설계했습니다.", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "Client Layer — React 19 CSR (6 pages + 2 components)", options: { bullet: true, breakLine: true } },
  { text: "Server Layer — Next.js API Routes (5 endpoints)", options: { bullet: true, breakLine: true } },
  { text: "Business Logic — Pure Functions (report-engine.ts)", options: { bullet: true, breakLine: true } },
  { text: "Data Layer — Adapter Pattern (Supabase / In-Memory)", options: { bullet: true } },
], { x: 0.95, y: 3.4, w: 8, h: 1.7, fontSize: 12, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.4, margin: 0 });

// ========== SLIDE 3: Architecture Diagram ==========
let s3 = pres.addSlide();
s3.background = { color: C.light };
s3.addText("SYSTEM ARCHITECTURE", { x: 0.7, y: 0.3, w: 8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s3.addText("시스템 아키텍처 다이어그램", { x: 0.7, y: 0.6, w: 8, h: 0.5, fontSize: 28, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// 4 layers
const archLayers = [
  { y: 1.2, label: "CLIENT LAYER", labelColor: C.purple, borderColor: C.purpleLight, items: [
    { name: "홈", sub: "/" }, { name: "설문", sub: "/survey" }, { name: "리포트", sub: "/result/[id]" },
    { name: "히스토리", sub: "/history" }, { name: "저널", sub: "/memo" }, { name: "계산기", sub: "/calculator" }
  ], nodeColor: C.purpleBg, nodeTextColor: "7E22CE" },
  { y: 2.4, label: "SERVER LAYER", labelColor: C.blue, borderColor: C.blueLight, items: [
    { name: "POST /reports", sub: "리포트 생성" }, { name: "GET /reports/[id]", sub: "리포트 조회" },
    { name: "GET /history", sub: "목록" }, { name: "CRUD /memos", sub: "메모 관리" }
  ], nodeColor: C.blueBg, nodeTextColor: C.blueDark },
  { y: 3.35, label: "BUSINESS LOGIC", labelColor: C.rose, borderColor: "FDA4AF", items: [
    { name: "Report Engine", sub: "바이오리듬+감정" }, { name: "Score Calculator", sub: "등급 산출" },
    { name: "Content Generator", sub: "메시지/키워드" }
  ], nodeColor: C.roseBg, nodeTextColor: "9F1239" },
  { y: 4.3, label: "DATA LAYER", labelColor: C.mint, borderColor: C.mintLight, items: [
    { name: "Supabase (PostgreSQL)", sub: "프로덕션 DB" }, { name: "In-Memory Store", sub: "개발/데모 폴백" }
  ], nodeColor: C.mintBg, nodeTextColor: "065F46" },
];

archLayers.forEach((layer) => {
  // Dashed border layer
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: layer.y, w: 9.2, h: 0.85, fill: { color: C.white, transparency: 50 }, line: { color: layer.borderColor, width: 1, dashType: "dash" } });
  s3.addText(layer.label, { x: 0.5, y: layer.y - 0.02, w: 1.5, h: 0.25, fontSize: 8, fontFace: "Arial", color: layer.labelColor, bold: true, charSpacing: 1, margin: 0 });

  const nodeW = 7.5 / layer.items.length - 0.1;
  layer.items.forEach((item, i) => {
    const x = 2.1 + i * (7.5 / layer.items.length);
    s3.addShape(pres.shapes.RECTANGLE, { x, y: layer.y + 0.15, w: nodeW, h: 0.55, fill: { color: layer.nodeColor }, line: { color: layer.borderColor, width: 1 } });
    s3.addText(item.name, { x, y: layer.y + 0.15, w: nodeW, h: 0.32, fontSize: 9, fontFace: "Arial", color: layer.nodeTextColor, bold: true, align: "center", margin: 0 });
    s3.addText(item.sub, { x, y: layer.y + 0.42, w: nodeW, h: 0.22, fontSize: 7, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
  });
});

// Arrows
s3.addText("↕   ↕   ↕", { x: 3, y: 2.05, w: 4, h: 0.3, fontSize: 14, color: C.muted, align: "center" });
s3.addText("↕   ↕", { x: 3, y: 3.2, w: 4, h: 0.15, fontSize: 12, color: C.muted, align: "center" });
s3.addText("↕   ↕", { x: 3, y: 4.15, w: 4, h: 0.15, fontSize: 12, color: C.muted, align: "center" });

// ========== SLIDE 4: Data Model ==========
let s4 = pres.addSlide();
s4.background = { color: C.light };
s4.addText("DATA ARCHITECTURE", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s4.addText("데이터 모델 (ERD)", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Entity boxes
const entities = [
  { x: 0.3, y: 1.6, w: 1.8, h: 1.2, name: "users", color: C.purple, bg: C.purpleBg, fields: "id UUID PK\ncreated_at" },
  { x: 2.7, y: 1.6, w: 2.0, h: 1.6, name: "sessions", color: C.blue, bg: C.blueBg, fields: "id UUID PK\nuser_id FK\nbirth_date\nmood\ncreated_at" },
  { x: 5.3, y: 1.6, w: 2.4, h: 2.4, name: "reports", color: C.mint, bg: C.mintBg, fields: "id UUID PK\nsession_id FK\ninvest_mood (A~F)\ndecision_mode\nmood_score\nrisk_tendency\nbiorhythms JSON\nkeywords JSON" },
  { x: 2.7, y: 3.6, w: 2.0, h: 1.4, name: "answers", color: C.amber, bg: C.amberBg, fields: "id UUID PK\nsession_id FK\nquestion_key\nanswer_value\nscore (0~100)" },
  { x: 8.1, y: 1.6, w: 1.6, h: 2.0, name: "memos", color: C.rose, bg: C.roseBg, fields: "id UUID PK\nstock_name\naction\nprice, qty\nmemo TEXT\ninvest_mood" },
];

entities.forEach((e) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: e.bg }, line: { color: e.color, width: 1.5 } });
  s4.addText(e.name, { x: e.x, y: e.y + 0.05, w: e.w, h: 0.3, fontSize: 12, fontFace: "Arial", color: e.color, bold: true, align: "center", margin: 0 });
  s4.addText(e.fields, { x: e.x + 0.1, y: e.y + 0.35, w: e.w - 0.2, h: e.h - 0.4, fontSize: 8, fontFace: "Consolas", color: C.sub, margin: 0 });
});

// Relations
s4.addText("1:N →", { x: 2.1, y: 1.9, w: 0.6, h: 0.3, fontSize: 10, color: C.muted, align: "center" });
s4.addText("1:N →", { x: 4.7, y: 1.9, w: 0.6, h: 0.3, fontSize: 10, color: C.muted, align: "center" });

// ========== SLIDE 5: Trade-offs ==========
let s5 = pres.addSlide();
s5.background = { color: C.light };
s5.addText("TECHNICAL DECISIONS", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s5.addText("기술 의사결정 & Trade-off", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Decision 1: Adapter Pattern
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 1.6, fill: { color: C.white }, shadow: makeShadow() });
s5.addText("1. 데이터 레이어: 어댑터 패턴", { x: 0.7, y: 1.55, w: 8, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Chosen
s5.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.0, w: 2.7, h: 0.9, fill: { color: C.mintBg }, line: { color: C.mintLight, width: 1 } });
s5.addText("CHOSEN", { x: 0.8, y: 2.0, w: 1.0, h: 0.22, fontSize: 8, fontFace: "Arial", color: "166534", bold: true, margin: 0 });
s5.addText("런타임 환경변수 분기", { x: 0.8, y: 2.2, w: 2.5, h: 0.25, fontSize: 11, fontFace: "Arial", color: "166534", bold: true, margin: 0 });
s5.addText("자동 전환, 코드 변경 불필요", { x: 0.8, y: 2.5, w: 2.5, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.sub, margin: 0 });

// Rejected 1
s5.addShape(pres.shapes.RECTANGLE, { x: 3.6, y: 2.0, w: 2.7, h: 0.9, fill: { color: C.cardBg }, line: { color: C.border, width: 1 } });
s5.addText("REJECTED", { x: 3.7, y: 2.0, w: 1.0, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.muted, bold: true, margin: 0 });
s5.addText("Supabase Only", { x: 3.7, y: 2.2, w: 2.5, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.sub, bold: true, margin: 0 });
s5.addText("오프라인 불가, 데모 복잡", { x: 3.7, y: 2.5, w: 2.5, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.muted, margin: 0 });

// Rejected 2
s5.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 2.0, w: 2.7, h: 0.9, fill: { color: C.cardBg }, line: { color: C.border, width: 1 } });
s5.addText("REJECTED", { x: 6.6, y: 2.0, w: 1.0, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.muted, bold: true, margin: 0 });
s5.addText("LocalStorage Only", { x: 6.6, y: 2.2, w: 2.5, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.sub, bold: true, margin: 0 });
s5.addText("서버 컴포넌트 접근 불가", { x: 6.6, y: 2.5, w: 2.5, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.muted, margin: 0 });

// Decision 2: Pure Functions table
s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.3, w: 9, h: 2.1, fill: { color: C.white }, shadow: makeShadow() });
s5.addText("2. 비즈니스 로직: 순수 함수 분리 vs API 인라인", { x: 0.7, y: 3.35, w: 8, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Table
const rows = [
  { criteria: "테스트 용이성", chosen: "높음 — 독립 단위 테스트", alt: "낮음 — HTTP 컨텍스트 필요", cColor: "16A34A", aColor: "DC2626" },
  { criteria: "재사용성", chosen: "클라이언트/서버 양쪽", alt: "서버 전용", cColor: "16A34A", aColor: "DC2626" },
  { criteria: "사이드 이펙트", chosen: "없음 — 결정론적", alt: "DB I/O와 혼재", cColor: "16A34A", aColor: "DC2626" },
];

// Header
s5.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.8, w: 8.6, h: 0.35, fill: { color: C.blueDark } });
s5.addText("기준", { x: 0.7, y: 3.8, w: 2.5, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s5.addText("순수 함수 (CHOSEN)", { x: 3.2, y: 3.8, w: 3, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s5.addText("API 인라인 (REJECTED)", { x: 6.2, y: 3.8, w: 3.1, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });

rows.forEach((r, i) => {
  const y = 4.15 + i * 0.35;
  const bg = i % 2 === 0 ? C.cardBg : C.white;
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 8.6, h: 0.35, fill: { color: bg } });
  s5.addText(r.criteria, { x: 0.7, y, w: 2.5, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.text, bold: true, align: "center", valign: "middle" });
  s5.addText(r.chosen, { x: 3.2, y, w: 3, h: 0.35, fontSize: 10, fontFace: "Arial", color: r.cColor, align: "center", valign: "middle" });
  s5.addText(r.alt, { x: 6.2, y, w: 3.1, h: 0.35, fontSize: 10, fontFace: "Arial", color: r.aColor, align: "center", valign: "middle" });
});

// ========== SLIDE 6: NFR ==========
let s6 = pres.addSlide();
s6.background = { color: C.light };
s6.addText("NON-FUNCTIONAL REQUIREMENTS", { x: 0.7, y: 0.4, w: 9, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s6.addText("비기능 요구사항 분석", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

const nfrs = [
  { name: "가용성 (Availability)", level: "높음", pct: 90, color: C.mint, desc: "인메모리 폴백으로 DB 장애 시에도 서비스 가능" },
  { name: "확장성 (Scalability)", level: "중간", pct: 55, color: C.amber, desc: "Vercel 서버리스 + Supabase, 캐싱 미적용" },
  { name: "유지보수성 (Maintainability)", level: "높음", pct: 85, color: C.blue, desc: "순수 함수 분리, 타입 안전성, 컴포넌트 구조" },
  { name: "성능 (Performance)", level: "중간", pct: 60, color: C.purple, desc: "useMemo 최적화, SSR/ISR 미적용" },
  { name: "보안 (Security)", level: "중간", pct: 50, color: C.rose, desc: "Supabase RLS 활용 가능, 인증 미구현" },
  { name: "이식성 (Portability)", level: "높음", pct: 85, color: C.mintLight, desc: "Docker/Vercel/자체 호스팅 모두 가능" },
];

nfrs.forEach((nfr, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6;
  const y = 1.5 + row * 1.25;

  s6.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.4, h: 1.1, fill: { color: C.white }, shadow: makeShadow() });
  s6.addText(nfr.name, { x: x + 0.15, y: y + 0.08, w: 3.0, h: 0.25, fontSize: 12, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
  s6.addText(nfr.level, { x: x + 3.3, y: y + 0.08, w: 1.0, h: 0.25, fontSize: 11, fontFace: "Arial", color: nfr.color, bold: true, align: "right", margin: 0 });

  // Bar
  s6.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: y + 0.4, w: 4.1, h: 0.15, fill: { color: C.border } });
  s6.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: y + 0.4, w: 4.1 * (nfr.pct / 100), h: 0.15, fill: { color: nfr.color } });

  s6.addText(nfr.desc, { x: x + 0.15, y: y + 0.65, w: 4.1, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.muted, margin: 0 });
});

// ========== SLIDE 7: Scaling Roadmap ==========
let s7 = pres.addSlide();
s7.background = { color: C.light };
s7.addText("SCALING ROADMAP", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s7.addText("확장 로드맵", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Timeline line
s7.addShape(pres.shapes.LINE, { x: 1.5, y: 1.5, w: 0, h: 3.8, line: { color: C.blue, width: 2 } });

const phases = [
  { y: 1.5, phase: "PHASE 1 — 현재 (MVP)", title: "서버리스 모놀리스", desc: "Next.js App Router 단일 배포. Supabase 직접 연결. 인메모리 폴백. 소규모 사용자(~1,000 DAU).", tags: ["Next.js 16", "Supabase", "Vercel"], dotColor: C.blue },
  { y: 3.0, phase: "PHASE 2 — 성장기", title: "하이브리드 렌더링 + 캐싱", desc: "홈/도구 SSG, 리포트 ISR, 저널 CSR. Redis 캐싱. Supabase RLS. OAuth 인증.", tags: ["SSG + ISR", "Redis", "OAuth"], dotColor: C.purple },
  { y: 4.3, phase: "PHASE 3 — 스케일", title: "마이크로서비스 + AI", desc: "리포트 엔진 분리. LLM 메시지 생성. 실시간 시세(WebSocket). Edge CDN.", tags: ["LLM", "WebSocket", "Edge CDN"], dotColor: C.muted },
];

phases.forEach((p) => {
  // Dot
  s7.addShape(pres.shapes.OVAL, { x: 1.35, y: p.y + 0.15, w: 0.3, h: 0.3, fill: { color: C.white }, line: { color: p.dotColor, width: 2 } });

  // Card
  s7.addShape(pres.shapes.RECTANGLE, { x: 2.1, y: p.y, w: 7.3, h: 1.2, fill: { color: C.white }, shadow: makeShadow() });
  s7.addText(p.phase, { x: 2.3, y: p.y + 0.05, w: 5, h: 0.22, fontSize: 9, fontFace: "Arial", color: p.dotColor, bold: true, charSpacing: 1, margin: 0 });
  s7.addText(p.title, { x: 2.3, y: p.y + 0.28, w: 5, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
  s7.addText(p.desc, { x: 2.3, y: p.y + 0.6, w: 5, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });

  p.tags.forEach((tag, ti) => {
    s7.addShape(pres.shapes.RECTANGLE, { x: 7.3 + ti * 0, y: p.y + 0.95, w: 0, h: 0, fill: { color: C.blueBg } });
  });
  // Tags in a row
  p.tags.forEach((tag, ti) => {
    s7.addShape(pres.shapes.RECTANGLE, { x: 2.3 + ti * 1.3, y: p.y + 0.9, w: 1.2, h: 0.25, fill: { color: C.blueBg } });
    s7.addText(tag, { x: 2.3 + ti * 1.3, y: p.y + 0.9, w: 1.2, h: 0.25, fontSize: 8, fontFace: "Arial", color: C.blueDark, align: "center", valign: "middle", bold: true });
  });
});

// ========== SLIDE 8: Risk Matrix ==========
let s8 = pres.addSlide();
s8.background = { color: C.light };
s8.addText("RISK ASSESSMENT", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, charSpacing: 3 });
s8.addText("리스크 분석 & 완화 전략", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.text, bold: true, margin: 0 });

// Table header
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 0.45, fill: { color: C.blueDark } });
s8.addText("리스크", { x: 0.5, y: 1.5, w: 2, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText("심각도", { x: 2.5, y: 1.5, w: 1.3, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText("확률", { x: 3.8, y: 1.5, w: 1.2, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText("완화 전략", { x: 5, y: 1.5, w: 4.5, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });

const risks = [
  { risk: "DB 장애", severity: "Medium", sevColor: C.amber, sevBg: C.amberBg, prob: "Low", probColor: C.mint, probBg: C.mintBg, strategy: "인메모리 폴백 즉시 전환. 재설문으로 복구 가능." },
  { risk: "인메모리 데이터 유실", severity: "High", sevColor: C.rose, sevBg: C.roseBg, prob: "Medium", probColor: C.amber, probBg: C.amberBg, strategy: "서버 재시작 시 초기화. Phase 2에서 Redis 도입." },
  { risk: "동시 요청 증가", severity: "Medium", sevColor: C.amber, sevBg: C.amberBg, prob: "Low", probColor: C.mint, probBg: C.mintBg, strategy: "Vercel 서버리스 자동 스케일링." },
  { risk: "금융 계산 오류", severity: "High", sevColor: C.rose, sevBg: C.roseBg, prob: "Low", probColor: C.mint, probBg: C.mintBg, strategy: "순수 함수 단위 테스트. 세법 변경 시 상수 업데이트." },
  { risk: "번들 사이즈 증가", severity: "Low", sevColor: C.mint, sevBg: C.mintBg, prob: "Medium", probColor: C.amber, probBg: C.amberBg, strategy: "외부 라이브러리 최소화. Tree shaking 활용." },
];

risks.forEach((r, i) => {
  const y = 1.95 + i * 0.65;
  const bg = i % 2 === 0 ? C.cardBg : C.white;
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.65, fill: { color: bg } });
  s8.addText(r.risk, { x: 0.5, y, w: 2, h: 0.65, fontSize: 11, fontFace: "Arial", color: C.text, bold: true, align: "center", valign: "middle" });

  // Severity badge
  s8.addShape(pres.shapes.RECTANGLE, { x: 2.75, y: y + 0.18, w: 0.85, h: 0.28, fill: { color: r.sevBg } });
  s8.addText(r.severity, { x: 2.75, y: y + 0.18, w: 0.85, h: 0.28, fontSize: 9, fontFace: "Arial", color: r.sevColor, bold: true, align: "center", valign: "middle" });

  // Prob badge
  s8.addShape(pres.shapes.RECTANGLE, { x: 4.05, y: y + 0.18, w: 0.85, h: 0.28, fill: { color: r.probBg } });
  s8.addText(r.prob, { x: 4.05, y: y + 0.18, w: 0.85, h: 0.28, fontSize: 9, fontFace: "Arial", color: r.probColor, bold: true, align: "center", valign: "middle" });

  s8.addText(r.strategy, { x: 5.1, y, w: 4.3, h: 0.65, fontSize: 10, fontFace: "Arial", color: C.sub, valign: "middle" });
});

// ========== WRITE ==========
pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/3_solution_architect.pptx" })
  .then(() => console.log("3_solution_architect.pptx created"))
  .catch(err => console.error(err));
