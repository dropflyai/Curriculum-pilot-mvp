# 📚 KNOWN SOLUTIONS DATABASE - CURRICULUM MVP

## 🚨 CRITICAL ISSUES (Check First!)
- **[Games Redirect Issue](#games-page-redirect-issue)** - RECURRING! (3rd time) → See [REDIRECT-TROUBLESHOOTING-GUIDE.md](./REDIRECT-TROUBLESHOOTING-GUIDE.md)

## Quick Reference Index
1. [🚨 Games Redirect Issue](#games-page-redirect-issue) - **RECURRING CRITICAL**
2. [White Screen Issues](#white-screen-issues)
3. [500 Server Errors](#500-server-errors)
4. [JSX Syntax Errors](#jsx-syntax-errors)
5. [Routes Manifest Missing](#routes-manifest-missing)
6. [Dashboard Container Issues](#dashboard-container-issues)
7. [Database Content Mismatch](#database-content-mismatch)
8. [Vercel Build Failures](#vercel-build-failures)

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

---

## 🚨 Games Page Redirect Issue

### Problem: "Start Learning" Button Redirects to /auth Instead of Working
**CRITICAL RECURRING ISSUE** - Occurrence #3
**Fixed on**: Sept 6, 2025, Sept 7, 2025 (twice), Sept 7, 2025 (created comprehensive guide)
**Symptoms**: Clicking "Start Learning" button on `/games` page redirects to `/auth` instead of `/mission-hq`

**⚡ IMMEDIATE ACTION REQUIRED**: 
→ **See [REDIRECT-TROUBLESHOOTING-GUIDE.md](./REDIRECT-TROUBLESHOOTING-GUIDE.md) for complete fix protocol**
→ **See [VERIFICATION-CHECKLIST.md](./VERIFICATION-CHECKLIST.md) for testing steps**

**ROOT CAUSE**: After restoring git commits, middleware.ts reverts to protecting `/games` and `/mission-hq` routes

**QUICK FIX** (Full details in troubleshooting guide):
1. Move `/games` and `/mission-hq` to public routes in middleware.ts
2. Remove from student routes section
3. Test immediately: games → Start Learning → should reach mission-hq

**⚠️ WARNING**: This issue returns after git commit restores. Check middleware after any git operations!

---

## Last Updated: Sept 7, 2025

**Note**: Always check this file FIRST when encountering issues. If your solution isn't here, add it after resolving!