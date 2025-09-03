'use client'

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  Cloud,
  Sky,
  Stars,
  Float,
  MeshReflectorMaterial,
  useTexture,
  Text3D,
  Center,
  Sparkles,
  Trail,
  PerspectiveCamera,
  useGLTF,
  Sphere,
  Box,
  Cone,
  Cylinder,
  Plane,
  Ring,
  Torus,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  useDepthBuffer,
  GradientTexture,
  Stage,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  BakeShadows,
  Preload,
  Loader,
  Html,
  Billboard,
  Outlines,
  Effects,
  PresentationControls,
  Bounds,
  useBounds,
  Edges
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  Noise, 
  Vignette,
  SSAO,
  ChromaticAberration,
  ColorAverage,
  BrightnessContrast,
  HueSaturation,
  ColorDepth,
  DotScreen,
  Glitch,
  Pixelation,
  Scanline,
  Sepia,
  ToneMapping,
  LUT,
  SelectiveBloom,
  GodRays,
  Grid as GridEffect,
  Outline
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { BlendFunction, KernelSize } from 'postprocessing'
import { Suspense as ReactSuspense } from 'react'
import { LocationMarker } from './LocationMarker'

// Fantasy Map Background using your Midjourney image
function FantasyMapBackground() {
  const texture = useTexture('/fantasy-island-map.png')
  
  return (
    <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[160, 160]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

// Simple terrain generation without shaders
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  const { heightMap, biomeMap } = useMemo(() => {
    const size = 64
    const heights: number[] = []
    const biomes: number[] = []
    
    for (let i = 0; i < size * size; i++) {
      const x = (i % size) / size
      const z = Math.floor(i / size) / size
      
      // Simple noise function
      const height = Math.sin(x * 10) * Math.cos(z * 8) * 0.5 + 
                    Math.sin(x * 20) * Math.cos(z * 15) * 0.2
      
      const biome = Math.random()
      
      heights.push(height)
      biomes.push(biome)
    }
    
    return { heightMap: heights, biomeMap: biomes }
  }, [])

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry
      const vertices = geometry.attributes.position.array as Float32Array
      const colors = new Float32Array(vertices.length)
      
      for (let i = 0; i < vertices.length; i += 3) {
        const index = Math.floor(i / 3)
        const height = heightMap[index] || 0
        const biome = biomeMap[index] || 0
        
        vertices[i + 2] = height
        
        let r, g, b
        if (biome <= 0.2) {
          r = 0.1; g = 0.3; b = 0.6 // Water
        } else if (biome <= 0.4) {
          r = 0.8; g = 0.7; b = 0.5 // Sand
        } else if (biome <= 0.6) {
          r = 0.2; g = 0.6; b = 0.2 // Grass
        } else if (biome <= 0.8) {
          r = 0.5; g = 0.5; b = 0.5 // Stone
        } else {
          r = 0.9; g = 0.9; b = 0.9 // Snow
        }
        
        colors[i] = r
        colors[i + 1] = g
        colors[i + 2] = b
      }
      
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.computeVertexNormals()
      geometry.attributes.position.needsUpdate = true
    }
  }, [heightMap, biomeMap])

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial 
        vertexColors
        roughness={0.9}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

// Simple water without shaders
function Water() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 128, 128]} />
        <meshStandardMaterial 
          color="#0a0a1a"
          transparent 
          opacity={0.9}
          roughness={0.0}
          metalness={0.8}
          emissive="#1a237e"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshBasicMaterial 
          color="#00bcd4"
          transparent 
          opacity={0.2}
        />
      </mesh>
      
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160, 20, 20]} />
        <meshBasicMaterial 
          color="#4a148c"
          transparent 
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  )
}

// Location marker with mission icon
// LocationMarker moved to separate file
// Old function LocationMarker removed - see LocationMarker.tsx

