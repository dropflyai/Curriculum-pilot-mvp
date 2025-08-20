'use client'

import { useState } from 'react'
import { Play, Copy, Check, RotateCcw } from 'lucide-react'

interface InteractiveCodeExampleProps {
  code: string
  title?: string
  description?: string
  editable?: boolean
  showOutput?: boolean
}

export default function InteractiveCodeExample({ 
  code, 
  title = "Try this code:", 
  description,
  editable = true,
  showOutput = true 
}: InteractiveCodeExampleProps) {
  const [currentCode, setCurrentCode] = useState(code)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    setOutput('🐍 Running...')
    
    try {
      // Simulate code execution for common examples
      let result = simulateExecution(currentCode)
      
      setTimeout(() => {
        setOutput(result)
        setIsRunning(false)
      }, 500) // Small delay for better UX
    } catch (error) {
      setOutput(`❌ Error: ${error}`)
      setIsRunning(false)
    }
  }

  const simulateExecution = (codeToRun: string): string => {
    // Simple simulation for educational examples
    const lines = codeToRun.split('\n').filter(line => line.trim())
    let result = ''
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Handle print statements
      if (trimmedLine.startsWith('print(')) {
        const match = trimmedLine.match(/print\((.*)\)/)
        if (match) {
          let content = match[1]
          
          // Handle different print formats
          if (content.startsWith('"') && content.endsWith('"')) {
            // String literal
            result += content.slice(1, -1) + '\n'
          } else if (content.startsWith("'") && content.endsWith("'")) {
            // String literal with single quotes
            result += content.slice(1, -1) + '\n'
          } else if (content.includes('f"') || content.includes("f'")) {
            // F-string (simplified)
            result += content.replace(/f["'](.*)["']/, '$1') + '\n'
          } else {
            // Variable or expression
            result += `${content}\n`
          }
        }
      }
      
      // Handle variable assignments
      if (trimmedLine.includes(' = ')) {
        const [variable, value] = trimmedLine.split(' = ')
        if (value.startsWith('"') || value.startsWith("'")) {
          result += `✅ Set ${variable.trim()} = ${value}\n`
        } else {
          result += `✅ Set ${variable.trim()} = ${value}\n`
        }
      }
      
      // Handle input() - simulate user input
      if (trimmedLine.includes('input(')) {
        const match = trimmedLine.match(/input\((.*)\)/)
        if (match) {
          const prompt = match[1].replace(/['"]/g, '')
          result += `${prompt} [User would type here]\n`
        }
      }
    }
    
    return result || '✅ Code executed successfully!'
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.warn('Failed to copy code:', error)
    }
  }

  const resetCode = () => {
    setCurrentCode(code)
    setOutput('')
  }

  return (
    <div className="my-6 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg flex items-center">
              <span className="text-xl mr-2">💻</span>
              {title}
            </h4>
            {description && (
              <p className="text-blue-100 text-sm mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCode}
              className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors text-sm"
              title="Copy code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            {editable && (
              <button
                onClick={resetCode}
                className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors text-sm"
                title="Reset code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-3 py-2 text-gray-300 text-sm font-medium">
                Code
              </div>
              <textarea
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                readOnly={!editable}
                className="w-full h-32 p-3 bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none"
                style={{ lineHeight: '1.4' }}
              />
            </div>
            
            <button
              onClick={runCode}
              disabled={isRunning}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
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
          </div>

          {/* Output */}
          {showOutput && (
            <div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-3 py-2 text-gray-300 text-sm font-medium">
                  Output
                </div>
                <div className="h-32 p-3 bg-gray-900 text-green-400 font-mono text-sm overflow-auto whitespace-pre-wrap">
                  {output || 'Click "Run Code" to see output...'}
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">💡 Try it:</span> Modify the code above and run it to see how changes affect the output!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}