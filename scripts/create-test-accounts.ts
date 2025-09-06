import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = 'https://kumocwwziopyilwhfiwb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bW9jd3d6aW9weWlsd2hmaXdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzExNDIzOCwiZXhwIjoyMDQ4NjkwMjM4fQ.PxpYz-wm7u3B2ACMB_9EOSW-4qjC4hdUdIKYQ1_zMkM'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test accounts to create
const testAccounts = [
  {
    email: 'student@codefly.test',
    password: 'test123456',
    fullName: 'Test Student',
    role: 'student'
  },
  {
    email: 'teacher@codefly.test', 
    password: 'test123456',
    fullName: 'Test Teacher',
    role: 'teacher'
  },
  {
    email: 'admin@codefly.test',
    password: 'test123456', 
    fullName: 'Test Admin',
    role: 'admin'
  }
]

async function createTestAccounts() {
  console.log('Creating test accounts in Supabase...')
  
  for (const account of testAccounts) {
    try {
      console.log(`Creating account: ${account.email}`)
      
      // Create user with admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Skip email confirmation for test accounts
        user_metadata: {
          full_name: account.fullName,
          role: account.role
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✓ Account ${account.email} already exists`)
          continue
        }
        throw error
      }

      if (data.user) {
        console.log(`✓ Created user: ${account.email} (${data.user.id})`)
        
        // Ensure profile is created (should happen automatically via trigger)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: account.email,
            full_name: account.fullName,
            role: account.role
          })

        if (profileError) {
          console.log(`Warning: Profile creation failed for ${account.email}:`, profileError.message)
        } else {
          console.log(`✓ Profile created for: ${account.email}`)
        }
      }
    } catch (err) {
      console.error(`Failed to create account ${account.email}:`, err)
    }
  }

  console.log('\n✅ Test account creation complete!')
  console.log('\nYou can now login with:')
  console.log('Student: student@codefly.test / test123456')
  console.log('Teacher: teacher@codefly.test / test123456') 
  console.log('Admin: admin@codefly.test / test123456')
}

// Run the script
createTestAccounts().catch(console.error)