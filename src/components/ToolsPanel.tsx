'use client'

import { useState, useEffect } from 'react'
import {
  Terminal,
  Search,
  GitBranch,
  Package,
  Zap,
  Settings,
  Play,
  Square,
  RefreshCw,
  Download,
  Upload,
  Code,
  FileText,
  Wrench,
  Cpu,
  Monitor,
  Database,
  Globe,
  Bot
} from 'lucide-react'

export interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'execution' | 'git' | 'search' | 'ai' | 'system' | 'web'
  command?: string
  isActive?: boolean
  hasNotification?: boolean
  execute: (args?: any) => Promise<any>
}

interface ToolsPanelProps {
  tools: Tool[]
  onToolExecute: (tool: Tool, args?: any) => void
  onToolInstall: (toolId: string) => void
  onToolUninstall: (toolId: string) => void
}

export default function ToolsPanel({
  tools,
  onToolExecute,
  onToolInstall,
  onToolUninstall
}: ToolsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('execution')
  const [searchTerm, setSearchTerm] = useState('')
  const [toolResults, setToolResults] = useState<Record<string, any>>({})

  const categories = [
    { id: 'execution', name: 'Execution', icon: <Play className="h-4 w-4" /> },
    { id: 'ai', name: 'AI Tools', icon: <Bot className="h-4 w-4" /> },
    { id: 'git', name: 'Git', icon: <GitBranch className="h-4 w-4" /> },
    { id: 'search', name: 'Search', icon: <Search className="h-4 w-4" /> },
    { id: 'web', name: 'Web', icon: <Globe className="h-4 w-4" /> },
    { id: 'system', name: 'System', icon: <Settings className="h-4 w-4" /> },
  ]

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleToolExecute = async (tool: Tool) => {
    try {
      const result = await tool.execute()
      setToolResults(prev => ({
        ...prev,
        [tool.id]: result
      }))
      onToolExecute(tool, result)
    } catch (error) {
      setToolResults(prev => ({
        ...prev,
        [tool.id]: { error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }
  }

  const getToolIcon = (category: string, defaultIcon: React.ReactNode) => {
    switch (category) {
      case 'execution':
        return <Play className="h-4 w-4 text-green-400" />
      case 'ai':
        return <Bot className="h-4 w-4 text-purple-400" />
      case 'git':
        return <GitBranch className="h-4 w-4 text-orange-400" />
      case 'search':
        return <Search className="h-4 w-4 text-blue-400" />
      case 'web':
        return <Globe className="h-4 w-4 text-cyan-400" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-400" />
      default:
        return defaultIcon
    }
  }

  return (
    <div className="h-full bg-slate-800 border-r border-green-500/30 flex flex-col">
      {/* Tools Header */}
      <div className="bg-slate-700 px-3 py-2 border-b border-green-500/30">
        <div className="flex items-center justify-between">
          <span className="text-green-300 text-sm font-medium">TOOLS</span>
          <div className="flex space-x-1">
            <button
              className="p-1 hover:bg-slate-600 rounded"
              title="Refresh Tools"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3 w-3 text-green-400" />
            </button>
            <button
              className="p-1 hover:bg-slate-600 rounded"
              title="Install Tool"
            >
              <Download className="h-3 w-3 text-green-400" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-600 text-green-300 pl-7 pr-3 py-1 text-xs rounded border border-green-500/30 focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-green-500/30">
        <div className="flex overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-1 px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
                activeCategory === category.id
                  ? 'border-green-400 text-green-300 bg-slate-700/50'
                  : 'border-transparent text-gray-400 hover:text-green-300 hover:bg-slate-700/30'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-slate-700/50 rounded border border-green-500/20 p-3 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  {getToolIcon(tool.category, tool.icon)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-300 text-sm font-medium">{tool.name}</span>
                      {tool.isActive && (
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                      {tool.hasNotification && (
                        <div className="h-2 w-2 bg-red-400 rounded-full" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-1 leading-tight">
                      {tool.description}
                    </p>
                    {tool.command && (
                      <code className="text-green-500 text-xs bg-slate-800 px-1 py-0.5 rounded mt-1 inline-block">
                        {tool.command}
                      </code>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleToolExecute(tool)}
                  className="ml-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                >
                  Run
                </button>
              </div>

              {/* Tool Result Display */}
              {toolResults[tool.id] && (
                <div className="mt-2 p-2 bg-slate-800 rounded border border-green-500/30">
                  {toolResults[tool.id].error ? (
                    <div className="text-red-400 text-xs">
                      Error: {toolResults[tool.id].error}
                    </div>
                  ) : (
                    <div className="text-green-300 text-xs">
                      <pre className="whitespace-pre-wrap">
                        {typeof toolResults[tool.id] === 'string' 
                          ? toolResults[tool.id]
                          : JSON.stringify(toolResults[tool.id], null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tools found</p>
            <p className="text-xs mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Tools Status Bar */}
      <div className="border-t border-green-500/30 px-3 py-2 bg-slate-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span className="text-gray-400">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}