'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, Lock, CheckCircle, Play, Users, Trophy, Zap, Target, Clock, BookOpen, Star, Flame } from 'lucide-react'

interface Mission {
  id: number
  name: string
  week: number
  phase: 'Shadow Protocol' | 'Cipher Command' | 'Ghost Protocol' | 'Quantum Breach'
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
  // Phase 1: Shadow Protocol (Weeks 1-4) - Solo Missions
  { id: 1, name: 'Binary Shores Academy', week: 1, phase: 'Shadow Protocol', type: 'solo', difficulty: 1, xpReward: 250, description: 'Master variables and basic data types', unlocked: true, completed: true },
  { id: 2, name: 'Variable Village Outpost', week: 2, phase: 'Shadow Protocol', type: 'solo', difficulty: 1, xpReward: 300, description: 'String manipulation and user input mastery', unlocked: true, completed: true },
  { id: 3, name: 'Logic Lake Fortress', week: 3, phase: 'Shadow Protocol', type: 'solo', difficulty: 2, xpReward: 350, description: 'Conditional statements and boolean logic', unlocked: true, completed: false },
  { id: 4, name: 'Shadow Protocol Assessment', week: 4, phase: 'Shadow Protocol', type: 'assessment', difficulty: 2, xpReward: 400, description: 'Solo project combining all foundational skills', unlocked: false, completed: false, assessmentType: 'project' },

