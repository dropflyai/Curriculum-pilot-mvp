'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Lesson, Progress } from '@/lib/supabase'
import { BookOpen, Clock, CheckCircle, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .order('week', { ascending: true })

        if (lessonsError) throw lessonsError

        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')

        if (progressError) throw progressError

        setLessons(lessonsData || [])
        setProgress(progressData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const getProgressForLesson = (lessonId: string): Progress | undefined => {
    return progress.find(p => p.lesson_id === lessonId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'submitted': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'submitted': return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'in_progress': return <PlayCircle className="h-5 w-5 text-yellow-600" />
      default: return <BookOpen className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Coding Journey</h1>
              <p className="mt-1 text-sm text-gray-500">9th Grade Computer Science</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Progress: {progress.filter(p => p.status === 'completed').length} / {lessons.length} lessons
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
          <p className="text-blue-100 mb-4">
            Ready to continue your coding adventure? Each lesson builds on the last, 
            so let&apos;s keep that momentum going!
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Completed: {progress.filter(p => p.status === 'completed').length}</span>
            </div>
            <div className="flex items-center">
              <PlayCircle className="h-5 w-5 mr-2" />
              <span>In Progress: {progress.filter(p => p.status === 'in_progress').length}</span>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const lessonProgress = getProgressForLesson(lesson.id)
            const status = lessonProgress?.status || 'not_started'
            
            return (
              <Link 
                key={lesson.id} 
                href={`/lesson/${lesson.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  {/* Status Bar */}
                  <div className={`h-2 ${getStatusColor(status)}`}></div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Week {lesson.week}</div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    {/* Objectives Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {lesson.objectives[0]}
                      </p>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration_minutes} min
                      </div>
                      <div className="capitalize px-2 py-1 rounded-full text-xs font-medium" 
                           style={{
                             backgroundColor: status === 'completed' ? '#dcfce7' : 
                                           status === 'in_progress' ? '#fef3c7' : '#f3f4f6',
                             color: status === 'completed' ? '#166534' : 
                                   status === 'in_progress' ? '#92400e' : '#374151'
                           }}>
                        {status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
            <p className="text-gray-600">
              Your lessons will appear here once your teacher sets up the curriculum.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}