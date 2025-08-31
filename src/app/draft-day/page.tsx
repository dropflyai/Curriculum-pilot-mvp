'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DraftDay from '@/components/DraftDay'
import { ArrowLeft, Trophy, Info } from 'lucide-react'
import Link from 'next/link'

export default function DraftDayPage() {
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
          <p className="text-gray-400 mb-6">You need to be logged in to participate in Draft Day.</p>
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
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Draft Day Experience</h1>
                <p className="text-gray-300 mt-1">
                  Interactive team formation through strategic student selection
                </p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-right">
              <div className="text-sm text-gray-400">Logged in as</div>
              <div className="text-white font-semibold">{user.full_name || user.email}</div>
              <div className="text-xs text-cyan-400 capitalize">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Draft Day Component */}
        <DraftDay 
          isTeacher={isTeacher}
          className="max-w-full"
        />

        {/* Quick Navigation */}
        <div className="mt-6 flex justify-center">
          <Link 
            href="/teams" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Try Team Formation Instead
          </Link>
        </div>

        {/* Draft Day Instructions */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-400/30 p-6">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-purple-400 mr-2" />
            <h2 className="text-lg font-semibold text-purple-300">How Draft Day Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-yellow-400">1. Captain Selection</h3>
              <p>Team captains are chosen based on performance, volunteers, teacher selection, or random assignment.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-cyan-400">2. Snake Draft</h3>
              <p>Captains take turns selecting teammates in a snake pattern (1-2-3-3-2-1) for fair distribution.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-green-400">3. Strategic Selection</h3>
              <p>View student skills, collaboration ratings, and programming abilities to make informed picks.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-orange-400">4. Time Limits</h3>
              <p>Each pick has a 5-minute time limit to maintain engagement and prevent delays.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-pink-400">5. Pick Reasoning</h3>
              <p>Captains can provide reasons for their selections to build team chemistry and communication.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-purple-400">6. Team Formation</h3>
              <p>Final teams are automatically created with balanced rosters for collaborative coding projects.</p>
            </div>
          </div>
        </div>

        {/* Teacher Controls Info */}
        {isTeacher && (
          <div className="mt-6 bg-blue-900/20 rounded-xl border border-blue-400/30 p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Teacher Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-green-400 mb-1">Available Actions:</h4>
                <ul className="space-y-1">
                  <li>• Pause/Resume draft process</li>
                  <li>• Skip inactive captains</li>
                  <li>• End draft early if needed</li>
                  <li>• Monitor real-time progress</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Draft Analytics:</h4>
                <ul className="space-y-1">
                  <li>• Track pick timing and strategy</li>
                  <li>• Monitor student engagement</li>
                  <li>• View team balance metrics</li>
                  <li>• Export final team rosters</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}