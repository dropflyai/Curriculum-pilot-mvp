// Educational Output Analyzer for Agent Academy IDE
// Intelligent analysis of code output for educational insights and learning opportunities

import {
  OutputMessage,
  EducationalAnnotation,
  EducationalInsight,
  MessageAnalysis,
  ConceptDatabase,
  PatternMatcher,
  ConceptDefinition,
  CodeExample,
  EducationalDifficulty
} from '../../types/output'

export class EducationalOutputAnalyzer {
  private conceptDatabase: ConceptDatabase
  private commonMistakePatterns: Map<string, PatternMatcher>
  private successPatterns: Map<string, PatternMatcher>
  private languageAnalyzers: Map<string, LanguageAnalyzer>
  
  constructor() {
    this.conceptDatabase = this.initializeConceptDatabase()
    this.commonMistakePatterns = this.initializeMistakePatterns()
    this.successPatterns = this.initializeSuccessPatterns()
    this.languageAnalyzers = this.initializeLanguageAnalyzers()
  }
  
  /**
   * Main entry point for analyzing a message for educational value
   */
  async analyzeMessage(message: OutputMessage): Promise<EducationalAnnotation | null> {
    try {
      const analysis = await this.performAnalysis(message)
      
      if (!analysis.hasEducationalValue) {
        return null
      }
      
      return {
        concept: analysis.concept!,
        explanation: analysis.explanation!,
        learningObjective: analysis.learningObjective!,
        difficulty: analysis.difficulty!,
        relatedTopics: analysis.relatedTopics!,
        suggestedActions: analysis.suggestedActions!,
        commonMistake: analysis.isCommonMistake,
        helpfulResources: this.getHelpfulResources(analysis.concept!),
        codeExamples: this.getCodeExamples(analysis.concept!, message.source)
      }
    } catch (error) {
      console.error('Error analyzing message:', error)
      return null
    }
  }
  
  /**
   * Perform detailed analysis of the message content
   */
  private async performAnalysis(message: OutputMessage): Promise<MessageAnalysis> {
    const content = message.content.toLowerCase()
    const source = message.source
    
    // Delegate to language-specific analyzer
    const languageAnalyzer = this.languageAnalyzers.get(source)
    if (languageAnalyzer) {
      return languageAnalyzer.analyze(message)
    }
    
    // Fallback to general analysis
    return this.performGeneralAnalysis(message)
  }
  
  /**
   * General analysis for messages without specific language analyzers
   */
  private performGeneralAnalysis(message: OutputMessage): MessageAnalysis {
    const content = message.content.toLowerCase()
    
    // Check for common patterns
    for (const [pattern, matcher] of this.commonMistakePatterns) {
      if (matcher.pattern.test(content)) {
        const concept = this.conceptDatabase.concepts.get(matcher.concept)
        if (concept) {
          return {
            hasEducationalValue: true,
            concept: concept.name,
            explanation: concept.description,
            learningObjective: `Understanding ${concept.name}`,
            difficulty: concept.difficulty,
            relatedTopics: concept.prerequisites,
            suggestedActions: [`Review ${concept.name} basics`, 'Practice with examples'],
            isCommonMistake: true,
            confidence: matcher.confidence
          }
        }
      }
    }
    
    return { hasEducationalValue: false }
  }
  
  /**
   * Generate educational insight for successful patterns
   */
  async generateInsight(message: OutputMessage): Promise<EducationalInsight | null> {
    try {
      // Check if this is a success pattern worth celebrating
      const insight = await this.generateSuccessInsight(message)
      if (insight) return insight
      
      // Check for learning opportunities in warnings
      if (message.level === 'warn') {
        return await this.generateWarningInsight(message)
      }
      
      // Check for build/test insights
      if (message.channel === 'build-output' || message.channel === 'test-runner') {
        return await this.generateBuildTestInsight(message)
      }
      
      return null
    } catch (error) {
      console.error('Error generating insight:', error)
      return null
    }
  }
  
