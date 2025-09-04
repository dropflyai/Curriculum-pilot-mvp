# CodeFly Email System Setup

## Overview
CodeFly now has a comprehensive email system using **Resend** as the email service provider, sending all emails from **info@codeflyai.com**.

## Email Features

### 1. Welcome Emails
- **Student Welcome**: Sent automatically when students sign up
- **Teacher Welcome**: Sent automatically when teachers sign up
- Includes platform overview, mission information, and getting started guidance

### 2. Mission Completion Emails
- Sent when students complete missions
- Shows XP earned, congratulations message
- Notifies about next available mission
- Tracks progress through the Agent Academy curriculum

### 3. System Emails
- Password reset emails
- Account verification (via Supabase)

## Setup Instructions

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Add and verify your domain: `codeflyai.com`
4. Create an API key with send permissions
5. Copy the API key

### 2. Configure Environment Variables
Add to your `.env.local` file:
```bash
RESEND_API_KEY=your-resend-api-key-here
```

### 3. Domain Setup
To send emails from `info@codeflyai.com`:

1. **DNS Configuration** (in your domain provider):
   ```
   TXT @ "v=spf1 include:_spf.resend.com ~all"
   CNAME resend._domainkey resend._domainkey.resend.com
   MX @ mx1.resend.com (priority 10)
   MX @ mx2.resend.com (priority 20)
   ```

2. **Verify Domain** in Resend dashboard
3. **Wait for DNS propagation** (can take up to 24 hours)

## Email Templates

### Student Welcome Email
```
Subject: 🚀 Welcome to CodeFly - Your Coding Adventure Begins!

Content:
- Platform introduction
- Agent Academy mission overview
- Getting started instructions  
- Community statistics
- Support information
```

### Teacher Welcome Email
```
Subject: 🎓 Welcome to CodeFly for Educators!

Content:
- Educator features overview
- Classroom management tools
- Analytics and grading automation
- Teacher dashboard access
```

### Mission Completion Email
```
Subject: 🎉 Mission Complete: [Mission Name] - [XP] XP Earned!

Content:
- Congratulations message
- XP earned display
- Next mission notification
- Progress encouragement
```

## API Endpoints

### Send Email API Route
`POST /api/send-email`

**Mission Completion Email:**
```json
{
  "type": "mission_complete",
  "userName": "Student Name",
  "userEmail": "student@example.com",
  "missionName": "Operation Beacon",
  "xpEarned": 5000,
  "nextMission": "Cipher Command"
}
```

**Password Reset Email:**
```json
{
  "type": "password_reset",
  "userEmail": "user@example.com",
  "resetUrl": "https://codefly.ai/reset-password?token=..."
}
```

## Integration Points

### 1. User Signup (src/lib/auth.ts)
- Welcome emails automatically sent on successful registration
- Different templates for students vs teachers
- Doesn't fail signup if email fails

### 2. Mission Completion (src/lib/mission-progress.ts)
- Congratulations emails sent when missions completed
- Includes XP earned and next mission info
- Doesn't fail mission completion if email fails

### 3. Email Templates (src/lib/email.ts)
- Professional HTML templates with CodeFly branding
- Responsive design for mobile devices
- Consistent styling and messaging

## Email Content Guidelines

### Branding
- **From Name**: CodeFly ✈️
- **From Email**: info@codeflyai.com
- **Reply-To**: info@codeflyai.com
- **Colors**: Blue gradients (#667eea to #764ba2), purple accents
- **Emojis**: Used strategically for engagement

### Messaging
- Encouraging and supportive tone
- Clear action items and next steps
- Community statistics for social proof
- Support contact information

### Design
- Mobile-responsive HTML emails
- Professional styling with gradients
- Clear typography and spacing
- Call-to-action buttons
- Footer with contact info

## Testing

### 1. Test Welcome Emails
1. Sign up as a new student
2. Check email delivery and formatting
3. Verify all links work correctly

### 2. Test Mission Completion
1. Complete a mission in the system
2. Verify email is sent with correct details
3. Check XP amounts and next mission info

### 3. Test Email API
```bash
curl -X POST http://localhost:3003/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mission_complete",
    "userName": "Test User",
    "userEmail": "test@example.com", 
    "missionName": "Operation Beacon",
    "xpEarned": 5000
  }'
```

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check RESEND_API_KEY in environment variables
   - Verify domain is properly configured in Resend
   - Check server logs for error messages

2. **Emails going to spam**
   - Ensure SPF/DKIM records are properly set
   - Verify domain reputation in Resend
   - Check email content for spam triggers

3. **Template formatting issues**
   - Test emails in multiple email clients
   - Verify HTML syntax is valid
   - Check responsive design on mobile

### Logs
- Welcome email logs: Check browser console during signup
- Mission completion logs: Check server console when missions complete
- API logs: Check Next.js server logs for email API calls

## Future Enhancements

1. **Email Analytics**
   - Track open rates and click rates
   - A/B testing for subject lines
   - User engagement metrics

2. **Additional Email Types**
   - Weekly progress reports
   - Achievement notifications
   - Classroom announcements
   - Parent progress updates

3. **Personalization**
   - Dynamic content based on progress
   - Personalized mission recommendations
   - Adaptive sending frequency

## Security

- API keys stored in environment variables only
- No email content stored in logs
- Rate limiting on email API endpoints
- Validation of email addresses before sending

## Support

For email-related issues:
- Technical: Check server logs and Resend dashboard
- Content: Update templates in `src/lib/email.ts`
- Configuration: Verify environment variables and DNS settings
- General: Contact info@codeflyai.com

---

**Note**: Make sure to replace `your-resend-api-key-here` with your actual Resend API key before deploying to production!