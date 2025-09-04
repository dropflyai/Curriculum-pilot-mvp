'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, Star, Zap, Users, Calendar, TrendingUp, Award, Target, Flame, Brain, Activity, Shield, Radar, Monitor, Wifi, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react'
import { getMockLeaderboardData, StudentPoints, type LeaderboardData } from '@/lib/points-system'

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly' | 'special' | 'tactical'>('tactical')
  const [leaderboardData] = useState<LeaderboardData>(getMockLeaderboardData())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL')
  const [threatLevel, setThreatLevel] = useState('MINIMAL')
  const [activeAgents, setActiveAgents] = useState(12)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate system activity
      setActiveAgents(Math.floor(Math.random() * 5) + 10)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-amber-400" />
      case 2: return <Medal className="h-6 w-6 text-orange-300" />
      case 3: return <Medal className="h-6 w-6 text-red-400" />
      default: return <span className="text-orange-400 font-bold text-lg font-mono">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-400/20 border-amber-400'
      case 2: return 'bg-orange-400/20 border-orange-400'
      case 3: return 'bg-red-400/20 border-red-400'
      default: return 'bg-black/50 border-amber-500/30'
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
    <div className="bg-black/90 backdrop-blur-sm border border-amber-500/30 overflow-hidden font-mono relative">
      {/* Tactical HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-amber-400"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-amber-400"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-400"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-400"></div>
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent animate-ping top-1/4"></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-orange-400/20 to-transparent animate-ping bottom-1/4" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>

      {/* Command Center Header */}
      <div className="relative bg-black/90 backdrop-blur-sm border-b border-amber-500/30">
        {/* Top Status Bar */}
        <div className="bg-black/80 p-2 border-b border-amber-500/20">
          <div className="flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="text-green-400">● SYSTEM ONLINE</span>
              <span className="text-amber-400">STATUS: {systemStatus}</span>
              <span className="text-red-400">THREAT: {threatLevel}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-cyan-400">AGENTS ACTIVE: {activeAgents}</span>
              <span className="text-amber-400">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Radar className="h-12 w-12 text-amber-400 animate-spin" style={{animationDuration: '4s'}} />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-amber-400 font-mono">FIELD OPS CENTER</h2>
                <div className="flex items-center gap-4 text-orange-300 font-mono text-sm">
                  <span>TACTICAL COMMAND & CONTROL</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">UPLINK ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-400/10 border border-amber-400/30 p-3 text-center">
                <Monitor className="h-6 w-6 text-amber-400 mx-auto mb-1" />
                <div className="text-amber-400 font-bold font-mono">SURVEILLANCE</div>
                <div className="text-orange-300 text-sm font-mono">ACTIVE</div>
              </div>
              <div className="bg-green-400/10 border border-green-400/30 p-3 text-center">
                <Shield className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <div className="text-green-400 font-bold font-mono">SECURITY</div>
                <div className="text-green-300 text-sm font-mono">SECURED</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Tabs */}
      <div className="relative bg-black/80 p-4 border-b border-amber-500/30">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('tactical')}
            className={`px-4 py-2 font-medium transition-all duration-300 flex items-center gap-2 border font-mono ${
              activeTab === 'tactical' 
                ? 'bg-amber-400/20 text-amber-400 border-amber-400 shadow-lg' 
                : 'bg-black/50 text-orange-300 border-amber-500/30 hover:border-amber-400/50'
            }`}
          >
            <Radar className="h-4 w-4" />
            TACTICAL OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 font-medium transition-all duration-300 flex items-center gap-2 border font-mono ${
              activeTab === 'weekly' 
                ? 'bg-amber-400/20 text-amber-400 border-amber-400 shadow-lg' 
                : 'bg-black/50 text-orange-300 border-amber-500/30 hover:border-amber-400/50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            WEEKLY INTEL
          </button>
          <button
            onClick={() => setActiveTab('all-time')}
            className={`px-4 py-2 font-medium transition-all duration-300 flex items-center gap-2 border font-mono ${
              activeTab === 'all-time' 
                ? 'bg-amber-400/20 text-amber-400 border-amber-400 shadow-lg' 
                : 'bg-black/50 text-orange-300 border-amber-500/30 hover:border-amber-400/50'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            MISSION HISTORY
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-4 py-2 font-medium transition-all duration-300 flex items-center gap-2 border font-mono ${
              activeTab === 'special' 
                ? 'bg-amber-400/20 text-amber-400 border-amber-400 shadow-lg' 
                : 'bg-black/50 text-orange-300 border-amber-500/30 hover:border-amber-400/50'
            }`}
          >
            <Star className="h-4 w-4" />
            COMMENDATIONS
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {activeTab === 'tactical' ? (
          /* Tactical Command Center */
          <div className="space-y-6">
            {/* Real-time Agent Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-black/80 border border-green-400/30 p-4">
                  <h3 className="text-green-400 font-bold font-mono text-lg mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    LIVE AGENT TRACKING
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {leaderboardData.weekly.slice(0, 6).map((agent, index) => (
                      <div key={agent.studentId} className="bg-green-400/10 border border-green-400/20 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${
                              index % 3 === 0 ? 'bg-green-400' : index % 3 === 1 ? 'bg-amber-400' : 'bg-red-400'
                            }`}></div>
                            <span className="text-green-400 font-mono text-sm font-bold">{agent.studentName}</span>
                          </div>
                          <span className="text-green-300 text-xs font-mono">
                            {index % 3 === 0 ? 'ACTIVE' : index % 3 === 1 ? 'STANDBY' : 'OFFLINE'}
                          </span>
                        </div>
                        <div className="text-xs font-mono space-y-1">
                          <div className="flex justify-between">
                            <span className="text-amber-400">CURRENT MISSION:</span>
                            <span className="text-orange-300">Week {Math.floor(Math.random() * 4) + 1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-400">PROGRESS:</span>
                            <span className="text-orange-300">{Math.floor(Math.random() * 40) + 60}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-400">LAST PING:</span>
                            <span className="text-orange-300">{Math.floor(Math.random() * 30)}s ago</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Mission Status */}
                <div className="bg-black/80 border border-amber-400/30 p-4">
                  <h3 className="text-amber-400 font-bold font-mono text-sm mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    MISSION STATUS
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-orange-300">ACTIVE OPERATIONS:</span>
                      <span className="text-green-400">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">COMPLETED TODAY:</span>
                      <span className="text-green-400">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">SUCCESS RATE:</span>
                      <span className="text-green-400">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">AVG COMPLETION:</span>
                      <span className="text-green-400">28m</span>
                    </div>
                  </div>
                </div>

                {/* System Alerts */}
                <div className="bg-black/80 border border-red-400/30 p-4">
                  <h3 className="text-red-400 font-bold font-mono text-sm mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    SYSTEM ALERTS
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400">All systems nominal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-amber-400">High traffic detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400">Security protocols active</span>
                    </div>
                  </div>
                </div>

                {/* Network Status */}
                <div className="bg-black/80 border border-cyan-400/30 p-4">
                  <h3 className="text-cyan-400 font-bold font-mono text-sm mb-3 flex items-center">
                    <Wifi className="h-4 w-4 mr-2" />
                    NETWORK STATUS
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-cyan-300">UPTIME:</span>
                      <span className="text-green-400">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-300">LATENCY:</span>
                      <span className="text-green-400">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-300">BANDWIDTH:</span>
                      <span className="text-green-400">847Mbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Console */}
            <div className="bg-black/90 border border-amber-400/30 p-4">
              <h3 className="text-amber-400 font-bold font-mono text-lg mb-4 flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                COMMAND CONSOLE
              </h3>
              <div className="bg-black/60 border border-green-400/20 p-3 font-mono text-xs">
                <div className="text-green-400 mb-2">[SYSTEM] Field Ops Center initialized</div>
                <div className="text-cyan-400 mb-2">[INFO] {activeAgents} agents currently active</div>
                <div className="text-amber-400 mb-2">[STATUS] All surveillance systems operational</div>
                <div className="text-green-400 mb-2">[COMM] Secure uplink established</div>
                <div className="text-cyan-400 mb-2">[DATA] Real-time tracking active</div>
                <div className="text-amber-400 animate-pulse">█ Ready for command input...</div>
              </div>
            </div>
          </div>
        ) : activeTab === 'special' ? (
          /* Special Categories */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/60 border border-red-500/30 p-4">
              <h3 className="font-bold text-red-400 mb-3 flex items-center font-mono">
                <Target className="h-5 w-5 mr-2" />
                [ CREATIVE OPERATIVES ]
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.creativeCoders.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-red-400/10 border border-red-500/20 p-2">
                    <span className="text-amber-400 font-mono">{student.studentName}</span>
                    <span className="text-red-400 text-sm font-mono">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/60 border border-green-500/30 p-4">
              <h3 className="font-bold text-green-400 mb-3 flex items-center font-mono">
                <Users className="h-5 w-5 mr-2" />
                [ SUPPORT SPECIALISTS ]
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.helpfulClassmates.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-green-400/10 border border-green-500/20 p-2">
                    <span className="text-amber-400 font-mono">{student.studentName}</span>
                    <span className="text-green-400 text-sm font-mono">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/60 border border-cyan-500/30 p-4">
              <h3 className="font-bold text-cyan-400 mb-3 flex items-center font-mono">
                <Zap className="h-5 w-5 mr-2" />
                [ RAPID RESPONSE UNIT ]
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.speedLearners.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-cyan-400/10 border border-cyan-500/20 p-2">
                    <span className="text-amber-400 font-mono">{student.studentName}</span>
                    <span className="text-cyan-400 text-sm font-mono">{student.totalXP} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/60 border border-purple-500/30 p-4">
              <h3 className="font-bold text-purple-400 mb-3 flex items-center font-mono">
                <Brain className="h-5 w-5 mr-2" />
                [ TACTICAL ANALYSTS ]
              </h3>
              <div className="space-y-2">
                {leaderboardData.specialCategories.deepThinkers.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between bg-purple-400/10 border border-purple-500/20 p-2">
                    <span className="text-amber-400 font-mono">{student.studentName}</span>
                    <span className="text-purple-400 text-sm font-mono">{student.totalXP} XP</span>
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
                className={`p-4 border transition-all duration-300 hover:scale-[1.02] ${
                  index < 3 
                    ? `${getRankBadge(index + 1)} text-amber-400 shadow-lg` 
                    : 'bg-black/50 border-amber-500/30 hover:border-amber-400/50'
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
                      <h3 className={`font-bold text-lg font-mono ${index < 3 ? 'text-amber-400' : 'text-amber-400'}`}>
                        {student.studentName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm font-mono">
                        <span className={index < 3 ? 'text-orange-300' : 'text-orange-300'}>
                          LVL {student.level}
                        </span>
                        {student.currentStreak > 0 && (
                          <span className={`flex items-center gap-1 ${index < 3 ? 'text-red-400' : 'text-red-400'}`}>
                            <Flame className="h-4 w-4" />
                            {student.currentStreak}D STREAK
                          </span>
                        )}
                        <span className={index < 3 ? 'text-orange-400/60' : 'text-orange-400/60'}>
                          {student.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-xl font-mono ${index < 3 ? 'text-amber-400' : 'text-amber-400'}`}>
                      {activeTab === 'weekly' ? student.weeklyXP : student.totalXP} XP
                    </div>
                    <div className="flex gap-1 mt-1">
                      {student.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <span 
                          key={badgeIndex}
                          className={`px-2 py-1 text-xs border font-mono ${
                            index < 3 ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                      {student.badges.length > 3 && (
                        <span className={`px-2 py-1 text-xs border font-mono ${
                          index < 3 ? 'bg-orange-400/10 text-orange-400 border-orange-400/30' : 'bg-orange-400/10 text-orange-400 border-orange-400/30'
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
      <div className="relative bg-black/80 p-4 border-t border-amber-500/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-amber-400 font-bold text-lg font-mono">{leaderboardData.allTime.length}</div>
            <div className="text-orange-400 text-sm font-mono">ACTIVE AGENTS</div>
          </div>
          <div>
            <div className="text-amber-400 font-bold text-lg font-mono">
              {leaderboardData.allTime.reduce((sum, s) => sum + s.totalXP, 0).toLocaleString()}
            </div>
            <div className="text-orange-400 text-sm font-mono">TOTAL SQUAD XP</div>
          </div>
          <div>
            <div className="text-amber-400 font-bold text-lg font-mono">
              {Math.round(leaderboardData.allTime.reduce((sum, s) => sum + s.totalXP, 0) / leaderboardData.allTime.length)}
            </div>
            <div className="text-orange-400 text-sm font-mono">AVERAGE XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}