import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface LocationMedallionProps {
  position: [number, number, number]
  name: string
  type: string
  unlocked: boolean
  completed: boolean
  onClick: () => void
  lore?: string
  missionNumber: number
}

export function LocationMedallion({
  position,
  name,
  type,
  unlocked,
  completed,
  onClick,
  lore,
  missionNumber
}: LocationMedallionProps) {
  const [hovered, setHovered] = useState(false)
  const medallionRef = useRef<THREE.Group>(null)
  
  // Safety checks
  if (!position || !Array.isArray(position) || position.length !== 3) {
    return null
  }
  
  // Subtle floating animation
  useFrame((state) => {
    if (medallionRef.current && unlocked) {
      const time = state.clock.elapsedTime
      medallionRef.current.position.y = position[1] + Math.sin(time + missionNumber) * 0.5
      medallionRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
    }
  })
  
  // Professional color scheme
  const baseColor = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
  const glowColor = completed ? '#34d399' : unlocked ? '#60a5fa' : '#9ca3af'
  
  // Mission type icons
  const getTypeColor = () => {
    switch(type) {
      case 'castle': return '#f59e0b' // Golden
      case 'village': return '#8b5cf6' // Purple  
      case 'tower': return '#06b6d4' // Cyan
      case 'mountain': return '#ef4444' // Red
      case 'forest': return '#10b981' // Green
      case 'dungeon': return '#f97316' // Orange
      default: return '#6b7280'
    }
  }
  
  return (
    <group position={position}>
      <group
        ref={medallionRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Medallion base - elegant circular design */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[4, 4, 0.5, 32]} />
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.8}
            roughness={0.2}
            emissive={baseColor}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>
        
        {/* Inner medallion detail */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[3, 3, 0.2, 32]} />
          <meshStandardMaterial 
            color={getTypeColor()}
            metalness={0.9}
            roughness={0.1}
            emissive={getTypeColor()}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Mission number emboss */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        
        {/* Status indicator ring */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.8, 32]} />
          <meshBasicMaterial 
            color={glowColor}
            transparent
            opacity={hovered ? 0.8 : 0.5}
          />
        </mesh>
        
        {/* Completion star */}
        {completed && (
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.8, 8, 6]} />
            <meshBasicMaterial 
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
        
        {/* Lock indicator */}
        {!unlocked && (
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1.2, 0.5]} />
            <meshBasicMaterial 
              color="#ef4444"
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
        
        {/* Subtle glow effect */}
        {hovered && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[6, 6, 0.1, 32]} />
            <meshBasicMaterial 
              color={glowColor}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
      </group>
      
      {/* Professional tooltip */}
      {hovered && (
        <Html center distanceFactor={8}>
          <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-600/50 shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getTypeColor() }}
              />
              <span className="text-white font-semibold text-sm">
                Mission {missionNumber}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-sm mb-1">
              {name}
            </div>
            <div className="text-slate-400 text-xs mb-3 leading-relaxed">
              {lore || 'Programming mission awaits...'}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {completed ? (
                <>
                  <span className="text-green-400">✅</span>
                  <span className="text-green-300">Completed</span>
                </>
              ) : unlocked ? (
                <>
                  <span className="text-blue-400">🎯</span>
                  <span className="text-blue-300">Click to Start</span>
                </>
              ) : (
                <>
                  <span className="text-red-400">🔒</span>
                  <span className="text-red-300">Locked</span>
                </>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}