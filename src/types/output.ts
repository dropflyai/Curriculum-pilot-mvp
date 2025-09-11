// Enhanced Output System Types for Agent Academy IDE
// Comprehensive type definitions for intelligent output management

export type OutputChannelType = 'execution' | 'build' | 'debug' | 'server' | 'test' | 'git' | 'npm' | 'educational'
export type OutputSource = 'python' | 'javascript' | 'typescript' | 'react' | 'nextjs' | 'webpack' | 'system' | 'maya-ai' | 'jest' | 'git' | 'npm'
export type MessageLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'success' | 'educational'
export type EducationalDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface OutputMessage {
  id: string
  timestamp: Date
  level: MessageLevel
  source: OutputSource
  channel: string
  content: string
  metadata?: MessageMetadata
  educationalValue?: EducationalAnnotation
  stackTrace?: StackTraceInfo[]
  relatedFiles?: string[]
  formatted?: FormattedMessage
}

export interface MessageMetadata {
  processId?: number
  threadId?: string
  userId?: string
  sessionId: string
  tags: string[]
  duration?: number
  memoryUsage?: number
  lineNumber?: number
  columnNumber?: number
  fileName?: string
}

export interface EducationalAnnotation {
  concept: string
  explanation: string
  learningObjective: string
  difficulty: EducationalDifficulty
  relatedTopics: string[]
  suggestedActions: string[]
  commonMistake?: boolean
  helpfulResources?: string[]
  codeExamples?: CodeExample[]
}

export interface CodeExample {
  title: string
  code: string
  language: string
  explanation: string
}

export interface StackTraceInfo {
  file: string
  line: number
  column?: number
  functionName?: string
  context?: string[]
}

export interface OutputChannel {
  id: string
  name: string
  type: OutputChannelType
  source: OutputSource
  messages: OutputMessage[]
  isActive: boolean
  autoScroll: boolean
  filters: OutputFilter[]
  educationalInsights: EducationalInsight[]
  maxMessages?: number
  retentionPeriod?: number
}

export interface OutputFilter {
  id: string
  name: string
  type: 'level' | 'source' | 'time' | 'content' | 'educational'
  value: any
  enabled: boolean
  regex?: boolean
}

export interface EducationalInsight {
  id: string
  concept: string
  explanation: string
  detailedExplanation: string
  learningObjective: string
  difficulty: EducationalDifficulty
  relatedTopics: string[]
  suggestedActions: string[]
  triggerMessage?: string
  timestamp: Date
  studentLevel?: string
}

export interface FormattedMessage {
  html: string
  text: string
  className: string
  interactive?: InteractiveElement[]
  syntax?: SyntaxHighlighting
}

export interface InteractiveElement {
  type: 'clickable' | 'hover' | 'expandable'
  range: { start: number; end: number }
  action: InteractiveAction
  tooltip?: string
  icon?: string
}

export interface InteractiveAction {
  type: 'navigate-to-file' | 'show-definition' | 'run-command' | 'show-help' | 'expand-details'
  file?: string
  line?: number
  column?: number
  command?: string
  data?: any
}

export interface SyntaxHighlighting {
  language: string
  tokens: SyntaxToken[]
}

export interface SyntaxToken {
  type: string
  value: string
  className: string
  start: number
  end: number
}

// Stream-related types
export interface StreamConfig {
  bufferSize?: number
  throttleMs?: number
  encoding?: string
}

export interface ProcessStreamConfig extends StreamConfig {
  command: string
  args: string[]
  cwd?: string
  env?: Record<string, string>
}

export interface WebSocketStreamConfig extends StreamConfig {
  url: string
  protocols?: string[]
  headers?: Record<string, string>
}

export interface SSEStreamConfig extends StreamConfig {
  url: string
  headers?: Record<string, string>
  withCredentials?: boolean
}

export interface StreamMessage {
  type: 'stdout' | 'stderr' | 'exit' | 'error' | 'data'
  data?: string
  code?: number
  error?: Error
  timestamp: Date
}

// Analysis types
export interface MessageAnalysis {
  hasEducationalValue: boolean
  concept?: string
  explanation?: string
  learningObjective?: string
  difficulty?: EducationalDifficulty
  relatedTopics?: string[]
  suggestedActions?: string[]
  isCommonMistake?: boolean
  confidence?: number
  patterns?: string[]
}

export interface ConceptDatabase {
  concepts: Map<string, ConceptDefinition>
  patterns: Map<string, PatternMatcher>
  relationships: Map<string, string[]>
}

export interface ConceptDefinition {
  id: string
  name: string
  description: string
  difficulty: EducationalDifficulty
  prerequisites: string[]
  examples: CodeExample[]
  commonMistakes: string[]
  resources: string[]
}

export interface PatternMatcher {
  pattern: RegExp
  concept: string
  confidence: number
  extractor?: (match: RegExpMatchArray) => Record<string, any>
}

// Output Manager Events
export interface OutputManagerEvents {
  'message-added': (channelId: string, message: OutputMessage) => void
  'channel-created': (channel: OutputChannel) => void
  'channel-removed': (channelId: string) => void
  'filter-applied': (channelId: string, filterId: string) => void
  'insight-generated': (channelId: string, insight: EducationalInsight) => void
  'error-pattern-detected': (message: OutputMessage, pattern: string) => void
}

// UI State types
export interface OutputPanelState {
  activeChannelId: string
  channels: OutputChannel[]
  globalFilters: OutputFilter[]
  searchQuery: string
  autoScroll: boolean
  isStreaming: boolean
  viewMode: 'standard' | 'educational' | 'minimal'
  showTimestamps: boolean
  showSources: boolean
  fontSize: 'small' | 'medium' | 'large'
}

export interface OutputControlsState {
  isFilterPanelOpen: boolean
  selectedFilters: string[]
  sortOrder: 'chronological' | 'priority' | 'educational'
  groupBySource: boolean
  hideSuccessMessages: boolean
  onlyShowErrors: boolean
  educationalMode: boolean
}

// Export utility types
export interface ExportOptions {
  format: 'text' | 'json' | 'html' | 'markdown'
  includeMetadata: boolean
  includeEducationalAnnotations: boolean
  includeTimestamps: boolean
  dateRange?: { start: Date; end: Date }
  channels?: string[]
  levels?: MessageLevel[]
}

export interface ExportResult {
  content: string
  filename: string
  mimeType: string
  size: number
}