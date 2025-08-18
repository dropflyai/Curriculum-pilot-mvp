# Coding Pilot MVP - Project Memory

## Project Overview
**Goal:** Build MVP educational platform for 9th-grade coding curriculum
**Timeline:** 3 weeks (Aug 18 - Aug 29, 2025)
**Tech Stack:** Next.js 15 + TypeScript + Tailwind + Supabase + Pyodide

## Current Status: Day 1 (Aug 18, 2025)

### ✅ COMPLETED TASKS
1. **Development Environment Setup**
   - ✅ Next.js 15 app initialized with TypeScript & Tailwind
   - ✅ Supabase client libraries installed (@supabase/supabase-js, @supabase/ssr)
   - ✅ Pyodide and Lucide React installed
   - ✅ Project running at localhost:3000
   - ✅ Git repository initialized

2. **Database Architecture**
   - ✅ Complete schema designed (users, lessons, progress tables)
   - ✅ Row Level Security policies created
   - ✅ TypeScript types defined
   - ✅ Migration files ready (001_initial_schema.sql, 002_seed_lesson_1.sql)
   - ✅ Supabase client configuration (src/lib/supabase.ts)

3. **Content Preparation**
   - ✅ Week 1 "Magic 8-Ball" lesson fully defined
   - ✅ Lesson includes: learn content, starter code, tests, quiz, rubric
   - ✅ Standards alignment (FL-CPALMS)
   - ✅ Seed data prepared for database

4. **Frontend Components**
   - ✅ Landing page with navigation (src/app/page.tsx)
   - ✅ Student Dashboard with lesson cards (src/app/dashboard/page.tsx)
   - ✅ Lesson Viewer with Learn/Code/Submit tabs (src/app/lesson/[id]/page.tsx)
   - ✅ Teacher Dashboard with roster & progress tracking (src/app/teacher/page.tsx)

### 🔄 IN PROGRESS
- **Supabase Setup** (user handling in separate window)
  - Need to create project at supabase.com
  - Run migrations via SQL editor
  - Update .env.local with credentials
- **Code Sandbox Enhancement** - Pyodide integration for real Python execution
- **Authentication System** - User login/signup flow

### 📋 TODO QUEUE
1. **Pyodide Integration** - Real Python code execution in browser
2. **Authentication** - Supabase Auth with user roles
3. **Assessment System** - Quiz functionality and auto-grading
4. **Deploy to Vercel** - Production deployment with env vars

## File Structure
```
C:\Users\escot\coding-pilot-mvp\
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── supabase.ts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_seed_lesson_1.sql
├── scripts/
│   └── setup-database.md
├── .env.local (needs Supabase credentials)
└── package.json
```

## Database Schema
- **users**: Extends auth.users with role (student/teacher/admin)
- **lessons**: Course content, objectives, code, tests, assessment
- **progress**: Student completion tracking, submissions, scores

## Key Dependencies
- Next.js 15.4.7 (with Turbopack)
- @supabase/supabase-js + @supabase/ssr
- pyodide (for in-browser Python execution)
- lucide-react (icons)

## Sprint Plan Alignment
Following Day 1 objectives from sprint plan:
- ✅ Next.js scaffold + Student Dashboard shell (ready)
- ✅ Supabase project, tables, RLS (designed, ready for deployment)
- ✅ Lock scope, finalize Lesson 1 content (done)

**Exit Criteria Met:** Repo initialized; DB connected locally (pending); Lesson 1 content frozen ✅

## Next Development Session Goals
1. Build Student Dashboard with lesson cards
2. Create lesson viewer with tabbed interface
3. Implement basic code sandbox
4. Test end-to-end workflow

## Commands to Remember
```bash
# Start development server
cd "C:\Users\escot\coding-pilot-mvp" && npm run dev

# Install new packages
npm install [package-name]

# Check database connection (after Supabase setup)
# Test with simple query in app
```

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
OPENAI_API_KEY=[for-future-ai-tutor] (optional for MVP)
```

## Success Metrics for MVP
- Student can login, view lesson, code, submit
- Teacher can see roster and progress
- Magic 8-Ball lesson works end-to-end
- Deployable to Vercel for classroom use