-- ============================================
-- COMPETITIVE METRICS SCHEMA VALIDATION SCRIPT
-- Tests all components for production readiness
-- ============================================

-- This script validates:
-- 1. Table structure and constraints
-- 2. Index performance 
-- 3. Function execution
-- 4. View accessibility
-- 5. Security policies
-- 6. Data integrity

-- ============= VALIDATION FUNCTIONS =============

-- Function to validate table structure
CREATE OR REPLACE FUNCTION validate_competitive_tables()
RETURNS TABLE (
    table_name TEXT,
    exists BOOLEAN,
    row_count BIGINT,
    has_indexes BOOLEAN,
    status TEXT
) AS $$
DECLARE
    tables_to_check TEXT[] := ARRAY[
        'speed_records',
        'code_quality_metrics', 
        'streak_tracking',
        'community_metrics',
        'discovery_metrics',
        'consistency_metrics',
        'mission_records'
    ];
    table_name_var TEXT;
    table_exists BOOLEAN;
    table_row_count BIGINT;
    table_has_indexes BOOLEAN;
BEGIN
    FOREACH table_name_var IN ARRAY tables_to_check
    LOOP
        -- Check if table exists
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = table_name_var
        ) INTO table_exists;
        
        -- Get row count if table exists
        IF table_exists THEN
            EXECUTE format('SELECT COUNT(*) FROM public.%I', table_name_var) INTO table_row_count;
            
            -- Check if table has indexes
            SELECT EXISTS (
                SELECT 1 FROM pg_indexes 
                WHERE schemaname = 'public' AND tablename = table_name_var
            ) INTO table_has_indexes;
        ELSE
            table_row_count := 0;
            table_has_indexes := FALSE;
        END IF;
        
        RETURN QUERY SELECT 
            table_name_var,
            table_exists,
            table_row_count,
            table_has_indexes,
            CASE 
                WHEN table_exists AND table_has_indexes THEN 'READY'
                WHEN table_exists THEN 'MISSING_INDEXES'
                ELSE 'MISSING_TABLE'
            END as status;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to test stored procedures
