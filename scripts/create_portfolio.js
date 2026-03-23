const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "장정빈";
pres.title = "장정빈 포트폴리오";

const C = {
  white: "FFFFFF", bg: "FAFAFA", warm: "F5F5F4",
  text: "18181B", sub: "3F3F46", muted: "71717A", dim: "A1A1AA",
  line: "E4E4E7",
  pri: "4F46E5", priLight: "EEF2FF",
  sec: "0EA5E9", green: "059669", amber: "D97706",
};
const A = "/Users/jeongbin/dear.ant/portfolio_assets";
const img = (n) => path.join(A, n);
const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.06 });

// ═══════════════════════════════════════════════════════════════
// 1. COVER
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.pri } });

  s.addText("장정빈", {
    x: 0.8, y: 1.2, w: 5, h: 1.3,
    fontSize: 52, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
  });
  s.addText("IT 기획 / 프로덕트 매니저", {
    x: 0.8, y: 2.5, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.muted, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 2, h: 0.01, fill: { color: C.line } });
  s.addText("apple22by33@naver.com  ·  010-8550-8464\ngithub.com/jeongbaaaan", {
    x: 0.8, y: 3.4, w: 5, h: 0.6,
    fontSize: 11, fontFace: "Arial", color: C.dim, margin: 0,
  });

  // Phone
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.0, y: 0.15, w: 3.4, h: 5.3,
    fill: { color: C.warm }, rectRadius: 0.3,
    line: { color: C.line, width: 1 }, shadow: shadow(),
  });
  s.addImage({
    path: img("dearant_home.png"),
    x: 6.15, y: 0.3, w: 3.1, h: 5.0,
    sizing: { type: "contain", w: 3.1, h: 5.0 },
  });
}

