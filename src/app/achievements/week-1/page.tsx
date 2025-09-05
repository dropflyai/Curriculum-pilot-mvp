'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Zap, Shield, Code, Trophy, Gift, ChevronRight, Sparkles, Target, Award, Brain } from 'lucide-react'

export default function Week1Achievements() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [visibleAchievements, setVisibleAchievements] = useState(0)

  // Animation sequence
  useEffect(() => {
    setShowAnimation(true)
    
    // Reveal achievements one by one
    const timer = setInterval(() => {
      setVisibleAchievements(prev => {
        if (prev < achievements.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  const achievements = [
    {
      id: 'first-variable',
      title: 'Variable Master',
      description: 'Created your first Python variables',
      xp: 100,
      icon: Code,
      unlocked: ['Python Syntax Guide', 'Variable Inspector Tool']
    },
    {
      id: 'data-types',
      title: 'Type Detective',
      description: 'Mastered strings, numbers, and booleans',
      xp: 150,
      icon: Target,
      unlocked: ['Data Type Analyzer', 'Type Conversion Tools']
    },
    {
      id: 'conditionals',
      title: 'Logic Commander',
      description: 'Conquered if/else statements',
      xp: 200,
      icon: Shield,
      unlocked: ['Logic Flow Visualizer', 'Conditional Debugger']
    },
    {
      id: 'week-complete',
      title: 'Shadow Protocol Initiate',
      description: 'Completed Week 1 - Operation Beacon',
      xp: 300,
      icon: Trophy,
      unlocked: ['Agent Codename Badge', 'Week 2 Access', 'Special Agent Avatar']
    }
  ]

  const totalXP = achievements.reduce((sum, achievement) => sum + achievement.xp, 0)
  const allUnlocked = achievements.flatMap(a => a.unlocked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        
        {/* Floating Achievement Icons */}
        {showAnimation && (
          <div className="absolute inset-0">
            <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-400 animate-pulse opacity-60" />
            <Star className="absolute top-1/3 right-1/3 w-5 h-5 text-purple-400 animate-bounce opacity-50" />
            <Zap className="absolute bottom-1/3 left-1/3 w-7 h-7 text-blue-400 animate-pulse opacity-40" />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link 
          href="/games"
          className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Main Title */}
        <div className={`text-center mb-12 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-6 h-6 text-purple-400 animate-pulse" />
              <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-6 h-6 text-blue-400 animate-pulse" />
              <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            <Trophy className="h-20 w-20 text-yellow-400 animate-float" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
              MISSION COMPLETE!
            </span>
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">Week 1 - Operation Beacon</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Outstanding work, Agent! You've successfully infiltrated Binary Shores Academy and mastered the fundamental protocols.
          </p>
        </div>

        {/* XP Summary Card */}
        <div className={`bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 mb-8 transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-yellow-400 mr-3" />
              <span className="text-3xl font-bold text-yellow-400">{totalXP} XP EARNED</span>
            </div>
            <p className="text-yellow-200">
              You've gained enough experience to unlock advanced agent protocols!
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            const isVisible = index < visibleAchievements
            
            return (
              <div
                key={achievement.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-700 hover:scale-105 hover:bg-white/15 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Zap className="h-4 w-4" />
                        <span className="font-bold">+{achievement.xp}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-400 flex items-center">
                        <Gift className="h-4 w-4 mr-2" />
                        Unlocked Rewards:
                      </p>
                      {achievement.unlocked.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center text-sm text-gray-300 ml-6">
                          <ChevronRight className="h-3 w-3 mr-2 text-green-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Unlocked Items Summary */}
        <div className={`bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30 mb-8 transition-all duration-1000 delay-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-6">
            <Award className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Agent Arsenal Expanded</h3>
            <p className="text-green-200">
              Your successful completion has unlocked {allUnlocked.length} new tools and abilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUnlocked.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className={`bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 transition-all duration-1000 delay-900 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready for Your Next Mission?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Week 2 - Variable Village awaits! Master loops, functions, and advanced data structures as you infiltrate deeper into the Digital Fortress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz/week-1"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Brain className="h-5 w-5 mr-2" />
                Take Knowledge Quiz
              </Link>
              
              <Link
                href="/mission/operation-beacon/week-2"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Week 2
              </Link>
              
              <Link
                href="/games"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all duration-300"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full border border-slate-600">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Agent Status: ACTIVE</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}