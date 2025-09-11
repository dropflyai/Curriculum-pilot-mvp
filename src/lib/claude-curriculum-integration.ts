// Claude Subscription Integration for Agent Academy Curriculum
// Deep integration with educational content, progress tracking, and personalized learning

import { claudeOAuth } from '@/lib/claude-oauth-client'

interface LessonContext {
  operationId: string
  operationName: string
  week: number
  objective: string
  currentCode: string
  studentProgress: StudentProgress
  hints: string[]
  concepts: string[]
}

interface StudentProgress {
  completedOperations: string[]
  currentStruggleConcepts: string[]
  strengths: string[]
  codingStyle: 'beginner' | 'intermediate' | 'advanced'
  preferredExplanationStyle: 'visual' | 'textual' | 'hands-on'
  sessionHistory: LearningSession[]
}

interface LearningSession {
  timestamp: Date
  operation: string
  questionsAsked: number
  conceptsLearned: string[]
  codeWritten: number // lines of code
  errorsEncountered: string[]
  helpRequested: string[]
}

interface CurriculumPrompt {
  systemPrompt: string
  contextPrompt: string
  educationalGuidelines: string[]
}

export class ClaudeCurriculumIntegration {
  private currentLesson: LessonContext | null = null
  private studentProfile: StudentProgress | null = null

  constructor() {
    this.initializeStudentProfile()
  }

  // Initialize or load student profile
  private initializeStudentProfile(): void {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('agent_academy_student_profile')
    if (stored) {
      try {
        this.studentProfile = JSON.parse(stored)
      } catch (error) {
        console.warn('Failed to load student profile:', error)
        this.createNewStudentProfile()
      }
    } else {
      this.createNewStudentProfile()
    }
  }

  private createNewStudentProfile(): void {
    this.studentProfile = {
      completedOperations: [],
      currentStruggleConcepts: [],
      strengths: [],
      codingStyle: 'beginner',
      preferredExplanationStyle: 'hands-on',
      sessionHistory: []
    }
    this.saveStudentProfile()
  }

  private saveStudentProfile(): void {
    if (typeof window === 'undefined' || !this.studentProfile) return
    localStorage.setItem('agent_academy_student_profile', JSON.stringify(this.studentProfile))
  }

  // Set current lesson context
  setLessonContext(lesson: LessonContext): void {
    this.currentLesson = lesson
  }

  // Generate curriculum-specific prompts for Claude
  private generateCurriculumPrompt(): CurriculumPrompt {
    const operation = this.currentLesson?.operationName || 'General'
    const week = this.currentLesson?.week || 1
    const studentLevel = this.studentProfile?.codingStyle || 'beginner'

    const systemPrompt = `You are Claude, integrated into Agent Academy IDE - an elite spy-themed coding curriculum for ${studentLevel} Python programmers.

MISSION CONTEXT:
- Current Operation: ${operation} (Week ${week})
- Student Level: ${studentLevel}
- Learning Style: ${this.studentProfile?.preferredExplanationStyle}

YOUR ROLE AS AI INSTRUCTOR:
You are not just an AI assistant - you are an elite programming instructor training the next generation of AI agents. Every response should:

1. Maintain the spy/agent theme with tactical language
2. Provide educational value appropriate for ${studentLevel} level
3. Encourage problem-solving rather than giving direct answers
4. Build on previous operations and skills learned
5. Use real-world AI agent examples and applications

EDUCATIONAL PHILOSOPHY:
- Guide students to discover solutions themselves
- Provide hints and scaffolding rather than complete answers
- Connect coding concepts to AI agent development
- Celebrate progress and learning milestones
- Adapt explanations to student's learning style`

    const contextPrompt = this.currentLesson ? `
CURRENT MISSION STATUS:
Operation: ${this.currentLesson.operationName}
Objective: ${this.currentLesson.objective}
Week: ${this.currentLesson.week}

Student's Current Code:
\`\`\`python
${this.currentLesson.currentCode || '# No code yet'}
\`\`\`

Available Intel (Hints):
${this.currentLesson.hints.map(hint => `- ${hint}`).join('\n')}

Target Concepts:
${this.currentLesson.concepts.map(concept => `- ${concept}`).join('\n')}

Student Profile:
- Completed Operations: ${this.studentProfile?.completedOperations.join(', ') || 'None'}
- Current Challenges: ${this.studentProfile?.currentStruggleConcepts.join(', ') || 'None'}
- Strengths: ${this.studentProfile?.strengths.join(', ') || 'Learning in progress'}
` : ''

    const educationalGuidelines = [
      'Always relate coding concepts to AI agent development',
      'Use the spy theme consistently (agents, missions, operations, intel)',
      'Encourage experimentation and learning from mistakes',
      'Provide step-by-step guidance for complex problems',
      'Celebrate small wins and progress',
      'Connect current lesson to future operations',
      'Use real-world examples when possible',
      'Adapt complexity to student level',
      'Encourage questions and curiosity'
    ]

    return {
      systemPrompt,
      contextPrompt,
      educationalGuidelines
    }
  }