// ═══════════════════════════════════════════════════════════════
// 2. 경력 요약 — 타임라인
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("경력 요약", {
    x: 0.8, y: 0.5, w: 8, h: 0.5,
    fontSize: 22, fontFace: "Arial", color: C.text, bold: true, margin: 0,
  });

  const jobs = [
    { period: "2024.11 ~ 재직중", title: "스마일샤크 · Account Manager", what: "AWS MSP 고객 70개 계정 인프라 운영, 비용 최적화 컨설팅.\nS3 Lifecycle 정책 설계, Lambda 이미지 리사이징 자동화.\n고객사 플랫폼 기획 PoC 진행.", color: C.pri },
    { period: "2024.01 ~ 07", title: "AWS CloudSchool 4기 · DB Lead / PM", what: "경매 웹사이트 클라우드 마이그레이션.\nCQRS 패턴 DB 설계, 예산 기반 인프라 설계.\nAWS Hackathon 대상 수상.", color: C.sec },
    { period: "2023.11 ~ 12", title: "네이버클라우드 · 기획 PM", what: "Clova X 기반 AI 챗봇 서비스 기획.\nUX 흐름 설계, 프롬프트 데이터셋 구축, 개발자 협업.", color: C.green },
  ];

  jobs.forEach((j, i) => {
    const y = 1.3 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.06, h: 1.05, fill: { color: j.color } });
    s.addText(j.period, { x: 1.1, y, w: 2, h: 0.2, fontSize: 9, fontFace: "Arial", color: C.dim, margin: 0 });
    s.addText(j.title, { x: 1.1, y: y + 0.22, w: 3.5, h: 0.25, fontSize: 13, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
    s.addText(j.what, { x: 5.0, y, w: 4.5, h: 1.05, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.05, w: 8.4, h: 0.01, fill: { color: C.line } });
  s.addText("AWS SAA  ·  ADsP  ·  OPIc IH  ·  AWS Hackathon 대상  ·  가천대 경제학과", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.dim,
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. Dear,ANT — 왜 + 뭘 했는지
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Dear,ANT", {
    x: 0.8, y: 0.4, w: 5, h: 0.6,
    fontSize: 28, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
  });
  s.addText("개인 프로젝트  |  기획·설계·개발 1인  |  dear-ant.vercel.app", {
    x: 0.8, y: 0.95, w: 8, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.dim,
  });

  // 3 blocks only
  const blocks = [
    { label: "만든 이유", color: C.pri,
      text: "직접 투자하다 감정적 매매로 손실 경험.\n\"매매 전 내 컨디션을 점검할 도구\"가 필요했고,\n포트폴리오도 필요해서 직접 만듦." },
    { label: "뭘 했는지", color: C.green,
      text: "Claude Code와 페어 프로그래밍으로 2주 만에 MVP.\n이후 5단계 이터레이션 (UI 리디자인, 기능 추가).\n기획→DB 설계→프론트엔드→배포 전 과정 수행." },
    { label: "배운 점", color: C.amber,
      text: "직접 DB 스키마 설계하고 API 연동해보니,\n개발자에게 요구사항을 구체적으로 전달할 수 있게 됨.\n\"기획자가 기술을 이해하면 커뮤니케이션이 달라진다.\"" },
  ];

  blocks.forEach((b, i) => {
    const y = 1.5 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.06, h: 0.95, fill: { color: b.color } });
    s.addText(b.label, { x: 1.1, y, w: 1.5, h: 0.25, fontSize: 12, fontFace: "Arial", color: b.color, bold: true, margin: 0 });
    s.addText(b.text, { x: 2.6, y, w: 2.8, h: 0.95, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });
  });

  // Phone — right
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.2, y: 0.15, w: 3.2, h: 5.3,
    fill: { color: C.warm }, rectRadius: 0.25,
    line: { color: C.line, width: 1 }, shadow: shadow(),
  });
  s.addImage({
    path: img("dearant_home.png"),
    x: 6.35, y: 0.3, w: 2.9, h: 5.0,
    sizing: { type: "contain", w: 2.9, h: 5.0 },
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. Dear,ANT — 주요 화면
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Dear,ANT — 주요 화면", {
    x: 0.8, y: 0.3, w: 8, h: 0.4,
    fontSize: 20, fontFace: "Arial", color: C.text, bold: true, margin: 0,
  });

  const flow = [
    { file: "dearant_survey.png", title: "매매 전 셀프체크" },
    { file: "dearant_memo.png", title: "트레이딩 저널" },
    { file: "dearant_compound.png", title: "복리 계산기" },
    { file: "dearant_calculator.png", title: "적금 vs 투자" },
  ];

  flow.forEach((f, i) => {
    const fx = 0.4 + i * 2.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: fx, y: 0.9, w: 2.1, h: 3.6,
      fill: { color: C.warm }, rectRadius: 0.15,
      line: { color: C.line, width: 0.5 }, shadow: shadow(),
    });
    s.addImage({
      path: img(f.file),
      x: fx + 0.08, y: 0.98, w: 1.94, h: 3.44,
      sizing: { type: "cover", w: 1.94, h: 3.44 },
    });
    s.addText(f.title, {
      x: fx, y: 4.6, w: 2.1, h: 0.3,
      fontSize: 12, fontFace: "Arial", color: C.text, bold: true, align: "center", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. DDONA — 텍스트로 깔끔하게
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("DDONA — AI 부캐 챗봇 서비스", {
    x: 0.8, y: 0.4, w: 8, h: 0.5,
    fontSize: 22, fontFace: "Arial", color: C.text, bold: true, margin: 0,
  });
  s.addText("Potenday 312  |  PM 역할  |  팀 6인 (BE 1 · FE 2 · PM 2 · Design 1)", {
    x: 0.8, y: 0.9, w: 8, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.dim,
  });

  // Left: what the service is + my role
  const sections = [
    { label: "서비스 개요", color: C.pri,
      text: "성격 성향 질문 18개에 답하면 AI가 나만의 부캐(캐릭터)를 생성.\n부캐와 대화하면서 일상 고민을 상담받는 서비스.\n\"또 다른 나, 부캐를 직접 만나고 경험할 수 있는 서비스.\"" },
    { label: "내가 한 것 (PM)", color: C.green,
      text: "서비스 목표 정의 및 타겟 페르소나 설정.\nIA(정보 구조도) 설계 — 앱 진입→부캐 제작→대화방 플로우.\n18가지 성향 질문 설계 → 부캐 캐릭터 매칭 로직 기획.\n개발자·디자이너 간 요구사항 조율, 향후 로드맵 수립." },
    { label: "배운 점", color: C.amber,
      text: "6명이 2주 만에 서비스를 만드는 경험.\n\"이거 할 수 있어?\" → \"이 범위면 2주 안에 가능\" 대화가\n프로젝트 성패를 좌우함. 현실적 범위 조율이 PM의 핵심." },
  ];

  sections.forEach((sec, i) => {
    const y = 1.4 + i * 1.25;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.06, h: 1.0, fill: { color: sec.color } });
    s.addText(sec.label, { x: 1.1, y, w: 2, h: 0.25, fontSize: 12, fontFace: "Arial", color: sec.color, bold: true, margin: 0 });
    s.addText(sec.text, { x: 1.1, y: y + 0.3, w: 4.2, h: 0.7, fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0 });
  });

  // Right: ONE clean screenshot (page 6 - all screens overview)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.8, y: 1.2, w: 3.8, h: 3.5,
    fill: { color: "1A1A2E" }, rectRadius: 0.15,
    shadow: shadow(),
  });
  s.addImage({
    path: img("ddona-06.png"),
    x: 5.9, y: 1.3, w: 3.6, h: 3.3,
    sizing: { type: "contain", w: 3.6, h: 3.3 },
  });
}

