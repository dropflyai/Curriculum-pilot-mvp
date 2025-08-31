'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, Lightbulb, Code, BookOpen, Wifi, WifiOff } from 'lucide-react'
import { claudeAPI, StudentContext, ClaudeResponse, Message } from '@/lib/claude-api'
import { getAIConversationService } from '@/lib/ai-conversation-service'
import { useAuth } from '@/contexts/AuthContext'
import { AIConversation } from '@/lib/supabase'

interface AITutorPanelProps {
  currentLesson?: string
  currentSection?: string
  studentCode?: string
  isOpen?: boolean
  onToggle?: () => void
}

export default function AITutorPanel({ 
  currentLesson = 'Unknown Lesson',
  currentSection = 'Overview',
  studentCode = '',
  isOpen = false,
  onToggle
}: AITutorPanelProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [panelWidth, setPanelWidth] = useState(400) // Default width in pixels
  const [apiStatus, setApiStatus] = useState(claudeAPI.getStatus())
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const conversationService = getAIConversationService()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens and initialize conversation
  useEffect(() => {
    if (isOpen && user) {
      setTimeout(() => inputRef.current?.focus(), 100)
      initializeConversation()
    }
  }, [isOpen, currentLesson, currentSection])

  // Initialize or get existing conversation
  const initializeConversation = async () => {
    if (!user?.id) return

    try {
      const conversation = await conversationService.getOrCreateActiveConversation(
        user.id,
        currentLesson, // Using lesson title as ID for now
        currentLesson,
        currentSection
      )
      
      if (conversation) {
        setCurrentConversation(conversation)
        
        // Load existing messages if conversation exists
        const existingMessages = await conversationService.getConversationMessages(conversation.id)
        
        // Convert AIMessage format to our Message format
        const convertedMessages: Message[] = existingMessages.map(msg => ({
          id: msg.id,
          type: msg.type === 'teacher_intervention' ? 'ai' : msg.type,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          context: msg.student_code ? {
            lessonId: currentLesson,
            lessonTitle: currentLesson,
            currentSection: currentSection,
            studentCode: msg.student_code
          } : undefined
        }))
        
        if (convertedMessages.length > 0) {
          setMessages(convertedMessages)
        } else {
          // Only show welcome message if no existing messages
          initializeWelcomeMessage()
        }
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error)
      initializeWelcomeMessage()
    }
  }

  const initializeWelcomeMessage = () => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hi! I'm your AI coding tutor! 🤖✨ I'm here to help you learn and understand concepts, not to give you direct answers. 

I can see you're working on **${currentLesson}** in the **${currentSection}** section. What would you like help with today?

Feel free to ask about:
• Concepts you don't understand
• Why your code isn't working  
• Programming best practices
• Real-world examples of what you're learning`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }


  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentConversation) return

    const messageContent = inputMessage.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      context: {
        lessonId: currentLesson,
        lessonTitle: currentLesson,
        currentSection: currentSection,
        studentCode: studentCode
      }
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Save user message to database
    try {
      await conversationService.addMessage(
        currentConversation.id,
        'user',
        messageContent,
        studentCode
      )
    } catch (error) {
      console.error('Failed to save user message:', error)
    }

    try {
      // Build context for Claude API
      const context: StudentContext = {
        lessonId: currentLesson,
        lessonTitle: currentLesson,
        currentSection: currentSection,
        studentCode: studentCode,
        conversationHistory: messages.slice(-4) // Last 4 messages for context
      }

      // Get response from Claude API
      const claudeResponse = await claudeAPI.getClaudeResponse(messageContent, context)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: claudeResponse.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      // Save AI message to database
      try {
        await conversationService.addMessage(
          currentConversation.id,
          'ai',
          claudeResponse.content,
          studentCode,
          claudeResponse.flagForTeacher || false
        )
      } catch (error) {
        console.error('Failed to save AI message:', error)
      }

      // Handle teacher flags if needed
      if (claudeResponse.flagForTeacher) {
        console.log('🚨 Teacher notification: Student may need additional help')
        // Update conversation status to needs_help
        try {
          await conversationService.updateConversationStatus(currentConversation.id, 'needs_help')
        } catch (error) {
          console.error('Failed to update conversation status:', error)
        }
      }

    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again or ask your teacher for help! 🤔',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Trigger Button (when panel is closed)
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-6 bottom-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50"
      >
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">Ask Your AI Tutor</span>
          <MessageCircle className="h-4 w-4" />
        </div>
      </button>
    )
  }

  // Side Panel (when open)
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={onToggle}
      />
      
      {/* Side Panel */}
      <div 
        className="fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
        style={{ width: `min(${panelWidth}px, 90vw)` }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg">AI Tutor</h3>
              <p className="text-blue-100 text-sm">Here to guide your learning!</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Context Bar */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{currentLesson}</span>
              </div>
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>{currentSection}</span>
              </div>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center gap-1 text-xs">
              {apiStatus.configured ? (
                <>
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Claude AI</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-orange-600" />
                  <span className="text-orange-600">Demo Mode</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Avatar */}
                <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' ? (
                    <Bot className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-purple-600" />
                  )}
                  <span className="text-xs text-gray-500">
                    {message.type === 'ai' ? 'AI Tutor' : 'You'} • {formatTime(message.timestamp)}
                  </span>
                </div>
                
                {/* Message bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin">
                    <Bot className="h-4 w-4" />
                  </div>
                  <span className="text-sm">AI Tutor is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or describe what you're stuck on..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Lightbulb className="h-3 w-3" />
            <span>I'll help you learn by asking questions and giving hints!</span>
          </div>
        </div>
      </div>
    </>
  )
}