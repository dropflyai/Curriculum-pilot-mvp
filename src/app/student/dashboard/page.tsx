'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStudentProgress } from '@/hooks/useRealtimeProgress'
import { useProgressTracking } from '@/lib/progress-tracking'
import { 
  Home, ArrowLeft, Crown, Zap, Flame, Trophy, Star, Target, Rocket, BookOpen, 
  Clock, Award, TrendingUp, User, LogOut, CheckCircle, Play, Bolt,
  Sparkles, Brain, Gem, Coffee, Activity, BarChart3, MessageCircle
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Enhanced AAA quality 3D map with advanced rendering
const AAAGameMap = dynamic(() => import('@/components/AAAGameMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
        <div className="text-2xl text-white font-bold mb-2">Loading Unreal-Quality 3D World...</div>
        <div className="text-gray-400">Initializing advanced shaders and physics...</div>
      </div>
    </div>
  )
})

interface StudentStats {
  level: number
  xp: number
  nextLevelXP: number
  streak: number
  badges: number
  completedLessons: number
  totalLessons: number
  rank: number
  weeklyXP: number
}

interface RecentActivity {
  action: string
  time: string
  type: 'lesson' | 'achievement' | 'quiz' | 'streak'
  xp: number
}

interface DemoUser {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher'
  avatar: string
  stats?: StudentStats
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Real-time progress tracking
  const { progress: studentProgress, isLoading: progressLoading } = useStudentProgress(user?.id || '')
  const { trackLessonStart, addRealtimeListener } = useProgressTracking()
  const [showCelebration, setShowCelebration] = useState(false)
  const [animateStats, setAnimateStats] = useState(false)
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'questmap' | 'leaderboard'>('overview')
  
  // Default stats for demo
  const defaultStats: StudentStats = {
    level: 12,
    xp: 2450,
    nextLevelXP: 2600,
    streak: 7,
    badges: 15,
    completedLessons: 8,
    totalLessons: 24,
    rank: 3,
    weeklyXP: 340
  }

  const [recentActivity] = useState<RecentActivity[]>([
    { action: 'Completed Python Magic 8-Ball! 🎱', time: '30 minutes ago', type: 'lesson', xp: 50 },
    { action: 'Earned Code Master Badge! 🏆', time: '35 minutes ago', type: 'achievement', xp: 25 },
    { action: 'Achieved 92% on Python Quiz! ⭐', time: '1 hour ago', type: 'quiz', xp: 40 },
    { action: '7-day coding streak! 🔥', time: '2 hours ago', type: 'streak', xp: 50 }
  ])

  // Multiplayer/Class data
  const [classmates] = useState([
    { name: 'Emma', level: 15, xp: 3200, avatar: '🧙‍♀️', position: { x: 65, y: 30 }, status: 'online' },
    { name: 'Marcus', level: 10, xp: 2100, avatar: '🦸‍♂️', position: { x: 45, y: 60 }, status: 'online' },
    { name: 'Zara', level: 13, xp: 2800, avatar: '🧚‍♀️', position: { x: 80, y: 45 }, status: 'away' },
    { name: 'Diego', level: 8, xp: 1650, avatar: '🤖', position: { x: 25, y: 40 }, status: 'offline' },
    { name: 'Aisha', level: 14, xp: 3000, avatar: '🧝‍♀️', position: { x: 55, y: 25 }, status: 'online' },
  ])

  // Progressive mission unlocking system
  const calculateMissionLocks = (completedMissions: number[], allMissions: any[]) => {
    return allMissions.map(mission => {
      if (!mission.prerequisite) return { ...mission, locked: false }
      const prerequisiteCompleted = completedMissions.includes(mission.prerequisite)
      return { ...mission, locked: !prerequisiteCompleted }
    })
  }

  const [completedMissionIds] = useState([1, 2]) // Player has completed first two missions
  
