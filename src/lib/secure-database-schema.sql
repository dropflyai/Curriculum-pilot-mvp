-- =====================================================
-- BLACK CIPHER SECURE MULTI-TENANT DATABASE SCHEMA
-- Production-Ready with Complete Tenant Isolation
-- =====================================================

-- Clean migration support
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.rate_limits CASCADE;
DROP TABLE IF EXISTS public.ip_restrictions CASCADE;
DROP TABLE IF EXISTS public.activation_key_usage CASCADE;
DROP TABLE IF EXISTS public.activation_keys CASCADE;
DROP TABLE IF EXISTS public.team_chat CASCADE;
DROP TABLE IF EXISTS public.class_analytics CASCADE;
DROP TABLE IF EXISTS public.activity_feed CASCADE;
DROP TABLE IF EXISTS public.leaderboard CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.code_submissions CASCADE;
DROP TABLE IF EXISTS public.student_progress CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.missions CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Tenant isolation for profiles" ON profiles;
DROP POLICY IF EXISTS "Tenant isolation for schools" ON schools;
DROP POLICY IF EXISTS "Tenant isolation for classes" ON classes;
DROP POLICY IF EXISTS "Tenant isolation for teams" ON teams;
DROP POLICY IF EXISTS "Tenant isolation for student_progress" ON student_progress;
DROP POLICY IF EXISTS "Tenant isolation for code_submissions" ON code_submissions;
DROP POLICY IF EXISTS "Tenant isolation for achievements" ON achievements;
DROP POLICY IF EXISTS "Tenant isolation for leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Tenant isolation for activity_feed" ON activity_feed;
DROP POLICY IF EXISTS "Tenant isolation for class_analytics" ON class_analytics;
DROP POLICY IF EXISTS "Tenant isolation for team_chat" ON team_chat;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ACTIVATION KEYS SYSTEM
-- =====================================================

-- Activation keys for license management
CREATE TABLE public.activation_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_code TEXT UNIQUE NOT NULL,
  key_type TEXT NOT NULL CHECK (key_type IN ('STUDENT_SINGLE', 'TEACHER_LICENSE', 'SCHOOL_UNLIMITED')),
  
  -- School association (NULL for system-wide keys)
  school_id UUID,
  
  -- License limits and usage
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  
  -- Expiration and validity
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Security features
  ip_restrictions TEXT[], -- Array of allowed IP addresses/CIDR blocks
  domain_restrictions TEXT[], -- Array of allowed email domains
  
  -- Metadata
  description TEXT,
  created_by UUID, -- Admin who created this key
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_usage CHECK (current_uses <= max_uses),
  CONSTRAINT valid_expiration CHECK (expires_at > created_at)
);

-- Track activation key usage for audit trails
CREATE TABLE public.activation_key_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_id UUID NOT NULL REFERENCES activation_keys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Usage context
  ip_address INET,
  user_agent TEXT,
  school_id UUID,
  
  -- Result
  success BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  
  -- Audit
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CORE MULTI-TENANT TABLES
-- =====================================================

-- Schools/Organizations (Top-level tenant isolation)
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  
  -- License information
  license_type TEXT NOT NULL CHECK (license_type IN ('SCHOOL_UNLIMITED', 'TEACHER_LICENSE')) DEFAULT 'TEACHER_LICENSE',
  max_teachers INTEGER DEFAULT 1,
  max_students INTEGER DEFAULT 30,
  current_teachers INTEGER DEFAULT 0,
  current_students INTEGER DEFAULT 0,
  
  -- Security settings
  allowed_domains TEXT[], -- Restrict sign-ups to specific email domains
  ip_whitelist TEXT[], -- IP restrictions for the school
  require_approval BOOLEAN DEFAULT FALSE, -- Require admin approval for new users
  
  -- License expiration
  license_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Settings and metadata
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_teacher_count CHECK (current_teachers <= max_teachers),
  CONSTRAINT valid_student_count CHECK (current_students <= max_students)
);

