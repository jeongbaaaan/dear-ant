const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();

// ── 토스 디자인 시스템: 미니멀, 여백, 임팩트 ──
const C = {
  bg: "FFFFFF",
  dark: "191F28",
  gray900: "1B1D1F",
  gray700: "333D4B",
  gray500: "6B7684",
  gray300: "B0B8C1",
  gray100: "F2F4F6",
  gray50: "F9FAFB",
  blue: "3182F6",
  blueDark: "1B64DA",
  blueLight: "E8F3FF",
  blue50: "F0F7FF",
  green: "00C471",
  greenLight: "E8FAF0",
  red: "F04452",
  orange: "FF8800",
  orangeLight: "FFF5E6",
  white: "FFFFFF",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.title = "토스증권_Chart_POM_장정빈";

function pill(s, x, y, w, text, bgColor, textColor) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: bgColor } });
  s.addText(text, { x, y, w, h: 0.36, fontSize: 10.5, fontFace: "Arial", color: textColor, bold: true, align: "center" });
}

// ════════════════════════════════════════
// 1. COVER
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.blue } });

  s.addText("토스증권", { x: 1.2, y: 1.2, w: 10, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.blue, bold: true });
  s.addText("Product Operations Manager\n(Chart)", { x: 1.2, y: 1.8, w: 10, h: 1.4, fontSize: 40, fontFace: "Arial Black", color: C.white, bold: true, lineSpacingMultiple: 1.1 });

  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.5, w: 2.5, h: 0.04, fill: { color: C.blue } });

  s.addText("장정빈", { x: 1.2, y: 3.9, w: 10, h: 0.7, fontSize: 28, fontFace: "Arial", color: C.white });

  // 한 줄 소개
  s.addText("차트를 직접 보고 매매하고, 트레이딩 저널 서비스를 직접 만든 사람", { x: 1.2, y: 4.8, w: 10, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.gray300 });

  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.6, w: 13.33, h: 0.9, fill: { color: "0F1319" } });
  s.addText("apple22by33@naver.com  |  010-8550-8464  |  substack.com/@bitbit1", { x: 1.2, y: 6.7, w: 10, h: 0.6, fontSize: 11, fontFace: "Arial", color: C.gray500 });
})();

// ════════════════════════════════════════
// 2. 30초 요약 — 왜 나인가
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("30초 요약", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });

  // 3가지 핵심 메시지
  const msgs = [
    {
      num: "01",
      title: "차트 서비스를 직접 만들어봤습니다",
      body: "트레이딩 저널 + 투자 심리 차트 + 트렌드 대시보드를\n기획부터 배포까지 혼자 만들었습니다.",
      result: "Dear,ANT — 2주 만에 1인 풀스택 서비스 런칭",
      c: C.blue,
    },
    {
      num: "02",
      title: "70개 고객사의 서비스를 운영했습니다",
      body: "데이터 분석 → 이상 패턴 발견 → 해결책 제안 → 수치 검증까지,\nProduct Ops가 하는 일을 현장에서 매일 했습니다.",
      result: "스마일샤크 AM — 60% 비용 절감 제안, 고객 이슈 0-day 해결",
      c: C.green,
    },
    {
      num: "03",
      title: "AI로 제품을 만드는 사람입니다",
      body: "Claude Code로 서비스를 빌드하고, 프롬프트를 설계해서\nAI 챗봇 품질을 66% 개선한 경험이 있습니다.",
      result: "Dear,ANT + Clova X — AI 도구 활용 아닌 AI 제품 구축",
      c: C.orange,
    },
  ];

  msgs.forEach((m, i) => {
    const my = 1.6 + i * 1.85;

    // 넘버
    s.addText(m.num, { x: 1.0, y: my, w: 0.7, h: 0.7, fontSize: 24, fontFace: "Arial Black", color: m.c, bold: true });

    // 제목
    s.addText(m.title, { x: 1.8, y: my, w: 10, h: 0.45, fontSize: 17, fontFace: "Arial", color: C.dark, bold: true });

    // 설명
    s.addText(m.body, { x: 1.8, y: my + 0.5, w: 9, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.gray500, lineSpacingMultiple: 1.3 });

    // 결과 (하이라이트)
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.8, y: my + 1.15, w: 9.5, h: 0.4, rectRadius: 0.06, fill: { color: C.gray100 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: 1.8, y: my + 1.15, w: 0.06, h: 0.4, fill: { color: m.c } });
    s.addText(`→  ${m.result}`, { x: 2.1, y: my + 1.15, w: 9, h: 0.4, fontSize: 11.5, fontFace: "Arial", color: m.c, bold: true, valign: "middle" });
  });
})();

