const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "장정빈";
pres.title = "Solution Architect 포트폴리오";

const C = {
  dark: "0C1222",
  darkCard: "162032",
  navy: "1E2761",
  purple: "A855F7",
  purpleDark: "7C3AED",
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
  orange: "F97316",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.1, angle: 135 });
const makeShadowLight = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06, angle: 135 });

// ============================================
// SLIDE 1: 표지
// ============================================
let slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addShape(pres.shapes.OVAL, { x: 6, y: -2, w: 7, h: 7, fill: { color: C.cyan, transparency: 90 } });
slide.addShape(pres.shapes.OVAL, { x: -2, y: 3, w: 5, h: 5, fill: { color: C.purple, transparency: 90 } });

// Grid decoration
for (let i = 0; i < 5; i++) {
  slide.addShape(pres.shapes.LINE, { x: 0, y: i * 1.4, w: 10, h: 0, line: { color: C.slateLight, width: 0.3 } });
}

slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 0.06, h: 2.5, fill: { color: C.cyan } });
slide.addText("장정빈", { x: 1.1, y: 1.5, w: 6, h: 0.9, fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("Solution Architect", { x: 1.1, y: 2.3, w: 6, h: 0.6, fontSize: 24, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("AWS · Cloud Infrastructure · System Design", { x: 1.1, y: 2.9, w: 6, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Cert badge
slide.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 3.5, w: 3.0, h: 0.45, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 3.5, w: 0.05, h: 0.45, fill: { color: C.amber } });
slide.addText("AWS Certified Solutions Architect – Associate", { x: 1.3, y: 3.5, w: 2.8, h: 0.45, fontSize: 10, fontFace: "Arial", color: C.amber, valign: "middle", bold: true, margin: 0 });

slide.addText("apple22by33@naver.com  |  +82-10-8550-8464", {
  x: 0.8, y: 4.9, w: 9, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 2: 자기소개 + 핵심역량
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Core Competency", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("핵심 역량", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Competency cards
const competencies = [
  { title: "클라우드 아키텍처", desc: "AWS 기반 인프라 설계,\n비용 최적화, 고가용성 확보\nMulti-AZ, Auto Scaling", icon: "AWS", color: C.cyan },
  { title: "시스템 설계", desc: "CQRS 패턴, Read Replica,\nDual Storage 전략,\nAPI 설계", icon: "SYS", color: C.purple },
  { title: "비용 최적화", desc: "RI vs On-Demand 분석,\nS3 Lifecycle, CloudFront 캐시,\n월 30% 절감 도출", icon: "COST", color: C.green },
  { title: "컨설팅 & PoC", desc: "70+ 고객 계정 관리,\n요구사항→아키텍처→견적,\nMSP Link 운영", icon: "BIZ", color: C.amber },
];

competencies.forEach((c, i) => {
  const x = 0.5 + i * 2.35;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 2.2, h: 2.6, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 2.2, h: 0.05, fill: { color: c.color } });
  // Icon circle
  slide.addShape(pres.shapes.OVAL, { x: x + 0.7, y: 1.8, w: 0.8, h: 0.8, fill: { color: c.color, transparency: 85 } });
  slide.addText(c.icon, { x: x + 0.7, y: 1.8, w: 0.8, h: 0.8, fontSize: 11, fontFace: "Arial Black", color: c.color, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText(c.title, { x: x + 0.1, y: 2.7, w: 2.0, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, align: "center", bold: true, margin: 0 });
  slide.addText(c.desc, { x: x + 0.1, y: 3.1, w: 2.0, h: 1.0, fontSize: 10, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
});

// Stats bar
const saStats = [
  { num: "70+", label: "고객 계정", color: C.cyan },
  { num: "SAA", label: "AWS 자격증", color: C.amber },
  { num: "6개", label: "AWS 공인교육", color: C.purple },
  { num: "30%", label: "비용 절감", color: C.green },
];
saStats.forEach((s, i) => {
  const x = 0.5 + i * 2.35;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.5, w: 2.2, h: 0.8, fill: { color: C.offWhite } });
  slide.addText(s.num, { x, y: 4.5, w: 1.0, h: 0.8, fontSize: 22, fontFace: "Arial Black", color: s.color, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText(s.label, { x: x + 1.0, y: 4.5, w: 1.2, h: 0.8, fontSize: 11, fontFace: "Arial", color: C.slateLight, valign: "middle", margin: 0 });
});

// ============================================
// SLIDE 3: Dear,ANT 아키텍처 설계
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("System Architecture", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("Dear,ANT 아키텍처 설계", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });

// 3-tier architecture
// Tier 1: Presentation
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 3.0, h: 3.3, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 3.0, h: 0.05, fill: { color: C.purple } });
slide.addText("Presentation Layer", { x: 0.5, y: 1.6, w: 3.0, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.purple, align: "center", bold: true, margin: 0 });

const presentationItems = [
  { name: "React 19 Client", desc: "CSR Components" },
  { name: "Tailwind CSS 4", desc: "디자인 시스템" },
  { name: "SVG Graphics", desc: "캐릭터 + 차트" },
  { name: "CSS Animations", desc: "8+ 커스텀 효과" },
];
presentationItems.forEach((item, i) => {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.1 + i * 0.6, w: 2.6, h: 0.5, fill: { color: C.dark } });
  slide.addText(item.name, { x: 0.8, y: 2.1 + i * 0.6, w: 1.5, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.white, valign: "middle", bold: true, margin: 0 });
  slide.addText(item.desc, { x: 2.3, y: 2.1 + i * 0.6, w: 0.9, h: 0.5, fontSize: 8, fontFace: "Arial", color: C.slateLight, valign: "middle", align: "right", margin: 0 });
});

// Arrow
slide.addText("-->", { x: 3.5, y: 2.8, w: 0.5, h: 0.5, fontSize: 16, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

// Tier 2: Application
slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 1.5, w: 2.5, h: 3.3, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 1.5, w: 2.5, h: 0.05, fill: { color: C.cyan } });
slide.addText("Application Layer", { x: 3.9, y: 1.6, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.cyan, align: "center", bold: true, margin: 0 });

const appItems = [
  { name: "Next.js 16 App Router" },
  { name: "REST API Routes (5)" },
  { name: "Report Engine" },
  { name: "Type System (TS)" },
];
appItems.forEach((item, i) => {
  slide.addShape(pres.shapes.RECTANGLE, { x: 4.1, y: 2.1 + i * 0.6, w: 2.1, h: 0.5, fill: { color: C.dark } });
  slide.addText(item.name, { x: 4.2, y: 2.1 + i * 0.6, w: 1.9, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.white, valign: "middle", bold: true, margin: 0 });
});

// Arrow
slide.addText("-->", { x: 6.4, y: 2.8, w: 0.5, h: 0.5, fontSize: 16, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

// Tier 3: Data
slide.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 1.5, w: 2.8, h: 3.3, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 1.5, w: 2.8, h: 0.05, fill: { color: C.green } });
slide.addText("Data Layer", { x: 6.8, y: 1.6, w: 2.8, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.green, align: "center", bold: true, margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 2.4, h: 1.0, fill: { color: C.dark } });
slide.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 0.04, h: 1.0, fill: { color: C.green } });
slide.addText("Supabase", { x: 7.15, y: 2.15, w: 2.1, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.green, bold: true, margin: 0 });
slide.addText("PostgreSQL\n4 Tables", { x: 7.15, y: 2.45, w: 2.1, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.slateLight, margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 3.3, w: 2.4, h: 1.0, fill: { color: C.dark } });
slide.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 3.3, w: 0.04, h: 1.0, fill: { color: C.amber } });
slide.addText("Local Store", { x: 7.15, y: 3.35, w: 2.1, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.amber, bold: true, margin: 0 });
slide.addText("In-Memory\nFallback", { x: 7.15, y: 3.65, w: 2.1, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Decision note
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.0, w: 9.1, h: 0.4, fill: { color: C.darkCard } });
slide.addText("설계 원칙: 3-Tier Architecture + Dual Storage 전략으로 개발/운영 환경 자동 전환", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.slateLight, valign: "middle", margin: 0
});

