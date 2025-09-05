'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain, 
  Trophy, 
  Zap, 
  Target,
  ArrowRight,
  RefreshCw,
  Award,
  Star
} from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  concept: string
}

interface QuizProps {
  weekNumber: number
  questions: QuizQuestion[]
  onComplete: (score: number, xpEarned: number) => void
}

export default function WeekCompletionQuiz({ weekNumber, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Timer
  useEffect(() => {
    if (!quizStarted || showResults || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      handleSubmitQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const handleSubmitQuiz = () => {
    const correctAnswers = questions.filter((q, index) => 
      selectedAnswers[index] === q.correctAnswer
    ).length
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    const xpEarned = Math.max(50, finalScore * 2) // Minimum 50 XP, max 200 XP
    
    setScore(finalScore)
    setShowResults(true)
    onComplete(finalScore, xpEarned)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setTimeLeft(600)
    setQuizStarted(false)
    setScore(0)
    setShowExplanation(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! You have mastered this material!'
    if (score >= 80) return 'Great job! You have a solid understanding.'
    if (score >= 70) return 'Good work! Consider reviewing some concepts.'
    if (score >= 60) return 'You passed, but more practice would help.'
    return 'Keep studying and try again. You\'ve got this!'
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Week {weekNumber} Knowledge Check
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Test your understanding of the concepts you've learned this week. 
                This quiz will help reinforce your knowledge and identify areas for review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <Target className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{questions.length}</div>
                <div className="text-sm text-gray-300">Questions</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">10</div>
                <div className="text-sm text-gray-300">Minutes</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50-200</div>
                <div className="text-sm text-gray-300">XP Reward</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Brain className="h-6 w-6" />
                <span>Start Quiz</span>
              </button>
              
              <p className="text-gray-400 text-sm">
                💡 Take your time and read each question carefully. You can navigate between questions before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
              
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
                {score}%
              </div>
              
              <p className="text-xl text-gray-300 mb-6">
                {getScoreMessage(score)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-green-300">Correct</div>
              </div>
              
              <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
                <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">
                  {questions.filter((q, i) => selectedAnswers[i] !== q.correctAnswer).length}
                </div>
                <div className="text-sm text-red-300">Incorrect</div>
              </div>
              
              <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {Math.max(50, score * 2)}
                </div>
                <div className="text-sm text-yellow-300">XP Earned</div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Detailed Results */}
              <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Question Review</h3>
                
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const isCorrect = selectedAnswers[index] === question.correctAnswer
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${
                        isCorrect 
                          ? 'bg-green-600/10 border-green-500/30' 
                          : 'bg-red-600/10 border-red-500/30'
                      }`}>
                        <div className="flex items-start space-x-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                          )}
                          
                          <div className="flex-1">
                            <p className="text-white font-medium mb-2">
                              Q{index + 1}: {question.question}
                            </p>
                            
                            <div className="text-sm space-y-1">
                              <p className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                                Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                              </p>
                              
                              {!isCorrect && (
                                <p className="text-green-300">
                                  Correct answer: {question.options[question.correctAnswer]}
                                </p>
                              )}
                              
                              <p className="text-gray-400 mt-2">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg text-purple-400 font-medium transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Retake Quiz</span>
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <Award className="h-5 w-5" />
                  <span>Continue Learning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Week {weekNumber} Knowledge Check
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>•</span>
                <span>Concept: {currentQ.concept}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-yellow-400 font-mono text-lg font-bold mb-2">
                <Clock className="h-5 w-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-300">Time remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-cyan-400 bg-cyan-400'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && selectedAnswers[currentQuestion] !== undefined && (
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-400 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Trophy className="h-5 w-5" />
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}