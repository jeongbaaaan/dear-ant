const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();

const C = {
  dark: "0F172A",
  indigo: "6366F1",
  emerald: "10B981",
  white: "FFFFFF",
  light: "F1F5F9",
  mid: "94A3B8",
  body: "334155",
  card: "F8FAFC",
  indigoLight: "EEF2FF",
  emeraldLight: "D1FAE5",
  darkAlt: "1E293B",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.title = "이력서_장정빈_2025";

function topBar(s) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.07, fill: { color: C.indigo } });
}
function pageNum(s, n) {
  s.addText(`${n} / 12`, { x: 11.5, y: 7.0, w: 1.5, h: 0.4, fontSize: 9, color: C.mid, fontFace: "Arial", align: "right" });
}
function secTitle(s, t, sub) {
  s.addText(t, { x: 0.7, y: 0.35, w: 10, h: 0.55, fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true });
  if (sub) s.addText(sub, { x: 0.7, y: 0.88, w: 10, h: 0.32, fontSize: 13, fontFace: "Arial", color: C.mid });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.22, w: 1.2, h: 0.05, fill: { color: C.indigo } });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: fill || C.card },
    line: { color: "E2E8F0", width: 0.5 },
    shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.1 },
  });
}

// ═══ SLIDE 1: Cover ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.indigo } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 0, w: 2.83, h: 2.5, fill: { color: C.indigo }, transparency: 85 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 11.5, y: 5.5, w: 1.83, h: 2, fill: { color: C.emerald }, transparency: 88 });
  s.addText("장정빈", { x: 1.2, y: 1.8, w: 8, h: 1.0, fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true });
  s.addText("기술과 고객 사이에서 문제를 풀어갑니다", { x: 1.2, y: 2.85, w: 8, h: 0.6, fontSize: 22, fontFace: "Arial", color: C.indigo });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.6, w: 3.5, h: 0.04, fill: { color: C.emerald } });
  s.addText("Cloud Infra  |  AI Service  |  Technical Consulting", { x: 1.2, y: 3.85, w: 8, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.mid });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.5, w: 13.33, h: 1.0, fill: { color: "0A0F1E" } });
  s.addText("apple22by33@naver.com   |   +82-10-8550-8464   |   substack.com/@bitbit1", { x: 1.2, y: 6.7, w: 10, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.mid });
})();

// ═══ SLIDE 2: Profile Summary ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Profile"); pageNum(s, 2);

  // Left info card
  card(s, 0.7, 1.6, 5.5, 4.0);
  const infos = [
    { k: "이름", v: "장정빈" },
    { k: "학력", v: "가천대학교 경제학과 (3.6/4.5)" },
    { k: "해외", v: "Oklahoma State University 교환학생" },
    { k: "자격", v: "AWS SAA  |  ADsP  |  OPIc IH" },
    { k: "이메일", v: "apple22by33@naver.com" },
    { k: "연락처", v: "+82-10-8550-8464" },
  ];
  infos.forEach((info, i) => {
    const iy = 1.85 + i * 0.55;
    s.addText(info.k, { x: 1.0, y: iy, w: 1.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.indigo, bold: true });
    s.addText(info.v, { x: 2.5, y: iy, w: 3.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.body });
  });

  // Right intro
  card(s, 6.55, 1.6, 6.1, 4.0);
  s.addText("About Me", { x: 6.85, y: 1.8, w: 5, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });
  s.addText("클라우드 인프라를 관리하며 70개 이상의 고객 문제를 해결하고, AI 도구로 서비스를 직접 만들어본 경험이 있습니다.\n\n고객의 기술적 어려움을 파악해서 해결책을 제안하고, 필요하면 직접 프로토타입을 만들어 검증합니다.", {
    x: 6.85, y: 2.35, w: 5.5, h: 2.5, fontSize: 12, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.5,
  });

  // Tags
  const tags = ["Cloud Infrastructure", "AI-Powered Building", "Customer Problem Solving"];
  tags.forEach((t, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 3.2, y: 6.0, w: 3.0, h: 0.45, rectRadius: 0.05, fill: { color: C.indigoLight } });
    s.addText(t, { x: 0.7 + i * 3.2, y: 6.0, w: 3.0, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.indigo, bold: true, align: "center" });
  });
})();

