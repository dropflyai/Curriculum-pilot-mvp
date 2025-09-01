-- ============================================
-- SEED GAMIFICATION DATA
-- Badges, XP Rules, Initial Configuration
-- ============================================

-- Insert badge definitions
INSERT INTO public.badges (code, name, description, icon_emoji, category, rarity, rule_json, points) VALUES
    ('FIRST_BUILDER', 'First Builder', 'Submit your first project', '🔨', 'MILESTONE', 'COMMON', 
        '{"type": "first_submission"}', 10),
    
    ('BUG_SLAYER', 'Bug Slayer', 'Fix 10 or more bugs in your code', '🐛', 'SKILL', 'COMMON', 
        '{"type": "bug_fixes", "count": 10}', 20),
    
    ('PYTHON_PRODIGY', 'Python Prodigy', 'Score 90% or higher on Python mini-test', '🐍', 'SKILL', 'RARE', 
        '{"type": "test_score", "test": "python_mini", "min_score": 90}', 50),
    
    ('AI_TINKERER', 'AI Tinkerer', 'Complete an AI integration project', '🤖', 'SKILL', 'RARE', 
        '{"type": "project_type", "category": "ai"}', 40),
    
    ('PIXEL_PIONEER', 'Pixel Pioneer', 'Complete all web development projects', '🎨', 'SKILL', 'RARE', 
        '{"type": "project_completion", "category": "web", "count": "all"}', 45),
    
    ('TEAM_MVP', 'Team MVP', 'Top contributor on a team project', '⭐', 'SOCIAL', 'EPIC', 
        '{"type": "team_contribution", "rank": 1}', 60),
    
    ('STREAK_TOP5_3', 'Rising Star', 'Maintain Top 5 leaderboard position for 3 weeks', '📈', 'MILESTONE', 'RARE', 
        '{"type": "leaderboard_streak", "weeks": 3, "position": 5}', 30),
    
    ('STREAK_TOP5_6', 'Leaderboard Legend', 'Maintain Top 5 leaderboard position for 6 weeks', '🏆', 'MILESTONE', 'EPIC', 
        '{"type": "leaderboard_streak", "weeks": 6, "position": 5}', 75),
    
    ('FINAL_BOSS', 'Final Boss', 'Score 85% or higher on capstone project', '👑', 'MILESTONE', 'LEGENDARY', 
        '{"type": "capstone_score", "min_score": 85}', 100),
    
    ('EARLY_BIRD', 'Early Bird', 'Submit 5 assignments 24+ hours early', '🌅', 'MILESTONE', 'COMMON', 
        '{"type": "early_submissions", "count": 5, "hours_early": 24}', 15),
    
    ('PERFECT_WEEK', 'Perfect Week', 'Complete all assignments in a week with 100% score', '💯', 'MILESTONE', 'RARE', 
        '{"type": "perfect_week"}', 35),
    
    ('HELPER', 'Helper', 'Give helpful peer feedback 10 times', '🤝', 'SOCIAL', 'COMMON', 
        '{"type": "peer_reviews", "count": 10, "min_rating": 4}', 20),
    
    ('INNOVATOR', 'Innovator', 'Receive creativity bonus on 3 projects', '💡', 'SKILL', 'RARE', 
        '{"type": "creativity_bonus", "count": 3}', 30),
    
    ('COMEBACK_KID', 'Comeback Kid', 'Improve your rank by 10+ positions in one week', '🚀', 'MILESTONE', 'RARE', 
        '{"type": "rank_improvement", "positions": 10}', 25),
    
    ('NIGHT_OWL', 'Night Owl', 'Complete assignments after 10 PM five times', '🦉', 'MILESTONE', 'COMMON', 
        '{"type": "late_night_submissions", "count": 5, "hour": 22}', 10)
ON CONFLICT (code) DO NOTHING;

-- Insert default XP multiplier rules (for first class created)
INSERT INTO public.xp_multipliers (class_id, name, type, condition_json, multiplier, active) 
SELECT 
    NULL as class_id,  -- Will be updated when class is created
    name,
    type,
    condition_json,
    multiplier,
    active
FROM (VALUES
    ('On-Time Bonus', 'TIMELINESS', '{"submitted": "on_time"}', 1.1, true),
    ('Late Penalty Day 1', 'TIMELINESS', '{"days_late": 1}', 0.9, true),
    ('Late Penalty Day 2+', 'TIMELINESS', '{"days_late": 2, "operator": ">="}', 0.8, true),
    ('Early Bird Bonus', 'EARLY', '{"hours_early": 24, "operator": ">="}', 1.05, true),
    ('Creativity Bonus', 'CREATIVITY', '{"teacher_awarded": true}', 1.1, true),
    ('Week Streak Bonus', 'STREAK', '{"consecutive_weeks": 3, "operator": ">="}', 1.15, true),
    ('Team Synergy', 'TEAM', '{"team_project": true, "all_members_submitted": true}', 1.2, true)
) AS v(name, type, condition_json, multiplier, active);

