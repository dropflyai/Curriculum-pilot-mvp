// Progress tracking utilities for lesson completion
export interface LessonProgress {
  id: string
  progress: number // 0-100
  score: number // 0-100
  completedSections: string[]
  lastUpdated: number
}

// Get progress for a specific lesson
export function getLessonProgress(lessonId: string): LessonProgress {
  try {
    const stored = localStorage.getItem(`lesson-progress-${lessonId}`)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        id: lessonId,
        progress: data.progress || 0,
        score: data.score || 0,
        completedSections: data.completedSections || [],
        lastUpdated: data.lastUpdated || Date.now()
      }
    }
  } catch (error) {
    console.error('Error loading lesson progress:', error)
  }
  
  return {
    id: lessonId,
    progress: 0,
    score: 0,
    completedSections: [],
    lastUpdated: Date.now()
  }
}

// Update progress for a specific lesson
export function updateLessonProgress(lessonId: string, progress: number, score?: number, completedSections?: string[]) {
  try {
    const current = getLessonProgress(lessonId)
    const updated: LessonProgress = {
      ...current,
      progress: Math.max(current.progress, progress), // Never go backwards in progress
      score: score !== undefined ? Math.max(current.score, score) : current.score,
      completedSections: completedSections || current.completedSections,
      lastUpdated: Date.now()
    }
    
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(updated))
    
    // Trigger a custom event to notify dashboard of progress change
    window.dispatchEvent(new CustomEvent('lessonProgressUpdate', { 
      detail: { lessonId, progress: updated.progress, score: updated.score }
    }))
    
    return updated
  } catch (error) {
    console.error('Error saving lesson progress:', error)
    return getLessonProgress(lessonId)
  }
}

// Get all lesson progress data
export function getAllLessonProgress(): Record<string, LessonProgress> {
  const allLessons = [
    'week-01', 'week-02', 'python-basics-variables', 'python-magic-8-ball', 
    'python-functions', 'python-lists-loops', 'python-file-handling'
  ]
  
  const progressData: Record<string, LessonProgress> = {}
  
  allLessons.forEach(lessonId => {
    progressData[lessonId] = getLessonProgress(lessonId)
  })
  
  return progressData
}

// Mark lesson as fully completed
export function markLessonComplete(lessonId: string, finalScore?: number) {
  return updateLessonProgress(lessonId, 100, finalScore, ['all'])
}

// Get completion status for week-02 specifically
export function getWeek02CompletionStatus() {
  const knowledgeQuestCompleted = localStorage.getItem('knowledge-quest-completed-week-02') === 'true'
  const pythonConceptsCompleted = localStorage.getItem('python-lab-completed-week-02') === 'true' 
  const aiAdvisorLabCompleted = localStorage.getItem('ai-advisor-lab-completed-week-02') === 'true'
  const quizData = localStorage.getItem('lesson-progress-week-02')
  
  let quizCompleted = false
  let quizScore = 0
  
  if (quizData) {
    try {
      const data = JSON.parse(quizData)
      quizCompleted = data.quizState?.submitted || false
      quizScore = data.quizState?.score || 0
    } catch (error) {
      console.error('Error parsing quiz data:', error)
    }
  }
  
  // Calculate overall progress based on mission completion
  let progress = 0
  if (knowledgeQuestCompleted) progress += 25
  if (pythonConceptsCompleted) progress += 25  
  if (aiAdvisorLabCompleted) progress += 25
  if (quizCompleted) progress += 25
  
  return {
    progress,
    score: quizScore,
    knowledgeQuestCompleted,
    pythonConceptsCompleted,
    aiAdvisorLabCompleted,
    quizCompleted,
    isFullyComplete: progress >= 100
  }
}