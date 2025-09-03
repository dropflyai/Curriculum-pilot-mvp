// Real-time Progress Tracking System for CodeFly Platform
// Integrates with Supabase for real-time monitoring across teacher/student dashboards

export interface LessonProgress {
  id?: string
  lessonId: string
  studentId: string
  studentName: string
  lessonTitle: string
  startTime: string
  lastActivity: string
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'submitted'
  sectionsCompleted: string[]
  totalSections: number
  currentSection: string
  codeExecutions: number
  quizScore?: number
  quizCompleted: boolean
  timeSpent: number // in minutes
  needsHelp: boolean
  helpRequestedAt?: string
  errors: string[]
  createdAt?: string
  updatedAt?: string
}

export interface StudentActivity {
  id?: string
  studentId: string
  studentName: string
  lessonId: string
  lessonName: string
  action: 'started' | 'section_completed' | 'code_executed' | 'quiz_submitted' | 'completed' | 'needs_help'
  sectionName?: string
  timestamp: string
  details?: any
  createdAt?: string
}

import { createClient } from '@/lib/supabase'

class ProgressTracker {
  private static instance: ProgressTracker
  private supabase = createClient()
  private realtimeChannel: any = null
  private listeners: Set<(data: any) => void> = new Set()
  
  // Cache for performance
  private progressCache: Map<string, LessonProgress> = new Map()
  private activitiesCache: StudentActivity[] = []

  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker()
    }
    return ProgressTracker.instance
  }

  // Initialize real-time subscriptions
  initializeRealtime() {
    if (this.realtimeChannel) {
      return // Already initialized
    }

    try {
      // Subscribe to student progress changes
      this.realtimeChannel = this.supabase
        .channel('progress_tracking')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'student_progress'
          },
          (payload) => this.handleRealtimeUpdate('progress', payload)
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public', 
            table: 'student_activities'
          },
          (payload) => this.handleRealtimeUpdate('activity', payload)
        )
        .subscribe()
    } catch (error) {
      console.error('Failed to initialize realtime subscriptions:', error)
    }
  }

  // Handle real-time database updates
  private handleRealtimeUpdate(type: 'progress' | 'activity', payload: any) {
    // Notify all listeners about the update
    this.listeners.forEach(listener => {
      listener({ type, payload })
    })
    
    // Refresh cache
    if (type === 'progress') {
      this.refreshProgressCache()
    } else {
      this.refreshActivitiesCache()
    }
  }

  // Add listener for real-time updates
  addListener(callback: (data: any) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Initialize progress for a lesson
  async startLesson(studentId: string, studentName: string, lessonId: string, lessonName: string): Promise<void> {
    const now = new Date().toISOString()
    
    const progressData = {
      student_id: studentId,
      lesson_id: lessonId,
      lesson_title: lessonName,
      status: 'in_progress' as const,
      sections_completed: [],
      total_sections: 4, // Learn, Code, Quiz, Submit
      current_section: 'learn',
      started_at: now,
      last_activity: now,
      time_spent_minutes: 0,
      code_executions: 0,
      quiz_completed: false,
      needs_help: false,
      errors: []
    }

    try {
      // Insert or update progress in database
      const { error: progressError } = await this.supabase
        .from('student_progress')
        .upsert(progressData, { 
          onConflict: 'student_id,lesson_id',
          ignoreDuplicates: false
        })
      
      if (progressError) throw progressError

      // Log activity
      await this.logActivity({
        studentId,
        studentName,
        lessonId,
        lessonName,
        action: 'started',
        timestamp: now
      })

      // Update cache
      const progress: LessonProgress = {
        lessonId,
        studentId,
        studentName,
        lessonTitle: lessonName,
        startTime: now,
        lastActivity: now,
        completionStatus: 'in_progress',
        sectionsCompleted: [],
        totalSections: 4,
        currentSection: 'learn',
        codeExecutions: 0,
        quizCompleted: false,
        timeSpent: 0,
        needsHelp: false,
        errors: []
      }
      
      this.progressCache.set(`${studentId}-${lessonId}`, progress)
    } catch (error) {
      console.error('Failed to start lesson:', error)
      // Fallback to localStorage for offline functionality
      this.saveProgressToStorage(studentId, lessonId, {
        lessonId,
        studentId,
        studentName,
        lessonTitle: lessonName,
        startTime: now,
        lastActivity: now,
        completionStatus: 'in_progress',
        sectionsCompleted: [],
        totalSections: 4,
        currentSection: 'learn',
        codeExecutions: 0,
        quizCompleted: false,
        timeSpent: 0,
        needsHelp: false,
        errors: []
      })
    }
  }

  // Update progress when student completes a section
  async completeSection(studentId: string, lessonId: string, sectionName: string): Promise<void> {
    const now = new Date().toISOString()
    
    try {
      // Get current progress
      const { data: currentProgress } = await this.supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single()

      if (!currentProgress) {
        console.error('No progress found for student/lesson')
        return
      }

      // Update sections completed
      const sectionsCompleted = currentProgress.sections_completed || []
      if (!sectionsCompleted.includes(sectionName)) {
        sectionsCompleted.push(sectionName)
      }

      const nextSection = this.getNextSection(sectionName)
      const timeSpent = this.calculateTimeSpentFromStart(currentProgress.started_at)
      const isCompleted = sectionsCompleted.length >= currentProgress.total_sections

      // Update progress in database
      const { error: updateError } = await this.supabase
        .from('student_progress')
        .update({
          sections_completed: sectionsCompleted,
          current_section: isCompleted ? 'completed' : nextSection,
          last_activity: now,
          time_spent_minutes: timeSpent,
          status: isCompleted ? 'completed' : 'in_progress'
        })
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)

      if (updateError) throw updateError

      // Log activity
      await this.logActivity({
        studentId,
        studentName: '', // Will be populated in logActivity
        lessonId,
        lessonName: currentProgress.lesson_title,
        action: isCompleted ? 'completed' : 'section_completed',
        sectionName,
        timestamp: now,
        details: { section: sectionName }
      })

      // Update cache
      this.refreshProgressCache()
    } catch (error) {
      console.error('Failed to complete section:', error)
    }
  }

  // Track code execution
  async executeCode(studentId: string, lessonId: string, codeSuccess: boolean, errors?: string[]): Promise<void> {
    const now = new Date().toISOString()
    
    try {
      // Get current progress
      const { data: currentProgress } = await this.supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single()

      if (!currentProgress) return

      const currentErrors = currentProgress.errors || []
      const newErrors = errors || []
      const allErrors = [...currentErrors, ...newErrors]
      
      // Determine if student needs help (more than 3 errors)
      const needsHelp = allErrors.length > 3

      // Update progress
      const { error: updateError } = await this.supabase
        .from('student_progress')
        .update({
          code_executions: (currentProgress.code_executions || 0) + 1,
          last_activity: now,
          time_spent_minutes: this.calculateTimeSpentFromStart(currentProgress.started_at),
          errors: allErrors,
          needs_help: needsHelp,
          help_requested_at: needsHelp && !currentProgress.needs_help ? now : currentProgress.help_requested_at
        })
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)

      if (updateError) throw updateError

      // Log activity
      await this.logActivity({
        studentId,
        studentName: '',
        lessonId,
        lessonName: currentProgress.lesson_title,
        action: 'code_executed',
        timestamp: now,
        details: { success: codeSuccess, errors: newErrors }
      })

      // Update cache
      this.refreshProgressCache()
    } catch (error) {
      console.error('Failed to track code execution:', error)
    }
  }

  // Track quiz submission
  async submitQuiz(studentId: string, lessonId: string, score: number): Promise<void> {
    const now = new Date().toISOString()
    
    try {
      // Get current progress
      const { data: currentProgress } = await this.supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single()

      if (!currentProgress) return

      // Update sections completed to include quiz
      const sectionsCompleted = currentProgress.sections_completed || []
      if (!sectionsCompleted.includes('quiz')) {
        sectionsCompleted.push('quiz')
      }

      // Update progress
      const { error: updateError } = await this.supabase
        .from('student_progress')
        .update({
          quiz_score: score,
          quiz_completed: true,
          sections_completed: sectionsCompleted,
          last_activity: now,
          time_spent_minutes: this.calculateTimeSpentFromStart(currentProgress.started_at)
        })
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)

      if (updateError) throw updateError

      // Log activity
      await this.logActivity({
        studentId,
        studentName: '',
        lessonId,
        lessonName: currentProgress.lesson_title,
        action: 'quiz_submitted',
        timestamp: now,
        details: { score }
      })

      // Update cache
      this.refreshProgressCache()
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  // Student requests help
  async requestHelp(studentId: string, lessonId: string): Promise<void> {
    const now = new Date().toISOString()
    
    try {
      // Update progress to mark needs help
      const { error: updateError } = await this.supabase
        .from('student_progress')
        .update({
          needs_help: true,
          help_requested_at: now,
          last_activity: now
        })
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)

      if (updateError) throw updateError

      // Get lesson title for activity log
      const { data: progress } = await this.supabase
        .from('student_progress')
        .select('lesson_title')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single()

      // Log activity
      await this.logActivity({
        studentId,
        studentName: '',
        lessonId,
        lessonName: progress?.lesson_title || lessonId,
        action: 'needs_help',
        timestamp: now
      })

      // Update cache
      this.refreshProgressCache()
    } catch (error) {
      console.error('Failed to request help:', error)
    }
  }

  // Get all progress data for teacher dashboard
  async getAllProgress(): Promise<LessonProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .order('last_activity', { ascending: false })

      if (error) throw error

      return data?.map(row => ({
        id: row.id,
        lessonId: row.lesson_id,
        studentId: row.student_id,
        studentName: row.users?.raw_user_meta_data?.full_name || 'Unknown Student',
        lessonTitle: row.lesson_title,
        startTime: row.started_at,
        lastActivity: row.last_activity,
        completionStatus: row.status,
        sectionsCompleted: row.sections_completed || [],
        totalSections: row.total_sections || 4,
        currentSection: row.current_section,
        codeExecutions: row.code_executions || 0,
        quizScore: row.quiz_score,
        quizCompleted: row.quiz_completed || false,
        timeSpent: row.time_spent_minutes || 0,
        needsHelp: row.needs_help || false,
        helpRequestedAt: row.help_requested_at,
        errors: row.errors || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })) || []
    } catch (error) {
      console.error('Failed to get all progress:', error)
      // Fallback to cache or empty array
      return Array.from(this.progressCache.values())
    }
  }

  // Get recent activities for teacher dashboard
  async getRecentActivities(limit: number = 20): Promise<StudentActivity[]> {
    try {
      const { data, error } = await this.supabase
        .from('student_activities')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(row => ({
        id: row.id,
        studentId: row.student_id,
        studentName: row.users?.raw_user_meta_data?.full_name || 'Unknown Student',
        lessonId: row.lesson_id,
        lessonName: row.lesson_title,
        action: row.action,
        sectionName: row.section_name,
        timestamp: row.timestamp,
        details: row.details,
        createdAt: row.created_at
      })) || []
    } catch (error) {
      console.error('Failed to get recent activities:', error)
      return this.activitiesCache.slice(0, limit)
    }
  }

  // Get students who need help
  async getStudentsNeedingHelp(): Promise<LessonProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .eq('needs_help', true)
        .order('help_requested_at', { ascending: true })

      if (error) throw error

      return data?.map(row => ({
        id: row.id,
        lessonId: row.lesson_id,
        studentId: row.student_id,
        studentName: row.users?.raw_user_meta_data?.full_name || 'Unknown Student',
        lessonTitle: row.lesson_title,
        startTime: row.started_at,
        lastActivity: row.last_activity,
        completionStatus: row.status,
        sectionsCompleted: row.sections_completed || [],
        totalSections: row.total_sections || 4,
        currentSection: row.current_section,
        codeExecutions: row.code_executions || 0,
        quizScore: row.quiz_score,
        quizCompleted: row.quiz_completed || false,
        timeSpent: row.time_spent_minutes || 0,
        needsHelp: row.needs_help || false,
        helpRequestedAt: row.help_requested_at,
        errors: row.errors || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })) || []
    } catch (error) {
      console.error('Failed to get students needing help:', error)
      return []
    }
  }

  // Get students who haven't been active recently (stuck)
  async getStuckStudents(minutesThreshold: number = 20): Promise<LessonProgress[]> {
    try {
      const thresholdTime = new Date(Date.now() - minutesThreshold * 60 * 1000).toISOString()
      
      const { data, error } = await this.supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .eq('status', 'in_progress')
        .lt('last_activity', thresholdTime)
        .order('last_activity', { ascending: true })

      if (error) throw error

      return data?.map(row => ({
        id: row.id,
        lessonId: row.lesson_id,
        studentId: row.student_id,
        studentName: row.users?.raw_user_meta_data?.full_name || 'Unknown Student',
        lessonTitle: row.lesson_title,
        startTime: row.started_at,
        lastActivity: row.last_activity,
        completionStatus: row.status,
        sectionsCompleted: row.sections_completed || [],
        totalSections: row.total_sections || 4,
        currentSection: row.current_section,
        codeExecutions: row.code_executions || 0,
        quizScore: row.quiz_score,
        quizCompleted: row.quiz_completed || false,
        timeSpent: row.time_spent_minutes || 0,
        needsHelp: row.needs_help || false,
        helpRequestedAt: row.help_requested_at,
        errors: row.errors || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })) || []
    } catch (error) {
      console.error('Failed to get stuck students:', error)
      return []
    }
  }

  // Private helper methods
  private calculateTimeSpentFromStart(startTime: string): number {
    const start = new Date(startTime)
    const now = new Date()
    return Math.round((now.getTime() - start.getTime()) / (1000 * 60)) // minutes
  }

  private calculateTimeSpent(startTime: string): number {
    return this.calculateTimeSpentFromStart(startTime)
  }

  private getNextSection(currentSection: string): string {
    const sections = ['learn', 'code', 'quiz', 'submit']
    const currentIndex = sections.indexOf(currentSection)
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : 'completed'
  }

  private getLessonName(lessonId: string): string {
    const lessonNames: Record<string, string> = {
      'week-01': 'Binary Shores Academy - AI Classifier',
      'week-02': 'Variable Village - Python Magic 8-Ball',
      'week-03': 'Logic Lake Outpost - Conditionals & Loops',
      'week-04': 'Loop Canyon Base - Advanced Python'
    }
    return lessonNames[lessonId] || lessonId
  }

  private async logActivity(activity: StudentActivity): Promise<void> {
    try {
      // Get student name if not provided
      let studentName = activity.studentName
      if (!studentName) {
        const { data: userData } = await this.supabase.auth.getUser()
        studentName = userData.user?.user_metadata?.full_name || 'Unknown Student'
      }

      const { error } = await this.supabase
        .from('student_activities')
        .insert({
          student_id: activity.studentId,
          lesson_id: activity.lessonId,
          lesson_title: activity.lessonName,
          action: activity.action,
          section_name: activity.sectionName,
          details: activity.details || {},
          timestamp: activity.timestamp
        })

      if (error) throw error

      // Update cache
      this.activitiesCache.unshift({
        ...activity,
        studentName
      })
      // Keep only recent 100 activities in cache
      if (this.activitiesCache.length > 100) {
        this.activitiesCache = this.activitiesCache.slice(0, 100)
      }
    } catch (error) {
      console.error('Failed to log activity:', error)
      // Fallback to cache only
      this.activitiesCache.unshift(activity)
      if (this.activitiesCache.length > 100) {
        this.activitiesCache = this.activitiesCache.slice(0, 100)
      }
    }
  }

  // Cache refresh methods
  private async refreshProgressCache(): Promise<void> {
    try {
      const allProgress = await this.getAllProgress()
      this.progressCache.clear()
      allProgress.forEach(progress => {
        this.progressCache.set(`${progress.studentId}-${progress.lessonId}`, progress)
      })
    } catch (error) {
      console.error('Failed to refresh progress cache:', error)
    }
  }

  private async refreshActivitiesCache(): Promise<void> {
    try {
      this.activitiesCache = await this.getRecentActivities(100)
    } catch (error) {
      console.error('Failed to refresh activities cache:', error)
    }
  }

  // Fallback storage methods for offline functionality
  private saveProgressToStorage(studentId: string, lessonId: string, progress: LessonProgress): void {
    if (typeof window === 'undefined') return
    
    try {
      const key = `offline_progress_${studentId}_${lessonId}`
      localStorage.setItem(key, JSON.stringify(progress))
    } catch (error) {
      console.error('Failed to save progress to storage:', error)
    }
  }

  // Initialize caches from database
  async initializeCaches(): Promise<void> {
    try {
      await Promise.all([
        this.refreshProgressCache(),
        this.refreshActivitiesCache()
      ])
    } catch (error) {
      console.error('Failed to initialize caches:', error)
    }
  }

  // Cleanup method
  cleanup(): void {
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
    this.listeners.clear()
    this.progressCache.clear()
    this.activitiesCache = []
  }
}

