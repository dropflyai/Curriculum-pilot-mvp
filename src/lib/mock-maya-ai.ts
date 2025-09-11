// Mock Dr. Maya Nexus AI for development and demonstration
export interface DrMayaNexusContext {
  currentCode: string
  lesson?: {
    id: number
    title: string
    objective: string
  }
  userHistory: string[]
}

export class MockDrMayaNexusAI {
  private responses = {
    greetings: [
      "Hello, Agent! I'm Dr. Maya Nexus, your AI development mentor. Ready to build some intelligent agents today?",
      "Welcome back to Agent Academy! I see you're ready to dive deeper into AI development. What can I help you with?",
      "Greetings, future AI engineer! Let's create something amazing together."
    ],
    
    help: [
      "I'm here to guide you through AI agent development! Here are some ways I can assist:",
      "Looking at your current progress, I can help you with:",
      "As your AI mentor, I can support you in several ways:"
    ],
    
    codeGeneration: {
      agent: `Here's a foundational AI agent structure for you:

\`\`\`python
class IntelligentAgent:
    def __init__(self, name="Agent"):
        self.name = name
        self.knowledge_base = {}
        self.memory = []
        self.active = True
        
    def perceive(self, environment_data):
        """Process input from environment"""
        self.memory.append(("perception", environment_data))
        return self.analyze(environment_data)
        
    def analyze(self, data):
        """Make decisions based on data"""
        if "threat" in str(data).lower():
            return self.activate_defense_protocol()
        elif "learn" in str(data).lower():
            return self.update_knowledge(data)
        else:
            return f"Processing: {data}"
            
    def activate_defense_protocol(self):
        """Respond to threats"""
        return "🛡️ Defense systems activated!"
        
    def update_knowledge(self, new_info):
        """Learn from new information"""
        self.knowledge_base[len(self.knowledge_base)] = new_info
        return f"📚 Knowledge updated! Now I know {len(self.knowledge_base)} things."

# Create and test your agent
my_agent = IntelligentAgent("MAYA")
print(f"Agent {my_agent.name} is ready!")
print(my_agent.perceive("New mission data incoming"))
print(my_agent.perceive("Enemy threat detected"))
\`\`\`

This agent can perceive, analyze, and respond to different situations. Try extending it with your own capabilities!`,

      variables: `Here's how to create intelligent memory systems with variables:

\`\`\`python
# AI Agent Memory System
agent_name = "NOVA"
threat_level = 0
mission_status = "ACTIVE"
enemy_detected = False
coordinates = [40.7589, -74.0060]  # NYC coordinates
clearance_level = 5

# Function to update agent status
def update_agent_status():
    print("=== AI AGENT STATUS ===")
    print(f"Agent Name: {agent_name}")
    print(f"Mission: {mission_status}")
    print(f"Threat Level: {threat_level}/10")
    print(f"Enemy Detected: {enemy_detected}")
    print(f"Location: {coordinates}")
    print(f"Clearance: Level {clearance_level}")
    
    if enemy_detected:
        print("🚨 ALERT: Take defensive action!")
    else:
        print("✅ All systems normal")

# Test the memory system
update_agent_status()

# Simulate threat detection
enemy_detected = True
threat_level = 7
update_agent_status()
\`\`\`

Variables are your agent's memory! Each variable stores critical information your AI needs to make decisions.`,

      functions: `Let's create specialized AI capabilities with functions:

\`\`\`python
import random

def scan_environment():
    """AI function to analyze surroundings"""
    threats = random.choice([0, 1, 2, 3])
    return {
        "threat_count": threats,
        "safe_zones": 5 - threats,
        "recommendation": "advance" if threats < 2 else "defensive"
    }

def generate_response(situation):
    """AI decision-making function"""
    responses = {
        "threat": "Activating countermeasures",
        "ally": "Establishing communication",
        "unknown": "Gathering more intelligence",
        "safe": "Continuing mission"
    }
    return responses.get(situation, "Analyzing...")

def learn_pattern(data_points):
    """AI learning function"""
    if len(data_points) < 2:
        return "Need more data to identify patterns"
    
    # Simple pattern analysis
    if all(x > 0 for x in data_points):
        return "Pattern: Positive trend detected"
    elif all(x < 0 for x in data_points):
        return "Pattern: Negative trend detected"
    else:
        return "Pattern: Mixed signals, monitoring..."

# Test your AI functions
scan_result = scan_environment()
print(f"Scan result: {scan_result}")
print(f"AI Response: {generate_response('threat')}")
print(f"Pattern Analysis: {learn_pattern([1, 3, 5, 7])}")
\`\`\`

Functions give your AI specialized skills! Each function is like training your agent in a specific capability.`
    },
    
    debugging: {
      indentation: "I see an indentation error! In Python, code inside functions and classes must be indented consistently (usually 4 spaces). Make sure all your code blocks are properly aligned.",
      
      syntax: "That looks like a syntax error. Common fixes: check for missing colons (:) after if/def statements, matching parentheses and quotes, and proper variable names (no spaces or special characters).",
      
      variable: "It seems like you're trying to use a variable that hasn't been defined yet. In Python, you must create (define) a variable before you can use it. Make sure you've assigned a value to your variable first!",
      
      general: "Great question about debugging! Here's my systematic approach: 1) Read the error message carefully, 2) Check the line number mentioned, 3) Look for common issues (indentation, syntax, undefined variables), 4) Test small pieces of code individually."
    }
  }

