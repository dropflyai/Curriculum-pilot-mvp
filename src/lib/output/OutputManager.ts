// Enhanced Output Manager for Agent Academy IDE
// Core system for intelligent output management, educational analysis, and real-time streaming

import { EventEmitter } from 'events'
import {
  OutputChannel,
  OutputMessage,
  MessageLevel,
  OutputChannelType,
  OutputSource,
  OutputFilter,
  EducationalInsight,
  MessageMetadata,
  OutputManagerEvents,
  ConceptDatabase,
  PatternMatcher,
  MessageAnalysis,
  EducationalAnnotation
} from '../../types/output'
import { EducationalOutputAnalyzer } from './EducationalOutputAnalyzer'
import { OutputStreamer } from './OutputStreamer'
import { OutputFormatter } from './formatters/OutputFormatter'

export class OutputManager extends EventEmitter {
  private channels: Map<string, OutputChannel>
  private activeChannel: string
  private messageQueue: OutputMessage[]
  private educationalAnalyzer: EducationalOutputAnalyzer
  private outputStreamer: OutputStreamer
  private formatters: Map<string, OutputFormatter>
  private isProcessingQueue: boolean
  private queueProcessingInterval?: NodeJS.Timeout
  
  constructor() {
    super()
    this.channels = new Map()
    this.activeChannel = 'default'
    this.messageQueue = []
    this.educationalAnalyzer = new EducationalOutputAnalyzer()
    this.outputStreamer = new OutputStreamer(this)
    this.formatters = new Map()
    this.isProcessingQueue = false
    
    this.initializeDefaultChannels()
    this.startQueueProcessing()
  }
  
  /**
   * Initialize default output channels for common development workflows
   */
  private initializeDefaultChannels(): void {
    const defaultChannels: Partial<OutputChannel>[] = [
      {
        id: 'python-execution',
        name: 'Python Output',
        type: 'execution',
        source: 'python',
        maxMessages: 1000
      },
      {
        id: 'javascript-console',
        name: 'JavaScript Console',
        type: 'execution',
        source: 'javascript',
        maxMessages: 1000
      },
      {
        id: 'typescript-console',
        name: 'TypeScript Console', 
        type: 'execution',
        source: 'typescript',
        maxMessages: 1000
      },
      {
        id: 'build-output',
        name: 'Build & Compile',
        type: 'build',
        source: 'webpack',
        maxMessages: 500
      },
      {
        id: 'server-logs',
        name: 'Development Server',
        type: 'server',
        source: 'nextjs',
        maxMessages: 500
      },
      {
        id: 'test-runner',
        name: 'Test Results',
        type: 'test',
        source: 'jest',
        maxMessages: 200
      },
      {
        id: 'git-output',
        name: 'Git Operations',
        type: 'git',
        source: 'git',
        maxMessages: 100
      },
      {
        id: 'npm-output',
        name: 'Package Manager',
        type: 'npm',
        source: 'npm',
        maxMessages: 100
      },
      {
        id: 'maya-insights',
        name: 'Dr. Maya Insights',
        type: 'educational',
        source: 'maya-ai',
        maxMessages: 200
      },
      {
        id: 'debug-console',
        name: 'Debug Console',
        type: 'debug',
        source: 'system',
        maxMessages: 300
      }
    ]
    
    defaultChannels.forEach(config => {
      this.createChannel(config as OutputChannel)
    })
    
    // Set the first channel as active
    this.activeChannel = 'python-execution'
  }
  
  /**
   * Create a new output channel
   */
  createChannel(channelConfig: Partial<OutputChannel>): OutputChannel {
    const channel: OutputChannel = {
      id: channelConfig.id || this.generateChannelId(),
      name: channelConfig.name || 'New Channel',
      type: channelConfig.type || 'execution',
      source: channelConfig.source || 'system',
      messages: channelConfig.messages || [],
      isActive: channelConfig.isActive || false,
      autoScroll: channelConfig.autoScroll !== undefined ? channelConfig.autoScroll : true,
      filters: channelConfig.filters || [],
      educationalInsights: channelConfig.educationalInsights || [],
      maxMessages: channelConfig.maxMessages || 1000,
      retentionPeriod: channelConfig.retentionPeriod || 24 * 60 * 60 * 1000 // 24 hours
    }
    
    this.channels.set(channel.id, channel)
    this.emit('channel-created', channel)
    
    return channel
  }
  