// ════════════════════════════════════════
// 3. 자격요건 매칭
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("자격요건 매칭", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });

  const rows = [
    { req: "차트 활용 기술적 분석 경험", exp: "직접 차트 보며 매매 + Dear,ANT 차트 엔진 설계", output: "트렌드 차트, 바이오리듬 차트, 투자 등급 시스템 구축", type: "필수" },
    { req: "다양한 이해관계자 협업 경험", exp: "개발팀/경영진/고객사 동시 커뮤니케이션", output: "70+ 고객사 동시 관리, 기술 제안서 → 실행까지 리드", type: "필수" },
    { req: "서비스 운영 관리 경험", exp: "AWS 인프라 운영 + Dear,ANT 서비스 운영", output: "장애 대응 0-day, Dual Storage 안정성 확보", type: "필수" },
    { req: "트레이딩뷰 차트 고도화 경험", exp: "Custom SVG 차트 + 감정 분석 대시보드 설계", output: "7일 무드 트렌드, 등급 변동 시각화 직접 구현", type: "우대" },
    { req: "AI 에이전트 트레이딩 활용 경험", exp: "Claude Code로 AI 투자 분석 서비스 구축", output: "바이오리듬 알고리즘 + 감정 가중치 엔진 설계/구현", type: "우대" },
    { req: "고객 VOC 기반 제품 개선 경험", exp: "고객 이슈 분류 → 우선순위 → 해결 → 검증 사이클", output: "QR 이미지 비용 60% 절감, RI 전환 40% 절감 제안", type: "우대" },
  ];

  // 헤더
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.5, w: 11.9, h: 0.5, rectRadius: 0.06, fill: { color: C.dark } });
  s.addText("자격요건", { x: 0.9, y: 1.5, w: 3.2, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  s.addText("내 경험", { x: 4.3, y: 1.5, w: 3.8, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  s.addText("아웃풋", { x: 8.3, y: 1.5, w: 3.5, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  s.addText("", { x: 12.0, y: 1.5, w: 0.5, h: 0.5 });

  rows.forEach((r, i) => {
    const ry = 2.05 + i * 0.82;
    const bg = i % 2 === 0 ? C.gray50 : C.white;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: ry, w: 11.9, h: 0.75, rectRadius: 0.04, fill: { color: bg } });

    s.addText(r.req, { x: 0.9, y: ry, w: 3.2, h: 0.75, fontSize: 10.5, fontFace: "Arial", color: C.gray700, valign: "middle", lineSpacingMultiple: 1.2 });
    s.addText(r.exp, { x: 4.3, y: ry, w: 3.8, h: 0.75, fontSize: 10.5, fontFace: "Arial", color: C.gray700, valign: "middle", lineSpacingMultiple: 1.2 });
    s.addText(r.output, { x: 8.3, y: ry, w: 3.5, h: 0.75, fontSize: 10.5, fontFace: "Arial", color: C.blue, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });

    // 필수/우대 태그
    const tagColor = r.type === "필수" ? C.blue : C.green;
    pill(s, 12.0, ry + 0.2, 0.55, r.type, tagColor, C.white);
  });
})();

// ════════════════════════════════════════
// 4. Dear,ANT — 만든 것
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("Dear,ANT", { x: 1.0, y: 0.5, w: 5, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  pill(s, 4.5, 0.62, 2.2, "1인 빌드 · 2주 완성", C.blue, C.white);
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });
  s.addText("개인 투자자를 위한 AI 투자 심리 분석 & 트레이딩 저널 서비스", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 만든 것 4가지 — 각각 아웃풋 명시
  const outputs = [
    {
      title: "투자 성향 리포트",
      what: "7문항 설문 + 바이오리듬 분석",
      output: "A~F 투자 등급\n판단 모드 4단계\n감정 흔들림 지수 (0~100)",
      c: C.blue,
    },
    {
      title: "트레이딩 저널",
      what: "매수/매도/보유/관심 기록 시스템",
      output: "종목별 P&L 계산\n매매 비율 분석\n포트폴리오 대시보드",
      c: C.green,
    },
    {
      title: "감정 분석 인사이트",
      what: "매매 시점의 감정 상태 태깅",
      output: "감정별 매매 패턴 분석\n\"불안할 때 매도 집중\" 식 인사이트\n감정-수익률 상관관계",
      c: C.orange,
    },
    {
      title: "트렌드 대시보드",
      what: "7일간 투자 무드 시각화",
      output: "Custom SVG 차트\n등급 변동 트래킹\n바이오리듬 오버레이",
      c: C.blue,
    },
  ];

  outputs.forEach((o, i) => {
    const ox = 0.7 + i * 3.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: ox, y: 1.9, w: 2.85, h: 4.2, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 }, shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.05 } });

    // 상단 컬러바
    s.addShape(pptx.shapes.RECTANGLE, { x: ox, y: 1.9, w: 2.85, h: 0.06, fill: { color: o.c } });

    s.addText(o.title, { x: ox + 0.2, y: 2.15, w: 2.45, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(o.what, { x: ox + 0.2, y: 2.55, w: 2.45, h: 0.4, fontSize: 10.5, fontFace: "Arial", color: C.gray500 });

    // 구분선
    s.addShape(pptx.shapes.RECTANGLE, { x: ox + 0.2, y: 3.1, w: 2.45, h: 0.02, fill: { color: C.gray100 } });

    // 아웃풋 (핵심!)
    s.addText("아웃풋", { x: ox + 0.2, y: 3.25, w: 2.45, h: 0.3, fontSize: 10, fontFace: "Arial", color: o.c, bold: true });
    s.addText(o.output, { x: ox + 0.2, y: 3.55, w: 2.45, h: 2.0, fontSize: 11, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.4 });
  });

  // 기술 스택
  const techs = ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Supabase"];
  techs.forEach((t, i) => {
    pill(s, 0.7 + i * 2.1, 6.4, 1.9, t, C.gray100, C.gray700);
  });

  s.addText("dear-ant.vercel.app", { x: 9.5, y: 6.35, w: 3.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true, align: "right" });
})();

