/**
 * Challenge Template System
 * Reusable templates for generating challenges across different concepts
 */

import { 
  MicroChallenge, 
  ChallengeTemplate, 
  ValidationResult,
  TemplateParameter 
} from '@/types/challenge'

export class ChallengeTemplateSystem {
  private templates: Map<string, ChallengeTemplate> = new Map()

  constructor() {
    this.initializeDefaultTemplates()
  }

  /**
   * Initialize default challenge templates
   */
  private initializeDefaultTemplates() {
    // Variable Declaration Template
    this.registerTemplate({
      id: 'variable_declaration',
      name: 'Variable Declaration Challenge',
      description: 'Create challenges for variable declaration and assignment',
      category: 'variables',
      starterCodeTemplate: `# {challenge_description}
# Create a variable called '{variable_name}' and set it to {expected_value}
# Your code here:

`,
      instructionTemplate: "Create a variable called '{variable_name}' and set it to {expected_value}",
      validationTemplate: `
def validate_solution(code):
    # Execute the code in a safe environment
    exec_globals = {}
    try:
        exec(code, exec_globals)
        if '{variable_name}' in exec_globals:
            actual_value = exec_globals['{variable_name}']
            expected_value = {expected_value}
            if actual_value == expected_value:
                return True, 100, "Perfect! Variable created correctly."
            else:
                return False, 50, f"Variable '{variable_name}' should be {expected_value}, but got {actual_value}"
        else:
            return False, 0, "Variable '{variable_name}' not found. Make sure you create it."
    except Exception as e:
        return False, 0, f"Error in code: {str(e)}"
      `,
      parameters: [
        {
          name: 'variable_name',
          type: 'string',
          description: 'Name of the variable to create',
          defaultValue: 'my_variable'
        },
        {
          name: 'expected_value',
          type: 'string',
          description: 'Expected value for the variable (as Python code)',
          defaultValue: "'hello'"
        },
        {
          name: 'challenge_description',
          type: 'string',
          description: 'Description of the challenge',
          defaultValue: 'Variable Assignment Challenge'
        }
      ],
      difficultyScaling: {
        beginner: { xpMultiplier: 1.0, timeMultiplier: 1.0, hintPenalty: 0.1, additionalConcepts: [] },
        intermediate: { xpMultiplier: 1.3, timeMultiplier: 0.8, hintPenalty: 0.2, additionalConcepts: ['Type Checking'] },
        advanced: { xpMultiplier: 1.6, timeMultiplier: 0.6, hintPenalty: 0.3, additionalConcepts: ['Type Checking', 'Error Handling'] }
      },
      xpCalculation: {
        baseXp: 50,
        completionBonus: 25,
        speedBonus: 15,
        noHintBonus: 20,
        firstAttemptBonus: 30
      }
    })

    // Print Statement Template
    this.registerTemplate({
      id: 'print_statement',
      name: 'Print Statement Challenge',
      description: 'Create challenges for print statements and output',
      category: 'functions',
      starterCodeTemplate: `# {challenge_description}
# Write a print statement that outputs: {expected_output}
# Your code here:

`,
      instructionTemplate: "Write a print statement that outputs exactly: {expected_output}",
      validationTemplate: `
def validate_solution(code):
    import io
    import sys
    
    # Capture stdout
    captured_output = io.StringIO()
    sys.stdout = captured_output
    
    try:
        exec(code)
        output = captured_output.getvalue().strip()
        expected = "{expected_output}"
        
        if output == expected:
            return True, 100, "Perfect! Output matches exactly."
        elif expected.lower() in output.lower():
            return False, 70, f"Close! Expected '{expected}' but got '{output}'"
        else:
            return False, 30, f"Expected '{expected}' but got '{output}'"
    except Exception as e:
        return False, 0, f"Error in code: {str(e)}"
    finally:
        sys.stdout = sys.__stdout__
      `,
      parameters: [
        {
          name: 'expected_output',
          type: 'string',
          description: 'Expected output from the print statement',
          defaultValue: 'Hello, World!'
        },
        {
          name: 'challenge_description',
          type: 'string',
          description: 'Description of the challenge',
          defaultValue: 'Print Statement Challenge'
        }
      ],
      difficultyScaling: {
        beginner: { xpMultiplier: 1.0, timeMultiplier: 1.0, hintPenalty: 0.1, additionalConcepts: [] },
        intermediate: { xpMultiplier: 1.2, timeMultiplier: 0.9, hintPenalty: 0.15, additionalConcepts: ['String Formatting'] },
        advanced: { xpMultiplier: 1.5, timeMultiplier: 0.7, hintPenalty: 0.25, additionalConcepts: ['String Formatting', 'Variables in Print'] }
      },
      xpCalculation: {
        baseXp: 40,
        completionBonus: 20,
        speedBonus: 10,
        noHintBonus: 15,
        firstAttemptBonus: 25
      }
    })

    // Math Operations Template
    this.registerTemplate({
      id: 'math_operations',
      name: 'Math Operations Challenge',
      description: 'Create challenges for mathematical calculations',
      category: 'variables',
      starterCodeTemplate: `# {challenge_description}
# Calculate {operation_description} and store the result in a variable called 'result'
# {operand1} {operator} {operand2} = ?
# Your code here:

`,
      instructionTemplate: "Calculate {operand1} {operator} {operand2} and store the result in a variable called 'result'",
      validationTemplate: `
def validate_solution(code):
    exec_globals = {}
    try:
        exec(code, exec_globals)
        if 'result' in exec_globals:
            actual_result = exec_globals['result']
            expected_result = {expected_result}
            if actual_result == expected_result:
                return True, 100, f"Correct! {operand1} {operator} {operand2} = {expected_result}"
            else:
                return False, 60, f"Expected {expected_result} but got {actual_result}"
        else:
            return False, 0, "Variable 'result' not found. Make sure you create it with the calculation result."
    except Exception as e:
        return False, 0, f"Error in code: {str(e)}"
      `,
      parameters: [
        {
          name: 'operand1',
          type: 'number',
          description: 'First operand',
          defaultValue: 10
        },
        {
          name: 'operand2',
          type: 'number',
          description: 'Second operand',
          defaultValue: 5
        },
        {
          name: 'operator',
          type: 'string',
          description: 'Mathematical operator (+, -, *, /)',
          defaultValue: '+'
        },
        {
          name: 'expected_result',
          type: 'number',
          description: 'Expected result of the operation',
          defaultValue: 15
        },
        {
          name: 'operation_description',
          type: 'string',
          description: 'Human-readable description of the operation',
          defaultValue: 'the sum of two numbers'
        },
        {
          name: 'challenge_description',
          type: 'string',
          description: 'Description of the challenge',
          defaultValue: 'Math Operations Challenge'
        }
      ],
      difficultyScaling: {
        beginner: { xpMultiplier: 1.0, timeMultiplier: 1.0, hintPenalty: 0.1, additionalConcepts: [] },
        intermediate: { xpMultiplier: 1.4, timeMultiplier: 0.8, hintPenalty: 0.2, additionalConcepts: ['Order of Operations'] },
        advanced: { xpMultiplier: 1.7, timeMultiplier: 0.6, hintPenalty: 0.3, additionalConcepts: ['Order of Operations', 'Complex Expressions'] }
      },
      xpCalculation: {
        baseXp: 60,
        completionBonus: 30,
        speedBonus: 20,
        noHintBonus: 25,
        firstAttemptBonus: 35
      }
    })

    // Conditional Statement Template
    this.registerTemplate({
      id: 'conditional_statement',
      name: 'Conditional Statement Challenge',
      description: 'Create challenges for if/elif/else statements',
      category: 'conditionals',
      starterCodeTemplate: `# {challenge_description}
# Write an if statement that checks if {condition_description}
# If true, print "{true_message}"
# If false, print "{false_message}"
# Your code here:

{variable_name} = {test_value}
`,
      instructionTemplate: "Write an if statement that checks if {condition_description}",
      validationTemplate: `
def validate_solution(code):
    import io
    import sys
    
    # Test with multiple values
    test_cases = [
        ({test_value}, "{expected_output_1}"),
        ({alt_test_value}, "{expected_output_2}")
    ]
    
    passed_tests = 0
    for test_val, expected in test_cases:
        captured_output = io.StringIO()
        sys.stdout = captured_output
        
        try:
            # Replace the test value in code
            test_code = code.replace("{variable_name} = {test_value}", f"{variable_name} = {test_val}")
            exec(test_code)
            output = captured_output.getvalue().strip()
            
            if output == expected:
                passed_tests += 1
        except Exception:
            pass
        finally:
            sys.stdout = sys.__stdout__
    
    score = (passed_tests / len(test_cases)) * 100
    if score == 100:
        return True, score, "Perfect! All test cases passed."
    elif score >= 50:
        return False, score, f"Good! {passed_tests}/{len(test_cases)} test cases passed."
    else:
        return False, score, f"Only {passed_tests}/{len(test_cases)} test cases passed. Check your logic."
      `,
      parameters: [
        {
          name: 'variable_name',
          type: 'string',
          description: 'Name of the variable to test',
          defaultValue: 'age'
        },
        {
          name: 'test_value',
          type: 'number',
          description: 'Test value for the variable',
          defaultValue: 18
        },
        {
          name: 'alt_test_value',
          type: 'number',
          description: 'Alternative test value',
          defaultValue: 15
        },
        {
          name: 'condition_description',
          type: 'string',
          description: 'Human-readable condition description',
          defaultValue: 'age is 18 or older'
        },
        {
          name: 'true_message',
          type: 'string',
          description: 'Message to print when condition is true',
          defaultValue: 'You are an adult'
        },
        {
          name: 'false_message',
          type: 'string',
          description: 'Message to print when condition is false',
          defaultValue: 'You are a minor'
        },
        {
          name: 'expected_output_1',
          type: 'string',
          description: 'Expected output for first test case',
          defaultValue: 'You are an adult'
        },
        {
          name: 'expected_output_2',
          type: 'string',
          description: 'Expected output for second test case',
          defaultValue: 'You are a minor'
        },
        {
          name: 'challenge_description',
          type: 'string',
          description: 'Description of the challenge',
          defaultValue: 'Conditional Statement Challenge'
        }
      ],
      difficultyScaling: {
        beginner: { xpMultiplier: 1.0, timeMultiplier: 1.0, hintPenalty: 0.15, additionalConcepts: [] },
        intermediate: { xpMultiplier: 1.5, timeMultiplier: 0.8, hintPenalty: 0.25, additionalConcepts: ['Comparison Operators', 'Logical Operators'] },
        advanced: { xpMultiplier: 2.0, timeMultiplier: 0.6, hintPenalty: 0.35, additionalConcepts: ['Comparison Operators', 'Logical Operators', 'Nested Conditions'] }
      },
      xpCalculation: {
        baseXp: 80,
        completionBonus: 40,
        speedBonus: 25,
        noHintBonus: 30,
        firstAttemptBonus: 50
      }
    })
  }

