'use client'

import React, { useState, useEffect } from 'react'
import { LeaderboardEntry, LeaderboardConfig, generateCurrentWeekLeaderboard, getStudentLeaderboardPosition } from '@/lib/leaderboard-engine'
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award, Crown, Star, Zap, Target, Users, Eye, EyeOff } from 'lucide-react'

interface LeaderboardProps {
  userId?: string
  initialShadowMode?: boolean
  showTopOnly?: boolean
  category?: 'xp' | 'badges' | 'streaks' | 'completion'
  className?: string
}

export default function Leaderboard({ 
  userId, 
  initialShadowMode = false, 
  showTopOnly = false,
  category = 'xp',
  className = '' 
}: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [shadowMode, setShadowMode] = useState(initialShadowMode)
  const [selectedCategory, setSelectedCategory] = useState<'xp' | 'badges' | 'streaks' | 'completion'>(category)
  const [userPosition, setUserPosition] = useState<{ rank: number; total_participants: number; rank_change: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Load leaderboard data
  useEffect(() => {
    loadLeaderboardData()
  }, [shadowMode, selectedCategory])

  const loadLeaderboardData = async () => {
    setIsLoading(true)
    try {
      // Load main leaderboard
      const data = await generateCurrentWeekLeaderboard(shadowMode)
      
      // Sort by selected category
      const sortedData = sortByCategory(data, selectedCategory)
      
      // Apply top-only filter if needed
      const displayData = showTopOnly ? sortedData.slice(0, 10) : sortedData
      setLeaderboardData(displayData)

      // Get user position if userId provided
      if (userId) {
        const position = await getStudentLeaderboardPosition(userId, shadowMode)
        setUserPosition(position)
      }

      setLastUpdated(new Date().toLocaleString())
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      setLeaderboardData([])
    } finally {
      setIsLoading(false)
    }
  }

  const sortByCategory = (data: LeaderboardEntry[], category: string): LeaderboardEntry[] => {
    const sorted = [...data]
    switch (category) {
      case 'xp':
        return sorted.sort((a, b) => b.total_xp - a.total_xp)
      case 'badges':
        return sorted.sort((a, b) => b.badge_count - a.badge_count)
      case 'streaks':
        return sorted.sort((a, b) => b.current_streak - a.current_streak)
      case 'completion':
        return sorted.sort((a, b) => b.assignments_completed - a.assignments_completed)
      default:
        return sorted
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-amber-600" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'xp': return <Zap className="w-4 h-4" />
      case 'badges': return <Star className="w-4 h-4" />
      case 'streaks': return <Target className="w-4 h-4" />
      case 'completion': return <Trophy className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getCategoryValue = (entry: LeaderboardEntry, category: string) => {
    switch (category) {
      case 'xp': return `${entry.total_xp.toLocaleString()} XP`
      case 'badges': return `${entry.badge_count} badges`
      case 'streaks': return `${entry.current_streak} day streak`
      case 'completion': return `${entry.assignments_completed} completed`
      default: return `${entry.total_xp.toLocaleString()} XP`
    }
  }

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-500/20 border-gray-400/30'
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-700/20 border-amber-600/30'
      default: return 'bg-gray-900/40 border-gray-700/30'
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6 ${className}`}>
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="text-gray-400 ml-3">Loading leaderboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">
            Weekly Leaderboard
            {shadowMode && <span className="text-cyan-400 ml-2">👤 Shadow Mode</span>}
          </h2>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Shadow Mode Toggle */}
          <button
            onClick={() => setShadowMode(!shadowMode)}
            className={`p-2 rounded-lg border transition-all ${
              shadowMode 
                ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400' 
                : 'bg-gray-700/30 border-gray-600/30 text-gray-400 hover:border-cyan-400/30'
            }`}
            title={shadowMode ? 'Show real names' : 'Enable shadow mode'}
          >
            {shadowMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Category Selector */}
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            {(['xp', 'badges', 'streaks', 'completion'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Position (if provided) */}
      {userId && userPosition && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getRankIcon(userPosition.rank)}
                <span className="text-white font-semibold">Your Rank: #{userPosition.rank}</span>
              </div>
              <span className="text-gray-400">of {userPosition.total_participants}</span>
              {getRankChangeIcon(userPosition.rank_change)}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Rank Change</div>
              <div className={`font-semibold ${
                userPosition.rank_change > 0 ? 'text-green-400' : 
                userPosition.rank_change < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {userPosition.rank_change > 0 ? `+${userPosition.rank_change}` : userPosition.rank_change || 'No change'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => {
          const actualRank = index + 1
          const isCurrentUser = userId === entry.user_id
          
          return (
            <div
              key={entry.user_id}
              className={`p-4 rounded-lg border transition-all ${getRankBgColor(actualRank)} ${
                isCurrentUser ? 'ring-2 ring-purple-400/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left Side: Rank, Avatar, Name */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(actualRank)}
                    {getRankChangeIcon(entry.rank_change)}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{entry.avatar_emoji}</span>
                    <div>
                      <div className={`font-semibold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                        {entry.display_name}
                        {entry.is_shadow && (
                          <span className="ml-2 text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                            Shadow
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {entry.current_level} • {getCategoryValue(entry, selectedCategory)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {getCategoryValue(entry, selectedCategory)}
                  </div>
                  <div className="text-xs text-gray-400 space-x-4">
                    <span>🏆 {entry.badge_count}</span>
                    <span>🔥 {entry.current_streak}d</span>
                    <span>✅ {entry.assignments_completed}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {leaderboardData.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No leaderboard data available yet.</p>
          <p className="text-gray-500 text-sm">Complete some assignments to join the rankings!</p>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last updated: {lastUpdated}</span>
            <span>{leaderboardData.length} participants</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Sub-components for specialized leaderboards
export function WeeklyLeaderboard({ userId, className }: { userId?: string; className?: string }) {
  return (
    <Leaderboard 
      userId={userId}
      category="xp"
      className={className}
      showTopOnly={false}
    />
  )
}

export function TopPerformersLeaderboard({ shadowMode = true, className }: { shadowMode?: boolean; className?: string }) {
  return (
    <Leaderboard 
      initialShadowMode={shadowMode}
      category="xp"
      className={className}
      showTopOnly={true}
    />
  )
}

export function BadgeLeaderboard({ userId, className }: { userId?: string; className?: string }) {
  return (
    <Leaderboard 
      userId={userId}
      category="badges"
      className={className}
      showTopOnly={false}
    />
  )
}

export function StreakLeaderboard({ userId, className }: { userId?: string; className?: string }) {
  return (
    <Leaderboard 
      userId={userId}
      category="streaks"
      className={className}
      showTopOnly={false}
    />
  )
}