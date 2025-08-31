'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  teamFormationEngine, 
  DraftEvent, 
  StudentProfile, 
  DraftPick,
  generateMockStudentProfiles,
  createSampleProjectTemplate 
} from '@/lib/team-formation-engine'
import { 
  Users, 
  Clock, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Timer, 
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  UserCheck,
  Award,
  TrendingUp
} from 'lucide-react'

interface DraftDayProps {
  draftEventId?: string
  isTeacher?: boolean
  className?: string
}

export default function DraftDay({ draftEventId, isTeacher = false, className = '' }: DraftDayProps) {
  const { user } = useAuth()
  const [draftEvent, setDraftEvent] = useState<DraftEvent | null>(null)
  const [availableStudents, setAvailableStudents] = useState<StudentProfile[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectionReason, setSelectionReason] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [draftHistory, setDraftHistory] = useState<DraftPick[]>([])

  // Mock data for demo (in real app, this would come from props or API)
  const [mockDraft] = useState(() => {
    const students = generateMockStudentProfiles(20)
    const project = createSampleProjectTemplate()
    
    return {
      id: 'draft_2024_winter',
      name: 'Winter 2024 Web Development Draft',
      description: 'Form teams for the semester-long web application project',
      project_ids: [project.id],
      max_teams: 5,
      team_size_min: 3,
      team_size_max: 5,
      draft_type: 'snake' as const,
      status: 'active' as const,
      scheduled_start: new Date().toISOString(),
      actual_start: new Date().toISOString(),
      draft_rounds: [
        {
          round_number: 1,
          picks: [
            {
              pick_number: 1,
              team_id: 'team_captain_1',
              captain_id: 'student_1',
              selected_student_id: 'student_3',
              selection_reason: 'Strong Python skills and collaboration experience',
              pick_timestamp: new Date(Date.now() - 300000).toISOString(),
              time_used_seconds: 45
            },
            {
              pick_number: 2,
              team_id: 'team_captain_2',
              captain_id: 'student_2',
              selected_student_id: 'student_5',
              selection_reason: 'Excellent problem-solving abilities',
              pick_timestamp: new Date(Date.now() - 240000).toISOString(),
              time_used_seconds: 72
            }
          ],
          time_limit_minutes: 5,
          status: 'active' as const
        }
      ],
      participant_pool: students.map(s => s.user_id),
      team_captains: ['student_1', 'student_2', 'student_7', 'student_12', 'student_15']
    }
  })

  useEffect(() => {
    // Initialize with mock data
    setDraftEvent(mockDraft)
    setAvailableStudents(generateMockStudentProfiles(20))
    
    // Simulate being one of the captains
    if (user?.id && mockDraft.team_captains.includes(user.id)) {
      setIsMyTurn(true)
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // Time's up - auto-pick or skip
          return 300 // Reset for next pick
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user?.id, mockDraft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
  }

  const handleDraftPick = async () => {
    if (!selectedStudent || !draftEvent) return

    try {
      // In real app, this would make API call
      const result = await teamFormationEngine.processDraftPick(
        draftEvent.id,
        user?.id || 'student_1',
        selectedStudent,
        selectionReason
      )

      if (result.success) {
        // Update draft state
        const newPick: DraftPick = {
          pick_number: draftHistory.length + 1,
          team_id: `team_${user?.id}`,
          captain_id: user?.id || 'student_1',
          selected_student_id: selectedStudent,
          selection_reason: selectionReason,
          pick_timestamp: new Date().toISOString(),
          time_used_seconds: 300 - timeRemaining
        }

        setDraftHistory([...draftHistory, newPick])
        setAvailableStudents(prev => prev.filter(s => s.user_id !== selectedStudent))
        setSelectedStudent(null)
        setSelectionReason('')
        setIsMyTurn(false)
        setTimeRemaining(300)
      }
    } catch (error) {
      console.error('Error making draft pick:', error)
    }
  }

  const getCurrentRound = () => {
    return draftEvent?.draft_rounds.find(r => r.status === 'active')
  }

  const getMyTeam = () => {
    if (!user?.id) return null
    return draftHistory.filter(pick => pick.captain_id === user.id || pick.selected_student_id === user.id)
  }

  const getStudentDisplayInfo = (student: StudentProfile) => {
    const topSkill = student.programming_skills.length > 0 ? student.programming_skills[0] : null
    const strengthsDisplay = student.strengths.slice(0, 2).join(', ')
    
    return {
      name: student.full_name,
      level: `Level ${student.current_level}`,
      xp: `${student.total_xp.toLocaleString()} XP`,
      topSkill: topSkill ? `${topSkill.skill_name} (${topSkill.proficiency})` : 'General coding',
      strengths: strengthsDisplay,
      collaboration: student.collaboration_rating,
      badges: student.badge_count
    }
  }

  if (!draftEvent) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <p className="text-gray-400">No active draft event found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-gray-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Trophy className="w-7 h-7 text-yellow-400 mr-3" />
              {draftEvent.name}
            </h1>
            <p className="text-gray-300 mt-1">{draftEvent.description}</p>
          </div>
          
          <div className="text-right">
            <div className={`px-4 py-2 rounded-lg border ${
              draftEvent.status === 'active' 
                ? 'bg-green-500/20 border-green-400/30 text-green-400' 
                : 'bg-gray-500/20 border-gray-400/30 text-gray-400'
            }`}>
              {draftEvent.status.toUpperCase()}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Round {getCurrentRound()?.round_number || 1} • {draftEvent.max_teams} Teams
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Available Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer and Current Pick */}
          {isMyTurn && (
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Timer className="w-6 h-6 text-cyan-400 mr-2" />
                  <span className="text-white font-semibold">Your Turn to Pick!</span>
                </div>
                <div className={`text-2xl font-mono font-bold ${
                  timeRemaining <= 60 ? 'text-red-400' : 
                  timeRemaining <= 120 ? 'text-yellow-400' : 'text-cyan-400'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              
              {selectedStudent && (
                <div className="space-y-3">
                  <textarea
                    placeholder="Why are you picking this student? (Optional)"
                    value={selectionReason}
                    onChange={(e) => setSelectionReason(e.target.value)}
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                    rows={2}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDraftPick}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Confirm Pick
                    </button>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="flex items-center px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Available Students Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Available Students ({availableStudents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableStudents.map(student => {
                const info = getStudentDisplayInfo(student)
                const isSelected = selectedStudent === student.user_id
                
                return (
                  <div
                    key={student.user_id}
                    onClick={() => isMyTurn ? handleStudentSelect(student.user_id) : null}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400/50 ring-2 ring-cyan-400/30'
                        : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/50'
                    } ${isMyTurn ? 'cursor-pointer' : 'cursor-default opacity-75'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{info.name}</h3>
                        <p className="text-sm text-gray-400">{info.level} • {info.xp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs text-yellow-400">
                          <Star className="w-3 h-3 mr-1" />
                          {info.collaboration}
                        </div>
                        <div className="flex items-center text-xs text-purple-400">
                          <Award className="w-3 h-3 mr-1" />
                          {info.badges}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-400">Top Skill:</span>
                        <span className="text-cyan-300 ml-2">{info.topSkill}</span>
                      </div>
                      {info.strengths && (
                        <div className="text-sm">
                          <span className="text-gray-400">Strengths:</span>
                          <span className="text-green-300 ml-2">{info.strengths}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Display */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {student.programming_skills.slice(0, 3).map(skill => (
                        <span
                          key={skill.skill_name}
                          className={`px-2 py-1 rounded text-xs ${
                            skill.proficiency === 'expert' ? 'bg-purple-500/20 text-purple-300' :
                            skill.proficiency === 'advanced' ? 'bg-blue-500/20 text-blue-300' :
                            skill.proficiency === 'intermediate' ? 'bg-green-500/20 text-green-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 p-2 bg-cyan-500/10 rounded border border-cyan-400/20">
                        <div className="text-sm text-cyan-300 font-medium">Selected for Draft</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Draft Status */}
        <div className="space-y-6">
          {/* My Team */}
          {getMyTeam() && getMyTeam()!.length > 0 && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-400/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Crown className="w-5 h-5 text-yellow-400 mr-2" />
                My Team ({getMyTeam()!.length + 1})
              </h3>
              <div className="space-y-2">
                {/* Captain (me) */}
                <div className="flex items-center justify-between p-2 bg-green-500/20 rounded">
                  <span className="text-green-300 font-medium">{user?.full_name || 'You'}</span>
                  <span className="text-xs text-green-400 px-2 py-1 bg-green-500/20 rounded">CAPTAIN</span>
                </div>
                
                {/* Team members */}
                {getMyTeam()!.map((pick, index) => {
                  const student = availableStudents.find(s => s.user_id === pick.selected_student_id)
                  return (
                    <div key={pick.selected_student_id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                      <span className="text-white">{student?.full_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-400">Pick #{pick.pick_number}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Draft History */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
              Recent Picks
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {draftHistory.slice(-5).reverse().map((pick, index) => {
                const student = availableStudents.find(s => s.user_id === pick.selected_student_id)
                const captain = availableStudents.find(s => s.user_id === pick.captain_id)
                return (
                  <div key={`${pick.team_id}-${pick.pick_number}`} className="p-3 bg-gray-700/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{student?.full_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-400">#{pick.pick_number}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Picked by {captain?.full_name || 'Unknown'}
                    </div>
                    {pick.selection_reason && (
                      <div className="text-xs text-gray-500 mt-1 italic">
                        "{pick.selection_reason}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Draft Progress */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-3">Draft Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Students Drafted</span>
                <span className="text-white font-semibold">{draftHistory.length}/{availableStudents.length + draftHistory.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(draftHistory.length / (availableStudents.length + draftHistory.length)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Round</span>
                <span className="text-white font-semibold">{getCurrentRound()?.round_number || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Teams Formed</span>
                <span className="text-white font-semibold">{draftEvent.max_teams}</span>
              </div>
            </div>
          </div>

          {/* Controls (Teacher Only) */}
          {isTeacher && (
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-400/30">
              <h3 className="text-lg font-semibold text-white mb-3">Draft Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-all">
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </button>
                <button className="flex items-center justify-center px-3 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/30 transition-all">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </button>
                <button className="flex items-center justify-center px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all">
                  <SkipForward className="w-4 h-4 mr-1" />
                  Skip
                </button>
                <button className="flex items-center justify-center px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  End
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}