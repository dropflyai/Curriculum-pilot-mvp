#!/usr/bin/env node

/**
 * Seed demo accounts in Supabase
 * This script creates the demo accounts in the Supabase auth system
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
}

const DEMO_ACCOUNTS = [
  {
    email: 'demo.student@codefly.com',
    password: 'CodeFly2025!Student$',
    fullName: 'Alex Demo Student',
    role: 'student'
  },
  {
    email: 'demo.teacher@codefly.com', 
    password: 'CodeFly2025!Teacher$',
    fullName: 'Ms. Sarah Demo Teacher',
    role: 'teacher'
  }
]

async function seedDemoAccounts() {
  console.log('🌱 Seeding demo accounts in Supabase...')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase environment variables not found')
    console.error('Make sure .env.local contains:')
    console.error('NEXT_PUBLIC_SUPABASE_URL=your_url')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  console.log('📡 Connected to Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  for (const account of DEMO_ACCOUNTS) {
    try {
      console.log(`\n👤 Creating demo account: ${account.email}`)
      
      // Try to sign up the user
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
        if (authError.message.includes('User already registered')) {
          console.log(`   ✅ Account ${account.email} already exists`)
        } else {
          console.error(`   ❌ Failed to create ${account.email}:`, authError.message)
          continue
        }
      } else if (authData.user) {
        console.log(`   ✅ Created auth user for ${account.email}`)
        
        // Try to create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: account.email,
            full_name: account.fullName,
            role: account.role
          })
          
        if (profileError) {
          console.log(`   ⚠️  Profile creation failed for ${account.email}:`, profileError.message)
          console.log('   (This is OK if the profiles table doesn\'t exist yet)')
        } else {
          console.log(`   ✅ Created profile for ${account.email}`)
        }
      }

      // Test login to verify the account works
      console.log(`   🔍 Testing login for ${account.email}...`)
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password
      })

      if (loginError) {
        console.error(`   ❌ Login test failed for ${account.email}:`, loginError.message)
      } else {
        console.log(`   ✅ Login test successful for ${account.email}`)
        
        // Sign out after test
        await supabase.auth.signOut()
      }

    } catch (error) {
      console.error(`   ❌ Unexpected error for ${account.email}:`, error.message)
    }
  }

  console.log('\n🎉 Demo account seeding complete!')
  console.log('\nDemo credentials:')
  DEMO_ACCOUNTS.forEach(account => {
    console.log(`  • ${account.email} / ${account.password} (${account.role})`)
  })
}

// Run the seeding
seedDemoAccounts().catch(console.error)