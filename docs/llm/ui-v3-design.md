# Dear,ANT v3 UI 구현 설계문서

## 목적

기존 Dear,ANT 앱의 6개 화면(Home, Survey, Report, History, Memo, Calculator)과 공통 컴포넌트(BottomNav, layout)를 v3 디자인으로 업그레이드한다. UI 리뷰(5.70/10 FAIL)에서 식별된 접근성(3/10), 일관성(5/10), 트렌드(6/10) 문제를 해결한다.

완료 조건: 6개 화면 + Compound + Tools 화면 모두 v3 디자인 적용 + `npm run build` 성공 + 기존 테스트 전체 통과(`npx vitest run`) + 접근성 수동 검증 통과 (텍스트 대비 4.5:1 이상, 최소 폰트 12px, 터치 타겟 44px)

---

## 파일 변경 목록

### 생성 파일

| # | 파일 경로 | 내용 요약 |
|---|----------|----------|
| 1 | `src/components/GradeBadge.tsx` | 등급 filled chip 배지. S/A/B/C/D/F 6개 등급, sm/md/lg 3개 사이즈 |
| 2 | `src/components/EmotionChip.tsx` | 이모지 감정 칩 카드. 선택/미선택 상태, 2열 그리드용 |
| 3 | `src/components/CircularGauge.tsx` | SVG 원형 게이지. 0-100 값, stroke-dasharray 기반 arc |
| 4 | `src/components/ProgressBar.tsx` | 설문 프로그레스 바. current/total 기반 비율 표시 |

### 수정 파일

| # | 파일 경로 | 변경 내용 요약 |
|---|----------|--------------|
| 5 | `src/app/globals.css` | v3 디자인 토큰 추가 (감정 스펙트럼 CSS 변수, 등급 색상, 스페이싱, 그림자, 글래스모피즘 v3, 카드 v3 클래스, 배경 그라데이션) |
| 6 | `src/app/layout.tsx` | body에 배경 그라데이션 클래스 적용 (`bg-gradient-to-b from-green-50 to-white`) |
| 7 | `src/components/BottomNav.tsx` | 글래스모피즘 적용, 폰트 12px로 확대, 터치 타겟 44px 확보, border-t 제거 후 tonal layering, green-800 텍스트 |
| 8 | `src/app/page.tsx` | Home v3: hero 카피 서브텍스트 green-500->green-800, CTA hover scale(1.02), 최근 리포트 카드에 GradeBadge 적용, 카드 border 제거 후 shadow+tonal, 11px 텍스트 12px로, 둘러보기 섹션 카드 스타일 통일 |
| 9 | `src/app/survey/page.tsx` | Survey v3: 체크박스 -> EmotionChip 2열 그리드, ProgressBar 추가, 카테고리 시각 구분(컬러 dot), 위험도 게이지를 CircularGauge로, 카드 No-Line Rule, 터치 타겟 44px, 질문 단계 프로그레스 바 높이 4px+green-800, 텍스트 대비 수정 |
| 10 | `src/app/result/[id]/page.tsx` | Report v3: 등급+판단모드+감정흔들림 통합 히어로 카드(green-900 bg), CircularGauge로 감정흔들림 표시, GradeBadge 적용, 키워드 칩 No-Line, 바이오리듬 바 색상 v3, 카드 전체 No-Line Rule |
| 11 | `src/app/history/page.tsx` | History v3: 통계 카드 No-Line Rule, TrendChart 라인 색상 purple->green-800, GradeBadge 적용, 리스트 카드 No-Line |
| 12 | `src/app/memo/page.tsx` | Memo v3: GradeBadge 적용, 카드 스타일 No-Line Rule, 텍스트 대비 수정 |
| 13 | `src/app/calculator/page.tsx` | Calculator v3: 팔레트 통일 (모든 UI green 팔레트), 카드 No-Line Rule, 텍스트 대비 수정 |
| 14 | `src/app/compound/page.tsx` | Compound v3: purple 그라데이션 -> green 팔레트 통일, 카드 No-Line Rule, 차트 색상 green 계열 |
| 15 | `src/app/tools/page.tsx` | Tools v3: 카드 No-Line Rule, 텍스트 대비 수정 |

---

## 구현 순서

### Phase 1: 디자인 시스템 기반 (Step 1-7)

#### Step 1: globals.css v3 디자인 토큰 추가

대상 파일: `src/app/globals.css`

`@theme inline` 블록 내부에 아래 CSS 변수를 추가하라. 기존 변수는 삭제하지 마라.

```css
/* @theme inline 블록 안에 추가할 변수 */

/* 감정 스펙트럼 */
--color-emotion-calm: #2DD4BF;      /* mint-400, 평온 */
--color-emotion-confident: #60A5FA; /* blue-400, 자신감 */
--color-emotion-excited: #FBBF24;   /* amber-400, 설렘 */
--color-emotion-anxious: #F97316;   /* orange-500, 초조 */
--color-emotion-fearful: #EF4444;   /* red-500, 불안 */

/* 등급 배지 배경 */
--color-grade-s: #D97706;
--color-grade-a: #059669;
--color-grade-b: #2563EB;
--color-grade-c: #D97706;
--color-grade-d: #F97316;
--color-grade-f: #DC2626;

/* 카테고리 색상 (Survey) */
--color-cat-condition: #16A34A;
--color-cat-condition-bg: #DCFCE7;
--color-cat-psychology: #D97706;
--color-cat-psychology-bg: #FEF3C7;
--color-cat-external: #4F46E5;
--color-cat-external-bg: #E0E7FF;

/* 위험도 색상 */
--color-risk-safe: #16A34A;
--color-risk-caution: #D97706;
--color-risk-warning: #EA580C;
--color-risk-danger: #DC2626;

/* 바이오리듬 색상 */
--color-bio-physical: #16A34A;
--color-bio-emotional: #F59E0B;
--color-bio-intellectual: #2563EB;

/* 그림자 (green tint) */
--shadow-card: 0 2px 8px rgba(27,67,50,0.06), 0 1px 2px rgba(27,67,50,0.04);
--shadow-card-hover: 0 8px 32px rgba(27,67,50,0.10), 0 2px 6px rgba(27,67,50,0.04);
```

