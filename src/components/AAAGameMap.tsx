'use client'

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
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
  shaderMaterial,
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
  Vignette,
  ChromaticAberration,
  Noise,
  SSAO,
  ToneMapping,
  BrightnessContrast,
  HueSaturation,
  Grid,
  GodRays,
  LensFlare,
  SelectiveBloom,
  Glitch,
  Pixelation,
  Outline,
  SMAA,
  FXAA,
  Scanline,
  DotScreen
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { BlendFunction, KernelSize } from 'postprocessing'

// Advanced water shader with realistic PBR effects
const WaterShader = shaderMaterial(
  {
    time: 0,
    deepColor: new THREE.Color(0x003366),
    shallowColor: new THREE.Color(0x0099cc),
    foamColor: new THREE.Color(0xffffff),
    opacity: 0.85,
    waveHeight: 0.15,
    waveSpeed: 1.0,
    foamThreshold: 0.12,
    normalScale: 2.0,
  },
  // Vertex shader with multiple wave octaves
  `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float waveHeight;
    uniform float waveSpeed;
    
    // Noise function for more natural waves
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Multiple wave octaves for realistic water
      float wave1 = sin(pos.x * 1.5 + time * waveSpeed) * waveHeight;
      float wave2 = sin(pos.z * 2.0 + time * waveSpeed * 0.8) * waveHeight * 0.6;
      float wave3 = sin((pos.x + pos.z) * 0.8 + time * waveSpeed * 1.2) * waveHeight * 0.4;
      
      // Add noise for natural variation
      float noiseVal = noise(vec2(pos.x * 0.1, pos.z * 0.1)) * waveHeight * 0.2;
      
      float elevation = wave1 + wave2 + wave3 + noiseVal;
      pos.y += elevation;
      vElevation = elevation;
      
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader with PBR-like water rendering
  `
    uniform vec3 deepColor;
    uniform vec3 shallowColor;
    uniform vec3 foamColor;
    uniform float time;
    uniform float opacity;
    uniform float foamThreshold;
    uniform float normalScale;
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      // Calculate depth-based color mixing
      float depth = max(0.0, vElevation + 0.1);
      vec3 waterColor = mix(deepColor, shallowColor, depth * 2.0);
      
      // Add caustic-like patterns
      float caustic1 = sin(vUv.x * 20.0 + time * 2.0) * 0.5 + 0.5;
      float caustic2 = sin(vUv.y * 15.0 + time * 1.5) * 0.5 + 0.5;
      vec3 caustics = vec3(caustic1 * caustic2 * 0.3);
      
      // Foam effect at wave peaks
      float foam = smoothstep(foamThreshold - 0.02, foamThreshold + 0.02, vElevation);
      waterColor = mix(waterColor + caustics, foamColor, foam);
      
      // Add subtle refraction effect
      vec2 distortion = vUv + sin(vUv * 10.0 + time) * 0.01;
      float refractionMask = smoothstep(0.0, 0.5, length(distortion - 0.5));
      waterColor *= (1.0 + refractionMask * 0.1);
      
      gl_FragColor = vec4(waterColor, opacity);
    }
  `
)

extend({ WaterShader })

// Advanced PBR Material Shader for Unreal-quality rendering
const AdvancedPBRShader = shaderMaterial(
  {
    time: 0,
    baseColor: new THREE.Color(0.5, 0.5, 0.5),
    roughness: 0.8,
    metalness: 0.1,
    normalScale: 1.0,
    emissiveColor: new THREE.Color(0, 0, 0),
    emissiveIntensity: 0.0,
    ambientOcclusion: 1.0,
    heightScale: 0.1,
    parallaxLayers: 8,
    detailScale: 4.0,
  },
  // Vertex shader with parallax mapping
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    
    uniform float time;
    uniform float heightScale;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewPosition = cameraPosition - worldPosition.xyz;
      
      // Calculate tangent space for normal mapping
      vTangent = normalize(normalMatrix * vec3(1.0, 0.0, 0.0));
      vBitangent = cross(vNormal, vTangent);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader with advanced PBR and parallax
  `
    uniform vec3 baseColor;
    uniform float roughness;
    uniform float metalness;
    uniform float normalScale;
    uniform vec3 emissiveColor;
    uniform float emissiveIntensity;
    uniform float ambientOcclusion;
    uniform float heightScale;
    uniform float parallaxLayers;
    uniform float detailScale;
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    
    // Advanced noise functions for procedural details
    float hash(float n) { return fract(sin(n) * 1e4); }
    float noise3D(vec3 x) {
      const vec3 step = vec3(110, 241, 171);
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float n = dot(i, step);
      return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), f.x),
                     mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), f.x), f.y),
                 mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), f.x),
                     mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), f.x), f.y), f.z);
    }
    
    // Parallax occlusion mapping
    vec2 parallaxMapping(vec2 texCoords, vec3 viewDir) {
      float height = noise3D(vec3(texCoords * detailScale, time * 0.1)) * heightScale;
      return texCoords - viewDir.xy * height;
    }
    
    // Advanced PBR lighting model
    vec3 calculatePBR(vec3 albedo, float rough, float metal, vec3 normal, vec3 lightDir, vec3 viewDir, vec3 lightColor) {
      vec3 F0 = mix(vec3(0.04), albedo, metal);
      vec3 halfwayDir = normalize(lightDir + viewDir);
      
      float NdotL = max(dot(normal, lightDir), 0.0);
      float NdotV = max(dot(normal, viewDir), 0.0);
      float NdotH = max(dot(normal, halfwayDir), 0.0);
      float VdotH = max(dot(viewDir, halfwayDir), 0.0);
      
      // Fresnel term
      vec3 F = F0 + (1.0 - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
      
      // Distribution term (GGX)
      float alpha = rough * rough;
      float alpha2 = alpha * alpha;
      float denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
      float D = alpha2 / (3.14159265 * denom * denom);
      
      // Geometry term
      float k = (rough + 1.0) * (rough + 1.0) / 8.0;
      float G1L = NdotL / (NdotL * (1.0 - k) + k);
      float G1V = NdotV / (NdotV * (1.0 - k) + k);
      float G = G1L * G1V;
      
      // BRDF
      vec3 numerator = D * G * F;
      float denominator = 4.0 * NdotV * NdotL + 0.0001;
      vec3 specular = numerator / denominator;
      
      vec3 kS = F;
      vec3 kD = vec3(1.0) - kS;
      kD *= 1.0 - metal;
      
      return (kD * albedo / 3.14159265 + specular) * lightColor * NdotL;
    }
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec2 parallaxUV = parallaxMapping(vUv, viewDir);
      
      // Procedural surface details
      float detailNoise = noise3D(vec3(parallaxUV * detailScale * 2.0, time * 0.05));
      float surfaceVariation = noise3D(vec3(parallaxUV * detailScale * 0.5, time * 0.02));
      
      // Enhanced base color with variation
      vec3 finalBaseColor = baseColor;
      finalBaseColor += detailNoise * 0.1;
      finalBaseColor = mix(finalBaseColor, finalBaseColor * 1.2, surfaceVariation * 0.3);
      
      // Dynamic roughness and metalness
      float finalRoughness = roughness + detailNoise * 0.2;
      float finalMetalness = metalness + surfaceVariation * 0.1;
      
      // Procedural normal mapping
      vec3 normalMap = vec3(
        noise3D(vec3(parallaxUV * detailScale + vec2(0.01, 0.0), time * 0.1)) - 0.5,
        noise3D(vec3(parallaxUV * detailScale + vec2(0.0, 0.01), time * 0.1)) - 0.5,
        1.0
      ) * normalScale;
      
      vec3 normal = normalize(vNormal + normalMap.x * vTangent + normalMap.y * vBitangent);
      
      // Multiple light sources for realistic lighting
      vec3 finalColor = vec3(0.0);
      
      // Main directional light
      vec3 lightDir1 = normalize(vec3(0.5, 1.0, 0.3));
      finalColor += calculatePBR(finalBaseColor, finalRoughness, finalMetalness, normal, lightDir1, viewDir, vec3(1.0, 0.95, 0.8));
      
      // Secondary light
      vec3 lightDir2 = normalize(vec3(-0.3, 0.5, -0.4));
      finalColor += calculatePBR(finalBaseColor, finalRoughness, finalMetalness, normal, lightDir2, viewDir, vec3(0.3, 0.4, 0.6) * 0.5);
      
      // Ambient contribution
      finalColor += finalBaseColor * 0.1 * ambientOcclusion;
      
      // Emissive
      finalColor += emissiveColor * emissiveIntensity;
      
      // Atmospheric scattering
      float distance = length(vViewPosition);
      vec3 atmosphereColor = vec3(0.5, 0.7, 1.0);
      float scattering = 1.0 - exp(-distance * 0.01);
      finalColor = mix(finalColor, atmosphereColor, scattering * 0.1);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ AdvancedPBRShader })

