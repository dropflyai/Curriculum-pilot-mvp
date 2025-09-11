-- ============================================
-- COMPETITIVE METRICS SYSTEM SEED DATA
-- Migration 007: Comprehensive Test Data for Rankings
-- ============================================

-- Inserts realistic test data for:
-- 1. Sample users with varying skill levels
-- 2. Speed records across multiple missions
-- 3. Code quality metrics for different lessons
-- 4. Active streaks and community activity
-- 5. Discovery achievements and consistency data

-- ============= SAMPLE USERS FOR TESTING =============

-- Insert test users (extending auth.users data)
INSERT INTO public.users (id, email, full_name, role, display_name, total_xp, current_streak, longest_streak) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'alex.speedster@codefly.dev', 'Alex Speedster', 'student', 'SpeedDemon', 2150, 15, 28),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bella.quality@codefly.dev', 'Bella Quality', 'student', 'QualityQueen', 1890, 8, 12),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'charlie.consistent@codefly.dev', 'Charlie Consistent', 'student', 'SteadyCharlie', 1675, 22, 22),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'diana.discoverer@codefly.dev', 'Diana Discoverer', 'student', 'EasterEggHunter', 1420, 5, 9),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ethan.helper@codefly.dev', 'Ethan Helper', 'student', 'CommunityMentor', 1950, 12, 18),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'fiona.newcomer@codefly.dev', 'Fiona Newcomer', 'student', 'FreshStart', 340, 3, 3),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'gabriel.allrounder@codefly.dev', 'Gabriel Allrounder', 'student', 'BalancedDev', 1785, 10, 15),
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'hannah.coder@codefly.dev', 'Hannah Advanced', 'student', 'ProCoder', 2420, 18, 25),
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'isaac.optimizer@codefly.dev', 'Isaac Optimizer', 'student', 'CodeOptimizer', 1665, 7, 11),
    ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'julia.innovator@codefly.dev', 'Julia Innovator', 'student', 'InnovateCoder', 1820, 13, 16)
ON CONFLICT (id) DO UPDATE SET
    total_xp = EXCLUDED.total_xp,
    current_streak = EXCLUDED.current_streak,
    longest_streak = EXCLUDED.longest_streak,
    display_name = EXCLUDED.display_name;

-- ============= SPEED RECORDS SAMPLE DATA =============

-- Insert speed records for multiple missions with realistic completion times
INSERT INTO public.speed_records (user_id, mission_id, lesson_id, completion_time_seconds, difficulty_level, is_personal_best, is_global_record) VALUES

-- Mission 1: "Hello World" (Easy mission)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 180, 'beginner', true, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 195, 'beginner', true, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 210, 'beginner', true, false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 240, 'beginner', true, false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 225, 'beginner', true, false),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 320, 'beginner', true, false),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 205, 'beginner', true, false),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 185, 'beginner', true, false),

-- Mission 2: "Variables and Data Types" (Intermediate)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MISSION_02_VARIABLES', 'lesson_2_1', 420, 'intermediate', true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MISSION_02_VARIABLES', 'lesson_2_1', 380, 'intermediate', true, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MISSION_02_VARIABLES', 'lesson_2_1', 390, 'intermediate', true, false),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'MISSION_02_VARIABLES', 'lesson_2_1', 395, 'intermediate', true, false),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'MISSION_02_VARIABLES', 'lesson_2_1', 405, 'intermediate', true, false),

-- Mission 3: "Control Flow" (Advanced)
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 680, 'advanced', true, true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 720, 'advanced', true, false),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 750, 'advanced', true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 695, 'advanced', true, false),

-- Mission 4: "Functions and Modules" (Expert)
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'MISSION_04_FUNCTIONS', 'lesson_4_1', 1200, 'expert', true, true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'MISSION_04_FUNCTIONS', 'lesson_4_1', 1350, 'expert', true, false),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'MISSION_04_FUNCTIONS', 'lesson_4_1', 1280, 'expert', true, false);

-- ============= CODE QUALITY METRICS SAMPLE DATA =============

-- Insert code quality data showing different user strengths
INSERT INTO public.code_quality_metrics (
    user_id, submission_id, lesson_id, clean_code_score, efficiency_score, 
    best_practices_score, documentation_score, error_handling_score, innovation_score,
    lines_of_code, cyclomatic_complexity, accuracy_percentage, test_cases_passed, test_cases_total
) VALUES

