'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, Target, Lock, Unlock, Activity, Radio, AlertTriangle,
  ChevronRight, Clock, Award, TrendingUp, Users, Zap, MapPin,
  Navigation, Crosshair, Database, Globe, Cpu, Wifi, LogOut
} from 'lucide-react'
import { getCompletedMissions, completeMission as completeMissionDB, startMission } from '@/lib/mission-progress'
import { getCurrentUser } from '@/lib/auth'
import { getMissionRewardDisplay, formatMissionRewards } from '@/lib/mission-rewards'

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
  const [showDetailedBriefing, setShowDetailedBriefing] = useState(false)
  const [systemStatus, setSystemStatus] = useState('ONLINE')
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication and load mission progress from Supabase
    const checkAuthAndLoadProgress = async () => {
      try {
        // Check real user auth first
        const { user: authUser } = await getCurrentUser()
        if (authUser) {
          setUser(authUser)
          // Fetch completed missions from Supabase
          const completed = await getCompletedMissions(authUser.id)
          setCompletedMissions(completed)
          setLoading(false)
          return
        }

        // CRITICAL FIX: Check demo authentication from cookies first (matches middleware)
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(';').shift()
          return null
        }
        
        const demoToken = getCookie('demo_auth_token')
        const demoRole = getCookie('demo_user_role')
        
        if (demoToken === 'demo_access_2024' && demoRole) {
          setUser({
            role: demoRole as 'student' | 'teacher',
            id: 'demo_user',
            email: 'demo@codefly.com',
            isDemoUser: true
          })
          setCompletedMissions([])
          setLoading(false)
          return
        }
        
        // Fallback: Check localStorage authentication 
        const demoAuthenticated = localStorage.getItem('demo_authenticated') === 'true'
        const demoUserStr = localStorage.getItem('demo_user')
        
        if (demoAuthenticated && demoUserStr) {
          const demoUser = JSON.parse(demoUserStr)
          setUser(demoUser)
          // Demo users get empty mission progress for now
          setCompletedMissions([])
          setLoading(false)
          return
        }

        // No authentication found - allow public access for demo
        setUser({
          role: 'student' as 'student',
          id: 'public_user',
          email: 'public@codefly.com',
          isDemoUser: true
        })
        setCompletedMissions([])
        setLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Allow public access even on auth errors
        setUser({
          role: 'student' as 'student',
          id: 'public_user',
          email: 'public@codefly.com',
          isDemoUser: true
        })
        setCompletedMissions([])
        setLoading(false)
      }
    }
    
    checkAuthAndLoadProgress()
  }, [router])

  const handleLogout = async () => {
    // Sign out from Supabase
    const { signOut } = await import('@/lib/auth')
    await signOut()
    
    router.push('/')
  }

  // Mission progression system - now using Supabase
  const completeMission = async (missionId: string) => {
    if (!user) return
    
    // Save to Supabase
    const { data, error } = await completeMissionDB(user.id, missionId)
    
    if (!error) {
      // Update local state
      setCompletedMissions(prev => [...prev, missionId])
    }
  }

  const isMissionUnlocked = (mission: Omit<Mission, 'status'>, missions: Omit<Mission, 'status'>[]): boolean => {
    if (!mission.prerequisite) return true // First mission is always unlocked
    
    const prerequisiteMission = missions.find(m => m.name === mission.prerequisite)
    return prerequisiteMission ? completedMissions.includes(prerequisiteMission.id) : false
  }

  // Base mission data - status will be determined dynamically
  const baseMissions: Omit<Mission, 'status'>[] = [
    {
      id: 'binary-shores-academy',
      name: 'BINARY SHORES ACADEMY',
      codename: 'OPERATION: INTRODUCTION & SETUP',
      difficulty: 'BEGINNER',
      duration: '2 WEEKS',
      xpReward: 2500,
      progress: 0,
      description: 'Operation 1: Introduction & Setup. Master Python basics and AI agent fundamentals. Set up your development environment and learn ethical AI guidelines.',
      image: '/CodeFly Homepage.png',
      route: '/mission/binary-shores-academy'
    },
    {
      id: 'variable-village',
      name: 'VARIABLE VILLAGE',
      codename: 'OPERATION: DATA TYPES & VARIABLES',
      difficulty: 'BEGINNER',
      duration: '2 WEEKS',
      xpReward: 3000,
      progress: 0,
      description: 'Operation 2: Data Types & Variables. Learn to handle data processing, JSON manipulation, and structured prompts with error recovery protocols.',
      image: '/CodeFly Homepage 2.png',
      prerequisite: 'BINARY SHORES ACADEMY',
      route: '/mission/variable-village'
    },
    {
      id: 'logic-lake-outpost',
      name: 'LOGIC LAKE OUTPOST',
      codename: 'OPERATION: CONDITIONALS & BOOLEAN LOGIC',
      difficulty: 'INTERMEDIATE',
      duration: '3 WEEKS',
      xpReward: 4000,
      progress: 0,
      description: 'Operation 3: Conditionals & Boolean Logic. Build AI decision systems with ethical frameworks and explainable AI components.',
      image: '/CodeFly Homepage 3.png',
      prerequisite: 'VARIABLE VILLAGE',
      route: '/mission/logic-lake-outpost'
    },
    {
      id: 'loop-canyon-base',
      name: 'LOOP CANYON BASE',
      codename: 'OPERATION: LOOPS & ITERATION',
      difficulty: 'INTERMEDIATE',
      duration: '3 WEEKS',
      xpReward: 4500,
      progress: 0,
      description: 'Operation 4: For/While Loops & Iteration. Master batch processing with environmental responsibility and resource optimization.',
      image: '/CodeFly Homepage.png',
      prerequisite: 'LOGIC LAKE OUTPOST',
      route: '/mission/loop-canyon-base'
    },
    {
      id: 'function-forest-station',
      name: 'FUNCTION FOREST STATION',
      codename: 'OPERATION: FUNCTIONS & PARAMETERS',
      difficulty: 'ADVANCED',
      duration: '3 WEEKS',
      xpReward: 5000,
      progress: 0,
      description: 'Operation 5: Functions & Parameters. Create AI tool systems with safety constraints and ethical guardrails. Partner with real companies.',
      image: '/CodeFly Homepage 2.png',
      prerequisite: 'LOOP CANYON BASE',
      route: '/mission/function-forest-station'
    },
    {
      id: 'array-mountains-facility',
      name: 'ARRAY MOUNTAINS FACILITY',
      codename: 'OPERATION: LISTS & DATA STRUCTURES',
      difficulty: 'ADVANCED',
      duration: '2 WEEKS',
      xpReward: 5500,
      progress: 0,
      description: 'Operation 6: Lists & Data Structures. Build knowledge systems with privacy-by-design using vector embeddings and RAG systems.',
      image: '/CodeFly Homepage 3.png',
      prerequisite: 'FUNCTION FOREST STATION',
      route: '/mission/array-mountains-facility'
    },
    {
      id: 'object-oasis-complex',
      name: 'OBJECT OASIS COMPLEX',
      codename: 'OPERATION: CLASSES & OOP',
      difficulty: 'EXPERT',
      duration: '2 WEEKS',
      xpReward: 6000,
      progress: 0,
      description: 'Operation 7: Classes & OOP. Orchestrate multi-agent systems with governance frameworks and state management protocols.',
      image: '/CodeFly Homepage.png',
      prerequisite: 'ARRAY MOUNTAINS FACILITY',
      route: '/mission/object-oasis-complex'
    },
    {
      id: 'database-depths',
      name: 'DATABASE DEPTHS',
      codename: 'OPERATION: FINAL PROJECT & DATA MANAGEMENT',
      difficulty: 'EXTREME',
      duration: '1 WEEK',
      xpReward: 7500,
      progress: 0,
      description: 'Operation 8: Final Project & Data Management. Deploy complete ethical AI systems with impact assessment and stakeholder communication.',
      image: '/CodeFly Homepage 2.png',
      prerequisite: 'OBJECT OASIS COMPLEX',
      route: '/mission/database-depths'
    }
  ]

  // Add dynamic status to missions
  const missions: Mission[] = baseMissions.map(mission => {
    const isCompleted = completedMissions.includes(mission.id)
    const isUnlocked = !mission.prerequisite || isMissionUnlocked(mission, baseMissions)
    
    return {
      ...mission,
      status: isCompleted ? 'COMPLETED' as const : 
              isUnlocked ? 'ACTIVE' as const : 
              'LOCKED' as const
    }
  })
  
  // Start mission when user clicks start
  const handleStartMission = async (missionId: string) => {
    if (!user) return
    await startMission(user.id, missionId)
    router.push('/agent-academy-lesson-dashboard')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono">
          <div className="animate-pulse">LOADING MISSION DATA...</div>
        </div>
      </div>
    )
  }

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
                <div className="text-2xl font-bold text-blue-400">1/8</div>
                <div className="text-xs text-gray-400 font-mono">OPERATIONS COMPLETE</div>
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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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
                        <div className="text-gray-500 text-xs mt-1">CLEARANCE {mission.difficulty === 'EXPERT' ? 'OMEGA' : mission.difficulty === 'ADVANCED' ? 'DELTA' : 'CHARLIE'}</div>
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

            {/* Mission Rewards Section */}
            {(() => {
              const rewardData = formatMissionRewards(selectedMission.id)
              if (!rewardData) return null

              return (
                <div className="mb-8 bg-gray-900/30 border border-amber-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-4 font-mono flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    MISSION REWARDS
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Clearance & XP */}
                    <div className="space-y-4">
                      <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                        <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Security Clearance
                        </h4>
                        <div className="bg-purple-900/30 rounded-lg p-3">
                          <div className="text-sm text-gray-300 mb-1">{rewardData.detailed.clearanceCard.name}</div>
                          <div className="text-xs text-purple-300">{rewardData.detailed.clearanceCard.description}</div>
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
                        <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Experience Earned
                        </h4>
                        <div className="text-2xl font-bold text-green-400">
                          {rewardData.detailed.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Tech Items & Skills */}
                    <div className="space-y-4">
                      <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
                        <h4 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Tech Items Acquired ({rewardData.detailed.techItems.length})
                        </h4>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {rewardData.detailed.techItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{item.icon}</span>
                              <div>
                                <div className="text-blue-300 font-semibold">{item.name}</div>
                                <div className="text-xs text-gray-400">{item.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/30">
                        <h4 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          Skills Unlocked ({rewardData.detailed.skillsUnlocked.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {rewardData.detailed.skillsUnlocked.map((skill, index) => (
                            <span key={index} className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded-md border border-yellow-500/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Bonus */}
                  {rewardData.detailed.specialBonus && (
                    <div className="mt-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-amber-500/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{rewardData.detailed.specialBonus.icon}</span>
                        <div>
                          <div className="text-lg font-bold text-amber-400">{rewardData.detailed.specialBonus.name}</div>
                          <div className="text-sm text-amber-300">{rewardData.detailed.specialBonus.description}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
            
            <div className="flex gap-4">
              {selectedMission.status === 'ACTIVE' ? (
                <>
                  <button
                    onClick={() => setShowDetailedBriefing(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold hover:from-blue-500 hover:to-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Target className="w-5 h-5" />
                    VIEW MISSION BRIEFING
                  </button>
                  <button
                    onClick={() => handleStartMission(selectedMission.id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-lg font-bold hover:from-red-500 hover:to-red-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Crosshair className="w-5 h-5" />
                    START MISSION
                  </button>
                </>
              ) : selectedMission.status === 'COMPLETED' ? (
                <Link
                  href="/agent-academy-lesson-dashboard"
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-green-500 hover:to-green-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <Award className="w-6 h-6" />
                  CONTINUE TRAINING
                </Link>
              ) : (
                <div
                  className="bg-red-900/30 text-red-400 px-12 py-4 rounded-lg text-xl font-bold flex items-center justify-center gap-3 border border-red-600/30"
                >
                  <Lock className="w-6 h-6" />
                  MISSION LOCKED
                </div>
              )}
              <button
                onClick={() => setSelectedMission(null)}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-lg font-bold transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Mission Briefing Modal */}
      {showDetailedBriefing && selectedMission && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-black/95 border-2 border-green-500/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with mission image background */}
            <div className="relative h-64 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${selectedMission.image}")`,
                  filter: 'brightness(0.3) contrast(1.2)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
              
              {/* Close button */}
              <button
                onClick={() => setShowDetailedBriefing(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/80 border border-red-500/50 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-600/20 transition-all"
              >
                ✕
              </button>
              
              {/* Mission header */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-mono ${
                    selectedMission.difficulty === 'EXTREME' ? 'bg-red-900/80 text-red-300' :
                    selectedMission.difficulty === 'EXPERT' ? 'bg-orange-900/80 text-orange-300' :
                    selectedMission.difficulty === 'ADVANCED' ? 'bg-yellow-900/80 text-yellow-300' :
                    selectedMission.difficulty === 'INTERMEDIATE' ? 'bg-blue-900/80 text-blue-300' :
                    'bg-green-900/80 text-green-300'
                  }`}>
                    {selectedMission.difficulty} OPERATION
                  </span>
                  <span className="px-3 py-1 bg-amber-900/80 text-amber-300 rounded-lg text-sm font-mono">
                    CLASSIFIED
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-2 font-mono">
                  {selectedMission.name}
                </h1>
                <p className="text-xl text-gray-300 font-mono">
                  {selectedMission.codename}
                </p>
              </div>
            </div>

            {/* Briefing content */}
            <div className="p-8">
              {/* Mission Overview */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  SITUATION BRIEFING
                </h2>
                <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6">
                  <p className="text-lg text-gray-200 leading-relaxed mb-4">
                    {selectedMission.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{selectedMission.duration}</div>
                      <div className="text-xs text-green-300 font-mono">MISSION DURATION</div>
                    </div>
                    <div className="text-center p-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{selectedMission.xpReward.toLocaleString()}</div>
                      <div className="text-xs text-yellow-300 font-mono">XP REWARD</div>
                    </div>
                    <div className="text-center p-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">8</div>
                      <div className="text-xs text-blue-300 font-mono">LESSONS</div>
                    </div>
                    <div className="text-center p-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">HIGH</div>
                      <div className="text-xs text-purple-300 font-mono">SUCCESS RATE</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Objectives */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-400 mb-4 font-mono flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  PRIMARY OBJECTIVES
                </h2>
                <div className="space-y-3">
                  {[
                    "Master core Python programming fundamentals",
                    "Deploy AI agents through secure communication channels", 
                    "Implement ethical AI guidelines and safety protocols",
                    "Complete hands-on coding challenges with real-world applications"
                  ].map((objective, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/50 border border-blue-500/30 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-200">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intelligence Report */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono flex items-center gap-3">
                  <Radio className="w-6 h-6" />
                  INTELLIGENCE REPORT
                </h2>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-red-300 mb-3">Threat Assessment</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Complex coding challenges requiring strategic thinking</li>
                        <li>• Advanced AI integration patterns</li>
                        <li>• Time-sensitive mission parameters</li>
                        <li>• Ethical decision-making scenarios</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-300 mb-3">Resources Available</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Advanced IDE with AI assistance</li>
                        <li>• Real-time instructor support</li>
                        <li>• Team collaboration tools</li>
                        <li>• Emergency debugging protocols</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDetailedBriefing(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-700 transition-all flex items-center gap-2"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  RETURN TO MISSION SELECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}