# Competitive Metrics Database Schema

## Overview

The competitive metrics system provides comprehensive ranking and gamification features for the CodeFly Agent Academy. This documentation covers the complete database schema, functions, views, and usage patterns.

## Database Schema Architecture

### Core Tables

#### 1. Speed Records (`speed_records`)
Tracks completion times and speed-based achievements.

```sql
CREATE TABLE public.speed_records (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    mission_id VARCHAR(100),
    lesson_id VARCHAR(100),
    completion_time_seconds INTEGER,
    difficulty_level VARCHAR(20),
    is_personal_best BOOLEAN,
    is_global_record BOOLEAN,
    code_submission_id UUID,
    created_at TIMESTAMPTZ
);
```

**Key Features:**
- Personal best tracking per mission/user
- Global record identification
- Difficulty-based categorization
- Integration with code submissions

#### 2. Code Quality Metrics (`code_quality_metrics`)
Comprehensive code quality scoring system.

```sql
CREATE TABLE public.code_quality_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    submission_id UUID,
    lesson_id VARCHAR(100),
    clean_code_score INTEGER,      -- 0-100
    efficiency_score INTEGER,      -- 0-100
    best_practices_score INTEGER,  -- 0-100
    documentation_score INTEGER,   -- 0-100
    error_handling_score INTEGER,  -- 0-100
    innovation_score INTEGER,      -- 0-100
    lines_of_code INTEGER,
    cyclomatic_complexity INTEGER,
    accuracy_percentage DECIMAL(5,2),
    test_cases_passed INTEGER,
    test_cases_total INTEGER,
    created_at TIMESTAMPTZ
);
```

**Scoring Categories:**
- **Clean Code**: Readability, naming conventions, structure
- **Efficiency**: Algorithm optimization, performance
- **Best Practices**: Language idioms, design patterns
- **Documentation**: Comments, docstrings, clarity
- **Error Handling**: Exception management, validation
- **Innovation**: Creative solutions, novel approaches

#### 3. Streak Tracking (`streak_tracking`)
Monitors consistency and achievement streaks.

```sql
CREATE TABLE public.streak_tracking (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    streak_type VARCHAR(50),  -- perfect_score, daily_completion, etc.
    current_streak INTEGER,
    longest_streak INTEGER,
    last_activity_date DATE,
    streak_start_date DATE,
    is_active BOOLEAN,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

**Streak Types:**
- `perfect_score`: Consecutive 100% scores
- `daily_completion`: Consecutive days with completions
- `code_quality`: Consecutive high-quality submissions
- `speed_improvement`: Consecutive personal best improvements

#### 4. Community Metrics (`community_metrics`)
Tracks collaboration and peer interaction.

```sql
CREATE TABLE public.community_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    help_points_given INTEGER,
    help_points_received INTEGER,
    questions_answered INTEGER,
    code_reviews_given INTEGER,
    code_reviews_received INTEGER,
    mentorship_hours DECIMAL(8,2),
    collaboration_score INTEGER,
    weekly_help_points INTEGER,
    weekly_collaboration_score INTEGER,
    last_help_given TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

#### 5. Discovery Metrics (`discovery_metrics`)
Tracks exploration and hidden feature discoveries.

```sql
CREATE TABLE public.discovery_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    discovery_type VARCHAR(50),  -- easter_egg, hidden_feature, etc.
    discovery_id VARCHAR(100),
    discovery_name VARCHAR(255),
    discovery_description TEXT,
    mission_id VARCHAR(100),
    lesson_id VARCHAR(100),
    difficulty_rating INTEGER,   -- 1-5
    discovery_points INTEGER,
    discovered_at TIMESTAMPTZ
);
```

**Discovery Types:**
- `easter_egg`: Hidden UI elements or commands
- `hidden_feature`: Unlockable functionality
- `secret_command`: Special keyboard shortcuts or commands
- `bonus_challenge`: Optional advanced problems
- `special_achievement`: Unique accomplishments

#### 6. Consistency Metrics (`consistency_metrics`)
Daily activity and habit tracking.

