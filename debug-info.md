# Debug Steps for Student Dashboard

## Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Look for any network request failures

## Check Network Tab
1. In Developer Tools, go to Network tab
2. Refresh the student dashboard page
3. Look for requests to Supabase (should see requests with your Supabase URL)
4. Check if any requests are failing (red status codes)

## Common Issues to Check:

### 1. Environment Variables
- Verify .env.local has correct Supabase URL and key
- Make sure no typos in the credentials

### 2. Database Data
- Check if lesson data was actually inserted in Supabase
- Go to Supabase dashboard → Table Editor → lessons table
- Should see 1 row with Magic 8-Ball lesson

### 3. RLS Policies
- Might need to temporarily disable RLS for testing
- Or create a temporary user to test with

## Quick Database Test
Let's add a simple console.log to see what's happening with the database query.