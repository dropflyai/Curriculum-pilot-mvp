// Leaderboard Engine - Weekly snapshots and shadow ranking system
// Based on DropFly Education MVP specifications

import { createClient } from '@/lib/supabase'

export interface LeaderboardEntry {
  user_id: string
  display_name: string // Can be real name or shadow alias
  avatar_emoji: string
  total_xp: number
  current_level: number
  weekly_xp: number
  badge_count: number
  current_streak: number
  assignments_completed: number
  rank: number
  rank_change: number // -1, 0, +1 for down/same/up from previous week
  is_shadow: boolean // True if using anonymous display
}

export interface WeeklySnapshot {
  id: string
  user_id: string
  week: number
  year: number
  total_xp: number
  weekly_xp: number
  current_level: number
  badge_count: number
  current_streak: number
  assignments_completed: number
  class_rank: number
  global_rank?: number
  captured_at: string
}

export interface LeaderboardConfig {
  show_real_names: boolean
  show_full_rankings: boolean // vs top 10 only
  enable_global_rankings: boolean
  enable_shadow_mode: boolean
  competitive_categories: ('xp' | 'badges' | 'streaks' | 'completion')[]
}

export interface ShadowProfile {
  user_id: string
  shadow_name: string
  avatar_emoji: string
  created_at: string
}

class LeaderboardEngine {
  private supabase = createClient()

  // Shadow name generators for anonymous competition
  private shadowAdjectives = [
    'Swift', 'Clever', 'Bright', 'Sharp', 'Quick', 'Smart', 'Wise', 'Bold',
    'Fast', 'Keen', 'Witty', 'Alert', 'Agile', 'Sleek', 'Slick', 'Smooth',
    'Cool', 'Epic', 'Mega', 'Super', 'Ultra', 'Pro', 'Elite', 'Master'
  ]

  private shadowNouns = [
    'Coder', 'Hacker', 'Developer', 'Programmer', 'Builder', 'Creator', 'Maker',
    'Ninja', 'Wizard', 'Genius', 'Legend', 'Hero', 'Champion', 'Warrior',
    'Python', 'Script', 'Logic', 'Binary', 'Pixel', 'Console', 'Terminal',
    'Bug', 'Loop', 'Function', 'Variable', 'Method', 'Class', 'Object'
  ]

  private avatarEmojis = [
    '🚀', '🎯', '🏆', '⚡', '🔥', '💎', '🌟', '🎮', '🤖', '👾',
    '🦄', '🐉', '🦅', '🐆', '🦊', '🐺', '🦈', '🐙', '🎪', '🎨',
    '🎭', '🎪', '🎨', '🎲', '🎳', '🏹', '⚔️', '🛡️', '🔮', '💫'
  ]

  // ==========================================
  // WEEKLY SNAPSHOTS SYSTEM
  // ==========================================

