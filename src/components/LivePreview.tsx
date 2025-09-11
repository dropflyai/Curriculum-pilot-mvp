'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Monitor,
  Smartphone,
  Tablet,
  RotateCw,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Settings,
  Zap,
  Globe,
  Play,
  Square
} from 'lucide-react'

interface LivePreviewProps {
  htmlContent?: string
  cssContent?: string
  jsContent?: string
  pythonOutput?: string
  onRefresh?: () => void
  onOpenExternal?: () => void
  isVisible?: boolean
}

export default function LivePreview({
  htmlContent = '',
  cssContent = '',
  jsContent = '',
  pythonOutput = '',
  onRefresh,
  onOpenExternal,
  isVisible = true
}: LivePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(1000)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleMessages, setConsoleMessages] = useState<string[]>([])

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '812px' }
  }

  const generateHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f1419;
      color: #e6e6e6;
    }
    
    .python-output {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      white-space: pre-wrap;
      overflow-x: auto;
    }
    
    .output-success {
      color: #4ade80;
    }
    
    .output-error {
      color: #f87171;
    }
    
    .output-info {
      color: #60a5fa;
    }
    
    /* Custom styles */
    ${cssContent}
  </style>
</head>
<body>
  <!-- HTML Content -->
  ${htmlContent}
  
  <!-- Python Output Display -->
  ${pythonOutput && `
    <div class="python-output">
      <h4 style="margin-top: 0; color: #60a5fa;">Python Output:</h4>
      <div class="output-content ${pythonOutput.includes('❌') ? 'output-error' : 'output-success'}">
        ${pythonOutput.split('\n').map(line => `<div>${line}</div>`).join('')}
      </div>
    </div>
  `}
  
  <!-- JavaScript -->
  <script>
    // Console override to capture messages
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    window.capturedMessages = [];
    
    ['log', 'error', 'warn', 'info'].forEach(method => {
      console[method] = (...args) => {
        originalConsole[method](...args);
        window.capturedMessages.push({
          type: method,
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '),
          timestamp: new Date().toISOString()
        });
      };
    });
    
    try {
      ${jsContent}
    } catch (error) {
      console.error('JavaScript Error:', error.message);
    }
  </script>
</body>
</html>
    `.trim()
  }

  const refreshPreview = () => {
    if (!iframeRef.current) return
    
    setIsRefreshing(true)
    const html = generateHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    iframeRef.current.src = url
    
    // Clean up previous blob URL
    setTimeout(() => {
      URL.revokeObjectURL(url)
      setIsRefreshing(false)
    }, 100)
    
    onRefresh?.()
  }

  // Auto refresh when content changes
  useEffect(() => {
    if (autoRefresh) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        refreshPreview()
      }, refreshInterval)
    }
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [htmlContent, cssContent, jsContent, pythonOutput, autoRefresh, refreshInterval])

  // Handle iframe messages for console
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        setConsoleMessages(prev => [...prev, event.data.message])
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const openInNewTab = () => {
    const html = generateHTML()
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(html)
      newWindow.document.close()
    }
    onOpenExternal?.()
  }

  if (!isVisible) {
    return (
      <div className="h-full bg-slate-800 flex items-center justify-center border-l border-green-500/30">
        <div className="text-center">
          <EyeOff className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Preview Hidden</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full bg-slate-800 flex flex-col border-l border-green-500/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Preview Header */}
      <div className="bg-slate-700 px-3 py-2 border-b border-green-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-green-400" />
          <span className="text-green-300 text-sm font-medium">PREVIEW</span>
          {isRefreshing && (
            <RefreshCw className="h-3 w-3 text-green-400 animate-spin" />
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Device Selection */}
          <div className="flex items-center space-x-1 border border-green-500/30 rounded">
            <button
              onClick={() => setSelectedDevice('desktop')}
              className={`p-1 rounded-l ${selectedDevice === 'desktop' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Desktop View"
            >
              <Monitor className="h-3 w-3" />
            </button>
            <button
              onClick={() => setSelectedDevice('tablet')}
              className={`p-1 ${selectedDevice === 'tablet' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Tablet View"
            >
              <Tablet className="h-3 w-3" />
            </button>
            <button
              onClick={() => setSelectedDevice('mobile')}
              className={`p-1 rounded-r ${selectedDevice === 'mobile' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Mobile View"
            >
              <Smartphone className="h-3 w-3" />
            </button>
          </div>
          
          <button
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="p-1 hover:bg-slate-600 rounded disabled:opacity-50"
            title="Refresh Preview"
          >
            <RefreshCw className={`h-3 w-3 text-green-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1 hover:bg-slate-600 rounded ${showConsole ? 'bg-slate-600' : ''}`}
            title="Toggle Console"
          >
            <Eye className="h-3 w-3 text-green-400" />
          </button>
          
          <button
            onClick={openInNewTab}
            className="p-1 hover:bg-slate-600 rounded"
            title="Open in New Tab"
          >
            <ExternalLink className="h-3 w-3 text-green-400" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 hover:bg-slate-600 rounded ${showSettings ? 'bg-slate-600' : ''}`}
            title="Preview Settings"
          >
            <Settings className="h-3 w-3 text-green-400" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-slate-600 rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-3 w-3 text-green-400" />
            ) : (
              <Maximize className="h-3 w-3 text-green-400" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-700/50 border-b border-green-500/30 p-3">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-green-500/30"
              />
              <span className="text-green-300 text-sm">Auto Refresh</span>
            </label>
            
            {autoRefresh && (
              <div className="flex items-center space-x-2">
                <span className="text-green-300 text-sm">Interval:</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="bg-slate-600 text-green-300 text-sm border border-green-500/30 rounded px-2 py-1"
                >
                  <option value={500}>500ms</option>
                  <option value={1000}>1s</option>
                  <option value={2000}>2s</option>
                  <option value={5000}>5s</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center bg-white p-4">
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
            style={deviceSizes[selectedDevice]}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div className="w-80 bg-slate-900 border-l border-green-500/30 flex flex-col">
            <div className="bg-slate-700 px-3 py-2 border-b border-green-500/30">
              <span className="text-green-300 text-sm font-medium">CONSOLE</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono">
              {consoleMessages.map((message, index) => (
                <div key={index} className="text-green-300">
                  {message}
                </div>
              ))}
              {consoleMessages.length === 0 && (
                <div className="text-gray-500 italic">Console output will appear here...</div>
              )}
            </div>
            <div className="border-t border-green-500/30 p-2">
              <button
                onClick={() => setConsoleMessages([])}
                className="text-xs text-gray-400 hover:text-green-300"
              >
                Clear Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}