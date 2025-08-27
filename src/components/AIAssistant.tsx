'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Send, X, Sparkles, HelpCircle, Code, MessageCircle } from 'lucide-react'
import { simulatedAI, generateAIConversation, getAIAnalytics } from '@/lib/simulated-ai'

interface Message {
  role: 'student' | 'ai' | 'system'
  message: string
  timestamp: string
  emotion?: string
}

interface AIAssistantProps {
  studentName?: string
  lessonTitle?: string
  showAnalytics?: boolean
  isTeacherView?: boolean
}

export default function AIAssistant({ 
  studentName = 'Student', 
  lessonTitle = 'Python Basics',
  showAnalytics = false,
  isTeacherView = false
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Load demo conversation on mount
  useEffect(() => {
    if (isTeacherView) {
      // Show a realistic conversation for teacher view
      const demoConvo = generateAIConversation(studentName, lessonTitle)
      setMessages(demoConvo as Message[])
    } else {
      // Welcome message for students
      setMessages([
        {
          role: 'ai',
          message: `Hi ${studentName}! 👋 I'm your CodeFly AI assistant. I'm here to help you with ${lessonTitle}. Feel free to ask me anything about your code!`,
          timestamp: 'Just now',
          emotion: '😊'
        }
      ])
    }
  }, [studentName, lessonTitle, isTeacherView])
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSend = () => {
    if (!inputValue.trim()) return
    
    // Add student message
    const studentMessage: Message = {
      role: 'student',
      message: inputValue,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, studentMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Simulate AI response delay
    setTimeout(() => {
      const context = {
        lessonTitle,
        studentName,
        currentCode: inputValue,
        errorType: detectErrorInMessage(inputValue)
      }
      
      const aiResponse = simulatedAI.getResponse(context)
      
      const aiMessage: Message = {
        role: 'ai',
        message: aiResponse.message,
        timestamp: 'Just now',
        emotion: aiResponse.emotion
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
      // If solution provided, show code
      if (aiResponse.showCode && aiResponse.codeExample) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            message: `\`\`\`python\n${aiResponse.codeExample}\n\`\`\``,
            timestamp: 'Just now'
          }])
        }, 500)
      }
    }, 1500)
  }
  
  const detectErrorInMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('nameerror')) return 'NameError'
    if (lowerMessage.includes('syntax')) return 'SyntaxError'
    if (lowerMessage.includes('indent')) return 'IndentationError'
    if (lowerMessage.includes('not defined')) return 'NameError'
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help')) return 'help_request'
    return ''
  }
  
  if (showAnalytics) {
    // Admin analytics view
    const analytics = getAIAnalytics()
    return (
      <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Bot className="w-8 h-8 mr-3 text-cyan-400" />
            AI Teaching Assistant Analytics
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">AI Active</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-cyan-400">{analytics.totalInteractions}</div>
            <div className="text-sm text-gray-400">Total AI Interactions</div>
            <div className="text-xs text-green-400 mt-1">↗ +23% this week</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">{analytics.studentsSatisfaction}%</div>
            <div className="text-sm text-gray-400">Student Satisfaction</div>
            <div className="text-xs text-gray-500 mt-1">Based on feedback</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">{analytics.studentsHelped}</div>
            <div className="text-sm text-gray-400">Students Helped Today</div>
            <div className="text-xs text-gray-500 mt-1">Unique students</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">{analytics.successRate}%</div>
            <div className="text-sm text-gray-400">Problem Resolution Rate</div>
            <div className="text-xs text-gray-500 mt-1">First attempt</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-3">🔥 Common Issues Resolved</h4>
            <div className="space-y-2">
              {Object.entries(analytics.commonIssuesResolved).map(([issue, count]) => (
                <div key={issue} className="flex items-center justify-between">
                  <span className="text-gray-300">{issue}</span>
                  <span className="text-cyan-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-3">📊 AI Performance</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg Response Time</span>
                <span className="text-green-400">{analytics.averageResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Peak Usage</span>
                <span className="text-blue-400">{analytics.peakUsageHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg Attempts to Solution</span>
                <span className="text-purple-400">{analytics.averageAttemptsBeforeSolution}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center space-x-2 text-green-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI Impact Summary</span>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            The AI assistant has reduced teacher intervention needs by 73% and improved student completion rates by 42%. 
            Students report feeling more confident and less frustrated when coding.
          </p>
        </div>
      </div>
    )
  }
  
  // Regular chat interface
  return (
    <>
      {/* Chat Button */}
      {!isOpen && !isTeacherView && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full shadow-lg hover:from-cyan-600 hover:to-teal-700 transition transform hover:scale-110 z-50"
        >
          <Bot className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}
      
      {/* Chat Window */}
      {(isOpen || isTeacherView) && (
        <div className={`${isTeacherView ? 'w-full' : 'fixed bottom-4 right-4 w-96 z-50'} bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-cyan-500/30 ${!isTeacherView && 'max-h-[600px]'} flex flex-col`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-t-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">CodeFly AI Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-100 text-xs">Always here to help</span>
                </div>
              </div>
            </div>
            {!isTeacherView && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  msg.role === 'student' 
                    ? 'bg-blue-600 text-white rounded-l-xl rounded-br-xl' 
                    : msg.role === 'system'
                    ? 'bg-gray-700 text-gray-300 rounded-xl font-mono text-sm w-full'
                    : 'bg-white/10 text-white rounded-r-xl rounded-bl-xl'
                } p-3`}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 text-xs font-semibold">AI Assistant</span>
                      {msg.emotion && <span className="text-lg">{msg.emotion}</span>}
                    </div>
                  )}
                  <div className={msg.role === 'system' ? 'whitespace-pre' : ''}>{msg.message}</div>
                  <div className={`text-xs mt-1 ${msg.role === 'student' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-r-xl rounded-bl-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          {!isTeacherView && (
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about coding..."
                  className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg hover:from-cyan-600 hover:to-teal-700 transition"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-400 text-center">
                Powered by CodeFly AI • Responds to all lesson content
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}