'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Play, 
  Check, 
  Lightbulb, 
  BookOpen, 
  Code, 
  Target,
  Sparkles,
  MessageCircle,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronRight,
  Award,
  Brain,
  Compass,
  HelpCircle
} from 'lucide-react'

interface Challenge {
  id: number
  instruction: string
  hint: string
  correctCode: string
  explanation: string
  concepts: string[]
  resources?: {
    title: string
    content: string
    type?: string
  }[]
}

interface LessonProps {
  lessonId: number
  title: string
  description: string
  challenges: Challenge[]
  weekNumber: number
  onComplete: (xpEarned: number) => void
}

export default function EnhancedLessonInterface({ 
  lessonId, 
  title, 
  description, 
  challenges, 
  weekNumber,
  onComplete 
}: LessonProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [xpEarned, setXpEarned] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showNova, setShowNova] = useState(true)
  const [novaMessage, setNovaMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'challenge' | 'resources' | 'concepts'>('challenge')
  const [showSolution, setShowSolution] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)

  const currentChallengeData = challenges[currentChallenge]

  // Nova AI responses - more dynamic based on context
  const getNovaResponse = (type: string) => {
    const challenge = currentChallengeData
    
    switch(type) {
      case 'welcome':
        return "Hey there, Agent! I'm Nova, your AI coding companion. I'm here to help you master Python and complete your missions successfully!"
      
      case 'hint':
        if (hintLevel === 0) {
          return `Let me help you with this challenge. ${challenge.hint}`
        } else if (hintLevel === 1) {
          return `Here's another clue: Look at the example carefully. The pattern is: ${challenge.correctCode.split('=')[0]} = something`
        } else {
          return `Almost there! Remember to use quotes for text values and check your spelling carefully.`
        }
      
      case 'success':
        return "Excellent work! You're becoming quite the skilled agent. Ready for the next challenge?"
      
      case 'error':
        const codeHasEquals = code.includes('=')
        const codeHasQuotes = code.includes('"') || code.includes("'")
        if (!codeHasEquals) {
          return "I notice you're missing the equals sign (=). In Python, we use = to assign values to variables."
        } else if (!codeHasQuotes && currentChallenge !== 1) {
          return "Don't forget to use quotes around text values! Python needs quotes to know it's text."
        }
        return "Check your syntax carefully. Make sure your variable name matches exactly what's asked."
      
      case 'stuck':
        setShowSolution(true)
        return `No worries! Let me show you the solution step by step. The correct answer is: ${challenge.correctCode}. Try typing it yourself to understand how it works!`
      
      case 'encouragement':
        const progress = (completedChallenges.length / challenges.length) * 100
        if (progress === 0) {
          return "Starting is the hardest part - you're already doing great by being here!"
        } else if (progress < 50) {
          return `You're ${Math.round(progress)}% through! Keep going, you're building strong foundations!`
        } else {
          return `Amazing progress! You're ${Math.round(progress)}% complete. The finish line is in sight!`
        }
      
      default:
        return "I'm here to help! Click any of the buttons to get assistance."
    }
  }

  useEffect(() => {
    setNovaMessage(getNovaResponse('welcome'))
  }, [])

  const checkCode = () => {
    const trimmedCode = code.trim()
    
    // Enhanced validation logic
    if (currentChallenge === 2) { // developer_name challenge
      const isValidDeveloperName = trimmedCode.startsWith('developer_name = ') && 
                              (trimmedCode.includes('"') || trimmedCode.includes("'"))
      if (isValidDeveloperName) {
        setIsCorrect(true)
        setFeedback(currentChallengeData.explanation)
        setCompletedChallenges(prev => [...prev, currentChallenge])
        setXpEarned(prev => prev + 25)
        setNovaMessage(novaResponses.success)
      } else {
        setIsCorrect(false)
        setFeedback("Remember: developer_name = 'Your Name' (use quotes around text)")
        setNovaMessage(getNovaResponse('error'))
      }
      return
    }

    // Standard validation
    const isCorrect = trimmedCode.includes(currentChallengeData.correctCode)
    setIsCorrect(isCorrect)
    
    if (isCorrect) {
      setFeedback(currentChallengeData.explanation)
      setCompletedChallenges(prev => [...prev, currentChallenge])
      setXpEarned(prev => prev + 25)
      setNovaMessage(getNovaResponse('success'))
    } else {
      setFeedback("Not quite right. Check your syntax and try again!")
      setNovaMessage(getNovaResponse('error'))
    }
  }

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setCode('')
      setFeedback('')
      setIsCorrect(false)
      setShowHint(false)
      setShowResources(false)
      setShowSolution(false)
      setHintLevel(0)
      setActiveTab('challenge')
      setNovaMessage("Let's tackle the next challenge! Take your time to read through it carefully.")
    } else {
      // Lesson complete
      onComplete(xpEarned)
    }
  }

  const askNova = (type: string) => {
    if (type === 'hint') {
      setHintLevel(prev => Math.min(prev + 1, 2))
      setShowHint(true)
    }
    setNovaMessage(getNovaResponse(type))
    setShowNova(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-cyan-500/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              href={`/mission/operation-beacon/week-${weekNumber}`}
              className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Week {weekNumber}</span>
            </Link>
            
            <div className="h-8 w-px bg-cyan-500/30"></div>
            
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Target className="h-6 w-6 text-cyan-400" />
                <span>Lesson {lessonId}: {title}</span>
              </h1>
              <p className="text-gray-300 mt-1">{description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Progress */}
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400 flex items-center">
                <Zap className="h-5 w-5 mr-1" />
                {xpEarned} XP
              </div>
              <div className="text-sm text-gray-300">
                {completedChallenges.length}/{challenges.length} Complete
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-32">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Sidebar - Nova AI & Resources */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Nova AI Assistant */}
            <div className={`bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 transition-all duration-300 ${showNova ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Nova AI</h3>
                    <p className="text-xs text-purple-300">Your Coding Companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNova(!showNova)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  {showNova ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {showNova && (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="h-5 w-5 text-purple-400 mt-0.5" />
                      <p className="text-sm text-gray-200 leading-relaxed">{novaMessage}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => askNova('hint')}
                      className="flex items-center space-x-2 px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/30 rounded-lg text-yellow-400 text-xs font-medium transition-colors"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>Hint</span>
                    </button>
                    
                    <button
                      onClick={() => askNova('encouragement')}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 rounded-lg text-green-400 text-xs font-medium transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Encourage</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Compass className="h-5 w-5 text-cyan-400 mr-2" />
                Quick Help
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-400/20 rounded-lg text-yellow-400 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Show Hint</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showHint ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => setShowResources(!showResources)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-400/20 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Resources</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showResources ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => askNova('stuck')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-400/20 rounded-lg text-purple-400 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>I'm Stuck</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            
            {/* Challenge Tabs */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex border-b border-white/10">
                {[
                  { id: 'challenge', label: 'Challenge', icon: Target },
                  { id: 'resources', label: 'Resources', icon: BookOpen },
                  { id: 'concepts', label: 'Concepts', icon: Brain }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'challenge' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">
                        Challenge {currentChallenge + 1} of {challenges.length}
                      </h2>
                      <div className="text-sm text-gray-400">Variables & Data Types</div>
                    </div>
                    
                    <p className="text-gray-200 leading-relaxed text-lg">
                      {currentChallengeData.instruction}
                    </p>

                    {showHint && (
                      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-400/30 p-4">
                        <div className="flex items-start space-x-3">
                          <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="text-yellow-400 font-semibold mb-2">Hint {hintLevel > 0 ? `(Level ${hintLevel + 1})` : ''}:</h4>
                            <p className="text-yellow-200 text-sm">{currentChallengeData.hint}</p>
                            {hintLevel > 0 && (
                              <p className="text-yellow-300 text-xs mt-2">💡 Pro tip: Look for the pattern in the example code!</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showSolution && (
                      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-400/30 p-4 mt-4">
                        <div className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5" />
                          <div>
                            <h4 className="text-green-400 font-semibold mb-2">Solution:</h4>
                            <code className="text-green-300 font-mono bg-black/40 px-3 py-2 rounded block">
                              {currentChallengeData.correctCode}
                            </code>
                            <p className="text-green-200 text-xs mt-2">Try typing this yourself to understand how it works!</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Learning Resources</h2>
                    {currentChallengeData.resources ? (
                      <div className="space-y-3">
                        {currentChallengeData.resources.map((resource, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="font-semibold text-white mb-2">{resource.title}</h4>
                            <p className="text-gray-300 text-sm">{resource.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No additional resources for this challenge.</p>
                    )}
                  </div>
                )}

                {activeTab === 'concepts' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Key Concepts</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {currentChallengeData.concepts.map((concept, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-purple-300 font-medium">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Code Editor */}
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-green-500/30 overflow-hidden">
              <div className="bg-black/60 border-b border-green-500/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-bold text-green-400">Python Terminal</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="# Write your Python code here..."
                  className="w-full h-32 bg-black/60 border border-green-500/30 rounded-lg p-4 text-green-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCode('')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 rounded-lg text-red-400 text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={checkCode}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="h-5 w-5" />
                    <span>Run Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Feedback & Progress */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Feedback Panel */}
            {feedback && (
              <div className={`backdrop-blur-lg rounded-2xl p-6 border transition-all duration-500 ${
                isCorrect 
                  ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30' 
                  : 'bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-500/30'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isCorrect ? <Check className="h-6 w-6 text-white" /> : <Target className="h-6 w-6 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Success!' : 'Try Again'}
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed">{feedback}</p>
                    
                    {isCorrect && (
                      <button
                        onClick={nextChallenge}
                        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {currentChallenge < challenges.length - 1 ? (
                          <>
                            <ChevronRight className="h-5 w-5" />
                            <span>Next Challenge</span>
                          </>
                        ) : (
                          <>
                            <Award className="h-5 w-5" />
                            <span>Complete Lesson</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Challenge Progress */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 text-cyan-400 mr-2" />
                Progress
              </h3>
              
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      completedChallenges.includes(index)
                        ? 'bg-green-600/20 border-green-500/30 text-green-400'
                        : index === currentChallenge
                        ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-400'
                        : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      completedChallenges.includes(index)
                        ? 'bg-green-500 text-white'
                        : index === currentChallenge
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {completedChallenges.includes(index) ? <Check className="h-3 w-3" /> : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm">Challenge {index + 1}</p>
                      <p className="text-xs opacity-75">
                        {completedChallenges.includes(index) ? 'Complete' : index === currentChallenge ? 'Current' : 'Locked'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}