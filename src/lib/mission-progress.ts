import { createClient } from './supabase'
import { MISSION_REWARDS } from './mission-rewards'

// Mission IDs match what's in mission-hq page
const MISSION_IDS = {
  'shadow-protocol': 'operation-beacon',
  'cipher-command': 'cipher-command',
  'ghost-protocol': 'loop-canyon-base',
  'quantum-breach': 'quantum-breach'
}

// ============= MISSION PROGRESS FUNCTIONS =============

/**
 * Get user's completed missions from Supabase
 */
export async function getCompletedMissions(userId: string): Promise<string[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mission_progress')
    .select('mission_id')
    .eq('user_id', userId)
    .eq('status', 'completed')
  
  if (error) {
    console.error('Error fetching completed missions:', error)
    return []
  }
  
  return data?.map(m => m.mission_id) || []
}

/**
 * Mark a mission as completed in Supabase
 */
export async function completeMission(userId: string, missionId: string) {
  const supabase = createClient()
  
  // Get mission rewards
  const missionRewards = MISSION_REWARDS[missionId]
  if (!missionRewards) {
    console.error('No rewards found for mission:', missionId)
    return { data: null, error: 'Mission rewards not found' }
  }
  
  const { data, error } = await supabase
    .from('mission_progress')
    .upsert([{
      user_id: userId,
      mission_id: missionId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      xp_earned: missionRewards.xp
    }], {
      onConflict: 'user_id,mission_id'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error completing mission:', error)
    return { data: null, error }
  }
  
  // Grant mission rewards
  await grantMissionRewards(userId, missionId, missionRewards)
  
  // Log achievement
  await logMissionCompletion(userId, missionId)
  
  // Send mission completion email
  try {
    await sendMissionCompletionEmail(userId, missionId, missionRewards.xp)
  } catch (emailError) {
    console.error('Failed to send mission completion email:', emailError)
    // Don't fail mission completion if email fails
  }
  
  return { data, error: null }
}

/**
 * Start a mission (mark as in progress)
 */
export async function startMission(userId: string, missionId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mission_progress')
    .upsert([{
      user_id: userId,
      mission_id: missionId,
      status: 'in_progress',
      started_at: new Date().toISOString()
    }], {
      onConflict: 'user_id,mission_id',
      ignoreDuplicates: false
    })
    .select()
    .single()
  
  return { data, error }
}

/**
 * Get mission progress for a user
 */
export async function getMissionProgress(userId: string, missionId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .single()
  
  return { data, error }
}

/**
 * Get all mission progress for a user
 */
export async function getAllMissionProgress(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: true })
  
  return { data, error }
}

/**
 * Check if a mission is unlocked based on prerequisites
 */
export async function isMissionUnlocked(userId: string, missionId: string): Promise<boolean> {
  // First mission is always unlocked
  if (missionId === 'shadow-protocol') return true
  
  const prerequisites = {
    'cipher-command': 'shadow-protocol',
    'ghost-protocol': 'cipher-command',
    'quantum-breach': 'ghost-protocol'
  }
  
  const prerequisite = prerequisites[missionId as keyof typeof prerequisites]
  if (!prerequisite) return true
  
  const completedMissions = await getCompletedMissions(userId)
  return completedMissions.includes(prerequisite)
}

// ============= HELPER FUNCTIONS =============

/**
 * Grant all rewards when a mission is completed
 */
async function grantMissionRewards(userId: string, missionId: string, rewards: any) {
  const supabase = createClient()
  
  try {
    // 1. Update user XP and level
    const newXP = rewards.xp
    await updateUserXP(userId, newXP)
    
    // 2. Grant clearance card as achievement
    await supabase
      .from('achievements')
      .insert([{
        user_id: userId,
        badge_type: 'clearance_card',
        badge_name: rewards.clearanceCard.name,
        description: rewards.clearanceCard.description,
        xp_bonus: 0,
        metadata: { 
          level: rewards.clearanceCard.level,
          color: rewards.clearanceCard.color,
          mission_id: missionId
        }
      }])
    
    // 3. Grant tech items as achievements
    for (const techItem of rewards.techItems) {
      await supabase
        .from('achievements')
        .insert([{
          user_id: userId,
          badge_type: 'tech_item',
          badge_name: techItem.name,
          description: techItem.description,
          xp_bonus: 0,
          metadata: { 
            icon: techItem.icon,
            type: techItem.type,
            mission_id: missionId
          }
        }])
    }
    
    // 4. Log skills unlocked as activities
    for (const skill of rewards.skillsUnlocked) {
      await supabase
        .from('activity_feed')
        .insert([{
          user_id: userId,
          activity_type: 'skill_unlocked',
          description: `Unlocked new skill: ${skill}`,
          metadata: { skill, mission_id: missionId }
        }])
    }
    
    // 5. Grant special bonus if available
    if (rewards.specialBonus) {
      await supabase
        .from('achievements')
        .insert([{
          user_id: userId,
          badge_type: 'special_bonus',
          badge_name: rewards.specialBonus.name,
          description: rewards.specialBonus.description,
          xp_bonus: 100, // Bonus XP for special achievements
          metadata: { 
            icon: rewards.specialBonus.icon,
            mission_id: missionId
          }
        }])
      
      // Grant bonus XP
      await updateUserXP(userId, 100)
    }
    
    // 6. Log comprehensive completion activity
    await supabase
      .from('activity_feed')
      .insert([{
        user_id: userId,
        activity_type: 'mission_rewards_granted',
        description: `Mission completed! Earned ${rewards.xp} XP, ${rewards.clearanceCard.level} clearance, ${rewards.techItems.length} tech items, and ${rewards.skillsUnlocked.length} new skills!`,
        metadata: {
          mission_id: missionId,
          xp_earned: rewards.xp,
          clearance_level: rewards.clearanceCard.level,
          tech_items_count: rewards.techItems.length,
          skills_count: rewards.skillsUnlocked.length,
          has_special_bonus: !!rewards.specialBonus
        }
      }])
      
    console.log(`Successfully granted all rewards for mission ${missionId} to user ${userId}`)
  } catch (error) {
    console.error('Error granting mission rewards:', error)
  }
}

