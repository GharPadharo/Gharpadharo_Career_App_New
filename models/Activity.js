import mongoose from "mongoose";

const ACTIVITY_TYPES = [
  "application_created",
  "application_viewed",
  "application_status_changed",
  "job_created",
  "job_published",
  "job_updated",
  "job_closed",
  "job_reopened",
  "application_deleted",
];

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Activity type is required"],
      enum: {
        values: ACTIVITY_TYPES,
        message: "{VALUE} is not a valid activity type",
      },
      index: true,
    },
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Activity description is required"],
      trim: true,
      maxlength: 1000,
    },
    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      enum: {
        values: ["application", "job"],
        message: "{VALUE} is not a valid entity type",
      },
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // We use explicit createdAt
    versionKey: false,
  }
);

// Compound index for efficient recent activity querying
ActivitySchema.index({ createdAt: -1 });

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