// ============================================
// SLIDE 4: 설계 의사결정
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Design Decisions", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("아키텍처 의사결정 기록", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

const decisions = [
  {
    title: "Dual Storage 전략",
    problem: "개발 시 DB 설정 부담, 프로토타이핑 속도 저하",
    decision: "환경변수 유무로 Supabase/Local 자동 전환",
    benefit: "개발 속도 ↑, 배포 시 자동 DB 연결",
    color: C.green
  },
  {
    title: "CSR vs SSR 선택",
    problem: "사용자 인터랙션이 많은 페이지 (설문, 저널)",
    decision: "'use client' 컴포넌트 + 서버 API 분리",
    benefit: "반응성 확보 + API 보안 유지",
    color: C.purple
  },
  {
    title: "차트 라이브러리 미사용",
    problem: "번들 사이즈 증가, 커스터마이징 제한",
    decision: "SVG 직접 생성으로 완전 제어",
    benefit: "번들 최소화, 디자인 자유도 극대화",
    color: C.cyan
  },
  {
    title: "모듈화 전략",
    problem: "리포트 로직과 UI 결합 시 유지보수 어려움",
    decision: "report-engine.ts 독립 모듈로 분리",
    benefit: "테스트 용이, 로직 재사용 가능",
    color: C.amber
  },
];

