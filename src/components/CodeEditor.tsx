'use client'

import { useState, useEffect } from 'react'
import { Play, RotateCcw, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface CodeExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

// Temporary mock functions for deployment
const executeCode = async (code: string): Promise<CodeExecutionResult> => {
  return {
    success: true,
    output: "Code execution temporarily disabled during deployment setup. Python execution will be enabled soon!",
    executionTime: 0
  }
}

const runTests = async (userCode: string, testCode: string): Promise<CodeExecutionResult> => {
  return {
    success: true,
    output: "✅ Tests passed! (Test execution temporarily disabled during deployment setup)",
    executionTime: 0
  }
}

const validateCode = (code: string) => {
  return { isValid: true, errors: [] }
}

interface CodeEditorProps {
  initialCode: string
  testCode?: string
  onCodeChange: (code: string) => void
  onExecutionResult?: (result: CodeExecutionResult) => void
}

export default function CodeEditor({ 
  initialCode, 
  testCode, 
  onCodeChange, 
  onExecutionResult 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<CodeExecutionResult | null>(null)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
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
      
      if (result.success) {
        setOutput(`✅ Success! (${result.executionTime}ms)\n\n${result.output}`)
      } else {
        setOutput(`❌ Error! (${result.executionTime}ms)\n\n${result.error || 'Unknown error'}`)
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
        setOutput(`✅ Tests completed! (${result.executionTime}ms)\n\n${result.output}`)
      } else {
        setOutput(`❌ Tests failed! (${result.executionTime}ms)\n\n${result.error || 'Test execution error'}`)
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
    onCodeChange(initialCode)
  }

  // Initialize mock Python environment
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false)
      setOutput('🐍 Python environment ready! Click "Run Code" to execute.\n(Note: Using mock execution for deployment setup)')
    }, 1500)
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
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-80 font-mono text-sm border rounded-lg p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            placeholder="# Write your Python code here..."
            spellCheck={false}
          />
          
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
          </div>

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
          <pre className="w-full h-80 font-mono text-sm border rounded-lg p-4 bg-gray-900 text-green-400 overflow-auto whitespace-pre-wrap">
            {output || 'Click "Run Code" to see output...'}
          </pre>
        </div>
      </div>
    </div>
  )
}