// Multi-Browser Window Management Types
// For Agent Academy IDE - Educational Development Environment

export type WindowStatus = 'loading' | 'running' | 'error' | 'killed' | 'idle';
export type ServerType = 'react' | 'nextjs' | 'static' | 'api' | 'python' | 'custom';
export type KillType = 'soft' | 'hard' | 'force';

export interface BrowserWindow {
  id: string;
  title: string;
  url: string;
  port?: number;
  status: WindowStatus;
  processId?: string;
  serverType: ServerType;
  projectName?: string;
  studentId?: string;
  
  // Performance monitoring
  memoryUsage?: number;
  cpuUsage?: number;
  loadTime?: number;
  networkRequests?: number;
  
  // Timestamps
  createdAt: Date;
  lastActivity: Date;
  lastError?: string;
  
  // UI State
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  
  // Educational features
  lessonId?: string;
  assignmentId?: string;
  collaborators?: string[];
  
  // Development features
  devToolsOpen: boolean;
  autoReload: boolean;
  errorCount: number;
  
  // Metadata
  tags: string[];
  description?: string;
}

export interface ServerProcess {
  id: string;
  windowId: string;
  type: ServerType;
  port: number;
  pid?: number;
  command: string;
  workingDirectory: string;
  
  // Process monitoring
  startTime: Date;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  
  // Status
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  lastError?: string;
  restartCount: number;
  
  // Logs
  logs: ProcessLog[];
  maxLogs: number;
}

export interface ProcessLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: 'stdout' | 'stderr' | 'system';
}

export interface WindowManager {
  windows: BrowserWindow[];
  activeWindow: string | null;
  maxWindows: number;
  portRange: [number, number];
  
  // Performance limits
  maxMemoryUsage: number;
  maxCpuUsage: number;
  
  // Educational settings
  teacherMode: boolean;
  collaborationEnabled: boolean;
  
  // Layout settings
  layout: 'tabbed' | 'tiled' | 'floating' | 'picture-in-picture';
  gridSize: { columns: number; rows: number };
}

export interface PortManager {
  usedPorts: Set<number>;
  portRange: [number, number];
  reservedPorts: Set<number>;
  
  assignPort(): number;
  releasePort(port: number): void;
  isPortAvailable(port: number): boolean;
  getAvailablePorts(): number[];
}

export interface WindowControls {
  refresh(windowId: string): Promise<void>;
  back(windowId: string): Promise<void>;
  forward(windowId: string): Promise<void>;
  home(windowId: string): Promise<void>;
  devTools(windowId: string): Promise<void>;
  fullscreen(windowId: string): Promise<void>;
  screenshot(windowId: string): Promise<string>;
  share(windowId: string): Promise<string>;
  
  // Kill functionality
  killWindow(windowId: string, type: KillType): Promise<void>;
  killAllWindows(): Promise<void>;
  restartWindow(windowId: string): Promise<void>;
}

export interface DevServerConfig {
  type: ServerType;
  port?: number;
  command: string;
  workingDirectory: string;
  environment?: Record<string, string>;
  autoRestart: boolean;
  timeout: number;
}

export interface PerformanceMetrics {
  windowId: string;
  timestamp: Date;
  
  // Resource usage
  memoryUsage: number;
  cpuUsage: number;
  networkRequests: number;
  loadTime: number;
  
  // Error tracking
  jsErrors: number;
  networkErrors: number;
  consoleWarnings: number;
  
  // User interaction
  clicks: number;
  keystrokes: number;
  scrollDistance: number;
  
  // Educational metrics
  timeSpent: number;
  featuresUsed: string[];
  codeChanges: number;
}

export interface WindowAnalytics {
  windowId: string;
  studentId: string;
  sessionId: string;
  
  // Time tracking
  totalTimeSpent: number;
  activeTimeSpent: number;
  idleTimeSpent: number;
  
  // Interaction tracking
  pagesVisited: string[];
  errorsEncountered: ProcessLog[];
  featuresUsed: string[];
  codeExecutions: number;
  
  // Collaboration
  collaborationEvents: CollaborationEvent[];
  sharedUrls: string[];
  
  // Learning outcomes
  lessonsCompleted: string[];
  assignmentsSubmitted: string[];
  achievementsUnlocked: string[];
}

export interface CollaborationEvent {
  id: string;
  type: 'share' | 'join' | 'leave' | 'edit' | 'comment';
  timestamp: Date;
  userId: string;
  windowId: string;
  data?: any;
}

