/**
 * XP System for Interactive Challenge Platform
 * Comprehensive gamification and progression tracking
 */

import { 
  MicroChallenge, 
  UserProgress, 
  ChallengeProgress, 
  ChallengeSession, 
  CodeSubmission, 
  Achievement,
  Badge 
} from '@/types/challenge'

export interface XPCalculationResult {
  baseXP: number
  bonusXP: number
  totalXP: number
  reasons: string[]
}

export interface LevelInfo {
  level: number
  levelBadge: string
  xpInCurrentLevel: number
  xpRequiredForNextLevel: number
  progressToNextLevel: number
  totalXpRequired: number
}

export class XPSystem {
  
  /**
   * Calculate XP earned for completing a challenge
   */
  calculateChallengeXP(
    challenge: MicroChallenge, 
    submission: CodeSubmission, 
    session: ChallengeSession,
    userProgress: UserProgress
  ): XPCalculationResult {
    const { validationResult } = submission
    let baseXP = challenge.xpReward
    let bonusXP = 0
    const reasons: string[] = []

    // Base XP from challenge completion
    if (validationResult.isValid) {
      baseXP = Math.floor(baseXP * (validationResult.score / 100))
      reasons.push(`Challenge completion: ${baseXP}`)
    } else {
      baseXP = 0
      return {
        baseXP: 0,
        bonusXP: 0,
        totalXP: 0,
        reasons: ['Challenge not completed']
      }
    }

    // First attempt bonus
    if (session.attempts === 1) {
      bonusXP += Math.floor(challenge.xpReward * 0.5)
      reasons.push('First attempt bonus: +50%')
    }

    // No hints bonus
    if (session.hintsUnlocked.length === 0) {
      bonusXP += Math.floor(challenge.xpReward * 0.3)
      reasons.push('No hints bonus: +30%')
    }

    // Perfect score bonus
    if (validationResult.score === 100) {
      bonusXP += Math.floor(challenge.xpReward * 0.2)
      reasons.push('Perfect score bonus: +20%')
    }

    // Speed bonus
    const timeSpent = (Date.now() - session.startedAt.getTime()) / 1000 / 60 // minutes
    if (timeSpent < challenge.estimatedTime * 0.5) {
      bonusXP += Math.floor(challenge.xpReward * 0.25)
      reasons.push('Speed bonus: +25%')
    }

    // Streak multiplier
    if (userProgress.currentStreak >= 5) {
      const streakBonus = Math.floor(baseXP * 0.1 * Math.min(userProgress.currentStreak / 5, 3))
      bonusXP += streakBonus
      reasons.push(`Streak multiplier (${userProgress.currentStreak}): +${streakBonus}`)
    }

    const totalXP = baseXP + bonusXP

    return {
      baseXP,
      bonusXP,
      totalXP,
      reasons
    }
  }

  /**
   * Calculate user level based on total XP
   */
  calculateLevel(totalXP: number): LevelInfo {
    // XP requirements increase exponentially
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1
    const xpRequiredForCurrentLevel = (level - 1) ** 2 * 100
    const xpRequiredForNextLevel = level ** 2 * 100
    const xpInCurrentLevel = totalXP - xpRequiredForCurrentLevel
    const progressToNextLevel = xpInCurrentLevel / (xpRequiredForNextLevel - xpRequiredForCurrentLevel)

    // Level badges
    const levelBadges = ['🥉', '🥈', '🥇', '💎', '👑', '🏆', '⭐', '🌟', '💫', '🔥']
    const levelBadge = levelBadges[Math.min(Math.floor((level - 1) / 5), levelBadges.length - 1)]

    return {
      level,
      levelBadge,
      xpInCurrentLevel,
      xpRequiredForNextLevel: xpRequiredForNextLevel - xpRequiredForCurrentLevel,
      progressToNextLevel,
      totalXpRequired: xpRequiredForNextLevel
    }
  }

  /**
   * Update user progress after challenge completion
   */
  updateUserProgress(
    userProgress: UserProgress, 
    challengeProgress: ChallengeProgress, 
    xpResult: XPCalculationResult
  ): UserProgress {
    const updatedProgress = { ...userProgress }

    // Update XP
    updatedProgress.totalXp += xpResult.totalXP

    // Update challenge stats
    updatedProgress.challengesCompleted += 1
    if (challengeProgress.attempts === 1) {
      updatedProgress.currentStreak += 1
      updatedProgress.longestStreak = Math.max(updatedProgress.longestStreak, updatedProgress.currentStreak)
    }

    // Recalculate average score
    const totalChallenges = updatedProgress.challengesCompleted
    const currentTotal = userProgress.averageScore * (totalChallenges - 1)
    updatedProgress.averageScore = Math.round((currentTotal + challengeProgress.bestScore) / totalChallenges)

    // Update time spent
    updatedProgress.totalTimeSpent += challengeProgress.timeSpent

    return updatedProgress
  }

