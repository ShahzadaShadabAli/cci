import mongoose from "mongoose";

// No caching - fresh connection every time
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // If already connected, return the active connection
      return mongoose.connection;
    }

    console.log("Establishing new database connection");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "cci-programming-club",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Disable command buffering
      maxPoolSize: 50, // Higher pool size for frequent connections
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Always get fresh data
export const getLiveData = async (model, query = {}, options = {}) => {
  const conn = await connectDB();
  
  // Explicitly set read preference to primary
  return model.find(query, null, {
    ...options,
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    lean: true,
    maxTimeMS: 5000,
  });

