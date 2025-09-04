// LocalStorage to Supabase migration utilities
// This file provides drop-in replacements for localStorage calls with Supabase database storage

import { createClient } from './supabase'
import { getCurrentUser } from './auth'

// Safe localStorage wrapper that works during SSR
export class SafeLocalStorage {
  private static isClient = typeof window !== 'undefined'

  static getItem(key: string): string | null {
    if (!this.isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.warn('localStorage.getItem failed:', e)
      return null
    }
  }

  static setItem(key: string, value: string): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn('localStorage.setItem failed:', e)
    }
  }

  static removeItem(key: string): void {
    if (!this.isClient) return
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn('localStorage.removeItem failed:', e)
    }
  }

  static clear(): void {
    if (!this.isClient) return
    try {
      localStorage.clear()
    } catch (e) {
      console.warn('localStorage.clear failed:', e)
    }
  }
}

// Database-backed storage for user-specific data
export class DatabaseStorage {
  private static supabase = createClient()

  // Store lesson progress in database
  static async setLessonProgress(lessonId: string, progress: any): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      SafeLocalStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(progress))
      return
    }

    await this.supabase
      .from('lesson_activities')
      .upsert([{
        user_id: user.id,
        lesson_id: lessonId,
        activity_type: 'general',
        progress: progress,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,lesson_id,activity_type'
      })
  }

  // Get lesson progress from database
  static async getLessonProgress(lessonId: string): Promise<any> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      const stored = SafeLocalStorage.getItem(`lesson-progress-${lessonId}`)
      return stored ? JSON.parse(stored) : null
    }

    const { data } = await this.supabase
      .from('lesson_activities')
      .select('progress')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .eq('activity_type', 'general')
      .single()

    return data?.progress || null
  }

  // Store mission completion status
  static async setMissionCompleted(missionId: string, completed: boolean): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      SafeLocalStorage.setItem(`mission-completed-${missionId}`, completed.toString())
      return
    }

    if (completed) {
      await this.supabase
        .from('mission_progress')
        .upsert([{
          user_id: user.id,
          mission_id: missionId,
          status: 'completed',
          completed_at: new Date().toISOString()
        }], {
          onConflict: 'user_id,mission_id'
        })
    }
  }

  // Get mission completion status
  static async getMissionCompleted(missionId: string): Promise<boolean> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      return SafeLocalStorage.getItem(`mission-completed-${missionId}`) === 'true'
    }

    const { data } = await this.supabase
      .from('mission_progress')
      .select('status')
      .eq('user_id', user.id)
      .eq('mission_id', missionId)
      .single()

    return data?.status === 'completed' || false
  }

  // Store activity completion
  static async setActivityCompleted(activityType: string, activityId: string, completed: boolean): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      SafeLocalStorage.setItem(`${activityType}-completed-${activityId}`, completed.toString())
      return
    }

    await this.supabase
      .from('lesson_activities')
      .upsert([{
        user_id: user.id,
        lesson_id: activityId,
        activity_type: activityType,
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,lesson_id,activity_type'
      })
  }

  // Get activity completion status
  static async getActivityCompleted(activityType: string, activityId: string): Promise<boolean> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      return SafeLocalStorage.getItem(`${activityType}-completed-${activityId}`) === 'true'
    }

    const { data } = await this.supabase
      .from('lesson_activities')
      .select('completed')
      .eq('user_id', user.id)
      .eq('lesson_id', activityId)
      .eq('activity_type', activityType)
      .single()

    return data?.completed || false
  }

  // Store student projects
  static async saveStudentProject(project: any): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      const existing = JSON.parse(SafeLocalStorage.getItem('studentProjects') || '[]')
      existing.push(project)
      SafeLocalStorage.setItem('studentProjects', JSON.stringify(existing))
      return
    }

    await this.supabase
      .from('student_projects')
      .insert([{
        user_id: user.id,
        title: project.title,
        description: project.description,
        code: project.code,
        language: project.language || 'python',
        created_at: new Date().toISOString()
      }])
  }

  // Get student projects
  static async getStudentProjects(): Promise<any[]> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      const stored = SafeLocalStorage.getItem('studentProjects')
      return stored ? JSON.parse(stored) : []
    }

    const { data } = await this.supabase
      .from('student_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return data || []
  }

  // Store capstone project
  static async saveCapstoneProject(project: any): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      SafeLocalStorage.setItem('capstone_project', JSON.stringify(project))
      return
    }

    await this.supabase
      .from('capstone_projects')
      .upsert([{
        user_id: user.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        status: project.status || 'planning',
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id'
      })
  }

  // Get capstone project
  static async getCapstoneProject(): Promise<any> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      const stored = SafeLocalStorage.getItem('capstone_project')
      return stored ? JSON.parse(stored) : null
    }

    const { data } = await this.supabase
      .from('capstone_projects')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return data || null
  }

  // Store homework assignment
  static async saveHomeworkAssignment(assignmentType: string, assignmentId: string, data: any): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      SafeLocalStorage.setItem(`homework-${assignmentType}-${assignmentId}`, JSON.stringify(data))
      return
    }

    await this.supabase
      .from('homework_assignments')
      .upsert([{
        user_id: user.id,
        assignment_type: assignmentType,
        assignment_id: assignmentId,
        score: data.score || 0,
        answers: data.answers || {},
        completed: data.completed || false,
        submitted_at: data.completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,assignment_type,assignment_id'
      })
  }

  // Get homework assignment
  static async getHomeworkAssignment(assignmentType: string, assignmentId: string): Promise<any> {
    const { user } = await getCurrentUser()
    if (!user) {
      // Fallback to localStorage for demo users
      const stored = SafeLocalStorage.getItem(`homework-${assignmentType}-${assignmentId}`)
      return stored ? JSON.parse(stored) : null
    }

    const { data } = await this.supabase
      .from('homework_assignments')
      .select('*')
      .eq('user_id', user.id)
      .eq('assignment_type', assignmentType)
      .eq('assignment_id', assignmentId)
      .single()

    return data || null
  }
}

