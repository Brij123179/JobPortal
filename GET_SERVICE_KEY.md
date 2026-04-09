# 🔑 How to Get Your Supabase Service Role Key

## Step 1: Go to Supabase Dashboard

Open this URL in your browser:
```
https://supabase.com/dashboard/project/gsszclujamfyzndvsdkn/settings/api
```

## Step 2: Find the Service Role Key

On the API settings page, you'll see several keys:

- ✅ **Project URL** - Already configured
- ✅ **anon public** - Already configured  
- ⚠️ **service_role** - **THIS IS WHAT YOU NEED**

## Step 3: Copy the Service Role Key

1. Look for the section labeled **service_role**
2. Click the **Copy** button or **Reveal** to see the key
3. The key will be a long string starting with `eyJ...`

## Step 4: Update Your .env File

1. Open: `e:\AMDOX\server\.env`
2. Find this line:
   ```
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```
3. Replace `your_supabase_service_role_key` with your actual key:
   ```
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
   ```

## Step 5: Save and Test

1. Save the file
2. Run the test:
   ```bash
   cd server
   npm run test-db
   ```

## ⚠️ IMPORTANT SECURITY WARNING

**The service_role key has FULL ACCESS to your database!**

- ❌ NEVER commit it to version control (already protected by .gitignore)
- ❌ NEVER expose it in client-side code
- ❌ NEVER share it publicly
- ✅ ONLY use it in server-side code
- ✅ Keep it in the .env file

---

**Need help?** Check `SUPABASE_SETUP.md` for detailed troubleshooting.
