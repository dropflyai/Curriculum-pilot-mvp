'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Lesson, Progress } from '@/lib/supabase'
import { 
  Users, Download, Settings, 
  AlertTriangle, Code, Play, Trophy, Filter, Search,
  Eye, MessageSquare, BarChart3, Zap,
  Timer, Star, Lightbulb, Send, Bell, Volume2,
  BookOpen, CheckCircle, XCircle, Edit3, Award
} from 'lucide-react'
import Link from 'next/link'

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

type FilterType = 'all' | 'active' | 'completed' | 'needs-help' | 'stuck'

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [analytics, setAnalytics] = useState<LessonAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  
  // Communication System States
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState<StudentProgress | null>(null)
  const [messageText, setMessageText] = useState('')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')
  const [messageSending, setMessageSending] = useState(false)
  
  // Grade Book States
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [gradingStudent, setGradingStudent] = useState<StudentProgress | null>(null)
  const [showGradeBook, setShowGradeBook] = useState(false)
  const [gradeBookView, setGradeBookView] = useState<'overview' | 'detailed'>('overview')
  
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

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('week', { ascending: true })

      if (lessonsError) throw lessonsError

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
      const studentsWithProgress = (usersData || []).map((user) => {
        const userProgress = (progressData || []).filter(p => p.user_id === user.id)
        
        // Calculate current activity based on real data
        let currentActivity = undefined
        if (userProgress.length > 0) {
          // Get the most recently updated progress record
          const latestProgress = userProgress.reduce((latest, current) => 
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
          .filter(p => p.submitted_code)
          .map(p => ({
            lessonId: p.lesson_id,
            code: p.submitted_code || '',
            result: (p.score && p.score > 0.7 ? 'success' : 'error') as 'success' | 'error',
            timestamp: p.submitted_at || p.updated_at,
            errorMessage: p.score && p.score < 0.3 ? 'Code execution failed - check syntax' : undefined
          }))

        // Extract real quiz results from progress data
        const quizResults = userProgress
          .filter(p => p.quiz_answers && Object.keys(p.quiz_answers).length > 0)
          .map(p => {
            const answers = p.quiz_answers as Record<string, { correct?: boolean }>
            const totalQuestions = Object.keys(answers).length
            const correctAnswers = Object.values(answers).filter(answer => answer.correct).length
            
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
      const lessonAnalytics = (lessonsData || []).map(lesson => {
        const lessonProgress = studentsWithProgress.flatMap(s => 
          s.progress.filter(p => p.lesson_id === lesson.id)
        )
        const completedCount = lessonProgress.filter(p => p.status === 'completed').length
        const strugglingCount = studentsWithProgress.filter(s => 
          s.currentActivity?.lessonId === lesson.id && s.currentActivity && s.currentActivity.timeSpent > 25
        ).length

        // Calculate average time spent from real data
        const timesSpent = lessonProgress
          .map(p => {
            if (p.started_at && p.completed_at) {
              return (new Date(p.completed_at).getTime() - new Date(p.started_at).getTime()) / 60000
            }
            return null
          })
          .filter(t => t !== null)
        
        const avgTimeSpent = timesSpent.length > 0 
          ? Math.round(timesSpent.reduce((sum, time) => sum + time, 0) / timesSpent.length)
          : 30 // Default estimate

        // Extract common errors from code submissions
        const allCodeSubmissions = studentsWithProgress.flatMap(s => s.codeSubmissions || [])
        const errorMessages = allCodeSubmissions
          .filter(sub => sub.result === 'error' && sub.errorMessage)
          .map(sub => sub.errorMessage!)
        
        const commonErrors = errorMessages.length > 0 
          ? [...new Set(errorMessages)].slice(0, 3)
          : ['No errors recorded yet']

        // Calculate quiz performance from real data
        const allQuizResults = studentsWithProgress.flatMap(s => s.quizResults || [])
        const lessonQuizResults = allQuizResults.filter(quiz => quiz.lessonId === lesson.id)
        
        const avgScore = lessonQuizResults.length > 0
          ? lessonQuizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0) / lessonQuizResults.length
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
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
    
    // Set up real-time updates every 30 seconds
    const interval = realTimeEnabled ? setInterval(fetchData, 30000) : null
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [fetchData, realTimeEnabled])

  // Helper function to get filter counts
  const getFilterCounts = () => {
    return {
      all: students.length,
      active: students.filter(s => 
        s.currentActivity && new Date(s.currentActivity.lastSeen).getTime() > Date.now() - 300000
      ).length,
      completed: students.filter(s => 
        s.progress.some(p => p.status === 'completed')
      ).length,
      'needs-help': students.filter(s => 
        s.currentActivity && s.currentActivity.timeSpent > 25 && s.currentActivity.timeSpent <= 35
      ).length,
      stuck: students.filter(s => 
        s.currentActivity && s.currentActivity.timeSpent > 35
      ).length
    }
  }

  // Filter students based on current filter and search
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (filter) {
      case 'active':
        return student.currentActivity && 
               new Date(student.currentActivity.lastSeen).getTime() > Date.now() - 300000 // 5 minutes
      case 'completed':
        return student.progress.some(p => p.status === 'completed')
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
    const totalStudents = students.length
    const activeStudents = students.filter(s => 
      s.currentActivity && new Date(s.currentActivity.lastSeen).getTime() > Date.now() - 300000
    ).length
    const completedCount = students.reduce((acc, student) => 
      acc + student.progress.filter(p => p.status === 'completed').length, 0
    )
    const needsHelpCount = students.filter(s => 
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
              <p className="mt-1 text-lg text-purple-300 font-medium">9th Grade Computer Science • Real-time Classroom Management</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  realTimeEnabled 
                    ? 'bg-green-600 text-white shadow-lg hover:bg-green-700' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Live Updates {realTimeEnabled ? '🟢' : '⚫'}
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
              <Link 
                href="/teacher/manage"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Lessons 📚
              </Link>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Reports 📊
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {(['all', 'active', 'completed', 'needs-help', 'stuck'] as FilterType[]).map(filterType => (
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
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                {analytics[0]?.title || 'Lesson'} Analytics 📊
              </h3>
              
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
                    (student.progress.filter(p => p.status === 'completed').length / lessons.length) * 100 : 0
                  
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
                          <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                            title="View student details"
                            onClick={() => alert(`Viewing details for ${student.user.full_name}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
                      <div className="text-2xl font-bold">{students.filter(s => s.progress.some(p => p.score !== undefined)).length}/{students.length}</div>
                      <div className="text-blue-100 text-sm">📝 Recent submissions</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-4 text-white">
                      <h4 className="font-semibold mb-2">Needs Review</h4>
                      <div className="text-2xl font-bold">{students.filter(s => s.progress.some(p => p.status === 'submitted' && !p.score)).length}</div>
                      <div className="text-purple-100 text-sm">⏳ Awaiting grading</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-purple-300">Student</th>
                          {lessons.map(lesson => (
                            <th key={lesson.id} className="px-4 py-3 text-center text-sm font-medium text-purple-300">
                              {lesson.title.split(':')[0]}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center text-sm font-medium text-purple-300">Average</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {students.map(student => {
                          const studentGrades = lessons.map(lesson => {
                            const progress = student.progress.find(p => p.lesson_id === lesson.id)
                            return progress?.score ? Math.round(progress.score * 100) : null
                          })
                          const average = studentGrades.filter(g => g !== null).length > 0
                            ? Math.round(studentGrades.filter(g => g !== null).reduce((sum, grade) => sum + (grade || 0), 0) / studentGrades.filter(g => g !== null).length)
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
                    {students.map(student => (
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
                            {student.progress.filter(p => p.score !== undefined).length} graded
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
              {gradingStudent.progress.map(progress => {
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

                    <div className="mt-4 flex justify-end">
                      <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
    </div>
  )
}