-- Create sample class for testing
INSERT INTO public.classes (id, name, term, starts_on, ends_on) VALUES
    ('11111111-1111-1111-1111-111111111111', 'CodeFly Pilot - Fall 2024', 'Fall 2024', 
     CURRENT_DATE, CURRENT_DATE + INTERVAL '18 weeks')
ON CONFLICT DO NOTHING;

-- Create default tutor policies for each week
INSERT INTO public.tutor_policies (class_id, week_no, mode, scope_level, max_tokens, rate_per_min, snippet_line_cap)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    week_no,
    CASE 
        WHEN week_no IN (6, 13, 18) THEN 'ASSESS'  -- Test weeks
        ELSE 'LEARN'
    END as mode,
    CASE 
        WHEN week_no <= 6 THEN 'TIGHT'  -- Foundation phase
        WHEN week_no <= 13 THEN 'NORMAL'  -- Exploration phase
        ELSE 'NORMAL'  -- Capstone phase
    END as scope_level,
    700 as max_tokens,
    3 as rate_per_min,
    CASE 
        WHEN week_no <= 6 THEN 8  -- Smaller snippets for beginners
        ELSE 12
    END as snippet_line_cap
FROM generate_series(1, 18) as week_no
ON CONFLICT (class_id, week_no) DO NOTHING;

-- Add default allowed topics for Week 1
INSERT INTO public.tutor_allowed_topics (policy_id, cpalms_code, topic_slug, description)
SELECT 
    p.id,
    t.cpalms_code,
    t.topic_slug,
    t.description
FROM public.tutor_policies p
CROSS JOIN (VALUES
    ('SC.912.CS-CS.1.1', 'algorithms-basics', 'Basic algorithm concepts'),
    ('SC.912.CS-CP.1.2', 'events-and-sequences', 'Event-driven programming and sequences')
) AS t(cpalms_code, topic_slug, description)
WHERE p.class_id = '11111111-1111-1111-1111-111111111111' AND p.week_no = 1
ON CONFLICT DO NOTHING;

-- Add default blocklist patterns
INSERT INTO public.tutor_blocklist (policy_id, pattern, reason, severity)
SELECT 
    p.id,
    b.pattern,
    b.reason,
    b.severity
FROM public.tutor_policies p
CROSS JOIN (VALUES
    ('write the entire', 'Requesting complete solution', 'SOFT'),
    ('do my homework', 'Academic integrity violation', 'HARD'),
    ('give me the answer', 'Requesting direct answer', 'SOFT'),
    ('paste full code', 'Requesting complete code', 'SOFT'),
    ('solve everything', 'Requesting complete solution', 'SOFT')
) AS b(pattern, reason, severity)
WHERE p.class_id = '11111111-1111-1111-1111-111111111111'
ON CONFLICT DO NOTHING;

-- Add default tool whitelist
INSERT INTO public.tutor_tool_whitelist (policy_id, tool_code)
SELECT 
    p.id,
    t.tool_code
FROM public.tutor_policies p
CROSS JOIN (VALUES
    ('HINTS'),
    ('SNIPPETS'),
    ('EXAMPLES'),
    ('CONCEPTS'),
    ('DEBUGGING_HELP')
) AS t(tool_code)
WHERE p.class_id = '11111111-1111-1111-1111-111111111111' AND p.week_no <= 6
ON CONFLICT DO NOTHING;

-- Create functions for XP calculation
CREATE OR REPLACE FUNCTION calculate_assignment_xp(
    p_base_xp INTEGER,
    p_score_pct NUMERIC,
    p_submitted_at TIMESTAMPTZ,
    p_due_at TIMESTAMPTZ,
    p_creativity_bonus BOOLEAN DEFAULT FALSE
) RETURNS INTEGER AS $$
DECLARE
    v_xp INTEGER;
    v_timeliness_mult NUMERIC := 1.0;
    v_early_bonus NUMERIC := 1.0;
    v_creativity_mult NUMERIC := 1.0;
BEGIN
    -- Base calculation
    v_xp := p_base_xp * (p_score_pct / 100.0);
    
    -- Timeliness multiplier
    IF p_submitted_at <= p_due_at THEN
        v_timeliness_mult := 1.1;  -- On time bonus
        
        -- Early bonus (24+ hours early)
        IF p_submitted_at <= p_due_at - INTERVAL '24 hours' THEN
            v_early_bonus := 1.05;
        END IF;
    ELSE
        -- Late penalty
        v_timeliness_mult := GREATEST(
            0.5,  -- Minimum 50%
            1.0 - (0.1 * EXTRACT(DAY FROM (p_submitted_at - p_due_at)))
        );
    END IF;
    
    -- Creativity bonus
    IF p_creativity_bonus THEN
        v_creativity_mult := 1.1;
    END IF;
    
    -- Apply all multipliers
    v_xp := v_xp * v_timeliness_mult * v_early_bonus * v_creativity_mult;
    
    RETURN ROUND(v_xp);
