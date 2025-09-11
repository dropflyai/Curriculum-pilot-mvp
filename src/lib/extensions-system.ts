// Extensions System for Agent Academy IDE
// Provides professional extension architecture

export interface ExtensionManifest {
  id: string
  name: string
  version: string
  description: string
  publisher: string
  icon?: string
  category: 'language' | 'theme' | 'tool' | 'ai' | 'productivity' | 'debugging'
  main: string
  activationEvents: string[]
  contributes?: {
    commands?: ExtensionCommand[]
    languages?: LanguageContribution[]
    themes?: ThemeContribution[]
    keybindings?: KeybindingContribution[]
    menus?: MenuContribution[]
    views?: ViewContribution[]
  }
  dependencies?: string[]
  engines: {
    agentAcademy: string
  }
}

export interface ExtensionCommand {
  command: string
  title: string
  icon?: string
  category?: string
}

export interface LanguageContribution {
  id: string
  aliases: string[]
  extensions: string[]
  configuration?: string
  grammar?: string
}

export interface ThemeContribution {
  id: string
  label: string
  uiTheme: 'vs-dark' | 'vs-light'
  path: string
}

export interface KeybindingContribution {
  command: string
  key: string
  when?: string
}

export interface MenuContribution {
  command: string
  group: string
  when?: string
}

export interface ViewContribution {
  id: string
  name: string
  when?: string
}

export interface ExtensionContext {
  subscriptions: any[]
  workspaceState: any
  globalState: any
  extensionPath: string
  asAbsolutePath: (relativePath: string) => string
}

export interface ExtensionAPI {
  commands: {
    registerCommand: (command: string, callback: (...args: any[]) => any) => void
    executeCommand: (command: string, ...args: any[]) => Promise<any>
  }
  window: {
    showInformationMessage: (message: string) => void
    showWarningMessage: (message: string) => void
    showErrorMessage: (message: string) => void
    showInputBox: (options: any) => Promise<string | undefined>
  }
  workspace: {
    getConfiguration: (section?: string) => any
    onDidChangeConfiguration: (listener: (event: any) => void) => void
  }
  languages: {
    registerHoverProvider: (selector: any, provider: any) => void
    registerCompletionItemProvider: (selector: any, provider: any) => void
  }
}

class ExtensionsManager {
  private extensions = new Map<string, LoadedExtension>()
  private activationEvents = new Map<string, string[]>()
  private commands = new Map<string, Function>()
  
  async loadExtension(manifest: ExtensionManifest): Promise<void> {
    try {
      // In a real implementation, this would load the extension code
      // For now, we'll simulate loading built-in extensions
      
      const extensionModule = await this.loadExtensionModule(manifest.main)
      const context = this.createExtensionContext(manifest)
      
      const loadedExtension: LoadedExtension = {
        manifest,
        context,
        module: extensionModule,
        isActive: false
      }
      
      this.extensions.set(manifest.id, loadedExtension)
      
      // Register activation events
      manifest.activationEvents.forEach(event => {
        if (!this.activationEvents.has(event)) {
          this.activationEvents.set(event, [])
        }
        this.activationEvents.get(event)!.push(manifest.id)
      })
      
      console.log(`Extension ${manifest.name} loaded successfully`)
    } catch (error) {
      console.error(`Failed to load extension ${manifest.id}:`, error)
    }
  }
  
  async activateExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId)
    if (!extension || extension.isActive) return
    
    try {
      if (extension.module && extension.module.activate) {
        await extension.module.activate(extension.context)
      }
      extension.isActive = true
      console.log(`Extension ${extension.manifest.name} activated`)
    } catch (error) {
      console.error(`Failed to activate extension ${extensionId}:`, error)
    }
  }
  
  async deactivateExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId)
    if (!extension || !extension.isActive) return
    
    try {
      if (extension.module && extension.module.deactivate) {
        await extension.module.deactivate()
      }
      extension.isActive = false
      console.log(`Extension ${extension.manifest.name} deactivated`)
    } catch (error) {
      console.error(`Failed to deactivate extension ${extensionId}:`, error)
    }
  }
  
  async triggerActivationEvent(event: string): Promise<void> {
    const extensionsToActivate = this.activationEvents.get(event) || []
    
    for (const extensionId of extensionsToActivate) {
      await this.activateExtension(extensionId)
    }
  }
  
  registerCommand(command: string, callback: Function): void {
    this.commands.set(command, callback)
  }
  
  async executeCommand(command: string, ...args: any[]): Promise<any> {
    const callback = this.commands.get(command)
    if (callback) {
      return await callback(...args)
    }
    throw new Error(`Command ${command} not found`)
  }
  
  getExtensions(): LoadedExtension[] {
    return Array.from(this.extensions.values())
  }
  
  getExtension(id: string): LoadedExtension | undefined {
    return this.extensions.get(id)
  }
  
  private async loadExtensionModule(main: string): Promise<any> {
    // In a real implementation, this would dynamically import the extension
    // For now, return a mock module
    return {
      activate: async (context: ExtensionContext) => {
        console.log('Mock extension activated')
      },
      deactivate: async () => {
        console.log('Mock extension deactivated')
      }
    }
  }
  
  private createExtensionContext(manifest: ExtensionManifest): ExtensionContext {
    return {
      subscriptions: [],
      workspaceState: {},
      globalState: {},
      extensionPath: `/extensions/${manifest.id}`,
      asAbsolutePath: (relativePath: string) => `/extensions/${manifest.id}/${relativePath}`
    }
  }
}