`@theme inline` 블록 밖, body 스타일 다음에 아래 유틸리티 클래스를 추가하라:

```css
/* V3 Card — No-Line Rule */
.card-v3 {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(27,67,50,0.06), 0 1px 2px rgba(27,67,50,0.04);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.card-v3:hover {
  box-shadow: 0 8px 32px rgba(27,67,50,0.10), 0 2px 6px rgba(27,67,50,0.04);
  transform: translateY(-1px);
}

/* V3 Glass Bottom Nav */
.glass-nav {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 -1px 12px rgba(27,67,50,0.06);
}

/* V3 Background Gradient */
.bg-v3 {
  background: linear-gradient(180deg, #F0FFF4 0%, #FFFFFF 100%);
}
```

기존 `.glass` 클래스의 `border: 1px solid rgba(82, 183, 136, 0.1);` 행을 삭제하라 (No-Line Rule).
기존 `.glass-strong` 클래스의 `border: 1px solid rgba(82, 183, 136, 0.15);` 행을 삭제하라.
기존 `.card-premium` 클래스의 `border: 1px solid rgba(82, 183, 136, 0.1);` 행을 삭제하라.

shimmer 애니메이션의 purple 색상을 green으로 변경하라:
- `rgba(168,85,247,0.08)` -> `rgba(27,67,50,0.06)`

**Output**: globals.css에 v3 디자인 토큰과 유틸리티 클래스가 추가되고, 기존 border가 제거된 상태

#### Step 2: GradeBadge.tsx 생성

대상 파일: `src/components/GradeBadge.tsx` (신규 생성)

```tsx
interface GradeBadgeProps {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  size?: 'sm' | 'md' | 'lg';
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps): JSX.Element
```

색상 매핑 (filled chip: 배경색 + 흰색 텍스트):
| 등급 | 배경색 hex | Tailwind 클래스 |
|------|-----------|----------------|
| S | #D97706 | `bg-amber-600` |
| A | #059669 | `bg-emerald-600` |
| B | #2563EB | `bg-blue-600` |
| C | #D97706 | `bg-amber-600` |
| D | #F97316 | `bg-orange-500` |
| F | #DC2626 | `bg-red-600` |

사이즈 매핑:
| 사이즈 | 컨테이너 | 폰트 크기 | border-radius |
|--------|---------|----------|--------------|
| sm | `w-6 h-6` (24px) | `text-xs` (12px) | `rounded-lg` (8px) |
| md | `w-9 h-9` (36px) | `text-base` (16px) | `rounded-xl` (12px) |
| lg | `w-16 h-16` (64px) | `text-3xl` (30px) | `rounded-2xl` (16px) |

구현 규칙:
- `'use client'` 지시문 불필요 (순수 프레젠테이션 컴포넌트)
- `flex items-center justify-center` 로 텍스트 센터링
- `font-extrabold text-white` 적용
- `animate-scale-in` 클래스 추가 (globals.css에 이미 정의됨)

**Output**: GradeBadge 컴포넌트 파일 생성 완료

#### Step 3: EmotionChip.tsx 생성

대상 파일: `src/components/EmotionChip.tsx` (신규 생성)

```tsx
interface EmotionChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onToggle: () => void;
  categoryColor?: string;  // Tailwind bg 클래스 (예: 'bg-green-100')
}

export function EmotionChip({ emoji, label, selected, onToggle, categoryColor }: EmotionChipProps): JSX.Element
```

상태별 스타일:
| 상태 | 배경 | 텍스트 | 테두리 | transform |
|------|------|--------|--------|-----------|
| 미선택 | `bg-white` | `text-green-900` | 없음 (No-Line Rule). `card-v3` 클래스 사용 | 없음 |
| 선택 | `bg-green-900` | `text-white` | 없음 | `scale(1.02)` via `hover:scale-[1.02]` |

구현 규칙:
- `'use client'` 불필요
- 최소 높이 44px (터치 타겟): `min-h-[44px]`
- border-radius: `rounded-2xl` (16px)
- `transition-all duration-200`
- 이모지는 `text-lg` (18px), 라벨은 `text-sm font-medium` (14px)
- 레이아웃: `flex items-center gap-3 px-4 py-3`
- 미선택 시 `categoryColor` prop이 있으면 좌측에 4px 세로 색상 바 표시: `<div className="w-1 h-6 rounded-full {categoryColor}" />`

**Output**: EmotionChip 컴포넌트 파일 생성 완료

#### Step 4: CircularGauge.tsx 생성

대상 파일: `src/components/CircularGauge.tsx` (신규 생성)

```tsx
interface CircularGaugeProps {
  value: number;         // 0-100
  size?: number;         // px, default 64
  strokeWidth?: number;  // px, default 6
  color?: string;        // CSS color value, default '#FBBF24' (amber-400)
  label?: string;        // 중앙에 표시할 텍스트 (예: '45%')
}

export function CircularGauge({ value, size = 64, strokeWidth = 6, color = '#FBBF24', label }: CircularGaugeProps): JSX.Element
```

SVG 구현 상세:
1. viewBox: `0 0 {size} {size}`
2. 원 중심: `cx={size/2}`, `cy={size/2}`
3. 반지름: `r = (size - strokeWidth) / 2`
4. 둘레 계산: `circumference = 2 * Math.PI * r`
5. dashoffset 계산: `circumference - (circumference * clampedValue / 100)`, 여기서 `clampedValue = Math.max(0, Math.min(100, value))`
6. 배경 원: `stroke="rgba(27,67,50,0.08)"`, `strokeWidth={strokeWidth}`, `fill="none"`
7. 값 원: `stroke={color}`, `strokeWidth={strokeWidth}`, `fill="none"`, `strokeLinecap="round"`, `strokeDasharray={circumference}`, `strokeDashoffset={dashoffset}`
8. SVG에 `style={{ transform: 'rotate(-90deg)' }}` 적용 (12시 방향 시작)
9. 중앙 텍스트: `label` prop이 있으면 SVG 위에 absolute 포지션으로 표시. `font-extrabold text-green-900`
10. 애니메이션: CSS transition으로 `stroke-dashoffset` 변화 (transition은 inline style로: `transition: 'stroke-dashoffset 1s ease-out'`)

