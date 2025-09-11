/**
 * Agent Academy IDE - Advanced Problems Detection System
 * Comprehensive multi-language error detection with educational feedback
 */

// Core Problem Types and Interfaces
export interface Problem {
  id: string
  type: 'error' | 'warning' | 'suggestion' | 'info'
  severity: 'critical' | 'major' | 'minor' | 'info'
  message: string
  educationalExplanation: string
  fixSuggestion: string
  learnMore: string
  position: {
    line: number
    column: number
    endLine?: number
    endColumn?: number
  }
  code: string // Error code (e.g., 'NameError', 'SyntaxError')
  category: 'syntax' | 'logic' | 'style' | 'performance' | 'security' | 'accessibility'
  source: string // 'Python', 'JavaScript', 'TypeScript', 'React', etc.
  file?: string // File path if applicable
}

export interface EducationalError extends Problem {
  beginnerExplanation: string
  intermediateExplanation: string
  advancedExplanation: string
  commonMistake: boolean
  relatedConcepts: string[]
  practiceExercises: string[]
  videoResources?: string[]
}

export interface ProblemDetector {
  language: string
  detectErrors(code: string, filePath?: string): Promise<Problem[]>
  detectWarnings(code: string, filePath?: string): Promise<Problem[]>
  detectSuggestions(code: string, filePath?: string): Promise<Problem[]>
}

export interface QualityMetrics {
  complexity: number // Cyclomatic complexity
  maintainability: number // Maintainability index
  duplication: number // Code duplication percentage
  testCoverage?: number // Test coverage if available
  accessibility?: AccessibilityScore // For web content
}

export interface AccessibilityScore {
  score: number // 0-100
  issues: AccessibilityIssue[]
  recommendations: string[]
}

export interface AccessibilityIssue {
  id: string
  type: 'missing-alt' | 'color-contrast' | 'keyboard-navigation' | 'aria-labels' | 'semantic-html'
  message: string
  element?: string
  position?: { line: number; column: number }
  severity: 'high' | 'medium' | 'low'
}

export interface CodeFile {
  path: string
  content: string
  language: string
}

export interface AnalysisTask {
  file: CodeFile
  priority: 'high' | 'medium' | 'low'
  timestamp: number
}

