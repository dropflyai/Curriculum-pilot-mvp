'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Zap, Shield, AlertTriangle, Activity, Cpu, Lock, Radio } from 'lucide-react'

interface Dialogue {
  character: string
  text: string
  image: string
  emotion?: 'neutral' | 'confident' | 'encouraging' | 'serious' | 'alert'
  effect?: 'glitch' | 'pulse' | 'shake' | 'zoom'
}

interface CinematicCutsceneProps {
  dialogues: Dialogue[]
  backgroundImage?: string
  onComplete: () => void
}

export default function CinematicCutscene({ dialogues, backgroundImage, onComplete }: CinematicCutsceneProps) {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [showCharacter, setShowCharacter] = useState(false)
  const [textRevealed, setTextRevealed] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showEffects, setShowEffects] = useState(true)
  
  const dialogue = dialogues[currentDialogue]

  // Typewriter effect for dialogue text
  useEffect(() => {
    if (!dialogue) return
    
    setTextRevealed('')
    setIsTyping(true)
    let currentIndex = 0
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= dialogue.text.length) {
        setTextRevealed(dialogue.text.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 20) // Faster typing for urgency

    return () => clearInterval(typeInterval)
  }, [currentDialogue, dialogue])

  // Auto-advance with dramatic timing
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        if (currentDialogue < dialogues.length - 1) {
          setCurrentDialogue(prev => prev + 1)
          setShowCharacter(false)
          setTimeout(() => setShowCharacter(true), 200)
        } else {
          onComplete()
        }
      }, 5000) // Give time to read
      
      return () => clearTimeout(timer)
    }
  }, [isTyping, currentDialogue, dialogues.length, onComplete])

  // Character entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setShowCharacter(true), 300)
    return () => clearTimeout(timer)
  }, [currentDialogue])

  const skipToEnd = () => {
    if (isTyping) {
      setTextRevealed(dialogue.text)
      setIsTyping(false)
    } else {
      onComplete()
    }
  }

  const nextDialogue = () => {
    if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(prev => prev + 1)
      setShowCharacter(false)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Cinematic background with parallax effect */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={backgroundImage ? {
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: '120%',
          backgroundPosition: `${50 + currentDialogue * 5}% ${50 + currentDialogue * 3}%`,
          filter: 'brightness(0.4) contrast(1.2)',
          transform: `scale(${1 + currentDialogue * 0.02})`
        } : {}}
      />

      {/* Animated overlay effects */}
      <div className="absolute inset-0">
        {/* Subtle background gradient - no scanning lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Alert indicators */}
        {dialogue?.emotion === 'serious' && (
          <div className="absolute top-10 right-10 animate-pulse">
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-900/50 border border-red-500 rounded">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-400 font-mono text-sm">THREAT LEVEL: CRITICAL</span>
            </div>
          </div>
        )}

        {/* System status */}
        <div className="absolute top-10 left-10 space-y-2">
          <div className="flex items-center space-x-2 px-3 py-1 bg-black/50 border border-cyan-500/30 rounded">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-mono text-xs">SYSTEM: ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-black/50 border border-green-500/30 rounded">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-xs">FIREWALL: ENGAGED</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-black/50 border border-purple-500/30 rounded">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-mono text-xs">AI CORE: INITIALIZING</span>
          </div>
        </div>

        {/* Holographic grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        {/* Corner brackets for cinematic framing */}
        <div className="absolute top-5 left-5 w-20 h-20 border-l-2 border-t-2 border-cyan-400/50" />
        <div className="absolute top-5 right-5 w-20 h-20 border-r-2 border-t-2 border-cyan-400/50" />
        <div className="absolute bottom-5 left-5 w-20 h-20 border-l-2 border-b-2 border-cyan-400/50" />
        <div className="absolute bottom-5 right-5 w-20 h-20 border-r-2 border-b-2 border-cyan-400/50" />
      </div>

      {/* Main content */}
      <div className="relative h-full flex items-center justify-center px-8">
        <div className="max-w-6xl w-full">
          
          {/* Character display with holographic effect */}
          {dialogue?.image && (
            <div className={`transition-all duration-700 mb-8 ${
              showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="relative inline-block w-full">
                {/* Character image - clean and stable */}
                <div className="relative mx-auto w-[500px] h-[500px]">                  
                  <img 
                    src={dialogue.image} 
                    alt={dialogue.character}
                    className="w-full h-full object-contain relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.4))',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dialogue box with futuristic design */}
          <div className="relative mt-20">
            {/* Connection lines */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-px h-10 bg-gradient-to-b from-transparent to-cyan-400" />
            
            <div className="relative bg-black/90 backdrop-blur-xl border border-cyan-500/30 overflow-hidden">
              {/* Animated border gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 animate-gradient-x" />
              
              <div className="relative p-6">
                {/* Header with transmission status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-cyan-400 font-mono text-xs tracking-wider">SECURE TRANSMISSION</span>
                    <Lock className="w-3 h-3 text-green-400" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-cyan-400/70 font-mono text-xs">
                      MSG {currentDialogue + 1}/{dialogues.length}
                    </span>
                    <button
                      onClick={skipToEnd}
                      className="text-cyan-400/70 hover:text-cyan-300 text-xs font-mono transition-colors"
                    >
                      [SKIP]
                    </button>
                  </div>
                </div>
                
                {/* Dialogue text with typewriter effect */}
                <div className="min-h-[80px]">
                  <p className="text-lg text-white leading-relaxed font-mono">
                    {textRevealed}
                    {isTyping && <span className="animate-blink">▊</span>}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    {dialogues.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 transition-all duration-300 ${
                          index === currentDialogue 
                            ? 'w-8 bg-cyan-400' 
                            : index < currentDialogue 
                            ? 'w-2 bg-cyan-400/50' 
                            : 'w-2 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {!isTyping && (
                    <button
                      onClick={nextDialogue}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 hover:border-cyan-400 transition-all group"
                    >
                      <span className="text-cyan-400 font-mono text-sm">
                        {currentDialogue === dialogues.length - 1 ? 'BEGIN MISSION' : 'CONTINUE'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes scan-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes digital-rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes zoom-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-scan-slow {
          animation: scan-slow 6s linear infinite;
        }
        
        .animate-digital-rain {
          animation: digital-rain 15s linear infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        
        .animate-zoom-in {
          animation: zoom-in 1s ease-out;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}