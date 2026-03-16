# Dear,ANT 🐜

> 당신만을 위한 오늘의 투자 판단 리포트

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://dear-ant.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**Dear,ANT**는 개미 투자자의 오늘 감정 상태와 투자 성향을 분석하여, 나만의 투자 판단 리포트를 생성해주는 서비스입니다.

🔗 **Live Demo**: [dear-ant.vercel.app](https://dear-ant.vercel.app)

---

## ✨ 주요 기능

### 📊 투자 판단 리포트
오늘의 기분과 7가지 투자 성향 질문에 답하면, AI가 분석한 맞춤 리포트를 받아보세요.

- **판단 모드** — 방어 / 관망 / 신중 / 적극
- **감정 흔들림 지수** — 0~100 스케일로 감정 변동성 시각화
- **리스크 성향** — 낮음 / 중간 / 높음
- **바이오리듬 분석** — 생년월일 기반 신체·감정·지성 리듬
- **투자 등급** — S / A / B / C / D / F
- **Dear,ANT 편지** — 오늘의 투자 판단에 대한 개인화 메시지

### 📈 리포트 대시보드
과거 리포트를 한눈에 비교하고 나의 투자 성향 변화를 추적합니다.

- 투자 무드 & 감정 변동성 **트렌드 차트**
- 평균 감정 점수, 최다 판단 모드, 최고 등급 **통계 요약**
- 이전 리포트와의 **등급·모드·점수 비교**

### 📝 주식 메모장
종목별 매매 기록과 투자 메모를 관리하는 3탭 서비스입니다.

- **전체 메모** — 매수 / 매도 / 보유 / 관심 카테고리별 CRUD
- **포트폴리오** — 종목별 총 매수·매도 금액, 평균 단가 요약
- **감정 분석** — 매매 시점의 투자 무드 패턴 분석 & 인사이트

### 🧮 적금 vs 투자 계산기
같은 금액을 적금과 주식에 넣었을 때 어떤 게 유리한지 비교합니다.

- **적금** — 적립식 단리 + 이자소득세 15.4% 반영
- **주식** — 월 적립식(DCA) 복리 + 금투세(250만 공제, 22%) 반영
- **4가지 시나리오** — 낙관 / 기대 / 보수 / 최악
- **한눈에 비교** — 원금, 기대수익, 최악시, 원금보장, 확정성

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS 4 |
| **Database** | Supabase (PostgreSQL) / In-memory fallback |
| **Deploy** | Vercel |

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈
│   ├── survey/page.tsx       # 설문 (기분 + 투자성향 질문)
│   ├── result/[id]/page.tsx  # 리포트 결과
│   ├── history/page.tsx      # 대시보드 + 히스토리
│   ├── memo/page.tsx         # 주식 메모장 (3탭)
│   ├── calculator/page.tsx   # 적금 vs 투자 계산기
│   └── api/
│       ├── reports/          # 리포트 생성·조회
│       ├── history/          # 리포트 목록
│       └── memos/            # 메모 CRUD
├── components/
│   └── AntCharacter.tsx      # 개미 캐릭터 SVG
└── lib/
    ├── report-engine.ts      # 리포트 생성 엔진
    ├── questions.ts          # 투자 성향 질문 데이터
    ├── local-store.ts        # In-memory 스토어
    ├── supabase.ts           # Supabase 클라이언트
    └── types.ts              # TypeScript 타입 정의
```

---

## 🚀 시작하기

### 설치 및 실행

```bash
git clone https://github.com/jeongbaaaan/dear-ant.git
cd dear-ant
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수 (선택)

Supabase를 연동하려면 `.env.local` 파일을 생성하세요.
설정하지 않아도 In-memory 모드로 정상 작동합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📄 License

MIT

