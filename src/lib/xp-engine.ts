// XP Engine - Core gamification system for CodeFly Education Platform
// Based on DropFly Education MVP specifications

import { createClient } from '@/lib/supabase'

export interface XPEvent {
  id: string
  user_id: string
  assignment_id: string
  event_type: 'assignment' | 'quiz' | 'test' | 'homework' | 'collaboration' | 'practice' | 'bonus'
  source_type: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE'
  xp_amount: number
  base_xp: number
  rubric_multiplier: number
  evidence_metadata: Record<string, any>
  week: number
  created_at: string
}

export interface XPCap {
  week: number
  cap_type: 'weekly_total' | 'assignment_type' | 'daily_limit'
  source_type?: string
  max_xp: number
  current_xp: number
}

export interface BadgeDefinition {
  id: string
  badge_key: string
  name: string
  description: string
  emoji: string
  category: 'completion' | 'skill' | 'collaboration' | 'streak' | 'special'
  xp_reward: number
  unlock_criteria: Record<string, any>
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

export interface StudentBadge {
  id: string
  user_id: string
  badge_id: string
  evidence_metadata: Record<string, any>
  unlocked_at: string
  week_unlocked: number
}

class XPEngine {
  private supabase = createClient()

  // ==========================================
  // XP CALCULATION & AWARDING
  // ==========================================

  /**
   * Calculate XP for assignment completion based on rubric performance
   */
  calculateAssignmentXP(
    baseXP: number,
    rubricScores: Record<string, number>, // rubric criteria scores 0-4
    assignmentType: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE',
    teamSize?: number
  ): { xp_amount: number; rubric_multiplier: number } {
    // Calculate average rubric performance (0-4 scale)
    const scores = Object.values(rubricScores)
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    
    // Convert to multiplier (0.5x for poor, 1.0x for meets, 1.5x for exceeds)
    const rubricMultiplier = Math.max(0.5, avgScore / 2.5)
    
    // Team XP split
    let xpAmount = Math.round(baseXP * rubricMultiplier)
    if (assignmentType === 'TEAM' && teamSize) {
      xpAmount = Math.round(xpAmount / teamSize)
    }
    
    return { xp_amount: xpAmount, rubric_multiplier: rubricMultiplier }
  }

  /**
   * Award XP to student with cap checking
   */
  async awardXP(
    userId: string,
    assignmentId: string,
    eventType: XPEvent['event_type'],
    sourceType: XPEvent['source_type'],
    baseXP: number,
    rubricScores: Record<string, any>,
    week: number,
    evidenceMetadata: Record<string, any> = {},
    teamSize?: number
  ): Promise<{ success: boolean; xp_awarded: number; cap_hit?: boolean }> {
    try {
      const { xp_amount, rubric_multiplier } = this.calculateAssignmentXP(
        baseXP, 
        rubricScores, 
        sourceType, 
        teamSize
      )

      // Check XP caps
      const capCheck = await this.checkXPCaps(userId, week, sourceType, xp_amount)
      if (!capCheck.allowed) {
        return { success: false, xp_awarded: 0, cap_hit: true }
      }

      // Record XP event
      const { data: xpEvent, error } = await this.supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          assignment_id: assignmentId,
          event_type: eventType,
          source_type: sourceType,
          xp_amount,
          base_xp: baseXP,
          rubric_multiplier,
          evidence_metadata: evidenceMetadata,
          week
        })
        .select()
        .single()

      if (error) throw error

      // Update XP caps
      await this.updateXPCaps(userId, week, sourceType, xp_amount)

