'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Enhanced AAA quality 3D map with advanced rendering
const AAAGameMap = dynamic(() => import('@/components/AAAGameMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-black">
      <div className="text-center text-white">
        <div className="text-2xl font-bold mb-4">Loading AAA Game Map...</div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  )
})

export default function TestAAAMap() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded">
        <h3>AAA Map Testing Page</h3>
        <p>Testing advanced 3D functionality with complex shaders</p>
      </div>
      
      <Suspense fallback={
        <div className="h-full flex items-center justify-center bg-black text-white">
          <div>Loading Suspense Fallback...</div>
        </div>
      }>
        <AAAGameMap />
      </Suspense>
    </div>
  )
}