  /**
   * Generate quick help for immediate assistance
   */
  async generateQuickHelp(message: OutputMessage): Promise<EducationalAnnotation | null> {
    const content = message.content.toLowerCase()
    
    // Quick help patterns
    if (content.includes('syntax error')) {
      return {
        concept: 'Syntax Error',
        explanation: 'There\'s a formatting or grammar issue in your code. Check for missing punctuation, incorrect indentation, or typos.',
        learningObjective: 'Learning proper code syntax',
        difficulty: 'beginner',
        relatedTopics: ['syntax', 'debugging'],
        suggestedActions: [
          'Check for missing colons, parentheses, or quotes',
          'Verify proper indentation',
          'Look for typos in keywords'
        ]
      }
    }
    
    if (content.includes('module not found') || content.includes('cannot import')) {
      return {
        concept: 'Import Error',
        explanation: 'The code is trying to use a module or package that isn\'t available. This could be a missing installation or incorrect import path.',
        learningObjective: 'Understanding module imports and dependencies',
        difficulty: 'intermediate',
        relatedTopics: ['imports', 'packages', 'dependencies'],
        suggestedActions: [
          'Check if the package is installed',
          'Verify the import path is correct',
          'Install missing dependencies with pip or npm'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Generate insight for successful execution patterns
   */
  private async generateSuccessInsight(message: OutputMessage): Promise<EducationalInsight | null> {
    if (message.level !== 'success') return null
    
    const insights: EducationalInsight[] = [
      {
        id: this.generateInsightId(),
        concept: 'Successful Execution',
        explanation: 'Great job! Your code executed successfully without errors.',
        detailedExplanation: 'When code runs successfully, it means:\n• Syntax is correct\n• All imports are working\n• Logic flows properly\n• No runtime errors occurred',
        learningObjective: 'Building confidence in code execution and debugging skills',
        difficulty: 'beginner',
        relatedTopics: ['debugging', 'testing', 'code-quality'],
        suggestedActions: [
          'Try modifying the code to experiment',
          'Add more features gradually',
          'Save this working version as reference'
        ],
        timestamp: new Date()
      }
    ]
    
    // Return random insight to avoid repetition
    return insights[Math.floor(Math.random() * insights.length)]
  }
  
  /**
   * Generate insight for warning messages
   */
  private async generateWarningInsight(message: OutputMessage): Promise<EducationalInsight | null> {
    return {
      id: this.generateInsightId(),
      concept: 'Code Warning',
      explanation: 'Your code works but could be improved. Warnings help you write better, more maintainable code.',
      detailedExplanation: 'Warnings are helpful suggestions to:\n• Improve code quality\n• Prevent potential issues\n• Follow best practices\n• Make code more readable',
      learningObjective: 'Learning to write clean, professional code',
      difficulty: 'intermediate',
      relatedTopics: ['best-practices', 'code-quality', 'debugging'],
      suggestedActions: [
        'Address warnings when possible',
        'Learn why the warning exists',
        'Research best practices for the warning type'
      ],
      timestamp: new Date()
    }
  }
  
  /**
   * Generate insight for build/test messages
   */
  private async generateBuildTestInsight(message: OutputMessage): Promise<EducationalInsight | null> {
    if (message.level === 'success') {
      return {
        id: this.generateInsightId(),
        concept: 'Build Success',
        explanation: 'Your project built successfully! This means all dependencies are resolved and code compiles properly.',
        detailedExplanation: 'A successful build indicates:\n• All syntax is valid\n• Dependencies are installed\n• Import paths are correct\n• Configuration is proper',
        learningObjective: 'Understanding the build process and project structure',
        difficulty: 'intermediate',
        relatedTopics: ['build-systems', 'dependencies', 'project-structure'],
        suggestedActions: [
          'Test your application',
          'Deploy to see it running',
          'Add new features incrementally'
        ],
        timestamp: new Date()
      }
    }
    
    return null
  }
  
  /**
   * Initialize concept database with educational concepts
   */
  private initializeConceptDatabase(): ConceptDatabase {
    const concepts = new Map<string, ConceptDefinition>()
    const patterns = new Map<string, PatternMatcher>()
    const relationships = new Map<string, string[]>()
    
    // Python concepts
    concepts.set('python-syntax-error', {
      id: 'python-syntax-error',
      name: 'Python Syntax Error',
      description: 'Issues with Python code structure, punctuation, or formatting',
      difficulty: 'beginner',
      prerequisites: ['python-basics'],
      examples: [
        {
          title: 'Missing Colon',
          code: 'if x > 5:\n    print("Greater than 5")',
          language: 'python',
          explanation: 'Python requires colons after if statements, loops, and function definitions'
        }
      ],
      commonMistakes: ['Missing colons', 'Incorrect indentation', 'Unmatched parentheses'],
      resources: ['Python syntax guide', 'Indentation tutorial']
    })
    
    concepts.set('python-name-error', {
      id: 'python-name-error',
      name: 'Python NameError',
      description: 'Attempting to use a variable that hasn\'t been defined',
      difficulty: 'beginner',
      prerequisites: ['variables', 'scope'],
      examples: [
        {
          title: 'Variable Definition',
          code: 'name = "Alice"\nprint(name)',
          language: 'python',
          explanation: 'Variables must be defined before use'
        }
      ],
      commonMistakes: ['Using undefined variables', 'Typos in variable names', 'Scope issues'],
      resources: ['Python variables guide', 'Scope tutorial']
    })
    
    // JavaScript concepts
    concepts.set('javascript-reference-error', {
      id: 'javascript-reference-error',
      name: 'JavaScript ReferenceError',
      description: 'Trying to use a variable or function that doesn\'t exist',
      difficulty: 'beginner',
      prerequisites: ['javascript-variables', 'scope'],
      examples: [
        {
          title: 'Variable Declaration',
          code: 'let name = "Alice";\nconsole.log(name);',
          language: 'javascript',
          explanation: 'Variables must be declared with let, const, or var'
        }
      ],
      commonMistakes: ['Undeclared variables', 'Typos', 'Scope issues'],
      resources: ['JavaScript variables guide', 'Hoisting explained']
    })
    
    return { concepts, patterns, relationships }
  }
  
  /**
   * Initialize common mistake patterns
   */
  private initializeMistakePatterns(): Map<string, PatternMatcher> {
    const patterns = new Map<string, PatternMatcher>()
    
    patterns.set('python-syntax', {
      pattern: /syntax\s*error/i,
      concept: 'python-syntax-error',
      confidence: 0.9
    })
    
    patterns.set('python-name', {
      pattern: /name\s*error.*is\s+not\s+defined/i,
      concept: 'python-name-error',
      confidence: 0.9
    })
    
    patterns.set('javascript-reference', {
      pattern: /reference\s*error.*is\s+not\s+defined/i,
      concept: 'javascript-reference-error',
      confidence: 0.9
    })
    
    return patterns
  }
  
  /**
   * Initialize success patterns
   */
  private initializeSuccessPatterns(): Map<string, PatternMatcher> {
    const patterns = new Map<string, PatternMatcher>()
    
    patterns.set('python-success', {
      pattern: /^(?!.*error).*$/i,
      concept: 'successful-execution',
      confidence: 0.7
    })
    
    return patterns
  }
  
  /**
   * Initialize language-specific analyzers
   */
  private initializeLanguageAnalyzers(): Map<string, LanguageAnalyzer> {
    const analyzers = new Map<string, LanguageAnalyzer>()
    
    analyzers.set('python', new PythonAnalyzer())
    analyzers.set('javascript', new JavaScriptAnalyzer())
    analyzers.set('typescript', new TypeScriptAnalyzer())
    
    return analyzers
  }
  
  /**
   * Get helpful resources for a concept
   */
  private getHelpfulResources(concept: string): string[] {
    const conceptDef = this.conceptDatabase.concepts.get(concept.toLowerCase().replace(/\s+/g, '-'))
    return conceptDef?.resources || [
      'Official documentation',
      'Interactive tutorials',
      'Community forums'
    ]
  }
  
  /**
   * Get code examples for a concept
   */
  private getCodeExamples(concept: string, source: string): CodeExample[] {
    const conceptDef = this.conceptDatabase.concepts.get(concept.toLowerCase().replace(/\s+/g, '-'))
    if (conceptDef) {
      return conceptDef.examples.filter(ex => ex.language === source)
    }
    return []
  }
  
  /**
   * Generate unique insight ID
   */
  private generateInsightId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Base class for language-specific analyzers
 */
abstract class LanguageAnalyzer {
  abstract analyze(message: OutputMessage): MessageAnalysis
}

/**
 * Python-specific output analyzer
 */
class PythonAnalyzer extends LanguageAnalyzer {
  analyze(message: OutputMessage): MessageAnalysis {
    const content = message.content
    
    // Python NameError analysis
    if (content.includes('NameError')) {
      const variableMatch = content.match(/name '([^']+)' is not defined/)
      const variableName = variableMatch ? variableMatch[1] : 'variable'
      
      return {
        hasEducationalValue: true,
        concept: 'Variable Definition',
        explanation: `The variable '${variableName}' hasn't been defined yet. In Python, you need to create variables before using them.`,
        learningObjective: 'Understanding variable declaration and scope in Python',
        difficulty: 'beginner',
        relatedTopics: ['variables', 'scope', 'debugging'],
        suggestedActions: [
          `Define ${variableName} before using it: ${variableName} = value`,
          'Check for typos in variable names',
          'Make sure the variable is in the correct scope'
        ],
        isCommonMistake: true,
        confidence: 0.9
      }
    }
    
    // Python SyntaxError analysis
    if (content.includes('SyntaxError')) {
      return {
        hasEducationalValue: true,
        concept: 'Python Syntax',
        explanation: 'There\'s a grammar mistake in your Python code. Python is very particular about syntax.',
        learningObjective: 'Learning proper Python syntax and formatting rules',
        difficulty: 'beginner',
        relatedTopics: ['syntax', 'indentation', 'punctuation'],
        suggestedActions: [
          'Check for missing colons after if, for, def statements',
          'Verify proper indentation (use 4 spaces)',
          'Check for matching parentheses and quotes'
        ],
        isCommonMistake: true,
        confidence: 0.9
      }
    }
    
    // Python IndentationError
    if (content.includes('IndentationError')) {
      return {
        hasEducationalValue: true,
        concept: 'Python Indentation',
        explanation: 'Python uses indentation (spaces) to group code blocks. All lines at the same level must have the same indentation.',
        learningObjective: 'Understanding Python indentation rules',
        difficulty: 'beginner',
        relatedTopics: ['syntax', 'code-blocks', 'structure'],
        suggestedActions: [
          'Use 4 spaces for each indentation level',
          'Be consistent with spaces vs tabs',
          'Use a code editor with indentation guides'
        ],
        isCommonMistake: true,
        confidence: 0.9
      }
    }
    
    return { hasEducationalValue: false }
  }
}

/**
 * JavaScript-specific output analyzer
 */
class JavaScriptAnalyzer extends LanguageAnalyzer {
  analyze(message: OutputMessage): MessageAnalysis {
    const content = message.content
    
    // JavaScript ReferenceError analysis
    if (content.includes('ReferenceError')) {
      return {
        hasEducationalValue: true,
        concept: 'Variable References',
        explanation: 'You\'re trying to use a variable or function that JavaScript can\'t find.',
        learningObjective: 'Understanding variable declaration and scope in JavaScript',
        difficulty: 'beginner',
        relatedTopics: ['variables', 'functions', 'scope', 'hoisting'],
        suggestedActions: [
          'Declare the variable with let, const, or var',
          'Check for typos in variable names',
          'Make sure imports are correct if using modules'
        ],
        isCommonMistake: true,
        confidence: 0.9
      }
    }
    
    // JavaScript TypeError analysis
    if (content.includes('TypeError')) {
      return {
        hasEducationalValue: true,
        concept: 'Data Types',
        explanation: 'You\'re trying to do something with the wrong type of data. JavaScript has specific rules about what you can do with different types.',
        learningObjective: 'Understanding JavaScript data types and their operations',
        difficulty: 'intermediate',
        relatedTopics: ['data-types', 'type-coercion', 'debugging'],
        suggestedActions: [
          'Check the data type with typeof',
          'Convert data to the correct type if needed',
          'Use console.log to inspect values before operations'
        ],
        isCommonMistake: true,
        confidence: 0.8
      }
    }
    
    return { hasEducationalValue: false }
  }
}

/**
 * TypeScript-specific output analyzer
 */
class TypeScriptAnalyzer extends LanguageAnalyzer {
  analyze(message: OutputMessage): MessageAnalysis {
    const content = message.content
    
    // TypeScript type errors
    if (content.includes('Type') && content.includes('is not assignable to type')) {
      return {
        hasEducationalValue: true,
        concept: 'Type Safety',
        explanation: 'TypeScript found a type mismatch. The value you\'re trying to assign doesn\'t match the expected type.',
        learningObjective: 'Understanding TypeScript type system and type safety',
        difficulty: 'intermediate',
        relatedTopics: ['types', 'type-safety', 'interfaces'],
        suggestedActions: [
          'Check the expected type definition',
          'Convert the value to the correct type',
          'Update the type annotation if needed'
        ],
        isCommonMistake: true,
        confidence: 0.9
      }
    }
    
    // Fall back to JavaScript analysis for runtime errors
    const jsAnalyzer = new JavaScriptAnalyzer()
    return jsAnalyzer.analyze(message)
  }
}