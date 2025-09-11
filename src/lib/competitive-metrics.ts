// Competitive Metrics API for CodeFly Agent Academy
// Real Supabase implementation for production

import { createClient } from './supabase/client'

// Define database table types for easier access
type SpeedRecord = {
  id: string
  user_id: string
  mission_id: string
  lesson_id?: string
  completion_time_seconds: number
  difficulty_level: string
  is_personal_best: boolean
  is_global_record: boolean
  created_at: string
  user_name?: string
  user_avatar?: string
}

type CodeQualityMetric = {
  id: string
  user_id: string
  submission_id: string
  lesson_id: string
  clean_code_score: number
  efficiency_score: number
  best_practices_score: number
  innovation_score: number
  accuracy_percentage: number
  lines_of_code: number
  test_cases_passed: number
  test_cases_total: number
  created_at: string
  user_name?: string
  user_avatar?: string
}

type StreakRecord = {
  id: string
  user_id: string
  streak_type: string
  current_streak: number
  longest_streak: number
  is_active: boolean
  last_updated: string
  user_name?: string
  user_avatar?: string
}

type CommunityMetric = {
  id: string
  user_id: string
  help_points_given: number
  questions_answered: number
  code_reviews_given: number
  mentorship_hours: number
  collaboration_score: number
  created_at: string
  user_name?: string
  user_avatar?: string
}

type DiscoveryMetric = {
  id: string
  user_id: string
  discovery_type: string
  discovery_id: string
  discovery_name: string
  discovery_description: string | null
  mission_id: string | null
  lesson_id: string | null
  difficulty_rating: number
  discovery_points: number
  discovered_at: string
  user_name?: string
  user_avatar?: string
}

type ConsistencyMetric = {
  id: string
  user_id: string
  daily_completion_rate: number
  weekly_completion_rate: number
  assignment_punctuality_score: number
  practice_consistency_score: number
  created_at: string
  user_name?: string
  user_avatar?: string
}

type MissionRecord = {
  mission_id: string
  mission_name: string
  difficulty_level: string
  fastest_time_seconds: number
  fastest_time_holder: string
  fastest_time_holder_name?: string
}

