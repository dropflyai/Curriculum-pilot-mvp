'use client'

import { useState, useEffect } from 'react'
import { AILesson, LessonMode } from '@/lib/lesson-data'
import dynamic from 'next/dynamic'

const AIClassifierTrainer = dynamic(() => import('./AIClassifierTrainer'), {
  ssr: false,
  loading: () => <div className="text-white">Loading AI Classifier...</div>
})
import { BookOpen, Code, CheckSquare, HelpCircle, Upload, Award } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'tests', label: 'Tests', icon: CheckSquare },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'submit', label: 'Submit', icon: Upload }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Lesson Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
        <p className="text-gray-400 mb-4">{lesson.description}</p>
        
        {/* Standards */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Standards Alignment:</h3>
          <div className="space-y-1">
            {lesson.standards.map((standard, index) => (
              <div key={index} className="text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded">
                {standard}
              </div>
            ))}
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleModeSwitch('main')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentMode === 'main'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Main: {lesson.modes[0]?.title}
          </button>
          <button
            onClick={() => handleModeSwitch('bonus')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentMode === 'bonus'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Bonus: {lesson.modes[1]?.title}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                currentTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">Progress</span>
          <span className="text-sm font-bold text-white">{Math.round(calculateProgress())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {currentTab === 'learn' && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{currentModeData.learn_md}</ReactMarkdown>
          </div>
        )}

        {currentTab === 'code' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AI Classifier Training</h3>
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <pre className="text-green-400 text-sm overflow-x-auto">
                {currentModeData.code.starter}
              </pre>
            </div>
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
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Project Submission</h3>
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{currentModeData.submit.prompt}</ReactMarkdown>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Your Reflection:</label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {submissionText.length > 50 && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">
                    Submission Complete! Badge Earned: {currentModeData.submit.badges_on_complete[0]}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}