'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Star, Zap, Crown, Sparkles } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  earned: boolean
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface RewardSystemProps {
  onRewardEarned?: (badge: Badge) => void
  show: boolean
  onClose: () => void
  earnedBadges: string[]
  onReturnToMap?: () => void
}

const availableBadges: Badge[] = [
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Completed your first coding lesson',
    icon: Trophy,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20 border-yellow-500/30',
    earned: false,
    xpReward: 100,
    rarity: 'common'
  },
  {
    id: 'coding_master',
    name: 'Coding Master',
    description: 'Successfully executed Python code',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
    earned: false,
    xpReward: 150,
    rarity: 'rare'
  },
  {
    id: 'quiz_champion',
    name: 'Quiz Champion',
    description: 'Scored 80% or higher on a quiz',
    icon: Medal,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    earned: false,
    xpReward: 200,
    rarity: 'epic'
  },
  {
    id: 'adventure_complete',
    name: 'Adventure Complete',
    description: 'Finished an entire coding adventure',
    icon: Crown,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30',
    earned: false,
    xpReward: 300,
    rarity: 'legendary'
  },
  {
    id: 'persistent_learner',
    name: 'Persistent Learner',
    description: 'Completed lesson despite challenges',
    icon: Star,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30',
    earned: false,
    xpReward: 175,
    rarity: 'rare'
  }
]

export default function RewardSystem({ onRewardEarned, show, onClose, earnedBadges, onReturnToMap }: RewardSystemProps) {
  const [animatedBadges, setAnimatedBadges] = useState<string[]>([])
  const [celebrationActive, setCelebrationActive] = useState(false)

  useEffect(() => {
    if (show && earnedBadges.length > 0) {
      setCelebrationActive(true)
      // Animate each badge with a delay
      earnedBadges.forEach((badgeId, index) => {
        setTimeout(() => {
          setAnimatedBadges(prev => [...prev, badgeId])
        }, index * 500)
      })

      // Auto-close after animations and return to dashboard
      const totalDuration = earnedBadges.length * 500 + 4000 // Extra second for celebration
      setTimeout(() => {
        setCelebrationActive(false)
        // Mark lesson as completed
        localStorage.setItem('lesson-completed-1', 'true')
        onClose()
        if (onReturnToMap) {
          onReturnToMap()
        }
      }, totalDuration)
    }
  }, [show, earnedBadges, onClose, onReturnToMap])

  const getRewardedBadges = () => {
    return availableBadges.filter(badge => earnedBadges.includes(badge.id))
  }

  const getTotalXP = () => {
    return getRewardedBadges().reduce((total, badge) => total + badge.xpReward, 0)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      {/* Celebration particles */}
      {celebrationActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="h-6 w-6 text-yellow-400 opacity-70" />
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 max-w-4xl w-full mx-4 border-2 border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-pulse">🏆</div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Congratulations!
          </h2>
          <p className="text-purple-200 text-xl">You've earned amazing rewards for your hard work!</p>
        </div>

        {/* Badges Earned */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🏅 Badges Earned</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRewardedBadges().map((badge) => {
              const IconComponent = badge.icon
              const isAnimated = animatedBadges.includes(badge.id)
              
              return (
                <div
                  key={badge.id}
                  className={`relative p-6 rounded-2xl border-2 ${badge.bgColor} transform transition-all duration-500 ${
                    isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
                  }`}
                >
                  {/* Badge glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-purple-400/10 animate-pulse"></div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${badge.bgColor}`}>
                      {React.createElement(IconComponent as any, { className: `h-12 w-12 ${badge.color}` })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold text-white">{badge.name}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-800 ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{badge.description}</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">+{badge.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Animation sparkles */}
                  {isAnimated && (
                    <div className="absolute -top-2 -right-2">
                      <div className="animate-spin">
                        <Sparkles className="h-6 w-6 text-yellow-400" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* XP Summary */}
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl p-6 border border-purple-500/30 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-2">💎</div>
            <h3 className="text-2xl font-bold text-white mb-2">Total XP Earned</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              +{getTotalXP()} XP
            </p>
            <p className="text-purple-200 mt-2">Keep learning to unlock more rewards!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onClose()
              if (onReturnToMap) {
                onReturnToMap()
              }
            }}
            className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            🏠 Return to Dashboard
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Utility function to determine which badges should be earned
export function getBadgesEarned(lessonProgress: number, quizScore?: number, codeExecuted?: boolean): string[] {
  const earned: string[] = []
  
  if (lessonProgress >= 25) {
    earned.push('first_lesson')
  }
  
  if (codeExecuted) {
    earned.push('coding_master')
  }
  
  if (quizScore && quizScore >= 80) {
    earned.push('quiz_champion')
  }
  
  if (lessonProgress >= 100) {
    earned.push('adventure_complete', 'persistent_learner')
  }
  
  return earned
}