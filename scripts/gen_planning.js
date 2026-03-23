const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Dear,ANT";
pres.title = "Dear,ANT - 서비스 기획 포트폴리오";

// Color palette
const C = {
  purpleDark: "581C87",
  purple: "9333EA",
  purpleLight: "C084FC",
  purpleBg: "F3E8FF",
  mint: "10B981",
  mintLight: "34D399",
  mintBg: "D1FAE5",
  dark: "0F172A",
  text: "1E293B",
  sub: "64748B",
  muted: "94A3B8",
  light: "F8FAFC",
  border: "E2E8F0",
  white: "FFFFFF",
  blue: "3B82F6",
  blueBg: "DBEAFE",
  amber: "F59E0B",
  amberBg: "FEF3C7",
  rose: "F43F5E",
  roseBg: "FFE4E6",
};

const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 });

// ========== SLIDE 1: Title ==========
let s1 = pres.addSlide();
s1.background = { color: C.purpleDark };
// Decorative shapes
s1.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 4, h: 4, fill: { color: C.purple, transparency: 80 } });
s1.addShape(pres.shapes.OVAL, { x: 7, y: 3, w: 5, h: 5, fill: { color: C.mintLight, transparency: 85 } });
s1.addText("PRODUCT PLANNING PORTFOLIO", { x: 0.5, y: 1.2, w: 9, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.purpleLight, charSpacing: 4, bold: true });
s1.addText([
  { text: "Dear", options: { color: C.white, bold: true } },
  { text: ",", options: { color: C.mintLight, bold: true } },
  { text: "ANT", options: { color: C.purpleLight, bold: true } }
], { x: 0.5, y: 1.8, w: 9, h: 1.2, fontSize: 54, fontFace: "Arial Black" });
s1.addText("개인 투자자를 위한 감정 기반 투자 리포트 서비스", { x: 0.5, y: 3.1, w: 9, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.muted });
s1.addText("서비스 기획  ·  정보 구조 설계  ·  UX 리서치  ·  요구사항 정의", { x: 0.5, y: 3.7, w: 9, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.sub });
// Ant emoji
s1.addText("🐜", { x: 8.2, y: 0.6, w: 1.2, h: 1.2, fontSize: 60 });

