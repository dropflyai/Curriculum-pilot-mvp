'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Play, GraduationCap, ArrowLeft, Home, Sparkles, Rocket } from 'lucide-react'
import Link from 'next/link'

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student' as 'student' | 'teacher'
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!isLogin && !formData.fullName) {
      setError('Please enter your full name')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Check hardcoded test accounts first
        const testAccounts = [
          { email: 'student@test.com', password: 'test123', role: 'student', fullName: 'Test Student' },
          { email: 'teacher@test.com', password: 'test123', role: 'teacher', fullName: 'Test Teacher' },
          { email: 'admin@test.com', password: 'test123', role: 'admin', fullName: 'Test Admin' },
          { email: 'student@codefly.demo', password: 'demo123', role: 'student', fullName: 'Demo Student' },
          { email: 'teacher@codefly.demo', password: 'demo123', role: 'teacher', fullName: 'Demo Teacher' }
        ]

        const testAccount = testAccounts.find(acc => acc.email === formData.email && acc.password === formData.password)
        
        if (testAccount) {
          // Set authentication cookies
          const mockUser = {
            id: `test-${testAccount.role}`,
            email: testAccount.email,
            full_name: testAccount.fullName,
            role: testAccount.role
          }
          
          // Store in localStorage and cookies with improved handling
          localStorage.setItem('test_user', JSON.stringify(mockUser))
          localStorage.setItem('test_authenticated', 'true')
          
          const userCookie = encodeURIComponent(JSON.stringify(mockUser))
          const isSecure = window.location.protocol === 'https:'
          const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`
          
          // Set cookies with proper error handling
          try {
            document.cookie = `test_user=${userCookie}; ${cookieOptions}`
            document.cookie = `test_authenticated=true; ${cookieOptions}`
            document.cookie = `user_role=${testAccount.role}; ${cookieOptions}`
            
            // Small delay to ensure cookies are set before redirect
            await new Promise(resolve => setTimeout(resolve, 100))
          } catch (cookieError) {
            console.error('Cookie setting error:', cookieError)
          }
          
          // Check if user was trying to access a specific game
          const intendedGame = localStorage.getItem('intended_game')
          if (intendedGame) {
            localStorage.removeItem('intended_game')
            // Map game to appropriate route
            if (intendedGame === 'agent-academy') {
              router.push('/mission-hq')
              return
            }
          }
          
          // Redirect based on role without API calls
          if (testAccount.role === 'teacher') {
            router.push('/teacher')
          } else {
            router.push('/games')
          }
          return
        }

        // If not a test account, try regular auth
        const { user, error } = await signIn(formData.email, formData.password)
        if (error) {
          throw new Error('Invalid email or password. Please try again.')
        }
        
        if (user) {
          // For Supabase users, redirect to games by default
          router.push('/games')
        }
      } else {
        // Sign up new user
        const { user, error } = await signUp(
          formData.email, 
          formData.password, 
          formData.fullName, 
          formData.role
        )
        
        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.')
          }
          throw error
        }
        
        if (user) {
          setError('Account created! Please sign in to continue.')
          setIsLogin(true) // Switch to login mode
        }
      }
    } catch (err: unknown) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setFormData({ ...formData, password: '', fullName: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          {/* Header with CodeFly branding */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-4 h-4 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 w-4 h-4 text-purple-400 animate-pulse" />
                <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-4 h-4 text-blue-400 animate-pulse" />
                <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-4 h-4 text-pink-400 animate-pulse" />
              </div>
              <Rocket className="h-16 w-16 text-purple-400 animate-float" />
            </div>
            
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                CodeFly ✈️
              </span>
            </h1>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Join the Adventure'}
            </h2>
            <p className="text-gray-300">
              {isLogin ? 'Sign in to continue your coding journey' : 'Create your account to start coding'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Use a valid email - you'll need it to sign in</p>
              </div>

              {/* Full Name (Sign up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">This will be displayed on your profile</p>
                </div>
              )}

              {/* Role Selection (Sign up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.role === 'student'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/20 hover:border-white/40 text-gray-300'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Student</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'teacher' })}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.role === 'teacher'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/20 hover:border-white/40 text-gray-300'
                      }`}
                    >
                      <UserCheck className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Teacher</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password * {!isLogin && <span className="text-xs text-gray-400">(min. 6 characters)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {!isLogin && formData.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-400 mt-1">Password must be at least 6 characters</p>
                )}
              </div>

              {/* Error/Success Message */}
              {error && (
                <div className={`p-3 rounded-lg text-sm border ${
                  error.includes('check your email') || error.includes('Account created')
                    ? 'bg-green-500/20 text-green-300 border-green-500/50'
                    : 'bg-red-500/20 text-red-300 border-red-500/50'
                }`}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transform hover:scale-105"
              >
                {loading 
                  ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In 🚀' : 'Create Account ✨')
                }
              </button>
            </form>


            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}