-- Users table (extends Supabase auth.users with tenant isolation)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- CRITICAL: School ID for tenant isolation - NEVER NULL for active users
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Basic info
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  codename TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'school_admin', 'system_admin')) DEFAULT 'student',
  
  -- Avatar and appearance
  avatar_type TEXT DEFAULT 'agent',
  
  -- Class and team associations
  class_id UUID,
  team_id UUID,
  
  -- Gaming elements
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badge_level TEXT DEFAULT 'Recruit',
  streak_days INTEGER DEFAULT 0,
  
  -- Account status and security
  is_approved BOOLEAN DEFAULT TRUE, -- Can be set to false if school requires approval
  is_active BOOLEAN DEFAULT TRUE,
  last_login_ip INET,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Activation tracking
  activated_with_key UUID REFERENCES activation_keys(id),
  activated_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit timestamps
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraints within tenant
  UNIQUE(school_id, codename),
  UNIQUE(school_id, email)
);

-- Classes (within schools)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  mission_id TEXT DEFAULT 'operation-beacon',
  
  -- Class settings and limits
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique within school
  UNIQUE(school_id, code),
  CONSTRAINT valid_student_count CHECK (current_students <= max_students)
);

-- Teams for collaborative missions (within classes)
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  mission_id TEXT,
  members UUID[] DEFAULT '{}',
  captain_id UUID REFERENCES profiles(id),
  total_xp INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique within class
  UNIQUE(class_id, name)
);

-- Missions (global, but access controlled by tenant)
CREATE TABLE public.missions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  duration_weeks INTEGER,
  xp_reward INTEGER,
  prerequisite_mission_id TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons within missions (global)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  concept TEXT,
  difficulty TEXT,
  duration_minutes INTEGER DEFAULT 20,
  xp_reward INTEGER DEFAULT 100,
  objectives JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mission_id, week, lesson_number)
);

-- =====================================================
-- STUDENT TRACKING AND PROGRESS
-- =====================================================

-- Student progress tracking (tenant isolated)
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  
  -- Detailed tracking
  code_snapshots JSONB DEFAULT '[]',
  completed_challenges JSONB DEFAULT '[]',
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

-- Code submissions for each challenge (tenant isolated)
CREATE TABLE public.code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  challenge_number INTEGER NOT NULL,
  code TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  xp_earned INTEGER DEFAULT 0,
  
  -- Security: Store hash of code for integrity verification
  code_hash TEXT NOT NULL DEFAULT '',
  
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements/Badges (tenant isolated)
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  xp_bonus INTEGER DEFAULT 0,
  
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (tenant isolated)
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  xp_gained INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  perfect_scores INTEGER DEFAULT 0,
  fastest_time_seconds INTEGER,
  rank INTEGER,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_id, period)
);

-- Activity feed for live updates (tenant isolated)
CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher dashboard analytics (tenant isolated)
CREATE TABLE public.class_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
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

-- Team chat (tenant isolated)
CREATE TABLE public.team_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments JSONB DEFAULT '[]',
  is_flagged BOOLEAN DEFAULT FALSE, -- For content moderation
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECURITY AND AUDIT SYSTEM
-- =====================================================

-- IP restrictions for enhanced security
CREATE TABLE public.ip_restrictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  
  ip_address INET NOT NULL,
  ip_range CIDR, -- For IP ranges
  restriction_type TEXT NOT NULL CHECK (restriction_type IN ('ALLOW', 'DENY')),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(school_id, ip_address)
);

-- Rate limiting table
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address INET,
  
  action_type TEXT NOT NULL, -- 'login', 'api_call', 'code_submission', etc.
  action_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive audit logging
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Action details
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Risk assessment
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'LOW',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Tenant isolation indexes
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_school_email ON profiles(school_id, email);
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_teams_school_id ON teams(school_id);
CREATE INDEX idx_student_progress_school_id ON student_progress(school_id);
CREATE INDEX idx_code_submissions_school_id ON code_submissions(school_id);
CREATE INDEX idx_achievements_school_id ON achievements(school_id);
CREATE INDEX idx_leaderboard_school_id ON leaderboard(school_id);
CREATE INDEX idx_activity_feed_school_id ON activity_feed(school_id);
CREATE INDEX idx_class_analytics_school_id ON class_analytics(school_id);
CREATE INDEX idx_team_chat_school_id ON team_chat(school_id);

