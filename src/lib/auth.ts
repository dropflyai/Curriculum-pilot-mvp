// Authentication utilities for Supabase Auth
import { createClient } from '@/lib/supabase'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  role: 'student' | 'teacher' | 'admin'
}

// Create supabase client when needed
function getSupabase() {
  return createClient()
}

// Sign up with role
export async function signUp(email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student') {
  try {
    const supabase = getSupabase()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })

    if (authError) throw authError

    // Create user profile in public.users table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          role: role
        }])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't throw - auth succeeded even if profile creation failed
      }
    }

    return { user: authData.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// Sign out
export async function signOut() {
  try {
    // Clear demo authentication if present
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_authenticated')
    }

    // Clear Supabase auth if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
    
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// Get current user with profile
export async function getCurrentUser(): Promise<{ user: AuthUser | null, error: Error | null }> {
  try {
    const supabase = getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) throw authError
    if (!user) return { user: null, error: null }

    // Get user profile from public.users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create it from auth metadata
      const role = user.user_metadata?.role || 'student'
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email!,
          full_name: fullName,
          role: role
        }])

      if (insertError) {
        console.error('Failed to create user profile:', insertError)
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          full_name: fullName,
          role: role
        },
        error: null
      }
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role
      },
      error: null
    }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = getSupabase()
  return supabase.auth.onAuthStateChange(async (event: any, session: any) => {
    if (session?.user) {
      const { user } = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}

// Check if user has required role
export function hasRole(user: AuthUser | null, requiredRole: 'student' | 'teacher' | 'admin'): boolean {
  if (!user) return false
  
  const roleHierarchy = {
    'student': 0,
    'teacher': 1,
    'admin': 2
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unknown error') }
  }
}