'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the proper student dashboard
    router.replace('/student/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
        <h1 className="text-2xl text-white font-bold mb-2">Redirecting to Student Dashboard...</h1>
        <p className="text-gray-400">Taking you to your CodeFly adventure!</p>
      </div>
    </div>
  )
}