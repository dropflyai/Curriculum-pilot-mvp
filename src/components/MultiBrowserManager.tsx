'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus,
  Monitor,
  Grid3x3,
  Layers,
  Settings,
  Play,
  Square,
  BarChart3,
  Users,
  BookOpen,
  Server,
  Code,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  MemoryStick,
  Cpu,
  X,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import BrowserWindow from './BrowserWindow';
import { useWindowManager, usePortManager, usePerformanceMonitor } from '../stores/window-manager';
import { ServerType, DevServerConfig, BrowserWindow as BrowserWindowType } from '../types/browser-window';

type LayoutMode = 'tabbed' | 'tiled' | 'floating' | 'picture-in-picture';

interface WindowTemplate {
  id: string;
  name: string;
  serverType: ServerType;
  command: string;
  port?: number;
  icon: React.ReactNode;
  description: string;
}

const WINDOW_TEMPLATES: WindowTemplate[] = [
  {
    id: 'react-dev',
    name: 'React Development',
    serverType: 'react',
    command: 'npm run dev',
    icon: <Code className="h-4 w-4" />,
    description: 'React development server with hot reload'
  },
  {
    id: 'nextjs-dev',
    name: 'Next.js Application',
    serverType: 'nextjs',
    command: 'npm run dev',
    icon: <Globe className="h-4 w-4" />,
    description: 'Next.js full-stack development server'
  },
  {
    id: 'static-server',
    name: 'Static File Server',
    serverType: 'static',
    command: 'python -m http.server',
    port: 8000,
    icon: <Server className="h-4 w-4" />,
    description: 'Simple HTTP server for static files'
  },
  {
    id: 'api-server',
    name: 'API Server',
    serverType: 'api',
    command: 'npm run start:api',
    icon: <Zap className="h-4 w-4" />,
    description: 'Backend API development server'
  },
  {
    id: 'python-server',
    name: 'Python Server',
    serverType: 'python',
    command: 'python app.py',
    icon: <Code className="h-4 w-4" />,
    description: 'Python web application server'
  }
];