// ═══════════════════════════════════════════════════════════════
// 6. 기타 경력 — 클라우드 마이그레이션 + AI 챗봇 + 이사지역
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("기타 프로젝트", {
    x: 0.8, y: 0.4, w: 8, h: 0.45,
    fontSize: 22, fontFace: "Arial", color: C.text, bold: true, margin: 0,
  });

  const projects = [
    {
      title: "경매 웹사이트 클라우드 마이그레이션",
      meta: "AWS CloudSchool 4기  |  DB Lead / PM  |  2024",
      what: "CQRS 패턴 DB 설계 (사용자 흐름 기반 테이블 분리).\nSpot Instance + Auto Scaling으로 예산 내 인프라 설계.\nDevOps Tool Chain 구성, 아키텍처 설계 리딩, 최종 발표.",
    },
    {
      title: "Clova X AI 챗봇 서비스 기획",
      meta: "네이버클라우드  |  기획 PM (프리랜서)  |  2023",
      what: "Clova X 기반 챗봇 전체 기획 PM.\n메뉴구조도 작성, UX 대화 흐름 설계, 프롬프트 데이터셋 구축.\nAI 응답 품질 관리, 개발자 스펙 조율.",
    },
    {
      title: "이사지역 추천 서비스 설계",
      meta: "개인 프로젝트  |  Python, Streamlit, Folium  |  2024",
      what: "공공데이터(보증금, 월세, 범죄율) 파라미터화.\nStreamlit + Folium 지도로 사용자 조건별 인터랙티브 추천.\n데이터를 정량화해서 의사결정을 돕는 도구 기획.",
    },
  ];

  projects.forEach((p, i) => {
    const y = 1.1 + i * 1.45;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y, w: 8.4, h: 1.2,
      fill: { color: C.bg }, line: { color: C.line, width: 0.5 },
    });
    s.addText(p.title, {
      x: 1.0, y: y + 0.12, w: 3.5, h: 0.28,
      fontSize: 13, fontFace: "Arial", color: C.text, bold: true, margin: 0,
    });
    s.addText(p.meta, {
      x: 1.0, y: y + 0.42, w: 3.5, h: 0.2,
      fontSize: 9, fontFace: "Arial", color: C.dim, margin: 0,
    });
    s.addText(p.what, {
      x: 4.8, y: y + 0.1, w: 4.2, h: 1.0,
      fontSize: 10, fontFace: "Arial", color: C.sub, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 7. CLOSING
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.pri } });

  s.addText("감사합니다.", {
    x: 1.5, y: 1.5, w: 7, h: 0.8,
    fontSize: 42, fontFace: "Arial Black", color: C.text, bold: true, align: "center",
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.2, y: 2.5, w: 1.6, h: 0.03, fill: { color: C.pri } });
  s.addText("장정빈  ·  IT 기획 / 프로덕트 매니저", {
    x: 1.5, y: 2.9, w: 7, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: C.text, align: "center",
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.55, w: 3, h: 0.01, fill: { color: C.line } });
  s.addText("apple22by33@naver.com  ·  010-8550-8464\ngithub.com/jeongbaaaan", {
    x: 1.5, y: 3.7, w: 7, h: 0.6,
    fontSize: 11, fontFace: "Arial", color: C.dim, align: "center",
  });
}

const out = "/Users/jeongbin/Desktop/개인폴더/포트폴리오/장정빈_포트폴리오_AI_Product_Planner.pptx";
pres.writeFile({ fileName: out }).then(() => console.log("Done: " + out)).catch(console.error);
