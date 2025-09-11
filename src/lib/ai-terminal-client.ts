// AI Terminal Client - Claude Code-like experience in the IDE
// Supports both Claude (Anthropic) and OpenAI APIs

interface AIProvider {
  name: string
  apiKey?: string
  baseURL?: string
  model: string
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class AITerminalClient {
  private provider: AIProvider
  private conversationHistory: AIMessage[] = []
  private systemPrompt: string

  constructor(provider: 'claude' | 'openai' | 'local', apiKey?: string) {
    // Configure based on provider
    switch (provider) {
      case 'claude':
        this.provider = {
          name: 'claude',
          apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
          baseURL: 'https://api.anthropic.com/v1',
          model: 'claude-3-opus-20240229'
        }
        this.systemPrompt = this.getClaudeSystemPrompt()
        break
      
      case 'openai':
        this.provider = {
          name: 'openai',
          apiKey: apiKey || process.env.OPENAI_API_KEY,
          baseURL: 'https://api.openai.com/v1',
          model: 'gpt-4-turbo-preview'
        }
        this.systemPrompt = this.getOpenAISystemPrompt()
        break
      
      case 'local':
        // For local development/testing
        this.provider = {
          name: 'local',
          model: 'mock-model'
        }
        this.systemPrompt = 'You are a helpful AI coding assistant.'
        break
    }

    // Initialize with system prompt
    if (this.systemPrompt) {
      this.conversationHistory.push({
        role: 'system',
        content: this.systemPrompt
      })
    }
  }

  private getClaudeSystemPrompt(): string {
    return `You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.
You are integrated into the Agent Academy IDE to help students learn programming and build AI agents.

Your capabilities:
- Explain code and programming concepts clearly
- Debug and fix code issues
- Generate code snippets and examples
- Answer questions about Python, AI, and software development
- Provide step-by-step guidance for building AI agents
- Suggest improvements and best practices

Guidelines:
- Be encouraging and supportive to learners
- Provide clear, concise explanations
- Use examples to illustrate concepts
- Break down complex problems into manageable steps
- Encourage good coding practices and clean code
- Focus on educational value and understanding

Current context: Agent Academy IDE - Teaching students to build AI agents with Python.`
  }

  private getOpenAISystemPrompt(): string {
    return `You are an AI coding assistant integrated into the Agent Academy IDE.
Your role is to help students learn programming and build AI agents.

Your capabilities:
- Explain code and programming concepts
- Debug and fix code issues
- Generate code snippets and examples
- Answer questions about Python, AI, and software development
- Provide guidance for building AI agents
- Suggest improvements and best practices

Guidelines:
- Be helpful and supportive to learners
- Provide clear explanations with examples
- Break down complex problems into steps
- Encourage good coding practices
- Focus on educational value

Current context: Agent Academy IDE - Teaching students to build AI agents with Python.`
  }

  async sendMessage(message: string, context?: { code?: string, error?: string }): Promise<AIResponse> {
    // Add context if provided
    let enhancedMessage = message
    if (context) {
      if (context.code) {
        enhancedMessage += `\n\nCurrent code:\n\`\`\`python\n${context.code}\n\`\`\``
      }
      if (context.error) {
        enhancedMessage += `\n\nError message:\n\`\`\`\n${context.error}\n\`\`\``
      }
    }

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: enhancedMessage
    })

    try {
      let response: AIResponse

      switch (this.provider.name) {
        case 'claude':
          response = await this.sendClaudeMessage()
          break
        
        case 'openai':
          response = await this.sendOpenAIMessage()
          break
        
        case 'local':
          response = await this.sendLocalMessage(message)
          break
        
        default:
          throw new Error(`Unknown provider: ${this.provider.name}`)
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.content
      })

