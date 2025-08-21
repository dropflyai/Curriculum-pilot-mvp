'use client'

import { useState } from 'react'
import { Check, X, HelpCircle } from 'lucide-react'

interface ConceptCheckProps {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  emoji?: string
}

export default function ConceptCheck({ question, options, correctAnswer, explanation, emoji }: ConceptCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === correctAnswer

  return (
    <div className="my-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <HelpCircle className="h-6 w-6 text-purple-400" />
        <h4 className="text-purple-300 font-semibold">Quick Concept Check</h4>
      </div>
      
      <p className="text-white mb-4 text-lg">{question}</p>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showResult}
            className={`w-full p-3 text-left rounded-lg border transition-all ${
              showResult
                ? index === correctAnswer
                  ? 'bg-green-900/30 border-green-500 text-green-300'
                  : selectedAnswer === index
                    ? 'bg-red-900/30 border-red-500 text-red-300'
                    : 'bg-gray-700/50 border-gray-600 text-gray-400'
                : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {showResult && index === correctAnswer && <Check className="h-5 w-5 text-green-400" />}
              {showResult && selectedAnswer === index && index !== correctAnswer && <X className="h-5 w-5 text-red-400" />}
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-blue-900/20 border border-blue-500/30'
        }`}>
          <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-300' : 'text-blue-300'}`}>
            {isCorrect ? '🎉 Correct!' : '🤔 Not quite, but great thinking!'}
          </p>
          <p className="text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  )
}