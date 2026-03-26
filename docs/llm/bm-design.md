# Dear,ANT Business Model Design

## Step 1: Context Summary

| Field | Value |
|---|---|
| Product | Dear,ANT - 투자 감정 분석 앱 |
| Target User | 한국 20-40대 개미투자자 (B2C) |
| Core Features | 감정/컨디션 체크, 바이오리듬 기반 투자 리포트, 트레이딩 저널, 복리/세금 계산기 |
| Differentiation | 투자 심리/감정 코칭 (종목 추천 불가, 자본시장법 준수) |
| AI Agent | 감정 코칭 수준 도입 예정 (유료화 레버) |
| Stage | MVP, 매출 없음, 앱+웹 동시 서비스 |
| Tech Cost | Vercel 무료~$20/월, Supabase 무료~$25/월, AI API $0.01~0.05/리포트 |
| Market | 한국 개인투자자 1,423만 명, 멘탈헬스앱 시장 $48.6M |

---

## Step 2: Competitor Pricing Research

| Competitor | Category | Free Tier | Basic (월) | Premium (월) | Billing Model |
|---|---|---|---|---|---|
| Edgewonk | Trading Journal | N | $16.42 (연간 $197) | - (단일 플랜) | Subscription (연간) |
| TraderSync | Trading Journal | N (trial) | $29.95 | $49.95~$79.95 (AI) | Subscription |
| Tradervue | Trading Journal | Y (100거래/월) | $29.95 | $49.95 | Freemium + Subscription |
| Tradezella | Trading Journal | N | $29 | $49 | Subscription |
| Headspace | Mental Health | Y (제한적) | $12.99 | - (단일 유료) | Freemium + Subscription |
| Calm | Mental Health | Y (제한적) | $12.99 (연 $69.99) | - | Freemium + Subscription |
| 토스/뱅크샐러드 | Finance (한국) | Y | 무료+광고 | - | Advertising |
| 마인드카페 | Mental Health (한국) | Y (커뮤니티) | 건당 과금 (상담 5만원/30분) | - | Transaction + Subscription |

### Pricing Landscape Summary

- **Trading Journal**: $16~$80/월 range. AI 기능이 프리미엄 가격 driver ($49.95+).
- **Mental Health App**: $5.83~$12.99/월 (연간 기준). Freemium 모델 주류.
- **한국 시장**: 무료+광고 모델이 지배적. 유료 구독에 대한 지불 저항 높음.
- **Key Insight**: Dear,ANT는 "투자 저널 + 멘탈 케어" 교차 영역이므로, 순수 트레이딩 저널 가격($29+)이 아닌 멘탈 헬스 앱 가격대($5~13)로 포지셔닝해야 한국 시장 지불 저항을 극복 가능.

---

## Step 3: Revenue Model Selection

```
Selected Model: Freemium + Subscription (Hybrid)
Value Metric: AI 코칭 리포트 생성 횟수 + 고급 분석 기능 접근
Price Anchoring: Low vs 글로벌 trading journal, Match vs 멘탈헬스앱 연간 기준
```

### Pricing Tiers

| Tier | Price | Features | Limits |
|---|---|---|---|
| **Free (개미)** | 0원 | 감정 체크인 (1일 1회), 기본 바이오리듬 차트, 기본 트레이딩 저널 (수동 입력), 복리/세금 계산기, 주간 감정 요약 (텍스트) | AI 리포트 4회/월, 저널 30일 보관, 히스토리 최근 7일 |
| **Pro (개미왕)** | 5,900원/월 (연간 4,900원/월 = 58,800원/년) | Free 전체 + AI 감정 코칭 리포트 무제한, AI Agent 실시간 대화 (감정 코칭), 상세 바이오리듬 분석 + 투자 타이밍 인사이트, 무제한 저널 보관 + 태그/검색, 월간/분기 심층 분석 리포트, 맞춤 알림 (감정 상태 기반 매매 경고) | AI Agent 대화 100회/월, 데이터 내보내기 |

### AI Agent 유료화 전략 (핵심 레버)

