'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { WeeklyLeaderboard, TopPerformersLeaderboard, BadgeLeaderboard, StreakLeaderboard } from '@/components/Leaderboard'
import { leaderboardEngine } from '@/lib/leaderboard-engine'
import { Trophy, Medal, Award, Crown, Star, Zap, Target, Calendar, TrendingUp, Users, Settings, Info } from 'lucide-react'

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'weekly' | 'badges' | 'streaks' | 'analytics'>('weekly')
  const [weeklyTrends, setWeeklyTrends] = useState<any>(null)
  const [showShadowMode, setShowShadowMode] = useState(false)

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics()
    }
  }, [activeTab])

  const loadAnalytics = async () => {
    try {
      const trends = await leaderboardEngine.getWeeklyTrends(4)
      setWeeklyTrends(trends)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'weekly', label: 'Weekly Rankings', icon: Calendar },
    { id: 'badges', label: 'Badge Champions', icon: Star },
    { id: 'streaks', label: 'Streak Leaders', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CodeFly Leaderboard</h1>
                <p className="text-gray-300">Celebrate learning achievements and friendly competition! ✈️</p>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShadowMode(!showShadowMode)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  showShadowMode 
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400' 
                    : 'bg-gray-700/30 border-gray-600/30 text-gray-300 hover:border-cyan-400/30'
                }`}
              >
                {showShadowMode ? '👤 Shadow Mode' : '👁️ Show Names'}
              </button>
              <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-gray-800/50 rounded-xl p-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'weekly' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weekly Leaderboard */}
              <div className="lg:col-span-2">
                <WeeklyLeaderboard userId={user?.id} />
              </div>
              
              {/* Top 10 Sidebar */}
              <div className="space-y-6">
                <TopPerformersLeaderboard shadowMode={showShadowMode} />
                
                {/* Weekly Stats Card */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                    This Week's Progress
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Class XP</span>
                      <span className="text-green-400 font-semibold">12,450 XP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Students</span>
                      <span className="text-blue-400 font-semibold">24/28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Completion</span>
                      <span className="text-purple-400 font-semibold">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BadgeLeaderboard userId={user?.id} />
              
              {/* Badge Statistics */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    Badge Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                      <div className="text-2xl font-bold text-yellow-400">127</div>
                      <div className="text-xs text-gray-400">Total Badges</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
                      <div className="text-2xl font-bold text-purple-400">18</div>
                      <div className="text-xs text-gray-400">Badge Types</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                      <div className="text-2xl font-bold text-green-400">89%</div>
                      <div className="text-xs text-gray-400">Students with Badges</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-400/20">
                      <div className="text-2xl font-bold text-orange-400">4.5</div>
                      <div className="text-xs text-gray-400">Avg per Student</div>
                    </div>
                  </div>
                </div>

                {/* Most Popular Badges */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Most Popular Badges</h3>
                  <div className="space-y-3">
                    {[
                      { emoji: '🚀', name: 'First Run', count: 28 },
                      { emoji: '🏆', name: 'Quiz Champion', count: 22 },
                      { emoji: '⚡', name: 'Speed Coder', count: 19 },
                      { emoji: '🐍', name: 'Python Master', count: 15 },
                      { emoji: '🔥', name: 'Streak Warrior', count: 12 }
                    ].map((badge, index) => (
                      <div key={badge.name} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{badge.emoji}</span>
                          <span className="text-white font-medium">{badge.name}</span>
                        </div>
                        <span className="text-cyan-400 font-semibold">{badge.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'streaks' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StreakLeaderboard userId={user?.id} />
              
              {/* Streak Analytics */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 text-orange-400 mr-2" />
                    Streak Analytics
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-400/20">
                      <div className="text-2xl font-bold text-orange-400 mb-1">12 days</div>
                      <div className="text-sm text-gray-400">Longest Class Streak</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                        <div className="text-lg font-bold text-red-400">5.2</div>
                        <div className="text-xs text-gray-400">Avg Streak</div>
                      </div>
                      <div className="text-center p-3 bg-pink-500/10 rounded-lg border border-pink-400/20">
                        <div className="text-lg font-bold text-pink-400">15</div>
                        <div className="text-xs text-gray-400">Active Streaks</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Streak Motivation */}
                <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-xl border border-orange-400/30 p-6">
                  <h3 className="text-lg font-semibold text-orange-300 mb-3">🔥 Streak Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      Complete at least one lesson daily to maintain your streak
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      Streaks reset at midnight - plan your coding time!
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      Even 10 minutes of practice counts toward your streak
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trends */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  Weekly Trends
                </h3>
                {weeklyTrends ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                        <div className="text-xl font-bold text-green-400">
                          {weeklyTrends.engagement_trend === 'increasing' ? '📈' : 
                           weeklyTrends.engagement_trend === 'decreasing' ? '📉' : '➡️'}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">{weeklyTrends.engagement_trend}</div>
                      </div>
                      <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <div className="text-xl font-bold text-blue-400">{weeklyTrends.weekly_totals.length}</div>
                        <div className="text-sm text-gray-400">Weeks Tracked</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Top Performers (4 weeks)</h4>
                      <div className="space-y-2">
                        {weeklyTrends.top_performers.slice(0, 5).map((performer: any, index: number) => (
                          <div key={performer.user_id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                              <span className="text-white">{performer.display_name}</span>
                            </div>
                            <span className="text-cyan-400 font-semibold">{performer.average_weekly_xp} XP/week</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-3"></div>
                    <p className="text-gray-400">Loading analytics...</p>
                  </div>
                )}
              </div>

              {/* Class Insights */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 text-purple-400 mr-2" />
                    Class Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Participation Rate</span>
                        <span className="text-purple-400 font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Weekly Goal Achievement</span>
                        <span className="text-cyan-400 font-semibold">76%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Assignment Completion</span>
                        <span className="text-green-400 font-semibold">84%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-400/30 p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">📊 Competition Benefits</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Friendly competition motivates consistent learning
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Shadow mode maintains privacy while encouraging participation
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Multiple categories celebrate different strengths
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Weekly resets give everyone fresh opportunities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <Info className="w-4 h-4" />
            <span>Leaderboard updates every 30 minutes • Privacy-first design with shadow mode</span>
          </div>
        </div>
      </div>
    </div>
  )
}