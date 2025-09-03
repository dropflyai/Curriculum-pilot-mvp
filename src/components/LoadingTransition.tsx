'use client'

import { useEffect, useState } from 'react'
import { Rocket, Sparkles, Code, Star, Trophy, Zap } from 'lucide-react'

interface LoadingTransitionProps {
  isVisible: boolean
  message?: string
  onComplete?: () => void
}

export default function LoadingTransition({ isVisible, message = "Loading...", onComplete }: LoadingTransitionProps) {
  const [progress, setProgress] = useState(0)
  const [currentIcon, setCurrentIcon] = useState(0)
  
  const icons = [Rocket, Sparkles, Code, Star, Trophy, Zap]
  const loadingMessages = [
    "🚀 Preparing your coding adventure...",
    "✨ Loading amazing content...",
    "💻 Setting up your workspace...",
    "⭐ Almost ready to code...",
    "🏆 Finalizing your experience...",
    "⚡ Ready to take flight!"
  ]

  useEffect(() => {
    if (!isVisible) return

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const iconTimer = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length)
    }, 600)

    return () => {
      clearInterval(progressTimer)
      clearInterval(iconTimer)
    }
  }, [isVisible, onComplete, icons.length])

  if (!isVisible) return null

  const CurrentIcon = icons[currentIcon]

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      </div>
      
      <div className="text-center relative z-10 max-w-md mx-auto px-8">
        {/* Main Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-purple-400 animate-pulse" />
              <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 animate-pulse" />
              <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-full p-8 border border-purple-500/30">
              <CurrentIcon className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>
        </div>
        
        {/* Loading Message */}
        <h2 className="text-2xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
            {loadingMessages[Math.floor((progress / 100) * loadingMessages.length)] || message}
          </span>
        </h2>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mt-2">
            <span>CodeFly</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Floating Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Fun Footer */}
        <p className="text-gray-300 text-sm mt-6 animate-pulse">
          Preparing an epic coding experience just for you! ✨
        </p>
      </div>
    </div>
  )
}