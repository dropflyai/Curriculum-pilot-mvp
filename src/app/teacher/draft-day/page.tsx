'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database, User, Team, DraftEvent } from '@/lib/supabase/types'
import { Users, Shuffle, Trophy, Star, Zap, Timer, Play, RotateCcw, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface DraftPick {
  studentId: string
  student: User
  teamId: string
  pickNumber: number
}

export default function DraftDayPage() {
  const [students, setStudents] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([])
  const [currentPick, setCurrentPick] = useState(1)
  const [draftActive, setDraftActive] = useState(false)
  const [draftComplete, setDraftComplete] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [draftDirection, setDraftDirection] = useState(1) // 1 for forward, -1 for reverse
  const [showWheel, setShowWheel] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const teamColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-purple-500'
  ]

  const teamNames = [
    'Code Crusaders',
    'Byte Brigade',
    'Logic Lords',
    'Debug Dynasty',
    'Syntax Squad',
    'Algorithm Aces'
  ]

  const teamEmojis = ['🚀', '⚡', '🔥', '💎', '🌟', '🏆']

  useEffect(() => {
    loadStudents()
    initializeTeams()
  }, [])

  async function loadStudents() {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('total_xp', { ascending: false })
      
      if (data) {
        // Shuffle for fairness but keep XP visible
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        setStudents(shuffled)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  function initializeTeams() {
    // Create 4 teams by default
    const newTeams: Team[] = teamNames.slice(0, 4).map((name, i) => ({
      id: `team-${i + 1}`,
      class_id: '11111111-1111-1111-1111-111111111111',
      name,
      avatar_emoji: teamEmojis[i],
      total_xp: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    setTeams(newTeams)
  }

  function startDraft() {
    setDraftActive(true)
    setCurrentPick(1)
    setCurrentTeamIndex(0)
    setDraftDirection(1)
    setDraftPicks([])
    setDraftComplete(false)
  }

  function spinWheel() {
    if (isSpinning || students.length === 0) return
    
    setIsSpinning(true)
    setShowWheel(true)
    
    // Simulate wheel spinning
    let spins = 0
    const maxSpins = 20
    const availableStudents = students.filter(
      s => !draftPicks.some(p => p.studentId === s.id)
    )
    
    const interval = setInterval(() => {
      if (spins >= maxSpins) {
        clearInterval(interval)
        const selected = availableStudents[Math.floor(Math.random() * availableStudents.length)]
        setSelectedStudent(selected)
        setIsSpinning(false)
        
        // Auto-pick after selection
        setTimeout(() => {
          if (selected) {
            pickStudent(selected)
          }
        }, 1000)
      } else {
        const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)]
        setSelectedStudent(randomStudent)
        spins++
      }
    }, 100)
  }

  function pickStudent(student: User) {
    if (!draftActive || draftComplete) return
    
    const pick: DraftPick = {
      studentId: student.id,
      student,
      teamId: teams[currentTeamIndex].id,
      pickNumber: currentPick
    }
    
    setDraftPicks([...draftPicks, pick])
    
    // Update team XP
    const updatedTeams = teams.map(team => {
      if (team.id === teams[currentTeamIndex].id) {
        return { ...team, total_xp: team.total_xp + student.total_xp }
      }
      return team
    })
    setTeams(updatedTeams)
    
    // Snake draft logic
    let nextTeamIndex = currentTeamIndex + draftDirection
    
    if (nextTeamIndex >= teams.length) {
      nextTeamIndex = teams.length - 1
      setDraftDirection(-1)
    } else if (nextTeamIndex < 0) {
      nextTeamIndex = 0
      setDraftDirection(1)
    }
    
    setCurrentTeamIndex(nextTeamIndex)
    setCurrentPick(currentPick + 1)
    setSelectedStudent(null)
    setShowWheel(false)
    
    // Check if draft is complete
    if (draftPicks.length + 1 >= students.length) {
      completeDraft()
    }
  }

  function completeDraft() {
    setDraftComplete(true)
    setDraftActive(false)
    
    // Celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  function resetDraft() {
    setDraftActive(false)
    setDraftComplete(false)
    setDraftPicks([])
    setCurrentPick(1)
    setCurrentTeamIndex(0)
    setDraftDirection(1)
    setSelectedStudent(null)
    initializeTeams()
  }

  function getTeamMembers(teamId: string) {
    return draftPicks.filter(p => p.teamId === teamId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center">
                <Trophy className="w-10 h-10 mr-3 text-yellow-400" />
                Draft Day
              </h1>
              <p className="text-purple-200 mt-1">Build your dream coding teams!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {!draftActive && !draftComplete && (
                <button
                  onClick={startDraft}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-8 py-3 font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
                >
                  <Play className="w-6 h-6" />
                  <span>Start Draft</span>
                </button>
              )}
              
              {draftComplete && (
                <button
                  onClick={resetDraft}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-8 py-3 font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
                >
                  <RotateCcw className="w-6 h-6" />
                  <span>New Draft</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Draft Status */}
      {draftActive && (
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-white">
                  <span className="text-sm text-purple-200">Current Pick</span>
                  <p className="text-2xl font-bold">#{currentPick}</p>
                </div>
                <div className="text-white">
                  <span className="text-sm text-purple-200">Picking Team</span>
                  <p className="text-2xl font-bold flex items-center">
                    <span className="mr-2">{teams[currentTeamIndex]?.avatar_emoji}</span>
                    {teams[currentTeamIndex]?.name}
                  </p>
                </div>
              </div>
              
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl px-8 py-3 font-bold text-lg hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 transition-all flex items-center space-x-2"
              >
                <Shuffle className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Spinning...' : 'Spin Wheel'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wheel Display */}
        {showWheel && selectedStudent && (
          <div className="mb-8 flex justify-center">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 ${
              isSpinning ? 'animate-pulse' : ''
            }`}>
              <h3 className="text-white text-xl font-bold text-center mb-4">
                {isSpinning ? 'Selecting...' : 'Selected!'}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">
                  {selectedStudent.avatar_url || '🎮'}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {selectedStudent.display_name || selectedStudent.full_name}
                  </p>
                  <p className="text-purple-200">Level {Math.floor(selectedStudent.total_xp / 100)}</p>
                  <p className="text-yellow-400 font-bold">{selectedStudent.total_xp} XP</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
                draftActive && currentTeamIndex === index
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{team.avatar_emoji}</span>
                  <h3 className="text-white font-bold">{team.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">{team.total_xp}</p>
                  <p className="text-purple-200 text-xs">Total XP</p>
                </div>
              </div>
              
              {/* Team Members */}
              <div className="space-y-2">
                {getTeamMembers(team.id).map((pick) => (
                  <div
                    key={pick.studentId}
                    className="bg-black/20 rounded-lg p-2 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-sm">
                        {pick.student.avatar_url || '🎮'}
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          {pick.student.display_name || pick.student.full_name}
                        </p>
                        <p className="text-purple-200 text-xs">{pick.student.total_xp} XP</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">#{pick.pickNumber}</span>
                  </div>
                ))}
                
                {/* Empty slots */}
                {[...Array(Math.max(0, 5 - getTeamMembers(team.id).length))].map((_, i) => (
                  <div
                    key={i}
                    className="bg-black/10 border border-white/10 rounded-lg p-2 h-12 flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-xs">Empty Slot</span>
                  </div>
                ))}
              </div>
              
              {/* Team Stats */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Members</span>
                  <span className="text-white font-medium">{getTeamMembers(team.id).length}/5</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-200">Avg Level</span>
                  <span className="text-white font-medium">
                    {getTeamMembers(team.id).length > 0
                      ? Math.floor(
                          getTeamMembers(team.id).reduce((sum, p) => sum + p.student.total_xp, 0) /
                          getTeamMembers(team.id).length / 100
                        )
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Students */}
        {draftActive && !draftComplete && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4">Available Students</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {students
                .filter(s => !draftPicks.some(p => p.studentId === s.id))
                .map((student) => (
                  <button
                    key={student.id}
                    onClick={() => pickStudent(student)}
                    disabled={!draftActive}
                    className="bg-black/20 hover:bg-black/30 rounded-lg p-3 text-center transition-all disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-xl mx-auto mb-2">
                      {student.avatar_url || '🎮'}
                    </div>
                    <p className="text-white text-sm truncate">
                      {student.display_name || student.full_name}
                    </p>
                    <p className="text-purple-200 text-xs">{student.total_xp} XP</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Draft Complete */}
        {draftComplete && (
          <div className="mt-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-8 border border-green-400/50 text-center">
            <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Draft Complete!</h2>
            <p className="text-green-200 text-lg">Teams have been successfully formed</p>
            <p className="text-purple-200 mt-4">Ready to start your team projects!</p>
          </div>
        )}
      </div>
    </div>
  )
}