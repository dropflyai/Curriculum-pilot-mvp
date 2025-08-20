'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Star, Trophy, Zap } from 'lucide-react'

interface ProgressCelebrationProps {
  show: boolean
  type: 'section' | 'lesson' | 'achievement'
  message: string
  onComplete?: () => void
}

export default function ProgressCelebration({ 
  show, 
  type, 
  message, 
  onComplete 
}: ProgressCelebrationProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (show) {
      setAnimate(true)
      const timer = setTimeout(() => {
        setAnimate(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case 'section':
        return <CheckCircle className="h-12 w-12 text-green-500 animate-pulse" />
      case 'lesson':
        return <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
      case 'achievement':
        return <Star className="h-12 w-12 text-purple-500 animate-spin" />
      default:
        return <Zap className="h-12 w-12 text-blue-500 animate-pulse" />
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'section':
        return 'from-green-400 to-emerald-500'
      case 'lesson':
        return 'from-yellow-400 to-orange-500'
      case 'achievement':
        return 'from-purple-400 to-pink-500'
      default:
        return 'from-blue-400 to-indigo-500'
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
      animate ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Celebration Card */}
      <div className={`relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full transform transition-all duration-500 ${
        animate ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'
      }`}>
        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🎉</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
        <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</div>
        <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎊</div>
        
        {/* Main Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className={`p-4 rounded-full bg-gradient-to-r ${getGradient()}`}>
              {getIcon()}
            </div>
          </div>
          
          {/* Message */}
          <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}>
            {type === 'section' && 'Section Complete!'}
            {type === 'lesson' && 'Lesson Mastered!'}
            {type === 'achievement' && 'Achievement Unlocked!'}
          </h3>
          
          <p className="text-gray-700 mb-6 text-lg">
            {message}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${getGradient()} animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          
          {/* Encouragement */}
          <div className={`p-4 bg-gradient-to-r ${getGradient()} bg-opacity-10 rounded-lg`}>
            <p className="text-sm font-medium text-gray-600">
              {type === 'section' && "Great progress! Keep learning! 🌟"}
              {type === 'lesson' && "Amazing work! You're becoming a coding champion! 🏆"}
              {type === 'achievement' && "Outstanding! You've unlocked something special! ⭐"}
            </p>
          </div>
        </div>
        
        {/* Animated Border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getGradient()} opacity-20 animate-pulse`}></div>
      </div>
    </div>
  )
}