      return { success: true, xp_awarded: xp_amount }
    } catch (error) {
      console.error('Error awarding XP:', error)
      return { success: false, xp_awarded: 0 }
    }
  }

  /**
   * Check if XP award would exceed caps
   */
  private async checkXPCaps(
    userId: string,
    week: number,
    sourceType: string,
    xpAmount: number
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Get current XP totals for user this week
      const { data: weeklyXP } = await this.supabase
        .from('xp_events')
        .select('xp_amount')
        .eq('user_id', userId)
        .eq('week', week)

      const currentWeeklyXP = weeklyXP?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0

      // Default caps (configurable by teachers)
      const WEEKLY_CAP = 1000
      const ASSIGNMENT_TYPE_CAPS: Record<string, number> = {
        'SOLO': 200,
        'TEAM': 300,
        'QUIZ': 100,
        'TEST': 150,
        'HOMEWORK': 100,
        'SHOWCASE': 250
      }

      // Check weekly total cap
      if (currentWeeklyXP + xpAmount > WEEKLY_CAP) {
        return { allowed: false, reason: 'Weekly XP cap exceeded' }
      }

      // Check assignment type cap
      const { data: typeXP } = await this.supabase
        .from('xp_events')
        .select('xp_amount')
        .eq('user_id', userId)
        .eq('week', week)
        .eq('source_type', sourceType)

      const currentTypeXP = typeXP?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0
      const typeCap = ASSIGNMENT_TYPE_CAPS[sourceType] || 200

      if (currentTypeXP + xpAmount > typeCap) {
        return { allowed: false, reason: `${sourceType} weekly cap exceeded` }
      }

      return { allowed: true }
    } catch (error) {
      console.error('Error checking XP caps:', error)
      return { allowed: false, reason: 'Error checking caps' }
    }
  }

  /**
   * Update XP cap tracking
   */
  private async updateXPCaps(userId: string, week: number, sourceType: string, xpAmount: number) {
    // Update or create weekly total cap
    await this.supabase
      .from('xp_caps')
      .upsert({
        week,
        cap_type: 'weekly_total',
        max_xp: 1000,
        current_xp: xpAmount
      }, {
        onConflict: 'week,cap_type,source_type',
        ignoreDuplicates: false
      })

    // Update assignment type cap
    await this.supabase
      .from('xp_caps')
      .upsert({
        week,
        cap_type: 'assignment_type',
        source_type: sourceType,
        max_xp: 200, // Default, should be configurable
        current_xp: xpAmount
      }, {
        onConflict: 'week,cap_type,source_type',
        ignoreDuplicates: false
      })
  }

  /**
   * Get student's total XP and level
   */
  async getStudentXPSummary(userId: string): Promise<{
    total_xp: number
    current_level: number
    xp_to_next_level: number
    weekly_xp: number
    current_week: number
  }> {
    try {
      // Get all XP events for user
      const { data: xpEvents } = await this.supabase
        .from('xp_events')
        .select('xp_amount, week')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const totalXP = xpEvents?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0
      
      // Calculate current week and weekly XP
      const currentWeek = Math.max(...(xpEvents?.map((e: any) => e.week) || [1]))
      const weeklyXP = xpEvents
        ?.filter((e: any) => e.week === currentWeek)
        ?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0

      // Level calculation (every 500 XP = 1 level)
      const currentLevel = Math.floor(totalXP / 500) + 1
      const xpToNextLevel = 500 - (totalXP % 500)

      return {
        total_xp: totalXP,
        current_level: currentLevel,
        xp_to_next_level: xpToNextLevel,
        weekly_xp: weeklyXP,
        current_week: currentWeek
      }
    } catch (error) {
      console.error('Error getting XP summary:', error)
      return {
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: 500,
        weekly_xp: 0,
        current_week: 1
      }
    }
  }
}

// ==========================================
// BADGE ENGINE
// ==========================================

class BadgeEngine {
  private supabase = createClient()

