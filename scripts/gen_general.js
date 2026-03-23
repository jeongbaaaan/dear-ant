const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// ─── Theme ───
const C = {
  charcoal: "1E293B",
  teal: "0D9488",
  amber: "F59E0B",
  white: "FFFFFF",
  lightGray: "F1F5F9",
  midGray: "94A3B8",
  darkText: "1E293B",
  bodyText: "334155",
  cardBg: "F8FAFC",
  tealLight: "CCFBF1",
  amberLight: "FEF3C7",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.title = "포트폴리오_장정빈_기술컨설턴트";

// Helper: add a colored bar at the top of each slide
function addTopBar(slide) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: C.teal },
  });
}

// Helper: add page number
function addPageNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.4,
    fontSize: 9, color: C.midGray, fontFace: "Arial",
    align: "right",
  });
}

// Helper: section title
function addSectionTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.7, y: 0.35, w: 10, h: 0.55,
    fontSize: 26, fontFace: "Arial Black", color: C.charcoal, bold: true,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.7, y: 0.88, w: 10, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.midGray,
    });
  }
  // Accent line under title
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.7, y: 1.25, w: 1.2, h: 0.05,
    fill: { color: C.teal },
  });
}

// Helper: draw a card (rounded rect with shadow)
function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    rectRadius: 0.1,
    fill: { color: opts.fill || C.cardBg },
    line: { color: opts.border || "E2E8F0", width: 0.5 },
    shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.1 },
  });
}

const TOTAL = 10;

// ════════════════════════════════════════
// SLIDE 1: Cover
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.charcoal };

  // Left accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: C.teal },
  });

  // Decorative shapes
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 10.5, y: 0, w: 2.83, h: 2.5,
    fill: { color: C.teal },
    transparency: 85,
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 11.5, y: 5.5, w: 1.83, h: 2,
    fill: { color: C.amber },
    transparency: 88,
  });

  // Name
  slide.addText("장정빈", {
    x: 1.2, y: 1.8, w: 8, h: 1.0,
    fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true,
  });

  // Tagline
  slide.addText("기술로 고객의 문제를 해결합니다", {
    x: 1.2, y: 2.85, w: 8, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: C.teal,
  });

  // Divider
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 1.2, y: 3.6, w: 3.5, h: 0.04,
    fill: { color: C.amber },
  });

  // Subtitle
  slide.addText("Cloud Infra  |  AI Service  |  Technical Consulting", {
    x: 1.2, y: 3.85, w: 8, h: 0.5,
    fontSize: 15, fontFace: "Arial", color: C.midGray,
  });

  // Contact bar at bottom
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 6.5, w: 13.33, h: 1.0,
    fill: { color: "162032" },
  });
  slide.addText([
    { text: "apple22by33@naver.com", options: { fontSize: 11, fontFace: "Arial", color: C.midGray } },
    { text: "   |   +82-10-8550-8464", options: { fontSize: 11, fontFace: "Arial", color: C.midGray } },
  ], {
    x: 1.2, y: 6.65, w: 10, h: 0.5,
  });
})();

