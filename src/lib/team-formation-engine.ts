// Team Formation and Draft Day System
// Advanced team formation algorithms and collaborative project management

import { createClient } from '@/lib/supabase'
import { xpEngine } from './xp-engine'
import { badgeEngine } from './xp-engine'

export interface StudentProfile {
  user_id: string
  full_name: string
  email: string
  total_xp: number
  current_level: number
  badge_count: number
  programming_skills: SkillLevel[]
  collaboration_rating: number
  availability_schedule: string[]
  preferred_roles: TeamRole[]
  previous_team_ratings: number[]
  strengths: string[]
  learning_goals: string[]
}

export interface SkillLevel {
  skill_name: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  confidence_score: number // 1-10
  evidence_count: number // Number of assignments demonstrating this skill
}

export type TeamRole = 'leader' | 'developer' | 'designer' | 'tester' | 'researcher' | 'communicator'

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  project_id: string
  formation_method: 'random' | 'balanced' | 'skill_based' | 'draft' | 'self_selected'
  created_at: string
  status: 'forming' | 'active' | 'completed' | 'dissolved'
  team_dynamics_score: number
  collaboration_metrics: CollaborationMetrics
}

export interface TeamMember {
  user_id: string
  student_profile: StudentProfile
  team_role: TeamRole
  leadership_score: number
  contribution_score: number
  peer_ratings: PeerRating[]
  joined_at: string
  is_captain: boolean
}

export interface CollaborationMetrics {
  communication_frequency: number
  task_completion_rate: number
  conflict_resolution_score: number
  innovation_index: number
  learning_growth_rate: number
  project_satisfaction: number
}

export interface PeerRating {
  rater_id: string
  collaboration_score: number // 1-5
  communication_score: number // 1-5
  reliability_score: number // 1-5
  creativity_score: number // 1-5
  feedback: string
  created_at: string
}

export interface DraftEvent {
  id: string
  name: string
  description: string
  project_ids: string[]
  max_teams: number
  team_size_min: number
  team_size_max: number
  draft_type: 'snake' | 'linear' | 'auction' | 'hybrid'
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
  scheduled_start: string
  actual_start?: string
  completed_at?: string
  draft_rounds: DraftRound[]
  participant_pool: string[] // user_ids eligible for draft
  team_captains: string[] // user_ids selected as team captains
}

export interface DraftRound {
  round_number: number
  picks: DraftPick[]
  time_limit_minutes: number
  status: 'pending' | 'active' | 'completed'
}

export interface DraftPick {
  pick_number: number
  team_id: string
  captain_id: string
  selected_student_id: string
  selection_reason?: string
  pick_timestamp: string
  time_used_seconds: number
}

export interface ProjectTemplate {
  id: string
  title: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration_weeks: number
  required_skills: string[]
  recommended_team_size: number
  max_team_size: number
  learning_objectives: string[]
  deliverables: string[]
  collaboration_intensity: 'low' | 'medium' | 'high'
  technical_requirements: string[]
}

class TeamFormationEngine {
  private supabase = createClient()

  // ==========================================
  // STUDENT PROFILE ANALYSIS
  // ==========================================