// ════════════════════════════════════════
// 5. Dear,ANT — 차트 엔진 상세
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("차트 분석 엔진", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });
  s.addText("투자 심리를 정량화하는 알고리즘을 직접 설계하고 구현했습니다", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 왼쪽: 알고리즘 흐름
  s.addText("설계한 알고리즘", { x: 1.0, y: 1.9, w: 5, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });

  const flow = [
    { step: "INPUT", desc: "생년월일 + 오늘의 감정 (5가지) + 7문항 설문", c: C.gray700 },
    { step: "ENGINE", desc: "바이오리듬 삼각함수 (23/28/33일 주기)\n+ 감정 가중치 + 응답 일관성 분석", c: C.blue },
    { step: "OUTPUT", desc: "투자 등급 (A~F) + 판단 모드 (방어/관망/신중/적극)\n+ 감정 흔들림 지수 (0~100) + 맞춤 키워드 & 편지", c: C.green },
  ];

  flow.forEach((f, i) => {
    const fy = 2.5 + i * 1.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: fy, w: 1.2, h: 0.42, rectRadius: 0.21, fill: { color: f.c } });
    s.addText(f.step, { x: 1.0, y: fy, w: 1.2, h: 0.42, fontSize: 10, fontFace: "Arial Black", color: C.white, bold: true, align: "center" });
    s.addText(f.desc, { x: 2.4, y: fy - 0.1, w: 4.5, h: 0.7, fontSize: 11.5, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.3, valign: "middle" });

    if (i < 2) {
      s.addText("↓", { x: 1.0, y: fy + 0.55, w: 1.2, h: 0.7, fontSize: 20, fontFace: "Arial", color: C.gray300, align: "center" });
    }
  });

  // 오른쪽: 기술적 결정 + 성과
  s.addText("핵심 기술 결정과 성과", { x: 7.5, y: 1.9, w: 5, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });

  const decisions = [
    { decision: "Custom SVG 차트 직접 구현", why: "외부 라이브러리 의존도 0%", result: "번들 사이즈 최적화", c: C.blue },
    { decision: "Dual Storage 전략", why: "Supabase + In-memory 이중화", result: "장애 시 서비스 중단 0초", c: C.green },
    { decision: "App Router REST API", why: "별도 백엔드 서버 제거", result: "인프라 비용 0원 (Vercel)", c: C.orange },
    { decision: "바이오리듬 삼각함수 직접 구현", why: "투자 판단 정량화 엔진", result: "감정-수익률 상관관계 분석 가능", c: C.blue },
  ];

  decisions.forEach((d, i) => {
    const dy = 2.5 + i * 1.1;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: dy, w: 5.2, h: 0.95, rectRadius: 0.08, fill: { color: C.gray50 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: 7.5, y: dy, w: 0.06, h: 0.95, fill: { color: d.c } });

    s.addText(d.decision, { x: 7.8, y: dy + 0.05, w: 4.7, h: 0.3, fontSize: 11.5, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(d.why, { x: 7.8, y: dy + 0.35, w: 3.0, h: 0.25, fontSize: 10, fontFace: "Arial", color: C.gray500 });
    s.addText(d.result, { x: 10.0, y: dy + 0.35, w: 2.5, h: 0.25, fontSize: 10.5, fontFace: "Arial", color: d.c, bold: true, align: "right" });
  });
})();

