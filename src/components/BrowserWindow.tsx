'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Square, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Settings,
  Monitor,
  Zap,
  ExternalLink,
  Camera,
  Share2,
  AlertTriangle,
  CheckCircle,
  Loader,
  Maximize2,
  Minimize2,
  StopCircle,
  Play,
  RotateCw
} from 'lucide-react';
import { BrowserWindow as BrowserWindowType, KillType } from '../types/browser-window';
import { useWindowManager } from '../stores/window-manager';

interface BrowserWindowProps {
  window: BrowserWindowType;
  onClose?: (windowId: string) => void;
  onMinimize?: (windowId: string) => void;
  onMaximize?: (windowId: string) => void;
  onFocus?: (windowId: string) => void;
  className?: string;
  isActive?: boolean;
  showControls?: boolean;
  allowResize?: boolean;
}

export default function BrowserWindow({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  className = '',
  isActive = false,
  showControls = true,
  allowResize = true
}: BrowserWindowProps) {
  const { killWindow, updateWindow, stopServer, restartServer } = useWindowManager();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(window.url);
  const [showKillDialog, setShowKillDialog] = useState(false);
  const [killType, setKillType] = useState<KillType>('soft');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDevTools, setShowDevTools] = useState(window.devToolsOpen);
  const [performanceData, setPerformanceData] = useState({
    memoryUsage: window.memoryUsage || 0,
    cpuUsage: window.cpuUsage || 0,
    loadTime: window.loadTime || 0,
    errorCount: window.errorCount || 0
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const addressBarRef = useRef<HTMLInputElement>(null);

  // Status icon based on window status
  const getStatusIcon = () => {
    switch (window.status) {
      case 'loading':
        return <Loader className="h-4 w-4 animate-spin text-blue-400" />;
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'killed':
        return <StopCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-400" />;
    }
  };

  // Handle window close with kill dialog
  const handleClose = useCallback(async (type: KillType = 'soft') => {
    setIsLoading(true);
    try {
      await killWindow(window.id, type);
      onClose?.(window.id);
    } catch (error) {
      console.error('Failed to close window:', error);
    } finally {
      setIsLoading(false);
      setShowKillDialog(false);
    }
  }, [window.id, killWindow, onClose]);

  // Handle server restart
  const handleRestart = useCallback(async () => {
    setIsLoading(true);
    try {
      await restartServer(window.id);
      setCurrentUrl(window.url); // Refresh iframe
    } catch (error) {
      console.error('Failed to restart server:', error);
    } finally {
      setIsLoading(false);
    }
  }, [window.id, restartServer, window.url]);

  // Handle server stop
  const handleStopServer = useCallback(async () => {
    setIsLoading(true);
    try {
      await stopServer(window.id);
    } catch (error) {
      console.error('Failed to stop server:', error);
    } finally {
      setIsLoading(false);
    }
  }, [window.id, stopServer]);

  // Handle URL navigation
  const handleNavigate = useCallback((url: string) => {
    if (!url.startsWith('http')) {
      url = `http://${url}`;
    }
    setCurrentUrl(url);
    updateWindow(window.id, { url, lastActivity: new Date() });
  }, [window.id, updateWindow]);

  // Handle address bar submit
  const handleAddressSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const url = addressBarRef.current?.value;
    if (url) {
      handleNavigate(url);
    }
  }, [handleNavigate]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    updateWindow(window.id, { 
      status: 'running', 
      lastActivity: new Date(),
      loadTime: Date.now() - window.createdAt.getTime()
    });
  }, [window.id, window.createdAt, updateWindow]);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    updateWindow(window.id, { 
      status: 'error',
      errorCount: window.errorCount + 1,
      lastError: 'Failed to load page'
    });
  }, [window.id, window.errorCount, updateWindow]);

  // Handle window drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!allowResize) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [allowResize]);

  // Handle window focus
  const handleFocus = useCallback(() => {
    onFocus?.(window.id);
    updateWindow(window.id, { lastActivity: new Date() });
  }, [window.id, onFocus, updateWindow]);

  // Take screenshot
  const takeScreenshot = useCallback(async () => {
    if (!iframeRef.current) return;
    
    try {
      // For demo purposes, we'll simulate screenshot functionality
      // In a real implementation, you'd use libraries like html2canvas or similar
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText(`Screenshot of ${window.title}`, 50, 50);
        ctx.fillText(`URL: ${currentUrl}`, 50, 100);
        ctx.fillText(`Captured: ${new Date().toLocaleString()}`, 50, 150);
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Download screenshot
      const link = document.createElement('a');
      link.download = `${window.title.replace(/[^a-zA-Z0-9]/g, '-')}-screenshot.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }, [window.title, currentUrl]);

  // Share window URL
  const shareWindow = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      // Show toast notification in a real implementation
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to share window:', error);
    }
  }, [currentUrl]);

  // Simulate performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.status === 'running') {
        setPerformanceData({
          memoryUsage: Math.random() * 100 + 50,
          cpuUsage: Math.random() * 50 + 10,
          loadTime: window.loadTime || Math.random() * 2000 + 500,
          errorCount: window.errorCount
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [window.status, window.loadTime, window.errorCount]);

  return (
    <div
      ref={windowRef}
      className={`bg-gray-800 rounded-lg border-2 shadow-xl transition-all duration-200 ${
        isActive ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-600'
      } ${window.isMinimized ? 'h-12' : 'h-full'} ${className}`}
      style={{
        position: allowResize ? 'absolute' : 'relative',
        left: allowResize ? window.position.x : 'auto',
        top: allowResize ? window.position.y : 'auto',
        width: allowResize ? window.size.width : '100%',
        height: allowResize ? window.size.height : '100%',
        zIndex: window.zIndex,
        minWidth: '320px',
        minHeight: '240px'
      }}
      onMouseDown={handleFocus}
    >
      {/* Window Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-t-lg border-b border-gray-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon()}
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm truncate max-w-xs">
              {window.title}
            </span>
            <span className="text-gray-400 text-xs truncate max-w-xs">
              {window.serverType} • Port {window.port}
            </span>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-blue-400">
            <Monitor className="h-3 w-3" />
            <span>{Math.round(performanceData.memoryUsage)}MB</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <Zap className="h-3 w-3" />
            <span>{Math.round(performanceData.cpuUsage)}%</span>
          </div>
          {performanceData.errorCount > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{performanceData.errorCount}</span>
            </div>
          )}
        </div>

        {/* Window Controls */}
        {showControls && (
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => onMinimize?.(window.id)}
              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => onMaximize?.(window.id)}
              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title="Maximize"
            >
              {window.isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowKillDialog(true)}
              className="p-1 rounded hover:bg-red-700 text-gray-400 hover:text-red-400 transition-colors"
              title="Close"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!window.isMinimized && (
        <>
          {/* Navigation Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-850 border-b border-gray-700">
            {/* Navigation Controls */}
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Forward"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleNavigate(currentUrl)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Refresh"
                disabled={isLoading}
              >
                <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => handleNavigate(`http://localhost:${window.port}`)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Home"
              >
                <Home className="h-4 w-4" />
              </button>
            </div>

            {/* Address Bar */}
            <form onSubmit={handleAddressSubmit} className="flex-1 mx-3">
              <input
                ref={addressBarRef}
                type="text"
                defaultValue={currentUrl}
                className="w-full px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                placeholder="Enter URL..."
              />
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={takeScreenshot}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Screenshot"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={shareWindow}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDevTools(!showDevTools)}
                className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                  showDevTools ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}
                title="Developer Tools"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => globalThis.open(currentUrl, '_blank')}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Server Controls (if applicable) */}
          {window.processId && (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-300">Server:</span>
                <span className="text-blue-400">{window.serverType}</span>
                <span className="text-gray-500">•</span>
                <span className="text-green-400">Running on port {window.port}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  Restart
                </button>
                <button
                  onClick={handleStopServer}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                >
                  <StopCircle className="h-3 w-3" />
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Browser Content */}
            <div className={`flex-1 relative ${showDevTools ? 'w-2/3' : 'w-full'}`}>
              {window.status === 'killed' ? (
                <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                  <div className="text-center">
                    <StopCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-medium mb-2">Server Stopped</h3>
                    <p className="text-sm mb-4">This window has been terminated</p>
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      <Play className="h-4 w-4 inline mr-2" />
                      Restart Server
                    </button>
                  </div>
                </div>
              ) : window.status === 'error' ? (
                <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-medium mb-2">Failed to Load</h3>
                    <p className="text-sm mb-4">{window.lastError || 'Unknown error occurred'}</p>
                    <button
                      onClick={() => handleNavigate(currentUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 inline mr-2" />
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={window.title}
                />
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                    <Loader className="h-6 w-6 animate-spin text-blue-400" />
                    <span className="text-white">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Developer Tools Panel */}
            {showDevTools && (
              <div className="w-1/3 bg-gray-900 border-l border-gray-700 flex flex-col">
                <div className="px-3 py-2 bg-gray-800 border-b border-gray-700">
                  <h4 className="text-white font-medium text-sm">Developer Tools</h4>
                </div>
                <div className="flex-1 p-3 overflow-auto">
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-gray-300 font-medium mb-2">Performance</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-400">
                          <span>Memory Usage:</span>
                          <span className="text-blue-400">{Math.round(performanceData.memoryUsage)}MB</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>CPU Usage:</span>
                          <span className="text-green-400">{Math.round(performanceData.cpuUsage)}%</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Load Time:</span>
                          <span className="text-yellow-400">{Math.round(performanceData.loadTime)}ms</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-gray-300 font-medium mb-2">Console</h5>
                      <div className="bg-gray-800 rounded p-2 text-xs font-mono">
                        <div className="text-blue-400">&gt; Server started on port {window.port}</div>
                        <div className="text-green-400">&gt; Ready in {Math.round(performanceData.loadTime)}ms</div>
                        {window.errorCount > 0 && (
                          <div className="text-red-400">&gt; {window.errorCount} error(s) detected</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Kill Dialog */}
      {showKillDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-white font-bold text-lg mb-4">Close Window</h3>
            <p className="text-gray-300 mb-4">
              How would you like to close this window?
            </p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="killType"
                  value="soft"
                  checked={killType === 'soft'}
                  onChange={(e) => setKillType(e.target.value as KillType)}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white font-medium">Soft Close</div>
                  <div className="text-gray-400 text-sm">Gracefully shutdown server and save work</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="killType"
                  value="hard"
                  checked={killType === 'hard'}
                  onChange={(e) => setKillType(e.target.value as KillType)}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white font-medium">Hard Close</div>
                  <div className="text-gray-400 text-sm">Force close immediately</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="killType"
                  value="force"
                  checked={killType === 'force'}
                  onChange={(e) => setKillType(e.target.value as KillType)}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white font-medium">Force Kill</div>
                  <div className="text-gray-400 text-sm">Terminate all processes (use if unresponsive)</div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowKillDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleClose(killType)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Closing...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Close Window
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}