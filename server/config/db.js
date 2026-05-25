const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("⏳  Connecting to MongoDB Atlas...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 4000 // 4 seconds fail-fast timeout for Atlas
    });
    console.log(`✅  MongoDB connected to Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.warn("⚠️   MongoDB Atlas connection failed:", err.message);
    console.log("ℹ️   Starting a local in-memory MongoDB fallback server...");
    
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅  Local In-Memory MongoDB connected: ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error("❌  Local MongoDB fallback failed:", fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
