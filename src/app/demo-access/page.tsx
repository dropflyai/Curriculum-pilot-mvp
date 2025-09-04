'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoAccess() {
  const router = useRouter()

  useEffect(() => {
    // Set demo authentication
    const demoUser = {
      id: 'demo-student-123',
      email: 'demo@codefly.ai',
      full_name: 'Demo Student',
      role: 'student'
    }

    // Store demo authentication
    localStorage.setItem('demo_authenticated', 'true')
    localStorage.setItem('demo_user', JSON.stringify(demoUser))
    
    // Set cookies as well for middleware
    document.cookie = 'demo_authenticated=true; path=/'
    document.cookie = `demo_user=${JSON.stringify(demoUser)}; path=/`
    document.cookie = `user_role=student; path=/`

    // Redirect to mission HQ
    setTimeout(() => {
      router.push('/mission-hq')
    }, 500)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-8"></div>
        <h1 className="text-2xl font-bold text-white mb-4">Setting up demo access...</h1>
        <p className="text-gray-400">Redirecting to Mission HQ</p>
      </div>
    </div>
  )
}