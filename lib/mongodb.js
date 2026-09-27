import mongoose from "mongoose";

/**
 * Global cache across hot reloads in development.
 * Prevents multiple connections being created during Next.js fast-refresh / rebuilds.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose with cached connection pooling.
 * 
 * - Lazy connection: ONLY connects when explicitly invoked by server-side logic.
 * - Build-safe: Does not trigger database connection during static generation (next build).
 * - Development-safe: Reuses connection across hot module reloadings.
 */
export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";

  if (!MONGODB_URI) {
    throw new Error(
      "Missing environment variable: MONGODB_URI. Please define MONGODB_URI in your .env.local file."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
