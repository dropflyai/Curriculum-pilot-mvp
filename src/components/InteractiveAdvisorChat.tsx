'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, User, Bot, Settings, Share2, RotateCcw } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  category?: string
}

interface AdvisorPersonality {
  name: string
  emoji: string
  style: string
  greeting: string
}

const personalities: AdvisorPersonality[] = [
  {
    name: "StudyBuddy",
    emoji: "🎓",
    style: "encouraging",
    greeting: "Hey there! I'm StudyBuddy, and I'm here to help you succeed! What's on your mind today?"
  },
  {
    name: "WisdomBot",
    emoji: "🧠",
    style: "wise",
    greeting: "Greetings, student! I am WisdomBot, your academic companion. How may I assist your learning journey?"
  },
  {
    name: "CheerMaster",
    emoji: "🎉",
    style: "energetic",
    greeting: "YES! 🚀 CheerMaster here and I am SO excited to help you CRUSH your goals today! What's up?!"
  },
  {
    name: "CalmSage",
    emoji: "🧘",
    style: "calm",
    greeting: "Hello, dear student. I'm CalmSage, here to provide peaceful guidance. What would you like to explore together?"
  }
]

interface InteractiveAdvisorChatProps {
  onProgress: (completed: boolean) => void
  onMessagesGenerated: (count: number) => void
}

