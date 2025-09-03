'use client'

import { useState, useRef, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database, TutorQuery, TutorPolicy } from '@/lib/supabase/types'
import { Send, Bot, User, AlertCircle, Sparkles, Code, HelpCircle, Zap } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  assistLevel?: 'HINT' | 'SNIPPET' | 'EXAMPLE' | 'EXPLANATION'
  decision?: 'ALLOW' | 'SOFT_BLOCK' | 'HARD_BLOCK' | 'ESCALATE'
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm Coach Nova, your AI coding assistant! I'm here to help you learn and grow as a programmer. What would you like to work on today?",
      timestamp: new Date(),
      assistLevel: 'EXPLANATION'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [policy, setPolicy] = useState<TutorPolicy | null>(null)
  const [weekNumber, setWeekNumber] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadTutorPolicy()
  }, [weekNumber])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadTutorPolicy() {
    try {
      // Get current class and week policy
      const { data } = await supabase
        .from('tutor_policies')
        .select('*')
        .eq('week_no', weekNumber)
        .single()
      
      if (data) setPolicy(data)
    } catch (error) {
      console.error('Error loading tutor policy:', error)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // In production, this would call your AI API
      // For now, we'll simulate a response based on the policy
      const response = await simulateTutorResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        assistLevel: response.assistLevel,
        decision: response.decision
      }

      setMessages(prev => [...prev, assistantMessage])

      // Log the query
      const { data: { user } } = await supabase.auth.getUser()
      if (user && policy) {
        await supabase.from('tutor_queries').insert({
          class_id: policy.class_id,
          student_id: user.id,
          policy_id: policy.id,
          prompt_text: input,
          decision: response.decision,
          reason: response.reason,
          resolved_topics: ['python', 'basics'] // Would be extracted by NLP
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  async function simulateTutorResponse(prompt: string) {
    // Simulate different types of responses based on the prompt
    const lowerPrompt = prompt.toLowerCase()
    
    // Check for blocked patterns
    if (lowerPrompt.includes('write the entire') || lowerPrompt.includes('give me the full')) {
      return {
        content: "I can't provide complete solutions, but I'd be happy to help you understand the concepts! Let's break this down step by step. What specific part are you struggling with?",
        assistLevel: 'EXPLANATION' as const,
        decision: 'SOFT_BLOCK' as const,
        reason: 'Requested full solution'
      }
    }

    // Check for hints
    if (lowerPrompt.includes('hint') || lowerPrompt.includes('help')) {
      return {
        content: "💡 Here's a hint: Think about how you can use a loop to iterate through your data. Remember, Python's `for` loop is perfect for going through lists. Try starting with:\n\n```python\nfor item in my_list:\n    # What should happen to each item?\n```\n\nWhat do you think should go inside the loop?",
        assistLevel: 'HINT' as const,
        decision: 'ALLOW' as const,
        reason: 'Hint request'
      }
    }

    // Check for debugging help
    if (lowerPrompt.includes('error') || lowerPrompt.includes('bug') || lowerPrompt.includes('not working')) {
      return {
        content: "🐛 Let's debug this together! Can you tell me:\n1. What error message are you seeing?\n2. What were you expecting to happen?\n3. What actually happened?\n\nOften, reading the error message carefully gives us clues about what went wrong.",
        assistLevel: 'EXPLANATION' as const,
        decision: 'ALLOW' as const,
        reason: 'Debugging assistance'
      }
    }

    // Check for concept questions
    if (lowerPrompt.includes('what is') || lowerPrompt.includes('how does') || lowerPrompt.includes('explain')) {
      return {
        content: "Great question! Let me explain this concept:\n\nIn Python, variables are like labeled boxes where you can store information. For example:\n```python\nname = 'Nova'  # Storing text\nage = 5        # Storing a number\n```\n\nYou can then use these variables later in your program. Does this help clarify things?",
        assistLevel: 'EXPLANATION' as const,
        decision: 'ALLOW' as const,
        reason: 'Concept explanation'
      }
    }

    // Default response
    return {
      content: "That's a great question! Based on what we're learning this week, I'd suggest focusing on the fundamentals first. What specific concept from this week's lesson are you trying to apply here?",
      assistLevel: 'EXPLANATION' as const,
      decision: 'ALLOW' as const,
      reason: 'General guidance'
    }
  }

  const getAssistLevelBadge = (level?: string) => {
    switch(level) {
      case 'HINT':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Hint</span>
      case 'SNIPPET':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Code Snippet</span>
      case 'EXAMPLE':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Example</span>
      case 'EXPLANATION':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Explanation</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Coach Nova</h1>
              <p className="text-purple-200 text-sm">Your AI Coding Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Policy Status */}
            <div className="bg-white/10 rounded-lg px-3 py-1 border border-white/20">
              <span className="text-xs text-purple-200">Week {weekNumber}</span>
            </div>
            {policy && (
              <div className={`rounded-lg px-3 py-1 border ${
                policy.mode === 'LEARN' 
                  ? 'bg-green-500/20 border-green-400/50 text-green-400'
                  : policy.mode === 'ASSESS'
                  ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
                  : 'bg-red-500/20 border-red-400/50 text-red-400'
              }`}>
                <span className="text-xs font-medium">{policy.mode} Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-2">
                    {message.role !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : message.role === 'system'
                          ? 'bg-red-500/20 border border-red-400/50 text-red-300'
                          : 'bg-white/10 border border-white/20 text-white'
                      }`}
                    >
                      {message.role === 'assistant' && message.assistLevel && (
                        <div className="mb-2">{getAssistLevelBadge(message.assistLevel)}</div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.decision === 'SOFT_BLOCK' && (
                        <div className="mt-2 text-xs text-yellow-400 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Guided response - full solution not provided
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about coding..."
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
              disabled={loading || policy?.mode === 'OFF'}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || policy?.mode === 'OFF'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-6 py-3 font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setInput("Can you give me a hint?")}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-purple-200 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Get Hint</span>
            </button>
            <button
              onClick={() => setInput("I'm getting an error. Can you help?")}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-purple-200 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Debug Error</span>
            </button>
            <button
              onClick={() => setInput("Can you show me an example?")}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-purple-200 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
            >
              <Code className="w-3 h-3" />
              <span>Show Example</span>
            </button>
            <button
              onClick={() => setInput("Explain this concept")}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-purple-200 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Explain Concept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}