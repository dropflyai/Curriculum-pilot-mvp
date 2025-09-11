/**
 * Development Server Manager
 * Comprehensive multi-server management for Agent Academy IDE
 */

import { 
  DevelopmentServer, 
  ServerFramework,
  ServerStatus,
  ServiceConfig,
  ServiceMetrics,
  LogEntry,
  ServerEducation,
  BuildInfo,
  ServiceStartupError,
  EducationalInsight,
  TroubleshootingGuide,
  BestPractice,
  SecurityTip
} from '@/types/port-management'
import { PortManager } from './port-manager'

export interface CreateServerConfig {
  name: string
  type: ServerFramework
  preferredPort?: number
  workingDirectory: string
  autoRestart?: boolean
  hotReload?: boolean
  buildOptimization?: boolean
  env?: Record<string, string>
  customCommand?: string
  customArgs?: string[]
}

export class DevelopmentServerManager {
  private servers: Map<string, DevelopmentServer> = new Map()
  private serverProcesses: Map<string, any> = new Map() // Would be actual process objects
  private portManager: PortManager
  private logStreams: Map<string, LogEntry[]> = new Map()

  constructor(portManager: PortManager) {
    this.portManager = portManager
  }

  /**
   * Start a new development server with educational context
   */
  async startServer(config: CreateServerConfig): Promise<{
    server: DevelopmentServer
    insights: EducationalInsight[]
    recommendations: string[]
  }> {
    const insights: EducationalInsight[] = []
    const recommendations: string[] = []

    try {
      // Allocate port with educational context
      const { port, insights: portInsights } = await this.portManager.allocatePort(
        config.preferredPort,
        {
          name: config.name,
          type: 'development',
          framework: config.type,
          description: `${config.type} development server`
        }
      )

      insights.push(...portInsights)

      // Create server configuration
      const serverConfig = this.buildServerConfig(config, port)
      
      // Initialize server object
      const server: DevelopmentServer = {
        id: `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: config.name,
        type: config.type,
        port,
        status: 'starting',
        config: serverConfig,
        metrics: this.initializeMetrics(),
        logs: [],
        educationalContext: this.getEducationalContext(config.type),
        buildInfo: {
          status: 'building',
          startTime: new Date(),
          warnings: [],
          errors: [],
          optimizations: []
        }
      }

      // Store server
      this.servers.set(server.id, server)
      this.logStreams.set(server.id, [])

      // Add educational insights for server type
      insights.push(...this.generateServerInsights(config.type, port))

      // Launch the server
      await this.launchServer(server)

      // Generate recommendations
      recommendations.push(...this.generateRecommendations(server))

      return { server, insights, recommendations }

    } catch (error) {
      throw new ServiceStartupError(
        config.name,
        config.preferredPort || 0,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Stop a development server
   */
  async stopServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    server.status = 'stopping'
    this.addLog(serverId, 'info', 'Stopping server...')

    try {
      // Stop the actual process
      await this.stopServerProcess(serverId)
      
      // Release the port
      await this.portManager.deallocatePort(server.port)
      
      // Update server status
      server.status = 'stopped'
      this.addLog(serverId, 'info', 'Server stopped successfully')
      
      // Clean up
      this.serverProcesses.delete(serverId)
      
    } catch (error) {
      server.status = 'error'
      this.addLog(serverId, 'error', `Failed to stop server: ${error}`)
      throw error
    }
  }

  /**
   * Restart a development server
   */
  async restartServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    // Store the original status before changing it
    const wasRunning = server.status === 'running'
    
    server.status = 'restarting'
    this.addLog(serverId, 'info', 'Restarting server...')

    try {
      // Stop the server first if it was running
      if (wasRunning) {
        await this.stopServerProcess(serverId)
      }

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Start again
      await this.launchServer(server)

      this.addLog(serverId, 'info', 'Server restarted successfully')

    } catch (error) {
      server.status = 'error'
      this.addLog(serverId, 'error', `Failed to restart server: ${error}`)
      throw error
    }
  }

  /**
   * Build server configuration based on framework
   */
  private buildServerConfig(config: CreateServerConfig, port: number): ServiceConfig {
    const baseConfig: ServiceConfig = {
      command: '',
      args: [],
      env: {
        PORT: port.toString(),
        NODE_ENV: 'development',
        ...config.env
      },
      workingDirectory: config.workingDirectory,
      autoRestart: config.autoRestart ?? true,
      hotReload: config.hotReload ?? true,
      buildOptimization: config.buildOptimization ?? false,
      proxy: [],
      security: {
        httpsOnly: false,
        corsEnabled: true,
        allowedOrigins: ['*'],
        rateLimiting: {
          enabled: false,
          requestsPerMinute: 100
        }
      }
    }

    // Framework-specific configurations
    switch (config.type) {
      case 'react':
        return {
          ...baseConfig,
          command: 'npm',
          args: ['start'],
          env: {
            ...baseConfig.env,
            BROWSER: 'none', // Prevent auto-opening browser
            FAST_REFRESH: 'true'
          }
        }

      case 'nextjs':
        return {
          ...baseConfig,
          command: 'npm',
          args: ['run', 'dev'],
          env: {
            ...baseConfig.env,
            NEXT_TELEMETRY_DISABLED: '1'
          }
        }

      case 'vue':
        return {
          ...baseConfig,
          command: 'npm',
          args: ['run', 'serve'],
          env: {
            ...baseConfig.env,
            VUE_CLI_SERVICE_CONFIG_PATH: './vue.config.js'
          }
        }

      case 'angular':
        return {
          ...baseConfig,
          command: 'ng',
          args: ['serve', '--port', port.toString()],
          env: {
            ...baseConfig.env,
            NG_CLI_ANALYTICS: 'false'
          }
        }

      case 'svelte':
        return {
          ...baseConfig,
          command: 'npm',
          args: ['run', 'dev'],
          env: {
            ...baseConfig.env,
            SVELTE_DEV: 'true'
          }
        }

      case 'flask':
        return {
          ...baseConfig,
          command: 'python',
          args: ['-m', 'flask', 'run', '--host=127.0.0.1', `--port=${port}`],
          env: {
            ...baseConfig.env,
            FLASK_ENV: 'development',
            FLASK_DEBUG: '1'
          }
        }

      case 'fastapi':
        return {
          ...baseConfig,
          command: 'uvicorn',
          args: ['main:app', '--reload', '--host', '127.0.0.1', '--port', port.toString()],
          env: {
            ...baseConfig.env,
            PYTHONPATH: config.workingDirectory
          }
        }

      case 'django':
        return {
          ...baseConfig,
          command: 'python',
          args: ['manage.py', 'runserver', `127.0.0.1:${port}`],
          env: {
            ...baseConfig.env,
            DJANGO_SETTINGS_MODULE: 'settings.development'
          }
        }

      case 'express':
      case 'nodejs':
        return {
          ...baseConfig,
          command: 'node',
          args: ['server.js'],
          env: {
            ...baseConfig.env,
            NODE_OPTIONS: '--inspect'
          }
        }

      case 'static':
        return {
          ...baseConfig,
          command: 'npx',
          args: ['http-server', '.', '-p', port.toString(), '-c-1'],
          env: baseConfig.env
        }

      case 'vite':
        return {
          ...baseConfig,
          command: 'npm',
          args: ['run', 'dev'],
          env: {
            ...baseConfig.env,
            VITE_PORT: port.toString()
          }
        }

      case 'webpack-dev':
        return {
          ...baseConfig,
          command: 'npx',
          args: ['webpack', 'serve', '--mode', 'development', '--port', port.toString()],
          env: baseConfig.env
        }

      case 'custom':
        return {
          ...baseConfig,
          command: config.customCommand || 'npm',
          args: config.customArgs || ['start'],
          env: baseConfig.env
        }

      default:
        return {
          ...baseConfig,
          command: 'npm',
          args: ['start'],
          env: baseConfig.env
        }
    }
  }

  /**
   * Launch a server with the appropriate framework setup
   */
  private async launchServer(server: DevelopmentServer): Promise<void> {
    this.addLog(server.id, 'info', `Starting ${server.type} server on port ${server.port}...`)

    try {
      // Update status
      server.status = 'starting'
      
      // Simulate server startup process
      await this.simulateServerStartup(server)
      
      // Update metrics
      server.metrics.startTime = new Date()
      server.status = 'running'
      
      this.addLog(server.id, 'info', `${server.type} server started successfully`)
      this.addLog(server.id, 'info', `Server available at http://localhost:${server.port}`)
      
      // Add educational startup message
      this.addEducationalStartupMessage(server)
      
    } catch (error) {
      server.status = 'error'
      this.addLog(server.id, 'error', `Failed to start server: ${error}`)
      throw error
    }
  }

  /**
   * Simulate server startup process
   */
  private async simulateServerStartup(server: DevelopmentServer): Promise<void> {
    // Simulate build process for frameworks that require it
    if (['react', 'nextjs', 'vue', 'angular', 'svelte', 'vite'].includes(server.type)) {
      server.buildInfo = {
        status: 'building',
        startTime: new Date(),
        warnings: [],
        errors: [],
        optimizations: []
      }
      
      this.addLog(server.id, 'info', 'Building application...')
      
      // Simulate build time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000))
      
      // Simulate build completion
      server.buildInfo.status = 'success'
      server.buildInfo.duration = Date.now() - server.buildInfo.startTime!.getTime()
      server.buildInfo.outputSize = Math.floor(Math.random() * 5000) + 1000 // KB
      
      this.addLog(server.id, 'info', `Build completed in ${server.buildInfo.duration}ms`)
      this.addLog(server.id, 'info', `Bundle size: ${server.buildInfo.outputSize}KB`)
    }
    
    // Simulate server startup delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    // Simulate some startup logs
    this.addFrameworkSpecificLogs(server)
  }

  /**
   * Add framework-specific startup logs
   */
  private addFrameworkSpecificLogs(server: DevelopmentServer): void {
    switch (server.type) {
      case 'react':
        this.addLog(server.id, 'info', 'webpack compiled successfully')
        this.addLog(server.id, 'info', 'Fast Refresh enabled')
        break
        
      case 'nextjs':
        this.addLog(server.id, 'info', 'ready - started server on 0.0.0.0:' + server.port)
        this.addLog(server.id, 'info', 'event - compiled client and server successfully')
        break
        
      case 'vue':
        this.addLog(server.id, 'info', 'App running at:')
        this.addLog(server.id, 'info', '- Local:   http://localhost:' + server.port)
        break
        
      case 'flask':
        this.addLog(server.id, 'info', '* Running on http://127.0.0.1:' + server.port)
        this.addLog(server.id, 'info', '* Debug mode: on')
        break
        
      case 'fastapi':
        this.addLog(server.id, 'info', 'Uvicorn running on http://127.0.0.1:' + server.port)
        this.addLog(server.id, 'info', 'Application startup complete.')
        break
    }
  }

  /**
   * Add educational startup message
   */
  private addEducationalStartupMessage(server: DevelopmentServer): void {
    const educationalMessages = {
      react: 'React development server provides hot reloading and error overlay for efficient development.',
      nextjs: 'Next.js includes automatic code splitting, server-side rendering, and API routes.',
      vue: 'Vue CLI development server offers hot module replacement and comprehensive build tools.',
      angular: 'Angular CLI provides live reload, TypeScript compilation, and comprehensive testing tools.',
      flask: 'Flask development server includes automatic reloading and interactive debugging.',
      fastapi: 'FastAPI with uvicorn provides automatic API documentation and high performance.',
      static: 'Static file server is perfect for serving HTML, CSS, and JavaScript files directly.'
    }

    const message = educationalMessages[server.type as keyof typeof educationalMessages]
    if (message) {
      this.addLog(server.id, 'info', `📚 Educational Note: ${message}`)
    }
  }

  /**
   * Generate educational insights for server type
   */
  private generateServerInsights(framework: ServerFramework, port: number): EducationalInsight[] {
    const insights: EducationalInsight[] = []

    const frameworkInsights = {
      react: {
        title: 'React Development Server Started',
        description: 'React uses webpack-dev-server for hot module replacement and fast refresh',
        impact: 'Hot reloading speeds up development by preserving component state during code changes',
        recommendation: 'Use React DevTools browser extension to inspect component hierarchy and props',
        learningObjective: 'Understanding modern frontend development workflows and tooling'
      },
      nextjs: {
        title: 'Next.js Development Environment',
        description: 'Next.js provides full-stack React development with server-side rendering',
        impact: 'Built-in optimization features like automatic code splitting improve performance',
        recommendation: 'Explore API routes in pages/api/ for backend functionality',
        learningObjective: 'Learning full-stack web development and modern React patterns'
      },
      flask: {
        title: 'Flask Development Server',
        description: 'Flask provides a lightweight Python web framework with debugging capabilities',
        impact: 'Built-in debugger helps identify and fix errors quickly during development',
        recommendation: 'Use Flask-CLI commands and explore route decorators for API development',
        learningObjective: 'Understanding Python web development and RESTful API design'
      },
      fastapi: {
        title: 'FastAPI Development Server',
        description: 'FastAPI with Uvicorn provides high-performance Python API development',
        impact: 'Automatic OpenAPI documentation generation improves API development workflow',
        recommendation: 'Visit /docs endpoint to explore interactive API documentation',
        learningObjective: 'Learning modern Python API development with automatic documentation'
      }
    }

    const insight = frameworkInsights[framework as keyof typeof frameworkInsights]
    if (insight) {
      insights.push({
        type: 'best-practice',
        title: insight.title,
        description: insight.description,
        impact: insight.impact,
        recommendation: insight.recommendation,
        learningObjective: insight.learningObjective,
        priority: 'low',
        actionable: true,
        relatedConcepts: ['development-workflow', framework, 'tooling']
      })
    }

    return insights
  }

  /**
   * Generate recommendations for server setup
   */
  private generateRecommendations(server: DevelopmentServer): string[] {
    const recommendations: string[] = []

    // Framework-specific recommendations
    switch (server.type) {
      case 'react':
        recommendations.push('Install React DevTools browser extension for debugging')
        recommendations.push('Use PropTypes or TypeScript for better development experience')
        recommendations.push('Configure ESLint and Prettier for code quality')
        break
        
      case 'nextjs':
        recommendations.push('Explore the pages directory structure for file-based routing')
        recommendations.push('Use Next.js Image component for optimized image loading')
        recommendations.push('Consider using getServerSideProps or getStaticProps for data fetching')
        break
        
      case 'flask':
        recommendations.push('Use virtual environments to manage Python dependencies')
        recommendations.push('Implement proper error handling with try-catch blocks')
        recommendations.push('Consider using Flask-SQLAlchemy for database operations')
        break
        
      case 'fastapi':
        recommendations.push('Leverage Pydantic models for request/response validation')
        recommendations.push('Use dependency injection for better code organization')
        recommendations.push('Implement authentication with FastAPI security utilities')
        break
    }

    // General development recommendations
    recommendations.push('Set up version control with Git for your project')
    recommendations.push('Create comprehensive README.md with setup instructions')
    recommendations.push('Implement logging for better debugging and monitoring')

    return recommendations
  }

  /**
   * Get educational context for server framework
   */
  private getEducationalContext(framework: ServerFramework): ServerEducation {
    const contexts: Record<ServerFramework, ServerEducation> = {
      react: {
        framework: 'React',
        purpose: 'Build interactive user interfaces with component-based architecture',
        commonPorts: [3000, 3001, 3002],
        configFiles: ['package.json', 'public/index.html', 'src/index.js'],
        buildProcess: 'Webpack bundles JavaScript, CSS, and assets into optimized files',
        deploymentTips: [
          'Run npm run build to create production bundle',
          'Serve build folder with static file server',
          'Configure environment variables for different environments'
        ],
        troubleshooting: [
          {
            issue: 'Module not found errors',
            symptoms: ['Import/export errors', 'Cannot resolve module'],
            solution: 'Check file paths and ensure modules are installed',
            prevention: 'Use absolute imports and proper file organization',
            relatedIssues: ['dependency-issues', 'path-resolution'],
            difficulty: 'easy'
          },
          {
            issue: 'Hot reload not working',
            symptoms: ['Changes not reflected', 'Manual refresh required'],
            solution: 'Restart development server or check Fast Refresh configuration',
            prevention: 'Avoid anonymous arrow functions in components',
            relatedIssues: ['development-workflow'],
            difficulty: 'medium'
          }
        ],
        bestPractices: [
          {
            category: 'development',
            title: 'Component Organization',
            description: 'Structure components in logical folders with clear naming',
            implementation: 'Create components, hooks, and utils directories',
            impact: 'high',
            examples: ['src/components/Button/Button.jsx', 'src/hooks/useAuth.js']
          },
          {
            category: 'performance',
            title: 'Code Splitting',
            description: 'Use React.lazy and Suspense for component-level code splitting',
            implementation: 'const Component = React.lazy(() => import("./Component"))',
            impact: 'high',
            examples: ['Route-based splitting', 'Feature-based splitting']
          }
        ],
        securityTips: [
          {
            title: 'Prevent XSS Attacks',
            description: 'Sanitize user input and use JSX auto-escaping',
            implementation: 'Avoid dangerouslySetInnerHTML with user content',
            riskLevel: 'high',
            compliance: ['OWASP', 'Security Best Practices']
          }
        ]
      },
      
      nextjs: {
        framework: 'Next.js',
        purpose: 'Full-stack React framework with server-side rendering and API routes',
        commonPorts: [3000, 3001],
        configFiles: ['next.config.js', 'package.json', 'pages/_app.js'],
        buildProcess: 'Next.js optimizes pages, API routes, and static assets automatically',
        deploymentTips: [
          'Use npm run build for production optimization',
          'Deploy to Vercel for optimal Next.js hosting',
          'Configure environment variables in .env.local'
        ],
        troubleshooting: [
          {
            issue: 'Hydration mismatches',
            symptoms: ['Console warnings', 'Content flashing'],
            solution: 'Ensure server and client render the same content',
            prevention: 'Use useEffect for client-only code',
            relatedIssues: ['ssr-issues', 'client-server-mismatch'],
            difficulty: 'medium'
          }
        ],
        bestPractices: [
          {
            category: 'performance',
            title: 'Image Optimization',
            description: 'Use Next.js Image component for automatic optimization',
            implementation: 'import Image from "next/image"',
            impact: 'high',
            examples: ['<Image src="/photo.jpg" width={500} height={300} />']
          }
        ],
        securityTips: [
          {
            title: 'API Route Security',
            description: 'Validate and sanitize API route inputs',
            implementation: 'Use middleware for authentication and validation',
            riskLevel: 'high',
            compliance: ['API Security', 'OWASP API Top 10']
          }
        ]
      },

      flask: {
        framework: 'Flask',
        purpose: 'Lightweight Python web framework for building web applications and APIs',
        commonPorts: [5000, 8000, 8080],
        configFiles: ['app.py', 'requirements.txt', 'config.py'],
        buildProcess: 'Python bytecode compilation and template rendering',
        deploymentTips: [
          'Use Gunicorn or uWSGI for production deployment',
          'Set FLASK_ENV=production for production settings',
          'Configure proper logging and error handling'
        ],
        troubleshooting: [
          {
            issue: 'Import errors',
            symptoms: ['ModuleNotFoundError', 'Import failures'],
            solution: 'Check Python path and virtual environment activation',
            prevention: 'Use virtual environments and requirements.txt',
            relatedIssues: ['python-path', 'dependencies'],
            difficulty: 'easy'
          }
        ],
        bestPractices: [
          {
            category: 'development',
            title: 'Blueprint Organization',
            description: 'Use Flask blueprints to organize large applications',
            implementation: 'Create modular blueprints for different features',
            impact: 'high',
            examples: ['auth_bp = Blueprint("auth", __name__)']
          }
        ],
        securityTips: [
          {
            title: 'SQL Injection Prevention',
            description: 'Use parameterized queries or ORM to prevent SQL injection',
            implementation: 'Use SQLAlchemy or parameterized raw queries',
            riskLevel: 'critical',
            compliance: ['OWASP Top 10', 'SQL Security']
          }
        ]
      },

      // Add other frameworks...
      vue: {
        framework: 'Vue.js',
        purpose: 'Progressive JavaScript framework for building user interfaces',
        commonPorts: [8080, 3000],
        configFiles: ['vue.config.js', 'package.json'],
        buildProcess: 'Vue CLI builds components and assets using Webpack',
        deploymentTips: ['Run npm run build', 'Configure publicPath for subdirectories'],
        troubleshooting: [],
        bestPractices: [],
        securityTips: []
      },

      angular: {
        framework: 'Angular',
        purpose: 'Full-featured TypeScript framework for building scalable web applications',
        commonPorts: [4200, 4201],
        configFiles: ['angular.json', 'package.json', 'src/main.ts'],
        buildProcess: 'Angular CLI compiles TypeScript and optimizes bundles',
        deploymentTips: ['Use ng build --prod', 'Configure base-href for deployment'],
        troubleshooting: [],
        bestPractices: [],
        securityTips: []
      },

      // Simplified entries for other frameworks
      svelte: { framework: 'Svelte', purpose: 'Compile-time optimized framework', commonPorts: [5173], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      fastapi: { framework: 'FastAPI', purpose: 'High-performance Python API framework', commonPorts: [8000], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      django: { framework: 'Django', purpose: 'Full-featured Python web framework', commonPorts: [8000], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      express: { framework: 'Express.js', purpose: 'Minimal Node.js web framework', commonPorts: [3000], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      nodejs: { framework: 'Node.js', purpose: 'JavaScript runtime for server-side applications', commonPorts: [3000], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      static: { framework: 'Static Server', purpose: 'Serve static HTML, CSS, and JavaScript files', commonPorts: [8080], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      'webpack-dev': { framework: 'Webpack Dev Server', purpose: 'Development server with hot reloading', commonPorts: [8080], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      vite: { framework: 'Vite', purpose: 'Fast build tool and development server', commonPorts: [5173], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      parcel: { framework: 'Parcel', purpose: 'Zero-configuration build tool', commonPorts: [1234], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] },
      custom: { framework: 'Custom', purpose: 'Custom development setup', commonPorts: [], configFiles: [], buildProcess: '', deploymentTips: [], troubleshooting: [], bestPractices: [], securityTips: [] }
    }

    return contexts[framework] || contexts.custom
  }

  /**
   * Initialize server metrics
   */
  private initializeMetrics(): ServiceMetrics {
    return {
      startTime: new Date(),
      uptime: 0,
      requestCount: 0,
      errorCount: 0,
      successRate: 100,
      memoryUsage: 0,
      cpuUsage: 0,
      buildTime: 0,
      performanceScore: 100
    }
  }

  /**
   * Stop server process
   */
  private async stopServerProcess(serverId: string): Promise<void> {
    // In a real implementation, this would kill the actual process
    // For now, we'll simulate the stop
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.addLog(serverId, 'info', 'Process terminated')
  }

  /**
   * Add log entry to server
   */
  private addLog(serverId: string, level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    const log: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      source: 'server-manager',
      serviceId: serverId,
      category: 'system'
    }

    const server = this.servers.get(serverId)
    if (server) {
      server.logs.push(log)
      
      // Keep only last 100 logs per server
      if (server.logs.length > 100) {
        server.logs = server.logs.slice(-100)
      }
    }

    // Also store in log streams
    const logs = this.logStreams.get(serverId) || []
    logs.push(log)
    if (logs.length > 500) {
      logs.splice(0, logs.length - 500)
    }
    this.logStreams.set(serverId, logs)
  }

  /**
   * Get all servers
   */
  getAllServers(): Map<string, DevelopmentServer> {
    return new Map(this.servers)
  }

  /**
   * Get server by ID
   */
  getServer(serverId: string): DevelopmentServer | undefined {
    return this.servers.get(serverId)
  }

  /**
   * Get servers by framework
   */
  getServersByFramework(framework: ServerFramework): DevelopmentServer[] {
    return Array.from(this.servers.values()).filter(server => server.type === framework)
  }

  /**
   * Get running servers
   */
  getRunningServers(): DevelopmentServer[] {
    return Array.from(this.servers.values()).filter(server => server.status === 'running')
  }

  /**
   * Update server metrics (called periodically)
   */
  updateServerMetrics(serverId: string): void {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'running') return

    // Update uptime
    server.metrics.uptime = Date.now() - server.metrics.startTime.getTime()

    // Simulate some metrics updates
    if (Math.random() > 0.8) {
      server.metrics.requestCount += Math.floor(Math.random() * 5) + 1
    }

    // Simulate occasional errors
    if (Math.random() > 0.95) {
      server.metrics.errorCount += 1
    }

    // Calculate success rate
    if (server.metrics.requestCount > 0) {
      server.metrics.successRate = 
        ((server.metrics.requestCount - server.metrics.errorCount) / server.metrics.requestCount) * 100
    }

    // Simulate resource usage
    server.metrics.memoryUsage = Math.floor(Math.random() * 200) + 50 // MB
    server.metrics.cpuUsage = Math.floor(Math.random() * 30) + 5 // %
  }

  /**
   * Remove a server completely
   */
  async removeServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId)
    if (!server) return

    // Stop server if running
    if (server.status === 'running') {
      await this.stopServer(serverId)
    }

    // Clean up
    this.servers.delete(serverId)
    this.logStreams.delete(serverId)
    this.serverProcesses.delete(serverId)
  }

  /**
   * Get server logs
   */
  getServerLogs(serverId: string, limit: number = 50): LogEntry[] {
    const logs = this.logStreams.get(serverId) || []
    return logs.slice(-limit)
  }
}