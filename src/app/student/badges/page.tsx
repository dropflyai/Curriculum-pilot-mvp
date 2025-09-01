'use client'

import { useState, useEffect } from 'react'
import { Award, Star, Lock, Sparkles } from 'lucide-react'

interface Badge {
  id: string
  code: string
  name: string
  description: string
  emoji: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  points: number
  earned: boolean
  earnedAt?: string
  progress?: number
  maxProgress?: number
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [filter, setFilter] = useState<'all' | 'earned' | 'available'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load demo badges data
    const demoBadges: Badge[] = [
      {
        id: '1',
        code: 'FIRST_BUILDER',
        name: 'First Builder',
        description: 'Submit your first project',
        emoji: '🔨',
        rarity: 'COMMON',
        points: 10,
        earned: true,
        earnedAt: '2024-12-10T10:30:00Z'
      },
      {
        id: '2',
        code: 'PYTHON_PRODIGY', 
        name: 'Python Prodigy',
        description: 'Score 90% or higher on Python mini-test',
        emoji: '🐍',
        rarity: 'RARE',
        points: 50,
        earned: true,
        earnedAt: '2024-12-15T14:20:00Z'
      },
      {
        id: '3',
        code: 'STREAK_TOP5_3',
        name: 'Rising Star',
        description: 'Maintain Top 5 leaderboard position for 3 weeks',
        emoji: '📈',
        rarity: 'RARE', 
        points: 30,
        earned: true,
        earnedAt: '2024-12-20T09:00:00Z'
      },
      {
        id: '4',
        code: 'EARLY_BIRD',
        name: 'Early Bird',
        description: 'Submit 5 assignments 24+ hours early',
        emoji: '🌅',
        rarity: 'COMMON',
        points: 15,
        earned: true,
        earnedAt: '2024-12-18T16:45:00Z'
      },
      {
        id: '5',
        code: 'HELPER',
        name: 'Helper',
        description: 'Give helpful peer feedback 10 times',
        emoji: '🤝',
        rarity: 'COMMON',
        points: 20,
        earned: true,
        earnedAt: '2024-12-22T11:15:00Z'
      },
      {
        id: '6',
        code: 'BUG_SLAYER',
        name: 'Bug Slayer',
        description: 'Fix 10 or more bugs in your code',
        emoji: '🐛',
        rarity: 'COMMON',
        points: 20,
        earned: false,
        progress: 7,
        maxProgress: 10
      },
      {
        id: '7',
        code: 'AI_TINKERER',
        name: 'AI Tinkerer', 
        description: 'Complete an AI integration project',
        emoji: '🤖',
        rarity: 'RARE',
        points: 40,
        earned: false
      },
      {
        id: '8',
        code: 'PIXEL_PIONEER',
        name: 'Pixel Pioneer',
        description: 'Complete all web development projects',
        emoji: '🎨',
        rarity: 'RARE',
        points: 45,
        earned: false,
        progress: 2,
        maxProgress: 3
      },
      {
        id: '9',
        code: 'TEAM_MVP',
        name: 'Team MVP',
        description: 'Top contributor on a team project',
        emoji: '⭐',
        rarity: 'EPIC',
        points: 60,
        earned: false
      },
      {
        id: '10',
        code: 'STREAK_TOP5_6',
        name: 'Leaderboard Legend',
        description: 'Maintain Top 5 leaderboard position for 6 weeks',
        emoji: '🏆',
        rarity: 'EPIC',
        points: 75,
        earned: false,
        progress: 3,
        maxProgress: 6
      },
      {
        id: '11',
        code: 'FINAL_BOSS',
        name: 'Final Boss',
        description: 'Score 85% or higher on capstone project',
        emoji: '👑',
        rarity: 'LEGENDARY',
        points: 100,
        earned: false
      }
    ]
    
    setBadges(demoBadges)
    setLoading(false)
  }, [])

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'LEGENDARY': return 'from-yellow-400 to-orange-500'
      case 'EPIC': return 'from-purple-400 to-pink-500'
      case 'RARE': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case 'LEGENDARY': return 'border-yellow-400/50'
      case 'EPIC': return 'border-purple-400/50'
      case 'RARE': return 'border-blue-400/50'
      default: return 'border-gray-400/50'
    }
  }

  const filteredBadges = badges.filter(badge => {
    switch(filter) {
      case 'earned': return badge.earned
      case 'available': return !badge.earned
      default: return true
    }
  })

  const earnedCount = badges.filter(b => b.earned).length
  const totalPoints = badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading badges...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Award className="w-10 h-10 mr-3 text-purple-400" />
            Badge Collection
          </h1>
          <p className="text-purple-200 text-lg">
            Earn badges by completing challenges and reaching milestones
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Badges Earned</h3>
            <p className="text-3xl font-bold text-purple-400">{earnedCount}/{badges.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Badge Points</h3>
            <p className="text-3xl font-bold text-yellow-400">{totalPoints}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Completion</h3>
            <p className="text-3xl font-bold text-pink-400">
              {Math.round((earnedCount / badges.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-1 flex">
            {[
              { id: 'all', label: 'All Badges' },
              { id: 'earned', label: 'Earned' },
              { id: 'available', label: 'Available' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border transition-all hover:scale-105 ${
                badge.earned 
                  ? `${getRarityBorder(badge.rarity)}` 
                  : 'border-white/20 opacity-75'
              }`}
            >
              {/* Earned Indicator */}
              {badge.earned && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <Star className="w-4 h-4" />
                </div>
              )}

              {/* Lock for unearned badges */}
              {!badge.earned && !badge.progress && (
                <div className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full p-2">
                  <Lock className="w-4 h-4" />
                </div>
              )}

              {/* Badge Content */}
              <div className="text-center">
                <div className="text-5xl mb-4">{badge.emoji}</div>
                <h3 className="text-white font-bold text-lg mb-2">{badge.name}</h3>
                <p className="text-purple-200 text-sm mb-4">{badge.description}</p>

                {/* Rarity Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${
                    getRarityColor(badge.rarity)
                  } text-white`}>
                    {badge.rarity}
                  </span>
                </div>

                {/* Progress Bar */}
                {badge.progress && badge.maxProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Progress</span>
                      <span>{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Points */}
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{badge.points} pts</span>
                </div>

                {/* Earned Date */}
                {badge.earned && badge.earnedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next Badge Preview */}
        {filter === 'all' && (
          <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Next Badge to Earn
            </h2>
            <div className="text-center">
              {badges.find(b => !b.earned && b.progress) ? (
                <div>
                  <div className="text-4xl mb-4">
                    {badges.find(b => !b.earned && b.progress)?.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {badges.find(b => !b.earned && b.progress)?.name}
                  </h3>
                  <p className="text-purple-200">
                    {badges.find(b => !b.earned && b.progress)?.description}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-4">🔒</div>
                  <p className="text-purple-200">Keep coding to unlock new badges!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}