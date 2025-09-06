import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

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
    const demoUser = cookieStore.get('demo_user')
    const demoAuth = cookieStore.get('demo_authenticated')
    
    if (demoAuth?.value === 'true' && demoUser?.value) {
      try {
        const user = JSON.parse(decodeURIComponent(demoUser.value))
        return NextResponse.json({ role: user.role })
      } catch (e) {
        console.error('Error parsing demo user:', e)
      }
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