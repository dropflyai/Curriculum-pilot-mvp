'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestDemoLogin() {
  const [status, setStatus] = useState<string>('Testing demo login...')
  const [demoUser, setDemoUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Clear any existing sessions
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_authenticated')
    
    // Test demo login
    testDemoLogin()
  }, [])

  const testDemoLogin = async () => {
    try {
      // Simulate demo login
      const mockUser = {
        id: 'demo-student',
        email: 'student@codefly.demo',
        full_name: 'Alex Demo Student',
        role: 'student'
      }
      
      localStorage.setItem('demo_user', JSON.stringify(mockUser))
      localStorage.setItem('demo_authenticated', 'true')
      
      setDemoUser(mockUser)
      setStatus('Demo login successful! Redirecting to dashboard in 3 seconds...')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      setStatus(`Error: ${error}`)
    }
  }

  const clearDemoSession = () => {
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_authenticated')
    setDemoUser(null)
    setStatus('Demo session cleared')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Demo Login Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 font-semibold mb-2">Status:</p>
            <p className="text-cyan-400">{status}</p>
          </div>
          
          {demoUser && (
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300 font-semibold mb-2">Demo User:</p>
              <pre className="text-green-400 text-sm">{JSON.stringify(demoUser, null, 2)}</pre>
            </div>
          )}
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 font-semibold mb-2">localStorage Contents:</p>
            <div className="text-sm text-gray-400">
              <p>demo_user: {localStorage.getItem('demo_user') ? '✓ Present' : '✗ Not found'}</p>
              <p>demo_authenticated: {localStorage.getItem('demo_authenticated') || 'Not set'}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={testDemoLogin}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Test Demo Login Again
            </button>
            
            <button
              onClick={clearDemoSession}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Clear Demo Session
            </button>
            
            <Link
              href="/auth"
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors inline-block"
            >
              Go to Auth Page
            </Link>
            
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}