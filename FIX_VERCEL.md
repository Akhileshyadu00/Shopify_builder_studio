# 🔧 FIX VERCEL AUTHENTICATION - Add Environment Variables

## ⚠️ PROBLEM IDENTIFIED
Your app is deployed to Vercel at: **https://shopify-builder-studio.vercel.app**

But authentication is failing because **environment variables are not configured** in Vercel.

---

## ✅ SOLUTION - Add Environment Variables to Vercel

### Step 1: Go to Your Vercel Project Settings

1. **Visit**: https://vercel.com/dashboard
2. **Click** on your project: **shopify-builder-studio**
3. **Click** the **"Settings"** tab at the top
4. **Click** **"Environment Variables"** in the left sidebar

### Step 2: Add Environment Variables

Click **"Add New"** and add each variable **one by one**:

#### Variable 1: MONGODB_URI

**Key:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://akhileshyadu001_db_user:TestPass123@cluster0.qtbmgwn.mongodb.net/shopify_builder?retryWrites=true&w=majority
```

**Environment:** Select all three checkboxes (Production, Preview, Development)

Click **"Save"**

---

#### Variable 2: NEXTAUTH_SECRET

**Key:**
```
NEXTAUTH_SECRET
```

**Value:**
```
H4wYsdCj//JpfxjucQWLOd7uuZF6lmSdH+dWd2qYV+w=
```

**Environment:** Select all three checkboxes (Production, Preview, Development)

Click **"Save"**

---

#### Variable 3: NEXTAUTH_URL

**Key:**
```
NEXTAUTH_URL
```

**Value:**
```
https://shopify-builder-studio.vercel.app
```

**Environment:** Select all three checkboxes (Production, Preview, Development)

Click **"Save"**

---

### Step 3: Redeploy Your Application

⚠️ **CRITICAL**: Environment variables only apply to NEW deployments!

**Option A: Redeploy from Vercel Dashboard**
1. Go to the **"Deployments"** tab
2. Find your latest deployment
3. Click the **⋮** (three dots menu) on the right
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm
6. Wait 2-3 minutes for deployment to complete

**Option B: Trigger from GitHub**
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## ⏱️ After Redeployment (Wait 2-3 minutes)

### Test Your Application

1. **Visit**: https://shopify-builder-studio.vercel.app
2. **Click** "Join Studio" to sign up
3. **Create** a new account
4. **Verify** you can log in
5. **Test** creating a custom section at `/upload`

✅ If authentication works, you're all set!

---

## 🔍 Verify Environment Variables Were Added

1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **You should see**:
   - ✅ MONGODB_URI (Value hidden)
   - ✅ NEXTAUTH_SECRET (Value hidden)
   - ✅ NEXTAUTH_URL (Shows: https://shopify-builder-studio.vercel.app)

3. **Each should show**: Production ✓ Preview ✓ Development ✓

---

## 🐛 Still Not Working?

### Check Function Logs

1. **Go to**: Vercel Dashboard → Your Project → Deployments
2. **Click** on the latest deployment
3. **Click** "Functions" tab
4. **Look for** MongoDB connection errors or missing env var errors

### Common Issues:

**Issue**: "MONGODB_URI is missing"
- **Fix**: Make sure you clicked "Save" after adding each variable
- **Fix**: Trigger a new deployment after adding variables

**Issue**: "Authentication failed" 
- **Fix**: Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- **Fix**: Verify password in MONGODB_URI is `TestPass123`

**Issue**: "NEXTAUTH configuration error"
- **Fix**: Verify NEXTAUTH_URL is `https://shopify-builder-studio.vercel.app` (with https://)
- **Fix**: Redeploy after adding NEXTAUTH_URL

---

## 📋 Quick Copy-Paste for Vercel

```
MONGODB_URI
mongodb+srv://akhileshyadu001_db_user:TestPass123@cluster0.qtbmgwn.mongodb.net/shopify_builder?retryWrites=true&w=majority

NEXTAUTH_SECRET
H4wYsdCj//JpfxjucQWLOd7uuZF6lmSdH+dWd2qYV+w=

NEXTAUTH_URL
https://shopify-builder-studio.vercel.app
```

---

## ✅ Success Checklist

After following these steps, verify:

- [ ] All 3 environment variables added in Vercel
- [ ] Each variable applied to Production, Preview, and Development
- [ ] Redeployed the application
- [ ] Waited for deployment to complete (2-3 min)
- [ ] Can access https://shopify-builder-studio.vercel.app
- [ ] Can sign up a new account
- [ ] Can log in successfully
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`

---

## 🎯 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Deployed App**: https://shopify-builder-studio.vercel.app
- **MongoDB Atlas**: https://cloud.mongodb.com

---

**Next Step**: Add the environment variables in Vercel and redeploy!

**Start Here**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
