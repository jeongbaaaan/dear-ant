# Dear,ANT UI 전면 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dear,ANT의 UI를 토스 스타일 데스크톱 퍼스트 디자인으로 전면 리디자인. 디자인 토큰 교체 → 공통 컴포넌트 → 8개 페이지 순차 적용.

**Architecture:** TailwindCSS 4 CSS 변수 기반 디자인 토큰 시스템. 사이드바(데스크톱) ↔ 바텀탭(모바일) 반응형 네비. 기존 localStorage 데이터 레이어와 report-engine.ts 로직은 변경 없이 UI만 교체.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS 4, Manrope font, Material Symbols Outlined icons

**Design Spec:** `docs/superpowers/specs/2026-04-09-ui-redesign-design.md`
**Visual Mockups:** `.superpowers/brainstorm/84005-1775723306/content/` (HTML 목업 8개)

---

## File Structure

### New Files

| File | Purpose |
|------|---------|
| `src/components/Sidebar.tsx` | 데스크톱 사이드바 네비게이션 (240px fixed, 6개 링크) |
| `src/components/SliderInput.tsx` | 슬라이더+직접입력 양방향 바인딩 컴포넌트 |
| `src/components/Sparkline.tsx` | 인라인 SVG 미니 라인차트 (24px height) |
| `src/components/DataTable.tsx` | 데스크톱 테이블 + 모바일 리스트 반응형 |
| `src/components/HoverTooltip.tsx` | 차트 데이터포인트 hover 툴팁 |
| `src/components/ConditionGauge.tsx` | 실시간 업데이트 원형 게이지 (셀프체크용) |
| `src/components/TrendChart.tsx` | 에어리어 라인차트 (컨디션 추이) |
| `src/components/StackBarChart.tsx` | 원금+수익 스택 바 차트 |
| `src/components/CompareBar.tsx` | 적금 vs 주식 비교 바 |
| `src/components/EmotionGrid.tsx` | 주간 감정 dot grid |

### Modified Files

| File | Change Summary |
|------|---------------|
| `src/app/globals.css` | 디자인 토큰 전면 교체 |
| `src/app/layout.tsx` | Sidebar + 반응형 shell |
| `src/components/BottomNav.tsx` | 모바일 전용 조건부 렌더링 |
| `src/app/page.tsx` | 홈 전면 리디자인 |
| `src/app/survey/page.tsx` | 카테고리 그룹핑 + 실시간 게이지 |
| `src/app/result/[id]/page.tsx` | Hero Score + 편지 섹션 |
| `src/app/report/page.tsx` | history 통합 + 데이터 테이블 |
| `src/app/memo/page.tsx` | 2-col + 사이드바 |
| `src/app/calculator/page.tsx` | 슬라이더 + 비교바 |
| `src/app/compound/page.tsx` | 슬라이더 + 스택차트 |
| `src/app/tools/simulator/page.tsx` | 2-col + 칩 수수료 |

### Deleted Files

| File | Reason |
|------|--------|
| `src/app/history/page.tsx` | `/report`에 통합 |
| `src/app/tools/page.tsx` | 사이드바 직접 링크로 대체 |

---

## Task 1: Design Tokens — globals.css 전면 교체

**Files:**
- Modify: `src/app/globals.css`

**Context:** 현재 globals.css(205줄)는 Material Design 3 초록 tonal palette + Plus Jakarta Sans/Manrope 2중 폰트 + glass 효과 기반. 이를 토스 스타일 중립 배경 + 포인트 컬러 시스템으로 교체.

- [ ] **Step 1: globals.css 백업 확인 후 디자인 토큰 교체**

`src/app/globals.css` 전체를 아래 내용으로 교체. Plus Jakarta Sans 제거, Manrope 단일 폰트. 배경 #f7f7f7, 카드 #fff, 초록은 CTA/뱃지만. glass 효과 제거, 중립 쉐도우.

