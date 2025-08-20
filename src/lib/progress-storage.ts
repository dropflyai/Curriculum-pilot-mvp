// Local storage utilities for student progress persistence

interface LessonProgress {
  lessonId: string
  sectionProgress: Record<number, boolean>
  quizResults: Record<number, any>
  codeAttempts: Record<number, string>
  lastAccessed: string
  completionPercentage: number
}

interface StudentProgress {
  lessons: Record<string, LessonProgress>
  userStats: {
    totalXP: number
    currentStreak: number
    lastActivityDate: string
    achievements: string[]
  }
}

const STORAGE_KEY = 'codefly_student_progress'

export const saveProgress = (data: Partial<StudentProgress>) => {
  try {
    const existing = getProgress()
    const updated = { ...existing, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error)
    return false
  }
}

export const getProgress = (): StudentProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error)
  }
  
  // Return default structure
  return {
    lessons: {},
    userStats: {
      totalXP: 0,
      currentStreak: 0,
      lastActivityDate: new Date().toISOString(),
      achievements: []
    }
  }
}

export const saveLessonProgress = (
  lessonId: string, 
  sectionIndex: number, 
  completed: boolean,
  additionalData?: { quizResult?: any, codeAttempt?: string }
) => {
  const progress = getProgress()
  
  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      lessonId,
      sectionProgress: {},
      quizResults: {},
      codeAttempts: {},
      lastAccessed: new Date().toISOString(),
      completionPercentage: 0
    }
  }
  
  const lesson = progress.lessons[lessonId]
  lesson.sectionProgress[sectionIndex] = completed
  lesson.lastAccessed = new Date().toISOString()
  
  if (additionalData?.quizResult) {
    lesson.quizResults[sectionIndex] = additionalData.quizResult
  }
  
  if (additionalData?.codeAttempt) {
    lesson.codeAttempts[sectionIndex] = additionalData.codeAttempt
  }
  
  // Calculate completion percentage
  const totalSections = Object.keys(lesson.sectionProgress).length
  const completedSections = Object.values(lesson.sectionProgress).filter(Boolean).length
  lesson.completionPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0
  
  return saveProgress(progress)
}

export const getLessonProgress = (lessonId: string): LessonProgress | null => {
  const progress = getProgress()
  return progress.lessons[lessonId] || null
}

export const updateUserStats = (updates: Partial<StudentProgress['userStats']>) => {
  const progress = getProgress()
  progress.userStats = { ...progress.userStats, ...updates }
  return saveProgress(progress)
}

export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.warn('Failed to clear progress:', error)
    return false
  }
}

export const exportProgress = (): string => {
  return JSON.stringify(getProgress(), null, 2)
}

export const importProgress = (data: string): boolean => {
  try {
    const parsed = JSON.parse(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
    return true
  } catch (error) {
    console.warn('Failed to import progress:', error)
    return false
  }
}