'use client'

import { useState, useEffect } from 'react'
import { networkMonitor, NetworkRequestLog, NetworkMetrics } from '@/lib/network-monitor'

interface NetworkDebuggerProps {
  isVisible?: boolean
  focusUrl?: string
}

export default function NetworkDebugger({ isVisible = false, focusUrl = '/api/user/role' }: NetworkDebuggerProps) {
  const [logs, setLogs] = useState<NetworkRequestLog[]>([])
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [isOpen, setIsOpen] = useState(isVisible)
  const [filterUrl, setFilterUrl] = useState(focusUrl)

  useEffect(() => {
    // Update logs and metrics periodically
    const updateData = () => {
      const allLogs = networkMonitor.getLogs()
      const filteredLogs = filterUrl 
        ? allLogs.filter(log => log.url.includes(filterUrl))
        : allLogs
      setLogs(filteredLogs)
      setMetrics(networkMonitor.getMetrics())
    }

    updateData()
    const interval = setInterval(updateData, 1000)

    // Listen for new network requests
    const listener = (log: NetworkRequestLog) => {
      if (!filterUrl || log.url.includes(filterUrl)) {
        updateData()
      }
    }

    networkMonitor.addListener(listener)

    return () => {
      clearInterval(interval)
      networkMonitor.removeListener(listener)
    }
  }, [filterUrl])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
      >
        🌐 Network Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 border border-gray-600 rounded-lg shadow-xl max-w-md w-80 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between">
        <span className="font-medium text-sm">🌐 Network Monitor</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 text-lg"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-3 text-xs text-gray-100">
        {/* Controls */}
        <div className="mb-3">
          <input
            type="text"
            value={filterUrl}
            onChange={(e) => setFilterUrl(e.target.value)}
            placeholder="Filter by URL..."
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => networkMonitor.clearLogs()}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
            >
              Clear
            </button>
            <button
              onClick={() => console.log('Network Logs:', networkMonitor.exportLogs())}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              Export
            </button>
          </div>
        </div>

        {/* Metrics */}
        {metrics && (
          <div className="bg-gray-800 rounded p-2 mb-3">
            <div className="font-medium mb-1">Metrics:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>Total: {metrics.totalRequests}</div>
              <div>Success: {metrics.successfulRequests}</div>
              <div>Failed: {metrics.failedRequests}</div>
              <div>Avg: {metrics.averageResponseTime.toFixed(0)}ms</div>
            </div>
            {metrics.corsErrors > 0 && (
              <div className="text-red-400 mt-1">CORS Errors: {metrics.corsErrors}</div>
            )}
            {metrics.cookieIssues > 0 && (
              <div className="text-yellow-400 mt-1">Cookie Issues: {metrics.cookieIssues}</div>
            )}
          </div>
        )}

        {/* Request Logs */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-2">No matching requests</div>
          ) : (
            logs.slice(-10).reverse().map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded text-xs ${
                  log.error
                    ? 'bg-red-900/50 border-l-2 border-red-500'
                    : log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300
                    ? 'bg-green-900/50 border-l-2 border-green-500'
                    : 'bg-yellow-900/50 border-l-2 border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {log.method} {log.url.split('/').pop()}
                  </span>
                  <span className="text-gray-400">
                    {log.responseStatus || 'ERR'}
                  </span>
                </div>
                
                <div className="text-gray-300">
                  Time: {log.timing.duration?.toFixed(0) || '?'}ms
                </div>
                
                {log.url.includes('/api/user/role') && (
                  <div className="mt-1 text-cyan-300">
                    🎯 Auth endpoint
                    {log.cookiesBefore !== log.cookiesAfter && (
                      <span className="ml-2 text-yellow-300">🍪 Cookie changed</span>
                    )}
                  </div>
                )}
                
                {log.error && (
                  <div className="text-red-300 mt-1">
                    Error: {log.error}
                  </div>
                )}

                {/* Expandable details */}
                <details className="mt-1">
                  <summary className="cursor-pointer text-gray-400">Details</summary>
                  <div className="mt-1 pl-2 border-l border-gray-600">
                    <div>URL: {log.url}</div>
                    <div>Headers: {Object.keys(log.requestHeaders).join(', ')}</div>
                    {log.responseHeaders && (
                      <div>Response Headers: {Object.keys(log.responseHeaders).join(', ')}</div>
                    )}
                    {log.requestBody && (
                      <div>Body: {typeof log.requestBody === 'object' ? JSON.stringify(log.requestBody) : log.requestBody}</div>
                    )}
                  </div>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component for quick /api/user/role monitoring
export function ApiRoleMonitor() {
  return <NetworkDebugger isVisible={false} focusUrl="/api/user/role" />
}