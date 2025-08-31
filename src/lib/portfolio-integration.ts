// Portfolio Integration Service
// Automatically manages student portfolios when assignments are completed

import { createClient } from '@/lib/supabase'
import { portfolioEngine, portfolioSharing } from '@/lib/portfolio-engine'
import { processAssignmentCompletion } from '@/lib/xp-engine'

export interface PortfolioIntegrationConfig {
  auto_add_projects: boolean
  min_grade_threshold: number
  auto_deploy_enabled: boolean
  featured_grade_threshold: number
  share_by_default: boolean
}

class PortfolioIntegrationService {
  private supabase = createClient()
  
  private defaultConfig: PortfolioIntegrationConfig = {
    auto_add_projects: true,
    min_grade_threshold: 70, // Only add projects with 70%+ grades
    auto_deploy_enabled: false, // Students must enable manually
    featured_grade_threshold: 90, // Auto-feature projects with 90%+ grades
    share_by_default: false // Students must choose to share
  }

  // ==========================================
  // AUTOMATIC PORTFOLIO UPDATES
  // ==========================================

  /**
   * Called when student completes an assignment
   * Automatically adds worthy projects to portfolio
   */
  async onAssignmentCompletion(
    userId: string,
    assignmentId: string,
    completionData: {
      final_score: number
      submitted_code: string
      completion_time: string
      teacher_feedback?: string
    }
  ): Promise<{ portfolio_updated: boolean; deployed?: boolean }> {
    try {
      // Get user's portfolio configuration
      const config = await this.getUserPortfolioConfig(userId)
      
      // Check if project meets criteria for portfolio inclusion
      if (!config.auto_add_projects || completionData.final_score < config.min_grade_threshold) {
        return { portfolio_updated: false }
      }

      // Get assignment details
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single()

      if (!assignment) {
        throw new Error('Assignment not found')
      }

      // Create portfolio entry
      await this.addProjectToPortfolio(userId, {
        assignment_id: assignmentId,
        title: assignment.title,
        description: assignment.description,
        code: completionData.submitted_code,
        grade: completionData.final_score,
        week: assignment.week,
        completion_date: completionData.completion_time,
        featured: completionData.final_score >= config.featured_grade_threshold,
        teacher_feedback: completionData.teacher_feedback
      })

      // Auto-deploy if enabled
      let deployed = false
      if (config.auto_deploy_enabled) {
        const deployResult = await portfolioEngine.autoDeployPortfolio(userId, assignmentId)
        deployed = deployResult.success
      }

      // Send portfolio update notification
      await this.sendPortfolioUpdateNotification(userId, assignment.title, completionData.final_score)

      return { 
        portfolio_updated: true, 
        deployed 
      }
    } catch (error) {
      console.error('Error updating portfolio on assignment completion:', error)
      return { portfolio_updated: false }
    }
  }

  /**
   * Add project to student's portfolio
   */
  private async addProjectToPortfolio(
    userId: string,
    projectData: {
      assignment_id: string
      title: string
      description: string
      code: string
      grade: number
      week: number
      completion_date: string
      featured: boolean
      teacher_feedback?: string
    }
  ) {
    // Store portfolio project in database
    await this.supabase
      .from('portfolio_projects')
      .insert({
        user_id: userId,
        assignment_id: projectData.assignment_id,
        title: projectData.title,
        description: projectData.description,
        code: projectData.code,
        output: this.generateProjectOutput(projectData.code),
        grade: projectData.grade,
        week: projectData.week,
        completion_date: projectData.completion_date,
        featured: projectData.featured,
        tags: this.generateProjectTags(projectData.week, projectData.grade),
        teacher_feedback: projectData.teacher_feedback,
        public: false, // Default to private, students can make public later
        created_at: new Date().toISOString()
      })

    // If it's a featured project, consider adding to class showcase
    if (projectData.featured) {
      await this.considerForClassShowcase(userId, projectData.assignment_id)
    }
  }