-- Bella Quality - Excels in clean code and best practices
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', gen_random_uuid(), 'lesson_1_1', 95, 85, 98, 92, 88, 75, 25, 3, 100.0, 12, 12),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', gen_random_uuid(), 'lesson_2_1', 98, 88, 95, 94, 90, 80, 42, 4, 100.0, 15, 15),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', gen_random_uuid(), 'lesson_3_1', 92, 90, 96, 89, 85, 78, 58, 6, 100.0, 18, 18),

-- Hannah Advanced - High across all metrics
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', gen_random_uuid(), 'lesson_1_1', 88, 95, 90, 85, 92, 90, 20, 2, 100.0, 12, 12),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', gen_random_uuid(), 'lesson_2_1', 90, 98, 88, 88, 95, 92, 38, 3, 100.0, 15, 15),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', gen_random_uuid(), 'lesson_3_1', 92, 96, 85, 90, 98, 88, 52, 5, 100.0, 18, 18),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', gen_random_uuid(), 'lesson_4_1', 89, 94, 87, 92, 96, 85, 75, 8, 100.0, 22, 22),

-- Julia Innovator - High innovation scores
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', gen_random_uuid(), 'lesson_1_1', 80, 82, 78, 75, 80, 95, 28, 4, 95.0, 11, 12),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', gen_random_uuid(), 'lesson_2_1', 85, 85, 80, 78, 85, 98, 45, 5, 100.0, 15, 15),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', gen_random_uuid(), 'lesson_3_1', 82, 88, 82, 80, 88, 100, 62, 7, 100.0, 18, 18),

-- Isaac Optimizer - Excels in efficiency
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', gen_random_uuid(), 'lesson_1_1', 75, 98, 80, 70, 82, 78, 18, 2, 100.0, 12, 12),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', gen_random_uuid(), 'lesson_2_1', 78, 96, 82, 72, 85, 82, 32, 3, 100.0, 15, 15),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', gen_random_uuid(), 'lesson_3_1', 80, 98, 85, 75, 88, 80, 48, 4, 95.0, 17, 18),

-- Gabriel Allrounder - Balanced scores
('gggggggg-gggg-gggg-gggg-gggggggggggg', gen_random_uuid(), 'lesson_1_1', 82, 85, 88, 80, 85, 82, 22, 3, 100.0, 12, 12),
('gggggggg-gggg-gggg-gggg-gggggggggggg', gen_random_uuid(), 'lesson_2_1', 85, 82, 85, 82, 88, 85, 40, 4, 95.0, 14, 15),
('gggggggg-gggg-gggg-gggg-gggggggggggg', gen_random_uuid(), 'lesson_3_1', 88, 85, 82, 85, 82, 88, 55, 6, 100.0, 18, 18),

-- Alex Speedster - Lower quality but fast
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gen_random_uuid(), 'lesson_1_1', 70, 75, 65, 60, 68, 72, 30, 5, 90.0, 10, 12),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gen_random_uuid(), 'lesson_2_1', 72, 78, 68, 65, 70, 75, 48, 6, 85.0, 12, 15),

-- Fiona Newcomer - Learning progress
('ffffffff-ffff-ffff-ffff-ffffffffffff', gen_random_uuid(), 'lesson_1_1', 45, 50, 48, 40, 42, 35, 35, 8, 75.0, 9, 12);

-- ============= STREAK TRACKING SAMPLE DATA =============

-- Insert various streak types for different users
INSERT INTO public.streak_tracking (user_id, streak_type, current_streak, longest_streak, last_activity_date, is_active) VALUES

-- Charlie Consistent - Master of daily completion
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'daily_completion', 22, 22, CURRENT_DATE, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'perfect_score', 8, 12, CURRENT_DATE - INTERVAL '2 days', false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'code_quality', 15, 18, CURRENT_DATE, true),

-- Hannah Advanced - Multiple active streaks
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'perfect_score', 18, 25, CURRENT_DATE, true),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'daily_completion', 25, 30, CURRENT_DATE, true),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'speed_improvement', 8, 12, CURRENT_DATE, true),

-- Alex Speedster - Speed focused
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'speed_improvement', 15, 28, CURRENT_DATE, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'daily_completion', 12, 20, CURRENT_DATE, true),

-- Bella Quality - Quality streaks
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'code_quality', 8, 12, CURRENT_DATE, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'perfect_score', 6, 9, CURRENT_DATE, true),

