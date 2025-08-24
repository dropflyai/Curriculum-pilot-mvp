'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, RotateCcw, Trophy, Brain, Shuffle } from 'lucide-react'

interface VocabularyTerm {
  id: string
  term: string
  definition: string
  category: 'core' | 'data' | 'ethics' | 'tools'
}

interface VocabularyMatcherProps {
  onComplete?: (score: number) => void
}

const vocabularyTerms: VocabularyTerm[] = [
  // Core AI/ML Terms
  {
    id: 'ml',
    term: 'Machine Learning',
    definition: 'Teaching computers to learn patterns from examples, like showing a child hundreds of dog photos to recognize breeds',
    category: 'core'
  },
  {
    id: 'ai',
    term: 'Artificial Intelligence',
    definition: 'Any computer system that can do things we normally think require human intelligence',
    category: 'core'
  },
  {
    id: 'training',
    term: 'Training',
    definition: 'When the AI studies examples in the dataset and learns to recognize patterns',
    category: 'core'
  },
  {
    id: 'inference',
    term: 'Inference',
    definition: 'When we show the AI new images it has never seen before to test what it learned',
    category: 'core'
  },
  
  // Data & Performance Terms
  {
    id: 'dataset',
    term: 'Dataset',
    definition: 'A collection of examples for the AI to learn from, like a textbook full of practice problems',
    category: 'data'
  },
  {
    id: 'labels',
    term: 'Labels',
    definition: 'The "correct answers" that tell the AI what each image shows',
    category: 'data'
  },
  {
    id: 'accuracy',
    term: 'Accuracy',
    definition: 'What percentage of predictions the AI got correct, like a test score',
    category: 'data'
  },
  {
    id: 'confusion-matrix',
    term: 'Confusion Matrix',
    definition: 'A detailed report showing exactly which items the AI confuses with each other',
    category: 'data'
  },
  
  // Ethics & Fairness Terms
  {
    id: 'representativeness',
    term: 'Representativeness',
    definition: 'Making sure your dataset includes fair examples of everything you want the AI to recognize',
    category: 'ethics'
  },
  {
    id: 'bias',
    term: 'Bias',
    definition: 'When an AI system works better for some groups than others (unfair performance)',
    category: 'ethics'
  },
  {
    id: 'fairness',
    term: 'Fairness',
    definition: 'Ensuring AI systems work equally well for all users and situations',
    category: 'ethics'
  }
]

