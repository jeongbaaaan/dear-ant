# Dear,ANT — 콘텐츠 맵 & 기능 로드맵

## 1. 현재 콘텐츠 현황

### 탭 구조

| 탭 | 경로 | 핵심 기능 | 데이터 소스 |
|---|---|---|---|
| 홈 | `/` | 대시보드 — Hero CTA, 최근 리포트, 벤토 그리드(도구 바로가기), 포트폴리오 요약 | `/api/history` |
| 리포트 | `/survey` → `/result/[id]` | 설문 7문항 + 셀프체크 9항목 → 분석 리포트 생성 | `/api/reports` |
| 히스토리 | `/history` | 과거 리포트 기록 목록 (날짜별 그룹, 판단모드 필터) | `/api/history` |
| 저널 | `/memo` | 매매 메모 CRUD — 종목 검색(KRX 2,620종목), 수익 통계, 인사이트 | `/api/memos` |
| 더보기 | `/tools` | 도구 허브 — 적금vs투자, 복리 계산기, 수익률 계산기(예정) | - |

### 리포트 분석 엔진 (`report-engine.ts`)

설문 입력 → 6가지 산출물:

| 산출물 | 계산 방식 | 값 범위 |
|---|---|---|
| 판단 모드 | 7문항 평균 점수 기준 | 방어/관망/신중/적극 |
| 감정 흔들림 (mood_score) | 기분 가중치 + 답변 분산 | 0~100% |
| 투자 무드 등급 | 점수 40% + 안정도 60% | A/B/C/D/F |
| 바이오리듬 | sin파 (생년월일 기준 23/28/33일 주기) | -100~+100 |
| 오늘의 키워드 | 모드×기분 조합 룩업 | 3개 |
| 오늘의 편지 | 모드×기분 20가지 조합 | 개인화 텍스트 |

### 도구

| 도구 | 경로 | 기능 |
|---|---|---|
| 적금 vs 투자 | `/calculator` | 월 투자금 기준, 적금(단리+세금) vs 주식(4개 시나리오) 비교 |
| 복리 계산기 | `/compound` | 초기금+월적립+수익률+기간 → 연차별 성장 차트 |
| 수익률 계산기 | `/tools/returns` | 매수가/매도가 → 수익률 (coming soon) |

---

## 2. 경쟁앱 리서치 (2026.03.27 기준, 18개 소스)

### 한국 주요 증권앱

**토스증권** (1,500만 이용자)
- AI 어닝콜: 해외 실적발표 실시간 한국어 번역+요약 (누적 150만 이용)
- AI 일일 브리핑: 미국 지수 마감 현황 매일 아침 자동 요약
- 해외주식 소수점 ₩1,000부터 투자, 국내 수수료 무료
- 소셜/커뮤니티: 없음

**카카오페이증권** ("한국형 손안의 블룸버그")
- 간편주문: 수량/금액만 입력, 직전 체결가 ±3% 자동 최적 체결
- AI 일일 시황 요약
- 카카오톡 생태계 연계 (카카오페이 계좌에서 바로 투자)

**미니스탁** (한국투자증권, "매일이 즐거운 투자 루틴")
- 자동투자: 주식·금액·주기·기간 설정 후 자동 실행 (20-30대 42%)
- 미니톡: 보유주식 주주들 간 종목별 커뮤니티
- AI+전문가 리서치 제공

**증권플러스** (두나무)
- AI 챗봇 '우디': 투자 질문응답 (Azure OpenAI)
- AI 뉴스룸: ML로 뉴스 중요도·시급성·시장영향력 평가 후 선별
- 커뮤니티: 주주 투자 이슈·차트 분석 공유, "슈퍼 개미" 스토리

**넥스트증권** (2026 상반기 출시 예정)
- 숏폼(유튜브 쇼츠) 투자 콘텐츠 → 즉시 주문 실행 "원스톱"
- CEO: 토스증권 리테일 부문 출신

### 국제 주요 앱