export default function MultiBrowserManager() {
  const {
    windows,
    activeWindow,
    isLoading,
    error,
    createWindow,
    killWindow,
    setActiveWindow,
    startServer,
    killAllWindows,
    refreshAllWindows
  } = useWindowManager();

  const { availablePorts, usedPorts } = usePortManager();
  const [layout, setLayout] = useState<LayoutMode>('tabbed');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const [showClassroomPanel, setShowClassroomPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WindowTemplate | null>(null);
  const [customPort, setCustomPort] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [studentMode, setStudentMode] = useState(false);

  // Handle window creation from template
  const handleCreateFromTemplate = useCallback(async (template: WindowTemplate) => {
    try {
      const config: DevServerConfig = {
        type: template.serverType,
        command: template.command,
        port: customPort ? parseInt(customPort) : template.port,
        workingDirectory: process.cwd(),
        autoRestart: true,
        timeout: 30000
      };

      await startServer(config);
      setShowCreateDialog(false);
      setSelectedTemplate(null);
      setCustomPort('');
    } catch (error) {
      console.error('Failed to create window from template:', error);
    }
  }, [startServer, customPort]);

  // Handle custom window creation
  const handleCreateCustomWindow = useCallback(async () => {
    try {
      if (!customUrl) return;

      await createWindow({
        title: `Custom Window`,
        url: customUrl,
        serverType: 'custom',
        tags: ['custom']
      });

      setShowCreateDialog(false);
      setCustomUrl('');
    } catch (error) {
      console.error('Failed to create custom window:', error);
    }
  }, [createWindow, customUrl]);

  // Handle layout change
  const handleLayoutChange = useCallback((newLayout: LayoutMode) => {
    setLayout(newLayout);
  }, []);

  // Handle window close
  const handleWindowClose = useCallback(async (windowId: string) => {
    try {
      await killWindow(windowId);
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  }, [killWindow]);

  // Handle window minimize
  const handleWindowMinimize = useCallback((windowId: string) => {
    // Update window state to minimize
    const window = windows.find(w => w.id === windowId);
    if (window) {
      // In a real implementation, you'd update the window manager store
      console.log('Minimizing window:', windowId);
    }
  }, [windows]);

  // Handle window maximize
  const handleWindowMaximize = useCallback((windowId: string) => {
    // Update window state to maximize/restore
    const window = windows.find(w => w.id === windowId);
    if (window) {
      console.log('Maximizing window:', windowId);
    }
  }, [windows]);

  // Calculate grid layout
  const getGridLayout = useCallback(() => {
    const windowCount = windows.filter(w => !w.isMinimized).length;
    if (windowCount <= 1) return { columns: 1, rows: 1 };
    if (windowCount <= 4) return { columns: 2, rows: 2 };
    if (windowCount <= 9) return { columns: 3, rows: 3 };
    return { columns: 4, rows: Math.ceil(windowCount / 4) };
  }, [windows]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const runningWindows = windows.filter(w => w.status === 'running');
    const totalMemory = runningWindows.reduce((sum, w) => sum + (w.memoryUsage || 0), 0);
    const totalCpu = runningWindows.reduce((sum, w) => sum + (w.cpuUsage || 0), 0);
    const errorCount = windows.reduce((sum, w) => sum + w.errorCount, 0);

    return {
      totalWindows: windows.length,
      runningWindows: runningWindows.length,
      totalMemory: Math.round(totalMemory),
      averageCpu: runningWindows.length > 0 ? Math.round(totalCpu / runningWindows.length) : 0,
      errorCount,
      portsUsed: usedPorts.length,
      portsAvailable: availablePorts.length
    };
  }, [windows, usedPorts, availablePorts]);

  const performanceSummary = getPerformanceSummary();

  // Render window grid for tiled layout
  const renderTiledLayout = () => {
    const visibleWindows = windows.filter(w => !w.isMinimized);
    const gridLayout = getGridLayout();
    const windowWidth = Math.floor(100 / gridLayout.columns);
    const windowHeight = Math.floor(100 / gridLayout.rows);

    return (
      <div className="grid h-full gap-2 p-2" style={{
        gridTemplateColumns: `repeat(${gridLayout.columns}, 1fr)`,
        gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`
      }}>
        {visibleWindows.map((window) => (
          <div key={window.id} className="min-h-0">
            <BrowserWindow
              window={window}
              isActive={activeWindow?.id === window.id}
              onClose={handleWindowClose}
              onMinimize={handleWindowMinimize}
              onMaximize={handleWindowMaximize}
              onFocus={setActiveWindow}
              allowResize={false}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render floating windows layout
  const renderFloatingLayout = () => {
    return (
      <div className="relative h-full overflow-hidden">
        {windows.map((window) => (
          <BrowserWindow
            key={window.id}
            window={window}
            isActive={activeWindow?.id === window.id}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={setActiveWindow}
            allowResize={true}
          />
        ))}
      </div>
    );
  };

  // Render tabbed layout
  const renderTabbedLayout = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 border-b border-gray-700 overflow-x-auto">
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => setActiveWindow(window.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm transition-colors max-w-xs ${
                activeWindow?.id === window.id
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              {window.status === 'running' ? (
                <CheckCircle className="h-3 w-3 text-green-400" />
              ) : window.status === 'error' ? (
                <AlertTriangle className="h-3 w-3 text-red-400" />
              ) : (
                <Monitor className="h-3 w-3" />
              )}
              <span className="truncate">{window.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWindowClose(window.id);
                }}
                className="p-0.5 rounded hover:bg-gray-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          ))}
        </div>

        {/* Active Window Content */}
        <div className="flex-1">
          {activeWindow ? (
            <BrowserWindow
              window={activeWindow}
              isActive={true}
              onClose={handleWindowClose}
              onMinimize={handleWindowMinimize}
              onMaximize={handleWindowMaximize}
              onFocus={setActiveWindow}
              allowResize={false}
              showControls={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
              <div className="text-center">
                <Monitor className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Windows Open</h3>
                <p className="text-sm mb-4">Create a new browser window to get started</p>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Create Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <Monitor className="h-6 w-6 text-blue-400" />
            Multi-Browser IDE
          </h1>
          
          {/* Performance Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-blue-400">
              <Square className="h-3 w-3" />
              <span>{performanceSummary.totalWindows} Windows</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span>{performanceSummary.runningWindows} Running</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <MemoryStick className="h-3 w-3" />
              <span>{performanceSummary.totalMemory}MB</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <Cpu className="h-3 w-3" />
              <span>{performanceSummary.averageCpu}%</span>
            </div>
            {performanceSummary.errorCount > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="h-3 w-3" />
                <span>{performanceSummary.errorCount} Errors</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Controls */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleLayoutChange('tabbed')}
              className={`p-2 rounded transition-colors ${
                layout === 'tabbed' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Tabbed Layout"
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLayoutChange('tiled')}
              className={`p-2 rounded transition-colors ${
                layout === 'tiled' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Tiled Layout"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLayoutChange('floating')}
              className={`p-2 rounded transition-colors ${
                layout === 'floating' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Floating Windows"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowPerformancePanel(!showPerformancePanel)}
            className={`p-2 rounded transition-colors ${
              showPerformancePanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Performance Monitor"
          >
            <BarChart3 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowClassroomPanel(!showClassroomPanel)}
            className={`p-2 rounded transition-colors ${
              showClassroomPanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Classroom Management"
          >
            <Users className="h-4 w-4" />
          </button>

          <button
            onClick={refreshAllWindows}
            className="p-2 rounded bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Refresh All Windows"
            disabled={isLoading}
          >
            <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Window
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-600 text-white px-4 py-2 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button className="hover:bg-red-700 p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Windows Area */}
        <div className="flex-1">
          {layout === 'tabbed' && renderTabbedLayout()}
          {layout === 'tiled' && renderTiledLayout()}
          {layout === 'floating' && renderFloatingLayout()}
        </div>

        {/* Side Panels */}
        {(showPerformancePanel || showClassroomPanel) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                {showPerformancePanel && (
                  <>
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-medium">Performance Monitor</h3>
                  </>
                )}
                {showClassroomPanel && (
                  <>
                    <Users className="h-5 w-5 text-green-400" />
                    <h3 className="text-white font-medium">Classroom Management</h3>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setShowPerformancePanel(false);
                  setShowClassroomPanel(false);
                }}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto p-4">
              {showPerformancePanel && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">System Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Windows:</span>
                        <span className="text-white">{performanceSummary.totalWindows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Running:</span>
                        <span className="text-green-400">{performanceSummary.runningWindows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory Usage:</span>
                        <span className="text-blue-400">{performanceSummary.totalMemory}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average CPU:</span>
                        <span className="text-purple-400">{performanceSummary.averageCpu}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ports Used:</span>
                        <span className="text-yellow-400">{performanceSummary.portsUsed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">Window Details</h4>
                    <div className="space-y-2">
                      {windows.map((window) => (
                        <div key={window.id} className="flex items-center justify-between p-2 bg-gray-600 rounded text-sm">
                          <div className="flex items-center gap-2">
                            {window.status === 'running' ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-red-400" />
                            )}
                            <span className="text-white truncate">{window.title}</span>
                          </div>
                          <div className="text-gray-400">
                            {window.memoryUsage ? `${Math.round(window.memoryUsage)}MB` : '0MB'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showClassroomPanel && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">Classroom Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={studentMode}
                          onChange={(e) => setStudentMode(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">Student Mode</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                        Share All Windows
                      </button>
                      <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                        Create Study Session
                      </button>
                      <button
                        onClick={killAllWindows}
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Close All Windows
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Window Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-white font-bold text-xl">Create New Browser Window</h2>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <h3 className="text-white font-medium mb-3 md:col-span-2">Choose a Template</h3>
                {WINDOW_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-lg border transition-colors text-left ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-600/10'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-400">{template.icon}</div>
                      <span className="text-white font-medium">{template.name}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Port (optional)</label>
                      <input
                        type="number"
                        value={customPort}
                        onChange={(e) => setCustomPort(e.target.value)}
                        placeholder={`Auto (${availablePorts[0] || 'None available'})`}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Server Type</label>
                      <input
                        type="text"
                        value={selectedTemplate.serverType}
                        disabled
                        className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded border border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Or Enter Custom URL</h4>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com or http://localhost:3000"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                {selectedTemplate ? (
                  <button
                    onClick={() => handleCreateFromTemplate(selectedTemplate)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Server
                      </>
                    )}
                  </button>
                ) : customUrl ? (
                  <button
                    onClick={handleCreateCustomWindow}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Open URL
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}