구현 규칙:
- `'use client'` 불필요 (순수 SVG 렌더링)
- 컨테이너: `relative inline-flex items-center justify-center`
- SVG와 중앙 텍스트를 겹치기 위해 `position: relative` 컨테이너 + `absolute inset-0 flex items-center justify-center`

**Output**: CircularGauge 컴포넌트 파일 생성 완료

#### Step 5: ProgressBar.tsx 생성

대상 파일: `src/components/ProgressBar.tsx` (신규 생성)

```tsx
interface ProgressBarProps {
  current: number;  // 현재 단계 (1-based)
  total: number;    // 총 단계 수
}

export function ProgressBar({ current, total }: ProgressBarProps): JSX.Element
```

구현 상세:
1. 비율 계산: `const percent = total > 0 ? Math.round((current / total) * 100) : 0`
2. 컨테이너: `w-full h-1 bg-green-100 rounded-full overflow-hidden` (높이 4px)
3. 채움 바: `h-full bg-green-800 rounded-full` + `style={{ width: \`${percent}%\` }}`
4. transition: `transition-all duration-300 ease-out`
5. 접근성: `role="progressbar"`, `aria-valuenow={percent}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="진행률"`

**Output**: ProgressBar 컴포넌트 파일 생성 완료

#### Step 6: BottomNav.tsx 수정

대상 파일: `src/components/BottomNav.tsx`

변경 항목:

1. **글래스모피즘 적용**: nav 내부 div의 클래스를 변경
   - 변경 전: `bg-white border-t border-green-200`
   - 변경 후: `glass-nav` (globals.css의 v3 유틸리티 클래스)

2. **폰트 사이즈 12px로 확대**:
   - 변경 전: `text-[10px]`
   - 변경 후: `text-xs` (12px)

3. **터치 타겟 44px 확보**:
   - 변경 전: `py-2.5 px-3`
   - 변경 후: `py-3 px-4 min-h-[44px] min-w-[44px]`

4. **비활성 텍스트 대비 수정**:
   - 변경 전: `text-green-500` (비활성 라벨)
   - 변경 후: `text-green-800` (6.39:1 대비비)

5. **비활성 아이콘 색상 수정**:
   - navItems 배열의 icon 함수에서 비활성 stroke/fill 색상 변경
   - 변경 전: `#74C69D` (green-500)
   - 변경 후: `#2D6A4F` (green-800) — 비활성 아이콘에도 불투명도 0.5 추가: `opacity: 0.5`

**Output**: BottomNav가 글래스모피즘 + 접근성 기준 충족 상태

#### Step 7: layout.tsx 수정

대상 파일: `src/app/layout.tsx`

변경 항목:

body 태그의 className 변경:
- 변경 전: `className="antialiased min-h-screen"`
- 변경 후: `className="antialiased min-h-screen bg-v3"`

**Output**: 전체 앱에 green-50->white 그라데이션 배경 적용

---

### Phase 2: 핵심 3개 화면 (Step 8-10)

#### Step 8: Home page.tsx v3 적용

대상 파일: `src/app/page.tsx`

변경 항목 (줄번호는 현재 코드 기준):

1. **hero 서브텍스트 대비 수정** (line 115):
   - 변경 전: `text-green-500 text-[14px]`
   - 변경 후: `text-green-800 text-sm`

2. **CTA 호버 효과** (line 124):
   - 변경 전: `hover:bg-green-800`
   - 변경 후: `hover:bg-green-800 hover:scale-[1.02] hover:shadow-xl`

3. **CTA 서브텍스트 대비** (line 129):
   - 변경 전: `text-green-400 text-[12px]`
   - 변경 후: `text-green-300 text-xs`

4. **streak 텍스트 대비** (line 138-139):
   - 변경 전: `text-green-500 text-[12px]`
   - 변경 후: `text-green-800 text-xs`

5. **최근 리포트 카드 No-Line Rule** (line 146):
   - 변경 전: `bg-white border border-green-200 rounded-2xl px-5 py-4 mb-8 shadow-sm`
   - 변경 후: `card-v3 px-5 py-4 mb-8`

6. **최근 리포트 카드 내 11px 텍스트** (line 149):
   - 변경 전: `text-green-500 text-[11px]`
   - 변경 후: `text-green-800 text-xs` (12px)

7. **최근 리포트 카드에 GradeBadge 적용** (line 156-158):
   - 변경 전: `<span className={...text-[28px]...}>{lastReport.invest_mood || '-'}</span>`
   - 변경 후: import GradeBadge 사용, `<GradeBadge grade={(lastReport.invest_mood || 'C') as 'S'|'A'|'B'|'C'|'D'|'F'} size="md" />`
   - 파일 상단에 `import { GradeBadge } from '@/components/GradeBadge';` 추가

8. **둘러보기 섹션 라벨 대비** (line 164):
   - 변경 전: `text-green-500 text-[12px]`
   - 변경 후: `text-green-800 text-xs`

9. **Feature 카드 No-Line Rule** (line 168, 183, 199, 218):
   - 변경 전: `bg-white border border-green-200 rounded-2xl px-5 py-4 hover:border-green-400 shadow-sm transition-colors`
   - 변경 후: `card-v3 px-5 py-4`

10. **Feature 카드 설명 텍스트 대비** (line 176, 193, 211, 227):
    - 변경 전: `text-green-500 text-[12px]`
    - 변경 후: `text-green-800 text-xs`

11. **main 배경** (line 95):
    - 변경 전: `bg-green-50`
    - 변경 후: 제거 (layout.tsx의 bg-v3가 처리)

12. **복리 계산기 아이콘 purple -> green** (line 219-221):
    - 변경 전: `bg-purple-100`, `stroke="#9333ea"`
    - 변경 후: `bg-green-100`, `stroke="#2D6A4F"`

