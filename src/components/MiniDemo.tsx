'use client'

import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

interface MiniDemoProps {
  title: string
  description: string
  demoContent: React.ReactNode
  emoji?: string
}

export default function MiniDemo({ title, description, demoContent, emoji }: MiniDemoProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="my-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <Play className="h-6 w-6 text-green-400" />
        <h4 className="text-green-300 font-semibold">{title}</h4>
      </div>
      
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setIsActive(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Try It
        </button>
        <button
          onClick={() => setIsActive(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      {isActive && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
          {demoContent}
        </div>
      )}
    </div>
  )
}