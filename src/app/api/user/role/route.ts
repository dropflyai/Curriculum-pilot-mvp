import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role, demoMode, gameId } = body
    
    if (demoMode) {
      // Set demo authentication cookies
      const cookieStore = await cookies()
      const isSecure = process.env.NODE_ENV === 'production'
      
      // Create demo user
      const demoUser = {
        id: `demo_${gameId}_${Date.now()}`,
        email: `demo.student@codefly.com`,
        role: role || 'student',
        full_name: 'Demo Student',
        isDemoUser: true,
        gameId: gameId
      }
      
      // Set authentication cookies
      cookieStore.set('demo_auth_token', 'demo_access_2025', {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      cookieStore.set('demo_user_role', role || 'student', {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      cookieStore.set('user_role', role || 'student', {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return NextResponse.json({ success: true, user: demoUser })
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error in POST /api/user/role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Check for hardcoded test account authentication
    const testUser = cookieStore.get('test_user')
    const testAuth = cookieStore.get('test_authenticated')
    
    if (testAuth?.value === 'true' && testUser?.value) {
      try {
        const user = JSON.parse(decodeURIComponent(testUser.value))
        return NextResponse.json({ role: user.role })
      } catch (e) {
        console.error('Error parsing test user:', e)
      }
    }
    
    // Check for demo account authentication
    const demoToken = cookieStore.get('demo_auth_token')
    const demoRole = cookieStore.get('demo_user_role')
    
    if (demoToken?.value === 'demo_access_2025' && demoRole?.value) {
      return NextResponse.json({ role: demoRole.value })
    }

    // Fall back to Supabase authentication
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      // Default to student if no profile found
      return NextResponse.json({ role: 'student' })
    }

    return NextResponse.json({ role: profile.role })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}