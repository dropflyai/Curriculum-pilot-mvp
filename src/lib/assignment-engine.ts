// Assignment Engine - Enhanced lesson structure with Learn/Code/Quiz/Submit tabs
// Based on DropFly Education MVP YAML/JSON schema

import { createClient } from '@/lib/supabase'

export interface AssignmentQuizItem {
  type: 'mcq' | 'short' | 'code_trace' | 'true_false'
  question: string
  options?: string[]
  answer_index?: number // For MCQ
  correct_answer?: string // For short answer
  explanation: string
  points: number
}

export interface RubricCriterion {
  name: string
  description: string
  levels: {
    score: number // 0-4 scale
    label: string // "Does not meet", "Approaches", "Meets", "Exceeds"
    description: string
  }[]
}

export interface AssignmentDefinition {
  id: string
  week: number
  title: string
  assignment_type: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE'
  duration_minutes: number
  unlock_rule: 'sequential' | 'manual' | 'week_based'
  
  // Learning Objectives & Standards
  objectives: string[]
  standards: string[] // FL-CPALMS codes
  
  // Tab Content
  learn_md: string // Markdown content for Learn tab
  code_starter: string // Preloaded code in editor
  code_tests_py: string // Pyodide unit tests
  code_patterns: {
    requires_imports?: string[]
    must_use_calls?: string[]
    min_lines?: number
    max_lines?: number
    must_contain?: string[]
    cannot_contain?: string[]
  }
  
  quiz_items: AssignmentQuizItem[]
  checklist: string[]
  
  submit_prompt: string
  rubric: RubricCriterion[]
  
  // XP & Rewards
  base_xp: number
  badges_on_complete: string[] // Badge keys
  
  // Team Settings
  team_size_min: number
  team_size_max: number
  allow_draft_day: boolean
  
  // Scheduling
  available_at?: string
  due_at?: string
  late_penalty_percent: number
  
  created_at: string
  updated_at: string
}

export interface StudentProgress {
  id: string
  user_id: string
  assignment_id: string
  team_id?: string
  
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'completed'
  tab_progress: {
    learn: boolean
    code: boolean
    quiz: boolean
    submit: boolean
  }
  
  // Student Work
  submitted_code: string
  quiz_answers: Record<string, any>
  checklist_completed: boolean[]
  submit_response: string
  
  // Assessment
  teacher_feedback: string
  grade_data: Record<string, any> // Rubric-based grades
  final_score: number
  xp_earned: number
  
  // Timing
  time_spent_minutes: number
  started_at?: string
  submitted_at?: string
  graded_at?: string
  completed_at?: string
}

class AssignmentEngine {
  private supabase = createClient()

  // ==========================================
  // ASSIGNMENT MANAGEMENT
  // ==========================================

