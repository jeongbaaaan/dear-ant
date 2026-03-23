const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();

// ── Theme ──
const C = {
  navy: "1A1F36",
  blue: "4F46E5",
  white: "FFFFFF",
  lightGray: "F1F5F9",
  medGray: "94A3B8",
  darkText: "1E293B",
  accent: "6366F1",
  softBlue: "E0E7FF",
  cardBg: "F8FAFC",
};

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "장정빈";
pptx.subject = "채널코퍼레이션 AX Consultant 포트폴리오";

// ── Helpers ──
function addNavyBg(slide) {
  slide.background = { fill: C.navy };
}

function addWhiteBg(slide) {
  slide.background = { fill: C.white };
}

function addBottomStripe(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 6.9, w: 13.33, h: 0.6,
    fill: { color: C.blue },
  });
}

function addTopAccent(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: C.blue },
  });
}

function addPageNumber(slide, num) {
  slide.addText(String(num).padStart(2, "0"), {
    x: 12.3, y: 7.0, w: 0.8, h: 0.35,
    fontSize: 9, color: C.medGray, fontFace: "Arial",
    align: "right",
  });
}

function addSectionTitle(slide, title, subtitle) {
  addTopAccent(slide);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.35, w: 0.15, h: 0.55,
    fill: { color: C.blue },
  });
  slide.addText(title, {
    x: 1.0, y: 0.3, w: 8, h: 0.65,
    fontSize: 24, fontFace: "Arial Black", color: C.darkText, bold: true,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 1.0, y: 0.95, w: 10, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: C.medGray,
    });
  }
}

// ══════════════════════════════════════════
// SLIDE 1 — Cover
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addNavyBg(slide);

  // Large decorative circle (top-right)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5, y: -1.5, w: 5, h: 5,
    fill: { color: C.blue, transparency: 80 },
  });
  // Small decorative circle
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.8, y: 4.5, w: 2, h: 2,
    fill: { color: C.accent, transparency: 85 },
  });

  // Left accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: 2.2, w: 0.18, h: 1.8,
    fill: { color: C.blue },
  });

  slide.addText("장정빈", {
    x: 1.5, y: 2.0, w: 8, h: 1.2,
    fontSize: 52, fontFace: "Arial Black", color: C.white, bold: true,
  });

  slide.addText("고객의 문제를 AI로 푸는 사람", {
    x: 1.5, y: 3.2, w: 8, h: 0.7,
    fontSize: 22, fontFace: "Arial", color: C.softBlue,
  });

  // Divider line
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.5, y: 4.2, w: 3.5, h: 0.03,
    fill: { color: C.blue },
  });

  slide.addText("AX Consultant 지원", {
    x: 1.5, y: 4.5, w: 6, h: 0.45,
    fontSize: 14, fontFace: "Arial", color: C.medGray,
  });

  // Contact info at bottom
  slide.addText([
    { text: "apple22by33@naver.com", options: { fontSize: 11, fontFace: "Arial", color: C.medGray } },
    { text: "  |  +82-10-8550-8464", options: { fontSize: 11, fontFace: "Arial", color: C.medGray } },
  ], {
    x: 1.5, y: 6.5, w: 8, h: 0.4,
  });
})();

