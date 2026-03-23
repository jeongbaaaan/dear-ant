const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();

// ── 슈퍼센트 톤: 게임 회사답게 에너지, 그러나 기획자답게 절제 ──
const C = {
  bg: "FFFFFF",
  dark: "0F1724",
  gray900: "1A202C",
  gray700: "374151",
  gray500: "6B7280",
  gray300: "D1D5DB",
  gray100: "F3F4F6",
  gray50: "F9FAFB",
  purple: "7C3AED",
  purpleLight: "F3EEFF",
  purpleDark: "5B21B6",
  blue: "3B82F6",
  blueLight: "EFF6FF",
  green: "10B981",
  greenLight: "ECFDF5",
  orange: "F59E0B",
  orangeLight: "FFFBEB",
  red: "EF4444",
  white: "FFFFFF",
};

pptx.layout = "LAYOUT_WIDE";
pptx.author = "장정빈";
pptx.title = "슈퍼센트_AI프로덕트기획자_장정빈";

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

  // 상단 퍼플 라인
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.purple } });

  s.addText("슈퍼센트", { x: 1.2, y: 1.2, w: 10, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.purple, bold: true });
  s.addText("AI 프로덕트 기획자", { x: 1.2, y: 1.8, w: 10, h: 1.2, fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true });

  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.purple } });

  s.addText("장정빈", { x: 1.2, y: 3.7, w: 10, h: 0.7, fontSize: 28, fontFace: "Arial", color: C.white });

  s.addText("AI로 서비스를 직접 만들고, 성과를 숫자로 증명한 사람", {
    x: 1.2, y: 4.6, w: 10, h: 0.5,
    fontSize: 15, fontFace: "Arial", color: C.gray500,
  });

  // 하단 바
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.6, w: 13.33, h: 0.9, fill: { color: "0A0F1A" } });
  s.addText("apple22by33@naver.com  |  010-8550-8464  |  dear-ant.vercel.app", {
    x: 1.2, y: 6.7, w: 10, h: 0.6,
    fontSize: 11, fontFace: "Arial", color: C.gray500,
  });
})();