  /**
   * Generate realistic output from Python code
   */
  private generateProjectOutput(code: string): string {
    if (!code) return ''
    
    const outputs: string[] = []
    const lines = code.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('print(')) {
        // Extract and simulate print statements
        const match = trimmed.match(/print\(([^)]+)\)/)
        if (match) {
          let content = match[1]
          // Simple string cleaning
          content = content.replace(/['"]/g, '').replace(/f['"]/g, '')
          // Replace variables with sample values
          content = content.replace(/\{[^}]+\}/g, '[value]')
          outputs.push(content)
        }
      }
    }
    
    return outputs.length > 0 ? outputs.join('\n') : '# Program executed successfully!'
  }

  /**
   * Generate appropriate tags for project
   */
  private generateProjectTags(week: number, grade: number): string[] {
    const tags = [`week-${week.toString().padStart(2, '0')}`]
    
    // Grade-based tags
    if (grade >= 95) tags.push('excellent')
    else if (grade >= 90) tags.push('outstanding')
    else if (grade >= 85) tags.push('great-work')
    else if (grade >= 80) tags.push('good-work')
    
    // Week-based content tags
    if (week <= 3) tags.push('basics', 'beginner')
    else if (week <= 8) tags.push('intermediate', 'problem-solving')
    else if (week <= 15) tags.push('advanced', 'complex-projects')
    else tags.push('capstone', 'final-projects')
    
    // Topic-based tags (would be more sophisticated in production)
    if (week === 1) tags.push('variables', 'fundamentals')
    if (week === 2) tags.push('user-input', 'interaction')
    if (week >= 5 && week <= 7) tags.push('loops', 'iteration')
    if (week >= 10 && week <= 12) tags.push('functions', 'modular-code')
    
    return tags
  }

  // ==========================================
  // PORTFOLIO CONFIGURATION
  // ==========================================

  /**
   * Get user's portfolio configuration
   */
  async getUserPortfolioConfig(userId: string): Promise<PortfolioIntegrationConfig> {
    try {
      const { data: user } = await this.supabase
        .from('users')
        .select('portfolio_config')
        .eq('id', userId)
        .single()

      return {
        ...this.defaultConfig,
        ...user?.portfolio_config
      }
    } catch (error) {
      console.error('Error getting portfolio config:', error)
      return this.defaultConfig
    }
  }

  /**
   * Update user's portfolio configuration
   */
  async updatePortfolioConfig(
    userId: string,
    config: Partial<PortfolioIntegrationConfig>
  ): Promise<boolean> {
    try {
      const currentConfig = await this.getUserPortfolioConfig(userId)
      const newConfig = { ...currentConfig, ...config }

      await this.supabase
        .from('users')
        .update({ portfolio_config: newConfig })
        .eq('id', userId)

      return true
    } catch (error) {
      console.error('Error updating portfolio config:', error)
      return false
    }
  }

  // ==========================================
  // CLASS SHOWCASE MANAGEMENT
  // ==========================================

  /**
   * Consider project for class showcase
   */
  private async considerForClassShowcase(userId: string, assignmentId: string) {
    try {
      // Check if project meets showcase criteria
      const { data: project } = await this.supabase
        .from('portfolio_projects')
        .select('*, assignments!inner(*)')
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)
        .single()

      if (!project || project.grade < 92) return

      // Add to potential showcase (teacher can approve)
      await this.supabase
        .from('showcase_nominations')
        .insert({
          user_id: userId,
          project_id: project.id,
          assignment_id: assignmentId,
          nominated_at: new Date().toISOString(),
          status: 'pending_review',
          nomination_reason: `High quality work (${project.grade}%) in Week ${project.assignments.week}`
        })

    } catch (error) {
      console.error('Error considering project for showcase:', error)
    }
  }

  /**
   * Get class showcase projects for a given week
   */
  async getClassShowcase(week?: number): Promise<any[]> {
    try {
      let query = this.supabase
        .from('showcase_nominations')
        .select(`
          *,
          portfolio_projects!inner(*),
          users!inner(full_name, avatar_url)
        `)
        .eq('status', 'approved')

      if (week) {
        query = query.eq('portfolio_projects.week', week)
      }

      const { data: showcase } = await query.order('nominated_at', { ascending: false })

      return showcase || []
    } catch (error) {
      console.error('Error getting class showcase:', error)
      return []
    }
  }

  // ==========================================
  // PORTFOLIO SHARING & COLLABORATION
  // ==========================================

  /**
   * Enable portfolio sharing for student
   */
  async enablePortfolioSharing(
    userId: string,
    shareSettings: {
      public_portfolio: boolean
      allow_project_downloads: boolean
      show_grades: boolean
      allow_comments: boolean
    }
  ): Promise<{ success: boolean; portfolio_url?: string }> {
    try {
      await this.supabase
        .from('users')
        .update({
          portfolio_public: shareSettings.public_portfolio,
          portfolio_share_settings: shareSettings
        })
        .eq('id', userId)

      // Generate public portfolio URL if making public
      let portfolioUrl
      if (shareSettings.public_portfolio) {
        const portfolio = await portfolioEngine.generateStudentPortfolio(userId)
        portfolioUrl = `${window.location.origin}/portfolio/${userId}`
      }

      return { success: true, portfolio_url: portfolioUrl }
    } catch (error) {
      console.error('Error enabling portfolio sharing:', error)
      return { success: false }
    }
  }

  /**
   * Get portfolio sharing analytics
   */
  async getPortfolioAnalytics(userId: string): Promise<{
    total_views: number
    project_downloads: number
    portfolio_shares: number
    featured_projects: number
    showcase_nominations: number
  }> {
    try {
      // In a real implementation, these would be tracked in the database
      const mockAnalytics = {
        total_views: Math.floor(Math.random() * 150) + 50,
        project_downloads: Math.floor(Math.random() * 25) + 5,
        portfolio_shares: Math.floor(Math.random() * 10) + 2,
        featured_projects: Math.floor(Math.random() * 5) + 1,
        showcase_nominations: Math.floor(Math.random() * 3)
      }

      return mockAnalytics
    } catch (error) {
      console.error('Error getting portfolio analytics:', error)
      return {
        total_views: 0,
        project_downloads: 0,
        portfolio_shares: 0,
        featured_projects: 0,
        showcase_nominations: 0
      }
    }
  }

  // ==========================================
  // NOTIFICATIONS & COMMUNICATION
  // ==========================================

  /**
   * Send portfolio update notification to student
   */
  private async sendPortfolioUpdateNotification(
    userId: string,
    assignmentTitle: string,
    grade: number
  ) {
    try {
      // Create in-app notification
      await this.supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'portfolio_update',
          title: '🎨 Portfolio Updated!',
          message: `Your "${assignmentTitle}" project has been added to your portfolio with a grade of ${grade}%!`,
          data: {
            assignment_title: assignmentTitle,
            grade: grade,
            action_url: '/portfolio'
          },
          created_at: new Date().toISOString()
        })

      // If high grade, send achievement notification
      if (grade >= 90) {
        await this.supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'achievement',
            title: '⭐ Outstanding Work!',
            message: `Your "${assignmentTitle}" project scored ${grade}% and has been featured in your portfolio!`,
            data: {
              achievement_type: 'featured_project',
              assignment_title: assignmentTitle,
              grade: grade
            },
            created_at: new Date().toISOString()
          })
      }
    } catch (error) {
      console.error('Error sending portfolio notification:', error)
    }
  }

  // ==========================================
  // PORTFOLIO EXPORT & BACKUP
  // ==========================================

  /**
   * Export portfolio data for backup or transfer
   */
  async exportPortfolioData(userId: string): Promise<{
    success: boolean
    data?: any
    downloadUrl?: string
  }> {
    try {
      const portfolio = await portfolioEngine.generateStudentPortfolio(userId)
      
      // Create comprehensive export
      const exportData = {
        portfolio: portfolio,
        export_date: new Date().toISOString(),
        export_version: '1.0',
        metadata: {
          total_projects: portfolio.projects.length,
          total_xp: portfolio.total_xp,
          badges_earned: portfolio.badges.length,
          skills_mastered: portfolio.skills.length
        }
      }

      // Generate download blob (in a real app, this would be stored temporarily)
      const exportBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const downloadUrl = URL.createObjectURL(exportBlob)

      return {
        success: true,
        data: exportData,
        downloadUrl
      }
    } catch (error) {
      console.error('Error exporting portfolio:', error)
      return { success: false }
    }
  }
}

