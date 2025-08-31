-- Enhanced Educational Platform Schema for XP, Badges, and Coach Nova AI
-- Based on DropFly Education MVP specifications

-- ==========================================
-- XP SYSTEM TABLES
-- ==========================================

-- XP Events table - tracks all XP-earning activities
CREATE TABLE IF NOT EXISTS public.xp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assignment_id UUID,  -- References assignments table
    event_type TEXT CHECK (event_type IN ('assignment', 'quiz', 'test', 'homework', 'collaboration', 'practice', 'bonus')) NOT NULL,
    source_type TEXT CHECK (source_type IN ('SOLO', 'TEAM', 'QUIZ', 'TEST', 'HOMEWORK', 'SHOWCASE')) NOT NULL,
    xp_amount INTEGER NOT NULL CHECK (xp_amount >= 0),
    base_xp INTEGER NOT NULL,
    rubric_multiplier DECIMAL(3,2) DEFAULT 1.0,
    evidence_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18)
);

-- XP Caps table - prevents XP farming
CREATE TABLE IF NOT EXISTS public.xp_caps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18),
    cap_type TEXT CHECK (cap_type IN ('weekly_total', 'assignment_type', 'daily_limit')) NOT NULL,
    source_type TEXT,  -- assignment type this cap applies to
    max_xp INTEGER NOT NULL,
    current_xp INTEGER DEFAULT 0,
    reset_schedule TEXT DEFAULT 'weekly', -- weekly, daily, assignment
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(week, cap_type, source_type)
);

-- ==========================================
-- BADGE SYSTEM TABLES  
-- ==========================================

-- Badge Definitions
CREATE TABLE IF NOT EXISTS public.badge_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_key TEXT UNIQUE NOT NULL, -- "first_run", "ship_it", "streak_warrior"
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT DEFAULT '🏆',
    category TEXT CHECK (category IN ('completion', 'skill', 'collaboration', 'streak', 'special')) DEFAULT 'completion',
    xp_reward INTEGER DEFAULT 0,
    unlock_criteria JSONB NOT NULL, -- JSON criteria for auto-awarding
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')) DEFAULT 'common',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Badge Unlocks
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
    evidence_metadata JSONB DEFAULT '{}',
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    week_unlocked INTEGER,
    UNIQUE(user_id, badge_id)
);

-- ==========================================
-- ENHANCED ASSIGNMENTS SYSTEM
-- ==========================================

-- Replace lessons table with assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18),
    title TEXT NOT NULL,
    assignment_type TEXT CHECK (assignment_type IN ('SOLO', 'TEAM', 'QUIZ', 'TEST', 'HOMEWORK', 'SHOWCASE')) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    unlock_rule TEXT CHECK (unlock_rule IN ('sequential', 'manual', 'week_based')) DEFAULT 'sequential',
    
    -- Learning Objectives
    objectives TEXT[] NOT NULL,
    standards TEXT[] NOT NULL, -- FL-CPALMS alignment
    
    -- Content Structure (Learn/Code/Quiz/Submit tabs)
    learn_md TEXT, -- Markdown content for Learn tab
    code_starter TEXT, -- Preloaded code in editor
    code_tests_py TEXT, -- Pyodide unit tests
    code_patterns JSONB DEFAULT '{}', -- Static code checks
    
    quiz_items JSONB DEFAULT '[]', -- Quiz questions array
    checklist TEXT[] DEFAULT '{}', -- Student checklist items
    
    submit_prompt TEXT,
    rubric JSONB NOT NULL, -- Multi-criteria rubric with levels
    
    -- XP & Rewards
    base_xp INTEGER NOT NULL DEFAULT 100,
    badges_on_complete TEXT[] DEFAULT '{}',
    
    -- Team Settings (for TEAM assignments)
    team_size_min INTEGER DEFAULT 1,
    team_size_max INTEGER DEFAULT 4,
    allow_draft_day BOOLEAN DEFAULT false,
    
    -- Scheduling
    available_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    late_penalty_percent DECIMAL(5,2) DEFAULT 10.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- STUDENT PROGRESS & SUBMISSIONS
-- ==========================================

-- Enhanced progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    team_id UUID, -- For team assignments
    
    -- Progress Tracking
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded', 'completed')) DEFAULT 'not_started',
    tab_progress JSONB DEFAULT '{"learn": false, "code": false, "quiz": false, "submit": false}',
    
    -- Student Work
    submitted_code TEXT,
    quiz_answers JSONB DEFAULT '{}',
    checklist_completed BOOLEAN[] DEFAULT '{}',
    submit_response TEXT,
    
    -- Assessment
    teacher_feedback TEXT,
    grade_data JSONB DEFAULT '{}', -- Rubric-based grading
    final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
    xp_earned INTEGER DEFAULT 0,
    
    -- Timing
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, assignment_id)
);