**Output**: Home 화면이 v3 디자인 적용. 모든 텍스트 대비 4.5:1+, No-Line Rule 적용, GradeBadge 사용

#### Step 9: Survey page.tsx v3 적용

대상 파일: `src/app/survey/page.tsx`

**9-A: 체크리스트를 EmotionChip으로 교체**

파일 상단에 import 추가:
```tsx
import { EmotionChip } from '@/components/EmotionChip';
import { CircularGauge } from '@/components/CircularGauge';
import { ProgressBar } from '@/components/ProgressBar';
```

checklistItems 배열에 emoji 필드를 추가하라:
```tsx
const checklistItems: CheckItem[] = [
  // 컨디션
  { id: 'sleep', label: '수면 5시간 이하', category: '컨디션', weight: 3, emoji: '😴' },
  { id: 'tired', label: '컨디션 안 좋음', category: '컨디션', weight: 2, emoji: '🤒' },
  { id: 'caffeine', label: '카페인 3잔 이상', category: '컨디션', weight: 1, emoji: '☕' },
  // 심리
  { id: 'revenge', label: '손실 만회 욕구', category: '심리', weight: 4, emoji: '🔥' },
  { id: 'gut', label: '근거 없는 확신', category: '심리', weight: 3, emoji: '🎯' },
  { id: 'fomo', label: '기회를 놓칠까 불안', category: '심리', weight: 3, emoji: '😰' },
  // 외부 영향
  { id: 'sns', label: 'SNS 수익 인증 목격', category: '외부 영향', weight: 2, emoji: '📱' },
  { id: 'recommend', label: '종목 추천 수령', category: '외부 영향', weight: 2, emoji: '💬' },
  { id: 'news', label: '뉴스 30분 이상 시청', category: '외부 영향', weight: 1, emoji: '📰' },
];
```

CheckItem interface에 emoji 필드 추가:
```tsx
interface CheckItem {
  id: string;
  label: string;
  category: string;
  weight: number;
  emoji: string;
}
```

카테고리별 색상 매핑 상수 추가:
```tsx
const categoryColors: Record<string, string> = {
  '컨디션': 'bg-emerald-400',
  '심리': 'bg-amber-500',
  '외부 영향': 'bg-indigo-500',
};
```

**9-B: info 단계 UI 변경**

1. 돌아가기 버튼 대비 수정:
   - 변경 전: `text-green-500 hover:text-green-700`
   - 변경 후: `text-green-800 hover:text-green-900`

2. 생년월일 라벨 대비:
   - 변경 전: `text-green-700 text-sm` (label), `text-green-500 text-xs` (설명)
   - 변경 후: `text-green-900 text-sm` (label), `text-green-800 text-xs` (설명)

3. input border -> No-Line Rule:
   - 변경 전: `border border-green-200 bg-white`
   - 변경 후: `bg-white shadow-sm` + focus ring은 유지 (`focus:ring-2 focus:ring-green-300`)

4. 체크리스트 서브텍스트 대비:
   - 변경 전: `text-green-500 text-[13px]`
   - 변경 후: `text-green-800 text-sm`

5. 카테고리 라벨 대비와 폰트:
   - 변경 전: `text-green-500 text-[11px]`
   - 변경 후: `text-green-800 text-xs font-semibold`
   - 카테고리명 앞에 색상 dot 추가: `<span className="inline-block w-2 h-2 rounded-full {categoryColors[cat]} mr-1.5" />`

6. 체크리스트 아이템을 EmotionChip으로 교체:
   - 기존 button 요소 전체를 EmotionChip 컴포넌트로 대체
   - 레이아웃: `grid grid-cols-2 gap-3` (기존 `space-y-2`에서 변경)
   ```tsx
   <div className="grid grid-cols-2 gap-3">
     {checklistItems.filter(item => item.category === cat).map(item => (
       <EmotionChip
         key={item.id}
         emoji={item.emoji}
         label={item.label}
         selected={checkedItems.has(item.id)}
         onToggle={() => toggleCheck(item.id)}
         categoryColor={categoryColors[cat]}
       />
     ))}
   </div>
   ```

7. 위험도 카드를 CircularGauge로 변경:
   - 변경 전: 숫자 텍스트 `{checkedItems.size}/{checklistItems.length}`
   - 변경 후: CircularGauge 사용
   ```tsx
   <CircularGauge
     value={Math.round((checkedItems.size / checklistItems.length) * 100)}
     size={64}
     color={riskLevel === '안정' ? '#16A34A' : riskLevel === '양호' ? '#2563EB' : riskLevel === '주의' ? '#D97706' : '#DC2626'}
     label={`${checkedItems.size}/${checklistItems.length}`}
   />
   ```

8. 위험도 카드 No-Line Rule:
   - 변경 전: `bg-white border border-green-200 rounded-2xl`
   - 변경 후: `card-v3`

9. 위험도 카드 내 11px 텍스트:
   - 변경 전: `text-green-500 text-[11px]`
   - 변경 후: `text-green-800 text-xs`

**9-C: questions 단계 UI 변경**

1. 기존 프로그레스 바를 ProgressBar 컴포넌트로 교체:
   - 변경 전: `<div className="w-full h-2 bg-green-100 rounded-full overflow-hidden" ...>`와 내부 div
   - 변경 후: `<ProgressBar current={currentQuestion + 1} total={questions.length} />`

2. 질문 진행 표시 텍스트 대비:
   - 변경 전: `text-sm text-green-500`
   - 변경 후: `text-sm text-green-800`

3. 답변 버튼 No-Line Rule:
   - 변경 전: `border-2 border-green-200 bg-white hover:border-green-900 hover:bg-green-50`
   - 변경 후: `card-v3 hover:bg-green-50 hover:scale-[1.02]` (border-2 제거)
   - 최소 높이: `min-h-[44px]`

4. 답변 버튼 텍스트 대비:
   - 변경 전: `text-green-800`
   - 변경 후: `text-green-900` (유지, 이미 충분)

**9-D: loading 단계 텍스트 대비**

