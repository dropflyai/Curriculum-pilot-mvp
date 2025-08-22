'use client'

import { useState, useEffect } from 'react'
import { AILesson, LessonMode } from '@/lib/lesson-data'
import dynamic from 'next/dynamic'
import { BookOpen, Code, CheckSquare, HelpCircle, Award, Sparkles, Brain, Zap, Target, Clock, Play } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Dynamically import Pyodide code editor
const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Python Environment...</div>
})

const LearningModeSelector = dynamic(() => import('./LearningModeSelector'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Learning Options...</div>
})

interface PythonLessonViewerProps {
  lesson: AILesson
  onLessonComplete: (progress: number) => void
  onQuizComplete?: (score: number) => void
  onCodeExecution?: () => void
}

interface QuizState {
  answers: Record<number, number>
  submitted: boolean
  score: number
}

interface ChecklistState {
  completed: Record<number, boolean>
}

interface TestState {
  completed: Record<string, boolean>
}

export default function PythonLessonViewer({ lesson, onLessonComplete, onQuizComplete, onCodeExecution }: PythonLessonViewerProps) {
  const [currentTab, setCurrentTab] = useState<'overview' | 'learn' | 'code' | 'tests' | 'quiz' | 'checklist' | 'submit'>('overview')
  const [quizState, setQuizState] = useState<QuizState>({ answers: {}, submitted: false, score: 0 })
  const [checklistState, setChecklistState] = useState<ChecklistState>({ completed: {} })
  const [testState, setTestState] = useState<TestState>({ completed: {} })
  const [submissionText, setSubmissionText] = useState('')
  const [codeExecuted, setCodeExecuted] = useState(false)

  // Progress persistence utilities
  const getProgressKey = () => `lesson-progress-${lesson.id}`
  
  const saveProgress = () => {
    const progress = {
      currentTab,
      testState,
      quizState,
      checklistState,
      submissionText,
      codeExecuted,
      timestamp: Date.now()
    }
    localStorage.setItem(getProgressKey(), JSON.stringify(progress))
  }

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(getProgressKey())
      if (saved) {
        const progress = JSON.parse(saved)
        // Only restore if saved within last 7 days
        if (Date.now() - progress.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setTestState(progress.testState || { completed: {} })
          setQuizState(progress.quizState || { answers: {}, submitted: false, score: 0 })
          setChecklistState(progress.checklistState || { completed: {} })
          setSubmissionText(progress.submissionText || '')
          setCodeExecuted(progress.codeExecuted || false)
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  // Get current mode data
  const currentModeData = lesson.modes[0]

  // Auto-populate checklist based on completed tasks
  const updateChecklistFromProgress = () => {
    const newCompleted: Record<number, boolean> = {}
    
    // Mark items complete based on progress
    if (currentTab !== 'learn' && currentTab !== 'overview') {
      newCompleted[0] = true // Viewed learn content
    }
    
    if (codeExecuted) {
      newCompleted[1] = true // Executed code
    }
    
    if (testState.completed['responses_added']) {
      newCompleted[2] = true // Enhanced responses
    }
    
    if (testState.completed['new_category']) {
      newCompleted[3] = true // Added new category
    }
    
    if (testState.completed['personal_test']) {
      newCompleted[4] = true // Tested with personal messages
    }

    // Update checklist state if there are changes
    const hasChanges = Object.keys(newCompleted).some(key => 
      newCompleted[parseInt(key)] !== checklistState.completed[parseInt(key)]
    )
    
    if (hasChanges) {
      setChecklistState(prev => ({
        ...prev,
        completed: { ...prev.completed, ...newCompleted }
      }))
    }
  }

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0
    let total = 6 // learn, code, tests, quiz, checklist, submit

    // Learn tab is automatically completed when visited
    if (currentTab !== 'learn' && currentTab !== 'overview') completed += 1

    // Code tab completed when code is executed
    if (codeExecuted) completed += 1

    // Tests completed when all tests are marked done
    const testsCompleted = currentModeData.tests_ui.every(test => testState.completed[test.id])
    if (testsCompleted) completed += 1

    // Quiz completed when submitted
    if (quizState.submitted) completed += 1

    // Checklist completed when all items checked
    const checklistCompleted = currentModeData.checklist.every((_, index) => checklistState.completed[index])
    if (checklistCompleted) completed += 1

    // Submission completed when text is provided
    if (submissionText.length > 50) completed += 1

    return (completed / total) * 100
  }

  // Load progress on component mount
  useEffect(() => {
    loadProgress()
  }, [])

  // Auto-update checklist and save progress when state changes
  useEffect(() => {
    updateChecklistFromProgress()
    saveProgress()
    const progress = calculateProgress()
    onLessonComplete(progress)
  }, [currentTab, testState, quizState, checklistState, submissionText, codeExecuted])

  // Auto-progress to rewards when all checklist items are complete
  useEffect(() => {
    const allChecklistComplete = lesson.modes[0].checklist.every((_, index) => 
      checklistState.completed[index]
    )
    
    if (allChecklistComplete && currentTab === 'checklist') {
      // Auto-advance to submit tab after a short delay
      setTimeout(() => {
        setCurrentTab('submit')
      }, 1500)
    }
  }, [checklistState, currentTab, lesson.modes])

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answerIndex }
    }))
  }

  const handleQuizSubmit = () => {
    let correct = 0
    lesson.modes[0].quiz.questions.forEach((question, index) => {
      if (quizState.answers[index] === question.answer_index) {
        correct++
      }
    })
    const score = (correct / lesson.modes[0].quiz.questions.length) * 100
    setQuizState(prev => ({ ...prev, submitted: true, score }))
    
    // Notify parent component about quiz completion
    if (onQuizComplete) {
      onQuizComplete(score)
    }
  }

  const handleTestComplete = (testId: string) => {
    setTestState(prev => ({
      ...prev,
      completed: { ...prev.completed, [testId]: true }
    }))
  }

  const handleChecklistToggle = (index: number) => {
    setChecklistState(prev => ({
      ...prev,
      completed: { ...prev.completed, [index]: !prev.completed[index] }
    }))
  }

  const handleCodeExecution = () => {
    setCodeExecuted(true)
    if (onCodeExecution) {
      onCodeExecution()
    }
  }

  const missions = [
    { 
      id: 'learn', 
      title: 'Knowledge Quest', 
      subtitle: 'Learn Python & AI Concepts',
      icon: BookOpen, 
      color: 'emerald', 
      emoji: '🎓',
      difficulty: 'Beginner',
      estimatedTime: '20 min',
      xpReward: 150,
      description: 'Explore the fundamentals of Python programming and AI-powered chatbots',
      objectives: ['Learn Python basics', 'Understand AI chatbots', 'Master key concepts']
    },
    { 
      id: 'code', 
      title: 'Python Laboratory', 
      subtitle: 'Build Your AI Advisor',
      icon: Code, 
      color: 'blue', 
      emoji: '🐍',
      difficulty: 'Intermediate',
      estimatedTime: '25 min',
      xpReward: 250,
      description: 'Write Python code to create an intelligent school advisor chatbot',
      objectives: ['Set up Python environment', 'Code the advisor logic', 'Test your chatbot']
    },
    { 
      id: 'tests', 
      title: 'Enhancement Lab', 
      subtitle: 'Improve Your Creation',
      icon: Target, 
      color: 'orange', 
      emoji: '🔧',
      difficulty: 'Intermediate',
      estimatedTime: '15 min',
      xpReward: 200,
      description: 'Enhance your advisor with new features and capabilities',
      objectives: ['Add more responses', 'Create new categories', 'Test enhancements']
    },
    { 
      id: 'quiz', 
      title: 'Python Mastery', 
      subtitle: 'Test Your Knowledge',
      icon: HelpCircle, 
      color: 'purple', 
      emoji: '🧠',
      difficulty: 'Advanced',
      estimatedTime: '10 min',
      xpReward: 150,
      description: 'Demonstrate your understanding of Python and AI concepts',
      objectives: ['Answer concept questions', 'Apply your knowledge', 'Score 80%+ to pass']
    },
    { 
      id: 'checklist', 
      title: 'Final Review', 
      subtitle: 'Complete Your Project',
      icon: CheckSquare, 
      color: 'pink', 
      emoji: '📋',
      difficulty: 'Easy',
      estimatedTime: '5 min',
      xpReward: 100,
      description: 'Review all your accomplishments and prepare for submission',
      objectives: ['Check all completed tasks', 'Verify code quality', 'Prepare final showcase']
    },
    { 
      id: 'submit', 
      title: 'Victory Ceremony', 
      subtitle: 'Claim Your Python Badge!',
      icon: Award, 
      color: 'yellow', 
      emoji: '🏆',
      difficulty: 'Celebration',
      estimatedTime: '2 min',
      xpReward: 300,
      description: 'Submit your Python project and earn your programming credentials!',
      objectives: ['Submit final project', 'Receive Python badge', 'Unlock next challenge']
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Lesson Header */}
      <div className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 rounded-2xl p-8 mb-8 border border-green-500/30 shadow-2xl overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute bottom-4 left-4 animate-bounce">
            <Code className="h-6 w-6 text-green-400" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
            <Brain className="h-12 w-12 text-blue-400 opacity-20" />
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {lesson.title}
            </h1>
            <div className="flex-1"></div>
            <div className="animate-pulse">
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <p className="text-green-200 text-lg mb-6 leading-relaxed">{lesson.description}</p>
        
          {/* Lesson Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Python Programming Journey 🐍
            </h3>
            <div className="bg-white/10 backdrop-blur-sm border border-green-500/30 px-6 py-4 rounded-xl">
              <p className="text-green-100 font-medium mb-3">By the end of this lesson, you will be able to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Build an AI-powered chatbot using Python programming</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Understand natural language processing and sentiment analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Implement keyword matching and response generation systems</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Create educational technology that helps students succeed</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Design AI systems with ethical boundaries and safety features</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Test and enhance chatbot functionality through iteration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Apply growth mindset principles in programming and life</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-green-100">Connect programming skills to real-world educational technology</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-3">
                <p className="text-green-200 text-sm font-medium">
                  🚀 <strong>Real Impact:</strong> You'll build the same type of AI assistant used by millions of students worldwide!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mission Progress Bar */}
      <div className="relative bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl p-6 mb-8 border border-green-500/30 shadow-xl overflow-hidden">
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-bounce">🐍</div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              Python Progress
            </h3>
            <div className="text-2xl animate-pulse delay-300">⭐</div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
            <Clock className="h-4 w-4 text-green-300" />
            <span className="text-sm text-green-200 font-medium">60 min lesson</span>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="relative mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">Overall Completion</span>
            <span className="text-lg font-bold text-green-300">{Math.round(calculateProgress())}% 🎯</span>
          </div>
          
          {/* Main progress bar */}
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="relative h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 transition-all duration-1000 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 shadow-lg shadow-green-500/50"></div>
            </div>
          </div>
        </div>

        {/* Mission-specific progress mini-bars */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {missions.map((mission, index) => {
            const isCompleted = index < Math.floor(missions.length * (calculateProgress() / 100))
            const isCurrent = currentTab === mission.id
            
            return (
              <div key={mission.id} className={`relative p-2 rounded-lg border transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-500/20 border-emerald-500/40' 
                  : isCurrent 
                    ? 'bg-green-500/20 border-green-500/40' 
                    : 'bg-gray-700/50 border-gray-600/50'
              }`}>
                <div className="flex items-center justify-center flex-col space-y-1">
                  <div className="text-lg">
                    {isCompleted ? '✅' : isCurrent ? mission.emoji : '⭕'}
                  </div>
                  <span className="text-xs font-medium text-gray-300">{mission.title.split(' ')[0]}</span>
                  
                  {/* Mini progress bar */}
                  <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-emerald-500 w-full' 
                          : isCurrent 
                            ? 'bg-green-500 w-3/4' 
                            : 'bg-gray-500 w-0'
                      }`}
                    ></div>
                  </div>
                </div>
                
                {/* Celebration sparkles */}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 animate-spin">
                    <div className="text-yellow-400 text-sm">✨</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Adventure Map - Navigation Style */}
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-8 mb-8 border-2 border-green-500/30 shadow-2xl overflow-hidden">
        {/* Python Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-12 text-6xl animate-pulse">🐍</div>
          <div className="absolute bottom-8 left-16 text-4xl animate-bounce delay-300">💻</div>
          <div className="absolute top-12 left-24 text-3xl animate-ping delay-500">⭐</div>
          <div className="absolute bottom-4 right-32 text-5xl animate-pulse delay-700">🤖</div>
        </div>

        <div className="relative z-10">
          {/* Adventure Map Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
              🐍 Python Adventure Map 🐍
            </h2>
            <p className="text-green-200 text-lg">Navigate your Python programming journey!</p>
          </div>

          {/* Mission Navigation Cards */}
          <div className="relative z-10 space-y-6">
            {missions.map((mission, index) => {
              const isCompleted = index < Math.floor(missions.length * (calculateProgress() / 100))
              const isActive = currentTab === mission.id
              const isLocked = index > 0 && !missions.slice(0, index).every((_, i) => i < Math.floor(missions.length * (calculateProgress() / 100)))
              const isEven = index % 2 === 0
              
              return (
                <div 
                  key={mission.id} 
                  className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}
                >
                  {/* Mission Navigation Card */}
                  <div
                    onClick={() => {
                      if (!isLocked) {
                        setCurrentTab(mission.id as any)
                      }
                    }}
                    className={`group relative bg-gradient-to-br p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 shadow-xl ${
                      isLocked
                        ? 'from-gray-800 to-gray-900 border-gray-600 opacity-50 cursor-not-allowed'
                        : isCompleted 
                          ? 'from-emerald-600 to-green-700 border-emerald-400 shadow-emerald-500/25'
                          : isActive 
                            ? `from-${mission.color}-600 to-${mission.color}-700 border-${mission.color}-400 shadow-${mission.color}-500/25`
                            : `from-${mission.color}-800/30 to-${mission.color}-900/30 border-${mission.color}-500/50 hover:border-${mission.color}-400`
                    } w-96`}
                  >
                    {/* Mission Status Badge */}
                    <div className="absolute -top-2 -right-2">
                      {isLocked ? (
                        <div className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                          🔒 LOCKED
                        </div>
                      ) : isCompleted ? (
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          ✅ COMPLETE
                        </div>
                      ) : (
                        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                          🎯 START MISSION
                        </div>
                      )}
                    </div>

                    {/* Mission Content */}
                    <div className="flex items-start gap-4">
                      {/* Mission Icon */}
                      <div className={`relative p-4 rounded-xl bg-gradient-to-r ${
                        isCompleted 
                          ? 'from-emerald-500 to-green-600' 
                          : `from-${mission.color}-500 to-${mission.color}-600`
                      } ${!isLocked ? 'group-hover:animate-pulse' : ''}`}>
                        <div className="text-4xl">{mission.emoji}</div>
                        <mission.icon className="absolute -bottom-1 -right-1 h-5 w-5 text-white bg-gray-900 rounded-full p-0.5" />
                      </div>

                      {/* Mission Details */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                        </div>
                        <p className="text-green-200 text-sm mb-3">{mission.subtitle}</p>
                        
                        {/* Mission Stats */}
                        <div className="flex items-center gap-4 text-xs mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⏱️</span>
                            <span className="text-gray-300">{mission.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-purple-400">💎</span>
                            <span className="text-gray-300">{mission.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-orange-400">🎯</span>
                            <span className="text-gray-300">{mission.difficulty}</span>
                          </div>
                        </div>

                        {/* Navigation Button */}
                        <div className={`mt-3 px-4 py-2 rounded-lg text-center font-semibold text-sm transition-all duration-300 ${
                          isLocked
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white group-hover:from-green-400 group-hover:to-emerald-500'
                        }`}>
                          {isLocked 
                            ? '🔒 Complete Previous Mission'
                            : isCompleted 
                              ? '✅ Mission Complete - Review' 
                              : '🚀 Enter Mission'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {!isLocked && (
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mission Content - Full Screen Mission Experience */}
      {currentTab && currentTab !== 'overview' && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-50 overflow-auto">
          {/* Mission Header with Back Button */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-sm border-b border-gray-700/50 p-4 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button 
                onClick={() => setCurrentTab('overview')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-white"
              >
                <span>←</span>
                <span>Back to Adventure Map</span>
              </button>
              <div className="flex items-center gap-4">
                {missions.find(m => m.id === currentTab) && (
                  <>
                    <div className="text-2xl">{missions.find(m => m.id === currentTab)?.emoji}</div>
                    <h1 className="text-2xl font-bold text-white">{missions.find(m => m.id === currentTab)?.title}</h1>
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      ⚡ ACTIVE MISSION
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mission Content */}
          <div className="max-w-7xl mx-auto p-8">
            {currentTab === 'learn' && (
              <div className="space-y-8">
                {/* Week 2 - School Success Advisor: Use LearningModeSelector */}
                {lesson.id === 'week-02' ? (
                  <LearningModeSelector 
                    slides={[
                      {
                        id: 'slide-1',
                        title: 'AI Study Buddy - Your 7-Step Mission',
                        emoji: '🎓',
                        content: `# 🎓 Build Your School Success Advisor

## What You're Creating Today
Your mission is to build an AI that helps students succeed in school. Think of it as creating a digital mentor that knows exactly what to say when students are stressed, confused, or need motivation.

## 🎯 Your 7-Step Coding Mission

### Step 1: Set Up the Foundation 🏗️
Create the basic Python structure that will hold all your AI's knowledge and responses.

### Step 2: Create Help Categories 📚
Build four main areas your AI can help with:
- **Encouragement** - When students feel discouraged
- **Study Tips** - When they need better learning strategies  
- **Motivation** - When they're losing focus
- **Goal Setting** - When they need direction

### Step 3: Build the Brain 🧠
Code a classifier that reads what students write and figures out what kind of help they need.

### Step 4: Write Great Responses ✍️
Create helpful, specific responses - not just "good luck!" but real, actionable advice.

### Step 5: Add Personality 😊
Make your AI sound friendly and supportive, like a helpful friend who really cares.

### Step 6: Test Everything 🧪
Try your AI with real student problems to make sure it actually works well.

### Step 7: Add Safety Features 🛡️
Teach your AI when to suggest talking to teachers, counselors, or parents for serious issues.

**Ready to start coding? Let's build an AI that changes students' lives!**`
                      },
                      {
                        id: 'slide-2', 
                        title: 'The Science Behind AI Helpers',
                        emoji: '🤖',
                        content: `# 🤖 How AI Advisors Work

## The 4 Types of Help Students Need

### 1. 💪 Encouragement 
**When:** Students feel like giving up or think they're not smart enough
**What your AI does:** Reminds them of past successes and builds confidence
**Example:** "Remember when you thought algebra was impossible? Look at you now!"

### 2. 🎯 Study Tips
**When:** Students don't know how to learn effectively 
**What your AI does:** Suggests specific, proven study techniques
**Example:** "Try the 15-minute rule - study for just 15 minutes. You'll often keep going!"

### 3. 🔥 Motivation
**When:** Students know what to do but can't get started
**What your AI does:** Connects schoolwork to their personal goals and dreams
**Example:** "That biology test? It's practice for becoming the doctor you want to be!"

### 4. 📈 Goal Setting
**When:** Students feel overwhelmed or don't know where to focus
**What your AI does:** Helps break big challenges into manageable steps
**Example:** "Let's turn 'improve math grade' into 'do 3 practice problems daily this week'"

## 🧠 The Programming Behind the Magic

Your AI uses **Natural Language Processing** to understand what students write, **Sentiment Analysis** to detect emotions, and **Response Generation** to craft helpful replies.

**Fun Fact:** Studies show positive AI interactions can improve test scores by 23%!

## 🌍 Real-World Impact

Apps like yours help millions of students:
- 5 million daily users of school counseling apps
- 78% of students improve study habits with AI coaching
- 340+ universities use academic coaching bots

**Ready to code this amazing technology?**`
                      }
                    ]}
                    flashcards={[
                      // 4 Types of Help
                      {
                        id: 'help-1',
                        category: '4 Types of Help',
                        front: '🎯 What is ENCOURAGEMENT help?',
                        back: 'When students feel down about grades or abilities.\n\nExample: "I got a D and feel stupid" → AI responds with understanding and creates a study plan.',
                        emoji: '🎯'
                      },
                      {
                        id: 'help-2',
                        category: '4 Types of Help',
                        front: '📚 What are STUDY TIPS?',
                        back: 'Specific learning strategies when students don\'t know how to study.\n\nExample: "Try the 20-20-20 method: 20 min notes, 20 min problems, 20 min explaining concepts."',
                        emoji: '📚'
                      },
                      {
                        id: 'help-3',
                        category: '4 Types of Help',
                        front: '🚀 What is MOTIVATION help?',
                        back: 'When students know what to do but can\'t get started.\n\nExample: "Try the 15-minute rule - commit to just 15 minutes of homework."',
                        emoji: '🚀'
                      },
                      {
                        id: 'help-4',
                        category: '4 Types of Help',
                        front: '🎯 What is GOAL SETTING help?',
                        back: 'Breaking big challenges into manageable steps.\n\nExample: "Turn \'improve GPA\' into \'do 3 practice problems daily this week.\'"',
                        emoji: '🎯'
                      }
                    ]}
                    onComplete={() => {
                      console.log('Learning mode completed!')
                    }}
                  />
                ) : (
                  <>
                    {/* Traditional Knowledge Quest Content (for other lessons) */}
                    <div className="bg-gradient-to-r from-emerald-800/30 to-green-800/30 rounded-3xl p-8 border-2 border-emerald-500/30">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-8xl animate-pulse">🎓</div>
                        <div>
                          <h2 className="text-5xl font-bold text-white mb-2">Knowledge Quest</h2>
                          <p className="text-emerald-200 text-xl">Learn Python & AI Concepts</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Learn Content */}
                    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{currentModeData.learn_md}</ReactMarkdown>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentTab === 'code' && (
              <div className="space-y-8">
                {/* Python Laboratory Content */}
                <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-3xl p-8 border-2 border-blue-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🐍</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Python Laboratory</h2>
                      <p className="text-blue-200 text-xl">Build Your AI Advisor</p>
                    </div>
                  </div>
                </div>
                
                {/* Python Code Editor */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-cyan-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <Play className="h-6 w-6" />
                    Python Code Editor 🐍
                  </h3>
                  
                  <CodeEditor
                    initialCode={currentModeData.code.starter}
                    onCodeChange={(code) => console.log('Code changed:', code)}
                    onExecutionResult={(result) => {
                      if (result.success) {
                        handleCodeExecution()
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {currentTab === 'tests' && (
              <div className="space-y-8">
                {/* Enhancement Lab Content */}
                <div className="bg-gradient-to-r from-orange-800/30 to-red-800/30 rounded-3xl p-8 border-2 border-orange-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🔧</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Enhancement Lab</h2>
                      <p className="text-orange-200 text-xl">Improve Your Creation</p>
                    </div>
                  </div>
                </div>
                
                {/* Test Interface */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-orange-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Enhancement Tasks 🔧
                  </h3>
                  <div className="grid gap-4">
                    {lesson.modes[0].tests_ui.map((test, index) => (
                      <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{test.desc}</span>
                          <button 
                            onClick={() => handleTestComplete(test.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              testState.completed[test.id] 
                                ? 'bg-green-600 text-white' 
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                            }`}
                          >
                            {testState.completed[test.id] ? '✅ Completed' : '▶️ Complete Task'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'quiz' && (
              <div className="space-y-8">
                {/* Python Mastery Content */}
                <div className="bg-gradient-to-r from-purple-800/30 to-violet-800/30 rounded-3xl p-8 border-2 border-purple-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🧠</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Python Mastery</h2>
                      <p className="text-purple-200 text-xl">Test Your Knowledge</p>
                    </div>
                  </div>
                </div>
                
                {/* Quiz Interface */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-purple-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <HelpCircle className="h-6 w-6" />
                    Knowledge Assessment 🧠
                  </h3>
                  <div className="space-y-6">
                    {lesson.modes[0].quiz.questions.map((question, index) => (
                      <div key={index} className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                        <h4 className="text-white font-semibold mb-4">{question.prompt}</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              onClick={() => handleQuizAnswer(index, optIndex)}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                quizState.answers[index] === optIndex
                                  ? 'bg-purple-600 border-purple-400 text-white'
                                  : 'bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {!quizState.submitted && (
                      <button
                        onClick={handleQuizSubmit}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold py-4 rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all duration-300"
                      >
                        Submit Python Quiz 🧠
                      </button>
                    )}
                    
                    {quizState.submitted && (
                      <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/30">
                        <h4 className="text-purple-300 font-bold text-lg mb-2">Quiz Results:</h4>
                        <p className="text-white text-xl">Score: {quizState.score}%</p>
                        {quizState.score >= 80 ? (
                          <p className="text-green-400 mt-2">🎉 Excellent! You've mastered Python concepts!</p>
                        ) : (
                          <p className="text-red-400 mt-2">Keep practicing! You need 80% to pass.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'checklist' && (
              <div className="space-y-8">
                {/* Final Review Content */}
                <div className="bg-gradient-to-r from-pink-800/30 to-rose-800/30 rounded-3xl p-8 border-2 border-pink-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">📋</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Final Review</h2>
                      <p className="text-pink-200 text-xl">Complete Your Project</p>
                    </div>
                  </div>
                </div>
                
                {/* Checklist Interface */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-pink-300 font-bold text-xl mb-4">📋 Project Checklist</h3>
                  <p className="text-pink-200 text-sm mb-4">
                    ✨ Items automatically complete as you finish each section!
                  </p>
                  <div className="space-y-4">
                    {lesson.modes[0].checklist.map((item, index) => {
                      const isCompleted = checklistState.completed[index]
                      return (
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-green-800/30 border border-green-500/50' 
                            : 'bg-pink-800/30'
                        }`}>
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? 'bg-green-500 border-green-400 text-white animate-pulse'
                                : 'border-pink-500 bg-pink-900/30'
                            }`}
                          >
                            {isCompleted && '✓'}
                          </div>
                          <span className={`transition-colors ${
                            isCompleted ? 'text-green-200' : 'text-pink-200'
                          }`}>
                            {item}
                          </span>
                          {isCompleted && (
                            <span className="ml-auto text-green-400 animate-bounce">🎉</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Completion Status */}
                  {lesson.modes[0].checklist.every((_, index) => checklistState.completed[index]) && (
                    <div className="mt-6 bg-green-900/20 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-4xl mb-2 animate-bounce">🎊</div>
                      <h4 className="text-green-300 font-bold text-lg mb-2">All Tasks Complete!</h4>
                      <p className="text-green-200 mb-4">
                        Fantastic work! You've mastered Python programming concepts.
                      </p>
                      <p className="text-green-300 text-sm animate-pulse">
                        🚀 Automatically advancing to claim your Python badge...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'submit' && (
              <div className="space-y-8">
                {/* Victory Ceremony Content */}
                <div className="bg-gradient-to-r from-yellow-800/30 to-amber-800/30 rounded-3xl p-8 border-2 border-yellow-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🏆</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Victory Ceremony</h2>
                      <p className="text-yellow-200 text-xl">Claim Your Python Badge!</p>
                    </div>
                  </div>
                </div>
                
                {/* Claim Rewards Section */}
                <div className="bg-gradient-to-r from-yellow-800/50 to-amber-800/50 rounded-3xl p-8 border-2 border-yellow-500/50 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-8xl mb-4 animate-bounce">🎉</div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
                      Python Adventure Complete!
                    </h3>
                    <p className="text-yellow-200 text-xl mb-2">You've mastered AI chatbot development!</p>
                    <p className="text-amber-300 mb-8 text-lg">🐍 Python Badge • 🤖 AI Creator • 💎 850 XP Points</p>
                    
                    <button 
                      onClick={() => onLessonComplete(100)}
                      className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold px-12 py-6 rounded-2xl text-2xl hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-yellow-500/50 animate-pulse"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-3xl">🐍</span>
                        <span>CLAIM PYTHON BADGE!</span>
                        <span className="text-3xl">🏆</span>
                      </span>
                    </button>
                    
                    <p className="text-yellow-200 mt-6 text-sm">
                      🎯 Click above to earn your Python programming credentials!
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}