END;
$$ LANGUAGE plpgsql;

-- Create function to check badge eligibility
CREATE OR REPLACE FUNCTION check_badge_eligibility(
    p_student_id UUID,
    p_badge_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_badge_rule JSONB;
    v_eligible BOOLEAN := FALSE;
BEGIN
    -- Get badge rule
    SELECT rule_json INTO v_badge_rule
    FROM public.badges
    WHERE code = p_badge_code;
    
    -- Check based on badge type
    CASE v_badge_rule->>'type'
        WHEN 'first_submission' THEN
            SELECT EXISTS(
                SELECT 1 FROM public.submissions 
                WHERE student_id = p_student_id
                LIMIT 1
            ) INTO v_eligible;
            
        WHEN 'test_score' THEN
            SELECT EXISTS(
                SELECT 1 FROM public.submissions s
                JOIN public.assignments a ON a.id = s.assignment_id
                WHERE s.student_id = p_student_id
                AND a.type = 'TEST'
                AND s.score_pct >= (v_badge_rule->>'min_score')::NUMERIC
            ) INTO v_eligible;
            
        WHEN 'leaderboard_streak' THEN
            SELECT current_streak >= (v_badge_rule->>'weeks')::INTEGER
            INTO v_eligible
            FROM public.leaderboard_streaks
            WHERE student_id = p_student_id;
            
        -- Add more badge types as needed
        ELSE
            v_eligible := FALSE;
    END CASE;
    
    RETURN v_eligible;
END;
$$ LANGUAGE plpgsql;

-- Create function for Draft Day team balancing
CREATE OR REPLACE FUNCTION balance_teams_by_xp(
    p_class_id UUID,
    p_num_teams INTEGER
) RETURNS TABLE(student_id UUID, team_number INTEGER) AS $$
DECLARE
    v_students RECORD;
    v_team_counter INTEGER := 1;
    v_direction INTEGER := 1;  -- 1 for forward, -1 for reverse (snake draft)
BEGIN
    -- Create temporary table for results
    CREATE TEMP TABLE IF NOT EXISTS draft_results (
        student_id UUID,
        team_number INTEGER
    ) ON COMMIT DROP;
    
    -- Snake draft: sort students by XP and assign to teams
    FOR v_students IN 
        SELECT u.id, u.total_xp
        FROM public.users u
        JOIN public.enrollments e ON e.student_id = u.id
        WHERE e.class_id = p_class_id
        AND e.role = 'student'
        AND e.active = true
        ORDER BY u.total_xp DESC
    LOOP
        INSERT INTO draft_results VALUES (v_students.id, v_team_counter);
        
        -- Snake draft logic
        v_team_counter := v_team_counter + v_direction;
        
        IF v_team_counter > p_num_teams THEN
            v_team_counter := p_num_teams;
            v_direction := -1;
        ELSIF v_team_counter < 1 THEN
            v_team_counter := 1;
            v_direction := 1;
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT * FROM draft_results;
END;
$$ LANGUAGE plpgsql;

-- Create view for current leaderboard
CREATE OR REPLACE VIEW public.current_leaderboard AS
SELECT 
    u.id as student_id,
    u.display_name,
    u.avatar_url,
    u.total_xp,
    RANK() OVER (ORDER BY u.total_xp DESC) as rank,
    ls.current_streak,
    COUNT(DISTINCT sb.badge_id) as badge_count,
    CASE 
        WHEN LAG(u.total_xp) OVER (ORDER BY u.total_xp DESC) IS NULL THEN 'NEW'
        WHEN u.total_xp > LAG(u.total_xp) OVER (ORDER BY u.total_xp DESC) THEN 'UP'
        WHEN u.total_xp < LAG(u.total_xp) OVER (ORDER BY u.total_xp DESC) THEN 'DOWN'
        ELSE 'SAME'
    END as movement
FROM public.users u
LEFT JOIN public.leaderboard_streaks ls ON ls.student_id = u.id
LEFT JOIN public.student_badges sb ON sb.student_id = u.id
WHERE u.role = 'student'
GROUP BY u.id, u.display_name, u.avatar_url, u.total_xp, ls.current_streak
ORDER BY u.total_xp DESC
LIMIT 5;  -- Top 5 only

-- Grant appropriate permissions
GRANT SELECT ON public.current_leaderboard TO authenticated;