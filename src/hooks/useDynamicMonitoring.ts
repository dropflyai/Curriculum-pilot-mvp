'use client'

import { useState, useEffect, useCallback } from 'react'
import { dynamicLessonTracker, type DynamicLesson, type DynamicProgress } from '@/lib/dynamic-lesson-tracking'
import { createClient } from '@/lib/supabase'

export interface DynamicMonitoringData {
  // All lessons found in the system
  lessons: DynamicLesson[]
  
  // Progress for each lesson
  lessonProgress: DynamicProgress[]
  
  // Real-time student data
  activeStudents: any[]
  studentsNeedingHelp: any[]
  recentActivities: any[]
  
  // System status
  isLoading: boolean
  isConnected: boolean
  lastUpdated: Date | null
  lessonFormat: string // e.g., "week-XX", "lesson-X"
}

/**
 * Dynamic monitoring hook that adapts to ANY lesson structure
 * No hardcoding required - works with whatever lessons exist
 */
export function useDynamicMonitoring() {
  const supabase = createClient()
  
  const [data, setData] = useState<DynamicMonitoringData>({
    lessons: [],
    lessonProgress: [],
    activeStudents: [],
    studentsNeedingHelp: [],
    recentActivities: [],
    isLoading: true,
    isConnected: false,
    lastUpdated: null,
    lessonFormat: 'unknown'
  })

  // Fetch all dynamic data
  const fetchAllData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true }))

      // 1. Discover all lessons dynamically
      const lessons = await dynamicLessonTracker.fetchAllLessons()
      
      // 2. Get progress for all discovered lessons
      const lessonProgress = await dynamicLessonTracker.getAllLessonProgress()
      
      // 3. Detect the lesson naming format being used
      const formats = await dynamicLessonTracker.detectLessonFormat()
      const primaryFormat = formats.sort((a, b) => b.count - a.count)[0]?.pattern || 'unknown'
      
      // 4. Get active students (any student with activity in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const { data: activeStudentsData } = await supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .gte('last_activity', fiveMinutesAgo)
        .order('last_activity', { ascending: false })
      
      // 5. Get students needing help
      const { data: needingHelpData } = await supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .or('needs_help.eq.true,and(status.eq.in_progress,last_activity.lt.' + 
            new Date(Date.now() - 20 * 60 * 1000).toISOString() + ')')
        .order('last_activity', { ascending: true })
      
      // 6. Get recent activities
      const { data: activitiesData } = await supabase
        .from('student_activities')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .order('timestamp', { ascending: false })
        .limit(50)

      // Update state with all fetched data
      setData({
        lessons,
        lessonProgress,
        activeStudents: activeStudentsData || [],
        studentsNeedingHelp: needingHelpData || [],
        recentActivities: activitiesData || [],
        isLoading: false,
        isConnected: true,
        lastUpdated: new Date(),
        lessonFormat: primaryFormat
      })
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
      setData(prev => ({
        ...prev,
        isLoading: false,
        isConnected: false
      }))
    }
  }, [supabase])

  // Set up real-time subscriptions for all relevant tables
  useEffect(() => {
    // Initial fetch
    fetchAllData()

    // Subscribe to real-time changes
    const subscriptions: any[] = []

    // 1. Subscribe to lesson changes (in case partner adds new lessons)
    const unsubscribeLessons = dynamicLessonTracker.subscribeToLessonChanges((lessons) => {
      setData(prev => ({ ...prev, lessons }))
      // Refetch progress when lessons change
      fetchAllData()
    })
    subscriptions.push(unsubscribeLessons)

    // 2. Subscribe to student progress changes
    const progressChannel = supabase
      .channel('student_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_progress'
        },
        () => {
          // Refresh all data when progress changes
          fetchAllData()
        }
      )
      .subscribe()

    // 3. Subscribe to student activities
    const activitiesChannel = supabase
      .channel('student_activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_activities'
        },
        (payload) => {
          // Add new activity to the top of the list
          setData(prev => ({
            ...prev,
            recentActivities: [payload.new, ...prev.recentActivities].slice(0, 50)
          }))
        }
      )
      .subscribe()

    // 4. Set up periodic refresh as backup (every 30 seconds)
    const interval = setInterval(fetchAllData, 30000)

    // Cleanup
    return () => {
      subscriptions.forEach(unsub => unsub())
      supabase.removeChannel(progressChannel)
      supabase.removeChannel(activitiesChannel)
      clearInterval(interval)
    }
  }, [fetchAllData, supabase])

  // Helper functions
  const getStudentsForLesson = useCallback((lessonId: string) => {
    return data.activeStudents.filter(student => student.lesson_id === lessonId)
  }, [data.activeStudents])

  const getLessonStats = useCallback((lessonId: string) => {
    return data.lessonProgress.find(lp => lp.lesson.id === lessonId)
  }, [data.lessonProgress])

  const refreshData = useCallback(async () => {
    await fetchAllData()
  }, [fetchAllData])

  return {
    ...data,
    getStudentsForLesson,
    getLessonStats,
    refreshData
  }
}

/**
 * Hook to monitor a specific lesson dynamically
 */
export function useLessonMonitoring(lessonId: string) {
  const [lessonData, setLessonData] = useState<{
    progress: DynamicProgress | null
    students: any[]
    activities: any[]
    isLoading: boolean
  }>({
    progress: null,
    students: [],
    activities: [],
    isLoading: true
  })

  const supabase = createClient()

  const fetchLessonData = useCallback(async () => {
    if (!lessonId) return

    try {
      setLessonData(prev => ({ ...prev, isLoading: true }))

      // Get lesson progress
      const progress = await dynamicLessonTracker.getLessonProgress(lessonId)

      // Get students for this lesson
      const { data: students } = await supabase
        .from('student_progress')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .eq('lesson_id', lessonId)
        .order('last_activity', { ascending: false })

      // Get activities for this lesson
      const { data: activities } = await supabase
        .from('student_activities')
        .select(`
          *,
          users:student_id (raw_user_meta_data)
        `)
        .eq('lesson_id', lessonId)
        .order('timestamp', { ascending: false })
        .limit(20)

      setLessonData({
        progress,
        students: students || [],
        activities: activities || [],
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to fetch lesson data:', error)
      setLessonData(prev => ({ ...prev, isLoading: false }))
    }
  }, [lessonId, supabase])

  useEffect(() => {
    if (lessonId) {
      fetchLessonData()

      // Set up real-time subscription for this specific lesson
      const channel = supabase
        .channel(`lesson_${lessonId}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'student_progress',
            filter: `lesson_id=eq.${lessonId}`
          },
          () => {
            fetchLessonData()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [lessonId, fetchLessonData, supabase])

  return lessonData
}