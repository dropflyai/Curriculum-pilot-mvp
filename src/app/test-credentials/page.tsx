'use client'

import { useState } from 'react'

export default function TestCredentialsPage() {
  const [results, setResults] = useState<string[]>([])

  const testAccounts = [
    { email: 'student@test.com', password: 'test123', role: 'student', fullName: 'Test Student' },
    { email: 'teacher@test.com', password: 'test123', role: 'teacher', fullName: 'Test Teacher' },
    { email: 'admin@test.com', password: 'test123', role: 'admin', fullName: 'Test Admin' },
    { email: 'student@codefly.demo', password: 'CodeFly2025!Student$', role: 'student', fullName: 'Demo Student' },
    { email: 'teacher@codefly.demo', password: 'CodeFly2025!Teacher$', role: 'teacher', fullName: 'Demo Teacher' }
  ]

  const testCredential = (email: string, password: string) => {
    const account = testAccounts.find(acc => 
      acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    )
    
    if (account) {
      return `✅ SUCCESS: ${email} → ${account.role}`
    } else {
      return `❌ FAILED: ${email} (invalid credentials)`
    }
  }

  const runAllTests = () => {
    const testResults = [
      testCredential('teacher@codefly.demo', 'demo123'),
      testCredential('teacher@codefly.demo', 'demo 123'),
      testCredential('teacher@codefly.demo', 'CodeFly2025!Teacher$'),
      testCredential('student@codefly.demo', 'CodeFly2025!Student$'),
      testCredential('teacher@test.com', 'test123'),
      testCredential('student@test.com', 'test123'),
    ]
    setResults(testResults)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🔐 CodeFly Credential Tester</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Available Test Accounts</h2>
          <div className="space-y-2 font-mono text-sm">
            {testAccounts.map((acc, i) => (
              <div key={i} className="bg-gray-700 p-3 rounded">
                <div className="text-blue-300">📧 {acc.email}</div>
                <div className="text-green-300">🔑 ••••••••••••••</div>
                <div className="text-yellow-300">👤 {acc.role}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded">
            <div className="text-red-300 text-sm">
              🔒 <strong>Security Notice:</strong> Passwords are hidden for security. Use the credentials below for testing.
            </div>
          </div>
        </div>

        <button 
          onClick={runAllTests}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold mb-6"
        >
          🧪 Test All Credential Combinations
        </button>

        {results.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            <div className="space-y-2 font-mono text-sm">
              {results.map((result, i) => (
                <div key={i} className={result.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🎯 Quick Access</h2>
          <p className="mb-4">Copy and paste these working credentials:</p>
          <div className="space-y-3 font-mono text-sm">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-blue-300">Teacher Login:</div>
              <div className="text-white">teacher@codefly.demo</div>
              <div className="text-white">CodeFly2025!Teacher$</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-blue-300">Student Login:</div>
              <div className="text-white">student@codefly.demo</div>
              <div className="text-white">CodeFly2025!Student$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}