// ════════════════════════════════════════
// SLIDE 2: 한눈에 보는 저
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "한눈에 보는 저");
  addPageNum(slide, 2, TOTAL);

  const stats = [
    { num: "70+", label: "관리한 고객 계정", accent: C.teal },
    { num: "1위", label: "AWS 해커톤 대상", accent: C.amber },
    { num: "60%", label: "제안한 비용 절감 효과", accent: C.teal },
    { num: "1인", label: "기획~배포 End-to-End", accent: C.amber },
  ];

  const cardW = 2.65;
  const gap = 0.35;
  const startX = 0.7;
  const cardY = 1.8;
  const cardH = 2.5;

  stats.forEach((s, i) => {
    const cx = startX + i * (cardW + gap);
    addCard(slide, cx, cardY, cardW, cardH);
    // Top accent line on card
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: cx, y: cardY, w: cardW, h: 0.06,
      fill: { color: s.accent },
    });
    // Number
    slide.addText(s.num, {
      x: cx, y: cardY + 0.5, w: cardW, h: 1.0,
      fontSize: 44, fontFace: "Arial Black", color: s.accent, bold: true, align: "center",
    });
    // Label
    slide.addText(s.label, {
      x: cx + 0.2, y: cardY + 1.55, w: cardW - 0.4, h: 0.6,
      fontSize: 13, fontFace: "Arial", color: C.bodyText, align: "center",
    });
  });

  // One-line intro
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 5.0, w: 11.9, h: 0.9,
    rectRadius: 0.08,
    fill: { color: C.tealLight },
  });
  slide.addText(
    "스마일샤크에서 70개 이상의 고객사 클라우드를 관리하며, 현장에서 발견한 문제를 기술로 해결하고 있습니다.",
    {
      x: 1.1, y: 5.1, w: 11.1, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: C.charcoal, align: "center",
    }
  );
})();

// ════════════════════════════════════════
// SLIDE 3: 스마일샤크
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "스마일샤크", "Account Manager  |  2024.11 ~ 현재");
  addPageNum(slide, 3, TOTAL);

  // Subtitle
  slide.addText("고객 문제를 기술로 풀다", {
    x: 0.7, y: 1.45, w: 8, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: C.teal, italic: true,
  });

  // Three-column story: 발견 → 제안 → 효과
  const colW = 3.5;
  const colGap = 0.35;
  const colY = 2.2;
  const colH = 2.6;
  const cols = [
    { title: "발견", color: C.amber, body: "고객사 QR 이미지를\n원본 그대로 저장\n\n불필요한 스토리지 비용 발생" },
    { title: "제안", color: C.teal, body: "S3 업로드\n  ↓\nLambda 리사이징\n  ↓\nCloudFront 배포" },
    { title: "효과", color: C.teal, body: "스토리지 60% 절감\n이미지 로딩 속도 개선\n비용 구조 최적화" },
  ];

  cols.forEach((c, i) => {
    const cx = 0.7 + i * (colW + colGap);
    addCard(slide, cx, colY, colW, colH);
    // Title badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx + 0.2, y: colY + 0.2, w: 1.2, h: 0.38,
      rectRadius: 0.05,
      fill: { color: c.color },
    });
    slide.addText(c.title, {
      x: cx + 0.2, y: colY + 0.2, w: 1.2, h: 0.38,
      fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center",
    });
    slide.addText(c.body, {
      x: cx + 0.25, y: colY + 0.8, w: colW - 0.5, h: 1.6,
      fontSize: 11.5, fontFace: "Arial", color: C.bodyText, lineSpacingMultiple: 1.35,
    });
  });

  // Arrow between columns
  [0, 1].forEach((i) => {
    const ax = 0.7 + (i + 1) * (colW + colGap) - colGap / 2 - 0.15;
    slide.addText("→", {
      x: ax, y: colY + 1.0, w: 0.3, h: 0.5,
      fontSize: 22, fontFace: "Arial", color: C.teal, bold: true, align: "center",
    });
  });

  // Other contributions
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.7, y: 5.15, w: 11.9, h: 0.04,
    fill: { color: "E2E8F0" },
  });
  slide.addText("기타 기여", {
    x: 0.7, y: 5.3, w: 3, h: 0.35,
    fontSize: 11, fontFace: "Arial", color: C.midGray, bold: true,
  });

  const others = [
    "AWS Cost Explorer 기반 비용 분석 → RI 전환 권고",
    "신규 고객사 플랫폼 PoC 기획 (요구사항 → 아키텍처 → 견적)",
    "MSP Link를 통한 파트너 혜택 연결",
  ];
  others.forEach((t, i) => {
    slide.addText(t, {
      x: 1.0, y: 5.65 + i * 0.35, w: 11, h: 0.3,
      fontSize: 11, fontFace: "Arial", color: C.bodyText,
      bullet: true,
    });
  });
})();

