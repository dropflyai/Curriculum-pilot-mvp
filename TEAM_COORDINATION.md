# 🤝 Team Coordination Guide - CodeFly Project

## 👥 Team Members
- **Developer 1**: Main developer (you)
- **Developer 2**: Rio Allen

## 🌳 Git Branching Strategy

### Branch Naming Convention
```
feature/[developer-initials]/[feature-name]
fix/[developer-initials]/[issue-description]
enhancement/[developer-initials]/[component-name]
```

### Examples:
- `feature/ra/student-portfolio`
- `fix/dev1/teacher-dashboard-loading`
- `enhancement/ra/3d-map-optimization`

## 📁 File Ownership & Areas of Responsibility

### Core Areas Division

#### **Backend & Data (Developer 1 Focus)**
```
├── src/lib/
│   ├── supabase.ts            [Dev1 Primary]
│   ├── progress-tracking.ts   [Dev1 Primary]
│   ├── auth.ts                [Shared - communicate]
│   └── lesson-data.ts         [Shared - communicate]
├── supabase/migrations/        [Dev1 Primary]
├── src/hooks/                  [Dev1 Primary]
└── src/app/api/               [Dev1 Primary]
```

#### **Frontend & UI (Rio Allen Focus)**
```
├── src/components/
│   ├── 3D Components/         [Rio Primary]
│   ├── AI Components/         [Shared - communicate]
│   └── UI Components/         [Rio Primary]
├── src/app/student/           [Rio Primary]
├── src/app/teacher/           [Shared - MUST communicate]
└── public/assets/             [Rio Primary]
```

#### **Shared Areas (Require Communication)**
```
├── src/app/teacher/page.tsx   [ALWAYS communicate before editing]
├── src/app/page.tsx           [Homepage - coordinate changes]
├── package.json               [Notify team of new dependencies]
└── .env.local                 [Document all new variables]
```

## 🔄 Daily Workflow

### Morning Sync
```bash
# 1. Get latest changes
git checkout main
git fetch origin
git pull origin main

# 2. Check partner's recent work
git log --oneline -5 --author="Rio Allen"

# 3. Create your daily branch
git checkout -b feature/[initials]/[date]-[task]
# Example: feature/dev1/20250904-realtime-fixes
```

### During Work
```bash
# Commit frequently with clear messages
git add .
git commit -m "feat: add student progress webhook"

# Push to your branch regularly
git push origin feature/[your-branch]
```

### End of Day
```bash
# 1. Push all changes
git add .
git commit -m "EOD: [describe progress]"
git push origin feature/[your-branch]

# 2. Create PR if feature is complete
# 3. Notify partner in Discord/Slack/GitHub
```

## 🔀 Merge Protocol

### Before Merging to Main
1. **Pull latest main**
   ```bash
   git checkout main
   git pull origin main
   git checkout [your-branch]
   git merge main
   ```

2. **Test thoroughly**
   - Run `npm run build`
   - Test affected features
   - Check for console errors

3. **Create Pull Request**
   - Title: `[Feature/Fix]: Brief description`
   - Description: List changes and affected files
   - Tag partner for review if touching shared files

4. **Review Process**
   - Partner reviews within 24 hours
   - Address feedback
   - Merge when approved

## ⚠️ Conflict Resolution

### If Merge Conflicts Occur
```bash
# 1. Don't panic!
git status  # See conflicted files

# 2. Open conflicted files
# Look for:
<<<<<<< HEAD
Your changes
=======
Partner's changes
>>>>>>> main

# 3. Resolve by:
# - Keeping both changes (if different features)
# - Combining changes (if same feature)
# - Discussing with partner (if unsure)

# 4. After resolving
git add [resolved-file]
git commit -m "resolve: merge conflict in [file]"
```

## 📋 Communication Rules

### Must Communicate When:
1. **Editing shared files** (teacher dashboard, homepage)
2. **Adding new dependencies** (package.json)
3. **Changing database schema** (migrations)
4. **Modifying authentication flow**
5. **Updating environment variables**

### Communication Channels:
- **GitHub Issues**: Feature requests, bugs
- **Pull Request Comments**: Code reviews
- **Commit Messages**: Clear, descriptive
- **Daily Standup**: Quick sync (optional but recommended)

## 🚫 Never Do:
1. Force push to main
2. Merge without testing
3. Edit partner's active branch
4. Delete branches without checking
5. Commit sensitive data (.env values)

## ✅ Always Do:
1. Pull before starting work
2. Test before pushing
3. Write clear commit messages
4. Document new features
5. Communicate about shared files

## 🔧 Quick Commands Reference

```bash
# See who changed what
git blame src/app/teacher/page.tsx

# Check if partner is working on same file
git log --oneline -5 src/app/teacher/page.tsx

# Stash changes temporarily
git stash
git pull origin main
git stash pop

# Undo last commit (before push)
git reset --soft HEAD~1

# See all branches
git branch -a

# Clean up old branches
git branch -d feature/old-branch
```

## 📊 Current Active Areas

### In Progress (Update Daily)
- **Developer 1**: Real-time monitoring system
- **Rio Allen**: [Update with current work]

### Planned This Week
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Blocked/Waiting
- [ ] Item needing discussion

---

**Last Updated**: September 4, 2025
**Next Review**: Weekly on Mondays