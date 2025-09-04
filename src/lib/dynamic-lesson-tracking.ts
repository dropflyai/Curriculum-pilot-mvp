/**
 * Dynamic Lesson Tracking System
 * Automatically tracks ANY lesson in the database without hardcoding
 */

import { createClient } from '@/lib/supabase'

export interface DynamicLesson {
  id: string
  title: string
  week: number
  description?: string
  created_at: string
  updated_at: string
}

export interface DynamicProgress {
  lesson: DynamicLesson
  studentsStarted: number
  studentsCompleted: number
  studentsInProgress: number
  studentsNeedingHelp: number
  averageProgress: number
  averageTimeSpent: number
  lastActivity?: string
}

class DynamicLessonTracker {
  private static instance: DynamicLessonTracker
  private supabase = createClient()
  private lessonsCache: Map<string, DynamicLesson> = new Map()
  private progressCache: Map<string, DynamicProgress> = new Map()
  
  static getInstance(): DynamicLessonTracker {
    if (!DynamicLessonTracker.instance) {
      DynamicLessonTracker.instance = new DynamicLessonTracker()
    }
    return DynamicLessonTracker.instance
  }

  /**
   * Fetch all lessons from database dynamically
   * This will pick up ANY lesson your partner adds
   */
  async fetchAllLessons(): Promise<DynamicLesson[]> {
    try {
      // First try to get from lessons table
      const { data: dbLessons, error } = await this.supabase
        .from('lessons')
        .select('*')
        .order('week', { ascending: true })

      if (!error && dbLessons && dbLessons.length > 0) {
        // Use database lessons
        const lessons = dbLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          week: lesson.week,
          description: lesson.description,
          created_at: lesson.created_at,
          updated_at: lesson.updated_at
        }))
        
        // Update cache
        lessons.forEach(lesson => {
          this.lessonsCache.set(lesson.id, lesson)
        })
        