// ════════════════════════════════════════
// SLIDE 4: AWS CloudSchool
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "AWS CloudSchool 4기", "2024.01 ~ 2024.07  |  부팀장 + DB 리더 + Frontend");
  addPageNum(slide, 4, TOTAL);

  slide.addText("설계하고 직접 만들다", {
    x: 0.7, y: 1.45, w: 8, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: C.teal, italic: true,
  });

  // Left: CQRS diagram area
  addCard(slide, 0.7, 2.1, 6.0, 3.2);
  slide.addText("경매 웹사이트 CQRS 설계", {
    x: 1.0, y: 2.2, w: 5, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.charcoal, bold: true,
  });

  // CQRS diagram boxes
  // Command side
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 2.85, w: 1.8, h: 0.55,
    rectRadius: 0.06, fill: { color: C.teal },
  });
  slide.addText("Command (Write)", {
    x: 1.2, y: 2.85, w: 1.8, h: 0.55,
    fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });
  // Arrow
  slide.addText("→", {
    x: 3.1, y: 2.85, w: 0.5, h: 0.55,
    fontSize: 18, fontFace: "Arial", color: C.charcoal, align: "center",
  });
  // Primary DB
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.6, y: 2.85, w: 1.6, h: 0.55,
    rectRadius: 0.06, fill: { color: C.charcoal },
  });
  slide.addText("Primary DB", {
    x: 3.6, y: 2.85, w: 1.6, h: 0.55,
    fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });

  // Query side
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 3.7, w: 1.8, h: 0.55,
    rectRadius: 0.06, fill: { color: C.amber },
  });
  slide.addText("Query (Read)", {
    x: 1.2, y: 3.7, w: 1.8, h: 0.55,
    fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });
  slide.addText("→", {
    x: 3.1, y: 3.7, w: 0.5, h: 0.55,
    fontSize: 18, fontFace: "Arial", color: C.charcoal, align: "center",
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.6, y: 3.7, w: 1.6, h: 0.55,
    rectRadius: 0.06, fill: { color: "475569" },
  });
  slide.addText("Read Replica", {
    x: 3.6, y: 3.7, w: 1.6, h: 0.55,
    fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });

  // Sync arrow between DBs
  slide.addText("Sync", {
    x: 5.3, y: 3.2, w: 0.8, h: 0.4,
    fontSize: 8, fontFace: "Arial", color: C.midGray, align: "center",
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 5.55, y: 3.4, w: 0.04, h: 0.35,
    fill: { color: C.midGray },
  });

  // Multi-AZ note
  slide.addText("Multi-AZ 구성으로 고가용성 확보", {
    x: 1.0, y: 4.5, w: 5, h: 0.35,
    fontSize: 10.5, fontFace: "Arial", color: C.midGray,
  });

  // Right: Results
  addCard(slide, 7.1, 2.1, 5.5, 3.2);
  slide.addText("성과", {
    x: 7.4, y: 2.2, w: 3, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.charcoal, bold: true,
  });

  const results = [
    { metric: "2x", desc: "처리량 개선 (Read/Write 분리)" },
    { metric: "30%", desc: "비용 절감 (RI + S3 Intelligent-Tiering)" },
  ];
  results.forEach((r, i) => {
    const ry = 2.8 + i * 1.1;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.4, y: ry, w: 1.2, h: 0.6,
      rectRadius: 0.06, fill: { color: i === 0 ? C.teal : C.amber },
    });
    slide.addText(r.metric, {
      x: 7.4, y: ry, w: 1.2, h: 0.6,
      fontSize: 22, fontFace: "Arial Black", color: C.white, bold: true, align: "center",
    });
    slide.addText(r.desc, {
      x: 8.8, y: ry, w: 3.5, h: 0.6,
      fontSize: 12, fontFace: "Arial", color: C.bodyText, valign: "middle",
    });
  });

  // Role tags
  const roles = ["부팀장", "DB 리더", "Frontend"];
  roles.forEach((r, i) => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.7 + i * 1.6, y: 5.7, w: 1.4, h: 0.4,
      rectRadius: 0.05, fill: { color: C.tealLight },
    });
    slide.addText(r, {
      x: 0.7 + i * 1.6, y: 5.7, w: 1.4, h: 0.4,
      fontSize: 10.5, fontFace: "Arial", color: C.teal, bold: true, align: "center",
    });
  });
})();

