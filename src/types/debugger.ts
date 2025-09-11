// Core Debug Console Types and Interfaces for Agent Academy IDE

export type BreakpointId = string
export type EvaluationId = string
export type DebugSessionId = string

export type DebugLanguage = 'python' | 'javascript' | 'typescript' | 'react'
export type DebugStepAction = 'over' | 'into' | 'out' | 'continue' | 'pause' | 'stop'
export type VariableScope = 'local' | 'global' | 'parameter' | 'closure'
export type DebugReason = 'breakpoint' | 'step' | 'exception' | 'pause' | 'entry'
export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

// Core Debugger Interface
export interface Debugger {
  language: DebugLanguage
  sessionId: DebugSessionId
  isActive: boolean
  
  initialize(): Promise<void>
  destroy(): Promise<void>
  
  // Breakpoint Management
  setBreakpoint(line: number, file?: string, condition?: string): Promise<BreakpointId>
  removeBreakpoint(id: BreakpointId): Promise<void>
  toggleBreakpoint(id: BreakpointId): Promise<void>
  getAllBreakpoints(): Promise<Breakpoint[]>
  
  // Execution Control
  run(code: string): Promise<DebugState>
  stepOver(): Promise<DebugState>
  stepInto(): Promise<DebugState>
  stepOut(): Promise<DebugState>
  continue(): Promise<DebugState>
  pause(): Promise<DebugState>
  stop(): Promise<void>
  
  // Evaluation and Inspection
  evaluate(expression: string, context?: EvaluationContext): Promise<EvaluationResult>
  getVariables(scope?: VariableScope): Promise<Variable[]>
  getCallStack(): Promise<StackFrame[]>
  watchExpression(expression: string): Promise<string>
  unwatchExpression(watchId: string): Promise<void>
}

// Debug State
export interface DebugState {
  isRunning: boolean
  isPaused: boolean
  isDebugging: boolean
  currentLine?: number
  currentFile?: string
  reason?: DebugReason
  variables: Variable[]
  callStack: StackFrame[]
  watchExpressions: WatchExpression[]
  console: ConsoleEntry[]
  performance: PerformanceMetrics
  educationalContext: EducationalContext
}

// Breakpoint System
export interface Breakpoint {
  id: BreakpointId
  line: number
  column?: number
  file?: string
  condition?: string
  active: boolean
  hitCount: number
  logMessage?: string
  educational: EducationalBreakpoint
  timestamp: Date
}