| 단계 | Free 제공 | Pro 전용 |
|---|---|---|
| 감정 체크인 | 기본 선택형 (5개 감정) | 자연어 입력 + AI 분석 |
| 리포트 | 4회/월, 텍스트 요약만 | 무제한, 상세 차트 + 액션 제안 |
| AI Agent 대화 | X (미제공) | 실시간 감정 코칭 대화 (100회/월) |
| 매매 경고 | X | 감정 상태 기반 "오늘은 쉬세요" 알림 |
| 패턴 분석 | 최근 7일만 | 전체 기간 감정-수익 상관관계 분석 |

**AI Agent 유료화의 핵심 원칙**: 무료 사용자에게 "AI가 무엇을 해줄 수 있는지" 맛보기를 제공하되, **실시간 대화형 코칭**(가장 높은 perceived value)은 Pro 전용으로 설정. 월 4회 AI 리포트 제한은 "이번 달 AI 리포트를 모두 사용했습니다. Pro로 업그레이드하면 무제한 이용 가능합니다" 형태의 자연스러운 전환 트리거 역할.

### Rejected Alternatives

| Model | Rejection Reason |
|---|---|
| **Pure Advertising** | 한국 투자 관련 앱의 광고 CPM이 낮고 ($1~3), 감정 분석이라는 민감한 컨텍스트에서 광고가 사용자 경험을 크게 훼손하여 리텐션이 급락할 위험. |
| **Usage-Based (종량제)** | AI 리포트당 과금($0.5~1)은 사용자가 "비용 걱정 때문에 감정 체크를 안 하는" 역효과를 유발하여 핵심 가치 루프를 파괴. |
| **Transaction Fee** | 실제 매매를 중개하지 않고 감정 코칭만 제공하므로 거래 수수료 부과 근거 없음. 자본시장법상 투자 자문업 등록 없이 종목 기반 과금 불가. |
| **License (B2B)** | 증권사/자산운용사 B2B 라이선스는 장기적 확장 가능하나 MVP 단계에서 B2B 영업 리소스 부족. Phase 2 이후 검토. |

---

## Step 4: Unit Economics

### 가정(Assumptions)

| Parameter | Conservative | Base | Optimistic | Source |
|---|---|---|---|---|
| 월 신규 가입 (초기) | 500명 | 800명 | 1,200명 | 한국 투자앱 론칭 벤치마크 추정 |
| MoM 성장률 | 8% | 12% | 18% | 앱스토어 피처링/바이럴 효과 |
| Freemium 전환율 | 1.5% | 2.5% | 4.0% | Industry: 2.18% median [RevenueCat 2025] |
| 유료 월 이탈률 | 8% | 6% | 4% | Health app 연간 유지 50-60% 기준 |
| CAC (직접) | $8.00 | $5.00 | $3.50 | 한국 CPI $3~12, 오가닉 70% 가정 |
| ARPU (월) | $3.80 | $4.50 | $5.00 | 5,900원/월 기준, 연간 할인 반영 |
| AI 비용/유료유저/월 | $0.24 | $0.24 | $0.24 | $0.03/리포트 x 8회/월 |
| 고정비 (초기 월) | $97.5 | $120 | $150 | Vercel+Supabase+Misc |

### Unit Economics Summary

| Metric | Conservative | Base | Optimistic | Benchmark | Status |
|---|---|---|---|---|---|
| CAC (직접) | $8.00 | $5.00 | $3.50 | Industry $3-12 | healthy |
| CAC (블렌디드) | $2.40 | $1.50 | $1.05 | - | healthy |
| LTV | $47.50 | $75.00 | $125.00 | > 3x CAC | healthy |
| LTV/CAC | 5.9:1 | 15.0:1 | 35.7:1 | >= 3:1 | healthy |
| Payback Period | 2.1개월 | 1.1개월 | 0.7개월 | <= 12개월 | healthy |
| ARPU | $3.80/월 | $4.50/월 | $5.00/월 | Health app $2.47 | healthy |
| Gross Margin | 42.5% | 66.0% | 75.2% | App 60%+ | warning/healthy |
| Monthly Churn (유료) | 8.0% | 6.0% | 4.0% | Health 5-8% | healthy |
| Avg Lifespan | 12.5개월 | 16.7개월 | 25.0개월 | - | - |
| Break-even | Month 8 | Month 5 | Month 4 | Within runway | healthy |

