# Deployment Guide

## Vercel Deployment

### 1. Initial Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

### 2. Environment Variables
In Vercel dashboard, add these environment variables:

**Production:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://fhopjsgiwvquayyvadaw.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob3Bqc2dpd3ZxdWF5eXZhZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTU2MDYsImV4cCI6MjA3MTEzMTYwNn0.f4olgtSkIE9Vr5jQzi8n_DbfEYFNIWfgl3IWL9d14s8`

**Preview/Development:**
- Same values as production for now

### 3. Deploy Commands
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel

# Check deployment status
vercel ls
```

### 4. Custom Domain (Optional)
1. Go to Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 5. Performance Optimizations
- Enable Edge Runtime for API routes
- Configure ISR (Incremental Static Regeneration) for lesson pages
- Enable Vercel Analytics

## Database Considerations
- Supabase is already configured for production
- RLS policies are set for security
- Connection pooling is handled by Supabase

## Post-Deployment Testing
1. Test all major flows: dashboard, lessons, teacher tools
2. Verify environment variables are working
3. Check database connections
4. Test authentication flows (when implemented)