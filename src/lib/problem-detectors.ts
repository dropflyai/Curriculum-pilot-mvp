/**
 * Agent Academy IDE - Multi-Language Problem Detectors
 * Specific implementations for Python, JavaScript, TypeScript, and React
 */

import { 
  Problem, 
  ProblemDetector, 
  createProblemId, 
  getEducationalExplanation,
  EDUCATIONAL_ERRORS 
} from './problem-detector'

// Python Problem Detector
export class PythonDetector implements ProblemDetector {
  language = 'python'

  async detectErrors(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Syntax error detection
      problems.push(...this.detectSyntaxErrors(line, lineNumber, filePath))
      
      // Runtime error detection (static analysis)
      problems.push(...this.detectRuntimeErrors(line, lineNumber, filePath, lines))
      
      // Logical error detection
      problems.push(...this.detectLogicalErrors(line, lineNumber, filePath))
    }

    return problems
  }

  async detectWarnings(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Style warnings
      problems.push(...this.detectStyleWarnings(line, lineNumber, filePath))
      
      // Performance warnings
      problems.push(...this.detectPerformanceWarnings(line, lineNumber, filePath))
      
      // Best practice warnings
      problems.push(...this.detectBestPracticeWarnings(line, lineNumber, filePath))
    }

    return problems
  }

  async detectSuggestions(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Code improvement suggestions
      problems.push(...this.detectImprovementSuggestions(line, lineNumber, filePath))
    }

    return problems
  }

  private detectSyntaxErrors(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Missing closing parenthesis
    if (line.includes('(') && !line.includes(')') && !line.trim().endsWith('\\')) {
      problems.push({
        id: createProblemId('syntax', lineNumber, line.indexOf('('), line),
        type: 'error',
        severity: 'critical',
        message: 'SyntaxError: Missing closing parenthesis',
        educationalExplanation: getEducationalExplanation('SyntaxError', 'beginner'),
        fixSuggestion: 'Add a closing parenthesis ")" to match the opening parenthesis',
        learnMore: 'https://docs.python.org/3/tutorial/introduction.html#strings',
        position: { line: lineNumber, column: line.indexOf('(') + 1 },
        code: 'SyntaxError',
        category: 'syntax',
        source: 'Python',
        file: filePath
      })
    }

    // Missing colon after if/for/while/def/class
    const controlKeywords = ['if ', 'for ', 'while ', 'def ', 'class ', 'elif ', 'else', 'except', 'finally', 'with ', 'try']
    for (const keyword of controlKeywords) {
      if (line.trim().startsWith(keyword) && !line.includes(':') && line.trim() !== 'else' && line.trim() !== 'finally') {
        problems.push({
          id: createProblemId('syntax', lineNumber, line.indexOf(keyword), line),
          type: 'error',
          severity: 'critical',
          message: `SyntaxError: Missing colon after ${keyword.trim()}`,
          educationalExplanation: getEducationalExplanation('SyntaxError', 'beginner'),
          fixSuggestion: `Add a colon ":" at the end of the ${keyword.trim()} statement`,
          learnMore: 'https://docs.python.org/3/tutorial/controlflow.html',
          position: { line: lineNumber, column: line.length },
          code: 'SyntaxError',
          category: 'syntax',
          source: 'Python',
          file: filePath
        })
      }
    }

    // Indentation errors (basic detection)
    if (line.startsWith('\t') && line.includes('    ')) {
      problems.push({
        id: createProblemId('indentation', lineNumber, 0, line),
        type: 'error',
        severity: 'critical',
        message: 'IndentationError: Mixed tabs and spaces',
        educationalExplanation: getEducationalExplanation('IndentationError', 'beginner'),
        fixSuggestion: 'Use either spaces or tabs consistently, not both. Python recommends 4 spaces.',
        learnMore: 'https://pep8.org/#indentation',
        position: { line: lineNumber, column: 1 },
        code: 'IndentationError',
        category: 'syntax',
        source: 'Python',
        file: filePath
      })
    }

    return problems
  }

  private detectRuntimeErrors(line: string, lineNumber: number, filePath?: string, allLines?: string[]): Problem[] {
    const problems: Problem[] = []

    // Potential NameError - using undefined variables (basic heuristic)
    const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g
    const matches = Array.from(line.matchAll(variablePattern))
    
    for (const match of matches) {
      const varName = match[1]
      // Skip keywords and common built-ins
      const keywords = ['print', 'input', 'len', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'range', 'enumerate', 'zip', 'map', 'filter', 'abs', 'max', 'min', 'sum', 'True', 'False', 'None', 'if', 'else', 'elif', 'for', 'while', 'def', 'class', 'return', 'break', 'continue', 'pass', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'and', 'or', 'not', 'in', 'is']
      
      if (!keywords.includes(varName) && !line.includes(varName + ' =') && !line.includes('def ' + varName)) {
        // Check if variable is defined in previous lines (simple check)
        const isDefinedAbove = allLines?.slice(0, lineNumber - 1).some(prevLine => 
          prevLine.includes(varName + ' =') || prevLine.includes('def ' + varName) || prevLine.includes('for ' + varName)
        )

        if (!isDefinedAbove && line.includes(varName) && !line.startsWith('#')) {
          problems.push({
            id: createProblemId('name', lineNumber, match.index || 0, line),
            type: 'warning',
            severity: 'major',
            message: `Potential NameError: '${varName}' may not be defined`,
            educationalExplanation: getEducationalExplanation('NameError', 'beginner'),
            fixSuggestion: `Make sure '${varName}' is defined before using it`,
            learnMore: 'https://docs.python.org/3/tutorial/errors.html#exceptions',
            position: { line: lineNumber, column: (match.index || 0) + 1 },
            code: 'NameError',
            category: 'logic',
            source: 'Python',
            file: filePath
          })
        }
      }
    }

    return problems
  }

  private detectLogicalErrors(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Infinite loop warning
    if (line.trim() === 'while True:') {
      problems.push({
        id: createProblemId('logic', lineNumber, 0, line),
        type: 'warning',
        severity: 'major',
        message: 'Potential infinite loop detected',
        educationalExplanation: 'This creates a loop that will run forever unless you have a break statement inside.',
        fixSuggestion: 'Make sure you have a break statement or change the condition to eventually become False',
        learnMore: 'https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements',
        position: { line: lineNumber, column: 1 },
        code: 'InfiniteLoop',
        category: 'logic',
        source: 'Python',
        file: filePath
      })
    }

    return problems
  }

  private detectStyleWarnings(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Line too long (PEP 8: 79 characters)
    if (line.length > 79) {
      problems.push({
        id: createProblemId('style', lineNumber, 79, line),
        type: 'warning',
        severity: 'minor',
        message: 'Line too long (PEP 8: max 79 characters)',
        educationalExplanation: 'Python style guide recommends keeping lines under 79 characters for better readability.',
        fixSuggestion: 'Break this line into multiple lines or shorten variable names',
        learnMore: 'https://pep8.org/#maximum-line-length',
        position: { line: lineNumber, column: 80 },
        code: 'E501',
        category: 'style',
        source: 'Python',
        file: filePath
      })
    }

    // Missing spaces around operators
    const operatorPattern = /[a-zA-Z0-9_][+\-*\/=><][a-zA-Z0-9_]/
    if (operatorPattern.test(line)) {
      const match = line.match(operatorPattern)
      if (match) {
        problems.push({
          id: createProblemId('style', lineNumber, line.indexOf(match[0]), line),
          type: 'suggestion',
          severity: 'minor',
          message: 'Missing spaces around operator',
          educationalExplanation: 'Python style guide recommends spaces around operators for better readability.',
          fixSuggestion: 'Add spaces before and after operators (e.g., "a + b" instead of "a+b")',
          learnMore: 'https://pep8.org/#whitespace-in-expressions-and-statements',
          position: { line: lineNumber, column: line.indexOf(match[0]) + 1 },
          code: 'E225',
          category: 'style',
          source: 'Python',
          file: filePath
        })
      }
    }

    return problems
  }

  private detectPerformanceWarnings(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // String concatenation in loop (potential performance issue)
    if (line.includes('for ') && line.includes(' + ')) {
      problems.push({
        id: createProblemId('performance', lineNumber, line.indexOf(' + '), line),
        type: 'suggestion',
        severity: 'minor',
        message: 'Consider using join() for string concatenation in loops',
        educationalExplanation: 'String concatenation with + in loops can be inefficient. join() is usually faster.',
        fixSuggestion: 'Use "".join() method or list comprehension for better performance',
        learnMore: 'https://docs.python.org/3/library/stdtypes.html#str.join',
        position: { line: lineNumber, column: line.indexOf(' + ') + 1 },
        code: 'PERF001',
        category: 'performance',
        source: 'Python',
        file: filePath
      })
    }

    return problems
  }

  private detectBestPracticeWarnings(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Using bare except
    if (line.trim() === 'except:') {
      problems.push({
        id: createProblemId('practice', lineNumber, 0, line),
        type: 'warning',
        severity: 'minor',
        message: 'Avoid bare except clauses',
        educationalExplanation: 'Catching all exceptions with bare "except:" can hide bugs and make debugging difficult.',
        fixSuggestion: 'Specify the exception type: "except ValueError:" or use "except Exception:" if you must catch all',
        learnMore: 'https://docs.python.org/3/tutorial/errors.html#handling-exceptions',
        position: { line: lineNumber, column: 1 },
        code: 'E722',
        category: 'style',
        source: 'Python',
        file: filePath
      })
    }

    return problems
  }

  private detectImprovementSuggestions(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // TODO/FIXME comments
    if (line.includes('TODO') || line.includes('FIXME')) {
      const keyword = line.includes('TODO') ? 'TODO' : 'FIXME'
      problems.push({
        id: createProblemId('todo', lineNumber, line.indexOf(keyword), line),
        type: 'info',
        severity: 'info',
        message: `${keyword} comment found`,
        educationalExplanation: `This is a reminder comment for future improvements or fixes.`,
        fixSuggestion: `Address this ${keyword} item when you have time`,
        learnMore: '',
        position: { line: lineNumber, column: line.indexOf(keyword) + 1 },
        code: keyword,
        category: 'style',
        source: 'Python',
        file: filePath
      })
    }

    return problems
  }
}

