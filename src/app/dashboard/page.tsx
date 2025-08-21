'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllLessons, Lesson } from '@/lib/lesson-data'
import { BookOpen, Clock, Award, TrendingUp, User, LogOut, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>(getAllLessons())
  const [userProgress] = useState<Record<string, number>>({
    'week-01': 25, // Week 1 AI Classifier - in progress
    'python-basics-variables': 75,
    'python-magic-8-ball': 100,
    'python-functions': 0,
    'python-lists-loops': 25,
    'python-file-handling': 0
  })
  const [userScores] = useState<Record<string, number>>({
    'week-01': 78, // Week 1 AI Classifier quiz score
    'python-basics-variables': 85,
    'python-magic-8-ball': 92,
    'python-lists-loops': 67
  })
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  
  // Learning Progress Data
  const [totalLearningTime] = useState(8.5) // hours this week
  const [recentActivity] = useState([
    { action: 'Trained AI Classifier on School Supplies', time: '1 hour ago', type: 'lesson' },
    { action: 'Completed Week 1 Main Mode', time: '2 hours ago', type: 'lesson' },
    { action: 'Achieved 78% on AI Classifier Quiz', time: '1 day ago', type: 'quiz' },
    { action: 'Started Week 1 - AI Classifier', time: '2 days ago', type: 'lesson' }
  ])
  
  // Learning Analytics
  const [learningAnalytics] = useState({
    timePerConcept: {
      'variables': 12, // minutes
      'loops': 18,
      'functions': 15,
      'input-output': 8
    },
    topicsToReview: ['loops', 'functions'],
    strongAreas: ['variables', 'input-output']
  })


  useEffect(() => {
    // TEMPORARY: Allow dashboard access for testing
    // if (!loading && !isAuthenticated) {
    //   router.push('/auth')
    // }
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

  // TEMPORARY: Skip auth check for testing
  // if (!isAuthenticated) {
  //   return null
  // }

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

        {/* Learning Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Lessons Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Lessons</p>
                <p className="text-2xl font-bold text-white">{lessons.length}</p>
                <p className="text-xs text-gray-500">Available to learn</p>
              </div>
            </div>
          </div>

          {/* Completed Lessons Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{lessons.filter(l => getProgressForLesson(l.id) === 100).length}</p>
                <p className="text-xs text-gray-500">Lessons finished</p>
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white">{lessons.filter(l => { const p = getProgressForLesson(l.id); return p > 0 && p < 100; }).length}</p>
                <p className="text-xs text-gray-500">Currently learning</p>
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-white">{getAverageScore()}%</p>
                <p className="text-xs text-gray-500">Quiz performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress Overview */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Learning Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">Overall Course Progress</span>
                <span className="text-sm font-bold text-white">
                  {Math.round((lessons.filter(l => getProgressForLesson(l.id) === 100).length / lessons.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(lessons.filter(l => getProgressForLesson(l.id) === 100).length / lessons.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Strong Areas</h4>
                <div className="space-y-2">
                  {learningAnalytics.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white capitalize">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Topics to Review</h4>
                <div className="space-y-2">
                  {learningAnalytics.topicsToReview.map((topic, index) => (
                    <div key={index} className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-white capitalize">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recommendations */}
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


        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Available Lessons</h3>
            
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

          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-medium text-gray-400">Filter by Difficulty:</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedDifficulty('all')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedDifficulty === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({lessons.length})
              </button>
              <button 
                onClick={() => setSelectedDifficulty('beginner')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedDifficulty === 'beginner' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Beginner ({lessons.filter(l => l.difficulty === 'beginner').length})
              </button>
              <button 
                onClick={() => setSelectedDifficulty('intermediate')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedDifficulty === 'intermediate' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Intermediate ({lessons.filter(l => l.difficulty === 'intermediate').length})
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

      </div>
    </div>
  )
}