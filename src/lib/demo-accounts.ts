// Demo accounts for CodeFly Platform

export interface DemoAccount {
  email: string
  password: string
  fullName: string
  role: 'student' | 'teacher'
  description: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'student@codefly.demo',
    password: 'demo123',
    fullName: 'Alex Demo Student',
    role: 'student',
    description: 'Demo student account with progress in lessons and homework'
  },
  {
    email: 'teacher@codefly.demo',
    password: 'demo123',
    fullName: 'Ms. Sarah Demo Teacher',
    role: 'teacher',
    description: 'Demo teacher account with access to full classroom management'
  }
]


// Quick login function for demo accounts
export async function demoLogin(accountType: 'student' | 'teacher') {
  const account = DEMO_ACCOUNTS.find(acc => acc.role === accountType)
  if (!account) {
    throw new Error(`Demo ${accountType} account not found`)
  }

  // Always use localStorage for demo accounts to avoid Supabase dependency
  const mockUser = {
    id: `demo-${accountType}`,
    email: account.email,
    full_name: account.fullName,
    role: account.role
  }
  
  // Store demo user in localStorage
  localStorage.setItem('demo_user', JSON.stringify(mockUser))
  localStorage.setItem('demo_authenticated', 'true')
  
  // Set cookies for middleware authentication
  document.cookie = `demo_user=${JSON.stringify(mockUser)}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  document.cookie = `demo_authenticated=true; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  document.cookie = `user_role=${account.role}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  
  return { user: mockUser }
}