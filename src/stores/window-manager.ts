'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  BrowserWindow, 
  ServerProcess, 
  WindowManager, 
  PortManager, 
  DevServerConfig,
  ServerType,
  KillType,
  WindowStatus,
  PerformanceMetrics,
  ProcessLog
} from '../types/browser-window';

// Port Management Implementation
class PortManagerImpl implements PortManager {
  usedPorts: Set<number> = new Set();
  portRange: [number, number] = [3000, 4000];
  reservedPorts: Set<number> = new Set([3000, 3001, 8080, 8000]); // Common dev ports

  assignPort(): number {
    for (let port = this.portRange[0]; port <= this.portRange[1]; port++) {
      if (!this.usedPorts.has(port) && !this.reservedPorts.has(port)) {
        this.usedPorts.add(port);
        return port;
      }
    }
    throw new Error('No available ports in range');
  }

  releasePort(port: number): void {
    this.usedPorts.delete(port);
  }

  isPortAvailable(port: number): boolean {
    return !this.usedPorts.has(port) && !this.reservedPorts.has(port);
  }

  getAvailablePorts(): number[] {
    const available: number[] = [];
    for (let port = this.portRange[0]; port <= this.portRange[1]; port++) {
      if (this.isPortAvailable(port)) {
        available.push(port);
      }
    }
    return available;
  }
}

// Server Process Management
class ServerProcessManager {
  private processes = new Map<string, ServerProcess>();
  private logs = new Map<string, ProcessLog[]>();

  async startServer(config: DevServerConfig, windowId: string): Promise<ServerProcess> {
    const processId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const process: ServerProcess = {
      id: processId,
      windowId,
      type: config.type,
      port: config.port || 3000,
      command: config.command,
      workingDirectory: config.workingDirectory,
      startTime: new Date(),
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
      status: 'starting',
      restartCount: 0,
      logs: [],
      maxLogs: 1000
    };

    this.processes.set(processId, process);

    try {
      // Simulate server startup
      await this.simulateServerStartup(process);
      process.status = 'running';
      this.addLog(processId, 'info', `Server started successfully on port ${process.port}`, 'system');
    } catch (error) {
      process.status = 'error';
      process.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.addLog(processId, 'error', process.lastError, 'system');
      throw error;
    }

    return process;
  }

  async stopServer(processId: string, killType: KillType = 'soft'): Promise<void> {
    const process = this.processes.get(processId);
    if (!process) {
      throw new Error(`Process ${processId} not found`);
    }

    process.status = 'stopping';
    this.addLog(processId, 'info', `Stopping server (${killType} kill)`, 'system');

    try {
      // Simulate different kill types
      switch (killType) {
        case 'soft':
          await this.simulateGracefulShutdown(process);
          break;
        case 'hard':
          await this.simulateForceKill(process);
          break;
        case 'force':
          await this.simulateForceKill(process, true);
          break;
      }

      process.status = 'stopped';
      this.addLog(processId, 'info', 'Server stopped successfully', 'system');
    } catch (error) {
      process.status = 'error';
      const errorMsg = error instanceof Error ? error.message : 'Failed to stop server';
      process.lastError = errorMsg;
      this.addLog(processId, 'error', errorMsg, 'system');
      throw error;
    }
  }

  async restartServer(processId: string): Promise<void> {
    const process = this.processes.get(processId);
    if (!process) {
      throw new Error(`Process ${processId} not found`);
    }

    this.addLog(processId, 'info', 'Restarting server...', 'system');
    process.restartCount++;

    try {
      await this.stopServer(processId, 'soft');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before restart
      
      const config: DevServerConfig = {
        type: process.type,
        port: process.port,
        command: process.command,
        workingDirectory: process.workingDirectory,
        autoRestart: true,
        timeout: 30000
      };

      await this.startServer(config, process.windowId);
      this.addLog(processId, 'info', 'Server restarted successfully', 'system');
    } catch (error) {
      process.status = 'error';
      const errorMsg = error instanceof Error ? error.message : 'Failed to restart server';
      process.lastError = errorMsg;
      this.addLog(processId, 'error', errorMsg, 'system');
      throw error;
    }
  }

  getProcess(processId: string): ServerProcess | undefined {
    return this.processes.get(processId);
  }

  getAllProcesses(): ServerProcess[] {
    return Array.from(this.processes.values());
  }

