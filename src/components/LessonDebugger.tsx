'use client'

import { getAllLessons, aiLessons } from '@/lib/lesson-data'
import { useState } from 'react'

export default function LessonDebugger() {
  const lessons = getAllLessons()
  const [selectedTab] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all')
  const [selectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  
  // Mock the same progress data as dashboard
  const userProgress: Record<string, number> = {
    'week-01': 100, // Week 1 AI Classifier - completed
    'week-02': 0, // Week 2 Python Advisor - not started
  }
  
  const getProgressForLesson = (lessonId: string) => {
    return userProgress[lessonId] || 0
  }
  
  // Copy the same filtering logic from dashboard
  const getLessonsByTab = () => {
    let filteredLessons = lessons

    // Filter by completion status
    switch (selectedTab) {
      case 'completed':
        filteredLessons = lessons.filter(lesson => getProgressForLesson(lesson.id) === 100)
        break
      case 'in-progress':
        filteredLessons = lessons.filter(lesson => {
          const progress = getProgressForLesson(lesson.id)
          return progress > 0 && progress < 100
        })
        break
      case 'not-started':
        filteredLessons = lessons.filter(lesson => getProgressForLesson(lesson.id) === 0)
        break
      default:
        filteredLessons = lessons
    }

    // Then filter by difficulty
    if (selectedDifficulty !== 'all') {
      filteredLessons = filteredLessons.filter(lesson => lesson.difficulty === selectedDifficulty)
    }

    return filteredLessons
  }
  
  const filteredLessons = getLessonsByTab()
  
  return (
    <div className="bg-red-600 p-8 m-4 rounded-lg border-4 border-yellow-400">
      <h2 className="text-4xl font-bold text-white mb-4">🚨 LESSON DEBUGGER - WEEK 2 TEST 🚨</h2>
      
      <div className="bg-yellow-400 text-black p-4 rounded mb-4">
        <h3 className="font-bold text-xl mb-2">Raw aiLessons Array:</h3>
        <p>Total lessons in aiLessons: {aiLessons.length}</p>
        {aiLessons.map(lesson => (
          <div key={lesson.id} className="mb-1">
            • {lesson.id}: {lesson.title}
          </div>
        ))}
      </div>

      <div className="bg-green-400 text-black p-4 rounded mb-4">
        <h3 className="font-bold text-xl mb-2">getAllLessons() Output:</h3>
        <p>Total lessons from getAllLessons(): {lessons.length}</p>
        {lessons.map(lesson => (
          <div key={lesson.id} className="mb-1">
            • {lesson.id}: {lesson.title}
          </div>
        ))}
      </div>

      <div className="bg-blue-400 text-black p-4 rounded mb-4">
        <h3 className="font-bold text-xl mb-2">Week 2 Details:</h3>
        {aiLessons.find(l => l.id === 'week-02') ? (
          <div>
            <p>✅ Week 2 found in aiLessons!</p>
            <p>Title: {aiLessons.find(l => l.id === 'week-02')?.title}</p>
            <p>Description: {aiLessons.find(l => l.id === 'week-02')?.description}</p>
          </div>
        ) : (
          <p>❌ Week 2 NOT found in aiLessons!</p>
        )}
      </div>

      <div className="bg-purple-400 text-black p-4 rounded mb-4">
        <h3 className="font-bold text-xl mb-2">Filtered Lessons (Dashboard Logic):</h3>
        <p>Selected Tab: {selectedTab}</p>
        <p>Selected Difficulty: {selectedDifficulty}</p>
        <p>Filtered lessons count: {filteredLessons.length}</p>
        {filteredLessons.map(lesson => (
          <div key={lesson.id} className="mb-1 bg-black/20 p-2 rounded">
            • {lesson.id}: {lesson.title} (Progress: {getProgressForLesson(lesson.id)}%)
          </div>
        ))}
      </div>

      <div className="bg-orange-400 text-black p-4 rounded">
        <h3 className="font-bold text-xl mb-2">Progress Data Check:</h3>
        <p>Week 1 progress: {getProgressForLesson('week-01')}%</p>
        <p>Week 2 progress: {getProgressForLesson('week-02')}%</p>
        <p>Should Week 2 show on 'all' tab? {getProgressForLesson('week-02') >= 0 ? 'YES' : 'NO'}</p>
        <p>Should Week 2 show on 'not-started' tab? {getProgressForLesson('week-02') === 0 ? 'YES' : 'NO'}</p>
      </div>
    </div>
  )
}