// JavaScript/TypeScript Problem Detector
export class JavaScriptDetector implements ProblemDetector {
  language = 'javascript'

  async detectErrors(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Basic syntax error detection
      problems.push(...this.detectJSSyntaxErrors(line, lineNumber, filePath))
      
      // Runtime error detection
      problems.push(...this.detectJSRuntimeErrors(line, lineNumber, filePath))
    }

    return problems
  }

  async detectWarnings(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      problems.push(...this.detectJSWarnings(line, lineNumber, filePath))
    }

    return problems
  }

  async detectSuggestions(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      problems.push(...this.detectJSSuggestions(line, lineNumber, filePath))
    }

    return problems
  }

  private detectJSSyntaxErrors(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Missing semicolon (if using semicolon style)
    if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') && !line.trim().startsWith('//') && !line.includes('if ') && !line.includes('for ') && !line.includes('while ') && !line.includes('function') && !line.includes('=>')) {
      const statementKeywords = ['const ', 'let ', 'var ', 'return ', 'throw ']
      if (statementKeywords.some(keyword => line.trim().startsWith(keyword))) {
        problems.push({
          id: createProblemId('syntax', lineNumber, line.length, line),
          type: 'warning',
          severity: 'minor',
          message: 'Missing semicolon',
          educationalExplanation: 'While JavaScript has automatic semicolon insertion, explicit semicolons improve code clarity and prevent potential issues.',
          fixSuggestion: 'Add a semicolon at the end of this statement',
          learnMore: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Automatic_semicolon_insertion',
          position: { line: lineNumber, column: line.length + 1 },
          code: 'SemicolonError',
          category: 'style',
          source: 'JavaScript',
          file: filePath
        })
      }
    }

    return problems
  }

  private detectJSRuntimeErrors(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Potential undefined variable usage
    const undefinedPattern = /console\.log\(([a-zA-Z_][a-zA-Z0-9_]*)\)/
    const match = line.match(undefinedPattern)
    if (match) {
      const varName = match[1]
      problems.push({
        id: createProblemId('runtime', lineNumber, match.index || 0, line),
        type: 'info',
        severity: 'info',
        message: `Make sure '${varName}' is defined`,
        educationalExplanation: 'Accessing undefined variables will result in a ReferenceError at runtime.',
        fixSuggestion: `Ensure '${varName}' is declared before using it`,
        learnMore: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_defined',
        position: { line: lineNumber, column: (match.index || 0) + 1 },
        code: 'ReferenceError',
        category: 'logic',
        source: 'JavaScript',
        file: filePath
      })
    }

    return problems
  }

  private detectJSWarnings(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Using var instead of let/const
    if (line.includes('var ')) {
      problems.push({
        id: createProblemId('style', lineNumber, line.indexOf('var '), line),
        type: 'suggestion',
        severity: 'minor',
        message: 'Consider using "let" or "const" instead of "var"',
        educationalExplanation: 'let and const have block scope and are generally preferred over var in modern JavaScript.',
        fixSuggestion: 'Use "const" for values that don\'t change, "let" for values that do change',
        learnMore: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
        position: { line: lineNumber, column: line.indexOf('var ') + 1 },
        code: 'ES6_VAR',
        category: 'style',
        source: 'JavaScript',
        file: filePath
      })
    }

    return problems
  }

  private detectJSSuggestions(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Arrow function suggestion
    if (line.includes('function(') && !line.includes('function ')) {
      problems.push({
        id: createProblemId('suggestion', lineNumber, line.indexOf('function('), line),
        type: 'suggestion',
        severity: 'info',
        message: 'Consider using arrow function syntax',
        educationalExplanation: 'Arrow functions provide a more concise syntax and lexical "this" binding.',
        fixSuggestion: 'Replace "function() {}" with "() => {}"',
        learnMore: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
        position: { line: lineNumber, column: line.indexOf('function(') + 1 },
        code: 'ARROW_FUNCTION',
        category: 'style',
        source: 'JavaScript',
        file: filePath
      })
    }

    return problems
  }
}

