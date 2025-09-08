'use client'

import React, { useState, useEffect } from 'react'
import { Users, User, UserCheck, Shuffle, TrendingUp, Award, Target, Brain, Code, Zap, Shield, Star, ChevronRight, ChevronDown } from 'lucide-react'

// Types for our collaboration system
interface Student {
  id: string
  name: string
  skills: {
    coding: number        // 1-10 scale
    problemSolving: number // 1-10 scale
    communication: number  // 1-10 scale
    leadership: number     // 1-10 scale
    collaboration: number  // 1-10 scale
  }
  overallStrength: number // calculated average
  previousTeammates: string[] // avoid repeating pairs
  personality: 'leader' | 'supporter' | 'creative' | 'analytical'
  preferredRole: 'architect' | 'implementer' | 'tester' | 'presenter'
}

interface Team {
  id: string
  name: string
  members: Student[]
  averageStrength: number
  balance: {
    skills: number      // how well-balanced skills are
    personalities: number // personality diversity
    roles: number       // role coverage
  }
  project: string
}

interface CollaborationLevel {
  level: number
  name: string
  description: string
  teamSize: number
  duration: string
  focusSkills: string[]
  projectTypes: string[]
}

// Progressive collaboration levels
const COLLABORATION_LEVELS: CollaborationLevel[] = [
  {
    level: 1,
    name: "Solo Foundation",
    description: "Master individual skills before collaborating",
    teamSize: 1,
    duration: "Weeks 1-4",
    focusSkills: ["Basic coding", "Problem solving", "Self-assessment"],
    projectTypes: ["Personal AI pet", "Simple chatbot", "Basic automation script"]
  },
  {
    level: 2,
    name: "Pair Programming",
    description: "Work with one partner to learn collaboration basics",
    teamSize: 2,
    duration: "Weeks 5-8",
    focusSkills: ["Code sharing", "Communication", "Debugging together"],
    projectTypes: ["AI conversation system", "Data analysis tool", "Simple game AI"]
  },
  {
    level: 3,
    name: "Small Squad",
    description: "3-person teams for more complex projects",
    teamSize: 3,
    duration: "Weeks 9-12",
    focusSkills: ["Role specialization", "Project management", "Conflict resolution"],
    projectTypes: ["Multi-agent system", "Business workflow", "AI-powered app"]
  },
  {
    level: 4,
    name: "Mission Team",
    description: "4-person teams for advanced collaborative projects",
    teamSize: 4,
    duration: "Weeks 13-16",
    focusSkills: ["Leadership rotation", "Integration", "Quality assurance"],
    projectTypes: ["Complete AI solution", "Client project simulation", "Innovation challenge"]
  },
  {
    level: 5,
    name: "Elite Squadron",
    description: "5-6 person teams for capstone projects",
    teamSize: 6,
    duration: "Weeks 17-18",
    focusSkills: ["Cross-team communication", "Documentation", "Presentation"],
    projectTypes: ["Industry partnership project", "Open source contribution", "Competition entry"]
  }
]

