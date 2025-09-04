// Progress tracking system for Shadow Protocol curriculum
// Integrates with teacher dashboard for real-time monitoring

export interface LessonProgress {
  lessonId: string
  studentId: string
  studentName: string
  startTime: string
  lastActivity: string
  completionStatus: 'not_started' | 'in_progress' | 'completed'
  sectionsCompleted: string[]
  totalSections: number
  codeExecutions: number
  quizScore?: number
  timeSpent: number // in minutes
  needsHelp: boolean
  errors: string[]
  currentSection: string
}

export interface StudentActivity {
  studentId: string
  studentName: string
  lessonId: string
  lessonName: string
  action: 'started' | 'section_completed' | 'code_executed' | 'quiz_submitted' | 'completed' | 'needs_help'
  timestamp: string
  details?: any
}

class ProgressTracker {
  private static instance: ProgressTracker
  private progress: Map<string, LessonProgress> = new Map()
  private activities: StudentActivity[] = []

  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker()
    }
    return ProgressTracker.instance
  }

  // Initialize progress for a lesson
  startLesson(studentId: string, studentName: string, lessonId: string, lessonName: string): void {
    const key = `${studentId}-${lessonId}`
    const now = new Date().toISOString()
    
    const progress: LessonProgress = {
      lessonId,
      studentId,
      studentName,
      startTime: now,
      lastActivity: now,
      completionStatus: 'in_progress',
      sectionsCompleted: [],
      totalSections: 4, // Learn, Code, Quiz, Submit
      codeExecutions: 0,
      timeSpent: 0,
      needsHelp: false,
      errors: [],
      currentSection: 'learn'
    }

    this.progress.set(key, progress)
    
    // Log activity
    this.logActivity({
      studentId,
      studentName,
      lessonId,
      lessonName,
      action: 'started',
      timestamp: now
    })

    // Store in localStorage for persistence
    this.saveToStorage()
  }

  // Update progress when student completes a section
  completeSection(studentId: string, lessonId: string, sectionName: string): void {
    const key = `${studentId}-${lessonId}`
    const progress = this.progress.get(key)
    
    if (progress) {
      if (!progress.sectionsCompleted.includes(sectionName)) {
        progress.sectionsCompleted.push(sectionName)
      }
      progress.lastActivity = new Date().toISOString()
      progress.currentSection = this.getNextSection(sectionName)
      progress.timeSpent = this.calculateTimeSpent(progress.startTime)

      // Check if lesson is completed
      if (progress.sectionsCompleted.length >= progress.totalSections) {
        progress.completionStatus = 'completed'
      }

      this.progress.set(key, progress)
      
      // Log activity
      this.logActivity({
        studentId,
        studentName: progress.studentName,
        lessonId,
        lessonName: this.getLessonName(lessonId),
        action: 'section_completed',
        timestamp: progress.lastActivity,
        details: { section: sectionName }
      })

      this.saveToStorage()
    }
  }

  // Track code execution
  executeCode(studentId: string, lessonId: string, codeSuccess: boolean, errors?: string[]): void {
    const key = `${studentId}-${lessonId}`
    const progress = this.progress.get(key)
    
    if (progress) {
      progress.codeExecutions++
      progress.lastActivity = new Date().toISOString()
      progress.timeSpent = this.calculateTimeSpent(progress.startTime)
      
      if (errors && errors.length > 0) {
        progress.errors = [...progress.errors, ...errors]
        // If student has multiple errors, they might need help
        if (progress.errors.length > 3) {
          progress.needsHelp = true
        }
      }

      this.progress.set(key, progress)
      
      this.logActivity({
        studentId,
        studentName: progress.studentName,
        lessonId,
        lessonName: this.getLessonName(lessonId),
        action: 'code_executed',
        timestamp: progress.lastActivity,
        details: { success: codeSuccess, errors }
      })

      this.saveToStorage()
    }
  }

  // Track quiz submission
  submitQuiz(studentId: string, lessonId: string, score: number): void {
    const key = `${studentId}-${lessonId}`
    const progress = this.progress.get(key)
    
    if (progress) {
      progress.quizScore = score
      progress.lastActivity = new Date().toISOString()
      progress.timeSpent = this.calculateTimeSpent(progress.startTime)
      
      // Mark quiz section as completed
      if (!progress.sectionsCompleted.includes('quiz')) {
        progress.sectionsCompleted.push('quiz')
      }

      this.progress.set(key, progress)
      
      this.logActivity({
        studentId,
        studentName: progress.studentName,
        lessonId,
        lessonName: this.getLessonName(lessonId),
        action: 'quiz_submitted',
        timestamp: progress.lastActivity,
        details: { score }
      })

      this.saveToStorage()
    }
  }

  // Student requests help
  requestHelp(studentId: string, lessonId: string): void {
    const key = `${studentId}-${lessonId}`
    const progress = this.progress.get(key)
    
    if (progress) {
      progress.needsHelp = true
      progress.lastActivity = new Date().toISOString()
      
      this.progress.set(key, progress)
      
      this.logActivity({
        studentId,
        studentName: progress.studentName,
        lessonId,
        lessonName: this.getLessonName(lessonId),
        action: 'needs_help',
        timestamp: progress.lastActivity
      })

      this.saveToStorage()
    }
  }

  // Get all progress data for teacher dashboard
  getAllProgress(): LessonProgress[] {
    return Array.from(this.progress.values())
  }

  // Get recent activities for teacher dashboard
  getRecentActivities(limit: number = 20): StudentActivity[] {
    return this.activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Get students who need help
  getStudentsNeedingHelp(): LessonProgress[] {
    return Array.from(this.progress.values()).filter(p => p.needsHelp)
  }

  // Get students who haven't been active recently (stuck)
  getStuckStudents(minutesThreshold: number = 20): LessonProgress[] {
    const now = new Date()
    return Array.from(this.progress.values()).filter(p => {
      const lastActivity = new Date(p.lastActivity)
      const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60)
      return p.completionStatus === 'in_progress' && minutesSinceActivity > minutesThreshold
    })
  }

  // Private helper methods
  private calculateTimeSpent(startTime: string): number {
    const start = new Date(startTime)
    const now = new Date()
    return Math.round((now.getTime() - start.getTime()) / (1000 * 60)) // minutes
  }

  private getNextSection(currentSection: string): string {
    const sections = ['learn', 'code', 'quiz', 'submit']
    const currentIndex = sections.indexOf(currentSection)
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : 'completed'
  }

  private getLessonName(lessonId: string): string {
    const lessonNames: Record<string, string> = {
      'week-01': 'Operation Beacon',
      'week-02': 'Variable Village Outpost'
    }
    return lessonNames[lessonId] || lessonId
  }

  private logActivity(activity: StudentActivity): void {
    this.activities.push(activity)
    // Keep only recent 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(-100)
    }
  }

  private saveToStorage(): void {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      localStorage.setItem('lesson_progress', JSON.stringify(Array.from(this.progress.entries())))
      localStorage.setItem('lesson_activities', JSON.stringify(this.activities))
    } catch (error) {
      console.error('Failed to save progress to storage:', error)
    }
  }

  // Load from storage (for persistence across page refreshes)
  loadFromStorage(): void {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      const progressData = localStorage.getItem('lesson_progress')
      const activitiesData = localStorage.getItem('lesson_activities')
      
      if (progressData) {
        const entries = JSON.parse(progressData)
        this.progress = new Map(entries)
      }
      
      if (activitiesData) {
        this.activities = JSON.parse(activitiesData)
      }
    } catch (error) {
      console.error('Failed to load progress from storage:', error)
    }
  }
}

// Export singleton instance
export const progressTracker = ProgressTracker.getInstance()

// Initialize from storage when module loads
progressTracker.loadFromStorage()

// Export helper functions for React components
export const useProgressTracking = () => {
  const trackLessonStart = (studentId: string, studentName: string, lessonId: string, lessonName: string) => {
    progressTracker.startLesson(studentId, studentName, lessonId, lessonName)
  }

  const trackSectionComplete = (studentId: string, lessonId: string, section: string) => {
    progressTracker.completeSection(studentId, lessonId, section)
  }

  const trackCodeExecution = (studentId: string, lessonId: string, success: boolean, errors?: string[]) => {
    progressTracker.executeCode(studentId, lessonId, success, errors)
  }

  const trackQuizSubmission = (studentId: string, lessonId: string, score: number) => {
    progressTracker.submitQuiz(studentId, lessonId, score)
  }

  const trackHelpRequest = (studentId: string, lessonId: string) => {
    progressTracker.requestHelp(studentId, lessonId)
  }

  return {
    trackLessonStart,
    trackSectionComplete,
    trackCodeExecution,
    trackQuizSubmission,
    trackHelpRequest
  }
}