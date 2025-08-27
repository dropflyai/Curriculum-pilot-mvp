// Simulated AI Agent for CodeFly Platform Demo
// This provides intelligent-seeming responses without API costs

interface AIContext {
  lessonId?: string
  lessonTitle?: string
  currentCode?: string
  errorType?: string
  attemptCount?: number
  studentName?: string
}

interface AIResponse {
  message: string
  type: 'hint' | 'encouragement' | 'solution' | 'explanation' | 'praise'
  showCode?: boolean
  codeExample?: string
  emotion?: '😊' | '🤔' | '💡' | '🎉' | '👍' | '🚀'
}

// Lesson-specific knowledge base
const lessonKnowledge = {
  'python-basics': {
    concepts: ['variables', 'data types', 'user input', 'print statements'],
    commonErrors: {
      'NameError': {
        pattern: /name .* is not defined/i,
        responses: [
          "I notice you're using a variable that hasn't been created yet. In Python, you need to define a variable before using it. Try adding a line like: variable_name = value",
          "Think of variables like labeled containers. You can't use a container that doesn't exist yet! Create it first with: my_variable = 'some value'",
          "Quick fix: Make sure you've defined {variable} before trying to use it. Check your spelling too - Python is case-sensitive!"
        ]
      },
      'SyntaxError': {
        pattern: /invalid syntax|unexpected/i,
        responses: [
          "I see a syntax issue! Check for: missing colons (:), mismatched quotes, or typos in Python keywords like 'print'",
          "Python is very particular about syntax. Double-check your parentheses, quotes, and make sure you're using 'print()' not 'Print()'",
          "Look at line {line_number} - there might be a missing parenthesis or quote mark there!"
        ]
      },
      'IndentationError': {
        pattern: /indentation|indent/i,
        responses: [
          "Python uses spaces to organize code. Make sure your code lines up properly - use 4 spaces for indentation!",
          "The indentation tells Python what code belongs together. Think of it like organizing an outline with bullet points.",
          "Quick tip: If you're inside an if statement or loop, indent the next lines with 4 spaces or a tab!"
        ]
      }
    },
    hints: {
      'variables': [
        "Variables are like phone contacts - you give them a name and store information!",
        "Try creating a variable: my_name = 'Your Name Here'",
        "Remember: variable_name = value. The name goes on the left, value on the right!"
      ],
      'input': [
        "The input() function is like a drive-thru speaker - it waits for the user to say something!",
        "Try: user_answer = input('What is your name? ')",
        "Whatever the user types gets stored in your variable. You can then use it later!"
      ],
      'print': [
        "print() is how Python talks to the user - like sending a text message!",
        "You can print variables: print(my_variable)",
        "Combine text and variables: print(f'Hello {name}!')"
      ]
    }
  },
  'magic-8-ball': {
    concepts: ['random', 'lists', 'conditionals', 'loops'],
    commonErrors: {
      'ImportError': {
        pattern: /no module named|import/i,
        responses: [
          "To use random choices, you need to import the random module first! Add this at the top: import random",
          "Python's random module is like a dice roller. Import it with: import random",
          "Don't forget to import what you need! Add 'import random' at the very beginning of your code."
        ]
      },
      'IndexError': {
        pattern: /list index out of range/i,
        responses: [
          "You're trying to access an item that doesn't exist in your list! Remember, Python counts from 0.",
          "If your list has 3 items, the indices are 0, 1, and 2. There's no index 3!",
          "Check your list length and make sure you're not going beyond it. Use len(my_list) to see how many items you have."
        ]
      }
    },
    hints: {
      'lists': [
        "Lists are like playlists - they hold multiple items in order!",
        "Create a list of responses: responses = ['Yes', 'No', 'Maybe']",
        "Access items with brackets: responses[0] gives you 'Yes'"
      ],
      'random': [
        "Use random.choice() to pick a random item from a list!",
        "Example: random.choice(['rock', 'paper', 'scissors'])",
        "Don't forget to import random at the top of your file!"
      ]
    }
  },
  'loops': {
    concepts: ['for loops', 'while loops', 'range', 'iteration'],
    commonErrors: {
      'InfiniteLoop': {
        pattern: /while True|maximum recursion/i,
        responses: [
          "Careful! Your loop might run forever. Make sure the condition can become False!",
          "In a while loop, something needs to change so it eventually stops. Are you updating your counter?",
          "Infinite loops are like a hamster wheel - they never stop! Add a way to exit: use 'break' or change the condition."
        ]
      }
    },
    hints: {
      'for': [
        "For loops are like going through a playlist - one song at a time!",
        "Try: for i in range(5): print(i)",
        "range(5) gives you numbers 0 through 4"
      ],
      'while': [
        "While loops continue as long as something is true - like 'while hungry: eat()'",
        "Always make sure your while loop can end!",
        "Example: counter = 0; while counter < 5: print(counter); counter += 1"
      ]
    }
  }
}

