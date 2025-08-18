'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Lesson } from '@/lib/supabase'

const supabase = createClient()

export default function TestDB() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .limit(5)

        if (error) {
          setError(error.message)
        } else {
          setLessons(data || [])
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        
        {loading && (
          <div className="text-blue-600">Testing connection...</div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong>Success!</strong> Connected to Supabase successfully.
          </div>
        )}
        
        {lessons.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Lessons Found ({lessons.length}):</h2>
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border-b pb-2 mb-2">
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-gray-600">Week {lesson.week} • {lesson.duration_minutes} min</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}