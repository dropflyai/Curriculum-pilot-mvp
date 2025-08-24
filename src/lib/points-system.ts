// Enhanced Point System for CodeFly Platform

export interface PointActivity {
  id: string
  studentId: string
  type: 'lesson' | 'homework' | 'peer_comment' | 'gallery_vote' | 'login_streak' | 'weekly_goal' | 'first_attempt' | 'special_recognition'
  lessonId?: string
  points: number
  basePoints: number
  bonusPoints: number
  description: string
  timestamp: string
  metadata?: {
    score?: number
    streakCount?: number
    category?: string
    recipientId?: string
  }
}

export interface StudentPoints {
  studentId: string
  studentName: string
  totalXP: number
  level: number
  currentStreak: number
  weeklyXP: number
  monthlyXP: number
  badges: string[]
  specialRecognitions: string[]
  lastActivity: string
  rank: number
  weeklyRank: number
}

export interface LeaderboardData {
  allTime: StudentPoints[]
  weekly: StudentPoints[]
  monthly: StudentPoints[]
  specialCategories: {
    creativeCoders: StudentPoints[]
    helpfulClassmates: StudentPoints[]
    speedLearners: StudentPoints[]
    deepThinkers: StudentPoints[]
  }
}

// Point calculation functions
export function calculateLessonPoints(baseScore: number): { base: number, bonus: number, total: number } {
  const base = 100
  let bonus = 0
  
  if (baseScore >= 90) bonus = 50
  else if (baseScore >= 80) bonus = 25
  else if (baseScore >= 70) bonus = 10
  
  return { base, bonus, total: base + bonus }
}

export function calculateHomeworkPoints(completed: boolean, hasDocumentation: boolean, peerComments: number, isCreative: boolean): { base: number, bonus: number, total: number } {
  if (!completed) return { base: 0, bonus: 0, total: 0 }
  
  const base = 150
  let bonus = 0
  
  if (hasDocumentation) bonus += 25
  bonus += peerComments * 10
  if (isCreative) bonus += 50
  
  return { base, bonus, total: base + bonus }
}

export function calculateStreakBonus(streakDays: number): number {
  return Math.min(streakDays * 5, 50) // Max 50 XP per week
}

export function calculateLevel(totalXP: number): number {
  // Level system: 200 XP for level 1, then +300 XP for each subsequent level
  if (totalXP < 200) return 1
  return Math.floor((totalXP - 200) / 300) + 2
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  if (currentLevel === 1) return 200 - currentXP
  
  const nextLevelXP = 200 + (currentLevel - 1) * 300
  return nextLevelXP - currentXP
}

// Mock data for demonstration
export function getMockLeaderboardData(): LeaderboardData {
  const students: StudentPoints[] = [
    {
      studentId: '1',
      studentName: 'Sarah Chen',
      totalXP: 1450,
      level: 5,
      currentStreak: 8,
      weeklyXP: 425,
      monthlyXP: 1450,
      badges: ['AI Classifier', 'Python Wizard', 'Creative Coder', 'Quiz Champion'],
      specialRecognitions: ['Most Creative Magic 8-Ball', 'Helpful Classmate'],
      lastActivity: '2 hours ago',
      rank: 1,
      weeklyRank: 1
    },
    {
      studentId: '2',
      studentName: 'Alex Johnson',
      totalXP: 1320,
      level: 5,
      currentStreak: 5,
      weeklyXP: 380,
      monthlyXP: 1320,
      badges: ['AI Classifier', 'Python Wizard', 'Speed Learner'],
      specialRecognitions: ['Fastest Lesson Completion'],
      lastActivity: '1 hour ago',
      rank: 2,
      weeklyRank: 2
    },
    {
      studentId: '3',
      studentName: 'Marcus Williams',
      totalXP: 1180,
      level: 4,
      currentStreak: 12,
      weeklyXP: 310,
      monthlyXP: 1180,
      badges: ['AI Classifier', 'Python Wizard', 'Streak Warrior'],
      specialRecognitions: ['Longest Learning Streak'],
      lastActivity: '30 minutes ago',
      rank: 3,
      weeklyRank: 4
    },
    {
      studentId: '4',
      studentName: 'Emily Rodriguez',
      totalXP: 1050,
      level: 4,
      currentStreak: 3,
      weeklyXP: 340,
      monthlyXP: 1050,
      badges: ['AI Classifier', 'Python Wizard', 'Deep Thinker'],
      specialRecognitions: ['Best Reflection Essays'],
      lastActivity: '4 hours ago',
      rank: 4,
      weeklyRank: 3
    },
    {
      studentId: '5',
      studentName: 'Jordan Lee',
      totalXP: 890,
      level: 3,
      currentStreak: 2,
      weeklyXP: 280,
      monthlyXP: 890,
      badges: ['AI Classifier', 'Quiz Champion'],
      specialRecognitions: [],
      lastActivity: '1 day ago',
      rank: 5,
      weeklyRank: 5
    },
    {
      studentId: '6',
      studentName: 'Taylor Brooks',
      totalXP: 760,
      level: 3,
      currentStreak: 1,
      weeklyXP: 195,
      monthlyXP: 760,
      badges: ['AI Classifier'],
      specialRecognitions: [],
      lastActivity: '3 days ago',
      rank: 6,
      weeklyRank: 6
    }
  ]

  return {
    allTime: students,
    weekly: [...students].sort((a, b) => b.weeklyXP - a.weeklyXP),
    monthly: students,
    specialCategories: {
      creativeCoders: students.filter(s => s.specialRecognitions.some(r => r.includes('Creative'))),
      helpfulClassmates: students.filter(s => s.specialRecognitions.some(r => r.includes('Helpful'))),
      speedLearners: students.filter(s => s.specialRecognitions.some(r => r.includes('Speed') || r.includes('Fastest'))),
      deepThinkers: students.filter(s => s.specialRecognitions.some(r => r.includes('Reflection') || r.includes('Deep')))
    }
  }
}

// Point system constants
export const POINT_VALUES = {
  LESSON_BASE: 100,
  LESSON_BONUS_A: 50,  // 90-100%
  LESSON_BONUS_B: 25,  // 80-89%
  LESSON_BONUS_C: 10,  // 70-79%
  
  HOMEWORK_BASE: 150,
  HOMEWORK_DOCUMENTATION: 25,
  HOMEWORK_PEER_COMMENT: 10,
  HOMEWORK_CREATIVE: 50,
  
  PEER_HELPFUL_COMMENT: 15,
  GALLERY_VOTE: 5,
  PROJECT_INSPIRATION: 20,
  
  DAILY_STREAK: 5,
  WEEKLY_GOAL: 100,
  FIRST_ATTEMPT: 25,
  
  SPECIAL_CREATIVE: 200,
  SPECIAL_HELPFUL: 150,
  SPECIAL_SPEED: 100,
  SPECIAL_DEEP_THINKER: 125
} as const

export function awardPoints(studentId: string, activity: Omit<PointActivity, 'id' | 'studentId' | 'timestamp'>): PointActivity {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    timestamp: new Date().toISOString(),
    ...activity
  }
}