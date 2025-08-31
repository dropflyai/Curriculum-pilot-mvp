'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, Bot, Users, AlertTriangle, TrendingUp, 
  Clock, Eye, Send, Volume2, Zap, Star, BarChart3,
  User, Filter, Search, Bell, CheckCircle, XCircle,
  ArrowRight, Lightbulb, Code, BookOpen, Timer
} from 'lucide-react'

// Mock data structures - will replace with real data
interface AIConversation {
  id: string
  studentId: string
  studentName: string
  lessonTitle: string
  sectionName: string
  messages: {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    flagged?: boolean
  }[]
  status: 'active' | 'resolved' | 'needs_help'
  lastActivity: Date
  duration: number // minutes
}

interface AIMetrics {
  totalConversations: number
  activeStudents: number
  strugglingStudents: number
  avgResponseTime: number
  helpfulnessRating: number
  commonQuestions: string[]
  conceptsNeedingHelp: string[]
}

interface StudentAIActivity {
  studentId: string
  studentName: string
  conversationCount: number
  lastActive: Date
  status: 'active' | 'stuck' | 'progressing'
  currentLesson: string
  timeWithAI: number
  helpRequests: number
}

export default function AITutorMonitoring() {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [metrics, setMetrics] = useState<AIMetrics | null>(null)
  const [studentActivity, setStudentActivity] = useState<StudentAIActivity[]>([])
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'needs_help'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showInterventionModal, setShowInterventionModal] = useState(false)
  const [interventionMessage, setInterventionMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation])

  // Mock data initialization
  useEffect(() => {
    initializeMockData()
    const interval = setInterval(updateRealTimeData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const initializeMockData = () => {
    // Mock conversations
    const mockConversations: AIConversation[] = [
      {
        id: '1',
        studentId: 'sarah-123',
        studentName: 'Sarah Johnson',
        lessonTitle: 'Python: Variables & Data Types',
        sectionName: 'Learn',
        status: 'needs_help',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000),
        duration: 8,
        messages: [
          {
            id: '1',
            type: 'user',
            content: 'I don\'t understand why my variable isn\'t working. This is so confusing!',
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            flagged: true
          },
          {
            id: '2',
            type: 'ai',
            content: 'I can help you figure this out! Can you show me the code you\'re working with? What exactly isn\'t working the way you expected?',
            timestamp: new Date(Date.now() - 7 * 60 * 1000)
          },
          {
            id: '3',
            type: 'user',
            content: 'name = Sarah and then print(Name) but it says NameError',
            timestamp: new Date(Date.now() - 5 * 60 * 1000)
          },
          {
            id: '4',
            type: 'ai',
            content: 'Great! I can see what\'s happening. Look carefully at your variable name when you create it versus when you print it. What do you notice about the capitalization?',
            timestamp: new Date(Date.now() - 4 * 60 * 1000)
          },
          {
            id: '5',
            type: 'user',
            content: 'Oh wait... I used lowercase "name" but uppercase "Name" in print?',
            timestamp: new Date(Date.now() - 2 * 60 * 1000)
          }
        ]
      },
      {
        id: '2',
        studentId: 'mike-456',
        studentName: 'Mike Chen',
        lessonTitle: 'Magic 8-Ball Project',
        sectionName: 'Code',
        status: 'active',
        lastActivity: new Date(Date.now() - 1 * 60 * 1000),
        duration: 12,
        messages: [
          {
            id: '1',
            type: 'user',
            content: 'How do I make my Magic 8-Ball give different answers each time?',
            timestamp: new Date(Date.now() - 12 * 60 * 1000)
          },
          {
            id: '2',
            type: 'ai',
            content: 'Excellent question! Think about this: if you had a real Magic 8-Ball, what makes each shake give a different answer? What concept in programming might work the same way?',
            timestamp: new Date(Date.now() - 11 * 60 * 1000)
          },
          {
            id: '3',
            type: 'user',
            content: 'Random? Like it picks randomly from the answers?',
            timestamp: new Date(Date.now() - 10 * 60 * 1000)
          }
        ]
      },
      {
        id: '3',
        studentId: 'emma-789',
        studentName: 'Emma Rodriguez',
        lessonTitle: 'Python: Variables & Data Types',
        sectionName: 'Quiz',
        status: 'resolved',
        lastActivity: new Date(Date.now() - 15 * 60 * 1000),
        duration: 5,
        messages: [
          {
            id: '1',
            type: 'user',
            content: 'What\'s the difference between strings and integers again?',
            timestamp: new Date(Date.now() - 20 * 60 * 1000)
          },
          {
            id: '2',
            type: 'ai',
            content: 'Great question! Think of it like this: strings are like text messages (words, letters, even numbers in quotes), while integers are like counting numbers for math. Can you give me an example of each?',
            timestamp: new Date(Date.now() - 19 * 60 * 1000)
          }
        ]
      }
    ]

    const mockMetrics: AIMetrics = {
      totalConversations: 47,
      activeStudents: 23,
      strugglingStudents: 3,
      avgResponseTime: 1.2,
      helpfulnessRating: 4.7,
      commonQuestions: [
        'How do I fix NameError?',
        'What\'s the difference between strings and integers?',
        'Why isn\'t my variable working?',
        'How do I use random in Python?',
        'What does indentation error mean?'
      ],
      conceptsNeedingHelp: [
        'Variable naming conventions',
        'String vs integer types',
        'Python syntax rules',
        'Import statements',
        'List indexing'
      ]
    }

    const mockStudentActivity: StudentAIActivity[] = [
      {
        studentId: 'sarah-123',
        studentName: 'Sarah Johnson',
        conversationCount: 3,
        lastActive: new Date(Date.now() - 2 * 60 * 1000),
        status: 'stuck',
        currentLesson: 'Python: Variables',
        timeWithAI: 18,
        helpRequests: 5
      },
      {
        studentId: 'mike-456',
        studentName: 'Mike Chen',
        conversationCount: 2,
        lastActive: new Date(Date.now() - 1 * 60 * 1000),
        status: 'active',
        currentLesson: 'Magic 8-Ball',
        timeWithAI: 12,
        helpRequests: 2
      },
      {
        studentId: 'emma-789',
        studentName: 'Emma Rodriguez',
        conversationCount: 1,
        lastActive: new Date(Date.now() - 15 * 60 * 1000),
        status: 'progressing',
        currentLesson: 'Python: Variables',
        timeWithAI: 5,
        helpRequests: 1
      }
    ]

    setConversations(mockConversations)
    setMetrics(mockMetrics)
    setStudentActivity(mockStudentActivity)
  }

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setConversations(prev => 
      prev.map(conv => ({
        ...conv,
        lastActivity: conv.status === 'active' ? new Date() : conv.lastActivity
      }))
    )
  }

  const getFilteredConversations = () => {
    let filtered = conversations

    if (filterStatus !== 'all') {
      filtered = filtered.filter(conv => conv.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }

  const handleIntervention = (conversationId: string) => {
    setSelectedConversation(conversations.find(c => c.id === conversationId) || null)
    setShowInterventionModal(true)
  }

  const sendInterventionMessage = () => {
    if (selectedConversation && interventionMessage.trim()) {
      // In real implementation, this would send message to the student
      console.log(`Teacher intervention sent to ${selectedConversation.studentName}: ${interventionMessage}`)
      setShowInterventionModal(false)
      setInterventionMessage('')
    }
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs_help': return 'text-red-400 bg-red-900/30 border-red-500/50'
      case 'active': return 'text-green-400 bg-green-900/30 border-green-500/50'
      case 'resolved': return 'text-gray-400 bg-gray-900/30 border-gray-500/50'
      case 'stuck': return 'text-red-400 bg-red-900/30 border-red-500/50'
      case 'progressing': return 'text-blue-400 bg-blue-900/30 border-blue-500/50'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50'
    }
  }

  if (!metrics) {
    return <div className="p-6 text-white">Loading AI monitoring data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 rounded-lg p-6 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">AI Tutor Monitoring</h2>
            <p className="text-cyan-200">Real-time oversight of AI-student interactions</p>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-cyan-800/20 rounded-lg p-4 text-center">
            <MessageSquare className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{metrics.totalConversations}</div>
            <div className="text-cyan-300 text-sm">Conversations</div>
          </div>
          <div className="bg-green-800/20 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{metrics.activeStudents}</div>
            <div className="text-green-300 text-sm">Active Students</div>
          </div>
          <div className="bg-red-800/20 rounded-lg p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{metrics.strugglingStudents}</div>
            <div className="text-red-300 text-sm">Need Help</div>
          </div>
          <div className="bg-blue-800/20 rounded-lg p-4 text-center">
            <Zap className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{metrics.avgResponseTime}s</div>
            <div className="text-blue-300 text-sm">Avg Response</div>
          </div>
          <div className="bg-yellow-800/20 rounded-lg p-4 text-center">
            <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{metrics.helpfulnessRating}/5</div>
            <div className="text-yellow-300 text-sm">AI Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Active Conversations
            </h3>
            <div className="flex items-center gap-2">
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="needs_help">Needs Help</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students or lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded border border-gray-600 text-sm"
            />
          </div>

          {/* Conversation List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getFilteredConversations().map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700/50 border ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-blue-900/30 border-blue-500/50' 
                    : 'bg-gray-700/30 border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-medium text-sm">{conversation.studentName}</div>
                    <div className="text-gray-400 text-xs">{conversation.lessonTitle}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(conversation.status)}`}>
                    {conversation.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-gray-300 text-xs mb-2 line-clamp-2">
                  {conversation.messages[conversation.messages.length - 1]?.content}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{formatTimeAgo(conversation.lastActivity)}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500">{conversation.duration}min</span>
                    {conversation.status === 'needs_help' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleIntervention(conversation.id)
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Bell className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-lg border border-gray-700">
          {selectedConversation ? (
            <div className="flex flex-col h-96">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedConversation.studentName}</h3>
                    <p className="text-gray-400 text-sm">{selectedConversation.lessonTitle} - {selectedConversation.sectionName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded border ${getStatusColor(selectedConversation.status)}`}>
                      {selectedConversation.status.replace('_', ' ')}
                    </div>
                    {selectedConversation.status === 'needs_help' && (
                      <button
                        onClick={() => handleIntervention(selectedConversation.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        Intervene
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        {/* Avatar & Time */}
                        <div className={`flex items-center gap-2 mb-1 text-xs text-gray-500 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          {message.type === 'ai' ? (
                            <Bot className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span>{message.type === 'ai' ? 'AI Tutor' : selectedConversation.studentName}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(message.timestamp)}</span>
                          {message.flagged && (
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`px-3 py-2 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.flagged
                              ? 'bg-red-900/30 text-red-100 border border-red-500/50'
                              : 'bg-gray-700 text-gray-100'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Questions */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Most Common Questions
          </h3>
          <div className="space-y-3">
            {metrics.commonQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
                <div className="bg-blue-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="text-gray-300 text-sm">{question}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Concepts Needing Help */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Concepts Needing More Help
          </h3>
          <div className="space-y-3">
            {metrics.conceptsNeedingHelp.map((concept, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <div className="text-yellow-200 text-sm">{concept}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intervention Modal */}
      {showInterventionModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Send Message to {selectedConversation.studentName}
            </h3>
            <textarea
              value={interventionMessage}
              onChange={(e) => setInterventionMessage(e.target.value)}
              placeholder="Type your helpful message to the student..."
              className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 resize-none h-24 text-sm"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowInterventionModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={sendInterventionMessage}
                disabled={!interventionMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}