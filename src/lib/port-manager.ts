/**
 * Intelligent Port Management System
 * Agent Academy IDE - Educational Development Environment
 */

import { 
  Port, 
  ServiceInfo, 
  PortUsageHistory, 
  PortEvent, 
  PortAllocationError, 
  PortManagerConfig,
  ServerFramework,
  ServiceHealthStatus,
  LogEntry,
  EducationalInsight
} from '@/types/port-management'

export class PortManager {
  private allocatedPorts: Map<number, Port> = new Map()
  private portHistory: PortUsageHistory[] = []
  private eventListeners: ((event: PortEvent) => void)[] = []
  private config: PortManagerConfig
  private portRange: [number, number] = [3000, 9999]
  private reservedPorts: Set<number> = new Set([
    22, 80, 443, 993, 995, // System ports
    3000, 3001, 3002, 3003, // Common dev ports
    8000, 8080, 8888, // Common API ports
    5000, 5001, 5173, 4200, // Framework-specific ports
  ])

  // Framework-specific port preferences
  private frameworkPorts: Record<ServerFramework, number[]> = {
    'react': [3000, 3001, 3002, 3003],
    'nextjs': [3000, 3001, 3002],
    'vue': [8080, 3000, 3001],
    'angular': [4200, 4201, 4202],
    'svelte': [5173, 3000, 8080],
    'flask': [5000, 8000, 8080],
    'fastapi': [8000, 8001, 8080],
    'django': [8000, 8001, 8080],
    'express': [3000, 8000, 8080],
    'nodejs': [3000, 8000, 8080],
    'static': [8080, 8000, 3000],
    'webpack-dev': [8080, 3000, 8081],
    'vite': [5173, 3000, 8080],
    'parcel': [1234, 3000, 8080],
    'custom': [8080, 3000, 8000]
  }

  constructor(config?: Partial<PortManagerConfig>) {
    this.config = {
      portRange: [3000, 9999],
      reservedPorts: [],
      defaultPorts: this.frameworkPorts,
      monitoring: {
        enabled: true,
        interval: 5000,
        healthChecks: true,
        analytics: true
      },
      security: {
        allowExternalAccess: false,
        requireHTTPS: false,
        rateLimiting: true
      },
      education: {
        enableTutorials: true,
        showTips: true,
        trackProgress: true
      },
      ...config
    }

    this.portRange = this.config.portRange
    this.config.reservedPorts.forEach(port => this.reservedPorts.add(port))
    
    // Start monitoring if enabled
    if (this.config.monitoring.enabled) {
      this.startMonitoring()
    }
  }

