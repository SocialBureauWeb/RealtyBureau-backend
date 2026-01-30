# RealtyBureau Backend - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Files Updated
- ✅ `vercel.json` - Vercel configuration created
- ✅ `index.js` - Added health check endpoint and serverless export
- ✅ `database/connectDB.js` - Improved MongoDB connection for serverless

### 2. Required Environment Variables in Vercel

You **MUST** set these in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGO_URI` | Your MongoDB connection string | e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NODE_ENV` | `production` | Important for serverless mode |
| `JWT_SECRET` | Your JWT secret key | Same as in your local `.env` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | If using Cloudinary |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | If using Cloudinary |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | If using Cloudinary |

## 🚀 Deployment Steps

### Option 1: Deploy via Git (Recommended)

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add Vercel configuration for deployment"
   git push origin main
   ```

2. **Vercel will auto-deploy** if connected to your Git repository

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔍 Testing Your Deployment

### 1. Test Health Check Endpoint
Visit: `https://realty-bureau-backend.vercel.app/`

Expected response:
```json
{
  "status": "ok",
  "message": "RealtyBureau Backend API is running",
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

### 2. Test Plot Endpoint
Visit: `https://realty-bureau-backend.vercel.app/plot?approved=true&limit=5`

Should return plot data.

### 3. Check Browser Console
Open your frontend at `https://www.realtybureau.in` and check the browser console (F12) for any errors.

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors

**Possible causes:**

1. **CORS Issue**
   - Check if `https://www.realtybureau.in` is in the `allowedOrigins` array in `index.js`
   - Current allowed origins:
     - `https://www.realtybureau.in`
     - `http://localhost:5173`

2. **MongoDB Connection Failed**
   - Verify `MONGO_URI` is set in Vercel environment variables
   - Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or Vercel's IP ranges

3. **Environment Variables Not Set**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set
   - **Redeploy** after adding environment variables

### Issue: 500 Internal Server Error

**Check Vercel logs:**
1. Go to Vercel Dashboard
2. Click on your deployment
3. Click "Functions" tab
4. Check the logs for errors

**Common fixes:**
- Missing environment variables
- MongoDB connection timeout
- Invalid MongoDB URI format

### Issue: CORS Errors in Browser

**Solution:**
Add your frontend domain to `allowedOrigins` in `index.js`:

```javascript
const allowedOrigins = [
  "https://www.realtybureau.in",
  "https://realtybureau.in",  // Add without www too
  "http://localhost:5173",
];
```

Then redeploy.

## 📝 Important Notes

1. **Serverless Functions**: Vercel uses serverless functions, so each request might create a new instance. That's why we cache the MongoDB connection.

2. **Cold Starts**: First request after inactivity might be slow (2-5 seconds). This is normal for serverless.

3. **Function Timeout**: Free tier has 10-second timeout. Upgrade if you need more.

4. **Environment Variables**: After changing environment variables in Vercel, you MUST redeploy for changes to take effect.

## 🔄 Redeployment

To redeploy after making changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Or manually trigger a redeploy in Vercel Dashboard.

## ✨ Success Indicators

Your deployment is successful when:
- ✅ Health check endpoint returns `{"status": "ok"}`
- ✅ No CORS errors in browser console
- ✅ Frontend can fetch data from backend
- ✅ No "Failed to fetch" errors
- ✅ Vercel function logs show no errors

## 🆘 Still Having Issues?

1. Check Vercel function logs
2. Verify all environment variables are set
3. Test endpoints directly in browser
4. Check MongoDB Atlas network access settings
5. Ensure your MongoDB cluster is not paused
