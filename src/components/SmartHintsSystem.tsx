'use client'

import { useState, useEffect } from 'react'
import { 
  Lightbulb, 
  ChevronRight, 
  ChevronDown, 
  Target, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Brain,
  Code,
  HelpCircle
} from 'lucide-react'

interface Hint {
  id: string
  title: string
  description: string
  type: 'concept' | 'syntax' | 'debug' | 'optimization' | 'next-step'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  code?: string
  example?: string
  revealed: boolean
  contextScore: number // 0-100 how relevant to current context
}

interface SmartHintsSystemProps {
  currentCode: string
  errorMessage?: string
  lessonContext?: {
    id: string
    title: string
    concepts: string[]
    difficulty: string
  }
  onHintUsed?: (hintId: string) => void
}

export default function SmartHintsSystem({
  currentCode,
  errorMessage,
  lessonContext,
  onHintUsed
}: SmartHintsSystemProps) {
  const [hints, setHints] = useState<Hint[]>([])
  const [expandedHint, setExpandedHint] = useState<string | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showAll, setShowAll] = useState(false)

  // Generate contextual hints based on current state
  useEffect(() => {
    const generateHints = () => {
      const newHints: Hint[] = []

      // Syntax error hints
      if (errorMessage) {
        if (errorMessage.includes('SyntaxError')) {
          newHints.push({
            id: 'syntax-error',
            title: 'Syntax Error Detected',
            description: 'There\'s a syntax issue in your code. Look for missing colons, parentheses, or indentation problems.',
            type: 'syntax',
            difficulty: 'beginner',
            revealed: false,
            contextScore: 95,
            example: `# Common syntax fixes:
if condition:  # Don't forget the colon
    print("Hello")  # Proper indentation`
          })
        }
        
        if (errorMessage.includes('IndentationError')) {
          newHints.push({
            id: 'indentation-error',
            title: 'Indentation Problem',
            description: 'Python uses indentation to define code blocks. Make sure your indentation is consistent.',
            type: 'syntax',
            difficulty: 'beginner',
            revealed: false,
            contextScore: 98,
            example: `# Correct indentation:
def my_function():
    if True:
        print("Properly indented")
        return True`
          })
        }
      }

      // Code analysis hints
      if (currentCode) {
        // Check for common patterns
        if (currentCode.includes('class') && !currentCode.includes('def __init__')) {
          newHints.push({
            id: 'class-constructor',
            title: 'Add Constructor Method',
            description: 'Classes typically need an __init__ method to initialize their properties.',
            type: 'concept',
            difficulty: 'intermediate',
            revealed: false,
            contextScore: 85,
            code: `def __init__(self, parameters):
    self.property = parameters`
          })
        }

        if (currentCode.includes('def') && !currentCode.includes('return')) {
          newHints.push({
            id: 'function-return',
            title: 'Consider Return Statement',
            description: 'Your function might need to return a value to be more useful.',
            type: 'concept',
            difficulty: 'beginner',
            revealed: false,
            contextScore: 70,
            example: `def calculate_area(width, height):
    area = width * height
    return area  # Return the calculated value`
          })
        }

        if (currentCode.length > 0 && !currentCode.includes('print')) {
          newHints.push({
            id: 'add-output',
            title: 'Add Output to See Results',
            description: 'Use print() statements to see what your code is doing.',
            type: 'debug',
            difficulty: 'beginner',
            revealed: false,
            contextScore: 60,
            code: `print("Debug info:", variable_name)`
          })
        }
      }

      // Lesson-specific hints
      if (lessonContext) {
        if (lessonContext.concepts.includes('variables')) {
          newHints.push({
            id: 'variables-tip',
            title: 'Variable Naming Best Practices',
            description: 'Use descriptive names for your variables to make code more readable.',
            type: 'concept',
            difficulty: 'beginner',
            revealed: false,
            contextScore: 75,
            example: `# Good variable names:
student_age = 20
total_score = 95

# Avoid:
a = 20
x = 95`
          })
        }

        if (lessonContext.concepts.includes('loops')) {
          newHints.push({
            id: 'loop-optimization',
            title: 'Efficient Loop Usage',
            description: 'Consider using list comprehensions for simple transformations.',
            type: 'optimization',
            difficulty: 'intermediate',
            revealed: false,
            contextScore: 80,
            example: `# List comprehension (more efficient):
squares = [x**2 for x in range(10)]

# Traditional loop:
squares = []
for x in range(10):
    squares.append(x**2)`
          })
        }
      }

      // Next step suggestions
      if (currentCode && currentCode.length > 50) {
        newHints.push({
          id: 'next-steps',
          title: 'Ready for Next Challenge?',
          description: 'You\'re making good progress! Consider adding error handling or more features.',
          type: 'next-step',
          difficulty: 'intermediate',
          revealed: false,
          contextScore: 65,
          example: `try:
    # Your existing code here
    result = risky_operation()
except Exception as e:
    print(f"Error occurred: {e}")
    # Handle the error gracefully`
        })
      }

      // Sort by contextScore (most relevant first)
      newHints.sort((a, b) => b.contextScore - a.contextScore)
      setHints(newHints)
    }

    generateHints()
  }, [currentCode, errorMessage, lessonContext])

  const revealHint = (hintId: string) => {
    setHints(prev => prev.map(hint => 
      hint.id === hintId 
        ? { ...hint, revealed: true }
        : hint
    ))
    setHintsUsed(prev => prev + 1)
    onHintUsed?.(hintId)
  }

  const toggleHintExpansion = (hintId: string) => {
    setExpandedHint(expandedHint === hintId ? null : hintId)
  }

  const getHintIcon = (type: Hint['type']) => {
    switch (type) {
      case 'concept': return <Brain className="h-4 w-4" />
      case 'syntax': return <Code className="h-4 w-4" />
      case 'debug': return <AlertCircle className="h-4 w-4" />
      case 'optimization': return <Zap className="h-4 w-4" />
      case 'next-step': return <Target className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getHintColor = (type: Hint['type']) => {
    switch (type) {
      case 'concept': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      case 'syntax': return 'text-red-400 border-red-500/30 bg-red-500/10'
      case 'debug': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'optimization': return 'text-green-400 border-green-500/30 bg-green-500/10'
      case 'next-step': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10'
    }
  }

  const relevantHints = showAll ? hints : hints.filter(h => h.contextScore > 70)

  return (
    <div className="bg-slate-900 border border-green-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <h3 className="text-green-300 font-medium">Smart Hints</h3>
          <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">
            {hintsUsed} used
          </span>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-green-400 hover:text-green-300 transition-colors"
        >
          {showAll ? 'Show Relevant' : 'Show All'} ({hints.length})
        </button>
      </div>

      {relevantHints.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-300">Great job! No hints needed right now.</p>
          <p className="text-green-500/70 text-sm">Keep coding and hints will appear as needed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {relevantHints.map((hint) => (
            <div
              key={hint.id}
              className={`border rounded-lg p-3 transition-all ${getHintColor(hint.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-0.5">
                    {getHintIcon(hint.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{hint.title}</h4>
                      <span className="text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded">
                        {hint.difficulty}
                      </span>
                      <span className="text-xs opacity-70">
                        {hint.contextScore}% relevant
                      </span>
                    </div>
                    
                    {hint.revealed ? (
                      <div className="space-y-2">
                        <p className="text-sm opacity-90">{hint.description}</p>
                        
                        {(hint.code || hint.example) && (
                          <div className="bg-black/30 rounded p-3 mt-2">
                            <pre className="text-xs font-mono text-green-300 whitespace-pre-wrap">
                              {hint.code || hint.example}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm opacity-70">Click to reveal hint...</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-2">
                  {!hint.revealed && (
                    <button
                      onClick={() => revealHint(hint.id)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                    >
                      Reveal
                    </button>
                  )}
                  
                  {(hint.code || hint.example) && hint.revealed && (
                    <button
                      onClick={() => toggleHintExpansion(hint.id)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {expandedHint === hint.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hints.length > 3 && (
        <div className="mt-4 pt-3 border-t border-green-500/20">
          <div className="flex items-center justify-between text-xs text-green-500/70">
            <span>Hints adapt based on your code and errors</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Real-time updates</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}