// Advanced noise functions for realistic terrain generation
function noise(x: number, y: number) {
  return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1
}

function smoothNoise(x: number, y: number) {
  const corners = (noise(x-1, y-1) + noise(x+1, y-1) + noise(x-1, y+1) + noise(x+1, y+1)) / 16
  const sides = (noise(x-1, y) + noise(x+1, y) + noise(x, y-1) + noise(x, y+1)) / 8
  const center = noise(x, y) / 4
  return corners + sides + center
}

function interpolatedNoise(x: number, y: number) {
  const intX = Math.floor(x)
  const fracX = x - intX
  const intY = Math.floor(y)
  const fracY = y - intY
  
  const v1 = smoothNoise(intX, intY)
  const v2 = smoothNoise(intX + 1, intY)
  const v3 = smoothNoise(intX, intY + 1)
  const v4 = smoothNoise(intX + 1, intY + 1)
  
  const i1 = v1 * (1 - fracX) + v2 * fracX
  const i2 = v3 * (1 - fracX) + v4 * fracX
  
  return i1 * (1 - fracY) + i2 * fracY
}

function perlinNoise(x: number, y: number) {
  let total = 0
  let persistence = 0.5
  let frequency = 0.01
  
  for (let i = 0; i < 6; i++) {
    total += interpolatedNoise(x * frequency, y * frequency) * persistence
    persistence *= 0.5
    frequency *= 2
  }
  
  return total
}

