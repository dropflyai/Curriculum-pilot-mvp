'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Award, TrendingUp, Clock, AlertTriangle, CheckCircle,
  Bot, MessageSquare, BarChart3, Settings, Calendar, 
  FileText, Star, Zap, Target, BookOpen, Code, Send,
  Eye, ThumbsUp, ThumbsDown, Flag, Download
} from 'lucide-react'
import { assessmentEngine, ClassGradebook, TeacherGrading } from '@/lib/assessment-engine'
import { coachNova } from '@/lib/coach-nova'
import { xpEngine } from '@/lib/xp-engine'

interface EnhancedTeacherConsoleProps {
  currentWeek?: number
}

type ConsoleView = 'dashboard' | 'gradebook' | 'ai_analytics' | 'assignments' | 'students' | 'settings'

export default function EnhancedTeacherConsole({ currentWeek = 1 }: EnhancedTeacherConsoleProps) {
  const [activeView, setActiveView] = useState<ConsoleView>('dashboard')
  const [classGradebook, setClassGradebook] = useState<ClassGradebook | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)
  const [loading, setLoading] = useState(true)
  
  // Dashboard Analytics State
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingReviews: 0,
    averageClassScore: 0,
    completionRate: 0,
    studentsNeedingHelp: 0
  })
  
  // AI Analytics State
  const [aiAnalytics, setAIAnalytics] = useState({
    totalInteractions: 0,
    helpRequestsByTopic: {},
    successRate: 0,
    escalationRate: 0,
    avgSatisfaction: 0
  })
  
  // Grading State
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [gradingAssignment, setGradingAssignment] = useState<string | null>(null)
  const [gradingData, setGradingData] = useState<TeacherGrading>({
    criterion_scores: {},
    teacher_feedback: '',
    bonus_points: 0,
    late_penalty_applied: false,
    standards_evidence: {}
  })

  // Load teacher console data
  useEffect(() => {
    loadConsoleData()
  }, [selectedWeek])

  const loadConsoleData = async () => {
    try {
      setLoading(true)
      
      // Load class gradebook
      const gradebook = await assessmentEngine.generateClassGradebook('teacher_id', selectedWeek)
      setClassGradebook(gradebook)
      
      // Update dashboard metrics
      setDashboardMetrics({
        totalStudents: gradebook.students.length,
        activeStudents: gradebook.students.filter(s => !s.at_risk).length,
        pendingReviews: gradebook.class_statistics.assignments_pending_review,
        averageClassScore: Math.round(gradebook.class_statistics.avg_score),
        completionRate: Math.round(gradebook.class_statistics.completion_rate),
        studentsNeedingHelp: gradebook.class_statistics.students_needing_help
      })
      
      // Load AI analytics
      const tutorAnalytics = await coachNova.getTutoringAnalytics(selectedWeek)
      setAIAnalytics({
        totalInteractions: tutorAnalytics.total_interactions,
        helpRequestsByTopic: tutorAnalytics.help_requests_by_topic,
        successRate: Math.round(tutorAnalytics.success_rate),
        escalationRate: Math.round(tutorAnalytics.escalation_rate),
        avgSatisfaction: Math.round(tutorAnalytics.avg_response_satisfaction * 10) / 10
      })
      
    } catch (error) {
      console.error('Error loading console data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // DASHBOARD VIEW
  // ==========================================

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.totalStudents}</span>
          </div>
          <div className="text-blue-100 text-sm font-medium">Total Students</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.activeStudents}</span>
          </div>
          <div className="text-green-100 text-sm font-medium">Active Students</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.pendingReviews}</span>
          </div>
          <div className="text-orange-100 text-sm font-medium">Pending Reviews</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-purple-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.averageClassScore}%</span>
          </div>
          <div className="text-purple-100 text-sm font-medium">Class Average</div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-teal-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.completionRate}%</span>
          </div>
          <div className="text-teal-100 text-sm font-medium">Completion Rate</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-200" />
            <span className="text-2xl font-bold">{dashboardMetrics.studentsNeedingHelp}</span>
          </div>
          <div className="text-red-100 text-sm font-medium">Need Help</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            Recent Student Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <div className="text-white font-medium">Sarah Chen completed Quiz 1</div>
                <div className="text-gray-400 text-sm">Score: 95% • 2 minutes ago</div>
              </div>
              <div className="text-green-400">🎉</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <div className="text-white font-medium">Marcus Johnson needs help</div>
                <div className="text-gray-400 text-sm">Stuck on variables • 15 minutes</div>
              </div>
              <div className="text-orange-400">⚠️</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <div className="text-white font-medium">Emma Rodriguez submitted Assignment 1</div>
                <div className="text-gray-400 text-sm">Ready for review • 1 hour ago</div>
              </div>
              <div className="text-blue-400">📝</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-cyan-400" />
            Coach Nova AI Analytics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Interactions</span>
              <span className="text-cyan-400 font-semibold">{aiAnalytics.totalInteractions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Success Rate</span>
              <span className="text-green-400 font-semibold">{aiAnalytics.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Student Satisfaction</span>
              <span className="text-yellow-400 font-semibold">{aiAnalytics.avgSatisfaction}/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Escalations</span>
              <span className="text-orange-400 font-semibold">{aiAnalytics.escalationRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ==========================================
  // GRADEBOOK VIEW
  // ==========================================

  const renderGradebook = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Class Gradebook</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            {Array.from({ length: 18 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Class Statistics */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">Week {selectedWeek} Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{dashboardMetrics.averageClassScore}%</div>
            <div className="text-gray-400 text-sm">Class Average</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{dashboardMetrics.completionRate}%</div>
            <div className="text-gray-400 text-sm">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{dashboardMetrics.pendingReviews}</div>
            <div className="text-gray-400 text-sm">Pending Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{dashboardMetrics.studentsNeedingHelp}</div>
            <div className="text-gray-400 text-sm">Need Help</div>
          </div>
        </div>
      </div>

      {/* Student Gradebook Table */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-white font-semibold">Student</th>
                <th className="text-center p-4 text-white font-semibold">Assignment 1</th>
                <th className="text-center p-4 text-white font-semibold">Assignment 2</th>
                <th className="text-center p-4 text-white font-semibold">Quiz 1</th>
                <th className="text-center p-4 text-white font-semibold">Average</th>
                <th className="text-center p-4 text-white font-semibold">Status</th>
                <th className="text-center p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classGradebook?.students.map((student, index) => (
                <tr key={student.user_id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        student.at_risk ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="text-white font-medium">{student.student_name}</div>
                        <div className="text-gray-400 text-sm">{student.missing_assignments} missing</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <GradeCell grade={85} status="completed" />
                  </td>
                  <td className="text-center p-4">
                    <GradeCell grade={null} status="submitted" />
                  </td>
                  <td className="text-center p-4">
                    <GradeCell grade={92} status="completed" />
                  </td>
                  <td className="text-center p-4">
                    <span className={`font-semibold ${
                      student.class_average >= 90 ? 'text-green-400' :
                      student.class_average >= 80 ? 'text-blue-400' :
                      student.class_average >= 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {Math.round(student.class_average)}%
                    </span>
                  </td>
                  <td className="text-center p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.at_risk 
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'bg-green-600/20 text-green-400 border border-green-500/30'
                    }`}>
                      {student.at_risk ? 'At Risk' : 'On Track'}
                    </span>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student.user_id)
                          setActiveView('students')
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openGradingModal(student.user_id, 'assignment_1')}
                        className="p-2 text-green-400 hover:text-green-300 transition"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-400 hover:text-purple-300 transition">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ==========================================
  // AI ANALYTICS VIEW
  // ==========================================

  const renderAIAnalytics = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Bot className="w-8 h-8 mr-3 text-cyan-400" />
        Coach Nova AI Analytics
      </h2>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{aiAnalytics.totalInteractions}</div>
          <div className="text-cyan-100">Total Interactions</div>
          <div className="text-cyan-200 text-sm mt-1">+15% this week</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{aiAnalytics.successRate}%</div>
          <div className="text-green-100">Success Rate</div>
          <div className="text-green-200 text-sm mt-1">Above target (85%)</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{aiAnalytics.avgSatisfaction}</div>
          <div className="text-yellow-100">Satisfaction Score</div>
          <div className="text-yellow-200 text-sm mt-1">Out of 5.0</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{aiAnalytics.escalationRate}%</div>
          <div className="text-orange-100">Escalation Rate</div>
          <div className="text-orange-200 text-sm mt-1">Referred to teacher</div>
        </div>
      </div>

      {/* Common Help Topics */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">🔥 Most Requested Help Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(aiAnalytics.helpRequestsByTopic).slice(0, 8).map(([topic, count]) => (
            <div key={topic} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-300">{topic}</span>
              <span className="text-cyan-400 font-semibold">{count as number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Intervention Recommendations */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
            <div>
              <div className="text-white font-medium">High Variable Confusion</div>
              <div className="text-gray-400 text-sm">Consider reviewing variable concepts with class - 67% of help requests</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg">
            <Zap className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <div className="text-white font-medium">Strong Code Quality</div>
              <div className="text-gray-400 text-sm">Students are writing well-structured code - praise effort!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const openGradingModal = (studentId: string, assignmentId: string) => {
    setSelectedStudent(studentId)
    setGradingAssignment(assignmentId)
    // Would open grading modal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading teacher console... 📊</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeFly Teacher Console ✈️
              </h1>
              <p className="text-gray-300">Enhanced Classroom Management & Analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white">Week {selectedWeek}</div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-2 mt-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'gradebook', label: 'Gradebook', icon: FileText },
              { id: 'ai_analytics', label: 'AI Analytics', icon: Bot },
              { id: 'assignments', label: 'Assignments', icon: BookOpen },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as ConsoleView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeView === view.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'gradebook' && renderGradebook()}
        {activeView === 'ai_analytics' && renderAIAnalytics()}
        {activeView === 'assignments' && (
          <div className="text-white text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-2">Assignment Management</h2>
            <p className="text-gray-400">Create, edit, and manage course assignments</p>
          </div>
        )}
        {activeView === 'students' && (
          <div className="text-white text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2">Student Management</h2>
            <p className="text-gray-400">View individual student progress and provide support</p>
          </div>
        )}
        {activeView === 'settings' && (
          <div className="text-white text-center py-16">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Console Settings</h2>
            <p className="text-gray-400">Configure AI tutor policies, grading rubrics, and notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

interface GradeCellProps {
  grade: number | null
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'completed'
}

function GradeCell({ grade, status }: GradeCellProps) {
  if (status === 'not_started') {
    return <span className="text-gray-500">—</span>
  }
  
  if (status === 'in_progress') {
    return (
      <div className="flex items-center justify-center">
        <Clock className="w-4 h-4 text-yellow-400" />
      </div>
    )
  }
  
  if (status === 'submitted') {
    return (
      <div className="flex items-center justify-center">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-orange-400 text-sm ml-2">Review</span>
      </div>
    )
  }
  
  if (grade !== null) {
    return (
      <span className={`font-semibold ${
        grade >= 90 ? 'text-green-400' :
        grade >= 80 ? 'text-blue-400' :
        grade >= 70 ? 'text-yellow-400' :
        'text-red-400'
      }`}>
        {grade}%
      </span>
    )
  }
  
  return <span className="text-gray-500">—</span>
}