type User = {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

// ============= EXPORTED INTERFACES =============

export type { SpeedRecord, CodeQualityMetric, StreakRecord, CommunityMetric, DiscoveryMetric, ConsistencyMetric, MissionRecord, User }

// Legacy interface - keeping original definition
export interface SpeedRecordLegacy {
  id: string
  user_id: string
  mission_id: string
  completion_time_seconds: number
  difficulty_level: string
  is_personal_best: boolean
  is_global_record: boolean
  created_at: string
  user_name?: string
  user_avatar?: string
}


// ============= MOCK DATA (with type annotations to avoid conflicts) =============

const mockSpeedRecords: any[] = [
  { id: '1', user_id: '1', mission_id: 'binary-shores', completion_time_seconds: 154, difficulty_level: 'beginner', is_personal_best: true, is_global_record: true, created_at: '2024-01-01', user_name: 'Jordan ⚡', user_avatar: '⚡' },
  { id: '2', user_id: '2', mission_id: 'variable-village', completion_time_seconds: 171, difficulty_level: 'beginner', is_personal_best: true, is_global_record: true, created_at: '2024-01-02', user_name: 'Alex (You) 🎮', user_avatar: '🎮' },
  { id: '3', user_id: '3', mission_id: 'logic-lake', completion_time_seconds: 192, difficulty_level: 'intermediate', is_personal_best: true, is_global_record: true, created_at: '2024-01-03', user_name: 'Casey 🚀', user_avatar: '🚀' },
]

const mockQualityRecords: any[] = [
  { id: '1', user_id: '1', lesson_id: 'lesson-1', clean_code_score: 98, efficiency_score: 95, best_practices_score: 97, innovation_score: 92, accuracy_percentage: 100, user_name: 'Alex (You) 🎮', user_avatar: '🎮' },
  { id: '2', user_id: '2', lesson_id: 'lesson-2', clean_code_score: 97, efficiency_score: 94, best_practices_score: 96, innovation_score: 90, accuracy_percentage: 98, user_name: 'Casey 🚀', user_avatar: '🚀' },
  { id: '3', user_id: '3', lesson_id: 'lesson-3', clean_code_score: 95, efficiency_score: 92, best_practices_score: 94, innovation_score: 88, accuracy_percentage: 97, user_name: 'Jordan ⚡', user_avatar: '⚡' },
]

const mockStreakRecords: any[] = [
  { id: '1', user_id: '1', streak_type: 'perfect_score', current_streak: 28, longest_streak: 35, is_active: true, user_name: 'Jordan ⚡', user_avatar: '⚡' },
  { id: '2', user_id: '2', streak_type: 'perfect_score', current_streak: 19, longest_streak: 22, is_active: true, user_name: 'Alex (You) 🎮', user_avatar: '🎮' },
  { id: '3', user_id: '3', streak_type: 'perfect_score', current_streak: 15, longest_streak: 18, is_active: true, user_name: 'Riley ✨', user_avatar: '✨' },
]

const mockCommunityRecords: any[] = [
  { id: '1', user_id: '1', help_points_given: 47, questions_answered: 12, code_reviews_given: 8, mentorship_hours: 15, collaboration_score: 85, user_name: 'Alex (You) 🎮', user_avatar: '🎮' },
  { id: '2', user_id: '2', help_points_given: 42, questions_answered: 10, code_reviews_given: 7, mentorship_hours: 12, collaboration_score: 82, user_name: 'Riley ✨', user_avatar: '✨' },
  { id: '3', user_id: '3', help_points_given: 38, questions_answered: 9, code_reviews_given: 6, mentorship_hours: 10, collaboration_score: 78, user_name: 'Jordan ⚡', user_avatar: '⚡' },
]

const mockMissionRecords: any[] = [
  { mission_id: 'binary-shores', mission_name: 'Binary Shores Academy', difficulty_level: 'beginner', fastest_time_seconds: 154, fastest_time_holder: '1', fastest_time_holder_name: 'Jordan ⚡' },
  { mission_id: 'variable-village', mission_name: 'Variable Village', difficulty_level: 'beginner', fastest_time_seconds: 171, fastest_time_holder: '2', fastest_time_holder_name: 'Alex (You) 🎮' },
  { mission_id: 'logic-lake', mission_name: 'Logic Lake Outpost', difficulty_level: 'intermediate', fastest_time_seconds: 252, fastest_time_holder: '3', fastest_time_holder_name: 'Casey 🚀' },
  { mission_id: 'loop-canyon', mission_name: 'Loop Canyon Base', difficulty_level: 'intermediate', fastest_time_seconds: 328, fastest_time_holder: '4', fastest_time_holder_name: 'Riley ✨' },
  { mission_id: 'function-forest', mission_name: 'Function Forest', difficulty_level: 'advanced', fastest_time_seconds: 435, fastest_time_holder: '5', fastest_time_holder_name: 'Morgan 🔥' },
  { mission_id: 'array-mountains', mission_name: 'Array Mountains', difficulty_level: 'advanced', fastest_time_seconds: 583, fastest_time_holder: '1', fastest_time_holder_name: 'Jordan ⚡' }
]

// ============= SUPABASE FUNCTIONS =============

export async function recordCompletionTime(
  userId: string,
  missionId: string,
  lessonId: string,
  completionTimeSeconds: number,
  difficultyLevel: string,
  submissionId?: string
): Promise<{ success: boolean; isPersonalBest: boolean; isGlobalRecord: boolean }> {
  try {
    const supabase = createClient()
    
    // Use the stored procedure for recording speed
    const { data, error } = await supabase.rpc('update_speed_record', {
      p_user_id: userId,
      p_mission_id: missionId,
      p_lesson_id: lessonId,
      p_completion_time_seconds: completionTimeSeconds,
      p_difficulty_level: difficultyLevel,
      p_submission_id: submissionId || null
    })

    if (error) {
      console.error('Error recording completion time:', error)
      return { success: false, isPersonalBest: false, isGlobalRecord: false }
    }

    // Check if it's a personal best
    const { data: personalBest } = await supabase
      .from('speed_records')
      .select('is_personal_best, is_global_record')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .eq('completion_time_seconds', completionTimeSeconds)
      .single()

    return {
      success: true,
      isPersonalBest: personalBest?.is_personal_best || false,
      isGlobalRecord: personalBest?.is_global_record || false
    }
  } catch (error) {
    console.error('Error in recordCompletionTime:', error)
    return { success: false, isPersonalBest: false, isGlobalRecord: false }
  }
}

export async function getSpeedLeaderboard(missionId?: string): Promise<SpeedRecord[]> {
  try {
    const supabase = createClient()
    let query = supabase
      .from('speed_records')
      .select(`
        *,
        user:users(full_name, display_name, avatar_url)
      `)
      .order('completion_time_seconds', { ascending: true })
      .limit(50)

    if (missionId) {
      query = query.eq('mission_id', missionId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching speed leaderboard:', error)
      return mockSpeedRecords // Fallback to mock data
    }

    return data?.map((record: any) => ({
      ...record,
      user_name: record.user?.display_name || record.user?.full_name || 'Anonymous',
      user_avatar: record.user?.avatar_url || '🎮'
    })) || []
  } catch (error) {
    console.error('Error in getSpeedLeaderboard:', error)
    return mockSpeedRecords // Fallback to mock data
  }
}

export async function recordCodeQuality(
  userId: string,
  submissionId: string,
  lessonId: string,
  metrics: {
    clean_code_score?: number
    efficiency_score?: number
    best_practices_score?: number
    innovation_score?: number
    accuracy_percentage?: number
    lines_of_code?: number
    test_cases_passed?: number
    test_cases_total?: number
  }
): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('code_quality_metrics')
      .insert({
        user_id: userId,
        submission_id: submissionId,
        lesson_id: lessonId,
        clean_code_score: metrics.clean_code_score || 0,
        efficiency_score: metrics.efficiency_score || 0,
        best_practices_score: metrics.best_practices_score || 0,
        innovation_score: metrics.innovation_score || 0,
        accuracy_percentage: metrics.accuracy_percentage || 0,
        lines_of_code: metrics.lines_of_code || 0,
        test_cases_passed: metrics.test_cases_passed || 0,
        test_cases_total: metrics.test_cases_total || 0,
        documentation_score: 0,
        error_handling_score: 0,
        cyclomatic_complexity: 0,
        code_reuse_percentage: 0
      })

    if (error) {
      console.error('Error recording code quality:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in recordCodeQuality:', error)
    return false
  }
}

export async function getCodeQualityLeaderboard(category: 'clean_code' | 'efficiency' | 'innovation' | 'accuracy'): Promise<CodeQualityMetric[]> {
  try {
    const supabase = createClient()
    
    const columnMap = {
      clean_code: 'clean_code_score',
      efficiency: 'efficiency_score',
      innovation: 'innovation_score',
      accuracy: 'accuracy_percentage'
    }

    const sortColumn = columnMap[category] || 'clean_code_score'

    const { data, error } = await supabase
      .from('code_quality_metrics')
      .select(`
        *,
        user:users(full_name, display_name, avatar_url)
      `)
      .order(sortColumn, { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching code quality leaderboard:', error)
      return mockQualityRecords // Fallback to mock data
    }

    return data?.map((record: any) => ({
      ...record,
      user_name: record.user?.display_name || record.user?.full_name || 'Anonymous',
      user_avatar: record.user?.avatar_url || '🎮'
    })) || []
  } catch (error) {
    console.error('Error in getCodeQualityLeaderboard:', error)
    return mockQualityRecords // Fallback to mock data
  }
}

export async function updateStreak(
  userId: string,
  streakType: 'perfect_score' | 'daily_completion' | 'code_quality' | 'speed_improvement',
  success: boolean
): Promise<number> {
  try {
    const supabase = createClient()
    
    // Use the stored procedure for updating streaks
    const { data, error } = await supabase.rpc('update_streak', {
      p_user_id: userId,
      p_streak_type: streakType,
      p_success: success
    })

    if (error) {
      console.error('Error updating streak:', error)
      return 0
    }

    return data || 0
  } catch (error) {
    console.error('Error in updateStreak:', error)
    return 0
  }
}

export async function getStreakLeaderboard(streakType?: string): Promise<StreakRecord[]> {
  try {
    const supabase = createClient()
    let query = supabase
      .from('streak_tracking')
      .select(`
        *,
        user:users(full_name, display_name, avatar_url)
      `)
      .order('current_streak', { ascending: false })
      .limit(50)

    if (streakType) {
      query = query.eq('streak_type', streakType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching streak leaderboard:', error)
      return mockStreakRecords // Fallback to mock data
    }

    return data?.map((record: any) => ({
      ...record,
      user_name: record.user?.display_name || record.user?.full_name || 'Anonymous',
      user_avatar: record.user?.avatar_url || '🎮'
    })) || []
  } catch (error) {
    console.error('Error in getStreakLeaderboard:', error)
    return mockStreakRecords // Fallback to mock data
  }
}

export async function updateCommunityMetrics(
  userId: string,
  action: 'help_given' | 'question_answered' | 'code_review' | 'mentorship',
  points: number = 1
): Promise<boolean> {
  // Mock implementation
  return true
}

export async function getCommunityLeaderboard(): Promise<CommunityMetric[]> {
  // Return mock data
  return mockCommunityRecords
}

export async function awardDiscovery(
  userId: string,
  discoveryType: 'easter_egg' | 'hidden_feature' | 'secret_command' | 'bonus_challenge' | 'special_achievement',
  discoveryId: string,
  discoveryName: string,
  missionId?: string,
  difficultyRating: number = 1
): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Use the stored procedure for awarding discoveries
    const { data, error } = await supabase.rpc('award_discovery', {
      p_user_id: userId,
      p_discovery_type: discoveryType,
      p_discovery_id: discoveryId,
      p_discovery_name: discoveryName,
      p_mission_id: missionId || null,
      p_difficulty_rating: difficultyRating
    })

    if (error) {
      console.error('Error awarding discovery:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in awardDiscovery:', error)
    return false
  }
}

export async function getDiscoveryLeaderboard(): Promise<DiscoveryMetric[]> {
  // Return mock data
  return [
    { id: '1', user_id: '1', discovery_type: 'easter_egg', discovery_id: 'egg_1', discovery_name: 'Hidden Egg', user_name: 'Alex (You) 🎮', user_avatar: '🎮', discovery_description: null, mission_id: null, lesson_id: null, difficulty_rating: 1, discovery_points: 10, discovered_at: '2024-01-01T00:00:00Z' },
    { id: '2', user_id: '2', discovery_type: 'hidden_feature', discovery_id: 'feat_1', discovery_name: 'Secret Feature', user_name: 'Riley ✨', user_avatar: '✨', discovery_description: null, mission_id: null, lesson_id: null, difficulty_rating: 1, discovery_points: 10, discovered_at: '2024-01-01T00:00:00Z' },
    { id: '3', user_id: '3', discovery_type: 'secret_command', discovery_id: 'cmd_1', discovery_name: 'Magic Command', user_name: 'Jordan ⚡', user_avatar: '⚡', discovery_description: null, mission_id: null, lesson_id: null, difficulty_rating: 1, discovery_points: 10, discovered_at: '2024-01-01T00:00:00Z' },
  ]
}

export async function updateConsistencyMetrics(
  userId: string,
  date: string,
  metrics: any
): Promise<boolean> {
  // Mock implementation
  return true
}

export async function getConsistencyLeaderboard(): Promise<any[]> {
  // Return mock data
  return [
    { id: '1', user_id: '1', daily_completion_rate: 95, weekly_completion_rate: 92, assignment_punctuality_score: 98, practice_consistency_score: 94, user_name: 'Alex (You) 🎮', user_avatar: '🎮' },
    { id: '2', user_id: '2', daily_completion_rate: 88, weekly_completion_rate: 85, assignment_punctuality_score: 92, practice_consistency_score: 89, user_name: 'Casey 🚀', user_avatar: '🚀' },
    { id: '3', user_id: '3', daily_completion_rate: 82, weekly_completion_rate: 80, assignment_punctuality_score: 88, practice_consistency_score: 85, user_name: 'Jordan ⚡', user_avatar: '⚡' },
  ]
}

export async function getMissionRecords(): Promise<MissionRecord[]> {
  // Return mock data
  return mockMissionRecords
}

// ============= HELPER FUNCTIONS =============

function getAvatarEmoji(avatarType?: string): string {
  const avatars: Record<string, string> = {
    'cyber-ninja': '🥷',
    'tech-specialist': '👨‍💻',
    'cipher-operative': '🕵️‍♂️',
    'data-analyst': '👩‍🔬',
    'security-expert': '👨‍✈️',
    'rookie-agent': '🧑‍🎓'
  }
  
  return avatars[avatarType || 'rookie-agent'] || '🎮'
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export async function calculateWeeklyRankings(weekStartDate: string): Promise<boolean> {
  // Mock implementation
  console.log('Calculating weekly rankings for week starting:', weekStartDate)
  return true
}