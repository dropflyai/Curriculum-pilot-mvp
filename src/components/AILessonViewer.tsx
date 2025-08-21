'use client'

import { useState, useEffect } from 'react'
import { AILesson, LessonMode } from '@/lib/lesson-data'
import dynamic from 'next/dynamic'

const AIClassifierTrainer = dynamic(() => import('./AIClassifierTrainer'), {
  ssr: false,
  loading: () => <div className="text-white">Loading AI Classifier...</div>
})
import { BookOpen, Code, CheckSquare, HelpCircle, Upload, Award, Sparkles, Brain, Zap, Target } from 'lucide-react'
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

  const tabs = [
    { id: 'learn', label: 'Learn', icon: BookOpen, color: 'emerald', emoji: '📚' },
    { id: 'code', label: 'Code', icon: Code, color: 'blue', emoji: '🧠' },
    { id: 'tests', label: 'Tests', icon: CheckSquare, color: 'orange', emoji: '🎯' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'purple', emoji: '❓' },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare, color: 'pink', emoji: '✅' },
    { id: 'submit', label: 'Submit', icon: Upload, color: 'yellow', emoji: '🚀' }
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
        
          {/* Standards */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Florida Standards Alignment 🎯
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {lesson.standards.map((standard, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-cyan-500/30 px-4 py-2 rounded-xl">
                  <span className="text-sm text-cyan-100 font-medium">{standard}</span>
                </div>
              ))}
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

      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-2xl p-4 mb-8 border border-gray-600 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tabs.map((tab, index) => {
            const isActive = currentTab === tab.id
            const colorClasses = {
              emerald: isActive ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25' : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20',
              blue: isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25' : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
              orange: isActive ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/25' : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20',
              purple: isActive ? 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/25' : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
              pink: isActive ? 'bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg shadow-pink-500/25' : 'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20',
              yellow: isActive ? 'bg-gradient-to-r from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/25' : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`group relative p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border ${
                  colorClasses[tab.color as keyof typeof colorClasses]
                } ${isActive ? 'text-white' : 'text-gray-300'}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`text-2xl ${isActive ? 'animate-bounce' : 'group-hover:animate-pulse'}`}>
                    {tab.emoji}
                  </div>
                  <tab.icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-semibold">{tab.label}</span>
                </div>
                
                {/* Progress indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl p-6 mb-8 border border-cyan-500/30 shadow-xl overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 right-8 animate-ping">
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-3 left-12 animate-ping animation-delay-300">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          </div>
          <div className="absolute top-4 left-20 animate-ping animation-delay-700">
            <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mission Progress</h3>
                <p className="text-sm text-gray-400">Keep going, you're doing amazing! 🌟</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {Math.round(calculateProgress())}%
              </span>
              {calculateProgress() >= 100 && (
                <div className="animate-bounce">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative w-full bg-gray-700 rounded-full h-4 shadow-inner">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${calculateProgress()}%` }}
            >
              {/* Progress bar animation */}
              <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
              {/* Progress sparkle effect */}
              {calculateProgress() > 0 && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress milestones */}
          <div className="flex justify-between mt-2 text-xs">
            <span className={`font-medium ${calculateProgress() >= 0 ? 'text-cyan-400' : 'text-gray-500'}`}>
              Start 🚀
            </span>
            <span className={`font-medium ${calculateProgress() >= 25 ? 'text-blue-400' : 'text-gray-500'}`}>
              Learning 📚
            </span>
            <span className={`font-medium ${calculateProgress() >= 50 ? 'text-purple-400' : 'text-gray-500'}`}>
              Coding 🧠
            </span>
            <span className={`font-medium ${calculateProgress() >= 75 ? 'text-pink-400' : 'text-gray-500'}`}>
              Testing 🎯
            </span>
            <span className={`font-medium ${calculateProgress() >= 100 ? 'text-yellow-400' : 'text-gray-500'}`}>
              Complete ✨
            </span>
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
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-xl animate-pulse">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Let's Learn! 📚</h2>
                  <p className="text-green-300 text-lg">Get ready to explore the amazing world of AI</p>
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
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl animate-pulse">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Time to Code! 🧠</h2>
                  <p className="text-blue-300 text-lg">Train your first AI model and see the magic happen!</p>
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