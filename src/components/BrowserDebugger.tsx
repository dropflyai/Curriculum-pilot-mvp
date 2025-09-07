'use client'

import { useState, useEffect } from 'react'

interface DebugEvent {
  timestamp: Date
  type: 'cookie' | 'navigation' | 'fetch' | 'storage' | 'auth'
  message: string
  data?: any
}

interface AuthState {
  role?: string
  authenticated: boolean
  cookies: string
  lastChecked: Date
}

export default function BrowserDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<DebugEvent[]>([])
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    cookies: '',
    lastChecked: new Date()
  })
  const [isMinimized, setIsMinimized] = useState(false)

  const addEvent = (type: DebugEvent['type'], message: string, data?: any) => {
    const event: DebugEvent = {
      timestamp: new Date(),
      type,
      message,
      data
    }
    setEvents(prev => [event, ...prev.slice(0, 99)]) // Keep last 100 events
    console.log(`🔍 DEBUG [${type.toUpperCase()}]:`, message, data || '')
  }

  // Monitor authentication state
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const response = await fetch('/api/user/role', { 
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        const data = await response.json()
        
        const newAuthState: AuthState = {
          role: data.role,
          authenticated: !!data.role,
          cookies: document.cookie,
          lastChecked: new Date()
        }
        
        setAuthState(prev => {
          if (prev.role !== newAuthState.role || prev.authenticated !== newAuthState.authenticated) {
            addEvent('auth', `Auth state changed: ${prev.role || 'none'} → ${newAuthState.role || 'none'}`, newAuthState)
          }
          return newAuthState
        })
      } catch (error) {
        addEvent('auth', 'Auth check failed', error)
      }
    }

    // Initial check
    checkAuthState()
    
    // Check auth every 2 seconds
    const authInterval = setInterval(checkAuthState, 2000)
    
    return () => clearInterval(authInterval)
  }, [])

  // Monitor global events
  useEffect(() => {
    // Cookie monitoring
    let lastCookies = document.cookie
    const cookieWatcher = setInterval(() => {
      if (document.cookie !== lastCookies) {
        addEvent('cookie', 'Cookie changed', {
          from: lastCookies,
          to: document.cookie
        })
        lastCookies = document.cookie
      }
    }, 100)

    // URL monitoring
    let lastUrl = window.location.href
    const urlWatcher = setInterval(() => {
      if (window.location.href !== lastUrl) {
        addEvent('navigation', 'URL changed', {
          from: lastUrl,
          to: window.location.href
        })
        lastUrl = window.location.href
      }
    }, 50)

    // Storage monitoring
    const originalSetItem = Storage.prototype.setItem
    const originalRemoveItem = Storage.prototype.removeItem
    const originalClear = Storage.prototype.clear

    Storage.prototype.setItem = function(key, value) {
      addEvent('storage', `${this === localStorage ? 'localStorage' : 'sessionStorage'} set: ${key}`, value)
      return originalSetItem.call(this, key, value)
    }

    Storage.prototype.removeItem = function(key) {
      addEvent('storage', `${this === localStorage ? 'localStorage' : 'sessionStorage'} removed: ${key}`)
      return originalRemoveItem.call(this, key)
    }

    Storage.prototype.clear = function() {
      addEvent('storage', `${this === localStorage ? 'localStorage' : 'sessionStorage'} cleared`)
      return originalClear.call(this)
    }

    // Fetch monitoring (enhanced)
    const originalFetch = window.fetch
    window.fetch = function(...args) {
      const url = args[0]
      const options = args[1]
      
      addEvent('fetch', 'Request started', {
        url,
        method: options?.method || 'GET',
        headers: options?.headers,
        body: options?.body
      })

      return originalFetch.apply(this, args).then(response => {
        addEvent('fetch', 'Response received', {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        })
        return response
      }).catch(error => {
        addEvent('fetch', 'Request failed', {
          url,
          error: error.message
        })
        throw error
      })
    }

    // Cleanup
    return () => {
      clearInterval(cookieWatcher)
      clearInterval(urlWatcher)
      Storage.prototype.setItem = originalSetItem
      Storage.prototype.removeItem = originalRemoveItem
      Storage.prototype.clear = originalClear
      window.fetch = originalFetch
    }
  }, [])

  // Keyboard shortcut to toggle debugger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsVisible(prev => !prev)
        addEvent('navigation', 'Debug panel toggled', { visible: !isVisible })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  const clearEvents = () => {
    setEvents([])
    addEvent('navigation', 'Debug events cleared')
  }

  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `debug-events-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    addEvent('navigation', 'Debug events exported')
  }

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-[9999]">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg shadow-lg font-mono text-sm"
          title="Open Debug Panel (Ctrl+Shift+D)"
        >
          🔍 Debug
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/95 backdrop-blur-lg border border-purple-500/50 rounded-lg shadow-2xl font-mono text-xs max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-purple-500/30">
        <div className="flex items-center space-x-2">
          <span className="text-purple-400">🔍</span>
          <span className="text-white font-semibold">Browser Debugger</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            {isMinimized ? '📈' : '📉'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Auth State */}
          <div className="p-3 border-b border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400">Auth State</span>
              <span className={`px-2 py-1 rounded text-xs ${
                authState.authenticated 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {authState.authenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            <div className="text-gray-300 space-y-1">
              <div>Role: <span className="text-cyan-400">{authState.role || 'none'}</span></div>
              <div>Cookies: <span className="text-yellow-400 break-all">
                {authState.cookies || 'none'}
              </span></div>
              <div>Last Check: <span className="text-gray-400">
                {authState.lastChecked.toLocaleTimeString()}
              </span></div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-3 border-b border-purple-500/30">
            <div className="flex space-x-2">
              <button
                onClick={clearEvents}
                className="bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/30"
              >
                Clear
              </button>
              <button
                onClick={exportEvents}
                className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/30"
              >
                Export
              </button>
              <span className="text-gray-400 px-2 py-1">
                {events.length} events
              </span>
            </div>
          </div>

          {/* Events List */}
          <div className="h-64 overflow-y-auto p-3">
            {events.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No events yet...
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="border-l-2 border-gray-600 pl-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        event.type === 'auth' ? 'bg-green-500/20 text-green-400' :
                        event.type === 'cookie' ? 'bg-yellow-500/20 text-yellow-400' :
                        event.type === 'navigation' ? 'bg-blue-500/20 text-blue-400' :
                        event.type === 'fetch' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {event.type.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-white mt-1">{event.message}</div>
                    {event.data && (
                      <div className="text-gray-400 mt-1 text-xs break-all">
                        {typeof event.data === 'string' 
                          ? event.data 
                          : JSON.stringify(event.data, null, 1).substring(0, 100) + '...'
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-purple-500/30 text-center text-gray-500">
            Press Ctrl+Shift+D to toggle
          </div>
        </>
      )}
    </div>
  )
}