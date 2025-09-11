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
  Globe,
  Code2,
  Bug,
  X,
  Shield,
  ShieldCheck
} from 'lucide-react'

// Import our components and systems
import FileExplorer, { type FileSystemItem } from './FileExplorer'
import ToolsPanel, { type Tool } from './ToolsPanel'
import LivePreview from './LivePreview'
import ClaudeAuthStatus from './ClaudeAuthStatus'
import { CommandPalette, createDefaultCommands, type Command as CommandType } from './CommandPalette'
import { BottomPanel } from './BottomPanel'
import { extensionsManager, initializeExtensions } from '@/lib/extensions-system'
import { mcpServer, initializeMCP } from '@/lib/mcp-integration'
import { keyBindingService, useKeybindings, getShortcutString } from '@/lib/keybindings'
import { claudeCurriculum } from '@/lib/claude-curriculum-integration'

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

export default function AgentAcademyIDEEnhanced({
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
  const [terminalHeight, setTerminalHeight] = useState(300)
  
  // Debug wrapper for setTerminalHeight
  const handleTerminalHeightChange = (newHeight: number) => {
    console.log('📊 PARENT DEBUG: Height change requested', {
      currentHeight: terminalHeight,
      newHeight,
      difference: newHeight - terminalHeight
    })
    setTerminalHeight(newHeight)
    console.log('📊 PARENT DEBUG: setTerminalHeight called with', newHeight)
  }
  
  // Right panel tabs - now including Preview as a tab
  const [activeRightTab, setActiveRightTab] = useState<'tools' | 'preview' | 'ai'>('tools')
  const [showRightPanel, setShowRightPanel] = useState(true)
  
  // Layout state
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Professional Features
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [availableCommands, setAvailableCommands] = useState<CommandType[]>([])

  // Claude Authentication State
  const [isClaudeAuthenticated, setIsClaudeAuthenticated] = useState(false)
  const [showClaudeAuth, setShowClaudeAuth] = useState(false)

  // AI Chat System
  const [chatMessages, setChatMessages] = useState<DrMayaNexusMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome, Agent! I\'m Dr. Maya Nexus, your professional AI assistant. I can help with code analysis, debugging, and development. Ready to build something amazing?',
      timestamp: Date.now()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAIThinking, setIsAIThinking] = useState(false)

  // Tools system
  const [availableTools, setAvailableTools] = useState<Tool[]>([])

  // Initialize keybindings
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
    'agentacademy.askMaya': () => focusAIChat(),
    'agentacademy.togglePreview': () => setActiveRightTab('preview'),
    
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
        await initializeExtensions()
        await initializeMCP()
        
        // Initialize Claude authentication status
        try {
          const authStatus = await claudeCurriculum.getAuthenticationStatus()
          setIsClaudeAuthenticated(authStatus.isAuthenticated)
        } catch (error) {
          console.warn('Failed to check Claude authentication:', error)
        }
        
        const tools: Tool[] = [
          {
            id: 'python-run',
            name: 'Python Executor',
            description: 'Execute Python code with advanced runtime',
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
            description: 'Advanced AI help with your code',
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
            description: 'Professional code formatting',
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
            description: 'Access integrated terminal',
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
        
        console.log('Agent Academy IDE Professional - All systems initialized')
      } catch (error) {
        console.error('Failed to initialize IDE systems:', error)
      }
    }
    
    initSystems()
    initPyodide()
  }, [])

  // Handle OAuth callback success
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await claudeCurriculum.getAuthenticationStatus()
        setIsClaudeAuthenticated(authStatus.isAuthenticated)
        
        // If URL has auth=success parameter, show success notification
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          if (urlParams.get('auth') === 'success') {
            // Remove the parameter from URL
            window.history.replaceState({}, '', window.location.pathname)
            
            // Show success message in chat
            const successMessage: DrMayaNexusMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: '🎉 **Claude Authentication Successful!**\n\nYour Claude subscription is now connected to Agent Academy IDE. You now have:\n\n✅ Unlimited AI assistance\n✅ Advanced curriculum integration\n✅ Personalized learning insights\n✅ No usage limits\n\nReady to enhance your coding skills, Agent?',
              timestamp: Date.now()
            }
            setChatMessages(prev => [...prev, successMessage])
          }
        }
      } catch (error) {
        console.warn('Failed to check auth status:', error)
      }
    }

    checkAuthStatus()
    
    // Check auth status every 60 seconds
    const interval = setInterval(checkAuthStatus, 60000)
    return () => clearInterval(interval)
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
        setOutput(['🐍 Python runtime initialized - Professional IDE ready'])
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
    
    setOpenFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content: newCode, isModified: true }
        : file
    ))
    
    onCodeChange?.(newCode)
  }

  // Command handlers
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
    const fileName = prompt('Enter file name to open:')
    if (fileName) {
      handleNewFile()
    }
  }

  const handleSaveFile = () => {
    setOpenFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, isModified: false } : file
    ))
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

  const handleCopy = () => document.execCommand('copy')
  const handlePaste = () => document.execCommand('paste')
  const handleCut = () => document.execCommand('cut')
  const handleUndo = () => {}
  const handleRedo = () => {}
  const handleFind = () => {}
  const handleReplace = () => {}
  const handleQuickOpen = () => setIsCommandPaletteOpen(true)
  const handleOpenSettings = () => alert('Settings would open here in a full implementation')
  const handleFormatCode = () => setOutput(prev => [...prev, '✅ Code formatted'])
  const focusAIChat = () => setActiveRightTab('ai')

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === 'file') {
      const existingFile = openFiles.find(f => f.path === file.path)
      if (existingFile) {
        setActiveFileId(existingFile.id)
      } else {
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
    const currentInput = chatInput.trim()
    setChatInput('')
    setIsAIThinking(true)

    try {
      let response = ''
      
      if (onAIGenerate) {
        response = await onAIGenerate(currentInput)
      } else {
        // Set lesson context for curriculum integration
        if (lesson) {
          claudeCurriculum.setLessonContext({
            operationId: lesson.id.toString(),
            operationName: lesson.title,
            week: 1, // You could derive this from lesson data
            objective: lesson.objective,
            currentCode: getCurrentCode(),
            studentProgress: claudeCurriculum.getProgressReport() || {
              completedOperations: [],
              currentStruggleConcepts: [],
              strengths: [],
              codingStyle: 'beginner',
              preferredExplanationStyle: 'hands-on',
              sessionHistory: []
            },
            hints: lesson.hints || [],
            concepts: [] // You could extract concepts from the lesson
          })
        }

        try {
          // Use Claude curriculum integration for AI responses
          response = await claudeCurriculum.sendCurriculumMessage(
            currentInput,
            // Determine message type based on content
            currentInput.toLowerCase().includes('debug') || currentInput.toLowerCase().includes('error') ? 'debug' :
            currentInput.toLowerCase().includes('explain') || currentInput.toLowerCase().includes('what') ? 'explain' :
            currentInput.toLowerCase().includes('help') || currentInput.toLowerCase().includes('how') ? 'help' :
            'question'
          )
        } catch (curriculumError) {
          console.log('Claude curriculum error, falling back to MCP:', curriculumError)
          
          // Fallback to MCP server if Claude is not available
          try {
            const analysisResult = await mcpServer.executeTool('analyze_code', {
              code: getCurrentCode(),
              language: 'python'
            })
            
            response = `I analyzed your code and here's what I found:\n\n${JSON.stringify(analysisResult.analysis, null, 2)}\n\nTip: Use Ctrl+Shift+P for the Command Palette, or Ctrl+\` for terminal!`
          } catch {
            response = `I understand you're asking about "${currentInput}". As Dr. Maya Nexus, I can help with:\n\n• Command Palette (Ctrl+Shift+P)\n• Terminal operations (Ctrl+\`)\n• Code analysis and debugging\n• File management\n• Professional shortcuts\n\n${!isClaudeAuthenticated ? '\n🔒 **Connect your Claude subscription** for unlimited AI assistance!' : ''}\n\nWhat would you like to work on?`
          }
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
      console.error('AI Chat error:', error)
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
    <div className={`h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col font-sans ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={availableCommands}
        onExecuteCommand={(commandId) => {
          console.log(`Executed command: ${commandId}`)
        }}
      />

      {/* Top Bar - Modern Professional Look */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-gray-900 dark:text-white font-semibold">Agent Academy IDE</span>
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Professional</span>
            </div>
          </div>
          {lesson && (
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              <span className="opacity-70">Mission:</span> <span className="font-medium">{lesson.title}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title={`Command Palette${typeof window !== 'undefined' ? ` (${getShortcutString('workbench.action.showCommands')})` : ''}`}
          >
            <Command className="h-4 w-4" />
          </button>

          {/* Panel Toggles */}
          <button
            onClick={() => setShowExplorer(!showExplorer)}
            className={`p-2 rounded-lg transition-colors ${showExplorer ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            title={`Toggle Explorer${typeof window !== 'undefined' ? ` (${getShortcutString('workbench.action.toggleSidebarVisibility')})` : ''}`}
          >
            <Folder className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded-lg transition-colors ${showTerminal ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            title={`Toggle Terminal${typeof window !== 'undefined' ? ` (${getShortcutString('workbench.action.terminal.toggleTerminal')})` : ''}`}
          >
            <Terminal className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-2 rounded-lg transition-colors ${showRightPanel ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            title="Toggle Right Panel"
          >
            <Wrench className="h-4 w-4" />
          </button>

          {/* Claude Authentication Button */}
          <button
            onClick={() => setShowClaudeAuth(!showClaudeAuth)}
            className={`p-2 rounded-lg transition-colors ${isClaudeAuthenticated ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'} hover:bg-opacity-80`}
            title={isClaudeAuthenticated ? 'Claude Connected - Click for details' : 'Connect Claude - Click to authenticate'}
          >
            {isClaudeAuthenticated ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
          </button>
          
          {/* Run Button */}
          <button
            onClick={() => runCode()}
            disabled={isRunning || !pyodideReady}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm text-white transition-colors font-medium"
            title={`Run Python${typeof window !== 'undefined' ? ` (${getShortcutString('agentacademy.runPython')})` : ''}`}
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>Run</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${pyodideReady ? 'bg-green-500' : 'bg-amber-500'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {pyodideReady ? 'Ready' : 'Loading...'}
            </span>
          </div>
        </div>
      </div>

      {/* File Tabs */}
      {openFiles.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center overflow-x-auto">
          {openFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm transition-colors ${
                activeFileId === file.id
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{file.name}</span>
              {file.isModified && (
                <div className="h-2 w-2 bg-amber-500 rounded-full" />
              )}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseTab()
                }}
                className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5 ml-1 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main IDE Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Explorer */}
        {showExplorer && (
          <div className="w-64 bg-gray-50 dark:bg-gray-850 border-r border-gray-200 dark:border-gray-700">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <div className="flex-1 relative">
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
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <div className="text-gray-700 dark:text-gray-300 font-medium">Initializing Professional Python Runtime...</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">Setting up your development environment</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Tabbed Interface */}
        {showRightPanel && (
          <div className="w-96 bg-gray-50 dark:bg-gray-850 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Right Panel Tabs */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
              <button
                onClick={() => setActiveRightTab('tools')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'tools'
                    ? 'bg-gray-50 dark:bg-gray-850 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>Tools</span>
              </button>
              
              <button
                onClick={() => setActiveRightTab('preview')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'preview'
                    ? 'bg-gray-50 dark:bg-gray-850 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => setActiveRightTab('ai')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'ai'
                    ? 'bg-gray-50 dark:bg-gray-850 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={`Ask Dr. Maya${typeof window !== 'undefined' ? ` (${getShortcutString('agentacademy.askMaya')})` : ''}`}
              >
                <Bot className="h-4 w-4" />
                <span>Dr. Maya</span>
              </button>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activeRightTab === 'tools' && (
                <ToolsPanel
                  tools={availableTools}
                  onToolExecute={handleToolExecute}
                  onToolInstall={() => {}}
                  onToolUninstall={() => {}}
                />
              )}
              
              {activeRightTab === 'preview' && (
                <div className="h-full">
                  <LivePreview
                    htmlContent=""
                    cssContent=""
                    jsContent=""
                    pythonOutput={output.join('\n')}
                    isVisible={true}
                  />
                </div>
              )}
              
              {activeRightTab === 'ai' && (
                <div className="h-full flex flex-col bg-white dark:bg-gray-900">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <span className="font-semibold">Dr. Maya Nexus</span>
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {isClaudeAuthenticated ? (
                          <div className="flex items-center space-x-1">
                            <ShieldCheck className="h-4 w-4 text-green-300" />
                            <span className="text-xs text-green-200">Claude Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-amber-300" />
                            <span className="text-xs text-amber-200">Connect Claude</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-blue-100 mt-1">
                      {isClaudeAuthenticated ? 'Advanced AI Assistant with Curriculum Integration' : 'Professional AI Assistant - Connect Claude for unlimited access'}
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {message.role === 'assistant' && <Bot className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />}
                            {message.role === 'user' && <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isAIThinking && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <Bot className="h-4 w-4 text-blue-500" />
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm italic">Dr. Maya is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                        placeholder="Ask Dr. Maya for help..."
                        className="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <button
                        onClick={handleAIChat}
                        disabled={!chatInput.trim() || isAIThinking}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed p-2 rounded-xl text-white transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Claude Authentication Modal/Popup */}
      {showClaudeAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Claude Authentication
              </h2>
              <button
                onClick={() => setShowClaudeAuth(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <ClaudeAuthStatus
                onAuthStateChange={(isAuthenticated) => {
                  setIsClaudeAuthenticated(isAuthenticated)
                  if (isAuthenticated) {
                    // Close the modal after successful authentication
                    setTimeout(() => setShowClaudeAuth(false), 2000)
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Panel with Comprehensive Tabs */}
      {showTerminal ? (
        <BottomPanel
          isVisible={showTerminal}
          onToggle={() => setShowTerminal(!showTerminal)}
          height={terminalHeight}
          onHeightChange={handleTerminalHeightChange}
          pyodide={pyodideRef.current}
          codeContent={getCurrentCode()}
        />
      ) : (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between px-4 py-2 h-10">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Terminal</span>
          </div>
          <button
            onClick={() => setShowTerminal(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Show Terminal"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}