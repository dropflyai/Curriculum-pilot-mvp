'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MissionPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the main Agent Academy mission page for now
    router.push('/mission/agent-academy')
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-green-400 font-mono text-2xl animate-pulse">
        REDIRECTING TO AGENT ACADEMY...
      </div>
    </div>
  )
}
