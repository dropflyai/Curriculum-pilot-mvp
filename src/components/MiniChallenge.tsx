'use client'

import { useState } from 'react'
import { CheckCircle, Target, Lightbulb, Trophy } from 'lucide-react'

interface MiniChallengeProps {
  challenge: string
  hint?: string
  solution: string
  points?: number
  onComplete?: () => void
}

export default function MiniChallenge({ 
  challenge, 
  hint, 
  solution, 
  points = 10,
  onComplete 
}: MiniChallengeProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const checkAnswer = () => {
    setAttempts(prev => prev + 1)
    
    // Simple answer checking (can be made more sophisticated)
    const normalizedAnswer = userAnswer.toLowerCase().trim()
    const normalizedSolution = solution.toLowerCase().trim()
    
    if (normalizedAnswer.includes(normalizedSolution) || normalizedAnswer === normalizedSolution) {
      setIsComplete(true)
      onComplete?.()
    } else if (attempts >= 2) {
      setShowHint(true)
    }
  }

  const revealSolution = () => {
    setShowSolution(true)
    setIsComplete(true)
    onComplete?.()
  }

  if (isComplete) {
    return (
      <div className="my-6 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3 animate-bounce" />
            <div>
              <h4 className="text-lg font-bold text-green-800">Challenge Complete! 🎉</h4>
              <p className="text-green-700">Great job! You earned {points} XP points.</p>
            </div>
          </div>
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
            +{points} XP
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-medium">💡 What you learned:</p>
          <p className="text-green-700 text-sm mt-1">
            This challenge helped you practice {challenge.toLowerCase()}. 
            Keep practicing to build your coding confidence!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-6 bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-300 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-6 w-6 mr-3" />
            <h4 className="text-lg font-bold">🎯 Mini Challenge</h4>
          </div>
          <div className="bg-purple-500 px-3 py-1 rounded-full text-sm font-bold">
            {points} XP
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Challenge Description */}
        <div className="mb-4">
          <p className="text-purple-800 font-medium text-lg">{challenge}</p>
        </div>

        {/* Answer Input */}
        <div className="mb-4">
          <label className="block text-purple-700 font-medium mb-2">
            Your Answer:
          </label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Type your answer here..."
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          />
        </div>

        {/* Hint Section */}
        {showHint && hint && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-yellow-800">💡 Hint:</h5>
                <p className="text-yellow-700 text-sm mt-1">{hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Solution Section */}
        {showSolution && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-800">✅ Solution:</h5>
                <p className="text-blue-700 text-sm mt-1 font-mono bg-blue-100 p-2 rounded">
                  {solution}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Check Answer
          </button>
          
          {attempts >= 2 && hint && (
            <button
              onClick={() => setShowHint(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Show Hint
            </button>
          )}
          
          {attempts >= 3 && (
            <button
              onClick={revealSolution}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Show Solution
            </button>
          )}
        </div>

        {/* Attempt Counter */}
        <div className="mt-4 text-right text-sm text-purple-600">
          Attempts: {attempts}
        </div>
      </div>
    </div>
  )
}