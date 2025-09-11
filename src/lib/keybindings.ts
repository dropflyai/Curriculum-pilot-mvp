// Professional keybinding system for Agent Academy IDE

export interface KeyBinding {
  id: string
  key: string
  command: string
  when?: string
  description?: string
}

export interface KeyMap {
  [key: string]: string
}

export class KeyBindingService {
  private bindings: Map<string, KeyBinding> = new Map()
  private listeners: Map<string, () => void> = new Map()
  private isEnabled = true

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.setupEventListeners()
      this.loadDefaultKeybindings()
    }
  }

  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  private loadDefaultKeybindings() {
    const defaultBindings: KeyBinding[] = [
      // File operations
      { id: 'file.new', key: 'Ctrl+N', command: 'file.new', description: 'New File' },
      { id: 'file.open', key: 'Ctrl+O', command: 'file.open', description: 'Open File' },
      { id: 'file.save', key: 'Ctrl+S', command: 'file.save', description: 'Save File' },
      { id: 'file.saveAs', key: 'Ctrl+Shift+S', command: 'file.saveAs', description: 'Save As' },
      { id: 'file.closeTab', key: 'Ctrl+W', command: 'file.closeTab', description: 'Close Tab' },
      
      // Edit operations
      { id: 'edit.undo', key: 'Ctrl+Z', command: 'edit.undo', description: 'Undo' },
      { id: 'edit.redo', key: 'Ctrl+Y', command: 'edit.redo', description: 'Redo' },
      { id: 'edit.cut', key: 'Ctrl+X', command: 'edit.cut', description: 'Cut' },
      { id: 'edit.copy', key: 'Ctrl+C', command: 'edit.copy', description: 'Copy' },
      { id: 'edit.paste', key: 'Ctrl+V', command: 'edit.paste', description: 'Paste' },
      { id: 'edit.selectAll', key: 'Ctrl+A', command: 'edit.selectAll', description: 'Select All' },
      { id: 'edit.find', key: 'Ctrl+F', command: 'edit.find', description: 'Find' },
      { id: 'edit.replace', key: 'Ctrl+H', command: 'edit.replace', description: 'Replace' },
      { id: 'edit.findNext', key: 'F3', command: 'edit.findNext', description: 'Find Next' },
      { id: 'edit.findPrevious', key: 'Shift+F3', command: 'edit.findPrevious', description: 'Find Previous' },
      
      // Navigation
      { id: 'workbench.action.quickOpen', key: 'Ctrl+P', command: 'workbench.action.quickOpen', description: 'Quick Open File' },
      { id: 'workbench.action.showCommands', key: 'Ctrl+Shift+P', command: 'workbench.action.showCommands', description: 'Command Palette' },
      { id: 'workbench.action.gotoLine', key: 'Ctrl+G', command: 'workbench.action.gotoLine', description: 'Go to Line' },
      
      // View operations
      { id: 'workbench.action.toggleSidebarVisibility', key: 'Ctrl+B', command: 'workbench.action.toggleSidebarVisibility', description: 'Toggle Sidebar' },
      { id: 'workbench.action.terminal.toggleTerminal', key: 'Ctrl+`', command: 'workbench.action.terminal.toggleTerminal', description: 'Toggle Terminal' },
      { id: 'workbench.action.terminal.new', key: 'Ctrl+Shift+`', command: 'workbench.action.terminal.new', description: 'New Terminal' },
      { id: 'workbench.action.toggleFullScreen', key: 'F11', command: 'workbench.action.toggleFullScreen', description: 'Toggle Full Screen' },
      { id: 'workbench.action.zoomIn', key: 'Ctrl+=', command: 'workbench.action.zoomIn', description: 'Zoom In' },
      { id: 'workbench.action.zoomOut', key: 'Ctrl+-', command: 'workbench.action.zoomOut', description: 'Zoom Out' },
      { id: 'workbench.action.zoomReset', key: 'Ctrl+0', command: 'workbench.action.zoomReset', description: 'Reset Zoom' },
      
      // Tab navigation
      { id: 'workbench.action.nextEditor', key: 'Ctrl+Tab', command: 'workbench.action.nextEditor', description: 'Next Tab' },
      { id: 'workbench.action.previousEditor', key: 'Ctrl+Shift+Tab', command: 'workbench.action.previousEditor', description: 'Previous Tab' },
      { id: 'workbench.action.openEditorAtIndex1', key: 'Ctrl+1', command: 'workbench.action.openEditorAtIndex1', description: 'Go to Tab 1' },
      { id: 'workbench.action.openEditorAtIndex2', key: 'Ctrl+2', command: 'workbench.action.openEditorAtIndex2', description: 'Go to Tab 2' },
      { id: 'workbench.action.openEditorAtIndex3', key: 'Ctrl+3', command: 'workbench.action.openEditorAtIndex3', description: 'Go to Tab 3' },
      
      // Code operations
      { id: 'editor.action.commentLine', key: 'Ctrl+/', command: 'editor.action.commentLine', description: 'Toggle Line Comment' },
      { id: 'editor.action.blockComment', key: 'Shift+Alt+A', command: 'editor.action.blockComment', description: 'Toggle Block Comment' },
      { id: 'editor.action.formatDocument', key: 'Shift+Alt+F', command: 'editor.action.formatDocument', description: 'Format Document' },
      { id: 'editor.action.indentLines', key: 'Ctrl+]', command: 'editor.action.indentLines', description: 'Indent Lines' },
      { id: 'editor.action.outdentLines', key: 'Ctrl+[', command: 'editor.action.outdentLines', description: 'Outdent Lines' },
      { id: 'editor.action.moveLinesUpAction', key: 'Alt+Up', command: 'editor.action.moveLinesUpAction', description: 'Move Line Up' },
      { id: 'editor.action.moveLinesDownAction', key: 'Alt+Down', command: 'editor.action.moveLinesDownAction', description: 'Move Line Down' },
      { id: 'editor.action.duplicateSelection', key: 'Shift+Alt+Down', command: 'editor.action.duplicateSelection', description: 'Duplicate Line' },
      { id: 'editor.action.deleteLines', key: 'Ctrl+Shift+K', command: 'editor.action.deleteLines', description: 'Delete Line' },
      
      // Multi-cursor
      { id: 'editor.action.insertCursorAbove', key: 'Ctrl+Alt+Up', command: 'editor.action.insertCursorAbove', description: 'Add Cursor Above' },
      { id: 'editor.action.insertCursorBelow', key: 'Ctrl+Alt+Down', command: 'editor.action.insertCursorBelow', description: 'Add Cursor Below' },
      { id: 'editor.action.addSelectionToNextFindMatch', key: 'Ctrl+D', command: 'editor.action.addSelectionToNextFindMatch', description: 'Add Selection to Next Find Match' },
      { id: 'editor.action.selectHighlights', key: 'Ctrl+Shift+L', command: 'editor.action.selectHighlights', description: 'Select All Occurrences' },
      
      // Run/Debug
      { id: 'workbench.action.debug.start', key: 'F5', command: 'workbench.action.debug.start', description: 'Start Debugging' },
      { id: 'workbench.action.debug.run', key: 'Ctrl+F5', command: 'workbench.action.debug.run', description: 'Run Without Debugging' },
      { id: 'workbench.action.debug.stop', key: 'Shift+F5', command: 'workbench.action.debug.stop', description: 'Stop Debugging' },
      { id: 'workbench.action.debug.restart', key: 'Ctrl+Shift+F5', command: 'workbench.action.debug.restart', description: 'Restart Debugging' },
      { id: 'editor.debug.action.toggleBreakpoint', key: 'F9', command: 'editor.debug.action.toggleBreakpoint', description: 'Toggle Breakpoint' },
      { id: 'workbench.action.debug.stepOver', key: 'F10', command: 'workbench.action.debug.stepOver', description: 'Step Over' },
      { id: 'workbench.action.debug.stepInto', key: 'F11', command: 'workbench.action.debug.stepInto', description: 'Step Into' },
      { id: 'workbench.action.debug.stepOut', key: 'Shift+F11', command: 'workbench.action.debug.stepOut', description: 'Step Out' },
      
      // Git operations
      { id: 'git.commit', key: 'Ctrl+Shift+G', command: 'git.commit', description: 'Git Commit' },
      { id: 'git.push', key: 'Ctrl+Shift+P', command: 'git.push', when: 'gitOpenRepositoryCount > 0', description: 'Git Push' },
      
      // Settings
      { id: 'workbench.action.openSettings', key: 'Ctrl+,', command: 'workbench.action.openSettings', description: 'Open Settings' },
      { id: 'workbench.action.openKeybindings', key: 'Ctrl+K Ctrl+S', command: 'workbench.action.openKeybindings', description: 'Open Keyboard Shortcuts' },
      
      // Agent Academy specific
      { id: 'agentacademy.runPython', key: 'Ctrl+Enter', command: 'agentacademy.runPython', description: 'Run Python Code' },
      { id: 'agentacademy.askMaya', key: 'Ctrl+Shift+M', command: 'agentacademy.askMaya', description: 'Ask Dr. Maya' },
      { id: 'agentacademy.togglePreview', key: 'Ctrl+Shift+V', command: 'agentacademy.togglePreview', description: 'Toggle Live Preview' },
    ]

    defaultBindings.forEach(binding => {
      this.bindings.set(binding.key, binding)
    })
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return

    // Build the key combination string
    const key = this.buildKeyString(event)
    
    // Check if we have a binding for this key
    const binding = this.bindings.get(key)
    if (binding) {
      // Check context conditions
      if (binding.when && !this.evaluateWhen(binding.when)) {
        return
      }

      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()

      // Execute the command
      this.executeCommand(binding.command)
    }
  }

  private buildKeyString(event: KeyboardEvent): string {
    const parts: string[] = []

    if (event.ctrlKey) parts.push('Ctrl')
    if (event.shiftKey) parts.push('Shift')
    if (event.altKey) parts.push('Alt')
    if (event.metaKey) parts.push('Cmd')

    // Handle special keys
    let key = event.key
    switch (event.key) {
      case ' ': key = 'Space'; break
      case 'ArrowUp': key = 'Up'; break
      case 'ArrowDown': key = 'Down'; break
      case 'ArrowLeft': key = 'Left'; break
      case 'ArrowRight': key = 'Right'; break
      case 'Backspace': key = 'Backspace'; break
      case 'Delete': key = 'Delete'; break
      case 'Enter': key = 'Enter'; break
      case 'Escape': key = 'Escape'; break
      case 'Tab': key = 'Tab'; break
      case '`': key = '`'; break
      case '=': key = '='; break
      case '-': key = '-'; break
      case '/': key = '/'; break
      case '\\': key = '\\'; break
      case '[': key = '['; break
      case ']': key = ']'; break
      default:
        if (event.key.length === 1) {
          key = event.key.toUpperCase()
        }
        break
    }

    parts.push(key)
    return parts.join('+')
  }

  private evaluateWhen(condition: string): boolean {
    // Simple condition evaluation
    // In a real implementation, this would evaluate complex expressions
    switch (condition) {
      case 'gitOpenRepositoryCount > 0':
        return true // Assume we have git for now
      default:
        return true
    }
  }

  private executeCommand(commandId: string) {
    const handler = this.listeners.get(commandId)
    if (handler) {
      try {
        handler()
      } catch (error) {
        console.error(`Error executing command ${commandId}:`, error)
      }
    } else {
      console.warn(`No handler registered for command: ${commandId}`)
    }
  }

  // Public API
  registerCommand(commandId: string, handler: () => void) {
    this.listeners.set(commandId, handler)
  }

  unregisterCommand(commandId: string) {
    this.listeners.delete(commandId)
  }

  registerKeybinding(binding: KeyBinding) {
    this.bindings.set(binding.key, binding)
  }

  unregisterKeybinding(key: string) {
    this.bindings.delete(key)
  }

  getKeybindings(): KeyBinding[] {
    return Array.from(this.bindings.values())
  }

  getKeybindingForCommand(commandId: string): KeyBinding | undefined {
    return Array.from(this.bindings.values()).find(b => b.command === commandId)
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    this.bindings.clear()
    this.listeners.clear()
  }
}

