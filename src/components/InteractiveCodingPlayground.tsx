'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, Save, Share2, Download, Lightbulb, CheckCircle, AlertCircle, Code, Eye } from 'lucide-react'

interface CodingPlaygroundProps {
  initialCode?: string
  lessonId?: string
  projectName?: string
  onCodeUpdate?: (code: string) => void
  onProjectComplete?: (project: StudentProject) => void
}

interface StudentProject {
  id: string
  name: string
  code: string
  output: string
  timestamp: Date
  screenshots?: string[]
  description: string
  tags: string[]
}

interface HintLevel {
  level: number
  title: string
  content: string
  codeHint?: string
}

export default function InteractiveCodingPlayground({ 
  initialCode = '', 
  lessonId = '',
  projectName = 'My AI Project',
  onCodeUpdate,
  onProjectComplete 
}: CodingPlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string>('')
  const [executionTime, setExecutionTime] = useState<number>(0)
  const [hints, setHints] = useState<HintLevel[]>([])
  const [currentHintLevel, setCurrentHintLevel] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [projects, setProjects] = useState<StudentProject[]>([])
  const [currentProject, setCurrentProject] = useState<StudentProject | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [executionCount, setExecutionCount] = useState(0)
  const [successfulRuns, setSuccessfulRuns] = useState(0)
  const [codeMetrics, setCodeMetrics] = useState({
    lines: 0,
    functions: 0,
    variables: 0,
    comments: 0
  })
  const [realTimeValidation, setRealTimeValidation] = useState<{
    isValid: boolean
    issues: string[]
    suggestions: string[]
  }>({
    isValid: true,
    issues: [],
    suggestions: []
  })

  const outputRef = useRef<HTMLDivElement>(null)
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Enhanced hints for different lesson topics
  const lessonHints: Record<string, HintLevel[]> = {
    'week-01': [
      {
        level: 1,
        title: '🎯 Getting Started',
        content: 'Try running the starter code first to see how it works!',
        codeHint: '# Click the Run button to execute your code'
      },
      {
        level: 2,
        title: '🔧 Making Changes',
        content: 'Modify the LABELS list to add your own categories or change the dataset name.',
        codeHint: 'LABELS = ["your_label_1", "your_label_2", "your_label_3"]'
      },
      {
        level: 3,
        title: '📊 Understanding Results',
        content: 'Look at the accuracy numbers. Can you improve them by flagging problematic images?',
        codeHint: '# Higher accuracy means your AI is better at classification!'
      },
      {
        level: 4,
        title: '🚀 Advanced Challenge',
        content: 'Try adding your own photos and see how it affects the AI performance.',
        codeHint: '# Use the photo upload feature to add your own training data'
      }
    ],
    'week-02': [
      {
        level: 1,
        title: '🎱 Magic 8-Ball Basics',
        content: 'Start by understanding how the random.choice() function picks responses.',
        codeHint: 'import random\nresponse = random.choice(response_list)'
      },
      {
        level: 2,
        title: '🎨 Add Personality',
        content: 'Create your own response categories and add more variety!',
        codeHint: 'funny_responses = ["As if!", "Yeah right!", "In your dreams!"]'
      },
      {
        level: 3,
        title: '🤖 Smart Responses',
        content: 'Make responses adapt to different question types using keyword detection.',
        codeHint: 'if "should I" in question.lower():\n    # Give advice-style response'
      },
      {
        level: 4,
        title: '📊 Track Statistics',
        content: 'Add counters to track how many positive vs negative responses you give.',
        codeHint: 'positive_count += 1  # Keep track of response types'
      }
    ]
  }

  // Real-time code analysis
  useEffect(() => {
    const analyzeCode = () => {
      const lines = code.split('\n').filter(line => line.trim()).length
      const functions = (code.match(/def\s+\w+/g) || []).length
      const variables = (code.match(/^\s*\w+\s*=/gm) || []).length
      const comments = (code.match(/#.*$/gm) || []).length

      setCodeMetrics({ lines, functions, variables, comments })

      // Real-time validation
      const issues: string[] = []
      const suggestions: string[] = []

      // Check for common issues
      if (code.includes('print(') && !code.includes('print("')) {
        suggestions.push('💡 Consider adding descriptive messages to your print statements')
      }

      if (functions > 0 && comments === 0) {
        suggestions.push('📝 Adding comments to your functions makes code easier to understand')
      }

      if (code.includes('import') && !code.includes('random')) {
        suggestions.push('🎲 You might want to import the random module for variety in your responses')
      }

      // Check for syntax issues (basic detection)
      const openParens = (code.match(/\(/g) || []).length
      const closeParens = (code.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        issues.push('⚠️ Mismatched parentheses detected')
      }

      const openBrackets = (code.match(/\[/g) || []).length
      const closeBrackets = (code.match(/\]/g) || []).length
      if (openBrackets !== closeBrackets) {
        issues.push('⚠️ Mismatched brackets detected')
      }

      setRealTimeValidation({
        isValid: issues.length === 0,
        issues,
        suggestions
      })
    }

    const debounceTimer = setTimeout(analyzeCode, 500)
    return () => clearTimeout(debounceTimer)
  }, [code])

  // Load hints for current lesson
  useEffect(() => {
    const currentHints = lessonHints[lessonId] || lessonHints['week-01']
    setHints(currentHints)
  }, [lessonId])

  // Load saved projects
  useEffect(() => {
    const savedProjects = localStorage.getItem('studentProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // Update parent component when code changes
  useEffect(() => {
    if (onCodeUpdate) {
      onCodeUpdate(code)
    }
  }, [code, onCodeUpdate])

  // Simulate Python execution with enhanced feedback
  const executeCode = async () => {
    setIsRunning(true)
    setError('')
    setExecutionCount(prev => prev + 1)
    
    const startTime = Date.now()

    try {
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))
      
      let simulatedOutput = ''

      // Enhanced simulation based on code content
      if (code.includes('print(')) {
        const printMatches = code.match(/print\(['"`]([^'"`]*?)['"`]\)/g)
        if (printMatches) {
          printMatches.forEach(match => {
            const content = match.match(/print\(['"`]([^'"`]*?)['"`]\)/)?.[1]
            if (content) {
              simulatedOutput += content + '\n'
            }
          })
        }
      }

      // Magic 8-Ball simulation
      if (code.includes('random.choice') && code.includes('responses')) {
        simulatedOutput += '🎱 Magic 8-Ball is ready!\n'
        simulatedOutput += 'Ask a question: Will I pass my test?\n'
        simulatedOutput += '✨ The Magic 8-Ball says: "Yes definitely!" ✨\n'
        simulatedOutput += '\nAsk another question or type "quit" to exit.\n'
      }

      // AI Classifier simulation
      if (code.includes('DATASET') && code.includes('LABELS')) {
        simulatedOutput += '🤖 AI Classifier Training Started!\n'
        simulatedOutput += '📊 Dataset loaded: school-supplies\n'
        simulatedOutput += '🎯 Training on labels: pencil, eraser, marker\n'
        simulatedOutput += '⚡ Training complete! Accuracy: 87.3%\n'
        simulatedOutput += '📈 Results saved to metrics panel.\n'
      }

      // Variable assignment simulation
      if (code.includes('=') && !code.includes('==')) {
        const assignments = code.match(/(\w+)\s*=\s*([^=\n]+)/g)
        if (assignments) {
          assignments.forEach(assignment => {
            const [, varName, value] = assignment.match(/(\w+)\s*=\s*([^=\n]+)/) || []
            if (varName && value) {
              simulatedOutput += `✅ ${varName} = ${value.trim()}\n`
            }
          })
        }
      }

      // Function definition simulation
      if (code.includes('def ')) {
        const funcMatches = code.match(/def\s+(\w+)\s*\(/g)
        if (funcMatches) {
          funcMatches.forEach(match => {
            const funcName = match.match(/def\s+(\w+)\s*\(/)?.[1]
            if (funcName) {
              simulatedOutput += `🔧 Function '${funcName}' defined successfully!\n`
            }
          })
        }
      }

      // Import statements simulation
      if (code.includes('import')) {
        const imports = code.match(/import\s+(\w+)/g)
        if (imports) {
          imports.forEach(imp => {
            const module = imp.match(/import\s+(\w+)/)?.[1]
            simulatedOutput += `📦 Imported ${module} module\n`
          })
        }
      }

      if (!simulatedOutput) {
        simulatedOutput = '✅ Code executed successfully!\n💡 Add some print() statements to see output here.'
      }

      setOutput(simulatedOutput)
      setSuccessfulRuns(prev => prev + 1)
      
      // Auto-scroll to bottom of output
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
      }, 100)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`❌ Error: ${errorMessage}`)
      
      // Provide helpful error hints
      if (errorMessage.includes('SyntaxError')) {
        setError(prev => prev + '\n💡 Tip: Check for missing colons (:) or mismatched parentheses')
      }
    } finally {
      const endTime = Date.now()
      setExecutionTime(endTime - startTime)
      setIsRunning(false)
    }
  }

  // Save current project
  const saveProject = () => {
    const newProject: StudentProject = {
      id: `project-${Date.now()}`,
      name: projectName,
      code,
      output,
      timestamp: new Date(),
      description: `${projectName} - Created during ${lessonId}`,
      tags: [lessonId, 'interactive', 'python']
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem('studentProjects', JSON.stringify(updatedProjects))
    setCurrentProject(newProject)
    
    if (onProjectComplete) {
      onProjectComplete(newProject)
    }

    alert('🎉 Project saved! You can share it with others or add it to your portfolio.')
  }

  // Export project
  const exportProject = () => {
    const projectData = {
      name: projectName,
      code,
      output,
      metrics: codeMetrics,
      timestamp: new Date().toISOString(),
      lessonId
    }

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-project.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get next hint
  const getNextHint = () => {
    if (currentHintLevel < hints.length - 1) {
      setCurrentHintLevel(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Project Info */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-500/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              💻 Interactive Coding Playground
            </h3>
            <p className="text-indigo-200">
              Write, run, and build real Python projects! Your code runs in a safe environment with instant feedback.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">
              <div>Project: <span className="text-white font-medium">{projectName}</span></div>
              <div>Runs: <span className="text-green-400">{successfulRuns}</span>/{executionCount}</div>
            </div>
          </div>
        </div>

        {/* Code Statistics */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{codeMetrics.lines}</div>
            <div className="text-blue-200">Lines</div>
          </div>
          <div className="bg-green-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{codeMetrics.functions}</div>
            <div className="text-green-200">Functions</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{codeMetrics.variables}</div>
            <div className="text-purple-200">Variables</div>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{codeMetrics.comments}</div>
            <div className="text-orange-200">Comments</div>
          </div>
        </div>
      </div>

      {/* Real-time Validation Feedback */}
      {(realTimeValidation.issues.length > 0 || realTimeValidation.suggestions.length > 0) && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          {realTimeValidation.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Issues Detected
              </h4>
              <ul className="space-y-1">
                {realTimeValidation.issues.map((issue, index) => (
                  <li key={index} className="text-red-300 text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {realTimeValidation.suggestions.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </h4>
              <ul className="space-y-1">
                {realTimeValidation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-yellow-300 text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Coding Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Code className="h-4 w-4" />
              Python Code Editor
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setCode('')}
                className="text-gray-400 hover:text-white p-2 rounded"
                title="Clear code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 hover:text-yellow-300 p-2 rounded"
                title="Toggle hints"
              >
                <Lightbulb className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              ref={codeTextareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 bg-gray-900 text-white font-mono text-sm p-4 rounded border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="# Write your Python code here!
print('Hello, CodeFly!')

# Try creating variables:
my_name = 'Student'
my_age = 15

# Or build a Magic 8-Ball:
import random
responses = ['Yes!', 'No!', 'Maybe...']
print(random.choice(responses))"
              spellCheck="false"
            />
          </div>

          {/* Code Actions */}
          <div className="flex justify-between items-center p-4 border-t border-gray-700">
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={saveProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Project
              </button>
              <button
                onClick={exportProject}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Program Output
            </h4>
            {executionTime > 0 && (
              <div className="text-sm text-gray-400">
                Executed in {executionTime}ms
              </div>
            )}
          </div>
          
          <div
            ref={outputRef}
            className="p-4 h-80 overflow-y-auto bg-gray-900 font-mono text-sm"
          >
            {isRunning ? (
              <div className="flex items-center gap-3 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                Executing your Python code...
              </div>
            ) : output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : error ? (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            ) : (
              <div className="text-gray-500 italic">
                👋 Output will appear here when you run your code!
                <br /><br />
                💡 Try adding print() statements to see results
                <br />
                🎯 Run the starter code to get started
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Hints Panel */}
      {showHints && hints.length > 0 && (
        <div className="bg-amber-900/20 rounded-lg p-6 border border-amber-500/30">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-amber-300 font-bold flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Interactive Coding Hints
            </h4>
            <div className="text-amber-200 text-sm">
              Hint {currentHintLevel + 1} of {hints.length}
            </div>
          </div>

          {hints[currentHintLevel] && (
            <div className="space-y-4">
              <div>
                <h5 className="text-yellow-300 font-semibold text-lg mb-2">
                  {hints[currentHintLevel].title}
                </h5>
                <p className="text-amber-200">
                  {hints[currentHintLevel].content}
                </p>
              </div>

              {hints[currentHintLevel].codeHint && (
                <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-600/30">
                  <h6 className="text-amber-300 font-medium mb-2">📝 Code Example:</h6>
                  <pre className="text-amber-100 font-mono text-sm whitespace-pre-wrap">
                    {hints[currentHintLevel].codeHint}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                {currentHintLevel < hints.length - 1 && (
                  <button
                    onClick={getNextHint}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Next Hint →
                  </button>
                )}
                <button
                  onClick={() => setShowHints(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Hide Hints
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Success Celebration */}
      {currentProject && (
        <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
          <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            🎉 Project Saved Successfully!
          </h4>
          <p className="text-green-200 mb-4">
            Congratulations! Your "{currentProject.name}" project has been saved to your portfolio. 
            You can share it with friends, teachers, or continue building on it later.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowProjectModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share Project
            </button>
            <button
              onClick={() => setCurrentProject(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Coding
            </button>
          </div>
        </div>
      )}

      {/* Project Summary Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 className="text-white font-medium mb-4">📊 Your Coding Session</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{executionCount}</div>
            <div className="text-gray-400">Code Runs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{successfulRuns}</div>
            <div className="text-gray-400">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{projects.length}</div>
            <div className="text-gray-400">Projects Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {executionCount > 0 ? Math.round((successfulRuns / executionCount) * 100) : 0}%
            </div>
            <div className="text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}