// ========== SLIDE 2: Project Overview ==========
let s2 = pres.addSlide();
s2.background = { color: C.light };
s2.addText("OVERVIEW", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s2.addText("프로젝트 개요", { x: 0.7, y: 0.75, w: 5, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

// Metrics row
const metrics = [
  { val: "8", label: "핵심 페이지" },
  { val: "7", label: "설문 문항" },
  { val: "5", label: "감정 유형" },
  { val: "20", label: "맞춤 시나리오" },
];
metrics.forEach((m, i) => {
  const x = 0.7 + i * 2.2;
  s2.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2, h: 1, fill: { color: C.white }, shadow: makeShadow() });
  s2.addText(m.val, { x, y: 1.55, w: 2, h: 0.6, fontSize: 36, fontFace: "Arial Black", color: C.purple, align: "center", valign: "middle", margin: 0 });
  s2.addText(m.label, { x, y: 2.15, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.sub, align: "center", margin: 0 });
});

// Problem & Solution cards
s2.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.8, w: 4.2, h: 2.4, fill: { color: C.white }, shadow: makeShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.8, w: 4.2, h: 0.06, fill: { color: C.purple } });
s2.addText("PROBLEM", { x: 0.95, y: 2.95, w: 3, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 2, margin: 0 });
s2.addText("문제 정의", { x: 0.95, y: 3.25, w: 3.7, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s2.addText("개인 투자자의 80%가 감정적 판단으로 손실을 경험합니다. FOMO, 공포 매도, 과신 매수 등 심리적 편향이 반복되지만, 이를 객관적으로 인지할 수 있는 도구가 부재합니다.", { x: 0.95, y: 3.7, w: 3.7, h: 1.3, fontSize: 12, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.5, margin: 0 });

s2.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 2.8, w: 4.2, h: 2.4, fill: { color: C.white }, shadow: makeShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 2.8, w: 4.2, h: 0.06, fill: { color: C.mint } });
s2.addText("SOLUTION", { x: 5.35, y: 2.95, w: 3, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.mint, bold: true, charSpacing: 2, margin: 0 });
s2.addText("솔루션 정의", { x: 5.35, y: 3.25, w: 3.7, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s2.addText("매일 감정 상태 + 바이오리듬을 기반으로 AI 투자 리포트를 생성합니다. 투자 무드 등급(A~F), 판단 모드, 감정 흔들림 지수를 제공하여 자기 점검 루틴을 형성합니다.", { x: 5.35, y: 3.7, w: 3.7, h: 1.3, fontSize: 12, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.5, margin: 0 });

// ========== SLIDE 3: Persona ==========
let s3 = pres.addSlide();
s3.background = { color: C.light };
s3.addText("USER RESEARCH", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s3.addText("타겟 유저 & 페르소나", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

// Persona 1
s3.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.6, w: 8.6, h: 1.7, fill: { color: C.white }, shadow: makeShadow() });
s3.addShape(pres.shapes.OVAL, { x: 1.0, y: 1.85, w: 0.9, h: 0.9, fill: { color: C.purpleBg } });
s3.addText("👨‍💼", { x: 1.0, y: 1.85, w: 0.9, h: 0.9, fontSize: 32, align: "center", valign: "middle" });
s3.addText("김민수 (29세)", { x: 2.2, y: 1.75, w: 4, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s3.addText("직장인 · 주식 투자 2년차", { x: 2.2, y: 2.05, w: 4, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, margin: 0 });
s3.addText("퇴근 후 주식 앱을 자주 확인하며, 커뮤니티 분위기에 영향을 많이 받음. 지난달 FOMO로 고점 매수 후 -15% 손실 경험.", { x: 2.2, y: 2.4, w: 6.8, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.sub, margin: 0 });
s3.addShape(pres.shapes.RECTANGLE, { x: 2.2, y: 2.9, w: 6.8, h: 0.3, fill: { color: C.purpleBg } });
s3.addText("\"오늘 사야 할까 말아야 할까... 매번 고민하다 타이밍을 놓쳐요.\"", { x: 2.35, y: 2.9, w: 6.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.purple, italic: true, margin: 0 });

// Persona 2
s3.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 3.6, w: 8.6, h: 1.7, fill: { color: C.white }, shadow: makeShadow() });
s3.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.85, w: 0.9, h: 0.9, fill: { color: C.mintBg } });
s3.addText("👩‍🎓", { x: 1.0, y: 3.85, w: 0.9, h: 0.9, fontSize: 32, align: "center", valign: "middle" });
s3.addText("이서연 (25세)", { x: 2.2, y: 3.75, w: 4, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s3.addText("대학원생 · 소액 투자 초보", { x: 2.2, y: 4.05, w: 4, h: 0.25, fontSize: 11, fontFace: "Arial", color: C.mint, bold: true, margin: 0 });
s3.addText("월 30만원으로 적금과 주식 사이에서 고민 중. 투자에 관심은 있지만 자신의 성향을 모르겠음.", { x: 2.2, y: 4.4, w: 6.8, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.sub, margin: 0 });
s3.addShape(pres.shapes.RECTANGLE, { x: 2.2, y: 4.9, w: 6.8, h: 0.3, fill: { color: C.mintBg } });
s3.addText("\"적금이랑 주식이랑 뭐가 더 나은지 비교해보고 싶어요.\"", { x: 2.35, y: 4.9, w: 6.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: "065F46", italic: true, margin: 0 });

// ========== SLIDE 4: IA ==========
let s4 = pres.addSlide();
s4.background = { color: C.light };
s4.addText("INFORMATION ARCHITECTURE", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s4.addText("정보 구조도 (IA)", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s4.addText("핵심 기능 중심으로 3-depth 이내의 플랫 구조를 설계했습니다.", { x: 0.7, y: 1.35, w: 8, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.sub, margin: 0 });

// Root
s4.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 1.9, w: 3, h: 0.55, fill: { color: C.purple } });
s4.addText("Dear,ANT", { x: 3.5, y: 1.9, w: 3, h: 0.55, fontSize: 16, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });

// Level 1
const l1 = [
  { name: "홈", path: "/" },
  { name: "설문", path: "/survey" },
  { name: "리포트", path: "/result/[id]" },
  { name: "히스토리", path: "/history" },
];
l1.forEach((item, i) => {
  const x = 0.5 + i * 2.35;
  s4.addShape(pres.shapes.RECTANGLE, { x, y: 2.8, w: 2.1, h: 0.7, fill: { color: C.white }, line: { color: C.purpleLight, width: 1.5 } });
  s4.addText(item.name, { x, y: 2.8, w: 2.1, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.purple, bold: true, align: "center", margin: 0 });
  s4.addText(item.path, { x, y: 3.15, w: 2.1, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
});

// Level 2
const l2 = [
  { name: "트레이딩 저널", path: "/memo" },
  { name: "적금 vs 투자", path: "/calculator" },
  { name: "복리 계산기", path: "/compound" },
  { name: "도구 모음", path: "/tools" },
];
l2.forEach((item, i) => {
  const x = 0.5 + i * 2.35;
  s4.addShape(pres.shapes.RECTANGLE, { x, y: 3.85, w: 2.1, h: 0.7, fill: { color: C.white }, line: { color: C.mintLight, width: 1.5 } });
  s4.addText(item.name, { x, y: 3.85, w: 2.1, h: 0.4, fontSize: 12, fontFace: "Arial", color: "065F46", bold: true, align: "center", margin: 0 });
  s4.addText(item.path, { x, y: 4.2, w: 2.1, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
});

// Level 3 - Memo tabs
const l3 = ["전체 메모", "포트폴리오", "감정 분석"];
l3.forEach((name, i) => {
  const x = 1.2 + i * 2.35;
  s4.addShape(pres.shapes.RECTANGLE, { x, y: 4.9, w: 2.1, h: 0.5, fill: { color: C.purpleBg } });
  s4.addText(name, { x, y: 4.9, w: 2.1, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.purple, align: "center", valign: "middle" });
});

// ========== SLIDE 5: User Flow ==========
let s5 = pres.addSlide();
s5.background = { color: C.light };
s5.addText("USER FLOW", { x: 0.7, y: 0.4, w: 5, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s5.addText("핵심 사용자 플로우", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
s5.addText("3분 이내에 완료 가능한 메인 플로우를 설계했습니다.", { x: 0.7, y: 1.35, w: 8, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.sub, margin: 0 });

// Main flow
s5.addText("메인 플로우: 투자 리포트 생성", { x: 0.7, y: 1.9, w: 8, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const flow = ["홈 진입", "CTA 클릭", "생년월일\n입력", "기분 선택", "7개 설문", "AI 분석", "리포트\n확인"];
flow.forEach((step, i) => {
  const x = 0.3 + i * 1.35;
  const isActive = [1, 4, 6].includes(i);
  s5.addShape(pres.shapes.RECTANGLE, { x, y: 2.4, w: 1.15, h: 0.8, fill: { color: isActive ? C.purple : C.white }, line: isActive ? undefined : { color: C.purpleLight, width: 1 } });
  s5.addText(step, { x, y: 2.4, w: 1.15, h: 0.8, fontSize: 10, fontFace: "Arial", color: isActive ? C.white : C.purple, bold: true, align: "center", valign: "middle" });
  if (i < flow.length - 1) {
    s5.addText("→", { x: x + 1.15, y: 2.55, w: 0.2, h: 0.4, fontSize: 14, color: C.muted, align: "center", valign: "middle" });
  }
});

// Sub flow
s5.addText("서브 플로우: 트레이딩 저널", { x: 0.7, y: 3.6, w: 8, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const flow2 = ["저널 진입", "메모 작성", "종목/액션\n선택", "전략 태그", "감정\n자동 연결", "패턴 분석"];
flow2.forEach((step, i) => {
  const x = 0.5 + i * 1.5;
  const isActive = [1, 4].includes(i);
  s5.addShape(pres.shapes.RECTANGLE, { x, y: 4.1, w: 1.3, h: 0.8, fill: { color: isActive ? C.mint : C.white }, line: isActive ? undefined : { color: C.mintLight, width: 1 } });
  s5.addText(step, { x, y: 4.1, w: 1.3, h: 0.8, fontSize: 10, fontFace: "Arial", color: isActive ? C.white : "065F46", bold: true, align: "center", valign: "middle" });
  if (i < flow2.length - 1) {
    s5.addText("→", { x: x + 1.3, y: 4.25, w: 0.2, h: 0.4, fontSize: 14, color: C.muted, align: "center", valign: "middle" });
  }
});

// ========== SLIDE 6: Wireframes ==========
let s6 = pres.addSlide();
s6.background = { color: C.dark };
s6.addText("WIREFRAME & UI DESIGN", { x: 0.7, y: 0.3, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purpleLight, bold: true, charSpacing: 3 });
s6.addText("화면 설계", { x: 0.7, y: 0.65, w: 8, h: 0.5, fontSize: 28, fontFace: "Arial", color: C.white, bold: true, margin: 0 });

// Phone frame 1 - Home
const phones = [
  { x: 0.4, label: "Home", items: ["🐜 캐릭터", "Dear,ANT 타이틀", "오늘의 투자 리포트 받기 CTA", "히스토리 | 트레이딩 저널", "적금vs투자 | 복리 계산기"] },
  { x: 3.55, label: "Survey", items: ["← 돌아가기", "기분 선택 (5가지 이모티콘)", "불안 · 초조 · 평온 · 설렘 · 자신감", "Q1~Q7 행동 시나리오 질문", "선택지 3~4개 (점수 매핑)"] },
  { x: 6.7, label: "Report", items: ["투자 무드 등급 A~F 카드", "판단 모드 (방어/관망/신중/적극)", "감정 흔들림 지수 0~100%", "바이오리듬 차트 (신체/감정/지성)", "오늘의 한마디 & 키워드"] },
];

phones.forEach((phone) => {
  s6.addShape(pres.shapes.RECTANGLE, { x: phone.x, y: 1.25, w: 2.95, h: 4.1, fill: { color: C.white }, line: { color: C.border, width: 1 } });
  s6.addShape(pres.shapes.RECTANGLE, { x: phone.x, y: 1.25, w: 2.95, h: 0.45, fill: { color: "F1F5F9" } });
  s6.addText(phone.label, { x: phone.x, y: 1.25, w: 2.95, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, align: "center", valign: "middle" });

  phone.items.forEach((item, i) => {
    s6.addShape(pres.shapes.RECTANGLE, { x: phone.x + 0.15, y: 1.85 + i * 0.6, w: 2.65, h: 0.5, fill: { color: i === 0 ? C.purpleBg : "F8FAFC" } });
    s6.addText(item, { x: phone.x + 0.25, y: 1.85 + i * 0.6, w: 2.45, h: 0.5, fontSize: 10, fontFace: "Arial", color: C.text, valign: "middle", margin: 0 });
  });
});

// ========== SLIDE 7: Feature Spec ==========
let s7 = pres.addSlide();
s7.background = { color: C.light };
s7.addText("FEATURE SPECIFICATION", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s7.addText("핵심 기능 상세 기획", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

// Feature cards
const features = [
  { title: "AI 투자 성향 리포트", desc: "바이오리듬(23/28/33일 주기) + 감정 상태를 조합하여 투자 무드 등급(A~F), 판단 모드, 흔들림 지수를 산출합니다.", tags: ["감정 분석", "바이오리듬", "A~F 등급"], color: C.purple, bgColor: C.purpleBg },
  { title: "트레이딩 저널", desc: "매매 기록에 당시 감정 상태가 자동 연동됩니다. 전체 메모, 포트폴리오, 감정 분석 3개 탭으로 구성.", tags: ["매매 기록", "감정 자동 연결", "패턴 분석"], color: C.mint, bgColor: C.mintBg },
  { title: "적금 vs 투자 비교 계산기", desc: "적금(단리+이자소득세 15.4%)과 주식(복리+금투세 22%)을 4가지 시나리오로 세금 반영 비교.", tags: ["세금 반영", "4가지 시나리오", "의사결정 지원"], color: C.blue, bgColor: C.blueBg },
  { title: "복리 계산기", desc: "초기 투자금+월 추가 투자+수익률+기간 설정 시 연도별 자산 성장 그래프와 원금 대비 수익 시각화.", tags: ["시각화", "연도별 시뮬레이션"], color: C.amber, bgColor: C.amberBg },
];

features.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 4.4;
  const y = 1.55 + row * 2;

  s7.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.2, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
  s7.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.8, fill: { color: f.color } });
  s7.addText(f.title, { x: x + 0.25, y: y + 0.1, w: 3.7, h: 0.35, fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
  s7.addText(f.desc, { x: x + 0.25, y: y + 0.5, w: 3.7, h: 0.8, fontSize: 11, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.4, margin: 0 });
  f.tags.forEach((tag, ti) => {
    s7.addShape(pres.shapes.RECTANGLE, { x: x + 0.25 + ti * 1.35, y: y + 1.35, w: 1.25, h: 0.3, fill: { color: f.bgColor } });
    s7.addText(tag, { x: x + 0.25 + ti * 1.35, y: y + 1.35, w: 1.25, h: 0.3, fontSize: 9, fontFace: "Arial", color: f.color, align: "center", valign: "middle", bold: true });
  });
});

// ========== SLIDE 8: Grade Spec ==========
let s8 = pres.addSlide();
s8.background = { color: C.light };
s8.addText("FEATURE SPECIFICATION", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s8.addText("투자 무드 등급 체계", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

const grades = [
  { grade: "A", mood: "매우 좋음", action: "적극적 매매 가능", color: "16A34A", bg: "DCFCE7" },
  { grade: "B", mood: "좋음", action: "안정적 판단 가능", color: "2563EB", bg: "DBEAFE" },
  { grade: "C", mood: "보통", action: "신중한 접근 필요", color: "D97706", bg: "FEF3C7" },
  { grade: "D", mood: "주의", action: "감정적 판단 자제", color: "EA580C", bg: "FED7AA" },
  { grade: "F", mood: "위험", action: "매매 쉬어가기 권장", color: "DC2626", bg: "FEE2E2" },
];

// Table header
s8.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.55, w: 8.6, h: 0.5, fill: { color: C.purple } });
s8.addText("등급", { x: 0.7, y: 1.55, w: 1.5, h: 0.5, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText("투자 무드", { x: 2.2, y: 1.55, w: 3, h: 0.5, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText("권장 행동", { x: 5.2, y: 1.55, w: 4.1, h: 0.5, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });

grades.forEach((g, i) => {
  const y = 2.05 + i * 0.6;
  const bgColor = i % 2 === 0 ? "F8FAFC" : C.white;
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 8.6, h: 0.6, fill: { color: bgColor } });
  s8.addShape(pres.shapes.OVAL, { x: 1.2, y: y + 0.1, w: 0.4, h: 0.4, fill: { color: g.bg } });
  s8.addText(g.grade, { x: 1.2, y: y + 0.1, w: 0.4, h: 0.4, fontSize: 16, fontFace: "Arial Black", color: g.color, align: "center", valign: "middle" });
  s8.addText(g.mood, { x: 2.2, y, w: 3, h: 0.6, fontSize: 13, fontFace: "Arial", color: C.text, align: "center", valign: "middle" });
  s8.addText(g.action, { x: 5.2, y, w: 4.1, h: 0.6, fontSize: 13, fontFace: "Arial", color: C.sub, align: "center", valign: "middle" });
});

// Formula
s8.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 5.1 - 0.3, w: 8.6, h: 0.6, fill: { color: C.purpleBg } });
s8.addText("산출 공식:  combined = totalScore × 0.4 + (100 - moodScore) × 0.6", { x: 0.7, y: 5.1 - 0.3, w: 8.6, h: 0.6, fontSize: 12, fontFace: "Arial", color: C.purple, align: "center", valign: "middle", bold: true });

// ========== SLIDE 9: Design System ==========
let s9 = pres.addSlide();
s9.background = { color: C.light };
s9.addText("DESIGN DECISION", { x: 0.7, y: 0.4, w: 8, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.purple, bold: true, charSpacing: 3 });
s9.addText("디자인 시스템 & 벤치마킹", { x: 0.7, y: 0.75, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });

// Color swatches
s9.addText("컬러 시스템", { x: 0.7, y: 1.55, w: 4, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
const colors = [
  { color: C.purple, label: "Purple (Primary)" },
  { color: C.purpleLight, label: "Purple Light" },
  { color: C.mintLight, label: "Mint (Accent)" },
  { color: C.dark, label: "Dark (Text)" },
  { color: C.border, label: "Slate (BG)" },
];
colors.forEach((c, i) => {
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.7 + i * 1.7, y: 2.0, w: 0.6, h: 0.6, fill: { color: c.color } });
  s9.addText(c.label, { x: 0.7 + i * 1.7, y: 2.65, w: 1.5, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.sub, margin: 0 });
});

// Mascot
s9.addText("마스코트: 개미 캐릭터 (5표정)", { x: 0.7, y: 3.15, w: 4, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0 });
const expressions = ["😊 Happy", "🤔 Thinking", "🤩 Excited", "😟 Worried", "😎 Cool"];
expressions.forEach((exp, i) => {
  s9.addShape(pres.shapes.OVAL, { x: 0.7 + i * 1.7, y: 3.6, w: 0.8, h: 0.8, fill: { color: C.purpleBg } });
  s9.addText(exp.split(" ")[0], { x: 0.7 + i * 1.7, y: 3.6, w: 0.8, h: 0.8, fontSize: 28, align: "center", valign: "middle" });
  s9.addText(exp.split(" ")[1], { x: 0.5 + i * 1.7, y: 4.45, w: 1.2, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.sub, align: "center", margin: 0 });
});

// Benchmarking
s9.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.85, w: 8.6, h: 0.65, fill: { color: C.white }, shadow: makeShadow() });
s9.addText([
  { text: "벤치마킹: ", options: { bold: true, color: C.dark } },
  { text: "TraderSync · Edgewonk · TraderVue", options: { color: C.sub } },
  { text: "    →  차별점: 감정 × 바이오리듬 자동 연동", options: { bold: true, color: C.purple } },
], { x: 1.0, y: 4.85, w: 8, h: 0.65, fontSize: 13, fontFace: "Arial", valign: "middle" });

// ========== WRITE ==========
pres.writeFile({ fileName: "/Users/jeongbin/dear.ant/public/portfolio/1_planning.pptx" })
  .then(() => console.log("1_planning.pptx created"))
  .catch(err => console.error(err));
