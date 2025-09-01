'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Database, User } from '@/lib/supabase/types'
import { 
  Zap, Trophy, Brain, Users, BookOpen, Star, 
  ChevronRight, Play, Award, Target, Flame, Sparkles,
  Code, Coffee, Rocket, Shield, Bot
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'overview'>('home')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      // Check for demo user first
      const demoMode = localStorage.getItem('demo_authenticated') === 'true'
      if (demoMode) {
        const demoUserStr = localStorage.getItem('demo_user')
        if (demoUserStr) {
          const demoUser = JSON.parse(demoUserStr)
          setUser({
            id: demoUser.id,
            email: demoUser.email,
            full_name: demoUser.full_name,
            display_name: demoUser.full_name?.split(' ')[0],
            avatar_url: null,
            role: demoUser.role,
            total_xp: demoUser.role === 'student' ? 1250 : 0,
            current_streak: demoUser.role === 'student' ? 7 : 0,
            longest_streak: demoUser.role === 'student' ? 14 : 0,
            last_active_date: new Date().toISOString(),
            accommodations_jsonb: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          setLoading(false)
          return
        }
      }

      // Check real Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        if (profile) setUser(profile)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  function celebrateFeatures() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading CodeFly...</div>
      </div>
    )
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Welcome Back Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Welcome Back, <br/>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {user.display_name || user.full_name || 'Coder'}!
                </span>
              </h1>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Ready to continue your coding adventure? Your quest awaits!
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{user.total_xp}</p>
                  <p className="text-purple-200">Total XP</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{Math.floor(user.total_xp / 100)}</p>
                  <p className="text-purple-200">Current Level</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <Flame className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{user.current_streak}</p>
                  <p className="text-purple-200">Day Streak</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={user.role === 'teacher' ? '/teacher/console' : '/student/dashboard'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-8 py-4 font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-6 h-6" />
                  <span>Continue Quest</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/lesson/1"
                  className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl px-8 py-4 font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>View Lessons</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Your CodeFly Toolkit</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Everything you need to master coding in one revolutionary platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/student/dashboard"
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all hover:scale-105"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-xl mb-2">Dashboard</h3>
              <p className="text-purple-200">Track your XP, badges, and progress</p>
            </Link>

            <Link
              href="/student/tutor"
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all hover:scale-105"
            >
              <Brain className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-xl mb-2">Coach Nova</h3>
              <p className="text-purple-200">Your personal AI coding assistant</p>
            </Link>

            <Link
              href="/lesson/1"
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all hover:scale-105"
            >
              <Code className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-xl mb-2">Lessons</h3>
              <p className="text-purple-200">Interactive coding adventures</p>
            </Link>

            <div
              onClick={celebrateFeatures}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-xl mb-2">More Coming!</h3>
              <p className="text-purple-200">New features every week</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CodeFly ✈️</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-medium transition-colors ${
                  activeTab === 'home' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                Course Overview
              </button>
              <div className="flex space-x-4 ml-6">
                <Link 
                  href="/demo" 
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  🏫 School Demo
                </Link>
                <Link 
                  href="/auth" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Student Portal
                </Link>
                <Link 
                  href="/auth" 
                  className="text-gray-600 hover:text-gray-800"
                >
                  Teacher
                </Link>
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Learn to Code,</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent animate-gradient">Take Flight! ✈️</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-medium animate-fade-in">
            Master Python programming through fun, interactive projects! 🎆
            <br />
            <span className="text-lg text-gray-300 mt-2 block">From Magic 8-Ball apps to awesome games - coding has never been this exciting! 🚀</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={async () => {
                localStorage.setItem('demo_user', JSON.stringify({
                  id: 'demo-student-1',
                  email: 'alex@codefly.demo',
                  full_name: 'Alex Johnson',
                  role: 'student'
                }));
                localStorage.setItem('demo_authenticated', 'true');
                localStorage.setItem('codefly_demo_user', JSON.stringify({
                  id: 'demo-student-1',
                  name: 'Alex Johnson',
                  role: 'student',
                  email: 'alex@codefly.demo'
                }));
                localStorage.setItem('codefly_demo_mode', 'true');
                window.location.reload();
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center glow-blue"
            >
              <BookOpen className="h-6 w-6 mr-3 animate-pulse" />
              Demo Student Login 🎆
            </button>
            <button
              onClick={async () => {
                localStorage.setItem('demo_user', JSON.stringify({
                  id: 'demo-teacher-1',
                  email: 'teacher@codefly.demo',
                  full_name: 'Ms. Rodriguez',
                  role: 'teacher'
                }));
                localStorage.setItem('demo_authenticated', 'true');
                localStorage.setItem('codefly_demo_user', JSON.stringify({
                  id: 'demo-teacher-1',
                  name: 'Ms. Rodriguez',
                  role: 'teacher',
                  email: 'teacher@codefly.demo'
                }));
                localStorage.setItem('codefly_demo_mode', 'true');
                window.location.reload();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center glow-purple"
            >
              <Users className="h-6 w-6 mr-3 animate-bounce" />
              Demo Teacher Login 🎯
            </button>
          </div>

          {/* School Administrator Section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl border border-green-500/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-2xl font-bold text-green-400 mb-3">School Administrators & Teachers</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                See how CodeFly transforms computer science education with 94% student completion rates, 
                $60,000+ annual savings, and zero teacher training required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 flex items-center justify-center"
                >
                  📊 View Sales Demo & ROI Calculator
                </Link>
                <button
                  onClick={async () => {
                    localStorage.setItem('demo_user', JSON.stringify({
                      id: 'demo-teacher-1',
                      email: 'teacher@codefly.demo',
                      full_name: 'Ms. Rodriguez',
                      role: 'teacher'
                    }));
                    localStorage.setItem('demo_authenticated', 'true');
                    localStorage.setItem('codefly_demo_user', JSON.stringify({
                      id: 'demo-teacher-1',
                      name: 'Ms. Rodriguez',
                      role: 'teacher',
                      email: 'teacher@codefly.demo'
                    }));
                    localStorage.setItem('codefly_demo_mode', 'true');
                    window.location.reload();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20"
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

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Code className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center">Interactive Coding</h3>
            <p className="text-gray-300 text-center font-medium">
              Write and run Python code directly in your browser. No setup required - just pure coding magic! 💻
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <BookOpen className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎆</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 text-center">Project-Based Learning</h3>
            <p className="text-gray-300 text-center font-medium">
              Build real apps like Magic 8-Ball, calculators, and games while learning. Learning by doing! 🎮
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-cyan-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Bot className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🤖</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4 text-center">AI Study Buddy</h3>
            <p className="text-gray-300 text-center font-medium">
              Your personal AI coding companion! Get instant help, debugging support, and personalized guidance 24/7! 🚀
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🏆</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-center">Teacher Tools</h3>
            <p className="text-gray-300 text-center font-medium">
              Track student progress, provide feedback, and manage assignments with ease. Teaching made simple! 🎆
            </p>
          </div>
            </div>
          </>
        ) : (
          <CourseOverview />
        )}
      </div>
    </div>
  )
}

function CourseOverview() {

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl sm:text-6xl font-bold mb-8">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">What Students Will Master</span>
      </h1>
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 shadow-2xl max-w-5xl mx-auto">
        <p className="text-xl text-gray-300 mb-8 font-medium">
          By the end of this 18-week semester, students will have mastered:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Programming Skills */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">💻</span>
              Python Programming Skills
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Variables, data types, and user input/output</li>
              <li>• Conditional logic (if/else statements)</li>
              <li>• Loops and iteration patterns</li>
              <li>• Lists, randomness, and data structures</li>
              <li>• Functions and code organization</li>
              <li>• Problem-solving with algorithmic thinking</li>
            </ul>
          </div>

          {/* AI & Technology */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI & Machine Learning
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• How AI image classifiers work</li>
              <li>• API integration and data fetching</li>
              <li>• Pattern recognition principles</li>
              <li>• Machine learning vocabulary and concepts</li>
              <li>• Ethics in AI and responsible technology use</li>
              <li>• Emerging technology awareness</li>
            </ul>
          </div>

          {/* Web Development */}
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌐</span>
              Web Development
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• HTML structure and semantic elements</li>
              <li>• CSS styling and responsive design</li>
              <li>• JavaScript basics and interactivity</li>
              <li>• Building personal websites and portfolios</li>
              <li>• API integration for dynamic content</li>
              <li>• Publishing and sharing projects online</li>
            </ul>
          </div>

          {/* Digital Media & Creative Skills */}
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎨</span>
              Digital Media & Design
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Digital image editing and manipulation</li>
              <li>• Animation principles and creation</li>
              <li>• Visual design and user interface concepts</li>
              <li>• Creative problem-solving with technology</li>
              <li>• Combining AI tools with creative projects</li>
              <li>• Digital storytelling and presentation skills</li>
            </ul>
          </div>

          {/* Professional Skills */}
          <div className="bg-gradient-to-br from-cyan-900/50 to-teal-900/50 rounded-lg p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              21st Century Skills
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Team collaboration and project management</li>
              <li>• Technical communication and presentation</li>
              <li>• Debugging and problem-solving strategies</li>
              <li>• Digital portfolio creation and curation</li>
              <li>• Critical thinking about technology's impact</li>
              <li>• Self-directed learning and growth mindset</li>
            </ul>
          </div>

          {/* Real-World Applications */}
          <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 rounded-lg p-6 border border-violet-500/30">
            <h3 className="text-xl font-bold text-violet-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Real-World Projects
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Interactive games and entertainment apps</li>
              <li>• AI-powered tools and applications</li>
              <li>• Personal websites and digital presence</li>
              <li>• Team-based mini-applications</li>
              <li>• Public project showcase and presentation</li>
              <li>• Future-ready skills for Grade 10 and beyond</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-blue-500/30">
          <p className="text-lg text-gray-200 font-medium">
            <span className="text-yellow-300 font-bold">🌟 Most importantly:</span> Students will develop confidence as creators, not just consumers of technology, with the skills and mindset to continue learning and building in our digital world.
          </p>
        </div>
      </div>
    </div>
  )
}