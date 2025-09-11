/**
 * Interactive Challenge System Types
 * Core framework for Codefinity-like bite-sized coding challenges
 */

export interface MicroChallenge {
  id: string
  title: string
  description: string
  instruction: string
  
  // Code validation
  starterCode?: string
  solutionCode?: string
  validateCode?: (code: string) => ValidationResult
  
  // Challenge metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
  concepts: string[]
  tags: string[]
  
  // XP and rewards
  xpReward: number
  badgeReward?: Badge
  
  // Hints and help
  hints: Hint[]
  resources: Resource[]
  
  // Interactive elements
  hasVisualOutput?: boolean
  hasRealtimeValidation?: boolean
  allowMultipleSolutions?: boolean
}

export interface ValidationResult {
  isValid: boolean
  score: number // 0-100
  feedback: string
  errors?: ValidationError[]
  suggestions?: string[]
  passedTests?: number
  totalTests?: number
}

export interface ValidationError {
  line?: number
  column?: number
  message: string
  type: 'syntax' | 'runtime' | 'logic' | 'style'
  severity: 'error' | 'warning' | 'info'
}

export interface Hint {
  id: string
  content: string
  unlockCondition?: 'time' | 'attempts' | 'manual'
  unlockValue?: number // time in seconds or attempt count
  xpCost?: number
  isUnlocked?: boolean
}

export interface Resource {
  title: string
  content: string
  type: 'reference' | 'example' | 'tip' | 'documentation'
  url?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

export interface ChallengeProgress {
  challengeId: string
  userId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  
  // Progress tracking
  attempts: number
  bestScore: number
  completedAt?: Date
  timeSpent: number // in seconds
  hintsUsed: string[]
  
  // Code history
  codeSubmissions: CodeSubmission[]
  finalCode?: string
  
  // XP and achievements
  xpEarned: number
  badgeEarned?: Badge
}

export interface CodeSubmission {
  id: string
  code: string
  submittedAt: Date
  validationResult: ValidationResult
  executionOutput?: string
}

export interface ChallengeSession {
  sessionId: string
  challengeId: string
  userId: string
  startedAt: Date
  lastActivityAt: Date
  
  // Real-time state
  currentCode: string
  isRunning: boolean
  output: string[]
  
  // Progress within session
  attempts: number
  hintsUnlocked: string[]
  
  // Live feedback
  lastValidation?: ValidationResult
  realtimeErrors: ValidationError[]
}

export interface ChallengeSeries {
  id: string
  title: string
  description: string
  
  // Mission/curriculum integration
  missionId: string
  weekId?: string
  lessonId?: string
  
  // Challenge sequence
  challenges: MicroChallenge[]
  prerequisiteSeriesIds?: string[]
  
  // Progression rules
  requiredCompletionRate: number // 0-1 (e.g., 0.8 = 80% of challenges must be completed)
  unlockCriteria?: UnlockCriteria
  
  // Rewards and incentives
  seriesXpBonus: number
  seriesCompletionBadge?: Badge
  
  // Metadata
  estimatedDuration: number // total minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface UnlockCriteria {
  type: 'completion' | 'score' | 'time' | 'streaks'
  value: number
  description: string
}

export interface UserProgress {
  userId: string
  
  // Overall stats
  totalXp: number
  level: number
  currentStreak: number
  longestStreak: number
  
  // Challenge stats
  challengesCompleted: number
  challengesAttempted: number
  averageScore: number
  totalTimeSpent: number
  
  // Achievements
  badges: Badge[]
  recentAchievements: Achievement[]
  
  // Current session
  activeChallengeId?: string
  sessionStartTime?: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  xpReward: number
  category: 'challenge' | 'series' | 'streak' | 'speed' | 'exploration'
}

export interface ChallengeTemplate {
  id: string
  name: string
  description: string
  category: 'variables' | 'functions' | 'loops' | 'conditionals' | 'data-structures' | 'algorithms'
  
  // Template structure
  starterCodeTemplate: string
  instructionTemplate: string
  validationTemplate: string
  
  // Customizable parameters
  parameters: TemplateParameter[]
  
  // Generation rules
  difficultyScaling: DifficultyScaling
  xpCalculation: XpCalculation
}

export interface TemplateParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  defaultValue: any
  validations?: ParameterValidation[]
}

export interface ParameterValidation {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface DifficultyScaling {
  beginner: ScalingRules
  intermediate: ScalingRules
  advanced: ScalingRules
}

export interface ScalingRules {
  xpMultiplier: number
  timeMultiplier: number
  hintPenalty: number
  additionalConcepts?: string[]
}

export interface XpCalculation {
  baseXp: number
  completionBonus: number
  speedBonus: number
  noHintBonus: number
  firstAttemptBonus: number
}

// Analytics and insights
export interface ChallengeAnalytics {
  challengeId: string
  
  // Performance metrics
  completionRate: number
  averageAttempts: number
  averageTime: number
  averageScore: number
  
  // Common issues
  commonErrors: ErrorPattern[]
  stuckPoints: StuckPoint[]
  
  // Engagement metrics
  abandonmentRate: number
  retryRate: number
  hintUsageRate: number
  
  // Time-based analytics
  timeDistribution: TimeDistribution
  peakDifficultyPoints: DifficultyPoint[]
}

export interface ErrorPattern {
  error: string
  frequency: number
  suggestedHint: string
  resolutionRate: number
}

export interface StuckPoint {
  description: string
  frequency: number
  averageTimeStuck: number
  commonResolutions: string[]
}

export interface TimeDistribution {
  quick: number // completed in < 50% of estimated time
  normal: number // completed in 50-150% of estimated time
  slow: number // completed in > 150% of estimated time
}

export interface DifficultyPoint {
  description: string
  difficultySpike: number // 1-10 scale
  studentFeedback: string[]
}

// Real-time collaboration features
export interface CollaborativeChallenge {
  challengeId: string
  participants: string[] // user IDs
  mode: 'pair_programming' | 'team_challenge' | 'mentor_guided'
  
  // Shared state
  sharedCode: string
  codeHistory: CodeChange[]
  
  // Communication
  chatMessages: ChatMessage[]
  annotations: CodeAnnotation[]
  
  // Coordination
  currentEditor?: string // user ID of current editor
  lockRegions: CodeLock[]
}

export interface CodeChange {
  id: string
  userId: string
  timestamp: Date
  change: {
    from: number
    to: number
    content: string
  }
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: Date
  type: 'text' | 'code_suggestion' | 'hint_request'
}

export interface CodeAnnotation {
  id: string
  userId: string
  line: number
  column: number
  content: string
  type: 'comment' | 'question' | 'suggestion'
  timestamp: Date
}

export interface CodeLock {
  userId: string
  fromLine: number
  toLine: number
  expiresAt: Date
}