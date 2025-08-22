'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Python Environment...</div>
})

export default function TestPythonPage() {
  const [testResult, setTestResult] = useState<string>('')

  const simpleCode = 'print("Hello, future AI creator!")\nprint("Welcome to your Python journey!")'

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🐍 Python Execution Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Test Code:</h2>
          <pre className="text-cyan-200 font-mono text-sm bg-gray-900 rounded p-3 mb-4">
            {simpleCode}
          </pre>
          
          <CodeEditor
            initialCode={simpleCode}
            onCodeChange={() => {}}
            onExecutionResult={(result) => {
              const resultText = `
Success: ${result.success}
Output: ${result.output}
Error: ${result.error || 'None'}
Time: ${result.executionTime}ms
              `
              setTestResult(resultText)
            }}
          />
        </div>

        {testResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Execution Result:</h2>
            <pre className="text-green-300 font-mono text-sm bg-gray-900 rounded p-3">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}