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

  // Demo login function
  const handleDemoLogin = (role: 'student' | 'teacher') => {
    // Set demo cookies (1 hour = 3600 seconds)
    document.cookie = `demo_auth_token=demo_access_2024; path=/; max-age=3600`
    document.cookie = `demo_user_role=${role}; path=/; max-age=3600`
    
    // CRITICAL FIX: Also set localStorage for backward compatibility
    localStorage.setItem('demo_authenticated', 'true')
    localStorage.setItem('demo_user', JSON.stringify({
      role: role,
      id: 'demo_user',
      email: `demo@codefly.com`,
      isDemoUser: true
    }))
    
    // Redirect based on role
    if (role === 'teacher') {
      router.push('/teacher')
    } else {
      router.push('/games')
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { user, error } = await signIn(formData.email, formData.password)
        if (error) throw error
        
        if (user) {
          // Redirect to games selection for students, teacher dashboard for teachers
          if (formData.role === 'teacher') {
            router.push('/teacher')
          } else {
            router.push('/games')
          }
        }
      } else {
        const { user, error } = await signUp(
          formData.email, 
          formData.password, 
          formData.fullName, 
          formData.role
        )
        if (error) throw error
        
        if (user) {
          setError('Please check your email to confirm your account.')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="student@school.edu"
                  />
                </div>
              </div>

              {/* Full Name (Sign up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
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
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`p-3 rounded-lg text-sm border ${
                  error.includes('check your email') 
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

          {/* Demo Credentials Section - Only show on login */}
          {isLogin && (
            <div className="mt-6 bg-amber-900/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-amber-400/30">
              <div className="text-center mb-4">
                <h3 className="text-amber-400 font-bold text-lg">🔐 Demo Access Credentials</h3>
                <p className="text-amber-200 text-sm">For demonstration and testing purposes only</p>
              </div>
              
              <div className="space-y-4">
                {/* Student Demo */}
                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Student Demo Account
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Email:</span>
                      <span className="text-blue-200 font-mono">student@demo.codyflyai.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Password:</span>
                      <span className="text-blue-200 font-mono">demo2024</span>
                    </div>
                    <button
                      onClick={() => handleDemoLogin('student')}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Quick Student Login
                    </button>
                  </div>
                </div>

                {/* Teacher Demo */}
                <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Teacher Demo Account
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Email:</span>
                      <span className="text-purple-200 font-mono">teacher@demo.codyflyai.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Password:</span>
                      <span className="text-purple-200 font-mono">demo2024</span>
                    </div>
                    <button
                      onClick={() => handleDemoLogin('teacher')}
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Quick Teacher Login
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-amber-300 text-xs">
                  ⚠️ Demo accounts reset every hour • For evaluation purposes only
                </p>
              </div>
            </div>
          )}
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