// Educational Error Database
export const EDUCATIONAL_ERRORS: Record<string, Partial<EducationalError>> = {
  'NameError': {
    beginnerExplanation: "You're trying to use a variable that hasn't been created yet. Think of it like trying to use a box that doesn't exist.",
    intermediateExplanation: "This error occurs when Python encounters a name that hasn't been defined in the current scope. Check for typos or ensure the variable is declared before use.",
    advancedExplanation: "NameError indicates that a name is not found in the local or global symbol table. This can occur due to scope issues, typos, or attempting to use variables before declaration.",
    fixSuggestion: "Define the variable before using it: `variable_name = value`",
    commonMistake: true,
    relatedConcepts: ['variables', 'scope', 'assignment'],
    practiceExercises: ['variable-declaration', 'scope-practice']
  },
  'SyntaxError': {
    beginnerExplanation: "There's a spelling or grammar mistake in your code. Python can't understand what you wrote.",
    intermediateExplanation: "Python syntax rules have been violated. This often involves missing punctuation, incorrect indentation, or invalid Python syntax.",
    advancedExplanation: "SyntaxError occurs during the parsing phase when Python encounters code that doesn't conform to the language grammar rules.",
    fixSuggestion: "Check for missing colons (:), parentheses (), or quotes. Ensure proper indentation.",
    commonMistake: true,
    relatedConcepts: ['syntax', 'indentation', 'punctuation'],
    practiceExercises: ['syntax-fixing', 'indentation-practice']
  },
  'TypeError': {
    beginnerExplanation: "You're trying to do something with the wrong type of data. Like trying to add a number to text.",
    intermediateExplanation: "An operation or function is applied to an object of inappropriate type. Check that your data types match the expected operation.",
    advancedExplanation: "TypeError indicates type incompatibility in operations, function calls, or method invocations. This often involves mixing incompatible types or calling methods on the wrong object type.",
    fixSuggestion: "Make sure your data types match what the operation expects. Use type conversion if needed.",
    commonMistake: true,
    relatedConcepts: ['data-types', 'type-conversion', 'operations'],
    practiceExercises: ['type-conversion', 'data-types-practice']
  },
  'IndentationError': {
    beginnerExplanation: "Python is very picky about spacing at the beginning of lines. All lines at the same level need the same amount of space.",
    intermediateExplanation: "Python uses indentation to define code blocks. Ensure consistent indentation (spaces or tabs, but not mixed) for code at the same level.",
    advancedExplanation: "IndentationError occurs when Python encounters inconsistent or incorrect indentation. Python uses indentation to determine code block structure, unlike languages that use braces.",
    fixSuggestion: "Use consistent indentation (4 spaces recommended). Make sure all lines at the same level have the same indentation.",
    commonMistake: true,
    relatedConcepts: ['indentation', 'code-blocks', 'python-syntax'],
    practiceExercises: ['indentation-practice', 'code-block-structure']
  },
  'AttributeError': {
    beginnerExplanation: "You're trying to use a feature (method or property) that doesn't exist on this type of data.",
    intermediateExplanation: "An attribute or method doesn't exist for the given object type. Check the object type and available methods/attributes.",
    advancedExplanation: "AttributeError occurs when attempting to access an attribute or method that doesn't exist on an object, or when the attribute is not accessible due to access restrictions.",
    fixSuggestion: "Check if you're calling the right method on your variable! Use dir(object) to see available attributes.",
    commonMistake: true,
    relatedConcepts: ['objects', 'methods', 'attributes'],
    practiceExercises: ['object-methods', 'attribute-access']
  },
  'IndexError': {
    beginnerExplanation: "You're trying to access a position in a list that doesn't exist. Like asking for the 10th item in a list that only has 5 items.",
    intermediateExplanation: "Attempting to access an index that is outside the bounds of a sequence (list, tuple, string). Remember that Python uses 0-based indexing.",
    advancedExplanation: "IndexError occurs when a sequence subscript is out of range. This is common when iterating through sequences or accessing elements without proper bounds checking.",
    fixSuggestion: "Check that your index is within the valid range: 0 to len(sequence)-1",
    commonMistake: true,
    relatedConcepts: ['lists', 'indexing', 'sequences'],
    practiceExercises: ['list-indexing', 'bounds-checking']
  }
}

// Problem Categories for Analysis
export const PROBLEM_CATEGORIES = {
  SYNTAX: {
    name: 'Syntax Errors',
    description: 'Code that prevents execution',
    severity: 'critical' as const,
    educational: 'Learn proper syntax and grammar rules',
    icon: 'AlertTriangle'
  },
  LOGIC: {
    name: 'Logic Issues',
    description: 'Code that runs but may not work as expected',
    severity: 'major' as const,
    educational: 'Understand program flow and logic patterns',
    icon: 'Bug'
  },
  STYLE: {
    name: 'Code Style',
    description: 'Code formatting and naming conventions',
    severity: 'minor' as const,
    educational: 'Learn professional coding standards',
    icon: 'Brush'
  },
  PERFORMANCE: {
    name: 'Performance',
    description: 'Code that could be optimized',
    severity: 'minor' as const,
    educational: 'Learn efficiency and optimization techniques',
    icon: 'Zap'
  },
  SECURITY: {
    name: 'Security',
    description: 'Potential security vulnerabilities',
    severity: 'major' as const,
    educational: 'Learn secure coding practices',
    icon: 'Shield'
  },
  ACCESSIBILITY: {
    name: 'Accessibility',
    description: 'Web accessibility improvements',
    severity: 'minor' as const,
    educational: 'Learn inclusive design principles',
    icon: 'Users'
  }
} as const

