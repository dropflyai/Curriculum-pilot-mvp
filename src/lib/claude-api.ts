// Claude API Integration for AI Tutor
// Handles communication with Anthropic's Claude API for educational conversations

interface StudentContext {
  lessonId: string
  lessonTitle: string
  currentSection: string
  studentCode?: string
  recentErrors?: string[]
  progressData?: any
  conversationHistory?: Message[]
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  context?: StudentContext
}

interface ClaudeResponse {
  content: string
  flagForTeacher?: boolean
  suggestedActions?: string[]
}

class ClaudeAPIService {
  private apiKey: string
  private baseUrl = 'https://api.anthropic.com/v1/messages'
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Claude API key not found. AI tutor will use simulation mode.')
    }
  }

  /**
   * Core system prompt that defines the AI tutor's personality and guidelines
   */
  private getSystemPrompt(): string {
    return `You are an AI tutor for 9th-grade students learning Python programming and AI concepts. Your role is to guide learning through questions and hints, never giving direct answers.

CORE PRINCIPLES:
- Guide with questions, don't solve problems directly
- Use the Socratic method to help students discover solutions
- Be friendly and encouraging, but maintain educational focus
- Connect concepts to real-world analogies students can understand
- Celebrate effort and progress, not just correct answers

EDUCATIONAL BOUNDARIES:
✅ DO:
- Ask leading questions to guide thinking
- Provide conceptual explanations and analogies
- Help interpret error messages and debugging steps
- Relate programming concepts to familiar experiences
- Encourage experimentation and learning from mistakes
- Give hints that help students reach their own understanding

❌ DON'T:
- Give complete code solutions or direct answers
- Do homework assignments for students
- Discuss topics unrelated to programming/computer science
- Engage in lengthy off-topic conversations
- Provide answers without guiding the learning process

PERSONALITY:
- Friendly and approachable (use emojis sparingly)
- Patient with struggling students
- Encouraging about mistakes as learning opportunities
- Enthusiastic about programming concepts
- Brief social acknowledgments, then redirect to learning

RESPONSE STYLE:
- Keep responses conversational but focused
- Ask 1-2 guiding questions per response
- Use analogies from teenage experiences (phones, games, social media)
- Break complex concepts into digestible steps
- End responses with encouragement to try something specific`
  }

  /**
   * Build context-aware prompt including lesson information and student state
   */
  private buildContextPrompt(context: StudentContext, userMessage: string): string {
    let contextPrompt = `CURRENT LESSON CONTEXT:
- Lesson: ${context.lessonTitle}
- Section: ${context.currentSection}
- Student Message: "${userMessage}"`

    if (context.studentCode) {
      contextPrompt += `
- Student's Current Code:
\`\`\`python
${context.studentCode}
\`\`\``
    }

    if (context.recentErrors && context.recentErrors.length > 0) {
      contextPrompt += `
- Recent Errors: ${context.recentErrors.join(', ')}`
    }

    // Add lesson-specific guidance
    if (context.lessonTitle.toLowerCase().includes('variable')) {
      contextPrompt += `
- Key Concept: Help student understand variables as labeled storage containers
- Common Issues: NameError (undefined variables), assignment vs equality
- Good Analogies: Phone contacts, labeled boxes, restaurant orders`
    } else if (context.lessonTitle.toLowerCase().includes('magic 8')) {
      contextPrompt += `
- Key Concept: Lists, random selection, user input
- Common Issues: Import statements, list indexing, input() function
- Good Analogies: Vending machine selections, shuffle playlist, decision wheel`
    } else if (context.lessonTitle.toLowerCase().includes('loop')) {
      contextPrompt += `
- Key Concept: Repetition with for/while loops
- Common Issues: Infinite loops, indentation, range() function
- Good Analogies: Following recipe steps, counting exercises, playlist repeat`
    }

    contextPrompt += `

Remember: Guide the student to discover the answer through questions and hints. Don't solve it for them!`

    return contextPrompt
  }

  /**
   * Call Claude API with educational context
   */
  async getClaudeResponse(userMessage: string, context: StudentContext): Promise<ClaudeResponse> {
    // If no API key, fall back to simulation
    if (!this.apiKey) {
      return this.getSimulatedResponse(userMessage, context)
    }

    try {
      const systemPrompt = this.getSystemPrompt()
      const contextPrompt = this.buildContextPrompt(context, userMessage)
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Fast and cost-effective for education
          max_tokens: 500, // Keep responses concise
          temperature: 0.7, // Balanced creativity and consistency
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: contextPrompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const aiResponse = data.content[0].text

      // Analyze response for teacher flags
      const flagForTeacher = this.shouldFlagForTeacher(aiResponse, userMessage)
      const suggestedActions = this.extractSuggestedActions(aiResponse)

      return {
        content: aiResponse,
        flagForTeacher,
        suggestedActions
      }

    } catch (error) {
      console.error('Claude API error:', error)
      
      // Graceful fallback to simulation
      return this.getSimulatedResponse(userMessage, context)
    }
  }

  /**
   * Fallback simulation when API is unavailable (same as current implementation)
   */
  private getSimulatedResponse(userMessage: string, context: StudentContext): ClaudeResponse {
    const userText = userMessage.toLowerCase()

    let aiResponse = ''
    
    if (userText.includes('variable') || userText.includes('var')) {
      aiResponse = `Great question about variables! 🎯 Think of variables like labeled boxes where you store information. 

Instead of giving you the exact code, let me ask: What do you think happens when you write \`name = "John"\`? 

Try to explain it in your own words, and I'll help guide you to the right understanding! 💡`
    } else if (userText.includes('error') || userText.includes('not working')) {
      aiResponse = `I see you're having trouble with your code! 🤔 That's totally normal - even experienced programmers get errors all the time.

Can you tell me:
1. What were you trying to make your code do?
2. What's happening instead?
3. Are there any red error messages you're seeing?

This will help me guide you to find the solution yourself! 🔍`
    } else if (userText.includes('loop') || userText.includes('for') || userText.includes('while')) {
      aiResponse = `Loops are such a powerful concept! 🔄 Think of them like instructions you'd give to someone doing a repetitive task.

Instead of showing you the code, let me ask: If you wanted to tell a friend to count from 1 to 10, how would you explain that in plain English?

Once you think about that, we can translate your thinking into Python code! ✨`
    } else if (userText.includes('help') || userText.includes('stuck')) {
      aiResponse = `I'm here to help you work through this! 💪 Rather than giving you the answer directly, let's break down what you're trying to accomplish.

What specific part is confusing you? Is it:
• Understanding what the code should do?
• Knowing which Python concepts to use?
• Getting the syntax right?
• Something else?

The more specific you can be, the better I can guide you! 🎯`
    } else {
      aiResponse = `That's an interesting question! 🤔 I want to help you discover the answer through your own thinking.

Can you tell me a bit more about what you're trying to understand? I'm here to guide you with questions and hints that help you learn, rather than just giving you the solution.

What's the specific concept or problem you're working on right now? 💡`
    }

    return {
      content: aiResponse,
      flagForTeacher: this.shouldFlagForTeacher(aiResponse, userMessage),
      suggestedActions: []
    }
  }

  /**
   * Determine if teacher should be notified about this interaction
   */
  private shouldFlagForTeacher(aiResponse: string, userMessage: string): boolean {
    const concerningPatterns = [
      'frustrated', 'hate this', 'impossible', 'stupid', 'give up',
      'too hard', 'don\'t understand anything', 'makes no sense'
    ]
    
    const userText = userMessage.toLowerCase()
    return concerningPatterns.some(pattern => userText.includes(pattern))
  }

  /**
   * Extract suggested actions from AI response (for future teacher dashboard)
   */
  private extractSuggestedActions(aiResponse: string): string[] {
    // This could be enhanced to parse specific action recommendations
    // For now, return basic suggestions based on response content
    const actions: string[] = []
    
    if (aiResponse.includes('error') || aiResponse.includes('debug')) {
      actions.push('Help with debugging')
    }
    if (aiResponse.includes('concept') || aiResponse.includes('understand')) {
      actions.push('Review concept explanation')
    }
    if (aiResponse.includes('practice') || aiResponse.includes('try')) {
      actions.push('Provide practice problems')
    }
    
    return actions
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Get API status for debugging
   */
  getStatus(): { configured: boolean; mode: string } {
    return {
      configured: this.isConfigured(),
      mode: this.isConfigured() ? 'Claude API' : 'Simulation'
    }
  }
}

// Export singleton instance
export const claudeAPI = new ClaudeAPIService()

// Export types for use in components
export type { StudentContext, Message, ClaudeResponse }