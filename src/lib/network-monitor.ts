/**
 * Network Request Monitor
 * Comprehensive debugging utility for tracking HTTP request/response flow
 * Focuses on POST /api/user/role and cookie handling
 */

interface NetworkRequestLog {
  id: string
  timestamp: number
  url: string
  method: string
  requestHeaders: Record<string, string>
  requestBody?: any
  responseStatus?: number
  responseHeaders?: Record<string, string>
  responseBody?: any
  timing: {
    start: number
    end?: number
    duration?: number
  }
  error?: string
  cookiesBefore?: string
  cookiesAfter?: string
}

interface NetworkMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  corsErrors: number
  cookieIssues: number
}

class NetworkMonitor {
  private logs: NetworkRequestLog[] = []
  private listeners: Array<(log: NetworkRequestLog) => void> = []
  private isEnabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.interceptFetch()
      this.logInitialState()
    }
  }

  private logInitialState() {
    console.group('🌐 NETWORK MONITOR: Initialized')
    console.log('🌐 Current URL:', window.location.href)
    console.log('🌐 Current cookies:', document.cookie)
    console.log('🌐 User agent:', navigator.userAgent)
    console.log('🌐 Timestamp:', new Date().toISOString())
    console.groupEnd()
  }

  private interceptFetch() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!this.isEnabled) {
        return originalFetch(input, init)
      }

      const url = typeof input === 'string' ? input : input.toString()
      const method = init?.method || 'GET'
      const requestId = this.generateRequestId()
      
      const log: NetworkRequestLog = {
        id: requestId,
        timestamp: Date.now(),
        url,
        method,
        requestHeaders: this.extractHeaders(init?.headers),
        requestBody: this.extractBody(init?.body),
        timing: {
          start: performance.now()
        },
        cookiesBefore: document.cookie
      }

      // Log request details
      this.logRequest(log)

      try {
        const response = await originalFetch(input, init)
        
        log.timing.end = performance.now()
        log.timing.duration = log.timing.end - log.timing.start
        log.responseStatus = response.status
        log.responseHeaders = this.extractResponseHeaders(response.headers)
        log.cookiesAfter = document.cookie

        // Clone response to read body without consuming it
        const responseClone = response.clone()
        try {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            log.responseBody = await responseClone.json()
          } else {
            log.responseBody = await responseClone.text()
          }
        } catch (bodyError) {
          log.responseBody = '[Error reading response body]'
        }

        this.logResponse(log)
        this.addLog(log)
        
        return response
      } catch (error) {
        log.timing.end = performance.now()
        log.timing.duration = log.timing.end - log.timing.start
        log.error = error instanceof Error ? error.message : String(error)
        log.cookiesAfter = document.cookie

        this.logError(log)
        this.addLog(log)
        
        throw error
      }
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private extractHeaders(headers?: HeadersInit): Record<string, string> {
    const result: Record<string, string> = {}
    
    if (!headers) return result

    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        result[key] = value
      })
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        result[key] = value
      })
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        result[key] = value
      })
    }

    return result
  }

  private extractResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  private extractBody(body?: BodyInit | null): any {
    if (!body) return null
    
    if (typeof body === 'string') {
      try {
        return JSON.parse(body)
      } catch {
        return body
      }
    }
    
    if (body instanceof FormData) {
      const result: Record<string, any> = {}
      body.forEach((value, key) => {
        result[key] = value
      })
      return result
    }

    return '[Body content not readable]'
  }

  private logRequest(log: NetworkRequestLog) {
    console.group(`🔵 REQUEST: ${log.method} ${log.url}`)
    console.log('🔵 Request ID:', log.id)
    console.log('🔵 Timestamp:', new Date(log.timestamp).toISOString())
    console.log('🔵 Headers:', log.requestHeaders)
    console.log('🔵 Body:', log.requestBody)
    console.log('🔵 Cookies before:', log.cookiesBefore)
    
    // Special focus on /api/user/role requests
    if (log.url.includes('/api/user/role')) {
      console.log('🎯 FOCUS: This is a /api/user/role request!')
      console.log('🎯 Method:', log.method)
      console.log('🎯 Request body:', JSON.stringify(log.requestBody, null, 2))
      console.log('🎯 Content-Type:', log.requestHeaders['Content-Type'] || log.requestHeaders['content-type'])
    }
    
    console.groupEnd()
  }

  private logResponse(log: NetworkRequestLog) {
    const isSuccess = log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300
    const icon = isSuccess ? '🟢' : '🔴'
    
    console.group(`${icon} RESPONSE: ${log.responseStatus} ${log.method} ${log.url}`)
    console.log(`${icon} Request ID:`, log.id)
    console.log(`${icon} Status:`, log.responseStatus)
    console.log(`${icon} Duration:`, `${log.timing.duration?.toFixed(2)}ms`)
    console.log(`${icon} Response headers:`, log.responseHeaders)
    console.log(`${icon} Response body:`, log.responseBody)
    console.log(`${icon} Cookies after:`, log.cookiesAfter)
    
    // Check for cookie changes
    if (log.cookiesBefore !== log.cookiesAfter) {
      console.log('🍪 COOKIE CHANGE DETECTED!')
      console.log('🍪 Before:', log.cookiesBefore)
      console.log('🍪 After:', log.cookiesAfter)
    }
    
    // Check for CORS issues
    this.checkCorsIssues(log)
    
    // Special focus on /api/user/role responses
    if (log.url.includes('/api/user/role')) {
      console.log('🎯 FOCUS: /api/user/role response analysis')
      console.log('🎯 Set-Cookie header:', log.responseHeaders?.['Set-Cookie'] || log.responseHeaders?.['set-cookie'] || 'None')
      console.log('🎯 Response data:', JSON.stringify(log.responseBody, null, 2))
      
      // Check for authentication cookies
      const setCookieHeader = log.responseHeaders?.['Set-Cookie'] || log.responseHeaders?.['set-cookie']
      if (setCookieHeader) {
        console.log('🎯 Authentication cookie set!')
        console.log('🎯 Cookie details:', setCookieHeader)
      } else {
        console.warn('🎯 No Set-Cookie header found in response')
      }
    }
    
    console.groupEnd()
  }

  private logError(log: NetworkRequestLog) {
    console.group(`❌ ERROR: ${log.method} ${log.url}`)
    console.log('❌ Request ID:', log.id)
    console.log('❌ Error:', log.error)
    console.log('❌ Duration:', `${log.timing.duration?.toFixed(2)}ms`)
    console.log('❌ Cookies after:', log.cookiesAfter)
    console.groupEnd()
  }

  private checkCorsIssues(log: NetworkRequestLog) {
    const accessControlOrigin = log.responseHeaders?.['Access-Control-Allow-Origin'] || 
                               log.responseHeaders?.['access-control-allow-origin']
    
    if (log.responseStatus === 0 || (log.responseStatus && log.responseStatus >= 400)) {
      console.warn('⚠️ Potential CORS issue detected')
      console.warn('⚠️ Access-Control-Allow-Origin:', accessControlOrigin || 'Not set')
      console.warn('⚠️ Request origin:', window.location.origin)
    }
  }

  private addLog(log: NetworkRequestLog) {
    this.logs.push(log)
    this.notifyListeners(log)
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }
  }

  private notifyListeners(log: NetworkRequestLog) {
    this.listeners.forEach(listener => {
      try {
        listener(log)
      } catch (error) {
        console.error('Error in network monitor listener:', error)
      }
    })
  }

  // Public methods
  public enable() {
    this.isEnabled = true
    console.log('🌐 Network monitor enabled')
  }

  public disable() {
    this.isEnabled = false
    console.log('🌐 Network monitor disabled')
  }

  public getLogs(): NetworkRequestLog[] {
    return [...this.logs]
  }

  public getLogsForUrl(url: string): NetworkRequestLog[] {
    return this.logs.filter(log => log.url.includes(url))
  }

  public getMetrics(): NetworkMetrics {
    const totalRequests = this.logs.length
    const successfulRequests = this.logs.filter(log => 
      log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300
    ).length
    const failedRequests = totalRequests - successfulRequests
    
    const durations = this.logs
      .filter(log => log.timing.duration)
      .map(log => log.timing.duration!)
    
    const averageResponseTime = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
      : 0

    const corsErrors = this.logs.filter(log => 
      log.responseStatus === 0 || log.error?.includes('CORS')
    ).length

    const cookieIssues = this.logs.filter(log => 
      log.url.includes('/api/user/role') && 
      !log.responseHeaders?.['Set-Cookie'] && 
      !log.responseHeaders?.['set-cookie']
    ).length

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      corsErrors,
      cookieIssues
    }
  }

  public addListener(listener: (log: NetworkRequestLog) => void) {
    this.listeners.push(listener)
  }

  public removeListener(listener: (log: NetworkRequestLog) => void) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  public clearLogs() {
    this.logs = []
    console.log('🌐 Network logs cleared')
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  public printSummary() {
    const metrics = this.getMetrics()
    console.group('🌐 NETWORK MONITOR SUMMARY')
    console.log('📊 Total requests:', metrics.totalRequests)
    console.log('✅ Successful requests:', metrics.successfulRequests)
    console.log('❌ Failed requests:', metrics.failedRequests)
    console.log('⏱️ Average response time:', `${metrics.averageResponseTime.toFixed(2)}ms`)
    console.log('🚫 CORS errors:', metrics.corsErrors)
    console.log('🍪 Cookie issues:', metrics.cookieIssues)
    console.groupEnd()
  }
}

