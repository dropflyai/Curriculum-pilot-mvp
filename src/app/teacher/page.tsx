'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Lesson, Progress } from '@/lib/supabase'
import { 
  Users, Download, Settings, 
  AlertTriangle, Code, Play, Trophy, Filter, Search,
  Eye, MessageSquare, BarChart3, Zap,
  Timer, Star, Lightbulb
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
  const [analytics] = useState<LessonAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
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
      const studentsWithProgress = (usersData || []).map((user, index) => {
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

        // Generate sample code submissions
        const codeSubmissions = userProgress.map(p => ({
          lessonId: p.lesson_id,
          code: `# Student's code for ${p.lesson_id}\nuser_name = input("What's your name? ")\nprint(f"Hello {user_name}!")`,
          result: (Math.random() > 0.3 ? 'success' : 'error') as 'success' | 'error',
          timestamp: p.updated_at,
          errorMessage: Math.random() > 0.7 ? 'NameError: name \'user_nam\' is not defined' : undefined
        }))

        // Generate sample quiz results
        const quizResults = userProgress.map(p => ({
          lessonId: p.lesson_id,
          score: Math.floor(Math.random() * 4) + 1, // 1-4 out of 4
          totalQuestions: 4,
          timeSpent: Math.floor(Math.random() * 10) + 3, // 3-13 minutes
          timestamp: p.updated_at
        }))

        // For testing: randomly mark some students as having completed lessons
        if (index % 3 === 0 && userProgress.length > 0) {
          userProgress[0].status = 'completed'
        }

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

      // Calculate lesson analytics
      const lessonAnalytics = (lessonsData || []).map(lesson => {
        const lessonProgress = studentsWithProgress.flatMap(s => 
          s.progress.filter(p => p.lesson_id === lesson.id)
        )
        const completedCount = lessonProgress.filter(p => p.status === 'completed').length
        const strugglingCount = studentsWithProgress.filter(s => 
          s.currentActivity?.lessonId === lesson.id && s.currentActivity && s.currentActivity.timeSpent > 20
        ).length

        return {
          lessonId: lesson.id,
          title: lesson.title,
          avgTimeSpent: 25 + Math.floor(Math.random() * 20), // 25-45 minutes
          completionRate: studentsWithProgress.length > 0 ? (completedCount / studentsWithProgress.length) * 100 : 0,
          strugglingStudents: strugglingCount,
          commonErrors: [
            'NameError: name \'user_nam\' is not defined',
            'SyntaxError: invalid syntax',
            'IndentationError: expected an indented block'
          ],
          quizPerformance: {
            avgScore: 2.8,
            hardestQuestion: 'What function displays text on the screen?'
          }
        }
      })

      // setAnalytics(lessonAnalytics) // Analytics ready for future use
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

        {/* Lesson 1 Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Lesson 1: Python Basics Analytics 📊
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-200 font-medium">Average Time Spent</span>
                  <span className="text-blue-100 font-bold">32 minutes</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
                <p className="text-blue-300 text-sm mt-1">Target: 50 minutes</p>
              </div>
              
              <div className="bg-green-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-200 font-medium">Quiz Performance</span>
                  <span className="text-green-100 font-bold">2.8/4.0 avg</span>
                </div>
                <div className="w-full bg-green-800 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-green-300 text-sm mt-1">Hardest: &quot;What displays text?&quot; 🤔</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-red-400" />
              Common Code Issues 🐛
            </h3>
            
            <div className="space-y-3">
              <div className="bg-red-900/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-200 font-medium">NameError: &apos;user_nam&apos;</span>
                  <span className="text-red-100 text-sm">8 students</span>
                </div>
                <p className="text-red-300 text-xs mt-1">💡 Typo in variable name</p>
              </div>
              
              <div className="bg-orange-900/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-orange-200 font-medium">SyntaxError: invalid syntax</span>
                  <span className="text-orange-100 text-sm">5 students</span>
                </div>
                <p className="text-orange-300 text-xs mt-1">💡 Missing quotes or parentheses</p>
              </div>
              
              <div className="bg-yellow-900/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-200 font-medium">IndentationError</span>
                  <span className="text-yellow-100 text-sm">3 students</span>
                </div>
                <p className="text-yellow-300 text-xs mt-1">💡 Python spacing rules</p>
              </div>
            </div>
          </div>
        </div>

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
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          {status.status === 'stuck' && (
                            <button 
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors animate-pulse"
                              title="Provide help"
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
              <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send Group Message 📢
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Share Hint with Class 💡
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <Play className="h-5 w-5 mr-2" />
                Start Screen Share 🖥️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}