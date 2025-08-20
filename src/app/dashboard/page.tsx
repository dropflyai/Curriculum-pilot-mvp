'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllLessons, Lesson } from '@/lib/lesson-data'
import { BookOpen, Clock, Award, TrendingUp, User, LogOut, Star, Target, Trophy, Flame, Brain, Timer, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import CelebrationEffect from '@/components/CelebrationEffect'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lessons] = useState<Lesson[]>(getAllLessons())
  const [userProgress] = useState<Record<string, number>>({
    'python-basics-variables': 75,
    'python-magic-8-ball': 100,
    'python-functions': 0,
    'python-lists-loops': 25,
    'python-file-handling': 0
  })
  const [userScores] = useState<Record<string, number>>({
    'python-basics-variables': 85,
    'python-magic-8-ball': 92,
    'python-lists-loops': 67
  })
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  
  // Gamification Data
  const [userXP] = useState(1250)
  const [currentStreak] = useState(5)
  const [weeklyGoal] = useState({ target: 4, completed: 2 })
  const [totalLearningTime] = useState(8.5) // hours this week
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [recentActivity] = useState([
    { action: 'Completed Magic 8-Ball Project', time: '2 hours ago', xp: 150, type: 'lesson' },
    { action: 'Earned Quiz Champion badge', time: '1 day ago', xp: 100, type: 'achievement' },
    { action: 'Started Variables lesson', time: '2 days ago', xp: 50, type: 'lesson' }
  ])
  
  // Achievement System
  const [achievements] = useState([
    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: true, xp: 100 },
    { id: 'quiz-champion', name: 'Quiz Champion', description: 'Score 90% or higher on a quiz', icon: '🧠', unlocked: true, xp: 150 },
    { id: 'speed-coder', name: 'Speed Coder', description: 'Complete a coding challenge in under 5 minutes', icon: '⚡', unlocked: false, xp: 200 },
    { id: 'python-master', name: 'Python Master', description: 'Complete 5 Python lessons', icon: '🐍', unlocked: false, xp: 300 },
    { id: 'streak-warrior', name: 'Streak Warrior', description: 'Maintain a 7-day learning streak', icon: '🔥', unlocked: false, xp: 250 },
    { id: 'perfect-student', name: 'Perfect Student', description: 'Get 100% on 3 quizzes in a row', icon: '⭐', unlocked: false, xp: 400 }
  ])
  
  // Learning Analytics Data
  const [learningAnalytics] = useState({
    strengths: ['variables', 'input-output', 'basic syntax'],
    weakSpots: ['loops', 'functions', 'conditionals'],
    commonErrors: [
      { type: 'SyntaxError', count: 8, concept: 'Variables' },
      { type: 'NameError', count: 5, concept: 'Functions' },
      { type: 'IndentationError', count: 3, concept: 'Loops' }
    ],
    timePerConcept: {
      'Variables': 12,
      'Loops': 18,
      'Functions': 15
    }
  })
  
  // Course curriculum structure
  const courseOutline = [
    { 
      title: 'Python Fundamentals', 
      lessons: ['python-basics-variables', 'python-magic-8-ball'],
      completedCount: 2,
      totalCount: 2,
      category: 'basics'
    },
    { 
      title: 'Programming Logic', 
      lessons: ['python-functions', 'python-lists-loops'],
      completedCount: 0,
      totalCount: 2,
      category: 'intermediate'
    },
    { 
      title: 'File & Data Handling', 
      lessons: ['python-file-handling'],
      completedCount: 0,
      totalCount: 1,
      category: 'advanced'
    }
  ])

  // Celebration triggers - only for real achievements
  const triggerCelebration = useCallback((message: string) => {
    setCelebrationMessage(message)
    setShowCelebration(true)
  }, [])
  
  // Real celebration triggers (removed demo auto-trigger)
  const handleLessonComplete = useCallback((lessonId: string) => {
    // This would be called when returning from a completed lesson
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson) {
      triggerCelebration(`🎉 Lesson Complete: ${lesson.title}!`)
    }
  }, [lessons, triggerCelebration])
  
  const handleQuizComplete = useCallback((score: number) => {
    // This would be called when a quiz is completed with a good score
    if (score >= 90) {
      triggerCelebration('🏆 Perfect Score! You\'re on fire!')
    } else if (score >= 80) {
      triggerCelebration('🎯 Great Job! Keep it up!')
    }
  }, [triggerCelebration])
  
  const handleAchievementUnlock = useCallback((achievementName: string) => {
    // This would be called when a new achievement is unlocked
    triggerCelebration(`🏅 New Achievement: ${achievementName}!`)
  }, [triggerCelebration])

  useEffect(() => {
    // TEMPORARY: Allow dashboard access for testing
    // if (!loading && !isAuthenticated) {
    //   router.push('/auth')
    // }
    
    // Check for celebration triggers from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const celebrationType = urlParams.get('celebrate')
    const lessonId = urlParams.get('lesson')
    const score = urlParams.get('score')
    
    if (celebrationType === 'lesson' && lessonId) {
      handleLessonComplete(lessonId)
      // Clean up URL parameters
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    } else if (celebrationType === 'quiz' && score) {
      handleQuizComplete(parseInt(score))
      // Clean up URL parameters
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    }
  }, [isAuthenticated, loading, router, handleLessonComplete, handleQuizComplete])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
      case 'intermediate': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'advanced': return 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
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
  
  // Gamification Helper Functions
  const getXPLevel = () => {
    return Math.floor(userXP / 500) + 1
  }
  
  const getXPProgress = () => {
    const currentLevel = getXPLevel()
    const xpForCurrentLevel = (currentLevel - 1) * 500
    const xpForNextLevel = currentLevel * 500
    const progressInLevel = userXP - xpForCurrentLevel
    const totalXPNeededForLevel = xpForNextLevel - xpForCurrentLevel
    return (progressInLevel / totalXPNeededForLevel) * 100
  }
  
  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.unlocked)
  }
  
  const getNextRecommendedLesson = () => {
    // Find first lesson that's not completed
    const incompleteLesson = lessons.find(lesson => getProgressForLesson(lesson.id) < 100)
    return incompleteLesson || lessons[0]
  }
  
  const getWeeklyGoalProgress = () => {
    return (weeklyGoal.completed / weeklyGoal.target) * 100
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
  const unlockedAchievements = getUnlockedAchievements()
  const nextLesson = getNextRecommendedLesson()
  const xpLevel = getXPLevel()
  const xpProgress = getXPProgress()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-gray-800/90 backdrop-blur-sm border-r border-purple-500/30 shadow-2xl flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-blue-400 mr-3 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">✨</div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CodeFly ✈️</h1>
              <p className="text-gray-400 text-sm">Where Coding Takes Flight!</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('lessons')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                currentView === 'lessons'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              <span className="font-medium">Lessons</span>
            </button>
            
            <button
              onClick={() => setCurrentView('achievements')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                currentView === 'achievements'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Trophy className="h-5 w-5 mr-3" />
              <span className="font-medium">Achievements</span>
            </button>
            
            <button
              onClick={() => setCurrentView('progress')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                currentView === 'progress'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              <span className="font-medium">Progress</span>
            </button>
            
            <button
              onClick={() => setCurrentView('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                currentView === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              <span className="font-medium">Profile</span>
            </button>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-purple-500/30">
          {/* XP and Level Display */}
          <div className="flex items-center justify-center bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-3 py-2 rounded-xl border border-purple-400/30 mb-3">
            <Star className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
            <span className="font-bold text-sm">{userXP} XP</span>
            <span className="text-purple-200 ml-2 text-sm">• Level {Math.floor(userXP / 500) + 1}</span>
          </div>
          
          {/* User Email */}
          <div className="text-center mb-3">
            <p className="text-gray-300 text-sm truncate">{user?.full_name || user?.email || 'Test User'}</p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center bg-red-600/80 hover:bg-red-600 px-3 py-2 rounded-xl transition-colors border border-red-500/50 text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Header with Current View */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-purple-500/30 shadow-lg">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {currentView === 'lessons' && '📚 Your Learning Journey'}
                  {currentView === 'achievements' && '🏆 Achievements & Badges'}
                  {currentView === 'progress' && '📊 Learning Analytics'}
                  {currentView === 'profile' && '👤 Your Profile'}
                </h2>
                <p className="text-gray-300 mt-1 text-lg">
                  {currentView === 'lessons' && `Welcome back, ${user?.full_name?.split(' ')[0] || 'Student'}! Ready to continue your coding adventure? ✨`}
                  {currentView === 'achievements' && 'Track your coding milestones and celebrate your progress'}
                  {currentView === 'progress' && 'See how far you\'ve come in your learning journey'}
                  {currentView === 'profile' && 'Manage your learning preferences and account settings'}
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{Object.values(userProgress).filter(p => p === 100).length}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{currentStreak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-xs text-gray-400">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
        {/* Lessons View - Default */}
        {currentView === 'lessons' && (
          <>
            {/* Achievement Showcase - Above Lessons */}
            <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">🏆 Your Latest Achievements</h3>
                <button
                  onClick={() => setCurrentView('achievements')}
                  className="text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {achievements.slice(0, 6).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 text-white' 
                        : 'bg-gray-700/50 border-gray-600/50 text-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="text-sm font-bold mb-1">{achievement.name}</h4>
                      <p className="text-xs opacity-75">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          +{achievement.xp} XP
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson Filters */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-white">📚 Your Lessons:</h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedTab('all')}
                    className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-300 ${
                      selectedTab === 'all' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    All ({lessons.length})
                  </button>
                  <button 
                    onClick={() => setSelectedTab('in-progress')}
                    className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-300 ${
                      selectedTab === 'in-progress' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    In Progress ({lessons.filter(l => { const p = getProgressForLesson(l.id); return p > 0 && p < 100; }).length})
                  </button>
                  <button 
                    onClick={() => setSelectedTab('completed')}
                    className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-300 ${
                      selectedTab === 'completed' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Completed ({lessons.filter(l => getProgressForLesson(l.id) === 100).length})
                  </button>
                </div>
              </div>

              {/* Lesson Cards - Main Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const progress = getProgressForLesson(lesson.id)
                  const isCompleted = progress === 100
                  const isStarted = progress > 0

                  return (
                    <div key={lesson.id} className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-500/30 overflow-hidden transform hover:scale-105">
                      <div className="p-6 relative">
                        {/* Lesson Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{lesson.title}</h4>
                            <p className="text-sm text-gray-300 mb-3 line-clamp-2">{lesson.description}</p>
                          </div>
                          {isCompleted && (
                            <div className="flex-shrink-0 ml-2">
                              <Award className="h-6 w-6 text-yellow-400 animate-pulse" />
                              <div className="text-xs text-yellow-400 font-bold mt-1">COMPLETE!</div>
                            </div>
                          )}
                        </div>

                        {/* Lesson Meta */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${{
                            'beginner': 'bg-green-500/20 text-green-400 border border-green-500/30',
                            'intermediate': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                            'advanced': 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }[lesson.difficulty]}`}>
                            {lesson.difficulty} {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🚀' : '🏆'}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.estimatedTime}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {isStarted && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-300">Progress</span>
                              <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-600/50 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <Link href={`/lesson/${lesson.id}`}>
                          <button className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                              : isStarted
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                          }`}>
                            {isCompleted ? '🎉 Review Lesson' : isStarted ? '⚡ Continue Learning' : '🚀 Start Adventure'}
                          </button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Achievements View */}
        {currentView === 'achievements' && (
          <div>
            {/* All Achievements */}
            <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">🏆 All Your Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 text-white' 
                        : 'bg-gray-700/50 border-gray-600/50 text-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-3 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="text-lg font-bold mb-2">{achievement.name}</h4>
                      <p className="text-sm opacity-75 mb-3">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          +{achievement.xp} XP
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Analytics View */}
        {currentView === 'progress' && (
          <div>
            {/* Detailed Learning Analytics */}
            {/* Course Progress Overview */}
            <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">📋 Course Outline & Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courseOutline.map((module, index) => (
                  <div 
                    key={index}
                    onClick={() => setCurrentView('lessons')}
                    className="bg-gray-700/50 hover:bg-gray-600/50 rounded-xl p-6 border border-gray-600/30 cursor-pointer transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-white">{module.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        module.category === 'basics' ? 'bg-green-500/20 text-green-400' :
                        module.category === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {module.category.toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm font-bold text-white">
                          {module.completedCount}/{module.totalCount} lessons
                        </span>
                      </div>
                      <div className="w-full bg-gray-600/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            module.completedCount === module.totalCount 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600'
                          }`}
                          style={{ width: `${(module.completedCount / module.totalCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      {module.completedCount === module.totalCount ? (
                        <span className="flex items-center text-green-400 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </span>
                      ) : module.completedCount > 0 ? (
                        <span className="flex items-center text-yellow-400 text-sm font-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          In Progress
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400 text-sm font-medium">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Not Started
                        </span>
                      )}
                      <span className="text-xs text-gray-400">Click to view lessons</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Learning Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="flex items-center mb-3">
              <Star className="h-8 w-8 text-purple-100 animate-pulse" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-100">Level {xpLevel}</p>
                <p className="text-3xl font-bold text-white">{userXP.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="w-full bg-purple-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
            </div>
            <p className="text-xs text-purple-100 mt-1">{Math.round(500 - (userXP % 500))} XP to next level</p>
          </div>

          {/* Learning Streak Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-orange-100 animate-bounce" />
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-100">Learning Streak</p>
                <p className="text-3xl font-bold text-white">{currentStreak} days</p>
                <p className="text-xs text-orange-100">🔥 Keep it going!</p>
              </div>
            </div>
          </div>

          {/* Weekly Goal Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Target className="h-8 w-8 text-green-100 animate-pulse" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-100">Weekly Goal</p>
                <p className="text-3xl font-bold text-white">{weeklyGoal.completed}/{weeklyGoal.target}</p>
              </div>
            </div>
            <div className="w-full bg-green-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${getWeeklyGoalProgress()}%` }}></div>
            </div>
            <p className="text-xs text-green-100 mt-1">{weeklyGoal.target - weeklyGoal.completed} lessons to go</p>
          </div>

          {/* Learning Time Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <Timer className="h-8 w-8 text-blue-100 animate-spin" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-100">This Week</p>
                <p className="text-3xl font-bold text-white">{totalLearningTime}h</p>
                <p className="text-xs text-blue-100">📚 Learning time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">🏆 Your Achievements</h3>
            <div className="text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 text-white' 
                    : 'bg-gray-700/50 border-gray-600/50 text-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className="text-sm font-bold mb-1">{achievement.name}</h4>
                  <p className="text-xs opacity-75">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      +{achievement.xp}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Next Recommended Lesson */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 animate-pulse" />
              🎯 Recommended Next
            </h3>
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
              <h4 className="text-lg font-bold text-white mb-2">{nextLesson.title}</h4>
              <p className="text-gray-300 mb-3">{nextLesson.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(nextLesson.difficulty)}`}>
                  {nextLesson.difficulty}
                </span>
                <Link
                  href={`/lesson/${nextLesson.id}`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-sm"
                >
                  Continue Learning! 🚀
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 animate-pulse" />
              📈 Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      activity.type === 'lesson' ? 'bg-blue-500' :
                      activity.type === 'achievement' ? 'bg-yellow-500' : 'bg-green-500'
                    } animate-pulse`}></div>
                    <div>
                      <p className="text-white font-medium text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    +{activity.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Analytics */}
        <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 flex items-center">
            <Brain className="h-7 w-7 mr-3 text-blue-400 animate-pulse" />
            🧠 Your Learning Insights
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths & Weak Spots */}
            <div>
              <h4 className="text-lg font-bold text-green-300 mb-3">💪 Your Strengths</h4>
              <div className="space-y-2 mb-4">
                {learningAnalytics.strengths.map((strength, index) => (
                  <div key={index} className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 font-medium capitalize">{strength}</span>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
              
              <h4 className="text-lg font-bold text-orange-300 mb-3">⚠️ Areas to Practice</h4>
              <div className="space-y-2">
                {learningAnalytics.weakSpots.map((weakness, index) => (
                  <div key={index} className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-300 font-medium capitalize">{weakness}</span>
                      <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 font-bold">
                        Practice More 💪
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Common Errors */}
            <div>
              <h4 className="text-lg font-bold text-red-300 mb-3">🐛 Common Errors to Watch</h4>
              <div className="space-y-2">
                {learningAnalytics.commonErrors.map((error, index) => (
                  <div key={index} className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-300 font-medium">{error.type}</span>
                      <span className="text-red-400 text-sm">{error.count} times</span>
                    </div>
                    <p className="text-gray-400 text-sm">in {error.concept}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Your Learning Journey 📚</h3>
            
            {/* Progress Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={() => setSelectedTab('all')}
                className={`px-6 py-3 text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedTab === 'all' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                📋 All Lessons ({lessons.length})
              </button>
              <button 
                onClick={() => setSelectedTab('completed')}
                className={`px-6 py-3 text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedTab === 'completed' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                ✅ Completed ({lessons.filter(l => getProgressForLesson(l.id) === 100).length})
              </button>
              <button 
                onClick={() => setSelectedTab('in-progress')}
                className={`px-6 py-3 text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedTab === 'in-progress' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                ⚡ In Progress ({lessons.filter(l => { const p = getProgressForLesson(l.id); return p > 0 && p < 100; }).length})
              </button>
              <button 
                onClick={() => setSelectedTab('not-started')}
                className={`px-6 py-3 text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedTab === 'not-started' 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                🎯 Not Started ({lessons.filter(l => getProgressForLesson(l.id) === 0).length})
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-gray-300">Filter by Difficulty:</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedDifficulty('all')}
                className={`px-6 py-3 text-sm rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedDifficulty === 'all' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border border-gray-200'
                }`}
              >
                All Lessons ({lessons.length}) ✨
              </button>
              <button 
                onClick={() => setSelectedDifficulty('beginner')}
                className={`px-6 py-3 text-sm rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedDifficulty === 'beginner' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border border-gray-200'
                }`}
              >
                Beginner ({lessons.filter(l => l.difficulty === 'beginner').length}) 🌱
              </button>
              <button 
                onClick={() => setSelectedDifficulty('intermediate')}
                className={`px-6 py-3 text-sm rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedDifficulty === 'intermediate' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border border-gray-200'
                }`}
              >
                Intermediate ({lessons.filter(l => l.difficulty === 'intermediate').length}) 🚀
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const progress = getProgressForLesson(lesson.id)
              const isCompleted = progress === 100
              const isStarted = progress > 0

              return (
                <div key={lesson.id} className="lesson-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6 relative">
                    {/* Floating airplane decoration */}
                    <div className="absolute top-2 right-2 text-2xl opacity-20">✈️</div>
                    {/* Lesson Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{lesson.title}</h4>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2 font-medium">{lesson.description}</p>
                      </div>
                      {isCompleted && (
                        <div className="flex-shrink-0 ml-2">
                          <Award className="h-6 w-6 text-yellow-500 animate-pulse" />
                          <div className="text-xs text-yellow-600 font-bold mt-1">COMPLETE!</div>
                        </div>
                      )}
                    </div>

                    {/* Lesson Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getDifficultyColor(lesson.difficulty)} shadow-md`}>
                        {lesson.difficulty} {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🚀' : '🏆'}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center font-medium bg-gray-100 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {lesson.estimatedTime}
                      </span>
                    </div>

                    {/* Progress Bar and Score */}
                    {isStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">Progress</span>
                          <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-600/50 rounded-full h-3 mb-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {getScoreForLesson(lesson.id) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-purple-300">Quiz Score</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                              getScoreForLesson(lesson.id) >= 90 ? 'bg-green-500 text-white' :
                              getScoreForLesson(lesson.id) >= 80 ? 'bg-yellow-500 text-white' :
                              getScoreForLesson(lesson.id) >= 70 ? 'bg-orange-500 text-white' :
                              'bg-red-500 text-white'
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
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-md ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                          : isStarted
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:shadow-lg'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Award className="h-5 w-5 mr-2 animate-pulse" />
                          Review Lesson 🏆
                        </>
                      ) : isStarted ? (
                        <>
                          <TrendingUp className="h-5 w-5 mr-2 animate-bounce" />
                          Continue Learning ⚡
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-5 w-5 mr-2 animate-pulse" />
                          Start Adventure 🎆
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/30">
          <div className="px-6 py-4 border-b border-purple-500/30">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-400 animate-bounce" />
              🌟 Keep Up the Amazing Work!
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-3xl">🚀</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-sm">✨</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-white mb-2">You&apos;re on fire! Level {xpLevel} coder! 🔥</p>
              <p className="text-sm text-purple-200 bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-4 py-2 rounded-lg inline-block border border-purple-500/30">
                {currentStreak} day streak • {userXP.toLocaleString()} XP earned • {unlockedAchievements.length} achievements unlocked
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Celebration Effect */}
      <CelebrationEffect 
        trigger={showCelebration} 
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  )
}