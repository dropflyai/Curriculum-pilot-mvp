// AI Conversation Service
// Handles storage and retrieval of AI tutor conversations for teacher monitoring

import { createClient } from './supabase'
import { AIConversation, AIMessage } from './supabase'

export class AIConversationService {
  private supabase = createClient()

  /**
   * Start a new AI conversation session
   */
  async startConversation(
    userId: string,
    lessonId: string,
    lessonTitle: string,
    lessonSection: string
  ): Promise<AIConversation | null> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const { data, error } = await this.supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          lesson_section: lessonSection,
          session_id: sessionId,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Error starting AI conversation:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to start AI conversation:', error)
      return null
    }
  }

  /**
   * Add a message to an AI conversation
   */
  async addMessage(
    conversationId: string,
    type: 'user' | 'ai' | 'teacher_intervention',
    content: string,
    studentCode?: string,
    flaggedForTeacher = false
  ): Promise<AIMessage | null> {
    try {
      const { data, error } = await this.supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          type,
          content,
          student_code: studentCode,
          flagged_for_teacher: flaggedForTeacher
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding AI message:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to add AI message:', error)
      return null
    }
  }

  /**
   * Get or create active conversation for a user in a lesson section
   */
  async getOrCreateActiveConversation(
    userId: string,
    lessonId: string,
    lessonTitle: string,
    lessonSection: string
  ): Promise<AIConversation | null> {
    try {
      // First, try to find an active conversation for this user/lesson/section
      const { data: existingConversation } = await this.supabase
        .from('ai_conversations')
        .select()
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .eq('lesson_section', lessonSection)
        .eq('status', 'active')
        .order('last_activity', { ascending: false })
        .limit(1)
        .single()

      if (existingConversation) {
        return existingConversation
      }

      // If no active conversation, create a new one
      return await this.startConversation(userId, lessonId, lessonTitle, lessonSection)
    } catch (error) {
      // If no existing conversation found, create new one
      return await this.startConversation(userId, lessonId, lessonTitle, lessonSection)
    }
  }

  /**
   * Get conversation messages for display
   */
  async getConversationMessages(conversationId: string): Promise<AIMessage[]> {
    try {
      const { data, error } = await this.supabase
        .from('ai_messages')
        .select()
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching conversation messages:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error)
      return []
    }
  }

  /**
   * Update conversation status (for teacher monitoring)
   */
  async updateConversationStatus(
    conversationId: string,
    status: 'active' | 'resolved' | 'needs_help' | 'abandoned'
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('ai_conversations')
        .update({ status })
        .eq('id', conversationId)

      if (error) {
        console.error('Error updating conversation status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to update conversation status:', error)
      return false
    }
  }

  /**
   * Flag a message for teacher review
   */
  async flagMessageForTeacher(messageId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('ai_messages')
        .update({ flagged_for_teacher: true })
        .eq('id', messageId)

      if (error) {
        console.error('Error flagging message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to flag message:', error)
      return false
    }
  }

  /**
   * Get all conversations for teacher monitoring
   */
  async getAllConversationsForTeacher(): Promise<(AIConversation & { 
    messages: AIMessage[], 
    studentName: string 
  })[]> {
    try {
      const { data: conversations, error: conversationsError } = await this.supabase
        .from('ai_conversations')
        .select(`
          *,
          users!inner(full_name, email)
        `)
        .order('last_activity', { ascending: false })

      if (conversationsError) {
        console.error('Error fetching conversations for teacher:', conversationsError)
        return []
      }

      if (!conversations) return []

      // Get messages for each conversation
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv: any) => {
          const messages = await this.getConversationMessages(conv.id)
          return {
            ...conv,
            messages,
            studentName: conv.users?.full_name || conv.users?.email || 'Unknown Student'
          }
        })
      )

      return conversationsWithMessages
    } catch (error) {
      console.error('Failed to fetch conversations for teacher:', error)
      return []
    }
  }

  /**
   * Get conversation analytics for teacher dashboard
   */
  async getConversationAnalytics() {
    try {
      // Get basic conversation stats
      const { data: conversations } = await this.supabase
        .from('ai_conversations')
        .select('id, status, duration_minutes, last_activity')

      const { data: messages } = await this.supabase
        .from('ai_messages')
        .select('id, type, flagged_for_teacher, content')

      if (!conversations || !messages) {
        return {
          totalConversations: 0,
          activeStudents: 0,
          strugglingStudents: 0,
          avgResponseTime: 1.2,
          helpfulnessRating: 4.7,
          commonQuestions: [],
          conceptsNeedingHelp: []
        }
      }

      // Calculate metrics
      const totalConversations = conversations.length
      const activeStudents = conversations.filter((c: any) => c.status === 'active').length
      const strugglingStudents = conversations.filter((c: any) => c.status === 'needs_help').length
      
      // Extract common questions from user messages
      const userMessages = messages.filter((m: any) => m.type === 'user')
      const commonQuestions = this.extractCommonQuestions(userMessages)
      const conceptsNeedingHelp = this.extractDifficultConcepts(userMessages)

      return {
        totalConversations,
        activeStudents,
        strugglingStudents,
        avgResponseTime: 1.2, // Could calculate from message timestamps
        helpfulnessRating: 4.7, // Could implement rating system
        commonQuestions,
        conceptsNeedingHelp
      }
    } catch (error) {
      console.error('Failed to get conversation analytics:', error)
      return {
        totalConversations: 0,
        activeStudents: 0,
        strugglingStudents: 0,
        avgResponseTime: 1.2,
        helpfulnessRating: 4.7,
        commonQuestions: [],
        conceptsNeedingHelp: []
      }
    }
  }

  /**
   * Extract common questions from user messages using simple keyword analysis
   */
  private extractCommonQuestions(messages: AIMessage[]): string[] {
    const questionPatterns = [
      { pattern: /error|not working|broken/i, question: 'Why is my code not working?' },
      { pattern: /variable.*name/i, question: 'How do I fix NameError?' },
      { pattern: /string.*integer/i, question: "What's the difference between strings and integers?" },
      { pattern: /random/i, question: 'How do I use random in Python?' },
      { pattern: /indent|indentation/i, question: 'What does indentation error mean?' },
      { pattern: /loop.*for.*while/i, question: 'How do loops work?' },
      { pattern: /function.*def/i, question: 'How do I create a function?' }
    ]

    const questionCounts = new Map<string, number>()
    
    messages.forEach(msg => {
      questionPatterns.forEach(({ pattern, question }) => {
        if (pattern.test(msg.content)) {
          questionCounts.set(question, (questionCounts.get(question) || 0) + 1)
        }
      })
    })

    return Array.from(questionCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([question]) => question)
  }

  /**
   * Extract concepts that students are struggling with
   */
  private extractDifficultConcepts(messages: AIMessage[]): string[] {
    const conceptPatterns = [
      { pattern: /variable.*name.*error/i, concept: 'Variable naming conventions' },
      { pattern: /string.*int.*type/i, concept: 'Data types (strings vs integers)' },
      { pattern: /indent|indentation/i, concept: 'Python indentation rules' },
      { pattern: /import.*module/i, concept: 'Import statements' },
      { pattern: /list.*index/i, concept: 'List indexing and slicing' },
      { pattern: /loop.*for.*range/i, concept: 'For loops and range()' },
      { pattern: /function.*return/i, concept: 'Function definition and return values' }
    ]

    const conceptCounts = new Map<string, number>()
    
    messages.forEach(msg => {
      conceptPatterns.forEach(({ pattern, concept }) => {
        if (pattern.test(msg.content)) {
          conceptCounts.set(concept, (conceptCounts.get(concept) || 0) + 1)
        }
      })
    })

    return Array.from(conceptCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([concept]) => concept)
  }
}

