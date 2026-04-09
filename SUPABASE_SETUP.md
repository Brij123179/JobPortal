# Supabase Setup Guide for Job Portal

This guide will help you set up Supabase for your Job Listing Portal application.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed on your machine

## 🚀 Step-by-Step Setup

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Settings** → **API**
3. You'll need three pieces of information:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) ⚠️ **Keep this secret!**

### Step 2: Update Your .env File

The `.env` file has been created in the root directory. Update it with your credentials:

```env
SUPABASE_URL=https://gsszclujamfyzndvsdkn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_xvQSGP-tWQ_bddXC3uxgxw_WlEZHMi-
SUPABASE_SERVICE_KEY=your_service_role_key_here  # ⚠️ REPLACE THIS!
```

**Important:** Replace `your_service_role_key_here` with your actual service role key from Supabase.

### Step 3: Create Database Tables

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `server/database/schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL

This will create:
- ✅ `users` table (for job seekers and employers)
- ✅ `jobs` table (for job listings)
- ✅ `applications` table (for job applications)
- ✅ Indexes for better performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating timestamps
- ✅ Storage bucket for resumes

### Step 4: Test Your Connection

Run the connection test script:

```bash
cd server
npm run test-db
```

This will verify:
- ✅ Environment variables are set correctly
- ✅ Connection to Supabase is working
- ✅ All tables exist
- ✅ Row Level Security is configured
- ✅ Storage buckets are created

### Step 5: Start Your Server

If the test passes, start your development server:

```bash
npm run dev
```

Your server should now be running at `http://localhost:5000`

## 🔐 Security Notes

### Environment Variables
- **Never commit `.env` to version control** - It's already in `.gitignore`
- The `SUPABASE_SERVICE_KEY` has admin privileges - keep it secret!
- Only use `SUPABASE_ANON_KEY` in client-side code

### Row Level Security (RLS)
The schema includes RLS policies that:
- Allow users to only view/edit their own profiles
- Allow anyone to view active jobs
- Allow only employers to create/edit their jobs
- Allow job seekers to apply for jobs
- Allow employers to view applications for their jobs

## 📊 Database Schema Overview

### Users Table
Stores both job seekers and employers with role-based fields:
- **Common fields:** email, password, name, role, phone
- **Job Seeker fields:** resume, skills, experience, education, location
- **Employer fields:** company_name, company_description, company_website, etc.

### Jobs Table
Stores job listings created by employers:
- Job details: title, description, responsibilities, qualifications
- Job metadata: type, location, salary range, experience level
- Skills and benefits arrays
- Application tracking

### Applications Table
Tracks job applications:
- Links job seekers to jobs
- Stores application status (pending, reviewed, shortlisted, rejected, accepted)
- Includes cover letter and resume
- Prevents duplicate applications

## 🧪 Testing the API

Once your server is running, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Job Portal API is running",
  "database": "Connected to Supabase"
}
```

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Check that your `.env` file exists in the root directory
- Verify all three variables are set (URL, ANON_KEY, SERVICE_KEY)
- Make sure there are no extra spaces or quotes

### "relation does not exist"
- Run the `schema.sql` file in Supabase SQL Editor
- Check for any errors in the SQL execution
- Verify you're connected to the correct Supabase project

### "JWT expired" or authentication errors
- Check that your service role key is correct
- Verify the key hasn't been rotated in Supabase dashboard
- Make sure you're using the service role key, not the anon key

### Connection timeout
- Check your internet connection
- Verify the Supabase project URL is correct
- Check Supabase status page: https://status.supabase.com

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## 🎯 Next Steps

After successful setup:
1. ✅ Test user registration and login
2. ✅ Create sample job listings
3. ✅ Test job application flow
4. ✅ Configure file upload for resumes
5. ✅ Set up email notifications (optional)

---

**Need help?** Check the troubleshooting section or refer to the Supabase documentation.
