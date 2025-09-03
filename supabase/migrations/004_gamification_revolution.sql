-- ============================================
-- CODEFLY GAMIFICATION REVOLUTION
-- Complete XP, Badges, Leaderboards, Teams System
-- ============================================

-- Update users table with gamification fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS accommodations_jsonb JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- ============================================
-- CORE GAMIFICATION TABLES
-- ============================================

-- Classes table for different cohorts
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    term TEXT NOT NULL,
    timezone TEXT DEFAULT 'America/New_York',
    starts_on DATE NOT NULL,
    ends_on DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments linking students to classes
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('student', 'teacher', 'ta')) DEFAULT 'student',
    active BOOLEAN DEFAULT true,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Teams for group projects
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '🚀',
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team memberships
CREATE TABLE IF NOT EXISTS public.team_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    contribution_score NUMERIC(5,2) DEFAULT 0,
    UNIQUE(team_id, student_id)
);

-- ============================================
-- CURRICULUM & ASSESSMENT
-- ============================================

-- Enhanced assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('SOLO', 'TEAM', 'QUIZ', 'TEST', 'HOMEWORK', 'SHOWCASE')) DEFAULT 'SOLO',
    base_xp INTEGER NOT NULL,
    due_at TIMESTAMPTZ,
    rubric_json JSONB DEFAULT '{}',
    standards_json JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions for assignments
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id),
    team_id UUID REFERENCES public.teams(id),
    code TEXT,
    score_pct NUMERIC(5,2),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    metadata_json JSONB DEFAULT '{}',
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.users(id),
    CONSTRAINT submission_owner CHECK (
        (student_id IS NOT NULL AND team_id IS NULL) OR 
        (student_id IS NULL AND team_id IS NOT NULL)
    )
);

-- Peer reviews
CREATE TABLE IF NOT EXISTS public.peer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    reviewer_student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regrade requests
CREATE TABLE IF NOT EXISTS public.regrade_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT CHECK (status IN ('OPEN', 'APPROVED', 'DENIED')) DEFAULT 'OPEN',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.users(id)
);

-- ============================================
-- XP SYSTEM
-- ============================================

-- XP events tracking
CREATE TABLE IF NOT EXISTS public.xp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    source TEXT CHECK (source IN ('ASSIGNMENT', 'QUIZ', 'TEST', 'HOMEWORK', 'TEAM_SHARE', 'PRACTICE', 'BONUS', 'ADJUSTMENT', 'PEER_REVIEW', 'STREAK', 'EARLY_SUBMIT')) NOT NULL,
    assignment_id UUID REFERENCES public.assignments(id),
    points INTEGER NOT NULL,
    multiplier NUMERIC(3,2) DEFAULT 1.0,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP multiplier rules
CREATE TABLE IF NOT EXISTS public.xp_multipliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('TIMELINESS', 'EARLY', 'CREATIVITY', 'STREAK', 'TEAM')) NOT NULL,
    condition_json JSONB NOT NULL,
    multiplier NUMERIC(3,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BADGES & ACHIEVEMENTS
-- ============================================

-- Badge definitions
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_emoji TEXT DEFAULT '🏆',
    category TEXT CHECK (category IN ('SKILL', 'MILESTONE', 'SOCIAL', 'SPECIAL')) DEFAULT 'SKILL',
    rarity TEXT CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')) DEFAULT 'COMMON',
    rule_json JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student badges earned
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    evidence JSONB DEFAULT '{}',
    UNIQUE(badge_id, student_id, class_id)
);

-- ============================================
-- LEADERBOARDS
-- ============================================

-- Weekly leaderboard snapshots
CREATE TABLE IF NOT EXISTS public.weekly_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    entries JSONB NOT NULL, -- [{student_id, rank, xp, movement, streak}]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, week_start_date)
);

-- Leaderboard streaks tracking
CREATE TABLE IF NOT EXISTS public.leaderboard_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_top5_week DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- ============================================
-- AI TUTOR SYSTEM
-- ============================================

-- Tutor policies per class/week
CREATE TABLE IF NOT EXISTS public.tutor_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    week_no INTEGER,
    mode TEXT CHECK (mode IN ('LEARN', 'ASSESS', 'OFF')) DEFAULT 'LEARN',
    scope_level TEXT CHECK (scope_level IN ('TIGHT', 'NORMAL', 'OPEN')) DEFAULT 'TIGHT',
    max_tokens INTEGER DEFAULT 700,
    rate_per_min INTEGER DEFAULT 3,
    snippet_line_cap INTEGER DEFAULT 12,
    created_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, week_no)
);

-- Allowed topics for tutor
CREATE TABLE IF NOT EXISTS public.tutor_allowed_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES public.tutor_policies(id) ON DELETE CASCADE,
    cpalms_code TEXT,
    topic_slug TEXT NOT NULL,
    description TEXT
);

-- Blocklist patterns
CREATE TABLE IF NOT EXISTS public.tutor_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES public.tutor_policies(id) ON DELETE CASCADE,
    pattern TEXT NOT NULL,
    reason TEXT,
    severity TEXT CHECK (severity IN ('HARD', 'SOFT')) DEFAULT 'SOFT'
);