// ══════════════════════════════════════════
// SLIDE 2 — 왜 저인가
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "왜 저인가", "세 가지 이유");
  addPageNumber(slide, 2);

  const cards = [
    {
      num: "01",
      title: "70+ 고객사를 직접 만났습니다",
      body: "스마일샤크에서 고객의 클라우드 인프라를 관리하며 현장의 문제를 직접 발견하고, 해결 방안을 제안해왔습니다. 보고서가 아니라 대화에서 시작합니다.",
    },
    {
      num: "02",
      title: "Claude Code로 서비스를 만들었습니다",
      body: "Dear,ANT라는 AI 투자 리포트 서비스를 기획부터 배포까지 Claude Code와 함께 혼자 구축했습니다. AI 도구를 쓰는 게 아니라 같이 일합니다.",
    },
    {
      num: "03",
      title: "AI 서비스를 기획해봤습니다",
      body: "네이버 Clova X 챗봇 PM으로 프롬프트를 설계하고 UX 흐름을 만들었습니다. AI가 잘 답하게 만드는 건 기술보다 설계의 문제라는 걸 배웠습니다.",
    },
  ];

  cards.forEach((c, i) => {
    const xPos = 0.6 + i * 4.1;
    // Card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 3.8, h: 4.8,
      fill: { color: C.cardBg },
      rectRadius: 0.1,
      line: { color: "E2E8F0", width: 1 },
    });
    // Number badge
    slide.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 0.3, y: 2.0, w: 0.7, h: 0.7,
      fill: { color: C.blue },
    });
    slide.addText(c.num, {
      x: xPos + 0.3, y: 2.0, w: 0.7, h: 0.7,
      fontSize: 14, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });
    // Title
    slide.addText(c.title, {
      x: xPos + 0.3, y: 2.9, w: 3.2, h: 0.8,
      fontSize: 15, fontFace: "Arial Black", color: C.darkText, bold: true,
      wrap: true,
    });
    // Body
    slide.addText(c.body, {
      x: xPos + 0.3, y: 3.75, w: 3.2, h: 2.4,
      fontSize: 11, fontFace: "Arial", color: C.medGray,
      wrap: true, lineSpacingMultiple: 1.3,
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 3 — 스마일샤크
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "스마일샤크", "현장에서 문제를 찾다  |  Account Manager  |  2024.11 ~ 현재");
  addPageNumber(slide, 3);

  // Story text
  slide.addText("고객사가 QR 코드 이미지를 S3에 원본 그대로 저장하고 있었습니다. 클라이언트에서 리사이징하느라 대역폭은 낭비되고, 비용은 계속 올라가고 있었습니다.", {
    x: 0.8, y: 1.6, w: 11.5, h: 0.8,
    fontSize: 12, fontFace: "Arial", color: C.darkText,
    wrap: true, lineSpacingMultiple: 1.4,
    italic: true,
  });

  // Flow diagram: Problem → Discovery → Solution → Result
  const steps = [
    { label: "Problem", desc: "S3 원본 이미지\n대역폭 낭비", color: "EF4444" },
    { label: "Discovery", desc: "현장 고객 미팅에서\n비효율 발견", color: "F59E0B" },
    { label: "Solution", desc: "Lambda 자동 리사이징\n+ CloudFront 배포", color: C.blue },
    { label: "Result", desc: "스토리지 60% 절감\n로딩 속도 개선", color: "10B981" },
  ];

  steps.forEach((s, i) => {
    const xPos = 0.8 + i * 3.1;
    // Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 2.8, w: 2.6, h: 2.0,
      fill: { color: C.white },
      rectRadius: 0.08,
      line: { color: s.color, width: 2 },
      shadow: { type: "outer", blur: 4, offset: 2, color: "D1D5DB", opacity: 0.3 },
    });
    // Label badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.3, y: 2.95, w: 1.2, h: 0.35,
      fill: { color: s.color },
      rectRadius: 0.05,
    });
    slide.addText(s.label, {
      x: xPos + 0.3, y: 2.95, w: 1.2, h: 0.35,
      fontSize: 9, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });
    // Description
    slide.addText(s.desc, {
      x: xPos + 0.25, y: 3.5, w: 2.1, h: 1.1,
      fontSize: 11, fontFace: "Arial", color: C.darkText,
      wrap: true, lineSpacingMultiple: 1.3,
    });
    // Arrow between boxes
    if (i < 3) {
      slide.addText(">", {
        x: xPos + 2.6, y: 3.4, w: 0.5, h: 0.6,
        fontSize: 22, fontFace: "Arial Black", color: C.blue, align: "center", valign: "middle",
        bold: true,
      });
    }
  });

  // Bottom additional info
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 5.2, w: 11.5, h: 0.04,
    fill: { color: "E2E8F0" },
  });

  const extras = [
    "70+ 고객사 클라우드 인프라 관리",
    "AWS Cost Explorer 비용 분석 및 리포트",
    "PoC 기획 및 기술 컨설팅",
  ];
  extras.forEach((t, i) => {
    slide.addText(t, {
      x: 0.8 + i * 4.0, y: 5.5, w: 3.6, h: 0.4,
      fontSize: 11, fontFace: "Arial", color: C.medGray,
      bullet: true,
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 4 — Dear,ANT 소개
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "Dear,ANT", "Claude Code로 직접 만들었습니다  |  개인 프로젝트  |  2025.03");
  addPageNumber(slide, 4);

  // Highlight box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 11.5, h: 1.1,
    fill: { color: C.softBlue },
    rectRadius: 0.08,
  });
  slide.addText("기획서를 쓰는 대신, 직접 만들었습니다.", {
    x: 1.1, y: 1.65, w: 10, h: 0.5,
    fontSize: 16, fontFace: "Arial Black", color: C.blue, bold: true,
  });
  slide.addText("Claude Code와 대화하면서 아이디어부터 배포까지 혼자 완성한 AI 투자 리포트 서비스", {
    x: 1.1, y: 2.15, w: 10, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: C.darkText,
  });

  // Tech stack pills
  const techs = ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS 4", "Supabase"];
  techs.forEach((t, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8 + i * 2.2, y: 3.0, w: 2.0, h: 0.4,
      fill: { color: C.navy },
      rectRadius: 0.2,
    });
    slide.addText(t, {
      x: 0.8 + i * 2.2, y: 3.0, w: 2.0, h: 0.4,
      fontSize: 10, fontFace: "Arial", color: C.white, align: "center", valign: "middle",
      bold: true,
    });
  });

  // Feature cards (2x2 grid)
  const features = [
    { title: "7문항 성향 설문", desc: "투자 성향을 파악하는 설문 시스템 설계.\n질문 구조와 가중치를 직접 설계" },
    { title: "AI 리포트 엔진", desc: "설문 결과 기반 개인화된 투자 성향\n리포트 자동 생성" },
    { title: "트레이딩 저널", desc: "매매 기록과 감정을 함께 추적하는\n투자 일지 시스템" },
    { title: "금융 계산기", desc: "복리 계산기, 적금 vs 투자 비교 등\n실용 금융 도구" },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = 0.8 + col * 5.8;
    const yPos = 3.8 + row * 1.55;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 5.5, h: 1.35,
      fill: { color: C.cardBg },
      rectRadius: 0.08,
      line: { color: "E2E8F0", width: 1 },
    });
    // Blue dot
    slide.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 0.25, y: yPos + 0.2, w: 0.2, h: 0.2,
      fill: { color: C.blue },
    });
    slide.addText(f.title, {
      x: xPos + 0.6, y: yPos + 0.1, w: 4.5, h: 0.35,
      fontSize: 13, fontFace: "Arial Black", color: C.darkText, bold: true,
    });
    slide.addText(f.desc, {
      x: xPos + 0.6, y: yPos + 0.5, w: 4.5, h: 0.7,
      fontSize: 10, fontFace: "Arial", color: C.medGray,
      wrap: true, lineSpacingMultiple: 1.3,
    });
  });

  // Bottom key message
  slide.addText("AI 도구를 써서 혼자 아이디어 > 기획 > 개발 > 배포까지 해낼 수 있습니다", {
    x: 0.8, y: 6.85, w: 11.5, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: C.blue, bold: true,
    align: "center",
  });
})();

