'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function TestScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  )
}

export default function Test3D() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded">
        <h3>3D Test Page</h3>
        <p>Testing basic Three.js functionality</p>
      </div>
      
      <Canvas camera={{ position: [5, 5, 5] }}>
        <TestScene />
        <OrbitControls />
      </Canvas>
    </div>
  )
}