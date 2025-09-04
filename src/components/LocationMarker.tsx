import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Simple fallback marker
function SimpleFallbackMarker({ position, name }: { position: [number, number, number], name: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <Html center distanceFactor={15}>
        <div className="bg-slate-900/95 px-4 py-2 rounded-lg border border-blue-500/50 text-white text-sm">
          {name || 'Mission'}
        </div>
      </Html>
    </group>
  )
}

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
  const meshRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  
  // Error boundary check
  if (!position || !Array.isArray(position) || position.length !== 3) {
    console.warn('Invalid position for LocationMarker:', position)
    return <SimpleFallbackMarker position={[0, 0, 0]} name={name || 'Mission'} />
  }
  
  // Safety wrapper for the entire component
  try {
  
  // Simple floating animation
  useFrame((state, delta) => {
    if (meshRef.current && unlocked) {
      try {
        const time = state?.clock?.elapsedTime ?? 0
        const baseY = safePosition[1]
        const offset = (missionNumber ?? 1) * 0.5
        meshRef.current.position.y = baseY + Math.sin(time * 1.5 + offset) * 0.3
      } catch (error) {
        console.warn('Animation error:', error)
      }
    }
  })

  const iconColor = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
  const glowColor = completed ? '#10b981' : unlocked ? '#60a5fa' : '#374151'
  
  const getMissionTypeIcon = (missionType?: string) => {
    if (!missionType) return '💻'
    switch(missionType) {
      case 'castle': return '🎓'
      case 'village': return '📦'
      case 'tower': return '🏗️'
      case 'mountain': return '🔄'
      case 'forest': return '⚡'
      case 'dungeon': return '🗃️'
      default: return '💻'
    }
  }
  
  const getMissionTypeDescription = (missionType?: string) => {
    if (!missionType) return 'Programming Concepts'
    switch(missionType) {
      case 'castle': return 'Learn Python Fundamentals'
      case 'village': return 'Master Variables & Data Storage'
      case 'tower': return 'Conditional Logic & Decision Making'
      case 'mountain': return 'Loops & Repetition'
      case 'forest': return 'Functions & Code Organization'
      case 'dungeon': return 'Database & Data Management'
      default: return 'Programming Concepts'
    }
  }

  // Ensure position is valid
  const safePosition: [number, number, number] = [
    Array.isArray(position) && typeof position[0] === 'number' ? position[0] : 0,
    Array.isArray(position) && typeof position[1] === 'number' ? position[1] : 0, 
    Array.isArray(position) && typeof position[2] === 'number' ? position[2] : 0
  ]
  
  return (
    <group position={safePosition}>
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Mission marker base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[12, 15, 4, 8]} />
          <meshStandardMaterial 
            color={iconColor}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Mission number display */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[9, 9, 1, 8]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Large mission number text background */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[8, 8, 0.2, 8]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Simplified mission type indicator */}
        <mesh position={[0, 12, 0]}>
          {type === 'castle' && <coneGeometry args={[6, 12, 4]} />}
          {type === 'village' && <boxGeometry args={[8, 8, 8]} />}
          {type === 'tower' && <cylinderGeometry args={[4, 4, 16, 8]} />}
          {type === 'mountain' && <coneGeometry args={[7, 16, 3]} />}
          {type === 'forest' && <sphereGeometry args={[6, 12, 8]} />}
          {type === 'dungeon' && <octahedronGeometry args={[7]} />}
          <meshStandardMaterial 
            color={iconColor} 
            emissive={glowColor} 
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Programming concept symbol */}
        <mesh position={[0, 20, 0]}>
          {/* Python/Code Symbol */}
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color="#3776ab"
            emissive="#3776ab"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Large status indicator rings */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[17, 20, 32]} />
          <meshBasicMaterial 
            color={glowColor}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        {/* Inner pulse ring */}
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[14, 16, 32]} />
          <meshBasicMaterial 
            color={iconColor}
            transparent
            opacity={hovered ? 0.8 : 0.4}
          />
        </mesh>
        
        {/* Large completion checkmark */}
        {completed && (
          <mesh position={[0, 22, 0]}>
            <sphereGeometry args={[3]} />
            <meshStandardMaterial 
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.6}
            />
          </mesh>
        )}
        
        {/* Large lock indicator for locked missions */}
        {!unlocked && (
          <mesh position={[0, 22, 0]}>
            <boxGeometry args={[4, 5, 2]} />
            <meshBasicMaterial 
              color="#ef4444"
            />
          </mesh>
        )}
        
        {/* Large glow effect when hovered */}
        {hovered && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[25, 16, 16]} />
            <meshBasicMaterial 
              color={glowColor}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
        
        {/* Mission type label floating above */}
        {hovered && (
          <mesh position={[0, 25, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={0.9}
            />
          </mesh>
        )}
      </group>
      
      {/* Enhanced tooltip with mission type explanation */}
      {hovered && (
        <Html center distanceFactor={15}>
          <div className="bg-slate-900/95 px-6 py-4 rounded-xl border-2 border-blue-500/70 max-w-sm shadow-2xl">
            <div className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
              {getMissionTypeIcon(type)}
              Mission {missionNumber}: {name}
            </div>
            <div className="text-yellow-300 font-semibold text-sm mb-2">
              {getMissionTypeDescription(type)}
            </div>
            <div className="text-gray-300 text-sm mb-3 leading-relaxed">
              {lore || 'Programming mission awaits...'}
            </div>
            <div className="text-gray-400 text-sm font-medium">
              {completed ? '✅ Mission Completed!' : unlocked ? '🎯 Click to Start Mission' : '🔒 Complete previous missions to unlock'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
  } catch (error) {
    console.error('LocationMarker error:', error)
    return <SimpleFallbackMarker position={position} name={name || 'Mission'} />
  }
}