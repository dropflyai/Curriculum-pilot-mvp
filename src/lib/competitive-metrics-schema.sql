-- Competitive Metrics Database Schema for CodeFly Agent Academy
-- Extends the existing schema with comprehensive ranking tracking

-- ============= SPEED RECORDS TABLE =============
CREATE TABLE IF NOT EXISTS public.speed_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id VARCHAR(100) NOT NULL,
    lesson_id VARCHAR(100),
    completion_time_seconds INTEGER NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    is_personal_best BOOLEAN DEFAULT TRUE,
    is_global_record BOOLEAN DEFAULT FALSE,
    code_submission_id UUID REFERENCES public.code_submissions(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id, mission_id),
    INDEX(mission_id, completion_time_seconds)
);

-- ============= CODE QUALITY METRICS TABLE =============
CREATE TABLE IF NOT EXISTS public.code_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES public.code_submissions(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    
    -- Quality Scores (0-100)
    clean_code_score INTEGER DEFAULT 0,
    efficiency_score INTEGER DEFAULT 0,
    best_practices_score INTEGER DEFAULT 0,
    documentation_score INTEGER DEFAULT 0,
    error_handling_score INTEGER DEFAULT 0,
    innovation_score INTEGER DEFAULT 0,
    
    -- Technical Metrics
    lines_of_code INTEGER DEFAULT 0,
    cyclomatic_complexity INTEGER DEFAULT 0,
    code_reuse_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Accuracy Metrics
    test_cases_passed INTEGER DEFAULT 0,
    test_cases_total INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id, lesson_id),
    INDEX(submission_id)
);

-- ============= STREAK TRACKING TABLE =============
CREATE TABLE IF NOT EXISTS public.streak_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    streak_type VARCHAR(50) NOT NULL CHECK (streak_type IN ('perfect_score', 'daily_completion', 'code_quality', 'speed_improvement')),
    
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    streak_start_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Streak metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, streak_type),
    INDEX(user_id, streak_type),
    INDEX(current_streak DESC),
    INDEX(longest_streak DESC)
);

-- ============= COMMUNITY METRICS TABLE =============
CREATE TABLE IF NOT EXISTS public.community_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Help & Collaboration Points
    help_points_given INTEGER DEFAULT 0,
    help_points_received INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    code_reviews_given INTEGER DEFAULT 0,
    code_reviews_received INTEGER DEFAULT 0,
    mentorship_hours DECIMAL(8,2) DEFAULT 0,
    collaboration_score INTEGER DEFAULT 0,
    
    -- Weekly tracking
    weekly_help_points INTEGER DEFAULT 0,
    weekly_collaboration_score INTEGER DEFAULT 0,
    
    last_help_given TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id),
    INDEX(help_points_given DESC),
    INDEX(collaboration_score DESC)
);

-- ============= DISCOVERY METRICS TABLE =============
CREATE TABLE IF NOT EXISTS public.discovery_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    discovery_type VARCHAR(50) NOT NULL CHECK (discovery_type IN ('easter_egg', 'hidden_feature', 'secret_command', 'bonus_challenge', 'special_achievement')),
    discovery_id VARCHAR(100) NOT NULL,
    discovery_name VARCHAR(255) NOT NULL,
    discovery_description TEXT,
    mission_id VARCHAR(100),
    lesson_id VARCHAR(100),
    
    -- Discovery difficulty and points
    difficulty_rating INTEGER DEFAULT 1 CHECK (difficulty_rating BETWEEN 1 AND 5),
    discovery_points INTEGER DEFAULT 10,
    
    discovered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, discovery_id),
    INDEX(user_id),
    INDEX(discovery_type),
    INDEX(discovered_at)
);

-- ============= CONSISTENCY METRICS TABLE =============
CREATE TABLE IF NOT EXISTS public.consistency_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Daily Metrics
    daily_completion_rate DECIMAL(5,2) DEFAULT 0,
    lessons_completed_today INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    login_streak_days INTEGER DEFAULT 0,
    
    -- Weekly Aggregates (calculated)
    weekly_goals_met BOOLEAN DEFAULT FALSE,
    weekly_completion_rate DECIMAL(5,2) DEFAULT 0,
    assignment_punctuality_score DECIMAL(5,2) DEFAULT 100,
    practice_consistency_score DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, metric_date),
    INDEX(user_id, metric_date),
    INDEX(daily_completion_rate DESC),
    INDEX(weekly_completion_rate DESC)
);

