// Authentication helpers for Black Cipher with activation keys
import { signUp, signIn as baseSignIn } from '@/lib/auth'
import { AuthUser } from '@/lib/auth'

// Activation key configuration
const VALID_ACTIVATION_KEYS = {
  // Student keys
  'BC-STUDENT-2024': { role: 'student', expires: '2025-12-31' },
  'BC-TRAINEE-ALPHA': { role: 'student', expires: '2025-06-30' },
  'BC-RECRUIT-BETA': { role: 'student', expires: '2025-09-30' },
  'BC-CADET-GAMMA': { role: 'student', expires: '2025-03-31' },
  
  // Teacher keys
  'BC-TEACHER-2024': { role: 'teacher', expires: '2025-12-31' },
  'BC-COMMANDER-ALPHA': { role: 'teacher', expires: '2025-12-31' },
  'BC-INSTRUCTOR-BETA': { role: 'teacher', expires: '2025-09-30' },
  
  // Demo keys for testing
  'BC-DEMO-STUDENT': { role: 'student', expires: '2030-12-31' },
  'BC-DEMO-TEACHER': { role: 'teacher', expires: '2030-12-31' },
  'BC-TEST-ACCESS': { role: 'student', expires: '2030-12-31' }
} as const

// School and class codes
const VALID_SCHOOL_CODES = {
  'TECH-HIGH-2024': { name: 'Tech High School', location: 'Silicon Valley' },
  'CYBER-ACADEMY': { name: 'Cyber Security Academy', location: 'Boston' },
  'CODE-PREP': { name: 'Code Prep School', location: 'Austin' },
  'STEM-CENTRAL': { name: 'STEM Central High', location: 'Seattle' }
}

const VALID_CLASS_CODES = {
  'PYTHON-101-A': { name: 'Python Basics - Section A', teacher: 'Ms. Johnson' },
  'PYTHON-101-B': { name: 'Python Basics - Section B', teacher: 'Mr. Smith' },
  'CYBER-ADV-X': { name: 'Advanced Cybersecurity', teacher: 'Dr. Chen' },
  'AI-INTRO-Z': { name: 'Introduction to AI', teacher: 'Prof. Williams' }
}

/**
 * Validates an activation key for Black Cipher access
 */
export async function validateActivationKey(activationKey: string): Promise<boolean> {
  try {
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const keyConfig = VALID_ACTIVATION_KEYS[activationKey as keyof typeof VALID_ACTIVATION_KEYS]
    
    if (!keyConfig) {
      return false
    }
    
    // Check if key has expired
    const expirationDate = new Date(keyConfig.expires)
    const currentDate = new Date()
    
    if (currentDate > expirationDate) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error validating activation key:', error)
    return false
  }
}

/**
 * Gets the role associated with an activation key
 */
export function getActivationKeyRole(activationKey: string): 'student' | 'teacher' | null {
  const keyConfig = VALID_ACTIVATION_KEYS[activationKey as keyof typeof VALID_ACTIVATION_KEYS]
  return keyConfig?.role || null
}

/**
 * Creates a new Black Cipher account with activation key validation
 */
export async function createAccount(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'teacher',
  codename: string
): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    // Create account using existing auth system
    const { user, error } = await signUp(email, password, fullName, role)
    
    if (error || !user) {
      return { user: null, error: error || new Error('Failed to create account') }
    }

    // Store codename and Black Cipher specific data
    if (typeof window !== 'undefined') {
      const blackCipherProfile = {
        userId: user.id,
        codename,
        role,
        joinedAt: new Date().toISOString(),
        missionStatus: 'ACTIVE',
        clearanceLevel: role === 'teacher' ? 'COMMAND' : 'FIELD'
      }
      
      localStorage.setItem(`bc_profile_${user.id}`, JSON.stringify(blackCipherProfile))
    }

    return { user, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error('Unknown error during account creation')
    }
  }
}

/**
 * Enhanced sign in with Black Cipher session management
 */