```css
@import "tailwindcss";

/* ===== DESIGN TOKENS ===== */
@theme {
  /* Primary (상추그린) — CTA, active nav, positive numbers, badges only */
  --color-primary: #006b1b;
  --color-primary-dim: #005a17;
  --color-primary-container: #e8f5e9;
  --color-on-primary: #ffffff;

  /* Surfaces — neutral gray system */
  --color-background: #f7f7f7;
  --color-surface: #ffffff;
  --color-surface-dim: #fafafa;
  --color-surface-container: #f5f5f5;
  --color-surface-border: #f0f0f0;

  /* Text */
  --color-on-surface: #191919;
  --color-on-surface-secondary: #666666;
  --color-on-surface-tertiary: #999999;
  --color-on-surface-quaternary: #bbbbbb;
  --color-on-surface-quinary: #cccccc;

  /* Semantic */
  --color-error: #c62828;
  --color-error-container: #fce4ec;
  --color-amber: #f57f17;
  --color-amber-container: #fff8e1;
  --color-blue: #1565c0;
  --color-blue-container: #e3f2fd;

  /* Elevation (neutral black shadows) */
  --shadow-raised: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-elevated: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);

  /* Spacing */
  --spacing-section: 40px;
  --spacing-card: 24px;
  --spacing-page-desktop: 48px;
  --spacing-page-mobile: 20px;
  --spacing-element: 16px;

  /* Typography */
  --font-family-base: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Layout */
  --sidebar-width: 240px;
  --sidebar-collapsed: 64px;
  --bottomnav-height: 56px;

  /* Animation */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ===== BASE ===== */
body {
  font-family: var(--font-family-base);
  background-color: var(--color-background);
  color: var(--color-on-surface);
  -webkit-font-smoothing: antialiased;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes chipBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes toast {
  0% { opacity: 0; transform: translateY(16px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== ANIMATION UTILITIES ===== */
.animate-fadeIn { animation: fadeIn 0.3s var(--ease-out) both; }
.animate-slideUp { animation: slideUp 0.4s var(--ease-out) both; }
.animate-scaleIn { animation: scaleIn 0.3s var(--ease-out) both; }
.animate-chipBounce { animation: chipBounce 0.15s ease both; }
.animate-toast { animation: toast 0.3s var(--ease-out) both; }

.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.3s; }

/* ===== SKELETON SHIMMER ===== */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

/* ===== CARD SYSTEM ===== */
.card {
  background: var(--color-surface);
  border-radius: 16px;
  padding: var(--spacing-card);
}
.card-flat { border: 1px solid var(--color-surface-border); }
.card-raised { box-shadow: var(--shadow-raised); }
.card-elevated { box-shadow: var(--shadow-elevated); }
.card-accent {
  background: linear-gradient(135deg, var(--color-primary) 0%, #008a24 100%);
  color: var(--color-on-primary);
}

/* ===== BUTTON SYSTEM ===== */
.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dim); }
.btn-secondary { background: var(--color-surface-container); color: var(--color-on-surface-secondary); }
.btn-ghost { background: transparent; color: var(--color-primary); }
.btn-ghost:hover { background: var(--color-primary-container); }
.btn-danger { background: var(--color-error-container); color: var(--color-error); }
.btn-lg { padding: 16px 32px; font-size: 16px; border-radius: 14px; }

/* ===== CHIP SYSTEM ===== */
.chip {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid transparent;
}
.chip-default { background: var(--color-surface-container); color: var(--color-on-surface-secondary); border-color: var(--color-surface-border); }
.chip-selected { background: var(--color-primary-container); color: var(--color-primary); border-color: var(--color-primary); }
.chip-active { background: var(--color-primary); color: var(--color-on-primary); border-color: var(--color-primary); }

/* ===== INPUT SYSTEM ===== */
.input-field {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #e8e8e8;
  background: var(--color-surface-dim);
  font-family: var(--font-family-base);
  font-size: 15px;
  color: var(--color-on-surface);
  outline: none;
  transition: all 0.15s;
}
.input-field:focus {
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(0, 107, 27, 0.08);
}
.input-field::placeholder { color: var(--color-on-surface-quinary); }

/* ===== BADGE SYSTEM ===== */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}
.badge-green { background: var(--color-primary-container); color: var(--color-primary); }
.badge-amber { background: var(--color-amber-container); color: var(--color-amber); }
.badge-red { background: var(--color-error-container); color: var(--color-error); }
.badge-blue { background: var(--color-blue-container); color: var(--color-blue); }
.badge-gray { background: var(--color-surface-container); color: var(--color-on-surface-secondary); }

/* ===== SLIDER ===== */
.slider {
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e8e8e8;
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 107, 27, 0.3);
}

/* ===== PROGRESS BAR ===== */
.progress-bar {
  height: 6px;
  background: var(--color-surface-border);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* ===== DATA TABLE ===== */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-on-surface-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-surface-border);
}
.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--color-background);
}
.data-table tr:hover { background: var(--color-surface-dim); }

/* ===== LAYOUT ===== */
.app-shell {
  display: flex;
  min-height: 100vh;
}

.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: var(--spacing-page-desktop);
  max-width: calc(1200px + var(--spacing-page-desktop) * 2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1023px) {
  .main-content {
    margin-left: var(--sidebar-collapsed);
  }
}

@media (max-width: 767px) {
  .main-content {
    margin-left: 0;
    padding: var(--spacing-page-mobile);
    padding-bottom: calc(var(--bottomnav-height) + 24px + env(safe-area-inset-bottom));
  }
}

/* ===== SCROLLBAR ===== */
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* ===== SECTION LABEL ===== */
.section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-primary);
  margin-bottom: 16px;
}
```

