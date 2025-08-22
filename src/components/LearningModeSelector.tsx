'use client'

import { useState } from 'react'
import { BookOpen, Grid, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const SlideViewer = dynamic(() => import('./SlideViewer'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Slides...</div>
})

const FlashcardViewer = dynamic(() => import('./FlashcardViewer'), {
  ssr: false,  
  loading: () => <div className="text-white">Loading Flashcards...</div>
})

interface LessonSlide {
  id: string
  title: string
  content: string
  emoji?: string
}

interface Flashcard {
  id: string
  category: string
  front: string
  back: string
  emoji?: string
}

interface LearningModeSelectorProps {
  slides: LessonSlide[]
  flashcards: Flashcard[]
  onComplete?: () => void
}

export default function LearningModeSelector({ slides, flashcards, onComplete }: LearningModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'choose' | 'slides' | 'flashcards'>('choose')
  const [completedModes, setCompletedModes] = useState<Set<string>>(new Set())

  const handleModeComplete = (mode: string) => {
    const newCompleted = new Set([...completedModes, mode])
    setCompletedModes(newCompleted)
    
    // Now both modes are required for completion
    if (newCompleted.size >= 2) { // Need both modes for completion
      onComplete?.()
    }
  }

  const handleBackToChoice = () => {
    setSelectedMode('choose')
  }

  if (selectedMode === 'slides') {
    return (
      <div className="space-y-6">
        {/* Back to Choice Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBackToChoice}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Learning Options
          </button>
          <div className="text-emerald-400 font-semibold">📖 Slide Mode</div>
        </div>
        
        <SlideViewer 
          slides={slides}
          onAllSlidesComplete={() => handleModeComplete('slides')}
        />
      </div>
    )
  }

  if (selectedMode === 'flashcards') {
    return (
      <div className="space-y-6">
        {/* Back to Choice Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBackToChoice}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Learning Options
          </button>
          <div className="text-indigo-400 font-semibold">🎴 Flashcard Mode</div>
        </div>
        
        <FlashcardViewer 
          flashcards={flashcards}
          onComplete={() => handleModeComplete('flashcards')}
        />
      </div>
    )
  }

  // Mode Selection Screen
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800/30 to-blue-800/30 rounded-3xl p-8 border-2 border-emerald-500/30">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🎓</div>
          <h2 className="text-4xl font-bold text-white mb-4">Complete Both Learning Components</h2>
          <p className="text-emerald-200 text-xl mb-4">
            You need to complete BOTH modes to master all the essential knowledge:
          </p>
          <div className="bg-cyan-600/20 rounded-lg p-4 border border-cyan-500/30 mb-4">
            <p className="text-cyan-200 font-semibold">
              📖 <strong>Slides:</strong> AI Psychology & Creative Inspiration<br/>
              🎴 <strong>Flashcards:</strong> Key Vocabulary & Technical Terms
            </p>
          </div>
          <p className="text-emerald-300 font-semibold">
            Choose where to start - you can switch between them anytime!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Slides Option */}
          <button
            onClick={() => setSelectedMode('slides')}
            className="group bg-gradient-to-br from-emerald-700/30 to-green-700/30 rounded-2xl p-8 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:animate-bounce">📖</div>
              <h3 className="text-2xl font-bold text-white mb-3">Interactive Slides</h3>
              <p className="text-emerald-200 text-lg mb-4">
                Deep dive into AI psychology with behind-the-scenes code examples and creative inspiration
              </p>
              
              <div className="space-y-2 text-emerald-300 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <span>📚</span>
                  <span>{slides.length} slides to explore</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span>⏱️</span>
                  <span>~15 minutes</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span>🎯</span>
                  <span>Linear progression</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 font-semibold">
                Start with Slides <ArrowRight className="h-5 w-5" />
              </div>
              
              {completedModes.has('slides') && (
                <div className="mt-2 text-green-400 font-bold">✅ Completed!</div>
              )}
            </div>
          </button>

          {/* Flashcards Option */}
          <button
            onClick={() => setSelectedMode('flashcards')}
            className="group bg-gradient-to-br from-indigo-700/30 to-purple-700/30 rounded-2xl p-8 border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:animate-pulse">🎴</div>
              <h3 className="text-2xl font-bold text-white mb-3">Study Flashcards</h3>
              <p className="text-indigo-200 text-lg mb-4">
                Master key vocabulary and technical terms with definitions, context, and memory aids
              </p>
              
              <div className="space-y-2 text-indigo-300 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <span>🎴</span>
                  <span>{flashcards.length} flashcards to master</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span>⏱️</span>
                  <span>~10 minutes</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span>🔄</span>
                  <span>Self-paced review</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-indigo-400 font-semibold">
                Study Flashcards <ArrowRight className="h-5 w-5" />
              </div>
              
              {completedModes.has('flashcards') && (
                <div className="mt-2 text-green-400 font-bold">✅ Completed!</div>
              )}
            </div>
          </button>
        </div>

        {/* Requirement Notice */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="text-yellow-300 font-semibold mb-2">⚠️ Both Required for Completion</div>
            <p className="text-yellow-200 text-sm">
              <strong>Slides:</strong> Learn AI psychology and get creative inspiration<br/>
              <strong>Flashcards:</strong> Master technical vocabulary and key terms<br/>
              <span className="text-yellow-100 font-semibold">You must complete BOTH to proceed to coding!</span>
            </p>
          </div>
        </div>

        {/* Progress Summary */}
        {completedModes.size > 0 && (
          <div className="mt-6 text-center">
            <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-300 font-semibold mb-2">
                🎉 Learning Progress: {completedModes.size}/2 Components Complete
              </div>
              <div className="text-green-200 text-sm space-y-1">
                <div>📖 Slides: {completedModes.has('slides') ? '✅ Complete' : '⏳ Not Started'}</div>
                <div>🎴 Flashcards: {completedModes.has('flashcards') ? '✅ Complete' : '⏳ Not Started'}</div>
              </div>
              {completedModes.size >= 2 ? (
                <p className="text-green-100 font-bold text-sm mt-3">
                  🚀 All learning complete! Ready to return to the Adventure Map!
                </p>
              ) : (
                <p className="text-yellow-200 text-sm mt-3">
                  Complete {completedModes.has('slides') ? 'Flashcards' : completedModes.has('flashcards') ? 'Slides' : 'both modes'} to proceed to coding!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}