  /**
   * Intelligent port allocation with educational context
   */
  async allocatePort(
    preferredPort?: number, 
    service?: Partial<ServiceInfo>
  ): Promise<{ port: number; insights: EducationalInsight[] }> {
    const insights: EducationalInsight[] = []
    
    try {
      let targetPort: number
      
      if (preferredPort) {
        // Check if preferred port is available
        if (await this.isPortAvailable(preferredPort)) {
          targetPort = preferredPort
          insights.push({
            type: 'best-practice',
            title: 'Port Selection Success',
            description: `Successfully allocated preferred port ${preferredPort}`,
            impact: 'Your development workflow is optimized when using consistent ports',
            recommendation: 'Consider documenting port assignments for team consistency',
            learningObjective: 'Understanding port allocation and team development practices',
            priority: 'low',
            actionable: true,
            relatedConcepts: ['development-workflow', 'team-collaboration']
          })
        } else {
          // Handle port conflict with educational context
          const conflictResult = await this.handlePortConflict(preferredPort, service)
          targetPort = conflictResult.port
          insights.push(...conflictResult.insights)
        }
      } else {
        // Smart port selection
        const smartResult = await this.findOptimalPort(service)
        targetPort = smartResult.port
        insights.push(...smartResult.insights)
      }

      // Reserve the port
      await this.reservePort(targetPort, service)
      
      // Emit allocation event
      this.emitEvent({
        type: 'port-allocated',
        port: targetPort,
        timestamp: new Date(),
        data: { service: service?.name || 'Unknown Service' },
        educationalContext: this.getEducationalContext(targetPort, service?.framework)
      })

      return { port: targetPort, insights }
      
    } catch (error) {
      throw new PortAllocationError(
        preferredPort || 0, 
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Smart port conflict resolution with educational insights
   */
  private async handlePortConflict(
    port: number, 
    service?: Partial<ServiceInfo>
  ): Promise<{ port: number; insights: EducationalInsight[] }> {
    const insights: EducationalInsight[] = []
    const existingService = this.allocatedPorts.get(port)
    
    insights.push({
      type: 'troubleshooting',
      title: 'Port Conflict Detected',
      description: `Port ${port} is already in use by ${existingService?.service?.name || 'another service'}`,
      impact: 'Port conflicts prevent services from starting properly',
      recommendation: 'The system will automatically find an alternative port',
      learningObjective: 'Understanding port conflicts and resolution strategies',
      priority: 'medium',
      actionable: false,
      relatedConcepts: ['port-management', 'conflict-resolution', 'network-fundamentals']
    })

    // Try framework-specific alternatives
    if (service?.framework) {
      const frameworkPorts = this.frameworkPorts[service.framework]
      for (const alternativePort of frameworkPorts) {
        if (await this.isPortAvailable(alternativePort)) {
          insights.push({
            type: 'best-practice',
            title: 'Framework-Optimized Port Selected',
            description: `Using port ${alternativePort}, which is commonly used for ${service.framework} development`,
            impact: 'Framework-specific ports are optimized for development workflows',
            recommendation: 'Learn the common port conventions for different frameworks',
            learningObjective: 'Understanding framework-specific development practices',
            priority: 'low',
            actionable: true,
            relatedConcepts: ['framework-conventions', 'development-standards']
          })
          
          return { port: alternativePort, insights }
        }
      }
    }

    // Find any available port in range
    const availablePort = await this.findAvailablePortInRange()
    
    insights.push({
      type: 'performance',
      title: 'Dynamic Port Assignment',
      description: `Automatically assigned port ${availablePort} to resolve the conflict`,
      impact: 'Dynamic port assignment ensures services can start without manual intervention',
      recommendation: 'Update your configuration to use the new port or implement port discovery',
      learningObjective: 'Understanding dynamic service discovery and configuration management',
      priority: 'medium',
      actionable: true,
      relatedConcepts: ['service-discovery', 'configuration-management', 'automation']
    })

    return { port: availablePort, insights }
  }

  /**
   * Find optimal port with educational context
   */
  private async findOptimalPort(
    service?: Partial<ServiceInfo>
  ): Promise<{ port: number; insights: EducationalInsight[] }> {
    const insights: EducationalInsight[] = []
    
    // Prioritize framework-specific ports
    if (service?.framework) {
      const frameworkPorts = this.frameworkPorts[service.framework]
      
      for (const port of frameworkPorts) {
        if (await this.isPortAvailable(port)) {
          insights.push({
            type: 'best-practice',
            title: 'Framework Convention Followed',
            description: `Selected port ${port}, the standard port for ${service.framework} development`,
            impact: 'Using conventional ports improves team productivity and reduces confusion',
            recommendation: 'Learn and use framework-specific port conventions in your projects',
            learningObjective: 'Understanding industry standards and development conventions',
            priority: 'low',
            actionable: true,
            relatedConcepts: ['industry-standards', 'team-productivity', 'best-practices']
          })
          
          return { port, insights }
        }
      }
    }

    // Use historical data for intelligent selection
    const historicallySuccessfulPorts = this.getHistoricallySuccessfulPorts(service?.framework)
    
    for (const port of historicallySuccessfulPorts) {
      if (await this.isPortAvailable(port)) {
        insights.push({
          type: 'performance',
          title: 'Historically Optimal Port Selected',
          description: `Port ${port} has been successful for similar services in the past`,
          impact: 'Learning from previous usage patterns improves development efficiency',
          recommendation: 'Track port usage patterns to optimize future allocations',
          learningObjective: 'Understanding data-driven development optimization',
          priority: 'low',
          actionable: true,
          relatedConcepts: ['data-analysis', 'optimization', 'historical-patterns']
        })
        
        return { port, insights }
      }
    }

    // Fall back to any available port
    const availablePort = await this.findAvailablePortInRange()
    
    insights.push({
      type: 'troubleshooting',
      title: 'Dynamic Port Assignment',
      description: `All preferred ports are in use, assigned port ${availablePort}`,
      impact: 'System adaptability ensures services can always start',
      recommendation: 'Consider implementing port pooling or service orchestration',
      learningObjective: 'Understanding system resilience and adaptive allocation',
      priority: 'medium',
      actionable: true,
      relatedConcepts: ['system-resilience', 'adaptive-systems', 'resource-management']
    })

    return { port: availablePort, insights }
  }

  /**
   * Check if port is available using multiple methods
   */
  async isPortAvailable(port: number): Promise<boolean> {
    // Check if port is in our allocated ports
    if (this.allocatedPorts.has(port)) {
      return false
    }

    // Check if port is reserved
    if (this.reservedPorts.has(port)) {
      return false
    }

    // Check if port is outside our allowed range
    if (port < this.portRange[0] || port > this.portRange[1]) {
      return false
    }

    try {
      // In a real implementation, this would use Node.js net module to test port availability
      // For now, we'll simulate the check
      return await this.performPortAvailabilityCheck(port)
    } catch (error) {
      return false
    }
  }

  /**
   * Simulate port availability check
   * In production, this would use actual network testing
   */
  private async performPortAvailabilityCheck(port: number): Promise<boolean> {
    // Simulate async check with a small delay
    await new Promise(resolve => setTimeout(resolve, 10))
    
    // Simple simulation: ports ending in 0, 1, 2, 3 are "available"
    // This is just for demo purposes
    const lastDigit = port % 10
    return lastDigit <= 3
  }

  /**
   * Reserve a port for a service
   */
  private async reservePort(port: number, service?: Partial<ServiceInfo>): Promise<void> {
    const portInfo: Port = {
      number: port,
      status: 'reserved',
      startTime: new Date(),
      service: service ? {
        id: service.id || `service_${Date.now()}`,
        name: service.name || `Service on port ${port}`,
        type: service.type || 'development',
        framework: service.framework || 'custom',
        description: service.description || `Development service on port ${port}`,
        healthStatus: 'starting' as ServiceHealthStatus,
        url: `http://localhost:${port}`,
        endpoints: service.endpoints || [],
        config: service.config,
        logs: [],
        metrics: {
          startTime: new Date(),
          uptime: 0,
          requestCount: 0,
          errorCount: 0,
          successRate: 100
        }
      } : undefined,
      bandwidth: {
        requestsPerMinute: 0,
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        dataTransfer: {
          bytesIn: 0,
          bytesOut: 0,
          totalTransfer: 0
        }
      },
      educationalInfo: await this.generatePortEducation(port, service?.framework)
    }

    this.allocatedPorts.set(port, portInfo)
    
    // Record in history
    this.portHistory.push({
      port,
      allocatedAt: new Date(),
      service: service?.name || 'Unknown Service',
      framework: service?.framework || 'custom',
      issues: [],
      performance: {
        avgResponseTime: 0,
        totalRequests: 0,
        errorRate: 0
      }
    })
  }

  /**
   * Release a port and update history
   */
  async deallocatePort(port: number): Promise<void> {
    const portInfo = this.allocatedPorts.get(port)
    
    if (portInfo) {
      // Update history
      const historyEntry = this.portHistory.find(
        h => h.port === port && !h.releasedAt
      )
      
      if (historyEntry) {
        historyEntry.releasedAt = new Date()
        historyEntry.duration = Date.now() - historyEntry.allocatedAt.getTime()
        
        if (portInfo.bandwidth) {
          historyEntry.performance = {
            avgResponseTime: portInfo.bandwidth.averageResponseTime,
            totalRequests: portInfo.bandwidth.totalRequests,
            errorRate: portInfo.bandwidth.errorRate
          }
        }
      }

      this.allocatedPorts.delete(port)
      
      // Emit deallocation event
      this.emitEvent({
        type: 'port-released',
        port,
        timestamp: new Date(),
        data: { service: portInfo.service?.name || 'Unknown Service' }
      })
    }
  }

  /**
   * Kill a process running on a specific port
   */
  async killPortProcess(port: number, force: boolean = false): Promise<void> {
    const portInfo = this.allocatedPorts.get(port)
    
    if (!portInfo || !portInfo.processId) {
      throw new Error(`No process found for port ${port}`)
    }

    try {
      if (force) {
        await this.forceKillProcess(portInfo.processId)
      } else {
        await this.gracefulKillProcess(portInfo.processId)
      }
      
      await this.deallocatePort(port)
      
    } catch (error) {
      throw new Error(`Failed to kill process on port ${port}: ${error}`)
    }
  }

  /**
   * Gracefully terminate a process
   */
  private async gracefulKillProcess(processId: number): Promise<void> {
    // In a real implementation, this would use process.kill(processId, 'SIGTERM')
    console.log(`Gracefully terminating process ${processId}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  /**
   * Force kill a process
   */
  private async forceKillProcess(processId: number): Promise<void> {
    // In a real implementation, this would use process.kill(processId, 'SIGKILL')
    console.log(`Force killing process ${processId}`)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  /**
   * Find any available port in the configured range
   */
  private async findAvailablePortInRange(): Promise<number> {
    // Start from a random point to distribute ports more evenly
    const startPort = Math.floor(Math.random() * (this.portRange[1] - this.portRange[0])) + this.portRange[0]
    
    // Check from start point to end of range
    for (let port = startPort; port <= this.portRange[1]; port++) {
      if (await this.isPortAvailable(port)) {
        return port
      }
    }
    
    // Check from beginning of range to start point
    for (let port = this.portRange[0]; port < startPort; port++) {
      if (await this.isPortAvailable(port)) {
        return port
      }
    }
    
    throw new Error('No available ports in configured range')
  }

  /**
   * Get historically successful ports for a framework
   */
  private getHistoricallySuccessfulPorts(framework?: ServerFramework): number[] {
    if (!framework) return []
    
    return this.portHistory
      .filter(h => 
        h.framework === framework && 
        h.releasedAt && 
        h.issues.length === 0 &&
        h.performance.errorRate < 0.05
      )
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .map(h => h.port)
      .slice(0, 5) // Top 5 historically successful ports
  }

  /**
   * Generate educational context for a port
   */
  private getEducationalContext(port: number, framework?: ServerFramework): string {
    if (framework && this.frameworkPorts[framework].includes(port)) {
      return `Port ${port} is a standard port for ${framework} development, commonly used in the developer community.`
    }
    
    if (port >= 3000 && port <= 3999) {
      return `Port ${port} is in the common development server range (3000-3999), typically used for frontend applications.`
    }
    
    if (port >= 8000 && port <= 8999) {
      return `Port ${port} is in the API server range (8000-8999), commonly used for backend services and APIs.`
    }
    
    return `Port ${port} is a dynamically assigned port in the development range.`
  }

  /**
   * Generate educational information for a port
   */
  private async generatePortEducation(port: number, framework?: ServerFramework) {
    // This would be implemented with a comprehensive educational database
    return {
      concept: `Port ${port}${framework ? ` for ${framework}` : ''}`,
      description: `Network port used for ${framework || 'development'} services`,
      commonUse: framework ? `${framework} development server` : 'Development server',
      securityConsiderations: [
        'Only expose ports that are necessary',
        'Use HTTPS in production environments',
        'Implement proper access controls'
      ],
      bestPractices: [
        'Use consistent port assignments across development team',
        'Document port assignments in project README',
        'Implement health checks for services'
      ],
      relatedPorts: framework ? this.frameworkPorts[framework] : [],
      tutorials: [],
      interactiveExamples: []
    }
  }

  /**
   * Start monitoring allocated ports
   */
  private startMonitoring(): void {
    setInterval(() => {
      this.monitorPorts()
    }, this.config.monitoring.interval)
  }

  /**
   * Monitor all allocated ports
   */
  private async monitorPorts(): Promise<void> {
    for (const [port, portInfo] of this.allocatedPorts.entries()) {
      try {
        // Update port status and metrics
        await this.updatePortMetrics(port, portInfo)
        
        // Perform health check if enabled
        if (this.config.monitoring.healthChecks) {
          await this.performHealthCheck(port, portInfo)
        }
        
      } catch (error) {
        console.warn(`Monitoring error for port ${port}:`, error)
      }
    }
  }

  /**
   * Update metrics for a specific port
   */
  private async updatePortMetrics(port: number, portInfo: Port): Promise<void> {
    // In a real implementation, this would collect actual metrics
    // For now, we'll simulate some basic updates
    
    if (portInfo.service && portInfo.service.metrics) {
      portInfo.service.metrics.uptime = Date.now() - portInfo.service.metrics.startTime.getTime()
    }
    
    if (portInfo.bandwidth) {
      // Simulate some activity
      const randomActivity = Math.random() > 0.7
      if (randomActivity) {
        portInfo.bandwidth.totalRequests += Math.floor(Math.random() * 5) + 1
        portInfo.bandwidth.requestsPerMinute = Math.floor(Math.random() * 10) + 1
        portInfo.bandwidth.averageResponseTime = Math.floor(Math.random() * 200) + 50
        portInfo.lastActivity = new Date()
      }
    }
  }

  /**
   * Perform health check on a port
   */
  private async performHealthCheck(port: number, portInfo: Port): Promise<void> {
    try {
      // Simulate health check
      const healthy = Math.random() > 0.1 // 90% chance of being healthy
      
      if (portInfo.service) {
        portInfo.service.healthStatus = healthy ? 'healthy' : 'warning'
      }
      
      if (!healthy && portInfo.service) {
        // Emit health check event
        this.emitEvent({
          type: 'health-check',
          port,
          timestamp: new Date(),
          data: { 
            status: 'warning',
            service: portInfo.service.name
          }
        })
      }
      
    } catch (error) {
      if (portInfo.service) {
        portInfo.service.healthStatus = 'error'
      }
    }
  }

  /**
   * Event system for port management
   */
  addEventListener(listener: (event: PortEvent) => void): void {
    this.eventListeners.push(listener)
  }

  removeEventListener(listener: (event: PortEvent) => void): void {
    const index = this.eventListeners.indexOf(listener)
    if (index > -1) {
      this.eventListeners.splice(index, 1)
    }
  }

  private emitEvent(event: PortEvent): void {
    this.eventListeners.forEach(listener => listener(event))
  }

  /**
   * Get all allocated ports
   */
  getAllocatedPorts(): Map<number, Port> {
    return new Map(this.allocatedPorts)
  }

  /**
   * Get port usage history
   */
  getPortHistory(): PortUsageHistory[] {
    return [...this.portHistory]
  }

  /**
   * Get available ports in range
   */
  async getAvailablePorts(count: number = 10): Promise<number[]> {
    const availablePorts: number[] = []
    
    for (let port = this.portRange[0]; port <= this.portRange[1] && availablePorts.length < count; port++) {
      if (await this.isPortAvailable(port)) {
        availablePorts.push(port)
      }
    }
    
    return availablePorts
  }

  /**
   * Get port information
   */
  getPortInfo(port: number): Port | undefined {
    return this.allocatedPorts.get(port)
  }

  /**
   * Update port configuration
   */
  updateConfig(newConfig: Partial<PortManagerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    if (newConfig.portRange) {
      this.portRange = newConfig.portRange
    }
    
    if (newConfig.reservedPorts) {
      this.reservedPorts.clear()
      newConfig.reservedPorts.forEach(port => this.reservedPorts.add(port))
    }
  }
}