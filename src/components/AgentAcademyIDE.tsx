'use client'

import { useState, useEffect } from 'react'
import { Loader2, Brain } from 'lucide-react'
import dynamic from 'next/dynamic'

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

// Dynamically import the client-side IDE component with no SSR
const AgentAcademyIDEClient = dynamic(
  () => import('./AgentAcademyIDE-Client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-slate-900 text-green-400 flex flex-col font-mono">
        {/* Loading Header */}
        <div className="bg-slate-800 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-bold">AGENT ACADEMY IDE</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-green-300">LOADING...</span>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-400 mx-auto mb-4" />
            <div className="text-green-300 text-lg mb-2">Initializing Agent Academy IDE</div>
            <div className="text-green-500/70 text-sm">Loading Python runtime and AI assistant...</div>
          </div>
        </div>
      </div>
    )
  }
)

export default function AgentAcademyIDE({
  initialCode = '# Welcome to Agent Academy IDE\n# Build your AI agent here\n\nprint("Hello, Agent!")\n',
  lesson,
  onCodeChange,
  onAIGenerate
}: AgentAcademyIDEProps) {
  return (
    <AgentAcademyIDEClient
      initialCode={initialCode}
      lesson={lesson}
      onCodeChange={onCodeChange}
      onAIGenerate={onAIGenerate}
    />
  )
}