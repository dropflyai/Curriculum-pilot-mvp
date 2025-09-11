-- Agent Academy Database Schema for Supabase

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
  mission_id TEXT DEFAULT 'binary-shores-academy',
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

-- Mission progress tracking table (for mission-hq localStorage migration)
CREATE TABLE public.mission_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completed_weeks INTEGER[] DEFAULT '{}',
  xp_earned INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Student projects storage (for InteractiveCodingPlayground localStorage migration)
CREATE TABLE public.student_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT DEFAULT 'python',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo classifier data (for RealPhotoClassifier localStorage migration)
CREATE TABLE public.user_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  classification TEXT,
  confidence DECIMAL(5,2),
  is_flagged BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson activity tracking (for lesson progress localStorage migration)
CREATE TABLE public.lesson_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'learn', 'flashcards', 'quiz', 'knowledge-quest', 'python-lab', 'ai-advisor-lab'
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, activity_type)
);

-- Capstone projects (for team formation and capstone localStorage migration)  
CREATE TABLE public.capstone_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- For individual projects
  title TEXT NOT NULL,
  description TEXT,
  repository_url TEXT,
  demo_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('planning', 'development', 'testing', 'completed')) DEFAULT 'planning',
  presentation_date DATE,
  grade TEXT,
  teacher_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework assignments (for vocabulary and other homework localStorage migration)
CREATE TABLE public.homework_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL, -- 'vocabulary', 'coding', 'project', etc.
  assignment_id TEXT NOT NULL, -- specific assignment identifier
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  answers JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, assignment_type, assignment_id)
);

-- Teacher grades (for teacher localStorage migration)
CREATE TABLE public.teacher_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  points INTEGER,
  max_points INTEGER DEFAULT 100,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_mission_progress_user ON mission_progress(user_id);
CREATE INDEX idx_mission_progress_mission ON mission_progress(mission_id);
CREATE INDEX idx_student_projects_user ON student_projects(user_id);
CREATE INDEX idx_user_photos_user ON user_photos(user_id);
CREATE INDEX idx_lesson_activities_user ON lesson_activities(user_id);
CREATE INDEX idx_lesson_activities_lesson ON lesson_activities(lesson_id);
CREATE INDEX idx_capstone_projects_team ON capstone_projects(team_id);
CREATE INDEX idx_capstone_projects_user ON capstone_projects(user_id);
CREATE INDEX idx_homework_assignments_user ON homework_assignments(user_id);
CREATE INDEX idx_teacher_grades_teacher ON teacher_grades(teacher_id);
CREATE INDEX idx_teacher_grades_student ON teacher_grades(student_id);

-- Row Level Security for new tables
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE capstone_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_grades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can manage own mission progress" ON mission_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects" ON student_projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON student_projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own photos" ON user_photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson activities" ON lesson_activities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Team members can manage capstone projects" ON capstone_projects
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = capstone_projects.team_id 
      AND auth.uid() = ANY(teams.members)
    )
  );

CREATE POLICY "Users can manage own homework" ON homework_assignments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can manage grades they assign" ON teacher_grades
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their own grades" ON teacher_grades
  FOR SELECT USING (auth.uid() = student_id);

-- Insert sample missions data
INSERT INTO missions (id, name, description, difficulty, duration_weeks, xp_reward, prerequisite_mission_id, image_url)
VALUES 
  ('binary-shores-academy', 'OPERATION BEACON', 'Master Python fundamentals through solo infiltration missions', 'BEGINNER', 4, 5000, NULL, '/Agent Academy_1.png'),
  ('cipher-command', 'CIPHER COMMAND', 'Form elite coding teams and master functions and data structures', 'INTERMEDIATE', 4, 7500, 'binary-shores-academy', '/Agent Academy_2.png'),
  ('loop-canyon-base', 'LOOP CANYON BASE', 'Execute complex team missions using object-oriented programming', 'ADVANCED', 5, 10000, 'cipher-command', '/Agent Academy_3.png'),
  ('quantum-breach', 'QUANTUM BREACH', 'Deploy advanced team projects using APIs and databases', 'EXPERT', 5, 15000, 'loop-canyon-base', '/Agent Academy_4.png');