  getProcessesForWindow(windowId: string): ServerProcess[] {
    return Array.from(this.processes.values()).filter(p => p.windowId === windowId);
  }

  private async simulateServerStartup(process: ServerProcess): Promise<void> {
    // Simulate startup time based on server type
    const startupTimes: Record<ServerType, number> = {
      react: 2000,
      nextjs: 3000,
      static: 500,
      api: 1500,
      python: 2500,
      custom: 2000
    };

    const delay = startupTimes[process.type] || 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate potential startup errors
    if (Math.random() < 0.05) { // 5% chance of startup failure
      throw new Error(`Failed to start ${process.type} server on port ${process.port}`);
    }
  }

  private async simulateGracefulShutdown(process: ServerProcess): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async simulateForceKill(process: ServerProcess, immediate = false): Promise<void> {
    if (immediate) {
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  private addLog(processId: string, level: ProcessLog['level'], message: string, source: ProcessLog['source']): void {
    const process = this.processes.get(processId);
    if (!process) return;

    const log: ProcessLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      source
    };

    process.logs.push(log);

    // Limit log history
    if (process.logs.length > process.maxLogs) {
      process.logs = process.logs.slice(-process.maxLogs);
    }
  }
}

// Performance Monitor
class PerformanceMonitor {
  private monitors = new Map<string, NodeJS.Timeout>();
  private metrics = new Map<string, PerformanceMetrics[]>();

  startMonitoring(windowId: string): void {
    if (this.monitors.has(windowId)) {
      this.stopMonitoring(windowId);
    }

    const interval = setInterval(() => {
      this.collectMetrics(windowId);
    }, 5000); // Collect every 5 seconds

    this.monitors.set(windowId, interval);
  }

  stopMonitoring(windowId: string): void {
    const monitor = this.monitors.get(windowId);
    if (monitor) {
      clearInterval(monitor);
      this.monitors.delete(windowId);
    }
  }

  getMetrics(windowId: string): PerformanceMetrics[] {
    return this.metrics.get(windowId) || [];
  }

  private collectMetrics(windowId: string): void {
    // Simulate performance metrics collection
    const metrics: PerformanceMetrics = {
      windowId,
      timestamp: new Date(),
      memoryUsage: Math.random() * 100 + 50, // 50-150MB
      cpuUsage: Math.random() * 50 + 10, // 10-60%
      networkRequests: Math.floor(Math.random() * 20),
      loadTime: Math.random() * 2000 + 500, // 500-2500ms
      jsErrors: Math.floor(Math.random() * 3),
      networkErrors: Math.floor(Math.random() * 2),
      consoleWarnings: Math.floor(Math.random() * 5),
      clicks: Math.floor(Math.random() * 10),
      keystrokes: Math.floor(Math.random() * 50),
      scrollDistance: Math.floor(Math.random() * 1000),
      timeSpent: 5, // 5 seconds interval
      featuresUsed: ['devtools', 'console', 'network'],
      codeChanges: Math.floor(Math.random() * 5)
    };

    const windowMetrics = this.metrics.get(windowId) || [];
    windowMetrics.push(metrics);

    // Keep only last 100 metrics entries per window
    if (windowMetrics.length > 100) {
      windowMetrics.splice(0, windowMetrics.length - 100);
    }

    this.metrics.set(windowId, windowMetrics);
  }
}

// Window Manager Store
interface WindowManagerState extends WindowManager {
  // Internal managers
  portManager: PortManagerImpl;
  serverManager: ServerProcessManager;
  performanceMonitor: PerformanceMonitor;
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createWindow: (config: Partial<BrowserWindow>) => Promise<BrowserWindow>;
  updateWindow: (windowId: string, updates: Partial<BrowserWindow>) => void;
  killWindow: (windowId: string, killType?: KillType) => Promise<void>;
  setActiveWindow: (windowId: string) => void;
  
  // Server management
  startServer: (config: DevServerConfig, windowId?: string) => Promise<BrowserWindow>;
  stopServer: (windowId: string) => Promise<void>;
  restartServer: (windowId: string) => Promise<void>;
  
  // Bulk operations
  killAllWindows: () => Promise<void>;
  refreshAllWindows: () => Promise<void>;
  
  // Performance monitoring
  startPerformanceMonitoring: (windowId: string) => void;
  stopPerformanceMonitoring: (windowId: string) => void;
  getPerformanceMetrics: (windowId: string) => PerformanceMetrics[];
  