export default function VocabularyMatcher({ onComplete }: VocabularyMatcherProps) {
  const [gameMode, setGameMode] = useState<'flashcards' | 'match'>('flashcards')
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null)
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set())
  const [incorrectMatches, setIncorrectMatches] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const [shuffledTerms, setShuffledTerms] = useState<VocabularyTerm[]>([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState<VocabularyTerm[]>([])
  
  // Interactive study mode states
  const [currentCategory, setCurrentCategory] = useState<'core' | 'data' | 'ethics' | 'all'>('all')
  const [studyProgress, setStudyProgress] = useState<Set<string>>(new Set())
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [masteredTerms, setMasteredTerms] = useState<Set<string>>(new Set())
  const [selfTestMode, setSelfTestMode] = useState(false)

  // Shuffle arrays
  const shuffleArray = (array: VocabularyTerm[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled arrays
  useEffect(() => {
    setShuffledTerms(shuffleArray(vocabularyTerms))
    setShuffledDefinitions(shuffleArray(vocabularyTerms))
  }, [])

  const resetGame = () => {
    setMatches({})
    setSelectedTerm(null)
    setSelectedDefinition(null)
    setCorrectMatches(new Set())
    setIncorrectMatches(new Set())
    setShowResults(false)
    setShuffledTerms(shuffleArray(vocabularyTerms))
    setShuffledDefinitions(shuffleArray(vocabularyTerms))
  }

  const handleTermClick = (termId: string) => {
    if (correctMatches.has(termId)) return
    
    if (selectedTerm === termId) {
      setSelectedTerm(null)
    } else {
      setSelectedTerm(termId)
      if (selectedDefinition) {
        makeMatch(termId, selectedDefinition)
      }
    }
  }

  const handleDefinitionClick = (termId: string) => {
    if (correctMatches.has(termId)) return
    
    if (selectedDefinition === termId) {
      setSelectedDefinition(null)
    } else {
      setSelectedDefinition(termId)
      if (selectedTerm) {
        makeMatch(selectedTerm, termId)
      }
    }
  }

  const makeMatch = (termId: string, definitionId: string) => {
    const newMatches = { ...matches, [termId]: definitionId }
    setMatches(newMatches)
    
    if (termId === definitionId) {
      // Correct match
      setCorrectMatches(prev => new Set([...prev, termId]))
      setIncorrectMatches(prev => {
        const newSet = new Set(prev)
        newSet.delete(termId)
        return newSet
      })
    } else {
      // Incorrect match
      setIncorrectMatches(prev => new Set([...prev, termId]))
      setCorrectMatches(prev => {
        const newSet = new Set(prev)
        newSet.delete(termId)
        return newSet
      })
    }
    
    setSelectedTerm(null)
    setSelectedDefinition(null)
    
    // Check if all terms are matched
    if (Object.keys(newMatches).length === vocabularyTerms.length) {
      setTimeout(() => {
        setShowResults(true)
        const score = Math.round((correctMatches.size / vocabularyTerms.length) * 100)
        if (onComplete) onComplete(score)
      }, 500)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'from-blue-500 to-cyan-500'
      case 'data': return 'from-green-500 to-emerald-500'
      case 'ethics': return 'from-purple-500 to-pink-500'
      case 'tools': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'core': return 'Core AI/ML'
      case 'data': return 'Data & Performance'
      case 'ethics': return 'Ethics & Fairness'
      case 'tools': return 'Tools & Categories'
      default: return 'General'
    }
  }

  // Get terms for current category
  const getFilteredTerms = () => {
    return currentCategory === 'all' 
      ? vocabularyTerms 
      : vocabularyTerms.filter(term => term.category === currentCategory)
  }

  // Mark term as studied
  const markTermAsStudied = (termId: string) => {
    setStudyProgress(prev => new Set([...prev, termId]))
  }

  // Mark term as mastered
  const markTermAsMastered = (termId: string) => {
    setMasteredTerms(prev => new Set([...prev, termId]))
    setStudyProgress(prev => new Set([...prev, termId]))
  }

  if (gameMode === 'flashcards') {
    const filteredTerms = getFilteredTerms()
    const currentTerm = filteredTerms[currentFlashcard]
    
    if (!currentTerm) {
      return (
        <div className="text-center p-8">
          <p className="text-white">No terms available for this category.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* AI Vocabulary Mastery Center Header */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-2xl font-bold text-white">AI Vocabulary Mastery Center</h3>
                <p className="text-indigo-200">Interactive learning with flashcards and quizzes!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-300">
                {studyProgress.size}/{vocabularyTerms.length}
              </div>
              <div className="text-sm text-indigo-400">Terms Studied</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-300">Study Progress</span>
              <span className="text-sm text-indigo-300">{Math.round((studyProgress.size / vocabularyTerms.length) * 100)}%</span>
            </div>
            <div className="w-full bg-indigo-900/50 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(studyProgress.size / vocabularyTerms.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-3">
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              🃏 Interactive Flashcards
            </button>
            <button
              onClick={() => setGameMode('match')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              🎯 Take Matching Quiz
            </button>
          </div>
        </div>

        {/* Flashcard Section Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🃏</div>
              <div>
                <h4 className="text-xl font-bold text-white">Flashcard Study Mode</h4>
                <p className="text-purple-200 text-sm">Click cards to flip • Use arrows to navigate</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-300">
                Card {currentFlashcard + 1} of {filteredTerms.length}
              </div>
              <div className="text-sm text-purple-400">{getCategoryName(currentTerm.category)}</div>
            </div>
          </div>
        </div>

        {/* Interactive Flashcard */}
        <div className="flip-card-container mx-auto max-w-2xl">
          <div 
            className={`flip-card w-full min-h-[400px] cursor-pointer ${showDefinition ? 'flipped' : ''}`}
            onClick={() => setShowDefinition(!showDefinition)}
          >
            {/* Front of Card - Term */}
            <div className={`flip-card-front rounded-2xl p-8 border-2 bg-gradient-to-br ${getCategoryColor(currentTerm.category)} shadow-2xl flex items-center justify-center min-h-[400px]`}>
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🧠</div>
                <h4 className="text-4xl font-bold text-white mb-4">{currentTerm.term}</h4>
                <p className="text-white/80 text-lg">Click to see definition →</p>
              </div>
            </div>

            {/* Back of Card - Definition */}
            <div className="flip-card-back rounded-2xl p-6 border-2 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-2xl flex flex-col justify-center min-h-[400px]">
              <div className="space-y-4">
                {/* Term Header */}
                <div className="text-center mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(currentTerm.category)} text-white font-medium`}>
                    {getCategoryName(currentTerm.category)}
                  </span>
                </div>
                <h5 className="text-2xl font-bold text-white text-center mb-4">{currentTerm.term}</h5>
                
                {/* Definition Box */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 text-base leading-relaxed">{currentTerm.definition}</p>
                </div>
                
                {/* Memory Tip */}
                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                  <h6 className="text-purple-300 font-semibold text-sm mb-1">💡 Remember:</h6>
                  <p className="text-purple-200 text-sm">
                    {currentTerm.id === 'ml' && "Machine = Computer, Learning = Getting smarter"}
                    {currentTerm.id === 'ai' && "Artificial (fake) + Intelligence (smart)"}
                    {currentTerm.id === 'training' && "Like training for sports - practice!"}
                    {currentTerm.id === 'inference' && "Detective making inferences from clues"}
                    {currentTerm.id === 'dataset' && "Collection of examples to learn from"}
                    {currentTerm.id === 'labels' && "Name tags that tell you who is who"}
                    {currentTerm.id === 'accuracy' && "Your test score - how many correct?"}
                    {currentTerm.id === 'confusion-matrix' && "Report card showing where you got confused"}
                    {currentTerm.id === 'representativeness' && "Everyone is included fairly"}
                    {currentTerm.id === 'bias' && "Unfairly better for some than others"}
                    {currentTerm.id === 'fairness' && "Treating everyone equally"}
                  </p>
                </div>
                
                <div className="text-xs text-gray-400 text-center mt-2">
                  Click to flip back ← | Use arrows for navigation →
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                setCurrentFlashcard(Math.max(0, currentFlashcard - 1))
                setShowDefinition(false)
              }}
              disabled={currentFlashcard === 0}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => markTermAsStudied(currentTerm.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📖 Studied
              </button>
              <button
                onClick={() => markTermAsMastered(currentTerm.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ✅ Mastered
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentFlashcard(Math.min(filteredTerms.length - 1, currentFlashcard + 1))
                setShowDefinition(false)
              }}
              disabled={currentFlashcard === filteredTerms.length - 1}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {filteredTerms.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFlashcard(index)
                  setShowDefinition(false)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFlashcard
                    ? 'bg-purple-500 scale-125'
                    : masteredTerms.has(filteredTerms[index].id)
                      ? 'bg-green-500'
                      : studyProgress.has(filteredTerms[index].id)
                        ? 'bg-blue-500'
                        : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Vocabulary Mastery Center Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-indigo-400 animate-pulse" />
            <div>
              <h3 className="text-2xl font-bold text-white">AI Vocabulary Mastery Center</h3>
              <p className="text-indigo-200">Interactive learning with flashcards and quizzes!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-300">
              {correctMatches.size}/{vocabularyTerms.length}
            </div>
            <div className="text-sm text-indigo-400">Correct Matches</div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-3">
          <button
            onClick={() => setGameMode('flashcards')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            🃏 Interactive Flashcards
          </button>
          <button
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            🎯 Take Matching Quiz
          </button>
        </div>
      </div>

      {/* Quiz Section Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-purple-400" />
            <div>
              <h4 className="text-xl font-bold text-white">Vocabulary Matching Challenge</h4>
              <p className="text-purple-200 text-sm">Match each term with its correct definition</p>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Quiz
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-white text-sm">
            Progress: {correctMatches.size}/{vocabularyTerms.length} correct
          </div>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(correctMatches.size / vocabularyTerms.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Matching Game */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terms Column */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📝</span> Terms
          </h4>
          <div className="space-y-3">
            {shuffledTerms.map(term => (
              <button
                key={`term-${term.id}`}
                onClick={() => handleTermClick(term.id)}
                disabled={correctMatches.has(term.id)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 border-2 ${
                  correctMatches.has(term.id)
                    ? 'bg-green-800/50 border-green-500 text-green-200 cursor-not-allowed'
                    : incorrectMatches.has(term.id)
                      ? 'bg-red-800/50 border-red-500 text-red-200 hover:bg-red-700/50'
                      : selectedTerm === term.id
                        ? 'bg-blue-700 border-blue-400 text-white'
                        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{term.term}</span>
                  {correctMatches.has(term.id) && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {incorrectMatches.has(term.id) && <X className="h-5 w-5 text-red-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Definitions Column */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📖</span> Definitions
          </h4>
          <div className="space-y-3">
            {shuffledDefinitions.map(term => (
              <button
                key={`def-${term.id}`}
                onClick={() => handleDefinitionClick(term.id)}
                disabled={correctMatches.has(term.id)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 border-2 ${
                  correctMatches.has(term.id)
                    ? 'bg-green-800/50 border-green-500 text-green-200 cursor-not-allowed'
                    : incorrectMatches.has(term.id) && matches[Object.keys(matches).find(k => matches[k] === term.id) || ''] === term.id
                      ? 'bg-red-800/50 border-red-500 text-red-200 hover:bg-red-700/50'
                      : selectedDefinition === term.id
                        ? 'bg-blue-700 border-blue-400 text-white'
                        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{term.definition}</span>
                  {correctMatches.has(term.id) && <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 ml-2" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {correctMatches.size === vocabularyTerms.length ? '🏆' : 
                 correctMatches.size >= vocabularyTerms.length * 0.8 ? '🌟' : 
                 correctMatches.size >= vocabularyTerms.length * 0.6 ? '👍' : '💪'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {correctMatches.size === vocabularyTerms.length ? 'Perfect Score!' :
                 correctMatches.size >= vocabularyTerms.length * 0.8 ? 'Excellent Work!' :
                 correctMatches.size >= vocabularyTerms.length * 0.6 ? 'Good Job!' : 'Keep Practicing!'}
              </h3>
              <p className="text-gray-300 mb-6">
                You matched {correctMatches.size} out of {vocabularyTerms.length} terms correctly
              </p>
              <div className="text-4xl font-bold text-white mb-6">
                {Math.round((correctMatches.size / vocabularyTerms.length) * 100)}%
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setGameMode('flashcards')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Study More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}