-- Julia Innovator - Innovation streak
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'code_quality', 13, 16, CURRENT_DATE, true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'daily_completion', 10, 14, CURRENT_DATE, true),

-- Ethan Helper - Community streaks
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'daily_completion', 12, 18, CURRENT_DATE, true),

-- Gabriel Allrounder - Balanced streaks
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'daily_completion', 10, 15, CURRENT_DATE, true),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'code_quality', 7, 11, CURRENT_DATE, true),

-- Isaac Optimizer - Efficiency streak
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'speed_improvement', 7, 11, CURRENT_DATE, true),

-- Diana Discoverer - Shorter but recent streak
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'daily_completion', 5, 9, CURRENT_DATE, true),

-- Fiona Newcomer - Just starting
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'daily_completion', 3, 3, CURRENT_DATE, true);

-- ============= COMMUNITY METRICS SAMPLE DATA =============

-- Insert community activity showing collaboration
INSERT INTO public.community_metrics (
    user_id, help_points_given, help_points_received, questions_answered, 
    code_reviews_given, code_reviews_received, mentorship_hours, collaboration_score,
    weekly_help_points, weekly_collaboration_score
) VALUES

-- Ethan Helper - Community champion
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 450, 120, 85, 42, 18, 15.5, 92, 85, 88),

-- Hannah Advanced - High contributor
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 320, 95, 58, 35, 22, 12.0, 85, 65, 82),

-- Charlie Consistent - Steady helper
('cccccccc-cccc-cccc-cccc-cccccccccccc', 280, 140, 42, 28, 25, 8.5, 78, 55, 75),

-- Gabriel Allrounder - Balanced community activity
('gggggggg-gggg-gggg-gggg-gggggggggggg', 210, 180, 35, 22, 28, 6.0, 72, 45, 68),

-- Bella Quality - Helpful with code reviews
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 185, 85, 28, 38, 15, 5.5, 68, 38, 65),

-- Julia Innovator - Innovative collaboration
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 155, 110, 22, 18, 20, 4.0, 62, 32, 58),

-- Isaac Optimizer - Selective but helpful
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 125, 95, 18, 15, 12, 3.5, 55, 25, 52),

-- Alex Speedster - Lower community focus
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 85, 165, 12, 8, 18, 2.0, 42, 18, 38),

-- Diana Discoverer - Moderate helper
('dddddddd-dddd-dddd-dddd-dddddddddddd', 95, 120, 15, 12, 15, 2.5, 48, 22, 45),

-- Fiona Newcomer - Receiving more help than giving (normal for beginners)
('ffffffff-ffff-ffff-ffff-ffffffffffff', 25, 185, 3, 2, 8, 0.5, 25, 8, 22);

-- ============= DISCOVERY METRICS SAMPLE DATA =============

-- Insert discovery achievements
INSERT INTO public.discovery_metrics (
    user_id, discovery_type, discovery_id, discovery_name, discovery_description,
    mission_id, lesson_id, difficulty_rating, discovery_points
) VALUES

-- Diana Discoverer - Master explorer
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'easter_egg', 'EASTER_KONAMI_CODE', 'Konami Code Master', 'Found the hidden Konami code in the IDE', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 3, 55),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hidden_feature', 'SECRET_DEBUGGER_MODE', 'Secret Debugger', 'Discovered advanced debugging mode', 'MISSION_02_VARIABLES', 'lesson_2_1', 4, 115),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'secret_command', 'RAINBOW_CONSOLE', 'Rainbow Console', 'Activated rainbow console theme', NULL, NULL, 2, 35),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bonus_challenge', 'HIDDEN_ALGORITHM', 'Algorithm Hunter', 'Solved the hidden sorting algorithm puzzle', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 5, 225),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'special_achievement', 'FIRST_DISCOVERER', 'Pioneer Explorer', 'First to find 5+ easter eggs', NULL, NULL, 4, 150),

-- Hannah Advanced - Multiple discoveries
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'easter_egg', 'EASTER_KONAMI_CODE', 'Konami Code Master', 'Found the hidden Konami code in the IDE', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 3, 55),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'hidden_feature', 'ADVANCED_AUTOCOMPLETE', 'AI Autocomplete Pro', 'Unlocked advanced AI completion', 'MISSION_02_VARIABLES', 'lesson_2_1', 3, 65),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'bonus_challenge', 'OPTIMIZATION_PUZZLE', 'Code Optimizer', 'Solved efficiency optimization challenge', 'MISSION_04_FUNCTIONS', 'lesson_4_1', 4, 125),

