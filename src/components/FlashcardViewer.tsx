'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCw, Grid, BookOpen } from 'lucide-react'

interface Flashcard {
  id: string
  category: string
  front: string
  back: string
  emoji?: string
}

interface FlashcardViewerProps {
  flashcards: Flashcard[]
  onComplete?: () => void
  onReturnToModeSelection?: () => void
}

export default function FlashcardViewer({ flashcards, onComplete, onReturnToModeSelection }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCategoryView, setShowCategoryView] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set())

  // Get unique categories
  const categories = Array.from(new Set(flashcards.map(card => card.category)))
  
  // Filter cards by category if selected
  const displayCards = selectedCategory 
    ? flashcards.filter(card => card.category === selectedCategory)
    : flashcards

  const currentCard = displayCards[currentIndex]
  const progress = ((studiedCards.size / flashcards.length) * 100).toFixed(0)

  const handleNext = () => {
    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped && currentCard) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]))
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategoryView(false)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '4 Types of Help': 'from-blue-500 to-cyan-500',
      'Positive Thinking Science': 'from-purple-500 to-pink-500',
      'Programming Concepts': 'from-green-500 to-emerald-500',
      'Real-World Impact': 'from-orange-500 to-red-500',
      '7 Coding Steps': 'from-yellow-500 to-amber-500'
    }
    return colors[category] || 'from-gray-500 to-slate-500'
  }

  if (showCategoryView) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📚 Choose a Topic to Study
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {categories.map(category => {
              const categoryCards = flashcards.filter(card => card.category === category)
              const studiedInCategory = categoryCards.filter(card => studiedCards.has(card.id)).length
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`bg-gradient-to-r ${getCategoryColor(category)} p-6 rounded-xl text-white hover:scale-105 transition-transform duration-200 shadow-lg`}
                >
                  <h3 className="text-xl font-bold mb-2">{category}</h3>
                  <div className="text-sm opacity-90">
                    {categoryCards.length} cards • {studiedInCategory} studied
                  </div>
                  <div className="mt-3 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(studiedInCategory / categoryCards.length) * 100}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => {
              setSelectedCategory(null)
              setShowCategoryView(false)
              setCurrentIndex(0)
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-indigo-400 hover:to-purple-400 transition-colors"
          >
            Study All Cards
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6 bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">Study Progress</span>
          <span className="text-cyan-400 font-bold">{progress}% Complete</span>
        </div>
        <div className="bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <span>{studiedCards.size} / {flashcards.length} cards studied</span>
          {selectedCategory && <span className="text-cyan-400">{selectedCategory}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowCategoryView(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Grid className="h-4 w-4" />
          Topics
        </button>
        
        <div className="text-white font-semibold">
          Card {currentIndex + 1} of {displayCards.length}
        </div>
        
        <button
          onClick={() => {
            setCurrentIndex(0)
            setIsFlipped(false)
            setStudiedCards(new Set())
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RotateCw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="relative h-80">
          <div
            onClick={handleFlip}
            className={`absolute inset-0 w-full h-full transition-all duration-500 transform cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <div
              className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
                getCategoryColor(currentCard.category)
              } rounded-2xl p-8 flex flex-col justify-center items-center text-white shadow-2xl ${
                isFlipped ? 'invisible' : ''
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {currentCard.emoji && (
                <div className="text-6xl mb-4 animate-bounce">{currentCard.emoji}</div>
              )}
              <h3 className="text-2xl font-bold text-center">{currentCard.front}</h3>
              <p className="mt-4 text-sm opacity-75">Click to reveal answer</p>
            </div>

            {/* Back of card */}
            <div
              className={`absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 flex flex-col justify-center items-center text-white shadow-2xl border-2 border-cyan-500/30 ${
                !isFlipped ? 'invisible' : ''
              }`}
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <p className="text-lg leading-relaxed whitespace-pre-line">{currentCard.back}</p>
              </div>
              <p className="mt-4 text-sm text-cyan-400">Click to flip back</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            currentIndex === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <button
          onClick={handleFlip}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === displayCards.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            currentIndex === displayCards.length - 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Complete button when all cards are studied */}
      {studiedCards.size === flashcards.length && (
        <div className="mt-6 text-center">
          <div className="mb-4 text-6xl animate-bounce">🎉</div>
          <h3 className="text-2xl font-bold text-green-300 mb-2">Flashcards Complete!</h3>
          <p className="text-green-200 text-lg mb-6">
            Excellent! You've mastered all the vocabulary flashcards. Ready to try the slides too?
          </p>
          {onComplete && (
            <button
              onClick={() => {
                onComplete() // Mark flashcards as complete
                onReturnToModeSelection?.() // Return to mode selection
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🎴 Complete Flashcards & Choose Next Learning Mode
            </button>
          )}
        </div>
      )}
    </div>
  )
}