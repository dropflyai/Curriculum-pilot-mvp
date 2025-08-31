// Coach Nova AI Tutoring System
// Implements "Ladder of Help" approach with scope control and teacher oversight

import { createClient } from '@/lib/supabase'

export interface TutorContext {
  lessonContent: string
  studentCode: string
  errorMessage?: string
  attemptCount: number
  timeSpentMinutes: number
  previousHints: string[]
}

export interface TutorResponse {
  message: string
  helpLevel: 1 | 2 | 3 // Ladder of help
  responseType: 'hint' | 'concept' | 'snippet' | 'solution' | 'out_of_scope'
  citedContent: string[]
  shouldEscalate: boolean
  xpReward?: number
}

export interface TutorSession {
  id: string
  user_id: string
  assignment_id: string
  tutor_mode: 'LEARN' | 'ASSESS' | 'OFF'
  scope_level: 'TIGHT' | 'MODERATE' | 'OPEN'
  total_interactions: number
  escalated_to_teacher: boolean
}

export interface TutorPolicy {
  mode: 'LEARN' | 'ASSESS' | 'OFF'
  scopeLevel: 'TIGHT' | 'MODERATE' | 'OPEN'
  allowedTopics: string[]
  blockedPhrases: string[]
  maxHintsPerAssignment: number
  escalationThreshold: number
}

class CoachNovaEngine {
  private supabase = createClient()
  
  // Default tutoring policies (configurable by teachers)
  private defaultPolicies: Record<string, TutorPolicy> = {
    LEARN: {
      mode: 'LEARN',
      scopeLevel: 'TIGHT',
      allowedTopics: ['variables', 'input', 'output', 'loops', 'functions', 'debugging', 'syntax'],
      blockedPhrases: ['homework answers', 'quiz solutions', 'test answers'],
      maxHintsPerAssignment: 5,
      escalationThreshold: 3
    },
    ASSESS: {
      mode: 'ASSESS',
      scopeLevel: 'TIGHT',
      allowedTopics: ['concepts', 'definitions', 'syntax rules'],
      blockedPhrases: ['answers', 'solutions', 'code examples'],
      maxHintsPerAssignment: 2,
      escalationThreshold: 2
    },
    OFF: {
      mode: 'OFF',
      scopeLevel: 'TIGHT',
      allowedTopics: [],
      blockedPhrases: [],
      maxHintsPerAssignment: 0,
      escalationThreshold: 0
    }
  }

  // ==========================================
  // LADDER OF HELP SYSTEM
  // ==========================================

  /**
   * Generate tutoring response using Ladder of Help approach
   * Level 1: Concept/hint
   * Level 2: Strategy/approach  
   * Level 3: Targeted code snippet
   * Solution: Only after explicit request OR 3 failed attempts
   */
  async generateTutoringResponse(
    context: TutorContext,
    sessionId: string,
    policy: TutorPolicy
  ): Promise<TutorResponse> {
    try {
      // Check if tutoring is disabled
      if (policy.mode === 'OFF') {
        return {
          message: "The AI tutor is currently disabled for this assignment. Please ask your teacher for help! 👨‍🏫",
          helpLevel: 1,
          responseType: 'out_of_scope',
          citedContent: [],
          shouldEscalate: true
        }
      }

      // Determine help level based on attempt count
      let helpLevel: 1 | 2 | 3 = 1
      if (context.attemptCount >= 2) helpLevel = 2
      if (context.attemptCount >= 4) helpLevel = 3

      // Generate response based on context and help level
      const response = await this.generateContextualResponse(context, helpLevel, policy)

      // Check if should escalate to teacher
      const shouldEscalate = this.shouldEscalateToTeacher(context, policy)

      // Record interaction in database
      await this.recordTutorInteraction(sessionId, context, response, helpLevel)

      return {
        ...response,
        helpLevel,
        shouldEscalate
      }
    } catch (error) {
      console.error('Error generating tutor response:', error)
      return {
        message: "I'm having trouble right now. Let me get your teacher to help! 🤖",
        helpLevel: 1,
        responseType: 'out_of_scope',
        citedContent: [],
        shouldEscalate: true
      }
    }
  }

