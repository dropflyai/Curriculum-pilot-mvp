'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Target, Clock, Award, TrendingUp, Trophy, Flame, Crown, Medal, Brain, Search, Rocket, Zap, Users, Shield, ArrowLeft } from 'lucide-react'
import {
  getSpeedLeaderboard,
  getCodeQualityLeaderboard,
  getStreakLeaderboard,
  getCommunityLeaderboard,
  getDiscoveryLeaderboard,
  getConsistencyLeaderboard,
  getMissionRecords,
  formatTime
} from '@/lib/competitive-metrics'
import StandardsCompliancePopup from '@/components/StandardsCompliancePopup'

// Mock data
const courseAgents = [
  { id: 'agent-1', codename: 'Phoenix Cipher', name: 'Alex Chen', avatar: '🔥', level: 12, xp: 2847, weeklyXP: 420, perfectScores: 8, fastestTime: 45, completionRate: 94, streak: 7 },
  { id: 'agent-2', codename: 'Shadow Strike', name: 'Maya Patel', avatar: '⚡', level: 11, xp: 2634, weeklyXP: 380, perfectScores: 6, fastestTime: 52, completionRate: 89, streak: 5 },
  { id: 'agent-3', codename: 'Quantum Wolf', name: 'Jordan Kim', avatar: '🐺', level: 10, xp: 2401, weeklyXP: 350, perfectScores: 7, fastestTime: 38, completionRate: 92, streak: 12 },
  { id: 'agent-4', codename: 'Neo Viper', name: 'Sam Rodriguez', avatar: '🐍', level: 9, xp: 2156, weeklyXP: 290, perfectScores: 5, fastestTime: 41, completionRate: 88, streak: 3 },
  { id: 'agent-5', codename: 'Digital Storm', name: 'Casey Thompson', avatar: '⚡', level: 8, xp: 1923, weeklyXP: 315, perfectScores: 4, fastestTime: 56, completionRate: 85, streak: 8 }
]

const currentAgent = courseAgents[0]

const badgeSystem = [
  { name: 'Recruit', icon: '🔰', xpRequired: 0, unlocks: ['Basic Missions', 'Tutorial Access'] },
  { name: 'Agent', icon: '🎯', xpRequired: 500, unlocks: ['Intermediate Missions', 'Team Chat'] },
  { name: 'Elite Operative', icon: '🏆', xpRequired: 1500, unlocks: ['Advanced Missions', 'Custom Avatar'] },
  { name: 'Cyber Commander', icon: '💎', xpRequired: 3000, unlocks: ['Expert Missions', 'Leadership Tools'] },
  { name: 'Digital Legend', icon: '👑', xpRequired: 5000, unlocks: ['Master Missions', 'Hall of Fame'] }
]

