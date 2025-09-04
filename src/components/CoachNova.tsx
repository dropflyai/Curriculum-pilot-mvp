'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Bot, Send, X, Shield, Target, Eye, Zap, 
  MessageCircle, HelpCircle, Code, Trophy, 
  ChevronDown, ChevronUp, MinusCircle,
  Crosshair, Radio
} from 'lucide-react'
import { simulatedAI, generateAIConversation, getAIAnalytics } from '@/lib/simulated-ai'

interface Message {
  role: 'agent' | 'nova' | 'system'
  message: string
  timestamp: string
  emotion?: string
  classification?: 'intel' | 'tactical' | 'support' | 'mission-brief'
}

interface CoachNovaProps {
  studentName?: string
  lessonTitle?: string
  currentChallenge?: number
  totalChallenges?: number
  xpEarned?: number
  showAnalytics?: boolean
  isCommanderView?: boolean
  lessonContext?: {
    type: 'lesson' | 'challenge' | 'review'
    difficulty: 'recruit' | 'operative' | 'agent' | 'elite'
    mission?: string
  }
}

export default function CoachNova({ 
  studentName = 'Agent', 
  lessonTitle = 'Mission Training',
  currentChallenge = 0,
  totalChallenges = 4,
  xpEarned = 0,
  showAnalytics = false,
  isCommanderView = false,
  lessonContext = { type: 'lesson', difficulty: 'recruit' }
}: CoachNovaProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [novaMode, setNovaMode] = useState<'tactical' | 'supportive' | 'analytical'>('supportive')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Initialize Coach Nova personality based on context
  useEffect(() => {
    if (isCommanderView) {
      // Show commander analytics view conversation
      const demoConvo = generateCommanderAnalytics(studentName, lessonTitle)
      setMessages(demoConvo as Message[])
    } else {
      // Agent greeting based on lesson context
      const greeting = getContextualGreeting(lessonContext, studentName, lessonTitle)
      setMessages([greeting])
    }
  }, [studentName, lessonTitle, isCommanderView, lessonContext])
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getContextualGreeting = (context: typeof lessonContext, agent: string, lesson: string): Message => {
    const greetings = {
      recruit: {
        lesson: `Welcome to tactical training, ${agent}. I'm Coach Nova, your AI field advisor. Today's mission: ${lesson}. Stay sharp and follow protocols.`,
        challenge: `Agent ${agent}, you're entering the challenge zone. I'll be monitoring your progress and providing tactical support.`,
        review: `Excellent work, ${agent}. Let's debrief and analyze your mission performance.`
      },
      operative: {
        lesson: `Agent ${agent}, you've proven your basic skills. This advanced training will push your limits. I'll be here for strategic guidance.`,
        challenge: `High-stakes challenge detected. Agent ${agent}, deploy your advanced tactics. I'll provide intel as needed.`,
        review: `Mission analysis complete. Your operative-level performance shows promise, ${agent}.`
      },
      agent: {
        lesson: `${agent}, you're operating at field-agent level now. This mission requires precision and creativity. Let's proceed.`,
        challenge: `Elite challenge zone. ${agent}, trust your training. I'll provide tactical analysis and emergency support.`,
        review: `Outstanding field work, Agent ${agent}. Your problem-solving approach shows real expertise.`
      },
      elite: {
        lesson: `Elite operative ${agent}, this is classified-level training. I'll provide minimal guidance - you have the skills.`,
        challenge: `Black-ops level challenge. ${agent}, you're on point. I'll monitor and advise only when critical.`,
        review: `Exceptional performance, Elite Agent ${agent}. Your tactical execution is textbook perfect.`
      }
    }

    return {
      role: 'nova',
      message: greetings[context.difficulty][context.type] + " 🎯 Status: Online and ready for mission support.",
      timestamp: 'Mission Start',
      emotion: '🤖',
      classification: 'mission-brief'
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    // Add agent message
    const agentMessage: Message = {
      role: 'agent',
      message: inputValue,
      timestamp: 'Now',
      classification: 'intel'
    }
    setMessages(prev => [...prev, agentMessage])
    setInputValue('')
    setIsAnalyzing(true)
    
    // Simulate Coach Nova analysis and response
    setTimeout(() => {
      const context = {
        lessonTitle,
        studentName,
        currentCode: inputValue,
        errorType: detectErrorInMessage(inputValue)
      }
      
      const novaResponse = getNovaResponse(context, novaMode)
      setMessages(prev => [...prev, novaResponse])
      setIsAnalyzing(false)
    }, 1800) // Slightly longer for "analysis"
  }

  const getNovaResponse = (context: any, mode: string): Message => {
    const responses = {
      tactical: {
        intel: "Copy that, agent. Analyzing your intel... ",
        support: "Roger. Processing tactical options... ",
        solution: "Mission parameters suggest this approach: "
      },
      supportive: {
        intel: "I've got your back on this one. Let me see... ",
        support: "No agent left behind. Here's what I'm thinking: ",
        solution: "You're doing great work. Try this tactical adjustment: "
      },
      analytical: {
        intel: "Data received. Running threat analysis... ",
        support: "Computing optimal solution path... ",
        solution: "Analysis complete. Recommended action: "
      }
    }

    const baseResponse = simulatedAI.getResponse(context)
    const modeResponses = responses[mode as keyof typeof responses]
    
    // Adapt the AI response to Coach Nova's personality
    let novaMessage = ""
    
    switch (baseResponse.type) {
      case 'encouragement':
        novaMessage = modeResponses.support + baseResponse.message.replace(/You're|you're/g, "You're showing real agent potential. ")
        break
      case 'hint':
        novaMessage = modeResponses.intel + baseResponse.message.replace(/Try/g, "Deploy this tactic:")
        break
      case 'solution':
        novaMessage = modeResponses.solution + baseResponse.message.replace(/study/g, "analyze this intel")
        break
      default:
        novaMessage = modeResponses.intel + baseResponse.message
    }

    return {
      role: 'nova',
      message: novaMessage,
      timestamp: 'Now',
      emotion: baseResponse.emotion,
      classification: baseResponse.type === 'solution' ? 'tactical' : 'support'
    }
  }

  const detectErrorInMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('nameerror') || lowerMessage.includes('not defined')) return 'NameError'
    if (lowerMessage.includes('syntax')) return 'SyntaxError'
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help')) return 'help_request'
    return ''
  }

  const generateCommanderAnalytics = (agent: string, lesson: string) => [
    {
      role: 'nova',
      message: `Commander, Agent ${agent} is currently engaged in ${lesson}. Running continuous performance analysis.`,
      timestamp: '5 mins ago',
      classification: 'mission-brief'
    },
    {
      role: 'nova',
      message: "Tactical assessment: Agent shows strong problem-solving approach. Minimal intervention required.",
      timestamp: '3 mins ago', 
      classification: 'tactical'
    },
    {
      role: 'nova',
      message: "Intel update: Agent successfully deployed variables and conditional logic. Confidence level: High.",
      timestamp: '1 min ago',
      classification: 'intel'
    }
  ]

  if (showAnalytics) {
    const analytics = getAIAnalytics()
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 border-2 border-green-400/30"
           style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center font-mono">
            <Shield className="w-8 h-8 mr-3 text-green-400" />
            COACH NOVA - TACTICAL COMMAND CENTER
          </h3>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">OPERATIONAL</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/60 border border-green-400/30 p-4"
               style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
            <div className="text-3xl font-bold text-green-400 font-mono">{analytics.totalInteractions}</div>
            <div className="text-sm text-gray-300 font-mono">TACTICAL ASSISTS</div>
            <div className="text-xs text-green-400 mt-1 font-mono">↗ +23% this week</div>
          </div>
          <div className="bg-black/60 border border-blue-400/30 p-4"
               style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
            <div className="text-3xl font-bold text-blue-400 font-mono">{analytics.studentsSatisfaction}%</div>
            <div className="text-sm text-gray-300 font-mono">AGENT CONFIDENCE</div>
            <div className="text-xs text-gray-400 mt-1 font-mono">Mission Success Rate</div>
          </div>
          <div className="bg-black/60 border border-purple-400/30 p-4"
               style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
            <div className="text-3xl font-bold text-purple-400 font-mono">{analytics.studentsHelped}</div>
            <div className="text-sm text-gray-300 font-mono">ACTIVE AGENTS</div>
            <div className="text-xs text-gray-400 mt-1 font-mono">Under Command</div>
          </div>
          <div className="bg-black/60 border border-yellow-400/30 p-4"
               style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
            <div className="text-3xl font-bold text-yellow-400 font-mono">{analytics.successRate}%</div>
            <div className="text-sm text-gray-300 font-mono">MISSION SUCCESS</div>
            <div className="text-xs text-gray-400 mt-1 font-mono">First Attempt</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/40 border border-gray-600/30 p-4">
            <h4 className="text-lg font-semibold text-green-400 mb-3 font-mono">🎯 TACTICAL INTERVENTIONS</h4>
            <div className="space-y-2">
              {Object.entries(analytics.commonIssuesResolved).map(([issue, count]) => (
                <div key={issue} className="flex items-center justify-between">
                  <span className="text-gray-300 font-mono text-sm">{issue}</span>
                  <span className="text-green-400 font-bold font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black/40 border border-gray-600/30 p-4">
            <h4 className="text-lg font-semibold text-blue-400 mb-3 font-mono">📡 NOVA PERFORMANCE</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-mono text-sm">Response Time</span>
                <span className="text-green-400 font-mono">{analytics.averageResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-mono text-sm">Peak Operations</span>
                <span className="text-blue-400 font-mono">{analytics.peakUsageHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-mono text-sm">Avg Attempts to Solution</span>
                <span className="text-purple-400 font-mono">{analytics.averageAttemptsBeforeSolution}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-400/30">
          <div className="flex items-center space-x-2 text-green-400">
            <Target className="w-5 h-5" />
            <span className="font-semibold font-mono">MISSION IMPACT ASSESSMENT</span>
          </div>
          <p className="text-gray-300 text-sm mt-2 font-mono">
            Coach Nova has reduced commander oversight requirements by 73% while improving agent completion rates by 42%. 
            Agents report increased confidence and reduced tactical errors during field operations.
          </p>
        </div>
      </div>
    )
  }

  // Compact floating version
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-green-400/50 p-3 rounded-lg hover:border-green-400 transition-all shadow-lg"
          style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
        >
          <Shield className="w-6 h-6 text-green-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-mono whitespace-nowrap">
            NOVA
          </div>
        </button>
      </div>
    )
  }

  // Main interface
  return (
    <div className={`${isCommanderView ? 'w-full' : 'fixed bottom-4 right-4 w-96 z-50'} bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl border-2 border-green-400/30 ${!isCommanderView && 'max-h-[600px]'} flex flex-col overflow-hidden`}
         style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-b-2 border-green-400/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-green-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-bold font-mono text-lg">COACH NOVA</h3>
              <div className="flex items-center space-x-2 text-xs">
                <Eye className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-mono">TACTICAL AI • OPERATIONAL</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Nova Mode Selector */}
            <select
              value={novaMode}
              onChange={(e) => setNovaMode(e.target.value as typeof novaMode)}
              className="bg-black/60 border border-gray-600 text-green-400 text-xs font-mono px-2 py-1 rounded"
            >
              <option value="supportive">SUPPORT</option>
              <option value="tactical">TACTICAL</option>
              <option value="analytical">ANALYST</option>
            </select>
            
            {!isCommanderView && (
              <>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-green-400/80 hover:text-green-400 transition"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Mission Status Bar */}
        <div className="mt-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="text-blue-400">MISSION: {lessonTitle}</span>
            <span className="text-yellow-400">XP: +{xpEarned}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">PROGRESS:</span>
            <div className="w-20 h-2 bg-gray-700 rounded">
              <div 
                className="h-full bg-green-400 rounded transition-all"
                style={{ width: `${(currentChallenge / totalChallenges) * 100}%` }}
              />
            </div>
            <span className="text-green-400">{currentChallenge}/{totalChallenges}</span>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isExpanded ? 'max-h-[500px]' : 'max-h-[300px]'}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${
              msg.role === 'agent' 
                ? 'bg-blue-600/20 border border-blue-400/30 text-white' 
                : msg.role === 'system'
                ? 'bg-gray-700/40 border border-gray-500/30 text-gray-300 font-mono text-sm w-full'
                : 'bg-green-900/20 border border-green-400/30 text-white'
            } p-3 rounded-lg`}
            style={msg.role !== 'system' ? {
              clipPath: msg.role === 'agent' 
                ? 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' 
                : 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))'
            } : {}}>
              
              {msg.role === 'nova' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Crosshair className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs font-bold font-mono">
                    COACH NOVA • {msg.classification?.toUpperCase()}
                  </span>
                  {msg.emotion && <span className="text-lg">{msg.emotion}</span>}
                </div>
              )}
              
              {msg.role === 'agent' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-bold font-mono">AGENT {studentName.toUpperCase()}</span>
                </div>
              )}
              
              <div className={msg.role === 'system' ? 'whitespace-pre font-mono' : 'font-mono'}>
                {msg.message}
              </div>
              
              <div className={`text-xs mt-2 ${
                msg.role === 'agent' ? 'text-blue-300' : 'text-gray-400'
              } font-mono`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-green-900/20 border border-green-400/30 p-3 rounded-lg"
                 style={{clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 8px 100%, 0% calc(100% - 8px))'}}>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-bold font-mono">NOVA ANALYZING...</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      {!isCommanderView && (
        <div className="border-t-2 border-gray-700/50 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Request tactical support..."
              className="flex-1 bg-black/60 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 font-mono text-sm"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded hover:from-green-500 hover:to-emerald-500 transition-all"
              style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center font-mono">
            Coach Nova • Tactical AI Support • Agent Academy Command
          </div>
        </div>
      )}
    </div>
  )
}