'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Import lessons directly to avoid any import issues
import { pythonLessons, PythonLesson } from '@/lib/python-lessons'

export default function PythonLessonPage() {
  const params = useParams()
  const lessonId = params.id as string
  const [lesson, setLesson] = useState<PythonLesson | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    try {
      console.log('Looking for lesson ID:', lessonId)
      console.log('Available lessons:', pythonLessons?.map(l => l.id))
      
      const foundLesson = pythonLessons?.find(l => l.id === lessonId)
      console.log('Found lesson:', foundLesson)
      
      setLesson(foundLesson || null)
      setDebugInfo(`
        Lesson ID: ${lessonId}
        Available IDs: ${pythonLessons?.map(l => l.id).join(', ') || 'None'}
        Lessons count: ${pythonLessons?.length || 0}
        Found: ${foundLesson ? 'Yes' : 'No'}
      `)
    } catch (error) {
      console.error('Error loading lesson:', error)
      setDebugInfo(`Error: ${error}`)
    }
  }, [lessonId])

  // Show debug info if lesson not found
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navigation />
        <div className="navigation-aware flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <div className="text-white text-2xl mb-4">
              🔍 Lesson Debug Info
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6 text-left">
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                {debugInfo}
              </pre>
            </div>
            <div className="text-white text-xl mb-4">
              Python Lessons Status: {pythonLessons ? 'Loaded' : 'Not Loaded'}
            </div>
            {pythonLessons && (
              <div className="bg-blue-900/30 rounded-lg p-4 mb-4">
                <h3 className="text-blue-200 font-bold mb-2">Available Lessons:</h3>
                {pythonLessons.map(l => (
                  <div key={l.id} className="text-blue-100 text-sm mb-1">
                    {l.id} - {l.title}
                  </div>
                ))}
              </div>
            )}
            <Link 
              href="/agent-academy-intel"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show simple lesson info if found
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      <div className="navigation-aware p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">{lesson.emoji}</div>
              <div>
                <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
                <p className="text-purple-200">{lesson.subtitle}</p>
              </div>
            </div>
            
            <p className="text-purple-200 text-lg mb-6">{lesson.description}</p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-600/20 rounded-lg p-4">
                <div className="text-yellow-400 font-bold text-2xl">{lesson.total_xp}</div>
                <div className="text-purple-200">Total XP</div>
              </div>
              <div className="bg-blue-600/20 rounded-lg p-4">
                <div className="text-blue-400 font-bold text-2xl">{lesson.challenges.length}</div>
                <div className="text-purple-200">Challenges</div>
              </div>
              <div className="bg-green-600/20 rounded-lg p-4">
                <div className="text-green-400 font-bold text-2xl">Week {lesson.week}</div>
                <div className="text-purple-200">Course Week</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-white text-lg mb-4">
                ✅ Lesson Found Successfully!
              </div>
              <p className="text-purple-200 mb-6">
                This is a basic view. The full interactive lesson viewer will load here once we confirm the routing is working.
              </p>
              <Link 
                href="/agent-academy-intel"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}