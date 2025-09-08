'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SimpleAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    console.log('🔐 Simple Auth - Attempting login with:', { email, password })
    
    // Super simple hardcoded check
    if (email === 'teacher@codefly.demo' && password === 'demo123') {
      console.log('✅ SUCCESS: Teacher login')
      setMessage('✅ SUCCESS: Teacher login successful!')
      
      // Set simple cookie and redirect
      document.cookie = `user_role=teacher; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      document.cookie = `user_email=${email}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      
      setTimeout(() => router.push('/teacher'), 1000)
      return
    }
    
    if (email === 'student@codefly.demo' && password === 'demo123') {
      console.log('✅ SUCCESS: Student login')
      setMessage('✅ SUCCESS: Student login successful!')
      
      // Set simple cookie and redirect
      document.cookie = `user_role=student; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      document.cookie = `user_email=${email}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      
      setTimeout(() => router.push('/games'), 1000)
      return
    }

    // Try the complex passwords
    if (email === 'teacher@codefly.demo' && password === 'CodeFly2025!Teacher$') {
      console.log('✅ SUCCESS: Teacher login (complex password)')
      setMessage('✅ SUCCESS: Teacher login successful!')
      
      document.cookie = `user_role=teacher; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      document.cookie = `user_email=${email}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      
      setTimeout(() => router.push('/teacher'), 1000)
      return
    }
    
    if (email === 'student@codefly.demo' && password === 'CodeFly2025!Student$') {
      console.log('✅ SUCCESS: Student login (complex password)')
      setMessage('✅ SUCCESS: Student login successful!')
      
      document.cookie = `user_role=student; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      document.cookie = `user_email=${email}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
      
      setTimeout(() => router.push('/games'), 1000)
      return
    }

    console.log('❌ FAILED: Invalid credentials')
    setMessage('❌ Invalid credentials. Try: teacher@codefly.demo / demo123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🚀 Simple CodeFly Login
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300"
              placeholder="teacher@codefly.demo"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300"
              placeholder="demo123"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium"
          >
            Login
          </button>

          {message && (
            <div className={`p-3 rounded text-center ${
              message.includes('✅') 
                ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                : 'bg-red-500/20 text-red-300 border border-red-500/50'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center text-gray-300 text-sm mt-6">
            <div className="bg-gray-800/50 p-4 rounded">
              <h3 className="font-bold mb-2">Working Credentials:</h3>
              <div className="space-y-1 font-mono text-xs">
                <div>📧 teacher@codefly.demo</div>
                <div>🔑 demo123</div>
                <div className="text-gray-400">or</div>
                <div>🔑 CodeFly2025!Teacher$</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}