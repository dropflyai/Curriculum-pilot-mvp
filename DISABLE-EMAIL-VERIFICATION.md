# 🔧 How to Disable Email Verification in Supabase

The "Error sending confirmation email" happens because Supabase is trying to send emails but email service isn't configured. Here's how to fix it:

## Quick Fix: Disable Email Confirmation

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/fhopjsgiwvquayyvadaw
2. Log in if needed

### Step 2: Disable Email Confirmation
1. Click **Authentication** in the left sidebar
2. Click **Providers** under Configuration
3. Click **Email** 
4. Find **"Confirm email"** toggle
5. **Turn it OFF** (toggle should be gray, not green)
6. Click **Save**

### Step 3: Clear Any Existing Users (Optional)
If you have test users stuck in unconfirmed state:
1. Go to **Authentication** → **Users**
2. Delete any test users
3. Try signing up again

## Alternative: Auto-Confirm Users (Better for Development)

If you can't find the toggle or want to keep email confirmation on:

### In Supabase SQL Editor:
```sql
-- Auto-confirm all new users (development only!)
CREATE OR REPLACE FUNCTION public.auto_confirm_users()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_confirm_users_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_users();
```

## Testing After Fix

1. Go to http://localhost:3000/auth
2. Click "Sign Up"
3. Enter any test email like: test@example.com
4. Password: test123
5. Should create account and auto-sign in without email verification!

## Production Note
⚠️ **For production**, you'll want to:
- Re-enable email confirmation
- Configure a proper email service (SendGrid, Resend, etc.)
- This provides better security and user verification

But for development and testing, disabling email confirmation is perfectly fine!