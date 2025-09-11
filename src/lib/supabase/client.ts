import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that throws descriptive errors
    return {
      auth: {
        signUp: () => Promise.reject(new Error('Supabase not configured')),
        signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
        signOut: () => Promise.reject(new Error('Supabase not configured')),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: () => Promise.reject(new Error('Supabase not configured'))
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () => Promise.reject(new Error('Supabase not configured')),
            order: (column: string, options?: any) => ({
              limit: (count: number) => Promise.reject(new Error('Supabase not configured'))
            })
          }),
          order: (column: string, options?: any) => ({
            limit: (count: number) => Promise.reject(new Error('Supabase not configured'))
          }),
          limit: (count: number) => Promise.reject(new Error('Supabase not configured'))
        }),
        insert: (data: any) => Promise.reject(new Error('Supabase not configured')),
        update: (data: any) => ({
          eq: (column: string, value: any) => Promise.reject(new Error('Supabase not configured'))
        }),
        upsert: (data: any) => Promise.reject(new Error('Supabase not configured')),
        delete: () => ({
          eq: (column: string, value: any) => Promise.reject(new Error('Supabase not configured'))
        })
      }),
      rpc: (name: string, params?: any) => Promise.reject(new Error('Supabase not configured'))
    } as any
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

// Server-side client for API routes
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be set')
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

export type SupabaseClient = ReturnType<typeof createClient>