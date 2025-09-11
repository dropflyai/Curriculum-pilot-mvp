/**
 * Comprehensive Port Management System Types
 * Agent Academy IDE - Educational Development Environment
 */

// Core Port Management Types
export interface Port {
  number: number
  status: 'available' | 'occupied' | 'reserved' | 'blocked' | 'starting' | 'stopping'
  service?: ServiceInfo
  processId?: number
  startTime?: Date
  lastActivity?: Date
  bandwidth?: BandwidthStats
  educationalInfo?: PortEducation
  healthStatus?: HealthStatus
  analytics?: PortAnalytics
}

export interface ServiceInfo {
  id: string
  name: string
  type: 'web-server' | 'api-server' | 'database' | 'websocket' | 'static' | 'proxy' | 'development'
  framework: ServerFramework
  version?: string
  description: string
  healthStatus: ServiceHealthStatus
  url: string
  endpoints?: APIEndpoint[]
  config?: ServiceConfig
  logs?: LogEntry[]
  metrics?: ServiceMetrics
}

export type ServerFramework = 
  | 'react' 
  | 'nextjs' 
  | 'vue' 
  | 'angular' 
  | 'svelte'
  | 'flask' 
  | 'fastapi' 
  | 'django' 
  | 'express' 
  | 'nodejs'
  | 'static' 
  | 'webpack-dev' 
  | 'vite' 
  | 'parcel'
  | 'custom'

export type ServiceHealthStatus = 
  | 'healthy' 
  | 'warning' 
  | 'error' 
  | 'starting' 
  | 'stopping' 
  | 'unknown'

export interface ServiceConfig {
  command: string
  args: string[]
  env: Record<string, string>
  workingDirectory: string
  autoRestart: boolean
  hotReload: boolean
  buildOptimization: boolean
  proxy?: ProxyConfig[]
  security?: SecurityConfig
}

export interface ProxyConfig {
  path: string
  target: string
  changeOrigin: boolean
  secure: boolean
  headers?: Record<string, string>
}

export interface SecurityConfig {
  httpsOnly: boolean
  corsEnabled: boolean
  allowedOrigins: string[]
  rateLimiting: {
    enabled: boolean
    requestsPerMinute: number
  }
}

// Port Analytics and Monitoring
export interface BandwidthStats {
  requestsPerMinute: number
  totalRequests: number
  averageResponseTime: number
  errorRate: number
  lastRequest?: Date
  peakUsage?: {
    timestamp: Date
    requestsPerMinute: number
  }
  dataTransfer: {
    bytesIn: number
    bytesOut: number
    totalTransfer: number
  }
}

export interface PortAnalytics {
  uptime: number
  totalSessions: number
  averageSessionDuration: number
  popularEndpoints: EndpointStats[]
  performanceMetrics: PerformanceMetrics
  errorAnalysis: ErrorAnalysis
  userBehavior: UserBehaviorStats
}

export interface EndpointStats {
  path: string
  method: string
  hits: number
  averageResponseTime: number
  errorRate: number
  lastAccessed: Date
}

export interface PerformanceMetrics {
  responseTime: {
    p50: number
    p90: number
    p95: number
    p99: number
  }
  throughput: {
    requestsPerSecond: number
    peakRPS: number
  }
  resourceUsage: {
    cpuPercent: number
    memoryMB: number
    diskIOPS: number
  }
}

export interface ErrorAnalysis {
  totalErrors: number
  errorsByType: Record<string, number>
  recentErrors: ErrorRecord[]
  errorTrends: ErrorTrend[]
}

export interface ErrorRecord {
  timestamp: Date
  type: string
  message: string
  stack?: string
  context?: Record<string, any>
}

export interface ErrorTrend {
  timeframe: string
  errorCount: number
  change: number
}

export interface UserBehaviorStats {
  uniqueVisitors: number
  sessionCount: number
  averagePageViews: number
  bounceRate: number
  userFlow: UserFlowStep[]
}

export interface UserFlowStep {
  path: string
  timestamp: Date
  duration: number
  action: 'visit' | 'click' | 'form_submit' | 'scroll' | 'exit'
}

// Health Monitoring
export interface HealthStatus {
  port: number
  healthy: boolean
  status: number
  responseTime: number
  timestamp: Date
  details: string
  error?: string
  checks: HealthCheck[]
}

export interface HealthCheck {
  name: string
  type: 'endpoint' | 'tcp' | 'process' | 'resource'
  url?: string
  method?: 'GET' | 'POST' | 'HEAD'
  expectedStatus?: number
  timeout: number
  interval: number
  retries: number
  lastCheck?: Date
  passing: boolean
  details?: string
}