// ==========================================
// PORTFOLIO AUTOMATION HOOKS
// ==========================================

export class PortfolioAutomationHooks {
  private integrationService = new PortfolioIntegrationService()

  /**
   * Hook: Called when assignment is graded
   */
  async onAssignmentGraded(userId: string, assignmentId: string, gradeData: any) {
    return await this.integrationService.onAssignmentCompletion(userId, assignmentId, gradeData)
  }

  /**
   * Hook: Called when student earns a badge
   */
  async onBadgeEarned(userId: string, badgeName: string) {
    // Portfolio will automatically include badges when regenerated
    console.log(`Portfolio will reflect new badge: ${badgeName} for user ${userId}`)
  }

  /**
   * Hook: Called when XP milestone is reached
   */
  async onXPMilestone(userId: string, newLevel: number, totalXP: number) {
    // Check if auto-deployment should be triggered
    if (newLevel % 5 === 0) { // Every 5 levels
      const config = await this.integrationService.getUserPortfolioConfig(userId)
      if (config.auto_deploy_enabled) {
        await portfolioEngine.autoDeployPortfolio(userId, `level_${newLevel}_milestone`)
      }
    }
  }
}

// ==========================================
// EXPORT SERVICE
// ==========================================

export const portfolioIntegration = new PortfolioIntegrationService()
export const portfolioHooks = new PortfolioAutomationHooks()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Initialize portfolio system for new student
 */
export async function initializeStudentPortfolio(userId: string): Promise<boolean> {
  try {
    await portfolioIntegration.updatePortfolioConfig(userId, {
      auto_add_projects: true,
      min_grade_threshold: 70,
      auto_deploy_enabled: false,
      featured_grade_threshold: 90,
      share_by_default: false
    })

    console.log(`Portfolio system initialized for user ${userId}`)
    return true
  } catch (error) {
    console.error('Error initializing portfolio:', error)
    return false
  }
}

/**
 * Check if student should be notified about portfolio features
 */
export function shouldPromptPortfolioSetup(completedAssignments: number): boolean {
  return completedAssignments === 3 // After 3rd assignment, suggest portfolio setup
}