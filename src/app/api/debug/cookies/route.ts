import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  console.log('🔧 CHECKPOINT DEBUG: Cookie debug endpoint called')
  console.log('🔧 CHECKPOINT DEBUG: Timestamp:', new Date().toISOString())
  
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('🔧 CHECKPOINT DEBUG: Total cookies found:', allCookies.length)
    
    // Get all cookies as an object
    const cookieData = Object.fromEntries(
      allCookies.map(cookie => [cookie.name, {
        value: cookie.value,
        // Note: RequestCookie type doesn't include domain, path, expires etc
        // Only name and value are available
      }])
    )
    
    // Focus on our demo auth cookies
    const demoToken = cookieStore.get('demo_auth_token')
    const demoRole = cookieStore.get('demo_user_role')
    const userRole = cookieStore.get('user_role')
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      totalCookies: allCookies.length,
      allCookieNames: allCookies.map(c => c.name).sort(),
      demoAuthStatus: {
        demo_auth_token: demoToken?.value || 'NOT SET',
        demo_user_role: demoRole?.value || 'NOT SET',
        user_role: userRole?.value || 'NOT SET',
        tokenValid: demoToken?.value === 'demo_access_2025',
        hasRole: Boolean(demoRole?.value),
        isAuthenticated: demoToken?.value === 'demo_access_2025' && Boolean(demoRole?.value)
      },
      allCookies: cookieData,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production'
      }
    }
    
    console.log('🔧 CHECKPOINT DEBUG: Debug info:', JSON.stringify(debugInfo, null, 2))
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('🔧 CHECKPOINT DEBUG ERROR:', error)
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}