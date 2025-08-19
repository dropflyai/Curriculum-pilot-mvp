'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAllLessons, Lesson } from '@/lib/lesson-data'
import { BookOpen, Clock, Award, TrendingUp, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lessons] = useState<Lesson[]>(getAllLessons())
  const [userProgress] = useState<Record<string, number>>({})
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

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
      case 'beginner': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
      case 'intermediate': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'advanced': return 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  const getProgressForLesson = (lessonId: string) => {
    return userProgress[lessonId] || 0
  }

  const filteredLessons = selectedDifficulty === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.difficulty === selectedDifficulty)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CodeFly ✈️</h1>
                <p className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">Student Dashboard - Where Coding Takes Flight! 🚀</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-purple-300">
                <User className="h-4 w-4 mr-1" />
                {user?.full_name || user?.email || 'Test User'}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-sm text-purple-300 hover:text-white transition-colors"
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
          </h2>
          <p className="text-xl text-gray-300 font-medium">Ready to code? Let&apos;s make some programming magic happen! ✨</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-100 animate-pulse" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-100">Total Lessons</p>
                <p className="text-3xl font-bold text-white">{lessons.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-100 animate-bounce" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-100">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {Object.values(userProgress).filter(p => p === 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-100 animate-spin" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-100">In Progress</p>
                <p className="text-3xl font-bold text-white">
                  {Object.values(userProgress).filter(p => p > 0 && p < 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-purple-100 animate-pulse" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-100">Avg Score</p>
                <p className="text-3xl font-bold text-white">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Available Lessons 📚</h3>
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

                    {/* Progress Bar */}
                    {isStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
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

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recent Activity \ud83d\udcc8</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="relative inline-block">
                <Clock className="h-16 w-16 mx-auto mb-4 text-indigo-300 animate-spin" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
              </div>
              <p className="text-lg font-semibold text-white mb-2">Ready to start coding? \ud83d\ude80</p>
              <p className="text-sm text-gray-300 bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 py-2 rounded-lg inline-block border border-purple-500/30">Pick a lesson above and let your coding adventure begin!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}