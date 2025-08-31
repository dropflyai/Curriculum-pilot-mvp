'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AITutorMonitoring from '@/components/AITutorMonitoring'
import { Bot, Users, BookOpen, BarChart3 } from 'lucide-react'

export default function TeacherDashboard() {
  const { isAuthenticated, isTeacher, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-monitoring' | 'analytics' | 'management'>('overview')

  // Authentication check
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isTeacher)) {
      router.push('/auth?role=teacher')
    }
  }, [isAuthenticated, isTeacher, authLoading, router])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading CodeFly Teacher Dashboard... ✈️</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CodeFly Teacher Dashboard
              </h1>
              <p className="mt-1 text-lg text-purple-300 font-medium">9th Grade Computer Science • Real-time Classroom Management</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              Classroom Overview
            </button>
            <button
              onClick={() => setActiveTab('ai-monitoring')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'ai-monitoring'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Bot className="h-4 w-4" />
              AI Tutor Monitoring
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics & Reports
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'management'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Class Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'ai-monitoring' ? (
          <AITutorMonitoring />
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {activeTab === 'overview' && 'Classroom Overview'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
              {activeTab === 'management' && 'Class Management'}
            </h2>
            <p className="text-gray-300">
              {activeTab === 'overview' && 'Student progress and real-time monitoring coming soon!'}
              {activeTab === 'analytics' && 'Detailed analytics and reporting features coming soon!'}
              {activeTab === 'management' && 'Advanced classroom management tools coming soon!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}