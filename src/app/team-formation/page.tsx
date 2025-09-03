'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Shuffle, Zap, Star, Target, Trophy, Sparkles, Crown, Shield, Sword } from 'lucide-react'

interface Student {
  id: string
  name: string
  avatar: string
  skills: {
    problemSolving: number
    coding: number
    debugging: number
    creativity: number
    collaboration: number
  }
  overallStrength: number
  preferredRole: 'Leader' | 'Coder' | 'Tester' | 'Designer'
  workStyle: 'Fast' | 'Careful' | 'Creative' | 'Analytical'
}

interface Team {
  id: string
  name: string
  members: Student[]
  averageStrength: number
  skillBalance: number
  theme: string
  icon: string
}

const CLASS_STUDENTS: Student[] = [
  { id: 'demo-student', name: 'You', avatar: '🧑‍💻', skills: { problemSolving: 7, coding: 6, debugging: 5, creativity: 8, collaboration: 7 }, overallStrength: 6.6, preferredRole: 'Coder', workStyle: 'Creative' },
  { id: 'emma-w', name: 'Emma', avatar: '🧙‍♀️', skills: { problemSolving: 9, coding: 8, debugging: 7, creativity: 6, collaboration: 8 }, overallStrength: 7.6, preferredRole: 'Leader', workStyle: 'Analytical' },
  { id: 'marcus-j', name: 'Marcus', avatar: '🦸‍♂️', skills: { problemSolving: 6, coding: 9, debugging: 8, creativity: 5, collaboration: 6 }, overallStrength: 6.8, preferredRole: 'Coder', workStyle: 'Fast' },
  { id: 'zara-k', name: 'Zara', avatar: '🧚‍♀️', skills: { problemSolving: 8, coding: 7, debugging: 9, creativity: 7, collaboration: 9 }, overallStrength: 8.0, preferredRole: 'Tester', workStyle: 'Careful' },
  { id: 'diego-r', name: 'Diego', avatar: '🤖', skills: { problemSolving: 5, coding: 6, debugging: 4, creativity: 9, collaboration: 8 }, overallStrength: 6.4, preferredRole: 'Designer', workStyle: 'Creative' },
  { id: 'aisha-p', name: 'Aisha', avatar: '🧝‍♀️', skills: { problemSolving: 8, coding: 8, debugging: 6, creativity: 8, collaboration: 9 }, overallStrength: 7.8, preferredRole: 'Leader', workStyle: 'Analytical' },
  { id: 'kai-l', name: 'Kai', avatar: '🥷', skills: { problemSolving: 7, coding: 5, debugging: 8, creativity: 6, collaboration: 7 }, overallStrength: 6.6, preferredRole: 'Tester', workStyle: 'Careful' },
  { id: 'luna-s', name: 'Luna', avatar: '🦄', skills: { problemSolving: 6, coding: 7, debugging: 5, creativity: 9, collaboration: 8 }, overallStrength: 7.0, preferredRole: 'Designer', workStyle: 'Creative' },
  { id: 'alex-t', name: 'Alex', avatar: '🚀', skills: { problemSolving: 9, coding: 8, debugging: 7, creativity: 7, collaboration: 6 }, overallStrength: 7.4, preferredRole: 'Leader', workStyle: 'Fast' },
  { id: 'maya-c', name: 'Maya', avatar: '🌟', skills: { problemSolving: 7, coding: 9, debugging: 8, creativity: 6, collaboration: 7 }, overallStrength: 7.4, preferredRole: 'Coder', workStyle: 'Analytical' },
  { id: 'ryan-b', name: 'Ryan', avatar: '⚡', skills: { problemSolving: 5, coding: 6, debugging: 7, creativity: 8, collaboration: 9 }, overallStrength: 7.0, preferredRole: 'Designer', workStyle: 'Creative' },
  { id: 'sophie-m', name: 'Sophie', avatar: '💎', skills: { problemSolving: 8, coding: 7, debugging: 9, creativity: 7, collaboration: 8 }, overallStrength: 7.8, preferredRole: 'Tester', workStyle: 'Careful' }
]