- 변경 전: `text-green-500 text-sm`
- 변경 후: `text-green-800 text-sm`

**Output**: Survey 화면이 EmotionChip 2열 그리드 + CircularGauge + ProgressBar 적용. 체크박스 UI 제거됨

#### Step 10: Report result/[id]/page.tsx v3 적용

대상 파일: `src/app/result/[id]/page.tsx`

파일 상단에 import 추가:
```tsx
import { GradeBadge } from '@/components/GradeBadge';
import { CircularGauge } from '@/components/CircularGauge';
```

**10-A: 통합 히어로 카드 (등급 + 판단모드 + 감정흔들림)**

기존의 투자 분위기 등급 카드(line 150-157)와 판단 모드 카드(line 160-166)를 하나의 통합 히어로 카드로 합친다:

```tsx
{/* 통합 히어로 카드 */}
<div className="bg-green-900 rounded-3xl p-6 text-white relative overflow-hidden">
  {/* 배경 장식 */}
  <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }} />
  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 70%)' }} />

  {/* 상단: 라벨 + 등급 배지 */}
  <div className="flex items-start justify-between relative z-10">
    <div>
      <p className="text-white/50 text-xs font-semibold tracking-wide mb-2">투자 분위기</p>
      <p className="text-2xl font-black">{investMood.label}</p>
      <p className="text-white/60 text-sm mt-1">{investMood.desc}</p>
    </div>
    <GradeBadge grade={(report.invest_mood || 'C') as 'S'|'A'|'B'|'C'|'D'|'F'} size="lg" />
  </div>

  {/* 구분선 */}
  <div className="h-px bg-white/12 my-5 relative z-10" />

  {/* 하단: 판단모드 + 감정흔들림 게이지 */}
  <div className="flex items-start justify-between relative z-10">
    <div>
      <p className="text-white/45 text-xs font-medium mb-1">판단 모드</p>
      <p className="text-lg font-extrabold">{report.decision_mode}</p>
      <p className="text-white/50 text-xs mt-0.5">{mode.desc}</p>
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-white/45 text-xs font-medium">감정 흔들림</p>
      <CircularGauge
        value={report.mood_score}
        size={72}
        strokeWidth={6}
        color={report.mood_score <= 30 ? '#2DD4BF' : report.mood_score <= 60 ? '#FBBF24' : '#EF4444'}
        label={`${report.mood_score}%`}
      />
    </div>
  </div>
</div>
```

기존의 분리된 판단 모드 카드(line 159-166)는 삭제하라.

**10-B: 핵심 지표 카드 No-Line Rule**

1. 감정 흔들림 + 리스크 성향 카드 (line 169):
   - 변경 전: `bg-white border border-green-200 rounded-2xl p-5`
   - 변경 후: `card-v3 p-5`
   - 감정 흔들림 프로그레스 바를 제거하라 (히어로 카드에 CircularGauge가 있으므로 중복). 리스크 성향 텍스트만 남겨라
   - `border-t border-green-100` 구분선도 제거하라

2. 텍스트 대비 수정:
   - `text-green-700 text-sm` -> `text-green-800 text-sm` (라벨)
   - `text-green-500 text-xs` -> `text-green-800 text-xs` (설명)

**10-C: 바이오리듬 카드**

1. 카드 No-Line Rule:
   - 변경 전: `bg-white border border-green-200 rounded-2xl p-5`
   - 변경 후: `card-v3 p-5`

2. BiorhythmBar 컴포넌트의 색상 업데이트:
   - 신체: `bg-green-500` -> `bg-emerald-500` (var(--color-bio-physical)에 대응)
   - 감정: `bg-mint-400` -> `bg-amber-400` (var(--color-bio-emotional)에 대응)
   - 지성: `bg-blue-400` 유지
   - 라벨: `text-green-700` -> `text-green-800`

3. BiorhythmBar 값 텍스트:
   - `text-green-800` 유지 (이미 충분)

**10-D: 이전 비교 카드 No-Line Rule**

- 변경 전: `bg-white border border-green-200 rounded-2xl p-5`
- 변경 후: `card-v3 p-5`
- 내부 `border-b border-green-100` 구분선 유지 (카드 외곽 border만 제거)

**10-E: 키워드 칩 No-Line Rule**

1. 카드 컨테이너:
   - 변경 전: `bg-white border border-green-200 rounded-2xl p-5`
   - 변경 후: `card-v3 p-5`

2. 개별 키워드 칩:
   - 변경 전: `px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200`
   - 변경 후: `px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium` (border 제거)

**10-F: 오늘의 한마디 카드**

- 유지 (이미 green-900 bg로 적절)

**10-G: 편지 본문 카드 No-Line Rule**

- 변경 전: `bg-white border border-green-200 rounded-2xl p-6`
- 변경 후: `card-v3 p-6`
- 텍스트: `text-green-500 text-xs` -> `text-green-800 text-xs`

**10-H: 액션 버튼**

1. 히스토리/공유 버튼 No-Line Rule:
   - 변경 전: `border-2 border-green-200 text-green-700`
   - 변경 후: `card-v3 text-green-800 font-medium`

**Output**: Report 화면이 통합 히어로 카드 + CircularGauge + GradeBadge + No-Line Rule 적용

---

### Phase 3: 나머지 화면 (Step 11-13)

#### Step 11: History page.tsx v3 적용

대상 파일: `src/app/history/page.tsx`

파일 상단에 import 추가:
```tsx
import { GradeBadge } from '@/components/GradeBadge';
import { CircularGauge } from '@/components/CircularGauge';
```

변경 항목:

1. **TrendChart 컴포넌트 색상 통일**:
   - 투자 무드 라인: `stroke="#7e22ce"` (purple) -> `stroke="#1B4332"` (green-900)
   - 포인트: `stroke="#7e22ce"` -> `stroke="#1B4332"`
   - TrendChart 카드: `bg-white border border-green-200 rounded-2xl p-5` -> `card-v3 p-5`
   - 범례 purple -> green: `bg-purple-600` -> `bg-green-900`
   - 텍스트: `text-green-500` -> `text-green-800` (범례 라벨)

