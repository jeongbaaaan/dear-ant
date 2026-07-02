'use client';

import { useMemo, useState } from 'react';

const screens = [
  {
    id: 'home',
    title: 'Home',
    caption: '배달시키고 싶은 밤에 사용자가 실제로 처음 마주하는 화면. 금융 과업이 아니라 감정 순간에서 시작합니다.',
  },
  {
    id: 'impulse',
    title: 'Impulse Check',
    caption: '지금 누르고 싶은 버튼을 묻습니다. 투자 앱이 아니라 즉각 보상 트리거를 다루는 앱처럼 보이게 합니다.',
  },
  {
    id: 'emotion',
    title: 'Emotion Check',
    caption: '행동 뒤에 있는 감정을 태그화합니다. 이 입력이 AI 개미 페르소나로 변환됩니다.',
  },
  {
    id: 'diagnosis',
    title: 'AI Ant Diagnosis',
    caption: 'AI가 사용자의 감정 상태를 Reward-Seeking ANT라는 시각적 페르소나로 바꾸는 핵심 화면입니다.',
  },
  {
    id: 'action',
    title: 'Tiny Future Action',
    caption: '사용자를 혼내지 않고, 배달을 허용하면서 작은 금액만 미래 지갑으로 보내도록 제안합니다.',
  },
  {
    id: 'reward',
    title: 'Future Me Card',
    caption: '투자에 부족한 즉각 보상을 AI 카드로 제공합니다. 미래의 내가 보낸 답장처럼 저장하고 공유할 수 있습니다.',
  },
  {
    id: 'journal',
    title: 'Journal',
    caption: '반복 사용을 보여주는 화면입니다. 충동과 감정 패턴이 누적되는 습관 루프를 보여줍니다.',
  },
] as const;

type ScreenId = (typeof screens)[number]['id'];

type Persona = {
  name: string;
  mood: string;
  message: string;
  color: string;
  icon: string;
};

const personas: Persona[] = [
  {
    name: 'Reward-Seeking ANT',
    mood: '피곤함 · 보상심리',
    message: '오늘은 수익보다 위로가 먼저 필요한 날이에요.',
    color: 'from-[#FFE4D3] to-[#FFF8EA]',
    icon: 'local_dining',
  },
  {
    name: 'FOMO ANT',
    mood: '놓칠까 봐 불안함',
    message: '기회를 보는 눈보다 불안한 마음이 더 커졌어요.',
    color: 'from-[#FFE1E1] to-[#FFF5F5]',
    icon: 'trending_up',
  },
  {
    name: 'Revenge ANT',
    mood: '손실 만회 욕구',
    message: '지금은 회복보다 복수에 가까운 선택일 수 있어요.',
    color: 'from-[#FFE7C2] to-[#FFF9EA]',
    icon: 'restart_alt',
  },
  {
    name: 'Calm ANT',
    mood: '작은 실천 · 안정감',
    message: '작은 선택이 반복되면 미래의 나는 꽤 든든해져요.',
    color: 'from-[#E3F1E4] to-[#F8FFF8]',
    icon: 'psychiatry',
  },
];

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[780px] w-[378px] rounded-[52px] bg-[#242321] p-3 shadow-[0_34px_90px_rgba(57,38,20,0.28)] max-[460px]:h-[720px] max-[460px]:w-[344px]">
      <div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#242321]" />
      <div className="relative h-full overflow-hidden rounded-[42px] bg-[#fffaf2]">
        {children}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-12 items-center justify-between px-7 pt-3 text-[13px] font-extrabold text-[#2d2924]">
      <span>10:47</span>
      <div className="flex items-center gap-1">
        <span className="h-2 w-1 rounded-sm bg-[#2d2924]" />
        <span className="h-3 w-1 rounded-sm bg-[#2d2924]" />
        <span className="h-4 w-1 rounded-sm bg-[#2d2924]" />
        <span className="ml-1 h-3 w-6 rounded border-2 border-[#2d2924]" />
      </div>
    </div>
  );
}