// ══════════════════════════════════════════
// SLIDE 5 — Dear,ANT 기술 상세
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "Dear,ANT 기술 상세", "아키텍처와 핵심 설계");
  addPageNumber(slide, 5);

  // Architecture diagram (simplified block diagram)
  // Client → API Routes → Engine → Storage
  const blocks = [
    { label: "Client\n(React 19)", x: 0.8, color: C.accent },
    { label: "API Routes\n(5 Endpoints)", x: 3.6, color: C.blue },
    { label: "Report Engine\n(Algorithm)", x: 6.4, color: C.navy },
    { label: "Storage\n(Dual)", x: 9.2, color: "0F172A" },
  ];

  blocks.forEach((b) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: b.x, y: 1.7, w: 2.4, h: 1.2,
      fill: { color: b.color },
      rectRadius: 0.08,
      shadow: { type: "outer", blur: 3, offset: 2, color: "CBD5E1", opacity: 0.4 },
    });
    slide.addText(b.label, {
      x: b.x, y: 1.7, w: 2.4, h: 1.2,
      fontSize: 11, fontFace: "Arial", color: C.white, align: "center", valign: "middle",
      bold: true,
    });
  });

  // Arrows
  [3.2, 6.0, 8.8].forEach((ax) => {
    slide.addText(">", {
      x: ax, y: 1.9, w: 0.4, h: 0.8,
      fontSize: 20, fontFace: "Arial Black", color: C.blue, align: "center", valign: "middle",
    });
  });

  // Detail cards
  const details = [
    {
      title: "리포트 엔진",
      items: [
        "바이오리듬 삼각함수 기반 투자무드 산출",
        "감정 가중치 알고리즘 설계",
        "7문항 응답 데이터 실시간 분석",
      ],
    },
    {
      title: "API 설계",
      items: [
        "REST API 5개 엔드포인트",
        "설문 제출, 리포트 생성, 저널 CRUD",
        "에러 핸들링 및 유효성 검증",
      ],
    },
    {
      title: "프론트엔드",
      items: [
        "Custom SVG 차트 및 캐릭터 (외부 라이브러리 없이)",
        "반응형 UI, 모바일 최적화",
        "Tailwind CSS 4 기반 디자인 시스템",
      ],
    },
    {
      title: "스토리지",
      items: [
        "Supabase PostgreSQL 메인 DB",
        "In-memory fallback (장애 대비)",
        "데이터 스키마 직접 설계",
      ],
    },
  ];

  details.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = 0.8 + col * 6.2;
    const yPos = 3.3 + row * 2.0;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 5.8, h: 1.8,
      fill: { color: C.cardBg },
      rectRadius: 0.08,
      line: { color: "E2E8F0", width: 1 },
    });
    // Title
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.2, y: yPos + 0.15, w: 1.6, h: 0.32,
      fill: { color: C.blue },
      rectRadius: 0.05,
    });
    slide.addText(d.title, {
      x: xPos + 0.2, y: yPos + 0.15, w: 1.6, h: 0.32,
      fontSize: 10, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });

    d.items.forEach((item, j) => {
      slide.addText(item, {
        x: xPos + 0.3, y: yPos + 0.6 + j * 0.35, w: 5.2, h: 0.32,
        fontSize: 10, fontFace: "Arial", color: C.darkText,
        bullet: true,
      });
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 6 — Clova X
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "Clova X 챗봇", "AI 챗봇 UX를 설계하다  |  PM  |  2023.11 ~ 2023.12");
  addPageNumber(slide, 6);

  // Key insight box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.55, w: 11.5, h: 0.8,
    fill: { color: C.softBlue },
    rectRadius: 0.08,
  });
  slide.addText("AI가 잘 대답하게 만드는 건 기술이 아니라 설계의 문제라는 걸 배웠습니다", {
    x: 1.1, y: 1.6, w: 10.5, h: 0.65,
    fontSize: 14, fontFace: "Arial", color: C.blue, bold: true,
    valign: "middle",
  });

  // Process flow (horizontal)
  const process = [
    { step: "01", title: "프롬프트 데이터셋 구축", desc: "PM으로서 챗봇 응답 품질을\n결정하는 데이터셋 직접 설계" },
    { step: "02", title: "Few-shot 답변 구조 설계", desc: "예시 기반 학습 구조로\n답변 일관성 확보" },
    { step: "03", title: "수정 사이클 3회에서 1회로", desc: "체계적 프롬프트 설계로\nQA 반복 횟수 대폭 감소" },
    { step: "04", title: "개발팀 협업", desc: "기획을 API 스펙으로 변환하여\n개발팀과 직접 소통" },
  ];

  process.forEach((p, i) => {
    const xPos = 0.8 + i * 3.1;

    // Step number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 1.05, y: 2.7, w: 0.55, h: 0.55,
      fill: { color: C.blue },
    });
    slide.addText(p.step, {
      x: xPos + 1.05, y: 2.7, w: 0.55, h: 0.55,
      fontSize: 12, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });

    // Connecting line
    if (i < 3) {
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos + 1.6, y: 2.95, w: 1.9, h: 0.04,
        fill: { color: "E2E8F0" },
      });
    }

    // Card below
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 3.5, w: 2.7, h: 2.2,
      fill: { color: C.cardBg },
      rectRadius: 0.08,
      line: { color: "E2E8F0", width: 1 },
    });
    slide.addText(p.title, {
      x: xPos + 0.2, y: 3.65, w: 2.3, h: 0.55,
      fontSize: 12, fontFace: "Arial Black", color: C.darkText, bold: true,
      wrap: true,
    });
    slide.addText(p.desc, {
      x: xPos + 0.2, y: 4.3, w: 2.3, h: 1.1,
      fontSize: 10, fontFace: "Arial", color: C.medGray,
      wrap: true, lineSpacingMultiple: 1.3,
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 7 — JD 매칭
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "채널톡 JD 매칭", "이런 일을 잘 할 수 있습니다");
  addPageNumber(slide, 7);

  const matches = [
    { jd: "고객 사이트에서 AI 자동화 포인트 발견", exp: "스마일샤크 70+ 고객사 현장 대응,\nQR 이미지 비효율 발견 사례" },
    { jd: "n8n/Dify 등으로 자동화 플로우 구축", exp: "Claude Code로 서비스 E2E 빌드,\nAPI 설계 및 자동화 구현 경험" },
    { jd: "FAQ/데이터를 AI가 이해하는 지식으로 전환", exp: "Clova X 프롬프트 데이터셋 구축,\nFew-shot 학습 구조 설계" },
    { jd: "상담 시나리오 설계", exp: "챗봇 UX 흐름 설계, 응답 품질\n개선 프로세스 경험" },
    { jd: "데이터 분석으로 성과 검증", exp: "AWS Cost Explorer 비용 분석,\nADsP 자격증 보유" },
    { jd: "영어 커뮤니케이션", exp: "OPIc IH, 오클라호마 주립대\n교환학생 1년" },
  ];

  // Column headers
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.55, w: 5.5, h: 0.5,
    fill: { color: C.navy },
    rectRadius: 0.05,
  });
  slide.addText("공고 요구사항", {
    x: 0.8, y: 1.55, w: 5.5, h: 0.5,
    fontSize: 12, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
    bold: true,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.0, y: 1.55, w: 5.5, h: 0.5,
    fill: { color: C.blue },
    rectRadius: 0.05,
  });
  slide.addText("제 경험", {
    x: 7.0, y: 1.55, w: 5.5, h: 0.5,
    fontSize: 12, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
    bold: true,
  });

  matches.forEach((m, i) => {
    const yPos = 2.2 + i * 0.85;
    const bgColor = i % 2 === 0 ? C.cardBg : C.white;

    // Left cell
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: yPos, w: 5.5, h: 0.75,
      fill: { color: bgColor },
      line: { color: "E2E8F0", width: 0.5 },
    });
    slide.addText(m.jd, {
      x: 1.0, y: yPos, w: 5.1, h: 0.75,
      fontSize: 10, fontFace: "Arial", color: C.darkText,
      valign: "middle", wrap: true,
    });

    // Arrow in middle
    slide.addText("<>", {
      x: 6.3, y: yPos, w: 0.7, h: 0.75,
      fontSize: 10, fontFace: "Arial Black", color: C.blue, align: "center", valign: "middle",
    });

    // Right cell
    slide.addShape(pptx.ShapeType.rect, {
      x: 7.0, y: yPos, w: 5.5, h: 0.75,
      fill: { color: bgColor },
      line: { color: "E2E8F0", width: 0.5 },
    });
    slide.addText(m.exp, {
      x: 7.2, y: yPos, w: 5.1, h: 0.75,
      fontSize: 10, fontFace: "Arial", color: C.darkText,
      valign: "middle", wrap: true,
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 8 — 자격증 & 교육
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "자격증 & 교육", "Certifications & Education");
  addPageNumber(slide, 8);

  // Certifications - 2x3 grid
  const certs = [
    { name: "AWS Solutions Architect\nAssociate (SAA)", date: "2024.07", icon: "SAA" },
    { name: "AWS Hackathon\n대상 (1st Place)", date: "2024.02", icon: "1st" },
    { name: "ADsP\n데이터분석 준전문가", date: "2023.11", icon: "ADsP" },
    { name: "OPIc IH\n영어 회화", date: "2024.04", icon: "IH" },
    { name: "AWS CloudSchool 4기\n클라우드 엔지니어 양성", date: "2024.01 ~ 07", icon: "AWS" },
    { name: "가천대학교 경제학과\nGPA 3.6/4.5", date: "졸업", icon: "GPA" },
  ];

  certs.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const xPos = 0.8 + col * 4.1;
    const yPos = 1.7 + row * 2.7;

    // Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 3.7, h: 2.3,
      fill: { color: C.cardBg },
      rectRadius: 0.08,
      line: { color: "E2E8F0", width: 1 },
    });

    // Icon circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 1.45, y: yPos + 0.25, w: 0.8, h: 0.8,
      fill: { color: C.blue },
    });
    slide.addText(c.icon, {
      x: xPos + 1.45, y: yPos + 0.25, w: 0.8, h: 0.8,
      fontSize: 11, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });

    // Name
    slide.addText(c.name, {
      x: xPos + 0.2, y: yPos + 1.15, w: 3.3, h: 0.7,
      fontSize: 11, fontFace: "Arial", color: C.darkText,
      align: "center", wrap: true, lineSpacingMultiple: 1.2, bold: true,
    });

    // Date
    slide.addText(c.date, {
      x: xPos + 0.2, y: yPos + 1.85, w: 3.3, h: 0.3,
      fontSize: 9, fontFace: "Arial", color: C.medGray,
      align: "center",
    });
  });

  // AWS trainings note
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 7.0, w: 11.5, h: 0.35,
    fill: { color: C.softBlue },
    rectRadius: 0.05,
  });
  slide.addText("+ AWS 공식 교육 6개 이수 (Cloud Practitioner Essentials, Architecting 등)", {
    x: 1.0, y: 7.0, w: 11, h: 0.35,
    fontSize: 10, fontFace: "Arial", color: C.blue, valign: "middle",
  });
})();

