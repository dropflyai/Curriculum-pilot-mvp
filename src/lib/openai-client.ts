// Browser-compatible OpenAI client
let openai: any = null

// Initialize OpenAI client only in browser environment
const initOpenAI = async () => {
  if (typeof window !== 'undefined' && !openai) {
    try {
      const OpenAI = (await import('openai')).default
      openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'sk-demo-key',
        dangerouslyAllowBrowser: true
      })
    } catch (error) {
      console.log('OpenAI package not available, using fallback responses')
      return null
    }
  }
  return openai
}

export interface DrMayaNexusContext {
  currentCode: string
  lesson?: {
    id: number
    title: string
    objective: string
  }
  userHistory: string[]
}

export class DrMayaNexusAI {
  private systemPrompt = `You are Dr. Maya Nexus, a brilliant AI development mentor and researcher at Agent Academy. You help students learn to build intelligent AI agents using Python and modern AI technologies.

Your personality:
- Encouraging and supportive, but technically precise
- Expert in AI/ML, Python, and agent development
- Speaks like a knowledgeable mentor who cares about student success
- Uses spy/agent terminology when appropriate (students are "agents", projects are "missions")
- Focused on generative AI, agent development, and practical applications

Your expertise includes:
- Python programming fundamentals
- AI agent architecture and design patterns
- OpenAI API integration and prompt engineering
- Machine learning concepts and implementation
- Code debugging and optimization
- Project planning and development strategy

Keep responses helpful but concise (under 300 words unless detailed code is needed). Always provide actionable guidance.`

  async generateResponse(
    userMessage: string,
    context: DrMayaNexusContext
  ): Promise<string> {
    try {
      const client = await initOpenAI()
      if (!client) {
        return this.getFallbackResponse(userMessage, context)
      }
      
      const contextMessage = this.buildContextMessage(context)
      
      const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "system", content: contextMessage },
          { role: "user", content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      return completion.choices[0]?.message?.content || 
        "I apologize, but I'm having trouble processing your request right now. Please try again."
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return this.getFallbackResponse(userMessage, context)
    }
  }

