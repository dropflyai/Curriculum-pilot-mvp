/**
 * Mission 1 Challenges for Binary Shores Academy
 * AI Memory Core Programming - Variables & Data Storage
 */

import { MicroChallenge } from '@/types/challenge'
import { challengeTemplateSystem } from './challenge-templates'

export class Mission1Challenges {
  
  /**
   * Generate all challenges for Mission 1 - Week 1
   */
  static generateWeek1Challenges(): MicroChallenge[] {
    return [
      this.createSecretCodeChallenge(),
      this.createClearanceLevelChallenge(), 
      this.createAgentStatusChallenge()
    ]
  }

  /**
   * Challenge 1: Secret Code Variable
   * Introduces basic variable creation with string values
   */
  private static createSecretCodeChallenge(): MicroChallenge {
    return {
      id: 'bsa_w1_c1_secret_code',
      title: '🔐 Secret Code Storage',
      description: `Your AI agent needs a secure way to store classified information. Variables are like digital safes - they keep important data secure and accessible only to authorized programs.`,
      instruction: "Create a variable called 'mission_status' and set it to 'CLASSIFIED'",
      starterCode: `# 🤖 AI MEMORY CORE - CHALLENGE 1
# Mission: Store secret intelligence data
# Objective: Create your first memory cell for the AI

# Create a variable called 'mission_status' and set it to 'CLASSIFIED'
# Your code here:


# Test your code (don't modify this part)
try:
    print(f"Mission Status: {mission_status}")
    print("✅ Secret code stored successfully!")
except NameError:
    print("❌ Variable 'mission_status' not found")
`,
      solutionCode: "mission_status = 'CLASSIFIED'",
      difficulty: 'beginner',
      estimatedTime: 2,
      concepts: ['Variables', 'String Values', 'Assignment Operator'],
      tags: ['variables', 'strings', 'beginner', 'mission1'],
      xpReward: 50,
      hints: [
        {
          id: 'hint_1',
          content: "Variables store information using the assignment operator (=). Format: variable_name = value",
          unlockCondition: 'manual',
          xpCost: 5
        },
        {
          id: 'hint_2', 
          content: "Text values need quotes around them: mission_status = 'CLASSIFIED'",
          unlockCondition: 'manual',
          xpCost: 5
        },
        {
          id: 'hint_3',
          content: "Make sure to spell 'mission_status' exactly as shown, with an underscore",
          unlockCondition: 'manual',
          xpCost: 3
        }
      ],
      resources: [
        {
          title: "Python Variables Guide",
          content: "Variables are containers for storing data. Create them using: variable_name = value",
          type: "reference"
        },
        {
          title: "String Values",
          content: "Text is called a 'string' in programming. Always put strings in quotes: 'text' or \"text\"",
          type: "tip"
        }
      ],
      hasRealtimeValidation: true,
      hasVisualOutput: false,
      validateCode: (code: string) => {
        const errors = []
        let score = 0
        let feedback = ""

        // Check if variable is declared
        if (code.includes('mission_status')) {
          score += 40
          feedback += "Good! Found 'mission_status' variable. "
          
          // Check if it's assigned
          if (code.includes('mission_status =') || code.includes('mission_status=')) {
            score += 30
            feedback += "Assignment operator found. "
            
            // Check if value is correct
            if (code.includes("'CLASSIFIED'") || code.includes('"CLASSIFIED"')) {
              score += 30
              feedback += "Perfect! Correct value assigned."
            } else {
              feedback += "Check the value - it should be 'CLASSIFIED' (in quotes)."
              errors.push({
                message: "Value should be 'CLASSIFIED' in quotes",
                type: 'logic',
                severity: 'error'
              })
            }
          } else {
            feedback += "Don't forget the assignment operator (=)."
            errors.push({
              message: "Missing assignment operator (=)",
              type: 'syntax',
              severity: 'error'  
            })
          }
        } else {
          feedback = "Create a variable called 'mission_status'"
          errors.push({
            message: "Variable 'mission_status' not found",
            type: 'logic',
            severity: 'error'
          })
        }

        return {
          isValid: score >= 70,
          score,
          feedback,
          errors: errors.length > 0 ? errors : undefined
        }
      }
    }
  }