// ═══ SLIDE 3: Career Timeline ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Career Timeline"); pageNum(s, 3);

  // Timeline bar
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 3.5, w: 11.9, h: 0.06, fill: { color: C.indigo } });

  const events = [
    { date: "2023.09", title: "신한은행", desc: "기업뱅킹 IT기획", color: C.mid },
    { date: "2023.11", title: "네이버클라우드", desc: "Clova X AI PM", color: C.indigo },
    { date: "2024.01", title: "AWS CloudSchool", desc: "클라우드 아키텍처", color: C.emerald },
    { date: "2024.11", title: "스마일샤크", desc: "Account Manager", color: C.indigo },
    { date: "2025.03", title: "Dear,ANT", desc: "AI 서비스 런칭", color: C.emerald },
  ];

  events.forEach((e, i) => {
    const ex = 0.7 + i * 2.4;
    // Dot on timeline
    s.addShape(pptx.shapes.OVAL, { x: ex + 0.7, y: 3.3, w: 0.45, h: 0.45, fill: { color: e.color } });
    // Date above
    s.addText(e.date, { x: ex, y: 2.4, w: 2.0, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.mid, align: "center" });
    // Title
    s.addText(e.title, { x: ex, y: 2.7, w: 2.0, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
    // Desc below
    s.addText(e.desc, { x: ex, y: 4.1, w: 2.0, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.body, align: "center" });
  });
})();

// ═══ SLIDE 4: 스마일샤크 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "스마일샤크", "Account Manager  |  2024.11 ~ 현재  |  AWS MSP 파트너"); pageNum(s, 4);

  s.addText("고객 문제를 발견하고 기술로 해결합니다", { x: 0.7, y: 1.45, w: 10, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.indigo, italic: true });

  // QR story flow
  const steps = [
    { title: "발견", body: "고객사 QR 이미지\n원본(3MB) 그대로 저장\n대역폭 낭비 + 비용 증가", color: "EF4444" },
    { title: "분석", body: "Cost Explorer로\n스토리지/전송 비용 급증 확인\n실제 필요: 300KB", color: C.indigo },
    { title: "제안", body: "S3 → Lambda 리사이징\n→ CloudFront CDN 배포\n자동화 아키텍처 설계", color: C.indigo },
    { title: "효과", body: "스토리지 60% 절감\n로딩 속도 개선\n비용 구조 최적화", color: C.emerald },
  ];

  steps.forEach((st, i) => {
    const sx = 0.7 + i * 3.05;
    card(s, sx, 2.0, 2.7, 2.5);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: sx + 0.15, y: 2.15, w: 1.0, h: 0.35, rectRadius: 0.05, fill: { color: st.color } });
    s.addText(st.title, { x: sx + 0.15, y: 2.15, w: 1.0, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(st.body, { x: sx + 0.2, y: 2.7, w: 2.3, h: 1.5, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });

  // Arrows
  for (let i = 0; i < 3; i++) {
    const ax = 0.7 + (i + 1) * 3.05 - 0.3;
    s.addText("→", { x: ax, y: 2.8, w: 0.4, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.indigo, bold: true, align: "center" });
  }

  // Additional contributions
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 4.8, w: 11.9, h: 0.03, fill: { color: "E2E8F0" } });
  const extras = [
    "70+ 고객 계정 클라우드 인프라 관리 (EC2, S3, RDS, Lambda, CloudFront)",
    "AWS Cost Explorer 비용 분석 → RI 전환 권고로 On-Demand 비용 절감",
    "신규 고객사 PoC 기획: 요구사항 분석 → Well-Architected 기반 아키텍처 설계 → 견적 산출",
  ];
  extras.forEach((t, i) => {
    s.addText(t, { x: 1.0, y: 5.0 + i * 0.4, w: 11, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.body, bullet: true });
  });
})();

