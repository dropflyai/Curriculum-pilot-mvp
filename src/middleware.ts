import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required roles
const ROUTE_PROTECTION = {
  // Public routes that don't require authentication
  public: [
    '/',
    '/auth',
    '/auth/signup', 
    '/signin',
    '/games',
    '/api/lessons',
    '/api/list',
    '/api/debug/cookies',
    '/api/test-cookies',
    '/api/user/role'
  ],
  
  // Student-only routes
  student: [
    '/student',
    '/homework',
    '/lesson',
    '/python-lesson',
    '/python-lesson-direct',
    '/mission',
    '/mission-hq',
    '/dashboard',
    '/agent-academy-lesson-dashboard',
    '/ai-literacy',
    '/capstone-project',
    '/team-formation',
    '/course-overview',
    '/interactive-demo',
    '/achievements',
    '/quiz'
  ],
  
  // Teacher/Admin routes
  teacher: [
    '/teacher',
    '/admin'
  ],
  
  // Admin-only routes
  admin: [
    '/admin/system',
    '/admin/users',
    '/admin/analytics'
  ]
}

// Routes that should redirect to appropriate dashboard based on role
const DASHBOARD_REDIRECTS = [
  '/dashboard'
]

// Check if user has demo authentication - CONTROLLED ACCESS
function checkDemoAuth(request: NextRequest) {
  console.log('🛡️ CHECKPOINT M1: Middleware checking demo authentication')
  console.log('🛡️ CHECKPOINT M1: URL:', request.url)
  console.log('🛡️ CHECKPOINT M1: Timestamp:', new Date().toISOString())
  
  // Get all cookies at once to avoid multiple iterations
  const allCookies = request.cookies.getAll()
  const cookieMap = new Map(allCookies.map(cookie => [cookie.name, cookie.value]))
  
  console.log('🛡️ CHECKPOINT M2: Cookie analysis:')
  console.log('🛡️ CHECKPOINT M2:   Total cookies found:', allCookies.length)
  console.log('🛡️ CHECKPOINT M2:   Cookie names:', Array.from(cookieMap.keys()).sort())
  console.log('🛡️ CHECKPOINT M2:   All cookies:', Object.fromEntries(cookieMap.entries()))
  
  // Check for demo session token
  const demoToken = cookieMap.get('demo_auth_token')
  const demoRole = cookieMap.get('demo_user_role')
  const userRole = cookieMap.get('user_role')
  
  console.log('🛡️ CHECKPOINT M3: Critical cookie validation:')
  console.log('🛡️ CHECKPOINT M3:   demo_auth_token:', demoToken || 'NOT FOUND')
  console.log('🛡️ CHECKPOINT M3:   demo_user_role:', demoRole || 'NOT FOUND')
  console.log('🛡️ CHECKPOINT M3:   user_role:', userRole || 'NOT FOUND')
  
  // Check for exact token match
  const isTokenValid = demoToken === 'demo_access_2025'
  const hasRole = Boolean(demoRole)
  
  console.log('🛡️ CHECKPOINT M4: Token validation results:')
  console.log('🛡️ CHECKPOINT M4:   Expected token: "demo_access_2025"')
  console.log('🛡️ CHECKPOINT M4:   Actual token:', JSON.stringify(demoToken))
  console.log('🛡️ CHECKPOINT M4:   Token valid:', isTokenValid)
  console.log('🛡️ CHECKPOINT M4:   Has role:', hasRole)
  console.log('🛡️ CHECKPOINT M4:   Role value:', JSON.stringify(demoRole))
  
  if (isTokenValid && hasRole) {
    console.log('🛡️ CHECKPOINT M5: ✅ Demo authentication SUCCESSFUL')
    console.log('🛡️ CHECKPOINT M5: Creating demo user object with role:', demoRole)
    return { 
      isAuthenticated: true, 
      user: { 
        id: 'demo_user', 
        email: 'demo@codyflyai.com', 
        role: demoRole,
        isDemoUser: true 
      } 
    }
  }
  
  console.log('🛡️ CHECKPOINT M5: ❌ Demo authentication FAILED')
  console.log('🛡️ CHECKPOINT M5: Failure reasons:')
  console.log('🛡️ CHECKPOINT M5:   Token valid:', isTokenValid)
  console.log('🛡️ CHECKPOINT M5:   Has role:', hasRole)
  return { isAuthenticated: false, user: null }
}

