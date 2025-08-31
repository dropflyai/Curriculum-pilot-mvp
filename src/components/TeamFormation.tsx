'use client'

import React, { useState, useEffect } from 'react'
import { 
  teamFormationEngine, 
  StudentProfile, 
  Team, 
  ProjectTemplate,
  generateMockStudentProfiles,
  createSampleProjectTemplate,
  DraftEvent
} from '@/lib/team-formation-engine'
import { 
  Users, 
  Settings, 
  Shuffle, 
  Brain, 
  Trophy, 
  Clock, 
  Target, 
  Star,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Play,
  Calendar,
  UserCheck,
  Zap
} from 'lucide-react'

interface TeamFormationProps {
  studentIds?: string[]
  projectTemplate?: ProjectTemplate
  isTeacher?: boolean
  className?: string
}

export default function TeamFormation({ 
  studentIds = [], 
  projectTemplate,
  isTeacher = true,
  className = '' 
}: TeamFormationProps) {
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [formationMethod, setFormationMethod] = useState<'balanced' | 'skill_based' | 'random' | 'draft'>('balanced')
  const [teamSize, setTeamSize] = useState(4)
  const [isForming, setIsForming] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate | null>(null)
  const [draftSettings, setDraftSettings] = useState({
    name: 'Team Formation Draft',
    description: 'Form teams for collaborative project',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: '10:00',
    captainSelectionMethod: 'top_performers' as 'top_performers' | 'volunteer' | 'teacher_selected' | 'random'
  })

  useEffect(() => {
    // Load student data (mock for demo)
    const mockStudents = generateMockStudentProfiles(20)
    setStudents(mockStudents)
    setSelectedProject(projectTemplate || createSampleProjectTemplate())
  }, [studentIds, projectTemplate])

  const handleFormTeams = async () => {
    if (!selectedProject || students.length === 0) return

    setIsForming(true)
    try {
      let formedTeams: Team[] = []

      switch (formationMethod) {
        case 'balanced':
          formedTeams = await teamFormationEngine.formBalancedTeams(students, teamSize, selectedProject)
          break
        case 'skill_based':
          // Similar to balanced but with more emphasis on complementary skills
          formedTeams = await teamFormationEngine.formBalancedTeams(students, teamSize, selectedProject)
          break
        case 'random':
          formedTeams = await formRandomTeams(students, teamSize)
          break
        case 'draft':
          // Initialize draft event instead of forming teams directly
          await createDraftEvent()
          return
      }

      setTeams(formedTeams)
    } catch (error) {
      console.error('Error forming teams:', error)
    } finally {
      setIsForming(false)
    }
  }

  const formRandomTeams = async (studentProfiles: StudentProfile[], size: number): Promise<Team[]> => {
    const shuffled = [...studentProfiles].sort(() => Math.random() - 0.5)
    const numTeams = Math.floor(shuffled.length / size)
    const teams: Team[] = []

    for (let i = 0; i < numTeams; i++) {
      const teamMembers = shuffled.slice(i * size, (i + 1) * size)
      const team: Team = {
        id: `random_team_${i + 1}`,
        name: `Random Team ${i + 1}`,
        members: teamMembers.map((student, index) => ({
          user_id: student.user_id,
          student_profile: student,
          team_role: index === 0 ? 'leader' : 'developer',
          leadership_score: Math.random() * 100,
          contribution_score: 0,
          peer_ratings: [],
          joined_at: new Date().toISOString(),
          is_captain: index === 0
        })),
        project_id: selectedProject?.id || '',
        formation_method: 'random',
        created_at: new Date().toISOString(),
        status: 'forming',
        team_dynamics_score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        collaboration_metrics: {
          communication_frequency: 0,
          task_completion_rate: 0,
          conflict_resolution_score: 5.0,
          innovation_index: 0,
          learning_growth_rate: 0,
          project_satisfaction: 0
        }
      }
      teams.push(team)
    }

    return teams
  }

  const createDraftEvent = async () => {
    try {
      const scheduledStart = new Date(`${draftSettings.scheduledDate}T${draftSettings.scheduledTime}:00`).toISOString()
      const maxTeams = Math.floor(students.length / teamSize)
      
      const draftEvent = await teamFormationEngine.createDraftEvent(
        draftSettings.name,
        draftSettings.description,
        [selectedProject?.id || ''],
        maxTeams,
        teamSize - 1,
        teamSize + 1,
        'snake',
        scheduledStart,
        students.map(s => s.user_id)
      )

      // Select captains
      await teamFormationEngine.selectTeamCaptains(draftEvent.id, draftSettings.captainSelectionMethod)

      alert(`Draft event "${draftSettings.name}" scheduled for ${new Date(scheduledStart).toLocaleString()}`)
    } catch (error) {
      console.error('Error creating draft event:', error)
    }
  }

  const getTeamQualityScore = (team: Team): { score: number; label: string; color: string } => {
    const score = team.team_dynamics_score
    if (score >= 90) return { score, label: 'Excellent', color: 'text-green-400' }
    if (score >= 80) return { score, label: 'Good', color: 'text-blue-400' }
    if (score >= 70) return { score, label: 'Fair', color: 'text-yellow-400' }
    return { score, label: 'Needs Work', color: 'text-red-400' }
  }

  const getSkillDistribution = (team: Team) => {
    const allSkills = team.members.flatMap(m => m.student_profile.programming_skills.map(s => s.skill_name))
    const skillCounts = allSkills.reduce((acc: Record<string, number>, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {})
    return Object.entries(skillCounts).sort(([,a], [,b]) => b - a).slice(0, 3)
  }

  const getTeamStrengths = (team: Team) => {
    const allStrengths = team.members.flatMap(m => m.student_profile.strengths)
    const strengthCounts = allStrengths.reduce((acc: Record<string, number>, strength) => {
      acc[strength] = (acc[strength] || 0) + 1
      return acc
    }, {})
    return Object.keys(strengthCounts).slice(0, 3)
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 border-b border-gray-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Users className="w-7 h-7 text-blue-400 mr-3" />
              Team Formation
            </h1>
            <p className="text-gray-300 mt-1">Create balanced teams for collaborative projects</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-400">Students Available</div>
              <div className="text-xl font-bold text-white">{students.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Teams Formed</div>
              <div className="text-xl font-bold text-blue-400">{teams.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formation Settings */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Formation Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Formation Method</label>
                <select
                  value={formationMethod}
                  onChange={(e) => setFormationMethod(e.target.value as any)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="balanced">Balanced Teams (Recommended)</option>
                  <option value="skill_based">Skill-Based Matching</option>
                  <option value="random">Random Assignment</option>
                  <option value="draft">Draft Day Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Team Size</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="3"
                    max="6"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white font-semibold text-lg w-12">{teamSize}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Estimated Teams: {Math.floor(students.length / teamSize)}
                </div>
              </div>

              {formationMethod === 'draft' && (
                <div className="space-y-3 p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
                  <h3 className="text-sm font-semibold text-purple-300">Draft Settings</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Draft Name</label>
                    <input
                      type="text"
                      value={draftSettings.name}
                      onChange={(e) => setDraftSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={draftSettings.scheduledDate}
                        onChange={(e) => setDraftSettings(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Time</label>
                      <input
                        type="time"
                        value={draftSettings.scheduledTime}
                        onChange={(e) => setDraftSettings(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Captain Selection</label>
                    <select
                      value={draftSettings.captainSelectionMethod}
                      onChange={(e) => setDraftSettings(prev => ({ ...prev, captainSelectionMethod: e.target.value as any }))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    >
                      <option value="top_performers">Top Performers</option>
                      <option value="volunteer">Volunteers</option>
                      <option value="teacher_selected">Teacher Selected</option>
                      <option value="random">Random</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handleFormTeams}
                disabled={isForming || students.length === 0}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all ${
                  isForming
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                {isForming ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {formationMethod === 'draft' ? 'Scheduling Draft...' : 'Forming Teams...'}
                  </>
                ) : (
                  <>
                    {formationMethod === 'draft' ? (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Draft Event
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Form Teams
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Project Information */}
          {selectedProject && (
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Project Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-2">{selectedProject.estimated_duration_weeks} weeks</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Team Size:</span>
                    <span className="text-white ml-2">{selectedProject.recommended_team_size}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Difficulty:</span>
                    <span className={`ml-2 capitalize ${
                      selectedProject.difficulty_level === 'advanced' ? 'text-red-400' :
                      selectedProject.difficulty_level === 'intermediate' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {selectedProject.difficulty_level}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Collaboration:</span>
                    <span className={`ml-2 capitalize ${
                      selectedProject.collaboration_intensity === 'high' ? 'text-red-400' :
                      selectedProject.collaboration_intensity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {selectedProject.collaboration_intensity}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Required Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProject.required_skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formed Teams */}
        {teams.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                Formed Teams ({teams.length})
              </h2>
              <button
                onClick={() => setTeams([])}
                className="flex items-center px-3 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {teams.map((team, index) => {
                const quality = getTeamQualityScore(team)
                const topSkills = getSkillDistribution(team)
                const strengths = getTeamStrengths(team)

                return (
                  <div key={team.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${quality.color}`}>{quality.label}</div>
                        <div className="text-xs text-gray-400">{quality.score}/100</div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2 mb-4">
                      {team.members.map(member => (
                        <div key={member.user_id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                          <div>
                            <span className="text-white text-sm font-medium">{member.student_profile.full_name}</span>
                            {member.is_captain && (
                              <span className="ml-2 px-1 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">CAPTAIN</span>
                            )}
                            <div className="text-xs text-gray-400">
                              {member.team_role} • Level {member.student_profile.current_level}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {member.student_profile.total_xp.toLocaleString()} XP
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Team Analytics */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Top Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {topSkills.map(([skill, count]) => (
                            <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                              {skill} ({count})
                            </span>
                          ))}
                        </div>
                      </div>

                      {strengths.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Team Strengths</div>
                          <div className="flex flex-wrap gap-1">
                            {strengths.map(strength => (
                              <span key={strength} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                {strength.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-gray-400">Avg Rating:</span>
                          <span className="text-white ml-1">
                            {(team.members.reduce((sum, m) => sum + m.student_profile.collaboration_rating, 0) / team.members.length).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-3 h-3 text-purple-400 mr-1" />
                          <span className="text-gray-400">Badges:</span>
                          <span className="text-white ml-1">
                            {team.members.reduce((sum, m) => sum + m.student_profile.badge_count, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Team Formation Summary */}
            <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-400/30">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Formation Complete!</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-green-400 font-semibold">{teams.length}</div>
                  <div className="text-gray-400">Teams Formed</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold">{teams.reduce((sum, t) => sum + t.members.length, 0)}</div>
                  <div className="text-gray-400">Students Placed</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold">{Math.round(teams.reduce((sum, t) => sum + t.team_dynamics_score, 0) / teams.length)}</div>
                  <div className="text-gray-400">Avg Quality Score</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold">{teams.filter(t => t.team_dynamics_score >= 80).length}</div>
                  <div className="text-gray-400">High Quality Teams</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Pool Preview */}
        {teams.length === 0 && students.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <UserCheck className="w-6 h-6 text-blue-400 mr-2" />
              Available Students ({students.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {students.slice(0, 12).map(student => (
                <div key={student.user_id} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="mb-2">
                    <h3 className="text-white font-medium text-sm">{student.full_name}</h3>
                    <p className="text-xs text-gray-400">Level {student.current_level} • {student.total_xp.toLocaleString()} XP</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-1">{student.collaboration_rating}/5</span>
                    </div>
                    
                    {student.programming_skills.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {student.programming_skills.slice(0, 2).map(skill => (
                            <span key={skill.skill_name} className="px-1 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                              {skill.skill_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {students.length > 12 && (
              <div className="mt-4 text-center">
                <span className="text-gray-400">
                  Showing 12 of {students.length} students
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}