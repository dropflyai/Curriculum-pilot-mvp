/**
 * Challenge Engine - Core system for real-time code execution and validation
 * Integrates with Pyodide for browser-based Python execution
 */

import { 
  MicroChallenge, 
  ValidationResult, 
  ValidationError, 
  ChallengeSession,
  CodeSubmission,
  ChallengeProgress
} from '@/types/challenge'

export class ChallengeEngine {
  private pyodide: any
  private isReady: boolean = false
  private isInitializing: boolean = false
  private currentSession: ChallengeSession | null = null
  private initPromise: Promise<void> | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePyodide()
    }
  }

  private async initializePyodide() {
    if (this.isInitializing || this.isReady) return
    
    this.isInitializing = true
    
    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('🎯 Challenge Engine: Starting Pyodide initialization...')
        
        // Check if Pyodide is already loaded globally
        if (typeof (globalThis as any).loadPyodide !== 'undefined') {
          console.log('🎯 Pyodide script already loaded, initializing...')
          this.pyodide = await (globalThis as any).loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
          })
          this.isReady = true
          this.isInitializing = false
          console.log('🎯 Challenge Engine: Pyodide initialized successfully')
          resolve()
          return
        }

        // Load pyodide from CDN
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        
        script.onload = async () => {
          try {
            console.log('🎯 Pyodide script loaded, initializing...')
            // @ts-ignore
            this.pyodide = await globalThis.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            })
            this.isReady = true
            this.isInitializing = false
            console.log('🎯 Challenge Engine: Pyodide initialized successfully')
            resolve()
          } catch (error) {
            console.error('❌ Challenge Engine: Pyodide initialization failed:', error)
            this.isReady = false
            this.isInitializing = false
            reject(error)
          }
        }

        script.onerror = (error) => {
          console.error('❌ Challenge Engine: Failed to load Pyodide script:', error)
          this.isReady = false
          this.isInitializing = false
          reject(error)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error('❌ Challenge Engine: Initialization failed', error)
        this.isReady = false
        this.isInitializing = false
        reject(error)
      }
    })

    return this.initPromise
  }

  /**
   * Ensure Pyodide is ready before executing code
   */
  private async ensurePyodideReady(): Promise<void> {
    if (this.isReady) return
    
    if (this.initPromise) {
      await this.initPromise
      return
    }
    
    await this.initializePyodide()
  }

  /**
   * Execute code with real-time feedback and validation
   */
  async executeCode(code: string, challenge: MicroChallenge): Promise<{
    output: string[]
    validationResult: ValidationResult
    executionTime: number
  }> {
    try {
      await this.ensurePyodideReady()
    } catch (error) {
      return {
        output: ['❌ Python runtime not available. Please refresh the page.'],
        validationResult: {
          isValid: false,
          score: 0,
          feedback: 'Python runtime initialization failed',
          errors: [{
            message: 'Runtime not ready',
            type: 'runtime',
            severity: 'error'
          }]
        },
        executionTime: 0
      }
    }

    const startTime = Date.now()
    
    try {
      // Set up output capture
      this.pyodide.runPython(`
import sys
from io import StringIO
import traceback

# Capture stdout and stderr
sys.stdout = StringIO()
sys.stderr = StringIO()

# Global variables for test results
_test_results = []
_test_passed = 0
_test_total = 0

def assert_equal(actual, expected, message=""):
    global _test_results, _test_passed, _test_total
    _test_total += 1
    if actual == expected:
        _test_passed += 1
        _test_results.append(f"✅ Test {_test_total}: {message or 'Passed'}")
    else:
        _test_results.append(f"❌ Test {_test_total}: Expected {expected}, got {actual}. {message}")

def assert_contains(text, substring, message=""):
    global _test_results, _test_passed, _test_total
    _test_total += 1
    if substring in text:
        _test_passed += 1
        _test_results.append(f"✅ Test {_test_total}: {message or 'Contains check passed'}")
    else:
        _test_results.append(f"❌ Test {_test_total}: Expected '{text}' to contain '{substring}'. {message}")

def get_test_results():
    return _test_results, _test_passed, _test_total
      `)

      // Execute user code
      this.pyodide.runPython(code)

      // Get output
      const stdout = this.pyodide.runPython("sys.stdout.getvalue()")
      const stderr = this.pyodide.runPython("sys.stderr.getvalue()")

      const output = []
      if (stdout) output.push(stdout)
      if (stderr) output.push(`❌ ${stderr}`)

      // Run validation if available
      const validationResult = await this.validateCode(code, challenge, stdout)
      
      const executionTime = Date.now() - startTime

      return {
        output: output.length > 0 ? output : ['✅ Code executed successfully'],
        validationResult,
        executionTime
      }

    } catch (error) {
      const executionTime = Date.now() - startTime
      return {
        output: [`❌ Error: ${error}`],
        validationResult: {
          isValid: false,
          score: 0,
          feedback: `Execution error: ${error}`,
          errors: [{
            message: error?.toString() || 'Unknown error',
            type: 'runtime',
            severity: 'error'
          }]
        },
        executionTime
      }
    }
  }

  /**
   * Validate code against challenge requirements
   */
  private async validateCode(code: string, challenge: MicroChallenge, output: string): Promise<ValidationResult> {
    // If challenge has custom validation function, use it
    if (challenge.validateCode) {
      return challenge.validateCode(code)
    }

    // Default validation based on challenge type
    return this.defaultValidation(code, challenge, output)
  }

  /**
   * Default validation logic for common challenge types
   */
  private defaultValidation(code: string, challenge: MicroChallenge, output: string): ValidationResult {
    const errors: ValidationError[] = []
    let score = 0
    let feedback = ""

    // Basic syntax validation
    if (!this.checkSyntax(code)) {
      errors.push({
        message: "Syntax error in code",
        type: 'syntax',
        severity: 'error'
      })
      return {
        isValid: false,
        score: 0,
        feedback: "Please fix syntax errors before proceeding",
        errors
      }
    }

    // Check for required concepts
    const conceptChecks = this.checkConcepts(code, challenge.concepts)
    score += conceptChecks.score
    feedback += conceptChecks.feedback

    // Check if solution code matches (for exact match challenges)
    if (challenge.solutionCode) {
      const solutionMatch = this.checkSolutionMatch(code, challenge.solutionCode)
      if (solutionMatch.isExact) {
        score = 100
        feedback = "Perfect! Your solution matches exactly."
      } else if (solutionMatch.similarity > 0.8) {
        score = Math.max(score, 85)
        feedback += " Your solution is very close to the expected answer."
      }
    }

    // For challenges requiring specific output
    if (challenge.title.toLowerCase().includes('print') || challenge.concepts.includes('output')) {
      const outputCheck = this.checkOutput(output, challenge)
      score = Math.max(score, outputCheck.score)
      feedback += outputCheck.feedback
    }

    const isValid = score >= 70 && errors.length === 0

    return {
      isValid,
      score: Math.min(score, 100),
      feedback: feedback || (isValid ? "Great work!" : "Keep trying! Check the hints for help."),
      errors: errors.length > 0 ? errors : undefined
    }
  }

  /**
   * Check code syntax using Pyodide
   */
  private checkSyntax(code: string): boolean {
    if (!this.isReady || !this.pyodide) return false

    try {
      this.pyodide.runPython(`
import ast
import sys
from io import StringIO

def check_syntax(code_str):
    try:
        ast.parse(code_str)
        return True, ""
    except SyntaxError as e:
        return False, str(e)
      `)

      const result = this.pyodide.runPython(`check_syntax('''${code}''')`)
      return result[0] // returns [is_valid, error_message]
    } catch (error) {
      return false
    }
  }

  /**
   * Check if code contains required concepts
   */
  private checkConcepts(code: string, concepts: string[]): { score: number, feedback: string } {
    let score = 0
    let feedback = ""
    const maxScore = 60 // max 60% from concept checking

    for (const concept of concepts) {
      if (this.checkConceptInCode(code, concept)) {
        score += maxScore / concepts.length
      } else {
        feedback += `Missing concept: ${concept}. `
      }
    }

    return { score, feedback }
  }

  /**
   * Check if specific concept is present in code
   */
  private checkConceptInCode(code: string, concept: string): boolean {
    const conceptPatterns: Record<string, RegExp[]> = {
      'Variables': [/\w+\s*=\s*[^=]/],
      'String Values': [/['"][^'"]*['"]/],
      'Assignment Operator': [/=/],
      'Numeric Values': [/=\s*\d+(\.\d+)?/],
      'Boolean Values': [/=\s*(True|False)/],
      'Print Statement': [/print\s*\(/],
      'Functions': [/def\s+\w+\s*\(/],
      'Loops': [/(for|while)\s+/],
      'Conditionals': [/(if|elif|else)/],
      'Lists': [/\[.*\]/],
      'Dictionaries': [/\{.*\}/]
    }

    const patterns = conceptPatterns[concept] || []
    return patterns.some(pattern => pattern.test(code))
  }

  /**
   * Check solution match with flexibility
   */
  private checkSolutionMatch(code: string, solutionCode: string): { isExact: boolean, similarity: number } {
    // Normalize code for comparison
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase()
    
    const normalizedCode = normalize(code)
    const normalizedSolution = normalize(solutionCode)
    
    if (normalizedCode === normalizedSolution) {
      return { isExact: true, similarity: 1.0 }
    }

    // Calculate similarity using simple string similarity
    const similarity = this.calculateStringSimilarity(normalizedCode, normalizedSolution)
    return { isExact: false, similarity }
  }

  /**
   * Simple string similarity calculation
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(shorter, longer)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Levenshtein distance calculation
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  /**
   * Check output against expected results
   */
  private checkOutput(output: string, challenge: MicroChallenge): { score: number, feedback: string } {
    // For basic challenges, just check if there's meaningful output
    if (output && output.trim().length > 0) {
      return { score: 40, feedback: "Good! Your code produces output. " }
    }
    
    return { score: 0, feedback: "No output detected. " }
  }

  /**
   * Start a new challenge session
   */
  async startChallengeSession(challengeId: string, userId: string): Promise<ChallengeSession> {
    const session: ChallengeSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      challengeId,
      userId,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      currentCode: '',
      isRunning: false,
      output: [],
      attempts: 0,
      hintsUnlocked: [],
      realtimeErrors: []
    }

    this.currentSession = session
    return session
  }

  /**
   * Submit code for validation and scoring
   */
  async submitCode(code: string, challenge: MicroChallenge): Promise<CodeSubmission> {
    const execution = await this.executeCode(code, challenge)
    
    const submission: CodeSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      submittedAt: new Date(),
      validationResult: execution.validationResult,
      executionOutput: execution.output.join('\n')
    }

    // Update session if active
    if (this.currentSession) {
      this.currentSession.attempts++
      this.currentSession.lastActivityAt = new Date()
      this.currentSession.currentCode = code
      this.currentSession.output = execution.output
      this.currentSession.lastValidation = execution.validationResult
    }

    return submission
  }

  /**
   * Get real-time validation without full submission
   */
  async validateCodeRealtime(code: string, challenge: MicroChallenge): Promise<ValidationError[]> {
    try {
      await this.ensurePyodideReady()
    } catch (error) {
      return []
    }

    const errors: ValidationError[] = []

    // Quick syntax check
    if (!this.checkSyntax(code)) {
      errors.push({
        message: "Syntax error detected",
        type: 'syntax',
        severity: 'error'
      })
    }

    // Check for common patterns
    if (code.length > 10) { // Only check if there's substantial code
      const missingConcepts = challenge.concepts.filter(concept => 
        !this.checkConceptInCode(code, concept)
      )
      
      missingConcepts.forEach(concept => {
        errors.push({
          message: `Missing required concept: ${concept}`,
          type: 'logic',
          severity: 'warning'
        })
      })
    }

    return errors
  }

  /**
   * Calculate XP based on performance
   */
  calculateXP(challenge: MicroChallenge, submission: CodeSubmission, session: ChallengeSession): number {
    let xp = challenge.xpReward
    const { validationResult } = submission

    // Base XP from score
    xp = Math.floor(xp * (validationResult.score / 100))

    // Bonus for first attempt
    if (session.attempts === 1 && validationResult.isValid) {
      xp += Math.floor(challenge.xpReward * 0.5)
    }

    // Bonus for not using hints
    if (session.hintsUnlocked.length === 0 && validationResult.isValid) {
      xp += Math.floor(challenge.xpReward * 0.3)
    }

    // Time bonus (if completed quickly)
    const timeSpent = (Date.now() - session.startedAt.getTime()) / 1000 / 60 // minutes
    if (timeSpent < challenge.estimatedTime * 0.5 && validationResult.isValid) {
      xp += Math.floor(challenge.xpReward * 0.2)
    }

    return Math.max(xp, 0)
  }

  /**
   * Check if ready for code execution
   */
  isEngineReady(): boolean {
    return this.isReady && this.pyodide !== null
  }

  /**
   * Get initialization status for UI feedback
   */
  getEngineStatus(): { ready: boolean, initializing: boolean, error?: string } {
    return {
      ready: this.isReady,
      initializing: this.isInitializing,
      error: (!this.isReady && !this.isInitializing) ? 'Failed to initialize Python runtime' : undefined
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ChallengeSession | null {
    return this.currentSession
  }

  /**
   * End current session
   */
  endSession(): void {
    this.currentSession = null
  }
}

// Singleton instance
export const challengeEngine = new ChallengeEngine()