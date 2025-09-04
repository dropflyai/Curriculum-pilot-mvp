#!/bin/bash

# Script to check for potential merge conflicts before pulling changes
echo "🔍 Checking for potential conflicts with feature/dev1/20250904-lesson-monitoring..."
echo ""

# Fetch latest changes
git fetch origin

# Get list of files changed in the feature branch
echo "📁 Files changed in monitoring branch:"
git diff --name-only main...origin/feature/dev1/20250904-lesson-monitoring
echo ""

# Check if any of Rio's working files would conflict
echo "⚠️  Checking your modified files..."
git status --porcelain | while read -r status file; do
    if git diff --name-only main...origin/feature/dev1/20250904-lesson-monitoring | grep -q "$file"; then
        echo "   POTENTIAL CONFLICT: $file"
    fi
done

echo ""
echo "✅ Safe to merge if no conflicts listed above!"
echo ""
echo "Recommended commands:"
echo "  1. Save your work:     git add . && git commit -m 'WIP: current work'"
echo "  2. Merge monitoring:   git merge origin/feature/dev1/20250904-lesson-monitoring"
echo "  3. Or cherry-pick:     git log origin/feature/dev1/20250904-lesson-monitoring --oneline"