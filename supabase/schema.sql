-- Dear Ant MVP Database Schema

-- users (익명 사용자 추적용)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

-- sessions (설문 세션)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  birth_date date,
  mood text not null,
  created_at timestamptz default now()
);

-- answers (개별 응답)
create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  question_key text not null,
  answer_value text not null
);

-- reports (생성된 리포트)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  decision_mode text not null,
  mood_score integer not null,
  risk_tendency text not null,
  today_message text not null,
  today_letter text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table users enable row level security;
alter table sessions enable row level security;
alter table answers enable row level security;
alter table reports enable row level security;

-- Allow anonymous access for MVP
create policy "Allow anonymous insert" on users for insert with check (true);
create policy "Allow anonymous insert" on sessions for insert with check (true);
create policy "Allow anonymous insert" on answers for insert with check (true);
create policy "Allow anonymous insert" on reports for insert with check (true);
create policy "Allow anonymous select" on sessions for select using (true);
create policy "Allow anonymous select" on answers for select using (true);
create policy "Allow anonymous select" on reports for select using (true);
