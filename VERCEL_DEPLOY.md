# Vercel Deployment Checklist

## ✅ Pre-Deployment (Complete)
- [x] All code fixes applied
- [x] Build passes locally
- [x] MongoDB connection configured
- [x] Environment variables documented
- [x] GitHub repository updated

## 🚀 Deploy to Vercel

### Step 1: MongoDB Atlas Setup (CRITICAL)
Before deploying to Vercel, ensure MongoDB Atlas is configured:

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com
2. **Network Access**:
   - Go to: Security → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
   - This is required for Vercel serverless functions
   - Click "Confirm"

3. **Database User**:
   - Go to: Security → Database Access
   - Verify user exists: `akhileshyadu001_db_user`
   - Make sure "Read and write to any database" permission is enabled
   - **If authentication fails**: Reset password and use a simple one (no special chars for testing)

4. **Get Connection String**:
   - Go to: Deployment → Database → Connect
   - Click "Connect your application"
   - Copy the connection string
   - Should look like: `mongodb+srv://<username>:<password>@cluster0.qtbmgwn.mongodb.net/shopify_builder`

### Step 2: Deploy to Vercel

1. **Visit Vercel**: https://vercel.com/new
2. **Import Repository**: `Akhileshyadu00/Shopify_builder_studio`
3. **Configure Environment Variables**:

   Click "Environment Variables" and add:

   ```env
   MONGODB_URI
   mongodb+srv://akhileshyadu001_db_user:YOUR_PASSWORD@cluster0.qtbmgwn.mongodb.net/shopify_builder?retryWrites=true&w=majority
   ```

   ```env
   NEXTAUTH_SECRET
   (Generate new with: openssl rand -base64 32)
   ```

   ```env
   NEXTAUTH_URL
   https://your-project-name.vercel.app
   ```

   **Important**: 
   - Replace `YOUR_PASSWORD` with your actual MongoDB password
   - URL-encode special characters in password if any
   - Update `NEXTAUTH_URL` after getting your Vercel domain

4. **Deploy Settings**:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Root Directory: `./` (default)

5. **Click "Deploy"**

### Step 3: Post-Deployment

1. **Update NEXTAUTH_URL**:
   - After deployment, you'll get a URL like `your-project.vercel.app`
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `NEXTAUTH_URL` to: `https://your-project.vercel.app`
   - **Important**: Redeploy after changing this

2. **Test Authentication**:
   - Visit your deployed site
   - Try to sign up with a new account
   - If you get "Authentication service unavailable":
     - Check MongoDB Atlas Network Access
     - Verify all environment variables are set correctly
     - Check Vercel deployment logs for errors

3. **Check Deployment Logs**:
   - Dashboard → Deployments → Latest Deployment
   - Click "View Function Logs"
   - Look for MongoDB connection errors

## 🐛 Troubleshooting

### "Authentication failed" Error
1. Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Check database user credentials
3. Ensure connection string is correct in Vercel env vars

### "NEXTAUTH_URL not set" Error
1. Add `NEXTAUTH_URL` environment variable
2. Must be your full Vercel domain with `https://`
3. Redeploy after adding

### Build Fails
1. Check for TypeScript errors in logs
2. Ensure all dependencies are in package.json
3. Try `npm run build` locally first

### API Routes Timeout
1. MongoDB connection might be slow
2. Consider adding retry logic
3. Check MongoDB Atlas cluster is not paused

## 📊 Success Indicators

When deployment is successful, you should see:
- ✅ Build completes without errors
- ✅ All routes load properly  
- ✅ Can access the homepage
- ✅ Authentication (sign up/login) works
- ✅ Custom sections can be created and saved

## 🔗 Quick Links

- **GitHub Repo**: https://github.com/Akhileshyadu00/Shopify_builder_studio
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com

---

**Important**: The most common deployment issue is MongoDB Atlas network access. Make sure to allow access from anywhere (`0.0.0.0/0`) before deploying to Vercel!
