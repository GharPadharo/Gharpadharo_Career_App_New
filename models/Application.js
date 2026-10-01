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
    applicationType: {
      type: String,
      enum: {
        values: ["job", "general"],
        message: "{VALUE} is not a valid application type",
      },
      default: "job",
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Job reference is required for job applications",
      ],
      default: null,
    },
    jobSlug: {
      type: String,
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Job slug is required for job applications",
      ],
      trim: true,
      default: null,
    },
    jobTitle: {
      type: String,
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Job title is required for job applications",
      ],
      trim: true,
      default: null,
    },
    jobTeam: {
      type: String,
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Job team is required for job applications",
      ],
      trim: true,
      default: null,
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
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Phone number is required for job applications",
      ],
      trim: true,
      default: "",
    },
    currentJobTitle: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Experience is required for job applications",
      ],
      trim: true,
      default: "",
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
      required: [
        function () {
          return this.applicationType === "job";
        },
        "Cover letter is required for job applications",
      ],
      trim: true,
      default: "",
    },
    opportunityLookingFor: {
      type: String,
      trim: true,
      default: "",
    },
    aboutYourself: {
      type: String,
      trim: true,
      default: "",
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
    applicationNumber: {
      type: Number,
      index: true,
      sparse: true,
      unique: true,
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
ApplicationSchema.index({ applicationType: 1, createdAt: -1 });
ApplicationSchema.index({ applicationType: 1, email: 1 });

if (mongoose.models.Application && !mongoose.models.Application.schema.path("applicationNumber")) {
  delete mongoose.models.Application;
}

// Safe export pattern preventing OverwriteModelError during Next.js hot reload
export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
