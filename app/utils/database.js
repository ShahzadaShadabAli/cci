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
  });

  try {
    cached.conn = await cached.promise;
    console.log("Database connected successfully");
    return cached.conn;
  } catch (error) {
    console.error("Database connection error:", error);
    cached.promise = null; // Reset the promise so we can try again
    throw error;
  }
};