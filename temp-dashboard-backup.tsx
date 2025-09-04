'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Enhanced AAA quality 3D map with advanced rendering - YOUR CUSTOM MAP
const AAAGameMap = dynamic(() => import('@/components/AAAGameMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
        <div className="text-2xl text-white font-bold mb-2">Loading Unreal-Quality 3D World...</div>
        <p className="text-gray-400 animate-pulse">Rendering Agent Academy missions... 🎮</p>
      </div>
    </div>
  )
})

// XP-based badge progression system
const badgeSystem = [
  { name: 'Recruit', xpRequired: 0, icon: '🔰', unlocks: ['Basic Avatar'], color: 'gray' },
  { name: 'Agent', xpRequired: 500, icon: '🕵️', unlocks: ['Spy Avatars'], color: 'blue' },
  { name: 'Field Operative', xpRequired: 1200, icon: '🎯', unlocks: ['Mission Hints'], color: 'green' },
  { name: 'Senior Agent', xpRequired: 2000, icon: '⭐', unlocks: ['Code Shortcuts'], color: 'purple' },
  { name: 'Master Spy', xpRequired: 3500, icon: '👑', unlocks: ['Custom Themes'], color: 'gold' },
  { name: 'Shadow Legend', xpRequired: 5000, icon: '🏆', unlocks: ['Exclusive Characters'], color: 'rainbow' },
]

