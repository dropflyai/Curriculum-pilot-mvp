'use client'

import { useEffect, useState } from 'react'
import ParticleEffects from './ParticleEffects'

interface EnhancedLoadingScreenProps {
  isVisible: boolean
  message?: string
  subMessage?: string
  progress?: number
  onComplete?: () => void
  duration?: number
  className?: string
}

export default function EnhancedLoadingScreen({
  isVisible,
  message = "INITIALIZING MISSION PROTOCOL",
  subMessage = "Establishing secure connection to Command Center...",
  progress = 0,
  onComplete,
  duration = 3000,
  className = ''
}: EnhancedLoadingScreenProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const loadingPhases = [
    { message: "INITIALIZING MISSION PROTOCOL", sub: "Establishing secure connection to Command Center...", color: "blue" },
    { message: "AUTHENTICATING AGENT CREDENTIALS", sub: "Verifying clearance level and permissions...", color: "green" },
    { message: "LOADING TACTICAL INTERFACE", sub: "Rendering HUD elements and mission data...", color: "purple" },
    { message: "DEPLOYMENT READY", sub: "All systems operational. Welcome back, Agent.", color: "yellow" }
  ]

  useEffect(() => {
    if (!isVisible) {
      setCurrentProgress(0)
      setCurrentPhase(0)
      return
    }

    setIsAnimating(true)
    const progressIncrement = 100 / (duration / 100)
    const phaseInterval = duration / loadingPhases.length

    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        const newProgress = Math.min(prev + progressIncrement, 100)
        
        // Update phase based on progress
        const newPhase = Math.min(Math.floor(newProgress / 25), loadingPhases.length - 1)
        setCurrentPhase(newPhase)
        
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setIsAnimating(false)
            onComplete?.()
          }, 500)
        }
        
        return newProgress
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
    }
  }, [isVisible, duration, onComplete])

  if (!isVisible && !isAnimating) return null

  const currentPhaseData = loadingPhases[currentPhase]

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } ${className}`}>
      <ParticleEffects type="ambient" count={15} />
      
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="text-green-400 font-mono text-xs leading-3 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
              {Array.from({ length: 100 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto p-8">
        {/* Main Logo/Title */}
        <div className="space-y-4">
          <div className="text-6xl font-mono font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            CODEFLY
          </div>
          <div className="text-lg text-gray-300 font-mono tracking-wider">
            TACTICAL PROGRAMMING INTERFACE v2.1
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r opacity-20 rounded-lg blur-sm ${
            currentPhaseData.color === 'blue' ? 'from-blue-600 to-blue-400' :
            currentPhaseData.color === 'green' ? 'from-green-600 to-green-400' :
            currentPhaseData.color === 'purple' ? 'from-purple-600 to-purple-400' :
            'from-yellow-600 to-yellow-400'
          }`}></div>
          
          <div className={`relative border-2 rounded-lg p-6 backdrop-blur-lg ${
            currentPhaseData.color === 'blue' ? 'border-blue-400/60 bg-blue-900/20' :
            currentPhaseData.color === 'green' ? 'border-green-400/60 bg-green-900/20' :
            currentPhaseData.color === 'purple' ? 'border-purple-400/60 bg-purple-900/20' :
            'border-yellow-400/60 bg-yellow-900/20'
          }`}>
            {/* Phase Steps */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {loadingPhases.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 transition-all duration-500 ${
                    index <= currentPhase ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                    index < currentPhase 
                      ? 'bg-green-400 border-green-400 animate-pulse' 
                      : index === currentPhase 
                        ? `bg-${currentPhaseData.color}-400 border-${currentPhaseData.color}-400 animate-pulse`
                        : 'border-gray-500 bg-transparent'
                  }`}></div>
                  {index < loadingPhases.length - 1 && (
                    <div className={`w-8 h-0.5 transition-all duration-500 ${
                      index < currentPhase ? 'bg-green-400' : 'bg-gray-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Current Phase Info */}
            <div className="space-y-3">
              <div className={`text-xl font-mono font-bold animate-fade-in ${
                currentPhaseData.color === 'blue' ? 'text-blue-400' :
                currentPhaseData.color === 'green' ? 'text-green-400' :
                currentPhaseData.color === 'purple' ? 'text-purple-400' :
                'text-yellow-400'
              }`}>
                [{currentPhase + 1}/4] {currentPhaseData.message}
              </div>
              <div className="text-gray-300 font-mono text-sm animate-fade-in">
                {currentPhaseData.sub}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">PROGRESS</span>
                <span className={`${
                  currentPhaseData.color === 'blue' ? 'text-blue-400' :
                  currentPhaseData.color === 'green' ? 'text-green-400' :
                  currentPhaseData.color === 'purple' ? 'text-purple-400' :
                  'text-yellow-400'
                }`}>
                  {Math.round(currentProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 h-4 rounded-full border border-gray-600 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out relative ${
                    currentPhaseData.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-400' :
                    currentPhaseData.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-400' :
                    currentPhaseData.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-400' :
                    'bg-gradient-to-r from-yellow-600 to-yellow-400'
                  }`}
                  style={{ width: `${currentProgress}%` }}
                >
                  <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                STATUS: [{'█'.repeat(Math.floor(currentProgress/5))}{'▓'.repeat(Math.floor((100-currentProgress)/5))}] LOADING...
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-black/40 border border-green-400/30 p-3 rounded">
            <div className="text-green-400 font-bold">SYSTEMS</div>
            <div className="text-green-300">ONLINE</div>
          </div>
          <div className="bg-black/40 border border-blue-400/30 p-3 rounded">
            <div className="text-blue-400 font-bold">NETWORK</div>
            <div className="text-blue-300">SECURE</div>
          </div>
          <div className="bg-black/40 border border-purple-400/30 p-3 rounded">
            <div className="text-purple-400 font-bold">AGENT</div>
            <div className="text-purple-300">VERIFIED</div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map(i => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full animate-loading-dots ${
                currentPhaseData.color === 'blue' ? 'bg-blue-500' :
                currentPhaseData.color === 'green' ? 'bg-green-500' :
                currentPhaseData.color === 'purple' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`}
              style={{animationDelay: `${i * 0.2}s`}}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}