2. **StatsSummary 카드 No-Line Rule**:
   - 각 통계 카드: `bg-white border border-green-200 rounded-2xl p-4` -> `card-v3 p-4`
   - 텍스트 대비: `text-green-500 text-xs` -> `text-green-800 text-xs`

3. **최다 등급에 GradeBadge 적용**:
   - 변경 전: `<p className={...text-2xl font-black ${moodGradeColor[...]}}>{topGrade?.[0]}</p>`
   - 변경 후: GradeBadge 사용
   ```tsx
   {topGrade?.[0] ? (
     <GradeBadge grade={topGrade[0] as 'S'|'A'|'B'|'C'|'D'|'F'} size="md" />
   ) : (
     <p className="text-2xl font-black text-green-800">-</p>
   )}
   ```

4. **최근 리포트 미리보기 카드**:
   - 텍스트: `text-white/60` -> `text-white/70`, `text-white/50` -> `text-white/60` (미세 대비 개선)

5. **리스트 뷰 카드 No-Line Rule**:
   - 변경 전: `bg-white rounded-2xl border border-green-200 p-4 hover:shadow-md hover:border-green-400`
   - 변경 후: `card-v3 p-4`

6. **리스트 뷰 등급에 GradeBadge 적용**:
   - 변경 전: `<span className={...text-xs font-black ${moodGradeColor[...]}}>...</span>`
   - 변경 후: `<GradeBadge grade={report.invest_mood as ...} size="sm" />`

7. **판단 모드 칩 border 제거**:
   - `modeColors` 매핑에서 border 클래스 제거
   - 변경 전: `'bg-blue-50 text-blue-600 border-blue-200'`
   - 변경 후: `'bg-blue-50 text-blue-600'` (모든 모드에 적용)
   - 칩 렌더링에서 `border` 클래스 제거

8. **empty state 감성 개선**:
   - 변경 전: `<p className="text-green-500 mb-4">아직 리포트가 없습니다</p>`
   - 변경 후:
   ```tsx
   <div className="text-center py-16">
     <p className="text-4xl mb-4">🐜</p>
     <p className="text-green-900 font-bold text-lg mb-2">아직 리포트가 없어요</p>
     <p className="text-green-800 text-sm mb-6">첫 번째 투자 컨디션 체크를 시작해보세요</p>
     <Link href="/survey" className="inline-block bg-green-900 text-white font-bold py-3 px-8 rounded-2xl hover:scale-[1.02] transition-all">
       첫 리포트 받기
     </Link>
   </div>
   ```

9. **탭 전환 No-Line Rule**:
   - `bg-green-100 rounded-xl` 유지 (이것은 배경색 차이로 구분이므로 No-Line Rule에 부합)

10. **헤더 서브텍스트**:
    - 변경 전: `text-green-500 text-sm`
    - 변경 후: `text-green-800 text-sm`

**Output**: History 화면 v3 적용. purple 제거, No-Line Rule, GradeBadge 적용

#### Step 12: Memo page.tsx v3 적용

대상 파일: `src/app/memo/page.tsx`

파일 상단에 import 추가:
```tsx
import { GradeBadge } from '@/components/GradeBadge';
```

변경 항목:

1. **moodGradeColor 매핑을 GradeBadge로 교체**: 등급 표시가 있는 모든 위치에서 `<GradeBadge grade={...} size="sm" />` 사용

2. **모든 카드 No-Line Rule**:
   - `bg-white border border-green-200 rounded-2xl` -> `card-v3`
   - 모든 곳의 `border border-green-200` 제거

3. **텍스트 대비 수정**:
   - 모든 `text-green-500 text-xs` -> `text-green-800 text-xs`
   - 모든 `text-green-500 text-[11px]` -> `text-green-800 text-xs`
   - 모든 `text-green-500 text-[10px]` -> `text-green-800 text-xs`

4. **actionConfig의 border 제거**:
   - `bg: 'bg-rose-50 border-rose-200'` -> `bg: 'bg-rose-50'`
   - `bg: 'bg-blue-50 border-blue-200'` -> `bg: 'bg-blue-50'`
   - `bg: 'bg-emerald-50 border-emerald-200'` -> `bg: 'bg-emerald-50'`
   - `bg: 'bg-amber-50 border-amber-200'` -> `bg: 'bg-amber-50'`

5. **PortfolioSummary 카드**: 모든 `border border-green-200` 제거, `card-v3` 적용 (shadow만 사용)

**Output**: Memo 화면 v3 적용

#### Step 13: Calculator + Compound + Tools v3 적용

**13-A: Calculator (src/app/calculator/page.tsx)**

1. 모든 카드 No-Line Rule:
   - `bg-white border border-green-200 rounded-2xl` -> `card-v3`
   - `bg-white rounded-2xl border border-blue-100` -> `card-v3` (적금 결과 카드)

2. 텍스트 대비:
   - 모든 `text-green-500 text-xs` -> `text-green-800 text-xs`
   - 모든 `text-green-500 text-sm` -> `text-green-800 text-sm`

3. 입력 필드 border -> shadow:
   - `border border-green-200` -> shadow 사용 (card-v3 내부이므로 focus ring만 유지)

4. 적금 결과 카드의 blue border 제거

5. 비교 테이블 `border-b border-green-100` -> 유지 (테이블 내부 구분선은 OK)

**13-B: Compound (src/app/compound/page.tsx)**

1. 모든 카드 No-Line Rule:
   - `bg-white rounded-2xl border border-green-200 shadow-sm` -> `card-v3`

2. 차트 색상 purple -> green:
   - `barGradPrincipal`: `#c084fc`/`#a855f7` (purple) -> `#2D6A4F`/`#1B4332` (green-800/900)
   - `barGradProfit`: `#5eead4`/`#2dd4bf` (mint) -> `#52B788`/`#40916C` (green-600/700)
   - 범례 색상: `fill="#74C69D"` -> `fill="#2D6A4F"` (모든 라벨 텍스트)

