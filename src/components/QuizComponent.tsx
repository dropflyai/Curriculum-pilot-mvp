'use client'

import { useState } from 'react'
import { CheckCircle, Clock, ArrowRight } from 'lucide-react'

interface QuizItem {
  type: 'mcq' | 'short'
  q: string
  options?: string[]
  answer?: string
  explanation?: string
}

interface QuizComponentProps {
  quizItems: QuizItem[]
  onQuizComplete: (results: QuizResults) => void
}

export interface QuizResults {
  answers: Record<number, string>
  score: number
  totalQuestions: number
  timeSpent: number
  feedback: string[]
}

export default function QuizComponent({ quizItems, onQuizComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())
  const [results, setResults] = useState<QuizResults | null>(null)

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const nextQuestion = () => {
    if (currentQuestion < quizItems.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishQuiz = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    let score = 0
    const feedback: string[] = []

    // Grade the quiz
    quizItems.forEach((item, index) => {
      const userAnswer = answers[index]?.toLowerCase().trim()
      const correctAnswer = item.answer?.toLowerCase().trim()

      if (item.type === 'mcq') {
        if (userAnswer === correctAnswer) {
          score++
          feedback.push(`Question ${index + 1}: ✅ Correct!`)
        } else {
          feedback.push(`Question ${index + 1}: ❌ Incorrect. Correct answer: ${item.answer}`)
        }
      } else if (item.type === 'short') {
        // For short answers, we'll give credit if they provided an answer
        // In a real system, this might need teacher review
        if (userAnswer && userAnswer.length > 10) {
          score += 0.5 // Partial credit for attempting
          feedback.push(`Question ${index + 1}: ✓ Answer submitted for review`)
        } else {
          feedback.push(`Question ${index + 1}: ⚠️ No answer provided`)
        }
      }
    })

    const quizResults: QuizResults = {
      answers,
      score,
      totalQuestions: quizItems.length,
      timeSpent,
      feedback
    }

    setResults(quizResults)
    setShowResults(true)
    onQuizComplete(quizResults)
  }

  const currentItem = quizItems[currentQuestion]
  const progress = ((currentQuestion + 1) / quizItems.length) * 100

  if (showResults && results) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">
            You scored {results.score} out of {results.totalQuestions} questions
          </p>
        </div>

        {/* Score Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((results.score / results.totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>
        </div>

        {/* Enhanced Feedback with Explanations */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Detailed Feedback:</h3>
          <div className="space-y-4">
            {quizItems.map((item, index) => {
              const userAnswer = results.answers[index]
              const isCorrect = item.type === 'mcq' ? 
                userAnswer?.toLowerCase().trim() === item.answer?.toLowerCase().trim() :
                userAnswer && userAnswer.length > 10
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{item.q}</h4>
                      
                      {item.type === 'mcq' && (
                        <div className="mb-3">
                          <p className={`text-sm mb-1 ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            Your answer: <span className="font-semibold">{userAnswer || 'No answer'}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700">
                              Correct answer: <span className="font-semibold">{item.answer}</span>
                            </p>
                          )}
                        </div>
                      )}
                      
                      {item.type === 'short' && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Your response:</p>
                          <p className="text-sm bg-gray-100 p-2 rounded italic">
                            {userAnswer || 'No response provided'}
                          </p>
                        </div>
                      )}
                      
                      {item.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                          <div className="flex items-start">
                            <div className="text-blue-500 mr-2 text-lg">💡</div>
                            <div>
                              <h5 className="font-medium text-blue-900 mb-1">Why this matters:</h5>
                              <p className="text-sm text-blue-800">{item.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {quizItems.length}
          </span>
          <span className="text-sm text-gray-500">
            <Clock className="inline h-4 w-4 mr-1" />
            {Math.floor((Date.now() - startTime) / 1000 / 60)}m
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentItem.q}
        </h3>

        {currentItem.type === 'mcq' && currentItem.options && (
          <div className="space-y-3">
            {currentItem.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentItem.type === 'short' && (
          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your answer here..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {quizItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestion
                  ? 'bg-blue-600'
                  : answers[index]
                  ? 'bg-green-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextQuestion}
          disabled={!answers[currentQuestion]}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === quizItems.length - 1 ? 'Finish Quiz' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}