  // Phase 2: Cipher Command (Weeks 5-8) - Transition to Teams  
  { id: 5, name: 'Loop Canyon Base', week: 5, phase: 'Cipher Command', type: 'solo', difficulty: 2, xpReward: 450, description: 'Master for and while loops', unlocked: false, completed: false },
  { id: 6, name: 'Team Formation Protocol', week: 6, phase: 'Cipher Command', type: 'team', difficulty: 2, xpReward: 500, description: 'Join your development squad', unlocked: false, completed: false, teamRequired: true },
  { id: 7, name: 'Function Forest Station', week: 7, phase: 'Cipher Command', type: 'team', difficulty: 3, xpReward: 550, description: 'Create reusable functions and modules', unlocked: false, completed: false, teamRequired: true },
  { id: 8, name: 'Cipher Command Challenge', week: 8, phase: 'Cipher Command', type: 'assessment', difficulty: 3, xpReward: 600, description: 'First team project showcase', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' },

  // Phase 3: Ghost Protocol (Weeks 9-13) - Team Missions
  { id: 9, name: 'Array Mountains Facility', week: 9, phase: 'Ghost Protocol', type: 'team', difficulty: 3, xpReward: 650, description: 'Data structures and list manipulation', unlocked: false, completed: false, teamRequired: true },
  { id: 10, name: 'Object Oasis Complex', week: 10, phase: 'Ghost Protocol', type: 'team', difficulty: 4, xpReward: 700, description: 'Object-oriented programming fundamentals', unlocked: false, completed: false, teamRequired: true },
  { id: 11, name: 'Algorithm Archipelago', week: 11, phase: 'Ghost Protocol', type: 'team', difficulty: 4, xpReward: 750, description: 'Sorting and searching algorithms', unlocked: false, completed: false, teamRequired: true },
  { id: 12, name: 'Ghost Protocol Midterm', week: 12, phase: 'Ghost Protocol', type: 'assessment', difficulty: 4, xpReward: 800, description: 'Comprehensive team assessment', unlocked: false, completed: false, teamRequired: true, assessmentType: 'test' },
  { id: 13, name: 'Debug Caves Expedition', week: 13, phase: 'Ghost Protocol', type: 'team', difficulty: 4, xpReward: 850, description: 'Advanced debugging and error handling', unlocked: false, completed: false, teamRequired: true },

  // Phase 4: Quantum Breach (Weeks 14-18) - Advanced Team Challenges
  { id: 14, name: 'API Gateway Fortress', week: 14, phase: 'Quantum Breach', type: 'team', difficulty: 5, xpReward: 900, description: 'REST APIs and web integration', unlocked: false, completed: false, teamRequired: true },
  { id: 15, name: 'Database Depths', week: 15, phase: 'Quantum Breach', type: 'team', difficulty: 5, xpReward: 950, description: 'SQL and database design', unlocked: false, completed: false, teamRequired: true },
  { id: 16, name: 'Security Stronghold', week: 16, phase: 'Quantum Breach', type: 'team', difficulty: 5, xpReward: 1000, description: 'Cybersecurity and safe coding practices', unlocked: false, completed: false, teamRequired: true },
  { id: 17, name: 'Quantum Breach Protocol', week: 17, phase: 'Quantum Breach', type: 'assessment', difficulty: 6, xpReward: 1100, description: 'Advanced team capstone project', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' },
  { id: 18, name: 'The Final Breach', week: 18, phase: 'Quantum Breach', type: 'assessment', difficulty: 6, xpReward: 1200, description: 'Ultimate coding mastery showcase', unlocked: false, completed: false, teamRequired: true, assessmentType: 'project' }
]

const PHASE_COLORS = {
  'Shadow Protocol': 'from-gray-600 to-slate-700',
  'Cipher Command': 'from-blue-600 to-indigo-700', 
  'Ghost Protocol': 'from-purple-600 to-violet-700',
  'Quantum Breach': 'from-pink-600 to-rose-700'
}

const PHASE_ICONS = {
  'Shadow Protocol': '🕯️',
  'Cipher Command': '🔐',
  'Ghost Protocol': '👻',
  'Quantum Breach': '⚛️'
}

export default function CurriculumOverview() {
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

  const phases = ['Shadow Protocol', 'Cipher Command', 'Ghost Protocol', 'Quantum Breach']

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/student/dashboard"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CodeFly Curriculum ✈️
                  </h1>
                  <p className="text-sm text-gray-300">18-Week Coding Mastery Program</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">Week {currentWeek} of 18</span>
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
                className={`bg-gradient-to-br ${PHASE_COLORS[phase as keyof typeof PHASE_COLORS]}/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 cursor-pointer transition-all transform hover:scale-105 ${
                  isCurrentPhase ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                } ${selectedPhase === phase ? 'scale-105 border-white/50' : ''}`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{PHASE_ICONS[phase as keyof typeof PHASE_ICONS]}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{phase}</h3>
                    <p className="text-xs text-gray-300">Weeks {missions[0]?.week}-{missions[missions.length-1]?.week}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white mb-2">
                    <span>Progress</span>
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${progress.percentage}%`}}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-300">
                  {progress.completed === 0 ? 'Not Started' : 
                   progress.completed === progress.total ? '✅ Complete' :
                   isCurrentPhase ? '⚡ Current Phase' : 'In Progress'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mission Timeline */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <Target className="h-6 w-6 text-purple-400" />
            <span>Mission Timeline</span>
            {selectedPhase && <span className="text-lg">- {selectedPhase}</span>}
          </h2>

          <div className="grid gap-4">
            {(selectedPhase ? getMissionsForPhase(selectedPhase) : CURRICULUM_MISSIONS).map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission)}
                className={`p-4 rounded-xl border transition-all transform hover:scale-102 cursor-pointer ${
                  mission.completed 
                    ? 'bg-green-500/20 border-green-400/50 hover:border-green-300/70' 
                    : mission.unlocked
                    ? mission.week === currentWeek
                      ? 'bg-yellow-500/20 border-yellow-400/50 hover:border-yellow-300/70 ring-2 ring-yellow-400/30'
                      : 'bg-blue-500/20 border-blue-400/50 hover:border-blue-300/70'
                    : 'bg-gray-500/20 border-gray-400/50 opacity-60 cursor-not-allowed'
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
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{mission.name}</span>
                        {mission.teamRequired && <Users className="h-4 w-4 text-blue-400" />}
                        {mission.week === currentWeek && <Flame className="h-4 w-4 text-orange-400 animate-pulse" />}
                      </h3>
                      <p className="text-sm text-gray-300">{mission.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                        <span>Week {mission.week}</span>
                        <span>Difficulty: {'⭐'.repeat(mission.difficulty)}</span>
                        <span className="text-yellow-400">+{mission.xpReward} XP</span>
                        {mission.type === 'assessment' && (
                          <span className="bg-purple-500/30 px-2 py-1 rounded text-purple-200">
                            {mission.assessmentType?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      mission.completed ? 'text-green-400' : 
                      mission.unlocked ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {mission.phase === 'Shadow Protocol' ? '🕯️' :
                       mission.phase === 'Cipher Command' ? '🔐' :
                       mission.phase === 'Ghost Protocol' ? '👻' : '⚛️'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Formation Highlight */}
        <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-400 animate-pulse" />
            <div>
              <h3 className="text-xl font-bold text-white">Team Development Track</h3>
              <p className="text-blue-200">
                {currentWeek < 6 
                  ? `Solo missions until Week 6, then join your development team!`
                  : localStorage.getItem('student_team')
                  ? `You're part of Team ${JSON.parse(localStorage.getItem('student_team') || '{}').name || 'Alpha'}`
                  : `Ready to join your development team? Complete Team Formation Protocol!`
                }
              </p>
            </div>
            <div className="flex-1"></div>
            {currentWeek >= 6 && !localStorage.getItem('student_team') && (
              <button
                onClick={() => router.push('/team-formation')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Join Team</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}