const TEAM_THEMES = [
  { name: 'Shadow Wolves', icon: '🐺', color: 'from-gray-600 to-slate-700' },
  { name: 'Cipher Knights', icon: '🛡️', color: 'from-blue-600 to-indigo-700' },
  { name: 'Ghost Squad', icon: '👻', color: 'from-purple-600 to-violet-700' },
  { name: 'Quantum Hawks', icon: '🦅', color: 'from-pink-600 to-rose-700' },
  { name: 'Digital Dragons', icon: '🐲', color: 'from-green-600 to-emerald-700' },
  { name: 'Cyber Phoenix', icon: '🔥', color: 'from-orange-600 to-red-700' }
]

export default function TeamFormation() {
  const router = useRouter()
  const [phase, setPhase] = useState<'waiting' | 'randomizing' | 'teams-formed' | 'confirmed'>('waiting')
  const [randomizingStep, setRandomizingStep] = useState(0)
  const [formedTeams, setFormedTeams] = useState<Team[]>([])
  const [playerTeam, setPlayerTeam] = useState<Team | null>(null)
  const [showSkills, setShowSkills] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const demoMode = localStorage.getItem('codefly_demo_mode') === 'true'
    const demoAuth = localStorage.getItem('demo_authenticated') === 'true'
    
    if (!demoMode && !demoAuth) {
      router.push('/auth')
    }

    // Check if already has team
    const existingTeam = localStorage.getItem('student_team')
    if (existingTeam) {
      setPhase('confirmed')
      setPlayerTeam(JSON.parse(existingTeam))
    }
  }, [router])

  const calculateTeamBalance = (team: Student[]): number => {
    const skillAverages = {
      problemSolving: team.reduce((sum, s) => sum + s.skills.problemSolving, 0) / team.length,
      coding: team.reduce((sum, s) => sum + s.skills.coding, 0) / team.length,
      debugging: team.reduce((sum, s) => sum + s.skills.debugging, 0) / team.length,
      creativity: team.reduce((sum, s) => sum + s.skills.creativity, 0) / team.length,
      collaboration: team.reduce((sum, s) => sum + s.skills.collaboration, 0) / team.length
    }
    
    const skillValues = Object.values(skillAverages)
    const mean = skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length
    const variance = skillValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / skillValues.length
    
    return 10 - Math.sqrt(variance) // Higher score = more balanced
  }

  const createBalancedTeams = (): Team[] => {
    // Sort students by overall strength
    const sortedStudents = [...CLASS_STUDENTS].sort((a, b) => b.overallStrength - a.overallStrength)
    
    // Create 4 teams of 3 students each using snake draft
    const teams: Student[][] = [[], [], [], []]
    let currentTeam = 0
    let direction = 1
    
    sortedStudents.forEach(student => {
      teams[currentTeam].push(student)
      
      if (direction === 1 && currentTeam === 3) {
        direction = -1
      } else if (direction === -1 && currentTeam === 0) {
        direction = 1
      } else {
        currentTeam += direction
      }
    })

    // Convert to Team objects with themes
    return teams.map((teamMembers, index) => ({
      id: `team-${index + 1}`,
      name: TEAM_THEMES[index].name,
      members: teamMembers,
      averageStrength: teamMembers.reduce((sum, s) => sum + s.overallStrength, 0) / teamMembers.length,
      skillBalance: calculateTeamBalance(teamMembers),
      theme: TEAM_THEMES[index].name,
      icon: TEAM_THEMES[index].icon
    }))
  }

  const startRandomizer = async () => {
    setPhase('randomizing')
    setRandomizingStep(0)

    const steps = [
      'Analyzing student skills...',
      'Calculating optimal combinations...',
      'Balancing team strengths...',
      'Assigning team themes...',
      'Finalizing formations...'
    ]

    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      setRandomizingStep(i)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    // Create balanced teams
    const teams = createBalancedTeams()
    setFormedTeams(teams)
    
    // Find player's team
    const playerTeam = teams.find(team => 
      team.members.some(member => member.id === 'demo-student')
    )
    setPlayerTeam(playerTeam || null)
    
    setPhase('teams-formed')
  }

  const confirmTeam = () => {
    if (playerTeam) {
      localStorage.setItem('student_team', JSON.stringify(playerTeam))
      setPhase('confirmed')
    }
  }

  const randomizingSteps = [
    'Analyzing student skills...',
    'Calculating optimal combinations...',
    'Balancing team strengths...',
    'Assigning team themes...',
    'Finalizing formations...'
  ]

  if (phase === 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="text-6xl mb-6 animate-bounce">{playerTeam?.icon}</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to {playerTeam?.name}!
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Your team has been formed and you're ready for collaborative missions!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/student/dashboard"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/curriculum"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              View Curriculum
            </Link>
          </div>
        </div>
      </div>
    )
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
                href="/curriculum"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Curriculum</span>
              </Link>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Team Formation Protocol 👥
                  </h1>
                  <p className="text-sm text-gray-300">Join Your Development Squad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {phase === 'waiting' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Your Team?</h2>
              <p className="text-xl text-blue-200 mb-6">
                The advanced AI team formation system will create perfectly balanced development teams based on your skills, work style, and collaboration preferences.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Strength Balanced</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Skill Complementary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Optimized</span>
                </div>
              </div>
            </div>

            {/* Class Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>Class Statistics</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Students:</span>
                    <span className="text-white font-bold">{CLASS_STUDENTS.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Teams to Form:</span>
                    <span className="text-white font-bold">4 teams of 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Skill Level:</span>
                    <span className="text-white font-bold">7.1/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Balance Algorithm:</span>
                    <span className="text-green-400 font-bold">Snake Draft</span>
                  </div>
                </div>
              </div>

              {/* Your Profile */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span>Your Profile</span>
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl">🧑‍💻</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">You</h4>
                    <p className="text-gray-300">Overall Strength: 6.6/10</p>
                    <p className="text-gray-300">Role: Creative Coder</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSkills(!showSkills)}
                  className="w-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 py-2 px-4 rounded-lg transition-all mb-4"
                >
                  {showSkills ? 'Hide' : 'Show'} Skill Breakdown
                </button>

                {showSkills && (
                  <div className="space-y-2">
                    {Object.entries(CLASS_STUDENTS[0].skills).map(([skill, level]) => (
                      <div key={skill} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                              style={{width: `${level * 10}%`}}
                            ></div>
                          </div>
                          <span className="text-white font-bold text-sm">{level}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Formation Button */}
            <div className="text-center">
              <button
                onClick={startRandomizer}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Shuffle className="h-6 w-6" />
                <span>Form Balanced Teams</span>
                <Zap className="h-6 w-6 animate-pulse" />
              </button>
              <p className="text-gray-400 mt-4 text-sm">
                AI-powered team formation ensures optimal collaboration and balanced skill distribution
              </p>
            </div>
          </div>
        )}

        {phase === 'randomizing' && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-spin">⚙️</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Forming Your Teams...
              </h2>
              <div className="text-xl text-purple-200 mb-8">
                {randomizingSteps[randomizingStep]}
              </div>
              <div className="flex justify-center space-x-2">
                {randomizingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index <= randomizingStep ? 'bg-purple-400' : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'teams-formed' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">Teams Formed Successfully!</h2>
              <p className="text-xl text-purple-200 mb-8">
                Here are your perfectly balanced development teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formedTeams.map((team) => (
                <div
                  key={team.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all transform hover:scale-102 ${
                    team.members.some(m => m.id === 'demo-student')
                      ? 'border-yellow-400/50 ring-2 ring-yellow-400/30 bg-yellow-500/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl">{team.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                      <p className="text-gray-300">
                        Avg Strength: {team.averageStrength.toFixed(1)} | 
                        Balance: {team.skillBalance.toFixed(1)}/10
                      </p>
                    </div>
                    {team.members.some(m => m.id === 'demo-student') && (
                      <div className="text-yellow-400 font-bold">YOUR TEAM!</div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          member.id === 'demo-student'
                            ? 'bg-yellow-500/20 border border-yellow-400/30'
                            : 'bg-white/5'
                        }`}
                      >
                        <div className="text-2xl">{member.avatar}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{member.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>{member.preferredRole}</span>
                            <span>{member.workStyle}</span>
                            <span>Strength: {member.overallStrength}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={confirmTeam}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Trophy className="h-6 w-6" />
                <span>Confirm My Team</span>
              </button>
              <p className="text-gray-400 mt-4">
                Once confirmed, you'll work with this team for all collaborative missions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}