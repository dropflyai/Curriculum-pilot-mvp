// Claude MCP Integration - Connect User's Claude Subscription to Agent Academy IDE
// Implements MCP (Model Context Protocol) with Claude subscription for seamless AI assistance

import { claudeOAuth, type OAuthError, isOAuthError } from './claude-oauth-client'
import { mcpServer, type MCPTool, type MCPResource, type MCPPrompt } from './mcp-integration'

interface ClaudeSession {
  sessionId: string
  startTime: Date
  messagesUsed: number
  tokensUsed: number
  model: 'claude-3-sonnet' | 'claude-3-opus' | 'claude-3-haiku'
  context: AgentAcademyContext
}

interface AgentAcademyContext {
  currentLesson?: {
    id: string
    title: string
    objective: string
    operation: string
  }
  studentProgress: {
    level: number
    xp: number
    completedOperations: string[]
  }
  currentCode: string
  recentErrors: string[]
  hints: string[]
  sessionNotes: string[]
}

interface ClaudeResponse {
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  sessionId: string
  timestamp: Date
}

interface UsageMetrics {
  totalSessions: number
  totalMessages: number
  totalTokens: number
  modelBreakdown: Record<string, number>
  monthlyUsage: number
  remainingUsage?: number
  resetDate?: Date
}

export class ClaudeMCPIntegration {
  private currentSession: ClaudeSession | null = null
  private sessionHistory: ClaudeSession[] = []
  private usageMetrics: UsageMetrics = {
    totalSessions: 0,
    totalMessages: 0,
    totalTokens: 0,
    modelBreakdown: {},
    monthlyUsage: 0
  }

  constructor() {
    this.initializeMCPTools()
    this.loadUsageMetrics()
  }

