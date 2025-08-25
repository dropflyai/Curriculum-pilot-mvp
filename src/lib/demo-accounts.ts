// Demo accounts for CodeFly Platform
import { createClient } from '@/lib/supabase'

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

// Create demo accounts if they don't exist
export async function createDemoAccounts() {
  const supabase = createClient()
  const results = []

  for (const account of DEMO_ACCOUNTS) {
    try {
      // Check if account already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', account.email)
        .single()

      if (existingUser) {
        results.push({ 
          email: account.email, 
          status: 'exists', 
          message: 'Account already exists' 
        })
        continue
      }

      // Create the account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.fullName,
            role: account.role
          }
        }
      })

      if (authError) {
        results.push({ 
          email: account.email, 
          status: 'error', 
          message: authError.message 
        })
        continue
      }

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: account.email,
            full_name: account.fullName,
            role: account.role
          }])

        if (profileError) {
          results.push({ 
            email: account.email, 
            status: 'partial', 
            message: 'Auth created but profile failed: ' + profileError.message 
          })
        } else {
          results.push({ 
            email: account.email, 
            status: 'created', 
            message: 'Account created successfully' 
          })
        }
      }

    } catch (error) {
      results.push({ 
        email: account.email, 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return results
}

// Quick login function for demo accounts
export async function demoLogin(accountType: 'student' | 'teacher') {
  const account = DEMO_ACCOUNTS.find(acc => acc.role === accountType)
  if (!account) {
    throw new Error(`Demo ${accountType} account not found`)
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password
  })

  if (error) throw error
  return data
}