// Migration utility to move localStorage data to database
export class LocalStorageMigration {
  // Migrate all localStorage data for the current user to database
  static async migrateUserData(): Promise<void> {
    const { user } = await getCurrentUser()
    if (!user) return // Only migrate for authenticated users

    // Migrate lesson progress
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue

      const value = localStorage.getItem(key)
      if (!value) continue

      try {
        // Migrate lesson progress
        if (key.startsWith('lesson-progress-')) {
          const lessonId = key.replace('lesson-progress-', '')
          const progress = JSON.parse(value)
          await DatabaseStorage.setLessonProgress(lessonId, progress)
        }

        // Migrate activity completions
        if (key.includes('-completed-')) {
          const parts = key.split('-completed-')
          if (parts.length === 2) {
            const [activityType, activityId] = parts
            const completed = value === 'true'
            await DatabaseStorage.setActivityCompleted(activityType, activityId, completed)
          }
        }

        // Migrate student projects
        if (key === 'studentProjects') {
          const projects = JSON.parse(value)
          for (const project of projects) {
            await DatabaseStorage.saveStudentProject(project)
          }
        }

        // Migrate capstone project
        if (key === 'capstone_project') {
          const project = JSON.parse(value)
          await DatabaseStorage.saveCapstoneProject(project)
        }

        // Migrate homework assignments
        if (key.startsWith('homework-')) {
          const parts = key.replace('homework-', '').split('-')
          if (parts.length >= 2) {
            const assignmentType = parts[0]
            const assignmentId = parts.slice(1).join('-')
            const data = JSON.parse(value)
            await DatabaseStorage.saveHomeworkAssignment(assignmentType, assignmentId, data)
          }
        }
      } catch (e) {
        console.warn(`Failed to migrate ${key}:`, e)
      }
    }

    console.log('LocalStorage data migration completed')
  }
}

// Drop-in localStorage replacement functions
export const migratedLocalStorage = {
  getItem: SafeLocalStorage.getItem.bind(SafeLocalStorage),
  setItem: SafeLocalStorage.setItem.bind(SafeLocalStorage),
  removeItem: SafeLocalStorage.removeItem.bind(SafeLocalStorage),
  clear: SafeLocalStorage.clear.bind(SafeLocalStorage),
  
  // Enhanced methods that use database when possible
  async setLessonProgress(lessonId: string, progress: any) {
    await DatabaseStorage.setLessonProgress(lessonId, progress)
  },
  
  async getLessonProgress(lessonId: string) {
    return await DatabaseStorage.getLessonProgress(lessonId)
  },
  
  async setActivityCompleted(activityType: string, activityId: string, completed: boolean) {
    await DatabaseStorage.setActivityCompleted(activityType, activityId, completed)
  },
  
  async getActivityCompleted(activityType: string, activityId: string) {
    return await DatabaseStorage.getActivityCompleted(activityType, activityId)
  }
}