// ════════════════════════════════════════
// 2. 30초 요약 — 왜 나인가
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("30초 요약", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });

  const msgs = [
    {
      num: "01",
      title: "AI로 서비스를 직접 기획하고 만들었습니다",
      body: "Claude Code를 활용해 AI 투자 심리 분석 서비스를\n기획 → 설계 → 개발 → 배포까지 2주 만에 혼자 완성했습니다.",
      result: "Dear,ANT — AI 기반 투자 판단 리포트 서비스 런칭",
      c: C.purple,
    },
    {
      num: "02",
      title: "AI PoC를 기획하고 성과를 측정했습니다",
      body: "Clova X AI 챗봇의 답변 품질을 개선하기 위해\nFew-shot 데이터셋을 설계하고, 프롬프트를 직접 구축했습니다.",
      result: "답변 수정 사이클 66% 단축 (3회 → 1회)",
      c: C.blue,
    },
    {
      num: "03",
      title: "데이터로 문제를 찾고, 비용을 절감했습니다",
      body: "70개 이상의 고객 클라우드 인프라를 분석해\n비용 이상 패턴을 발견하고, 아키텍처 개선으로 해결했습니다.",
      result: "QR 이미지 비용 60% 절감, RI 전환 40% 절감 달성",
      c: C.green,
    },
  ];

  msgs.forEach((m, i) => {
    const my = 1.6 + i * 1.85;

    s.addText(m.num, { x: 1.0, y: my, w: 0.7, h: 0.7, fontSize: 24, fontFace: "Arial Black", color: m.c, bold: true });
    s.addText(m.title, { x: 1.8, y: my, w: 10, h: 0.45, fontSize: 17, fontFace: "Arial", color: C.dark, bold: true });
    s.addText(m.body, { x: 1.8, y: my + 0.5, w: 9, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.gray500, lineSpacingMultiple: 1.3 });

    // 결과 하이라이트
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
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });

  const rows = [
    { req: "AI 기술의 한계와 가능성을\n이해하고, 개발자와 소통 가능", exp: "Claude Code로 서비스 직접 빌드\nAI 챗봇 프롬프트 설계 경험", output: "Dear,ANT 1인 풀스택 런칭\nClova X Few-shot 데이터셋 구축", type: "필수" },
    { req: "전사 혁신을 위한\nAI 전략 설계 능력", exp: "고객사 인프라 전체를 분석해\nAI/자동화 적용 포인트 발굴", output: "Lambda 자동 리사이징 설계\nLifecycle 자동 이관 구축", type: "필수" },
    { req: "사용자 중심 사고의\n서비스 기획 역량", exp: "투자자의 감정 패턴을 분석해\nUX 흐름을 직접 설계", output: "감정 → 투자 등급 엔진\n5가지 무드 × 4가지 판단 모드 시스템", type: "필수" },
    { req: "빠른 실험과 끝까지\n개선해나가는 실행력", exp: "MVP → v2.0 반복 개선\n기획-개발-배포 전 과정 독립 수행", output: "2주 만에 MVP 런칭\n6개 핵심 기능 확장 완료", type: "필수" },
    { req: "AI 관련 서비스\n기획·제품화 경력", exp: "Clova X 챗봇 기획 + Dear,ANT 빌드", output: "AI 챗봇 품질 66% 개선\nAI 투자 분석 서비스 제품화", type: "우대" },
    { req: "다양한 AI 도구\n활용 경험", exp: "Claude Code, ChatGPT, Clova X\n프롬프트 엔지니어링 실무 적용", output: "AI 도구 '활용'이 아닌\n'AI 제품 구축' 경험", type: "우대" },
  ];

  // 헤더
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.5, w: 11.9, h: 0.5, rectRadius: 0.06, fill: { color: C.dark } });
  s.addText("자격요건", { x: 0.9, y: 1.5, w: 3.2, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  s.addText("내 경험", { x: 4.3, y: 1.5, w: 3.8, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  s.addText("아웃풋", { x: 8.3, y: 1.5, w: 3.5, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });

  rows.forEach((r, i) => {
    const ry = 2.05 + i * 0.82;
    const bg = i % 2 === 0 ? C.gray50 : C.white;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: ry, w: 11.9, h: 0.75, rectRadius: 0.04, fill: { color: bg } });

    s.addText(r.req, { x: 0.9, y: ry, w: 3.2, h: 0.75, fontSize: 10, fontFace: "Arial", color: C.gray700, valign: "middle", lineSpacingMultiple: 1.2 });
    s.addText(r.exp, { x: 4.3, y: ry, w: 3.8, h: 0.75, fontSize: 10, fontFace: "Arial", color: C.gray700, valign: "middle", lineSpacingMultiple: 1.2 });
    s.addText(r.output, { x: 8.3, y: ry, w: 3.5, h: 0.75, fontSize: 10, fontFace: "Arial", color: C.purple, bold: true, valign: "middle", lineSpacingMultiple: 1.2 });

    const tagColor = r.type === "필수" ? C.purple : C.green;
    pill(s, 12.0, ry + 0.2, 0.55, r.type, tagColor, C.white);
  });
})();

