'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Terminal, X, Plus, Square, Minimize2, Maximize2, Copy, Download } from 'lucide-react'

interface TerminalSession {
  id: string
  title: string
  cwd: string
  history: TerminalMessage[]
  isActive: boolean
  isRunning: boolean
}

interface TerminalMessage {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  content: string
  timestamp: Date
}

interface IntegratedTerminalProps {
  isVisible: boolean
  onToggle: () => void
  height?: number
  onHeightChange?: (height: number) => void
  pyodide?: any
}

export const IntegratedTerminal: React.FC<IntegratedTerminalProps> = ({
  isVisible,
  onToggle,
  height = 300,
  onHeightChange,
  pyodide
}) => {
  const [sessions, setSessions] = useState<TerminalSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('')
  const [currentInput, setCurrentInput] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Initialize with a default terminal session
  useEffect(() => {
    if (sessions.length === 0) {
      const defaultSession: TerminalSession = {
        id: 'default',
        title: 'Python Terminal',
        cwd: '/workspace',
        history: [{
          id: '1',
          type: 'system',
          content: 'Agent Academy Terminal - Python Environment Ready',
          timestamp: new Date()
        }],
        isActive: true,
        isRunning: false
      }
      setSessions([defaultSession])
      setActiveSessionId('default')
    }
  }, [sessions.length])

  const activeSession = sessions.find(s => s.id === activeSessionId)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [activeSession?.history])

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  // Handle resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    const startY = e.clientY
    const startHeight = height

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY)
      const clampedHeight = Math.max(150, Math.min(600, newHeight))
      onHeightChange?.(clampedHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [height, onHeightChange])

  const addMessage = (sessionId: string, message: Omit<TerminalMessage, 'id' | 'timestamp'>) => {
    setSessions(prev => prev.map(session => {
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
    if (!activeSession) return

    // Add command to history
    setCommandHistory(prev => [command, ...prev.slice(0, 49)]) // Keep last 50 commands
    
    // Add input message
    addMessage(activeSession.id, {
      type: 'input',
      content: `$ ${command}`
    })

    // Set session as running
    setSessions(prev => prev.map(s => 
      s.id === activeSession.id ? { ...s, isRunning: true } : s
    ))

    try {
      if (command.trim() === 'clear') {
        // Clear terminal
        setSessions(prev => prev.map(session => 
          session.id === activeSession.id 
            ? { ...session, history: [] }
            : session
        ))
      } else if (command.trim() === 'help') {
        // Show help
        addMessage(activeSession.id, {
          type: 'output',
          content: `Available commands:
  clear - Clear terminal
  help - Show this help
  ls - List files (simulated)
  pwd - Show current directory
  python - Enter Python mode
  
Python code can be executed directly.
Use Ctrl+C to interrupt running code.`
        })
      } else if (command.trim() === 'ls') {
        // Simulate ls command
        addMessage(activeSession.id, {
          type: 'output',
          content: 'main.py  utils.py  data/  tests/  README.md'
        })
      } else if (command.trim() === 'pwd') {
        // Show current working directory
        addMessage(activeSession.id, {
          type: 'output',
          content: activeSession.cwd
        })
      } else if (command.startsWith('python ') || command.trim().startsWith('import ') || 
                 command.trim().startsWith('def ') || command.trim().startsWith('class ') ||
                 command.trim().startsWith('for ') || command.trim().startsWith('if ') ||
                 command.trim().startsWith('print(') || command.includes('=')) {
        // Execute Python code using Pyodide
        if (pyodide) {
          try {
            // Redirect stdout to capture print statements
            pyodide.runPython(`
              import sys
              from io import StringIO
              old_stdout = sys.stdout
              sys.stdout = mystdout = StringIO()
            `)
            
            // Execute the command
            const result = pyodide.runPython(command)
            
            // Get stdout output
            const stdout = pyodide.runPython("mystdout.getvalue()")
            
            // Restore stdout
            pyodide.runPython("sys.stdout = old_stdout")
            
            // Display output
            if (stdout) {
              addMessage(activeSession.id, {
                type: 'output',
                content: stdout
              })
            } else if (result !== undefined && result !== null) {
              addMessage(activeSession.id, {
                type: 'output',
                content: String(result)
              })
            }
          } catch (error) {
            addMessage(activeSession.id, {
              type: 'error',
              content: `Python Error: ${error}`
            })
          }
        } else {
          addMessage(activeSession.id, {
            type: 'error',
            content: 'Python interpreter not available. Please wait for Pyodide to load.'
          })
        }
      } else {
        // Unknown command
        addMessage(activeSession.id, {
          type: 'error',
          content: `Command not found: ${command}`
        })
      }
    } catch (error) {
      addMessage(activeSession.id, {
        type: 'error',
        content: `Error: ${error}`
      })
    } finally {
      // Set session as not running
      setSessions(prev => prev.map(s => 
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
        // Simple auto-completion for Python keywords
        const pythonKeywords = ['print', 'import', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except']
        const matches = pythonKeywords.filter(kw => kw.startsWith(currentInput.toLowerCase()))
        if (matches.length === 1) {
          setCurrentInput(matches[0] + ' ')
        }
        break
    }
  }

  const createNewSession = () => {
    const newSession: TerminalSession = {
      id: Date.now().toString(),
      title: `Terminal ${sessions.length + 1}`,
      cwd: '/workspace',
      history: [{
        id: '1',
        type: 'system',
        content: 'New terminal session started',
        timestamp: new Date()
      }],
      isActive: false,
      isRunning: false
    }
    setSessions(prev => [...prev, newSession])
    setActiveSessionId(newSession.id)
  }

  const closeSession = (sessionId: string) => {
    if (sessions.length === 1) return // Don't close the last session
    
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions.find(s => s.id !== sessionId)?.id || '')
    }
  }

  const copyTerminalContent = () => {
    if (!activeSession) return
    
    const content = activeSession.history
      .map(msg => msg.content)
      .join('\n')
    
    navigator.clipboard.writeText(content).then(() => {
      addMessage(activeSession.id, {
        type: 'system',
        content: 'Terminal content copied to clipboard'
      })
    })
  }

  if (!isVisible) return null

  return (
    <div className="border-t border-green-500/30 bg-gray-900 flex flex-col" style={{ height }}>
      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 bg-green-500/20 cursor-row-resize hover:bg-green-500/40 transition-colors relative group"
        onMouseDown={handleMouseDown}
      >
        {/* Visual drag indicator */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-green-500/40 group-hover:bg-green-400/60" />
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 mt-1 h-0.5 bg-green-500/40 group-hover:bg-green-400/60" />
      </div>

      {/* Terminal header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-green-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-green-100 text-sm font-medium">Terminal</span>
          
          {/* Terminal tabs */}
          <div className="flex items-center gap-1 ml-4">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm cursor-pointer ${
                  session.id === activeSessionId
                    ? 'bg-green-500/20 text-green-100'
                    : 'text-green-400/60 hover:text-green-100'
                }`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <span>{session.title}</span>
                {session.isRunning && (
                  <Square className="w-2 h-2 text-red-400" />
                )}
                {sessions.length > 1 && (
                  <X
                    className="w-3 h-3 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeSession(session.id)
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={createNewSession}
            className="p-1 rounded hover:bg-green-500/20 text-green-400"
            title="New Terminal"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={copyTerminalContent}
            className="p-1 rounded hover:bg-green-500/20 text-green-400"
            title="Copy Terminal Content"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-green-500/20 text-green-400"
            title="Hide Terminal"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm bg-black/40 text-green-100"
      >
        {activeSession?.history.map(message => (
          <div
            key={message.id}
            className={`mb-1 ${
              message.type === 'input'
                ? 'text-green-100'
                : message.type === 'error'
                ? 'text-red-400'
                : message.type === 'system'
                ? 'text-blue-400'
                : 'text-green-300'
            }`}
          >
            {message.content.split('\n').map((line, index) => (
              <div key={index}>{line || '\u00A0'}</div>
            ))}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-100 font-mono"
            disabled={activeSession?.isRunning}
            placeholder={activeSession?.isRunning ? 'Running...' : 'Type a command...'}
          />
          {activeSession?.isRunning && (
            <Square className="w-3 h-3 text-red-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Terminal footer */}
      <div className="p-2 bg-gray-800 border-t border-green-500/20 text-xs text-green-400/60">
        <div className="flex items-center justify-between">
          <span>{activeSession?.cwd}</span>
          <span>
            ↑↓ History • Tab Complete • Ctrl+C Interrupt
          </span>
        </div>
      </div>
    </div>
  )
}