import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

const moodCards = [
  {
    title: '배달각 온 밤',
    label: '피곤함 · 보상심리',
    body: 'Anty가 10초만 같이 쉬어줘요. 참는 앱이 아니라 덜 무너지는 앱.',
    icon: 'ramen_dining',
    bg: 'bg-[#fff1e6]',
  },
  {
    title: 'FOMO 온 순간',
    label: '놓칠까 봐 불안함',
    body: '지금 사야 할 것 같은 마음을 작고 귀여운 루틴으로 멈춰요.',
    icon: 'trending_up',
    bg: 'bg-[#ffe9e9]',
  },
  {
    title: '미래의 나 카드',
    label: '작은 실천 · 저장하고 싶은 보상',
    body: '5,000원을 보내면 미래의 내가 답장하는 카드를 남겨요.',
    icon: 'mail',
    bg: 'bg-[#e9f4e8]',
  },
];

const quickActions = [
  { href: '/survey', icon: 'favorite', title: 'Anty랑 10초 쉬기', desc: '지금 마음을 고르고 오늘의 ANT Log를 만들어요' },
  { href: '/memo', icon: 'edit_note', title: 'ANT Log 남기기', desc: '왜 눌렀는지, 어떤 마음이었는지 가볍게 기록해요' },
  { href: '/report', icon: 'auto_awesome', title: 'Future Me 카드 보기', desc: '내가 저장한 감정 카드와 패턴을 모아봐요' },
  { href: '/calculator', icon: 'savings', title: '5,000원의 미래 보기', desc: '작은 돈이 쌓이면 어떻게 되는지 부드럽게 확인해요' },
];

export default function Home() {
  return (
    <div className="animate-slideUp space-y-10">
      <section className="relative overflow-hidden rounded-[44px] border border-surface-border bg-[radial-gradient(circle_at_76%_20%,#ffd8c6_0_18%,transparent_38%),radial-gradient(circle_at_20%_85%,#e3f1e4_0_20%,transparent_42%),linear-gradient(135deg,#fffaf2_0%,#fff0df_100%)] p-7 shadow-elevated md:p-11">
        <div className="absolute right-8 top-8 rounded-full bg-white/60 px-4 py-2 text-xs font-black text-primary shadow-raised backdrop-blur">Dear ANT · soft pause</div>
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/70 px-4 py-2 text-sm font-extrabold text-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              tiny AI coach for impulsive ants
            </div>
            <h1 className="text-[44px] font-black leading-[0.98] tracking-[-0.07em] text-on-surface md:text-[72px]">
              오늘도<br />배달앱 켰어?
            </h1>
            <p className="mt-6 max-w-[600px] text-xl font-black leading-8 text-on-surface-secondary md:text-2xl">
              괜찮아. 일단 Anty랑 10초만 쉬자.
            </p>
            <p className="mt-4 max-w-[620px] text-base font-semibold leading-8 text-on-surface-tertiary">
              Dear ANT는 충동적으로 돈을 쓰거나 투자하고 싶은 순간을 혼내지 않고, 작은 감정 요정 Anty가 Future Me Card로 바꿔주는 습관 앱입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/survey" className="btn btn-primary btn-lg shadow-[0_14px_30px_rgba(70,125,92,0.24)]">
                <span className="material-symbols-outlined">favorite</span>
                Anty랑 쉬기
              </Link>
              <Link href="/memo" className="btn btn-secondary btn-lg">
                <span className="material-symbols-outlined">edit_note</span>
                오늘의 ANT Log
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute -left-6 -top-6 rotate-[-7deg] rounded-[26px] bg-[#fff1e6] px-4 py-3 text-sm font-black text-[#b86b3c] shadow-raised">참아! 말고<br />잠깐 쉬자</div>
            <div className="rounded-[42px] border border-surface-border bg-white/82 p-6 shadow-[0_24px_70px_rgba(62,42,25,0.16)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-primary">오늘의 ANT 타입</p>
                  <p className="text-2xl font-black tracking-[-0.05em]">soft pause mode</p>
                </div>
                <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-black text-[#b86b3c]">밤 10:47</span>
              </div>
              <div className="grid place-items-center rounded-[34px] bg-[#fff6ea] py-8">
                <AntCharacter size={172} expression="worried" speech="혼내러 온 거 아냐" />
              </div>
              <div className="mt-5 rounded-[28px] bg-primary-container p-5">
                <p className="text-xs font-black text-primary">Anty says</p>
                <p className="mt-1 text-xl font-black leading-snug tracking-[-0.03em]">배달은 시켜도 돼.<br />대신 5,000원만 미래의 너에게 보내볼까?</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-on-surface-tertiary shadow-sm">피곤함</span>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-on-surface-tertiary shadow-sm">보상받고 싶음</span>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-on-surface-tertiary shadow-sm">10초 쉬기</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="card card-raised group block transition hover:-translate-y-1 hover:shadow-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[20px] bg-primary-container text-primary transition group-hover:scale-105">
              <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
            </div>
            <p className="text-base font-black tracking-[-0.02em]">{action.title}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-on-surface-tertiary">{action.desc}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card card-raised">
          <p className="section-label">ANT loop</p>
          <h2 className="text-2xl font-black tracking-[-0.04em]">누르기 전에 귀엽게 한 번 멈추는 루프.</h2>
          <div className="mt-6 space-y-4">
            {['충동이 올라옴', 'Anty가 10초 쉬자고 함', '감정 스티커 선택', '작은 미래 행동', 'Future Me Card 저장'].map((step, index) => (
              <div key={step} className="grid grid-cols-[34px_1fr] items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-container text-sm font-black text-primary">{index + 1}</span>
                <div>
                  <p className="font-black">{step}</p>
                  <p className="mt-1 text-sm leading-6 text-on-surface-tertiary">혼내지 않고, 과하게 설명하지 않고, 다음 선택만 조금 가볍게 바꿔요.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {moodCards.map((card) => (
            <div key={card.title} className={`rounded-[32px] border border-surface-border p-5 shadow-raised ${card.bg}`}>
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
