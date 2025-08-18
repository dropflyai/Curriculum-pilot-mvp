# Database Setup Instructions

## Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" → "API" 
3. Copy these values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Run Database Migrations

In your Supabase dashboard:

1. Go to "SQL Editor"
2. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to create tables and policies
4. Copy and paste the content from `supabase/migrations/002_seed_lesson_1.sql` 
5. Click "Run" to insert lesson data and test users

## Step 3: Verify Setup

Check these tables exist in "Table Editor":
- ✅ `users` 
- ✅ `lessons` (should have 1 Magic 8-Ball lesson)
- ✅ `progress`

## Step 4: Test Authentication

The seed script creates these test accounts:
- **Student:** `student@test.com`
- **Teacher:** `teacher@test.com`

You'll need to set passwords in Supabase Auth panel or use magic links.

## Step 5: Update Environment

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Troubleshooting

- **RLS errors:** Make sure Row Level Security policies are enabled
- **Connection issues:** Check your URL and key are correct
- **Migration errors:** Run migrations in order (001 before 002)