'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Terminal, 
  AlertTriangle, 
  FileOutput, 
  Bug, 
  Network,
  Plus,
  X,
  Minimize2,
  Maximize2,
  Settings,
  Play,
  Square,
  Trash2,
  ExternalLink,
  Copy,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Bot,
  Zap
} from 'lucide-react'
import { AITerminalClient } from '@/lib/ai-terminal-client'

interface TerminalSession {
  id: string
  name: string
  cwd: string
  isActive: boolean
  isRunning: boolean
  history: TerminalMessage[]
}

interface TerminalMessage {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  content: string
  timestamp: Date
}

interface Problem {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  file: string
  line: number
  column: number
  source: string
}

interface Port {
  id: string
  port: number
  protocol: 'http' | 'https'
  status: 'running' | 'stopped' | 'error'
  name: string
  description: string
}

interface BottomPanelProps {
  isVisible: boolean
  onToggle: () => void
  height: number
  onHeightChange: (height: number) => void
  pyodide?: any
  codeContent?: string
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  isVisible,
  onToggle,
  height,
  onHeightChange,
  pyodide,
  codeContent
}) => {
  // Debug prop values on component render
  console.log('🔧 BOTTOMPANEL DEBUG: Component rendered with props:', {
    isVisible,
    height,
    onHeightChangeType: typeof onHeightChange,
    hasOnHeightChange: !!onHeightChange
  })
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output' | 'debug' | 'ports'>('terminal')
  const [isResizing, setIsResizing] = useState(false)
  const [internalHeight, setInternalHeight] = useState(height)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Terminal state
  const [terminalSessions, setTerminalSessions] = useState<TerminalSession[]>([
    {
      id: 'main',
      name: 'Python',
      cwd: '/workspace',
      isActive: true,
      isRunning: false,
      history: [{
        id: '1',
        type: 'system',
        content: 'Python terminal ready - Agent Academy IDE',
        timestamp: new Date()
      }]
    }
  ])
  const [activeTerminalId, setActiveTerminalId] = useState('main')
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Problems state
  const [problems, setProblems] = useState<Problem[]>([])

  // Output state
  const [outputMessages, setOutputMessages] = useState<Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: Date
    source: string
  }>>([
    {
      id: '1',
      type: 'info',
      message: 'Agent Academy IDE initialized successfully',
      timestamp: new Date(),
      source: 'System'
    }
  ])

  // Debug Console state
  const [debugMessages, setDebugMessages] = useState<Array<{
    id: string
    level: 'log' | 'warn' | 'error' | 'debug'
    message: string
    timestamp: Date
  }>>([])

  // Ports state
  const [ports, setPorts] = useState<Port[]>([
    {
      id: '1',
      port: 3030,
      protocol: 'http',
      status: 'running',
      name: 'Development Server',
      description: 'Next.js development server'
    }
  ])

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  // AI Terminal integration
  const [aiClient] = useState(() => {
    // Try to determine which AI provider to use
    const hasAnthropic = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || typeof window !== 'undefined' && localStorage.getItem('anthropic_api_key')
    const hasOpenAI = process.env.NEXT_PUBLIC_OPENAI_API_KEY || typeof window !== 'undefined' && localStorage.getItem('openai_api_key')
    
    if (hasAnthropic) {
      return new AITerminalClient('claude')
    } else if (hasOpenAI) {
      return new AITerminalClient('openai')
    } else {
      return new AITerminalClient('local') // Mock mode for development
    }
  })
  const panelRef = useRef<HTMLDivElement>(null)
  
  // Sync internal height with prop changes
  useEffect(() => {
    console.log('🔄 HEIGHT DEBUG: Height prop changed', {
      oldInternalHeight: internalHeight,
      newHeight: height,
      panelElement: panelRef.current,
      computedHeight: panelRef.current?.style.height
    })
    
    setInternalHeight(height)
    
    // Force style update on the DOM element
    if (panelRef.current) {
      panelRef.current.style.height = `${height}px`
      console.log('🔄 HEIGHT DEBUG: Manually set height on DOM element', height)
    }
  }, [height, internalHeight])

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🔽 RESIZE DEBUG: handleMouseDown triggered', {
      clientY: e.clientY,
      currentHeight: height,
      onHeightChange: typeof onHeightChange,
      onHeightChangeFunction: onHeightChange
    })
    
    setIsResizing(true)
    const startY = e.clientY
    const startHeight = height
    
    // Set cursor for better UX
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      // For bottom panel: dragging up (negative delta) should increase height
      // dragging down (positive delta) should decrease height
      const deltaY = e.clientY - startY
      const newHeight = startHeight - deltaY
      const clampedHeight = Math.max(100, Math.min(600, newHeight))
      
      console.log('🔄 RESIZE DEBUG: handleMouseMove', {
        startY,
        currentY: e.clientY,
        deltaY,
        startHeight,
        newHeight,
        clampedHeight,
        callingOnHeightChange: true
      })
      
      // Update internal height immediately for responsive UI
      setInternalHeight(clampedHeight)
      
      // Call parent callback
      onHeightChange(clampedHeight)
      
      console.log('✅ RESIZE DEBUG: onHeightChange called with', clampedHeight)
    }

    const handleMouseUp = () => {
      console.log('🔼 RESIZE DEBUG: handleMouseUp triggered')
      
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // Reset cursor
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    console.log('🎯 RESIZE DEBUG: Event listeners attached')
  }

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current && activeTab === 'terminal') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalSessions, activeTab])

  // Focus terminal input
  useEffect(() => {
    if (isVisible && activeTab === 'terminal' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible, activeTab])

  // Code analysis for problems
  useEffect(() => {
    if (codeContent && pyodide) {
      analyzeCode(codeContent)
    }
  }, [codeContent, pyodide])

  const analyzeCode = (code: string) => {
    const newProblems: Problem[] = []
    const lines = code.split('\n')

    lines.forEach((line, index) => {
      // Simple syntax checks
      if (line.trim().includes('print(') && !line.includes(')')) {
        newProblems.push({
          id: `syntax-${index}`,
          type: 'error',
          message: 'SyntaxError: Missing closing parenthesis',
          file: 'main.py',
          line: index + 1,
          column: line.length,
          source: 'Python'
        })
      }

      if (line.includes('TODO') || line.includes('FIXME')) {
        newProblems.push({
          id: `todo-${index}`,
          type: 'info',
          message: 'TODO comment found',
          file: 'main.py',
          line: index + 1,
          column: line.indexOf('TODO') >= 0 ? line.indexOf('TODO') : line.indexOf('FIXME'),
          source: 'Linter'
        })
      }

      if (line.trim().length > 80 && line.trim().startsWith('#')) {
        newProblems.push({
          id: `line-length-${index}`,
          type: 'warning',
          message: 'Line too long (>80 characters)',
          file: 'main.py',
          line: index + 1,
          column: 80,
          source: 'Style'
        })
      }
    })

    setProblems(newProblems)
  }

  const addTerminalMessage = (sessionId: string, message: Omit<TerminalMessage, 'id' | 'timestamp'>) => {
    setTerminalSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          history: [
            ...session.history,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date()
            }
          ]
        }
      }
      return session
    }))
  }

  const executeCommand = async (command: string) => {
    const activeSession = terminalSessions.find(s => s.id === activeTerminalId)
    if (!activeSession) return

    setCommandHistory(prev => [command, ...prev.slice(0, 49)])
    
    addTerminalMessage(activeSession.id, {
      type: 'input',
      content: `$ ${command}`
    })

    // Set session as running
    setTerminalSessions(prev => prev.map(s => 
      s.id === activeSession.id ? { ...s, isRunning: true } : s
    ))

    try {
      if (command.trim() === 'clear') {
        setTerminalSessions(prev => prev.map(session => 
          session.id === activeSession.id 
            ? { ...session, history: [] }
            : session
        ))
      } else if (command.trim() === 'help') {
        addTerminalMessage(activeSession.id, {
          type: 'output',
          content: `Agent Academy IDE Terminal Commands:
  clear     - Clear terminal
  help      - Show this help
  ls        - List files
  pwd       - Show current directory
  python    - Enter Python mode
  pip       - Package manager
  git       - Version control
  
AI Assistant Commands:
  ai <question>   - Ask the AI assistant anything
  /help          - Show AI terminal help
  /model         - Show current AI model
  /clear         - Clear AI conversation
  debug <error>  - Debug code errors with AI
  explain <code> - Get AI explanation of code
  
🤖 Claude Code-like experience: Just type naturally for AI help!
Python code can be executed directly.`
        })
      } else if (command.trim() === 'ls') {
        addTerminalMessage(activeSession.id, {
          type: 'output',
          content: 'main.py  utils.py  data/  tests/  README.md  requirements.txt'
        })
      } else if (command.trim() === 'pwd') {
        addTerminalMessage(activeSession.id, {
          type: 'output',
          content: activeSession.cwd
        })
      } else if (command.startsWith('git ')) {
        addTerminalMessage(activeSession.id, {
          type: 'output',
          content: `Git command executed: ${command}`
        })
      } else if (command.startsWith('ai ') || command.startsWith('/')) {
        // AI Assistant Commands
        try {
          const aiPrompt = command.startsWith('ai ') ? command.slice(3).trim() : command
          const aiResponse = await aiClient.executeCommand(aiPrompt)
          
          addTerminalMessage(activeSession.id, {
            type: 'output',
            content: aiResponse
          })
        } catch (error) {
          addTerminalMessage(activeSession.id, {
            type: 'error',
            content: `AI Error: ${error}`
          })
        }
      } else if (command.startsWith('debug ')) {
        // Debug command with AI
        try {
          const errorText = command.slice(6).trim()
          const currentCode = codeContent || ''
          const aiResponse = await aiClient.debugCode(currentCode, errorText)
          
          addTerminalMessage(activeSession.id, {
            type: 'output',
            content: `🐛 Debug Analysis:\n${aiResponse}`
          })
        } catch (error) {
          addTerminalMessage(activeSession.id, {
            type: 'error',
            content: `Debug Error: ${error}`
          })
        }
      } else if (command.startsWith('explain ')) {
        // Explain code with AI
        try {
          const codeToExplain = command.slice(8).trim() || codeContent || ''
          const aiResponse = await aiClient.explainCode(codeToExplain)
          
          addTerminalMessage(activeSession.id, {
            type: 'output',
            content: `🧠 Code Explanation:\n${aiResponse}`
          })
        } catch (error) {
          addTerminalMessage(activeSession.id, {
            type: 'error',
            content: `Explain Error: ${error}`
          })
        }
      } else if (command.includes('?') || command.toLowerCase().includes('how to') || command.toLowerCase().includes('what is')) {
        // Natural language AI queries (Claude Code-like experience)
        try {
          const aiResponse = await aiClient.sendMessage(command, { code: codeContent })
          
          addTerminalMessage(activeSession.id, {
            type: 'output',
            content: `🤖 AI Assistant:\n${aiResponse.content}`
          })
        } catch (error) {
          addTerminalMessage(activeSession.id, {
            type: 'error',
            content: `AI Error: ${error}`
          })
        }
      } else if (pyodide && (command.startsWith('python ') || command.includes('import ') || command.includes('='))) {
        try {
          pyodide.runPython(`
            import sys
            from io import StringIO
            old_stdout = sys.stdout
            sys.stdout = mystdout = StringIO()
          `)
          
          const result = pyodide.runPython(command)
          const stdout = pyodide.runPython("mystdout.getvalue()")
          pyodide.runPython("sys.stdout = old_stdout")
          
          if (stdout) {
            addTerminalMessage(activeSession.id, {
              type: 'output',
              content: stdout
            })
          } else if (result !== undefined && result !== null) {
            addTerminalMessage(activeSession.id, {
              type: 'output',
              content: String(result)
            })
          }
        } catch (error) {
          addTerminalMessage(activeSession.id, {
            type: 'error',
            content: `Error: ${error}`
          })
        }
      } else {
        addTerminalMessage(activeSession.id, {
          type: 'error',
          content: `Command not found: ${command}`
        })
      }
    } catch (error) {
      addTerminalMessage(activeSession.id, {
        type: 'error',
        content: `Error: ${error}`
      })
    } finally {
      setTerminalSessions(prev => prev.map(s => 
        s.id === activeSession.id ? { ...s, isRunning: false } : s
      ))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (currentInput.trim()) {
          executeCommand(currentInput.trim())
          setCurrentInput('')
          setHistoryIndex(-1)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || '')
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || '')
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setCurrentInput('')
        }
        break
      case 'Tab':
        e.preventDefault()
        const pythonKeywords = ['print', 'import', 'def', 'class', 'if', 'else', 'for', 'while', 'try', 'except']
        const matches = pythonKeywords.filter(kw => kw.startsWith(currentInput.toLowerCase()))
        if (matches.length === 1) {
          setCurrentInput(matches[0] + ' ')
        }
        break
    }
  }

  const createNewTerminal = () => {
    const newTerminal: TerminalSession = {
      id: Date.now().toString(),
      name: `Terminal ${terminalSessions.length + 1}`,
      cwd: '/workspace',
      isActive: false,
      isRunning: false,
      history: [{
        id: '1',
        type: 'system',
        content: 'New terminal session started',
        timestamp: new Date()
      }]
    }
    setTerminalSessions(prev => [...prev, newTerminal])
    setActiveTerminalId(newTerminal.id)
  }

  const closeTerminal = (sessionId: string) => {
    if (terminalSessions.length === 1) return
    
    setTerminalSessions(prev => prev.filter(s => s.id !== sessionId))
    if (activeTerminalId === sessionId) {
      setActiveTerminalId(terminalSessions.find(s => s.id !== sessionId)?.id || '')
    }
  }

  const getProblemIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getOutputIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getPortStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped': return <Square className="h-4 w-4 text-gray-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (!isVisible) return null

  const activeTerminal = terminalSessions.find(s => s.id === activeTerminalId)

  return (
    <div 
      ref={panelRef}
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col" 
      style={{ height: `${internalHeight}px`, minHeight: '100px', maxHeight: '600px' }}
    >
      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize hover:bg-blue-500 transition-colors relative group"
        onMouseDown={(e) => {
          console.log('🎯 RESIZE HANDLE DEBUG: Mouse down on resize handle', {
            target: e.target,
            currentTarget: e.currentTarget,
            clientY: e.clientY,
            button: e.button
          })
          handleMouseDown(e)
        }}
        onMouseEnter={() => console.log('🎯 RESIZE HANDLE DEBUG: Mouse entered resize handle')}
        onMouseLeave={() => console.log('🎯 RESIZE HANDLE DEBUG: Mouse left resize handle')}
      >
        {/* Visual drag indicator */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-400" />
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 mt-1 h-0.5 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-400" />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'terminal'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Terminal</span>
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded">
              {terminalSessions.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'problems'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Problems</span>
            {problems.length > 0 && (
              <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-1.5 py-0.5 rounded">
                {problems.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'output'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileOutput className="h-4 w-4" />
            <span>Output</span>
          </button>
          
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'debug'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Bug className="h-4 w-4" />
            <span>Debug Console</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ports')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'ports'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Network className="h-4 w-4" />
            <span>Ports</span>
            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-1.5 py-0.5 rounded">
              {ports.filter(p => p.status === 'running').length}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2 px-4">
          {activeTab === 'terminal' && (
            <button
              onClick={createNewTerminal}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="New Terminal"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Hide Panel"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col">
            {/* Terminal Tabs */}
            {terminalSessions.length > 1 && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {terminalSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setActiveTerminalId(session.id)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap ${
                      activeTerminalId === session.id
                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{session.name}</span>
                    {session.isRunning && <Loader2 className="h-3 w-3 animate-spin" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTerminal(session.id)
                      }}
                      className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </button>
                ))}
              </div>
            )}

            {/* Terminal Content */}
            <div className="flex-1 flex flex-col bg-black">
              <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-sm text-green-400"
              >
                {activeTerminal?.history.map(message => (
                  <div
                    key={message.id}
                    className={`mb-1 ${
                      message.type === 'input' ? 'text-white' :
                      message.type === 'error' ? 'text-red-400' :
                      message.type === 'system' ? 'text-blue-400' :
                      'text-green-400'
                    }`}
                  >
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>{line || '\u00A0'}</div>
                    ))}
                  </div>
                ))}

                {/* Command Input */}
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                    disabled={activeTerminal?.isRunning}
                    placeholder={activeTerminal?.isRunning ? 'Running...' : 'Type a command...'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Tab */}
        {activeTab === 'problems' && (
          <div className="h-full overflow-y-auto">
            {problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-8 w-8 mb-2" />
                <p>No problems detected</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {problems.map(problem => (
                  <div key={problem.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {getProblemIcon(problem.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {problem.message}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {problem.file}:{problem.line}:{problem.column} • {problem.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {outputMessages.map(msg => (
              <div key={msg.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                {getOutputIcon(msg.type)}
                <div className="flex-1">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{msg.message}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.timestamp.toLocaleTimeString()} • {msg.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Debug Console Tab */}
        {activeTab === 'debug' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm">
              {debugMessages.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Debug console ready. Start debugging to see messages here.
                </div>
              ) : (
                debugMessages.map(msg => (
                  <div key={msg.id} className="mb-1">
                    <span className="text-gray-500">{msg.timestamp.toLocaleTimeString()}</span>
                    <span className={`ml-2 ${
                      msg.level === 'error' ? 'text-red-400' :
                      msg.level === 'warn' ? 'text-yellow-400' :
                      msg.level === 'debug' ? 'text-purple-400' :
                      'text-white'
                    }`}>
                      {msg.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Ports Tab */}
        {activeTab === 'ports' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
              {ports.map(port => (
                <div key={port.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getPortStatusIcon(port.status)}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {port.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {port.protocol}://localhost:{port.port} • {port.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      title="Open in Browser"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}