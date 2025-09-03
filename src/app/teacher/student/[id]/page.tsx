'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, BookOpen, Code, Trophy, Clock, TrendingUp, MessageSquare, Edit, Award, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { mockStudents } from '@/lib/mock-teacher-data'

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  const [student, setStudent] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'code' | 'communication'>('overview')
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Find the student from mock data
    const foundStudent = mockStudents.find(s => s.id === studentId)
    if (foundStudent) {
      setStudent(foundStudent)
      setGrade(foundStudent.averageScore.toString())
    }
  }, [studentId])

  const handleSaveGrade = async () => {
    setSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Grade and feedback saved for ${student.full_name}`)
    setSaving(false)
  }

  const handleSendMessage = () => {
    const message = prompt(`Send a message to ${student.full_name}:`)
    if (message) {
      alert(`Message sent to ${student.full_name}: "${message}"`)
    }
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="text-center text-white">Loading student details...</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'completed': return 'text-blue-400'
      case 'needs_help': return 'text-yellow-400'
      case 'stuck': return 'text-red-400'
      default: return 'text-gray-400'
    }
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
              <h1 className="text-2xl font-bold text-white">Student Details</h1>
            </div>
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{student.full_name}</h2>
                <p className="text-purple-300">{student.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`flex items-center ${getStatusColor(student.status)}`}>
                    <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                    {student.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-gray-400">Last seen: {student.lastSeen}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{student.averageScore}%</div>
              <div className="text-sm text-purple-300">Average Score</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{student.completedLessons}</div>
              <div className="text-sm text-gray-400">Lessons Completed</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{student.timeSpent} min</div>
              <div className="text-sm text-gray-400">Time Spent</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-400">5</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {['overview', 'progress', 'code', 'communication'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-purple-300 hover:bg-gray-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Current Activity</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 font-medium">{student.currentLesson}</span>
                  <span className="text-green-400 text-sm">{student.lastActivity}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white">Grade & Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Current Grade</label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-32 p-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Teacher Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback for the student..."
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 h-32"
                  />
                </div>
                <button
                  onClick={handleSaveGrade}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Grade & Feedback'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Learning Progress</h3>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Python Basics: Variables</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-sm text-gray-400">Completed in 45 minutes • Score: 88%</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Magic 8-Ball Project</span>
                    <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="text-sm text-gray-400">In Progress • 65% complete</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Code Submissions</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm">
{`# Student's latest code submission
import random

def magic_8_ball():
    responses = [
        "It is certain",
        "Ask again later",
        "Don't count on it"
    ]
    return random.choice(responses)

answer = magic_8_ball()
print(f"The Magic 8-Ball says: {answer}")`}
                </pre>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-yellow-300 font-medium">Common Error Pattern Detected</div>
                    <div className="text-yellow-200 text-sm mt-1">Student frequently forgets to import required modules</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Message History</h3>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-purple-300 font-medium">Teacher</span>
                    <span className="text-gray-400 text-sm">2 hours ago</span>
                  </div>
                  <p className="text-white">Great job on the Variables lesson! Keep up the good work.</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-green-300 font-medium">Student</span>
                    <span className="text-gray-400 text-sm">1 hour ago</span>
                  </div>
                  <p className="text-white">Thanks! I'm stuck on the random module part. Can you help?</p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-500/30">
                <button
                  onClick={handleSendMessage}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send New Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}