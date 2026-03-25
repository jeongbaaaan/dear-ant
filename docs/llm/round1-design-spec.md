# Round 1 개선 설계 스펙

## 목적

Audit에서 발견된 P0/P1 이슈 중 코드 품질, 보안, 테스트, UX 4개 영역의 핵심 문제를 해결하여 전체 평균 점수를 4.7 → 6.5+ 수준으로 끌어올린다.
완료 조건: 모든 변경 항목에 대해 테스트 통과 + ESLint 에러 0개 (src/ 범위).

## 파일 변경 목록

| # | 파일 경로 | 변경 유형 | 변경 내용 요약 |
|---|----------|----------|--------------|
| 1 | `package.json` | 수정 | vitest, @testing-library/react, jsdom, @vitejs/plugin-react devDependencies 추가, test 스크립트 추가 |
| 2 | `vitest.config.ts` | 생성 | Vitest 설정 (jsdom, React plugin, @/ alias) |
| 3 | `vitest.setup.ts` | 생성 | testing-library 글로벌 설정 |
| 4 | `src/lib/__tests__/report-engine.test.ts` | 생성 | report-engine.ts 단위 테스트 18개 |
| 5 | `src/lib/__tests__/local-store.test.ts` | 생성 | local-store.ts 단위 테스트 12개 |
| 6 | `next.config.ts` | 수정 | HTTP 보안 헤더 추가 (CSP, X-Frame-Options, HSTS 등) |
| 7 | `src/hooks/useCountUp.ts` | 수정 | cancelAnimationFrame cleanup 추가 |
| 8 | `src/components/PageTransition.tsx` | 수정 | setState-in-effect anti-pattern 수정 |
| 9 | `src/app/page.tsx` | 수정 | fetch res.ok 검사 추가, 에러 상태 표시 |
| 10 | `src/app/survey/page.tsx` | 수정 | 질문 뒤로가기 버튼 추가, alert→toast 교체 |
| 11 | `src/app/result/[id]/page.tsx` | 수정 | fetch res.ok 검사 추가 |
| 12 | `src/app/history/page.tsx` | 수정 | fetch res.ok 검사 추가 |
| 13 | `src/app/memo/page.tsx` | 수정 | fetch res.ok 검사, alert→toast 교체, 터치 타겟 확대, fetchMemos useCallback 래핑 |
| 14 | `src/app/api/memos/[id]/route.ts` | 수정 | PATCH body 필드 allowlist 적용 |
| 15 | `src/lib/types.ts` | 수정 | HistoryReport 타입 추가 (중복 제거용) |
| 16 | `.env.example` | 생성 | 환경변수 템플릿 |
| 17 | `.eslintrc.json` 또는 `eslint.config.mjs` | 수정 | scripts/ 디렉토리 제외 |

## 구현 순서

### Phase A: 테스트 인프라 (항목 1-5)
1. `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom` 실행
2. `vitest.config.ts` 생성
3. `vitest.setup.ts` 생성
4. `package.json`에 `"test": "vitest run"` 스크립트 추가
5. `src/lib/__tests__/report-engine.test.ts` 작성 — `getDecisionMode`, `getRiskTendency`, `getInvestMood`, `calculateMoodScore`, `calculateBiorhythm`, `generateReport` 테스트
6. `src/lib/__tests__/local-store.test.ts` 작성 — CRUD, limit, 정렬, 없는 ID 처리 테스트
7. `npx vitest run` 으로 전체 통과 확인

### Phase B: 보안 (항목 6)
8. `next.config.ts`에 `headers()` 추가 — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP, HSTS, Permissions-Policy

### Phase C: 코드 품질 (항목 7-8, 14-17)
9. `src/hooks/useCountUp.ts` — useEffect return에 cancelAnimationFrame 추가
10. `src/components/PageTransition.tsx` — setState-in-effect 수정 (useLayoutEffect 또는 ref 패턴)
11. `src/app/api/memos/[id]/route.ts` PATCH 핸들러 — body에서 허용 필드만 추출
12. `src/lib/types.ts` — `ApiReport` 인터페이스 추가
13. `eslint.config.mjs` — scripts/ 디렉토리 ignore 추가
14. `.env.example` 생성

### Phase D: 클라이언트 에러 처리 (항목 9-13)
15. 모든 fetch 호출에 `if (!res.ok)` 검사 추가 — `src/app/page.tsx`, `result/[id]/page.tsx`, `history/page.tsx`, `memo/page.tsx`, `survey/page.tsx`
16. `alert()` → `toast()` 교체 — `survey/page.tsx`, `memo/page.tsx`

### Phase E: UX 개선 (항목 10, 13)
17. `src/app/survey/page.tsx` — 질문 단계에 "이전" 버튼 추가, currentQuestion 감소 로직
18. `src/app/memo/page.tsx` — 편집/삭제 버튼 터치 타겟 확대 (p-1 → p-2.5)

### Phase F: 검증
19. `npx vitest run` 전체 통과
20. `npm run lint` src/ 범위 에러 0개
21. `npm run build` 성공

## 함수/API 시그니처 변경

### 신규 파일
- `vitest.config.ts`: `defineConfig({ plugins: [react()], test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] }, resolve: { alias: { '@': path.resolve(__dirname, './src') } } })`

### 변경 함수
- `useCountUp(end: number, duration?: number): number` — 내부 useEffect에 cleanup return 추가. 시그니처 변경 없음.
- `PATCH /api/memos/[id]` — body 처리 로직 변경. API 시그니처 변경 없음. 내부에서 `{ stock_name, action, price, quantity, memo }` 만 추출.

### 신규 타입
```typescript
// src/lib/types.ts
export interface ApiReport {
  id: string;
  decision_mode: string;
  mood_score: number;
  risk_tendency: string;
  invest_mood: string;
  biorhythm_physical: number;
  biorhythm_emotional: number;
  biorhythm_intellectual: number;
  today_keywords: string[];
  today_message: string;
  today_letter: string;
  created_at: string;
  session_mood?: string;
}
```

## 제약 조건

1. 기존 API 응답 형식을 변경하지 않는다. 클라이언트 fetch 패턴만 개선한다.
2. DB 스키마 변경은 이번 라운드에서 하지 않는다 (Round 2+ 범위).
3. scripts/ 디렉토리는 ESLint에서 제외하고 코드를 수정하지 않는다.
4. 테스트는 순수 함수(report-engine, local-store)만 대상으로 한다. 컴포넌트 테스트는 Round 2+.
5. alert() 교체 시 기존 Toast 컴포넌트와 useToast 훅을 사용한다.
6. 서베이 뒤로가기는 답변 배열을 유지하되 이전 답변을 덮어쓸 수 있게 한다.

## 의사결정

- **테스트 프레임워크**: Vitest 채택. Jest 대비 Vite 기반 Next.js와의 호환성 우수, 설정 간결. Jest는 기각 (ESM 설정 복잡).
- **보안 헤더 위치**: next.config.ts headers() 채택. middleware.ts 대비 설정이 간결하고 모든 라우트에 자동 적용. Vercel _headers 파일은 기각 (플랫폼 종속).
- **ESLint scripts/ 제외**: ignores 패턴 채택. scripts/를 ESM으로 마이그레이션하는 것은 기각 (ROI 낮음, 핵심 앱과 무관).
