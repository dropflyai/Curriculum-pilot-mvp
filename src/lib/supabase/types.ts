// ============================================
// SUPABASE DATABASE TYPES
// Complete type definitions for CodeFly
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Core user with gamification
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          role: 'student' | 'teacher' | 'admin'
          total_xp: number
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          accommodations_jsonb: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at' | 'total_xp' | 'current_streak' | 'longest_streak'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }

      // Classes and enrollments
      classes: {
        Row: {
          id: string
          name: string
          term: string
          timezone: string
          starts_on: string
          ends_on: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['classes']['Insert']>
      }

      enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          role: 'student' | 'teacher' | 'ta'
          active: boolean
          enrolled_at: string
        }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at'>
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }

      // Teams
      teams: {
        Row: {
          id: string
          class_id: string
          name: string
          avatar_emoji: string
          total_xp: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at' | 'total_xp'>
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }

      team_memberships: {
        Row: {
          id: string
          team_id: string
          student_id: string
          joined_at: string
          left_at: string | null
          contribution_score: number
        }
        Insert: Omit<Database['public']['Tables']['team_memberships']['Row'], 'id' | 'joined_at'>
        Update: Partial<Database['public']['Tables']['team_memberships']['Insert']>
      }

      // Assignments and submissions
      assignments: {
        Row: {
          id: string
          class_id: string
          lesson_id: string | null
          title: string
          type: 'SOLO' | 'TEAM' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'SHOWCASE'
          base_xp: number
          due_at: string | null
          rubric_json: Json
          standards_json: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['assignments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>
      }

      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string | null
          team_id: string | null
          code: string | null
          score_pct: number | null
          submitted_at: string
          metadata_json: Json
          graded_at: string | null
          graded_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'submitted_at'>
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>
      }

      // XP System
      xp_events: {
        Row: {
          id: string
          class_id: string
          student_id: string
          source: 'ASSIGNMENT' | 'QUIZ' | 'TEST' | 'HOMEWORK' | 'TEAM_SHARE' | 'PRACTICE' | 'BONUS' | 'ADJUSTMENT' | 'PEER_REVIEW' | 'STREAK' | 'EARLY_SUBMIT'
          assignment_id: string | null
          points: number
          multiplier: number
          meta: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['xp_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['xp_events']['Insert']>
      }

      // Badges
      badges: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          icon_emoji: string
          category: 'SKILL' | 'MILESTONE' | 'SOCIAL' | 'SPECIAL'
          rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
          rule_json: Json
          points: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['badges']['Insert']>
      }

      student_badges: {
        Row: {
          id: string
          badge_id: string
          student_id: string
          class_id: string
          awarded_at: string
          evidence: Json
        }
        Insert: Omit<Database['public']['Tables']['student_badges']['Row'], 'id' | 'awarded_at'>
        Update: Partial<Database['public']['Tables']['student_badges']['Insert']>
      }

      // Leaderboards
      weekly_leaderboards: {
        Row: {
          id: string
          class_id: string
          week_start_date: string
          week_end_date: string
          entries: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['weekly_leaderboards']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['weekly_leaderboards']['Insert']>
      }

      leaderboard_streaks: {
        Row: {
          id: string
          class_id: string
          student_id: string
          current_streak: number
          longest_streak: number
          last_top5_week: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leaderboard_streaks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leaderboard_streaks']['Insert']>
      }

      // AI Tutor
      tutor_policies: {
        Row: {
          id: string
          class_id: string
          week_no: number
          mode: 'LEARN' | 'ASSESS' | 'OFF'
          scope_level: 'TIGHT' | 'NORMAL' | 'OPEN'
          max_tokens: number
          rate_per_min: number
          snippet_line_cap: number
          created_by: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_policies']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tutor_policies']['Insert']>
      }

      tutor_queries: {
        Row: {
          id: string
          class_id: string
          student_id: string
          policy_id: string | null
          prompt_text: string
          resolved_topics: Json
          decision: 'ALLOW' | 'SOFT_BLOCK' | 'HARD_BLOCK' | 'ESCALATE'
          reason: string | null
          tokens_in: number | null
          tokens_out: number | null
          latency_ms: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_queries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tutor_queries']['Insert']>
      }

      tutor_responses: {
        Row: {
          id: string
          query_id: string
          content: string
          assist_level: 'HINT' | 'SNIPPET' | 'EXAMPLE' | 'EXPLANATION'
          redactions: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_responses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tutor_responses']['Insert']>
      }

      // Draft Events
      draft_events: {
        Row: {
          id: string
          class_id: string
          name: string
          draft_type: 'SNAKE' | 'RANDOM' | 'BALANCED'
          status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
          config_json: Json
          results_json: Json | null
          scheduled_for: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['draft_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['draft_events']['Insert']>
      }

      draft_picks: {
        Row: {
          id: string
          draft_event_id: string
          pick_number: number
          team_id: string | null
          student_id: string
          picked_at: string
        }
        Insert: Omit<Database['public']['Tables']['draft_picks']['Row'], 'id' | 'picked_at'>
        Update: Partial<Database['public']['Tables']['draft_picks']['Insert']>
      }

      // Existing tables
      lessons: {
        Row: {
          id: string
          week: number
          title: string
          duration_minutes: number
          unlock_rule: string
          objectives: string[]
          standards: string[]
          learn_md: string | null
          starter_code: string | null
          tests_py: string | null
          patterns: Json | null
          quiz_items: Json | null
          checklist: string[]
          submit_prompt: string | null
          rubric: Json | null
          badges_on_complete: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }

      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'not_started' | 'in_progress' | 'submitted' | 'completed'
          submitted_code: string | null
          quiz_answers: Json | null
          checklist_completed: boolean[]
          submit_response: string | null
          teacher_feedback: string | null
          score: number | null
          started_at: string | null
          submitted_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['progress']['Insert']>
      }

      // Competitive Metrics Tables
      speed_records: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          lesson_id: string | null
          completion_time_seconds: number
          difficulty_level: string
          is_personal_best: boolean
          is_global_record: boolean
          code_submission_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['speed_records']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['speed_records']['Insert']>
      }

      code_quality_metrics: {
        Row: {
          id: string
          user_id: string
          submission_id: string
          lesson_id: string
          clean_code_score: number
          efficiency_score: number
          best_practices_score: number
          documentation_score: number
          error_handling_score: number
          innovation_score: number
          lines_of_code: number
          cyclomatic_complexity: number
          code_reuse_percentage: number
          test_cases_passed: number
          test_cases_total: number
          accuracy_percentage: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['code_quality_metrics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['code_quality_metrics']['Insert']>
      }

      streak_tracking: {
        Row: {
          id: string
          user_id: string
          streak_type: string
          current_streak: number
          longest_streak: number
          last_activity_date: string
          streak_start_date: string
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['streak_tracking']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['streak_tracking']['Insert']>
      }

      community_metrics: {
        Row: {
          id: string
          user_id: string
          help_points_given: number
          help_points_received: number
          questions_answered: number
          code_reviews_given: number
          code_reviews_received: number
          mentorship_hours: number
          collaboration_score: number
          weekly_help_points: number
          weekly_collaboration_score: number
          last_help_given: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_metrics']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['community_metrics']['Insert']>
      }

      discovery_metrics: {
        Row: {
          id: string
          user_id: string
          discovery_type: string
          discovery_id: string
          discovery_name: string
          discovery_description: string | null
          mission_id: string | null
          lesson_id: string | null
          difficulty_rating: number
          discovery_points: number
          discovered_at: string
        }
        Insert: Omit<Database['public']['Tables']['discovery_metrics']['Row'], 'id' | 'discovered_at'>
        Update: Partial<Database['public']['Tables']['discovery_metrics']['Insert']>
      }

      consistency_metrics: {
        Row: {
          id: string
          user_id: string
          metric_date: string
          daily_completion_rate: number
          lessons_completed_today: number
          time_spent_minutes: number
          login_streak_days: number
          weekly_goals_met: boolean
          weekly_completion_rate: number
          assignment_punctuality_score: number
          practice_consistency_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['consistency_metrics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['consistency_metrics']['Insert']>
      }

      mission_records: {
        Row: {
          id: string
          mission_id: string
          mission_name: string
          difficulty_level: string
          fastest_time_seconds: number | null
          fastest_time_holder: string | null
          fastest_time_date: string | null
          highest_quality_score: number | null
          highest_quality_holder: string | null
          highest_quality_date: string | null
          highest_innovation_score: number | null
          highest_innovation_holder: string | null
          highest_innovation_date: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['mission_records']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['mission_records']['Insert']>
      }
    }
    Views: {
      current_leaderboard: {
        Row: {
          student_id: string
          display_name: string | null
          avatar_url: string | null
          total_xp: number
          rank: number
          current_streak: number | null
          badge_count: number
          movement: 'UP' | 'DOWN' | 'SAME' | 'NEW'
        }
      }
    }
  }
}

// Helper types
export type User = Database['public']['Tables']['users']['Row']
export type Class = Database['public']['Tables']['classes']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type Assignment = Database['public']['Tables']['assignments']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type XPEvent = Database['public']['Tables']['xp_events']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type StudentBadge = Database['public']['Tables']['student_badges']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']
export type TutorPolicy = Database['public']['Tables']['tutor_policies']['Row']
export type TutorQuery = Database['public']['Tables']['tutor_queries']['Row']
export type DraftEvent = Database['public']['Tables']['draft_events']['Row']
export type LeaderboardEntry = Database['public']['Views']['current_leaderboard']['Row']

// Competitive Metrics Types
export type SpeedRecord = Database['public']['Tables']['speed_records']['Row']
export type CodeQualityMetric = Database['public']['Tables']['code_quality_metrics']['Row']
export type StreakRecord = Database['public']['Tables']['streak_tracking']['Row']
export type CommunityMetric = Database['public']['Tables']['community_metrics']['Row']
export type DiscoveryMetric = Database['public']['Tables']['discovery_metrics']['Row']
export type ConsistencyMetric = Database['public']['Tables']['consistency_metrics']['Row']
export type MissionRecord = Database['public']['Tables']['mission_records']['Row']