      return response
    } catch (error) {
      console.error('AI Terminal Error:', error)
      throw error
    }
  }

  private async sendClaudeMessage(): Promise<AIResponse> {
    if (!this.provider.apiKey) {
      throw new Error('Claude API key not configured. Add ANTHROPIC_API_KEY to your .env.local file.')
    }

    const response = await fetch(`${this.provider.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.provider.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: this.conversationHistory.filter(m => m.role !== 'system'),
        system: this.systemPrompt,
        max_tokens: 4096,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Claude API error: ${error}`)
    }

    const data = await response.json()
    
    return {
      content: data.content[0].text,
      model: data.model,
      usage: data.usage
    }
  }

  private async sendOpenAIMessage(): Promise<AIResponse> {
    if (!this.provider.apiKey) {
      throw new Error('OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file.')
    }

    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.apiKey}`
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 4096
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage
    }
  }

  private async sendLocalMessage(message: string): Promise<AIResponse> {
    // Mock response for local development
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    
    const responses = [
      "I can help you with that! Let me analyze your code...",
      "Here's a solution to your problem:\n```python\n# Your code here\n```",
      "That's a great question! Let me explain...",
      "I see the issue. Try this approach instead:",
      "Your code looks good! Here are some suggestions for improvement:"
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      content: `${randomResponse}\n\n[This is a mock response. Configure ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local for real AI assistance]`,
      model: 'mock-model'
    }
  }

  // Terminal command interface
  async executeCommand(command: string): Promise<string> {
    // Parse terminal-style commands
    if (command.startsWith('/')) {
      const [cmd, ...args] = command.slice(1).split(' ')
      
      switch (cmd) {
        case 'help':
          return this.getHelpText()
        
        case 'clear':
          this.conversationHistory = [{
            role: 'system',
            content: this.systemPrompt
          }]
          return 'Conversation cleared.'
        
        case 'model':
          return `Current model: ${this.provider.model}`
        
        case 'provider':
          return `Current provider: ${this.provider.name}`
        
        case 'history':
          return this.getConversationHistory()
        
        case 'export':
          return this.exportConversation()
        
        default:
          return `Unknown command: ${cmd}. Type /help for available commands.`
      }
    }
    
    // Regular message to AI
    const response = await this.sendMessage(command)
    return response.content
  }

  private getHelpText(): string {
    return `AI Terminal Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  /help      - Show this help message
  /clear     - Clear conversation history
  /model     - Show current AI model
  /provider  - Show current AI provider
  /history   - Show conversation history
  /export    - Export conversation as markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regular Usage:
  Just type your question or request normally.
  The AI will respond with code help and explanations.

Examples:
  "How do I create a class in Python?"
  "Debug this error: NameError: name 'x' is not defined"
  "Generate a function to sort a list"
  "Explain how decorators work"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }

  private getConversationHistory(): string {
    return this.conversationHistory
      .filter(m => m.role !== 'system')
      .map(m => `[${m.role}]: ${m.content.substring(0, 100)}...`)
      .join('\n')
  }

  private exportConversation(): string {
    const markdown = this.conversationHistory
      .filter(m => m.role !== 'system')
      .map(m => {
        const role = m.role === 'user' ? '### You' : '### Assistant'
        return `${role}\n\n${m.content}\n\n---\n`
      })
      .join('\n')
    
    return `Conversation exported:\n\n${markdown}`
  }

  // Code-specific helpers
  async debugCode(code: string, error: string): Promise<string> {
    const prompt = `Please help me debug this code error:`
    const response = await this.sendMessage(prompt, { code, error })
    return response.content
  }

  async explainCode(code: string): Promise<string> {
    const prompt = `Please explain what this code does:`
    const response = await this.sendMessage(prompt, { code })
    return response.content
  }

  async improveCode(code: string): Promise<string> {
    const prompt = `Please suggest improvements for this code:`
    const response = await this.sendMessage(prompt, { code })
    return response.content
  }

  async generateCode(description: string): Promise<string> {
    const prompt = `Please generate Python code for: ${description}`
    const response = await this.sendMessage(prompt)
    return response.content
  }
}

// Export singleton instance for easy use
export const aiTerminal = new AITerminalClient('local')