# MEDIBOT Setup Instructions

## 🚀 Quick Start Guide

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd medibot
npm install
```

### 2. Set Up Clerk Authentication
1. Go to [clerk.com](https://clerk.com) and create a new application
2. Copy your keys from the Clerk dashboard
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Set Up Convex Database
1. Go to [convex.dev](https://convex.dev) and create a new project
2. Run: `npx convex dev`
3. Copy your deployment URL to `.env.local`:
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=your_deploy_key_here
```

### 4. Configure Email (Nodemailer + Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: [Google App Passwords](https://support.google.com/accounts/answer/185833)
3. Add to `.env.local`:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Clerk Webhook (Important!)
1. In your Clerk dashboard, go to "Webhooks"
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Copy the webhook secret to your `.env.local`

### 6. Start Development
```bash
npm run dev
```

## 📧 Email Templates Included

The system automatically sends emails for:

### For Doctors:
- **Welcome Email**: When admin adds a new doctor
- **Appointment Request**: When patient books appointment

### For Patients:
- **Appointment Confirmation**: When doctor approves appointment
- **Appointment Rejection**: When doctor rejects appointment

## 🔐 Authentication Flow

1. **Sign Up/Sign In**: Users authenticate via Clerk
2. **Role Selection**: New users choose their role (Patient/Doctor/Admin)
3. **Profile Creation**: User profile created in Convex database
4. **Dashboard Redirect**: Users redirected to role-specific dashboard

## 🏥 Admin Workflow

1. **Add Doctors**: Admin adds doctor details via form
2. **Real-time Email**: Welcome email sent to doctor immediately
3. **Database Storage**: All data stored in Convex (no mock data)
4. **Doctor Activation**: Doctor can access dashboard and manage appointments

## 👨‍⚕️ Doctor Workflow

1. **Receive Welcome Email**: Get credentials and dashboard link
2. **Access Dashboard**: View pending appointment requests
3. **Approve/Reject**: Make decisions on patient requests
4. **Email Notifications**: Patients automatically notified of decisions

## 👤 Patient Workflow

1. **Browse Doctors**: View real doctors from database
2. **Book Appointment**: Select doctor and fill appointment form
3. **Email to Doctor**: Doctor receives immediate notification
4. **Wait for Approval**: Doctor reviews and responds
5. **Email Confirmation**: Patient receives approval/rejection email

## 🛠️ Technical Features

### Real-time Email System
- **Nodemailer**: SMTP email delivery
- **Gmail Integration**: Secure app password authentication
- **Template System**: Professional HTML email templates
- **Error Handling**: Graceful fallbacks and logging

### Clerk + Convex Integration
- **Webhook Sync**: User data synced between Clerk and Convex
- **Role-based Access**: Automatic role-based redirects
- **Type Safety**: Full TypeScript integration
- **Real-time Updates**: Live data synchronization

### Database Operations
- **No Mock Data**: All operations use real Convex database
- **CRUD Operations**: Full create, read, update, delete functionality
- **Relationships**: Proper foreign key relationships
- **Indexing**: Optimized queries with proper indexes

## 🔧 Environment Variables Required

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Convex Database  
NEXT_PUBLIC_CONVEX_URL=https://...
CONVEX_DEPLOY_KEY=...

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Integration (Already configured)
GEMINI_API_KEY=AIzaSyAmJ37gnnNDdUtDahFakcNnNlZsk7Eb9Rw
```

## 🚨 Important Notes

1. **Gmail App Password**: Regular Gmail password won't work. You MUST use an app password.
2. **Webhook URL**: Update webhook URL when deploying to production
3. **Environment Variables**: Never commit `.env.local` to version control
4. **Convex Dev**: Keep `npx convex dev` running during development
5. **Email Testing**: Test email delivery in development before production

## 📱 Testing the System

### Test Admin Flow:
1. Sign up as admin
2. Add a doctor with real email address
3. Check if welcome email is received

### Test Patient Flow:
1. Sign up as patient
2. Book appointment with added doctor
3. Check if doctor receives appointment request email

### Test Doctor Flow:
1. Doctor logs in using credentials from welcome email
2. Approve/reject appointment from dashboard
3. Check if patient receives confirmation/rejection email

## 🎯 Production Deployment

1. **Update Environment Variables**: Use production URLs and keys
2. **Configure Webhook**: Update Clerk webhook URL to production domain
3. **Email Service**: Consider using professional email service for production
4. **Database**: Convex automatically handles production scaling
5. **Monitoring**: Set up error monitoring and logging

## 🆘 Troubleshooting

### Email Not Sending:
- Check Gmail app password is correct
- Verify EMAIL_USER and EMAIL_PASS in `.env.local`
- Check console logs for detailed error messages

### Clerk Integration Issues:
- Verify webhook is properly configured
- Check Clerk dashboard for webhook delivery status
- Ensure webhook secret matches environment variable

### Convex Connection Issues:
- Run `npx convex dev` to ensure database is running
- Check CONVEX_URL is correct in environment variables
- Verify internet connection and Convex service status

## 📞 Support

For technical support:
- Check the console logs for detailed error messages
- Review the Clerk dashboard for authentication issues
- Monitor Convex dashboard for database operations
- Test email delivery using the API test endpoints

---

**🎉 You now have a fully integrated healthcare platform with real-time email notifications and secure authentication!**