-- ==========================================
-- COACH NOVA AI TUTOR SYSTEM
-- ==========================================

-- AI Tutor Sessions
CREATE TABLE IF NOT EXISTS public.ai_tutor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    session_context JSONB NOT NULL, -- lesson content, student code, error context
    
    -- Tutoring Mode & Policy
    tutor_mode TEXT CHECK (tutor_mode IN ('LEARN', 'ASSESS', 'OFF')) DEFAULT 'LEARN',
    scope_level TEXT CHECK (scope_level IN ('TIGHT', 'MODERATE', 'OPEN')) DEFAULT 'TIGHT',
    
    -- Session Management
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    total_interactions INTEGER DEFAULT 0,
    escalated_to_teacher BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tutor Interactions
CREATE TABLE IF NOT EXISTS public.ai_tutor_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.ai_tutor_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Conversation
    student_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    help_level INTEGER CHECK (help_level IN (1, 2, 3)) NOT NULL, -- Ladder of help
    
    -- Context & Analysis
    message_context JSONB DEFAULT '{}', -- code snapshot, error info
    response_type TEXT CHECK (response_type IN ('hint', 'concept', 'snippet', 'solution', 'out_of_scope')) NOT NULL,
    cited_content TEXT[], -- lesson content references
    
    -- Quality & Moderation
    student_rating INTEGER CHECK (student_rating >= 1 AND student_rating <= 5),
    flagged_for_review BOOLEAN DEFAULT false,
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- LEADERBOARD & TEAM SYSTEM
-- ==========================================

-- Leaderboard Snapshots (weekly)
CREATE TABLE IF NOT EXISTS public.leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18),
    snapshot_type TEXT CHECK (snapshot_type IN ('weekly', 'final')) DEFAULT 'weekly',
    
    -- Rankings
    public_rankings JSONB NOT NULL, -- Top 5 students with XP totals
    shadow_rankings JSONB NOT NULL, -- All students with private ranks
    
    -- Metrics
    total_students INTEGER NOT NULL,
    avg_xp DECIMAL(10,2) NOT NULL,
    xp_distribution JSONB NOT NULL, -- percentiles, gini coefficient
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(week, snapshot_type)
);

-- Teams for collaborative assignments
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    team_number INTEGER NOT NULL,
    
    -- Draft Day Support
    draft_round INTEGER,
    draft_pick INTEGER,
    captain_user_id UUID REFERENCES public.users(id),
    
    -- Team Status
    status TEXT CHECK (status IN ('forming', 'active', 'submitted', 'graded')) DEFAULT 'forming',
    team_xp_total INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, team_number)
);

-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('captain', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- ==========================================
-- PORTFOLIO & SHOWCASE SYSTEM  
-- ==========================================

-- Student Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- GitHub Integration
    github_repo_url TEXT,
    github_pages_url TEXT,
    auto_deploy_enabled BOOLEAN DEFAULT true,
    
    -- Portfolio Content
    showcase_assignments UUID[] DEFAULT '{}', -- Selected assignments to showcase
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    portfolio_theme TEXT DEFAULT 'default',
    
    -- Visibility
    is_public BOOLEAN DEFAULT false,
    showcase_approved BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Portfolio Artifacts (code, projects, etc.)
CREATE TABLE IF NOT EXISTS public.portfolio_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    
    artifact_type TEXT CHECK (artifact_type IN ('code', 'project', 'reflection', 'demo')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    code_content TEXT,
    artifact_url TEXT, -- For deployed projects
    
    -- Showcase Features
    featured BOOLEAN DEFAULT false,
    external_votes INTEGER DEFAULT 0,
    peer_ratings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ENHANCED ANALYTICS TABLES
-- ==========================================

-- Weekly Class Analytics
CREATE TABLE IF NOT EXISTS public.class_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18),
    
    -- Class Health Metrics
    avg_completion_rate DECIMAL(5,2),
    avg_time_per_assignment DECIMAL(10,2), -- minutes
    help_request_volume INTEGER DEFAULT 0,
    
    -- AI Tutor Analytics
    ai_interactions_total INTEGER DEFAULT 0,
    ai_success_rate DECIMAL(5,2),
    common_help_topics TEXT[] DEFAULT '{}',
    
    -- Engagement Metrics
    active_students INTEGER,
    streak_leaders JSONB DEFAULT '{}',
    collaboration_score DECIMAL(5,2),
    
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(week)
);

-- Standards Coverage Tracking
CREATE TABLE IF NOT EXISTS public.standards_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    standard_code TEXT NOT NULL, -- FL-CPALMS standard
    
    evidence_type TEXT CHECK (evidence_type IN ('code_submission', 'quiz_answer', 'reflection', 'peer_review')) NOT NULL,
    evidence_data JSONB NOT NULL,
    proficiency_level TEXT CHECK (proficiency_level IN ('developing', 'proficient', 'mastery')) DEFAULT 'developing',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_caps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards_evidence ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- XP Events Policies
