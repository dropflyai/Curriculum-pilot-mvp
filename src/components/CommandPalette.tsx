'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search, Command, Terminal, Play, Bug, GitBranch, Settings, Palette, FileText, Folder, Save, Copy, Scissors, Undo, Redo } from 'lucide-react'

export interface Command {
  id: string
  label: string
  category: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  handler: () => void | Promise<void>
  context?: string[]
  when?: () => boolean
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
  onExecuteCommand: (commandId: string) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  onExecuteCommand
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fuzzy search algorithm for commands
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands

    const query = searchQuery.toLowerCase()
    return commands
      .filter(cmd => {
        // Check if command should be shown based on context
        if (cmd.when && !cmd.when()) return false
        
        // Fuzzy search in label, category, and description
        const searchText = `${cmd.label} ${cmd.category} ${cmd.description || ''}`.toLowerCase()
        
        // Simple fuzzy search - check if all characters appear in order
        let queryIndex = 0
        for (let i = 0; i < searchText.length && queryIndex < query.length; i++) {
          if (searchText[i] === query[queryIndex]) {
            queryIndex++
          }
        }
        return queryIndex === query.length
      })
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.label.toLowerCase().includes(query)
        const bExact = b.label.toLowerCase().includes(query)
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        
        // Prioritize by category
        return a.category.localeCompare(b.category)
      })
  }, [searchQuery, commands])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Update selected index when filtered commands change
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1))
    }
  }, [filteredCommands.length, selectedIndex])

  const executeCommand = async (command: Command) => {
    try {
      await command.handler()
      onExecuteCommand(command.id)
      onClose()
    } catch (error) {
      console.error('Command execution failed:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'File': return <FileText className="w-4 h-4" />
      case 'Edit': return <FileText className="w-4 h-4" />
      case 'View': return <Folder className="w-4 h-4" />
      case 'Go': return <Search className="w-4 h-4" />
      case 'Run': return <Play className="w-4 h-4" />
      case 'Terminal': return <Terminal className="w-4 h-4" />
      case 'Debug': return <Bug className="w-4 h-4" />
      case 'Git': return <GitBranch className="w-4 h-4" />
      case 'Preferences': return <Settings className="w-4 h-4" />
      case 'Theme': return <Palette className="w-4 h-4" />
      default: return <Command className="w-4 h-4" />
    }
  }

  const formatShortcut = (shortcut: string) => {
    return shortcut
      .replace('Ctrl', '⌃')
      .replace('Shift', '⇧')
      .replace('Alt', '⌥')
      .replace('Cmd', '⌘')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-gray-900 border border-green-500/30 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-green-500/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-green-500/30 rounded text-green-100 placeholder-green-400/60 focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-green-400/60">
              <Command className="w-8 h-8 mx-auto mb-2" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-green-500/20 border border-green-500/40'
                      : 'hover:bg-green-500/10'
                  }`}
                  onClick={() => executeCommand(command)}
                >
                  <div className="flex-shrink-0 text-green-400">
                    {command.icon || getCategoryIcon(command.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-green-100 font-medium truncate">
                        {command.label}
                      </span>
                      {command.shortcut && (
                        <span className="text-green-400/60 text-sm ml-2 flex-shrink-0">
                          {formatShortcut(command.shortcut)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-400/60 text-sm">
                        {command.category}
                      </span>
                      {command.description && (
                        <>
                          <span className="text-green-400/40">•</span>
                          <span className="text-green-400/60 text-sm truncate">
                            {command.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-green-500/20 bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-green-400/60">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>⏎ Execute</span>
              <span>Esc Close</span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default command definitions for Agent Academy IDE
export const createDefaultCommands = (actions: {
  openFile: () => void
  saveFile: () => void
  newFile: () => void
  openFolder: () => void
  runCode: () => void
  debugCode: () => void
  openTerminal: () => void
  toggleSidebar: () => void
  openSettings: () => void
  copy: () => void
  paste: () => void
  cut: () => void
  undo: () => void
  redo: () => void
  find: () => void
  replace: () => void
  formatCode: () => void
  gitStatus: () => void
  gitCommit: () => void
  togglePreview: () => void
}): Command[] => [
  // File Operations
  {
    id: 'file.open',
    label: 'Open File...',
    category: 'File',
    description: 'Open an existing file',
    icon: <FileText className="w-4 h-4" />,
    shortcut: 'Ctrl+O',
    handler: actions.openFile
  },
  {
    id: 'file.save',
    label: 'Save',
    category: 'File',
    description: 'Save the current file',
    icon: <Save className="w-4 h-4" />,
    shortcut: 'Ctrl+S',
    handler: actions.saveFile
  },
  {
    id: 'file.new',
    label: 'New File',
    category: 'File',
    description: 'Create a new file',
    icon: <FileText className="w-4 h-4" />,
    shortcut: 'Ctrl+N',
    handler: actions.newFile
  },
  {
    id: 'file.openFolder',
    label: 'Open Folder...',
    category: 'File',
    description: 'Open a folder as workspace',
    icon: <Folder className="w-4 h-4" />,
    shortcut: 'Ctrl+K Ctrl+O',
    handler: actions.openFolder
  },

  // Edit Operations
  {
    id: 'edit.copy',
    label: 'Copy',
    category: 'Edit',
    description: 'Copy selected text',
    icon: <Copy className="w-4 h-4" />,
    shortcut: 'Ctrl+C',
    handler: actions.copy
  },
  {
    id: 'edit.cut',
    label: 'Cut',
    category: 'Edit',
    description: 'Cut selected text',
    icon: <Scissors className="w-4 h-4" />,
    shortcut: 'Ctrl+X',
    handler: actions.cut
  },
  {
    id: 'edit.undo',
    label: 'Undo',
    category: 'Edit',
    description: 'Undo last action',
    icon: <Undo className="w-4 h-4" />,
    shortcut: 'Ctrl+Z',
    handler: actions.undo
  },
  {
    id: 'edit.redo',
    label: 'Redo',
    category: 'Edit',
    description: 'Redo last undone action',
    icon: <Redo className="w-4 h-4" />,
    shortcut: 'Ctrl+Y',
    handler: actions.redo
  },
  {
    id: 'edit.find',
    label: 'Find',
    category: 'Edit',
    description: 'Find text in current file',
    icon: <Search className="w-4 h-4" />,
    shortcut: 'Ctrl+F',
    handler: actions.find
  },
  {
    id: 'edit.replace',
    label: 'Replace',
    category: 'Edit',
    description: 'Find and replace text',
    icon: <Search className="w-4 h-4" />,
    shortcut: 'Ctrl+H',
    handler: actions.replace
  },

  // View Operations
  {
    id: 'view.toggleSidebar',
    label: 'Toggle Sidebar',
    category: 'View',
    description: 'Show or hide the sidebar',
    icon: <Folder className="w-4 h-4" />,
    shortcut: 'Ctrl+B',
    handler: actions.toggleSidebar
  },
  {
    id: 'view.togglePreview',
    label: 'Toggle Preview',
    category: 'View',
    description: 'Show or hide live preview',
    shortcut: 'Ctrl+Shift+V',
    handler: actions.togglePreview
  },

  // Run Operations
  {
    id: 'python.run',
    label: 'Run Python File',
    category: 'Run',
    description: 'Execute the current Python file',
    icon: <Play className="w-4 h-4" />,
    shortcut: 'Ctrl+F5',
    handler: actions.runCode
  },
  {
    id: 'python.debug',
    label: 'Debug Python File',
    category: 'Debug',
    description: 'Debug the current Python file',
    icon: <Bug className="w-4 h-4" />,
    shortcut: 'F5',
    handler: actions.debugCode
  },

  // Terminal
  {
    id: 'terminal.new',
    label: 'New Terminal',
    category: 'Terminal',
    description: 'Open a new terminal',
    icon: <Terminal className="w-4 h-4" />,
    shortcut: 'Ctrl+Shift+`',
    handler: actions.openTerminal
  },

  // Git Operations
  {
    id: 'git.status',
    label: 'Git: Show Status',
    category: 'Git',
    description: 'Show git repository status',
    icon: <GitBranch className="w-4 h-4" />,
    handler: actions.gitStatus
  },
  {
    id: 'git.commit',
    label: 'Git: Commit',
    category: 'Git',
    description: 'Commit staged changes',
    icon: <GitBranch className="w-4 h-4" />,
    shortcut: 'Ctrl+Shift+G',
    handler: actions.gitCommit
  },

  // Preferences
  {
    id: 'workbench.action.openSettings',
    label: 'Preferences: Open Settings',
    category: 'Preferences',
    description: 'Open the settings editor',
    icon: <Settings className="w-4 h-4" />,
    shortcut: 'Ctrl+,',
    handler: actions.openSettings
  },
  {
    id: 'editor.action.formatDocument',
    label: 'Format Document',
    category: 'Edit',
    description: 'Format the entire document',
    shortcut: 'Shift+Alt+F',
    handler: actions.formatCode
  }
]