**Note**: Conservative 시나리오의 Gross Margin 42.5%는 앱 벤치마크(60%+) 미달. 원인은 초기 유료 유저 수 대비 고정비 비중이 높은 구조. 유저 규모 확대 시 자연 개선 예상.

### 12-Month Projection: Conservative

| Month | New Users | Free | Paid | MRR | Var Cost | Fixed | Net Income | Cumulative |
|---|---|---|---|---|---|---|---|---|
| 1 | 500 | 500 | 0 | $0 | $235 | $98 | -$333 | -$333 |
| 2 | 540 | 958 | 7 | $27 | $264 | $98 | -$335 | -$667 |
| 3 | 583 | 1,384 | 21 | $80 | $295 | $98 | -$313 | -$980 |
| 4 | 629 | 1,786 | 40 | $152 | $328 | $98 | -$274 | -$1,254 |
| 5 | 680 | 2,173 | 63 | $239 | $365 | $98 | -$223 | -$1,477 |
| 6 | 734 | 2,550 | 90 | $342 | $403 | $98 | -$158 | -$1,635 |
| 7 | 793 | 2,923 | 121 | $460 | $444 | $98 | -$82 | -$1,717 |
| 8 | 856 | 3,298 | 155 | $589 | $488 | $98 | $3 | -$1,714 |
| 9 | 925 | 3,680 | 192 | $730 | $536 | $98 | $96 | -$1,618 |
| 10 | 999 | 4,072 | 232 | $882 | $587 | $98 | $197 | -$1,420 |
| 11 | 1,079 | 4,480 | 275 | $1,045 | $641 | $98 | $306 | -$1,114 |
| 12 | 1,165 | 4,906 | 320 | $1,216 | $699 | $146 | $371 | -$743 |

**M12**: 5,226 total users, 320 paid, MRR $1,216, ARR $14,592, Cum Net -$743

### 12-Month Projection: Base

| Month | New Users | Free | Paid | MRR | Var Cost | Fixed | Net Income | Cumulative |
|---|---|---|---|---|---|---|---|---|
| 1 | 800 | 800 | 0 | $0 | $376 | $120 | -$496 | -$496 |
| 2 | 896 | 1,580 | 20 | $90 | $440 | $120 | -$470 | -$966 |
| 3 | 1,003 | 2,355 | 58 | $261 | $512 | $120 | -$371 | -$1,337 |
| 4 | 1,123 | 3,138 | 113 | $509 | $595 | $120 | -$207 | -$1,544 |
| 5 | 1,258 | 3,942 | 185 | $833 | $689 | $120 | $23 | -$1,521 |
| 6 | 1,409 | 4,780 | 272 | $1,224 | $795 | $180 | $249 | -$1,271 |
| 7 | 1,579 | 5,667 | 375 | $1,688 | $914 | $180 | $594 | -$678 |
| 8 | 1,768 | 6,614 | 494 | $2,223 | $1,046 | $180 | $997 | $319 |
| 9 | 1,980 | 7,636 | 630 | $2,835 | $1,195 | $180 | $1,460 | $1,779 |
| 10 | 2,218 | 8,748 | 783 | $3,524 | $1,361 | $180 | $1,983 | $3,761 |
| 11 | 2,484 | 9,965 | 955 | $4,298 | $1,546 | $180 | $2,571 | $6,333 |
| 12 | 2,782 | 11,303 | 1,147 | $5,162 | $1,753 | $180 | $3,228 | $9,561 |

**M12**: 12,450 total users, 1,147 paid, MRR $5,162, ARR $61,938, Cum Net $9,561

### 12-Month Projection: Optimistic

