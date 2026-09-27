import mongoose from "mongoose";

const sanitizeStringArray = (arr) =>
  Array.isArray(arr) ? arr.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean) : [];

const JobSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    team: {
      type: String,
      required: [true, "Team is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: ["Full-time", "Part-time", "Contract", "Internship"],
        message: "{VALUE} is not a valid job type",
      },
      default: "Full-time",
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    workMode: {
      type: String,
      enum: {
        values: ["Remote", "Hybrid", "On-site"],
        message: "{VALUE} is not a valid work mode",
      },
      default: "Remote",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
      set: sanitizeStringArray,
    },
    skills: {
      type: [String],
      default: [],
      set: sanitizeStringArray,
    },
    requirements: {
      type: [String],
      default: [],
      set: sanitizeStringArray,
    },
    tags: {
      type: [String],
      default: [],
      set: sanitizeStringArray,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "draft", "closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes matching architecture specification
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ team: 1 });

// Safe export pattern preventing OverwriteModelError during Next.js hot reload
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
