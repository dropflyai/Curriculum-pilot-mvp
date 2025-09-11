// Claude OAuth Client - Subscription Authentication
// Implements OAuth 2.0 + PKCE flow using Anthropic's official endpoints

interface ClaudeOAuthConfig {
  clientId: string
  redirectUri: string
  scope: string
  authEndpoint: string
  tokenEndpoint: string
  userInfoEndpoint: string
}

interface PKCEChallenge {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: string
}

interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
  scope: string
}

interface OAuthError {
  error: string
  errorDescription?: string
  errorUri?: string
  userMessage: string
  recoverable: boolean
  retryAfter?: number
}

type OAuthErrorType = 
  | 'invalid_request'
  | 'unauthorized_client'
  | 'access_denied'
  | 'unsupported_response_type'
  | 'invalid_scope'
  | 'server_error'
  | 'temporarily_unavailable'
  | 'network_error'
  | 'token_expired'
  | 'invalid_token'
  | 'rate_limit_exceeded'

interface ClaudeUserInfo {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'max'
  usageLimit: number
  usageRemaining: number
  resetTime: Date
}

export class ClaudeOAuthClient {
  private config: ClaudeOAuthConfig
  private currentTokens: OAuthTokens | null = null
  private userInfo: ClaudeUserInfo | null = null
  private retryCount: number = 0
  private maxRetries: number = 3
  private baseRetryDelay: number = 1000

