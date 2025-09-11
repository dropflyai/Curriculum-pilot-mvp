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
  Loader2,
  Folder,
  Eye,
  EyeOff,
  Wrench,
  Package,
  Monitor,
  Maximize,
  Minimize,
  MoreHorizontal,
  Command,
  Search,
  Grid3x3,
  GraduationCap
} from 'lucide-react'

// Import our new VS Code components and systems
import FileExplorer, { type FileSystemItem } from './FileExplorer'
import ToolsPanel, { type Tool } from './ToolsPanel'
import LivePreview from './LivePreview'
import MultiBrowserManager from './MultiBrowserManager'
import { CommandPalette, createDefaultCommands, type Command as CommandType } from './CommandPalette'
import { IntegratedTerminal } from './IntegratedTerminal'
import { extensionsManager, initializeExtensions } from '@/lib/extensions-system'
import { mcpServer, initializeMCP } from '@/lib/mcp-integration'
import { keyBindingService, useKeybindings, getShortcutString } from '@/lib/keybindings'
import { claudeCodeClient, getClaudeCodeAssistance } from '@/lib/claude-code-integration'
// import { DrMayaNexusAI } from '@/lib/openai-client'
// Mock implementation to avoid build issues
class MockDrMayaNexusAI {
  async generateResponse(userMessage: string, context: any): Promise<string> {
    return `I understand you're asking about "${userMessage}". While I'm in demo mode, I can still help with your AI agent development! What specific concept would you like me to explain?`
  }
}
import LearningSupportHub from './LearningSupportHub'

interface DrMayaNexusMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface OpenFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  isModified: boolean
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