// Global keybinding service instance (lazy-loaded for browser only)
let keyBindingServiceInstance: KeyBindingService | null = null
export const keyBindingService = {
  get instance() {
    if (typeof window !== 'undefined' && !keyBindingServiceInstance) {
      keyBindingServiceInstance = new KeyBindingService()
    }
    return keyBindingServiceInstance!
  },
  registerCommand: (commandId: string, handler: () => void) => keyBindingService.instance.registerCommand(commandId, handler),
  unregisterCommand: (commandId: string) => keyBindingService.instance.unregisterCommand(commandId),
  getKeybindingForCommand: (commandId: string) => keyBindingService.instance.getKeybindingForCommand(commandId)
}

// Hook for React components
export function useKeybindings(commands: Record<string, () => void>) {
  React.useEffect(() => {
    // Register commands
    Object.entries(commands).forEach(([commandId, handler]) => {
      keyBindingService.registerCommand(commandId, handler)
    })

    // Cleanup on unmount
    return () => {
      Object.keys(commands).forEach(commandId => {
        keyBindingService.unregisterCommand(commandId)
      })
    }
  }, [commands])
}

// Utility function to get shortcut string for display
export function getShortcutString(commandId: string): string {
  if (typeof window === 'undefined') return ''
  
  const binding = keyBindingService.getKeybindingForCommand(commandId)
  if (!binding) return ''
  
  return binding.key
    .replace('Ctrl', '⌃')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('Cmd', '⌘')
}

// Import React for the hook
import React from 'react'