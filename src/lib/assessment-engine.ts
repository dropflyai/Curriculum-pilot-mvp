// Assessment Engine - Comprehensive rubric-based grading system
// Based on DropFly Education MVP specifications

import { createClient } from '@/lib/supabase'
import { RubricCriterion, AssignmentDefinition } from './assignment-engine'
import { processAssignmentCompletion } from './xp-engine'

export interface TeacherGrading {
  criterion_scores: Record<string, number> // rubric scores 0-3 for each criterion
  teacher_feedback: string
  bonus_points: number
  late_penalty_applied: boolean
  grade_override?: number // Manual override of calculated grade
  standards_evidence: Record<string, 'developing' | 'proficient' | 'mastery'>
}

export interface GradeReport {
  final_score: number
  letter_grade: string
  rubric_breakdown: Array<{
    criterion: string
    score: number
    max_score: number
    level_label: string
    feedback: string
  }>
  xp_awarded: number
  badges_earned: string[]
  next_steps: string[]
  teacher_comments: string
}

export interface ClassGradebook {
  students: Array<{
    user_id: string
    student_name: string
    assignments: Record<string, {
      status: string
      score?: number
      submitted_at?: string
      graded_at?: string
      needs_attention: boolean
    }>
    class_average: number
    missing_assignments: number
    at_risk: boolean
  }>
  class_statistics: {
    avg_score: number
    completion_rate: number
    assignments_pending_review: number
    students_needing_help: number
  }
}

class AssessmentEngine {
  private supabase = createClient()

  // ==========================================
  // RUBRIC-BASED GRADING
  // ==========================================

  /**
   * Grade assignment using teacher rubric scores
   */
  async gradeAssignment(
    userId: string,
    assignmentId: string,
    teacherGrading: TeacherGrading
  ): Promise<{
    success: boolean
    grade_report: GradeReport
    xp_results: any
  }> {
    try {
      // Get assignment definition and student progress
      const [assignmentResult, progressResult] = await Promise.all([
        this.supabase.from('assignments').select('*').eq('id', assignmentId).single(),
        this.supabase.from('student_progress').select('*').eq('user_id', userId).eq('assignment_id', assignmentId).single()
      ])

      const assignment = assignmentResult.data
      const progress = progressResult.data

      if (!assignment || !progress) {
        throw new Error('Assignment or progress not found')
      }

      // Calculate final score from rubric
      const finalScore = this.calculateRubricScore(
        teacherGrading.criterion_scores,
        assignment.rubric,
        teacherGrading.bonus_points,
        teacherGrading.late_penalty_applied ? assignment.late_penalty_percent : 0,
        teacherGrading.grade_override
      )

      // Generate rubric breakdown
      const rubricBreakdown = this.generateRubricBreakdown(
        teacherGrading.criterion_scores,
        assignment.rubric
      )

      // Process XP and badges
      const xpResults = await processAssignmentCompletion(userId, assignmentId, {
        rubric_scores: teacherGrading.criterion_scores,
        completion_time_minutes: progress.time_spent_minutes,
        quiz_score: this.extractQuizScore(progress.quiz_answers, assignment.quiz_items),
        code_executions: 5, // Would track from session data
        assignment_type: assignment.assignment_type,
        week: assignment.week,
        base_xp: assignment.base_xp,
        team_size: progress.team_id ? assignment.team_size_max : undefined
      })

      // Generate grade report
      const gradeReport: GradeReport = {
        final_score: finalScore,
        letter_grade: this.calculateLetterGrade(finalScore),
        rubric_breakdown: rubricBreakdown,
        xp_awarded: xpResults.xp_awarded + xpResults.total_bonus_xp,
        badges_earned: xpResults.badges_earned.map(b => b.name),
        next_steps: this.generateNextSteps(rubricBreakdown, assignment.week),
        teacher_comments: teacherGrading.teacher_feedback
      }

      // Update progress record
      await this.supabase
        .from('student_progress')
        .update({
          status: 'graded',
          teacher_feedback: teacherGrading.teacher_feedback,
          grade_data: {
            criterion_scores: teacherGrading.criterion_scores,
            rubric_breakdown: rubricBreakdown,
            bonus_points: teacherGrading.bonus_points,
            late_penalty: teacherGrading.late_penalty_applied
          },
          final_score: finalScore,
          xp_earned: xpResults.xp_awarded + xpResults.total_bonus_xp,
          graded_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)

      // Record standards evidence
      await this.recordStandardsEvidence(
        userId,
        assignmentId,
        assignment.standards,
        teacherGrading.standards_evidence
      )

      return {
        success: true,
        grade_report: gradeReport,
        xp_results: xpResults
      }
    } catch (error) {
      console.error('Error grading assignment:', error)
      return {
        success: false,
        grade_report: {} as GradeReport,
        xp_results: {}
      }
    }
  }

  /**
   * Calculate final score from rubric scores
   */
  private calculateRubricScore(
    criterionScores: Record<string, number>,
    rubric: RubricCriterion[],
    bonusPoints: number = 0,
    latePenaltyPercent: number = 0,
    gradeOverride?: number
  ): number {
    if (gradeOverride !== undefined) {
      return Math.max(0, Math.min(100, gradeOverride))
    }

    // Calculate weighted average of rubric scores
    const scores = Object.values(criterionScores)
    const maxScore = 3 // 0-3 scale
    
    if (scores.length === 0) return 0
    
    const avgRubricScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const basePercentage = (avgRubricScore / maxScore) * 100

    // Apply bonus and penalties
    let finalScore = basePercentage + bonusPoints
    
    if (latePenaltyPercent > 0) {
      finalScore = finalScore * (1 - latePenaltyPercent / 100)
    }

    return Math.round(Math.max(0, Math.min(100, finalScore)))
  }

  /**
   * Generate detailed rubric breakdown
   */
  private generateRubricBreakdown(
    criterionScores: Record<string, number>,
    rubric: RubricCriterion[]
  ): GradeReport['rubric_breakdown'] {
    return rubric.map(criterion => {
      const score = criterionScores[criterion.name] || 0
      const level = criterion.levels.find(l => l.score === score) || criterion.levels[0]
      
      return {
        criterion: criterion.name,
        score: score,
        max_score: Math.max(...criterion.levels.map(l => l.score)),
        level_label: level.label,
        feedback: level.description
      }
    })
  }

  /**
   * Calculate letter grade from percentage
   */
  private calculateLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+'
    if (percentage >= 93) return 'A'
    if (percentage >= 90) return 'A-'
    if (percentage >= 87) return 'B+'
    if (percentage >= 83) return 'B'
    if (percentage >= 80) return 'B-'
    if (percentage >= 77) return 'C+'
    if (percentage >= 73) return 'C'
    if (percentage >= 70) return 'C-'
    if (percentage >= 67) return 'D+'
    if (percentage >= 63) return 'D'
    if (percentage >= 60) return 'D-'
    return 'F'
  }

