'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Target, Clock, Award, TrendingUp, Trophy, Flame, Crown, Medal, Brain, Search, Rocket, Zap, Users, Shield } from 'lucide-react'
import AAAGameMap from '@/components/AAAGameMap'
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

const missionStatus = {
  progress: 23.5,
  timeRemaining: '04:32',
  objectivesComplete: 2,
  totalObjectives: 8
}

export default function AgentAcademyDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'missionmap' | 'rankings'>('overview')
  // Removed ranking-related state variables since rankings are now on separate page
  const [showStandardsPopup, setShowStandardsPopup] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentTime, setCurrentTime] = useState('14:35:22')
  const [randomRank, setRandomRank] = useState(1)
  const [calculatedLocations, setCalculatedLocations] = useState(0)

  useEffect(() => {
    setIsClient(true)
    // Set client-only values that would cause hydration mismatch
    setRandomRank(Math.floor(Math.random() * 5) + 1)
    setCalculatedLocations(Math.floor(currentAgent.xp / 100))
  }, [])

  // Remove competitive data loading since rankings are now on separate page

  const currentBadge = badgeSystem.filter(badge => badge.xpRequired <= currentAgent.xp).pop() || badgeSystem[0]

  useEffect(() => {
    if (isClient) {
      // Only start the interval on client side to avoid hydration mismatch
      const interval = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isClient])

  const handleMissionLaunch = (missionType: string) => {
    switch (missionType) {
      case 'continue':
        router.push('/mission/binary-shores-academy')
        break
      case 'analysis':
        router.push('/analytics/performance')
        break
      case 'upgrade':
        router.push('/store/equipment')
        break
      case 'emergency':
        router.push('/support/help')
        break
    }
  }

  // Removed getSortedAgents function - now handled in rankings page

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
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-green-400 font-mono">
                    AGENT ACADEMY HQ
                  </h1>
                  <div className="text-sm text-gray-400 font-mono">Command & Control Center</div>
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

      {/* Navigation Tabs - Tactical Style */}
      <div className="relative z-10 bg-black/80 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-0">
            {[
              { key: 'overview', label: 'TACTICAL HQ', icon: '🎯' },
              { key: 'missionmap', label: 'MISSION MAP', icon: '🗺️' },
              { key: 'rankings', label: 'AGENT RANKINGS', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'rankings') {
                    router.push('/agent-rankings')
                  } else {
                    setActiveTab(tab.key as any)
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-4 font-mono transition-all duration-300 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-green-400 border-green-400 bg-green-400/10'
                    : 'text-gray-400 border-transparent hover:text-green-300 hover:bg-gray-700/30'
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
        {activeTab === 'overview' && (
          <div className="space-y-8 relative">
            {/* Stats Grid - Exact Mission HQ Style Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
              <div
                className="relative group cursor-pointer transition-all duration-300"
                onClick={() => router.push('/mission/binary-shores-academy')}
              >
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-blue-500/50 transition-all">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/CodeFly Homepage.png")`,
                      filter: 'brightness(0.5)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono px-1 py-0.5 rounded bg-blue-900/80 text-blue-300">
                          ACTIVE
                        </span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Binary Shores Academy</h3>
                      <p className="text-xs text-gray-400 font-mono">OPERATION-01</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">Primary agent academy training operation</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{Math.round(missionStatus.progress)}%</span>
                        <span className="text-yellow-400">1,250 XP</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full h-1 bg-gray-800 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{width: `${missionStatus.progress}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className="relative group cursor-pointer transition-all duration-300"
                onClick={() => router.push('/agent-rankings')}
              >
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-amber-500/50 transition-all">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/CodeFly Homepage 2.png")`,
                      filter: 'brightness(0.5)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono px-1 py-0.5 rounded bg-amber-900/80 text-amber-300">
                          AVAILABLE
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Agent Rankings</h3>
                      <p className="text-xs text-gray-400 font-mono">RANK-SYSTEM</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">View rankings, speed records, and achievements</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">Rank #{isClient ? randomRank : 1}</span>
                        <span className="text-yellow-400">850 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className="relative group cursor-pointer transition-all duration-300"
                onClick={() => alert('Skills Assessment coming soon!')}
              >
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/CodeFly Homepage 3.png")`,
                      filter: 'brightness(0.5)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono px-1 py-0.5 rounded bg-yellow-900/80 text-yellow-300">
                          AVAILABLE
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Skills Assessment</h3>
                      <p className="text-xs text-gray-400 font-mono">EVAL-SYSTEM</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">Python fundamentals and coding challenges</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{missionStatus.objectivesComplete}/{missionStatus.totalObjectives} Skills</span>
                        <span className="text-yellow-400">2,100 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className="relative group cursor-pointer transition-all duration-300"
                onClick={() => setActiveTab('missionmap')}
              >
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-red-500/50 transition-all">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/CodeFly Homepage.png")`,
                      filter: 'brightness(0.5)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono px-1 py-0.5 rounded bg-red-900/80 text-red-300">
                          SUPPORT
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Mission Map</h3>
                      <p className="text-xs text-gray-400 font-mono">NAV-SYSTEM</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">Navigate operations and track progress</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{isClient ? calculatedLocations : Math.floor(2847 / 100)} Locations</span>
                        <span className="text-yellow-400">500 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Grid - Exact Copy from Mission HQ */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 font-mono flex items-center gap-3">
                <Target className="w-6 h-6" />
                AGENT ACADEMY OPERATIONS
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {/* Agent Academy Control Mission */}
                <div
                  className="relative group cursor-pointer transition-all duration-300"
                  onClick={() => handleMissionLaunch('continue')}
                >
                  {/* Mission Card */}
                  <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-green-500/50 transition-all">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("/CodeFly Homepage.png")`,
                        filter: 'brightness(0.5)'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono px-1 py-0.5 rounded bg-green-900/80 text-green-300">
                            ACTIVE
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-0.5">BINARY SHORES ACADEMY</h3>
                        <p className="text-xs text-gray-400 font-mono">OPERATION: INTRODUCTION & SETUP</p>
                      </div>
                      
                      {/* Footer */}
                      <div>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">Learn Python basics and AI agent fundamentals. Master the core concepts needed for advanced operations.</p>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-400">{missionStatus.timeRemaining} REMAIN</span>
                          <span className="text-yellow-400">{currentAgent.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{width: `${missionStatus.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Analysis Mission */}
                <div
                  className="relative group cursor-pointer transition-all duration-300"
                  onClick={() => handleMissionLaunch('analysis')}
                >
                  {/* Mission Card */}
                  <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-blue-500/50 transition-all">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("/CodeFly Homepage 2.png")`,
                        filter: 'brightness(0.5)'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono px-1 py-0.5 rounded bg-blue-900/80 text-blue-300">
                            AVAILABLE
                          </span>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-0.5">PERFORMANCE ANALYSIS</h3>
                        <p className="text-xs text-gray-400 font-mono">OPERATION: DATA REVIEW</p>
                      </div>
                      
                      {/* Footer */}
                      <div>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">Analyze your progress and identify areas for improvement in your agent training.</p>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-400">AVAILABLE</span>
                          <span className="text-yellow-400">500 XP</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                              style={{width: '0%'}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipment Upgrade Mission */}
                <div
                  className="relative group cursor-pointer transition-all duration-300"
                  onClick={() => handleMissionLaunch('upgrade')}
                >
                  {/* Mission Card */}
                  <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("/CodeFly Homepage 3.png")`,
                        filter: 'brightness(0.5)'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono px-1 py-0.5 rounded bg-yellow-900/80 text-yellow-300">
                            AVAILABLE
                          </span>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-0.5">EQUIPMENT UPGRADE</h3>
                        <p className="text-xs text-gray-400 font-mono">OPERATION: TECH ENHANCEMENT</p>
                      </div>
                      
                      {/* Footer */}
                      <div>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">Upgrade your agent equipment and unlock new capabilities for advanced missions.</p>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-400">AVAILABLE</span>
                          <span className="text-yellow-400">750 XP</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                              style={{width: '0%'}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Support Mission */}
                <div
                  className="relative group cursor-pointer transition-all duration-300"
                  onClick={() => handleMissionLaunch('emergency')}
                >
                  {/* Mission Card */}
                  <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-red-500/50 transition-all">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("/CodeFly Homepage.png")`,
                        filter: 'brightness(0.5)'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono px-1 py-0.5 rounded bg-red-900/80 text-red-300">
                            SUPPORT
                          </span>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-0.5">EMERGENCY SUPPORT</h3>
                        <p className="text-xs text-gray-400 font-mono">OPERATION: ASSISTANCE</p>
                      </div>
                      
                      {/* Footer */}
                      <div>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">Access emergency support protocols and get assistance with critical mission elements.</p>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-400">24/7 ACCESS</span>
                          <span className="text-yellow-400">SUPPORT</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                              style={{width: '100%'}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missionmap' && (
          <div className="w-full">
            <AAAGameMap />
          </div>
        )}

        {/* Rankings link now redirects to dedicated page */}
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