  // Send curriculum-aware message to Claude
  async sendCurriculumMessage(message: string, messageType: 'question' | 'help' | 'debug' | 'explain' = 'question'): Promise<string> {
    try {
      // Check if Claude is authenticated
      const isAuthenticated = await claudeOAuth.isAuthenticated()
      if (!isAuthenticated) {
        throw new Error('AUTHENTICATION_REQUIRED')
      }

      const prompt = this.generateCurriculumPrompt()
      
      // Construct the full message with educational context
      const fullMessage = `${prompt.systemPrompt}

${prompt.contextPrompt}

EDUCATIONAL GUIDELINES:
${prompt.educationalGuidelines.map(g => `- ${g}`).join('\n')}

STUDENT REQUEST (${messageType.toUpperCase()}):
${message}

RESPONSE REQUIREMENTS:
- Maintain spy/agent theme
- Provide educational value for ${this.studentProfile?.codingStyle} level
- ${messageType === 'debug' ? 'Focus on helping student understand the error and fix it themselves' : ''}
- ${messageType === 'explain' ? 'Break down concepts clearly with examples' : ''}
- ${messageType === 'help' ? 'Guide toward solution without giving it away' : ''}
- Connect to AI agent development concepts when relevant
- End with an encouraging tactical sign-off`

      // Send to Claude with subscription
      const response = await claudeOAuth.sendMessage(fullMessage)
      
      // Track this interaction for learning analytics
      this.trackLearningInteraction(message, messageType, response.content)
      
      return response.content

    } catch (error) {
      if (error instanceof Error && error.message === 'AUTHENTICATION_REQUIRED') {
        return this.getAuthenticationRequiredMessage()
      }
      
      console.error('Claude curriculum integration error:', error)
      return this.getFallbackMessage(message, messageType)
    }
  }

  // Track learning interactions for progress analysis
  private trackLearningInteraction(question: string, type: string, response: string): void {
    if (!this.studentProfile || !this.currentLesson) return

    // Create session entry
    const session: LearningSession = {
      timestamp: new Date(),
      operation: this.currentLesson.operationId,
      questionsAsked: 1,
      conceptsLearned: this.extractConceptsFromResponse(response),
      codeWritten: this.countCodeLines(this.currentLesson.currentCode),
      errorsEncountered: type === 'debug' ? [question] : [],
      helpRequested: [type]
    }

    // Update student profile
    this.studentProfile.sessionHistory.push(session)
    
    // Analyze patterns and update profile
    this.updateStudentAnalytics()
    
    this.saveStudentProfile()
  }

  private extractConceptsFromResponse(response: string): string[] {
    // Extract programming concepts mentioned in Claude's response
    const concepts: string[] = []
    const conceptKeywords = [
      'variables', 'functions', 'classes', 'loops', 'conditionals',
      'lists', 'dictionaries', 'modules', 'exceptions', 'decorators',
      'inheritance', 'polymorphism', 'encapsulation', 'algorithms',
      'debugging', 'testing', 'refactoring', 'optimization'
    ]
    
    conceptKeywords.forEach(concept => {
      if (response.toLowerCase().includes(concept)) {
        concepts.push(concept)
      }
    })
    
    return concepts
  }

  private countCodeLines(code: string): number {
    if (!code) return 0
    return code.split('\n').filter(line => line.trim().length > 0).length
  }

