import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

const emotionCards = [
  {
    title: 'Reward-Seeking ANT',
    label: '피곤함 · 보상심리',
    body: '배달이나 쇼핑으로 위로받고 싶은 순간을 작은 미래 행동으로 바꿔요.',
    icon: 'local_dining',
    bg: 'bg-[#fff1e6]',
  },
  {
    title: 'FOMO ANT',
    label: '놓칠까 봐 불안함',
    body: '급등주나 추천 종목을 보기 전에 10분 멈춤 루틴을 제안해요.',
    icon: 'trending_up',
    bg: 'bg-[#ffe9e9]',
  },
  {
    title: 'Calm ANT',
    label: '작은 실천 · 안정감',
    body: '오늘의 작은 선택을 Future Me Card로 저장해 반복 습관을 만들어요.',
    icon: 'psychiatry',
    bg: 'bg-[#e9f4e8]',
  },
];

const quickActions = [
  { href: '/survey', icon: 'psychology', title: '오늘 감정 체크하기', desc: '수면, FOMO, 손실 만회 욕구를 체크해요' },
  { href: '/memo', icon: 'edit_note', title: '투자 저널 남기기', desc: '매매 이유와 감정을 함께 기록해요' },
  { href: '/report', icon: 'description', title: '리포트 모아보기', desc: '내 감정 패턴과 판단 모드를 확인해요' },
  { href: '/calculator', icon: 'compare_arrows', title: '적금 vs 투자 비교', desc: '작은 돈이 미래에 어떻게 바뀌는지 봐요' },
];

export default function Home() {
  return (
    <div className="animate-slideUp space-y-10">
      <section className="relative overflow-hidden rounded-[36px] border border-surface-border bg-[radial-gradient(circle_at_76%_20%,#ffe2cf_0_18%,transparent_38%),linear-gradient(135deg,#fffaf2_0%,#edf6eb_100%)] p-7 shadow-elevated md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/70 px-4 py-2 text-sm font-extrabold text-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              AI visual coaching app
            </div>
            <h1 className="text-[42px] font-black leading-[1.02] tracking-[-0.06em] text-on-surface md:text-[64px]">
              오늘의 충동을<br />미래의 나에게
            </h1>
            <p className="mt-5 max-w-[620px] text-lg font-semibold leading-8 text-on-surface-secondary">
              Dear ANT는 배달·쇼핑·FOMO 매수처럼 즉각적인 보상에 끌리는 순간을 AI 개미 캐릭터와 감정 카드로 바꿔, 작은 투자 습관으로 연결하는 서비스입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/survey" className="btn btn-primary btn-lg shadow-[0_14px_30px_rgba(70,125,92,0.24)]">
                <span className="material-symbols-outlined">play_arrow</span>
                감정 체크 시작하기
              </Link>
              <Link href="/design-tech" className="btn btn-secondary btn-lg">
                <span className="material-symbols-outlined">phone_iphone</span>
                앱 데모 보기
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="rounded-[36px] border border-surface-border bg-white/80 p-6 shadow-[0_24px_70px_rgba(62,42,25,0.16)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-primary">오늘의 개미 타입</p>
                  <p className="text-2xl font-black tracking-[-0.04em]">Reward-Seeking ANT</p>
                </div>
                <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-black text-[#b86b3c]">밤 10:47</span>
              </div>
              <div className="grid place-items-center rounded-[30px] bg-[#fff6ea] py-8">
                <AntCharacter size={156} expression="worried" speech="패턴을 보는 중이야" />
              </div>
              <p className="mt-5 text-sm font-semibold leading-6 text-on-surface-secondary">
                오늘은 수익보다 위로가 먼저 필요한 상태예요. 배달을 참는 게 목표가 아니라, 작은 일부를 미래의 나에게 보내는 게 목표예요.
              </p>
              <div className="mt-5 rounded-[24px] bg-primary-container p-4">
                <p className="text-xs font-black text-primary">Dear ANT 제안</p>
                <p className="mt-1 text-lg font-black leading-snug">배달은 시켜도 괜찮아요.<br />대신 ₩5,000만 미래 지갑에 보낼래요?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="card card-raised group block transition hover:-translate-y-1 hover:shadow-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-primary transition group-hover:scale-105">
              <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
            </div>
            <p className="text-base font-black tracking-[-0.02em]">{action.title}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-on-surface-tertiary">{action.desc}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card card-raised">
          <p className="section-label">Product flow</p>
          <h2 className="text-2xl font-black tracking-[-0.04em]">금융 앱이 아니라 감정 루프에서 시작합니다.</h2>
          <div className="mt-6 space-y-4">
            {['충동 순간 포착', '감정 태그 선택', 'AI 개미 진단', '작은 미래 행동', 'Future Me Card 저장'].map((step, index) => (
              <div key={step} className="grid grid-cols-[34px_1fr] items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-container text-sm font-black text-primary">{index + 1}</span>
                <div>
                  <p className="font-black">{step}</p>
                  <p className="mt-1 text-sm leading-6 text-on-surface-tertiary">사용자의 행동을 막기보다, 패턴을 인식하고 작은 선택으로 이어지게 합니다.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {emotionCards.map((card) => (
            <div key={card.title} className={`rounded-[28px] border border-surface-border p-5 shadow-raised ${card.bg}`}>
              <span className="material-symbols-outlined text-[32px] text-primary">{card.icon}</span>
              <p className="mt-5 text-lg font-black leading-tight tracking-[-0.03em]">{card.title}</p>
              <p className="mt-2 text-xs font-black text-primary">{card.label}</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-on-surface-secondary">{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