// ════════════════════════════════════════
// SLIDE 5: Dear,ANT
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "Dear,ANT", "Personal Project  |  2025.03");
  addPageNum(slide, 5, TOTAL);

  slide.addText("혼자 만든 AI 서비스", {
    x: 0.7, y: 1.45, w: 8, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: C.teal, italic: true,
  });

  // Problem statement
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 2.0, w: 11.9, h: 0.65,
    rectRadius: 0.06, fill: { color: C.amberLight },
  });
  slide.addText("개미 투자자의 감정적 매매 문제를 풀기 위해 만들었습니다", {
    x: 1.0, y: 2.05, w: 11.3, h: 0.55,
    fontSize: 13, fontFace: "Arial", color: C.charcoal, align: "center",
  });

  // Feature cards
  const features = [
    { title: "투자 성향 설문", desc: "AI 리포트\n등급 A~F 판정" },
    { title: "트레이딩 저널", desc: "매매 기록 관리\n감정 분석" },
    { title: "금융 계산기", desc: "복리 / 적금 vs 투자\n비교 시뮬레이션" },
  ];
  const fW = 3.6;
  const fGap = 0.35;
  features.forEach((f, i) => {
    const fx = 0.7 + i * (fW + fGap);
    addCard(slide, fx, 2.9, fW, 1.6);
    slide.addText(f.title, {
      x: fx + 0.2, y: 3.0, w: fW - 0.4, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: C.teal, bold: true,
    });
    slide.addText(f.desc, {
      x: fx + 0.2, y: 3.45, w: fW - 0.4, h: 0.9,
      fontSize: 11, fontFace: "Arial", color: C.bodyText, lineSpacingMultiple: 1.3,
    });
  });

  // Flow arrows between feature cards
  [0, 1].forEach((i) => {
    const ax = 0.7 + (i + 1) * (fW + fGap) - fGap / 2 - 0.1;
    slide.addText("→", {
      x: ax, y: 3.4, w: 0.3, h: 0.5,
      fontSize: 18, fontFace: "Arial", color: C.teal, align: "center",
    });
  });

  // Tech stack
  slide.addText("Tech Stack", {
    x: 0.7, y: 4.8, w: 3, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: C.charcoal, bold: true,
  });
  const techs = ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS 4", "Supabase"];
  techs.forEach((t, i) => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.7 + i * 2.0, y: 5.2, w: 1.8, h: 0.4,
      rectRadius: 0.05, fill: { color: C.charcoal },
    });
    slide.addText(t, {
      x: 0.7 + i * 2.0, y: 5.2, w: 1.8, h: 0.4,
      fontSize: 10, fontFace: "Arial", color: C.white, align: "center",
    });
  });

  // Bottom note
  slide.addText("Claude Code와 함께 기획부터 개발, 배포까지 1인으로 완성", {
    x: 0.7, y: 5.85, w: 8, h: 0.35,
    fontSize: 11, fontFace: "Arial", color: C.midGray,
  });
  slide.addText("Architecture: App Router + REST API + Dual Storage (Supabase + LocalStorage)", {
    x: 0.7, y: 6.15, w: 8, h: 0.35,
    fontSize: 10, fontFace: "Arial", color: C.midGray,
  });
})();

