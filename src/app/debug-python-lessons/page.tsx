'use client'

import { pythonLessons } from '@/lib/python-lessons'

export default function DebugPythonLessons() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl mb-8">Debug Python Lessons</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-white text-xl mb-4">Lesson Count: {pythonLessons.length}</h2>
          
          {pythonLessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-gray-700 rounded p-4 mb-4">
              <h3 className="text-white font-bold">Lesson {index + 1}</h3>
              <p className="text-gray-300">ID: {lesson.id}</p>
              <p className="text-gray-300">Title: {lesson.title}</p>
              <p className="text-gray-300">Week: {lesson.week}</p>
              <p className="text-gray-300">Challenges: {lesson.challenges.length}</p>
              <p className="text-gray-300">XP: {lesson.total_xp}</p>
            </div>
          ))}
        </div>
        
        <div className="text-white">
          <h3 className="text-xl mb-2">Raw Data Check:</h3>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(pythonLessons.map(l => ({ id: l.id, title: l.title })), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}