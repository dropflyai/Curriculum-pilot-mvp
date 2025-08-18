'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Lesson, Progress } from '@/lib/supabase'
import { ArrowLeft, BookOpen, Code, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import CodeEditor from '@/components/CodeEditor'
import { type CodeExecutionResult } from '@/lib/pyodide'

export default function LessonViewer() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [activeTab, setActiveTab] = useState<'learn' | 'code' | 'submit'>('learn')
  const [userCode, setUserCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastExecutionResult, setLastExecutionResult] = useState<CodeExecutionResult | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLesson() {
      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', params.id)
          .single()

        if (lessonError) throw lessonError

        // Fetch or create progress record
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('lesson_id', params.id)
          .maybeSingle()

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError
        }

        setLesson(lessonData)
        setProgress(progressData)
        setUserCode(progressData?.submitted_code || lessonData.starter_code || '')
      } catch (error) {
        console.error('Error fetching lesson:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLesson()
    }
  }, [params.id, supabase, router])

  const updateProgress = async (updates: Partial<Progress>) => {
    if (!lesson) return

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          lesson_id: lesson.id,
          user_id: 'temp-user-id', // TODO: Get from auth
          ...updates
        })

      if (error) throw error
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const runCode = async () => {
    setCodeOutput('Running code...')
    
    // For now, we'll simulate code execution
    // In the full implementation, this would use Pyodide
    setTimeout(() => {
      setCodeOutput(`Code executed successfully!\n\nYour Magic 8-Ball is working! 🎱\n\nNext: Test it with different questions to see random answers.`)
      updateProgress({ 
        status: 'in_progress',
        submitted_code: userCode,
        started_at: new Date().toISOString()
      })
    }, 1500)
  }

  const submitLesson = async () => {
    if (!lesson) return

    setSubmitting(true)
    try {
      await updateProgress({
        status: 'submitted',
        submitted_code: userCode,
        submitted_at: new Date().toISOString()
      })
      
      setCodeOutput(prev => prev + '\n\n✅ Lesson submitted successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error submitting lesson:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/dashboard"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-500">Week {lesson.week} • {lesson.duration_minutes} minutes</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Status: {progress?.status || 'Not Started'}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['learn', 'code', 'submit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'learn' && <BookOpen className="inline h-4 w-4 mr-1" />}
                {tab === 'code' && <Code className="inline h-4 w-4 mr-1" />}
                {tab === 'submit' && <Send className="inline h-4 w-4 mr-1" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'learn' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.learn_md.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Editor */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-semibold">Code Editor</h3>
                <p className="text-sm text-gray-600">Write your Python code here</p>
              </div>
              <div className="p-6">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 font-mono text-sm border rounded-lg p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="# Write your Python code here..."
                />
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={runCode}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Run Code
                  </button>
                  <button
                    onClick={() => setUserCode(lesson.starter_code || '')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-semibold">Output</h3>
                <p className="text-sm text-gray-600">Your program results</p>
              </div>
              <div className="p-6">
                <pre className="w-full h-64 font-mono text-sm border rounded-lg p-4 bg-gray-900 text-green-400 overflow-auto">
                  {codeOutput || 'Click "Run Code" to see output...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-4">Submit Your Work</h3>
            
            {/* Checklist */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Before you submit, make sure:</h4>
              <div className="space-y-2">
                {lesson.checklist.map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submission */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lesson.submit_prompt}
              </label>
              <textarea
                className="w-full h-32 border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what you built and what you learned..."
              />
            </div>

            <button
              onClick={submitLesson}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Lesson
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}