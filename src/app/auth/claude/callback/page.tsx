'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { claudeMCP } from '../../../../lib/claude-mcp-integration'
import { Bot } from 'lucide-react'
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'

export default function ClaudeOAuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Processing Claude authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter')
        }

        // Handle OAuth callback via MCP integration
        const success = await claudeMCP.handleOAuthCallback(code, state)
        
        if (success) {
          // Get user info to verify authentication
          const authStatus = await claudeMCP.getAuthStatus()
          
          setStatus('success')
          setMessage(`Successfully connected Claude ${authStatus.userInfo?.plan || 'subscription'}!`)
        } else {
          throw new Error('Authentication failed')
        }
        
        // Redirect back to IDE after 2 seconds
        setTimeout(() => {
          router.push('/ide-demo?auth=success')
        }, 2000)
        
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Authentication failed')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-green-500/30 rounded-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-green-300 mb-2">Claude Authentication</h1>
          <p className="text-green-300/70 text-sm">Agent Academy • CodeFly Platform</p>
        </div>

        <div className="mb-6">
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-green-400 animate-spin" />
              <p className="text-green-300">{message}</p>
              <p className="text-green-300/70 text-sm">Connecting your Claude subscription to Agent Academy</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <p className="text-green-300">{message}</p>
              <p className="text-green-300/70 text-sm">🎯 Ready for AI-powered coding missions!</p>
              <p className="text-green-500/50 text-xs">Redirecting to IDE...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-8 w-8 text-red-400" />
              <p className="text-red-300">{message}</p>
              <p className="text-green-300/70 text-sm">Don't worry, Agent. You can try connecting again.</p>
              <button
                onClick={() => router.push('/ide-demo')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to IDE</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-green-500/30">
          <p className="text-xs text-green-500/50">
            Secure OAuth 2.0 + PKCE authentication with Anthropic
          </p>
        </div>
      </div>
    </div>
  )
}