// ════════════════════════════════════════
// 6. 스마일샤크 — 운영 성과
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("스마일샤크", { x: 1.0, y: 0.5, w: 5, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  pill(s, 4.5, 0.62, 3.0, "Account Manager · 2024.11~현재", C.gray100, C.gray700);
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });
  s.addText("AWS MSP 파트너사에서 70+ 고객 계정의 클라우드 인프라를 운영·최적화합니다", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 숫자 성과
  const metrics = [
    { num: "70+", label: "관리 고객 계정", c: C.blue },
    { num: "60%", label: "비용 절감 제안", c: C.green },
    { num: "0-day", label: "이슈 대응 시간", c: C.orange },
  ];
  metrics.forEach((m, i) => {
    const mx = 1.0 + i * 3.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: mx, y: 1.9, w: 3.4, h: 1.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
    s.addText(m.num, { x: mx, y: 2.0, w: 3.4, h: 0.8, fontSize: 36, fontFace: "Arial Black", color: m.c, bold: true, align: "center" });
    s.addText(m.label, { x: mx, y: 2.8, w: 3.4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.gray500, align: "center" });
  });

  // 업무 → 아웃풋 매핑
  s.addText("무슨 일을 했고, 무엇을 만들었나", { x: 1.0, y: 3.7, w: 10, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });

  const works = [
    { work: "Cost Explorer 데이터 분석", output: "비용 이상 패턴 감지 → RI 전환 권고 → 40% 절감 구조 설계", c: C.blue },
    { work: "고객 기술 이슈 대응", output: "QR 이미지 비용 문제 발견 → Lambda 아키텍처 제안 → 60% 절감", c: C.green },
    { work: "S3 Lifecycle 최적화", output: "30일 미접근 데이터 → Glacier 자동 이관 → 장기 스토리지 비용 대폭 절감", c: C.orange },
    { work: "PoC 기획 & 기술 제안", output: "고객 요구사항 분석 → Well-Architected 아키텍처 → 견적서 → 수주", c: C.blue },
  ];

  works.forEach((w, i) => {
    const wy = 4.3 + i * 0.68;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: wy, w: 11.9, h: 0.58, rectRadius: 0.06, fill: { color: i % 2 === 0 ? C.gray50 : C.white } });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: wy, w: 0.06, h: 0.58, fill: { color: w.c } });
    s.addText(w.work, { x: 1.0, y: wy, w: 3.5, h: 0.58, fontSize: 11.5, fontFace: "Arial", color: C.gray700, valign: "middle" });
    s.addText("→", { x: 4.5, y: wy, w: 0.4, h: 0.58, fontSize: 14, fontFace: "Arial", color: C.gray300, align: "center", valign: "middle" });
    s.addText(w.output, { x: 5.0, y: wy, w: 7.4, h: 0.58, fontSize: 11.5, fontFace: "Arial", color: C.blue, bold: true, valign: "middle" });
  });
})();

