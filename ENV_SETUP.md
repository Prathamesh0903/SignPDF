# Environment Variable Setup

## For Local Development

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## For Vercel Deployment

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com`
   - **Environment**: Production, Preview, Development

## Updated API Structure

The API now uses the `/api` prefix:

- **Before**: `http://localhost:5000/pdfs/upload`
- **After**: `http://localhost:5000/api/pdfs/upload`

## Test the Configuration

Add this to any React component to verify:

```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Upload URL:', `${import.meta.env.VITE_API_BASE_URL}/api/pdfs/upload`);
```

## Backend Routes Updated

All backend routes now have the `/api` prefix:
- `/api/pdfs` - PDF operations
- `/api/auth` - Authentication
- `/api/signatures` - Signature operations
- `/api/uploads` - File serving 