export default function TeamCollaborationSystem() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [students, setStudents] = useState<Student[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false)
  const [showTeamDetails, setShowTeamDetails] = useState<string | null>(null)

  // Mock student data - in real app this comes from performance tracking
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Alex Chen',
        skills: { coding: 8, problemSolving: 7, communication: 6, leadership: 8, collaboration: 7 },
        overallStrength: 7.2,
        previousTeammates: [],
        personality: 'leader',
        preferredRole: 'architect'
      },
      {
        id: '2', 
        name: 'Sam Rivera',
        skills: { coding: 6, problemSolving: 9, communication: 8, leadership: 5, collaboration: 8 },
        overallStrength: 7.2,
        previousTeammates: [],
        personality: 'analytical',
        preferredRole: 'implementer'
      },
      {
        id: '3',
        name: 'Jordan Kim',
        skills: { coding: 9, problemSolving: 6, communication: 7, leadership: 6, collaboration: 6 },
        overallStrength: 6.8,
        previousTeammates: [],
        personality: 'creative',
        preferredRole: 'implementer'
      },
      {
        id: '4',
        name: 'Taylor Brown',
        skills: { coding: 5, problemSolving: 7, communication: 9, leadership: 7, collaboration: 9 },
        overallStrength: 7.4,
        previousTeammates: [],
        personality: 'supporter',
        preferredRole: 'presenter'
      },
      {
        id: '5',
        name: 'Casey Davis',
        skills: { coding: 7, problemSolving: 8, communication: 6, leadership: 9, collaboration: 7 },
        overallStrength: 7.4,
        previousTeammates: [],
        personality: 'leader',
        preferredRole: 'architect'
      },
      {
        id: '6',
        name: 'Morgan Lee',
        skills: { coding: 8, problemSolving: 5, communication: 8, leadership: 6, collaboration: 8 },
        overallStrength: 7.0,
        previousTeammates: [],
        personality: 'supporter',
        preferredRole: 'tester'
      }
    ]
    setStudents(mockStudents)
  }, [])

  // Smart team balancing algorithm
  const generateBalancedTeams = () => {
    setIsGeneratingTeams(true)
    
    const currentLevelInfo = COLLABORATION_LEVELS[currentLevel - 1]
    const teamSize = currentLevelInfo.teamSize
    
    if (teamSize === 1) {
      // Solo work - each student is their own "team"
      const soloTeams = students.map((student, index) => ({
        id: `solo-${student.id}`,
        name: `${student.name}'s Solo Mission`,
        members: [student],
        averageStrength: student.overallStrength,
        balance: { skills: 10, personalities: 10, roles: 10 }, // Perfect for solo
        project: currentLevelInfo.projectTypes[index % currentLevelInfo.projectTypes.length]
      }))
      setTeams(soloTeams)
      setIsGeneratingTeams(false)
      return
    }

    // Advanced team balancing algorithm
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5)
    const newTeams: Team[] = []
    const numTeams = Math.ceil(students.length / teamSize)
    
    // Initialize teams
    for (let i = 0; i < numTeams; i++) {
      newTeams.push({
        id: `team-${i + 1}`,
        name: `Squad ${String.fromCharCode(65 + i)}`, // Team A, B, C, etc.
        members: [],
        averageStrength: 0,
        balance: { skills: 0, personalities: 0, roles: 0 },
        project: currentLevelInfo.projectTypes[i % currentLevelInfo.projectTypes.length]
      })
    }

    // Distribute students for balanced teams
    shuffledStudents.forEach((student, index) => {
      const teamIndex = index % numTeams
      newTeams[teamIndex].members.push(student)
    })

    // Calculate team statistics
    newTeams.forEach(team => {
      if (team.members.length > 0) {
        team.averageStrength = team.members.reduce((sum, member) => sum + member.overallStrength, 0) / team.members.length
        
        // Calculate balance scores (simplified)
        team.balance.skills = Math.min(10, team.members.length * 2) // More members = better skill coverage
        team.balance.personalities = new Set(team.members.map(m => m.personality)).size * 2.5 // Personality diversity
        team.balance.roles = new Set(team.members.map(m => m.preferredRole)).size * 2.5 // Role diversity
      }
    })

    // Sort teams by balance for fairness
    const balancedTeams = newTeams.sort((a, b) => 
      Math.abs(7 - a.averageStrength) - Math.abs(7 - b.averageStrength)
    )

    setTimeout(() => {
      setTeams(balancedTeams)
      setIsGeneratingTeams(false)
    }, 1500) // Simulate algorithm thinking time
  }

  const getSkillColor = (skill: number) => {
    if (skill >= 8) return 'text-green-400'
    if (skill >= 6) return 'text-yellow-400' 
    return 'text-red-400'
  }

  const getBalanceColor = (balance: number) => {
    if (balance >= 8) return 'text-green-400'
    if (balance >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            🤝 Agent Academy Team Collaboration System
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Progressive team building that starts with solo mastery and evolves to elite squad collaboration
          </p>
        </div>

        {/* Collaboration Progression */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📈 Collaboration Progression Path
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            {COLLABORATION_LEVELS.map((level, index) => (
              <div
                key={level.level}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                  currentLevel === level.level
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700/50 hover:border-blue-500/50'
                }`}
                onClick={() => setCurrentLevel(level.level)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {level.teamSize === 1 ? '👤' : level.teamSize === 2 ? '👥' : `${level.teamSize}👥`}
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{level.name}</h3>
                  <div className="text-xs text-gray-300 mb-2">{level.duration}</div>
                  <div className="text-xs text-blue-300">
                    {level.teamSize === 1 ? 'Solo' : `${level.teamSize} members`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Level Details */}
        <div className="mb-12">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {COLLABORATION_LEVELS[currentLevel - 1].name}
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                {COLLABORATION_LEVELS[currentLevel - 1].description}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div>
                  <h3 className="font-bold text-blue-300 mb-3">🎯 Focus Skills</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {COLLABORATION_LEVELS[currentLevel - 1].focusSkills.map(skill => (
                      <li key={skill}>• {skill}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-green-300 mb-3">🚀 Projects</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {COLLABORATION_LEVELS[currentLevel - 1].projectTypes.map(project => (
                      <li key={project}>• {project}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-purple-300 mb-3">⏱️ Timeline</h3>
                  <div className="text-sm text-gray-300">
                    <div>Duration: {COLLABORATION_LEVELS[currentLevel - 1].duration}</div>
                    <div>Team Size: {COLLABORATION_LEVELS[currentLevel - 1].teamSize} member{COLLABORATION_LEVELS[currentLevel - 1].teamSize > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Teams Button */}
            <div className="text-center">
              <button
                onClick={generateBalancedTeams}
                disabled={isGeneratingTeams}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingTeams ? (
                  <>
                    <Shuffle className="w-5 h-5 mr-2 animate-spin inline" />
                    Generating Balanced Teams...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-5 h-5 mr-2 inline" />
                    Generate {COLLABORATION_LEVELS[currentLevel - 1].teamSize === 1 ? 'Solo Assignments' : 'Balanced Teams'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Teams */}
        {teams.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {COLLABORATION_LEVELS[currentLevel - 1].teamSize === 1 ? '👤 Solo Assignments' : '🎯 Balanced Teams'}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div
                  key={team.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-400">{team.project}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Avg Strength</div>
                      <div className={`text-lg font-bold ${getSkillColor(team.averageStrength)}`}>
                        {team.averageStrength.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2 mb-4">
                    {team.members.map(member => (
                      <div key={member.id} className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">{member.name}</div>
                            <div className="text-xs text-gray-400">
                              {member.personality} • {member.preferredRole}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${getSkillColor(member.overallStrength)}`}>
                              {member.overallStrength.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Skill bars */}
                        <div className="grid grid-cols-5 gap-1 mt-2">
                          {Object.entries(member.skills).map(([skill, value]) => (
                            <div key={skill} className="text-center">
                              <div className={`text-xs ${getSkillColor(value)}`}>
                                {value}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {skill.slice(0, 3)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Team Balance (for multi-member teams) */}
                  {team.members.length > 1 && (
                    <div className="border-t border-gray-600/50 pt-3">
                      <div className="text-sm text-gray-400 mb-2">Team Balance</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className={`font-semibold ${getBalanceColor(team.balance.skills)}`}>
                            {team.balance.skills.toFixed(1)}
                          </div>
                          <div className="text-gray-500">Skills</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getBalanceColor(team.balance.personalities)}`}>
                            {team.balance.personalities.toFixed(1)}
                          </div>
                          <div className="text-gray-500">Personality</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getBalanceColor(team.balance.roles)}`}>
                            {team.balance.roles.toFixed(1)}
                          </div>
                          <div className="text-gray-500">Roles</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Tips */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            💡 Collaboration Success Tips
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <User className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Solo First</h3>
              <p className="text-sm text-gray-300">
                Master individual skills before collaborative work
              </p>
            </div>
            
            <div className="text-center">
              <UserCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Pair Learning</h3>
              <p className="text-sm text-gray-300">
                Practice communication and code sharing
              </p>
            </div>
            
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Small Teams</h3>
              <p className="text-sm text-gray-300">
                Develop leadership and project management
              </p>
            </div>
            
            <div className="text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Elite Squads</h3>
              <p className="text-sm text-gray-300">
                Advanced collaboration on industry projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}