// ════════════════════════════════════════
// 4. Dear,ANT — AI 프로덕트 기획 케이스
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("Dear,ANT", { x: 1.0, y: 0.5, w: 5, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  pill(s, 4.5, 0.62, 2.5, "AI 서비스 · 1인 빌드", C.purple, C.white);
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });
  s.addText("개인 투자자를 위한 AI 투자 심리 분석 & 트레이딩 저널 서비스", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 기획 → 성과 중심 4카드
  const cards = [
    {
      title: "AI 투자 리포트",
      problem: "투자자는 자기 감정 상태를\n객관적으로 파악하기 어렵다",
      solution: "감정 + 바이오리듬 + 설문을\n알고리즘으로 정량화",
      result: "A~F 투자 등급 자동 산출\n5 감정 × 4 판단 모드 조합",
      c: C.purple,
    },
    {
      title: "트레이딩 저널",
      problem: "매매 기록이 분산되어\n패턴 파악이 불가능",
      solution: "매매 시점의 감정 상태를\n자동 태깅하는 구조 설계",
      result: "종목별 P&L 자동 계산\n감정-매매 상관관계 인사이트",
      c: C.blue,
    },
    {
      title: "트렌드 대시보드",
      problem: "일회성 분석으로는\n투자 습관 개선이 안됨",
      solution: "7일간 투자 무드 변화를\n시각화하여 추적 가능하게",
      result: "Custom SVG 차트 직접 구현\n등급 변동 · 안정도 비교 뱃지",
      c: C.green,
    },
    {
      title: "투자 계산기",
      problem: "적금 vs 투자 수익을\n감각이 아닌 수치로 비교",
      solution: "세후 실수익 기반\n4가지 시나리오 시뮬레이션",
      result: "DCA 적립식 수익률 계산\n복리 효과 시각화",
      c: C.orange,
    },
  ];

  cards.forEach((o, i) => {
    const ox = 0.7 + i * 3.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: ox, y: 1.9, w: 2.85, h: 4.6, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 }, shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.05 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: ox, y: 1.9, w: 2.85, h: 0.06, fill: { color: o.c } });

    s.addText(o.title, { x: ox + 0.2, y: 2.15, w: 2.45, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.dark, bold: true });

    // 문제
    s.addText("문제", { x: ox + 0.2, y: 2.6, w: 2.45, h: 0.25, fontSize: 9.5, fontFace: "Arial", color: C.red, bold: true });
    s.addText(o.problem, { x: ox + 0.2, y: 2.85, w: 2.45, h: 0.65, fontSize: 10, fontFace: "Arial", color: C.gray500, lineSpacingMultiple: 1.3 });

    // 구분선
    s.addShape(pptx.shapes.RECTANGLE, { x: ox + 0.2, y: 3.6, w: 2.45, h: 0.02, fill: { color: C.gray100 } });

    // 해결
    s.addText("해결", { x: ox + 0.2, y: 3.75, w: 2.45, h: 0.25, fontSize: 9.5, fontFace: "Arial", color: C.blue, bold: true });
    s.addText(o.solution, { x: ox + 0.2, y: 4.0, w: 2.45, h: 0.65, fontSize: 10, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.3 });

    // 구분선
    s.addShape(pptx.shapes.RECTANGLE, { x: ox + 0.2, y: 4.75, w: 2.45, h: 0.02, fill: { color: C.gray100 } });

    // 성과
    s.addText("성과", { x: ox + 0.2, y: 4.9, w: 2.45, h: 0.25, fontSize: 9.5, fontFace: "Arial", color: o.c, bold: true });
    s.addText(o.result, { x: ox + 0.2, y: 5.15, w: 2.45, h: 0.75, fontSize: 10.5, fontFace: "Arial", color: o.c, bold: true, lineSpacingMultiple: 1.3 });
  });

  // 기술 스택
  const techs = ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Supabase", "Vercel"];
  techs.forEach((t, i) => {
    pill(s, 0.7 + i * 1.85, 6.8, 1.7, t, C.gray100, C.gray700);
  });

  s.addText("dear-ant.vercel.app", { x: 9.5, y: 6.75, w: 3.5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, align: "right" });
})();