-- ============= MISSION RECORDS TABLE =============
CREATE TABLE IF NOT EXISTS public.mission_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(100) NOT NULL,
    mission_name VARCHAR(255) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    
    -- Speed Records
    fastest_time_seconds INTEGER,
    fastest_time_holder UUID REFERENCES public.profiles(id),
    fastest_time_date TIMESTAMPTZ,
    
    -- Quality Records
    highest_quality_score INTEGER,
    highest_quality_holder UUID REFERENCES public.profiles(id),
    highest_quality_date TIMESTAMPTZ,
    
    -- Innovation Records
    highest_innovation_score INTEGER,
    highest_innovation_holder UUID REFERENCES public.profiles(id),
    highest_innovation_date TIMESTAMPTZ,
    
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(mission_id),
    INDEX(fastest_time_seconds),
    INDEX(highest_quality_score DESC),
    INDEX(highest_innovation_score DESC)
);

-- ============= WEEKLY RANKINGS TABLE =============
CREATE TABLE IF NOT EXISTS public.weekly_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    
    -- Ranking Categories
    overall_rank INTEGER,
    speed_rank INTEGER,
    accuracy_rank INTEGER,
    innovation_rank INTEGER,
    community_rank INTEGER,
    consistency_rank INTEGER,
    
    -- Points by Category
    speed_points INTEGER DEFAULT 0,
    accuracy_points INTEGER DEFAULT 0,
    innovation_points INTEGER DEFAULT 0,
    community_points INTEGER DEFAULT 0,
    consistency_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    
    -- Movement tracking
    previous_rank INTEGER,
    rank_movement INTEGER DEFAULT 0, -- positive = moved up
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date),
    INDEX(week_start_date, overall_rank),
    INDEX(user_id, week_start_date)
);