// Development Server Management
export interface DevelopmentServer {
  id: string
  name: string
  type: ServerFramework
  port: number
  status: ServerStatus
  config: ServerConfig
  metrics: ServiceMetrics
  logs: LogEntry[]
  educationalContext: ServerEducation
  buildInfo?: BuildInfo
  dependencies?: DependencyInfo[]
}

export type ServerStatus = 
  | 'starting' 
  | 'running' 
  | 'stopping' 
  | 'stopped' 
  | 'error' 
  | 'restarting'
  | 'building'
  | 'ready'

export interface ServiceMetrics {
  startTime: Date
  uptime: number
  requestCount: number
  errorCount: number
  successRate: number
  memoryUsage?: number
  cpuUsage?: number
  buildTime?: number
  lastDeployment?: Date
  performanceScore?: number
}

export interface BuildInfo {
  status: 'building' | 'success' | 'failed' | 'skipped'
  startTime?: Date
  duration?: number
  outputSize?: number
  warnings: string[]
  errors: string[]
  optimizations: OptimizationInfo[]
}

export interface OptimizationInfo {
  type: 'bundle-size' | 'code-splitting' | 'tree-shaking' | 'minification' | 'compression'
  applied: boolean
  impact: string
  details: string
}

export interface DependencyInfo {
  name: string
  version: string
  type: 'production' | 'development' | 'peer'
  size: number
  vulnerabilities: VulnerabilityInfo[]
  updateAvailable?: string
}

export interface VulnerabilityInfo {
  severity: 'low' | 'moderate' | 'high' | 'critical'
  title: string
  description: string
  recommendation: string
  cve?: string
}

// Educational Features
export interface PortEducation {
  concept: string
  description: string
  commonUse: string
  securityConsiderations: string[]
  bestPractices: string[]
  relatedPorts: number[]
  tutorials: EducationalTutorial[]
  interactiveExamples: InteractiveExample[]
}

export interface EducationalTutorial {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  steps: TutorialStep[]
  prerequisites: string[]
  objectives: string[]
}

export interface TutorialStep {
  id: string
  title: string
  description: string
  action?: 'click' | 'type' | 'observe' | 'configure'
  target?: string
  validation?: {
    type: 'port-status' | 'response-code' | 'content-match' | 'manual'
    criteria: any
  }
  hints: string[]
  explanation: string
}

export interface InteractiveExample {
  id: string
  title: string
  description: string
  framework: ServerFramework
  code: CodeExample[]
  expectedResult: string
  learningObjectives: string[]
}

export interface CodeExample {
  file: string
  language: string
  content: string
  explanation: string
}

export interface ServerEducation {
  framework: string
  purpose: string
  commonPorts: number[]
  configFiles: string[]
  buildProcess: string
  deploymentTips: string[]
  troubleshooting: TroubleshootingGuide[]
  bestPractices: BestPractice[]
  securityTips: SecurityTip[]
}

export interface TroubleshootingGuide {
  issue: string
  symptoms: string[]
  solution: string
  prevention: string
  relatedIssues: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface BestPractice {
  category: 'performance' | 'security' | 'development' | 'deployment'
  title: string
  description: string
  implementation: string
  impact: 'low' | 'medium' | 'high'
  examples: string[]
}

export interface SecurityTip {
  title: string
  description: string
  implementation: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  compliance: string[]
}

// Network Education
export interface NetworkConcept {
  name: string
  description: string
  importance: string
  examples: string[]
  relatedConcepts: string[]
  practicalApplications: string[]
  visualization?: VisualizationData
}

export interface VisualizationData {
  type: 'diagram' | 'animation' | 'interactive' | 'chart'
  data: any
  description: string
}

export interface WellKnownPort {
  port: number
  service: string
  protocol: 'TCP' | 'UDP' | 'BOTH'
  description: string
  securityConsiderations: string[]
  developmentRelevance: string
  alternatives: number[]
  rfc?: string
}

export interface ProtocolExplanation {
  name: string
  fullName: string
  description: string
  layer: number
  characteristics: string[]
  useCases: string[]
  advantages: string[]
  disadvantages: string[]
  examples: ProtocolExample[]
}

export interface ProtocolExample {
  scenario: string
  implementation: string
  explanation: string
  code?: string
}

// Browser Integration
export interface BrowserWindow {
  id: string
  title: string
  url: string
  type: string
  port?: number
  processId?: number
  isActive: boolean
  lastAccessed: Date
  educationalContext?: BrowserEducationalContext
  performance?: BrowserPerformance
}

export interface BrowserEducationalContext {
  framework?: string
  purpose: string
  learningObjectives: string[]
  relatedConcepts: string[]
  interactionPoints: InteractionPoint[]
}

export interface InteractionPoint {
  element: string
  description: string
  educationalValue: string
  triggerAction?: string
}

export interface BrowserPerformance {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  performanceScore: number
}

// Monitoring and Alerts
export interface PortAnomaly {
  type: 'high-error-rate' | 'slow-response' | 'high-traffic' | 'resource-usage' | 'security-event'
  severity: 'low' | 'medium' | 'high' | 'critical'
  port: number
  description: string
  detectedAt: Date
  metrics: Record<string, number>
  recommendation: string
  autoResolve: boolean
  resolved?: Date
  resolutionAction?: string
}

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: AlertCondition
  actions: AlertAction[]
  enabled: boolean
  suppressionTime: number
  educationalContext?: string
}

