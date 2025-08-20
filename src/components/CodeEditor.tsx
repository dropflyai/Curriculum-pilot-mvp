'use client'

import { useState, useEffect } from 'react'
import { Play, RotateCcw, AlertCircle, CheckCircle, Clock, Lightbulb, Eye, EyeOff } from 'lucide-react'

interface CodeExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

// Real Python execution using browser-only Pyodide
import { executeCode, runTests, validateCode } from '@/lib/python-executor'

interface CodeEditorProps {
  initialCode: string
  testCode?: string
  solution?: string
  hints?: string[]
  onCodeChange: (code: string) => void
  onExecutionResult?: (result: CodeExecutionResult) => void
}

export default function CodeEditor({ 
  initialCode, 
  testCode, 
  solution,
  hints = [],
  onCodeChange, 
  onExecutionResult 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<CodeExecutionResult | null>(null)
  const [currentHint, setCurrentHint] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lineNumbers, setLineNumbers] = useState<string[]>([])

  useEffect(() => {
    setCode(initialCode)
    updateLineNumbers(initialCode)
  }, [initialCode])
  
  const updateLineNumbers = (codeText: string) => {
    const lines = codeText.split('\n')
    setLineNumbers(lines.map((_, i) => (i + 1).toString().padStart(2, ' ')))
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    updateLineNumbers(newCode)
    onCodeChange(newCode)
  }

  const handleRun = async () => {
    // Validate code first
    const validation = validateCode(code)
    if (!validation.isValid) {
      setOutput(`❌ Code validation failed:\n${validation.errors.join('\n')}`)
      return
    }

    setIsRunning(true)
    setOutput('🐍 Starting Python execution...\n')

    try {
      const result = await executeCode(code)
      setLastResult(result)
      setAttempts(prev => prev + 1)
      
      if (result.success) {
        const teacherEncouragement = [
          "🤖 Excellent! Your code ran perfectly!",
          "🤖 Great job! I love seeing working code!",
          "🤖 Awesome! You're getting the hang of this!",
          "🤖 Perfect! You're becoming a real programmer!",
          "🤖 Wonderful! Your logic is spot on!"
        ][Math.floor(Math.random() * 5)]
        setOutput(`✅ Success! (${result.executionTime}ms)\n\n${teacherEncouragement}\n\n${result.output}`)
      } else {
        const smartError = getSmartErrorMessage(result.error || 'Unknown error')
        const teacherSupport = attempts < 3 ? 
          "🤖 Don't worry! Errors are how we learn. Read the message below and try again!" :
          "🤖 Still stuck? That's okay! Let me give you a hint to help you out."
        setOutput(`❌ Error! (${result.executionTime}ms)\n\n${teacherSupport}\n\n${smartError}`)
        
        // Auto-show hints after 3 attempts
        if (attempts >= 2 && hints.length > 0) {
          setShowHints(true)
        }
      }

      onExecutionResult?.(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setOutput(`💥 Execution failed:\n${errorMessage}`)
      setLastResult({
        success: false,
        output: '',
        error: errorMessage,
        executionTime: 0
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleRunTests = async () => {
    if (!testCode) {
      setOutput('❌ No tests available for this lesson')
      return
    }

    setIsRunning(true)
    setOutput('🧪 Running tests...\n')

    try {
      const result = await runTests(code, testCode)
      setLastResult(result)
      
      if (result.success) {
        const testSuccess = [
          "🤖 AMAZING! All tests passed! You've mastered this challenge!",
          "🤖 Perfect! Your code works exactly as expected!",
          "🤖 Brilliant! You solved it correctly!",
          "🤖 Outstanding! Your solution is spot-on!",
          "🤖 Excellent work! Ready for the next challenge!"
        ][Math.floor(Math.random() * 5)]
        setOutput(`✅ Tests completed! (${result.executionTime}ms)\n\n${testSuccess}\n\n${result.output}`)
      } else {
        const testEncouragement = "🤖 Not quite there yet, but you're learning! Check the test feedback and try again!"
        setOutput(`❌ Tests failed! (${result.executionTime}ms)\n\n${testEncouragement}\n\n${result.error || 'Test execution error'}`)
      }

      onExecutionResult?.(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setOutput(`💥 Test execution failed:\n${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput('')
    setLastResult(null)
    setCurrentHint(0)
    setShowHints(false)
    setShowSolution(false)
    setAttempts(0)
    updateLineNumbers(initialCode)
    onCodeChange(initialCode)
  }
  
  const getSmartErrorMessage = (error: string) => {
    const errorHelp: Record<string, string> = {
      'NameError': '💡 Hint: Check your variable names - make sure they\'re spelled correctly and defined before use!',
      'SyntaxError': '💡 Hint: Check your syntax - missing quotes, parentheses, or colons?',
      'IndentationError': '💡 Hint: Python is picky about spacing - make sure your indentation is consistent!',
      'TypeError': '💡 Hint: Check your data types - are you mixing numbers and text incorrectly?',
      'AttributeError': '💡 Hint: Check if you\'re calling the right method on your variable!'
    }
    
    for (const [errorType, hint] of Object.entries(errorHelp)) {
      if (error.includes(errorType)) {
        return `${error}\n\n${hint}`
      }
    }
    return error
  }
  
  const getNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(prev => prev + 1)
    }
    setShowHints(true)
  }
  
  const shouldShowHintButton = () => {
    return hints.length > 0 && (attempts >= 2 || (lastResult && !lastResult.success))
  }
  
  const shouldShowSolutionButton = () => {
    return solution && attempts >= 4
  }

  // Initialize Python environment
  useEffect(() => {
    setIsLoading(true)
    setOutput('🐍 Loading Python environment...')
    
    // Initialize Pyodide in the background
    import('@/lib/python-executor').then(({ initializePyodide }) => {
      initializePyodide()
        .then(() => {
          setIsLoading(false)
          setOutput('✅ Python environment ready! Click "Run Code" to execute your Python code.')
        })
        .catch((error) => {
          setIsLoading(false)
          setOutput(`❌ Failed to load Python environment: ${error.message}\nFalling back to basic code editing.`)
        })
    }).catch(() => {
      setIsLoading(false)
      setOutput('⚠️ Python execution not available. Code editing only.')
    })
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Code Editor */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Code Editor</h3>
              <p className="text-sm text-gray-600">Write your Python code here</p>
            </div>
            {lastResult && (
              <div className="flex items-center text-sm">
                {lastResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={lastResult.success ? 'text-green-600' : 'text-red-600'}>
                  {lastResult.success ? 'Success' : 'Error'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="relative">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 w-12 h-80 bg-gray-100 border-r border-gray-300 rounded-l-lg flex flex-col text-xs text-gray-500 font-mono pt-4 pl-2 overflow-hidden">
              {lineNumbers.map((num, i) => (
                <div key={i} className="leading-5 h-5">{num}</div>
              ))}
            </div>
            
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-80 font-mono text-sm border rounded-lg pl-16 pr-4 py-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="# Write your Python code here..."
              spellCheck={false}
              style={{ lineHeight: '1.25rem' }}
            />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleRun}
              disabled={isRunning || isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </button>

            {testCode && (
              <button
                onClick={handleRunTests}
                disabled={isRunning || isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={isRunning}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            
            {shouldShowHintButton() && (
              <button
                onClick={getNextHint}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHints ? `Hint ${currentHint + 1}/${hints.length}` : 'Get Hint'}
              </button>
            )}
            
            {shouldShowSolutionButton() && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                {showSolution ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            )}
          </div>

          {/* Hints Section */}
          {showHints && hints.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Hint {currentHint + 1}:</h4>
                  <p className="text-yellow-700">{hints[currentHint]}</p>
                  {currentHint < hints.length - 1 && (
                    <button
                      onClick={getNextHint}
                      className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 underline"
                    >
                      Need another hint?
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Solution Section */}
          {showSolution && solution && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start">
                <Eye className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 Solution:</h4>
                  <pre className="text-sm text-purple-700 bg-purple-100 p-3 rounded font-mono overflow-x-auto">{solution}</pre>
                  <p className="text-xs text-purple-600 mt-2">Try to understand how this solution works, then implement it yourself!</p>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-800">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading Python environment... This may take a moment on first load.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Output</h3>
              <p className="text-sm text-gray-600">Your program results</p>
            </div>
            {lastResult && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {lastResult.executionTime}ms
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="relative">
            <pre className="w-full h-80 font-mono text-sm border rounded-lg p-4 bg-gray-900 text-green-400 overflow-auto whitespace-pre-wrap">
              {output || 'Click "Run Code" to see output...'}
            </pre>
            
            {/* Attempt Counter */}
            <div className="absolute top-2 right-2 bg-gray-800/80 text-gray-400 text-xs px-2 py-1 rounded">
              Attempts: {attempts}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}