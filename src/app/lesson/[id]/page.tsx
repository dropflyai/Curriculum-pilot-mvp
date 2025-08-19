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
  const [lesson, setLesson] = useState(getLessonById(params.id as string))

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth')
    }
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

  if (!isAuthenticated) {
    return null
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-500">
              Lesson • {lesson.difficulty} • {lesson.estimatedTime}
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