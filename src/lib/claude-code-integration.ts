// Claude Code Integration for Agent Academy IDE
// Direct integration with Claude's code assistance capabilities

export interface ClaudeCodeContext {
  currentCode: string
  language: string
  cursor: {
    line: number
    column: number
  }
  lesson?: {
    id: number
    title: string
    objective: string
  }
  userIntent: 'completion' | 'explanation' | 'debugging' | 'optimization' | 'chat'
}

export interface ClaudeCodeResponse {
  type: 'completion' | 'explanation' | 'suggestion' | 'error'
  content: string
  insertPosition?: {
    line: number
    column: number
  }
  confidence: number
}

export class ClaudeCodeClient {
  private systemPrompt = `You are an integrated AI coding assistant within Agent Academy IDE, designed specifically for educational Python and AI development.

Your role:
- Provide intelligent code completion and suggestions
- Explain code concepts clearly for students learning AI development
- Debug issues with clear educational explanations
- Optimize code while teaching best practices
- Support the spy/agent themed curriculum

Guidelines:
- Be concise but educational
- Explain WHY not just WHAT when providing suggestions
- Use Agent Academy terminology (students are "agents", projects are "missions")
- Focus on Python, AI/ML, and agent development
- Provide code that follows educational best practices

Response format:
- For completions: provide only the code to be inserted
- For explanations: provide clear, educational explanations
- For debugging: identify issues and suggest fixes with reasoning
- For optimizations: show improved code with explanations`

  async generateCodeCompletion(
    context: ClaudeCodeContext
  ): Promise<ClaudeCodeResponse> {
    try {
      // For now, return educational mock responses
      // This will be replaced with actual Claude API integration
      
      if (context.userIntent === 'completion') {
        return this.generateMockCompletion(context)
      } else if (context.userIntent === 'explanation') {
        return this.generateMockExplanation(context)
      } else if (context.userIntent === 'debugging') {
        return this.generateMockDebugging(context)
      } else {
        return this.generateMockChat(context)
      }
    } catch (error) {
      console.error('Claude Code integration error:', error)
      return {
        type: 'error',
        content: 'AI assistant temporarily unavailable. Please try again.',
        confidence: 0
      }
    }
  }

  private generateMockCompletion(context: ClaudeCodeContext): ClaudeCodeResponse {
    const code = context.currentCode.toLowerCase()
    
    // Intelligent completion suggestions based on context
    if (code.includes('import')) {
      return {
        type: 'completion',
        content: 'requests',
        confidence: 0.9,
        insertPosition: context.cursor
      }
    } else if (code.includes('def ')) {
      return {
        type: 'completion',
        content: `():
    """
    Agent mission function
    """
    pass`,
        confidence: 0.85,
        insertPosition: context.cursor
      }
    } else if (code.includes('print')) {
      return {
        type: 'completion',
        content: '("Mission status: Active")',
        confidence: 0.8,
        insertPosition: context.cursor
      }
    }
    
    return {
      type: 'completion',
      content: '# Agent Academy - AI Development Mission',
      confidence: 0.7,
      insertPosition: context.cursor
    }
  }

  private generateMockExplanation(context: ClaudeCodeContext): ClaudeCodeResponse {
    return {
      type: 'explanation',
      content: `This code demonstrates key Agent Academy concepts:

🎯 **Mission Objective**: The function you're building is part of your AI agent's core capabilities.

🔍 **Code Analysis**: This pattern is commonly used in AI agent development for handling data processing and decision making.

💡 **Next Steps**: Consider adding error handling and logging to make your agent more robust.

Keep up the excellent work, Agent! You're building essential skills for AI development.`,
      confidence: 0.9
    }
  }

  private generateMockDebugging(context: ClaudeCodeContext): ClaudeCodeResponse {
    return {
      type: 'suggestion',
      content: `🔧 **Debug Analysis**:

**Issue Detected**: Missing import statement or syntax error

**Solution**:
\`\`\`python
# Add this import at the top of your file
import requests
import json
\`\`\`

**Why This Fixes It**: Your agent needs these libraries to communicate with external APIs and process data.

**Agent Tip**: Always check imports first when debugging - it's the most common mission failure point!`,
      confidence: 0.85
    }
  }

  private generateMockChat(context: ClaudeCodeContext): ClaudeCodeResponse {
    return {
      type: 'explanation',
      content: `Hello, Agent! I'm here to help you with your AI development mission.

I can assist with:
- 🤖 Code completion and suggestions
- 📚 Explaining complex AI concepts
- 🔧 Debugging and optimization
- 🎯 Mission planning and architecture

What would you like to work on today? Remember, every expert was once a beginner - you're doing great!`,
      confidence: 0.9
    }
  }

  // Future: Real Claude API integration
  async connectToClaudeAPI(context: ClaudeCodeContext): Promise<ClaudeCodeResponse> {
    // This will be implemented when Claude API keys are available
    // For now, using intelligent mock responses for development
    
    const response = await fetch('/api/claude-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: this.systemPrompt,
        context: context,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error('Claude API request failed')
    }

    const data = await response.json()
    return {
      type: 'completion',
      content: data.completion,
      confidence: data.confidence || 0.8
    }
  }
}

// Singleton instance for IDE integration
export const claudeCodeClient = new ClaudeCodeClient()

// Helper function for IDE integration
export async function getClaudeCodeAssistance(
  code: string,
  cursorPosition: { line: number; column: number },
  intent: ClaudeCodeContext['userIntent'] = 'completion'
): Promise<ClaudeCodeResponse> {
  const context: ClaudeCodeContext = {
    currentCode: code,
    language: 'python',
    cursor: cursorPosition,
    userIntent: intent
  }

  return await claudeCodeClient.generateCodeCompletion(context)
}