import React, { useState } from 'react'
import { Html } from '@react-three/drei'

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
  const [hovered, setHovered] = useState(false)
  
  // Safety checks for props
  if (!position || !Array.isArray(position) || position.length !== 3) {
    return null
  }
  
  if (!name || !type || onClick === undefined || missionNumber === undefined) {
    return null
  }
  
  // Simple colors - avoid complex material properties
  const color = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
  
  return (
    <group position={position}>
      {/* Simplified beacon pillar - using only basic materials */}
      <mesh position={[0, 100, 0]}>
        <cylinderGeometry args={[5, 5, 200]} />
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Large base ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[25, 35]} />
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Main marker sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[15, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={hovered ? 1.0 : 0.9}
        />
      </mesh>
      
      {/* Mission number cube */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[12, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Status indicators */}
      {completed && (
        <mesh position={[0, 32, 0]}>
          <sphereGeometry args={[8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      )}
      
      {!unlocked && (
        <mesh position={[0, 32, 0]}>
          <boxGeometry args={[10, 12, 6]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}
      
      {/* Hover effect */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[40, 16, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Simple tooltip */}
      {hovered && (
        <Html center distanceFactor={15}>
          <div className="bg-slate-900/95 px-4 py-3 rounded-lg border border-blue-500/50 max-w-xs shadow-xl">
            <div className="text-blue-400 font-bold text-sm mb-1">
              Mission {missionNumber}: {name}
            </div>
            <div className="text-gray-300 text-xs mb-2">
              {lore || 'Programming mission awaits...'}
            </div>
            <div className="text-gray-400 text-xs">
              {completed ? '✅ Completed' : unlocked ? '🎯 Click to Start' : '🔒 Locked'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}