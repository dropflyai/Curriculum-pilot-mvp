import { createClient } from './supabase'

// ============= USER/PROFILE FUNCTIONS =============

export async function createUserProfile(userData: {
  id: string
  email: string
  full_name?: string
  codename?: string
  role?: 'student' | 'teacher' | 'admin'
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      ...userData,
      role: userData.role || 'student',
      xp: 0,
      level: 1,
      badge_level: 'Recruit'
    }])
    .select()
    .single()
    
  return { data, error }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  return { data, error }
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  const supabase = createClient()
  
  // Get current XP
  const { data: profile } = await getUserProfile(userId)
  if (!profile) return { error: 'User not found' }
  
  const newXP = (profile.xp || 0) + xpToAdd
  const newLevel = Math.floor(newXP / 500) + 1
  const newBadge = getBadgeForXP(newXP)
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      xp: newXP,
      level: newLevel,
      badge_level: newBadge,
      last_active: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
    
  // Log activity
  await logActivity(userId, 'xp_earned', `Earned ${xpToAdd} XP`, { xp: xpToAdd, total: newXP })
    
  return { data, error }
}

function getBadgeForXP(xp: number): string {
  if (xp >= 5000) return 'Shadow Legend'
  if (xp >= 3500) return 'Master Spy'
  if (xp >= 2000) return 'Senior Agent'
  if (xp >= 1200) return 'Field Operative'
  if (xp >= 500) return 'Agent'
  return 'Recruit'
}

// ============= LESSON PROGRESS FUNCTIONS =============

export async function startLesson(userId: string, lessonId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('student_progress')
    .upsert([{
      user_id: userId,
      lesson_id: lessonId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      attempts: 1
    }], {
      onConflict: 'user_id,lesson_id'
    })
    .select()
    .single()
    
  await logActivity(userId, 'lesson_started', 'Started a new lesson', { lesson_id: lessonId })
    
  return { data, error }
}

export async function submitChallenge(
  userId: string,
  lessonId: string,
  challengeNumber: number,
  code: string,
  isCorrect: boolean,
  feedback: string
) {
  const supabase = createClient()
  
  // Save code submission
  const { data: submission, error: subError } = await supabase
    .from('code_submissions')
    .insert([{
      user_id: userId,
      lesson_id: lessonId,
      challenge_number: challengeNumber,
      code,
      is_correct: isCorrect,
      feedback,
      xp_earned: isCorrect ? 25 : 0
    }])
    .select()
    .single()
    
  if (isCorrect) {
    // Update progress
    const { data: progress } = await supabase
      .from('student_progress')
      .select('completed_challenges')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()
      
    const completedChallenges = progress?.completed_challenges || []
    if (!completedChallenges.includes(challengeNumber)) {
      completedChallenges.push(challengeNumber)
      
      await supabase
        .from('student_progress')
        .update({
          completed_challenges: completedChallenges,
          xp_earned: completedChallenges.length * 25
        })
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
    }
    
    // Update user XP
    await updateUserXP(userId, 25)
  }
  
  return { data: submission, error: subError }
}