// ════════════════════════════════════════
// SLIDE 6: Clova X
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "네이버클라우드 Clova X", "2023.11 ~ 2023.12  |  AI 챗봇 PM");
  addPageNum(slide, 6, TOTAL);

  slide.addText("AI 서비스 기획 경험", {
    x: 0.7, y: 1.45, w: 8, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: C.teal, italic: true,
  });

  // Main content card (compact - only top half)
  addCard(slide, 0.7, 2.1, 11.9, 3.5);

  // Two columns inside card
  // Left: What I did
  slide.addText("역할", {
    x: 1.1, y: 2.3, w: 4.5, h: 0.35,
    fontSize: 13, fontFace: "Arial", color: C.charcoal, bold: true,
  });
  const tasks = [
    "PM으로 프롬프트 데이터셋 구축",
    "UX 흐름 설계 및 사용자 시나리오 작성",
    "기획 요구사항을 API 스펙으로 변환",
    "개발팀과의 일일 협업 및 피드백 루프",
  ];
  tasks.forEach((t, i) => {
    slide.addText(t, {
      x: 1.3, y: 2.75 + i * 0.45, w: 5, h: 0.4,
      fontSize: 11.5, fontFace: "Arial", color: C.bodyText,
      bullet: true,
    });
  });

  // Divider
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.6, y: 2.3, w: 0.03, h: 2.8,
    fill: { color: "E2E8F0" },
  });

  // Right: Key result
  slide.addText("핵심 성과", {
    x: 7.1, y: 2.3, w: 4.5, h: 0.35,
    fontSize: 13, fontFace: "Arial", color: C.charcoal, bold: true,
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.1, y: 2.85, w: 4.8, h: 1.2,
    rectRadius: 0.08, fill: { color: C.tealLight },
  });
  slide.addText([
    { text: "수정 사이클", options: { fontSize: 12, fontFace: "Arial", color: C.bodyText } },
    { text: " 3회 → 1회", options: { fontSize: 18, fontFace: "Arial Black", color: C.teal, bold: true } },
    { text: "\n프롬프트 데이터셋 품질 개선을 통해\n기획-개발 간 커뮤니케이션 효율화", options: { fontSize: 10.5, fontFace: "Arial", color: C.bodyText, breakLine: true } },
  ], {
    x: 7.3, y: 2.9, w: 4.4, h: 1.1,
    valign: "middle",
  });
})();

// ════════════════════════════════════════
// SLIDE 7: 기술 역량 맵
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "기술 역량 맵");
  addPageNum(slide, 7, TOTAL);

  // Left section: 직접 다뤄본 기술
  slide.addText("직접 다뤄본 기술", {
    x: 0.7, y: 1.6, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.charcoal, bold: true,
  });

  const techGroups = [
    { cat: "Cloud", items: "EC2, S3, Lambda, RDS, CloudFront, Cost Explorer", color: C.teal },
    { cat: "Dev", items: "Next.js, TypeScript, React, Python, JavaScript", color: C.amber },
    { cat: "DB", items: "Supabase(PostgreSQL), MySQL, CQRS", color: C.teal },
    { cat: "Tools", items: "Docker, Linux, JIRA, Figma, Notion", color: C.amber },
  ];

  techGroups.forEach((g, i) => {
    const ty = 2.15 + i * 1.05;
    // Category badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: ty, w: 1.3, h: 0.45,
      rectRadius: 0.05, fill: { color: g.color },
    });
    slide.addText(g.cat, {
      x: 0.7, y: ty, w: 1.3, h: 0.45,
      fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center",
    });
    // Items
    slide.addText(g.items, {
      x: 2.15, y: ty, w: 4.5, h: 0.45,
      fontSize: 11, fontFace: "Arial", color: C.bodyText, valign: "middle",
    });
    // Underline
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.7, y: ty + 0.55, w: 5.8, h: 0.015,
      fill: { color: "E2E8F0" },
    });
  });

  // Vertical divider
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.6, w: 0.03, h: 4.5,
    fill: { color: "E2E8F0" },
  });

  // Right section: 이해하고 설계할 수 있는 것
  slide.addText("이해하고 설계할 수 있는 것", {
    x: 7.2, y: 1.6, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.charcoal, bold: true,
  });

  const concepts = [
    "Serverless Architecture",
    "CQRS Pattern",
    "Cost Optimization Strategy",
    "API Design & Integration",
  ];
  concepts.forEach((c, i) => {
    const cy = 2.3 + i * 0.95;
    addCard(slide, 7.2, cy, 5.4, 0.7);
    // Left accent
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 7.2, y: cy, w: 0.08, h: 0.7,
      fill: { color: C.teal },
    });
    slide.addText(c, {
      x: 7.55, y: cy, w: 4.8, h: 0.7,
      fontSize: 12.5, fontFace: "Arial", color: C.charcoal, valign: "middle",
    });
  });
})();