  /**
   * Generate personalized next steps for student
   */
  private generateNextSteps(
    rubricBreakdown: GradeReport['rubric_breakdown'],
    week: number
  ): string[] {
    const nextSteps: string[] = []
    const weakAreas = rubricBreakdown.filter(r => r.score < 2) // Below "Meets" level

    if (weakAreas.length === 0) {
      nextSteps.push("🎉 Excellent work! You're ready for the next challenge!")
      nextSteps.push("💪 Consider helping classmates who might be struggling")
      nextSteps.push("🚀 Look ahead to next week's assignment for bonus preparation")
    } else {
      weakAreas.forEach(area => {
        switch (area.criterion.toLowerCase()) {
          case 'functionality':
            nextSteps.push("🔧 Practice running and testing your code more frequently")
            nextSteps.push("💡 Ask Coach Nova for help with debugging techniques")
            break
          case 'code quality':
            nextSteps.push("📝 Focus on using descriptive variable names")
            nextSteps.push("🎯 Review the code style examples in the lesson")
            break
          case 'understanding':
            nextSteps.push("📚 Re-read the lesson content and practice the examples")
            nextSteps.push("🤔 Try explaining the concepts to a friend or family member")
            break
          case 'creativity':
            nextSteps.push("🎨 Think about how to make your projects more personal and unique")
            nextSteps.push("✨ Add fun messages, emojis, or extra features to your code")
            break
          default:
            nextSteps.push(`📈 Work on improving your ${area.criterion.toLowerCase()} skills`)
        }
      })
    }

    // Week-specific suggestions
    if (week <= 2) {
      nextSteps.push("🌱 Remember: Every programmer started exactly where you are now!")
    } else if (week >= 10) {
      nextSteps.push("🏆 You're in the advanced section - great progress!")
    }

    return nextSteps.slice(0, 4) // Limit to 4 suggestions
  }

