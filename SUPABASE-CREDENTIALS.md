# Supabase Project Credentials

## Project Details
- **Project Name**: Agent Academy Learning Platform
- **Project ID**: fhopjsgiwvquayyvadaw
- **Dashboard URL**: https://supabase.com/dashboard/project/fhopjsgiwvquayyvadaw

## API Credentials

### Project URL
```
https://fhopjsgiwvquayyvadaw.supabase.co
```

### Anon/Public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob3Bqc2dpd3ZxdWF5eXZhZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTU2MDYsImV4cCI6MjA3MTEzMTYwNn0.f4olgtSkIE9Vr5jQzi8n_DbfEYFNIWfgl3IWL9d14s8
```

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://fhopjsgiwvquayyvadaw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob3Bqc2dpd3ZxdWF5eXZhZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTU2MDYsImV4cCI6MjA3MTEzMTYwNn0.f4olgtSkIE9Vr5jQzi8n_DbfEYFNIWfgl3IWL9d14s8
```

## Important Files

- **Database Schema**: `src/lib/database-schema.sql`
- **Helper Functions**: `src/lib/database-helpers.ts`
- **Supabase Client**: `src/lib/supabase.ts`

## Next Steps

1. Run the database schema in Supabase SQL Editor
2. Enable authentication providers (Email, Google, etc.)
3. Set up storage buckets for avatars and assets
4. Enable realtime for activity_feed, team_chat, and leaderboard tables

## Security Note

⚠️ Never commit the service_role key to version control
⚠️ The anon key is safe to expose in client-side code
⚠️ Always use Row Level Security (RLS) policies