// Check if user has test account authentication
function checkTestAuth(request: NextRequest) {
  const testUser = request.cookies.get('test_user')?.value
  const testAuth = request.cookies.get('test_authenticated')?.value
  
  // Debug logging for production
  console.log('Test auth cookies:', { testAuth, testUser: !!testUser })
  
  if (testAuth === 'true' && testUser) {
    try {
      const user = JSON.parse(decodeURIComponent(testUser))
      console.log('Test user parsed successfully:', user.email, user.role)
      return {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          isTestUser: true
        }
      }
    } catch (e) {
      console.error('Error parsing test user:', e)
    }
  }
  
  return { isAuthenticated: false, user: null }
}

// Check if user has Supabase authentication
function checkSupabaseAuth(request: NextRequest) {
  // Check for Supabase session tokens
  const accessToken = request.cookies.get('supabase-auth-token')?.value
  const refreshToken = request.cookies.get('supabase-refresh-token')?.value
  
  // For now, we'll do a basic check. In a real app, you'd validate the token
  if (accessToken || refreshToken) {
    return { isAuthenticated: true, user: null }
  }
  
  return { isAuthenticated: false, user: null }
}

// Get user role from various sources
function getUserRole(request: NextRequest, user: any = null): string | null {
  // Try to get role from demo user
  if (user?.role) {
    return user.role
  }
  
  // Try to get role from cookies
  const roleFromCookie = request.cookies.get('user_role')?.value
  if (roleFromCookie) {
    return roleFromCookie
  }
  
  // Try to get role from localStorage (won't work in middleware, but included for completeness)
  // In a real app, you'd get this from the JWT token or session
  return null
}

// Check if route matches any pattern in the array
function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

// Get appropriate dashboard based on role
function getDashboardPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher'
    case 'student':
    default:
      return '/games'
  }
}