// ════════════════════════════════════════
// SLIDE 8: 자격증 & 교육
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "자격증 & 교육");
  addPageNum(slide, 8, TOTAL);

  // Left: Certifications
  addCard(slide, 0.7, 1.7, 5.8, 4.8);
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.0, y: 1.9, w: 2.0, h: 0.45,
    rectRadius: 0.05, fill: { color: C.teal },
  });
  slide.addText("Certifications", {
    x: 1.0, y: 1.9, w: 2.0, h: 0.45,
    fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });

  const certs = [
    { name: "AWS Solutions Architect - Associate", tag: "AWS SAA" },
    { name: "AWS Hackathon 대상 (1위)", tag: "대상" },
    { name: "ADsP (데이터분석 준전문가)", tag: "ADsP" },
    { name: "OPIc IH (영어 인터뷰)", tag: "OPIc" },
  ];
  certs.forEach((c, i) => {
    const cy = 2.65 + i * 0.85;
    // Tag
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: cy, w: 1.1, h: 0.4,
      rectRadius: 0.05, fill: { color: i === 1 ? C.amber : C.tealLight },
    });
    slide.addText(c.tag, {
      x: 1.1, y: cy, w: 1.1, h: 0.4,
      fontSize: 10, fontFace: "Arial", color: i === 1 ? C.white : C.teal, bold: true, align: "center",
    });
    slide.addText(c.name, {
      x: 2.4, y: cy, w: 3.8, h: 0.4,
      fontSize: 11.5, fontFace: "Arial", color: C.bodyText, valign: "middle",
    });
  });

  // Right: AWS Training
  addCard(slide, 6.85, 1.7, 5.8, 4.8);
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.15, y: 1.9, w: 2.8, h: 0.45,
    rectRadius: 0.05, fill: { color: C.amber },
  });
  slide.addText("AWS Official Training", {
    x: 7.15, y: 1.9, w: 2.8, h: 0.45,
    fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center",
  });

  const trainings = [
    "Developing Serverless Solutions on AWS",
    "DevOps Engineering on AWS",
    "Developing on AWS",
    "AWS Well-Architected Best Practices",
    "AWS Technical Essentials",
    "AWS Security Essentials",
  ];
  trainings.forEach((t, i) => {
    const ty = 2.65 + i * 0.65;
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 7.15, y: ty + 0.05, w: 0.06, h: 0.3,
      fill: { color: C.amber },
    });
    slide.addText(t, {
      x: 7.45, y: ty, w: 4.8, h: 0.4,
      fontSize: 11, fontFace: "Arial", color: C.bodyText, valign: "middle",
    });
  });
})();

