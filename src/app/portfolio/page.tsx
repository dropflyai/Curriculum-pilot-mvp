'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import StudentPortfolio from '@/components/StudentPortfolio'

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio... 📁</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <StudentPortfolio userId={user.id} viewMode="owner" />
    </div>
  )
}