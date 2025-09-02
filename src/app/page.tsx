'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Code, BookOpen, Users, Rocket, ChevronRight, Zap, Trophy, Bot, GraduationCap,
  Sparkles, Target, Award, GamepadIcon, LogOut, Star, Heart, Shield, TrendingUp,
  Globe, Clock, CheckCircle, ArrowRight, Play, Lightbulb, Brain, Gem, Crown,
  MessageCircle, ThumbsUp, Activity, BarChart3, DollarSign, School
} from 'lucide-react'

interface SimpleUser {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher'
}

export default function HomePage() {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  function checkUser() {
    try {
      // Check for demo authentication
      const demoMode = localStorage.getItem('demo_authenticated') === 'true'
      if (demoMode) {
        const demoUserStr = localStorage.getItem('demo_user')
        if (demoUserStr) {
          const demoUser = JSON.parse(demoUserStr)
          setUser({
            id: demoUser.id,
            email: demoUser.email,
            full_name: demoUser.full_name,
            role: demoUser.role
          })
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
    // Always set loading to false
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('demo_authenticated')
    localStorage.removeItem('demo_user')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse flex items-center">
          <Rocket className="w-8 h-8 mr-3 animate-bounce" />
          Loading CodeFly...
          <Sparkles className="w-6 h-6 ml-3 animate-pulse" />
        </div>
      </div>
    )
  }

  // If user is logged in, redirect to their dashboard
  useEffect(() => {
    if (user) {
      const dashboardUrl = user.role === 'teacher' ? '/teacher/console' : '/student/dashboard'
      router.push(dashboardUrl)
    }
  }, [user, router])

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <Code className="h-8 w-8 text-blue-600 mr-2 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                CodeFly ✈️
              </h1>
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-gray-900 rounded-full animate-pulse">
                #1 in K-12
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="/demo" className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg">
                🏫 School Demo
              </Link>
              <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Main Content */}
        <div className="relative z-10">
              <div>
                {/* Hero Section */}
                <div className="text-center py-20 px-8">
                  {/* Trust Badges */}
                  <div className="flex justify-center items-center space-x-6 mb-8 animate-fade-in">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white font-semibold">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <School className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white font-semibold">127+ Schools</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white font-semibold">94% Completion</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="inline-block relative">
                      <div className="absolute inset-0 animate-spin-slow">
                        <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400" />
                        <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-purple-400" />
                        <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
                        <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400" />
                      </div>
                      <div className="text-8xl mb-6 animate-float">🚀</div>
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black mb-6">
                      <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                        Learn to Code,
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                        Take Flight! ✈️
                      </span>
                    </h1>
                    <div className="flex justify-center items-center space-x-3 mb-6">
                      <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                      <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                        The #1 Gamified Coding Platform for Schools
                      </span>
                      <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  
                  <p className="text-2xl text-gray-100 mb-4 max-w-4xl mx-auto font-medium">
                    Transform your students into confident coders with AI-powered lessons, 
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">
                      real Python projects, and epic gamification! 
                    </span>
                  </p>
                  <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
                    Join thousands of students earning XP, unlocking badges, and building amazing projects
                    while teachers save 10+ hours per week with our automated grading system
                  </p>
                  
                  {/* Main CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link
                      href="/auth"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl"
                    >
                      <Rocket className="h-6 w-6 mr-3" />
                      Get Started Free ✨
                    </Link>
                    
                    <Link
                      href="/auth"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-12 py-5 rounded-xl text-xl font-bold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Trophy className="h-6 w-6 mr-3" />
                      Sign In
                    </Link>
                  </div>
                  
                  {/* Demo Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
                    <button
                      onClick={() => {
                        localStorage.setItem('demo_user', JSON.stringify({
                          id: 'demo-student-1',
                          email: 'alex@codefly.demo',
                          full_name: 'Alex Johnson',
                          role: 'student'
                        }))
                        localStorage.setItem('demo_authenticated', 'true')
                        window.location.reload()
                      }}
                      className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Try Student Demo 🎆
                    </button>
                    
                    <button
                      onClick={() => {
                        localStorage.setItem('demo_user', JSON.stringify({
                          id: 'demo-teacher-1',
                          email: 'teacher@codefly.demo',
                          full_name: 'Ms. Rodriguez',
                          role: 'teacher'
                        }))
                        localStorage.setItem('demo_authenticated', 'true')
                        window.location.reload()
                      }}
                      className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Try Teacher Demo 🎯
                    </button>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                        <Zap className="w-12 h-12 text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Interactive Coding</h3>
                        <p className="text-gray-300 text-sm">Write real Python code in our browser-based IDE with instant feedback and hints</p>
                      </div>
                    </div>

                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                        <GamepadIcon className="w-12 h-12 text-purple-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Project-Based Learning</h3>
                        <p className="text-gray-300 text-sm">Build real projects like games, apps, and tools that you can share with friends</p>
                      </div>
                    </div>

                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105">
                        <Bot className="w-12 h-12 text-pink-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">AI Study Buddy</h3>
                        <p className="text-gray-300 text-sm">Get personalized help and explanations from Coach Nova, your AI coding mentor</p>
                      </div>
                    </div>

                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
                        <GraduationCap className="w-12 h-12 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Teacher Tools</h3>
                        <p className="text-gray-300 text-sm">Comprehensive dashboard for tracking student progress and managing classroom activities</p>
                      </div>
                    </div>
                  </div>

                  {/* School Administrator Section */}
                  <div className="mt-12 p-8 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl border border-green-500/30 backdrop-blur-sm max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏫</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-3">School Administrators & Teachers</h3>
                      <p className="text-gray-300 mb-6">
                        See how CodeFly transforms computer science education with 94% student completion rates, 
                        $60,000+ annual savings, and zero teacher training required.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          href="/demo"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-xl"
                        >
                          📊 View Sales Demo & ROI Calculator
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.setItem('demo_user', JSON.stringify({
                              id: 'demo-teacher-1',
                              email: 'teacher@codefly.demo',
                              full_name: 'Ms. Rodriguez',
                              role: 'teacher'
                            }))
                            localStorage.setItem('demo_authenticated', 'true')
                            window.location.reload()
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
                        >
                          🎯 Try Teacher Dashboard
                        </button>
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        ✅ Used by 127+ schools nationwide • ✅ FERPA compliant • ✅ State standards aligned
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Section */}
                <div className="py-20 px-8 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center text-white mb-4">
                      The Numbers Speak for 
                      <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text"> Themselves</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
                      Join the fastest-growing coding education platform that's revolutionizing how students learn to code
                    </p>
                    
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">94%</div>
                            <p className="text-gray-300 font-semibold">Completion Rate</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                            <School className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">127+</div>
                            <p className="text-gray-300 font-semibold">Schools Using CodeFly</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">50K+</div>
                            <p className="text-gray-300 font-semibold">Students Enrolled</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30">
                            <Clock className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">10hrs</div>
                            <p className="text-gray-300 font-semibold">Saved Per Week</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-20 px-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-5xl font-bold text-white mb-4">
                        Loved by <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Teachers & Students</span>
                      </h2>
                      <p className="text-xl text-gray-300">See why educators are switching to CodeFly</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "CodeFly transformed my classroom! Students are actually excited about homework now. 
                          The gamification keeps them engaged, and I save hours on grading every week."
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            JH
                          </div>
                          <div>
                            <p className="text-white font-semibold">Jessica Henderson</p>
                            <p className="text-gray-400 text-sm">9th Grade CS Teacher, Miami</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "The AI tutor is incredible! It helps me when I'm stuck without giving away the answer. 
                          I've gone from hating coding to building my own games!"
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            MR
                          </div>
                          <div>
                            <p className="text-white font-semibold">Marcus Robinson</p>
                            <p className="text-gray-400 text-sm">10th Grade Student, Atlanta</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "Our CS enrollment doubled after implementing CodeFly. Parents love seeing their kids' 
                          progress, and our test scores have improved significantly."
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            DP
                          </div>
                          <div>
                            <p className="text-white font-semibold">Dr. David Park</p>
                            <p className="text-gray-400 text-sm">Principal, Houston Academy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="py-20 px-8 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center text-white mb-4">
                      How CodeFly <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Works</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
                      Get your classroom coding in minutes with our simple 3-step process
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            1
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Quick Setup</h3>
                        <p className="text-gray-300">
                          Create your classroom in 5 minutes. Import student rosters with one click. 
                          No installation or IT support needed.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            2
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Students Learn & Play</h3>
                        <p className="text-gray-300">
                          Students login and start coding immediately. They earn XP, unlock badges, 
                          and compete on leaderboards while learning.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-pink-500 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            3
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Track & Celebrate</h3>
                        <p className="text-gray-300">
                          Monitor progress in real-time. Automated grading saves hours. 
                          Celebrate achievements with built-in rewards system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 px-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-12 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                      <div className="relative z-10">
                        <h2 className="text-5xl font-bold text-white mb-6">
                          Ready to Transform Your Classroom?
                        </h2>
                        <p className="text-xl text-gray-100 mb-8">
                          Join 127+ schools already using CodeFly to make coding education magical
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/demo"
                            className="bg-white text-purple-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
                          >
                            <DollarSign className="inline w-5 h-5 mr-2" />
                            See Pricing & ROI
                          </Link>
                          <button
                            onClick={() => {
                              localStorage.setItem('demo_user', JSON.stringify({
                                id: 'demo-teacher-1',
                                email: 'teacher@codefly.demo',
                                full_name: 'Ms. Rodriguez',
                                role: 'teacher'
                              }))
                              localStorage.setItem('demo_authenticated', 'true')
                              window.location.reload()
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105 shadow-xl"
                          >
                            <Play className="inline w-5 h-5 mr-2" />
                            Start Free Trial
                          </button>
                        </div>
                        <p className="text-sm text-gray-200 mt-6">
                          ✓ No credit card required &nbsp; ✓ 30-day free trial &nbsp; ✓ Full support included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}