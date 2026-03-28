-- Dear Ant Database Schema v2
-- Updated: 2026-03-25 (Round 2 - schema alignment with application code)

-- ──────────────────────────────────────────────────────────────────────────────
-- TYPES
-- ──────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE mood_type AS ENUM ('불안', '설렘', '평온', '초조', '자신감');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE decision_mode_type AS ENUM ('방어', '관망', '신중', '적극');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_tendency_type AS ENUM ('낮음', '중간', '높음');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invest_mood_type AS ENUM ('A', 'B', 'C', 'D', 'F');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE memo_action_type AS ENUM ('buy', 'sell', 'hold', 'watch');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────────────────────────────────────────────

-- users (anonymous tracking)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- sessions (survey sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  birth_date date,
  mood mood_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- answers (individual responses)
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  question_key text NOT NULL,
  answer_value text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  UNIQUE(session_id, question_key)
);

-- reports (generated reports - aligned with StoredReport interface)
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  decision_mode decision_mode_type NOT NULL,
  mood_score integer NOT NULL CHECK (mood_score BETWEEN 0 AND 100),
  risk_tendency risk_tendency_type NOT NULL,
  invest_mood invest_mood_type NOT NULL,
  biorhythm_physical integer NOT NULL DEFAULT 0,
  biorhythm_emotional integer NOT NULL DEFAULT 0,
  biorhythm_intellectual integer NOT NULL DEFAULT 0,
  today_keywords text[] NOT NULL DEFAULT '{}',
  today_message text NOT NULL,
  today_letter text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- memos (trading journal - previously local-only)
CREATE TABLE IF NOT EXISTS memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_name text NOT NULL CHECK (char_length(stock_name) <= 100),
  stock_code text CHECK (char_length(stock_code) <= 10),
  action memo_action_type NOT NULL,
  price numeric,
  quantity integer,
  memo text CHECK (memo IS NULL OR char_length(memo) <= 2000),
  invest_mood invest_mood_type,
  decision_mode decision_mode_type,
  mood_score integer CHECK (mood_score IS NULL OR mood_score BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON reports(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memos_created_at ON memos(created_at DESC);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- Anonymous insert policies (MVP - to be tightened with auth)
CREATE POLICY "Allow anonymous insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON memos FOR INSERT WITH CHECK (true);

-- Select policies (MVP - open read, to be scoped with user auth)
CREATE POLICY "Allow anonymous select" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select" ON answers FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select" ON memos FOR SELECT USING (true);

-- Update/delete policies for memos
CREATE POLICY "Allow anonymous update" ON memos FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON memos FOR DELETE USING (true);
