import Link from 'next/link';
import AntCharacter from '@/components/AntCharacter';

const actions = [
  {
    href: '/survey',
    icon: 'mail',
    title: '바라의 메시지 받기',
    desc: '지금 마음을 고르고 10초만 쉬어요',
    primary: true,
  },
  {
    href: '/memo',
    icon: 'edit_note',
    title: '바라로그 남기기',
    desc: '오늘의 충동을 가볍게 기록해요',
  },
  {
    href: '/report',
    icon: 'auto_awesome',
    title: '카드 모아보기',
    desc: '미래의 나에게 받은 답장을 확인해요',
  },
];

const steps = [
  ['1', '고르기', '배달 · 쇼핑 · FOMO 중 지금 마음을 선택'],
  ['2', '쉬기', '바라가 보내는 짧은 메시지 읽기'],
  ['3', '남기기', '5,000원 또는 오늘의 기록을 저장'],
];

const messages = [
  '오늘은 의지가 부족한 날이 아니라 조금 지친 날이야.',
  '다 참지 않아도 괜찮아. 조금만 미래의 너에게 남겨둘까?',
  '지금의 너를 혼내지 않는 게 더 오래 가는 방법이야.',
];

export default function Home() {
  return (
    <div className="animate-slideUp space-y-7">
      <section className="relative overflow-hidden rounded-[36px] border border-surface-border bg-[radial-gradient(circle_at_82%_18%,#ffd8c6_0_16%,transparent_36%),radial-gradient(circle_at_18%_88%,#e3f1e4_0_18%,transparent_40%),#fffaf2] p-5 shadow-elevated md:p-8 lg:p-10">
        <div className="grid items-center gap-7 lg:grid-cols-[1fr_380px]">
          <div className="max-w-[720px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-primary shadow-sm">
              <span className="material-symbols-outlined text-[17px]">spa</span>
              Frombara
            </div>
            <h1 className="text-[44px] font-black leading-[0.98] tracking-[-0.07em] text-on-surface md:text-[68px]">
              배달앱 켜기 전에,<br />바라랑 10초만.
            </h1>
            <p className="mt-5 max-w-[610px] text-base font-semibold leading-7 text-on-surface-secondary md:text-lg">
              프롬바라는 충동적으로 돈을 쓰거나 투자하고 싶은 순간, 카피바라 바라가 짧은 메시지로 부드럽게 멈춰주는 앱입니다.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/survey" className="btn btn-primary btn-lg justify-center shadow-[0_14px_30px_rgba(70,125,92,0.24)]">
                <span className="material-symbols-outlined">mail</span>
                바라의 메시지 받기
              </Link>
              <Link href="/report" className="btn btn-secondary btn-lg justify-center">
                <span className="material-symbols-outlined">auto_awesome</span>
                오늘의 카드 보기
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/55 p-5 shadow-raised backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Bara says</p>
                <p className="mt-1 text-lg font-black tracking-[-0.04em] text-on-surface">참아! 말고 잠깐 쉬자</p>
              </div>
              <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-black text-[#b86b3c]">밤 10:47</span>
            </div>
            <div className="mt-4 grid place-items-center rounded-[28px] bg-[linear-gradient(180deg,#fff1e6,#e3f1e4)] py-6">
              <AntCharacter size={190} expression="happy" />
            </div>
            <p className="mt-4 rounded-[24px] bg-[#fffaf2]/90 p-4 text-lg font-black leading-snug tracking-[-0.04em]">
              배달은 시켜도 돼.<br />대신 5,000원만 미래의 너에게 보내볼까?
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group rounded-[28px] border p-5 shadow-raised transition hover:-translate-y-1 hover:shadow-elevated ${
              action.primary ? 'border-primary bg-primary text-white' : 'border-surface-border bg-surface/80 text-on-surface'
            }`}
          >
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-[20px] ${action.primary ? 'bg-white/18' : 'bg-primary-container text-primary'}`}>
              <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
            </div>
            <p className="text-lg font-black tracking-[-0.04em]">{action.title}</p>
            <p className={`mt-2 text-sm font-semibold leading-6 ${action.primary ? 'text-white/75' : 'text-on-surface-tertiary'}`}>{action.desc}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card card-raised">
          <p className="section-label">How it works</p>
          <h2 className="text-2xl font-black tracking-[-0.05em] md:text-3xl">복잡한 설명 없이, 세 단계면 충분해요.</h2>
          <div className="mt-6 grid gap-3">
            {steps.map(([num, title, desc]) => (
              <div key={num} className="flex gap-4 rounded-[24px] bg-[#fff6ea] p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-white">{num}</span>
                <div>
                  <p className="font-black">{title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-on-surface-tertiary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-raised">
          <p className="section-label">Messages from Bara</p>
          <div className="grid gap-3">
            {messages.map((message) => (
              <div key={message} className="rounded-[24px] bg-[#e3f1e4] p-5 text-lg font-black leading-snug tracking-[-0.04em] text-on-surface">
                “{message}”
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[34px] bg-[#2d2924] p-6 text-white shadow-elevated md:p-8">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Future Me Card</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] md:text-4xl">오늘의 5,000원, 꽤 다정한 선택이었어.</h2>
            <p className="mt-3 max-w-[620px] text-sm font-semibold leading-7 text-white/65">
              작은 행동 뒤에는 미래의 내가 보내는 답장 같은 카드가 남아요.
            </p>
          </div>
          <Link href="/survey" className="btn bg-white text-[#2d2924] hover:bg-white/90 md:justify-center">
            카드 받기
          </Link>
        </div>
      </section>
    </div>
  );
}
