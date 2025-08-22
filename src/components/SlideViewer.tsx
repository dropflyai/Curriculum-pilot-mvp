'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface LessonSlide {
  id: string
  title: string
  content: string
  emoji?: string
}

interface SlideViewerProps {
  slides: LessonSlide[]
  onSlideComplete?: (slideId: string) => void
  onAllSlidesComplete?: () => void
  onReturnToModeSelection?: () => void
}

export default function SlideViewer({ slides, onSlideComplete, onAllSlidesComplete, onReturnToModeSelection }: SlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set())

  const currentSlide = slides[currentSlideIndex]
  const isLastSlide = currentSlideIndex === slides.length - 1
  const isFirstSlide = currentSlideIndex === 0

  const handleNext = () => {
    if (!isLastSlide) {
      // Mark current slide as completed
      const newCompleted = new Set([...completedSlides, currentSlide.id])
      setCompletedSlides(newCompleted)
      onSlideComplete?.(currentSlide.id)
      
      setCurrentSlideIndex(currentSlideIndex + 1)
    } else {
      // Mark last slide as completed
      const newCompleted = new Set([...completedSlides, currentSlide.id])
      setCompletedSlides(newCompleted)
      onSlideComplete?.(currentSlide.id)
      
      // When clicking "Complete Learning" on last slide, trigger completion
      if (newCompleted.size === slides.length) {
        onAllSlidesComplete?.()
      }
    }
  }

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
  }

  const getSlideStatus = (slideIndex: number) => {
    const slide = slides[slideIndex]
    if (completedSlides.has(slide.id)) return 'completed'
    if (slideIndex === currentSlideIndex) return 'current'
    if (slideIndex < currentSlideIndex) return 'available'
    return 'locked'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Slide Progress Bar */}
      <div className="mb-6 bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">Learning Progress</h3>
          <span className="text-emerald-400 font-bold">
            {Math.round((completedSlides.size / slides.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Slide Navigation Dots */}
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => {
            const status = getSlideStatus(index)
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                disabled={status === 'locked'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  status === 'completed'
                    ? 'bg-green-600 text-white'
                    : status === 'current'
                    ? 'bg-emerald-600 text-white'
                    : status === 'available'
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-lg">{slide.emoji || '📖'}</span>
                <span className="text-sm font-medium">{index + 1}</span>
                {status === 'completed' && <span className="text-xs">✓</span>}
              </button>
            )
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${(completedSlides.size / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Slide Content */}
      {currentSlide && (
        <div className="bg-gradient-to-br from-emerald-800/30 to-green-800/30 rounded-3xl p-8 border-2 border-emerald-500/30">
          {/* Slide Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-8xl animate-pulse">{currentSlide.emoji || '📖'}</div>
            <div>
              <h2 className="text-5xl font-bold text-white mb-2">{currentSlide.title}</h2>
              <p className="text-emerald-200 text-xl">
                Slide {currentSlideIndex + 1} of {slides.length}
              </p>
            </div>
          </div>
          
          {/* Slide Content */}
          <div className="bg-emerald-900/40 rounded-2xl p-8 border border-emerald-500/30">
            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-4xl font-bold text-white mb-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-3xl font-bold text-emerald-200 mb-4 mt-8">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-2xl font-bold text-emerald-300 mb-3 mt-6">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-xl font-bold text-emerald-400 mb-2 mt-4">{children}</h4>,
                  p: ({ children }) => <p className="text-white text-lg mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="text-white text-lg mb-4 space-y-2">{children}</ul>,
                  li: ({ children }) => <li className="text-emerald-100 leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="text-emerald-300 font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-emerald-400 italic">{children}</em>,
                  code: ({ children }) => <code className="bg-emerald-800/50 text-emerald-200 px-2 py-1 rounded text-sm">{children}</code>,
                }}
              >
                {currentSlide.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Slide Navigation Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={isFirstSlide}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isFirstSlide
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous Slide
        </button>

        <div className="text-center">
          <div className="text-white font-semibold text-lg">
            {currentSlide?.title}
          </div>
          <div className="text-emerald-400 text-sm">
            {currentSlideIndex + 1} of {slides.length} slides
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          {isLastSlide ? 'Complete Learning' : 'Next Slide'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Completion Message */}
      {completedSlides.size === slides.length && (
        <div className="mt-6 bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-2xl p-6 border border-green-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-300 mb-2">Slides Complete!</h3>
            <p className="text-green-200 text-lg mb-6">
              Great job! You've completed all the interactive slides. Ready to study the flashcards too?
            </p>
            <button
              onClick={() => {
                onAllSlidesComplete?.() // Mark slides as complete
                onReturnToModeSelection?.() // Return to mode selection
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              📚 Complete Slides & Choose Next Learning Mode
            </button>
          </div>
        </div>
      )}
    </div>
  )
}