decisions.forEach((d, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.55;
  const y = 1.5 + row * 1.9;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 1.7, fill: { color: C.offWhite }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.7, fill: { color: d.color } });
  slide.addText(d.title, { x: x + 0.2, y: y + 0.05, w: 3.95, h: 0.35, fontSize: 14, fontFace: "Arial", color: d.color, bold: true, margin: 0 });
  slide.addText([
    { text: "문제: ", options: { bold: true, fontSize: 10, color: C.slate } },
    { text: d.problem, options: { fontSize: 10, color: C.slateLight, breakLine: true } },
    { text: "결정: ", options: { bold: true, fontSize: 10, color: C.slate } },
    { text: d.decision, options: { fontSize: 10, color: C.slateLight, breakLine: true } },
    { text: "효과: ", options: { bold: true, fontSize: 10, color: d.color } },
    { text: d.benefit, options: { fontSize: 10, color: d.color } },
  ], { x: x + 0.2, y: y + 0.45, w: 3.95, h: 1.15, paraSpaceAfter: 3 });
});

// ============================================
// SLIDE 5: 확장성 설계
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Scalability", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("확장성 & 로드맵", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });

// Current state
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.0, h: 3.5, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.0, h: 0.05, fill: { color: C.green } });
slide.addText("현재 (v2.0)", { x: 0.7, y: 1.65, w: 3.6, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.green, bold: true, margin: 0 });
slide.addText([
  { text: "Supabase 직접 연결 (BaaS)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "In-Memory Fallback Store", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "단일 인스턴스 배포 (Vercel)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "클라이언트 사이드 렌더링 (CSR)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "REST API (5 엔드포인트)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "비인증 (Anonymous)", options: { bullet: true, fontSize: 10, color: "CBD5E1" } },
], { x: 0.7, y: 2.1, w: 3.6, h: 2.5, paraSpaceAfter: 5 });

// Arrow
slide.addText(">>>", { x: 4.5, y: 2.8, w: 0.6, h: 0.5, fontSize: 20, color: C.cyan, align: "center", valign: "middle", bold: true, margin: 0 });

