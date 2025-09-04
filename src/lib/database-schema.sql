-- Black Cipher Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  codename TEXT UNIQUE,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  avatar_type TEXT DEFAULT 'agent',
  school_id UUID,
  class_id UUID,
  team_id UUID,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badge_level TEXT DEFAULT 'Recruit',
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools/Organizations
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  mission_id TEXT DEFAULT 'operation-beacon',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams for collaborative missions
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mission_id TEXT,
  members UUID[] DEFAULT '{}',
  captain_id UUID REFERENCES profiles(id),
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions (Operation Beacon, Cipher Command, etc.)
CREATE TABLE public.missions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  duration_weeks INTEGER,
  xp_reward INTEGER,
  prerequisite_mission_id TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons within missions
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id TEXT REFERENCES missions(id),
  week INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  concept TEXT,
  difficulty TEXT,
  duration_minutes INTEGER DEFAULT 20,
  xp_reward INTEGER DEFAULT 100,
  objectives JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mission_id, week, lesson_number)
);

-- Student progress tracking
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  code_snapshots JSONB DEFAULT '[]',
  completed_challenges JSONB DEFAULT '[]',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Code submissions for each challenge
CREATE TABLE public.code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  challenge_number INTEGER,
  code TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  xp_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  xp_bonus INTEGER DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (materialized view for performance)
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  xp_gained INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  perfect_scores INTEGER DEFAULT 0,
  fastest_time_seconds INTEGER,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_id, period)
);

-- Activity feed for live updates
CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher dashboard analytics
CREATE TABLE public.class_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  active_students INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  total_xp_earned INTEGER DEFAULT 0,
  struggling_topics JSONB DEFAULT '[]',
  top_performers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, date)
);

-- Chat messages for team collaboration
CREATE TABLE public.team_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_school ON profiles(school_id);
CREATE INDEX idx_profiles_class ON profiles(class_id);
CREATE INDEX idx_profiles_team ON profiles(team_id);
CREATE INDEX idx_student_progress_user ON student_progress(user_id);
CREATE INDEX idx_student_progress_lesson ON student_progress(lesson_id);
CREATE INDEX idx_leaderboard_class ON leaderboard(class_id);
CREATE INDEX idx_leaderboard_period ON leaderboard(period);
CREATE INDEX idx_activity_feed_class ON activity_feed(class_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat ENABLE ROW LEVEL SECURITY;

-- Students can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Teachers can view students in their classes
CREATE POLICY "Teachers can view class students" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.teacher_id = auth.uid() 
      AND classes.id = profiles.class_id
    )
  );

-- Students can view and update their own progress
CREATE POLICY "Students can manage own progress" ON student_progress
  FOR ALL USING (auth.uid() = user_id);

-- Teachers can view progress of students in their classes
CREATE POLICY "Teachers can view class progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON p.class_id = c.id
      WHERE p.id = student_progress.user_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- Real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE team_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;

-- Insert sample missions data
INSERT INTO missions (id, name, description, difficulty, duration_weeks, xp_reward, prerequisite_mission_id, image_url)
VALUES 
  ('operation-beacon', 'OPERATION BEACON', 'Master Python fundamentals through solo infiltration missions', 'BEGINNER', 4, 5000, NULL, '/Black Cipher_1.png'),
  ('cipher-command', 'CIPHER COMMAND', 'Form elite coding teams and master functions and data structures', 'INTERMEDIATE', 4, 7500, 'operation-beacon', '/Black Cipher_2.png'),
  ('loop-canyon-base', 'LOOP CANYON BASE', 'Execute complex team missions using object-oriented programming', 'ADVANCED', 5, 10000, 'cipher-command', '/Black Cipher_3.png'),
  ('quantum-breach', 'QUANTUM BREACH', 'Deploy advanced team projects using APIs and databases', 'EXPERT', 5, 15000, 'loop-canyon-base', '/Black Cipher_4.png');