'use client'

import { getAllLessons, aiLessons } from '@/lib/lesson-data'

export default function DebugLessonsPage() {
  const lessons = getAllLessons()
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🔍 Lesson Data Debug Page</h1>
        
        <div className="space-y-8">
          <div className="bg-red-600 border-4 border-yellow-400 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">🚨 RAW aiLessons ARRAY 🚨</h2>
            <div className="bg-black/50 p-4 rounded text-white font-mono">
              <p className="mb-2">Total lessons in aiLessons: {aiLessons.length}</p>
              {aiLessons.map(lesson => (
                <div key={lesson.id} className="mb-2 p-2 bg-gray-800 rounded">
                  <strong>{lesson.id}</strong>: {lesson.title}
                  <br />
                  <small className="text-gray-300">{lesson.description}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-600 border-4 border-yellow-400 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">🚨 getAllLessons() OUTPUT 🚨</h2>
            <div className="bg-black/50 p-4 rounded text-white font-mono">
              <p className="mb-2">Total lessons from getAllLessons(): {lessons.length}</p>
              {lessons.map(lesson => (
                <div key={lesson.id} className="mb-2 p-2 bg-gray-800 rounded">
                  <strong>{lesson.id}</strong>: {lesson.title}
                  <br />
                  <small className="text-gray-300">{lesson.description}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 border-4 border-yellow-400 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">🚨 WEEK 2 SPECIFIC CHECK 🚨</h2>
            <div className="bg-black/50 p-4 rounded text-white font-mono">
              {aiLessons.find(l => l.id === 'week-02') ? (
                <div>
                  <p className="text-green-400 font-bold">✅ Week 2 FOUND in aiLessons!</p>
                  <div className="mt-2 p-2 bg-green-900/50 rounded">
                    <p><strong>ID:</strong> {aiLessons.find(l => l.id === 'week-02')?.id}</p>
                    <p><strong>Title:</strong> {aiLessons.find(l => l.id === 'week-02')?.title}</p>
                    <p><strong>Description:</strong> {aiLessons.find(l => l.id === 'week-02')?.description}</p>
                    <p><strong>Modes:</strong> {aiLessons.find(l => l.id === 'week-02')?.modes.length}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-400 font-bold">❌ Week 2 NOT found in aiLessons!</p>
              )}
              
              {lessons.find(l => l.id === 'week-02') ? (
                <div className="mt-4">
                  <p className="text-green-400 font-bold">✅ Week 2 FOUND in getAllLessons()!</p>
                  <div className="mt-2 p-2 bg-green-900/50 rounded">
                    <p><strong>Mapped ID:</strong> {lessons.find(l => l.id === 'week-02')?.id}</p>
                    <p><strong>Mapped Title:</strong> {lessons.find(l => l.id === 'week-02')?.title}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-400 font-bold">❌ Week 2 NOT found in getAllLessons()!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}