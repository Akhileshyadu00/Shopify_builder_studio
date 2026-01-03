# MongoDB Authentication Error - Troubleshooting Guide

## 🔴 Current Error
**"bad auth: authentication failed"**

This error occurs when the MongoDB driver cannot authenticate with your MongoDB Atlas cluster.

## 🔧 Solutions (Try in Order)

### Solution 1: Verify MongoDB Atlas Network Access

1. **Go to MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. Navigate to: **Network Access** (left sidebar)
3. **Add Your IP Address**:
   - Click "Add IP Address"
   - Click "Add Current IP Address" 
   - OR add `0.0.0.0/0` (allows all IPs - less secure but works everywhere)
4. Click "Confirm"

### Solution 2: Check Database User Credentials

1. Go to **Database Access** in MongoDB Atlas
2. Verify the user `akhileshyadu001_db_user` exists
3. **Reset the password**:
   - Click "Edit" on the user
   - Click "Edit Password"
   - Generate a new password (IMPORTANT: Copy it!)
   - Make sure to avoid special characters like `@`, `/`, `:` that need URL encoding

4. **Update your `.env.local` file**:
   ```env
   MONGODB_URI=mongodb+srv://akhileshyadu001_db_user:NEW_PASSWORD_HERE@cluster0.qtbmgwn.mongodb.net/shopify_builder?retryWrites=true&w=majority
   ```

### Solution 3: URL Encode Special Characters in Password

If your password contains special characters, they need to be URL encoded:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `/` becomes `%2F`
- `:` becomes `%3A`

**Example**:
If password is: `My@Pass#123`
Use in connection string: `My%40Pass%23123`

### Solution 4: Verify Database Name

Your connection string should end with `/shopify_builder`:
```
mongodb+srv://username:password@cluster0.qtbmgwn.mongodb.net/shopify_builder?retryWrites=true&w=majority
```

### Solution 5: Test Connection with MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Use the same connection string from `.env.local`
3. If connection fails in Compass, the issue is with MongoDB Atlas settings, not your app

### Solution 6: Restart Development Server

After fixing MongoDB Atlas settings:
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## 🎯 Quick Fix Checklist

- [ ] Network Access allows your IP or `0.0.0.0/0`
- [ ] Database user exists and has correct permissions
- [ ] Password is correctly URL-encoded in connection string
- [ ] Database name is `shopify_builder` in the URI
- [ ] Restarted the dev server after changes

## 🔍 How to Get Detailed Error Info

Check your terminal where `npm run dev` is running. Look for:
```
MongoDB Connection Error (Dev): MongoServerError: bad auth
```

The full error message will tell you exactly what's wrong.

## 💡 Common Issues & Fixes

| Error Message | Solution |
|---------------|----------|
| "Authentication failed" | Wrong username/password |
| "IP not whitelisted" | Add your IP in Network Access |
| "User not found" | Create the database user |
| "Connection timeout" | Check internet or cluster status |

## 🆘 Still Not Working?

1. Create a NEW database user with a simple password (no special chars)
2. Use the connection string generator in Atlas:
   - Go to "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `shopify_builder`

---

**Need immediate help?** Share the exact error message from your terminal for more specific guidance.
