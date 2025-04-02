import mongoose from "mongoose";

// Create a cached connection object
const cached = {
  conn: null,
  promise: null,
};

export const connectDB = async () => {
  // If we already have a connection, return it
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
    // Add these options to ensure fresh data
    readPreference: 'primary',
    readConcern: { level: 'majority' },
  });

  try {
    cached.conn = await cached.promise;
    console.log("Database connected successfully");
    
    // Add event listeners to handle connection issues
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
    
    return cached.conn;
  } catch (error) {
    console.error("Database connection error:", error);
    cached.promise = null; // Reset the promise so we can try again
    throw error;
  }
};

// Helper function to force a fresh database query
export const forceFreshQuery = async (model, query = {}, options = {}) => {
  await connectDB();
  
  // Add options to ensure fresh data
  const queryOptions = {
    ...options,
    lean: true, // Return plain JavaScript objects instead of Mongoose documents
    cache: false, 
  };
  
  return model.find(query, null, queryOptions);
};