  /**
   * Generate comprehensive student profile for team formation
   */
  async generateStudentProfile(userId: string): Promise<StudentProfile> {
    try {
      // Get basic user info
      const { data: user } = await this.supabase
        .from('users')
        .select('id, full_name, email')
        .eq('id', userId)
        .single()

      if (!user) throw new Error('User not found')

      // Get XP and badge data
      const xpSummary = await xpEngine.getStudentXPSummary(userId)
      const badgeData = await badgeEngine.getStudentBadges(userId)

      // Analyze programming skills from completed assignments
      const programmingSkills = await this.analyzeStudentSkills(userId)

      // Calculate collaboration rating from previous team projects
      const collaborationRating = await this.calculateCollaborationRating(userId)

      // Get availability and preferences (would come from student settings)
      const availabilitySchedule = await this.getStudentAvailability(userId)
      const preferredRoles = await this.getPreferredRoles(userId)

      // Analyze strengths from assignment performance
      const strengths = await this.identifyStudentStrengths(userId)

      // Get learning goals (from student profile or assignments)
      const learningGoals = await this.getStudentLearningGoals(userId)

      const profile: StudentProfile = {
        user_id: userId,
        full_name: user.full_name || user.email,
        email: user.email,
        total_xp: xpSummary.total_xp,
        current_level: xpSummary.current_level,
        badge_count: badgeData.unlocked_badges.length,
        programming_skills: programmingSkills,
        collaboration_rating: collaborationRating,
        availability_schedule: availabilitySchedule,
        preferred_roles: preferredRoles,
        previous_team_ratings: await this.getPreviousTeamRatings(userId),
        strengths: strengths,
        learning_goals: learningGoals
      }

      return profile
    } catch (error) {
      console.error('Error generating student profile:', error)
      // Return minimal profile as fallback
      return {
        user_id: userId,
        full_name: 'Unknown Student',
        email: '',
        total_xp: 0,
        current_level: 1,
        badge_count: 0,
        programming_skills: [],
        collaboration_rating: 3.0,
        availability_schedule: [],
        preferred_roles: ['developer'],
        previous_team_ratings: [],
        strengths: [],
        learning_goals: []
      }
    }
  }