// ══════════════════════════════════════════
// SLIDE 9 — 일하는 방식
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addWhiteBg(slide);
  addSectionTitle(slide, "저는 이렇게 일합니다", "Work Principles");
  addPageNumber(slide, 9);

  const principles = [
    {
      num: "01",
      title: "일단 만들어본다",
      body: "기획서만 쓰지 않습니다. Dear,ANT를 Claude Code로 직접 만든 것처럼, 프로토타입을 빠르게 만들어서 보여줍니다. 말보다 결과물이 설득력이 있습니다.",
    },
    {
      num: "02",
      title: "고객한테 직접 묻는다",
      body: "70개 넘는 고객사를 대응하면서 체득했습니다. 고객이 말하는 문제와 실제 문제는 다를 때가 많습니다. 현장에서 직접 확인하는 게 가장 빠른 길입니다.",
    },
    {
      num: "03",
      title: "안 되면 다른 방법을 찾는다",
      body: "QR 이미지 문제를 Lambda로 풀고, 개발 경험이 부족한 건 Claude Code로 해결했습니다. 제약은 항상 있지만, 방법도 항상 있다고 믿습니다.",
    },
  ];

  principles.forEach((p, i) => {
    const yPos = 1.7 + i * 1.85;

    // Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: yPos, w: 11.5, h: 1.6,
      fill: { color: C.cardBg },
      rectRadius: 0.1,
      line: { color: "E2E8F0", width: 1 },
    });

    // Number
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 1.2, y: yPos + 0.45, w: 0.7, h: 0.7,
      fill: { color: C.blue },
    });
    slide.addText(p.num, {
      x: 1.2, y: yPos + 0.45, w: 0.7, h: 0.7,
      fontSize: 16, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle",
      bold: true,
    });

    // Title
    slide.addText(p.title, {
      x: 2.3, y: yPos + 0.15, w: 9.5, h: 0.5,
      fontSize: 16, fontFace: "Arial Black", color: C.darkText, bold: true,
    });

    // Body
    slide.addText(p.body, {
      x: 2.3, y: yPos + 0.65, w: 9.5, h: 0.8,
      fontSize: 11, fontFace: "Arial", color: C.medGray,
      wrap: true, lineSpacingMultiple: 1.35,
    });
  });
})();