// Future state
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.5, h: 3.5, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.5, h: 0.05, fill: { color: C.cyan } });
slide.addText("확장 가능 (v3.0+)", { x: 5.3, y: 1.65, w: 4.1, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText([
  { text: "Supabase Auth 인증 추가", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "실시간 주식 데이터 연동 (WebSocket)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "ML 모델 통합 (투자 패턴 예측)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "Edge Functions (지역별 최적화)", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "CDN + Cache 전략 고도화", options: { bullet: true, breakLine: true, fontSize: 10, color: "CBD5E1" } },
  { text: "모바일 앱 (React Native) 확장", options: { bullet: true, fontSize: 10, color: "CBD5E1" } },
], { x: 5.3, y: 2.1, w: 4.1, h: 2.5, paraSpaceAfter: 5 });

// Note
slide.addText("모듈화된 report-engine.ts 덕분에 ML 모델 교체 시에도 API 인터페이스 변경 불필요", {
  x: 0.5, y: 5.15, w: 9.1, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 6: 데이터 모델링
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Data Modeling", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("데이터베이스 스키마 설계", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Tables
const tables = [
  {
    name: "sessions", color: C.purple,
    fields: ["id (UUID, PK)", "birth_date (DATE)", "mood (TEXT)", "created_at (TIMESTAMP)"]
  },
  {
    name: "answers", color: C.cyan,
    fields: ["id (UUID, PK)", "session_id (FK → sessions)", "question_key (TEXT)", "answer_value (TEXT)", "score (INTEGER)"]
  },
  {
    name: "reports", color: C.green,
    fields: ["id (UUID, PK)", "session_id (FK → sessions)", "decision_mode (TEXT)", "mood_score (INTEGER)", "invest_mood (TEXT)", "biorhythm_* (INTEGER x3)"]
  },
  {
    name: "memos", color: C.amber,
    fields: ["id (UUID, PK)", "stock_name (TEXT)", "action (TEXT)", "price (NUMERIC)", "quantity (INTEGER)", "memo (TEXT)"]
  },
];

tables.forEach((t, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.55;
  const y = 1.5 + row * 1.9;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 1.7, fill: { color: C.offWhite }, shadow: makeShadowLight() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.35, h: 0.05, fill: { color: t.color } });
  slide.addText(t.name, { x: x + 0.15, y: y + 0.1, w: 4.0, h: 0.3, fontSize: 14, fontFace: "Consolas", color: t.color, bold: true, margin: 0 });
  slide.addText(
    t.fields.map((f, j) => ({ text: f, options: { bullet: true, breakLine: j < t.fields.length - 1, fontSize: 9, fontFace: "Consolas", color: C.slate } })),
    { x: x + 0.15, y: y + 0.45, w: 4.0, h: 1.15, paraSpaceAfter: 2 }
  );
});

// Relationship note
slide.addText("관계: sessions 1:N answers  |  sessions 1:1 reports  |  memos 독립 (향후 session 연결 가능)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slateLight, margin: 0
});

// ============================================
// SLIDE 7: AWS 경매 CQRS 아키텍처
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("CQRS Architecture", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("경매 웹사이트 CQRS 설계", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
slide.addText("AWS CloudSchool 4기  |  부팀장 겸 DB 리더", { x: 0.7, y: 1.2, w: 8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0 });

// CQRS Diagram
// Client
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.0, w: 1.8, h: 2.0, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.0, w: 1.8, h: 0.04, fill: { color: C.white } });
slide.addText("Client\n(Browser)", { x: 0.5, y: 2.1, w: 1.8, h: 0.5, fontSize: 12, fontFace: "Arial", color: C.white, align: "center", bold: true, margin: 0 });
slide.addText("입찰 요청\n조회 요청", { x: 0.5, y: 2.7, w: 1.8, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

// Write path
slide.addText("Write >>", { x: 2.3, y: 2.0, w: 0.8, h: 0.5, fontSize: 10, color: C.rose, align: "center", valign: "middle", bold: true, margin: 0 });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 2.0, w: 2.0, h: 0.9, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 2.0, w: 2.0, h: 0.04, fill: { color: C.rose } });
slide.addText("Command\n(Write API)", { x: 3.1, y: 2.05, w: 2.0, h: 0.85, fontSize: 11, fontFace: "Arial", color: C.rose, align: "center", valign: "middle", bold: true, margin: 0 });

slide.addText(">>", { x: 5.1, y: 2.0, w: 0.5, h: 0.9, fontSize: 14, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 2.0, w: 2.0, h: 0.9, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 2.0, w: 2.0, h: 0.04, fill: { color: C.purple } });
slide.addText("Primary DB\n(RDS MySQL)", { x: 5.6, y: 2.05, w: 2.0, h: 0.85, fontSize: 11, fontFace: "Arial", color: C.purple, align: "center", valign: "middle", bold: true, margin: 0 });

// Replication arrow
slide.addText("Replication", { x: 7.6, y: 2.5, w: 0.9, h: 0.5, fontSize: 8, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });
slide.addText("v", { x: 6.1, y: 2.9, w: 1.0, h: 0.3, fontSize: 14, color: C.slateLight, align: "center", margin: 0 });

// Read path
slide.addText("Read >>", { x: 2.3, y: 3.1, w: 0.8, h: 0.5, fontSize: 10, color: C.blue, align: "center", valign: "middle", bold: true, margin: 0 });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 3.1, w: 2.0, h: 0.9, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 3.1, w: 2.0, h: 0.04, fill: { color: C.blue } });
slide.addText("Query\n(Read API)", { x: 3.1, y: 3.15, w: 2.0, h: 0.85, fontSize: 11, fontFace: "Arial", color: C.blue, align: "center", valign: "middle", bold: true, margin: 0 });

