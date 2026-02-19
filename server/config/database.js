const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no external MongoDB URI provided, attempt to use localhost first.
    if (!mongoUri) {
      mongoUri = 'mongodb://localhost:27017/apna-pg';
    }

    try {
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (firstErr) {
      console.warn('⚠️  Primary MongoDB connection failed:', firstErr.message);

      // If no external URI was provided and localhost failed, fall back to in-memory MongoDB for development.
      if (!process.env.MONGODB_URI) {
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongodInstance = await MongoMemoryServer.create();
          const inMemoryUri = mongodInstance.getUri();
          const conn = await mongoose.connect(inMemoryUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log('✅ Connected to in-memory MongoDB (mongodb-memory-server)');
          return conn;
        } catch (memErr) {
          console.error('❌ In-memory MongoDB start failed:', memErr.message);
          throw memErr;
        }
      }

      // No fallback available; rethrow the original error
      throw firstErr;
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n📌 SOLUTIONS:');
    console.error('   Option 1: Install MongoDB locally and start the service');
    console.error('   Option 2: Provide a MongoDB Atlas URI in MONGODB_URI in .env');
    console.error('   Option 3: Keep using the in-memory fallback for local development (no external Mongo needed)\n');
    process.exit(1);
  }
};

process.on('exit', async () => {
  if (mongodInstance) {
    try {
      await mongodInstance.stop();
    } catch (e) {
      // ignore
    }
  }
});

module.exports = connectDB;
