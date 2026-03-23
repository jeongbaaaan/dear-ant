const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();

// ── Theme: 투박하고 솔직한 느낌, 따뜻하지만 깔끔 ──
const C = {
  black: "111111",
  darkBg: "1A1A2E",
  warmGray: "F5F3F0",
  cream: "FAF8F5",
  charcoal: "2D2D2D",
  midGray: "6B7280",
  accent: "E85D3A",    // 따뜻한 오렌지-레드
  accentLight: "FFF0EB",
  blue: "3B82F6",
  green: "10B981",
  white: "FFFFFF",
  lightLine: "E5E5E5",
  softBg: "F9FAFB",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.subject = "언더덕 지원서 - 장정빈";

// ── Helpers ──
function darkSlide(slide) {
  slide.background = { fill: C.darkBg };
}
function lightSlide(slide) {
  slide.background = { fill: C.cream };
}

// ════════════════════════════════════════════════════
// SLIDE 1: 표지 - 있어보이려 하지 않는 표지
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  darkSlide(s);

  // 좌측 세로선 액센트
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 0.06, h: 3.5,
    fill: { color: C.accent },
  });

  s.addText("장정빈", {
    x: 1.2, y: 1.5, w: 8, h: 1,
    fontSize: 44, fontFace: "Arial Black",
    color: C.white, bold: true,
  });

  s.addText("언더덕에 합류하고 싶습니다.", {
    x: 1.2, y: 2.5, w: 10, h: 0.8,
    fontSize: 26, fontFace: "Arial",
    color: C.accent,
  });

  s.addText("있어보이는 것에서 벗어나, 진짜 문제를 푸는 팀에서 일하고 싶습니다.", {
    x: 1.2, y: 3.5, w: 10, h: 0.6,
    fontSize: 15, fontFace: "Arial",
    color: C.midGray,
  });

  // 연락처
  s.addText("apple22by33@naver.com  |  010-8550-8464", {
    x: 1.2, y: 5.8, w: 10, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: C.midGray,
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 2: 왜 언더덕인가
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("왜 언더덕인가", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });

  // 구분선
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  const reasons = [
    {
      title: "있어보이는 조직은 지겹습니다",
      body: "대기업, 대형 MSP에서 일하면서 느꼈습니다. 타이틀과 프로세스가 일을 대신하는 곳에서는 성장이 멈춥니다. 문제를 직접 발견하고, 직접 풀고, 직접 검증하는 곳이 필요합니다.",
    },
    {
      title: "작은 팀이어야 합니다",
      body: "저는 70개 넘는 고객사를 관리하면서 '경계 없이 일하는 것'이 제 성향이라는 걸 확인했습니다. 기획도 하고, 아키텍처도 제안하고, 비용도 분석합니다. 큰 조직에서는 이게 '월권'이지만, 작은 팀에서는 이게 '당연한 것'입니다.",
    },
    {
      title: "Toki에 대한 생각이 있습니다",
      body: "채용 페이지를 읽으면서 Toki의 가능성과 함께 풀어볼 문제가 머릿속에 떠올랐습니다. 이건 뒤에서 자세히 이야기하겠습니다.",
    },
  ];

  reasons.forEach((r, i) => {
    const y = 1.5 + i * 1.8;
    // 번호 원
    s.addShape(pptx.shapes.OVAL, {
      x: 0.8, y: y, w: 0.45, h: 0.45,
      fill: { color: C.accent },
    });
    s.addText(`${i + 1}`, {
      x: 0.8, y: y, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: "Arial Black",
      color: C.white, align: "center", valign: "middle",
    });
    s.addText(r.title, {
      x: 1.5, y: y - 0.05, w: 10, h: 0.45,
      fontSize: 17, fontFace: "Arial Black",
      color: C.charcoal, valign: "middle",
    });
    s.addText(r.body, {
      x: 1.5, y: y + 0.45, w: 10.5, h: 1.0,
      fontSize: 12.5, fontFace: "Arial",
      color: C.midGray, lineSpacingMultiple: 1.4,
    });
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 3: 제 커리어 — 전체 흐름
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("커리어 전체 흐름", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  // 타임라인 - 세로선
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 1.9, y: 1.5, w: 0.03, h: 5.2,
    fill: { color: C.lightLine },
  });

  const timeline = [
    { period: "2023.11", title: "네이버클라우드 — Clova X PM", desc: "AI 챗봇 프롬프트 설계, UX 흐름 구축. AI가 잘 대답하게 만드는 건 기술이 아니라 설계의 문제라는 걸 배움.", color: C.blue },
    { period: "2024.01", title: "AWS CloudSchool 4기", desc: "CQRS 설계, 비용 최적화, 해커톤 대상. 클라우드 인프라를 직접 설계하고 만들어봄.", color: C.green },
    { period: "2024.11", title: "스마일샤크 — Account Manager", desc: "70+ 고객사 클라우드 관리. 고객 현장에서 문제를 직접 발견하고 솔루션을 제안. QR 이미지 비용 문제 발견 후 Lambda 리사이징 아키텍처 제안.", color: C.accent },
    { period: "2025.03", title: "Dear,ANT — 1인 사이드 프로젝트", desc: "Claude Code로 AI 투자 리포트 서비스를 혼자 기획~배포. Next.js, TypeScript, Supabase. 기획서 대신 프로토타입을 만듦.", color: C.accent },
  ];

  timeline.forEach((t, i) => {
    const y = 1.6 + i * 1.3;
    // 점
    s.addShape(pptx.shapes.OVAL, {
      x: 1.75, y: y + 0.12, w: 0.32, h: 0.32,
      fill: { color: t.color },
    });
    // 기간
    s.addText(t.period, {
      x: 0.3, y: y + 0.05, w: 1.3, h: 0.35,
      fontSize: 11, fontFace: "Arial Black",
      color: t.color, align: "right",
    });
    // 제목
    s.addText(t.title, {
      x: 2.3, y: y - 0.05, w: 9, h: 0.4,
      fontSize: 15, fontFace: "Arial Black",
      color: C.charcoal,
    });
    // 설명
    s.addText(t.desc, {
      x: 2.3, y: y + 0.35, w: 9.5, h: 0.8,
      fontSize: 11.5, fontFace: "Arial",
      color: C.midGray, lineSpacingMultiple: 1.3,
    });
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 4: 스마일샤크 — 구체적 이야기
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("고객 현장에서 문제를 찾은 이야기", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  s.addText("스마일샤크 Account Manager  |  2024.11 ~ 현재", {
    x: 0.8, y: 1.3, w: 10, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: C.midGray,
  });

  // 스토리 박스
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: 11.7, h: 2.8,
    fill: { color: C.white },
    rectRadius: 0.15,
    line: { color: C.lightLine, width: 1 },
  });

  // 4단계 플로우
  const steps = [
    { label: "발견", text: "고객사가 QR 이미지를\nS3에 원본 그대로 저장.\n대역폭 낭비, 비용 상승.", color: C.accent },
    { label: "분석", text: "Cost Explorer로 확인.\n이미지 스토리지가\n전체 비용의 큰 비중.", color: C.blue },
    { label: "제안", text: "S3 업로드 시\nLambda 자동 리사이징\n+ CloudFront 배포.", color: C.green },
    { label: "결과", text: "스토리지 60% 절감 예상.\n로딩 속도 개선.\n고객사 채택 검토 중.", color: C.accent },
  ];

  steps.forEach((st, i) => {
    const x = 1.2 + i * 2.8;
    // 레이블 박스
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.1, w: 1.2, h: 0.4,
      fill: { color: st.color },
      rectRadius: 0.1,
    });
    s.addText(st.label, {
      x: x, y: 2.1, w: 1.2, h: 0.4,
      fontSize: 13, fontFace: "Arial Black",
      color: C.white, align: "center", valign: "middle",
    });
    // 내용
    s.addText(st.text, {
      x: x - 0.2, y: 2.7, w: 2.4, h: 1.5,
      fontSize: 11, fontFace: "Arial",
      color: C.charcoal, lineSpacingMultiple: 1.4,
    });
    // 화살표 (마지막 제외)
    if (i < 3) {
      s.addText(">", {
        x: x + 2.0, y: 2.1, w: 0.5, h: 0.4,
        fontSize: 20, fontFace: "Arial Black",
        color: C.lightLine, align: "center", valign: "middle",
      });
    }
  });

  // 아래 추가 기여
  s.addText("그 외: AWS Cost Explorer 기반 RI 전환 권고 / 신규 고객 플랫폼 PoC 기획 / 70+ 계정 인프라 운영", {
    x: 0.8, y: 5.0, w: 11.5, h: 0.5,
    fontSize: 11.5, fontFace: "Arial",
    color: C.midGray,
  });

  // 핵심 메시지
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.6, w: 11.7, h: 0.8,
    fill: { color: C.accentLight },
    rectRadius: 0.1,
  });
  s.addText("이 경험이 언더덕에서 의미 있는 이유: 고객이 말하지 않는 문제를 현장에서 직접 찾아내는 습관이 있습니다.", {
    x: 1.2, y: 5.6, w: 11, h: 0.8,
    fontSize: 13, fontFace: "Arial",
    color: C.accent, valign: "middle",
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 5: Dear,ANT + AI 활용 — 킬링 포인트
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("AI로 직접 만들었습니다", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  // 큰 메시지
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.4, w: 11.7, h: 1.0,
    fill: { color: C.darkBg },
    rectRadius: 0.15,
  });
  s.addText("기획서를 쓰는 대신, Claude Code와 대화하면서 서비스를 만들었습니다.", {
    x: 1.2, y: 1.4, w: 11, h: 1.0,
    fontSize: 16, fontFace: "Arial",
    color: C.white, valign: "middle",
  });

  // Dear,ANT 설명
  s.addText("Dear,ANT — AI 투자 판단 리포트 서비스", {
    x: 0.8, y: 2.7, w: 10, h: 0.45,
    fontSize: 16, fontFace: "Arial Black",
    color: C.charcoal,
  });

  // 2x2 카드
  const features = [
    { title: "투자 성향 설문", desc: "7개 질문으로 투자자의\n감정 패턴 분석" },
    { title: "AI 리포트 생성", desc: "바이오리듬 + 감정가중치\n기반 A~F 등급 산출" },
    { title: "트레이딩 저널", desc: "매매 기록과 감정 변화를\n함께 추적" },
    { title: "금융 계산기", desc: "복리, 적금, 대출 시뮬레이션\n도구" },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 6;
    const y = 3.3 + row * 1.4;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.6, h: 1.15,
      fill: { color: C.white },
      rectRadius: 0.1,
      line: { color: C.lightLine, width: 1 },
    });
    s.addText(f.title, {
      x: x + 0.3, y: y + 0.1, w: 5, h: 0.4,
      fontSize: 13, fontFace: "Arial Black",
      color: C.charcoal,
    });
    s.addText(f.desc, {
      x: x + 0.3, y: y + 0.5, w: 5, h: 0.55,
      fontSize: 11, fontFace: "Arial",
      color: C.midGray, lineSpacingMultiple: 1.3,
    });
  });

  // 기술 스택 라인
  s.addText("Next.js 16  /  TypeScript  /  React 19  /  Tailwind CSS 4  /  Supabase  /  Custom SVG", {
    x: 0.8, y: 6.2, w: 11, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: C.midGray,
  });

  // 핵심
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.6, w: 11.7, h: 0.6,
    fill: { color: C.accentLight },
    rectRadius: 0.1,
  });
  s.addText("1인 End-to-End: 기획 > UI 디자인 > 프론트엔드 개발 > API 설계 > DB 스키마 > 배포", {
    x: 1.2, y: 6.6, w: 11, h: 0.6,
    fontSize: 12.5, fontFace: "Arial",
    color: C.accent, valign: "middle",
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 6: AI 활용 속도감 — 구체적 사례
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("AI를 도구로 쓰는 방식", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  s.addText("바이브 코딩이 아닙니다. 문제를 정의하고, AI와 함께 실행하는 방식입니다.", {
    x: 0.8, y: 1.3, w: 11, h: 0.5,
    fontSize: 13, fontFace: "Arial",
    color: C.midGray,
  });

  // 비교 테이블 스타일
  const rows = [
    { traditional: "기획서 작성 (2-3일)", ai: "Claude Code와 대화하며 바로 프로토타입 (2-3시간)", phase: "기획" },
    { traditional: "디자이너에게 전달, 피드백 루프 (1-2주)", ai: "직접 UI 구현, 실시간 수정 (당일)", phase: "디자인" },
    { traditional: "개발팀 핸드오프, 스프린트 (2-4주)", ai: "직접 코드 생성 + 리뷰 + 배포 (3-5일)", phase: "개발" },
    { traditional: "QA팀 테스트 (1주)", ai: "만들면서 바로 테스트, 즉시 수정 (실시간)", phase: "검증" },
  ];

  // 헤더
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 2.0, w: 11.7, h: 0.55,
    fill: { color: C.charcoal },
    rectRadius: 0.08,
  });
  s.addText("단계", {
    x: 0.8, y: 2.0, w: 1.8, h: 0.55,
    fontSize: 12, fontFace: "Arial Black",
    color: C.white, align: "center", valign: "middle",
  });
  s.addText("일반적인 프로세스", {
    x: 2.6, y: 2.0, w: 4.8, h: 0.55,
    fontSize: 12, fontFace: "Arial Black",
    color: C.white, align: "center", valign: "middle",
  });
  s.addText("저의 AI 활용 방식", {
    x: 7.4, y: 2.0, w: 5.1, h: 0.55,
    fontSize: 12, fontFace: "Arial Black",
    color: C.white, align: "center", valign: "middle",
  });

  rows.forEach((r, i) => {
    const y = 2.6 + i * 0.9;
    const bg = i % 2 === 0 ? C.softBg : C.white;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 11.7, h: 0.8,
      fill: { color: bg },
      rectRadius: 0.05,
    });
    s.addText(r.phase, {
      x: 0.8, y: y, w: 1.8, h: 0.8,
      fontSize: 12, fontFace: "Arial Black",
      color: C.accent, align: "center", valign: "middle",
    });
    s.addText(r.traditional, {
      x: 2.6, y: y, w: 4.8, h: 0.8,
      fontSize: 11.5, fontFace: "Arial",
      color: C.midGray, align: "center", valign: "middle",
    });
    s.addText(r.ai, {
      x: 7.4, y: y, w: 5.1, h: 0.8,
      fontSize: 11.5, fontFace: "Arial",
      color: C.charcoal, align: "center", valign: "middle",
    });
  });

  // 결론
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.3, w: 11.7, h: 0.8,
    fill: { color: C.accentLight },
    rectRadius: 0.1,
  });
  s.addText("Dear,ANT 전체 서비스를 기획부터 배포까지 약 2주 만에 완성했습니다. AI는 속도의 도구이고, 방향은 제가 잡습니다.", {
    x: 1.2, y: 6.3, w: 11, h: 0.8,
    fontSize: 13, fontFace: "Arial",
    color: C.accent, valign: "middle",
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 7: Toki에 대한 제 생각 — 프로덕트 인사이트
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("Toki에 대한 제 생각", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  s.addText("채용 페이지를 읽고 사용해보면서 든 생각을 솔직하게 적었습니다.", {
    x: 0.8, y: 1.3, w: 11, h: 0.4,
    fontSize: 12.5, fontFace: "Arial",
    color: C.midGray,
  });

  // 인사이트 1
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: 5.6, h: 3.5,
    fill: { color: C.white },
    rectRadius: 0.15,
    line: { color: C.lightLine, width: 1 },
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: 5.6, h: 0.5,
    fill: { color: C.accent },
    rectRadius: 0.15,
  });
  // 아래 모서리 덮기
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 2.2, w: 5.6, h: 0.2,
    fill: { color: C.accent },
  });
  s.addText("'여행'이라는 단어의 한계", {
    x: 1.1, y: 1.9, w: 5, h: 0.5,
    fontSize: 14, fontFace: "Arial Black",
    color: C.white, valign: "middle",
  });
  s.addText([
    { text: "지금 Toki의 포지셔닝은 '여행 준비를 쉽게'인데,\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "'여행'이라는 워딩 자체가 접근성을 좁힐 수 있습니다.\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "예를 들어 '주말에 맛집 가기'도 넓게 보면 여행인데,\n유저는 이걸 여행이라고 인식하지 않습니다.\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "SNS 장소 저장 기능은 여행뿐 아니라\n일상의 '가보고 싶은 곳'에도 적용 가능합니다.\n접근 키워드를 넓히면 TAM이 달라질 수 있습니다.", options: { fontSize: 11.5, color: C.accent, bold: true } },
  ], {
    x: 1.1, y: 2.6, w: 5, h: 2.5,
    fontFace: "Arial",
    lineSpacingMultiple: 1.3,
    valign: "top",
  });

  // 인사이트 2
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.9, w: 5.6, h: 3.5,
    fill: { color: C.white },
    rectRadius: 0.15,
    line: { color: C.lightLine, width: 1 },
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 1.9, w: 5.6, h: 0.5,
    fill: { color: C.blue },
    rectRadius: 0.15,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 6.9, y: 2.2, w: 5.6, h: 0.2,
    fill: { color: C.blue },
  });
  s.addText("준비 자체가 여행의 일부", {
    x: 7.2, y: 1.9, w: 5, h: 0.5,
    fontSize: 14, fontFace: "Arial Black",
    color: C.white, valign: "middle",
  });
  s.addText([
    { text: "여행을 좋아하는 사람들 중에서도\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "'준비 과정 자체를 즐기는 사람들'이 있습니다.\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "이 그룹은 Toki의 장소 저장, 일정 구성 기능을\n단순 효율 도구가 아니라 '재미'로 소비합니다.\n", options: { fontSize: 11.5, color: C.charcoal } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "이 사람들이 리텐션의 핵심 드라이버가\n될 수 있고, 바이럴의 시작점이 될 수 있습니다.\n'준비가 곧 여행'이라는 메시지도 가능합니다.", options: { fontSize: 11.5, color: C.blue, bold: true } },
  ], {
    x: 7.2, y: 2.6, w: 5, h: 2.5,
    fontFace: "Arial",
    lineSpacingMultiple: 1.3,
    valign: "top",
  });

  // 하단 메시지
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.8, w: 11.7, h: 1.0,
    fill: { color: C.accentLight },
    rectRadius: 0.1,
  });
  s.addText("이런 생각들이 맞는지 틀리는지는 중요하지 않습니다. 중요한 건 이런 사고를 멈추지 않는 것이고, 이걸 빠르게 검증할 수 있는 환경에서 일하고 싶습니다.", {
    x: 1.2, y: 5.8, w: 11, h: 1.0,
    fontSize: 13, fontFace: "Arial",
    color: C.charcoal, valign: "middle", lineSpacingMultiple: 1.3,
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 8: 무경계 — 내가 커버할 수 있는 영역
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("제가 커버할 수 있는 영역", {
    x: 0.8, y: 0.4, w: 11, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  s.addText("언더덕은 무경계로 일한다고 했습니다. 저도 그렇게 일해왔습니다.", {
    x: 0.8, y: 1.3, w: 11, h: 0.4,
    fontSize: 13, fontFace: "Arial",
    color: C.midGray,
  });

  const areas = [
    { area: "프로덕트 기획", detail: "고객 인터뷰, 문제 정의, 기능 설계, UX 흐름", evidence: "Clova X PM + Dear,ANT 기획", level: "직접 수행", color: C.accent },
    { area: "프론트엔드 개발", detail: "Next.js, React, TypeScript, Tailwind CSS", evidence: "Dear,ANT 전체 프론트엔드 구현", level: "직접 수행", color: C.accent },
    { area: "백엔드/API 설계", detail: "REST API, DB 스키마, Supabase", evidence: "Dear,ANT API 5개 엔드포인트", level: "직접 수행", color: C.accent },
    { area: "클라우드 인프라", detail: "AWS (EC2, S3, Lambda, RDS, CloudFront)", evidence: "SAA 자격증 + 스마일샤크 실무", level: "직접 수행", color: C.blue },
    { area: "데이터 분석", detail: "Cost Explorer, 비용 분석, KPI 추적", evidence: "ADsP + 고객 비용 최적화", level: "직접 수행", color: C.blue },
    { area: "고객 대응", detail: "기술 상담, PoC 기획, 견적, 온보딩", evidence: "스마일샤크 70+ 고객 관리", level: "직접 수행", color: C.green },
    { area: "그로스/마케팅", detail: "퍼포먼스 광고 분석, CPI 이해, 유저 획득", evidence: "개념 이해 + 빠르게 학습 가능", level: "학습 중", color: C.midGray },
  ];

  // 헤더
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: 11.7, h: 0.5,
    fill: { color: C.charcoal },
    rectRadius: 0.06,
  });
  ["영역", "상세", "근거", "수준"].forEach((h, i) => {
    const xs = [0.8, 3.2, 7.2, 10.5];
    const ws = [2.4, 4.0, 3.3, 2.0];
    s.addText(h, {
      x: xs[i], y: 1.9, w: ws[i], h: 0.5,
      fontSize: 11, fontFace: "Arial Black",
      color: C.white, align: "center", valign: "middle",
    });
  });

  areas.forEach((a, i) => {
    const y = 2.45 + i * 0.65;
    const bg = i % 2 === 0 ? C.softBg : C.white;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: y, w: 11.7, h: 0.6,
      fill: { color: bg },
    });
    // 좌측 색상 바
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: y, w: 0.06, h: 0.6,
      fill: { color: a.color },
    });
    s.addText(a.area, {
      x: 1.0, y: y, w: 2.2, h: 0.6,
      fontSize: 11, fontFace: "Arial Black",
      color: C.charcoal, valign: "middle",
    });
    s.addText(a.detail, {
      x: 3.2, y: y, w: 4.0, h: 0.6,
      fontSize: 10.5, fontFace: "Arial",
      color: C.midGray, valign: "middle",
    });
    s.addText(a.evidence, {
      x: 7.2, y: y, w: 3.3, h: 0.6,
      fontSize: 10.5, fontFace: "Arial",
      color: C.midGray, valign: "middle",
    });
    s.addText(a.level, {
      x: 10.5, y: y, w: 2.0, h: 0.6,
      fontSize: 10.5, fontFace: "Arial Black",
      color: a.color, align: "center", valign: "middle",
    });
  });

  s.addText("모르는 건 빠르게 배웁니다. Dear,ANT를 만들 때도 Next.js를 처음 썼습니다.", {
    x: 0.8, y: 7.0, w: 11, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: C.midGray,
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 9: 간절함 — 왜 지금인가
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  darkSlide(s);

  s.addText("왜 간절한가", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.white,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  const paragraphs = [
    "경제학을 전공하고 IT로 넘어왔습니다.\n늦게 시작했다는 건 알고 있습니다.",

    "그래서 남들보다 더 빠르게 움직여야 했습니다.\n네이버클라우드에서 AI를 배우고, AWS에서 클라우드를 배우고,\n스마일샤크에서 고객을 만나고, 퇴근 후엔 사이드 프로젝트를 만들었습니다.",

    "솔직히 말하면, 지금 환경을 바꾸고 싶습니다.\n큰 조직에서 정해진 역할만 하는 게 답답합니다.\n제가 할 수 있는 게 더 많은데, 그걸 증명할 기회가 없습니다.",

    "언더덕 채용 페이지를 읽으면서 '여기다' 싶었습니다.\n무경계, 하드워킹, 작은 팀, 문제 중심.\n제가 찾던 환경이 정확히 이겁니다.",

    "있어보이는 이력서를 만들고 싶지 않습니다.\n진짜 문제를 풀고, 진짜 성장하고 싶습니다.\n그래서 언더덕이 필요합니다.",
  ];

  paragraphs.forEach((p, i) => {
    const y = 1.5 + i * 1.1;
    s.addText(p, {
      x: 1.2, y: y, w: 10.5, h: 1.0,
      fontSize: 13, fontFace: "Arial",
      color: i === paragraphs.length - 1 ? C.accent : "D1D5DB",
      lineSpacingMultiple: 1.5,
    });
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 10: 자격증/교육 간략
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  lightSlide(s);

  s.addText("자격증 & 교육", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial Black",
    color: C.charcoal,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.1, w: 2, h: 0.04,
    fill: { color: C.accent },
  });

  const certs = [
    { name: "AWS Solutions Architect Associate", date: "2024.07", icon: "AWS" },
    { name: "AWS Hackathon 대상 (1위)", date: "2024.02", icon: "1st" },
    { name: "ADsP (데이터분석 준전문가)", date: "2023.11", icon: "Data" },
    { name: "OPIc IH (영어 비즈니스)", date: "2024.04", icon: "EN" },
  ];

  certs.forEach((c, i) => {
    const x = 0.8 + (i % 2) * 6;
    const y = 1.5 + Math.floor(i / 2) * 1.6;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.6, h: 1.3,
      fill: { color: C.white },
      rectRadius: 0.1,
      line: { color: C.lightLine, width: 1 },
    });
    // 아이콘 원
    s.addShape(pptx.shapes.OVAL, {
      x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7,
      fill: { color: C.accent },
    });
    s.addText(c.icon, {
      x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7,
      fontSize: 10, fontFace: "Arial Black",
      color: C.white, align: "center", valign: "middle",
    });
    s.addText(c.name, {
      x: x + 1.3, y: y + 0.2, w: 4, h: 0.5,
      fontSize: 13, fontFace: "Arial Black",
      color: C.charcoal, valign: "middle",
    });
    s.addText(c.date, {
      x: x + 1.3, y: y + 0.7, w: 4, h: 0.4,
      fontSize: 11, fontFace: "Arial",
      color: C.midGray,
    });
  });

  // AWS 교육
  s.addText("AWS 공식 교육 이수 (6개)", {
    x: 0.8, y: 4.9, w: 10, h: 0.45,
    fontSize: 15, fontFace: "Arial Black",
    color: C.charcoal,
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
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 6;
    const y = 5.5 + row * 0.55;
    s.addShape(pptx.shapes.OVAL, {
      x: x, y: y + 0.1, w: 0.2, h: 0.2,
      fill: { color: C.accent },
    });
    s.addText(t, {
      x: x + 0.4, y: y, w: 5.2, h: 0.45,
      fontSize: 11, fontFace: "Arial",
      color: C.midGray, valign: "middle",
    });
  });
})();