  /**
   * Generate contextual response based on student input and help level
   */
  private async generateContextualResponse(
    context: TutorContext,
    helpLevel: 1 | 2 | 3,
    policy: TutorPolicy
  ): Promise<Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'>> {
    const studentMessage = context.studentCode || "Help with coding"
    const lowerMessage = studentMessage.toLowerCase()

    // Content filtering - ensure response stays in scope
    if (!this.isMessageInScope(studentMessage, policy)) {
      return {
        message: "That's outside my scope for this lesson! Let's focus on the current assignment. What specific part of the code is giving you trouble? 🎯",
        responseType: 'out_of_scope',
        citedContent: [],
        xpReward: 0
      }
    }

    // Error-specific responses
    if (context.errorMessage) {
      return this.generateErrorResponse(context.errorMessage, helpLevel, policy.mode)
    }

    // Concept-based responses
    if (lowerMessage.includes('variable')) {
      return this.generateVariableHelp(helpLevel, policy.mode)
    }

    if (lowerMessage.includes('input') || lowerMessage.includes('user input')) {
      return this.generateInputHelp(helpLevel, policy.mode)
    }

    if (lowerMessage.includes('print') || lowerMessage.includes('output')) {
      return this.generateOutputHelp(helpLevel, policy.mode)
    }

    if (lowerMessage.includes('loop') || lowerMessage.includes('for') || lowerMessage.includes('while')) {
      return this.generateLoopHelp(helpLevel, policy.mode)
    }

