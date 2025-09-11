'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, Lock, CheckCircle, Play, Users, Trophy, Zap, Target, Clock, BookOpen, Star, Flame, AlertTriangle, Shield } from 'lucide-react'

interface Mission {
  id: number
  name: string
  week: number
  phase: 'Binary Shores Academy' | 'Mission Atlas' | 'Code Falcon' | 'Project Vector'
  type: 'solo' | 'team' | 'assessment'
  difficulty: number
  xpReward: number
  description: string
  unlocked: boolean
  completed: boolean
  teamRequired?: boolean
  assessmentType?: 'quiz' | 'test' | 'review' | 'project'
}

const CURRICULUM_MISSIONS: Mission[] = [
  // Phase 1: Binary Shores Academy (Weeks 1-4) - Solo Missions
  { id: 1, name: 'Intelligence Gathering', week: 1, phase: 'Binary Shores Academy', type: 'solo', difficulty: 1, xpReward: 250, description: 'Master variables and data storage', unlocked: true, completed: false },
  { id: 2, name: 'Communication Protocols', week: 2, phase: 'Binary Shores Academy', type: 'solo', difficulty: 1, xpReward: 300, description: 'Print statements and output mastery', unlocked: false, completed: false },
  { id: 3, name: 'Terminal Hacking', week: 3, phase: 'Binary Shores Academy', type: 'solo', difficulty: 2, xpReward: 350, description: 'Input and user interaction', unlocked: false, completed: false },
  { id: 4, name: 'Mission Calculations', week: 4, phase: 'Binary Shores Academy', type: 'assessment', difficulty: 2, xpReward: 400, description: 'Basic math and operations assessment', unlocked: false, completed: false, assessmentType: 'project' },

  // Phase 2: Mission Atlas (Weeks 5-8) - Transition to Teams  
  { id: 5, name: 'Loop Canyon Base', week: 5, phase: 'Mission Atlas', type: 'solo', difficulty: 2, xpReward: 450, description: 'Master for and while loops', unlocked: false, completed: false },
  { id: 6, name: 'Team Formation Protocol', week: 6, phase: 'Mission Atlas', type: 'team', difficulty: 2, xpReward: 500, description: 'Join your development squad', unlocked: false, completed: false, teamRequired: true },
  { id: 7, name: 'Function Forest Station', week: 7, phase: 'Mission Atlas', type: 'team', difficulty: 3, xpReward: 550, description: 'Create reusable functions and modules', unlocked: false, completed: false, teamRequired: true },
  { id: 8, name: 'Mission Atlas Challenge', week: 8, phase: 'Mission Atlas', type: 'assessment', difficulty: 3, xpReward: 600, description: 'First team project showcase', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' },

  // Phase 3: Code Falcon (Weeks 9-13) - Team Missions
  { id: 9, name: 'Array Mountains Facility', week: 9, phase: 'Code Falcon', type: 'team', difficulty: 3, xpReward: 650, description: 'Data structures and list manipulation', unlocked: false, completed: false, teamRequired: true },
  { id: 10, name: 'Object Oasis Complex', week: 10, phase: 'Code Falcon', type: 'team', difficulty: 4, xpReward: 700, description: 'Object-oriented programming fundamentals', unlocked: false, completed: false, teamRequired: true },
  { id: 11, name: 'Algorithm Archipelago', week: 11, phase: 'Code Falcon', type: 'team', difficulty: 4, xpReward: 750, description: 'Sorting and searching algorithms', unlocked: false, completed: false, teamRequired: true },
  { id: 12, name: 'Code Falcon Midterm', week: 12, phase: 'Code Falcon', type: 'assessment', difficulty: 4, xpReward: 800, description: 'Comprehensive team assessment', unlocked: false, completed: false, teamRequired: true, assessmentType: 'test' },
  { id: 13, name: 'Debug Caves Expedition', week: 13, phase: 'Code Falcon', type: 'team', difficulty: 4, xpReward: 850, description: 'Advanced debugging and error handling', unlocked: false, completed: false, teamRequired: true },

  // Phase 4: Project Vector (Weeks 14-18) - Advanced Team Challenges
  { id: 14, name: 'API Gateway Fortress', week: 14, phase: 'Project Vector', type: 'team', difficulty: 5, xpReward: 900, description: 'REST APIs and web integration', unlocked: false, completed: false, teamRequired: true },
  { id: 15, name: 'Database Depths', week: 15, phase: 'Project Vector', type: 'team', difficulty: 5, xpReward: 950, description: 'SQL and database design', unlocked: false, completed: false, teamRequired: true },
  { id: 16, name: 'Security Stronghold', week: 16, phase: 'Project Vector', type: 'team', difficulty: 5, xpReward: 1000, description: 'Cybersecurity and safe coding practices', unlocked: false, completed: false, teamRequired: true },
  { id: 17, name: 'Project Vector Protocol', week: 17, phase: 'Project Vector', type: 'assessment', difficulty: 6, xpReward: 1100, description: 'Advanced team capstone project', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' },
  { id: 18, name: 'The Final Breach', week: 18, phase: 'Project Vector', type: 'assessment', difficulty: 6, xpReward: 1200, description: 'Ultimate coding mastery showcase', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' }
]

const PHASE_COLORS = {
  'Binary Shores Academy': 'border-green-400/30 bg-green-400/5',
  'Mission Atlas': 'border-cyan-400/30 bg-cyan-400/5', 
  'Code Falcon': 'border-amber-400/30 bg-amber-400/5',
  'Project Vector': 'border-red-400/30 bg-red-400/5'
}

const PHASE_ICONS = {
  'Binary Shores Academy': '🎯',
  'Mission Atlas': '🗺️',
  'Code Falcon': '🦅',
  'Project Vector': '⚡'
}

export default function MissionObjectives() {
  const router = useRouter()
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState(2) // Demo: student is on week 2

  useEffect(() => {
    // Check authentication
    const demoMode = localStorage.getItem('codefly_demo_mode') === 'true'
    const demoAuth = localStorage.getItem('demo_authenticated') === 'true'
    
    if (!demoMode && !demoAuth) {
      router.push('/auth')
    }
  }, [router])

  const phases = ['Binary Shores Academy', 'Mission Atlas', 'Code Falcon', 'Project Vector']

  const getMissionsForPhase = (phase: string) => {
    return CURRICULUM_MISSIONS.filter(mission => mission.phase === phase)
  }

  const getPhaseProgress = (phase: string) => {
    const missions = getMissionsForPhase(phase)
    const completed = missions.filter(m => m.completed).length
    return { completed, total: missions.length, percentage: (completed / missions.length) * 100 }
  }

  const handleMissionClick = (mission: Mission) => {
    if (!mission.unlocked) {
      alert(`🔒 Mission Locked!\n\nComplete previous missions to unlock "${mission.name}"`)
      return
    }

    if (mission.teamRequired && mission.week >= 6) {
      // Check if student has a team
      const hasTeam = localStorage.getItem('student_team') 
      if (!hasTeam && mission.id === 6) {
        // First team formation mission
        router.push('/team-formation')
        return
      } else if (!hasTeam) {
        alert('🤝 Team Required!\n\nYou need to join a development team before starting team missions. Complete "Team Formation Protocol" first!')
        return
      }
    }

    if (mission.type === 'assessment') {
      alert(`📋 ${mission.assessmentType?.toUpperCase()} READY\n\n"${mission.name}"\n\n${mission.description}\n\nXP Reward: ${mission.xpReward}\n\nReady to begin?`)
    } else {
      // Navigate to lesson
      router.push(`/lesson/week-${mission.week.toString().padStart(2, '0')}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Tactical HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400"></div>
        
        {/* Top HUD Bar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-sm border-b border-green-400/30">
          <div className="flex items-center justify-between px-8 py-3">
            <div className="flex items-center space-x-4">
              <span className="text-green-400 text-sm font-mono">OPERATION: DIGITAL FORTRESS</span>
              <div className="text-amber-400 text-sm">● MISSION OBJECTIVES</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 text-sm">CLEARANCE LEVEL: TOP SECRET</span>
              <div className="text-cyan-400 text-sm animate-pulse">SYSTEM ONLINE</div>
            </div>
          </div>
        </div>

        {/* Scanning Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-ping"></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-1/3 animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent top-2/3 animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Side Status Indicators */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4">
          <div className="bg-black/80 backdrop-blur-sm border border-green-400/30 p-2 text-xs space-y-1">
            <div className="text-green-400">SYS STATUS</div>
            <div className="text-amber-400">● ACTIVE</div>
            <div className="text-cyan-400">● ONLINE</div>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4">
          <div className="bg-black/80 backdrop-blur-sm border border-green-400/30 p-2 text-xs space-y-1">
            <div className="text-green-400">THREAT LVL</div>
            <div className="text-red-400">● MINIMAL</div>
            <div className="text-green-400">● SECURE</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative bg-black/90 backdrop-blur-sm border-b border-green-400/30 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/agent-academy-intel"
                className="flex items-center space-x-2 bg-black/80 border border-green-400/50 hover:border-green-400 text-green-400 px-3 py-2 transition-all duration-300 hover:bg-green-400/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-mono">AGENT COMMAND</span>
              </Link>
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-400 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold text-green-400 font-mono">
                    MISSION OBJECTIVES
                  </h1>
                  <p className="text-sm text-cyan-400 font-mono">BLACK CIPHER - 18-WEEK INFILTRATION PROTOCOL</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-black/80 border border-green-400/30 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-green-400 font-mono">WEEK {currentWeek}/18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Phase Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {phases.map((phase, index) => {
            const progress = getPhaseProgress(phase)
            const missions = getMissionsForPhase(phase)
            const isCurrentPhase = missions.some(m => m.week === currentWeek)
            
            return (
              <div
                key={phase}
                onClick={() => setSelectedPhase(selectedPhase === phase ? null : phase)}
                className={`${PHASE_COLORS[phase as keyof typeof PHASE_COLORS]} backdrop-blur-lg border p-6 cursor-pointer transition-all transform hover:scale-105 ${
                  isCurrentPhase ? 'border-amber-400 bg-amber-400/10' : ''
                } ${selectedPhase === phase ? 'scale-105 border-green-400' : ''}`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{PHASE_ICONS[phase as keyof typeof PHASE_ICONS]}</div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 font-mono">{phase}</h3>
                    <p className="text-xs text-cyan-400 font-mono">WEEKS {missions[0]?.week}-{missions[missions.length-1]?.week}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-green-400 font-mono mb-2">
                    <span>PROGRESS</span>
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="w-full bg-black/50 border border-green-400/30 h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 transition-all duration-500" 
                      style={{width: `${progress.percentage}%`}}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-amber-400 font-mono">
                  {progress.completed === 0 ? '[ NOT STARTED ]' : 
                   progress.completed === progress.total ? '[ ✓ COMPLETE ]' :
                   isCurrentPhase ? '[ ⚡ ACTIVE ]' : '[ IN PROGRESS ]'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mission Timeline */}
        <div className="bg-black/80 backdrop-blur-lg border border-green-400/30 p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center space-x-3 font-mono">
            <Target className="h-6 w-6 text-green-400" />
            <span>MISSION TIMELINE</span>
            {selectedPhase && <span className="text-lg text-cyan-400">- {selectedPhase}</span>}
          </h2>

          <div className="grid gap-4">
            {(selectedPhase ? getMissionsForPhase(selectedPhase) : CURRICULUM_MISSIONS).map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission)}
                className={`p-4 border transition-all transform hover:scale-102 cursor-pointer bg-black/50 ${
                  mission.completed 
                    ? 'border-green-400/70 hover:border-green-400 bg-green-400/5' 
                    : mission.unlocked
                    ? mission.week === currentWeek
                      ? 'border-amber-400/70 hover:border-amber-400 bg-amber-400/10'
                      : 'border-cyan-400/50 hover:border-cyan-400/70 bg-cyan-400/5'
                    : 'border-red-400/30 opacity-60 cursor-not-allowed bg-red-400/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {mission.completed ? '✅' : mission.unlocked ? 
                        (mission.type === 'solo' ? '🎯' : mission.type === 'team' ? '👥' : '📋') 
                        : '🔒'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-400 flex items-center space-x-2 font-mono">
                        <span>{mission.name}</span>
                        {mission.teamRequired && <Users className="h-4 w-4 text-cyan-400" />}
                        {mission.week === currentWeek && <Flame className="h-4 w-4 text-amber-400 animate-pulse" />}
                      </h3>
                      <p className="text-sm text-cyan-400 font-mono">{mission.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-amber-400 mt-1 font-mono">
                        <span>WEEK {mission.week}</span>
                        <span>DIFF: {'⭐'.repeat(mission.difficulty)}</span>
                        <span className="text-green-400">+{mission.xpReward} XP</span>
                        {mission.type === 'assessment' && (
                          <span className="bg-red-400/20 border border-red-400/30 px-2 py-1 text-red-400">
                            {mission.assessmentType?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      mission.completed ? 'text-green-400' : 
                      mission.unlocked ? 'text-cyan-400' : 'text-red-400'
                    }`}>
                      {mission.phase === 'Binary Shores Academy' ? '🎯' :
                       mission.phase === 'Mission Atlas' ? '🗺️' :
                       mission.phase === 'Code Falcon' ? '🦅' : '⚡'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Formation Highlight */}
        <div className="mt-6 bg-black/80 backdrop-blur-lg border border-cyan-400/30 p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-xl font-bold text-green-400 font-mono">SQUAD FORMATION PROTOCOL</h3>
              <p className="text-cyan-400 font-mono">
                {currentWeek < 6 
                  ? `[ SOLO OPS UNTIL WEEK 6 - THEN JOIN DEVELOPMENT SQUAD ]`
                  : localStorage.getItem('student_team')
                  ? `[ ACTIVE SQUAD: ${JSON.parse(localStorage.getItem('student_team') || '{}').name || 'ALPHA'} ]`
                  : `[ READY TO JOIN DEVELOPMENT SQUAD? COMPLETE FORMATION PROTOCOL ]`
                }
              </p>
            </div>
            <div className="flex-1"></div>
            {currentWeek >= 6 && !localStorage.getItem('student_team') && (
              <button
                onClick={() => router.push('/team-formation')}
                className="bg-black/80 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 px-6 py-3 font-medium transition-all transform hover:scale-105 flex items-center space-x-2 font-mono hover:bg-cyan-400/10"
              >
                <Users className="h-4 w-4" />
                <span>JOIN SQUAD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}