-- Tool whitelist
CREATE TABLE IF NOT EXISTS public.tutor_tool_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES public.tutor_policies(id) ON DELETE CASCADE,
    tool_code TEXT NOT NULL
);

-- Tutor query logs
CREATE TABLE IF NOT EXISTS public.tutor_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES public.tutor_policies(id),
    prompt_text TEXT NOT NULL,
    resolved_topics JSONB DEFAULT '[]',
    decision TEXT CHECK (decision IN ('ALLOW', 'SOFT_BLOCK', 'HARD_BLOCK', 'ESCALATE')) NOT NULL,
    reason TEXT,
    tokens_in INTEGER,
    tokens_out INTEGER,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor responses
CREATE TABLE IF NOT EXISTS public.tutor_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES public.tutor_queries(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    assist_level TEXT CHECK (assist_level IN ('HINT', 'SNIPPET', 'EXAMPLE', 'EXPLANATION')) NOT NULL,
    redactions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation queue for tutor
CREATE TABLE IF NOT EXISTS public.moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    query_id UUID REFERENCES public.tutor_queries(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('OPEN', 'APPROVED', 'REJECTED')) DEFAULT 'OPEN',
    reviewer_id UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Lesson corpus for RAG
CREATE TABLE IF NOT EXISTS public.lesson_corpus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    week_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    content_url TEXT,
    content_text TEXT,
    vector_index_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, week_no, title)
);

-- ============================================
-- INTEGRITY & COMPLIANCE
-- ============================================

-- Integrity flags
CREATE TABLE IF NOT EXISTS public.integrity_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('PLAGIARISM', 'AI_ABUSE', 'FRAUD', 'OTHER')) NOT NULL,
    weight INTEGER DEFAULT 1,
    details JSONB DEFAULT '{}',
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    action_taken TEXT
);

-- Parent/guardian links
CREATE TABLE IF NOT EXISTS public.parent_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    contact_email TEXT NOT NULL,
    access_token TEXT UNIQUE NOT NULL,
    scopes JSONB DEFAULT '["progress", "badges", "showcase"]',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.users(id),
    role TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    before JSONB,
    after JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRAFT DAY SYSTEM
-- ============================================

-- Draft events
CREATE TABLE IF NOT EXISTS public.draft_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    draft_type TEXT CHECK (draft_type IN ('SNAKE', 'RANDOM', 'BALANCED')) DEFAULT 'SNAKE',
    status TEXT CHECK (status IN ('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED')) DEFAULT 'PLANNING',
    config_json JSONB DEFAULT '{}',
    results_json JSONB,
    scheduled_for TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Draft picks
CREATE TABLE IF NOT EXISTS public.draft_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_event_id UUID REFERENCES public.draft_events(id) ON DELETE CASCADE,
    pick_number INTEGER NOT NULL,
    team_id UUID REFERENCES public.teams(id),
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    picked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(draft_event_id, pick_number)
);

-- ============================================
-- ENABLE RLS ON ALL NEW TABLES
-- ============================================

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regrade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_multipliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_allowed_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_tool_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_corpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrity_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_picks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_xp_events_student ON public.xp_events(student_id, created_at DESC);
CREATE INDEX idx_xp_events_class ON public.xp_events(class_id, created_at DESC);
CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);
CREATE INDEX idx_student_badges_student ON public.student_badges(student_id);
CREATE INDEX idx_weekly_leaderboards_class_week ON public.weekly_leaderboards(class_id, week_start_date DESC);
CREATE INDEX idx_tutor_queries_student ON public.tutor_queries(student_id, created_at DESC);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update XP totals on xp_events insert
CREATE OR REPLACE FUNCTION update_student_xp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users 
    SET total_xp = (
        SELECT COALESCE(SUM(points * multiplier), 0) 
        FROM public.xp_events 
        WHERE student_id = NEW.student_id
    )
    WHERE id = NEW.student_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_xp
AFTER INSERT OR UPDATE ON public.xp_events
FOR EACH ROW EXECUTE FUNCTION update_student_xp();

-- Update team XP totals
CREATE OR REPLACE FUNCTION update_team_xp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.teams 
    SET total_xp = (
        SELECT COALESCE(SUM(xe.points * xe.multiplier), 0)
        FROM public.xp_events xe
        JOIN public.team_memberships tm ON tm.student_id = xe.student_id
        WHERE tm.team_id = (
            SELECT team_id FROM public.team_memberships WHERE student_id = NEW.student_id LIMIT 1
        )
    )
    WHERE id = (
        SELECT team_id FROM public.team_memberships WHERE student_id = NEW.student_id LIMIT 1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_xp
AFTER INSERT OR UPDATE ON public.xp_events
FOR EACH ROW EXECUTE FUNCTION update_team_xp();

-- Add all update triggers
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutor_policies_updated_at BEFORE UPDATE ON public.tutor_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_streaks_updated_at BEFORE UPDATE ON public.leaderboard_streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();