export default function AgentRankings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'speed' | 'accuracy' | 'streaks' | 'missions'>('leaderboard')
  const [speedRecords, setSpeedRecords] = useState<any[]>([])
  const [qualityRecords, setQualityRecords] = useState<any[]>([])
  const [streakRecords, setStreakRecords] = useState<any[]>([])
  const [communityRecords, setCommunityRecords] = useState<any[]>([])
  const [discoveryRecords, setDiscoveryRecords] = useState<any[]>([])
  const [consistencyRecords, setConsistencyRecords] = useState<any[]>([])
  const [missionRecords, setMissionRecords] = useState<any[]>([])
  const [leaderboardView, setLeaderboardView] = useState<'course' | 'weekly' | 'speed' | 'perfect'>('course')
  const [showStandardsPopup, setShowStandardsPopup] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const loadCompetitiveData = async () => {
      try {
        const [speedData, qualityData, streakData, communityData, discoveryData, consistencyData, missionData] = await Promise.all([
          getSpeedLeaderboard(),
          getCodeQualityLeaderboard('clean_code'),
          getStreakLeaderboard('perfect_score'),
          getCommunityLeaderboard(),
          getDiscoveryLeaderboard(),
          getConsistencyLeaderboard(),
          getMissionRecords()
        ])
        
        setSpeedRecords(speedData || [])
        setQualityRecords(qualityData || [])
        setStreakRecords(streakData || [])
        setCommunityRecords(communityData || [])
        setDiscoveryRecords(discoveryData || [])
        setConsistencyRecords(consistencyData || [])
        setMissionRecords(missionData || [])
        
      } catch (error) {
        console.error('Error loading competitive data:', error)
      }
    }
    
    loadCompetitiveData()
  }, [activeTab])

  const currentBadge = badgeSystem.filter(badge => badge.xpRequired <= currentAgent.xp).pop() || badgeSystem[0]

  const getSortedAgents = () => {
    switch (leaderboardView) {
      case 'weekly':
        return [...courseAgents].sort((a, b) => b.weeklyXP - a.weeklyXP).slice(0, 5)
      case 'speed':
        return [...courseAgents].sort((a, b) => a.fastestTime - b.fastestTime)
      case 'perfect':
        return [...courseAgents].sort((a, b) => b.perfectScores - a.perfectScores)
      default:
        return [...courseAgents].sort((a, b) => b.xp - a.xp).slice(0, 10)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Animated Background - Match Mission HQ */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,0,0,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,255,0,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(0,100,255,0.2) 0%, transparent 50%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
          animation: 'scan 8s linear infinite'
        }}></div>
      </div>
      
      {/* Header - Match Mission HQ Style */}
      <div className="relative z-10 bg-black/90 border-b border-green-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-800 rounded-lg flex items-center justify-center animate-pulse">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-400 font-mono">
                    AGENT RANKINGS
                  </h1>
                  <div className="text-sm text-gray-400 font-mono">Competitive Leaderboards</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-500/30">
                  {currentAgent.codename}
                </span>
                <span className="text-yellow-400">Level {currentAgent.level}</span>
                <span className="text-cyan-400">{isClient ? currentBadge.icon : '🔰'} {currentBadge.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/agent-academy-lesson-dashboard"
                className="bg-gray-900/50 hover:bg-gray-900/70 border border-gray-500/50 text-gray-300 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO HQ
              </Link>
              <button 
                onClick={() => setShowStandardsPopup(true)}
                className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-2"
              >
                📋 STANDARDS
              </button>
              <div className="text-right">
                <div className="text-green-400 font-mono text-2xl font-bold">{currentAgent.xp.toLocaleString()} XP</div>
                <div className="text-gray-400 text-sm font-mono">INTEL POINTS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Ranking-specific */}
      <div className="relative z-10 bg-black/80 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-0">
            {[
              { key: 'leaderboard', label: 'WEEKLY TOP 5', icon: '🏆' },
              { key: 'speed', label: 'SPEED RECORDS', icon: '⚡' },
              { key: 'accuracy', label: 'ACCURACY', icon: '🎯' },
              { key: 'streaks', label: 'STREAKS', icon: '🔥' },
              { key: 'missions', label: 'MISSION RECORDS', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-mono transition-all duration-300 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-amber-400 border-amber-400 bg-amber-400/10'
                    : 'text-gray-400 border-transparent hover:text-amber-300 hover:bg-gray-700/30'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-black/80 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-amber-400 mb-2 font-mono">🏆 WEEKLY TOP 5 AGENTS</h2>
              <p className="text-gray-400 font-mono">Updated every Sunday at midnight</p>
            </div>

            <div className="bg-black/80 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="space-y-2">
                {getSortedAgents().slice(0, 5).map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-4 ${agent.id === currentAgent.id ? 'bg-green-500/20 border-l-4 border-green-400' : 'hover:bg-black/40'} transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {index === 0 ? <Crown className="w-8 h-8 text-yellow-400" /> :
                         index === 1 ? <Medal className="w-8 h-8 text-gray-400" /> :
                         index === 2 ? <Medal className="w-8 h-8 text-amber-600" /> :
                         <Trophy className="w-8 h-8 text-purple-400" />}
                        <span className="text-3xl font-bold text-white">#{index + 1}</span>
                      </div>
                      <div className="text-3xl">{agent.avatar}</div>
                      <div>
                        <div className="text-white font-bold">{agent.codename}</div>
                        <div className="text-gray-400 text-sm">{agent.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{agent.xp}</p>
                        <p className="text-purple-200 text-sm">XP</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-xl font-bold text-white">{agent.streak}</span>
                        </div>
                        <p className="text-purple-200 text-sm">Streak</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-purple-400">{agent.perfectScores}</p>
                        <p className="text-purple-200 text-sm">Perfect</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Speed Records Tab */}
        {activeTab === 'speed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/80 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                Lightning Fast Completions
              </h3>
              <div className="space-y-3">
                {(speedRecords.length > 0 ? speedRecords : [
                  { user_name: 'Jordan ⚡', completion_time_seconds: 154, mission_id: 'Binary Shores Academy' },
                  { user_name: 'Alex (You) 🎮', completion_time_seconds: 171, mission_id: 'Variable Village' },
                  { user_name: 'Casey 🚀', completion_time_seconds: 192, mission_id: 'Logic Lake Outpost' },
                  { user_name: 'Morgan 🔥', completion_time_seconds: 208, mission_id: 'Loop Canyon Base' },
                  { user_name: 'Riley ✨', completion_time_seconds: 225, mission_id: 'Function Forest' }
                ]).slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{record.user_name}</p>
                      <p className="text-gray-400 text-sm">{record.mission_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">{formatTime(record.completion_time_seconds)}</p>
                      <p className="text-gray-400 text-xs">time</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/80 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 text-blue-400 mr-2" />
                Code Quality Champions
              </h3>
              <div className="space-y-3">
                {(qualityRecords.length > 0 ? qualityRecords : [
                  { user_name: 'Alex (You) 🎮', clean_code_score: 98, metric: 'Clean Code Score' },
                  { user_name: 'Casey 🚀', clean_code_score: 97, metric: 'Efficiency Rating' },
                  { user_name: 'Jordan ⚡', clean_code_score: 95, metric: 'Best Practices' },
                  { user_name: 'Morgan 🔥', clean_code_score: 94, metric: 'Documentation' },
                  { user_name: 'Riley ✨', clean_code_score: 92, metric: 'Error Handling' }
                ]).slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{record.user_name}</p>
                      <p className="text-gray-400 text-sm">{record.metric || 'Code Quality'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-bold">{record.clean_code_score || record.score}%</p>
                      <p className="text-gray-400 text-xs">quality</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Streaks Tab */}
        {activeTab === 'streaks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/80 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Flame className="w-6 h-6 text-orange-400 mr-2" />
                Perfect Score Streaks
              </h3>
              <div className="space-y-3">
                {(streakRecords.length > 0 ? streakRecords : [
                  { user_name: 'Jordan ⚡', current_streak: 28, is_active: true },
                  { user_name: 'Alex (You) 🎮', current_streak: 19, is_active: true },
                  { user_name: 'Riley ✨', current_streak: 15, is_active: true },
                  { user_name: 'Casey 🚀', current_streak: 12, is_active: false },
                  { user_name: 'Morgan 🔥', current_streak: 8, is_active: true }
                ]).slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{record.user_name}</p>
                      <p className="text-gray-400 text-sm">{record.is_active ? 'Active' : 'Broken'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${record.is_active ? 'text-orange-400' : 'text-gray-400'}`}>{record.current_streak}</p>
                      <p className="text-gray-400 text-xs">perfect</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/80 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 text-cyan-400 mr-2" />
                Community Champions
              </h3>
              <div className="space-y-3">
                {(communityRecords.length > 0 ? communityRecords : [
                  { user_name: 'Alex (You) 🎮', help_points_given: 47, metric: 'Help Points Given' },
                  { user_name: 'Riley ✨', help_points_given: 42, metric: 'Questions Answered' },
                  { user_name: 'Jordan ⚡', help_points_given: 38, metric: 'Code Reviews' },
                  { user_name: 'Casey 🚀', help_points_given: 35, metric: 'Mentorship Hours' },
                  { user_name: 'Morgan 🔥', help_points_given: 31, metric: 'Collaboration Score' }
                ]).slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{record.user_name}</p>
                      <p className="text-gray-400 text-sm">{record.metric || 'Help Points'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">{record.help_points_given || record.score}</p>
                      <p className="text-gray-400 text-xs">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Accuracy Tab */}
        {activeTab === 'accuracy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/80 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 text-blue-400 mr-2" />
                Precision Masters
              </h3>
              <div className="space-y-3">
                {courseAgents.sort((a, b) => b.completionRate - a.completionRate).slice(0, 5).map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{agent.codename}</p>
                      <p className="text-gray-400 text-sm">{agent.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-bold">{agent.completionRate}%</p>
                      <p className="text-gray-400 text-xs">accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/80 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="w-6 h-6 text-green-400 mr-2" />
                Perfect Score Leaders
              </h3>
              <div className="space-y-3">
                {courseAgents.sort((a, b) => b.perfectScores - a.perfectScores).slice(0, 5).map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{agent.codename}</p>
                      <p className="text-gray-400 text-sm">{agent.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">{agent.perfectScores}</p>
                      <p className="text-gray-400 text-xs">perfect</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mission Records Tab */}
        {activeTab === 'missions' && (
          <div className="space-y-6 mb-8">
            <div className="bg-black/80 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Rocket className="w-6 h-6 text-red-400 mr-2" />
                Mission Speed Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(missionRecords.length > 0 ? missionRecords : [
                  { mission_name: 'Binary Shores Academy', fastest_time_seconds: 154, fastest_time_holder_name: 'Jordan ⚡', difficulty_level: 'beginner' },
                  { mission_name: 'Variable Village', fastest_time_seconds: 171, fastest_time_holder_name: 'Alex (You) 🎮', difficulty_level: 'beginner' },
                  { mission_name: 'Logic Lake Outpost', fastest_time_seconds: 252, fastest_time_holder_name: 'Casey 🚀', difficulty_level: 'intermediate' },
                  { mission_name: 'Loop Canyon Base', fastest_time_seconds: 328, fastest_time_holder_name: 'Riley ✨', difficulty_level: 'intermediate' },
                  { mission_name: 'Function Forest', fastest_time_seconds: 435, fastest_time_holder_name: 'Morgan 🔥', difficulty_level: 'advanced' },
                  { mission_name: 'Array Mountains', fastest_time_seconds: 583, fastest_time_holder_name: 'Jordan ⚡', difficulty_level: 'advanced' }
                ]).slice(0, 6).map((record, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">{record.mission_name}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        record.difficulty_level === 'beginner' ? 'bg-green-900/50 text-green-300' :
                        record.difficulty_level === 'intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {record.difficulty_level}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {record.fastest_time_seconds ? formatTime(record.fastest_time_seconds) : 'No record'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{record.fastest_time_holder_name || 'No holder'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Standards Compliance Popup */}
      <StandardsCompliancePopup 
        isOpen={showStandardsPopup}
        onClose={() => setShowStandardsPopup(false)}
      />
      
      {/* Add CSS animations to match Mission HQ */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}