  // Original CodeFly Academy storyline - The Digital Realm
  const baseMissions = [
    // Chapter 1: Foundation Islands
    { id: 1, name: 'Binary Shores Academy', completed: true, position: { x: 8, y: 85 }, xp: 250, icon: '🏫', type: 'lesson', region: 'Tutorial Islands', difficulty: 1, prerequisite: null, description: 'Learn the basics of variables and data types' },
    { id: 2, name: 'Variable Village', completed: true, position: { x: 18, y: 78 }, xp: 300, icon: '🏘️', type: 'lesson', region: 'Tutorial Islands', difficulty: 1, prerequisite: 1, description: 'Master string manipulation and user input' },
    { id: 3, name: 'Logic Lake Outpost', completed: false, position: { x: 28, y: 70 }, xp: 350, icon: '🏞️', type: 'lesson', region: 'Tutorial Islands', difficulty: 2, prerequisite: 2, description: 'Conditional statements and boolean logic' },
    
    // Chapter 2: The Mainland Continent
    { id: 4, name: 'Loop Canyon Base', completed: false, position: { x: 45, y: 65 }, xp: 400, icon: '🏕️', type: 'lesson', region: 'Central Mainland', difficulty: 2, prerequisite: 3, description: 'Master for and while loops' },
    { id: 5, name: 'Function Forest Station', completed: false, position: { x: 55, y: 58 }, xp: 450, icon: '🌲', type: 'lesson', region: 'Central Mainland', difficulty: 3, prerequisite: 4, description: 'Create reusable functions and modules' },
    { id: 6, name: 'Array Mountains Facility', completed: false, position: { x: 40, y: 45 }, xp: 500, icon: '⛰️', type: 'lesson', region: 'Central Mainland', difficulty: 3, prerequisite: 5, description: 'Data structures and list manipulation' },
    
    // Chapter 3: Advanced Territories
    { id: 7, name: 'Object Oasis Complex', completed: false, position: { x: 70, y: 40 }, xp: 600, icon: '🏛️', type: 'lesson', region: 'Advanced Zone', difficulty: 4, prerequisite: 6, description: 'Object-oriented programming fundamentals' },
    { id: 8, name: 'Algorithm Archipelago', completed: false, position: { x: 85, y: 30 }, xp: 650, icon: '🏝️', type: 'lesson', region: 'Advanced Zone', difficulty: 4, prerequisite: 7, description: 'Sorting and searching algorithms' },
    
    // Chapter 4: The Digital Frontier
    { id: 9, name: 'API Gateway Fortress', completed: false, position: { x: 65, y: 25 }, xp: 700, icon: '🏰', type: 'lesson', region: 'Digital Frontier', difficulty: 5, prerequisite: 8, description: 'REST APIs and web integration' },
    { id: 10, name: 'Database Depths', completed: false, position: { x: 50, y: 15 }, xp: 750, icon: '🕳️', type: 'lesson', region: 'Digital Frontier', difficulty: 5, prerequisite: 9, description: 'SQL and database design' },
    
    // Final Boss
    { id: 11, name: 'The Core Protocol', completed: false, position: { x: 75, y: 10 }, xp: 1000, icon: '💎', type: 'boss', region: 'The Core', difficulty: 6, prerequisite: 10, description: 'Final capstone project combining all skills' },
    
    // Hidden/Bonus Missions
    { id: 12, name: 'Debug Caves', completed: false, position: { x: 20, y: 50 }, xp: 300, icon: '🕳️', type: 'bonus', region: 'Hidden', difficulty: 2, prerequisite: 3, description: 'Learn debugging techniques and error handling' },
    { id: 13, name: 'Optimization Overlook', completed: false, position: { x: 90, y: 60 }, xp: 400, icon: '🔭', type: 'bonus', region: 'Hidden', difficulty: 4, prerequisite: 6, description: 'Code optimization and performance tuning' },
    { id: 14, name: 'Security Stronghold', completed: false, position: { x: 35, y: 20 }, xp: 500, icon: '🛡️', type: 'bonus', region: 'Hidden', difficulty: 5, prerequisite: 8, description: 'Cybersecurity and safe coding practices' },
  ]