  /**
   * Capture weekly snapshots for all students
   */
  async captureWeeklySnapshots(week: number, year: number = new Date().getFullYear()): Promise<{
    success: boolean
    snapshots_created: number
    leaderboard_updated: boolean
  }> {
    try {
      // Get all students with current stats
      const { data: students } = await this.supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'student')

      if (!students) return { success: false, snapshots_created: 0, leaderboard_updated: false }

      let snapshotsCreated = 0
      const weeklyRankings: Array<{ user_id: string; total_xp: number; weekly_xp: number }> = []

      for (const student of students) {
        try {
          // Get current XP summary
          const xpSummary = await this.getStudentCurrentStats(student.id, week)
          
          // Check if snapshot already exists for this week
          const { data: existingSnapshot } = await this.supabase
            .from('weekly_snapshots')
            .select('id')
            .eq('user_id', student.id)
            .eq('week', week)
            .eq('year', year)
            .single()

          if (existingSnapshot) {
            console.log(`Snapshot already exists for student ${student.id}, week ${week}`)
            continue
          }

          // Create weekly snapshot
          const { error: snapshotError } = await this.supabase
            .from('weekly_snapshots')
            .insert({
              user_id: student.id,
              week,
              year,
              total_xp: xpSummary.total_xp,
              weekly_xp: xpSummary.weekly_xp,
              current_level: xpSummary.current_level,
              badge_count: xpSummary.badge_count,
              current_streak: xpSummary.current_streak,
              assignments_completed: xpSummary.assignments_completed,
              class_rank: 0, // Will be calculated after all snapshots
              captured_at: new Date().toISOString()
            })

          if (snapshotError) {
            console.error('Error creating snapshot for student:', student.id, snapshotError)
            continue
          }

          weeklyRankings.push({
            user_id: student.id,
            total_xp: xpSummary.total_xp,
            weekly_xp: xpSummary.weekly_xp
          })

          snapshotsCreated++
        } catch (error) {
          console.error('Error processing student snapshot:', student.id, error)
        }
      }

      // Calculate and update rankings
      const leaderboardUpdated = await this.updateWeeklyRankings(week, year, weeklyRankings)

      return {
        success: true,
        snapshots_created: snapshotsCreated,
        leaderboard_updated: leaderboardUpdated
      }
    } catch (error) {
      console.error('Error capturing weekly snapshots:', error)
      return { success: false, snapshots_created: 0, leaderboard_updated: false }
    }
  }

  /**
   * Get current student statistics for snapshot
   */
  private async getStudentCurrentStats(userId: string, week: number): Promise<{
    total_xp: number
    weekly_xp: number
    current_level: number
    badge_count: number
    current_streak: number
    assignments_completed: number
  }> {
    try {
      // Get XP events
      const { data: xpEvents } = await this.supabase
        .from('xp_events')
        .select('xp_amount, week')
        .eq('user_id', userId)

      const totalXP = xpEvents?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0
      const weeklyXP = xpEvents?.filter((event: any) => event.week === week)
        ?.reduce((sum: number, event: any) => sum + event.xp_amount, 0) || 0
      const currentLevel = Math.floor(totalXP / 500) + 1

      // Get badge count
      const { data: badges } = await this.supabase
        .from('student_badges')
        .select('id')
        .eq('user_id', userId)
      const badgeCount = badges?.length || 0

      // Get assignments completed
      const { data: completed } = await this.supabase
        .from('student_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed')
      const assignmentsCompleted = completed?.length || 0

      // Get current streak (simplified)
      const currentStreak = 5 // Would calculate from actual activity

      return {
        total_xp: totalXP,
        weekly_xp: weeklyXP,
        current_level: currentLevel,
        badge_count: badgeCount,
        current_streak: currentStreak,
        assignments_completed: assignmentsCompleted
      }
    } catch (error) {
      console.error('Error getting student stats:', error)
      return {
        total_xp: 0,
        weekly_xp: 0,
        current_level: 1,
        badge_count: 0,
        current_streak: 0,
        assignments_completed: 0
      }
    }
  }

  /**
   * Update weekly rankings after snapshots are created
   */
  private async updateWeeklyRankings(
    week: number,
    year: number,
    weeklyRankings: Array<{ user_id: string; total_xp: number; weekly_xp: number }>
  ): Promise<boolean> {
    try {
      // Sort by total XP descending
      const sortedRankings = weeklyRankings.sort((a, b) => b.total_xp - a.total_xp)

      // Update class rankings in snapshots
      for (let i = 0; i < sortedRankings.length; i++) {
        const ranking = sortedRankings[i]
        await this.supabase
          .from('weekly_snapshots')
          .update({ class_rank: i + 1 })
          .eq('user_id', ranking.user_id)
          .eq('week', week)
          .eq('year', year)
      }

      return true
    } catch (error) {
      console.error('Error updating weekly rankings:', error)
      return false
    }
  }

  // ==========================================
  // SHADOW RANKING SYSTEM
  // ==========================================

  /**
   * Generate shadow profile for anonymous competition
   */
  async generateShadowProfile(userId: string): Promise<ShadowProfile> {
    try {
      // Check if shadow profile already exists
      const { data: existingProfile } = await this.supabase
        .from('shadow_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (existingProfile) {
        return existingProfile
      }

      // Generate unique shadow name
      const shadowName = this.generateUniqueShadowName()
      const avatarEmoji = this.avatarEmojis[Math.floor(Math.random() * this.avatarEmojis.length)]

      const shadowProfile: ShadowProfile = {
        user_id: userId,
        shadow_name: shadowName,
        avatar_emoji: avatarEmoji,
        created_at: new Date().toISOString()
      }

      // Save to database
      const { error } = await this.supabase
        .from('shadow_profiles')
        .insert(shadowProfile)

      if (error) {
        console.error('Error saving shadow profile:', error)
        // Return generated profile even if save failed
        return shadowProfile
      }

      return shadowProfile
    } catch (error) {
      console.error('Error generating shadow profile:', error)
      // Return fallback profile
      return {
        user_id: userId,
        shadow_name: 'Anonymous Coder',
        avatar_emoji: '🤖',
        created_at: new Date().toISOString()
      }
    }
  }

  /**
   * Generate unique shadow name
   */
  private generateUniqueShadowName(): string {
    const adjective = this.shadowAdjectives[Math.floor(Math.random() * this.shadowAdjectives.length)]
    const noun = this.shadowNouns[Math.floor(Math.random() * this.shadowNouns.length)]
    const number = Math.floor(Math.random() * 99) + 1
    return `${adjective}${noun}${number}`
  }

  // ==========================================
  // LEADERBOARD GENERATION
  // ==========================================

  /**
   * Generate current leaderboard with optional shadow mode
   */
  async generateLeaderboard(
    week?: number,
    year?: number,
    config: LeaderboardConfig = {
      show_real_names: true,
      show_full_rankings: true,
      enable_global_rankings: false,
      enable_shadow_mode: false,
      competitive_categories: ['xp', 'badges', 'streaks', 'completion']
    }
  ): Promise<LeaderboardEntry[]> {
    try {
      const currentWeek = week || this.getCurrentWeek()
      const currentYear = year || new Date().getFullYear()

      // Get all students with current stats
      const { data: students } = await this.supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'student')

      if (!students) return []

      const leaderboardEntries: LeaderboardEntry[] = []

      for (const student of students) {
        const stats = await this.getStudentCurrentStats(student.id, currentWeek)
        
        // Get shadow profile if needed
        const shadowProfile = config.enable_shadow_mode 
          ? await this.generateShadowProfile(student.id)
          : null

        // Get previous week rank for rank change calculation
        const previousRank = await this.getPreviousWeekRank(student.id, currentWeek - 1, currentYear)

        const entry: LeaderboardEntry = {
          user_id: student.id,
          display_name: shadowProfile ? shadowProfile.shadow_name : (student.full_name || student.email),
          avatar_emoji: shadowProfile ? shadowProfile.avatar_emoji : '👤',
          total_xp: stats.total_xp,
          current_level: stats.current_level,
          weekly_xp: stats.weekly_xp,
          badge_count: stats.badge_count,
          current_streak: stats.current_streak,
          assignments_completed: stats.assignments_completed,
          rank: 0, // Will be calculated after sorting
          rank_change: 0, // Will be calculated after ranking
          is_shadow: !!shadowProfile
        }

        leaderboardEntries.push(entry)
      }

      // Sort by total XP and assign ranks
      leaderboardEntries.sort((a, b) => b.total_xp - a.total_xp)
      
      for (let i = 0; i < leaderboardEntries.length; i++) {
        const entry = leaderboardEntries[i]
        entry.rank = i + 1
        
        // Calculate rank change
        const previousRank = await this.getPreviousWeekRank(entry.user_id, currentWeek - 1, currentYear)
        if (previousRank > 0) {
          if (entry.rank < previousRank) entry.rank_change = 1 // Moved up
          else if (entry.rank > previousRank) entry.rank_change = -1 // Moved down
          else entry.rank_change = 0 // Same rank
        }
      }

      // Apply display limits if configured
      if (!config.show_full_rankings) {
        return leaderboardEntries.slice(0, 10) // Top 10 only
      }

      return leaderboardEntries
    } catch (error) {
      console.error('Error generating leaderboard:', error)
      return []
    }
  }

  /**
   * Get previous week rank for rank change calculation
   */
  private async getPreviousWeekRank(userId: string, week: number, year: number): Promise<number> {
    try {
      const { data: snapshot } = await this.supabase
        .from('weekly_snapshots')
        .select('class_rank')
        .eq('user_id', userId)
        .eq('week', week)
        .eq('year', year)
        .single()

      return snapshot?.class_rank || 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Generate specialized leaderboards by category
   */
  async generateCategoryLeaderboard(
    category: 'xp' | 'badges' | 'streaks' | 'completion',
    week?: number,
    shadowMode: boolean = false
  ): Promise<LeaderboardEntry[]> {
    const baseLeaderboard = await this.generateLeaderboard(week, undefined, {
      show_real_names: !shadowMode,
      show_full_rankings: true,
      enable_global_rankings: false,
      enable_shadow_mode: shadowMode,
      competitive_categories: [category]
    })

    // Re-sort based on category
    switch (category) {
      case 'xp':
        return baseLeaderboard.sort((a, b) => b.total_xp - a.total_xp)
      case 'badges':
        return baseLeaderboard.sort((a, b) => b.badge_count - a.badge_count)
      case 'streaks':
        return baseLeaderboard.sort((a, b) => b.current_streak - a.current_streak)
      case 'completion':
        return baseLeaderboard.sort((a, b) => b.assignments_completed - a.assignments_completed)
      default:
        return baseLeaderboard
    }
  }

  // ==========================================
  // LEADERBOARD ANALYTICS
  // ==========================================

  /**
   * Get weekly performance trends
   */
  async getWeeklyTrends(weeks: number = 4): Promise<{
    weekly_totals: Array<{ week: number; total_xp: number; participants: number }>
    top_performers: Array<{ user_id: string; display_name: string; average_weekly_xp: number }>
    engagement_trend: 'increasing' | 'decreasing' | 'stable'
  }> {
    try {
      const currentWeek = this.getCurrentWeek()
      const currentYear = new Date().getFullYear()

      const weeklyTotals = []
      const topPerformersMap = new Map<string, { total_xp: number; weeks: number }>()

      for (let i = weeks - 1; i >= 0; i--) {
        const targetWeek = currentWeek - i
        
        const { data: snapshots } = await this.supabase
          .from('weekly_snapshots')
          .select('user_id, weekly_xp, total_xp')
          .eq('week', targetWeek)
          .eq('year', currentYear)

        if (snapshots) {
          const weekTotal = snapshots.reduce((sum: number, s: any) => sum + s.weekly_xp, 0)
          weeklyTotals.push({
            week: targetWeek,
            total_xp: weekTotal,
            participants: snapshots.length
          })

          // Track top performers
          snapshots.forEach((snapshot: any) => {
            const existing = topPerformersMap.get(snapshot.user_id) || { total_xp: 0, weeks: 0 }
            topPerformersMap.set(snapshot.user_id, {
              total_xp: existing.total_xp + snapshot.weekly_xp,
              weeks: existing.weeks + 1
            })
          })
        }
      }

      // Calculate top performers
      const topPerformers = []
      for (const [userId, data] of topPerformersMap.entries()) {
        const averageWeeklyXP = data.total_xp / data.weeks
        if (averageWeeklyXP > 50) { // Minimum threshold
          const { data: user } = await this.supabase
            .from('users')
            .select('full_name, email')
            .eq('id', userId)
            .single()

          topPerformers.push({
            user_id: userId,
            display_name: user?.full_name || user?.email || 'Unknown',
            average_weekly_xp: Math.round(averageWeeklyXP)
          })
        }
      }

      topPerformers.sort((a, b) => b.average_weekly_xp - a.average_weekly_xp)

      // Determine engagement trend
      let engagementTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
      if (weeklyTotals.length >= 2) {
        const recent = weeklyTotals.slice(-2)
        if (recent[1].total_xp > recent[0].total_xp * 1.1) engagementTrend = 'increasing'
        else if (recent[1].total_xp < recent[0].total_xp * 0.9) engagementTrend = 'decreasing'
      }

      return {
        weekly_totals: weeklyTotals,
        top_performers: topPerformers.slice(0, 5),
        engagement_trend: engagementTrend
      }
    } catch (error) {
      console.error('Error getting weekly trends:', error)
      return {
        weekly_totals: [],
        top_performers: [],
        engagement_trend: 'stable'
      }
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  /**
   * Get current school week number
   */
  private getCurrentWeek(): number {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1) / 7)
    return Math.min(weekNumber, 36) // Limit to 36 weeks for school year
  }

  /**
   * Trigger weekly snapshot capture (can be called by cron job)
   */
  async triggerWeeklySnapshot(): Promise<{ success: boolean; message: string }> {
    const currentWeek = this.getCurrentWeek()
    const currentYear = new Date().getFullYear()

    const result = await this.captureWeeklySnapshots(currentWeek, currentYear)
    
    return {
      success: result.success,
      message: `Weekly snapshot for Week ${currentWeek}: ${result.snapshots_created} snapshots created, leaderboard ${result.leaderboard_updated ? 'updated' : 'unchanged'}`
    }
  }
}

// ==========================================
// EXPORT ENGINE
// ==========================================

export const leaderboardEngine = new LeaderboardEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Auto-generate weekly leaderboard for current week
 */
export async function generateCurrentWeekLeaderboard(shadowMode: boolean = false): Promise<LeaderboardEntry[]> {
  return await leaderboardEngine.generateLeaderboard(undefined, undefined, {
    show_real_names: !shadowMode,
    show_full_rankings: true,
    enable_global_rankings: false,
    enable_shadow_mode: shadowMode,
    competitive_categories: ['xp', 'badges', 'streaks', 'completion']
  })
}

/**
 * Get student's current leaderboard position
 */
export async function getStudentLeaderboardPosition(
  userId: string,
  shadowMode: boolean = false
): Promise<{ rank: number; total_participants: number; rank_change: number }> {
  const leaderboard = await generateCurrentWeekLeaderboard(shadowMode)
  const studentEntry = leaderboard.find(entry => entry.user_id === userId)
  
  return {
    rank: studentEntry?.rank || leaderboard.length + 1,
    total_participants: leaderboard.length,
    rank_change: studentEntry?.rank_change || 0
  }
}

/**
 * Schedule weekly snapshot capture
 */
export async function scheduleWeeklySnapshots(): Promise<boolean> {
  try {
    const result = await leaderboardEngine.triggerWeeklySnapshot()
    console.log('Weekly snapshot scheduled:', result.message)
    return result.success
  } catch (error) {
    console.error('Error scheduling weekly snapshots:', error)
    return false
  }
}