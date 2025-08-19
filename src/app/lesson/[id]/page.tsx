'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getLessonById } from '@/lib/lesson-data'
import LessonViewer from '@/components/LessonViewer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LessonPage() {
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lesson] = useState(getLessonById(params.id as string))

  useEffect(() => {
    // TEMPORARY: Allow lesson access for testing
    // if (!loading && !isAuthenticated) {
    //   router.push('/auth')
    // }
  }, [isAuthenticated, loading, router])

  const handleLessonComplete = (progress: number) => {
    console.log(`Lesson progress: ${progress}%`)
    // Here you would save progress to Supabase
    // saveProgressToDatabase(lesson.id, progress)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // TEMPORARY: Skip auth check for testing
  // if (!isAuthenticated) {
  //   return null
  // }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The lesson you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/dashboard"
              className="flex items-center text-purple-300 hover:text-white transition-colors font-medium group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              ← Back to CodeFly Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg ${
                lesson.difficulty === 'beginner' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                lesson.difficulty === 'intermediate' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                'bg-gradient-to-r from-red-400 to-pink-500 text-white'
              }`}>
                {lesson.difficulty} {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🚀' : '🏆'}
              </span>
              <span className="text-sm text-purple-300 bg-purple-900/30 px-4 py-2 rounded-full font-medium border border-purple-500/30">
                ⏱️ {lesson.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="py-8">
        <LessonViewer
          title={lesson.title}
          description={lesson.description}
          sections={lesson.sections}
          onLessonComplete={handleLessonComplete}
        />
      </div>
    </div>
  )
}