import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('🧪 COOKIE TEST: GET /api/test-cookies called')
  
  try {
    const cookieStore = await cookies()
    const url = new URL(request.url)
    const userAgent = request.headers.get('user-agent') || ''
    
    // Get all cookies
    const allCookies = cookieStore.getAll()
    
    console.log('🧪 COOKIE TEST: Total cookies found:', allCookies.length)
    console.log('🧪 COOKIE TEST: Request URL:', request.url)
    console.log('🧪 COOKIE TEST: User Agent:', userAgent.substring(0, 100))
    
    // Test critical cookies
    const demoAuthToken = cookieStore.get('demo_auth_token')
    const demoUserRole = cookieStore.get('demo_user_role')
    const userRole = cookieStore.get('user_role')
    
    // Parse request headers for cookie header
    const cookieHeader = request.headers.get('cookie')
    const parsedCookies = cookieHeader ? 
      Object.fromEntries(
        cookieHeader.split(';').map(c => {
          const [name, ...rest] = c.trim().split('=')
          return [name, rest.join('=')]
        })
      ) : {}
    
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        domain: url.hostname,
        protocol: url.protocol,
        port: url.port
      },
      requestInfo: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        userAgent: userAgent.substring(0, 200)
      },
      cookieAnalysis: {
        totalCookiesFound: allCookies.length,
        cookieHeaderPresent: !!cookieHeader,
        cookieHeaderLength: cookieHeader?.length || 0,
        rawCookieHeader: cookieHeader,
        parsedFromHeader: parsedCookies
      },
      criticalCookies: {
        demo_auth_token: {
          exists: !!demoAuthToken,
          value: demoAuthToken?.value || null,
          fromHeader: parsedCookies['demo_auth_token'] || null,
          matches: demoAuthToken?.value === 'demo_access_2025',
          details: demoAuthToken ? {
            httpOnly: demoAuthToken.httpOnly,
            secure: demoAuthToken.secure,
            sameSite: demoAuthToken.sameSite,
            path: demoAuthToken.path,
            domain: demoAuthToken.domain,
            maxAge: demoAuthToken.maxAge,
            expires: demoAuthToken.expires
          } : null
        },
        demo_user_role: {
          exists: !!demoUserRole,
          value: demoUserRole?.value || null,
          fromHeader: parsedCookies['demo_user_role'] || null,
          details: demoUserRole ? {
            httpOnly: demoUserRole.httpOnly,
            secure: demoUserRole.secure,
            sameSite: demoUserRole.sameSite,
            path: demoUserRole.path,
            domain: demoUserRole.domain,
            maxAge: demoUserRole.maxAge,
            expires: demoUserRole.expires
          } : null
        },
        user_role: {
          exists: !!userRole,
          value: userRole?.value || null,
          fromHeader: parsedCookies['user_role'] || null,
          details: userRole ? {
            httpOnly: userRole.httpOnly,
            secure: userRole.secure,
            sameSite: userRole.sameSite,
            path: userRole.path,
            domain: userRole.domain,
            maxAge: userRole.maxAge,
            expires: userRole.expires
          } : null
        }
      },
      allCookies: allCookies.reduce((acc, cookie) => {
        acc[cookie.name] = {
          value: cookie.value,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite,
          path: cookie.path,
          domain: cookie.domain,
          maxAge: cookie.maxAge,
          expires: cookie.expires
        }
        return acc
      }, {} as Record<string, any>),
      diagnostics: {
        authenticationValid: demoAuthToken?.value === 'demo_access_2025' && !!demoUserRole?.value,
        possibleIssues: [] as string[]
      }
    }
    
    // Diagnostic checks
    if (!demoAuthToken) {
      testResults.diagnostics.possibleIssues.push('demo_auth_token cookie not found')
    } else if (demoAuthToken.value !== 'demo_access_2025') {
      testResults.diagnostics.possibleIssues.push('demo_auth_token has incorrect value')
    }
    
    if (!demoUserRole) {
      testResults.diagnostics.possibleIssues.push('demo_user_role cookie not found')
    }
    
    if (cookieHeader && !cookieHeader.includes('demo_auth_token')) {
      testResults.diagnostics.possibleIssues.push('demo_auth_token not present in cookie header')
    }
    
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      testResults.diagnostics.possibleIssues.push('HTTPS required for secure cookies in production')
    }
    
    if (demoAuthToken && demoAuthToken.httpOnly && parsedCookies['demo_auth_token']) {
      testResults.diagnostics.possibleIssues.push('HttpOnly cookie visible in cookie header (should not happen)')
    }
    
    console.log('🧪 COOKIE TEST: Authentication valid:', testResults.diagnostics.authenticationValid)
    console.log('🧪 COOKIE TEST: Issues found:', testResults.diagnostics.possibleIssues)
    
    return NextResponse.json({
      success: true,
      ...testResults
    })
  } catch (error) {
    console.error('🧪 COOKIE TEST: Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('🧪 COOKIE TEST: POST /api/test-cookies called')
  
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { testType = 'comprehensive' } = body
    
    const isSecure = process.env.NODE_ENV === 'production'
    const testId = `test_${Date.now()}`
    
    console.log('🧪 COOKIE TEST: Running test type:', testType)
    console.log('🧪 COOKIE TEST: Test ID:', testId)
    console.log('🧪 COOKIE TEST: Is secure environment:', isSecure)
    
    const results = {
      testId,
      timestamp: new Date().toISOString(),
      testType,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        isSecure,
        url: request.url
      },
      tests: [] as Array<{
        name: string
        action: string
        success: boolean
        details: any
        error?: string
      }>
    }
    
    if (testType === 'comprehensive' || testType === 'set') {
      // Test 1: Basic cookie setting
      console.log('🧪 COOKIE TEST: Test 1 - Basic cookie setting')
      try {
        const basicOptions = {
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax' as const,
          maxAge: 300, // 5 minutes for testing
          path: '/'
        }
        
        cookieStore.set(`test_basic_${testId}`, 'test_value', basicOptions)
        const basicVerify = cookieStore.get(`test_basic_${testId}`)
        
        results.tests.push({
          name: 'Basic Cookie Setting',
          action: 'set basic cookie',
          success: !!basicVerify && basicVerify.value === 'test_value',
          details: {
            options: basicOptions,
            verification: basicVerify ? {
              value: basicVerify.value,
              httpOnly: basicVerify.httpOnly,
              secure: basicVerify.secure,
              sameSite: basicVerify.sameSite,
              path: basicVerify.path,
              maxAge: basicVerify.maxAge
            } : null
          }
        })
      } catch (error) {
        results.tests.push({
          name: 'Basic Cookie Setting',
          action: 'set basic cookie',
          success: false,
          details: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      
      // Test 2: Demo auth token simulation
      console.log('🧪 COOKIE TEST: Test 2 - Demo auth token simulation')
      try {
        const demoOptions = {
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/'
        }
        
        // Clear existing demo cookies first
        cookieStore.delete('demo_auth_token')
        cookieStore.delete('demo_user_role')
        cookieStore.delete('user_role')
        
        // Set demo cookies
        cookieStore.set('demo_auth_token', 'demo_access_2025', demoOptions)
        cookieStore.set('demo_user_role', 'student', demoOptions)
        cookieStore.set('user_role', 'student', demoOptions)
        
        // Verify cookies
        const tokenVerify = cookieStore.get('demo_auth_token')
        const roleVerify = cookieStore.get('demo_user_role')
        const userRoleVerify = cookieStore.get('user_role')
        
        const allSet = tokenVerify?.value === 'demo_access_2025' && 
                      roleVerify?.value === 'student' && 
                      userRoleVerify?.value === 'student'
        
        results.tests.push({
          name: 'Demo Authentication Cookies',
          action: 'set demo auth cookies',
          success: allSet,
          details: {
            options: demoOptions,
            verification: {
              demo_auth_token: tokenVerify?.value,
              demo_user_role: roleVerify?.value,
              user_role: userRoleVerify?.value
            }
          }
        })
      } catch (error) {
        results.tests.push({
          name: 'Demo Authentication Cookies',
          action: 'set demo auth cookies',
          success: false,
          details: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      
      // Test 3: Different cookie options
      console.log('🧪 COOKIE TEST: Test 3 - Different cookie options')
      try {
        const optionsTests = [
          { name: 'httpOnly_false', options: { httpOnly: false, path: '/' } },
          { name: 'secure_override', options: { httpOnly: true, secure: !isSecure, path: '/' } },
          { name: 'sameSite_strict', options: { httpOnly: true, secure: isSecure, sameSite: 'strict' as const, path: '/' } },
          { name: 'path_specific', options: { httpOnly: true, secure: isSecure, sameSite: 'lax' as const, path: '/api' } }
        ]
        
        const optionResults = []
        
        for (const test of optionsTests) {
          try {
            const cookieName = `test_options_${test.name}_${testId}`
            cookieStore.set(cookieName, `value_${test.name}`, test.options)
            const verify = cookieStore.get(cookieName)
            
            optionResults.push({
              test: test.name,
              success: !!verify && verify.value === `value_${test.name}`,
              options: test.options,
              result: verify ? {
                value: verify.value,
                httpOnly: verify.httpOnly,
                secure: verify.secure,
                sameSite: verify.sameSite,
                path: verify.path
              } : null
            })
          } catch (error) {
            optionResults.push({
              test: test.name,
              success: false,
              options: test.options,
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }
        
        results.tests.push({
          name: 'Cookie Options Variations',
          action: 'test different cookie options',
          success: optionResults.every(r => r.success),
          details: optionResults
        })
      } catch (error) {
        results.tests.push({
          name: 'Cookie Options Variations',
          action: 'test different cookie options',
          success: false,
          details: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    if (testType === 'comprehensive' || testType === 'read') {
      // Test 4: Cookie reading and persistence
      console.log('🧪 COOKIE TEST: Test 4 - Cookie reading and persistence')
      try {
        // Wait a moment then read cookies
        const allCookies = cookieStore.getAll()
        const testCookies = allCookies.filter(c => c.name.includes(testId))
        
        results.tests.push({
          name: 'Cookie Reading and Persistence',
          action: 'read previously set cookies',
          success: testCookies.length > 0,
          details: {
            totalCookies: allCookies.length,
            testCookiesFound: testCookies.length,
            testCookies: testCookies.map(c => ({
              name: c.name,
              value: c.value,
              httpOnly: c.httpOnly,
              secure: c.secure,
              sameSite: c.sameSite,
              path: c.path,
              domain: c.domain
            }))
          }
        })
      } catch (error) {
        results.tests.push({
          name: 'Cookie Reading and Persistence',
          action: 'read previously set cookies',
          success: false,
          details: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    if (testType === 'comprehensive' || testType === 'cleanup') {
      // Test 5: Cookie cleanup
      console.log('🧪 COOKIE TEST: Test 5 - Cookie cleanup')
      try {
        const beforeCleanup = cookieStore.getAll().filter(c => c.name.includes(testId))
        
        // Delete test cookies
        beforeCleanup.forEach(cookie => {
          cookieStore.delete(cookie.name)
        })
        
        const afterCleanup = cookieStore.getAll().filter(c => c.name.includes(testId))
        
        results.tests.push({
          name: 'Cookie Cleanup',
          action: 'delete test cookies',
          success: afterCleanup.length === 0,
          details: {
            beforeCleanup: beforeCleanup.length,
            afterCleanup: afterCleanup.length,
            remainingTestCookies: afterCleanup.map(c => c.name)
          }
        })
      } catch (error) {
        results.tests.push({
          name: 'Cookie Cleanup',
          action: 'delete test cookies',
          success: false,
          details: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    const overallSuccess = results.tests.every(test => test.success)
    const failedTests = results.tests.filter(test => !test.success)
    
    console.log('🧪 COOKIE TEST: Overall success:', overallSuccess)
    console.log('🧪 COOKIE TEST: Failed tests:', failedTests.length)
    
    return NextResponse.json({
      success: overallSuccess,
      summary: {
        totalTests: results.tests.length,
        passed: results.tests.filter(t => t.success).length,
        failed: failedTests.length,
        failedTests: failedTests.map(t => t.name)
      },
      ...results
    })
  } catch (error) {
    console.error('🧪 COOKIE TEST: Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}