// Competitive agent data with full stats
const courseAgents = [
  { id: 1, codename: 'Agent Phoenix', name: 'Alex Chen', xp: 2150, level: 5, fastestTime: 8.2, perfectScores: 12, weeklyXP: 380, streak: 7, completionRate: 94, avatar: '🔥' },
  { id: 2, codename: 'Shadow Viper', name: 'Maya Singh', xp: 2890, level: 6, fastestTime: 6.8, perfectScores: 18, weeklyXP: 420, streak: 12, completionRate: 98, avatar: '🐍' },
  { id: 3, codename: 'Agent Wolf', name: 'Jordan Kim', xp: 3200, level: 7, fastestTime: 7.1, perfectScores: 22, weeklyXP: 510, streak: 15, completionRate: 96, avatar: '🐺' },
  { id: 4, codename: 'Binary Ghost', name: 'Sam Rivera', xp: 1980, level: 4, fastestTime: 9.5, perfectScores: 8, weeklyXP: 280, streak: 4, completionRate: 87, avatar: '👻' },
  { id: 5, codename: 'Quantum Raven', name: 'Riley Park', xp: 2750, level: 6, fastestTime: 7.8, perfectScores: 15, weeklyXP: 390, streak: 9, completionRate: 92, avatar: '🐦‍⬛' },
  { id: 6, codename: 'Stealth Tiger', name: 'Casey Liu', xp: 1750, level: 4, fastestTime: 10.2, perfectScores: 6, weeklyXP: 240, streak: 3, completionRate: 82, avatar: '🐅' },
  { id: 7, codename: 'Hack Falcon', name: 'Avery Chen', xp: 2450, level: 5, fastestTime: 8.9, perfectScores: 14, weeklyXP: 360, streak: 6, completionRate: 90, avatar: '🦅' },
  { id: 8, codename: 'Code Panther', name: 'Morgan Davis', xp: 3100, level: 7, fastestTime: 6.4, perfectScores: 20, weeklyXP: 480, streak: 11, completionRate: 97, avatar: '🐆' },
  { id: 9, codename: 'Data Shark', name: 'Sage Wilson', xp: 1650, level: 3, fastestTime: 11.1, perfectScores: 4, weeklyXP: 200, streak: 2, completionRate: 78, avatar: '🦈' },
  { id: 10, codename: 'Logic Dragon', name: 'Rowan Taylor', xp: 2600, level: 5, fastestTime: 7.6, perfectScores: 16, weeklyXP: 410, streak: 8, completionRate: 93, avatar: '🐲' }
]

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'questmap' | 'leaderboard'>('overview')
  const [leaderboardView, setLeaderboardView] = useState<'course' | 'weekly' | 'speed' | 'perfect'>('course')
  const [notifications, setNotifications] = useState<Array<{id: string, type: string, message: string, timestamp: Date}>>([])
  const [missionStatus, setMissionStatus] = useState({
    currentMission: 'Shadow Protocol',
    progress: 73,
    timeRemaining: '12:34',
    objectivesComplete: 12,
    totalObjectives: 15
  })

  const currentAgent = courseAgents[0] // Agent Phoenix (current user)
  const currentBadge = badgeSystem.reverse().find(badge => currentAgent.xp >= badge.xpRequired) || badgeSystem[0]

  // Personalized learning recommendations based on performance
  const getLearningRecommendations = () => {
    const weakestSkill = [
      { skill: 'LOOPS', level: 65, priority: 'HIGH' },
      { skill: 'FUNCTIONS', level: 78, priority: 'MEDIUM' },
      { skill: 'CONDITIONALS', level: 88, priority: 'LOW' },
      { skill: 'VARIABLES', level: 95, priority: 'COMPLETE' }
    ].sort((a, b) => a.level - b.level)[0]

    return {
      primaryFocus: weakestSkill,
      recommendations: [
        {
          type: 'SKILL_BOOST',
          title: `Master ${weakestSkill.skill} Fundamentals`,
          description: 'Complete 3 focused practice sessions',
          xpReward: 250,
          estimatedTime: '15 min',
          urgency: weakestSkill.priority
        },
        {
          type: 'SPEED_TRAINING',
          title: 'Code Velocity Challenge',
          description: 'Improve your fastest completion time',
          xpReward: 200,
          estimatedTime: '10 min',
          urgency: 'MEDIUM'
        },
        {
          type: 'PEER_LEARNING',
          title: 'Agent Collaboration Mission',
          description: 'Team up with a higher-ranked agent',
          xpReward: 300,
          estimatedTime: '20 min',
          urgency: 'LOW'
        }
      ]
    }
  }

  const learningData = getLearningRecommendations()

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update mission progress
      setMissionStatus(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 0.5, 100),
        timeRemaining: updateTimeRemaining(prev.timeRemaining)
      }))

      // Add random achievements/notifications
      if (Math.random() < 0.1) {
        const achievements = [
          'Speed bonus unlocked!',
          'Perfect execution achieved!',
          'New skill level reached!',
          'Weekly streak milestone!',
          'Code efficiency improved!'
        ]
        const newNotification = {
          id: Date.now().toString(),
          type: 'achievement',
          message: achievements[Math.floor(Math.random() * achievements.length)],
          timestamp: new Date()
        }
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const updateTimeRemaining = (current: string) => {
    const [minutes, seconds] = current.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds - 1
    if (totalSeconds <= 0) return '00:00'
    return `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`
  }

  const handleMissionLaunch = (missionType: string) => {
    switch (missionType) {
      case 'continue':
        router.push('/mission/shadow-protocol')
        break
      case 'analysis':
        setActiveTab('leaderboard')
        setLeaderboardView('course')
        break
      case 'upgrade':
        // Navigate to upgrade/customization page
        router.push('/agent/customization')
        break
      case 'emergency':
        // Navigate to help/tutorial section
        router.push('/help')
        break
    }
  }

  // Sort agents for different leaderboard views
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 font-mono">
              <span className="text-green-400">🕯️ Shadow HQ</span> - Agent Academy Command
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 font-mono text-xs px-2 py-1 bg-green-400/20 rounded">SHADOW PROTOCOL ACTIVE</span>
              <span className="text-cyan-300 font-mono text-sm">{currentAgent.codename} | Level {currentAgent.level}</span>
              <span className="text-purple-300 font-mono text-sm">{currentBadge.icon} {currentBadge.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono text-2xl">{currentAgent.xp.toLocaleString()} XP</div>
            <div className="text-gray-300 text-sm">Intel Points</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/40 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex space-x-0">
          {[
            { key: 'overview', label: '🕯️ Shadow HQ', icon: '🕯️' },
            { key: 'questmap', label: '🗺️ Mission Map', icon: '🗺️' },
            { key: 'leaderboard', label: '👤 Agent Ranks', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-mono transition-all duration-300 border-b-2 ${
                activeTab === tab.key
                  ? 'text-green-400 border-green-400 bg-green-400/10'
                  : 'text-gray-400 border-transparent hover:text-green-300 hover:bg-gray-700/30'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 relative">
            {/* Notification System */}
            {notifications.length > 0 && (
              <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-gradient-to-r from-green-600/90 to-emerald-500/90 backdrop-blur-lg border-2 border-green-400/60 rounded-lg p-4 transform animate-slide-in-right"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl animate-pulse">🏆</div>
                      <div>
                        <div className="text-green-100 font-mono font-bold text-sm">ACHIEVEMENT UNLOCKED</div>
                        <div className="text-green-200 text-xs font-mono">{notification.message}</div>
                        <div className="text-green-300/80 text-xs font-mono">
                          {notification.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Classified Header Overlay */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-red-900/90 border-b-2 border-red-400 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center justify-between text-red-400 font-mono text-xs">
                <div className="flex items-center space-x-4">
                  <span className="animate-pulse">● REC</span>
                  <span>CLASSIFIED - EYES ONLY</span>
                  <span>SECURITY LEVEL: ULTRA</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                  <span className="text-green-400">CONNECTION: SECURE</span>
                </div>
              </div>
            </div>

            {/* HUD Scan Lines Effect */}
            <div className="fixed inset-0 pointer-events-none z-40 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-pulse" 
                   style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)'}}></div>
            </div>

            {/* Main HUD Container */}
            <div className="mt-16 space-y-6">
              {/* Live Tactical Intelligence Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Mission Control HUD */}
                <div className="lg:col-span-2 relative">
                  {/* HUD Frame */}
                  <div className="absolute inset-0 border-2 border-green-400/40 bg-black/80 backdrop-blur-lg" 
                       style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
                  </div>
                  <div className="relative z-10 p-6">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-green-400/30 pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        <h2 className="text-xl font-bold text-green-400 font-mono tracking-wider">
                          [MISSION CONTROL ACTIVE]
                        </h2>
                        <div className="text-xs text-gray-400 font-mono">ID: MC-7749</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400 font-mono text-xs px-3 py-1 bg-green-400/10 border border-green-400/40" 
                             style={{clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)'}}>
                          OPERATION: SHADOW PROTOCOL
                        </div>
                        <div className="text-green-400 font-mono text-xs">CONN: 100%</div>
                      </div>
                    </div>

                    {/* HUD Mission Status Display */}
                    <div className="relative mb-6">
                      {/* Target Acquisition Frame */}
                      <div className="border-2 border-cyan-400/60 bg-black/60 p-4 relative">
                        {/* Corner Brackets */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                        
                        {/* Mission Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                              <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-wide">[TARGET] BINARY SHORES ACADEMY</h3>
                              <div className="text-xs text-cyan-300 font-mono bg-cyan-400/10 px-2 py-1">ACTIVE</div>
                            </div>
                            <p className="text-green-300 text-sm font-mono">INFILTRATION • CODE DECRYPTION • DATA EXTRACTION</p>
                            <div className="text-xs text-gray-400 font-mono mt-1">SECTOR: BSA-7749 | GRID: 34°N 118°W</div>
                          </div>
                          <div className="text-right border-l border-cyan-400/30 pl-4">
                            <div className="text-3xl font-bold text-orange-400 font-mono">{Math.round(missionStatus.progress)}%</div>
                            <div className="text-cyan-300 text-xs font-mono">COMPLETION</div>
                            <div className="text-xs text-gray-400 font-mono">ETA: {missionStatus.timeRemaining}</div>
                          </div>
                        </div>
                        
                        {/* HUD Progress Bar */}
                        <div className="relative mb-4">
                          <div className="w-full bg-gray-800 h-4 border border-cyan-400/30">
                            <div className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 h-full relative" style={{width: `${missionStatus.progress}%`}}>
                              <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-1">PROGRESS SCAN: [{'█'.repeat(Math.floor(missionStatus.progress/5))}{'▓'.repeat(Math.floor((100-missionStatus.progress)/5))}] {missionStatus.progress.toFixed(1)}%</div>
                        </div>
                        
                        {/* HUD Metrics Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border border-green-400/40 bg-green-400/5 p-3 text-center">
                            <div className="text-green-400 font-mono text-lg font-bold">[{missionStatus.objectivesComplete}/{missionStatus.totalObjectives}]</div>
                            <div className="text-green-300 text-xs font-mono">OBJECTIVES</div>
                            <div className="text-xs text-gray-400 font-mono">STATUS: NOMINAL</div>
                          </div>
                          <div className="border border-yellow-400/40 bg-yellow-400/5 p-3 text-center">
                            <div className="text-yellow-400 font-mono text-lg font-bold">8.2s</div>
                            <div className="text-yellow-300 text-xs font-mono">BEST TIME</div>
                            <div className="text-xs text-gray-400 font-mono">TYPE: SPEED RUN</div>
                          </div>
                          <div className="border border-purple-400/40 bg-purple-400/5 p-3 text-center">
                            <div className="text-purple-400 font-mono text-lg font-bold">94%</div>
                            <div className="text-purple-300 text-xs font-mono">ACCURACY</div>
                            <div className="text-xs text-gray-400 font-mono">RANK: EXPERT</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Military Intelligence Terminal */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 border-b border-green-400/30 pb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <h4 className="text-lg font-bold text-green-400 font-mono tracking-wider">[INTEL FEED] LIVE TRANSMISSION</h4>
                        <div className="text-xs text-gray-400 font-mono">CHANNEL: SECURE-7</div>
                        <div className="flex-1"></div>
                        <div className="text-xs text-green-400 font-mono">UPLINK: ACTIVE</div>
                      </div>
                      
                      {/* Terminal Window */}
                      <div className="bg-black border-2 border-green-400/60 p-4 font-mono text-sm max-h-64 overflow-y-auto">
                        <div className="text-green-400 text-xs mb-2">CLASSIFIED INTELLIGENCE STREAM - AUTHORIZATION ALPHA-7</div>
                        <div className="text-green-400/60 text-xs mb-4">================================</div>
                        
                        <div className="space-y-1">
                          {[
                            { time: '14:32:45', type: 'SUCCESS', msg: 'VARIABLE DECLARATION MASTERED - TARGET NEUTRALIZED', priority: 'LOW', color: 'text-green-400' },
                            { time: '14:28:12', type: 'INTEL', msg: 'NEW ENCRYPTION PATTERN DETECTED IN LOOP STRUCTURES', priority: 'MED', color: 'text-cyan-400' },
                            { time: '14:25:33', type: 'WARNING', msg: 'SYNTAX ERROR DETECTED - COUNTERMEASURES ACTIVATED', priority: 'HIGH', color: 'text-yellow-400' },
                            { time: '14:20:17', type: 'ACHIEVEMENT', msg: 'SPEED BONUS UNLOCKED - SUB-10 SECOND COMPLETION', priority: 'LOW', color: 'text-purple-400' },
                            { time: '14:18:44', type: 'SYSTEM', msg: 'AGENT CLEARANCE LEVEL VERIFIED - ACCESS GRANTED', priority: 'LOW', color: 'text-blue-400' },
                            { time: '14:15:09', type: 'TACTICAL', msg: 'FUNCTION FORTRESS BREACH ATTEMPT INITIATED', priority: 'MED', color: 'text-orange-400' }
                          ].map((intel, i) => (
                            <div key={i} className="flex items-start space-x-2 hover:bg-green-400/5 p-1 transition-all duration-200">
                              <div className="text-gray-500 text-xs">{intel.time}</div>
                              <div className={`text-xs px-1 ${intel.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : intel.priority === 'MED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                {intel.priority}
                              </div>
                              <div className={`text-xs ${intel.color} flex-1`}>
                                [{intel.type}] {intel.msg}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-green-400/60 text-xs mt-4">================================</div>
                        <div className="text-green-400 text-xs mt-2 flex items-center">
                          <span className="animate-pulse">█</span>
                          <span className="ml-1">MONITORING ACTIVE...</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Military HUD Side Panels */}
              <div className="space-y-6">
                {/* Agent Status HUD */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border-2 border-blue-400/40"
                       style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  </div>
                  <div className="relative z-10 p-6">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-blue-400/30 pb-2">
                      <h3 className="text-lg font-bold text-blue-400 font-mono tracking-wider">[AGENT PROFILE]</h3>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Agent ID Card */}
                    <div className="bg-black/60 border border-blue-400/30 p-4 mb-4">
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">🔥</div>
                        <div className="text-blue-400 font-mono font-bold text-lg">{currentAgent.codename}</div>
                        <div className="text-gray-400 text-xs font-mono">ID: {String(currentAgent.id).toUpperCase()}-7749</div>
                      </div>
                      <div className="border-t border-blue-400/30 pt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400 font-mono">CLEARANCE:</span>
                          <span className="text-blue-400 font-mono">LEVEL-{currentAgent.level}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400 font-mono">RANK:</span>
                          <span className="text-yellow-400 font-mono">{currentBadge.name.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400 font-mono">STATUS:</span>
                          <span className="text-green-400 font-mono animate-pulse">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="space-y-3">
                      <div className="bg-black/40 border-l-4 border-cyan-400 p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs font-mono">INTEL POINTS</span>
                          <span className="text-cyan-400 font-mono font-bold">{currentAgent.xp.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-black/40 border-l-4 border-orange-400 p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs font-mono">MISSION STREAK</span>
                          <span className="text-orange-400 font-mono font-bold">{currentAgent.streak} DAYS</span>
                        </div>
                      </div>
                      <div className="bg-black/40 border-l-4 border-green-400 p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs font-mono">SUCCESS RATE</span>
                          <span className="text-green-400 font-mono font-bold">{currentAgent.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Military Promotion Tracker HUD */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-lg border-2 border-yellow-400/40"
                       style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  </div>
                  <div className="relative z-10 p-6">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-yellow-400/30 pb-2">
                      <h3 className="text-lg font-bold text-yellow-400 font-mono tracking-wider">[PROMOTION TRACKER]</h3>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    {(() => {
                      const nextBadge = badgeSystem.find(badge => badge.xpRequired > currentAgent.xp)
                      if (!nextBadge) return (
                        <div className="bg-black/60 border border-yellow-400/30 p-4 text-center">
                          <div className="text-yellow-400 font-mono text-lg">🏆 MAXIMUM RANK ACHIEVED 🏆</div>
                          <div className="text-gray-400 font-mono text-xs mt-2">LEGEND STATUS: CONFIRMED</div>
                        </div>
                      )
                      const progress = ((currentAgent.xp - (badgeSystem.find(b => b.xpRequired <= currentAgent.xp)?.xpRequired || 0)) / 
                                       (nextBadge.xpRequired - (badgeSystem.find(b => b.xpRequired <= currentAgent.xp)?.xpRequired || 0))) * 100
                      return (
                        <div className="space-y-4">
                          {/* Target Promotion Display */}
                          <div className="bg-black/60 border border-yellow-400/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="text-3xl animate-pulse">{nextBadge.icon}</div>
                                <div>
                                  <div className="text-yellow-400 font-mono font-bold text-lg">[TARGET: {nextBadge.name.toUpperCase()}]</div>
                                  <div className="text-gray-400 font-mono text-xs">NEXT PROMOTION TIER</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-yellow-400 font-mono font-bold">{nextBadge.xpRequired - currentAgent.xp}</div>
                                <div className="text-gray-400 font-mono text-xs">XP REQUIRED</div>
                              </div>
                            </div>
                            
                            {/* HUD Progress Bar */}
                            <div className="relative">
                              <div className="w-full bg-gray-800 h-4 border border-yellow-400/30">
                                <div className="bg-gradient-to-r from-yellow-500 via-orange-400 to-red-500 h-full relative" style={{width: `${progress}%`}}>
                                  <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 font-mono mt-1">
                                PROMOTION SCAN: [{'█'.repeat(Math.floor(progress/5))}{'▓'.repeat(Math.floor((100-progress)/5))}] {Math.round(progress)}%
                              </div>
                            </div>
                          </div>
                          
                          {/* Unlockable Features */}
                          <div className="bg-black/40 border-l-4 border-yellow-400 p-3">
                            <div className="text-yellow-400 font-mono text-xs mb-2">[CLASSIFIED UNLOCK PREVIEW]</div>
                            <div className="text-gray-300 font-mono text-sm">
                              {nextBadge.unlocks.map((unlock, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <span className="text-yellow-400">▶</span>
                                  <span>{unlock}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                </div>

                {/* Tactical Operations HUD */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-purple-900/20 backdrop-blur-lg border-2 border-red-400/40"
                       style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  </div>
                  <div className="relative z-10 p-6">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-red-400/30 pb-2">
                      <h3 className="text-lg font-bold text-red-400 font-mono tracking-wider">[TACTICAL OPERATIONS]</h3>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Command Buttons Grid */}
                    <div className="space-y-3">
                      {/* Primary Mission Button */}
                      <button 
                        onClick={() => handleMissionLaunch('continue')}
                        className="w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-80"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                        </div>
                        <div className="relative bg-green-500/20 border-2 border-green-400/60 p-3 text-white font-mono transition-all duration-300 group-hover:bg-green-500/40 group-hover:border-green-300"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-green-400 text-xl">🎯</span>
                            <span className="text-green-300 font-bold tracking-wide">[PRIMARY] CONTINUE MISSION</span>
                            <div className="text-xs text-green-400">ACTIVE</div>
                          </div>
                        </div>
                      </button>
                      
                      {/* Intelligence Analysis Button */}
                      <button 
                        onClick={() => handleMissionLaunch('analysis')}
                        className="w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-400 opacity-80"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                        </div>
                        <div className="relative bg-cyan-500/20 border-2 border-cyan-400/60 p-3 text-white font-mono transition-all duration-300 group-hover:bg-cyan-500/40 group-hover:border-cyan-300"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-cyan-400 text-xl">📊</span>
                            <span className="text-cyan-300 font-bold tracking-wide">[INTEL] PERFORMANCE ANALYSIS</span>
                            <div className="text-xs text-cyan-400">READY</div>
                          </div>
                        </div>
                      </button>
                      
                      {/* Equipment Upgrade Button */}
                      <button 
                        onClick={() => handleMissionLaunch('upgrade')}
                        className="w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 opacity-80"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                        </div>
                        <div className="relative bg-purple-500/20 border-2 border-purple-400/60 p-3 text-white font-mono transition-all duration-300 group-hover:bg-purple-500/40 group-hover:border-purple-300"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-purple-400 text-xl">🔧</span>
                            <span className="text-purple-300 font-bold tracking-wide">[TECH] UPGRADE EQUIPMENT</span>
                            <div className="text-xs text-purple-400">AVAILABLE</div>
                          </div>
                        </div>
                      </button>
                      
                      {/* Emergency Protocol */}
                      <button 
                        onClick={() => handleMissionLaunch('emergency')}
                        className="w-full relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-400 opacity-80"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                        </div>
                        <div className="relative bg-orange-500/20 border-2 border-orange-400/60 p-3 text-white font-mono transition-all duration-300 group-hover:bg-orange-500/40 group-hover:border-orange-300"
                             style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-orange-400 text-xl">🚨</span>
                            <span className="text-orange-300 font-bold tracking-wide">[EMERGENCY] TACTICAL RETREAT</span>
                            <div className="text-xs text-orange-400">STANDBY</div>
                          </div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="mt-4 border-t border-red-400/30 pt-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">COMMAND STATUS:</span>
                        <span className="text-green-400 animate-pulse">● OPERATIONAL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* AI Learning Recommendations HUD */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg border-2 border-purple-400/40"
                   style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              </div>
              <div className="relative z-10 p-6">
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-6 border-b border-purple-400/30 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                    <h2 className="text-xl font-bold text-purple-400 font-mono tracking-wider">
                      [AI TRAINING ADVISOR] PERSONALIZED RECOMMENDATIONS
                    </h2>
                  </div>
                  <div className="text-purple-400 font-mono text-xs">AI-POWERED</div>
                </div>

                {/* Primary Focus Alert */}
                <div className="bg-red-500/10 border-2 border-red-400/60 p-4 mb-6 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400"></div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl animate-bounce">⚠️</div>
                    <div>
                      <div className="text-red-400 font-mono font-bold text-lg">
                        [PRIORITY TRAINING] {learningData.primaryFocus.skill} MASTERY
                      </div>
                      <div className="text-red-300 font-mono text-sm">
                        Current Level: {learningData.primaryFocus.level}% - Priority: {learningData.primaryFocus.priority}
                      </div>
                      <div className="text-gray-400 font-mono text-xs mt-1">
                        AI Analysis: Focus training recommended for optimal advancement
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Training Missions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {learningData.recommendations.map((rec, index) => (
                    <div key={index} className={`border-2 p-4 relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                      rec.urgency === 'HIGH' ? 'border-red-400/60 bg-red-500/10 hover:bg-red-500/20' :
                      rec.urgency === 'MEDIUM' ? 'border-yellow-400/60 bg-yellow-500/10 hover:bg-yellow-500/20' :
                      'border-green-400/60 bg-green-500/10 hover:bg-green-500/20'
                    }`}>
                      {/* Mission Type Badge */}
                      <div className={`absolute top-2 right-2 text-xs font-mono px-2 py-1 border ${
                        rec.urgency === 'HIGH' ? 'text-red-400 border-red-400/40 bg-red-400/10' :
                        rec.urgency === 'MEDIUM' ? 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' :
                        'text-green-400 border-green-400/40 bg-green-400/10'
                      }`}>
                        {rec.urgency}
                      </div>

                      {/* Mission Icon */}
                      <div className="text-center mb-3">
                        <div className="text-3xl mb-2">
                          {rec.type === 'SKILL_BOOST' ? '📚' :
                           rec.type === 'SPEED_TRAINING' ? '⚡' : '🤝'}
                        </div>
                        <div className={`text-sm font-mono font-bold ${
                          rec.urgency === 'HIGH' ? 'text-red-400' :
                          rec.urgency === 'MEDIUM' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          [{rec.type}]
                        </div>
                      </div>

                      {/* Mission Details */}
                      <div className="space-y-2">
                        <h4 className={`font-mono font-bold text-sm ${
                          rec.urgency === 'HIGH' ? 'text-red-300' :
                          rec.urgency === 'MEDIUM' ? 'text-yellow-300' :
                          'text-green-300'
                        }`}>
                          {rec.title}
                        </h4>
                        <p className="text-gray-400 font-mono text-xs">{rec.description}</p>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                          <div className="text-xs font-mono text-cyan-400">+{rec.xpReward} XP</div>
                          <div className="text-xs font-mono text-gray-400">~{rec.estimatedTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insight */}
                <div className="mt-6 bg-black/40 border-l-4 border-purple-400 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-400 text-xl">🤖</div>
                    <div>
                      <div className="text-purple-400 font-mono font-bold text-sm">[AI INSIGHT]</div>
                      <div className="text-purple-300 font-mono text-xs">
                        Based on your performance data, focusing on {learningData.primaryFocus.skill} will increase your 
                        overall completion rate by ~15% and reduce average solving time by 2.3 seconds.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced HUD Analytics Array */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skill Matrix HUD */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-lg border-2 border-blue-400/40"
                     style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                </div>
                <div className="relative z-10 p-6">
                  {/* HUD Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-blue-400/30 pb-2">
                    <h3 className="text-lg font-bold text-blue-400 font-mono tracking-wider">[SKILL MATRIX]</h3>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  {/* Skill Proficiency Display */}
                  <div className="space-y-4">
                    {[
                      { skill: 'VARIABLES', level: 95, status: 'MASTERED', color: 'green', code: 'VAR-95' },
                      { skill: 'FUNCTIONS', level: 78, status: 'PROFICIENT', color: 'blue', code: 'FUN-78' },
                      { skill: 'LOOPS', level: 65, status: 'DEVELOPING', color: 'yellow', code: 'LOP-65' },
                      { skill: 'CONDITIONALS', level: 88, status: 'ADVANCED', color: 'purple', code: 'CON-88' }
                    ].map((skill, i) => (
                      <div key={i} className="bg-black/60 border border-gray-600/30 p-3">
                        {/* Skill Header */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              skill.color === 'green' ? 'bg-green-400' :
                              skill.color === 'blue' ? 'bg-blue-400' :
                              skill.color === 'yellow' ? 'bg-yellow-400' : 'bg-purple-400'
                            }`}></div>
                            <span className={`text-sm font-mono font-bold ${
                              skill.color === 'green' ? 'text-green-400' :
                              skill.color === 'blue' ? 'text-blue-400' :
                              skill.color === 'yellow' ? 'text-yellow-400' : 'text-purple-400'
                            }`}>
                              [{skill.code}] {skill.skill}
                            </span>
                          </div>
                          <div className={`text-xs font-mono px-2 py-1 border ${
                            skill.color === 'green' ? 'text-green-400 border-green-400/40 bg-green-400/10' :
                            skill.color === 'blue' ? 'text-blue-400 border-blue-400/40 bg-blue-400/10' :
                            skill.color === 'yellow' ? 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' :
                            'text-purple-400 border-purple-400/40 bg-purple-400/10'
                          }`}>
                            {skill.status}
                          </div>
                        </div>
                        
                        {/* HUD Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-800 h-3 border border-gray-600/40">
                            <div className={`h-full bg-gradient-to-r transition-all duration-500 ${
                              skill.color === 'green' ? 'from-green-500 to-emerald-400' :
                              skill.color === 'blue' ? 'from-blue-500 to-cyan-400' :
                              skill.color === 'yellow' ? 'from-yellow-500 to-orange-400' :
                              'from-purple-500 to-pink-400'
                            } relative`} style={{width: `${skill.level}%`}}>
                              <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-1 flex justify-between">
                            <span>MASTERY SCAN: [{'█'.repeat(Math.floor(skill.level/10))}{'▓'.repeat(Math.floor((100-skill.level)/10))}]</span>
                            <span className={`font-bold ${
                              skill.color === 'green' ? 'text-green-400' :
                              skill.color === 'blue' ? 'text-blue-400' :
                              skill.color === 'yellow' ? 'text-yellow-400' : 'text-purple-400'
                            }`}>{skill.level}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intelligence Report HUD */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg border-2 border-green-400/40"
                     style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                </div>
                <div className="relative z-10 p-6">
                  {/* HUD Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-green-400/30 pb-2">
                    <h3 className="text-lg font-bold text-green-400 font-mono tracking-wider">[INTEL REPORT]</h3>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Weekly Statistics Display */}
                  <div className="space-y-4">
                    {/* Primary Metric - Weekly XP */}
                    <div className="bg-black/60 border border-green-400/30 p-4 text-center">
                      <div className="text-green-400 font-mono text-xs mb-1">[WEEKLY INTELLIGENCE POINTS]</div>
                      <div className="text-4xl font-bold text-green-400 font-mono animate-pulse">{currentAgent.weeklyXP}</div>
                      <div className="text-green-300 text-xs font-mono mt-1">XP ACCUMULATED THIS CYCLE</div>
                      <div className="text-gray-400 font-mono text-xs">STATUS: {currentAgent.weeklyXP > 300 ? 'ABOVE AVERAGE' : 'NOMINAL'}</div>
                    </div>
                    
                    {/* Performance Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Perfect Runs */}
                      <div className="bg-black/40 border border-cyan-400/40 p-3 text-center">
                        <div className="text-cyan-400 font-mono text-xs">[PERFECT EXECUTIONS]</div>
                        <div className="text-2xl font-bold text-cyan-400 font-mono">{currentAgent.perfectScores}</div>
                        <div className="text-cyan-300 text-xs font-mono">FLAWLESS RUNS</div>
                        <div className="text-gray-400 font-mono text-xs">ACCURACY: 100%</div>
                      </div>
                      
                      {/* Speed Record */}
                      <div className="bg-black/40 border border-orange-400/40 p-3 text-center">
                        <div className="text-orange-400 font-mono text-xs">[SPEED RECORD]</div>
                        <div className="text-2xl font-bold text-orange-400 font-mono">{currentAgent.fastestTime}s</div>
                        <div className="text-orange-300 text-xs font-mono">FASTEST TIME</div>
                        <div className="text-gray-400 font-mono text-xs">CATEGORY: ELITE</div>
                      </div>
                    </div>
                    
                    {/* Ranking Status */}
                    <div className="bg-black/40 border-l-4 border-yellow-400 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-yellow-400 font-mono text-xs">[GLOBAL RANKING]</div>
                          <div className="text-yellow-400 font-mono font-bold">
                            RANK #{courseAgents.findIndex(a => a.id === currentAgent.id) + 1} / {courseAgents.length}
                          </div>
                        </div>
                        <div className="text-2xl">🏆</div>
                      </div>
                      <div className="text-gray-400 font-mono text-xs mt-1">
                        PERCENTILE: {Math.round((1 - (courseAgents.findIndex(a => a.id === currentAgent.id) / courseAgents.length)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Objectives HUD */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-lg border-2 border-orange-400/40"
                     style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                </div>
                <div className="relative z-10 p-6">
                  {/* HUD Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-orange-400/30 pb-2">
                    <h3 className="text-lg font-bold text-orange-400 font-mono tracking-wider">[MISSION OBJECTIVES]</h3>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Objective List */}
                  <div className="space-y-3">
                    {[
                      { obj: 'MASTER BINARY OPERATORS', status: 'complete', code: 'OBJ-001', priority: 'ALPHA' },
                      { obj: 'DECODE VARIABLE MYSTERIES', status: 'complete', code: 'OBJ-002', priority: 'ALPHA' },
                      { obj: 'INFILTRATE FUNCTION FORTRESS', status: 'current', code: 'OBJ-003', priority: 'BRAVO' },
                      { obj: 'SECURE LOOP PROTOCOLS', status: 'locked', code: 'OBJ-004', priority: 'CHARLIE' },
                      { obj: 'FINAL DATA EXTRACTION', status: 'locked', code: 'OBJ-005', priority: 'DELTA' }
                    ].map((obj, i) => (
                      <div key={i} className={`border p-3 ${
                        obj.status === 'complete' ? 'bg-green-500/10 border-green-400/40' : 
                        obj.status === 'current' ? 'bg-orange-500/10 border-orange-400/60 animate-pulse' : 
                        'bg-gray-800/20 border-gray-600/40'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Status Indicator */}
                            <div className={`w-3 h-3 border-2 flex items-center justify-center ${
                              obj.status === 'complete' ? 'border-green-400 bg-green-400' : 
                              obj.status === 'current' ? 'border-orange-400 bg-orange-400/50 animate-pulse' : 
                              'border-gray-500 bg-gray-800'
                            }`}>
                              {obj.status === 'complete' && <div className="w-1 h-1 bg-black"></div>}
                              {obj.status === 'current' && <div className="w-1 h-1 bg-white animate-pulse"></div>}
                              {obj.status === 'locked' && <div className="w-1 h-1 bg-gray-600"></div>}
                            </div>
                            
                            {/* Objective Details */}
                            <div>
                              <div className={`text-sm font-mono font-bold ${
                                obj.status === 'complete' ? 'text-green-400' :
                                obj.status === 'current' ? 'text-orange-400' :
                                'text-gray-500'
                              }`}>
                                [{obj.code}] {obj.obj}
                              </div>
                              <div className={`text-xs font-mono ${
                                obj.status === 'complete' ? 'text-green-300' :
                                obj.status === 'current' ? 'text-orange-300' :
                                'text-gray-600'
                              }`}>
                                PRIORITY: {obj.priority} | STATUS: {obj.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          
                          {/* Mission Status Badge */}
                          <div className={`text-xs font-mono px-2 py-1 border ${
                            obj.status === 'complete' ? 'text-green-400 border-green-400/40 bg-green-400/10' :
                            obj.status === 'current' ? 'text-orange-400 border-orange-400/40 bg-orange-400/10' :
                            'text-gray-500 border-gray-500/40 bg-gray-500/10'
                          }`}>
                            {obj.status === 'complete' ? 'COMPLETED' :
                             obj.status === 'current' ? 'IN PROGRESS' : 'CLASSIFIED'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mission Progress Summary */}
                  <div className="mt-4 border-t border-orange-400/30 pt-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">MISSION COMPLETION:</span>
                      <span className="text-orange-400 font-bold">2/5 OBJECTIVES</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 border border-orange-400/30 mt-2">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full relative" style={{width: '40%'}}>
                        <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      PROGRESS: [████████▓▓▓▓▓▓▓▓▓▓] 40%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questmap' && (
          <div className="h-screen w-full">
            <AAAGameMap />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-mono">👤 Agent Ranking System</h2>
              <p className="text-gray-400 font-mono">Competitive intelligence leaderboards</p>
            </div>

            {/* Leaderboard View Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[
                { key: 'course', label: '🏆 Course Leaders (Top 10)', icon: '🏆' },
                { key: 'weekly', label: '⚡ Weekly Top 5', icon: '⚡' },
                { key: 'speed', label: '🚀 Speed Records', icon: '🚀' },
                { key: 'perfect', label: '💎 Perfect Scores', icon: '💎' }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setLeaderboardView(view.key as any)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                    leaderboardView === view.key
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {view.icon} {view.label}
                </button>
              ))}
            </div>

            {/* Competitive Leaderboard */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-cyan-500/30 overflow-hidden">
              <div className="space-y-2">
                {getSortedAgents().map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-4 ${agent.id === currentAgent.id ? 'bg-green-500/20 border-l-4 border-green-400' : 'hover:bg-gray-700/30'} transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold font-mono ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="text-3xl">{agent.avatar}</div>
                      <div>
                        <div className="text-white font-bold">{agent.codename}</div>
                        <div className="text-gray-400 text-sm">{agent.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {leaderboardView === 'course' && (
                        <div>
                          <div className="text-green-400 font-mono font-bold">{agent.xp.toLocaleString()} XP</div>
                          <div className="text-gray-400 text-sm">Level {agent.level}</div>
                        </div>
                      )}
                      {leaderboardView === 'weekly' && (
                        <div>
                          <div className="text-orange-400 font-mono font-bold">{agent.weeklyXP} XP</div>
                          <div className="text-gray-400 text-sm">This Week</div>
                        </div>
                      )}
                      {leaderboardView === 'speed' && (
                        <div>
                          <div className="text-cyan-400 font-mono font-bold">{agent.fastestTime}s</div>
                          <div className="text-gray-400 text-sm">Best Time</div>
                        </div>
                      )}
                      {leaderboardView === 'perfect' && (
                        <div>
                          <div className="text-purple-400 font-mono font-bold">{agent.perfectScores}</div>
                          <div className="text-gray-400 text-sm">Perfect Runs</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}