  /**
   * Challenge 2: Clearance Level
   * Introduces numeric values and different data types
   */
  private static createClearanceLevelChallenge(): MicroChallenge {
    return {
      id: 'bsa_w1_c2_clearance_level',
      title: '🎖️ Security Clearance Level',
      description: `Every agent needs a security clearance level. Your AI must track numerical data like clearance levels, threat assessments, and mission parameters. Numbers don't need quotes!`,
      instruction: "Create a variable called 'clearance_level' and set it to any number from 1 to 10",
      starterCode: `# 🤖 AI MEMORY CORE - CHALLENGE 2
# Mission: Set agent security clearance
# Objective: Store numerical security data

# Create a variable called 'clearance_level' and set it to a number (1-10)
# Your code here:


# Test your code (don't modify this part)
try:
    print(f"Clearance Level: {clearance_level}")
    if isinstance(clearance_level, (int, float)) and 1 <= clearance_level <= 10:
        print("✅ Valid clearance level assigned!")
    else:
        print("❌ Clearance level must be a number between 1 and 10")
except NameError:
    print("❌ Variable 'clearance_level' not found")
`,
      difficulty: 'beginner',
      estimatedTime: 2,
      concepts: ['Variables', 'Numeric Values', 'Data Types'],
      tags: ['variables', 'numbers', 'beginner', 'mission1'],
      xpReward: 60,
      hints: [
        {
          id: 'hint_1',
          content: "Numbers don't need quotes: clearance_level = 5",
          unlockCondition: 'manual',
          xpCost: 5
        },
        {
          id: 'hint_2',
          content: "Any number from 1 to 10 works: 1, 2, 3, 4, 5, 6, 7, 8, 9, or 10",
          unlockCondition: 'manual', 
          xpCost: 3
        },
        {
          id: 'hint_3',
          content: "Remember: Text uses quotes, numbers don't. clearance_level = 7 (not '7')",
          unlockCondition: 'manual',
          xpCost: 5
        }
      ],
      resources: [
        {
          title: "Data Types in Python",
          content: "Python has different data types: strings (text in quotes), integers (whole numbers), floats (decimal numbers)",
          type: "reference"
        },
        {
          title: "Numbers vs Strings",
          content: "Use numbers for math and counting. Use strings for names and text that won't be calculated.",
          type: "tip"
        }
      ],
      hasRealtimeValidation: true,
      hasVisualOutput: false,
      validateCode: (code: string) => {
        const errors = []
        let score = 0
        let feedback = ""

        // Check if variable is declared
        if (code.includes('clearance_level')) {
          score += 40
          feedback += "Good! Found 'clearance_level' variable. "
          
          // Check if it's assigned
          if (code.includes('clearance_level =') || code.includes('clearance_level=')) {
            score += 30
            feedback += "Assignment found. "
            
            // Check if it looks like a number (not in quotes)
            const numberPattern = /clearance_level\s*=\s*(\d+(?:\.\d+)?)/
            const quotedPattern = /clearance_level\s*=\s*['"][^'"]*['"]/
            
            if (quotedPattern.test(code)) {
              feedback += "Remember: numbers don't need quotes!"
              errors.push({
                message: "Remove quotes around the number",
                type: 'logic',
                severity: 'warning'
              })
              score += 10 // Partial credit
            } else if (numberPattern.test(code)) {
              const match = code.match(numberPattern)
              const value = parseFloat(match![1])
              
              if (value >= 1 && value <= 10) {
                score += 30
                feedback += "Perfect! Valid clearance level assigned."
              } else {
                score += 15
                feedback += "Number found, but should be between 1 and 10."
                errors.push({
                  message: "Clearance level should be between 1 and 10",
                  type: 'logic',
                  severity: 'warning'
                })
              }
            } else {
              feedback += "Assign a number value (1-10)."
              errors.push({
                message: "Missing or invalid number value",
                type: 'logic',
                severity: 'error'
              })
            }
          } else {
            feedback += "Don't forget the assignment operator (=)."
            errors.push({
              message: "Missing assignment operator (=)",
              type: 'syntax',
              severity: 'error'
            })
          }
        } else {
          feedback = "Create a variable called 'clearance_level'"
          errors.push({
            message: "Variable 'clearance_level' not found",
            type: 'logic',
            severity: 'error'
          })
        }

        return {
          isValid: score >= 70,
          score,
          feedback,
          errors: errors.length > 0 ? errors : undefined
        }
      }
    }
  }