// Export singleton instance
export const aiConversationService = new AIConversationService()

// Fallback service for when database is not configured
export class MockAIConversationService {
  private conversations: Map<string, AIConversation> = new Map()
  private messages: Map<string, AIMessage[]> = new Map()

  async startConversation(userId: string, lessonId: string, lessonTitle: string, lessonSection: string): Promise<AIConversation | null> {
    const conversation: AIConversation = {
      id: `mock_conv_${Date.now()}`,
      user_id: userId,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      lesson_section: lessonSection,
      session_id: `session_${Date.now()}`,
      status: 'active',
      started_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      duration_minutes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.conversations.set(conversation.id, conversation)
    this.messages.set(conversation.id, [])
    return conversation
  }

  async addMessage(conversationId: string, type: 'user' | 'ai' | 'teacher_intervention', content: string, studentCode?: string, flaggedForTeacher = false): Promise<AIMessage | null> {
    const message: AIMessage = {
      id: `mock_msg_${Date.now()}_${Math.random()}`,
      conversation_id: conversationId,
      type,
      content,
      student_code: studentCode,
      flagged_for_teacher: flaggedForTeacher,
      teacher_reviewed: false,
      created_at: new Date().toISOString()
    }

    const messages = this.messages.get(conversationId) || []
    messages.push(message)
    this.messages.set(conversationId, messages)
    
    return message
  }

  async getConversationMessages(conversationId: string): Promise<AIMessage[]> {
    return this.messages.get(conversationId) || []
  }

  async updateConversationStatus(conversationId: string, status: 'active' | 'resolved' | 'needs_help' | 'abandoned'): Promise<boolean> {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.status = status
      this.conversations.set(conversationId, conversation)
      return true
    }
    return false
  }

  async flagMessageForTeacher(messageId: string): Promise<boolean> {
    // For mock, just return true
    return true
  }

  async getConversationAnalytics() {
    return {
      totalConversations: 0,
      activeStudents: 0,
      strugglingStudents: 0,
      avgResponseTime: 1.2,
      helpfulnessRating: 4.7,
      commonQuestions: [],
      conceptsNeedingHelp: []
    }
  }

  async getOrCreateActiveConversation(userId: string, lessonId: string, lessonTitle: string, lessonSection: string): Promise<AIConversation | null> {
    // For mock, just create a new conversation each time
    return await this.startConversation(userId, lessonId, lessonTitle, lessonSection)
  }

  async getAllConversationsForTeacher(): Promise<(AIConversation & { messages: AIMessage[], studentName: string })[]> {
    // Return mock data similar to AITutorMonitoring
    return []
  }
}

// Use mock service when Supabase is not configured
export const getAIConversationService = () => {
  try {
    const supabase = createClient()
    // Test if Supabase is properly configured
    if (supabase && typeof supabase.from === 'function') {
      return aiConversationService
    } else {
      return new MockAIConversationService()
    }
  } catch (error) {
    return new MockAIConversationService()
  }
}