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
  })

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

// Location marker with 3D model
function LocationMarker({ 
  position, 
  name, 
  type, 
  unlocked, 
  completed,
  onClick,
  lore 
}: { 
  position: [number, number, number]
  name: string
  type: string
  unlocked: boolean
  completed: boolean
  onClick: () => void
  lore?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  const getDetailedModel = () => {
    switch(type) {
      case 'castle': // Cipher Academy Ruins
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[3, 2.5, 3]} />
              <meshStandardMaterial 
                color="#1a0d2e" 
                metalness={0.7} 
                roughness={0.3}
                emissive="#4a148c"
                emissiveIntensity={0.1}
              />
            </mesh>
            <mesh castShadow position={[-1.2, 1.8, -1.2]}>
              <cylinderGeometry args={[0.4, 0.4, 1.5, 8]} />
              <meshStandardMaterial 
                color="#2d1b47" 
                emissive="#7b1fa2" 
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[0, 3.5, 0]}>
              <ringGeometry args={[0.8, 1.0, 8]} />
              <meshBasicMaterial 
                color="#e1bee7" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        )
      
      case 'village': // Variable Vault District or Object Sanctuary
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[1.5, 1.8, 3, 8]} />
              <meshStandardMaterial 
                color="#0d47a1" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#1976d2"
                emissiveIntensity={0.2}
              />
            </mesh>
            <mesh position={[-2, 2, 0]}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial 
                color="#3f51b5" 
                transparent
                opacity={0.7}
                emissive="#5c6bc0"
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
        )
      
      case 'tower': // Logic Gateway Fortress
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[1.2, 1.5, 5, 8]} />
              <meshStandardMaterial 
                color="#b71c1c" 
                metalness={0.8} 
                roughness={0.2}
                emissive="#d32f2f"
                emissiveIntensity={0.1}
              />
            </mesh>
            <mesh castShadow position={[0, 3, 0]}>
              <coneGeometry args={[1.5, 1.5, 4]} />
              <meshStandardMaterial 
                color="#1a237e" 
                emissive="#3f51b5" 
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )
      
      case 'forest': // Function Nexus Grove
        return (
          <group>
            <mesh castShadow>
              <coneGeometry args={[1.2, 3.5, 6]} />
              <meshStandardMaterial 
                color="#1b5e20" 
                emissive="#4caf50" 
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, 2, 0]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial 
                color="#00e676" 
                emissive="#00e676" 
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        )
      
      case 'mountain': // Data Array Peaks or Echo Loop Caverns
        return (
          <group>
            <mesh castShadow>
              <coneGeometry args={[2.5, 4, 4]} />
              <meshStandardMaterial 
                color="#424242" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#616161"
                emissiveIntensity={0.1}
              />
            </mesh>
            <mesh castShadow position={[0, 1, 0]}>
              <boxGeometry args={[3, 0.5, 3]} />
              <meshStandardMaterial 
                color="#ff9800" 
                emissive="#ff9800" 
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )
      
      case 'dungeon': // Database Core Depths
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[2, 2, 2, 8]} />
              <meshStandardMaterial 
                color="#000000" 
                metalness={1} 
                roughness={0.1}
                emissive="#1a1a1a"
                emissiveIntensity={0.2}
              />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <torusGeometry args={[1.5, 0.1, 8, 32]} />
              <meshBasicMaterial 
                color="#e91e63" 
                emissive="#e91e63" 
                emissiveIntensity={1}
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

  const getColor = () => {
    if (completed) return '#00ffaa' // Bright cyan-green for decoded ciphers
    if (unlocked) return '#8b5cf6'   // Vivid purple for available realms
    return '#1e293b'                 // Dark slate for cipher-protected areas
  }

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {getDetailedModel()}
        </group>
        
        {unlocked && (
          <Sparkles 
            count={20} 
            scale={3} 
            size={2} 
            speed={0.5} 
            color={getColor()}
            opacity={0.5}
          />
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
      </Float>
    </group>
  )
}