3. 원금 vs 수익 스택 바:
   - 변경 전: `from-purple-400 to-purple-500` (원금)
   - 변경 후: `from-green-800 to-green-900`

4. 10px 텍스트 12px로:
   - `text-[10px]` -> `text-xs` (4곳)

5. 텍스트 대비:
   - 모든 `text-green-500 text-xs` -> `text-green-800 text-xs`
   - `text-green-500 text-sm` -> `text-green-800 text-sm`

**13-C: Tools (src/app/tools/page.tsx)**

1. 카드 No-Line Rule:
   - 변경 전: `bg-white border border-green-200 rounded-2xl px-5 py-4`
   - 변경 후: `card-v3 px-5 py-4`

2. 아이콘 박스 border 제거:
   - 변경 전: `border border-green-200`
   - 변경 후: 제거 (bg-white만 유지, shadow는 card-v3가 처리)

3. 텍스트 대비:
   - `text-green-500 text-xs` -> `text-green-800 text-xs`
   - `text-green-500 text-sm` -> `text-green-800 text-sm`

4. SOON 배지:
   - `text-green-500 text-[10px]` -> `text-green-800 text-xs`
   - `bg-green-200` -> `bg-green-100`

5. 홈으로 링크 대비:
   - `text-green-600` -> `text-green-800`

**Output**: Calculator, Compound, Tools 모두 v3 적용. purple 팔레트 완전 제거

---

### Phase 4: 검증 (Step 14-16)

#### Step 14: 빌드 확인

명령: `npm run build`

성공 기준: 빌드 에러 0개

빌드 실패 시 조치:
- TypeScript 에러: import 경로, prop 타입 불일치 수정
- Tailwind 클래스 미인식: globals.css의 custom 클래스가 올바르게 정의되었는지 확인
- 사용하지 않는 import 제거

**Output**: 빌드 성공 로그

#### Step 15: 테스트 통과 확인

명령: `npx vitest run`

성공 기준: 전체 테스트 통과

테스트 실패 시 조치:
- UI 변경은 비즈니스 로직을 변경하지 않으므로 기존 테스트는 모두 통과해야 한다
- 실패하는 테스트가 있다면 UI 변경이 로직을 침범한 것이므로 해당 변경을 롤백하라

**Output**: 전체 테스트 통과 로그

#### Step 16: 접근성 수동 검증

검증 항목 체크리스트:

| # | 항목 | 기준 | 검증 방법 |
|---|------|------|----------|
| 1 | 텍스트 대비비 | 모든 텍스트 4.5:1 이상 (WCAG AA) | green-800(#2D6A4F) on white = 6.39:1 확인. green-500/600/700이 텍스트에 사용되지 않았는지 grep |
| 2 | 최소 폰트 | 12px 이상 | `text-[10px]`, `text-[11px]` 검색 결과 0건 확인 |
| 3 | 터치 타겟 | 44px 이상 | BottomNav, 체크리스트 칩, 답변 버튼, CTA 모두 min-h-[44px] 확인 |
| 4 | No-Line Rule | 1px border 미사용 | `border border-green-200` 검색 결과 0건 (테이블 내부 구분선 제외) |
| 5 | #000000 미사용 | 순수 black 없음 | `#000000`, `#000`, `black` 검색 결과 0건 (CSS variable 참조 제외) |
| 6 | 스페이싱 | 8pt 그리드 | 사용된 spacing 값이 4/8/12/16/24/32/48px 내인지 확인 |

검증 명령:
```bash
# green-500/600/700 텍스트 사용 확인 (데코/보더/아이콘 외)
grep -rn "text-green-500\|text-green-600\|text-green-700" src/app/ src/components/

# 10px, 11px 폰트 확인
grep -rn "text-\[10px\]\|text-\[11px\]" src/app/ src/components/

# border border-green 확인 (카드 외곽)
grep -rn "border border-green" src/app/ src/components/
```

**Output**: 모든 검증 항목 통과. 위반 사항이 있으면 수정 후 재검증

---

## 함수/컴포넌트 시그니처

### GradeBadge

```tsx
// 파일: src/components/GradeBadge.tsx
interface GradeBadgeProps {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  size?: 'sm' | 'md' | 'lg';  // sm: 24px, md: 36px, lg: 64px. default: 'md'
}
export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps): JSX.Element
// 반환: filled chip div. 등급별 bg 색상 + 흰색 텍스트 + animate-scale-in
// 색상 매핑: S=#D97706, A=#059669, B=#2563EB, C=#D97706, D=#F97316, F=#DC2626
```

### EmotionChip

```tsx
// 파일: src/components/EmotionChip.tsx
interface EmotionChipProps {
  emoji: string;           // 예: '😴'
  label: string;           // 예: '수면 5시간 이하'
  selected: boolean;
  onToggle: () => void;
  categoryColor?: string;  // 예: 'bg-emerald-400'. 좌측 색상 바에 사용
}
export function EmotionChip({ emoji, label, selected, onToggle, categoryColor }: EmotionChipProps): JSX.Element
// 반환: button 요소. 미선택=card-v3 스타일, 선택=green-900 bg + white text
// 최소 높이 44px. border-radius 16px. transition 200ms
```

### CircularGauge

```tsx
// 파일: src/components/CircularGauge.tsx
interface CircularGaugeProps {
  value: number;          // 0-100. 범위 밖이면 클램프
  size?: number;          // px. default: 64
  strokeWidth?: number;   // px. default: 6
  color?: string;         // CSS color. default: '#FBBF24' (amber-400)
  label?: string;         // 중앙 텍스트. 예: '45%'
}
export function CircularGauge({ value, size, strokeWidth, color, label }: CircularGaugeProps): JSX.Element
// 반환: relative div > SVG(배경원+값원) + absolute 중앙 텍스트
// SVG: rotate(-90deg)로 12시 시작, stroke-linecap round
// 애니메이션: stroke-dashoffset transition 1s ease-out
```

### ProgressBar

```tsx
// 파일: src/components/ProgressBar.tsx
interface ProgressBarProps {
  current: number;  // 1-based. 현재 단계
  total: number;    // 총 단계 수
}
export function ProgressBar({ current, total }: ProgressBarProps): JSX.Element
// 반환: div 컨테이너(h-1 bg-green-100 rounded-full) > div 채움(bg-green-800)
// width transition 300ms ease. role="progressbar" + aria 속성
```

---

## 제약 조건

1. green-500(#74C69D), green-600(#52B788), green-700(#40916C)을 텍스트 색상(`text-green-500`, `text-green-600`, `text-green-700`)으로 사용하지 마라. 데코레이션, 아이콘 fill/stroke, 배경색에만 허용한다.
2. 보조 텍스트는 green-800(#2D6A4F, 대비 6.39:1) 또는 slate-500(#64748B)을 사용하라. 주요 텍스트는 green-900(#1B4332)을 사용하라.
3. 최소 폰트 사이즈는 12px이다. `text-[10px]`, `text-[11px]`를 사용하지 마라. 최소 Tailwind 클래스는 `text-xs` (12px)이다.
4. 인터랙티브 요소(버튼, 링크, 체크박스)의 터치 타겟은 최소 44px이다. `min-h-[44px] min-w-[44px]`을 적용하라.
5. 카드 외곽에 1px border를 사용하지 마라 (No-Line Rule). `card-v3` 클래스(배경색 차이 + shadow)로 대체하라. 테이블 내부 구분선(`border-b border-green-100`)은 허용한다.
6. 순수 #000000을 사용하지 마라. 가장 진한 텍스트 색상은 green-900(#1B4332)이다.
7. 스페이싱은 8pt 그리드(4/8/12/16/24/32/48px)를 따르라. Tailwind: `p-1`(4), `p-2`(8), `p-3`(12), `p-4`(16), `p-6`(24), `p-8`(32), `p-12`(48).
8. 기존 API 호출 코드(`fetch`), 데이터 타입(`ApiReport`), 비즈니스 로직(점수 계산, 등급 판정)을 변경하지 마라. UI/스타일만 변경하라.
9. Tailwind v4 문법을 사용하라. `@theme inline` 블록 내 CSS 변수, 유틸리티 클래스 직접 사용.
10. 새 npm 패키지를 설치하지 마라. 모든 UI는 Tailwind 유틸리티 + inline SVG + CSS로 구현하라.
11. `bg-gradient-radial`은 Tailwind에 기본 포함되지 않는다. 히어로 카드 배경 장식은 inline style(`background: radial-gradient(...)`)을 사용하라.

---

## 에지 케이스 처리

| 상황 | 조건 | 처리 |
|------|------|------|
| invest_mood 범위 밖 | `report.invest_mood`가 `'S'\|'A'\|'B'\|'C'\|'D'\|'F'` 외의 값 또는 undefined/null | `'C'`로 폴백: `const safeGrade = (['S','A','B','C','D','F'].includes(report.invest_mood) ? report.invest_mood : 'C') as GradeBadgeProps['grade']` |
| mood_score 비정상 | `report.mood_score`가 undefined, NaN, 또는 0-100 범위 밖 | CircularGauge 내부 클램프 처리. undefined/NaN인 경우 `value={report.mood_score ?? 0}`으로 전달 |
| lastReport null | Home 화면에서 `lastReport`가 null | 기존 조건부 렌더링(`{lastReport && ...}`) 유지. GradeBadge는 이 블록 안에서만 렌더링 |
| 카테고리 필터 0건 | `checklistItems.filter(item => item.category === cat)` 결과가 빈 배열 | 빈 카테고리는 현재 하드코딩 9개 항목으로 발생 불가. 향후 동적 변경 시 `{items.length > 0 && ...}` 가드 추가 |
| categoryColor undefined | EmotionChip에 `categoryColor` prop 미전달 | 좌측 색상 바를 렌더링하지 않는다: `{categoryColor && <div className="..." />}` |
| CircularGauge label 미전달 | `label` prop이 undefined | 중앙 텍스트 영역을 렌더링하지 않는다: `{label && <span>...</span>}` |
| History topGrade null | `topGrade`가 null/undefined (리포트 0건) | 옵셔널 체이닝 `topGrade?.[0]` + 폴백 `-` 텍스트 |
| bg-gradient-radial 빌드 에러 | Tailwind에서 `bg-gradient-radial` 클래스 미인식 | 제약 조건 #11에 따라 `style={{ background: 'radial-gradient(...)' }}`로 inline style 사용 |
| BottomNav pathname null | `usePathname()`이 null 반환 | `const pathname = usePathname() ?? '/'`로 폴백 |
| 바이오리듬 값 범위 | `신체/감정/지성` 값이 -100~+100 범위 밖 | Math.max(-100, Math.min(100, value))로 클램프 |

---

## 의사결정

| 결정 | 기각 대안 | 기각 이유 |
|------|----------|----------|
| Tailwind v4 유틸리티 클래스 직접 사용 | CSS Modules | 현재 코드베이스 전체가 Tailwind 유틸리티로 작성됨. 일관성 유지 |
| 공통 컴포넌트 4개 분리 (GradeBadge, EmotionChip, CircularGauge, ProgressBar) | 인라인 작성 | GradeBadge는 5개 화면, CircularGauge는 3개 화면에서 사용. 3회 이상 재사용되므로 컴포넌트 분리 |
| SVG 직접 작성 (CircularGauge) | recharts/nivo 라이브러리 | 단일 arc 표현에 외부 의존성 추가 불필요. 번들 사이즈 절약 |
| `card-v3` CSS 클래스 정의 | 매번 Tailwind 유틸리티 조합 | 동일한 카드 스타일이 30회 이상 사용됨. 클래스 하나로 일관성 보장 |
| 히어로 카드 배경 장식에 inline style 사용 | Tailwind `bg-gradient-radial` | Tailwind v4에 radial gradient 유틸리티가 기본 포함되지 않음. 별도 플러그인 설치보다 inline이 간결 |
| 체크리스트 이모지 하드코딩 | 별도 JSON/config 파일 | 항목이 9개로 고정. 동적 변경 예정 없음. 파일 분리 시 오버엔지니어링 |