  // Initialize Claude-specific MCP tools
  private initializeMCPTools(): void {
    const claudeTools: MCPTool[] = [
      {
        name: 'claude_chat',
        description: 'Send message to Claude using user subscription with Agent Academy context',
        parameters: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message to send to Claude'
            },
            model: {
              type: 'string',
              enum: ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
              description: 'Claude model to use (based on subscription)'
            },
            includeContext: {
              type: 'boolean',
              description: 'Include Agent Academy lesson context',
              default: true
            },
            temperature: {
              type: 'number',
              description: 'Response creativity (0-1)',
              default: 0.7
            }
          },
          required: ['message']
        },
        handler: async (params) => this.sendClaudeMessage(params)
      },
      {
        name: 'claude_code_review',
        description: 'Get code review from Claude with Agent Academy context',
        parameters: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to review'
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'python'
            },
            focus: {
              type: 'string',
              enum: ['beginner', 'security', 'performance', 'style', 'ai-agents'],
              description: 'Review focus area'
            }
          },
          required: ['code']
        },
        handler: async (params) => this.getCodeReview(params)
      },
      {
        name: 'claude_debug_help',
        description: 'Get debugging help from Claude for coding issues',
        parameters: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code with issues'
            },
            error: {
              type: 'string',
              description: 'Error message received'
            },
            context: {
              type: 'string',
              description: 'Additional context about what you were trying to do'
            }
          },
          required: ['code', 'error']
        },
        handler: async (params) => this.getDebugHelp(params)
      },
      {
        name: 'claude_lesson_help',
        description: 'Get educational help from Claude for current lesson',
        parameters: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Question about the lesson or concept'
            },
            difficulty: {
              type: 'string',
              enum: ['confused', 'stuck', 'want-deeper'],
              description: 'Type of help needed'
            }
          },
          required: ['question']
        },
        handler: async (params) => this.getLessonHelp(params)
      },
      {
        name: 'claude_generate_code',
        description: 'Generate code with Claude for specific Agent Academy tasks',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'What code to generate'
            },
            language: {
              type: 'string',
              description: 'Programming language',
              default: 'python'
            },
            style: {
              type: 'string',
              enum: ['educational', 'production', 'beginner-friendly'],
              description: 'Code style preference',
              default: 'educational'
            },
            include_tests: {
              type: 'boolean',
              description: 'Include test cases',
              default: false
            }
          },
          required: ['prompt']
        },
        handler: async (params) => this.generateCode(params)
      },
      {
        name: 'claude_session_summary',
        description: 'Get summary of current learning session from Claude',
        parameters: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['brief', 'detailed', 'action-items'],
              description: 'Summary format',
              default: 'brief'
            }
          }
        },
        handler: async (params) => this.getSessionSummary(params)
      }
    ]

    // Register tools with MCP server
    claudeTools.forEach(tool => {
      mcpServer.registerTool(tool)
    })
  }

  // Start new Claude session with Agent Academy context
  async startSession(context: AgentAcademyContext): Promise<string> {
    if (!await claudeOAuth.isAuthenticated()) {
      throw new Error('Claude authentication required. Please login with your Claude subscription.')
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.currentSession = {
      sessionId,
      startTime: new Date(),
      messagesUsed: 0,
      tokensUsed: 0,
      model: await this.selectOptimalModel(),
      context
    }

    // Update usage metrics
    this.usageMetrics.totalSessions++
    this.saveUsageMetrics()

    console.log(`🤖 Claude MCP session started: ${sessionId}`)
    console.log(`📚 Context: ${context.currentLesson?.title || 'General coding'}`)
    
    return sessionId
  }

  // Send message to Claude with Agent Academy context
  async sendClaudeMessage(params: {
    message: string
    model?: string
    includeContext?: boolean
    temperature?: number
  }): Promise<ClaudeResponse> {
    if (!this.currentSession) {
      throw new Error('No active Claude session. Please start a session first.')
    }

    try {
      const model = params.model || this.currentSession.model
      const contextPrompt = params.includeContext !== false 
        ? this.buildContextPrompt() 
        : ''

      const fullPrompt = this.buildAgentAcademyPrompt(params.message, contextPrompt)

      const response = await claudeOAuth.sendMessage(fullPrompt, {
        model,
        temperature: params.temperature || 0.7,
        max_tokens: 4096
      })

      // Update session metrics
      this.currentSession.messagesUsed++
      this.currentSession.tokensUsed += response.usage?.total_tokens || 0
      this.usageMetrics.totalMessages++
      this.usageMetrics.totalTokens += response.usage?.total_tokens || 0
      this.usageMetrics.modelBreakdown[model] = (this.usageMetrics.modelBreakdown[model] || 0) + 1

      const claudeResponse: ClaudeResponse = {
        content: response.content?.[0]?.text || response.content || 'No response received',
        model,
        usage: {
          inputTokens: response.usage?.input_tokens || 0,
          outputTokens: response.usage?.output_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        sessionId: this.currentSession.sessionId,
        timestamp: new Date()
      }

      this.saveUsageMetrics()
      return claudeResponse

    } catch (error) {
      console.error('Claude MCP message error:', error)
      
      if (isOAuthError(error)) {
        throw new Error(`Authentication error: ${error.userMessage}`)
      }
      
      throw new Error(`Claude request failed: ${error}`)
    }
  }

  // Get code review from Claude
  async getCodeReview(params: {
    code: string
    language?: string
    focus?: string
  }): Promise<ClaudeResponse> {
    const reviewPrompt = `Please review this ${params.language || 'Python'} code for an Agent Academy student.

Focus area: ${params.focus || 'general improvement'}

Code to review:
\`\`\`${params.language || 'python'}
${params.code}
\`\`\`

Please provide:
1. **Correctness**: Any bugs or logic errors
2. **Style**: Code formatting and best practices
3. **Learning**: Educational feedback for a coding student
4. **Suggestions**: Specific improvements with examples
5. **Agent Academy Context**: How this relates to AI agent development

Keep feedback encouraging and educational!`

    return this.sendClaudeMessage({
      message: reviewPrompt,
      includeContext: true
    })
  }

  // Get debugging help from Claude
  async getDebugHelp(params: {
    code: string
    error: string
    context?: string
  }): Promise<ClaudeResponse> {
    const debugPrompt = `Help debug this code for an Agent Academy student:

**Code:**
\`\`\`python
${params.code}
\`\`\`

**Error Message:**
${params.error}

${params.context ? `**What they were trying to do:**\n${params.context}\n\n` : ''}

Please provide:
1. **Root Cause**: What's causing this error in simple terms
2. **Fix**: Exact code changes needed
3. **Explanation**: Why this error happened (educational)
4. **Prevention**: How to avoid similar errors in the future
5. **Testing**: How to verify the fix works

Format your response for a coding student learning AI agent development.`

    return this.sendClaudeMessage({
      message: debugPrompt,
      includeContext: true
    })
  }

  // Get educational help for current lesson
  async getLessonHelp(params: {
    question: string
    difficulty?: string
  }): Promise<ClaudeResponse> {
    const context = this.currentSession?.context
    const lesson = context?.currentLesson

    const helpPrompt = `An Agent Academy student needs help with their current lesson.

**Current Lesson**: ${lesson?.title || 'Python Programming'}
**Objective**: ${lesson?.objective || 'Learning to code'}
**Student Level**: Level ${context?.studentProgress?.level || 1} (${context?.studentProgress?.xp || 0} XP)
**Help Type**: ${params.difficulty || 'general question'}

**Student Question**: ${params.question}

${context?.currentCode ? `**Their Current Code**:
\`\`\`python
${context.currentCode.slice(0, 500)}${context.currentCode.length > 500 ? '...' : ''}
\`\`\`` : ''}

Please provide helpful guidance that:
- Answers their specific question clearly
- Relates to their current lesson objective
- Matches their skill level (don't overwhelm beginners)
- Encourages continued learning
- Uses spy/agent terminology when appropriate (they're "agents" learning AI development)

Be supportive and educational!`

    return this.sendClaudeMessage({
      message: helpPrompt,
      includeContext: true
    })
  }

  // Generate code with Claude
  async generateCode(params: {
    prompt: string
    language?: string
    style?: string
    include_tests?: boolean
  }): Promise<ClaudeResponse> {
    const codePrompt = `Generate ${params.language || 'Python'} code for an Agent Academy student.

**Request**: ${params.prompt}
**Style**: ${params.style || 'educational'} (prioritize learning and clarity)
**Include Tests**: ${params.include_tests ? 'Yes' : 'No'}

Please provide:
1. **Clean Code**: Well-commented, readable code
2. **Explanation**: Brief explanation of how it works
3. **Agent Academy Context**: How this relates to AI agent development
4. **Usage Example**: Simple example of how to use it
${params.include_tests ? '5. **Tests**: Basic test cases to verify it works' : ''}

Make it educational and appropriate for students learning AI agent development!`

    return this.sendClaudeMessage({
      message: codePrompt,
      includeContext: true
    })
  }

  // Get session summary from Claude
  async getSessionSummary(params: { format?: string }): Promise<ClaudeResponse> {
    if (!this.currentSession) {
      throw new Error('No active session to summarize')
    }

    const session = this.currentSession
    const context = session.context

    const summaryPrompt = `Please summarize this Agent Academy learning session.

**Session Info**:
- Started: ${session.startTime.toLocaleTimeString()}
- Messages: ${session.messagesUsed}
- Tokens Used: ${session.tokensUsed}
- Current Lesson: ${context.currentLesson?.title || 'General coding'}

**Student Progress**:
- Level: ${context.studentProgress.level} (${context.studentProgress.xp} XP)
- Completed Operations: ${context.studentProgress.completedOperations.length}

**Session Activity**:
- Recent errors encountered: ${context.recentErrors.length}
- Hints used: ${context.hints.length}
- Code worked on: ${context.currentCode ? 'Yes' : 'No'}

Format: ${params.format || 'brief'}

Please provide a ${params.format === 'detailed' ? 'comprehensive' : params.format === 'action-items' ? 'actionable task list' : 'brief'} summary of:
- What the student accomplished
- Key concepts learned
- Areas for improvement
- Recommended next steps
- Overall progress assessment

Keep it encouraging and focused on learning objectives!`

    return this.sendClaudeMessage({
      message: summaryPrompt,
      includeContext: false // Summary should be based on the prompt content
    })
  }

  // Build Agent Academy specific prompt context
  private buildContextPrompt(): string {
    if (!this.currentSession?.context) return ''

    const context = this.currentSession.context
    const lesson = context.currentLesson

    return `
**AGENT ACADEMY CONTEXT**:
- Student is Agent Level ${context.studentProgress.level} with ${context.studentProgress.xp} XP
- Current Mission: ${lesson?.title || 'General Training'}
- Operation: ${lesson?.operation || 'Basic Training'}  
- Lesson Objective: ${lesson?.objective || 'Learn programming fundamentals'}
- Completed Operations: ${context.studentProgress.completedOperations.join(', ') || 'None yet'}

**CURRENT SESSION**:
- Recent errors: ${context.recentErrors.slice(-3).join('; ') || 'None'}
- Hints provided: ${context.hints.slice(-3).join('; ') || 'None'}
- Session notes: ${context.sessionNotes.slice(-3).join('; ') || 'None'}

**CODING CONTEXT**:
${context.currentCode ? `Current code (first 300 chars): ${context.currentCode.slice(0, 300)}${context.currentCode.length > 300 ? '...' : ''}` : 'No code currently loaded'}

Remember: You're Dr. Maya, an AI development mentor at Agent Academy. Use spy/agent terminology and keep responses educational but engaging for coding students learning AI agent development.`
  }

  // Build complete prompt for Claude
  private buildAgentAcademyPrompt(userMessage: string, contextPrompt: string): string {
    const systemPrompt = `You are Dr. Maya, a brilliant AI development mentor at Agent Academy. You help students (called "agents") learn to build intelligent AI agents using Python and modern AI technologies.

Your personality:
- Encouraging and supportive, but technically precise
- Expert in AI/ML, Python, and agent development  
- Uses spy/agent terminology (students are "agents", projects are "missions")
- Focused on practical AI agent development and real-world applications

Your expertise includes:
- Python programming fundamentals for AI development
- AI agent architecture and design patterns
- Code debugging and optimization with educational focus
- Project planning and development strategy
- Educational guidance that matches student skill levels

Guidelines:
- Keep responses helpful and educational
- Use code examples when appropriate
- Explain concepts clearly for the student's level
- Be encouraging and supportive of learning
- Focus on practical skills for AI agent development`

    return `${systemPrompt}

${contextPrompt}

**STUDENT MESSAGE**: ${userMessage}`
  }

  // Select optimal Claude model based on subscription and task
  private async selectOptimalModel(): Promise<'claude-3-sonnet' | 'claude-3-opus' | 'claude-3-haiku'> {
    try {
      const userInfo = await claudeOAuth.getUserInfo()
      
      // For Max subscribers, prefer Opus for complex tasks, Sonnet for general use
      if (userInfo.plan === 'max') {
        return 'claude-3-sonnet' // Sonnet is good balance of capability and speed
      }
      
      // For Pro subscribers, use Sonnet
      if (userInfo.plan === 'pro') {
        return 'claude-3-sonnet'
      }
      
      // For free tier, use Haiku
      return 'claude-3-haiku'
    } catch (error) {
      console.warn('Could not determine subscription level, using Sonnet:', error)
      return 'claude-3-sonnet'
    }
  }

  // Update current session context
  updateContext(context: Partial<AgentAcademyContext>): void {
    if (this.currentSession) {
      this.currentSession.context = {
        ...this.currentSession.context,
        ...context
      }
    }
  }

  // Add session note
  addSessionNote(note: string): void {
    if (this.currentSession) {
      this.currentSession.context.sessionNotes.push(`${new Date().toLocaleTimeString()}: ${note}`)
    }
  }

  // Add error to context
  addError(error: string): void {
    if (this.currentSession) {
      this.currentSession.context.recentErrors.push(error)
      // Keep only last 5 errors
      if (this.currentSession.context.recentErrors.length > 5) {
        this.currentSession.context.recentErrors = this.currentSession.context.recentErrors.slice(-5)
      }
    }
  }

  // Add hint to context
  addHint(hint: string): void {
    if (this.currentSession) {
      this.currentSession.context.hints.push(hint)
    }
  }

  // End current session
  async endSession(): Promise<void> {
    if (this.currentSession) {
      const summary = await this.getSessionSummary({ format: 'brief' })
      
      // Archive session
      this.sessionHistory.push({
        ...this.currentSession,
        // Add session end time for history
        endTime: new Date()
      } as any)
      
      // Keep only last 10 sessions in memory
      if (this.sessionHistory.length > 10) {
        this.sessionHistory = this.sessionHistory.slice(-10)
      }
      
      console.log(`🏁 Claude MCP session ended: ${this.currentSession.sessionId}`)
      console.log(`📊 Session stats: ${this.currentSession.messagesUsed} messages, ${this.currentSession.tokensUsed} tokens`)
      
      this.currentSession = null
      this.saveUsageMetrics()
    }
  }

  // Get usage metrics
  getUsageMetrics(): UsageMetrics & { currentSession?: ClaudeSession } {
    return {
      ...this.usageMetrics,
      currentSession: this.currentSession || undefined
    }
  }

  // Get authentication status
  async getAuthStatus(): Promise<{
    isAuthenticated: boolean
    userInfo?: any
    error?: string
  }> {
    try {
      const isAuth = await claudeOAuth.isAuthenticated()
      if (!isAuth) {
        return { isAuthenticated: false }
      }

      const userInfo = await claudeOAuth.getUserInfo()
      return {
        isAuthenticated: true,
        userInfo: {
          email: userInfo.email,
          plan: userInfo.plan,
          usage: {
            remaining: userInfo.usageRemaining,
            limit: userInfo.usageLimit,
            resetTime: userInfo.resetTime
          }
        }
      }
    } catch (error) {
      return {
        isAuthenticated: false,
        error: isOAuthError(error) ? error.userMessage : 'Authentication check failed'
      }
    }
  }

  // Start OAuth flow
  async startOAuth(): Promise<string> {
    return claudeOAuth.startOAuthFlow()
  }

  // Handle OAuth callback
  async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      await claudeOAuth.handleOAuthCallback(code, state)
      return true
    } catch (error) {
      console.error('OAuth callback error:', error)
      return false
    }
  }

  // Logout
  async logout(): Promise<void> {
    await this.endSession()
    await claudeOAuth.logout()
    this.clearUsageMetrics()
  }

  // Save usage metrics to localStorage
  private saveUsageMetrics(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('claude_mcp_usage', JSON.stringify({
          ...this.usageMetrics,
          lastUpdated: new Date().toISOString()
        }))
      } catch (error) {
        console.warn('Failed to save usage metrics:', error)
      }
    }
  }

  // Load usage metrics from localStorage
  private loadUsageMetrics(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('claude_mcp_usage')
        if (stored) {
          const parsed = JSON.parse(stored)
          this.usageMetrics = {
            totalSessions: parsed.totalSessions || 0,
            totalMessages: parsed.totalMessages || 0,
            totalTokens: parsed.totalTokens || 0,
            modelBreakdown: parsed.modelBreakdown || {},
            monthlyUsage: parsed.monthlyUsage || 0,
            remainingUsage: parsed.remainingUsage,
            resetDate: parsed.resetDate ? new Date(parsed.resetDate) : undefined
          }
        }
      } catch (error) {
        console.warn('Failed to load usage metrics:', error)
      }
    }
  }

  // Clear usage metrics
  private clearUsageMetrics(): void {
    this.usageMetrics = {
      totalSessions: 0,
      totalMessages: 0,
      totalTokens: 0,
      modelBreakdown: {},
      monthlyUsage: 0
    }
    this.saveUsageMetrics()
  }
}

// Export singleton instance
export const claudeMCP = new ClaudeMCPIntegration()

// Export types for external use
export type { 
  ClaudeSession, 
  AgentAcademyContext, 
  ClaudeResponse, 
  UsageMetrics 
}