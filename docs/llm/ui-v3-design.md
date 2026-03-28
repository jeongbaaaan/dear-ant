# Dear,ANT UI 설계문서 (Stitch 기반)

## 목적

Stitch 디자인 레퍼런스 4개 화면(홈/리포트/히스토리/저널)을 기반으로 전체 앱 UI를 Material Design 3 tonal 시스템으로 구현한다.

완료 조건: 모든 화면이 Stitch 디자인과 일치 + `npm run build` 성공 + 97개 테스트 통과 + 4탭 네비게이션 동작

---

## 디자인 시스템

### 색상 (M3 Tonal)

| 토큰 | 값 | 용도 |
|------|-----|------|
| primary | `#006b1b` | CTA, 활성 상태, 링크 |
| primary-dim | `#005d16` | 그라데이션 끝점 |
| primary-container | `#91f78e` | 뱃지 배경, 아이콘 컨테이너 |
| background/surface | `#ddffe2` | 앱 배경 |
| surface-container-lowest | `#ffffff` | 카드 배경 (최상위) |
| surface-container-low | `#cafdd4` | 카드 배경 (중간) |
| surface-container | `#bef5ca` | 카드 배경 (기본) |
| surface-container-high | `#b5f0c2` | 카드 배경 (강조) |
| on-surface | `#0b361d` | 본문 텍스트 |
| on-surface-variant | `#3b6447` | 보조 텍스트 |
| outline | `#568061` | 구분선, 비활성 테두리 |
| error | `#b02500` | 매도, 위험 표시 |
| tertiary | `#00656f` | 보조 강조 (배당, 감정 지수) |

### 타이포그래피

| 용도 | 폰트 | 굵기 |
|------|-------|------|
| 헤드라인 | Plus Jakarta Sans | 700-800 |
| 본문/라벨 | Manrope | 400-700 |
| 아이콘 | Material Symbols Outlined | FILL 0/1 |

### 글래스모피즘

```css
/* 헤더, 하단 네비 */
bg-[#ddffe2]/70 backdrop-blur-xl
```

### 카드 규칙

- 보더 없음 (No-Line Rule)
- tonal surface 계층으로 구분
- 둥근 모서리 `rounded-xl` (12px) ~ `rounded-2xl` (16px)
- shadow: `shadow-sm` 최소한만 사용

---

## 탭 구조 (4탭)

| 탭 | 경로 | 아이콘 | active 조건 |
|---|---|---|---|
| 홈 | `/` | home | `pathname === '/'` |
| 리포트 | `/report` | analytics | `/report`, `/result/*`, `/survey` |
| 저널 | `/memo` | edit_note | `/memo` |
| 더보기 | `/tools` | more_horiz | `/tools`, `/calculator`, `/compound` |

### 네비게이션 스타일

- active: `bg-primary text-white rounded-full` + `FILL 1` 아이콘
- inactive: `text-on-surface/40`
- 라벨: Manrope 10px bold

---

## 페이지별 구조

### 홈 (`/`)

| 섹션 | 컴포넌트 | 데이터 |
|------|---------|-------|
| 글래스 헤더 | 프로필 아이콘 + "Dear,ANT" + 알림 버튼 | - |
| Hero CTA | 그라데이션 카드 → `/report` 링크 | 스트릭 카운트 |
| 최근 리포트 | GradeBadge + 판단모드 + 메시지 | `/api/history` |
| 벤토 그리드 | 적금vs투자(2col) + 복리계산기 + 트레이딩저널 | - |
| 포트폴리오 요약 | Total Portfolio Value + Stocks/Savings 분리 | 정적 데이터 |

### 리포트 (`/report`)

| 섹션 | 컴포넌트 | 데이터 |
|------|---------|-------|
| 글래스 헤더 | 프로필 아이콘 + "리포트" + 알림 | - |
| 새 리포트 CTA | 그라데이션 카드 → `/survey` 링크 | - |
| 요약 통계 | 총 리포트 수 + 평균 감정 흔들림 | `/api/history` |
| 필터 pill | 전체/방어/관망/신중/적극 | 클라이언트 필터 |
| 리포트 목록 | 날짜별 그룹 + 모드 아이콘 + GradeBadge | `/api/history` |

### 리포트 결과 (`/result/[id]`)

| 섹션 | 컴포넌트 | 데이터 |
|------|---------|-------|
| Today's Insight | 투자 컨디션 등급 텍스트 + 설명 | invest_mood |
| 바이오리듬 | SVG sin파 차트 + Physical/Emotional/Intellect % | biorhythm_* |
| 매매 위험도 | SVG 원형 게이지 + SAFE/NORMAL/HIGH 라벨 | mood_score |
| 매매전 셀프체크 | 체크박스 3개 + "다시 분석하기" CTA | 정적 |
| 투자 키워드 | pill 태그 목록 | today_keywords |
| 오늘의 편지 | 본문 텍스트 | today_letter |
| 시장 심리 카드 | 그라데이션 배경 + 텍스트 오버레이 | 정적 |

### 저널 (`/memo`)