  /**
   * Analyze student's programming skills from assignment history
   */
  private async analyzeStudentSkills(userId: string): Promise<SkillLevel[]> {
    try {
      // Get completed assignments with scores
      const { data: assignments } = await this.supabase
        .from('student_progress')
        .select(`
          final_score,
          assignments!inner(
            title,
            week,
            skills_practiced
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')

      const skillAnalysis = new Map<string, { scores: number[], count: number }>()

      assignments?.forEach((assignment: any) => {
        const skills = assignment.assignments.skills_practiced || []
        const score = assignment.final_score || 0

        skills.forEach((skill: string) => {
          if (!skillAnalysis.has(skill)) {
            skillAnalysis.set(skill, { scores: [], count: 0 })
          }
          const data = skillAnalysis.get(skill)!
          data.scores.push(score)
          data.count++
        })
      })

      const skillLevels: SkillLevel[] = []
      
      for (const [skillName, data] of skillAnalysis.entries()) {
        const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
        const confidenceScore = Math.min(10, Math.round((avgScore / 10) + (data.count * 0.5)))
        
        let proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
        if (avgScore >= 95 && data.count >= 5) proficiency = 'expert'
        else if (avgScore >= 85 && data.count >= 3) proficiency = 'advanced'
        else if (avgScore >= 75 && data.count >= 2) proficiency = 'intermediate'
        else proficiency = 'beginner'

        skillLevels.push({
          skill_name: skillName,
          proficiency,
          confidence_score: confidenceScore,
          evidence_count: data.count
        })
      }

      return skillLevels.sort((a, b) => b.confidence_score - a.confidence_score)
    } catch (error) {
      console.error('Error analyzing student skills:', error)
      return [
        {
          skill_name: 'python_basics',
          proficiency: 'beginner',
          confidence_score: 5,
          evidence_count: 1
        }
      ]
    }
  }

  /**
   * Calculate collaboration rating from previous team experiences
   */
  private async calculateCollaborationRating(userId: string): Promise<number> {
    try {
      // Get peer ratings from previous team projects
      const { data: ratings } = await this.supabase
        .from('peer_ratings')
        .select('collaboration_score, communication_score, reliability_score')
        .eq('ratee_id', userId) // This student being rated by others

      if (!ratings || ratings.length === 0) {
        return 3.5 // Default neutral rating for new students
      }

      const totalScore = ratings.reduce((sum: number, rating: any) => {
        return sum + ((rating.collaboration_score + rating.communication_score + rating.reliability_score) / 3)
      }, 0)

      const averageRating = totalScore / ratings.length
      return Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    } catch (error) {
      console.error('Error calculating collaboration rating:', error)
      return 3.5
    }
  }

  /**
   * Get student availability schedule
   */
  private async getStudentAvailability(userId: string): Promise<string[]> {
    try {
      const { data: preferences } = await this.supabase
        .from('student_preferences')
        .select('availability_schedule')
        .eq('user_id', userId)
        .single()

      return preferences?.availability_schedule || [
        'weekday_evenings',
        'weekend_mornings'
      ]
    } catch (error) {
      return ['weekday_evenings', 'weekend_mornings']
    }
  }

  /**
   * Get student's preferred team roles
   */
  private async getPreferredRoles(userId: string): Promise<TeamRole[]> {
    try {
      const { data: preferences } = await this.supabase
        .from('student_preferences')
        .select('preferred_roles')
        .eq('user_id', userId)
        .single()

      return preferences?.preferred_roles || ['developer']
    } catch (error) {
      return ['developer']
    }
  }

  /**
   * Identify student strengths from performance patterns
   */
  private async identifyStudentStrengths(userId: string): Promise<string[]> {
    const strengths: string[] = []
    
    try {
      // Analyze assignment performance patterns
      const { data: assignments } = await this.supabase
        .from('student_progress')
        .select(`
          final_score,
          completion_time_minutes,
          assignments!inner(
            assignment_type,
            difficulty
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (!assignments || assignments.length === 0) {
        return ['eager_learner']
      }

      const avgScore = assignments.reduce((sum: number, a: any) => sum + (a.final_score || 0), 0) / assignments.length
      const avgTime = assignments.reduce((sum: number, a: any) => sum + (a.completion_time_minutes || 60), 0) / assignments.length

      if (avgScore >= 90) strengths.push('high_achiever')
      if (avgScore >= 85 && avgTime < 30) strengths.push('efficient_coder')
      if (avgTime < 25) strengths.push('quick_learner')
      
      const teamProjects = assignments.filter((a: any) => a.assignments.assignment_type === 'TEAM')
      if (teamProjects.length > 0) {
        const teamAvg = teamProjects.reduce((sum: number, a: any) => sum + (a.final_score || 0), 0) / teamProjects.length
        if (teamAvg > avgScore) strengths.push('team_player')
      }

      const hardProjects = assignments.filter((a: any) => a.assignments.difficulty === 'advanced')
      if (hardProjects.length > 0) {
        const hardAvg = hardProjects.reduce((sum: number, a: any) => sum + (a.final_score || 0), 0) / hardProjects.length
        if (hardAvg >= 80) strengths.push('problem_solver')
      }

      return strengths.length > 0 ? strengths : ['dedicated_learner']
    } catch (error) {
      console.error('Error identifying student strengths:', error)
      return ['dedicated_learner']
    }
  }

  /**
   * Get student learning goals
   */
  private async getStudentLearningGoals(userId: string): Promise<string[]> {
    try {
      const { data: preferences } = await this.supabase
        .from('student_preferences')
        .select('learning_goals')
        .eq('user_id', userId)
        .single()

      return preferences?.learning_goals || [
        'master_python_fundamentals',
        'build_real_world_projects',
        'improve_problem_solving'
      ]
    } catch (error) {
      return [
        'master_python_fundamentals',
        'build_real_world_projects',
        'improve_problem_solving'
      ]
    }
  }

  /**
   * Get previous team ratings for this student
   */
  private async getPreviousTeamRatings(userId: string): Promise<number[]> {
    try {
      const { data: ratings } = await this.supabase
        .from('team_performance_ratings')
        .select('overall_rating')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      return ratings?.map((r: any) => r.overall_rating) || []
    } catch (error) {
      return []
    }
  }

  // ==========================================
  // TEAM FORMATION ALGORITHMS
  // ==========================================

  /**
   * Form balanced teams using skill-based algorithm
   */
  async formBalancedTeams(
    studentProfiles: StudentProfile[],
    teamSize: number,
    projectRequirements: ProjectTemplate
  ): Promise<Team[]> {
    try {
      if (studentProfiles.length < teamSize) {
        throw new Error('Not enough students for team formation')
      }

      const numTeams = Math.floor(studentProfiles.length / teamSize)
      const teams: Team[] = []

      // Sort students by overall capability score
      const rankedStudents = studentProfiles
        .map(profile => ({
          ...profile,
          capability_score: this.calculateCapabilityScore(profile, projectRequirements)
        }))
        .sort((a, b) => b.capability_score - a.capability_score)

      // Snake draft algorithm for balanced distribution
      for (let teamIndex = 0; teamIndex < numTeams; teamIndex++) {
        const team: Team = {
          id: `team_${Date.now()}_${teamIndex}`,
          name: `Team ${teamIndex + 1}`,
          members: [],
          project_id: projectRequirements.id,
          formation_method: 'balanced',
          created_at: new Date().toISOString(),
          status: 'forming',
          team_dynamics_score: 0,
          collaboration_metrics: this.initializeCollaborationMetrics()
        }

        teams.push(team)
      }

      // Distribute students using snake draft pattern
      let currentTeamIndex = 0
      let direction = 1 // 1 for forward, -1 for backward

      for (let i = 0; i < rankedStudents.length && teams.every(t => t.members.length < teamSize); i++) {
        const student = rankedStudents[i]
        const team = teams[currentTeamIndex]

        const teamMember: TeamMember = {
          user_id: student.user_id,
          student_profile: student,
          team_role: this.assignOptimalRole(student, team, projectRequirements),
          leadership_score: this.calculateLeadershipScore(student),
          contribution_score: 0, // Will be updated during project
          peer_ratings: [],
          joined_at: new Date().toISOString(),
          is_captain: team.members.length === 0 // First member is captain
        }

        team.members.push(teamMember)

        // Snake draft logic
        if (direction === 1) {
          currentTeamIndex++
          if (currentTeamIndex >= numTeams) {
            currentTeamIndex = numTeams - 1
            direction = -1
          }
        } else {
          currentTeamIndex--
          if (currentTeamIndex < 0) {
            currentTeamIndex = 0
            direction = 1
          }
        }
      }

      // Calculate team dynamics scores
      teams.forEach(team => {
        team.team_dynamics_score = this.calculateTeamDynamicsScore(team)
      })

      return teams
    } catch (error) {
      console.error('Error forming balanced teams:', error)
      return []
    }
  }

  /**
   * Calculate overall capability score for a student
   */
  private calculateCapabilityScore(
    profile: StudentProfile,
    projectRequirements: ProjectTemplate
  ): number {
    let score = 0

    // XP and level contribution (30%)
    score += (profile.total_xp / 1000) * 30

    // Skills match with project requirements (40%)
    const requiredSkills = projectRequirements.required_skills
    const studentSkills = profile.programming_skills.map(s => s.skill_name)
    const skillMatch = requiredSkills.filter(skill => studentSkills.includes(skill))
    score += (skillMatch.length / requiredSkills.length) * 40

    // Collaboration rating (20%)
    score += (profile.collaboration_rating / 5) * 20

    // Badge count indicates diverse experience (10%)
    score += Math.min(profile.badge_count / 10, 1) * 10

    return Math.round(score)
  }

  /**
   * Assign optimal role based on student profile and team composition
   */
  private assignOptimalRole(
    student: StudentProfile,
    team: Team,
    projectRequirements: ProjectTemplate
  ): TeamRole {
    const existingRoles = team.members.map(m => m.team_role)
    const preferredRoles = student.preferred_roles.filter(role => !existingRoles.includes(role))

    if (preferredRoles.length > 0) {
      return preferredRoles[0]
    }

    // Assign based on strengths and team needs
    if (student.strengths.includes('team_player') && !existingRoles.includes('leader')) {
      return 'leader'
    }

    if (student.strengths.includes('problem_solver') && !existingRoles.includes('developer')) {
      return 'developer'
    }

    if (student.strengths.includes('creative_thinker') && !existingRoles.includes('designer')) {
      return 'designer'
    }

    // Default role assignment
    const roleOrder: TeamRole[] = ['developer', 'tester', 'researcher', 'communicator', 'designer']
    for (const role of roleOrder) {
      if (!existingRoles.includes(role)) {
        return role
      }
    }

    return 'developer'
  }

  /**
   * Calculate leadership score for student
   */
  private calculateLeadershipScore(profile: StudentProfile): number {
    let score = 0

    // High XP indicates experience (30%)
    score += Math.min(profile.total_xp / 2000, 1) * 30

    // Collaboration rating (40%)
    score += (profile.collaboration_rating / 5) * 40

    // Leadership-related strengths (20%)
    const leadershipStrengths = ['team_player', 'communicator', 'problem_solver']
    const matchingStrengths = profile.strengths.filter(s => leadershipStrengths.includes(s))
    score += (matchingStrengths.length / leadershipStrengths.length) * 20

    // Badge diversity indicates well-rounded skills (10%)
    score += Math.min(profile.badge_count / 15, 1) * 10

    return Math.round(score)
  }

  /**
   * Calculate team dynamics score
   */
  private calculateTeamDynamicsScore(team: Team): number {
    if (team.members.length === 0) return 0

    let score = 0

    // Skill diversity (25%)
    const allSkills = team.members.flatMap(m => m.student_profile.programming_skills.map(s => s.skill_name))
    const uniqueSkills = new Set(allSkills)
    score += Math.min(uniqueSkills.size / 8, 1) * 25

    // Experience balance (25%)
    const levels = team.members.map(m => m.student_profile.current_level)
    const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length
    const levelVariance = levels.reduce((sum, level) => sum + Math.abs(level - avgLevel), 0) / levels.length
    score += Math.max(0, (1 - levelVariance / 3)) * 25

    // Collaboration compatibility (25%)
    const avgCollaboration = team.members.reduce((sum, m) => sum + m.student_profile.collaboration_rating, 0) / team.members.length
    score += (avgCollaboration / 5) * 25

    // Role distribution (25%)
    const roles = team.members.map(m => m.team_role)
    const uniqueRoles = new Set(roles)
    score += (uniqueRoles.size / Math.min(team.members.length, 6)) * 25

    return Math.round(score)
  }

  /**
   * Initialize collaboration metrics for new team
   */
  private initializeCollaborationMetrics(): CollaborationMetrics {
    return {
      communication_frequency: 0,
      task_completion_rate: 0,
      conflict_resolution_score: 5.0, // Start with neutral score
      innovation_index: 0,
      learning_growth_rate: 0,
      project_satisfaction: 0
    }
  }

  // ==========================================
  // DRAFT DAY SYSTEM
  // ==========================================

  /**
   * Initialize draft event
   */
  async createDraftEvent(
    name: string,
    description: string,
    projectIds: string[],
    maxTeams: number,
    teamSizeMin: number,
    teamSizeMax: number,
    draftType: 'snake' | 'linear' | 'auction' | 'hybrid',
    scheduledStart: string,
    eligibleStudentIds: string[]
  ): Promise<DraftEvent> {
    try {
      const draftEvent: DraftEvent = {
        id: `draft_${Date.now()}`,
        name,
        description,
        project_ids: projectIds,
        max_teams: maxTeams,
        team_size_min: teamSizeMin,
        team_size_max: teamSizeMax,
        draft_type: draftType,
        status: 'scheduled',
        scheduled_start: scheduledStart,
        draft_rounds: [],
        participant_pool: eligibleStudentIds,
        team_captains: []
      }

      // Save to database
      const { error } = await this.supabase
        .from('draft_events')
        .insert(draftEvent)

      if (error) {
        console.error('Error saving draft event:', error)
      }

      return draftEvent
    } catch (error) {
      console.error('Error creating draft event:', error)
      throw error
    }
  }

  /**
   * Select team captains for draft
   */
  async selectTeamCaptains(
    draftEventId: string,
    selectionMethod: 'top_performers' | 'volunteer' | 'teacher_selected' | 'random'
  ): Promise<string[]> {
    try {
      const { data: draftEvent } = await this.supabase
        .from('draft_events')
        .select('*')
        .eq('id', draftEventId)
        .single()

      if (!draftEvent) throw new Error('Draft event not found')

      let captains: string[] = []

      switch (selectionMethod) {
        case 'top_performers':
          captains = await this.selectTopPerformerCaptains(draftEvent.participant_pool, draftEvent.max_teams)
          break
        case 'volunteer':
          captains = await this.selectVolunteerCaptains(draftEvent.participant_pool, draftEvent.max_teams)
          break
        case 'teacher_selected':
          captains = await this.selectTeacherChosenCaptains(draftEvent.participant_pool, draftEvent.max_teams)
          break
        case 'random':
          captains = this.selectRandomCaptains(draftEvent.participant_pool, draftEvent.max_teams)
          break
      }

      // Update draft event with selected captains
      await this.supabase
        .from('draft_events')
        .update({ team_captains: captains })
        .eq('id', draftEventId)

      return captains
    } catch (error) {
      console.error('Error selecting team captains:', error)
      return []
    }
  }

  /**
   * Select top performers as captains
   */
  private async selectTopPerformerCaptains(participantPool: string[], maxTeams: number): Promise<string[]> {
    const profiles = await Promise.all(
      participantPool.map(userId => this.generateStudentProfile(userId))
    )

    return profiles
      .sort((a, b) => (b.total_xp + b.collaboration_rating * 100) - (a.total_xp + a.collaboration_rating * 100))
      .slice(0, maxTeams)
      .map(p => p.user_id)
  }

  /**
   * Select volunteer captains
   */
  private async selectVolunteerCaptains(participantPool: string[], maxTeams: number): Promise<string[]> {
    try {
      const { data: volunteers } = await this.supabase
        .from('captain_volunteers')
        .select('user_id')
        .in('user_id', participantPool)
        .limit(maxTeams)

      return volunteers?.map((v: any) => v.user_id) || this.selectRandomCaptains(participantPool, maxTeams)
    } catch (error) {
      return this.selectRandomCaptains(participantPool, maxTeams)
    }
  }

  /**
   * Select teacher-chosen captains
   */
  private async selectTeacherChosenCaptains(participantPool: string[], maxTeams: number): Promise<string[]> {
    try {
      const { data: chosen } = await this.supabase
        .from('teacher_captain_selections')
        .select('user_id')
        .in('user_id', participantPool)
        .limit(maxTeams)

      return chosen?.map((c: any) => c.user_id) || this.selectRandomCaptains(participantPool, maxTeams)
    } catch (error) {
      return this.selectRandomCaptains(participantPool, maxTeams)
    }
  }

  /**
   * Select random captains
   */
  private selectRandomCaptains(participantPool: string[], maxTeams: number): string[] {
    const shuffled = [...participantPool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, maxTeams)
  }

  /**
   * Start draft process
   */
  async startDraft(draftEventId: string): Promise<boolean> {
    try {
      const { data: draftEvent } = await this.supabase
        .from('draft_events')
        .select('*')
        .eq('id', draftEventId)
        .single()

      if (!draftEvent) return false

      // Initialize draft rounds
      const rounds: DraftRound[] = []
      const roundsNeeded = Math.ceil((draftEvent.participant_pool.length - draftEvent.team_captains.length) / draftEvent.max_teams)

      for (let i = 0; i < roundsNeeded; i++) {
        rounds.push({
          round_number: i + 1,
          picks: [],
          time_limit_minutes: 5, // 5 minutes per pick
          status: i === 0 ? 'active' : 'pending'
        })
      }

      // Update draft event status
      await this.supabase
        .from('draft_events')
        .update({
          status: 'active',
          actual_start: new Date().toISOString(),
          draft_rounds: rounds
        })
        .eq('id', draftEventId)

      return true
    } catch (error) {
      console.error('Error starting draft:', error)
      return false
    }
  }

  /**
   * Process draft pick
   */
  async processDraftPick(
    draftEventId: string,
    captainId: string,
    selectedStudentId: string,
    selectionReason?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { data: draftEvent } = await this.supabase
        .from('draft_events')
        .select('*')
        .eq('id', draftEventId)
        .single()

      if (!draftEvent) {
        return { success: false, message: 'Draft event not found' }
      }

      if (draftEvent.status !== 'active') {
        return { success: false, message: 'Draft is not active' }
      }

      // Validate captain can make this pick
      const currentRound = draftEvent.draft_rounds.find((r: any) => r.status === 'active')
      if (!currentRound) {
        return { success: false, message: 'No active round found' }
      }

      // Create draft pick
      const pick: DraftPick = {
        pick_number: currentRound.picks.length + 1,
        team_id: `team_${captainId}`,
        captain_id: captainId,
        selected_student_id: selectedStudentId,
        selection_reason: selectionReason || '',
        pick_timestamp: new Date().toISOString(),
        time_used_seconds: 0 // Would calculate from timer
      }

      // Add pick to current round
      currentRound.picks.push(pick)

      // Update draft event
      await this.supabase
        .from('draft_events')
        .update({ draft_rounds: draftEvent.draft_rounds })
        .eq('id', draftEventId)

      // Check if round or draft is complete
      await this.checkDraftProgress(draftEventId)

      return { success: true, message: 'Pick processed successfully' }
    } catch (error) {
      console.error('Error processing draft pick:', error)
      return { success: false, message: 'Error processing pick' }
    }
  }

  /**
   * Check draft progress and advance rounds/complete draft
   */
  private async checkDraftProgress(draftEventId: string): Promise<void> {
    try {
      const { data: draftEvent } = await this.supabase
        .from('draft_events')
        .select('*')
        .eq('id', draftEventId)
        .single()

      if (!draftEvent) return

      const currentRound = draftEvent.draft_rounds.find((r: any) => r.status === 'active')
      if (!currentRound) return

      // Check if current round is complete
      if (currentRound.picks.length >= draftEvent.max_teams) {
        currentRound.status = 'completed'

        // Activate next round if available
        const nextRoundIndex = draftEvent.draft_rounds.findIndex((r: any) => r.status === 'pending')
        if (nextRoundIndex !== -1) {
          draftEvent.draft_rounds[nextRoundIndex].status = 'active'
        } else {
          // Draft is complete
          draftEvent.status = 'completed'
          draftEvent.completed_at = new Date().toISOString()
        }

        await this.supabase
          .from('draft_events')
          .update(draftEvent)
          .eq('id', draftEventId)
      }
    } catch (error) {
      console.error('Error checking draft progress:', error)
    }
  }

  // ==========================================
  // TEAM MANAGEMENT
  // ==========================================

  /**
   * Create teams from completed draft
   */
  async createTeamsFromDraft(draftEventId: string): Promise<Team[]> {
    try {
      const { data: draftEvent } = await this.supabase
        .from('draft_events')
        .select('*')
        .eq('id', draftEventId)
        .single()

      if (!draftEvent || draftEvent.status !== 'completed') {
        return []
      }

      const teams: Team[] = []
      
      // Group picks by team/captain
      const teamPicks = new Map<string, DraftPick[]>()
      
      draftEvent.draft_rounds.forEach((round: DraftRound) => {
        round.picks.forEach((pick: DraftPick) => {
          if (!teamPicks.has(pick.team_id)) {
            teamPicks.set(pick.team_id, [])
          }
          teamPicks.get(pick.team_id)!.push(pick)
        })
      })

      // Create teams from draft results
      for (const [teamId, picks] of teamPicks.entries()) {
        const captainId = picks[0]?.captain_id
        const captainProfile = await this.generateStudentProfile(captainId)

        const members: TeamMember[] = [
          // Add captain first
          {
            user_id: captainId,
            student_profile: captainProfile,
            team_role: 'leader',
            leadership_score: this.calculateLeadershipScore(captainProfile),
            contribution_score: 0,
            peer_ratings: [],
            joined_at: new Date().toISOString(),
            is_captain: true
          }
        ]

        // Add drafted members
        for (const pick of picks) {
          const memberProfile = await this.generateStudentProfile(pick.selected_student_id)
          members.push({
            user_id: pick.selected_student_id,
            student_profile: memberProfile,
            team_role: 'developer', // Will be assigned later based on preferences
            leadership_score: this.calculateLeadershipScore(memberProfile),
            contribution_score: 0,
            peer_ratings: [],
            joined_at: pick.pick_timestamp,
            is_captain: false
          })
        }

        const team: Team = {
          id: teamId,
          name: `${captainProfile.full_name}'s Team`,
          members,
          project_id: draftEvent.project_ids[0], // Assign first project for now
          formation_method: 'draft',
          created_at: draftEvent.completed_at || new Date().toISOString(),
          status: 'active',
          team_dynamics_score: this.calculateTeamDynamicsScore({ members } as Team),
          collaboration_metrics: this.initializeCollaborationMetrics()
        }

        teams.push(team)
      }

      // Save teams to database
      for (const team of teams) {
        await this.supabase
          .from('teams')
          .insert(team)
      }

      return teams
    } catch (error) {
      console.error('Error creating teams from draft:', error)
      return []
    }
  }
}

// ==========================================
// EXPORT ENGINE
// ==========================================

export const teamFormationEngine = new TeamFormationEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Generate mock student profiles for testing
 */
export function generateMockStudentProfiles(count: number): StudentProfile[] {
  const names = [
    'Alex Chen', 'Jordan Smith', 'Taylor Johnson', 'Casey Brown', 'Morgan Davis',
    'Riley Wilson', 'Avery Garcia', 'Parker Miller', 'Sage Anderson', 'River Martinez'
  ]

  const skills = ['python_basics', 'web_development', 'data_analysis', 'algorithms', 'debugging', 'testing', 'ui_design']
  const strengths = ['problem_solver', 'team_player', 'quick_learner', 'creative_thinker', 'detail_oriented']

  return Array.from({ length: count }, (_, i) => ({
    user_id: `student_${i + 1}`,
    full_name: names[i % names.length] + ` ${i + 1}`,
    email: `student${i + 1}@codefly.edu`,
    total_xp: Math.floor(Math.random() * 2000) + 200,
    current_level: Math.floor(Math.random() * 8) + 1,
    badge_count: Math.floor(Math.random() * 12) + 1,
    programming_skills: skills.slice(0, Math.floor(Math.random() * 5) + 2).map(skill => ({
      skill_name: skill,
      proficiency: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
      confidence_score: Math.floor(Math.random() * 8) + 3,
      evidence_count: Math.floor(Math.random() * 5) + 1
    })),
    collaboration_rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    availability_schedule: ['weekday_evenings', 'weekend_mornings'],
    preferred_roles: ['developer', 'tester'][Math.floor(Math.random() * 2)] as any,
    previous_team_ratings: [],
    strengths: strengths.slice(0, Math.floor(Math.random() * 3) + 1),
    learning_goals: ['master_python_fundamentals', 'build_real_world_projects']
  }))
}

/**
 * Create sample project template
 */
export function createSampleProjectTemplate(): ProjectTemplate {
  return {
    id: 'web_app_project',
    title: 'Interactive Web Application',
    description: 'Build a full-stack web application with Python backend and modern frontend',
    difficulty_level: 'intermediate',
    estimated_duration_weeks: 4,
    required_skills: ['python_basics', 'web_development', 'databases', 'frontend_basics'],
    recommended_team_size: 4,
    max_team_size: 6,
    learning_objectives: [
      'Apply Python programming in web development',
      'Practice collaborative software development',
      'Learn version control and project management',
      'Implement user interface design principles'
    ],
    deliverables: [
      'Working web application',
      'Source code with documentation',
      'User manual and setup guide',
      'Project presentation'
    ],
    collaboration_intensity: 'high',
    technical_requirements: [
      'Python Flask/Django framework',
      'HTML/CSS/JavaScript frontend',
      'Database integration',
      'Git version control'
    ]
  }
}