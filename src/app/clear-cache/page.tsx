'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCache() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all localStorage
      localStorage.clear()
      
      // Clear specific cookies by setting them to expire
      const cookiesToClear = [
        'demo_user',
        'demo_authenticated',
        'supabase-auth-token',
        'supabase-refresh-token',
        'user_role'
      ]
      
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
      
      // Clear session storage as well
      sessionStorage.clear()
      
      // Redirect to home page after clearing
      setTimeout(() => {
        router.push('/')
      }, 100)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Clearing cache and cookies...</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting to homepage...</p>
      </div>
    </div>
  )
}