  /**
   * Challenge 3: Agent Status
   * Introduces boolean values and True/False logic
   */
  private static createAgentStatusChallenge(): MicroChallenge {
    return {
      id: 'bsa_w1_c3_agent_status',
      title: '🤖 Agent Activation Protocol',
      description: `Your AI agent needs to know if it's active or not. Boolean values (True/False) are perfect for on/off states, active/inactive status, and yes/no decisions. This is the foundation of all AI decision-making!`,
      instruction: "Create a variable called 'ai_status' and set it to True to activate your agent",
      starterCode: `# 🤖 AI MEMORY CORE - CHALLENGE 3
# Mission: Activate the AI agent
# Objective: Use boolean logic to control agent state

# Create a variable called 'ai_status' and set it to True
# Your code here:


# Test your code (don't modify this part)
try:
    print(f"AI Status: {ai_status}")
    if ai_status is True:
        print("✅ Agent ACTIVATED! Ready for missions.")
        print("🚨 AI defense systems online!")
    elif ai_status is False:
        print("⚠️ Agent is deactivated")
    else:
        print("❌ ai_status must be True or False (boolean)")
except NameError:
    print("❌ Variable 'ai_status' not found")
`,
      difficulty: 'beginner',
      estimatedTime: 2,
      concepts: ['Variables', 'Boolean Values', 'True/False Logic'],
      tags: ['variables', 'boolean', 'beginner', 'mission1'],
      xpReward: 70,
      hints: [
        {
          id: 'hint_1',
          content: "Boolean values are True or False (with capital letters, no quotes)",
          unlockCondition: 'manual',
          xpCost: 5
        },
        {
          id: 'hint_2',
          content: "Use exactly: ai_status = True (capital T, no quotes)",
          unlockCondition: 'manual',
          xpCost: 3
        },
        {
          id: 'hint_3',
          content: "Python is case-sensitive: True works, but true, TRUE, or 'True' don't",
          unlockCondition: 'manual',
          xpCost: 5
        }
      ],
      resources: [
        {
          title: "Boolean Logic in Programming",
          content: "Boolean values represent True or False states. They're fundamental for decision-making in programs.",
          type: "reference"
        },
        {
          title: "Python Boolean Rules",
          content: "In Python, boolean values must be capitalized: True and False (not true/false or TRUE/FALSE)",
          type: "tip"
        },
        {
          title: "When to Use Booleans",
          content: "Use booleans for on/off states, yes/no questions, and conditions that have only two possibilities",
          type: "example"
        }
      ],
      hasRealtimeValidation: true,
      hasVisualOutput: false,
      validateCode: (code: string) => {
        const errors = []
        let score = 0
        let feedback = ""

        // Check if variable is declared
        if (code.includes('ai_status')) {
          score += 40
          feedback += "Good! Found 'ai_status' variable. "
          
          // Check if it's assigned
          if (code.includes('ai_status =') || code.includes('ai_status=')) {
            score += 30
            feedback += "Assignment found. "
            
            // Check for correct boolean value
            if (code.includes('ai_status = True') || code.includes('ai_status=True')) {
              score += 30
              feedback += "Perfect! Agent activated with True."
            } else if (code.includes('ai_status = False') || code.includes('ai_status=False')) {
              score += 20
              feedback += "Good boolean usage, but try True to activate the agent."
            } else if (code.includes("'True'") || code.includes('"True"') || 
                      code.includes("'False'") || code.includes('"False"')) {
              score += 10
              feedback += "Don't put quotes around True/False - they're special boolean values."
              errors.push({
                message: "Remove quotes around boolean values",
                type: 'logic',
                severity: 'warning'
              })
            } else if (code.includes('true') || code.includes('false')) {
              score += 10
              feedback += "Almost! Boolean values need capital letters: True, False"
              errors.push({
                message: "Boolean values must be capitalized: True, False",
                type: 'syntax',
                severity: 'error'
              })
            } else {
              feedback += "Set ai_status to True or False (boolean value)."
              errors.push({
                message: "Expected boolean value (True or False)",
                type: 'logic',
                severity: 'error'
              })
            }
          } else {
            feedback += "Don't forget the assignment operator (=)."
            errors.push({
              message: "Missing assignment operator (=)",
              type: 'syntax',
              severity: 'error'
            })
          }
        } else {
          feedback = "Create a variable called 'ai_status'"
          errors.push({
            message: "Variable 'ai_status' not found",
            type: 'logic',
            severity: 'error'
          })
        }

        return {
          isValid: score >= 70,
          score,
          feedback,
          errors: errors.length > 0 ? errors : undefined
        }
      }
    }
  }

  /**
   * Get challenge by ID
   */
  static getChallengeById(id: string): MicroChallenge | undefined {
    const challenges = this.generateWeek1Challenges()
    return challenges.find(challenge => challenge.id === id)
  }

  /**
   * Get all challenge IDs for Week 1
   */
  static getWeek1ChallengeIds(): string[] {
    return [
      'bsa_w1_c1_secret_code',
      'bsa_w1_c2_clearance_level', 
      'bsa_w1_c3_agent_status'
    ]
  }

  /**
   * Generate advanced challenges using templates (for future expansion)
   */
  static generateAdvancedChallenges(): MicroChallenge[] {
    return [
      // Agent name variable
      challengeTemplateSystem.generateChallenge('variable_declaration', {
        variable_name: 'agent_codename',
        expected_value: "'Shadow'",
        challenge_description: 'AI Agent Identity Assignment'
      }),
      
      // Mission success rate
      challengeTemplateSystem.generateChallenge('variable_declaration', {
        variable_name: 'success_rate',
        expected_value: '98.5',
        challenge_description: 'Mission Success Rate Tracking'
      }),
      
      // Print agent status
      challengeTemplateSystem.generateChallenge('print_statement', {
        expected_output: 'Agent is online and ready for deployment',
        challenge_description: 'Agent Status Communication'
      })
    ]
  }
}

// Export individual challenges for direct access
export const mission1Week1Challenges = Mission1Challenges.generateWeek1Challenges()