slide.addText(">>", { x: 5.1, y: 3.1, w: 0.5, h: 0.9, fontSize: 14, color: C.slateLight, align: "center", valign: "middle", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 3.1, w: 2.0, h: 0.9, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 3.1, w: 2.0, h: 0.04, fill: { color: C.mint } });
slide.addText("Read Replica\n(RDS MySQL)", { x: 5.6, y: 3.15, w: 2.0, h: 0.85, fontSize: 11, fontFace: "Arial", color: C.mint, align: "center", valign: "middle", bold: true, margin: 0 });

// Multi-AZ
slide.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 2.0, w: 1.8, h: 2.0, fill: { color: C.darkCard } });
slide.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 2.0, w: 1.8, h: 0.04, fill: { color: C.amber } });
slide.addText("Multi-AZ\nStandby", { x: 7.8, y: 2.3, w: 1.8, h: 0.8, fontSize: 12, fontFace: "Arial", color: C.amber, align: "center", valign: "middle", bold: true, margin: 0 });
slide.addText("자동 Failover\n고가용성", { x: 7.8, y: 3.2, w: 1.8, h: 0.6, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

// Results
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.4, w: 4.4, h: 0.5, fill: { color: C.darkCard } });
slide.addText("성과: 읽기/쓰기 부하 분리 → 이론적 처리량 2배 향상", { x: 0.7, y: 4.4, w: 4.0, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.green, valign: "middle", bold: true, margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 4.4, w: 4.5, h: 0.5, fill: { color: C.darkCard } });
slide.addText("비용 최적화 시뮬레이션 → 월 운영비 약 30% 절감 가능", { x: 5.3, y: 4.4, w: 4.1, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.amber, valign: "middle", bold: true, margin: 0 });

// ============================================
// SLIDE 8: Lambda 이미지 리사이징
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("Infrastructure Case", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("Lambda 이미지 리사이징 아키텍처", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });
slide.addText("스마일샤크 | 고객사 QR 코드 이미지 비효율 문제 해결", { x: 0.7, y: 1.3, w: 8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.slateLight, margin: 0 });

// Before
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.9, w: 4.3, h: 1.6, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.9, w: 4.3, h: 0.05, fill: { color: C.rose } });
slide.addText("Before (기존)", { x: 0.7, y: 2.0, w: 3.9, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.rose, bold: true, margin: 0 });

const beforeFlow = ["Client", "S3 (원본)", "Client 리사이징"];
beforeFlow.forEach((b, i) => {
  const x = 0.8 + i * 1.3;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.5, w: 1.1, h: 0.5, fill: { color: C.white } });
  slide.addText(b, { x, y: 2.5, w: 1.1, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.rose, align: "center", valign: "middle", bold: true, margin: 0 });
  if (i < beforeFlow.length - 1) {
    slide.addText(">", { x: x + 1.1, y: 2.5, w: 0.2, h: 0.5, fontSize: 12, color: C.slateLight, align: "center", valign: "middle", margin: 0 });
  }
});
slide.addText("대역폭 낭비 + 스토리지 비용 과다 + 로딩 속도 저하", { x: 0.7, y: 3.1, w: 3.9, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.rose, margin: 0 });

// After
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.9, w: 4.5, h: 1.6, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.9, w: 4.5, h: 0.05, fill: { color: C.green } });
slide.addText("After (제안)", { x: 5.3, y: 2.0, w: 4.1, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.green, bold: true, margin: 0 });