  /**
   * Initialize default badge definitions
   */
  async initializeDefaultBadges(): Promise<void> {
    const defaultBadges: Omit<BadgeDefinition, 'id'>[] = [
      {
        badge_key: 'first_run',
        name: 'First Run',
        description: 'Successfully ran your first Python program!',
        emoji: '🚀',
        category: 'completion',
        xp_reward: 25,
        unlock_criteria: { type: 'code_execution', min_runs: 1 },
        rarity: 'common'
      },
      {
        badge_key: 'ship_it',
        name: 'Ship It',
        description: 'Completed your first assignment submission!',
        emoji: '🚢',
        category: 'completion',
        xp_reward: 50,
        unlock_criteria: { type: 'assignment_complete', min_assignments: 1 },
        rarity: 'common'
      },
      {
        badge_key: 'quiz_champion',
        name: 'Quiz Champion',
        description: 'Scored 90% or higher on a quiz!',
        emoji: '🏆',
        category: 'skill',
        xp_reward: 75,
        unlock_criteria: { type: 'quiz_score', min_score: 90 },
        rarity: 'uncommon'
      },
      {
        badge_key: 'speed_coder',
        name: 'Speed Coder',
        description: 'Completed an assignment in under 30 minutes!',
        emoji: '⚡',
        category: 'skill',
        xp_reward: 100,
        unlock_criteria: { type: 'completion_time', max_minutes: 30 },
        rarity: 'uncommon'
      },
      {
        badge_key: 'python_master',
        name: 'Python Master',
        description: 'Completed 5 Python assignments with excellence!',
        emoji: '🐍',
        category: 'skill',
        xp_reward: 200,
        unlock_criteria: { type: 'assignment_streak', min_count: 5, min_score: 85 },
        rarity: 'rare'
      },
      {
        badge_key: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintained a 7-day learning streak!',
        emoji: '🔥',
        category: 'streak',
        xp_reward: 150,
        unlock_criteria: { type: 'learning_streak', min_days: 7 },
        rarity: 'rare'
      },
      {
        badge_key: 'perfect_student',
        name: 'Perfect Student',
        description: 'Completed all assignments in a week with 95%+ average!',
        emoji: '🌟',
        category: 'special',
        xp_reward: 300,
        unlock_criteria: { type: 'weekly_perfect', min_score: 95, completion_rate: 100 },
        rarity: 'legendary'
      },
      {
        badge_key: 'team_player',
        name: 'Team Player',
        description: 'Successfully completed 3 team projects!',
        emoji: '🤝',
        category: 'collaboration',
        xp_reward: 175,
        unlock_criteria: { type: 'team_assignments', min_count: 3, min_score: 80 },
        rarity: 'uncommon'
      },
      {
        badge_key: 'debug_detective',
        name: 'Debug Detective',
        description: 'Fixed 10 coding errors with minimal AI help!',
        emoji: '🔍',
        category: 'skill',
        xp_reward: 125,
        unlock_criteria: { type: 'debug_success', min_fixes: 10, max_ai_help: 2 },
        rarity: 'rare'
      },
      {
        badge_key: 'ai_collaborator',
        name: 'AI Collaborator',
        description: 'Had 20+ productive conversations with Coach Nova!',
        emoji: '🤖',
        category: 'collaboration',
        xp_reward: 100,
        unlock_criteria: { type: 'ai_interactions', min_count: 20, min_rating: 4 },
        rarity: 'uncommon'
      }
    ]

    try {
      for (const badge of defaultBadges) {
        await this.supabase
          .from('badge_definitions')
          .upsert(badge, { onConflict: 'badge_key', ignoreDuplicates: false })
      }
      console.log('Default badges initialized successfully')
    } catch (error) {
      console.error('Error initializing badges:', error)
    }
  }

  /**
   * Check and award badges based on student activity
   */
  async checkAndAwardBadges(
    userId: string,
    activityData: {
      assignment_id?: string
      quiz_score?: number
      completion_time_minutes?: number
      code_executions?: number
      team_assignment?: boolean
      ai_interactions?: number
      week: number
    }
  ): Promise<{ badges_awarded: BadgeDefinition[]; xp_bonus: number }> {
    try {
      // Get all badge definitions
      const { data: badgeDefinitions } = await this.supabase
        .from('badge_definitions')
        .select('*')

      if (!badgeDefinitions) return { badges_awarded: [], xp_bonus: 0 }

      // Get user's existing badges
      const { data: existingBadges } = await this.supabase
        .from('student_badges')
        .select('badge_id')
        .eq('user_id', userId)

      const existingBadgeIds = new Set(existingBadges?.map((b: any) => b.badge_id) || [])
      const badgesAwarded: BadgeDefinition[] = []
      let totalXPBonus = 0

      // Check each badge definition
      for (const badge of badgeDefinitions) {
        if (existingBadgeIds.has(badge.id)) continue // Already has this badge

        const shouldAward = await this.evaluateBadgeCriteria(userId, badge, activityData)
        
        if (shouldAward) {
          // Award the badge
          await this.supabase
            .from('student_badges')
            .insert({
              user_id: userId,
              badge_id: badge.id,
              evidence_metadata: activityData,
              week_unlocked: activityData.week
            })

          // Award XP bonus
          if (badge.xp_reward > 0) {
            await this.supabase
              .from('xp_events')
              .insert({
                user_id: userId,
                assignment_id: activityData.assignment_id || '',
                event_type: 'bonus',
                source_type: 'SHOWCASE',
                xp_amount: badge.xp_reward,
                base_xp: badge.xp_reward,
                rubric_multiplier: 1.0,
                evidence_metadata: { badge_key: badge.badge_key, ...activityData },
                week: activityData.week
              })
          }

          badgesAwarded.push(badge)
          totalXPBonus += badge.xp_reward
        }
      }

      return { badges_awarded: badgesAwarded, xp_bonus: totalXPBonus }
    } catch (error) {
      console.error('Error checking badges:', error)
      return { badges_awarded: [], xp_bonus: 0 }
    }
  }