// ══════════════════════════════════════════
// SLIDE 10 — Thank You
// ══════════════════════════════════════════
(() => {
  const slide = pptx.addSlide();
  addNavyBg(slide);

  // Decorative circles
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: 5, w: 4, h: 4,
    fill: { color: C.blue, transparency: 82 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10, y: -1, w: 3.5, h: 3.5,
    fill: { color: C.accent, transparency: 85 },
  });

  slide.addText("감사합니다", {
    x: 0, y: 2.0, w: 13.33, h: 1.2,
    fontSize: 44, fontFace: "Arial Black", color: C.white, align: "center",
    bold: true,
  });

  // Divider
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.5, y: 3.4, w: 2.33, h: 0.04,
    fill: { color: C.blue },
  });

  slide.addText("고객의 문제를 AI로 풀고 싶습니다", {
    x: 0, y: 3.7, w: 13.33, h: 0.7,
    fontSize: 18, fontFace: "Arial", color: C.softBlue, align: "center",
  });

  // Contact block
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 4.0, y: 4.8, w: 5.33, h: 1.5,
    fill: { color: C.blue, transparency: 80 },
    rectRadius: 0.1,
    line: { color: C.blue, width: 1 },
  });

  slide.addText("장정빈", {
    x: 4.0, y: 4.85, w: 5.33, h: 0.5,
    fontSize: 14, fontFace: "Arial Black", color: C.white, align: "center",
    bold: true,
  });
  slide.addText("apple22by33@naver.com", {
    x: 4.0, y: 5.35, w: 5.33, h: 0.4,
    fontSize: 11, fontFace: "Arial", color: C.medGray, align: "center",
  });
  slide.addText("+82-10-8550-8464", {
    x: 4.0, y: 5.7, w: 5.33, h: 0.4,
    fontSize: 11, fontFace: "Arial", color: C.medGray, align: "center",
  });
})();

// ── Export ──
const outPath = path.join(__dirname, "..", "public", "portfolio", "채널코퍼레이션_AX_장정빈.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("PPTX generated:", outPath);
}).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