  /**
   * Register a new template
   */
  registerTemplate(template: ChallengeTemplate) {
    this.templates.set(template.id, template)
  }

  /**
   * Generate a challenge from a template
   */
  generateChallenge(
    templateId: string, 
    parameters: Record<string, any>,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): MicroChallenge {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    // Merge parameters with defaults
    const mergedParams = { ...this.getDefaultParameters(template), ...parameters }

    // Generate challenge components
    const starterCode = this.substituteParameters(template.starterCodeTemplate, mergedParams)
    const instruction = this.substituteParameters(template.instructionTemplate, mergedParams)
    const validationCode = this.substituteParameters(template.validationTemplate, mergedParams)

    // Calculate XP based on difficulty
    const difficultyConfig = template.difficultyScaling[difficulty]
    const baseXp = Math.floor(template.xpCalculation.baseXp * difficultyConfig.xpMultiplier)
    const estimatedTime = Math.floor(2 * difficultyConfig.timeMultiplier) // Base 2 minutes

    // Create validation function
    const validateCode = (code: string): ValidationResult => {
      try {
        // This would be executed in a sandboxed environment in production
        const validationFunction = new Function('code', validationCode + '\nreturn validate_solution(code);')
        const [isValid, score, feedback] = validationFunction(code)
        
        return {
          isValid,
          score,
          feedback,
          errors: isValid ? undefined : [{
            message: feedback,
            type: 'logic',
            severity: 'error'
          }]
        }
      } catch (error) {
        return {
          isValid: false,
          score: 0,
          feedback: `Validation error: ${error}`,
          errors: [{
            message: error?.toString() || 'Unknown validation error',
            type: 'runtime',
            severity: 'error'
          }]
        }
      }
    }

    // Generate hints based on template
    const hints = this.generateHints(template, mergedParams, difficulty)

    // Generate challenge ID
    const challengeId = `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      id: challengeId,
      title: mergedParams.challenge_description || template.name,
      description: this.generateDescription(template, mergedParams),
      instruction,
      starterCode,
      validateCode,
      difficulty,
      estimatedTime,
      concepts: this.generateConcepts(template, difficulty),
      tags: [template.category, difficulty, templateId],
      xpReward: baseXp,
      hints,
      resources: this.generateResources(template, mergedParams),
      hasRealtimeValidation: true,
      allowMultipleSolutions: template.category !== 'conditionals' // Allow multiple solutions except for conditionals
    }
  }

  /**
   * Get default parameters for a template
   */
  private getDefaultParameters(template: ChallengeTemplate): Record<string, any> {
    const defaults: Record<string, any> = {}
    template.parameters.forEach(param => {
      defaults[param.name] = param.defaultValue
    })
    return defaults
  }

  /**
   * Substitute parameters in a template string
   */
  private substituteParameters(template: string, parameters: Record<string, any>): string {
    let result = template
    Object.entries(parameters).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value))
    })
    return result
  }

  /**
   * Generate description for a challenge
   */
  private generateDescription(template: ChallengeTemplate, parameters: Record<string, any>): string {
    const descriptions: Record<string, string> = {
      'variable_declaration': `Master the fundamentals of variable assignment. Variables are the foundation of programming - they store data that your program can use and manipulate.`,
      'print_statement': `Learn to communicate with users through output. The print function is your way to display information and results from your programs.`,
      'math_operations': `Practice mathematical calculations in Python. Programming often involves numerical computations - master the basics to build more complex algorithms.`,
      'conditional_statement': `Control program flow with decision-making logic. Conditional statements allow your programs to respond differently based on various conditions.`
    }
    
    return descriptions[template.id] || template.description
  }

  /**
   * Generate concepts based on template and difficulty
   */
  private generateConcepts(template: ChallengeTemplate, difficulty: 'beginner' | 'intermediate' | 'advanced'): string[] {
    const baseConcepts: Record<string, string[]> = {
      'variable_declaration': ['Variables', 'Assignment Operator', 'Data Types'],
      'print_statement': ['Print Function', 'String Output', 'Function Calls'],
      'math_operations': ['Arithmetic Operators', 'Variables', 'Mathematical Expressions'],
      'conditional_statement': ['If Statements', 'Boolean Logic', 'Comparison Operators']
    }

    const concepts = baseConcepts[template.id] || ['Programming Basics']
    const difficultyConfig = template.difficultyScaling[difficulty]
    
    return [...concepts, ...(difficultyConfig.additionalConcepts || [])]
  }

  /**
   * Generate hints based on template and difficulty
   */
  private generateHints(template: ChallengeTemplate, parameters: Record<string, any>, difficulty: 'beginner' | 'intermediate' | 'advanced') {
    const hintTemplates: Record<string, string[]> = {
      'variable_declaration': [
        "Variables are created with the assignment operator (=). Format: variable_name = value",
        "Remember to use quotes around text values: name = 'John'",
        "Variable names should be descriptive and use underscores for spaces"
      ],
      'print_statement': [
        "The print function displays output: print('your message here')",
        "Make sure your output matches exactly, including capitalization and punctuation",
        "Use quotes around text in the print function"
      ],
      'math_operations': [
        "Use arithmetic operators: + (add), - (subtract), * (multiply), / (divide)",
        "Store the calculation result in a variable: result = calculation",
        "Follow the order of operations (PEMDAS) for complex expressions"
      ],
      'conditional_statement': [
        "If statements check conditions: if condition: (don't forget the colon)",
        "Use comparison operators: == (equals), > (greater than), < (less than)",
        "Include an else clause for the alternative case",
        "Make sure your indentation is correct (4 spaces)"
      ]
    }

    const templateHints = hintTemplates[template.id] || ["Break down the problem into smaller steps"]
    
    return templateHints.map((content, index) => ({
      id: `hint_${index + 1}`,
      content,
      unlockCondition: 'manual' as const,
      xpCost: difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 10 : 15
    }))
  }

  /**
   * Generate resources for a challenge
   */
  private generateResources(template: ChallengeTemplate, parameters: Record<string, any>) {
    const resourceTemplates: Record<string, any[]> = {
      'variable_declaration': [
        {
          title: "Python Variables Guide",
          content: "Variables store data values. Create them using the assignment operator (=). Example: my_name = 'Alice'",
          type: "reference"
        },
        {
          title: "Naming Convention",
          content: "Use descriptive names with underscores: user_age, total_score, first_name",
          type: "tip"
        }
      ],
      'print_statement': [
        {
          title: "Print Function Syntax",
          content: "print('your message') displays text output. The message must be in quotes.",
          type: "reference"
        },
        {
          title: "Output Formatting",
          content: "Make sure output matches exactly - check spaces, capitalization, and punctuation",
          type: "tip"
        }
      ],
      'math_operations': [
        {
          title: "Arithmetic Operators",
          content: "Python supports +, -, *, / for basic math. Use ** for exponents and % for remainder.",
          type: "reference"
        },
        {
          title: "Order of Operations",
          content: "Python follows PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction",
          type: "example"
        }
      ],
      'conditional_statement': [
        {
          title: "If Statement Syntax",
          content: "if condition: (colon required)\n    code to run (indented)\nelse:\n    alternative code",
          type: "reference"
        },
        {
          title: "Comparison Operators",
          content: "== (equals), != (not equals), > (greater), < (less), >= (greater/equal), <= (less/equal)",
          type: "reference"
        }
      ]
    }

    return resourceTemplates[template.id] || []
  }

  /**
   * Get all available templates
   */
  getTemplates(): ChallengeTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): ChallengeTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): ChallengeTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.category === category)
  }
}

// Singleton instance
export const challengeTemplateSystem = new ChallengeTemplateSystem()