export interface AlertCondition {
  metric: string
  operator: '>' | '<' | '=' | '>=' | '<=' | '!='
  threshold: number
  duration: number
  scope: 'port' | 'service' | 'global'
}

export interface AlertAction {
  type: 'notification' | 'email' | 'restart-service' | 'educational-tip' | 'auto-fix'
  config: Record<string, any>
  delay: number
}

// Logging
export interface LogEntry {
  id: string
  timestamp: Date
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string
  source: string
  context?: Record<string, any>
  port?: number
  serviceId?: string
  category: 'system' | 'application' | 'security' | 'performance' | 'user'
}

// Configuration and Settings
export interface PortManagerConfig {
  portRange: [number, number]
  reservedPorts: number[]
  defaultPorts: Record<ServerFramework, number[]>
  monitoring: {
    enabled: boolean
    interval: number
    healthChecks: boolean
    analytics: boolean
  }
  security: {
    allowExternalAccess: boolean
    requireHTTPS: boolean
    rateLimiting: boolean
  }
  education: {
    enableTutorials: boolean
    showTips: boolean
    trackProgress: boolean
  }
}

// API and Events
export interface PortEvent {
  type: 'port-allocated' | 'port-released' | 'service-started' | 'service-stopped' | 'health-check' | 'anomaly-detected'
  port: number
  timestamp: Date
  data: Record<string, any>
  educationalContext?: string
}

export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  parameters?: APIParameter[]
  responses: APIResponse[]
  authenticated: boolean
  rateLimit?: number
}

export interface APIParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  example?: any
}

export interface APIResponse {
  status: number
  description: string
  schema?: any
  example?: any
}

// Utility Types
export interface PortUsageHistory {
  port: number
  allocatedAt: Date
  releasedAt?: Date
  service: string
  framework: ServerFramework
  duration?: number
  issues: string[]
  performance: {
    avgResponseTime: number
    totalRequests: number
    errorRate: number
  }
}

export interface EducationalInsight {
  type: 'performance' | 'security' | 'best-practice' | 'troubleshooting' | 'scaling'
  title: string
  description: string
  impact: string
  recommendation: string
  learningObjective: string
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  relatedConcepts: string[]
}

export interface NetworkTutorial {
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  concepts: string[]
  activities: TutorialActivity[]
  prerequisites: string[]
  outcomes: string[]
}

export interface TutorialActivity {
  name: string
  description: string
  type: 'hands-on' | 'observation' | 'configuration' | 'troubleshooting'
  instructions: string[]
  validation: ActivityValidation
  hints: string[]
}

export interface ActivityValidation {
  type: 'automated' | 'manual' | 'peer-review'
  criteria: string[]
  passingScore?: number
}

// Error and Exception Types
export class PortManagementError extends Error {
  constructor(
    message: string,
    public code: string,
    public port?: number,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'PortManagementError'
  }
}

export class PortAllocationError extends PortManagementError {
  constructor(port: number, reason: string) {
    super(`Failed to allocate port ${port}: ${reason}`, 'PORT_ALLOCATION_FAILED', port)
    this.name = 'PortAllocationError'
  }
}

export class ServiceStartupError extends PortManagementError {
  constructor(serviceId: string, port: number, reason: string) {
    super(`Failed to start service ${serviceId} on port ${port}: ${reason}`, 'SERVICE_STARTUP_FAILED', port, { serviceId })
    this.name = 'ServiceStartupError'
  }
}