// Learning Integration Interfaces
export interface LearningIntegration {
  trackProblemEncountered(problem: Problem, studentId: string): void
  suggestLearningPath(problems: Problem[]): LearningRecommendation[]
  generatePracticeExercise(problem: Problem): PracticeExercise
  assessUnderstanding(problemHistory: ProblemHistory): SkillAssessment
}

export interface LearningRecommendation {
  concept: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: LearningResource[]
  estimatedTime: number // minutes
  prerequisite?: string[]
}

export interface LearningResource {
  type: 'video' | 'article' | 'exercise' | 'documentation'
  title: string
  url: string
  description: string
  duration?: number // minutes for videos
}

export interface PracticeExercise {
  id: string
  title: string
  description: string
  starterCode: string
  solution: string
  hints: string[]
  learningObjectives: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface ProblemHistory {
  studentId: string
  problems: Array<{
    problem: Problem
    timestamp: number
    resolved: boolean
    attemptsToResolve: number
  }>
}

export interface SkillAssessment {
  studentId: string
  concepts: Array<{
    concept: string
    proficiency: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
    confidence: number // 0-1
    lastAssessed: number
  }>
  overallProgress: number // 0-1
  recommendedNextSteps: string[]
}

// UI Component Props
export interface ProblemsUIProps {
  problems: Problem[]
  onProblemClick: (problem: Problem) => void
  onFixSuggestion: (problem: Problem) => void
  onLearnMore: (problem: Problem) => void
  onExplainToMaya: (problem: Problem) => void
  groupBy: 'severity' | 'category' | 'file' | 'type'
  showEducationalMode: boolean
  studentLevel: 'beginner' | 'intermediate' | 'advanced'
}

// Visual Design Features
export const PROBLEMS_UI_FEATURES = {
  FILTERING: ['errors-only', 'warnings-only', 'suggestions-only', 'all'] as const,
  GROUPING: ['by-severity', 'by-file', 'by-category', 'chronological'] as const,
  ACTIONS: ['quick-fix', 'explain', 'learn-more', 'suppress', 'create-exercise', 'ask-maya'] as const,
  EDUCATIONAL: ['beginner-mode', 'show-explanations', 'practice-mode', 'concept-mapping'] as const
}

// Dr. Maya Integration
export interface DrMayaIntegration {
  explainProblem(problem: Problem, studentLevel: string): Promise<string>
  suggestFix(problem: Problem, code: string): Promise<string>
  createLearningPath(problems: Problem[]): Promise<LearningRecommendation[]>
  encourageStudent(problemsSolved: number, currentStreak: number): string
}

// Export utility functions
export function createProblemId(type: string, line: number, column: number, code: string): string {
  return `${type}-${line}-${column}-${code.slice(0, 10)}-${Date.now()}`
}

export function getEducationalExplanation(
  problemCode: string, 
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  const errorInfo = EDUCATIONAL_ERRORS[problemCode]
  if (!errorInfo) return "This is a problem that needs attention."
  
  switch (level) {
    case 'beginner':
      return errorInfo.beginnerExplanation || errorInfo.educationalExplanation || "Let's figure this out together!"
    case 'intermediate':
      return errorInfo.intermediateExplanation || errorInfo.educationalExplanation || "Here's what's happening..."
    case 'advanced':
      return errorInfo.advancedExplanation || errorInfo.educationalExplanation || "Technical details..."
    default:
      return errorInfo.beginnerExplanation || "Let's learn from this!"
  }
}

export function getProblemSeverityColor(severity: Problem['severity']): string {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
    case 'major': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'minor': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getProblemTypeIcon(type: Problem['type']): string {
  switch (type) {
    case 'error': return 'XCircle'
    case 'warning': return 'AlertTriangle'
    case 'suggestion': return 'Lightbulb'
    case 'info': return 'Info'
    default: return 'Circle'
  }
}