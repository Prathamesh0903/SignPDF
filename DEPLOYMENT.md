# Deployment Guide for SignPDFLite

This guide will help you deploy the SignPDFLite application with the frontend on Vercel and backend on Render.

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - For frontend deployment
3. **Render Account** - For backend deployment
4. **MongoDB Atlas** - For database
5. **Firebase Project** - For authentication

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `signpdflite-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### Step 2: Set Environment Variables

In your Render service dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
ATLAS_URI=your_mongodb_atlas_connection_string
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_firebase_client_x509_cert_url
```

### Step 3: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the values from the JSON to your Render environment variables

### Step 4: Update CORS Settings

After deployment, update the CORS settings in `server/index.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-frontend-domain.vercel.app' // Replace with your Vercel domain
];
```

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables

In your Vercel project dashboard, add these environment variables:

```
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values to your Vercel environment variables

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Set up database access (username/password)
4. **IMPORTANT**: Set up network access (see Step 2)

### Step 2: Configure Network Access (CRITICAL)

**This is the most important step to fix the connection error:**

1. In MongoDB Atlas, go to **Network Access** in the left sidebar
2. Click **"ADD IP ADDRESS"**
3. You have two options:

   **Option A: Allow All IPs (Recommended for deployment)**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` to your IP whitelist
   - This allows connections from any IP address (including Render's servers)

   **Option B: Allow Specific IPs (For development only)**
   - Click **"ADD CURRENT IP ADDRESS"** for your local development
   - For Render deployment, you'll need to add Render's IP ranges

4. Click **"Confirm"**

**Why this is needed:**
- Render's servers have dynamic IP addresses
- MongoDB Atlas blocks connections from non-whitelisted IPs
- Using `0.0.0.0/0` allows connections from anywhere (suitable for web applications)

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. **Important**: Make sure the connection string includes `?retryWrites=true&w=majority` at the end
6. Add to Render environment variables as `ATLAS_URI`

**Example connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Testing the Deployment

### Backend Health Check

Visit: `https://your-backend-domain.onrender.com/health`

Should return: 
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### Frontend Test

1. Visit your Vercel domain
2. Try to register/login
3. Upload a PDF
4. Test PDF signing functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend domain is added to the allowed origins in the backend
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Failures**: Check the build logs in Vercel/Render dashboard
4. **Database Connection**: Verify MongoDB Atlas connection string and network access

### MongoDB Connection Errors

**Error: "Could not connect to any servers in your MongoDB Atlas cluster"**

**Solution:**
1. **Check Network Access**: Go to MongoDB Atlas → Network Access
2. **Add IP Address**: Click "ADD IP ADDRESS" → "ALLOW ACCESS FROM ANYWHERE"
3. **Verify Connection String**: Ensure it includes `?retryWrites=true&w=majority`
4. **Check Environment Variables**: Verify `ATLAS_URI` is set correctly in Render
5. **Wait for Changes**: Network access changes can take a few minutes to propagate

**Step-by-step fix:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your project
3. Click **"Network Access"** in the left sidebar
4. Click **"ADD IP ADDRESS"**
5. Click **"ALLOW ACCESS FROM ANYWHERE"** (adds `0.0.0.0/0`)
6. Click **"Confirm"**
7. Wait 2-3 minutes for changes to take effect
8. Redeploy your Render service

### SSL/TLS Errors

If you encounter SSL errors like `tlsv1 alert internal error`:

1. **Check MongoDB Connection String**: Ensure it includes proper SSL parameters
2. **Network Access**: Make sure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
3. **Connection String Format**: Use the format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
4. **Environment Variables**: Verify `ATLAS_URI` is set correctly in Render
5. **SSL Configuration**: The server is configured to handle SSL properly

### Logs

- **Vercel**: Check deployment logs in the project dashboard
- **Render**: Check service logs in the service dashboard

## Security Notes

1. Never commit sensitive files like `serviceAccountKey.json`
2. Use environment variables for all sensitive data
3. Keep your Firebase and MongoDB credentials secure
4. Regularly rotate your API keys and passwords
5. **Note**: Using `0.0.0.0/0` for MongoDB Atlas is common for web applications but consider more restrictive settings for production

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables are set
3. Test the API endpoints individually
4. Check the browser console for frontend errors
5. For SSL errors, verify MongoDB Atlas network access and connection string format
6. **For connection errors**: Always check MongoDB Atlas Network Access settings first 