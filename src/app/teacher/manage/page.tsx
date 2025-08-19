'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
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

  if (loading) return <div className="p-8">Loading lessons...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Lessons</h1>
              <p className="text-gray-600">Create and edit curriculum content</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/teacher"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Lesson
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
            <div key={lesson.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week {lesson.week}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{lesson.duration_minutes} minutes</p>
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Objectives:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {lesson.objectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingLesson(lesson)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
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
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {lesson.id ? 'Edit Lesson' : 'Create New Lesson'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week
            </label>
            <input
              type="number"
              value={formData.week || ''}
              onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration_minutes || ''}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Objectives (one per line)
          </label>
          <textarea
            value={formData.objectives?.join('\n') || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              objectives: e.target.value.split('\n').filter(line => line.trim())
            })}
            className="w-full p-3 border rounded-lg h-24"
            placeholder="Students will be able to..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Content (Markdown)
          </label>
          <textarea
            value={formData.learn_md || ''}
            onChange={(e) => setFormData({ ...formData, learn_md: e.target.value })}
            className="w-full p-3 border rounded-lg h-48 font-mono text-sm"
            placeholder="# Lesson Title&#10;&#10;## Introduction&#10;Write your lesson content here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starter Code
          </label>
          <textarea
            value={formData.starter_code || ''}
            onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
            className="w-full p-3 border rounded-lg h-32 font-mono text-sm"
            placeholder="# Your starter Python code here..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Lesson
          </button>
        </div>
      </form>
    </div>
  )
}