export default function AgentAcademyIDEPro({
  initialCode = '# Welcome to Agent Academy IDE Professional\n# Build your AI agent here\n\nprint("Hello, Agent!")\n',
  lesson,
  onCodeChange,
  onAIGenerate
}: AgentAcademyIDEProps) {
  // Core IDE state
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [pyodideReady, setPyodideReady] = useState(false)
  const pyodideRef = useRef<any>(null)

  // File management
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    {
      id: 'main',
      name: 'main.py',
      path: '/main.py',
      content: initialCode,
      language: 'python',
      isModified: false
    }
  ])
  const [activeFileId, setActiveFileId] = useState('main')
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: 'main',
      name: 'main.py',
      type: 'file',
      path: '/main.py',
      content: initialCode,
      language: 'python'
    }
  ])

  // Panel visibility
  const [showExplorer, setShowExplorer] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  
  // Layout state
  const [layout, setLayout] = useState<'split' | 'preview' | 'editor'>('split')
  const [activeTabType, setActiveTabType] = useState<'file' | 'preview' | 'tools' | 'ai' | 'windows' | 'learning'>('file')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(300)

  // Learning Support
  const [showLearningSupport, setShowLearningSupport] = useState(true)

  // VS Code Features
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [availableCommands, setAvailableCommands] = useState<CommandType[]>([])

  // AI Chat System
  const [chatMessages, setChatMessages] = useState<DrMayaNexusMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome, Agent! I\'m Dr. Maya Nexus with professional IDE capabilities. I can help with the Command Palette (Ctrl+Shift+P), terminal commands, shortcuts, and more. What shall we build?',
      timestamp: Date.now()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAIThinking, setIsAIThinking] = useState(false)
  
  // Dr. Maya AI Chat (separate from main chat for AI Tutor tab)
  const [drMayaMessages, setDrMayaMessages] = useState<DrMayaNexusMessage[]>([
    {
      id: 'maya-1',
      role: 'assistant',
      content: '🎯 Welcome to Agent Academy, Agent! I\'m Dr. Maya, your AI development mentor. I\'m here to help you master Python, AI agent development, and complete your coding missions. What would you like to learn today?',
      timestamp: Date.now()
    }
  ])
  const [drMayaInput, setDrMayaInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // AI Clients
  const drMayaAI = useRef(new MockDrMayaNexusAI())

  // Tools system
  const [availableTools, setAvailableTools] = useState<Tool[]>([])

  // Initialize VS Code keybindings
  const commandActions = {
    // File operations
    'file.new': () => handleNewFile(),
    'file.open': () => handleOpenFile(),
    'file.save': () => handleSaveFile(),
    'file.closeTab': () => handleCloseTab(),
    
    // Edit operations
    'edit.copy': () => handleCopy(),
    'edit.paste': () => handlePaste(),
    'edit.cut': () => handleCut(),
    'edit.undo': () => handleUndo(),
    'edit.redo': () => handleRedo(),
    'edit.find': () => handleFind(),
    'edit.replace': () => handleReplace(),
    
    // View operations
    'workbench.action.toggleSidebarVisibility': () => setShowExplorer(!showExplorer),
    'workbench.action.terminal.toggleTerminal': () => setShowTerminal(!showTerminal),
    'workbench.action.showCommands': () => setIsCommandPaletteOpen(true),
    'workbench.action.quickOpen': () => handleQuickOpen(),
    'workbench.action.toggleFullScreen': () => setIsFullscreen(!isFullscreen),
    
    // Run operations
    'workbench.action.debug.run': () => runCode(),
    'agentacademy.runPython': () => runCode(),
    'agentacademy.askMaya': () => setActiveTabType('ai'),
    'agentacademy.togglePreview': () => setActiveTabType('preview'),
    'agentacademy.toggleLearningSupport': () => setShowLearningSupport(!showLearningSupport),
    
    // Settings
    'workbench.action.openSettings': () => handleOpenSettings(),
    
    // Format
    'editor.action.formatDocument': () => handleFormatCode(),
  }

  useKeybindings(commandActions)

  // Initialize IDE systems
  useEffect(() => {
    const initSystems = async () => {
      try {
        // Initialize extensions
        await initializeExtensions()
        
        // Initialize MCP
        await initializeMCP()
        
        // Initialize tools
        const tools: Tool[] = [
          {
            id: 'python-run',
            name: 'Python Executor',
            description: 'Execute Python code with Pyodide',
            icon: <Play className="h-4 w-4" />,
            category: 'execution',
            command: 'python.run',
            execute: async (code?: string) => {
              return await runCode(code || getCurrentCode())
            }
          },
          {
            id: 'ai-assistant',
            name: 'AI Code Assistant',
            description: 'Get AI help with your code',
            icon: <Bot className="h-4 w-4" />,
            category: 'ai',
            command: 'ai.assist',
            execute: async (prompt?: string) => {
              return await mcpServer.executeTool('analyze_code', {
                code: getCurrentCode(),
                language: 'python'
              })
            }
          },
          {
            id: 'code-formatter',
            name: 'Code Formatter',
            description: 'Format and beautify your code',
            icon: <Sparkles className="h-4 w-4" />,
            category: 'system',
            command: 'format.code',
            execute: async () => {
              handleFormatCode()
              return { success: true, message: 'Code formatted successfully' }
            }
          },
          {
            id: 'terminal-open',
            name: 'Open Terminal',
            description: 'Open integrated terminal',
            icon: <Terminal className="h-4 w-4" />,
            category: 'system',
            command: 'terminal.new',
            execute: async () => {
              setShowTerminal(true)
              return { success: true, message: 'Terminal opened' }
            }
          }
        ]
        
        setAvailableTools(tools)

        // Initialize Command Palette commands
        // Map commandActions to expected interface format
        const commandActionsForPalette = {
          openFile: commandActions['file.open'],
          saveFile: commandActions['file.save'],
          newFile: commandActions['file.new'],
          openFolder: () => handleOpenFile(), // placeholder
          runCode: commandActions['agentacademy.runPython'],
          debugCode: commandActions['workbench.action.debug.run'],
          openTerminal: commandActions['workbench.action.terminal.toggleTerminal'],
          toggleSidebar: commandActions['workbench.action.toggleSidebarVisibility'],
          openSettings: commandActions['workbench.action.openSettings'],
          copy: commandActions['edit.copy'],
          paste: commandActions['edit.paste'],
          cut: commandActions['edit.cut'],
          undo: commandActions['edit.undo'],
          redo: commandActions['edit.redo'],
          find: commandActions['edit.find'],
          replace: commandActions['edit.replace'],
          formatCode: commandActions['editor.action.formatDocument'],
          gitStatus: () => {}, // placeholder
          gitCommit: () => {}, // placeholder
          togglePreview: commandActions['agentacademy.togglePreview']
        }
        
        const commands = createDefaultCommands(commandActionsForPalette)
        setAvailableCommands(commands)
        
        console.log('Agent Academy IDE with VS Code Features - All systems initialized')
      } catch (error) {
        console.error('Failed to initialize IDE systems:', error)
      }
    }
    
    initSystems()
    initPyodide()
  }, [])

  // Initialize Pyodide
  const initPyodide = async () => {
    try {
      if (typeof window === 'undefined') return
      
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
      script.onload = async () => {
        // @ts-ignore
        pyodideRef.current = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        })
        setPyodideReady(true)
        setOutput(['🐍 Python runtime initialized - VS Code Enhanced IDE ready'])
      }
      script.onerror = () => {
        setOutput(['❌ Python runtime failed to initialize'])
      }
      document.head.appendChild(script)
      
      return () => {
        document.head.removeChild(script)
      }
    } catch (error) {
      console.error("Failed to load Pyodide:", error)
      setOutput(['❌ Python runtime failed to initialize'])
    }
  }

  const getCurrentCode = () => {
    const activeFile = openFiles.find(f => f.id === activeFileId)
    return activeFile?.content || code
  }

  const runCode = async (codeToRun?: string) => {
    if (!pyodideReady || !pyodideRef.current) {
      setOutput(['❌ Python runtime not ready'])
      return { success: false, error: 'Python runtime not ready' }
    }

    const targetCode = codeToRun || getCurrentCode()
    setIsRunning(true)
    setOutput([])
    
    try {
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `)
      
      pyodideRef.current.runPython(targetCode)
      
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()")
      const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()")
      
      const newOutput = []
      if (stdout) newOutput.push(`✅ ${stdout}`)
      if (stderr) newOutput.push(`❌ ${stderr}`)
      if (!stdout && !stderr) newOutput.push('✅ Code executed successfully')
      
      setOutput(newOutput)
      
      return { success: true, output: newOutput }
      
    } catch (error) {
      const errorOutput = [`❌ Error: ${error}`]
      setOutput(errorOutput)
      return { success: false, error: String(error), output: errorOutput }
    } finally {
      setIsRunning(false)
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    
    // Update the active file
    setOpenFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content: newCode, isModified: true }
        : file
    ))
    
    onCodeChange?.(newCode)
  }

  // VS Code Command handlers
  const handleNewFile = () => {
    const newFile: OpenFile = {
      id: `file-${Date.now()}`,
      name: 'untitled.py',
      path: '/untitled.py',
      content: '',
      language: 'python',
      isModified: false
    }
    setOpenFiles(prev => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  const handleOpenFile = () => {
    // Simulate file picker - in real app would use file system API
    const fileName = prompt('Enter file name to open:')
    if (fileName) {
      handleNewFile() // For demo purposes
    }
  }

  const handleSaveFile = () => {
    // Mark current file as saved
    setOpenFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, isModified: false } : file
    ))
    // In real app would save to file system
  }

  const handleCloseTab = () => {
    if (openFiles.length > 1) {
      setOpenFiles(prev => prev.filter(f => f.id !== activeFileId))
      const remainingFiles = openFiles.filter(f => f.id !== activeFileId)
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[0].id)
      }
    }
  }

  const handleCopy = () => {
    document.execCommand('copy')
  }

  const handlePaste = () => {
    document.execCommand('paste')
  }

  const handleCut = () => {
    document.execCommand('cut')
  }

  const handleUndo = () => {
    // Monaco editor handles this automatically
  }

  const handleRedo = () => {
    // Monaco editor handles this automatically
  }

  const handleFind = () => {
    // Monaco editor's find widget
    // This would typically be handled by Monaco's built-in find functionality
  }

  const handleReplace = () => {
    // Monaco editor's replace widget
  }

  const handleQuickOpen = () => {
    // For now, open command palette - could be enhanced with file picker
    setIsCommandPaletteOpen(true)
  }

  const handleOpenSettings = () => {
    alert('Settings would open here in a full implementation')
  }

  const handleFormatCode = () => {
    // In a real implementation, this would format the current code
    // For now, just show a message
    setOutput(prev => [...prev, '✅ Code formatted'])
  }

  const focusAIChat = () => {
    setActiveTabType('ai')
    // Focus would be handled by refs in a real implementation
  }

  // Dr. Maya AI Tutor Chat Handler
  const handleDrMayaChat = async () => {
    if (!drMayaInput.trim() || isGenerating) return

    const userMessage = drMayaInput.trim()
    setDrMayaInput('')
    setIsGenerating(true)

    // Add user message to chat
    const userMsg: DrMayaNexusMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    setDrMayaMessages(prev => [...prev, userMsg])

    try {
      // Get current code context for AI
      const activeFile = openFiles.find(f => f.id === activeFileId)
      const currentCode = activeFile?.content || code
      
      // Use both Claude Code and OpenAI for comprehensive assistance
      const [claudeResponse, mayaResponse] = await Promise.all([
        getClaudeCodeAssistance(currentCode, { line: 0, column: 0 }, 'chat'),
        drMayaAI.current.generateResponse(userMessage, {
          currentCode,
          lesson,
          userHistory: drMayaMessages.map(m => m.content)
        })
      ])

      // Combine responses intelligently
      let finalResponse = mayaResponse
      if (claudeResponse.confidence > 0.8 && userMessage.toLowerCase().includes('code')) {
        finalResponse = `${claudeResponse.content}\n\n---\n\n${mayaResponse}`
      }

      // Add AI response to chat
      const aiMsg: DrMayaNexusMessage = {
        id: `maya-${Date.now()}`,
        role: 'assistant',
        content: finalResponse,
        timestamp: Date.now()
      }
      setDrMayaMessages(prev => [...prev, aiMsg])

    } catch (error) {
      console.error('Dr. Maya chat error:', error)
      const errorMsg: DrMayaNexusMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '🔧 My AI systems are temporarily offline, Agent. Please try again in a moment. Your mission continues!',
        timestamp: Date.now()
      }
      setDrMayaMessages(prev => [...prev, errorMsg])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === 'file') {
      // Check if file is already open
      const existingFile = openFiles.find(f => f.path === file.path)
      if (existingFile) {
        setActiveFileId(existingFile.id)
      } else {
        // Open new file
        const newFile: OpenFile = {
          id: file.id,
          name: file.name,
          path: file.path,
          content: file.content || '',
          language: file.language || 'python',
          isModified: false
        }
        setOpenFiles(prev => [...prev, newFile])
        setActiveFileId(file.id)
      }
    }
  }

  const handleFileCreate = (path: string, type: 'file' | 'folder') => {
    const name = prompt(`Enter ${type} name:`)
    if (!name) return
    
    const newItem: FileSystemItem = {
      id: `${Date.now()}-${name}`,
      name,
      type,
      path: path ? `${path}/${name}` : `/${name}`,
      content: type === 'file' ? '' : undefined,
      language: type === 'file' ? 'python' : undefined
    }
    
    setFileSystem(prev => [...prev, newItem])
  }

  const handleFileDelete = (file: FileSystemItem) => {
    if (confirm(`Delete ${file.name}?`)) {
      setFileSystem(prev => prev.filter(f => f.id !== file.id))
      setOpenFiles(prev => prev.filter(f => f.path !== file.path))
      
      if (activeFileId === file.id && openFiles.length > 1) {
        setActiveFileId(openFiles[0].id)
      }
    }
  }

  const handleFileRename = (file: FileSystemItem, newName: string) => {
    setFileSystem(prev => prev.map(f => 
      f.id === file.id 
        ? { ...f, name: newName, path: f.path.replace(file.name, newName) }
        : f
    ))
  }

  const handleToolExecute = async (tool: Tool, args?: any) => {
    console.log(`Executing tool: ${tool.name}`, args)
    // Tool execution handled by the ToolsPanel component
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
      let response = ''
      
      if (onAIGenerate) {
        response = await onAIGenerate(chatInput)
      } else {
        // Use MCP for enhanced AI responses
        try {
          const analysisResult = await mcpServer.executeTool('analyze_code', {
            code: getCurrentCode(),
            language: 'python'
          })
          
          response = `I analyzed your code and here's what I found:\n\n${JSON.stringify(analysisResult.analysis, null, 2)}\n\nTip: Use Ctrl+Shift+P for the Command Palette, or Ctrl+\` for terminal!`
        } catch {
          response = `I understand you're asking about "${chatInput}". As Dr. Maya Nexus with professional IDE capabilities, I can help with:\n\n• Command Palette (Ctrl+Shift+P)\n• Terminal operations (Ctrl+\`)\n• Code analysis and debugging\n• File management\n• Professional shortcuts\n\nWhat would you like to work on?`
        }
      }

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

  const activeFile = openFiles.find(f => f.id === activeFileId)

  return (
    <div className={`h-screen bg-slate-900 text-green-400 flex flex-col font-mono ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={availableCommands}
        onExecuteCommand={(commandId) => {
          console.log(`Executed command: ${commandId}`)
        }}
      />

      {/* Top Bar - Enhanced with VS Code features */}
      <div className="bg-slate-800 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-bold">AGENT ACADEMY IDE</span>
            <span className="text-xs text-green-500/70">PROFESSIONAL</span>
          </div>
          {lesson && (
            <div className="text-green-300 text-sm">
              <span className="opacity-60">Mission:</span> {lesson.title}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded hover:bg-slate-700 text-green-400"
            title={`Command Palette (${getShortcutString('workbench.action.showCommands')})`}
          >
            <Command className="h-4 w-4" />
          </button>

          {/* Layout Controls */}
          <div className="flex items-center space-x-1 border border-green-500/30 rounded">
            <button
              onClick={() => setLayout('editor')}
              className={`p-1 rounded-l text-xs ${layout === 'editor' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Editor Only"
            >
              <FileText className="h-3 w-3" />
            </button>
            <button
              onClick={() => setLayout('split')}
              className={`p-1 text-xs ${layout === 'split' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Split View"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
            <button
              onClick={() => setLayout('preview')}
              className={`p-1 rounded-r text-xs ${layout === 'preview' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}
              title="Preview Focus"
            >
              <Monitor className="h-3 w-3" />
            </button>
          </div>
          
          {/* Panel Toggles */}
          <button
            onClick={() => setShowExplorer(!showExplorer)}
            className={`p-2 rounded ${showExplorer ? 'bg-green-600/30' : 'hover:bg-slate-700'}`}
            title={`Toggle Explorer (${getShortcutString('workbench.action.toggleSidebarVisibility')})`}
          >
            <Folder className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded ${showTerminal ? 'bg-green-600/30' : 'hover:bg-slate-700'}`}
            title={`Toggle Terminal (${getShortcutString('workbench.action.terminal.toggleTerminal')})`}
          >
            <Terminal className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowLearningSupport(!showLearningSupport)}
            className={`p-2 rounded ${showLearningSupport ? 'bg-green-600/30' : 'hover:bg-slate-700'}`}
            title={`Toggle Learning Support (${getShortcutString('agentacademy.toggleLearningSupport')})`}
          >
            <GraduationCap className="h-4 w-4" />
          </button>
          
          
          {/* Run Button */}
          <button
            onClick={() => runCode()}
            disabled={isRunning || !pyodideReady}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-sm text-white transition-colors"
            title={`Run Python (${getShortcutString('agentacademy.runPython')})`}
          >
            {isRunning ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            <span>RUN</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-slate-700 rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${pyodideReady ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-green-300">
              {pyodideReady ? 'READY' : 'LOADING...'}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Tab System - Files and Live Preview */}
      <div className="bg-slate-700 border-b border-green-500/30 flex items-center overflow-x-auto">
        {/* File Tabs */}
        {openFiles.map((file) => (
          <button
            key={file.id}
            onClick={() => {
              setActiveFileId(file.id)
              setActiveTabType('file')
            }}
            className={`flex items-center space-x-2 px-3 py-2 border-r border-green-500/30 whitespace-nowrap ${
              activeFileId === file.id && activeTabType === 'file'
                ? 'bg-slate-800 text-green-300'
                : 'text-gray-400 hover:text-green-300 hover:bg-slate-700/50'
            }`}
          >
            <FileText className="h-3 w-3" />
            <span className="text-sm">{file.name}</span>
            {file.isModified && (
              <div className="h-2 w-2 bg-orange-400 rounded-full" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCloseTab()
              }}
              className="hover:bg-slate-600 rounded p-0.5"
            >
              <span className="text-xs">×</span>
            </button>
          </button>
        ))}
        
        {/* Live Preview Tab */}
        <button
          onClick={() => setActiveTabType('preview')}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-green-500/30 whitespace-nowrap ${
            activeTabType === 'preview'
              ? 'bg-slate-800 text-green-300'
              : 'text-gray-400 hover:text-green-300 hover:bg-slate-700/50'
          }`}
        >
          <Monitor className="h-3 w-3" />
          <span className="text-sm">Live Preview</span>
        </button>
        
        {/* Tools Tab */}
        <button
          onClick={() => setActiveTabType('tools')}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-green-500/30 whitespace-nowrap ${
            activeTabType === 'tools'
              ? 'bg-slate-800 text-green-300'
              : 'text-gray-400 hover:text-green-300 hover:bg-slate-700/50'
          }`}
        >
          <Wrench className="h-3 w-3" />
          <span className="text-sm">Tools</span>
        </button>
        
        {/* AI Tutor Tab */}
        <button
          onClick={() => setActiveTabType('ai')}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-green-500/30 whitespace-nowrap ${
            activeTabType === 'ai'
              ? 'bg-slate-800 text-green-300'
              : 'text-gray-400 hover:text-green-300 hover:bg-slate-700/50'
          }`}
        >
          <Bot className="h-3 w-3" />
          <span className="text-sm">AI Tutor</span>
        </button>
        
        {/* Multi-Windows Tab */}
        <button
          onClick={() => setActiveTabType('windows')}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-green-500/30 whitespace-nowrap ${
            activeTabType === 'windows'
              ? 'bg-slate-800 text-green-300'
              : 'text-gray-400 hover:text-green-300 hover:bg-slate-700/50'
          }`}
        >
          <Grid3x3 className="h-3 w-3" />
          <span className="text-sm">Windows</span>
        </button>
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          {/* Left Sidebar - Explorer */}
          {showExplorer && (
            <div className="w-64">
              <FileExplorer
                rootFiles={fileSystem}
                selectedFile={activeFileId}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
              />
            </div>
          )}

          {/* Main Content Area - Tabbed System */}
          <div className="flex-1 flex flex-col">
            {/* File Editor Tab Content */}
            {activeTabType === 'file' && (
              <div className={`flex-1 relative`}>
                <Editor
                  height="100%"
                  defaultLanguage={activeFile?.language || 'python'}
                  value={activeFile?.content || code}
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
                    suggest: {
                      showKeywords: true,
                      showSnippets: true,
                      showFunctions: true
                    },
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    hover: { enabled: true }
                  }}
                />
                
                {!pyodideReady && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-2" />
                      <div className="text-green-300">Initializing Professional Python Runtime...</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Live Preview Tab Content */}
            {activeTabType === 'preview' && (
              <div className="flex-1 bg-slate-900">
                <LivePreview
                  htmlContent=""
                  cssContent=""
                  jsContent=""
                  pythonOutput={output.join('\n')}
                  isVisible={true}
                />
              </div>
            )}
            
            {/* Tools Tab Content */}
            {activeTabType === 'tools' && (
              <div className="flex-1 bg-slate-900 p-4">
                <ToolsPanel
                  tools={availableTools}
                  onToolExecute={(tool) => {
                    // Execute the tool
                    tool.execute?.()
                  }}
                  onToolInstall={(toolId) => {
                    console.log('Install tool:', toolId)
                  }}
                  onToolUninstall={(toolId) => {
                    setAvailableTools(prev => prev.filter(t => t.id !== toolId))
                  }}
                />
              </div>
            )}
            
            {/* AI Tutor Tab Content */}
            {activeTabType === 'ai' && (
              <div className="flex-1 bg-slate-900 flex flex-col">
                <div className="bg-slate-800 px-4 py-3 border-b border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <span className="text-green-300 font-medium">Dr. Maya AI Tutor</span>
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {drMayaMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-green-600/30 text-green-100'
                              : 'bg-blue-600/30 text-blue-100'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === 'assistant' && <Bot className="h-4 w-4 mt-0.5 text-blue-400" />}
                            {message.role === 'user' && <User className="h-4 w-4 mt-0.5 text-green-400" />}
                            <div className="text-sm">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-blue-600/30 text-blue-100 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            <span className="text-sm">Dr. Maya is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-green-500/30">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={drMayaInput}
                        onChange={(e) => setDrMayaInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleDrMayaChat()}
                        placeholder="Ask Dr. Maya about your code..."
                        className="flex-1 bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 placeholder-green-500/50 focus:outline-none focus:border-green-400"
                      />
                      <button
                        onClick={handleDrMayaChat}
                        disabled={isGenerating || !drMayaInput.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Multi-Windows Tab Content */}
            {activeTabType === 'windows' && (
              <div className="flex-1 bg-slate-900">
                <MultiBrowserManager />
              </div>
            )}

            {/* Output Panel (when terminal is hidden) */}
            {!showTerminal && layout !== 'preview' && (
              <div className="h-48 bg-black border-t border-green-500/30 flex flex-col">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-300">Output</span>
                  </div>
                  <button
                    onClick={() => setOutput([])}
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
            )}
          </div>

        </div>

        {/* Integrated Terminal */}
        {showTerminal && (
          <IntegratedTerminal
            isVisible={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
            height={terminalHeight}
            onHeightChange={setTerminalHeight}
            pyodide={pyodideRef.current}
          />
        )}
      </div>

      {/* Learning Support Hub */}
      <LearningSupportHub
        currentCode={getCurrentCode()}
        errorMessage={output.find(line => line.includes('❌'))?.replace('❌ ', '')}
        lessonContext={{
          id: lesson?.id.toString() || 'demo',
          title: lesson?.title || 'Build Your First AI Agent',
          concepts: lesson?.hints?.map(hint => 
            hint.toLowerCase().includes('class') ? 'classes' :
            hint.toLowerCase().includes('function') ? 'functions' :
            hint.toLowerCase().includes('variable') ? 'variables' :
            'ai-agents'
          ) || ['functions', 'classes', 'variables', 'ai-agents'],
          difficulty: 'intermediate'
        }}
        isVisible={showLearningSupport}
        onClose={() => setShowLearningSupport(false)}
        onHintUsed={(hintId) => console.log('Hint used:', hintId)}
        onResourceView={(resourceId) => console.log('Resource viewed:', resourceId)}
      />
    </div>
  )
}