```sql
CREATE TABLE public.consistency_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    metric_date DATE,
    daily_completion_rate DECIMAL(5,2),
    lessons_completed_today INTEGER,
    time_spent_minutes INTEGER,
    login_streak_days INTEGER,
    weekly_goals_met BOOLEAN,
    weekly_completion_rate DECIMAL(5,2),
    assignment_punctuality_score DECIMAL(5,2),
    practice_consistency_score DECIMAL(5,2),
    created_at TIMESTAMPTZ
);
```

#### 7. Mission Records (`mission_records`)
Global leaderboards for each mission.

```sql
CREATE TABLE public.mission_records (
    id UUID PRIMARY KEY,
    mission_id VARCHAR(100) UNIQUE,
    mission_name VARCHAR(255),
    difficulty_level VARCHAR(20),
    fastest_time_seconds INTEGER,
    fastest_time_holder UUID REFERENCES users(id),
    fastest_time_date TIMESTAMPTZ,
    highest_quality_score INTEGER,
    highest_quality_holder UUID REFERENCES users(id),
    highest_quality_date TIMESTAMPTZ,
    highest_innovation_score INTEGER,
    highest_innovation_holder UUID REFERENCES users(id),
    highest_innovation_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

## Advanced Features

### Real-Time Analytics Views

#### Speed Leaderboard
```sql
CREATE VIEW speed_leaderboard AS
SELECT 
    sr.user_id,
    u.full_name,
    sr.mission_id,
    sr.completion_time_seconds as best_time,
    ROW_NUMBER() OVER (PARTITION BY sr.mission_id ORDER BY sr.completion_time_seconds) as rank
FROM speed_records sr
JOIN users u ON sr.user_id = u.id
WHERE sr.is_personal_best = TRUE;
```

#### Overall Rankings
Multi-factor ranking system combining all metrics:

```sql
SELECT * FROM calculate_overall_ranking(30);  -- 30-day window
```

**Scoring Weights:**
- Speed Score: 25%
- Quality Score: 30%
- Consistency Score: 20%
- Community Score: 15%
- Discovery Score: 10%

### Stored Procedures

#### Update Speed Record
```sql
SELECT update_speed_record(
    user_id,
    'MISSION_01_HELLO_WORLD',
    'lesson_1_1',
    180,  -- completion time in seconds
    'beginner',
    submission_id
);
```

#### Enhanced Streak Update
```sql
SELECT update_streak_with_bonus(
    user_id,
    'daily_completion',
    true,    -- success
    1.5      -- bonus multiplier
);
```

#### Award Discovery
```sql
SELECT award_discovery(
    user_id,
    'easter_egg',
    'KONAMI_CODE',
    'Konami Code Master',
    'MISSION_01_HELLO_WORLD',
    3  -- difficulty rating
);
```

### Performance Optimizations

#### Key Indexes
- **Speed Records**: `(mission_id, completion_time_seconds)` for leaderboards
- **Quality Metrics**: `(lesson_id, total_score DESC)` for rankings
- **Streaks**: `(streak_type, current_streak DESC)` for champions
- **Community**: `(collaboration_score DESC)` for leaderboards
- **Discoveries**: `(user_id, discovery_points DESC)` for explorer rankings

#### Materialized Views
Real-time leaderboard with automatic refresh:
```sql
CREATE MATERIALIZED VIEW live_leaderboard AS
SELECT * FROM calculate_overall_ranking(7);

-- Refresh triggers on data changes
SELECT update_real_time_leaderboard();
```

## Security & Access Control

### Row Level Security (RLS)
All competitive tables use RLS policies:

```sql
-- Users can view all speed records (public leaderboards)
CREATE POLICY "Users can view all speed records" 
    ON speed_records FOR SELECT USING (true);

-- Users can only insert their own records
CREATE POLICY "Users can insert own speed records" 
    ON speed_records FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Role-Based Access
- **Students**: Can view own metrics + public leaderboards
- **Teachers**: Can view all student metrics for their classes
- **Admins**: Full access to all competitive data

## Usage Examples

### Frontend Integration

#### Fetch User Dashboard Data
```sql
-- Get user's current standings
SELECT 
    (SELECT rank FROM speed_leaderboard WHERE user_id = $1 LIMIT 1) as speed_rank,
    (SELECT overall_rank FROM live_leaderboard WHERE user_id = $1) as overall_rank,
    (SELECT current_streak FROM streak_tracking WHERE user_id = $1 AND streak_type = 'daily_completion') as daily_streak;
```

