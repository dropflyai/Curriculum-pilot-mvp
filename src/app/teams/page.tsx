'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import TeamFormation from '@/components/TeamFormation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TeamsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to access team formation.</p>
          <Link 
            href="/auth" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const isTeacher = user.role === 'teacher'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href={isTeacher ? "/teacher" : "/dashboard"} 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {isTeacher ? 'Teacher Dashboard' : 'Dashboard'}
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Team Formation</h1>
              <p className="text-gray-300 mt-1">
                Create balanced teams for collaborative coding projects
              </p>
            </div>
            
            {/* User Info */}
            <div className="text-right">
              <div className="text-sm text-gray-400">Logged in as</div>
              <div className="text-white font-semibold">{user.full_name || user.email}</div>
              <div className="text-xs text-cyan-400 capitalize">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Team Formation Component */}
        <TeamFormation 
          isTeacher={isTeacher}
          className="max-w-full"
        />

        {/* Info Section */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">About Team Formation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">Formation Methods</h3>
              <ul className="space-y-1">
                <li>• <strong>Balanced Teams:</strong> Algorithm optimizes skill distribution and collaboration ratings</li>
                <li>• <strong>Skill-Based:</strong> Groups students with complementary programming abilities</li>
                <li>• <strong>Random Assignment:</strong> Fair random distribution for quick team creation</li>
                <li>• <strong>Draft Day:</strong> Interactive captain-based selection process</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Team Analytics</h3>
              <ul className="space-y-1">
                <li>• Real-time team quality scoring and compatibility analysis</li>
                <li>• Skill distribution visualization and strength identification</li>
                <li>• Collaboration rating averages and teamwork predictions</li>
                <li>• Project requirement matching and role assignments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}