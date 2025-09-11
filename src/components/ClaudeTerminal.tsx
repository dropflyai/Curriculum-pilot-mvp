'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  Bot, 
  User, 
  Settings, 
  Zap, 
  Shield, 
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { claudeMCP, type ClaudeResponse, type UsageMetrics } from '../lib/claude-mcp-integration'

interface Message {
  id: string
  content: string
  sender: 'user' | 'claude'
  timestamp: Date
  model?: string
  tokens?: number
  type?: 'message' | 'code' | 'debug' | 'review'
}

interface ClaudeTerminalProps {
  currentCode?: string
  currentLesson?: {
    id: string
    title: string
    objective: string
    operation: string
  }
  studentProgress?: {
    level: number
    xp: number
    completedOperations: string[]
  }
  onCodeGenerated?: (code: string) => void
  className?: string
}

export default function ClaudeTerminal({
  currentCode = '',
  currentLesson,
  studentProgress = { level: 8, xp: 1250, completedOperations: [] },
  onCodeGenerated,
  className = ''
}: ClaudeTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'sonnet' | 'opus' | 'haiku'>('sonnet')
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [quickActions, setQuickActions] = useState({
    codeReview: false,
    debugHelp: false,
    lessonHelp: false,
    generateCode: false
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Claude MCP integration
  useEffect(() => {
    checkAuthStatus()
    loadUsageMetrics()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start Claude session when authenticated
  useEffect(() => {
    if (isAuthenticated && !sessionId) {
      startClaudeSession()
    }
  }, [isAuthenticated, sessionId])

  const checkAuthStatus = async () => {
    try {
      const status = await claudeMCP.getAuthStatus()
      setAuthStatus(status)
      setIsAuthenticated(status.isAuthenticated)
    } catch (error) {
      console.error('Auth status check failed:', error)
    }
  }

  const loadUsageMetrics = () => {
    const metrics = claudeMCP.getUsageMetrics()
    setUsageMetrics(metrics)
  }

  const startClaudeSession = async () => {
    try {
      const sessionId = await claudeMCP.startSession({
        currentLesson,
        studentProgress,
        currentCode,
        recentErrors: [],
        hints: [],
        sessionNotes: []
      })
      setSessionId(sessionId)
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        content: `🎯 **Agent Academy Claude Terminal Activated**

Hello, Agent! I'm Dr. Maya, your AI development mentor. I'm connected to your Claude ${authStatus?.userInfo?.plan || 'subscription'} and ready to help with your coding mission.

**Current Status:**
- Mission: ${currentLesson?.title || 'General Training'}
- Agent Level: ${studentProgress.level} (${studentProgress.xp} XP)
- Model: Claude-3-${selectedModel}

**I can help you with:**
- 🔍 Code reviews and debugging
- 💡 Learning new concepts
- ⚡ Generating code examples
- 📚 Understanding lesson material
- 🤖 AI agent development strategies

What would you like to work on today?`,
        sender: 'claude',
        timestamp: new Date(),
        type: 'message'
      }
      
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Failed to start Claude session:', error)
      addErrorMessage('Failed to start Claude session. Please check your authentication.')
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const authUrl = await claudeMCP.startOAuth()
      window.location.href = authUrl
    } catch (error) {
      console.error('Login failed:', error)
      addErrorMessage('Failed to start authentication. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading || !sessionId) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await claudeMCP.sendClaudeMessage({
        message: currentMessage,
        model: `claude-3-${selectedModel}`,
        includeContext: true
      })

      const claudeMessage: Message = {
        id: `msg_${Date.now()}_claude`,
        content: response.content,
        sender: 'claude',
        timestamp: response.timestamp,
        model: response.model,
        tokens: response.usage.totalTokens,
        type: 'message'
      }

      setMessages(prev => [...prev, claudeMessage])
      loadUsageMetrics()
      
      // Check if Claude generated code and offer to insert it
      if (response.content.includes('```') && onCodeGenerated) {
        const codeMatch = response.content.match(/```(?:\w+)?\n([\s\S]*?)```/)
        if (codeMatch && codeMatch[1]) {
          setQuickActions(prev => ({ ...prev, generateCode: true }))
        }
      }

    } catch (error) {
      console.error('Message send failed:', error)
      addErrorMessage(`Failed to send message: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: 'code-review' | 'debug-help' | 'lesson-help' | 'generate-code') => {
    if (!sessionId || isLoading) return

    setIsLoading(true)
    
    try {
      let response: ClaudeResponse

      switch (action) {
        case 'code-review':
          if (!currentCode) {
            addErrorMessage('No code available for review. Please write some code first.')
            return
          }
          response = await claudeMCP.getCodeReview({
            code: currentCode,
            language: 'python',
            focus: 'ai-agents'
          })
          break
          
        case 'debug-help':
          response = await claudeMCP.getDebugHelp({
            code: currentCode || 'No code provided',
            error: 'Student needs debugging help',
            context: 'General debugging assistance requested'
          })
          break
          
        case 'lesson-help':
          response = await claudeMCP.getLessonHelp({
            question: 'Can you explain the current lesson and help me understand what I need to do?',
            difficulty: 'want-deeper'
          })
          break
          
        case 'generate-code':
          response = await claudeMCP.generateCode({
            prompt: 'Generate a helpful code example for the current lesson',
            language: 'python',
            style: 'educational',
            include_tests: false
          })
          break
          
        default:
          throw new Error('Unknown action')
      }

      const claudeMessage: Message = {
        id: `msg_${Date.now()}_${action}`,
        content: response.content,
        sender: 'claude',
        timestamp: response.timestamp,
        model: response.model,
        tokens: response.usage.totalTokens,
        type: action as any
      }

      setMessages(prev => [...prev, claudeMessage])
      loadUsageMetrics()

    } catch (error) {
      console.error(`Quick action ${action} failed:`, error)
      addErrorMessage(`Quick action failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addErrorMessage = (error: string) => {
    const errorMessage: Message = {
      id: `error_${Date.now()}`,
      content: `❌ **Error**: ${error}`,
      sender: 'claude',
      timestamp: new Date(),
      type: 'message'
    }
    setMessages(prev => [...prev, errorMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (message: Message) => {
    // Handle markdown-style formatting
    let content = message.content
    
    // Bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Code blocks
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => 
      `<div class="bg-slate-800 border border-green-500/30 rounded p-3 my-2 font-mono text-sm overflow-x-auto"><pre>${code.trim()}</pre></div>`
    )
    
    // Inline code
    content = content.replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 rounded text-green-300 font-mono text-sm">$1</code>')
    
    return content
  }

  const getModelIcon = (model?: string) => {
    if (model?.includes('opus')) return <Sparkles className="h-3 w-3 text-purple-400" />
    if (model?.includes('sonnet')) return <Zap className="h-3 w-3 text-blue-400" />
    if (model?.includes('haiku')) return <Activity className="h-3 w-3 text-green-400" />
    return <Bot className="h-3 w-3 text-gray-400" />
  }

  if (!isAuthenticated) {
    return (
      <div className={`bg-slate-800 border border-green-500/30 rounded-lg ${className}`}>
        <div className="p-6 text-center">
          <div className="mb-4">
            <Bot className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-300 mb-2">Claude Terminal</h3>
            <p className="text-green-300/70 text-sm mb-4">
              Connect your Claude subscription to access AI assistance directly in Agent Academy
            </p>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg mx-auto transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            <span>Connect Claude Subscription</span>
            <ExternalLink className="h-3 w-3" />
          </button>
          
          <p className="text-xs text-green-500/50 mt-3">
            Secure OAuth authentication • Your subscription, your data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800 border border-green-500/30 rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-green-500/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-green-400" />
            <span className="text-sm font-semibold text-green-300">Claude Terminal</span>
            <div className="flex items-center space-x-1 text-xs text-green-500/70">
              {getModelIcon(`claude-3-${selectedModel}`)}
              <span>{selectedModel}</span>
            </div>
          </div>
          
          {authStatus?.userInfo && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-green-400 capitalize">{authStatus.userInfo.plan}</span>
              {usageMetrics && (
                <span className="text-green-500/70">
                  {usageMetrics.totalMessages} msgs • {Math.round(usageMetrics.totalTokens / 1000)}k tokens
                </span>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-green-500/30 bg-slate-800/50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('code-review')}
            disabled={isLoading || !currentCode}
            className="flex items-center space-x-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-slate-700 text-blue-300 px-2 py-1 rounded text-xs transition-colors"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Review Code</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('debug-help')}
            disabled={isLoading}
            className="flex items-center space-x-1 bg-red-600/20 hover:bg-red-600/30 disabled:bg-slate-700 text-red-300 px-2 py-1 rounded text-xs transition-colors"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Debug Help</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('lesson-help')}
            disabled={isLoading}
            className="flex items-center space-x-1 bg-yellow-600/20 hover:bg-yellow-600/30 disabled:bg-slate-700 text-yellow-300 px-2 py-1 rounded text-xs transition-colors"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Lesson Help</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('generate-code')}
            disabled={isLoading}
            className="flex items-center space-x-1 bg-purple-600/20 hover:bg-purple-600/30 disabled:bg-slate-700 text-purple-300 px-2 py-1 rounded text-xs transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'claude' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-black" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600/20 text-blue-100 ml-8'
                  : 'bg-slate-700 text-green-100'
              }`}
            >
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
              />
              
              <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.tokens && (
                  <div className="flex items-center space-x-1">
                    {getModelIcon(message.model)}
                    <span>{message.tokens} tokens</span>
                  </div>
                )}
              </div>
            </div>
            
            {message.sender === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 text-black" />
            </div>
            <div className="bg-slate-700 rounded-lg p-3 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-green-400" />
              <span className="text-sm text-green-300">Dr. Maya is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-green-500/30">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Dr. Maya about your code, lesson, or AI development..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-green-500/30 rounded px-3 py-2 text-sm text-green-300 placeholder-green-500/50 focus:outline-none focus:border-green-400 disabled:bg-slate-800"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded transition-colors flex items-center space-x-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-green-500/70">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {sessionId && (
            <span>Session: {sessionId.split('_')[1]}</span>
          )}
        </div>
      </div>
    </div>
  )
}