    // General help responses
    return this.generateGeneralHelp(helpLevel, context.attemptCount)
  }

  /**
   * Generate error-specific help responses
   */
  private generateErrorResponse(
    errorMessage: string,
    helpLevel: 1 | 2 | 3,
    mode: 'LEARN' | 'ASSESS' | 'OFF'
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    const errorType = this.categorizeError(errorMessage)

    switch (errorType) {
      case 'NameError':
        if (helpLevel === 1) {
          return {
            message: "I see a NameError! 🔍 This happens when Python doesn't recognize a variable name. Think about it like trying to call someone whose number isn't in your contacts! Have you defined all your variables?",
            responseType: 'hint',
            citedContent: ['Variable definition', 'Variable scope'],
            xpReward: mode === 'LEARN' ? 5 : 0
          }
        } else if (helpLevel === 2) {
          return {
            message: "For NameError, here's my debugging strategy: 1) Check if you spelled the variable name correctly 2) Make sure you created the variable BEFORE using it 3) Check for typos in variable names. Variables are case-sensitive! 🎯",
            responseType: 'concept',
            citedContent: ['Variable naming rules', 'Python case sensitivity'],
            xpReward: mode === 'LEARN' ? 10 : 0
          }
        } else {
          return {
            message: "Here's a pattern to fix NameError:\n```python\n# ❌ This causes NameError:\nprint(my_name)  # my_name not defined yet\n\n# ✅ This works:\nmy_name = 'Alex'  # Define first\nprint(my_name)   # Then use\n```",
            responseType: 'snippet',
            citedContent: ['Variable assignment syntax'],
            xpReward: mode === 'LEARN' ? 15 : 0
          }
        }

      case 'SyntaxError':
        if (helpLevel === 1) {
          return {
            message: "SyntaxError means Python can't understand your code! 🤔 It's like a grammar mistake in English. Check for missing quotes, parentheses, or colons!",
            responseType: 'hint',
            citedContent: ['Python syntax rules'],
            xpReward: mode === 'LEARN' ? 5 : 0
          }
        } else if (helpLevel === 2) {
          return {
            message: "Syntax debugging checklist: 1) Count your quotes (every \" needs a matching \") 2) Check parentheses () 3) Look for missing colons : after if/for/while 4) Check indentation! 🔧",
            responseType: 'concept',
            citedContent: ['Python syntax', 'Indentation rules'],
            xpReward: mode === 'LEARN' ? 10 : 0
          }
        } else {
          return {
            message: "Common syntax fixes:\n```python\n# ❌ Missing quotes:\nname = Alex\n# ✅ Fixed:\nname = 'Alex'\n\n# ❌ Missing colon:\nif age > 18\n# ✅ Fixed:\nif age > 18:\n```",
            responseType: 'snippet',
            citedContent: ['String syntax', 'Conditional syntax'],
            xpReward: mode === 'LEARN' ? 15 : 0
          }
        }

      case 'IndentationError':
        if (helpLevel === 1) {
          return {
            message: "IndentationError! 📏 Python cares about spacing. Think of it like organizing your bedroom - everything needs to be in the right place!",
            responseType: 'hint',
            citedContent: ['Python indentation'],
            xpReward: mode === 'LEARN' ? 5 : 0
          }
        } else {
          return {
            message: "Indentation fix: Use 4 spaces (or 1 tab) for each level. Code inside if/for/while needs to be indented!\n```python\nif True:\n    print('This is indented!')  # 4 spaces\n```",
            responseType: 'snippet',
            citedContent: ['Indentation rules'],
            xpReward: mode === 'LEARN' ? 10 : 0
          }
        }

      default:
        return {
          message: `I see an error in your code! 🚨 Error messages are Python's way of helping you. Read it carefully and look for the line number. What does the error message say?`,
          responseType: 'hint',
          citedContent: ['Error interpretation'],
          xpReward: mode === 'LEARN' ? 5 : 0
        }
    }
  }

  /**
   * Generate variable-related help
   */
  private generateVariableHelp(
    helpLevel: 1 | 2 | 3,
    mode: 'LEARN' | 'ASSESS' | 'OFF'
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    if (helpLevel === 1) {
      return {
        message: "Variables are like labeled boxes! 📦 You put something inside (assign a value) and later you can look inside the box (use the variable). What would you like to store in your variable?",
        responseType: 'concept',
        citedContent: ['Variable concept', 'Variable assignment'],
        xpReward: mode === 'LEARN' ? 5 : 0
      }
    } else if (helpLevel === 2) {
      return {
        message: "Variable strategy: 1) Choose a descriptive name 2) Use = to assign a value 3) Use the variable name to access the value later. Like: `favorite_color = 'blue'` then `print(favorite_color)` 🎨",
        responseType: 'concept',
        citedContent: ['Variable naming', 'Assignment operator'],
        xpReward: mode === 'LEARN' ? 10 : 0
      }
    } else {
      return {
        message: "Here's the variable pattern:\n```python\n# Step 1: Create and assign\nstudent_name = 'Alex'\nstudent_age = 15\n\n# Step 2: Use the variables\nprint(f'Hi {student_name}, you are {student_age} years old!')\n```",
        responseType: 'snippet',
        citedContent: ['Variable syntax', 'f-string formatting'],
        xpReward: mode === 'LEARN' ? 15 : 0
      }
    }
  }

  /**
   * Generate input-related help
   */
  private generateInputHelp(
    helpLevel: 1 | 2 | 3,
    mode: 'LEARN' | 'ASSESS' | 'OFF'
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    if (helpLevel === 1) {
      return {
        message: "input() is like asking a question and waiting for an answer! 🗣️ It's how your program talks to the user. Think of it like ordering at a drive-thru!",
        responseType: 'concept',
        citedContent: ['User input', 'input() function'],
        xpReward: mode === 'LEARN' ? 5 : 0
      }
    } else if (helpLevel === 2) {
      return {
        message: "Input strategy: 1) Ask a clear question 2) Store the answer in a variable 3) Remember: input() always gives you text (string)! If you need a number, use int() to convert it 🔢",
        responseType: 'concept',
        citedContent: ['input() function', 'Type conversion'],
        xpReward: mode === 'LEARN' ? 10 : 0
      }
    } else {
      return {
        message: "Input pattern:\n```python\n# Get text input\nname = input('What is your name? ')\n\n# Get number input\nage = int(input('How old are you? '))\n\n# Use the inputs\nprint(f'Hello {name}, you are {age} years old!')\n```",
        responseType: 'snippet',
        citedContent: ['input() syntax', 'int() conversion'],
        xpReward: mode === 'LEARN' ? 15 : 0
      }
    }
  }

  /**
   * Generate output-related help
   */
  private generateOutputHelp(
    helpLevel: 1 | 2 | 3,
    mode: 'LEARN' | 'ASSESS' | 'OFF'
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    if (helpLevel === 1) {
      return {
        message: "print() is how your program talks! 📱 It's like sending a text message to the user. Whatever you put inside the parentheses gets displayed!",
        responseType: 'concept',
        citedContent: ['print() function', 'Output display'],
        xpReward: mode === 'LEARN' ? 5 : 0
      }
    } else if (helpLevel === 2) {
      return {
        message: "Print strategies: 1) Use quotes for exact text: print('Hello!') 2) Print variables: print(name) 3) Combine with f-strings: print(f'Hi {name}!') 4) Print multiple things: print(name, age) ✨",
        responseType: 'concept',
        citedContent: ['print() function', 'f-string formatting'],
        xpReward: mode === 'LEARN' ? 10 : 0
      }
    } else {
      return {
        message: "Print patterns:\n```python\n# Basic text\nprint('Welcome to CodeFly!')\n\n# Variables\nprint(student_name)\n\n# Formatted strings\nprint(f'Hello {name}, your score is {score}!')\n\n# Multiple values\nprint('Name:', name, 'Age:', age)\n```",
        responseType: 'snippet',
        citedContent: ['print() syntax', 'String formatting'],
        xpReward: mode === 'LEARN' ? 15 : 0
      }
    }
  }

  /**
   * Generate loop-related help
   */
  private generateLoopHelp(
    helpLevel: 1 | 2 | 3,
    mode: 'LEARN' | 'ASSESS' | 'OFF'
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    if (helpLevel === 1) {
      return {
        message: "Loops are like giving instructions to a robot! 🤖 'Do this 5 times' or 'Keep doing this until I say stop.' They help you avoid writing the same code over and over!",
        responseType: 'concept',
        citedContent: ['Loop concept', 'Repetition'],
        xpReward: mode === 'LEARN' ? 5 : 0
      }
    } else if (helpLevel === 2) {
      return {
        message: "Loop strategy: 1) for loops: when you know how many times (for i in range(5)) 2) while loops: when you have a condition (while score < 100) 3) Don't forget the colon : and indentation! 🔄",
        responseType: 'concept',
        citedContent: ['for loops', 'while loops', 'loop syntax'],
        xpReward: mode === 'LEARN' ? 10 : 0
      }
    } else {
      return {
        message: "Loop patterns:\n```python\n# Count from 0 to 4\nfor i in range(5):\n    print(f'Count: {i}')\n\n# Repeat with condition\ncount = 0\nwhile count < 3:\n    print('Hello!')\n    count = count + 1\n```",
        responseType: 'snippet',
        citedContent: ['range() function', 'while loop syntax'],
        xpReward: mode === 'LEARN' ? 15 : 0
      }
    }
  }

  /**
   * Generate general encouraging help
   */
  private generateGeneralHelp(
    helpLevel: 1 | 2 | 3,
    attemptCount: number
  ): Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'> {
    const encouragements = [
      "You're doing great! Keep experimenting! 🌟",
      "Coding is all about trying things and learning from what happens! 🚀",
      "Every programmer gets stuck sometimes - it's how we learn! 💪",
      "You're thinking like a programmer already! 🧠",
    ]

    const hints = [
      "Try breaking your problem into smaller steps. What's the very first thing your code should do? 🎯",
      "Read through the lesson content again - the answer is usually there! 📚",
      "Look at the example code in the lesson. How is it similar to what you're trying to do? 🔍",
      "Test your code one line at a time. Run it after each change! ⚡"
    ]

    if (attemptCount >= 4) {
      return {
        message: "You've been working hard on this! 💪 Sometimes it helps to take a quick break and come back with fresh eyes. Would you like me to break this down into even smaller steps?",
        responseType: 'hint',
        citedContent: ['Problem solving strategies'],
        xpReward: 10
      }
    }

    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
    const randomHint = hints[Math.floor(Math.random() * hints.length)]

    return {
      message: `${randomEncouragement} ${randomHint}`,
      responseType: 'hint',
      citedContent: ['General problem solving'],
      xpReward: 5
    }
  }

  /**
   * Check if message is within allowed scope
   */
  private isMessageInScope(message: string, policy: TutorPolicy): boolean {
    const lowerMessage = message.toLowerCase()

    // Check blocked phrases
    for (const blockedPhrase of policy.blockedPhrases) {
      if (lowerMessage.includes(blockedPhrase.toLowerCase())) {
        return false
      }
    }

    // Check allowed topics (if TIGHT scope)
    if (policy.scopeLevel === 'TIGHT') {
      const hasAllowedTopic = policy.allowedTopics.some(topic => 
        lowerMessage.includes(topic.toLowerCase())
      )
      return hasAllowedTopic || lowerMessage.includes('help') || lowerMessage.includes('stuck')
    }

    return true // MODERATE or OPEN scope
  }

  /**
   * Determine if should escalate to teacher
   */
  private shouldEscalateToTeacher(context: TutorContext, policy: TutorPolicy): boolean {
    // Escalate if too many attempts
    if (context.attemptCount >= policy.escalationThreshold) return true
    
    // Escalate if spending too much time (>20 minutes)
    if (context.timeSpentMinutes > 20) return true
    
    // Escalate if repeated similar questions
    if (context.previousHints.length > policy.maxHintsPerAssignment) return true
    
    return false
  }

  /**
   * Categorize error type from error message
   */
  private categorizeError(errorMessage: string): string {
    const lowerError = errorMessage.toLowerCase()
    
    if (lowerError.includes('nameerror') || lowerError.includes('not defined')) {
      return 'NameError'
    }
    if (lowerError.includes('syntaxerror') || lowerError.includes('invalid syntax')) {
      return 'SyntaxError'
    }
    if (lowerError.includes('indentationerror') || lowerError.includes('indented')) {
      return 'IndentationError'
    }
    if (lowerError.includes('typeerror')) {
      return 'TypeError'
    }
    
    return 'UnknownError'
  }

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  /**
   * Start new tutoring session
   */
  async startTutoringSession(
    userId: string,
    assignmentId: string,
    sessionContext: Record<string, any>,
    policy: TutorPolicy
  ): Promise<{ session_id: string; success: boolean }> {
    try {
      const { data: session, error } = await this.supabase
        .from('ai_tutor_sessions')
        .insert({
          user_id: userId,
          assignment_id: assignmentId,
          session_context: sessionContext,
          tutor_mode: policy.mode,
          scope_level: policy.scopeLevel
        })
        .select()
        .single()

      if (error) throw error

      return { session_id: session.id, success: true }
    } catch (error) {
      console.error('Error starting tutor session:', error)
      return { session_id: '', success: false }
    }
  }

  /**
   * Record tutor interaction
   */
  private async recordTutorInteraction(
    sessionId: string,
    context: TutorContext,
    response: Omit<TutorResponse, 'helpLevel' | 'shouldEscalate'>,
    helpLevel: 1 | 2 | 3
  ): Promise<void> {
    try {
      await this.supabase
        .from('ai_tutor_interactions')
        .insert({
          session_id: sessionId,
          user_id: '', // Will be filled by RLS
          student_message: context.studentCode || 'General help request',
          ai_response: response.message,
          help_level: helpLevel,
          message_context: {
            error_message: context.errorMessage,
            attempt_count: context.attemptCount,
            time_spent: context.timeSpentMinutes
          },
          response_type: response.responseType,
          cited_content: response.citedContent
        })
    } catch (error) {
      console.error('Error recording tutor interaction:', error)
    }
  }

  /**
   * Get tutoring analytics for teacher dashboard
   */
  async getTutoringAnalytics(week?: number): Promise<{
    total_interactions: number
    help_requests_by_topic: Record<string, number>
    success_rate: number
    escalation_rate: number
    avg_response_satisfaction: number
  }> {
    try {
      let query = this.supabase
        .from('ai_tutor_interactions')
        .select('response_type, student_rating, help_level, cited_content')

      if (week) {
        // Filter by week - would need additional join logic
      }

      const { data: interactions } = await query

      if (!interactions) {
        return {
          total_interactions: 0,
          help_requests_by_topic: {},
          success_rate: 0,
          escalation_rate: 0,
          avg_response_satisfaction: 0
        }
      }

      // Calculate metrics
      const totalInteractions = interactions.length
      const successfulHelp = interactions.filter((i: any) => i.response_type !== 'out_of_scope').length
      const escalations = interactions.filter((i: any) => i.help_level === 3).length
      const ratings = interactions.filter((i: any) => i.student_rating).map((i: any) => i.student_rating)
      const avgSatisfaction = ratings.length > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
        : 0

      // Topic analysis
      const topicCounts: Record<string, number> = {}
      interactions.forEach((interaction: any) => {
        interaction.cited_content?.forEach((topic: string) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1
        })
      })

      return {
        total_interactions: totalInteractions,
        help_requests_by_topic: topicCounts,
        success_rate: totalInteractions > 0 ? (successfulHelp / totalInteractions) * 100 : 0,
        escalation_rate: totalInteractions > 0 ? (escalations / totalInteractions) * 100 : 0,
        avg_response_satisfaction: avgSatisfaction
      }
    } catch (error) {
      console.error('Error getting tutoring analytics:', error)
      return {
        total_interactions: 0,
        help_requests_by_topic: {},
        success_rate: 0,
        escalation_rate: 0,
        avg_response_satisfaction: 0
      }
    }
  }
}

