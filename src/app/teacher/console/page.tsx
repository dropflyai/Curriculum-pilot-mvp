'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database, User, Class, TutorPolicy, TutorQuery, XPEvent, Assignment } from '@/lib/supabase/types'
import { 
  Users, Settings, Brain, Trophy, FileText, AlertTriangle, 
  BarChart3, Zap, Shield, Play, Pause, Clock, ChevronRight,
  Award, TrendingUp, Activity, Eye, Edit, Plus
} from 'lucide-react'
import Navigation from '@/components/Navigation'

type Tab = 'overview' | 'students' | 'assignments' | 'tutor' | 'xp' | 'analytics'

export default function TeacherConsole() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [currentClass, setCurrentClass] = useState<Class | null>(null)
  const [students, setStudents] = useState<User[]>([])
  const [tutorPolicy, setTutorPolicy] = useState<TutorPolicy | null>(null)
  const [recentQueries, setRecentQueries] = useState<TutorQuery[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
  }, [currentWeek])

  async function loadDashboardData() {
    try {
      // Load default class
      const { data: classData } = await supabase
        .from('classes')
        .select('*')
        .single()
      
      if (classData) setCurrentClass(classData)

      // Load students
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('total_xp', { ascending: false })
      
      if (studentsData) setStudents(studentsData)

      // Load tutor policy for current week
      const { data: policyData } = await supabase
        .from('tutor_policies')
        .select('*')
        .eq('week_no', currentWeek)
        .single()
      
      if (policyData) setTutorPolicy(policyData)

      // Load recent tutor queries
      const { data: queriesData } = await supabase
        .from('tutor_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (queriesData) setRecentQueries(queriesData)

      // Load assignments
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('*')
        .order('due_at', { ascending: true })
      
      if (assignmentsData) setAssignments(assignmentsData)

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateTutorMode(mode: 'LEARN' | 'ASSESS' | 'OFF') {
    if (!tutorPolicy) return
    
    try {
      const { error } = await supabase
        .from('tutor_policies')
        .update({ mode })
        .eq('id', tutorPolicy.id)
      
      if (!error) {
        setTutorPolicy({ ...tutorPolicy, mode })
      }
    } catch (error) {
      console.error('Error updating tutor mode:', error)
    }
  }

  async function awardBonus(studentId: string, points: number, reason: string) {
    try {
      const { error } = await supabase
        .from('xp_events')
        .insert({
          class_id: currentClass?.id || '',
          student_id: studentId,
          source: 'BONUS',
          points,
          multiplier: 1,
          meta: { reason }
        })
      
      if (!error) {
        // Refresh student data
        loadDashboardData()
      }
    } catch (error) {
      console.error('Error awarding bonus:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Teacher Console...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="navigation-aware min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Console</h1>
              <p className="text-gray-400">{currentClass?.name} • Week {currentWeek}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Week Selector */}
              <select
                value={currentWeek}
                onChange={(e) => setCurrentWeek(Number(e.target.value))}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
              >
                {[...Array(18)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                ))}
              </select>
              
              {/* Quick Actions */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Assignment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'tutor', label: 'AI Tutor', icon: Brain },
              { id: 'xp', label: 'XP & Badges', icon: Trophy },
              { id: 'analytics', label: 'Analytics', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-white bg-gray-700/50'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Active Students</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{students.length}</p>
                <p className="text-sm text-green-400 mt-1">+5 this week</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Avg Completion</span>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-sm text-green-400 mt-1">↑ 3% from last week</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total XP Awarded</span>
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">12,450</p>
                <p className="text-sm text-gray-400 mt-1">This week</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">AI Tutor Queries</span>
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">342</p>
                <p className="text-sm text-yellow-400 mt-1">12 need review</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-left flex items-center justify-between">
                  <span>Start Draft Day</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-left flex items-center justify-between">
                  <span>Award Bonus XP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-left flex items-center justify-between">
                  <span>Grade Submissions</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2 text-left flex items-center justify-between">
                  <span>Review AI Flags</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Student Roster</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total XP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Streak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Badges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {student.display_name?.[0] || student.full_name?.[0] || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {student.display_name || student.full_name}
                            </div>
                            <div className="text-sm text-gray-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-medium">{student.total_xp}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white">{Math.floor(student.total_xp / 100)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-orange-400">{student.current_streak}</span>
                          <span className="ml-1 text-orange-400">🔥</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-purple-400">5</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => awardBonus(student.id, 10, 'Teacher bonus')}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tutor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tutor Controls */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-bold mb-4">AI Tutor Controls</h3>
              
              {/* Mode Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tutor Mode
                </label>
                <div className="space-y-2">
                  {['LEARN', 'ASSESS', 'OFF'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateTutorMode(mode as any)}
                      className={`w-full px-4 py-2 rounded-lg border transition-all ${
                        tutorPolicy?.mode === mode
                          ? mode === 'OFF'
                            ? 'bg-red-600 border-red-500 text-white'
                            : mode === 'ASSESS'
                            ? 'bg-yellow-600 border-yellow-500 text-white'
                            : 'bg-green-600 border-green-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{mode}</span>
                        {mode === 'LEARN' && <Brain className="w-4 h-4" />}
                        {mode === 'ASSESS' && <Shield className="w-4 h-4" />}
                        {mode === 'OFF' && <Pause className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Scope Level
                </label>
                <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600">
                  <option value="TIGHT">TIGHT - This week only</option>
                  <option value="NORMAL">NORMAL - Semester content</option>
                  <option value="OPEN">OPEN - Broader CS topics</option>
                </select>
              </div>

              {/* Rate Limiting */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Rate Limit (queries/min)
                </label>
                <input
                  type="number"
                  value={tutorPolicy?.rate_per_min || 3}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                />
              </div>
            </div>

            {/* Recent Queries */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-white font-bold">Recent AI Tutor Queries</h3>
              </div>
              <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                {recentQueries.map((query) => (
                  <div key={query.id} className="p-4 hover:bg-gray-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">
                          "{query.prompt_text.slice(0, 100)}..."
                        </p>
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-gray-400">
                            {new Date(query.created_at).toLocaleTimeString()}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            query.decision === 'ALLOW'
                              ? 'bg-green-600/20 text-green-400'
                              : query.decision === 'SOFT_BLOCK'
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}>
                            {query.decision}
                          </span>
                        </div>
                      </div>
                      {query.decision === 'ESCALATE' && (
                        <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}