interface LoadedExtension {
  manifest: ExtensionManifest
  context: ExtensionContext
  module: any
  isActive: boolean
}

// Built-in extensions
export const builtinExtensions: ExtensionManifest[] = [
  {
    id: 'python-support',
    name: 'Python Language Support',
    version: '1.0.0',
    description: 'Enhanced Python language support with AI assistance',
    publisher: 'Agent Academy',
    icon: '🐍',
    category: 'language',
    main: 'python-extension.js',
    activationEvents: ['onLanguage:python'],
    contributes: {
      languages: [{
        id: 'python',
        aliases: ['Python', 'python'],
        extensions: ['.py', '.pyw'],
        configuration: 'python-language-configuration.json'
      }],
      commands: [
        {
          command: 'python.runFile',
          title: 'Run Python File',
          icon: 'play'
        },
        {
          command: 'python.debugFile',
          title: 'Debug Python File',
          icon: 'debug'
        }
      ]
    },
    engines: {
      agentAcademy: '^1.0.0'
    }
  },
  {
    id: 'ai-copilot',
    name: 'Dr. Maya AI Copilot',
    version: '1.0.0',
    description: 'AI-powered code completion and assistance',
    publisher: 'Agent Academy',
    icon: '🤖',
    category: 'ai',
    main: 'ai-copilot-extension.js',
    activationEvents: ['*'],
    contributes: {
      commands: [
        {
          command: 'ai.generateCode',
          title: 'Generate Code with AI',
          icon: 'sparkles'
        },
        {
          command: 'ai.explainCode',
          title: 'Explain Code',
          icon: 'help-circle'
        },
        {
          command: 'ai.optimizeCode',
          title: 'Optimize Code',
          icon: 'zap'
        }
      ]
    },
    engines: {
      agentAcademy: '^1.0.0'
    }
  },
  {
    id: 'git-integration',
    name: 'Git Version Control',
    version: '1.0.0',
    description: 'Git integration for version control',
    publisher: 'Agent Academy',
    icon: '📚',
    category: 'tool',
    main: 'git-extension.js',
    activationEvents: ['workspaceContains:.git'],
    contributes: {
      commands: [
        {
          command: 'git.commit',
          title: 'Commit Changes',
          icon: 'git-commit'
        },
        {
          command: 'git.push',
          title: 'Push Changes',
          icon: 'upload'
        },
        {
          command: 'git.pull',
          title: 'Pull Changes',
          icon: 'download'
        }
      ]
    },
    engines: {
      agentAcademy: '^1.0.0'
    }
  },
  {
    id: 'theme-agent-dark',
    name: 'Agent Academy Dark Theme',
    version: '1.0.0',
    description: 'Official Agent Academy dark theme',
    publisher: 'Agent Academy',
    icon: '🎨',
    category: 'theme',
    main: 'theme-extension.js',
    activationEvents: ['*'],
    contributes: {
      themes: [{
        id: 'agent-dark',
        label: 'Agent Academy Dark',
        uiTheme: 'vs-dark',
        path: './themes/agent-dark.json'
      }]
    },
    engines: {
      agentAcademy: '^1.0.0'
    }
  },
  {
    id: 'live-preview',
    name: 'Live Preview',
    version: '1.0.0',
    description: 'Real-time preview for web development',
    publisher: 'Agent Academy',
    icon: '👁️',
    category: 'productivity',
    main: 'preview-extension.js',
    activationEvents: ['onLanguage:html', 'onLanguage:css', 'onLanguage:javascript'],
    contributes: {
      commands: [
        {
          command: 'preview.show',
          title: 'Show Preview',
          icon: 'eye'
        },
        {
          command: 'preview.refresh',
          title: 'Refresh Preview',
          icon: 'refresh-cw'
        }
      ]
    },
    engines: {
      agentAcademy: '^1.0.0'
    }
  }
]

// Global extensions manager instance
export const extensionsManager = new ExtensionsManager()

// Initialize built-in extensions
export async function initializeExtensions(): Promise<void> {
  console.log('Initializing Agent Academy Extensions...')
  
  for (const manifest of builtinExtensions) {
    await extensionsManager.loadExtension(manifest)
  }
  
  // Activate core extensions immediately
  await extensionsManager.activateExtension('python-support')
  await extensionsManager.activateExtension('ai-copilot')
  await extensionsManager.activateExtension('theme-agent-dark')
  
  console.log('Extensions initialized successfully')
}