  private updateStudentAnalytics(): void {
    if (!this.studentProfile) return

    const recentSessions = this.studentProfile.sessionHistory.slice(-10)
    
    // Analyze coding style progression
    const totalCodeLines = recentSessions.reduce((sum, session) => sum + session.codeWritten, 0)
    const avgCodePerSession = totalCodeLines / recentSessions.length
    
    if (avgCodePerSession > 20) {
      this.studentProfile.codingStyle = 'advanced'
    } else if (avgCodePerSession > 10) {
      this.studentProfile.codingStyle = 'intermediate'
    }

    // Identify struggle concepts
    const errorPatterns = recentSessions
      .flatMap(session => session.errorsEncountered)
      .reduce((acc, error) => {
        // Simple pattern matching for common error types
        if (error.includes('NameError')) acc.push('variables')
        if (error.includes('IndentationError')) acc.push('indentation')
        if (error.includes('SyntaxError')) acc.push('syntax')
        if (error.includes('TypeError')) acc.push('data types')
        return acc
      }, [] as string[])

    this.studentProfile.currentStruggleConcepts = [...new Set(errorPatterns)]

    // Identify strengths
    const conceptMastery = recentSessions
      .flatMap(session => session.conceptsLearned)
      .reduce((acc, concept) => {
        acc[concept] = (acc[concept] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    this.studentProfile.strengths = Object.entries(conceptMastery)
      .filter(([_, count]) => count >= 3)
      .map(([concept]) => concept)
  }

  // Generate authentication required message
  private getAuthenticationRequiredMessage(): string {
    return `🔒 **CLASSIFIED ACCESS REQUIRED**

Agent, your clearance level needs to be verified to access the AI Assistant.

**MISSION BRIEFING:**
To use your personal Claude subscription in Agent Academy IDE:

1. **Authenticate**: Click the "Connect Claude" button in the top toolbar
2. **Login**: Use your Claude Pro/Max account credentials  
3. **Authorization**: Grant access to Agent Academy IDE
4. **Mission Ready**: Your AI instructor will be fully operational

**BENEFITS OF AUTHENTICATED ACCESS:**
✅ **Personal AI Instructor**: Your Claude subscription provides unlimited access to coding help
✅ **Advanced Models**: Access to Claude Sonnet and Opus (Max plan)
✅ **Curriculum Integration**: AI responses tailored to your learning progress
✅ **No Usage Limits**: Uses your subscription, not our API credits

**AUTHENTICATION STATUS:** 🔴 Not Connected
**REQUIRED CLEARANCE:** Claude Pro or Max Subscription

Ready to connect your Claude subscription, Agent?`
  }

  // Generate fallback message when Claude is unavailable
  private getFallbackMessage(message: string, type: string): string {
    const responses: Record<string, string> = {
      question: "I'm currently offline, Agent. Check your Claude connection and try again. Remember: great agents solve problems independently first!",
      help: "Connection to AI Command is down. Try breaking the problem into smaller steps and use the hints provided in your mission briefing.",
      debug: "AI Debugger offline. Time for tactical debugging: read the error message carefully, check your syntax, and trace through your code step by step.",
      explain: "AI Instructor unavailable. Review your mission documentation and try experimenting with the code to understand how it works."
    }

    return `🔌 **COMMUNICATION ERROR**

${responses[type] || responses.question}

**TACTICAL RECOMMENDATION:**
- Verify your Claude authentication status
- Check your internet connection
- Try the command again in a few moments

Stay focused on your mission, Agent. Technical difficulties are just another challenge to overcome!`
  }

  // Get student progress report
  getProgressReport(): any {
    if (!this.studentProfile) return null

    const totalSessions = this.studentProfile.sessionHistory.length
    const recentSessions = this.studentProfile.sessionHistory.slice(-5)
    
    return {
      level: this.studentProfile.codingStyle,
      operationsCompleted: this.studentProfile.completedOperations.length,
      totalSessions,
      recentActivity: recentSessions.length,
      strengths: this.studentProfile.strengths,
      challengeAreas: this.studentProfile.currentStruggleConcepts,
      learningStyle: this.studentProfile.preferredExplanationStyle
    }
  }

  // Complete an operation
  completeOperation(operationId: string): void {
    if (!this.studentProfile) return

    if (!this.studentProfile.completedOperations.includes(operationId)) {
      this.studentProfile.completedOperations.push(operationId)
      this.saveStudentProfile()
    }
  }

  // Check Claude authentication status
  async getAuthenticationStatus(): Promise<{
    isAuthenticated: boolean
    userInfo?: any
    message: string
  }> {
    try {
      const isAuthenticated = await claudeOAuth.isAuthenticated()
      
      if (isAuthenticated) {
        const userInfo = await claudeOAuth.getUserInfo()
        return {
          isAuthenticated: true,
          userInfo,
          message: `Connected to Claude ${userInfo.plan.toUpperCase()} plan`
        }
      } else {
        return {
          isAuthenticated: false,
          message: 'Claude subscription not connected'
        }
      }
    } catch (error) {
      return {
        isAuthenticated: false,
        message: 'Error checking Claude connection'
      }
    }
  }

  // Start Claude OAuth flow
  async startAuthentication(): Promise<string> {
    return await claudeOAuth.startOAuthFlow()
  }

  // Logout from Claude
  async logout(): Promise<void> {
    await claudeOAuth.logout()
  }
}

// Export singleton instance
export const claudeCurriculum = new ClaudeCurriculumIntegration()