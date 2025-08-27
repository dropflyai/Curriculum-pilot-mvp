'use client'

import { useState, useEffect } from 'react'
import { Users, MessageCircle, TrendingUp, AlertTriangle, CheckCircle, Clock, Brain, Target, Zap } from 'lucide-react'

interface Student {
  id: string
  name: string
  status: 'active' | 'stuck' | 'completed' | 'needs-help'
  lesson: string
  progress: number
  timeOnTask: number
  lastActivity: string
  errors: number
}

interface Message {
  id: string
  type: 'ai-help' | 'teacher-intervention' | 'student-question' | 'celebration'
  student: string
  content: string
  timestamp: string
}

export default function LiveClassroomDemo() {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alex Chen', status: 'active', lesson: 'Python Basics', progress: 75, timeOnTask: 12, lastActivity: 'Running code', errors: 1 },
    { id: '2', name: 'Maria Rodriguez', status: 'stuck', lesson: 'Variables', progress: 45, timeOnTask: 25, lastActivity: 'Debugging error', errors: 5 },
    { id: '3', name: 'James Wilson', status: 'completed', lesson: 'Python Basics', progress: 100, timeOnTask: 18, lastActivity: 'Completed quiz', errors: 2 },
    { id: '4', name: 'Emma Thompson', status: 'active', lesson: 'Magic 8-Ball', progress: 60, timeOnTask: 8, lastActivity: 'Reading content', errors: 0 },
    { id: '5', name: 'David Park', status: 'needs-help', lesson: 'Variables', progress: 30, timeOnTask: 20, lastActivity: 'Stuck on exercise', errors: 3 },
    { id: '6', name: 'Sophie Davis', status: 'active', lesson: 'Python Basics', progress: 85, timeOnTask: 15, lastActivity: 'Coding challenge', errors: 1 }
  ])
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'ai-help', student: 'Maria Rodriguez', content: 'AI detected syntax error - providing hint about missing quotes', timestamp: '2 seconds ago' },
    { id: '2', type: 'celebration', student: 'James Wilson', content: 'Completed Python Basics with 95% score! 🎉', timestamp: '1 minute ago' },
    { id: '3', type: 'teacher-intervention', student: 'David Park', content: 'Teacher sent personalized encouragement message', timestamp: '3 minutes ago' },
    { id: '4', type: 'ai-help', student: 'Alex Chen', content: 'AI suggesting next challenge based on strong performance', timestamp: '5 minutes ago' }
  ])

  const [classMetrics, setClassMetrics] = useState({
    avgProgress: 65,
    studentsNeedingHelp: 2,
    completionRate: 87,
    engagementScore: 94
  })

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Update student progress
      setStudents(prev => prev.map(student => {
        const progressIncrement = Math.random() * 3
        const newProgress = Math.min(student.progress + progressIncrement, 100)
        const timeIncrement = Math.random() * 2
        
        return {
          ...student,
          progress: newProgress,
          timeOnTask: student.timeOnTask + timeIncrement,
          status: newProgress === 100 ? 'completed' : 
                 student.timeOnTask > 22 ? 'stuck' : 
                 student.timeOnTask > 18 ? 'needs-help' : 
                 'active'
        }
      }))

      // Add new messages occasionally
      if (Math.random() > 0.7) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: ['ai-help', 'teacher-intervention', 'student-question', 'celebration'][Math.floor(Math.random() * 4)] as any,
          student: students[Math.floor(Math.random() * students.length)]?.name || 'Student',
          content: [
            'AI provided personalized hint for debugging',
            'Student achieved learning milestone!',
            'Teacher reviewed submitted code',
            'AI detected struggling student and offered help'
          ][Math.floor(Math.random() * 4)],
          timestamp: 'Just now'
        }
        
        setMessages(prev => [newMessage, ...prev].slice(0, 8))
      }

      // Update class metrics
      setClassMetrics(prev => ({
        avgProgress: Math.min(prev.avgProgress + Math.random() * 0.5, 95),
        studentsNeedingHelp: Math.max(1, Math.floor(Math.random() * 3)),
        completionRate: Math.min(prev.completionRate + Math.random() * 0.3, 98),
        engagementScore: Math.min(prev.engagementScore + Math.random() * 0.2, 99)
      }))
    }, 3000)

    return () => clearInterval(updateInterval)
  }, [students])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      case 'stuck': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'needs-help': return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10'
      case 'stuck': return 'text-red-400 bg-red-500/10'
      case 'completed': return 'text-emerald-400 bg-emerald-500/10'
      case 'needs-help': return 'text-yellow-400 bg-yellow-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'ai-help': return <Brain className="w-4 h-4 text-blue-400" />
      case 'teacher-intervention': return <Users className="w-4 h-4 text-purple-400" />
      case 'student-question': return <MessageCircle className="w-4 h-4 text-green-400" />
      case 'celebration': return <Target className="w-4 h-4 text-yellow-400" />
      default: return null
    }
  }

  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Live Classroom - Jefferson High CS Class</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">Live - 25 students online</span>
        </div>
      </div>

      {/* Class Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-green-400">↗ +2%</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(classMetrics.avgProgress)}%</div>
          <div className="text-sm text-gray-400">Avg Progress</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 metric-card">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <span className="text-xs text-yellow-400">Active</span>
          </div>
          <div className="text-2xl font-bold">{classMetrics.studentsNeedingHelp}</div>
          <div className="text-sm text-gray-400">Need Help</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 metric-card">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-xs text-green-400">↗ +1%</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(classMetrics.completionRate)}%</div>
          <div className="text-sm text-gray-400">Completion</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 metric-card">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-green-400">Excellent</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(classMetrics.engagementScore)}%</div>
          <div className="text-sm text-gray-400">Engagement</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Student Activity Feed */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Student Activity</span>
          </h4>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {students.map((student) => (
              <div key={student.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(student.status)}
                    <div>
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-gray-400">{student.lesson}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{Math.round(student.progress)}%</div>
                    <div className="text-xs text-gray-500">{Math.round(student.timeOnTask)}m</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{student.lastActivity}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                      {student.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI & Teacher Intervention Feed */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI & Teacher Actions</span>
          </h4>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="bg-white/5 rounded-lg p-4 animate-float-up">
                <div className="flex items-start space-x-3">
                  {getMessageIcon(message.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{message.student}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{message.content}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        message.type === 'ai-help' ? 'bg-blue-500/20 text-blue-400' :
                        message.type === 'teacher-intervention' ? 'bg-purple-500/20 text-purple-400' :
                        message.type === 'student-question' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {message.type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <h4 className="text-lg font-semibold mb-4">Teacher Control Panel</h4>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Send Class Message</span>
          </button>
          <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Help Struggling Students</span>
          </button>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>View Detailed Analytics</span>
          </button>
          <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Extend Lesson Time</span>
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/20">
          <div className="text-green-400 font-semibold text-sm mb-1">✅ SUCCESS STORY</div>
          <div className="text-sm">James completed his lesson 40% faster than average with the AI assistant's personalized guidance!</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/20">
          <div className="text-yellow-400 font-semibold text-sm mb-1">⚠️ INTERVENTION NEEDED</div>
          <div className="text-sm">Maria and David have been stuck for 20+ minutes - AI is providing targeted hints.</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
          <div className="text-blue-400 font-semibold text-sm mb-1">🤖 AI INSIGHTS</div>
          <div className="text-sm">Class engagement up 15% today. Variables concept showing 92% mastery rate.</div>
        </div>
      </div>
    </div>
  )
}