// ═══ SLIDE 5: 프로젝트 (CloudSchool + Clova X) ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "프로젝트 경험"); pageNum(s, 5);

  // Left: CloudSchool
  card(s, 0.7, 1.6, 6.0, 5.0);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 1.75, w: 2.8, h: 0.38, rectRadius: 0.05, fill: { color: C.emerald } });
  s.addText("AWS CloudSchool 4기  |  2024.01~07", { x: 0.9, y: 1.75, w: 2.8, h: 0.38, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  s.addText("경매 웹사이트 CQRS 설계", { x: 0.9, y: 2.3, w: 5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true });

  // CQRS boxes
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 2.85, w: 1.7, h: 0.5, rectRadius: 0.05, fill: { color: C.indigo } });
  s.addText("Command (Write)", { x: 1.0, y: 2.85, w: 1.7, h: 0.5, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });
  s.addText("→", { x: 2.75, y: 2.85, w: 0.4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.dark, align: "center" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.2, y: 2.85, w: 1.5, h: 0.5, rectRadius: 0.05, fill: { color: C.dark } });
  s.addText("Primary DB", { x: 3.2, y: 2.85, w: 1.5, h: 0.5, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 3.55, w: 1.7, h: 0.5, rectRadius: 0.05, fill: { color: C.emerald } });
  s.addText("Query (Read)", { x: 1.0, y: 3.55, w: 1.7, h: 0.5, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });
  s.addText("→", { x: 2.75, y: 3.55, w: 0.4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.dark, align: "center" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.2, y: 3.55, w: 1.5, h: 0.5, rectRadius: 0.05, fill: { color: "475569" } });
  s.addText("Read Replica", { x: 3.2, y: 3.55, w: 1.5, h: 0.5, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  // Results
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 4.4, w: 2.2, h: 0.55, rectRadius: 0.05, fill: { color: C.indigoLight } });
  s.addText("처리량 2x 향상", { x: 1.0, y: 4.4, w: 2.2, h: 0.55, fontSize: 11, fontFace: "Arial", color: C.indigo, bold: true, align: "center" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.4, y: 4.4, w: 2.2, h: 0.55, rectRadius: 0.05, fill: { color: C.emeraldLight } });
  s.addText("비용 30% 절감", { x: 3.4, y: 4.4, w: 2.2, h: 0.55, fontSize: 11, fontFace: "Arial", color: C.emerald, bold: true, align: "center" });

  // Role tags
  const roles = ["부팀장", "DB 리더", "Frontend"];
  roles.forEach((r, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0 + i * 1.5, y: 5.2, w: 1.3, h: 0.35, rectRadius: 0.05, fill: { color: C.indigoLight } });
    s.addText(r, { x: 1.0 + i * 1.5, y: 5.2, w: 1.3, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.indigo, bold: true, align: "center" });
  });

  // Right: Clova X
  card(s, 7.05, 1.6, 5.6, 5.0);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.25, y: 1.75, w: 3.2, h: 0.38, rectRadius: 0.05, fill: { color: C.indigo } });
  s.addText("네이버클라우드 Clova X  |  2023.11~12", { x: 7.25, y: 1.75, w: 3.2, h: 0.38, fontSize: 9.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  s.addText("AI 챗봇 PM", { x: 7.25, y: 2.3, w: 5, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.dark, bold: true });

  const clovaItems = [
    "프롬프트 데이터셋 구축 (Few-shot 기반)",
    "UX 흐름 설계, 사용자 시나리오 작성",
    "기획 → API 스펙 변환 → 개발팀 협업",
  ];
  clovaItems.forEach((t, i) => {
    s.addText(t, { x: 7.45, y: 2.85 + i * 0.45, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.body, bullet: true });
  });

  // Result highlight
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.25, y: 4.2, w: 5.1, h: 1.0, rectRadius: 0.08, fill: { color: C.indigoLight } });
  s.addText([
    { text: "수정 사이클 ", options: { fontSize: 12, fontFace: "Arial", color: C.body } },
    { text: "3회 → 1회", options: { fontSize: 20, fontFace: "Arial Black", color: C.indigo, bold: true } },
  ], { x: 7.45, y: 4.25, w: 4.7, h: 0.5 });
  s.addText("프롬프트 데이터셋 품질 개선으로 기획-개발 간 효율화", { x: 7.45, y: 4.75, w: 4.7, h: 0.35, fontSize: 10, fontFace: "Arial", color: C.body });
})();