  // Utilities
  getAvailablePorts: () => number[];
  generateWindowId: () => string;
  cleanupResources: () => void;
}

const useWindowManagerStore = create<WindowManagerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        windows: [],
        activeWindow: null,
        maxWindows: 10,
        portRange: [3000, 4000],
        maxMemoryUsage: 500, // 500MB limit per window
        maxCpuUsage: 80, // 80% CPU limit
        teacherMode: false,
        collaborationEnabled: true,
        layout: 'tabbed',
        gridSize: { columns: 2, rows: 2 },
        
        // Managers
        portManager: new PortManagerImpl(),
        serverManager: new ServerProcessManager(),
        performanceMonitor: new PerformanceMonitor(),
        
        // UI state
        isLoading: false,
        error: null,

        // Generate unique window ID
        generateWindowId: () => `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

        // Create new browser window
        createWindow: async (config: Partial<BrowserWindow>) => {
          const { portManager, generateWindowId } = get();
          
          set({ isLoading: true, error: null });
          
          try {
            const windowId = generateWindowId();
            const port = config.port || portManager.assignPort();
            
            const newWindow: BrowserWindow = {
              id: windowId,
              title: config.title || `Window ${windowId.slice(-6)}`,
              url: config.url || `http://localhost:${port}`,
              port,
              status: 'loading',
              serverType: config.serverType || 'static',
              createdAt: new Date(),
              lastActivity: new Date(),
              isMinimized: false,
              position: config.position || { x: 100 + (Math.random() * 200), y: 100 + (Math.random() * 200) },
              size: config.size || { width: 800, height: 600 },
              zIndex: Date.now(),
              devToolsOpen: false,
              autoReload: true,
              errorCount: 0,
              tags: config.tags || [],
              ...config
            };

            set(state => ({
              windows: [...state.windows, newWindow],
              activeWindow: windowId,
              isLoading: false
            }));

            // Start performance monitoring
            get().performanceMonitor.startMonitoring(windowId);

            return newWindow;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to create window';
            set({ isLoading: false, error: errorMsg });
            throw error;
          }
        },

        // Update window properties
        updateWindow: (windowId: string, updates: Partial<BrowserWindow>) => {
          set(state => ({
            windows: state.windows.map(window =>
              window.id === windowId
                ? { ...window, ...updates, lastActivity: new Date() }
                : window
            )
          }));
        },

        // Kill window with cleanup
        killWindow: async (windowId: string, killType: KillType = 'soft') => {
          const { portManager, serverManager, performanceMonitor } = get();
          
          set({ isLoading: true, error: null });
          
          try {
            const window = get().windows.find(w => w.id === windowId);
            if (!window) {
              throw new Error(`Window ${windowId} not found`);
            }

            // Stop any running servers
            const processes = serverManager.getProcessesForWindow(windowId);
            for (const process of processes) {
              await serverManager.stopServer(process.id, killType);
            }

            // Release port
            if (window.port) {
              portManager.releasePort(window.port);
            }

            // Stop performance monitoring
            performanceMonitor.stopMonitoring(windowId);

            // Remove window from state
            set(state => ({
              windows: state.windows.filter(w => w.id !== windowId),
              activeWindow: state.activeWindow === windowId ? null : state.activeWindow,
              isLoading: false
            }));

            // Set new active window if needed
            const remainingWindows = get().windows;
            if (remainingWindows.length > 0 && !get().activeWindow) {
              set({ activeWindow: remainingWindows[0].id });
            }

          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to kill window';
            set({ isLoading: false, error: errorMsg });
            throw error;
          }
        },

        // Set active window
        setActiveWindow: (windowId: string) => {
          const window = get().windows.find(w => w.id === windowId);
          if (window) {
            set({ activeWindow: windowId });
            get().updateWindow(windowId, { lastActivity: new Date() });
          }
        },

        // Start development server
        startServer: async (config: DevServerConfig, windowId?: string) => {
          const { serverManager, portManager } = get();
          
          set({ isLoading: true, error: null });
          
          try {
            // Create window if not provided
            let targetWindowId = windowId;
            if (!targetWindowId) {
              const window = await get().createWindow({
                title: `${config.type} Server`,
                serverType: config.type,
                port: config.port
              });
              targetWindowId = window.id;
            }

            // Assign port if not specified
            if (!config.port) {
              config.port = portManager.assignPort();
            }

            // Start server process
            const process = await serverManager.startServer(config, targetWindowId!);

            // Update window with server info
            get().updateWindow(targetWindowId!, {
              status: 'running',
              processId: process.id,
              url: `http://localhost:${process.port}`,
              port: process.port
            });

            const window = get().windows.find(w => w.id === targetWindowId);
            set({ isLoading: false });
            
            return window!;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to start server';
            set({ isLoading: false, error: errorMsg });
            throw error;
          }
        },

        // Stop server
        stopServer: async (windowId: string) => {
          const { serverManager } = get();
          
          const processes = serverManager.getProcessesForWindow(windowId);
          for (const process of processes) {
            await serverManager.stopServer(process.id);
          }

          get().updateWindow(windowId, {
            status: 'killed',
            processId: undefined
          });
        },

        // Restart server
        restartServer: async (windowId: string) => {
          const { serverManager } = get();
          
          const processes = serverManager.getProcessesForWindow(windowId);
          for (const process of processes) {
            await serverManager.restartServer(process.id);
          }

          get().updateWindow(windowId, {
            status: 'running',
            lastActivity: new Date()
          });
        },

        // Kill all windows
        killAllWindows: async () => {
          const { windows } = get();
          
          for (const window of windows) {
            await get().killWindow(window.id, 'soft');
          }
        },

        // Refresh all windows
        refreshAllWindows: async () => {
          const { windows } = get();
          
          for (const window of windows) {
            get().updateWindow(window.id, { lastActivity: new Date() });
          }
        },

        // Performance monitoring
        startPerformanceMonitoring: (windowId: string) => {
          get().performanceMonitor.startMonitoring(windowId);
        },

        stopPerformanceMonitoring: (windowId: string) => {
          get().performanceMonitor.stopMonitoring(windowId);
        },

        getPerformanceMetrics: (windowId: string) => {
          return get().performanceMonitor.getMetrics(windowId);
        },

        // Utilities
        getAvailablePorts: () => {
          return get().portManager.getAvailablePorts();
        },

        cleanupResources: () => {
          const { performanceMonitor, portManager, windows } = get();
          
          // Stop all monitoring
          windows.forEach(window => {
            performanceMonitor.stopMonitoring(window.id);
            if (window.port) {
              portManager.releasePort(window.port);
            }
          });
        }
      }),
      {
        name: 'window-manager-storage',
        partialize: (state) => ({
          windows: state.windows,
          maxWindows: state.maxWindows,
          teacherMode: state.teacherMode,
          collaborationEnabled: state.collaborationEnabled,
          layout: state.layout,
          gridSize: state.gridSize
        })
      }
    ),
    { name: 'WindowManager' }
  )
);