// Create and export singleton instance
export const networkMonitor = new NetworkMonitor()

// Export types for external use
export type { NetworkRequestLog, NetworkMetrics }

// Helper function to monitor specific API calls
export function monitorApiCall(url: string, callback: (log: NetworkRequestLog) => void) {
  const listener = (log: NetworkRequestLog) => {
    if (log.url.includes(url)) {
      callback(log)
    }
  }
  
  networkMonitor.addListener(listener)
  
  return () => networkMonitor.removeListener(listener)
}

// Helper function to log current browser state
export function logBrowserState() {
  if (typeof window === 'undefined') return
  
  console.group('🌐 BROWSER STATE')
  console.log('🌐 URL:', window.location.href)
  console.log('🌐 Cookies:', document.cookie)
  console.log('🌐 Local Storage keys:', Object.keys(localStorage))
  console.log('🌐 Session Storage keys:', Object.keys(sessionStorage))
  console.log('🌐 User Agent:', navigator.userAgent)
  console.log('🌐 Timestamp:', new Date().toISOString())
  console.groupEnd()
}

// Debug function for testing network monitor
export function testNetworkMonitor() {
  console.log('🧪 Testing network monitor...')
  
  // Test with a simple API call
  fetch('/api/user/role', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    console.log('🧪 Test request completed')
    networkMonitor.printSummary()
  }).catch(error => {
    console.log('🧪 Test request failed:', error)
    networkMonitor.printSummary()
  })
}