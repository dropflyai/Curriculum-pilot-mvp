import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required roles
const ROUTE_PROTECTION = {
  // Public routes that don't require authentication
  public: [
    '/',
    '/games',
    '/auth',
    '/auth/signup', 
    '/signin',
    '/demo',
    '/demo-access',
    '/interactive-demo',
    '/course-overview',
    '/api/lessons',
    '/api/list'
  ],
  
  // Student-only routes
  student: [
    '/student',
    '/homework',
    '/lesson',
    '/python-lesson',
    '/python-lesson-direct',
    '/mission/agent-academy',
    '/ai-literacy',
    '/capstone-project',
    '/team-formation'
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

// Check if user has demo authentication
function checkDemoAuth(request: NextRequest) {
  // Enable demo authentication for demo buttons
  const demoUser = request.cookies.get('demo_user')?.value
  const demoAuthenticated = request.cookies.get('demo_authenticated')?.value === 'true'
  
  if (demoAuthenticated && demoUser) {
    try {
      // Decode the cookie value if it's encoded
      const decodedUser = decodeURIComponent(demoUser)
      const user = JSON.parse(decodedUser)
      return { isAuthenticated: true, user }
    } catch {
      // Try parsing without decoding in case it's not encoded
      try {
        const user = JSON.parse(demoUser)
        return { isAuthenticated: true, user }
      } catch {
        return { isAuthenticated: false, user: null }
      }
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
  
  // Skip middleware for static files, API routes (except protected ones), and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.includes('/api/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check authentication status
  const demoAuth = checkDemoAuth(request)
  const supabaseAuth = checkSupabaseAuth(request)
  
  const isAuthenticated = demoAuth.isAuthenticated || supabaseAuth.isAuthenticated
  const user = demoAuth.user || supabaseAuth.user
  const userRole = getUserRole(request, user)

  // Handle public routes
  if (matchesRoutes(pathname, ROUTE_PROTECTION.public)) {
    // Allow access to auth pages even if authenticated (so users can switch accounts)
    return NextResponse.next()
  }

  // Handle dashboard redirects
  if (DASHBOARD_REDIRECTS.includes(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    
    const dashboardPath = userRole ? getDashboardPath(userRole) : '/student/dashboard'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // All other routes require authentication
  if (!isAuthenticated) {
    // Store the intended destination for redirect after login
    const response = NextResponse.redirect(new URL('/auth', request.url))
    response.cookies.set('redirect_after_login', pathname, { httpOnly: true, maxAge: 600 }) // 10 minutes
    return response
  }

  // Role-based access control
  let hasAccess = false
  let requiredRoleMessage = 'access'

  // Check admin routes
  if (matchesRoutes(pathname, ROUTE_PROTECTION.admin)) {
    hasAccess = hasRequiredRole(userRole, 'admin')
    requiredRoleMessage = 'administrator access'
  }
  // Check teacher routes
  else if (matchesRoutes(pathname, ROUTE_PROTECTION.teacher)) {
    hasAccess = hasRequiredRole(userRole, 'teacher')
    requiredRoleMessage = 'teacher access'
  }
  // Check student routes
  else if (matchesRoutes(pathname, ROUTE_PROTECTION.student)) {
    hasAccess = hasRequiredRole(userRole, 'student')
    requiredRoleMessage = 'student access'
  }
  // Default: allow access if authenticated
  else {
    hasAccess = true
  }

  // If user doesn't have required role, redirect to appropriate dashboard with error
  if (!hasAccess) {
    const dashboardPath = userRole ? getDashboardPath(userRole) : '/student/dashboard'
    const redirectUrl = new URL(dashboardPath, request.url)
    redirectUrl.searchParams.set('error', `insufficient_permissions`)
    redirectUrl.searchParams.set('required', requiredRoleMessage)
    return NextResponse.redirect(redirectUrl)
  }

  // Agent Academy session activity tracking
  const response = NextResponse.next()
  
  // Update last activity timestamp for Agent Academy sessions
  if (isAuthenticated && user?.id) {
    response.headers.set('X-AA-User-ID', user.id)
    response.headers.set('X-AA-Role', userRole || 'unknown')
    response.headers.set('X-AA-Timestamp', new Date().toISOString())
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