  const [questNodes] = useState(calculateMissionLocks(completedMissionIds, baseMissions))

  // Real-time progress updates
  useEffect(() => {
    if (user?.id) {
      const unsubscribe = addRealtimeListener((data) => {
        console.log('Student received real-time update:', data)
        // Could trigger UI updates here if needed
      })
      
      return unsubscribe
    }
  }, [user?.id, addRealtimeListener])
  
  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      try {
        const demoMode = localStorage.getItem('codefly_demo_mode') === 'true'
        if (demoMode) {
          const userData = localStorage.getItem('codefly_demo_user')
          if (userData) {
            const parsedUser = JSON.parse(userData) as DemoUser
            setUser({
              ...parsedUser,
              stats: parsedUser.stats || defaultStats
            })
          }
        } else {
          // Check for old demo format
          const oldDemoAuth = localStorage.getItem('demo_authenticated')
          const oldDemoUser = localStorage.getItem('demo_user')
          if (oldDemoAuth === 'true' && oldDemoUser) {
            const oldUser = JSON.parse(oldDemoUser)
            setUser({
              id: oldUser.id || 'demo-student',
              email: oldUser.email || 'student@demo.com',
              full_name: oldUser.full_name || 'Demo Student',
              role: 'student',
              avatar: '🧑‍💻',
              stats: defaultStats
            })
          } else {
            // Redirect to signin if no demo data
            router.push('/signin?role=student')
            return
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        router.push('/signin?role=student')
      }
    }

    // Simulate loading
    const timer = setTimeout(() => {
      loadUserData()
      setIsLoading(false)
      setAnimateStats(true)
      
      // Show celebration for streak achievement
      setTimeout(() => setShowCelebration(true), 1000)
      setTimeout(() => setShowCelebration(false), 3000)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('codefly_demo_user')
    localStorage.removeItem('codefly_demo_mode')
    localStorage.removeItem('demo_authenticated')
    localStorage.removeItem('demo_user')
    router.push('/')
  }

  // Adventure progression handler - now connects to actual lessons
  const handleMissionClick = (mission: any) => {
    if (mission.locked) {
      // Show locked adventure message
      const prerequisiteName = baseMissions.find(m => m.id === mission.prerequisite)?.name
      alert(`🔒 Adventure Locked!\n\n✨ Complete "${prerequisiteName}" first to unlock this new destination!\n\nEach location builds upon the knowledge from previous adventures.`)
      return
    }

    if (mission.completed) {
      // Show adventure details or replay option
      const replayChoice = confirm(`✅ Adventure Complete!\n\n🎉 "${mission.name}" has been mastered!\n\n⚡ XP Earned: ${mission.xp}\n🌍 Region: ${mission.region}\n📚 ${mission.description}\n\nWould you like to replay this adventure to strengthen your skills?`)
      if (replayChoice) {
        navigateToLesson(mission)
      }
      return
    }

    // Navigate to actual lesson
    const confirmMessage = `🚀 Begin Adventure: ${mission.name}?\n\n🌍 Region: ${mission.region}\n⭐ Difficulty: ${mission.difficulty}/6\n⚡ XP Reward: ${mission.xp}\n📚 Goal: ${mission.description}\n\nReady to explore the Digital Realm?`
    
    if (confirm(confirmMessage)) {
      const briefingMessage = mission.type === 'boss' 
        ? `💎 FINAL CHALLENGE\n\n"${mission.name}"\n\n🎯 This is the ultimate test of all your coding skills!\nCombine everything you've learned to complete your journey through the Digital Realm.\n\nGood luck, master coder! 🌟`
        : mission.type === 'bonus'
        ? `🗝️ HIDDEN ADVENTURE\n\n"${mission.name}"\n\n✨ You've discovered a secret location!\n${mission.description}\n\nThese optional challenges will enhance your coding mastery.\n\nReady for the challenge? 💫`
        : `🎒 Adventure Briefing\n\n"${mission.name}"\n\n📖 ${mission.description}\n\nExplore, learn, and grow stronger as you master new programming concepts!\n\nHappy coding! 🌟`
        
      alert(briefingMessage)
      
      // Navigate to lesson after briefing
      setTimeout(() => {
        navigateToLesson(mission)
      }, 1000)
    }
  }

  // Navigate to the appropriate lesson based on mission
  const navigateToLesson = async (mission: any) => {
    // Map adventure locations to actual lessons available in lesson-data.ts
    const lessonMapping: Record<number, string> = {
      1: '/lesson/week-01',               // Binary Shores Academy → AI Classifier
      2: '/lesson/week-02',               // Variable Village → Python Magic 8-Ball
      3: '/lesson/conditionals-logic',    // Logic Lake Outpost (coming soon)
      4: '/lesson/loops-iteration',       // Loop Canyon Base (coming soon)
      5: '/lesson/functions-modules',     // Function Forest Station (coming soon)
      6: '/lesson/data-structures',       // Array Mountains Facility (coming soon)
      7: '/lesson/object-oriented',       // Object Oasis Complex (coming soon)
      8: '/lesson/algorithms',            // Algorithm Archipelago (coming soon)
      9: '/lesson/apis-web',              // API Gateway Fortress (coming soon)
      10: '/lesson/databases',            // Database Depths (coming soon)
      11: '/lesson/capstone-project',     // The Core Protocol (coming soon)
      12: '/lesson/debugging',            // Debug Caves (coming soon)
      13: '/lesson/optimization',         // Optimization Overlook (coming soon)
      14: '/lesson/security'              // Security Stronghold (coming soon)
    }

    const lessonPath = lessonMapping[mission.id]
    
    if (lessonPath && user) {
      // Track lesson start for real-time monitoring
      try {
        await trackLessonStart(
          user.id,
          user.full_name || 'Student',
          `week-${mission.id.toString().padStart(2, '0')}`,
          mission.name
        )
      } catch (error) {
        console.error('Failed to track lesson start:', error)
      }
      
      // Store mission context for the lesson
      localStorage.setItem('current_adventure', JSON.stringify({
        missionId: mission.id,
        missionName: mission.name,
        region: mission.region,
        xpReward: mission.xp,
        difficulty: mission.difficulty
      }))
      
      // Navigate to lesson
      router.push(lessonPath)
    } else {
      // For lessons not yet implemented, show coming soon message
      if (mission.id <= 2) {
        // Should not happen now, but fallback
        alert(`🔧 Technical Issue!\n\nThere seems to be a problem loading "${mission.name}". Please try refreshing the page or contact support.`)
      } else {
        // For future lessons
        alert(`🚧 Adventure Coming Soon!\n\n"${mission.name}" is being crafted by our development team!\n\n✨ Currently Available Adventures:\n• Binary Shores Academy (AI Classifier)\n• Variable Village (Python Magic 8-Ball)\n\nMore coding adventures launching soon! 🚀`)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-purple-400 animate-pulse" />
                <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 animate-pulse" />
                <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div className="text-8xl animate-float mb-4">🚀</div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
              Loading Your CodeFly Adventure...
            </span>
          </h1>
          
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
          
          <p className="text-xl text-gray-200 animate-pulse">
            Preparing your personalized dashboard... ✨
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Merge real-time progress with default stats
  const studentStats = user.stats || {
    ...defaultStats,
    // Update with real progress data if available
    completedLessons: studentProgress.filter(p => p.completionStatus === 'completed').length,
    // Could calculate other stats from real progress here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>
      
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🎉
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-4xl font-bold text-yellow-400 animate-pulse">
              STREAK MASTER! 🔥
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="relative bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
                <span className="text-sm">Home</span>
              </Link>
              <div className="flex items-center">
                <div className="relative">
                  <Rocket className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CodeFly Academy ✈️
                  </h1>
                  <p className="text-sm text-gray-300">Your Coding Adventure Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* XP and Level Display */}
              <div className="flex items-center space-x-4 bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <span className="text-white font-bold">Level {studentStats.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">{studentStats.xp} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-400 animate-pulse" />
                  <span className="text-orange-400 font-semibold">{studentStats.streak} day streak</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="text-2xl mr-2">{user.avatar}</div>
                  {user.full_name?.split(' ')[0] || 'Coding Hero'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-sm text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'overview', label: '🏠 Home Base', icon: '🏠' },
            { key: 'questmap', label: '🗺️ Quest Map', icon: '🗺️' },
            { key: 'leaderboard', label: '👥 Guild Hall', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white border border-white/30 transform scale-105'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:transform hover:scale-102'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          
          {/* Navigation Links */}
          <Link
            href="/curriculum"
            className="px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-white border border-green-500/30 hover:border-green-400/50 hover:transform hover:scale-102"
          >
            <span className="text-lg">📚</span>
            <span>Full Curriculum</span>
          </Link>
          
          <Link
            href="/ai-literacy"
            className="px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-white border border-cyan-500/30 hover:border-cyan-400/50 hover:transform hover:scale-102"
          >
            <span className="text-lg">🧠</span>
            <span>AI Literacy</span>
          </Link>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {user.full_name?.split(' ')[0] || 'Coding Hero'}! ✨
                  </h2>
                  <p className="text-purple-200">Ready to continue your coding adventure?</p>
                </div>
                <div className="text-6xl animate-bounce">{user.avatar}</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Level Card */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <Crown className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Level</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{studentStats.level}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000" 
                    style={{width: `${Math.min((studentStats.xp % 1000) / 10, 100)}%`}}
                  ></div>
                </div>
                <p className="text-xs text-blue-200 mt-2">{studentStats.xp % 1000} / 1000 XP to Level {studentStats.level + 1}</p>
              </div>

              {/* XP Card */}
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="h-6 w-6 text-blue-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Experience</h3>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {studentStats.xp.toLocaleString()}
                  {!progressLoading && studentProgress.length > 0 && (
                    <span className="text-xs text-green-400 ml-2">● SYNCED</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Bolt className="h-4 w-4 text-green-400" />
                  <p className="text-xs text-green-200">+50 XP this session!</p>
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-gradient-to-br from-orange-600/20 to-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <Flame className="h-6 w-6 text-orange-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Streak</h3>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-3xl font-bold text-orange-400">{studentStats.streak}</div>
                  <div className="text-orange-300">days</div>
                  <div className="text-xl animate-bounce">🔥</div>
                </div>
                <p className="text-xs text-orange-200">Keep it up! You're on fire!</p>
              </div>

              {/* Achievements Card */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="h-6 w-6 text-purple-400 animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Achievements</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">15</div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400" />
                  <Star className="h-4 w-4 text-gray-400" />
                  <Star className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-purple-200 mt-1">3/5 Beginner badges</p>
              </div>
            </div>

            {/* Recent Activity & Next Lesson */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Activity className="h-5 w-5 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'achievement' ? 'bg-yellow-400' :
                          activity.type === 'lesson' ? 'bg-blue-400' : 
                          activity.type === 'streak' ? 'bg-orange-400' : 'bg-green-400'
                        } animate-pulse`}></div>
                        <span className="text-white text-sm">{activity.action}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{activity.time}</div>
                        {activity.xp && <div className="text-xs text-green-400">+{activity.xp} XP</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Recommended Lesson */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-5 w-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Continue Learning</h3>
                </div>
                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Welcome to CodeQuest</h4>
                      <p className="text-purple-200 text-sm">Your first interactive Python adventure</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-purple-200">
                      <span>⏱️ 45 min</span>
                      <span>⭐ 250 XP</span>
                      <span>🏆 3 Goals</span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Start Quest</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && false && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Foundation Phase - Python Mastery</h2>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Week 1 Lesson */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Welcome to CodeQuest</h3>
                      <p className="text-purple-200 text-sm">First Interactive Program</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">250 XP</div>
                    <div className="text-purple-200 text-sm">Week 1</div>
                  </div>
                </div>
                
                <p className="text-purple-200 mb-4">Begin your coding adventure! Create your first interactive Python program.</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-purple-200">
                    <span>3 Challenges</span>
                    <span>4 Goals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <span>Start Quest</span>
                  </div>
                </div>
              </div>

              {/* Week 2 Lesson */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Loops & Events</h3>
                      <p className="text-purple-200 text-sm">Build a Clicker Game</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">275 XP</div>
                    <div className="text-purple-200 text-sm">Week 2</div>
                  </div>
                </div>
                
                <p className="text-purple-200 mb-4">Master loops by building an addictive clicker game!</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-purple-200">
                    <span>3 Challenges</span>
                    <span>4 Goals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <span>Start Quest</span>
                  </div>
                </div>
              </div>

              {/* Week 3 Lesson */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🔢</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Python Basics</h3>
                      <p className="text-purple-200 text-sm">Number Guessing Game</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">300 XP</div>
                    <div className="text-purple-200 text-sm">Week 3</div>
                  </div>
                </div>
                
                <p className="text-purple-200 mb-4">Dive deeper into Python fundamentals!</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-purple-200">
                    <span>3 Challenges</span>
                    <span>4 Goals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <span>Start Quest</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Your CodeQuest Journey</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <h4 className="text-white font-medium">Foundation</h4>
                  <p className="text-purple-200 text-sm">Python Mastery</p>
                  <p className="text-purple-300 text-xs">Weeks 1-6</p>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="text-white font-medium">Innovation</h4>
                  <p className="text-purple-200 text-sm">AI Integration</p>
                  <p className="text-purple-300 text-xs">Coming Soon</p>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🌐</div>
                  <h4 className="text-white font-medium">Web Development</h4>
                  <p className="text-purple-200 text-sm">HTML & CSS</p>
                  <p className="text-purple-300 text-xs">Coming Soon</p>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="text-white font-medium">Capstone</h4>
                  <p className="text-purple-200 text-sm">Final Projects</p>
                  <p className="text-purple-300 text-xs">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENHANCED QUEST MAP */}
        {activeTab === 'questmap' && (
          <div className="w-full min-h-screen bg-slate-950">
            <AAAGameMap />
          </div>
        )}

        {/* MULTIPLAYER GUILD HALL (LEADERBOARD) */}
        {activeTab === 'leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Leaderboard Panel */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <span>🏆</span>
                <span>Class Leaderboard</span>
              </h2>
              <div className="space-y-4">
                {classmates.slice(0, 6).map((player, index) => (
                  <div key={player.name} className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                    player.name === (user.full_name?.split(' ')[0] || 'You')
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 transform scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                    <div className="text-2xl font-bold text-yellow-400 min-w-[2rem]">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="text-3xl animate-pulse">{player.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white flex items-center space-x-2">
                        <span>{player.name}</span>
                        {player.name === (user.full_name?.split(' ')[0] || 'You') && <span className="text-purple-400">(YOU)</span>}
                      </h4>
                      <p className="text-sm text-gray-300">Level {player.level} • {player.xp.toLocaleString()} XP</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      player.status === 'online' ? 'bg-green-400 animate-pulse' :
                      player.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guild Statistics */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Class Progress</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>Average Level</span>
                      <span>12.2</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '61%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>Lessons Completed</span>
                      <span>73%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