export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const { user, error } = await baseSignIn(email, password)
    
    if (error || !user) {
      return { user: null, error: error || new Error('Authentication failed') }
    }

    // Initialize Black Cipher session
    if (typeof window !== 'undefined') {
      const sessionData = {
        userId: user.id,
        loginTime: new Date().toISOString(),
        sessionId: `bc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        lastActivity: new Date().toISOString()
      }
      
      localStorage.setItem('bc_session', JSON.stringify(sessionData))
    }

    return { user, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error('Authentication failed')
    }
  }
}

/**
 * Joins a school using a school code
 */
export async function joinSchool(userId: string, schoolCode: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const school = VALID_SCHOOL_CODES[schoolCode as keyof typeof VALID_SCHOOL_CODES]
    
    if (!school) {
      return { success: false, error: new Error('Invalid school code') }
    }

    // Store school membership
    if (typeof window !== 'undefined') {
      const schoolMembership = {
        userId,
        schoolCode,
        schoolName: school.name,
        location: school.location,
        joinedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`bc_school_${userId}`, JSON.stringify(schoolMembership))
    }

    // In a real app, this would make an API call to join the school
    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true, error: null }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to join school')
    }
  }
}

/**
 * Joins a class using a class code
 */
export async function joinClass(userId: string, classCode: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const classInfo = VALID_CLASS_CODES[classCode as keyof typeof VALID_CLASS_CODES]
    
    if (!classInfo) {
      return { success: false, error: new Error('Invalid class code') }
    }

    // Store class membership
    if (typeof window !== 'undefined') {
      const classMembership = {
        userId,
        classCode,
        className: classInfo.name,
        teacher: classInfo.teacher,
        joinedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`bc_class_${userId}`, JSON.stringify(classMembership))
    }

    // In a real app, this would make an API call to join the class
    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true, error: null }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to join class')
    }
  }
}

/**
 * Gets Black Cipher profile for a user
 */
export function getBlackCipherProfile(userId: string) {
  if (typeof window === 'undefined') return null
  
  const profile = localStorage.getItem(`bc_profile_${userId}`)
  return profile ? JSON.parse(profile) : null
}

/**
 * Gets user's school membership
 */
export function getUserSchool(userId: string) {
  if (typeof window === 'undefined') return null
  
  const school = localStorage.getItem(`bc_school_${userId}`)
  return school ? JSON.parse(school) : null
}

/**
 * Gets user's class membership
 */
export function getUserClass(userId: string) {
  if (typeof window === 'undefined') return null
  
  const classInfo = localStorage.getItem(`bc_class_${userId}`)
  return classInfo ? JSON.parse(classInfo) : null
}

/**
 * Role-based redirect after authentication
 */
export function getRedirectPath(user: AuthUser): string {
  const profile = getBlackCipherProfile(user.id)
  const role = user.role || profile?.role

  switch (role) {
    case 'teacher':
      return '/teacher/console'
    case 'admin':
      return '/admin/dashboard'
    case 'student':
    default:
      return '/student/dashboard'
  }
}

/**
 * Checks if user has required clearance level
 */
export function hasRequiredClearance(
  user: AuthUser | null, 
  requiredLevel: 'FIELD' | 'COMMAND' | 'ADMIN'
): boolean {
  if (!user) return false
  
  const profile = getBlackCipherProfile(user.id)
  const clearanceLevel = profile?.clearanceLevel || 
    (user.role === 'admin' ? 'ADMIN' : 
     user.role === 'teacher' ? 'COMMAND' : 'FIELD')
  
  const levelHierarchy = {
    'FIELD': 0,
    'COMMAND': 1,
    'ADMIN': 2
  }
  
  return levelHierarchy[clearanceLevel as keyof typeof levelHierarchy] >= levelHierarchy[requiredLevel]
}

/**
 * Updates user's last activity for session management
 */
export function updateActivity() {
  if (typeof window === 'undefined') return
  
  const session = localStorage.getItem('bc_session')
  if (session) {
    const sessionData = JSON.parse(session)
    sessionData.lastActivity = new Date().toISOString()
    localStorage.setItem('bc_session', JSON.stringify(sessionData))
  }
}

/**
 * Checks if Black Cipher session is active
 */
export function isSessionActive(): boolean {
  if (typeof window === 'undefined') return false
  
  const session = localStorage.getItem('bc_session')
  if (!session) return false
  
  const sessionData = JSON.parse(session)
  const lastActivity = new Date(sessionData.lastActivity)
  const now = new Date()
  
  // Session expires after 24 hours of inactivity
  const sessionTimeout = 24 * 60 * 60 * 1000
  
  return (now.getTime() - lastActivity.getTime()) < sessionTimeout
}

/**
 * Clears Black Cipher session data
 */
export function clearSession() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('bc_session')
}

// Export all valid codes for admin purposes
export const BLACK_CIPHER_CODES = {
  ACTIVATION_KEYS: VALID_ACTIVATION_KEYS,
  SCHOOL_CODES: VALID_SCHOOL_CODES,
  CLASS_CODES: VALID_CLASS_CODES
} as const