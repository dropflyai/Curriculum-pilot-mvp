'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, BookOpen, Trophy, Users, Clock, 
  CheckCircle, XCircle, AlertTriangle, TrendingUp,
  Eye, Download, Send, Filter, Search, BarChart3,
  Brain, Zap, Target, Star
} from 'lucide-react'

interface StudentAssignmentData {
  id: string
  name: string
  email: string
  status: 'completed' | 'in-progress' | 'not-started' | 'struggling'
  score?: number
  timeSpent: number
  completedAt?: string
  flashcardsViewed: number
  quizAttempts: number
  strugglingTerms: string[]
  masteredTerms: string[]
}

export default function VocabularyAssignmentMonitor() {
  const [students, setStudents] = useState<StudentAssignmentData[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.j@school.edu',
      status: 'completed',
      score: 91,
      timeSpent: 28,
      completedAt: '2024-03-14 3:45 PM',
      flashcardsViewed: 11,
      quizAttempts: 2,
      strugglingTerms: ['Inference'],
      masteredTerms: ['Machine Learning', 'AI', 'Dataset', 'Training', 'Labels', 'Accuracy', 'Bias', 'Fairness']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.c@school.edu',
      status: 'completed',
      score: 100,
      timeSpent: 22,
      completedAt: '2024-03-14 2:15 PM',
      flashcardsViewed: 11,
      quizAttempts: 1,
      strugglingTerms: [],
      masteredTerms: ['Machine Learning', 'AI', 'Dataset', 'Training', 'Inference', 'Labels', 'Accuracy', 'Confusion Matrix', 'Representativeness', 'Bias', 'Fairness']
    },
    {
      id: '3',
      name: 'Marcus Williams',
      email: 'marcus.w@school.edu',
      status: 'in-progress',
      timeSpent: 15,
      flashcardsViewed: 8,
      quizAttempts: 0,
      strugglingTerms: ['Confusion Matrix', 'Representativeness'],
      masteredTerms: ['Machine Learning', 'AI', 'Dataset', 'Training']
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.r@school.edu',
      status: 'struggling',
      score: 64,
      timeSpent: 45,
      completedAt: '2024-03-14 4:20 PM',
      flashcardsViewed: 11,
      quizAttempts: 3,
      strugglingTerms: ['Inference', 'Confusion Matrix', 'Representativeness', 'Bias'],
      masteredTerms: ['Machine Learning', 'AI', 'Dataset', 'Labels']
    },
    {
      id: '5',
      name: 'Jordan Lee',
      email: 'jordan.l@school.edu',
      status: 'not-started',
      timeSpent: 0,
      flashcardsViewed: 0,
      quizAttempts: 0,
      strugglingTerms: [],
      masteredTerms: []
    }
  ])

  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started' | 'struggling'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student => {
    const matchesFilter = filter === 'all' || student.status === filter
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    totalStudents: students.length,
    completed: students.filter(s => s.status === 'completed').length,
    inProgress: students.filter(s => s.status === 'in-progress').length,
    notStarted: students.filter(s => s.status === 'not-started').length,
    struggling: students.filter(s => s.status === 'struggling').length,
    avgScore: Math.round(students.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / students.filter(s => s.score).length),
    avgTime: Math.round(students.reduce((acc, s) => acc + s.timeSpent, 0) / students.filter(s => s.timeSpent > 0).length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'not-started': return 'bg-gray-500'
      case 'struggling': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600'
      case 'in-progress': return 'bg-blue-600'
      case 'not-started': return 'bg-gray-600'
      case 'struggling': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/teacher"
                className="flex items-center text-gray-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-white">Week 1: AI Vocabulary Assignment</h1>
                  <p className="text-sm text-gray-400">Flashcards & Matching Quiz Monitor</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Send className="h-4 w-4 inline mr-2" />
                Send Reminder
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="h-4 w-4 inline mr-2" />
                Export Results
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Overview */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-bold text-white">{stats.totalStudents}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Students</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{stats.completed}</span>
              </div>
              <p className="text-gray-400 text-sm">Completed</p>
              <div className="mt-1 text-xs text-green-400">{Math.round(stats.completed / stats.totalStudents * 100)}%</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">{stats.inProgress}</span>
              </div>
              <p className="text-gray-400 text-sm">In Progress</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <span className="text-2xl font-bold text-red-400">{stats.struggling}</span>
              </div>
              <p className="text-gray-400 text-sm">Need Help</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{stats.avgScore}%</span>
              </div>
              <p className="text-gray-400 text-sm">Avg Score</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-6 w-6 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">{stats.avgTime}m</span>
              </div>
              <p className="text-gray-400 text-sm">Avg Time</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Overall Completion</span>
              <span className="text-green-400 font-bold">{Math.round(stats.completed / stats.totalStudents * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(stats.completed / stats.totalStudents) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({stats.totalStudents})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Completed ({stats.completed})
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-1" />
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setFilter('struggling')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'struggling' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Struggling ({stats.struggling})
              </button>
              <button
                onClick={() => setFilter('not-started')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'not-started' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Not Started ({stats.notStarted})
              </button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Struggling With</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${getStatusColor(student.status)} rounded-full mr-3`}></div>
                        <div>
                          <div className="text-sm font-medium text-white">{student.name}</div>
                          <div className="text-sm text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusBadge(student.status)}`}>
                        {student.status === 'in-progress' ? 'In Progress' : 
                         student.status === 'not-started' ? 'Not Started' :
                         student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.score ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${
                            student.score >= 90 ? 'text-green-400' :
                            student.score >= 70 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {student.score}%
                          </span>
                          {student.score >= 90 && <Star className="h-4 w-4 text-yellow-400 ml-1" />}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{student.timeSpent > 0 ? `${student.timeSpent} min` : '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs space-y-1">
                        <div className="text-gray-400">
                          Flashcards: <span className="text-gray-300">{student.flashcardsViewed}/11</span>
                        </div>
                        <div className="text-gray-400">
                          Quiz Attempts: <span className="text-gray-300">{student.quizAttempts}</span>
                        </div>
                        {student.completedAt && (
                          <div className="text-gray-400">
                            Completed: <span className="text-gray-300">{student.completedAt}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.strugglingTerms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.strugglingTerms.map((term, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-red-900/50 text-red-300 rounded">
                              {term}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Send className="h-5 w-5" />
                        </button>
                        {student.status === 'struggling' && (
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            <Zap className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {students
                .filter(s => s.score)
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .slice(0, 3)
                .map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="text-white">{student.name}</span>
                    </div>
                    <span className="text-green-400 font-bold">{student.score}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Most Challenging Terms
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Confusion Matrix</span>
                <span className="text-red-400">4 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Representativeness</span>
                <span className="text-red-400">3 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Inference</span>
                <span className="text-red-400">2 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Bias</span>
                <span className="text-red-400">1 student</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}