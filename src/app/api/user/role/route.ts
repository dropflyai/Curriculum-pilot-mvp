import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  console.log('🔥 CHECKPOINT 1: API POST /api/user/role - Entry point reached')
  console.log('🔥 CHECKPOINT 1: Request URL:', request.url)
  console.log('🔥 CHECKPOINT 1: Request method:', request.method)
  console.log('🔥 CHECKPOINT 1: Current timestamp:', new Date().toISOString())
  
  try {
    console.log('🔥 CHECKPOINT 2: Parsing request body...')
    const body = await request.json()
    console.log('🔥 CHECKPOINT 2: Request body parsed successfully:', JSON.stringify(body, null, 2))
    
    const { role, demoMode, gameId } = body
    console.log('🔥 DEBUG API: Extracted values - role:', role, 'demoMode:', demoMode, 'gameId:', gameId)
    
    if (demoMode) {
      console.log('🔥 CHECKPOINT 3: Demo mode detected - Processing demo authentication')
      
      // Set demo authentication cookies
      console.log('🔥 CHECKPOINT 4: Initializing cookie store...')
      const cookieStore = await cookies()
      const isSecure = process.env.NODE_ENV === 'production'
      
      console.log('🔥 CHECKPOINT 4: Cookie store initialized')
      console.log('🔥 CHECKPOINT 4: Environment - NODE_ENV:', process.env.NODE_ENV, 'isSecure:', isSecure)
      
      // Create demo user
      const demoUser = {
        id: `demo_${gameId}_${Date.now()}`,
        email: `demo.student@codefly.com`,
        role: role || 'student',
        full_name: 'Demo Student',
        isDemoUser: true,
        gameId: gameId
      }
      
      console.log('🔥 DEBUG API: Created demo user:', JSON.stringify(demoUser, null, 2))
      
      // Set authentication cookies with comprehensive options
      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/', // Ensure cookies are available site-wide
        domain: undefined // Let the browser set the domain automatically
      }
      
      // Log current environment details for debugging
      const requestUrl = new URL(request.url)
      console.log('🔥 DEBUG API: Environment details - hostname:', requestUrl.hostname, 'protocol:', requestUrl.protocol, 'port:', requestUrl.port)
      
      // Check for existing cookies before setting (for debugging)
      const existingToken = cookieStore.get('demo_auth_token')
      const existingRole = cookieStore.get('demo_user_role')
      console.log('🔥 DEBUG API: Existing cookies before clear - token:', existingToken?.value, 'role:', existingRole?.value)
      
      console.log('🔥 DEBUG API: Cookie options:', JSON.stringify(cookieOptions, null, 2))
      console.log('🔥 DEBUG API: Request URL:', request.url)
      console.log('🔥 DEBUG API: Request headers:', Object.fromEntries(new Headers(request.headers).entries()))
      
      // Clear any existing cookies first to avoid conflicts
      console.log('🔥 CHECKPOINT 5: Clearing existing cookies to prevent conflicts...')
      try {
        cookieStore.delete('demo_auth_token')
        cookieStore.delete('demo_user_role') 
        cookieStore.delete('user_role')
        console.log('🔥 CHECKPOINT 5: Existing cookies cleared successfully')
      } catch (clearError) {
        console.log('🔥 CHECKPOINT 5: Error clearing cookies (may not exist):', clearError)
      }
      
      console.log('🔥 CHECKPOINT 6: Setting authentication cookies...')
      console.log('🔥 CHECKPOINT 6: Setting demo_auth_token = "demo_access_2025"')
      cookieStore.set('demo_auth_token', 'demo_access_2025', cookieOptions)
      
      console.log('🔥 CHECKPOINT 6: Setting demo_user_role =', role || 'student')
      cookieStore.set('demo_user_role', role || 'student', cookieOptions)
      
      console.log('🔥 CHECKPOINT 6: Setting user_role =', role || 'student')
      cookieStore.set('user_role', role || 'student', cookieOptions)
      
      console.log('🔥 CHECKPOINT 6: All cookies set via cookieStore.set() method')
      
      // Additional debugging - check if cookieStore operations worked
      console.log('🔥 DEBUG API: CookieStore type:', typeof cookieStore)
      console.log('🔥 DEBUG API: CookieStore methods:', Object.getOwnPropertyNames(cookieStore))
      
      // Verify cookies were set by reading them back
      console.log('🔥 CHECKPOINT 7: Verifying cookies were set correctly...')
      const verifyToken = cookieStore.get('demo_auth_token')
      const verifyRole = cookieStore.get('demo_user_role')
      const verifyUserRole = cookieStore.get('user_role')
      
      console.log('🔥 CHECKPOINT 7: Verification Results:')
      console.log('🔥 CHECKPOINT 7:   demo_auth_token:', verifyToken?.value || 'NOT SET')
      console.log('🔥 CHECKPOINT 7:   demo_user_role:', verifyRole?.value || 'NOT SET')
      console.log('🔥 CHECKPOINT 7:   user_role:', verifyUserRole?.value || 'NOT SET')
      
      const allCookiesSet = verifyToken && verifyRole && verifyUserRole
      console.log('🔥 CHECKPOINT 7: All required cookies set:', allCookiesSet)
      
      // Additional verification - get all cookies to see what's actually set
      const allCookies = cookieStore.getAll()
      console.log('🔥 CHECKPOINT 7: All cookies after setting:', allCookies.map(c => ({ 
        name: c.name, 
        value: c.value, 
        httpOnly: c.httpOnly, 
        secure: c.secure, 
        sameSite: c.sameSite, 
        path: c.path,
        domain: c.domain,
        maxAge: c.maxAge
      })))
      
      // Check if cookies match expected values
      const tokenMatches = verifyToken?.value === 'demo_access_2025'
      const roleMatches = verifyRole?.value === (role || 'student')
      const userRoleMatches = verifyUserRole?.value === (role || 'student')
      
      console.log('🔥 CHECKPOINT 7: Cookie value validation - token matches:', tokenMatches, 'role matches:', roleMatches, 'user_role matches:', userRoleMatches)
      
      // Log potential issues
      if (!tokenMatches && verifyToken) {
        console.log('🔥 WARNING: demo_auth_token has unexpected value. Expected: "demo_access_2025", Got:', JSON.stringify(verifyToken.value))
      }
      if (!roleMatches && verifyRole) {
        console.log('🔥 WARNING: demo_user_role has unexpected value. Expected:', JSON.stringify(role || 'student'), 'Got:', JSON.stringify(verifyRole.value))
      }
      if (!userRoleMatches && verifyUserRole) {
        console.log('🔥 WARNING: user_role has unexpected value. Expected:', JSON.stringify(role || 'student'), 'Got:', JSON.stringify(verifyUserRole.value))
      }
      
      // Create response with explicit cookie headers to ensure they're set
      const response = NextResponse.json({ 
        success: true, 
        user: demoUser,
        cookiesSet: {
          demo_auth_token: verifyToken?.value,
          demo_user_role: verifyRole?.value,
          user_role: verifyUserRole?.value
        },
        cookieOptions: cookieOptions,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          isSecure: isSecure
        },
        timestamp: new Date().toISOString()
      })
      
      // CRITICAL FIX: Set cookies directly on the response headers as well
      console.log('🔥 CHECKPOINT 8: Setting cookies on response headers as backup method...')
      
      const cookieString1 = `demo_auth_token=demo_access_2025; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${60 * 60 * 24}; Path=/`
      const cookieString2 = `demo_user_role=${role || 'student'}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${60 * 60 * 24}; Path=/`
      const cookieString3 = `user_role=${role || 'student'}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${60 * 60 * 24}; Path=/`
      
      console.log('🔥 CHECKPOINT 8: Cookie strings created:')
      console.log('🔥 CHECKPOINT 8:   cookie1:', cookieString1)
      console.log('🔥 CHECKPOINT 8:   cookie2:', cookieString2)
      console.log('🔥 CHECKPOINT 8:   cookie3:', cookieString3)
      
      // Set cookies via response headers (alternative method)
      response.headers.append('Set-Cookie', cookieString1)
      response.headers.append('Set-Cookie', cookieString2) 
      response.headers.append('Set-Cookie', cookieString3)
      
      console.log('🔥 CHECKPOINT 8: Response headers updated with Set-Cookie headers')
      console.log('🔥 CHECKPOINT 8: Final response headers:', Object.fromEntries(response.headers.entries()))
      console.log('🔥 CHECKPOINT 9: API POST complete - Returning successful response')
      
      return response
    }
    
    console.log('🔥 DEBUG API: Not demo mode, returning error')
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('🔥 DEBUG API: Error in POST /api/user/role:', error)
    console.error('🔥 DEBUG API: Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  console.log('🔍 CHECKPOINT A: API GET /api/user/role - Verification request received')
  console.log('🔍 CHECKPOINT A: Current timestamp:', new Date().toISOString())
  
  try {
    console.log('🔍 CHECKPOINT B: Initializing cookie store for verification...')
    const cookieStore = await cookies()
    
    // Get all cookies for debugging
    const allCookieNames = cookieStore.getAll().map(c => c.name)
    console.log('🔍 CHECKPOINT B: Available cookie names:', allCookieNames)
    
    // Check for hardcoded test account authentication
    console.log('🔍 CHECKPOINT C: Checking test authentication...')
    const testUser = cookieStore.get('test_user')
    const testAuth = cookieStore.get('test_authenticated')
    
    if (testAuth?.value === 'true' && testUser?.value) {
      console.log('🔍 CHECKPOINT C: Test authentication found')
      try {
        const user = JSON.parse(decodeURIComponent(testUser.value))
        console.log('🔍 CHECKPOINT C: Returning test user role:', user.role)
        return NextResponse.json({ role: user.role })
      } catch (e) {
        console.error('🔍 CHECKPOINT C: Error parsing test user:', e)
      }
    }
    
    // Check for demo account authentication using the correct cookie names
    console.log('🔍 CHECKPOINT D: Checking demo authentication...')
    const demoToken = cookieStore.get('demo_auth_token')
    const demoRole = cookieStore.get('demo_user_role')
    
    console.log('🔍 CHECKPOINT D: Demo cookie values:')
    console.log('🔍 CHECKPOINT D:   demo_auth_token:', demoToken?.value || 'NOT FOUND')
    console.log('🔍 CHECKPOINT D:   demo_user_role:', demoRole?.value || 'NOT FOUND')
    console.log('🔍 CHECKPOINT D:   Expected token: "demo_access_2025"')
    console.log('🔍 CHECKPOINT D:   Token match:', demoToken?.value === 'demo_access_2025')
    
    if (demoToken?.value === 'demo_access_2025' && demoRole?.value) {
      console.log('🔍 CHECKPOINT D: ✅ Demo authentication verified successfully!')
      console.log('🔍 CHECKPOINT D: Returning demo user role:', demoRole.value)
      return NextResponse.json({ role: demoRole.value })
    }
    
    console.log('🔍 CHECKPOINT D: ❌ Demo authentication failed')

    // Fall back to Supabase authentication
    console.log('🔍 CHECKPOINT E: Attempting Supabase authentication...')
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('🔍 CHECKPOINT E: No Supabase authentication found')
      console.log('🔍 CHECKPOINT F: ❌ No valid authentication method found')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('🔍 CHECKPOINT E: Supabase user found, checking profile...')
    
    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log('🔍 CHECKPOINT E: No profile found, defaulting to student')
      return NextResponse.json({ role: 'student' })
    }

    console.log('🔍 CHECKPOINT E: ✅ Supabase authentication successful, role:', profile.role)
    return NextResponse.json({ role: profile.role })
  } catch (error) {
    console.error('🔍 CHECKPOINT ERROR: GET /api/user/role failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}