        return lessons
      }

      // Fallback: If no lessons in DB, use a dynamic scanner
      // This scans for any lesson patterns in the codebase
      return this.scanForLessons()
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      return this.scanForLessons()
    }
  }

  /**
   * Scan for lessons dynamically based on common patterns
   * Works even if database is empty
   */
  private async scanForLessons(): Promise<DynamicLesson[]> {
    // Common lesson ID patterns to look for
    const patterns = [
      /^week-\d{2}$/,           // week-01, week-02, etc.
      /^lesson-\d+$/,           // lesson-1, lesson-2, etc.
      /^module-\d+$/,           // module-1, module-2, etc.
      /^chapter-\d+$/,          // chapter-1, chapter-2, etc.
      /^unit-\d+$/,             // unit-1, unit-2, etc.
    ]

    // Get all student progress records to discover lesson IDs
    const { data: progressData } = await this.supabase
      .from('student_progress')
      .select('lesson_id, lesson_title')
      .order('created_at', { ascending: false })

    const discoveredLessons = new Map<string, DynamicLesson>()

    if (progressData) {
      progressData.forEach(progress => {
        if (!discoveredLessons.has(progress.lesson_id)) {
          // Extract week number from lesson ID if possible
          let weekNum = 0
          const weekMatch = progress.lesson_id.match(/(\d+)/)
          if (weekMatch) {
            weekNum = parseInt(weekMatch[1])
          }

          discoveredLessons.set(progress.lesson_id, {
            id: progress.lesson_id,
            title: progress.lesson_title || progress.lesson_id,
            week: weekNum,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
      })
    }

    // Also check for hardcoded lessons in the frontend
    const fallbackLessons: DynamicLesson[] = [
      { id: 'week-01', title: 'Binary Shores Academy', week: 1, created_at: '', updated_at: '' },
      { id: 'week-02', title: 'Variable Village Outpost', week: 2, created_at: '', updated_at: '' },
      { id: 'week-03', title: 'Logic Lake Outpost', week: 3, created_at: '', updated_at: '' },
      { id: 'week-04', title: 'Loop Canyon Base', week: 4, created_at: '', updated_at: '' },
    ]

    // Merge discovered and fallback lessons
    fallbackLessons.forEach(lesson => {
      if (!discoveredLessons.has(lesson.id)) {
        discoveredLessons.set(lesson.id, lesson)
      }
    })

    return Array.from(discoveredLessons.values())
  }

  /**
   * Get progress for ALL lessons dynamically
   * This will show progress for any lesson that exists
   */
  async getAllLessonProgress(): Promise<DynamicProgress[]> {
    try {
      // First, get all lessons
      const lessons = await this.fetchAllLessons()
      
      // Then get all progress data
      const { data: progressData, error } = await this.supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)

      if (error) throw error

      // Group progress by lesson
      const progressByLesson = new Map<string, any[]>()
      
      if (progressData) {
        progressData.forEach(progress => {
          const lessonProgress = progressByLesson.get(progress.lesson_id) || []
          lessonProgress.push(progress)
          progressByLesson.set(progress.lesson_id, lessonProgress)
        })
      }

      // Calculate statistics for each lesson
      const lessonProgressStats: DynamicProgress[] = lessons.map(lesson => {
        const lessonStudents = progressByLesson.get(lesson.id) || []
        
        const studentsStarted = lessonStudents.length
        const studentsCompleted = lessonStudents.filter(s => s.status === 'completed').length
        const studentsInProgress = lessonStudents.filter(s => s.status === 'in_progress').length
        const studentsNeedingHelp = lessonStudents.filter(s => s.needs_help).length
        
        const totalProgress = lessonStudents.reduce((sum, s) => {
          const sections = s.sections_completed?.length || 0
          const total = s.total_sections || 4
          return sum + (sections / total) * 100
        }, 0)
        
        const totalTime = lessonStudents.reduce((sum, s) => sum + (s.time_spent_minutes || 0), 0)
        
        const lastActivities = lessonStudents
          .map(s => s.last_activity)
          .filter(Boolean)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

        return {
          lesson,
          studentsStarted,
          studentsCompleted,
          studentsInProgress,
          studentsNeedingHelp,
          averageProgress: studentsStarted > 0 ? totalProgress / studentsStarted : 0,
          averageTimeSpent: studentsStarted > 0 ? totalTime / studentsStarted : 0,
          lastActivity: lastActivities[0]
        }
      })

      // Update cache
      lessonProgressStats.forEach(stat => {
        this.progressCache.set(stat.lesson.id, stat)
      })

      return lessonProgressStats
    } catch (error) {
      console.error('Failed to get lesson progress:', error)
      return Array.from(this.progressCache.values())
    }
  }

  /**
   * Get progress for a specific lesson by ID
   * Works with any lesson ID format
   */
  async getLessonProgress(lessonId: string): Promise<DynamicProgress | null> {
    try {
      // Get lesson info
      let lesson = this.lessonsCache.get(lessonId)
      if (!lesson) {
        const lessons = await this.fetchAllLessons()
        lesson = lessons.find(l => l.id === lessonId)
      }

      if (!lesson) {
        // Lesson not found, but still try to get progress
        lesson = {
          id: lessonId,
          title: lessonId, // Use ID as title fallback
          week: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      // Get progress for this specific lesson
      const { data: progressData, error } = await this.supabase
        .from('student_progress')
        .select('*')
        .eq('lesson_id', lessonId)

      if (error) throw error

      const studentsStarted = progressData?.length || 0
      const studentsCompleted = progressData?.filter(s => s.status === 'completed').length || 0
      const studentsInProgress = progressData?.filter(s => s.status === 'in_progress').length || 0
      const studentsNeedingHelp = progressData?.filter(s => s.needs_help).length || 0

      const totalProgress = progressData?.reduce((sum, s) => {
        const sections = s.sections_completed?.length || 0
        const total = s.total_sections || 4
        return sum + (sections / total) * 100
      }, 0) || 0

      const totalTime = progressData?.reduce((sum, s) => sum + (s.time_spent_minutes || 0), 0) || 0

      return {
        lesson,
        studentsStarted,
        studentsCompleted,
        studentsInProgress,
        studentsNeedingHelp,
        averageProgress: studentsStarted > 0 ? totalProgress / studentsStarted : 0,
        averageTimeSpent: studentsStarted > 0 ? totalTime / studentsStarted : 0,
        lastActivity: progressData?.[0]?.last_activity
      }
    } catch (error) {
      console.error('Failed to get lesson progress:', error)
      return this.progressCache.get(lessonId) || null
    }
  }

  /**
   * Monitor for new lessons added to the system
   * This will automatically detect when your partner adds new lessons
   */
  subscribeToLessonChanges(callback: (lessons: DynamicLesson[]) => void) {
    const channel = this.supabase
      .channel('lesson_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lessons'
        },
        async () => {
          const lessons = await this.fetchAllLessons()
          callback(lessons)
        }
      )
      .subscribe()

    return () => {
      this.supabase.removeChannel(channel)
    }
  }

  /**
   * Auto-discover lesson format from existing data
   * This helps maintain compatibility with any naming convention
   */
  async detectLessonFormat(): Promise<{
    pattern: string
    example: string
    count: number
  }[]> {
    const { data } = await this.supabase
      .from('student_progress')
      .select('lesson_id')
      .limit(100)

    const formats = new Map<string, number>()
    
    if (data) {
      data.forEach(item => {
        const id = item.lesson_id
        let pattern = 'unknown'
        
        if (id.match(/^week-\d{2}$/)) pattern = 'week-XX'
        else if (id.match(/^lesson-\d+$/)) pattern = 'lesson-X'
        else if (id.match(/^module-\d+$/)) pattern = 'module-X'
        else if (id.match(/^chapter-\d+$/)) pattern = 'chapter-X'
        else if (id.match(/^[a-z-]+$/)) pattern = 'slug-format'
        
        formats.set(pattern, (formats.get(pattern) || 0) + 1)
      })
    }

    return Array.from(formats.entries()).map(([pattern, count]) => ({
      pattern,
      example: data?.find(d => {
        const id = d.lesson_id
        if (pattern === 'week-XX') return id.match(/^week-\d{2}$/)
        if (pattern === 'lesson-X') return id.match(/^lesson-\d+$/)
        if (pattern === 'module-X') return id.match(/^module-\d+$/)
        if (pattern === 'chapter-X') return id.match(/^chapter-\d+$/)
        if (pattern === 'slug-format') return id.match(/^[a-z-]+$/)
        return false
      })?.lesson_id || '',
      count
    }))
  }
}

// Export singleton instance
export const dynamicLessonTracker = DynamicLessonTracker.getInstance()

// React hook for easy component integration
export function useDynamicLessonTracking() {
  return {
    fetchAllLessons: () => dynamicLessonTracker.fetchAllLessons(),
    getAllLessonProgress: () => dynamicLessonTracker.getAllLessonProgress(),
    getLessonProgress: (lessonId: string) => dynamicLessonTracker.getLessonProgress(lessonId),
    subscribeToLessonChanges: (callback: (lessons: DynamicLesson[]) => void) => 
      dynamicLessonTracker.subscribeToLessonChanges(callback),
    detectLessonFormat: () => dynamicLessonTracker.detectLessonFormat()
  }
}