  /**
   * Add a message to a specific channel with educational analysis
   */
  async addMessage(
    channelId: string, 
    messageConfig: Omit<OutputMessage, 'id' | 'timestamp'>
  ): Promise<OutputMessage> {
    const channel = this.channels.get(channelId)
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`)
    }
    
    const message: OutputMessage = {
      ...messageConfig,
      id: this.generateMessageId(),
      timestamp: new Date()
    }
    
    // Add to processing queue for educational analysis
    this.messageQueue.push(message)
    
    // Add directly to channel for immediate display
    this.addMessageToChannel(channel, message)
    
    return message
  }
  
  /**
   * Add message directly to channel and emit events
   */
  private addMessageToChannel(channel: OutputChannel, message: OutputMessage): void {
    // Enforce message limits
    if (channel.maxMessages && channel.messages.length >= channel.maxMessages) {
      channel.messages = channel.messages.slice(-(channel.maxMessages - 1))
    }
    
    channel.messages.push(message)
    this.emit('message-added', channel.id, message)
    
    // Check for immediate patterns
    this.checkImediatePatterns(message)
  }
  
  /**
   * Process message queue for educational analysis
   */
  private startQueueProcessing(): void {
    this.queueProcessingInterval = setInterval(async () => {
      if (this.isProcessingQueue || this.messageQueue.length === 0) {
        return
      }
      
      this.isProcessingQueue = true
      
      try {
        const message = this.messageQueue.shift()
        if (message) {
          await this.processMessageEducationally(message)
        }
      } catch (error) {
        console.error('Error processing message queue:', error)
      } finally {
        this.isProcessingQueue = false
      }
    }, 100) // Process queue every 100ms
  }
  
  /**
   * Process message for educational insights
   */
  private async processMessageEducationally(message: OutputMessage): Promise<void> {
    try {
      // Add educational analysis if it's an error or warning
      if (message.level === 'error' || message.level === 'warn') {
        const educationalValue = await this.educationalAnalyzer.analyzeMessage(message)
        if (educationalValue) {
          message.educationalValue = educationalValue
          
          // Update the message in the channel
          const channel = this.channels.get(message.channel)
          if (channel) {
            const messageIndex = channel.messages.findIndex(m => m.id === message.id)
            if (messageIndex !== -1) {
              channel.messages[messageIndex] = message
            }
          }
        }
      }
      
      // Generate educational insights for execution patterns
      if (this.shouldGenerateInsight(message)) {
        setTimeout(() => this.generateEducationalInsight(message), 1500)
      }
      
    } catch (error) {
      console.error('Error in educational processing:', error)
    }
  }
  
  /**
   * Check for immediate patterns that need quick response
   */
  private checkImediatePatterns(message: OutputMessage): void {
    // Check for critical errors that need immediate attention
    const criticalPatterns = [
      /syntax\s*error/i,
      /module\s+not\s+found/i,
      /cannot\s+import/i,
      /reference\s*error/i,
      /type\s*error/i
    ]
    
    const isCritical = criticalPatterns.some(pattern => pattern.test(message.content))
    
    if (isCritical && message.level === 'error') {
      this.emit('error-pattern-detected', message, 'critical')
      
      // Generate quick help suggestion
      setTimeout(async () => {
        const insight = await this.educationalAnalyzer.generateQuickHelp(message)
        if (insight) {
          this.addQuickInsight(message.channel, insight)
        }
      }, 500)
    }
  }
  
  /**
   * Determine if a message should trigger educational insight generation
   */
  private shouldGenerateInsight(message: OutputMessage): boolean {
    // Generate insights for:
    // 1. Successful execution after errors
    // 2. First time seeing certain patterns
    // 3. Educational-worthy warnings
    
    if (message.level === 'success' && message.source === 'python') return true
    if (message.level === 'success' && message.source === 'javascript') return true
    if (message.level === 'info' && message.content.includes('test')) return true
    if (message.level === 'warn' && message.educationalValue) return true
    
    return false
  }
  
  /**
   * Generate educational insight for a message
   */
  private async generateEducationalInsight(message: OutputMessage): Promise<void> {
    try {
      const insight = await this.educationalAnalyzer.generateInsight(message)
      
      if (insight) {
        const channel = this.channels.get(message.channel)
        if (channel) {
          channel.educationalInsights.push(insight)
          this.emit('insight-generated', message.channel, insight)
          
          // Also add as a message to the Maya insights channel
          await this.addMessage('maya-insights', {
            level: 'educational',
            source: 'maya-ai',
            channel: 'maya-insights',
            content: insight.explanation,
            educationalValue: {
              concept: insight.concept,
              explanation: insight.detailedExplanation,
              learningObjective: insight.learningObjective,
              difficulty: insight.difficulty,
              relatedTopics: insight.relatedTopics,
              suggestedActions: insight.suggestedActions
            }
          })
        }
      }
    } catch (error) {
      console.error('Error generating educational insight:', error)
    }
  }
  
  /**
   * Add quick insight for immediate help
   */
  private async addQuickInsight(channelId: string, insight: EducationalAnnotation): Promise<void> {
    await this.addMessage(channelId, {
      level: 'educational',
      source: 'maya-ai',
      channel: channelId,
      content: `💡 Quick Help: ${insight.explanation}`,
      educationalValue: insight
    })
  }
  
  /**
   * Get a specific channel
   */
  getChannel(channelId: string): OutputChannel | undefined {
    return this.channels.get(channelId)
  }
  
  /**
   * Get all channels
   */
  getAllChannels(): OutputChannel[] {
    return Array.from(this.channels.values())
  }
  
  /**
   * Set active channel
   */
  setActiveChannel(channelId: string): void {
    if (this.channels.has(channelId)) {
      this.activeChannel = channelId
    }
  }
  
  /**
   * Get active channel
   */
  getActiveChannel(): OutputChannel | undefined {
    return this.channels.get(this.activeChannel)
  }
  
  /**
   * Apply filter to a channel
   */
  applyFilter(channelId: string, filter: OutputFilter): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      const existingFilterIndex = channel.filters.findIndex(f => f.id === filter.id)
      
      if (existingFilterIndex !== -1) {
        channel.filters[existingFilterIndex] = filter
      } else {
        channel.filters.push(filter)
      }
      
      this.emit('filter-applied', channelId, filter.id)
    }
  }
  
  /**
   * Remove filter from channel
   */
  removeFilter(channelId: string, filterId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.filters = channel.filters.filter(f => f.id !== filterId)
    }
  }
  
  /**
   * Get filtered messages for a channel
   */
  getFilteredMessages(channelId: string): OutputMessage[] {
    const channel = this.channels.get(channelId)
    if (!channel) return []
    
    let messages = [...channel.messages]
    
    // Apply each enabled filter
    for (const filter of channel.filters.filter(f => f.enabled)) {
      messages = this.applyMessageFilter(messages, filter)
    }
    
    return messages
  }
  
  /**
   * Apply a single filter to messages
   */
  private applyMessageFilter(messages: OutputMessage[], filter: OutputFilter): OutputMessage[] {
    switch (filter.type) {
      case 'level':
        if (filter.value === 'all') return messages
        return messages.filter(m => m.level === filter.value)
      
      case 'source':
        if (filter.value === 'all') return messages
        return messages.filter(m => m.source === filter.value)
      
      case 'content':
        if (!filter.value) return messages
        if (filter.regex) {
          const regex = new RegExp(filter.value, 'i')
          return messages.filter(m => regex.test(m.content))
        }
        return messages.filter(m => 
          m.content.toLowerCase().includes(filter.value.toLowerCase())
        )
      
      case 'time':
        const timeRange = filter.value as { start: Date; end: Date }
        return messages.filter(m => 
          m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
        )
      
      case 'educational':
        return messages.filter(m => m.educationalValue !== undefined)
      
      default:
        return messages
    }
  }
  
  /**
   * Clear all messages from a channel
   */
  clearChannel(channelId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.messages = []
      channel.educationalInsights = []
    }
  }
  
  /**
   * Remove a channel
   */
  removeChannel(channelId: string): void {
    if (this.channels.delete(channelId)) {
      this.emit('channel-removed', channelId)
      
      // Switch to another channel if this was active
      if (this.activeChannel === channelId) {
        const remainingChannels = Array.from(this.channels.keys())
        this.activeChannel = remainingChannels[0] || 'default'
      }
    }
  }
  
  /**
   * Get output streamer for real-time streaming
   */
  getStreamer(): OutputStreamer {
    return this.outputStreamer
  }
  
  /**
   * Register an output formatter
   */
  registerFormatter(source: string, formatter: OutputFormatter): void {
    this.formatters.set(source, formatter)
  }
  
  /**
   * Get formatter for a source
   */
  getFormatter(source: string): OutputFormatter | undefined {
    return this.formatters.get(source)
  }
  
  /**
   * Generate unique channel ID
   */
  private generateChannelId(): string {
    return `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval)
    }
    this.outputStreamer.destroy()
    this.channels.clear()
    this.messageQueue = []
    this.removeAllListeners()
  }
  
  /**
   * Get channel statistics
   */
  getChannelStats(channelId: string): {
    messageCount: number
    errorCount: number
    warningCount: number
    successCount: number
    educationalCount: number
    lastActivity: Date | null
  } {
    const channel = this.channels.get(channelId)
    if (!channel) {
      return {
        messageCount: 0,
        errorCount: 0,
        warningCount: 0,
        successCount: 0,
        educationalCount: 0,
        lastActivity: null
      }
    }
    
    const messages = channel.messages
    
    return {
      messageCount: messages.length,
      errorCount: messages.filter(m => m.level === 'error').length,
      warningCount: messages.filter(m => m.level === 'warn').length,
      successCount: messages.filter(m => m.level === 'success').length,
      educationalCount: messages.filter(m => m.educationalValue).length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    }
  }
}

// Singleton instance for global access
export const outputManager = new OutputManager()