// ════════════════════════════════════════
// 5. AI PoC 실행 케이스 — Clova X
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("AI PoC 실행 케이스", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });
  s.addText("AI 챗봇의 답변 품질을 기획 관점에서 66% 개선한 과정", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 프로세스 4단계
  const steps = [
    { step: "문제 발견", desc: "Clova X AI 챗봇이\n특정 도메인에서\n부정확한 답변 반복\n\n수정 사이클 평균 3회\n→ 배포 지연 원인", c: C.red },
    { step: "원인 분석", desc: "학습 데이터셋 부족\n프롬프트 설계 미흡\n\n답변 품질 기준이\n정성적(감 의존)이라\n일관성 확보 불가", c: C.blue },
    { step: "기획·실행", desc: "Few-shot 데이터셋\n직접 설계·구축\n\n프롬프트 구조화\n(역할/제약/예시 분리)\n\n품질 평가 기준 수립", c: C.purple },
    { step: "성과", desc: "답변 수정 사이클\n3회 → 1회\n(66% 단축)\n\n기획 → API 스펙 →\n개발팀 핸드오프까지\n전 과정 리드", c: C.green },
  ];

  steps.forEach((st, i) => {
    const sx = 0.5 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: sx, y: 1.9, w: 2.85, h: 4.0, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: sx, y: 1.9, w: 2.85, h: 0.06, fill: { color: st.c } });

    pill(s, sx + 0.6, 2.15, 1.6, st.step, st.c, C.white);

    s.addText(st.desc, { x: sx + 0.2, y: 2.7, w: 2.45, h: 2.8, fontSize: 11.5, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.4 });

    if (i < 3) {
      s.addText("→", { x: sx + 2.75, y: 3.5, w: 0.45, h: 0.5, fontSize: 22, fontFace: "Arial", color: C.purple, bold: true, align: "center" });
    }
  });

  // 슈퍼센트 연결 포인트
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.3, w: 11.9, h: 0.8, rectRadius: 0.08, fill: { color: C.purpleLight } });
  s.addText("슈퍼센트 연결:  AI PoC 기획 → 데이터 기반 품질 측정 → 조직 적용 → 지속 개선 사이클 경험", {
    x: 1.0, y: 6.35, w: 11.3, h: 0.7,
    fontSize: 13, fontFace: "Arial", color: C.purple, bold: true, align: "center", valign: "middle",
  });
})();

// ════════════════════════════════════════
// 6. 스마일샤크 — 데이터 기반 문제 해결
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("스마일샤크", { x: 1.0, y: 0.5, w: 5, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  pill(s, 4.5, 0.62, 3.0, "Account Manager · 2024.11~현재", C.gray100, C.gray700);
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });
  s.addText("AWS MSP에서 70+ 고객 인프라의 비용 최적화와 기술 이슈를 해결합니다", { x: 1.0, y: 1.25, w: 10, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.gray500 });

  // 숫자 성과
  const metrics = [
    { num: "70+", label: "관리 고객 계정", c: C.purple },
    { num: "60%", label: "최대 비용 절감", c: C.green },
    { num: "0-day", label: "이슈 대응 시간", c: C.blue },
  ];
  metrics.forEach((m, i) => {
    const mx = 1.0 + i * 3.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: mx, y: 1.9, w: 3.4, h: 1.4, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
    s.addText(m.num, { x: mx, y: 2.0, w: 3.4, h: 0.7, fontSize: 36, fontFace: "Arial Black", color: m.c, bold: true, align: "center" });
    s.addText(m.label, { x: mx, y: 2.7, w: 3.4, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.gray500, align: "center" });
  });

  // 업무 성과
  s.addText("문제를 발견하고, 해결하고, 수치로 증명", { x: 1.0, y: 3.6, w: 10, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true });

  const works = [
    { work: "Cost Explorer 비용 이상 패턴 감지", output: "RI 전환 설계 → 연간 40% 비용 절감 구조 구축", c: C.purple },
    { work: "고객 QR 이미지 원본 3MB 과다 저장 발견", output: "Lambda 자동 리사이징 아키텍처 → 스토리지 60% 절감", c: C.green },
    { work: "S3 장기 미사용 데이터 비용 누수 분석", output: "Glacier 자동 이관 Lifecycle 설계 → 스토리지 비용 대폭 절감", c: C.blue },
    { work: "고객 신규 인프라 요구사항 접수", output: "Well-Architected 기반 아키텍처 설계 → PoC → 수주 완료", c: C.orange },
  ];

  works.forEach((w, i) => {
    const wy = 4.2 + i * 0.68;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: wy, w: 11.9, h: 0.58, rectRadius: 0.06, fill: { color: i % 2 === 0 ? C.gray50 : C.white } });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: wy, w: 0.06, h: 0.58, fill: { color: w.c } });
    s.addText(w.work, { x: 1.0, y: wy, w: 4.0, h: 0.58, fontSize: 11, fontFace: "Arial", color: C.gray700, valign: "middle" });
    s.addText("→", { x: 5.0, y: wy, w: 0.4, h: 0.58, fontSize: 14, fontFace: "Arial", color: C.gray300, align: "center", valign: "middle" });
    s.addText(w.output, { x: 5.5, y: wy, w: 6.9, h: 0.58, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, valign: "middle" });
  });

  // AI 전략 관점
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.3, w: 11.9, h: 0.8, rectRadius: 0.08, fill: { color: C.purpleLight } });
  s.addText("AI 적용 관점:  반복 업무 자동화(Lambda) + 데이터 분석 기반 의사결정 + PoC → 실행 사이클", {
    x: 1.0, y: 6.35, w: 11.3, h: 0.7,
    fontSize: 13, fontFace: "Arial", color: C.purple, bold: true, align: "center", valign: "middle",
  });
})();

