'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, BookOpen, Users, Clock, BarChart3, 
  TrendingUp, Award, Target, Brain, CheckCircle,
  AlertTriangle, Play, Code, Trophy, Star,
  Eye, MessageSquare, Download
} from 'lucide-react'

interface LessonAnalytics {
  totalStudents: number
  completed: number
  inProgress: number
  notStarted: number
  averageScore: number
  averageTime: number
  strugglingStudents: Array<{
    name: string
    issue: string
    timeSpent: number
  }>
}

export default function PythonBasicsLessonDetail() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<LessonAnalytics>({
    totalStudents: 5,
    completed: 2,
    inProgress: 2,
    notStarted: 1,
    averageScore: 82,
    averageTime: 45,
    strugglingStudents: [
      { name: 'James Wilson', issue: 'Variable assignment confusion', timeSpent: 65 },
      { name: 'Michael Brown', issue: 'Syntax errors', timeSpent: 78 }
    ]
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'students'>('overview')

  const lessonData = {
    title: 'Shadow Protocol: Binary Shores Academy',
    week: 1,
    duration: 60,
    description: 'Begin your Shadow Protocol training! Master variables and basic data types in your first coding mission at Binary Shores Academy.',
    objectives: [
      'Master variables and basic data types in first coding mission',
      'Learn to categorize intelligence like elite coders',
      'Practice storing and manipulating classified data',
      'Apply Shadow Protocol security principles'
    ],
    standards: [
      'SC.912.ET.2.2: Describe major branches of AI',
      'SC.912.ET.2.3: Evaluate the application of algorithms to AI',
      'SC.912.ET.2.5: Describe major applications of AI & ML across fields'
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/teacher" className="text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{lessonData.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-purple-300 mt-1">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Week {lessonData.week} • {lessonData.duration} mins
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {analytics.totalStudents} students
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/teacher/manage"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Edit Lesson
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 mt-6 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'content', label: 'Content', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'students', label: 'Students', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-purple-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Stats */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Lesson Overview</h2>
                  <p className="text-gray-300 mb-4">{lessonData.description}</p>
                  
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {lessonData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 mt-6">Standards Alignment</h3>
                  <ul className="space-y-2">
                    {lessonData.standards.map((standard, index) => (
                      <li key={index} className="text-gray-300 text-sm">
                        • {standard}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{analytics.completed}</div>
                    <div className="text-sm text-green-300">Completed</div>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{analytics.inProgress}</div>
                    <div className="text-sm text-yellow-300">In Progress</div>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-500/30">
                    <div className="text-2xl font-bold text-gray-400">{analytics.notStarted}</div>
                    <div className="text-sm text-gray-300">Not Started</div>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{analytics.averageScore}%</div>
                    <div className="text-sm text-blue-300">Avg Score</div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview as Student
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Announcement
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export Progress
                    </button>
                  </div>
                </div>

                {/* Struggling Students */}
                {analytics.strugglingStudents.length > 0 && (
                  <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 mt-6">
                    <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Students Need Help
                    </h3>
                    <div className="space-y-3">
                      {analytics.strugglingStudents.map((student, index) => (
                        <div key={index} className="bg-red-900/30 rounded-lg p-3">
                          <div className="font-medium text-red-200">{student.name}</div>
                          <div className="text-sm text-red-300">{student.issue}</div>
                          <div className="text-xs text-red-400 mt-1">{student.timeSpent} mins spent</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-4">Shadow Protocol Training Content</h2>
              <div className="prose prose-invert max-w-none">
                <h3>🕯️ Binary Shores Academy - Intelligence Training</h3>
                <p className="text-gray-300">
                  Agent, variables are like classified intelligence containers. Each piece of data must be properly categorized and secured using Python protocols.
                </p>
                
                <h4 className="text-purple-300">🔐 Classified Data Categories</h4>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <code className="text-green-400">
                    {`# Agent Profile - Classified Intel
agent_codename = "Shadow_Seven"
clearance_level = 9
mission_active = True
specialty_skill = "Cyber Intelligence"`}
                  </code>
                </div>

                <h4 className="text-purple-300">📋 Shadow Protocol Security Rules</h4>
                <ul className="text-gray-300">
                  <li>Agent codenames can contain letters, numbers, and underscores</li>
                  <li>Never start with a number (compromises security)</li>
                  <li>Case-sensitive protocols (Shadow and shadow are different agents)</li>
                  <li>Use descriptive codenames for operational security</li>
                </ul>

                <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30 mt-6">
                  <h4 className="text-red-300 font-semibold mb-2">🎯 Mission Briefing</h4>
                  <p className="text-red-200 text-sm">
                    Students are recruited as agents learning to handle classified data. Use spy analogies: 
                    variables are like intelligence files where agents store different types of mission-critical information!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Completion Time</span>
                    <span className="text-blue-400 font-semibold">{analytics.averageTime} minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Score</span>
                    <span className="text-green-400 font-semibold">{analytics.averageScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-purple-400 font-semibold">
                      {Math.round((analytics.completed / analytics.totalStudents) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">Common Issues</h3>
                <div className="space-y-3">
                  <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30">
                    <div className="font-medium text-red-300">Variable Naming</div>
                    <div className="text-sm text-red-200">40% of students struggle with naming conventions</div>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-500/30">
                    <div className="font-medium text-yellow-300">Data Types</div>
                    <div className="text-sm text-yellow-200">25% confusion between strings and numbers</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
              <div className="p-6 border-b border-purple-500/30">
                <h2 className="text-xl font-bold text-white">Student Progress</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    <tr className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-white">Alex Thompson</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300 border border-green-500/50">Completed</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">85%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">45 mins</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href="/teacher/student/student-1" className="text-blue-400 hover:text-blue-300">View Details</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-white">Maria Garcia</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300 border border-green-500/50">Completed</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">92%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">38 mins</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href="/teacher/student/student-2" className="text-blue-400 hover:text-blue-300">View Details</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-white">James Wilson</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-900/50 text-red-300 border border-red-500/50">Struggling</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-400 font-medium">--</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">65 mins</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href="/teacher/student/student-3" className="text-blue-400 hover:text-blue-300">Help Now</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}