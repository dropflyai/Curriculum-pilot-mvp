-- Add AI Conversations table for tracking AI tutor interactions
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    lesson_title TEXT NOT NULL,
    lesson_section TEXT NOT NULL,
    session_id TEXT NOT NULL, -- Groups messages in a conversation session
    status TEXT CHECK (status IN ('active', 'resolved', 'needs_help', 'abandoned')) DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add AI Messages table for individual messages in conversations
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('user', 'ai', 'teacher_intervention')) NOT NULL,
    content TEXT NOT NULL,
    student_code TEXT, -- Code context at time of message
    flagged_for_teacher BOOLEAN DEFAULT false,
    teacher_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_lesson_id ON public.ai_conversations(lesson_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON public.ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_activity ON public.ai_conversations(last_activity);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_flagged ON public.ai_messages(flagged_for_teacher);

-- Enable RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Conversations
CREATE POLICY "Users can view their own AI conversations" ON public.ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI conversations" ON public.ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations" ON public.ai_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all AI conversations" ON public.ai_conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Teachers can update AI conversation status" ON public.ai_conversations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- RLS Policies for AI Messages
CREATE POLICY "Users can view their own AI messages" ON public.ai_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_conversations 
            WHERE id = conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own AI messages" ON public.ai_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ai_conversations 
            WHERE id = conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view all AI messages" ON public.ai_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Teachers can create intervention messages" ON public.ai_messages
    FOR INSERT WITH CHECK (
        type = 'teacher_intervention' AND 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Teachers can update message flags" ON public.ai_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- Add triggers for updated_at
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update conversation last_activity when messages are added
CREATE OR REPLACE FUNCTION update_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.ai_conversations 
    SET last_activity = NOW(),
        duration_minutes = EXTRACT(EPOCH FROM (NOW() - started_at)) / 60
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation activity on message insert
CREATE TRIGGER update_conversation_on_message AFTER INSERT ON public.ai_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_activity();

-- Add TypeScript interfaces for reference
/*
interface AIConversation {
  id: string
  user_id: string
  lesson_id: string
  lesson_title: string
  lesson_section: string
  session_id: string
  status: 'active' | 'resolved' | 'needs_help' | 'abandoned'
  started_at: string
  last_activity: string
  duration_minutes: number
  created_at: string
  updated_at: string
}

interface AIMessage {
  id: string
  conversation_id: string
  type: 'user' | 'ai' | 'teacher_intervention'
  content: string
  student_code?: string
  flagged_for_teacher: boolean
  teacher_reviewed: boolean
  created_at: string
}
*/