// Main 3D Scene
function Scene({ onLocationClick }: { onLocationClick: (location: any) => void }) {
  const locations = [
    { id: 1, name: "Cipher Academy Ruins", position: [0, 2, 0] as [number, number, number], type: 'castle', unlocked: true, completed: true, lessonPath: '/lesson/week-01', lore: "The ancient academy where the Black Cipher was first discovered. Learn the fundamental codes that unlock the digital mysteries." },
    { id: 2, name: "Variable Vault District", position: [10, 1, 5] as [number, number, number], type: 'village', unlocked: true, completed: true, lessonPath: '/lesson/week-02', lore: "Hidden district where data containers hold the secrets of the cipher. Master variable manipulation to decode encrypted messages." },
    { id: 3, name: "Logic Gateway Fortress", position: [15, 1.5, -8] as [number, number, number], type: 'tower', unlocked: true, completed: false, lessonPath: '/lesson/conditionals', lore: "The imposing fortress that guards the cipher's logical pathways. Only those who master if/else conditions may pass." },
    { id: 4, name: "Echo Loop Caverns", position: [-8, 3, -12] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/loops', lore: "Deep caverns where patterns repeat endlessly. Navigate the recursive echoes to unlock the cipher's repetitive sequences." },
    { id: 5, name: "Function Nexus Grove", position: [-15, 1, 8] as [number, number, number], type: 'forest', unlocked: false, completed: false, lessonPath: '/lesson/functions', lore: "Mystical grove where code fragments are woven into powerful spells. Learn to craft reusable enchantments for the cipher." },
    { id: 6, name: "Data Array Peaks", position: [5, 4, -15] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/arrays', lore: "Towering peaks where information is organized in perfect order. Scale these heights to master the cipher's data structures." },
    { id: 7, name: "Object Sanctuary", position: [-10, 1, 0] as [number, number, number], type: 'village', unlocked: false, completed: false, lessonPath: '/lesson/objects', lore: "Sacred sanctuary where complex data entities dwell. Commune with objects to understand the cipher's deepest architecture." },
    { id: 8, name: "Database Core Depths", position: [20, 0.5, 10] as [number, number, number], type: 'dungeon', unlocked: false, completed: false, lessonPath: '/lesson/databases', lore: "The ultimate vault containing the Black Cipher's complete database. Only master coders can access its encrypted treasures." },
  ]

  return (
    <>
      {/* Advanced dynamic lighting system */}
      <ambientLight intensity={0.2} color="#1a0d2e" />
      
      {/* Main sun light */}
      <directionalLight
        castShadow
        position={[20, 30, 15]}
        intensity={2.0}
        color="#4a148c"
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={100}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      
      {/* Rim lighting for dramatic effect */}
      <directionalLight
        position={[-20, 15, -20]}
        intensity={0.8}
        color="#9c27b0"
      />
      
      {/* Area lights for more realistic illumination */}
      <pointLight 
        castShadow
        position={[0, 25, 0]} 
        intensity={1.2} 
        color="#673ab7"
        distance={80}
        decay={2}
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Atmospheric point lights */}
      <pointLight position={[-25, 8, -15]} intensity={0.6} color="#e91e63" distance={40} />
      <pointLight position={[25, 12, 20]} intensity={0.7} color="#3f51b5" distance={45} />
      <pointLight position={[0, 5, -30]} intensity={0.5} color="#9c27b0" distance={35} />
      
      {/* Mysterious Black Cipher sky */}
      <Sky 
        distance={450000}
        sunPosition={[-50, 10, -50]}
        inclination={0.8}
        azimuth={0.75}
        mieCoefficient={0.02}
        mieDirectionalG={0.9}
        rayleigh={1}
        turbidity={25}
      />
      
      {/* Cipher constellation patterns */}
      <Stars radius={200} depth={80} count={6000} factor={8} saturation={0.8} fade speed={0.3} />
      <Stars radius={120} depth={40} count={2000} factor={4} saturation={1.0} fade speed={0.8} />
      
      {/* Mysterious cipher fog */}
      <fog attach="fog" args={['#0a0a1a', 25, 100]} />
      
      {/* Black Cipher atmospheric effects */}
      <Sparkles 
        count={800} 
        scale={200} 
        size={0.8} 
        speed={0.02} 
        opacity={0.3} 
        color="#9c27b0" 
        noise={2}
      />
      
      {/* Terrain and water */}
      <Terrain />
      <Water />
      
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
        shadows="soft"
        camera={{ 
          position: [30, 20, 30], 
          fov: 50,
          near: 0.1,
          far: 500
        }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene onLocationClick={handleLocationClick} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={80}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 8}
            autoRotate={true}
            autoRotateSpeed={0.3}
            zoomSpeed={0.8}
            panSpeed={1.2}
            rotateSpeed={0.6}
            screenSpacePanning={true}
          />
          
          <EffectComposer enableNormalPass>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              kernelSize={KernelSize.LARGE}
              mipmapBlur={true}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}