'use client'

import { useState, useEffect } from 'react'
import { useSound } from './SoundEffects'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  category: 'coding' | 'speed' | 'completion' | 'special'
}

interface AchievementSystemProps {
  achievements: Achievement[]
  showUnlockedOnly?: boolean
  onAchievementUnlock?: (achievement: Achievement) => void
  className?: string
}

const rarityColors = {
  common: {
    border: 'border-gray-400',
    bg: 'bg-gray-500/20',
    text: 'text-gray-300',
    glow: 'shadow-gray-500/20'
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    glow: 'shadow-blue-500/30'
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/40'
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    glow: 'shadow-yellow-500/50'
  }
}

export default function AchievementSystem({ 
  achievements, 
  showUnlockedOnly = false,
  onAchievementUnlock,
  className = ''
}: AchievementSystemProps) {
  const [filter, setFilter] = useState<'all' | 'coding' | 'speed' | 'completion' | 'special'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'rarity' | 'category'>('recent')
  const { playSound } = useSound()

  const filteredAchievements = achievements
    .filter(achievement => showUnlockedOnly ? achievement.unlocked : true)
    .filter(achievement => filter === 'all' ? true : achievement.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          if (!a.unlockedAt && !b.unlockedAt) return 0
          if (!a.unlockedAt) return 1
          if (!b.unlockedAt) return -1
          return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
        case 'rarity':
          const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 }
          return rarityOrder[a.rarity] - rarityOrder[b.rarity]
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionRate = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-lg border-2 border-purple-400/40 rounded-lg"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-bounce">🏆</div>
              <div>
                <h2 className="text-2xl font-bold text-purple-400 font-mono tracking-wider">
                  [AGENT ACHIEVEMENTS]
                </h2>
                <p className="text-purple-300 font-mono text-sm">
                  Mission Accomplishments & Honors
                </p>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="rgba(168, 85, 247, 0.2)" 
                  strokeWidth="8" 
                  fill="none"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#A855F7" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-purple-400 font-mono font-bold text-lg">{completionRate}%</div>
                  <div className="text-purple-300 font-mono text-xs">COMPLETE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-black/40 border border-purple-400/30 p-3 text-center rounded">
              <div className="text-purple-400 font-mono text-xl font-bold">{unlockedCount}</div>
              <div className="text-purple-300 font-mono text-xs">UNLOCKED</div>
            </div>
            <div className="bg-black/40 border border-yellow-400/30 p-3 text-center rounded">
              <div className="text-yellow-400 font-mono text-xl font-bold">
                {achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
              </div>
              <div className="text-yellow-300 font-mono text-xs">LEGENDARY</div>
            </div>
            <div className="bg-black/40 border border-blue-400/30 p-3 text-center rounded">
              <div className="text-blue-400 font-mono text-xl font-bold">
                {achievements.reduce((sum, a) => sum + (a.unlocked ? a.xpReward : 0), 0)}
              </div>
              <div className="text-blue-300 font-mono text-xs">BONUS XP</div>
            </div>
            <div className="bg-black/40 border border-green-400/30 p-3 text-center rounded">
              <div className="text-green-400 font-mono text-xl font-bold">{totalCount}</div>
              <div className="text-green-300 font-mono text-xs">TOTAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['all', 'coding', 'speed', 'completion', 'special'].map(category => (
          <button
            key={category}
            onClick={() => setFilter(category as any)}
            className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 ${
              filter === category
                ? 'bg-purple-600 text-white border-2 border-purple-400'
                : 'bg-gray-700/50 text-gray-300 border-2 border-transparent hover:bg-gray-600/50'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const colors = rarityColors[achievement.rarity]
          
          return (
            <div
              key={achievement.id}
              className={`relative group transition-all duration-300 hover:scale-105 ${
                achievement.unlocked ? 'animate-glow-pulse' : 'opacity-60'
              }`}
            >
              {/* Achievement Card */}
              <div className={`
                relative border-2 ${colors.border} ${colors.bg} rounded-lg p-6
                ${achievement.unlocked ? `shadow-lg ${colors.glow}` : 'shadow-sm'}
                backdrop-blur-sm transition-all duration-300
              `}>
                {/* Rarity Indicator */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono font-bold
                  ${colors.bg} ${colors.border} border ${colors.text}`}>
                  {achievement.rarity.toUpperCase()}
                </div>

                {/* Shine effect for unlocked achievements */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}

                {/* Icon */}
                <div className={`text-6xl mb-4 text-center ${achievement.unlocked ? 'animate-character-talk' : 'grayscale'}`}>
                  {achievement.icon}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold font-mono ${colors.text} text-center`}>
                    {achievement.title}
                  </h3>
                  <p className="text-gray-300 text-sm text-center font-mono">
                    {achievement.description}
                  </p>

                  {/* Progress Bar (if applicable) */}
                  {achievement.maxProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">PROGRESS</span>
                        <span className={colors.text}>
                          {achievement.progress || 0}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full border border-gray-600">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            achievement.unlocked ? 'bg-gradient-to-r from-green-500 to-green-400' : `bg-gradient-to-r ${colors.bg.replace('/20', '/60')}`
                          }`}
                          style={{ width: `${Math.min(100, ((achievement.progress || 0) / achievement.maxProgress) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* XP Reward */}
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <span className="text-yellow-400 text-xl">⚡</span>
                    <span className="text-yellow-400 font-mono font-bold">
                      +{achievement.xpReward} XP
                    </span>
                  </div>

                  {/* Unlock Date */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 font-mono">
                        UNLOCKED: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lock Indicator */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-4xl text-gray-500">🔒</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <div className="text-gray-400 font-mono">
            No achievements found for this filter.
          </div>
        </div>
      )}
    </div>
  )
}

// Sample achievements data for demo
export const demoAchievements: Achievement[] = [
  {
    id: 'first-code',
    title: 'Hello, World!',
    description: 'Execute your first line of code',
    icon: '👋',
    rarity: 'common',
    xpReward: 50,
    unlocked: true,
    unlockedAt: '2024-01-15',
    category: 'coding'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a challenge in under 10 seconds',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 150,
    unlocked: true,
    unlockedAt: '2024-01-18',
    category: 'speed'
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all weekly challenges without errors',
    icon: '🎯',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false,
    progress: 4,
    maxProgress: 7,
    category: 'completion'
  },
  {
    id: 'code-master',
    title: 'Code Master',
    description: 'Achieve mastery in all core programming concepts',
    icon: '🏆',
    rarity: 'legendary',
    xpReward: 500,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: 'coding'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete challenges between midnight and 6 AM',
    icon: '🦉',
    rarity: 'rare',
    xpReward: 200,
    unlocked: true,
    unlockedAt: '2024-01-20',
    category: 'special'
  }
]