export async function completeLesson(
  userId: string,
  lessonId: string,
  totalXP: number,
  timeSpent: number
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('student_progress')
    .update({
      status: 'completed',
      xp_earned: totalXP,
      time_spent_seconds: timeSpent,
      completed_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .select()
    .single()
    
  // Add achievement
  await addAchievement(userId, 'lesson_complete', 'Completed a lesson', totalXP)
  
  // Update leaderboard
  await updateLeaderboard(userId)
  
  // Log activity
  await logActivity(userId, 'lesson_completed', 'Completed a lesson', { 
    lesson_id: lessonId,
    xp: totalXP,
    time: timeSpent 
  })
    
  return { data, error }
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
    
  return { data, error }
}

// ============= LEADERBOARD FUNCTIONS =============

export async function updateLeaderboard(userId: string) {
  const supabase = createClient()
  
  // Get user's class
  const { data: profile } = await getUserProfile(userId)
  if (!profile?.class_id) return
  
  // Calculate stats for different periods
  const periods = ['daily', 'weekly', 'monthly', 'all_time']
  
  for (const period of periods) {
    const dateFilter = getDateFilterForPeriod(period)
    
    // Get user's stats for this period
    const { data: stats } = await supabase
      .from('student_progress')
      .select('xp_earned, time_spent_seconds')
      .eq('user_id', userId)
      .gte('completed_at', dateFilter)
      
    const totalXP = stats?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0
    const lessonsCompleted = stats?.length || 0
    const perfectScores = stats?.filter(s => s.xp_earned === 100).length || 0
    const fastestTime = Math.min(...(stats?.map(s => s.time_spent_seconds) || [Infinity]))
    
    await supabase
      .from('leaderboard')
      .upsert([{
        user_id: userId,
        class_id: profile.class_id,
        period,
        xp_gained: totalXP,
        lessons_completed: lessonsCompleted,
        perfect_scores: perfectScores,
        fastest_time_seconds: fastestTime === Infinity ? null : fastestTime,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,class_id,period'
      })
  }
  
  // Update ranks
  await calculateRanks(profile.class_id)
}

function getDateFilterForPeriod(period: string): string {
  const now = new Date()
  switch (period) {
    case 'daily':
      return new Date(now.setDate(now.getDate() - 1)).toISOString()
    case 'weekly':
      return new Date(now.setDate(now.getDate() - 7)).toISOString()
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
    default:
      return '1970-01-01T00:00:00Z'
  }
}

async function calculateRanks(classId: string) {
  const supabase = createClient()
  const periods = ['daily', 'weekly', 'monthly', 'all_time']
  
  for (const period of periods) {
    const { data: leaderboard } = await supabase
      .from('leaderboard')
      .select('id, xp_gained')
      .eq('class_id', classId)
      .eq('period', period)
      .order('xp_gained', { ascending: false })
      
    if (leaderboard) {
      for (let i = 0; i < leaderboard.length; i++) {
        await supabase
          .from('leaderboard')
          .update({ rank: i + 1 })
          .eq('id', leaderboard[i].id)
      }
    }
  }
}

export async function getClassLeaderboard(classId: string, period: string = 'weekly') {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leaderboard')
    .select(`
      *,
      profiles:user_id (
        full_name,
        codename,
        avatar_type,
        badge_level
      )
    `)
    .eq('class_id', classId)
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(10)
    
  return { data, error }
}

// ============= ACHIEVEMENTS FUNCTIONS =============

export async function addAchievement(
  userId: string,
  badgeType: string,
  badgeName: string,
  xpBonus: number = 0
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('achievements')
    .insert([{
      user_id: userId,
      badge_type: badgeType,
      badge_name: badgeName,
      description: `Earned ${badgeName} achievement`,
      xp_bonus: xpBonus
    }])
    .select()
    .single()
    
  if (xpBonus > 0) {
    await updateUserXP(userId, xpBonus)
  }
    
  return { data, error }
}

export async function getUserAchievements(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
    
  return { data, error }
}

// ============= ACTIVITY FEED FUNCTIONS =============

export async function logActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata: Record<string, any> = {}
) {
  const supabase = createClient()
  
  // Get user's class
  const { data: profile } = await getUserProfile(userId)
  
  const { data, error } = await supabase
    .from('activity_feed')
    .insert([{
      user_id: userId,
      class_id: profile?.class_id,
      activity_type: activityType,
      description,
      metadata
    }])
    .select()
    .single()
    
  return { data, error }
}

export async function getClassActivityFeed(classId: string, limit: number = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('activity_feed')
    .select(`
      *,
      profiles:user_id (
        full_name,
        codename,
        avatar_type
      )
    `)
    .eq('class_id', classId)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  return { data, error }
}

// ============= TEAM FUNCTIONS =============

export async function createTeam(
  classId: string,
  name: string,
  captainId: string,
  memberIds: string[]
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('teams')
    .insert([{
      class_id: classId,
      name,
      captain_id: captainId,
      members: memberIds
    }])
    .select()
    .single()
    
  // Update team_id for all members
  for (const memberId of memberIds) {
    await supabase
      .from('profiles')
      .update({ team_id: data?.id })
      .eq('id', memberId)
  }
    
  return { data, error }
}

export async function sendTeamMessage(
  teamId: string,
  userId: string,
  message: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('team_chat')
    .insert([{
      team_id: teamId,
      user_id: userId,
      message
    }])
    .select()
    .single()
    
  return { data, error }
}

export async function getTeamMessages(teamId: string, limit: number = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('team_chat')
    .select(`
      *,
      profiles:user_id (
        full_name,
        codename,
        avatar_type
      )
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  return { data, error }
}

// ============= REAL-TIME SUBSCRIPTIONS =============

export function subscribeToClassActivity(
  classId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`class-activity-${classId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_feed',
        filter: `class_id=eq.${classId}`
      },
      callback
    )
    .subscribe()
    
  return subscription
}

export function subscribeToTeamChat(
  teamId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`team-chat-${teamId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'team_chat',
        filter: `team_id=eq.${teamId}`
      },
      callback
    )
    .subscribe()
    
  return subscription
}

export function subscribeToLeaderboard(
  classId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`leaderboard-${classId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard',
        filter: `class_id=eq.${classId}`
      },
      callback
    )
    .subscribe()
    
  return subscription
}