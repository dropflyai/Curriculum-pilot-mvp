// Comprehensive Multi-Language Monaco Editor Enhancement System
// For Agent Academy IDE - Professional Development Environment

import * as monaco from 'monaco-editor'

// ============================================================================
// CORE INTERFACES AND TYPES
// ============================================================================

export interface LanguageServiceConfig {
  id: string
  name: string
  extensions: string[]
  aliases: string[]
  mimetypes: string[]
  monaco: {
    languageId: string
    configuration: monaco.languages.LanguageConfiguration
    tokenizer?: monaco.languages.IMonarchLanguage
  }
  features: LanguageFeature[]
  educationalContent: LanguageEducation
  framework?: FrameworkConfig
}

export interface LanguageFeature {
  name: 'completion' | 'hover' | 'signature' | 'definition' | 'reference' | 'formatting' | 'diagnostics' | 'folding' | 'symbols'
  enabled: boolean
  provider: string
  config?: any
  priority?: number
}

export interface LanguageEducation {
  concepts: ConceptExplanation[]
  commonPatterns: CodePattern[]
  bestPractices: BestPractice[]
  troubleshooting: TroubleshootingGuide[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
}

export interface ConceptExplanation {
  name: string
  explanation: string
  examples: string[]
  whenToUse: string
  relatedConcepts?: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface CodePattern {
  name: string
  pattern: string
  explanation: string
  variations?: string[]
  context: string
  tags: string[]
}

export interface BestPractice {
  rule: string
  good: string
  bad: string
  reasoning: string
  severity: 'info' | 'warning' | 'error'
}

export interface TroubleshootingGuide {
  issue: string
  symptoms: string[]
  solutions: string[]
  prevention: string
}

export interface FrameworkConfig {
  name: string
  version?: string
  patterns: FrameworkPattern[]
  components: ComponentDefinition[]
  hooks?: HookDefinition[]
}

export interface FrameworkPattern {
  name: string
  pattern: string
  description: string
  example: string
}

export interface ComponentDefinition {
  name: string
  props?: PropDefinition[]
  description: string
  example: string
}

export interface PropDefinition {
  name: string
  type: string
  required: boolean
  description: string
}

export interface HookDefinition {
  name: string
  signature: string
  description: string
  example: string
  dependencies?: string[]
}

// ============================================================================
// LANGUAGE CONFIGURATIONS
// ============================================================================

export const SUPPORTED_LANGUAGES: LanguageServiceConfig[] = [
  // JavaScript Language Configuration
  {
    id: 'javascript',
    name: 'JavaScript',
    extensions: ['.js', '.mjs', '.jsx'],
    aliases: ['JavaScript', 'js', 'JS'],
    mimetypes: ['text/javascript', 'application/javascript'],
    monaco: {
      languageId: 'javascript',
      configuration: {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
          { open: '`', close: '`', notIn: ['string', 'comment'] }
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' }
        ],
        indentationRules: {
          increaseIndentPattern: /^((?!\/\/).)*((\{[^}"'`]*)|(\([^)"'`]*)|(\[[^\]"'`]*))$/,
          decreaseIndentPattern: /^((?!.*?\/\*).*)*(\s*)[\}\]\)].*$/
        }
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'typescript', priority: 1 },
      { name: 'hover', enabled: true, provider: 'typescript', priority: 1 },
      { name: 'diagnostics', enabled: true, provider: 'eslint', priority: 1 },
      { name: 'formatting', enabled: true, provider: 'prettier', priority: 1 },
      { name: 'definition', enabled: true, provider: 'typescript', priority: 1 },
      { name: 'reference', enabled: true, provider: 'typescript', priority: 1 },
      { name: 'folding', enabled: true, provider: 'monaco', priority: 1 }
    ],
    educationalContent: {
      skillLevel: 'beginner',
      concepts: [
        {
          name: 'Variables',
          explanation: 'JavaScript variables store data values. Use let for values that change, const for values that stay the same.',
          examples: [
            'let name = "Agent Smith"',
            'const age = 25',
            'var score = 100 // older syntax'
          ],
          whenToUse: 'Use const by default, let when you need to reassign, avoid var in modern code',
          relatedConcepts: ['scope', 'hoisting', 'data types'],
          difficulty: 'beginner'
        },
        {
          name: 'Functions',
          explanation: 'Functions are reusable blocks of code that perform specific tasks.',
          examples: [
            'function greet(name) { return `Hello, ${name}!` }',
            'const greet = (name) => `Hello, ${name}!`',
            'const greet = function(name) { return `Hello, ${name}!` }'
          ],
          whenToUse: 'Use functions to organize code and avoid repetition',
          relatedConcepts: ['parameters', 'return values', 'scope'],
          difficulty: 'beginner'
        }
      ],
      commonPatterns: [
        {
          name: 'Function Declaration',
          pattern: 'function functionName(parameters) { /* code */ return result }',
          explanation: 'Standard way to define reusable code blocks',
          variations: [
            'Arrow functions: const fn = (params) => result',
            'Function expressions: const fn = function(params) { return result }'
          ],
          context: 'Use for main program logic and reusable operations',
          tags: ['function', 'declaration', 'basic']
        },
        {
          name: 'Object Creation',
          pattern: 'const obj = { property: value, method() { /* code */ } }',
          explanation: 'Creates objects with properties and methods',
          variations: [
            'Constructor: function Person(name) { this.name = name }',
            'Class: class Person { constructor(name) { this.name = name } }'
          ],
          context: 'Use for organizing related data and functionality',
          tags: ['object', 'creation', 'structure']
        }
      ],
      bestPractices: [
        {
          rule: 'Use meaningful variable names',
          good: 'const userName = "agent007"',
          bad: 'const x = "agent007"',
          reasoning: 'Clear names make code self-documenting and easier to understand',
          severity: 'warning'
        },
        {
          rule: 'Prefer const over let when possible',
          good: 'const config = { theme: "dark" }',
          bad: 'let config = { theme: "dark" }',
          reasoning: 'const prevents accidental reassignment and shows intent',
          severity: 'info'
        }
      ],
      troubleshooting: [
        {
          issue: 'ReferenceError: variable is not defined',
          symptoms: ['Variable name appears red in editor', 'Code crashes when running'],
          solutions: ['Check variable spelling', 'Make sure variable is declared before use', 'Check if variable is in correct scope'],
          prevention: 'Always declare variables with let/const before using them'
        }
      ]
    }
  },

  // TypeScript Language Configuration
  {
    id: 'typescript',
    name: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'TS'],
    mimetypes: ['text/typescript', 'application/typescript'],
    monaco: {
      languageId: 'typescript',
      configuration: {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          ['<', '>']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '<', close: '>', notIn: ['string'] },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
          { open: '`', close: '`', notIn: ['string', 'comment'] }
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '<', close: '>' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' }
        ]
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'hover', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'diagnostics', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'definition', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'reference', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'signature', enabled: true, provider: 'typescript', priority: 2 },
      { name: 'formatting', enabled: true, provider: 'typescript', priority: 2 }
    ],
    educationalContent: {
      skillLevel: 'intermediate',
      concepts: [
        {
          name: 'Type Annotations',
          explanation: 'TypeScript adds static type checking to JavaScript, catching errors before runtime.',
          examples: [
            'let age: number = 25',
            'function greet(name: string): string { return `Hello, ${name}!` }',
            'interface User { name: string; age: number }'
          ],
          whenToUse: 'Use TypeScript for larger projects and better IDE support',
          relatedConcepts: ['interfaces', 'generics', 'type inference'],
          difficulty: 'intermediate'
        },
        {
          name: 'Interfaces',
          explanation: 'Interfaces define the shape of objects, ensuring consistency across your code.',
          examples: [
            'interface Agent { name: string; level: number }',
            'interface Mission { title: string; completed: boolean }'
          ],
          whenToUse: 'Use interfaces to define contracts for objects and classes',
          relatedConcepts: ['types', 'classes', 'inheritance'],
          difficulty: 'intermediate'
        }
      ],
      commonPatterns: [
        {
          name: 'Interface Definition',
          pattern: 'interface InterfaceName { property: type; method(): returnType }',
          explanation: 'Defines the structure that objects must follow',
          variations: [
            'Optional properties: property?: type',
            'Readonly properties: readonly property: type'
          ],
          context: 'Use for defining object shapes and API contracts',
          tags: ['interface', 'type', 'definition']
        }
      ],
      bestPractices: [
        {
          rule: 'Use interfaces for object types',
          good: 'interface User { name: string }',
          bad: 'type User = { name: string }',
          reasoning: 'Interfaces are more flexible and can be extended',
          severity: 'info'
        }
      ],
      troubleshooting: [
        {
          issue: 'Type errors in IDE',
          symptoms: ['Red squiggly lines under code', 'Type mismatch errors'],
          solutions: ['Check type annotations match actual values', 'Use type assertions when necessary', 'Define proper interfaces'],
          prevention: 'Write types first, then implementation'
        }
      ]
    }
  },

  // React JSX Language Configuration
  {
    id: 'javascriptreact',
    name: 'JavaScript React',
    extensions: ['.jsx'],
    aliases: ['JavaScript React', 'jsx', 'JSX'],
    mimetypes: ['text/jsx', 'application/jsx'],
    monaco: {
      languageId: 'javascriptreact',
      configuration: {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          ['<', '>']
        ],
        autoClosingPairs: [
          { open: '<', close: '>' },
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
          { open: '`', close: '`', notIn: ['string', 'comment'] }
        ],
        surroundingPairs: [
          { open: '<', close: '>' },
          { open: '{', close: '}' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' }
        ]
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'react', priority: 3 },
      { name: 'hover', enabled: true, provider: 'react', priority: 3 },
      { name: 'diagnostics', enabled: true, provider: 'eslint-react', priority: 3 },
      { name: 'formatting', enabled: true, provider: 'prettier', priority: 3 }
    ],
    framework: {
      name: 'React',
      version: '18+',
      patterns: [
        {
          name: 'Function Component',
          pattern: 'function ComponentName({ prop1, prop2 }) { return <div>{prop1}</div> }',
          description: 'Modern React component using function syntax',
          example: 'function Welcome({ name }) { return <h1>Hello, {name}!</h1> }'
        },
        {
          name: 'useState Hook',
          pattern: 'const [state, setState] = useState(initialValue)',
          description: 'Hook for managing component state',
          example: 'const [count, setCount] = useState(0)'
        }
      ],
      components: [
        {
          name: 'div',
          description: 'Generic container element',
          example: '<div className="container">Content</div>'
        }
      ],
      hooks: [
        {
          name: 'useState',
          signature: 'const [state, setState] = useState(initialState)',
          description: 'Hook for managing state in functional components',
          example: 'const [count, setCount] = useState(0)',
          dependencies: ['react']
        },
        {
          name: 'useEffect',
          signature: 'useEffect(() => { /* effect */ }, [dependencies])',
          description: 'Hook for side effects in functional components',
          example: 'useEffect(() => { document.title = `Count: ${count}` }, [count])',
          dependencies: ['react']
        }
      ]
    },
    educationalContent: {
      skillLevel: 'intermediate',
      concepts: [
        {
          name: 'JSX',
          explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
          examples: [
            'const element = <h1>Hello, Agent!</h1>',
            'const element = <div className="container">{user.name}</div>'
          ],
          whenToUse: 'Use JSX to describe what the UI should look like in React',
          relatedConcepts: ['components', 'props', 'state'],
          difficulty: 'intermediate'
        },
        {
          name: 'Components',
          explanation: 'React components are reusable pieces of UI that can accept props and manage state.',
          examples: [
            'function Welcome(props) { return <h1>Hello, {props.name}</h1> }',
            'const App = () => <Welcome name="Agent" />'
          ],
          whenToUse: 'Use components to break down UI into reusable pieces',
          relatedConcepts: ['props', 'state', 'hooks'],
          difficulty: 'intermediate'
        }
      ],
      commonPatterns: [
        {
          name: 'React Component',
          pattern: 'function ComponentName({ props }) { return <JSXElement /> }',
          explanation: 'Modern function component pattern',
          variations: [
            'With hooks: function Component() { const [state] = useState() }',
            'With props: function Component({ name, age }) { }'
          ],
          context: 'Use for all React components in modern applications',
          tags: ['react', 'component', 'function']
        }
      ],
      bestPractices: [
        {
          rule: 'Use PascalCase for component names',
          good: 'function WelcomeMessage() { }',
          bad: 'function welcomeMessage() { }',
          reasoning: 'React requires component names to start with capital letter',
          severity: 'error'
        }
      ],
      troubleshooting: [
        {
          issue: 'JSX not rendering',
          symptoms: ['Blank screen', 'Component not appearing'],
          solutions: ['Check component name capitalization', 'Ensure component is exported/imported', 'Check for JSX syntax errors'],
          prevention: 'Always use PascalCase for component names and proper JSX syntax'
        }
      ]
    }
  },

  // TypeScript React Configuration
  {
    id: 'typescriptreact',
    name: 'TypeScript React',
    extensions: ['.tsx'],
    aliases: ['TypeScript React', 'tsx', 'TSX'],
    mimetypes: ['text/tsx', 'application/tsx'],
    monaco: {
      languageId: 'typescriptreact',
      configuration: {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          ['<', '>']
        ],
        autoClosingPairs: [
          { open: '<', close: '>' },
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
          { open: '`', close: '`', notIn: ['string', 'comment'] }
        ]
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'typescript-react', priority: 4 },
      { name: 'hover', enabled: true, provider: 'typescript-react', priority: 4 },
      { name: 'diagnostics', enabled: true, provider: 'typescript', priority: 4 },
      { name: 'definition', enabled: true, provider: 'typescript', priority: 4 },
      { name: 'reference', enabled: true, provider: 'typescript', priority: 4 }
    ],
    framework: {
      name: 'React with TypeScript',
      patterns: [
        {
          name: 'Typed Component',
          pattern: 'function Component({ prop }: { prop: Type }) { return <div /> }',
          description: 'React component with TypeScript prop types',
          example: 'function Welcome({ name }: { name: string }) { return <h1>Hello, {name}!</h1> }'
        }
      ],
      components: [],
      hooks: []
    },
    educationalContent: {
      skillLevel: 'advanced',
      concepts: [
        {
          name: 'React with TypeScript',
          explanation: 'Combining React with TypeScript provides type safety for components and props.',
          examples: [
            'interface Props { name: string; age?: number }',
            'function Component({ name, age }: Props) { return <div>{name}</div> }'
          ],
          whenToUse: 'Use for large React applications requiring type safety',
          relatedConcepts: ['interfaces', 'generics', 'props'],
          difficulty: 'advanced'
        }
      ],
      commonPatterns: [],
      bestPractices: [],
      troubleshooting: []
    }
  },

  // HTML Language Configuration
  {
    id: 'html',
    name: 'HTML',
    extensions: ['.html', '.htm'],
    aliases: ['HTML', 'html'],
    mimetypes: ['text/html'],
    monaco: {
      languageId: 'html',
      configuration: {
        comments: {
          blockComment: ['<!--', '-->']
        },
        brackets: [
          ['<', '>']
        ],
        autoClosingPairs: [
          { open: '<', close: '>' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ],
        surroundingPairs: [
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '<', close: '>' }
        ]
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'html', priority: 1 },
      { name: 'hover', enabled: true, provider: 'html', priority: 1 },
      { name: 'formatting', enabled: true, provider: 'prettier', priority: 1 }
    ],
    educationalContent: {
      skillLevel: 'beginner',
      concepts: [
        {
          name: 'HTML Elements',
          explanation: 'HTML elements are the building blocks of web pages, defined by tags.',
          examples: [
            '<h1>This is a heading</h1>',
            '<p>This is a paragraph</p>',
            '<div>This is a container</div>'
          ],
          whenToUse: 'Use HTML elements to structure content on web pages',
          relatedConcepts: ['attributes', 'nesting', 'semantics'],
          difficulty: 'beginner'
        }
      ],
      commonPatterns: [],
      bestPractices: [],
      troubleshooting: []
    }
  },

  // CSS Language Configuration
  {
    id: 'css',
    name: 'CSS',
    extensions: ['.css'],
    aliases: ['CSS', 'css'],
    mimetypes: ['text/css'],
    monaco: {
      languageId: 'css',
      configuration: {
        comments: {
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '{', close: '}', notIn: ['string', 'comment'] },
          { open: '[', close: ']', notIn: ['string', 'comment'] },
          { open: '(', close: ')', notIn: ['string', 'comment'] },
          { open: '"', close: '"', notIn: ['string', 'comment'] },
          { open: "'", close: "'", notIn: ['string', 'comment'] }
        ]
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'css', priority: 1 },
      { name: 'hover', enabled: true, provider: 'css', priority: 1 },
      { name: 'formatting', enabled: true, provider: 'prettier', priority: 1 }
    ],
    educationalContent: {
      skillLevel: 'beginner',
      concepts: [
        {
          name: 'CSS Selectors',
          explanation: 'CSS selectors target HTML elements to apply styles.',
          examples: [
            'h1 { color: blue; }',
            '.class-name { font-size: 16px; }',
            '#id-name { background: red; }'
          ],
          whenToUse: 'Use selectors to target specific elements for styling',
          relatedConcepts: ['specificity', 'cascade', 'inheritance'],
          difficulty: 'beginner'
        }
      ],
      commonPatterns: [],
      bestPractices: [],
      troubleshooting: []
    }
  },

  // Python Language Configuration (Enhanced)
  {
    id: 'python',
    name: 'Python',
    extensions: ['.py', '.pyw', '.pyi'],
    aliases: ['Python', 'py'],
    mimetypes: ['text/x-python'],
    monaco: {
      languageId: 'python',
      configuration: {
        comments: {
          lineComment: '#'
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
          { open: '"""', close: '"""' },
          { open: "'''", close: "'''" }
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ],
        indentationRules: {
          increaseIndentPattern: /^\s*(class|def|if|elif|else|for|while|with|try|except|finally)\b.*:\s*$/,
          decreaseIndentPattern: /^\s*(pass|break|continue|return|raise)\b.*$/
        }
      }
    },
    features: [
      { name: 'completion', enabled: true, provider: 'pylsp', priority: 1 },
      { name: 'hover', enabled: true, provider: 'pylsp', priority: 1 },
      { name: 'diagnostics', enabled: true, provider: 'pylsp', priority: 1 },
      { name: 'formatting', enabled: true, provider: 'black', priority: 1 },
      { name: 'definition', enabled: true, provider: 'pylsp', priority: 1 }
    ],
    educationalContent: {
      skillLevel: 'beginner',
      concepts: [
        {
          name: 'Variables and Data Types',
          explanation: 'Python variables store different types of data without explicit type declaration.',
          examples: [
            'name = "Agent Smith"',
            'age = 25',
            'is_active = True',
            'scores = [95, 87, 92]'
          ],
          whenToUse: 'Use variables to store and manipulate data in your programs',
          relatedConcepts: ['data types', 'type hints', 'dynamic typing'],
          difficulty: 'beginner'
        },
        {
          name: 'Functions',
          explanation: 'Python functions are defined with the def keyword and can accept parameters.',
          examples: [
            'def greet(name): return f"Hello, {name}!"',
            'def calculate(x, y): return x + y',
            'def process_data(data, transform=None): # with default parameter'
          ],
          whenToUse: 'Use functions to organize code and create reusable logic',
          relatedConcepts: ['parameters', 'return values', 'docstrings'],
          difficulty: 'beginner'
        }
      ],
      commonPatterns: [
        {
          name: 'Function with Docstring',
          pattern: 'def function_name(parameters):\n    """Description of function."""\n    # code here\n    return result',
          explanation: 'Well-documented function following Python conventions',
          variations: [
            'With type hints: def func(param: int) -> str:',
            'With default args: def func(param="default"):'
          ],
          context: 'Use for all functions in professional Python code',
          tags: ['function', 'docstring', 'documentation']
        }
      ],
      bestPractices: [
        {
          rule: 'Use snake_case for variable and function names',
          good: 'user_name = "agent"',
          bad: 'userName = "agent"',
          reasoning: 'Python PEP 8 style guide recommends snake_case',
          severity: 'warning'
        }
      ],
      troubleshooting: [
        {
          issue: 'IndentationError',
          symptoms: ['Code shows indentation error', 'Unexpected indent message'],
          solutions: ['Use consistent indentation (4 spaces recommended)', 'Check for mixed tabs and spaces', 'Align code blocks properly'],
          prevention: 'Configure editor to show whitespace and use 4 spaces for indentation'
        }
      ]
    }
  }
]

// ============================================================================
// LANGUAGE SERVICE MANAGER
// ============================================================================

export class MonacoLanguageServiceManager {
  private static instance: MonacoLanguageServiceManager
  private languageConfigs: Map<string, LanguageServiceConfig> = new Map()
  private completionProviders: Map<string, monaco.languages.CompletionItemProvider> = new Map()
  private hoverProviders: Map<string, monaco.languages.HoverProvider> = new Map()
  private diagnosticsProviders: Map<string, any> = new Map()
  private initialized = false

  private constructor() {}

  public static getInstance(): MonacoLanguageServiceManager {
    if (!MonacoLanguageServiceManager.instance) {
      MonacoLanguageServiceManager.instance = new MonacoLanguageServiceManager()
    }
    return MonacoLanguageServiceManager.instance
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return

    console.log('🚀 Initializing Monaco Multi-Language Service System...')
    
    // Register all supported languages
    for (const config of SUPPORTED_LANGUAGES) {
      await this.registerLanguage(config)
    }

    // Configure TypeScript defaults for better JavaScript/TypeScript support
    this.configureTypeScriptDefaults()
    
    this.initialized = true
    console.log('✅ Monaco Multi-Language Service System initialized')
  }

  private async registerLanguage(config: LanguageServiceConfig): Promise<void> {
    try {
      // Store configuration
      this.languageConfigs.set(config.id, config)

      // Register language with Monaco
      if (!monaco.languages.getLanguages().find(lang => lang.id === config.id)) {
        monaco.languages.register({
          id: config.id,
          extensions: config.extensions,
          aliases: config.aliases,
          mimetypes: config.mimetypes
        })
      }

      // Set language configuration
      monaco.languages.setLanguageConfiguration(config.id, config.monaco.configuration)

      // Register tokenizer if provided
      if (config.monaco.tokenizer) {
        monaco.languages.setMonarchTokensProvider(config.id, config.monaco.tokenizer)
      }

      // Register feature providers
      await this.registerLanguageProviders(config)

      console.log(`📝 Registered language: ${config.name} (${config.id})`)
    } catch (error) {
      console.error(`❌ Failed to register language ${config.id}:`, error)
    }
  }

  private async registerLanguageProviders(config: LanguageServiceConfig): Promise<void> {
    const { id } = config

    // Register completion provider
    if (config.features.some(f => f.name === 'completion' && f.enabled)) {
      const provider = this.createCompletionProvider(config)
      this.completionProviders.set(id, provider)
      monaco.languages.registerCompletionItemProvider(id, provider)
    }

    // Register hover provider
    if (config.features.some(f => f.name === 'hover' && f.enabled)) {
      const provider = this.createHoverProvider(config)
      this.hoverProviders.set(id, provider)
      monaco.languages.registerHoverProvider(id, provider)
    }

    // Register signature help provider
    if (config.features.some(f => f.name === 'signature' && f.enabled)) {
      const provider = this.createSignatureHelpProvider(config)
      monaco.languages.registerSignatureHelpProvider(id, provider)
    }

    // Register document formatting provider
    if (config.features.some(f => f.name === 'formatting' && f.enabled)) {
      const provider = this.createFormattingProvider(config)
      monaco.languages.registerDocumentFormattingEditProvider(id, provider)
    }

    // Register folding range provider
    if (config.features.some(f => f.name === 'folding' && f.enabled)) {
      const provider = this.createFoldingRangeProvider(config)
      monaco.languages.registerFoldingRangeProvider(id, provider)
    }
  }

  private configureTypeScriptDefaults(): void {
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })

    // Configure JavaScript defaults
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      allowJs: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React'
    })

    // Add React types
    const reactTypes = `
      declare namespace React {
        interface Component<P = {}, S = {}> {}
        interface FunctionComponent<P = {}> {
          (props: P): JSX.Element | null;
        }
        interface ReactElement<P = any> {}
        interface ReactNode {}
        function useState<T>(initialState: T): [T, (value: T) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useContext<T>(context: React.Context<T>): T;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
      }
      declare namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
        interface IntrinsicElements {
          div: any;
          span: any;
          p: any;
          h1: any;
          h2: any;
          h3: any;
          h4: any;
          h5: any;
          h6: any;
          button: any;
          input: any;
          form: any;
          img: any;
          a: any;
          ul: any;
          ol: any;
          li: any;
          [elemName: string]: any;
        }
      }
    `

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    )

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    )
  }

  // Helper to create range for completion items
  private createCompletionRange(position: monaco.Position): monaco.IRange {
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: position.column,
      endColumn: position.column
    }
  }

  // Provider factory methods
  private createCompletionProvider(config: LanguageServiceConfig): monaco.languages.CompletionItemProvider {
    return {
      provideCompletionItems: async (model, position, context, token) => {
        const suggestions: monaco.languages.CompletionItem[] = []
        
        // Add basic language completions
        suggestions.push(...this.getBasicCompletions(config, model, position))
        
        // Add educational completions
        suggestions.push(...this.getEducationalCompletions(config, model, position))
        
        // Add framework-specific completions
        if (config.framework) {
          suggestions.push(...this.getFrameworkCompletions(config, model, position))
        }
        
        return { suggestions }
      }
    }
  }

  private createHoverProvider(config: LanguageServiceConfig): monaco.languages.HoverProvider {
    return {
      provideHover: async (model, position) => {
        const word = model.getWordAtPosition(position)
        if (!word) return null

        const hoverContent = this.generateHoverContent(config, word.word, model, position)
        if (!hoverContent) return null

        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: hoverContent
        }
      }
    }
  }

  private createSignatureHelpProvider(config: LanguageServiceConfig): monaco.languages.SignatureHelpProvider {
    return {
      signatureHelpTriggerCharacters: ['(', ','],
      provideSignatureHelp: async (model, position) => {
        // Implementation would provide function signature help
        return {
          value: {
            signatures: [],
            activeSignature: 0,
            activeParameter: 0
          },
          dispose: () => {}
        }
      }
    }
  }

  private createFormattingProvider(config: LanguageServiceConfig): monaco.languages.DocumentFormattingEditProvider {
    return {
      provideDocumentFormattingEdits: async (model, options) => {
        // Implementation would format the document
        // For now, return empty array
        return []
      }
    }
  }

  private createFoldingRangeProvider(config: LanguageServiceConfig): monaco.languages.FoldingRangeProvider {
    return {
      provideFoldingRanges: async (model) => {
        const ranges: monaco.languages.FoldingRange[] = []
        
        // Basic folding for bracket-based languages
        const text = model.getValue()
        const lines = text.split('\n')
        
        const stack: { line: number; kind?: monaco.languages.FoldingRangeKind }[] = []
        
        lines.forEach((line, index) => {
          if (line.includes('{')) {
            stack.push({ line: index })
          } else if (line.includes('}') && stack.length > 0) {
            const start = stack.pop()
            if (start && index > start.line) {
              ranges.push({
                start: start.line + 1,
                end: index + 1,
                kind: start.kind
              })
            }
          }
        })
        
        return ranges
      }
    }
  }

  // Helper methods for generating completions and content
  private getBasicCompletions(
    config: LanguageServiceConfig,
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []
    
    // Add language keywords based on language type
    if (config.id === 'javascript' || config.id === 'typescript') {
      const jsKeywords = ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return']
      jsKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: `${config.name} keyword`,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        })
      })
    }
    
    return suggestions
  }

  private getEducationalCompletions(
    config: LanguageServiceConfig,
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []
    
    // Add educational snippets based on patterns
    config.educationalContent.commonPatterns.forEach(pattern => {
      suggestions.push({
        label: `📚 ${pattern.name}`,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: pattern.pattern,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: '🎓 Educational Pattern',
        documentation: {
          value: `**${pattern.name}**\n\n${pattern.explanation}\n\n**Context:** ${pattern.context}`
        },
        sortText: '0000', // High priority
        range: this.createCompletionRange(position)
      })
    })
    
    return suggestions
  }

  private getFrameworkCompletions(
    config: LanguageServiceConfig,
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []
    
    if (!config.framework) return suggestions
    
    // Add framework patterns
    config.framework.patterns.forEach(pattern => {
      suggestions.push({
        label: `⚛️ ${pattern.name}`,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: pattern.pattern,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: `${config.framework?.name} Pattern`,
        documentation: {
          value: `**${pattern.name}**\n\n${pattern.description}\n\n\`\`\`${config.id}\n${pattern.example}\n\`\`\``
        },
        range: this.createCompletionRange(position)
      })
    })
    
    // Add hooks if available
    if (config.framework.hooks) {
      config.framework.hooks.forEach(hook => {
        suggestions.push({
          label: hook.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: hook.signature,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: `${config.framework?.name} Hook`,
          documentation: {
            value: `**${hook.name}**\n\n${hook.description}\n\n\`\`\`${config.id}\n${hook.example}\n\`\`\``
          },
          range: this.createCompletionRange(position)
        })
      })
    }
    
    return suggestions
  }

  private generateHoverContent(
    config: LanguageServiceConfig,
    word: string,
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.IMarkdownString[] | null {
    const contents: monaco.IMarkdownString[] = []
    
    // Check if word matches any educational concepts
    const concept = config.educationalContent.concepts.find(c => 
      c.name.toLowerCase().includes(word.toLowerCase()) || 
      c.examples.some(ex => ex.includes(word))
    )
    
    if (concept) {
      contents.push({
        value: `## 🎓 ${concept.name}\n\n${concept.explanation}\n\n**When to use:** ${concept.whenToUse}\n\n**Examples:**\n\n${concept.examples.map(ex => `\`${ex}\``).join('\n\n')}`
      })
    }
    
    // Check best practices
    const bestPractice = config.educationalContent.bestPractices.find(bp => 
      bp.good.includes(word) || bp.bad.includes(word)
    )
    
    if (bestPractice) {
      contents.push({
        value: `### 💡 Best Practice\n\n**Rule:** ${bestPractice.rule}\n\n✅ Good: \`${bestPractice.good}\`\n\n❌ Bad: \`${bestPractice.bad}\`\n\n**Why:** ${bestPractice.reasoning}`
      })
    }
    
    return contents.length > 0 ? contents : null
  }

