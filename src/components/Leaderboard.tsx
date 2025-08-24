'use client'

import { useState } from 'react'
import { Trophy, Medal, Crown, Star, Zap, Users, Calendar, TrendingUp, Award, Target, Flame, Brain } from 'lucide-react'
import { getMockLeaderboardData, StudentPoints, type LeaderboardData } from '@/lib/points-system'

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly' | 'special'>('weekly')
  const [leaderboardData] = useState<LeaderboardData>(getMockLeaderboardData())

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />
      case 2: return <Medal className="h-6 w-6 text-gray-300" />
      case 3: return <Medal className="h-6 w-6 text-orange-400" />
      default: return <span className="text-gray-400 font-bold text-lg">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500'
      case 3: return 'bg-gradient-to-r from-orange-500 to-orange-600'
      default: return 'bg-gradient-to-r from-blue-600 to-purple-600'
    }
  }

  const getTopStudents = () => {
    switch (activeTab) {
      case 'weekly': return leaderboardData.weekly.slice(0, 10)
      case 'all-time': return leaderboardData.allTime.slice(0, 10)
      case 'special': return leaderboardData.allTime.slice(0, 6) // For special categories display
      default: return leaderboardData.weekly.slice(0, 10)
    }
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">CodeFly Leaderboard 🏆</h2>
              <p className="text-purple-200">Friendly competition to celebrate learning!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-lg">Weekly Challenge</div>
            <div className="text-purple-200 text-sm">Complete 2 lessons + homework</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900/50 p-4 border-b border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'weekly' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Calendar className="h-4 w-4" />
            This Week
          </button>
          <button
            onClick={() => setActiveTab('all-time')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'all-time' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            All Time
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'special' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Star className="h-4 w-4" />
            Special Awards
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'special' ? (
          /* Special Categories */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-4 border border-pink-500/30">
              <h3 className="font-bold text-pink-300 mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                🎨 Creative Coders
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.creativeCoders.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-pink-800/20 rounded p-2">
                    <span className="text-white">{student.studentName}</span>
                    <span className="text-pink-300 text-sm">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
              <h3 className="font-bold text-green-300 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                🤝 Helpful Classmates
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.helpfulClassmates.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-green-800/20 rounded p-2">
                    <span className="text-white">{student.studentName}</span>
                    <span className="text-green-300 text-sm">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-500/30">
              <h3 className="font-bold text-blue-300 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                🚀 Speed Learners
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.speedLearners.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-blue-800/20 rounded p-2">
                    <span className="text-white">{student.studentName}</span>
                    <span className="text-blue-300 text-sm">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 rounded-lg p-4 border border-indigo-500/30">
              <h3 className="font-bold text-indigo-300 mb-3 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                🧠 Deep Thinkers
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.deepThinkers.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-indigo-800/20 rounded p-2">
                    <span className="text-white">{student.studentName}</span>
                    <span className="text-indigo-300 text-sm">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Regular Leaderboard */
          <div className="space-y-4">
            {getTopStudents().map((student, index) => (
              <div 
                key={student.studentId} 
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                  index < 3 
                    ? `${getRankBadge(index + 1)} border-transparent text-white shadow-lg` 
                    : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      {index < 3 && <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-white'}`}>
                        {student.studentName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={index < 3 ? 'text-white/80' : 'text-gray-300'}>
                          Level {student.level}
                        </span>
                        {student.currentStreak > 0 && (
                          <span className={`flex items-center gap-1 ${index < 3 ? 'text-white/80' : 'text-orange-400'}`}>
                            <Flame className="h-4 w-4" />
                            {student.currentStreak} day streak
                          </span>
                        )}
                        <span className={index < 3 ? 'text-white/60' : 'text-gray-400'}>
                          {student.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-xl ${index < 3 ? 'text-white' : 'text-purple-300'}`}>
                      {activeTab === 'weekly' ? student.weeklyXP : student.totalXP} XP
                    </div>
                    <div className="flex gap-1 mt-1">
                      {student.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <span 
                          key={badgeIndex}
                          className={`px-2 py-1 rounded text-xs ${
                            index < 3 ? 'bg-white/20 text-white' : 'bg-purple-600/50 text-purple-200'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                      {student.badges.length > 3 && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          index < 3 ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          +{student.badges.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-900/50 p-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-purple-400 font-bold text-lg">{leaderboardData.allTime.length}</div>
            <div className="text-gray-400 text-sm">Active Students</div>
          </div>
          <div>
            <div className="text-green-400 font-bold text-lg">
              {leaderboardData.allTime.reduce((sum, s) => sum + s.totalXP, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Class XP</div>
          </div>
          <div>
            <div className="text-blue-400 font-bold text-lg">
              {Math.round(leaderboardData.allTime.reduce((sum, s) => sum + s.totalXP, 0) / leaderboardData.allTime.length)}
            </div>
            <div className="text-gray-400 text-sm">Average XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}