CREATE OR REPLACE FUNCTION test_competitive_functions()
RETURNS TABLE (
    function_name TEXT,
    test_case TEXT,
    success BOOLEAN,
    result TEXT,
    execution_time_ms NUMERIC
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    test_user_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    test_result TEXT;
    function_success BOOLEAN;
BEGIN
    -- Test update_speed_record function
    start_time := clock_timestamp();
    BEGIN
        SELECT update_speed_record(
            test_user_id,
            'TEST_MISSION',
            'test_lesson',
            300,
            'intermediate',
            gen_random_uuid()
        ) INTO function_success;
        test_result := 'Function executed successfully';
    EXCEPTION WHEN OTHERS THEN
        function_success := FALSE;
        test_result := SQLERRM;
    END;
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
        'update_speed_record'::TEXT,
        'Basic speed record insertion'::TEXT,
        function_success,
        test_result,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    -- Test update_streak_with_bonus function
    start_time := clock_timestamp();
    BEGIN
        SELECT update_streak_with_bonus(
            test_user_id,
            'daily_completion',
            TRUE,
            1.5
        )::TEXT INTO test_result;
        function_success := TRUE;
    EXCEPTION WHEN OTHERS THEN
        function_success := FALSE;
        test_result := SQLERRM;
    END;
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
        'update_streak_with_bonus'::TEXT,
        'Streak update with bonus'::TEXT,
        function_success,
        test_result,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    -- Test calculate_overall_ranking function
    start_time := clock_timestamp();
    BEGIN
        PERFORM calculate_overall_ranking(7);
        function_success := TRUE;
        test_result := 'Ranking calculation completed';
    EXCEPTION WHEN OTHERS THEN
        function_success := FALSE;
        test_result := SQLERRM;
    END;
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
        'calculate_overall_ranking'::TEXT,
        'Overall ranking calculation'::TEXT,
        function_success,
        test_result,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    -- Test get_mission_analytics function  
    start_time := clock_timestamp();
    BEGIN
        PERFORM get_mission_analytics('MISSION_01_HELLO_WORLD');
        function_success := TRUE;
        test_result := 'Mission analytics generated';
    EXCEPTION WHEN OTHERS THEN
        function_success := FALSE;
        test_result := SQLERRM;
    END;
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
        'get_mission_analytics'::TEXT,
        'Mission analytics generation'::TEXT,
        function_success,
        test_result,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
        
    -- Test award_discovery function
    start_time := clock_timestamp();
    BEGIN
        SELECT award_discovery(
            test_user_id,
            'easter_egg',
            'TEST_DISCOVERY',
            'Test Discovery',
            'TEST_MISSION',
            3
        ) INTO function_success;
        test_result := 'Discovery awarded successfully';
    EXCEPTION WHEN OTHERS THEN
        function_success := FALSE;
        test_result := SQLERRM;
    END;
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
        'award_discovery'::TEXT,
        'Discovery award process'::TEXT,
        function_success,
        test_result,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
END;
$$ LANGUAGE plpgsql;

-- Function to test views and performance
CREATE OR REPLACE FUNCTION test_competitive_views()
RETURNS TABLE (
    view_name TEXT,
    record_count BIGINT,
    avg_execution_time_ms NUMERIC,
    status TEXT
) AS $$
DECLARE
    views_to_test TEXT[] := ARRAY[
        'speed_leaderboard',
        'code_quality_rankings',
        'streak_champions',
        'community_leaderboard',
        'discovery_explorer_rankings'
    ];
    view_name_var TEXT;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    total_time NUMERIC := 0;
    view_count BIGINT;
    iterations INTEGER := 3;
    i INTEGER;
BEGIN
    FOREACH view_name_var IN ARRAY views_to_test
    LOOP
        total_time := 0;
        
        -- Run multiple iterations to get average time
        FOR i IN 1..iterations LOOP
            start_time := clock_timestamp();
            EXECUTE format('SELECT COUNT(*) FROM public.%I', view_name_var) INTO view_count;
            end_time := clock_timestamp();
            total_time := total_time + EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
        END LOOP;
        
        RETURN QUERY SELECT 
            view_name_var,
            view_count,
            total_time / iterations,
            CASE 
                WHEN view_count > 0 AND (total_time / iterations) < 1000 THEN 'OPTIMAL'
                WHEN view_count > 0 AND (total_time / iterations) < 5000 THEN 'ACCEPTABLE'
                WHEN view_count > 0 THEN 'SLOW'
                ELSE 'NO_DATA'
            END as status;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to validate indexes
CREATE OR REPLACE FUNCTION validate_competitive_indexes()
RETURNS TABLE (
    table_name TEXT,
    index_name TEXT,
    index_type TEXT,
    is_unique BOOLEAN,
    columns TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename::TEXT,
        t.indexname::TEXT,
        am.amname::TEXT as index_type,
        i.indisunique,
        ARRAY(
            SELECT a.attname
            FROM pg_attribute a
            WHERE a.attrelid = i.indrelid
            AND a.attnum = ANY(i.indkey)
            ORDER BY a.attnum
        ) as columns
    FROM pg_indexes t
    JOIN pg_class c ON c.relname = t.indexname
    JOIN pg_index i ON i.indexrelid = c.oid
    JOIN pg_am am ON am.oid = c.relam
    WHERE t.schemaname = 'public'
    AND t.tablename IN (
        'speed_records', 'code_quality_metrics', 'streak_tracking',
        'community_metrics', 'discovery_metrics', 'consistency_metrics',
        'mission_records'
    )
    ORDER BY t.tablename, t.indexname;
END;
$$ LANGUAGE plpgsql;

-- Function to test Row Level Security
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE (
    table_name TEXT,
    policy_count INTEGER,
    rls_enabled BOOLEAN,
    status TEXT
) AS $$
DECLARE
    competitive_tables TEXT[] := ARRAY[
        'speed_records',
        'code_quality_metrics', 
        'streak_tracking',
        'community_metrics',
        'discovery_metrics',
        'consistency_metrics',
        'mission_records'
    ];
    table_name_var TEXT;
    policy_count_var INTEGER;
    rls_enabled_var BOOLEAN;
BEGIN
    FOREACH table_name_var IN ARRAY competitive_tables
    LOOP
        -- Count policies for this table
        SELECT COUNT(*)
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = table_name_var
        INTO policy_count_var;
        
        -- Check if RLS is enabled
        SELECT c.relrowsecurity
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = table_name_var
        INTO rls_enabled_var;
        
        RETURN QUERY SELECT 
            table_name_var,
            policy_count_var,
            COALESCE(rls_enabled_var, FALSE),
            CASE 
                WHEN COALESCE(rls_enabled_var, FALSE) AND policy_count_var > 0 THEN 'SECURED'
                WHEN COALESCE(rls_enabled_var, FALSE) THEN 'RLS_ENABLED_NO_POLICIES'
                WHEN policy_count_var > 0 THEN 'POLICIES_WITHOUT_RLS'
                ELSE 'NOT_SECURED'
            END as status;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============= RUN ALL VALIDATIONS =============

-- Display validation results
DO $$
DECLARE
    validation_time TIMESTAMP := CURRENT_TIMESTAMP;
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'COMPETITIVE METRICS SCHEMA VALIDATION REPORT';
    RAISE NOTICE 'Validation Time: %', validation_time;
    RAISE NOTICE '================================================';
END $$;

-- Table structure validation
SELECT 
    '=== TABLE STRUCTURE VALIDATION ===' as section,
    '' as table_name,
    NULL as exists,
    NULL as row_count,
    NULL as has_indexes,
    '' as status
UNION ALL
SELECT 
    '',
    table_name,
    exists,
    row_count,
    has_indexes,
    status
FROM validate_competitive_tables()
ORDER BY 
    CASE WHEN section = '' THEN 1 ELSE 0 END,
    table_name;

-- Function testing
SELECT 
    '=== STORED FUNCTION TESTING ===' as section,
    '' as function_name,
    '' as test_case,
    NULL as success,
    '' as result,
    NULL as execution_time_ms
UNION ALL
SELECT 
    '',
    function_name,
    test_case,
    success,
    result,
    execution_time_ms
FROM test_competitive_functions()
ORDER BY 
    CASE WHEN section = '' THEN 1 ELSE 0 END,
    function_name;

-- View performance testing
SELECT 
    '=== VIEW PERFORMANCE TESTING ===' as section,
    '' as view_name,
    NULL as record_count,
    NULL as avg_execution_time_ms,
    '' as status
UNION ALL
SELECT 
    '',
    view_name,
    record_count,
    avg_execution_time_ms,
    status
FROM test_competitive_views()
ORDER BY 
    CASE WHEN section = '' THEN 1 ELSE 0 END,
    view_name;

-- Index validation
SELECT 
    '=== INDEX VALIDATION ===' as section,
    '' as table_name,
    '' as index_name,
    '' as index_type,
    NULL as is_unique,
    ARRAY[]::TEXT[] as columns
UNION ALL
SELECT 
    '',
    table_name,
    index_name,
    index_type,
    is_unique,
    columns
FROM validate_competitive_indexes()
ORDER BY 
    CASE WHEN section = '' THEN 1 ELSE 0 END,
    table_name, index_name;

-- RLS policy validation
SELECT 
    '=== ROW LEVEL SECURITY VALIDATION ===' as section,
    '' as table_name,
    NULL as policy_count,
    NULL as rls_enabled,
    '' as status
UNION ALL
SELECT 
    '',
    table_name,
    policy_count,
    rls_enabled,
    status
FROM test_rls_policies()
ORDER BY 
    CASE WHEN section = '' THEN 1 ELSE 0 END,
    table_name;

-- Final validation summary
DO $$
DECLARE
    total_tables INTEGER;
    ready_tables INTEGER;
    total_functions INTEGER;
    working_functions INTEGER;
    total_views INTEGER;
    optimal_views INTEGER;
    secured_tables INTEGER;
BEGIN
    SELECT COUNT(*) FROM validate_competitive_tables() INTO total_tables;
    SELECT COUNT(*) FROM validate_competitive_tables() WHERE status = 'READY' INTO ready_tables;
    
    SELECT COUNT(*) FROM test_competitive_functions() INTO total_functions;
    SELECT COUNT(*) FROM test_competitive_functions() WHERE success = TRUE INTO working_functions;
    
    SELECT COUNT(*) FROM test_competitive_views() INTO total_views;
    SELECT COUNT(*) FROM test_competitive_views() WHERE status = 'OPTIMAL' INTO optimal_views;
    
    SELECT COUNT(*) FROM test_rls_policies() WHERE status = 'SECURED' INTO secured_tables;
    
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'VALIDATION SUMMARY';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Tables: %/% ready (%.1f%%)', ready_tables, total_tables, 
        (ready_tables::NUMERIC / NULLIF(total_tables, 0) * 100);
    RAISE NOTICE 'Functions: %/% working (%.1f%%)', working_functions, total_functions,
        (working_functions::NUMERIC / NULLIF(total_functions, 0) * 100);
    RAISE NOTICE 'Views: %/% optimal performance (%.1f%%)', optimal_views, total_views,
        (optimal_views::NUMERIC / NULLIF(total_views, 0) * 100);
    RAISE NOTICE 'Security: %/% tables properly secured (%.1f%%)', secured_tables, total_tables,
        (secured_tables::NUMERIC / NULLIF(total_tables, 0) * 100);
    RAISE NOTICE '';
    
    IF ready_tables = total_tables AND working_functions = total_functions AND secured_tables = total_tables THEN
        RAISE NOTICE '✅ SCHEMA IS PRODUCTION READY!';
        RAISE NOTICE 'All competitive metrics components are functional and secure.';
    ELSE
        RAISE NOTICE '⚠️  SCHEMA REQUIRES ATTENTION';
        RAISE NOTICE 'Some components may need fixes before production deployment.';
    END IF;
    
    RAISE NOTICE '================================================';
END $$;

-- Clean up test data created during validation
DELETE FROM public.speed_records WHERE mission_id = 'TEST_MISSION';
DELETE FROM public.discovery_metrics WHERE discovery_id = 'TEST_DISCOVERY';