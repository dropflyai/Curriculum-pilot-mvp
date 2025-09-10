'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Lock, CheckCircle, Star, Zap, Target, Code2, RefreshCw, FileText, Home } from 'lucide-react'

export default function Week2Overview() {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  const lessons = [
    {
      id: 1,
      title: 'Loop Canyon Base - Mastering Repetition',
      description: 'Infiltrate the automated defense systems using for and while loops',
      status: 'available', // available, locked, completed
      xp: 200,
      estimatedTime: '45 min',
      concepts: ['For Loops', 'While Loops', 'Loop Control', 'Iteration'],
      route: '/mission/binary-shores-academy/week-2/lesson-1'
    },
    {
      id: 2,
      title: 'Function Forest Station - Code Modules',
      description: 'Master modular programming with functions and parameters',
      status: 'available',
      xp: 250,
      estimatedTime: '50 min',
      concepts: ['Function Definition', 'Parameters', 'Return Values', 'Scope'],
      route: '/mission/binary-shores-academy/week-2/lesson-2'
    },
    {
      id: 3,
      title: 'Array Mountains Facility - Data Structures',
      description: 'Navigate complex data with lists and dictionaries',
      status: 'available',
      xp: 300,
      estimatedTime: '60 min',
      concepts: ['Lists', 'Dictionaries', 'Data Access', 'Data Manipulation'],
      route: '/mission/binary-shores-academy/week-2/lesson-3'
    },
    {
      id: 4,
      title: 'Variable Village Outpost - Advanced Operations',
      description: 'Master advanced variable operations and data processing',
      status: 'available',
      xp: 350,
      estimatedTime: '55 min',
      concepts: ['String Methods', 'Math Operations', 'Data Conversion', 'Advanced Logic'],
      route: '/mission/binary-shores-academy/week-2/lesson-4'
    }
  ]

  const totalXP = lessons.reduce((sum, lesson) => sum + lesson.xp, 0)
  const completedLessons = lessons.filter(l => l.status === 'completed').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-400" />
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-500" />
      default:
        return <Play className="h-6 w-6 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/50 bg-green-900/20'
      case 'locked':
        return 'border-gray-600/50 bg-gray-900/20'
      default:
        return 'border-blue-500/50 bg-blue-900/20 hover:border-blue-400/70 hover:bg-blue-900/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/games"
            className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <Home className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>

          <Link 
            href="/achievements/week-1"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-900/30 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-900/50 transition-colors duration-300"
          >
            <Star className="h-4 w-4" />
            <span>View Week 1 Achievements</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Mission Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-6">
            <Target className="h-16 w-16 text-blue-400 animate-float" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
              Week 2: Variable Village
            </span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Binary Shores Academy - Phase 2</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Excellent work completing Week 1, Agent! Now advance deeper into enemy territory. Master advanced programming constructs 
            as you infiltrate the Variable Village defense grid. Loops, functions, and data structures await your expertise.
          </p>
        </div>

        {/* Progress Overview */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8 transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{completedLessons}/4</div>
              <div className="text-gray-300">Lessons Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{totalXP}</div>
              <div className="text-gray-300">Total XP Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">~3.5</div>
              <div className="text-gray-300">Hours Est. Time</div>
            </div>
          </div>
        </div>

        {/* Mission Briefing */}
        <div className={`bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/30 mb-8 transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-start space-x-4">
            <FileText className="h-8 w-8 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">🔐 CLASSIFIED MISSION BRIEFING</h3>
              <div className="text-amber-100 space-y-2 leading-relaxed">
                <p>
                  <strong>AGENT STATUS:</strong> You've successfully infiltrated Binary Shores Academy. Your coding skills have been validated. 
                  Now advance to the Variable Village sector of the Digital Fortress.
                </p>
                <p>
                  <strong>PRIMARY OBJECTIVES:</strong>
                </p>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>Master loop constructs to bypass automated security systems</li>
                  <li>Deploy function modules for code reusability and stealth operations</li>
                  <li>Manipulate complex data structures to access restricted information</li>
                  <li>Execute advanced variable operations for data extraction</li>
                </ul>
                <p>
                  <strong>INTELLIGENCE:</strong> Each facility contains unique defense mechanisms. Study the patterns, adapt your code, and remember - 
                  clean, efficient code is your best weapon against the AI security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lessons.map((lesson, index) => {
            const isAvailable = lesson.status === 'available'
            const isCompleted = lesson.status === 'completed'
            const isLocked = lesson.status === 'locked'
            
            return isAvailable ? (
              <Link
                key={lesson.id}
                href={lesson.route}
                className={`block transition-all duration-700 ${
                  showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${
                  isAvailable ? 'cursor-pointer transform hover:scale-105' : 'cursor-not-allowed'
                }`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all duration-300 ${getStatusColor(lesson.status)}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-600' : isLocked ? 'bg-gray-600' : 'bg-blue-600'}`}>
                      {getStatusIcon(lesson.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white leading-tight">{lesson.title}</h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Zap className="h-4 w-4" />
                          <span className="font-bold">+{lesson.xp}</span>
                        </div>
                      </div>
                      
                      <p className={`mb-4 ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <RefreshCw className="h-4 w-4" />
                          <span>{lesson.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-purple-400 flex items-center">
                          <Code2 className="h-4 w-4 mr-2" />
                          Key Concepts:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.concepts.map((concept, conceptIndex) => (
                            <span
                              key={conceptIndex}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isLocked 
                                  ? 'bg-gray-800 text-gray-500' 
                                  : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isAvailable && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <div className="flex items-center text-blue-400 text-sm font-medium">
                            <Play className="h-4 w-4 mr-2" />
                            Click to Start Mission
                          </div>
                        </div>
                      )}

                      {isLocked && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Lock className="h-4 w-4 mr-2" />
                            Complete previous lessons to unlock
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={lesson.id}
                className={`block transition-all duration-700 cursor-not-allowed ${
                  showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all duration-300 ${getStatusColor(lesson.status)}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-600' : isLocked ? 'bg-gray-600' : 'bg-blue-600'}`}>
                      {getStatusIcon(lesson.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white leading-tight">{lesson.title}</h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Zap className="h-4 w-4" />
                          <span className="font-bold">+{lesson.xp}</span>
                        </div>
                      </div>
                      
                      <p className={`mb-4 ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <RefreshCw className="h-4 w-4" />
                          <span>{lesson.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-purple-400 flex items-center">
                          <Code2 className="h-4 w-4 mr-2" />
                          Key Concepts:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.concepts.map((concept, conceptIndex) => (
                            <span
                              key={conceptIndex}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isLocked 
                                  ? 'bg-gray-800 text-gray-500' 
                                  : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isLocked && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Lock className="h-4 w-4 mr-2" />
                            Complete previous lessons to unlock
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Week 2 Preview Alert */}
        <div className={`bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 transition-all duration-1000 delay-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">🚧 Week 2 Under Development</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Week 2 curriculum is currently being developed with advanced interactive lessons, 
              challenging coding exercises, and immersive Agent Academy storylines. 
            </p>
            
            <div className="bg-white/10 rounded-lg p-4 border border-white/20 mb-6">
              <div className="text-left">
                <p className="text-sm text-gray-300 mb-2">
                  <strong className="text-white">Coming Soon:</strong>
                </p>
                <ul className="text-sm text-gray-300 space-y-1 ml-4">
                  <li>• Interactive loop challenges with real-time visualization</li>
                  <li>• Function debugging missions in the Function Forest</li>
                  <li>• Data structure navigation puzzles</li>
                  <li>• Advanced variable manipulation techniques</li>
                  <li>• New character interactions and story developments</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Return to Dashboard
              </Link>
              
              <Link
                href="/homework/magic-8-ball"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all duration-300"
              >
                Practice with Homework
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}