// Commented out old function LocationMarker({ 
  position, 
  name, 
  type, 
  unlocked, 
  completed,
  onClick,
  lore,
  missionNumber 
}: { 
  position: [number, number, number]
  name: string
  type: string
  unlocked: boolean
  completed: boolean
  onClick: () => void
  lore?: string
  missionNumber: number
}) {
  const meshRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  
  // Floating animation for the icon
  useFrame((state) => {
    if (meshRef.current && unlocked) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  const getMissionIcon = () => {
    const iconColor = completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'
    const glowColor = completed ? '#10b981' : unlocked ? '#60a5fa' : '#374151'
    
    return (
      <group>
        {/* Mission marker base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2, 2.5, 0.5, 6]} />
          <meshStandardMaterial 
            color={iconColor}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Mission number display */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.2, 6]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Mission type icon */}
        {type === 'castle' && (
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1, 2, 4]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        {type === 'village' && (
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        {type === 'tower' && (
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 3, 8]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        {type === 'mountain' && (
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1.2, 2.5, 3]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        {type === 'forest' && (
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        {type === 'dungeon' && (
          <mesh position={[0, 2, 0]}>
            <octahedronGeometry args={[1.2]} />
            <meshStandardMaterial color={iconColor} />
          </mesh>
        )}
        
        {/* Status indicator ring */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.2, 32]} />
          <meshBasicMaterial 
            color={glowColor}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Completion checkmark or lock */}
        {completed && (
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.5]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        )}
        {!unlocked && (
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        )}
        
        {/* Glow effect when hovered */}
        {hovered && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial 
              color={glowColor}
              transparent
              opacity={0.1}
            />
          </mesh>
        )}
      </group>
    )
  } // Cipher Academy Ruins - 2D coding academy with tech elements
        return (
          <group>
            {/* Academy building base (2D flat design) */}
            <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6, 4]} />
              <meshBasicMaterial 
                color="#1e293b" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Academy main structure - code editor theme */}
            <mesh position={[0, 2.1, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[5.5, 3.5]} />
              <meshBasicMaterial 
                color="#0f172a"
              />
            </mesh>
            
            {/* Code window bars (like IDE tabs) */}
            <mesh position={[0, 3.6, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[5.5, 0.3]} />
              <meshBasicMaterial 
                color="#374151"
              />
            </mesh>
            
            {/* Academy towers (like terminal windows) */}
            <mesh position={[-2, 3, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 2]} />
              <meshBasicMaterial 
                color="#111827"
              />
            </mesh>
            <mesh position={[2, 3, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 2]} />
              <meshBasicMaterial 
                color="#111827"
              />
            </mesh>
            
            {/* Code text lines (green terminal text) */}
            <mesh position={[-1, 2.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2, 0.1]} />
              <meshBasicMaterial 
                color="#10b981"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-1, 2.1, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.1]} />
              <meshBasicMaterial 
                color="#10b981"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1, 2.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.8, 0.1]} />
              <meshBasicMaterial 
                color="#3b82f6"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1, 2.1, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 0.1]} />
              <meshBasicMaterial 
                color="#3b82f6"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Academy entrance (like a command prompt) */}
            <mesh position={[0, 0.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2, 1]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            
            {/* Command prompt cursor */}
            <mesh position={[-0.7, 0.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.6]} />
              <meshBasicMaterial 
                color="#22c55e"
              />
            </mesh>
            
            {/* Academy sign/logo */}
            <mesh position={[0, 4.2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3, 0.6]} />
              <meshBasicMaterial 
                color="#6366f1"
              />
            </mesh>
            
            {/* Digital circuits pattern */}
            <mesh position={[-2.5, 1, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 3]} />
              <meshBasicMaterial 
                color="#8b5cf6"
                transparent
                opacity={0.6}
              />
            </mesh>
            <mesh position={[2.5, 1, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 3]} />
              <meshBasicMaterial 
                color="#8b5cf6"
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Data flow particles */}
            <mesh position={[0, 5, 0.2]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial 
                color="#9c27b0" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0.3, 5.2, 0.2]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial 
                color="#e91e63" 
                transparent 
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-0.3, 5.3, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#2196f3" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        )
      
      /* Old building code removed - replaced with getMissionIcon above */
        return (
          <group>
            {/* Main workspace panel (like VS Code interface) */}
            <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[7, 4]} />
              <meshBasicMaterial 
                color="#1a1a1a" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* File explorer panel (left sidebar) */}
            <mesh position={[-2.5, 2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2, 4]} />
              <meshBasicMaterial 
                color="#252526"
              />
            </mesh>
            
            {/* Main editor area */}
            <mesh position={[0.75, 2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[4.5, 4]} />
              <meshBasicMaterial 
                color="#1e1e1e"
              />
            </mesh>
            
            {/* File tabs */}
            <mesh position={[0.75, 3.7, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[4.5, 0.6]} />
              <meshBasicMaterial 
                color="#2d2d30"
              />
            </mesh>
            
            {/* Active tab */}
            <mesh position={[-0.5, 3.7, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.6]} />
              <meshBasicMaterial 
                color="#1e1e1e"
              />
            </mesh>
            
            {/* Variable declaration lines */}
            <mesh position={[-0.2, 2.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3.5, 0.15]} />
              <meshBasicMaterial 
                color="#d4edda"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.2, 2.2, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.8, 0.15]} />
              <meshBasicMaterial 
                color="#569cd6"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.2, 1.9, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3.2, 0.15]} />
              <meshBasicMaterial 
                color="#ce9178"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.2, 1.6, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.5, 0.15]} />
              <meshBasicMaterial 
                color="#4ec9b0"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* File tree items */}
            <mesh position={[-2.5, 3.2, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.8, 0.2]} />
              <meshBasicMaterial 
                color="#cccccc"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-2.5, 2.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.6, 0.2]} />
              <meshBasicMaterial 
                color="#cccccc"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-2.5, 2.4, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.4, 0.2]} />
              <meshBasicMaterial 
                color="#cccccc"
                transparent
                opacity={0.7}
              />
            </mesh>
            
            {/* Terminal panel (bottom) */}
            <mesh position={[0.75, 0.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[4.5, 1.6]} />
              <meshBasicMaterial 
                color="#0c0c0c"
              />
            </mesh>
            
            {/* Terminal text */}
            <mesh position={[-0.5, 0.9, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.5, 0.7, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.5, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Minimap (top right) */}
            <mesh position={[2.3, 3.2, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 1]} />
              <meshBasicMaterial 
                color="#252526"
              />
            </mesh>
            
            {/* Line numbers */}
            <mesh position={[-1.3, 2.2, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 2]} />
              <meshBasicMaterial 
                color="#858585"
                transparent
                opacity={0.5}
              />
            </mesh>
            
            {/* Variable data crystal */}
            <mesh position={[0, 4.5, 0.2]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color="#2196f3" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0.4, 4.7, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#00bcd4" 
                transparent 
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-0.4, 4.8, 0.2]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial 
                color="#4caf50" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        )
      
      case 'tower': // Logic Gateway Fortress - 2D circuit board tower with logic gates
        return (
          <group>
            {/* Main circuit board base */}
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[4, 5]} />
              <meshBasicMaterial 
                color="#0d1b2a" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Circuit board pattern background */}
            <mesh position={[0, 2.5, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3.8, 4.8]} />
              <meshBasicMaterial 
                color="#1b263b"
              />
            </mesh>
            
            {/* Logic gate symbols */}
            <mesh position={[0, 3.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.8]} />
              <meshBasicMaterial 
                color="#e63946"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-1, 2.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 0.6]} />
              <meshBasicMaterial 
                color="#f77f00"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1, 2.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 0.6]} />
              <meshBasicMaterial 
                color="#fcbf49"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 2.1, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.2, 0.7]} />
              <meshBasicMaterial 
                color="#80b918"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Circuit traces (connecting lines) */}
            <mesh position={[0, 3.1, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 1]} />
              <meshBasicMaterial 
                color="#06ffa5"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-0.5, 2.5, 0.08]} rotation={[0, 0, 90 * Math.PI / 180]}>
              <planeGeometry args={[0.1, 1.5]} />
              <meshBasicMaterial 
                color="#06ffa5"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0.5, 2.5, 0.08]} rotation={[0, 0, 90 * Math.PI / 180]}>
              <planeGeometry args={[0.1, 1.5]} />
              <meshBasicMaterial 
                color="#06ffa5"
                transparent
                opacity={0.7}
              />
            </mesh>
            
            {/* Input/Output ports */}
            <mesh position={[-1.8, 3.5, 0.12]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#3a86ff"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-1.8, 2.8, 0.12]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#3a86ff"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[1.8, 3.5, 0.12]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#ff006e"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[1.8, 2.8, 0.12]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#ff006e"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Resistors and capacitors */}
            <mesh position={[-0.8, 1.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 0.2]} />
              <meshBasicMaterial 
                color="#ffd60a"
              />
            </mesh>
            <mesh position={[0.8, 1.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 0.2]} />
              <meshBasicMaterial 
                color="#ffd60a"
              />
            </mesh>
            <mesh position={[0, 1.2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.4]} />
              <meshBasicMaterial 
                color="#8338ec"
              />
            </mesh>
            
            {/* Control panel display */}
            <mesh position={[0, 0.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3, 0.8]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            <mesh position={[0, 0.5, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.8, 0.6]} />
              <meshBasicMaterial 
                color="#1a1a1a"
              />
            </mesh>
            
            {/* Binary display */}
            <mesh position={[-0.8, 0.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#00ff41"
              />
            </mesh>
            <mesh position={[-0.3, 0.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#00ff41"
              />
            </mesh>
            <mesh position={[0.3, 0.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#00ff41"
              />
            </mesh>
            <mesh position={[0.8, 0.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#00ff41"
              />
            </mesh>
            
            {/* Logic tower antenna */}
            <mesh position={[0, 4.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.2, 0.8]} />
              <meshBasicMaterial 
                color="#ff6b35"
              />
            </mesh>
            
            {/* Logic processing crystal */}
            <mesh position={[0, 5.5, 0.2]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color="#f44336" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0.3, 5.7, 0.2]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial 
                color="#ff9800" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.3, 5.8, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#ffeb3b" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      
      case 'forest': // Function Nexus Grove - 2D function tree diagram with code branches
        return (
          <group>
            {/* Main function tree diagram */}
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6, 5]} />
              <meshBasicMaterial 
                color="#0f2027" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Function tree background */}
            <mesh position={[0, 2.5, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[5.8, 4.8]} />
              <meshBasicMaterial 
                color="#203a43"
              />
            </mesh>
            
            {/* Main function trunk (central node) */}
            <mesh position={[0, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.8]} />
              <meshBasicMaterial 
                color="#2c5530"
              />
            </mesh>
            <mesh position={[0, 1.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 0.6]} />
              <meshBasicMaterial 
                color="#4caf50"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Function branches (connecting lines) */}
            <mesh position={[-1.5, 2.5, 0.08]} rotation={[0, 0, 45 * Math.PI / 180]}>
              <planeGeometry args={[0.08, 1.5]} />
              <meshBasicMaterial 
                color="#66bb6a"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.5, 2.5, 0.08]} rotation={[0, 0, -45 * Math.PI / 180]}>
              <planeGeometry args={[0.08, 1.5]} />
              <meshBasicMaterial 
                color="#66bb6a"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 2.8, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.08, 1.2]} />
              <meshBasicMaterial 
                color="#66bb6a"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Function nodes/leaves */}
            <mesh position={[-2.2, 3.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 0.6]} />
              <meshBasicMaterial 
                color="#1976d2"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[2.2, 3.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 0.6]} />
              <meshBasicMaterial 
                color="#f57c00"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 4, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.2, 0.6]} />
              <meshBasicMaterial 
                color="#7b1fa2"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Parameter inputs (roots) */}
            <mesh position={[-1.8, 1, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial 
                color="#d32f2f"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 0.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial 
                color="#388e3c"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.8, 1, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial 
                color="#1976d2"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Input connecting lines */}
            <mesh position={[-0.9, 1.4, 0.08]} rotation={[0, 0, 45 * Math.PI / 180]}>
              <planeGeometry args={[0.06, 0.8]} />
              <meshBasicMaterial 
                color="#81c784"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0, 1.3, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.06, 0.8]} />
              <meshBasicMaterial 
                color="#81c784"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0.9, 1.4, 0.08]} rotation={[0, 0, -45 * Math.PI / 180]}>
              <planeGeometry args={[0.06, 0.8]} />
              <meshBasicMaterial 
                color="#81c784"
                transparent
                opacity={0.7}
              />
            </mesh>
            
            {/* Function definition code panel */}
            <mesh position={[0, 0.2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[5.5, 1]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            <mesh position={[0, 0.2, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[5.3, 0.8]} />
              <meshBasicMaterial 
                color="#1a1a1a"
              />
            </mesh>
            
            {/* Code syntax highlighting */}
            <mesh position={[-1.8, 0.3, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.2, 0.12]} />
              <meshBasicMaterial 
                color="#569cd6"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.3, 0.3, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2, 0.12]} />
              <meshBasicMaterial 
                color="#d4edda"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.5, 0.3, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.12]} />
              <meshBasicMaterial 
                color="#ce9178"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-1, 0.1, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.5, 0.12]} />
              <meshBasicMaterial 
                color="#4ec9b0"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.2, 0.1, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.8, 0.12]} />
              <meshBasicMaterial 
                color="#dcdcaa"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Function processing crystals */}
            <mesh position={[0, 5, 0.2]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color="#4caf50" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.4, 5.3, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial 
                color="#8bc34a" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.4, 5.2, 0.2]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial 
                color="#cddc39" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      
      case 'mountain': // Data Array Peaks - 2D data visualization dashboard with charts and graphs
        return (
          <group>
            {/* Main dashboard background */}
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[7, 5]} />
              <meshBasicMaterial 
                color="#0c1421" 
                transparent 
                opacity={0.95}
              />
            </mesh>
            
            {/* Dashboard panel background */}
            <mesh position={[0, 2.5, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6.8, 4.8]} />
              <meshBasicMaterial 
                color="#1a202c"
              />
            </mesh>
            
            {/* Main bar chart (mountain-like data peaks) */}
            <mesh position={[-1.5, 3.2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 2]} />
              <meshBasicMaterial 
                color="#3182ce"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.8, 3.6, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 2.8]} />
              <meshBasicMaterial 
                color="#4299e1"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.1, 3, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 1.6]} />
              <meshBasicMaterial 
                color="#63b3ed"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.6, 3.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 3.2]} />
              <meshBasicMaterial 
                color="#2d3748"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[1.3, 3.3, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.4, 2.2]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Line graph overlay */}
            <mesh position={[-1.5, 2.8, 0.12]} rotation={[0, 0, 20 * Math.PI / 180]}>
              <planeGeometry args={[0.08, 1.2]} />
              <meshBasicMaterial 
                color="#f56565"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.1, 3.4, 0.12]} rotation={[0, 0, -15 * Math.PI / 180]}>
              <planeGeometry args={[0.08, 1.5]} />
              <meshBasicMaterial 
                color="#f56565"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[1.3, 2.9, 0.12]} rotation={[0, 0, 30 * Math.PI / 180]}>
              <planeGeometry args={[0.08, 1.1]} />
              <meshBasicMaterial 
                color="#f56565"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Data points on line graph */}
            <mesh position={[-1.5, 3.2, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial 
                color="#e53e3e"
              />
            </mesh>
            <mesh position={[-0.8, 3.8, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial 
                color="#e53e3e"
              />
            </mesh>
            <mesh position={[-0.1, 3.4, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial 
                color="#e53e3e"
              />
            </mesh>
            <mesh position={[0.6, 4.2, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial 
                color="#e53e3e"
              />
            </mesh>
            <mesh position={[1.3, 3.6, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial 
                color="#e53e3e"
              />
            </mesh>
            
            {/* Pie chart section */}
            <mesh position={[2.5, 3.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 1.5]} />
              <meshBasicMaterial 
                color="#2a4365"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[2.5, 3.5, 0.12]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 1.3]} />
              <meshBasicMaterial 
                color="#2b6cb0"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[2.8, 3.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.6, 0.6]} />
              <meshBasicMaterial 
                color="#3182ce"
              />
            </mesh>
            <mesh position={[2.2, 3.2, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.6, 0.6]} />
              <meshBasicMaterial 
                color="#4299e1"
              />
            </mesh>
            
            {/* Array index labels */}
            <mesh position={[-1.5, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#68d391"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.8, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#68d391"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.1, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#68d391"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.6, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#68d391"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.3, 1.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial 
                color="#68d391"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Data metrics panel */}
            <mesh position={[0, 1.2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6.5, 1]} />
              <meshBasicMaterial 
                color="#2d3748"
              />
            </mesh>
            
            {/* Metric values */}
            <mesh position={[-2.5, 1.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 0.2]} />
              <meshBasicMaterial 
                color="#48bb78"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.8, 1.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.2, 0.2]} />
              <meshBasicMaterial 
                color="#ed8936"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0.8, 1.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 0.2]} />
              <meshBasicMaterial 
                color="#9f7aea"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[2.5, 1.3, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.1, 0.2]} />
              <meshBasicMaterial 
                color="#38b2ac"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Grid lines */}
            <mesh position={[0, 2.2, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6, 0.02]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.5}
              />
            </mesh>
            <mesh position={[0, 3, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6, 0.02]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.5}
              />
            </mesh>
            <mesh position={[0, 3.8, 0.08]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6, 0.02]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.5}
              />
            </mesh>
            
            {/* Data visualization crystals */}
            <mesh position={[0, 5.2, 0.2]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color="#9e9e9e" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.4, 5.5, 0.2]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial 
                color="#607d8b" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.4, 5.3, 0.2]}>
              <sphereGeometry args={[0.25]} />
              <meshBasicMaterial 
                color="#78909c" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      
      case 'dungeon': // Database Core Depths - 2D server room with database infrastructure
        return (
          <group>
            {/* Server room background */}
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
              <planeGeometry args={[7, 5]} />
              <meshBasicMaterial 
                color="#0a0a0a" 
                transparent 
                opacity={0.95}
              />
            </mesh>
            
            {/* Server room floor */}
            <mesh position={[0, 2.5, 0.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[6.8, 4.8]} />
              <meshBasicMaterial 
                color="#1a1a1a"
              />
            </mesh>
            
            {/* Main server rack (left) */}
            <mesh position={[-2, 2.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 4]} />
              <meshBasicMaterial 
                color="#2d2d2d"
              />
            </mesh>
            <mesh position={[-2, 2.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 3.8]} />
              <meshBasicMaterial 
                color="#1e1e1e"
              />
            </mesh>
            
            {/* Server status lights */}
            <mesh position={[-2.4, 3.8, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
              />
            </mesh>
            <mesh position={[-2.4, 3.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
              />
            </mesh>
            <mesh position={[-2.4, 3.2, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial 
                color="#ffff00"
              />
            </mesh>
            <mesh position={[-2.4, 2.9, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial 
                color="#ff0000"
              />
            </mesh>
            <mesh position={[-2.4, 2.6, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
              />
            </mesh>
            
            {/* Database server rack (right) */}
            <mesh position={[2, 2.8, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.5, 4]} />
              <meshBasicMaterial 
                color="#2d2d2d"
              />
            </mesh>
            <mesh position={[2, 2.8, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.3, 3.8]} />
              <meshBasicMaterial 
                color="#1e1e1e"
              />
            </mesh>
            
            {/* Database activity indicators */}
            <mesh position={[1.6, 3.8, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial 
                color="#9c27b0"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.6, 3.5, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial 
                color="#e91e63"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[1.6, 3.2, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial 
                color="#9c27b0"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1.6, 2.9, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial 
                color="#3f51b5"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Central control console */}
            <mesh position={[0, 1.5, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3, 1.5]} />
              <meshBasicMaterial 
                color="#2a2a2a"
              />
            </mesh>
            <mesh position={[0, 1.5, 0.15]} rotation={[0, 0, 0]}>
              <planeGeometry args={[2.8, 1.3]} />
              <meshBasicMaterial 
                color="#1a1a1a"
              />
            </mesh>
            
            {/* Console screens */}
            <mesh position={[-0.8, 1.7, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            <mesh position={[0, 1.7, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            <mesh position={[0.8, 1.7, 0.2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshBasicMaterial 
                color="#000000"
              />
            </mesh>
            
            {/* Screen content (terminal text) */}
            <mesh position={[-0.8, 1.8, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.7, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[-0.8, 1.6, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.6, 0.1]} />
              <meshBasicMaterial 
                color="#00ff00"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 1.8, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.7, 0.1]} />
              <meshBasicMaterial 
                color="#00bcd4"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 1.6, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.5, 0.1]} />
              <meshBasicMaterial 
                color="#00bcd4"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.8, 1.8, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.6, 0.1]} />
              <meshBasicMaterial 
                color="#ff9800"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.8, 1.6, 0.25]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.7, 0.1]} />
              <meshBasicMaterial 
                color="#ff9800"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Cable management */}
            <mesh position={[-1, 0.8, 0.1]} rotation={[0, 0, 30 * Math.PI / 180]}>
              <planeGeometry args={[0.1, 2]} />
              <meshBasicMaterial 
                color="#424242"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[1, 0.8, 0.1]} rotation={[0, 0, -30 * Math.PI / 180]}>
              <planeGeometry args={[0.1, 2]} />
              <meshBasicMaterial 
                color="#424242"
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 0.6, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[4, 0.1]} />
              <meshBasicMaterial 
                color="#424242"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Cooling vents */}
            <mesh position={[-2.8, 2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 2]} />
              <meshBasicMaterial 
                color="#616161"
                transparent
                opacity={0.6}
              />
            </mesh>
            <mesh position={[2.8, 2, 0.1]} rotation={[0, 0, 0]}>
              <planeGeometry args={[0.3, 2]} />
              <meshBasicMaterial 
                color="#616161"
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Emergency lights */}
            <mesh position={[-3, 4.5, 0.2]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial 
                color="#f44336"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[3, 4.5, 0.2]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial 
                color="#f44336"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Database core processing crystals */}
            <mesh position={[0, 5.2, 0.2]}>
              <sphereGeometry args={[0.4]} />
              <meshBasicMaterial 
                color="#e91e63" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[-0.5, 5.5, 0.2]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial 
                color="#9c27b0" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.5, 5.4, 0.2]}>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color="#673ab7" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      
      default:
        return (
          <mesh castShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial 
              color={getColor()}
              emissive={getColor()}
              emissiveIntensity={hovered ? 0.5 : 0.2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )
    }
  }

  /* Building code removed */
  
  const getColor = () => {
    if (completed) return '#00ffaa' // Bright cyan-green for decoded ciphers
    if (unlocked) return '#8b5cf6'   // Vivid purple for available realms
    return '#1e293b'                 // Dark slate for cipher-protected areas
  }

  return (
    <group position={position}>
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getMissionIcon()}
      </group>
      
      {unlocked && (
        <group>
          <mesh position={[2, 2, 0.3]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial 
              color={getColor()}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[-2, 2, 0.3]}>
            <sphereGeometry args={[0.2]} />
            <meshBasicMaterial 
              color={getColor()}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}
      
      {hovered && (
        <Html center distanceFactor={15}>
          <div className="bg-black/90 px-4 py-3 rounded-lg border border-purple-500/50 whitespace-nowrap max-w-xs">
            <div className="text-cyan-300 font-bold text-sm mb-1">{name}</div>
            <div className="text-purple-200 text-xs mb-2 leading-relaxed">
              {lore || 'Ancient mysteries await...'}
            </div>
            <div className="text-gray-300 text-xs">
              {completed ? '🔓 Cipher Decoded' : unlocked ? '⚡ Ready for Exploration' : '🔒 Protected by the Black Cipher'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Main 3D Scene
function Scene({ onLocationClick }: { onLocationClick: (location: any) => void }) {
  const locations = [
    { id: 1, name: "CodeFly Academy", position: [0, 8, 0] as [number, number, number], type: 'castle', unlocked: true, completed: true, lessonPath: '/lesson/week-01', lore: "The central tech campus where students learn to code. Master the basics of Python programming in this modern learning facility.", missionNumber: 1 },
    { id: 2, name: "Variable Storage Facility", position: [-12, 12, 0] as [number, number, number], type: 'village', unlocked: true, completed: true, lessonPath: '/lesson/week-02', lore: "Data center where digital information is stored and managed. Learn how variables contain and organize your program data.", missionNumber: 2 },
    { id: 3, name: "Logic Processing Tower", position: [15, 10, 0] as [number, number, number], type: 'tower', unlocked: true, completed: false, lessonPath: '/lesson/conditionals', lore: "High-tech building where decisions are made. Master if/else statements to control your program's logical flow.", missionNumber: 3 },
    { id: 4, name: "Loop Systems Building", position: [-8, -8, 0] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/loops', lore: "Automated facility where repetitive tasks are processed. Learn to create efficient loops that repeat code operations.", missionNumber: 4 },
    { id: 5, name: "Function Development Lab", position: [8, -5, 0] as [number, number, number], type: 'forest', unlocked: false, completed: false, lessonPath: '/lesson/functions', lore: "Innovation center where reusable code modules are created. Build powerful functions to organize and streamline your programs.", missionNumber: 5 },
    { id: 6, name: "Array Processing Center", position: [-15, 5, 0] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/arrays', lore: "Data organization facility where lists and collections are managed. Master arrays to handle multiple pieces of information efficiently.", missionNumber: 6 },
    { id: 7, name: "Object Design Studio", position: [12, -12, 0] as [number, number, number], type: 'village', unlocked: false, completed: false, lessonPath: '/lesson/objects', lore: "Creative workspace where complex data structures are built. Learn object-oriented programming to model real-world entities in code.", missionNumber: 7 },
    { id: 8, name: "Database Operations Center", position: [0, -18, 0] as [number, number, number], type: 'dungeon', unlocked: false, completed: false, lessonPath: '/lesson/databases', lore: "Secure facility managing vast amounts of information. Master database operations to store, retrieve, and organize large datasets.", missionNumber: 8 },
  ]

  return (
    <>
      {/* Enhanced lighting for 3D mission markers */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 20, 10]} intensity={0.5} color="#60a5fa" />
      
      {/* No 3D atmospheric effects needed for 2D map */}
      
      {/* Your Midjourney Fantasy Map Background */}
      <ReactSuspense fallback={
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[100, 70]} />
          <meshBasicMaterial color="#4A90E2" />
        </mesh>
      }>
        <FantasyMapBackground />
      </ReactSuspense>
      
      {/* Location markers */}
      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          position={location.position}
          name={location.name}
          type={location.type}
          unlocked={location.unlocked}
          completed={location.completed}
          onClick={() => onLocationClick(location)}
          lore={location.lore}
          missionNumber={location.missionNumber}
        />
      ))}
    </>
  )
}

// Main component
export default function AAAGameMap() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleLocationClick = (location: any) => {
    if (location.unlocked) {
      router.push(location.lessonPath)
    } else {
      alert(`🔒 The Black Cipher protects ${location.name}! Master the previous codes to unlock this realm.`)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-4">🔐 Decoding Black Cipher World...</div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ 
          position: [0, 0, 100], 
          fov: 50,
          near: 0.1,
          far: 500
        }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        orthographic
      >
        <Suspense fallback={null}>
          <Scene onLocationClick={handleLocationClick} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={false}
            enableDamping={true}
            dampingFactor={0.1}
            minZoom={0.3}
            maxZoom={2.0}
            zoomSpeed={1.0}
            panSpeed={1.5}
            screenSpacePanning={true}
            target={[0, 0, 0]}
            makeDefault
          />
          
          {/* No post-processing effects needed for 2D map */}
        </Suspense>
      </Canvas>
    </div>
  )
}