- [ ] **Step 2: 브라우저에서 확인**

Run: `npm run dev`

기대 결과: 배경이 #f7f7f7으로 변경됨. 기존 페이지들의 레이아웃이 깨질 수 있으나 정상 — 이후 Task에서 페이지별로 수정.

- [ ] **Step 3: 커밋**

```bash
git add src/app/globals.css
git commit -m "refactor: 디자인 토큰 전면 교체 — 토스 스타일 중립 배경 + 포인트 컬러"
```

---

## Task 2: Sidebar 컴포넌트 생성

**Files:**
- Create: `src/components/Sidebar.tsx`

- [ ] **Step 1: Sidebar.tsx 생성**

```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '리포트', icon: 'description' },
  { href: '/memo', label: '트레이딩 저널', icon: 'edit_note' },
];

const toolItems = [
  { href: '/calculator', label: '적금 vs 투자', icon: 'compare_arrows' },
  { href: '/compound', label: '복리 계산기', icon: 'trending_up' },
  { href: '/tools/simulator', label: '매매 시뮬레이터', icon: 'calculate' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 bottom-0 w-[var(--sidebar-width)] bg-surface border-r border-surface-border p-6 flex flex-col hidden md:flex">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 py-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychiatry
          </span>
        </div>
        <span className="text-lg font-extrabold tracking-tight">
          Dear,<span className="text-primary">ANT</span>
        </span>
      </Link>

      {/* Menu Section */}
      <div className="mb-6">
        <div className="section-label px-3">Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-sm font-medium transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-secondary hover:bg-background'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Tools Section */}
      <div className="mb-6">
        <div className="section-label px-3">Tools</div>
        {toolItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-sm font-medium transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-secondary hover:bg-background'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-surface-border px-3">
        <span className="text-xs text-on-surface-quaternary">Dear,ANT v1.0</span>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: Sidebar 컴포넌트 생성 — 데스크톱 사이드바 네비게이션"
```

---

## Task 3: Layout 반응형 shell 구조

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/BottomNav.tsx`

- [ ] **Step 1: layout.tsx에 Sidebar 추가 + Plus Jakarta Sans 제거**

`src/app/layout.tsx`를 아래로 교체:

```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Dear,ANT - 당신만을 위한 투자 리포트',
  description: '감정과 컨디션을 분석해서 오늘의 투자 판단을 도와드립니다',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#006b1b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="font-[var(--font-family-base)]">
        <ClientProviders>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: BottomNav를 모바일 전용으로 수정**