export default useWindowManagerStore;

// Custom hooks for easier usage
export const useWindowManager = () => {
  const store = useWindowManagerStore();
  
  return {
    windows: store.windows,
    activeWindow: store.activeWindow ? store.windows.find(w => w.id === store.activeWindow) : null,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    createWindow: store.createWindow,
    killWindow: store.killWindow,
    updateWindow: store.updateWindow,
    setActiveWindow: store.setActiveWindow,
    
    // Server management
    startServer: store.startServer,
    stopServer: store.stopServer,
    restartServer: store.restartServer,
    
    // Bulk operations
    killAllWindows: store.killAllWindows,
    refreshAllWindows: store.refreshAllWindows,
    
    // Utils
    getAvailablePorts: store.getAvailablePorts
  };
};

export const usePortManager = () => {
  const store = useWindowManagerStore();
  
  return {
    availablePorts: store.getAvailablePorts(),
    usedPorts: Array.from(store.portManager.usedPorts),
    assignPort: () => {
      try {
        return store.portManager.assignPort();
      } catch {
        return null;
      }
    },
    releasePort: (port: number) => store.portManager.releasePort(port),
    isPortAvailable: (port: number) => store.portManager.isPortAvailable(port)
  };
};

export const usePerformanceMonitor = (windowId?: string) => {
  const store = useWindowManagerStore();
  
  return {
    metrics: windowId ? store.getPerformanceMetrics(windowId) : [],
    isMonitoring: windowId ? store.performanceMonitor.monitors.has(windowId) : false,
    startMonitoring: store.startPerformanceMonitoring,
    stopMonitoring: store.stopPerformanceMonitoring,
    getMetricsForWindow: store.getPerformanceMetrics
  };
};