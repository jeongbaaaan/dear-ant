# Dear,ANT UI 전면 리디자인 스펙

## Purpose

Dear,ANT의 UI를 토스 스타일 디자인 언어로 전면 리디자인한다. 현재 초록 모노톤 + 좁은 모바일 레이아웃을 데스크톱 퍼스트 + 중립 배경 + 포인트 컬러 시스템으로 전환하여 시각적 위계, 정보 밀도, 인터랙티브 경험을 개선한다.

### 완료 기준

- [ ] 디자인 토큰(타이포, 여백, 표면, 엘리베이션) 전면 교체
- [ ] 공통 컴포넌트(카드, 버튼, 인풋, 네비, 빈 상태) 리팩터
- [ ] 8개 페이지 전체 레이아웃 + 기능 개선 완료
- [ ] `/report` + `/history` 통합, `/tools` 허브 삭제
- [ ] 인터랙션 7종 전체 적용
- [ ] 데스크톱(1024px+) + 태블릿(768-1023px) + 모바일(~767px) 반응형 동작

---

## 1. Design Tokens

### 1.1 Typography

| 역할 | 현재 | 변경 |
|------|------|------|
| Hero | 24px / Bold / #006b1b | 28px / ExtraBold(800) / #191919, letter-spacing: -0.5px |
| Section Title | 18px / Bold / #1a3d1f | 20px / Bold(700) / #191919 |
| Subtitle | 14px / Medium / #4a6b4f | 15px / Medium(500) / #666 |
| Body | 14px / Regular / #2d5a34 | 15px / Regular(400) / #333, line-height: 1.6 |
| Caption | 12px / Regular / #6b8f70 | 13px / Regular(400) / #999 |
| Label | — | 11px / Bold(700) / uppercase, letter-spacing: 1.5px |

**규칙:** 제목은 검정(#191919), 보조 텍스트는 회색(#666~#999). 초록색 글자는 수치 강조와 CTA 텍스트에만 사용.

### 1.2 Spacing

| 역할 | 현재 | 변경 |
|------|------|------|
| 섹션 간격 | 12-24px (불균일) | 40px 고정 |
| 카드 패딩 | 16-20px | 24-32px |
| 페이지 패딩 | 24px | 데스크톱 48px / 모바일 20px |
| 요소 간격 | 8-12px | 16px 기본값 |

### 1.3 Surfaces

| 레이어 | 현재 | 변경 |
|--------|------|------|
| 배경 | #ddffe2 (민트그린) | #f7f7f7 (밝은 그레이) |
| 카드 | #ffffff + 연초록 보더 | #ffffff + 미세 쉐도우 |
| 강조카드 | #bef5ca | #ffffff + 깊은 쉐도우 |
| 인풋 | #f0faf1 + 초록 보더 | #fafafa + #e8e8e8 보더, focus: #006b1b 보더 + 3px ring |
| 액센트 | — | #e8f5e9 (초록은 여기만) |
| CTA | — | linear-gradient(135deg, #006b1b, #008a24) |

### 1.4 Elevation (Shadow)

| 레벨 | 변경 |
|------|------|
| Level 0 (Flat) | border: 1px solid #f0f0f0 |
| Level 1 (Raised) | 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04) |
| Level 2 (Elevated) | 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04) |

**규칙:** 초록빛 쉐도우 전부 제거. 중립 블랙 쉐도우만 사용.

### 1.5 Color Usage Rules

