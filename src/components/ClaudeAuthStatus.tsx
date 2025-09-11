'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Loader2, 
  LogOut, 
  User, 
  Crown,
  Zap,
  AlertCircle
} from 'lucide-react'
import { claudeCurriculum } from '@/lib/claude-curriculum-integration'

interface AuthStatus {
  isAuthenticated: boolean
  userInfo?: {
    id: string
    email: string
    name: string
    plan: 'free' | 'pro' | 'max'
    usageLimit: number
    usageRemaining: number
    resetTime: Date
  }
  message: string
}

interface ClaudeAuthStatusProps {
  onAuthStateChange?: (isAuthenticated: boolean) => void
  className?: string
  compact?: boolean
}

export default function ClaudeAuthStatus({ 
  onAuthStateChange, 
  className = '', 
  compact = false 
}: ClaudeAuthStatusProps) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    message: 'Checking authentication...'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check authentication status on mount and periodically
  useEffect(() => {
    checkAuthStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkAuthStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkAuthStatus = async () => {
    try {
      const status = await claudeCurriculum.getAuthenticationStatus()
      setAuthStatus(status)
      setIsLoading(false)
      onAuthStateChange?.(status.isAuthenticated)
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setAuthStatus({
        isAuthenticated: false,
        message: 'Error checking authentication'
      })
      setIsLoading(false)
      onAuthStateChange?.(false)
    }
  }

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const authUrl = await claudeCurriculum.startAuthentication()
      
      // Open OAuth flow in same window
      window.location.href = authUrl
      
    } catch (error) {
      console.error('Failed to start authentication:', error)
      setIsConnecting(false)
      setAuthStatus({
        isAuthenticated: false,
        message: 'Failed to start authentication'
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await claudeCurriculum.logout()
      setAuthStatus({
        isAuthenticated: false,
        message: 'Disconnected from Claude'
      })
      onAuthStateChange?.(false)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'max': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'pro': return <Zap className="h-4 w-4 text-blue-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'max': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'pro': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {isLoading || isConnecting ? (
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
        ) : authStatus.isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Connected</span>
            </div>
            {authStatus.userInfo && (
              <div className="flex items-center space-x-1">
                {getPlanIcon(authStatus.userInfo.plan)}
                <span className="text-xs text-gray-600 capitalize">
                  {authStatus.userInfo.plan}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <ShieldX className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 font-medium">Disconnected</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Claude Authentication
          </h3>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          {isLoading || isConnecting ? (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          ) : authStatus.isAuthenticated ? (
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-red-500 rounded-full" />
              <span className="text-xs text-red-600 font-medium">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Content */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking authentication status...</span>
          </div>
        ) : authStatus.isAuthenticated && authStatus.userInfo ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Authentication Active
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {authStatus.userInfo.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getPlanColor(authStatus.userInfo.plan)}`}>
                    {getPlanIcon(authStatus.userInfo.plan)}
                    <span className="capitalize font-medium">
                      {authStatus.userInfo.plan}
                    </span>
                  </div>
                </div>
                
                {authStatus.userInfo.plan !== 'max' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {authStatus.userInfo.usageRemaining} / {authStatus.userInfo.usageLimit}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect Claude</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Not Connected */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Authentication Required
                </span>
              </div>
              
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                Connect your Claude subscription to unlock advanced AI assistance with unlimited usage.
              </p>
              
              <div className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
                <div>✓ Personal Claude subscription (Pro/Max)</div>
                <div>✓ Unlimited AI assistance</div>
                <div>✓ Advanced curriculum integration</div>
                <div>✓ No usage limits</div>
              </div>
            </div>
            
            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              <span>
                {isConnecting ? 'Connecting...' : 'Connect Claude'}
              </span>
            </button>
          </div>
        )}
        
        {/* Status Message */}
        {authStatus.message && !isLoading && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            {authStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}