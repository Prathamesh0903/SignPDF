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
4. Set up network access (allow all IPs: 0.0.0.0/0)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add to Render environment variables as `ATLAS_URI`

## Testing the Deployment

### Backend Health Check

Visit: `https://your-backend-domain.onrender.com/health`

Should return: `{"status":"OK","message":"Server is running"}`

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

### Logs

- **Vercel**: Check deployment logs in the project dashboard
- **Render**: Check service logs in the service dashboard

## Security Notes

1. Never commit sensitive files like `serviceAccountKey.json`
2. Use environment variables for all sensitive data
3. Keep your Firebase and MongoDB credentials secure
4. Regularly rotate your API keys and passwords

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables are set
3. Test the API endpoints individually
4. Check the browser console for frontend errors 