// ════════════════════════════════════════
// 7. AI 프로덕트 기획 역량 정리
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("AI 프로덕트 기획 역량", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });

  // 좌측: AI 기술 이해
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.5, w: 5.8, h: 2.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 5.8, h: 0.06, fill: { color: C.purple } });

  s.addText("AI 기술 이해 & 활용", { x: 1.0, y: 1.7, w: 5, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true });

  const aiSkills = [
    "프롬프트 엔지니어링 — Few-shot, 역할 분리, 구조화 설계",
    "AI 코딩 도구 활용 — Claude Code로 서비스 빌드 (기획자의 개발 독립성)",
    "LLM 한계 인식 — 할루시네이션, 토큰 제한, 일관성 문제에 대한 실무 경험",
    "AI 도구 활용 — ChatGPT, Claude, Clova X 등 실무 적용",
  ];
  aiSkills.forEach((sk, i) => {
    s.addText(`•  ${sk}`, { x: 1.0, y: 2.2 + i * 0.4, w: 5.3, h: 0.35, fontSize: 10.5, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.2 });
  });

  // 우측: 기획 역량
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.5, w: 5.8, h: 2.5, rectRadius: 0.1, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 6.85, y: 1.5, w: 5.8, h: 0.06, fill: { color: C.blue } });

  s.addText("프로덕트 기획 & 실행", { x: 7.15, y: 1.7, w: 5, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true });

  const planSkills = [
    "사용자 문제 정의 — 투자자 감정 패턴 분석 → 서비스 설계",
    "KPI 설계 — 답변 수정 사이클, 비용 절감률 등 정량 지표 설정",
    "PoC → 프로덕트 — 실험 결과를 서비스로 전환하는 전 과정 경험",
    "크로스팀 협업 — 개발/경영진/고객사 동시 커뮤니케이션",
  ];
  planSkills.forEach((sk, i) => {
    s.addText(`•  ${sk}`, { x: 7.15, y: 2.2 + i * 0.4, w: 5.3, h: 0.35, fontSize: 10.5, fontFace: "Arial", color: C.gray700, lineSpacingMultiple: 1.2 });
  });

  // 하단: 자격증 & 교육
  s.addText("자격증 & 교육", { x: 1.0, y: 4.3, w: 10, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true });

  const certs = [
    { name: "AWS Solutions Architect Associate", date: "2024.07", c: C.blue },
    { name: "AWS Hackathon 대상 (1위)", date: "2024.02", c: C.purple },
    { name: "ADsP (데이터분석 준전문가)", date: "2023.11", c: C.green },
    { name: "OPIc IH (영어)", date: "2024.04", c: C.orange },
  ];

  certs.forEach((cert, i) => {
    const cx = 0.7 + i * 3.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: cx, y: 4.85, w: 2.85, h: 1.0, rectRadius: 0.08, fill: { color: C.gray50 } });
    s.addShape(pptx.shapes.RECTANGLE, { x: cx, y: 4.85, w: 0.06, h: 1.0, fill: { color: cert.c } });
    s.addText(cert.name, { x: cx + 0.2, y: 4.9, w: 2.5, h: 0.6, fontSize: 11, fontFace: "Arial", color: C.gray700, bold: true, lineSpacingMultiple: 1.2 });
    s.addText(cert.date, { x: cx + 0.2, y: 5.5, w: 2.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.gray500 });
  });

  // AWS CloudSchool
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.1, w: 11.9, h: 0.75, rectRadius: 0.08, fill: { color: C.white }, line: { color: "E5E8EB", width: 0.7 } });
  s.addText("AWS CloudSchool 부팀장  |  CQRS 아키텍처 설계 · Multi-AZ 고가용성 구현  |  처리량 2배 개선, 비용 30% 절감, 해커톤 대상", {
    x: 1.0, y: 6.15, w: 11.3, h: 0.65,
    fontSize: 11.5, fontFace: "Arial", color: C.gray700, valign: "middle",
  });
})();