// ==========================================
// RATE LIMITING & MODERATION
// ==========================================

class TutorModerationEngine {
  private supabase = createClient()

  /**
   * Check rate limits for student
   */
  async checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      const { data: recentInteractions } = await this.supabase
        .from('ai_tutor_interactions')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString())

      const count = recentInteractions?.length || 0
      const hourlyLimit = 20 // Configurable by teachers

      return {
        allowed: count < hourlyLimit,
        remaining: Math.max(0, hourlyLimit - count)
      }
    } catch (error) {
      console.error('Error checking rate limit:', error)
      return { allowed: false, remaining: 0 }
    }
  }

  /**
   * Flag interaction for teacher review
   */
  async flagForReview(
    interactionId: string,
    reason: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('ai_tutor_interactions')
        .update({
          flagged_for_review: true,
          moderation_status: 'pending'
        })
        .eq('id', interactionId)

      return !error
    } catch (error) {
      console.error('Error flagging interaction:', error)
      return false
    }
  }
}

// ==========================================
// EXPORT ENGINES
// ==========================================

export const coachNova = new CoachNovaEngine()
export const tutorModeration = new TutorModerationEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get default tutoring policy for assignment type
 */
export function getTutoringPolicy(
  assignmentType: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE',
  teacherOverrides?: Partial<TutorPolicy>
): TutorPolicy {
  const engine = new CoachNovaEngine()
  
  let defaultMode: 'LEARN' | 'ASSESS' | 'OFF' = 'LEARN'
  
  // ASSESS mode for quizzes and tests (limited help)
  if (assignmentType === 'QUIZ' || assignmentType === 'TEST') {
    defaultMode = 'ASSESS'
  }

  const defaultPolicy = engine['defaultPolicies'][defaultMode]
  
  return {
    ...defaultPolicy,
    ...teacherOverrides
  }
}

/**
 * Initialize Coach Nova for new student
 */
export async function initializeCoachNova(userId: string): Promise<boolean> {
  try {
    const engine = new CoachNovaEngine()
    
    // Could add welcome message or initial setup here
    console.log(`Coach Nova initialized for user ${userId}`)
    
    return true
  } catch (error) {
    console.error('Error initializing Coach Nova:', error)
    return false
  }
}