// ═══ SLIDE 6: Dear,ANT ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "Dear,ANT", "Personal Project  |  2025.03  |  AI 투자 판단 리포트 서비스"); pageNum(s, 6);

  // Problem banner
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.6, w: 11.9, h: 0.6, rectRadius: 0.06, fill: { color: "FEF3C7" } });
  s.addText("주식 투자의 70%는 감정에 의한 판단 — 개미 투자자에겐 자신을 객관적으로 볼 도구가 없다", { x: 1.0, y: 1.63, w: 11.3, h: 0.55, fontSize: 12, fontFace: "Arial", color: C.dark, align: "center" });

  // Features
  const feats = [
    { title: "투자 성향 리포트", desc: "7문항 설문 → AI 분석\nA~F 등급 판정" },
    { title: "트레이딩 저널", desc: "매매 기록 관리\n감정 태깅 분석" },
    { title: "금융 계산기", desc: "복리 / 적금 vs 투자\n비교 시뮬레이션" },
  ];
  feats.forEach((f, i) => {
    const fx = 0.7 + i * 4.0;
    card(s, fx, 2.5, 3.7, 1.6);
    s.addText(f.title, { x: fx + 0.2, y: 2.6, w: 3.3, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.indigo, bold: true });
    s.addText(f.desc, { x: fx + 0.2, y: 3.05, w: 3.3, h: 0.9, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.3 });
  });

  // Tech stack
  s.addText("Tech Stack", { x: 0.7, y: 4.4, w: 3, h: 0.35, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true });
  const techs = ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS 4", "Supabase"];
  techs.forEach((t, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 2.1, y: 4.8, w: 1.9, h: 0.38, rectRadius: 0.05, fill: { color: C.dark } });
    s.addText(t, { x: 0.7 + i * 2.1, y: 4.8, w: 1.9, h: 0.38, fontSize: 10, fontFace: "Arial", color: C.white, align: "center" });
  });

  // How
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.5, w: 11.9, h: 0.9, rectRadius: 0.08, fill: { color: C.indigoLight } });
  s.addText("Claude Code와 대화하며 기획 → 설계 → 개발 → 배포까지 1인 End-to-End 완성", { x: 1.0, y: 5.55, w: 11.3, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.indigo, bold: true, align: "center" });
  s.addText("REST API 5개 엔드포인트 | Custom SVG 차트/캐릭터 | Dual Storage (Supabase + In-memory)", { x: 1.0, y: 5.95, w: 11.3, h: 0.35, fontSize: 10.5, fontFace: "Arial", color: C.body, align: "center" });
})();

