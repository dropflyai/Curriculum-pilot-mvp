'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllLessons, Lesson } from '@/lib/lesson-data'
import { getLessonProgress, getWeek02CompletionStatus, getAllLessonProgress } from '@/lib/progress-utils'
import { BookOpen, Clock, Award, TrendingUp, User, LogOut, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import Leaderboard from '@/components/Leaderboard'
import PortfolioPreview from '@/components/PortfolioPreview'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const allLessons = getAllLessons()
    console.log('Dashboard loading lessons:', allLessons.length, allLessons.map(l => ({ id: l.id, title: l.title })))
    return allLessons
  })
  const [userProgress, setUserProgress] = useState<Record<string, number>>({})
  const [userScores, setUserScores] = useState<Record<string, number>>({})
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showHomework, setShowHomework] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  
  // 18-week course structure (you can modify this based on actual course plan)
  const totalWeeks = 18
  const currentWeek = 2 // This could be calculated based on actual progress
  const weeklyProgress = (currentWeek / totalWeeks) * 100

  // Learning Progress Data
  const [totalLearningTime] = useState(8.5) // hours this week
  const [recentActivity] = useState([
    { action: 'Completed Week 1 AI Classifier', time: '30 minutes ago', type: 'lesson' },
    { action: 'Earned AI Classifier Badge', time: '35 minutes ago', type: 'achievement' },
    { action: 'Achieved 85% on Week 1 Quiz', time: '1 hour ago', type: 'quiz' },
    { action: 'Ready to Start Week 2 - Python!', time: 'Now', type: 'lesson' }
  ])

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600 text-white'
      case 'intermediate': return 'bg-yellow-600 text-white'
      case 'advanced': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  // Load real progress data
  const loadProgressData = useCallback(() => {
    const allProgress = getAllLessonProgress()
    const progressMap: Record<string, number> = {}
    const scoresMap: Record<string, number> = {}
    
    // Add default completed lessons
    progressMap['week-01'] = 100
    scoresMap['week-01'] = 85
    progressMap['python-basics-variables'] = 75
    scoresMap['python-basics-variables'] = 85
    progressMap['python-magic-8-ball'] = 100
    scoresMap['python-magic-8-ball'] = 92
    progressMap['python-lists-loops'] = 25
    scoresMap['python-lists-loops'] = 67
    
    // Override with real progress for tracked lessons
    Object.entries(allProgress).forEach(([lessonId, data]) => {
      if (data.progress > 0) {
        progressMap[lessonId] = data.progress
        scoresMap[lessonId] = data.score
      }
    })
    
    // Special handling for week-02 (the main lesson we're tracking)
    const week02Status = getWeek02CompletionStatus()
    progressMap['week-02'] = week02Status.progress
    scoresMap['week-02'] = week02Status.score
    
    setUserProgress(progressMap)
    setUserScores(scoresMap)
  }, [])

  // Load progress on mount and listen for updates
  useEffect(() => {
    loadProgressData()
    
    // Listen for lesson progress updates
    const handleProgressUpdate = () => {
      loadProgressData()
    }
    
    window.addEventListener('lessonProgressUpdate', handleProgressUpdate)
    return () => window.removeEventListener('lessonProgressUpdate', handleProgressUpdate)
  }, [loadProgressData])

  const getProgressForLesson = (lessonId: string) => {
    return userProgress[lessonId] || 0
  }

  const getScoreForLesson = (lessonId: string) => {
    return userScores[lessonId] || 0
  }

  const getAverageScore = () => {
    const scores = Object.values(userScores)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }
  
  const getNextRecommendedLesson = () => {
    // Find first lesson that's not completed
    const incompleteLesson = lessons.find(lesson => getProgressForLesson(lesson.id) < 100)
    return incompleteLesson || lessons[0]
  }

  const getLessonsByTab = () => {
    let filteredLessons = lessons

    // Filter by completion status
    switch (selectedTab) {
      case 'completed':
        filteredLessons = lessons.filter(lesson => getProgressForLesson(lesson.id) === 100)
        break
      case 'in-progress':
        filteredLessons = lessons.filter(lesson => {
          const progress = getProgressForLesson(lesson.id)
          return progress > 0 && progress < 100
        })
        break
      case 'not-started':
        filteredLessons = lessons.filter(lesson => getProgressForLesson(lesson.id) === 0)
        break
      default:
        filteredLessons = lessons
    }

    // Then filter by difficulty
    if (selectedDifficulty !== 'all') {
      filteredLessons = filteredLessons.filter(lesson => lesson.difficulty === selectedDifficulty)
    }

    return filteredLessons
  }

  const filteredLessons = getLessonsByTab()
  const nextLesson = getNextRecommendedLesson()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">CodeFly Academy</h1>
                <p className="text-sm text-gray-400">Student Learning Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <User className="h-4 w-4 mr-1" />
                {user?.full_name || user?.email || 'Test User'}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}
          </h2>
          <p className="text-lg text-gray-400">Continue your Python programming journey</p>
        </div>

        {/* 18-Week Course Progress Bar */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-2xl font-bold text-white">Course Progress</h3>
              <p className="text-blue-200">18-Week Python & AI Programming Course</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-300">Week {currentWeek} of {totalWeeks}</span>
              <span className="text-sm font-bold text-white">{Math.round(weeklyProgress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-800/30 rounded-lg p-3">
                <div className="text-blue-300 text-sm font-medium">Weeks Completed</div>
                <div className="text-white text-xl font-bold">{currentWeek - 1}</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <div className="text-purple-300 text-sm font-medium">Current Week</div>
                <div className="text-white text-xl font-bold">{currentWeek}</div>
              </div>
              <div className="bg-green-800/30 rounded-lg p-3">
                <div className="text-green-300 text-sm font-medium">Weeks Remaining</div>
                <div className="text-white text-xl font-bold">{totalWeeks - currentWeek}</div>
              </div>
              <div className="bg-yellow-800/30 rounded-lg p-3">
                <div className="text-yellow-300 text-sm font-medium">Est. Completion</div>
                <div className="text-white text-xl font-bold">May 2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Available Lessons</p>
                <p className="text-2xl font-bold text-white">{lessons.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{lessons.filter(l => getProgressForLesson(l.id) === 100).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white">{lessons.filter(l => { const p = getProgressForLesson(l.id); return p > 0 && p < 100; }).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-white">{getAverageScore()}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Next Recommended Lesson */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Continue Learning</h3>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-lg font-bold text-white mb-2">{nextLesson.title}</h4>
              <p className="text-gray-300 mb-3">{nextLesson.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(nextLesson.difficulty)}`}>
                  {nextLesson.difficulty}
                </span>
                <Link
                  href={`/lesson/${nextLesson.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  Start Lesson
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center bg-gray-700/50 rounded-lg p-3">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'lesson' ? 'bg-blue-500' :
                    activity.type === 'quiz' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Lessons Grid - NOW PROMINENT */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Your Lessons</h3>
            
            {/* Progress Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedTab === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Lessons ({lessons.length})
              </button>
              <button 
                onClick={() => setSelectedTab('completed')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedTab === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Completed ({lessons.filter(l => getProgressForLesson(l.id) === 100).length})
              </button>
              <button 
                onClick={() => setSelectedTab('in-progress')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedTab === 'in-progress' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                In Progress ({lessons.filter(l => { const p = getProgressForLesson(l.id); return p > 0 && p < 100; }).length})
              </button>
              <button 
                onClick={() => setSelectedTab('not-started')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedTab === 'not-started' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Not Started ({lessons.filter(l => getProgressForLesson(l.id) === 0).length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const progress = getProgressForLesson(lesson.id)
              const isCompleted = progress === 100
              const isStarted = progress > 0

              return (
                <div key={lesson.id} className="bg-gray-800 border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border">
                  <div className="p-6">
                    {/* Lesson Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-white">{lesson.title}</h4>
                        </div>
                        <p className="text-sm mb-3 line-clamp-2 text-gray-400">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex flex-col gap-1">
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    {/* Lesson Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.estimatedTime}
                      </span>
                    </div>

                    {/* Progress Bar and Score */}
                    {isStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">Progress</span>
                          <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {getScoreForLesson(lesson.id) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Quiz Score</span>
                            <span className={`text-sm font-bold ${
                              getScoreForLesson(lesson.id) >= 90 ? 'text-green-500' :
                              getScoreForLesson(lesson.id) >= 80 ? 'text-yellow-500' :
                              getScoreForLesson(lesson.id) >= 70 ? 'text-orange-500' :
                              'text-red-500'
                            }`}>
                              {getScoreForLesson(lesson.id)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/lesson/${lesson.id}`}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : isStarted
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Lesson
                        </>
                      ) : isStarted ? (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Start Lesson
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Collapsible Homework Section */}
        <div className="mb-8">
          <button 
            onClick={() => setShowHomework(!showHomework)}
            className="w-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📚</div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">Homework Assignments</h3>
                  <p className="text-purple-200">Complete these portfolio assignments to showcase your learning</p>
                </div>
              </div>
              {showHomework ? 
                <ChevronUp className="h-6 w-6 text-purple-300" /> : 
                <ChevronDown className="h-6 w-6 text-purple-300" />
              }
            </div>
          </button>

          {showHomework && (
            <div className="mt-4 bg-purple-900/10 rounded-lg p-6 border border-purple-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vocabulary Assignment */}
                <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl group-hover:animate-bounce">🧠</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">Lesson 1: AI Vocabulary Mastery</h4>
                      <p className="text-purple-200 text-sm mb-4">
                        Learn and master essential AI terminology through interactive study and matching games.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm">⏱️</span>
                          <span className="text-gray-300 text-sm">Est. Time: 10-15 min</span>
                        </div>
                        <Link
                          href="/homework/vocabulary"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                        >
                          Start Assignment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Magic 8-Ball Portfolio */}
                <div className="bg-blue-800/20 rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl group-hover:animate-bounce">🎱</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">Lesson 2: Magic 8-Ball Portfolio</h4>
                      <p className="text-blue-200 text-sm mb-4">
                        Enhance your Magic 8-Ball project and create a portfolio entry to share with peers.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm">⏱️</span>
                          <span className="text-gray-300 text-sm">Est. Time: 60 min</span>
                        </div>
                        <Link
                          href="/homework/magic-8-ball"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                        >
                          Start Homework
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Preview Section */}
        <div className="mb-8">
          <button 
            onClick={() => setShowPortfolio(!showPortfolio)}
            className="w-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎨</div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">My Portfolio</h3>
                  <p className="text-blue-200">Showcase your coding projects and achievements</p>
                </div>
              </div>
              {showPortfolio ? 
                <ChevronUp className="h-6 w-6 text-blue-300" /> : 
                <ChevronDown className="h-6 w-6 text-blue-300" />
              }
            </div>
          </button>

          {showPortfolio && (
            <div className="mt-4">
              <PortfolioPreview 
                onViewPortfolio={() => router.push('/portfolio')}
                className=""
              />
            </div>
          )}
        </div>

        {/* Collapsible Leaderboard */}
        <div className="mb-8">
          <button 
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="w-full bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏆</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">Class Leaderboard</h3>
                  <p className="text-yellow-200">See how you rank among your classmates</p>
                </div>
              </div>
              {showLeaderboard ? 
                <ChevronUp className="h-6 w-6 text-yellow-300" /> : 
                <ChevronDown className="h-6 w-6 text-yellow-300" />
              }
            </div>
          </button>

          {showLeaderboard && (
            <div className="mt-4">
              <Leaderboard userId={user?.id} showTopOnly={true} />
              <div className="mt-4 text-center">
                <Link 
                  href="/leaderboard"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Full Leaderboard
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}