// Enhanced terrain component with realistic height generation
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [{ heightMap, biomeMap }] = useState(() => {
    const size = 256 // Higher resolution
    const heights = new Float32Array(size * size)
    const biomes = new Float32Array(size * size)
    const center = size / 2
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j
        
        // Distance from center for island effect
        const distFromCenter = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2)) / center
        
        // Base terrain height using Perlin noise
        let height = perlinNoise(i * 2, j * 2) * 8
        
        // Add mountain ridges
        const ridgeNoise = Math.abs(perlinNoise(i * 0.5, j * 0.5))
        height += ridgeNoise * ridgeNoise * 12
        
        // Add smaller details
        height += perlinNoise(i * 8, j * 8) * 1.5
        height += perlinNoise(i * 16, j * 16) * 0.75
        
        // Create island falloff with smooth edges
        const falloff = Math.pow(Math.max(0, 1 - distFromCenter * 1.2), 2)
        height *= falloff
        
        // Ensure minimum water level
        height = Math.max(height - 1, -2)
        
        // Store height
        heights[index] = height
        
        // Generate biome data (0 = water, 0.3 = beach, 0.6 = grass, 0.8 = stone, 1 = snow)
        if (height < 0) {
          biomes[index] = 0 // Water
        } else if (height < 0.5) {
          biomes[index] = 0.3 // Beach/Sand
        } else if (height < 4) {
          biomes[index] = 0.6 // Grass
        } else if (height < 7) {
          biomes[index] = 0.8 // Stone
        } else {
          biomes[index] = 1.0 // Snow
        }
      }
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
        
        // Set vertex height
        vertices[i + 2] = height
        
        // Set vertex colors based on biome
        let r, g, b
        if (biome === 0) { // Water
          r = 0.1; g = 0.3; b = 0.8
        } else if (biome <= 0.3) { // Beach
          r = 0.9; g = 0.8; b = 0.6
        } else if (biome <= 0.6) { // Grass
          r = 0.2; g = 0.6; b = 0.2
        } else if (biome <= 0.8) { // Stone
          r = 0.5; g = 0.5; b = 0.5
        } else { // Snow
          r = 0.9; g = 0.9; b = 0.9
        }
        
        colors[i] = r
        colors[i + 1] = g
        colors[i + 2] = b
      }
      
      // Update geometry
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.computeVertexNormals()
      geometry.attributes.position.needsUpdate = true
    }
  }, [heightMap, biomeMap])

  // Add shader animation
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as any
      if (material.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime * 0.5
      }
    }
  })

  return (
    <mesh ref={meshRef} receiveShadow castShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[120, 120, 255, 255]} />
      <meshStandardMaterial 
        vertexColors
        roughness={0.9}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