// ════════════════════════════════════════
// 7. 문제 해결 케이스
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("문제 해결 케이스", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });
  s.addText("고객사 QR 이미지 비용 문제를 데이터로 발견하고, 아키텍처로 해결했습니다", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 4단계 프로세스
  const steps = [
    { step: "발견", desc: "Cost Explorer에서\n이상 비용 패턴 감지\n\nQR 이미지 원본 3MB\n그대로 저장/전송 중", c: C.red },
    { step: "분석", desc: "스토리지 비용 급증\n전송 대역폭 낭비\n\n실제 필요 용량: 300KB\n10배 과다 리소스 사용", c: C.blue },
    { step: "제안", desc: "S3 업로드 시\nLambda 자동 리사이징\n\n3MB → 300KB 변환\nCloudFront CDN 배포", c: C.blue },
    { step: "결과", desc: "스토리지 60% 절감\n대역폭 비용 절감\n\n로딩 속도 개선\n자동화 파이프라인 구축", c: C.green },
  ];

  steps.forEach((st, i) => {
    const sx = 0.5 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: sx, y: 1.9, w: 2.85, h: 3.8, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: sx, y: 1.9, w: 2.85, h: 0.06, fill: { color: st.c } });

    pill(s, sx + 0.6, 2.15, 1.6, st.step, st.c, C.white);

    s.addText(st.desc, { x: sx + 0.2, y: 2.7, w: 2.45, h: 2.5, fontSize: 11.5, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.4 });

    if (i < 3) {
      s.addText("→", { x: sx + 2.75, y: 3.4, w: 0.45, h: 0.5, fontSize: 22, fontFace: "Arial", color: C.blue, bold: true, align: "center" });
    }
  });

  // Product Ops 관점
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.1, w: 11.9, h: 0.8, rectRadius: 0.08, fill: { color: C.blueLight } });
  s.addText("Product Ops 관점:  데이터로 문제 발견 → 우선순위 판단 → 해결 제안 → 수치로 증명", { x: 1.0, y: 6.15, w: 11.3, h: 0.7, fontSize: 13, fontFace: "Arial", color: C.blue, bold: true, align: "center", valign: "middle" });
})();

// ════════════════════════════════════════
// 8. 추가 경험
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("추가 경험", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });

  // Clova X
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.5, w: 5.8, h: 4.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 5.8, h: 0.06, fill: { color: C.green } });

  s.addText("Clova X AI 챗봇 기획", { x: 1.0, y: 1.8, w: 5, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true });
  s.addText("네이버클라우드 · PM · 2023.11~12", { x: 1.0, y: 2.2, w: 5, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.gray500 });

  s.addText("한 일", { x: 1.0, y: 2.7, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.gray500, bold: true });
  const clovaWork = ["AI 챗봇 답변 영역 기획", "Few-shot 데이터셋 직접 구축", "기획 → API 스펙 → 개발팀 핸드오프"];
  clovaWork.forEach((w, i) => {
    s.addText(`• ${w}`, { x: 1.0, y: 3.0 + i * 0.38, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.gray700 });
  });

  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 4.2, w: 5.0, h: 0.02, fill: { color: C.gray100 } });

  s.addText("아웃풋", { x: 1.0, y: 4.4, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.green, bold: true });
  s.addText("답변 수정 사이클  3회 → 1회", { x: 1.0, y: 4.75, w: 5, h: 0.45, fontSize: 18, fontFace: "Arial Black", color: C.green, bold: true });
  s.addText("66% 단축", { x: 1.0, y: 5.2, w: 5, h: 0.3, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // CloudSchool
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.5, w: 5.8, h: 4.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 6.85, y: 1.5, w: 5.8, h: 0.06, fill: { color: C.blue } });

  s.addText("AWS CloudSchool", { x: 7.15, y: 1.8, w: 5, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true });
  s.addText("부팀장 · CQRS 아키텍처 설계 · 2024.01~07", { x: 7.15, y: 2.2, w: 5, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.gray500 });

  s.addText("한 일", { x: 7.15, y: 2.7, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.gray500, bold: true });
  const csWork = ["CQRS 패턴 읽기/쓰기 분리 설계", "Multi-AZ 고가용성 아키텍처 구현", "팀 리딩 + 프로젝트 매니징"];
  csWork.forEach((w, i) => {
    s.addText(`• ${w}`, { x: 7.15, y: 3.0 + i * 0.38, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.gray700 });
  });

  s.addShape(pptx.shapes.RECTANGLE, { x: 7.15, y: 4.2, w: 5.0, h: 0.02, fill: { color: C.gray100 } });

  s.addText("아웃풋", { x: 7.15, y: 4.4, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.blue, bold: true });

  const csResults = [
    { num: "2x", label: "처리량 개선" },
    { num: "30%", label: "비용 절감" },
    { num: "1위", label: "AWS 해커톤 대상" },
  ];
  csResults.forEach((r, i) => {
    s.addText(r.num, { x: 7.15 + i * 1.7, y: 4.75, w: 1.0, h: 0.45, fontSize: 22, fontFace: "Arial Black", color: C.blue, bold: true });
    s.addText(r.label, { x: 8.15 + i * 1.7, y: 4.75, w: 1.3, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.gray500, valign: "middle" });
  });
})();

