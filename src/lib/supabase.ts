import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types for our database tables
export interface User {
  id: string
  email: string
  full_name?: string
  role: 'student' | 'teacher' | 'admin'
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  week: number
  title: string
  duration_minutes: number
  unlock_rule: string
  objectives: string[]
  standards: string[]
  learn_md: string
  starter_code: string
  tests_py: string
  patterns: Record<string, unknown>
  quiz_items: Array<{
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
  }>
  checklist: string[]
  submit_prompt: string
  rubric: Record<string, unknown>
  badges_on_complete: string[]
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'completed'
  submitted_code?: string
  quiz_answers?: Record<string, unknown>
  checklist_completed: boolean[]
  submit_response?: string
  teacher_feedback?: string
  score?: number
  started_at?: string
  submitted_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}