'use client'

import { useState, useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { 
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  FileText, 
  Settings, 
  Zap,
  Brain,
  MessageSquare,
  Send,
  Sparkles,
  Save,
  Download,
  Upload,
  Bot,
  User,
  Loader2
} from 'lucide-react'

interface DrMayaNexusMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AgentAcademyIDEProps {
  initialCode?: string
  lesson?: {
    id: number
    title: string
    objective: string
    hints: string[]
  }
  onCodeChange?: (code: string) => void
  onAIGenerate?: (prompt: string) => Promise<string>
}

export default function AgentAcademyIDEClient({
  initialCode = '# Welcome to Agent Academy IDE\n# Build your AI agent here\n\nprint("Hello, Agent!")\n',
  lesson,
  onCodeChange,
  onAIGenerate
}: AgentAcademyIDEProps) {
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [pyodideReady, setPyodideReady] = useState(false)
  const pyodideRef = useRef<any>(null)

  // AI Chat System - Dr. Maya Nexus
  const [chatMessages, setChatMessages] = useState<DrMayaNexusMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome, Agent! I\'m Dr. Maya Nexus, your AI programming assistant. I\'m here to help you build intelligent agents and master Python development. What would you like to work on?',
      timestamp: Date.now()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAIThinking, setIsAIThinking] = useState(false)

  // Initialize Pyodide when component mounts (client-side only)
  useEffect(() => {
    const initPyodide = async () => {
      try {
        if (typeof window === 'undefined') return
        
        // Load pyodide from CDN to avoid webpack issues
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        script.onload = async () => {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
          })
          setPyodideReady(true)
          setOutput(['🐍 Python runtime initialized successfully'])
          console.log("🐍 Pyodide loaded successfully")
        }
        script.onerror = () => {
          console.error("Failed to load Pyodide from CDN")
          setOutput(['❌ Python runtime failed to initialize'])
        }
        document.head.appendChild(script)
        
        return () => {
          document.head.removeChild(script)
        }
      } catch (error) {
        console.error("Failed to load Pyodide:", error)
        setOutput(prev => [...prev, "❌ Python runtime failed to initialize"])
      }
    }
    
    initPyodide()
  }, [])

  const runCode = async () => {
    if (!pyodideReady || !pyodideRef.current) {
      setOutput(prev => [...prev, "❌ Python runtime not ready"])
      return
    }

    setIsRunning(true)
    setOutput([])
    
    try {
      // Capture stdout/stderr
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `)
      
      // Run user code
      pyodideRef.current.runPython(code)
      
      // Get output
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()")
      const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()")
      
      const newOutput = []
      if (stdout) newOutput.push(stdout)
      if (stderr) newOutput.push(`❌ ${stderr}`)
      
      setOutput(newOutput.length > 0 ? newOutput : ['✅ Code executed successfully'])
      
    } catch (error) {
      setOutput([`❌ Error: ${error}`])
    } finally {
      setIsRunning(false)
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  const handleAIChat = async () => {
    if (!chatInput.trim() || isAIThinking) return

    const userMessage: DrMayaNexusMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsAIThinking(true)

    try {
      const response = onAIGenerate 
        ? await onAIGenerate(chatInput)
        : `I understand you're asking about "${chatInput}". As Dr. Maya Nexus, I'd recommend focusing on your current lesson objectives. Try implementing the concepts step by step, and don't hesitate to experiment with the code!`

      const aiMessage: DrMayaNexusMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: DrMayaNexusMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsAIThinking(false)
    }
  }

  const clearOutput = () => setOutput([])

  return (
    <div className="h-screen bg-slate-900 text-green-400 flex flex-col font-mono">
      {/* Top Bar - Agent Academy IDE Header */}
      <div className="bg-slate-800 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-bold">AGENT ACADEMY IDE</span>
          </div>
          {lesson && (
            <div className="text-green-300 text-sm">
              <span className="opacity-60">Mission:</span> {lesson.title}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${pyodideReady ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-green-300">
            {pyodideReady ? 'PYTHON READY' : 'INITIALIZING...'}
          </span>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex">
        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-slate-800 border-b border-green-500/30 px-4 py-2 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-300">agent_code.py</span>
            <div className="flex-1" />
            <button
              onClick={runCode}
              disabled={isRunning || !pyodideReady}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-sm text-white transition-colors"
            >
              {isRunning ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              <span>RUN</span>
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            {!pyodideReady && (
              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-2" />
                  <div className="text-green-300">Initializing Python Runtime...</div>
                </div>
              </div>
            )}
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                fontFamily: 'Fira Code, Monaco, Consolas, monospace',
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="h-48 bg-black border-t border-green-500/30 flex flex-col">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">Output</span>
              </div>
              <button
                onClick={clearOutput}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {output.length === 0 ? (
                <div className="text-green-500/50 italic">Output will appear here...</div>
              ) : (
                <div className="space-y-1">
                  {output.map((line, index) => (
                    <div key={index} className="text-green-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel - Dr. Maya Nexus */}
        <div className="w-80 bg-slate-800 border-l border-green-500/30 flex flex-col">
          {/* AI Header */}
          <div className="bg-slate-700 px-4 py-3 border-b border-green-500/30">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Dr. Maya Nexus</span>
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-xs text-green-300 mt-1">AI Programming Assistant</div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-green-300'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && <Bot className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />}
                    {message.role === 'user' && <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />}
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {isAIThinking && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-green-300 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm italic">Dr. Maya is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-green-500/30">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask Dr. Maya for help..."
                className="flex-1 bg-slate-700 text-green-300 px-3 py-2 rounded border border-green-500/30 focus:border-green-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleAIChat}
                disabled={!chatInput.trim() || isAIThinking}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info Panel (if lesson provided) */}
      {lesson && (
        <div className="bg-slate-800 border-t border-green-500/30 p-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-green-300 font-medium">Mission Objective</div>
              <div className="text-green-400 text-sm mt-1">{lesson.objective}</div>
              {lesson.hints && lesson.hints.length > 0 && (
                <div className="mt-2">
                  <div className="text-green-300 text-sm font-medium mb-1">Intel:</div>
                  <ul className="text-green-400 text-sm space-y-1">
                    {lesson.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}