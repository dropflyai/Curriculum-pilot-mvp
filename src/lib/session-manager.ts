// Session Manager - Advanced OAuth Session Management
// Handles token refresh, session persistence, and multi-tab synchronization

import { claudeOAuth, type OAuthError, isOAuthError } from './claude-oauth-client'

interface SessionState {
  isAuthenticated: boolean
  userInfo?: any
  tokenExpiry?: Date
  lastActivity: Date
  sessionId: string
}

interface SessionEvent {
  type: 'login' | 'logout' | 'token_refresh' | 'session_expired' | 'activity'
  timestamp: Date
  sessionId: string
  data?: any
}

type SessionEventListener = (event: SessionEvent) => void

export class SessionManager {
  private sessionState: SessionState | null = null
  private refreshTimer: NodeJS.Timeout | null = null
  private activityTimer: NodeJS.Timeout | null = null
  private eventListeners: Set<SessionEventListener> = new Set()
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private readonly REFRESH_BUFFER = 5 * 60 * 1000 // 5 minutes before expiry
  private readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000 // 1 minute
  private readonly STORAGE_KEY = 'claude_session_state'

  constructor() {
    this.initializeSession()
    this.setupActivityTracking()
    this.setupStorageListener()
  }

  // Initialize session from stored state
  private async initializeSession(): Promise<void> {
    try {
      // Load session state from storage
      const storedState = this.loadSessionState()
      
      if (storedState) {
        this.sessionState = storedState
        
        // Check if session is still valid
        if (await this.validateSession()) {
          this.scheduleTokenRefresh()
          this.emitEvent('activity', { restored: true })
        } else {
          await this.clearSession()
        }
      }
    } catch (error) {
      console.warn('Failed to initialize session:', error)
      await this.clearSession()
    }
  }

  // Validate current session
  private async validateSession(): Promise<boolean> {
    if (!this.sessionState) return false

    try {
      // Check if tokens are expired
      if (this.sessionState.tokenExpiry && new Date() > this.sessionState.tokenExpiry) {
        return false
      }

      // Check if session is too old
      const sessionAge = Date.now() - this.sessionState.lastActivity.getTime()
      if (sessionAge > this.SESSION_TIMEOUT) {
        return false
      }

      // Validate with OAuth client
      const isAuthenticated = await claudeOAuth.isAuthenticated()
      if (!isAuthenticated) {
        return false
      }

      return true
    } catch (error) {
      console.warn('Session validation failed:', error)
      return false
    }
  }

  // Start new session after successful authentication
  async startSession(userInfo?: any): Promise<void> {
    const sessionId = this.generateSessionId()
    
    this.sessionState = {
      isAuthenticated: true,
      userInfo,
      lastActivity: new Date(),
      sessionId
    }

    // Calculate token expiry if available
    await this.updateTokenExpiry()
    
    this.saveSessionState()
    this.scheduleTokenRefresh()
    this.emitEvent('login', { userInfo })
  }

  // End current session
  async endSession(): Promise<void> {
    if (this.sessionState) {
      const sessionId = this.sessionState.sessionId
      await this.clearSession()
      this.emitEvent('logout', { sessionId })
    }
  }

  // Clear session data
  private async clearSession(): Promise<void> {
    this.sessionState = null
    this.clearRefreshTimer()
    this.clearSessionStorage()
    
    try {
      await claudeOAuth.logout()
    } catch (error) {
      console.warn('Failed to logout from OAuth client:', error)
    }
  }

