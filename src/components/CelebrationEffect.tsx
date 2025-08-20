'use client'

import { useEffect } from 'react'

interface CelebrationEffectProps {
  trigger: boolean
  message?: string
  onComplete?: () => void
}

export default function CelebrationEffect({ trigger, message = "Congratulations!", onComplete }: CelebrationEffectProps) {
  useEffect(() => {
    if (trigger) {
      // Dynamic import to avoid SSR issues
      import('canvas-confetti').then((confetti) => {
        // Burst of confetti
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
        })

        // Second burst after delay
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
          })
        }, 300)

        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#45B7D1', '#96CEB4', '#FECA57']
          })
        }, 500)

        // Call completion callback
        if (onComplete) {
          setTimeout(onComplete, 2000)
        }
      }).catch(error => {
        console.warn('Could not load confetti library:', error)
        if (onComplete) onComplete()
      })
    }
  }, [trigger, onComplete])

  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce border-4 border-white">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-xl font-bold">{message}</div>
        </div>
      </div>
    </div>
  )
}