// ═══ SLIDE 7: AI 활용 역량 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "AI 활용 역량", "AI는 제 업무 도구입니다"); pageNum(s, 7);

  const caps = [
    { icon: "01", title: "서비스 빌드", body: "Claude Code로 Dear,ANT 전체 개발\n기획→코딩→디버깅→배포까지 대화형으로\n\n팀 3-4명 1개월 작업 → 1인 2주 완성", color: C.indigo },
    { icon: "02", title: "프롬프트 설계", body: "Clova X PM으로 Few-shot 데이터셋 구축\n답변 품질을 구조적으로 설계\n\n수정 사이클 3회 → 1회 (66% 단축)", color: C.emerald },
    { icon: "03", title: "업무 자동화", body: "기술 문서 작성, 아키텍처 설계,\n코드 리뷰에 AI 활용\n\n반복 작업 자동화로 핵심 업무 집중", color: C.indigo },
    { icon: "04", title: "빠른 검증", body: "아이디어 → 동작하는 프로토타입 수일 내\n기획 단계에서 '이게 되나?'를\n직접 만들어서 확인", color: C.emerald },
  ];

  caps.forEach((c, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cx = 0.7 + col * 6.15;
    const cy = 1.6 + row * 2.7;
    card(s, cx, cy, 5.85, 2.4);

    // Number circle
    s.addShape(pptx.shapes.OVAL, { x: cx + 0.2, y: cy + 0.2, w: 0.6, h: 0.6, fill: { color: c.color } });
    s.addText(c.icon, { x: cx + 0.2, y: cy + 0.2, w: 0.6, h: 0.6, fontSize: 14, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle" });

    s.addText(c.title, { x: cx + 1.0, y: cy + 0.2, w: 4, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(c.body, { x: cx + 1.0, y: cy + 0.75, w: 4.5, h: 1.5, fontSize: 11, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.35 });
  });

  // Bottom note
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.85, w: 11.9, h: 0.5, rectRadius: 0.05, fill: { color: "FEF3C7" } });
  s.addText("AI를 '써본' 수준이 아니라, AI로 '만들어본' 경험이 있습니다", { x: 1.0, y: 6.88, w: 11.3, h: 0.45, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
})();

// ═══ SLIDE 8: 직무 커버리지 맵 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "커버리지 가능 직무"); pageNum(s, 8);

  // Center circle
  s.addShape(pptx.shapes.OVAL, { x: 5.4, y: 2.8, w: 2.5, h: 2.5, fill: { color: C.indigo } });
  s.addText("장정빈", { x: 5.4, y: 3.2, w: 2.5, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.white, bold: true, align: "center" });
  s.addText("고객 x 기술 x AI", { x: 5.4, y: 3.7, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Arial", color: "C7D2FE", align: "center" });

  const jobs = [
    { title: "TAM", desc: "고객 기술 지원\n+ 인프라 컨설팅", x: 0.5, y: 1.5, color: C.indigo },
    { title: "CSM", desc: "고객 온보딩\n+ 활용 극대화", x: 4.3, y: 0.3, color: C.emerald },
    { title: "Solutions\nConsultant", desc: "기술 데모\n+ 요구사항 분석", x: 8.6, y: 1.5, color: C.indigo },
    { title: "AI\nConsultant", desc: "AI 자동화 설계\n+ 도구 활용", x: 0.5, y: 5.0, color: C.emerald },
    { title: "Pre-sales", desc: "PoC 기획\n+ 기술 제안서", x: 4.3, y: 6.0, color: C.indigo },
    { title: "B2B SaaS\nPM", desc: "서비스 기획\n+ 고객 피드백", x: 8.6, y: 5.0, color: C.emerald },
  ];

  jobs.forEach((j) => {
    card(s, j.x, j.y, 3.5, 1.3);
    s.addShape(pptx.shapes.RECTANGLE, { x: j.x, y: j.y, w: 0.08, h: 1.3, fill: { color: j.color } });
    s.addText(j.title, { x: j.x + 0.2, y: j.y + 0.1, w: 1.5, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(j.desc, { x: j.x + 1.6, y: j.y + 0.15, w: 1.7, h: 0.9, fontSize: 10, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.3 });
  });
})();

// ═══ SLIDE 9: 기술 역량 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "기술 역량"); pageNum(s, 9);

  // Left: 직접 사용
  s.addText("직접 사용", { x: 0.7, y: 1.6, w: 5, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });

  const groups = [
    { cat: "Cloud", items: "EC2, S3, Lambda, RDS, CloudFront, Cost Explorer", c: C.indigo },
    { cat: "Dev", items: "Next.js, TypeScript, React, Python, JavaScript", c: C.emerald },
    { cat: "DB", items: "Supabase(PostgreSQL), MySQL, CQRS", c: C.indigo },
    { cat: "Tools", items: "Docker, Linux, JIRA, Figma, Notion", c: C.emerald },
  ];
  groups.forEach((g, i) => {
    const gy = 2.1 + i * 0.85;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: gy, w: 1.2, h: 0.4, rectRadius: 0.05, fill: { color: g.c } });
    s.addText(g.cat, { x: 0.7, y: gy, w: 1.2, h: 0.4, fontSize: 10.5, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(g.items, { x: 2.05, y: gy, w: 4.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.body, valign: "middle" });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: gy + 0.5, w: 5.8, h: 0.015, fill: { color: "E2E8F0" } });
  });

  // Right: 이해/설계 가능
  s.addShape(pptx.shapes.RECTANGLE, { x: 6.7, y: 1.6, w: 0.03, h: 4.5, fill: { color: "E2E8F0" } });
  s.addText("이해/설계 가능", { x: 7.1, y: 1.6, w: 5, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });

  const concepts = [
    "Serverless Architecture",
    "CQRS Pattern",
    "Cost Optimization Strategy",
    "API Design & Integration",
    "Well-Architected Framework",
  ];
  concepts.forEach((co, i) => {
    const cy = 2.2 + i * 0.75;
    card(s, 7.1, cy, 5.5, 0.6);
    s.addShape(pptx.shapes.RECTANGLE, { x: 7.1, y: cy, w: 0.07, h: 0.6, fill: { color: C.indigo } });
    s.addText(co, { x: 7.4, y: cy, w: 5, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.dark, valign: "middle" });
  });
})();

