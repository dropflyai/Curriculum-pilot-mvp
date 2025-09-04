'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, Target, Lock, Unlock, Activity, Radio, AlertTriangle,
  ChevronRight, Clock, Award, TrendingUp, Users, Zap, MapPin,
  Navigation, Crosshair, Database, Globe, Cpu, Wifi, LogOut
} from 'lucide-react'

interface Mission {
  id: string
  name: string
  codename: string
  status: 'ACTIVE' | 'LOCKED' | 'COMPLETED'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'EXTREME'
  duration: string
  xpReward: number
  progress: number
  description: string
  image: string
  prerequisite?: string
  route: string
}

export default function MissionHQ() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [systemStatus, setSystemStatus] = useState('ONLINE')

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const demoAuth = localStorage.getItem('demo_authenticated') === 'true'
      const demoUserStr = localStorage.getItem('demo_user')
      
      if (!demoAuth || !demoUserStr) {
        router.push('/auth')
        return
      }
      
      const demoUser = JSON.parse(demoUserStr)
      setUser(demoUser)
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('demo_authenticated')
    localStorage.removeItem('demo_user')
    router.push('/')
  }

  // Mission progression system - determines which missions are unlocked
  const getCompletedMissions = () => {
    // In a real app, this would come from the database/localStorage
    // For now, we'll simulate that only Operation Beacon is available initially
    const completed = localStorage.getItem('completed_missions')
    return completed ? JSON.parse(completed) : []
  }

  const completeMission = (missionId: string) => {
    const completed = getCompletedMissions()
    if (!completed.includes(missionId)) {
      completed.push(missionId)
      localStorage.setItem('completed_missions', JSON.stringify(completed))
    }
  }

  const isMissionUnlocked = (mission: Mission, missions: Mission[]): boolean => {
    if (!mission.prerequisite) return true // First mission is always unlocked
    
    const completedMissions = getCompletedMissions()
    const prerequisiteMission = missions.find(m => m.name === mission.prerequisite)
    return prerequisiteMission ? completedMissions.includes(prerequisiteMission.id) : false
  }

  // Base mission data - status will be determined dynamically
  const baseMissions: Omit<Mission, 'status'>[] = [
    {
      id: 'shadow-protocol',
      name: 'OPERATION BEACON',
      codename: 'OPERATION: SOLO MISSIONS',
      difficulty: 'BEGINNER',
      duration: '4 WEEKS',
      xpReward: 5000,
      progress: 0,
      description: 'Phase 1 of Black Cipher. Master Python fundamentals through solo infiltration missions. Learn variables, loops, and basic algorithms.',
      image: '/CodeFly Homepage.png',
      route: '/mission/operation-beacon'
    },
    {
      id: 'cipher-command',
      name: 'CIPHER COMMAND',
      codename: 'OPERATION: TEAM FORMATION',
      difficulty: 'INTERMEDIATE',
      duration: '4 WEEKS',
      xpReward: 7500,
      progress: 0,
      description: 'Phase 2 of Black Cipher. Form elite coding teams and master functions, data structures, and collaborative programming tactics.',
      image: '/CodeFly Homepage 2.png',
      prerequisite: 'OPERATION BEACON',
      route: '/mission/cipher-command'
    },
    {
      id: 'ghost-protocol',
      name: 'LOOP CANYON BASE',
      codename: 'OPERATION: TEAM COLLABORATION',
      difficulty: 'ADVANCED',
      duration: '5 WEEKS',
      xpReward: 10000,
      progress: 0,
      description: 'Phase 3 of Black Cipher. Execute complex team missions using object-oriented programming and advanced Python concepts.',
      image: '/CodeFly Homepage 3.png',
      prerequisite: 'CIPHER COMMAND',
      route: '/mission/ghost-protocol'
    },
    {
      id: 'quantum-breach',
      name: 'QUANTUM BREACH',
      codename: 'OPERATION: ADVANCED PROJECTS',
      difficulty: 'EXPERT',
      duration: '5 WEEKS',
      xpReward: 15000,
      progress: 0,
      description: 'Phase 4 of Black Cipher. Deploy advanced team projects using APIs, databases, and real-world Python applications.',
      image: '/CodeFly Homepage 3.png',
      prerequisite: 'LOOP CANYON BASE',
      route: '/mission/quantum-breach'
    }
  ]

  // Add dynamic status to missions
  const missions: Mission[] = baseMissions.map(mission => {
    const completedMissions = getCompletedMissions()
    const isCompleted = completedMissions.includes(mission.id)
    const isUnlocked = !mission.prerequisite || isMissionUnlocked(mission, baseMissions as Mission[])
    
    return {
      ...mission,
      status: isCompleted ? 'COMPLETED' as const : 
              isUnlocked ? 'ACTIVE' as const : 
              'LOCKED' as const
    }
  })

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,0,0,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,255,0,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(0,100,255,0.2) 0%, transparent 50%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
          animation: 'scan 8s linear infinite'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/90 border-b border-green-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center animate-pulse">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-300 font-mono">MISSION CENTRAL</h1>
                  <div className="text-xs text-green-400 font-mono">HEADQUARTERS • SECTOR 7</div>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="hidden md:flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">SYSTEMS: {systemStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400">COMMS: SECURE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400">NETWORK: ENCRYPTED</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-300 font-mono">AGENT</div>
                <div className="text-xs text-green-400">{user?.full_name || 'CLASSIFIED'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-600/50 rounded-lg text-red-300 text-sm font-mono transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="bg-black/80 border border-green-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-green-400 mb-2 font-mono">
                WELCOME TO MISSION CONTROL
              </h2>
              <p className="text-gray-300 font-mono">
                Select your operation below. Complete missions to unlock advanced training protocols.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400 font-mono">LEVEL 7</div>
              <div className="text-sm text-gray-400">2,450 / 5,000 XP</div>
              <div className="w-32 h-2 bg-gray-800 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{width: '49%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">3/15</div>
                <div className="text-xs text-gray-400 font-mono">MISSIONS COMPLETE</div>
              </div>
            </div>
          </div>
          <div className="bg-black/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">24.5</div>
                <div className="text-xs text-gray-400 font-mono">HOURS DEPLOYED</div>
              </div>
            </div>
          </div>
          <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-yellow-400">8</div>
                <div className="text-xs text-gray-400 font-mono">BADGES EARNED</div>
              </div>
            </div>
          </div>
          <div className="bg-black/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">87%</div>
                <div className="text-xs text-gray-400 font-mono">ACCURACY RATE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-amber-400 mb-6 font-mono flex items-center gap-3">
            <Crosshair className="w-6 h-6" />
            AVAILABLE OPERATIONS
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  mission.status === 'LOCKED' ? 'opacity-60' : ''
                }`}
                onClick={() => mission.status !== 'LOCKED' && setSelectedMission(mission)}
              >
                {/* Mission Card */}
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-green-500/50 transition-all">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${mission.image}")`,
                      filter: mission.status === 'LOCKED' ? 'grayscale(1) brightness(0.3)' : 'brightness(0.5)'
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  {/* Lock Overlay */}
                  {mission.status === 'LOCKED' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-red-500 mx-auto mb-2" />
                        <div className="text-red-400 font-mono text-sm">CLASSIFIED</div>
                        <div className="text-gray-500 text-xs mt-1">Requires: {mission.prerequisite}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                          mission.difficulty === 'EXTREME' ? 'bg-red-900/80 text-red-300' :
                          mission.difficulty === 'EXPERT' ? 'bg-orange-900/80 text-orange-300' :
                          mission.difficulty === 'ADVANCED' ? 'bg-yellow-900/80 text-yellow-300' :
                          mission.difficulty === 'INTERMEDIATE' ? 'bg-blue-900/80 text-blue-300' :
                          'bg-green-900/80 text-green-300'
                        }`}>
                          {mission.difficulty}
                        </span>
                        {mission.status === 'ACTIVE' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{mission.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{mission.codename}</p>
                    </div>
                    
                    {/* Footer */}
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">{mission.description}</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{mission.duration}</span>
                        <span className="text-yellow-400">{mission.xpReward.toLocaleString()} XP</span>
                      </div>
                      {mission.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{width: `${mission.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-black/80 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-amber-400 mb-4 font-mono flex items-center gap-3">
            <Activity className="w-5 h-5" />
            RECENT ACTIVITY
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-center justify-between text-gray-300">
              <span>• Completed Python Variables Challenge</span>
              <span className="text-green-400">+250 XP</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>• Earned "Quick Learner" Badge</span>
              <span className="text-yellow-400">ACHIEVEMENT</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>• 5-Day Login Streak</span>
              <span className="text-blue-400">BONUS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-black/95 border-2 border-green-500/50 rounded-xl max-w-4xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">{selectedMission.name}</h2>
                <p className="text-gray-400 font-mono">{selectedMission.codename}</p>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">{selectedMission.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">DIFFICULTY</div>
                <div className="text-lg font-bold text-yellow-400">{selectedMission.difficulty}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">DURATION</div>
                <div className="text-lg font-bold text-blue-400">{selectedMission.duration}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">XP REWARD</div>
                <div className="text-lg font-bold text-green-400">{selectedMission.xpReward.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">STATUS</div>
                <div className="text-lg font-bold text-red-400">{selectedMission.status}</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              {selectedMission.status === 'ACTIVE' ? (
                <>
                  <Link
                    href={selectedMission.route}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-4 rounded-lg font-bold hover:from-green-500 hover:to-green-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Target className="w-5 h-5" />
                    VIEW MISSION BRIEFING
                  </Link>
                  <Link
                    href="/black-cipher-lesson-dashboard"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-lg font-bold hover:from-red-500 hover:to-red-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Crosshair className="w-5 h-5" />
                    START MISSION
                  </Link>
                  {/* Test button for completing missions - remove in production */}
                  <button
                    onClick={() => {
                      completeMission(selectedMission.id)
                      setSelectedMission(null)
                      window.location.reload() // Refresh to show updated status
                    }}
                    className="px-4 py-4 bg-yellow-900 hover:bg-yellow-800 text-yellow-300 rounded-lg font-bold transition-all text-xs"
                    title="TEST: Complete Mission"
                  >
                    ✓ COMPLETE (TEST)
                  </button>
                </>
              ) : selectedMission.status === 'COMPLETED' ? (
                <div className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-3">
                  <Award className="w-5 h-5" />
                  MISSION COMPLETED
                </div>
              ) : (
                <button
                  className="flex-1 bg-gray-800 text-gray-400 px-8 py-4 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-3"
                  disabled
                >
                  <Lock className="w-5 h-5" />
                  MISSION LOCKED
                </button>
              )}
              <button
                onClick={() => setSelectedMission(null)}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-lg font-bold transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}