import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET /api/lessons - Fetch all lessons
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { searchParams } = new URL(request.url)
    const week = searchParams.get('week')
    
    let query = supabase
      .from('lessons')
      .select('*')
      .order('week', { ascending: true })
    
    if (week) {
      query = query.eq('week', parseInt(week))
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ lessons: data })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/lessons - Create new lesson (teachers only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['week', 'title', 'objectives', 'learn_md', 'starter_code']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    const { data, error } = await supabase
      .from('lessons')
      .insert([{
        week: body.week,
        title: body.title,
        duration_minutes: body.duration_minutes || 60,
        unlock_rule: body.unlock_rule || 'sequential',
        objectives: body.objectives,
        standards: body.standards || [],
        learn_md: body.learn_md,
        starter_code: body.starter_code,
        tests_py: body.tests_py || '',
        patterns: body.patterns || {},
        quiz_items: body.quiz_items || [],
        checklist: body.checklist || [],
        submit_prompt: body.submit_prompt || 'Submit your work',
        rubric: body.rubric || {},
        badges_on_complete: body.badges_on_complete || []
      }])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ lesson: data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}