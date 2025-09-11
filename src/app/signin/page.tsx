'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User, Lock, Rocket, Sparkles, Crown, Users, BookOpen, ArrowLeft, Home } from 'lucide-react'

interface DemoAccount {
  email: string
  password: string
  fullName: string
  role: 'student' | 'teacher'
  avatar: string
  stats?: {
    level: number
    xp: number
    streak: number
    badges: number
  }
}

const demoAccounts: DemoAccount[] = [
  {
    email: 'student@codefly.demo',
    password: 'demo123',
    fullName: 'Alex Johnson',
    role: 'student',
    avatar: '🧑‍💻',
    stats: {
      level: 12,
      xp: 2450,
      streak: 7,
      badges: 15
    }
  },
  {
    email: 'teacher@codefly.demo', 
    password: 'demo123',
    fullName: 'Ms. Rodriguez',
    role: 'teacher',
    avatar: '👩‍🏫'
  }
]

function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check for demo account type from URL params
  useEffect(() => {
    const role = searchParams.get('role') as 'student' | 'teacher'
    if (role) {
      setSelectedRole(role)
      // Auto-fill demo account info
      const demoAccount = demoAccounts.find(acc => acc.role === role)
      if (demoAccount) {
        setEmail(demoAccount.email)
        setPassword(demoAccount.password)
      }
    }
  }, [searchParams])

  const handleDemoLogin = async (accountType: 'student' | 'teacher') => {
    setIsLoading(true)
    const demoAccount = demoAccounts.find(acc => acc.role === accountType)
    
    if (demoAccount) {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store demo user data
      localStorage.setItem('codefly_demo_user', JSON.stringify({
        id: `demo-${accountType}-${Date.now()}`,
        email: demoAccount.email,
        full_name: demoAccount.fullName,
        role: demoAccount.role,
        avatar: demoAccount.avatar,
        stats: demoAccount.stats || null,
        created_at: new Date().toISOString()
      }))
      localStorage.setItem('codefly_demo_mode', 'true')
      
      // Redirect based on role
      if (accountType === 'student') {
        router.push('/agent-academy-intel')
      } else {
        router.push('/teacher/console')
      }
    }
    setIsLoading(false)
  }

  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Check if it's a demo account
    const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password)
    if (demoAccount) {
      await handleDemoLogin(demoAccount.role)
      return
    }

    // TODO: Implement real Supabase authentication here
    setError('Real authentication not implemented yet. Please use demo accounts.')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 text-yellow-400" />
                <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 text-purple-400" />
                <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              </div>
              <div className="text-6xl animate-float">🚀</div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to CodeFly!
              </span>
            </h1>
            <p className="text-gray-300">Sign in to continue your coding adventure</p>
          </div>

          {/* Role Selection */}
          <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 border border-purple-500/30">
            <button
              onClick={() => setSelectedRole('student')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Student</span>
            </button>
            <button
              onClick={() => setSelectedRole('teacher')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                selectedRole === 'teacher'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Teacher</span>
            </button>
          </div>

          {/* Main Form */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <form onSubmit={handleRegularLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    <span>Launch Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Account Section */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-center text-gray-300 text-sm mb-4">
                Quick Demo Access
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleDemoLogin('student')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Demo Student Dashboard</span>
                  <Crown className="h-4 w-4 text-yellow-400" />
                </button>
                <button
                  onClick={() => handleDemoLogin('teacher')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Demo Teacher Console</span>
                  <Crown className="h-4 w-4 text-yellow-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            New to CodeFly?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}