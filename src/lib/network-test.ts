/**
 * Network Monitor Testing Utilities
 * AGENT 4 - Network Request Monitor Testing
 */

import { networkMonitor, logBrowserState } from './network-monitor'

// Test the /api/user/role endpoint specifically
export async function testApiUserRole() {
  console.group('🎯 AGENT 4: Testing /api/user/role endpoint')
  
  try {
    // Log initial state
    console.log('🎯 Pre-request state:')
    logBrowserState()
    
    // Test POST request (auth)
    console.log('🎯 Testing POST /api/user/role (authentication)...')
    const postResponse = await fetch('/api/user/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Request': 'true'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        role: 'student',
        demoMode: true,
        gameId: 'test-network-monitor'
      })
    })
    
    const postData = await postResponse.json()
    console.log('🎯 POST response:', postData)
    console.log('🎯 POST headers:', Object.fromEntries(postResponse.headers.entries()))
    
    // Wait a moment for cookies to be set
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Log state after POST
    console.log('🎯 Post-POST state:')
    logBrowserState()
    
    // Test GET request (verification)
    console.log('🎯 Testing GET /api/user/role (verification)...')
    const getResponse = await fetch('/api/user/role', {
      method: 'GET',
      headers: {
        'X-Test-Request': 'true'
      },
      credentials: 'same-origin',
      cache: 'no-cache'
    })
    
    const getData = await getResponse.json()
    console.log('🎯 GET response:', getData)
    console.log('🎯 GET headers:', Object.fromEntries(getResponse.headers.entries()))
    
    // Display network monitor summary
    console.log('🎯 Network Monitor Summary:')
    networkMonitor.printSummary()
    
    const userRoleLogs = networkMonitor.getLogsForUrl('/api/user/role')
    console.log('🎯 /api/user/role requests:', userRoleLogs.length)
    
    userRoleLogs.forEach((log, index) => {
      console.log(`🎯 Request ${index + 1}:`, {
        method: log.method,
        status: log.responseStatus,
        duration: log.timing.duration + 'ms',
        cookieChanged: log.cookiesBefore !== log.cookiesAfter,
        hasError: !!log.error
      })
    })
    
    return {
      success: true,
      postResponse: { status: postResponse.status, data: postData },
      getResponse: { status: getResponse.status, data: getData },
      networkLogs: userRoleLogs.length,
      metrics: networkMonitor.getMetrics()
    }
    
  } catch (error) {
    console.error('🎯 Test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      metrics: networkMonitor.getMetrics()
    }
  } finally {
    console.groupEnd()
  }
}

// Test CORS and header handling
export async function testCorsAndHeaders() {
  console.group('🎯 AGENT 4: Testing CORS and Headers')
  
  try {
    const testHeaders = {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'test-value',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
    
    console.log('🎯 Testing with custom headers:', testHeaders)
    
    const response = await fetch('/api/user/role', {
      method: 'GET',
      headers: testHeaders,
      credentials: 'include', // Test credentials handling
      cache: 'no-cache'
    })
    
    console.log('🎯 Response status:', response.status)
    console.log('🎯 Response headers:', Object.fromEntries(response.headers.entries()))
    
    // Check for CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
      'Access-Control-Allow-Credentials': response.headers.get('access-control-allow-credentials'),
      'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers'),
      'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods')
    }
    
    console.log('🎯 CORS headers:', corsHeaders)
    
    return {
      success: response.ok,
      status: response.status,
      corsHeaders,
      hasCredentials: corsHeaders['Access-Control-Allow-Credentials'] === 'true'
    }
    
  } catch (error) {
    console.error('🎯 CORS test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  } finally {
    console.groupEnd()
  }
}

// Comprehensive network diagnostics
export async function runNetworkDiagnostics() {
  console.group('🎯 AGENT 4: Comprehensive Network Diagnostics')
  
  console.log('🎯 Browser Environment:')
  console.log('  - URL:', window.location.href)
  console.log('  - Protocol:', window.location.protocol)
  console.log('  - Host:', window.location.host)
  console.log('  - Cookies enabled:', navigator.cookieEnabled)
  console.log('  - User agent:', navigator.userAgent.substring(0, 100) + '...')
  
  // Test 1: Basic API functionality
  console.log('\n🎯 Test 1: API User Role Functionality')
  const apiTest = await testApiUserRole()
  
  // Test 2: CORS and headers
  console.log('\n🎯 Test 2: CORS and Headers')
  const corsTest = await testCorsAndHeaders()
  
  // Test 3: Cookie persistence
  console.log('\n🎯 Test 3: Cookie Persistence')
  const cookiesBefore = document.cookie
  
  // Make a request that should set cookies
  try {
    await fetch('/api/user/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ role: 'student', demoMode: true, gameId: 'persistence-test' })
    })
    
    // Wait for cookies to be set
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const cookiesAfter = document.cookie
    const cookieChanged = cookiesBefore !== cookiesAfter
    
    console.log('🎯 Cookie persistence test:')
    console.log('  - Cookies before:', cookiesBefore || '(none)')
    console.log('  - Cookies after:', cookiesAfter || '(none)')
    console.log('  - Changed:', cookieChanged)
    
  } catch (error) {
    console.error('🎯 Cookie persistence test failed:', error)
  }
  
  // Test 4: Network Monitor metrics
  console.log('\n🎯 Test 4: Network Monitor Metrics')
  const metrics = networkMonitor.getMetrics()
  console.log('🎯 Metrics:', metrics)
  
  // Test 5: Performance timing
  console.log('\n🎯 Test 5: Performance Analysis')
  if (performance.timing) {
    const timing = performance.timing
    console.log('🎯 Page timing:', {
      totalPageLoad: timing.loadEventEnd - timing.navigationStart + 'ms',
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart + 'ms',
      tcpConnection: timing.connectEnd - timing.connectStart + 'ms',
      requestTime: timing.responseStart - timing.requestStart + 'ms',
      responseTime: timing.responseEnd - timing.responseStart + 'ms',
      domProcessing: timing.domComplete - timing.domLoading + 'ms'
    })
  }
  
  console.log('\n🎯 Diagnostics Summary:')
  console.log('  - API Test:', apiTest.success ? '✅ PASS' : '❌ FAIL')
  console.log('  - CORS Test:', corsTest.success ? '✅ PASS' : '❌ FAIL')
  console.log('  - Network Monitor:', metrics.totalRequests > 0 ? '✅ ACTIVE' : '❌ INACTIVE')
  console.log('  - Total Requests Monitored:', metrics.totalRequests)
  console.log('  - Average Response Time:', metrics.averageResponseTime.toFixed(2) + 'ms')
  
  console.groupEnd()
  
  return {
    apiTest,
    corsTest,
    metrics,
    summary: {
      allTestsPassed: apiTest.success && corsTest.success,
      monitorActive: metrics.totalRequests > 0,
      totalRequests: metrics.totalRequests,
      averageResponseTime: metrics.averageResponseTime
    }
  }
}

// Global function for easy browser console access
if (typeof window !== 'undefined') {
  (window as any).testNetworkMonitor = runNetworkDiagnostics
  (window as any).testApiRole = testApiUserRole
  (window as any).testCors = testCorsAndHeaders
  (window as any).networkMonitor = networkMonitor
  
  console.log('🎯 AGENT 4: Network test functions available:')
  console.log('  - testNetworkMonitor() - Run full diagnostics')
  console.log('  - testApiRole() - Test /api/user/role endpoint')
  console.log('  - testCors() - Test CORS and headers')
  console.log('  - networkMonitor - Access network monitor instance')
}