  async generateCode(
    prompt: string,
    context: DrMayaNexusContext
  ): Promise<string> {
    try {
      const client = await initOpenAI()
      if (!client) {
        return this.getFallbackCodeResponse(prompt)
      }
      
      const codePrompt = `Generate Python code for: ${prompt}

Context:
- Student is working on: ${context.lesson?.title || 'AI Agent Development'}
- Current code length: ${context.currentCode.split('\n').length} lines
- Focus: Building intelligent AI agents

Please provide:
1. Clean, working Python code
2. Brief explanation of key concepts
3. Suggestions for next steps

Code should be educational and follow agent development best practices.`

      const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt + "\n\nFocus on generating clean, educational Python code for AI agent development." },
          { role: "user", content: codePrompt }
        ],
        max_tokens: 800,
        temperature: 0.3, // Lower temperature for more consistent code
        presence_penalty: 0.1
      })

      return completion.choices[0]?.message?.content || 
        "I'm having trouble generating code right now. Please try a more specific request."
    } catch (error) {
      console.error('OpenAI Code Generation Error:', error)
      return this.getFallbackCodeResponse(prompt)
    }
  }

  async debugCode(
    code: string,
    errorMessage: string,
    context: DrMayaNexusContext
  ): Promise<string> {
    try {
      const client = await initOpenAI()
      if (!client) {
        return this.getFallbackDebugResponse(errorMessage)
      }
      
      const debugPrompt = `Help debug this Python code:

CODE:
\`\`\`python
${code}
\`\`\`

ERROR:
${errorMessage}

CONTEXT:
- Lesson: ${context.lesson?.title || 'AI Agent Development'}
- Focus: ${context.lesson?.objective || 'Building intelligent agents'}

Please provide:
1. Explanation of what's wrong
2. Corrected code
3. Learning points to prevent similar errors`

      const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt + "\n\nYou are helping debug Python code. Be clear about the error and provide educational explanations." },
          { role: "user", content: debugPrompt }
        ],
        max_tokens: 600,
        temperature: 0.2 // Very focused for debugging
      })

      return completion.choices[0]?.message?.content || 
        "I'm having trouble analyzing this error. Please try running your code again or ask a more specific question."
    } catch (error) {
      console.error('OpenAI Debug Error:', error)
      return this.getFallbackDebugResponse(errorMessage)
    }
  }

  private buildContextMessage(context: DrMayaNexusContext): string {
    return `CURRENT SESSION CONTEXT:
Lesson: ${context.lesson?.title || 'General AI Development'}
Objective: ${context.lesson?.objective || 'Build intelligent agents'}
Code Length: ${context.currentCode.split('\n').length} lines
Recent Activity: ${context.userHistory.slice(-3).join(', ') || 'Starting session'}

Student's current code preview:
\`\`\`python
${context.currentCode.slice(0, 500)}${context.currentCode.length > 500 ? '...' : ''}
\`\`\`

Provide contextually relevant guidance for their current work.`
  }

  private getFallbackResponse(userMessage: string, context: DrMayaNexusContext): string {
    const message = userMessage.toLowerCase()
    
    if (message.includes('help') || message.includes('stuck')) {
      return `I'm here to help, Agent! Looking at your ${context.lesson?.title || 'project'}, here are some strategies:

• Break the problem into smaller pieces
• Test your code frequently with print() statements  
• Check your indentation and syntax carefully
• Review the lesson objectives for guidance

What specific part is challenging you?`
    }
    
    if (message.includes('error') || message.includes('debug')) {
      return `Let's debug this systematically:

1. **Check the error message** - What line is mentioned?
2. **Look for common issues** - Missing colons, indentation, typos
3. **Test incrementally** - Comment out code to isolate the problem
4. **Use print statements** - See what values variables have

Share your error message and I'll help you solve it!`
    }
    
    return `I understand you're asking about "${userMessage}". While I'm experiencing some technical difficulties, I'm still here to help with your AI agent development.

Based on your current work on ${context.lesson?.title || 'agent development'}, consider:
• What's your next step in building the agent?
• Are there any concepts you'd like me to explain?
• Do you need help with specific Python syntax?

How can I guide your learning today?`
  }

  private getFallbackCodeResponse(prompt: string): string {
    return `I'd love to generate code for "${prompt}", but I'm experiencing some technical issues. Here's a basic template to get you started:

\`\`\`python
# AI Agent Template
class IntelligentAgent:
    def __init__(self, name="Agent"):
        self.name = name
        self.memory = {}
        self.active = True
    
    def process_input(self, data):
        # Process incoming information
        self.memory['last_input'] = data
        return self.analyze(data)
    
    def analyze(self, data):
        # Analyze and make decisions
        # Add your logic here
        return f"Analyzed: {data}"
    
    def take_action(self, decision):
        # Execute decisions
        return f"{self.name} executing: {decision}"

# Create and test your agent
agent = IntelligentAgent("NOVA")
print(agent.process_input("Mission data received"))
\`\`\`

Customize this template for your specific needs!`
  }

  private getFallbackDebugResponse(errorMessage: string): string {
    return `I see you're getting an error: "${errorMessage}"

Here are common solutions:

**IndentationError**: Check that your code blocks are properly indented (4 spaces)
**NameError**: Make sure variables are defined before using them
**SyntaxError**: Look for missing colons, parentheses, or quotes
**TypeError**: Check that you're using the right data types

Try these debugging steps:
1. Check line numbers mentioned in the error
2. Add print() statements to see variable values
3. Test small pieces of code individually

What line is causing the error?`
  }
}

// Export singleton instance
export const drMayaNexus = new DrMayaNexusAI()