-- Julia Innovator - Creative discoveries
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'easter_egg', 'EASTER_SPACE_INVADERS', 'Retro Gamer', 'Found Space Invaders mini-game', NULL, NULL, 2, 35),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'secret_command', 'THEME_CREATOR', 'Theme Master', 'Discovered custom theme creator', NULL, NULL, 3, 60),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'hidden_feature', 'CODE_ART_MODE', 'ASCII Artist', 'Found code-to-art generator', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 3, 65),

-- Gabriel Allrounder - Balanced discovery
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'easter_egg', 'EASTER_KONAMI_CODE', 'Konami Code Master', 'Found the hidden Konami code in the IDE', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 3, 55),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'secret_command', 'PRODUCTIVITY_BOOST', 'Efficiency Expert', 'Unlocked productivity shortcuts', NULL, NULL, 2, 35),

-- Isaac Optimizer - Technical discoveries
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'hidden_feature', 'PERFORMANCE_ANALYZER', 'Performance Pro', 'Found advanced performance analysis tools', 'MISSION_02_VARIABLES', 'lesson_2_1', 4, 115),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'bonus_challenge', 'MEMORY_OPTIMIZATION', 'Memory Master', 'Solved memory optimization puzzle', 'MISSION_03_CONTROL_FLOW', 'lesson_3_1', 4, 125),

-- Alex Speedster - Quick finds
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'easter_egg', 'EASTER_KONAMI_CODE', 'Konami Code Master', 'Found the hidden Konami code in the IDE', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 3, 55),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'secret_command', 'SPEED_MODE', 'Lightning Fast', 'Activated speed coding mode', NULL, NULL, 2, 35),

-- Bella Quality - Quality-focused discoveries
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'hidden_feature', 'CODE_QUALITY_SCANNER', 'Quality Inspector', 'Found advanced code quality analyzer', 'MISSION_02_VARIABLES', 'lesson_2_1', 3, 65),

-- Ethan Helper - Community discoveries
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'easter_egg', 'EASTER_KONAMI_CODE', 'Konami Code Master', 'Found the hidden Konami code in the IDE', 'MISSION_01_HELLO_WORLD', 'lesson_1_1', 3, 55),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'hidden_feature', 'MENTOR_TOOLS', 'Mentor Master', 'Discovered advanced mentoring features', NULL, NULL, 3, 65);

-- ============= CONSISTENCY METRICS SAMPLE DATA =============

-- Insert consistency data for recent days
INSERT INTO public.consistency_metrics (
    user_id, metric_date, daily_completion_rate, lessons_completed_today, 
    time_spent_minutes, login_streak_days, weekly_goals_met, weekly_completion_rate,
    assignment_punctuality_score, practice_consistency_score
) VALUES

-- Charlie Consistent - Excellent consistency
('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE, 100.0, 3, 180, 22, true, 95.0, 100.0, 98.5),
('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE - INTERVAL '1 day', 100.0, 2, 150, 21, true, 95.0, 100.0, 98.0),
('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE - INTERVAL '2 days', 100.0, 4, 240, 20, true, 95.0, 100.0, 97.5),
('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE - INTERVAL '3 days', 100.0, 2, 120, 19, true, 95.0, 100.0, 97.0),

-- Hannah Advanced - High performance
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_DATE, 100.0, 4, 220, 25, true, 98.0, 95.0, 96.0),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_DATE - INTERVAL '1 day', 100.0, 3, 200, 24, true, 98.0, 95.0, 96.5),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_DATE - INTERVAL '2 days', 100.0, 5, 280, 23, true, 98.0, 95.0, 97.0),

-- Gabriel Allrounder - Good consistency
('gggggggg-gggg-gggg-gggg-gggggggggggg', CURRENT_DATE, 85.0, 2, 140, 10, true, 88.0, 90.0, 87.5),
('gggggggg-gggg-gggg-gggg-gggggggggggg', CURRENT_DATE - INTERVAL '1 day', 90.0, 3, 160, 9, true, 88.0, 90.0, 88.0),
('gggggggg-gggg-gggg-gggg-gggggggggggg', CURRENT_DATE - INTERVAL '2 days', 75.0, 1, 80, 8, false, 88.0, 85.0, 86.0),

-- Ethan Helper - Consistent helper
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', CURRENT_DATE, 90.0, 2, 160, 12, true, 92.0, 88.0, 89.0),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', CURRENT_DATE - INTERVAL '1 day', 95.0, 3, 180, 11, true, 92.0, 88.0, 90.0),

