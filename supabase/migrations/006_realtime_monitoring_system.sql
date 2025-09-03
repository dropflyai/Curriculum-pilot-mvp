-- Real-time Monitoring System for CodeFly Platform
-- This migration creates all necessary tables for teacher/student dashboard monitoring

-- Enable realtime for this schema
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- Student Progress Tracking Table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(255) NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'submitted')),
  
  -- Progress tracking
  sections_completed TEXT[] DEFAULT ARRAY[]::TEXT[],
  total_sections INTEGER DEFAULT 4,
  current_section VARCHAR(100) DEFAULT 'learn',
  
  -- Activity tracking
  started_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Code execution tracking
  code_executions INTEGER DEFAULT 0,
  errors TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Quiz tracking
  quiz_score DECIMAL(3,2), -- 0.00 to 1.00
  quiz_completed BOOLEAN DEFAULT FALSE,
  
  -- Help tracking
  needs_help BOOLEAN DEFAULT FALSE,
  help_requested_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Activity Log
CREATE TABLE IF NOT EXISTS student_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(255) NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  
  -- Activity details
  action VARCHAR(100) NOT NULL, -- 'started', 'section_completed', 'code_executed', 'quiz_submitted', 'completed', 'needs_help'
  section_name VARCHAR(100),
  details JSONB DEFAULT '{}',
  
  -- Timestamps
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(255) NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  lesson_section VARCHAR(100) NOT NULL,
  
  -- Conversation details
  session_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'needs_help', 'abandoned')),
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER DEFAULT 0,
  
  -- Flags
  flagged_for_teacher BOOLEAN DEFAULT FALSE,
  teacher_notified BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Messages Table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  
  -- Message details
  type VARCHAR(50) NOT NULL CHECK (type IN ('user', 'ai', 'teacher_intervention')),
  content TEXT NOT NULL,
  student_code TEXT,
  
  -- Flags and moderation
  flagged_for_teacher BOOLEAN DEFAULT FALSE,
  teacher_reviewed BOOLEAN DEFAULT FALSE,
  sentiment_score DECIMAL(3,2), -- -1.00 to 1.00 for future sentiment analysis
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time subscriptions table for active monitoring
CREATE TABLE IF NOT EXISTS realtime_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'teacher')),
  
  -- Session details
  session_id VARCHAR(255) NOT NULL,
  page_location VARCHAR(255),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_progress_student_lesson ON student_progress(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress(status);
CREATE INDEX IF NOT EXISTS idx_student_progress_needs_help ON student_progress(needs_help) WHERE needs_help = TRUE;
CREATE INDEX IF NOT EXISTS idx_student_progress_last_activity ON student_progress(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_timestamp ON student_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_student_activities_action ON student_activities(action);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_student_id ON ai_conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_flagged ON ai_conversations(flagged_for_teacher) WHERE flagged_for_teacher = TRUE;

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_flagged ON ai_messages(flagged_for_teacher) WHERE flagged_for_teacher = TRUE;

CREATE INDEX IF NOT EXISTS idx_realtime_sessions_active ON realtime_sessions(is_active, last_seen DESC) WHERE is_active = TRUE;

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realtime_sessions_updated_at
  BEFORE UPDATE ON realtime_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Students can only see their own progress and activities
CREATE POLICY "Students can view own progress" ON student_progress
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own progress" ON student_progress
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own progress" ON student_progress
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can view own activities" ON student_activities
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own activities" ON student_activities
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Teachers can view all student progress and activities
CREATE POLICY "Teachers can view all progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'teacher'
    )
  );

CREATE POLICY "Teachers can view all activities" ON student_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'teacher'
    )
  );

-- AI Conversations - students own, teachers all
CREATE POLICY "Students can manage own ai conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all ai conversations" ON ai_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'teacher'
    )
  );

-- AI Messages - students own conversations, teachers all
CREATE POLICY "Students can manage own ai messages" ON ai_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE id = conversation_id
      AND student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view all ai messages" ON ai_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'teacher'
    )
  );

-- Realtime sessions - users can manage their own
CREATE POLICY "Users can manage own realtime sessions" ON realtime_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Helper functions for common queries

-- Get students needing help
CREATE OR REPLACE FUNCTION get_students_needing_help()
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  lesson_id VARCHAR(255),
  lesson_title VARCHAR(255),
  time_stuck_minutes INTEGER,
  error_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.student_id,
    u.raw_user_meta_data->>'full_name' as student_name,
    sp.lesson_id,
    sp.lesson_title,
    EXTRACT(EPOCH FROM (NOW() - sp.last_activity))::INTEGER / 60 as time_stuck_minutes,
    array_length(sp.errors, 1) as error_count
  FROM student_progress sp
  JOIN auth.users u ON sp.student_id = u.id
  WHERE sp.needs_help = TRUE
    OR (sp.status = 'in_progress' AND sp.last_activity < NOW() - INTERVAL '20 minutes')
    OR array_length(sp.errors, 1) > 3
  ORDER BY sp.last_activity ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get real-time class overview
CREATE OR REPLACE FUNCTION get_class_overview()
RETURNS TABLE (
  total_students INTEGER,
  active_students INTEGER,
  students_needing_help INTEGER,
  avg_time_spent DECIMAL,
  completion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT sp.student_id)::INTEGER as total_students,
    COUNT(DISTINCT CASE WHEN rs.is_active = TRUE AND rs.last_seen > NOW() - INTERVAL '5 minutes' THEN sp.student_id END)::INTEGER as active_students,
    COUNT(DISTINCT CASE WHEN sp.needs_help = TRUE THEN sp.student_id END)::INTEGER as students_needing_help,
    AVG(sp.time_spent_minutes) as avg_time_spent,
    COUNT(CASE WHEN sp.status = 'completed' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) as completion_rate
  FROM student_progress sp
  LEFT JOIN realtime_sessions rs ON sp.student_id = rs.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_students_needing_help() TO authenticated;
GRANT EXECUTE ON FUNCTION get_class_overview() TO authenticated;

-- Enable realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE student_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE student_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_sessions;