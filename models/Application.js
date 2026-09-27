import mongoose from "mongoose";

const ResumeMetadataSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      trim: true,
      default: "",
    },
    publicId: {
      type: String,
      trim: true,
      default: "",
    },
    fileName: {
      type: String,
      trim: true,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
    },
    jobSlug: {
      type: String,
      required: [true, "Job slug is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    jobTeam: {
      type: String,
      required: [true, "Job team is required"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    candidate: {
      type: String,
      required: [true, "Candidate full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    currentJobTitle: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    portfolio: {
      type: String,
      trim: true,
      default: "",
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
    },
    resume: {
      type: ResumeMetadataSchema,
      default: () => ({}),
    },
    consent: {
      type: Boolean,
      required: [true, "Consent is required"],
      validate: {
        validator: (v) => v === true,
        message: "Consent must be confirmed to proceed",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["new", "viewed"],
        message: "{VALUE} is not a valid application status",
      },
      default: "new",
    },
    viewedAt: {
      type: Date,
    },
    viewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes matching architecture specification
ApplicationSchema.index({ jobId: 1, createdAt: -1 });
ApplicationSchema.index({ status: 1, createdAt: -1 });
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ jobId: 1, email: 1 });

// Safe export pattern preventing OverwriteModelError during Next.js hot reload
export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