  // Update token expiry information
  private async updateTokenExpiry(): Promise<void> {
    if (!this.sessionState) return

    try {
      // Get current tokens (this would need to be exposed by the OAuth client)
      // For now, we'll estimate based on typical token lifetime
      const estimatedExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      this.sessionState.tokenExpiry = estimatedExpiry
    } catch (error) {
      console.warn('Failed to update token expiry:', error)
    }
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(): void {\n    this.clearRefreshTimer()\n    \n    if (!this.sessionState?.tokenExpiry) return\n\n    const timeUntilRefresh = this.sessionState.tokenExpiry.getTime() - Date.now() - this.REFRESH_BUFFER\n    \n    if (timeUntilRefresh > 0) {\n      this.refreshTimer = setTimeout(async () => {\n        await this.refreshTokens()\n      }, timeUntilRefresh)\n    }\n  }\n\n  // Refresh tokens automatically\n  private async refreshTokens(): Promise<void> {\n    if (!this.sessionState) return\n\n    try {\n      // Attempt to refresh tokens\n      await claudeOAuth.refreshTokens()\n      \n      // Update session state\n      await this.updateTokenExpiry()\n      this.updateActivity()\n      this.scheduleTokenRefresh()\n      \n      this.emitEvent('token_refresh', { success: true })\n    } catch (error) {\n      console.error('Token refresh failed:', error)\n      \n      if (isOAuthError(error) && !error.recoverable) {\n        // Non-recoverable error - end session\n        await this.endSession()\n        this.emitEvent('session_expired', { reason: 'token_refresh_failed' })\n      } else {\n        // Recoverable error - try again later\n        setTimeout(() => this.refreshTokens(), 60000) // Try again in 1 minute\n        this.emitEvent('token_refresh', { success: false, error: error.message })\n      }\n    }\n  }\n\n  // Update activity timestamp\n  updateActivity(): void {\n    if (this.sessionState) {\n      this.sessionState.lastActivity = new Date()\n      this.saveSessionState()\n      this.emitEvent('activity', {})\n    }\n  }\n\n  // Setup activity tracking\n  private setupActivityTracking(): void {\n    // Track user interactions\n    if (typeof window !== 'undefined') {\n      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']\n      const throttledUpdate = this.throttle(() => this.updateActivity(), 5000) // Max once per 5 seconds\n      \n      events.forEach(event => {\n        window.addEventListener(event, throttledUpdate, { passive: true })\n      })\n\n      // Periodic session validation\n      this.activityTimer = setInterval(async () => {\n        if (this.sessionState && !(await this.validateSession())) {\n          await this.endSession()\n          this.emitEvent('session_expired', { reason: 'inactivity' })\n        }\n      }, this.ACTIVITY_CHECK_INTERVAL)\n    }\n  }\n\n  // Setup cross-tab synchronization\n  private setupStorageListener(): void {\n    if (typeof window !== 'undefined') {\n      window.addEventListener('storage', (event) => {\n        if (event.key === this.STORAGE_KEY) {\n          // Session state changed in another tab\n          const newState = event.newValue ? JSON.parse(event.newValue) : null\n          \n          if (!newState && this.sessionState) {\n            // Session ended in another tab\n            this.clearSession()\n            this.emitEvent('logout', { reason: 'cross_tab_logout' })\n          } else if (newState && !this.sessionState) {\n            // Session started in another tab\n            this.sessionState = {\n              ...newState,\n              lastActivity: new Date(newState.lastActivity),\n              tokenExpiry: newState.tokenExpiry ? new Date(newState.tokenExpiry) : undefined\n            }\n            this.scheduleTokenRefresh()\n            this.emitEvent('login', { reason: 'cross_tab_login', userInfo: newState.userInfo })\n          }\n        }\n      })\n    }\n  }\n\n  // Session state persistence\n  private saveSessionState(): void {\n    if (typeof window === 'undefined' || !this.sessionState) return\n\n    try {\n      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessionState))\n    } catch (error) {\n      console.warn('Failed to save session state:', error)\n    }\n  }\n\n  private loadSessionState(): SessionState | null {\n    if (typeof window === 'undefined') return null\n\n    try {\n      const stored = localStorage.getItem(this.STORAGE_KEY)\n      if (stored) {\n        const parsed = JSON.parse(stored)\n        return {\n          ...parsed,\n          lastActivity: new Date(parsed.lastActivity),\n          tokenExpiry: parsed.tokenExpiry ? new Date(parsed.tokenExpiry) : undefined\n        }\n      }\n    } catch (error) {\n      console.warn('Failed to load session state:', error)\n    }\n    \n    return null\n  }\n\n  private clearSessionStorage(): void {\n    if (typeof window !== 'undefined') {\n      try {\n        localStorage.removeItem(this.STORAGE_KEY)\n      } catch (error) {\n        console.warn('Failed to clear session storage:', error)\n      }\n    }\n  }\n\n  // Event system\n  addEventListener(listener: SessionEventListener): void {\n    this.eventListeners.add(listener)\n  }\n\n  removeEventListener(listener: SessionEventListener): void {\n    this.eventListeners.delete(listener)\n  }\n\n  private emitEvent(type: SessionEvent['type'], data?: any): void {\n    const event: SessionEvent = {\n      type,\n      timestamp: new Date(),\n      sessionId: this.sessionState?.sessionId || 'unknown',\n      data\n    }\n\n    this.eventListeners.forEach(listener => {\n      try {\n        listener(event)\n      } catch (error) {\n        console.error('Session event listener error:', error)\n      }\n    })\n  }\n\n  // Utility methods\n  private generateSessionId(): string {\n    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`\n  }\n\n  private clearRefreshTimer(): void {\n    if (this.refreshTimer) {\n      clearTimeout(this.refreshTimer)\n      this.refreshTimer = null\n    }\n  }\n\n  private throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {\n    let inThrottle: boolean\n    return ((...args: any[]) => {\n      if (!inThrottle) {\n        func.apply(this, args)\n        inThrottle = true\n        setTimeout(() => inThrottle = false, limit)\n      }\n    }) as T\n  }\n\n  // Public API\n  get isAuthenticated(): boolean {\n    return this.sessionState?.isAuthenticated || false\n  }\n\n  get userInfo(): any {\n    return this.sessionState?.userInfo\n  }\n\n  get sessionId(): string | null {\n    return this.sessionState?.sessionId || null\n  }\n\n  get lastActivity(): Date | null {\n    return this.sessionState?.lastActivity || null\n  }\n\n  get timeUntilExpiry(): number | null {\n    if (!this.sessionState?.tokenExpiry) return null\n    return Math.max(0, this.sessionState.tokenExpiry.getTime() - Date.now())\n  }\n\n  // Force token refresh\n  async forceRefresh(): Promise<void> {\n    await this.refreshTokens()\n  }\n\n  // Get session health status\n  getSessionHealth(): {\n    isHealthy: boolean\n    issues: string[]\n    timeUntilExpiry: number | null\n    lastActivity: Date | null\n  } {\n    const issues: string[] = []\n    \n    if (!this.sessionState) {\n      issues.push('No active session')\n    } else {\n      const timeSinceActivity = Date.now() - this.sessionState.lastActivity.getTime()\n      if (timeSinceActivity > this.SESSION_TIMEOUT * 0.8) {\n        issues.push('Session approaching timeout due to inactivity')\n      }\n      \n      if (this.sessionState.tokenExpiry) {\n        const timeUntilExpiry = this.sessionState.tokenExpiry.getTime() - Date.now()\n        if (timeUntilExpiry < this.REFRESH_BUFFER) {\n          issues.push('Token refresh needed soon')\n        }\n      }\n    }\n    \n    return {\n      isHealthy: issues.length === 0,\n      issues,\n      timeUntilExpiry: this.timeUntilExpiry,\n      lastActivity: this.lastActivity\n    }\n  }\n\n  // Cleanup when component unmounts\n  destroy(): void {\n    this.clearRefreshTimer()\n    \n    if (this.activityTimer) {\n      clearInterval(this.activityTimer)\n      this.activityTimer = null\n    }\n    \n    this.eventListeners.clear()\n  }\n}\n\n// Export singleton instance\nexport const sessionManager = new SessionManager()\n\n// React hook for session management\nexport function useSession() {\n  if (typeof window === 'undefined') {\n    return {\n      isAuthenticated: false,\n      userInfo: null,\n      sessionHealth: { isHealthy: false, issues: ['SSR mode'], timeUntilExpiry: null, lastActivity: null },\n      startSession: async () => {},\n      endSession: async () => {},\n      forceRefresh: async () => {}\n    }\n  }\n\n  return {\n    isAuthenticated: sessionManager.isAuthenticated,\n    userInfo: sessionManager.userInfo,\n    sessionHealth: sessionManager.getSessionHealth(),\n    startSession: sessionManager.startSession.bind(sessionManager),\n    endSession: sessionManager.endSession.bind(sessionManager),\n    forceRefresh: sessionManager.forceRefresh.bind(sessionManager)\n  }\n}