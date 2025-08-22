'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getAILesson } from '@/lib/lesson-data'
import AILessonViewer from '@/components/AILessonViewer'
import PythonLessonViewer from '@/components/PythonLessonViewer'
import RewardSystem, { getBadgesEarned } from '@/components/RewardSystem'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LessonPage() {
  const params = useParams()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [lesson] = useState(() => {
    const lessonData = getAILesson(params.id as string)
    console.log('DEBUG LESSON PAGE: Loading lesson', params.id, lessonData)
    if (lessonData?.modes?.[0]?.learn_slides) {
      console.log('DEBUG: Lesson has slides:', lessonData.modes[0].learn_slides.length)
    }
    return lessonData
  })
  const [showRewards, setShowRewards] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [quizScore, setQuizScore] = useState<number | undefined>()
  const [codeExecuted, setCodeExecuted] = useState(false)

  useEffect(() => {
    // TEMPORARY: Allow lesson access for testing
    // if (!loading && !isAuthenticated) {
    //   router.push('/auth')
    // }
  }, [isAuthenticated, loading, router])

  const handleLessonComplete = (progress: number) => {
    console.log(`Lesson progress: ${progress}%`)
    
    // Determine which badges should be earned based on progress
    const badges = getBadgesEarned(progress, quizScore, codeExecuted)
    setEarnedBadges(badges)
    
    // Show rewards modal when lesson is completed (100%)
    if (progress >= 100) {
      setShowRewards(true)
    }
    
    // Here you would save progress to Supabase
    // saveProgressToDatabase(lesson.id, progress, badges)
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
  }

  const handleCodeExecution = () => {
    setCodeExecuted(true)
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
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-300 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                lesson.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                lesson.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {lesson.difficulty}
              </span>
              <span className="text-sm text-gray-300">
                {lesson.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="py-8">
        {lesson.id === 'week-01' ? (
          <AILessonViewer
            lesson={lesson}
            onLessonComplete={handleLessonComplete}
            onQuizComplete={handleQuizComplete}
            onCodeExecution={handleCodeExecution}
          />
        ) : (
          <PythonLessonViewer
            lesson={lesson}
            onLessonComplete={handleLessonComplete}
            onQuizComplete={handleQuizComplete}
            onCodeExecution={handleCodeExecution}
          />
        )}
      </div>

      {/* Reward System Modal */}
      <RewardSystem
        show={showRewards}
        onClose={() => setShowRewards(false)}
        earnedBadges={earnedBadges}
        onRewardEarned={(badge) => console.log('Badge earned:', badge)}
        onReturnToMap={() => router.push('/dashboard')}
      />
    </div>
  )
}