**Robinhood** (2,590만 계좌)
- Robinhood Social (베타): 트위터형 피드 트레이드 공유 + 피드에서 즉시 주문
- 예측 시장: 110억 이벤트 계약 거래
- Gold ($5/월): Morningstar 무제한 + Level 2 + IRA 3% 매칭 + Cortex AI
- 게임화: 컨페티 애니메이션, 복권형 주식 리워드

**Webull** (2,600만 사용자, 매출 $571M)
- Vega AI (주간 120만 이용): 포트폴리오 미스얼라인 탐지, 음성 자연어 주문, 옵션 이상값 탐지
- 소셜 "Feeds" 탭: 커뮤니티 트레이드 토론
- Level2: 드래그앤드롭 노코드 자동매매 전략

**Moomoo**
- 가상투자 대회: $100K 가상자금 + 리더보드 + $200K 현금 보상 + Nasdaq TotalView
- 업적 시스템: 교육 과제 → Moomoo Tokens → 현금 전환
- Moo Community: 수백만 명 전략 공유
- Moomoo AI: 24/7 시장 Q&A

### 트레이딩 심리 전용 도구 (Dear,ANT 직접 경쟁 공간)

**Edgewonk** ($169/년, 웹 전용)
- **Tiltmeter**: 거래별 감정 수치화 (calm/confident/anxious/frustrated/FOMO/revenge-trading)
- 감정-성과 상관관계 장기 축적: "confident 거래 P&L이 anxious 거래의 2배"
- Pre-trade 체크리스트 (2025.5 추가)
- 단점: 브로커 연동 없음, 모바일 앱 없음

**TraderSync** ($30~$80/월)
- Cypher AI: 에쿼티 커브 모니터링, 수익 조건 자동 발견, 플랜 이탈 경고
- 950+ 브로커 자동 연동
- 마켓 리플레이: 30,000+ 자산

**MentalBro**
- Psych Score: 매일 심리적 준비도 수치화 → 트레이딩 성과 대조
- 진입 전/후 평가 + 일별/주별 요약
- 단점: 독립 앱, 한국어 미지원

---

## 3. 핵심 포지셔닝 분석

### Dear,ANT만 있는 것 (방어적 해자)
- **바이오리듬 기반 투자 준비도** — 경쟁앱 전체에 유사 기능 없음
- **거래 전 감정/컨디션 분석** — Edgewonk는 거래 후 회고, Dear,ANT는 거래 전 예방
- **복리계산기 + 적금vs투자 비교** — 증권앱 내 특화 도구 없음

### 한국 증권앱 전체에 없는 것
- **감정/심리 기반 거래 분석** — 국제적으로도 Edgewonk, TraderSync, MentalBro만 부분 제공
- Dear,ANT는 이 공간에서 **모바일 네이티브 한국어 서비스로 유일**

---

## 4. 앱별 기능 매트릭스

| 기능 | 토스 | 카카오 | 미니스탁 | Robinhood | Moomoo | Edgewonk | TraderSync | **Dear,ANT** |
|---|---|---|---|---|---|---|---|---|
| 감정/심리 분석 | X | X | X | X | X | O | 부분 | **O** |
| 바이오리듬 | X | X | X | X | X | X | X | **O** |
| 거래 전 체크 | X | X | X | X | X | O | X | **O** |
| 트레이딩 저널 | X | X | X | X | X | O | O | **O** |
| 복리계산기 | X | X | X | X | X | X | X | **O** |
| AI 시황요약 | O | O | O | X | O | X | X | X |
| 소셜 피드 | X | X | O | O(베타) | O | X | X | X |
| 게임화(대회/배지) | X | X | X | O | O | X | X | X |
| 실시간 시세 | O | O | O | O | O | X | X | X |
| 가상투자 | X | X | X | X | O | X | X | X |
| 소수점 투자 | O | X | O | O | O | X | X | X |

---

## 5. 추가 기능 로드맵 (우선순위별)

### P0 — 핵심 차별화 강화

