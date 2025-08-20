'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Lightbulb, Code, Zap } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'student' | 'teacher'
  content: string
  timestamp: Date
  codeSnippet?: string
  isTyping?: boolean
}

interface AITeacherChatProps {
  lessonContext: string
  currentCode?: string
  onCodeSuggestion?: (code: string) => void
  studentProgress?: number
}

export default function AITeacherChat({ 
  lessonContext, 
  currentCode, 
  onCodeSuggestion,
  studentProgress = 0 
}: AITeacherChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'teacher',
      content: "👋 Hey there! I'm your AI coding instructor! I'm here to help you every step of the way. Ask me anything about programming, and I'll explain it in a way that makes sense to you!",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isAITyping, setIsAITyping] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate AI responses (in real app, this would call an AI API)
  const generateAIResponse = (studentMessage: string): string => {
    const message = studentMessage.toLowerCase()
    
    // Context-aware responses based on lesson and student message
    if (message.includes('confused') || message.includes('don\'t understand')) {
      return "No worries! Confusion is totally normal when learning to code. Let me break this down into smaller pieces. What specific part is tricky for you? I can explain it with a fun analogy! 🤔"
    }
    
    if (message.includes('error') || message.includes('bug')) {
      return "Ah, you found a bug! 🐛 Don't worry - even professional programmers deal with bugs every day. Let me help you debug this step by step. Can you show me the error message you're seeing?"
    }
    
    if (message.includes('help') || message.includes('stuck')) {
      return "I'm here to help! 💪 Being stuck just means you're learning something new. Let's tackle this together. Try this approach: break the problem into tiny steps. What's the very first thing your code needs to do?"
    }
    
    if (message.includes('variable')) {
      return "Great question about variables! 📦 Think of variables like labeled boxes. You put something inside (assign a value) and later you can look inside the box (use the variable). Want me to show you a cool example?"
    }
    
    if (message.includes('loop')) {
      return "Loops are like giving instructions to a robot! 🤖 'Do this 10 times' or 'Keep doing this until I say stop.' They're super powerful for avoiding repetitive code. Need a visual example?"
    }
    
    // Default encouraging response
    const encouragingResponses = [
      "That's a fantastic question! 🌟 You're thinking like a programmer already. Let me explain...",
      "I love that you're curious! 🔍 That shows you're really engaging with the material. Here's how it works...",
      "Excellent thinking! 🧠 You're asking exactly the right questions. Let me break this down...",
      "You're on the right track! 🚀 Keep asking questions like this - it's how you become a great programmer!"
    ]
    
    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add student message
    const studentMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'student',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, studentMessage])
    setInputMessage('')
    setIsAITyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'teacher',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsAITyping(false)
    }, 1500 + Math.random() * 1000) // Realistic typing delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What's a variable?",
    "How do loops work?", 
    "I'm confused about this part",
    "Can you explain this differently?",
    "Show me an example"
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`mb-4 w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          showChat 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        {showChat ? (
          <span className="text-white text-2xl">×</span>
        ) : (
          <div className="flex items-center justify-center text-white">
            <Bot className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {showChat && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center">
            <Bot className="h-6 w-6 mr-2 animate-pulse" />
            <div>
              <h3 className="font-bold">AI Teacher</h3>
              <p className="text-xs text-blue-100">Always here to help! 🤖</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.type === 'teacher' ? (
                      <Bot className="h-4 w-4 mr-1 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 mr-1 text-blue-100" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.type === 'teacher' ? 'AI Teacher' : 'You'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  {message.codeSnippet && (
                    <div className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs font-mono">
                      {message.codeSnippet}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isAITyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-xs opacity-75">AI Teacher is typing</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAITyping}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}