`src/components/BottomNav.tsx`를 아래로 교체:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '리포트', icon: 'description' },
  { href: '/memo', label: '저널', icon: 'edit_note' },
  { href: '/calculator', label: '더보기', icon: 'more_horiz' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-border md:hidden z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-quaternary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: dev 서버에서 확인**

Run: `npm run dev`

기대 결과: 데스크톱에서 좌측 사이드바 + 메인 영역. 모바일 폭(767px 이하)에서 사이드바 숨기고 바텀 네비 표시.

- [ ] **Step 4: 커밋**

```bash
git add src/app/layout.tsx src/components/BottomNav.tsx
git commit -m "feat: 반응형 shell — 데스크톱 사이드바 + 모바일 바텀네비"
```

---

## Task 4: 공통 컴포넌트 — SliderInput

**Files:**
- Create: `src/components/SliderInput.tsx`

- [ ] **Step 1: SliderInput.tsx 생성**

```tsx
'use client';

import { useState, useCallback } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatter?: (value: number) => string;
  marks?: { value: number; label: string }[];
}

export default function SliderInput({
  label, value, onChange, min, max, step = 1, unit = '', formatter, marks,
}: SliderInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const displayValue = formatter ? formatter(value) : `${value.toLocaleString()}${unit}`;

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange(v);
    setInputValue(String(v));
  }, [onChange]);

  const handleInputSubmit = useCallback(() => {
    const parsed = Number(inputValue.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setInputValue(String(clamped));
    }
    setIsEditing(false);
  }, [inputValue, min, max, onChange]);

  return (
    <div className="mb-0">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[13px] font-semibold text-on-surface-secondary">{label}</span>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            autoFocus
            className="w-28 text-right text-base font-extrabold text-primary bg-transparent border-b-2 border-primary outline-none"
          />
        ) : (
          <button
            onClick={() => { setInputValue(String(value)); setIsEditing(true); }}
            className="text-base font-extrabold text-primary hover:underline cursor-pointer"
          >
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
      />
      {marks && (
        <div className="flex justify-between mt-1.5">
          {marks.map((m) => (
            <span key={m.value} className="text-[11px] text-on-surface-quaternary">{m.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/SliderInput.tsx
git commit -m "feat: SliderInput 컴포넌트 — 슬라이더+직접입력 양방향 바인딩"
```

---

## Task 5: 공통 컴포넌트 — Sparkline, HoverTooltip, ConditionGauge, EmotionGrid

**Files:**
- Create: `src/components/Sparkline.tsx`
- Create: `src/components/HoverTooltip.tsx`
- Create: `src/components/ConditionGauge.tsx`
- Create: `src/components/EmotionGrid.tsx`

- [ ] **Step 1: Sparkline.tsx 생성**

```tsx
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({ data, width = 120, height = 24, color = '#006b1b' }: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 2: HoverTooltip.tsx 생성**

```tsx
'use client';

import { useState } from 'react';

interface HoverTooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function HoverTooltip({ content, children }: HoverTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative inline-block"
      onMouseEnter={(e) => { setShow(true); setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }); }}
      onMouseMove={(e) => setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="absolute z-50 px-3 py-1.5 bg-on-surface text-surface text-xs font-semibold rounded-lg pointer-events-none whitespace-nowrap"
          style={{ left: pos.x + 8, top: pos.y - 32 }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: ConditionGauge.tsx 생성 (기존 CircularGauge 확장)**

```tsx
'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface ConditionGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function ConditionGauge({ value, size = 80, strokeWidth = 6, animated = true }: ConditionGaugeProps) {
  const displayValue = animated ? useCountUp(value, 800) : value;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(value, 100) / 100);

  const getColor = (v: number) => {
    if (v >= 70) return '#006b1b';
    if (v >= 40) return '#f57f17';
    return '#c62828';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor(value)} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-extrabold" style={{ fontSize: size * 0.22, color: getColor(value) }}>
          {Math.round(displayValue)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: EmotionGrid.tsx 생성**

```tsx
import { Mood } from '@/lib/types';

interface EmotionDay {
  day: string;
  mood?: Mood;
  isToday?: boolean;
}

const moodEmoji: Record<Mood, string> = {
  '불안': '😰', '초조': '😤', '평온': '😌', '설렘': '🤩', '자신감': '💪',
};

const moodBg: Record<Mood, string> = {
  '불안': 'bg-error-container', '초조': 'bg-amber-container', '평온': 'bg-primary-container',
  '설렘': 'bg-amber-container', '자신감': 'bg-blue-container',
};

export default function EmotionGrid({ days }: { days: EmotionDay[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d, i) => (
        <div key={i} className="text-center">
          <div className={`w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-sm ${
            d.mood ? moodBg[d.mood] : 'bg-surface-container'
          }`}>
            {d.mood ? moodEmoji[d.mood] : ''}
          </div>
          <span className={`text-[10px] ${d.isToday ? 'text-primary font-semibold' : 'text-on-surface-quaternary'}`}>
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/components/Sparkline.tsx src/components/HoverTooltip.tsx src/components/ConditionGauge.tsx src/components/EmotionGrid.tsx
git commit -m "feat: 공통 컴포넌트 — Sparkline, HoverTooltip, ConditionGauge, EmotionGrid"
```

---

## Task 6: 공통 컴포넌트 — TrendChart, StackBarChart, CompareBar

**Files:**
- Create: `src/components/TrendChart.tsx`
- Create: `src/components/StackBarChart.tsx`
- Create: `src/components/CompareBar.tsx`

- [ ] **Step 1: TrendChart.tsx 생성**

```tsx
'use client';

import { useState } from 'react';

interface TrendChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export default function TrendChart({ data, height = 120, color = '#006b1b' }: TrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  if (data.length < 2) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 600;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d.value - min) / range) * (height - 20) - 10;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${w},${height} L0,${height} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendGrad)" opacity="0.12" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle
            key={i} cx={p.x} cy={p.y} r={hoverIndex === i ? 6 : 0}
            fill={color} opacity={hoverIndex === i ? 1 : 0}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            className="cursor-pointer"
          />
        ))}
        {/* Invisible hover targets */}
        {points.map((p, i) => (
          <rect
            key={`hit-${i}`} x={p.x - 15} y={0} width={30} height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}
      </svg>
      {hoverIndex !== null && (
        <div
          className="absolute bg-on-surface text-surface text-xs font-semibold px-2.5 py-1 rounded-lg pointer-events-none"
          style={{ left: `${(hoverIndex / (data.length - 1)) * 100}%`, top: -28, transform: 'translateX(-50%)' }}
        >
          {data[hoverIndex].value}%
        </div>
      )}
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-[11px] text-on-surface-quaternary">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: StackBarChart.tsx 생성**

```tsx
'use client';

import { useState } from 'react';

interface StackBarData {
  label: string;
  principal: number;
  profit: number;
}

export default function StackBarChart({ data, height = 140 }: { data: StackBarData[]; height?: number }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxTotal = Math.max(...data.map(d => d.principal + d.profit));

  return (
    <div className="relative">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const total = d.principal + d.profit;
          const totalH = (total / maxTotal) * height;
          const principalH = (d.principal / total) * totalH;
          const profitH = totalH - principalH;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="w-full rounded-t" style={{ height: profitH, background: '#006b1b' }} />
              <div className="w-full" style={{ height: principalH, background: '#e0e0e0' }} />
              <span className={`text-[10px] mt-1 ${i === data.length - 1 ? 'text-primary font-semibold' : 'text-on-surface-quaternary'}`}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      {hoverIndex !== null && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs font-semibold px-3 py-1.5 rounded-lg pointer-events-none z-10">
          원금 {data[hoverIndex].principal.toLocaleString()} · 수익 {data[hoverIndex].profit.toLocaleString()}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: CompareBar.tsx 생성**

```tsx
interface CompareBarProps {
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  formatter?: (v: number) => string;
}

export default function CompareBar({ leftLabel, leftValue, rightLabel, rightValue, formatter }: CompareBarProps) {
  const total = leftValue + rightValue;
  const leftPct = total > 0 ? (leftValue / total) * 100 : 50;
  const fmt = formatter || ((v: number) => v.toLocaleString());

  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span>{leftLabel} <span className="text-on-surface-tertiary">{fmt(leftValue)}</span></span>
        <span>{rightLabel} <span className="text-primary">{fmt(rightValue)}</span></span>
      </div>
      <div className="h-8 bg-surface-border rounded-lg overflow-hidden flex">
        <div
          className="h-full flex items-center justify-center text-xs font-bold text-white bg-[#90a4ae] transition-all duration-500"
          style={{ width: `${leftPct}%` }}
        >
          {leftLabel}
        </div>
        <div
          className="h-full flex items-center justify-center text-xs font-bold text-white bg-primary transition-all duration-500"
          style={{ width: `${100 - leftPct}%` }}
        >
          {rightLabel}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 커밋**

```bash
git add src/components/TrendChart.tsx src/components/StackBarChart.tsx src/components/CompareBar.tsx
git commit -m "feat: 차트 컴포넌트 — TrendChart, StackBarChart, CompareBar"
```

---

## Task 7: 홈 페이지 리디자인

**Files:**
- Modify: `src/app/page.tsx`

**Context:** 현재 홈은 모바일 퍼스트 단일 컬럼. greeting, hero CTA, 4-col stats, 2-col 레이아웃, 3-col tools grid, portfolio + history로 변경. 기존 데이터 로딩 로직(clientStore.listReports, listMemos)과 포트폴리오 계산(평균단가법)은 유지.

- [ ] **Step 1: page.tsx를 디자인 스펙 Section 4.1 기준으로 전면 교체**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-home.html`

기존 `useState`, `useEffect`, `useMemo` 로직은 그대로 유지. JSX 리턴부를 교체.

핵심 구조:
```
Greeting (날짜 + 인사)
Hero CTA (그린 그라데이션 → /survey 링크)
Stats Row (4-col grid: 총 리포트, 평균 컨디션, 수익률, 거래)
2-col: 최근 리포트 (ConditionGauge + badges) | 이번 주 활동 (bar chart)
투자 도구 (3-col grid: 3개 tool cards)
2-col: 포트폴리오 (종목별 손익) | 최근 기록 (타임라인)
```

모든 숫자에 `<CountUp>` 적용, Stats 카드에 `<Sparkline>` 추가.

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`

기대 결과: 빌드 성공.

- [ ] **Step 3: 커밋**

```bash
git add src/app/page.tsx
git commit -m "feat: 홈 페이지 리디자인 — 토스 스타일 대시보드 레이아웃"
```

---

## Task 8: 셀프체크 페이지 리디자인

**Files:**
- Modify: `src/app/survey/page.tsx`

**Context:** 현재 survey는 단계별 분리(1/3→2/3→3/3). 데스크톱에서는 한 화면에 전체 표시. 카테고리별 그룹핑(컨디션/심리/외부영향), 스텝 pill, 실시간 ConditionGauge, 하단 고정 액션바 추가. 기존 conditionItems 배열과 question/answer 로직 유지.

- [ ] **Step 1: survey/page.tsx를 디자인 스펙 Section 4.2 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-survey.html`

핵심 변경:
- 프로그레스 바 + 스텝 pill 3개 (셀프체크 → Q&A → 리포트)
- 카테고리 아이콘+색상 그룹핑 (favorite/💚, psychology/💛, language/💙)
- 상단 ConditionGauge (선택할 때마다 실시간 업데이트)
- 칩 선택 시 chipBounce 애니메이션
- 하단 고정 액션바 (돌아가기 + 다음)

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add src/app/survey/page.tsx && git commit -m "feat: 셀프체크 리디자인 — 카테고리 그룹핑 + 실시간 게이지"
```

---

## Task 9: 리포트 상세 페이지 리디자인

**Files:**
- Modify: `src/app/result/[id]/page.tsx`

**Context:** 현재 result 페이지는 정보를 순서대로 나열. Hero Score 카드(그린 그라데이션 + 게이지 + Grade), 2-col 바이오리듬+리스크, 키워드 pill, 편지 섹션으로 변경. 기존 clientStore.getReport(id) 로직 유지.

- [ ] **Step 1: result/[id]/page.tsx를 디자인 스펙 Section 4.3 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-report-detail.html`

핵심 구조:
```
Back link (← 리포트 목록)
Header (날짜 + "Dear,ANT Report" + badges)
Hero Score (card-accent: gauge + message + grade)
3-col stats (판단모드 / 리스크 / 감정안정도)
2-col: 바이오리듬 SVG 3색 차트 | 리스크바 + 판단모드 카드
키워드 pills
편지 (아바타 + letter body)
액션 (공유/PDF/다시체크)
```

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add "src/app/result/[id]/page.tsx" && git commit -m "feat: 리포트 상세 리디자인 — Hero Score + 편지 섹션"
```

---

## Task 10: 리포트 목록 + history 통합

**Files:**
- Modify: `src/app/report/page.tsx`
- Delete: `src/app/history/page.tsx`

**Context:** `/report`와 `/history`는 거의 동일. `/report`에 history 기능 통합. stats+추이차트+필터+데이터 테이블. `/history` 삭제.

- [ ] **Step 1: report/page.tsx를 디자인 스펙 Section 4.4 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-report-list.html`

핵심 구조:
```
Header ("리포트" + 새 리포트 받기 버튼)
Stats 4-col (총 리포트 + sparkline, 평균 컨디션 + sparkline, 가장 많은 모드, 평균 등급)
TrendChart (컨디션 추이, 1주/1개월/3개월 전환)
필터 chips + 뷰 토글
데이터 테이블 (날짜, 판단모드, 컨디션%, 등급, 키워드, → 화살표)
```

기존 report의 `groupByDate`, `filterReports` 로직 유지. history의 추가 필터 로직 병합.

- [ ] **Step 2: history/page.tsx 삭제**

```bash
rm src/app/history/page.tsx
```

`src/app/history/` 디렉토리도 비어있으면 삭제:
```bash
rmdir src/app/history 2>/dev/null || true
```

- [ ] **Step 3: 빌드 확인 + 커밋**

```bash
npm run build && git add -A && git commit -m "feat: 리포트 목록 리디자인 + history 통합, history 페이지 삭제"
```

---

## Task 11: 트레이딩 저널 리디자인

**Files:**
- Modify: `src/app/memo/page.tsx`

**Context:** 현재 memo는 3탭(전체/포트폴리오/감정). 메인+사이드바(360px) 2-col로 변경. 거래 테이블 + 사이드바(포트폴리오, 주간거래량, 감정grid, 인사이트). 기존 clientStore.listMemos, portfolio 계산 로직 유지.

- [ ] **Step 1: memo/page.tsx를 디자인 스펙 Section 4.5 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-journal.html`

핵심 구조:
```
Header + 거래 기록하기 버튼
Stats 4-col (누적 손익, 총 거래, 승률, 보유 종목)
탭 3개 (거래 기록 / 포트폴리오 / 감정 분석)
grid grid-cols-[1fr_360px]:
  Main: 필터 chips + 거래 데이터 테이블
  Sidebar: 포트폴리오 card + 주간 거래량 chart + EmotionGrid + 인사이트
```

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add src/app/memo/page.tsx && git commit -m "feat: 트레이딩 저널 리디자인 — 2-col + 사이드바 패널"
```

---

## Task 12: 적금 vs 투자 계산기 리디자인

**Files:**
- Modify: `src/app/calculator/page.tsx`

**Context:** 현재 calculator는 텍스트 인풋 + 칩. 슬라이더+직접입력, 2-col(입력+결과), 비교바, 결과 카드로 변경. 기존 계산 로직(단리/복리, 세금 15.4%, 4 시나리오) 유지.

- [ ] **Step 1: calculator/page.tsx를 디자인 스펙 Section 4.6 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-calculators.html` (Page 6)

핵심 변경:
- `<SliderInput>` 사용 (월 투자금, 이자율)
- 칩 선택 (투자 기간, 시나리오)
- 2-col: 입력 card | 결과 (hero result card + 3-col 비교 + CompareBar)
- 실시간 재계산 (슬라이더/칩 onChange → state → 결과 업데이트)

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add src/app/calculator/page.tsx && git commit -m "feat: 적금vs투자 리디자인 — 슬라이더 + 비교바 시각화"
```

---

## Task 13: 복리 계산기 리디자인

**Files:**
- Modify: `src/app/compound/page.tsx`

**Context:** 현재 compound는 인풋 4개 + 큰 테이블. 슬라이더 4개 + StackBarChart + 2-col으로 변경. 기존 복리 계산 로직 유지.

- [ ] **Step 1: compound/page.tsx를 디자인 스펙 Section 4.7 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-calculators.html` (Page 7)

핵심 변경:
- `<SliderInput>` 4개 (초기 투자금, 월 적립금, 수익률, 기간)
- `<StackBarChart>` (연도별 원금+수익)
- Hero 결과 카드 + 3-col (원금/수익/수익률)
- 기존 연도별 테이블은 progressive disclosure로 접기

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add src/app/compound/page.tsx && git commit -m "feat: 복리 계산기 리디자인 — 슬라이더 + 스택 바 차트"
```

---

## Task 14: 매매 시뮬레이터 리디자인

**Files:**
- Modify: `src/app/tools/simulator/page.tsx`

**Context:** 현재 simulator는 수익률 계산 + 물타기 2탭. 2-col(폼+결과), 수수료 칩 선택, 상세 내역 테이블로 변경. 기존 수수료/세금 계산 로직(거래세 0.18%, 양도세 22% 250만 공제) 유지.

- [ ] **Step 1: tools/simulator/page.tsx를 디자인 스펙 Section 4.8 기준으로 리디자인**

목업 참고: `.superpowers/brainstorm/84005-1775723306/content/page-calculators.html` (Page 8)

핵심 변경:
- 탭 (수익률 계산 / 물타기 계산) 유지
- 2-col: 입력 card (2-col 폼: 매수가+수량, 매도가+수량) + 결과 card
- 수수료 칩 (무료/0.015%/0.05%/0.1%)
- 결과 테이블 (매수금액, 매도금액, 수수료, 거래세, 양도세, 순수익, 손익분기가)
- 키 입력마다 즉시 재계산

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add src/app/tools/simulator/page.tsx && git commit -m "feat: 매매 시뮬레이터 리디자인 — 2-col + 수수료 칩"
```

---

## Task 15: tools 허브 삭제 + 라우팅 정리

**Files:**
- Delete: `src/app/tools/page.tsx`

- [ ] **Step 1: tools/page.tsx 삭제**

```bash
rm src/app/tools/page.tsx
```

`/tools` 접근 시 404가 되지만, 사이드바에서 직접 `/calculator`, `/compound`, `/tools/simulator`로 링크하므로 문제 없음. `/tools/simulator`는 그대로 유지.

- [ ] **Step 2: 빌드 확인 + 커밋**

```bash
npm run build && git add -A && git commit -m "chore: tools 허브 페이지 삭제 — 사이드바 직접 링크로 대체"
```

---

## Task 16: 인터랙션 마무리 + 전체 점검

**Files:**
- Modify: 각 페이지 (인터랙션 누락 보완)

- [ ] **Step 1: 전체 페이지 인터랙션 점검**

각 페이지에서 아래 7종 인터랙션 적용 여부 확인:

| 인터랙션 | 적용 위치 | 확인 |
|---------|-----------|------|
| 카운트업 | 홈 Stats, 포트폴리오, 리포트 점수, 계산기 결과 | |
| 스파크라인 | 홈 Stats, 리포트 목록 Stats | |
| 슬라이더+직접입력 | 적금vs투자, 복리계산기 | |
| Hover Reveal | 바이오리듬, 추이차트, 복리차트, 거래량 | |
| Skeleton Shimmer | 모든 데이터 로딩 구간 | |
| Progressive Disclosure | 리포트 바이오리듬 상세, 복리 테이블 | |
| 칩 바운스 | 셀프체크, 모든 칩 선택기 | |

누락된 인터랙션을 해당 페이지에 추가.

- [ ] **Step 2: 반응형 전체 점검**

데스크톱(1024px+), 태블릿(768-1023px), 모바일(~767px)에서 전 페이지 확인:
- 사이드바 → 아이콘레일 → 바텀네비 전환
- 그리드 축소 (3-col → 2-col → 1-col)
- 테이블 → 리스트 전환
- 터치 인터랙션 (hover → tap)

- [ ] **Step 3: 테스트 실행**

Run: `npm run test`

기존 160개 테스트 전부 통과 확인. UI 변경으로 인한 테스트 깨짐 수정.

- [ ] **Step 4: 최종 빌드 확인**

Run: `npm run build`

기대 결과: 0 errors, 0 warnings.

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "feat: 인터랙션 마무리 + 반응형 점검 완료"
```

---

## Summary

| Task | Description | New Files | Modified | Deleted |
|------|------------|-----------|----------|---------|
| 1 | Design Tokens | — | globals.css | — |
| 2 | Sidebar | Sidebar.tsx | — | — |
| 3 | Layout Shell | — | layout.tsx, BottomNav.tsx | — |
| 4 | SliderInput | SliderInput.tsx | — | — |
| 5 | Small Components | Sparkline, HoverTooltip, ConditionGauge, EmotionGrid | — | — |
| 6 | Chart Components | TrendChart, StackBarChart, CompareBar | — | — |
| 7 | 홈 | — | page.tsx | — |
| 8 | 셀프체크 | — | survey/page.tsx | — |
| 9 | 리포트 상세 | — | result/[id]/page.tsx | — |
| 10 | 리포트 목록 | — | report/page.tsx | history/page.tsx |
| 11 | 저널 | — | memo/page.tsx | — |
| 12 | 적금vs투자 | — | calculator/page.tsx | — |
| 13 | 복리계산기 | — | compound/page.tsx | — |
| 14 | 매매시뮬레이터 | — | tools/simulator/page.tsx | — |
| 15 | tools 삭제 | — | — | tools/page.tsx |
| 16 | 인터랙션+점검 | — | 각 페이지 | — |