  constructor() {
    this.config = {
      // Anthropic's official OAuth client ID (from research)
      clientId: '9d1c250a-e61b-44d9-88ed-5944d1962f5e',
      redirectUri: typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/claude/callback`
        : 'http://localhost:3000/auth/claude/callback',
      scope: 'read write',
      authEndpoint: 'https://console.anthropic.com/oauth/authorize',
      tokenEndpoint: 'https://console.anthropic.com/oauth/token',
      userInfoEndpoint: 'https://console.anthropic.com/api/v1/user/me'
    }
  }

  // Generate PKCE challenge for OAuth flow
  private async generatePKCEChallenge(): Promise<PKCEChallenge> {
    // Generate code verifier (43-128 characters)
    const codeVerifier = this.generateRandomString(128)
    
    // Create code challenge using SHA256
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    
    // Base64 URL encode the challenge
    const codeChallenge = this.base64URLEncode(digest)
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256'
    }
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    let result = ''
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)
    
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length]
    }
    
    return result
  }

  private base64URLEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  // Start OAuth flow
  async startOAuthFlow(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('OAuth flow can only be started in browser environment')
    }

    const pkce = await this.generatePKCEChallenge()
    const state = this.generateRandomString(32)

    // Store PKCE values for later verification
    localStorage.setItem('claude_oauth_code_verifier', pkce.codeVerifier)
    localStorage.setItem('claude_oauth_state', state)

    // Build authorization URL
    const authUrl = new URL(this.config.authEndpoint)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', this.config.clientId)
    authUrl.searchParams.set('redirect_uri', this.config.redirectUri)
    authUrl.searchParams.set('scope', this.config.scope)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('code_challenge', pkce.codeChallenge)
    authUrl.searchParams.set('code_challenge_method', pkce.codeChallengeMethod)

    return authUrl.toString()
  }

  // Handle OAuth callback with enhanced error handling
  async handleOAuthCallback(code: string, state: string): Promise<OAuthTokens> {
    if (typeof window === 'undefined') {
      throw this.createOAuthError('invalid_request', 'OAuth callback can only be handled in browser environment', false)
    }

    try {
      // Verify state parameter
      const storedState = localStorage.getItem('claude_oauth_state')
      if (state !== storedState) {
        throw this.createOAuthError('invalid_request', 'Invalid state parameter - possible CSRF attack', false)
      }

      // Get stored code verifier
      const codeVerifier = localStorage.getItem('claude_oauth_code_verifier')
      if (!codeVerifier) {
        throw this.createOAuthError('invalid_request', 'Code verifier not found - OAuth flow was not properly initiated', false)
      }

      // Validate code parameter
      if (!code || typeof code !== 'string' || code.length < 10) {
        throw this.createOAuthError('invalid_request', 'Invalid authorization code received', false)
      }

      // Exchange code for tokens with retry logic
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier)
      
      // Store tokens securely
      this.currentTokens = tokens
      this.storeTokens(tokens)
      
      // Clean up temporary storage
      this.cleanupOAuthStorage()
      
      // Reset retry count on success
      this.retryCount = 0

      return tokens
    } catch (error) {
      // Clean up on any error
      this.cleanupOAuthStorage()
      
      if (error instanceof Error && 'error' in error) {
        throw error // Re-throw OAuth errors
      }
      
      throw this.createOAuthError('server_error', `Token exchange failed: ${error}`, true)
    }
  }

  // Exchange authorization code for tokens with retry logic
  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<OAuthTokens> {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const tokenResponse = await fetch(this.config.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.config.clientId,
            code: code,
            redirect_uri: this.config.redirectUri,
            code_verifier: codeVerifier
          })
        })

        if (tokenResponse.ok) {
          const tokens: OAuthTokens = await tokenResponse.json()
          
          // Validate token response
          if (!tokens.accessToken || !tokens.tokenType) {
            throw this.createOAuthError('server_error', 'Invalid token response from server', true)
          }
          
          return tokens
        }

        // Handle specific HTTP errors
        const errorData = await this.parseErrorResponse(tokenResponse)
        
        if (tokenResponse.status === 429) {
          // Rate limit - wait and retry
          const retryAfter = parseInt(tokenResponse.headers.get('Retry-After') || '60')
          if (attempt < maxRetries - 1) {
            await this.delay(retryAfter * 1000)
            continue
          }
          throw this.createOAuthError('rate_limit_exceeded', 'Rate limit exceeded', true, retryAfter)
        }
        
        if (tokenResponse.status >= 500 && attempt < maxRetries - 1) {
          // Server error - retry with exponential backoff
          await this.delay(Math.pow(2, attempt) * this.baseRetryDelay)
          continue
        }
        
        // Non-retryable error
        throw this.createOAuthError(
          this.mapHttpStatusToErrorType(tokenResponse.status),
          errorData.userMessage || `Token exchange failed with status ${tokenResponse.status}`,
          tokenResponse.status >= 500
        )
      } catch (error) {
        lastError = error as Error
        
        if (error instanceof Error && 'error' in error) {
          throw error // Re-throw OAuth errors immediately
        }
        
        // Network error - retry if not last attempt
        if (attempt < maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * this.baseRetryDelay)
          continue
        }
      }
    }

    throw lastError || this.createOAuthError('network_error', 'Network error during token exchange', true)
  }

  // Store tokens securely
  private storeTokens(tokens: OAuthTokens): void {
    if (typeof window === 'undefined') return

    try {
      // Store in encrypted storage (localStorage for now, should use more secure storage)
      const tokenData = {
        ...tokens,
        timestamp: Date.now(),
        version: '1.0' // For future migration support
      }
      
      localStorage.setItem('claude_oauth_tokens', JSON.stringify(tokenData))
    } catch (error) {
      console.error('Failed to store OAuth tokens:', error)
      throw this.createOAuthError('server_error', 'Failed to store authentication tokens', true)
    }
  }

  // Retrieve stored tokens
  private retrieveTokens(): OAuthTokens | null {
    if (typeof window === 'undefined') return null

    try {
      const tokenData = localStorage.getItem('claude_oauth_tokens')
      if (!tokenData) return null

      const parsed = JSON.parse(tokenData)
      
      // Check if tokens are expired
      const expirationTime = parsed.timestamp + (parsed.expiresIn * 1000)
      if (Date.now() > expirationTime) {
        this.clearTokens()
        return null
      }

      return parsed
    } catch (error) {
      console.error('Error retrieving tokens:', error)
      return null
    }
  }

  // Clear stored tokens
  private clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('claude_oauth_tokens')
    this.currentTokens = null
    this.userInfo = null
  }

  // Get current authentication status
  async isAuthenticated(): Promise<boolean> {
    if (this.currentTokens) return true

    const storedTokens = this.retrieveTokens()
    if (storedTokens) {
      this.currentTokens = storedTokens
      return true
    }

    return false
  }

  // Get user information with enhanced error handling
  async getUserInfo(): Promise<ClaudeUserInfo> {
    if (!this.currentTokens) {
      throw this.createOAuthError('invalid_token', 'Not authenticated - please login first', false)
    }

    if (this.userInfo) {
      return this.userInfo
    }

    try {
      const response = await fetch(this.config.userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${this.currentTokens.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const userInfo: ClaudeUserInfo = await response.json()
        
        // Validate user info response
        if (!userInfo.id || !userInfo.email) {
          throw this.createOAuthError('server_error', 'Invalid user info response', true)
        }
        
        this.userInfo = userInfo
        return userInfo
      }

      if (response.status === 401) {
        // Token expired, clear authentication
        this.clearTokens()
        throw this.createOAuthError('token_expired', 'Authentication expired - please login again', false)
      }

      const errorData = await this.parseErrorResponse(response)
      throw this.createOAuthError(
        this.mapHttpStatusToErrorType(response.status),
        errorData.userMessage || 'Failed to get user information',
        response.status >= 500
      )
    } catch (error) {
      if (error instanceof Error && 'error' in error) {
        throw error // Re-throw OAuth errors
      }
      
      throw this.createOAuthError('network_error', 'Network error while getting user info', true)
    }
  }

  // Make authenticated API request to Claude with enhanced error handling
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.currentTokens) {
      throw this.createOAuthError('invalid_token', 'Not authenticated - please login first', false)
    }

    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const headers = {
          'Authorization': `Bearer ${this.currentTokens.accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Agent-Academy-IDE/1.0',
          ...options.headers
        }

        const response = await fetch(endpoint, {
          ...options,
          headers
        })

        if (response.ok) {
          return response
        }

        if (response.status === 401) {
          // Token expired or invalid
          this.clearTokens()
          throw this.createOAuthError('token_expired', 'Authentication expired - please login again', false)
        }

        if (response.status === 429) {
          // Rate limit
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
          if (attempt < maxRetries - 1) {
            await this.delay(retryAfter * 1000)
            continue
          }
          throw this.createOAuthError('rate_limit_exceeded', 'Rate limit exceeded - please try again later', true, retryAfter)
        }

        if (response.status >= 500 && attempt < maxRetries - 1) {
          // Server error - retry
          await this.delay(Math.pow(2, attempt) * this.baseRetryDelay)
          continue
        }

        // Non-retryable error
        const errorData = await this.parseErrorResponse(response)
        throw this.createOAuthError(
          this.mapHttpStatusToErrorType(response.status),
          errorData.userMessage || `API request failed with status ${response.status}`,
          response.status >= 500
        )
      } catch (error) {
        lastError = error as Error
        
        if (error instanceof Error && 'error' in error) {
          throw error // Re-throw OAuth errors immediately
        }
        
        // Network error - retry if not last attempt
        if (attempt < maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * this.baseRetryDelay)
          continue
        }
      }
    }

    throw lastError || this.createOAuthError('network_error', 'Network error during API request', true)
  }

  // Send message to Claude using subscription
  async sendMessage(message: string, context?: any): Promise<any> {
    const endpoint = 'https://console.anthropic.com/api/v1/chat/completions'
    
    const response = await this.apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229', // Default to Sonnet
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 4096,
        context: context
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Switch model (Sonnet/Opus for Max subscribers)
  async switchModel(model: 'sonnet' | 'opus'): Promise<void> {
    const userInfo = await this.getUserInfo()
    
    if (model === 'opus' && userInfo.plan !== 'max') {
      throw new Error('Opus model is only available for Max subscribers')
    }

    // Store model preference
    localStorage.setItem('claude_preferred_model', model)
  }

  // Get current model
  getPreferredModel(): 'sonnet' | 'opus' {
    if (typeof window === 'undefined') return 'sonnet'
    
    const stored = localStorage.getItem('claude_preferred_model')
    return (stored as 'sonnet' | 'opus') || 'sonnet'
  }

  // Logout
  async logout(): Promise<void> {
    this.clearTokens()
    
    // Optional: Revoke tokens on server
    try {
      if (this.currentTokens) {
        await fetch('https://console.anthropic.com/oauth/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: this.currentTokens.accessToken,
            client_id: this.config.clientId
          })
        })
      }
    } catch (error) {
      console.warn('Failed to revoke tokens:', error)
    }
  }

  // Initialize from stored tokens
  async initialize(): Promise<boolean> {
    const tokens = this.retrieveTokens()
    if (tokens) {
      this.currentTokens = tokens
      try {
        await this.getUserInfo()
        return true
      } catch (error) {
        console.warn('Failed to validate stored tokens:', error)
        this.clearTokens()
      }
    }
    return false
  }

  // Helper method to create standardized OAuth errors
  private createOAuthError(
    errorType: OAuthErrorType,
    userMessage: string,
    recoverable: boolean,
    retryAfter?: number
  ): OAuthError {
    const error = {
      error: errorType,
      userMessage,
      recoverable,
      retryAfter
    } as OAuthError
    
    // Add error to the Error object for proper handling
    const errorObj = new Error(userMessage) as Error & OAuthError
    Object.assign(errorObj, error)
    
    return errorObj
  }

  // Parse error response from API
  private async parseErrorResponse(response: Response): Promise<{ userMessage: string; details?: any }> {
    try {
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        return {
          userMessage: errorData.error_description || errorData.message || 'API request failed',
          details: errorData
        }
      } else {
        const errorText = await response.text()
        return {
          userMessage: errorText || 'API request failed',
          details: { status: response.status, statusText: response.statusText }
        }
      }
    } catch (error) {
      return {
        userMessage: 'Failed to parse error response',
        details: { status: response.status, statusText: response.statusText }
      }
    }
  }

  // Map HTTP status codes to OAuth error types
  private mapHttpStatusToErrorType(status: number): OAuthErrorType {
    switch (status) {
      case 400:
        return 'invalid_request'
      case 401:
        return 'unauthorized_client'
      case 403:
        return 'access_denied'
      case 404:
        return 'invalid_request'
      case 429:
        return 'rate_limit_exceeded'
      case 500:
      case 502:
      case 503:
        return 'server_error'
      case 504:
        return 'temporarily_unavailable'
      default:
        return 'server_error'
    }
  }

  // Clean up OAuth-related storage
  private cleanupOAuthStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem('claude_oauth_code_verifier')
      localStorage.removeItem('claude_oauth_state')
    } catch (error) {
      console.warn('Failed to cleanup OAuth storage:', error)
    }
  }

  // Delay utility for retry logic
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Token refresh logic (for future implementation)
  async refreshTokens(): Promise<OAuthTokens> {
    if (!this.currentTokens?.refreshToken) {
      throw this.createOAuthError('invalid_token', 'No refresh token available', false)
    }

    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.currentTokens.refreshToken,
          client_id: this.config.clientId
        })
      })

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response)
        
        if (response.status === 401) {
          // Refresh token expired
          this.clearTokens()
          throw this.createOAuthError('token_expired', 'Session expired - please login again', false)
        }
        
        throw this.createOAuthError(
          this.mapHttpStatusToErrorType(response.status),
          errorData.userMessage || 'Token refresh failed',
          response.status >= 500
        )
      }

      const newTokens: OAuthTokens = await response.json()
      
      // Validate new tokens
      if (!newTokens.accessToken) {
        throw this.createOAuthError('server_error', 'Invalid token refresh response', true)
      }
      
      // Update stored tokens
      this.currentTokens = newTokens
      this.storeTokens(newTokens)
      
      return newTokens
    } catch (error) {
      if (error instanceof Error && 'error' in error) {
        throw error // Re-throw OAuth errors
      }
      
      throw this.createOAuthError('network_error', 'Network error during token refresh', true)
    }
  }

  // Get detailed error information for debugging
  getLastError(): OAuthError | null {
    // This would be enhanced to track the last error
    return null
  }

  // Health check for OAuth endpoints
  async checkOAuthHealth(): Promise<{
    authEndpoint: boolean
    tokenEndpoint: boolean
    userInfoEndpoint: boolean
    overall: boolean
  }> {
    const results = {
      authEndpoint: false,
      tokenEndpoint: false,
      userInfoEndpoint: false,
      overall: false
    }

    try {
      // Check auth endpoint (should return 400 for missing parameters)
      const authResponse = await fetch(this.config.authEndpoint, { method: 'HEAD' })
      results.authEndpoint = authResponse.status === 400 || authResponse.status === 405
    } catch (error) {
      console.warn('Auth endpoint check failed:', error)
    }

    try {
      // Check token endpoint (should return 400 for missing parameters)
      const tokenResponse = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: ''
      })
      results.tokenEndpoint = tokenResponse.status === 400
    } catch (error) {
      console.warn('Token endpoint check failed:', error)
    }

    try {
      // Check user info endpoint (should return 401 for missing auth)
      const userInfoResponse = await fetch(this.config.userInfoEndpoint)
      results.userInfoEndpoint = userInfoResponse.status === 401
    } catch (error) {
      console.warn('User info endpoint check failed:', error)
    }

    results.overall = results.authEndpoint && results.tokenEndpoint && results.userInfoEndpoint
    return results
  }
}

// Export singleton instance
export const claudeOAuth = new ClaudeOAuthClient()

// Export error types for external use
export type { OAuthError, OAuthErrorType }

// Utility function to check if an error is an OAuth error
export function isOAuthError(error: any): error is OAuthError {
  return error && typeof error === 'object' && 'error' in error && 'userMessage' in error
}

// Utility function to get user-friendly error message
export function getOAuthErrorMessage(error: any): string {
  if (isOAuthError(error)) {
    return error.userMessage
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// Utility function to determine if error is recoverable
export function isRecoverableOAuthError(error: any): boolean {
  if (isOAuthError(error)) {
    return error.recoverable
  }
  
  return false
}