- **Primary (#006b1b):** CTA 버튼, 활성 네비, 긍정 수치, 뱃지(적극), 프로그레스 바
- **Error (#c62828):** 손실, 매도, 방어 모드, 위험 경고
- **Amber (#f57f17):** 신중 모드, 보유, 주의
- **Blue (#1565c0):** 관망 모드, 관심 종목, 지성 바이오리듬
- **Gray (#666~#999):** 보조 텍스트, 비활성 상태
- **배경에 초록 사용 금지.** 초록은 포인트로만.

---

## 2. Component System

### 2.1 Cards

```
Card variants:
- card-flat:     border: 1px solid #f0f0f0, no shadow
- card-raised:   shadow level 1 (기본 카드)
- card-elevated: shadow level 2 (CTA, 강조)
- card-accent:   bg gradient #006b1b→#008a24, white text

All cards: border-radius 16px, padding 24px
```

### 2.2 Buttons

```
btn-primary:   bg #006b1b, color #fff, radius 12px, padding 12px 24px
btn-secondary: bg #f0f0f0, color #333
btn-ghost:     bg transparent, color #006b1b
btn-danger:    bg #fff0ed, color #d32f2f
btn-chip:      radius 20px, padding 8px 16px, font-size 13px
  .active:     bg #006b1b, color #fff
  :not(.active): bg #f0f0f0, color #666
btn-lg:        padding 16px 32px, font-size 16px

All buttons: font-weight 700, active: scale(0.97), transition 0.15s
```

### 2.3 Inputs

```
input-field:   radius 12px, border 1.5px solid #e8e8e8, bg #fafafa
  :focus:      border-color #006b1b, bg #fff, box-shadow 0 0 0 3px rgba(0,107,27,0.08)
  ::placeholder: color #ccc

input-with-unit: input-field + absolute positioned unit label (right: 16px)

chip-selector:
  chip-default:  bg #f5f5f5, color #666, border 1.5px solid #f0f0f0
  chip-selected: bg #e8f5e9, color #006b1b, border 1.5px solid #006b1b
  All chips: radius 24px, padding 10px 18px, font-weight 600
```

### 2.4 Slider (신규)

```
slider-group:
  slider-header: flex justify-between
    slider-label: 13px, 600, #666
    slider-value: 16px, 800, #006b1b (클릭 시 인풋 전환)
  <input type="range">: height 6px, bg #e8e8e8, radius 3px
    ::-webkit-slider-thumb: 20px circle, bg #006b1b, shadow
  slider-marks: flex justify-between, 11px, #ccc

양방향 바인딩: 슬라이더 드래그 ↔ 값 텍스트 클릭→인풋 입력 동기화
```

### 2.5 Navigation

**데스크톱 — 사이드바 (240px fixed)**

```
sidebar: width 240px, bg #fff, border-right 1px solid #f0f0f0
  sidebar-logo: icon (32px, bg #006b1b, radius 10px) + "Dear,ANT" text
  nav-section: margin-bottom 24px
    nav-section-label: 11px, uppercase, letter-spacing 1.5px, #ccc
    nav-link: flex, gap 12px, padding 10px 12px, radius 10px
      .active: bg #006b1b, color #fff, icon FILL 1
      :hover: bg #f7f7f7

Menu 섹션: 홈, 리포트, 트레이딩 저널
Tools 섹션: 적금 vs 투자, 복리 계산기, 매매 시뮬레이터
```

**모바일 — 바텀 네비 (56px)**

```
bottom-nav: fixed bottom, bg #fff, shadow 0 -1px 12px rgba(0,0,0,0.06)
  nav-item: flex column, gap 4px
    icon: 22px, #bbb
    label: 11px, 600, #bbb
    .active: bg #006b1b, color #fff, icon FILL 1, radius 12px

탭 4개: 홈, 리포트, 저널, 더보기(tools 접근)
```

### 2.6 Badges

```
badge: padding 4px 10px, radius 8px, font-size 12px, weight 700
  badge-green: bg #e8f5e9, color #006b1b  (적극, 매수, Buy)
  badge-amber: bg #fff8e1, color #f57f17  (신중, 보유, Hold)
  badge-red:   bg #fce4ec, color #c62828  (방어, 매도, Sell)
  badge-blue:  bg #e3f2fd, color #1565c0  (관망, 관심, Watch)
  badge-gray:  bg #f5f5f5, color #666     (등급, 기타)
```

### 2.7 Empty State

```
empty-state: text-align center, padding 64px 24px
  empty-icon: font-size 56px, opacity 0.25 (이모지)
  empty-title: 18px, 700, #333
  empty-desc: 14px, #999, line-height 1.6
  CTA button: btn-primary btn-lg, margin 0 auto
```

### 2.8 Data Table (데스크톱)

```
data-table: width 100%, border-collapse
  th: padding 12px 16px, 12px, 600, #999, uppercase, border-bottom #f0f0f0
  td: padding 14px 16px, 14px, border-bottom #f7f7f7
  tr:hover: bg #fafafa
  .highlight: bg #f0faf1 (결과 행)

모바일 전환: 테이블 → 리스트 카드 (list-item 컴포넌트)
```

### 2.9 Section Header

```
section-header: flex justify-between, align-items center, margin-bottom 16px
  section-title: 20px, 700
  section-more: 14px, #999, 500, flex align-items center, gap 2px
    + chevron_right icon 16px
    :hover: color #666
```

### 2.10 Section Divider (토스 스타일)

```
divider: height 8px, bg #f2f2f2, margin 0 -24px (카드 내부 섹션 분리용)
```

---

## 3. Interactions

### 3.1 숫자 카운트업

- **적용 위치:** 홈 Stats, 포트폴리오 금액, 리포트 컨디션 점수, 계산기 결과
- **동작:** 페이지 진입 또는 값 변경 시 0 → 목표값으로 800ms ease-out 카운팅
- **구현:** 기존 `useCountUp` 훅 확장. IntersectionObserver로 뷰포트 진입 시 트리거.

### 3.2 스파크라인

- **적용 위치:** 홈 Stats 카드, 리포트 목록 Stats
- **동작:** KPI 숫자 아래에 12일치 미니 라인차트 (높이 24px)
- **구현:** 인라인 SVG `<polyline>`. 데이터는 최근 리포트/거래 기록에서 추출.

### 3.3 실시간 슬라이더 + 직접 입력

- **적용 위치:** 적금vs투자 (월투자금, 이자율), 복리계산기 (4개 파라미터), 매매시뮬레이터
- **동작:** 슬라이더 드래그 시 결과 즉시 재계산. 값 텍스트 클릭 시 인풋 모드 전환, 직접 입력 가능. 양방향 동기화.
- **구현:** React state 양방향 바인딩. `onChange` 이벤트로 debounce 없이 즉시 반영.

### 3.4 Hover Reveal

- **적용 위치:** 바이오리듬 차트, 컨디션 추이 차트, 연도별 복리 차트, 주간 거래량 차트
- **동작:** 차트 위 마우스 호버 시 해당 데이터 포인트의 정확한 수치를 툴팁으로 표시
- **구현:** SVG `<circle>` 포인트에 `onMouseEnter` → absolute positioned 툴팁 div

### 3.5 Skeleton Shimmer

- **적용 위치:** 모든 데이터 로딩 구간
- **동작:** 로딩 시 카드/텍스트 형태의 회색 블록 + shimmer 애니메이션 → 데이터 로드 완료 시 opacity fade-in (200ms)
- **구현:** 기존 `Skeleton.tsx` 확장. 각 페이지에 skeleton 레이아웃 추가.

### 3.6 Progressive Disclosure

- **적용 위치:** 리포트 상세 (바이오리듬 상세, 셀프체크 원본 답변), 계산기 상세 내역
- **동작:** 기본 뷰에는 핵심 지표만 표시. "상세 보기" 클릭 시 accordion 확장 (300ms ease)
- **구현:** `useState` boolean + CSS max-height transition

### 3.7 감정 칩 바운스

- **적용 위치:** 셀프체크 감정 선택, 모든 칩 선택기
- **동작:** 칩 선택 시 scale(1 → 1.05 → 1) 바운스 (150ms). 선택 해제 시 부드러운 색상 전환.
- **구현:** CSS `@keyframes chipBounce` + `animation` on `.selected` class toggle

---

## 4. Page Specifications

### 4.1 홈 (`/`)

**레이아웃:** 사이드바 + 메인 (max-width 1100px)

**섹션 순서:**

1. **Greeting** — 날짜 + 인사 + "오늘 투자 컨디션은 어떤가요?" (28px/800)
2. **Hero CTA** — 그린 그라데이션 카드, "오늘의 투자 판단 리포트 받기", 화살표 버튼. 전체 클릭 → `/survey`
3. **Stats Row (4컬럼)** — 총 리포트 (+스파크라인) / 평균 컨디션 (+스파크라인) / 누적 수익률 / 거래 기록. 모든 숫자 카운트업.
4. **2컬럼: 최근 리포트 + 이번 주 활동** — 왼: 원형 게이지(78/100) + 모드 뱃지 + 한줄 설명. 우: 주간 바 차트 (월~금)
5. **투자 도구 (3컬럼)** — 적금vs투자, 복리계산기, 매매시뮬레이터 카드
6. **2컬럼: 포트폴리오 + 최근 기록** — 왼: 종목별 평단가+손익 리스트. 우: 리포트/거래 타임라인

**기능 변경:** 없음 (레이아웃+UI만 변경)

### 4.2 셀프체크 (`/survey`)

**레이아웃:** 사이드바 + 메인 (max-width 720px, 중앙 정렬)

**섹션 순서:**

1. **Progress** — 스텝 표시 (1/3) + 프로그레스 바 + 스텝 pill 3개 (셀프 체크 → 투자 성향 Q&A → 리포트 생성)
2. **Title** — "매매 전 셀프 체크" (28px/800) + 안내 문구
3. **생년월일** — YYYY/MM/DD 3칸 인풋
4. **실시간 컨디션 게이지** — 선택할 때마다 원형 게이지 업데이트 (0→100%)
5. **카테고리 1: 컨디션 (💚)** — 수면, 컨디션, 카페인 (3문항)
6. **카테고리 2: 심리 (💛)** — 손실만회 욕구, 근거없는 확신, FOMO, 오늘의 감정 (4문항)
7. **카테고리 3: 외부 영향 (💙)** — SNS, 종목 추천, 뉴스 시청 (3문항)
8. **하단 고정 액션바** — 돌아가기 + 다음 단계 버튼

**기능 변경:**
- 기존 단계별 분리(1/3→2/3→3/3) → 데스크톱에서는 한 화면에 전체 표시 (스크롤)
- 모바일에서는 기존 단계별 유지 가능 (반응형)
- 실시간 컨디션 게이지 신규 추가

### 4.3 리포트 상세 (`/result/[id]`)

**레이아웃:** 사이드바 + 메인 (max-width 960px)

**섹션 순서:**

1. **Back link** — "← 리포트 목록"
2. **Header** — 날짜 + "Dear,ANT Report" (32px/800) + 뱃지들 (모드, 등급, 리스크)
3. **Hero Score 카드** — 그린 그라데이션. 3컬럼: 원형 게이지(점수/100, 카운트업) + 진단 메시지 + Grade 원형
4. **3컬럼 Stats** — 투자 판단 모드 / 리스크 경향 / 감정 안정도
5. **2컬럼: 바이오리듬 + 리스크·판단모드**
   - 왼: SVG 3색 웨이브 차트 (신체/감정/지성) + 오늘 마커 + hover reveal + "상세 보기" progressive disclosure
   - 우상: 리스크 경향 바 (낮음/중간/높음 그라데이션)
   - 우하: 판단 모드 아이콘 카드
6. **키워드** — pill 형태 (#안정적, #집중력 높음 등). primary(초록) + default(회색)
7. **오늘의 편지** — Dear,ANT 아바타 + 편지 형식. 개인화된 투자 조언 메시지.
8. **액션 버튼** — 공유 / PDF 저장 / 다시 체크하기

**기능 변경:**
- Hero Score 카드 신규 (기존은 정보 나열)
- 편지 섹션의 아바타/레터 형식 신규
- Progressive Disclosure로 바이오리듬 상세 접기/펼치기

### 4.4 리포트 목록 (`/report`) — history 통합

**레이아웃:** 사이드바 + 메인 (max-width 1100px)

**섹션 순서:**

1. **Header** — "리포트" + "새 리포트 받기" 버튼 (우측)
2. **Stats (4컬럼)** — 총 리포트 (+스파크라인), 평균 컨디션 (+스파크라인), 가장 많은 모드, 평균 등급
3. **컨디션 추이 차트** — 에어리어 라인차트, 1주/1개월/3개월 전환 칩. hover reveal.
4. **필터 + 뷰 토글** — 모드별 칩 필터 (전체/적극/신중/관망/방어, 건수 표시) + 리스트/그리드 뷰 토글
5. **데이터 테이블** — 날짜, 판단모드, 컨디션%, 등급, 키워드 컬럼. 날짜 그룹핑 (이번 주/지난 주). 행 클릭 → `/result/[id]`

**구조 변경:**
- `/history` 삭제. `/report`에 통합.
- 기존 `/report`의 "새 리포트 받기" CTA + 기존 `/history`의 타임라인/필터를 하나로.

### 4.5 트레이딩 저널 (`/memo`)

**레이아웃:** 사이드바 + 메인 (max-width 1200px)

**섹션 순서:**

1. **Header** — "트레이딩 저널" + "거래 기록하기" 버튼
2. **Stats (4컬럼)** — 누적 손익 (+%), 총 거래, 승률, 보유 종목
3. **탭** — 거래 기록 / 포트폴리오 / 감정 분석
4. **메인 + 사이드바(360px) 2컬럼:**
   - **메인 (거래 기록 탭):** 필터 칩(전체/매수/매도/관심) + 데이터 테이블 (타입 dot, 종목 아이콘, 유형 뱃지, 수량, 단가, 손익, 날짜)
   - **사이드바:**
     - 포트폴리오 요약 (총 평가금액, 종목별 평단가+손익)
     - 주간 거래량 바 차트 (매수 green + 매도 red 스택)
     - 이번 주 감정 dot grid (월~일, 이모지)
     - 감정 인사이트 pill ("화요일 불안 상태에서 카카오 매도 — 감정적 매도 패턴")

**기능 변경:**
- 메인+사이드바 2컬럼 레이아웃 (기존 탭 전환만으로 접근하던 정보를 동시 표시)
- 감정 인사이트 넛지 신규

### 4.6 적금 vs 투자 (`/calculator`)

**레이아웃:** 사이드바 + 메인, 2컬럼 (입력 패널 + 결과 패널)

**입력 패널:**
- 월 투자금: 슬라이더 + 직접 입력 (10만~500만)
- 투자 기간: 칩 선택 (6개월/1년/2년/5년)
- 적금 이자율: 슬라이더 + 직접 입력 (1%~10%)
- 주식 시나리오: 칩 선택 (안정 8%/보통 15%/공격 25%/대박 50%)

**결과 패널:**
- Hero 결과 카드 (그린 그라데이션, 주식 투자 시 금액)
- 3컬럼: 적금 금액 / 주식 금액 / 차이
- 비교 바 (적금 vs 주식 비율 시각화)

**인터랙션:** 슬라이더/칩 변경 시 결과 즉시 재계산 + 카운트업

### 4.7 복리 계산기 (`/compound`)

**레이아웃:** 사이드바 + 메인, 2컬럼 (입력 패널 + 결과 패널)

**입력 패널:**
- 초기 투자금: 슬라이더 + 직접 입력
- 월 적립금: 슬라이더 + 직접 입력
- 연 수익률: 슬라이더 + 직접 입력 (1%~50%)
- 투자 기간: 슬라이더 + 직접 입력 (1년~30년)

**결과 패널:**
- Hero 결과 카드 (N년 후 예상 자산)
- 3컬럼: 총 원금 / 복리 수익 / 총 수익률
- 연도별 스택 바 차트: 원금(회색) + 복리 수익(초록). hover reveal.
- 인사이트: "복리 수익이 N년차부터 원금을 추월"

**기능 변경:**
- 기존 연도별 테이블 → 스택 바 차트로 대체 (테이블은 progressive disclosure로 접기)

### 4.8 매매 시뮬레이터 (`/tools/simulator`)

**레이아웃:** 사이드바 + 메인, 2컬럼 (입력 패널 + 결과 패널)

**탭:** 수익률 계산 / 물타기 계산

**수익률 계산 탭:**
- 입력: 2컬럼 폼 (매수가+수량, 매도가+수량), 증권사 수수료 칩 (무료/0.015%/0.05%/0.1%), 양도소득세 체크박스
- 결과: Hero 결과 카드 (순수익 + 수익률) + 상세 내역 테이블 (매수금액, 매도금액, 수수료, 거래세, 양도세, 순수익, 손익분기 매도가)

**물타기 계산 탭:**
- 기존 1차 매수 정보 + 추가 매수 행 동적 추가
- 결과: 평균 단가, 총 투자금, 손익분기가

**인터랙션:** 키 입력마다 즉시 재계산 (debounce 없음)

---

## 5. Responsive Strategy

### Breakpoints

```
Desktop:  1024px+  → 사이드바 240px + 메인 콘텐츠
Tablet:   768-1023px → 사이드바 축소(64px 아이콘 레일, 텍스트 숨김, 아이콘만 표시, hover 시 240px 확장) + 메인 콘텐츠
Mobile:   ~767px   → 사이드바 없음 + 바텀 네비 56px
```

### 전환 규칙

| Desktop | Mobile |
|---------|--------|
| 사이드바 240px | 바텀 네비 56px |
| 3-col 카드 그리드 | 1-col 스택 |
| 2-col 레이아웃 | 1-col 스택 |
| 데이터 테이블 | 리스트 카드 |
| 2-col 폼 | 1-col 폼 |
| hover reveal | 탭/클릭 reveal |

**컴포넌트는 동일.** 카드, 버튼, 인풋, 뱃지의 형태/크기는 변하지 않음. 그리드와 네비게이션만 전환.

---

## 6. File Changes

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/globals.css` | 디자인 토큰 전면 교체 (color, spacing, shadow, typography), 신규 animation keyframes |
| `src/app/layout.tsx` | ClientProviders에 사이드바 레이아웃 추가, BottomNav 조건부 렌더링 (모바일만) |
| `src/app/page.tsx` | 홈 전면 리디자인 (greeting, hero CTA, stats row, 2-col sections) |
| `src/app/survey/page.tsx` | 프로그레스 + 스텝 pill, 카테고리 그룹핑, 실시간 게이지, 하단 액션바 |
| `src/app/result/[id]/page.tsx` | hero score 카드, 2-col 바이오리듬+리스크, 키워드, 편지 섹션 |
| `src/app/report/page.tsx` | history 기능 통합, stats+추이차트+필터+데이터 테이블 |
| `src/app/memo/page.tsx` | 메인+사이드바 2-col, 데이터 테이블, 포트폴리오 사이드바, 감정 인사이트 |
| `src/app/calculator/page.tsx` | 슬라이더+직접입력 전환, 비교 바 시각화, 2-col 레이아웃 |
| `src/app/compound/page.tsx` | 슬라이더 4개, 스택 바 차트, 2-col 레이아웃 |
| `src/app/tools/simulator/page.tsx` | 2-col 폼+결과, 수수료 칩, 상세 테이블 |
| `src/components/BottomNav.tsx` | 모바일 전용으로 조건부 렌더링, 4탭(홈/리포트/저널/더보기) |

### 신규 파일

| 파일 | 내용 |
|------|------|
| `src/components/Sidebar.tsx` | 데스크톱 사이드바 네비게이션 |
| `src/components/SliderInput.tsx` | 슬라이더 + 직접 입력 양방향 바인딩 컴포넌트 |
| `src/components/Sparkline.tsx` | 인라인 SVG 미니 라인차트 |
| `src/components/DataTable.tsx` | 데스크톱 데이터 테이블 (반응형: 모바일 → 리스트) |
| `src/components/HoverTooltip.tsx` | 차트 hover reveal 툴팁 |
| `src/components/ConditionGauge.tsx` | 실시간 업데이트 원형 게이지 (셀프체크용) |
| `src/components/TrendChart.tsx` | 에어리어 라인차트 (리포트 목록 컨디션 추이) |
| `src/components/StackBarChart.tsx` | 스택 바 차트 (복리 계산기 연도별) |
| `src/components/CompareBar.tsx` | 적금 vs 주식 비교 바 |
| `src/components/EmotionGrid.tsx` | 주간 감정 dot grid (저널 사이드바) |

### 삭제 파일

| 파일 | 이유 |
|------|------|
| `src/app/history/page.tsx` | `/report`에 통합 |
| `src/app/tools/page.tsx` | 사이드바 직접 링크로 대체 |

---

## 7. Implementation Order

1. **globals.css 디자인 토큰** — 전체 CSS 변수 교체
2. **Sidebar.tsx** — 사이드바 컴포넌트 생성
3. **layout.tsx** — 사이드바 + 반응형 shell 구조
4. **공통 컴포넌트** — SliderInput, Sparkline, DataTable, HoverTooltip, ConditionGauge 등
5. **홈** — page.tsx 전면 리디자인
6. **셀프체크** — survey/page.tsx 리디자인 + 실시간 게이지
7. **리포트 상세** — result/[id]/page.tsx + hero score
8. **리포트 목록** — report/page.tsx + history 통합, history/page.tsx 삭제
9. **저널** — memo/page.tsx + 2-col 레이아웃
10. **적금 vs 투자** — calculator/page.tsx + 슬라이더
11. **복리 계산기** — compound/page.tsx + 슬라이더 + 스택 차트
12. **매매 시뮬레이터** — tools/simulator/page.tsx + 칩 수수료
13. **tools/page.tsx 삭제** + 라우팅 정리
14. **BottomNav.tsx 반응형** — 모바일 전용 조건부 렌더링
15. **인터랙션 마무리** — 카운트업/스파크라인/skeleton 전체 적용 점검

---

## 8. Constraints

- **상추그린(#006b1b) 유지.** 배경/표면에는 사용하지 않고 CTA/뱃지/포인트 수치에만 사용.
- **기존 데이터 구조 변경 없음.** localStorage 스키마, report-engine.ts 로직, API는 그대로.
- **기능 제거 없음.** 모든 기존 기능 유지. UI만 변경하거나 UI+기능을 추가하는 방향.
- **Next.js 16 App Router + TailwindCSS 4 유지.** 새 라이브러리 추가 최소화.
- **Material Symbols Outlined 아이콘 유지.**
- **Manrope 폰트 단일 사용.** Plus Jakarta Sans 제거, Manrope로 통일 (headline 포함).

---

## 9. Decisions

- **데스크톱 퍼스트** — 사용자 요청. 모바일은 반응형으로 대응. (대안: 모바일 퍼스트 — 기각, 사용자 명시적 데스크톱 선호)
- **사이드바 네비** — 토스 웹 스타일. (대안: 탑 네비 — 기각, 페이지 수가 많아 세로 공간 효율적)
- **report+history 통합** — 거의 동일한 중복 페이지. (대안: 분리 유지 — 기각, 기능 중복)
- **tools 허브 삭제** — 사이드바에 직접 링크. (대안: 유지 — 기각, 불필요한 중간 페이지)
- **슬라이더+직접입력 하이브리드** — 대략 조정은 슬라이더, 정확한 값은 직접 입력. (대안: 슬라이더만 — 기각, 사용자 요청으로 직접 입력 추가)
- **중립 배경(#f7f7f7)** — 초록은 포인트로만. (대안: 초록 배경 유지 — 기각, 시각적 위계 부족)

---

## 10. Visual Mockups

브라우저 목업 파일 위치: `.superpowers/brainstorm/84005-1775723306/content/`

| 파일 | 내용 |
|------|------|
| `design-tokens.html` | 디자인 토큰 현재 vs 제안 비교 |
| `components-desktop.html` | 데스크톱 컴포넌트 시스템 전체 |
| `page-home.html` | 홈 페이지 목업 |
| `page-survey.html` | 셀프체크 페이지 목업 |
| `page-report-detail.html` | 리포트 상세 페이지 목업 |
| `page-report-list.html` | 리포트 목록 페이지 목업 |
| `page-journal.html` | 트레이딩 저널 페이지 목업 |
| `page-calculators.html` | 계산기 3종 목업 (적금vs투자, 복리, 시뮬레이터) |