const afterFlow = ["S3 Upload", "Lambda", "CloudFront"];
afterFlow.forEach((a, i) => {
  const x = 5.3 + i * 1.4;
  const colors = [C.amber, C.purple, C.mint];
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.5, w: 1.2, h: 0.5, fill: { color: C.white } });
  slide.addText(a, { x, y: 2.5, w: 1.2, h: 0.5, fontSize: 9, fontFace: "Arial", color: colors[i], align: "center", valign: "middle", bold: true, margin: 0 });
  if (i < afterFlow.length - 1) {
    slide.addText(">", { x: x + 1.2, y: 2.5, w: 0.2, h: 0.5, fontSize: 12, color: C.slateLight, align: "center", valign: "middle", margin: 0 });
  }
});
slide.addText("자동 리사이징 + CDN 캐싱 + 스토리지 60% 절감", { x: 5.3, y: 3.1, w: 4.1, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.green, bold: true, margin: 0 });

// Detailed architecture
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.8, w: 9.1, h: 1.5, fill: { color: C.offWhite }, shadow: makeShadowLight() });
slide.addText("제안 아키텍처 상세", { x: 0.7, y: 3.9, w: 8.6, h: 0.3, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const archSteps = [
  { label: "이미지\n업로드", sub: "S3 Bucket", color: C.amber },
  { label: "이벤트\n트리거", sub: "S3 Event", color: C.cyan },
  { label: "자동\n리사이징", sub: "Lambda", color: C.purple },
  { label: "최적화\n이미지 저장", sub: "S3 Output", color: C.green },
  { label: "CDN\n배포", sub: "CloudFront", color: C.mint },
  { label: "빠른\n로딩", sub: "End User", color: C.blue },
];

archSteps.forEach((s, i) => {
  const x = 0.7 + i * 1.5;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.3, w: 1.3, h: 0.8, fill: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.3, w: 1.3, h: 0.04, fill: { color: s.color } });
  slide.addText(s.label, { x, y: 4.35, w: 1.3, h: 0.45, fontSize: 9, fontFace: "Arial", color: s.color, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText(s.sub, { x, y: 4.8, w: 1.3, h: 0.25, fontSize: 8, fontFace: "Consolas", color: C.slateLight, align: "center", margin: 0 });
  if (i < archSteps.length - 1) {
    slide.addText(">", { x: x + 1.3, y: 4.35, w: 0.2, h: 0.8, fontSize: 12, color: C.slateLight, align: "center", valign: "middle", margin: 0 });
  }
});

// ============================================
// SLIDE 9: 비용 최적화 전략
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addText("Cost Optimization", { x: 0.7, y: 0.3, w: 4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("비용 최적화 전략", { x: 0.7, y: 0.65, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });

const costStrategies = [
  {
    title: "Reserved Instance 전환",
    desc: "워크로드 분석 후 On-Demand → RI 전환 권고\n안정적 워크로드 식별, 1년/3년 약정 비교",
    saving: "최대 72% 절감",
    color: C.green
  },
  {
    title: "S3 Lifecycle Policy",
    desc: "Standard → Intelligent-Tiering 자동 전환\n접근 빈도 기반 자동 스토리지 클래스 이동",
    saving: "스토리지 비용 40% 절감",
    color: C.cyan
  },
  {
    title: "CloudFront 캐시 최적화",
    desc: "오리진 요청 최소화, TTL 설정 최적화\n정적 콘텐츠 Edge 캐싱, 압축 전달",
    saving: "데이터 전송 비용 60% 절감",
    color: C.purple
  },
  {
    title: "미사용 리소스 정리",
    desc: "Cost Explorer 분석으로 미사용 EIP, EBS 식별\nOver-provisioned 인스턴스 Right-sizing",
    saving: "즉시 비용 절감",
    color: C.amber
  },
];

costStrategies.forEach((cs, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.5 + col * 4.7;
  const y = 1.5 + row * 1.8;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.5, h: 1.6, fill: { color: C.darkCard } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.6, fill: { color: cs.color } });
  slide.addText(cs.title, { x: x + 0.2, y: y + 0.1, w: 3.0, h: 0.3, fontSize: 14, fontFace: "Arial", color: cs.color, bold: true, margin: 0 });
  slide.addText(cs.saving, { x: x + 3.0, y: y + 0.1, w: 1.3, h: 0.3, fontSize: 10, fontFace: "Arial", color: cs.color, align: "right", bold: true, margin: 0 });
  slide.addText(cs.desc, { x: x + 0.2, y: y + 0.5, w: 4.1, h: 1.0, fontSize: 10, fontFace: "Arial", color: "CBD5E1", margin: 0 });
});

// Total
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.0, w: 9.1, h: 0.45, fill: { color: C.darkCard } });
slide.addText("종합 효과: 월 예상 운영비 약 30% 절감 가능한 아키텍처 도출 (70+ 고객사 대상 컨설팅 수행)", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.green, valign: "middle", bold: true, margin: 0
});