-- Performance indexes
CREATE INDEX idx_profiles_class ON profiles(class_id);
CREATE INDEX idx_profiles_team ON profiles(team_id);
CREATE INDEX idx_student_progress_user ON student_progress(user_id);
CREATE INDEX idx_student_progress_lesson ON student_progress(lesson_id);
CREATE INDEX idx_code_submissions_user_lesson ON code_submissions(user_id, lesson_id);
CREATE INDEX idx_leaderboard_class ON leaderboard(class_id);
CREATE INDEX idx_leaderboard_period ON leaderboard(period);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

-- Security and audit indexes
CREATE INDEX idx_activation_keys_code ON activation_keys(key_code);
CREATE INDEX idx_activation_keys_school ON activation_keys(school_id);
CREATE INDEX idx_activation_keys_expires ON activation_keys(expires_at);
CREATE INDEX idx_activation_key_usage_key ON activation_key_usage(key_id);
CREATE INDEX idx_audit_logs_school_user ON audit_logs(school_id, user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_rate_limits_user_action ON rate_limits(user_id, action_type);
CREATE INDEX idx_rate_limits_ip_action ON rate_limits(ip_address, action_type);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tenant-sensitive tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_key_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's school_id
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT school_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'system_admin' FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is school admin
CREATE OR REPLACE FUNCTION is_school_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role IN ('school_admin', 'system_admin') FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SCHOOLS - Only system admins can see all schools, school admins see their own
CREATE POLICY "School access control" ON schools
  FOR ALL USING (
    is_system_admin() OR 
    id = get_user_school_id()
  );

-- PROFILES - Complete tenant isolation
CREATE POLICY "Profile tenant isolation" ON profiles
  FOR ALL USING (
    is_system_admin() OR 
    school_id = get_user_school_id()
  );

-- CLASSES - Tenant isolation
CREATE POLICY "Class tenant isolation" ON classes
  FOR ALL USING (
    is_system_admin() OR 
    school_id = get_user_school_id()
  );

-- TEAMS - Tenant isolation
CREATE POLICY "Team tenant isolation" ON teams
  FOR ALL USING (
    is_system_admin() OR 
    school_id = get_user_school_id()
  );

-- STUDENT PROGRESS - Tenant isolation with user access
CREATE POLICY "Progress tenant isolation" ON student_progress
  FOR ALL USING (
    is_system_admin() OR 
    (school_id = get_user_school_id() AND 
     (user_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM classes c JOIN profiles p ON c.teacher_id = p.id 
              WHERE p.id = auth.uid() AND c.id = (SELECT class_id FROM profiles WHERE id = student_progress.user_id))))
  );

-- CODE SUBMISSIONS - Tenant isolation with user access
CREATE POLICY "Submission tenant isolation" ON code_submissions
  FOR ALL USING (
    is_system_admin() OR 
    (school_id = get_user_school_id() AND 
     (user_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM classes c JOIN profiles p ON c.teacher_id = p.id 
              WHERE p.id = auth.uid() AND c.id = (SELECT class_id FROM profiles WHERE id = code_submissions.user_id))))
  );

-- ACHIEVEMENTS - Tenant isolation
CREATE POLICY "Achievement tenant isolation" ON achievements
  FOR ALL USING (
    is_system_admin() OR 
    (school_id = get_user_school_id() AND user_id = auth.uid())
  );

-- LEADERBOARD - Tenant isolation
CREATE POLICY "Leaderboard tenant isolation" ON leaderboard
  FOR ALL USING (
    is_system_admin() OR 
    school_id = get_user_school_id()
  );

-- ACTIVITY FEED - Tenant isolation
CREATE POLICY "Activity tenant isolation" ON activity_feed
  FOR ALL USING (
    is_system_admin() OR 
    school_id = get_user_school_id()
  );

-- CLASS ANALYTICS - Tenant isolation, teachers can see their own classes
CREATE POLICY "Analytics tenant isolation" ON class_analytics
  FOR ALL USING (
    is_system_admin() OR 
    (school_id = get_user_school_id() AND 
     (is_school_admin() OR 
      EXISTS (SELECT 1 FROM classes WHERE id = class_analytics.class_id AND teacher_id = auth.uid())))
  );

