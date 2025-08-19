'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function APITest() {
  const [results, setResults] = useState<string>('')

  const testAPI = async (endpoint: string, method: string = 'GET', body?: unknown) => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      })
      
      const data = await response.json()
      return `${method} ${endpoint}: ${response.status}\n${JSON.stringify(data, null, 2)}\n\n`
    } catch (error) {
      return `${method} ${endpoint}: ERROR\n${error}\n\n`
    }
  }

  const runTests = async () => {
    setResults('Running API tests...\n\n')
    
    let output = ''
    
    // Test GET /api/lessons
    output += await testAPI('/api/lessons')
    
    // Test GET /api/lessons with week filter
    output += await testAPI('/api/lessons?week=1')
    
    // Test POST /api/lessons (create new lesson)
    const newLesson = {
      week: 99,
      title: 'Test Lesson',
      objectives: ['Test objective 1', 'Test objective 2'],
      learn_md: '# Test Lesson\nThis is a test lesson.',
      starter_code: 'print("Hello, test!")'
    }
    output += await testAPI('/api/lessons', 'POST', newLesson)
    
    setResults(output)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Testing</h1>
        
        <button
          onClick={runTests}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Run API Tests
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {results || 'Click "Run API Tests" to start testing...'}
          </pre>
        </div>
        
        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}