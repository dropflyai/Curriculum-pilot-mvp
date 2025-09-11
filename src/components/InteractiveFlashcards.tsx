'use client'

import { useState, useEffect } from 'react'
import { 
  RotateCcw, 
  Check, 
  X, 
  Brain, 
  Trophy, 
  Clock, 
  BarChart3,
  Shuffle,
  Play,
  Pause,
  SkipForward,
  Star,
  Target
} from 'lucide-react'

interface Flashcard {
  id: string
  question: string
  answer: string
  category: 'syntax' | 'concepts' | 'debugging' | 'best-practices' | 'algorithms'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  codeExample?: string
  hint?: string
  tags: string[]
  
  // Spaced repetition data
  repetitionLevel: number // 0-5
  lastReviewed: Date
  nextReview: Date
  easinessFactor: number // 1.3-2.5
  correctStreak: number
  totalReviews: number
  correctReviews: number
}

interface InteractiveFlashcardsProps {
  lessonContext?: {
    id: string
    concepts: string[]
    difficulty: string
  }
  onProgress?: (stats: StudyStats) => void
}

interface StudyStats {
  cardsStudied: number
  correctAnswers: number
  streak: number
  timeSpent: number
  difficultyDistribution: Record<string, number>
}

export default function InteractiveFlashcards({
  lessonContext,
  onProgress
}: InteractiveFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState<'practice' | 'review' | 'challenge'>('practice')
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayDelay, setAutoplayDelay] = useState(5000)
  const [studyStats, setStudyStats] = useState<StudyStats>({
    cardsStudied: 0,
    correctAnswers: 0,
    streak: 0,
    timeSpent: 0,
    difficultyDistribution: {}
  })
  const [sessionStartTime] = useState(Date.now())

  // Initialize flashcards based on lesson context
  useEffect(() => {
    const generateFlashcards = (): Flashcard[] => {
      const baseCards: Omit<Flashcard, 'repetitionLevel' | 'lastReviewed' | 'nextReview' | 'easinessFactor' | 'correctStreak' | 'totalReviews' | 'correctReviews'>[] = [
        // Python Basics
        {
          id: 'python-variables',
          question: 'How do you create a variable in Python?',
          answer: 'Just assign a value: variable_name = value. Python automatically determines the type.',
          category: 'syntax',
          difficulty: 'beginner',
          codeExample: `name = "Alice"
age = 25
is_student = True`,
          tags: ['variables', 'assignment', 'types']
        },
        {
          id: 'python-functions',
          question: 'What is the syntax for defining a function in Python?',
          answer: 'Use the def keyword followed by function name and parameters',
          category: 'syntax',
          difficulty: 'beginner',
          codeExample: `def greet(name):
    return f"Hello, {name}!"

def calculate_area(width, height):
    return width * height`,
          tags: ['functions', 'def', 'parameters']
        },
        {
          id: 'python-classes',
          question: 'How do you create a class in Python?',
          answer: 'Use the class keyword and typically include an __init__ method',
          category: 'concepts',
          difficulty: 'intermediate',
          codeExample: `class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def study(self):
        return f"{self.name} is studying"`,
          tags: ['classes', 'objects', '__init__', 'self']
        },
        {
          id: 'list-comprehension',
          question: 'What is a more Pythonic way to create a list of squares?',
          answer: 'Use list comprehension: [x**2 for x in range(10)]',
          category: 'best-practices',
          difficulty: 'intermediate',
          codeExample: `# Instead of:
squares = []
for x in range(10):
    squares.append(x**2)

# Use:
squares = [x**2 for x in range(10)]`,
          hint: 'List comprehensions are more readable and often faster',
          tags: ['list-comprehension', 'loops', 'pythonic']
        },
        {
          id: 'error-handling',
          question: 'How do you handle errors in Python?',
          answer: 'Use try-except blocks to catch and handle exceptions',
          category: 'debugging',
          difficulty: 'intermediate',
          codeExample: `try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    print("This always runs")`,
          tags: ['error-handling', 'try-except', 'exceptions']
        },
        // AI/ML Concepts
        {
          id: 'ai-agent-definition',
          question: 'What is an AI agent?',
          answer: 'A software entity that perceives its environment and takes actions to achieve goals',
          category: 'concepts',
          difficulty: 'beginner',
          hint: 'Think about the perception-action cycle',
          tags: ['ai', 'agents', 'perception', 'actions']
        },
        {
          id: 'machine-learning-types',
          question: 'What are the three main types of machine learning?',
          answer: 'Supervised, Unsupervised, and Reinforcement Learning',
          category: 'concepts',
          difficulty: 'intermediate',
          hint: 'Think about whether you have labels, no labels, or rewards',
          tags: ['machine-learning', 'supervised', 'unsupervised', 'reinforcement']
        },
        // Debugging
        {
          id: 'debug-print',
          question: 'What\'s the simplest way to debug Python code?',
          answer: 'Add print() statements to see variable values and program flow',
          category: 'debugging',
          difficulty: 'beginner',
          codeExample: `def calculate_average(numbers):
    print(f"Input: {numbers}")  # Debug input
    total = sum(numbers)
    print(f"Total: {total}")     # Debug calculation
    average = total / len(numbers)
    print(f"Average: {average}") # Debug result
    return average`,
          tags: ['debugging', 'print', 'troubleshooting']
        },
        // Algorithms
        {
          id: 'binary-search',
          question: 'What is the time complexity of binary search?',
          answer: 'O(log n) - because we eliminate half the search space each iteration',
          category: 'algorithms',
          difficulty: 'advanced',
          hint: 'Think about how many times you can divide n by 2',
          tags: ['algorithms', 'binary-search', 'time-complexity', 'big-o']
        }
      ]

      // Filter cards based on lesson context
      let relevantCards = baseCards
      if (lessonContext) {
        relevantCards = baseCards.filter(card => 
          lessonContext.concepts.some(concept => 
            card.tags.includes(concept.toLowerCase()) ||
            card.category === concept.toLowerCase()
          )
        )
      }

      // Add spaced repetition data
      return relevantCards.map(card => ({
        ...card,
        repetitionLevel: 0,
        lastReviewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random last review
        nextReview: new Date(),
        easinessFactor: 2.5,
        correctStreak: 0,
        totalReviews: 0,
        correctReviews: 0
      }))
    }

    setFlashcards(generateFlashcards())
  }, [lessonContext])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !showAnswer) {
      interval = setInterval(() => {
        setShowAnswer(true)
        setTimeout(() => {
          handleNext()
        }, autoplayDelay / 2)
      }, autoplayDelay)
    }
    return () => clearInterval(interval)
  }, [isPlaying, showAnswer, currentCardIndex])

  const currentCard = flashcards[currentCardIndex]

  const calculateNextReview = (easiness: number, repetition: number): Date => {
    let interval = 1
    if (repetition === 1) interval = 6
    else if (repetition > 1) interval = Math.round(interval * easiness)
    
    return new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
  }

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return

    const updatedCard = { ...currentCard }
    updatedCard.totalReviews++
    
    if (correct) {
      updatedCard.correctReviews++
      updatedCard.correctStreak++
      updatedCard.repetitionLevel++
      
      // Adjust easiness factor (SM-2 algorithm)
      if (updatedCard.repetitionLevel > 1) {
        updatedCard.easinessFactor = Math.max(1.3, 
          updatedCard.easinessFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02))
        )
      }
    } else {
      updatedCard.correctStreak = 0
      updatedCard.repetitionLevel = 0
      updatedCard.easinessFactor = Math.max(1.3, updatedCard.easinessFactor - 0.2)
    }

    updatedCard.lastReviewed = new Date()
    updatedCard.nextReview = calculateNextReview(updatedCard.easinessFactor, updatedCard.repetitionLevel)

    // Update flashcards
    setFlashcards(prev => prev.map(card => 
      card.id === currentCard.id ? updatedCard : card
    ))

    // Update study stats
    setStudyStats(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      streak: correct ? prev.streak + 1 : 0,
      timeSpent: Date.now() - sessionStartTime,
      difficultyDistribution: {
        ...prev.difficultyDistribution,
        [currentCard.difficulty]: (prev.difficultyDistribution[currentCard.difficulty] || 0) + 1
      }
    }))

    onProgress?.(studyStats)
    
    setTimeout(() => {
      handleNext()
    }, 1000)
  }

  const handleNext = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const shuffleCards = () => {
    setFlashcards(prev => [...prev].sort(() => Math.random() - 0.5))
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  const getCategoryColor = (category: Flashcard['category']) => {
    switch (category) {
      case 'syntax': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'concepts': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'debugging': return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'best-practices': return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'algorithms': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getDifficultyColor = (difficulty: Flashcard['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (!currentCard) {
    return (
      <div className="bg-slate-900 border border-green-500/30 rounded-lg p-6 text-center">
        <Brain className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-green-300 text-lg mb-2">No Flashcards Available</h3>
        <p className="text-green-500/70">Start coding to unlock flashcards for your lesson!</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-green-500/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-green-400" />
          <h3 className="text-green-300 font-medium">Interactive Flashcards</h3>
          <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">
            {currentCardIndex + 1} / {flashcards.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded transition-colors"
            title={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button
            onClick={shuffleCards}
            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded transition-colors"
            title="Shuffle cards"
          >
            <Shuffle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{studyStats.cardsStudied}</div>
          <div className="text-xs text-green-500/70">Studied</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {studyStats.cardsStudied > 0 ? Math.round((studyStats.correctAnswers / studyStats.cardsStudied) * 100) : 0}%
          </div>
          <div className="text-xs text-green-500/70">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">{studyStats.streak}</div>
          <div className="text-xs text-green-500/70">Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">
            {Math.round(studyStats.timeSpent / 60000)}m
          </div>
          <div className="text-xs text-green-500/70">Time</div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6 min-h-[300px] flex flex-col">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(currentCard.category)}`}>
              {currentCard.category}
            </span>
            <span className={`text-xs ${getDifficultyColor(currentCard.difficulty)}`}>
              {currentCard.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: currentCard.repetitionLevel }).map((_, i) => (
              <Star key={i} className="h-3 w-3 text-yellow-400" fill="currentColor" />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="text-lg text-green-300 mb-4">{currentCard.question}</h4>
          
          {showAnswer && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                <p className="text-green-100">{currentCard.answer}</p>
              </div>
              
              {currentCard.hint && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <p className="text-blue-100 text-sm">💡 {currentCard.hint}</p>
                </div>
              )}
              
              {currentCard.codeExample && (
                <div className="bg-black/50 rounded p-4">
                  <pre className="text-sm text-green-300 whitespace-pre-wrap">
                    {currentCard.codeExample}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-4">
          {currentCard.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-700 text-green-400 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-green-300 rounded transition-colors"
        >
          Previous
        </button>

        <div className="flex items-center space-x-3">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Show Answer
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Incorrect</span>
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Correct</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-green-300 rounded transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}