// React-specific Problem Detector
export class ReactDetector implements ProblemDetector {
  language = 'react'

  async detectErrors(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      problems.push(...this.detectReactErrors(line, lineNumber, filePath))
    }

    return problems
  }

  async detectWarnings(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      problems.push(...this.detectReactWarnings(line, lineNumber, filePath))
    }

    return problems
  }

  async detectSuggestions(code: string, filePath?: string): Promise<Problem[]> {
    const problems: Problem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      problems.push(...this.detectReactSuggestions(line, lineNumber, filePath))
    }

    return problems
  }

  private detectReactErrors(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Missing key prop in lists
    if (line.includes('.map(') && !line.includes('key=')) {
      problems.push({
        id: createProblemId('react', lineNumber, line.indexOf('.map('), line),
        type: 'warning',
        severity: 'major',
        message: 'Missing "key" prop in list items',
        educationalExplanation: 'Each list item should have a unique "key" prop to help React identify which items have changed.',
        fixSuggestion: 'Add a key prop with a unique value: key={item.id} or key={index}',
        learnMore: 'https://reactjs.org/docs/lists-and-keys.html',
        position: { line: lineNumber, column: line.indexOf('.map(') + 1 },
        code: 'REACT_KEY_PROP',
        category: 'logic',
        source: 'React',
        file: filePath
      })
    }

    return problems
  }

  private detectReactWarnings(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Inline styles without camelCase
    if (line.includes('style={{') && line.includes('-')) {
      problems.push({
        id: createProblemId('react', lineNumber, line.indexOf('style={{'), line),
        type: 'warning',
        severity: 'minor',
        message: 'CSS properties in React should use camelCase',
        educationalExplanation: 'React requires CSS properties to be in camelCase format (backgroundColor instead of background-color).',
        fixSuggestion: 'Convert CSS properties to camelCase (e.g., backgroundColor, fontSize, marginTop)',
        learnMore: 'https://reactjs.org/docs/dom-elements.html#style',
        position: { line: lineNumber, column: line.indexOf('style={{') + 1 },
        code: 'REACT_CAMELCASE',
        category: 'style',
        source: 'React',
        file: filePath
      })
    }

    return problems
  }

  private detectReactSuggestions(line: string, lineNumber: number, filePath?: string): Problem[] {
    const problems: Problem[] = []

    // Suggest functional components over class components
    if (line.includes('class ') && line.includes('extends React.Component')) {
      problems.push({
        id: createProblemId('react', lineNumber, line.indexOf('class '), line),
        type: 'suggestion',
        severity: 'info',
        message: 'Consider using functional components with hooks',
        educationalExplanation: 'Functional components with hooks are the modern way to write React components.',
        fixSuggestion: 'Convert to a functional component using useState and useEffect hooks',
        learnMore: 'https://reactjs.org/docs/hooks-intro.html',
        position: { line: lineNumber, column: line.indexOf('class ') + 1 },
        code: 'REACT_FUNCTIONAL',
        category: 'style',
        source: 'React',
        file: filePath
      })
    }

    return problems
  }
}

// Export all detectors
export const PROBLEM_DETECTORS = {
  python: new PythonDetector(),
  javascript: new JavaScriptDetector(),
  typescript: new JavaScriptDetector(), // Can use same detector with minor differences
  react: new ReactDetector(),
  jsx: new ReactDetector(),
  tsx: new ReactDetector()
} as const

export type SupportedLanguage = keyof typeof PROBLEM_DETECTORS

export function getDetectorForLanguage(language: string): ProblemDetector | null {
  const normalizedLang = language.toLowerCase() as SupportedLanguage
  return PROBLEM_DETECTORS[normalizedLang] || null
}