// Check if user has required role for the route
function hasRequiredRole(userRole: string | null, requiredRole: string): boolean {
  if (!userRole) return false
  
  const roleHierarchy = {
    'student': 0,
    'teacher': 1,
    'admin': 2
  }
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? -1
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 999
  
  return userLevel >= requiredLevel
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestStartTime = Date.now()
  
  console.log('⚡ DEBUG MIDDLEWARE: ===== NEW REQUEST =====')
  console.log('⚡ DEBUG MIDDLEWARE: Processing request for pathname:', pathname)
  console.log('⚡ DEBUG MIDDLEWARE: Request URL:', request.url)
  console.log('⚡ DEBUG MIDDLEWARE: Request timestamp:', new Date().toISOString())
  console.log('⚡ DEBUG MIDDLEWARE: User-Agent:', request.headers.get('user-agent')?.substring(0, 100))
  
  // Skip middleware for static files, API routes (except protected ones), and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.includes('/api/') ||
    pathname.startsWith('/favicon')
  ) {
    console.log('⚡ DEBUG MIDDLEWARE: Skipping middleware for static/internal path:', pathname)
    return NextResponse.next()
  }

  console.log('🛡️ CHECKPOINT MW1: ===== AUTHENTICATION CHECK CHAIN =====')
  const authStartTime = Date.now()
  
  // Check authentication status (try test auth first, then demo, then supabase)
  console.log('🛡️ CHECKPOINT MW2: Step 1 - Checking test authentication...')
  const testAuth = checkTestAuth(request)
  console.log('🛡️ CHECKPOINT MW2: Test auth result:', {
    isAuthenticated: testAuth.isAuthenticated,
    userEmail: testAuth.user?.email,
    userRole: testAuth.user?.role
  })
  
  console.log('🛡️ CHECKPOINT MW3: Step 2 - Checking demo authentication...')
  const demoAuth = checkDemoAuth(request)
  console.log('🛡️ CHECKPOINT MW3: Demo auth result:', {
    isAuthenticated: demoAuth.isAuthenticated,
    userEmail: demoAuth.user?.email,
    userRole: demoAuth.user?.role,
    isDemoUser: demoAuth.user?.isDemoUser
  })
  
  console.log('🛡️ CHECKPOINT MW4: Step 3 - Checking supabase authentication...')
  const supabaseAuth = checkSupabaseAuth(request)
  console.log('🛡️ CHECKPOINT MW4: Supabase auth result:', supabaseAuth.isAuthenticated)
  
  const isAuthenticated = testAuth.isAuthenticated || demoAuth.isAuthenticated || supabaseAuth.isAuthenticated
  const user = testAuth.user || demoAuth.user || supabaseAuth.user
  const userRole = getUserRole(request, user)
  
  const authEndTime = Date.now()
  
  console.log('🛡️ CHECKPOINT MW5: ===== FINAL AUTH RESULTS =====')
  console.log('🛡️ CHECKPOINT MW5: Auth check duration:', authEndTime - authStartTime, 'ms')
  console.log('🛡️ CHECKPOINT MW5: Final authentication status:', isAuthenticated)
  console.log('🛡️ CHECKPOINT MW5: Selected user:', user ? { 
    id: user.id, 
    email: user.email, 
    role: user.role,
    isDemoUser: user.isDemoUser || false
  } : 'NULL')
  console.log('🛡️ CHECKPOINT MW5: Final user role:', userRole)
  console.log('🛡️ CHECKPOINT MW5: Auth method used:', 
    testAuth.isAuthenticated ? 'TEST' : 
    demoAuth.isAuthenticated ? 'DEMO' : 
    supabaseAuth.isAuthenticated ? 'SUPABASE' : 'NONE'
  )

  // Handle public routes
  if (matchesRoutes(pathname, ROUTE_PROTECTION.public)) {
    console.log('⚡ DEBUG MIDDLEWARE: Public route detected, allowing access')
    // Allow access to auth pages even if authenticated (so users can switch accounts)
    return NextResponse.next()
  }

  // Handle dashboard redirects
  if (DASHBOARD_REDIRECTS.includes(pathname)) {
    console.log('⚡ DEBUG MIDDLEWARE: Dashboard redirect route detected')
    if (!isAuthenticated) {
      console.log('⚡ DEBUG MIDDLEWARE: User not authenticated, redirecting to /auth')
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    
    const dashboardPath = userRole ? getDashboardPath(userRole) : '/student/dashboard'
    console.log('⚡ DEBUG MIDDLEWARE: Redirecting to dashboard:', dashboardPath)
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // All other routes require authentication
  if (!isAuthenticated) {
    console.log('⚡ DEBUG MIDDLEWARE: User not authenticated for protected route, redirecting to /auth')
    console.log('⚡ DEBUG MIDDLEWARE: Storing redirect path:', pathname)
    // Store the intended destination for redirect after login
    const response = NextResponse.redirect(new URL('/auth', request.url))
    response.cookies.set('redirect_after_login', pathname, { httpOnly: true, maxAge: 600 }) // 10 minutes
    return response
  }

  console.log('⚡ DEBUG MIDDLEWARE: User authenticated, checking role-based access')

  // Role-based access control
  let hasAccess = false
  let requiredRoleMessage = 'access'

  // Check admin routes
  if (matchesRoutes(pathname, ROUTE_PROTECTION.admin)) {
    console.log('⚡ DEBUG MIDDLEWARE: Admin route detected')
    hasAccess = hasRequiredRole(userRole, 'admin')
    requiredRoleMessage = 'administrator access'
    console.log('⚡ DEBUG MIDDLEWARE: Admin access granted:', hasAccess)
  }
  // Check teacher routes
  else if (matchesRoutes(pathname, ROUTE_PROTECTION.teacher)) {
    console.log('⚡ DEBUG MIDDLEWARE: Teacher route detected')
    hasAccess = hasRequiredRole(userRole, 'teacher')
    requiredRoleMessage = 'teacher access'
    console.log('⚡ DEBUG MIDDLEWARE: Teacher access granted:', hasAccess)
  }
  // Check student routes
  else if (matchesRoutes(pathname, ROUTE_PROTECTION.student)) {
    console.log('⚡ DEBUG MIDDLEWARE: Student route detected')
    hasAccess = hasRequiredRole(userRole, 'student')
    requiredRoleMessage = 'student access'
    console.log('⚡ DEBUG MIDDLEWARE: Student access granted:', hasAccess)
  }
  // Default: allow access if authenticated
  else {
    console.log('⚡ DEBUG MIDDLEWARE: Default route, allowing access for authenticated user')
    hasAccess = true
  }

  // If user doesn't have required role, redirect to appropriate dashboard with error
  if (!hasAccess) {
    console.log('⚡ DEBUG MIDDLEWARE: Access denied, redirecting to dashboard with error')
    const dashboardPath = userRole ? getDashboardPath(userRole) : '/student/dashboard'
    const redirectUrl = new URL(dashboardPath, request.url)
    redirectUrl.searchParams.set('error', `insufficient_permissions`)
    redirectUrl.searchParams.set('required', requiredRoleMessage)
    console.log('⚡ DEBUG MIDDLEWARE: Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  console.log('⚡ DEBUG MIDDLEWARE: Access granted, proceeding to route')

  // Agent Academy session activity tracking
  const response = NextResponse.next()
  
  // Update last activity timestamp for Agent Academy sessions
  if (isAuthenticated && userRole) {
    const userId = user?.id || 'authenticated-user'
    response.headers.set('X-AA-User-ID', userId)
    response.headers.set('X-AA-Role', userRole)
    response.headers.set('X-AA-Timestamp', new Date().toISOString())
    console.log('⚡ DEBUG MIDDLEWARE: Setting session headers for user:', userId)
  }

  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}