function getMissionXP(missionId: string): number {
  const xpRewards = {
    'shadow-protocol': 5000,
    'cipher-command': 7500,
    'ghost-protocol': 10000,
    'quantum-breach': 15000
  }
  
  return xpRewards[missionId as keyof typeof xpRewards] || 5000
}

async function updateUserXP(userId: string, xpToAdd: number) {
  const supabase = createClient()
  
  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .single()
  
  if (!profile) return
  
  const newXP = (profile.xp || 0) + xpToAdd
  const newLevel = Math.floor(newXP / 1000) + 1
  
  await supabase
    .from('profiles')
    .update({
      xp: newXP,
      level: newLevel,
      last_active: new Date().toISOString()
    })
    .eq('id', userId)
}

async function logMissionCompletion(userId: string, missionId: string) {
  const supabase = createClient()
  
  const missionNames = {
    'shadow-protocol': 'Operation Beacon',
    'cipher-command': 'Cipher Command',
    'ghost-protocol': 'Loop Canyon Base',
    'quantum-breach': 'Quantum Breach'
  }
  
  const missionName = missionNames[missionId as keyof typeof missionNames] || missionId
  const xp = getMissionXP(missionId)
  
  // Add achievement
  await supabase
    .from('achievements')
    .insert([{
      user_id: userId,
      badge_type: 'mission_complete',
      badge_name: `${missionName} Complete`,
      description: `Successfully completed ${missionName} mission`,
      xp_bonus: xp
    }])
  
  // Log activity
  await supabase
    .from('activity_feed')
    .insert([{
      user_id: userId,
      activity_type: 'mission_completed',
      description: `Completed ${missionName} mission and earned ${xp} XP!`,
      metadata: { mission_id: missionId, xp_earned: xp }
    }])
}

// ============= WEEK/LESSON PROGRESS =============

/**
 * Track week completion within a mission
 */
export async function completeWeek(userId: string, missionId: string, weekNumber: number) {
  const supabase = createClient()
  
  // Get current mission progress
  const { data: progress } = await getMissionProgress(userId, missionId)
  
  const completedWeeks = progress?.completed_weeks || []
  if (!completedWeeks.includes(weekNumber)) {
    completedWeeks.push(weekNumber)
    
    await supabase
      .from('mission_progress')
      .update({
        completed_weeks: completedWeeks,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('mission_id', missionId)
    
    // Check if all weeks are complete (4 weeks per mission)
    if (completedWeeks.length >= 4) {
      await completeMission(userId, missionId)
    }
  }
}

/**
 * Get user's progress for all missions (for dashboard display)
 */
export async function getMissionsDashboardData(userId: string) {
  const supabase = createClient()
  
  // Get all mission progress
  const { data: progress } = await getAllMissionProgress(userId)
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level, badge_level')
    .eq('id', userId)
    .single()
  
  // Get recent achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
    .limit(5)
  
  return {
    missions: progress || [],
    profile: profile || { xp: 0, level: 1, badge_level: 'Recruit' },
    achievements: achievements || []
  }
}

/**
 * Send mission completion email to user
 */
async function sendMissionCompletionEmail(userId: string, missionId: string, xpEarned: number) {
  const supabase = createClient()
  
  // Get user profile for email
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single()
  
  if (!profile?.email) {
    console.error('No email found for user:', userId)
    return
  }

  const missionNames = {
    'shadow-protocol': 'Operation Beacon',
    'cipher-command': 'Cipher Command',
    'ghost-protocol': 'Loop Canyon Base',
    'quantum-breach': 'Quantum Breach'
  }
  
  const nextMissions = {
    'shadow-protocol': 'Cipher Command',
    'cipher-command': 'Loop Canyon Base',
    'ghost-protocol': 'Quantum Breach',
    'quantum-breach': undefined
  }
  
  const missionName = missionNames[missionId as keyof typeof missionNames] || missionId
  const nextMission = nextMissions[missionId as keyof typeof nextMissions]
  
  // Send email via API route
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'mission_complete',
        userName: profile.full_name || 'Agent',
        userEmail: profile.email,
        missionName,
        xpEarned,
        nextMission
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send email')
    }

    console.log('Mission completion email sent successfully')
  } catch (error) {
    console.error('Error sending mission completion email:', error)
    throw error
  }
}