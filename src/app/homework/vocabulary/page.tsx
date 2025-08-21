'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Target, Trophy } from 'lucide-react'
import VocabularyMatcher from '@/components/VocabularyMatcher'

export default function VocabularyHomework() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const handleComplete = (finalScore: number) => {
    setScore(finalScore)
    setIsCompleted(true)
    // Save completion to localStorage
    localStorage.setItem('homework-vocabulary-completed', 'true')
    localStorage.setItem('homework-vocabulary-score', finalScore.toString())
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Section 1 - Homework</h1>
                <p className="text-sm text-gray-400">AI Vocabulary Mastery Assignment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">🧠</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">AI Vocabulary Mastery</h2>
              <p className="text-purple-200 text-lg">Master essential AI terminology and concepts</p>
            </div>
          </div>

          {/* Assignment Instructions */}
          <div className="bg-purple-900/40 rounded-lg p-6 border border-purple-500/30 mb-6">
            <h3 className="text-purple-300 font-bold text-xl mb-4">📋 Assignment Instructions</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-800/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <h4 className="text-purple-200 font-semibold">Step 1: Study</h4>
                </div>
                <p className="text-purple-300/80">Review all 11 AI vocabulary terms and their definitions in Study Mode</p>
              </div>
              <div className="bg-purple-800/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <h4 className="text-purple-200 font-semibold">Step 2: Practice</h4>
                </div>
                <p className="text-purple-300/80">Complete the interactive matching quiz to test your knowledge</p>
              </div>
              <div className="bg-purple-800/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-purple-400" />
                  <h4 className="text-purple-200 font-semibold">Step 3: Master</h4>
                </div>
                <p className="text-purple-300/80">Achieve 80% or higher to complete the assignment</p>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          {isCompleted && (
            <div className="bg-green-900/40 rounded-lg p-6 border border-green-500/30">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="text-green-300 font-bold text-xl">Assignment Completed! 🎉</h3>
                  <p className="text-green-200">
                    Great work! You scored {score}% on the vocabulary quiz.
                    {score >= 90 ? " Outstanding mastery!" : score >= 80 ? " Excellent work!" : " Keep practicing to improve!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary Component */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <VocabularyMatcher onComplete={handleComplete} />
        </div>

        {/* Return Link */}
        {isCompleted && (
          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Trophy className="h-5 w-5" />
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}