import mongoose from "mongoose";

/**
 * RateLimit Mongoose Schema
 * 
 * Persistent rate-limiting storage backed by MongoDB Atlas.
 * - Stores hashed client identifiers with an endpoint-specific scope
 * - Uses native MongoDB TTL index on `expiresAt` to automatically purge expired records
 * - Compatible with Next.js development hot-reloading (guards against OverwriteModelError)
 */
const RateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Rate limit key is required"],
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent OverwriteModelError during Next.js hot-reloads and recompilations
const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

export default RateLimit;