// ════════════════════════════════════════
// SLIDE 9: 이렇게 일합니다
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide);
  addSectionTitle(slide, "이렇게 일합니다");
  addPageNum(slide, 9, TOTAL);

  const principles = [
    {
      num: "01",
      title: "현장에서 답을 찾는다",
      body: "고객사를 직접 만나서 비효율을 발견하고,\n그 자리에서 솔루션을 제안합니다.\n스마일샤크에서 70개 이상의 고객사를\n직접 관리한 경험이 이를 뒷받침합니다.",
      color: C.teal,
    },
    {
      num: "02",
      title: "만들면서 생각한다",
      body: "기획서보다 프로토타입을 먼저 만듭니다.\nDear,ANT를 Claude Code로 직접 구현하며\n아이디어를 검증했습니다.\n빠르게 만들고 빠르게 개선합니다.",
      color: C.amber,
    },
    {
      num: "03",
      title: "비용을 항상 생각한다",
      body: "기술 선택은 비용과 함께 판단합니다.\nRI 분석, S3 Lifecycle 정책,\n번들 사이즈 최적화까지\n불필요한 지출을 줄이는 것에 집중합니다.",
      color: C.teal,
    },
  ];

  const cardW = 3.7;
  const cardGap = 0.4;
  const startX = 0.7;

  principles.forEach((p, i) => {
    const cx = startX + i * (cardW + cardGap);
    const cy = 1.8;
    const ch = 4.5;

    addCard(slide, cx, cy, cardW, ch);

    // Number circle
    slide.addShape(pptx.shapes.OVAL, {
      x: cx + cardW / 2 - 0.4, y: cy + 0.3, w: 0.8, h: 0.8,
      fill: { color: p.color },
    });
    slide.addText(p.num, {
      x: cx + cardW / 2 - 0.4, y: cy + 0.3, w: 0.8, h: 0.8,
      fontSize: 18, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle",
    });

    // Title
    slide.addText(p.title, {
      x: cx + 0.3, y: cy + 1.3, w: cardW - 0.6, h: 0.5,
      fontSize: 15, fontFace: "Arial", color: C.charcoal, bold: true, align: "center",
    });

    // Accent line
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: cx + cardW / 2 - 0.5, y: cy + 1.85, w: 1.0, h: 0.04,
      fill: { color: p.color },
    });

    // Body
    slide.addText(p.body, {
      x: cx + 0.3, y: cy + 2.1, w: cardW - 0.6, h: 2.0,
      fontSize: 11, fontFace: "Arial", color: C.bodyText, lineSpacingMultiple: 1.4, align: "center",
    });
  });
})();

// ════════════════════════════════════════
// SLIDE 10: Thank you
// ════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  slide.background = { color: C.charcoal };

  // Left accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: C.teal },
  });

  // Decorative
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 10.5, y: 5, w: 2.83, h: 2.5,
    fill: { color: C.teal },
    transparency: 85,
  });

  // Thank you
  slide.addText("감사합니다", {
    x: 1.2, y: 1.5, w: 10, h: 1.0,
    fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true,
  });

  // Tagline
  slide.addText("기술로 고객의 문제를 해결하겠습니다", {
    x: 1.2, y: 2.7, w: 10, h: 0.6,
    fontSize: 20, fontFace: "Arial", color: C.teal,
  });

  // Divider
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 1.2, y: 3.6, w: 4.0, h: 0.04,
    fill: { color: C.amber },
  });

  // Contact info
  const contactItems = [
    { label: "Email", value: "apple22by33@naver.com" },
    { label: "Phone", value: "+82-10-8550-8464" },
    { label: "Blog", value: "https://substack.com/@bitbit1" },
  ];
  contactItems.forEach((c, i) => {
    const cy = 4.0 + i * 0.6;
    slide.addText(c.label, {
      x: 1.2, y: cy, w: 1.5, h: 0.4,
      fontSize: 12, fontFace: "Arial", color: C.midGray, bold: true,
    });
    slide.addText(c.value, {
      x: 2.7, y: cy, w: 6, h: 0.4,
      fontSize: 12, fontFace: "Arial", color: C.white,
    });
  });

  // Bottom bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 6.8, w: 13.33, h: 0.7,
    fill: { color: "162032" },
  });
  slide.addText("장정빈  |  Cloud Infra  |  AI Service  |  Technical Consulting", {
    x: 1.2, y: 6.85, w: 10, h: 0.5,
    fontSize: 10, fontFace: "Arial", color: C.midGray, align: "left",
  });
})();

// ─── Write file ───
const outPath = "/Users/jeongbin/dear.ant/public/portfolio/포트폴리오_장정빈_기술컨설턴트.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log("PPTX created:", outPath))
  .catch((err) => console.error("Error:", err));