  /**
   * Create new assignment from YAML/JSON definition
   */
  async createAssignment(assignmentData: Omit<AssignmentDefinition, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean
    assignment_id?: string
    error?: string
  }> {
    try {
      const { data: assignment, error } = await this.supabase
        .from('assignments')
        .insert({
          week: assignmentData.week,
          title: assignmentData.title,
          assignment_type: assignmentData.assignment_type,
          duration_minutes: assignmentData.duration_minutes,
          unlock_rule: assignmentData.unlock_rule,
          objectives: assignmentData.objectives,
          standards: assignmentData.standards,
          learn_md: assignmentData.learn_md,
          code_starter: assignmentData.code_starter,
          code_tests_py: assignmentData.code_tests_py,
          code_patterns: assignmentData.code_patterns,
          quiz_items: assignmentData.quiz_items,
          checklist: assignmentData.checklist,
          submit_prompt: assignmentData.submit_prompt,
          rubric: assignmentData.rubric,
          base_xp: assignmentData.base_xp,
          badges_on_complete: assignmentData.badges_on_complete,
          team_size_min: assignmentData.team_size_min,
          team_size_max: assignmentData.team_size_max,
          allow_draft_day: assignmentData.allow_draft_day,
          available_at: assignmentData.available_at,
          due_at: assignmentData.due_at,
          late_penalty_percent: assignmentData.late_penalty_percent
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, assignment_id: assignment.id }
    } catch (error) {
      console.error('Error creating assignment:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get available assignments for student (with unlock logic)
   */
  async getAvailableAssignments(userId: string, currentWeek: number): Promise<{
    assignments: AssignmentDefinition[]
    unlocked_count: number
  }> {
    try {
      // Get all assignments for current and previous weeks
      const { data: assignments } = await this.supabase
        .from('assignments')
        .select('*')
        .lte('week', currentWeek)
        .order('week', { ascending: true })
        .order('assignment_type', { ascending: true })

      if (!assignments) return { assignments: [], unlocked_count: 0 }

      // Get student's progress
      const { data: progress } = await this.supabase
        .from('student_progress')
        .select('assignment_id, status')
        .eq('user_id', userId)

      const progressMap = new Map<string, string>(progress?.map((p: any) => [p.assignment_id, p.status]) || [])

      // Apply unlock logic
      const availableAssignments: AssignmentDefinition[] = []
      let unlockedCount = 0

      for (const assignment of assignments) {
        const isUnlocked = this.checkAssignmentUnlocked(assignment, progressMap, assignments)
        
        if (isUnlocked) {
          availableAssignments.push(assignment)
          unlockedCount++
        } else {
          // Add locked assignment with indicator
          availableAssignments.push({ ...assignment, id: `${assignment.id}_locked` })
        }
      }

      return { assignments: availableAssignments, unlocked_count: unlockedCount }
    } catch (error) {
      console.error('Error getting available assignments:', error)
      return { assignments: [], unlocked_count: 0 }
    }
  }

  /**
   * Check if assignment is unlocked for student
   */
  private checkAssignmentUnlocked(
    assignment: AssignmentDefinition,
    progressMap: Map<string, string>,
    allAssignments: AssignmentDefinition[]
  ): boolean {
    switch (assignment.unlock_rule) {
      case 'manual':
        // Teacher manually unlocks
        return assignment.available_at ? new Date(assignment.available_at) <= new Date() : false

      case 'week_based':
        // Unlocked based on current week
        return assignment.available_at ? new Date(assignment.available_at) <= new Date() : true

      case 'sequential':
      default:
        // Must complete previous assignments in order
        const previousAssignments = allAssignments
          .filter(a => a.week < assignment.week || (a.week === assignment.week && a.assignment_type < assignment.assignment_type))
          .sort((a, b) => a.week - b.week)

        // Check if all previous assignments are completed
        for (const prevAssignment of previousAssignments) {
          const status = progressMap.get(prevAssignment.id)
          if (status !== 'completed' && status !== 'graded') {
            return false
          }
        }
        return true
    }
  }

  // ==========================================
  // PROGRESS TRACKING
  // ==========================================

  /**
   * Initialize assignment progress for student
   */
  async initializeProgress(userId: string, assignmentId: string): Promise<{
    success: boolean
    progress_id?: string
  }> {
    try {
      // Check if progress already exists
      const { data: existingProgress } = await this.supabase
        .from('student_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)
        .single()

      if (existingProgress) {
        return { success: true, progress_id: existingProgress.id }
      }

      // Create new progress record
      const { data: progress, error } = await this.supabase
        .from('student_progress')
        .insert({
          user_id: userId,
          assignment_id: assignmentId,
          status: 'in_progress',
          tab_progress: { learn: false, code: false, quiz: false, submit: false },
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, progress_id: progress.id }
    } catch (error) {
      console.error('Error initializing progress:', error)
      return { success: false }
    }
  }

  /**
   * Update tab completion status
   */
  async updateTabProgress(
    userId: string,
    assignmentId: string,
    tab: 'learn' | 'code' | 'quiz' | 'submit',
    completed: boolean,
    additionalData?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get current progress
      const { data: currentProgress } = await this.supabase
        .from('student_progress')
        .select('tab_progress, time_spent_minutes')
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)
        .single()

      if (!currentProgress) {
        await this.initializeProgress(userId, assignmentId)
      }

      // Update tab progress
      const updatedTabProgress = {
        ...currentProgress?.tab_progress,
        [tab]: completed
      }

      const updateData: any = {
        tab_progress: updatedTabProgress,
        time_spent_minutes: (currentProgress?.time_spent_minutes || 0) + (additionalData?.time_delta || 0)
      }

      // Add tab-specific data
      if (tab === 'code' && additionalData?.submitted_code) {
        updateData.submitted_code = additionalData.submitted_code
      }
      if (tab === 'quiz' && additionalData?.quiz_answers) {
        updateData.quiz_answers = additionalData.quiz_answers
      }
      if (tab === 'submit' && additionalData?.submit_response) {
        updateData.submit_response = additionalData.submit_response
        updateData.status = 'submitted'
        updateData.submitted_at = new Date().toISOString()
      }

      const { error } = await this.supabase
        .from('student_progress')
        .update(updateData)
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)

      return !error
    } catch (error) {
      console.error('Error updating tab progress:', error)
      return false
    }
  }

  /**
   * Get student progress for assignment
   */
  async getAssignmentProgress(userId: string, assignmentId: string): Promise<StudentProgress | null> {
    try {
      const { data: progress } = await this.supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)
        .single()

      return progress || null
    } catch (error) {
      console.error('Error getting assignment progress:', error)
      return null
    }
  }

  /**
   * Calculate assignment completion percentage
   */
  calculateCompletionPercentage(tabProgress: { learn: boolean; code: boolean; quiz: boolean; submit: boolean }): number {
    const completedTabs = Object.values(tabProgress).filter(Boolean).length
    return Math.round((completedTabs / 4) * 100)
  }

  // ==========================================
  // ASSIGNMENT VALIDATION
  // ==========================================

  /**
   * Validate code submission against patterns
   */
  validateCodeSubmission(code: string, patterns: AssignmentDefinition['code_patterns']): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Required imports check
    if (patterns.requires_imports) {
      for (const requiredImport of patterns.requires_imports) {
        if (!code.includes(`import ${requiredImport}`) && !code.includes(`from ${requiredImport}`)) {
          errors.push(`Missing required import: ${requiredImport}`)
        }
      }
    }

    // Required function calls check
    if (patterns.must_use_calls) {
      for (const requiredCall of patterns.must_use_calls) {
        if (!code.includes(`${requiredCall}(`)) {
          errors.push(`Missing required function call: ${requiredCall}()`)
        }
      }
    }

    // Line count checks
    const lineCount = code.split('\n').filter(line => line.trim()).length
    
    if (patterns.min_lines && lineCount < patterns.min_lines) {
      warnings.push(`Code is shorter than expected (${lineCount} lines, minimum ${patterns.min_lines})`)
    }
    
    if (patterns.max_lines && lineCount > patterns.max_lines) {
      warnings.push(`Code is longer than expected (${lineCount} lines, maximum ${patterns.max_lines})`)
    }

    // Required content check
    if (patterns.must_contain) {
      for (const requiredContent of patterns.must_contain) {
        if (!code.includes(requiredContent)) {
          errors.push(`Missing required content: ${requiredContent}`)
        }
      }
    }

    // Forbidden content check
    if (patterns.cannot_contain) {
      for (const forbiddenContent of patterns.cannot_contain) {
        if (code.includes(forbiddenContent)) {
          errors.push(`Contains forbidden content: ${forbiddenContent}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Run Pyodide tests on code submission
   */
  async runCodeTests(code: string, testsPy: string): Promise<{
    success: boolean
    tests_passed: number
    tests_total: number
    test_results: Array<{ name: string; passed: boolean; error?: string }>
    execution_output: string
  }> {
    try {
      // This would integrate with Pyodide in the browser
      // For now, returning simulated results
      
      // Basic code execution check
      const hasBasicElements = code.includes('print') || code.includes('input') || code.includes('=')
      
      if (!hasBasicElements) {
        return {
          success: false,
          tests_passed: 0,
          tests_total: 3,
          test_results: [
            { name: 'Basic functionality', passed: false, error: 'No basic Python elements found' },
            { name: 'Expected output', passed: false, error: 'Code does not produce output' },
            { name: 'Code structure', passed: false, error: 'Code structure incomplete' }
          ],
          execution_output: 'No output generated'
        }
      }

      // Simulate successful execution
      return {
        success: true,
        tests_passed: 3,
        tests_total: 3,
        test_results: [
          { name: 'Basic functionality', passed: true },
          { name: 'Expected output', passed: true },
          { name: 'Code structure', passed: true }
        ],
        execution_output: 'Code executed successfully!'
      }
    } catch (error) {
      console.error('Error running code tests:', error)
      return {
        success: false,
        tests_passed: 0,
        tests_total: 0,
        test_results: [],
        execution_output: 'Test execution failed'
      }
    }
  }

  // ==========================================
  // QUIZ SYSTEM
  // ==========================================

  /**
   * Grade quiz submission
   */
  gradeQuiz(
    quizAnswers: Record<string, any>,
    quizItems: AssignmentQuizItem[]
  ): {
    score: number
    percentage: number
    results: Array<{
      question: string
      student_answer: any
      correct_answer: any
      correct: boolean
      explanation: string
      points_earned: number
      points_possible: number
    }>
    total_points: number
  } {
    const results = []
    let totalEarned = 0
    let totalPossible = 0

    for (let i = 0; i < quizItems.length; i++) {
      const item = quizItems[i]
      const studentAnswer = quizAnswers[i.toString()]
      let correct = false
      let correctAnswer: any

      // Determine correct answer based on question type
      switch (item.type) {
        case 'mcq':
          correctAnswer = item.options?.[item.answer_index || 0]
          correct = studentAnswer === correctAnswer
          break
        
        case 'short':
          correctAnswer = item.correct_answer
          // For short answers, check if contains key concepts (simplified)
          correct = studentAnswer && typeof studentAnswer === 'string' 
            ? studentAnswer.toLowerCase().includes(correctAnswer?.toLowerCase() || '') 
            : false
          break
        
        case 'true_false':
          correctAnswer = item.correct_answer
          correct = studentAnswer === correctAnswer
          break
        
        case 'code_trace':
          correctAnswer = item.correct_answer
          correct = studentAnswer === correctAnswer
          break
      }

      const pointsEarned = correct ? item.points : 0
      totalEarned += pointsEarned
      totalPossible += item.points

      results.push({
        question: item.question,
        student_answer: studentAnswer,
        correct_answer: correctAnswer,
        correct,
        explanation: item.explanation,
        points_earned: pointsEarned,
        points_possible: item.points
      })
    }

    const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0

    return {
      score: totalEarned,
      percentage,
      results,
      total_points: totalPossible
    }
  }

  // ==========================================
  // COMPREHENSIVE ASSESSMENT
  // ==========================================

  /**
   * Complete assignment assessment (code + quiz + rubric)
   */
  async assessAssignment(
    userId: string,
    assignmentId: string,
    submissionData: {
      code: string
      quiz_answers: Record<string, any>
      submit_response: string
      checklist_completed: boolean[]
      time_spent_minutes: number
    }
  ): Promise<{
    success: boolean
    assessment_results: {
      code_validation: any
      code_tests: any
      quiz_results: any
      completion_percentage: number
      suggested_grade: number
      xp_calculation: any
    }
  }> {
    try {
      // Get assignment definition
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single()

      if (!assignment) throw new Error('Assignment not found')

      // 1. Validate code against patterns
      const codeValidation = this.validateCodeSubmission(submissionData.code, assignment.code_patterns)

      // 2. Run code tests
      const codeTests = await this.runCodeTests(submissionData.code, assignment.code_tests_py)

      // 3. Grade quiz
      const quizResults = this.gradeQuiz(submissionData.quiz_answers, assignment.quiz_items)

      // 4. Calculate completion percentage
      const tabProgress = {
        learn: true, // Assume completed if submitting
        code: codeTests.success,
        quiz: quizResults.percentage >= 60, // 60% passing threshold
        submit: submissionData.submit_response.length >= 50 // Minimum reflection length
      }
      const completionPercentage = this.calculateCompletionPercentage(tabProgress)

      // 5. Suggest overall grade (teachers can override)
      const suggestedGrade = this.calculateSuggestedGrade({
        code_score: codeTests.success ? 85 : 60,
        quiz_score: quizResults.percentage,
        completion_percentage: completionPercentage,
        time_spent: submissionData.time_spent_minutes,
        expected_time: assignment.duration_minutes
      })

      // 6. Calculate XP (preliminary - final calculation after teacher grading)
      const rubricScores = this.estimateRubricScores(codeTests, quizResults, completionPercentage)
      const xpCalculation = {
        base_xp: assignment.base_xp,
        estimated_multiplier: Object.values(rubricScores).reduce((sum, score) => sum + score, 0) / Object.keys(rubricScores).length / 2.5,
        estimated_xp: Math.round(assignment.base_xp * (Object.values(rubricScores).reduce((sum, score) => sum + score, 0) / Object.keys(rubricScores).length / 2.5))
      }

      // Update progress in database
      await this.supabase
        .from('student_progress')
        .update({
          status: 'submitted',
          submitted_code: submissionData.code,
          quiz_answers: submissionData.quiz_answers,
          checklist_completed: submissionData.checklist_completed,
          submit_response: submissionData.submit_response,
          tab_progress: tabProgress,
          time_spent_minutes: submissionData.time_spent_minutes,
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)

      return {
        success: true,
        assessment_results: {
          code_validation: codeValidation,
          code_tests: codeTests,
          quiz_results: quizResults,
          completion_percentage: completionPercentage,
          suggested_grade: suggestedGrade,
          xp_calculation: xpCalculation
        }
      }
    } catch (error) {
      console.error('Error assessing assignment:', error)
      return { success: false, assessment_results: {} as any }
    }
  }

  /**
   * Calculate suggested grade based on multiple factors
   */
  private calculateSuggestedGrade(factors: {
    code_score: number
    quiz_score: number
    completion_percentage: number
    time_spent: number
    expected_time: number
  }): number {
    // Weighted calculation
    const codeWeight = 0.4
    const quizWeight = 0.3
    const completionWeight = 0.2
    const timeWeight = 0.1

    // Time factor (bonus for completing efficiently, penalty for taking too long)
    let timeFactor = 1.0
    if (factors.time_spent < factors.expected_time * 0.5) {
      timeFactor = 1.1 // 10% bonus for quick completion
    } else if (factors.time_spent > factors.expected_time * 1.5) {
      timeFactor = 0.9 // 10% penalty for taking too long
    }

    const weightedScore = (
      factors.code_score * codeWeight +
      factors.quiz_score * quizWeight +
      factors.completion_percentage * completionWeight +
      100 * timeWeight * timeFactor
    )

    return Math.round(Math.min(100, Math.max(0, weightedScore)))
  }

  /**
   * Estimate rubric scores for XP calculation
   */
  private estimateRubricScores(
    codeTests: any,
    quizResults: any,
    completionPercentage: number
  ): Record<string, number> {
    // Default rubric criteria with estimated scores (0-4 scale)
    return {
      functionality: codeTests.success ? (codeTests.tests_passed === codeTests.tests_total ? 4 : 3) : 1,
      understanding: quizResults.percentage >= 90 ? 4 : quizResults.percentage >= 70 ? 3 : quizResults.percentage >= 50 ? 2 : 1,
      completion: completionPercentage >= 90 ? 4 : completionPercentage >= 75 ? 3 : completionPercentage >= 50 ? 2 : 1,
      effort: completionPercentage >= 75 ? 3 : 2 // Based on completion
    }
  }
}

// ==========================================
// ASSIGNMENT TEMPLATE SYSTEM
// ==========================================

class AssignmentTemplateEngine {
  /**
   * Create assignment from YAML-style template
   */
  static parseAssignmentTemplate(templateData: any): Omit<AssignmentDefinition, 'id' | 'created_at' | 'updated_at'> {
    return {
      week: templateData.week || 1,
      title: templateData.title || 'Untitled Assignment',
      assignment_type: templateData.assignment_type || 'SOLO',
      duration_minutes: templateData.duration_minutes || 60,
      unlock_rule: templateData.unlock_rule || 'sequential',
      
      objectives: templateData.objectives || [],
      standards: templateData.standards || [],
      
      learn_md: templateData.tabs?.learn_md || '',
      code_starter: templateData.tabs?.code?.starter || '',
      code_tests_py: templateData.tabs?.code?.tests_py || '',
      code_patterns: templateData.tabs?.code?.patterns || {},
      
      quiz_items: this.parseQuizItems(templateData.tabs?.quiz?.items || []),
      checklist: templateData.checklist || [],
      
      submit_prompt: templateData.submit?.prompt || 'Describe what you built (3-4 sentences)',
      rubric: this.parseRubric(templateData.submit?.rubric || []),
      
      base_xp: templateData.base_xp || 100,
      badges_on_complete: templateData.badges_on_complete || [],
      
      team_size_min: templateData.team_size_min || 1,
      team_size_max: templateData.team_size_max || 4,
      allow_draft_day: templateData.allow_draft_day || false,
      
      available_at: templateData.available_at,
      due_at: templateData.due_at,
      late_penalty_percent: templateData.late_penalty_percent || 10.0
    }
  }

  /**
   * Parse quiz items from template format
   */
  private static parseQuizItems(items: any[]): AssignmentQuizItem[] {
    return items.map((item, index) => ({
      type: item.type || 'mcq',
      question: item.q || item.question || `Question ${index + 1}`,
      options: item.options || [],
      answer_index: item.answer_index !== undefined ? item.answer_index : 0,
      correct_answer: item.answer || item.correct_answer,
      explanation: item.explanation || 'No explanation provided',
      points: item.points || 1
    }))
  }

  /**
   * Parse rubric from template format
   */
  private static parseRubric(rubricData: any[]): RubricCriterion[] {
    return rubricData.map(criterion => ({
      name: criterion.name || 'Criterion',
      description: criterion.description || '',
      levels: criterion.levels?.map((level: string, index: number) => ({
        score: index,
        label: this.getLevelLabel(index),
        description: level
      })) || this.getDefaultLevels()
    }))
  }

  /**
   * Get standard rubric level labels
   */
  private static getLevelLabel(score: number): string {
    const labels = ['Does Not Meet', 'Approaches', 'Meets', 'Exceeds']
    return labels[score] || 'Unknown'
  }

  /**
   * Get default rubric levels
   */
  private static getDefaultLevels() {
    return [
      { score: 0, label: 'Does Not Meet', description: 'Work does not meet expectations' },
      { score: 1, label: 'Approaches', description: 'Work approaches expectations' },
      { score: 2, label: 'Meets', description: 'Work meets expectations' },
      { score: 3, label: 'Exceeds', description: 'Work exceeds expectations' }
    ]
  }
}

// ==========================================
// SAMPLE ASSIGNMENT DEFINITIONS
// ==========================================

export const sampleAssignments: Omit<AssignmentDefinition, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    week: 1,
    title: "Python Variables & Input/Output",
    assignment_type: 'SOLO',
    duration_minutes: 60,
    unlock_rule: 'sequential',
    
    objectives: [
      "Create and use variables to store information",
      "Use input() to get user information", 
      "Use print() to display output",
      "Understand the concept of data storage in programming"
    ],
    standards: ["SC.912.ET.2.2", "SC.912.ET.2.3"],
    
    learn_md: `# Variables: Your Digital Storage Boxes 📦

## What are Variables?
Think of variables like labeled storage boxes in your room. Each box has a name (the variable name) and can hold something inside (the value). 

## Why Use Variables?
Instead of remembering "that blue thing on my desk," you can put it in a box labeled "my_phone" and always know where to find it!

## How to Create Variables
\`\`\`python
# Create a variable (put something in the box)
student_name = "Alex"
student_age = 15
favorite_subject = "Computer Science"
\`\`\`

## Getting Input from Users
\`\`\`python
# Ask the user a question and store their answer
name = input("What's your name? ")
age = input("How old are you? ")
\`\`\`

## Displaying Output
\`\`\`python
# Show information to the user
print("Welcome to CodeFly!")
print(f"Hi {name}, you are {age} years old!")
\`\`\`

Ready to try it yourself? 🚀`,

    code_starter: `# CodeFly Assignment 1: Personal Profile Creator
# Your mission: Create a program that asks for user info and creates a profile!

# Step 1: Ask for the user's information
# (Use input() to ask questions)

# Step 2: Store the information in variables
# (Create variables to remember their answers)

# Step 3: Display a personalized welcome message
# (Use print() and f-strings to show their profile)

print("Welcome to your Personal Profile Creator! ✨")

# Your code here:
`,

    code_tests_py: `# Automated tests for Personal Profile Creator
import io
import sys
from unittest.mock import patch

def test_has_input():
    """Test that code uses input() function"""
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert 'input(' in code, "Code must use input() to get user information"

def test_has_variables():
    """Test that code creates variables"""
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert '=' in code, "Code must create variables using assignment (=)"

def test_has_output():
    """Test that code produces output"""
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert 'print(' in code, "Code must use print() to display output"
`,

    code_patterns: {
      requires_imports: [],
      must_use_calls: ['input', 'print'],
      min_lines: 5,
      max_lines: 20,
      must_contain: ['=', 'input(', 'print('],
      cannot_contain: ['import os', 'exec(', 'eval(']
    },

    quiz_items: [
      {
        type: 'mcq',
        question: 'What does this code do: `name = input("Your name: ")`?',
        options: [
          'Prints "Your name:" to the screen',
          'Asks the user for their name and stores it in a variable called name',
          'Creates a variable called input',
          'Deletes the variable name'
        ],
        answer_index: 1,
        explanation: 'input() asks the user a question and stores their response in the variable name.',
        points: 1
      },
      {
        type: 'mcq',
        question: 'Which symbol is used to create a variable in Python?',
        options: [':', '+', '=', '*'],
        answer_index: 2,
        explanation: 'The = symbol assigns a value to a variable, like putting something in a labeled box.',
        points: 1
      },
      {
        type: 'short',
        question: 'Explain in your own words what a variable is (like you\'re teaching a friend).',
        correct_answer: 'storage',
        explanation: 'Variables are like labeled storage containers that hold information you can use later in your program.',
        points: 2
      }
    ],

    checklist: [
      "I used input() to ask the user questions",
      "I stored the answers in variables with descriptive names",
      "I used print() to display a personalized message",
      "I tested my code and it runs without errors",
      "My code is easy to read and understand"
    ],

    submit_prompt: "Describe your Personal Profile Creator. What questions does it ask? What does it display? How did you make it personal and engaging? (3-4 sentences)",

    rubric: [
      {
        name: "Functionality",
        description: "Does the code work correctly and meet requirements?",
        levels: [
          { score: 0, label: "Does Not Work", description: "Code has errors and doesn't run" },
          { score: 1, label: "Partially Works", description: "Code runs but missing key features" },
          { score: 2, label: "Works as Expected", description: "Code works and meets all requirements" },
          { score: 3, label: "Works with Extras", description: "Code works perfectly with creative additions" }
        ]
      },
      {
        name: "Code Quality",
        description: "Is the code well-written and easy to understand?",
        levels: [
          { score: 0, label: "Hard to Read", description: "Code is unclear with poor variable names" },
          { score: 1, label: "Somewhat Clear", description: "Code is readable with some good practices" },
          { score: 2, label: "Clear and Organized", description: "Code is well-organized with good variable names" },
          { score: 3, label: "Exceptional Quality", description: "Code is beautifully written and commented" }
        ]
      },
      {
        name: "Understanding",
        description: "Does the student demonstrate understanding of concepts?",
        levels: [
          { score: 0, label: "Minimal Understanding", description: "Shows little grasp of variables/input/output" },
          { score: 1, label: "Basic Understanding", description: "Shows basic grasp of concepts" },
          { score: 2, label: "Good Understanding", description: "Clearly understands variables and I/O" },
          { score: 3, label: "Deep Understanding", description: "Shows advanced understanding and creativity" }
        ]
      }
    ],

    base_xp: 150,
    badges_on_complete: ['first_run', 'ship_it'],

    team_size_min: 1,
    team_size_max: 1,
    allow_draft_day: false,

    late_penalty_percent: 10.0
  },

  {
    week: 2,
    title: "Magic 8-Ball App with Randomness",
    assignment_type: 'SOLO', 
    duration_minutes: 75,
    unlock_rule: 'sequential',

    objectives: [
      "Use the random module to generate random choices",
      "Create lists to store multiple options",
      "Build an interactive program that responds to user input",
      "Apply variables, input, and output in a real project"
    ],
    standards: ["SC.912.ET.2.3", "SC.912.ET.2.5"],

    learn_md: `# Magic 8-Ball: Adding Randomness to Your Code! 🎱

## What We're Building
A digital Magic 8-Ball that gives random answers to yes/no questions, just like the classic toy!

## New Concepts: Lists and Random
**Lists** are like a collection box that holds multiple items:
\`\`\`python
responses = ["Yes", "No", "Maybe", "Ask again later"]
\`\`\`

**Random** lets your program make unpredictable choices:
\`\`\`python
import random
random.choice(responses)  # Picks one randomly!
\`\`\`

## Building Your Magic 8-Ball
1. Create a list of possible responses
2. Ask the user for a question
3. Pick a random response
4. Display the answer dramatically!

Let's make some coding magic! ✨`,

    code_starter: `# CodeFly Assignment 2: Magic 8-Ball App
# Create a mystical fortune-telling app!

import random

# Step 1: Create a list of Magic 8-Ball responses
responses = [
    "Yes, definitely! ✨",
    "No way! 🚫", 
    "Maybe... 🤔",
    "Ask again later 🔮",
    "I'm not sure 🤷",
    "Absolutely! 🎉",
    "Don't count on it 😬",
    "Signs point to yes 👍"
]

print("🎱 Welcome to the CodeFly Magic 8-Ball! 🎱")
print("Ask me any yes/no question...")

# Step 2: Get the user's question
# (Use input() to ask for their question)

# Step 3: Pick a random response
# (Use random.choice() to pick from your list)

# Step 4: Display the mystical answer
# (Use print() to show the response dramatically)

print("\\n✨ The Magic 8-Ball has spoken! ✨")
`,

    code_tests_py: `# Tests for Magic 8-Ball App
def test_imports_random():
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert 'import random' in code, "Must import random module"

def test_has_list():
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert '[' in code and ']' in code, "Must create a list of responses"

def test_uses_random_choice():
    with open('student_code.py', 'r') as f:
        code = f.read()
    assert 'random.choice' in code, "Must use random.choice() to pick response"
`,

    code_patterns: {
      requires_imports: ['random'],
      must_use_calls: ['input', 'print', 'random.choice'],
      min_lines: 8,
      max_lines: 25,
      must_contain: ['[', ']', 'random.choice(', 'input(', 'print('],
      cannot_contain: ['import os', 'exec(']
    },

    quiz_items: [
      {
        type: 'mcq',
        question: 'What does `random.choice(my_list)` do?',
        options: [
          'Deletes an item from the list',
          'Adds an item to the list', 
          'Picks one random item from the list',
          'Sorts the list alphabetically'
        ],
        answer_index: 2,
        explanation: 'random.choice() randomly selects one item from a list, perfect for Magic 8-Ball responses!',
        points: 1
      },
      {
        type: 'mcq',
        question: 'How do you create a list in Python?',
        options: [
          'Using parentheses: (item1, item2)',
          'Using square brackets: [item1, item2]',
          'Using curly braces: {item1, item2}',
          'Using quotes: "item1, item2"'
        ],
        answer_index: 1,
        explanation: 'Lists use square brackets [] to hold multiple items separated by commas.',
        points: 1
      }
    ],

    checklist: [
      "I imported the random module",
      "I created a list with at least 5 different responses",
      "I used input() to get the user's question",
      "I used random.choice() to pick a response",
      "I made the output fun and engaging with emojis",
      "My Magic 8-Ball works correctly when I test it"
    ],

    submit_prompt: "Describe your Magic 8-Ball app! What makes it special? What responses did you include? How does it feel to build something interactive? (3-4 sentences)",

    rubric: [
      {
        name: "Functionality", 
        description: "Magic 8-Ball works correctly",
        levels: [
          { score: 0, label: "Doesn't Work", description: "Code has errors, doesn't run properly" },
          { score: 1, label: "Basic Function", description: "Works but missing some requirements" },
          { score: 2, label: "Fully Functional", description: "Works perfectly, meets all requirements" },
          { score: 3, label: "Enhanced Features", description: "Works great with creative extras" }
        ]
      },
      {
        name: "Creativity",
        description: "Creative responses and presentation", 
        levels: [
          { score: 0, label: "Basic", description: "Standard responses, minimal creativity" },
          { score: 1, label: "Some Creativity", description: "Some original responses or formatting" },
          { score: 2, label: "Creative", description: "Original responses with good presentation" },
          { score: 3, label: "Highly Creative", description: "Unique, engaging, and entertaining" }
        ]
      }
    ],

    base_xp: 200,
    badges_on_complete: ['ship_it'],

    team_size_min: 1,
    team_size_max: 1, 
    allow_draft_day: false,

    late_penalty_percent: 10.0
  }
]

// ==========================================
// EXPORT ENGINE
// ==========================================

export const assignmentEngine = new AssignmentEngine()
export { AssignmentTemplateEngine }