-- ============= INDEXES FOR PERFORMANCE =============
CREATE INDEX IF NOT EXISTS idx_speed_records_user_mission ON public.speed_records(user_id, mission_id);
CREATE INDEX IF NOT EXISTS idx_speed_records_global ON public.speed_records(mission_id, completion_time_seconds) WHERE is_global_record = TRUE;
CREATE INDEX IF NOT EXISTS idx_code_quality_user_lesson ON public.code_quality_metrics(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_streak_tracking_type_current ON public.streak_tracking(streak_type, current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_community_metrics_points ON public.community_metrics(help_points_given DESC, collaboration_score DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_metrics_user_type ON public.discovery_metrics(user_id, discovery_type);
CREATE INDEX IF NOT EXISTS idx_consistency_metrics_rates ON public.consistency_metrics(daily_completion_rate DESC, weekly_completion_rate DESC);

-- ============= FUNCTIONS FOR COMPETITIVE METRICS =============

-- Function to update speed records when a lesson is completed
CREATE OR REPLACE FUNCTION update_speed_record(
    p_user_id UUID,
    p_mission_id VARCHAR(100),
    p_lesson_id VARCHAR(100),
    p_completion_time_seconds INTEGER,
    p_difficulty_level VARCHAR(20),
    p_submission_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_personal_best BOOLEAN := FALSE;
    v_is_global_record BOOLEAN := FALSE;
    v_current_global_record INTEGER;
BEGIN
    -- Check if this is a personal best
    SELECT NOT EXISTS(
        SELECT 1 FROM public.speed_records
        WHERE user_id = p_user_id
        AND mission_id = p_mission_id
        AND completion_time_seconds <= p_completion_time_seconds
    ) INTO v_is_personal_best;
    
    -- Check if this is a global record
    SELECT COALESCE(MIN(completion_time_seconds), p_completion_time_seconds + 1)
    FROM public.speed_records
    WHERE mission_id = p_mission_id
    INTO v_current_global_record;
    
    v_is_global_record := (p_completion_time_seconds < v_current_global_record);
    
    -- Insert the new record
    INSERT INTO public.speed_records (
        user_id, mission_id, lesson_id, completion_time_seconds,
        difficulty_level, is_personal_best, is_global_record, code_submission_id
    ) VALUES (
        p_user_id, p_mission_id, p_lesson_id, p_completion_time_seconds,
        p_difficulty_level, v_is_personal_best, v_is_global_record, p_submission_id
    );
    
    -- Update mission records if this is a global record
    IF v_is_global_record THEN
        INSERT INTO public.mission_records (
            mission_id, mission_name, difficulty_level,
            fastest_time_seconds, fastest_time_holder, fastest_time_date
        ) VALUES (
            p_mission_id, p_mission_id, p_difficulty_level,
            p_completion_time_seconds, p_user_id, CURRENT_TIMESTAMP
        )
        ON CONFLICT (mission_id) DO UPDATE SET
            fastest_time_seconds = EXCLUDED.fastest_time_seconds,
            fastest_time_holder = EXCLUDED.fastest_time_holder,
            fastest_time_date = EXCLUDED.fastest_time_date,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN v_is_personal_best;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak tracking
CREATE OR REPLACE FUNCTION update_streak(
    p_user_id UUID,
    p_streak_type VARCHAR(50),
    p_success BOOLEAN
)
RETURNS INTEGER AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
BEGIN
    -- Get current streak data
    SELECT current_streak, longest_streak
    FROM public.streak_tracking
    WHERE user_id = p_user_id AND streak_type = p_streak_type
    INTO v_current_streak, v_longest_streak;
    
    -- Update streak based on success
    IF p_success THEN
        v_current_streak := COALESCE(v_current_streak, 0) + 1;
        v_longest_streak := GREATEST(COALESCE(v_longest_streak, 0), v_current_streak);
    ELSE
        v_current_streak := 0;
    END IF;
    
    -- Upsert streak record
    INSERT INTO public.streak_tracking (
        user_id, streak_type, current_streak, longest_streak,
        last_activity_date, is_active
    ) VALUES (
        p_user_id, p_streak_type, v_current_streak, v_longest_streak,
        CURRENT_DATE, p_success
    )
    ON CONFLICT (user_id, streak_type) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_activity_date = EXCLUDED.last_activity_date,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN v_current_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to award discovery points
CREATE OR REPLACE FUNCTION award_discovery(
    p_user_id UUID,
    p_discovery_type VARCHAR(50),
    p_discovery_id VARCHAR(100),
    p_discovery_name VARCHAR(255),
    p_mission_id VARCHAR(100) DEFAULT NULL,
    p_difficulty_rating INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    v_points INTEGER;
BEGIN
    -- Calculate points based on difficulty and type
    v_points := CASE p_difficulty_rating
        WHEN 1 THEN 10
        WHEN 2 THEN 25
        WHEN 3 THEN 50
        WHEN 4 THEN 100
        WHEN 5 THEN 200
        ELSE 10
    END;
    
    -- Bonus points for discovery type
    v_points := v_points + CASE p_discovery_type
        WHEN 'easter_egg' THEN 5
        WHEN 'hidden_feature' THEN 15
        WHEN 'secret_command' THEN 10
        WHEN 'bonus_challenge' THEN 25
        WHEN 'special_achievement' THEN 50
        ELSE 0
    END;
    
    -- Insert discovery record
    INSERT INTO public.discovery_metrics (
        user_id, discovery_type, discovery_id, discovery_name,
        mission_id, difficulty_rating, discovery_points
    ) VALUES (
        p_user_id, p_discovery_type, p_discovery_id, p_discovery_name,
        p_mission_id, p_difficulty_rating, v_points
    )
    ON CONFLICT (user_id, discovery_id) DO NOTHING;
    
    -- Award XP to user profile
    UPDATE public.profiles
    SET xp = xp + v_points,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============= TRIGGERS FOR AUTOMATIC UPDATES =============
CREATE TRIGGER update_streak_tracking_updated_at 
    BEFORE UPDATE ON public.streak_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_metrics_updated_at 
    BEFORE UPDATE ON public.community_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============= ROW LEVEL SECURITY =============
ALTER TABLE public.speed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consistency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;

-- ============= SECURITY POLICIES =============

-- Speed Records Policies
CREATE POLICY "Users can view all speed records" ON public.speed_records FOR SELECT USING (true);
CREATE POLICY "Users can insert own speed records" ON public.speed_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Code Quality Policies
CREATE POLICY "Users can view own quality metrics" ON public.code_quality_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view student quality metrics" ON public.code_quality_metrics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);
CREATE POLICY "System can insert quality metrics" ON public.code_quality_metrics FOR INSERT WITH CHECK (true);

-- Streak Tracking Policies
CREATE POLICY "Users can view own streaks" ON public.streak_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view all streaks for leaderboards" ON public.streak_tracking FOR SELECT USING (true);
CREATE POLICY "System can manage streaks" ON public.streak_tracking FOR ALL WITH CHECK (true);

-- Community Metrics Policies
CREATE POLICY "Users can view all community metrics" ON public.community_metrics FOR SELECT USING (true);
CREATE POLICY "Users can update own community metrics" ON public.community_metrics FOR ALL USING (auth.uid() = user_id);

-- Discovery Metrics Policies
CREATE POLICY "Users can view own discoveries" ON public.discovery_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view discovery leaderboards" ON public.discovery_metrics FOR SELECT USING (true);
CREATE POLICY "System can award discoveries" ON public.discovery_metrics FOR INSERT WITH CHECK (true);

-- Consistency Metrics Policies
CREATE POLICY "Users can view own consistency" ON public.consistency_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view student consistency" ON public.consistency_metrics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);
CREATE POLICY "System can track consistency" ON public.consistency_metrics FOR ALL WITH CHECK (true);

-- Mission Records Policies (Public for leaderboards)
CREATE POLICY "All users can view mission records" ON public.mission_records FOR SELECT USING (true);
CREATE POLICY "System can update mission records" ON public.mission_records FOR ALL WITH CHECK (true);

-- Weekly Rankings Policies
CREATE POLICY "Users can view weekly rankings" ON public.weekly_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage weekly rankings" ON public.weekly_rankings FOR ALL WITH CHECK (true);

-- ============= GRANT PERMISSIONS =============
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;