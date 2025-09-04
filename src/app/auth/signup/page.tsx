'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Shield, AlertTriangle, Users, UserCheck, Eye, EyeOff,
  Crosshair, Lock, Unlock, CheckCircle, AlertCircle,
  Target, Radio, Navigation, Zap
} from 'lucide-react'
import { validateActivationKey, createAccount, joinSchool, joinClass } from '@/lib/auth-helpers'

interface FormData {
  activationKey: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  codename: string
  role: 'student' | 'teacher'
  schoolCode: string
  classCode: string
}

export default function AgentAcademySignup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    activationKey: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    codename: '',
    role: 'student',
    schoolCode: '',
    classCode: ''
  })

  useEffect(() => {
    // Simulate access authorization
    setTimeout(() => {
      setAccessGranted(true)
    }, 1500)
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep1 = async () => {
    if (!formData.activationKey) {
      setError('Activation key is required for Agent Academy access')
      return false
    }

    setLoading(true)
    try {
      const isValid = await validateActivationKey(formData.activationKey)
      if (!isValid) {
        setError('Invalid activation key. Access denied.')
        return false
      }
      return true
    } catch (error) {
      setError('Failed to validate activation key. Try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const validateStep2 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName || !formData.codename) {
      setError('All fields are required for agent profile creation')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Security protocol failed.')
      return false
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters for security clearance')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Valid email address required for secure communications')
      return false
    }

    if (formData.codename.length < 3) {
      setError('Codename must be at least 3 characters')
      return false
    }

    return true
  }

  const validateStep3 = () => {
    if (formData.role === 'student' && !formData.schoolCode && !formData.classCode) {
      setError('Students must join a school or class to begin mission training')
      return false
    }
    return true
  }

  const handleNext = async () => {
    let isValid = false

    switch (step) {
      case 1:
        isValid = await validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
    }

    if (isValid && step < 3) {
      setStep(step + 1)
    } else if (isValid && step === 3) {
      await handleSignup()
    }
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      // Create account
      const { user, error: signupError } = await createAccount(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.codename
      )

      if (signupError) {
        setError(signupError.message)
        return
      }

      if (!user) {
        setError('Failed to create agent profile')
        return
      }

      // Join school/class if provided
      if (formData.schoolCode) {
        const { error: schoolError } = await joinSchool(user.id, formData.schoolCode)
        if (schoolError) {
          console.warn('Failed to join school:', schoolError)
        }
      }

      if (formData.classCode) {
        const { error: classError } = await joinClass(user.id, formData.classCode)
        if (classError) {
          console.warn('Failed to join class:', classError)
        }
      }

      setSuccess('Agent profile created successfully. Welcome to Agent Academy.')
      
      setTimeout(() => {
        if (formData.role === 'student') {
          router.push('/student/dashboard')
        } else {
          router.push('/teacher/console')
        }
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Mission failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 font-mono text-2xl mb-4 animate-pulse">
            SCANNING FOR CLEARANCE...
          </div>
          <div className="flex justify-center space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{animationDelay: `${i * 0.2}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Tactical HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-green-400 opacity-30"></div>
          <div className="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-green-400 opacity-30"></div>
          <div className="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-green-400 opacity-30"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-green-400 opacity-30"></div>
          
          {/* Scanning lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
            animation: 'scan 4s linear infinite'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-black/90 border border-red-600/50 rounded-lg p-3 mb-6 font-mono text-sm backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-red-400">MISSION ID: BC-RECRUIT</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">SECURE</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black mb-2 font-mono">
              <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
                BLACK CIPHER
              </span>
            </h1>
            <h2 className="text-lg font-bold text-red-300 mb-4 font-mono">
              AGENT RECRUITMENT
            </h2>
            
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === step
                        ? 'bg-green-400 animate-pulse'
                        : i < step
                        ? 'bg-green-600'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-black/80 border-2 border-amber-600/30 rounded-xl p-6 backdrop-blur-sm">
            
            {/* Step 1: Activation Key */}
            {step === 1 && (
              <div>
                <div className="flex items-center mb-4">
                  <Lock className="w-5 h-5 text-amber-400 mr-3" />
                  <h3 className="text-amber-300 font-mono font-bold">STEP 1: ACCESS VERIFICATION</h3>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 font-mono text-sm mb-2">
                    ACTIVATION KEY *
                  </label>
                  <input
                    type="text"
                    value={formData.activationKey}
                    onChange={(e) => handleInputChange('activationKey', e.target.value)}
                    className="w-full bg-gray-900 border border-amber-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="Enter your classified activation key..."
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    Required for Agent Academy security clearance
                  </p>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-200 text-xs font-mono">
                      Only authorized personnel with valid activation keys may proceed. 
                      Unauthorized access attempts will be logged and reported.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile Creation */}
            {step === 2 && (
              <div>
                <div className="flex items-center mb-4">
                  <UserCheck className="w-5 h-5 text-blue-400 mr-3" />
                  <h3 className="text-blue-300 font-mono font-bold">STEP 2: AGENT PROFILE</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-300 font-mono text-sm mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-gray-900 border border-blue-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      placeholder="Your real identity..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-mono text-sm mb-2">
                      CODENAME *
                    </label>
                    <input
                      type="text"
                      value={formData.codename}
                      onChange={(e) => handleInputChange('codename', e.target.value)}
                      className="w-full bg-gray-900 border border-purple-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                      placeholder="Your secret agent name..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-mono text-sm mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-gray-900 border border-blue-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      placeholder="secure@blackcipher.net"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-gray-300 font-mono text-sm mb-2">
                      PASSWORD *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full bg-gray-900 border border-green-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 pr-12"
                      placeholder="Minimum 8 characters..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-gray-300 font-mono text-sm mb-2">
                      CONFIRM PASSWORD *
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full bg-gray-900 border border-green-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 pr-12"
                      placeholder="Confirm your password..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role & Assignment */}
            {step === 3 && (
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-purple-400 mr-3" />
                  <h3 className="text-purple-300 font-mono font-bold">STEP 3: ASSIGNMENT</h3>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 font-mono text-sm mb-2">
                    ROLE SELECTION *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'student')}
                      className={`p-4 rounded-lg border-2 font-mono transition-all ${
                        formData.role === 'student'
                          ? 'border-blue-400 bg-blue-900/30 text-blue-300'
                          : 'border-gray-600 bg-gray-900/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Target className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">TRAINEE</div>
                      <div className="text-xs opacity-75">Field Agent</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'teacher')}
                      className={`p-4 rounded-lg border-2 font-mono transition-all ${
                        formData.role === 'teacher'
                          ? 'border-green-400 bg-green-900/30 text-green-300'
                          : 'border-gray-600 bg-gray-900/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Radio className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">COMMANDER</div>
                      <div className="text-xs opacity-75">Mission Control</div>
                    </button>
                  </div>
                </div>

                {formData.role === 'student' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-300 font-mono text-sm mb-2">
                        SCHOOL CODE (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.schoolCode}
                        onChange={(e) => handleInputChange('schoolCode', e.target.value)}
                        className="w-full bg-gray-900 border border-blue-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        placeholder="Enter school code to join..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-mono text-sm mb-2">
                        CLASS CODE (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.classCode}
                        onChange={(e) => handleInputChange('classCode', e.target.value)}
                        className="w-full bg-gray-900 border border-purple-600/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                        placeholder="Enter class code to join..."
                      />
                    </div>

                    <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                      <div className="flex items-start">
                        <Users className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-blue-200 text-xs font-mono">
                          Join a school or class to participate in team missions and competitions.
                          You can also join later from your dashboard.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <div className="text-red-200 text-sm font-mono">{error}</div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <div className="text-green-200 text-sm font-mono">{success}</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="flex-1 bg-gray-800 border-2 border-gray-600/50 text-gray-300 py-3 px-6 rounded-lg font-mono font-bold hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
                >
                  BACK
                </button>
              )}
              
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-6 rounded-lg font-mono font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    PROCESSING...
                  </div>
                ) : step === 3 ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    DEPLOY AGENT
                  </>
                ) : (
                  <>
                    PROCEED
                    <Crosshair className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <Link 
                href="/auth" 
                className="text-gray-400 hover:text-white font-mono text-sm transition-colors"
              >
                Already have clearance? Sign in here
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-red-900/20 border border-red-600/30 rounded-lg p-3">
            <div className="flex items-start">
              <Shield className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-red-200 text-xs font-mono">
                <div className="font-bold mb-1">CLASSIFIED SYSTEM</div>
                <div>This is a secure Agent Academy recruitment portal. All activities are monitored and logged. Only authorized personnel may proceed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}