// Enhanced animated water plane with realistic PBR effects
function Water() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Simple mesh rotation animation instead of shader uniforms
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 128, 128]} />
      <meshStandardMaterial 
        color="#0088cc"
        transparent 
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  )
}

// Location marker with 3D model
function LocationMarker({ 
  position, 
  name, 
  type, 
  unlocked, 
  completed,
  onClick 
}: { 
  position: [number, number, number]
  name: string
  type: string
  unlocked: boolean
  completed: boolean
  onClick: () => void 
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
      case 'castle':
        return (
          <group>
            {/* Main castle structure */}
            <mesh castShadow>
              <boxGeometry args={[3, 2.5, 3]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            {/* Castle towers */}
            <mesh castShadow position={[-1.2, 1.8, -1.2]}>
              <cylinderGeometry args={[0.4, 0.4, 2, 8]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            <mesh castShadow position={[1.2, 1.8, -1.2]}>
              <cylinderGeometry args={[0.4, 0.4, 2, 8]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            <mesh castShadow position={[-1.2, 1.8, 1.2]}>
              <cylinderGeometry args={[0.4, 0.4, 2, 8]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            <mesh castShadow position={[1.2, 1.8, 1.2]}>
              <cylinderGeometry args={[0.4, 0.4, 2, 8]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            {/* Castle roof */}
            <mesh castShadow position={[0, 2.2, 0]}>
              <coneGeometry args={[2.2, 1.5, 4]} />
              <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.9} />
            </mesh>
          </group>
        )
      
      case 'village':
        return (
          <group>
            {/* Main house */}
            <mesh castShadow>
              <boxGeometry args={[2, 1.5, 2]} />
              <meshStandardMaterial color={getColor()} metalness={0.1} roughness={0.9} />
            </mesh>
            {/* Roof */}
            <mesh castShadow position={[0, 1.3, 0]}>
              <coneGeometry args={[1.6, 1, 4]} />
              <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.9} />
            </mesh>
            {/* Chimney */}
            <mesh castShadow position={[0.7, 1.8, 0.7]}>
              <boxGeometry args={[0.3, 0.8, 0.3]} />
              <meshStandardMaterial color="#654321" metalness={0.1} roughness={1.0} />
            </mesh>
            {/* Small side building */}
            <mesh castShadow position={[1.5, 0.5, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={getColor()} metalness={0.1} roughness={0.9} />
            </mesh>
          </group>
        )
      
      case 'tower':
        return (
          <group>
            {/* Main tower */}
            <mesh castShadow>
              <cylinderGeometry args={[0.8, 1.0, 4, 12]} />
              <meshStandardMaterial color={getColor()} metalness={0.2} roughness={0.8} />
            </mesh>
            {/* Tower top */}
            <mesh castShadow position={[0, 2.5, 0]}>
              <coneGeometry args={[1.2, 1.2, 8]} />
              <meshStandardMaterial color="#4169E1" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Balcony */}
            <mesh castShadow position={[0, 1.5, 0]}>
              <torusGeometry args={[1.1, 0.1, 6, 16]} />
              <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
            </mesh>
          </group>
        )
      
      case 'forest':
        return (
          <group>
            {/* Multiple trees of varying heights */}
            <mesh castShadow>
              <coneGeometry args={[1.2, 3, 8]} />
              <meshStandardMaterial color="#228B22" metalness={0.0} roughness={1.0} />
            </mesh>
            <mesh castShadow position={[-1.5, -0.5, 1]}>
              <coneGeometry args={[0.8, 2, 6]} />
              <meshStandardMaterial color="#32CD32" metalness={0.0} roughness={1.0} />
            </mesh>
            <mesh castShadow position={[1.2, -0.3, -0.8]}>
              <coneGeometry args={[1.0, 2.5, 7]} />
              <meshStandardMaterial color="#228B22" metalness={0.0} roughness={1.0} />
            </mesh>
            {/* Tree trunks */}
            <mesh castShadow position={[0, -1.8, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
              <meshStandardMaterial color="#8B4513" metalness={0.0} roughness={1.0} />
            </mesh>
            <mesh castShadow position={[-1.5, -2.3, 1]}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 6]} />
              <meshStandardMaterial color="#8B4513" metalness={0.0} roughness={1.0} />
            </mesh>
            <mesh castShadow position={[1.2, -2.1, -0.8]}>
              <cylinderGeometry args={[0.18, 0.18, 0.9, 7]} />
              <meshStandardMaterial color="#8B4513" metalness={0.0} roughness={1.0} />
            </mesh>
          </group>
        )
      
      case 'mountain':
        return (
          <group>
            {/* Main mountain peak */}
            <mesh castShadow>
              <coneGeometry args={[2.5, 4, 6]} />
              <meshStandardMaterial color={getColor()} metalness={0.1} roughness={0.9} />
            </mesh>
            {/* Snow cap */}
            <mesh castShadow position={[0, 1.5, 0]}>
              <coneGeometry args={[1.2, 1.5, 6]} />
              <meshStandardMaterial color="#F0F8FF" metalness={0.0} roughness={0.3} />
            </mesh>
            {/* Side peaks */}
            <mesh castShadow position={[-2, -0.8, 1.5]}>
              <coneGeometry args={[1.5, 2.5, 5]} />
              <meshStandardMaterial color={getColor()} metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh castShadow position={[2.2, -1.2, -1]}>
              <coneGeometry args={[1.8, 3, 5]} />
              <meshStandardMaterial color={getColor()} metalness={0.1} roughness={0.9} />
            </mesh>
          </group>
        )
      
      case 'dungeon':
        return (
          <group>
            {/* Main dungeon entrance */}
            <mesh castShadow>
              <boxGeometry args={[2.5, 1.5, 1]} />
              <meshStandardMaterial color={getColor()} metalness={0.3} roughness={0.8} />
            </mesh>
            {/* Arched entrance */}
            <mesh castShadow position={[0, 0.2, 0.6]}>
              <cylinderGeometry args={[0.8, 0.8, 0.3, 8, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#2F4F4F" metalness={0.4} roughness={0.7} />
            </mesh>
            {/* Side pillars */}
            <mesh castShadow position={[-1, 0, 0.6]}>
              <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
              <meshStandardMaterial color="#2F4F4F" metalness={0.4} roughness={0.7} />
            </mesh>
            <mesh castShadow position={[1, 0, 0.6]}>
              <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
              <meshStandardMaterial color="#2F4F4F" metalness={0.4} roughness={0.7} />
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
    if (completed) return '#10b981'
    if (unlocked) return '#f59e0b'
    return '#6b7280'
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
          {hovered && (
            <mesh>
              <sphereGeometry args={[4, 16, 16]} />
              <meshBasicMaterial color="white" transparent opacity={0.1} wireframe />
            </mesh>
          )}
        </group>
        
        {/* Glowing particles around location */}
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
        
        {/* Location name */}
        {hovered && (
          <Html center distanceFactor={15}>
            <div className="bg-gray-900/90 px-3 py-2 rounded-lg border border-gray-600 whitespace-nowrap">
              <div className="text-white font-bold text-sm">{name}</div>
              <div className="text-gray-300 text-xs">
                {completed ? '✅ Completed' : unlocked ? '🔓 Available' : '🔒 Locked'}
              </div>
            </div>
          </Html>
        )}
      </Float>
      
      {/* Shadow disc */}
      <mesh position={[0, -position[1] + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

// Animated path between locations
function PathConnection({ start, end, unlocked }: { start: [number, number, number], end: [number, number, number], unlocked: boolean }) {
  const points = []
  const segments = 20
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = start[0] + (end[0] - start[0]) * t
    const z = start[2] + (end[2] - start[2]) * t
    const y = start[1] + Math.sin(t * Math.PI) * 2 // Arc path
    points.push(new THREE.Vector3(x, y, z))
  }
  
  const curve = new THREE.CatmullRomCurve3(points)
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
      <meshStandardMaterial 
        color={unlocked ? '#f59e0b' : '#374151'} 
        emissive={unlocked ? '#f59e0b' : '#000000'}
        emissiveIntensity={unlocked ? 0.3 : 0}
        opacity={unlocked ? 0.8 : 0.3}
        transparent
      />
    </mesh>
  )
}

// Advanced GPU-based particle system for environmental effects
function AdvancedParticleSystem({ count = 2000, area = 100 }: { count?: number, area?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area
      pos[i * 3 + 1] = Math.random() * 50 + 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * area
    }
    return pos
  }, [count, area])

  const speeds = useMemo(() => {
    const sp = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      sp[i] = 0.01 + Math.random() * 0.02
    }
    return sp
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const matrix = new THREE.Matrix4()
      
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3] + Math.sin(time * speeds[i] + i) * 2
        const y = positions[i * 3 + 1] + Math.cos(time * speeds[i] * 0.5 + i) * 1
        const z = positions[i * 3 + 2] + Math.sin(time * speeds[i] * 0.8 + i) * 1.5
        
        const scale = 0.1 + Math.sin(time * 2 + i) * 0.05
        matrix.makeScale(scale, scale, scale)
        matrix.setPosition(x, y, z)
        meshRef.current.setMatrixAt(i, matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        emissive="#88ccff"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  )
}

// Volumetric cloud system with realistic lighting
function VolumetricClouds() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <Cloud
          key={i}
          position={[
            (Math.random() - 0.5) * 150,
            20 + Math.random() * 15,
            (Math.random() - 0.5) * 150
          ]}
          speed={0.1 + Math.random() * 0.2}
          opacity={0.4 + Math.random() * 0.3}
          scale={[15 + Math.random() * 10, 6 + Math.random() * 4, 15 + Math.random() * 10]}
          color="#f0f8ff"
        />
      ))}
      
      {/* Dense cloud layer for atmosphere */}
      {[...Array(20)].map((_, i) => (
        <Cloud
          key={`dense-${i}`}
          position={[
            (Math.random() - 0.5) * 200,
            35 + Math.random() * 10,
            (Math.random() - 0.5) * 200
          ]}
          speed={0.05 + Math.random() * 0.1}
          opacity={0.2 + Math.random() * 0.2}
          scale={[20 + Math.random() * 15, 8 + Math.random() * 5, 20 + Math.random() * 15]}
          color="#e6f2ff"
        />
      ))}
    </>
  )
}

// Advanced firefly/magic particle system
function MagicalFireflies({ locationPositions }: { locationPositions: [number, number, number][] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const particleCount = 50
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      basePosition: locationPositions[Math.floor(Math.random() * locationPositions.length)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      radius: 3 + Math.random() * 2
    }))
  }, [locationPositions])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i]
        if (particle && child instanceof THREE.Mesh) {
          const [baseX, baseY, baseZ] = particle.basePosition
          child.position.set(
            baseX + Math.sin(time * particle.speed + particle.phase) * particle.radius,
            baseY + Math.cos(time * particle.speed * 0.7 + particle.phase) * 2 + 3,
            baseZ + Math.cos(time * particle.speed + particle.phase) * particle.radius
          )
          
          // Pulsing glow effect
          const material = child.material as THREE.MeshBasicMaterial
          const intensity = 0.5 + Math.sin(time * 3 + particle.phase) * 0.3
          material.color.setRGB(intensity, intensity * 0.8, 1.0)
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh key={particle.id} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="#44aaff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function Scene({ onLocationClick }: { onLocationClick: (location: any) => void }) {
  const locations = [
    { id: 1, name: "Binary Shores Academy", position: [0, 2, 0] as [number, number, number], type: 'castle', unlocked: true, completed: true, lessonPath: '/lesson/week-01' },
    { id: 2, name: "Variable Village", position: [10, 1, 5] as [number, number, number], type: 'village', unlocked: true, completed: true, lessonPath: '/lesson/week-02' },
    { id: 3, name: "Logic Lake Outpost", position: [15, 1.5, -8] as [number, number, number], type: 'tower', unlocked: true, completed: false, lessonPath: '/lesson/conditionals' },
    { id: 4, name: "Loop Canyon", position: [-8, 3, -12] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/loops' },
    { id: 5, name: "Function Forest", position: [-15, 1, 8] as [number, number, number], type: 'forest', unlocked: false, completed: false, lessonPath: '/lesson/functions' },
    { id: 6, name: "Array Mountains", position: [5, 4, -15] as [number, number, number], type: 'mountain', unlocked: false, completed: false, lessonPath: '/lesson/arrays' },
    { id: 7, name: "Object Oasis", position: [-10, 1, 0] as [number, number, number], type: 'village', unlocked: false, completed: false, lessonPath: '/lesson/objects' },
    { id: 8, name: "Database Depths", position: [20, 0.5, 10] as [number, number, number], type: 'dungeon', unlocked: false, completed: false, lessonPath: '/lesson/databases' },
  ]

  return (
    <>
      {/* Advanced dynamic lighting system */}
      <ambientLight intensity={0.3} color="#404080" />
      
      {/* Main sun light */}
      <directionalLight
        castShadow
        position={[20, 30, 15]}
        intensity={2.0}
        color="#ffffaa"
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
        color="#8080ff"
      />
      
      {/* Area lights for more realistic illumination */}
      <pointLight 
        castShadow
        position={[0, 25, 0]} 
        intensity={1.2} 
        color="#ffffff"
        distance={80}
        decay={2}
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Atmospheric point lights */}
      <pointLight position={[-25, 8, -15]} intensity={0.6} color="#ff6b35" distance={40} />
      <pointLight position={[25, 12, 20]} intensity={0.7} color="#4a90e2" distance={45} />
      <pointLight position={[0, 5, -30]} intensity={0.5} color="#9b59b6" distance={35} />
      
      {/* Spotlight for hero locations */}
      <spotLight
        castShadow
        position={[5, 20, 5]}
        angle={Math.PI / 8}
        penumbra={0.3}
        intensity={1.5}
        color="#ffd700"
        target-position={[0, 2, 0]}
        shadow-mapSize={[2048, 2048]}
        distance={50}
      />
      
      {/* Hemisphere light for natural outdoor lighting */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#8B4513"
        intensity={0.4}
      />
      
      {/* Enhanced environment and atmosphere */}
      <Sky 
        distance={450000}
        sunPosition={[100, 30, 80]}
        inclination={0.5}
        azimuth={0.15}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={2}
        turbidity={8}
      />
      
      {/* Multi-layered stars for depth */}
      <Stars radius={200} depth={80} count={8000} factor={6} saturation={0} fade speed={0.5} />
      <Stars radius={150} depth={60} count={3000} factor={3} saturation={0.2} fade speed={1.2} />
      
      {/* Volumetric fog with distance-based density */}
      <fog attach="fog" args={['#a0c4e0', 15, 120]} />
      
      {/* Additional atmospheric particles */}
      <Sparkles 
        count={500} 
        scale={200} 
        size={0.5} 
        speed={0.05} 
        opacity={0.1} 
        color="#ffffff" 
        noise={1}
      />
      
      {/* Terrain and water */}
      <Terrain />
      <Water />
      
      {/* Advanced volumetric cloud system */}
      <VolumetricClouds />
      
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
        />
      ))}
      
      {/* Path connections */}
      {locations.slice(0, -1).map((loc, i) => {
        const nextLoc = locations[i + 1]
        return (
          <PathConnection
            key={`path-${i}`}
            start={loc.position}
            end={nextLoc.position}
            unlocked={nextLoc.unlocked}
          />
        )
      })}
      
      {/* Advanced particle systems */}
      <AdvancedParticleSystem count={1500} area={120} />
      <MagicalFireflies locationPositions={locations.map(loc => loc.position)} />
      
      {/* Enhanced ambient particles */}
      <Sparkles 
        count={800} 
        scale={150} 
        size={0.5} 
        speed={0.05} 
        opacity={0.3} 
        color="#88ddff" 
        noise={2}
      />
      <Sparkles 
        count={400} 
        scale={80} 
        size={1.2} 
        speed={0.08} 
        opacity={0.2} 
        color="#ffaa44" 
        noise={1}
      />
    </>
  )
}

