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

export default function AILessonViewer({ lesson, onLessonComplete }: AILessonViewerProps) {
  const [currentMode, setCurrentMode] = useState<'main' | 'bonus'>('main')
  const [currentTab, setCurrentTab] = useState<'learn' | 'code' | 'tests' | 'quiz' | 'checklist' | 'submit'>('learn')
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

  const handleQuizSubmit = () => {
    let correct = 0
    currentModeData.quiz.questions.forEach((question, index) => {
      if (quizState.answers[index] === question.answer_index) {
        correct++
      }
    })
    const score = (correct / currentModeData.quiz.questions.length) * 100
    setQuizState(prev => ({ ...prev, submitted: true, score }))
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

      {/* Adventure Map */}
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
            <p className="text-cyan-200 text-lg">Choose your next mission, brave adventurer!</p>
          </div>

          {/* Mission Path - Zigzag Layout */}
          <div className="space-y-4">
            {missions.map((mission, index) => {
              const isCompleted = index < Math.floor(missions.length * (progressPercentage / 100))
              const isActive = currentTab === mission.id
              const isLocked = index > 0 && !missions.slice(0, index).every((_, i) => i < Math.floor(missions.length * (progressPercentage / 100)))
              const isEven = index % 2 === 0

              return (
                <div 
                  key={mission.id} 
                  className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}
                >
                  {/* Connecting Path Line */}
                  {index < missions.length - 1 && (
                    <div className={`absolute ${isEven ? 'right-0' : 'left-0'} top-full h-4 w-px bg-gradient-to-b from-cyan-400/50 to-transparent z-0`}></div>
                  )}

                  {/* Mission Card */}
                  <button
                    onClick={() => !isLocked && setCurrentTab(mission.id as any)}
                    disabled={isLocked}
                    className={`group relative bg-gradient-to-br p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 shadow-xl ${
                      isLocked 
                        ? 'from-gray-800 to-gray-900 border-gray-600 opacity-50 cursor-not-allowed'
                        : isCompleted 
                          ? 'from-emerald-600 to-green-700 border-emerald-400 shadow-emerald-500/25'
                          : isActive 
                            ? `from-${mission.color}-600 to-${mission.color}-700 border-${mission.color}-400 shadow-${mission.color}-500/25`
                            : `from-${mission.color}-800/30 to-${mission.color}-900/30 border-${mission.color}-500/50 hover:border-${mission.color}-400`
                    } w-80`}
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
                      ) : isActive ? (
                        <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                          ⚡ ACTIVE
                        </div>
                      ) : (
                        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          📍 READY
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
                      } ${isActive ? 'animate-pulse' : ''}`}>
                        <div className="text-3xl">{mission.emoji}</div>
                        <mission.icon className="absolute -bottom-1 -right-1 h-4 w-4 text-white bg-gray-900 rounded-full p-0.5" />
                      </div>

                      {/* Mission Details */}
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-bold text-white mb-1">{mission.title}</h3>
                        <p className="text-cyan-200 text-sm mb-3">{mission.subtitle}</p>
                        
                        {/* Mission Stats */}
                        <div className="flex items-center gap-4 text-xs">
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

                        {/* Mission Objectives */}
                        <div className="mt-3 space-y-1">
                          {mission.objectives.slice(0, 2).map((objective, objIndex) => (
                            <div key={objIndex} className="flex items-center gap-2 text-xs text-gray-400">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                              <span>{objective}</span>
                            </div>
                          ))}
                          {mission.objectives.length > 2 && (
                            <div className="text-xs text-cyan-400">+{mission.objectives.length - 2} more objectives...</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {!isLocked && (
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Adventure Stats Footer */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 border border-purple-500/30">
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-white font-semibold">Missions Completed</div>
                  <div className="text-purple-300">{Math.floor(missions.length * (progressPercentage / 100))} / {missions.length}</div>
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
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="text-white font-semibold">Adventure Time</div>
                  <div className="text-purple-300">~60 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
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
              Mission Progress
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
            <span className="text-lg font-bold text-cyan-300">{Math.round(progressPercentage)}% 🎯</span>
          </div>
          
          {/* Main progress bar */}
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700"></div>
            
            {/* Progress fill with gradient and animation */}
            <div 
              className="relative h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-600 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
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
            const isCompleted = index < Math.floor(missions.length * (progressPercentage / 100))
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
            {progressPercentage < 25 
              ? "🚀 Great start! You're building momentum!" 
              : progressPercentage < 50 
                ? "🔥 You're on fire! Keep up the excellent work!" 
                : progressPercentage < 75 
                  ? "💎 Outstanding progress! You're almost there!" 
                  : progressPercentage < 100 
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

      {/* Tab Content */}
      <div className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-2xl p-8 border border-gray-600 shadow-xl relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        
        <div className="relative z-10">
          {currentTab === 'learn' && (
            <div className="space-y-6">
              {/* Mission Header */}
              <div className="relative bg-gradient-to-r from-emerald-800/50 to-green-800/50 p-8 rounded-3xl border-2 border-emerald-500/30 mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-2xl animate-pulse shadow-2xl">
                      <div className="text-6xl">🏛️</div>
                      <BookOpen className="absolute -bottom-2 -right-2 h-8 w-8 text-white bg-gray-900 rounded-full p-1" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-4xl font-bold text-white">Knowledge Quest</h2>
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                        ⚡ ACTIVE MISSION
                      </div>
                    </div>
                    <p className="text-emerald-200 text-xl mb-4">Discover the Ancient Secrets of AI</p>
                    
                    {/* Mission Objectives */}
                    <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-semibold mb-2">Mission Objectives:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          Learn core AI concepts
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          Understand key terminology
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          Complete knowledge checkpoints
                        </div>
                      </div>
                    </div>

                    {/* Reward Info */}
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">💎</span>
                        <span className="text-emerald-200 font-semibold">100 XP Reward</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400">⏱️</span>
                        <span className="text-emerald-200">~15 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interactive Lesson Content */}
              <InteractiveLessonContent 
                onSectionComplete={(sectionIndex) => {
                  // Track section completion for progress
                  console.log(`Section ${sectionIndex} completed`)
                }}
              />
            </div>
          )}

          {currentTab === 'code' && (
            <div className="space-y-8">
              {/* Mission Header */}
              <div className="relative bg-gradient-to-r from-blue-800/50 to-cyan-800/50 p-8 rounded-3xl border-2 border-blue-500/30 mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl animate-pulse shadow-2xl">
                      <div className="text-6xl">⚗️</div>
                      <Brain className="absolute -bottom-2 -right-2 h-8 w-8 text-white bg-gray-900 rounded-full p-1" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-4xl font-bold text-white">Coding Laboratory</h2>
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                        ⚡ ACTIVE MISSION
                      </div>
                    </div>
                    <p className="text-blue-200 text-xl mb-4">Build Your First AI Creation</p>
                    
                    {/* Mission Objectives */}
                    <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/20">
                      <h4 className="text-blue-300 font-semibold mb-2">Mission Objectives:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Set up your workspace
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Train an AI model
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Test your creation
                        </div>
                      </div>
                    </div>

                    {/* Reward Info */}
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">💎</span>
                        <span className="text-blue-200 font-semibold">200 XP Reward</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-400">⏱️</span>
                        <span className="text-blue-200">~25 minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-400">🎯</span>
                        <span className="text-blue-200">Intermediate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-900 to-slate-900 rounded-xl p-6 border border-cyan-500/30 shadow-lg">
                <h4 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Configuration 🔧
                </h4>
                <pre className="text-green-300 text-sm overflow-x-auto bg-black/30 p-4 rounded-lg border border-green-500/20">
                  {currentModeData.code.starter}
                </pre>
              </div>
              
              <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-1">
                <AIClassifierTrainer
                  dataset={currentModeData.dataset}
                  labels={currentModeData.labels}
                  onMetricsUpdate={setMetrics}
                  onTrainingComplete={(success) => {
                    if (success) {
                      // Auto-complete some tests when training succeeds
                      handleTestComplete('dataset_loaded')
                      handleTestComplete('trained_once')
                    }
                  }}
                />
              </div>
            </div>
          )}

        {currentTab === 'tests' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Learning Tests</h3>
            <div className="space-y-4">
              {currentModeData.tests_ui.map(test => (
                <div
                  key={test.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    testState.completed[test.id]
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-gray-600 bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white">{test.desc}</p>
                    <button
                      onClick={() => handleTestComplete(test.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        testState.completed[test.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 hover:bg-gray-500 text-white'
                      }`}
                    >
                      {testState.completed[test.id] ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'quiz' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Knowledge Check</h3>
            {!quizState.submitted ? (
              <div className="space-y-6">
                {currentModeData.quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">{question.prompt}</h4>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            checked={quizState.answers[qIndex] === oIndex}
                            onChange={(e) => setQuizState(prev => ({
                              ...prev,
                              answers: { ...prev.answers, [qIndex]: parseInt(e.target.value) }
                            }))}
                            className="mr-3"
                          />
                          <span className="text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizState.answers).length < currentModeData.quiz.questions.length}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">Quiz Results</h4>
                <div className="text-2xl font-bold text-white mb-4">
                  Score: {Math.round(quizState.score)}%
                </div>
                <p className="text-gray-300">
                  You got {Math.round(quizState.score / 100 * currentModeData.quiz.questions.length)} out of {currentModeData.quiz.questions.length} questions correct.
                </p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'checklist' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Learning Checklist</h3>
            <div className="space-y-3">
              {currentModeData.checklist.map((item, index) => (
                <label key={index} className="flex items-center cursor-pointer p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklistState.completed[index] || false}
                    onChange={() => handleChecklistToggle(index)}
                    className="mr-3 h-4 w-4"
                  />
                  <span className={`${checklistState.completed[index] ? 'text-green-400' : 'text-white'}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

          {currentTab === 'submit' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-xl animate-pulse">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Submit Your Work! 🚀</h2>
                  <p className="text-yellow-300 text-lg">Show off what you've learned and earn your badge!</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 rounded-xl p-6 border border-yellow-500/30">
                <div className="prose prose-invert max-w-none prose-headings:text-yellow-300 prose-strong:text-amber-300">
                  <ReactMarkdown>{currentModeData.submit.prompt}</ReactMarkdown>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-white font-bold text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-yellow-400" />
                  Your Amazing Reflection:
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Share your thoughts about this AI adventure! What did you discover? What surprised you? 🤔✨"
                  className="w-full h-40 bg-gray-900 text-white rounded-xl p-4 border-2 border-yellow-500/30 focus:border-yellow-400 focus:outline-none transition-colors shadow-lg placeholder-gray-400"
                />
                <div className="text-sm text-gray-400">
                  {submissionText.length}/50 characters minimum
                </div>
              </div>

              {submissionText.length > 50 && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-400/5 animate-pulse"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="bg-green-500 p-3 rounded-full animate-bounce">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-green-300 mb-2">🎉 Mission Accomplished!</h4>
                      <p className="text-green-200 font-medium text-lg">
                        Badge Earned: <span className="text-yellow-300">{currentModeData.submit.badges_on_complete[0]}</span>
                      </p>
                      <p className="text-green-400 text-sm">You're officially an AI explorer! Keep up the amazing work! 🌟</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}