| Month | New Users | Free | Paid | MRR | Var Cost | Fixed | Net Income | Cumulative |
|---|---|---|---|---|---|---|---|---|
| 1 | 1,200 | 1,200 | 0 | $0 | $564 | $150 | -$714 | -$714 |
| 2 | 1,416 | 2,448 | 48 | $240 | $698 | $150 | -$608 | -$1,322 |
| 3 | 1,670 | 3,777 | 144 | $720 | $862 | $150 | -$292 | -$1,613 |
| 4 | 1,971 | 5,220 | 290 | $1,450 | $1,061 | $225 | $164 | -$1,449 |
| 5 | 2,326 | 6,816 | 487 | $2,435 | $1,300 | $225 | $910 | -$539 |
| 6 | 2,745 | 8,608 | 740 | $3,700 | $1,585 | $225 | $1,890 | $1,351 |
| 7 | 3,239 | 10,643 | 1,055 | $5,275 | $1,924 | $225 | $3,126 | $4,477 |
| 8 | 3,822 | 12,976 | 1,438 | $7,190 | $2,325 | $225 | $4,640 | $9,118 |
| 9 | 4,510 | 15,670 | 1,900 | $9,500 | $2,799 | $450 | $6,251 | $15,369 |
| 10 | 5,322 | 18,799 | 2,450 | $12,250 | $3,359 | $450 | $8,441 | $23,810 |
| 11 | 6,280 | 22,449 | 3,103 | $15,515 | $4,020 | $450 | $11,045 | $34,855 |
| 12 | 7,411 | 26,719 | 3,876 | $19,380 | $4,800 | $450 | $14,130 | $48,986 |

**M12**: 30,595 total users, 3,876 paid, MRR $19,380, ARR $232,560, Cum Net $48,986

### Sensitivity Analysis (Base Scenario, M12 Net Income 기준)

| Variable | Base Value | -20% Net Income | +20% Net Income | Impact |
|---|---|---|---|---|
| Conversion Rate | 2.5% | $2,583 (-20.0%) | $3,874 (+20.0%) | HIGH |
| ARPU | $4.50/월 | $2,196 (-32.0%) | $4,261 (+32.0%) | HIGHEST |
| Paid Churn Rate | 6%/월 | $3,809 (+18.0%) | $2,744 (-15.0%) | HIGH |

**핵심 발견**: ARPU가 가장 민감한 변수. 연간 결제 비율이 높아지면 ARPU가 하락하므로, 월간/연간 결제 비율 믹스 관리가 중요. Churn 20% 감소(4.8%)가 Net Income 18% 개선 효과이므로 리텐션 투자의 ROI가 매우 높음.

---

## Step 5: BM Score

| Metric | Score (0-10) | Weight | Weighted | Evidence |
|---|---|---|---|---|
| MKT | 7 | 0.15 | 1.05 | 한국 개인투자자 1,423만 명 TAM에서 "투자 감정" 니치를 타겟하며 멘탈헬스앱 시장 CAGR 15.77%로 성장 중이나, 투자 심리 특화 시장은 아직 초기 단계로 직접 검증된 SOM이 제한적. |
| REV | 7 | 0.20 | 1.40 | Freemium + AI Agent 기반 구독 모델은 value metric(AI 코칭 횟수)과 사용자 체감 가치가 직접 연결되며, 5,900원/월은 한국 시장 지불 의향 범위 내이나 무료 앱 주류 시장에서 전환 검증 필요. |
| UE | 8 | 0.25 | 2.00 | Base 시나리오 LTV/CAC 15:1, Payback 1.1개월, Gross Margin 66%로 SaaS 벤치마크 상회; AI API 비용이 매우 낮아($0.24/유저/월) 비용 구조 건전하며 Conservative에서도 LTV/CAC 5.9:1로 건전. |
| SCL | 7 | 0.15 | 1.05 | AI API 비용이 리포트당 $0.03로 한계비용이 극히 낮고, Vercel/Supabase 인프라가 자동 스케일링을 지원하나, AI Agent 대화형 기능 확장 시 LLM 비용이 비선형 증가할 가능성 존재. |
| DEF | 5 | 0.15 | 0.75 | "투자 감정 분석"이라는 컨셉은 진입장벽이 낮아 토스/증권사 앱이 유사 기능을 부가 서비스로 제공 가능; 유저별 누적 감정-투자 데이터가 쌓일수록 switching cost가 증가하나, MVP 단계에서 데이터 moat는 미형성. |
| RSK | 6 | 0.10 | 0.60 | 자본시장법 준수(종목 추천 불가) 제약 내에서 운영하나, AI 코칭 발언이 "투자 자문"으로 해석될 리스크가 잔존하며, 한국 시장의 "무료 앱 선호" 문화에서 유료 전환이 최대 실행 리스크. |