// ═══ SLIDE 10: 자격증 & 교육 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "자격증 & 교육"); pageNum(s, 10);

  // Left: Certs
  card(s, 0.7, 1.6, 5.8, 4.5);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 1.75, w: 2.0, h: 0.38, rectRadius: 0.05, fill: { color: C.indigo } });
  s.addText("Certifications", { x: 0.9, y: 1.75, w: 2.0, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  const certs = [
    { name: "AWS Solutions Architect Associate", date: "2024.07", tag: "AWS SAA", accent: false },
    { name: "AWS Hackathon 대상 (1위)", date: "2024.02", tag: "대상", accent: true },
    { name: "ADsP (데이터분석 준전문가)", date: "2023.11", tag: "ADsP", accent: false },
    { name: "OPIc IH (영어)", date: "2024.04", tag: "OPIc", accent: false },
  ];
  certs.forEach((c, i) => {
    const cy = 2.4 + i * 0.85;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: cy, w: 1.0, h: 0.38, rectRadius: 0.05, fill: { color: c.accent ? C.emerald : C.indigoLight } });
    s.addText(c.tag, { x: 1.0, y: cy, w: 1.0, h: 0.38, fontSize: 9.5, fontFace: "Arial", color: c.accent ? C.white : C.indigo, bold: true, align: "center" });
    s.addText(c.name, { x: 2.2, y: cy, w: 3.5, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.body, valign: "middle" });
    s.addText(c.date, { x: 5.3, y: cy, w: 1.0, h: 0.38, fontSize: 9.5, fontFace: "Arial", color: C.mid, align: "right" });
  });

  // Right: Training
  card(s, 6.85, 1.6, 5.8, 4.5);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.05, y: 1.75, w: 2.8, h: 0.38, rectRadius: 0.05, fill: { color: C.emerald } });
  s.addText("AWS Official Training (6)", { x: 7.05, y: 1.75, w: 2.8, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center" });

  const trains = [
    "Developing Serverless Solutions on AWS",
    "DevOps Engineering on AWS",
    "Developing on AWS",
    "AWS Well-Architected Best Practices",
    "AWS Technical Essentials",
    "AWS Security Essentials",
  ];
  trains.forEach((t, i) => {
    const ty = 2.4 + i * 0.6;
    s.addShape(pptx.shapes.RECTANGLE, { x: 7.05, y: ty + 0.05, w: 0.06, h: 0.28, fill: { color: C.emerald } });
    s.addText(t, { x: 7.35, y: ty, w: 5, h: 0.38, fontSize: 10.5, fontFace: "Arial", color: C.body, valign: "middle" });
  });
})();

// ═══ SLIDE 11: 일하는 방식 ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  topBar(s); secTitle(s, "저는 이렇게 일합니다"); pageNum(s, 11);

  const principles = [
    { num: "01", title: "현장에서 답을 찾는다", body: "70+ 고객을 직접 만나며 체득.\n책상에서 기획하지 않고\n현장에서 발견하고 제안합니다.", color: C.indigo },
    { num: "02", title: "일단 만들어본다", body: "기획서보다 프로토타입을 먼저.\nClaude Code로 Dear,ANT를\n직접 구현하며 검증했습니다.", color: C.emerald },
    { num: "03", title: "비용을 생각한다", body: "RI 분석, S3 Lifecycle,\nLambda로 비용 최적화.\n기술 선택은 항상 비용과 함께.", color: C.indigo },
  ];

  principles.forEach((p, i) => {
    const cx = 0.7 + i * 4.1;
    card(s, cx, 1.7, 3.8, 4.5);
    s.addShape(pptx.shapes.OVAL, { x: cx + 1.5, y: 2.0, w: 0.8, h: 0.8, fill: { color: p.color } });
    s.addText(p.num, { x: cx + 1.5, y: 2.0, w: 0.8, h: 0.8, fontSize: 18, fontFace: "Arial Black", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(p.title, { x: cx + 0.3, y: 3.0, w: 3.2, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
    s.addShape(pptx.shapes.RECTANGLE, { x: cx + 1.4, y: 3.55, w: 1.0, h: 0.04, fill: { color: p.color } });
    s.addText(p.body, { x: cx + 0.3, y: 3.8, w: 3.2, h: 2.0, fontSize: 11.5, fontFace: "Arial", color: C.body, lineSpacingMultiple: 1.4, align: "center" });
  });
})();

// ═══ SLIDE 12: Thank You ═══
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.indigo } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 5, w: 2.83, h: 2.5, fill: { color: C.indigo }, transparency: 85 });

  s.addText("감사합니다", { x: 1.2, y: 1.5, w: 10, h: 1.0, fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true });
  s.addText("기술로 고객의 문제를 풀겠습니다", { x: 1.2, y: 2.7, w: 10, h: 0.6, fontSize: 20, fontFace: "Arial", color: C.indigo });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.5, w: 4.0, h: 0.04, fill: { color: C.emerald } });

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
  s.addText("장정빈  |  Cloud Infra  |  AI Service  |  Technical Consulting", { x: 1.2, y: 6.85, w: 10, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.mid });
})();

const outPath = "/Users/jeongbin/dear.ant/public/portfolio/이력서_장정빈_2025.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log("PPTX created:", outPath))
  .catch((err) => console.error("Error:", err));