// ════════════════════════════════════════════════════
// SLIDE 11: 마무리
// ════════════════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  darkSlide(s);

  // 장식 원
  s.addShape(pptx.shapes.OVAL, {
    x: 10, y: -1, w: 5, h: 5,
    fill: { color: "1F1F3A" },
  });

  s.addText("감사합니다.", {
    x: 0.8, y: 2.0, w: 10, h: 1,
    fontSize: 40, fontFace: "Arial Black",
    color: C.white,
  });

  s.addText("진짜 문제를 풀고 싶은 사람, 장정빈입니다.", {
    x: 0.8, y: 3.2, w: 10, h: 0.6,
    fontSize: 18, fontFace: "Arial",
    color: C.accent,
  });

  // 연락처 카드
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.3, w: 5, h: 2.0,
    fill: { color: "1F1F3A" },
    rectRadius: 0.15,
  });
  const contactLines = [
    "apple22by33@naver.com",
    "010-8550-8464",
    "",
    "가천대학교 경제학과 (3.6/4.5)",
    "Oklahoma State University 교환학생",
  ];
  contactLines.forEach((line, i) => {
    s.addText(line, {
      x: 1.2, y: 4.5 + i * 0.35, w: 4, h: 0.35,
      fontSize: 12, fontFace: "Arial",
      color: line === "" ? C.darkBg : "D1D5DB",
    });
  });
})();

// ── Save ──
const outDir = path.join(__dirname, "..", "public", "portfolio");
const outPath = path.join(outDir, "언더덕_지원서_장정빈.pptx");

pptx.writeFile({ fileName: outPath })
  .then(() => console.log("Created:", outPath))
  .catch(err => console.error("Error:", err));
