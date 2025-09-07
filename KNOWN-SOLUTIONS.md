# 📚 KNOWN SOLUTIONS DATABASE - CURRICULUM MVP

## Quick Reference Index
1. [Auth Redirect Issues](#auth-redirect-issues) 🆕
2. [White Screen Issues](#white-screen-issues)
3. [500 Server Errors](#500-server-errors)
4. [JSX Syntax Errors](#jsx-syntax-errors)
5. [Routes Manifest Missing](#routes-manifest-missing)
6. [Dashboard Container Issues](#dashboard-container-issues)
7. [Database Content Mismatch](#database-content-mismatch)

---

## Auth Redirect Issues

### Problem: Start Learning Button Redirects to Auth Instead of Mission-HQ
**Date Discovered**: Sept 7, 2025
**Status**: IN PROGRESS
**Symptoms**: 
- Clicking "Start Learning" on `/games` redirects to `/auth`
- Auto-authentication with demo credentials not working
- User not authenticated despite API call succeeding

**Debug Steps Taken**:
1. Added auto-auth API call in handleGameSelect
2. Created POST endpoint to set demo cookies
3. Updated demo tokens from 2024 to 2025
4. Added comprehensive debug logging

**SOLUTION**: ✅ **RESOLVED** - Cookie persistence issue between client and server

**Root Cause**: Browser navigation was happening before cookies were fully committed to browser storage

**Fix Applied**:
1. **Increased navigation delay** from 500ms to 1000ms in games page
2. **Added server-side cookie verification** before navigation
3. **Enhanced cookie options** with explicit path configuration
4. **Added /api/user/role to public routes** in middleware

**Key Files Fixed**:
- `/src/app/games/page.tsx` - Added cookie verification loop
- `/src/app/api/user/role/route.ts` - Enhanced cookie setting with dual methods  
- `/src/middleware.ts` - Added API routes to public access

**Prevention**: Always verify server-side cookie availability before client navigation

**Debug Commands**:
```bash
# Monitor console for debug output with prefixes:
# 🎯 DEBUG: Games page
# 🔥 DEBUG API: API route
# ⚡ DEBUG MIDDLEWARE: Middleware
# 🏰 DEBUG MISSION-HQ: Mission HQ page
# 🍪 DEBUG COOKIES: Cookie operations

# Test API endpoint directly
curl -X POST http://localhost:3002/api/user/role \
  -H "Content-Type: application/json" \
  -d '{"role":"student","demoMode":true,"gameId":"agent-academy"}' \
  -v

# Check cookies in browser console
document.cookie
```

---

## White Screen Issues

### Problem: React App Shows White Screen
**Symptoms**: Blank white page, no content visible
**Common Causes**: 
- JSX syntax errors preventing compilation
- Missing imports or components
- Unclosed HTML/JSX tags

**SOLUTION**:
```bash
# 1. Check for TypeScript/JSX errors
npx tsc --noEmit

# 2. Look for unclosed tags in the error output
# 3. Fix the specific line numbers mentioned
# 4. Restart dev server
```

**Files Often Affected**:
- `src/app/student/dashboard/page.tsx`
- `src/app/dashboard/page.tsx`

---

## 500 Server Errors

### Problem: Error 500 - routes-manifest.json Missing
**Symptoms**: Server returns 500 error, routes-manifest.json not found
**Error**: `ENOENT: no such file or directory, open '.next/routes-manifest.json'`

**SOLUTION**:
```bash
# 1. Kill all running servers
lsof -i :3003 | grep LISTEN | awk '{print $2}' | xargs kill -9

# 2. Clear all build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

# 3. Run production build to generate manifests
npm run build

# 4. Start fresh dev server
PORT=3003 npm run dev
```

---

## JSX Syntax Errors

### Problem: Unclosed JSX Elements in Student Dashboard
**Fixed on**: Sept 3, 2025
**Lines Affected**: 179, 225, 227, 965, 1059

**SOLUTION**:
```typescript
// Common fixes:
// 1. Line 179: Main container div - ensure proper closing
// 2. Lines 225-227: Content section divs - match opening/closing tags
// 3. Line 965: Check for missing closing braces in conditional rendering
// 4. Line 1059: Verify component has proper return statement closing
```

---

## Routes Manifest Missing

### Problem: Next.js Not Generating Build Artifacts
**Symptoms**: Missing .next/routes-manifest.json, .next/build-manifest.json

**SOLUTION**:
```bash
# Force complete rebuild
npm run build

# If that fails, try:
rm -rf .next node_modules package-lock.json
npm install
npm run build
npm run dev
```

---

## Dashboard Container Issues

### Problem: Quest Map Enhancements Not Showing
**Fixed on**: Sept 2, 2025
**Root Cause**: Dashboard wrapping quest map in fixed 800px container

**SOLUTION**:
Both `/dashboard` and `/student/dashboard` routes had container conflicts:
```typescript
// WRONG - Crops content
<div className="relative h-[800px] rounded-2xl overflow-hidden">
  <AAAGameMap />
</div>

// CORRECT - Full viewport control
<div className="fixed inset-0 z-50 bg-slate-950">
  <AAAGameMap />
</div>
```

---

## Database Content Mismatch

### Problem: Teacher Dashboard Shows Old Curriculum
**Fixed on**: Sept 3, 2025
**Root Cause**: Database has stale data, not matching getAllLessons()

**SOLUTION in** `src/app/teacher/page.tsx`:
```typescript
// Force use of file-based lessons instead of database
const realLessons = getAllLessons()
const lessonsData = realLessons.map((lesson, index) => ({
  id: lesson.id,
  week: index + 1,
  title: lesson.title,
  // ... additional mapping
}))
```

---

## Common Command Solutions

### Clear Everything and Start Fresh
```bash
# Nuclear option - complete reset
kill $(lsof -t -i:3003)
rm -rf .next node_modules package-lock.json tsconfig.tsbuildinfo
npm install
npm run build
PORT=3003 npm run dev
```

### Check What's Running on Ports
```bash
lsof -i :3003  # Check port 3003
lsof -i :3000-3100  # Check range of ports
```

### TypeScript Error Check
```bash
npx tsc --noEmit  # Check for TS errors without building
```

---

## Prevention Checklist

Before Starting Development:
- [ ] Clear .next folder if switching branches
- [ ] Run `npm install` after pulling changes
- [ ] Check TypeScript compilation with `npx tsc --noEmit`
- [ ] Kill any existing servers on the port
- [ ] Run `npm run build` at least once for new clones

---

## Vercel Build Failures

### Problem: Extra JSX Closing Tag Prevents Deployment
**Fixed on**: Sept 5, 2025
**Symptoms**: "Failed to execute 'fetch' on 'Window': Invalid value", Vercel build fails
**Error**: Unterminated regexp literal, JSX syntax error

**SOLUTION**:
```typescript
// Check for extra closing div tags in JSX components
// Common location: auth page around line 339
// WRONG - Extra closing tag:
        </div>
        </div>  // <- Remove this extra closing div
      </div>
    </div>

// CORRECT:
        </div>
      </div>
    </div>
```

**Files Often Affected**:
- `src/app/auth/page.tsx` (line 339)
- Any component with nested JSX structures

**Verification**:
```bash
npm run build  # Should complete successfully
npx vercel --prod --yes  # Should deploy without errors
```

---

## Authentication Redirect Issues

### Problem: /games Page Redirects Back to Auth Page
**Fixed on**: Sept 6, 2025
**Symptoms**: User logs in successfully but `/games` route redirects back to `/auth`
**Root Cause**: Cookies not set with proper security flags for HTTPS in production

**SOLUTION**:
```typescript
// In auth page, set cookies with proper Secure flag based on protocol
document.cookie = `test_user=${userCookie}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
document.cookie = `test_authenticated=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
```

**Additional Debug Fix** - Add logging to middleware:
```typescript
// In middleware.ts - checkTestAuth function
console.log('Test auth cookies:', { testAuth, testUser: !!testUser })
if (testAuth === 'true' && testUser) {
  const user = JSON.parse(decodeURIComponent(testUser))
  console.log('Test user parsed successfully:', user.email, user.role)
  // ...
}
```

**Files Affected**:
- `src/app/auth/page.tsx` (cookie setting)
- `src/middleware.ts` (debug logging)

---

## Authentication Redirect Issues (UPDATED)

### Problem: /games Page Redirects Back to Auth After Login - RESOLVED
**Updated on**: Sept 6, 2025
**Root Cause**: The `/games` route was incorrectly configured as a protected route requiring student authentication, but the page was designed as a public game selection page.

**COMPLETE SOLUTION**:

1. **Updated middleware route protection** in `src/middleware.ts`:
```typescript
// Move /games from protected student routes to public routes
public: [
  '/',
  '/auth',
  '/auth/signup', 
  '/signin',
  '/games',  // <-- Moved here from student routes
  '/api/lessons',
  '/api/list'
],

// Remove /games from student routes
student: [
  '/student',
  '/homework',
  // ... other routes (without /games)
],
```

2. **Enhanced /games page** in `src/app/games/page.tsx`:
```typescript
// Added authentication detection
function useAuth() {
  // Check localStorage and cookies for auth state
  // Show different UI for authenticated vs unauthenticated users
}

// Updated game selection handler
const handleGameSelect = (game: Game) => {
  if (!isAuthenticated) {
    localStorage.setItem('intended_game', game.id)
    router.push('/auth')  // Redirect to login with intended game stored
    return
  }
  // ... proceed to game for authenticated users
}
```

3. **Improved cookie handling** in `src/app/auth/page.tsx`:
```typescript
// Better cookie setting with error handling and delays
const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`

try {
  document.cookie = `test_user=${userCookie}; ${cookieOptions}`
  document.cookie = `test_authenticated=true; ${cookieOptions}`
  document.cookie = `user_role=${testAccount.role}; ${cookieOptions}`
  
  // Small delay to ensure cookies are set before redirect
  await new Promise(resolve => setTimeout(resolve, 100))
} catch (cookieError) {
  console.error('Cookie setting error:', cookieError)
}

// Handle intended game after login
const intendedGame = localStorage.getItem('intended_game')
if (intendedGame) {
  localStorage.removeItem('intended_game')
  if (intendedGame === 'agent-academy') {
    router.push('/mission-hq')
    return
  }
}
```

**Result**: 
- `/games` is now accessible without authentication (public landing page)
- Authenticated users see personalized content and can access games directly
- Unauthenticated users are redirected to login and returned to their intended game
- Cookie handling is more robust with proper error handling

**Files Modified**:
- `src/middleware.ts` (route protection configuration)
- `src/app/games/page.tsx` (authentication detection and UI)
- `src/app/auth/page.tsx` (improved cookie handling and redirect logic)

---

## Last Updated: Sept 6, 2025

**Note**: Always check this file FIRST when encountering issues. If your solution isn't here, add it after resolving!