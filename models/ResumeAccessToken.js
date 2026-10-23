import mongoose from "mongoose";

/**
 * ResumeAccessToken Mongoose Schema
 *
 * Token-brokered resume access model:
 * - Stores ONLY the SHA-256 hash of the bearer token (raw token is NEVER persisted)
 * - Links to Application and Cloudinary public ID
 * - Supports individual link revocation (isRevoked, revokedAt, revokedBy)
 * - Tracks usage analytics (accessCount, lastAccessedAt)
 * - Versioning enables revoking and re-issuing a new token for the same application
 */
const ResumeAccessTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
      unique: true,
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "Application ID reference is required"],
      index: true,
    },
    applicationNumber: {
      type: Number,
      index: true,
    },
    resumePublicId: {
      type: String,
      trim: true,
      default: "",
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedBy: {
      type: String,
      trim: true,
      default: null,
    },
    accessCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index on applicationId + isRevoked for rapid active token queries
ResumeAccessTokenSchema.index({ applicationId: 1, isRevoked: 1 });

const ResumeAccessToken =
  mongoose.models.ResumeAccessToken ||
  mongoose.model("ResumeAccessToken", ResumeAccessTokenSchema);

export default ResumeAccessToken;
