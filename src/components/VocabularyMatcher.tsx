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
  const [gameMode, setGameMode] = useState<'study' | 'match'>('study')
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null)
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set())
  const [incorrectMatches, setIncorrectMatches] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const [shuffledTerms, setShuffledTerms] = useState<VocabularyTerm[]>([])
  const [shuffledDefinitions, setShuffledDefinitions] = useState<VocabularyTerm[]>([])

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

  if (gameMode === 'study') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-indigo-400" />
            <h3 className="text-2xl font-bold text-white">AI Vocabulary Study Guide</h3>
          </div>
          <p className="text-indigo-200 mb-4">
            Learn these essential AI and machine learning terms before taking the matching quiz!
          </p>
          <button
            onClick={() => setGameMode('match')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            🎯 Take Matching Quiz
          </button>
        </div>

        {/* Terms by Category */}
        {['core', 'data', 'ethics'].map(category => (
          <div key={category} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className={`text-xl font-bold mb-4 bg-gradient-to-r ${getCategoryColor(category)} bg-clip-text text-transparent`}>
              {getCategoryName(category)} Terms
            </h4>
            <div className="space-y-4">
              {vocabularyTerms
                .filter(term => term.category === category)
                .map(term => (
                  <div key={term.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <h5 className="text-lg font-semibold text-white mb-2">{term.term}</h5>
                    <p className="text-gray-300">{term.definition}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Vocabulary Matching Challenge</h3>
              <p className="text-purple-200">Match each term with its correct definition</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGameMode('study')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📚 Study Mode
            </button>
            <button
              onClick={resetGame}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-white">
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
                  onClick={() => setGameMode('study')}
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