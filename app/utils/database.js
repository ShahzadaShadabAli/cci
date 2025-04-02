import mongoose from "mongoose";

// Create a cached connection object
const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If we already have a connection in the global scope, return it
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  // If we don't have a connection but have a promise, wait for it
  if (cached.promise) {
    console.log("Waiting for existing connection promise");
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // If we don't have a connection or a promise, create a new connection
  console.log("Creating new database connection");
  cached.promise = mongoose.connect(process.env.MONGODB_URI, {
    dbName: "cci-programming-club",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable mongoose buffering
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  });

  try {
    cached.conn = await cached.promise;
    console.log("Database connected successfully");
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    return cached.conn;
  } catch (error) {
    console.error("Database connection error:", error);
    cached.promise = null;
    throw error;
  }
};

// Function to ensure fresh data
export const getFreshData = async (model, query = {}, options = {}) => {
  await connectDB();
  
  return model.find(query, null, {
    ...options,
    lean: true,
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    maxTimeMS: 30000, // 30 second timeout
  });
};