export interface WindowTemplate {
  id: string;
  name: string;
  description: string;
  serverType: ServerType;
  defaultPort?: number;
  command: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
  
  // Educational metadata
  lessonId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  
  // UI settings
  defaultSize: { width: number; height: number };
  autoOpenDevTools: boolean;
  preloadUrls?: string[];
}

export interface ClassroomWindowManager {
  classroomId: string;
  teacherId: string;
  students: string[];
  
  // Window management
  getStudentWindows(studentId: string): BrowserWindow[];
  getAllClassroomWindows(): BrowserWindow[];
  broadcastToClass(message: string): Promise<void>;
  shareWindowWithClass(windowId: string): Promise<string>;
  
  // Monitoring
  monitorClassActivity(): WindowAnalytics[];
  getPerformanceReport(): ClassroomReport;
  
  // Control
  lockStudentWindows(studentIds: string[]): Promise<void>;
  unlockStudentWindows(studentIds: string[]): Promise<void>;
  forceRefreshAllWindows(): Promise<void>;
}

export interface ClassroomReport {
  classroomId: string;
  timestamp: Date;
  
  // Overall statistics
  totalWindows: number;
  activeStudents: number;
  averagePerformance: number;
  
  // Individual student data
  studentReports: StudentWindowReport[];
  
  // Common issues
  commonErrors: ProcessLog[];
  performanceIssues: PerformanceIssue[];
  
  // Usage patterns
  popularFeatures: string[];
  averageSessionTime: number;
}

export interface StudentWindowReport {
  studentId: string;
  studentName: string;
  
  // Window statistics
  totalWindows: number;
  activeWindows: number;
  errorCount: number;
  
  // Performance
  averageLoadTime: number;
  memoryUsage: number;
  cpuUsage: number;
  
  // Educational progress
  lessonsCompleted: number;
  codeExecutions: number;
  collaborationScore: number;
  
  // Issues
  topErrors: ProcessLog[];
  performanceIssues: PerformanceIssue[];
}

export interface PerformanceIssue {
  type: 'high_memory' | 'high_cpu' | 'slow_load' | 'network_error' | 'js_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  windowId: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface WindowEvent {
  id: string;
  type: 'created' | 'destroyed' | 'error' | 'performance' | 'user_action';
  windowId: string;
  timestamp: Date;
  data?: any;
}

// Hook interfaces for React components
export interface UseWindowManagerReturn {
  windows: BrowserWindow[];
  activeWindow: BrowserWindow | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createWindow: (config: Partial<BrowserWindow>) => Promise<BrowserWindow>;
  killWindow: (windowId: string, type?: KillType) => Promise<void>;
  updateWindow: (windowId: string, updates: Partial<BrowserWindow>) => Promise<void>;
  setActiveWindow: (windowId: string) => void;
  
  // Server management
  startServer: (config: DevServerConfig) => Promise<BrowserWindow>;
  stopServer: (windowId: string) => Promise<void>;
  restartServer: (windowId: string) => Promise<void>;
  
  // Bulk operations
  killAllWindows: () => Promise<void>;
  refreshAllWindows: () => Promise<void>;
  exportWindows: () => void;
  importWindows: (data: BrowserWindow[]) => Promise<void>;
}

export interface UsePortManagerReturn {
  availablePorts: number[];
  usedPorts: number[];
  assignPort: () => number | null;
  releasePort: (port: number) => void;
  isPortAvailable: (port: number) => boolean;
  reservePort: (port: number) => boolean;
}

export interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics[];
  currentMetrics: PerformanceMetrics | null;
  isMonitoring: boolean;
  
  startMonitoring: (windowId: string) => void;
  stopMonitoring: (windowId: string) => void;
  getMetricsForWindow: (windowId: string) => PerformanceMetrics[];
  generateReport: (windowId: string) => PerformanceReport;
}

export interface PerformanceReport {
  windowId: string;
  generatedAt: Date;
  timeRange: { start: Date; end: Date };
  
  // Averages
  averageMemoryUsage: number;
  averageCpuUsage: number;
  averageLoadTime: number;
  
  // Peaks
  peakMemoryUsage: number;
  peakCpuUsage: number;
  slowestLoadTime: number;
  
  // Totals
  totalErrors: number;
  totalRequests: number;
  totalTimeActive: number;
  
  // Recommendations
  recommendations: string[];
  issues: PerformanceIssue[];
}