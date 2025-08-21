'use client'

import { useState } from 'react'

interface HoverDefinitionProps {
  term: string
  definition: string
  children: React.ReactNode
}

export default function HoverDefinition({ term, definition, children }: HoverDefinitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="text-cyan-300 font-semibold border-b border-cyan-500/50 border-dotted cursor-help">
        {children}
      </span>
      
      {isVisible && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl">
          <div className="text-cyan-300 font-semibold text-sm mb-1">{term}</div>
          <div className="text-gray-300 text-sm leading-relaxed">{definition}</div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  )
}