| # | 기능 | 설명 | 벤치마크 |
|---|---|---|---|
| 1 | **매매 후 감정 기록** | 메모 작성 시 "지금 기분" 선택 → 감정-수익 상관관계 분석 | Edgewonk Tiltmeter |
| 2 | **주간/월간 감정 리포트** | "이번 주 가장 많이 매매한 감정 상태", 감정별 승률 등 | MentalBro Psych Score |
| 3 | **수익률 자동 계산** | 같은 종목 매수/매도 매칭 → 실현 손익 자동 계산 | TraderSync |

### P1 — 사용성 개선

| # | 기능 | 설명 | 벤치마크 |
|---|---|---|---|
| 4 | **투자 루틴 알림** | 매일 정해진 시간 "오늘의 리포트 받기" 푸시 | 미니스탁 "매일이 즐거운 투자 루틴" |
| 5 | **차트 스크린샷 첨부** | 매매 메모에 이미지 첨부 | Edgewonk/TraderSync |
| 6 | **전략 태그 시스템** | #스윙 #장기투자 #실적 → 전략별 승률 분석 | Edgewonk |
| 7 | **다크 모드** | M3 다크 토큰 활용 | 전 앱 공통 |

### P2 — 성장 기능

| # | 기능 | 설명 | 벤치마크 |
|---|---|---|---|
| 8 | **투자 퀴즈/교육** | 매매 심리, 리스크 관리 짧은 퀴즈 | Robinhood Learn |
| 9 | **리포트 공유 카드** | 인스타 스토리용 이미지 카드 자동 생성 | 바이럴 성장 |
| 10 | **AI 매매 코칭** | 매매 패턴 분석 → 개인화 코칭 | TraderSync Cypher AI |
| 11 | **포트폴리오 연동** | 한국투자증권 Open API 연동 | 토스증권/미니스탁 |

### P3 — 장기 비전

| # | 기능 | 설명 | 벤치마크 |
|---|---|---|---|
| 12 | **가상투자 대회** | 가상 자금으로 투자 경쟁 + 리더보드 | Moomoo Paper Trading |
| 13 | **감정 기반 커뮤니티** | 같은 종목 보유자끼리 감정 상태 공유 | Robinhood Social + Edgewonk |
| 14 | **레벨/뱃지 시스템** | 연속 기록, 원칙 준수율 기반 게이미피케이션 | Moomoo Tokens |
| 15 | **숏폼 교육 콘텐츠** | 매매 심리 짧은 영상 → 즉시 리포트 연결 | 넥스트증권 (예정) |

---

## 6. 리서치 소스

1. [토스증권 투자 가이드](https://cyberbabarian.com/2026년-토스-증권-주식-투자-가이드-소수점-매수부터-해/)
2. [토스증권 AI 어닝콜 150만](https://www.sedaily.com/NewsView/2H0M8MPVXL)
3. [TraderSync vs Edgewonk 비교](https://tradingjournal.com/blog/edgewonk-vs-tradersync)
4. [AI Trading Psychology Apps 2025](https://masterytraderacademy.com/top-ai-trading-psychology-apps-2025-guide/)
5. [Edgewonk Tiltmeter](https://edgewonk.com/blog/mastering-trading-discipline-with-edgewonks-tiltmeter)
6. [Moomoo Paper Trading Competition](https://www.prnewswire.com/apac/news-releases/moomoo-launches-second-global-paper-trading-competition-302581742.html)
7. [Robinhood Social 베타](https://www.techbuzz.ai/articles/robinhood-launches-social-trading-network-in-beta)
8. [넥스트증권 숏폼 MTS](https://www.insightkorea.co.kr/news/articleView.html?idxno=243213)
9. [카카오페이증권 MTS](https://www.thevaluenews.co.kr/news/169816)
10. [미니스탁 App Store](https://apps.apple.com/kr/app/미니스탁/id1517001633)
11. [주식 어플 순위 TOP 5](https://stockstalker.co.kr/mts-top-5/)
12. [증권플러스 Azure OpenAI](https://www.microsoft.com/ko-kr/customers/story/18875-dunamu-azure-open-ai-service)
13. [Robinhood Gold](https://robinhood.com/us/en/gold/)
14. [Webull Vega AI](https://www.prnewswire.com/news-releases/webull-unveils-vega-302605998.html)