  async generateResponse(
    userMessage: string,
    context: DrMayaNexusContext
  ): Promise<string> {
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
    
    const message = userMessage.toLowerCase()
    const lesson = context.lesson?.title || "AI Development"
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return this.randomChoice(this.responses.greetings) + 
             `\n\nI see you're working on "${lesson}". How can I help you master this concept?`
    }
    
    // Help requests
    if (message.includes('help') || message.includes('stuck') || message.includes('confused')) {
      return `I can see you need assistance with "${lesson}". Here's how I can help:

🤖 **Code Generation** - Ask me to "create" or "generate" code examples
🐛 **Debugging** - Share your error message and I'll help fix it  
💡 **Explanations** - Ask me to "explain" any concept in detail
🎯 **Guidance** - Tell me what you're trying to accomplish

Looking at your current code (${context.currentCode.split('\n').length} lines), what specific challenge are you facing?`
    }
    
    // Code generation requests
    if (message.includes('generate') || message.includes('create') || message.includes('write') || message.includes('make')) {
      if (message.includes('agent') || message.includes('ai')) {
        return this.responses.codeGeneration.agent
      } else if (message.includes('variable') || message.includes('memory')) {
        return this.responses.codeGeneration.variables
      } else if (message.includes('function') || message.includes('method')) {
        return this.responses.codeGeneration.functions
      }
    }
    
    // Debugging help
    if (message.includes('error') || message.includes('debug') || message.includes('fix') || message.includes('wrong')) {
      if (message.includes('indent')) {
        return this.responses.debugging.indentation
      } else if (message.includes('syntax')) {
        return this.responses.debugging.syntax
      } else if (message.includes('variable') || message.includes('defined')) {
        return this.responses.debugging.variable
      } else {
        return this.responses.debugging.general
      }
    }
    
    // Explanation requests
    if (message.includes('explain') || message.includes('what is') || message.includes('how does')) {
      if (message.includes('variable')) {
        return `Variables in AI development are like your agent's memory cells! 

**What they do:**
- Store critical information (enemy positions, threat levels, mission data)
- Remember state between operations
- Enable decision-making based on stored knowledge

**Example in Agent Academy:**
\`\`\`python
agent_status = "ACTIVE"    # String variable
threat_level = 3           # Number variable  
mission_complete = False   # Boolean variable
\`\`\`

Your AI agent uses these variables to "remember" important information and make intelligent decisions based on that memory!`
      } else if (message.includes('function')) {
        return `Functions are your AI agent's specialized skills and capabilities!

**Think of functions as:**
- 🎯 **Skills** - Each function teaches your agent a new ability
- 🔄 **Reusable** - Write once, use many times
- 📊 **Processing** - Transform input into useful output
- 🧠 **Intelligence** - The "brain functions" of your agent

**Agent Academy Example:**
\`\`\`python
def analyze_threat(enemy_data):
    # This function gives your agent threat analysis skills
    if enemy_data > 5:
        return "HIGH THREAT - ACTIVATE DEFENSES"
    else:
        return "LOW THREAT - CONTINUE MISSION"
\`\`\`

Functions make your AI agent smart and capable!`
      }
    }
    
    // Encouragement and progress tracking
    if (message.includes('good') || message.includes('done') || message.includes('finished')) {
      return `Excellent progress, Agent! 🎉 

You're developing strong AI development skills. Your agent is getting smarter with each line of code you write.

**Next Challenge:** Try extending your agent with new capabilities:
- Add more sophisticated decision-making
- Implement learning from experiences  
- Create specialized functions for different scenarios

What aspect of AI agent development interests you most?`
    }
    
    // Default intelligent response
    return `Interesting question about "${userMessage}"! 

Based on your work on ${lesson}, I can help you build more intelligent agents. Looking at your current code progress, you're ${this.getProgressAssessment(context.currentCode.length)} through this concept.

**Some ideas to explore:**
🤖 Create more sophisticated agent behaviors
🧠 Add decision-making capabilities
📊 Implement data processing functions
🎯 Build goal-oriented agent actions

What specific aspect would you like to dive deeper into?`
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }
  
  private getProgressAssessment(codeLength: number): string {
    if (codeLength < 50) return "just getting started"
    if (codeLength < 150) return "making good progress"
    if (codeLength < 300) return "doing really well"
    return "becoming quite advanced"
  }
}

// Export singleton instance
export const mockMayaNexus = new MockDrMayaNexusAI()