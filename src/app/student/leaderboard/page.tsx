'use client'

import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Flame, Star, Crown, Medal } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  xp: number
  streak: number
  badges: number
  movement: 'UP' | 'DOWN' | 'SAME' | 'NEW'
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load demo leaderboard data
    const demoLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        rank: 1,
        name: 'Alex (You)',
        avatar: '🎮',
        xp: 1250,
        streak: 7,
        badges: 5,
        movement: 'UP'
      },
      {
        id: '2', 
        rank: 2,
        name: 'Jordan',
        avatar: '⚡',
        xp: 1180,
        streak: 12,
        badges: 6,
        movement: 'SAME'
      },
      {
        id: '3',
        rank: 3, 
        name: 'Casey',
        avatar: '🚀',
        xp: 1150,
        streak: 3,
        badges: 4,
        movement: 'DOWN'
      },
      {
        id: '4',
        rank: 4,
        name: 'Morgan',
        avatar: '🔥',
        xp: 1100,
        streak: 5,
        badges: 3,
        movement: 'NEW'
      },
      {
        id: '5',
        rank: 5,
        name: 'Riley',
        avatar: '✨',
        xp: 1050,
        streak: 8,
        badges: 4,
        movement: 'UP'
      }
    ]
    
    setEntries(demoLeaderboard)
    setLoading(false)
  }, [])

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400" />
      case 2: return <Medal className="w-8 h-8 text-gray-400" />
      case 3: return <Medal className="w-8 h-8 text-amber-600" />
      default: return <Star className="w-8 h-8 text-purple-400" />
    }
  }

  const getMovementIcon = (movement: string) => {
    switch(movement) {
      case 'UP': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'DOWN': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      case 'NEW': return <Star className="w-4 h-4 text-yellow-400" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 mr-3 text-yellow-400" />
            Top 5 Leaderboard
          </h1>
          <p className="text-purple-200 text-lg">
            Weekly rankings updated every Sunday at midnight
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white text-center">
              Week of December 16-22, 2024
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-6 rounded-xl transition-all hover:scale-105 ${
                  entry.name.includes('You')
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-6">
                  {/* Rank & Icon */}
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.rank)}
                    <span className="text-3xl font-bold text-white">
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {entry.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {entry.name}
                      </h3>
                      <p className="text-purple-200">Level {Math.floor(entry.xp / 100)}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{entry.xp}</p>
                    <p className="text-purple-200 text-sm">XP</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-xl font-bold text-white">{entry.streak}</span>
                    </div>
                    <p className="text-purple-200 text-sm">Streak</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{entry.badges}</p>
                    <p className="text-purple-200 text-sm">Badges</p>
                  </div>

                  {/* Movement */}
                  <div className="flex items-center space-x-2">
                    {getMovementIcon(entry.movement)}
                    <span className="text-sm text-gray-300 capitalize">
                      {entry.movement.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Your Best Rank</h3>
            <p className="text-3xl font-bold text-yellow-400">#1</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Longest Streak</h3>
            <p className="text-3xl font-bold text-orange-400">14 days</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Weeks in Top 5</h3>
            <p className="text-3xl font-bold text-purple-400">8</p>
          </div>
        </div>
      </div>
    </div>
  )
}