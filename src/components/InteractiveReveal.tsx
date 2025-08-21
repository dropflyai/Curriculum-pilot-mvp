'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface InteractiveRevealProps {
  title: string
  children: React.ReactNode
  buttonText: string
  emoji?: string
}

export default function InteractiveReveal({ title, children, buttonText, emoji }: InteractiveRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="my-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 overflow-hidden">
      <button
        onClick={() => setIsRevealed(!isRevealed)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          {emoji && <span className="text-2xl">{emoji}</span>}
          <span className="text-cyan-300 font-semibold">{buttonText}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-300">
          {isRevealed ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>
      
      {isRevealed && (
        <div className="px-4 pb-4 border-t border-blue-500/20 animate-fade-in">
          <div className="mt-4 text-blue-100">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}