-- TEAM CHAT - Tenant isolation, team members only
CREATE POLICY "Chat tenant isolation" ON team_chat
  FOR ALL USING (
    is_system_admin() OR 
    (school_id = get_user_school_id() AND 
     (user_id = auth.uid() OR 
      auth.uid() = ANY((SELECT members FROM teams WHERE id = team_chat.team_id))))
  );

-- ACTIVATION KEYS - System admins and school admins for their school
CREATE POLICY "Activation key access control" ON activation_keys
  FOR ALL USING (
    is_system_admin() OR 
    (is_school_admin() AND (school_id IS NULL OR school_id = get_user_school_id()))
  );

-- ACTIVATION KEY USAGE - Audit access for admins
CREATE POLICY "Key usage audit access" ON activation_key_usage
  FOR SELECT USING (
    is_system_admin() OR 
    (is_school_admin() AND EXISTS (SELECT 1 FROM activation_keys ak WHERE ak.id = activation_key_usage.key_id AND (ak.school_id IS NULL OR ak.school_id = get_user_school_id())))
  );

-- IP RESTRICTIONS - School admins for their school
CREATE POLICY "IP restriction access control" ON ip_restrictions
  FOR ALL USING (
    is_system_admin() OR 
    (is_school_admin() AND school_id = get_user_school_id())
  );

-- RATE LIMITS - System monitoring, admins can view
CREATE POLICY "Rate limit monitoring access" ON rate_limits
  FOR SELECT USING (
    is_system_admin() OR 
    (is_school_admin() AND (school_id IS NULL OR school_id = get_user_school_id())) OR
    user_id = auth.uid()
  );

-- AUDIT LOGS - Admins can view relevant logs
CREATE POLICY "Audit log access control" ON audit_logs
  FOR SELECT USING (
    is_system_admin() OR 
    (is_school_admin() AND (school_id IS NULL OR school_id = get_user_school_id()))
  );

-- =====================================================
-- TRIGGERS FOR AUDIT AND SECURITY
-- =====================================================

-- Function to log all changes to sensitive tables
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  school_id_val UUID;
  user_id_val UUID;
  risk_level_val TEXT := 'LOW';