  /**
   * Evaluate if badge criteria are met
   */
  private async evaluateBadgeCriteria(
    userId: string,
    badge: BadgeDefinition,
    activityData: any
  ): Promise<boolean> {
    const criteria = badge.unlock_criteria

    try {
      switch (criteria.type) {
        case 'code_execution':
          // Count total code executions
          const { data: codeEvents } = await this.supabase
            .from('xp_events')
            .select('id')
            .eq('user_id', userId)
            .eq('event_type', 'practice')

          return (codeEvents?.length || 0) >= (criteria.min_runs || 1)

        case 'assignment_complete':
          // Count completed assignments
          const { data: completedAssignments } = await this.supabase
            .from('student_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'completed')

          return (completedAssignments?.length || 0) >= (criteria.min_assignments || 1)

        case 'quiz_score':
          // Check if current quiz score meets threshold
          return (activityData.quiz_score || 0) >= (criteria.min_score || 90)

        case 'completion_time':
          // Check if assignment completed within time limit
          return (activityData.completion_time_minutes || Infinity) <= (criteria.max_minutes || 30)

        case 'assignment_streak':
          // Check for consecutive high-scoring assignments
          const { data: recentAssignments } = await this.supabase
            .from('student_progress')
            .select('final_score')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(criteria.min_count || 5)

          if (!recentAssignments || recentAssignments.length < (criteria.min_count || 5)) {
            return false
          }

          return recentAssignments.every((a: any) => (a.final_score || 0) >= (criteria.min_score || 85))

        case 'learning_streak':
          // Check learning activity streak (simplified - would need activity tracking)
          return true // TODO: Implement proper streak tracking

        case 'weekly_perfect':
          // Check if all assignments in week completed with high scores
          const { data: weekAssignments } = await this.supabase
            .from('student_progress')
            .select('final_score')
            .eq('user_id', userId)
            .eq('status', 'completed')
            // Would need week filtering in real implementation

          if (!weekAssignments || weekAssignments.length === 0) return false

          const avgScore = weekAssignments.reduce((sum: number, a: any) => sum + (a.final_score || 0), 0) / weekAssignments.length
          return avgScore >= (criteria.min_score || 95)

        case 'team_assignments':
          // Count successful team assignments
          const { data: teamAssignments } = await this.supabase
            .from('student_progress')
            .select('final_score, team_id')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .not('team_id', 'is', null)

          const goodTeamAssignments = teamAssignments?.filter((a: any) => (a.final_score || 0) >= (criteria.min_score || 80)) || []
          return goodTeamAssignments.length >= (criteria.min_count || 3)

        default:
          return false
      }
    } catch (error) {
      console.error('Error evaluating badge criteria:', error)
      return false
    }
  }

  /**
   * Get all badges for a student
   */
  async getStudentBadges(userId: string): Promise<{
    unlocked_badges: (StudentBadge & BadgeDefinition)[]
    available_badges: BadgeDefinition[]
    total_badge_xp: number
  }> {
    try {
      // Get unlocked badges
      const { data: unlockedBadges } = await this.supabase
        .from('student_badges')
        .select(`
          *,
          badge_definitions (*)
        `)
        .eq('user_id', userId)

      // Get all available badges
      const { data: allBadges } = await this.supabase
        .from('badge_definitions')
        .select('*')
        .order('category', { ascending: true })

      const unlockedBadgeIds = new Set(unlockedBadges?.map((b: any) => b.badge_id) || [])
      const availableBadges = allBadges?.filter((b: any) => !unlockedBadgeIds.has(b.id)) || []

      const totalBadgeXP = unlockedBadges?.reduce((sum: number, b: any) => sum + (b.badge_definitions?.xp_reward || 0), 0) || 0

      return {
        unlocked_badges: unlockedBadges || [],
        available_badges: availableBadges,
        total_badge_xp: totalBadgeXP
      }
    } catch (error) {
      console.error('Error getting student badges:', error)
      return { unlocked_badges: [], available_badges: [], total_badge_xp: 0 }
    }
  }
}

// ==========================================
// STREAK TRACKING SYSTEM
// ==========================================

class StreakEngine {
  private supabase = createClient()

