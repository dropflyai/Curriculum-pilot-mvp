'use client'

import { Check } from 'lucide-react'

interface ProgressTrackerProps {
  sections: string[]
  completedSections: number
}

export default function LearningProgressTracker({ sections, completedSections }: ProgressTrackerProps) {
  const progress = (completedSections / sections.length) * 100

  return (
    <div className="mb-8 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl p-6 border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-300 font-semibold">Learning Progress</h3>
        <span className="text-white font-bold">{completedSections} / {sections.length}</span>
      </div>
      
      <div className="relative w-full bg-gray-700 rounded-full h-3 mb-4">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded ${
              index < completedSections ? 'text-cyan-300' : 'text-gray-400'
            }`}
          >
            {index < completedSections ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <div className="h-3 w-3 border border-gray-500 rounded-full"></div>
            )}
            <span className="truncate">{section}</span>
          </div>
        ))}
      </div>
    </div>
  )
}