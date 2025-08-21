'use client'

import { useState, useEffect } from 'react'
import { AILesson, LessonMode } from '@/lib/lesson-data'
import dynamic from 'next/dynamic'

const AIClassifierTrainer = dynamic(() => import('./AIClassifierTrainer'), {
  ssr: false,
  loading: () => <div className="text-white">Loading AI Classifier...</div>
})
import { BookOpen, Code, CheckSquare, HelpCircle, Upload, Award, Sparkles, Brain, Zap, Target, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import InteractiveLessonContent from './InteractiveLessonContent'

interface AILessonViewerProps {
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

export default function AILessonViewer({ lesson, onLessonComplete, onQuizComplete, onCodeExecution }: AILessonViewerProps) {
  const [currentMode, setCurrentMode] = useState<'main' | 'bonus'>('main')
  const [currentTab, setCurrentTab] = useState<'overview' | 'learn' | 'code' | 'tests' | 'quiz' | 'checklist' | 'submit' | 'bonus'>('overview')
  const [quizState, setQuizState] = useState<QuizState>({ answers: {}, submitted: false, score: 0 })
  const [checklistState, setChecklistState] = useState<ChecklistState>({ completed: {} })
  const [testState, setTestState] = useState<TestState>({ completed: {} })
  const [metrics, setMetrics] = useState<any>(null)
  const [submissionText, setSubmissionText] = useState('')

  // Get current mode data
  const currentModeData = lesson.modes.find(mode => mode.type === currentMode) || lesson.modes[0]

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0
    let total = 6 // learn, code, tests, quiz, checklist, submit

    // Learn tab is automatically completed when visited
    if (currentTab !== 'learn') completed += 1

    // Code tab completed when model is trained
    if (metrics) completed += 1

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

  useEffect(() => {
    const progress = calculateProgress()
    onLessonComplete(progress)
  }, [currentTab, metrics, testState, quizState, checklistState, submissionText])

  const handleModeSwitch = (mode: 'main' | 'bonus') => {
    setCurrentMode(mode)
    setCurrentTab('learn')
    // Reset progress for new mode
    setQuizState({ answers: {}, submitted: false, score: 0 })
    setChecklistState({ completed: {} })
    setTestState({ completed: {} })
    setMetrics(null)
    setSubmissionText('')
  }

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

  const missions = [
    { 
      id: 'learn', 
      title: 'Knowledge Quest', 
      subtitle: 'Discover the Ancient Secrets of AI',
      icon: BookOpen, 
      color: 'emerald', 
      emoji: '🏛️',
      difficulty: 'Beginner',
      estimatedTime: '15 min',
      xpReward: 100,
      description: 'Explore the fundamental concepts and unlock the mysteries of artificial intelligence',
      objectives: ['Learn core AI concepts', 'Understand key terminology', 'Complete knowledge checkpoints']
    },
    { 
      id: 'code', 
      title: 'Coding Laboratory', 
      subtitle: 'Build Your First AI Creation',
      icon: Brain, 
      color: 'blue', 
      emoji: '⚗️',
      difficulty: 'Intermediate',
      estimatedTime: '25 min',
      xpReward: 200,
      description: 'Enter the lab and craft your very own AI model using cutting-edge techniques',
      objectives: ['Set up your workspace', 'Train an AI model', 'Test your creation']
    },
    { 
      id: 'tests', 
      title: 'Trial Chamber', 
      subtitle: 'Prove Your AI Mastery',
      icon: Target, 
      color: 'orange', 
      emoji: '🏹',
      difficulty: 'Intermediate',
      estimatedTime: '10 min',
      xpReward: 150,
      description: 'Face the challenges and demonstrate that your AI creation works perfectly',
      objectives: ['Run accuracy tests', 'Debug any issues', 'Achieve 80%+ success rate']
    },
    { 
      id: 'quiz', 
      title: 'Wisdom Trials', 
      subtitle: 'Answer the Ancient Riddles',
      icon: HelpCircle, 
      color: 'purple', 
      emoji: '🔮',
      difficulty: 'Advanced',
      estimatedTime: '8 min',
      xpReward: 120,
      description: 'Test your understanding with mystical questions about AI and machine learning',
      objectives: ['Answer concept questions', 'Solve practical problems', 'Score 70%+ to pass']
    },
    { 
      id: 'checklist', 
      title: 'Final Inspection', 
      subtitle: 'Complete Your Adventure',
      icon: CheckSquare, 
      color: 'pink', 
      emoji: '📋',
      difficulty: 'Easy',
      estimatedTime: '5 min',
      xpReward: 75,
      description: 'Review all your accomplishments and ensure everything is ready for submission',
      objectives: ['Review all completed tasks', 'Check code quality', 'Prepare final submission']
    },
    { 
      id: 'submit', 
      title: 'Victory Ceremony', 
      subtitle: 'Claim Your Rewards!',
      icon: Award, 
      color: 'yellow', 
      emoji: '🏆',
      difficulty: 'Celebration',
      estimatedTime: '2 min',
      xpReward: 300,
      description: 'Submit your masterpiece and receive your well-earned rewards and achievements!',
      objectives: ['Submit final project', 'Receive completion badge', 'Unlock next adventure']
    },
    { 
      id: 'bonus', 
      title: 'Bonus Quest: AI Master Challenge', 
      subtitle: 'Advanced Techniques & Secrets',
      icon: Sparkles, 
      color: 'purple', 
      emoji: '🌟',
      difficulty: 'Master',
      estimatedTime: '30 min',
      xpReward: 500,
      description: 'Unlock advanced AI techniques and secret knowledge reserved for true masters!',
      objectives: ['Explore advanced algorithms', 'Create complex AI models', 'Discover hidden features', 'Earn master certification']
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Lesson Header */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 mb-8 border border-purple-500/30 shadow-2xl overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute bottom-4 left-4 animate-bounce">
            <Brain className="h-6 w-6 text-pink-400" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
            <Target className="h-12 w-12 text-cyan-400 opacity-20" />
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {lesson.title}
            </h1>
            <div className="flex-1"></div>
            <div className="animate-pulse">
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <p className="text-blue-200 text-lg mb-6 leading-relaxed">{lesson.description}</p>
        
          {/* Lesson Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Lesson Overview 🎯
            </h3>
            <div className="bg-white/10 backdrop-blur-sm border border-cyan-500/30 px-6 py-4 rounded-xl">
              <p className="text-cyan-100 font-medium mb-3">By the end of this lesson, you will be able to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Explain what machine learning is and how it differs from traditional programming</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Understand key ML concepts: labels, datasets, training, and inference</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Train your own AI image classifier using real school supplies data</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Interpret accuracy metrics and confusion matrices</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Identify bias and fairness issues in AI systems</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Improve model performance through data cleaning</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Connect AI concepts to real-world applications</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm text-cyan-100">Think critically about ethical implications of AI technology</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg p-3">
                <p className="text-cyan-200 text-sm font-medium">
                  🚀 <strong>Real Impact:</strong> You'll master the same concepts used by data scientists at Google, Netflix, and Tesla!
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleModeSwitch('main')}
              className={`group px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                currentMode === 'main'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-white/10 text-cyan-200 hover:bg-white/20 border border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <div>
                  <div className="text-sm">Main Mission</div>
                  <div className="text-xs opacity-80">{lesson.modes[0]?.title}</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => handleModeSwitch('bonus')}
              className={`group px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                currentMode === 'bonus'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-purple-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <div>
                  <div className="text-sm">Bonus Challenge</div>
                  <div className="text-xs opacity-80">{lesson.modes[1]?.title}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mission Progress Bar - Right after lesson overview */}
      <div className="relative bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl p-6 mb-8 border border-cyan-500/30 shadow-xl overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-12 animate-ping">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="absolute top-8 left-16 animate-pulse delay-300">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-6 right-24 animate-bounce delay-500">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* Header with celebration emojis */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-bounce">🚀</div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Adventure Progress
            </h3>
            <div className="text-2xl animate-pulse delay-300">⭐</div>
          </div>
          <div className="flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-xl border border-cyan-500/30">
            <Clock className="h-4 w-4 text-cyan-300" />
            <span className="text-sm text-cyan-200 font-medium">45 min remaining</span>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="relative mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">Overall Completion</span>
            <span className="text-lg font-bold text-cyan-300">{Math.round(calculateProgress())}% 🎯</span>
          </div>
          
          {/* Main progress bar */}
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700"></div>
            
            {/* Progress fill with gradient and animation */}
            <div 
              className="relative h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-600 transition-all duration-1000 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              
              {/* Progress glow */}
              <div className="absolute inset-0 shadow-lg shadow-cyan-500/50"></div>
            </div>
            
            {/* Achievement markers */}
            <div className="absolute top-0 left-1/4 w-0.5 h-full bg-yellow-400 opacity-60"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-yellow-400 opacity-60"></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-full bg-yellow-400 opacity-60"></div>
          </div>
          
          {/* Achievement labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              25% 🌟
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              50% 🔥
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              75% 💎
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              100% 🏆
            </span>
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
                    ? 'bg-cyan-500/20 border-cyan-500/40' 
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
                            ? 'bg-cyan-500 w-3/4' 
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

        {/* Motivational footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">
            {calculateProgress() < 25 
              ? "🚀 Great start! You're building momentum!" 
              : calculateProgress() < 50 
                ? "🔥 You're on fire! Keep up the excellent work!" 
                : calculateProgress() < 75 
                  ? "💎 Outstanding progress! You're almost there!" 
                  : calculateProgress() < 100 
                    ? "🏆 So close to completing this mission! Final push!" 
                    : "🎉 Mission accomplished! You're a coding superstar!"
            }
          </p>
          
          {/* XP and streak info */}
          <div className="flex justify-center items-center gap-6 text-xs">
            <div className="flex items-center gap-1 text-yellow-400">
              <span>⭐</span>
              <span>+50 XP earned</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400">
              <span>🔥</span>
              <span>5-day streak</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <span>🏅</span>
              <span>2 badges unlocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adventure Map - Navigation Style */}
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-8 mb-8 border-2 border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Fantasy Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-12 text-6xl animate-pulse">🏔️</div>
          <div className="absolute bottom-8 left-16 text-4xl animate-bounce delay-300">🌲</div>
          <div className="absolute top-12 left-24 text-3xl animate-ping delay-500">⭐</div>
          <div className="absolute bottom-4 right-32 text-5xl animate-pulse delay-700">🏰</div>
        </div>

        <div className="relative z-10">
          {/* Adventure Map Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              🗺️ Adventure Map 🗺️
            </h2>
            <p className="text-cyan-200 text-lg">Navigate to your missions and complete your adventure!</p>
          </div>

          {/* Main Mission Path */}
          <div className="relative">
            {/* Winding Road Path */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 800 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Winding adventure path */}
              <path
                d="M 100 100 Q 300 50 500 150 T 700 250 Q 600 350 400 400 T 100 500"
                stroke="url(#roadGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="20 10"
                filter="url(#glow)"
                className="animate-pulse"
              />
              {/* Road markers */}
              <circle cx="100" cy="100" r="4" fill="#fbbf24" className="animate-ping"/>
              <circle cx="300" cy="120" r="4" fill="#3b82f6" className="animate-ping" style={{animationDelay: '0.5s'}}/>
              <circle cx="500" cy="150" r="4" fill="#f97316" className="animate-ping" style={{animationDelay: '1s'}}/>
              <circle cx="600" cy="250" r="4" fill="#a855f7" className="animate-ping" style={{animationDelay: '1.5s'}}/>
              <circle cx="400" cy="400" r="4" fill="#ec4899" className="animate-ping" style={{animationDelay: '2s'}}/>
              <circle cx="150" cy="480" r="4" fill="#eab308" className="animate-ping" style={{animationDelay: '2.5s'}}/>
            </svg>

            {/* Mission Navigation Cards */}
            <div className="relative z-10 space-y-6">
              {missions.map((mission, index) => {
                const isCompleted = index < Math.floor(missions.length * (calculateProgress() / 100))
                const isActive = currentTab === mission.id
                const isLocked = index > 0 && !missions.slice(0, index).every((_, i) => i < Math.floor(missions.length * (calculateProgress() / 100)))
                const isEven = index % 2 === 0
                
                // Add bonus mission logic
                const isBonusMission = index === missions.length - 1 && mission.title.includes('Bonus')
                const mainMissionsCompleted = Math.floor((missions.length - 1) * (calculateProgress() / 100)) === (missions.length - 1)
                const bonusUnlocked = isBonusMission && mainMissionsCompleted

                return (
                  <div 
                    key={mission.id} 
                    className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}
                  >
                    {/* Mission Navigation Card */}
                    <div
                      onClick={() => {
                        if (!isLocked && (!isBonusMission || bonusUnlocked)) {
                          // Show mission content by switching tabs
                          setCurrentTab(mission.id as any)
                        }
                      }}
                      className={`group relative bg-gradient-to-br p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 shadow-xl ${
                        isLocked || (isBonusMission && !bonusUnlocked)
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
                        {isBonusMission && !bonusUnlocked ? (
                          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            🎁 BONUS - COMPLETE MAIN QUEST
                          </div>
                        ) : isLocked ? (
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
                        } ${!isLocked && (!isBonusMission || bonusUnlocked) ? 'group-hover:animate-pulse' : ''}`}>
                          <div className="text-4xl">{mission.emoji}</div>
                          <mission.icon className="absolute -bottom-1 -right-1 h-5 w-5 text-white bg-gray-900 rounded-full p-0.5" />
                        </div>

                        {/* Mission Details */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                            {isBonusMission && (
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full text-xs font-bold text-white animate-pulse">
                                BONUS
                              </div>
                            )}
                          </div>
                          <p className="text-cyan-200 text-sm mb-3">{mission.subtitle}</p>
                          
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
                            isLocked || (isBonusMission && !bonusUnlocked)
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white group-hover:from-cyan-400 group-hover:to-blue-500'
                          }`}>
                            {isBonusMission && !bonusUnlocked 
                              ? '🎁 Complete Main Quest to Unlock'
                              : isLocked 
                                ? '🔒 Complete Previous Mission'
                                : isCompleted 
                                  ? '✅ Mission Complete - Review' 
                                  : '🚀 Enter Mission'
                            }
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      {!isLocked && (!isBonusMission || bonusUnlocked) && (
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Adventure Stats Footer */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 border border-purple-500/30">
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-white font-semibold">Missions Available</div>
                  <div className="text-purple-300">{missions.length} Epic Adventures</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="text-white font-semibold">Total XP Available</div>
                  <div className="text-purple-300">{missions.reduce((sum, m) => sum + m.xpReward, 0)} XP</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-white font-semibold">Bonus Content</div>
                  <div className="text-purple-300">Unlock by completing all missions!</div>
                </div>
              </div>
            </div>
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
                    <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
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
                {/* Knowledge Quest Content */}
                <div className="bg-gradient-to-r from-emerald-800/30 to-green-800/30 rounded-3xl p-8 border-2 border-emerald-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🏛️</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Knowledge Quest</h2>
                      <p className="text-emerald-200 text-xl">Discover the Ancient Secrets of AI</p>
                    </div>
                  </div>
                  
                  {/* Mission Objectives */}
                  <div className="bg-emerald-900/40 rounded-2xl p-6 border border-emerald-500/30">
                    <h3 className="text-emerald-300 font-bold text-xl mb-4">🎯 Mission Objectives</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-emerald-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">📚</div>
                        <h4 className="text-emerald-200 font-semibold mb-1">Learn Core AI Concepts</h4>
                        <p className="text-emerald-300/80 text-sm">Master the fundamentals of artificial intelligence</p>
                      </div>
                      <div className="bg-emerald-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🎓</div>
                        <h4 className="text-emerald-200 font-semibold mb-1">Understand Terminology</h4>
                        <p className="text-emerald-300/80 text-sm">Learn the language of AI and machine learning</p>
                      </div>
                      <div className="bg-emerald-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">✅</div>
                        <h4 className="text-emerald-200 font-semibold mb-1">Complete Checkpoints</h4>
                        <p className="text-emerald-300/80 text-sm">Verify your understanding with interactive quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Lesson Content */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <InteractiveLessonContent 
                    onSectionComplete={(sectionIndex) => {
                      console.log(`Section ${sectionIndex} completed`)
                    }}
                    onReturnToMap={() => setCurrentTab('overview')}
                  />
                </div>
              </div>
            )}

            {currentTab === 'code' && (
              <div className="space-y-8">
                {/* Coding Laboratory Content */}
                <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-3xl p-8 border-2 border-blue-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">⚗️</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Coding Laboratory</h2>
                      <p className="text-blue-200 text-xl">Build Your First AI Creation</p>
                    </div>
                  </div>
                  
                  {/* Mission Objectives */}
                  <div className="bg-blue-900/40 rounded-2xl p-6 border border-blue-500/30">
                    <h3 className="text-blue-300 font-bold text-xl mb-4">⚗️ Laboratory Objectives</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🔧</div>
                        <h4 className="text-blue-200 font-semibold mb-1">Set Up Workspace</h4>
                        <p className="text-blue-300/80 text-sm">Configure your AI development environment</p>
                      </div>
                      <div className="bg-blue-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🤖</div>
                        <h4 className="text-blue-200 font-semibold mb-1">Train AI Model</h4>
                        <p className="text-blue-300/80 text-sm">Create and train your first machine learning model</p>
                      </div>
                      <div className="bg-blue-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🧪</div>
                        <h4 className="text-blue-200 font-semibold mb-1">Test Your Creation</h4>
                        <p className="text-blue-300/80 text-sm">Validate your AI model with real data</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Classifier Trainer */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-cyan-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    AI Model Configuration 🔧
                  </h3>
                  <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20 mb-6">
                    <pre className="text-green-300 text-sm overflow-x-auto">
                      {currentModeData.code.starter}
                    </pre>
                  </div>
                  
                  <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-4">
                    <AIClassifierTrainer
                      dataset={currentModeData.dataset}
                      labels={currentModeData.labels}
                      onMetricsUpdate={setMetrics}
                      onTrainingComplete={(success) => {
                        if (success) {
                          handleTestComplete('dataset_loaded')
                          handleTestComplete('trained_once')
                          // Notify parent component about code execution
                          if (onCodeExecution) {
                            onCodeExecution()
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'tests' && (
              <div className="space-y-8">
                {/* Trial Chamber Content */}
                <div className="bg-gradient-to-r from-orange-800/30 to-red-800/30 rounded-3xl p-8 border-2 border-orange-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🏹</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Trial Chamber</h2>
                      <p className="text-orange-200 text-xl">Prove Your AI Mastery</p>
                    </div>
                  </div>
                  
                  {/* Mission Objectives */}
                  <div className="bg-orange-900/40 rounded-2xl p-6 border border-orange-500/30">
                    <h3 className="text-orange-300 font-bold text-xl mb-4">🎯 Testing Objectives</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-orange-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">📊</div>
                        <h4 className="text-orange-200 font-semibold mb-1">Run Accuracy Tests</h4>
                        <p className="text-orange-300/80 text-sm">Measure your AI model's performance</p>
                      </div>
                      <div className="bg-orange-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🔧</div>
                        <h4 className="text-orange-200 font-semibold mb-1">Debug Issues</h4>
                        <p className="text-orange-300/80 text-sm">Identify and fix any problems</p>
                      </div>
                      <div className="bg-orange-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🏆</div>
                        <h4 className="text-orange-200 font-semibold mb-1">Achieve 80%+ Success</h4>
                        <p className="text-orange-300/80 text-sm">Meet the performance threshold</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Test Interface */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-orange-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    AI Model Testing Suite 🎯
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
                            {testState.completed[test.id] ? '✅ Passed' : '▶️ Run Test'}
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
                {/* Wisdom Trials Content */}
                <div className="bg-gradient-to-r from-purple-800/30 to-violet-800/30 rounded-3xl p-8 border-2 border-purple-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🔮</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Wisdom Trials</h2>
                      <p className="text-purple-200 text-xl">Answer the Ancient Riddles</p>
                    </div>
                  </div>
                  
                  {/* Mission Objectives */}
                  <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-purple-300 font-bold text-xl mb-4">🔮 Trial Objectives</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">❓</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Answer Concept Questions</h4>
                        <p className="text-purple-300/80 text-sm">Test your theoretical knowledge</p>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🧩</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Solve Practical Problems</h4>
                        <p className="text-purple-300/80 text-sm">Apply your learning to real scenarios</p>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">📊</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Score 70%+ to Pass</h4>
                        <p className="text-purple-300/80 text-sm">Demonstrate your mastery</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quiz Interface */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-purple-300 font-bold text-xl mb-6 flex items-center gap-2">
                    <HelpCircle className="h-6 w-6" />
                    Knowledge Assessment 🔮
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
                        Submit Wisdom Trial 🔮
                      </button>
                    )}
                    
                    {quizState.submitted && (
                      <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/30">
                        <h4 className="text-purple-300 font-bold text-lg mb-2">Trial Results:</h4>
                        <p className="text-white text-xl">Score: {quizState.score}%</p>
                        {quizState.score >= 70 ? (
                          <p className="text-green-400 mt-2">🎉 Congratulations! You have passed the Wisdom Trials!</p>
                        ) : (
                          <p className="text-red-400 mt-2">Keep studying and try again. You need 70% to pass.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'checklist' && (
              <div className="space-y-8">
                {/* Final Inspection Content */}
                <div className="bg-gradient-to-r from-pink-800/30 to-rose-800/30 rounded-3xl p-8 border-2 border-pink-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">📋</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Final Inspection</h2>
                      <p className="text-pink-200 text-xl">Complete Your Adventure</p>
                    </div>
                  </div>
                  
                  {/* Mission Objectives */}
                  <div className="bg-pink-900/40 rounded-2xl p-6 border border-pink-500/30">
                    <h3 className="text-pink-300 font-bold text-xl mb-4">📋 Inspection Checklist</h3>
                    <div className="space-y-4">
                      {lesson.modes[0].checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-pink-800/30 p-4 rounded-xl">
                          <button
                            onClick={() => handleChecklistToggle(index)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              checklistState.completed[index]
                                ? 'bg-pink-500 border-pink-400 text-white'
                                : 'border-pink-500 hover:border-pink-400'
                            }`}
                          >
                            {checklistState.completed[index] && '✓'}
                          </button>
                          <span className="text-pink-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      <p className="text-yellow-200 text-xl">Claim Your Rewards!</p>
                    </div>
                  </div>
                  
                  {/* Achievement Summary */}
                  <div className="bg-yellow-900/40 rounded-2xl p-6 border border-yellow-500/30">
                    <h3 className="text-yellow-300 font-bold text-xl mb-4">🏆 Adventure Complete!</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-yellow-800/30 p-6 rounded-xl text-center">
                        <div className="text-4xl mb-2">🎖️</div>
                        <h4 className="text-yellow-200 font-bold text-lg mb-2">Mission Status</h4>
                        <p className="text-yellow-300">All objectives completed!</p>
                      </div>
                      <div className="bg-yellow-800/30 p-6 rounded-xl text-center">
                        <div className="text-4xl mb-2">💎</div>
                        <h4 className="text-yellow-200 font-bold text-lg mb-2">XP Earned</h4>
                        <p className="text-yellow-300">945 Experience Points</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Claim Rewards Section */}
                <div className="bg-gradient-to-r from-yellow-800/50 to-amber-800/50 rounded-3xl p-8 border-2 border-yellow-500/50 text-center relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 text-6xl animate-bounce">🎁</div>
                    <div className="absolute bottom-4 right-4 text-6xl animate-pulse">💎</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-spin-slow opacity-10">🏆</div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-8xl mb-4 animate-bounce">🎉</div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
                      Adventure Complete!
                    </h3>
                    <p className="text-yellow-200 text-xl mb-2">You've mastered the concepts and deserve recognition!</p>
                    <p className="text-amber-300 mb-8 text-lg">🏅 Badges • 🏆 Trophies • 💎 XP Points • ⭐ Achievements</p>
                    
                    <button 
                      onClick={() => onLessonComplete(100)}
                      className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold px-12 py-6 rounded-2xl text-2xl hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-yellow-500/50 animate-pulse"
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl blur-xl opacity-50 -z-10"></div>
                      
                      <span className="flex items-center gap-3">
                        <span className="text-3xl">🎁</span>
                        <span>CLAIM YOUR REWARDS NOW!</span>
                        <span className="text-3xl">🏆</span>
                      </span>
                      
                      {/* Sparkle animations */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full animate-ping"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping animation-delay-200"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full animate-ping animation-delay-400"></div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping animation-delay-600"></div>
                    </button>
                    
                    <p className="text-yellow-200 mt-6 text-sm">
                      🎯 Click above to see your earned badges and unlock your next adventure!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'bonus' && (
              <div className="space-y-8">
                {/* Bonus Quest Content */}
                <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-3xl p-8 border-2 border-purple-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-8xl animate-pulse">🌟</div>
                    <div>
                      <h2 className="text-5xl font-bold text-white mb-2">Bonus Quest: AI Master Challenge</h2>
                      <p className="text-purple-200 text-xl">Advanced Techniques & Secrets</p>
                    </div>
                  </div>
                  
                  {/* Master Objectives */}
                  <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-purple-300 font-bold text-xl mb-4">🌟 Master Objectives</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🧠</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Explore Advanced Algorithms</h4>
                        <p className="text-purple-300/80 text-sm">Deep dive into neural networks and deep learning</p>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🏗️</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Create Complex AI Models</h4>
                        <p className="text-purple-300/80 text-sm">Build multi-layer architectures</p>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🔍</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Discover Hidden Features</h4>
                        <p className="text-purple-300/80 text-sm">Unlock advanced AI capabilities</p>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl">
                        <div className="text-3xl mb-2">🏅</div>
                        <h4 className="text-purple-200 font-semibold mb-1">Earn Master Certification</h4>
                        <p className="text-purple-300/80 text-sm">Achieve AI mastery status</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bonus Content */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-600">
                  <h3 className="text-purple-300 font-bold text-xl mb-6">🌟 Master-Level Content</h3>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h4 className="text-2xl text-purple-300 mb-2">Advanced Content Coming Soon!</h4>
                    <p className="text-gray-400">This master-level content is being developed for true AI adventurers.</p>
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