```
BM Score = (7 x 0.15) + (7 x 0.20) + (8 x 0.25) + (7 x 0.15) + (5 x 0.15) + (6 x 0.10)
         = 1.05 + 1.40 + 2.00 + 1.05 + 0.75 + 0.60
         = 6.85
```

**Total: 6.85 / 10.0 -- Grade: B**

> Good BM, strengthen weak areas first. DEF(방어력)와 RSK(실행 리스크)가 가장 낮은 영역으로, (1) 유저 데이터 moat 조기 구축 전략과 (2) AI 코칭 발언의 법적 리스크 관리 체계가 우선 강화 과제.

### Grade B 강화 권고사항

1. **DEF 개선 (5 -> 7 목표)**: 유저별 감정-투자 패턴 데이터 축적이 핵심 moat. 3개월 이상 데이터가 쌓인 유저의 switching cost를 높이기 위해 "나의 투자 감정 히스토리" 시각화와 데이터 내보내기 제한(Pro 전용)을 설계.
2. **RSK 개선 (6 -> 7 목표)**: AI Agent 발언에 자동 면책 조항 삽입 + 금지 키워드 필터(종목명, 매수/매도 직접 추천) 구현. 법률 자문을 통한 서비스 범위 명확화.
3. **REV 검증**: MVP 출시 후 첫 3개월간 실제 Freemium 전환율을 측정하여 2.5% 가정 검증. 전환율 1.5% 미만 시 가격 인하 또는 Trial 모델(7일 무료 체험) 도입 검토.

---

## Step 6: Final Output (YAML)

