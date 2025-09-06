'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { 
  Rocket, 
  User, 
  Target, 
  BookOpen, 
  Trophy,
  Sparkles,
  ChevronRight,
  Check,
  Star,
  Zap,
  Brain,
  Code
} from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: any
  action?: () => void
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [goals, setGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { user } = await getCurrentUser()
    if (!user) {
      router.push('/auth')
      return
    }
    setUserName(user.full_name || user.email.split('@')[0])
    setLoading(false)
  }

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: `Welcome to CodeFly, ${userName}!`,
      description: 'Ready to begin your coding journey as a secret agent?',
      icon: Rocket
    },
    {
      id: 1,
      title: 'Choose Your Experience Level',
      description: 'This helps us personalize your learning path',
      icon: Brain
    },
    {
      id: 2,
      title: 'What Are Your Goals?',
      description: 'Select what you want to achieve with CodeFly',
      icon: Target
    },
    {
      id: 3,
      title: 'Your Agent Profile is Ready!',
      description: 'Time to start your first mission',
      icon: Trophy
    }
  ]

  const skillLevels = [
    {
      level: 'beginner',
      title: 'Code Recruit',
      description: 'I\'m new to programming',
      icon: '🎯',
      color: 'from-green-400 to-blue-500'
    },
    {
      level: 'intermediate',
      title: 'Field Agent',
      description: 'I know some basics',
      icon: '⚡',
      color: 'from-blue-400 to-purple-500'
    },
    {
      level: 'advanced',
      title: 'Elite Operative',
      description: 'I have coding experience',
      icon: '🚀',
      color: 'from-purple-400 to-pink-500'
    }
  ]

  const availableGoals = [
    { id: 'learn-python', label: 'Learn Python Programming', icon: '🐍' },
    { id: 'build-games', label: 'Build My Own Games', icon: '🎮' },
    { id: 'solve-problems', label: 'Improve Problem Solving', icon: '🧩' },
    { id: 'have-fun', label: 'Have Fun While Learning', icon: '🎉' },
    { id: 'school-project', label: 'Complete School Projects', icon: '📚' },
    { id: 'career', label: 'Prepare for Tech Career', icon: '💼' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  const completeOnboarding = async () => {
    // Save user preferences
    const preferences = {
      skillLevel,
      goals,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }
    
    // Store in localStorage for now
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    
    // Redirect to appropriate starting point based on skill level
    if (skillLevel === 'beginner') {
      router.push('/mission/operation-beacon/week-1/lesson-1')
    } else {
      router.push('/games')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  const CurrentStepIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-4">
              <CurrentStepIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{steps[currentStep].title}</h1>
            <p className="text-gray-300 text-lg">{steps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="text-6xl animate-bounce">🚀</div>
                <div className="space-y-4">
                  <p className="text-white text-lg">
                    Welcome to <span className="text-blue-400 font-bold">Agent Academy</span>, where you'll learn to code through exciting spy missions!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="text-white font-bold mb-1">Learn Python</h3>
                      <p className="text-gray-400 text-sm">Master the fundamentals of programming</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <h3 className="text-white font-bold mb-1">Interactive Missions</h3>
                      <p className="text-gray-400 text-sm">Solve real coding challenges</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="text-white font-bold mb-1">Earn Achievements</h3>
                      <p className="text-gray-400 text-sm">Track your progress and level up</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Skill Level */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {skillLevels.map(level => (
                  <button
                    key={level.level}
                    onClick={() => setSkillLevel(level.level as any)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                      skillLevel === level.level
                        ? 'border-blue-400 bg-blue-400/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{level.icon}</div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-bold text-white mb-1">{level.title}</h3>
                        <p className="text-gray-300">{level.description}</p>
                      </div>
                      {skillLevel === level.level && (
                        <Check className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-300 text-center mb-4">Select all that apply:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableGoals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        goals.includes(goal.id)
                          ? 'border-purple-400 bg-purple-400/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="text-white font-medium">{goal.label}</span>
                        {goals.includes(goal.id) && (
                          <Check className="w-5 h-5 text-purple-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="text-6xl animate-bounce">🎉</div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
                  <p className="text-gray-300">
                    Your agent profile has been created. You're ready to begin your coding journey!
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-blue-400/30">
                    <h3 className="text-white font-bold mb-3">Your Profile:</h3>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Agent Name:</span>
                        <span className="text-white font-mono">{userName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Skill Level:</span>
                        <span className="text-white font-mono capitalize">{skillLevel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Missions Selected:</span>
                        <span className="text-white font-mono">{goals.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-yellow-400">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">+50 XP for completing onboarding!</span>
                    <Star className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={
                (currentStep === 2 && goals.length === 0) // Must select at least one goal
              }
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                (currentStep === 2 && goals.length === 0)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? 'Start Learning!' : 'Continue'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/games')}
              className="text-gray-400 hover:text-white text-sm font-mono transition-colors"
            >
              Skip onboarding →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}