| 섹션 | 컴포넌트 | 데이터 |
|------|---------|-------|
| 요약 벤토 | Monthly Profit(2col) + Win Rate + Total Trades | 메모 집계 |
| 거래 기록 CTA | 그라데이션 풀와이드 버튼 | → BottomSheet |
| 날짜 스크롤러 | 가로 스크롤 날짜 pill (오늘 primary) | 최근 7일 |
| 트레이드 카드 | Buy Long/Sell Short 칩 + 종목명 + 메모 + 편집/삭제 | `/api/memos` |
| 인사이트 벤토 | 주간 감정 지수 + AI 인사이트 | 메모 집계 |

#### BottomSheet 폼

| 필드 | 컴포넌트 | 비고 |
|------|---------|------|
| 종목명 | StockSearch (KRX 2,620종목 자동완성) | 코드+이름 검색 |
| 구분 | 4버튼 (매수/매도/보유/관심) | - |
| 가격 | NumberInput (콤마 포맷, suffix "원") | 선택 |
| 수량 | NumberInput (콤마 포맷, suffix "주") | 선택 |
| 메모 | textarea | 필수 |

### 설문 (`/survey`)

| 섹션 | 컴포넌트 | 비고 |
|------|---------|------|
| 생년월일 | DateInput (YYYY/MM/DD 분리, 자동 포커스 이동) | 바이오리듬용 |
| 매매 위험도 | CircularGauge | 체크 항목 기반 실시간 |
| 셀프체크 | EmotionChip 2열 그리드 (9항목, 3카테고리) | - |
| 질문 | ProgressBar + 선택지 카드 (7문항) | - |

### 더보기 (`/tools`)

| 항목 | 경로 | 상태 |
|------|------|------|
| 적금 vs 투자 비교 | `/calculator` | 활성 |
| 복리 계산기 | `/compound` | 활성 |
| 수익률 계산기 | `/tools/returns` | coming soon |

---

## 공통 컴포넌트

| 컴포넌트 | 파일 | 용도 |
|---------|------|------|
| GradeBadge | `src/components/GradeBadge.tsx` | S/A/B/C/D/F 등급 원형 뱃지 |
| CircularGauge | `src/components/CircularGauge.tsx` | SVG 원형 게이지 (0-100) |
| EmotionChip | `src/components/EmotionChip.tsx` | 이모지+라벨 토글 칩 |
| ProgressBar | `src/components/ProgressBar.tsx` | 설문 진행률 바 |
| StockSearch | `src/components/StockSearch.tsx` | KRX 종목 자동완성 (2,620종목) |
| NumberInput | `src/components/NumberInput.tsx` | 1,000단위 콤마 숫자 입력 |
| DateInput | `src/components/DateInput.tsx` | YYYY/MM/DD 분리 입력 + 자동 이동 |
| BottomSheet | `src/components/BottomSheet.tsx` | 슬라이드업 모달 (z-60) |
| BottomNav | `src/components/BottomNav.tsx` | 4탭 하단 네비 (글래스모피즘) |
| CountUp | `src/components/CountUp.tsx` | 숫자 애니메이션 카운터 |
| PullToRefresh | `src/components/PullToRefresh.tsx` | 당겨서 새로고침 |
| Toast | `src/components/Toast.tsx` | 알림 토스트 (2.5초 자동 닫힘) |

---

## 제약 조건

1. Tailwind CSS v4 사용. 커스텀 색상은 globals.css `@theme inline`에서 정의
2. 카드에 border 사용 금지. tonal surface 계층으로만 구분
3. 글래스모피즘은 헤더/네비에만 적용 (`bg-[#ddffe2]/70 backdrop-blur-xl`)
4. 그라데이션 CTA: `bg-gradient-to-br from-primary to-primary-dim`
5. active 네비 아이콘: `font-variation-settings: 'FILL' 1`
6. 최소 터치 타겟 44px, 최소 폰트 10px (라벨), 본문 14px
7. `type="number"` 사용 금지 → NumberInput 컴포넌트 사용
8. 종목명 입력 시 StockSearch 컴포넌트 사용 (자유 입력 금지)
9. 생년월일 입력 시 DateInput 컴포넌트 사용 (`type="date"` 금지)

---

## 의사결정

| 결정 | 기각 대안 | 이유 |
|------|----------|------|
| Stitch HTML → React 수동 변환 | Figma MCP 패치, AI 디자인 생성 | AI 디자인은 진부한 결과. 사용자가 직접 Stitch로 만든 4개 화면이 최종 레퍼런스 |
| 5탭 → 4탭 (리포트+히스토리 통합) | 분리 유지 | 히스토리는 리포트의 목록 보기일 뿐, 별도 탭 불필요 |
| KRX 정적 JSON | 외부 API 실시간 호출 | MVP에서 API 비용/장애 불필요. 2,620종목 ~120KB |
| NumberInput 공통 컴포넌트 | 각 페이지별 인라인 처리 | 복리계산기, 적금vs투자, 저널 3곳에서 동일 패턴 재사용 |