  /**
   * Extract quiz score from progress data
   */
  private extractQuizScore(quizAnswers: any, quizItems: any[]): number {
    if (!quizAnswers || !quizItems) return 0
    
    let correct = 0
    quizItems.forEach((item, index) => {
      const studentAnswer = quizAnswers[index.toString()]
      
      switch (item.type) {
        case 'mcq':
          if (studentAnswer === item.options?.[item.answer_index || 0]) correct++
          break
        case 'short':
          if (studentAnswer?.toLowerCase().includes(item.correct_answer?.toLowerCase() || '')) correct++
          break
        case 'true_false':
          if (studentAnswer === item.correct_answer) correct++
          break
      }
    })

    return quizItems.length > 0 ? Math.round((correct / quizItems.length) * 100) : 0
  }

  // ==========================================
  // STANDARDS TRACKING
  // ==========================================

  /**
   * Record evidence of standards mastery
   */
  private async recordStandardsEvidence(
    userId: string,
    assignmentId: string,
    standards: string[],
    evidenceLevels: Record<string, 'developing' | 'proficient' | 'mastery'>
  ): Promise<void> {
    try {
      for (const standard of standards) {
        await this.supabase
          .from('standards_evidence')
          .insert({
            user_id: userId,
            assignment_id: assignmentId,
            standard_code: standard,
            evidence_type: 'code_submission',
            evidence_data: { grading_session: true },
            proficiency_level: evidenceLevels[standard] || 'developing'
          })
      }
    } catch (error) {
      console.error('Error recording standards evidence:', error)
    }
  }

  // ==========================================
  // CLASS GRADEBOOK MANAGEMENT
  // ==========================================