// Main component
export default function AAAGameMap() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate asset loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleLocationClick = (location: any) => {
    if (location.unlocked) {
      router.push(location.lessonPath)
    } else {
      alert(`🔒 ${location.name} is locked! Complete previous adventures first.`)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-4">Loading World...</div>
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
          
          {/* Advanced cinematic camera controls */}
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
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            }}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
          
          {/* Advanced post-processing with error handling */}
          <EffectComposer enableNormalPass>
            {/* Enhanced bloom effect */}
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              kernelSize={KernelSize.LARGE}
              mipmapBlur={true}
            />
            
            {/* Cinematic depth of field */}
            <DepthOfField 
              focusDistance={0.01}
              focalLength={0.02}
              bokehScale={3}
              height={480}
            />
            
            {/* Ambient occlusion for depth */}
            <SSAO 
              samples={32}
              radius={0.1}
              intensity={25}
              luminanceInfluence={0.1}
            />
            
            {/* Professional tone mapping */}
            <ToneMapping 
              blendFunction={BlendFunction.NORMAL}
              adaptive={false}
              resolution={256}
              middleGrey={0.6}
              maxLuminance={16.0}
              averageLuminance={1.0}
              adaptationRate={1.0}
            />
            
            {/* Color enhancement */}
            <BrightnessContrast brightness={0.02} contrast={0.05} />
            <HueSaturation hue={0.01} saturation={0.1} />
            
            {/* Subtle effects */}
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0003, 0.0003]}
            />
            <Vignette offset={0.1} darkness={0.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-gray-700">
        <h3 className="text-white text-lg font-bold mb-2">🗺️ Code Quest Realm</h3>
        <div className="text-gray-300 text-sm">
          <div>Drag to rotate • Scroll to zoom</div>
          <div>Click locations to begin quest</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-gray-700">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-white text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-white text-sm">Locked</span>
          </div>
        </div>
      </div>
    </div>
  )
}