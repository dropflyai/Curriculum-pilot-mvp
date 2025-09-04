'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

interface ParticleEffectsProps {
  type?: 'success' | 'xp-gain' | 'achievement' | 'ambient'
  trigger?: boolean
  count?: number
  colors?: string[]
  className?: string
}

export default function ParticleEffects({ 
  type = 'ambient', 
  trigger = false, 
  count = 15,
  colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
  className = ''
}: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticle = (x?: number, y?: number): Particle => {
    const baseX = x ?? Math.random() * window.innerWidth
    const baseY = y ?? Math.random() * window.innerHeight
    
    return {
      id: Math.random(),
      x: baseX,
      y: baseY,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      life: 0,
      maxLife: 60 + Math.random() * 60
    }
  }

  const createBurst = (x: number, y: number, particleCount: number) => {
    const burstParticles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 4
      return {
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 0,
        maxLife: 40 + Math.random() * 40
      }
    })
    
    setParticles(prev => [...prev, ...burstParticles])
  }

  // Trigger particle effects based on type
  useEffect(() => {
    if (!trigger) return

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    switch (type) {
      case 'success':
        createBurst(centerX, centerY - 100, 20)
        break
      case 'xp-gain':
        createBurst(centerX + 200, 100, 15)
        break
      case 'achievement':
        createBurst(centerX, centerY - 150, 30)
        break
      case 'ambient':
        setParticles(Array.from({ length: count }, () => createParticle()))
        break
    }
  }, [trigger, type, count])

  // Animation loop
  useEffect(() => {
    if (type === 'ambient') {
      setParticles(Array.from({ length: count }, () => createParticle()))
    }

    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life + 1,
            opacity: Math.max(0, 1 - (particle.life / particle.maxLife))
          }))
          .filter(particle => 
            particle.life < particle.maxLife && 
            particle.opacity > 0 &&
            particle.x > -50 && particle.x < window.innerWidth + 50 &&
            particle.y > -50 && particle.y < window.innerHeight + 50
          )
      })
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [type, count])

  // Add new ambient particles occasionally
  useEffect(() => {
    if (type !== 'ambient') return

    const interval = setInterval(() => {
      setParticles(prev => {
        if (prev.length < count) {
          return [...prev, createParticle()]
        }
        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [type, count])

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle absolute rounded-full animate-particle-float"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: `scale(${0.5 + (particle.opacity * 0.5)})`
          }}
        />
      ))}
    </div>
  )
}