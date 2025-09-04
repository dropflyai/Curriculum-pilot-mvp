'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User, Lesson, Progress } from '@/lib/supabase'
import { 
  Users, Download, Settings, 
  AlertTriangle, Code, Play, Trophy, Filter, Search,
  Eye, MessageSquare, BarChart3, Zap,
  Timer, Star, Lightbulb, Send, Bell, Volume2,
  BookOpen, CheckCircle, XCircle, Edit3, Award,
  FileText, PieChart, TrendingUp, Calendar, Printer,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import TeacherPlaybook from '@/components/TeacherPlaybook'
import { getMockTeacherData } from '@/lib/mock-teacher-data'
import { progressTracker, type LessonProgress, type StudentActivity } from '@/lib/progress-tracking'
import { useRealtimeProgress } from '@/hooks/useRealtimeProgress'
import { useDynamicMonitoring } from '@/hooks/useDynamicMonitoring'
import { getAllLessons } from '@/lib/lesson-data'

interface StudentProgress {
  user: User
  progress: Progress[]
  currentActivity?: {
    lessonId: string
    sectionType: string
    timeSpent: number
    lastSeen: string
  }
  codeSubmissions?: Array<{
    lessonId: string
    code: string
    result: 'success' | 'error'
    timestamp: string
    errorMessage?: string
  }>
  quizResults?: Array<{
    lessonId: string
    score: number
    totalQuestions: number
    timeSpent: number
    timestamp: string
  }>
}

interface LessonAnalytics {
  lessonId: string
  title: string
  avgTimeSpent: number
  completionRate: number
  strugglingStudents: number
  commonErrors: string[]
  quizPerformance: {
    avgScore: number
    hardestQuestion: string
  }
}

interface PredictiveAnalytics {
  riskStudents: {
    student: StudentProgress
    riskLevel: 'high' | 'medium' | 'low'
    riskFactors: string[]
    interventionSuggestions: string[]
  }[]
  classInsights: {
    engagementTrend: 'increasing' | 'stable' | 'decreasing'
    performanceTrend: 'improving' | 'stable' | 'declining'
    recommendedPacing: 'accelerate' | 'maintain' | 'slow-down'
    nextWeekPrediction: string
  }
  learningPatterns: {
    peakHours: string[]
    strugglingConcepts: string[]
    successfulStrategies: string[]
  }
}

type FilterType = 'all' | 'active' | 'completed' | 'needs-help' | 'stuck'

export default function TeacherDashboard() {
  const { user, isAuthenticated, loading: authLoading, isTeacher } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [analytics, setAnalytics] = useState<LessonAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Real-time progress data from custom hook
  const {
    allProgress: liveProgress,
    recentActivities,
    studentsNeedingHelp,
    stuckStudents,
    isLoading: progressLoading,
    isConnected: realtimeConnected,
    lastUpdated,
    refreshData: refreshProgressData,
    markHelpProvided
  } = useRealtimeProgress()
  
  // Dynamic monitoring that adapts to any lesson structure
  const {
    lessons: dynamicLessons,
    lessonProgress: dynamicLessonProgress,
    activeStudents: dynamicActiveStudents,
    studentsNeedingHelp: dynamicStudentsNeedingHelp,
    recentActivities: dynamicRecentActivities,
    lessonFormat,
    refreshData: refreshDynamicData
  } = useDynamicMonitoring()
  
  // Communication System States
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState<StudentProgress | null>(null)
  const [messageText, setMessageText] = useState('')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')

  // Authentication check - temporarily disabled for demo mode
  useEffect(() => {
    // Check for demo authentication first
    const demoUser = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
    const isDemoAuth = typeof window !== 'undefined' ? localStorage.getItem('demo_authenticated') : null
    
    if (demoUser && isDemoAuth === 'true') {
      const user = JSON.parse(demoUser)
      if (user.role === 'teacher') {
        // Demo teacher is authenticated, allow access
        return
      }
    }
    
    // Only redirect if not demo auth and not properly authenticated
    if (!authLoading && (!isAuthenticated || !isTeacher) && (!demoUser || isDemoAuth !== 'true')) {
      router.push('/auth?role=teacher')
    }
  }, [authLoading, isAuthenticated, isTeacher, router])

  // Convert live progress to student progress format for existing components
  useEffect(() => {
    if (liveProgress.length > 0) {
      const convertedStudents: StudentProgress[] = liveProgress.map(progress => ({
        user: {
          id: progress.studentId,
          email: `${progress.studentName.toLowerCase().replace(' ', '.')}@demo.com`,
          full_name: progress.studentName,
          role: 'student' as const,
          created_at: progress.createdAt || new Date().toISOString(),
          updated_at: progress.updatedAt || new Date().toISOString()
        },
        progress: [{
          id: progress.id || '',
          user_id: progress.studentId,
          lesson_id: progress.lessonId,
          status: progress.completionStatus,
          submitted_code: '',
          quiz_answers: progress.quizScore ? { score: progress.quizScore } : {},
          checklist_completed: progress.sectionsCompleted.map(() => true),
          submit_response: '',
          teacher_feedback: '',
          score: progress.quizScore ? Math.round(progress.quizScore * 100) : undefined,
          started_at: progress.startTime,
          submitted_at: progress.completionStatus === 'completed' ? progress.lastActivity : undefined,
          completed_at: progress.completionStatus === 'completed' ? progress.lastActivity : undefined,
          created_at: progress.createdAt || new Date().toISOString(),
          updated_at: progress.updatedAt || new Date().toISOString()
        }],
        currentActivity: {
          lessonId: progress.lessonId,
          sectionType: progress.currentSection,
          timeSpent: progress.timeSpent,
          lastSeen: progress.lastActivity
        },
        codeSubmissions: progress.errors.map((error, index) => ({
          lessonId: progress.lessonId,
          code: '',
          result: 'error' as const,
          timestamp: progress.lastActivity,
          errorMessage: error
        })),
        quizResults: progress.quizScore ? [{
          lessonId: progress.lessonId,
          score: Math.round(progress.quizScore * 100),
          totalQuestions: 10,
          timeSpent: progress.timeSpent,
          timestamp: progress.lastActivity
        }] : []
      }))
      
      setStudents(convertedStudents)
    }
  }, [liveProgress])

  const [messageSending, setMessageSending] = useState(false)
  
  // Grade Book States
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [gradingStudent, setGradingStudent] = useState<StudentProgress | null>(null)
  const [showGradeBook, setShowGradeBook] = useState(false)
  const [gradeBookView, setGradeBookView] = useState<'overview' | 'detailed'>('overview')
  
  // Reporting System States
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportType, setReportType] = useState<'class-summary' | 'individual-student' | 'parent-report'>('class-summary')
  const [selectedReportStudent, setSelectedReportStudent] = useState<StudentProgress | null>(null)
  const [reportGenerating, setReportGenerating] = useState(false)
  
  // Enhanced Analytics States
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [analyticsView, setAnalyticsView] = useState<'risk-assessment' | 'insights' | 'patterns'>('risk-assessment')
  
  const supabase = createClient()

  // Real-time data fetching
  const fetchData = useCallback(async () => {
    try {
      // Fetch students with enhanced data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')

      if (usersError) throw usersError

      // Force use of Black Cipher lessons from getAllLessons() instead of database
      // This ensures teacher dashboard shows current Black Cipher curriculum
      const realLessons = getAllLessons()
      const lessonsData = realLessons.map((lesson, index) => ({
        id: lesson.id,
        week: index + 1,
        title: lesson.title,
        duration_minutes: 60,
        unlock_rule: 'available' as const,
        objectives: [],
        standards: lesson.standards || [],
        learn_md: '',
        starter_code: '',
        tests_py: '',
        patterns: {},
        quiz_items: [],
        checklist: [],
        submit_prompt: '',
        rubric: {},
        badges_on_complete: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      // Fetch all progress with detailed information
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select(`
          *,
          lesson:lessons(id, title, week),
          user:users(id, full_name, email)
        `)

      if (progressError) throw progressError

      // Process enhanced student data
      const studentsWithProgress = (usersData || []).map((user: any) => {
        const userProgress = (progressData || []).filter((p: any) => p.user_id === user.id)
        
        // Calculate current activity based on real data
        let currentActivity = undefined
        if (userProgress.length > 0) {
          // Get the most recently updated progress record
          const latestProgress = userProgress.reduce((latest: any, current: any) => 
            new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
          )

          // Determine activity based on progress status and timing
          const lastUpdate = new Date(latestProgress.updated_at)
          const timeSinceUpdate = (Date.now() - lastUpdate.getTime()) / 60000 // minutes

          // Only show as active if updated within last 2 hours and not completed
          if (timeSinceUpdate < 120 && latestProgress.status !== 'completed') {
            // Calculate time spent based on when they started vs last update
            const startTime = new Date(latestProgress.started_at || latestProgress.created_at)
            const timeSpentMinutes = Math.max(1, (lastUpdate.getTime() - startTime.getTime()) / 60000)

            // Determine section type based on progress status
            let sectionType = 'content'
            if (latestProgress.submitted_code) {
              sectionType = 'code'
            } else if (latestProgress.quiz_answers && Object.keys(latestProgress.quiz_answers).length > 0) {
              sectionType = 'quiz'
            }

            currentActivity = {
              lessonId: latestProgress.lesson_id,
              sectionType,
              timeSpent: Math.round(timeSpentMinutes),
              lastSeen: latestProgress.updated_at
            }
          }
        }

        // Extract real code submissions from progress data
        const codeSubmissions = userProgress
          .filter((p: any) => p.submitted_code)
          .map((p: any) => ({
            lessonId: p.lesson_id,
            code: p.submitted_code || '',
            result: (p.score && p.score > 0.7 ? 'success' : 'error') as 'success' | 'error',
            timestamp: p.submitted_at || p.updated_at,
            errorMessage: p.score && p.score < 0.3 ? 'Code execution failed - check syntax' : undefined
          }))

        // Extract real quiz results from progress data
        const quizResults = userProgress
          .filter((p: any) => p.quiz_answers && Object.keys(p.quiz_answers).length > 0)
          .map((p: any) => {
            const answers = p.quiz_answers as Record<string, { correct?: boolean }>
            const totalQuestions = Object.keys(answers).length
            const correctAnswers = Object.values(answers).filter((answer: any) => answer.correct).length
            
            // Calculate time spent from progress timing
            const startTime = p.started_at ? new Date(p.started_at) : new Date(p.created_at)
            const endTime = new Date(p.updated_at)
            const timeSpentMinutes = Math.max(3, Math.round((endTime.getTime() - startTime.getTime()) / 60000))
            
            return {
              lessonId: p.lesson_id,
              score: correctAnswers,
              totalQuestions,
              timeSpent: timeSpentMinutes,
              timestamp: p.updated_at
            }
          })

        return {
          user,
          progress: userProgress,
          currentActivity,
          codeSubmissions,
          quizResults
        }
      })

      setStudents(studentsWithProgress)
      setLessons(lessonsData || [])

      // Calculate lesson analytics from real data
      const lessonAnalytics = (lessonsData || []).map((lesson: any) => {
        const lessonProgress = studentsWithProgress.flatMap((s: any) => 
          s.progress.filter((p: any) => p.lesson_id === lesson.id)
        )
        const completedCount = lessonProgress.filter((p: any) => p.status === 'completed').length
        const strugglingCount = studentsWithProgress.filter((s: any) => 
          s.currentActivity?.lessonId === lesson.id && s.currentActivity && s.currentActivity.timeSpent > 25
        ).length

        // Calculate average time spent from real data
        const timesSpent = lessonProgress
          .map((p: any) => {
            if (p.started_at && p.completed_at) {
              return (new Date(p.completed_at).getTime() - new Date(p.started_at).getTime()) / 60000
            }
            return null
          })
          .filter((t: any) => t !== null)
        
        const avgTimeSpent = timesSpent.length > 0 
          ? Math.round(timesSpent.reduce((sum: any, time: any) => sum + time, 0) / timesSpent.length)
          : 30 // Default estimate

        // Extract common errors from code submissions
        const allCodeSubmissions = studentsWithProgress.flatMap((s: any) => s.codeSubmissions || [])
        const errorMessages = allCodeSubmissions
          .filter((sub: any) => sub.result === 'error' && sub.errorMessage)
          .map((sub: any) => sub.errorMessage!)
        
        const commonErrors = errorMessages.length > 0 
          ? [...new Set(errorMessages)].slice(0, 3)
          : ['No errors recorded yet']

        // Calculate quiz performance from real data
        const allQuizResults = studentsWithProgress.flatMap((s: any) => s.quizResults || [])
        const lessonQuizResults = allQuizResults.filter((quiz: any) => quiz.lessonId === lesson.id)
        
        const avgScore = lessonQuizResults.length > 0
          ? lessonQuizResults.reduce((sum: number, quiz: any) => sum + (quiz.score / quiz.totalQuestions), 0) / lessonQuizResults.length
          : 0

        return {
          lessonId: lesson.id,
          title: lesson.title,
          avgTimeSpent,
          completionRate: studentsWithProgress.length > 0 ? (completedCount / studentsWithProgress.length) * 100 : 0,
          strugglingStudents: strugglingCount,
          commonErrors,
          quizPerformance: {
            avgScore: Math.round(avgScore * 100) / 100,
            hardestQuestion: lessonQuizResults.length > 0 ? 'Based on quiz data' : 'No quiz data yet'
          }
        }
      })

      setAnalytics(lessonAnalytics)
      
      // Generate predictive analytics
      const predictiveData = generatePredictiveAnalytics(studentsWithProgress)
      setPredictiveAnalytics(predictiveData)
    } catch (error) {
      // Silently fall back to mock data when Supabase is not configured
      // console.log('Using mock data for teacher dashboard')
      // Use mock data when Supabase is not configured
      const mockData = getMockTeacherData()
      
      // Transform mock data to match expected format
      const mockStudentsWithProgress = mockData.students.map((student: any) => ({
        user: {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          role: 'student' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        progress: [{
          id: `progress-${student.id}`,
          user_id: student.id,
          lesson_id: 'lesson-1',
          status: student.completedLessons > 0 ? 'completed' : 'in_progress',
          score: student.averageScore,
          started_at: new Date(Date.now() - student.timeSpent * 60000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          checklist_completed: []
        }],
        currentActivity: {
          lessonId: 'lesson-1',
          sectionType: 'code',
          timeSpent: student.timeSpent,
          lastSeen: new Date().toISOString()
        },
        codeSubmissions: [],
        quizResults: student.completedLessons > 0 ? [{
          lessonId: 'lesson-1',
          score: student.averageScore,
          totalQuestions: 100,
          timeSpent: student.timeSpent,
          timestamp: new Date().toISOString()
        }] : []
      }))
      
      setStudents(mockStudentsWithProgress)
      
      // Get real lessons from Black Cipher curriculum
      const realLessons = getAllLessons()
      const formattedLessons = realLessons.map((lesson, index) => ({
        id: lesson.id,
        week: index + 1,
        title: lesson.title,
        duration_minutes: 60,
        unlock_rule: 'available' as const,
        objectives: [],
        standards: lesson.standards || [],
        learn_md: '',
        starter_code: '',
        tests_py: '',
        patterns: {},
        quiz_items: [],
        checklist: [],
        submit_prompt: '',
        rubric: {},
        badges_on_complete: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      setLessons(formattedLessons)
      
      // Set analytics with real lesson data
      setAnalytics(realLessons.slice(0, 2).map((lesson: any, index: number) => ({
        lessonId: lesson.id,
        title: lesson.title,
        avgTimeSpent: 45 + index * 10, // Simulated data
        completionRate: index === 0 ? 40 : 20, // Simulated data
        strugglingStudents: index === 0 ? 2 : 1, // Simulated data
        commonErrors: ['NameError', 'SyntaxError', 'IndentationError'],
        quizPerformance: {
          avgScore: 0.82,
          hardestQuestion: index === 0 ? 'Agent data encryption' : 'Mission code structure'
        }
      })))
      
      // Set mock predictive analytics
      setPredictiveAnalytics({
        atRiskStudents: mockData.students.filter((s: any) => s.status === 'stuck' || s.status === 'needs_help'),
        engagementTrends: {
          increasing: ['Sarah Chen', 'Alex Thompson'],
          decreasing: ['Michael Brown'],
          steady: ['Maria Garcia', 'James Wilson']
        },
        recommendedInterventions: [
          'Schedule 1-on-1 with James Wilson for variable concepts',
          'Create study group for struggling students',
          'Review error handling in next class'
        ],
        predictedCompletion: {
          onTrack: 3,
          atRisk: 2,
          needsSupport: 1
        }
      })
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Helper function to get filter counts
  const getFilterCounts = () => {
    if (!students || !Array.isArray(students)) {
      return { all: 0, active: 0, completed: 0, 'needs-help': 0, stuck: 0 }
    }
    
    return {
      all: students.length,
      active: students.filter((s: any) => 
        s.currentActivity && new Date(s.currentActivity.lastSeen).getTime() > Date.now() - 300000
      ).length,
      completed: students.filter((s: any) => 
        s.progress && s.progress.some((p: any) => p.status === 'completed')
      ).length,
      'needs-help': students.filter((s: any) => 
        s.currentActivity && s.currentActivity.timeSpent > 25 && s.currentActivity.timeSpent <= 35
      ).length,
      stuck: students.filter((s: any) => 
        s.currentActivity && s.currentActivity.timeSpent > 35
      ).length
    }
  }

  // Filter students based on current filter and search
  const filteredStudents = !students || !Array.isArray(students) ? [] : students.filter((student: any) => {
    const matchesSearch = student.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (filter) {
      case 'active':
        return student.currentActivity && 
               new Date(student.currentActivity.lastSeen).getTime() > Date.now() - 300000 // 5 minutes
      case 'completed':
        return student.progress && student.progress.some((p: any) => p.status === 'completed')
      case 'needs-help':
        return student.currentActivity && student.currentActivity.timeSpent > 25 && student.currentActivity.timeSpent <= 35
      case 'stuck':
        return student.currentActivity && student.currentActivity.timeSpent > 35
      default:
        return true
    }
  })

  const filterCounts = getFilterCounts()

  const getProgressStats = () => {
    if (!students || !Array.isArray(students)) {
      return {
        totalStudents: 0,
        activeStudents: 0,
        completedCount: 0,
        needsHelpCount: 0,
        averageCompletion: 0
      }
    }
    
    const totalStudents = students.length
    const activeStudents = students.filter((s: any) => 
      s.currentActivity && new Date(s.currentActivity.lastSeen).getTime() > Date.now() - 300000
    ).length
    const completedCount = students.reduce((acc, student) => 
      acc + (student.progress ? student.progress.filter((p: any) => p.status === 'completed').length : 0), 0
    )
    const needsHelpCount = students.filter((s: any) => 
      s.currentActivity && s.currentActivity.timeSpent > 25
    ).length

    return {
      totalStudents,
      activeStudents,
      completedCount,
      needsHelpCount,
      averageCompletion: totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0
    }
  }

  const getStudentStatus = (student: StudentProgress) => {
    if (!student.currentActivity) return { status: 'inactive', color: 'gray', text: 'Not Started' }
    
    const minutesAgo = (Date.now() - new Date(student.currentActivity.lastSeen).getTime()) / 60000
    
    if (minutesAgo > 30) return { status: 'offline', color: 'gray', text: 'Offline' }
    if (student.currentActivity.timeSpent > 35) return { status: 'stuck', color: 'red', text: 'Stuck 🚨' }
    if (student.currentActivity.timeSpent > 25) return { status: 'needs-help', color: 'yellow', text: 'Needs Help ⚠️' }
    if (minutesAgo < 5) return { status: 'active', color: 'green', text: 'Active 🟢' }
    
    return { status: 'working', color: 'blue', text: 'Working ⚡' }
  }

  const stats = getProgressStats()

  // Communication System Functions
  const sendMessage = async (student: StudentProgress, message: string) => {
    setMessageSending(true)
    try {
      // TODO: Implement actual message sending to Supabase
      // For now, simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`Message sent to ${student.user.full_name}: ${message}`)
      
      // Show success notification (you could add a toast notification here)
      alert(`Message sent to ${student.user.full_name}!`)
      
      setShowMessageModal(false)
      setMessageText('')
      setMessageRecipient(null)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setMessageSending(false)
    }
  }

  const sendAnnouncement = async (message: string) => {
    setMessageSending(true)
    try {
      // TODO: Implement actual announcement sending to all students
      // For now, simulate the action
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log(`Announcement sent to all students: ${message}`)
      
      // Show success notification
      alert(`Announcement sent to ${students.length} students!`)
      
      setShowAnnouncementModal(false)
      setAnnouncementText('')
    } catch (error) {
      console.error('Error sending announcement:', error)
      alert('Failed to send announcement. Please try again.')
    } finally {
      setMessageSending(false)
    }
  }

  const openMessageModal = (student: StudentProgress) => {
    setMessageRecipient(student)
    setMessageText('')
    setShowMessageModal(true)
  }

  // Reporting System Functions
  const generateReport = async (type: string, student?: StudentProgress) => {
    setReportGenerating(true)
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reportData = {
        generatedAt: new Date().toISOString(),
        type,
        student: student?.user.full_name,
        classSize: students.length,
        analytics
      }
      
      // In a real implementation, this would generate and download a PDF
      console.log('Generated report:', reportData)
      
      // Simulate download
      const reportContent = generateReportContent(type, student)
      downloadReport(reportContent, `${type}-report-${new Date().toISOString().split('T')[0]}.txt`)
      
      alert(`${type.replace('-', ' ').toUpperCase()} report downloaded successfully!`)
      setShowReportModal(false)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setReportGenerating(false)
    }
  }

  const generateReportContent = (type: string, student?: StudentProgress) => {
    const timestamp = new Date().toLocaleString()
    
    switch (type) {
      case 'class-summary':
        return `CODEFLY CLASS SUMMARY REPORT
Generated: ${timestamp}

========================================
CLASS OVERVIEW
========================================
Total Students: ${students.length}
Active Students: ${students.filter((s: any) => s.currentActivity && new Date(s.currentActivity.lastSeen).getTime() > Date.now() - 300000).length}
Completed Lessons: ${students.reduce((acc, s) => acc + s.progress.filter((p: any) => p.status === 'completed').length, 0)}
Average Class Performance: ${analytics.length > 0 ? analytics[0].completionRate.toFixed(1) : 'N/A'}%

========================================
STUDENT PERFORMANCE BREAKDOWN
========================================
${students.map((s: any) => {
  const completedLessons = s.progress.filter((p: any) => p.status === 'completed').length
  const averageScore = s.progress.filter((p: any) => p.score).length > 0 
    ? (s.progress.filter((p: any) => p.score).reduce((sum: number, p: any) => sum + (p.score || 0), 0) / s.progress.filter((p: any) => p.score).length * 100).toFixed(1)
    : 'No grades'
  return `${s.user.full_name}: ${completedLessons} lessons completed, Average: ${averageScore}%`
}).join('\n')}

========================================
LESSON ANALYTICS
========================================
${analytics.map((a: any) => `${a.title}: ${a.completionRate.toFixed(1)}% completion, ${a.strugglingStudents} students need help`).join('\n')}

========================================
RECOMMENDATIONS
========================================
- Students needing extra support: ${students.filter((s: any) => s.currentActivity && s.currentActivity.timeSpent > 35).length}
- Consider review sessions for challenging concepts
- Celebrate high performers to maintain motivation
`

      case 'individual-student':
        if (!student) return 'Error: No student selected'
        const studentGrades = student.progress.filter((p: any) => p.score).map((p: any) => Math.round((p.score || 0) * 100))
        const studentAverage = studentGrades.length > 0 ? (studentGrades.reduce((sum, grade) => sum + grade, 0) / studentGrades.length).toFixed(1) : 'No grades'
        
        return `CODEFLY INDIVIDUAL STUDENT REPORT
Generated: ${timestamp}

========================================
STUDENT INFORMATION
========================================
Name: ${student.user.full_name}
Email: ${student.user.email}
Current Status: ${student.currentActivity ? 'Active' : 'Offline'}

========================================
ACADEMIC PERFORMANCE
========================================
Overall Average: ${studentAverage}%
Lessons Completed: ${student.progress.filter((p: any) => p.status === 'completed').length}/${lessons.length}
Assignments Submitted: ${student.progress.filter((p: any) => p.submitted_code).length}
Quiz Performance: ${student.quizResults?.length || 0} quizzes completed

========================================
DETAILED PROGRESS
========================================
${student.progress.map((p: any) => {
  const lesson = lessons.find(l => l.id === p.lesson_id)
  const score = p.score ? Math.round(p.score * 100) + '%' : 'Not graded'
  return `${lesson?.title || 'Unknown Lesson'}: ${p.status} (Score: ${score})`
}).join('\n')}

========================================
STRENGTHS & AREAS FOR IMPROVEMENT
========================================
Strengths:
- Consistent lesson completion
- Active participation in coding exercises
- Good quiz performance

Areas for Improvement:
- Consider spending more time on challenging concepts
- Practice debugging skills
- Ask for help when stuck for extended periods

========================================
TEACHER COMMENTS
========================================
${student.progress.map((p: any) => p.teacher_feedback).filter((f: any) => f).join('\n') || 'No specific feedback recorded yet.'}
`

      case 'parent-report':
        if (!student) return 'Error: No student selected'
        const parentGrades = student.progress.filter((p: any) => p.score).map((p: any) => Math.round((p.score || 0) * 100))
        const parentAverage = parentGrades.length > 0 ? (parentGrades.reduce((sum, grade) => sum + grade, 0) / parentGrades.length).toFixed(1) : 'No grades'
        
        return `CODEFLY PARENT PROGRESS REPORT
Generated: ${timestamp}

Dear Parent/Guardian,

This report provides an overview of ${student.user.full_name}'s progress in our CodeFly Computer Science program.

========================================
SUMMARY OF PROGRESS
========================================
Your child is doing ${parentAverage >= '80' ? 'excellent' : parentAverage >= '70' ? 'good' : 'satisfactory'} work in computer science!

Current Grade Average: ${parentAverage}%
Lessons Completed: ${student.progress.filter((p: any) => p.status === 'completed').length} out of ${lessons.length} available
Participation Level: ${student.currentActivity ? 'Actively engaged' : 'Regular attendance'}

========================================
SKILLS DEVELOPMENT
========================================
✅ Programming Fundamentals: Understanding variables, input/output
✅ Problem Solving: Working through coding challenges
✅ Critical Thinking: Debugging and error resolution
✅ Digital Literacy: Working with development tools

========================================
RECENT ACHIEVEMENTS
========================================
${student.progress.filter((p: any) => p.status === 'completed').length > 0 
  ? `- Successfully completed ${student.progress.filter((p: any) => p.status === 'completed').length} programming lessons
- Demonstrated understanding of Python basics
- Active participation in class activities`
  : '- Getting started with programming fundamentals\n- Learning development environment\n- Building foundational skills'}

========================================
HOW TO SUPPORT AT HOME
========================================
- Encourage daily practice with coding exercises
- Ask about their favorite programming concepts
- Celebrate small wins and problem-solving successes
- Ensure they have a quiet space for online learning

========================================
NEXT STEPS
========================================
- Continue with upcoming lessons on ${lessons[student.progress.length]?.title || 'advanced topics'}
- Focus on consistent practice and completion
- Ask questions during class when concepts are unclear

If you have any questions about your child's progress, please don't hesitate to contact me.

Best regards,
CodeFly Computer Science Teacher
`

      default:
        return 'Unknown report type'
    }
  }

  const downloadReport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Enhanced Analytics Functions
  const generatePredictiveAnalytics = (studentsData: StudentProgress[]): PredictiveAnalytics => {
    // Risk Assessment Algorithm
    const riskStudents = studentsData.map((student: any) => {
      let riskScore = 0
      const riskFactors: string[] = []
      const interventionSuggestions: string[] = []

      // Factor 1: Time spent analysis
      if (student.currentActivity && student.currentActivity.timeSpent > 35) {
        riskScore += 3
        riskFactors.push('Extended time on current lesson (35+ minutes)')
        interventionSuggestions.push('Provide immediate one-on-one assistance')
      }

      // Factor 2: Completion rate
      const completionRate = student.progress.length > 0 
        ? (student.progress.filter((p: any) => p.status === 'completed').length / student.progress.length) * 100 
        : 0
      if (completionRate < 50) {
        riskScore += 2
        riskFactors.push('Low lesson completion rate (< 50%)')
        interventionSuggestions.push('Review learning goals and provide additional support materials')
      }

      // Factor 3: Grade performance
      const grades = student.progress.filter((p: any) => p.score).map((p: any) => (p.score || 0) * 100)
      const avgGrade = grades.length > 0 ? grades.reduce((sum: number, grade: number) => sum + grade, 0) / grades.length : 0
      if (avgGrade < 70 && grades.length > 0) {
        riskScore += 2
        riskFactors.push('Below-average grade performance (< 70%)')
        interventionSuggestions.push('Schedule additional practice sessions and provide feedback')
      }

      // Factor 4: Recent activity
      const lastActivity = student.currentActivity 
        ? new Date(student.currentActivity.lastSeen).getTime() 
        : 0
      const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24)
      if (daysSinceActivity > 3) {
        riskScore += 2
        riskFactors.push('Inactive for 3+ days')
        interventionSuggestions.push('Reach out to check engagement and motivation')
      }

      // Factor 5: Error patterns
      const hasErrors = student.codeSubmissions?.some((sub: any) => sub.result === 'error') || false
      if (hasErrors) {
        riskScore += 1
        riskFactors.push('Frequent code execution errors')
        interventionSuggestions.push('Focus on debugging skills and syntax review')
      }

      const riskLevel: 'high' | 'medium' | 'low' = 
        riskScore >= 5 ? 'high' : 
        riskScore >= 3 ? 'medium' : 'low'

      return {
        student,
        riskLevel,
        riskFactors,
        interventionSuggestions
      }
    }).filter((r: any) => r.riskLevel !== 'low') // Only show medium and high risk students

    // Class Insights Analysis
    const totalCompletions = studentsData.reduce((sum, s) => sum + s.progress.filter((p: any) => p.status === 'completed').length, 0)
    const avgCompletionRate = studentsData.length > 0 ? totalCompletions / studentsData.length : 0
    
    const engagementTrend: 'increasing' | 'stable' | 'decreasing' = 
      studentsData.filter((s: any) => s.currentActivity).length / studentsData.length > 0.7 ? 'increasing' :
      studentsData.filter((s: any) => s.currentActivity).length / studentsData.length > 0.4 ? 'stable' : 'decreasing'

    const performanceTrend: 'improving' | 'stable' | 'declining' = 
      avgCompletionRate > 0.8 ? 'improving' :
      avgCompletionRate > 0.5 ? 'stable' : 'declining'

    const recommendedPacing: 'accelerate' | 'maintain' | 'slow-down' = 
      performanceTrend === 'improving' && engagementTrend === 'increasing' ? 'accelerate' :
      riskStudents.length > studentsData.length * 0.3 ? 'slow-down' : 'maintain'

    const nextWeekPrediction = 
      recommendedPacing === 'accelerate' ? 'Class is ready for advanced concepts and additional challenges' :
      recommendedPacing === 'slow-down' ? 'Focus on reinforcement and additional support for struggling students' :
      'Continue current pace with targeted interventions for at-risk students'

    // Learning Patterns Analysis
    const peakHours = ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'] // Simulated based on typical patterns
    
    const strugglingConcepts = [
      ...new Set(studentsData.flatMap((s: any) => 
        s.codeSubmissions?.filter((sub: any) => sub.result === 'error').map(() => 'Variable naming') || []
      ))
    ].slice(0, 3)

    const successfulStrategies = [
      'Step-by-step debugging approach',
      'Peer programming sessions',
      'Interactive code examples'
    ]

    return {
      riskStudents,
      classInsights: {
        engagementTrend,
        performanceTrend,
        recommendedPacing,
        nextWeekPrediction
      },
      learningPatterns: {
        peakHours,
        strugglingConcepts: strugglingConcepts.length > 0 ? strugglingConcepts : ['No major struggles identified'],
        successfulStrategies
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading CodeFly Teacher Dashboard... ✈️</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CodeFly Teacher Portal ✈️🎯
              </h1>
              <p className="mt-1 text-lg text-purple-300 font-medium">
                9th Grade Computer Science • Real-time Classroom Management
                {realtimeConnected && (
                  <span className="ml-2 text-green-400 font-bold animate-pulse">● LIVE</span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              <div className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                realtimeConnected 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-red-600 text-white'
              }`}>
                <Zap className={`h-4 w-4 mr-2 ${realtimeConnected ? 'animate-pulse' : ''}`} />
                {realtimeConnected ? 'Live Connected 🟢' : 'Connecting... 🔄'}
                {lastUpdated && (
                  <span className="ml-2 text-xs opacity-75">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <button
                onClick={refreshProgressData}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center"
                disabled={progressLoading}
              >
                <Eye className={`h-4 w-4 mr-2 ${progressLoading ? 'animate-spin' : ''}`} />
                {progressLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Send Announcement 📢
              </button>
              <button
                onClick={() => setShowGradeBook(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Grade Book 📚
              </button>
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                AI Analytics 🤖
              </button>
              <Link 
                href="/teacher/manage"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Lessons 📚
              </Link>
              <Link 
                href="/teacher/knowledge-base"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                AI Tutor KB 🧠
              </Link>
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Reports 📊
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Lesson Monitoring - Works with ANY lesson structure */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 mb-8 border border-blue-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-400 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold text-white">Dynamic Lesson Progress Monitor</h2>
                <p className="text-blue-200">
                  Automatically tracking {dynamicLessons.length} lessons • Format: {lessonFormat}
                  {dynamicLessons.length > 0 && (
                    <span className="ml-2 text-green-400">✓ Auto-detected</span>
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={refreshDynamicData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Lesson Cards - Dynamically generated for ANY lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dynamicLessonProgress.map((lessonStat) => {
              const progressPercent = lessonStat.averageProgress
              const isActive = lessonStat.studentsInProgress > 0
              const needsAttention = lessonStat.studentsNeedingHelp > 0
              
              return (
                <div 
                  key={lessonStat.lesson.id}
                  className={`relative bg-gray-800/50 rounded-lg p-4 border transition-all hover:transform hover:scale-105 ${
                    needsAttention ? 'border-red-500/50 animate-pulse' : 
                    isActive ? 'border-green-500/50' : 
                    'border-gray-600'
                  }`}
                >
                  {/* Status indicator */}
                  <div className="absolute top-2 right-2">
                    {needsAttention && (
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                    {!needsAttention && isActive && (
                      <span className="flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {lessonStat.lesson.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Week {lessonStat.lesson.week || 'N/A'} • {lessonStat.lesson.id}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Avg Progress</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded px-2 py-1">
                      <span className="text-gray-400">Started:</span>
                      <span className="text-white ml-1 font-semibold">
                        {lessonStat.studentsStarted}
                      </span>
                    </div>
                    <div className="bg-gray-700/50 rounded px-2 py-1">
                      <span className="text-gray-400">Done:</span>
                      <span className="text-green-400 ml-1 font-semibold">
                        {lessonStat.studentsCompleted}
                      </span>
                    </div>
                    <div className={`rounded px-2 py-1 ${
                      lessonStat.studentsInProgress > 0 ? 'bg-blue-900/30' : 'bg-gray-700/50'
                    }`}>
                      <span className="text-gray-400">Active:</span>
                      <span className="text-blue-400 ml-1 font-semibold">
                        {lessonStat.studentsInProgress}
                      </span>
                    </div>
                    <div className={`rounded px-2 py-1 ${
                      lessonStat.studentsNeedingHelp > 0 ? 'bg-red-900/30' : 'bg-gray-700/50'
                    }`}>
                      <span className="text-gray-400">Help:</span>
                      <span className="text-red-400 ml-1 font-semibold">
                        {lessonStat.studentsNeedingHelp}
                      </span>
                    </div>
                  </div>

                  {/* Time info */}
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">
                        Avg time: {Math.round(lessonStat.averageTimeSpent)} min
                      </span>
                      {lessonStat.lastActivity && (
                        <span className="text-gray-500">
                          {new Date(lessonStat.lastActivity).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Empty state */}
            {dynamicLessonProgress.length === 0 && (
              <div className="col-span-full text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No lesson progress yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Progress will appear automatically when students start lessons.
                </p>
              </div>
            )}
          </div>

          {/* System info */}
          <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
            <div>
              Monitoring {dynamicActiveStudents.length} active students across all lessons
            </div>
            <div className="flex items-center gap-4">
              <span>Auto-detecting lesson format: <code className="text-blue-400">{lessonFormat}</code></span>
              {dynamicStudentsNeedingHelp.length > 0 && (
                <span className="text-red-400 font-semibold">
                  ⚠️ {dynamicStudentsNeedingHelp.length} students need help
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Assignment & Lesson Management Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-400 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold text-white">Assignment & Lesson Management</h2>
                <p className="text-purple-200">Monitor and manage all student assignments and lessons</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                <Bell className="h-4 w-4 inline mr-1" />
                Set Reminders
              </button>
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Week 1 Vocabulary Homework */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-white">Week 1: AI Vocabulary</h3>
                </div>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Flashcards & Matching Quiz</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Completion Rate:</span>
                  <span className="text-green-400 font-bold">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>13 of 20 students completed</span>
                  <span>Due: Tomorrow</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href="/teacher/assignments/vocabulary"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </Link>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Python Basics Lesson */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white">Lesson 1: Python Basics</h3>
                </div>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">In Progress</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Variables, Input/Output, Print</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress:</span>
                  <span className="text-blue-400 font-bold">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>9 students active now</span>
                  <span>Avg time: 25 min</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href="/teacher/lessons/python-basics"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  Monitor Progress
                </Link>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Magic 8-Ball Project */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white">Project: Magic 8-Ball</h3>
                </div>
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Upcoming</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Interactive Python Project</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ready:</span>
                  <span className="text-yellow-400 font-bold">Not Started</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Starts next week</span>
                  <span>Est: 45 min</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Settings className="h-4 w-4 inline mr-1" />
                  Configure
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <Plus className="h-4 w-4 inline mr-1" />
                  Create Assignment
                </button>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <FileText className="h-4 w-4 inline mr-1" />
                  View All Assignments
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <Download className="h-4 w-4 inline mr-1" />
                  Export Grades
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Next deadline:</span>
                <span className="text-yellow-400 font-bold">AI Vocabulary - Tomorrow 11:59 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-12 w-12 text-blue-200 animate-pulse" />
            </div>
            <div className="mt-2 text-blue-100 text-sm">
              📚 Enrolled in CodeFly
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium">Active Now</p>
                <p className="text-3xl font-bold">{stats.activeStudents}</p>
              </div>
              <div className="relative">
                <Zap className="h-12 w-12 text-green-200 animate-bounce" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="mt-2 text-green-100 text-sm">
              🚀 Coding right now!
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Completions</p>
                <p className="text-3xl font-bold">{stats.completedCount}</p>
              </div>
              <Trophy className="h-12 w-12 text-purple-200 animate-pulse" />
            </div>
            <div className="mt-2 text-purple-100 text-sm">
              🏆 Lessons finished
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 font-medium">Need Help</p>
                <p className="text-3xl font-bold">{stats.needsHelpCount}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-200 animate-bounce" />
            </div>
            <div className="mt-2 text-yellow-100 text-sm">
              ⚠️ Students stuck 20+ min
            </div>
          </div>
        </div>

        {/* Quick Actions & Filters */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <h3 className="text-xl font-bold text-white mr-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-purple-400" />
                Quick Filters 🎯
              </h3>
              {(['all', 'active', 'completed', 'needs-help', 'stuck'] as FilterType[]).map((filterType: any) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === filterType
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterType === 'all' && `👥 All (${filterCounts.all})`}
                  {filterType === 'active' && `🟢 Active (${filterCounts.active})`}
                  {filterType === 'completed' && `🏆 Completed (${filterCounts.completed})`}
                  {filterType === 'needs-help' && `⚠️ Need Help (${filterCounts['needs-help']})`}
                  {filterType === 'stuck' && `🚨 Stuck (${filterCounts.stuck})`}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Real-time Performance Analytics */}
        {analytics.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-500/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                  {analytics[0]?.title || 'Lesson'} Analytics 📊
                </h3>
                {analytics[0] && (
                  <TeacherPlaybook 
                    lessonId={analytics[0].lessonId} 
                    title={analytics[0].title} 
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-900/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-200 font-medium">Average Time Spent</span>
                    <span className="text-blue-100 font-bold">{analytics[0]?.avgTimeSpent || 0} minutes</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, ((analytics[0]?.avgTimeSpent || 0) / 50) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-300 text-sm mt-1">Target: 50 minutes</p>
                </div>
                
                <div className="bg-green-900/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-200 font-medium">Quiz Performance</span>
                    <span className="text-green-100 font-bold">
                      {analytics[0]?.quizPerformance.avgScore.toFixed(1) || '0.0'}/4.0 avg
                    </span>
                  </div>
                  <div className="w-full bg-green-800 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{ width: `${((analytics[0]?.quizPerformance.avgScore || 0) / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-green-300 text-sm mt-1">
                    {analytics[0]?.quizPerformance.hardestQuestion || 'No quiz data'} 🤔
                  </p>
                </div>
                
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-200 font-medium">Completion Rate</span>
                    <span className="text-purple-100 font-bold">
                      {analytics[0]?.completionRate.toFixed(1) || '0.0'}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-800 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full" 
                      style={{ width: `${analytics[0]?.completionRate || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-purple-300 text-sm mt-1">
                    {analytics[0]?.strugglingStudents || 0} students need help
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-red-400" />
                Common Code Issues 🐛
              </h3>
              
              <div className="space-y-3">
                {analytics[0]?.commonErrors.slice(0, 3).map((error, index) => (
                  <div key={index} className={`rounded-lg p-3 ${
                    index === 0 ? 'bg-red-900/50' : 
                    index === 1 ? 'bg-orange-900/50' : 'bg-yellow-900/50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${
                        index === 0 ? 'text-red-200' : 
                        index === 1 ? 'text-orange-200' : 'text-yellow-200'
                      }`}>
                        {error}
                      </span>
                      <span className={`text-sm ${
                        index === 0 ? 'text-red-100' : 
                        index === 1 ? 'text-orange-100' : 'text-yellow-100'
                      }`}>
                        Active issue
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${
                      index === 0 ? 'text-red-300' : 
                      index === 1 ? 'text-orange-300' : 'text-yellow-300'
                    }`}>
                      💡 {index === 0 ? 'Check variable spelling' : 
                           index === 1 ? 'Syntax check needed' : 'Review code structure'}
                    </p>
                  </div>
                )) || (
                  <div className="bg-green-900/50 rounded-lg p-3">
                    <div className="text-green-200 font-medium">No errors recorded</div>
                    <p className="text-green-300 text-xs mt-1">🎉 Students are doing great!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Student Progress Table */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-purple-500/30">
          <div className="px-6 py-4 border-b border-purple-500/30">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              Student Progress Monitor 👀 
              <span className="ml-2 text-purple-300">({filteredStudents.length} shown)</span>
            </h3>
            <p className="text-purple-200 mt-1">Real-time tracking of student activity and performance</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                    Student & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                    Current Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                    Progress & Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => {
                  const status = getStudentStatus(student)
                  const completionRate = lessons.length > 0 ? 
                    (student.progress.filter((p: any) => p.status === 'completed').length / lessons.length) * 100 : 0
                  
                  return (
                    <tr key={student.user.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">
                            {student.user.full_name || 'Unknown Student'}
                          </div>
                          <div className="text-gray-400 text-sm">{student.user.email}</div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                            status.color === 'green' ? 'bg-green-800 text-green-200' :
                            status.color === 'blue' ? 'bg-blue-800 text-blue-200' :
                            status.color === 'yellow' ? 'bg-yellow-800 text-yellow-200' :
                            status.color === 'red' ? 'bg-red-800 text-red-200' :
                            'bg-gray-800 text-gray-300'
                          }`}>
                            {status.text}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {student.currentActivity ? (
                          <div className="text-sm">
                            <div className="text-white font-medium">
                              Lesson 1: {student.currentActivity.sectionType === 'code' ? 'Coding 💻' : 
                                       student.currentActivity.sectionType === 'quiz' ? 'Quiz 📝' : 'Reading 📖'}
                            </div>
                            <div className="text-gray-400">
                              <Timer className="h-3 w-3 inline mr-1" />
                              {student.currentActivity.timeSpent} minutes
                            </div>
                            <div className="text-gray-500 text-xs">
                              Last seen: {new Date(student.currentActivity.lastSeen).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">No current activity</div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" 
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm font-medium">{completionRate.toFixed(0)}%</span>
                          </div>
                          
                          {student.quizResults && student.quizResults.length > 0 && (
                            <div className="text-xs text-gray-400">
                              <Star className="h-3 w-3 inline mr-1 text-yellow-400" />
                              Quiz: {student.quizResults[0].score}/{student.quizResults[0].totalQuestions}
                            </div>
                          )}
                          
                          {student.codeSubmissions && student.codeSubmissions.some(c => c.result === 'error') && (
                            <div className="text-xs text-red-400">
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                              Has code errors
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/teacher/student/${student.user.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="View student details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                            title="Send message"
                            onClick={() => openMessageModal(student)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button 
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors"
                            title="Grade student work"
                            onClick={() => {
                              setGradingStudent(student)
                              setShowGradeModal(true)
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                            title="Generate student report"
                            onClick={() => {
                              setSelectedReportStudent(student)
                              setReportType('individual-student')
                              setShowReportModal(true)
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          {status.status === 'stuck' && (
                            <button 
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors animate-pulse"
                              title="Provide help"
                              onClick={() => {
                                setMessageRecipient(student)
                                setMessageText(`Hi ${student.user.full_name?.split(' ')[0]}, I noticed you've been working on this for a while. Do you need help with anything specific? 🤝`)
                                setShowMessageModal(true)
                              }}
                            >
                              <Lightbulb className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No students match current filter</h3>
              <p className="text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>

        {/* Quick Intervention Panel */}
        {stats.needsHelpCount > 0 && (
          <div className="mt-8 bg-gradient-to-r from-red-900/80 to-orange-900/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-red-500/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-300 animate-bounce" />
              🚨 Students Need Help! Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => {
                  setAnnouncementText(`📢 Class Update: I see some students are working hard on the current lesson. Remember, it's okay to take your time and ask for help if needed! 💪`)
                  setShowAnnouncementModal(true)
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Send Group Message 📢
              </button>
              <button 
                onClick={() => {
                  setAnnouncementText(`💡 Helpful Hint: If you're stuck on the coding challenge, remember to check your variable names for typos. Python is case-sensitive! Try using print() to debug your code step by step. 🐍`)
                  setShowAnnouncementModal(true)
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Share Hint with Class 💡
              </button>
              <button 
                onClick={() => alert('Screen sharing feature coming soon! 🖥️')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Screen Share 🖥️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && messageRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
              Send Message to {messageRecipient.user.full_name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Message
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message to the student..."
                className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setMessageText('')
                  setMessageRecipient(null)
                }}
                className="px-4 py-2 text-purple-300 hover:text-white transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-700/50"
                disabled={messageSending}
              >
                Cancel
              </button>
              <button
                onClick={() => sendMessage(messageRecipient, messageText)}
                disabled={!messageText.trim() || messageSending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {messageSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Volume2 className="h-5 w-5 mr-2 text-blue-400" />
              Send Announcement to All Students
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Announcement
              </label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Type your announcement for all students..."
                className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none"
              />
            </div>

            <div className="bg-blue-900/50 rounded-lg p-3 mb-4">
              <p className="text-blue-200 text-sm flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                This will be sent to all {students.length} students immediately
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAnnouncementModal(false)
                  setAnnouncementText('')
                }}
                className="px-4 py-2 text-purple-300 hover:text-white transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-700/50"
                disabled={messageSending}
              >
                Cancel
              </button>
              <button
                onClick={() => sendAnnouncement(announcementText)}
                disabled={!announcementText.trim() || messageSending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {messageSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Send Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Book Modal */}
      {showGradeBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-6 border-b border-purple-500/30 sticky top-0 bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-orange-400" />
                  CodeFly Grade Book 📚
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setGradeBookView('overview')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        gradeBookView === 'overview'
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setGradeBookView('detailed')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        gradeBookView === 'detailed'
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Detailed
                    </button>
                  </div>
                  <button
                    onClick={() => setShowGradeBook(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {gradeBookView === 'overview' ? (
                // Overview Grid
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Class Average</h4>
                      <div className="text-2xl font-bold">87.3%</div>
                      <div className="text-green-100 text-sm">↗️ +2.1% from last week</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Assignments Graded</h4>
                      <div className="text-2xl font-bold">{students.filter((s: any) => s.progress.some((p: any) => p.score !== undefined)).length}/{students.length}</div>
                      <div className="text-blue-100 text-sm">📝 Recent submissions</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Needs Review</h4>
                      <div className="text-2xl font-bold">{students.filter((s: any) => s.progress.some((p: any) => p.status === 'submitted' && !p.score)).length}</div>
                      <div className="text-purple-100 text-sm">⏳ Awaiting grading</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-purple-300">Student</th>
                          {lessons.map((lesson: any) => (
                            <th key={lesson.id} className="px-4 py-3 text-center text-sm font-medium text-purple-300">
                              {lesson.title.split(':')[0]}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center text-sm font-medium text-purple-300">Average</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {students.map((student: any) => {
                          const studentGrades = lessons.map((lesson: any) => {
                            const progress = student.progress.find((p: any) => p.lesson_id === lesson.id)
                            return progress?.score ? Math.round(progress.score * 100) : null
                          })
                          const average = studentGrades.filter((g: any) => g !== null).length > 0
                            ? Math.round(studentGrades.filter((g: any) => g !== null).reduce((sum: number, grade: any) => sum + (grade || 0), 0) / studentGrades.filter((g: any) => g !== null).length)
                            : null

                          return (
                            <tr key={student.user.id} className="hover:bg-gray-700/50">
                              <td className="px-4 py-3">
                                <div className="text-white font-medium">{student.user.full_name}</div>
                                <div className="text-gray-400 text-sm">{student.user.email}</div>
                              </td>
                              {studentGrades.map((grade, index) => (
                                <td key={index} className="px-4 py-3 text-center">
                                  {grade !== null ? (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      grade >= 90 ? 'bg-green-800 text-green-200' :
                                      grade >= 80 ? 'bg-blue-800 text-blue-200' :
                                      grade >= 70 ? 'bg-yellow-800 text-yellow-200' :
                                      grade >= 60 ? 'bg-orange-800 text-orange-200' :
                                      'bg-red-800 text-red-200'
                                    }`}>
                                      {grade}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-3 text-center">
                                {average !== null ? (
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    average >= 90 ? 'bg-green-700 text-green-100' :
                                    average >= 80 ? 'bg-blue-700 text-blue-100' :
                                    average >= 70 ? 'bg-yellow-700 text-yellow-100' :
                                    average >= 60 ? 'bg-orange-700 text-orange-100' :
                                    'bg-red-700 text-red-100'
                                  }`}>
                                    {average}%
                                  </span>
                                ) : (
                                  <span className="text-gray-500">No grades</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Detailed View
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg text-white mb-2">Select a student to view detailed grades</h4>
                    <p className="text-gray-400">Individual assignment breakdown, feedback, and improvement suggestions</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student: any) => (
                      <div
                        key={student.user.id}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => {
                          setGradingStudent(student)
                          setShowGradeModal(true)
                          setShowGradeBook(false)
                        }}
                      >
                        <div className="text-white font-medium">{student.user.full_name}</div>
                        <div className="text-gray-400 text-sm">{student.user.email}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            {student.progress.filter((p: any) => p.score !== undefined).length} graded
                          </span>
                          <Award className="h-4 w-4 text-yellow-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Grading Modal */}
      {showGradeModal && gradingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Edit3 className="h-5 w-5 mr-2 text-orange-400" />
                  Grading: {gradingStudent.user.full_name}
                </h3>
                <button
                  onClick={() => {
                    setShowGradeModal(false)
                    setGradingStudent(null)
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {gradingStudent.progress.map((progress: any) => {
                const lesson = lessons.find(l => l.id === progress.lesson_id)
                if (!lesson) return null

                return (
                  <div key={progress.id} className="bg-gray-700/50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{lesson.title}</h4>
                        <p className="text-gray-400">Status: {progress.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {progress.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {progress.score !== undefined && (
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            (progress.score * 100) >= 90 ? 'bg-green-700 text-green-100' :
                            (progress.score * 100) >= 80 ? 'bg-blue-700 text-blue-100' :
                            (progress.score * 100) >= 70 ? 'bg-yellow-700 text-yellow-100' :
                            'bg-red-700 text-red-100'
                          }`}>
                            {Math.round(progress.score * 100)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {progress.submitted_code && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-purple-300 mb-2">Submitted Code:</h5>
                        <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                          {progress.submitted_code}
                        </pre>
                      </div>
                    )}

                    {progress.quiz_answers && Object.keys(progress.quiz_answers).length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-purple-300 mb-2">Quiz Results:</h5>
                        <div className="bg-gray-800 p-3 rounded">
                          <div className="text-blue-200">
                            Quiz completed with {gradingStudent.quizResults?.find(q => q.lessonId === lesson.id)?.score || 0}/
                            {gradingStudent.quizResults?.find(q => q.lessonId === lesson.id)?.totalQuestions || 4} correct answers
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">
                          Teacher Feedback
                        </label>
                        <textarea
                          value={progress.teacher_feedback || ''}
                          onChange={(e) => {
                            // Update progress feedback (this would normally update database)
                            console.log(`Updating feedback for ${gradingStudent.user.full_name}: ${e.target.value}`)
                          }}
                          placeholder="Enter feedback for the student..."
                          className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">
                          Grade Override
                        </label>
                        <div className="space-y-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={progress.score ? Math.round(progress.score * 100) : ''}
                            onChange={(e) => {
                              const newScore = parseInt(e.target.value) / 100
                              console.log(`Updating score for ${gradingStudent.user.full_name}: ${newScore}`)
                            }}
                            placeholder="Grade (0-100)"
                            className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                              A (90-100%)
                            </button>
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                              B (80-89%)
                            </button>
                            <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm">
                              C (70-79%)
                            </button>
                            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                              F (&lt;70%)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button 
                        onClick={() => {
                          setShowGradeModal(false)
                          setGradingStudent(null)
                        }}
                        className="px-4 py-2 text-purple-300 hover:text-white transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-700/50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          // Save grade to localStorage for persistence
                          const gradeData = {
                            studentId: student.user.id,
                            studentName: student.user.full_name,
                            lessonId: lesson.id,
                            lessonTitle: lesson.title,
                            grade: document.querySelector(`input[placeholder="Grade (0-100)"]`)?.value || '',
                            feedback: document.querySelector(`textarea[placeholder*="feedback"]`)?.value || '',
                            timestamp: new Date().toISOString()
                          }
                          
                          // Get existing grades from localStorage
                          const existingGrades = JSON.parse(localStorage.getItem('teacher_grades') || '[]')
                          existingGrades.push(gradeData)
                          localStorage.setItem('teacher_grades', JSON.stringify(existingGrades))
                          
                          alert(`Grade saved for ${student.user.full_name}!`)
                          setShowGradeModal(false)
                          setGradingStudent(null)
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Save Grade & Feedback
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full mx-4 border border-purple-500/30">
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-purple-400" />
                  Generate Reports 📊
                </h3>
                <button
                  onClick={() => {
                    setShowReportModal(false)
                    setSelectedReportStudent(null)
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setReportType('class-summary')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    reportType === 'class-summary'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <PieChart className={`h-8 w-8 mx-auto mb-3 ${
                      reportType === 'class-summary' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-white mb-2">Class Summary</h4>
                    <p className="text-sm text-gray-400">Overall class performance and analytics</p>
                  </div>
                </button>

                <button
                  onClick={() => setReportType('individual-student')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    reportType === 'individual-student'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${
                      reportType === 'individual-student' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-white mb-2">Student Report</h4>
                    <p className="text-sm text-gray-400">Detailed individual progress report</p>
                  </div>
                </button>

                <button
                  onClick={() => setReportType('parent-report')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    reportType === 'parent-report'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <Calendar className={`h-8 w-8 mx-auto mb-3 ${
                      reportType === 'parent-report' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-white mb-2">Parent Report</h4>
                    <p className="text-sm text-gray-400">Parent-friendly progress summary</p>
                  </div>
                </button>
              </div>

              {(reportType === 'individual-student' || reportType === 'parent-report') && (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-3">
                    Select Student:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {students.map((student: any) => (
                      <button
                        key={student.user.id}
                        onClick={() => setSelectedReportStudent(student)}
                        className={`p-3 rounded-lg text-left transition-all duration-300 ${
                          selectedReportStudent?.user.id === student.user.id
                            ? 'bg-purple-600/30 border border-purple-500'
                            : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                        }`}
                      >
                        <div className="text-white font-medium">{student.user.full_name}</div>
                        <div className="text-gray-400 text-sm">{student.user.email}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-blue-200 font-medium mb-2 flex items-center">
                  <Printer className="h-4 w-4 mr-2" />
                  Report Details
                </h4>
                <div className="space-y-2 text-sm text-blue-100">
                  {reportType === 'class-summary' && (
                    <>
                      <div>• Complete class performance overview</div>
                      <div>• Individual student summaries</div>
                      <div>• Lesson completion analytics</div>
                      <div>• Recommendations for improvement</div>
                    </>
                  )}
                  {reportType === 'individual-student' && (
                    <>
                      <div>• Detailed academic performance breakdown</div>
                      <div>• Assignment and quiz results</div>
                      <div>• Strengths and improvement areas</div>
                      <div>• Teacher feedback and comments</div>
                    </>
                  )}
                  {reportType === 'parent-report' && (
                    <>
                      <div>• Parent-friendly progress summary</div>
                      <div>• Skills development overview</div>
                      <div>• Home support recommendations</div>
                      <div>• Next steps and goals</div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false)
                    setSelectedReportStudent(null)
                  }}
                  className="px-6 py-2 text-purple-300 hover:text-white transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-700/50"
                  disabled={reportGenerating}
                >
                  Cancel
                </button>
                <button
                  onClick={() => generateReport(reportType, selectedReportStudent || undefined)}
                  disabled={
                    reportGenerating || 
                    ((reportType === 'individual-student' || reportType === 'parent-report') && !selectedReportStudent)
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {reportGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate & Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-cyan-500/30">
            <div className="p-6 border-b border-cyan-500/30 sticky top-0 bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-cyan-400" />
                  AI-Powered Class Analytics 🤖
                </h3>
                <div className="flex items-center space-x-4">
                  {predictiveAnalytics && (
                    <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setAnalyticsView('risk-assessment')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        analyticsView === 'risk-assessment'
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Risk Assessment
                    </button>
                    <button
                      onClick={() => setAnalyticsView('insights')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        analyticsView === 'insights'
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Class Insights
                    </button>
                    <button
                      onClick={() => setAnalyticsView('patterns')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        analyticsView === 'patterns'
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Learning Patterns
                    </button>
                  </div>
                  )}
                  <button
                    onClick={() => setShowAnalyticsModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!predictiveAnalytics ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <TrendingUp className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Loading Analytics...</h3>
                    <p className="text-gray-400">Analyzing student data and generating insights</p>
                  </div>
                </div>
              ) : (
                <div>
              {analyticsView === 'risk-assessment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">High Risk Students</h4>
                      <div className="text-2xl font-bold">
                        {predictiveAnalytics.riskStudents.filter((r: any) => r.riskLevel === 'high').length}
                      </div>
                      <div className="text-red-100 text-sm">🚨 Immediate attention needed</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Medium Risk Students</h4>
                      <div className="text-2xl font-bold">
                        {predictiveAnalytics.riskStudents.filter((r: any) => r.riskLevel === 'medium').length}
                      </div>
                      <div className="text-yellow-100 text-sm">⚠️ Monitor closely</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Students on Track</h4>
                      <div className="text-2xl font-bold">
                        {students.length - predictiveAnalytics.riskStudents.length}
                      </div>
                      <div className="text-green-100 text-sm">✅ Performing well</div>
                    </div>
                  </div>

                  {predictiveAnalytics.riskStudents.length > 0 ? (
                    <div className="space-y-4">
                      {predictiveAnalytics.riskStudents.map((riskStudent, index) => (
                        <div key={index} className={`rounded-lg p-6 border-l-4 ${
                          riskStudent.riskLevel === 'high' 
                            ? 'bg-red-900/20 border-red-500' 
                            : 'bg-yellow-900/20 border-yellow-500'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-white">
                                {riskStudent.student.user.full_name}
                              </h4>
                              <p className="text-gray-400">{riskStudent.student.user.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              riskStudent.riskLevel === 'high' 
                                ? 'bg-red-700 text-red-100' 
                                : 'bg-yellow-700 text-yellow-100'
                            }`}>
                              {riskStudent.riskLevel.toUpperCase()} RISK
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-red-300 mb-2">🚩 Risk Factors:</h5>
                              <ul className="space-y-1">
                                {riskStudent.riskFactors.map((factor, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-green-300 mb-2">💡 Intervention Suggestions:</h5>
                              <ul className="space-y-1">
                                {riskStudent.interventionSuggestions.map((suggestion, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <button 
                              onClick={() => {
                                setMessageRecipient(riskStudent.student)
                                setMessageText(`Hi ${riskStudent.student.user.full_name?.split(' ')[0]}, I wanted to check in and see how you're doing with the recent lessons. Please let me know if you need any extra support! 🤗`)
                                setShowAnalyticsModal(false)
                                setShowMessageModal(true)
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Support Message
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedReportStudent(riskStudent.student)
                                setReportType('individual-student')
                                setShowAnalyticsModal(false)
                                setShowReportModal(true)
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Report
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <h4 className="text-xl font-semibold text-white mb-2">All Students on Track!</h4>
                      <p className="text-gray-400">No students currently identified as at-risk. Great job!</p>
                    </div>
                  )}
                </div>
              )}

              {analyticsView === 'insights' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                      <h4 className="font-semibold mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Engagement Trend
                      </h4>
                      <div className="text-3xl font-bold mb-2">
                        {predictiveAnalytics.classInsights.engagementTrend === 'increasing' ? '📈' :
                         predictiveAnalytics.classInsights.engagementTrend === 'stable' ? '➡️' : '📉'}
                        {predictiveAnalytics.classInsights.engagementTrend.toUpperCase()}
                      </div>
                      <p className="text-blue-100 text-sm">
                        {predictiveAnalytics.classInsights.engagementTrend === 'increasing' ? 'Students are becoming more engaged!' :
                         predictiveAnalytics.classInsights.engagementTrend === 'stable' ? 'Steady participation levels' :
                         'May need to boost engagement'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                      <h4 className="font-semibold mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Performance Trend
                      </h4>
                      <div className="text-3xl font-bold mb-2">
                        {predictiveAnalytics.classInsights.performanceTrend === 'improving' ? '🚀' :
                         predictiveAnalytics.classInsights.performanceTrend === 'stable' ? '🎯' : '⚠️'}
                        {predictiveAnalytics.classInsights.performanceTrend.toUpperCase()}
                      </div>
                      <p className="text-purple-100 text-sm">
                        {predictiveAnalytics.classInsights.performanceTrend === 'improving' ? 'Academic performance is rising!' :
                         predictiveAnalytics.classInsights.performanceTrend === 'stable' ? 'Consistent performance levels' :
                         'Performance needs attention'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
                      Recommended Pacing
                    </h4>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                      predictiveAnalytics.classInsights.recommendedPacing === 'accelerate' ? 'bg-green-700 text-green-100' :
                      predictiveAnalytics.classInsights.recommendedPacing === 'slow-down' ? 'bg-red-700 text-red-100' :
                      'bg-blue-700 text-blue-100'
                    }`}>
                      {predictiveAnalytics.classInsights.recommendedPacing === 'accelerate' ? '⚡ ACCELERATE' :
                       predictiveAnalytics.classInsights.recommendedPacing === 'slow-down' ? '🐌 SLOW DOWN' :
                       '🎯 MAINTAIN'}
                    </div>
                    <p className="text-gray-300">
                      {predictiveAnalytics.classInsights.nextWeekPrediction}
                    </p>
                  </div>
                </div>
              )}

              {analyticsView === 'patterns' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <Timer className="h-5 w-5 mr-2 text-green-400" />
                        Peak Learning Hours
                      </h4>
                      <div className="space-y-2">
                        {predictiveAnalytics.learningPatterns.peakHours.map((hour, index) => (
                          <div key={index} className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                            <div className="text-green-200 font-medium">{hour}</div>
                            <div className="text-green-300 text-sm">High engagement period</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                        Struggling Concepts
                      </h4>
                      <div className="space-y-2">
                        {predictiveAnalytics.learningPatterns.strugglingConcepts.map((concept, index) => (
                          <div key={index} className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
                            <div className="text-yellow-200 font-medium">{concept}</div>
                            <div className="text-yellow-300 text-sm">Needs reinforcement</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-blue-400" />
                        Successful Strategies
                      </h4>
                      <div className="space-y-2">
                        {predictiveAnalytics.learningPatterns.successfulStrategies.map((strategy, index) => (
                          <div key={index} className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                            <div className="text-blue-200 font-medium">{strategy}</div>
                            <div className="text-blue-300 text-sm">Proven effective</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-900/20 rounded-xl p-6 border border-cyan-500/30">
                    <h4 className="font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" />
                      AI Recommendations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="text-cyan-300 font-medium">🎯 Focus Areas:</h5>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Schedule debugging workshops during peak hours</li>
                          <li>• Implement peer programming for variable naming practice</li>
                          <li>• Create additional interactive examples for difficult concepts</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-cyan-300 font-medium">🚀 Growth Opportunities:</h5>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Introduce advanced challenges for high performers</li>
                          <li>• Establish coding mentorship program</li>
                          <li>• Gamify learning with achievement badges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}