// Progressive hint system
class SimulatedAI {
  private attemptCounts: Map<string, number> = new Map()
  
  getResponse(context: AIContext): AIResponse {
    const attempts = this.attemptCounts.get(context.studentName || 'student') || 0
    this.attemptCounts.set(context.studentName || 'student', attempts + 1)
    
    // Determine response based on context and attempt count
    if (attempts === 0) {
      return this.getEncouragement(context)
    } else if (attempts === 1) {
      return this.getGentleHint(context)
    } else if (attempts === 2) {
      return this.getSpecificHint(context)
    } else if (attempts >= 3) {
      return this.getDetailedHelp(context)
    }
    
    return this.getDefaultResponse()
  }
  
  private getEncouragement(context: AIContext): AIResponse {
    const messages = [
      "Great attempt! You're on the right track. Take another look at your code and see if you can spot what might be missing.",
      "I can see you're thinking like a programmer! There's just a small issue to fix. You've got this!",
      "Nice work so far! Every coder makes mistakes - that's how we learn. What do you think might be the issue?",
      "You're so close! Programming is all about problem-solving. Let's figure this out together!"
    ]
    
    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      type: 'encouragement',
      emotion: '😊'
    }
  }
  
  private getGentleHint(context: AIContext): AIResponse {
    // Get lesson-specific hint based on context
    const lessonKey = this.detectLesson(context)
    const lesson = lessonKnowledge[lessonKey as keyof typeof lessonKnowledge]
    
    if (lesson && context.errorType) {
      const errorKey = this.detectErrorType(context.errorType)
      const errorInfo = lesson.commonErrors[errorKey as keyof typeof lesson.commonErrors]
      
      if (errorInfo) {
        return {
          message: errorInfo.responses[0],
          type: 'hint',
          emotion: '🤔'
        }
      }
    }
    
    return {
      message: "Let me give you a hint: Check your variable names and make sure they match exactly. Python is case-sensitive!",
      type: 'hint',
      emotion: '💡'
    }
  }
  
  private getSpecificHint(context: AIContext): AIResponse {
    const lessonKey = this.detectLesson(context)
    const lesson = lessonKnowledge[lessonKey as keyof typeof lessonKnowledge]
    
    if (lesson) {
      // Find relevant concept hint
      const concept = this.detectConcept(context.currentCode || '')
      const hints = lesson.hints[concept as keyof typeof lesson.hints]
      
      if (hints) {
        return {
          message: hints[1] || hints[0],
          type: 'hint',
          emotion: '💡',
          showCode: true,
          codeExample: this.getRelevantExample(concept)
        }
      }
    }
    
    return {
      message: "Here's a specific tip: Make sure all your variables are defined before you use them. Try adding: variable_name = 'value'",
      type: 'hint',
      emotion: '💡',
      showCode: true,
      codeExample: "name = 'Student'\nprint(f'Hello, {name}!')"
    }
  }
  
  private getDetailedHelp(context: AIContext): AIResponse {
    return {
      message: "I can see you're working hard on this! Let me show you the solution so you can learn from it. Study this carefully and try to understand each line:",
      type: 'solution',
      emotion: '🚀',
      showCode: true,
      codeExample: this.getSolutionForLesson(context)
    }
  }
  
  private detectLesson(context: AIContext): string {
    const title = context.lessonTitle?.toLowerCase() || ''
    if (title.includes('variable') || title.includes('basics')) return 'python-basics'
    if (title.includes('magic') || title.includes('8-ball')) return 'magic-8-ball'
    if (title.includes('loop')) return 'loops'
    return 'python-basics'
  }
  
  private detectErrorType(error: string): string {
    if (error.includes('NameError')) return 'NameError'
    if (error.includes('SyntaxError')) return 'SyntaxError'
    if (error.includes('IndentationError')) return 'IndentationError'
    if (error.includes('ImportError')) return 'ImportError'
    if (error.includes('IndexError')) return 'IndexError'
    return 'SyntaxError'
  }
  
  private detectConcept(code: string): string {
    if (code.includes('input(')) return 'input'
    if (code.includes('print(')) return 'print'
    if (code.includes('for ') || code.includes('while ')) return 'loops'
    if (code.includes('random')) return 'random'
    if (code.includes('[') && code.includes(']')) return 'lists'
    return 'variables'
  }
  
  private getRelevantExample(concept: string): string {
    const examples: Record<string, string> = {
      'variables': "name = 'CodeFly Student'\nage = 15\ngrade = 9",
      'input': "user_name = input('What is your name? ')\nprint(f'Nice to meet you, {user_name}!')",
      'print': "message = 'Hello, World!'\nprint(message)\nprint(f'The message is: {message}')",
      'loops': "for i in range(5):\n    print(f'Count: {i}')",
      'lists': "colors = ['red', 'blue', 'green']\nprint(colors[0])  # prints 'red'",
      'random': "import random\nchoices = ['yes', 'no', 'maybe']\nanswer = random.choice(choices)\nprint(answer)"
    }
    return examples[concept] || examples['variables']
  }
  
  private getSolutionForLesson(context: AIContext): string {
    const lessonKey = this.detectLesson(context)
    const solutions: Record<string, string> = {
      'python-basics': `# Complete solution for Variables lesson
name = input("What's your name? ")
age = int(input("How old are you? "))
favorite_subject = input("What's your favorite subject? ")

print(f"Hi {name}!")
print(f"You are {age} years old")
print(f"Your favorite subject is {favorite_subject}")`,
      
      'magic-8-ball': `# Complete Magic 8-Ball solution
import random

responses = [
    'Yes, definitely!',
    'No way!',
    'Maybe...',
    'Ask again later',
    'Absolutely!'
]

question = input("Ask the Magic 8-Ball a question: ")
answer = random.choice(responses)
print(f"Magic 8-Ball says: {answer}")`,
      
      'loops': `# Loop solution
# Count to 10
for i in range(1, 11):
    print(f"Count: {i}")

# While loop example
counter = 0
while counter < 5:
    print(f"Counter is: {counter}")
    counter += 1`
    }
    
    return solutions[lessonKey] || solutions['python-basics']
  }
  
  private getDefaultResponse(): AIResponse {
    return {
      message: "Keep trying! Every mistake is a learning opportunity. You're becoming a better coder with each attempt!",
      type: 'encouragement',
      emotion: '👍'
    }
  }
  
  // Get praise for successful completion
  getPraise(): AIResponse {
    const praises = [
      "🎉 Fantastic work! You nailed it! Your code runs perfectly!",
      "🚀 Wow! You're becoming a Python master! That's exactly right!",
      "⭐ Excellent job! You solved it like a pro programmer!",
      "🏆 Amazing! You're really getting the hang of this!"
    ]
    
    return {
      message: praises[Math.floor(Math.random() * praises.length)],
      type: 'praise',
      emotion: '🎉'
    }
  }
  
  // Reset attempts for a student
  resetAttempts(studentName: string) {
    this.attemptCounts.delete(studentName)
  }
}

