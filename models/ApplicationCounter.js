import mongoose from "mongoose";

/**
 * ApplicationCounter Model
 * 
 * Manages an atomic, persistent sequential counter for recruitment application numbers.
 * Shared across both Job and General applications.
 * 
 * Rules:
 * - Counter is NEVER decremented or reset when an application is deleted.
 * - Concurrency-safe via atomic findOneAndUpdate with $inc.
 */
const ApplicationCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: "application",
    },
    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "application_counters",
  }
);

export default mongoose.models.ApplicationCounter ||
  mongoose.model("ApplicationCounter", ApplicationCounterSchema);