function AppBar({ title = 'Dear ANT', subtitle = '배달 대신 투자', emoji = '🐜' }: { title?: string; subtitle?: string; emoji?: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <div>
        <p className="text-[20px] font-black leading-none tracking-[-0.02em] text-[#467d5c]">{title}</p>
        <p className="mt-1 text-[12px] font-bold text-[#8b7b6c]">{subtitle}</p>
      </div>
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#f4b287] to-[#ffd9a8] text-lg shadow-sm">
        {emoji}
      </div>
    </div>
  );
}

function BottomNav({ active = 'home' }: { active?: 'home' | 'journal' }) {
  const items = [
    ['home', '홈', 'home'],
    ['journal', '기록', 'history'],
    ['wallet', '지갑', 'account_balance_wallet'],
    ['me', '나', 'favorite'],
  ];
  return (
    <div className="absolute bottom-4 left-4 right-4 grid h-16 grid-cols-4 items-center rounded-[28px] border border-[#eadccb] bg-white/90 shadow-[0_14px_34px_rgba(62,42,25,0.12)] backdrop-blur">
      {items.map(([id, label, icon]) => (
        <div key={id} className={`text-center text-[11px] font-extrabold ${active === id ? 'text-[#467d5c]' : 'text-[#a69482]'}`}>
          <span className="material-symbols-outlined block text-[22px] leading-none">{icon}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

function AntFace({ mood = 'soft', className = '' }: { mood?: 'soft' | 'tired' | 'fomo' | 'calm'; className?: string }) {
  const mouth = mood === 'tired' ? 'M39 60 Q50 52 61 60' : mood === 'fomo' ? 'M40 58 Q50 66 60 58' : 'M39 56 Q50 67 61 56';
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <ellipse cx="60" cy="106" rx="42" ry="8" fill="#e6dccb" />
      <path d="M43 70 L25 96 M58 72 L48 101 M73 70 L96 98" stroke="#8a5d3e" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="58" cy="73" rx="25" ry="23" fill="#986543" stroke="#684832" strokeWidth="2.5" />
      <ellipse cx="83" cy="68" rx="23" ry="22" fill="#ab7349" stroke="#684832" strokeWidth="2.5" />
      <circle cx="46" cy="42" r="25" fill="#bd8052" stroke="#684832" strokeWidth="2.5" />
      <path d="M34 22 Q24 8 12 5 M57 20 Q63 7 76 5" stroke="#8a5d3e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="5" r="5" fill="#f4b287" />
      <circle cx="76" cy="5" r="5" fill="#f4b287" />
      <circle cx="37" cy="42" r="4" fill="#2d2924" />
      <circle cx="55" cy="42" r="4" fill="#2d2924" />
      <path d={mouth} stroke="#2d2924" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {mood === 'fomo' && <path d="M75 30 L98 16 L90 40 Z" fill="#e78282" opacity="0.8" />}
      {mood === 'calm' && (
        <>
          <circle cx="92" cy="34" r="15" fill="#f6cd63" stroke="#b58d32" strokeWidth="2" />
          <path d="M92 19 V4" stroke="#467d5c" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="84" cy="2" rx="9" ry="5" fill="#467d5c" transform="rotate(-28 84 2)" />
          <ellipse cx="101" cy="2" rx="9" ry="5" fill="#77a97e" transform="rotate(28 101 2)" />
        </>
      )}
    </svg>
  );
}

function HomeScreen({ go }: { go: (index: number) => void }) {
  return (
    <div className="relative h-full">
      <StatusBar />
      <AppBar />
      <div className="px-6 pt-5">
        <h2 className="text-[34px] font-black leading-[1.1] tracking-[-0.05em] text-[#2d2924]">오늘도 배달시키고<br />싶은 밤인가요?</h2>
        <p className="mt-4 text-[15px] font-medium leading-6 text-[#7d6e60]">다 참지 않아도 괜찮아요.<br />5,000원만 미래의 나에게 보내볼까요?</p>
        <button onClick={() => go(1)} className="mt-7 grid w-full grid-cols-[1fr_130px] items-center overflow-hidden rounded-[30px] border border-[#eadccb] bg-white/85 p-5 text-left shadow-[0_18px_45px_rgba(62,42,25,0.10)] transition hover:-translate-y-0.5">
          <div>
            <p className="text-[13px] font-black text-[#467d5c]">오늘의 추천 루틴</p>
            <p className="mt-2 text-[25px] font-black leading-tight tracking-[-0.04em] text-[#2d2924]">배달비 일부를<br />미래 지갑으로</p>
            <div className="mt-5 inline-flex rounded-full bg-[#467d5c] px-4 py-2 text-[13px] font-black text-white">₩5,000 보내기</div>
          </div>
          <AntFace mood="tired" className="h-32 w-32" />
        </button>
        <p className="mb-3 mt-7 text-[17px] font-black text-[#2d2924]">지금 할 수 있는 것</p>
        <div className="space-y-3">
          <button onClick={() => go(1)} className="flex w-full items-center gap-4 rounded-3xl border border-[#eadccb] bg-[#e3f1e4] p-4 text-left">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl">🍜</span>
            <span className="flex-1"><b className="block text-[16px]">배달 대신 투자하기</b><small className="text-[#7d6e60]">배달비 일부만 미래 지갑으로</small></span>
            <span className="material-symbols-outlined text-[#467d5c]">chevron_right</span>
          </button>
          <button onClick={() => go(1)} className="flex w-full items-center gap-4 rounded-3xl border border-[#eadccb] bg-white/80 p-4 text-left">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffe4d3] text-xl">📈</span>
            <span className="flex-1"><b className="block text-[16px]">충동 매수 전 멈추기</b><small className="text-[#7d6e60]">FOMO를 체크하고 10분 쉬기</small></span>
            <span className="material-symbols-outlined text-[#a69482]">chevron_right</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function ImpulseScreen({ go }: { go: (index: number) => void }) {
  const options = [
    ['🍜', '배달 주문', '오늘 하루가 너무 길었어'],
    ['🛍️', '쇼핑 결제', '기분전환이 필요해'],
    ['📈', '주식 매수', '지금 안 사면 놓칠 것 같아'],
    ['↩️', '손실 만회', '방금 잃은 걸 되돌리고 싶어'],
    ['…', '그냥 돈 쓰기', '뭔가 허전해'],
  ];
  return (
    <div className="relative h-full px-6 pt-10">
      <StatusBar />
      <p className="text-[20px] font-black text-[#2d2924]">충동 체크</p>
      <h2 className="mt-9 text-[34px] font-black leading-[1.1] tracking-[-0.05em]">지금 누르고 싶은<br />버튼은 뭐예요?</h2>
      <p className="mt-4 text-[15px] leading-6 text-[#7d6e60]">Dear ANT는 판단하지 않아요.<br />지금 마음을 먼저 볼게요.</p>
      <div className="mt-7 space-y-3">
        {options.map((option, index) => (
          <button key={option[1]} onClick={() => index === 0 && go(2)} className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${index === 0 ? 'border-[#c9dfc8] bg-[#e3f1e4]' : 'border-[#eadccb] bg-white/80'}`}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">{option[0]}</span>
            <span className="flex-1"><b className="block text-[16px]">{option[1]}</b><small className="text-[#7d6e60]">{option[2]}</small></span>
            <span className="material-symbols-outlined text-[#467d5c]">chevron_right</span>
          </button>
        ))}
      </div>
      <button onClick={() => go(2)} className="absolute bottom-8 left-6 right-6 rounded-[26px] bg-[#467d5c] py-4 text-[16px] font-black text-white shadow-[0_12px_26px_rgba(70,125,92,0.25)]">다음</button>
    </div>
  );
}

function EmotionScreen({ go }: { go: (index: number) => void }) {
  const chips = ['피곤함', '스트레스', '외로움', '보상받고 싶음', 'FOMO', '손실 만회', '아무 생각 없음'];
  return (
    <div className="relative h-full px-6 pt-10">
      <StatusBar />
      <p className="text-[20px] font-black text-[#2d2924]">감정 체크</p>
      <h2 className="mt-9 text-[34px] font-black leading-[1.1] tracking-[-0.05em]">이 선택은 어떤<br />마음에서 온 걸까요?</h2>
      <p className="mt-4 text-[15px] leading-6 text-[#7d6e60]">하나만 골라도 괜찮고,<br />여러 개 골라도 괜찮아요.</p>
      <div className="mt-7 grid grid-cols-[62px_1fr] items-center gap-3 rounded-[28px] bg-[#e3f1e4] p-4">
        <AntFace mood="soft" className="h-16 w-16" />
        <p className="text-[14px] font-extrabold leading-5 text-[#415143]">괜찮아. 우리는 지금<br />잘못이 아니라 패턴을 보는 중이야.</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        {chips.map((chip) => (
          <button key={chip} className={`rounded-full border px-4 py-3 text-[14px] font-extrabold ${chip === '피곤함' || chip === '보상받고 싶음' ? 'border-[#467d5c] bg-[#467d5c] text-white' : 'border-[#eadccb] bg-white text-[#2d2924]'}`}>{chip}</button>
        ))}
      </div>
      <button onClick={() => go(3)} className="absolute bottom-8 left-6 right-6 rounded-[26px] bg-[#467d5c] py-4 text-[16px] font-black text-white shadow-[0_12px_26px_rgba(70,125,92,0.25)]">AI 개미 진단 보기</button>
    </div>
  );
}

function DiagnosisScreen({ go }: { go: (index: number) => void }) {
  return (
    <div className="relative h-full px-6 pt-10">
      <StatusBar />
      <div className="relative overflow-hidden rounded-[34px] border border-[#eadccb] bg-white/90 p-6 shadow-[0_18px_48px_rgba(62,42,25,0.10)]">
        <p className="text-[13px] font-black text-[#467d5c]">오늘의 개미 타입</p>
        <h2 className="mt-2 text-[34px] font-black leading-[1.05] tracking-[-0.05em]">Reward-Seeking<br />ANT</h2>
        <AntFace mood="tired" className="absolute right-4 top-24 h-36 w-36" />
        <div className="mt-36">
          <p className="text-[12px] font-black uppercase tracking-wide text-[#8b7b6c]">Emotional Signal</p>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-[#efe8dd]"><div className="h-full w-[58%] rounded-full bg-[#f4b287]" /></div>
          <p className="mt-5 text-[14px] font-medium leading-6 text-[#7d6e60]">오늘의 너는 수익보다 위로가 먼저 필요한 상태예요. 배달을 참는 게 목표가 아니라, 작은 일부를 미래의 나에게 보내는 게 목표예요.</p>
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-[#c9dfc8] bg-[#e3f1e4] p-5">
        <p className="text-[13px] font-black text-[#467d5c]">Dear ANT 제안</p>
        <p className="mt-2 text-[21px] font-black leading-tight tracking-[-0.03em]">배달은 시켜도 괜찮아요.<br />대신 ₩5,000만 미래 지갑에 보낼래요?</p>
      </div>
      <button onClick={() => go(4)} className="absolute bottom-8 left-6 right-6 rounded-[26px] bg-[#467d5c] py-4 text-[16px] font-black text-white shadow-[0_12px_26px_rgba(70,125,92,0.25)]">₩5,000 보내기</button>
    </div>
  );
}

function ActionScreen({ go }: { go: (index: number) => void }) {
  const rows = [
    ['🍜', '오늘 예상 배달비', '₩18,000', 'text-[#2d2924]'],
    ['🌱', '미래 지갑으로 보내기', '₩5,000', 'text-[#467d5c]'],
  ];
  return (
    <div className="relative h-full px-6 pt-10">
      <StatusBar />
      <h2 className="mt-9 text-[35px] font-black leading-[1.1] tracking-[-0.05em]">전부 참지 않아도<br />괜찮아요.</h2>
      <p className="mt-4 text-[15px] leading-6 text-[#7d6e60]">오늘의 위로도 필요하고,<br />미래의 나도 조금은 챙길 수 있어요.</p>
      <div className="mt-8 rounded-[32px] border border-[#eadccb] bg-white/90 p-6 shadow-[0_18px_48px_rgba(62,42,25,0.08)]">
        {rows.map((row) => (
          <div key={row[1]} className="flex items-center justify-between border-b border-[#eadccb] py-4 last:border-b-0">
            <div><p className="text-[13px] font-bold text-[#8b7b6c]">{row[1]}</p><p className={`mt-1 text-[30px] font-black tracking-[-0.04em] ${row[3]}`}>{row[2]}</p></div>
            <span className="text-3xl">{row[0]}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        <button onClick={() => go(5)} className="flex w-full items-center gap-4 rounded-3xl border border-[#c9dfc8] bg-[#e3f1e4] p-4 text-left"><span className="text-2xl">🌱</span><span className="flex-1"><b>₩5,000 보내기</b><small className="block text-[#7d6e60]">작지만 오늘의 패턴을 바꾸는 선택</small></span></button>
        <button className="flex w-full items-center gap-4 rounded-3xl border border-[#eadccb] bg-white/80 p-4 text-left"><span className="text-2xl">✍️</span><span className="flex-1"><b>오늘은 기록만 하기</b><small className="block text-[#7d6e60]">돈을 보내지 않아도 패턴을 남겨요</small></span></button>
        <button className="flex w-full items-center gap-4 rounded-3xl border border-[#eadccb] bg-white/80 p-4 text-left"><span className="text-2xl">🍜</span><span className="flex-1"><b>그냥 배달하기</b><small className="block text-[#7d6e60]">죄책감 없이 선택해도 괜찮아요</small></span></button>
      </div>
    </div>
  );
}

function RewardScreen({ go }: { go: (index: number) => void }) {
  return (
    <div className="relative h-full bg-[#f7f1e7] px-6 pt-10 before:absolute before:left-[-70px] before:top-20 before:h-56 before:w-56 before:rounded-full before:bg-[#ffe6d1] after:absolute after:right-[-80px] after:top-32 after:h-60 after:w-60 after:rounded-full after:bg-[#ddeedc]">
      <StatusBar />
      <div className="relative z-10">
        <p className="text-[20px] font-black text-[#2d2924]">Future Me Card</p>
        <h2 className="mt-9 text-[35px] font-black leading-[1.1] tracking-[-0.05em]">미래의 내가<br />보낸 답장</h2>
        <div className="relative mt-8 h-[430px] overflow-hidden rounded-[34px] border border-[#eadccb] bg-white/90 p-7 shadow-[0_22px_60px_rgba(62,42,25,0.12)]">
          <p className="text-[15px] font-black text-[#467d5c]">Future Me Card</p>
          <AntFace mood="calm" className="mx-auto mt-6 h-40 w-40" />
          <p className="mt-7 text-[24px] font-black leading-[1.42] tracking-[-0.04em]">“오늘의 5,000원,<br />생각보다 큰 시작이었어.<br />오늘의 너에게 고마워.”</p>
          <p className="absolute bottom-6 left-7 text-[12px] font-extrabold text-[#8b7b6c]">Saved to Future Me Journal</p>
        </div>
      </div>
      <button onClick={() => go(6)} className="absolute bottom-24 left-6 right-6 z-10 rounded-[26px] bg-[#467d5c] py-4 text-[16px] font-black text-white shadow-[0_12px_26px_rgba(70,125,92,0.25)]">카드 저장하기</button>
      <button className="absolute bottom-8 left-6 right-6 z-10 rounded-[26px] border border-[#eadccb] bg-white/90 py-4 text-[16px] font-black text-[#467d5c]">친구에게 공유</button>
    </div>
  );
}

function JournalScreen() {
  const bars = [28, 50, 18, 76, 40, 88, 62];
  return (
    <div className="relative h-full">
      <StatusBar />
      <AppBar title="Journal" subtitle="이번 주 나의 패턴" emoji="🌱" />
      <div className="px-6 pt-5">
        <h2 className="text-[34px] font-black leading-[1.1] tracking-[-0.05em]">작은 선택이<br />쌓이고 있어요.</h2>
        <div className="mt-8 flex h-48 items-end gap-3 rounded-[30px] border border-[#eadccb] bg-white/85 p-5 pb-9 shadow-[0_18px_48px_rgba(62,42,25,0.08)]">
          {bars.map((bar, index) => (
            <div key={index} className="relative h-full flex-1 rounded-full bg-[#eee8dd]">
              <div className={`absolute bottom-0 left-0 right-0 rounded-full ${bar > 70 ? 'bg-[#f4b287]' : 'bg-[#77a97e]'}`} style={{ height: `${bar}%` }} />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[12px] font-bold text-[#8b7b6c]">{['월','화','수','목','금','토','일'][index]}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[28px] bg-[#e3f1e4] p-5">
          <p className="text-[13px] font-black text-[#467d5c]">AI Insight</p>
          <p className="mt-2 text-[21px] font-black leading-tight tracking-[-0.03em]">밤 10시 이후,<br />‘보상받고 싶음’이 가장 자주 나타나요.</p>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-3xl border border-[#c9dfc8] bg-[#e3f1e4] p-4">
          <span className="text-2xl">🐜</span>
          <span className="flex-1"><b>Reward-Seeking ANT</b><small className="block text-[#7d6e60]">₩5,000 미래 지갑</small></span>
        </div>
      </div>
      <BottomNav active="journal" />
    </div>
  );
}

function PhoneScreen({ screen, go }: { screen: ScreenId; go: (index: number) => void }) {
  if (screen === 'home') return <HomeScreen go={go} />;
  if (screen === 'impulse') return <ImpulseScreen go={go} />;
  if (screen === 'emotion') return <EmotionScreen go={go} />;
  if (screen === 'diagnosis') return <DiagnosisScreen go={go} />;
  if (screen === 'action') return <ActionScreen go={go} />;
  if (screen === 'reward') return <RewardScreen go={go} />;
  return <JournalScreen />;
}

export default function DesignTechDemoPage() {
  const [active, setActive] = useState(0);
  const activeScreen = screens[active];
  const progress = useMemo(() => `${Math.round(((active + 1) / screens.length) * 100)}%`, [active]);

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[radial-gradient(circle_at_12%_12%,#ffe6d1_0_18%,transparent_34%),radial-gradient(circle_at_84%_20%,#ddeedc_0_16%,transparent_32%),radial-gradient(circle_at_76%_92%,#efe8ff_0_14%,transparent_32%),#f7f1e7] text-[#2d2924]">
      <div className="mx-auto grid min-h-screen max-w-[1180px] grid-cols-[1fr_440px] items-center gap-12 px-8 py-10 max-[1020px]:grid-cols-1 max-[1020px]:justify-items-center max-[600px]:px-3">
        <section className="max-w-[660px] max-[1020px]:max-w-[760px]">
          <div className="mb-7 flex items-center gap-3 text-[#467d5c]">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#467d5c] text-white shadow-lg">🐜</div>
            <div className="font-black leading-tight">Dear ANT<br /><span className="text-[12px] text-[#7d6e60]">배달 대신 투자</span></div>
          </div>
          <h1 className="text-[68px] font-black leading-[0.98] tracking-[-0.065em] max-[600px]:text-[44px]">오늘의 충동을<br />미래의 나에게</h1>
          <p className="mt-6 text-[27px] font-black leading-tight tracking-[-0.03em] text-[#467d5c] max-[600px]:text-[21px]">An AI visual coach that turns instant comfort into future comfort.</p>
          <p className="mt-5 max-w-[610px] text-[18px] font-medium leading-8 text-[#7d6e60]">Dear ANT는 배달·쇼핑·FOMO 매수처럼 즉각적인 보상에 끌리는 순간을 포착하고, AI가 이를 개미 캐릭터와 감정 카드로 바꿔 작은 투자 습관으로 연결하는 모바일 앱 콘셉트입니다.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {['AI visual expression', 'Emotional habit loop', 'Repeat behavior'].map((item) => (
              <span key={item} className="rounded-full border border-[#eadccb] bg-white/70 px-4 py-3 text-[14px] font-black text-[#574b40] backdrop-blur">{item}</span>
            ))}
          </div>

          <div className="mt-9 rounded-[30px] border border-[#eadccb] bg-white/65 p-6 shadow-[0_18px_50px_rgba(62,42,25,0.08)] backdrop-blur">
            <p className="text-[20px] font-black">User flow</p>
            <div className="mt-5 grid gap-4">
              {['밤에 배달을 시키고 싶은 순간 앱을 연다.', '충동의 종류와 감정을 체크한다.', 'AI가 오늘의 개미 타입을 시각 카드로 보여준다.', '배달을 금지하지 않고 작은 금액만 미래 지갑으로 보낸다.', '미래의 내가 보낸 답장 카드가 즉각 보상이 된다.'].map((step, index) => (
                <div key={step} className="grid grid-cols-[34px_1fr] gap-3">
                  <b className="grid h-8 w-8 place-items-center rounded-full bg-[#e3f1e4] text-[#467d5c]">{index + 1}</b>
                  <span className="pt-1 text-[15px] font-semibold leading-6 text-[#7d6e60]">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full max-w-[420px]">
          <PhoneShell>
            <PhoneScreen screen={activeScreen.id} go={setActive} />
          </PhoneShell>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {screens.map((screen, index) => (
              <button key={screen.id} onClick={() => setActive(index)} className={`h-11 rounded-2xl border text-[14px] font-black transition ${active === index ? 'border-[#467d5c] bg-[#467d5c] text-white' : 'border-[#eadccb] bg-white/70 text-[#7d6e60]'}`}>{index + 1}</button>
            ))}
          </div>
          <div className="mt-4 rounded-[26px] border border-[#eadccb] bg-white/70 p-5 backdrop-blur">
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#eee8dd]"><div className="h-full rounded-full bg-[#467d5c] transition-all" style={{ width: progress }} /></div>
            <p className="text-[14px] font-black text-[#467d5c]">{activeScreen.title}</p>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-[#7d6e60]">{activeScreen.caption}</p>
          </div>
        </section>
      </div>

      <section className="mx-auto grid max-w-[1180px] grid-cols-3 gap-4 px-8 pb-12 max-[900px]:grid-cols-1 max-[600px]:px-3">
        <div className="rounded-[28px] border border-[#eadccb] bg-white/65 p-6 backdrop-blur"><b className="text-[#467d5c]">Visual expression</b><p className="mt-3 text-[15px] font-medium leading-7 text-[#7d6e60]">FOMO, 보상심리, 죄책감 같은 추상적 감정을 AI 개미 페르소나로 시각화합니다.</p></div>
        <div className="rounded-[28px] border border-[#eadccb] bg-white/65 p-6 backdrop-blur"><b className="text-[#467d5c]">Product intuition</b><p className="mt-3 text-[15px] font-medium leading-7 text-[#7d6e60]">투자를 차트가 아니라 일상 충동의 순간에서 시작하게 만들어 반복 사용 루프를 만듭니다.</p></div>
        <div className="rounded-[28px] border border-[#eadccb] bg-white/65 p-6 backdrop-blur"><b className="text-[#467d5c]">AI creative workflow</b><p className="mt-3 text-[15px] font-medium leading-7 text-[#7d6e60]">Emotion tags → Ant persona → Visual card → Tiny action → Reward card 구조로 AI를 제품 경험에 통합합니다.</p></div>
      </section>

      <section className="mx-auto max-w-[1180px] px-8 pb-16 max-[600px]:px-3">
        <div className="rounded-[34px] border border-[#eadccb] bg-[#2d2924] p-8 text-white shadow-[0_22px_70px_rgba(45,41,36,0.18)]">
          <p className="text-[14px] font-black uppercase tracking-[0.25em] text-[#f4b287]">Ant persona system</p>
          <div className="mt-6 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
            {personas.map((persona) => (
              <div key={persona.name} className={`rounded-[28px] bg-gradient-to-br ${persona.color} p-5 text-[#2d2924]`}>
                <span className="material-symbols-outlined text-[30px] text-[#467d5c]">{persona.icon}</span>
                <p className="mt-4 text-[17px] font-black leading-tight">{persona.name}</p>
                <p className="mt-2 text-[12px] font-black text-[#467d5c]">{persona.mood}</p>
                <p className="mt-3 text-[14px] font-semibold leading-6 text-[#6f6255]">{persona.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
