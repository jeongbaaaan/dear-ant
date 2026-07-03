import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

const quickFacts = [
  ['Type', 'Soft pause coach'],
  ['Best for', '배달 · 쇼핑 · FOMO'],
  ['Main reward', 'Future Me Card'],
  ['Tone', 'gentle · calm · non-judgmental'],
];

const triggers = [
  ['배달각 온 밤', '오늘 하루가 너무 길었고, 지금은 위로가 필요해요.'],
  ['쇼핑각 온 순간', '기분 전환이 필요해서 결제 버튼이 가까워져요.'],
  ['FOMO 온 순간', '지금 안 사면 놓칠 것 같은 마음이 커져요.'],
];

const messages = [
  '오늘은 의지가 부족한 날이 아니라, 조금 지친 날이야.',
  '다 참지 않아도 괜찮아. 조금만 미래의 너에게 남겨둘까?',
  '지금의 너를 혼내지 않는 게 더 오래 가는 방법이야.',
  '오늘의 작은 선택도 생각보다 큰 시작이 될 수 있어.',
];

const didYouKnow = [
  ['피곤한 밤일수록', '지금 그냥 시켜 버튼은 더 쉬워 보여요.'],
  ['작은 금액이라도', '즉각 보상이 있으면 더 오래 반복돼요.'],
  ['소비 패턴은', '의지 부족보다 감정 신호와 더 가까울 수 있어요.'],
];

export default function Home() {
  return (
    <div className="animate-slideUp space-y-12">
      <section className="grid gap-10 rounded-[44px] border border-surface-border bg-[#fffaf2]/90 p-7 shadow-elevated md:grid-cols-[1.05fr_0.95fr] md:p-12">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <div className="mb-8 text-xs font-black uppercase tracking-[0.24em] text-primary">Home / Frombara / Soft Pause Coach</div>
            <h1 className="text-[72px] font-black leading-[0.88] tracking-[-0.08em] text-on-surface md:text-[112px]">Bara</h1>
            <p className="mt-5 text-2xl font-black italic tracking-[-0.04em] text-on-surface-secondary">A soft coach for impulsive nights</p>
            <p className="mt-8 max-w-[620px] text-lg font-semibold leading-8 text-on-surface-secondary">
              프롬바라는 충동적으로 돈을 쓰거나 투자하고 싶은 순간, 카피바라 바라가 짧은 메시지로 너를 부드럽게 멈춰주는 앱입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/survey" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">mail</span>
              바라의 메시지 받기
            </Link>
            <Link href="/report" className="btn btn-secondary btn-lg">
              <span className="material-symbols-outlined">auto_awesome</span>
              오늘의 카드 보기
            </Link>
          </div>
        </div>

        <div className="relative rounded-[38px] bg-[linear-gradient(180deg,#f4d8bf_0%,#fff1e6_55%,#e3f1e4_100%)] p-6 shadow-raised">
          <div className="absolute right-6 top-6 rounded-full bg-white/70 px-4 py-2 text-xs font-black text-primary shadow-sm">From Bara</div>
          <div className="grid min-h-[420px] place-items-center rounded-[32px] border border-white/70 bg-white/28">
            <AntCharacter size={250} expression="happy" speech="참아! 말고 잠깐 쉬자" />
          </div>
          <div className="mt-5 rounded-[28px] bg-[#fffaf2]/90 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Bara says</p>
            <p className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em]">배달은 시켜도 돼. 대신 5,000원만 미래의 너에게 보내볼까?</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {quickFacts.map(([label, value]) => (
          <div key={label} className="card card-raised">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{label}</p>
            <p className="mt-3 text-xl font-black tracking-[-0.04em] text-on-surface">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="card card-raised h-fit">
          <p className="section-label">Profile</p>
          <h2 className="text-4xl font-black tracking-[-0.06em]">Bara</h2>
          <p className="mt-4 text-base font-semibold leading-7 text-on-surface-secondary">
            바라는 너를 통제하려고 오지 않아요. 지금의 마음을 먼저 보고, 다음 선택을 조금 부드럽게 바꾸러 와요.
          </p>
          <div className="mt-6 rounded-[28px] bg-[#fff1e6] p-5">
            <p className="text-xs font-black text-[#b86b3c]">FACT</p>
            <p className="mt-2 text-lg font-black leading-snug">전부 참는 것보다, 조금 덜 무너지는 선택이 더 오래 가요.</p>
          </div>
        </aside>

        <div className="space-y-10">
          <section className="card card-raised">
            <p className="section-label">Mood</p>
            <h2 className="text-3xl font-black tracking-[-0.05em]">행동보다 먼저 마음을 봐요.</h2>
            <p className="mt-4 text-base font-semibold leading-8 text-on-surface-secondary">
              배달을 누르고 싶은 밤엔 보통 배고픔보다 피곤함, 허전함, 혹은 보상받고 싶은 마음이 먼저 와 있어요.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['피곤함', '허전함', '보상받고 싶음', 'FOMO', '손실 만회', '아무 생각 없음'].map((item) => (
                <span key={item} className="chip chip-default">{item}</span>
              ))}
            </div>
          </section>

          <section className="card card-raised">
            <p className="section-label">Trigger</p>
            <h2 className="text-3xl font-black tracking-[-0.05em]">바라는 이런 순간에 필요해져요.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {triggers.map(([title, body]) => (
                <div key={title} className="rounded-[28px] bg-[#fff6ea] p-5">
                  <p className="text-lg font-black tracking-[-0.03em]">{title}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-on-surface-tertiary">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-raised">
            <p className="section-label">Tiny Action</p>
            <h2 className="text-3xl font-black tracking-[-0.05em]">거대한 결심 대신, 작은 행동 하나.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {['10초 쉬기', '5,000원 남기기', '기록만 하기'].map((item, index) => (
                <div key={item} className="rounded-[28px] border border-surface-border bg-white/60 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-black text-white">{index + 1}</span>
                  <p className="mt-5 text-xl font-black tracking-[-0.04em]">{item}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-on-surface-tertiary">전부 참지 않아도 괜찮고, 조금만 바꾸면 충분해요.</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card card-raised">
          <p className="section-label">Did You Know</p>
          <div className="mt-2 space-y-4">
            {didYouKnow.map(([title, body]) => (
              <div key={title} className="rounded-[26px] bg-[#e3f1e4] p-5">
                <p className="text-xl font-black tracking-[-0.04em]">{title}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-on-surface-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-raised">
          <p className="section-label">Messages from Bara</p>
          <div className="grid gap-4">
            {messages.map((message) => (
              <div key={message} className="rounded-[28px] bg-[#fff1e6] p-5 text-xl font-black leading-snug tracking-[-0.04em] text-on-surface">
                “{message}”
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[44px] bg-primary p-8 text-white shadow-elevated md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">Future Me Card</p>
        <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-5xl">오늘의 5,000원, 생각보다 꽤 다정한 선택이었어.</h2>
        <p className="mt-5 max-w-[720px] text-base font-semibold leading-8 text-white/75">
          바라의 메시지는 그냥 지나가지 않아요. 작은 행동 뒤에는 미래의 내가 보내는 답장 같은 카드가 남아요.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/survey" className="btn bg-white text-primary hover:bg-white/90">카드 받기</Link>
          <Link href="/memo" className="btn border border-white/30 text-white hover:bg-white/10">바라로그 남기기</Link>
        </div>
      </section>
    </div>
  );
}