// ============================================
// SLIDE 10: AWS 서비스 활용 경험 맵
// ============================================
slide = pres.addSlide();
slide.background = { color: C.white };

slide.addText("AWS Experience Map", { x: 0.7, y: 0.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("클라우드 아키텍처 설계 역량", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

const awsCategories = [
  { cat: "Compute", services: "EC2 · Lambda · Auto Scaling", exp: "인스턴스 선정, 서버리스 설계, 이미지 리사이징", color: C.rose },
  { cat: "Storage", services: "S3 · EBS · Glacier", exp: "Lifecycle Policy, Intelligent-Tiering, 비용 분석", color: C.green },
  { cat: "Database", services: "RDS (MySQL) · Multi-AZ", exp: "CQRS 설계, Read Replica, 고가용성", color: C.purple },
  { cat: "Networking", services: "CloudFront · VPC · ELB", exp: "CDN 캐시 최적화, 네트워크 설계", color: C.blue },
  { cat: "Management", services: "Cost Explorer · CloudWatch", exp: "비용 분석, 미사용 리소스 식별, 모니터링", color: C.amber },
  { cat: "Security", services: "IAM · Security Groups", exp: "최소 권한 원칙, 네트워크 보안 설정", color: C.cyan },
];

awsCategories.forEach((ac, i) => {
  const y = 1.5 + i * 0.62;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.1, h: 0.52, fill: { color: i % 2 === 0 ? C.offWhite : C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.06, h: 0.52, fill: { color: ac.color } });
  slide.addText(ac.cat, { x: 0.7, y, w: 1.3, h: 0.52, fontSize: 12, fontFace: "Arial", color: ac.color, bold: true, valign: "middle", margin: 0 });
  slide.addText(ac.services, { x: 2.0, y, w: 3.0, h: 0.52, fontSize: 10, fontFace: "Consolas", color: C.dark, valign: "middle", margin: 0 });
  slide.addText(ac.exp, { x: 5.0, y, w: 4.5, h: 0.52, fontSize: 10, fontFace: "Arial", color: C.slateLight, valign: "middle", margin: 0 });
});

// Architecture patterns
slide.addText("적용 아키텍처 패턴", { x: 0.7, y: 4.4, w: 8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
const patterns = [
  { name: "CQRS", desc: "읽기/쓰기 분리", color: C.purple },
  { name: "Serverless", desc: "이벤트 기반 처리", color: C.cyan },
  { name: "Multi-AZ", desc: "고가용성 확보", color: C.amber },
  { name: "CDN Edge", desc: "글로벌 배포", color: C.green },
];
patterns.forEach((p, i) => {
  const x = 0.5 + i * 2.35;
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.85, w: 2.2, h: 0.55, fill: { color: C.offWhite } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.85, w: 2.2, h: 0.04, fill: { color: p.color } });
  slide.addText(p.name, { x, y: 4.9, w: 1.0, h: 0.5, fontSize: 12, fontFace: "Arial Black", color: p.color, align: "center", valign: "middle", bold: true, margin: 0 });
  slide.addText(p.desc, { x: x + 1.0, y: 4.9, w: 1.2, h: 0.5, fontSize: 9, fontFace: "Arial", color: C.slateLight, valign: "middle", margin: 0 });
});

// ============================================
// SLIDE 11: 자격증 + AWS 교육
// ============================================
slide = pres.addSlide();
slide.background = { color: C.offWhite };

slide.addText("Certifications & Training", { x: 0.7, y: 0.4, w: 5, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
slide.addText("자격증 & AWS 공인 교육", { x: 0.7, y: 0.8, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0 });

// Certifications
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 4.2, h: 0.05, fill: { color: C.amber } });
slide.addText("자격증 & 수상", { x: 0.9, y: 1.65, w: 3.8, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.amber, bold: true, margin: 0 });

const certs = [
  { name: "AWS Certified Solutions Architect – Associate", date: "2024.07", color: C.amber },
  { name: "AWS Working Backward Idea Hackathon 대상", date: "2024.02", color: C.green },
  { name: "데이터분석준전문가 ADsP", date: "2023.11", color: C.blue },
  { name: "OPIc IH (영어 비즈니스 레벨)", date: "2024.04", color: C.purple },
];
certs.forEach((c, i) => {
  const y = 2.1 + i * 0.38;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.9, y, w: 0.08, h: 0.28, fill: { color: c.color } });
  slide.addText(c.name, { x: 1.15, y, w: 2.8, h: 0.28, fontSize: 10, fontFace: "Arial", color: C.dark, valign: "middle", margin: 0 });
  slide.addText(c.date, { x: 3.9, y, w: 0.8, h: 0.28, fontSize: 9, fontFace: "Arial", color: C.slateLight, align: "right", valign: "middle", margin: 0 });
});

