# Vercel Frontend Deployment Setup

This guide will help you set up environment variables in Vercel for your SignPDFLite frontend deployment.

## Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository (`https://github.com/Prathamesh0903/SignPDF.git`)
4. **IMPORTANT**: Configure the project settings correctly:
   - **Framework Preset**: `Vite` (or leave as "Other")
   - **Root Directory**: Leave empty (don't set it)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: Leave empty (will use default)

## Step 2: Set Environment Variables

**IMPORTANT**: You must set these environment variables in your Vercel project dashboard.

### Go to Environment Variables:
1. In your Vercel project dashboard, click on **"Settings"**
2. Click on **"Environment Variables"** in the left sidebar
3. Add each variable one by one:

### Required Environment Variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_API_BASE_URL` | Your Render backend URL | `https://your-backend-name.onrender.com` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyAvmlhgXfzsvGepjAnTg1IrOXbm6p7VDeE` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `154704879141` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:154704879141:web:92c36ec6063ca77c17a9cc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | `G-ZJK2193BG5` |

### How to Add Environment Variables:

1. Click **"Add New"**
2. Enter the **Variable Name** (e.g., `VITE_API_BASE_URL`)
3. Enter the **Value** (e.g., `https://your-backend-name.onrender.com`)
4. Select **Environment**: `Production`, `Preview`, and `Development`
5. Click **"Save"**
6. Repeat for all variables

## Step 3: Get Firebase Configuration

### From Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **"Project settings"**
5. Scroll down to **"Your apps"** section
6. If you don't have a web app, click **"Add app"** → **"Web"**
7. Copy the configuration values:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Map to Vercel Variables:
- `apiKey` → `VITE_FIREBASE_API_KEY`
- `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId` → `VITE_FIREBASE_PROJECT_ID`
- `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `VITE_FIREBASE_APP_ID`
- `measurementId` → `VITE_FIREBASE_MEASUREMENT_ID`

## Step 4: Get Backend URL

### From Render Dashboard:
1. Go to your Render service dashboard
2. Copy the **Service URL** (e.g., `https://your-backend-name.onrender.com`)
3. Set this as `VITE_API_BASE_URL` in Vercel

## Step 5: Redeploy

After setting all environment variables:

1. Go to your Vercel project dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** on your latest deployment
4. Or make a small change to your code and push to GitHub for automatic redeploy

## Troubleshooting

### Common Issues:

1. **"Command cd client && npm install && npm run build exited with 1"**
   - **Solution**: 
     - Make sure you're NOT setting Root Directory in Vercel
     - The build should run from the project root
     - Check that all dependencies are properly listed in `client/package.json`
     - Try redeploying after the recent dependency updates

2. **"Environment Variable references Secret which does not exist"**
   - **Solution**: Remove environment variables from `vercel.json` and set them directly in the Vercel dashboard

3. **Build fails with "Cannot find module"**
   - **Solution**: 
     - Make sure you're NOT setting Root Directory in Vercel
     - The build command should be `cd client && npm install && npm run build`
     - Check that all dependencies are installed

4. **Environment variables not working**
   - **Solution**: 
     - Check that all variables start with `VITE_`
     - Redeploy after adding variables
     - Verify variable names match exactly

5. **API calls failing**
   - **Solution**: 
     - Verify `VITE_API_BASE_URL` is correct
     - Check that your backend is running on Render
     - Ensure CORS is configured properly

### Build Error Debugging:

If you get build errors:

1. **Check the build logs** in Vercel dashboard
2. **Verify Node.js version** (should be 18+)
3. **Check dependencies** in `client/package.json`
4. **Try building locally**:
   ```bash
   cd client
   npm install
   npm run build
   ```

### Environment Variable Checklist:

- [ ] `VITE_API_BASE_URL` - Your Render backend URL
- [ ] `VITE_FIREBASE_API_KEY` - From Firebase config
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - From Firebase config
- [ ] `VITE_FIREBASE_PROJECT_ID` - From Firebase config
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - From Firebase config
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - From Firebase config
- [ ] `VITE_FIREBASE_APP_ID` - From Firebase config
- [ ] `VITE_FIREBASE_MEASUREMENT_ID` - From Firebase config

## Testing Your Deployment

1. Visit your Vercel domain
2. Try to register/login (tests Firebase)
3. Try to upload a PDF (tests backend connection)
4. Check browser console for any errors

## Security Notes

- Environment variables starting with `VITE_` are exposed to the browser
- This is normal for frontend applications
- Keep your backend secrets (like Firebase service account) only in Render
- Never commit sensitive values to your repository 