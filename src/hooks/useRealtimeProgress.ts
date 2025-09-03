'use client'

import { useState, useEffect, useCallback } from 'react'
import { progressTracker, type LessonProgress, type StudentActivity } from '@/lib/progress-tracking'

export interface RealtimeProgressData {
  allProgress: LessonProgress[]
  recentActivities: StudentActivity[]
  studentsNeedingHelp: LessonProgress[]
  stuckStudents: LessonProgress[]
  isLoading: boolean
  isConnected: boolean
  lastUpdated: Date | null
}

export interface RealtimeProgressActions {
  refreshData: () => Promise<void>
  markHelpProvided: (studentId: string, lessonId: string) => Promise<void>
}

export function useRealtimeProgress(): RealtimeProgressData & RealtimeProgressActions {
  const [data, setData] = useState<RealtimeProgressData>({
    allProgress: [],
    recentActivities: [],
    studentsNeedingHelp: [],
    stuckStudents: [],
    isLoading: true,
    isConnected: false,
    lastUpdated: null
  })

  const refreshData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true }))
      
      const [
        allProgress,
        recentActivities,
        studentsNeedingHelp,
        stuckStudents
      ] = await Promise.all([
        progressTracker.getAllProgress(),
        progressTracker.getRecentActivities(20),
        progressTracker.getStudentsNeedingHelp(),
        progressTracker.getStuckStudents(20)
      ])

      setData({
        allProgress,
        recentActivities,
        studentsNeedingHelp,
        stuckStudents,
        isLoading: false,
        isConnected: true,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Failed to refresh progress data:', error)
      setData(prev => ({ 
        ...prev, 
        isLoading: false, 
        isConnected: false 
      }))
    }
  }, [])

  const markHelpProvided = useCallback(async (studentId: string, lessonId: string) => {
    try {
      // This would update the database to mark that help was provided
      // For now, we'll just refresh the data
      await refreshData()
    } catch (error) {
      console.error('Failed to mark help provided:', error)
    }
  }, [refreshData])

  useEffect(() => {
    // Initial data load
    refreshData()

    // Set up real-time listener
    const unsubscribe = progressTracker.addListener((updateData) => {
      console.log('Real-time update received:', updateData)
      // Refresh data when real-time updates are received
      refreshData()
    })

    // Set up periodic refresh as fallback
    const interval = setInterval(refreshData, 30000) // Every 30 seconds

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [refreshData])

  return {
    ...data,
    refreshData,
    markHelpProvided
  }
}

// Hook specifically for student dashboard
export function useStudentProgress(studentId: string) {
  const [studentProgress, setStudentProgress] = useState<LessonProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refreshStudentProgress = useCallback(async () => {
    if (!studentId) return

    try {
      setIsLoading(true)
      const allProgress = await progressTracker.getAllProgress()
      const studentData = allProgress.filter(p => p.studentId === studentId)
      
      setStudentProgress(studentData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to refresh student progress:', error)
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    if (!studentId) return

    // Initial load
    refreshStudentProgress()

    // Set up real-time listener
    const unsubscribe = progressTracker.addListener((updateData) => {
      // Only refresh if the update is for this student
      if (updateData.payload?.new?.student_id === studentId || 
          updateData.payload?.old?.student_id === studentId) {
        refreshStudentProgress()
      }
    })

    return unsubscribe
  }, [studentId, refreshStudentProgress])

  return {
    progress: studentProgress,
    isLoading,
    lastUpdated,
    refreshProgress: refreshStudentProgress
  }
}

// Hook for AI conversation monitoring
export function useAIConversationMonitoring() {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshConversations = useCallback(async () => {
    // This would fetch AI conversation data from Supabase
    // For now, returning empty array as AI conversations need separate implementation
    setConversations([])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshConversations()
    
    // Set up real-time listener for AI conversations
    const interval = setInterval(refreshConversations, 15000) // Every 15 seconds
    
    return () => clearInterval(interval)
  }, [refreshConversations])

  return {
    conversations,
    isLoading,
    refreshConversations
  }
}