BEGIN
  -- Get current user and school context
  user_id_val := auth.uid();
  
  -- Determine school_id from the record or current user
  IF TG_TABLE_NAME = 'schools' THEN
    school_id_val := COALESCE(NEW.id, OLD.id);
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    school_id_val := COALESCE(NEW.school_id, OLD.school_id);
  ELSIF TG_TABLE_NAME = 'activation_keys' THEN
    school_id_val := COALESCE(NEW.school_id, OLD.school_id);
    risk_level_val := 'HIGH'; -- Key operations are high risk
  ELSE
    -- Try to get school_id from current user profile
    SELECT p.school_id INTO school_id_val FROM profiles p WHERE p.id = user_id_val;
  END IF;
  
  -- Determine risk level based on operation and table
  IF TG_OP = 'DELETE' THEN
    risk_level_val := 'HIGH';
  ELSIF TG_TABLE_NAME IN ('activation_keys', 'schools', 'ip_restrictions') THEN
    risk_level_val := 'HIGH';
  ELSIF TG_TABLE_NAME = 'profiles' AND (OLD.role != NEW.role OR OLD.is_active != NEW.is_active) THEN
    risk_level_val := 'MEDIUM';
  END IF;
  
  -- Insert audit record
  INSERT INTO audit_logs (
    school_id, user_id, action, table_name, record_id,
    old_values, new_values, risk_level,
    ip_address, created_at
  ) VALUES (
    school_id_val, user_id_val,
    TG_OP, TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE row_to_json(OLD) END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
    risk_level_val,
    inet_client_addr(),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for all sensitive tables
CREATE TRIGGER audit_schools AFTER INSERT OR UPDATE OR DELETE ON schools
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_profiles AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_activation_keys AFTER INSERT OR UPDATE OR DELETE ON activation_keys
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_classes AFTER INSERT OR UPDATE OR DELETE ON classes
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Function to automatically update school student/teacher counts
CREATE OR REPLACE FUNCTION update_school_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count for the role
    UPDATE schools 
    SET current_students = current_students + CASE WHEN NEW.role = 'student' THEN 1 ELSE 0 END,
        current_teachers = current_teachers + CASE WHEN NEW.role = 'teacher' THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = NEW.school_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle role changes
    IF OLD.role != NEW.role OR OLD.school_id != NEW.school_id THEN
      -- Decrement old counts
      UPDATE schools 
      SET current_students = current_students - CASE WHEN OLD.role = 'student' THEN 1 ELSE 0 END,
          current_teachers = current_teachers - CASE WHEN OLD.role = 'teacher' THEN 1 ELSE 0 END,
          updated_at = NOW()
      WHERE id = OLD.school_id;
      
      -- Increment new counts
      UPDATE schools 
      SET current_students = current_students + CASE WHEN NEW.role = 'student' THEN 1 ELSE 0 END,
          current_teachers = current_teachers + CASE WHEN NEW.role = 'teacher' THEN 1 ELSE 0 END,
          updated_at = NOW()
      WHERE id = NEW.school_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement count for the role
    UPDATE schools 
    SET current_students = current_students - CASE WHEN OLD.role = 'student' THEN 1 ELSE 0 END,
        current_teachers = current_teachers - CASE WHEN OLD.role = 'teacher' THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = OLD.school_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_school_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_school_counts();

-- Function to hash code submissions for integrity
CREATE OR REPLACE FUNCTION hash_code_submission()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code_hash := encode(digest(NEW.code, 'sha256'), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hash_code_trigger
  BEFORE INSERT OR UPDATE ON code_submissions
  FOR EACH ROW EXECUTE FUNCTION hash_code_submission();

-- =====================================================
-- REAL-TIME SUBSCRIPTIONS
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE team_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;

-- =====================================================
-- SAMPLE DATA - MISSIONS
-- =====================================================

INSERT INTO missions (id, name, description, difficulty, duration_weeks, xp_reward, prerequisite_mission_id, image_url)
VALUES 
  ('operation-beacon', 'OPERATION BEACON', 'Master Python fundamentals through solo infiltration missions', 'BEGINNER', 4, 5000, NULL, '/Black Cipher_1.png'),
  ('cipher-command', 'CIPHER COMMAND', 'Form elite coding teams and master functions and data structures', 'INTERMEDIATE', 4, 7500, 'operation-beacon', '/Black Cipher_2.png'),
  ('loop-canyon-base', 'LOOP CANYON BASE', 'Execute complex team missions using object-oriented programming', 'ADVANCED', 5, 10000, 'cipher-command', '/Black Cipher_3.png'),
  ('quantum-breach', 'QUANTUM BREACH', 'Deploy advanced team projects using APIs and databases', 'EXPERT', 5, 15000, 'loop-canyon-base', '/Black Cipher_4.png');

-- =====================================================
-- SECURITY FUNCTIONS FOR APPLICATION USE
-- =====================================================

-- Function to validate activation key and create user
CREATE OR REPLACE FUNCTION activate_with_key(
  p_key_code TEXT,
  p_email TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'student',
  p_ip_address INET DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  key_record activation_keys%ROWTYPE;
  school_record schools%ROWTYPE;
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Find and validate the activation key
  SELECT * INTO key_record
  FROM activation_keys
  WHERE key_code = p_key_code
    AND is_active = TRUE
    AND expires_at > NOW()
    AND current_uses < max_uses;
  
  IF NOT FOUND THEN
    -- Log failed attempt
    INSERT INTO activation_key_usage (key_id, user_id, ip_address, success, failure_reason, used_at)
    SELECT ak.id, auth.uid(), p_ip_address, FALSE, 'Invalid or expired key', NOW()
    FROM activation_keys ak WHERE ak.key_code = p_key_code;
    
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired activation key');
  END IF;
  
  -- Check IP restrictions if set
  IF key_record.ip_restrictions IS NOT NULL AND array_length(key_record.ip_restrictions, 1) > 0 THEN
    IF p_ip_address IS NULL OR NOT (p_ip_address <<= ANY(key_record.ip_restrictions::cidr[])) THEN
      INSERT INTO activation_key_usage (key_id, user_id, ip_address, success, failure_reason, used_at)
      VALUES (key_record.id, auth.uid(), p_ip_address, FALSE, 'IP address not allowed', NOW());
      
      RETURN jsonb_build_object('success', false, 'error', 'Access not allowed from this location');
    END IF;
  END IF;
  
  -- Check domain restrictions if set
  IF key_record.domain_restrictions IS NOT NULL AND array_length(key_record.domain_restrictions, 1) > 0 THEN
    IF NOT (split_part(p_email, '@', 2) = ANY(key_record.domain_restrictions)) THEN
      INSERT INTO activation_key_usage (key_id, user_id, ip_address, success, failure_reason, used_at)
      VALUES (key_record.id, auth.uid(), p_ip_address, FALSE, 'Email domain not allowed', NOW());
      
      RETURN jsonb_build_object('success', false, 'error', 'Email domain not allowed for this key');
    END IF;
  END IF;
  
  -- Get or determine school
  IF key_record.school_id IS NOT NULL THEN
    SELECT * INTO school_record FROM schools WHERE id = key_record.school_id;
  ELSE
    -- For system-wide keys, could create a new school or assign to a default one
    -- This would need to be implemented based on business logic
    RETURN jsonb_build_object('success', false, 'error', 'School assignment required');
  END IF;
  
  -- Check school capacity
  IF p_role = 'student' AND school_record.current_students >= school_record.max_students THEN
    INSERT INTO activation_key_usage (key_id, user_id, ip_address, success, failure_reason, used_at)
    VALUES (key_record.id, auth.uid(), p_ip_address, FALSE, 'School at capacity', NOW());
    
    RETURN jsonb_build_object('success', false, 'error', 'School has reached maximum student capacity');
  END IF;
  
  IF p_role = 'teacher' AND school_record.current_teachers >= school_record.max_teachers THEN
    INSERT INTO activation_key_usage (key_id, user_id, ip_address, success, failure_reason, used_at)
    VALUES (key_record.id, auth.uid(), p_ip_address, FALSE, 'School at capacity', NOW());
    
    RETURN jsonb_build_object('success', false, 'error', 'School has reached maximum teacher capacity');
  END IF;
  
  -- Create the user profile
  new_user_id := auth.uid();
  
  INSERT INTO profiles (
    id, school_id, email, full_name, role,
    activated_with_key, activated_at, is_approved
  ) VALUES (
    new_user_id, school_record.id, p_email, p_full_name, p_role,
    key_record.id, NOW(), TRUE
  );
  
  -- Update key usage
  UPDATE activation_keys 
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = key_record.id;
  
  -- Log successful activation
  INSERT INTO activation_key_usage (key_id, user_id, school_id, ip_address, success, used_at)
  VALUES (key_record.id, new_user_id, school_record.id, p_ip_address, TRUE, NOW());
  
  RETURN jsonb_build_object(
    'success', true, 
    'user_id', new_user_id,
    'school_id', school_record.id,
    'role', p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_ip_address INET,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP;
BEGIN
  window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count attempts in the current window
  SELECT COUNT(*) INTO current_count
  FROM rate_limits
  WHERE (user_id = p_user_id OR ip_address = p_ip_address)
    AND action_type = p_action_type
    AND created_at > window_start;
  
  -- If under limit, record this attempt and allow
  IF current_count < p_max_attempts THEN
    INSERT INTO rate_limits (user_id, ip_address, action_type, school_id)
    VALUES (p_user_id, p_ip_address, p_action_type, get_user_school_id());
    
    RETURN TRUE;
  END IF;
  
  -- Over limit, deny
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL SYSTEM DATA
-- =====================================================

-- Create system admin school (for system administrators)
INSERT INTO schools (id, name, code, license_type, max_teachers, max_students)
VALUES ('00000000-0000-0000-0000-000000000001', 'System Administration', 'SYSTEM', 'SCHOOL_UNLIMITED', 100, 0);

-- =====================================================
-- FINAL SECURITY CHECKS
-- =====================================================

-- Ensure all tables have proper RLS enabled
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT IN ('missions', 'lessons') -- Global tables
  LOOP
    EXECUTE 'ALTER TABLE ' || t || ' ENABLE ROW LEVEL SECURITY';
  END LOOP;
END $$;

-- Final verification: Check that all sensitive tables have RLS policies
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = t.schemaname AND tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY tablename;