  // Public API
  public getLanguageConfig(languageId: string): LanguageServiceConfig | undefined {
    return this.languageConfigs.get(languageId)
  }

  public getSupportedLanguages(): LanguageServiceConfig[] {
    return Array.from(this.languageConfigs.values())
  }

  public detectLanguageFromContent(content: string, filename?: string): string {
    // Simple language detection based on content and filename
    if (filename) {
      const ext = filename.toLowerCase().split('.').pop()
      const config = SUPPORTED_LANGUAGES.find(lang => 
        lang.extensions.some(e => e.substring(1) === ext)
      )
      if (config) return config.id
    }
    
    // Content-based detection (simplified)
    if (content.includes('import React') || content.includes('export default')) {
      return content.includes('.tsx') || filename?.endsWith('.tsx') ? 'typescriptreact' : 'javascriptreact'
    }
    
    if (content.includes('def ') || content.includes('import ')) {
      return 'python'
    }
    
    if (content.includes('<!DOCTYPE html') || content.includes('<html')) {
      return 'html'
    }
    
    return 'javascript' // Default fallback
  }
}

// Global instance
export const monacoLanguageService = MonacoLanguageServiceManager.getInstance()

// Initialize function to be called from the IDE
export async function initializeMonacoLanguageSystem(): Promise<void> {
  await monacoLanguageService.initialize()
}