'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@/lib/supabase/types'
import { 
  Home, Trophy, Brain, Users, Settings, BookOpen, 
  Zap, Award, BarChart3, Menu, X, LogOut, User as UserIcon
} from 'lucide-react'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      // Check for demo user first (only in browser)
      if (typeof window !== 'undefined') {
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
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    // Clear demo data (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_authenticated')
      localStorage.removeItem('codefly_demo_user')
      localStorage.removeItem('codefly_demo_mode')
    }
    
    // Clear Supabase auth
    await supabase.auth.signOut()
    setUser(null)
    
    // Redirect to home
    window.location.href = '/'
  }

  if (loading || !user) return null

  const studentNavItems = [
    { href: '/agent-academy-intel', label: 'Dashboard', icon: Home },
    { href: '/lesson/1', label: 'Lessons', icon: BookOpen },
    { href: '/student/tutor', label: 'AI Tutor', icon: Brain },
    { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/student/badges', label: 'Badges', icon: Award }
  ]

  const teacherNavItems = [
    { href: '/teacher/console', label: 'Console', icon: BarChart3 },
    { href: '/teacher/students', label: 'Students', icon: Users },
    { href: '/teacher/draft-day', label: 'Draft Day', icon: Users },
    { href: '/teacher/assignments', label: 'Assignments', icon: BookOpen },
    { href: '/teacher/analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nav-present hidden lg:flex fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">CodeFly</h1>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'teacher' ? 'Teacher Console' : 'Student Portal'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-6">
            <div className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {user.display_name || user.full_name || 'User'}
                  </p>
                  <p className="text-gray-400 text-sm capitalize">{user.role}</p>
                </div>
              </div>
              
              {user.role === 'student' && (
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center text-yellow-400">
                    <Zap className="w-4 h-4 mr-1" />
                    <span>{user.total_xp} XP</span>
                  </div>
                  <div className="text-gray-400">
                    Level {Math.floor(user.total_xp / 100)}
                  </div>
                </div>
              )}
              
              <button
                onClick={signOut}
                className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg text-sm transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-white font-bold text-lg">CodeFly</span>
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-gray-900 z-40 pt-16">
            <div className="p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              
              {user && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user.display_name || user.full_name || 'User'}
                      </p>
                      <p className="text-gray-400 text-sm capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  {user.role === 'student' && (
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center text-yellow-400">
                        <Zap className="w-4 h-4 mr-1" />
                        <span>{user.total_xp} XP</span>
                      </div>
                      <div className="text-gray-400">
                        Level {Math.floor(user.total_xp / 100)}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Page Content Wrapper */}
      <div className="lg:ml-64">
        {/* Mobile top padding */}
        <div className="lg:hidden h-16" />
      </div>
    </>
  )
}