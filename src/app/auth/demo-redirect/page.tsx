'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Get the type from URL params
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type')
    
    if (type === 'student' || type === 'teacher') {
      // Set demo user in localStorage
      const mockUser = {
        id: `demo-${type}`,
        email: `${type}@codefly.demo`,
        full_name: type === 'teacher' ? 'Ms. Sarah Demo Teacher' : 'Alex Demo Student',
        role: type
      }
      
      localStorage.setItem('demo_user', JSON.stringify(mockUser))
      localStorage.setItem('demo_authenticated', 'true')
      
      // Force a small delay to ensure localStorage is set
      setTimeout(() => {
        // Redirect based on role
        if (type === 'teacher') {
          window.location.href = '/teacher'
        } else {
          window.location.href = '/dashboard'
        }
      }, 100)
    } else {
      // Invalid type, go back to auth
      router.push('/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up demo account...</p>
      </div>
    </div>
  )
}