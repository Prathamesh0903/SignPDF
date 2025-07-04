require('dotenv').config();
const mongoose = require('mongoose');

// Configure Node.js TLS for MongoDB Atlas
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testConnection() {
  const uri = process.env.ATLAS_URI;
  
  if (!uri) {
    console.error('❌ ATLAS_URI not found in environment variables');
    return;
  }

  console.log('🔍 Testing MongoDB connection...');
  console.log('📡 URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

  const connectionOptions = [
    {
      name: 'Configuration 1 (with TLS)',
      options: {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        tlsInsecure: false,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      }
    },
    {
      name: 'Configuration 2 (without TLS)',
      options: {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
      }
    }
  ];

  for (const config of connectionOptions) {
    try {
      console.log(`\n🔄 Trying ${config.name}...`);
      await mongoose.connect(uri, config.options);
      console.log('✅ MongoDB connection successful!');
      
      // Test a simple operation
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('📊 Available collections:', collections.map(c => c.name));
      
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
      return;
    } catch (error) {
      console.error(`❌ ${config.name} failed:`, error.message);
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }
    }
  }

  console.error('\n💥 All connection attempts failed');
  process.exit(1);
}

testConnection().catch(console.error); 