#### Mission Leaderboard
```sql
-- Top 10 performers for a mission
SELECT user_name, best_time, rank 
FROM speed_leaderboard 
WHERE mission_id = 'MISSION_01_HELLO_WORLD' 
ORDER BY rank 
LIMIT 10;
```

#### Discovery Explorer Rankings
```sql
SELECT 
    user_name,
    total_discoveries,
    total_discovery_points,
    discovery_rank
FROM discovery_explorer_rankings
ORDER BY discovery_rank
LIMIT 20;
```

### Real-Time Updates

#### When User Completes Lesson
```sql
BEGIN;
-- Update speed record
SELECT update_speed_record($1, $2, $3, $4, $5, $6);

-- Update streak
SELECT update_streak_with_bonus($1, 'daily_completion', true, 1.0);

-- Update consistency metrics
INSERT INTO consistency_metrics (user_id, metric_date, lessons_completed_today)
VALUES ($1, CURRENT_DATE, 1)
ON CONFLICT (user_id, metric_date) DO UPDATE SET
    lessons_completed_today = consistency_metrics.lessons_completed_today + 1;

COMMIT;
```

## Migration Files

### Migration 004: Base Competitive Metrics
- Core table structure
- Basic indexes and constraints
- Essential stored procedures
- RLS policies

### Migration 006: Performance Enhancements
- Advanced indexes for optimal query performance
- Analytics views for real-time leaderboards
- Enhanced stored procedures with bonus calculations
- Materialized views with automatic refresh

### Migration 007: Comprehensive Seed Data
- 10 realistic test users with varying skill levels
- Speed records across multiple missions
- Quality metrics showing different user strengths
- Active streaks and community activity
- Discovery achievements and consistency data

## Validation & Testing

Run comprehensive schema validation:
```bash
psql -f scripts/validate_competitive_schema.sql
```

The validation script tests:
- ✅ Table structure and constraints
- ✅ Index performance
- ✅ Function execution
- ✅ View accessibility  
- ✅ Security policies
- ✅ Data integrity

## Performance Benchmarks

### Expected Query Performance
- **Leaderboard queries**: < 50ms for 1000 users
- **User dashboard**: < 100ms for complete metrics
- **Mission analytics**: < 200ms for detailed stats
- **Ranking calculations**: < 500ms for 30-day window

### Scaling Considerations
- Partitioning for `consistency_metrics` by date
- Archiving old `speed_records` after 1 year
- Periodic maintenance of materialized views
- Index monitoring for query optimization

## API Integration

### Recommended API Endpoints
```typescript
// Get user competitive dashboard
GET /api/competitive/dashboard/:userId

// Get mission leaderboard
GET /api/competitive/leaderboard/mission/:missionId

// Get overall rankings
GET /api/competitive/rankings?timeframe=7d&limit=50

// Award discovery
POST /api/competitive/discovery
{
  "discoveryType": "easter_egg",
  "discoveryId": "KONAMI_CODE",
  "missionId": "MISSION_01_HELLO_WORLD"
}

// Update completion metrics
POST /api/competitive/completion
{
  "missionId": "MISSION_01_HELLO_WORLD",
  "lessonId": "lesson_1_1", 
  "completionTime": 180,
  "qualityScores": { ... }
}
```

## Monitoring & Analytics

### Key Metrics to Track
- Daily active competitors
- Average completion times by mission
- Quality score distributions
- Streak completion rates
- Discovery rate by difficulty
- Community participation levels

### Performance Monitoring
```sql
-- Monitor leaderboard refresh performance
SELECT * FROM leaderboard_performance_log 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY execution_time_ms DESC;
```

## Future Enhancements

### Planned Features
- **Team Competitions**: Cross-team leaderboards and challenges
- **Seasonal Events**: Time-limited competitive events
- **Achievement Chains**: Multi-step achievement progressions
- **Skill Trees**: Branching competency tracking
- **Peer Challenges**: Direct user-to-user competitions

### Scalability Improvements
- Event-driven architecture for real-time updates
- Redis caching for frequently accessed leaderboards
- GraphQL subscriptions for live ranking updates
- Machine learning for personalized challenges

---

**Production Readiness Status: ✅ READY**

The competitive metrics system is fully implemented with comprehensive testing, security policies, and performance optimizations. All components are validated and ready for production deployment.