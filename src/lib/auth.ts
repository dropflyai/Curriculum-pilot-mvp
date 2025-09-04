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

// Sign up with role - Simplified to avoid email issues temporarily
export async function signUp(email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student') {
  try {
    const supabase = getSupabase()
    
    // First try to sign up
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
    
    // If user needs confirmation, auto-confirm them (dev mode)
    if (authData.user && !authData.user.email_confirmed_at) {
      console.log('User signup requires confirmation - this is normal for Supabase')
    }

    // Create user profile in public.profiles table
    if (authData.user) {
      console.log('Attempting to create profile for user:', authData.user.id)
      console.log('Profile data:', { id: authData.user.id, email: authData.user.email, full_name: fullName, role: role })
      
      // Test if profiles table exists by doing a simple select first
      const { data: tableTest, error: tableError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (tableError) {
        console.error('Profiles table access error:', tableError)
        console.log('Creating profiles table might be needed')
      }
      
      const { data: insertData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          role: role
        }])
        .select()

      if (profileError) {
        console.error('Profile creation error - Full object:', profileError)
        console.error('Profile creation error type:', typeof profileError)
        console.error('Profile creation error keys:', Object.keys(profileError))
        console.error('Profile creation error details:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
          full_error: JSON.stringify(profileError, null, 2)
        })
        
        // Try to create the profiles table if it doesn't exist
        if (profileError.message?.includes('relation') || profileError.code === 'PGRST116') {
          console.log('Profiles table might not exist - this needs to be created in Supabase')
        }
      } else {
        console.log('Profile created successfully for user:', authData.user.id)
        console.log('Inserted profile data:', insertData)
      }

      // Skip email sending for now to avoid build issues
      console.log('Welcome email would be sent to:', authData.user.email)
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

    // Skip email verification check for now (demo mode)
    // if (data.user && !data.user.email_confirmed_at) {
    //   throw new Error('Please verify your email address before signing in. Check your inbox for the verification email.')
    // }

    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

// Sign out
export async function signOut() {
  try {
    // Clear demo authentication if present (only in browser)
    if (typeof window !== 'undefined') {
      // Clear localStorage items if they exist
      try {
        localStorage.removeItem('demo_user')
        localStorage.removeItem('demo_authenticated')
        localStorage.removeItem('codefly_demo_user')
        localStorage.removeItem('codefly_demo_mode')
      } catch (e) {
        // Ignore localStorage errors in SSR
      }
      
      // Clear demo cookies
      document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'demo_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }

    // Clear Supabase auth if configured
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
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

    // Get user profile from public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create it from auth metadata
      const role = user.user_metadata?.role || 'student'
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      
      const { error: insertError } = await supabase
        .from('profiles')
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