-- Alex Speedster - Fast but inconsistent
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 80.0, 2, 90, 12, false, 78.0, 75.0, 76.0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE - INTERVAL '1 day', 100.0, 4, 120, 11, true, 78.0, 80.0, 78.0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE - INTERVAL '2 days', 60.0, 1, 45, 10, false, 78.0, 70.0, 72.0),

-- Bella Quality - Quality over speed
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 95.0, 2, 200, 8, true, 90.0, 95.0, 92.0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE - INTERVAL '1 day', 100.0, 3, 240, 7, true, 90.0, 95.0, 93.0),

-- Julia Innovator - Creative consistency
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', CURRENT_DATE, 88.0, 2, 190, 13, true, 85.0, 82.0, 84.0),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', CURRENT_DATE - INTERVAL '1 day', 92.0, 3, 210, 12, true, 85.0, 85.0, 86.0),

-- Isaac Optimizer - Efficient sessions
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', CURRENT_DATE, 82.0, 2, 110, 7, true, 82.0, 85.0, 83.0),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', CURRENT_DATE - INTERVAL '1 day', 90.0, 3, 135, 6, true, 82.0, 88.0, 85.0),

-- Diana Discoverer - Moderate consistency
('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE, 75.0, 1, 120, 5, false, 75.0, 78.0, 76.0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE - INTERVAL '1 day', 85.0, 2, 140, 4, true, 75.0, 80.0, 78.0),

-- Fiona Newcomer - Learning phase
('ffffffff-ffff-ffff-ffff-ffffffffffff', CURRENT_DATE, 60.0, 1, 180, 3, false, 65.0, 70.0, 68.0),
('ffffffff-ffff-ffff-ffff-ffffffffffff', CURRENT_DATE - INTERVAL '1 day', 70.0, 1, 160, 2, false, 65.0, 72.0, 70.0),
('ffffffff-ffff-ffff-ffff-ffffffffffff', CURRENT_DATE - INTERVAL '2 days', 50.0, 1, 200, 1, false, 65.0, 65.0, 66.0);

-- ============= MISSION RECORDS SAMPLE DATA =============

-- Insert mission leaderboard records
INSERT INTO public.mission_records (
    mission_id, mission_name, difficulty_level,
    fastest_time_seconds, fastest_time_holder, fastest_time_date,
    highest_quality_score, highest_quality_holder, highest_quality_date,
    highest_innovation_score, highest_innovation_holder, highest_innovation_date
) VALUES

('MISSION_01_HELLO_WORLD', 'Hello World Challenge', 'beginner',
 180, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP - INTERVAL '5 days',
 95, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '4 days',
 75, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '4 days'),

('MISSION_02_VARIABLES', 'Variables and Data Types', 'intermediate',
 380, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '3 days',
 98, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '3 days',
 98, 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', CURRENT_TIMESTAMP - INTERVAL '2 days'),

('MISSION_03_CONTROL_FLOW', 'Control Flow Mastery', 'advanced',
 680, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_TIMESTAMP - INTERVAL '2 days',
 92, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_TIMESTAMP - INTERVAL '2 days',
 100, 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', CURRENT_TIMESTAMP - INTERVAL '1 day'),

('MISSION_04_FUNCTIONS', 'Functions and Modules', 'expert',
 1200, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_TIMESTAMP - INTERVAL '1 day',
 89, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_TIMESTAMP - INTERVAL '1 day',
 85, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ============= REFRESH LEADERBOARDS WITH NEW DATA =============

-- Refresh the real-time leaderboard with all the new seed data
SELECT update_real_time_leaderboard();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Competitive Metrics Seed Data Migration 007 completed successfully!';
    RAISE NOTICE 'Inserted comprehensive test data for 10 users across all competitive metrics';
    RAISE NOTICE 'Sample data includes: Speed records, Quality metrics, Streaks, Community activity, Discoveries, and Consistency tracking';
    RAISE NOTICE 'Real-time leaderboards refreshed and ready for testing';
    RAISE NOTICE 'System now has realistic data for testing competitive features';
END $$;