// ════════════════════════════════════════
// 9. 30-60-90일 계획
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("입사 후 실행 계획", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });

  // 30일
  const phases = [
    {
      period: "Day 1-30", title: "흡수",
      items: [
        "트레이딩뷰 차트 서비스 구조 100% 파악",
        "기존 운영 이슈 히스토리 전수 학습",
        "PO · 디자이너 · 분석가와 워킹 관계 구축",
        "경쟁 플랫폼 차트 UX 비교 분석 문서화",
      ],
      output: "경쟁사 차트 분석 보고서 1건",
      c: C.blue,
    },
    {
      period: "Day 31-60", title: "기여",
      items: [
        "운영 이슈 직접 분석 & 해결안 제시",
        "고객 VOC 수집 → 개선 우선순위 체계화",
        "차트 데이터 정합성 검증 프로세스 구축",
        "PO와 함께 개선 로드맵 v1 초안",
      ],
      output: "차트 개선 우선순위 백로그 구축",
      c: C.green,
    },
    {
      period: "Day 61-90", title: "드라이브",
      items: [
        "차트 서비스 고도화 제안서 작성",
        "AI 기반 차트 분석 기능 기획안",
        "개선 효과 수치화 리포팅 체계 확립",
        "독립적 프로젝트 1건 리드",
      ],
      output: "차트 고도화 제안서 + 프로젝트 1건 완료",
      c: C.orange,
    },
  ];

  phases.forEach((p, i) => {
    const px = 0.5 + i * 4.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.5, w: 3.85, h: 5.2, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: px, y: 1.5, w: 3.85, h: 0.06, fill: { color: p.c } });

    pill(s, px + 0.2, 1.75, 1.5, p.period, p.c, C.white);
    s.addText(p.title, { x: px + 1.9, y: 1.75, w: 1.5, h: 0.36, fontSize: 14, fontFace: "Arial", color: p.c, bold: true, valign: "middle" });

    p.items.forEach((item, j) => {
      s.addText(`${j + 1}. ${item}`, { x: px + 0.2, y: 2.4 + j * 0.65, w: 3.45, h: 0.6, fontSize: 11, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.2 });
    });

    // 아웃풋
    s.addShape(pptx.shapes.RECTANGLE, { x: px + 0.2, y: 5.2, w: 3.45, h: 0.02, fill: { color: C.gray100 } });
    s.addText("아웃풋", { x: px + 0.2, y: 5.35, w: 1.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: p.c, bold: true });
    s.addText(p.output, { x: px + 0.2, y: 5.65, w: 3.45, h: 0.8, fontSize: 12, fontFace: "Arial", color: C.dark, bold: true, lineSpacingMultiple: 1.2 });
  });
})();