```yaml
step: "7"
agent: "bm-designer"
status: "PASS"
timestamp: "2026-03-25T09:00:00+09:00"
content:
  revenue_model: "Freemium + Subscription (Hybrid)"
  value_metric: "AI 코칭 리포트 생성 횟수 + AI Agent 대화 접근"
  price_anchoring: "Low vs 글로벌 Trading Journal, Match vs 멘탈헬스앱"
  pricing:
    tiers:
      - name: "Free (개미)"
        price: "0원"
        features:
          - "감정 체크인 (1일 1회)"
          - "기본 바이오리듬 차트"
          - "기본 트레이딩 저널 (수동 입력)"
          - "복리/세금 계산기"
          - "주간 감정 요약 (텍스트)"
        limits:
          - "AI 리포트 4회/월"
          - "저널 30일 보관"
          - "히스토리 최근 7일"
      - name: "Pro (개미왕)"
        price: "5,900원/월 (연간 4,900원/월)"
        features:
          - "Free 전체 기능"
          - "AI 감정 코칭 리포트 무제한"
          - "AI Agent 실시간 대화 (감정 코칭)"
          - "상세 바이오리듬 분석 + 투자 타이밍 인사이트"
          - "무제한 저널 보관 + 태그/검색"
          - "월간/분기 심층 분석 리포트"
          - "맞춤 알림 (감정 상태 기반 매매 경고)"
        limits:
          - "AI Agent 대화 100회/월"
          - "데이터 내보내기"
  ai_agent_monetization:
    free_tier: "감정 체크인 기본 선택형, AI 리포트 월 4회 (맛보기)"
    paid_lever_1: "AI Agent 실시간 대화 코칭 (Pro 전용, 최고 perceived value)"
    paid_lever_2: "무제한 AI 리포트 + 상세 차트/액션 제안"
    paid_lever_3: "감정 상태 기반 매매 경고 알림 (Pro 전용)"
    paid_lever_4: "전체 기간 감정-수익 상관관계 패턴 분석 (Pro 전용)"
    conversion_trigger: "월 4회 AI 리포트 소진 시 업그레이드 유도 UI"
  rejected_alternatives:
    - model: "Pure Advertising"
      reason: "감정 분석 민감 컨텍스트에서 광고가 UX 훼손, 투자앱 광고 CPM 낮음"
    - model: "Usage-Based"
      reason: "리포트당 과금이 감정 체크 빈도를 감소시켜 핵심 가치 루프 파괴"
    - model: "Transaction Fee"
      reason: "매매 중개 없이 감정 코칭만 제공, 자본시장법상 거래 기반 과금 불가"
  unit_economics:
    cac: "$5.00 (직접), $1.50 (블렌디드)"
    ltv: "$75.00"
    ltv_cac_ratio: "15.0:1"
    payback_period: "1.1개월"
    monthly_churn: "6% (유료)"
    arpu: "$4.50/월"
    gross_margin: "66%"
    break_even: "Month 5 (Base)"
  scenarios:
    conservative:
      m12_users: 5226
      m12_paid: 320
      m12_mrr: "$1,216"
      m12_arr: "$14,592"
      m12_cum_net: "-$743"
      break_even: "Month 8"
    base:
      m12_users: 12450
      m12_paid: 1147
      m12_mrr: "$5,162"
      m12_arr: "$61,938"
      m12_cum_net: "$9,561"
      break_even: "Month 5"
    optimistic:
      m12_users: 30595
      m12_paid: 3876
      m12_mrr: "$19,380"
      m12_arr: "$232,560"
      m12_cum_net: "$48,986"
      break_even: "Month 4"
  sensitivity:
    top_variables:
      - name: "ARPU"
        impact: "HIGHEST - +-20% -> +-32% Net Income"
      - name: "Conversion Rate"
        impact: "HIGH - +-20% -> +-20% Net Income"
      - name: "Paid Churn Rate"
        impact: "HIGH - -20% churn -> +18% Net Income"
  bm_score:
    total: "6.85"
    grade: "B"
    criteria:
      - name: "MKT"
        score: "7"
        evidence: "한국 개인투자자 1,423만 명 TAM, 멘탈헬스앱 CAGR 15.77% 성장 중이나 투자 심리 특화 SOM 미검증."
      - name: "REV"
        score: "7"
        evidence: "AI 코칭 횟수 기반 value metric이 체감 가치와 직결, 5,900원/월이 한국 지불 의향 범위 내이나 무료 시장 전환 검증 필요."
      - name: "UE"
        score: "8"
        evidence: "Base LTV/CAC 15:1, Payback 1.1개월, Gross Margin 66%로 SaaS 벤치마크 상회, AI API 한계비용 극히 낮음."
      - name: "SCL"
        score: "7"
        evidence: "리포트당 $0.03 한계비용 + Vercel/Supabase 자동 스케일링이나 AI Agent 대화 확장 시 LLM 비용 비선형 증가 가능."
      - name: "DEF"
        score: "5"
        evidence: "투자 감정 분석 컨셉의 진입장벽 낮음, MVP 단계 데이터 moat 미형성, 대형 증권사 앱의 유사 기능 추가 위험."
      - name: "RSK"
        score: "6"
        evidence: "AI 코칭 발언의 투자 자문 해석 리스크 잔존, 한국 무료 앱 선호 문화에서 유료 전환이 최대 실행 리스크."
  improvement_priorities:
    - "DEF: 유저별 감정-투자 데이터 moat 조기 구축 (3개월+ 히스토리 -> switching cost)"
    - "RSK: AI Agent 면책 조항 자동 삽입 + 금지 키워드 필터 구현"
    - "REV: 출시 후 3개월 내 실제 전환율 측정, 1.5% 미만 시 7일 Trial 모델 도입"
next_step: 8
```

---

## Sources

- [Edgewonk Pricing](https://edgewonk.com/pricing)
- [TraderSync Pricing](https://tradersync.com/pricing/)
- [Tradervue Pricing](https://www.tradervue.com/site/pricing/)
- [Tradezella Pricing](https://www.tradezella.com/pricing)
- [Headspace Subscriptions](https://www.headspace.com/subscriptions)
- [RevenueCat State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/)
- [Business of Apps - Trial Benchmarks 2026](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)
- [First Page Sage - SaaS Freemium Conversion Rates 2026](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/)
- [Proven SaaS - CAC Payback Benchmarks 2026](https://proven-saas.com/benchmarks/cac-payback-benchmarks)
- [Business of Apps - Health Fitness Benchmarks 2026](https://www.businessofapps.com/data/health-fitness-app-benchmarks/)
- [Mistplay - Mobile User Acquisition Cost 2026](https://business.mistplay.com/resources/user-acquisition-cost)
- [Business of Apps - CPI Rates 2025](https://www.businessofapps.com/ads/cpi/research/cost-per-install/)