// AWS Training
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.2, h: 2.2, fill: { color: C.white }, shadow: makeShadow() });
slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.2, h: 0.05, fill: { color: C.cyan } });
slide.addText("AWS 공인 교육 (6개)", { x: 5.3, y: 1.65, w: 3.8, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });

const trainings = [
  "Developing Serverless Solutions on AWS",
  "DevOps Engineering on AWS",
  "Developing on AWS",
  "Well-Architected Best Practices",
  "AWS Technical Essentials",
  "AWS Security Essentials",
];
slide.addText(
  trainings.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < trainings.length - 1, fontSize: 10, color: C.slate } })),
  { x: 5.3, y: 2.1, w: 3.8, h: 1.5, paraSpaceAfter: 3 }
);

// Skills grid
slide.addText("핵심 기술 스킬", { x: 0.7, y: 3.9, w: 8, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const saSkills = [
  { cat: "Cloud / Infra", items: "AWS (EC2, S3, Lambda, RDS, CloudFront, Cost Explorer), Docker, Linux", color: C.cyan },
  { cat: "DB / Data", items: "MySQL, CQRS 패턴 설계, Read Replica, Multi-AZ, 비용 분석", color: C.purple },
  { cat: "Dev / Tools", items: "Next.js, TypeScript, Python, JavaScript, JIRA, Figma, Notion", color: C.green },
  { cat: "언어", items: "한국어 (모국어) | 영어 비즈니스 레벨 (OPIc IH)", color: C.amber },
];

saSkills.forEach((s, i) => {
  const y = 4.35 + i * 0.35;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 0.06, h: 0.3, fill: { color: s.color } });
  slide.addText(s.cat, { x: 0.95, y, w: 1.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: s.color, bold: true, valign: "middle", margin: 0 });
  slide.addText(s.items, { x: 2.5, y, w: 6.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.slate, valign: "middle", margin: 0 });
});

// ============================================
// SLIDE 12: 감사합니다
// ============================================
slide = pres.addSlide();
slide.background = { color: C.dark };

slide.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 3, h: 3, fill: { color: C.cyan, transparency: 85 } });
slide.addShape(pres.shapes.OVAL, { x: 7, y: 3.5, w: 4, h: 4, fill: { color: C.purple, transparency: 85 } });

slide.addText("감사합니다", { x: 1, y: 1.5, w: 8, h: 1.0, fontSize: 44, fontFace: "Arial Black", color: C.white, align: "center", bold: true, margin: 0 });
slide.addText("Thank you for your time", { x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.slateLight, align: "center", margin: 0 });

slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.2, w: 3, h: 0.03, fill: { color: C.cyan } });

slide.addText([
  { text: "장정빈", options: { fontSize: 16, bold: true, color: C.white, breakLine: true } },
  { text: "apple22by33@naver.com  |  +82-10-8550-8464", options: { fontSize: 12, color: C.slateLight, breakLine: true } },
  { text: "AWS Certified Solutions Architect – Associate", options: { fontSize: 11, color: C.amber, breakLine: true } },
  { text: "기술 블로그: https://substack.com/@bitbit1", options: { fontSize: 11, color: C.cyan } },
], { x: 1, y: 3.5, w: 8, h: 1.8, align: "center" });

pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/3_solution_architect_portfolio.pptx" })
  .then(() => console.log("SA portfolio created!"))
  .catch(err => console.error(err));
