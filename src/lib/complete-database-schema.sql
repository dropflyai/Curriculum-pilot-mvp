-- Complete Database Schema for CodeFly Agent Academy
-- Run this entire file in your Supabase SQL Editor

-- ============= USER PROFILES TABLE =============
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    codename VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_type VARCHAR(50) DEFAULT 'cyber-ninja',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badge_level VARCHAR(50) DEFAULT 'Recruit',
    class_id UUID,
    team_id UUID,
    last_active TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= MISSION PROGRESS TABLE =============
CREATE TABLE IF NOT EXISTS public.mission_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    last_activity TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    xp_earned INTEGER DEFAULT 0,
    completed_weeks INTEGER[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mission_id)
);

-- ============= ACHIEVEMENTS TABLE =============
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    description TEXT,
    xp_bonus INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= ACTIVITY FEED TABLE =============
CREATE TABLE IF NOT EXISTS public.activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= STUDENT PROGRESS TABLE =============
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    xp_earned INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    completed_challenges INTEGER[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- ============= CODE SUBMISSIONS TABLE =============
CREATE TABLE IF NOT EXISTS public.code_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    challenge_number INTEGER NOT NULL,
    code TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    xp_earned INTEGER DEFAULT 0,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= LEADERBOARD TABLE =============
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    xp_gained INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    perfect_scores INTEGER DEFAULT 0,
    fastest_time_seconds INTEGER,
    rank INTEGER,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, class_id, period)
);

-- ============= TEAMS TABLE =============
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID,
    name VARCHAR(255) NOT NULL,
    captain_id UUID NOT NULL REFERENCES public.profiles(id),
    members UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= TEAM CHAT TABLE =============
CREATE TABLE IF NOT EXISTS public.team_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= CLASSES TABLE =============
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id),
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============= INDEXES FOR PERFORMANCE =============
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_id ON public.mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_status ON public.mission_progress(status);
CREATE INDEX IF NOT EXISTS idx_mission_progress_mission_id ON public.mission_progress(mission_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_class_id ON public.activity_feed(class_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON public.student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_user_id ON public.code_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_class_period ON public.leaderboard(class_id, period);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============= ROW LEVEL SECURITY =============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- ============= PROFILES POLICIES =============
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============= MISSION PROGRESS POLICIES =============
CREATE POLICY "Users can view own mission progress" ON public.mission_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mission progress" ON public.mission_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mission progress" ON public.mission_progress FOR UPDATE USING (auth.uid() = user_id);

-- Teachers can view all student mission progress
CREATE POLICY "Teachers can view student mission progress" ON public.mission_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'teacher'
    )
);

-- ============= ACHIEVEMENTS POLICIES =============
CREATE POLICY "Users can view own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON public.achievements FOR INSERT WITH CHECK (true);

-- ============= ACTIVITY FEED POLICIES =============
CREATE POLICY "Users can view own activity" ON public.activity_feed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view class activity" ON public.activity_feed FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'teacher'
    )
);
CREATE POLICY "System can insert activity" ON public.activity_feed FOR INSERT WITH CHECK (true);

-- ============= STUDENT PROGRESS POLICIES =============
CREATE POLICY "Users can manage own progress" ON public.student_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view student progress" ON public.student_progress FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'teacher'
    )
);

-- ============= CODE SUBMISSIONS POLICIES =============
CREATE POLICY "Users can manage own submissions" ON public.code_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view student submissions" ON public.code_submissions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'teacher'
    )
);

-- ============= LEADERBOARD POLICIES =============
CREATE POLICY "Users can view class leaderboard" ON public.leaderboard FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.class_id = leaderboard.class_id OR profiles.role IN ('teacher', 'admin'))
    )
);
CREATE POLICY "System can manage leaderboard" ON public.leaderboard FOR ALL WITH CHECK (true);

-- ============= TEAMS POLICIES =============
CREATE POLICY "Team members can view team" ON public.teams FOR SELECT USING (
    auth.uid() = captain_id OR auth.uid() = ANY(members)
);
CREATE POLICY "Captains can update team" ON public.teams FOR UPDATE USING (auth.uid() = captain_id);

-- ============= TEAM CHAT POLICIES =============
CREATE POLICY "Team members can view chat" ON public.team_chat FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE teams.id = team_chat.team_id
        AND (auth.uid() = teams.captain_id OR auth.uid() = ANY(teams.members))
    )
);
CREATE POLICY "Team members can send messages" ON public.team_chat FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE teams.id = team_chat.team_id
        AND (auth.uid() = teams.captain_id OR auth.uid() = ANY(teams.members))
    )
);

-- ============= CLASSES POLICIES =============
CREATE POLICY "Teachers can manage own classes" ON public.classes FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Students can view own class" ON public.classes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.class_id = classes.id
    )
);

-- ============= FUNCTIONS =============

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update mission progress timestamps
CREATE OR REPLACE FUNCTION update_mission_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.last_activity = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can unlock next mission
CREATE OR REPLACE FUNCTION check_mission_unlock(p_user_id UUID, p_mission_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_prerequisite VARCHAR;
    v_is_complete BOOLEAN;
BEGIN
    -- Define prerequisites
    CASE p_mission_id
        WHEN 'cipher-command' THEN v_prerequisite := 'shadow-protocol';
        WHEN 'ghost-protocol' THEN v_prerequisite := 'cipher-command';
        WHEN 'quantum-breach' THEN v_prerequisite := 'ghost-protocol';
        ELSE RETURN TRUE; -- First mission or unknown mission
    END CASE;
    
    -- Check if prerequisite is complete
    SELECT EXISTS(
        SELECT 1 FROM public.mission_progress
        WHERE user_id = p_user_id
        AND mission_id = v_prerequisite
        AND status = 'completed'
    ) INTO v_is_complete;
    
    RETURN v_is_complete;
END;
$$ LANGUAGE plpgsql;

-- ============= TRIGGERS =============
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_progress_updated_at BEFORE UPDATE ON public.mission_progress FOR EACH ROW EXECUTE FUNCTION update_mission_progress_updated_at();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============= GRANT PERMISSIONS =============
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============= DEMO DATA =============
-- Note: For demo users, profiles will be created automatically when they first log in
-- The demo authentication system handles creating these profiles dynamically
-- No hardcoded demo data needed here - the app will create profiles as needed

-- Optional: If you need test data, uncomment and modify these with real auth.user IDs:
/*
INSERT INTO public.profiles (id, email, full_name, codename, role, xp, level, badge_level)
VALUES (
    gen_random_uuid(), -- Replace with actual auth.user ID if needed
    'test.student@codefly.com',
    'Test Student',
    'Agent Phoenix',
    'student',
    0,
    1,
    'Recruit'
) ON CONFLICT (id) DO NOTHING;
*/