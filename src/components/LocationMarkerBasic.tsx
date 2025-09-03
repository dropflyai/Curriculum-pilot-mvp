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
    console.warn('LocationMarker: Invalid position prop', position)
    return null
  }
  
  if (!name || !type || onClick === undefined || missionNumber === undefined) {
    console.warn('LocationMarker: Missing required props', { name, type, onClick, missionNumber })
    return null
  }
  
  // Colors based on status with fallbacks
  const color = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
  const emissiveColor = completed ? '#10b981' : unlocked ? '#60a5fa' : '#374151'

  return (
    <group 
      position={position}
      onClick={(e) => {
        try {
          e?.stopPropagation?.()
          if (typeof onClick === 'function') {
            onClick()
          }
        } catch (error) {
          console.warn('LocationMarker: onClick error', error)
        }
      }}
      onPointerOver={(e) => {
        try {
          setHovered(true)
        } catch (error) {
          console.warn('LocationMarker: onPointerOver error', error)
        }
      }}
      onPointerOut={(e) => {
        try {
          setHovered(false)
        } catch (error) {
          console.warn('LocationMarker: onPointerOut error', error)
        }
      }}
    >
      {/* Massive beacon pillar extending to sky */}
      <mesh position={[0, 100, 0]}>
        <cylinderGeometry args={[5, 5, 200]} />
        <meshBasicMaterial 
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Large pulsing base ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[25, 35]} />
        <meshBasicMaterial 
          color={emissiveColor}
          emissive={emissiveColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Massive glowing main marker */}
      <mesh>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 1.5 : 1.0}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Large mission number display */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[12, 12, 12]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Large status indicators */}
      {completed && (
        <mesh position={[0, 32, 0]}>
          <sphereGeometry args={[8]} />
          <meshBasicMaterial 
            color="#10b981" 
            emissive="#10b981"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      
      {!unlocked && (
        <mesh position={[0, 32, 0]}>
          <boxGeometry args={[10, 12, 6]} />
          <meshBasicMaterial 
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.6}
          />
        </mesh>
      )}
      
      {/* Massive hover glow effect */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[40, 32, 32]} />
          <meshBasicMaterial 
            color={emissiveColor}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
      
      {/* Tooltip */}
      {hovered && (
        <Html center distanceFactor={15}>
          <div className="bg-slate-900/95 px-4 py-3 rounded-lg border border-blue-500/50 max-w-xs shadow-xl">
            <div className="text-blue-400 font-bold text-sm mb-1">
              Mission {missionNumber || 'N/A'}: {name || 'Unknown Mission'}
            </div>
            <div className="text-gray-300 text-xs mb-2">
              {lore || 'Programming mission awaits...'}
            </div>
            <div className="text-gray-400 text-xs">
              {completed === true ? '✅ Completed' : unlocked === true ? '🎯 Click to Start' : '🔒 Locked'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}