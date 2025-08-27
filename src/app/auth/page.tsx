'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Play, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { demoLogin } from '@/lib/demo-accounts'

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
  
  // Auto-login demo accounts
  useEffect(() => {
    const demoType = searchParams.get('demo')
    if (demoType === 'student' || demoType === 'teacher') {
      handleDemoLogin(demoType)
    }
  }, [searchParams])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { user, error } = await signIn(formData.email, formData.password)
        if (error) throw error
        
        if (user) {
          // Redirect based on role (we'll get this from the profile)
          router.push('/dashboard')
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

  const handleDemoLogin = async (accountType: 'student' | 'teacher') => {
    setLoading(true)
    setError(null)

    try {
      const { user } = await demoLogin(accountType)
      if (user) {
        // Redirect based on account type
        if (accountType === 'teacher') {
          router.push('/teacher')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join Coding Academy'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to continue learning' : 'Create your account to start coding'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="student@school.edu"
                />
              </div>
            </div>

            {/* Full Name (Sign up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}

            {/* Role Selection (Sign up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.role === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
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
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('check your email') 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Demo Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try a demo account</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleDemoLogin('student')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Demo Student Login
              </button>
              
              <button
                onClick={() => handleDemoLogin('teacher')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-purple-300 rounded-lg shadow-sm bg-purple-50 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheck className="h-5 w-5 mr-2" />
                Demo Teacher Login
              </button>
            </div>
            
            <p className="mt-3 text-xs text-gray-500 text-center">
              Demo accounts are pre-configured with sample data for exploration
            </p>
          </div>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
      <AuthPageContent />
    </Suspense>
  )
}