export interface EducationalBreakpoint {
  note: string
  learningObjective: string
  relatedConcepts: string[]
  suggestedActions: BreakpointAction[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface BreakpointAction {
  name: string
  description: string
  icon: string
  execute: () => Promise<void>
  learningValue: string
}

// Variable System
export interface Variable {
  name: string
  value: any
  type: string
  scope: VariableScope
  isEditable: boolean
  isExpandable: boolean
  children?: Variable[]
  educational: VariableEducation
  metadata: VariableMetadata
}

export interface VariableEducation {
  note: string
  typeExplanation: string
  usageExamples: string[]
  relatedConcepts: string[]
  commonMistakes: string[]
  bestPractices: string[]
}

export interface VariableMetadata {
  size?: number
  memoryLocation?: string
  lastModified?: Date
  accessCount: number
}

// Call Stack
export interface StackFrame {
  id: string
  function: string
  file: string
  line: number
  column: number
  locals: Variable[]
  arguments: Variable[]
  educational: FrameEducation
}

export interface FrameEducation {
  context: string
  explanation: string
  flowDescription: string
  keyInsights: string[]
}

// Evaluation System
export interface EvaluationContext {
  frame?: string
  scope?: VariableScope
  timeout?: number
  captureOutput?: boolean
}

export interface EvaluationResult {
  id: EvaluationId
  success: boolean
  value?: any
  type?: string
  output?: string
  error?: string
  executionTime: number
  educational: EvaluationEducation
}

export interface EvaluationEducation {
  explanation: string
  conceptsUsed: string[]
  improvementSuggestions: string[]
  relatedExercises: string[]
}

// Watch Expressions
export interface WatchExpression {
  id: string
  expression: string
  value: any
  type: string
  error?: string
  isActive: boolean
  lastEvaluated: Date
}

// Console System
export interface ConsoleEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  source: string
  stackTrace?: string
  educational?: ConsoleEducation
}

export interface ConsoleEducation {
  explanation: string
  debuggingTip: string
  relatedCommands: string[]
}

// Debug Commands
export interface DebugCommand {
  name: string
  aliases: string[]
  description: string
  syntax: string
  examples: string[]
  category: 'execution' | 'inspection' | 'breakpoints' | 'educational'
  educationalValue: string
  execute: (args: string[], context: DebugContext) => Promise<DebugCommandResult>
}

export interface DebugCommandResult {
  success: boolean
  output?: string
  error?: string
  educational?: DebugCommandEducation
  nextSuggestions?: string[]
}

export interface DebugCommandEducation {
  conceptExplanation: string
  practiceExercises: string[]
  nextSteps: string[]
}

export interface DebugContext {
  debugger: Debugger
  currentState: DebugState
  currentFile?: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
}

// Educational Features
export interface EducationalContext {
  currentLesson?: string
  learningObjectives: string[]
  conceptsIntroduced: string[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  hints: DebuggingHint[]
  progress: LearningProgress
}

export interface DebuggingHint {
  id: string
  trigger: HintTrigger
  content: string
  priority: 'low' | 'medium' | 'high'
  category: 'concept' | 'technique' | 'problem-solving' | 'best-practice'
  conditions: HintCondition[]
}

export interface HintTrigger {
  event: 'breakpoint' | 'error' | 'evaluation' | 'step' | 'timer'
  conditions: Record<string, any>
}

export interface HintCondition {
  type: 'code-pattern' | 'execution-state' | 'time-based' | 'user-action'
  condition: string
  value: any
}

export interface LearningProgress {
  conceptsLearned: string[]
  skillsAcquired: string[]
  debuggingPatterns: string[]
  mistakesLearned: string[]
  totalDebuggingTime: number
  sessionsCompleted: number
}

// Performance Monitoring
export interface PerformanceMetrics {
  executionTime: number
  memoryUsage: number
  stepCount: number
  breakpointHits: number
  evaluationCount: number
  startTime: Date
  endTime?: Date
}

// Debugging Guides
export interface DebuggingGuide {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  concepts: string[]
  prerequisites: string[]
  steps: DebuggingStep[]
  exercises: DebuggingExercise[]
}

export interface DebuggingStep {
  id: string
  title: string
  description: string
  action: DebugStepAction | 'inspect' | 'evaluate' | 'observe'
  expectedResult: string
  explanation: string
  hints: string[]
  validation: StepValidation
}

export interface StepValidation {
  type: 'state-check' | 'output-match' | 'variable-value' | 'user-confirmation'
  condition: string
  errorMessage: string
  helpText: string
}

export interface DebuggingExercise {
  id: string
  title: string
  description: string
  code: string
  bugs: BugDescription[]
  expectedSolution: string
  hints: string[]
  learningObjectives: string[]
}

export interface BugDescription {
  line: number
  type: 'syntax' | 'logic' | 'runtime' | 'performance'
  description: string
  fix: string
  explanation: string
}

// Code Context Analysis
export interface CodeContext {
  language: DebugLanguage
  file: string
  line: number
  column: number
  function?: string
  isInLoop: boolean
  isInCondition: boolean
  isInFunction: boolean
  isInClass: boolean
  complexity: number
  patterns: CodePattern[]
}

export interface CodePattern {
  type: 'loop' | 'condition' | 'function' | 'class' | 'error-handling' | 'recursion'
  confidence: number
  description: string
  educationalNote: string
}

// Event System
export interface DebugEvent {
  type: DebugEventType
  timestamp: Date
  data: any
  source: string
  educational?: DebugEventEducation
}

export type DebugEventType = 
  | 'breakpoint-hit'
  | 'step-completed'
  | 'variable-changed'
  | 'error-occurred'
  | 'evaluation-completed'
  | 'session-started'
  | 'session-ended'
  | 'hint-shown'
  | 'concept-learned'

export interface DebugEventEducation {
  significance: string
  learningOpportunity: string
  relatedConcepts: string[]
}

// Session Management
export interface DebugSession {
  id: DebugSessionId
  language: DebugLanguage
  startTime: Date
  endTime?: Date
  debugger: Debugger
  state: DebugState
  events: DebugEvent[]
  learningProgress: LearningProgress
  isActive: boolean
}

// Export utility types
export type DebuggerFactory = (language: DebugLanguage) => Promise<Debugger>
export type EventHandler<T = any> = (event: DebugEvent) => Promise<T>
export type StateChangeHandler = (state: DebugState) => void