'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, getCurrentUser, onAuthStateChange } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isStudent: boolean
  isTeacher: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isStudent: false,
  isTeacher: false,
  isAdmin: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo authentication first
    const checkDemoAuth = () => {
      if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user')
        const isDemoAuth = localStorage.getItem('demo_authenticated')
        
        if (demoUser && isDemoAuth === 'true') {
          setUser(JSON.parse(demoUser))
          setLoading(false)
          return true
        }
      }
      return false
    }

    // If demo auth found, use it
    if (checkDemoAuth()) {
      return
    }

    // Otherwise, use Supabase auth if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Get initial user
      getCurrentUser().then(({ user }) => {
        setUser(user)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = onAuthStateChange((user) => {
        setUser(user)
        setLoading(false)
      })

      return () => {
        subscription?.unsubscribe()
      }
    } else {
      // No Supabase configured, just set loading to false
      setLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher' || user?.role === 'admin',
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}