// ════════════════════════════════════════
// 10. 자격증 & 교육
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("자격증 & 교육", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.blue } });

  // 자격증
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.5, w: 5.8, h: 4.0, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  pill(s, 0.9, 1.7, 1.8, "Certifications", C.blue, C.white);

  const certs = [
    { name: "AWS Solutions Architect Associate", d: "2024.07" },
    { name: "AWS Hackathon 대상 (1위)", d: "2024.02" },
    { name: "ADsP (데이터분석 준전문가)", d: "2023.11" },
    { name: "OPIc IH (영어)", d: "2024.04" },
  ];
  certs.forEach((c, i) => {
    const cy = 2.3 + i * 0.7;
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.9, y: cy + 0.05, w: 0.06, h: 0.3, fill: { color: C.blue } });
    s.addText(c.name, { x: 1.2, y: cy, w: 4.0, h: 0.4, fontSize: 11.5, fontFace: "Arial", color: C.gray700, valign: "middle" });
    s.addText(c.d, { x: 5.0, y: cy, w: 1.2, h: 0.4, fontSize: 10, fontFace: "Arial", color: C.gray500, align: "right", valign: "middle" });
  });

  // 교육
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.5, w: 5.8, h: 4.0, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  pill(s, 7.05, 1.7, 2.8, "AWS Official Training (6)", C.green, C.white);

  const trains = [
    "Developing Serverless Solutions",
    "DevOps Engineering on AWS",
    "Developing on AWS",
    "Well-Architected Best Practices",
    "Technical Essentials",
    "Security Essentials",
  ];
  trains.forEach((t, i) => {
    const ty = 2.3 + i * 0.55;
    s.addShape(pptx.shapes.RECTANGLE, { x: 7.05, y: ty + 0.05, w: 0.06, h: 0.28, fill: { color: C.green } });
    s.addText(t, { x: 7.35, y: ty, w: 5, h: 0.38, fontSize: 11, fontFace: "Arial", color: C.gray700, valign: "middle" });
  });

  // Timeline
  s.addText("Career", { x: 1.0, y: 5.8, w: 3, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 6.4, w: 11.9, h: 0.04, fill: { color: C.blue } });

  const timeline = [
    { d: "2023.09", t: "신한은행 IT기획", c: C.blue },
    { d: "2023.11", t: "Clova X AI PM", c: C.green },
    { d: "2024.01", t: "CloudSchool", c: C.blue },
    { d: "2024.11", t: "스마일샤크 AM", c: C.green },
    { d: "2025.03", t: "Dear,ANT", c: C.orange },
  ];
  timeline.forEach((ev, i) => {
    const ex = 0.5 + i * 2.45;
    s.addShape(pptx.shapes.OVAL, { x: ex + 0.55, y: 6.22, w: 0.38, h: 0.38, fill: { color: ev.c } });
    s.addText(ev.d, { x: ex, y: 6.65, w: 1.6, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.gray500, align: "center" });
    s.addText(ev.t, { x: ex, y: 6.85, w: 1.6, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dark, bold: true, align: "center" });
  });
})();

// ════════════════════════════════════════
// 11. THANK YOU
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.blue } });

  s.addText("감사합니다", { x: 1.2, y: 1.8, w: 10, h: 1.0, fontSize: 44, fontFace: "Arial Black", color: C.white, bold: true });

  s.addText("데이터로 문제를 찾고, 제품으로 해결하고, 수치로 증명하겠습니다.", { x: 1.2, y: 3.0, w: 10, h: 0.6, fontSize: 17, fontFace: "Arial", color: C.blue });

  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.9, w: 2.5, h: 0.04, fill: { color: C.blue } });

  const contacts = [
    { k: "Email", v: "apple22by33@naver.com" },
    { k: "Phone", v: "010-8550-8464" },
    { k: "Blog", v: "substack.com/@bitbit1" },
    { k: "Service", v: "dear-ant.vercel.app" },
  ];
  contacts.forEach((c, i) => {
    s.addText(c.k, { x: 1.2, y: 4.3 + i * 0.5, w: 1.2, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.gray500 });
    s.addText(c.v, { x: 2.4, y: 4.3 + i * 0.5, w: 6, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.white });
  });
})();

// ── Generate ──
const outPath = "/Users/jeongbin/dear.ant/public/portfolio/토스증권_Product_Ops_장정빈.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log("DONE:", outPath))
  .catch((err) => console.error("Error:", err));