// Export singleton instance
export const simulatedAI = new SimulatedAI()

// Function to generate realistic AI conversation for demos
export function generateAIConversation(studentName: string, lessonTitle: string): Array<{role: 'student' | 'ai', message: string, timestamp: string}> {
  const conversations = [
    {
      role: 'student' as const,
      message: "I'm stuck on the variables assignment. My code isn't working.",
      timestamp: '2 minutes ago'
    },
    {
      role: 'ai' as const,
      message: "Hi " + studentName + "! I see you're working on variables. What error message are you getting?",
      timestamp: '2 minutes ago'
    },
    {
      role: 'student' as const,
      message: "It says 'NameError: name 'age' is not defined'",
      timestamp: '1 minute ago'
    },
    {
      role: 'ai' as const,
      message: "Ah! That means Python doesn't know what 'age' is yet. You need to create the variable first. Try adding: age = 15 (or whatever age you want) before you use it. Variables are like labeled boxes - you need to create the box before putting something in it! 📦",
      timestamp: '1 minute ago'
    },
    {
      role: 'student' as const,
      message: "Oh that makes sense! It works now!",
      timestamp: 'Just now'
    },
    {
      role: 'ai' as const,
      message: "🎉 Fantastic! You've got it! Remember: in Python, always define your variables before using them. You're doing great - keep up the awesome work!",
      timestamp: 'Just now'
    }
  ]
  
  return conversations
}

// Analytics for admin dashboard
export function getAIAnalytics() {
  return {
    totalInteractions: 1847,
    averageResponseTime: '1.2 seconds',
    studentsSatisfaction: 94,
    commonIssuesResolved: {
      'Variable Errors': 342,
      'Syntax Issues': 289,
      'Logic Problems': 198,
      'Import Errors': 87
    },
    peakUsageHours: '2:00 PM - 4:00 PM',
    successRate: 89,
    studentsHelped: 234,
    averageAttemptsBeforeSolution: 2.3
  }
}