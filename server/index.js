const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Configure Node.js TLS for MongoDB Atlas
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables for production
let serviceAccount;
if (process.env.NODE_ENV === 'production') {
  // For production (Render), use environment variables
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
} else {
  // For development, use local file
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://signpdf-git-master-prathamesh-pawars-projects-de2689ea.vercel.app',
  'https://signpdf-prathamesh-pawars-projects-de2689ea.vercel.app',
  'https://signpdf.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection with proper SSL configuration
const connectDB = async () => {
  const uri = process.env.ATLAS_URI;
  if (!uri) {
    console.error('MongoDB URI not provided in environment variables');
    return;
  }

  const connectionOptions = [
    // Primary configuration - simple and reliable
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    },
    // Fallback configuration with TLS
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    }
  ];

  for (let i = 0; i < connectionOptions.length; i++) {
    try {
      console.log(`Attempting MongoDB connection with configuration ${i + 1}...`);
      await mongoose.connect(uri, connectionOptions[i]);
      console.log('MongoDB database connection established successfully');
      return; // Success, exit the function
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i === connectionOptions.length - 1) {
        console.error('All MongoDB connection attempts failed');
        // Don't exit the process, let it continue without database
      }
    }
  }
};

// Set up connection event listeners
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Connect to database
connectDB();

const pdfsRouter = require('./routes/pdf');
const authRouter = require('./routes/auth');
const signatureRouter = require('./routes/signature');

app.use('/pdfs', pdfsRouter);
app.use('/auth', authRouter);
app.use('/signatures', signatureRouter);
app.use('/uploads', express.static('uploads'));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server only after attempting database connection
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database status: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
