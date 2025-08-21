'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

interface CompactLearningSectionProps {
  title: string
  emoji: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  isCompleted: boolean
  isActive: boolean
  colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'yellow' | 'red'
}

export default function CompactLearningSection({
  title,
  emoji,
  children,
  isExpanded,
  onToggle,
  isCompleted,
  isActive,
  colorScheme
}: CompactLearningSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    blue: {
      bg: 'from-blue-900/20 to-cyan-900/20',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      hover: 'hover:from-blue-900/30 hover:to-cyan-900/30 hover:shadow-blue-500/25'
    },
    purple: {
      bg: 'from-purple-900/20 to-pink-900/20',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
      hover: 'hover:from-purple-900/30 hover:to-pink-900/30 hover:shadow-purple-500/25'
    },
    green: {
      bg: 'from-green-900/20 to-emerald-900/20',
      border: 'border-green-500/30',
      text: 'text-green-300',
      hover: 'hover:from-green-900/30 hover:to-emerald-900/30 hover:shadow-green-500/25'
    },
    orange: {
      bg: 'from-orange-900/20 to-red-900/20',
      border: 'border-orange-500/30',
      text: 'text-orange-300',
      hover: 'hover:from-orange-900/30 hover:to-red-900/30 hover:shadow-orange-500/25'
    },
    pink: {
      bg: 'from-pink-900/20 to-rose-900/20',
      border: 'border-pink-500/30',
      text: 'text-pink-300',
      hover: 'hover:from-pink-900/30 hover:to-rose-900/30 hover:shadow-pink-500/25'
    },
    yellow: {
      bg: 'from-yellow-900/20 to-amber-900/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-300',
      hover: 'hover:from-yellow-900/30 hover:to-amber-900/30 hover:shadow-yellow-500/25'
    },
    red: {
      bg: 'from-red-900/20 to-pink-900/20',
      border: 'border-red-500/30',
      text: 'text-red-300',
      hover: 'hover:from-red-900/30 hover:to-pink-900/30 hover:shadow-red-500/25'
    }
  }

  const colors = colorClasses[colorScheme]

  return (
    <div 
      className={`bg-gradient-to-r ${colors.bg} ${colors.hover} rounded-2xl border ${colors.border} transition-all duration-300 mb-6 ${
        isActive ? 'ring-2 ring-cyan-400/50 shadow-2xl' : ''
      } ${isHovered ? 'shadow-xl transform scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-bounce">{emoji}</span>
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-3`}>
              {title}
              {isCompleted && <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isCompleted ? 'Section completed! ✨' : isExpanded ? 'Click to collapse' : 'Click to expand and learn'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isCompleted && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
              <span className="text-green-300 text-sm font-semibold">Complete</span>
            </div>
          )}
          {isActive && !isCompleted && (
            <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-full px-3 py-1">
              <span className="text-cyan-300 text-sm font-semibold">Current</span>
            </div>
          )}
          <div className={`p-2 rounded-full ${colors.text} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </button>

      {/* Section Content - Collapsible */}
      {isExpanded && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="border-t border-white/10 pt-6">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}