'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Lesson } from '@/lib/supabase'
import Link from 'next/link'

const supabase = createClient()

export default function ManageLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emptyLesson: Partial<Lesson> = {
    week: 1,
    title: '',
    duration_minutes: 60,
    objectives: [],
    standards: [],
    learn_md: '',
    starter_code: '',
    checklist: [],
    submit_prompt: '',
    badges_on_complete: []
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  async function fetchLessons() {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('week', { ascending: true })

      if (error) throw error
      setLessons(data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(lessonData: Partial<Lesson>) {
    try {
      if (editingLesson) {
        // Update existing lesson
        const { data, error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id)
          .select()
          .single()

        if (error) throw error
        
        setLessons(lessons.map(l => l.id === editingLesson.id ? data : l))
        setEditingLesson(null)
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert([lessonData])
          .select()
          .single()

        if (error) throw error
        
        setLessons([...lessons, data])
        setIsCreating(false)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson')
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)

      if (error) throw error
      
      setLessons(lessons.filter(l => l.id !== lessonId))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete lesson')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading CodeFly Lesson Manager... ✈️</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-red-900/80 backdrop-blur-sm rounded-xl p-8 text-center border border-red-500/50">
          <h2 className="text-xl font-bold text-white mb-2">Database Connection Error</h2>
          <p className="text-red-200">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CodeFly Lesson Manager ✈️📚
              </h1>
              <p className="text-purple-300 text-lg mt-1">Create and edit curriculum content for your students</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/teacher"
                className="px-6 py-2 text-purple-300 hover:text-white transition-colors flex items-center rounded-lg border border-purple-500/30 hover:bg-purple-700/50"
              >
                ← Back to Dashboard
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Lesson ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {(isCreating || editingLesson) && (
          <LessonForm
            lesson={editingLesson || emptyLesson}
            onSave={handleSave}
            onCancel={() => {
              setIsCreating(false)
              setEditingLesson(null)
            }}
          />
        )}

        {/* Lessons List */}
        <div className="grid gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Week {lesson.week}: {lesson.title}
                  </h3>
                  <p className="text-purple-300 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {lesson.duration_minutes} minutes
                  </p>
                  <div className="mt-3">
                    <h4 className="font-semibold text-blue-300 mb-2">Learning Objectives:</h4>
                    <ul className="space-y-1">
                      {lesson.objectives.map((obj, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingLesson(lesson)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors transform hover:scale-105"
                    title="Edit lesson"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors transform hover:scale-105"
                    title="Delete lesson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Lesson Form Component
function LessonForm({ 
  lesson, 
  onSave, 
  onCancel 
}: { 
  lesson: Partial<Lesson>
  onSave: (lesson: Partial<Lesson>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(lesson)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl mb-8 border border-purple-500/30">
      <div className="p-6 border-b border-purple-500/30">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {lesson.id ? '✏️ Edit Lesson' : '✨ Create New Lesson'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Week
            </label>
            <input
              type="number"
              value={formData.week || ''}
              onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) })}
              className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration_minutes || ''}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Learning Objectives (one per line)
          </label>
          <textarea
            value={formData.objectives?.join('\n') || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              objectives: e.target.value.split('\n').filter(line => line.trim())
            })}
            className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24"
            placeholder="Students will be able to..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Learning Content (Markdown)
          </label>
          <textarea
            value={formData.learn_md || ''}
            onChange={(e) => setFormData({ ...formData, learn_md: e.target.value })}
            className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-48 font-mono text-sm"
            placeholder="# Lesson Title&#10;&#10;## Introduction&#10;Write your lesson content here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Starter Code
          </label>
          <textarea
            value={formData.starter_code || ''}
            onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
            className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 font-mono text-sm"
            placeholder="# Your starter Python code here..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-6 py-2 text-purple-300 hover:text-white transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-700/50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Lesson ✨
          </button>
        </div>
      </form>
    </div>
  )
}