  /**
   * Generate class gradebook for teacher
   */
  async generateClassGradebook(teacherId: string, week?: number): Promise<ClassGradebook> {
    try {
      // Get all students in teacher's classes (simplified - assumes all students)
      const { data: students } = await this.supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'student')

      if (!students) return { students: [], class_statistics: { avg_score: 0, completion_rate: 0, assignments_pending_review: 0, students_needing_help: 0 } }

      // Get assignments for the week/all weeks
      let assignmentQuery = this.supabase.from('assignments').select('id, title, week, assignment_type')
      if (week) {
        assignmentQuery = assignmentQuery.eq('week', week)
      }
      const { data: assignments } = await assignmentQuery

      if (!assignments) return { students: [], class_statistics: { avg_score: 0, completion_rate: 0, assignments_pending_review: 0, students_needing_help: 0 } }

      // Get progress for all students and assignments
      const { data: allProgress } = await this.supabase
        .from('student_progress')
        .select('user_id, assignment_id, status, final_score, submitted_at, graded_at')
        .in('assignment_id', assignments.map((a: any) => a.id))

      // Build gradebook
      const gradebookStudents = []
      let totalScores = 0
      let totalAssignments = 0
      let pendingReviews = 0
      let studentsNeedingHelp = 0

      for (const student of students) {
        const studentProgress = allProgress?.filter((p: any) => p.user_id === student.id) || []
        const assignmentData: Record<string, any> = {}
        
        let studentTotalScore = 0
        let studentAssignmentCount = 0
        let missingAssignments = 0
        let needsAttention = false

        // Process each assignment
        for (const assignment of assignments) {
          const progress = studentProgress.find((p: any) => p.assignment_id === assignment.id)
          
          if (!progress) {
            missingAssignments++
            assignmentData[assignment.id] = {
              status: 'not_started',
              needs_attention: true
            }
            needsAttention = true
          } else {
            const needsAttentionStatus = progress.status === 'submitted' && !progress.graded_at
            if (needsAttentionStatus) pendingReviews++
            
            assignmentData[assignment.id] = {
              status: progress.status,
              score: progress.final_score,
              submitted_at: progress.submitted_at,
              graded_at: progress.graded_at,
              needs_attention: needsAttentionStatus
            }

            if (progress.final_score !== null) {
              studentTotalScore += progress.final_score
              studentAssignmentCount++
              totalScores += progress.final_score
              totalAssignments++
            }
          }
        }

        const studentAverage = studentAssignmentCount > 0 ? studentTotalScore / studentAssignmentCount : 0
        const atRisk = studentAverage < 70 || missingAssignments > 2

        if (atRisk) studentsNeedingHelp++

        gradebookStudents.push({
          user_id: student.id,
          student_name: student.full_name || student.email,
          assignments: assignmentData,
          class_average: studentAverage,
          missing_assignments: missingAssignments,
          at_risk: atRisk
        })
      }

      const classStats = {
        avg_score: totalAssignments > 0 ? totalScores / totalAssignments : 0,
        completion_rate: assignments.length > 0 ? 
          ((totalAssignments / (students.length * assignments.length)) * 100) : 0,
        assignments_pending_review: pendingReviews,
        students_needing_help: studentsNeedingHelp
      }

      return {
        students: gradebookStudents,
        class_statistics: classStats
      }
    } catch (error) {
      console.error('Error generating class gradebook:', error)
      return {
        students: [],
        class_statistics: { avg_score: 0, completion_rate: 0, assignments_pending_review: 0, students_needing_help: 0 }
      }
    }
  }

  /**
   * Get assignments pending teacher review
   */
  async getAssignmentsPendingReview(teacherId: string): Promise<Array<{
    assignment_title: string
    student_name: string
    submitted_at: string
    time_since_submission: string
    priority: 'low' | 'medium' | 'high'
  }>> {
    try {
      const { data: pendingAssignments } = await this.supabase
        .from('student_progress')
        .select(`
          submitted_at,
          assignments!inner(title),
          users!inner(full_name, email)
        `)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: true })

      if (!pendingAssignments) return []

      return pendingAssignments.map((item: any) => {
        const submittedAt = new Date(item.submitted_at)
        const now = new Date()
        const hoursSince = Math.floor((now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60))
        
        let priority: 'low' | 'medium' | 'high' = 'low'
        if (hoursSince > 48) priority = 'high'
        else if (hoursSince > 24) priority = 'medium'

        return {
          assignment_title: item.assignments.title,
          student_name: item.users.full_name || item.users.email,
          submitted_at: item.submitted_at,
          time_since_submission: this.formatTimeSince(submittedAt),
          priority
        }
      })
    } catch (error) {
      console.error('Error getting pending reviews:', error)
      return []
    }
  }

  // ==========================================
  // REGRADE & FEEDBACK SYSTEM
  // ==========================================

  /**
   * Handle student regrade request
   */
  async submitRegradeRequest(
    userId: string,
    assignmentId: string,
    reason: string,
    specific_criteria?: string[]
  ): Promise<{ success: boolean; request_id?: string }> {
    try {
      // Create regrade request (would need new table)
      const requestData = {
        user_id: userId,
        assignment_id: assignmentId,
        reason: reason,
        specific_criteria: specific_criteria || [],
        status: 'pending',
        requested_at: new Date().toISOString()
      }

      // For now, just log the request (would implement regrade_requests table)
      console.log('Regrade request submitted:', requestData)

      return { success: true, request_id: 'mock_request_id' }
    } catch (error) {
      console.error('Error submitting regrade request:', error)
      return { success: false }
    }
  }

  /**
   * Generate detailed feedback for student
   */
  generateDetailedFeedback(
    gradeReport: GradeReport,
    assignment: AssignmentDefinition,
    progress: any
  ): {
    strengths: string[]
    areas_for_improvement: string[]
    specific_suggestions: string[]
    encouragement: string
  } {
    const strengths: string[] = []
    const improvements: string[] = []
    const suggestions: string[] = []

    // Analyze rubric performance
    gradeReport.rubric_breakdown.forEach(rubric => {
      if (rubric.score >= 2) { // Meets or Exceeds
        strengths.push(`Strong ${rubric.criterion.toLowerCase()}: ${rubric.level_label}`)
      } else {
        improvements.push(`${rubric.criterion}: ${rubric.feedback}`)
        
        // Add specific suggestions based on criterion
        switch (rubric.criterion.toLowerCase()) {
          case 'functionality':
            suggestions.push("💡 Test your code frequently and fix errors as you go")
            suggestions.push("🔍 Use print() statements to debug and see what's happening")
            break
          case 'code quality':
            suggestions.push("📝 Use descriptive variable names like 'student_name' instead of 'x'")
            suggestions.push("🎯 Keep your code organized with comments explaining tricky parts")
            break
          case 'understanding':
            suggestions.push("📚 Review the lesson content and try the examples yourself")
            suggestions.push("🤖 Ask Coach Nova to explain concepts you're unsure about")
            break
        }
      }
    })

    // Generate encouragement based on performance
    let encouragement = "Keep up the great work! 🌟"
    if (gradeReport.final_score >= 90) {
      encouragement = "Outstanding work! You're mastering these concepts like a pro! 🏆"
    } else if (gradeReport.final_score >= 80) {
      encouragement = "Great job! You're building solid programming skills! 💪"
    } else if (gradeReport.final_score >= 70) {
      encouragement = "Good effort! Keep practicing and you'll continue to improve! 📈"
    } else {
      encouragement = "Programming is challenging - don't give up! Every expert was once a beginner! 🌱"
    }

    return {
      strengths,
      areas_for_improvement: improvements,
      specific_suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      encouragement
    }
  }

  // ==========================================
  // PEER REVIEW SYSTEM
  // ==========================================

  /**
   * Set up peer review for assignment
   */
  async setupPeerReview(
    assignmentId: string,
    reviewersPerSubmission: number = 2
  ): Promise<{ success: boolean; review_pairs: any[] }> {
    try {
      // Get all completed submissions for assignment
      const { data: submissions } = await this.supabase
        .from('student_progress')
        .select('user_id, submitted_code, submit_response')
        .eq('assignment_id', assignmentId)
        .eq('status', 'submitted')

      if (!submissions || submissions.length < 2) {
        return { success: false, review_pairs: [] }
      }

      // Create review pairs (each submission gets multiple reviewers)
      const reviewPairs = []
      
      for (const submission of submissions) {
        const otherSubmissions = submissions.filter((s: any) => s.user_id !== submission.user_id)
        const selectedReviewers = this.shuffleArray(otherSubmissions)
          .slice(0, reviewersPerSubmission)
        
        for (const reviewer of selectedReviewers) {
          reviewPairs.push({
            assignment_id: assignmentId,
            author_id: submission.user_id,
            reviewer_id: reviewer.user_id,
            submission_data: {
              code: submission.submitted_code,
              reflection: submission.submit_response
            }
          })
        }
      }

      // Store peer review assignments (would need peer_reviews table)
      console.log(`Created ${reviewPairs.length} peer review assignments`)

      return { success: true, review_pairs: reviewPairs }
    } catch (error) {
      console.error('Error setting up peer review:', error)
      return { success: false, review_pairs: [] }
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  private shuffleArray(array: any[]): any[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private formatTimeSince(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Less than an hour ago'
  }
}

// ==========================================
// QUICK GRADING ASSISTANT
// ==========================================

export class QuickGradingAssistant {
  /**
   * Generate suggested rubric scores based on automated assessment
   */
  static suggestRubricScores(
    codeValidation: any,
    codeTests: any,
    quizResults: any,
    completionData: any
  ): Record<string, number> {
    const suggestions: Record<string, number> = {}

    // Functionality score based on code tests and validation
    if (codeTests.success && codeValidation.valid) {
      suggestions.functionality = 3 // Exceeds
    } else if (codeTests.tests_passed > 0 || !codeValidation.valid) {
      suggestions.functionality = 2 // Meets
    } else {
      suggestions.functionality = 1 // Approaches
    }

    // Understanding score based on quiz performance
    if (quizResults.percentage >= 90) {
      suggestions.understanding = 3
    } else if (quizResults.percentage >= 75) {
      suggestions.understanding = 2
    } else if (quizResults.percentage >= 60) {
      suggestions.understanding = 1
    } else {
      suggestions.understanding = 0
    }

    // Code quality score (basic heuristics)
    const codeQualityScore = this.assessCodeQuality(completionData.submitted_code)
    suggestions.code_quality = codeQualityScore

    // Effort score based on completion
    if (completionData.completion_percentage >= 90) {
      suggestions.effort = 3
    } else if (completionData.completion_percentage >= 75) {
      suggestions.effort = 2
    } else {
      suggestions.effort = 1
    }

    return suggestions
  }

  /**
   * Basic code quality assessment
   */
  private static assessCodeQuality(code: string): number {
    if (!code) return 0

    let score = 1 // Base score

    // Check for good variable names
    const hasDescriptiveNames = /[a-zA-Z_][a-zA-Z0-9_]{3,}/.test(code)
    if (hasDescriptiveNames) score += 0.5

    // Check for comments
    if (code.includes('#')) score += 0.5

    // Check for proper spacing
    if (code.includes(' = ') && code.includes(', ')) score += 0.5

    // Check for f-strings or formatted output
    if (code.includes('f"') || code.includes("f'")) score += 0.5

    return Math.min(3, Math.round(score))
  }
}

// ==========================================
// EXPORT ENGINE
// ==========================================

export const assessmentEngine = new AssessmentEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Quick grade calculation for preview
 */
export function calculateQuickGrade(
  rubricScores: Record<string, number>,
  rubric: RubricCriterion[]
): { percentage: number; letter: string; level: string } {
  const avgScore = Object.values(rubricScores).reduce((sum, score) => sum + score, 0) / Object.keys(rubricScores).length
  const percentage = Math.round((avgScore / 3) * 100) // 3 is max rubric score
  
  let level = 'Approaches Expectations'
  if (avgScore >= 2.5) level = 'Exceeds Expectations'
  else if (avgScore >= 2) level = 'Meets Expectations'
  else if (avgScore >= 1) level = 'Approaches Expectations'
  else level = 'Does Not Meet Expectations'

  return {
    percentage,
    letter: assessmentEngine['calculateLetterGrade'](percentage),
    level
  }
}