export default function InteractiveAdvisorChat({ onProgress, onMessagesGenerated }: InteractiveAdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0])
  const [showSettings, setShowSettings] = useState(false)
  const [conversationStats, setConversationStats] = useState({
    messagesExchanged: 0,
    categoriesUsed: new Set<string>(),
    helpfulness: 0
  })
  const [shareUrl, setShareUrl] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Enhanced AI response system
  const generateAdvice = (message: string, personality: AdvisorPersonality): { content: string; category: string } => {
    const msg = message.toLowerCase()
    
    // Enhanced keyword detection
    const keywordCategories = {
      encouragement: ['failed', 'stupid', 'can\'t', 'hate', 'frustrated', 'give up', 'terrible', 'awful', 'worst', 'hopeless'],
      study_tips: ['test', 'exam', 'homework', 'study', 'learn', 'remember', 'focus', 'concentrate', 'review'],
      motivation: ['tired', 'lazy', 'procrastinating', 'netflix', 'don\'t want', 'unmotivated', 'bored', 'overwhelmed'],
      goal_setting: ['want to', 'goal', 'plan', 'future', 'improve', 'better', 'achieve', 'succeed'],
      test_anxiety: ['nervous', 'scared', 'anxiety', 'panic', 'worry', 'stress', 'fear'],
      time_management: ['time', 'deadline', 'schedule', 'organize', 'late', 'rush', 'busy', 'management']
    }

    // Score each category
    const scores: Record<string, number> = {}
    for (const [category, keywords] of Object.entries(keywordCategories)) {
      scores[category] = keywords.reduce((count, keyword) => {
        return count + (msg.includes(keyword) ? 1 : 0)
      }, 0)
    }

    const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b) || 'encouragement'

    // Personality-based responses
    const responseTemplates: Record<string, Record<string, string[]>> = {
      encouraging: {
        encouragement: [
          "Hey, I hear you're having a rough time. That's totally normal! Every expert was once a beginner who felt exactly like you do right now. 💪",
          "Feeling frustrated? That means your brain is growing! It's like mental exercise - it's supposed to feel challenging. You're stronger than you think! 🧠✨",
          "I notice you're being hard on yourself. Let me remind you: mistakes are just proof that you're trying. That's actually pretty awesome! 🌟"
        ],
        study_tips: [
          "Okay, let's tackle this study challenge together! Try the 25-5 rule: 25 minutes focused study, 5 minute break. Your brain loves this rhythm! ⏰",
          "Here's a game-changer: teach the concept out loud to an imaginary student. If you can explain it, you understand it! 🗣️",
          "Pro tip from successful students: create a 'study playlist' and only use it for homework. Your brain will start focusing automatically! 🎵"
        ],
        motivation: [
          "I totally get it - motivation comes and goes like weather. Here's the secret: start with just ONE tiny thing. Success builds momentum! ⚡",
          "Netflix calling your name? Try this: commit to just 15 minutes of work first. Often starting is the hardest part! 📺➡️📚",
          "Your future self is counting on present you! What would Tomorrow-You thank you for doing right now? 🚀"
        ],
        goal_setting: [
          "I love that you want to improve! Let's break that big goal into bite-sized pieces. What's ONE thing you could do today? 🎯",
          "SMART goals work: Specific, Measurable, Achievable, Relevant, Time-bound. Let's turn your dream into a plan! 📊",
          "Goals without deadlines are just wishes. When do you want to achieve this by? Let's make it real! ⏰"
        ],
        test_anxiety: [
          "Test anxiety is your brain trying to protect you - it means you care! Let's channel that energy into preparation power. 🛡️",
          "Before the test: take 3 deep breaths, remind yourself 'I've prepared, I've got this,' and trust your knowledge. 💨",
          "Remember: the test doesn't measure your worth as a person. It's just a snapshot of what you know right now. 📸"
        ],
        time_management: [
          "Time feels overwhelming when everything seems urgent. Let's prioritize: what MUST be done today vs what CAN wait? 📅",
          "Try time-blocking: assign specific hours to specific tasks. Your brain loves structure! 🗓️",
          "Running out of time? Focus on progress, not perfection. A good job done is better than a perfect job never finished! ⏱️"
        ]
      },
      wise: {
        encouragement: [
          "Young scholar, wisdom comes through struggle. Every challenge you face today builds the resilience you'll need tomorrow. 🏛️",
          "In ancient times, students faced similar trials. Your difficulties are not unique, nor are they permanent. Persevere. 📜",
          "The path of knowledge is not smooth, but it leads to heights worth reaching. Trust in your journey. ⛰️"
        ],
        study_tips: [
          "The Socratic method suggests questioning your understanding: Can you explain this concept to a child? True mastery emerges through teaching. 🤔",
          "Ancient scholars knew: spaced repetition builds lasting knowledge. Review material at increasing intervals. 📚",
          "Create connections between new knowledge and existing understanding. The mind retains what it can relate to. 🔗"
        ]
        // ... more personality-based responses
      },
      energetic: {
        encouragement: [
          "OH NO NO NO! 💥 You are NOT giving up! You know what? EVERY champion has felt exactly like you do right now! That's what makes champions! 🏆",
          "LISTEN TO ME! 🔥 Your brain is literally growing new connections right now! Those struggles? That's your neurons BUILDING STRENGTH! 🧠💪",
          "ARE YOU KIDDING ME?! You're worried about making mistakes?! MISTAKES ARE YOUR BRAIN'S WAY OF SAYING 'I'M LEARNING!' Keep going! 🎯"
        ],
        study_tips: [
          "BOOM! 💥 Study hack coming your way! Set a timer for 25 minutes and GO ALL OUT! Then celebrate with a 5-minute victory dance! 💃",
          "HERE'S WHAT SUCCESSFUL STUDENTS DO! 🚀 They explain concepts while walking around the room! Movement + learning = UNSTOPPABLE! 🚶‍♀️",
          "SECRET WEAPON ALERT! 🎯 Create acronyms for everything! Your brain LOVES patterns and will remember them FOREVER! 🧠✨"
        ]
        // ... more energetic responses
      },
      calm: {
        encouragement: [
          "I sense your frustration, and it's completely understandable. Like a river that finds its way around rocks, you too will navigate these challenges. 🌊",
          "Breathe deeply. In this moment, you are exactly where you need to be on your learning journey. Trust the process. 🌸",
          "Difficulties are like clouds - they appear overwhelming but always pass. Your resilience is your sunshine. ☀️"
        ],
        study_tips: [
          "Create a peaceful study sanctuary. Light, space, and tranquility help the mind absorb knowledge naturally. 🕯️",
          "Study in harmony with your natural rhythms. Are you a morning lark or evening owl? Honor your energy. 🦉",
          "Let concepts settle like sediment in still water. Understanding often comes in quiet moments between study sessions. 🌊"
        ]
        // ... more calm responses
      }
    }

    const responses = responseTemplates[personality.style]?.[topCategory] || responseTemplates.encouraging[topCategory]
    const response = responses[Math.floor(Math.random() * responses.length)]

    return { content: response, category: topCategory }
  }

  // Initialize with greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting',
      type: 'bot',
      content: selectedPersonality.greeting,
      timestamp: new Date(),
      category: 'greeting'
    }
    setMessages([greeting])
  }, [selectedPersonality])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Generate shareable URL
  useEffect(() => {
    if (messages.length > 5) {
      const chatId = `chat-${Date.now()}`
      setShareUrl(`${window.location.origin}/chat/${chatId}`)
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const { content: botResponse, category } = generateAdvice(inputText, selectedPersonality)
    
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
      category
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)

    // Update stats
    setConversationStats(prev => ({
      messagesExchanged: prev.messagesExchanged + 1,
      categoriesUsed: new Set([...prev.categoriesUsed, category]),
      helpfulness: Math.min(prev.helpfulness + 1, 10)
    }))

    // Trigger progress updates
    onMessagesGenerated(messages.length + 2)
    if (messages.length >= 8) {
      onProgress(true)
    }
  }

  const resetChat = () => {
    const greeting: ChatMessage = {
      id: 'greeting-reset',
      type: 'bot',
      content: selectedPersonality.greeting,
      timestamp: new Date(),
      category: 'greeting'
    }
    setMessages([greeting])
    setConversationStats({
      messagesExchanged: 0,
      categoriesUsed: new Set(),
      helpfulness: 0
    })
  }

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    // Add toast notification here
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{selectedPersonality.emoji}</div>
          <div>
            <h2 className="text-xl font-bold text-white">{selectedPersonality.name}</h2>
            <p className="text-purple-100 text-sm">Your AI Study Companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Settings className="h-5 w-5 text-white" />
          </button>
          {shareUrl && (
            <button
              onClick={copyShareUrl}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          )}
          <button
            onClick={resetChat}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">Choose Your Advisor's Personality</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {personalities.map((personality) => (
              <button
                key={personality.name}
                onClick={() => {
                  setSelectedPersonality(personality)
                  setShowSettings(false)
                }}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedPersonality.name === personality.name
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-xl mb-1">{personality.emoji}</div>
                <div className="font-medium text-sm">{personality.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-gray-800 p-3 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-6">
          <span>Messages: {conversationStats.messagesExchanged}</span>
          <span>Topics Covered: {conversationStats.categoriesUsed.size}</span>
          <span>Helpfulness: {"⭐".repeat(Math.min(conversationStats.helpfulness, 5))}</span>
        </div>
        {shareUrl && (
          <div className="text-green-400 text-xs">
            ✅ Chat ready to share with friends!
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{selectedPersonality.emoji}</span>
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <span className="text-sm">{selectedPersonality.emoji}</span>
              </div>
              <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Tell me what's on your mind about school..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
        
        {messages.length < 3 && (
          <div className="mt-3">
            <p className="text-gray-400 text-xs mb-2">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {["I'm stressed about my math test", "I can't focus on homework", "I want better grades but don't know how"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(suggestion)}
                  className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}