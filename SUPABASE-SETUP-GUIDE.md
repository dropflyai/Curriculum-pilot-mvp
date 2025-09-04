# 🚀 Supabase Setup Guide for Agent Academy

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL**: `https://YOUR-PROJECT-ID.supabase.co`
   - **Anon/Public Key**: `eyJ...` (long string)

## Step 2: Update Environment Variables

Replace the demo values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `src/lib/database-schema.sql`
4. Paste and click **Run**

This will create all tables:
- profiles (users)
- schools & classes
- teams
- missions & lessons
- student_progress
- code_submissions
- achievements
- leaderboard
- activity_feed
- team_chat
- class_analytics

## Step 4: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Optional: Enable **Google** or **GitHub** for social login

## Step 5: Set Up Storage (for avatars/images)

1. Go to **Storage**
2. Create a new bucket called `avatars`
3. Set it to **Public**
4. Create another bucket called `lesson-assets`

## Step 6: Enable Realtime

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `activity_feed`
   - `team_chat`
   - `leaderboard`

## Step 7: Test the Connection

After updating `.env.local`, restart the Next.js server:

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

Visit any page that uses authentication to test the connection.

## Step 8: Create Test Data (Optional)

Run this in SQL Editor to create sample data:

```sql
-- Create a test teacher account (use Auth dashboard to create user first)
INSERT INTO profiles (id, email, full_name, role, codename)
VALUES (
  'YOUR-USER-ID-HERE',
  'teacher@test.com',
  'Ms. Johnson',
  'teacher',
  'Commander Alpha'
);

-- Create a test class
INSERT INTO classes (teacher_id, name, code)
VALUES (
  'YOUR-USER-ID-HERE',
  'Period 1 - Intro to Python',
  'CLASS123'
);

-- Create test students (create users in Auth first)
-- Students can join using the class code
```

## Common Issues & Solutions

### Issue: "Supabase not configured" error
**Solution**: Make sure `.env.local` has the correct URL and key

### Issue: Tables not found
**Solution**: Run the database schema SQL script

### Issue: Authentication not working
**Solution**: Enable Email provider in Authentication settings

### Issue: Real-time not updating
**Solution**: Enable replication for the required tables

## Next Steps

Once connected:
1. Students can create accounts and join classes with codes
2. Teachers can monitor progress in real-time
3. Leaderboards will update automatically
4. Team collaboration features will work
5. All progress will sync across devices

## Need Help?

Check the Supabase documentation: https://supabase.com/docs

Or check our helper functions in `src/lib/database-helpers.ts`