// ════════════════════════════════════════
// 8. 입사 후 30-60-90일 계획
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addText("입사 후 실행 계획", { x: 1.0, y: 0.5, w: 10, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark });
  s.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.1, w: 1.5, h: 0.04, fill: { color: C.purple } });

  const phases = [
    {
      period: "Day 1-30", title: "탐색",
      items: [
        "슈퍼센트 전체 서비스 구조 & 운영 플로우 파악",
        "현재 AI 적용 현황 / 미적용 영역 맵핑",
        "게임 · 서비스 · 운영 각 팀의 페인포인트 인터뷰",
        "경쟁사 AI 활용 사례 리서치 & 벤치마킹",
      ],
      output: "AI 적용 기회 맵 + 우선순위 매트릭스",
      c: C.purple,
    },
    {
      period: "Day 31-60", title: "실행",
      items: [
        "가장 임팩트 높은 영역 선정 → AI PoC 기획",
        "PoC 실행 & 빠른 실험 → 결과 측정",
        "개발 · 디자인 · 운영팀과 협업 구조 구축",
        "KPI 설계 & 실행 결과 트래킹 체계 수립",
      ],
      output: "AI PoC 1건 완료 + KPI 대시보드 구축",
      c: C.blue,
    },
    {
      period: "Day 61-90", title: "확산",
      items: [
        "PoC 결과 → 전사 공유 & 적용 범위 확장",
        "AI 적용 로드맵 v1 수립",
        "반복 가능한 AI 실험 프로세스 정립",
        "두 번째 PoC 기획 착수",
      ],
      output: "AI 전략 로드맵 + 2차 PoC 기획서",
      c: C.green,
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
// 9. 마지막 슬라이드
// ════════════════════════════════════════
(() => {
  const s = pptx.addSlide();
  s.background = { color: C.dark };

  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: C.purple } });

  s.addText("감사합니다", { x: 1.2, y: 2.0, w: 10, h: 1.0, fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true });

  s.addShape(pptx.shapes.RECTANGLE, { x: 1.2, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.purple } });

  s.addText("AI를 이야기하는 사람은 많지만,\nAI로 직접 만들고 성과를 측정한 사람은 드뭅니다.\n저는 그 드문 사람이 되고 싶어 슈퍼센트에 지원합니다.", {
    x: 1.2, y: 3.7, w: 10, h: 1.5,
    fontSize: 16, fontFace: "Arial", color: C.gray300, lineSpacingMultiple: 1.6,
  });

  s.addText("장정빈", { x: 1.2, y: 5.5, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.white, bold: true });
  s.addText("apple22by33@naver.com  |  010-8550-8464", { x: 1.2, y: 6.0, w: 10, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.gray500 });
  s.addText("dear-ant.vercel.app", { x: 1.2, y: 6.4, w: 10, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.purple });
})();

// ── 저장 ──
const outPath = require("path").join(__dirname, "..", "public", "portfolio", "슈퍼센트_AI프로덕트기획자_장정빈.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("✅ 생성 완료:", outPath);
});
