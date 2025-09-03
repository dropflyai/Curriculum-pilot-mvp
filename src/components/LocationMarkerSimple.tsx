import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface LocationMarkerProps {
  position: [number, number, number]
  name: string
  type: string
  unlocked: boolean
  completed: boolean
  onClick: () => void
  lore?: string
  missionNumber: number
}

export function LocationMarker({
  position,
  name,
  type,
  unlocked,
  completed,
  onClick,
  lore,
  missionNumber
}: LocationMarkerProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  // Safe position validation
  const safePosition: [number, number, number] = [
    typeof position?.[0] === 'number' ? position[0] : 0,
    typeof position?.[1] === 'number' ? position[1] : 0, 
    typeof position?.[2] === 'number' ? position[2] : 0
  ]

  // Simple floating animation
  useFrame((state) => {
    if (meshRef.current && unlocked && state?.clock?.elapsedTime) {
      const time = state.clock.elapsedTime
      const baseY = safePosition[1]
      meshRef.current.position.y = baseY + Math.sin(time * 2 + missionNumber) * 0.3
    }
  })

  const iconColor = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
  const glowColor = completed ? '#10b981' : unlocked ? '#60a5fa' : '#374151'
  
  const getMissionIcon = () => {
    switch(type) {
      case 'castle': return '🎓'
      case 'village': return '📦'
      case 'tower': return '🏗️'
      case 'mountain': return '⛰️'
      case 'forest': return '⚡'
      case 'dungeon': return '🗃️'
      default: return '💻'
    }
  }
  
  const getMissionDescription = () => {
    switch(type) {
      case 'castle': return 'Python Fundamentals'
      case 'village': return 'Variables & Data'
      case 'tower': return 'Logic & Conditions'
      case 'mountain': return 'Loops & Repetition'
      case 'forest': return 'Functions'
      case 'dungeon': return 'Database Management'
      default: return 'Programming'
    }
  }

  return (
    <group position={safePosition}>
      {/* Debug marker - bright red sphere to show position */}
      <mesh position={[0, 0, 50]}>
        <sphereGeometry args={[5]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Base marker - much larger and closer to camera */}
        <mesh position={[0, 0, 10]}>
          <cylinderGeometry args={[25, 30, 8]} />
          <meshStandardMaterial 
            color={iconColor}
            emissive={glowColor}
            emissiveIntensity={hovered ? 1.0 : 0.6}
          />
        </mesh>
        
        {/* Mission number - larger and closer */}
        <mesh position={[0, 5, 12]}>
          <cylinderGeometry args={[20, 20, 2]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Mission icon shape - much larger and closer */}
        <mesh position={[0, 25, 15]}>
          {type === 'castle' && <coneGeometry args={[15, 25]} />}
          {type === 'village' && <boxGeometry args={[20, 20, 20]} />}
          {type === 'tower' && <cylinderGeometry args={[10, 10, 30]} />}
          {type === 'mountain' && <coneGeometry args={[18, 30]} />}
          {type === 'forest' && <sphereGeometry args={[15]} />}
          {type === 'dungeon' && <octahedronGeometry args={[18]} />}
          <meshStandardMaterial 
            color={iconColor} 
            emissive={glowColor} 
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Status ring - larger and closer */}
        <mesh position={[0, -5, 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[35, 40]} />
          <meshBasicMaterial 
            color={glowColor} 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Completion/Lock indicator - larger and closer */}
        {completed && (
          <mesh position={[0, 40, 20]}>
            <sphereGeometry args={[8]} />
            <meshBasicMaterial 
              color="#10b981" 
              emissive="#10b981"
              emissiveIntensity={0.7}
            />
          </mesh>
        )}
        
        {!unlocked && (
          <mesh position={[0, 40, 20]}>
            <boxGeometry args={[10, 12, 6]} />
            <meshBasicMaterial 
              color="#ef4444"
              emissive="#ef4444" 
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
        
        {/* Glow effect */}
        {hovered && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[30]} />
            <meshBasicMaterial 
              color={glowColor} 
              transparent 
              opacity={0.2}
            />
          </mesh>
        )}
      </group>
      
      {/* Tooltip */}
      {hovered && (
        <Html center distanceFactor={15}>
          <div className="bg-slate-900/95 px-6 py-4 rounded-xl border-2 border-blue-500/70 max-w-sm shadow-2xl">
            <div className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">{getMissionIcon()}</span>
              Mission {missionNumber}: {name}
            </div>
            <div className="text-yellow-300 font-semibold text-sm mb-2">
              {getMissionDescription()}
            </div>
            <div className="text-gray-300 text-sm mb-3 leading-relaxed">
              {lore || 'Programming mission awaits...'}
            </div>
            <div className="text-gray-400 text-sm font-medium">
              {completed ? '✅ Mission Completed!' : 
               unlocked ? '🎯 Click to Start Mission' : 
               '🔒 Complete previous missions to unlock'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}