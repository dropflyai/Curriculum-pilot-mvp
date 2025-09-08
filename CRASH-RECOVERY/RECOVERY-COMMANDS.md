# RECOVERY COMMANDS - Complete System Restoration

## CRITICAL: Execute These Commands to Restore Exact State

### 🚨 Emergency Recovery (If System Crashed)

```bash
# Navigate to project directory
cd /Users/rioallen/Documents/DropFly-OS-App-Builder/DropFly-PROJECTS/Curriculum-pilot-mvp

# Verify git state and current commit
git log -1 --oneline
# Expected: 7c57970 🚨 EMERGENCY FIX: Auth blocking all pages - restore public routes access

# Check current branch
git status
# Expected: On branch main, working tree clean

# Start development server on working port
PORT=3022 npm run dev
# Expected: Server starts on http://localhost:3022
```

### 🔍 System Verification Commands

```bash
# Check Vercel deployments
npx vercel ls
# Expected: Latest deployment https://curriculum-pilot-y6du1tpme-dropflyai.vercel.app

# Verify critical routes locally
curl -I http://localhost:3022/
curl -I http://localhost:3022/games  
curl -I http://localhost:3022/mission-hq
curl -I http://localhost:3022/auth
# Expected: All return 200 OK

# Check production routes
curl -I https://curriculum-pilot-y6du1tpme-dropflyai.vercel.app/games
curl -I https://curriculum-pilot-y6du1tpme-dropflyai.vercel.app/mission-hq
# Expected: All return 200 OK
```

### 🛠️ Development Environment Setup

```bash
# Install dependencies (if needed)
npm install

# Check environment variables
ls -la .env.local
# Expected: File exists with Supabase configuration

# Verify middleware configuration
cat src/middleware.ts | grep -A 10 "publicRoutes"
# Expected: Array includes '/', '/auth', '/games', '/mission-hq'

# Check for running processes on ports
lsof -i :3022
lsof -i :3002
# Expected: 3022 in use by npm/next, 3002 may be blocked
```

### 🔄 Process Management

```bash
# Kill any conflicting processes (if needed)
pkill -f "PORT=3002"
pkill -f "PORT=3022"

# Restart development server
PORT=3022 npm run dev

# Monitor server logs for debug output
# Expected to see: 
# "🔍 MIDDLEWARE DEBUG - Path: /games"
# "✅ MIDDLEWARE DEBUG - Public route allowed: /games"
```

### 📊 Health Check Commands

```bash
# Check build status
npm run build
# Expected: Build completes without errors

# Test production build locally
npm run start
# Expected: Production server starts successfully

# Lint check
npm run lint
# Expected: No critical errors
```

### 🚀 Deployment Commands (If Needed)

```bash
# Trigger new deployment
git add -A
git commit -m "🔄 Recovery deployment after crash"
git push origin main

# Monitor deployment
npx vercel ls
# Wait for new deployment to show "Ready" status

# Verify deployment
npx vercel --prod
# Check latest production URL
```

### 🔐 Authentication Verification

```bash
# Test auth endpoints
curl -X POST http://localhost:3022/api/auth/signin
curl -X GET http://localhost:3022/api/auth/session

# Verify Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Supabase connected:', supabase ? 'SUCCESS' : 'FAILED');
"
```

### 📁 File System Verification

```bash
# Check critical files exist
ls -la src/middleware.ts
ls -la src/app/games/
ls -la src/app/mission-hq/
ls -la .env.local

# Verify CRASH-RECOVERY documentation
ls -la CRASH-RECOVERY/
# Expected: All recovery files present
```

### 🚨 Emergency Rollback (If Current State Broken)

```bash
# Rollback to previous working commit (use with caution)
git log --oneline -5
git reset --hard <previous-working-commit>
git push --force-with-lease origin main

# Redeploy after rollback
npx vercel --prod
```

## ⚠️ IMPORTANT NOTES

### Current Working State
- **Working Port**: 3022 (NOT 3002)
- **Latest Commit**: 7c57970 
- **Production URL**: https://curriculum-pilot-y6du1tpme-dropflyai.vercel.app
- **Environment**: .env.local configured

### Key Recovery Indicators
1. **Middleware Debug Logs**: Should show public routes being allowed
2. **Route Access**: /games and /mission-hq return 200 OK
3. **Development Server**: Runs on port 3022 without conflicts
4. **Production**: Latest deployment shows "Ready" status

### If Recovery Fails
1. Check git commit hash matches 7c57970
2. Verify .env.local exists and has Supabase credentials
3. Ensure port 3022 is free before starting server
4. Check middleware.ts has correct publicRoutes array
5. Verify latest Vercel deployment is successful

**Last Updated**: September 7, 2025 - 12:24 PM PT