'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Check, Lock } from 'lucide-react'

interface SectionNavigatorProps {
  sections: string[]
  currentSection: number
  completedSections: number
  onSectionSelect: (sectionIndex: number) => void
}

export default function InteractiveSectionNavigator({ 
  sections, 
  currentSection, 
  completedSections, 
  onSectionSelect 
}: SectionNavigatorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getSectionStatus = (index: number) => {
    if (index < completedSections) return 'completed'
    if (index === completedSections) return 'current'
    if (index === completedSections + 1) return 'next'
    return 'locked'
  }

  const getSectionIcon = (index: number, status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-400" />
      case 'current':
        return <ChevronRight className="h-4 w-4 text-cyan-400 animate-pulse" />
      case 'next':
        return <ChevronDown className="h-4 w-4 text-yellow-400" />
      default:
        return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const getSectionColors = (index: number, status: string, isHovered: boolean) => {
    const baseClasses = "transition-all duration-300 transform"
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50 text-green-300 ${isHovered ? 'scale-105 shadow-lg shadow-green-500/25' : ''}`
      case 'current':
        return `${baseClasses} bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/50 text-cyan-300 ${isHovered ? 'scale-105 shadow-lg shadow-cyan-500/25' : 'animate-pulse'}`
      case 'next':
        return `${baseClasses} bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50 text-yellow-300 ${isHovered ? 'scale-105 shadow-lg shadow-yellow-500/25' : ''} cursor-pointer hover:bg-yellow-500/20`
      default:
        return `${baseClasses} bg-gray-800/50 border-gray-600/50 text-gray-400 cursor-not-allowed`
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        Interactive Learning Path
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map((section, index) => {
          const status = getSectionStatus(index)
          const isHovered = hoveredIndex === index
          const isClickable = status === 'current' || status === 'next' || status === 'completed'
          
          return (
            <button
              key={index}
              onClick={() => isClickable && onSectionSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={!isClickable}
              className={`p-4 rounded-xl border-2 text-left ${getSectionColors(index, status, isHovered)}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {getSectionIcon(index, status)}
                <span className="text-sm font-semibold">
                  {index + 1}. {section}
                </span>
              </div>
              
              <div className="text-xs opacity-80">
                {status === 'completed' && 'Complete ✨'}
                {status === 'current' && 'In Progress...'}
                {status === 'next' && 'Ready to unlock!'}
                {status === 'locked' && 'Complete previous sections'}
              </div>
              
              {isHovered && isClickable && (
                <div className="mt-2 text-xs bg-black/30 rounded px-2 py-1">
                  Click to jump to this section
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">{completedSections} Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{sections.length - completedSections - 1} Locked</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg px-3 py-1">
          <span className="text-cyan-300 text-sm font-semibold">
            {Math.round((completedSections / sections.length) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  )
}