  /**
   * Update learning streak for student
   */
  async updateLearningStreak(userId: string): Promise<{
    current_streak: number
    longest_streak: number
    streak_broken: boolean
  }> {
    // Get user's activity for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    try {
      const { data: activities } = await this.supabase
        .from('xp_events')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (!activities || activities.length === 0) {
        return { current_streak: 0, longest_streak: 0, streak_broken: true }
      }

      // Calculate streak
      const activityDates = activities.map((a: any) => new Date(a.created_at).toDateString())
      const uniqueDates = [...new Set<string>(activityDates)].sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())

      let currentStreak = 0
      let longestStreak = 0
      let tempStreak = 0

      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

      // Check if active today or yesterday
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        currentStreak = 1
        tempStreak = 1

        // Count consecutive days
        for (let i = 1; i < uniqueDates.length; i++) {
          const currentDate = new Date(uniqueDates[i])
          const previousDate = new Date(uniqueDates[i - 1])
          const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))

          if (daysDiff === 1) {
            currentStreak++
            tempStreak++
          } else {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak)
      }

      return {
        current_streak: currentStreak,
        longest_streak: longestStreak,
        streak_broken: currentStreak === 0
      }
    } catch (error) {
      console.error('Error calculating streak:', error)
      return { current_streak: 0, longest_streak: 0, streak_broken: true }
    }
  }
}

// ==========================================
// EXPORT ENGINES
// ==========================================

export const xpEngine = new XPEngine()
export const badgeEngine = new BadgeEngine()
export const streakEngine = new StreakEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Process assignment completion and award XP/badges
 */
export async function processAssignmentCompletion(
  userId: string,
  assignmentId: string,
  submissionData: {
    rubric_scores: Record<string, number>
    completion_time_minutes: number
    quiz_score?: number
    code_executions: number
    team_size?: number
    assignment_type: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE'
    week: number
    base_xp: number
  }
): Promise<{
  xp_awarded: number
  badges_earned: BadgeDefinition[]
  total_bonus_xp: number
  level_up: boolean
}> {
  // Award primary XP
  const xpResult = await xpEngine.awardXP(
    userId,
    assignmentId,
    'assignment',
    submissionData.assignment_type,
    submissionData.base_xp,
    submissionData.rubric_scores,
    submissionData.week,
    {
      completion_time: submissionData.completion_time_minutes,
      quiz_score: submissionData.quiz_score,
      code_executions: submissionData.code_executions
    },
    submissionData.team_size
  )

  // Check for badges
  const badgeResult = await badgeEngine.checkAndAwardBadges(userId, {
    assignment_id: assignmentId,
    quiz_score: submissionData.quiz_score,
    completion_time_minutes: submissionData.completion_time_minutes,
    code_executions: submissionData.code_executions,
    team_assignment: submissionData.assignment_type === 'TEAM',
    week: submissionData.week
  })

  // Check if leveled up
  const xpSummary = await xpEngine.getStudentXPSummary(userId)
  const previousXP = xpSummary.total_xp - (xpResult.xp_awarded + badgeResult.xp_bonus)
  const previousLevel = Math.floor(previousXP / 500) + 1
  const levelUp = xpSummary.current_level > previousLevel

  return {
    xp_awarded: xpResult.xp_awarded,
    badges_earned: badgeResult.badges_awarded,
    total_bonus_xp: badgeResult.xp_bonus,
    level_up: levelUp
  }
}