CREATE POLICY "Students can view their own XP events" ON public.xp_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all XP events" ON public.xp_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- Badge Policies
CREATE POLICY "Anyone can view badge definitions" ON public.badge_definitions
    FOR SELECT USING (true);

CREATE POLICY "Students can view their own badges" ON public.student_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all student badges" ON public.student_badges
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- Assignment Policies
CREATE POLICY "Students can view available assignments" ON public.assignments
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- Progress Policies
CREATE POLICY "Students can manage their own progress" ON public.student_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all student progress" ON public.student_progress
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- AI Tutor Policies
CREATE POLICY "Students can access their own AI tutor sessions" ON public.ai_tutor_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Students can access their own AI interactions" ON public.ai_tutor_interactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view AI tutor data for moderation" ON public.ai_tutor_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

CREATE POLICY "Teachers can view AI interactions for moderation" ON public.ai_tutor_interactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- Team Policies
CREATE POLICY "Students can view teams they're part of" ON public.teams
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.team_members WHERE team_id = teams.id AND user_id = auth.uid())
    );

CREATE POLICY "Students can view their team memberships" ON public.team_members
    FOR SELECT USING (auth.uid() = user_id);

-- Portfolio Policies
CREATE POLICY "Students can manage their own portfolio" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable by all" ON public.portfolios
    FOR SELECT USING (is_public = true);

CREATE POLICY "Students can manage their own portfolio artifacts" ON public.portfolio_artifacts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_artifacts.portfolio_id AND user_id = auth.uid())
    );

-- Analytics Policies
CREATE POLICY "Teachers can view class analytics" ON public.class_analytics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

CREATE POLICY "Students can view their own standards evidence" ON public.standards_evidence
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all standards evidence" ON public.standards_evidence
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_artifacts_updated_at BEFORE UPDATE ON public.portfolio_artifacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- XP System Indexes
CREATE INDEX idx_xp_events_user_week ON public.xp_events(user_id, week);
CREATE INDEX idx_xp_events_type ON public.xp_events(event_type, source_type);
CREATE INDEX idx_student_badges_user ON public.student_badges(user_id);

-- Assignment System Indexes
CREATE INDEX idx_assignments_week ON public.assignments(week);
CREATE INDEX idx_assignments_type ON public.assignments(assignment_type);
CREATE INDEX idx_student_progress_user ON public.student_progress(user_id);
CREATE INDEX idx_student_progress_assignment ON public.student_progress(assignment_id);
CREATE INDEX idx_student_progress_status ON public.student_progress(status);

-- AI Tutor Indexes
CREATE INDEX idx_ai_sessions_user ON public.ai_tutor_sessions(user_id);
CREATE INDEX idx_ai_interactions_session ON public.ai_tutor_interactions(session_id);
CREATE INDEX idx_ai_interactions_user ON public.ai_tutor_interactions(user_id);

-- Team System Indexes
CREATE INDEX idx_teams_assignment ON public.teams(assignment_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);

-- Portfolio Indexes
CREATE INDEX idx_portfolios_user ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_public ON public.portfolios(is_public) WHERE is_public = true;
CREATE INDEX idx_portfolio_artifacts_portfolio ON public.portfolio_artifacts(portfolio_id);

-- Analytics Indexes
CREATE INDEX idx_class_analytics_week ON public.class_analytics(week);
CREATE INDEX idx_standards_evidence_user ON public.standards_evidence(user_id);
CREATE INDEX idx_standards_evidence_standard ON public.standards_evidence(standard_code);

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE public.xp_events IS 'Tracks all XP-earning activities with evidence and metadata';
COMMENT ON TABLE public.badge_definitions IS 'Defines all available badges with unlock criteria';
COMMENT ON TABLE public.student_badges IS 'Tracks which badges each student has unlocked';
COMMENT ON TABLE public.assignments IS 'Enhanced lesson structure with Learn/Code/Quiz/Submit tabs';
COMMENT ON TABLE public.student_progress IS 'Comprehensive progress tracking with rubric-based assessment';
COMMENT ON TABLE public.ai_tutor_sessions IS 'Coach Nova AI tutoring sessions with policy control';
COMMENT ON TABLE public.ai_tutor_interactions IS 'Individual AI conversations with ladder of help tracking';
COMMENT ON TABLE public.leaderboard_snapshots IS 'Weekly leaderboard data with public and shadow rankings';
COMMENT ON TABLE public.teams IS 'Team assignments with Draft Day support';
COMMENT ON TABLE public.portfolios IS 'Student portfolios with GitHub Pages integration';
COMMENT ON TABLE public.class_analytics IS 'Weekly class performance and engagement metrics';
COMMENT ON TABLE public.standards_evidence IS 'FL-CPALMS standards alignment tracking';