  /**
   * Check for new achievements
   */
  checkForAchievements(
    userProgress: UserProgress,
    challengeProgress: ChallengeProgress,
    session: ChallengeSession,
    challenge: MicroChallenge
  ): Achievement[] {
    const newAchievements: Achievement[] = []
    const now = new Date()

    // First challenge completion
    if (userProgress.challengesCompleted === 1) {
      newAchievements.push({
        id: 'first_challenge',
        name: 'First Steps',
        description: 'Complete your first challenge',
        icon: '🎯',
        unlockedAt: now,
        xpReward: 50,
        category: 'challenge'
      })
    }

    // Perfect score achievement
    if (challengeProgress.bestScore === 100) {
      newAchievements.push({
        id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Achieve 100% score on a challenge',
        icon: '⭐',
        unlockedAt: now,
        xpReward: 25,
        category: 'challenge'
      })
    }

    // Speed achievement
    const timeSpent = challengeProgress.timeSpent / 60 // in minutes
    if (timeSpent < challenge.estimatedTime * 0.3) {
      newAchievements.push({
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a challenge in record time',
        icon: '⚡',
        unlockedAt: now,
        xpReward: 75,
        category: 'speed'
      })
    }

    // No hints achievement
    if (session.hintsUnlocked.length === 0 && challengeProgress.bestScore >= 90) {
      newAchievements.push({
        id: 'independent_learner',
        name: 'Independent Learner',
        description: 'Complete a challenge without using hints',
        icon: '🧠',
        unlockedAt: now,
        xpReward: 40,
        category: 'challenge'
      })
    }

    // Streak achievements
    if (userProgress.currentStreak === 5) {
      newAchievements.push({
        id: 'streak_5',
        name: 'On Fire',
        description: 'Complete 5 challenges in a row',
        icon: '🔥',
        unlockedAt: now,
        xpReward: 100,
        category: 'streak'
      })
    }

    if (userProgress.currentStreak === 10) {
      newAchievements.push({
        id: 'streak_10',
        name: 'Unstoppable',
        description: 'Complete 10 challenges in a row',
        icon: '🚀',
        unlockedAt: now,
        xpReward: 250,
        category: 'streak'
      })
    }

    // Milestone achievements
    if (userProgress.challengesCompleted === 10) {
      newAchievements.push({
        id: 'milestone_10',
        name: 'Rising Agent',
        description: 'Complete 10 challenges',
        icon: '🎖️',
        unlockedAt: now,
        xpReward: 150,
        category: 'challenge'
      })
    }

    if (userProgress.challengesCompleted === 25) {
      newAchievements.push({
        id: 'milestone_25',
        name: 'Elite Agent',
        description: 'Complete 25 challenges',
        icon: '🏅',
        unlockedAt: now,
        xpReward: 300,
        category: 'challenge'
      })
    }

    // Level-based achievements
    const levelInfo = this.calculateLevel(userProgress.totalXp)
    if (levelInfo.level === 5) {
      newAchievements.push({
        id: 'level_5',
        name: 'Code Warrior',
        description: 'Reach level 5',
        icon: '⚔️',
        unlockedAt: now,
        xpReward: 200,
        category: 'challenge'
      })
    }

    if (levelInfo.level === 10) {
      newAchievements.push({
        id: 'level_10',
        name: 'Code Master',
        description: 'Reach level 10',
        icon: '👑',
        unlockedAt: now,
        xpReward: 500,
        category: 'challenge'
      })
    }

    return newAchievements
  }

  /**
   * Generate daily challenge bonus
   */
  getDailyChallengeBonus(): number {
    // Simple daily bonus - could be enhanced with actual day tracking
    return 25
  }

  /**
   * Calculate XP penalty for using hints
   */
  calculateHintPenalty(hint: any): number {
    return hint.xpCost || 5
  }

  /**
   * Get XP multiplier based on difficulty
   */
  getDifficultyMultiplier(difficulty: string): number {
    switch (difficulty) {
      case 'beginner': return 1.0
      case 'intermediate': return 1.5
      case 'advanced': return 2.0
      default: return 1.0
    }
  }

  /**
   * Format XP display
   */
  formatXP(xp: number): string {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`
    }
    return xp.toString()
  }

  /**
   * Get level requirements for display
   */
  getLevelRequirements(level: number): number {
    return level ** 2 * 100
  }

  /**
   * Calculate total possible XP for a challenge set
   */
  calculateMaxPossibleXP(challenges: MicroChallenge[]): number {
    return challenges.reduce((total, challenge) => {
      // Max possible includes base XP + all bonuses
      const maxBonus = challenge.xpReward * 1.25 // 125% of base (all bonuses combined)
      return total + challenge.xpReward + maxBonus
    }, 0)
  }
}

// Singleton instance
export const xpSystem = new XPSystem()