// Export singleton instance
export const progressTracker = ProgressTracker.getInstance()

// Initialize real-time subscriptions and caches when module loads
if (typeof window !== 'undefined') {
  progressTracker.initializeRealtime()
  progressTracker.initializeCaches()
}

// Export helper functions for React components
export const useProgressTracking = () => {
  const trackLessonStart = async (studentId: string, studentName: string, lessonId: string, lessonName: string) => {
    await progressTracker.startLesson(studentId, studentName, lessonId, lessonName)
  }

  const trackSectionComplete = async (studentId: string, lessonId: string, section: string) => {
    await progressTracker.completeSection(studentId, lessonId, section)
  }

  const trackCodeExecution = async (studentId: string, lessonId: string, success: boolean, errors?: string[]) => {
    await progressTracker.executeCode(studentId, lessonId, success, errors)
  }

  const trackQuizSubmission = async (studentId: string, lessonId: string, score: number) => {
    await progressTracker.submitQuiz(studentId, lessonId, score)
  }

  const trackHelpRequest = async (studentId: string, lessonId: string) => {
    await progressTracker.requestHelp(studentId, lessonId)
  }

  const addRealtimeListener = (callback: (data: any) => void) => {
    return progressTracker.addListener(callback)
  }

  return {
    trackLessonStart,
    trackSectionComplete,
    trackCodeExecution,
    trackQuizSubmission,
    trackHelpRequest,
    addRealtimeListener
  }
}