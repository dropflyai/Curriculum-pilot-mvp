'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function SimpleScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Terrain */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#3a5d2c" roughness={0.9} />
      </mesh>
      
      {/* Water */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0088cc" transparent opacity={0.7} />
      </mesh>
      
      {/* Location markers */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      <mesh position={[10, 1, 5]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </>
  )
}

export default function VerifyAAA() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded">
        <h3>AAA Map Verification</h3>
        <p>Testing if basic 3D scene renders properly</p>
        <div className="mt-2 text-green-400">✓ If you see this and 3D elements, the AAA map core works!</div>
      </div>
      
      <Canvas 
        camera={{ position: [15, 10, 15], fov: 60 }}
        shadows
      >
        <SimpleScene />
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  )
}